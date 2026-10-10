"use client";

import React, { useEffect, useRef } from "react";

/**
 * THE SPACE WARP BACKGROUND
 *
 * Cinematic monochrome forward-travel starfield animation.
 * Features:
 * - 3D perspective projection with central vanishing point
 * - Tiny white & neutral grey stars at multiple depth planes
 * - Outward acceleration from center to edges
 * - Thin light streaks that elongate as apparent speed increases
 * - Occasional high-speed warp streaks
 * - 60fps Canvas 2D engine with requestAnimationFrame
 * - Automatic pause on document visibilitychange
 * - Reduced motion support (prefers-reduced-motion)
 * - DPR scaling (capped at 2x) & responsive star density
 * - Fixed behind all website content (pointer-events: none)
 */

interface Star {
  x: number;
  y: number;
  z: number;
  prevZ: number;
  speed: number;
  isWarp: boolean;
  baseRadius: number;
  shade: string;
  streakMultiplier: number;
}

export function SpaceWarpBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let width = 0;
    let height = 0;
    let cx = 0;
    let cy = 0;
    let dpr = 1;

    const MAX_Z = 1200;
    const FOV = 280;

    // Monochrome color palette shades: crisp white, pale silver, neutral grey
    const STAR_SHADES = [
      "255, 255, 255", // pure white
      "245, 245, 245", // crisp off-white
      "220, 220, 225", // pale cool silver
      "180, 180, 185", // neutral grey
      "140, 140, 145", // deep distant grey
    ];

    let stars: Star[] = [];

    let cachedVignette: CanvasGradient | null = null;
    let frameCount = 0;
    let isIntroActive = false;

    // Determine star count based on viewport width for optimal performance
    const getStarCount = (w: number) => {
      if (w < 480) return 90; // Small mobile phones (< 480px)
      if (w < 768) return 150; // Standard mobile (< 768px)
      if (w < 1200) return 250; // Tablet (< 1200px)
      return 360; // Desktop
    };

    // Initialize or respawn a star
    const initStar = (isInitial = false): Star => {
      const isWarp = Math.random() < 0.10; // ~10% occasional high-speed warp streaks
      const z = isInitial ? Math.random() * MAX_Z + 1 : MAX_Z;
      const shadeIndex = isWarp
        ? 0 // high-speed streaks are pure white
        : Math.floor(Math.random() * STAR_SHADES.length);

      return {
        x: (Math.random() - 0.5) * (width || window.innerWidth) * 2.4,
        y: (Math.random() - 0.5) * (height || window.innerHeight) * 2.4,
        z,
        prevZ: z,
        speed: isWarp ? 12 + Math.random() * 6 : 4.2 + Math.random() * 2.8,
        isWarp,
        baseRadius: isWarp ? 1.0 : 0.6 + Math.random() * 0.7,
        shade: STAR_SHADES[shadeIndex],
        streakMultiplier: isWarp ? 2.2 + Math.random() * 0.8 : 1.0,
      };
    };

    // Resize canvas with DPR scaling and pre-compile vignette gradient
    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      cx = width / 2;
      cy = height / 2;
      // Cap DPR at 1.5x on mobile screens to save GPU fill-rate, 2x on desktop
      dpr = width < 768
        ? Math.min(window.devicePixelRatio || 1, 1.5)
        : Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Cache vignette radial gradient once per resize instead of reallocating 60x/sec
      try {
        const v = ctx.createRadialGradient(
          cx,
          cy,
          Math.min(width, height) * 0.15,
          cx,
          cy,
          Math.max(width, height) * 0.75
        );
        v.addColorStop(0, "rgba(5, 5, 5, 0)");
        v.addColorStop(0.65, "rgba(5, 5, 5, 0.15)");
        v.addColorStop(1, "rgba(5, 5, 5, 0.65)");
        cachedVignette = v;
      } catch {
        cachedVignette = null;
      }

      const targetCount = getStarCount(width);
      if (stars.length === 0) {
        stars = Array.from({ length: targetCount }, () => initStar(true));
      } else if (stars.length < targetCount) {
        const diff = targetCount - stars.length;
        for (let i = 0; i < diff; i++) {
          stars.push(initStar(true));
        }
      } else if (stars.length > targetCount) {
        stars = stars.slice(0, targetCount);
      }
    };

    handleResize();

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = mediaQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      if (isReducedMotion) {
        renderStaticFrame();
      } else {
        lastTime = performance.now();
        loop(performance.now());
      }
    };

    mediaQuery.addEventListener("change", handleMotionChange);

    // Static frame for reduced motion users
    const renderStaticFrame = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const k = FOV / star.z;
        const sx = cx + star.x * k;
        const sy = cy + star.y * k;

        if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
          const alpha = 0.3 + (1 - star.z / MAX_Z) * 0.5;
          ctx.beginPath();
          ctx.arc(sx, sy, star.baseRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${star.shade}, ${alpha})`;
          ctx.fill();
        }
      }
    };

    // Main 3D Space Warp Animation Loop
    const loop = (currentTime: number) => {
      if (isReducedMotion) return;

      const delta = Math.min(currentTime - lastTime, 64);
      lastTime = currentTime;
      const timeScale = delta / 16.67;

      // Check intro state only every ~30 frames to avoid DOM reads on every frame
      frameCount++;
      if (frameCount % 30 === 0) {
        isIntroActive =
          typeof document !== "undefined" &&
          document.documentElement.classList.contains("welcome-active");
      }
      const speedFactor = isIntroActive ? 0.35 : 1.0;

      // 1. Clear with deep space black #050505
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      // 2. Render each star and its perspective streak
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Store previous depth for accurate streak trajectory
        star.prevZ = star.z;

        // Move star forward toward camera (calmed during intro)
        star.z -= star.speed * speedFactor * timeScale;

        // Reset if star passes camera or gets too close
        if (star.z <= 15) {
          stars[i] = initStar();
          continue;
        }

        // Current 2D projected coordinates
        const k = FOV / star.z;
        const currX = cx + star.x * k;
        const currY = cy + star.y * k;

        // Previous 2D projected coordinates
        const prevK = FOV / star.prevZ;
        let prevX = cx + star.x * prevK;
        let prevY = cy + star.y * prevK;

        // Check if out of visible bounds
        if (
          currX < -80 ||
          currX > width + 80 ||
          currY < -80 ||
          currY > height + 80
        ) {
          stars[i] = initStar();
          continue;
        }

        // Elongate streak for high-speed warp stars (disabled during intro for calm atmosphere)
        if (star.isWarp && !isIntroActive) {
          const dx = currX - prevX;
          const dy = currY - prevY;
          prevX = currX - dx * star.streakMultiplier;
          prevY = currY - dy * star.streakMultiplier;
        }

        const streakLen = Math.hypot(currX - prevX, currY - prevY);

        // Alpha calculation: deeper stars are dimmer; approaching stars glow brighter
        const depthRatio = 1 - star.z / MAX_Z; // 0 (far) to 1 (near)
        const fadeIn = Math.min(1, (MAX_Z - star.z) / (MAX_Z * 0.18)); // smooth entry
        const baseAlpha = depthRatio * fadeIn * (star.isWarp ? 0.95 : 0.75);

        // Gentle vignette fade near the outer viewport edges
        const distFromCenter = Math.hypot(currX - cx, currY - cy);
        const maxRadius = Math.hypot(cx, cy);
        const edgeFade = 1 - Math.max(0, (distFromCenter - maxRadius * 0.82) / (maxRadius * 0.22));
        const finalAlpha = Math.max(0, Math.min(1, baseAlpha * edgeFade));

        if (finalAlpha <= 0.01) continue;

        if (streakLen < 1.4) {
          // Distant star: render as a delicate point
          ctx.beginPath();
          ctx.arc(
            currX,
            currY,
            star.baseRadius * (0.7 + depthRatio * 0.6),
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(${star.shade}, ${finalAlpha})`;
          ctx.fill();
        } else {
          // Accelerating / warp star: draw thin tapered velocity streak
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(currX, currY);
          ctx.lineWidth = star.isWarp
            ? 0.8 + depthRatio * 1.3
            : 0.45 + depthRatio * 0.9;
          ctx.lineCap = "round";
          ctx.strokeStyle = `rgba(${star.shade}, ${finalAlpha})`;
          ctx.stroke();

          // Tiny brighter spark at the leading head of the streak
          ctx.beginPath();
          ctx.arc(
            currX,
            currY,
            (star.isWarp ? 1.0 : 0.6) + depthRatio * 0.5,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, finalAlpha * 1.15)})`;
          ctx.fill();
        }
      }

      // 3. Subtle atmospheric radial vignette overlay for contrast and depth (uses cached gradient)
      if (cachedVignette) {
        ctx.fillStyle = cachedVignette;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    // Pause animation when tab is in background to save GPU / CPU
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        lastTime = performance.now();
        if (!isReducedMotion) {
          animationFrameId = requestAnimationFrame(loop);
        }
      }
    };

    // Throttled resize listener via requestAnimationFrame
    let resizeRaf: number | null = null;
    const throttledResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        handleResize();
        resizeRaf = null;
      });
    };

    window.addEventListener("resize", throttledResize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (isReducedMotion) {
      renderStaticFrame();
    } else {
      animationFrameId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", throttledResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ backgroundColor: "#050505" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
