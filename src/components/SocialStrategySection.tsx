"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import { DoodleAnnotation, DoodleUnderline } from "./doodles/DoodleElements";
import { SOCIAL_URLS } from "@/data/socialLinks";

interface ContentTopic {
  title: string;
  format: "Video Tutorial" | "Reels / Shorts" | "Component Guide";
  slug: string;
  tag: string;
}

const CONTENT_TOPICS: ContentTopic[] = [
  {
    title: "Build an animated split-screen login page with pure CSS",
    format: "Reels / Shorts",
    slug: "animated-login-page",
    tag: "#01 AUTH",
  },
  {
    title: "Create a responsive glassmorphism navbar with scroll blur",
    format: "Video Tutorial",
    slug: "modern-navbar",
    tag: "#02 NAVIGATION",
  },
  {
    title: "Build modern SaaS pricing cards with monthly/annual toggle",
    format: "Component Guide",
    slug: "pricing-cards",
    tag: "#03 PRICING",
  },
  {
    title: "Customize a validated business inquiry form with service chips",
    format: "Reels / Shorts",
    slug: "interactive-contact-form",
    tag: "#04 FORMS",
  },
  {
    title: "Add 10 creative micro-interaction CSS button hover effects",
    format: "Video Tutorial",
    slug: "creative-button-pack",
    tag: "#05 BUTTONS",
  },
  {
    title: "Create a high-impact minimal typography agency hero section",
    format: "Component Guide",
    slug: "minimal-portfolio-hero",
    tag: "#06 HERO SECTION",
  },
];

export function SocialStrategySection() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#050505] border-t border-[#303030]">
      {/* Background Subtle Tech Dots */}
      <div className="absolute inset-0 tech-dots opacity-20 pointer-events-none" />

      <div className="relative w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#303030]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono text-[#FFFFFF] uppercase tracking-[0.2em]">
                {"// SOCIAL & DEVELOPER RESOURCES"}
              </span>
              <span className="text-[#666666]">•</span>
              <span className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider">
                YOUTUBE • INSTAGRAM • FREE CODE
              </span>
            </div>

            <div className="relative inline-block">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight uppercase text-[#FFFFFF] font-display">
                FREE CODE. REAL VALUE.
              </h2>
              <div className="mt-1 w-36 sm:w-52">
                <DoodleUnderline className="text-[#FFFFFF] w-full h-3" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#A3A3A3]">
            <DoodleAnnotation
              text="code previewed online, downloadable free"
              className="text-[#A3A3A3]"
            />
          </div>
        </div>

        {/* Narrative & Strategy Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-12">
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-2xl font-bold text-[#FFFFFF] font-display uppercase">
              How GENZLOG shares code with the community
            </h3>
            <p className="text-sm text-[#A3A3A3] leading-relaxed">
              We create practical frontend walkthroughs, breakdown reels, and UI component tutorials on social platforms. Every piece of code featured in our content is published on this website for visitors to inspect, customize, and download for free.
            </p>
            <p className="text-xs text-[#888888] leading-relaxed">
              No paywalled archives. No hidden steps. We share working UI code to help developers learn and creators ship faster, while collaborating with businesses that want complete bespoke websites built from scratch.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/free-code"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#FFFFFF] hover:bg-[#F5F5F5] text-[#050505] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                <span>Browse All Free Resources</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href={SOCIAL_URLS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 bg-[#111111] hover:bg-[#1a1a1a] text-white border border-[#303030] hover:border-[#666666] font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                <span>YouTube</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#A3A3A3]" />
              </a>

              <a
                href={SOCIAL_URLS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 bg-[#111111] hover:bg-[#1a1a1a] text-white border border-[#303030] hover:border-[#666666] font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                <span>Instagram</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#A3A3A3]" />
              </a>
            </div>
          </div>

          {/* Right: Content Topics Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CONTENT_TOPICS.map((topic, i) => (
              <Link
                key={i}
                href={`/free-code/${topic.slug}`}
                className="p-5 bg-[#111111] border border-[#303030] hover:border-[#666666] rounded-xl transition-all group flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#FFFFFF] font-bold">{topic.tag}</span>
                    <span className="text-[#A3A3A3] bg-[#161616] px-2 py-0.5 rounded border border-[#303030]">
                      {topic.format}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#FFFFFF] group-hover:text-[#A3A3A3] transition-colors leading-snug">
                    {topic.title}
                  </h4>
                </div>

                <div className="pt-2 border-t border-[#222222] flex items-center justify-between text-xs text-[#888888] font-mono">
                  <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                    <Download className="w-3 h-3 text-[#FFFFFF]" />
                    <span>Free Code Ready</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:text-white transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
