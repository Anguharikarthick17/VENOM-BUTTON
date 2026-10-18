import { createServerSupabaseClient } from "./server";
import type { User } from "@supabase/supabase-js";

/**
 * Checks whether Supabase environment variables are properly configured.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

  if (!url || (!anonKey && !serviceKey)) {
    return false;
  }

  // Check for dummy template placeholders
  if (url.includes("your-project.supabase.co") || (anonKey && anonKey.startsWith("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."))) {
    return false;
  }

  return true;
}

/**
 * Returns the list of email addresses authorized to access the Admin CMS.
 * Configured via ADMIN_EMAILS environment variable (comma-separated).
 */
export function getAuthorizedAdminEmails(): string[] {
  const envVal = process.env.ADMIN_EMAILS || "";
  return envVal
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Verifies if an email address is authorized for admin access.
 */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const allowed = getAuthorizedAdminEmails();
  // If ADMIN_EMAILS is configured, require an explicit match
  if (allowed.length > 0) {
    return allowed.includes(normalized);
  }
  // If ADMIN_EMAILS is not yet configured, allow any valid authenticated user for initial bootstrap
  return true;
}

export interface AdminSessionResult {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  error?: string;
}

/**
 * Validates the current server session and confirms admin authorization.
 */
export async function getAdminSession(): Promise<AdminSessionResult> {
  if (!isSupabaseConfigured()) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      error: "Supabase credentials are not configured in environment variables.",
    };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        error: error?.message || "No active authenticated session found.",
      };
    }

    const email = user.email || "";
    const authorized = isAdminEmail(email);

    if (!authorized) {
      return {
        isAuthenticated: true,
        isAdmin: false,
        user,
        error: `Account ${email} is not authorized for GENZLOG Admin access.`,
      };
    }

    return {
      isAuthenticated: true,
      isAdmin: true,
      user,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      error: `Authentication verification error: ${msg}`,
    };
  }
}
