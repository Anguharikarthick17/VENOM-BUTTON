"use client";

import React from "react";
import Link from "next/link";
import { Home, Code2, Layers, Mail } from "lucide-react";

export interface NotFoundStateProps {
  title?: string;
  description?: string;
  showQuickLinks?: boolean;
  className?: string;
}

export function NotFoundState({
  title = "PAGE NOT FOUND",
  description = "The requested URL or resource does not exist, has been moved, or is temporarily unavailable.",
  showQuickLinks = true,
  className = "",
}: NotFoundStateProps) {
  return (
    <div
      role="region"
      aria-label="Not Found Page"
      className={`min-h-[75vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-16 text-white ${className}`}
    >
      <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
        {/* Monochromatic Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#111111] border border-[#303030] rounded-full text-xs font-mono text-[#A3A3A3]">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-white font-bold tracking-widest uppercase">ERROR 404 // ROUTE NOT FOUND</span>
        </div>

        {/* Big Stylized Typography */}
        <div className="space-y-4">
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black font-display tracking-tighter text-white select-none">
            404
          </h1>
          <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white font-display">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-[#A3A3A3] max-w-lg mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Primary Navigation Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#050505] font-bold text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            <Home className="w-4 h-4 text-[#050505]" />
            <span>Return to Home</span>
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#141414] hover:bg-[#1E1E1E] text-white border border-[#303030] hover:border-white font-medium text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-white" />
            <span>Explore Services</span>
          </Link>
        </div>

        {/* Quick Route Shortcuts */}
        {showQuickLinks && (
          <div className="pt-8 border-t border-[#222222] max-w-lg mx-auto">
            <span className="text-[11px] font-mono text-[#666666] uppercase tracking-wider block mb-4">
              POPULAR DESTINATIONS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <Link
                href="/free-code"
                className="p-3 bg-[#111111] hover:bg-[#161616] border border-[#262626] hover:border-white/40 rounded-xl flex items-center justify-center gap-2 text-white transition-colors"
              >
                <Code2 className="w-3.5 h-3.5 text-[#888888]" />
                <span>Free Code</span>
              </Link>
              <Link
                href="/pricing"
                className="p-3 bg-[#111111] hover:bg-[#161616] border border-[#262626] hover:border-white/40 rounded-xl flex items-center justify-center gap-2 text-white transition-colors"
              >
                <span>Pricing</span>
              </Link>
              <Link
                href="/contact"
                className="p-3 bg-[#111111] hover:bg-[#161616] border border-[#262626] hover:border-white/40 rounded-xl flex items-center justify-center gap-2 text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#888888]" />
                <span>Contact</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
