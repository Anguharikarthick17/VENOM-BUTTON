import { revalidatePath } from "next/cache";
import { createAdminClient } from "./supabase/admin";
import { createServerSupabaseClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/auth";
import { FreeCodeResource, isValidGitHubUrl } from "@/data/freeCodeResources";

export interface FreeCodeProjectRow {
  id: string;
  reel_number: number;
  slug: string;
  title: string;
  description: string;
  short_description: string | null;
  thumbnail_url: string;
  github_url: string;
  live_demo_url: string | null;
  tech_stack: string[];
  features: string[];
  category: string | null;
  status: "draft" | "published";
  sort_order: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface CreateProjectPayload {
  reel_number: number;
  title: string;
  slug?: string;
  short_description?: string;
  description: string;
  thumbnail_url: string;
  github_url: string;
  live_demo_url?: string | null;
  tech_stack?: string[];
  features?: string[];
  category?: string | null;
  status?: "draft" | "published";
  sort_order?: number;
}

export interface UpdateProjectPayload {
  reel_number?: number;
  title?: string;
  slug?: string;
  short_description?: string;
  description?: string;
  thumbnail_url?: string;
  github_url?: string;
  live_demo_url?: string | null;
  tech_stack?: string[];
  features?: string[];
  category?: string | null;
  status?: "draft" | "published";
  sort_order?: number;
}

/**
 * Baseline Seed Projects (#1 Login Page and #2 Creative Studio)
 * Used as safe bootstrap data when Supabase database is connecting or in local offline dev.
 */
export const SEED_PROJECTS: FreeCodeProjectRow[] = [
  {
    id: "seed-project-001",
    reel_number: 1,
    slug: "login-page",
    title: "GENZLOG Login Page",
    short_description:
      "Premium monochrome authentication experience with an interactive 3D chrome sculpture, responsive animations, and accessible form validation.",
    description:
      "GENZLOG Login Page is a premium monochrome authentication interface featuring an interactive 3D chrome sculpture and responsive animations. Built with React, TypeScript, Three.js, and Tailwind CSS, it combines modern design with accessible form validation and smooth interactions.",
    thumbnail_url: "/projects/login-page/screenshot.png",
    github_url: "https://github.com/Anguharikarthick17/LOGIN-PAGE---1",
    live_demo_url: null,
    tech_stack: ["React", "TypeScript", "Three.js", "Tailwind CSS"],
    features: [
      "Interactive 3D chrome sculpture",
      "Responsive animations",
      "Accessible form validation",
      "Smooth user interactions",
    ],
    category: "Login & Signup",
    status: "published",
    sort_order: 1,
    created_at: "2026-10-11T03:38:20Z",
    updated_at: "2026-10-11T03:47:36Z",
    published_at: "2026-10-11T03:38:20Z",
  },
  {
    id: "seed-project-002",
    reel_number: 2,
    slug: "creative-studio",
    title: "Creative Studio",
    short_description:
      "High-performance monochrome creative studio portfolio with smooth micro-animations, interactive showcase elements, and minimalist typography.",
    description:
      "Creative Studio is a high-performance modern agency portfolio and showcase interface featuring smooth micro-interactions, responsive grid layout, and minimalist monochrome typography. Designed for creative agencies and independent developers.",
    thumbnail_url: "/projects/login-page/screenshot.png",
    github_url: "https://github.com/Anguharikarthick17/creative-studio",
    live_demo_url: null,
    tech_stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    features: [
      "Minimalist monochrome design",
      "Smooth micro-animations",
      "Responsive portfolio showcase",
      "Optimized performance",
    ],
    category: "Landing Page Sections",
    status: "published",
    sort_order: 2,
    created_at: "2026-10-11T04:00:00Z",
    updated_at: "2026-10-11T04:00:00Z",
    published_at: "2026-10-11T04:00:00Z",
  },
];

/**
 * Adapts database row to the existing public FreeCodeResource format.
 */
export function adaptRowToResource(row: FreeCodeProjectRow): FreeCodeResource {
  return {
    id: row.id,
    reelNumber: String(row.reel_number),
    title: row.title,
    image: row.thumbnail_url,
    githubUrl: row.github_url,
    shortDescription: row.short_description || undefined,
    description: row.description,
    technologies: row.tech_stack,
    features: row.features,
    slug: row.slug,
    liveDemoUrl: row.live_demo_url || undefined,
    category: row.category || undefined,
    status: row.status,
  };
}

/**
 * Generates a clean URL-safe slug from a project title.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Validates HTTPS URLs.
 */
export function isValidHttpsUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Revalidates public pages after a project create, update, or publish state change.
 */
function invalidateProjectCache(slug?: string, reelNumber?: number) {
  try {
    revalidatePath("/free-code");
    revalidatePath("/");
    revalidatePath("/sitemap.xml");
    if (slug) {
      revalidatePath(`/free-code/${slug}`);
    }
    if (reelNumber !== undefined) {
      revalidatePath(`/free-code/${reelNumber}`);
    }
  } catch (err) {
    console.warn("[FreeCodeDB] Cache revalidation warning:", err);
  }
}

/**
 * Retrieves all published projects for public display.
 * Strictly filters out drafts. Never exposes unpublished projects publicly.
 */
export async function getPublishedProjects(): Promise<FreeCodeResource[]> {
  if (!isSupabaseConfigured()) {
    const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
    if (isProd) {
      console.error(
        "[FreeCodeDB] Supabase database credentials missing in production environment."
      );
      return [];
    }
    console.warn(
      "[FreeCodeDB] Supabase not configured in local environment. Using initial seed catalogue (#1 and #2)."
    );
    return SEED_PROJECTS.filter((p) => p.status === "published").map(adaptRowToResource);
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("free_code_projects")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("reel_number", { ascending: false });

    if (error) {
      console.error("[FreeCodeDB] Failed to query published projects:", error.message);
      const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
      if (isProd) {
        throw new Error(`Database query error: ${error.message}`);
      }
      return SEED_PROJECTS.filter((p) => p.status === "published").map(adaptRowToResource);
    }

    if (!data || data.length === 0) {
      return [];
    }

    return (data as FreeCodeProjectRow[]).map(adaptRowToResource);
  } catch (err) {
    const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
    console.error("[FreeCodeDB] getPublishedProjects caught error:", err);
    if (isProd) {
      return [];
    }
    return SEED_PROJECTS.filter((p) => p.status === "published").map(adaptRowToResource);
  }
}

/**
 * Retrieves a single published project by its slug or reel number.
 * Returns null if the project does not exist or is currently in draft status.
 */
export async function getPublishedProjectBySlugOrReel(
  identifier: string
): Promise<FreeCodeResource | null> {
  const decoded = decodeURIComponent(identifier).trim();
  const cleanId = decoded.toLowerCase().replace(/^reel-?/, "").replace(/^#/, "").trim();
  const intVal = /^\d+$/.test(cleanId) ? parseInt(cleanId, 10) : null;

  if (!isSupabaseConfigured()) {
    const found = SEED_PROJECTS.find(
      (p) =>
        p.status === "published" &&
        (p.slug.toLowerCase() === decoded.toLowerCase() ||
          p.slug.toLowerCase() === cleanId ||
          (intVal !== null && p.reel_number === intVal))
    );
    return found ? adaptRowToResource(found) : null;
  }

  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase
      .from("free_code_projects")
      .select("*")
      .eq("status", "published");

    if (intVal !== null) {
      query = query.or(`slug.eq.${decoded},slug.eq.${cleanId},reel_number.eq.${intVal}`);
    } else {
      query = query.or(`slug.eq.${decoded},slug.eq.${cleanId}`);
    }

    const { data, error } = await query.limit(1).maybeSingle();

    if (error) {
      console.error("[FreeCodeDB] Failed to retrieve project:", error.message);
      return null;
    }

    if (!data) return null;
    return adaptRowToResource(data as FreeCodeProjectRow);
  } catch (err) {
    console.error("[FreeCodeDB] getPublishedProjectBySlugOrReel error:", err);
    return null;
  }
}

/**
 * Admin: Retrieves all projects (both drafts and published records).
 */
export async function getAllAdminProjects(): Promise<FreeCodeProjectRow[]> {
  if (!isSupabaseConfigured()) {
    console.warn("[FreeCodeDB] Supabase not configured. Returning local seed list.");
    return SEED_PROJECTS;
  }

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("free_code_projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("reel_number", { ascending: false });

  if (error) {
    console.error("[FreeCodeDB] Admin get all projects failed:", error.message);
    throw new Error(`Failed to load admin project list: ${error.message}`);
  }

  return (data || []) as FreeCodeProjectRow[];
}

/**
 * Admin: Retrieves a single project by ID (regardless of draft or published status).
 */
export async function getAdminProjectById(id: string): Promise<FreeCodeProjectRow | null> {
  if (!isSupabaseConfigured()) {
    const found = SEED_PROJECTS.find((p) => p.id === id);
    return found || null;
  }

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("free_code_projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[FreeCodeDB] Admin get project by ID failed:", error.message);
    throw new Error(`Failed to load project: ${error.message}`);
  }

  return (data as FreeCodeProjectRow) || null;
}

/**
 * Admin: Checks if a Reel number is already taken.
 */
export async function isReelNumberTaken(
  reelNumber: number,
  excludeId?: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return SEED_PROJECTS.some(
      (p) => p.reel_number === reelNumber && (!excludeId || p.id !== excludeId)
    );
  }

  const adminClient = createAdminClient();
  let query = adminClient
    .from("free_code_projects")
    .select("id")
    .eq("reel_number", reelNumber);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data } = await query.limit(1);
  return Boolean(data && data.length > 0);
}

