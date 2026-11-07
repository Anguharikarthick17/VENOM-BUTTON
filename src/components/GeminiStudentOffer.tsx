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
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <>
      {/* MONOCHROME GLOWING TRIGGER NOTE */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111]/95 hover:bg-[#1A1A1A] border border-white/40 hover:border-white text-xs font-mono font-medium text-white transition-all duration-300 cursor-pointer shadow-[0_0_12px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.45)] animate-gemini-glow outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Get Google Gemini 1 Year Free - Student Benefit"
        title="Click to view step-by-step claim instructions"
      >
        {/* Animated Pure White Sparkle Indicator */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>

        <Sparkles className="w-3.5 h-3.5 text-white group-hover:rotate-12 transition-transform duration-300" />

        <span className="text-white font-medium tracking-tight">
          Get Gemini 1 Year Free
        </span>

        <span className="text-[11px] text-[#A3A3A3] group-hover:text-white transition-colors">
          ↗
        </span>
      </button>

      {/* MONOCHROME INTERACTIVE CLAIM MODAL */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="gemini-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-lg bg-[#0A0A0A] border border-[#303030] rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(255,255,255,0.1),0_15px_40px_rgba(0,0,0,0.9)] text-white overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Top Bar: Monochrome Category Badge & Close Button */}
            <div className="relative flex items-center justify-between pb-4 border-b border-[#222222]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616] border border-[#333333] text-[11px] font-mono text-[#CCCCCC] font-medium uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5 text-white" />
                <span>STUDENT BENEFIT</span>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-white hover:bg-[#1A1A1A] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title Section */}
            <div className="relative pt-5 pb-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-white shrink-0" />
                <h3
                  id="gemini-modal-title"
                  className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-white"
                >
                  Get Gemini 1 Year Free
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
                Official Google Gemini for Students offer. Follow the verified steps below to claim your complimentary 1-year access.
              </p>
            </div>

            {/* Note Box with Claim Steps */}
            <div className="relative my-4 p-4 sm:p-5 rounded-xl bg-[#111111] border border-[#262626] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#222222]">
                <span className="text-xs font-mono font-bold text-white tracking-wider flex items-center gap-1.5">
                  <span>👇</span>
                  <span>HOW TO CLAIM IT:</span>
                </span>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#A3A3A3] hover:text-white transition-colors cursor-pointer"
                  title="Copy steps to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span className="text-white font-semibold">Copied!</span>
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
              <ol className="space-y-2.5 text-xs sm:text-sm text-[#E5E5E5] leading-relaxed font-sans">
                <li className="flex items-start gap-2.5">
                  <span className="shrink-0 text-base leading-none">1️⃣</span>
                  <span>
                    Visit:{" "}
                    <a
                      href="https://gemini.google/students/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-[#CCCCCC] underline underline-offset-4 font-mono font-semibold break-all inline-flex items-center gap-1"
                    >
                      <span>https://gemini.google/students/</span>
                      <ExternalLink className="w-3 h-3 shrink-0 text-[#A3A3A3]" />
                    </a>
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="shrink-0 text-base leading-none">2️⃣</span>
                  <span>Sign in with your personal Gmail account.</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="shrink-0 text-base leading-none">3️⃣</span>
                  <span>Click <strong className="text-white font-semibold">Claim Student Plan</strong>.</span>
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
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#EAEAEA] text-[#050505] font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.2)] font-mono"
              >
                <span>Open Gemini for Students</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#050505]" />
              </a>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#161616] hover:bg-[#202020] text-[#A3A3A3] hover:text-white border border-[#2D2D2D] text-xs font-mono transition-colors text-center"
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
