import { jsPDF } from "jspdf";
import { COMPLETE_SERVICES } from "@/data/services";

export interface ProjectBriefData {
  name: string;
  email: string;
  service: string;
  budget?: string;
  description: string;
  inquiryId?: string;
}

/**
 * Loads the official GENZLOG logo as base64 in browser environments.
 * Preserves the exact original asset without alteration, recoloring, or distortion.
 */
async function loadLogoBase64(): Promise<string | null> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/genzlog-logo-black.png");
      if (!res.ok) return null;
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Sanitizes text for standard jsPDF Type 1 Helvetica font.
 * Replaces non-WinAnsi Unicode characters (e.g., ₹ Indian Rupee symbol, smart quotes,
 * em dashes, and unicode bullets) with clean ASCII equivalents. This prevents character
 * code corruption and font width calculation explosions that cause text overflow.
 */
function sanitizePdfText(str?: string | null): string {
  if (!str) return "";
  return str
    .replace(/₹/g, "INR ")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/•/g, "-");
}

/**
 * Formats current date for professional editorial display.
 */
function formatDocumentDate(): string {
  const d = new Date();
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Generates and downloads a client-ready, high-fidelity monochrome
 * GENZLOG Project Brief or Project Estimate PDF.
 */
export async function generateProjectBriefPdf(data: ProjectBriefData): Promise<{
  referenceId: string;
  documentType: "estimate" | "brief";
  doc: jsPDF;
}> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2; // 178mm
  const bottomThreshold = pageHeight - 18; // 279mm

  // 1. Resolve service and determine document type
  const matchedService = COMPLETE_SERVICES.find(
    (s) =>
      s.title.toLowerCase() === (data.service || "").toLowerCase() ||
      s.formType.toLowerCase() === (data.service || "").toLowerCase() ||
      s.id.toLowerCase() === (data.service || "").toLowerCase()
  );

  const isEstimate = Boolean(
    matchedService &&
      matchedService.startingPrice > 0 &&
      data.service !== "Other / Custom Idea"
  );

  const documentType = isEstimate ? "estimate" : "brief";
  const docTitle = isEstimate ? "PROJECT ESTIMATE" : "PROJECT BRIEF";
  const docStatus = isEstimate ? "PRELIMINARY ESTIMATE" : "PRELIMINARY ENQUIRY";
  const refPrefix = isEstimate ? "GZ-EST" : "GZ-BRIEF";
  const referenceId =
    data.inquiryId || `${refPrefix}-${Date.now().toString(36).toUpperCase()}`;
  const creationDate = formatDocumentDate();

  let currentY = margin;

  // Running Header Helper for Multi-page Documents
  const drawRunningHeader = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text(`GENZLOG // ${docTitle}`, margin, currentY);
    doc.text(`REF: ${referenceId}`, pageWidth - margin, currentY, { align: "right" });
    currentY += 3;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 6;
  };

  // Helper to ensure enough vertical space or break cleanly to a new page
  const ensureSpace = (neededHeight: number) => {
    if (currentY + neededHeight > bottomThreshold) {
      doc.addPage();
      currentY = margin;
      drawRunningHeader();
    }
  };

  // ==========================================
  // 1. BRAND HEADER (Page 1)
  // ==========================================
  const logoData = await loadLogoBase64();
  const headerStartY = currentY;

  if (logoData) {
    try {
      // Official logo has 1024x682 aspect ratio (~1.5015:1)
      const logoW = 34;
      const logoH = logoW * (682 / 1024); // ~22.6mm
      doc.addImage(logoData, "PNG", margin, currentY, logoW, logoH);
      currentY += logoH + 2.5;
    } catch {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(15, 15, 15);
      doc.text("GENZLOG", margin, currentY + 7);
      currentY += 11;
    }
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(15, 15, 15);
    doc.text("GENZLOG", margin, currentY + 7);
    currentY += 11;
  }

  // Brand Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(100, 100, 100);
  doc.text("WEBSITE DEVELOPMENT & DIGITAL EXPERIENCES", margin, currentY);

  // Document Metadata (Right-Aligned in Header)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 15, 15);
  doc.text(docTitle, pageWidth - margin, headerStartY + 5, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text("GENZLOG STUDIO PROPOSAL", pageWidth - margin, headerStartY + 9.5, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  doc.text(`REF NO: ${referenceId}`, pageWidth - margin, headerStartY + 14.5, {
    align: "right",
  });
  doc.text(`DATE: ${creationDate}`, pageWidth - margin, headerStartY + 18.5, {
    align: "right",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(20, 20, 20);
  doc.text(`STATUS: ${docStatus}`, pageWidth - margin, headerStartY + 23, {
    align: "right",
  });

  currentY = Math.max(currentY + 4, headerStartY + 27);

  // Clean Header Divider Line
  doc.setDrawColor(215, 215, 215);
  doc.setLineWidth(0.35);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5.5;

  // ==========================================
  // 2. CLIENT & PROJECT INFORMATION PANEL
  // ==========================================
  const colWidth = (contentWidth - 8) / 2; // ~85mm
  const col1X = margin + 4;
  const col2X = margin + colWidth + 6;

  const clientName = sanitizePdfText(
    data.name && data.name.trim() ? data.name.trim() : "Not provided"
  );
  const clientEmail = sanitizePdfText(
    data.email && data.email.trim() ? data.email.trim() : "Not provided"
  );
  const serviceName = sanitizePdfText(
    data.service && data.service.trim() ? data.service.trim() : "Website Development"
  );
  const categoryBadge = matchedService?.badge
    ? `${matchedService.badge} Solutions`
    : "Bespoke Web Solutions";
  const budgetVal = sanitizePdfText(
    data.budget && data.budget.trim() ? data.budget.trim() : "Not provided"
  );

  // Pre-calculate wrapped lines for safe dynamic height
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  const nameLines = doc.splitTextToSize(clientName, colWidth - 4);
  const serviceLines = doc.splitTextToSize(serviceName, colWidth - 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const emailLines = doc.splitTextToSize(clientEmail, colWidth - 4);
  const budgetLines = doc.splitTextToSize(budgetVal, colWidth - 4);

  // Compute dynamic heights for both columns
  const col1Height = 3.5 + 3.5 + nameLines.length * 3.8 + 3.5 + 3.5 + emailLines.length * 3.8 + 4;
  const col2Height = 3.5 + 3.5 + serviceLines.length * 3.8 + 3.5 + 3.5 + budgetLines.length * 3.8 + 4;
  const cardHeight = Math.max(col1Height, col2Height, 28);

  ensureSpace(cardHeight + 6);

  // Draw Card Background
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(228, 228, 228);
  doc.setLineWidth(0.3);
  doc.rect(margin, currentY, contentWidth, cardHeight, "FD");

  // Render Column 1 (Client Details)
  let c1Y = currentY + 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(115, 115, 115);
  doc.text("CLIENT NAME", col1X, c1Y);

  c1Y += 3.8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(20, 20, 20);
  doc.text(nameLines, col1X, c1Y);
  c1Y += nameLines.length * 3.8 + 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(115, 115, 115);
  doc.text("CLIENT EMAIL", col1X, c1Y);

  c1Y += 3.8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);
  doc.text(emailLines, col1X, c1Y);

  // Render Column 2 (Project & Category Details)
  let c2Y = currentY + 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(115, 115, 115);
  doc.text("PROJECT TYPE", col2X, c2Y);

  c2Y += 3.8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(20, 20, 20);
  doc.text(serviceLines, col2X, c2Y);
  c2Y += serviceLines.length * 3.8 + 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(115, 115, 115);
  doc.text(`CLIENT BUDGET - ${categoryBadge.toUpperCase()}`, col2X, c2Y);

  c2Y += 3.8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);
  doc.text(budgetLines, col2X, c2Y);

  currentY += cardHeight + 6;

  // ==========================================
  // 3. 01 — PROJECT REQUIREMENTS
  // ==========================================
  ensureSpace(24);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 15, 15);
  doc.text("01 — PROJECT REQUIREMENTS", margin, currentY);
  currentY += 4;

  const rawDescription = sanitizePdfText(
    data.description && data.description.trim()
      ? data.description.trim()
      : "No detailed project description was entered."
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);

  const paragraphs = rawDescription.split(/\r?\n\r?\n|\r?\n/);
  const formattedLines: string[] = [];
  paragraphs.forEach((p, idx) => {
    if (!p.trim()) return;
    const split = doc.splitTextToSize(p.trim(), contentWidth - 8);
    formattedLines.push(...split);
    if (idx < paragraphs.length - 1) {
      formattedLines.push("");
    }
  });

  const descLineHeight = 3.8;
  const descContentHeight = formattedLines.length * descLineHeight + 6;

  if (currentY + descContentHeight <= bottomThreshold) {
    // Fits on single page
    doc.setFillColor(252, 252, 252);
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.rect(margin, currentY, contentWidth, descContentHeight, "FD");

    let textY = currentY + 4.5;
    formattedLines.forEach((line) => {
      if (line) doc.text(line, margin + 4, textY);
      textY += descLineHeight;
    });

    currentY += descContentHeight + 5.5;
  } else {
    // Multi-page graceful flow for long client requirements
    let lineIdx = 0;
    while (lineIdx < formattedLines.length) {
      const remainingHeight = bottomThreshold - currentY;
      const linesForThisPage = Math.max(1, Math.floor((remainingHeight - 10) / descLineHeight));
      const pageLines = formattedLines.slice(lineIdx, lineIdx + linesForThisPage);
      const pageBoxHeight = pageLines.length * descLineHeight + 6;

      doc.setFillColor(252, 252, 252);
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.3);
      doc.rect(margin, currentY, contentWidth, pageBoxHeight, "FD");

      let textY = currentY + 4.5;
      pageLines.forEach((l) => {
        if (l) doc.text(l, margin + 4, textY);
        textY += descLineHeight;
      });

      currentY += pageBoxHeight + 5;
      lineIdx += linesForThisPage;

      if (lineIdx < formattedLines.length) {
        doc.addPage();
        currentY = margin;
        drawRunningHeader();
      }
    }
  }

  // ==========================================
  // 4. 02 — PROPOSED SCOPE
  // ==========================================
  ensureSpace(32);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 15, 15);
  doc.text("02 — PROPOSED SCOPE", margin, currentY);
  currentY += 3.8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Preliminary starter scope based on selected service category. Subject to technical review and mutual agreement:",
    margin,
    currentY
  );
  currentY += 4.5;

  const defaultScopeItems = [
    "Custom responsive design engineered for desktop, tablet, and mobile displays.",
    "Fast, accessible frontend architecture with fluid user interactions.",
    "Form validation, security considerations, and direct enquiry channels.",
    "Comprehensive cross-device testing of critical user journeys.",
    "Deployment assistance, codebase handover, and administrative instructions.",
  ];

  const rawScopeItems =
    matchedService && matchedService.features && matchedService.features.length > 0
      ? matchedService.features.slice(0, 5)
      : defaultScopeItems;

  const scopeItems = rawScopeItems.map((item) => sanitizePdfText(item));

  scopeItems.forEach((item) => {
    ensureSpace(8);
    // Subtle circular bullet marker
    doc.setFillColor(30, 30, 30);
    doc.circle(margin + 2.5, currentY - 1, 0.7, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.2);
    doc.setTextColor(35, 35, 35);
    const itemLines = doc.splitTextToSize(item, contentWidth - 8);
    doc.text(itemLines, margin + 5.5, currentY);
    currentY += itemLines.length * 3.8 + 1;
  });

  currentY += 4.5;

  // ==========================================
  // 5. 03 — COMMERCIAL SUMMARY
  // ==========================================
  interface CommercialRow {
    label: string;
    value: string;
    isPrimary?: boolean;
  }

  const commercialRows: CommercialRow[] = isEstimate && matchedService
    ? [
        {
          label: "Estimated Project Fee:",
          value: sanitizePdfText(
            `Starting from INR ${matchedService.startingPrice.toLocaleString("en-IN")}+ (Preliminary baseline estimate)`
          ),
          isPrimary: true,
        },
        {
          label: "Pricing Basis:",
          value: sanitizePdfText(
            "Indicative baseline for standard deliverables. Final quote depends on agreed scope, pages, and integrations."
          ),
        },
        {
          label: "Applicable Taxes:",
          value: "To be confirmed upon formal quote (No taxes assumed)",
        },
        {
          label: "Quotation Status:",
          value: "Preliminary Estimate - subject to requirements discovery and scope sign-off.",
        },
        {
          label: "Payment Terms:",
          value: "To be confirmed upon scope agreement (Standard milestone phased structure)",
        },
        {
          label: "Delivery Timeline:",
          value: "To be confirmed following technical review (Typical 2-4 weeks)",
        },
        {
          label: "Estimate Validity:",
          value: "30 days from proposal date",
        },
      ]
    : [
        {
          label: "Estimated Project Fee:",
          value: "Quotation pending review",
          isPrimary: true,
        },
        {
          label: "Pricing Basis:",
          value: "Custom project requirements pending technical discovery and formal scoping.",
        },
        {
          label: "Applicable Taxes:",
          value: "To be confirmed upon formal quote",
        },
        {
          label: "Quotation Status:",
          value: "Preliminary Enquiry - non-binding project brief.",
        },
        {
          label: "Payment Terms:",
          value: "To be confirmed upon formal quotation and scope sign-off",
        },
        {
          label: "Delivery Timeline:",
          value: "To be confirmed following technical review",
        },
        {
          label: "Estimate Validity:",
          value: "Subject to formal quotation confirmation",
        },
      ];

  // Column geometry: Label = 48mm, Value = 124mm
  const labelColWidth = 48;
  const valueColWidth = contentWidth - labelColWidth - 6; // ~124mm
  const labelX = margin + 3.5;
  const valueX = margin + labelColWidth + 4;

  // Pre-calculate heights for all rows to guarantee zero overflow
  interface MeasuredRow extends CommercialRow {
    labelLines: string[];
    valueLines: string[];
    height: number;
  }

  const measuredRows: MeasuredRow[] = commercialRows.map((row) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.8);
    const labelLines = doc.splitTextToSize(row.label, labelColWidth - 3);

    doc.setFont("helvetica", row.isPrimary ? "bold" : "normal");
    doc.setFontSize(row.isPrimary ? 8.4 : 7.8);
    const valueLines = doc.splitTextToSize(row.value, valueColWidth - 3);

    const maxLineCount = Math.max(labelLines.length, valueLines.length);
    const height = maxLineCount * 3.6 + 2.8;
    return { ...row, labelLines, valueLines, height };
  });

  const totalTableHeight = measuredRows.reduce((acc, r) => acc + r.height, 0) + 3;

  // Ensure table fits cleanly on page
  ensureSpace(totalTableHeight + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 15, 15);
  doc.text("03 — COMMERCIAL SUMMARY", margin, currentY);
  currentY += 4;

  // Draw Commercial Table Box
  doc.setFillColor(249, 249, 249);
  doc.setDrawColor(226, 226, 226);
  doc.setLineWidth(0.3);
  doc.rect(margin, currentY, contentWidth, totalTableHeight, "FD");

  let rowY = currentY + 2.5;

  measuredRows.forEach((row, idx) => {
    // Print Label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.8);
    doc.setTextColor(95, 95, 95);
    doc.text(row.labelLines, labelX, rowY + 2.8);

    // Print Value
    doc.setFont("helvetica", row.isPrimary ? "bold" : "normal");
    doc.setFontSize(row.isPrimary ? 8.4 : 7.8);
    doc.setTextColor(row.isPrimary ? 15 : 35, row.isPrimary ? 15 : 35, row.isPrimary ? 15 : 35);
    doc.text(row.valueLines, valueX, rowY + 2.8);

    rowY += row.height;

    // Row separator line (except last row)
    if (idx < measuredRows.length - 1) {
      doc.setDrawColor(238, 238, 238);
      doc.setLineWidth(0.2);
      doc.line(margin + 2, rowY, margin + contentWidth - 2, rowY);
    }
  });

  currentY += totalTableHeight + 6;

  // ==========================================
  // 6. 04 — NEXT STEPS
  // ==========================================
  ensureSpace(32);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 15, 15);
  doc.text("04 — NEXT STEPS", margin, currentY);
  currentY += 4;

  const nextSteps = [
    {
      step: "01",
      title: "Requirements Review",
      desc: "GENZLOG reviews your submitted project brief and technical requirements.",
    },
    {
      step: "02",
      title: "Scope Alignment",
      desc: "Direct consultation to confirm required pages, features, integrations, and timeline.",
    },
    {
      step: "03",
      title: "Formal Proposal",
      desc: "A formal quotation, milestone delivery schedule, and contract terms are provided.",
    },
    {
      step: "04",
      title: "Project Commencement",
      desc: "Development begins once the formal scope, pricing, and payment terms are mutually agreed.",
    },
  ];

  nextSteps.forEach((st) => {
    ensureSpace(7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.8);
    doc.setTextColor(20, 20, 20);
    const stepLabel = `${st.step}  ${st.title} - `;
    doc.text(stepLabel, margin + 2, currentY);

    const stepLabelWidth = doc.getTextWidth(stepLabel);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.8);
    doc.setTextColor(75, 75, 75);

    const descLines = doc.splitTextToSize(
      st.desc,
      contentWidth - stepLabelWidth - 4
    );
    doc.text(descLines, margin + 2 + stepLabelWidth, currentY);
    currentY += descLines.length * 3.6 + 0.8;
  });

  currentY += 3;

  // Important Disclaimers Note
  ensureSpace(12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(115, 115, 115);
  const disclaimers = [
    "- This document is an initial commercial project brief and does not constitute a final binding contract, confirmed quotation, or tax invoice.",
    "- Preliminary estimates are subject to requirements verification. Final deliverables, pricing, and delivery schedule will be confirmed in a formal agreement.",
  ];
  disclaimers.forEach((d) => {
    const lines = doc.splitTextToSize(d, contentWidth);
    doc.text(lines, margin, currentY);
    currentY += lines.length * 3.4 + 0.4;
  });

  // ==========================================
  // 7. ACCURATE FOOTERS ACROSS EVERY PAGE
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Subtle Top Divider Line for Footer
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(110, 110, 110);
    doc.text(
      "GENZLOG // genzlog.contact@gmail.com - +91 80725 22246 - https://genzlog.com",
      margin,
      pageHeight - 7.5
    );

    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 7.5,
      { align: "right" }
    );
  }

  // Trigger download if running in client browser
  if (typeof window !== "undefined") {
    const safeFilename = `GENZLOG_${docTitle.replace(/\s+/g, "_")}_${referenceId}.pdf`;
    doc.save(safeFilename);
  }

  return { referenceId, documentType, doc };
}
