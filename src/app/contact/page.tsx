import React, { Suspense } from "react";
import { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";
import { LoadingState } from "@/components/states/LoadingState";
import { ErrorBoundary } from "@/components/states/ErrorBoundary";

export const metadata: Metadata = {
  title: "Get in Touch — Let's Talk | GENZLOG",
  description:
    "Have an idea worth building? Tell us what you imagine. Let's turn it into a digital experience.",
};

export default function ContactPage() {
  return (
    <main className="bg-transparent min-h-screen text-white relative">
      <ErrorBoundary
        title="Contact Form Unavailable"
        message="An unexpected issue occurred while preparing the contact form. Your unsaved details are preserved locally."
      >
        <Suspense
          fallback={
            <div className="py-24 flex items-center justify-center">
              <LoadingState size="lg" label="INITIALIZING PROJECT DESK..." />
            </div>
          }
        >
          <ContactSection />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
