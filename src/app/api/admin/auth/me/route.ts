import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/supabase/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    return NextResponse.json(
      { success: false, authenticated: false, error: session.error || "Not authenticated." },
      { status: 401 }
    );
  }

  if (!session.isAdmin) {
    return NextResponse.json(
      { success: false, authenticated: true, isAdmin: false, error: session.error || "Unauthorized admin account." },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    isAdmin: true,
    user: {
      id: session.user?.id,
      email: session.user?.email,
    },
  });
}
