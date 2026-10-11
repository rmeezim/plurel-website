/*
 * The services layer: one entry per service page. Copy follows the
 * pacing rules (short clauses, one idea per line). Every statistic is
 * from independent, published research and carries its source inline;
 * nothing here is invented. Names and taglines mirror SERVICE_LIST in
 * nav.ts. Creators and UGC sit inside Content Marketing (the programs)
 * and Paid Ads (the amplification); the hand-off to sales is named on
 * Martech, where Kelwin takes it on.
 */

export type ServiceStat = { value: string; label: string; source: string };

export type ServicePage = {
  code: string;
  slug: string;
  name: string;
  /** One-line promise under the name */
  tagline: string;
  /** Plain-terms explainer for a first-time visitor, two short paragraphs */
  plain: [string, string];
  why: { name: string; clause: string }[];
  stats: ServiceStat[];
  /** The cost of skipping it */
  risks: { name: string; clause: string }[];
  riskStat: ServiceStat;
  /** How it runs inside MTD·04 */
  how: { phase: string; action: string }[];
  layers: string[];
  plate: {
    kind: "identity" | "room" | "campaign" | "device" | "schematic";
    label: string;
    line?: string;
  };
  related: [string, string];
};

export const SERVICE_PAGES: ServicePage[] = [
  {
    code: "SVC·01",
    slug: "website-design",
    name: "Website Design",
    tagline: "Every buyer meets it, and most judge you by it.",
    plain: [
      "Your website is where every relevant channel eventually sends people: ads, search, referrals, AI answers. We design and build editorial, conversion-ready websites that look premium, load fast, read clearly and turn attention into qualified demand.",
      "Design and engineering happen together, so the site ships with performance, analytics and a schema layer built in from the first page.",
    ],
    why: [
      {
        name: "It sets your price",
        clause: "Buyers infer quality and cost from design before reading a word.",
      },
      {
        name: "Every relevant channel lands here",
        clause: "Paid, search and referrals all convert or leak on the same pages.",
      },
      {
        name: "It works while you don't",
        clause: "A site that answers and converts is a salesperson on every shift.",
      },
    ],
    stats: [
      {
        value: "75%",
        label: "of users judge a company's credibility by its website design",
        source: "Stanford Web Credibility Research",
      },
      {
        value: "0.05s",
        label: "for visitors to form a first impression of your site",
        source: "Google research",
      },
      {
        value: "+200%",
        label: "conversion lift achievable through better UX design",
        source: "Forrester",
      },
    ],
    risks: [
      {
        name: "The credibility discount",
        clause: "A dated site quietly reprices everything you sell.",
      },
      {
        name: "Paid traffic leaks",
        clause: "Every ad click you buy lands on the same weak pages.",
      },
      {
        name: "Invisible to machines",
        clause: "Without structure, AI assistants can't read you, let alone cite you.",
      },
    ],
    riskStat: {
      value: "53%",
      label: "of mobile visitors abandon a site that takes over 3 seconds to load",
      source: "Google",
    },
    how: [
      { phase: "Diagnose", action: "Trace the buyer journey and score where pages leak." },
      { phase: "Design", action: "Conversion architecture, wireframes and the design system." },
      { phase: "Deploy", action: "Build, performance pass and schema layer, live in weeks." },
      { phase: "Compound", action: "Conversion tracked, and the pages tuned every quarter." },
    ],
    layers: ["02 Website", "03 AI Search", "08 Analytics"],
    plate: { kind: "device", label: "The build · conversion-ready" },
    related: ["brand-identity", "aeo-seo"],
  },
  {
    code: "SVC·02",
    slug: "brand-identity",
    name: "Brand Identity",
    tagline: "Look like the choice before you say a word.",
    plain: [
      "Brand identity is how you look, sound and feel: positioning, visual language, voice, and the standards that keep them consistent wherever a buyer meets you.",
      "We build identities your team can use without asking. Every template, profile and page carries the same signal, so recognition builds instead of resetting.",
    ],
    why: [
      {
        name: "Distinct or discounted",
        clause: "Indistinct businesses get compared on price alone.",
      },
      {
        name: "Recognition adds up",
        clause: "Consistency turns every impression into memory instead of noise.",
      },
      {
        name: "Every relevant channel performs better",
        clause: "A strong brand raises the return on ads, content and PR at once.",
      },
    ],
    stats: [
      {
        value: "+20%",
        label: "revenue growth attributed to consistent brand presentation",
        source: "Marq / Lucidpress study",
      },
      {
        value: "46%",
        label: "of consumers will pay more for a brand name they trust",
        source: "Salsify",
      },
      {
        value: "+80%",
        label: "brand recognition gained through consistent signature color",
        source: "University of Loyola",
      },
    ],
    risks: [
      {
        name: "The sameness tax",
        clause: "Look like the category and you inherit its price pressure.",
      },
      {
        name: "Forgettable at the shortlist",
        clause: "Buyers remember five brands; unclear ones aren't among them.",
      },
      {
        name: "Wasted media spend",
        clause: "Weak creative drags every campaign it appears in.",
      },
    ],
    riskStat: {
      value: "~47%",
      label: "of advertising-driven sales lift is determined by creative quality alone",
      source: "Nielsen",
    },
    how: [
      { phase: "Diagnose", action: "Positioning audit: where you win, and where you blend in." },
      { phase: "Design", action: "Identity system: visual language, voice, usage standards." },
      { phase: "Deploy", action: "Rollout across the site, templates and every profile buyers check." },
      { phase: "Compound", action: "Consistency kept as channels and campaigns multiply." },
    ],
    layers: ["01 Brand", "02 Website", "09 Reputation"],
    plate: { kind: "identity", label: "Identity · built to be used" },
    related: ["website-design", "creative-direction"],
  },
  {
    code: "SVC·03",
    slug: "aeo-seo",
    name: "AI Search & SEO",
    tagline: "Be the answer, wherever the question is asked.",
    plain: [
      "Buyers now ask Google and AI assistants before they ask anyone else. AEO (answer engine optimization) is SEO for that reality: structuring your site, content and proof so search engines and AI assistants can read, rank and cite you.",
      "We build the machine-readable layer (schema, entities, content worth citing) and the authority that earns the answer spot.",
    ],
    why: [
      {
        name: "The front door moved",
        clause: "Discovery starts in search bars and AI chats, not on your homepage.",
      },
      {
        name: "It keeps working",
        clause: "Rankings and citations keep working long after they're earned.",
      },
      {
        name: "Winner-take-most",
        clause: "The answer position takes most of the demand; page two takes none.",
      },
    ],
    stats: [
      {
        value: "68%",
        label: "of online experiences begin with a search engine",
        source: "BrightEdge",
      },
      {
        value: "53%",
        label: "of all trackable website traffic arrives from organic search",
        source: "BrightEdge",
      },
      {
        value: "~10×",
        label: "more clicks for the #1 result than position #10",
        source: "Backlinko CTR study",
      },
    ],
    risks: [
      {
        name: "Answered without you",
        clause: "Assistants summarize your category and cite whoever is readable.",
      },
      {
        name: "Page two is invisible",
        clause: "Under 1% of searchers ever click a second-page result.",
      },
      {
        name: "Paid becomes the only lever",
        clause: "No organic layer means renting every single visitor, forever.",
      },
    ],
    riskStat: {
      value: "−25%",
      label: "predicted drop in traditional search volume by 2026 as AI answers take over",
      source: "Gartner",
    },
    how: [
      { phase: "Diagnose", action: "AEO baseline: how engines read, rank and cite you today." },
      { phase: "Design", action: "Entity and schema architecture; the citable-content plan." },
      { phase: "Deploy", action: "Technical layer live, first answer-ready content published." },
      { phase: "Compound", action: "Visibility tracked monthly across Google and assistants." },
    ],
    layers: ["03 AI Search", "02 Website", "04 Content"],
    plate: { kind: "schematic", label: "Answer engine · machine-readable" },
    related: ["content-marketing", "website-design"],
  },
  {
    code: "SVC·04",
    slug: "content-marketing",
    name: "Content Marketing",
    tagline: "Found by buyers long before they're ready.",
    plain: [
      "Content marketing is publishing what buyers go looking for: articles, case studies, founder posts, and creator and UGC programs, where people your buyers already follow make and share the work. Done well, buyers find you, trust you and arrive half-convinced.",
      "We tie the editorial plan to what buyers actually ask, write it so people read it and AI assistants cite it, and brief creators from the same story. When a creator post earns attention, Paid Ads puts budget behind it.",
    ],
    why: [
      {
        name: "Buyers self-educate",
        clause: "Most of the decision happens before anyone talks to sales.",
      },
      {
        name: "It feeds every layer",
        clause: "Content powers search, social, email, and the answers assistants give.",
      },
      {
        name: "It outlasts the ad",
        clause: "A good article works for years; an ad stops the day you stop paying.",
      },
    ],
    stats: [
      {
        value: "3×",
        label: "more leads than outbound marketing, at about 62% lower cost",
        source: "Demand Metric",
      },
      {
        value: "55%",
        label: "more website visitors for businesses that publish consistently",
        source: "HubSpot",
      },
      {
        value: "47%",
        label: "of buyers view 3–5 pieces of content before engaging sales",
        source: "DemandGen Report",
      },
    ],
    risks: [
      {
        name: "Colder conversations",
        clause: "Without published proof, every sales call starts from zero.",
      },
      {
        name: "Cited out of the market",
        clause: "Assistants quote competitors who wrote the better answer.",
      },
      {
        name: "Rented attention only",
        clause: "No owned audience means every visit is bought at full price.",
      },
    ],
    riskStat: {
      value: "~60%",
      label: "of searches now end without a click on any result",
      source: "SparkToro / Similarweb analysis",
    },
    how: [
      { phase: "Diagnose", action: "Map the questions that decide your shortlist." },
      { phase: "Design", action: "Editorial plan: topics, formats, creators and cadence." },
      { phase: "Deploy", action: "First cycle live: founder posts, citable articles, the first creator briefs." },
      { phase: "Compound", action: "Publish, refresh and redistribute every week." },
    ],
    layers: ["04 Content", "03 AI Search", "09 Reputation"],
    plate: { kind: "campaign", label: "Content · worth citing", line: "Worth citing." },
    related: ["aeo-seo", "pr-reputation"],
  },
  {
    code: "SVC·05",
    slug: "paid-ads",
    name: "Paid Ads",
    tagline: "Rent attention on purpose. Keep what it earns.",
    plain: [
      "Paid media buys the attention your brand hasn't earned yet: search, social and retargeting campaigns that put you in front of buyers now, and budget behind your best creator and UGC posts.",
      "We build paid around sharp creative, landing pages built to convert, and a testing plan that makes every dollar smarter than the last. What each test teaches goes back into the brief.",
    ],
    why: [
      {
        name: "Speed",
        clause: "Organic builds over quarters; paid brings qualified demand this month.",
      },
      {
        name: "Creative is the multiplier",
        clause: "The ad itself decides most of the return on the budget behind it.",
      },
      {
        name: "A learning machine",
        clause: "Run right, every campaign is research, and every test teaches the brand something.",
      },
    ],
    stats: [
      {
        value: "8:1",
        label: "estimated business return per dollar spent on search advertising",
        source: "Google Economic Impact",
      },
      {
        value: "~47%",
        label: "of ad-driven sales lift comes from creative quality",
        source: "Nielsen",
      },
      {
        value: "60/40",
        label: "the brand-to-activation budget balance of the most effective advertisers",
        source: "Binet & Field, IPA",
      },
    ],
    risks: [
      {
        name: "The leaking bucket",
        clause: "Spend rises to cover pages and creative that don't convert.",
      },
      {
        name: "Creative fatigue",
        clause: "One ad run to exhaustion quietly doubles your acquisition cost.",
      },
      {
        name: "Addicted to the auction",
        clause: "Paid-only growth stops the moment the card does.",
      },
    ],
    riskStat: {
      value: "53%",
      label: "of the mobile visits your ads pay for abandon a slow landing page",
      source: "Google",
    },
    how: [
      { phase: "Diagnose", action: "Audit spend, creative, and where paid traffic leaks." },
      { phase: "Design", action: "Campaign architecture, offers, and the testing plan." },
      { phase: "Deploy", action: "Accounts, landing pages and the creative tests live." },
      { phase: "Compound", action: "Budget moved every month toward what returns." },
    ],
    layers: ["05 Paid Growth", "02 Website", "08 Analytics"],
    plate: { kind: "campaign", label: "Campaigns · built to learn", line: "Built to learn." },
    related: ["website-design", "martech-consulting"],
  },
  {
    code: "SVC·06",
    slug: "pr-reputation",
    name: "PR & Reputation",
    tagline: "What people say when you're not in the room.",
    plain: [
      "Reputation is the layer buyers check last: reviews, press, rankings, and what AI assistants say about you. PR earns that third-party proof; reputation management makes sure it's found.",
      "We keep proof coming in: press placements, a steady flow of reviews, and trust signals that feed back into everything else.",
    ],
    why: [
      {
        name: "Trust is outsourced",
        clause: "Buyers believe strangers and journalists before they believe you.",
      },
      {
        name: "The final checkpoint",
        clause: "Reviews are the last stop before nearly every purchase decision.",
      },
      {
        name: "Machines read it too",
        clause: "Assistants aggregate your reputation into their recommendation.",
      },
    ],
    stats: [
      {
        value: "+5–9%",
        label: "revenue increase associated with one extra star on Yelp",
        source: "Harvard Business School",
      },
      {
        value: "98%",
        label: "of consumers read online reviews for local businesses",
        source: "BrightLocal",
      },
      {
        value: "92%",
        label: "of consumers trust earned media over traditional advertising",
        source: "Nielsen",
      },
    ],
    risks: [
      {
        name: "Others write your story",
        clause: "Silence hands the narrative to whoever bothers to post.",
      },
      {
        name: "The first-page wound",
        clause: "A single negative result taxes every campaign you run.",
      },
      {
        name: "Invisible authority",
        clause: "Unreviewed and unmentioned reads as unproven, to people and to machines.",
      },
    ],
    riskStat: {
      value: "−22%",
      label: "of prospective customers lost to one negative first-page search result",
      source: "Moz",
    },
    how: [
      { phase: "Diagnose", action: "Reputation audit: reviews, press and what assistants answer." },
      { phase: "Design", action: "The proof plan: stories, target outlets, review cadence." },
      { phase: "Deploy", action: "First placements landed, and reviews coming in." },
      { phase: "Compound", action: "Trust signals watched, and fed back into the brand." },
    ],
    layers: ["09 Reputation", "04 Content", "01 Brand"],
    plate: { kind: "room", label: "Trust · accumulating" },
    related: ["content-marketing", "brand-identity"],
  },
  {
    code: "SVC·07",
    slug: "creative-direction",
    name: "Creative Direction",
    tagline: "Someone with taste in every review.",
    plain: [
      "Creative direction keeps everything you ship coherent, distinctive and unmistakably yours: campaigns, content, product pages and the work creators make for you.",
      "A creative director sits in every review and holds the same point of view across every piece, so growth never comes at the cost of the brand.",
    ],
    why: [
      {
        name: "Design outperforms",
        clause: "Design-led companies grow faster than their categories.",
      },
      {
        name: "Coherence pays",
        clause: "One strong idea, carried everywhere, beats ten disconnected ones.",
      },
      {
        name: "Taste can't be delegated",
        clause: "Committees average things out; direction keeps the edge.",
      },
    ],
    stats: [
      {
        value: "2:1",
        label: "revenue-growth advantage of design-led companies over benchmarks",
        source: "McKinsey Design Index",
      },
      {
        value: "32pp",
        label: "higher five-year revenue growth for top-quartile design performers",
        source: "McKinsey",
      },
      {
        value: "~half",
        label: "of advertising effectiveness is decided by the creative itself",
        source: "Nielsen",
      },
    ],
    risks: [
      {
        name: "Drift",
        clause: "Vendors and channels slowly pull the brand in six directions.",
      },
      {
        name: "The sameness tax",
        clause: "Category-standard creative earns category-standard results.",
      },
      {
        name: "Death by committee",
        clause: "Without a director, the safest idea wins every time.",
      },
    ],
    riskStat: {
      value: "5:1",
      label: "profit-growth gap between the most creative campaigns and the least",
      source: "Binet & Field, IPA",
    },
    how: [
      { phase: "Diagnose", action: "Audit everything shipping under the brand today." },
      { phase: "Design", action: "The creative platform: the idea, the standards, the references." },
      { phase: "Deploy", action: "Direction on every piece that leaves the studio." },
      { phase: "Compound", action: "Quarterly creative reviews against the platform." },
    ],
    layers: ["01 Brand", "04 Content", "05 Paid Growth"],
    plate: { kind: "campaign", label: "Direction · one point of view", line: "Taste, applied." },
    related: ["brand-identity", "paid-ads"],
  },
  {
    code: "SVC·08",
    slug: "martech-consulting",
    name: "Martech & Consulting",
    tagline: "The wiring nobody sees until it breaks.",
    plain: [
      "Martech is the wiring under your marketing: CRM, automation, analytics and the connections between them. Consulting is us designing that wiring around how your business actually sells.",
      "We wire it so no lead leaks, every follow-up fires, and marketing and sales count qualified demand the same way. Where demand reaches sales, Kelwin, Plurel's sister division for RevOps and go-to-market, can carry it through to revenue.",
    ],
    why: [
      {
        name: "Speed wins deals",
        clause: "The first credible response usually gets the conversation.",
      },
      {
        name: "Leads are expensive",
        clause: "Every unworked lead is marketing spend thrown away.",
      },
      {
        name: "Evidence beats opinion",
        clause: "Instrumented funnels let you scale what works and cut what doesn't.",
      },
    ],
    stats: [
      {
        value: "7×",
        label: "more likely to qualify a lead when responding within the first hour",
        source: "Harvard Business Review",
      },
      {
        value: "+14.5%",
        label: "sales productivity gain from marketing automation",
        source: "Nucleus Research",
      },
      {
        value: "20%",
        label: "more sales opportunities from nurtured leads versus non-nurtured",
        source: "DemandGen Report",
      },
    ],
    risks: [
      {
        name: "Shelfware",
        clause: "Tools you pay for and barely use. The most common state of a stack.",
      },
      {
        name: "The silent leak",
        clause: "Leads dying between inbox, spreadsheet, and CRM, unnoticed.",
      },
      {
        name: "Flying blind",
        clause: "Without attribution, budget goes to whoever argues loudest.",
      },
    ],
    riskStat: {
      value: "33%",
      label: "of purchased martech capability is all the average team actually uses",
      source: "Gartner",
    },
    how: [
      { phase: "Diagnose", action: "Stack and data review: what exists, and what's connected." },
      { phase: "Design", action: "The schematic and tracking plan, with the hand-off to sales agreed." },
      { phase: "Deploy", action: "CRM, automations and dashboards wired and live." },
      { phase: "Compound", action: "Six signals reviewed monthly, so the stack earns its keep." },
    ],
    layers: ["06 CRM", "07 Automation", "08 Analytics"],
    plate: { kind: "schematic", label: "The stack · wired" },
    related: ["paid-ads", "aeo-seo"],
  },
];

export function getServicePage(slug: string) {
  return SERVICE_PAGES.find((s) => s.slug === slug);
}
