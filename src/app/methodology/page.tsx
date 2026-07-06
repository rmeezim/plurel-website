import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "The Plurel Method — Methodology",
  description:
    "The Plurel Method (MTD·04) is the operating model behind every engagement: four phases — Diagnose, Design, Deploy, Compound — that take a business from an outdated presence to a compounding, instrumented growth system.",
  alternates: { canonical: "/methodology/" },
};

/* ------------------------------------------------------------------ */
/* The method, in data — the page renders the actual operating model  */
/* ------------------------------------------------------------------ */

const LAWS = [
  {
    code: "L·01",
    name: "Ground truth first",
    rule: "Nothing is designed until the diagnosis is signed. Opinions lose to evidence.",
  },
  {
    code: "L·02",
    name: "Systems over pieces",
    rule: "No deliverable ships disconnected. Everything plugs into the nine-layer system.",
  },
  {
    code: "L·03",
    name: "Ship weekly",
    rule: "Momentum is a deliverable. Every week ends with something live — and a note that says so.",
  },
  {
    code: "L·04",
    name: "Machine-readable by default",
    rule: "Every asset is built twice: once for people, once for the engines answering them.",
  },
  {
    code: "L·05",
    name: "Instrument everything",
    rule: "A signal that can't be seen can't be steered. Six signals, live from launch.",
  },
  {
    code: "L·06",
    name: "Compound, don't campaign",
    rule: "We favor assets that appreciate. What compounds gets scaled; what doesn't gets cut.",
  },
];

type Phase = {
  number: string;
  name: string;
  intent: string;
  window: string;
  gateName: string;
  why: string;
  experience: string;
  workstreams: { code: string; name: string; detail: string }[];
  artifacts: string[];
  gate: string;
  handoff?: string;
};

