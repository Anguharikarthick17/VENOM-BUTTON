"use client";

import React from "react";
import Link from "next/link";

export interface ShiningButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "white" | "secondary";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  type?: "button" | "submit" | "reset";
  target?: string;
  rel?: string;
  id?: string;
  ariaLabel?: string;
}

export function ShiningButton({
  children,
  href,
  variant = "white",
  size = "md",
  fullWidth = false,
  className = "",
  disabled = false,
  onClick,
  type = "button",
  target,
  rel,
  id,
  ariaLabel,
}: ShiningButtonProps) {
  // Size-specific dimensions and typography (ensuring accessible touch targets >= 44px on mobile)
  const sizeClasses = {
    sm: "px-4 py-2.5 text-xs rounded-xl gap-2 min-h-[40px] sm:min-h-[38px]",
    md: "px-6 py-3.5 text-xs sm:text-sm rounded-xl gap-2.5 min-h-[44px]",
    lg: "px-8 py-4 text-xs sm:text-sm rounded-xl gap-2.5 min-h-[48px]",
  }[size];

  // Variant-specific styling (Strictly Monochrome)
  const variantClasses = {
    // 1. High-contrast illuminated white glass-metal (Default primary CTA)
    white:
      "bg-gradient-to-b from-[#FFFFFF] via-[#F6F6F6] to-[#EBEBEB] text-[#050505] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_0_25px_rgba(255,255,255,0.18)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_0_35px_rgba(255,255,255,0.32)] hover:border-white",

    // 2. Deep illuminated charcoal/metal with silver highlight
    primary:
      "bg-gradient-to-b from-[#1E1E1E] via-[#121212] to-[#0A0A0A] text-white border border-white/25 hover:border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),inset_0_-1px_2px_rgba(0,0,0,0.7),0_0_20px_rgba(255,255,255,0.12)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_0_30px_rgba(255,255,255,0.22)]",

    // 3. Restrained translucent secondary surface
    secondary:
      "bg-[#0E0E0E]/85 backdrop-blur-md text-white border border-[#303030] hover:border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:bg-[#141414]",
  }[variant];

  // Shared container styles
  const baseClasses = `
    group relative inline-flex items-center justify-center font-bold uppercase tracking-wider
    font-display select-none transition-all duration-300 outline-none
    focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]
    active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed
    ${fullWidth ? "w-full" : "w-auto"}
    ${sizeClasses}
    ${variantClasses}
    ${className}
  `.replace(/\s+/g, " ").trim();

  // The inner content and sweeping light reflection elements
  const innerContent = (
    <>
      {/* Soft Ambient Radial Aura behind button (Inspired by Spacious74) */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-[1px] rounded-[inherit] transition-opacity duration-500 blur-sm ${
          variant === "white"
            ? "bg-gradient-to-r from-white/20 via-white/50 to-white/20 opacity-40 group-hover:opacity-100 group-hover:blur-md"
            : "bg-gradient-to-r from-white/10 via-white/25 to-white/10 opacity-30 group-hover:opacity-80 group-hover:blur-md"
        }`}
      />

      {/* Layered Inner Specular Reflection (Top Rim Highlight) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"
      />

      {/* Traveling Reflective Sheen Sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        <span
          className={`absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/${
            variant === "white" ? "40" : "20"
          } to-transparent skew-x-[-20deg] animate-shining-sheen motion-reduce:animate-none`}
        />
      </span>

      {/* Button Content / Label / Icons */}
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </>
  );

  // External Link variant
  if (href && (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:"))) {
    return (
      <a
        href={href}
        id={id}
        aria-label={ariaLabel}
        target={target ?? "_blank"}
        rel={rel ?? "noopener noreferrer"}
        onClick={onClick}
        className={baseClasses}
      >
        {innerContent}
      </a>
    );
  }

  // Internal Next.js Link variant
  if (href) {
    return (
      <Link
        href={href}
        id={id}
        aria-label={ariaLabel}
        onClick={onClick}
        className={baseClasses}
      >
        {innerContent}
      </Link>
    );
  }

  // Native Button variant
  return (
    <button
      type={type}
      id={id}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={baseClasses}
    >
      {innerContent}
    </button>
  );
}
