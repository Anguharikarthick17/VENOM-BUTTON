import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 sm:py-32 bg-[#050505] border-t border-[#303030] overflow-hidden text-[#FFFFFF]">
      <div className="relative w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#303030]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono text-[#A3A3A3] uppercase tracking-[0.2em]">
                {"// ABOUT GENZLOG"}
              </span>
              <span className="text-[#303030]">•</span>
              <span className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider">
                THE DIGITAL LOG OF GEN Z
              </span>
            </div>

            <div className="relative inline-block">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight uppercase text-white font-display">
                WHO WE ARE.
              </h2>
              <div className="mt-2 h-0.5 w-24 bg-white" />
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-[#111111] border border-[#303030] text-xs font-mono text-white">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Practical &amp; Approachable Engineering</span>
          </div>
        </div>

        {/* Narrative & Philosophy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mt-12 items-center">
          {/* Left Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white font-display leading-snug">
              Building websites for businesses. <br />
              <span className="text-[#A3A3A3]">Sharing frontend code for everyone.</span>
            </h3>

            <p className="text-sm sm:text-base text-[#F5F5F5] leading-relaxed">
              <strong className="text-white">GENZLOG</strong> was born from a straightforward observation: most businesses struggle with slow, generic, cookie-cutter website templates that look dated on mobile and fail to communicate true brand value.
            </p>

            <p className="text-sm sm:text-base text-[#A3A3A3] leading-relaxed">
              We operate with a two-fold mission designed around tangible engineering output:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-6 bg-[#111111] border border-[#303030] rounded-none space-y-2.5">
                <span className="text-xs font-mono text-white font-bold tracking-wider">
                  01 // CLIENT WORK
                </span>
                <h4 className="text-base font-bold text-white uppercase font-display">
                  Website Development
                </h4>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  We build custom, fast, and responsive websites for paying businesses and creators, starting from a clear ₹10,000–₹15,000 scope.
                </p>
              </div>

              <div className="p-6 bg-[#111111] border border-[#303030] rounded-none space-y-2.5">
                <span className="text-xs font-mono text-white font-bold tracking-wider">
                  02 // OPEN SOURCE
                </span>
                <h4 className="text-base font-bold text-white uppercase font-display">
                  Free Frontend Code
                </h4>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  We publish tested UI components, login pages, and navigation bars with real downloadable ZIP archives under the MIT license.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#A3A3A3] leading-relaxed pt-2">
              We don&apos;t invent fake client logos or pretend to be a thousand-person agency. We are an independent, focused digital studio delivering high aesthetic quality, clean modern code, and straightforward communication.
            </p>
          </div>

          {/* Right Brand Logo Display Card - Prominent and Large */}
          <div className="lg:col-span-5 bg-[#111111] border border-[#303030] rounded-none p-5 sm:p-10 lg:p-12 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl relative">
            <div className="relative w-48 min-[360px]:w-60 sm:w-72 max-w-full aspect-[1024/682] flex items-center justify-center">
              <Image
                src="/genzlog-logo-white.png"
                alt="GENZLOG Official Logo"
                fill
                priority
                className="object-contain"
              />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white uppercase font-display tracking-wider">
                GENZLOG
              </h4>
              <p className="text-xs font-mono text-[#A3A3A3] tracking-widest uppercase">
                THE DIGITAL LOG OF GEN Z.
              </p>
            </div>

            <div className="w-full pt-4 border-t border-[#303030] space-y-2.5 text-left text-xs font-mono text-[#A3A3A3]">
              <div className="flex justify-between items-center">
                <span>Model:</span>
                <span className="text-white font-semibold">Studio + Free Resources</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Focus:</span>
                <span className="text-white font-semibold">Web Development &amp; UI</span>
              </div>
              <div className="flex justify-between items-center">
                <span>License:</span>
                <span className="text-white font-bold px-2 py-0.5 bg-[#050505] border border-[#303030] text-[10px]">
                  MIT OPEN SOURCE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
