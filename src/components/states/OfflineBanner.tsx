"use client";

import React, { useState, useEffect, useCallback } from "react";
import { WifiOff, CheckCircle2, RefreshCw, X } from "lucide-react";

export interface OfflineBannerProps {
  className?: string;
}

export function OfflineBanner({ className = "" }: OfflineBannerProps) {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      return navigator.onLine;
    }
    return true;
  });
  const [justRestored, setJustRestored] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    setJustRestored(true);
    setDismissed(false);

    // Auto-dismiss the recovery banner after 3.5 seconds
    const timer = setTimeout(() => {
      setJustRestored(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    setJustRestored(false);
    setDismissed(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handleOnline, handleOffline]);

  const verifyConnection = async () => {
    setIsChecking(true);
    try {
      // Test basic connectivity via lightweight check
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch("/api/contact", {
        method: "HEAD",
        signal: controller.signal,
      }).catch(() => null);

      clearTimeout(timeoutId);

      if (res || navigator.onLine) {
        setIsOnline(true);
        setJustRestored(true);
        setTimeout(() => setJustRestored(false), 3500);
      } else {
        setIsOnline(false);
      }
    } catch {
      setIsOnline(navigator.onLine);
    } finally {
      setIsChecking(false);
    }
  };

  // If online and not just restored, or if dismissed, render nothing
  if ((isOnline && !justRestored) || dismissed) {
    return null;
  }

  if (justRestored) {
    return (
      <aside
        role="status"
        aria-live="polite"
        aria-label="Network status update"
        className={`w-full bg-[#111111] text-white border-b border-white/[0.2] py-2 px-4 transition-all duration-300 z-50 sticky top-0 animate-fadeIn ${className}`}
      >
        <div className="max-w-[1680px] mx-auto flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white" aria-hidden="true" />
            <span className="font-semibold text-white">CONNECTION RESTORED</span>
            <span className="text-[#888888] hidden sm:inline">
              — You are back online. All features are available.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setJustRestored(false)}
            aria-label="Dismiss restored banner"
            className="text-[#888888] hover:text-white p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    );
  }

  // Active Offline State
  return (
    <aside
      role="alert"
      aria-live="assertive"
      aria-label="No internet connection detected"
      className={`w-full bg-[#0A0A0A] text-white border-b border-white/[0.25] py-2.5 px-4 z-50 sticky top-0 shadow-lg ${className}`}
    >
      <div className="max-w-[1680px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <WifiOff className="w-4 h-4 text-white shrink-0" aria-hidden="true" />
          <span className="font-bold text-white uppercase tracking-wider">OFFLINE MODE:</span>
          <span className="text-[#CCCCCC]">
            No internet connection detected. Unsaved form entries are preserved on your device.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={verifyConnection}
            disabled={isChecking}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[#050505] text-[11px] font-bold rounded uppercase hover:bg-[#F0F0F0] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? "animate-spin" : ""}`} />
            <span>{isChecking ? "Checking..." : "Retry"}</span>
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss offline banner"
            className="text-[#888888] hover:text-white p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
