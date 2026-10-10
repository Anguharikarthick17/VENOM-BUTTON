import { COMPLETE_SERVICES } from "@/data/services";

export const SERVICE_CHOICES = [
  "Company & Professional Website",
  "Birthday & Celebration Website",
  "Poster & Event Website",
  "Prank & Interactive Website",
  "Bakery, Café & Restaurant Website",
  "Gaming Website",
  "Billing & Invoice System",
  "Exam & Quiz Platform",
  "Custom Website & Web Application",
  "Custom Website / Web Application",
  "Customized AI Solutions",
  "Custom Login / Signup UI",
  "E-commerce Website",
  "Live Tracking Website",
  "Custom Mobile & Desktop Application",
  "Other / Something Unique",
  "Other / Custom Idea",
] as const;

export type ServiceChoice = (typeof SERVICE_CHOICES)[number];

export const SERVICE_STARTER_DESCRIPTIONS: Record<string, string> = {
  "Birthday & Celebration Website": `I’m interested in a Birthday & Celebration Website.

Please discuss the design, interactive features, required pages, personalization options, estimated cost, and delivery timeline for this project.`,

  "Poster & Event Website": `I’m interested in a Poster & Event Website.

Please discuss the event landing page design, digital invitation features, schedule presentation, RSVP or registration integration, estimated cost, and delivery timeline.`,

  "Prank & Interactive Website": `I’m interested in a Prank & Interactive Website.

Please discuss the interactive animations, custom joke scenario, audio and visual effects, browser compatibility, estimated cost, and delivery timeline.`,

  "Company & Professional Website": `I’m interested in a Company & Professional Website.

Please discuss the website structure, page layouts, brand identity, lead capture forms, responsive design, estimated cost, and delivery timeline.`,

  "Bakery, Café & Restaurant Website": `I’m interested in a Bakery, Café & Restaurant Website.

Please discuss the digital menu layout, photography presentation, reservation or inquiry forms, location maps, estimated cost, and delivery timeline.`,

  "Gaming Website": `I’m interested in a Gaming Website.

Please discuss the gaming portal design, player roster showcases, tournament schedules, interactive media, estimated cost, and delivery timeline.`,

  "Billing & Invoice System": `I’m interested in a Billing & Invoice System.

Please discuss the required billing workflows, invoice generation, customer records, product catalogue, reporting features, estimated cost, and delivery timeline.`,

  "Exam & Quiz Platform": `I’m interested in an Exam & Quiz Platform.

Please discuss the question formats, timed test flows, automatic scoring, candidate result analytics, estimated cost, and delivery timeline.`,

  "Custom Website & Web Application": `I’m interested in a Custom Website & Web Application.

Please discuss the application architecture, user roles, database requirements, third-party integrations, estimated cost, and delivery timeline.`,

  "Custom Website / Web Application": `I’m interested in a Custom Website / Web Application.

Please discuss the application architecture, user roles, database requirements, third-party integrations, estimated cost, and delivery timeline.`,

  "Customized AI Solutions": `I’m interested in Customized AI Solutions (chatbots, workflow automation, document processing, or AI integrations).

Please discuss feasibility, model selection, third-party API requirements, scope, estimated cost, and delivery timeline.`,

  "Custom Login / Signup UI": `I’m interested in Custom Login & Authentication UI (3D, glassmorphism, animated, or branded account interfaces).

Please discuss design concepts, frontend styling, required authentication flows, backend integration scope, estimated cost, and delivery timeline.`,

  "E-commerce Website": `I’m interested in an E-commerce Website.

Please discuss the product catalogue structure, shopping cart experience, payment gateway options, order management, estimated cost, and delivery timeline.`,

  "Live Tracking Website": `I’m interested in a Live Tracking Website.

Please discuss the map visualisation, status update workflows, tracking link access, dashboard controls, estimated cost, and delivery timeline.`,

  "Custom Mobile & Desktop Application": `I’m interested in a Custom Mobile & Desktop Application.

Please discuss the target platforms (iOS, Android, or Desktop), core user workflows, offline support, authentication, estimated cost, and delivery timeline.`,

  "Other / Something Unique": `I have a unique project idea that I would like to discuss with GENZLOG.

Please review my requirements and advise on technical feasibility, recommended approach, proposed scope, estimated cost, and delivery timeline.`,

  "Other / Custom Idea": `I have a custom project idea I would like to discuss with GENZLOG.

Please review my concept and advise on the recommended approach, proposed scope, estimated cost, and delivery timeline.`,
};

/**
 * Normalizes and matches any service query string against the official service catalogue.
 * Supports exact dropdown choices, plural titles from service cards, service IDs, and common aliases.
 */
