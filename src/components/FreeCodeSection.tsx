"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import {
  FREE_CODE_RESOURCES,
} from "@/data/freeCodeResources";
import { ReelResourceCard } from "@/components/free-code/ReelResourceCard";
import { SOCIAL_URLS } from "@/data/socialLinks";

export function FreeCodeSection() {
  const featuredResources = FREE_CODE_RESOURCES.slice(0, 3);
  const hasItems = featuredResources.length > 0;

  return (
    <section id="free-code" className="relative py-16 sm:py-24 lg:py-32 bg-[#050505] border-t border-[#303030] overflow-hidden text-white">
      {/* Background Tech Grid */}
      <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />

      <div className="relative w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#303030]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-white font-semibold">
                {"// 05 OPEN SOURCE VAULT"}
              </span>
              <span className="text-[#666666]">•</span>
              <span className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider">
                NUMBERED REEL SOURCE REPOSITORIES
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display uppercase tracking-tight text-white">
              FREE CODE <span className="text-white">VAULT.</span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#A3A3A3] leading-relaxed">
              Every Instagram Reel project comes with verified open-source frontend code.
              Search by permanent Reel number or explore the complete repository library on GitHub.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/free-code"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              <span>EXPLORE REEL VAULT</span>
              <ArrowUpRight className="w-4 h-4 text-[#050505]" />
            </Link>
          </div>
        </div>

        {/* Content Display */}
        {hasItems ? (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredResources.map((res) => (
              <ReelResourceCard key={res.reelNumber} resource={res} />
            ))}
          </div>
        ) : (
          <div className="mt-12 bg-[#0C0C0C] border border-[#2B2B2B] rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#262626] rounded-full text-xs font-mono text-[#A3A3A3]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
                <span className="text-white font-semibold uppercase tracking-wider">
                  NUMBERED REEL SOURCE VAULT
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold uppercase text-white font-display">
                SOURCE CODE ARCHIVES ACCRUE WITH EVERY REEL
              </h3>
              <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
                As new Instagram Reels are released, their corresponding frontend code will be published directly to our numbered vault with permanent Reel numbers and verified GitHub repositories.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href={SOCIAL_URLS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-white text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all flex items-center gap-2 shadow-sm"
              >
                <span>FOLLOW @GENZLOG</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#050505]" />
              </a>

              <Link
                href="/free-code"
                className="px-5 py-3 bg-[#141414] hover:bg-[#1E1E1E] text-white border border-[#303030] hover:border-white font-mono text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2"
              >
                <span>VIEW VAULT</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
