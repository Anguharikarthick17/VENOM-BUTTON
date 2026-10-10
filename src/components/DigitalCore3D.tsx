"use client";

import React, { useEffect, useRef } from "react";

/**
 * DigitalCore3D — Lightweight, bespoke canvas-based 3D digital wireframe core
 * Renders an animated rotating geometric sphere with latitude/longitude lines,
 * orbital rings, and mouse-reactive 3D perspective without any heavy external libraries.
 */
export function DigitalCore3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    window.addEventListener("resize", handleResize);

    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0.2;
    let rotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = x * 0.45;
      targetRotX = -y * 0.45;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Generate Sphere Nodes (Latitude & Longitude grid)
    interface Point3D {
      x: number;
      y: number;
      z: number;
    }

    const radius = Math.min(width, height) * 0.28;
    const rings = 8;
    const segmentsPerRing = 16;
    const spherePoints: Point3D[] = [];

    for (let r = 1; r < rings; r++) {
      const phi = (Math.PI / rings) * r;
      const y = radius * Math.cos(phi);
      const ringRadius = radius * Math.sin(phi);

      for (let s = 0; s < segmentsPerRing; s++) {
        const theta = ((2 * Math.PI) / segmentsPerRing) * s;
        const x = ringRadius * Math.cos(theta);
        const z = ringRadius * Math.sin(theta);
        spherePoints.push({ x, y, z });
      }
    }

    // Outer orbital rings
    const orbitCount = 24;
    const orbitPoints: Point3D[] = [];
    const orbitRadius = radius * 1.28;
    for (let i = 0; i < orbitCount; i++) {
      const angle = (2 * Math.PI * i) / orbitCount;
      orbitPoints.push({
        x: orbitRadius * Math.cos(angle),
        y: 0,
        z: orbitRadius * Math.sin(angle),
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth interpolation
      rotX += (targetRotX + 0.2 - rotX) * 0.05;
      if (!prefersReducedMotion) {
        rotY += 0.0035;
      }
      rotY += (targetRotY - rotY) * 0.05;

      time += 0.02;

      const cx = width / 2;
      const cy = height / 2;
      const fov = width * 0.95;

      const project = (p: Point3D) => {
        // Rotate Y
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotate X
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y1 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective
        const scale = fov / (fov + z2 + radius * 2);
        return {
          x: cx + x1 * scale,
          y: cy + y1 * scale,
          z: z2,
          scale,
        };
      };

      // 1. Draw outer glowing tech bounding frame
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - radius * 1.45, cy - radius * 1.45, radius * 2.9, radius * 2.9);

      // 2. Draw outer orbital ring
      ctx.beginPath();
      let firstOrbit = true;
      for (const p of orbitPoints) {
        // add tilt to orbit
        const tiltedP = {
          x: p.x,
          y: p.z * 0.35 * Math.sin(time * 0.5),
          z: p.z,
        };
        const proj = project(tiltedP);
        if (firstOrbit) {
          ctx.moveTo(proj.x, proj.y);
          firstOrbit = false;
        } else {
          ctx.lineTo(proj.x, proj.y);
        }
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Draw Sphere Latitude Rings
      for (let r = 1; r < rings; r++) {
        ctx.beginPath();
        const startIdx = (r - 1) * segmentsPerRing;
        for (let s = 0; s < segmentsPerRing; s++) {
          const pt = spherePoints[startIdx + s];
          const proj = project(pt);
          if (s === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 4. Draw Sphere Longitude Lines
      for (let s = 0; s < segmentsPerRing; s += 2) {
        ctx.beginPath();
        for (let r = 1; r < rings; r++) {
          const pt = spherePoints[(r - 1) * segmentsPerRing + s];
          const proj = project(pt);
          if (r === 1) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.stroke();
      }

      // 5. Draw Digital Nodes / Dots with depth
      for (let i = 0; i < spherePoints.length; i += 2) {
        const pt = spherePoints[i];
        const proj = project(pt);

        // Alpha based on depth z
        const alpha = Math.max(0.1, (proj.z + radius) / (radius * 2));
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, Math.max(1, 1.8 * proj.scale), 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Center glowing focal core
      const coreProj = project({ x: 0, y: 0, z: 0 });
      const gradient = ctx.createRadialGradient(
        coreProj.x,
        coreProj.y,
        0,
        coreProj.x,
        coreProj.y,
        radius * 0.4
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.15)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(coreProj.x, coreProj.y, radius * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Technical HUD corner coordinates
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.font = `${Math.max(9, Math.round(width * 0.02))}px monospace`;
      ctx.fillText("GENZLOG CORE // 3D MATRIX", cx - radius * 1.35, cy - radius * 1.25);
      ctx.fillText(`SYS.ROT: [${rotY.toFixed(2)}]`, cx - radius * 1.35, cy + radius * 1.35);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[480px] lg:max-w-[540px] mx-auto flex items-center justify-center select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain pointer-events-none"
      />
      {/* Subtle outer crosshair guides */}
      <div className="absolute top-2 left-2 text-[10px] font-mono text-[#555555]">
        +0.00
      </div>
      <div className="absolute bottom-2 right-2 text-[10px] font-mono text-[#555555]">
        LOC: ONLINE
      </div>
    </div>
  );
}
