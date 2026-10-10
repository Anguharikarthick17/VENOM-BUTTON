"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  AlertCircle,
  Copy,
  Mail,
  Phone,
  MessageSquare,
  ChevronDown,
  FileDown,
  Code2,
  Smartphone,
  Headphones,
} from "lucide-react";
import { ShiningButton } from "@/components/ui/ShiningButton";
import { generateProjectBriefPdf } from "@/lib/generateProjectBriefPdf";
import {
  SERVICE_CHOICES,
  SERVICE_STARTER_DESCRIPTIONS,
  resolveServiceFromQuery,
} from "@/lib/servicePrefill";
import { FormFieldError } from "@/components/states/FormFieldError";
import { PermissionDeniedState } from "@/components/states/PermissionDeniedState";

const BUDGET_CHOICES = [
  "₹2,000 – ₹10,000 (Personalized / Event / Interactive)",
  "₹10,000 – ₹15,000 (Company / Bakery / Gaming)",
  "₹15,000 – ₹25,000 (Billing System / Quiz Platform)",
  "₹25,000 – ₹40,000 (E-commerce / Tracking App)",
  "₹40,000+ (Advanced Custom Software)",
  "Flexible / Discuss with team",
];

const TRUST_POINTS = [
  {
    number: "01",
    tag: "CUSTOM-BUILT",
    description: "Tailored to your business and requirements.",
    icon: Code2,
  },
  {
    number: "02",
    tag: "RESPONSIVE BY DESIGN",
    description: "Designed to work across desktop, tablet, and mobile.",
    icon: Smartphone,
  },
  {
    number: "03",
    tag: "DIRECT COMMUNICATION",
    description: "Discuss your project directly with GENZLOG.",
    icon: Headphones,
  },
];

/**
 * Builds the professional WhatsApp text template adhering to brand standards.
 */
function formatWhatsAppText(data: {
  name: string;
  email: string;
  service: string;
  budget: string;
  description: string;
}): string {
  const budgetText =
    data.budget && data.budget.trim() ? data.budget.trim() : "Not specified";

  const messageLines = [
    "*GENZLOG — NEW PROJECT ENQUIRY*",
    "",
    "Hello GENZLOG Team,",
    "",
    "I would like to discuss a website or digital project.",
    "",
    "*CLIENT DETAILS*",
    `Name: ${data.name.trim()}`,
    `Email: ${data.email.trim()}`,
    "",
    "*PROJECT DETAILS*",
    `Project Type: ${data.service}`,
    `Budget Range: ${budgetText}`,
    "",
    "*PROJECT DESCRIPTION*",
    data.description.trim(),
    "",
    "*NEXT STEPS*",
    "Please review my requirements and share the recommended approach, proposed scope, estimated timeline, and quotation.",
    "",
    "Thank you.",
  ];

  return messageLines.join("\n");
}

/**
 * Encodes the professional WhatsApp message with the configured business number.
 */
function buildWhatsAppUrl(data: {
  name: string;
  email: string;
  service: string;
  budget: string;
  description: string;
}): string {
  return `https://wa.me/918072522246?text=${encodeURIComponent(
    formatWhatsAppText(data)
  )}`;
}

