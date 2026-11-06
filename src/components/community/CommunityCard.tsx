"use client";

import React, { forwardRef } from "react";
import { CommunityDottedGlobe } from "./CommunityDottedGlobe";

export interface CommunityCardProps {
  name?: string;
  showLanyardSlot?: boolean;
  className?: string;
  glow?: boolean;
  isGenerating?: boolean;
}

/**
 * CommunityCard: The single source of truth for the GENZLOG Community Member Pass.
 * Reusable across the generator, homepage preview, and contact page.
 */
export const CommunityCard = forwardRef<HTMLDivElement, CommunityCardProps>(
  function CommunityCard(
    {
      name = "YOUR NAME",
      showLanyardSlot = true,
      className = "",
      glow = true,
      isGenerating = false,
    },
    ref
  ) {
    const displayName = (name && name.trim().length > 0) ? name.trim() : "YOUR NAME";
    const isPlaceholder = displayName === "YOUR NAME";

    // Adaptive font size calculation based on name length to ensure zero clipping
    const getNameClasses = (len: number) => {
      if (len <= 12) return "text-2xl sm:text-3xl tracking-tight leading-tight";
      if (len <= 18) return "text-xl sm:text-2xl tracking-tight leading-snug";
      if (len <= 26) return "text-lg sm:text-xl tracking-normal leading-snug";
      return "text-base sm:text-lg tracking-normal leading-tight";
    };

    return (
      <div
        ref={ref}
        id="genzlog-community-card-root"
        className={`relative w-[280px] sm:w-[320px] md:w-[340px] aspect-[1/1.42] rounded-[26px] sm:rounded-[30px] p-5 sm:p-7 flex flex-col justify-between overflow-hidden select-none transition-all duration-300 ${
          glow
            ? "shadow-[0_24px_60px_-15px_rgba(0,0,0,0.95),0_0_35px_rgba(255,255,255,0.035)] border border-[#282828]"
            : "border border-[#262626]"
        } bg-gradient-to-b from-[#141414] via-[#0E0E0E] to-[#070707] text-white ${className}`}
        style={{
          boxShadow: glow
            ? "0 25px 65px -15px rgba(0,0,0,0.95), 0 0 35px rgba(255,255,255,0.04)"
            : undefined,
        }}
      >
        {/* Subtle background tech grid & vignette */}
        <div className="absolute inset-0 tech-grid opacity-[0.04] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.06)_0%,_transparent_70%)] pointer-events-none" />

        {/* Delicate metallic corner accents (Digital Security Badge aesthetic) */}
        <div className="absolute top-3 left-3 w-2 h-2 border-l border-t border-white/20 pointer-events-none" />
        <div className="absolute top-3 right-3 w-2 h-2 border-r border-t border-white/20 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-2 h-2 border-l border-b border-white/20 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-2 h-2 border-r border-b border-white/20 pointer-events-none" />

        {/* =====================================================================
            TOP SECTION: Lanyard Slot Cutout & Brand Header
            ===================================================================== */}
        <div className="relative z-10 flex flex-col items-center">
          {showLanyardSlot && (
            <div className="w-12 sm:w-14 h-2.5 sm:h-3 rounded-full bg-[#050505] border border-[#282828] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] mb-3 flex items-center justify-center">
              <div className="w-8 h-1 rounded-full bg-[#0B0B0B]" />
            </div>
          )}

          <div className="w-full flex items-center justify-between border-b border-white/[0.07] pb-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-display font-black text-base sm:text-lg tracking-[0.2em] uppercase text-white">
                GENZLOG
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.24em] text-[#888888] uppercase">
              DIGITAL STUDIO
            </span>
          </div>
        </div>

        {/* =====================================================================
            MIDDLE SECTION: 3D Dotted Sphere Illustration
            ===================================================================== */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center py-2">
          <CommunityDottedGlobe size={160} />
        </div>

        {/* =====================================================================
            USER IDENTITY BLOCK: Name & Community Role
            ===================================================================== */}
        <div className="relative z-10 text-center space-y-1.5 px-2">
          <div className="overflow-hidden">
            <h3
              className={`font-display font-extrabold uppercase break-words transition-colors duration-300 ${getNameClasses(
                displayName.length
              )} ${isPlaceholder ? "text-[#888888]" : "text-white"} ${
                isGenerating ? "animate-pulse" : ""
              }`}
            >
              {displayName}
            </h3>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1A1A1A] border border-[#2E2E2E]">
            <span className="w-1 h-1 rounded-full bg-[#FFFFFF]" />
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.22em] text-[#A3A3A3] uppercase font-semibold">
              GENZLOG COMMUNITY MEMBER
            </span>
          </div>
        </div>

        {/* =====================================================================
            FOOTER SECTION: Manifesto Pillars
            ===================================================================== */}
        <div className="relative z-10 pt-3 border-t border-white/[0.08] mt-3">
          <div className="flex items-center justify-between text-[8px] sm:text-[9.5px] font-mono tracking-[0.18em] text-[#737373] uppercase font-medium">
            <span>BUILD</span>
            <span className="text-[#333333]">•</span>
            <span>DESIGN</span>
            <span className="text-[#333333]">•</span>
            <span>CREATE</span>
            <span className="text-[#333333]">•</span>
            <span>SHARE</span>
          </div>
        </div>
      </div>
    );
  }
);
