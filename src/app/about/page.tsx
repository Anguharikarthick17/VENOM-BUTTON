import React from "react";
import { Metadata } from "next";
import { ShiningButton } from "@/components/ui/ShiningButton";
import { AboutSection } from "@/components/AboutSection";
import { BrandPhilosophy } from "@/components/BrandPhilosophy";
import { Process } from "@/components/Process";
import { ErrorBoundary } from "@/components/states/ErrorBoundary";
import { Code, Send, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About GENZLOG | Website Development Studio & Free Code Platform",
  description:
    "Learn about GENZLOG — an independent digital studio building high-performance websites for businesses and publishing free frontend code for creators.",
};

export default function AboutPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-white">
      <ErrorBoundary
        title="About Section Error"
        message="An issue occurred displaying studio details. You can retry loading this page."
      >
        {/* About Section */}
        <AboutSection />

        {/* Brand Philosophy */}
        <BrandPhilosophy />

        {/* Process / How We Work */}
        <Process />
      </ErrorBoundary>

      {/* Studio Call to Action */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[#050505] border-t border-[#303030] relative overflow-hidden text-center">
        <div className="relative w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-[#111111] border border-[#303030] text-xs font-mono text-white">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>{"// WORK WITH GENZLOG"}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white font-display">
            HAVE A PROJECT IN MIND?
          </h2>

          <p className="text-sm sm:text-base text-[#A3A3A3] max-w-xl mx-auto leading-relaxed">
            Whether you need a full business website engineered from scratch or want to explore our open-source frontend components, we are ready to build.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <ShiningButton
              href="/contact"
              variant="white"
              size="lg"
            >
              <Send className="w-4 h-4 text-[#050505]" />
              <span>BUILD MY WEBSITE</span>
            </ShiningButton>
            <ShiningButton
              href="/free-code"
              variant="secondary"
              size="lg"
            >
              <Code className="w-4 h-4 text-white" />
              <span>EXPLORE FREE CODE</span>
            </ShiningButton>
          </div>
        </div>
      </section>
    </main>
  );
}
