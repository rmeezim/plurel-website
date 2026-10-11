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
  /** Not shown until the essays carry real publication dates */
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

/**
 * Placeholder editorial content: swap for real articles when ready. Each
 * title says what its post actually contains, and no post claims a study,
 * a client or a result that does not exist.
 */
export const POSTS: Post[] = [
  {
    slug: "aeo-is-the-new-seo",
    category: "AI Search",
    cover: "ai-search",
    date: "Jun 12, 2026",
    readTime: "6 min read",
    title: "How AI assistants decide which companies to name",
    excerpt:
      "More buyers now ask an assistant instead of a search bar. What it weighs when it picks the companies it names, and how to check whether yours is one.",
    content: [
      {
        type: "p",
        text: "For twenty years, being found meant ranking: ten blue links, and a fight for the top three. That fight still matters, but it is no longer where every buying journey starts. A growing share of your customers now open a conversation instead of a results page, and ask an assistant what they should do.",
      },
      {
        type: "p",
        text: "When someone asks an AI assistant which firm to shortlist, the answer is a synthesis rather than a list of links: two or three names, with reasons. If your business is not in that answer, then for that customer you do not exist. Answer engine optimization (AEO) is the work of earning that place.",
      },
      { type: "h2", text: "What changed, and what didn't" },
      {
        type: "p",
        text: "Assistants read the same web your SEO built. What changes is the weighting. Keyword density and backlink volume matter less; being legible, verifiable and corroborated matters much more. The assistant is putting together a recommendation it can defend, and it prefers sources that make that easy.",
      },
      {
        type: "list",
        items: [
          "Entity consistency: your name, offer and location described the same way everywhere they appear",
          "Answer-shaped content: pages structured so a single section fully answers a single question",
          "Structured data: schema that tells machines what you are, as well as what you say",
          "Corroboration: press, reviews and directories that confirm your claims independently",
          "Freshness: dated, maintained pages that read as current",
        ],
      },
      {
        type: "quote",
        text: "An assistant names two or three companies. Make yours the easiest correct one to name.",
      },
      { type: "h2", text: "How to approach it" },
      {
        type: "p",
        text: "Start with a baseline: a fixed panel of buying-intent prompts, run across the major assistants and recorded. Then fix the entity layer, restructure the highest-intent pages into answerable sections, and build corroboration through PR and reviews. These are the same signals that make people trust you, written down for machines.",
      },
      {
        type: "p",
        text: "Measurement mirrors the setup: run the same prompt panel again every month. Track share of answer the way media teams track share of voice: which questions you appear in, how you're described, and who appears beside you.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Write down five ways a real customer would ask an assistant for what you sell. Ask them. If you are missing from the answers, that is the first thing to fix, and the clearest case for treating AI visibility as a channel of its own.",
      },
    ],
  },
  {
    slug: "brand-operating-system",
    category: "Brand Systems",
    cover: "brand-systems",
    date: "May 28, 2026",
    readTime: "5 min read",
    title: "The brand test: can your team ship without asking?",
    excerpt:
      "A logo is one file. A brand is the set of decisions that lets your team make a page, a post or a pitch that looks and sounds like you without checking first. The five parts, and how to keep them in use.",
    content: [
      {
        type: "p",
        text: "A logo is an artifact. A brand is the set of decisions behind every artifact: what it looks like, how it sounds and what it promises, made before anyone designs anything. Companies that treat brand as a file to apply stay consistent for a quarter. Companies that treat it as a set of working decisions get recognized for years.",
      },
      { type: "h2", text: "The five parts" },
      {
        type: "list",
        items: [
          "A voice: how you sound in a headline, an error message and an invoice",
          "Tokens: the exact colors, typefaces and spacing that make work recognizably yours",
          "Layouts: repeatable structures for the pages and posts you actually publish",
          "Proof: how results, clients and claims are presented and backed up",
          "Imagery: what gets photographed, illustrated or composed, and how",
        ],
      },
      {
        type: "p",
        text: "When the parts agree, every touchpoint adds to the same memory: the proposal echoes the website, the website echoes the deck, and by the third exposure a prospect recognizes you before they read your name.",
      },
      {
        type: "quote",
        text: "Consistency is how attention turns into memory. Every page that looks like you adds to it.",
      },
      { type: "h2", text: "Keeping it in use" },
      {
        type: "p",
        text: "A brand drifts unless someone looks after it. The fix is light: tokens live in one place, templates cover the 80% of output that recurs, and a one-page checklist gates anything public. The aim is to make the consistent thing the easy thing, so nobody has to police it.",
      },
      {
        type: "p",
        text: "If your team can produce a new page, post or pitch tomorrow without asking what it should look like, you have a brand. If they have to ask, you have a logo.",
      },
    ],
  },
  {
    slug: "presence-audit-12-signals",
    category: "Growth Strategy",
    cover: "growth-strategy",
    date: "May 9, 2026",
    readTime: "8 min read",
    title: "Twelve things buyers check before they get in touch",
    excerpt:
      "What prospects look at in the first minute or two, and how to score yourself honestly before they do.",
    content: [
      {
        type: "p",
        text: "Before anyone fills in your contact form or adds to cart, they check you out quietly. It takes a minute or two across three or four tabs, and you are not there to explain anything. The businesses that win treat that silent check as a checklist, and pass it on purpose.",
      },
      { type: "h2", text: "The twelve signals" },
      {
        type: "list",
        items: [
          "Site speed: does the first page land instantly, or stutter?",
          "Design currency: does it look maintained this year?",
          "Clarity of offer: can a stranger say what you do in one sentence?",
          "Proof: are there results with numbers, or only adjectives?",
          "Search presence: do you appear when they search the obvious phrase?",
          "AI answer presence: do assistants name you for your category?",
          "Reviews: recent, specific and answered?",
          "Press: has anyone independent ever written about you?",
          "Social recency: is the last post from this quarter or last year?",
          "Consistency: do your profiles agree on name, offer and tone?",
          "Pricing posture: is there any signal of how you charge?",
          "Responsiveness: does anything promise how fast you reply?",
        ],
      },
      {
        type: "p",
        text: "Score each signal 0, 1 or 2: absent, present or persuasive. If you land under 12 of 24, look at where the misses cluster. Common patterns are a strong product with no visible proof, good design with stale content, or great reviews with no search presence.",
      },
      {
        type: "quote",
        text: "Every signal is a question your customer never asks out loud.",
      },
      { type: "h2", text: "Sequencing the fixes" },
      {
        type: "p",
        text: "Fix in order of exposure rather than effort. Start with what your highest-intent visitors hit first (the site, the clarity of the offer, the proof), then the places people discover you: search, AI answers and reviews. A self-audit is depressing for about a week. After that it is a roadmap.",
      },
    ],
  },
  {
    slug: "minimum-viable-martech-stack",
    category: "Martech",
    cover: "martech",
    date: "Apr 22, 2026",
    readTime: "7 min read",
    title: "The smallest martech stack that still tells you what's working",
    excerpt:
      "Five layers and no shelfware: the least a growing company needs to measure, follow up and attribute, and the test a new tool has to pass.",
    content: [
      {
        type: "p",
        text: "Most growing companies have plenty of tools and too little connecting them. Licenses pile up, dashboards multiply, and the one question that matters, what is working, still takes a meeting to answer.",
      },
      { type: "h2", text: "The five-layer minimum" },
      {
        type: "list",
        items: [
          "Analytics you actually read: one property, one weekly view, owned by one person",
          "A CRM that holds every contact and deal, and that everyone treats as the record",
          "Email and automation: welcome, follow-up and nurture that run without anyone remembering",
          "Attribution basics: UTMs and a naming convention, used everywhere",
          "Content operations: one calendar, one home for assets, one publishing checklist",
        ],
      },
      {
        type: "p",
        text: "Notice what is missing: nothing exotic. The minimum stack is boring on purpose. Five tools that agree with each other do more than fifteen that don't.",
      },
      {
        type: "quote",
        text: "A small stack you trust beats a big stack you ignore.",
      },
      { type: "h2", text: "When to add" },
      {
        type: "p",
        text: "Add a tool when a job outgrows a spreadsheet, and never just because a vendor demo was impressive. If a workflow runs weekly, involves three or more people and breaks when someone is on holiday, it has earned software. Anything less has earned a template.",
      },
      {
        type: "p",
        text: "Wire this layer in before you scale spend, because good marketing leaks without it. A new site brings people in; the stack makes sure each lead is counted, answered, attributed and handed to sales the way sales wants it.",
      },
    ],
  },
  {
    slug: "reputation-compounds",
    category: "Reputation",
    cover: "reputation",
    date: "Apr 3, 2026",
    readTime: "6 min read",
    title: "Build your reputation before you need it",
    excerpt:
      "Rankings move, and ads stop when the budget does. A reputation keeps working as long as you look after it: four habits that keep press, reviews and proof coming in.",
    content: [
      {
        type: "p",
        text: "Most channels are rented. Rankings move with algorithms and ad costs move with auctions. A reputation, once earned, keeps working while you sleep. It is the slowest asset to build and the hardest for a competitor to copy, which is why it is worth starting early.",
      },
      { type: "h2", text: "Press, proof and reviews feed each other" },
      {
        type: "p",
        text: "Treated separately, each is a chore. Run together, they reinforce each other: coverage makes the next journalist comfortable, reviews back up the coverage, and AI assistants, which lean heavily on third-party confirmation, cite the whole archive back to your buyers.",
      },
      {
        type: "list",
        items: [
          "Collect proof every quarter: numbers, before-and-afters and quotes, while they're fresh",
          "Keep a review habit: ask at the moment of delight, and answer every review",
          "Keep one press story in development at all times, instead of a blast when news happens",
          "Maintain citations: directories and profiles that agree with each other",
        ],
      },
      {
        type: "quote",
        text: "Trust arrives on foot and leaves in a headline. Build the archive before you need it.",
      },
      {
        type: "p",
        text: "That is why it pays to keep at it. A single mention is a spike; a reputation you maintain is a floor that rises every quarter, under your pricing, your search presence and every pitch your team makes.",
      },
    ],
  },
  {
    slug: "structured-for-machines-written-for-people",
    category: "AI Search",
    cover: "ai-search",
    date: "Mar 18, 2026",
    readTime: "5 min read",
    title: "Write every section so it can be quoted alone",
    excerpt:
      "When an assistant uses your content, it lifts one section and shows it on its own. How to write sections that still make sense when that happens.",
    content: [
      {
        type: "p",
        text: "When an assistant answers with your content, it rarely sends the reader to your page. It lifts the useful part and presents it alone. That moves the unit of writing from the page to the section.",
      },
      { type: "h2", text: "A section has to stand alone" },
      {
        type: "p",
        text: "A section earns its place in an answer when it can stand alone: a claim, the evidence and a concrete example, all under one heading. If a paragraph only makes sense after the three above it, a machine will skip it, and so, more and more, will a skimming human.",
      },
      {
        type: "list",
        items: [
          "One idea per section, fully resolved before the next begins",
          "Put the answer first and the nuance after",
          "Name entities precisely: your company, product and place, rather than \"we\"",
          "Add schema so the structure is legible to machines as well as to readers",
          "Date your claims: undated advice reads as stale to machines and people alike",
        ],
      },
      {
        type: "quote",
        text: "If a paragraph can't be quoted alone, an assistant won't quote it at all.",
      },
      {
        type: "p",
        text: "This is the old discipline of clear technical writing, rewarded by a new channel. The brands that win AI search will be the ones whose content was worth quoting all along, and structured so the quoting is easy.",
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
