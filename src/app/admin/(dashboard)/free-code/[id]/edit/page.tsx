import React from "react";
import { notFound } from "next/navigation";
import { getAdminProjectById, getAllAdminProjects } from "@/lib/freeCodeDb";
import { ProjectEditorForm } from "@/components/admin/ProjectEditorForm";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProjectPage({ params }: EditPageProps) {
  const { id } = await params;
  const project = await getAdminProjectById(id);

  if (!project) {
    notFound();
  }

  const existingProjects = await getAllAdminProjects();
  const existingReelNumbers = existingProjects.map((p) => p.reel_number);

  return (
    <div className="space-y-6">
      <ProjectEditorForm
        mode="edit"
        initialData={project}
        existingReelNumbers={existingReelNumbers}
      />
    </div>
  );
}
