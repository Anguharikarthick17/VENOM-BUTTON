import React from "react";
import { Sparkles } from "lucide-react";

export function BrandPhilosophy() {
  return (
    <section className="relative py-16 sm:py-28 lg:py-36 bg-[#050505] border-t border-[#303030] overflow-hidden text-white">
      <div className="relative w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24">
        {/* Top Minimal Header */}
        <div className="flex items-center justify-between border-b border-[#303030] pb-6 mb-12 sm:mb-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#A3A3A3]">
              {"// BRAND PHILOSOPHY"}
            </span>
            <span className="text-[#303030]">•</span>
            <span className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider">
              CORE PRINCIPLES
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-none bg-[#111111] border border-[#303030] text-xs font-mono text-white">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Non-negotiable standards</span>
          </div>
        </div>

        {/* The Three Giant Statements */}
        <div className="flex flex-col gap-14 sm:gap-20 lg:gap-24">
          {/* Statement 01: THINK DIFFERENT. */}
          <div className="relative group">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
              <span className="text-xs font-mono text-[#A3A3A3] tracking-widest order-last md:order-first">
                01 // PERSPECTIVE
              </span>

              <div className="relative inline-block">
                <h3 className="text-3xl min-[360px]:text-4xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-bold font-display uppercase tracking-[-0.04em] leading-[0.9] text-white group-hover:text-[#A3A3A3] transition-colors">
                  THINK DIFFERENT.
                </h3>
              </div>
            </div>
            <p className="mt-4 max-w-xl text-sm sm:text-base text-[#A3A3A3] font-normal leading-relaxed md:ml-auto md:text-right">
              Challenge conventional templates and default assumptions. Question why things are done a certain way before building.
            </p>
          </div>

          {/* Statement 02: BUILD USEFUL. */}
          <div className="relative group border-t border-[#303030] pt-14 sm:pt-20">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
              <span className="text-xs font-mono text-[#A3A3A3] tracking-widest order-last md:order-first">
                02 // UTILITY
              </span>

              <div className="relative inline-block">
                <h3 className="text-3xl min-[360px]:text-4xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-bold font-display uppercase tracking-[-0.04em] leading-[0.9] text-white group-hover:text-[#A3A3A3] transition-colors">
                  BUILD <span className="text-[#A3A3A3]">USEFUL.</span>
                </h3>

                <div className="mt-2 h-0.5 w-full bg-white" />
              </div>
            </div>
            <p className="mt-4 max-w-xl text-sm sm:text-base text-[#A3A3A3] font-normal leading-relaxed md:ml-auto md:text-right">
              No vanity metrics, no empty hype. Everything engineered must save time, earn revenue, or empower users in the real world.
            </p>
          </div>

          {/* Statement 03: KEEP MOVING. */}
          <div className="relative group border-t border-[#303030] pt-14 sm:pt-20">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
              <span className="text-xs font-mono text-[#A3A3A3] tracking-widest order-last md:order-first">
                03 // VELOCITY
              </span>

              <div className="relative inline-block">
                <h3 className="text-3xl min-[360px]:text-4xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-bold font-display uppercase tracking-[-0.04em] leading-[0.9] text-white group-hover:text-[#A3A3A3] transition-colors">
                  KEEP MOVING.
                </h3>
              </div>
            </div>
            <p className="mt-4 max-w-xl text-sm sm:text-base text-[#A3A3A3] font-normal leading-relaxed md:ml-auto md:text-right">
              Technology accelerates constantly. Ship frequently, adapt swiftly, learn from production data, and never stagnate.
            </p>
          </div>
        </div>

        {/* Breathable Baseline */}
        <div className="mt-20 pt-8 border-t border-[#303030] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#A3A3A3]">
          <span>GENZLOG PHILOSOPHY LOG</span>
          <span className="text-white">
            {"// INTENTIONAL BY DESIGN"}
          </span>
          <span>REVISION: 2026.04</span>
        </div>
      </div>
    </section>
  );
}
