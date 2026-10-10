"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ShiningButton } from "@/components/ui/ShiningButton";

/**
 * GENZLOG CINEMATIC TYPOGRAPHY HERO
 *
 * Full-width cinematic composition inspired by the Sidd Ahmed creative direction:
 * - Enormous animated background typography spanning the hero width
 * - The original official GENZLOG logo as the central focal subject
 * - Centered primary and secondary CTA buttons directly beneath the logo
 * - Understated studio metadata and pillars arranged around the centerpiece
 * - Subtle desktop pointer-responsive parallax
 * - Respects prefers-reduced-motion and preserves the Space Warp background
 * - Strictly monochrome (white, neutral grey, and deep black)
 */

const BRAND_PHRASES = [
  "BUILD DIGITAL",
  "CREATE WHAT'S NEXT",
  "IDEAS INTO REALITY",
];

export function Hero() {
  const [activePhraseIndex, setActivePhraseIndex] = useState<number>(0);
  const containerRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const rafId = useRef<number | null>(null);

  // Phrase cycling timer (smooth 5.5s loop with reduced motion check)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const interval = setInterval(() => {
      setActivePhraseIndex((prev) => (prev + 1) % BRAND_PHRASES.length);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  // Highly optimized cursor parallax: updates DOM styles directly via RAF, avoiding continuous React re-renders
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (headlineRef.current) {
        headlineRef.current.style.transform = `translate3d(${x * 20}px, ${y * 16}px, 0)`;
      }
      if (logoRef.current) {
        logoRef.current.style.transform = `translate3d(${x * -14}px, ${y * -10}px, 0)`;
      }
      rafId.current = null;
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    if (headlineRef.current) {
      headlineRef.current.style.transform = "translate3d(0, 0, 0)";
    }
    if (logoRef.current) {
      logoRef.current.style.transform = "translate3d(0, 0, 0)";
    }
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[calc(100svh-80px)] flex flex-col justify-between items-center py-10 sm:py-14 lg:py-16 px-4 sm:px-10 lg:px-16 overflow-hidden bg-transparent text-[#FFFFFF] select-none"
    >
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 tech-grid pointer-events-none opacity-20" />

      {/* Subtle Central Vignette Glow ensuring contrast for central centerpiece */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#050505]/50 to-[#050505]/90 pointer-events-none" />


      {/* 2. THE MAIN CINEMATIC CENTERPIECE (Background Typography + Central Logo) */}
      <div className="relative w-full max-w-[1720px] mx-auto my-auto flex flex-col items-center justify-center min-h-[360px] sm:min-h-[460px] lg:min-h-[520px]">
        
        {/* ENORMOUS BACKGROUND TYPOGRAPHY (Layered Behind Logo) */}
        <div
          ref={headlineRef}
          className="hero-headline absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0 motion-reduce:transform-none"
          style={{
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {BRAND_PHRASES.map((phrase, idx) => {
            const isActive = activePhraseIndex === idx;
            return (
              <span
                key={phrase}
                className={`absolute inset-0 flex items-center justify-center text-center font-black uppercase font-display tracking-[-0.04em] whitespace-nowrap leading-none select-none motion-reduce:transition-none motion-reduce:transform-none ${
                  idx === 0 ? "motion-reduce:opacity-100" : "motion-reduce:hidden"
                } transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-[0.98] translate-y-4 pointer-events-none"
                }`}
                style={{
                  fontSize: "clamp(1.75rem, 8.5vw, 9.5rem)",
                  color: "#282828",
                  textShadow: "0 0 60px rgba(255,255,255,0.02)",
                }}
              >
                {phrase}
              </span>
            );
          })}
        </div>

        {/* Soft Radial Backing specifically behind the Logo to ensure high-contrast legibility */}
        <div className="absolute w-[280px] min-[360px]:w-[360px] sm:w-[520px] lg:w-[680px] h-[180px] sm:h-[320px] lg:h-[400px] bg-[#050505]/75 rounded-full blur-3xl pointer-events-none z-10 max-w-full" />

        {/* CENTRAL OFFICIAL GENZLOG LOGO (The Focal Subject) */}
        <div
          ref={logoRef}
          className="relative z-20 flex flex-col items-center justify-center"
          style={{
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Official Logo Asset preserved with exact original proportions (1024x682) */}
          <div className="relative w-[240px] min-[360px]:w-[280px] sm:w-[420px] md:w-[500px] lg:w-[600px] xl:w-[680px] max-w-full aspect-[1024/682] filter drop-shadow-[0_0_40px_rgba(255,255,255,0.12)]">
            <Image
              src="/genzlog-logo-white.png"
              alt="GENZLOG Official Logo"
              width={1024}
              height={682}
              priority
              className="object-contain w-full h-full mix-blend-screen"
            />
          </div>

          {/* Editorial Description Text */}
          <p className="hero-desc mt-4 sm:mt-6 text-xs sm:text-base lg:text-lg text-[#A3A3A3] max-w-xl text-center leading-relaxed font-normal mx-auto px-4">
            We design and build digital experiences for ambitious businesses, while giving creators the tools and code to bring their own ideas to life.
          </p>

          {/* 3. CTA BUTTONS DIRECTLY UNDER THE LOGO */}
          <div className="hero-ctas mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xs sm:max-w-none">
            {/* Primary Button */}
            <ShiningButton
              href="/contact"
              variant="white"
              size="lg"
            >
              <span>BUILD MY WEBSITE</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </ShiningButton>

            {/* Secondary Button */}
            <ShiningButton
              href="/free-code"
              variant="secondary"
              size="lg"
            >
              <span>EXPLORE FREE CODE</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-white" />
            </ShiningButton>
          </div>
        </div>
      </div>

      {/* 4. UNDERSTATED STUDIO PILLARS METADATA */}
      <div className="hero-pillars relative z-20 w-full max-w-4xl mx-auto pt-8 border-t border-[#1C1C1C]/80 mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 text-center font-mono text-xs">
        <div>
          <span className="text-[#666666] block text-[10px] uppercase tracking-wider">01 / DESIGN</span>
          <span className="text-white font-medium text-xs sm:text-sm mt-1 block">Made with purpose</span>
        </div>
        <div>
          <span className="text-[#666666] block text-[10px] uppercase tracking-wider">02 / DEVELOPMENT</span>
          <span className="text-white font-medium text-xs sm:text-sm mt-1 block">Built for the web</span>
        </div>
        <div>
          <span className="text-[#666666] block text-[10px] uppercase tracking-wider">03 / RESOURCES</span>
          <span className="text-white font-medium text-xs sm:text-sm mt-1 block">Free code for creators</span>
        </div>
      </div>
    </section>
  );
}
