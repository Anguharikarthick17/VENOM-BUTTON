"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  PlusCircle,
  ExternalLink,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";

interface AdminHeaderProps {
  userEmail?: string | null;
}

export function AdminHeader({ userEmail }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Free Code Vault", href: "/admin/free-code", icon: Film },
    { label: "Add Project", href: "/admin/free-code/new", icon: PlusCircle },
  ];

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/admin/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080808]/95 backdrop-blur-md border-b border-[#222222]">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="flex items-center gap-3 group focus:outline-none focus:ring-1 focus:ring-white rounded"
          >
            <div className="relative h-7 w-auto aspect-[1024/682]">
              <Image
                src="/genzlog-logo-white.png"
                alt="GENZLOG"
                width={120}
                height={80}
                className="object-contain h-full w-auto"
                priority
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#444444] font-mono">/</span>
              <span className="px-2 py-0.5 rounded bg-[#161616] border border-[#2B2B2B] text-[10px] font-mono font-bold uppercase tracking-widest text-white">
                ADMIN CMS
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 ml-4" aria-label="Admin Navigation">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    active
                      ? "bg-white text-[#050505] font-bold shadow-sm"
                      : "text-[#A3A3A3] hover:text-white hover:bg-[#141414]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Public Vault Link */}
          <Link
            href="/free-code"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1A1A1A] border border-[#282828] hover:border-white text-xs font-mono text-[#D4D4D4] hover:text-white transition-all"
            title="Open Public Free Code Vault in new tab"
          >
            <span>Live Vault</span>
            <ExternalLink className="w-3 h-3 text-[#888888]" />
          </Link>

          {/* User Badge */}
          {userEmail && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111111] border border-[#222222] text-[11px] font-mono text-[#888888]">
              <User className="w-3 h-3 text-[#666666]" />
              <span className="truncate max-w-[160px] text-[#CCCCCC]">{userEmail}</span>
            </div>
          )}

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#202020] border border-[#282828] text-xs font-mono text-[#CCCCCC] hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Sign out of Admin session"
          >
            <LogOut className="w-3.5 h-3.5 text-[#888888]" />
            <span className="hidden sm:inline">{loggingOut ? "Exiting..." : "Sign Out"}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg bg-[#141414] border border-[#282828] text-[#CCCCCC] hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b border-[#222222] px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                  active
                    ? "bg-white text-[#050505] font-bold"
                    : "text-[#A3A3A3] hover:text-white hover:bg-[#141414]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-[#1C1C1C] flex items-center justify-between text-xs font-mono text-[#888888] px-1">
            <Link
              href="/free-code"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white"
            >
              <span>View Live Vault</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            {userEmail && <span className="truncate max-w-[140px]">{userEmail}</span>}
          </div>
        </div>
      )}
    </header>
  );
}
