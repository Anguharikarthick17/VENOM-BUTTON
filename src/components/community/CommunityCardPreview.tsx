"use client";

import React, { useRef, useState, useCallback } from "react";
import { CommunityCard } from "./CommunityCard";

interface CommunityCardPreviewProps {
  name?: string;
  isGenerating?: boolean;
  className?: string;
}

export function CommunityCardPreview({
  name = "YOUR NAME",
  isGenerating = false,
  className = "",
}: CommunityCardPreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate interactive tilt angles (max +- 10 degrees)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTilt({ x: rotateX, y: rotateY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative flex flex-col items-center justify-center pt-8 pb-4 select-none ${className}`}
      style={{ perspective: 1200 }}
    >
      {/* =====================================================================
          HANGING LANYARD ASSEMBLY
          ===================================================================== */}
      <div className="relative flex flex-col items-center z-20 pointer-events-none -mb-3 sm:-mb-3.5">
        {/* Fabric Lanyard Strap */}
        <div className="relative w-6 sm:w-7 h-20 sm:h-24 bg-gradient-to-r from-[#141414] via-[#202020] to-[#141414] border-x border-[#2A2A2A] shadow-md flex items-center justify-center overflow-hidden">
          {/* Subtle woven fabric texture */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:4px_4px]" />
          {/* Vertical stitching */}
          <div className="absolute left-1 top-0 bottom-0 w-px bg-white/10" />
          <div className="absolute right-1 top-0 bottom-0 w-px bg-white/10" />
          {/* Subtle brand microprint */}
          <span className="text-[7px] font-mono tracking-[0.25em] text-[#555555] uppercase [writing-mode:vertical-rl] opacity-60">
            GENZLOG
          </span>
        </div>

        {/* Metallic Swivel Clip Connector */}
        <div className="w-5 sm:w-6 h-5 rounded-sm bg-gradient-to-b from-[#888888] via-[#ECECEC] to-[#444444] border border-[#222222] shadow-sm flex items-center justify-center -mt-0.5">
          <div className="w-2.5 h-1.5 rounded-full bg-[#1A1A1A] border border-[#777777]" />
        </div>

        {/* Metal Carabiner Loop hooking through the card slot */}
        <div className="w-3.5 sm:w-4 h-5 rounded-full border-2 border-[#BBBBBB] bg-transparent -mt-1 shadow-inner" />
      </div>

      {/* =====================================================================
          HANGING CARD WITH 3D TILT & SWAY
          ===================================================================== */}
      <div
        className={`relative z-10 transform-gpu ${
          !isHovered ? "animate-lanyard-sway" : ""
        }`}
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg)`
            : undefined,
          transition: isHovered
            ? "transform 0.1s ease-out"
            : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          transformOrigin: "top center",
        }}
      >
        <CommunityCard name={name} isGenerating={isGenerating} />
      </div>

      {/* Subtle floor shadow reflection under the floating card */}
      <div className="w-48 sm:w-56 h-4 rounded-[100%] bg-black/60 blur-md mt-4 pointer-events-none" />
    </div>
  );
}
