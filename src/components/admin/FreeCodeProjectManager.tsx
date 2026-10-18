"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FreeCodeProjectRow } from "@/lib/freeCodeDb";
import {
  Search,
  PlusCircle,
  Edit3,
  ExternalLink,
  Trash2,
  Globe,
  EyeOff,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  X,
  Check,
  Film,
} from "lucide-react";

interface FreeCodeProjectManagerProps {
  initialProjects: FreeCodeProjectRow[];
}

export function FreeCodeProjectManager({ initialProjects }: FreeCodeProjectManagerProps) {
  const [projects, setProjects] = useState<FreeCodeProjectRow[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<FreeCodeProjectRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showNotification = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Toggle publish/unpublish
  const handleTogglePublish = async (project: FreeCodeProjectRow) => {
    const nextStatus = project.status === "published" ? false : true;
    setLoadingActionId(project.id);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showNotification("error", data.error || "Failed to update publication status.");
        return;
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, status: nextStatus ? "published" : "draft" } : p))
      );
      showNotification(
        "success",
        `Reel #${project.reel_number} is now ${nextStatus ? "PUBLISHED (live on vault)" : "DRAFT (hidden from vault)"}.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", `Network error: ${msg}`);
    } finally {
      setLoadingActionId(null);
    }
  };

  // Move project up or down in sort order (without changing permanent Reel numbers!)
  const handleReorder = async (currentIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const [moved] = newProjects.splice(currentIndex, 1);
    newProjects.splice(targetIndex, 0, moved);

    // Assign sequential sort_order
    const updatedOrders = newProjects.map((p, idx) => ({
      id: p.id,
      sort_order: idx + 1,
    }));

    // Optimistically update UI
    setProjects(
      newProjects.map((p, idx) => ({
        ...p,
        sort_order: idx + 1,
      }))
    );

    try {
      const res = await fetch("/api/admin/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders: updatedOrders }),
      });
      if (!res.ok) {
        showNotification("error", "Failed to persist new display order.");
      } else {
        showNotification("success", "Display order updated.");
      }
    } catch {
      showNotification("error", "Error saving new display order.");
    }
  };

  // Delete project
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showNotification("error", data.error || "Failed to delete project.");
        return;
      }

      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showNotification(
        "success",
        `Project #${deleteTarget.reel_number} (${deleteTarget.title}) deleted successfully.`
      );
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", `Delete failed: ${msg}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    // Status filter
    if (statusFilter !== "all" && p.status !== statusFilter) {
      return false;
    }

    // Search query
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;

    const cleanReel = String(p.reel_number);
    const title = p.title.toLowerCase();
    const slug = p.slug.toLowerCase();
    const tech = (p.tech_stack || []).join(" ").toLowerCase();

    return (
      cleanReel === q ||
      cleanReel === q.replace(/^#/, "") ||
      `#${cleanReel}` === q ||
      title.includes(q) ||
      slug.includes(q) ||
      tech.includes(q)
    );
  });

  const publishedCount = projects.filter((p) => p.status === "published").length;
  const draftCount = projects.filter((p) => p.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Toast Feedback Notification */}
      {feedback && (
        <div
          role="status"
          className={`p-4 rounded-xl border text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
            feedback.type === "success"
              ? "bg-[#0E1D13] border-[#225732] text-[#4ADE80]"
              : "bg-[#241313] border-[#572222] text-[#F87171]"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 hover:opacity-80 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Controls Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by Reel #, title, or technology..."
            className="w-full bg-[#111111] border border-[#2B2B2B] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#666666] outline-none focus:border-white transition-all font-mono"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#888888] hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filters & Create Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="inline-flex rounded-xl bg-[#111111] p-1 border border-[#262626] text-xs font-mono">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-white text-[#050505] font-bold"
                  : "text-[#888888] hover:text-white"
              }`}
            >
              All ({projects.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("published")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === "published"
                  ? "bg-white text-[#050505] font-bold"
                  : "text-[#888888] hover:text-white"
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("draft")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === "draft"
                  ? "bg-white text-[#050505] font-bold"
                  : "text-[#888888] hover:text-white"
              }`}
            >
              Drafts ({draftCount})
            </button>
          </div>

          <Link
            href="/admin/free-code/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Projects Table / Card List */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0C0C0C] border border-[#222222] text-center space-y-4">
          <Film className="w-8 h-8 text-[#555555] mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white uppercase font-display">
              No Matching Projects
            </h3>
            <p className="text-xs text-[#888888] font-mono">
              {searchQuery
                ? `No projects matched "${searchQuery}".`
                : "No projects in this category."}
            </p>
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 bg-[#161616] border border-[#2B2B2B] text-white rounded-xl text-xs font-mono"
            >
              Reset Search
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0C0C0C] border border-[#222222] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#222222] text-[11px] font-mono text-[#888888] uppercase tracking-wider bg-[#0E0E0E]">
                  <th className="py-3 px-4 w-12 text-center">Order</th>
                  <th className="py-3 px-4 w-16">Preview</th>
                  <th className="py-3 px-4 w-20">Reel #</th>
                  <th className="py-3 px-4">Project Title & Slug</th>
                  <th className="py-3 px-4 w-28">Status</th>
                  <th className="py-3 px-4 w-32 hidden md:table-cell">Updated</th>
                  <th className="py-3 px-4 w-44 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A] text-xs font-mono">
                {filteredProjects.map((project, index) => {
                  const isActionLoading = loadingActionId === project.id;
                  const updatedDate = new Date(project.updated_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-[#111111] transition-colors group"
                    >
                      {/* Sort Reorder Buttons */}
                      <td className="py-3 px-2 text-center">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleReorder(index, "up")}
                            className="p-1 text-[#666666] hover:text-white disabled:opacity-20 cursor-pointer"
                            title="Move Up in sort order"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={index === filteredProjects.length - 1}
                            onClick={() => handleReorder(index, "down")}
                            className="p-1 text-[#666666] hover:text-white disabled:opacity-20 cursor-pointer"
                            title="Move Down in sort order"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Thumbnail Image */}
                      <td className="py-3 px-4">
                        <div className="w-14 h-9 rounded-md bg-[#161616] border border-[#262626] overflow-hidden">
                          {project.thumbnail_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={project.thumbnail_url}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-[#666666]">
                              No img
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Reel Number */}
                      <td className="py-3 px-4 font-bold">
                        <span className="px-2 py-0.5 rounded bg-[#141414] border border-[#2B2B2B] text-[#22D3EE]">
                          #{project.reel_number}
                        </span>
                      </td>

                      {/* Title & Slug */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5 max-w-sm sm:max-w-md">
                          <div className="font-bold text-white font-display uppercase tracking-tight truncate">
                            {project.title}
                          </div>
                          <div className="text-[11px] text-[#777777] truncate flex items-center gap-2">
                            <span>/{project.slug}</span>
                            {project.category && (
                              <>
                                <span>•</span>
                                <span className="text-[#999999]">{project.category}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Publication Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            project.status === "published"
                              ? "bg-[#14261C] border border-[#204E35] text-[#4ADE80]"
                              : "bg-[#261E14] border border-[#4E3920] text-[#FBBF24]"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              project.status === "published" ? "bg-[#4ADE80]" : "bg-[#FBBF24]"
                            }`}
                          />
                          <span>{project.status}</span>
                        </span>
                      </td>

                      {/* Updated Date */}
                      <td className="py-3 px-4 text-[#888888] hidden md:table-cell text-[11px]">
                        {updatedDate}
                      </td>

                      {/* Actions Toolbar */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Toggle Publish */}
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => handleTogglePublish(project)}
                            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                              project.status === "published"
                                ? "bg-[#141414] hover:bg-[#202020] border-[#2A2A2A] text-[#A3A3A3] hover:text-white"
                                : "bg-[#14261C] hover:bg-[#1C3325] border-[#204E35] text-[#4ADE80]"
                            }`}
                            title={project.status === "published" ? "Unpublish (hide from public)" : "Publish (make live)"}
                          >
                            {project.status === "published" ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Globe className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Edit Project */}
                          <Link
                            href={`/admin/free-code/${project.id}/edit`}
                            className="p-1.5 rounded-lg bg-[#141414] hover:bg-[#202020] border border-[#2A2A2A] text-[#CCCCCC] hover:text-white transition-colors"
                            title="Edit project details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>

                          {/* Public Detail Preview */}
                          <Link
                            href={`/free-code/${project.slug || project.reel_number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#141414] hover:bg-[#202020] border border-[#2A2A2A] text-[#888888] hover:text-white transition-colors"
                            title="Preview on Public Free Code Vault"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {/* Delete Project */}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(project)}
                            className="p-1.5 rounded-lg bg-[#141414] hover:bg-[#281616] border border-[#2A2A2A] hover:border-[#662222] text-[#888888] hover:text-[#EF4444] transition-colors cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
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
                  Delete Project #{deleteTarget.reel_number}?
                </h3>
                <p className="text-xs font-mono text-[#A3A3A3] leading-relaxed">
                  Are you sure you want to permanently delete &quot;{deleteTarget.title}&quot;? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#141414] border border-[#222222] rounded-xl text-xs font-mono text-[#CCCCCC] space-y-1">
              <div><strong className="text-white">Reel:</strong> #{deleteTarget.reel_number}</div>
              <div><strong className="text-white">Slug:</strong> /{deleteTarget.slug}</div>
              <div><strong className="text-white">Status:</strong> {deleteTarget.status}</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] text-[#CCCCCC] hover:text-white border border-[#2B2B2B] text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
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
