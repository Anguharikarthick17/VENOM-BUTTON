import React from "react";
import Link from "next/link";
import { getAllAdminProjects } from "@/lib/freeCodeDb";
import {
  Film,
  PlusCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Edit3,
  ExternalLink,
  Layers,
} from "lucide-react";

export const instant = false;

export default async function AdminDashboardOverviewPage() {
  const projects = await getAllAdminProjects();

  const totalCount = projects.length;
  const publishedCount = projects.filter((p) => p.status === "published").length;
  const draftCount = projects.filter((p) => p.status === "draft").length;
  const recentProjects = projects.slice(0, 5);

  return (
    <div className="space-y-10">
      {/* Page Title & Quick Action Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#242424]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#888888]">
              {"// DASHBOARD OVERVIEW"}
            </span>
            <span className="text-[#444444]">•</span>
            <span className="text-xs font-mono text-[#CCCCCC] uppercase tracking-wider">
              CONTENT MANAGEMENT SYSTEM
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display uppercase tracking-tight text-white">
            VAULT COMMAND
          </h1>
          <p className="text-xs sm:text-sm text-[#A3A3A3] mt-2 max-w-xl leading-relaxed">
            Manage, publish, and curate your Instagram Reel source code repositories directly in production.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/free-code/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            <PlusCircle className="w-4 h-4 text-[#050505]" />
            <span>Create Project</span>
          </Link>
          <Link
            href="/admin/free-code"
            className="inline-flex items-center gap-2 px-4 py-3 bg-[#141414] hover:bg-[#1E1E1E] text-white border border-[#2B2B2B] hover:border-white font-mono text-xs uppercase tracking-wider rounded-xl transition-colors"
          >
            <span>Manage All ({totalCount})</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#888888]" />
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Projects */}
        <div className="p-6 rounded-2xl bg-[#0C0C0C] border border-[#222222] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
            <span className="uppercase tracking-wider">TOTAL CATALOGUE</span>
            <Layers className="w-4 h-4 text-[#888888]" />
          </div>
          <div className="text-4xl font-bold font-display text-white">
            {totalCount}
          </div>
          <p className="text-xs font-mono text-[#666666]">
            Permanent Reel repositories recorded
          </p>
        </div>

        {/* Published Projects */}
        <div className="p-6 rounded-2xl bg-[#0C0C0C] border border-[#222222] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
            <span className="uppercase tracking-wider">PUBLIC / LIVE</span>
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div className="text-4xl font-bold font-display text-white">
            {publishedCount}
          </div>
          <p className="text-xs font-mono text-[#666666]">
            Visible on <span className="text-white font-medium">/free-code</span>
          </p>
        </div>

        {/* Draft Projects */}
        <div className="p-6 rounded-2xl bg-[#0C0C0C] border border-[#222222] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
            <span className="uppercase tracking-wider">UNPUBLISHED / DRAFTS</span>
            <Clock className="w-4 h-4 text-[#888888]" />
          </div>
          <div className="text-4xl font-bold font-display text-white">
            {draftCount}
          </div>
          <p className="text-xs font-mono text-[#666666]">
            Hidden from public visitors and search
          </p>
        </div>
      </div>

      {/* Recent Projects Table & Direct Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white font-display">
              Recent Projects
            </h2>
            <p className="text-xs font-mono text-[#888888]">
              Latest repositories in the management database
            </p>
          </div>

          <Link
            href="/admin/free-code"
            className="text-xs font-mono text-[#CCCCCC] hover:text-white underline underline-offset-4"
          >
            View all projects →
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="p-10 rounded-2xl bg-[#0C0C0C] border border-[#222222] text-center space-y-4">
            <Film className="w-8 h-8 text-[#555555] mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white uppercase font-display">
                No Projects Found
              </h3>
              <p className="text-xs text-[#888888] font-mono">
                Start by publishing Reel #1 or creating your first project entry.
              </p>
            </div>
            <Link
              href="/admin/free-code/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-xl"
            >
              <span>Add First Project</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-[#0C0C0C] border border-[#222222]">
            <div className="divide-y divide-[#1A1A1A]">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#111111] transition-colors"
                >
                  {/* Left thumbnail & title */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative w-16 h-11 rounded-lg overflow-hidden bg-[#161616] border border-[#262626] shrink-0">
                      {project.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.thumbnail_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-[#666666]">
                          #{project.reel_number}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#161616] border border-[#2E2E2E] text-[11px] font-mono font-bold text-[#22D3EE]">
                          #{project.reel_number}
                        </span>
                        <h3 className="text-sm font-bold uppercase tracking-tight text-white truncate max-w-[200px] sm:max-w-md font-display">
                          {project.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-[#888888]">
                        <span>/{project.slug}</span>
                        <span>•</span>
                        <span>{project.tech_stack?.slice(0, 3).join(", ") || "No tech tags"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Status & Actions */}
                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    {/* Status Pill */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider ${
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

                    {/* Quick Edit */}
                    <Link
                      href={`/admin/free-code/${project.id}/edit`}
                      className="p-2 rounded-lg bg-[#141414] hover:bg-[#202020] border border-[#282828] text-[#CCCCCC] hover:text-white transition-colors"
                      title="Edit Project"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>

                    {/* Preview */}
                    <Link
                      href={`/free-code/${project.slug || project.reel_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#141414] hover:bg-[#202020] border border-[#282828] text-[#888888] hover:text-white transition-colors"
                      title="View on Public Site"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
