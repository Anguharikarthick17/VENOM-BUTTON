"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export interface PartialDataWarningProps {
  sectionTitle?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function PartialDataWarning({
  sectionTitle = "Section temporarily unavailable",
  message = "This specific component encountered a connection issue and could not load completely. The rest of the page remains fully functional.",
  onRetry,
  className = "",
}: PartialDataWarningProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`p-4 bg-[#111111] border border-white/[0.12] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono ${className}`}
    >
      <div className="flex items-start sm:items-center gap-2.5">
        <AlertCircle className="w-4 h-4 text-white shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
        <div>
          <span className="text-white font-bold uppercase tracking-wider block sm:inline mr-2">
            {sectionTitle}:
          </span>
          <span className="text-[#A3A3A3] font-sans text-xs">
            {message}
          </span>
        </div>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] hover:bg-white text-white hover:text-[#050505] border border-white/[0.15] hover:border-white rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Retry Section</span>
        </button>
      )}
    </div>
  );
}
