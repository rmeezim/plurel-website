export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

export type PostCategory =
  | "AI Search"
  | "Brand Systems"
  | "Growth Strategy"
  | "Martech"
  | "Reputation";

export type CoverKind =
  | "ai-search"
  | "brand-systems"
  | "growth-strategy"
  | "martech"
  | "reputation";

export interface Post {
  slug: string;
  category: PostCategory;
  cover: CoverKind;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  content: PostBlock[];
}

export const CATEGORIES: PostCategory[] = [
  "AI Search",
  "Brand Systems",
  "Growth Strategy",
  "Martech",
  "Reputation",
];

/** Placeholder editorial content — swap for real articles when ready. */
export const POSTS: Post[] = [
  {
    slug: "aeo-is-the-new-seo",
    category: "AI Search",
    cover: "ai-search",
    date: "Jun 12, 2026",
    readTime: "6 min read",
    title: "AEO is the new SEO: how to get chosen by AI assistants",
    excerpt:
      "Customers increasingly ask an assistant instead of a search bar. Here's how to become the answer it gives — and what that changes about content, structure, and proof.",
    content: [
      {
        type: "p",
        text: "For twenty years, being found meant ranking: ten blue links, and a fight for the top three. That fight still matters — but it is no longer where the buying journey starts. A growing share of your customers now open a conversation instead of a results page, and ask an assistant what they should do.",
      },
      {
        type: "p",
        text: "When someone asks an AI assistant which firm to shortlist, the answer is not a list of links. It is a synthesis — two or three names, with reasons. Either your business is in that answer, or, for that customer, you do not exist. Answer Engine Optimization (AEO) is the discipline of earning that place.",
      },
      { type: "h2", text: "What changed — and what didn't" },
      {
        type: "p",
        text: "Assistants read the same web your SEO built. What changes is the weighting. Keyword density and backlink volume matter less; being legible, verifiable, and corroborated matters much more. The assistant is not ranking pages — it is assembling a defensible recommendation, and it prefers sources that make that easy.",
      },
      {
        type: "list",
        items: [
          "Entity consistency — your name, offer, and location described identically everywhere they appear",
          "Answer-shaped content — pages structured so a single section fully resolves a single question",
          "Structured data — schema that tells machines what you are, not just what you say",
          "Corroboration — press, reviews, and directories that independently confirm your claims",
          "Freshness — dated, maintained pages that read as current, not archival",
        ],
      },
      {
        type: "quote",
        text: "Assistants don't rank pages. They choose answers. Your job is to be the easiest correct answer to give.",
      },
      { type: "h2", text: "The playbook we run" },
      {
        type: "p",
        text: "Every engagement starts with a baseline: a fixed panel of buying-intent prompts, run across the major assistants, recorded. Then we fix the entity layer, restructure the highest-intent pages into answerable units, and build corroboration through PR and reviews — the same signals that make humans trust you, formalized for machines.",
      },
      {
        type: "p",
        text: "Measurement mirrors the setup: the same prompt panel, re-run monthly. We track share-of-answer the way media teams track share-of-voice — which queries you appear in, how you're described, and who appears beside you.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Write down five ways a real customer would ask an assistant for what you sell. Ask them. If you are absent from the answers, that is the first line of your growth audit — and the clearest case for treating AI visibility as a first-class channel rather than an afterthought.",
      },
    ],
  },
  {
    slug: "brand-operating-system",
    category: "Brand Systems",
    cover: "brand-systems",
    date: "May 28, 2026",
    readTime: "5 min read",
    title: "Your brand isn't a logo — it's an operating system",
    excerpt:
      "The difference between companies that look consistent and companies that compound: treating brand as a system of decisions, not a folder of assets.",
    content: [
      {
        type: "p",
        text: "A logo is an artifact. A brand is the system that decides what every artifact looks like, sounds like, and promises — before anyone designs anything. Companies that treat brand as a file to be applied get consistency for a quarter. Companies that treat it as an operating system compound recognition for years.",
      },
      { type: "h2", text: "The system has parts" },
      {
        type: "list",
        items: [
          "A voice — how you sound in a headline, an error message, and an invoice",
          "Tokens — the exact colors, faces, and spacing that make work recognizably yours",
          "Layouts — repeatable structures for the pages and posts you actually publish",
          "Proof — how results, clients, and claims are presented and substantiated",
          "Imagery — what gets photographed, illustrated, or composed, and how",
        ],
      },
      {
        type: "p",
        text: "When the parts agree, every touchpoint deposits into the same account: the proposal echoes the website, the website echoes the deck, and by the third exposure a prospect recognizes you before they read your name.",
      },
      {
        type: "quote",
        text: "Consistency isn't aesthetic discipline. It's compounding interest on attention.",
      },
      { type: "h2", text: "Operating, not owning" },
      {
        type: "p",
        text: "Systems drift without governance. The fix is lightweight: tokens live in one place, templates cover the recurring 80% of output, and a one-page checklist gates anything public. The goal is not policing — it is making the consistent thing the easy thing.",
      },
      {
        type: "p",
        text: "If your team can produce a new page, post, or pitch tomorrow without asking what it should look like, you have a brand system. If they have to ask, you have a logo.",
      },
    ],
  },
  {
    slug: "presence-audit-12-signals",
    category: "Growth Strategy",
    cover: "growth-strategy",
    date: "May 9, 2026",
    readTime: "8 min read",
    title: "The presence audit: 12 signals customers judge before they call",
    excerpt:
      "What prospects actually check in the first ninety seconds — and how to score yourself honestly before they do.",
    content: [
      {
        type: "p",
        text: "Before anyone fills in your contact form, they audit you silently. It takes about ninety seconds, it happens across three or four tabs, and you are not in the room to explain anything. The businesses that win treat that invisible audit as a checklist — and pass it on purpose.",
      },
      { type: "h2", text: "The twelve signals" },
      {
        type: "list",
        items: [
          "Site speed — does the first page land instantly, or stutter?",
          "Design currency — does it look maintained this year?",
          "Clarity of offer — can a stranger say what you do in one sentence?",
          "Proof — are there results with numbers, or only adjectives?",
          "Search presence — do you appear when they search the obvious phrase?",
          "AI answer presence — do assistants name you for your category?",
          "Reviews — recent, specific, and responded to?",
          "Press — has anyone independent ever written about you?",
          "Social recency — is the last post from this quarter or last year?",
          "Consistency — do your profiles agree on name, offer, and tone?",
          "Pricing posture — is there any signal of how you charge?",
          "Responsiveness — does anything promise how fast you reply?",
        ],
      },
      {
        type: "p",
        text: "Score each signal 0, 1, or 2 — absent, present, or persuasive. Most companies we audit score under 12 of 24, and the misses cluster: strong product, invisible proof; good design, stale content; great reviews, no search presence.",
      },
      {
        type: "quote",
        text: "Every signal is a question your customer never asks out loud.",
      },
      { type: "h2", text: "Sequencing the fixes" },
      {
        type: "p",
        text: "Fix in order of exposure, not effort: the signals your highest-intent visitors hit first — site, offer clarity, proof — then the discovery layer of search, AI answers, and reviews. A presence audit is only depressing for a week; after that it is a roadmap.",
      },
    ],
  },
  {
    slug: "minimum-viable-martech-stack",
    category: "Martech",
    cover: "martech",
    date: "Apr 22, 2026",
    readTime: "7 min read",
    title: "The minimum viable martech stack for a premium brand",
    excerpt:
      "Five layers, no shelfware: the smallest set of tools that lets a brand measure, follow up, and compound.",
    content: [
      {
        type: "p",
        text: "Most growing companies do not have a tooling gap — they have a tooling surplus and an integration gap. Licenses accumulate, dashboards multiply, and somehow the one question that matters — what is working? — still takes a meeting to answer.",
      },
      { type: "h2", text: "The five-layer minimum" },
      {
        type: "list",
        items: [
          "Analytics you actually read — one property, one weekly view, owned by one person",
          "A CRM as the single source of truth for every contact and deal",
          "Email and automation — welcome, follow-up, and nurture that run without anyone remembering",
          "Attribution basics — UTMs and a naming convention, enforced everywhere",
          "Content operations — one calendar, one asset home, one publish checklist",
        ],
      },
      {
        type: "p",
        text: "Notice what is missing: nothing exotic. The minimum stack is boring on purpose. Integration beats features — five tools that agree with each other outperform fifteen that don't, every time.",
      },
      {
        type: "quote",
        text: "A small stack you trust beats a big stack you ignore.",
      },
      { type: "h2", text: "When to add" },
      {
        type: "p",
        text: "Add a tool when a motion outgrows a spreadsheet — not when a vendor demo is impressive. If a workflow runs weekly, involves three or more people, and breaks when someone is on holiday, it has earned software. Anything less has earned a template.",
      },
      {
        type: "p",
        text: "We wire this layer into every transformation because presence without plumbing leaks: the redesign brings the inquiries, and the stack makes sure each one is counted, answered, and attributed.",
      },
    ],
  },
  {
    slug: "reputation-compounds",
    category: "Reputation",
    cover: "reputation",
    date: "Apr 3, 2026",
    readTime: "6 min read",
    title: "Reputation compounds: turning press and proof into a moat",
    excerpt:
      "Rankings fluctuate and ads stop when the budget does. Reputation is the one growth asset that only appreciates — if you maintain it like one.",
    content: [
      {
        type: "p",
        text: "Every other channel you rent. Rankings move with algorithms, ad costs move with auctions — but reputation, once earned, keeps working while you sleep. It is the slowest asset to build and the hardest for a competitor to copy, which is exactly why it makes the best moat.",
      },
      { type: "h2", text: "Press, proof, and reviews are one system" },
      {
        type: "p",
        text: "Treated separately, each is a chore. Treated as one system, they feed each other: coverage makes the next journalist comfortable, reviews corroborate the coverage, and AI assistants — which lean heavily on third-party confirmation — cite the whole archive back to your buyers.",
      },
      {
        type: "list",
        items: [
          "Harvest proof quarterly — numbers, before/afters, and quotes, while they're fresh",
          "Run a review cadence — ask at the moment of delight, respond to everything",
          "Keep a press pipeline — one story in development at all times, not a blast when news happens",
          "Maintain citations — directories and profiles that agree with each other, everywhere",
        ],
      },
      {
        type: "quote",
        text: "Trust arrives on foot and leaves in a headline — build the archive before you need it.",
      },
      {
        type: "p",
        text: "The compounding is the point. A single mention is a spike; a maintained reputation layer is a floor that rises every quarter — under your pricing, your search presence, and every pitch your team makes.",
      },
    ],
  },
  {
    slug: "structured-for-machines-written-for-people",
    category: "AI Search",
    cover: "ai-search",
    date: "Mar 18, 2026",
    readTime: "5 min read",
    title: "Structured for machines, written for people",
    excerpt:
      "AI assistants quote sections, not sites. A field guide to writing content that survives being lifted out of context.",
    content: [
      {
        type: "p",
        text: "When an assistant answers with your content, it does not send the reader to your page — it lifts the useful part and presents it alone. That changes the unit of writing. The page is no longer the product; the section is.",
      },
      { type: "h2", text: "The unit of answerability" },
      {
        type: "p",
        text: "A section earns its place in an answer when it can stand alone: a claim, the evidence, and a concrete example, all inside one heading. If understanding a paragraph requires the three above it, a machine will skip it — and so, increasingly, will a skimming human.",
      },
      {
        type: "list",
        items: [
          "One idea per section, resolved fully before the next begins",
          "Front-load the answer; put the nuance after, not before",
          "Name entities precisely — your company, product, and place, not \"we\"",
          "Add schema so the structure is machine-legible, not just visual",
          "Date your claims — undated advice reads as stale to machines and people alike",
        ],
      },
      {
        type: "quote",
        text: "If a paragraph can't be quoted alone, an assistant won't quote it at all.",
      },
      {
        type: "p",
        text: "None of this is writing for robots. It is the old discipline of clear technical writing, rewarded by a new distribution channel. The brands that win AI search will be the ones whose content was worth quoting all along — structured so the quoting is effortless.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((post) => post.slug === slug);
}

export function getRelatedPosts(slug: string, count = 2): Post[] {
  const current = getPost(slug);
  if (!current) return POSTS.slice(0, count);
  const others = POSTS.filter((post) => post.slug !== slug);
  // Prefer different categories so related reads broaden the picture
  const different = others.filter((post) => post.category !== current.category);
  return [...different, ...others].slice(0, count);
}
