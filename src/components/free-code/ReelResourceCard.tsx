"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FreeCodeResource,
  isValidGitHubUrl,
} from "@/data/freeCodeResources";
import {
  ArrowUpRight,
  Film,
  Maximize2,
  X,
  Info,
  Check,
  ExternalLink,
} from "lucide-react";

interface ReelResourceCardProps {
  resource: FreeCodeResource;
}

/**
 * Centered, responsive full-screen lightbox / image viewer
 */
function ImageViewerModal({
  isOpen,
  onClose,
  src,
  alt,
  reelNumber,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  reelNumber: string;
  title: string;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    // Auto focus close button for accessibility
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Enlarged screenshot of ${title}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-200"
    >
      {/* Top action bar */}
      <div className="w-full max-w-5xl flex items-center justify-between pb-3 sm:pb-4 text-white z-10">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-[#161616] border border-[#2E2E2E] text-xs font-mono font-bold text-[#22D3EE] tracking-widest uppercase">
            #{reelNumber.replace(/^#/, "")}
          </span>
          <span className="text-xs sm:text-sm font-mono text-[#D4D4D4] font-medium uppercase tracking-tight truncate max-w-[200px] sm:max-w-md">
            {title}
          </span>
        </div>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close full-screen image viewer"
          className="p-2 sm:p-2.5 rounded-xl bg-[#141414] border border-[#2E2E2E] hover:border-white text-[#A3A3A3] hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main image container */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        className="relative max-w-5xl max-h-[82vh] w-full flex items-center justify-center overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-xl border border-[#2B2B2B] shadow-2xl transition-transform select-none"
        />
      </div>

      {/* Bottom helper footnote */}
      <div className="w-full max-w-5xl pt-3 sm:pt-4 flex items-center justify-between text-[11px] font-mono text-[#777777]">
        <span>Actual project screenshot preview</span>
        <span>Press ESC or click outside to dismiss</span>
      </div>
    </div>
  );
}

/**
 * Accessible Project Details Modal dialog
 */
function ProjectDetailsModal({
  isOpen,
  onClose,
  onOpenViewer,
  resource,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenViewer: () => void;
  resource: FreeCodeResource;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isGithubValid = isValidGitHubUrl(resource.githubUrl);
  const reelNumber = resource.reelNumber.replace(/^#/, "");

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-details-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-[#0D0D0D] border border-[#262626] rounded-2xl p-6 sm:p-8 shadow-2xl text-white my-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#222222]">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#141414] border border-[#2A2A2A] text-xs font-mono font-bold text-[#22D3EE] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
              <span>#{reelNumber}</span>
            </div>
            <h2
              id="project-details-title"
              className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-white"
            >
              {resource.title}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="p-2 rounded-xl bg-[#141414] border border-[#2A2A2A] hover:border-white text-[#A3A3A3] hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thumbnail with expand prompt */}
        {resource.image && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenViewer();
              }}
              className="group/detailImg relative aspect-video w-full overflow-hidden rounded-xl bg-[#141414] border border-[#222222] cursor-zoom-in text-left focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Click to enlarge project screenshot"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resource.image}
                alt={resource.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/detailImg:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/detailImg:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 border border-white/30 text-white font-mono text-[11px] font-semibold tracking-wider backdrop-blur-sm shadow-xl">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>CLICK TO ENLARGE</span>
                </span>
              </div>
            </button>
            <p className="text-[11px] font-mono text-[#666666]">
              Click image to open full-screen viewer
            </p>
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#888888]">
            Description
          </h3>
          <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
            {resource.description || resource.shortDescription}
          </p>
        </div>

        {/* Technologies */}
        {resource.technologies && resource.technologies.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#888888]">
              Confirmed Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {resource.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-md bg-[#141414] border border-[#262626] text-xs font-mono text-[#E5E5E5] font-medium tracking-wide"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {resource.features && resource.features.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#888888]">
              Confirmed Features
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#A3A3A3]">
              {resource.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#22D3EE] shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] text-[#CCCCCC] hover:text-white border border-[#2B2B2B] text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close
          </button>

          {resource.liveDemoUrl && (
            <a
              href={resource.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 bg-[#1C1C1C] hover:bg-[#252525] text-white border border-[#303030] hover:border-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              <span>LIVE DEMO</span>
              <ExternalLink className="w-3.5 h-3.5 text-white" />
            </a>
          )}

          {isGithubValid && (
            <a
              href={resource.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 bg-white text-[#050505] hover:bg-[#F0F0F0] font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.12)] cursor-pointer"
            >
              <span>VIEW SOURCE ON GITHUB</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#050505]" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Upgraded Numbered Reel Vault Resource Card
 */
export function ReelResourceCard({ resource }: ReelResourceCardProps) {
  const [imgError, setImgError] = useState<boolean>(false);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  const isGithubValid = isValidGitHubUrl(resource.githubUrl);
  const reelNumber = resource.reelNumber.replace(/^#/, "");

  const handleOpenViewer = useCallback(() => {
    setIsViewerOpen(true);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setIsViewerOpen(false);
  }, []);

  const handleOpenDetails = useCallback(() => {
    setIsDetailsOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
  }, []);

  return (
    <>
      <article className="bg-[#0D0D0D] border border-[#222222] hover:border-[#444444] rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-lg">
        {/* Top: Visibly Clickable Project Screenshot */}
        <div className="relative aspect-video w-full overflow-hidden bg-[#141414] border-b border-[#222222]">
          {resource.image && !imgError ? (
            <button
              type="button"
              onClick={handleOpenViewer}
              className="group/img relative w-full h-full block cursor-zoom-in text-left focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset"
              aria-label={`Enlarge screenshot for ${resource.title}`}
              title="Click to view full-screen screenshot"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resource.image}
                alt={resource.title}
                onError={() => setImgError(true)}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
              />

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 border border-white/30 text-white font-mono text-[11px] font-semibold tracking-wider backdrop-blur-sm shadow-xl">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>CLICK TO ENLARGE</span>
                </span>
              </div>
            </button>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#666666] bg-radial from-[#1A1A1A] to-[#0A0A0A]">
              <Film className="w-8 h-8 text-[#444444] mb-2" />
              <span className="text-[11px] font-mono tracking-wider text-[#888888] uppercase">
                #{reelNumber} PREVIEW
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Header: Permanent Reel Number */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#141414] border border-[#2A2A2A] text-xs font-mono font-bold text-[#22D3EE] tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
                <span>#{reelNumber}</span>
              </span>

              {resource.image && !imgError && (
                <button
                  type="button"
                  onClick={handleOpenViewer}
                  className="text-[11px] font-mono text-[#888888] hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
                  title="Expand screenshot"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Enlarge</span>
                </button>
              )}
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-bold font-display uppercase tracking-tight text-white group-hover:text-white transition-colors leading-snug">
              {resource.title}
            </h2>

            {/* Short Description */}
            {resource.shortDescription && (
              <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
                {resource.shortDescription}
              </p>
            )}

            {/* Confirmed Technology Stack Badges */}
            {resource.technologies && resource.technologies.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-[#666666] uppercase tracking-wider block">
                  Tech Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {resource.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 rounded-md bg-[#141414] border border-[#262626] text-[11px] font-mono text-[#D4D4D4] font-medium tracking-wide"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Verified Features */}
            {resource.features && resource.features.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-[#666666] uppercase tracking-wider block">
                  Key Features
                </span>
                <ul className="space-y-1 text-xs text-[#8E8E8E]">
                  {resource.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]/80 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Area: View Details + GitHub Source */}
          <div className="pt-4 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenDetails}
              className="inline-flex items-center justify-center gap-1.5 flex-1 py-3 px-3 bg-[#141414] hover:bg-[#1E1E1E] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl border border-[#2B2B2B] hover:border-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
              title={`View project details for ${resource.title}`}
            >
              <Info className="w-3.5 h-3.5 text-[#A3A3A3]" />
              <span>DETAILS</span>
            </button>

            {resource.liveDemoUrl && (
              <a
                href={resource.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-3 px-3 bg-[#161616] hover:bg-[#222222] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl border border-[#2B2B2B] hover:border-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
                title={`Open live demo for #${reelNumber}`}
              >
                <span>DEMO</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#A3A3A3]" />
              </a>
            )}

            {isGithubValid ? (
              <a
                href={resource.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 flex-1 py-3 px-3 bg-white text-[#050505] hover:bg-[#F0F0F0] font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.12)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
                title={`View repository for #${reelNumber} on GitHub`}
              >
                <span>VIEW SOURCE</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#050505]" />
              </a>
            ) : (
              <span
                className="inline-flex items-center justify-center gap-1.5 flex-1 py-3 px-3 bg-[#141414] text-[#777777] font-mono font-bold text-xs uppercase tracking-wider rounded-xl border border-[#222222] select-none"
                title="Repository link pending publication"
              >
                <span>PENDING</span>
              </span>
            )}
          </div>
        </div>
      </article>

      {/* Full-Screen Image Lightbox Viewer Modal */}
      <ImageViewerModal
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
        src={resource.image}
        alt={resource.title}
        reelNumber={reelNumber}
        title={resource.title}
      />

      {/* Project Details Modal */}
      <ProjectDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        onOpenViewer={handleOpenViewer}
        resource={resource}
      />
    </>
  );
}
