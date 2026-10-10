"use client";

import React from "react";

export interface SkeletonLoaderProps {
  variant?: "card" | "text" | "form" | "table" | "custom";
  count?: number;
  className?: string;
  children?: React.ReactNode;
}

export function SkeletonLoader({
  variant = "card",
  count = 1,
  className = "",
  children,
}: SkeletonLoaderProps) {
  const items = Array.from({ length: count });

  if (variant === "text") {
    return (
      <div className={`space-y-2.5 animate-pulse motion-reduce:animate-none ${className}`}>
        {items.map((_, i) => (
          <div
            key={i}
            className="h-3.5 bg-[#161616] border border-[#222222] rounded w-full"
            style={{ width: i === count - 1 && count > 1 ? "70%" : "100%" }}
          />
        ))}
      </div>
    );
  }

  if (variant === "form") {
    return (
      <div className={`space-y-4 animate-pulse motion-reduce:animate-none ${className}`}>
        <div className="space-y-2">
          <div className="h-3 bg-[#181818] rounded w-28" />
          <div className="h-11 bg-[#121212] border border-[#262626] rounded-xl w-full" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-[#181818] rounded w-24" />
          <div className="h-11 bg-[#121212] border border-[#262626] rounded-xl w-full" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-[#181818] rounded w-36" />
          <div className="h-28 bg-[#121212] border border-[#262626] rounded-xl w-full" />
        </div>
        <div className="h-12 bg-[#1C1C1C] rounded-xl w-full" />
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div
        className={`bg-[#111111] border border-[#303030] rounded-xl p-4 divide-y divide-[#222222] animate-pulse motion-reduce:animate-none ${className}`}
      >
        <div className="h-8 bg-[#161616] rounded mb-3 w-1/3" />
        {items.map((_, i) => (
          <div key={i} className="py-3 flex items-center justify-between gap-4">
            <div className="h-4 bg-[#181818] rounded w-1/4" />
            <div className="h-4 bg-[#181818] rounded w-1/3" />
            <div className="h-4 bg-[#181818] rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "custom") {
    return (
      <div className={`animate-pulse motion-reduce:animate-none ${className}`}>
        {children}
      </div>
    );
  }

  // Default: Card Skeleton (perfect for Free Code resources or Services)
  return (
    <div
      className={
        count > 1
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          : className
      }
    >
      {items.map((_, i) => (
        <div
          key={i}
          className={`bg-[#111111] border border-[#262626] rounded-2xl p-6 space-y-4 animate-pulse motion-reduce:animate-none ${
            count === 1 ? className : ""
          }`}
        >
          {/* Card preview placeholder */}
          <div className="h-40 bg-[#161616] border border-[#222222] rounded-xl flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border border-[#2E2E2E]" />
          </div>

          <div className="space-y-2 pt-2">
            <div className="h-4 bg-[#181818] rounded w-3/4" />
            <div className="h-3 bg-[#141414] rounded w-full" />
            <div className="h-3 bg-[#141414] rounded w-2/3" />
          </div>

          <div className="flex gap-2 pt-2">
            <div className="h-5 bg-[#161616] rounded w-14" />
            <div className="h-5 bg-[#161616] rounded w-14" />
          </div>

          <div className="pt-3 border-t border-[#1C1C1C] flex justify-between items-center">
            <div className="h-8 bg-[#181818] rounded-lg w-28" />
            <div className="h-8 bg-[#181818] rounded-lg w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}
