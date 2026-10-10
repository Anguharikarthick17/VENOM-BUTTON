export interface FreeCodeResource {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: "Login & Signup" | "Navigation" | "Pricing Cards" | "Forms & Inputs" | "Buttons & Effects" | "Landing Page Sections";
  technologies: string[];
  downloadUrl: string;
  fileName: string;
  fileSize: string;
  version: string;
  license: string;
  features: string[];
  installationGuide: {
    step: string;
    description: string;
  }[];
  customizationGuide: string[];
  demoType: "login" | "navbar" | "pricing" | "contact" | "buttons" | "hero";
  relatedSlugs: string[];
}

export const FREE_CODE_RESOURCES: FreeCodeResource[] = [
  {
    id: "fc-01",
    slug: "animated-login-page",
    title: "Animated Split-Screen Login & Auth Page",
    shortDescription: "A minimal, responsive split-screen authentication experience featuring brand panel, password toggle, floating inputs, and smooth transitions.",
    category: "Login & Signup",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    downloadUrl: "/downloads/animated-login-page.zip",
    fileName: "animated-login-page.zip",
    fileSize: "6.2 KB",
    version: "v1.0.0",
    license: "MIT License (Free for Personal & Commercial Use)",
    features: [
      "Split-screen layout (Hero brand showcase + auth form)",
      "Interactive password reveal toggle eye button",
      "Dynamic error & success notification banners",
      "Floating label borders with crisp white active glow",
      "Responsive mobile layout (collapses smoothly below 900px)",
      "Zero external dependencies or frameworks required",
    ],
    installationGuide: [
      { step: "1. Download and Extract", description: "Download the ZIP archive and extract it into your project directory." },
      { step: "2. Open index.html", description: "Double-click index.html or open it via a local live server to test immediately." },
      { step: "3. Integrate into your stack", description: "Copy style.css into your asset pipeline, or easily convert the markup into Next.js/React JSX." },
    ],
    customizationGuide: [
      "Modify CSS variables in style.css under :root (--accent-primary, --bg-primary, --bg-input) to align with your brand colors.",
      "Update logo typography and text in index.html inside the .brand-header container.",
      "Replace the simulated setTimeout() in script.js with your real authentication API endpoint (Supabase, Firebase, or custom backend).",
    ],
    demoType: "login",
    relatedSlugs: ["interactive-contact-form", "modern-navbar", "creative-button-pack"],
  },
  {
    id: "fc-02",
    slug: "modern-navbar",
    title: "Responsive Glassmorphism Navigation Bar",
    shortDescription: "Sticky navigation bar featuring backdrop frosted glass blur on scroll, mobile hamburger slide-out drawer, and active link states.",
    category: "Navigation",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    downloadUrl: "/downloads/modern-navbar.zip",
    fileName: "modern-navbar.zip",
    fileSize: "4.6 KB",
    version: "v1.0.0",
    license: "MIT License (Free for Personal & Commercial Use)",
    features: [
      "Frosted glass blur activates smoothly upon window scroll",
      "Mobile hamburger toggle with animated 3-bar morph to cross",
      "Slide-out mobile navigation drawer with touch-friendly links",
      "Accent underline indicator transitions on hover",
      "Accessible markup with ARIA landmarks and roles",
      "Completely standalone code with zero external libraries",
    ],
    installationGuide: [
      { step: "1. Download Archive", description: "Click Download Free to get the ZIP containing index.html, style.css, script.js, README.md." },
      { step: "2. Embed in Header", description: "Include the <header class=\"navbar\"> element at the top of your document body." },
      { step: "3. Connect Scroll Listener", description: "Include script.js right before </body> to activate scroll detection and mobile toggle." },
    ],
    customizationGuide: [
      "Adjust the blur strength by tuning backdrop-filter: blur(16px) in .navbar.scrolled inside style.css.",
      "Change the scroll trigger offset (currently 30px) in script.js to match your hero section height.",
      "Add dropdown submenus by nesting <ul> within .nav-item and styling with position: absolute.",
    ],
    demoType: "navbar",
    relatedSlugs: ["minimal-portfolio-hero", "creative-button-pack", "pricing-cards"],
  },
  {
    id: "fc-03",
    slug: "pricing-cards",
    title: "Modern SaaS Pricing Cards with Billing Toggle",
    shortDescription: "High-converting SaaS pricing grid with monthly versus annual billing switch, featured popular tier highlight, and feature checklists.",
    category: "Pricing Cards",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    downloadUrl: "/downloads/pricing-cards.zip",
    fileName: "pricing-cards.zip",
    fileSize: "5.3 KB",
    version: "v1.0.0",
    license: "MIT License (Free for Personal & Commercial Use)",
    features: [
      "Monthly vs Annual discount toggle switch with animated knob",
      "Highlighted 'Most Popular' tier with crisp white border and badge",
      "Real-time price amount switching using data attributes",
      "Semantic feature checklist with active checkmarks and disabled states",
      "Responsive auto-fit CSS grid adapting seamlessly to any screen size",
      "Zero dependencies — pure vanilla HTML, CSS, and JS",
    ],
    installationGuide: [
      { step: "1. Download & Unzip", description: "Extract the package files into your project." },
      { step: "2. Insert Pricing HTML", description: "Paste the .pricing-container structure into your pricing section or page." },
      { step: "3. Link Stylesheet & Script", description: "Include style.css and script.js to activate the billing toggle functionality." },
    ],
    customizationGuide: [
      "Edit data-monthly and data-annual attributes on .amount to change prices and discount percentages.",
      "Add or remove <li> items in .feature-list; add class=\"disabled\" to show unavailable features.",
      "Change currency symbol in .currency (e.g., ₹ to $ or €).",
    ],
    demoType: "pricing",
    relatedSlugs: ["interactive-contact-form", "minimal-portfolio-hero", "modern-navbar"],
  },
  {
    id: "fc-04",
    slug: "interactive-contact-form",
    title: "Validated Business Inquiry & Contact Form",
    shortDescription: "Interactive client lead-generation form featuring service chip selectors, budget tier chips, floating inputs, and client validation.",
    category: "Forms & Inputs",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    downloadUrl: "/downloads/interactive-contact-form.zip",
    fileName: "interactive-contact-form.zip",
    fileSize: "5.1 KB",
    version: "v1.0.0",
    license: "MIT License (Free for Personal & Commercial Use)",
    features: [
      "Interactive chip selectors for project type (Website, Landing Page, App, etc.)",
      "Budget range chip selector pills with active white highlight",
      "Responsive 2-column input grid for contact information",
      "Live client-side input validation and feedback toast alert",
      "Form state reset upon successful submission",
      "Clean architecture ready for Formspree, Web3Forms, or custom APIs",
    ],
    installationGuide: [
      { step: "1. Download Resource", description: "Download the ZIP package and extract the files." },
      { step: "2. Embed Form Markup", description: "Insert the form markup from index.html into your contact page." },
      { step: "3. Connect Form Endpoint", description: "Add your form action URL or replace the submit handler in script.js with your fetch() POST call." },
    ],
    customizationGuide: [
      "Add or remove chip options inside .chip-group by modifying data-value attributes.",
      "Change form fields or validation regex inside script.js.",
      "Integrate with services like Formspree, Resend, or your backend API endpoint in script.js.",
    ],
    demoType: "contact",
    relatedSlugs: ["animated-login-page", "pricing-cards", "creative-button-pack"],
  },
  {
    id: "fc-05",
    slug: "creative-button-pack",
    title: "10 Creative Micro-Interaction Button Styles",
    shortDescription: "A modular pack of 10 modern CSS button animations designed for high click-through rates, tactile feedback, and slick aesthetic appeal.",
    category: "Buttons & Effects",
    technologies: ["HTML5", "CSS3"],
    downloadUrl: "/downloads/creative-button-pack.zip",
    fileName: "creative-button-pack.zip",
    fileSize: "4.5 KB",
    version: "v1.0.0",
    license: "MIT License (Free for Personal & Commercial Use)",
    features: [
      "10 distinct, standalone CSS button hover and active micro-interactions",
      "Magnetic ambient glow, Cyberpunk glitch, and Top border beam sweep",
      "Tactile 3D press, Gradient shimmer sweep, and Pulse radar dot",
      "Arrow slide reveal, Minimal expanding underline, and Glassmorph blur",
      "Zero JavaScript required — 100% pure hardware-accelerated CSS",
      "Copy-paste modular classes ready for any web framework",
    ],
    installationGuide: [
      { step: "1. Download & Extract", description: "Download the ZIP package containing index.html, style.css, README.md." },
      { step: "2. Inspect the Showcase", description: "Open index.html to view and test all 10 button styles in action." },
      { step: "3. Copy Desired Style", description: "Copy the specific class (e.g. .btn-glow or .btn-beam) directly into your stylesheet." },
    ],
    customizationGuide: [
      "Adjust --accent in style.css to shift glow and border colors to match your design palette.",
      "Modify animation speeds and keyframes to adjust transition intensity.",
      "Apply these classes directly to <a> tags as easily as <button> tags.",
    ],
    demoType: "buttons",
    relatedSlugs: ["animated-login-page", "modern-navbar", "minimal-portfolio-hero"],
  },
  {
    id: "fc-06",
    slug: "minimal-portfolio-hero",
    title: "Minimal Editorial Agency Hero Section",
    shortDescription: "High-impact editorial hero section with live status availability indicator, clamp() typographic scaling, CTA buttons, and key stats row.",
    category: "Landing Page Sections",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    downloadUrl: "/downloads/minimal-portfolio-hero.zip",
    fileName: "minimal-portfolio-hero.zip",
    fileSize: "4.2 KB",
    version: "v1.0.0",
    license: "MIT License (Free for Personal & Commercial Use)",
    features: [
      "High-impact editorial typography scaled fluidly with clamp()",
      "Live availability status pill with animated CSS pulse dot",
      "Live local time display ticker running in real time",
      "Dual call-to-action buttons (Primary client lead + secondary free code)",
      "Bottom metric proof row with load speed, layouts, and starting rates",
      "Pure HTML, CSS, and lightweight vanilla JS",
    ],
    installationGuide: [
      { step: "1. Download Archive", description: "Download the ZIP archive and extract the files." },
      { step: "2. Place in Landing Page", description: "Insert the <section class=\"hero-section\"> markup at the top of your landing page." },
      { step: "3. Link Clock Script", description: "Include script.js to initialize the real-time clock indicator." },
    ],
    customizationGuide: [
      "Replace headline text inside the <h1> tag in index.html.",
      "Update stat numbers and labels inside .stats-row to reflect your business metrics.",
      "Tune clamp() parameters on .hero-headline h1 in style.css to adjust the font size curve.",
    ],
    demoType: "hero",
    relatedSlugs: ["modern-navbar", "pricing-cards", "creative-button-pack"],
  },
];
