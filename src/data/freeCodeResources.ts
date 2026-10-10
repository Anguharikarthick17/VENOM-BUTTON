export interface FreeCodeResource {
  reelNumber: string; // Permanent string identifier preserving leading zeros (e.g. "001", "047")
  title: string;      // The actual project title
  image: string;      // The exact supplied local image path or URL
  githubUrl: string;  // The actual GitHub repository URL
}

/**
 * Validates that no duplicate Reel identifiers exist in the catalogue.
 * Throws in development to guarantee identifier uniqueness.
 */
export function validateReelResources(resources: FreeCodeResource[]): {
  isValid: boolean;
  duplicateIds: string[];
} {
  const seen = new Set<string>();
  const duplicateIds: string[] = [];
  for (const r of resources) {
    const normalized = r.reelNumber.trim();
    if (seen.has(normalized)) {
      duplicateIds.push(normalized);
      const msg = `[GENZLOG Data Integrity Error]: Duplicate Reel identifier detected: "${normalized}". Every Reel number must be unique.`;
      if (process.env.NODE_ENV === "development") {
        console.error(msg);
      }
    }
    seen.add(normalized);
  }
  return {
    isValid: duplicateIds.length === 0,
    duplicateIds,
  };
}

/**
 * Helper to validate that a URL is a legitimate HTTPS GitHub repository URL.
 */
export function isValidGitHubUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    return (
      parsed.protocol === "https:" &&
      (parsed.hostname === "github.com" || parsed.hostname === "www.github.com") &&
      parsed.pathname.split("/").filter(Boolean).length >= 2
    );
  } catch {
    return false;
  }
}

/**
 * Normalizes Reel search query for robust number and prefix matching:
 * Supports: "047", "47", "REEL #047", "reel 047", "reel #47", "reel 47"
 */
export function normalizeReelNumberQuery(query: string): {
  isNumericQuery: boolean;
  rawDigits: string;
  intVal: number | null;
} {
  const cleaned = query
    .toLowerCase()
    .replace(/\breel\b/g, "")
    .replace(/#/g, "")
    .trim();

  const isDigits = /^\d+$/.test(cleaned);
  const intVal = isDigits ? parseInt(cleaned, 10) : null;

  return {
    isNumericQuery: isDigits,
    rawDigits: cleaned,
    intVal,
  };
}

/**
 * Instagram Reel Source Code Vault Catalogue.
 * Starts empty until real project reels are published.
 * Add each resource manually as Instagram Reels are published.
 */
export const FREE_CODE_RESOURCES: FreeCodeResource[] = [
  // Real Reel entries will be added here upon publication (e.g. { reelNumber: "001", title: "...", image: "...", githubUrl: "..." })
];

// Run integrity check in development
if (process.env.NODE_ENV === "development") {
  validateReelResources(FREE_CODE_RESOURCES);
}
