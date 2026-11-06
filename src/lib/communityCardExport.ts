import { drawDottedGlobeSnapshot } from "@/components/community/CommunityDottedGlobe";

/**
 * Exports a high-resolution PNG of the GENZLOG Community Member Pass.
 * Pure HTML5 Canvas implementation: 100% client-side, zero external dependencies,
 * fully compatible across desktop and mobile browsers.
 */
export async function exportCommunityCardPng(
  name: string = "YOUR NAME"
): Promise<boolean> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  try {
    // 1. Ensure web fonts are completely loaded
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const displayName =
      name && name.trim().length > 0 ? name.trim().toUpperCase() : "YOUR NAME";

    // 2. High-Resolution Canvas Dimensions (2x Retina scale)
    const width = 800;
    const height = 1136;
    const radius = 64;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not initialize 2D canvas context");

    // Enable high quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Helper: Rounded Rectangle Path
    const drawRoundedRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    // 3. Card Background Surface
    drawRoundedRect(10, 10, width - 20, height - 20, radius);
    ctx.clip();

    // Dark gradient surface
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, "#151515");
    bgGradient.addColorStop(0.5, "#0D0D0D");
    bgGradient.addColorStop(1, "#070707");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Ambient top spotlight
    const spotGradient = ctx.createRadialGradient(
      width / 2,
      120,
      10,
      width / 2,
      120,
      width * 0.75
    );
    spotGradient.addColorStop(0, "rgba(255, 255, 255, 0.08)");
    spotGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = spotGradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle background grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 40; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 4. Metallic Card Border
    ctx.restore();
    drawRoundedRect(10, 10, width - 20, height - 20, radius);
    ctx.strokeStyle = "#2A2A2A";
    ctx.lineWidth = 3;
    ctx.stroke();

    // 5. Corner Security Markers
    const markerLen = 16;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 2;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(40, 40 + markerLen);
    ctx.lineTo(40, 40);
    ctx.lineTo(40 + markerLen, 40);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(width - 40 - markerLen, 40);
    ctx.lineTo(width - 40, 40);
    ctx.lineTo(width - 40, 40 + markerLen);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(40, height - 40 - markerLen);
    ctx.lineTo(40, height - 40);
    ctx.lineTo(40 + markerLen, height - 40);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(width - 40 - markerLen, height - 40);
    ctx.lineTo(width - 40, height - 40);
    ctx.lineTo(width - 40, height - 40 - markerLen);
    ctx.stroke();

    // 6. Lanyard Slot Punch Cutout
    const slotW = 120;
    const slotH = 24;
    const slotX = (width - slotW) / 2;
    const slotY = 48;
    drawRoundedRect(slotX, slotY, slotW, slotH, 12);
    ctx.fillStyle = "#050505";
    ctx.fill();
    ctx.strokeStyle = "#282828";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner slot shadow
    drawRoundedRect(slotX + 16, slotY + 6, slotW - 32, slotH - 12, 6);
    ctx.fillStyle = "#0B0B0B";
    ctx.fill();

    // 7. Brand Header
    const headerY = 125;
    // Pulse dot
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(65, headerY, 6, 0, Math.PI * 2);
    ctx.fill();

    // GENZLOG Title
    ctx.fillStyle = "#FFFFFF";
    ctx.font =
      "900 32px var(--font-space-grotesk), 'Space Grotesk', -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("GENZLOG", 84, headerY);

    // DIGITAL STUDIO Tag
    ctx.fillStyle = "#888888";
    ctx.font =
      "600 16px var(--font-geist-mono), 'Geist Mono', monospace";
    ctx.textAlign = "right";
    ctx.fillText("DIGITAL STUDIO", width - 60, headerY);

    // Header divider line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(50, headerY + 28);
    ctx.lineTo(width - 50, headerY + 28);
    ctx.stroke();

    // 8. Center Dotted Globe
    const globeCenterY = 485;
    const globeRadius = 185;
    drawDottedGlobeSnapshot(ctx, width / 2, globeCenterY, globeRadius, 0.45);

    // 9. Name Block
    const nameCenterY = 790;

    // Dynamically scale font size according to name length
    let fontSize = 48;
    if (displayName.length > 24) {
      fontSize = 28;
    } else if (displayName.length > 18) {
      fontSize = 34;
    } else if (displayName.length > 12) {
      fontSize = 40;
    }

    ctx.fillStyle = displayName === "YOUR NAME" ? "#888888" : "#FFFFFF";
    ctx.font = `800 ${fontSize}px var(--font-space-grotesk), 'Space Grotesk', -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayName, width / 2, nameCenterY);

    // 10. Role Capsule Badge
    const badgeY = nameCenterY + 54;
    const badgeW = 380;
    const badgeH = 34;
    drawRoundedRect(
      (width - badgeW) / 2,
      badgeY - badgeH / 2,
      badgeW,
      badgeH,
      17
    );
    ctx.fillStyle = "#191919";
    ctx.fill();
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Small white dot
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc((width - badgeW) / 2 + 20, badgeY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Role Text
    ctx.fillStyle = "#A3A3A3";
    ctx.font =
      "600 13px var(--font-geist-mono), 'Geist Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("GENZLOG COMMUNITY MEMBER", width / 2 + 8, badgeY);

    // 11. Footer Divider Line
    const footerY = height - 90;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(50, footerY);
    ctx.lineTo(width - 50, footerY);
    ctx.stroke();

    // 12. Footer Pillars: BUILD / DESIGN / CREATE / SHARE
    ctx.fillStyle = "#737373";
    ctx.font =
      "600 15px var(--font-geist-mono), 'Geist Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("BUILD  •  DESIGN  •  CREATE  •  SHARE", width / 2, footerY + 40);

    // 13. Convert Canvas to PNG Blob & Trigger Download
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png", 1.0)
    );

    if (!blob) throw new Error("Canvas PNG generation returned null blob");

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "GENZLOG-Community-Card.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);

    return true;
  } catch (error) {
    console.error("Failed to export GENZLOG community card PNG:", error);
    return false;
  }
}
