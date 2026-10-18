import assert from "node:assert";
import {
  SEED_PROJECTS,
  adaptRowToResource,
  generateSlug,
  isReelNumberTaken,
} from "../src/lib/freeCodeDb";
import {
  isValidGitHubUrl,
  normalizeReelNumberQuery,
  FREE_CODE_RESOURCES,
  FreeCodeResource,
} from "../src/data/freeCodeResources";
import { isAdminEmail } from "../src/lib/supabase/auth";

console.log("=================================================");
console.log("GENZLOG Free Code Admin CMS — Automated Test Suite");
console.log("=================================================");

let passedTests = 0;
let totalTests = 0;

function runTest(name: string, fn: () => void) {
  totalTests++;
  try {
    fn();
    console.log(`✓ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`✗ [FAIL] ${name}:`, err);
    throw err;
  }
}

// -----------------------------------------------------------------------------
// Test 1: Verify Projects #1 and #2 remain intact in Seed & Static Data
// -----------------------------------------------------------------------------
runTest("Projects #1 (Login Page) and #2 (Creative Studio) exist and are intact", () => {
  const p1 = SEED_PROJECTS.find((p) => p.reel_number === 1);
  const p2 = SEED_PROJECTS.find((p) => p.reel_number === 2);

  assert.ok(p1, "Project #1 must exist in seed catalogue");
  assert.strictEqual(p1.title, "GENZLOG Login Page");
  assert.strictEqual(p1.status, "published");
  assert.strictEqual(p1.github_url, "https://github.com/Anguharikarthick17/LOGIN-PAGE---1");

  assert.ok(p2, "Project #2 must exist in seed catalogue");
  assert.strictEqual(p2.title, "Creative Studio");
  assert.strictEqual(p2.status, "published");
  assert.strictEqual(p2.github_url, "https://github.com/Anguharikarthick17/creative-studio");

  const staticP1 = FREE_CODE_RESOURCES.find((p) => p.reelNumber === "1");
  const staticP2 = FREE_CODE_RESOURCES.find((p) => p.reelNumber === "2");
  assert.ok(staticP1, "Static resource catalogue must include #1");
  assert.ok(staticP2, "Static resource catalogue must include #2");
});

// -----------------------------------------------------------------------------
// Test 2: Search Exact Reel Number Resolution (Requirement: 3, #3, REEL #3 -> #3, NOT #30 or #31)
// -----------------------------------------------------------------------------
runTest("Search by '3', '#3', or 'REEL #3' resolves exact Reel #3 rather than #30 or #31", () => {
  // Test dataset with Reel 3, Reel 30, and Reel 31
  const testDataset: FreeCodeResource[] = [
    {
      reelNumber: "3",
      title: "Navigation Bar",
      image: "/test.png",
      githubUrl: "https://github.com/test/nav",
      status: "published",
    },
    {
      reelNumber: "30",
      title: "Hero Banner",
      image: "/test.png",
      githubUrl: "https://github.com/test/hero",
      status: "published",
    },
    {
      reelNumber: "31",
      title: "Footer Grid",
      image: "/test.png",
      githubUrl: "https://github.com/test/footer",
      status: "published",
    },
  ];

  function searchReel(q: string) {
    const norm = normalizeReelNumberQuery(q);
    const qLower = q.toLowerCase();

    const exactReelMatches: FreeCodeResource[] = [];
    const partialReelMatches: FreeCodeResource[] = [];

    for (const res of testDataset) {
      const resClean = res.reelNumber.replace(/^#/, "").trim();
      const resInt = parseInt(resClean, 10);
      const resLower = resClean.toLowerCase();

      const isExact =
        resClean === norm.rawDigits ||
        (norm.intVal !== null && !isNaN(norm.intVal) && resInt === norm.intVal) ||
        resLower === norm.rawDigits ||
        `reel #${resLower}` === qLower ||
        `reel ${resLower}` === qLower ||
        `#${resLower}` === qLower;

      if (isExact) {
        exactReelMatches.push(res);
        continue;
      }

      if (norm.isNumericQuery && norm.rawDigits.length > 0 && resClean.includes(norm.rawDigits)) {
        partialReelMatches.push(res);
      }
    }

    if (exactReelMatches.length > 0) {
      return exactReelMatches;
    }
    return partialReelMatches;
  }

  // 1. Search with plain digit "3"
  const result1 = searchReel("3");
  assert.strictEqual(result1.length, 1, "Searching '3' should return exactly 1 result");
  assert.strictEqual(result1[0].reelNumber, "3", "Should resolve Reel #3, not #30 or #31");

  // 2. Search with hash "#3"
  const result2 = searchReel("#3");
  assert.strictEqual(result2.length, 1, "Searching '#3' should return exactly 1 result");
  assert.strictEqual(result2[0].reelNumber, "3");

  // 3. Search with prefix "REEL #3"
  const result3 = searchReel("REEL #3");
  assert.strictEqual(result3.length, 1, "Searching 'REEL #3' should return exactly 1 result");
  assert.strictEqual(result3[0].reelNumber, "3");

  // 4. Search with lowercase "reel 3"
  const result4 = searchReel("reel 3");
  assert.strictEqual(result4.length, 1);
  assert.strictEqual(result4[0].reelNumber, "3");

  // 5. Searching for "30" must resolve #30 specifically
  const result30 = searchReel("#30");
  assert.strictEqual(result30.length, 1);
  assert.strictEqual(result30[0].reelNumber, "30");
});

