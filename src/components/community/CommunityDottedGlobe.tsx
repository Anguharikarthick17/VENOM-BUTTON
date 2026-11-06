"use client";

import React, { useEffect, useRef } from "react";

interface CommunityDottedGlobeProps {
  className?: string;
  size?: number;
}

/**
 * Mathematical 3D Dotted Sphere
 * Renders an animated monochrome rotating dotted globe using HTML5 Canvas.
 */
export function CommunityDottedGlobe({
  className = "",
  size = 220,
}: CommunityDottedGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Detect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // High DPI scaling
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const radius = size * 0.42;
    const centerX = size / 2;
    const centerY = size / 2;

    // Generate spherical points (latitude & longitude)
    const points: Array<{ lat: number; lon: number }> = [];
    const latRings = 14;

    for (let i = 0; i <= latRings; i++) {
      const lat = -Math.PI / 2 + (Math.PI * i) / latRings;
      const cosLat = Math.cos(lat);
      const pointsOnRing = Math.max(3, Math.round(28 * cosLat));

      for (let j = 0; j < pointsOnRing; j++) {
        const lon = (2 * Math.PI * j) / pointsOnRing;
        points.push({ lat, lon });
      }
    }

    let angle = 0;
    const tilt = 0.28; // ~16 deg tilt
    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      // Subtle ambient outer halo glow
      const haloGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.5,
        centerX,
        centerY,
        radius * 1.15
      );
      haloGradient.addColorStop(0, "rgba(255, 255, 255, 0.04)");
      haloGradient.addColorStop(0.7, "rgba(255, 255, 255, 0.015)");
      haloGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = haloGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Subtle outer wireframe ring
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Project and draw points
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const currentLon = p.lon + angle;

        // 3D Cartesian coordinates
        const x0 = radius * Math.cos(p.lat) * Math.sin(currentLon);
        const y0 = radius * Math.sin(p.lat);
        const z0 = radius * Math.cos(p.lat) * Math.cos(currentLon);

        // Apply tilt around X axis
        const x = x0;
        const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
        const z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);

        const screenX = centerX + x;
        const screenY = centerY + y;

        // Depth perspective & opacity
        const depth = (z + radius) / (2 * radius); // 0 (back) to 1 (front)

        if (z >= -radius * 0.3) {
          // Front hemisphere
          const dotRadius = 1.1 + depth * 1.5;
          const alpha = 0.2 + depth * 0.75;

          ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(screenX, screenY, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Back hemisphere (dim points)
          const dotRadius = 0.9;
          ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
          ctx.beginPath();
          ctx.arc(screenX, screenY, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!prefersReducedMotion) {
        angle += 0.0075;
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [size]);

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="block"
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * Pure 2D canvas drawing function for high-res PNG export
 */
export function drawDottedGlobeSnapshot(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  angle: number = 0.4
) {
  // Ambient outer halo glow
  const haloGradient = ctx.createRadialGradient(
    centerX,
    centerY,
    radius * 0.4,
    centerX,
    centerY,
    radius * 1.2
  );
  haloGradient.addColorStop(0, "rgba(255, 255, 255, 0.06)");
  haloGradient.addColorStop(0.7, "rgba(255, 255, 255, 0.02)");
  haloGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = haloGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Outer boundary ring
  ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();

  const latRings = 16;
  const tilt = 0.28;

  for (let i = 0; i <= latRings; i++) {
    const lat = -Math.PI / 2 + (Math.PI * i) / latRings;
    const cosLat = Math.cos(lat);
    const pointsOnRing = Math.max(3, Math.round(32 * cosLat));

    for (let j = 0; j < pointsOnRing; j++) {
      const lon = (2 * Math.PI * j) / pointsOnRing + angle;

      const x0 = radius * Math.cos(lat) * Math.sin(lon);
      const y0 = radius * Math.sin(lat);
      const z0 = radius * Math.cos(lat) * Math.cos(lon);

      const x = x0;
      const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
      const z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);

      const screenX = centerX + x;
      const screenY = centerY + y;
      const depth = (z + radius) / (2 * radius);

      if (z >= -radius * 0.3) {
        const dotRadius = 1.8 + depth * 2.2;
        const alpha = 0.25 + depth * 0.75;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.beginPath();
        ctx.arc(screenX, screenY, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
