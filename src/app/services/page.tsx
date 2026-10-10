import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Services } from "@/components/Services";
import { CustomSolutionsSection } from "@/components/CustomSolutionsSection";
import { ShiningButton } from "@/components/ui/ShiningButton";
import { ErrorBoundary } from "@/components/states/ErrorBoundary";
import { SECURITY_PILLARS } from "@/data/services";
import {
  ArrowUpRight,
  Shield,
  Lock,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Complete Digital Solutions & Service Directory | GENZLOG",
  description:
    "Explore our complete service catalogue across 12 digital categories: personalised celebration websites, business platforms, web applications, e-commerce, tracking systems, and custom software.",
};

export default function ServicesPage() {
  return (
    <main className="pt-12 sm:pt-16 pb-24 bg-[#050505] min-h-screen text-white">
      {/* 1. Page Hero Introduction (Strictly Preserved) */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24 mb-16 sm:mb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-[#303030]">
          <div className="max-w-4xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-white uppercase tracking-[0.2em] font-semibold">
                {"// COMPLETE SERVICE DIRECTORY"}
              </span>
              <span className="text-[#666666]">•</span>
              <span className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider">
                12 SPECIALISED CATEGORIES IN 4 GROUPS
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight uppercase text-white font-display leading-[0.95]">
              YOUR IDEA. <br />
              <span className="text-white">OUR DIGITAL SOLUTION.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#CCCCCC] max-w-3xl leading-relaxed font-normal">
              From personalised websites to professional business platforms and custom applications, we design and develop digital experiences around your requirements.
            </p>

            <div className="pt-2 text-xs sm:text-sm font-mono text-[#A3A3A3] flex items-start gap-2 bg-[#111111] p-4 rounded-xl border border-[#262626] max-w-2xl">
              <Sparkles className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <span>
                Have an idea that doesn&apos;t fit a standard category? Tell us what you want to build. We&apos;ll help you explore a suitable solution.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            <Link
              href="/pricing"
              className="px-6 py-4 bg-[#111111] border border-[#303030] hover:border-white text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>View Starting Prices</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </Link>

            <ShiningButton
              href="/contact"
              variant="white"
              size="lg"
            >
              <span>Discuss Your Project</span>
              <ArrowUpRight className="w-4 h-4 text-[#050505]" />
            </ShiningButton>
          </div>
        </div>
      </div>

      {/* 2. Spacious Editorial Service Directory Component */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24 mb-16 sm:mb-24">
        <ErrorBoundary
          title="Service Directory Unavailable"
          message="An error occurred while rendering the service directory. You can retry loading the directory or reach us directly."
        >
          <Services />
        </ErrorBoundary>
      </div>

      {/* 3. Dedicated Custom Solutions Section ("YOUR IDEA. BUILT YOUR WAY.") */}
      <CustomSolutionsSection />

      {/* 4. Core Security, Privacy & Reliability Section */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24 pt-16 sm:pt-24 space-y-24">

        {/* 4. Core Security, Privacy & Reliability Section */}
        <section className="pt-12 border-t border-[#303030] space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#222222]">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-white" />
                <span className="text-xs font-mono text-white uppercase tracking-[0.2em] font-semibold">
                  {"// TRUST & VERIFIED ENGINEERING"}
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold uppercase text-white font-display">
                SECURITY. PRIVACY. RELIABILITY.
              </h2>
              <p className="text-sm sm:text-base text-[#A3A3A3] max-w-3xl mt-4 leading-relaxed font-normal">
                Every project is developed with security, privacy, and reliability in mind. We apply appropriate security practices, validate inputs, protect sensitive information, and test functionality according to the project&apos;s requirements.
              </p>
            </div>

            <div className="text-xs font-mono text-[#888888] bg-[#111111] p-4 rounded-xl border border-[#2A2A2A] max-w-sm">
              <strong className="text-white block mb-1">YOUR DATA DESERVES PROTECTION.</strong>
              We design digital experiences with privacy in mind, minimise unnecessary data collection, and use appropriate safeguards to help protect customer information.
            </div>
          </div>

          {/* BUILT WITH SECURITY IN MIND: 4 Feature Blocks */}
          <div className="space-y-6">
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
                  className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-6 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
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
                  <div className="pt-2 text-[10px] font-mono text-[#666666] border-t border-[#1F1F1F]">
                    VERIFIED ENGINEERING
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Security Considerations by Service Category */}
          <div className="bg-[#0B0B0B] border border-[#2A2A2A] rounded-2xl p-8 sm:p-10 space-y-6">
            <div>
              <span className="text-xs font-mono text-white uppercase tracking-wider font-semibold">
                {"// RISK-APPROPRIATE CONTROLS"}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold uppercase text-white font-display mt-1">
                Security Considerations by Service
              </h3>
              <p className="text-xs sm:text-sm text-[#888888] mt-1 max-w-3xl">
                We select appropriate security controls based on each project&apos;s functionality and risk:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 text-xs">
              <div className="p-5 bg-[#121212] rounded-xl border border-[#242424] space-y-2">
                <strong className="text-white font-bold block text-sm">
                  Business &amp; Informational Websites
                </strong>
                <p className="text-[#A3A3A3] leading-relaxed">
                  HTTPS configuration where supported by the hosting environment, input validation, secure contact forms, protection against relevant common web vulnerabilities, and appropriate handling of enquiry information.
                </p>
              </div>

              <div className="p-5 bg-[#121212] rounded-xl border border-[#242424] space-y-2">
                <strong className="text-white font-bold block text-sm">
                  E-commerce Websites
                </strong>
                <p className="text-[#A3A3A3] leading-relaxed">
                  Trusted payment gateway integrations, appropriate authentication and authorisation, secure order and customer-data handling. We never store raw payment-card details unless operating within compliant payment infrastructure.
                </p>
              </div>

              <div className="p-5 bg-[#121212] rounded-xl border border-[#242424] space-y-2">
                <strong className="text-white font-bold block text-sm">
                  Billing &amp; Invoice Systems
                </strong>
                <p className="text-[#A3A3A3] leading-relaxed">
                  Access controls for sensitive records, server-side validation, appropriate protection of stored business data, and backups and recovery planning where included in the project.
                </p>
              </div>

              <div className="p-5 bg-[#121212] rounded-xl border border-[#242424] space-y-2">
                <strong className="text-white font-bold block text-sm">
                  Exam &amp; Quiz Platforms
                </strong>
                <p className="text-[#A3A3A3] leading-relaxed">
                  Server-side validation of scoring and important operations, appropriate access controls, and protection against unauthorised access to restricted results and answer keys.
                </p>
              </div>

              <div className="p-5 bg-[#121212] rounded-xl border border-[#242424] space-y-2">
                <strong className="text-white font-bold block text-sm">
                  Live Tracking Applications
                </strong>
                <p className="text-[#A3A3A3] leading-relaxed">
                  Clear location permissions and data-collection practices, access restrictions for location information, protection against exposing private tracking data through public endpoints, and suitable retention policies.
                </p>
              </div>

              <div className="p-5 bg-[#121212] rounded-xl border border-[#242424] space-y-2">
                <strong className="text-white font-bold block text-sm">
                  Custom Websites &amp; Applications
                </strong>
                <p className="text-[#A3A3A3] leading-relaxed">
                  Appropriate authentication and authorisation, secure API design, input validation and output encoding, safe secret and credential management, and testing based on application risks.
                </p>
              </div>
            </div>

            <p className="text-[11px] font-mono text-[#666666]">
              * Note: These are examples of appropriate security considerations. Actual safeguards depend on the agreed scope, technical architecture, and hosting environment.
            </p>
          </div>

          {/* 6. Transparent Security Statement */}
          <div className="p-7 sm:p-8 bg-[#111111] border border-[#2E2E2E] rounded-2xl flex items-start gap-4">
            <Lock className="w-5 h-5 text-white shrink-0 mt-1" />
            <div className="space-y-2 text-xs sm:text-sm">
              <strong className="text-white font-mono uppercase tracking-wider block text-xs">
                GENZLOG Security Transparency Statement
              </strong>
              <p className="text-[#CCCCCC] leading-relaxed">
                GENZLOG takes security and privacy seriously. We apply appropriate safeguards and test project functionality according to the agreed scope. No internet-connected system can be guaranteed to be completely free from vulnerabilities, outages, or errors. We explain relevant security responsibilities, third-party dependencies, and ongoing maintenance requirements before project delivery.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
