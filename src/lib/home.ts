/*
  Homepage content. One source for the chapters in src/components/home/
  and the FAQ structured data.
*/

export const CLIENTS = [
  "Aurem",
  "Fence Labs",
  "Northgate Legal",
  "Mara Atelier",
  "Halden & Co",
  "Verra",
];

/** The four outcomes every engagement is accountable for */
export const PILLARS = [
  {
    word: "Found",
    line: "In search, in feeds, and in the answers AI assistants give.",
  },
  {
    word: "Trusted",
    line: "A brand and site that read as the premium option on sight.",
  },
  {
    word: "Chosen",
    line: "Proof, clarity, and a path to inquiry at every touchpoint.",
  },
  {
    word: "Remembered",
    line: "Content and reputation that compound quarter over quarter.",
  },
];

export const PHASES = [
  {
    number: "1",
    name: "Diagnose",
    tagline: "Know where you stand",
    description:
      "A presence audit across brand, website, search, and AI visibility: where you win, where you leak, and what to fix first.",
    outputs: ["Brand & presence audit", "Competitor map", "SEO / AEO baseline", "Growth gap report"],
    ai: "AI visibility scan",
  },
  {
    number: "2",
    name: "Design",
    tagline: "Build the visible layer",
    description:
      "Identity, website, and content systems designed as one coherent experience. Considered, premium, unmistakably yours.",
    outputs: ["Brand identity", "Website design", "Content architecture", "Creative direction"],
    ai: "Generative concepting",
  },
  {
    number: "3",
    name: "Deploy",
    tagline: "Launch and integrate",
    description:
      "Ship the new presence and wire the machinery underneath: analytics, CRM, automation, and attribution from day one.",
    outputs: ["Site build & QA", "Martech stack", "Tracking & attribution", "Launch PR"],
    ai: "Automation & agent wiring",
  },
  {
    number: "4",
    name: "Compound",
    tagline: "Turn presence into growth",
    description:
      "Always-on content, paid, and reputation programs that stack results quarter over quarter.",
    outputs: ["Content engine", "Paid media", "PR & reputation", "Quarterly strategy"],
    ai: "Predictive optimization",
  },
];

export type CaseScene = "red" | "ember" | "blush" | "night";

export const CASES: {
  name: string;
  accent: string;
  services: string;
  year: string;
  metric: string;
  metricLabel: string;
  before: string;
  built: string;
  after: string;
  scene: CaseScene;
}[] = [
  {
    name: "Aurem",
    accent: "premium on sight",
    services: "Brand identity, Web design",
    year: "2025",
    metric: "+212%",
    metricLabel: "Qualified inquiries",
    before: "Dated identity, unclear positioning",
    built: "Brand system, website",
    after: "Premium perception, higher-quality demand",
    scene: "red",
  },
  {
    name: "Northgate Legal",
    accent: "the answer in its category",
    services: "Website, AI search & SEO",
    year: "2024",
    metric: "+185%",
    metricLabel: "Search visibility",
    before: "Invisible in search, referral-only",
    built: "Website, AI search, content",
    after: "The first answer for its practice areas",
    scene: "night",
  },
  {
    name: "Fence Labs",
    accent: "category-distinct",
    services: "Packaging, Art direction",
    year: "2025",
    metric: "+64%",
    metricLabel: "DTC conversion",
    before: "Generic shelf presence, no story",
    built: "Brand, packaging, launch",
    after: "Category-distinct, stronger conversion",
    scene: "blush",
  },
  {
    name: "Mara Atelier",
    accent: "a loyal audience",
    services: "Brand identity, Content",
    year: "2024",
    metric: "2.6×",
    metricLabel: "Email-driven revenue",
    before: "Flat brand, weak retention",
    built: "Brand, content, email system",
    after: "Loyal audience, compounding revenue",
    scene: "ember",
  },
];

export const STATS = [
  { value: "3.2×", label: "Average lift in qualified inquiries" },
  { value: "+64%", label: "Average conversion-rate improvement" },
  { value: "+185%", label: "Organic & AI-search visibility gained" },
  { value: "0.9s", label: "Median page load after rebuild" },
];

export const VOICES = [
  {
    quote: "Within a quarter, prospects stopped asking who we were.",
    name: "Amelia Hart",
    role: "Managing Partner, Northgate Legal",
  },
  {
    quote: "The rebrand changed how the market reads us, instantly.",
    name: "Elena Voss",
    role: "CEO, Aurem",
  },
  {
    quote: "The rebrand paid for itself before the campaign finished.",
    name: "Daniel Okafor",
    role: "Founder, Fence Labs",
  },
];

export const FAQS = [
  {
    q: "What does a typical engagement look like?",
    a: "Every engagement runs our four-phase operating model: Diagnose, Design, Deploy, Compound. Focused sprints (a rebrand, a website, an AI-search push) run four to eight weeks. Full growth transformations typically run a quarter, then move into an always-on program.",
  },
  {
    q: "What does it cost?",
    a: "Focused sprints start in the low five figures. Full transformations are scoped after the Growth Audit, so you are pricing a defined system rather than open-ended hours. Every scope states what it should return, and quarterly reviews hold the work to it.",
  },
  {
    q: "How quickly will we see results?",
    a: "Perception shifts the day the new presence ships. Pipeline signals, like inquiry quality, search and AI visibility, and conversion, typically move within the first quarter. Programs are reviewed against your targets every quarter.",
  },
  {
    q: "Do you work with companies like ours?",
    a: "Our best fit is founder-led B2B, professional services, and premium consumer brands that win on trust. Stage matters less than ambition: if presence is holding your growth back and you want a system rather than a facelift, we should talk.",
  },
  {
    q: "We already have an in-house team or agency. Where do you fit?",
    a: "Usually as the systems layer. We diagnose and design the growth system, then either run defined lanes end to end (AI search, content engine, reputation) or work with your existing team as the partner accountable for outcomes.",
  },
  {
    q: "What exactly is the Growth Audit, and why is it free?",
    a: "A strategist reviews six dimensions of your presence (brand clarity, website conversion, AI search visibility, content authority, campaign readiness, and your martech foundation) and returns a prioritized read within about a business day. It's free because it's the fastest way for both of us to see whether there's a real system to build.",
  },
  {
    q: "Who actually does the work?",
    a: "A senior Plurel team, drawing on Northeon's global delivery network: strategy, design, engineering, and martech under one roof. The people who scope your system are the people who build it.",
  },
];

export const NEXT_STEPS = [
  { title: "We reply in one business day", detail: "A first read from a person, not a pipeline." },
  { title: "A 30-minute strategy call", detail: "Where you stand, and what to fix first." },
  { title: "Your audit & roadmap", detail: "Yours to keep, whatever you decide." },
];
