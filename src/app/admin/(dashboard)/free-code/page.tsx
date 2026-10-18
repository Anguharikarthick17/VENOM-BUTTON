import React from "react";
import { getAllAdminProjects } from "@/lib/freeCodeDb";
import { FreeCodeProjectManager } from "@/components/admin/FreeCodeProjectManager";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default async function AdminFreeCodeListPage() {
  const projects = await getAllAdminProjects();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#242424]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#888888]">
              {"// CONTENT INVENTORY"}
            </span>
            <span className="text-[#444444]">•</span>
            <span className="text-xs font-mono text-[#CCCCCC] uppercase tracking-wider">
              PROJECT CATALOGUE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display uppercase tracking-tight text-white">
            FREE CODE VAULT PROJECTS
          </h1>
          <p className="text-xs sm:text-sm text-[#A3A3A3] mt-1.5 max-w-xl leading-relaxed">
            Reorder, curate, publish, and manage all source code repositories accompanying Instagram Reels.
          </p>
        </div>

        <Link
          href="/admin/free-code/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#050505]" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Interactive Project Manager */}
      <FreeCodeProjectManager initialProjects={projects} />
    </div>
  );
}
