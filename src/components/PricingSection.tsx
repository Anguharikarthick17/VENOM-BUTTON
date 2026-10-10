"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShiningButton } from "@/components/ui/ShiningButton";
import {
  ArrowUpRight,
  Sparkles,
  Layers,
  Layout,
  Database,
  Plug,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Globe,
  Server,
  KeyRound,
  CreditCard,
  Smartphone,
  Wrench,
  PlusCircle,
  Send,
} from "lucide-react";

// 1. WHAT SHAPES YOUR PROJECT PRICE? (6 Core Factors)
interface PricingFactor {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const PRICING_FACTORS: PricingFactor[] = [
  {
    number: "01",
    title: "DESIGN & EXPERIENCE",
    description:
      "Custom visual design, animations, interactions, responsive layouts, and overall design complexity.",
    icon: Layout,
  },
  {
    number: "02",
    title: "PAGES & SCREENS",
    description:
      "The number of website pages, application screens, dashboards, and user journeys required.",
    icon: Layers,
  },
  {
    number: "03",
    title: "BACKEND & DATABASE",
    description:
      "Authentication, database design, admin panels, business logic, data processing, and server-side functionality.",
    icon: Database,
  },
  {
    number: "04",
    title: "INTEGRATIONS & APIS",
    description:
      "Payment gateways, maps, messaging, third-party APIs, external services, and automation.",
    icon: Plug,
  },
  {
    number: "05",
    title: "SECURITY & TESTING",
    description:
      "Input validation, access controls, testing requirements, security reviews, and the level of protection appropriate to the application.",
    icon: ShieldCheck,
  },
  {
    number: "06",
    title: "DELIVERY & SUPPORT",
    description:
      "Deployment requirements, documentation, handover, maintenance, updates, and support arrangements.",
    icon: Headphones,
  },
];

// 2. WHAT DOES YOUR PROJECT INCLUDE?
const INCLUDED_DELIVERABLES = [
  {
    title: "Responsive Multi-Device Layouts",
    detail: "Tailored design and fluid responsiveness for desktop, tablet, and mobile displays.",
  },
  {
    title: "Website or Application Development",
    detail: "High-performance frontend and full-stack engineering tailored to your requirements.",
  },
  {
    title: "Agreed Functionality & Integrations",
    detail: "Implementation of the exact features, components, and integrations defined in your scope.",
  },
  {
    title: "Testing of Important Workflows",
    detail: "Validation of critical user journeys, forms, authentication flows, and core interactions.",
  },
  {
    title: "Handover & Usage Instructions",
    detail: "Clear documentation, codebase delivery, and guidance on managing your digital solution.",
  },
  {
    title: "Deployment Assistance",
    detail: "Setup guidance and production deployment to your designated cloud or hosting provider.",
  },
];

// 3. UNDERSTAND THE ADDITIONAL COSTS (7 Separate Expenses)
interface AdditionalCost {
  title: string;
  description: string;
  icon: React.ElementType;
}

const ADDITIONAL_COSTS: AdditionalCost[] = [
  {
    title: "Domain Registration & Renewal",
    description: "Annual domain registration fees billed directly by domain registrars (e.g. Cloudflare, Namecheap, Google Domains).",
    icon: Globe,
  },
  {
    title: "Hosting & Cloud Infrastructure",
    description: "Cloud compute, database hosting, serverless functions, and storage subscriptions (e.g. Vercel, Supabase, AWS, DigitalOcean).",
    icon: Server,
  },
  {
    title: "Paid Third-Party APIs & Subscriptions",
    description: "External API usage fees such as SMS gateways, email dispatchers (Resend, SendGrid), AI endpoints, or Maps APIs.",
    icon: KeyRound,
  },
  {
    title: "Payment Gateway Transaction Fees",
    description: "Standard per-transaction processing percentages charged by payment providers (Razorpay, Stripe, PayPal).",
    icon: CreditCard,
  },
  {
    title: "App-Store Registration & Publishing Fees",
    description: "Developer account enrolment fees for the Apple App Store ($99/yr) or Google Play Store ($25 one-time).",
    icon: Smartphone,
  },
  {
    title: "Ongoing Maintenance, Monitoring & Updates",
    description: "Post-launch maintenance retainers, continuous uptime monitoring, security patching, and scheduled content refreshes.",
    icon: Wrench,
  },
  {
    title: "Additional Features or Out-of-Scope Revisions",
    description: "New feature requests, structural revisions, or scope expansions requested after project sign-off.",
    icon: PlusCircle,
  },
];

// 4. FROM IDEA TO FINAL QUOTE (4-Step Process)
interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "TELL US YOUR IDEA",
    description:
      "Share your goals, requirements, reference websites, and intended audience through our contact form or WhatsApp.",
  },
  {
    step: "02",
    title: "DEFINE THE SCOPE",
    description:
      "Identify the necessary pages, features, integrations, and technical requirements needed for your specific build.",
  },
  {
    step: "03",
    title: "RECEIVE YOUR QUOTE",
    description:
      "We assess the agreed scope and provide a transparent project quotation before development begins.",
  },
  {
    step: "04",
    title: "BUILD & DELIVER",
    description:
      "Development, agreed testing, and handover proceed according to the approved scope and agreed timeline.",
  },
];

