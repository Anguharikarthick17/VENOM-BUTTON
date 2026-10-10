"use client";

import React from "react";
import Link from "next/link";
import { SearchX, ArrowRight, LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  secondaryActionHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  secondaryActionLabel,
  onSecondaryAction,
  secondaryActionHref,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      role="region"
      aria-label={title}
      className={`bg-[#111111] border border-[#303030] rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-5 transition-all duration-300 ${className}`}
    >
      <div className="w-14 h-14 mx-auto rounded-2xl bg-[#161616] border border-[#2E2E2E] flex items-center justify-center text-white shadow-inner">
        <Icon className="w-7 h-7 text-white" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-white">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed max-w-md mx-auto">
          {description}
        </p>
      </div>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {actionLabel && (
            actionHref ? (
              <Link
                href={actionHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#050505] font-bold text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.15)]"
              >
                <span>{actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#050505]" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={onAction}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#050505] font-bold text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.15)]"
              >
                <span>{actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#050505]" />
              </button>
            )
          )}

          {secondaryActionLabel && (
            secondaryActionHref ? (
              <Link
                href={secondaryActionHref}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#161616] text-white border border-[#303030] hover:border-white font-medium text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                <span>{secondaryActionLabel}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={onSecondaryAction}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#161616] text-white border border-[#303030] hover:border-white font-medium text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                <span>{secondaryActionLabel}</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
