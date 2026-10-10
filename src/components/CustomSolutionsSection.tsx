import React from "react";
import Link from "next/link";
import { ArrowUpRight, Cpu, KeyRound, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { ShiningButton } from "@/components/ui/ShiningButton";

interface CustomSolutionCard {
  id: string;
  tag: string;
  titlePrefix: string;
  highlightText: string;
  titleSuffix: string;
  highlightColor: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  capabilities: string[];
  scopingNotice: string;
  serviceParam: string;
}

const CUSTOM_SOLUTIONS: CustomSolutionCard[] = [
  {
    id: "ai-solutions",
    tag: "// 01 ARTIFICIAL INTELLIGENCE",
    titlePrefix: "CUSTOMIZED ",
    highlightText: "AI SOLUTIONS",
    titleSuffix: "",
    highlightColor: "#22D3EE", // Electric Cyan
    icon: Cpu,
    summary:
      "Intelligent workflows, bespoke chat interfaces, and automated business tools powered by modern language and vision models.",
    capabilities: [
      "AI chatbots and conversational customer assistants",
      "AI-powered websites and interactive web applications",
      "Document-processing and text-extraction pipelines",
      "AI-assisted business workflows and automated routing",
      "Workflow automation and structured prompt orchestration",
      "Custom third-party AI integrations (OpenAI, Anthropic, or local models)",
    ],
    scopingNotice:
      "Technical feasibility, model selection, third-party API quotas, token usage costs, hosting infrastructure, and implementation scope are evaluated prior to formal quoting. Operating API costs depend on real-world usage volume.",
    serviceParam: "Customized AI Solutions",
  },
  {
    id: "login-auth-ui",
    tag: "// 02 IDENTITY & INTERFACES",
    titlePrefix: "CUSTOM ",
    highlightText: "LOGIN & AUTHENTICATION UI",
    titleSuffix: "",
    highlightColor: "#C084FC", // Electric Violet
    icon: KeyRound,
    summary:
      "High-impact, memorable account portals and onboarding screens that elevate user perception from their very first interaction.",
    capabilities: [
      "Custom split-screen login and signup pages",
      "3D interactive login experiences with cursor response",
      "Glassmorphism and dark aesthetic authentication interfaces",
      "Fluid animated forms with micro-interactions and transitions",
      "Branded account portals and onboarding dashboards",
      "Custom-designed mobile and desktop authentication screens",
    ],
    scopingNotice:
      "Starter design scope covers bespoke frontend UI architecture. Backend authentication, user databases, credential hashing, session management, social OAuth providers, and security compliance are scoped and quoted separately.",
    serviceParam: "Custom Login / Signup UI",
  },
  {
    id: "anything-custom",
    tag: "// 03 BESPOKE SOFTWARE",
    titlePrefix: "",
    highlightText: "ANYTHING CUSTOM",
    titleSuffix: "",
    highlightColor: "#38BDF8", // Electric Blue
    icon: Sparkles,
    summary:
      "Tailored digital products that don't fit standard templates. We architect websites, dashboards, and tools built specifically for your objectives.",
    capabilities: [
      "Unique brand websites and interactive web applications",
      "Custom internal dashboards and business management tools",
      "Interactive digital experiences, portfolios, and showcases",
      "Specialized booking, enquiry, or scheduling systems",
      "Custom software concepts and prototype MVPs",
      "Feasible digital products tailored to your operational requirements",
    ],
    scopingNotice:
      "Have an unconventional idea or unique operational challenge? We review all custom concepts on merit. Pricing, technical architecture, and milestone delivery timelines are determined by your agreed scope.",
    serviceParam: "Other / Something Unique",
  },
];

export function CustomSolutionsSection() {
  return (
    <section
      id="custom-solutions"
      className="relative py-16 sm:py-24 lg:py-28 bg-[#050505] border-t border-[#303030] text-white"
    >
      <div className="relative w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-[#303030]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="text-xs font-mono text-white uppercase tracking-[0.2em] font-semibold">
                {"// BESPOKE COMMISSIONS"}
              </span>
              <span className="text-[#555555]">•</span>
              <span className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider">
                BEYOND THE CATALOGUE
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display uppercase tracking-tight text-white leading-[0.98]">
              YOUR IDEA. <span className="text-white">BUILT YOUR WAY.</span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#A3A3A3] leading-relaxed font-normal">
              From AI-powered tools to completely custom digital experiences, we build solutions around your requirements.
              Explore our custom project tracks or bring your own brief.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/contact?service=Other%20%2F%20Something%20Unique"
              className="px-5 py-3 bg-white text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              <span>DISCUSS YOUR IDEA</span>
              <ArrowUpRight className="w-4 h-4 text-[#050505]" />
            </Link>
          </div>
        </div>

        {/* 3 Premium Custom Solution Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {CUSTOM_SOLUTIONS.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                className="bg-[#0D0D0D] border border-[#222222] hover:border-[#444444] rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
              >
                <div className="space-y-6">
                  {/* Top Bar with Tag and Icon */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]">
                    <span className="text-[11px] font-mono text-[#888888] font-bold tracking-wider">
                      {card.tag}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#262626] flex items-center justify-center text-white">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title with Restrained Neon Keyword Highlighting */}
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-white leading-tight">
                      {card.titlePrefix}
                      <span
                        style={{ color: card.highlightColor }}
                        className="font-bold tracking-tight inline-block"
                      >
                        {card.highlightText}
                      </span>
                      {card.titleSuffix}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
                      {card.summary}
                    </p>
                  </div>

                  {/* Capabilities List */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777] block">
                      FEATURED EXAMPLES &amp; CAPABILITIES:
                    </span>
                    <ul className="space-y-2">
                      {card.capabilities.map((cap, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-[#CCCCCC] leading-relaxed"
                        >
                          <CheckCircle2
                            className="w-3.5 h-3.5 shrink-0 mt-0.5"
                            style={{ color: card.highlightColor }}
                          />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Honest Scoping Notice */}
                  <div className="p-3.5 bg-[#121212] border border-[#1F1F1F] rounded-xl flex items-start gap-2.5 text-[11px] text-[#999999] leading-relaxed">
                    <AlertCircle className="w-3.5 h-3.5 text-[#888888] shrink-0 mt-0.5" />
                    <span>{card.scopingNotice}</span>
                  </div>
                </div>

                {/* Primary Card CTA */}
                <div className="pt-6 border-t border-[#1A1A1A]">
                  <Link
                    href={`/contact?service=${encodeURIComponent(card.serviceParam)}`}
                    className="w-full py-3 px-4 bg-[#141414] hover:bg-white text-white hover:text-[#050505] border border-[#2A2A2A] hover:border-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 group/btn cursor-pointer shadow-sm"
                  >
                    <span>DISCUSS YOUR IDEA</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Master Callout Banner */}
        <div className="bg-[#0C0C0C] border border-[#2A2A2A] rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-2xl">
            <span className="text-xs font-mono text-white uppercase tracking-wider font-semibold">
              {"// HONEST TECHNICAL CONSULTATION"}
            </span>
            <h4 className="text-2xl sm:text-3xl font-bold uppercase text-white font-display">
              HAVE A CONCEPT THAT DOESN&apos;T FIT A STANDARD TEMPLATE?
            </h4>
            <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed font-normal">
              Tell us what you want to achieve. We will assess technical feasibility, suggest architecture options, and provide a transparent project roadmap.
            </p>
          </div>

          <ShiningButton
            href="/contact?service=Other%20%2F%20Something%20Unique"
            variant="white"
            size="lg"
          >
            <span>DISCUSS YOUR IDEA</span>
            <ArrowUpRight className="w-4 h-4 text-[#050505]" />
          </ShiningButton>
        </div>
      </div>
    </section>
  );
}
