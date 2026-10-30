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

/* In the System's order, layer by layer (Narrative, Create, Distribute,
   Measure), so every list of them reads top to bottom the way the bands
   do, and on the homepage each layer's names leave the menu from its top,
   straight into their band */
const SERVICE_LIST = [
  ["Fractional CMO", "fractional-cmo", "A senior leader who owns the plan and the number.", "narrative"],
  ["Branding", "branding", "Look like the choice before you say a word.", "narrative"],
  ["Website Design", "website-design", "Every buyer meets it, and most judge you by it.", "create"],
  ["Content Marketing", "content-marketing", "Found by buyers long before they're ready.", "create"],
  ["Video & Photo", "video-photo", "One shoot, cut for every surface you need.", "create"],
  ["UGC & Creators", "ugc-creators", "Recommended by people your buyers already trust.", "create"],
  ["AI Search & SEO", "aeo-seo", "Be the answer, wherever the question is asked.", "distribute"],
  ["Paid Media", "paid-media", "Rent attention on purpose. Keep what it earns.", "distribute"],
  ["PR & Reputation", "pr-reputation", "What people say when you're not in the room.", "distribute"],
  ["Analytics & Martech", "analytics-martech", "The wiring nobody sees until it breaks.", "measure"],
] as const;

/**
 * The ten disciplines, in the System's order, each with its layer: the
 * ten companies a growing business usually hires, run here as one system.
 * Each is part of the engagements and can also be hired on its own.
 */
export const SERVICES = SERVICE_LIST.map(([name, slug, tagline, layer], i) => ({
  index: String(i + 1).padStart(2, "0"),
  name,
  slug,
  tagline,
  layer: layer as LayerKey,
  href: `/services/${slug}`,
}));

export type EngagementKey = "reach" | "reputation" | "mindshare" | "revenue";

/**
 * The four engagements, by what a company comes for (the homepage's What
 * you came for): each runs on all four layers. Wants mirror ENGAGEMENTS in
 * engagements.ts, which holds each page's copy.
 */
export const ENGAGEMENTS: readonly { key: EngagementKey; term: string; want: string; href: string }[] = [
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

