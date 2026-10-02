/*
  Navigation data. Kept free of the heavy page-content modules because the
  header is a client component and ships this file to the browser.
  Names and taglines mirror SERVICE_PAGES in services-pages.ts.
*/
const SERVICE_LIST = [
  ["Website Design", "website-design", "The one asset every buyer meets."],
  ["Brand Identity", "brand-identity", "Look like the choice before you say a word."],
  ["AI Search & SEO", "aeo-seo", "Be the answer, wherever the question is asked."],
  ["Content Marketing", "content-marketing", "Proof and perspective, published on a system."],
  ["Paid Ads", "paid-ads", "Buy attention a system can hold."],
  ["PR & Reputation", "pr-reputation", "What the world says when you're not in the room."],
  ["Creative Direction", "creative-direction", "Taste, applied consistently."],
  ["Martech & Consulting", "martech-consulting", "The machinery under the marketing."],
] as const;

/** The eight disciplines, in the order the site presents them */
export const SERVICES = SERVICE_LIST.map(([name, slug, tagline], i) => ({
  index: String(i + 1).padStart(2, "0"),
  name,
  slug,
  tagline,
  href: `/services/${slug}`,
}));

export const COMPANY = [
  { name: "About", desc: "Our story, team, and standard.", href: "/about" },
  { name: "Case Studies", desc: "Transformations, with the numbers.", href: "/work" },
  { name: "Methodology", desc: "The four-phase operating model.", href: "/methodology" },
  { name: "Studio", desc: "Our creative team and craft.", href: "/studio" },
  { name: "Careers", desc: "Build with us. Open roles.", href: "/careers" },
  { name: "Journal", desc: "Notes on staying visible.", href: "/blog" },
  { name: "Contact", desc: "Start a conversation.", href: "/contact" },
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
