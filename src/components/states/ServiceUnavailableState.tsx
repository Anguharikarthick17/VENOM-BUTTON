"use client";

import React from "react";
import Link from "next/link";
import { ServerCrash, RefreshCw, Mail, MessageSquare } from "lucide-react";

export interface ServiceUnavailableStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ServiceUnavailableState({
  title = "Service Temporarily Unavailable",
  message = "Our servers or database endpoints are temporarily undergoing routine maintenance or experiencing higher traffic. Your information has not been lost.",
  onRetry,
  className = "",
}: ServiceUnavailableStateProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`min-h-[70vh] flex items-center justify-center p-6 text-white ${className}`}
    >
      <div className="bg-[#0C0C0C] border border-[#303030] rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto space-y-6 shadow-2xl animate-fadeIn">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#161616] border border-[#2E2E2E] flex items-center justify-center text-white">
          <ServerCrash className="w-8 h-8 text-white" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#2E2E2E] rounded-full text-[10px] font-mono text-[#A3A3A3] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>HTTP 503 // BACKEND MAINTENANCE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-tight text-white">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed max-w-md mx-auto">
            {message}
          </p>
        </div>

        <div className="p-4 bg-[#111111] border border-[#222222] rounded-xl text-left text-xs font-mono text-[#CCCCCC] space-y-2">
          <p className="text-white font-semibold uppercase text-[11px] tracking-wider">
            Direct Assistance Channels
          </p>
          <div className="flex flex-col gap-1.5 text-[11px] text-[#A3A3A3]">
            <a
              href="mailto:genzlog.contact@gmail.com"
              className="hover:text-white flex items-center gap-2 transition-colors"
            >
              <Mail className="w-3 h-3 text-white" />
              <span>Email: genzlog.contact@gmail.com</span>
            </a>
            <a
              href="https://wa.me/918072522246"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-2 transition-colors"
            >
              <MessageSquare className="w-3 h-3 text-white" />
              <span>WhatsApp: +91 80725 22246</span>
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#050505] font-bold text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#050505]" />
              <span>Retry Connection</span>
            </button>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#161616] text-white border border-[#303030] hover:border-white font-medium text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
