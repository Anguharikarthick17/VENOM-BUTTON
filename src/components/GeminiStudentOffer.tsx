"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, X, ExternalLink, Copy, Check, GraduationCap } from "lucide-react";

export function GeminiStudentOffer() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const claimStepsText = `👇 HOW TO CLAIM IT:

1️⃣ Visit: https://gemini.google/students/
2️⃣ Sign in with your personal Gmail account.
3️⃣ Click Claim Student Plan.
4️⃣ Verify your student status through SheerID.
5️⃣ Submit your college details and required student proof.
6️⃣ Complete the signup process.`;

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(claimStepsText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <>
      {/* GLOWING TRIGGER BUTTON: Positioned right under the media links on the right */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D0D0E]/95 hover:bg-[#151518] border border-cyan-400/50 hover:border-cyan-300 text-xs font-mono font-medium text-white transition-all duration-300 cursor-pointer shadow-[0_0_14px_rgba(34,211,238,0.35),0_0_28px_rgba(168,85,247,0.2)] hover:shadow-[0_0_22px_rgba(34,211,238,0.6),0_0_36px_rgba(168,85,247,0.4)] animate-gemini-glow outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Get Google Gemini 1 Year Free - Student Benefit"
          title="Click to view step-by-step claim instructions"
        >
          {/* Animated Sparkle Icon with Gradient */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-cyan-400 to-purple-400" />
          </span>

          <Sparkles className="w-3.5 h-3.5 text-cyan-300 group-hover:rotate-12 transition-transform duration-300" />

          <span className="bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent font-semibold tracking-tight">
            Get Gemini 1 Year Free
          </span>

          <span className="text-[10px] text-cyan-300/80 group-hover:text-cyan-200 transition-colors">
            ↗
          </span>
        </button>
      </div>

      {/* INTERACTIVE MODAL: Opens right on the page showing the steps */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="gemini-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-lg bg-[#0A0A0C] border border-[#2A2A32] rounded-2xl p-6 sm:p-7 shadow-[0_0_50px_rgba(34,211,238,0.2),0_10px_30px_rgba(0,0,0,0.8)] text-white overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Subtle Gradient Backlight */}
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-24 w-60 h-60 bg-gradient-to-tr from-purple-600/15 to-cyan-500/15 rounded-full blur-3xl pointer-events-none"
            />

            {/* Top Bar: Category Badge & Close Button */}
            <div className="relative flex items-center justify-between pb-4 border-b border-[#222228]">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>STUDENT BENEFIT</span>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title Section */}
            <div className="relative pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <h3
                  id="gemini-modal-title"
                  className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-white"
                >
                  Get Gemini 1 Year Free
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400">
                Official Google Gemini for Students offer. Follow the verified steps below to claim your access.
              </p>
            </div>

            {/* Note Box with Claim Steps */}
            <div className="relative my-4 p-4 sm:p-5 rounded-xl bg-[#121216] border border-[#262630] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#22222A]">
                <span className="text-xs font-mono font-bold text-cyan-300 tracking-wider flex items-center gap-1.5">
                  <span>👇</span>
                  <span>HOW TO CLAIM IT:</span>
                </span>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 hover:text-cyan-300 transition-colors cursor-pointer"
                  title="Copy steps to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Steps</span>
                    </>
                  )}
                </button>
              </div>

              {/* Numbered Steps */}
              <ol className="space-y-2.5 text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">
                <li className="flex items-start gap-2.5">
                  <span className="shrink-0 text-base leading-none">1️⃣</span>
                  <span>
                    Visit:{" "}
                    <a
                      href="https://gemini.google/students/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 font-mono font-semibold break-all inline-flex items-center gap-1"
                    >
                      <span>https://gemini.google/students/</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="shrink-0 text-base leading-none">2️⃣</span>
                  <span>Sign in with your personal Gmail account.</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="shrink-0 text-base leading-none">3️⃣</span>
                  <span>Click <strong>Claim Student Plan</strong>.</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="shrink-0 text-base leading-none">4️⃣</span>
                  <span>Verify your student status through SheerID.</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="shrink-0 text-base leading-none">5️⃣</span>
                  <span>Submit your college details and required student proof.</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="shrink-0 text-base leading-none">6️⃣</span>
                  <span>Complete the signup process.</span>
                </li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="relative pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <a
                href="https://gemini.google/students/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_18px_rgba(34,211,238,0.4)]"
              >
                <span>Open Gemini for Students</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#18181D] hover:bg-[#202026] text-neutral-300 hover:text-white border border-[#2D2D38] text-xs font-mono transition-colors text-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
