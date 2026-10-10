"use client";

import React, { useState } from "react";
import {
  COMPLETE_SERVICES,
  ServiceCategory,
} from "@/data/services";
import { DigitalCore3D } from "@/components/DigitalCore3D";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Check,
  AlertCircle,
  Copy,
  Edit3,
  MessageSquare,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { PermissionDeniedState } from "@/components/states/PermissionDeniedState";
import { FormFieldError } from "@/components/states/FormFieldError";

// The 13 options (12 services + Other / Custom Idea)
const CUSTOM_OPTION: ServiceCategory = {
  id: "custom-idea",
  num: "13",
  title: "Other / Custom Idea",
  startingPrice: 0,
  startingPriceFormatted: "Custom Scoping",
  summary: "Experimental web platforms, bespoke APIs, or unlisted interactive experiences.",
  details: "Custom-designed around your unique specifications and architecture.",
  features: ["Custom Architecture", "Bespoke Integrations", "Full Specification Review"],
  formType: "Other / Custom Idea",
  badge: "Custom",
};

const ALL_CATEGORIES: ServiceCategory[] = [...COMPLETE_SERVICES, CUSTOM_OPTION];

const BUDGET_OPTIONS = [
  "₹2,000 – ₹10,000 (Personalized / Event / Interactive)",
  "₹10,000 – ₹15,000 (Company / Bakery / Gaming)",
  "₹15,000 – ₹25,000 (Billing System / Quiz Platform)",
  "₹25,000 – ₹40,000 (E-commerce / Tracking App)",
  "₹40,000+ (Advanced Custom Software)",
  "Flexible / Discuss with team",
];

const TIMELINE_OPTIONS = [
  "1–2 Weeks (Urgent Priority)",
  "2–4 Weeks (Standard Sprint)",
  "1–2 Months (Phased Architecture)",
  "Flexible / No Fixed Deadline",
];

const SCREEN_COUNT_OPTIONS = [
  "Single Landing Page",
  "3–5 Pages (Standard)",
  "6–10 Pages (Expanded)",
  "10+ Screens / Full Web App",
];

const COMMON_INTEGRATIONS = [
  "WhatsApp Direct Action",
  "Payment Gateway (Razorpay/Stripe)",
  "Database & Lead Storage",
  "User Authentication",
  "Interactive Audio/3D",
  "Google Maps / Location",
  "Custom External API",
];

