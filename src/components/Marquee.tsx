"use client";

import React from "react";

export function Marquee() {
  const items = [
    "BUSINESS WEBSITES",
    "LANDING PAGES",
    "WEB APPLICATIONS",
    "UI/UX DESIGN",
    "FREE CODE",
    "OPEN SOURCE UI",
  ];

  return (
    <div className="relative w-full overflow-hidden border-y border-[#303030] bg-[#111111] py-4 select-none">
      {/* Subtle edge fade overlays */}
      <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center whitespace-nowrap">
        {[...Array(4)].map((_, loopIdx) => (
          <div key={loopIdx} className="flex items-center">
            {items.map((item, idx) => (
              <div
                key={`${loopIdx}-${idx}`}
                className="flex items-center group cursor-default"
              >
                <span className="text-sm sm:text-base md:text-lg font-bold tracking-[0.25em] uppercase text-[#A3A3A3] group-hover:text-white transition-colors duration-200 px-6 sm:px-8">
                  {item}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
