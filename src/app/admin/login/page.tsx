"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldAlert, KeyRound, AlertCircle, ArrowLeft } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/admin";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlError === "unconfigured"
      ? "Supabase credentials are not configured in your environment."
      : null
  );
  const [isConfigured, setIsConfigured] = useState<boolean>(urlError !== "unconfigured");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 503) {
          setIsConfigured(false);
        }
        setErrorMessage(data.error || "Authentication failed. Please verify credentials.");
        setLoading(false);
        return;
      }

      // Successful login
      router.push(nextUrl);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Network error during login: ${msg}`);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Identity */}
      <div className="text-center mb-8 space-y-3">
        <Link href="/" className="inline-block focus:outline-none">
          <div className="relative h-9 w-auto aspect-[1024/682] mx-auto">
            <Image
              src="/genzlog-logo-white.png"
              alt="GENZLOG Official Logo"
              width={160}
              height={100}
              className="object-contain h-full w-auto"
              priority
            />
          </div>
        </Link>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#141414] border border-[#2B2B2B] rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-[#CCCCCC] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>GENZLOG ADMIN CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white font-display">
            SECURE ACCESS
          </h1>
          <p className="text-xs text-[#888888] font-mono mt-1">
            Private management console for Free Code Vault
          </p>
        </div>
      </div>

      {/* Unconfigured Alert Banner */}
      {!isConfigured && (
        <div className="mb-6 p-4 rounded-xl bg-[#141414] border border-[#333333] space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-white font-bold">
            <AlertCircle className="w-4 h-4 text-white" />
            <span>Supabase Configuration Notice</span>
          </div>
          <p className="text-[#A3A3A3] leading-relaxed">
            Please configure <code className="text-white bg-[#222222] px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code>, <code className="text-white bg-[#222222] px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and <code className="text-white bg-[#222222] px-1 py-0.5 rounded">SUPABASE_SERVICE_ROLE_KEY</code> in <code className="text-white bg-[#222222] px-1 py-0.5 rounded">.env.local</code>.
          </p>
        </div>
      )}

      {/* Main Login Card */}
      <div className="bg-[#0D0D0D] border border-[#262626] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {errorMessage && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-[#161616] border border-white/20 text-xs font-mono text-white flex items-start gap-2.5 animate-in fade-in"
          >
            <ShieldAlert className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="admin-email"
              className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block"
            >
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@genzlog.com"
                required
                autoComplete="email"
                className="w-full bg-[#141414] border border-[#2B2B2B] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#555555] outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-mono"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="admin-password"
                className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="w-full bg-[#141414] border border-[#2B2B2B] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#555555] outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-mono"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-white hover:bg-[#F5F5F5] text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#050505] border-t-transparent rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In To Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#050505]" />
              </>
            )}
          </button>
        </form>

        {/* Security Footnote */}
        <div className="pt-4 border-t border-[#1F1F1F] text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#666666]">
            <KeyRound className="w-3 h-3" />
            <span>Restricted Access: Authorized Accounts Only</span>
          </div>
          <p className="text-[10px] font-mono text-[#555555]">
            Sign in requires valid Supabase Auth credentials explicitly granted in ADMIN_EMAILS roster.
          </p>
        </div>
      </div>

      {/* Return to website */}
      <div className="text-center mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#888888] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to GENZLOG Public Site</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center px-4 py-12 relative">
      <Suspense fallback={<div className="text-xs font-mono text-[#666666]">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
