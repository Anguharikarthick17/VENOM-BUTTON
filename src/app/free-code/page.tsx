"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FREE_CODE_RESOURCES,
  FreeCodeResource,
  isValidGitHubUrl,
  normalizeReelNumberQuery,
} from "@/data/freeCodeResources";
import { Search, ArrowUpRight, SearchX, ExternalLink, Film } from "lucide-react";
import { ErrorBoundary } from "@/components/states/ErrorBoundary";
import { SOCIAL_URLS } from "@/data/socialLinks";

/**
 * Individual Numbered Reel Vault Resource Card
 * Adheres strictly to the requirement: Exactly 4 items per card:
 * 1. The exact project image supplied
 * 2. Permanent Reel number (e.g. REEL #047)
 * 3. Project title
 * 4. VIEW SOURCE ON GITHUB ↗ button
 */
function ReelResourceCard({ resource }: { resource: FreeCodeResource }) {
  const [imgError, setImgError] = useState<boolean>(false);
  const isGithubValid = isValidGitHubUrl(resource.githubUrl);

  return (
    <article className="bg-[#0D0D0D] border border-[#222222] hover:border-[#444444] rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-lg">
      {/* 1. Exact Project Image Supplied */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#141414] border-b border-[#222222]">
        {resource.image && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resource.image}
            alt={resource.title}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#666666] bg-radial from-[#1A1A1A] to-[#0A0A0A]">
            <Film className="w-8 h-8 text-[#444444] mb-2" />
            <span className="text-[11px] font-mono tracking-wider text-[#888888] uppercase">
              #{resource.reelNumber.replace(/^#/, "")} PREVIEW
            </span>
          </div>
        )}
      </div>

      {/* Body Area */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <div className="space-y-3">
          {/* 2. Permanent Reel Number */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#141414] border border-[#2A2A2A] text-xs font-mono font-bold text-[#22D3EE] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
              <span>#{resource.reelNumber.replace(/^#/, "")}</span>
            </span>
          </div>

          {/* 3. Project Title */}
          <h2 className="text-lg sm:text-xl font-bold font-display uppercase tracking-tight text-white group-hover:text-white transition-colors leading-snug">
            {resource.title}
          </h2>
        </div>

        {/* 4. VIEW SOURCE ON GITHUB ↗ Button */}
        <div className="pt-4 border-t border-[#1C1C1C]">
          {isGithubValid ? (
            <a
              href={resource.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-white text-[#050505] hover:bg-[#F5F5F5] font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.12)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#050505]"
              title={`View repository for #${resource.reelNumber.replace(/^#/, "")} on GitHub`}
            >
              <span>VIEW SOURCE ON GITHUB</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#050505]" />
            </a>
          ) : (
            <span
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#141414] text-[#777777] font-mono font-bold text-xs uppercase tracking-wider rounded-xl border border-[#222222] select-none"
              title="Repository link pending publication"
            >
              <span>REPOSITORY PENDING</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function FreeCodePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return FREE_CODE_RESOURCES;

    const norm = normalizeReelNumberQuery(q);
    const qLower = q.toLowerCase();

    const exactReelMatches: FreeCodeResource[] = [];
    const partialReelMatches: FreeCodeResource[] = [];
    const titleMatches: { resource: FreeCodeResource; score: number }[] = [];

    for (const res of FREE_CODE_RESOURCES) {
      const resClean = res.reelNumber.replace(/^#/, "").trim();
      const resInt = parseInt(resClean, 10);
      const resLower = resClean.toLowerCase();
      const titleLower = res.title.toLowerCase();

      // Exact number matching: supports "1", "001", "#1", "REEL #1", "reel 1", "reel #1"
      const isExactReelMatch =
        resClean === norm.rawDigits ||
        (norm.intVal !== null && !isNaN(norm.intVal) && resInt === norm.intVal) ||
        resLower === norm.rawDigits ||
        `reel #${resLower}` === qLower ||
        `reel ${resLower}` === qLower ||
        `#${resLower}` === qLower;

      if (isExactReelMatch) {
        exactReelMatches.push(res);
        continue;
      }

      // Partial Reel number match (e.g. searching "1" matches "10" or "11", but at lower priority than exact "1")
      const isPartialReelMatch =
        norm.isNumericQuery &&
        norm.rawDigits.length > 0 &&
        resClean.includes(norm.rawDigits);

      if (isPartialReelMatch) {
        partialReelMatches.push(res);
        continue;
      }

      // Title matching with relevance ranking (prefix matches score higher)
      if (titleLower.includes(qLower)) {
        const score = titleLower.startsWith(qLower) ? 2 : 1;
        titleMatches.push({ resource: res, score });
      }
    }

    titleMatches.sort((a, b) => b.score - a.score);
    return [
      ...exactReelMatches,
      ...partialReelMatches,
      ...titleMatches.map((m) => m.resource),
    ];
  }, [searchQuery]);

  const hasCatalogItems = FREE_CODE_RESOURCES.length > 0;

  return (
    <main className="pt-12 sm:pt-16 pb-24 bg-[#050505] min-h-screen text-white">
      {/* Header Hero */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24 mb-12 sm:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#303030]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono text-white uppercase tracking-[0.2em] font-semibold">
                {"// NUMBERED SOURCE VAULT"}
              </span>
              <span className="text-[#666666]">•</span>
              <span className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider">
                INSTAGRAM REEL CODE ARCHIVE
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight uppercase text-white font-display">
              FREE CODE <span className="text-white">VAULT</span>
            </h1>
            <p className="text-sm sm:text-base text-[#A3A3A3] max-w-2xl mt-3 leading-relaxed">
              Open source frontend code repositories accompanying our Instagram Reels. Search by permanent Reel number (e.g. 047 or REEL #047) or project name to access tested source code directly on GitHub.
            </p>
          </div>

          {/* Quick Counter & External Links */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="px-4 py-2 bg-[#111111] border border-[#303030] rounded-xl text-xs font-mono text-[#A3A3A3]">
              <strong className="text-white font-bold">{FREE_CODE_RESOURCES.length} Published</strong> Projects
            </div>
            <Link
              href="/contact"
              className="px-4 py-2 bg-white text-[#050505] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              <span>Commission Custom Code</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#050505]" />
            </Link>
          </div>
        </div>

        {/* Search Toolbar */}
        <div className="mt-8">
          <div className="relative max-w-3xl">
            <Search className="w-4 h-4 text-[#888888] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Reel number or project name..."
              className="w-full bg-[#111111] border border-[#303030] rounded-xl pl-11 pr-20 py-3.5 text-base sm:text-sm text-white placeholder-[#666666] outline-none focus:border-white transition-all focus:ring-1 focus:ring-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#A3A3A3] hover:text-white cursor-pointer px-2 py-1 rounded bg-[#1A1A1A] border border-[#2E2E2E]"
              >
                Clear
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="mt-3 text-xs font-mono text-[#888888] flex items-center gap-2">
              <span>Showing {filteredResources.length} match{filteredResources.length === 1 ? "" : "es"} for &quot;{searchQuery}&quot;</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24">
        {!hasCatalogItems ? (
          /* Honest Empty State when catalogue is initially empty */
          <div className="bg-[#0C0C0C] border border-[#2B2B2B] rounded-2xl p-8 sm:p-14 text-center max-w-2xl mx-auto space-y-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#161616] border border-[#2E2E2E] flex items-center justify-center text-white">
              <Film className="w-7 h-7 text-[#22D3EE]" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#2A2A2A] rounded-full text-xs font-mono text-[#A3A3A3]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
                <span className="text-white font-semibold uppercase tracking-wider">
                  INSTAGRAM REEL CODE VAULT
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-tight text-white">
                PROJECT REPOSITORIES LAUNCHING HERE
              </h2>
              <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed max-w-lg mx-auto">
                Source code repositories will be published here alongside each new Instagram Reel.
                Each project includes its permanent Reel number (e.g. <span className="text-white font-mono font-bold">REEL #001</span>), project artwork, and a direct link to the verified GitHub repository.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={SOCIAL_URLS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all shadow-sm"
              >
                <span>FOLLOW ON INSTAGRAM</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#050505]" />
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#161616] hover:bg-[#202020] text-white border border-[#303030] hover:border-white font-mono text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                <span>REQUEST CUSTOM CODE</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
              </Link>
            </div>
          </div>
        ) : filteredResources.length === 0 ? (
          /* Search Empty State */
          <div className="bg-[#0C0C0C] border border-[#2B2B2B] rounded-2xl p-8 sm:p-14 text-center max-w-xl mx-auto space-y-5">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#161616] border border-[#2E2E2E] flex items-center justify-center text-white">
              <SearchX className="w-6 h-6 text-[#888888]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-white">
                NO REEL PROJECTS FOUND
              </h3>
              <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
                No published project matched &quot;{searchQuery}&quot;. Try searching with numeric Reel digits (e.g. &quot;047&quot; or &quot;47&quot;) or a general project title.
              </p>
            </div>

            <button
              onClick={() => setSearchQuery("")}
              className="px-5 py-2.5 bg-white text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all cursor-pointer"
            >
              CLEAR SEARCH
            </button>
          </div>
        ) : (
          /* Filtered Numbered Reel Resource Grid */
          <ErrorBoundary
            title="Reel Vault Error"
            message="An unexpected issue occurred while rendering the repository list. You can retry loading this view."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredResources.map((res) => (
                <ReelResourceCard key={res.reelNumber} resource={res} />
              ))}
            </div>
          </ErrorBoundary>
        )}
      </div>

      {/* Value Proposition Banner */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24 mt-20">
        <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-mono text-white uppercase tracking-wider font-semibold">
              {"// BESPOKE DIGITAL ENGINEERING"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase text-white font-display">
              Need a tailored website or custom AI application?
            </h2>
            <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
              We engineer custom business websites, automated AI workflows, and bespoke digital platforms starting from ₹10,000–₹15,000.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3.5 bg-white text-[#050505] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all shrink-0 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            <span>Request A Project Quote</span>
            <ArrowUpRight className="w-4 h-4 text-[#050505]" />
          </Link>
        </div>
      </div>
    </main>
  );
}