const PHASES: Phase[] = [
  {
    number: "01",
    name: "Diagnose",
    intent: "Know where you stand.",
    window: "Weeks 0–2",
    gateName: "The Growth Gap Review",
    why: "Every engagement starts with evidence. Before a single pixel moves, we establish ground truth: where your presence wins, where it leaks, and which fixes move revenue first. Diagnosis is why our roadmaps survive contact with reality.",
    experience:
      "Two working interviews, one access checklist, one questionnaire. We carry the rest — you keep running your business.",
    workstreams: [
      {
        code: "D·01",
        name: "Presence audit",
        detail:
          "Brand, website, search, AI answers, content, proof, and paid footprint — scored across all nine system layers.",
      },
      {
        code: "D·02",
        name: "Market & competitor map",
        detail:
          "Who wins the moments that decide your shortlist — and the positioning white space they've left open.",
      },
      {
        code: "D·03",
        name: "Buyer-journey trace",
        detail:
          "The exact path from first question to signed contract, and where prospects currently fall out of it.",
      },
      {
        code: "D·04",
        name: "AEO & SEO baseline",
        detail:
          "How Google and AI assistants read, rank, and cite you today — the visibility number we'll be moving.",
      },
      {
        code: "D·05",
        name: "Stack & data review",
        detail:
          "CRM, analytics, automation: what exists, what's connected, and what's just noise.",
      },
    ],
    artifacts: [
      "Growth Gap Report",
      "Nine-layer scorecard",
      "Competitor map",
      "AEO baseline",
      "Prioritized fix list",
    ],
    gate: "A working session where findings become priorities. Nothing proceeds until the report is agreed and signed — and if we're not the right partner, the report is still yours.",
    handoff: "Hands off — a signed Growth Gap Report",
  },
  {
    number: "02",
    name: "Design",
    intent: "Decide what to build.",
    window: "Weeks 2–5",
    gateName: "The Blueprint Review",
    why: "Design here means the full system blueprint — positioning, identity, conversion architecture, channels, and the martech underneath — sequenced and priced before anything is built. It's the difference between a plan and a mood board.",
    experience:
      "Two design reviews with structured feedback windows. No surprise reveals — you approve direction early and often.",
    workstreams: [
      {
        code: "B·01",
        name: "Positioning & narrative",
        detail:
          "The claim you can win, and the message architecture that carries it through every surface.",
      },
      {
        code: "B·02",
        name: "Identity system",
        detail:
          "Visual language, voice, and usage standards — built as a system, not a logo file.",
      },
      {
        code: "B·03",
        name: "Conversion architecture",
        detail:
          "Sitemap, page-level wireframes, proof placement, and offer clarity — engineered from the buyer-journey trace.",
      },
      {
        code: "B·04",
        name: "Channel & content strategy",
        detail:
          "Which demand layers carry the plan — AI search, editorial, paid — and the publishing spine behind them.",
      },
      {
        code: "B·05",
        name: "Stack blueprint",
        detail:
          "CRM, automation, analytics, and the tracking plan — your six signals defined and targeted.",
      },
    ],
    artifacts: [
      "Brand book v1",
      "Website blueprint",
      "Channel & content plan",
      "Martech schematic",
      "90-day build roadmap",
    ],
    gate: "Everything sequenced, priced, and approved. You know exactly what ships, when, and why — before build begins.",
    handoff: "Hands off — an approved blueprint & roadmap",
  },
  {
    number: "03",
    name: "Deploy",
    intent: "Ship the system.",
    window: "Weeks 5–12, typical",
    gateName: "The Launch Review",
    why: "Build runs in weekly increments — nothing disappears into a six-week black box. Every week ends with something live, and a ship note that says what, why, and what's next.",
    experience:
      "Weekly ship notes, a biweekly working session, one shared tracker. Approvals stay small and fast because direction was locked in Design.",
    workstreams: [
      {
        code: "S·01",
        name: "Website build",
        detail:
          "Design system, pages, performance, and the schema layer that makes you machine-readable.",
      },
      {
        code: "S·02",
        name: "Brand rollout",
        detail:
          "Assets, templates, and every profile buyers check — updated to the new standard.",
      },
      {
        code: "S·03",
        name: "Content engine",
        detail:
          "The editorial spine goes live: first cycle published, founder POV cadence running.",
      },
      {
        code: "S·04",
        name: "Campaign systems",
        detail:
          "Paid accounts, landing pages, and the creative-testing harness — built to learn, not just spend.",
      },
      {
        code: "S·05",
        name: "Stack wiring",
        detail:
          "CRM, automation flows, and dashboards live — all six signals streaming from day one.",
      },
    ],
    artifacts: [
      "The live website",
      "Brand kit in circulation",
      "Content engine in motion",
      "Campaigns live",
      "Instrumented stack",
    ],
    gate: "The system is live, every signal reports, and the compounding roadmap is set.",
    handoff: "Hands off — a live, instrumented system",
  },
  {
    number: "04",
    name: "Compound",
    intent: "Operate like an investment.",
    window: "Ongoing, quarterly cycles",
    gateName: "The Growth Council",
    why: "Launch is the starting line. Compounding is an operating rhythm: read the signals, scale what works, cut what doesn't, and keep raising the system's ceiling — quarter after quarter.",
    experience:
      "A monthly signal digest you can read in five minutes, and a quarterly council where strategy actually changes based on evidence.",
    workstreams: [
      {
        code: "C·01",
        name: "Signal operations",
        detail:
          "Monthly reads against targets across all six signals — moves proposed, not just reported.",
      },
      {
        code: "C·02",
        name: "Content & AEO operations",
        detail:
          "Continuous publishing, refreshes, and answer-engine optimization as assistants change how they cite.",
      },
      {
        code: "C·03",
        name: "Campaign optimization",
        detail:
          "Creative testing and budget reallocation toward what's compounding.",
      },
      {
        code: "C·04",
        name: "Reputation building",
        detail:
          "PR placements, review velocity, and the proof pipeline that feeds back into brand.",
      },
      {
        code: "C·05",
        name: "System upgrades",
        detail:
          "The roadmap never empties: next-priority builds from the gap list, shipped on the same weekly rhythm.",
      },
    ],
    artifacts: [
      "Monthly signal digest",
      "Quarterly growth council",
      "Refreshed roadmap",
      "A compounding asset base",
    ],
    gate: "Quarterly: targets reset, budget re-aimed, and the next quarter's builds committed.",
    handoff: "Feeds back — evidence into the next diagnosis ↺",
  },
];

const RHYTHM = [
  {
    cadence: "Weekly",
    name: "The ship note",
    detail:
      "What went live, what's blocked, what ships next. Written, not a meeting.",
    output: "Momentum you can audit",
  },
  {
    cadence: "Biweekly",
    name: "The working session",
    detail:
      "Thirty minutes, decisions only — direction stays locked, approvals stay fast.",
    output: "An unblocked build",
  },
  {
    cadence: "Monthly",
    name: "The signal digest",
    detail: "All six signals against targets, in a five-minute read.",
    output: "Evidence, not anecdotes",
  },
  {
    cadence: "Quarterly",
    name: "The growth council",
    detail: "Strategy reset against the scoreboard: scale, cut, commit.",
    output: "The next quarter, decided",
  },
];

