import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
    return NextResponse.json({ success: true, message: "Logged out successfully." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Admin Auth API] Logout error:", msg);
    return NextResponse.json(
      { success: false, error: "Logout encountered an error." },
      { status: 500 }
    );
  }
}
