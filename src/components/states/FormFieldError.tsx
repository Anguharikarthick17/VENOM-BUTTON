"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

export interface FormFieldErrorProps {
  id?: string;
  error?: string | null;
  className?: string;
}

export function FormFieldError({ id, error, className = "" }: FormFieldErrorProps) {
  if (!error) return null;

  return (
    <p
      id={id}
      role="alert"
      className={`text-xs text-white/90 bg-[#161616] border border-white/20 rounded-md px-2.5 py-1.5 flex items-center gap-1.5 font-mono animate-fadeIn ${className}`}
    >
      <AlertCircle className="w-3.5 h-3.5 text-white shrink-0" aria-hidden="true" />
      <span>{error}</span>
    </p>
  );
}
