export interface ServiceCategory {
  id: string;
  num: string;
  title: string;
  highlightKeyword?: string;
  highlightColor?: string;
  startingPrice: number;
  startingPriceFormatted: string;
  summary: string;
  details: string;
  features: string[];
  scopingNotice?: string;
  securityConsideration?: string;
  formType: string;
  badge?: string;
}

export const COMPLETE_SERVICES: ServiceCategory[] = [
  {
    id: "birthday-celebration",
    num: "01",
    title: "Birthday & Celebration Websites",
    highlightKeyword: "Birthday",
    highlightColor: "#FF2A85",
    startingPrice: 2000,
    startingPriceFormatted: "Starting from ₹2,000",
    summary: "Personalised celebration websites with interactive surprises, photos, messages, and countdowns.",
    details:
      "A meaningful digital gift designed around your memories. Includes custom wishes, photo galleries, celebration countdowns, and optional audio/visual surprises for birthdays, anniversaries, and milestones.",
    features: [
      "Personalised birthday & celebration pages",
      "Curated photo albums and responsive galleries",
      "Custom wishes, quotes, and friend messages",
      "Interactive countdown timers to the special day",
      "Engaging animations and surprise reveals",
      "Background music integration, where appropriate",
    ],
    scopingNotice: "Entry price covers single-page celebration experiences. Complex multi-page timelines or heavy media hosting quoted per scope.",
    securityConsideration: "Private link access and optional passcode protection to keep family photos and messages private.",
    formType: "Birthday & Celebration Website",
    badge: "Personal",
  },
  {
    id: "poster-event",
    num: "02",
    title: "Poster & Event Websites",
    highlightKeyword: "Poster & Event",
    highlightColor: "#B026FF",
    startingPrice: 2500,
    startingPriceFormatted: "Starting from ₹2,500",
    summary: "High-impact event announcement landing pages, digital invitations, and registration hubs.",
    details:
      "Digital poster websites and event hubs designed to promote workshops, college festivals, conferences, meetups, and celebrations with clear schedules, location maps, and signup flows.",
    features: [
      "Event announcement and poster landing pages",
      "Digital invitations with RSVP and calendar links",
      "Event timeline, agenda, and speaker/guest highlights",
      "Venue directions, interactive maps, and guidelines",
      "External registration link and ticket redirects",
      "Organiser contact details and social links",
    ],
    scopingNotice: "Starter scope includes event presentation and external registration links. Built-in ticketing or payment handling quoted separately.",
    securityConsideration: "Secure contact forms and prevention of attendee data scraping on public event pages.",
    formType: "Poster & Event Website",
    badge: "Events",
  },
  {
    id: "prank-interactive",
    num: "03",
    title: "Prank & Interactive Websites",
    highlightKeyword: "Interactive",
    highlightColor: "#4ADE80",
    startingPrice: 2500,
    startingPriceFormatted: "Starting from ₹2,500",
    summary: "Harmless joke pages, playful interactive browser experiences, and surprise animations.",
    details:
      "Creative, lighthearted interactive websites designed for harmless fun, friend gags, April Fools, and playful digital experiences built with custom animations and mini-interactions.",
    features: [
      "Harmless joke pages and playful surprise reveals",
      "Custom interactive animations and cursor effects",
      "Playful browser experiences and mini-games",
      "Dynamic sound effects and audio triggers",
      "Customised friend-specific joke scenarios",
      "Clean exit screens revealing the joke gracefully",
    ],
    scopingNotice: "Strict ethical policy: All prank projects must avoid credential theft, payment deception, malicious downloads, and unauthorised collection of personal information.",
    securityConsideration: "Strictly benign browser interactions; zero unauthorized tracking, phishing patterns, or malware vectors.",
    formType: "Prank & Interactive Website",
    badge: "Interactive",
  },
  {
    id: "company-professional",
    num: "04",
    title: "Company & Professional Websites",
    highlightKeyword: "Professional",
    highlightColor: "#38BDF8",
    startingPrice: 10000,
    startingPriceFormatted: "Starting from ₹10,000",
    summary: "Credible, responsive web presence for businesses, consultancies, agencies, and service firms.",
    details:
      "A complete professional digital foundation that introduces your business, highlights your capabilities, earns client trust, and turns visitors into confirmed leads with speed and elegance.",
    features: [
      "Professional homepage and company introduction",
      "Dedicated about, services, and capability pages",
      "Validated lead generation and contact forms",
      "Mobile-first, fully responsive layouts",
      "Core SEO metadata and Open Graph social sharing",
      "Appropriate security and input validation practices",
    ],
    scopingNotice: "Covers 4–5 core pages. Multi-lingual setups, deep case-study catalogs, or CRM integrations are quoted based on requirements.",
    securityConsideration: "HTTPS configuration, server-side form validation, spam protection, and safe handling of business inquiries.",
    formType: "Company & Professional Website",
    badge: "Business",
  },
  {
    id: "bakery-cafe-restaurant",
    num: "05",
    title: "Bakery, Café & Restaurant Websites",
    highlightKeyword: "Bakery, Café",
    highlightColor: "#FB7185",
    startingPrice: 10000,
    startingPriceFormatted: "Starting from ₹10,000",
    summary: "Appetising digital menus, location guides, dining showcases, and enquiry channels.",
    details:
      "Tailored hospitality websites for bakeries, cafés, restaurants, and cloud kitchens. Showcases your culinary menu, visual food photography, opening hours, dining ambiance, and ordering links.",
    features: [
      "Categorised digital food & beverage menus",
      "High-resolution culinary and ambiance galleries",
      "Operating hours, holiday schedules, and location maps",
      "Direct WhatsApp, phone, or online enquiry links",
      "Customer reviews, dining policies, and FAQs",
      "Optional table booking or takeaway enquiry forms",
    ],
    scopingNotice: "Advanced online ordering, live POS integration, real-time inventory, and online payment gateways are quoted separately outside the starter scope.",
    securityConsideration: "Secure reservation request handling and protected administrator menu management.",
    formType: "Bakery, Café & Restaurant Website",
    badge: "Hospitality",
  },
  {
    id: "gaming-websites",
    num: "06",
    title: "Gaming Websites",
    highlightKeyword: "Gaming",
    highlightColor: "#22D3EE",
    startingPrice: 10000,
    startingPriceFormatted: "Starting from ₹10,000",
    summary: "Immersive gaming portals, team/clan showcases, tournaments, and browser mini-games.",
    details:
      "High-energy gaming hubs engineered with dark cinematic aesthetics. Ideal for game studios, esports teams, streamers, community gaming clans, and independent web-game releases.",
    features: [
      "Gaming portals and studio portfolio showcases",
      "Game trailers, lore, and character information pages",
      "Player profiles, team rosters, and stream links",
      "Tournament schedules, brackets, and announcements",
      "Community leaderboards and match result archives",
      "Lightweight browser-based Canvas/WebGL mini-games",
    ],
    scopingNotice: "Multiplayer server backends, real-time websocket synchronisation, and in-game microtransactions require dedicated technical scoping.",
    securityConsideration: "Leaderboard verification, rate-limiting, and protection against score tampering.",
    formType: "Gaming Website",
    badge: "Gaming",
  },
  {
    id: "billing-invoice-systems",
    num: "07",
    title: "Billing & Invoice Systems",
    highlightKeyword: "Billing",
    highlightColor: "#4ADE80",
    startingPrice: 15000,
    startingPriceFormatted: "Starting from ₹15,000",
    summary: "Web-based invoice generation, client records, product catalogues, and print-ready receipts.",
    details:
      "Clean, efficient billing software built for freelancers, shops, and small businesses to generate professional invoices, track payment status, and export PDF documents without complex spreadsheets.",
    features: [
      "Custom invoice generator with company branding",
      "Customer contact records and client directory",
      "Product and service catalogue with unit pricing",
      "Automated tax, GST, discount, and total calculations",
      "Printable, download-ready PDF invoice templates",
      "Basic revenue and unpaid invoice summary reports",
    ],
    scopingNotice: "Advanced accounting ledgers, ERP integrations, multi-currency conversion, and automated banking APIs are quoted according to requirements.",
    securityConsideration: "Role-based access control, server-side data validation, encrypted storage of financial records, and secure backup procedures.",
    formType: "Billing & Invoice System",
    badge: "Operations",
  },
  {
    id: "exam-quiz-platforms",
    num: "08",
    title: "Exam & Quiz Platforms",
    highlightKeyword: "Exam & Quiz",
    highlightColor: "#C084FC",
    startingPrice: 15000,
    startingPriceFormatted: "Starting from ₹15,000",
    summary: "Online assessment portals with multiple-choice questions, timers, and automatic scoring.",
    details:
      "Interactive evaluation platforms for educational institutions, corporate coaching, hiring assessments, and student practice tests with seamless test-taking workflows and instant result analytics.",
    features: [
      "Online quizzes and examinations with structured sections",
      "Multiple-choice, true/false, and text input formats",
      "Timed assessments with countdown clocks and auto-submit",
      "Instant server-side grading and score calculations",
      "Candidate result summaries and performance breakdowns",
      "Intuitive question management and answer key tools",
    ],
    scopingNotice: "Candidate accounts, extensive question banks, webcam proctoring, anti-cheating mechanisms, and detailed batch reporting increase project scope.",
    securityConsideration: "Server-side answer validation (answers never exposed in frontend code) and access-restricted candidate result endpoints.",
    formType: "Exam & Quiz Platform",
    badge: "Education",
  },
  {
    id: "custom-web-apps",
    num: "09",
    title: "Custom Websites & Web Applications",
    highlightKeyword: "Custom",
    highlightColor: "#22D3EE",
    startingPrice: 20000,
    startingPriceFormatted: "Starting from ₹20,000",
    summary: "Bespoke digital dashboards, booking systems, business portals, and automated workflows.",
    details:
      "Engineered full-stack web applications tailored to your exact operational requirements. Built with modern React/Next.js, typed APIs, robust databases, and scalable backend infrastructure.",
    features: [
      "Custom administrative and customer-facing dashboards",
      "Service booking and appointment scheduling systems",
      "Secure user authentication and role-based permissions",
      "Relational or document database integration",
      "Automated data workflows and form handling",
      "Third-party API connections and webhook integrations",
    ],
    scopingNotice: "Final investment depends directly on required architectural depth, user roles, integrations, and ongoing maintenance expectations.",
    securityConsideration: "Strict authentication, session management, input sanitisation, output encoding, safe secret storage, and vulnerability testing.",
    formType: "Custom Website & Web Application",
    badge: "Applications",
  },
  {
    id: "ecommerce-websites",
    num: "10",
    title: "E-commerce Websites",
    highlightKeyword: "E-commerce",
    highlightColor: "#A855F7",
    startingPrice: 25000,
    startingPriceFormatted: "Starting from ₹25,000",
    summary: "Modern online storefronts with product catalogues, shopping carts, and checkout flows.",
    details:
      "Brand-forward online stores designed to sell products seamlessly. Includes visual product galleries, intuitive cart drawers, payment gateway integration, and order management tools.",
    features: [
      "Structured product catalogue with variants and filters",
      "High-conversion product detail pages and image galleries",
      "Persistent shopping carts and guest checkout options",
      "Payment gateway integration (Razorpay, Stripe, Cashfree, etc.)",
      "Order confirmation emails and status tracking pages",
      "Administrator order and inventory overview screens",
    ],
    scopingNotice: "Automated logistics/shipping APIs, multi-warehouse sync, loyalty programs, and large catalogs are estimated based on technical scope.",
    securityConsideration: "PCI-DSS compliant payment gateway handoff (raw card data is never stored on our servers), TLS encryption, and secure customer session handling.",
    formType: "E-commerce Website",
    badge: "Commerce",
  },
  {
    id: "live-tracking-websites",
    num: "11",
    title: "Live Tracking Websites",
    highlightKeyword: "Live Tracking",
    highlightColor: "#38BDF8",
    startingPrice: 25000,
    startingPriceFormatted: "Starting from ₹25,000",
    summary: "Map-based tracking interfaces, delivery status updates, and location dashboards.",
    details:
      "Specialised geographic and status-monitoring web applications for delivery tracking, field services, fleet monitoring, and event movements with interactive map views and secure status queries.",
    features: [
      "Live or periodically updated map visualisations",
      "Order and delivery progress tracking dashboards",
      "Geographic location updates and route status displays",
      "Milestone-based progress indicators and arrival estimates",
      "Secure, access-controlled tracking links for customers",
      "Administrator management console for dispatch teams",
    ],
    scopingNotice: "GPS hardware sourcing, commercial map provider fees (Google Maps/Mapbox API quotas), and real-time socket infrastructure involve separate operational costs.",
    securityConsideration: "Location privacy permissions, token-authenticated tracking endpoints, and strict access controls to prevent public exposure of private routes.",
    formType: "Live Tracking Website",
    badge: "Logistics",
  },
  {
    id: "mobile-desktop-apps",
    num: "12",
    title: "Custom Mobile & Desktop Applications",
    highlightKeyword: "Mobile & Desktop",
    highlightColor: "#FF2A85",
    startingPrice: 30000,
    startingPriceFormatted: "Starting from ₹30,000",
    summary: "Tailored native, cross-platform mobile apps (iOS/Android) and desktop applications.",
    details:
      "Specialised applications developed for mobile devices and desktop operating systems. Built for offline capabilities, hardware integrations, push notifications, and dedicated workflows.",
    features: [
      "Custom user interfaces optimised for touch or desktop mouse",
      "Cross-platform architecture (React Native, Flutter, Electron, or Tauri)",
      "Secure user login and cloud data synchronisation",
      "Device storage and offline mode handling",
      "Push notifications and background updates, where supported",
      "Bespoke workflows tailored to specific business operations",
    ],
    scopingNotice: "Quotations clearly distinguish between web apps, cross-platform apps, and native apps. App-store developer fees and external cloud services are paid directly by the client.",
    securityConsideration: "Encrypted local storage, secure credential keychains, certificate pinning where required, and validated API communication.",
    formType: "Custom Mobile & Desktop Application",
    badge: "Software",
  },
];