export function ContactSection() {
  const searchParams = useSearchParams();
  const serviceQuery = searchParams ? searchParams.get("service") : null;

  // Track if visitor has manually typed/edited their description to prevent overwriting
  const hasUserEditedDescription = useRef<boolean>(false);

  // Initial state setup with safe query pre-resolution and local draft restoration
  const [formData, setFormData] = useState(() => {
    let initialService = "Company & Professional Website";
    let initialDescription = "";
    let initialName = "";
    let initialEmail = "";
    let initialBudget = "";

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryVal = params.get("service");
      if (queryVal) {
        const resolved = resolveServiceFromQuery(queryVal);
        if (resolved) {
          initialService = resolved.selectedService;
          initialDescription = resolved.starterDescription;
        }
      }

      try {
        const savedDraft = sessionStorage.getItem("genzlog_contact_draft");
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed && typeof parsed === "object") {
            if (parsed.name) initialName = parsed.name;
            if (parsed.email) initialEmail = parsed.email;
            if (parsed.service && !queryVal) initialService = parsed.service;
            if (parsed.budget) initialBudget = parsed.budget;
            if (parsed.description && !queryVal) initialDescription = parsed.description;
          }
        }
      } catch {
        // sessionStorage disabled or unavailable
      }
    }

    return {
      name: initialName,
      email: initialEmail,
      service: initialService,
      budget: initialBudget,
      description: initialDescription,
    };
  });

  // Synchronize search params cleanly when navigated with query
  useEffect(() => {
    if (!serviceQuery) return;

    const resolved = resolveServiceFromQuery(serviceQuery);
    if (!resolved) return;

    setFormData((prev) => {
      const shouldUpdateDesc =
        !hasUserEditedDescription.current || !prev.description.trim();

      return {
        ...prev,
        service: resolved.selectedService,
        description: shouldUpdateDesc
          ? resolved.starterDescription
          : prev.description,
      };
    });
  }, [serviceQuery]);

  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const spotlightRaf = useRef<number | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [generatingPdf, setGeneratingPdf] = useState<boolean>(false);
  const [pdfDownloaded, setPdfDownloaded] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showClipboardFallback, setShowClipboardFallback] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [savedInquiryId, setSavedInquiryId] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<{
    persisted: boolean;
    emailSent: boolean;
    message: string;
  } | null>(null);

  // Preserve unsaved form changes in sessionStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && !submitted) {
        sessionStorage.setItem("genzlog_contact_draft", JSON.stringify(formData));
      }
    } catch {
      // Ignore storage errors
    }
  }, [formData, submitted]);

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (spotlightRaf.current) cancelAnimationFrame(spotlightRaf.current);
    };
  }, []);

  // Focus the first invalid field for keyboard & screen reader accessibility
  const focusFirstInvalidField = (errs: Record<string, string>) => {
    const fieldOrder = ["name", "email", "service", "budget", "description"];
    for (const field of fieldOrder) {
      if (errs[field]) {
        const el = document.getElementById(`contact-${field}`);
        if (el) {
          el.focus();
          break;
        }
      }
    }
  };

  // Direct RAF-based spotlight tracking that avoids continuous React re-renders
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlightRef.current) return;
    if (typeof window !== "undefined" && (!window.matchMedia("(hover: hover)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (spotlightRaf.current) cancelAnimationFrame(spotlightRaf.current);
    spotlightRaf.current = requestAnimationFrame(() => {
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(750px circle at ${x}px ${y}px, rgba(255, 255, 255, 0.06), transparent 60%)`;
      }
      spotlightRaf.current = null;
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = "Please enter your name";
    } else if (formData.name.trim().length > 100) {
      errs.name = "Full name cannot exceed 100 characters";
    }

    if (!formData.email.trim()) {
      errs.email = "Please enter your email address";
    } else if (formData.email.trim().length > 120) {
      errs.email = "Email address cannot exceed 120 characters";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address";
    }

    if (!formData.description.trim()) {
      errs.description = "Please tell us about your project requirements";
    } else if (formData.description.trim().length < 10) {
      errs.description = "Please provide at least 10 characters describing your project";
    } else if (formData.description.trim().length > 3000) {
      errs.description = "Project description cannot exceed 3,000 characters";
    }

    return errs;
  };

  // Helper when user selects a different service from the dropdown
  const handleServiceChange = (newService: string) => {
    setFormData((prev) => {
      const prevStarter = prev.service
        ? SERVICE_STARTER_DESCRIPTIONS[prev.service] || ""
        : "";
      const isUntouchedOrMatchesPrev =
        !hasUserEditedDescription.current ||
        !prev.description.trim() ||
        prev.description === prevStarter;

      return {
        ...prev,
        service: newService,
        description: isUntouchedOrMatchesPrev
          ? SERVICE_STARTER_DESCRIPTIONS[newService] || prev.description
          : prev.description,
      };
    });
  };

  // 1. Primary Action: Validate form and launch WhatsApp
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      focusFirstInvalidField(validationErrors);
      return;
    }

    setErrors({});

    // Construct the URL-encoded WhatsApp message using current form values
    const generatedUrl = buildWhatsAppUrl(formData);
    setWhatsappUrl(generatedUrl);

    // Open WhatsApp immediately in new tab within user-initiated action
    if (typeof window !== "undefined") {
      window.open(generatedUrl, "_blank", "noopener,noreferrer");
    }

    setLoading(true);

    // Concurrently preserve backend persistence, deduplication, and notification logic with 10s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          service: formData.service,
          budget: formData.budget || "Not specified",
          timeline: "Flexible",
          description: formData.description.trim(),
        }),
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      if (response.ok && result.success && result.persisted) {
        setSavedInquiryId(result.inquiryId || `GZ-${Date.now().toString(36).toUpperCase()}`);
        setServerStatus({
          persisted: true,
          emailSent: !!result.emailSent,
          message:
            result.message ||
            "Your enquiry details have been safely recorded in our database and prepared in WhatsApp.",
        });
        // Clear saved draft only upon confirmed success
        try {
          sessionStorage.removeItem("genzlog_contact_draft");
        } catch {}
      } else if (!response.ok && result.errors) {
        setErrors(result.errors);
        focusFirstInvalidField(result.errors);
        setServerStatus({
          persisted: false,
          emailSent: false,
          message:
            "Your enquiry has been prepared in WhatsApp. Please review and tap Send to contact GENZLOG.",
        });
      } else {
        setServerStatus({
          persisted: false,
          emailSent: false,
          message:
            "Your enquiry has been prepared in WhatsApp. Please review and tap Send to contact GENZLOG.",
        });
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const isTimeout = err instanceof Error && err.name === "AbortError";
      const notice = isTimeout
        ? "Network request timed out. Your enquiry is ready in WhatsApp, and your form inputs remain saved."
        : "Network interruption encountered. Your enquiry is ready in WhatsApp, and your form inputs remain safely preserved.";
      console.warn("[Contact] Backend delivery note:", notice);
      setSubmissionError(notice);
      setServerStatus({
        persisted: false,
        emailSent: false,
        message:
          "Your enquiry has been prepared in WhatsApp. Please review and tap Send to contact GENZLOG.",
      });
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  // 2. Secondary Action: Download Branded PDF Project Brief
  const handleDownloadBrief = async () => {
    setPdfError(null);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      focusFirstInvalidField(validationErrors);
      return;
    }

    setErrors({});
    setGeneratingPdf(true);

    try {
      await generateProjectBriefPdf({
        name: formData.name.trim(),
        email: formData.email.trim(),
        service: formData.service,
        budget: formData.budget || "Not specified",
        description: formData.description.trim(),
        inquiryId: savedInquiryId || undefined,
      });
      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 4000);
    } catch (err) {
      console.error("[Contact] Failed to generate PDF brief:", err);
      setPdfError("Unable to compile PDF at this moment. You can still reach us directly via WhatsApp or email.");
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleCopyMessage = async () => {
    const text = formatWhatsAppText(formData);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
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

  const resetForm = () => {
    hasUserEditedDescription.current = false;
    setFormData({
      name: "",
      email: "",
      service: "Company & Professional Website",
      budget: "",
      description: "",
    });
    setWhatsappUrl("");
    setSubmitted(false);
    setSavedInquiryId(null);
    setServerStatus(null);
    setErrors({});
    setPdfError(null);
    setShowClipboardFallback(false);
    setSubmissionError(null);
    try {
      sessionStorage.removeItem("genzlog_contact_draft");
    } catch {}
  };

  return (
    <section
      id="contact"
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen text-white bg-transparent flex flex-col items-center justify-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* 1. SIGNATURE MONOCHROME BACKGROUND EFFECT */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 opacity-60 hidden md:block"
        style={{
          background: "radial-gradient(750px circle at 50% 50%, rgba(255, 255, 255, 0.06), transparent 60%)",
        }}
      />

      {/* Ambient Breathing Radial Glow behind Centerpiece */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/[0.035] rounded-full blur-[140px] motion-reduce:hidden animate-pulse" />

      {/* Subtle fine technical lines */}
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.04]" />

      {/* 2. THE GLASSMORPHISM CONTACT PANEL (Centerpiece) */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto bg-[#0A0A0A]/60 backdrop-blur-xl border border-white/[0.12] hover:border-white/[0.18] rounded-3xl p-8 sm:p-12 lg:p-16 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_25px_60px_-15px_rgba(0,0,0,0.95)] transition-all duration-300">
        {submitted ? (
          /* HONEST SUCCESS & WHATSAPP HANDOFF STATE */
          <div className="max-w-2xl mx-auto text-center space-y-8 py-8 animate-fadeIn">
            <div className="w-16 h-16 bg-[#161616] border border-white/[0.15] text-white rounded-full flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(255,255,255,0.1)]">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#141414] border border-white/[0.12] rounded-full text-xs font-mono text-[#A3A3A3]">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span className="text-white font-semibold">WHATSAPP HANDOFF READY</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-bold uppercase text-white font-display tracking-tight">
                ENQUIRY PREPARED
              </h2>

              <p className="text-base text-[#CCCCCC] max-w-lg mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{formData.name}</strong>. Your enquiry for{" "}
                <strong className="text-white">{formData.service}</strong> has been prepared with your project details.
              </p>
            </div>

            {/* Direct Actions: Open in WhatsApp & Download PDF */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {whatsappUrl && (
                <ShiningButton
                  href={whatsappUrl}
                  variant="white"
                  size="lg"
                >
                  <MessageSquare className="w-4 h-4 text-[#050505]" />
                  <span>OPEN IN WHATSAPP ↗</span>
                </ShiningButton>
              )}

              <button
                type="button"
                onClick={handleDownloadBrief}
                disabled={generatingPdf}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#141414] hover:bg-[#1E1E1E] text-white border border-white/[0.15] hover:border-white/30 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50"
              >
                <FileDown className="w-4 h-4 text-[#CCCCCC]" />
                <span>
                  {generatingPdf
                    ? "GENERATING PDF..."
                    : formData.service && formData.service !== "Other / Custom Idea"
                    ? "DOWNLOAD PROJECT ESTIMATE"
                    : "DOWNLOAD PROJECT BRIEF"}
                </span>
              </button>
            </div>

            {pdfDownloaded && (
              <p className="text-xs text-white font-mono flex items-center justify-center gap-1.5 animate-fadeIn">
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Document downloaded to your device.</span>
              </p>
            )}

            {/* Honest Persistence Notice */}
            <div className="pt-2">
              {serverStatus?.persisted ? (
                <p className="text-xs text-[#888888] font-mono max-w-md mx-auto">
                  ✓ Database backup confirmed. {serverStatus.message}
                </p>
              ) : (
                <p className="text-xs text-[#888888] font-mono max-w-md mx-auto">
                  Your enquiry is ready in WhatsApp. Review it and tap Send.
                </p>
              )}
            </div>

            {/* Clipboard Permission Blocked Fallback */}
            {showClipboardFallback && (
              <div className="pt-2 max-w-md mx-auto text-left">
                <PermissionDeniedState
                  permissionType="clipboard"
                  title="Clipboard Access Restricted"
                  description="Your browser restricted automatic clipboard copy. You can copy the formatted enquiry manually below."
                  fallbackContent={formatWhatsAppText(formData)}
                  onRetry={() => setShowClipboardFallback(false)}
                />
              </div>
            )}

            {savedInquiryId && (
              <div className="p-4 bg-[#141414] border border-[#2B2B2B] rounded-xl font-mono text-xs text-white max-w-md mx-auto flex items-center justify-between gap-4">
                <span>Tracking ID: <strong className="text-white">{savedInquiryId}</strong></span>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="text-white hover:text-[#A3A3A3] flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Message"}</span>
                </button>
              </div>
            )}

            <div className="pt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-[#161616] hover:bg-[#202020] text-white border border-[#303030] hover:border-[#555555] font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Submit Another Enquiry
              </button>
            </div>
          </div>
        ) : (
          /* THE TWO-COLUMN GLASS PANEL COMPOSITION */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* LEFT SIDE: BRAND HEADLINE & DIRECT CONTACT */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-10 lg:space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-white font-bold tracking-widest uppercase">
                    GENZLOG / GET IN TOUCH
                  </span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white font-display leading-[0.9]">
                  LET&apos;S TALK.
                </h1>

                <p className="text-base sm:text-lg text-[#CCCCCC] leading-relaxed max-w-md font-normal">
                  Have an idea worth building? Tell us what you imagine. Let&apos;s turn it into a digital experience.
                </p>
              </div>

              {/* Direct Contact Links */}
              <div className="space-y-5 pt-4 border-t border-white/[0.08]">
                {/* Email Link */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-[#888888] uppercase tracking-wider block">
                    EMAIL DIRECT
                  </span>
                  <a
                    href="mailto:genzlog.contact@gmail.com"
                    className="text-base sm:text-lg font-mono font-bold text-white hover:text-[#CCCCCC] transition-colors inline-flex items-center gap-2 group"
                  >
                    <Mail className="w-4 h-4 text-[#888888] group-hover:text-white transition-colors" />
                    <span>genzlog.contact@gmail.com</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#888888] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                </div>

                {/* Phone Link */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-[#888888] uppercase tracking-wider block">
                    DIRECT PHONE
                  </span>
                  <a
                    href="tel:+918072522246"
                    className="text-lg sm:text-xl font-mono font-bold text-white hover:text-[#CCCCCC] transition-colors inline-flex items-center gap-2 group"
                  >
                    <Phone className="w-4 h-4 text-[#888888] group-hover:text-white transition-colors" />
                    <span>+91 80725 22246</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#888888] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                </div>

                {/* WhatsApp Link */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-[#888888] uppercase tracking-wider block">
                    INSTANT CHAT
                  </span>
                  <a
                    href="https://wa.me/918072522246"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#141414] hover:bg-white text-white hover:text-[#050505] border border-white/[0.1] hover:border-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: PREMIUM FORM */}
            <div className="lg:col-span-7 bg-[#080808]/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 sm:p-10 shadow-2xl relative">
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {(errors.form || submissionError) && (
                  <div
                    role="alert"
                    className="p-4 bg-[#141414] border border-white/20 rounded-xl text-white text-xs sm:text-sm flex items-start gap-3 animate-fadeIn"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-white" aria-hidden="true" />
                    <div className="space-y-1">
                      <p className="font-semibold">{errors.form || "Notice"}</p>
                      <p className="text-[#A3A3A3] text-xs leading-relaxed">
                        {submissionError || "Please review the highlighted fields in the form."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Full name & Email address row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-wider text-white">
                      Full Name <span className="text-white">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      maxLength={100}
                      autoComplete="name"
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "contact-name-error" : undefined}
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      placeholder="Your full name"
                      className={`w-full bg-[#0A0A0A] border rounded-xl px-4 py-3.5 text-base sm:text-sm text-white placeholder-[#555555] outline-none transition-all ${
                        errors.name
                          ? "border-red-500"
                          : "border-white/[0.1] focus:border-white focus:ring-1 focus:ring-white"
                      }`}
                    />
                    <FormFieldError id="contact-name-error" error={errors.name} />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-wider text-white">
                      Email Address <span className="text-white">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      maxLength={120}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      placeholder="your.email@example.com"
                      className={`w-full bg-[#0A0A0A] border rounded-xl px-4 py-3.5 text-base sm:text-sm text-white placeholder-[#555555] outline-none transition-all ${
                        errors.email
                          ? "border-red-500"
                          : "border-white/[0.1] focus:border-white focus:ring-1 focus:ring-white"
                      }`}
                    />
                    <FormFieldError id="contact-email-error" error={errors.email} />
                  </div>
                </div>

                {/* Project type & Budget range row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="contact-service" className="block text-xs font-mono uppercase tracking-wider text-white">
                      Project Type <span className="text-white">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="contact-service"
                        value={formData.service}
                        onChange={(e) => handleServiceChange(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-white/[0.1] focus:border-white focus:ring-1 focus:ring-white rounded-xl px-4 py-3.5 text-base sm:text-sm text-white outline-none transition-all cursor-pointer appearance-none pr-10"
                      >
                        {SERVICE_CHOICES.map((choice) => (
                          <option key={choice} value={choice} className="bg-[#111111] text-white">
                            {choice}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#888888] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-budget" className="block text-xs font-mono uppercase tracking-wider text-white">
                      Budget Range <span className="text-[#888888] text-xs font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <select
                        id="contact-budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-[#0A0A0A] border border-white/[0.1] focus:border-white focus:ring-1 focus:ring-white rounded-xl px-4 py-3.5 text-base sm:text-sm text-white outline-none transition-all cursor-pointer appearance-none pr-10"
                      >
                        <option value="" className="bg-[#111111] text-[#777777]">
                          Select budget range
                        </option>
                        {BUDGET_CHOICES.map((b) => (
                          <option key={b} value={b} className="bg-[#111111] text-white">
                            {b}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#888888] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Project description (Prefillable & Editable) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="contact-description" className="block text-xs font-mono uppercase tracking-wider text-white">
                      Project Description <span className="text-white">*</span>
                    </label>
                    <span className="text-[11px] font-mono text-[#777777]">
                      {formData.description ? `${formData.description.length} / 3000 chars` : "Editable starter prompt"}
                    </span>
                  </div>
                  <textarea
                    id="contact-description"
                    rows={5}
                    maxLength={3000}
                    aria-required="true"
                    aria-invalid={!!errors.description}
                    aria-describedby={errors.description ? "contact-description-error" : undefined}
                    value={formData.description}
                    onChange={(e) => {
                      hasUserEditedDescription.current = true;
                      setFormData({ ...formData, description: e.target.value });
                      if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
                    }}
                    placeholder="Tell us what you imagine — desired pages, key features, reference websites, or target timeline..."
                    className={`w-full bg-[#0A0A0A] border rounded-xl px-4 py-3.5 text-base sm:text-sm text-white placeholder-[#555555] outline-none transition-all resize-none leading-relaxed ${
                      errors.description
                        ? "border-red-500"
                        : "border-white/[0.1] focus:border-white focus:ring-1 focus:ring-white"
                    }`}
                  />
                  <FormFieldError id="contact-description-error" error={errors.description} />
                </div>

                {/* SUPPORTING HEADING, CLEAR NEXT STEPS & ACTIONS */}
                <div className="pt-4 border-t border-white/[0.08] space-y-4">
                  <div className="space-y-1 text-left">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      YOUR PROJECT. CLEAR NEXT STEPS.
                    </h3>
                    <p className="text-xs text-[#A3A3A3] leading-relaxed">
                      Share your vision with GENZLOG. We’ll review your requirements and help define the right solution.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* 1. Primary Action: CONTINUE TO WHATSAPP */}
                    <ShiningButton
                      type="submit"
                      disabled={loading}
                      variant="white"
                      size="lg"
                      fullWidth
                    >
                      <MessageSquare className="w-4 h-4 text-[#050505]" />
                      <span>
                        {loading ? "PREPARING WHATSAPP..." : "CONTINUE TO WHATSAPP ↗"}
                      </span>
                    </ShiningButton>

                    {/* 2. Secondary Action: DOWNLOAD PROJECT ESTIMATE / BRIEF */}
                    <button
                      type="button"
                      onClick={handleDownloadBrief}
                      disabled={generatingPdf}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#121212] hover:bg-[#1A1A1A] text-white border border-white/[0.12] hover:border-white/25 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50 shadow-sm"
                    >
                      <FileDown className="w-4 h-4 text-[#CCCCCC]" />
                      <span>
                        {generatingPdf
                          ? "GENERATING PDF..."
                          : formData.service && formData.service !== "Other / Custom Idea"
                          ? "DOWNLOAD PROJECT ESTIMATE"
                          : "DOWNLOAD PROJECT BRIEF"}
                      </span>
                    </button>
                  </div>

                  {/* Subtle explanatory note & disclosure */}
                  <div className="space-y-1 text-center pt-1">
                    <p className="text-[11px] text-[#A3A3A3] font-mono leading-relaxed">
                      Project estimates are preliminary. Final pricing and delivery timelines are confirmed after reviewing your requirements.
                    </p>
                    <p className="text-[11px] text-[#666666] leading-relaxed">
                      Your project details will be prepared in WhatsApp. Review the message and tap Send to contact GENZLOG.
                    </p>
                  </div>

                  {pdfDownloaded && (
                    <div className="p-3 bg-white/[0.04] border border-white/[0.1] rounded-xl flex items-center justify-center gap-2 text-xs font-mono text-white animate-fadeIn">
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Document downloaded successfully.</span>
                    </div>
                  )}

                  {pdfError && (
                    <div
                      role="alert"
                      className="p-3 bg-[#161616] border border-white/20 rounded-xl flex items-center justify-center gap-2 text-xs font-mono text-white animate-fadeIn"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-white shrink-0" aria-hidden="true" />
                      <span>{pdfError}</span>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* 3. PREMIUM TRUST-BUILDING SECTION */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-white/[0.08]">
        {/* Section Heading & Supporting Text */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#121212] border border-white/[0.1] rounded-full text-[11px] font-mono text-[#A3A3A3] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>OUR COMMITMENT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight uppercase text-white font-display">
            BUILT WITH INTENTION.
          </h2>
          <p className="text-sm sm:text-base text-[#A3A3A3] leading-relaxed">
            Thoughtful design. Reliable development. Digital experiences built around your goals.
          </p>
        </div>

        {/* Three Trust Points: Three Columns Desktop, Stacked Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TRUST_POINTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="bg-[#0A0A0A]/60 backdrop-blur-md border border-white/[0.08] hover:border-white/[0.18] rounded-2xl p-6 sm:p-8 space-y-4 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#888888] tracking-widest">
                    {item.number}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#141414] border border-white/[0.1] flex items-center justify-center text-white transition-colors group-hover:border-white/20">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-base font-bold font-mono tracking-wider uppercase text-white">
                    {item.tag}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
