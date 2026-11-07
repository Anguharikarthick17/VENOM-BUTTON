"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface VenomButtonProps {
  children?: React.ReactNode;
  label?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  target?: string;
  rel?: string;
  id?: string;
  ariaLabel?: string;
  fullWidth?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Physics constants for symbiote tendrils
// ─────────────────────────────────────────────────────────────
const MAX_STRANDS = 6;
const NP = 12; // points per tendril
const MAX_RIPPLES = 4;

interface VerletPoint {
  x: number;
  y: number;
  px: number;
  py: number;
  r: number;
}

interface Strand {
  id: number;
  active: boolean;
  state: "idle" | "emerging" | "attached" | "snapping" | "recoiling";
  anchorAngle: number;
  anchorX: number;
  anchorY: number;
  points: VerletPoint[];
  phase: number;
  wiggleFreq: number;
  wiggleAmp: number;
  restLen: number;
  stretch: number;
  snapAge: number;
  life: number;
  targetOffsetX: number;
  targetOffsetY: number;
}

interface Ripple {
  x: number;
  y: number;
  age: number;
  amp: number;
}

// ─────────────────────────────────────────────────────────────
// WebGL2 Shaders (Top-down SDF Raymarch + Liquid Specular Model)
// ─────────────────────────────────────────────────────────────
const VERT_SHADER = `#version 300 es
// Fullscreen triangle covering viewport
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;

const FRAG_SHADER = `#version 300 es
precision highp float;

#define MAX_STRANDS 6
#define NP 12
#define MAX_RIPPLES 4

uniform vec2 uResolution;
uniform float uDpr;
uniform float uTime;

// Button pill: center.xy, halfWidth, halfHeight
uniform vec4 uBtn;
// Button elevation & style: top, bevel, dome, lift
uniform vec4 uBtnZ;

// Tendrils:
// Points array: [strandIndex * NP + pointIndex] -> x, y, z, radius
uniform vec4 uPts[MAX_STRANDS * NP];
// Strand info: active, numPoints, stretch, snapAge
uniform vec4 uStrandInfo[MAX_STRANDS];
uniform int uNumStrands;

// Click shockwave: progress (0..1), maxRadius, clickX, clickY
uniform vec4 uClick;

// Surface ripples: x, y, age, amp
uniform vec4 uRipples[MAX_RIPPLES];

out vec4 fragColor;

// Polynomial smooth minimum for organic liquid blending (metaball effect)
float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

// 2D Capsule Signed Distance Function with tapering radius
float sdCapsule(vec2 p, vec2 a, vec2 b, float ra, float rb) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
  return length(pa - ba * h) - mix(ra, rb, h);
}

// 2D Rounded Box (Pill) Signed Distance Function
float sdPill(vec2 p, vec2 b, float r) {
  vec2 d = abs(p) - (b - vec2(r));
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}

