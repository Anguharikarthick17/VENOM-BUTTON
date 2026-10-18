import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/supabase/auth";
import { getAllAdminProjects, createProject, CreateProjectPayload } from "@/lib/freeCodeDb";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const projects = await getAllAdminProjects();
    return NextResponse.json({ success: true, projects });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Admin Projects GET] Error:", msg);
    return NextResponse.json(
      { success: false, error: msg || "Failed to fetch projects." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const body: CreateProjectPayload = await req.json();
    const created = await createProject(body);

    return NextResponse.json(
      {
        success: true,
        project: created,
        message: `Project #${created.reel_number} (${created.title}) created successfully.`,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Admin Projects POST] Error:", msg);
    return NextResponse.json(
      { success: false, error: msg || "Failed to create project." },
      { status: 400 }
    );
  }
}
