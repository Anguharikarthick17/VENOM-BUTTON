"use client";

import React, { useState, useRef } from "react";
import { ArrowUpRight, Download, Edit3, Sparkles, Check, RefreshCw } from "lucide-react";
import { CommunityCardPreview } from "./CommunityCardPreview";
import { CommunityWaveform } from "./CommunityWaveform";
import { exportCommunityCardPng } from "@/lib/communityCardExport";

export function CommunityCardGenerator() {
  const [inputName, setInputName] = useState("");
  const [generatedName, setGeneratedName] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Active display name for real-time live preview
  const livePreviewName = (
    isGenerated
      ? generatedName
      : inputName.trim().length > 0
      ? inputName.trim()
      : "YOUR NAME"
  );

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputName.trim();

    if (!trimmed) {
      setErrorMessage("Please enter your full name to generate your card.");
      inputRef.current?.focus();
      return;
    }

    setErrorMessage("");
    setGeneratedName(trimmed);
    setIsGenerated(true);
    setDownloadSuccess(false);
  };

  const handleEdit = () => {
    setIsGenerated(false);
    setDownloadSuccess(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleDownload = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setErrorMessage("");

    try {
      const success = await exportCommunityCardPng(generatedName || inputName || "YOUR NAME");
      if (success) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      } else {
        setErrorMessage("Could not render the card to PNG. Please try again.");
      }
    } catch {
      setErrorMessage("Download failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-140px)] flex flex-col justify-between bg-[#050505] text-white overflow-hidden pt-8 sm:pt-12">
      {/* Subtle background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.035)_0%,_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 tech-grid opacity-[0.05] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-[1540px] mx-auto px-4 sm:px-8 lg:px-14 flex-1 flex flex-col justify-center my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ===================================================================
              LEFT COLUMN: Generator Form & Controls
              =================================================================== */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 max-w-xl">
            <div className="space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#111111] border border-[#292929] rounded-full text-xs font-mono text-[#A3A3A3]">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-white font-semibold uppercase tracking-wider">
                  {"// COMMUNITY"}
                </span>
                <span className="text-[#555555]">•</span>
                <span>IDENTITY GENERATOR</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-display leading-[0.98]">
                Get your <span className="text-white">identity.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#A3A3A3] leading-relaxed font-normal">
                Join the GENZLOG creative collective. Enter your name below to generate your personalized digital identity pass and download high-resolution PNG.
              </p>
            </div>

            {/* Form & Actions */}
            <div className="bg-[#0D0D0D] border border-[#262626] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
              {!isGenerated ? (
                /* --- STEP 1: Enter Name Form --- */
                <form onSubmit={handleGenerate} className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="full-name-input"
                      className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] font-semibold"
                    >
                      FULL NAME
                    </label>
                    <input
                      ref={inputRef}
                      id="full-name-input"
                      type="text"
                      maxLength={36}
                      value={inputName}
                      onChange={(e) => {
                        setInputName(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      placeholder="Enter your full name"
                      className="w-full bg-[#161616] border border-[#2D2D2D] rounded-xl px-4 py-3.5 text-white placeholder-[#555555] font-display text-base sm:text-lg uppercase tracking-wide focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                      autoFocus
                    />
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#666666] pt-1">
                      <span>Exact name as it appears on your card</span>
                      <span>{inputName.length}/36</span>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 text-xs font-mono">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-white text-[#050505] font-mono font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl hover:bg-[#EAEAEA] transition-all shadow-[0_0_20px_rgba(255,255,255,0.18)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <span>GENERATE MY CARD</span>
                    <ArrowUpRight className="w-4 h-4 text-[#050505]" />
                  </button>
                </form>
              ) : (
                /* --- STEP 2: Post-Generation Actions --- */
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="p-4 rounded-xl bg-[#141414] border border-[#2C2C2C] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#737373] uppercase tracking-wider block">
                        CARD PREPARED FOR
                      </span>
                      <strong className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-tight">
                        {generatedName}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={handleEdit}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#222222] hover:bg-[#2A2A2A] border border-[#333333] text-xs font-mono text-white transition-colors"
                      title="Edit Name"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#A3A3A3]" />
                      <span>EDIT NAME</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={isExporting}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-[#050505] font-mono font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl hover:bg-[#EAEAEA] transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-50 cursor-pointer"
                    >
                      {isExporting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>PREPARING HIGH-RES PNG...</span>
                        </>
                      ) : downloadSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>CARD DOWNLOADED!</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>DOWNLOAD MY CARD</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleEdit}
                      className="px-5 py-4 bg-[#181818] hover:bg-[#222222] border border-[#2D2D2D] rounded-xl text-xs font-mono font-semibold uppercase tracking-wider text-[#A3A3A3] hover:text-white transition-colors"
                    >
                      NEW NAME
                    </button>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 text-xs font-mono">
                      {errorMessage}
                    </div>
                  )}

                  <div className="pt-2 text-[11px] font-mono text-[#666666] flex items-center justify-between border-t border-[#1C1C1C]">
                    <span>Resolution: 800 × 1136 px</span>
                    <span>100% Client-Side Privacy</span>
                  </div>
                </div>
              )}
            </div>

            {/* Privacy note */}
            <div className="flex items-center gap-2 text-xs font-mono text-[#666666]">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span>No login, no database, no storage. Your card is generated directly in your browser.</span>
            </div>
          </div>

          {/* ===================================================================
              RIGHT COLUMN: Hanging Identity Card Preview
              =================================================================== */}
          <div className="lg:col-span-6 flex items-center justify-center py-4 lg:py-0">
            <CommunityCardPreview
              name={livePreviewName}
              isGenerating={isExporting}
            />
          </div>

        </div>
      </div>

      {/* =======================================================================
          BOTTOM: Decorative Audio Waveform & Minimal Studio Footer
          ======================================================================= */}
      <div className="relative z-10 w-full mt-10 pt-4 border-t border-[#1F1F1F]/60">
        <CommunityWaveform />
        <div className="w-full max-w-[1540px] mx-auto px-4 pb-6 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#555555] uppercase tracking-wider">
          <span>GENZLOG DIGITAL STUDIO</span>
          <span>BUILD • DESIGN • CREATE • SHARE</span>
          <span>EST. 2026</span>
        </div>
      </div>
    </div>
  );
}