/**
 * Admin: Generates an available unique slug.
 */
export async function getUniqueSlug(baseTitle: string, excludeId?: string): Promise<string> {
  const baseSlug = generateSlug(baseTitle) || "project";
  let candidate = baseSlug;
  let counter = 1;

  if (!isSupabaseConfigured()) {
    while (
      SEED_PROJECTS.some(
        (p) => p.slug === candidate && (!excludeId || p.id !== excludeId)
      )
    ) {
      candidate = `${baseSlug}-${counter++}`;
    }
    return candidate;
  }

  const adminClient = createAdminClient();
  while (true) {
    let query = adminClient
      .from("free_code_projects")
      .select("id")
      .eq("slug", candidate);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data } = await query.limit(1);
    if (!data || data.length === 0) {
      return candidate;
    }
    candidate = `${baseSlug}-${counter++}`;
  }
}

/**
 * Admin: Creates a new project.
 */
export async function createProject(
  payload: CreateProjectPayload
): Promise<FreeCodeProjectRow> {
  // 1. Validation
  const reelNum = Number(payload.reel_number);
  if (!Number.isInteger(reelNum) || reelNum <= 0) {
    throw new Error("Reel number must be a positive integer (e.g. 1, 2, 3).");
  }

  if (!payload.title || !payload.title.trim()) {
    throw new Error("Project title is required.");
  }

  if (!payload.description || !payload.description.trim()) {
    throw new Error("Project description is required.");
  }

  if (!payload.thumbnail_url || !payload.thumbnail_url.trim()) {
    throw new Error("Thumbnail image is required.");
  }

  if (!isValidGitHubUrl(payload.github_url)) {
    throw new Error("A valid HTTPS GitHub repository URL is required.");
  }

  if (payload.live_demo_url && !isValidHttpsUrl(payload.live_demo_url)) {
    throw new Error("Live demo URL must be a valid HTTPS URL.");
  }

  // 2. Uniqueness checks
  const reelTaken = await isReelNumberTaken(reelNum);
  if (reelTaken) {
    throw new Error(
      `Reel #${reelNum} already exists in the vault. Every project must have a unique Reel number.`
    );
  }

  const slug = payload.slug?.trim()
    ? generateSlug(payload.slug)
    : await getUniqueSlug(payload.title);

  const status = payload.status || "draft";
  const publishedAt = status === "published" ? new Date().toISOString() : null;

  if (!isSupabaseConfigured()) {
    throw new Error(
      "Cannot create project: Supabase database is not configured. Please supply SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  const adminClient = createAdminClient();
  const insertPayload = {
    reel_number: reelNum,
    slug,
    title: payload.title.trim(),
    short_description: payload.short_description?.trim() || null,
    description: payload.description.trim(),
    thumbnail_url: payload.thumbnail_url.trim(),
    github_url: payload.github_url.trim(),
    live_demo_url: payload.live_demo_url?.trim() || null,
    tech_stack: payload.tech_stack || [],
    features: payload.features || [],
    category: payload.category?.trim() || null,
    status,
    sort_order: payload.sort_order ?? reelNum,
    published_at: publishedAt,
  };

  const { data, error } = await adminClient
    .from("free_code_projects")
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error("[FreeCodeDB] createProject insert error:", error);
    throw new Error(`Failed to save project to database: ${error.message}`);
  }

  invalidateProjectCache(slug, reelNum);
  return data as FreeCodeProjectRow;
}

/**
 * Admin: Updates an existing project.
 */
export async function updateProject(
  id: string,
  payload: UpdateProjectPayload
): Promise<FreeCodeProjectRow> {
  const existing = await getAdminProjectById(id);
  if (!existing) {
    throw new Error(`Project with ID ${id} not found.`);
  }

  const updates: Partial<FreeCodeProjectRow> = {};

  if (payload.reel_number !== undefined) {
    const reelNum = Number(payload.reel_number);
    if (!Number.isInteger(reelNum) || reelNum <= 0) {
      throw new Error("Reel number must be a positive integer.");
    }
    const taken = await isReelNumberTaken(reelNum, id);
    if (taken) {
      throw new Error(`Reel #${reelNum} is already assigned to another project.`);
    }
    updates.reel_number = reelNum;
  }

  if (payload.title !== undefined) {
    if (!payload.title.trim()) throw new Error("Project title cannot be empty.");
    updates.title = payload.title.trim();
  }

  if (payload.slug !== undefined) {
    const cleanSlug = generateSlug(payload.slug);
    if (!cleanSlug) throw new Error("Slug cannot be empty.");
    updates.slug = cleanSlug;
  }

  if (payload.short_description !== undefined) {
    updates.short_description = payload.short_description?.trim() || null;
  }

  if (payload.description !== undefined) {
    if (!payload.description.trim()) throw new Error("Project description cannot be empty.");
    updates.description = payload.description.trim();
  }

  if (payload.thumbnail_url !== undefined) {
    if (!payload.thumbnail_url.trim()) throw new Error("Thumbnail URL cannot be empty.");
    updates.thumbnail_url = payload.thumbnail_url.trim();
  }

  if (payload.github_url !== undefined) {
    if (!isValidGitHubUrl(payload.github_url)) {
      throw new Error("A valid HTTPS GitHub repository URL is required.");
    }
    updates.github_url = payload.github_url.trim();
  }

  if (payload.live_demo_url !== undefined) {
    if (payload.live_demo_url && !isValidHttpsUrl(payload.live_demo_url)) {
      throw new Error("Live demo URL must be a valid HTTPS URL.");
    }
    updates.live_demo_url = payload.live_demo_url?.trim() || null;
  }

  if (payload.tech_stack !== undefined) {
    updates.tech_stack = payload.tech_stack;
  }

  if (payload.features !== undefined) {
    updates.features = payload.features;
  }

  if (payload.category !== undefined) {
    updates.category = payload.category?.trim() || null;
  }

  if (payload.status !== undefined) {
    updates.status = payload.status;
    if (payload.status === "published" && !existing.published_at) {
      updates.published_at = new Date().toISOString();
    }
  }

  if (payload.sort_order !== undefined) {
    updates.sort_order = payload.sort_order;
  }

  updates.updated_at = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    throw new Error("Cannot update: Supabase database is not configured.");
  }

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("free_code_projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[FreeCodeDB] updateProject error:", error);
    throw new Error(`Failed to update project: ${error.message}`);
  }

  invalidateProjectCache(existing.slug, existing.reel_number);
  if (updates.slug && updates.slug !== existing.slug) {
    invalidateProjectCache(updates.slug, updates.reel_number);
  }

  return data as FreeCodeProjectRow;
}

