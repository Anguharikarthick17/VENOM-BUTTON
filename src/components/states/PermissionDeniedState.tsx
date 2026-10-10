"use client";

import React, { useState } from "react";
import { ShieldAlert, Copy, Check, RefreshCw } from "lucide-react";

export interface PermissionDeniedStateProps {
  permissionType?: "clipboard" | "general";
  title?: string;
  description?: string;
  fallbackContent?: string;
  onRetry?: () => void;
  className?: string;
}

export function PermissionDeniedState({
  permissionType = "clipboard",
  title = "Permission Required",
  description = "Your browser restricted automatic clipboard access. You can copy the content manually below or enable clipboard permissions in your browser address bar.",
  fallbackContent,
  onRetry,
  className = "",
}: PermissionDeniedStateProps) {
  const [copiedManually, setCopiedManually] = useState(false);

  const handleManualCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!fallbackContent) return;

    try {
      const textarea = document.createElement("textarea");
      textarea.value = fallbackContent;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedManually(true);
      setTimeout(() => setCopiedManually(false), 2500);
    } catch {
      // If execCommand also fails, focus the visual textarea
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`bg-[#0E0E0E] border border-white/[0.15] rounded-2xl p-6 sm:p-8 space-y-4 max-w-lg mx-auto ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#161616] border border-[#303030] flex items-center justify-center text-white shrink-0">
          <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider block">
            {permissionType === "clipboard" ? "CLIPBOARD RESTRICTION" : "BROWSER PERMISSION"}
          </span>
          <h4 className="text-sm sm:text-base font-bold font-mono uppercase text-white">
            {title}
          </h4>
          <p className="text-xs text-[#A3A3A3] leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {fallbackContent && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#888888]">
            <span>MANUAL SELECTION FALLBACK</span>
            <span>{fallbackContent.length} chars</span>
          </div>

          <div className="relative">
            <textarea
              readOnly
              value={fallbackContent}
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              rows={3}
              className="w-full bg-[#050505] border border-[#2E2E2E] rounded-xl p-3 text-xs font-mono text-white outline-none focus:border-white resize-none"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleManualCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#050505] font-mono font-bold text-xs rounded-lg hover:bg-[#F0F0F0] transition-colors cursor-pointer"
            >
              {copiedManually ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#050505]" />
                  <span>Copied Manually!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#050505]" />
                  <span>Copy Content</span>
                </>
              )}
            </button>

            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#141414] hover:bg-[#1E1E1E] text-white border border-[#303030] text-xs font-mono rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-[#A3A3A3]" />
                <span>Retry Permission</span>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-[#1F1F1F] text-[11px] font-mono text-[#777777] leading-relaxed">
        Tip: To grant permission, tap the lock or permissions icon next to the URL in your browser bar and select &quot;Allow&quot;.
      </div>
    </div>
  );
}
