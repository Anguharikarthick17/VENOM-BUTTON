import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, isSupabaseConfigured } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export async function POST(req: NextRequest) {
  try {
    // 1. Authorize admin session
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Supabase storage is not configured." },
        { status: 503 }
      );
    }

    // 2. Extract form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided." },
        { status: 400 }
      );
    }

    // 3. Validate file size and mime type
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the 5 MB limit (current: ${(file.size / (1024 * 1024)).toFixed(2)} MB).`,
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type (${file.type}). Allowed formats: JPEG, PNG, WebP, AVIF.`,
        },
        { status: 400 }
      );
    }

    // 4. Sanitize file name and create unique path
    const extension = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
    const cleanBasename = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 40);
    const uniquePath = `thumbnails/${Date.now()}-${cleanBasename}.${extension}`;

    // 5. Convert file to buffer and upload via Admin client
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const adminClient = createAdminClient();
    const { error: uploadError } = await adminClient.storage
      .from("free-code-thumbnails")
      .upload(uniquePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[Storage Upload API] Upload failed:", uploadError);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to upload image to storage: ${uploadError.message}`,
        },
        { status: 500 }
      );
    }

    // 6. Get public URL
    const { data: publicUrlData } = adminClient.storage
      .from("free-code-thumbnails")
      .getPublicUrl(uniquePath);

    return NextResponse.json(
      {
        success: true,
        url: publicUrlData.publicUrl,
        path: uniquePath,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Storage Upload API] Unexpected error:", msg);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during image upload." },
      { status: 500 }
    );
  }
}
