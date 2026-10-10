import fs from "fs";
import path from "path";

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service: string;
  budget: string;
  timeline: string;
  description: string;
  created_at: string;
  user_agent?: string;
  ip?: string;
}

export interface SaveResult {
  success: boolean;
  provider: "supabase" | "upstash" | "local_dev" | "unconfigured";
  error?: string;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingId?: string;
}

// In-memory duplicate tracker for fast deduplication within serverless warm instances (15-min TTL)
const recentFingerprints = new Map<string, { id: string; timestamp: number }>();
const DEDUP_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function computeFingerprint(email: string, description: string): string {
  const normEmail = email.toLowerCase().trim();
  const normDesc = description.toLowerCase().trim().slice(0, 120);
  return `${normEmail}::${normDesc}`;
}

/**
 * Checks if an identical submission was recently recorded.
 */
export async function checkDuplicateInquiry(
  email: string,
  description: string
): Promise<DuplicateCheckResult> {
  const fp = computeFingerprint(email, description);
  const now = Date.now();

  // 1. Check in-memory warm cache first
  const cached = recentFingerprints.get(fp);
  if (cached && now - cached.timestamp < DEDUP_WINDOW_MS) {
    return { isDuplicate: true, existingId: cached.id };
  }

  // 2. Check Upstash Redis if configured
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (upstashUrl && upstashToken) {
    try {
      const res = await fetch(`${upstashUrl}/get/dedup_${encodeURIComponent(fp)}`, {
        headers: { Authorization: `Bearer ${upstashToken}` },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.result) {
          return { isDuplicate: true, existingId: data.result };
        }
      }
    } catch (err) {
      console.warn("[DB] Upstash duplicate check warning:", err);
    }
  }

  // 3. Check Supabase if configured
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  if (supabaseUrl && supabaseKey) {
    try {
      const fifteenMinsAgo = new Date(now - DEDUP_WINDOW_MS).toISOString();
      const queryUrl = `${supabaseUrl}/rest/v1/inquiries?email=eq.${encodeURIComponent(
        email.trim()
      )}&created_at=gte.${encodeURIComponent(fifteenMinsAgo)}&select=id,description&order=created_at.desc&limit=1`;
      const res = await fetch(queryUrl, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        cache: "no-store",
      });
      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0) {
          const rowDesc = (rows[0].description || "").toLowerCase().trim().slice(0, 120);
          const currentDesc = description.toLowerCase().trim().slice(0, 120);
          if (rowDesc === currentDesc) {
            return { isDuplicate: true, existingId: rows[0].id };
          }
        }
      }
    } catch (err) {
      console.warn("[DB] Supabase duplicate check warning:", err);
    }
  }

  // 4. Check local file in non-Vercel environment
  const isVercel = process.env.VERCEL === "1";
  if (!isVercel || process.env.ALLOW_LOCAL_STORAGE === "true") {
    try {
      const filePath = path.join(process.cwd(), "data", "inquiries.json");
      if (fs.existsSync(filePath)) {
        const items: InquiryRecord[] = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const recent = items.find((item) => {
          const itemFp = computeFingerprint(item.email, item.description);
          const itemAge = now - new Date(item.created_at).getTime();
          return itemFp === fp && itemAge < DEDUP_WINDOW_MS;
        });
        if (recent) {
          return { isDuplicate: true, existingId: recent.id };
        }
      }
    } catch {
      // Local check ignored
    }
  }

  return { isDuplicate: false };
}

/**
 * Saves an inquiry to the persistent hosted database.
 */
export async function saveInquiryToDatabase(record: InquiryRecord): Promise<SaveResult> {
  const fp = computeFingerprint(record.email, record.description);

  // ── Provider 1: Supabase (PostgreSQL) ──
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          id: record.id,
          name: record.name,
          email: record.email,
          company: record.company,
          service: record.service,
          budget: record.budget,
          timeline: record.timeline,
          description: record.description,
          created_at: record.created_at,
          user_agent: record.user_agent,
          ip: record.ip,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("[DB] Supabase insert failed:", res.status, errorText);
        return {
          success: false,
          provider: "supabase",
          error: `Supabase database rejected insert (HTTP ${res.status}): ${errorText}`,
        };
      }

      // Track in warm memory
      recentFingerprints.set(fp, { id: record.id, timestamp: Date.now() });
      return { success: true, provider: "supabase" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[DB] Supabase connection error:", msg);
      return {
        success: false,
        provider: "supabase",
        error: `Supabase network/connection error: ${msg}`,
      };
    }
  }

  // ── Provider 2: Upstash Redis (Serverless KV / List) ──
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      // Pipeline: LPUSH inquiry to list + SETEX dedup key with 15-min expiry
      const pipelineBody = [
        ["LPUSH", "genzlog_inquiries", JSON.stringify(record)],
        ["SETEX", `dedup_${fp}`, 900, record.id],
      ];

      const res = await fetch(`${upstashUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pipelineBody),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("[DB] Upstash pipeline failed:", res.status, errorText);
        return {
          success: false,
          provider: "upstash",
          error: `Upstash Redis rejected insert (HTTP ${res.status}): ${errorText}`,
        };
      }

      // Track in warm memory
      recentFingerprints.set(fp, { id: record.id, timestamp: Date.now() });
      return { success: true, provider: "upstash" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[DB] Upstash connection error:", msg);
      return {
        success: false,
        provider: "upstash",
        error: `Upstash network/connection error: ${msg}`,
      };
    }
  }

  // ── Provider 3: Local File Storage (Permitted in local development & local tests; strictly blocked on Vercel) ──
  const isVercel = process.env.VERCEL === "1";
  if (!isVercel || process.env.ALLOW_LOCAL_STORAGE === "true") {
    try {
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const filePath = path.join(dataDir, "inquiries.json");
      const existing: InquiryRecord[] = fs.existsSync(filePath)
        ? JSON.parse(fs.readFileSync(filePath, "utf8"))
        : [];
      existing.push(record);
      fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf8");

      // Track in warm memory
      recentFingerprints.set(fp, { id: record.id, timestamp: Date.now() });
      return { success: true, provider: "local_dev" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        provider: "local_dev",
        error: `Local filesystem error: ${msg}`,
      };
    }
  }

  // ── In Vercel Production: Hosted DB is Required to prevent silent data loss on ephemeral lambda containers ──
  return {
    success: false,
    provider: "unconfigured",
    error:
      "No persistent hosted database is configured. Please configure SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY or UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN in your Vercel Project Settings.",
  };
}
