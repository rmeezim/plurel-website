/*
  Navigation data. Kept free of the heavy page-content modules because the
  header is a client component and ships this file to the browser.
  Names and taglines mirror DISCIPLINES in disciplines.ts; the layer each
  sits in mirrors SERVICE_STAGE in services-type.ts.
*/
export type LayerKey = "narrative" | "create" | "distribute" | "measure";

/** The Plurel System's four layers, top to bottom */
export const LAYERS: readonly { key: LayerKey; name: string }[] = [
  { key: "narrative", name: "Narrative" },
  { key: "create", name: "Create" },
  { key: "distribute", name: "Distribute" },
  { key: "measure", name: "Measure" },
];

const SERVICE_LIST = [
  ["Website Design", "website-design", "Every buyer meets it, and most judge you by it.", "create"],
  ["Brand Identity", "brand-identity", "Look like the choice before you say a word.", "narrative"],
  ["AI Search & SEO", "aeo-seo", "Be the answer, wherever the question is asked.", "distribute"],
  ["Content Marketing", "content-marketing", "Found by buyers long before they're ready.", "create"],
  ["Paid Ads", "paid-ads", "Rent attention on purpose. Keep what it earns.", "distribute"],
  ["PR & Reputation", "pr-reputation", "What people say when you're not in the room.", "distribute"],
  ["Creative Direction", "creative-direction", "Someone with taste in every review.", "narrative"],
  ["Martech & Consulting", "martech-consulting", "The wiring nobody sees until it breaks.", "measure"],
] as const;

/** The eight disciplines (the individual services), in the order the site presents them, each with its layer */
export const SERVICES = SERVICE_LIST.map(([name, slug, tagline, layer], i) => ({
  index: String(i + 1).padStart(2, "0"),
  name,
  slug,
  tagline,
  layer: layer as LayerKey,
  href: `/services/${slug}`,
}));

export type PackageKey = "reach" | "reputation" | "mindshare" | "revenue";

/**
 * The four packages, by what a company comes for (the homepage's What you
 * came for): each runs on all four layers. Wants mirror PACKAGES in
 * packages.ts, which holds each page's copy.
 */
export const PACKAGES: readonly { key: PackageKey; term: string; want: string; href: string }[] = [
  { key: "reach", term: "Reach", want: "Be seen, and sometimes go viral.", href: "/services/reach" },
  { key: "reputation", term: "Reputation", want: "Be talked about, and believed.", href: "/services/reputation" },
  { key: "mindshare", term: "Mindshare", want: "Be the one they think of first.", href: "/services/mindshare" },
  { key: "revenue", term: "Revenue", want: "Be chosen when they’re ready.", href: "/services/revenue" },
];

/** The Diagnostic's page, where a link names the Diagnostic itself */
export const DIAGNOSTIC_HREF = "/diagnostic";
/** Every "Request a diagnostic" lands on the Diagnostic's request form */
export const AUDIT_HREF = `${DIAGNOSTIC_HREF}#request`;
export const CONTACT_EMAIL = "hello@plurel.com";

/** The primary navigation, in the order a visitor asks: what, how, for whom, who */
export const PRIMARY = [
  { name: "Method", href: "/method" },
  { name: "Industries", href: "/industries" },
  { name: "About", href: "/about" },
  { name: "Journal", href: "/journal" },
];

/** The footer's company list */
export const COMPANY = [
  { name: "About", href: "/about" },
  { name: "Method", href: "/method" },
  { name: "Industries", href: "/industries" },
  { name: "Journal", href: "/journal" },
  { name: "Contact", href: "/contact" },
];

/** The full-screen mobile index */
export const MOBILE_NAV = [
  { name: "Services", href: "/services" },
  { name: "Method", href: "/method" },
  { name: "Industries", href: "/industries" },
  { name: "The Diagnostic", href: DIAGNOSTIC_HREF },
  { name: "About", href: "/about" },
  { name: "Journal", href: "/journal" },
  { name: "Contact", href: "/contact" },
];

