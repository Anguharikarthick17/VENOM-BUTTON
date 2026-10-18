import { createBrowserClient } from "@supabase/ssr";

/**
 * Returns a Supabase client for browser-side interactions (e.g. login form, auth state change).
 */
export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
