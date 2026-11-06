"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { CommunityCardPreview } from "./CommunityCardPreview";

export function CommunityHomeSection() {
  return (
    <section
      id="community-section"
      className="py-20 sm:py-28 lg:py-36 bg-[#050505] border-t border-[#303030] relative overflow-hidden text-white"
      aria-label="GENZLOG Community Membership"
    >
      {/* Background ambient lighting and subtle tech grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 tech-grid opacity-[0.06] pointer-events-none" />

      <div className="relative w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ===================================================================
              LEFT COLUMN: Editorial Copy & Primary CTA
              =================================================================== */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#111111] border border-[#2D2D2D] rounded-full text-xs font-mono text-[#A3A3A3]">
                <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                <span className="text-white font-semibold uppercase tracking-wider">
                  {"// GENZLOG COMMUNITY"}
                </span>
                <span className="text-[#555555]">•</span>
                <span>DIGITAL IDENTITY</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-display leading-[0.98]">
                BE PART OF <span className="text-white">SOMETHING DIFFERENT.</span>
              </h2>

              <p className="text-base sm:text-lg text-[#A3A3A3] max-w-xl leading-relaxed font-normal">
                Every creative journey starts somewhere. Create your own GENZLOG digital identity card and be part of our creative community.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <Link
                href="/community"
                className="inline-flex items-center gap-2.5 px-7 py-4 bg-white text-[#050505] font-mono font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl hover:bg-[#EAEAEA] transition-all shadow-[0_0_25px_rgba(255,255,255,0.18)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>CREATE YOUR COMMUNITY CARD</span>
                <ArrowUpRight className="w-4 h-4 text-[#050505]" />
              </Link>

              <span className="text-xs sm:text-sm font-mono text-[#737373] tracking-wide">
                Your name. Your card. Your identity.
              </span>
            </div>

            {/* Feature tags */}
            <div className="pt-6 border-t border-[#222222] grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <span className="block text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                  100% FREE
                </span>
                <span className="text-[10px] text-[#737373] font-mono">No login required</span>
              </div>
              <div>
                <span className="block text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                  INSTANT PNG
                </span>
                <span className="text-[10px] text-[#737373] font-mono">High-res export</span>
              </div>
              <div>
                <span className="block text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                  CREATOR PASS
                </span>
                <span className="text-[10px] text-[#737373] font-mono">Digital collectable</span>
              </div>
            </div>
          </div>

          {/* ===================================================================
              RIGHT COLUMN: Hanging Identity Card Preview
              =================================================================== */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <Link
              href="/community"
              className="group block outline-none focus-visible:ring-2 focus-visible:ring-white rounded-[32px]"
              aria-label="Preview GENZLOG Community Card and generate yours"
            >
              <CommunityCardPreview name="YOUR NAME" />
              <div className="text-center mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-[11px] font-mono text-[#888888] tracking-widest uppercase">
                  Click to personalize &amp; download ↗
                </span>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
