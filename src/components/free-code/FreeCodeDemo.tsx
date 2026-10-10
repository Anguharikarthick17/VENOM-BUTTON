"use client";

import React, { useState } from "react";
import { Check, Eye, EyeOff } from "lucide-react";

interface FreeCodeDemoProps {
  type: "login" | "navbar" | "pricing" | "contact" | "buttons" | "hero";
}

export function FreeCodeDemo({ type }: FreeCodeDemoProps) {
  // ── Login Demo State ──
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  // ── Pricing Demo State ──
  const [isAnnual, setIsAnnual] = useState(false);

  // ── Contact Demo State ──
  const [selectedService, setSelectedService] = useState("Business Website");
  const [selectedBudget, setSelectedBudget] = useState("₹10k–₹15k");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // ── Navbar Demo State ──
  const [isNavScrolled, setIsNavScrolled] = useState(true);

  if (type === "login") {
    return (
      <div className="w-full bg-[#111111] border border-[#303030] rounded-xl overflow-hidden shadow-2xl p-6 sm:p-8 text-[#FFFFFF]">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-[#303030] pb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-white text-black font-extrabold text-xs flex items-center justify-center rounded">
                GZ
              </span>
              <span className="font-bold text-sm tracking-wide">AUTH PORTAL</span>
            </div>
            <span className="text-[10px] font-mono bg-[#161616] text-[#A3A3A3] px-2 py-0.5 rounded border border-[#303030]">
              LIVE DEMO
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold">Welcome back</h3>
            <p className="text-xs text-[#A3A3A3] mt-0.5">Enter your credentials to test this component.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setLoginSuccess(true);
              setTimeout(() => setLoginSuccess(false), 3000);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-[#CCCCCC] mb-1">Email address</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full bg-[#161616] border border-[#303030] rounded-lg px-3.5 py-2.5 text-xs text-white outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[#CCCCCC]">Password</label>
                <a href="#demo" onClick={(e) => e.preventDefault()} className="text-[11px] text-[#A3A3A3] hover:text-white hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#161616] border border-[#303030] rounded-lg px-3.5 py-2.5 text-xs text-white outline-none focus:border-white transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#A3A3A3] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#FFFFFF] hover:bg-[#F5F5F5] text-[#050505] font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              <span>Sign In to Dashboard</span>
              <span>→</span>
            </button>

            {loginSuccess && (
              <div className="p-2.5 bg-white/10 border border-white/30 text-white text-xs rounded-lg text-center font-mono">
                ✓ Authentication state verified successfully!
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  if (type === "navbar") {
    return (
      <div className="w-full bg-[#111111] border border-[#303030] rounded-xl overflow-hidden p-6 text-[#FFFFFF] space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#303030] text-xs">
          <span className="font-mono text-[#A3A3A3]">NAVBAR TEST ENVIRONMENT</span>
          <button
            onClick={() => setIsNavScrolled(!isNavScrolled)}
            className="text-[11px] font-mono px-2.5 py-1 bg-[#161616] border border-[#303030] rounded hover:border-white transition-colors"
          >
            Toggle State: {isNavScrolled ? "Scrolled (Glass Effect)" : "Top (Transparent)"}
          </button>
        </div>

        {/* Embedded Mini Navbar */}
        <div
          className={`w-full rounded-xl transition-all duration-300 p-4 flex items-center justify-between ${
            isNavScrolled
              ? "bg-[#050505]/90 backdrop-blur-md border border-[#303030] shadow-lg"
              : "bg-transparent border border-dashed border-[#303030]"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 bg-white text-black font-bold text-xs flex items-center justify-center rounded">
              GZ
            </span>
            <span className="font-bold text-sm tracking-wider">STUDIO</span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-xs text-[#A3A3A3] font-medium">
            <span className="text-white font-semibold cursor-pointer">Services</span>
            <span className="hover:text-white cursor-pointer transition-colors">Free Code</span>
            <span className="hover:text-white cursor-pointer transition-colors">Pricing</span>
            <span className="hover:text-white cursor-pointer transition-colors">About</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-[#FFFFFF] text-[#050505] text-xs font-bold rounded-md hover:bg-[#F5F5F5] transition-colors">
              Let&apos;s Talk ↗
            </button>
          </div>
        </div>

        <div className="p-4 bg-[#161616] rounded-lg border border-[#303030] text-xs text-[#A3A3A3] font-mono">
          Interactive features: `backdrop-filter: blur(16px)`, scroll detection listener, mobile drawer hamburger animation.
        </div>
      </div>
    );
  }

  if (type === "pricing") {
    return (
      <div className="w-full bg-[#111111] border border-[#303030] rounded-xl overflow-hidden p-6 sm:p-8 text-[#FFFFFF] space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3 bg-[#161616] px-3 py-1 rounded-full border border-[#303030] text-xs">
            <span className={!isAnnual ? "text-white font-bold" : "text-[#777777]"}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                isAnnual ? "bg-white" : "bg-[#303030]"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black transition-transform ${
                  isAnnual ? "translate-x-5" : "translate-x-0 bg-white"
                }`}
              />
            </button>
            <span className={isAnnual ? "text-white font-bold" : "text-[#777777]"}>
              Yearly <span className="text-[10px] bg-white/20 text-white px-1 rounded font-mono">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {/* Tier 1 */}
          <div className="bg-[#161616] border border-[#303030] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-[#A3A3A3]">STARTER</span>
              <div className="text-2xl font-black font-display text-white mt-2">
                ₹{isAnnual ? "7,999" : "9,999"}
              </div>
              <p className="text-xs text-[#A3A3A3] mt-1">Single landing page for creators &amp; startups.</p>
              <ul className="mt-4 space-y-2 text-xs text-[#CCCCCC]">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white" /> 1 Landing Page</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white" /> Responsive Layout</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white" /> Contact Form</li>
              </ul>
            </div>
            <button className="mt-6 w-full py-2 bg-[#222222] hover:bg-[#333333] text-white text-xs font-bold rounded-lg border border-[#303030] transition-colors">
              Choose Starter
            </button>
          </div>

          {/* Tier 2 (Featured) */}
          <div className="bg-[#161616] border-2 border-white rounded-xl p-5 flex flex-col justify-between relative shadow-[0_0_25px_rgba(255,255,255,0.08)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black font-mono font-extrabold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
              MOST POPULAR
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-white">BUSINESS</span>
              <div className="text-2xl font-black font-display text-white mt-2">
                ₹{isAnnual ? "11,999" : "14,999"}
              </div>
              <p className="text-xs text-[#A3A3A3] mt-1">Complete multi-page website for companies.</p>
              <ul className="mt-4 space-y-2 text-xs text-[#CCCCCC]">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white" /> Up to 5 Pages</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white" /> Custom Design System</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white" /> SEO &amp; Speed Tuning</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white" /> Revision Allowance</li>
              </ul>
            </div>
            <button className="mt-6 w-full py-2 bg-white hover:bg-[#F5F5F5] text-black text-xs font-bold rounded-lg transition-colors">
              Choose Business
            </button>
          </div>

          {/* Tier 3 */}
          <div className="bg-[#161616] border border-[#303030] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-[#A3A3A3]">CUSTOM APP</span>
              <div className="text-2xl font-black font-display text-white mt-2">
                ₹{isAnnual ? "24,999" : "29,999"}
              </div>
              <p className="text-xs text-[#A3A3A3] mt-1">Complex web applications &amp; tools.</p>
              <ul className="mt-4 space-y-2 text-xs text-[#CCCCCC]">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white" /> Custom Web Software</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white" /> Database &amp; Auth</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white" /> API Integrations</li>
              </ul>
            </div>
            <button className="mt-6 w-full py-2 bg-[#222222] hover:bg-[#333333] text-white text-xs font-bold rounded-lg border border-[#303030] transition-colors">
              Get Quote
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (type === "contact") {
    return (
      <div className="w-full bg-[#111111] border border-[#303030] rounded-xl overflow-hidden p-6 text-[#FFFFFF] space-y-5">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-[#A3A3A3] uppercase tracking-wider">{"// INTERACTIVE INQUIRY FORM"}</span>
          <h3 className="text-lg font-bold">Start your project inquiry</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-mono text-[#A3A3A3] uppercase block mb-1.5">Select Service</label>
            <div className="flex flex-wrap gap-1.5">
              {["Business Website", "Landing Page", "Web App", "UI/UX", "E-commerce"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedService(s)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                    selectedService === s
                      ? "bg-white text-black font-bold border-white"
                      : "bg-[#161616] text-[#A3A3A3] border-[#303030] hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-[#A3A3A3] uppercase block mb-1.5">Budget Range</label>
            <div className="flex flex-wrap gap-1.5">
              {["₹10k–₹15k", "₹15k–₹30k", "₹30k–₹60k", "₹60k+"].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBudget(b)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                    selectedBudget === b
                      ? "bg-white text-black font-bold border-white"
                      : "bg-[#161616] text-[#A3A3A3] border-[#303030] hover:text-white"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <input
              type="text"
              placeholder="Your name"
              className="bg-[#161616] border border-[#303030] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-white"
            />
            <input
              type="email"
              placeholder="Your email address"
              className="bg-[#161616] border border-[#303030] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-white"
            />
          </div>

          <textarea
            rows={2}
            placeholder="Tell us what pages or features you need..."
            className="w-full bg-[#161616] border border-[#303030] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-white resize-none"
          />

          <button
            type="button"
            onClick={() => {
              setContactSubmitted(true);
              setTimeout(() => setContactSubmitted(false), 3000);
            }}
            className="w-full py-2.5 bg-[#FFFFFF] text-[#050505] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#F5F5F5] transition-colors"
          >
            Send Inquiry ({selectedService} • {selectedBudget}) ↗
          </button>

          {contactSubmitted && (
            <div className="p-2.5 bg-white/10 border border-white/30 text-white text-xs rounded-lg text-center font-mono">
              ✓ Inquiry validated! Demo state simulated with service &amp; budget payload.
            </div>
          )}
        </div>
      </div>
    );
  }

  if (type === "buttons") {
    return (
      <div className="w-full bg-[#111111] border border-[#303030] rounded-xl overflow-hidden p-6 text-[#FFFFFF] space-y-6">
        <span className="text-[10px] font-mono text-[#A3A3A3] uppercase tracking-wider">{"// 6 INTERACTIVE BUTTON STYLES"}</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
          {/* 1. Magnetic Glow */}
          <button className="py-2.5 px-4 bg-white text-black font-bold text-xs rounded-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.35)] transition-all transform hover:-translate-y-0.5">
            Magnetic Glow ↗
          </button>

          {/* 2. Cyber Glitch */}
          <button className="py-2.5 px-4 bg-[#161616] border border-[#303030] hover:border-white text-white font-bold text-xs rounded-lg transition-all hover:skew-x-[-6deg]">
            Cyber Glitch
          </button>

          {/* 3. 3D Tactile */}
          <button className="py-2.5 px-4 bg-white text-black font-extrabold text-xs rounded-lg shadow-[0_4px_0_#999999] active:translate-y-1 active:shadow-none transition-all">
            3D Tactile Push
          </button>

          {/* 4. Pulse Radar */}
          <button className="py-2.5 px-4 bg-[#161616] border border-[#303030] text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 hover:border-white transition-colors">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Live Pulse
          </button>

          {/* 5. Minimal Expand */}
          <button className="py-2.5 px-4 bg-transparent text-[#A3A3A3] hover:text-white font-semibold text-xs border-b-2 border-transparent hover:border-white transition-all">
            Minimal Underline →
          </button>

          {/* 6. Monochrome Invert */}
          <button className="py-2.5 px-4 bg-transparent border border-white text-white hover:bg-white hover:text-black font-bold text-xs rounded-lg transition-all">
            Monochrome Invert
          </button>
        </div>
      </div>
    );
  }

  // Hero Demo
  return (
    <div className="w-full bg-[#111111] border border-[#303030] rounded-xl overflow-hidden p-6 sm:p-10 text-[#FFFFFF] space-y-6">
      <div className="flex items-center justify-between border-b border-[#303030] pb-3 text-xs font-mono text-[#A3A3A3]">
        <span className="flex items-center gap-1.5 text-white">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          AVAILABLE FOR CLIENT WEBSITES
        </span>
        <span>IST LOCAL TIME</span>
      </div>

      <div className="space-y-3">
        <span className="text-xs font-mono text-[#A3A3A3] uppercase tracking-[0.2em]">{"// DIGITAL STUDIO"}</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-display uppercase tracking-tight leading-none text-white">
          YOUR IDEAS.<br />
          <span className="text-white underline decoration-1 underline-offset-8">BUILT FOR</span> THE WEB.
        </h2>
        <p className="text-xs text-[#A3A3A3] max-w-lg leading-relaxed">
          We architect high-performance websites and digital tools for businesses that refuse to settle for generic templates.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button className="px-4 py-2 bg-white text-black font-bold text-xs uppercase rounded-lg hover:bg-[#F5F5F5] transition-colors">
          Build My Website ↗
        </button>
        <button className="px-4 py-2 bg-transparent text-white border border-[#303030] font-semibold text-xs rounded-lg hover:bg-[#161616] transition-colors">
          Explore Free Code ↓
        </button>
      </div>
    </div>
  );
}
