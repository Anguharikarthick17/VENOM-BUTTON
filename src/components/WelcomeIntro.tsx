"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

/**
 * 24 Delicate Ambient Dust Particles for Scene 1
 * Deterministically distributed to prevent hydration mismatch.
 */
const INTRO_PARTICLES = [
  { id: 1, top: "22%", left: "18%", size: 2, delay: "0s", duration: "6s" },
  { id: 2, top: "35%", left: "75%", size: 1.5, delay: "0.2s", duration: "7s" },
  { id: 3, top: "68%", left: "28%", size: 2.5, delay: "0.4s", duration: "6.5s" },
  { id: 4, top: "15%", left: "55%", size: 1.5, delay: "0.1s", duration: "8s" },
  { id: 5, top: "80%", left: "62%", size: 2, delay: "0.5s", duration: "7.5s" },
  { id: 6, top: "45%", left: "12%", size: 1, delay: "0.3s", duration: "5.5s" },
  { id: 7, top: "58%", left: "85%", size: 2, delay: "0.6s", duration: "8.5s" },
  { id: 8, top: "28%", left: "42%", size: 1.5, delay: "0.2s", duration: "6.2s" },
  { id: 9, top: "75%", left: "40%", size: 2, delay: "0.7s", duration: "7.8s" },
  { id: 10, top: "12%", left: "82%", size: 1, delay: "0.3s", duration: "6.8s" },
  { id: 11, top: "85%", left: "15%", size: 1.5, delay: "0.5s", duration: "7.2s" },
  { id: 12, top: "50%", left: "68%", size: 2, delay: "0.4s", duration: "6.4s" },
  { id: 13, top: "38%", left: "25%", size: 1, delay: "0.1s", duration: "8.2s" },
  { id: 14, top: "62%", left: "52%", size: 2.5, delay: "0.6s", duration: "7s" },
  { id: 15, top: "20%", left: "32%", size: 1.5, delay: "0.3s", duration: "6.6s" },
  { id: 16, top: "72%", left: "78%", size: 2, delay: "0.4s", duration: "7.4s" },
  { id: 17, top: "48%", left: "88%", size: 1, delay: "0.2s", duration: "5.8s" },
  { id: 18, top: "82%", left: "32%", size: 1.5, delay: "0.7s", duration: "8s" },
  { id: 19, top: "25%", left: "65%", size: 2, delay: "0.5s", duration: "6.7s" },
  { id: 20, top: "60%", left: "18%", size: 1.5, delay: "0.3s", duration: "7.1s" },
  { id: 21, top: "18%", left: "90%", size: 2, delay: "0.4s", duration: "6.9s" },
  { id: 22, top: "78%", left: "92%", size: 1, delay: "0.6s", duration: "8.4s" },
  { id: 23, top: "32%", left: "10%", size: 2, delay: "0.2s", duration: "7.6s" },
  { id: 24, top: "90%", left: "50%", size: 1.5, delay: "0.5s", duration: "6.5s" },
];

/**
 * Explicit, mutually-exclusive animation states:
 * - Scene 1 (Handwriting): writing-line1 -> pen-glide -> writing-line2 -> phrase-hold
 * - Scene 2 (Phrase Exit): phrase-exit (phrase shrinks to 0% and UNMOUNTS)
 * - Scene 3 (Logo Reveal): logo-reveal -> logo-hold (ONLY logo is mounted)
 * - Scene 4 (Zoom Through): logo-zoom -> complete (logo zooms into homepage)
 */
type IntroStage =
  | "writing-line1"
  | "pen-glide"
  | "writing-line2"
  | "phrase-hold"
  | "phrase-exit"
  | "logo-reveal"
  | "logo-hold"
  | "logo-zoom"
  | "complete";

/**
 * In-memory lifecycle flag:
 * Tracks whether the welcome intro has already run or been dismissed during the current document lifecycle.
 * - On full page load or refresh of `/`: reset to false (in memory), so intro plays.
 * - On client-side navigation between pages: persists as true in memory, so intro does NOT replay.
 */
let hasIntroRunForDocument = false;

const subscribeNoop = () => () => {};

