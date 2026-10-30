import type { Stat } from "@/components/instruments";
import type { QA } from "@/components/questions";
import { ENGAGEMENTS as NAV_ENGAGEMENTS, type LayerKey, type EngagementKey } from "@/lib/nav";

/*
  The four engagements (app/services/[slug]), named for what a company
  comes for: reach, reputation, mindshare and revenue. Each runs on all
  four layers of the Plurel System and is built from the disciplines;
  only the tuning differs. The homepage's What you came for reads the
  first part of each (want, stance, the four layer lines); the engagement
  page reads all of it. Terms, wants and links come from nav.ts, so the
  menu, the homepage and the pages never disagree.

  The measures on these pages are what we read (what each one is and how
  often), never results we claim; the published numbers that make each
  case are quoted within their source's scope, with the source linked. Copy rules (AGENTS.md): plain words, no
  triplet lists for rhythm, "every relevant channel", nothing promised
  that cannot be (coverage, virality).
*/

export type Metric = { name: string; what: string; when: string };

export type Engagement = {
  key: EngagementKey;
  term: string;
  want: string;
  href: string;
  /** Plurel's line on the want */
  stance: string;
  /** What each layer does for it, in the System's order (the homepage panel) */
  layers: readonly [string, string, string, string];
  /** The page's standfirst: who it is for and what it does */
  lead: string;
  /** The case, as a two-line head and the paragraph beside it */
  caseHead: readonly [string, string];
  caseBody: string;
  /** Published numbers that make the case, each with its source */
  numbers: readonly Stat[];
  /** The disciplines it is built from, by layer */
  uses: Record<LayerKey, readonly string[]>;
  /** What ships, how often, and the layer that makes it (the manifest) */
  deliverables: readonly { item: string; when: string; layer: LayerKey }[];
  /** The measures it answers to */
  metrics: readonly Metric[];
  /** The first ninety days */
  first90: readonly { when: string; what: string }[];
  questions: readonly QA[];
};

type Copy = Omit<Engagement, "key" | "term" | "want" | "href">;

