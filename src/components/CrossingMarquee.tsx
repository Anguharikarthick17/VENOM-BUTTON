"use client";

import React from "react";

// Curated GENZLOG marquee phrases from specification
const WHITE_RIBBON_ITEMS = [
  "CREATIVE TECHNOLOGY",
  "DIGITAL EXPERIENCES",
  "BUILT FOR THE WEB",
  "DESIGN WITH PURPOSE",
  "IDEAS INTO REALITY",
  "GENZLOG DIGITAL STUDIO",
];

const BLACK_RIBBON_ITEMS = [
  "BUILD SOMETHING DIFFERENT",
  "WEBSITE DEVELOPMENT",
  "INTERACTIVE EXPERIENCES",
  "FREE CODE FOR CREATORS",
  "MODERN WEB ENGINEERING",
  "GENZLOG — DIGITAL STUDIO",
];

// Repeat 4x per half to ensure infinite runway across all ultra-wide displays
const REPEATED_WHITE = [
  ...WHITE_RIBBON_ITEMS,
  ...WHITE_RIBBON_ITEMS,
  ...WHITE_RIBBON_ITEMS,
];

const REPEATED_BLACK = [
  ...BLACK_RIBBON_ITEMS,
  ...BLACK_RIBBON_ITEMS,
  ...BLACK_RIBBON_ITEMS,
];

