import React from "react";
import { Metadata } from "next";
import { NotFoundState } from "@/components/states/NotFoundState";

export const metadata: Metadata = {
  title: "404 — Page Not Found | GENZLOG",
  description: "The page or resource you are looking for does not exist on GENZLOG.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-transparent text-white flex items-center justify-center">
      <NotFoundState />
    </main>
  );
}