export function resolveServiceFromQuery(
  rawParam: string | null | undefined
): { selectedService: string; starterDescription: string } | null {
  if (!rawParam || typeof rawParam !== "string") {
    return null;
  }

  const trimmed = decodeURIComponent(rawParam).trim();
  if (!trimmed) {
    return null;
  }

  const lower = trimmed.toLowerCase();

  // 1. Check exact match in dropdown choices
  const exactChoice = SERVICE_CHOICES.find(
    (c) => c.toLowerCase() === lower
  );
  if (exactChoice) {
    return {
      selectedService: exactChoice,
      starterDescription: SERVICE_STARTER_DESCRIPTIONS[exactChoice] || "",
    };
  }

  // 2. Check in COMPLETE_SERVICES by title (plural card title) or formType or id
  const matchedService = COMPLETE_SERVICES.find(
    (s) =>
      s.title.toLowerCase() === lower ||
      s.formType.toLowerCase() === lower ||
      s.id.toLowerCase() === lower ||
      s.id.toLowerCase().replace(/-/g, " ") === lower
  );

  if (matchedService) {
    const matchedChoice = SERVICE_CHOICES.find(
      (c) => c.toLowerCase() === matchedService.formType.toLowerCase()
    );
    const selectedService = matchedChoice || matchedService.formType;
    return {
      selectedService,
      starterDescription:
        SERVICE_STARTER_DESCRIPTIONS[selectedService] ||
        `I’m interested in ${matchedService.title}.\n\nPlease discuss the recommended approach, proposed scope, estimated cost, and delivery timeline.`,
    };
  }

  // 3. Fallback matching for common keywords/aliases
  if (lower.includes("birthday") || lower.includes("celebration")) {
    return {
      selectedService: "Birthday & Celebration Website",
      starterDescription: SERVICE_STARTER_DESCRIPTIONS["Birthday & Celebration Website"],
    };
  }
  if (lower.includes("poster") || lower.includes("event") || lower.includes("invitation")) {
    return {
      selectedService: "Poster & Event Website",
      starterDescription: SERVICE_STARTER_DESCRIPTIONS["Poster & Event Website"],
    };
  }
  if (lower.includes("prank") || lower.includes("joke")) {
    return {
      selectedService: "Prank & Interactive Website",
      starterDescription: SERVICE_STARTER_DESCRIPTIONS["Prank & Interactive Website"],
    };
  }
  if (lower.includes("company") || lower.includes("business") || lower.includes("landing")) {
    return {
      selectedService: "Company & Professional Website",
      starterDescription: SERVICE_STARTER_DESCRIPTIONS["Company & Professional Website"],
    };
  }
  if (lower.includes("bakery") || lower.includes("cafe") || lower.includes("café") || lower.includes("restaurant") || lower.includes("food")) {
    return {
      selectedService: "Bakery, Café & Restaurant Website",
      starterDescription: SERVICE_STARTER_DESCRIPTIONS["Bakery, Café & Restaurant Website"],
    };
  }
  if (lower.includes("gaming") || lower.includes("esport")) {
    return {
      selectedService: "Gaming Website",
      starterDescription: SERVICE_STARTER_DESCRIPTIONS["Gaming Website"],
    };
  }
  if (lower.includes("billing") || lower.includes("invoice")) {
    return {
      selectedService: "Billing & Invoice System",
      starterDescription: SERVICE_STARTER_DESCRIPTIONS["Billing & Invoice System"],
    };
  }
  if (lower.includes("exam") || lower.includes("quiz") || lower.includes("test")) {
    return {
      selectedService: "Exam & Quiz Platform",
      starterDescription: SERVICE_STARTER_DESCRIPTIONS["Exam & Quiz Platform"],
    };
  }
  if (lower.includes("ecommerce") || lower.includes("e-commerce") || lower.includes("shop") || lower.includes("store")) {
    return {
      selectedService: "E-commerce Website",
      starterDescription: SERVICE_STARTER_DESCRIPTIONS["E-commerce Website"],
    };
  }
  if (lower.includes("tracking") || lower.includes("gps") || lower.includes("delivery")) {
    return {
      selectedService: "Live Tracking Website",
      starterDescription: SERVICE_STARTER_DESCRIPTIONS["Live Tracking Website"],
    };
  }
  if (lower.includes("mobile") || lower.includes("desktop") || lower.includes("app") || lower.includes("software")) {
    return {
      selectedService: "Custom Mobile & Desktop Application",
      starterDescription: SERVICE_STARTER_DESCRIPTIONS["Custom Mobile & Desktop Application"],
    };
  }
  if (lower.includes("ai") || lower.includes("chatbot") || lower.includes("intelligence")) {
    return {
      selectedService: "Customized AI Solutions",
      starterDescription: SERVICE_STARTER_DESCRIPTIONS["Customized AI Solutions"],
    };
  }
  if (lower.includes("login") || lower.includes("auth") || lower.includes("signup")) {
    return {
      selectedService: "Custom Login / Signup UI",
      starterDescription: SERVICE_STARTER_DESCRIPTIONS["Custom Login / Signup UI"],
    };
  }
  if (lower.includes("unique") || lower.includes("something unique")) {
    return {
      selectedService: "Other / Something Unique",
      starterDescription: SERVICE_STARTER_DESCRIPTIONS["Other / Something Unique"],
    };
  }
  if (lower.includes("custom") || lower.includes("other") || lower.includes("idea")) {
    return {
      selectedService: "Other / Something Unique",
      starterDescription: SERVICE_STARTER_DESCRIPTIONS["Other / Something Unique"],
    };
  }

  // Graceful unknown parameter fallback
  return {
    selectedService: "Other / Custom Idea",
    starterDescription: `I’m interested in discussing a digital project with GENZLOG.\n\nPlease discuss the recommended approach, proposed scope, estimated cost, and delivery timeline.`,
  };
}
