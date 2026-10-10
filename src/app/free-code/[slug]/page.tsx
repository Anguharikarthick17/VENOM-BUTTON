import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  FREE_CODE_RESOURCES,
  FreeCodeResource,
  isValidGitHubUrl,
} from "@/data/freeCodeResources";
import { SOCIAL_URLS } from "@/data/socialLinks";
import { ArrowLeft, ArrowUpRight, Film, ExternalLink } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  if (FREE_CODE_RESOURCES.length === 0) {
    return [{ slug: "000" }];
  }
  return FREE_CODE_RESOURCES.map((r) => ({ slug: r.reelNumber }));
}

function findReel(slug: string): FreeCodeResource | undefined {
  const normalized = slug.toLowerCase().replace(/^reel-?/, "").trim();
  return FREE_CODE_RESOURCES.find(
    (r) =>
      r.reelNumber.toLowerCase() === normalized ||
      r.reelNumber.toLowerCase() === slug.toLowerCase()
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = findReel(slug);
  if (!resource) {
    return { title: "Reel Project Not Found | GENZLOG Free Code Vault" };
  }

  return {
    title: `REEL #${resource.reelNumber}: ${resource.title} — Source Code | GENZLOG`,
    description: `Open source frontend repository for Instagram Reel #${resource.reelNumber}: ${resource.title}. Verified source code available on GitHub.`,
    openGraph: {
      title: `REEL #${resource.reelNumber} — ${resource.title}`,
      description: `Open source frontend repository for Instagram Reel #${resource.reelNumber}.`,
      url: `https://genzlog.com/free-code/${resource.reelNumber}`,
    },
  };
}

export default async function FreeCodeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const resource = findReel(slug);

  if (!resource) {
    notFound();
  }

  const isGithubValid = isValidGitHubUrl(resource.githubUrl);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <main className="pt-12 sm:pt-16 pb-24">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-10 lg:px-16 2xl:px-24 space-y-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between text-xs font-mono">
            <Link
              href="/free-code"
              className="inline-flex items-center gap-1.5 text-white hover:underline transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Numbered Reel Vault</span>
            </Link>

            <span className="text-[#888888] font-bold">
              REEL #{resource.reelNumber}
            </span>
          </div>

          {/* Header Summary */}
          <div className="pb-8 border-b border-[#303030] space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#141414] border border-[#2A2A2A] text-xs font-mono font-bold text-[#22D3EE] tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
                <span>REEL #{resource.reelNumber}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white font-display leading-[1.05]">
              {resource.title}
            </h1>
          </div>

          {/* Main Resource Card Showcase (4 items strictly) */}
          <div className="bg-[#0D0D0D] border border-[#222222] rounded-2xl overflow-hidden max-w-3xl space-y-6">
            {/* 1. Exact Project Image */}
            <div className="relative aspect-video w-full overflow-hidden bg-[#141414] border-b border-[#222222]">
              {resource.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#666666] bg-radial from-[#1A1A1A] to-[#0A0A0A]">
                  <Film className="w-12 h-12 text-[#444444] mb-3" />
                  <span className="text-xs font-mono tracking-wider text-[#888888] uppercase">
                    REEL #{resource.reelNumber} PREVIEW
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* 2. Permanent Reel Number & 3. Title */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-[#22D3EE] font-bold uppercase tracking-wider">
                  INSTAGRAM REEL #{resource.reelNumber}
                </span>
                <h2 className="text-2xl font-bold uppercase font-display text-white">
                  {resource.title}
                </h2>
              </div>

              {/* 4. VIEW SOURCE ON GITHUB ↗ Button */}
              <div className="pt-4 border-t border-[#1C1C1C]">
                {isGithubValid ? (
                  <a
                    href={resource.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#050505] hover:bg-[#F5F5F5] font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
                  >
                    <span>VIEW SOURCE ON GITHUB</span>
                    <ArrowUpRight className="w-4 h-4 text-[#050505]" />
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#141414] text-[#777777] font-mono font-bold text-xs uppercase tracking-wider rounded-xl border border-[#222222]">
                    <span>REPOSITORY PENDING PUBLICATION</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Return CTA */}
          <div className="pt-6 border-t border-[#262626] flex items-center justify-between text-xs font-mono text-[#888888]">
            <Link
              href="/free-code"
              className="text-white hover:underline flex items-center gap-1 font-bold"
            >
              <span>← Browse all Numbered Reel Projects</span>
            </Link>
            <a
              href={SOCIAL_URLS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Follow @genzlog on Instagram</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
