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

/** The fragmentation the manifesto names: each supplier optimizes its own number */
export const PILLARS = [
  {
    word: "Paid",
    line: "The ads agency reports clicks.",
  },
  {
    word: "Search",
    line: "The SEO agency reports traffic.",
  },
  {
    word: "Brand",
    line: "The studio reports consistency.",
  },
  {
    word: "Social",
    line: "The social team reports impressions.",
  },
];

export const PHASES = [
  {
    number: "1",
    name: "Diagnose",
    tagline: "Find where the system breaks",
    description:
      "One diagnostic across market, narrative, touchpoints, assets, distribution, and measurement: where you win, where you leak, and what to fix first.",
    outputs: ["System map", "Narrative & positioning read", "Search & channel baseline", "Priority roadmap"],
    ai: "AI visibility scan",
  },
  {
    number: "2",
    name: "Design",
    tagline: "Rebuild the story and the surfaces",
    description:
      "Positioning, messaging, identity, website, and the asset system designed together, so every relevant channel tells the same story.",
    outputs: ["Narrative & messaging", "Brand identity", "Website & landing pages", "Asset system"],
    ai: "Generative concepting",
  },
  {
    number: "3",
    name: "Deploy",
    tagline: "Launch on the channels that matter",
    description:
      "Ship to the channels that fit your market, not every channel there is, and wire the data underneath: analytics, CRM handoff, and attribution from day one.",
    outputs: ["Site build & QA", "Channel launch plan", "Tracking & attribution", "Launch PR"],
    ai: "Automation & agent wiring",
  },
  {
    number: "4",
    name: "Compound",
    tagline: "Measure, learn, reallocate",
    description:
      "Content, search, paid, and earned run as one program. Every quarter the numbers rewrite the brief, and the budget moves to the bottleneck.",
    outputs: ["Content engine", "Paid & search", "PR & reputation", "Quarterly reallocation"],
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
    metricLabel: "Qualified demand",
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
  { value: "3.2×", label: "Average lift in qualified demand" },
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
    a: "Every engagement starts with the Diagnostic, then runs our four-phase operating model: Diagnose, Design, Deploy, Compound. Most clients work with us as one integrated partnership covering narrative, creative, content, and distribution, with the mix reallocated as the bottleneck moves. Focused sprints (a rebrand, a website, a search push) run four to eight weeks.",
  },
  {
    q: "What does it cost?",
    a: "Partnerships are a monthly engagement scoped to the system you need, not a menu of line items. You are buying an external marketing department, so the work can move from web to film to search without a new contract. Focused sprints start in the low five figures. Every scope states what it should return, and quarterly reviews hold the work to it.",
  },
  {
    q: "How quickly will we see results?",
    a: "Perception shifts the day the new narrative and site ship. Demand signals, like the quality of who reaches out, search and AI visibility, and conversion, typically move within the first quarter. Programs are reviewed against your targets every quarter.",
  },
  {
    q: "How is this different from a full-service agency?",
    a: "We sell the integration, not the menu. A full-service agency puts many services under one roof; we run one narrative, one creative engine, one data layer, and one accountable team across every relevant channel you use. You stop managing ten suppliers who each optimize their own number.",
  },
  {
    q: "Do we need every channel?",
    a: "No. Every relevant channel, run as one system. Sometimes that is search and a founder voice; sometimes it is LinkedIn, events, and research. The Diagnostic decides the mix, and everything in it shares one narrative, one asset system, and one set of numbers.",
  },
  {
    q: "We already have an in-house team or agency. Where do you fit?",
    a: "Usually as the system owner. We diagnose and design the whole system, then either run lanes end to end or orchestrate your existing team and suppliers as the partner accountable for the outcome.",
  },
  {
    q: "Do you work with companies like ours?",
    a: "Our best fit is growth-stage companies, B2B and B2C, whose marketing has outgrown one person and fragmented across suppliers: Series A to C technology companies, consumer brands, and established businesses modernizing how they show up. The problem is the same in SaaS, fintech, consumer goods, healthcare, or professional services: everything works, and nothing works together.",
  },
  {
    q: "What exactly is the Diagnostic, and why is it free?",
    a: "The Plurel Distribution Diagnostic: a strategist scores six parts of your distribution system (market and category, narrative and positioning, website and touchpoints, assets and content, distribution across channels, and measurement) and returns a prioritized read within about a business day. It's free because it's the fastest way for both of us to see whether there's a real system to build.",
  },
  {
    q: "Who actually does the work?",
    a: "A senior Plurel team that owns the system: strategy, narrative, design, film, motion, web, and distribution in one team, drawing on Northeon's global delivery network. The people who diagnose your system are the people who run it.",
  },
];

export const NEXT_STEPS = [
  { title: "We reply in one business day", detail: "A first read from a person, not a pipeline." },
  { title: "A 30-minute strategy call", detail: "Where you stand, and what to fix first." },
  { title: "Your diagnostic & roadmap", detail: "Yours to keep, whatever you decide." },
];
