import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/supabase/auth";
import {
  getAdminProjectById,
  updateProject,
  deleteProject,
  togglePublishProject,
  UpdateProjectPayload,
} from "@/lib/freeCodeDb";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const project = await getAdminProjectById(id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body: UpdateProjectPayload = await req.json();
    const updated = await updateProject(id, body);

    return NextResponse.json({
      success: true,
      project: updated,
      message: `Project #${updated.reel_number} (${updated.title}) updated successfully.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    await deleteProject(id);

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    if (typeof body.publish !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Payload must contain boolean 'publish' field." },
        { status: 400 }
      );
    }

    const updated = await togglePublishProject(id, body.publish);
    return NextResponse.json({
      success: true,
      project: updated,
      message: `Project #${updated.reel_number} is now ${updated.status}.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