// 5. FREQUENTLY ASKED QUESTIONS (Accurate answers from prompt)
interface FAQItem {
  question: string;
  answer: string;
}

const PRICING_FAQS: FAQItem[] = [
  {
    question: "Why does the final price vary?",
    answer:
      "The price depends on the complexity of the design, the number of pages or screens, backend functionality, integrations, testing requirements, and overall project scope.",
  },
  {
    question: "Are the prices shown on Services fixed?",
    answer:
      "No. They are indicative starting prices. The final quotation depends on the requirements and deliverables agreed for your project.",
  },
  {
    question: "Is hosting included?",
    answer:
      "Hosting and domain costs are included only when explicitly stated in the quotation.",
  },
  {
    question: "Can I request a small or budget-friendly project?",
    answer:
      "Yes. Tell us your goals and budget, and we can discuss a suitable scope and possible approach.",
  },
  {
    question: "Can I request custom software or a mobile app?",
    answer:
      "Yes. GENZLOG accepts enquiries for custom websites, web applications, and mobile or desktop applications. Requirements are reviewed before a quotation is provided.",
  },
  {
    question: "Are maintenance and future updates included?",
    answer:
      "Only when included in the agreed service scope. Ongoing maintenance and support can be discussed separately.",
  },
  {
    question: "How do I get a quote?",
    answer:
      "Visit the Contact page, describe your project, choose the closest service category, and submit your requirements. Preserve the existing WhatsApp and email contact options.",
  },
];

