"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { SOCIAL_LINKS } from "@/data/socialLinks";

export function Footer() {
  const pathname = usePathname();

  // Suppress public footer on dedicated admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "SERVICES", href: "/services" },
    { label: "FREE CODE", href: "/free-code" },
    { label: "PRICING", href: "/pricing" },
    { label: "ABOUT", href: "/about" },
    { label: "CONTACT", href: "/contact" },
  ];

  const resourceLinks = [
    { label: "Animated Login Page", href: "/free-code/animated-login-page" },
    { label: "Glassmorphism Navbar", href: "/free-code/modern-navbar" },
    { label: "SaaS Pricing Cards", href: "/free-code/pricing-cards" },
    { label: "Validated Contact Form", href: "/free-code/interactive-contact-form" },
    { label: "Creative Button Pack", href: "/free-code/creative-button-pack" },
    { label: "Editorial Hero Section", href: "/free-code/minimal-portfolio-hero" },
  ];

  return (
    <footer className="relative bg-[#050505] border-t border-[#303030] pt-20 pb-12 overflow-hidden text-white">
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />

      <div className="relative w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24">
        {/* Top Grid: Logo & Tagline + Navigation + Free Code Index */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#303030]">
          {/* Brand Identity Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              {/* Prominent Official Brand Logo Asset: Substantially Increased Size */}
              <div className="flex items-center mb-6">
                <div className="relative w-[160px] sm:w-[190px] aspect-[1024/682]">
                  <Image
                    src="/genzlog-logo-white.png"
                    alt="GENZLOG Official Logo"
                    width={380}
                    height={253}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>

              {/* Tagline */}
              <p className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-white">
                THE DIGITAL LOG OF <span className="text-white">GEN Z.</span>
              </p>

              <p className="text-xs sm:text-sm text-[#A3A3A3] mt-3 max-w-sm leading-relaxed">
                GENZLOG builds websites and digital experiences for businesses, while sharing useful frontend code and resources for everyone to learn from and customize.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#111111] border border-[#303030] rounded-full text-xs font-mono text-[#A3A3A3] w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
                <span>WEBSITES • COMPONENTS • OPEN SOURCE</span>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center gap-2.5 text-white/80" aria-label="Official Social Channels">
                {SOCIAL_LINKS.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`GENZLOG on ${item.name}`}
                    title={`GENZLOG on ${item.name}`}
                    className="p-2 text-[#A3A3A3] hover:text-white bg-[#111111] hover:bg-[#1a1a1a] border border-[#303030] hover:border-[#666666] rounded-lg transition-all outline-none focus-visible:ring-1 focus-visible:ring-white"
                  >
                    {item.svg}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="md:col-span-3 flex flex-col">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FFFFFF] font-bold mb-6">
              {"// NAVIGATION"}
            </span>
            <ul className="space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-[#A3A3A3] hover:text-[#FFFFFF] transition-colors uppercase tracking-wider font-medium text-xs font-mono"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#FFFFFF]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Free Code Index Column */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FFFFFF] font-bold mb-6 block">
                {"// FREE CODE DIRECTORY"}
              </span>
              <ul className="space-y-2.5 text-xs font-mono">
                {resourceLinks.map((res) => (
                  <li key={res.label}>
                    <Link
                      href={res.href}
                      className="group inline-flex items-center gap-2 text-[#A3A3A3] hover:text-white transition-colors"
                    >
                      <span>{res.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#666666] group-hover:text-white transition-colors" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={scrollToTop}
                className="group inline-flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#303030] hover:border-[#666666] text-xs font-mono text-[#A3A3A3] hover:text-white transition-colors rounded-lg cursor-pointer"
              >
                <span>BACK TO TOP</span>
                <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Meta Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#666666] text-center sm:text-left">
          <div>
            &copy; 2026 GENZLOG. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3 gap-y-1 text-[#A3A3A3]">
            <span>WEBSITE DEVELOPMENT</span>
            <span className="text-[#555555]">•</span>
            <span>FREE CODE PLATFORM</span>
            <span className="text-[#555555]">•</span>
            <span className="text-white font-bold">STARTING ₹10,000</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