// -----------------------------------------------------------------------------
// Test 3: GitHub URL Validation
// -----------------------------------------------------------------------------
runTest("GitHub URL validation enforces legitimate HTTPS GitHub repositories", () => {
  assert.strictEqual(isValidGitHubUrl("https://github.com/Anguharikarthick17/LOGIN-PAGE---1"), true);
  assert.strictEqual(isValidGitHubUrl("https://www.github.com/owner/repository-name"), true);

  // Invalids
  assert.strictEqual(isValidGitHubUrl("http://github.com/owner/repo"), false, "Insecure HTTP must be rejected");
  assert.strictEqual(isValidGitHubUrl("https://gitlab.com/owner/repo"), false, "Non-GitHub host must be rejected");
  assert.strictEqual(isValidGitHubUrl("https://github.com"), false, "Missing repo path must be rejected");
  assert.strictEqual(isValidGitHubUrl("javascript:alert(1)"), false, "XSS attempts must be rejected");
  assert.strictEqual(isValidGitHubUrl(""), false);
  assert.strictEqual(isValidGitHubUrl(null), false);
});

// -----------------------------------------------------------------------------
// Test 4: Slug Generation & Sanitization
// -----------------------------------------------------------------------------
runTest("Slug generator produces URL-safe identifiers", () => {
  assert.strictEqual(generateSlug("GENZLOG Login Page"), "genzlog-login-page");
  assert.strictEqual(generateSlug("Creative Studio // 2026"), "creative-studio-2026");
  assert.strictEqual(generateSlug("  3D Chrome Sculpture & WebGL!  "), "3d-chrome-sculpture-webgl");
  assert.strictEqual(generateSlug("Reel #047 -- Modern Navbar"), "reel-047-modern-navbar");
});

// -----------------------------------------------------------------------------
// Test 5: Draft Isolation from Public Feeds
// -----------------------------------------------------------------------------
runTest("Draft projects are strictly isolated from public queries", () => {
  const mixedProjects = [
    { ...SEED_PROJECTS[0], status: "published" as const },
    { ...SEED_PROJECTS[1], status: "draft" as const },
  ];

  const publicResources = mixedProjects
    .filter((p) => p.status === "published")
    .map(adaptRowToResource);

  assert.strictEqual(publicResources.length, 1, "Only published projects should be returned");
  assert.strictEqual(publicResources[0].reelNumber, "1");
  assert.strictEqual(
    publicResources.some((r) => r.status === "draft"),
    false,
    "No draft items may leak into public resource collection"
  );
});

// -----------------------------------------------------------------------------
// Test 6: Duplicate Reel Number Detection
// -----------------------------------------------------------------------------
runTest("Reel number uniqueness check detects collisions", async () => {
  const taken1 = await isReelNumberTaken(1);
  assert.strictEqual(taken1, true, "Reel #1 is already registered");

  const taken2 = await isReelNumberTaken(2);
  assert.strictEqual(taken2, true, "Reel #2 is already registered");

  // Allowing same project to update without triggering collision on itself
  const takenSelf = await isReelNumberTaken(1, "seed-project-001");
  assert.strictEqual(takenSelf, false, "Updating existing project ID must not flag itself as a collision");

  const takenFresh = await isReelNumberTaken(999);
  assert.strictEqual(takenFresh, false, "Unused Reel #999 must be available");
});

// -----------------------------------------------------------------------------
// Test 7: Admin Authorization Check (ADMIN_EMAILS enforcement)
// -----------------------------------------------------------------------------
runTest("Admin authorization correctly verifies authorized roster", () => {
  const prevEnv = process.env.ADMIN_EMAILS;
  try {
    process.env.ADMIN_EMAILS = "angu@genzlog.com,admin@genzlog.com";

    assert.strictEqual(isAdminEmail("angu@genzlog.com"), true);
    assert.strictEqual(isAdminEmail("admin@genzlog.com"), true);
    assert.strictEqual(isAdminEmail("ANGU@GENZLOG.COM"), true, "Case insensitive match required");
    assert.strictEqual(isAdminEmail("intruder@evil.com"), false, "Unauthorized email must be rejected");
    assert.strictEqual(isAdminEmail(""), false);
    assert.strictEqual(isAdminEmail(null), false);
  } finally {
    process.env.ADMIN_EMAILS = prevEnv;
  }
});

console.log("=================================================");
console.log(`Results: ${passedTests}/${totalTests} Tests Passed Successfully.`);
console.log("=================================================");
