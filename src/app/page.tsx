import React from "react";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Services } from "@/components/Services";
import { BrandPhilosophy } from "@/components/BrandPhilosophy";
import { Process } from "@/components/Process";
import { FreeCodeSection } from "@/components/FreeCodeSection";
import { getPublishedProjects } from "@/lib/freeCodeDb";
import { ShiningButton } from "@/components/ui/ShiningButton";
import { SECURITY_PILLARS } from "@/data/services";
import { ErrorBoundary } from "@/components/states/ErrorBoundary";
import {
  ArrowUpRight,
  Shield,
  Lock,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";

export default async function Home() {
  const publishedProjects = await getPublishedProjects();
  return (
    <div className="relative w-full text-white bg-[#050505]">
      {/* 1. APPROVED HOMEPAGE HERO (Strictly Preserved) */}
      <Hero />

      {/* 2. Marquee Ticker */}
      <Marquee />

      {/* 3. Services Directory & Interactive 3D Panels */}
      <ErrorBoundary
        title="Services Installation Unavailable"
        message="An issue occurred displaying interactive service panels. You can browse the complete directory on our Services page."
      >
        <section id="services" className="relative py-16 sm:py-24 lg:py-32 bg-[#050505] border-t border-[#303030] overflow-hidden text-white">
          <div className="relative w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 mb-12 border-b border-[#303030]">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-white font-semibold">
                    {"// 01 SERVICES & DISCIPLINES"}
                  </span>
                  <span className="text-[#666666]">•</span>
                  <span className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider">
                    COMMERCIAL ENGINEERING
                  </span>
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display uppercase tracking-tight text-white">
                  DIGITAL SOLUTIONS. <span className="text-white">BUILT TO LAST.</span>
                </h2>
                <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#A3A3A3] leading-relaxed">
                  From custom business websites and celebration portals to complex web applications and tracking systems. Tailored scope, transparent pricing, and clean code.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                >
                  <span>EXPLORE ALL SERVICES</span>
                  <ArrowUpRight className="w-4 h-4 text-[#050505]" />
                </Link>
              </div>
            </div>

            {/* Interactive 3D Panels */}
            <Services />
          </div>
        </section>
      </ErrorBoundary>

      {/* 4. Editorial Brand Philosophy */}
      <ErrorBoundary
        title="Brand Philosophy Unavailable"
        message="An issue occurred displaying studio philosophy. You can learn more on the About page."
      >
        <BrandPhilosophy />
      </ErrorBoundary>

      {/* 5. Process / How We Work */}
      <ErrorBoundary
        title="Process Overview Unavailable"
        message="An issue occurred displaying the development process. You can view the full workflow on the About page."
      >
        <Process />
      </ErrorBoundary>

      {/* 6. Built with Security in Mind: 4 Feature Blocks */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[#050505] border-t border-[#303030] relative text-white">
        <div className="relative w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24 space-y-10 sm:space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#303030]">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-white" />
                <span className="text-xs font-mono text-white uppercase tracking-[0.2em] font-semibold">
                  {"// 04 TRUST & PRIVACY"}
                </span>
                <span className="text-[#666666]">•</span>
                <span className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider">
                  VERIFIED STANDARDS
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold uppercase text-white font-display">
                SECURITY. PRIVACY. RELIABILITY.
              </h2>
              <p className="text-sm sm:text-base text-[#A3A3A3] max-w-2xl mt-4 leading-relaxed font-normal">
                Every project is developed with security, privacy, and reliability in mind. We apply appropriate security practices, validate inputs, protect sensitive information, and test functionality according to project requirements.
              </p>
            </div>

            <div className="text-xs font-mono text-[#888888] bg-[#111111] p-4 rounded-xl border border-[#303030] max-w-md">
              <strong className="text-white block mb-1">YOUR DATA DESERVES PROTECTION.</strong>
              We design digital experiences with privacy in mind, minimise unnecessary data collection, and use appropriate safeguards to help protect customer information.
            </div>
          </div>

          <div>
            <span className="text-xs font-mono text-[#888888] uppercase tracking-wider block">
              ENGINEERING FOUNDATIONS
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold uppercase text-white font-display mt-1">
              BUILT WITH SECURITY IN MIND.
            </h3>
            <p className="text-xs sm:text-sm text-[#A3A3A3] max-w-2xl mt-2 leading-relaxed">
              From simple websites to custom applications, we consider security, privacy, and reliability throughout the development process.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            {SECURITY_PILLARS.map((pillar) => (
              <div
                key={pillar.num}
                className="bg-[#111111] border border-[#303030] rounded-xl p-6 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-[#666666] block">
                    {`${pillar.num} // PRINCIPLE`}
                  </span>
                  <h4 className="text-base font-bold uppercase text-white font-display">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-[#A3A3A3] leading-relaxed">
                    {pillar.summary}
                  </p>
                </div>
                <div className="pt-2 text-[10px] font-mono text-[#666666] border-t border-[#222222]">
                  VERIFIED ENGINEERING
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-[#111111] border border-[#303030] rounded-xl flex items-start gap-4">
            <Lock className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <p className="text-xs text-[#CCCCCC] leading-relaxed">
              <strong className="text-white">Security Statement: </strong>
              GENZLOG takes security and privacy seriously. We apply appropriate safeguards and test project functionality according to the agreed scope. No internet-connected system can be guaranteed to be completely free from vulnerabilities, outages, or errors. We explain relevant security responsibilities, third-party dependencies, and ongoing maintenance requirements before project delivery.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Free Code Library (Reusing polished component) */}
      <ErrorBoundary
        title="Open Source Library Preview Unavailable"
        message="An issue occurred displaying featured code components. You can browse the full library on the dedicated Free Code page."
      >
        <FreeCodeSection resources={publishedProjects} />
      </ErrorBoundary>

      {/* 8. Official GENZLOG Direct Contact & Commission Desk */}
      <section id="contact" className="py-16 sm:py-24 lg:py-32 bg-[#050505] border-t border-[#303030] relative overflow-hidden text-white">
        <div className="relative w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24">
          <div className="bg-[#0B0B0B] border border-[#303030] rounded-2xl sm:rounded-3xl p-6 sm:p-12 lg:p-16 relative overflow-hidden">
            {/* Subtle background tech grid */}
            <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Heading, Supporting Text, and Primary Action Buttons */}
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#141414] border border-[#303030] rounded-full text-xs font-mono text-[#A3A3A3]">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span className="text-white font-semibold uppercase tracking-wider">GENZLOG DIRECT CONTACT</span>
                    <span className="text-[#555555]">•</span>
                    <span>STUDIO COMMISSIONS</span>
                  </div>

                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white font-display leading-[0.95]">
                    LET&apos;S BUILD SOMETHING GREAT.
                  </h2>

                  <p className="text-base sm:text-lg text-[#CCCCCC] max-w-xl leading-relaxed font-normal">
                    Have a website idea, need a custom application, or want to work with GENZLOG? Get in touch and let&apos;s discuss your requirements.
                  </p>
                </div>

                {/* Primary CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <ShiningButton
                    href="mailto:genzlog.contact@gmail.com"
                    variant="white"
                    size="lg"
                  >
                    <Mail className="w-4 h-4 text-[#050505]" />
                    <span>EMAIL US</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#050505]" />
                  </ShiningButton>

                  <ShiningButton
                    href="/contact"
                    variant="secondary"
                    size="lg"
                  >
                    <span>DISCUSS YOUR PROJECT</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-white" />
                  </ShiningButton>
                </div>
              </div>

              {/* Right Column: Prominent Contact Detail Cards */}
              <div className="lg:col-span-5 space-y-4">
                {/* Email Card */}
                <div className="p-6 sm:p-7 bg-[#111111] border border-[#303030] hover:border-[#666666] rounded-2xl transition-all group">
                  <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#888888]">
                      <Mail className="w-3.5 h-3.5 text-white" />
                      <span className="uppercase font-semibold tracking-wider text-white">EMAIL</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#666666] uppercase">PRIMARY INBOX</span>
                  </div>

                  <div className="pt-4 space-y-1.5">
                    <a
                      href="mailto:genzlog.contact@gmail.com"
                      className="text-lg sm:text-xl font-bold font-mono text-white hover:text-[#CCCCCC] transition-colors break-all flex items-center justify-between gap-2"
                    >
                      <span>genzlog.contact@gmail.com</span>
                      <ArrowUpRight className="w-4 h-4 text-[#888888] group-hover:text-white transition-colors shrink-0" />
                    </a>
                    <p className="text-xs text-[#888888]">
                      Send brief details or RFPs. We typically respond within 24 hours.
                    </p>
                  </div>
                </div>

                {/* Phone & WhatsApp Card */}
                <div className="p-6 sm:p-7 bg-[#111111] border border-[#303030] hover:border-[#666666] rounded-2xl transition-all group">
                  <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#888888]">
                      <Phone className="w-3.5 h-3.5 text-white" />
                      <span className="uppercase font-semibold tracking-wider text-white">PHONE / WHATSAPP</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#666666] uppercase">DIRECT LINE</span>
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <a
                        href="tel:+918072522246"
                        className="text-xl sm:text-2xl font-bold font-mono text-white hover:text-[#CCCCCC] transition-colors tracking-tight flex items-center gap-2"
                      >
                        <span>+91 80725 22246</span>
                      </a>

                      <a
                        href="https://wa.me/918072522246"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] hover:bg-[#242424] text-white border border-[#303030] rounded-lg text-xs font-mono font-medium transition-all w-fit"
                      >
                        <MessageSquare className="w-3 h-3 text-white" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                    <p className="text-xs text-[#888888]">
                      Available for quick inquiries, project scoping calls, and instant messaging.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
