import React from "react";
import { Metadata } from "next";
import { CommunityCardGenerator } from "@/components/community/CommunityCardGenerator";

export const metadata: Metadata = {
  title: "Community Card — Get Your Digital Identity | GENZLOG",
  description:
    "Generate your official GENZLOG digital community card. Personalize your hanging pass, preview the 3D rotating globe, and export a high-resolution PNG.",
  keywords: [
    "GENZLOG Community",
    "Digital Identity Card",
    "Community Pass",
    "Web Developer Card",
    "GENZLOG Digital Studio",
  ],
};

export default function CommunityPage() {
  return (
    <main className="w-full min-h-screen bg-[#050505] text-white">
      <CommunityCardGenerator />
    </main>
  );
}