// Security Architecture Pillars
export interface SecurityPillar {
  num: string;
  title: string;
  summary: string;
}

export const SECURITY_PILLARS: SecurityPillar[] = [
  {
    num: "01",
    title: "SECURITY-FIRST DEVELOPMENT",
    summary:
      "We use appropriate secure coding practices, validate inputs, and review relevant security risks during development.",
  },
  {
    num: "02",
    title: "PRIVACY BY DESIGN",
    summary:
      "We aim to collect only necessary information and handle personal data according to the project's requirements and applicable privacy obligations.",
  },
  {
    num: "03",
    title: "TESTED FOR QUALITY",
    summary:
      "We test agreed workflows, forms, links, and important functionality to identify issues before delivery.",
  },
  {
    num: "04",
    title: "ONGOING SUPPORT",
    summary:
      "Maintenance, updates, monitoring, backups, and additional security reviews can be arranged according to the selected support plan.",
  },
];

// Security FAQ Items
export interface SecurityFAQ {
  question: string;
  answer: string;
}

export const SECURITY_FAQS: SecurityFAQ[] = [
  {
    question: "Will my website be completely hack-proof?",
    answer:
      "No internet-connected website can be guaranteed to be completely hack-proof. GENZLOG follows appropriate security practices and can provide additional security reviews based on your project's requirements.",
  },
  {
    question: "Will my website ever have errors?",
    answer:
      "We test agreed functionality and work to reduce defects before delivery. If an issue is identified, the resolution process depends on the project agreement and applicable support or warranty terms.",
  },
  {
    question: "Will my customer data remain private?",
    answer:
      "We design for privacy and use appropriate safeguards for the data the application handles. Data protection also depends on hosting, third-party services, access controls, configuration, and how the website is operated.",
  },
  {
    question: "Is SSL/HTTPS included?",
    answer:
      "HTTPS configuration depends on the selected hosting environment and certificate arrangements. Your quotation will clarify what is configured and whether additional charges apply.",
  },
  {
    question: "Do you provide maintenance and security updates?",
    answer:
      "Maintenance and ongoing security support can be arranged according to the selected service agreement. Continuous monitoring and unlimited updates are not automatically included unless specified.",
  },
  {
    question: "What happens if a security issue is discovered?",
    answer:
      "Customers can report concerns through the agreed support channel. Investigation, communication, remediation, and any applicable charges follow the project agreement and support terms.",
  },
];

