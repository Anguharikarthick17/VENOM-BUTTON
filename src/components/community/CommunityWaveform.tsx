"use client";

import React from "react";

interface CommunityWaveformProps {
  className?: string;
}

/**
 * CommunityWaveform: Bottom creative studio decorative audio frequency visualizer.
 * Inspired by the Wispr / Scaler reference composition.
 */
export function CommunityWaveform({ className = "" }: CommunityWaveformProps) {
  // 52 frequency bars with deterministic heights
  const bars = [
    12, 18, 26, 38, 22, 14, 30, 48, 62, 40, 24, 18, 32, 54, 70, 85,
    58, 36, 20, 28, 44, 60, 78, 92, 100, 84, 66, 50, 32, 22, 38, 56,
    72, 88, 64, 42, 26, 18, 34, 52, 68, 46, 30, 20, 36, 50, 34, 22,
    16, 28, 20, 14,
  ];

  return (
    <div
      className={`w-full overflow-hidden flex items-end justify-center gap-1 sm:gap-1.5 h-16 sm:h-20 select-none py-2 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {bars.map((height, idx) => {
        // Vary animation duration and delay slightly across the spectrum
        const duration = 1.2 + (idx % 6) * 0.25;
        const delay = (idx % 9) * 0.12;

        return (
          <span
            key={idx}
            className="w-0.5 sm:w-1 rounded-full bg-gradient-to-t from-[#222222] via-[#444444] to-white/40 block transform-gpu"
            style={{
              height: `${Math.max(8, height * 0.75)}%`,
              animation: `waveform-idle ${duration}s ease-in-out infinite alternate ${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
