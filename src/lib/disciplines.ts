import type { Measure, Stat } from "@/components/instruments";
import type { QA } from "@/components/questions";
import { SERVICES, type LayerKey } from "@/lib/nav";

/*
  The eight disciplines, the individual services, one page each
  (app/services/[slug]). Every page tells one story: the job, the case for
  it (with published numbers, each with its source), how it works inside
  the Plurel System (the page's drawing and its readout), what you get,
  the measures it answers to, where it sits, and its questions. Names,
  taglines and layers come from nav.ts, so the menu, the footer and the
  pages never disagree.

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
  /** What the drawing shows, step by step */
  readout: readonly [string, string, string];
  /** The measures it answers to, read in the Ledger */
  metrics: readonly Measure[];
  /** Published numbers that make the case, each with its source */
  numbers?: readonly Stat[];
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
    readout: [
      "Every surface sends people to the same place: ads, search, AI answers, press and creators.",
      "The site takes them from a first look to proof to purchase, in the order buyers decide.",
      "What arrives is counted once, as the one number, by where it came from.",
    ],
    metrics: [
      { name: "Conversion by source", what: "What visits turn into, by where they came from and which buyer they are.", when: "Weekly" },
      { name: "Speed", what: "How fast pages load and respond on the phones your buyers use, against Google’s Core Web Vitals.", when: "Weekly" },
      { name: "Drop-off", what: "Where buyers leave, page by page, on the way to purchase.", when: "Weekly" },
      { name: "Readable by machines", what: "Whether search engines and AI assistants can read and quote each page.", when: "Monthly" },
    ],
    numbers: [
      {
        figure: "8.4%",
        text: "More retail conversions after a mobile site got 0.1 seconds faster on every page on the way to purchase, in a study of 37 brands.",
        source: "Deloitte for Google, Milliseconds Make Millions, 2020",
        url: "https://www.deloitte.com/ie/en/services/consulting/research/milliseconds-make-millions.html",
      },
      {
        figure: "2.5 s",
        text: "The time within which Google expects a page’s main content to appear, for three in four real visits, to rate it good.",
        source: "Google, Core Web Vitals, web.dev",
        url: "https://web.dev/articles/vitals",
      },
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
    readout: [
      "Your buyers meet you on many surfaces, often for a second or two.",
      "The same signal sits in the same place on every one of them: type, colour, layout and voice.",
      "Each meeting is recognized faster, so every surface spends less effort being remembered.",
    ],
    metrics: [
      { name: "Share of search", what: "Searches for your name, as a share of searches for you and your competitors.", when: "Monthly" },
      { name: "Consistency", what: "How much of what ships each month follows the identity, checked in review.", when: "Monthly" },
      { name: "How you’re described", what: "The words buyers use about you, in reviews and in what AI assistants say.", when: "Quarterly" },
      { name: "Speed to ship", what: "How quickly your team and suppliers make new work without asking.", when: "Monthly" },
    ],
    numbers: [
      {
        figure: "50 ms",
        text: "Enough for people to judge how a web page looks: in lab studies, a 50 ms glimpse matched their verdict after ten times as long.",
        source: "Lindgaard et al., Behaviour & Information Technology, 2006",
        url: "https://www.tandfonline.com/doi/abs/10.1080/01449290500330448",
      },
      {
        figure: "40%",
        text: "Of category buyers, on average, linked a brand’s shapes, such as its logo or pack, to the brand. For its colours, 12%. Across 1,162 assets in 21 categories.",
        source: "Phua, Bali, Anesbury & Sharp, International Journal of Advertising, 2026",
        url: "https://www.tandfonline.com/doi/full/10.1080/02650487.2026.2637295",
      },
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
    readout: [
      "A buyer asks a question, and an assistant answers it with a few names.",
      "It builds the answer from the sources it trusts: your site, reviews, press, directories and forums.",
      "We make each of those sources say the same clear thing, so the answer names you.",
    ],
    metrics: [
      { name: "Share of answers", what: "How often AI assistants name you when asked the questions your buyers ask.", when: "Monthly" },
      { name: "Rankings that matter", what: "Where you rank for the questions tied to the one number, not for vanity terms.", when: "Weekly" },
      { name: "Visits by intent", what: "Visits from search and from AI answers, by the question that brought them.", when: "Weekly" },
      { name: "What they turn into", what: "The share of those visits that becomes the one number.", when: "Monthly" },
    ],
    numbers: [
      {
        figure: "68%",
        text: "Of US Google searches ended without a click in the first four months of 2026.",
        source: "SparkToro, from Similarweb data, 2026",
        url: "https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/",
      },
      {
        figure: "8%",
        text: "Of visits in which Google users clicked a traditional result when an AI summary appeared, against 15% when none did.",
        source: "Pew Research Center, 2025",
        url: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
      },
      {
        figure: "94%",
        text: "Of business buyers say they use AI during their buying process, up from 89% the year before.",
        source: "Forrester, The State of Business Buying, 2026",
        url: "https://www.forrester.com/blogs/state-of-business-buying-2026/",
      },
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
    readout: [
      "One story, from the Core Brief, made once and made well.",
      "Cut into what each place needs: articles, film, clips, posts, newsletters and creator kits.",
      "Each cut is made for a surface, so it is found where buyers already look.",
    ],
    metrics: [
      { name: "Found and cited", what: "What gets found in search, shared, and cited by AI assistants.", when: "Monthly" },
      { name: "Assists", what: "Which pieces people read before they become the one number.", when: "Monthly" },
      { name: "Cost per piece", what: "What each piece costs, against what it earns over time.", when: "Quarterly" },
      { name: "Creator reach", what: "What creators’ audiences do next: search, visit or buy.", when: "Monthly" },
    ],
    numbers: [
      {
        figure: "88%",
        text: "Of people trust recommendations from people they know more than any other source, in a study of over 40,000 people worldwide.",
        source: "Nielsen, Trust in Advertising, 2021",
        url: "https://www.nielsen.com/insights/2021/beyond-martech-building-trust-with-consumers-and-engaging-where-sentiment-is-high/",
      },
      {
        figure: "95%",
        text: "Of business buyers aren’t in the market at any given time, by a rule-of-thumb estimate: content has to reach them long before they are.",
        source: "Ehrenberg-Bass Institute for LinkedIn’s B2B Institute, 2021",
        url: "https://business.linkedin.com/advertise/resources/b2b-institute/b2b-research/trends/95-5-rule",
      },
      {
        figure: "73%",
        text: "Of decision-makers say a company’s thought leadership is a more trustworthy way to judge its capabilities than its marketing materials.",
        source: "Edelman and LinkedIn, B2B Thought Leadership Impact Report, 2024",
        url: "https://www.edelman.com/sites/g/files/aatuss191/files/2024-02/_2024%20Edelman-LinkedIn%20B2B%20Thought%20Leadership%20Impact%20Report%20Final.pdf",
      },
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
    readout: [
      "Every surface and every creative starts with a share of one budget.",
      "Each week, spend moves toward whatever turns into the one number.",
      "What doesn’t work gets less each week, until it is cut.",
    ],
    metrics: [
      { name: "Cost per number", what: "What one order, install, demo or stockist costs, by channel.", when: "Weekly" },
      { name: "Incremental lift", what: "What paid adds beyond what would have happened anyway, tested rather than assumed.", when: "Quarterly" },
      { name: "New against returning", what: "How much spend reaches new customers rather than people already coming back.", when: "Monthly" },
      { name: "Creative fatigue", what: "When an ad stops working, caught before it wastes budget.", when: "Weekly" },
    ],
    numbers: [
      {
        figure: "60:40",
        text: "The most effective average split between building the brand and driving sales now, across the IPA’s effectiveness data. For B2B brands, 46:54.",
        source: "Binet & Field, The Long and the Short of It, IPA, 2013",
        url: "https://ipa.co.uk/media/5811/long_and_short_of_it_presentation_final.pdf",
      },
      {
        figure: "+0.7",
        text: "Points of yearly market-share growth associated with every 10 points of excess share of voice, for B2B brands; 0.6 for consumer brands.",
        source: "Binet & Field, for LinkedIn’s B2B Institute, 2019",
        url: "https://www.linkedin.com/business/marketing/blog/linkedin-ads/the-b2b-marketers-guide-to-the-share-of-voice-rule",
      },
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
    readout: [
      "It starts with one story worth repeating, and the proof behind it.",
      "Press and podcasts carry it first; reviews and creators echo it.",
      "The echo reaches the places buyers check last: search and AI answers.",
    ],
    metrics: [
      { name: "Share of voice", what: "Your mentions against your competitors’, in the outlets your buyers read.", when: "Monthly" },
      { name: "Reviews", what: "Rating and volume where buyers check, and how quickly you reply.", when: "Weekly" },
      { name: "Search after coverage", what: "Searches for your name in the weeks after a story runs.", when: "Weekly" },
      { name: "Cited in answers", what: "How often AI assistants cite the coverage when they describe you.", when: "Monthly" },
    ],
    numbers: [
      {
        figure: "270%",
        text: "Greater purchase likelihood for a product with five reviews than for one with none.",
        source: "Spiegel Research Center, Northwestern University, 2017",
        url: "https://spiegel.medill.northwestern.edu/how-online-reviews-influence-sales/",
      },
      {
        figure: "97%",
        text: "Of US consumers read online reviews for local businesses, and 41% always do.",
        source: "BrightLocal, Local Consumer Review Survey, 2026",
        url: "https://www.brightlocal.com/research/local-consumer-review-survey/",
      },
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
    readout: [
      "Many directions, drafted fast: this is where machines help.",
      "A creative director keeps one, and says why.",
      "That one direction runs through every format, from film to the pack.",
    ],
    metrics: [
      { name: "Consistency", what: "How much of what ships holds to the platform, checked in every review.", when: "Monthly" },
      { name: "Ideas that work", what: "Which creative ideas lead to the one number, read across channels.", when: "Monthly" },
      { name: "Creative fatigue", what: "When an idea stops working in paid, so the next one is ready.", when: "Weekly" },
      { name: "Time to sign-off", what: "How long work takes from first draft to approval.", when: "Monthly" },
    ],
    numbers: [
      {
        figure: "49%",
        text: "Of the extra sales advertising drives comes from creative quality, ahead of brand (21%), reach (14%) and targeting (11%), across nearly 450 consumer-goods campaigns.",
        source: "NCSolutions, Five Keys to Advertising Effectiveness, 2023",
        url: "https://info.ncsolutions.com/hubfs/2023%20Five%20Keys%20to%20Advertising%20Effectiveness/NCS_Five_Keys_to_Advertising_Effectiveness_E-Book_08-23.pdf",
      },
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
    readout: [
      "Your site, store, ads, email and reviews each count in their own way.",
      "The Ledger reconciles them into one set of numbers, read the same way every month.",
      "Out comes one number everyone trusts, and the wiring that keeps it true.",
    ],
    metrics: [
      { name: "One definition", what: "Whether the number is counted the same way in every tool and report.", when: "Monthly" },
      { name: "Data health", what: "Broken tracking and missing data, caught within a day.", when: "Daily" },
      { name: "Tools that earn their cost", what: "Which tools pay for themselves, and which can go.", when: "Quarterly" },
      { name: "Decisions made", what: "What changed each month because of what the Ledger read.", when: "Monthly" },
    ],
    numbers: [
      {
        figure: "33%",
        text: "Of their stack’s capability is what martech teams reported using, down from 42% the year before.",
        source: "Gartner, Marketing Technology Survey, 2023",
        url: "https://www.gartner.com/en/newsroom/press-releases/2023-08-23-gartner-survey-finds-63-percent-of-marketing-leaders-plan-to-invest-in-generative-ai-in-the-next-24-months",
      },
      {
        figure: "15,505",
        text: "Marketing technology products on the market, in the 2026 count.",
        source: "Scott Brinker, Marketing Technology Landscape, 2026",
        url: "https://chiefmartec.com/2026/05/2026-marketing-technology-landscape-supergraphic-peak-martech-achieved-maybe/",
      },
      {
        figure: "7.8%",
        text: "Of company revenue goes to marketing, on average, among the marketing leaders surveyed.",
        source: "Gartner, CMO Spend Survey, 2026",
        url: "https://www.gartner.com/en/newsroom/press-releases/2026-05-11-gartner-2026-cmo-spend-survey-finds-cmos-allocate-15-point-3-percent-of-marketing-budgets-to-ai-but-only-30-percent-are-ready-to-scale-ai-capabilities",
      },
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