// Evaluates the continuous liquid SDF across the scene
float map2D(vec2 p) {
  // 1. Core Button Pill
  vec2 q = p - uBtn.xy;
  float dBtn = sdPill(q, uBtn.zw, uBtn.w);

  // Subtle liquid breathing undulation on the pill surface
  float breathe = sin(uTime * 1.8 + p.x * 0.02) * 0.5 + cos(uTime * 1.4 + p.y * 0.03) * 0.4;
  dBtn += breathe * 0.35;

  // 2. Tendrils (Verlet Strands)
  float dStrands = 1e5;
  for (int s = 0; s < MAX_STRANDS; s++) {
    if (s >= uNumStrands) break;
    vec4 info = uStrandInfo[s];
    if (info.x <= 0.0) continue; // strand is inactive

    int nPts = int(info.y);
    float strandD = 1e5;
    for (int j = 0; j < NP - 1; j++) {
      if (j >= nPts - 1) break;
      vec4 pA = uPts[s * NP + j];
      vec4 pB = uPts[s * NP + j + 1];
      strandD = min(strandD, sdCapsule(p, pA.xy, pB.xy, pA.w, pB.w));
    }
    // Blend strands with each other smoothly
    dStrands = smin(dStrands, strandD, 10.0);
  }

  // Smooth liquid merging between button body and symbiote tendrils
  float dLiquid = smin(dBtn, dStrands, 16.0);

  // 3. Surface Ripples (snapping or clicking impulses)
  for (int r = 0; r < MAX_RIPPLES; r++) {
    vec4 rip = uRipples[r];
    if (rip.w <= 0.005) continue;
    float dist = length(p - rip.xy);
    float waveSpeed = 240.0;
    float waveRadius = rip.z * waveSpeed;
    float dR = dist - waveRadius;
    float ripple = sin(dist * 0.12 - rip.z * 16.0) * exp(-dR * dR / 320.0) * exp(-rip.z * 3.5);
    dLiquid -= ripple * rip.w * 3.2;
  }

  // 4. Click Screen-Swallowing Expansion (State E)
  if (uClick.x > 0.0) {
    float progress = uClick.x;
    float maxR = uClick.y;
    // Dramatic expansion curve: explosive start, swelling tendril perimeter, smooth finish
    float currentR = maxR * (progress < 0.65 
      ? pow(progress / 0.65, 1.8) 
      : 1.0 - pow((progress - 0.65) / 0.35, 2.0) * 0.15);

    vec2 cDir = p - uClick.zw;
    float angle = atan(cDir.y, cDir.x);
    // Symbiote organic spikes and tentacles on the expanding liquid edge
    float spikes = sin(angle * 6.0 + uTime * 3.0) * 0.18
                 + cos(angle * 12.0 - uTime * 4.5) * 0.12
                 + sin(angle * 22.0 + uTime * 6.0) * 0.06;
    float dExplosion = length(cDir) - currentR * (1.0 + spikes);
    dLiquid = smin(dLiquid, dExplosion, 28.0);
  }

  return dLiquid;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y) / uDpr;

  // Performance optimization: early exit when outside interactive zone during idle/hover
  if (uClick.x <= 0.0) {
    vec2 bMin = uBtn.xy - uBtn.zw - vec2(170.0);
    vec2 bMax = uBtn.xy + uBtn.zw + vec2(170.0);
    if (p.x < bMin.x || p.x > bMax.x || p.y < bMin.y || p.y > bMax.y) {
      discard;
    }
  }

  float d = map2D(p);

  // Beyond boundary with antialiasing feather
  if (d > 2.0) {
    discard;
  }

  // Calculate surface gradient for 3D normals
  float eps = 1.0;
  float dR = map2D(p + vec2(eps, 0.0));
  float dL = map2D(p - vec2(eps, 0.0));
  float dU = map2D(p + vec2(0.0, eps));
  float dD = map2D(p - vec2(0.0, eps));
  vec2 grad = normalize(vec2(dR - dL, dU - dD) + 1e-5);

  // 3D dome curvature from SDF depth
  float depth = clamp(-d / 14.0, 0.0, 1.0);
  float domeZ = sqrt(max(0.01, 1.0 - (1.0 - depth) * (1.0 - depth)));
  vec3 N = normalize(vec3(grad * (1.0 - depth * 0.65), domeZ * 1.35));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 R = reflect(-V, N);

  // Monochrome GENZLOG Studio Lighting (#050505 - #FFFFFF)
  vec3 L = normalize(vec3(-0.42, -0.62, 0.82));
  vec3 H = normalize(L + V);

  // Fresnel reflectance (pure glossy black liquid)
  float NdV = clamp(dot(N, V), 0.0, 1.0);
  float fresnel = 0.05 + 0.95 * pow(1.0 - NdV, 4.0);

  // Specular key highlights
  float specSharp = pow(max(dot(N, H), 0.0), 96.0) * 1.6;
  float specBroad = pow(max(dot(N, H), 0.0), 24.0) * 0.45;

  // Polished silver rim reflection along pill & tendril contours
  float rim = pow(1.0 - NdV, 3.0);
  vec3 silverRim = vec3(0.92, 0.94, 0.98) * rim * 0.85;

  // Traveling glint along perimeter
  vec2 q = p - uBtn.xy;
  float angle = atan(q.y, q.x);
  float glint = pow(0.5 + 0.5 * cos(angle - uTime * 1.1), 22.0) * 0.5;

  // Deep obsidian liquid body
  vec3 baseColor = vec3(0.025, 0.025, 0.03);
  float diff = max(dot(N, L), 0.0) * 0.05;
  vec3 specColor = vec3(1.0, 1.0, 1.0) * (specSharp + specBroad);

  vec3 finalColor = baseColor + diff + (specColor + silverRim + glint * vec3(0.96)) * fresnel;

  // Sub-pixel antialiasing edge feather
  float alpha = smoothstep(1.5, -1.5, d);

  fragColor = vec4(finalColor, alpha);
}
`;

export function VenomButton({
  children,
  label = "BUILD MY WEBSITE",
  href,
  onClick,
  className = "",
  size = "lg",
  disabled = false,
  type = "button",
  target,
  rel,
  id,
  ariaLabel,
  fullWidth = false,
}: VenomButtonProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animation & WebGL state refs
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation>>({});
  const rafIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const isReducedMotionRef = useRef<boolean>(false);

  // Cursor tracking refs (mutated directly to prevent React re-renders)
  const cursorRef = useRef<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    present: boolean;
    down: boolean;
  }>({
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    present: false,
    down: false,
  });

  // Strands & ripples refs
  const strandsRef = useRef<Strand[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const clickAnimRef = useRef<{
    active: boolean;
    startTime: number;
    duration: number;
    maxRadius: number;
    clickX: number;
    clickY: number;
    navTriggered: boolean;
  }>({
    active: false,
    startTime: 0,
    duration: 650,
    maxRadius: 1200,
    clickX: 0,
    clickY: 0,
    navTriggered: false,
  });

  // Fallback state
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  // Initialize strands
  useEffect(() => {
    const strands: Strand[] = [];
    for (let s = 0; s < MAX_STRANDS; s++) {
      const points: VerletPoint[] = [];
      for (let j = 0; j < NP; j++) {
        points.push({ x: 0, y: 0, px: 0, py: 0, r: 2.2 });
      }
      strands.push({
        id: s,
        active: false,
        state: "idle",
        anchorAngle: 0,
        anchorX: 0,
        anchorY: 0,
        points,
        phase: Math.random() * Math.PI * 2,
        wiggleFreq: 3.5 + Math.random() * 2.0,
        wiggleAmp: 8 + Math.random() * 6,
        restLen: 12,
        stretch: 1.0,
        snapAge: 0,
        life: 0,
        targetOffsetX: 0,
        targetOffsetY: 0,
      });
    }
    strandsRef.current = strands;
  }, []);

  // Helper to trigger a surface ripple
  const addRipple = useCallback((x: number, y: number, amp = 1.0) => {
    const ripples = ripplesRef.current;
    if (ripples.length >= MAX_RIPPLES) ripples.shift();
    ripples.push({ x, y, age: 0, amp });
  }, []);

  // ─────────────────────────────────────────────────────────────
  // WebGL Initialization & Management
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    isReducedMotionRef.current = mediaQuery.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotionRef.current = e.matches;
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get WebGL2 context
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      console.warn("WebGL2 not supported, falling back to CSS styling.");
      setWebglSupported(false);
      return;
    }
    glRef.current = gl;

    // Compile shader
    function compileShader(type: number, source: string): WebGLShader | null {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source.trim());
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vert = compileShader(gl.VERTEX_SHADER, VERT_SHADER);
    const frag = compileShader(gl.FRAGMENT_SHADER, FRAG_SHADER);
    if (!vert || !frag) {
      setWebglSupported(false);
      return;
    }

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      setWebglSupported(false);
      return;
    }
    programRef.current = prog;

    // Uniform locations lookup
    const uniforms: Record<string, WebGLUniformLocation> = {};
    const uniformNames = [
      "uResolution",
      "uDpr",
      "uTime",
      "uBtn",
      "uBtnZ",
      "uNumStrands",
      "uPts",
      "uStrandInfo",
      "uClick",
      "uRipples",
    ];
    for (const name of uniformNames) {
      const loc = gl.getUniformLocation(prog, name);
      if (loc) uniforms[name] = loc;
    }
    uniformsRef.current = uniforms;

    // Canvas size & resize handling
    const resizeCanvas = () => {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(window.innerWidth * dpr);
      const h = Math.round(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Context loss handling
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
    const handleContextRestored = () => {
      resizeCanvas();
    };
    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

    // IntersectionObserver to pause rendering when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    if (buttonRef.current) {
      observer.observe(buttonRef.current);
    }

    // ─────────────────────────────────────────────────────────
    // Animation & Physics Loop
    // ─────────────────────────────────────────────────────────
    const startTime = performance.now();
    let lastTime = startTime;
    const ptsBuffer = new Float32Array(MAX_STRANDS * NP * 4);
    const strandInfoBuffer = new Float32Array(MAX_STRANDS * 4);
    const ripplesBuffer = new Float32Array(MAX_RIPPLES * 4);

    const renderLoop = (now: number) => {
      rafIdRef.current = requestAnimationFrame(renderLoop);

      if (!isVisibleRef.current && !clickAnimRef.current.active) {
        return; // Pause when outside viewport
      }

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const elapsedTime = (now - startTime) / 1000;

      const btnEl = buttonRef.current;
      if (!btnEl || !canvas || !gl) return;

      const rect = btnEl.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const btnHalfW = rect.width / 2;
      const btnHalfH = rect.height / 2;

      // Cursor position smoothing
      const cur = cursorRef.current;
      cur.x += (cur.targetX - cur.x) * 0.35;
      cur.y += (cur.targetY - cur.y) * 0.35;

      const dxCursor = cur.x - btnCenterX;
      const dyCursor = cur.y - btnCenterY;

      // Distance from button perimeter
      const qx = Math.max(Math.abs(dxCursor) - (btnHalfW - btnHalfH), 0);
      const qy = Math.abs(dyCursor);
      const distToEdge = Math.hypot(qx, qy) - btnHalfH;

      const reachDistance = 145; // Detection radius in px
      const isNear = cur.present && distToEdge < reachDistance && !isReducedMotionRef.current;

      // ─────────────────────────────────────────────────────────
      // Tendril Physics Updates
      // ─────────────────────────────────────────────────────────
      const strands = strandsRef.current;
      const angleToCursor = Math.atan2(dyCursor, dxCursor);

      strands.forEach((s, idx) => {
        // Angle offsets around cursor direction for varied strand emergence
        const angleOffsets = [0, 0.35, -0.35, 0.72, -0.72, 1.05];
        const targetAngle = angleToCursor + angleOffsets[idx % angleOffsets.length];

        // Anchor position along the pill perimeter
        const aX = clamp(Math.cos(targetAngle) * btnHalfW, -(btnHalfW - btnHalfH), btnHalfW - btnHalfH);
        const aRadX = Math.cos(targetAngle) * btnHalfH;
        const aRadY = Math.sin(targetAngle) * btnHalfH;
        s.anchorX = btnCenterX + aX + aRadX;
        s.anchorY = btnCenterY + aRadY;

        if (isNear && (!s.active || s.state === "idle")) {
          // State B: Cursor detection - Strand emerges
          s.active = true;
          s.state = "emerging";
          s.life = 0;
          s.targetOffsetX = (Math.random() - 0.5) * 18;
          s.targetOffsetY = (Math.random() - 0.5) * 18;
          s.points.forEach((p) => {
            p.x = s.anchorX;
            p.y = s.anchorY;
            p.px = s.anchorX;
            p.py = s.anchorY;
            p.r = 2.4;
          });
        }

        if (s.active) {
          s.life += dt;
          const tipTargetX = cur.x + s.targetOffsetX + Math.sin(elapsedTime * 2.5 + s.phase) * 6;
          const tipTargetY = cur.y + s.targetOffsetY + Math.cos(elapsedTime * 2.8 + s.phase) * 6;

          const totalDist = Math.hypot(tipTargetX - s.anchorX, tipTargetY - s.anchorY);
          const maxAllowedLen = 220;
          const snapStretchThreshold = 1.75;

          s.stretch = totalDist / Math.max(s.restLen * (NP - 1), 1);

          // State D: Check for snap condition (pulled too far or pointer moved away)
          if ((s.stretch > snapStretchThreshold || totalDist > maxAllowedLen || (!cur.present && distToEdge > 10)) && s.state !== "snapping" && s.state !== "recoiling") {
            s.state = "snapping";
            s.snapAge = 0;
            addRipple(s.anchorX, s.anchorY, 1.0);
          }

          if (s.state === "snapping") {
            s.snapAge += dt;
            // Rapid elastic retraction back to anchor
            s.points.forEach((p) => {
              p.x += (s.anchorX - p.x) * (18.0 * dt);
              p.y += (s.anchorY - p.y) * (18.0 * dt);
            });
            if (s.snapAge > 0.16) {
              s.active = false;
              s.state = "idle";
            }
          } else {
            // State C: Cursor capture & Verlet rope simulation
            // Pin base to anchor
            s.points[0].x = s.anchorX;
            s.points[0].y = s.anchorY;

            // Target tip position
            const tipPoint = s.points[NP - 1];
            if (s.state === "emerging") {
              const emergeProg = Math.min(s.life * 4.5, 1.0);
              tipPoint.x += (tipTargetX - tipPoint.x) * emergeProg;
              tipPoint.y += (tipTargetY - tipPoint.y) * emergeProg;
              if (emergeProg >= 1.0) s.state = "attached";
            } else {
              tipPoint.x += (tipTargetX - tipPoint.x) * 0.45;
              tipPoint.y += (tipTargetY - tipPoint.y) * 0.45;
            }

            // Verlet integration with organic slithering wave
            const nx = -(tipTargetY - s.anchorY) / (totalDist || 1);
            const ny = (tipTargetX - s.anchorX) / (totalDist || 1);

            for (let i = 1; i < NP - 1; i++) {
              const p = s.points[i];
              const frac = i / (NP - 1);
              const vx = (p.x - p.px) * 0.94;
              const vy = (p.y - p.py) * 0.94;
              p.px = p.x;
              p.py = p.y;

              // Slithering sinusoidal wave
              const wave = Math.sin(frac * 7.0 - elapsedTime * s.wiggleFreq + s.phase) * s.wiggleAmp * Math.sin(Math.PI * frac);
              p.x += vx + nx * wave * dt * 8.0;
              p.y += vy + ny * wave * dt * 8.0;

              // Volume conservation: tendrils thin out when stretched
              p.r = Math.max(2.4 / Math.sqrt(Math.max(s.stretch, 0.8)), 0.8) * Math.sin(Math.PI * frac + 0.2);
            }

            // Relaxation distance constraints
            const segmentLen = Math.max(totalDist / (NP - 1), 2);
            for (let iter = 0; iter < 3; iter++) {
              for (let i = 0; i < NP - 1; i++) {
                const p1 = s.points[i];
                const p2 = s.points[i + 1];
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const d = Math.hypot(dx, dy) || 1e-4;
                const diff = (d - segmentLen) / d;
                const factor1 = i === 0 ? 0 : 0.5;
                const factor2 = i + 1 === NP - 1 ? 0 : 0.5;
                p1.x += dx * diff * factor1;
                p1.y += dy * diff * factor1;
                p2.x -= dx * diff * factor2;
                p2.y -= dy * diff * factor2;
              }
            }
          }
        }
      });

      // ─────────────────────────────────────────────────────────
      // Surface Ripples Updates
      // ─────────────────────────────────────────────────────────
      const ripples = ripplesRef.current;
      for (let r = ripples.length - 1; r >= 0; r--) {
        ripples[r].age += dt;
        if (ripples[r].age > 1.2) {
          ripples.splice(r, 1);
        }
      }

      // ─────────────────────────────────────────────────────────
      // Click Screen-Swallowing Effect (State E)
      // ─────────────────────────────────────────────────────────
      const clickAnim = clickAnimRef.current;
      let clickProgress = 0;
      if (clickAnim.active) {
        const elapsed = now - clickAnim.startTime;
        clickProgress = Math.min(elapsed / clickAnim.duration, 1.0);

        // Execute navigation or callback mid-swallow (~60% of animation)
        if (clickProgress >= 0.55 && !clickAnim.navTriggered) {
          clickAnim.navTriggered = true;
          if (href) {
            router.push(href);
          }
        }

        if (clickProgress >= 1.0) {
          clickAnim.active = false;
          clickProgress = 0;
        }
      }

      // ─────────────────────────────────────────────────────────
      // Prepare GPU Buffers & Render
      // ─────────────────────────────────────────────────────────
      ptsBuffer.fill(0);
      strandInfoBuffer.fill(0);
      strands.forEach((s, sIdx) => {
        if (s.active) {
          strandInfoBuffer[sIdx * 4 + 0] = 1.0;
          strandInfoBuffer[sIdx * 4 + 1] = NP;
          strandInfoBuffer[sIdx * 4 + 2] = s.stretch;
          strandInfoBuffer[sIdx * 4 + 3] = s.snapAge;
          s.points.forEach((p, pIdx) => {
            const bufIdx = (sIdx * NP + pIdx) * 4;
            ptsBuffer[bufIdx + 0] = p.x;
            ptsBuffer[bufIdx + 1] = p.y;
            ptsBuffer[bufIdx + 2] = 0;
            ptsBuffer[bufIdx + 3] = p.r;
          });
        }
      });

      ripplesBuffer.fill(0);
      ripples.forEach((r, rIdx) => {
        if (rIdx < MAX_RIPPLES) {
          ripplesBuffer[rIdx * 4 + 0] = r.x;
          ripplesBuffer[rIdx * 4 + 1] = r.y;
          ripplesBuffer[rIdx * 4 + 2] = r.age;
          ripplesBuffer[rIdx * 4 + 3] = r.amp;
        }
      });

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(prog);
      const u = uniformsRef.current;

      gl.uniform2f(u.uResolution, canvas.width, canvas.height);
      gl.uniform1f(u.uDpr, dpr);
      gl.uniform1f(u.uTime, elapsedTime);
      gl.uniform4f(u.uBtn, btnCenterX, btnCenterY, btnHalfW, btnHalfH);
      gl.uniform4f(u.uBtnZ, 12.0, 3.0, 1.2, 0.0);
      gl.uniform1i(u.uNumStrands, MAX_STRANDS);
      gl.uniform4fv(u.uPts, ptsBuffer);
      gl.uniform4fv(u.uStrandInfo, strandInfoBuffer);
      gl.uniform4f(
        u.uClick,
        clickProgress,
        clickAnim.maxRadius,
        clickAnim.clickX,
        clickAnim.clickY
      );
      gl.uniform4fv(u.uRipples, ripplesBuffer);

      // Draw single full-screen triangle
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      observer.disconnect();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      if (gl) {
        if (vert) gl.deleteShader(vert);
        if (frag) gl.deleteShader(frag);
        if (prog) gl.deleteProgram(prog);
      }
    };
  }, [addRipple, href, router]);

  // ─────────────────────────────────────────────────────────────
  // Pointer & Interaction Handlers
  // ─────────────────────────────────────────────────────────────
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const cur = cursorRef.current;
    cur.targetX = e.clientX;
    cur.targetY = e.clientY;
    cur.present = true;
  }, []);

  const handlePointerLeave = useCallback(() => {
    const cur = cursorRef.current;
    cur.present = false;
    // Release active strands smoothly
    strandsRef.current.forEach((s) => {
      if (s.active && s.state !== "snapping") {
        s.state = "snapping";
        s.snapAge = 0;
      }
    });
  }, []);

  const triggerClickAnimation = useCallback(
    (clientX: number, clientY: number, e?: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;

      if (onClick) {
        onClick(e || ({} as React.MouseEvent<HTMLElement>));
      }

      // If reduced motion is requested, navigate immediately without shockwave
      if (isReducedMotionRef.current) {
        if (href) router.push(href);
        return;
      }

      // State E: Click Screen-Swallowing effect
      const maxScreenDim = Math.hypot(window.innerWidth, window.innerHeight) * 1.1;
      clickAnimRef.current = {
        active: true,
        startTime: performance.now(),
        duration: 550,
        maxRadius: maxScreenDim,
        clickX: clientX,
        clickY: clientY,
        navTriggered: false,
      };

      addRipple(clientX, clientY, 1.8);
    },
    [disabled, href, onClick, router, addRipple]
  );

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    // If navigation is handled via symbiote expansion, prevent immediate link jump
    if (href) {
      e.preventDefault();
    }
    const clientX = e.clientX || window.innerWidth / 2;
    const clientY = e.clientY || window.innerHeight / 2;
    triggerClickAnimation(clientX, clientY, e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      e.preventDefault();
      const rect = buttonRef.current?.getBoundingClientRect();
      const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
      triggerClickAnimation(cx, cy);
    }
  };

  // Dimensions based on size prop
  const sizeClasses = {
    sm: "px-5 py-2.5 text-xs rounded-full gap-2 min-h-[40px]",
    md: "px-7 py-3.5 text-xs sm:text-sm rounded-full gap-2.5 min-h-[46px]",
    lg: "px-9 py-4 text-xs sm:text-sm rounded-full gap-3 min-h-[52px]",
  }[size];

  // Base typography and container styles (Strict Monochrome GENZLOG)
  const baseButtonClasses = `
    group relative inline-flex items-center justify-center font-bold uppercase tracking-wider
    font-display select-none transition-transform duration-300 outline-none
    focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]
    active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed
    text-white cursor-pointer overflow-visible
    ${fullWidth ? "w-full" : "w-auto"}
    ${sizeClasses}
    ${
      !webglSupported
        ? "bg-gradient-to-b from-[#181818] via-[#0D0D0D] to-[#050505] border border-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_25px_rgba(0,0,0,0.8)]"
        : "bg-transparent border border-transparent"
    }
    ${className}
  `.replace(/\s+/g, " ").trim();

  const buttonContent = (
    <>
      {/* Fallback CSS highlights for non-WebGL devices */}
      {!webglSupported && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-80"
        />
      )}

      {/* Button Children / Label */}
      <span className="relative z-20 flex items-center justify-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        {children || label}
      </span>
    </>
  );

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative inline-flex items-center justify-center ${fullWidth ? "w-full" : "w-auto"}`}
    >
      {/* 
        Full-viewport overlay WebGL2 canvas:
        - pointer-events: none ensures page interactions & scrolling are NEVER blocked.
        - Z-index sits right behind the interactive button text during hover, and expands over the viewport on click.
      */}
      {webglSupported && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-30 w-full h-full"
        />
      )}

      {/* The Accessible Interactive HTML Button / Link */}
      {href ? (
        <Link
          ref={buttonRef as React.Ref<HTMLAnchorElement>}
          href={href}
          id={id}
          aria-label={ariaLabel || (typeof children === "string" ? children : label)}
          className={baseButtonClasses}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          target={target}
          rel={rel}
        >
          {buttonContent}
        </Link>
      ) : (
        <button
          ref={buttonRef as React.Ref<HTMLButtonElement>}
          type={type}
          id={id}
          disabled={disabled}
          aria-label={ariaLabel || (typeof children === "string" ? children : label)}
          className={baseButtonClasses}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          {buttonContent}
        </button>
      )}
    </div>
  );
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