/**
 * Admin: Toggles publish status (Publish or Unpublish).
 */
export async function togglePublishProject(
  id: string,
  publish: boolean
): Promise<FreeCodeProjectRow> {
  const existing = await getAdminProjectById(id);
  if (!existing) {
    throw new Error(`Project with ID ${id} not found.`);
  }

  const status: "draft" | "published" = publish ? "published" : "draft";
  const publishedAt = publish
    ? existing.published_at || new Date().toISOString()
    : existing.published_at;

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("free_code_projects")
    .update({
      status,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[FreeCodeDB] togglePublishProject error:", error);
    throw new Error(`Failed to change publication status: ${error.message}`);
  }

  invalidateProjectCache(existing.slug, existing.reel_number);
  return data as FreeCodeProjectRow;
}

/**
 * Admin: Permanently deletes a project.
 */
export async function deleteProject(id: string): Promise<boolean> {
  const existing = await getAdminProjectById(id);
  if (!existing) {
    throw new Error(`Project with ID ${id} not found.`);
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("free_code_projects").delete().eq("id", id);

  if (error) {
    console.error("[FreeCodeDB] deleteProject error:", error);
    throw new Error(`Failed to delete project: ${error.message}`);
  }

  invalidateProjectCache(existing.slug, existing.reel_number);
  return true;
}

/**
 * Admin: Updates sort order for projects without changing permanent reel numbers.
 */
export async function reorderProjects(
  orders: { id: string; sort_order: number }[]
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }

  const adminClient = createAdminClient();
  for (const item of orders) {
    const { error } = await adminClient
      .from("free_code_projects")
      .update({ sort_order: item.sort_order, updated_at: new Date().toISOString() })
      .eq("id", item.id);

    if (error) {
      console.error("[FreeCodeDB] reorder error for id", item.id, error.message);
    }
  }

  invalidateProjectCache();
  return true;
}
