import React from "react";
import { Metadata } from "next";
import { PricingSection } from "@/components/PricingSection";
import { ErrorBoundary } from "@/components/states/ErrorBoundary";

export const metadata: Metadata = {
  title: "Good Work. Clear Pricing — Pricing Philosophy & Scope | GENZLOG",
  description:
    "Every project is different. We price our work according to your requirements, the complexity of the solution, and the features needed to bring your idea to life.",
};

export default function PricingPage() {
  return (
    <main className="bg-transparent min-h-screen text-white relative">
      <ErrorBoundary
        title="Pricing Guide Unavailable"
        message="An issue occurred loading the pricing calculator and tiers. You can request a custom quote directly."
      >
        <PricingSection />
      </ErrorBoundary>
    </main>
  );
}
