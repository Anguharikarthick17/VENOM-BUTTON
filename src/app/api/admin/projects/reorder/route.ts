import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/supabase/auth";
import { reorderProjects } from "@/lib/freeCodeDb";

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    if (!body || !Array.isArray(body.orders)) {
      return NextResponse.json(
        { success: false, error: "Invalid payload: 'orders' array is required." },
        { status: 400 }
      );
    }

    await reorderProjects(body.orders);
    return NextResponse.json({
      success: true,
      message: "Projects display order updated successfully.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
