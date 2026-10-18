"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FreeCodeProjectRow } from "@/lib/freeCodeDb";
import { isValidGitHubUrl } from "@/data/freeCodeResources";
import {
  UploadCloud,
  Check,
  AlertCircle,
  ArrowLeft,
  Trash2,
  X,
  Globe,
  Film,
  Maximize2,
} from "lucide-react";

interface ProjectEditorFormProps {
  mode: "create" | "edit";
  initialData?: FreeCodeProjectRow;
  nextSuggestedReelNumber?: number;
  existingReelNumbers?: number[];
}

const CATEGORY_PRESETS = [
  "Login & Signup",
  "Navigation",
  "Pricing Cards",
  "Forms & Inputs",
  "Buttons & Effects",
  "Landing Page Sections",
  "Portfolio & Agency",
  "3D & WebGL",
  "Full Stack",
];

const TECH_PRESETS = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Three.js",
  "Framer Motion",
  "HTML5",
  "CSS3",
  "JavaScript",
  "Supabase",
];

export function ProjectEditorForm({
  mode,
  initialData,
  nextSuggestedReelNumber = 1,
  existingReelNumbers = [],
}: ProjectEditorFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [reelNumber, setReelNumber] = useState<number | string>(
    initialData ? initialData.reel_number : nextSuggestedReelNumber
  );
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(mode === "edit");
  const [shortDescription, setShortDescription] = useState(
    initialData?.short_description || ""
  );
  const [description, setDescription] = useState(initialData?.description || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail_url || "");
  const [githubUrl, setGithubUrl] = useState(initialData?.github_url || "");
  const [liveDemoUrl, setLiveDemoUrl] = useState(initialData?.live_demo_url || "");
  const [techStack, setTechStack] = useState<string[]>(initialData?.tech_stack || []);
  const [techInput, setTechInput] = useState("");
  const [features, setFeatures] = useState<string[]>(
    initialData?.features || ["Responsive animations", "Accessible component structure"]
  );
  const [featureInput, setFeatureInput] = useState("");
  const [category, setCategory] = useState(initialData?.category || "Landing Page Sections");
  const [status, setStatus] = useState<"draft" | "published">(
    initialData?.status || "draft"
  );

  // State Management
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-slug generator
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isSlugManuallyEdited) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  // Duplicate Reel Number check
  const reelNumInt = Number(reelNumber);
  const isDuplicateReelNumber =
    Number.isInteger(reelNumInt) &&
    existingReelNumbers.includes(reelNumInt) &&
    (!initialData || initialData.reel_number !== reelNumInt);

  // Tech stack tag helpers
  const handleAddTech = (tech: string) => {
    const trimmed = tech.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack([...techStack, trimmed]);
    }
    setTechInput("");
  };

  const handleRemoveTech = (index: number) => {
    setTechStack(techStack.filter((_, i) => i !== index));
  };

  // Features list helpers
  const handleAddFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed) {
      setFeatures([...features, trimmed]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Thumbnail upload to Supabase Storage via /api/admin/upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image file exceeds the maximum 5 MB limit.");
      return;
    }

    setUploadingImage(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to upload image.");
        return;
      }

      setThumbnailUrl(data.url);
      setSuccessMessage("Thumbnail uploaded securely to storage.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Upload error: ${msg}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Validation
  const validateForm = () => {
    if (!reelNumInt || reelNumInt <= 0) {
      setErrorMessage("Please enter a positive integer for the Reel number (e.g. 1, 2, 3).");
      return false;
    }

    if (isDuplicateReelNumber) {
      setErrorMessage(`Reel #${reelNumInt} already exists. Reel numbers must be permanently unique.`);
      return false;
    }

    if (!title.trim()) {
      setErrorMessage("Project title is required.");
      return false;
    }

    if (!description.trim()) {
      setErrorMessage("Project description is required.");
      return false;
    }

    if (!thumbnailUrl.trim()) {
      setErrorMessage("Thumbnail image is required. Upload an image or provide an image URL.");
      return false;
    }

    if (!isValidGitHubUrl(githubUrl)) {
      setErrorMessage("A valid HTTPS GitHub repository URL is required (e.g. https://github.com/username/repo).");
      return false;
    }

    if (liveDemoUrl && !/^https:\/\/.+/.test(liveDemoUrl.trim())) {
      setErrorMessage("Live demo URL must begin with https://");
      return false;
    }

    return true;
  };

  // Submit Handler
  const handleSave = async (intendedStatus?: "draft" | "published") => {
    setErrorMessage(null);
    if (!validateForm()) return;

    const finalStatus = intendedStatus || status;
    setIsSubmitting(true);

    const payload = {
      reel_number: reelNumInt,
      title: title.trim(),
      slug: slug.trim() || undefined,
      short_description: shortDescription.trim() || undefined,
      description: description.trim(),
      thumbnail_url: thumbnailUrl.trim(),
      github_url: githubUrl.trim(),
      live_demo_url: liveDemoUrl.trim() || null,
      tech_stack: techStack,
      features: features,
      category: category.trim() || null,
      status: finalStatus,
    };

    try {
      const endpoint = mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to save project.");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/free-code");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Network error saving project: ${msg}`);
      setIsSubmitting(false);
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    if (!initialData) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${initialData.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to delete project.");
        setIsDeleting(false);
        return;
      }

      router.push("/admin/free-code");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Delete error: ${msg}`);
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Return link */}
      <div>
        <Link
          href="/admin/free-code"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#888888] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Project Inventory</span>
        </Link>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-[#241313] border border-[#572222] text-xs font-mono text-[#F87171] flex items-start gap-2.5 animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{errorMessage}</div>
          <button type="button" onClick={() => setErrorMessage(null)} className="cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="p-4 rounded-xl bg-[#0E1D13] border border-[#225732] text-xs font-mono text-[#4ADE80] flex items-center gap-2 animate-in fade-in"
        >
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-[#0C0C0C] border border-[#222222] rounded-2xl p-6 sm:p-10 space-y-8">
        {/* Header Section */}
        <div className="border-b border-[#202020] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-white">
              {mode === "create" ? "NEW FREE CODE PROJECT" : `EDIT REEL #${initialData?.reel_number}`}
            </h2>
            <p className="text-xs font-mono text-[#888888] mt-1">
              {mode === "create"
                ? "Configure project metadata, upload screenshot, and choose publication status."
                : `Editing repository details for ${initialData?.title}`}
            </p>
          </div>

          {/* Current Status Pill */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStatus(status === "published" ? "draft" : "published")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                status === "published"
                  ? "bg-[#14261C] border-[#204E35] text-[#4ADE80]"
                  : "bg-[#261E14] border-[#4E3920] text-[#FBBF24]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  status === "published" ? "bg-[#4ADE80]" : "bg-[#FBBF24]"
                }`}
              />
              <span>{status === "published" ? "Status: Published" : "Status: Draft"}</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="space-y-6">
          {/* Row 1: Reel Number & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4 space-y-1.5">
              <label htmlFor="reel-number" className="text-xs font-mono uppercase text-[#A3A3A3] block">
                Reel Number <span className="text-white">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#22D3EE]">
                  #
                </span>
                <input
                  id="reel-number"
                  type="number"
                  min="1"
                  step="1"
                  value={reelNumber}
                  onChange={(e) => setReelNumber(e.target.value)}
                  className={`w-full bg-[#141414] border rounded-xl pl-8 pr-4 py-3 text-sm text-white font-mono outline-none transition-all ${
                    isDuplicateReelNumber
                      ? "border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]"
                      : "border-[#2B2B2B] focus:border-white focus:ring-1 focus:ring-white"
                  }`}
                  required
                />
              </div>
              {isDuplicateReelNumber && (
                <p className="text-[11px] font-mono text-[#EF4444]">
                  Reel #{reelNumInt} is already taken. Reel numbers must be unique.
                </p>
              )}
            </div>

            <div className="sm:col-span-8 space-y-1.5">
              <label htmlFor="project-slug" className="text-xs font-mono uppercase text-[#A3A3A3] block">
                URL Slug <span className="text-[#666666]">(e.g. /free-code/{slug || "slug"})</span>
              </label>
              <input
                id="project-slug"
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsSlugManuallyEdited(true);
                }}
                placeholder="login-page"
                className="w-full bg-[#141414] border border-[#2B2B2B] rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              />
            </div>
          </div>

          {/* Row 2: Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8 space-y-1.5">
              <label htmlFor="project-title" className="text-xs font-mono uppercase text-[#A3A3A3] block">
                Project Title <span className="text-white">*</span>
              </label>
              <input
                id="project-title"
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. GENZLOG Login Page"
                required
                className="w-full bg-[#141414] border border-[#2B2B2B] rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              />
            </div>

            <div className="sm:col-span-4 space-y-1.5">
              <label htmlFor="project-category" className="text-xs font-mono uppercase text-[#A3A3A3] block">
                Category
              </label>
              <select
                id="project-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#141414] border border-[#2B2B2B] rounded-xl px-3 py-3 text-sm text-white font-mono outline-none focus:border-white transition-all cursor-pointer"
              >
                {CATEGORY_PRESETS.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#141414] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Short Description */}
          <div className="space-y-1.5">
            <label htmlFor="short-desc" className="text-xs font-mono uppercase text-[#A3A3A3] block">
              Short Description <span className="text-[#666666]">(card summary)</span>
            </label>
            <textarea
              id="short-desc"
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Concise 1-2 sentence overview shown on project cards..."
              className="w-full bg-[#141414] border border-[#2B2B2B] rounded-xl p-3 text-xs sm:text-sm text-white placeholder-[#555555] font-mono outline-none focus:border-white resize-none"
            />
          </div>

          {/* Row 4: Full Verified Description */}
          <div className="space-y-1.5">
            <label htmlFor="full-desc" className="text-xs font-mono uppercase text-[#A3A3A3] block">
              Full Description <span className="text-white">*</span>
            </label>
            <textarea
              id="full-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Comprehensive architectural and feature description of the project..."
              required
              className="w-full bg-[#141414] border border-[#2B2B2B] rounded-xl p-3 text-xs sm:text-sm text-white placeholder-[#555555] font-mono outline-none focus:border-white resize-none"
            />
          </div>

          {/* Row 5: Thumbnail Image Upload & Direct URL */}
          <div className="space-y-3 p-4 sm:p-5 rounded-xl bg-[#101010] border border-[#222222]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-white font-bold block">
                Project Thumbnail Screenshot <span className="text-white">*</span>
              </label>
              <span className="text-[10px] font-mono text-[#777777]">
                Supported: JPEG, PNG, WebP, AVIF (Max 5MB)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Preview Box */}
              <div className="md:col-span-5 aspect-video rounded-xl bg-[#141414] border border-[#282828] overflow-hidden flex items-center justify-center relative group">
                {thumbnailUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnailUrl}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover"
                    />
                    <a
                      href={thumbnailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-mono gap-1"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>View Full Size</span>
                    </a>
                  </>
                ) : (
                  <div className="text-center p-4 text-[#666666] space-y-1">
                    <Film className="w-6 h-6 mx-auto mb-1 text-[#444444]" />
                    <span className="text-[11px] font-mono uppercase tracking-wider block">
                      No Screenshot Uploaded
                    </span>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="md:col-span-7 space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#F0F0F0] text-[#050505] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4 text-[#050505]" />
                  <span>{uploadingImage ? "Uploading to Storage..." : "Upload Screenshot File"}</span>
                </button>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#777777] block">
                    Or direct URL / path:
                  </span>
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="e.g. /projects/login-page/screenshot.png or https://..."
                    className="w-full bg-[#141414] border border-[#2B2B2B] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-white transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 6: GitHub URL & Live Demo URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="github-url" className="text-xs font-mono uppercase text-[#A3A3A3] block">
                GitHub Repository URL <span className="text-white">*</span>
              </label>
              <input
                id="github-url"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/Anguharikarthick17/..."
                required
                className="w-full bg-[#141414] border border-[#2B2B2B] rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="demo-url" className="text-xs font-mono uppercase text-[#A3A3A3] block">
                Live Demo URL <span className="text-[#666666]">(Optional)</span>
              </label>
              <input
                id="demo-url"
                type="url"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                placeholder="https://demo.example.com"
                className="w-full bg-[#141414] border border-[#2B2B2B] rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              />
            </div>
          </div>

          {/* Row 7: Tech Stack Tags */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-[#A3A3A3] block">
              Technology Stack
            </label>
            <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl bg-[#141414] border border-[#2B2B2B] items-center">
              {techStack.map((tech, idx) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#202020] border border-[#333333] text-xs font-mono text-white"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(idx)}
                    className="hover:text-[#EF4444] cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddTech(techInput);
                  }
                }}
                placeholder="Type tech & press Enter..."
                className="bg-transparent border-none outline-none text-xs text-white font-mono px-2 py-1 flex-1 min-w-[140px]"
              />
            </div>

            {/* Quick preset chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono text-[#666666] mr-1">Quick Add:</span>
              {TECH_PRESETS.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => handleAddTech(tech)}
                  disabled={techStack.includes(tech)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161616] border border-[#262626] text-[#A3A3A3] hover:text-white hover:border-[#444444] disabled:opacity-40 cursor-pointer"
                >
                  +{tech}
                </button>
              ))}
            </div>
          </div>

          {/* Row 8: Key Features List */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-[#A3A3A3] block">
              Key Features List
            </label>
            <div className="space-y-2">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-xl bg-[#141414] border border-[#262626] text-xs font-mono text-white"
                >
                  <Check className="w-3.5 h-3.5 text-[#22D3EE] shrink-0" />
                  <span className="flex-1">{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="p-1 hover:text-[#EF4444] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="Add a key feature bullet point..."
                  className="flex-1 bg-[#141414] border border-[#2B2B2B] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-white transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#303030] text-xs font-mono font-bold text-white rounded-xl cursor-pointer"
                >
                  Add Feature
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-6 border-t border-[#202020] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {mode === "edit" && initialData && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1C1212] hover:bg-[#2C1818] border border-[#4E2222] text-[#EF4444] text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Project</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave("draft")}
              className="px-5 py-3 rounded-xl bg-[#141414] hover:bg-[#202020] text-white border border-[#2E2E2E] hover:border-white text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
            >
              Save As Draft
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave("published")}
              className="px-6 py-3 rounded-xl bg-white hover:bg-[#F5F5F5] text-[#050505] text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5 text-[#050505]" />
                  <span>Publish Project</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && initialData && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-[#0E0E0E] border border-[#333333] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-white">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#261414] border border-[#572222] flex items-center justify-center text-[#EF4444] shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold uppercase font-display tracking-tight text-white">
                  Permanently Delete #{initialData.reel_number}?
                </h3>
                <p className="text-xs font-mono text-[#A3A3A3] leading-relaxed">
                  Are you sure you want to permanently delete &quot;{initialData.title}&quot;? This cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] text-[#CCCCCC] hover:text-white border border-[#2B2B2B] text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