const COPY: Record<EngagementKey, Copy> = {
  reach: {
    stance: "A viral moment is luck. Reach is a system that gives luck more chances.",
    layers: [
      "One idea short enough to travel, and true enough to survive the comments.",
      "Cut for creators and short-form: many versions of one story, made to be shared.",
      "Paid behind whatever is already moving, with search and AI answers ready for the people it reaches.",
      "Reach counted as a cause: we follow a spike into searches and into the one number.",
    ],
    lead: "For companies that need more of the right people to see them. One idea, cut for the places those people spend their time, put in front of them on purpose, and followed all the way to the number you run on.",
    caseHead: ["A viral moment is luck.", "Reach is a system."],
    caseBody:
      "Most of what gets posted travels nowhere, and the rare hit is hard to repeat. So we take many chances on purpose: one idea in many versions, in front of new people every week, and ready to be found when one of them lands.",
    numbers: [
      {
        figure: "1 in 4,000",
        text: "Sharing cascades on Twitter reached 100 people or more, in a study of about a billion sharing events. Most stop where they start.",
        source: "Goel, Anderson, Hofman & Watts, Management Science, 2016",
        url: "https://pubsonline.informs.org/doi/10.1287/mnsc.2015.2158",
      },
    ],
    uses: {
      narrative: ["branding"],
      create: ["content-marketing", "video-photo", "ugc-creators"],
      distribute: ["paid-media", "aeo-seo"],
      measure: ["analytics-martech"],
    },
    deliverables: [
      { item: "The Reach brief: one idea, and the hooks to test it with", when: "Each quarter", layer: "narrative" },
      { item: "15 to 20 cuts of the idea, for short-form and creators", when: "Weekly", layer: "create" },
      { item: "Creator briefs, with the rights settled before anyone films", when: "Weekly", layer: "create" },
      { item: "Paid behind the cuts the rules pick, the same day", when: "Daily", layer: "distribute" },
      { item: "Pages ready for search and AI answers before each push", when: "Each push", layer: "distribute" },
      { item: "The Ledger read: new people reached, earned share, search lift and the number", when: "Monthly", layer: "measure" },
    ],
    metrics: [
      { name: "New people reached", what: "People who saw you for the first time, by surface, with the overlap taken out.", when: "Monthly" },
      { name: "Earned share", what: "The part of that reach you didn’t pay for: shares, creators’ own audiences, press.", when: "Monthly" },
      { name: "Search lift", what: "Searches for your name and your category in the weeks after a moment.", when: "Weekly" },
      { name: "The one number", what: "What the reach turned into: orders, installs, demos or stockists.", when: "Monthly" },
    ],
    first90: [
      { when: "Week 1", what: "The Diagnostic, and the one number agreed." },
      { when: "Weeks 2 to 4", what: "The idea, the first cuts and the creator brief." },
      { when: "Weeks 4 to 8", what: "Live where your buyers spend their time, with paid behind whatever moves." },
      { when: "Weeks 8 to 12", what: "Keep what worked, cut the rest, and go again." },
    ],
    questions: [
      {
        q: "Can you make us go viral?",
        a: "No one can promise that honestly. We build the conditions for it: an idea that travels, many versions of it, and enough chances that luck has somewhere to land. When something takes off, your site, search and AI answers are ready for the people it brings.",
      },
      {
        q: "Do we need creators?",
        a: "Usually some. Creators reach people your ads can’t, and short-form travels best in their voices. We brief them from the Core Brief, so the story holds in every version.",
      },
      {
        q: "How soon will we see reach?",
        a: "The first pieces go live in the first month. Reach builds over the quarter as we keep what works and stop what doesn’t.",
      },
      {
        q: "What if reach doesn’t turn into anything?",
        a: "Then it isn’t working, and the Ledger shows it. We read reach as a cause of the one number, and move the budget when it isn’t paying.",
      },
    ],
  },
  reputation: {
    stance: "Press works when it says what everything else already says.",
    layers: [
      "The story a reporter can repeat in a sentence and a founder can tell on stage.",
      "Proof people can check, from original research to reviews worth reading.",
      "Press and podcasts, timed with the campaigns that make them findable.",
      "Mentions read as a cause: what they do to searches and to the one number.",
    ],
    lead: "For companies that need to be trusted before they’re tried. One story people can repeat, proof they can check, and coverage timed so your buyers find it when they look.",
    caseHead: ["Buyers check", "before they trust."],
    caseBody:
      "Before they buy, people read reviews, look for press and ask an assistant what others think. When each of those says something different, trust leaks. We give them one story to repeat and the proof behind it, then make sure every mention points the same way.",
    numbers: [
      {
        figure: "88%",
        text: "Of people across 15 countries say trusting a brand is an important or critical reason to buy, on a par with quality and value.",
        source: "Edelman Trust Barometer, special report, 2026",
        url: "https://www.edelman.com/trust/2026/trust-barometer/special-report-brands",
      },
      {
        figure: "270%",
        text: "Greater purchase likelihood for a product with five reviews than for one with none.",
        source: "Spiegel Research Center, Northwestern University, 2017",
        url: "https://spiegel.medill.northwestern.edu/how-online-reviews-influence-sales/",
      },
    ],
    uses: {
      narrative: ["branding"],
      create: ["content-marketing"],
      distribute: ["pr-reputation", "aeo-seo"],
      measure: ["analytics-martech"],
    },
    deliverables: [
      { item: "The story, in a sentence a reporter can repeat", when: "Each quarter", layer: "narrative" },
      { item: "Proof behind every claim, from original research to case material", when: "Each quarter", layer: "create" },
      { item: "Reviews asked for, read and answered", when: "Weekly", layer: "distribute" },
      { item: "Press and podcasts, pitched with the campaign that makes them findable", when: "Monthly", layer: "distribute" },
      { item: "Your facts kept the same everywhere AI answers read from", when: "Monthly", layer: "distribute" },
      { item: "The Ledger read: share of voice, reviews, answers and the number", when: "Monthly", layer: "measure" },
    ],
    metrics: [
      { name: "Share of voice", what: "Your mentions against your competitors’, in the press and the places your buyers read.", when: "Monthly" },
      { name: "Reviews", what: "Rating and volume where your buyers look, and how quickly you reply.", when: "Weekly" },
      { name: "Named in answers", what: "How often AI assistants name you, and what they say when they do.", when: "Monthly" },
      { name: "The one number", what: "What mentions do to searches for your name and to the number you run on.", when: "Monthly" },
    ],
    first90: [
      { when: "Week 1", what: "The Diagnostic: what people already say about you, and where." },
      { when: "Weeks 2 to 4", what: "The story, and the proof behind it: research, reviews and spokespeople ready." },
      { when: "Weeks 4 to 8", what: "Press and podcasts, timed with the campaigns that make them findable." },
      { when: "Weeks 8 to 12", what: "Read what moved, answer what didn’t, and plan the next story." },
    ],
    questions: [
      {
        q: "Do you guarantee coverage?",
        a: "No, and be wary of anyone who does. We earn it with a story worth repeating and proof worth checking, and we tell you what’s likely before we start.",
      },
      {
        q: "Do you manage reviews?",
        a: "We help you earn more of them and reply well, on the platforms your buyers use. We never buy or write reviews.",
      },
      {
        q: "Can you help in a crisis?",
        a: "Yes. We prepare the response, the spokespeople and the facts, and keep everything you say consistent while it runs.",
      },
      {
        q: "How do you measure reputation?",
        a: "As share of voice, reviews and what AI assistants say about you, each read against searches for your name and the one number.",
      },
    ],
  },
  mindshare: {
    stance: "People remember what they meet the same way, many times.",
    layers: [
      "One position, said the same way everywhere you show up.",
      "A look and a voice consistent enough to recognize in half a second.",
      "Present wherever the choice gets made, including the answers AI gives.",
      "Branded search and direct visits, read as the memory working.",
    ],
    lead: "For companies that need to be remembered when the moment to buy arrives. One position, a look and a voice people recognize in half a second, and a steady presence wherever the choice gets made.",
    caseHead: ["Memory fades.", "Repetition holds it."],
    caseBody:
      "Buyers choose from the few names that come to mind. Each time they meet you the same way, you get easier to recall; each time you look different, you start again. We keep you consistent and present, then read searches for your name as the memory working.",
    numbers: [
      {
        figure: "12 months",
        text: "How far a brand’s share of searches ran ahead of its market share, for UK car brands; six months for phones and three for energy.",
        source: "Les Binet, IPA, 2020",
        url: "https://ipa.co.uk/news/binet-presents-fast-cheap-predictive-share-of-search-metric",
      },
    ],
    uses: {
      narrative: ["branding"],
      create: ["content-marketing", "website-design", "video-photo"],
      distribute: ["paid-media", "aeo-seo"],
      measure: ["analytics-martech"],
    },
    deliverables: [
      { item: "One position, and the identity that carries it", when: "Once, then held", layer: "narrative" },
      { item: "Work in the same look and voice, on a steady rhythm", when: "Weekly", layer: "create" },
      { item: "Film and stills cut for every surface the plan uses", when: "Monthly", layer: "create" },
      { item: "Presence where the choice gets made, including AI answers", when: "Always on", layer: "distribute" },
      { item: "A consistency check of everything that ships", when: "Monthly", layer: "measure" },
      { item: "The Ledger read: share of search, direct visits and answers", when: "Monthly", layer: "measure" },
    ],
    metrics: [
      { name: "Share of search", what: "Searches for your name, as a share of searches for you and your competitors.", when: "Monthly" },
      { name: "Direct visits", what: "People who come straight to you, without an ad or a link.", when: "Weekly" },
      { name: "Named in answers", what: "How often AI assistants name you when asked about your category.", when: "Monthly" },
      { name: "Consistency", what: "How much of what ships each month follows the Core Brief and the identity.", when: "Monthly" },
    ],
    first90: [
      { when: "Week 1", what: "The Diagnostic: what people recall, and how consistent you are today." },
      { when: "Weeks 2 to 6", what: "The position and the identity, tightened or rebuilt where they need it." },
      { when: "Weeks 4 to 10", what: "A steady rhythm where your buyers choose, the same way every time." },
      { when: "Weeks 10 to 12", what: "Read share of search and direct visits, and set next quarter’s rhythm." },
    ],
    questions: [
      {
        q: "Isn’t this just brand awareness?",
        a: "Awareness is knowing you exist. Mindshare is being the name that comes to mind when the moment comes, and it shows in searches for your name and in direct visits.",
      },
      {
        q: "Do we need a rebrand?",
        a: "Usually not. Most companies need a sharper position and more consistency more than a new logo. The Diagnostic tells you which.",
      },
      {
        q: "How long does it take?",
        a: "Memory builds over months. Searches for your name usually start to move within a quarter if the rhythm holds.",
      },
    ],
  },
  revenue: {
    stance: "The first three are wasted if the last step leaks.",
    layers: [
      "The reasons to buy, in the words your buyers use.",
      "A site and a path to purchase built to convert, from first visit to checkout.",
      "Spend moved to whatever turns into orders, installs, demos or stockists.",
      "One number, agreed on day one, read every month.",
    ],
    lead: "For companies whose attention isn’t turning into enough of the number they run on. The path to purchase fixed first, the reasons to buy in your buyers’ words, and spend moved to whatever converts.",
    caseHead: ["Attention is wasted", "on a path that leaks."],
    caseBody:
      "Most buyers who start don’t finish: they meet a slow page, a missing reason or one step too many. We find where the path leaks, fix the steps that cost the most, and then move spend to whatever turns into orders, installs, demos or stockists.",
    numbers: [
      {
        figure: "70%",
        text: "Of online shopping carts are abandoned, on average, across 50 studies.",
        source: "Baymard Institute, 2025",
        url: "https://baymard.com/lists/cart-abandonment-rate",
      },
    ],
    uses: {
      narrative: ["branding"],
      create: ["website-design"],
      distribute: ["paid-media", "aeo-seo"],
      measure: ["analytics-martech"],
    },
    deliverables: [
      { item: "The reasons to buy, in your buyers’ own words", when: "Once, then tested", layer: "narrative" },
      { item: "The leaks fixed, costliest first: speed, reasons, the last steps", when: "Weekly", layer: "create" },
      { item: "Pages and paths tested against the one number", when: "Weekly", layer: "create" },
      { item: "Spend moved to what converts", when: "Weekly", layer: "distribute" },
      { item: "Measurement wired to the Ledger, by source", when: "First month", layer: "measure" },
      { item: "The Ledger read: the number by source, its cost and its payback", when: "Monthly", layer: "measure" },
    ],
    metrics: [
      { name: "The one number", what: "Orders, installs, demos or stockists, agreed on day one.", when: "Monthly" },
      { name: "Conversion by step", what: "Where buyers drop, from first visit to purchase, by source.", when: "Weekly" },
      { name: "Cost per number", what: "What each order, install, demo or stockist costs, by channel.", when: "Weekly" },
      { name: "Payback", what: "How long spend takes to come back as margin.", when: "Monthly" },
    ],
    first90: [
      { when: "Week 1", what: "The Diagnostic: where the path leaks, and what each leak costs." },
      { when: "Weeks 2 to 6", what: "The costliest leaks fixed first: speed, the reasons to buy, the last steps." },
      { when: "Weeks 4 to 10", what: "Spend moved to what converts, and measurement wired to the Ledger." },
      { when: "Weeks 10 to 12", what: "Read the number by source, and plan the next fixes." },
    ],
    questions: [
      {
        q: "Isn’t this just performance marketing?",
        a: "Performance marketing buys clicks. Revenue fixes what happens after the click first, then buys more of what converts, and reads all of it against one number.",
      },
      {
        q: "We already have an agency for ads.",
        a: "Keep them if they’re good. We fix the path and the measurement around them, and tell you plainly what their spend returns.",
      },
      {
        q: "How quickly does it pay back?",
        a: "Fixing a leaking path is often the fastest win in an engagement. The Diagnostic estimates what each fix is worth before we start.",
      },
    ],
  },
};

export const ENGAGEMENTS: readonly Engagement[] = NAV_ENGAGEMENTS.map((p) => ({ ...p, ...COPY[p.key] }));

export const engagementBySlug = (slug: string) => ENGAGEMENTS.find((p) => p.key === slug);

/** The engagements a discipline is part of, by its slug */
export const engagementsUsing = (slug: string) =>
  ENGAGEMENTS.filter((p) => Object.values(p.uses).some((list) => list.includes(slug)));
