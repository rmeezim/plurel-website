import type { Measure, Stat } from "@/components/instruments";
import type { QA } from "@/components/questions";
import { SERVICES, type LayerKey } from "@/lib/nav";

/*
  The ten disciplines, one page each (app/services/[slug]): the ten
  companies a growing business usually hires, run here as one system.
  Every page tells one story: the job, the case for it (with published
  numbers, each with its source), how it works inside the Plurel System
  (the page's live instrument and its readout), what you get, the measures
  it answers to, where it sits, and its questions. Names, taglines and
  layers come from nav.ts, so the menu, the footer and the pages never
  disagree.

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
  /** The measures it answers to, read in the Ledger */
  metrics: readonly Measure[];
  /** Published numbers that make the case, each with its source */
  numbers?: readonly Stat[];
  questions: readonly QA[];
};

type Copy = Omit<Discipline, "slug" | "name" | "tagline" | "layer" | "href">;

const COPY: Record<string, Copy> = {
  "fractional-cmo": {
    lead: "A fractional CMO is senior marketing leadership, part time: the plan, the budget, the team and the suppliers, and the board conversation. Ours runs your marketing on the Plurel System and answers for the one number.",
    job: "Own the plan, the budget and the number, part time.",
    body: [
      "Growing companies often need a marketing leader before they can justify a full-time one, or between one and the next. Without one, each supplier sets its own goals, budget drifts to whoever asks loudest, and nobody can tell the board what worked.",
      "Ours sets the plan from the Diagnostic, owns the budget and the suppliers, runs the weekly rhythm and the monthly Ledger read, and builds your team when it is time to, then hands it over.",
    ],
    deliverables: [
      "A plan for the year, reset every quarter",
      "The budget, owned and moved every month",
      "Suppliers briefed, reviewed and held to one brief",
      "The weekly rhythm and the monthly Ledger read",
      "A board page, every month",
      "Your marketing team hired, and the handover",
    ],
    runsOn: "The Diagnostic’s read of the business, and the Ledger every month.",
    feeds: "Every layer: the Core Brief, the plan each team works to, and the budget each surface gets.",
    metrics: [
      { name: "The one number", what: "Against the plan, read with you every month.", when: "Monthly" },
      { name: "Budget moved", what: "What moved, where to, and what it returned.", when: "Monthly" },
      { name: "Suppliers on brief", what: "Work reviewed against the Core Brief: kept, fixed or replaced.", when: "Monthly" },
      { name: "Time to decision", what: "How long a decision takes, from the question to the answer.", when: "Quarterly" },
    ],
    numbers: [
      {
        figure: "7.8%",
        text: "Of company revenue goes to marketing, on average, among the marketing leaders surveyed.",
        source: "Gartner, CMO Spend Survey, 2026",
        url: "https://www.gartner.com/en/newsroom/press-releases/2026-05-11-gartner-2026-cmo-spend-survey-finds-cmos-allocate-15-point-3-percent-of-marketing-budgets-to-ai-but-only-30-percent-are-ready-to-scale-ai-capabilities",
      },
    ],
    questions: [
      {
        q: "How much of their time do we get?",
        a: "A set share of their time, agreed before we start, and the same weekly rhythm every week. You know when they are yours.",
      },
      {
        q: "Do they replace our head of marketing?",
        a: "They can lead until you hire one, or work above the one you have. We help you hire, and hand over when you are ready.",
      },
      {
        q: "Is this part of an engagement?",
        a: "Every engagement has a senior lead. Hired on its own, the fractional CMO runs all of your marketing, not only the parts we deliver.",
      },
    ],
  },
  branding: {
    lead: "Branding is how you look, sound and come across wherever a buyer meets you: positioning, naming, identity and voice, and the creative direction that keeps it one thing. We build it into the Core Brief, so everything the system makes carries the same signal.",
    job: "Look like the choice before you say a word.",
    body: [
      "Buyers judge what they cannot yet test by the signals they can: how you look and sound, and whether it holds from one place to the next. A brand that holds up everywhere earns trust before the first conversation.",
      "We build brands to be used, not admired in a deck: a system of type, colour, layout and voice, with the templates and rules your team and every supplier can work from, and a creative director who reviews what ships against it.",
    ],
    deliverables: [
      "Positioning, and the message for each buyer",
      "Name, logo and visual identity, where they need work",
      "A type, colour and layout system",
      "The voice, and the words you use and avoid",
      "The creative platform, and direction for every shoot and campaign",
      "Templates and guidelines your team and suppliers can follow",
    ],
    runsOn: "The Diagnostic’s read of your market, your buyers and what already works.",
    feeds: "The Asset System: every page, film, ad and creator brief is cut from it.",
    metrics: [
      { name: "Share of search", what: "Searches for your name, as a share of searches for you and your competitors.", when: "Monthly" },
      { name: "Consistency", what: "How much of what ships each month follows the system, checked in review.", when: "Monthly" },
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
        q: "Who is the creative director?",
        a: "A senior creative on your team from the Diagnostic on, who reviews everything that ships against the system, not a name on the pitch.",
      },
      {
        q: "Who owns the work?",
        a: "You do. Every file, font licence and guideline is yours, and we train your team to use it.",
      },
    ],
  },
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
  "content-marketing": {
    lead: "Content is how buyers find you long before they are ready to buy. We make it from the Core Brief and cut it for the places they look: search, AI answers, your own channels and social.",
    job: "Be found by buyers long before they’re ready.",
    body: [
      "Most content fails because it is made for a calendar, not for a buyer. We start from the questions your buyers ask and the places they ask them, then make fewer, better pieces and cut each one many ways.",
      "One good conversation with your founder becomes an article, a newsletter, short clips, posts and an answer page: a month of publishing from one source, each cut made for the surface it runs on.",
    ],
    deliverables: [
      "A program built on your buyers’ questions",
      "Articles and research worth citing",
      "Short-form cut from every long piece",
      "Organic social, planned and run",
      "Newsletters and your own channels",
      "A library your team can reuse",
    ],
    runsOn: "The Core Brief, and the questions the Surface Plan ranks.",
    feeds: "The Surface Plan: every piece is made for a surface, and paid and press carry the best of it.",
    metrics: [
      { name: "Found and cited", what: "What gets found in search, shared, and cited by AI assistants.", when: "Monthly" },
      { name: "Assists", what: "Which pieces people read before they become the one number.", when: "Monthly" },
      { name: "Cost per piece", what: "What each piece costs, against what it earns over time.", when: "Quarterly" },
      { name: "Organic reach", what: "What your own channels reach, and what those people do next.", when: "Monthly" },
    ],
    numbers: [
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
        q: "Who writes it?",
        a: "Our team, from interviews with yours. Nothing ships without your sign-off.",
      },
      {
        q: "Do you work with creators?",
        a: "Yes, through UGC & Creators: briefed from the same story, so a creator’s video and your article say the same thing.",
      },
    ],
  },
  "video-photo": {
    lead: "Film and photography, planned from the Core Brief and shot to be cut: one shoot day gives you the hero film, the cut-downs, the vertical clips and the stills every surface needs.",
    job: "Shoot once, and have what every surface needs.",
    body: [
      "Most production is planned shot by shot for one ad, so every new format means another shoot. We plan from the brief and the surfaces instead: every scene is lit for the widest frame and composed for the narrowest, so one take survives the film, the post, the square and the vertical clip.",
      "Production runs inside the Create layer, so the edit starts from the cut list, and every asset arrives named, captioned and ready for the surface it was made for.",
    ],
    deliverables: [
      "The shoot plan, from the brief and the cut list",
      "Direction, crew, casting and locations",
      "The hero film and its cut-downs",
      "Vertical clips for short-form and creators",
      "Product and in-use photography",
      "A library, named and captioned for every surface",
    ],
    runsOn: "The Core Brief, and the cut list the Surface Plan asks for.",
    feeds: "The Asset System: film and stills cut for every surface the plan uses.",
    metrics: [
      { name: "Cost per asset", what: "What each usable asset costs, from the plan to delivery.", when: "Per shoot" },
      { name: "Assets in use", what: "How much of what was shot runs somewhere within a quarter.", when: "Quarterly" },
      { name: "Creative fatigue", what: "When a film or clip stops working, so the next one is ready.", when: "Weekly" },
      { name: "Time to first cut", what: "Days from the shoot to the first asset live.", when: "Per shoot" },
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
        q: "Do you run the shoots?",
        a: "Yes. We direct every shoot and bring the crew it needs, from a small team for creator-style clips to a full crew for a hero film.",
      },
      {
        q: "Can you use what we already have?",
        a: "Yes. We start from your library, cut what can be cut, and shoot only what is missing.",
      },
      {
        q: "Who owns the footage?",
        a: "You do: every file, with usage cleared for the surfaces it was made for.",
      },
    ],
  },
  "ugc-creators": {
    lead: "Content made by creators, in their own voice, and partnerships with the creators your buyers already follow: briefed from the Core Brief, tested before money goes behind it, with rights settled before anyone films.",
    job: "Be recommended by people your buyers already trust.",
    body: [
      "People trust people more than brands, and short-form travels best in a creator’s voice. But creator programs fail in familiar ways: a hundred videos that say a hundred different things, rights nobody checked, and no way to tell which creator sold anything.",
      "We brief every creator from the same idea, test hooks before paid goes behind them, settle usage and whitelisting up front, and read every creator against the one number.",
    ],
    deliverables: [
      "Creator search, outreach and contracts",
      "Briefs from the Core Brief, with hooks to test",
      "UGC for ads, product pages and social",
      "Usage rights and whitelisting, settled up front",
      "Hook tests, and paid behind the winners",
      "Every creator read in the Ledger",
    ],
    runsOn: "The Core Brief, and the hooks the Surface Plan needs tested.",
    feeds: "The Surface Plan: tested cuts for paid, product pages and creators’ own audiences.",
    metrics: [
      { name: "Hook hold", what: "How many keep watching past the first three seconds, by hook and by creator.", when: "Weekly" },
      { name: "Cost per usable video", what: "What each video that runs costs, rights included.", when: "Monthly" },
      { name: "Creator reach", what: "What creators’ audiences do next: search, visit or buy.", when: "Monthly" },
      { name: "The one number", what: "Orders, installs or demos from creator content, counted once.", when: "Monthly" },
    ],
    numbers: [
      {
        figure: "88%",
        text: "Of people trust recommendations from people they know more than any other source, in a study of over 40,000 people worldwide.",
        source: "Nielsen, Trust in Advertising, 2021",
        url: "https://www.nielsen.com/insights/2021/beyond-martech-building-trust-with-consumers-and-engaging-where-sentiment-is-high/",
      },
    ],
    questions: [
      {
        q: "How do you find creators?",
        a: "From your buyers outward: the people they already follow first, then creators who make the kind of content your category buys from.",
      },
      {
        q: "Do creators follow a script?",
        a: "No. They get the idea, the proof to show and the limits, then say it in their own words. That is why it works.",
      },
      {
        q: "Who owns the videos?",
        a: "Rights are agreed before anyone films: where each video can run, for how long, and whether ads can run from the creator’s handle.",
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
  "paid-media": {
    lead: "Paid media rents attention: search, social, video, creators and retail media. We run it inside the Surface Plan, so spend goes behind what already works and every dollar is read against the one number.",
    job: "Rent attention on purpose, and keep what it earns.",
    body: [
      "Paid works best when it amplifies something that already lands: a message that converts, a creator’s video that took off, a page that turns visits into orders. Run on its own, it buys cheap clicks and reports them as success.",
      "We plan, build and run paid search, social, video and creator amplification as one budget, moved each week to whatever the Ledger says is working.",
    ],
    deliverables: [
      "One budget across search, social, video and creators",
      "Ads built in sets from the Asset System",
      "Landing pages that match the ad",
      "Audiences built from your buyers",
      "Weekly tuning, monthly reallocation",
      "Spend reported against the one number, not clicks",
    ],
    runsOn: "The Asset System’s cuts and the Surface Plan’s order.",
    feeds: "The Ledger: spend against what it produced, by channel and by buyer.",
    metrics: [
      { name: "Cost per number", what: "What one order, install, demo or stockist costs, by channel.", when: "Weekly" },
      { name: "Incremental lift", what: "What paid adds beyond what would have happened anyway, tested rather than assumed.", when: "Quarterly" },
      { name: "New against returning", what: "How much spend reaches new customers rather than people already coming back.", when: "Monthly" },
      { name: "Creative fatigue", what: "When an ad stops working, caught before it wastes budget.", when: "Weekly" },
    ],
    numbers: [
      {
        figure: "60:40",
        text: "The most effective average split between building the brand and driving sales now, across the IPA’s effectiveness data.",
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
  "analytics-martech": {
    lead: "Analytics and martech are the wiring nobody sees until it breaks. We build the measurement behind the Ledger, so everyone reads the same number, and set up the tools around it: analytics, your CRM or store, email and automation.",
    job: "One number everyone trusts, and the wiring behind it.",
    body: [
      "Most companies cannot say which spend produced last quarter’s results, because each tool reports its own version. We agree the one number in the Diagnostic, then wire analytics, your CRM or store, and the ad platforms so it is counted once, the same way, everywhere.",
      "Then the tools around it: which you need and which you don’t, and the automation that turns a first order or sign-up into the next one, from email to the CRM.",
    ],
    deliverables: [
      "The one number, defined with you, for each buyer",
      "Analytics and tracking, set up and checked",
      "Your CRM or store connected to the Ledger",
      "Attribution you can explain to a board",
      "Email, lifecycle and automation, wired to the number",
      "A review of your tools: keep, cut or replace",
    ],
    runsOn: "Every other layer: it reads what they produce.",
    feeds: "Narrative and Distribute, every quarter: the brief and the plan are reset from what it reads.",
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

/** The ten, in the System's order, each with its page copy */
export const DISCIPLINES: readonly Discipline[] = SERVICES.map((svc) => ({
  slug: svc.slug,
  name: svc.name,
  tagline: svc.tagline,
  layer: svc.layer,
  href: svc.href,
  ...COPY[svc.slug],
}));

export const disciplineBySlug = (slug: string) => DISCIPLINES.find((d) => d.slug === slug);