export function PricingSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="relative w-full text-white bg-transparent">
      {/* 1. HERO HEADER */}
      <section className="relative pt-12 sm:pt-16 pb-20 sm:pb-24 overflow-hidden border-b border-[#303030]">
        <div className="relative w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-white uppercase tracking-[0.2em] font-semibold">
                  GENZLOG // PRICING PHILOSOPHY
                </span>
                <span className="text-[#555555]">•</span>
                <span className="text-[#A3A3A3] uppercase tracking-wider hidden sm:inline">
                  HONEST ESTIMATES • CLEAR SCOPE
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight uppercase text-white font-display leading-[0.95]">
                GOOD WORK. <br />
                <span className="text-white">CLEAR PRICING.</span>
              </h1>

              <p className="text-base sm:text-xl text-[#CCCCCC] max-w-3xl leading-relaxed font-normal">
                Every project is different. We price our work according to your requirements,
                the complexity of the solution, and the features needed to bring your idea to life.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <ShiningButton
                href="/contact"
                variant="white"
                size="lg"
              >
                <span>REQUEST A PROJECT QUOTE</span>
                <ArrowUpRight className="w-4 h-4 text-[#050505] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </ShiningButton>
              <ShiningButton
                href="/services"
                variant="secondary"
                size="lg"
              >
                <span>EXPLORE ALL SERVICES</span>
                <ArrowUpRight className="w-4 h-4 text-[#888888] group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </ShiningButton>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION: WHAT SHAPES YOUR PROJECT PRICE? */}
      <section className="py-16 sm:py-24 lg:py-32 border-b border-[#303030] relative overflow-hidden">
        <div className="relative w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24 space-y-12 sm:space-y-16">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#222222]">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#A3A3A3]">
                <span className="text-white font-bold">01 //</span>
                <span className="uppercase tracking-[0.2em]">PRICING FACTORS</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold uppercase text-white font-display tracking-tight">
                WHAT SHAPES YOUR PROJECT PRICE?
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-mono text-[#A3A3A3] max-w-md">
              The final quotation depends on the actual requirements and agreed scope.
            </p>
          </div>

          {/* 6 Visual Factor Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {PRICING_FACTORS.map((factor) => {
              const Icon = factor.icon;
              return (
                <div
                  key={factor.number}
                  className="bg-[#111111]/80 hover:bg-[#141414] border border-[#2B2B2B] hover:border-white/[0.25] rounded-2xl p-7 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-300 group shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#666666] group-hover:text-white transition-colors">
                      FACTOR // {factor.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#181818] border border-[#2C2C2C] flex items-center justify-center text-[#A3A3A3] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-bold uppercase text-white font-display tracking-tight">
                      {factor.title}
                    </h3>
                    <p className="text-sm text-[#CCCCCC] leading-relaxed font-normal">
                      {factor.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1F1F1F] text-[11px] font-mono text-[#777777] flex items-center justify-between">
                    <span>SCOPING PARAMETER</span>
                    <span className="text-white font-semibold">CUSTOM SPECIFICATION</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Advisory banner */}
          <div className="p-6 bg-[#0E0E0E] border border-[#262626] rounded-xl flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
              <strong className="text-white font-mono uppercase text-xs mr-2">Scope Advisory:</strong>
              Because every client has unique goals, we evaluate all six parameters during discovery
              to create a tailored proposal rather than applying a rigid, one-size-fits-all charge.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SECTION: WHAT DOES YOUR PROJECT INCLUDE? */}
      <section className="py-16 sm:py-24 lg:py-32 border-b border-[#303030] relative overflow-hidden bg-transparent">
        <div className="relative w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24 space-y-12 sm:space-y-16">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#222222]">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#A3A3A3]">
                <span className="text-white font-bold">02 //</span>
                <span className="uppercase tracking-[0.2em]">DELIVERABLES &amp; SCOPE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold uppercase text-white font-display tracking-tight">
                BUILT AROUND YOUR REQUIREMENTS.
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-mono text-[#A3A3A3] max-w-md">
              The exact deliverables are confirmed in the project quotation.
            </p>
          </div>

          {/* Grid of Inclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INCLUDED_DELIVERABLES.map((item, idx) => (
              <div
                key={idx}
                className="p-7 sm:p-8 bg-[#111111]/75 border border-[#2A2A2A] rounded-2xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-white">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span className="uppercase tracking-wider font-semibold">DELIVERABLE 0{idx + 1}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white font-display uppercase tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#CCCCCC] leading-relaxed">
                    {item.detail}
                  </p>
                </div>

                <span className="text-[11px] font-mono text-[#666666] uppercase tracking-wider block pt-3 border-t border-[#1C1C1C]">
                  Included when specified in agreement
                </span>
              </div>
            ))}
          </div>

          {/* Important Clarity Caveat */}
          <div className="p-6 sm:p-8 bg-[#101010] border border-[#2B2B2B] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-mono text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span className="uppercase font-bold tracking-wider">PROJECT-SPECIFIC AGREEMENT</span>
              </div>
              <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
                We do not imply that every feature, integration, security review, or deployment service is automatically included in every project.
                Every deliverable is explicitly listed in your formal project quotation before work commences.
              </p>
            </div>

            <Link
              href="/contact"
              className="px-6 py-3.5 bg-white hover:bg-[#F0F0F0] text-[#050505] text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all shrink-0 flex items-center gap-2"
            >
              <span>Get Itemised Scope</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SECTION: UNDERSTAND THE ADDITIONAL COSTS */}
      <section className="py-16 sm:py-24 lg:py-32 border-b border-[#303030] relative overflow-hidden bg-transparent">
        <div className="relative w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24 space-y-12 sm:space-y-16">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#222222]">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#A3A3A3]">
                <span className="text-white font-bold">03 //</span>
                <span className="uppercase tracking-[0.2em]">TRANSPARENT EXPENSES</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold uppercase text-white font-display tracking-tight">
                NO SURPRISES. JUST CLEAR SCOPE.
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-mono text-[#A3A3A3] max-w-md">
              These costs may be separate unless specifically included in the quotation.
            </p>
          </div>

          {/* 7 Additional Costs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {ADDITIONAL_COSTS.map((cost, idx) => {
              const Icon = cost.icon;
              return (
                <div
                  key={idx}
                  className="p-7 sm:p-8 bg-[#0E0E0E]/80 border border-[#262626] hover:border-[#404040] rounded-2xl space-y-4 flex flex-col justify-between transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-[#161616] border border-[#2B2B2B] flex items-center justify-center text-white">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono text-[#666666] uppercase">
                        EXPENSE 0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-display uppercase tracking-tight">
                      {cost.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
                      {cost.description}
                    </p>
                  </div>

                  <span className="text-[11px] font-mono text-[#777777] block pt-3 border-t border-[#1C1C1C]">
                    Billed directly or quoted per scope
                  </span>
                </div>
              );
            })}
          </div>

          {/* Transparency Callout */}
          <div className="p-6 bg-[#111111] border border-[#2B2B2B] rounded-xl flex items-start gap-4">
            <Sparkles className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
              <strong className="text-white font-mono uppercase text-xs mr-2">Direct Billing Policy:</strong>
              We do not add hidden markups onto third-party subscriptions. You retain direct ownership
              of your domains, cloud infrastructure accounts, payment gateway credentials, and API access keys.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SECTION: FROM IDEA TO FINAL QUOTE (Process Journey) */}
      <section className="py-16 sm:py-24 lg:py-32 border-b border-[#303030] relative overflow-hidden bg-transparent">
        <div className="relative w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24 space-y-12 sm:space-y-16">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#222222]">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#A3A3A3]">
                <span className="text-white font-bold">04 //</span>
                <span className="uppercase tracking-[0.2em]">PROJECT JOURNEY</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold uppercase text-white font-display tracking-tight">
                FROM IDEA TO FINAL QUOTE.
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-mono text-[#A3A3A3] max-w-md">
              A transparent four-step process before development begins.
            </p>
          </div>

          {/* 4-Step Process Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={step.step}
                className="bg-[#111111]/80 border border-[#2B2B2B] hover:border-white/[0.25] rounded-2xl p-7 sm:p-8 flex flex-col justify-between space-y-8 relative group transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl sm:text-5xl font-bold font-display text-white/[0.2] group-hover:text-white transition-colors">
                      {step.step}
                    </span>
                    <span className="text-[10px] font-mono text-[#777777] uppercase px-2.5 py-1 bg-[#161616] border border-[#242424] rounded-md">
                      STEP {idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white font-display uppercase tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1C1C1C] flex items-center justify-between text-xs font-mono text-[#888888]">
                  <span>MILESTONE 0{idx + 1}</span>
                  <span className="text-white">{"→"}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Process advisory */}
          <div className="p-6 bg-[#0E0E0E] border border-[#262626] rounded-xl flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
              <strong className="text-white font-mono uppercase text-xs mr-2">No Pre-Review Commitments:</strong>
              We do not promise fixed delivery dates or prices before requirements have been reviewed.
              This guarantees that our quotations remain accurate, honest, and realistic.
            </p>
          </div>
        </div>
      </section>

      {/* 6. SECTION: FREQUENTLY ASKED QUESTIONS (Accessible Accordion) */}
      <section className="py-16 sm:py-24 lg:py-32 border-b border-[#303030] relative overflow-hidden bg-transparent">
        <div className="relative w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24 space-y-12 sm:space-y-16">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#222222]">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#A3A3A3]">
                <HelpCircle className="w-4 h-4 text-white" />
                <span className="uppercase tracking-[0.2em] font-semibold">05 // COMMON QUESTIONS</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold uppercase text-white font-display tracking-tight">
                FREQUENTLY ASKED QUESTIONS.
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-mono text-[#A3A3A3] max-w-md">
              Clear answers regarding pricing, indicative figures, and custom software.
            </p>
          </div>

          {/* Accessible Accordion Component */}
          <div className="max-w-4xl mx-auto divide-y divide-[#222222] border-y border-[#222222]">
            {PRICING_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              const buttonId = `pricing-faq-btn-${idx}`;
              const panelId = `pricing-faq-panel-${idx}`;

              return (
                <div key={idx} className="transition-colors hover:bg-white/[0.01]">
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-6 sm:py-7 flex items-center justify-between gap-4 text-left cursor-pointer group outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] rounded-sm"
                  >
                    <div className="flex items-center gap-4 sm:gap-6 pr-4">
                      <span className="font-mono text-xs text-[#666666] group-hover:text-white transition-colors shrink-0">
                        0{idx + 1}
                      </span>
                      <span className="text-base sm:text-lg font-bold font-display uppercase tracking-tight text-white group-hover:text-[#F0F0F0] transition-colors">
                        {faq.question}
                      </span>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full border border-[#333333] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:border-white ${
                        isOpen ? "rotate-180 bg-white text-[#050505]" : "text-[#888888]"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    className={`pb-7 pl-8 sm:pl-12 pr-6 text-sm sm:text-base text-[#CCCCCC] leading-relaxed transition-all duration-200 ${
                      isOpen ? "block animate-fadeIn" : "hidden"
                    }`}
                  >
                    <p className="max-w-3xl">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden bg-transparent">
        <div className="relative w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24">
          <div className="p-6 sm:p-14 lg:p-20 bg-[#0E0E0E]/90 border border-[#303030] hover:border-white/[0.25] rounded-3xl relative overflow-hidden shadow-2xl transition-all">
            {/* Tech grid texture overlay */}
            <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#161616] border border-[#2B2B2B] rounded-full text-xs font-mono text-[#A3A3A3]">
                <Send className="w-3.5 h-3.5 text-white" />
                <span className="text-white font-semibold uppercase tracking-wider">PROJECT INQUIRY</span>
                <span className="text-[#555555]">•</span>
                <span>GENZLOG STUDIO</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white font-display leading-[0.95]">
                HAVE AN IDEA WORTH BUILDING?
              </h2>

              <p className="text-base sm:text-lg text-[#CCCCCC] max-w-2xl mx-auto leading-relaxed font-normal">
                Tell us what you have in mind. We&apos;ll help define the right scope and discuss a suitable quotation.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <ShiningButton
                  href="/contact"
                  variant="white"
                  size="lg"
                >
                  <span>REQUEST A PROJECT QUOTE</span>
                  <ArrowUpRight className="w-4 h-4 text-[#050505] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </ShiningButton>

                <ShiningButton
                  href="/services"
                  variant="secondary"
                  size="lg"
                >
                  <span>EXPLORE ALL SERVICES</span>
                  <ArrowUpRight className="w-4 h-4 text-[#888888] group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </ShiningButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
