"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Free Code", href: "/free-code" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

import { SOCIAL_LINKS } from "@/data/socialLinks";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent background page scrolling while mobile menu is open, and handle Escape key
  React.useEffect(() => {
    if (typeof document === "undefined") return;

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileMenuOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  // Close mobile drawer on browser navigation events
  React.useEffect(() => {
    const handlePopState = () => setMobileMenuOpen(false);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Suppress public navigation on dedicated admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="w-full bg-[#050505] relative z-30 h-[64px] sm:h-[70px] select-none">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:pl-20 2xl:pl-28 lg:pr-16 2xl:pr-24 h-full flex items-center">
          {/* Left: Prominent Official Brand Logo */}
          <Link
            href="/"
            className="shrink-0 group flex items-center relative outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] rounded-sm"
            aria-label="GENZLOG Home"
          >
            <div className="relative h-[34px] sm:h-[40px] aspect-[1024/682] transition-opacity duration-200 group-hover:opacity-90">
              <Image
                src="/genzlog-logo-white.png"
                alt="GENZLOG Official Logo"
                width={300}
                height={200}
                priority
                className="object-contain w-full h-full"
              />
            </div>
          </Link>

          {/* Navigation Links: Positioned immediately after the logo with consistent 32px gap */}
          <nav className="hidden lg:flex items-center ml-8 gap-6 text-[13px] sm:text-sm font-normal tracking-normal" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`py-1.5 px-1 relative transition-colors duration-150 flex flex-col items-center group outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] rounded-sm ${
                    active
                      ? "text-[#FFFFFF] font-medium"
                      : "text-[#A3A3A3] hover:text-[#FFFFFF]"
                  }`}
                >
                  <span>{link.label}</span>
                  {active ? (
                    <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#FFFFFF] rounded-full" />
                  ) : (
                    <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#FFFFFF] transition-all duration-150 group-hover:w-full rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Far Right: Social Media Icons Row pushed with ml-auto */}
          <div className="hidden lg:flex items-center ml-auto gap-4 text-white/80">
            {SOCIAL_LINKS.map((item) => {
              if (item.href) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`GENZLOG on ${item.name}`}
                    className="text-white/80 hover:text-white transition-colors p-1.5 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] rounded-sm"
                  >
                    {item.svg}
                  </a>
                );
              }
              return (
                <button
                  key={item.name}
                  type="button"
                  disabled
                  aria-label={`GENZLOG on ${item.name} (Coming Soon)`}
                  title={`GENZLOG on ${item.name} (Link to be configured)`}
                  className="text-white/80 hover:text-white transition-colors p-1.5 opacity-80 cursor-default outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60 rounded-sm"
                >
                  {item.svg}
                </button>
              );
            })}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-3 lg:hidden ml-auto">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-[#FFFFFF] hover:text-[#A3A3A3] transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-md cursor-pointer"
              aria-label={mobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-50 bg-[#050505] lg:hidden flex flex-col justify-between pt-6 pb-8 px-5 sm:px-6 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#303030] pb-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="relative w-[110px] h-[38px] outline-none focus:outline-none"
                aria-label="GENZLOG Home"
              >
                <Image
                  src="/genzlog-logo-white.png"
                  alt="GENZLOG Official Logo"
                  width={300}
                  height={200}
                  priority
                  className="object-contain object-left w-full h-full"
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-[#FFFFFF] hover:text-[#A3A3A3] transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-md cursor-pointer"
                aria-label="Close Navigation Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-[#A3A3A3] pt-1 font-mono">
              <span className="uppercase tracking-wider font-medium">PAGE DIRECTORY</span>
              <span>GENZLOG STUDIO</span>
            </div>

            <nav className="flex flex-col gap-2 text-base" aria-label="Mobile Navigation Links">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3.5 min-h-[48px] transition-colors rounded-xl outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                      active
                        ? "bg-[#111111] border border-[#FFFFFF] text-[#FFFFFF] font-medium"
                        : "text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#111111]"
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-sm font-bold text-[#FFFFFF]">→</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col gap-4 pt-6 border-t border-[#303030]">
            {/* Social Icons on Mobile Drawer */}
            <div className="flex items-center justify-center gap-6 text-white py-2">
              {SOCIAL_LINKS.map((item) => {
                if (item.href) {
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`GENZLOG on ${item.name}`}
                      className="p-2 text-white hover:text-[#A3A3A3] transition-colors outline-none focus:outline-none"
                    >
                      {item.svg}
                    </a>
                  );
                }
                return (
                  <button
                    key={item.name}
                    type="button"
                    disabled
                    aria-label={`GENZLOG on ${item.name} (Coming Soon)`}
                    title={`GENZLOG on ${item.name} (Link to be configured)`}
                    className="p-2 text-white hover:text-[#A3A3A3] transition-colors opacity-80 cursor-default outline-none focus:outline-none"
                  >
                    {item.svg}
                  </button>
                );
              })}
            </div>
            <p className="text-center text-[11px] text-[#A3A3A3]">
              THE DIGITAL LOG OF GEN Z. • DIGITAL STUDIO
            </p>
          </div>
        </div>
      )}
    </>
  );
}

