import React from "react";
import { getAllAdminProjects } from "@/lib/freeCodeDb";
import { ProjectEditorForm } from "@/components/admin/ProjectEditorForm";

export const instant = false;

export default async function AdminNewProjectPage() {
  const existingProjects = await getAllAdminProjects();
  const existingReelNumbers = existingProjects.map((p) => p.reel_number);

  const maxReel = existingReelNumbers.length > 0
    ? Math.max(...existingReelNumbers)
    : 0;

  const nextSuggestedReelNumber = maxReel + 1;

  return (
    <div className="space-y-6">
      <ProjectEditorForm
        mode="create"
        nextSuggestedReelNumber={nextSuggestedReelNumber}
        existingReelNumbers={existingReelNumbers}
      />
    </div>
  );
}
