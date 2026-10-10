"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight, LucideIcon } from "lucide-react";

export interface SuccessAction {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary";
}

export interface SuccessStateProps {
  title: string;
  message: string;
  referenceId?: string;
  badgeText?: string;
  primaryAction?: SuccessAction;
  secondaryAction?: SuccessAction;
  note?: string;
  className?: string;
}

export function SuccessState({
  title,
  message,
  referenceId,
  badgeText = "CONFIRMED",
  primaryAction,
  secondaryAction,
  note,
  className = "",
}: SuccessStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/[0.15] rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all animate-fadeIn ${className}`}
    >
      {/* Subtle Checkmark Badge with smooth restrained animation */}
      <div className="relative mx-auto w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-white/[0.06] animate-ping motion-reduce:hidden duration-1000" />
        <div className="relative w-16 h-16 rounded-full bg-[#161616] border border-white/[0.25] text-white flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.12)]">
          <Check className="w-8 h-8 text-white stroke-[2.5]" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-white/[0.12] rounded-full text-[11px] font-mono text-[#A3A3A3]">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span className="text-white font-semibold uppercase tracking-wider">{badgeText}</span>
        </div>

        <h3 className="text-2xl sm:text-4xl font-bold font-display uppercase tracking-tight text-white leading-tight">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed max-w-md mx-auto">
          {message}
        </p>
      </div>

      {referenceId && (
        <div className="p-3.5 bg-[#141414] border border-[#2B2B2B] rounded-xl font-mono text-xs text-white max-w-sm mx-auto flex items-center justify-between gap-4">
          <span className="text-[#888888] uppercase text-[10px] tracking-wider">Reference ID</span>
          <span className="font-bold tracking-wider">{referenceId}</span>
        </div>
      )}

      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {primaryAction &&
            (primaryAction.href ? (
              <Link
                href={primaryAction.href}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#050505] font-bold text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.15)]"
              >
                {primaryAction.icon && <primaryAction.icon className="w-4 h-4 text-[#050505]" />}
                <span>{primaryAction.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#050505]" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#050505] font-bold text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.15)]"
              >
                {primaryAction.icon && <primaryAction.icon className="w-4 h-4 text-[#050505]" />}
                <span>{primaryAction.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#050505]" />
              </button>
            ))}

          {secondaryAction &&
            (secondaryAction.href ? (
              <Link
                href={secondaryAction.href}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#141414] text-white border border-white/[0.15] hover:border-white/30 font-medium text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                {secondaryAction.icon && <secondaryAction.icon className="w-4 h-4 text-white" />}
                <span>{secondaryAction.label}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#141414] text-white border border-white/[0.15] hover:border-white/30 font-medium text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                {secondaryAction.icon && <secondaryAction.icon className="w-4 h-4 text-white" />}
                <span>{secondaryAction.label}</span>
              </button>
            ))}
        </div>
      )}

      {note && (
        <p className="text-[11px] text-[#777777] font-mono leading-relaxed pt-1">
          {note}
        </p>
      )}
    </div>
  );
}