export function CrossingMarquee() {
  return (
    <section
      id="crossing-marquee"
      className="relative w-full overflow-hidden bg-transparent py-24 sm:py-32 md:py-40 lg:py-44 select-none"
      aria-label="GENZLOG Creative Studio Showcase"
    >
      {/* Background ambient lighting and fine studio grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.035)_0%,_transparent_75%)] pointer-events-none" />
      <div className="absolute inset-0 tech-grid opacity-[0.06] pointer-events-none" />

      {/* Subtle edge fade masks to ensure cinematic integration */}
      <div className="absolute top-0 left-0 bottom-0 w-16 sm:w-28 md:w-40 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent z-25 pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-28 md:w-40 bg-gradient-to-l from-[#050505] via-[#050505]/70 to-transparent z-25 pointer-events-none" />

      {/* =========================================================================
          RIBBON A — WHITE RIBBON (Bottom Layer at intersection, Angle: -6.5deg)
          Scrolls: Left to Right
          ========================================================================= */}
      <div
        className="absolute top-1/2 left-1/2 w-[160vw] max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-[6deg] sm:-rotate-[6.5deg] z-10 bg-white text-[#050505] border-y-2 border-[#050505] shadow-[0_10px_30px_rgba(0,0,0,0.5)] h-12 sm:h-16 md:h-20 flex items-center overflow-hidden transform-gpu"
      >
        <div className="animate-crossing-ltr">
          {/* Track 1 */}
          <div className="flex items-center shrink-0">
            {REPEATED_WHITE.map((item, idx) => (
              <div key={`w1-${idx}`} className="flex items-center">
                <span className="font-display font-extrabold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#050505] text-xs sm:text-base md:text-xl lg:text-2xl whitespace-nowrap px-4 sm:px-6 md:px-8">
                  {item}
                </span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#050505] shrink-0" />
              </div>
            ))}
          </div>
          {/* Track 2 (Duplicate for seamless loop) */}
          <div className="flex items-center shrink-0" aria-hidden="true">
            {REPEATED_WHITE.map((item, idx) => (
              <div key={`w2-${idx}`} className="flex items-center">
                <span className="font-display font-extrabold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#050505] text-xs sm:text-base md:text-xl lg:text-2xl whitespace-nowrap px-4 sm:px-6 md:px-8">
                  {item}
                </span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#050505] shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIBBON B — BLACK RIBBON (Top Layer at intersection, Angle: +6.5deg)
          Scrolls: Right to Left
          ========================================================================= */}
      <div
        className="absolute top-1/2 left-1/2 w-[160vw] max-w-none -translate-x-1/2 -translate-y-1/2 rotate-[6deg] sm:rotate-[6.5deg] z-20 bg-[#111111] text-white border-y-2 border-[#303030] shadow-[0_16px_40px_rgba(0,0,0,0.9),0_2px_4px_rgba(255,255,255,0.05)] h-12 sm:h-16 md:h-20 flex items-center overflow-hidden transform-gpu"
      >
        <div className="animate-crossing-rtl">
          {/* Track 1 */}
          <div className="flex items-center shrink-0">
            {REPEATED_BLACK.map((item, idx) => (
              <div key={`b1-${idx}`} className="flex items-center">
                <span className="font-display font-extrabold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-white text-xs sm:text-base md:text-xl lg:text-2xl whitespace-nowrap px-4 sm:px-6 md:px-8">
                  {item}
                </span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white shrink-0" />
              </div>
            ))}
          </div>
          {/* Track 2 (Duplicate for seamless loop) */}
          <div className="flex items-center shrink-0" aria-hidden="true">
            {REPEATED_BLACK.map((item, idx) => (
              <div key={`b2-${idx}`} className="flex items-center">
                <span className="font-display font-extrabold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-white text-xs sm:text-base md:text-xl lg:text-2xl whitespace-nowrap px-4 sm:px-6 md:px-8">
                  {item}
                </span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          CENTRAL CIRCULAR BADGE (Z-30, Exact Intersection Point)
          Features:
          - White circular disc with black border & offset shadow
          - Rotating circular typography track: "GENZLOG · BUILD SOMETHING DIFFERENT · GENZLOG ·"
          - Center pulsing audio/waveform frequency bars
          - Interactive hover state (subtle scale)
          ========================================================================= */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
        title="GENZLOG — Built for the Web"
      >
        <div className="relative w-24 h-24 sm:w-30 sm:h-30 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full bg-white text-[#050505] border-[3px] sm:border-4 border-[#050505] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_4px_12px_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-105 transform-gpu">
          
          {/* Rotating Circular Text SVG */}
          <div className="absolute inset-0 w-full h-full animate-badge-spin-slow pointer-events-none select-none">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              aria-hidden="true"
            >
              <defs>
                <path
                  id="genzlog-badge-path"
                  d="M 100, 100 m -68, 0 a 68,68 0 1,1 136,0 a 68,68 0 1,1 -136,0"
                  fill="none"
                />
              </defs>
              <text className="text-[9.5px] font-mono font-bold tracking-[0.22em] fill-[#050505] uppercase">
                <textPath href="#genzlog-badge-path" startOffset="0%">
                  GENZLOG · BUILD SOMETHING DIFFERENT · GENZLOG ·
                </textPath>
              </text>
            </svg>
          </div>

          {/* Central Core: Audio Frequency Waveform Visualizer */}
          <div className="relative w-12 h-12 sm:w-15 sm:h-15 md:w-18 md:h-18 rounded-full bg-white border-2 border-[#050505]/40 flex items-center justify-center gap-1 sm:gap-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
            <span
              className="w-1 sm:w-1.5 rounded-full bg-[#050505] animate-wave-1 block"
              style={{ minHeight: "8px" }}
            />
            <span
              className="w-1 sm:w-1.5 rounded-full bg-[#050505] animate-wave-2 block"
              style={{ minHeight: "14px" }}
            />
            <span
              className="w-1 sm:w-1.5 rounded-full bg-[#050505] animate-wave-3 block"
              style={{ minHeight: "20px" }}
            />
            <span
              className="w-1 sm:w-1.5 rounded-full bg-[#050505] animate-wave-4 block"
              style={{ minHeight: "12px" }}
            />
            <span
              className="w-1 sm:w-1.5 rounded-full bg-[#050505] animate-wave-5 block"
              style={{ minHeight: "8px" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
