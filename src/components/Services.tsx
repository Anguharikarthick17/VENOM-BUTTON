"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import {
  COMPLETE_SERVICES,
  SERVICE_GROUPS,
  ServiceCategory,
  ServiceGroup,
} from "@/data/services";

export type { ServiceCategory, ServiceGroup };
export const servicesData = COMPLETE_SERVICES;

/**
 * Renders service titles with designated neon keyword highlighting.
 * Preserves semantic structure while ensuring remaining title text is crisp white.
 */
function renderHighlightedTitle(title: string, keyword?: string, color?: string) {
  if (!keyword || !color || !title.includes(keyword)) {
    return <span className="text-white">{title}</span>;
  }
  const parts = title.split(keyword);
  return (
    <span className="text-white">
      {parts[0]}
      <span
        style={{ color }}
        className="font-bold tracking-tight inline-block"
      >
        {keyword}
      </span>
      {parts.slice(1).join(keyword)}
    </span>
  );
}

/**
 * Individual Floating 3D Service Panel Component
 * Implements subtle mouse-responsive tilt (max ~3deg) with smooth elevation and depth.
 */
function Floating3DPanel({ group }: { group: ServiceGroup }) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current || !cardRef.current) return;
    if (typeof window !== "undefined" && (!window.matchMedia("(hover: hover)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      return;
    }

    const rect = panelRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = `rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateZ(8px)`;
      }
      rafRef.current = null;
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (cardRef.current) {
      cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
    }
  };

  React.useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={panelRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full select-none"
      style={{ perspective: "1000px" }}
    >
      {/* Subtle Monochrome Ambient Glow */}
      <div
        className={`absolute -inset-1.5 bg-white/[0.03] rounded-3xl blur-xl pointer-events-none transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* 3D Tilted Card Container */}
      <div
        ref={cardRef}
        className="relative w-full h-full bg-[#080808] border border-[#222222] hover:border-[#383838] rounded-2xl p-4 sm:p-6 lg:p-7 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:shadow-[0_25px_65px_rgba(0,0,0,0.95)] transition-all duration-300 motion-reduce:transform-none"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Top Header & Group Spec Bar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A] text-[10px] font-mono">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="text-white font-bold tracking-wider uppercase">
                {group.letter}
              </span>
            </div>
            <span className="px-2 py-0.5 bg-[#121212] border border-[#262626] rounded text-[#A3A3A3] font-medium">
              {group.priceRange}
            </span>
          </div>

          {/* Group Title & Tagline */}
          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl xl:text-2xl font-bold uppercase tracking-tight text-white font-display">
              {group.title}
            </h3>
            <p className="text-xs text-[#888888] leading-relaxed line-clamp-2">
              {group.tagline}
            </p>
          </div>

          {/* All 3 Services Listed Prominently with Visible Starting Prices */}
          <div className="space-y-3 pt-2">
            {group.services.map((service) => (
              <Link
                key={service.id}
                href={`/contact?service=${encodeURIComponent(service.title)}`}
                className="p-3.5 bg-[#0D0D0D] hover:bg-[#121212] border border-[#1E1E1E] hover:border-[#3A3A3A] rounded-xl transition-all flex flex-col justify-between space-y-2 group/item focus:outline-none focus:ring-1 focus:ring-white block"
                title={`Enquire about ${service.title}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs font-bold text-[#666666] group-hover/item:text-white transition-colors">
                      {service.num}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-white leading-snug group-hover/item:text-white transition-colors">
                      {renderHighlightedTitle(service.title, service.highlightKeyword, service.highlightColor)}
                    </h4>
                  </div>
                </div>

                <p className="text-[11.5px] text-[#888888] group-hover/item:text-[#A3A3A3] leading-relaxed line-clamp-2 transition-colors">
                  {service.summary}
                </p>

                {/* Visible Price and Action Pill */}
                <div className="pt-2 border-t border-[#181818] flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[10px] font-mono text-[#666666] uppercase">From</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-tight">
                      ₹{service.startingPrice.toLocaleString("en-IN")}+
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#161616] group-hover/item:bg-white text-white group-hover/item:text-[#050505] rounded-md border border-[#2A2A2A] group-hover/item:border-white text-[10.5px] font-mono font-bold uppercase tracking-wider transition-all shadow-sm">
                    <span>Discuss</span>
                    <ArrowUpRight className="w-3 h-3 transition-transform group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Panel Footer */}
        <div className="pt-4 mt-4 border-t border-[#181818] flex items-center justify-between text-[10px] font-mono text-[#666666]">
          <span>3 VERIFIED SPECS</span>
          <span className="text-[#888888]">GENZLOG STUDIO</span>
        </div>
      </div>
    </div>
  );
}

export function Services() {
  return (
    <section id="services-3d-installation" className="relative w-full text-white">
      {/* Installation Subtitle & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#222222]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#888888] font-semibold">
              {"// 3D SERVICE INSTALLATION"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white font-display">
            FOUR INTERACTIVE SERVICE PANELS
          </h2>
        </div>

        <span className="text-xs font-mono text-[#777777]">
          [ 12 SERVICES • DIRECT INQUIRY • PERSPECTIVE DEPTH ]
        </span>
      </div>

      {/* Four Wide Panels Displayed Horizontally in One Row on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
        {SERVICE_GROUPS.map((group) => (
          <Floating3DPanel key={group.id} group={group} />
        ))}
      </div>
    </section>
  );
}
