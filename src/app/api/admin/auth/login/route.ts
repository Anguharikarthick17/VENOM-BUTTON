import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminEmail, isSupabaseConfigured } from "@/lib/supabase/auth";

export async function POST(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Supabase credentials are not configured. Please define SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in your environment.",
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Password is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Authenticate with Supabase Auth
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        {
          success: false,
          error: error?.message || "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // 2. Strict Admin Email Authorization Check
    const isAuthorized = isAdminEmail(data.user.email);
    if (!isAuthorized) {
      // Immediately revoke session
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          success: false,
          error: `Access Denied: The account ${data.user.email} is not authorized for GENZLOG Admin access.`,
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Admin Auth API] Unexpected login error:", msg);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during sign in." },
      { status: 500 }
    );
  }
}
