"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { CommunityCardPreview } from "./CommunityCardPreview";

export function CommunityContactSection() {
  return (
    <section
      id="contact-community-feature"
      className="py-16 sm:py-24 lg:py-28 bg-[#070707] border-t border-[#292929] relative overflow-hidden text-white"
      aria-label="GENZLOG Community Membership Card"
    >
      {/* Background ambient lighting and fine studio grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.025)_0%,_transparent_75%)] pointer-events-none" />
      <div className="absolute inset-0 tech-grid opacity-[0.05] pointer-events-none" />

      <div className="relative w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24">
        <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl sm:rounded-3xl p-6 sm:p-12 lg:p-16 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* =================================================================
                LEFT COLUMN: Editorial Copy & CTA
                ================================================================= */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <div className="space-y-3.5">
                <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-[#141414] border border-[#2D2D2D] rounded-full text-xs font-mono text-[#A3A3A3]">
                  <Sparkles className="w-3 h-3 text-white" />
                  <span className="text-white font-semibold uppercase tracking-wider">
                    {"// A LITTLE MORE FROM GENZLOG"}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-display leading-[1.02]">
                  YOU&apos;RE MORE THAN A <span className="text-white">VISITOR.</span>
                </h2>

                <p className="text-sm sm:text-base text-[#A3A3A3] max-w-xl leading-relaxed font-normal">
                  Create your own GENZLOG community card. Add your name, generate your digital identity and take a little piece of GENZLOG with you.
                </p>
              </div>

              <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <Link
                  href="/community"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#EAEAEA] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>GET YOUR COMMUNITY CARD</span>
                  <ArrowUpRight className="w-4 h-4 text-[#050505]" />
                </Link>

                <span className="text-xs font-mono text-[#737373] tracking-wide">
                  Free to create. Ready to download.
                </span>
              </div>
            </div>

            {/* =================================================================
                RIGHT COLUMN: Compact Hanging Card Preview
                ================================================================= */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <Link
                href="/community"
                className="group block outline-none focus-visible:ring-2 focus-visible:ring-white rounded-[28px]"
                aria-label="Generate your GENZLOG Community Card"
              >
                <div className="transform scale-[0.88] sm:scale-95 origin-center">
                  <CommunityCardPreview name="YOUR NAME" />
                </div>
                <div className="text-center mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono text-[#888888] tracking-widest uppercase">
                    Personalize Your Pass ↗
                  </span>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
