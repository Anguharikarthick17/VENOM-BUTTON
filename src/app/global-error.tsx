"use client";

import React, { useEffect } from "react";
import { ErrorState } from "@/components/states/ErrorState";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GENZLOG Global Error]:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050505] text-[#FFFFFF] flex items-center justify-center p-6 antialiased">
        <ErrorState
          title="Something went wrong."
          message="A critical layout error occurred. You can retry loading the application or return to home."
          error={error}
          reset={reset}
          variant="fullscreen"
          backHref="/"
        />
      </body>
    </html>
  );
}
