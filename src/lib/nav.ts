/*
  Navigation data. Kept free of the heavy page-content modules because the
  header is a client component and ships this file to the browser.
  Names and taglines mirror SERVICE_PAGES in services-pages.ts.
*/
const SERVICE_LIST = [
  ["Website Design", "website-design", "Every buyer meets it, and most judge you by it.", "Web"],
  ["Brand Identity", "brand-identity", "Look like the choice before you say a word.", "Brand"],
  ["AI Search & SEO", "aeo-seo", "Be the answer, wherever the question is asked.", "Search"],
  ["Content Marketing", "content-marketing", "Found by buyers long before they're ready.", "Content"],
  ["Paid Ads", "paid-ads", "Rent attention on purpose. Keep what it earns.", "Paid"],
  ["PR & Reputation", "pr-reputation", "What people say when you're not in the room.", "PR"],
  ["Creative Direction", "creative-direction", "Someone with taste in every review.", "Creative"],
  ["Martech & Consulting", "martech-consulting", "The wiring nobody sees until it breaks.", "Martech"],
] as const;

/** The eight disciplines, in the order the site presents them */
export const SERVICES = SERVICE_LIST.map(([name, slug, tagline, short], i) => ({
  index: String(i + 1).padStart(2, "0"),
  name,
  short,
  slug,
  tagline,
  href: `/services/${slug}`,
}));

export const COMPANY = [
  { name: "About", desc: "Who we are, and what every engagement includes.", href: "/about" },
  { name: "Work", desc: "Sample engagements, until real cases can be published.", href: "/work" },
  { name: "Methodology", desc: "The four phases, starting with the Diagnostic.", href: "/methodology" },
  { name: "Studio", desc: "Where the work gets made, and what we make it with.", href: "/studio" },
  { name: "Careers", desc: "Open roles, and how hiring works.", href: "/careers" },
  { name: "Journal", desc: "What we're learning about AI search, brand and growth.", href: "/blog" },
  { name: "Contact", desc: "Request a diagnostic, or just write to us.", href: "/contact" },
];

/** Full-screen mobile index, Swiss numbered */
export const MOBILE_NAV = [
  { name: "Services", href: "/services" },
  { name: "Work", href: "/work" },
  { name: "Method", href: "/methodology" },
  { name: "About", href: "/about" },
  { name: "Studio", href: "/studio" },
  { name: "Careers", href: "/careers" },
  { name: "Journal", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export const AUDIT_HREF = "/contact";
export const CONTACT_EMAIL = "hello@plurel.com";

/** Routes that open on a full-bleed cinematic hero the header floats over */
export const OVERLAY_ROUTES = new Set(["/"]);
