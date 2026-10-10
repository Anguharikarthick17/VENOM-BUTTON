"use client";

import React, { useEffect, useState } from "react";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";

export interface LoadingStateProps {
  size?: "sm" | "md" | "lg" | "fullscreen";
  label?: string;
  sublabel?: string;
  timeoutMs?: number;
  onTimeout?: () => void;
  onRetry?: () => void;
  className?: string;
}

export function LoadingState({
  size = "md",
  label = "Loading...",
  sublabel,
  timeoutMs,
  onTimeout,
  onRetry,
  className = "",
}: LoadingStateProps) {
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    if (!timeoutMs) return;

    const timer = setTimeout(() => {
      setHasTimedOut(true);
      if (onTimeout) onTimeout();
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [timeoutMs, onTimeout]);

  const spinnerSize =
    size === "sm" ? "w-4 h-4" : size === "lg" || size === "fullscreen" ? "w-8 h-8" : "w-6 h-6";

  const containerPadding =
    size === "sm"
      ? "p-2"
      : size === "lg"
      ? "py-12 px-6"
      : size === "fullscreen"
      ? "fixed inset-0 z-50 bg-[#050505]/90 backdrop-blur-md flex items-center justify-center p-6"
      : "py-8 px-4";

  if (hasTimedOut) {
    return (
      <div
        role="alert"
        className={`flex flex-col items-center justify-center text-center space-y-3 bg-[#111111] border border-[#303030] rounded-xl p-6 ${className}`}
      >
        <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#303030] flex items-center justify-center text-[#CCCCCC]">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-white">Operation is taking longer than usual</p>
          <p className="text-xs text-[#A3A3A3] max-w-sm">
            The request did not complete within expected time. Please check your connection or retry.
          </p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={() => {
              setHasTimedOut(false);
              onRetry();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-[#050505] text-xs font-mono font-bold uppercase tracking-wider rounded-lg hover:bg-[#F5F5F5] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center text-center space-y-3 ${containerPadding} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Subtle monochrome dual-ring spinner */}
        <div className="w-8 h-8 rounded-full border border-white/10 motion-reduce:hidden" />
        <Loader2
          className={`${spinnerSize} text-white animate-spin absolute motion-reduce:animate-none`}
        />
      </div>

      {(label || sublabel) && (
        <div className="space-y-1">
          {label && <p className="text-xs sm:text-sm font-mono text-white tracking-wide">{label}</p>}
          {sublabel && (
            <p className="text-[11px] sm:text-xs text-[#A3A3A3] max-w-xs leading-relaxed">
              {sublabel}
            </p>
          )}
        </div>
      )}
      <span className="sr-only">{label || "Loading in progress"}</span>
    </div>
  );
}
