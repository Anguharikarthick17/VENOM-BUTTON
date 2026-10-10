"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowLeft, Home } from "lucide-react";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | null;
  reset?: () => void;
  variant?: "inline" | "card" | "fullscreen";
  preserveDraftNotice?: string;
  backHref?: string;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong.",
  message = "An unexpected error occurred while processing your request. Your entered information is preserved safely.",
  error,
  reset,
  variant = "card",
  preserveDraftNotice,
  backHref = "/",
  className = "",
}: ErrorStateProps) {
  useEffect(() => {
    if (error) {
      // Secure technical logging: sanitize and never expose sensitive keys or server internals to visitors
      if (process.env.NODE_ENV === "development") {
        console.error("[GENZLOG Error State Caught]:", error);
      }
    }
  }, [error]);

  if (variant === "inline") {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className={`p-4 bg-[#141414] border border-white/[0.15] rounded-xl flex items-start gap-3 text-xs text-[#E5E5E5] ${className}`}
      >
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-white" aria-hidden="true" />
        <div className="flex-1 space-y-1">
          <p className="font-semibold text-white">{title}</p>
          <p className="text-[#A3A3A3] leading-relaxed">{message}</p>
          {preserveDraftNotice && (
            <p className="text-[11px] font-mono text-[#888888]">{preserveDraftNotice}</p>
          )}
        </div>
        {reset && (
          <button
            type="button"
            onClick={reset}
            className="px-3 py-1 bg-white text-[#050505] font-mono font-bold text-[11px] rounded uppercase hover:bg-[#F0F0F0] transition-colors shrink-0 cursor-pointer"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  const containerClass =
    variant === "fullscreen"
      ? "min-h-[75vh] flex items-center justify-center p-4 sm:p-6"
      : "p-4 sm:p-12";

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`${containerClass} ${className}`}
    >
      <div className="bg-[#0C0C0C] border border-[#303030] rounded-2xl p-5 sm:p-12 text-center max-w-lg mx-auto space-y-6 shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#161616] border border-[#2E2E2E] flex items-center justify-center text-white">
          <AlertCircle className="w-7 h-7 text-white" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#141414] border border-[#2E2E2E] rounded-full text-[10px] font-mono text-[#A3A3A3] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>GENZLOG ERROR HANDLER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-tight text-white">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed max-w-md mx-auto">
            {message}
          </p>
        </div>

        {preserveDraftNotice && (
          <div className="p-3 bg-[#141414] border border-[#242424] rounded-xl text-left text-xs font-mono text-[#CCCCCC] flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-white shrink-0" />
            <span>{preserveDraftNotice}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {reset && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#050505] font-bold text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#050505]" />
              <span>Try Again</span>
            </button>
          )}

          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#161616] text-white border border-[#303030] hover:border-white font-medium text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              {backHref === "/" ? (
                <>
                  <Home className="w-3.5 h-3.5 text-white" />
                  <span>Return to Home</span>
                </>
              ) : (
                <>
                  <ArrowLeft className="w-3.5 h-3.5 text-white" />
                  <span>Go Back</span>
                </>
              )}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
