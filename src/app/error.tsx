"use client";

import React, { useEffect } from "react";
import { ErrorState } from "@/components/states/ErrorState";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Secure technical logging for debugging without exposing secrets to client visitors
    console.error("[GENZLOG App Router Error]:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-transparent text-white flex items-center justify-center py-12 px-4">
      <ErrorState
        title="Something went wrong."
        message="An unexpected error occurred while loading this page. You can try refreshing the view or navigate back to the home page."
        error={error}
        reset={reset}
        variant="fullscreen"
        backHref="/"
      />
    </main>
  );
}
