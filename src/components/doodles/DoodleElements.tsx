import React from "react";

// Minimal monochrome hand-drawn SVG doodle elements: restrained, editorial, black & white.

export function DoodleArrow({
  className = "w-16 h-8 text-[#FFFFFF]",
  direction = "right",
}: {
  className?: string;
  direction?: "right" | "down" | "curve-down" | "curve-right" | "curve-up";
}) {
  if (direction === "down") {
    return (
      <svg
        viewBox="0 0 24 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M12 4 C11 18, 13 32, 11 44" />
        <path d="M4 36 C8 40, 10 43, 11 45 C13 42, 17 38, 20 35" />
      </svg>
    );
  }

  if (direction === "curve-down") {
    return (
      <svg
        viewBox="0 0 60 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M6 8 C22 4, 46 10, 48 28" />
        <path d="M40 22 C45 27, 48 30, 49 32 C52 28, 55 24, 57 20" />
      </svg>
    );
  }

  if (direction === "curve-up") {
    return (
      <svg
        viewBox="0 0 60 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M6 32 C22 36, 44 30, 48 12" />
        <path d="M40 18 C45 13, 48 10, 49 8 C52 12, 55 16, 57 20" />
      </svg>
    );
  }

  if (direction === "curve-right") {
    return (
      <svg
        viewBox="0 0 80 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M4 18 C26 12, 48 22, 70 14" />
        <path d="M60 7 C65 11, 69 13, 72 14 C68 18, 64 22, 60 25" />
      </svg>
    );
  }

  // Default: subtle right arrow
  return (
    <svg
      viewBox="0 0 64 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 13 C22 11, 40 13, 56 12" />
      <path d="M48 5 C52 9, 56 11, 58 12 C54 15, 49 19, 46 21" />
    </svg>
  );
}

export function DoodleCircle({
  className = "w-32 h-14 text-[#FFFFFF]",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 70"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 36 C16 18, 52 8, 92 8 C132 8, 154 22, 150 42 C145 60, 102 66, 56 64 C22 62, 8 50, 10 32 C12 20, 28 14, 52 12" />
    </svg>
  );
}

export function DoodleUnderline({
  className = "w-full h-3 text-[#FFFFFF]",
  variant = "rough",
}: {
  className?: string;
  variant?: "rough" | "double" | "scribble";
}) {
  if (variant === "double") {
    return (
      <svg
        viewBox="0 0 200 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className={className}
      >
        <path d="M2 5 C45 3, 110 6, 198 4" />
        <path d="M8 12 C55 10, 130 13, 192 11" />
      </svg>
    );
  }

  if (variant === "scribble") {
    return (
      <svg
        viewBox="0 0 200 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className={className}
      >
        <path d="M3 8 Q 20 2, 40 8 T 80 8 T 120 8 T 160 8 T 197 7" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 200 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
    >
      <path d="M2 7 C50 4, 120 9, 198 5" />
    </svg>
  );
}

export function DoodleStar({
  className = "w-5 h-5 text-[#FFFFFF]",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2 L12 22 M2 12 L22 12 M5 5 L19 19 M5 19 L19 5" />
    </svg>
  );
}

export function DoodleSparkle({
  className = "w-6 h-6 text-[#FFFFFF]",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
    >
      <path d="M16 2 C16 9, 23 16, 30 16 C23 16, 16 23, 16 30 C16 23, 9 16, 2 16 C9 16, 16 9, 16 2 Z" />
    </svg>
  );
}

export function DoodleBox({
  className = "w-full h-full text-[#FFFFFF]",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 14 C10 6, 20 4, 40 4 L100 5 C112 5, 116 8, 116 18 L115 44 C115 54, 110 56, 96 56 L24 55 C10 55, 5 50, 4 40 L5 12" />
    </svg>
  );
}

export function DoodleConnector({
  className = "w-full h-8 text-[#A3A3A3]",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeDasharray="4 4"
      strokeLinecap="round"
      className={className}
    >
      <path d="M2 10 C35 5, 65 15, 100 10 C125 6, 145 13, 158 10" />
    </svg>
  );
}

export function DoodleAnnotation({
  text,
  className = "",
  badgeColor = "text-[#A3A3A3]",
}: {
  text: string;
  className?: string;
  badgeColor?: string;
}) {
  return (
    <span
      className={`font-doodle text-base tracking-wide inline-flex items-center gap-1.5 select-none ${badgeColor} ${className}`}
    >
      <span>{text}</span>
    </span>
  );
}
