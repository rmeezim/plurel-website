import type { QA } from "@/components/questions";
import { SERVICES, type LayerKey } from "@/lib/nav";

/*
  The eight disciplines, one page each (app/services/[slug]). Every page
  says what the discipline does inside the Plurel System: the layer it sits
  in, what it runs on and what it feeds, what you get, and how it is read
  in the Ledger. No borrowed statistics: a number on these pages is either
  the visitor's own (the one number) or absent. Names, taglines and layers
  come from nav.ts, so the menu, the footer and the pages never disagree.

  Copy rules (AGENTS.md): plain words, no triplet lists for rhythm, no
  "every channel", nothing promised that cannot be (coverage, virality).
*/

export type Discipline = {
  slug: string;
  name: string;
  tagline: string;
  layer: LayerKey;
  href: string;
  /** The standfirst: what it is, in the system's terms */
  lead: string;
  /** The job, in one sentence, set large */
  job: string;
  body: readonly [string, string];
  /** What you get */
  deliverables: readonly string[];
  /** What it takes from the rest of the system */
  runsOn: string;
  /** What it gives the rest of the system */
  feeds: string;
  /** What we read in the Ledger */
  signals: readonly string[];
  questions: readonly QA[];
};

type Copy = Omit<Discipline, "slug" | "name" | "tagline" | "layer" | "href">;

