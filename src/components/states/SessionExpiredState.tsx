"use client";

import React from "react";
import Link from "next/link";
import { KeyRound, ArrowRight, RefreshCw } from "lucide-react";

export interface SessionExpiredStateProps {
  title?: string;
  message?: string;
  onRefresh?: () => void;
  loginHref?: string;
  hasPreservedDraft?: boolean;
  className?: string;
}

export function SessionExpiredState({
  title = "Session Expired",
  message = "Your temporary verification session has elapsed. Any unsaved inquiry details are preserved locally on this device.",
  onRefresh,
  loginHref = "/contact",
  hasPreservedDraft = true,
  className = "",
}: SessionExpiredStateProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`bg-[#0C0C0C] border border-[#303030] rounded-2xl p-8 sm:p-10 text-center max-w-md mx-auto space-y-5 shadow-2xl ${className}`}
    >
      <div className="w-12 h-12 mx-auto rounded-xl bg-[#161616] border border-[#2E2E2E] flex items-center justify-center text-white">
        <KeyRound className="w-6 h-6 text-white" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#141414] border border-[#2E2E2E] rounded-full text-[10px] font-mono text-[#A3A3A3] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span>AUTHENTICATION NOTICE</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-white">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
          {message}
        </p>
      </div>

      {hasPreservedDraft && (
        <div className="p-3 bg-[#141414] border border-[#242424] rounded-xl text-left text-xs font-mono text-[#CCCCCC] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white shrink-0" />
          <span>Form draft retained in local browser storage.</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#050505] font-bold text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.15)]"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#050505]" />
            <span>Restore Session</span>
          </button>
        )}

        <Link
          href={loginHref}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#161616] text-white border border-[#303030] hover:border-white font-medium text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </Link>
      </div>
    </div>
  );
}
