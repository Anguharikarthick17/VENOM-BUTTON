import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getPublishedProjectBySlugOrReel, getPublishedProjects } from "@/lib/freeCodeDb";
import { ReelResourceCard } from "@/components/free-code/ReelResourceCard";
import { SOCIAL_URLS } from "@/data/socialLinks";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const instant = false;

export async function generateStaticParams() {
  try {
    const projects = await getPublishedProjects();
    if (!projects || projects.length === 0) {
      return [{ slug: "1" }];
    }
    const paramsList: { slug: string }[] = [];
    for (const p of projects) {
      paramsList.push({ slug: p.reelNumber });
      if (p.slug && p.slug !== p.reelNumber) {
        paramsList.push({ slug: p.slug });
      }
    }
    return paramsList;
  } catch {
    return [{ slug: "1" }];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getPublishedProjectBySlugOrReel(slug);
  if (!resource) {
    return { title: "Reel Project Not Found | GENZLOG Free Code Vault" };
  }

  return {
    title: `REEL #${resource.reelNumber}: ${resource.title} — Source Code | GENZLOG`,
    description: `Open source frontend repository for Instagram Reel #${resource.reelNumber}: ${resource.title}. Verified source code available on GitHub.`,
    openGraph: {
      title: `REEL #${resource.reelNumber} — ${resource.title}`,
      description: `Open source frontend repository for Instagram Reel #${resource.reelNumber}.`,
      url: `https://genzlog.com/free-code/${resource.slug || resource.reelNumber}`,
      images: resource.image ? [{ url: resource.image }] : undefined,
    },
  };
}

export default async function FreeCodeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const resource = await getPublishedProjectBySlugOrReel(slug);

  if (!resource) {
    notFound();
  }

  const cleanReel = resource.reelNumber.replace(/^#/, "");

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
              #{cleanReel}
            </span>
          </div>

          {/* Header Summary */}
          <div className="pb-8 border-b border-[#303030] space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#141414] border border-[#2A2A2A] text-xs font-mono font-bold text-[#22D3EE] tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
                <span>#{cleanReel}</span>
              </span>
              {resource.category && (
                <span className="px-2.5 py-0.5 rounded-md bg-[#161616] border border-[#282828] text-xs font-mono text-[#A3A3A3]">
                  {resource.category}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white font-display leading-[1.05]">
              {resource.title}
            </h1>
          </div>

          {/* Main Resource Card Showcase */}
          <div className="max-w-2xl">
            <ReelResourceCard resource={resource} />
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