function checkIntroEligibility(): boolean {
  if (typeof window === "undefined") return false;
  if (hasIntroRunForDocument) return false;

  // Reduced motion preference
  if (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return false;
  }

  // Must be currently on the homepage
  if (window.location.pathname !== "/" && window.location.pathname !== "") {
    return false;
  }

  // Only eligible if this was a full document load of the homepage
  const isFullHomeLoad = Boolean(
    (window as unknown as { __GENZLOG_FULL_HOME_LOAD__?: boolean })
      .__GENZLOG_FULL_HOME_LOAD__
  );

  return isFullHomeLoad;
}

function getServerEligibility(): boolean {
  return false;
}

export function WelcomeIntro() {
  const pathname = usePathname();
  const isEligible = useSyncExternalStore(
    subscribeNoop,
    checkIntroEligibility,
    getServerEligibility
  );

  const [stage, setStage] = useState<IntroStage>("writing-line1");
  const [showTagline, setShowTagline] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  // Track timeouts for clean teardown
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const finishIntro = useCallback(() => {
    clearAllTimers();
    hasIntroRunForDocument = true;
    if (typeof window !== "undefined") {
      (
        window as unknown as { __GENZLOG_FULL_HOME_LOAD__?: boolean }
      ).__GENZLOG_FULL_HOME_LOAD__ = false;
    }
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("welcome-active");
      document.documentElement.classList.remove("welcome-revealing");
      document.body.style.overflow = "";
    }
    setDismissed(true);
    setStage("complete");
  }, [clearAllTimers]);

  const handleSkip = useCallback(() => {
    finishIntro();
  }, [finishIntro]);

  // If user navigates away to another route, mark completed so it never replays on internal navigation
  useEffect(() => {
    if (pathname !== "/" && !hasIntroRunForDocument) {
      hasIntroRunForDocument = true;
      if (typeof window !== "undefined") {
        (
          window as unknown as { __GENZLOG_FULL_HOME_LOAD__?: boolean }
        ).__GENZLOG_FULL_HOME_LOAD__ = false;
      }
    }
  }, [pathname]);

  // Clean up lock if user is not eligible
  useEffect(() => {
    if (!isEligible) {
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("welcome-active");
        document.documentElement.classList.remove("welcome-revealing");
        document.body.style.overflow = "";
      }
    }
  }, [isEligible]);

  // Choreograph the 4 Distinct Non-Overlapping Scenes:
  // Scene 1 — Write the phrase (0ms – 2650ms) + Hold (2650ms – 3250ms)
  // Scene 2 — Clear phrase BEFORE showing logo (3250ms – 3850ms)
  // Scene 3 — Reveal GENZLOG logo alone (3850ms – 4750ms) + Hold (4750ms – 5250ms)
  // Scene 4 — Zoom into homepage (5250ms – 6650ms)
  useEffect(() => {
    if (!isEligible || dismissed) {
      return;
    }

    if (typeof document !== "undefined") {
      document.documentElement.classList.add("welcome-active");
      document.body.style.overflow = "hidden";
    }

    // Support Escape key to skip intro
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        finishIntro();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const timers: NodeJS.Timeout[] = [
      // 1. Line 1 finishes drawing at 1350ms, pen glides to line 2
      setTimeout(() => setStage("pen-glide"), 1350),

      // 2. Line 2 starts drawing at 1500ms
      setTimeout(() => setStage("writing-line2"), 1500),

      // 3. Line 2 completes at 2650ms (total 2.65s handwriting).
      //    Complete phrase holds cleanly for 600ms; pen tip blinks out.
      setTimeout(() => setStage("phrase-hold"), 2650),

      // 4. SCENE 2: Phrase contracts inward in 3D and fades to 0% (3250ms – 3850ms)
      setTimeout(() => setStage("phrase-exit"), 3250),

      // 5. SCENE 3: Phrase is now COMPLETELY GONE and unmounted.
      //    Only now at 3850ms does the official logo emerge from center with controlled 3D rotation.
      setTimeout(() => setStage("logo-reveal"), 3850),

      // 6. Tagline reveals beneath settled logo at 4250ms
      setTimeout(() => setShowTagline(true), 4250),

      // 7. Logo settles front-facing at 4750ms; holds steady for 500ms
      setTimeout(() => setStage("logo-hold"), 4750),

      // 8. SCENE 4: Zoom through logo into homepage begins at 5250ms
      setTimeout(() => {
        setShowTagline(false);
        setStage("logo-zoom");
        if (typeof document !== "undefined") {
          document.documentElement.classList.add("welcome-revealing");
        }
      }, 5250),

      // 9. Finish cleanly at 6650ms
      setTimeout(() => {
        finishIntro();
      }, 6650),
    ];

    timersRef.current = timers;

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearAllTimers();
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
        document.documentElement.classList.remove("welcome-active");
        document.documentElement.classList.remove("welcome-revealing");
      }
    };
  }, [isEligible, dismissed, clearAllTimers, finishIntro]);

  // Don't render if not eligible, dismissed, or navigated away from root
  if (!isEligible || dismissed || stage === "complete" || pathname !== "/") {
    return null;
  }

  // MUTUALLY EXCLUSIVE SCENE PHASES:
  // isPhraseActive is true ONLY in Scene 1 & 2 (0ms – 3850ms)
  const isPhraseActive =
    stage === "writing-line1" ||
    stage === "pen-glide" ||
    stage === "writing-line2" ||
    stage === "phrase-hold" ||
    stage === "phrase-exit";

  // isLogoActive is true ONLY in Scene 3 & 4 (3850ms – 6650ms)
  const isLogoActive =
    stage === "logo-reveal" ||
    stage === "logo-hold" ||
    stage === "logo-zoom";

  // Pen tip is visible ONLY during writing and hold; hidden during exit
  const showPen =
    stage === "writing-line1" ||
    stage === "pen-glide" ||
    stage === "writing-line2" ||
    stage === "phrase-hold";

  const isZooming = stage === "logo-zoom";

  return (
    <div
      id="welcome-intro-curtain"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to GENZLOG"
      className={`fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden select-none transition-opacity duration-1100 ease-in-out ${
        isZooming
          ? "opacity-0 pointer-events-none"
          : "opacity-100 pointer-events-auto"
      }`}
    >
      {/* SKIP INTRO BUTTON — Top Right Accessible Control */}
      <div className="fixed top-4 right-4 sm:top-8 sm:right-10 z-[10001]">
        <button
          type="button"
          onClick={handleSkip}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 bg-[#121212]/80 hover:bg-white text-[#A3A3A3] hover:text-[#050505] border border-white/10 hover:border-white rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all backdrop-blur-md cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] shadow-lg group min-h-[44px]"
        >
          <span>SKIP INTRO</span>
          <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        </button>
      </div>

      {/* AMBIENT RADIAL GLOW — Soft Silver Atmospheric Depth */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
          isZooming ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full bg-radial from-white/[0.08] via-white/[0.02] to-transparent blur-3xl opacity-70 scale-100" />
      </div>

      {/* SUBTLE AMBIENT PARTICLES — Restrained Floating Motifs */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
          isZooming ? "opacity-0" : "opacity-100"
        }`}
      >
        {INTRO_PARTICLES.map((p) => (
          <span
            key={p.id}
            style={{
              top: p.top,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
            className="absolute rounded-full bg-white opacity-40 blur-[0.5px] animate-float-gentle"
          />
        ))}
      </div>

      {/* CENTRAL STAGE CONTAINER */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-4xl min-h-[340px] sm:min-h-[360px] w-full">
        
        {/* =========================================================================
            SCENE 1 & 2: HANDWRITTEN "YOUR VISION. OUR CODE."
            Rendered ONLY while isPhraseActive is true.
            Completely unmounted before Scene 3 logo ever mounts.
           ========================================================================= */}
        {isPhraseActive && (
          <div
            className={`flex flex-col items-center justify-center origin-center w-full ${
              stage === "phrase-exit"
                ? "animate-phrase-exit pointer-events-none"
                : ""
            }`}
          >
            <svg
              viewBox="0 0 800 320"
              className="w-[260px] min-[360px]:w-[320px] sm:w-[500px] md:w-[680px] lg:w-[780px] max-w-full aspect-[800/320] overflow-visible select-none"
              aria-label="YOUR VISION. OUR CODE."
            >
              <defs>
                <style>{`
                  .genzlog-typography {
                    font-family: var(--font-space-grotesk), var(--font-geist-sans), 'Orbitron', 'Space Grotesk', -apple-system, sans-serif;
                    font-size: 50px;
                    fill: #FFFFFF;
                    text-anchor: middle;
                    letter-spacing: 0.20em;
                    font-weight: 800;
                    text-transform: uppercase;
                  }
                `}</style>

                {/* 45-degree diagonal stencil cuts matching official GENZLOG logo typography */}
                <pattern id="genzlog-stencil-cuts" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
                  <rect width="26" height="26" fill="white" />
                  <line x1="0" y1="0" x2="0" y2="26" stroke="black" strokeWidth="4.2" />
                </pattern>

                <mask id="genzlog-stencil-mask">
                  <rect width="100%" height="100%" fill="url(#genzlog-stencil-cuts)" />
                </mask>
              </defs>

              {/* LINE 1: YOUR VISION. */}
              <g
                className={
                  stage === "writing-line1"
                    ? "animate-line1-write"
                    : stage === "pen-glide" ||
                      stage === "writing-line2" ||
                      stage === "phrase-hold" ||
                      stage === "phrase-exit"
                    ? ""
                    : "opacity-0"
                }
              >
                <g mask="url(#genzlog-stencil-mask)">
                  <text
                    x="400"
                    y="115"
                    className="genzlog-typography"
                  >
                    YOUR VISION.
                  </text>
                </g>
              </g>

              {/* LINE 2: OUR CODE. */}
              <g
                className={
                  stage === "writing-line2"
                    ? "animate-line2-write"
                    : stage === "phrase-hold" || stage === "phrase-exit"
                    ? ""
                    : "opacity-0"
                }
              >
                <g mask="url(#genzlog-stencil-mask)">
                  <text
                    x="400"
                    y="215"
                    className="genzlog-typography"
                  >
                    OUR CODE.
                  </text>
                </g>
              </g>

              {/* SYNCHRONIZED PEN-TIP INDICATOR */}
              {showPen && (
                <g
                  className={
                    stage === "writing-line1"
                      ? "animate-pen-line1"
                      : stage === "pen-glide"
                      ? "animate-pen-glide"
                      : stage === "writing-line2"
                      ? "animate-pen-line2"
                      : stage === "phrase-hold"
                      ? "animate-pen-finish"
                      : "opacity-0"
                  }
                >
                  <circle
                    cx="0"
                    cy="0"
                    r="3.5"
                    fill="#FFFFFF"
                    className="filter drop-shadow-[0_0_10px_#ffffff]"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="8"
                    fill="none"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1.2"
                  />
                </g>
              )}
            </svg>
          </div>
        )}

        {/* =========================================================================
            SCENE 3 & 4: OFFICIAL GENZLOG LOGO REVEAL & ZOOM-THROUGH
            Mounted ONLY after the phrase has completely faded and unmounted.
            Guaranteed zero overlap with the handwritten phrase.
           ========================================================================= */}
        {isLogoActive && (
          <div
            className="flex flex-col items-center justify-center"
            style={{ perspective: "1200px" }}
          >
            {/* OFFICIAL UNMODIFIED LOGO ASSET */}
            <div
              className={`relative w-[240px] min-[360px]:w-[280px] sm:w-[380px] md:w-[480px] max-w-full aspect-[1024/682] origin-center ${
                stage === "logo-reveal"
                  ? "animate-logo-reveal"
                  : stage === "logo-hold"
                  ? "opacity-100 scale-100 filter drop-shadow-[0_0_35px_rgba(255,255,255,0.22)]"
                  : stage === "logo-zoom"
                  ? "animate-logo-zoom pointer-events-none"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <Image
                src="/genzlog-logo-white.png"
                alt="GENZLOG Official Logo"
                width={1024}
                height={682}
                priority
                className="object-contain w-full h-full mix-blend-screen"
              />
            </div>

            {/* Supporting Tagline: "IDEAS INTO REALITY." */}
            <div
              className={`transition-all duration-300 ease-out ${
                showTagline && (stage === "logo-reveal" || stage === "logo-hold")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }`}
            >
              <p className="mt-4 sm:mt-6 font-mono text-xs sm:text-sm text-[#CCCCCC] tracking-[0.35em] uppercase font-semibold">
                IDEAS INTO REALITY.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Technical Marker */}
      <div
        className={`fixed bottom-6 inset-x-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
          isZooming ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="text-[10px] font-mono text-[#555555] uppercase tracking-widest">
          GENZLOG // AWAKENING
        </span>
      </div>
    </div>
  );
}