// 4 Editorial Groups for the Services Directory
export interface ServiceGroup {
  id: string;
  letter: string;
  title: string;
  tagline: string;
  priceRange: string;
  services: ServiceCategory[];
}

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: "personal-creative",
    letter: "GROUP A",
    title: "PERSONAL & CREATIVE",
    tagline: "Celebration pages, digital event posters, and playful interactive experiences.",
    priceRange: "Starting from ₹2,000 – ₹2,500+",
    services: COMPLETE_SERVICES.slice(0, 3),
  },
  {
    id: "business-websites",
    letter: "GROUP B",
    title: "BUSINESS WEBSITES",
    tagline: "High-credibility corporate presences, culinary dining menus, and gaming brand portals.",
    priceRange: "Starting from ₹10,000+",
    services: COMPLETE_SERVICES.slice(3, 6),
  },
  {
    id: "web-applications",
    letter: "GROUP C",
    title: "WEB APPLICATIONS",
    tagline: "Custom billing engines, assessment platforms, and dynamic full-stack web portals.",
    priceRange: "Starting from ₹15,000+",
    services: COMPLETE_SERVICES.slice(6, 9),
  },
  {
    id: "advanced-solutions",
    letter: "GROUP D",
    title: "ADVANCED SOLUTIONS",
    tagline: "Full-scale e-commerce stores, live tracking applications, and cross-platform desktop/mobile software.",
    priceRange: "Starting from ₹25,000+",
    services: COMPLETE_SERVICES.slice(9, 12),
  },
];