const FAQS = [
  {
    q: "How long does a full transformation take?",
    a: "A typical engagement reaches launch in about twelve weeks: two for diagnosis, three for design, and five to seven for the build. Compounding then runs as an ongoing quarterly rhythm. Smaller scopes move faster — the phase structure holds either way.",
  },
  {
    q: "Do we have to rebuild everything?",
    a: "No — that's what Diagnose is for. The Growth Gap Report scores all nine layers of your presence; whatever already works is kept and wired into the system. You invest where the evidence says the leak is, not where a pitch deck says it is.",
  },
  {
    q: "What do the first two weeks look like?",
    a: "Two working interviews, one access checklist, one questionnaire — then we disappear into the audit. You get the Growth Gap Report and a prioritized fix list at the Growth Gap Review. If you stop there, the findings are still yours to keep.",
  },
  {
    q: "How do you measure success?",
    a: "Six signals, instrumented from launch: AI search visibility, inquiry quality, conversion readiness, content velocity, reputation signals, and campaign efficiency. Each has a target agreed in Design and reviewed monthly, with a quarterly council where what compounds gets scaled and what doesn't gets cut.",
  },
  {
    q: "Who actually does the work?",
    a: "A small senior team with one accountable lead — the person in the room at your reviews is the person doing the thinking. Nothing is handed down to a junior bench, and you're never routed through an account layer.",
  },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

/* ------------------------------------------------------------------ */

function PhaseChapter({ phase, last }: { phase: Phase; last: boolean }) {
  return (
    <article aria-labelledby={`phase-${phase.number}`}>
      {/* Chapter rule + spec line */}
      <Reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t-2 border-ink/20 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            Phase {phase.number}{" "}
            <span className="px-1 text-line">/</span> MTD&middot;04
          </p>
          <p className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
            <span className="text-muted">{phase.window}</span>
            <span className="text-rust">Gate — {phase.gateName}</span>
          </p>
        </div>

        {/* Chapter head */}
        <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <span
            aria-hidden
            className="font-sans text-[clamp(3.25rem,7vw,5.5rem)] font-normal leading-none tracking-[-0.03em] text-clay"
          >
            {phase.number}
          </span>
          <h3
            id={`phase-${phase.number}`}
            className="font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-none tracking-[-0.02em] text-ink"
          >
            {phase.name}
          </h3>
          <p className="text-[15px] italic text-muted sm:text-base">
            {phase.intent}
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-12">
        {/* Why + experience + gate */}
        <Reveal delay={0.08} className="lg:col-span-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            Why this phase exists
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/85 sm:text-base">
            {phase.why}
          </p>
          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            What it asks of you
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-ink/70">
            {phase.experience}
          </p>
          {/* The gate */}
          <div className="mt-8 border-l-2 border-rust pl-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rust">
              The gate &mdash; {phase.gateName}
            </p>
            <p className="mt-2.5 text-[14px] leading-relaxed text-ink/80">
              {phase.gate}
            </p>
          </div>
        </Reveal>

        {/* Workstreams + artifacts */}
        <Reveal delay={0.16} className="lg:col-span-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            Workstreams
          </p>
          <ol className="mt-1">
            {phase.workstreams.map((ws) => (
              <li
                key={ws.code}
                className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 border-b border-line py-3.5 last:border-b-0 sm:grid-cols-[3.5rem_minmax(0,1fr)]"
              >
                <span className="pt-[0.2em] text-[11px] font-semibold tabular-nums tracking-[0.08em] text-muted">
                  {ws.code}
                </span>
                <span>
                  <span className="block text-[15px] font-medium tracking-[-0.01em] text-ink">
                    {ws.name}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
                    {ws.detail}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            You leave with
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {phase.artifacts.map((artifact) => (
              <li
                key={artifact}
                className="rounded-full border border-line bg-paper px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink/75"
              >
                {artifact}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* Hand-off to the next chapter */}
      {phase.handoff && (
        <Reveal
          className={`flex items-center gap-3 pt-10 ${last ? "" : "pb-10"}`}
        >
          <span aria-hidden className="h-6 w-px bg-brand" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
            {phase.handoff}
          </p>
        </Reveal>
      )}
    </article>
  );
}

export default function MethodologyPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

      {/* ------------------------------------------------ Hero */}
      <section aria-labelledby="method-hero-heading">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-12 sm:px-8 lg:px-12 lg:pb-16 lg:pt-20">
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
            <div className="max-w-[720px]">
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                <Spark className="size-3.5 text-brand" aria-hidden />
                Methodology &mdash; MTD&middot;04
              </p>
              <h1
                id="method-hero-heading"
                className="mt-5 font-sans text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-[1.02] tracking-[-0.02em] text-ink"
              >
                Presence, <em className="italic">engineered</em>.
              </h1>
              <p className="mt-6 max-w-[58ch] text-[15px] leading-relaxed text-ink/80 sm:text-base">
                The Plurel Method is the operating model behind every
                engagement: four phases that take a business from an outdated
                presence to a compounding growth system &mdash; diagnosed like
                an audit, designed like a product, shipped like software, and
                operated like an investment.
              </p>
            </div>

            {/* Title block */}
            <Reveal delay={0.12} className="hidden sm:block">
              <dl
                aria-label="Method summary"
                className="w-[248px] rounded-xl border border-line bg-paper text-[10px] font-semibold uppercase tracking-[0.16em]"
              >
                <div className="flex items-center justify-between px-4 py-2.5">
                  <dt className="text-muted">Operating model</dt>
                  <dd className="flex items-center gap-1.5 text-ink">
                    <Spark className="size-3 text-brand" aria-hidden />
                    MTD&middot;04
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                  <dt className="text-muted">Phases</dt>
                  <dd className="tabular-nums text-ink">04</dd>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                  <dt className="text-muted">Typical launch</dt>
                  <dd className="text-ink">~12 weeks</dd>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                  <dt className="text-muted">Cadence</dt>
                  <dd className="text-ink">Weekly ships</dd>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                  <dt className="text-muted">Review loop</dt>
                  <dd className="text-brand">Quarterly</dd>
                </div>
              </dl>
            </Reveal>
          </div>

          {/* Phase rail — in → 01·02·03·04 → out, with a travelling pulse */}
          <Reveal delay={0.15} className="mt-14 hidden lg:block">
            <div aria-hidden className="relative">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                <span>
                  In &mdash;{" "}
                  <span className="text-muted/70">an outdated presence</span>
                </span>
                <span className="text-brand">
                  Out &mdash; compounding growth
                </span>
              </div>
              <div className="relative mt-5">
                <svg
                  className="h-10 w-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 1000 40"
                  fill="none"
                >
                  <line
                    x1="0"
                    y1="20"
                    x2="1000"
                    y2="20"
                    stroke="var(--color-line)"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="20"
                    x2="1000"
                    y2="20"
                    className="method-pulse"
                    pathLength={100}
                    stroke="var(--color-brand)"
                    strokeWidth="1.5"
                    style={{ strokeDasharray: "6 100", animationDuration: "5s" }}
                  />
                </svg>
                <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-[10%]">
                  {PHASES.map((phase) => (
                    <span key={phase.number} className="flex items-center gap-2.5 bg-canvas px-3">
                      <span className="size-2.5 rounded-full border-[1.5px] border-brand bg-brand" />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
                        <span className="pr-1.5 tabular-nums text-muted">
                          {phase.number}
                        </span>
                        {phase.name}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------- Why a method + the IP map */}
      <section
        aria-labelledby="method-why-heading"
        className="bg-charcoal text-paper"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal className="max-w-[880px]">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
              <Spark className="size-3.5 text-brand" aria-hidden />
              Why a method
            </p>
            <h2
              id="method-why-heading"
              className="mt-6 font-sans text-[clamp(1.75rem,3.6vw,3rem)] font-normal leading-[1.15] tracking-[-0.02em]"
            >
              Deliverables don&rsquo;t compound.{" "}
              <em className="italic text-clay">Systems do.</em>
              {" "}The method exists so every asset we ship lands inside one
              instrumented system &mdash; with one owner and one scoreboard.
            </h2>
          </Reveal>

          {/* The house architecture — three plates, one loop */}
          <Reveal delay={0.12} className="mt-14">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch lg:gap-0">
              {[
                {
                  code: "MTD·04",
                  name: "The Method",
                  desc: "Four phases that carry every engagement — diagnose, design, deploy, compound.",
                  href: null,
                  label: "This page",
                },
                {
                  code: "SYS·09",
                  name: "The Growth System",
                  desc: "The nine-layer circuit the method builds — from brand and website to reputation.",
                  href: "/#growth-system",
                  label: "See the system",
                },
                {
                  code: "SIG·06",
                  name: "The Signal Console",
                  desc: "Six living signals that instrument the system — reviewed monthly, reset quarterly.",
                  href: "/#performance",
                  label: "See the signals",
                },
              ].map((plate, i) => (
                <div key={plate.code} className="contents">
                  {i > 0 && (
                    <div
                      aria-hidden
                      className="hidden items-center px-2 lg:flex"
                    >
                      <div className="flex w-20 flex-col items-center gap-1.5">
                        <span className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.16em] text-paper/40">
                          {i === 1 ? "Builds" : "Steered by"}
                        </span>
                        <svg className="h-2 w-full" viewBox="0 0 64 8" fill="none">
                          <line
                            x1="0"
                            y1="4"
                            x2="58"
                            y2="4"
                            stroke="#fbfaf6"
                            strokeOpacity="0.3"
                            strokeWidth="1"
                            strokeDasharray="3 5"
                          />
                          <path
                            d="M58 1 L63 4 L58 7"
                            stroke="#fbfaf6"
                            strokeOpacity="0.5"
                            strokeWidth="1"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col rounded-2xl border border-paper/15 p-5 sm:p-6">
                    <p className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em]">
                      <span className="tabular-nums text-paper/45">
                        {plate.code}
                      </span>
                      <Spark className="size-3 text-brand" aria-hidden />
                    </p>
                    <p className="mt-4 text-[17px] font-medium tracking-[-0.01em] text-paper">
                      {plate.name}
                    </p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-paper/55">
                      {plate.desc}
                    </p>
                    <p className="mt-5 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em]">
                      {plate.href ? (
                        <Link
                          href={plate.href}
                          className="group inline-flex items-center gap-1.5 text-paper/70 transition-colors hover:text-paper"
                        >
                          {plate.label}
                          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                      ) : (
                        <span className="text-brand">{plate.label}</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/45">
              <span aria-hidden className="text-brand">
                &#8634;
              </span>
              Signals feed the next diagnosis &mdash; the loop compounds
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------ Operating laws */}
      <section aria-labelledby="laws-heading" className="border-t border-line">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                <Spark className="size-3.5 text-brand" aria-hidden />
                Operating laws
              </p>
              <h2
                id="laws-heading"
                className="mt-5 font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
              >
                Six laws govern every engagement.
              </h2>
            </div>
            <p className="max-w-[40ch] text-[14px] leading-relaxed text-muted">
              They&rsquo;re not values &mdash; they&rsquo;re constraints. Work
              that violates one doesn&rsquo;t ship.
            </p>
          </Reveal>

          <div className="mt-10 border-b border-line sm:mt-12">
            <ol className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-16">
              {LAWS.map((law) => (
                <li
                  key={law.code}
                  className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 border-t border-line py-5 sm:py-6"
                >
                  <span className="pt-[0.35em] text-[11px] font-semibold tabular-nums tracking-[0.08em] text-brand">
                    {law.code}
                  </span>
                  <span>
                    <span className="block text-[19px] font-normal tracking-[-0.01em] text-ink sm:text-[21px]">
                      {law.name}
                    </span>
                    <span className="mt-1.5 block max-w-[52ch] text-[13.5px] leading-relaxed text-muted">
                      {law.rule}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ------------------------------------------ The four phases */}
      <section
        aria-labelledby="phases-heading"
        className="border-t border-line bg-paper"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal className="max-w-[680px]">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              <Spark className="size-3.5 text-brand" aria-hidden />
              The model in full
            </p>
            <h2
              id="phases-heading"
              className="mt-5 font-sans text-[clamp(2rem,4.4vw,3.75rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
            >
              Four phases. Four gates. One system.
            </h2>
            <p className="mt-5 max-w-[56ch] text-[15px] leading-relaxed text-ink/75 sm:text-base">
              Each phase ends at a gate &mdash; a decision point where work is
              reviewed, agreed, and signed before anything proceeds. You always
              know where you are, what you have, and what comes next.
            </p>
          </Reveal>

          <div className="mt-14 space-y-0 sm:mt-16">
            {PHASES.map((phase, i) => (
              <PhaseChapter
                key={phase.number}
                phase={phase}
                last={i === PHASES.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------ Operating rhythm */}
      <section
        aria-labelledby="rhythm-heading"
        className="bg-ink text-paper"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal className="max-w-[640px]">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
              <Spark className="size-3.5 text-brand" aria-hidden />
              Operating rhythm
            </p>
            <h2
              id="rhythm-heading"
              className="mt-5 font-sans text-[clamp(2rem,4.4vw,3.75rem)] font-normal leading-[1.05] tracking-[-0.02em]"
            >
              The cadence is <em className="italic text-clay">the contract</em>.
            </h2>
            <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-paper/70 sm:text-base">
              Four rituals carry every engagement. No status meetings for
              their own sake &mdash; the work is the update.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-12 sm:mt-14">
            <div className="overflow-hidden rounded-3xl border border-paper/15">
              <div className="flex items-center justify-between border-b border-paper/15 px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em]">
                <span className="text-paper/50">
                  Engagement rhythm &mdash; every client
                </span>
                <span className="flex items-center gap-1.5 text-paper/80">
                  <Spark className="size-3 text-brand" aria-hidden />
                  RTM&middot;04
                </span>
              </div>
              <div className="grid grid-cols-1 gap-px bg-paper/15 sm:grid-cols-2 lg:grid-cols-4">
                {RHYTHM.map((ritual, i) => (
                  <div key={ritual.cadence} className="bg-ink p-6 sm:p-7">
                    <p className="flex items-center justify-between text-[9.5px] font-semibold uppercase tracking-[0.18em]">
                      <span className="text-brand">{ritual.cadence}</span>
                      <span className="tabular-nums text-paper/35">
                        R&middot;0{i + 1}
                      </span>
                    </p>
                    <p className="mt-4 text-[16px] font-medium tracking-[-0.01em] text-paper sm:text-[17px]">
                      {ritual.name}
                    </p>
                    <p className="mt-1.5 min-h-[3lh] text-[13px] leading-relaxed text-paper/55">
                      {ritual.detail}
                    </p>
                    <p className="mt-4 border-t border-dashed border-paper/10 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-paper/45">
                      Output &mdash; {ritual.output}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-paper/15 px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/45">
                <span>The work is the update</span>
                <span className="flex items-center gap-2">
                  <Spark className="size-3 text-brand" aria-hidden />A Plurel
                  operating standard
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------ FAQ */}
      <section aria-labelledby="method-faq-heading" className="border-t border-line">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                <Spark className="size-3.5 text-brand" aria-hidden />
                Method FAQ
              </p>
              <h2
                id="method-faq-heading"
                className="mt-5 max-w-[14ch] font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
              >
                The questions clients ask first.
              </h2>
              <p className="mt-6 max-w-[36ch] text-[14px] leading-relaxed text-muted">
                Anything else &mdash; ask on the strategy call. You&rsquo;ll
                get a straight answer either way.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-8">
              <div className="border-t border-line">
                {FAQS.map((faq) => (
                  <details key={faq.q} className="group border-b border-line">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                      <span className="text-[16px] font-medium tracking-[-0.01em] text-ink sm:text-[17px]">
                        {faq.q}
                      </span>
                      <span
                        aria-hidden
                        className="relative size-3 shrink-0 transition-transform duration-300 group-open:rotate-45"
                      >
                        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-brand" />
                        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-brand" />
                      </span>
                    </summary>
                    <p className="max-w-[68ch] pb-6 text-[14.5px] leading-relaxed text-ink/75">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Closing CTA */}
      <section
        aria-labelledby="method-cta-heading"
        className="relative overflow-hidden bg-brand text-paper"
      >
        <Spark
          aria-hidden
          className="absolute -right-16 -top-24 size-[340px] rotate-12 text-paper/10"
        />
        <div className="relative mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/70">
              <Spark className="size-3.5" aria-hidden />
              Begin at Phase 01
            </p>
            <h2
              id="method-cta-heading"
              className="mt-6 max-w-[22ch] font-sans text-[clamp(2rem,4.8vw,4rem)] font-normal leading-[1.05] tracking-[-0.02em]"
            >
              Your diagnosis is the{" "}
              <em className="italic">first deliverable</em>.
            </h2>
            <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-paper/85 sm:text-base">
              Every engagement starts with the audit &mdash; a clear read on
              where your presence stands across all nine layers, and what to
              fix first. Book the call; leave with the truth either way.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-lg bg-paper px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-canvas"
              >
                Book Strategy Call
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/#growth-system"
                className="border-b border-paper/40 pb-0.5 text-sm text-paper transition-colors hover:border-paper"
              >
                See the system it builds
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