const COPY: Record<string, Copy> = {
  "website-design": {
    lead: "Ads, search, press, creators and AI answers all send people to your site. We design and build it as the home of the Asset System: cut from the Core Brief, and measured against the one number.",
    job: "Turn the attention everything else earns into the number you run on.",
    body: [
      "A site is judged before it is read. Buyers decide in seconds whether you look like the choice, then look for reasons to believe it, then for the shortest way to buy, book or ask. We design for all of that, in that order.",
      "Design and engineering run together, so the site ships fast and accessible, readable by people and by the machines that answer their questions, with measurement wired in from the first page.",
    ],
    deliverables: [
      "Page architecture built around how your buyers decide",
      "A design system your team can extend",
      "The build: fast, accessible and easy to edit",
      "Structured data that search and AI answers can read",
      "Paths to purchase, from first visit to checkout or booking",
      "Measurement wired to the Ledger",
    ],
    runsOn: "The Core Brief: the position, the proof and the voice every page is written from.",
    feeds: "The Surface Plan and the Ledger: every surface lands here, and every visit is counted against the one number.",
    signals: [
      "What visits turn into, by buyer and by source",
      "Speed and accessibility on the devices your buyers use",
      "Where buyers drop, page by page",
      "How search and AI answers describe you",
    ],
    questions: [
      {
        q: "Can you work with our existing site?",
        a: "Often, yes. The Diagnostic says whether the site needs rebuilding or fixing. Many engagements start by fixing the pages where buyers leak, then rebuild in phases.",
      },
      {
        q: "What do you build on?",
        a: "Whatever your team can run without us. We choose the platform for your business, not for our convenience, and hand everything over.",
      },
      {
        q: "How long does a new site take?",
        a: "A focused sprint takes four to eight weeks. Larger sites ship in phases, the pages that carry the most weight first.",
      },
    ],
  },
  "brand-identity": {
    lead: "Brand identity is how you look and sound wherever a buyer meets you. We build it as part of the Core Brief, so everything the system makes carries the same signal.",
    job: "Look like the choice before you say a word.",
    body: [
      "Buyers judge what they cannot yet test by the signals they can: how you look and sound, and whether it holds from one place to the next. An identity that holds up everywhere earns trust before the first conversation.",
      "We build identities to be used, not admired in a deck: a system of type, colour, layout and voice, with the templates and rules your team and every supplier can work from without asking.",
    ],
    deliverables: [
      "Positioning, and the message for each buyer",
      "Name, logo and visual identity, where they need work",
      "A type, colour and layout system",
      "The voice, and the words you use and avoid",
      "Templates for the formats you ship most",
      "Guidelines your team and suppliers can follow",
    ],
    runsOn: "The Diagnostic’s read of your market, your buyers and what already works.",
    feeds: "The Asset System: every page, film, ad and creator brief is cut from it.",
    signals: [
      "Recognition, read in branded search and direct visits",
      "Consistency in what ships each month",
      "How buyers describe you, in reviews and in AI answers",
    ],
    questions: [
      {
        q: "Do we need a full rebrand?",
        a: "Usually not. Most companies need sharper positioning and a consistent system more than a new logo. The Diagnostic tells you which.",
      },
      {
        q: "Who owns the work?",
        a: "You do. Every file, font licence and guideline is yours.",
      },
      {
        q: "Can you work with our in-house designers?",
        a: "Yes. We build the system so your team can use it, and we train them on it.",
      },
    ],
  },
  "aeo-seo": {
    lead: "Buyers ask assistants and search engines before they ever reach you. We make sure the answers name you and send people to the right page.",
    job: "Be the answer, wherever the question is asked.",
    body: [
      "Search used to be ten links. Now a buyer asks an assistant and gets one answer, built from the sources it trusts. Being in that answer rests on the same foundations as ranking, done more carefully: clear claims, real authority, pages a machine can read, and mentions in the places it checks.",
      "We run search and AI answers as one surface in the Surface Plan, fed by the Core Brief’s claims and the Asset System’s pages, and we read both in the Ledger.",
    ],
    deliverables: [
      "A map of the questions your buyers ask, by stage",
      "Pages and content built to be quoted",
      "Technical search and structured data",
      "Presence where assistants look, from reviews to directories",
      "A monthly read of what assistants say about you",
      "Search reporting tied to the one number",
    ],
    runsOn: "The Core Brief’s claims and the Asset System’s pages.",
    feeds: "The Ledger: searches and answers, counted as causes of the one number.",
    signals: [
      "Whether assistants name you for your category",
      "Where you rank for the questions that matter",
      "Visits from search and answers, by intent",
      "What those visits turn into",
    ],
    questions: [
      {
        q: "Is AI search different from SEO?",
        a: "It runs on the same foundations, with more weight on clear claims, authority and mentions elsewhere. We run the two together.",
      },
      {
        q: "How do you know what AI assistants say about us?",
        a: "We ask them, every month, the questions your buyers ask, and track who they name and cite.",
      },
      {
        q: "How long until it moves?",
        a: "Technical fixes show within weeks. Authority builds over months, which is why it runs as part of the partnership.",
      },
    ],
  },
  "content-marketing": {
    lead: "Content is how buyers find you long before they are ready to buy. We make it from the Core Brief, cut for the places they look, with creators and UGC run as part of the program.",
    job: "Be found by buyers long before they’re ready.",
    body: [
      "Most content fails because it is made for a calendar, not for a buyer. We start from the questions your buyers ask and the places they ask them, then make fewer, better pieces and cut each one many ways.",
      "Creators and UGC sit here too, briefed from the same story, so a creator’s video, an article and a product page say the same thing in their own way.",
    ],
    deliverables: [
      "A program built on your buyers’ questions",
      "Articles and research worth citing",
      "Film and short-form, cut from one shoot",
      "Creator and UGC programs, briefed from the Core Brief",
      "Newsletters and your own channels",
      "A library your team can reuse",
    ],
    runsOn: "The Core Brief, and the questions the Surface Plan ranks.",
    feeds: "The Surface Plan: every piece is made for a surface, and paid and press carry the best of it.",
    signals: [
      "What gets found, shared and cited",
      "Which pieces lead to the one number",
      "What a piece costs against what it earns",
      "What creators’ audiences do next",
    ],
    questions: [
      {
        q: "How much content do we need?",
        a: "Less than you might think. A few pieces made well and cut many ways do more than a busy calendar.",
      },
      {
        q: "Do you work with creators?",
        a: "Yes. We find, brief and manage creators and UGC, and paid puts money behind what works.",
      },
      {
        q: "Who writes it?",
        a: "Our team, from interviews with yours. Nothing ships without your sign-off.",
      },
    ],
  },
  "paid-ads": {
    lead: "Paid media rents attention. We run it inside the Surface Plan, so spend goes behind what already works and every dollar is read against the one number.",
    job: "Rent attention on purpose, and keep what it earns.",
    body: [
      "Paid works best when it amplifies something that already lands: a message that converts, a creator’s video that took off, a page that turns visits into orders. Run on its own, it buys cheap clicks and reports them as success.",
      "We plan, build and run paid search, social and creator amplification as one budget, moved each month to whatever the Ledger says is working.",
    ],
    deliverables: [
      "One budget across search, social and creators",
      "Ads built in sets from the Asset System",
      "Landing pages that match the ad",
      "Audiences built from your buyers",
      "Weekly tuning, monthly reallocation",
      "Spend reported against the one number, not clicks",
    ],
    runsOn: "The Asset System’s cuts and the Surface Plan’s order.",
    feeds: "The Ledger: spend against what it produced, by channel and by buyer.",
    signals: [
      "What a unit of the one number costs",
      "New customers against returning ones",
      "What paid adds beyond what would happen anyway",
      "Creative fatigue, read weekly",
    ],
    questions: [
      {
        q: "Can you take over our current accounts?",
        a: "Yes. We read them in the Diagnostic and keep what works.",
      },
      {
        q: "What budget do we need?",
        a: "Enough to learn. We size it in the Diagnostic against the number you run on, and say so if paid isn’t the first move.",
      },
      {
        q: "Do you charge a percentage of spend?",
        a: "No. The partnership is priced on the work, so we have no reason to spend more than you need.",
      },
    ],
  },
  "pr-reputation": {
    lead: "Reputation is what people say when you’re not in the room. We earn the press and reviews that tell the story your ads tell, and put them to work across the system.",
    job: "Be talked about, and believed.",
    body: [
      "Coverage that says something different from your site and ads confuses buyers, and coverage that never reaches them is wasted. We pitch the Core Brief’s story, in your founder’s voice, to the outlets and podcasts your buyers trust.",
      "Then the system uses it: quotes in the ads, citations for AI answers, reviews on the pages where buyers decide.",
    ],
    deliverables: [
      "A press story drawn from the Core Brief",
      "Media and podcast outreach",
      "Founder visibility, on stage and in print",
      "Review programs where buyers check",
      "Monitoring, and a plan for when things go wrong",
      "Coverage put to work across the system",
    ],
    runsOn: "The Core Brief’s story and its proof.",
    feeds: "The Asset System and the Surface Plan: quotes, citations and reviews that every other surface uses.",
    signals: [
      "Mentions in the outlets your buyers read",
      "Reviews, in number and in rating, where it matters",
      "Branded search after coverage",
      "Citations in AI answers",
    ],
    questions: [
      {
        q: "Do you guarantee coverage?",
        a: "No one honestly can. We guarantee the work: a story worth telling, and outreach to the people who would tell it.",
      },
      {
        q: "Can you handle a reputation problem?",
        a: "Yes. We monitor, respond, and build the record that outlasts it.",
      },
      {
        q: "Do we need a big launch?",
        a: "Rarely. Steady coverage that the rest of the system uses does more than one spike.",
      },
    ],
  },
  "creative-direction": {
    lead: "Creative direction keeps the work good, and the story the same everywhere. Someone with taste reviews everything the system makes against the Core Brief.",
    job: "Someone with taste in every review.",
    body: [
      "When marketing is spread across suppliers, nobody owns the whole impression. Each supplier’s work is fine on its own and inconsistent next to the others. A creative director owns the whole: the ideas, the look and the bar.",
      "We set the creative platform from the Core Brief, run the shoots, and review everything that ships, from a homepage to a creator’s script.",
    ],
    deliverables: [
      "The creative platform and the ideas behind it",
      "Campaign concepts, built to be cut",
      "Art direction for shoots and film",
      "Creator briefs and reviews",
      "A review of everything that ships",
      "Direction for your in-house team and suppliers",
    ],
    runsOn: "The Core Brief, and the Ledger’s read of what worked.",
    feeds: "The Asset System: everything is made, and reviewed, to one standard.",
    signals: [
      "Consistency in what ships",
      "Which ideas move the one number",
      "Creative fatigue, read in paid",
    ],
    questions: [
      {
        q: "Do we need this if we have a brand agency?",
        a: "If nobody reviews everything that ships, yes. We can direct alongside the suppliers you already have.",
      },
      {
        q: "Do you shoot?",
        a: "Yes. We plan and run shoots built to be cut into every format the system needs.",
      },
      {
        q: "Who is the creative director?",
        a: "A senior creative on your team from the Diagnostic on, not a name on the pitch.",
      },
    ],
  },
  "martech-consulting": {
    lead: "Martech is the wiring nobody sees until it breaks. We build the measurement behind the Ledger, so everyone reads the same number, and advise on the tools around it.",
    job: "One number everyone trusts, and the wiring behind it.",
    body: [
      "Most companies cannot say which spend produced last quarter’s results, because each tool reports its own version. We agree the one number in the Diagnostic, then wire analytics, your CRM or store, and the ad platforms so it is counted once, the same way, everywhere.",
      "Consulting sits here too: which tools you need, which you don’t, and how your team works with the system once it is running.",
    ],
    deliverables: [
      "The one number, defined with you, for each buyer",
      "Analytics and tracking, set up and checked",
      "Your CRM or store connected to the Ledger",
      "Attribution you can explain to a board",
      "A review of your tools: keep, cut or replace",
      "The monthly Ledger, read with you",
    ],
    runsOn: "Every other layer: it reads what they produce.",
    feeds: "Narrative and Distribute, every quarter: the brief and the plan are reset from what it reads.",
    signals: [
      "Whether the number is counted the same way everywhere",
      "Broken data, caught within a day",
      "Decisions made from the Ledger each month",
    ],
    questions: [
      {
        q: "Do we need new tools?",
        a: "Usually fewer. Most stacks have too many tools reporting different numbers. We cut before we add.",
      },
      {
        q: "Can you work with our CRM?",
        a: "Yes. We connect what you have, and say plainly if something needs replacing.",
      },
      {
        q: "What is the Ledger?",
        a: "A monthly read of the one number, the signals that moved it and where the budget goes next. You read it with us.",
      },
    ],
  },
};

/** The eight, in the site's order, each with its page copy */
export const DISCIPLINES: readonly Discipline[] = SERVICES.map((svc) => ({
  slug: svc.slug,
  name: svc.name,
  tagline: svc.tagline,
  layer: svc.layer,
  href: svc.href,
  ...COPY[svc.slug],
}));

export const disciplineBySlug = (slug: string) => DISCIPLINES.find((d) => d.slug === slug);