// Helper to construct WhatsApp message
function buildCommandCenterWhatsAppMessage(config: {
  name: string;
  email: string;
  company: string;
  service: string;
  screens: string;
  features: string[];
  integrations: string[];
  referenceUrl: string;
  budget: string;
  timeline: string;
  description: string;
}): string {
  const lines = [
    "NEW PROJECT ENQUIRY — GENZLOG",
    "",
    "Hello GENZLOG! I would like to discuss a project configured through the Command Center.",
    "",
    "CONTACT DETAILS",
    `Name: ${config.name.trim()}`,
    `Email: ${config.email.trim()}`,
    `Organization: ${config.company.trim() || "Not provided"}`,
    "",
    "PROJECT DETAILS",
    `Service: ${config.service}`,
    `Scope: ${config.screens || "Standard scope"}`,
    `Features: ${config.features.length > 0 ? config.features.join(", ") : "Standard package"}`,
    `Integrations: ${config.integrations.length > 0 ? config.integrations.join(", ") : "Standard"}`,
    `Reference: ${config.referenceUrl.trim() || "None"}`,
    `Budget: ${config.budget || "Not specified"}`,
    `Preferred timeline: ${config.timeline || "Flexible"}`,
    "",
    "PROJECT DESCRIPTION",
    config.description.trim(),
    "",
    "Sent through the GENZLOG Command Center.",
  ];

  return `https://wa.me/918072522246?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function ProjectCommandCenter() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Configuration State with lazy URL query preselection
  const [selectedService, setSelectedService] = useState<ServiceCategory>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const requested = params.get("service");
      if (requested) {
        const found = ALL_CATEGORIES.find(
          (c) =>
            c.formType.toLowerCase() === requested.toLowerCase() ||
            c.title.toLowerCase() === requested.toLowerCase() ||
            c.id.toLowerCase() === requested.toLowerCase()
        );
        if (found) return found;
      }
    }
    return ALL_CATEGORIES[3];
  });

  const [screens, setScreens] = useState<string>("3–5 Pages (Standard)");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const requested = params.get("service");
      if (requested) {
        const found = ALL_CATEGORIES.find(
          (c) =>
            c.formType.toLowerCase() === requested.toLowerCase() ||
            c.title.toLowerCase() === requested.toLowerCase() ||
            c.id.toLowerCase() === requested.toLowerCase()
        );
        if (found && found.features && found.features.length > 0) {
          return found.features.slice(0, 3);
        }
      }
    }
    return ALL_CATEGORIES[3].features ? ALL_CATEGORIES[3].features.slice(0, 3) : [];
  });
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [referenceUrl, setReferenceUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [budget, setBudget] = useState<string>("₹10,000 – ₹15,000 (Company / Bakery / Gaming)");
  const [timeline, setTimeline] = useState<string>("2–4 Weeks (Standard Sprint)");

  // Client Details
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [company, setCompany] = useState<string>("");

  // UI / Submission state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showClipboardFallback, setShowClipboardFallback] = useState<boolean>(false);
  const [savedInquiryId, setSavedInquiryId] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<{
    persisted: boolean;
    emailSent: boolean;
    message: string;
  } | null>(null);
  const [preparedWhatsAppUrl, setPreparedWhatsAppUrl] = useState<string>("");

  // Update suggested features when service changes
  const handleSelectService = (service: ServiceCategory) => {
    setSelectedService(service);
    if (service.features && service.features.length > 0) {
      setSelectedFeatures(service.features.slice(0, 3));
    } else {
      setSelectedFeatures([]);
    }
  };

  const toggleFeature = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feat));
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  const toggleIntegration = (integ: string) => {
    if (selectedIntegrations.includes(integ)) {
      setSelectedIntegrations(selectedIntegrations.filter((i) => i !== integ));
    } else {
      setSelectedIntegrations([...selectedIntegrations, integ]);
    }
  };

  // Step validation
  const validateCurrentStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 2) {
      if (!description.trim()) {
        errs.description = "Please provide brief requirements or description of what you need.";
      } else if (description.trim().length < 10) {
        errs.description = "Please provide at least 10 characters describing your project.";
      }
    }

    if (step === 4) {
      if (!name.trim()) {
        errs.name = "Full name is required.";
      }
      if (!email.trim()) {
        errs.email = "Email address is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errs.email = "Please enter a valid email address.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  // Submit and WhatsApp handoff
  const handleSubmitAndLaunchWhatsApp = async () => {
    if (!validateCurrentStep(4) || !validateCurrentStep(2)) {
      return;
    }

    setErrors({});

    const config = {
      name,
      email,
      company,
      service: selectedService.formType,
      screens,
      features: selectedFeatures,
      integrations: selectedIntegrations,
      referenceUrl,
      budget,
      timeline,
      description,
    };

    // 1. Construct the WhatsApp URL
    const waUrl = buildCommandCenterWhatsAppMessage(config);
    setPreparedWhatsAppUrl(waUrl);

    // 2. Open WhatsApp immediately in user-initiated context to bypass popup blockers
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }

    setLoading(true);

    // 3. Concurrently preserve Supabase database persistence, tracking ID, deduplication, and email dispatch
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || undefined,
          service: selectedService.formType,
          budget: budget || "Not specified",
          timeline: timeline || "Flexible",
          description: `[Scope: ${screens}] [Features: ${selectedFeatures.join(", ") || "Standard"}] [Integrations: ${selectedIntegrations.join(", ") || "None"}] [Ref: ${referenceUrl || "N/A"}]\n\nRequirements:\n${description.trim()}`,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success && result.persisted) {
        setSavedInquiryId(result.inquiryId || `GZ-${Date.now().toString(36).toUpperCase()}`);
        setServerStatus({
          persisted: true,
          emailSent: !!result.emailSent,
          message:
            result.message ||
            "Your project brief is safely registered in our database and prepared in WhatsApp.",
        });
      } else {
        // Honest messaging: Do not falsely claim persistence if server did not confirm it
        setServerStatus({
          persisted: false,
          emailSent: false,
          message:
            "Your enquiry is prepared in WhatsApp. Please review and tap Send to contact GENZLOG.",
        });
      }
    } catch (err) {
      console.warn("Command Center backend dispatch notice:", err);
      setServerStatus({
        persisted: false,
        emailSent: false,
        message:
          "Your enquiry is prepared in WhatsApp. Please review and tap Send to contact GENZLOG.",
      });
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const getSummaryText = () => {
    return [
      "GENZLOG COMMAND CENTER PROJECT BRIEF",
      "==================================",
      `Client: ${name} (${email})`,
      `Organization: ${company || "Not provided"}`,
      `Service: ${selectedService.formType}`,
      `Starting Estimate: ${selectedService.startingPriceFormatted}`,
      `Scope: ${screens}`,
      `Features: ${selectedFeatures.join(", ") || "Standard"}`,
      `Integrations: ${selectedIntegrations.join(", ") || "None"}`,
      `Reference: ${referenceUrl || "None"}`,
      `Budget: ${budget}`,
      `Timeline: ${timeline}`,
      "",
      "Requirements:",
      description,
    ].join("\n");
  };

  const handleCopySummary = async () => {
    const summary = getSummaryText();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summary);
        setCopied(true);
        setShowClipboardFallback(false);
        setTimeout(() => setCopied(false), 2000);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch {
      setShowClipboardFallback(true);
    }
  };

  const resetConfigurator = () => {
    setCurrentStep(1);
    setDescription("");
    setName("");
    setEmail("");
    setCompany("");
    setReferenceUrl("");
    setSubmitted(false);
    setSavedInquiryId(null);
    setServerStatus(null);
    setShowClipboardFallback(false);
    setErrors({});
  };

  return (
    <div className="w-full text-white bg-[#050505] relative overflow-hidden">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 tech-grid opacity-[0.06] pointer-events-none" />

      <div className="relative w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24">
        {/* 1. ASYMMETRIC IMMERSIVE HERO */}
        <section className="pt-12 sm:pt-20 pb-12 sm:pb-20 border-b border-[#222222]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Editorial Headline & Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2.5 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-white font-bold tracking-widest uppercase">
                  GENZLOG / PROJECT COMMAND CENTER
                </span>
                <span className="text-[#444444]">•</span>
                <span className="text-[#888888] uppercase tracking-wider hidden sm:inline">
                  CONFIGURATOR V2.5
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold uppercase tracking-tighter text-white font-display leading-[0.9] select-none">
                YOUR IDEA. <br />
                <span className="text-white">LET&apos;S MAKE IT REAL.</span>
              </h1>

              <p className="text-base sm:text-xl text-[#A3A3A3] max-w-2xl leading-relaxed font-normal">
                Tell us what you&apos;re imagining. We&apos;ll help shape it into a digital experience built around your requirements.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-mono text-[#666666]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#444444] rounded-full" />
                  <span>12 VERIFIED CATEGORIES</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#444444] rounded-full" />
                  <span>TRANSPARENT ENTRY PRICING</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#444444] rounded-full" />
                  <span>DIRECT WHATSAPP DISPATCH</span>
                </div>
              </div>
            </div>

            {/* Right Column: Animated 3D Digital Core */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full relative bg-[#090909]/80 border border-[#222222] rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
                <DigitalCore3D />
                <div className="pt-4 border-t border-[#1C1C1C] flex items-center justify-between text-[11px] font-mono text-[#666666]">
                  <span>GENZLOG CORE SYSTEM</span>
                  <span className="text-[#A3A3A3]">ACTIVE • INTERACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. STEP PROGRESS INDICATOR */}
        <section className="py-8 border-b border-[#222222]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-xs font-mono uppercase text-[#888888]">
              CONFIGURATOR PROGRESS // STEP 0{currentStep} OF 05
            </div>

            {/* Step navigation pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {[
                { step: 1, title: "CATEGORY" },
                { step: 2, title: "SCOPE" },
                { step: 3, title: "BUDGET" },
                { step: 4, title: "CONTACT" },
                { step: 5, title: "REVIEW" },
              ].map((item) => (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => {
                    // Only allow jumping back or to valid steps
                    if (item.step < currentStep || validateCurrentStep(currentStep)) {
                      setCurrentStep(item.step);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
                    currentStep === item.step
                      ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                      : item.step < currentStep
                      ? "bg-[#141414] text-[#CCCCCC] border border-[#333333] hover:border-white"
                      : "bg-[#0A0A0A] text-[#555555] border border-[#1A1A1A] cursor-not-allowed"
                  }`}
                >
                  <span>0{item.step}</span>
                  <span className="hidden sm:inline">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 3. MULTI-STEP INTERACTIVE CONFIGURATOR */}
        <section className="py-12 sm:py-20">
          <div className="w-full">
            {submitted ? (
              /* FINAL CONFIRMATION & WHATSAPP HANDOFF COMPLETE */
              <div className="max-w-3xl mx-auto p-8 sm:p-14 bg-[#0C0C0C] border border-[#303030] rounded-3xl text-center space-y-7 shadow-2xl">
                <div className="w-16 h-16 bg-[#161616] border border-[#333333] text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>

                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#161616] border border-[#333333] rounded-full text-xs font-mono text-[#A3A3A3]">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span className="text-white font-semibold">WHATSAPP HANDOFF READY</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold uppercase text-white font-display">
                    Project Brief Prepared
                  </h2>
                  <p className="text-base text-[#CCCCCC] max-w-lg mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{name}</strong>. Your project brief for{" "}
                    <strong className="text-white">{selectedService.formType}</strong> has been prepared with all your selected features and specifications.
                  </p>
                </div>

                {/* Primary Action Button */}
                {preparedWhatsAppUrl && (
                  <div className="pt-2">
                    <a
                      href={preparedWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-9 py-4.5 bg-white hover:bg-[#F0F0F0] text-[#050505] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                    >
                      <MessageSquare className="w-4 h-4 text-[#050505]" />
                      <span>OPEN IN WHATSAPP ↗</span>
                    </a>
                  </div>
                )}

                {/* Honest Database Status */}
                <div className="pt-2">
                  {serverStatus?.persisted ? (
                    <p className="text-xs text-[#888888] font-mono max-w-md mx-auto">
                      ✓ Database recording confirmed: Tracking ID [{savedInquiryId}].
                    </p>
                  ) : (
                    <p className="text-xs text-[#888888] font-mono max-w-md mx-auto">
                      Your enquiry is ready in WhatsApp. Review it and tap Send.
                    </p>
                  )}
                </div>

                {/* Clipboard fallback if restricted */}
                {showClipboardFallback && (
                  <div className="pt-2 max-w-md mx-auto text-left">
                    <PermissionDeniedState
                      permissionType="clipboard"
                      title="Clipboard Access Restricted"
                      description="Your browser restricted automatic clipboard copy. You can copy the brief manually below."
                      fallbackContent={getSummaryText()}
                      onRetry={() => setShowClipboardFallback(false)}
                    />
                  </div>
                )}

                {savedInquiryId && (
                  <div className="p-4 bg-[#141414] border border-[#2B2B2B] rounded-xl font-mono text-xs text-white max-w-md mx-auto flex items-center justify-between gap-4">
                    <span>Tracking ID: <strong className="text-white">{savedInquiryId}</strong></span>
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="text-white hover:text-[#A3A3A3] flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy Brief"}</span>
                    </button>
                  </div>
                )}

                <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={resetConfigurator}
                    className="px-6 py-3 bg-[#161616] hover:bg-[#202020] text-white border border-[#303030] hover:border-[#555555] font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Configure Another Project
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* ================= STEP 01: CATEGORY SELECTION ================= */}
                {currentStep === 1 && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
                      <div>
                        <span className="text-xs font-mono text-[#888888] uppercase tracking-wider block mb-1">
                          STEP 01 // CATEGORY
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white font-display">
                          WHAT ARE WE BUILDING?
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm font-mono text-[#888888] max-w-md">
                        Select from our 12 engineering categories or define a custom scope. Starting estimates reflect entry-level configurations.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {ALL_CATEGORIES.map((cat) => {
                        const isSelected = selectedService.id === cat.id;
                        return (
                          <div
                            key={cat.id}
                            onClick={() => handleSelectService(cat)}
                            className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 focus:outline-none focus:ring-1 focus:ring-white group ${
                              isSelected
                                ? "bg-white text-black border-white shadow-[0_10px_35px_rgba(255,255,255,0.15)] scale-[1.01]"
                                : "bg-[#0C0C0C] text-white border-[#222222] hover:border-[#444444] hover:bg-[#121212]"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`font-mono text-xs font-bold ${
                                  isSelected ? "text-black/60" : "text-[#666666]"
                                }`}
                              >
                                {cat.num}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                                  isSelected
                                    ? "bg-black text-white"
                                    : "bg-[#181818] border border-[#2C2C2C] text-white"
                                }`}
                              >
                                {cat.startingPriceFormatted}
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              <h3
                                className={`text-base sm:text-lg font-bold font-display uppercase tracking-tight leading-snug ${
                                  isSelected ? "text-black" : "text-white"
                                }`}
                              >
                                {cat.title}
                              </h3>
                              <p
                                className={`text-xs leading-relaxed line-clamp-2 ${
                                  isSelected ? "text-black/75" : "text-[#888888]"
                                }`}
                              >
                                {cat.summary}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono">
                              <span className={isSelected ? "text-black font-semibold" : "text-[#666666]"}>
                                {isSelected ? "ACTIVE SELECTION" : "TAP TO SELECT"}
                              </span>
                              <ArrowRight
                                className={`w-3.5 h-3.5 ${
                                  isSelected ? "text-black" : "text-[#666666] group-hover:text-white"
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-8 border-t border-[#222222] flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-8 py-4 bg-white hover:bg-[#F0F0F0] text-[#050505] font-bold text-xs uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2 shadow-lg cursor-pointer"
                      >
                        <span>NEXT: DEFINE SCOPE</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ================= STEP 02: PROJECT SCOPE ================= */}
                {currentStep === 2 && (
                  <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
                      <div>
                        <span className="text-xs font-mono text-[#888888] uppercase tracking-wider block mb-1">
                          STEP 02 // SCOPE &amp; FEATURES
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white font-display">
                          PROJECT SPECIFICATIONS
                        </h2>
                      </div>
                      <div className="text-xs font-mono bg-[#111111] border border-[#2B2B2B] px-3.5 py-1.5 rounded-full text-white">
                        CATEGORY: {selectedService.title}
                      </div>
                    </div>

                    {/* Features selection */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-white">
                        Recommended Deliverables &amp; Features <span className="text-[#888888] text-xs font-normal">(Select all that apply)</span>
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {(selectedService.features || [
                          "Responsive Layouts",
                          "Contact Inquiry Form",
                          "SEO Optimization",
                        ]).map((feat) => {
                          const active = selectedFeatures.includes(feat);
                          return (
                            <button
                              key={feat}
                              type="button"
                              onClick={() => toggleFeature(feat)}
                              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-2 ${
                                active
                                  ? "bg-white text-black font-bold shadow-md"
                                  : "bg-[#111111] text-[#A3A3A3] border border-[#2A2A2A] hover:border-white"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-black" : "bg-[#444444]"}`} />
                              <span>{feat}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Approximate Pages / Screens */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-white">
                        Approximate Page or Screen Scope
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {SCREEN_COUNT_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setScreens(opt)}
                            className={`p-4 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                              screens === opt
                                ? "bg-white text-black border-white font-bold"
                                : "bg-[#111111] text-[#A3A3A3] border-[#2A2A2A] hover:border-[#555555]"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Required Integrations */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-white">
                        Required System Integrations <span className="text-[#888888] text-xs font-normal">(Optional)</span>
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {COMMON_INTEGRATIONS.map((integ) => {
                          const active = selectedIntegrations.includes(integ);
                          return (
                            <button
                              key={integ}
                              type="button"
                              onClick={() => toggleIntegration(integ)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                                active
                                  ? "bg-white text-black font-bold"
                                  : "bg-[#0E0E0E] text-[#888888] border border-[#262626] hover:border-[#666666]"
                              }`}
                            >
                              {integ}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Optional Reference URL */}
                    <div className="space-y-2">
                      <label htmlFor="ref-url" className="block text-sm font-medium text-white">
                        Reference Website or Design Link <span className="text-[#888888] text-xs font-normal">(Optional)</span>
                      </label>
                      <input
                        id="ref-url"
                        type="url"
                        value={referenceUrl}
                        onChange={(e) => setReferenceUrl(e.target.value)}
                        placeholder="https://example.com/reference"
                        className="w-full bg-[#111111] border border-[#2A2A2A] focus:border-white focus:ring-1 focus:ring-white rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#555555] outline-none transition-all"
                      />
                    </div>

                    {/* Detailed Requirements Textarea */}
                    <div className="space-y-2">
                      <label htmlFor="project-desc" className="block text-sm font-medium text-white">
                        Project Description &amp; Requirements <span className="text-white">*</span>
                      </label>
                      <textarea
                        id="project-desc"
                        rows={5}
                        maxLength={3000}
                        aria-required="true"
                        aria-invalid={!!errors.description}
                        aria-describedby={errors.description ? "project-desc-error" : undefined}
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
                        }}
                        placeholder="Tell us about the target audience, required workflows, brand aesthetics, and key milestones..."
                        className={`w-full bg-[#111111] border rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#555555] outline-none transition-all resize-none leading-relaxed ${
                          errors.description
                            ? "border-red-500"
                            : "border-[#2A2A2A] focus:border-white focus:ring-1 focus:ring-white"
                        }`}
                      />
                      <FormFieldError id="project-desc-error" error={errors.description} />
                    </div>

                    <div className="pt-8 border-t border-[#222222] flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-4 bg-[#141414] hover:bg-[#1E1E1E] text-white border border-[#2A2A2A] font-bold text-xs uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>PREVIOUS</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-8 py-4 bg-white hover:bg-[#F0F0F0] text-[#050505] font-bold text-xs uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2 shadow-lg cursor-pointer"
                      >
                        <span>NEXT: BUDGET &amp; TIMELINE</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ================= STEP 03: BUDGET & TIMELINE ================= */}
                {currentStep === 3 && (
                  <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
                      <div>
                        <span className="text-xs font-mono text-[#888888] uppercase tracking-wider block mb-1">
                          STEP 03 // BUDGET &amp; SCHEDULE
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white font-display">
                          BUDGET AND TIMELINE
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm font-mono text-[#888888] max-w-sm">
                        Help us scope delivery timelines and resource allocations accurately.
                      </p>
                    </div>

                    {/* Budget Options */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-white">
                        Indicative Budget Range
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {BUDGET_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setBudget(opt)}
                            className={`p-4 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                              budget === opt
                                ? "bg-white text-black border-white font-bold shadow-md"
                                : "bg-[#111111] text-[#A3A3A3] border-[#2A2A2A] hover:border-[#555555]"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Timeline Options */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-white">
                        Target Delivery Timeline
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {TIMELINE_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setTimeline(opt)}
                            className={`p-4 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                              timeline === opt
                                ? "bg-white text-black border-white font-bold shadow-md"
                                : "bg-[#111111] text-[#A3A3A3] border-[#2A2A2A] hover:border-[#555555]"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Advisory Statement */}
                    <div className="p-4 bg-[#111111] border border-[#262626] rounded-xl text-xs font-mono text-[#888888] flex items-start gap-3">
                      <ShieldCheck className="w-4 h-4 text-white shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        <strong className="text-white">Commercial Advisory: </strong>
                        The final quotation depends on requirements, complexity, integrations, and agreed scope. Entry prices represent baseline configurations.
                      </p>
                    </div>

                    <div className="pt-8 border-t border-[#222222] flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-4 bg-[#141414] hover:bg-[#1E1E1E] text-white border border-[#2A2A2A] font-bold text-xs uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>PREVIOUS</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-8 py-4 bg-white hover:bg-[#F0F0F0] text-[#050505] font-bold text-xs uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2 shadow-lg cursor-pointer"
                      >
                        <span>NEXT: CLIENT CREDENTIALS</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ================= STEP 04: CONTACT DETAILS ================= */}
                {currentStep === 4 && (
                  <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
                      <div>
                        <span className="text-xs font-mono text-[#888888] uppercase tracking-wider block mb-1">
                          STEP 04 // CLIENT DETAILS
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white font-display">
                          CONTACT INFORMATION
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm font-mono text-[#888888] max-w-sm">
                        Provide your primary details for quotation response and scoping meetings.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="client-name" className="block text-sm font-medium text-white">
                          Full Name <span className="text-white">*</span>
                        </label>
                        <input
                          id="client-name"
                          type="text"
                          maxLength={100}
                          aria-required="true"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "client-name-error" : undefined}
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                          }}
                          placeholder="Jane Doe"
                          className={`w-full bg-[#111111] border rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#555555] outline-none transition-all ${
                            errors.name
                              ? "border-red-500"
                              : "border-[#2A2A2A] focus:border-white focus:ring-1 focus:ring-white"
                          }`}
                        />
                        <FormFieldError id="client-name-error" error={errors.name} />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="client-email" className="block text-sm font-medium text-white">
                          Email Address <span className="text-white">*</span>
                        </label>
                        <input
                          id="client-email"
                          type="email"
                          maxLength={120}
                          aria-required="true"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "client-email-error" : undefined}
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                          }}
                          placeholder="jane@company.com"
                          className={`w-full bg-[#111111] border rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#555555] outline-none transition-all ${
                            errors.email
                              ? "border-red-500"
                              : "border-[#2A2A2A] focus:border-white focus:ring-1 focus:ring-white"
                          }`}
                        />
                        <FormFieldError id="client-email-error" error={errors.email} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="client-company" className="block text-sm font-medium text-white">
                        Organization / Brand <span className="text-[#888888] text-xs font-normal">(Optional)</span>
                      </label>
                      <input
                        id="client-company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Company, studio, or creator handle"
                        className="w-full bg-[#111111] border border-[#2A2A2A] focus:border-white focus:ring-1 focus:ring-white rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#555555] outline-none transition-all"
                      />
                    </div>

                    <div className="pt-8 border-t border-[#222222] flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-4 bg-[#141414] hover:bg-[#1E1E1E] text-white border border-[#2A2A2A] font-bold text-xs uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>PREVIOUS</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-8 py-4 bg-white hover:bg-[#F0F0F0] text-[#050505] font-bold text-xs uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2 shadow-lg cursor-pointer"
                      >
                        <span>NEXT: REVIEW BRIEF</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ================= STEP 05: REVIEW & TRANSMISSION ================= */}
                {currentStep === 5 && (
                  <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
                      <div>
                        <span className="text-xs font-mono text-[#888888] uppercase tracking-wider block mb-1">
                          STEP 05 // REVIEW &amp; TRANSMIT
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white font-display">
                          CONFIRM PROJECT BRIEF
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopySummary}
                        className="px-3.5 py-1.5 bg-[#141414] hover:bg-white hover:text-black border border-[#2E2E2E] rounded-lg text-xs font-mono transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? "Copied" : "Copy Summary"}</span>
                      </button>
                    </div>

                    {showClipboardFallback && (
                      <PermissionDeniedState
                        permissionType="clipboard"
                        title="Clipboard Access Restricted"
                        description="Your browser restricted automatic clipboard copy. You can copy the brief manually below."
                        fallbackContent={getSummaryText()}
                        onRetry={() => setShowClipboardFallback(false)}
                      />
                    )}

                    {/* Architectural Summary Grid */}
                    <div className="bg-[#0C0C0C] border border-[#262626] rounded-2xl p-6 sm:p-8 space-y-6">
                      {/* Section 1: Service */}
                      <div className="flex items-start justify-between pb-6 border-b border-[#1C1C1C]">
                        <div className="space-y-1">
                          <span className="text-xs font-mono text-[#777777] uppercase block">
                            PROJECT CATEGORY &amp; ESTIMATE
                          </span>
                          <h3 className="text-xl font-bold uppercase text-white font-display">
                            {selectedService.title}
                          </h3>
                          <p className="text-xs font-mono text-[#CCCCCC]">
                            Starting Entry: {selectedService.startingPriceFormatted}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-xs font-mono text-[#A3A3A3] hover:text-white flex items-center gap-1 underline cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Change</span>
                        </button>
                      </div>

                      {/* Section 2: Scope & Features */}
                      <div className="flex items-start justify-between pb-6 border-b border-[#1C1C1C]">
                        <div className="space-y-2 max-w-xl">
                          <span className="text-xs font-mono text-[#777777] uppercase block">
                            SCOPE &amp; DELIVERABLES
                          </span>
                          <div className="text-xs font-mono text-white">
                            <strong>Screen Scale: </strong> {screens}
                          </div>
                          {selectedFeatures.length > 0 && (
                            <div className="text-xs font-mono text-[#A3A3A3]">
                              <strong>Features: </strong> {selectedFeatures.join(", ")}
                            </div>
                          )}
                          {selectedIntegrations.length > 0 && (
                            <div className="text-xs font-mono text-[#A3A3A3]">
                              <strong>Integrations: </strong> {selectedIntegrations.join(", ")}
                            </div>
                          )}
                          {referenceUrl && (
                            <div className="text-xs font-mono text-[#A3A3A3] truncate">
                              <strong>Reference: </strong> {referenceUrl}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-xs font-mono text-[#A3A3A3] hover:text-white flex items-center gap-1 underline cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>

                      {/* Section 3: Budget & Timeline */}
                      <div className="flex items-start justify-between pb-6 border-b border-[#1C1C1C]">
                        <div className="space-y-1">
                          <span className="text-xs font-mono text-[#777777] uppercase block">
                            BUDGET &amp; SCHEDULE
                          </span>
                          <div className="text-xs font-mono text-white">
                            <strong>Budget: </strong> {budget}
                          </div>
                          <div className="text-xs font-mono text-white">
                            <strong>Timeline: </strong> {timeline}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="text-xs font-mono text-[#A3A3A3] hover:text-white flex items-center gap-1 underline cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>

                      {/* Section 4: Contact Details */}
                      <div className="flex items-start justify-between pb-6 border-b border-[#1C1C1C]">
                        <div className="space-y-1">
                          <span className="text-xs font-mono text-[#777777] uppercase block">
                            CLIENT CREDENTIALS
                          </span>
                          <div className="text-sm font-bold text-white">
                            {name} {company && <span className="text-[#888888] font-normal">({company})</span>}
                          </div>
                          <div className="text-xs font-mono text-[#A3A3A3]">{email}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(4)}
                          className="text-xs font-mono text-[#A3A3A3] hover:text-white flex items-center gap-1 underline cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>

                      {/* Section 5: Description */}
                      <div className="space-y-2">
                        <span className="text-xs font-mono text-[#777777] uppercase block">
                          SPECIFICATION NOTES
                        </span>
                        <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed whitespace-pre-wrap bg-[#111111] p-4 rounded-xl border border-[#1E1E1E]">
                          {description}
                        </p>
                      </div>
                    </div>

                    {/* Transmission Action Area */}
                    <div className="p-6 bg-[#0E0E0E] border border-[#2B2B2B] rounded-2xl space-y-4">
                      {errors.form && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-xs sm:text-sm flex items-start gap-3">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                          <span>{errors.form}</span>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="px-6 py-4 bg-[#141414] hover:bg-[#1E1E1E] text-white border border-[#2A2A2A] font-bold text-xs uppercase tracking-wider rounded-xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>EDIT PROJECT DETAILS</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSubmitAndLaunchWhatsApp}
                          disabled={loading}
                          className="px-9 py-4 bg-white hover:bg-[#F0F0F0] text-[#050505] font-bold text-xs uppercase tracking-wider rounded-xl transition-all inline-flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4 text-[#050505]" />
                          <span>
                            {loading ? "TRANSMITTING BRIEF..." : "CONTINUE ON WHATSAPP ↗"}
                          </span>
                        </button>
                      </div>

                      <p className="text-xs text-[#888888] text-center leading-relaxed font-mono">
                        Your project details will be prepared in WhatsApp. Review the message and tap Send to contact GENZLOG.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 4. STUDIO CONTACT INFORMATION BAR */}
        <section className="py-12 border-t border-[#222222]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#0A0A0A] border border-[#222222] rounded-2xl flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#888888]">
                <Mail className="w-3.5 h-3.5 text-white" />
                <span className="text-white font-bold uppercase tracking-wider">EMAIL DIRECT</span>
              </div>
              <a
                href="mailto:genzlog.contact@gmail.com"
                className="text-base font-mono font-bold text-white hover:text-[#CCCCCC] transition-colors break-all flex items-center justify-between"
              >
                <span>genzlog.contact@gmail.com</span>
                <ArrowUpRight className="w-4 h-4 text-[#777777]" />
              </a>
            </div>

            <div className="p-6 bg-[#0A0A0A] border border-[#222222] rounded-2xl flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#888888]">
                <Phone className="w-3.5 h-3.5 text-white" />
                <span className="text-white font-bold uppercase tracking-wider">DIRECT PHONE</span>
              </div>
              <a
                href="tel:+918072522246"
                className="text-lg font-mono font-bold text-white hover:text-[#CCCCCC] transition-colors flex items-center justify-between"
              >
                <span>+91 80725 22246</span>
                <ArrowUpRight className="w-4 h-4 text-[#777777]" />
              </a>
            </div>

            <div className="p-6 bg-[#0A0A0A] border border-[#222222] rounded-2xl flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#888888]">
                <MessageSquare className="w-3.5 h-3.5 text-white" />
                <span className="text-white font-bold uppercase tracking-wider">DIRECT WHATSAPP</span>
              </div>
              <a
                href="https://wa.me/918072522246"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-mono font-bold text-white hover:text-[#CCCCCC] transition-colors flex items-center justify-between"
              >
                <span>Chat on WhatsApp</span>
                <ArrowUpRight className="w-4 h-4 text-[#777777]" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
