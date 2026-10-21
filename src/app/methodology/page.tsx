import type { Metadata } from "next";
import Link from "next/link";
import { Cascade } from "@/components/cascade";
import { ArrowUpRight, Spark } from "@/components/icons";
import { MethodHud } from "@/components/method-hud";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "The Plurel Method | Methodology",
  description:
    "The Plurel Method (MTD·04) runs every engagement in four phases: Diagnose, Design, Deploy and Compound. It starts with the Diagnostic, six parts of your distribution scored, and settles into a monthly partnership judged on qualified demand.",
  alternates: { canonical: "/methodology/" },
};

/*
 * The page performs the method. It opens in the dark — where every client
 * starts: invisible. Diagnosis and design happen backstage, on ink. At
 * week five, exactly where the method ships the system, the page turns
 * the lights on and the reader surfaces into canvas. Compounding lives in
 * daylight; the close is brand red. Dark → light → red is the argument.
 */

const LAWS = [
  {
    code: "L·01",
    name: "Ground truth first",
    rule: "Nothing is designed until the diagnosis is signed.",
  },
  {
    code: "L·02",
    name: "Nothing ships alone",
    rule: "Every deliverable ships connected to the rest of the work.",
  },
  {
    code: "L·03",
    name: "Ship weekly",
    rule: "Every week ends with something live, and a note that says so.",
  },
  {
    code: "L·04",
    name: "Machine-readable by default",
    rule: "Built once for people, once for the engines answering them.",
  },
  {
    code: "L·05",
    name: "Instrument everything",
    rule: "What isn't measured can't be steered. Qualified demand and its supporting signals run from launch.",
  },
  {
    code: "L·06",
    name: "Keep what works",
    rule: "What keeps returning gets scaled; what doesn't gets cut.",
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
    window: "WK 00–02",
    gateName: "The Diagnosis Review",
    why: "Every engagement starts with evidence. The free Diagnostic comes first: six parts of your distribution scored and a prioritized read, back within a business day. Diagnose is the paid two weeks that follow it. We go deeper on where your presence wins, where it leaks, and which fixes move revenue first, before a single pixel moves.",
    experience:
      "Two working interviews, one access checklist and one questionnaire, all after the free Diagnostic. We carry the rest while you keep running your business.",
    workstreams: [
      {
        code: "D·01",
        name: "Presence audit",
        detail:
          "Market, narrative, touchpoints, assets, distribution and measurement: the six parts the Diagnostic scored, now worked through in depth.",
      },
      {
        code: "D·02",
        name: "Market & competitor map",
        detail:
          "Who wins the moments that decide your shortlist, and the positioning they've left open.",
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
          "How Google and AI assistants read, rank and cite you today. This is the visibility number we'll move.",
      },
      {
        code: "D·05",
        name: "Stack & data review",
        detail:
          "CRM, analytics, automation: what exists, what's connected, and what's just noise.",
      },
    ],
    artifacts: [
      "Diagnosis report",
      "Six-part scorecard",
      "Competitor map",
      "AEO baseline",
      "Prioritized fix list",
    ],
    gate: "A working session where findings become priorities. Nothing proceeds until the report is agreed and signed. If we're not the right partner, the report is still yours.",
    handoff: "Hands off: a signed diagnosis report",
  },
  {
    number: "02",
    name: "Design",
    intent: "Decide what to build.",
    window: "WK 02–05",
    gateName: "The Blueprint Review",
    why: "Design here means the full blueprint: positioning, identity, conversion architecture, channels and the martech underneath, sequenced and priced before anything is built. It's the difference between a plan and a mood board.",
    experience:
      "Two design reviews with structured feedback windows. No surprise reveals: you approve the direction early and often.",
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
          "Visual language, voice and usage standards, built so your team can use them without asking.",
      },
      {
        code: "B·03",
        name: "Conversion architecture",
        detail:
          "Sitemap, page wireframes, proof placement and offer clarity, drawn from the buyer-journey trace.",
      },
      {
        code: "B·04",
        name: "Channel & content strategy",
        detail:
          "Which channels carry the plan (AI search, editorial, creators, paid) and the publishing calendar behind them.",
      },
      {
        code: "B·05",
        name: "Stack blueprint",
        detail:
          "CRM, automation, analytics and the tracking plan: qualified demand and its supporting signals defined and given targets, and the hand-off to sales agreed.",
      },
    ],
    artifacts: [
      "Brand book v1",
      "Website blueprint",
      "Channel & content plan",
      "Martech schematic",
      "90-day build roadmap",
    ],
    gate: "Everything sequenced, priced, and approved. Before the build begins, you know exactly what ships, when, and why.",
    handoff: "Hands off: an approved blueprint and roadmap",
  },
  {
    number: "03",
    name: "Deploy",
    intent: "Ship the system.",
    window: "WK 05–12",
    gateName: "The Launch Review",
    why: "Build runs in weekly increments, so nothing disappears into a six-week black box. Every week ends with something live, and a ship note that says what, why, and what's next.",
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
          "Assets, templates and every profile buyers check, updated to the new standard.",
      },
      {
        code: "S·03",
        name: "Content program",
        detail:
          "The editorial plan goes live: the first cycle published, founder posts and creator briefs running.",
      },
      {
        code: "S·04",
        name: "Campaigns",
        detail:
          "Paid accounts, landing pages and creative tests, set up to learn as well as to spend.",
      },
      {
        code: "S·05",
        name: "Stack wiring",
        detail:
          "CRM, automation flows and dashboards live, qualified demand and its supporting signals reporting from day one, and qualified leads handed to sales.",
      },
    ],
    artifacts: [
      "The live website",
      "Brand kit in circulation",
      "Content program running",
      "Campaigns live",
      "Instrumented stack",
    ],
    gate: "Everything is live, every signal reports, and the next quarter's roadmap is set.",
    handoff: "Hands off: live work, measured from day one",
  },
  {
    number: "04",
    name: "Compound",
    intent: "Operate like an investment.",
    window: "Quarterly ∞",
    gateName: "The Growth Council",
    why: "Launch is the starting line. After it comes a rhythm: read the signals, scale what works, cut what doesn't, and raise the ceiling every quarter.",
    experience:
      "A monthly signal digest you can read in five minutes, and a quarterly council where strategy actually changes based on evidence.",
    workstreams: [
      {
        code: "C·01",
        name: "Signal operations",
        detail:
          "A monthly read of qualified demand against target and the signals behind it, with the next moves proposed.",
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
          "Creative testing, and budget moved toward what's returning.",
      },
      {
        code: "C·04",
        name: "Reputation building",
        detail:
          "PR placements, a steady flow of reviews, and proof that feeds back into the brand.",
      },
      {
        code: "C·05",
        name: "Next builds",
        detail:
          "The roadmap never empties: next-priority builds from the gap list, shipped on the same weekly rhythm.",
      },
    ],
    artifacts: [
      "Monthly signal digest",
      "Quarterly growth council",
      "Refreshed roadmap",
      "A growing body of work",
    ],
    gate: "Quarterly: targets reset, budget re-aimed, and the next quarter's builds committed.",
    handoff: "Feeds back: evidence into the next diagnosis ↺",
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
      "Thirty minutes, decisions only, so approvals stay fast.",
    output: "An unblocked build",
  },
  {
    cadence: "Monthly",
    name: "The signal digest",
    detail: "Qualified demand against target, and why it moved, in a five-minute read.",
    output: "Evidence you can act on",
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
    q: "How long does a full engagement take?",
    a: "A typical engagement reaches launch in about twelve weeks: two for diagnosis, three for design, and five to seven for the build. After launch the work runs as a monthly partnership, reviewed every quarter. Smaller scopes move faster, and the phases hold either way.",
  },
  {
    q: "Do we have to rebuild everything?",
    a: "No. That's what the Diagnostic is for. It scores every part of your distribution, and whatever already works is kept and connected to the rest. You put money where the evidence says the leak is.",
  },
  {
    q: "What do the first two weeks look like?",
    a: "You already have the Diagnostic by then: the free read, back within a business day. The two weeks after it go deeper. Two working interviews, one access checklist and one questionnaire turn that read into a full diagnosis report, which we agree with you at the Diagnosis Review. If you stop there, the report is still yours.",
  },
  {
    q: "How do you measure success?",
    a: "One number: qualified demand, counted the way your sales team counts it and split by buyer if you sell to both businesses and consumers. Five supporting signals explain why it moved: AI search visibility, conversion, publishing pace, reviews and press, and campaign cost. Targets are agreed in Design, read monthly and reset each quarter, and a quarterly council scales what's working and cuts what isn't.",
  },
  {
    q: "Who actually does the work?",
    a: "A small senior team with one accountable lead. The person in the room at your reviews is the person doing the thinking. Nothing is handed down to a junior bench, and you're never routed through an account layer.",
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

function PhaseAct({ phase, dark }: { phase: Phase; dark: boolean }) {
  const rule = dark ? "border-paper/12" : "border-line";
  const kicker = dark ? "text-paper/45" : "text-muted";
  const body = dark ? "text-paper/80" : "text-ink/85";
  const soft = dark ? "text-paper/55" : "text-muted";
  return (
    <section
      data-act={`Phase ${phase.number} · ${phase.name}`}
      data-week={phase.window}
      aria-labelledby={`phase-${phase.number}`}
      className={`relative overflow-hidden ${
        dark ? "" : "border-t border-line"
      }`}
    >
      {/* Viewport-scale ghost numeral */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -top-10 right-0 select-none font-sans text-[clamp(10rem,26vw,24rem)] font-medium leading-[0.75] tracking-[-0.05em] sm:-top-14 ${
          dark ? "text-paper/[0.05]" : "text-ink/[0.045]"
        }`}
      >
        {phase.number}
      </span>

      <div className="relative mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        {/* Act opener */}
        <Reveal>
          <p
            className={`flex flex-wrap items-baseline gap-x-6 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${kicker}`}
          >
            <span>
              Phase {phase.number} <span className="px-1 opacity-40">/</span>{" "}
              04
            </span>
            <span>{phase.window}</span>
            <span className="text-rust">Gate: {phase.gateName}</span>
          </p>
          <h2
            id={`phase-${phase.number}`}
            className={`mt-6 font-sans text-[clamp(2.75rem,7vw,5.5rem)] font-normal leading-[0.95] tracking-[-0.03em] ${
              dark ? "text-paper" : "text-ink"
            }`}
          >
            {phase.name}
          </h2>
          <p
            className={`mt-4 font-sans text-[clamp(1.4rem,2.8vw,2.1rem)] font-normal italic leading-snug tracking-[-0.01em] ${
              dark ? "text-clay" : "text-rust"
            }`}
          >
            {phase.intent}
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-10 sm:mt-14 lg:grid-cols-12">
          {/* Why + experience + gate */}
          <Reveal delay={0.08} className="lg:col-span-5">
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${kicker}`}
            >
              Why this phase exists
            </p>
            <p
              className={`mt-3 text-[15px] leading-relaxed sm:text-base ${body}`}
            >
              {phase.why}
            </p>
            <p
              className={`mt-7 text-[10px] font-semibold uppercase tracking-[0.2em] ${kicker}`}
            >
              What it asks of you
            </p>
            <p className={`mt-3 text-[14px] leading-relaxed ${soft}`}>
              {phase.experience}
            </p>
            <div className="mt-8 border-l-2 border-rust pl-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rust">
                The gate: {phase.gateName}
              </p>
              <p className={`mt-2.5 text-[14px] leading-relaxed ${body}`}>
                {phase.gate}
              </p>
            </div>
          </Reveal>

          {/* Workstreams + artifacts */}
          <Reveal delay={0.16} className="lg:col-span-7">
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${kicker}`}
            >
              Workstreams
            </p>
            <ol className="mt-1">
              {phase.workstreams.map((ws) => (
                <li
                  key={ws.code}
                  className={`grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 border-b py-3.5 last:border-b-0 sm:grid-cols-[3.5rem_minmax(0,1fr)] ${rule}`}
                >
                  <span
                    className={`pt-[0.2em] text-[11px] font-semibold tabular-nums tracking-[0.08em] ${
                      dark ? "text-clay" : "text-rust"
                    }`}
                  >
                    {ws.code}
                  </span>
                  <span>
                    <span
                      className={`block text-[15px] font-medium tracking-[-0.01em] ${
                        dark ? "text-paper" : "text-ink"
                      }`}
                    >
                      {ws.name}
                    </span>
                    <span
                      className={`mt-0.5 block text-[13px] leading-relaxed ${soft}`}
                    >
                      {ws.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <p
              className={`mt-7 text-[10px] font-semibold uppercase tracking-[0.2em] ${kicker}`}
            >
              You leave with
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {phase.artifacts.map((artifact) => (
                <li
                  key={artifact}
                  className={`rounded-full border px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] ${
                    dark
                      ? "border-paper/25 text-paper/70"
                      : "border-line bg-paper text-ink/75"
                  }`}
                >
                  {artifact}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Hand-off */}
        {phase.handoff && (
          <Reveal className="mt-14 flex items-center gap-3">
            <span
              aria-hidden
              className={`h-6 w-px ${dark ? "bg-clay" : "bg-brand"}`}
            />
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                dark ? "text-clay" : "text-brand"
              }`}
            >
              {phase.handoff}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default function MethodologyPage() {
  return (
    <main className="bg-ink text-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <MethodHud />

      {/* ------------------------------------------------ The cover */}
      <section
        aria-labelledby="method-hero-heading"
        className="grain relative overflow-hidden"
      >
        <div className="relative mx-auto flex min-h-[86vh] w-full max-w-[1440px] flex-col justify-between px-5 pb-10 pt-14 sm:px-8 lg:px-12 lg:pt-20">
          {/* Manual meta line */}
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/45">
            <span className="flex items-center gap-2">
              <Spark className="size-3 text-brand" aria-hidden />
              Plurel &middot; the method
            </span>
            <span className="hidden sm:block">MTD&middot;04</span>
            <span>Four phases &middot; one team</span>
          </div>

          {/* The claim — sans display, matching the homepage headline system */}
          <div className="py-16 sm:py-20">
            <h1
              id="method-hero-heading"
              className="max-w-[14ch] font-sans text-[clamp(3rem,8vw,7.5rem)] font-normal leading-[0.95] tracking-[-0.02em] text-paper"
            >
              <Cascade text="Presence," base={0.08} step={0.045} />{" "}
              <em className="italic text-clay">
                <Cascade
                  text="engineered."
                  base={0.08}
                  step={0.045}
                  offset={1}
                />
              </em>
            </h1>
            <p className="fade-up mt-8 max-w-[56ch] text-[15px] leading-relaxed text-paper/65 sm:text-base [animation-delay:250ms]">
              The Plurel Method runs every engagement in four phases, from
              the first Diagnostic to a monthly partnership judged on
              qualified demand. Diagnosed like an audit, designed like a
              product, shipped like software, and run like an investment.
            </p>
          </div>

          {/* Phase index — the table of contents */}
          <div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-paper/15 pt-5 sm:flex sm:flex-wrap sm:items-baseline sm:justify-between">
              {PHASES.map((phase) => (
                <p
                  key={phase.number}
                  className="text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/60"
                >
                  <span className="pr-2 tabular-nums text-brand">
                    {phase.number}
                  </span>
                  {phase.name}
                  <span className="block pt-1 text-paper/35 sm:inline sm:pl-2 sm:pt-0">
                    {phase.window}
                  </span>
                </p>
              ))}
            </div>
            <p
              aria-hidden
              className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/35"
            >
              The engagement runs top to bottom &darr;
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- The conviction */}
      <section aria-label="Why a method exists" className="border-t border-paper/10">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
          <Reveal className="max-w-[880px]">
            <p className="font-sans text-[clamp(1.9rem,4.6vw,3.75rem)] font-normal leading-[1.15] tracking-[-0.02em] text-paper">
              Deliverables don&rsquo;t compound.{" "}
              <em className="italic text-clay">Systems do.</em>
            </p>
            <p className="mt-8 max-w-[54ch] text-[15px] leading-relaxed text-paper/60 sm:text-base">
              The method exists so every piece we ship, from the brand to a
              single campaign, connects to the rest and is measured on the
              same terms, with one team answering for it. Qualified demand is
              the number we answer for, and five supporting signals tell us
              why it moved. Every quarter they feed the next diagnosis.
            </p>
            <p className="mt-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/40">
              <span aria-hidden className="text-brand">
                &#8634;
              </span>
              Every quarter, the loop closes
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------ Operating laws */}
      <section
        aria-labelledby="laws-heading"
        className="border-t border-paper/10"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <Reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
            <h2
              id="laws-heading"
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/45"
            >
              The operating laws &middot; L&middot;01&ndash;06
            </h2>
            <p className="max-w-[38ch] text-[13px] leading-relaxed text-paper/50">
              These are constraints. Work that breaks one doesn&rsquo;t
              ship.
            </p>
          </Reveal>
          <div className="mt-8 border-b border-paper/12">
            <ol className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-20">
              {LAWS.map((law) => (
                <li
                  key={law.code}
                  className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 border-t border-paper/12 py-6"
                >
                  <span className="pt-[0.5em] text-[11px] font-semibold tabular-nums tracking-[0.08em] text-clay">
                    {law.code}
                  </span>
                  <span>
                    <span className="block font-sans text-[clamp(1.6rem,2.6vw,2.1rem)] font-normal leading-tight tracking-[-0.015em] text-paper">
                      {law.name}
                    </span>
                    <span className="mt-2 block max-w-[46ch] text-[14px] leading-relaxed text-paper/55">
                      {law.rule}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* -------------------------------- Acts 01–02, in the dark */}
      <div className="border-t border-paper/10">
        <PhaseAct phase={PHASES[0]} dark />
      </div>
      <div className="border-t border-paper/10">
        <PhaseAct phase={PHASES[1]} dark />
      </div>

      {/* ------------------------- The lights come on — WK 05 */}
      <div
        aria-hidden
        className="h-40 w-full sm:h-56"
        style={{
          background:
            "linear-gradient(to bottom, #110f0a, #20201e 30%, #8f8981 72%, #ece8df)",
        }}
      />
      <section aria-label="The system goes live" className="bg-canvas text-ink">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-6 pt-2 text-center sm:px-8 lg:px-12">
          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
              WK 05: the work goes live
            </p>
            <p className="mx-auto mt-5 max-w-[22ch] font-sans text-[clamp(1.9rem,4.6vw,3.5rem)] font-normal italic leading-[1.1] tracking-[-0.02em] text-ink">
              This is where you become visible.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ Acts 03–04, in daylight */}
      <div className="bg-canvas text-ink">
        <PhaseAct phase={PHASES[2]} dark={false} />
        <PhaseAct phase={PHASES[3]} dark={false} />

        {/* ------------------------------------- Operating rhythm */}
        <section
          aria-labelledby="rhythm-heading"
          className="border-t border-line"
        >
          <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <Reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
              <h2
                id="rhythm-heading"
                className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted"
              >
                The rhythm it runs on &middot; RTM&middot;04
              </h2>
              <p className="max-w-[40ch] text-[13px] leading-relaxed text-muted">
                Four rituals carry every engagement. The cadence is the
                contract.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="mt-8">
              <div className="overflow-hidden rounded-3xl border border-line">
                <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
                  {RHYTHM.map((ritual, i) => (
                    <div key={ritual.cadence} className="bg-paper p-6 sm:p-7">
                      <p className="flex items-center justify-between text-[9.5px] font-semibold uppercase tracking-[0.18em]">
                        <span className="text-brand">{ritual.cadence}</span>
                        <span className="tabular-nums text-muted/70">
                          R&middot;0{i + 1}
                        </span>
                      </p>
                      <p className="mt-4 text-[16px] font-medium tracking-[-0.01em] text-ink sm:text-[17px]">
                        {ritual.name}
                      </p>
                      <p className="mt-1.5 min-h-[3lh] text-[13px] leading-relaxed text-muted">
                        {ritual.detail}
                      </p>
                      <p className="mt-4 border-t border-dashed border-line pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                        Output: {ritual.output}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-line bg-paper px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  <span>The work is the update</span>
                  <span className="flex items-center gap-2">
                    <Spark className="size-3 text-brand" aria-hidden />A
                    Plurel operating standard
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ----------------------------------------- The instruments */}
        <section
          aria-labelledby="instruments-heading"
          className="border-t border-line"
        >
          <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <Reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
              <h2
                id="instruments-heading"
                className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted"
              >
                The instruments it runs with
              </h2>
              <p className="max-w-[40ch] text-[13px] leading-relaxed text-muted">
                Published here in full, before you ever talk to us.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="mt-8">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch lg:gap-0">
                {[
                  {
                    code: "MTD·04",
                    name: "The Method",
                    desc: "The four phases every engagement runs: Diagnose, Design, Deploy, Compound.",
                    href: null,
                    label: "This page",
                  },
                  {
                    code: "SYS·09",
                    name: "The Growth System",
                    desc: "The nine layers the method builds, from brand and website to reputation.",
                    href: "/#distribution",
                    label: "See the system",
                  },
                  {
                    code: "NUM·01",
                    name: "The One Number",
                    desc: "Qualified demand, read monthly and reset every quarter, with five supporting signals that explain why it moved.",
                    href: null,
                    label: "Explained in the FAQ below",
                  },
                ].map((plate, i) => (
                  <div key={plate.code} className="contents">
                    {i > 0 && (
                      <div
                        aria-hidden
                        className="hidden items-center px-2 lg:flex"
                      >
                        <div className="flex w-20 flex-col items-center gap-1.5">
                          <span className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
                            {i === 1 ? "Builds" : "Steered by"}
                          </span>
                          <svg
                            className="h-2 w-full"
                            viewBox="0 0 64 8"
                            fill="none"
                          >
                            <line
                              x1="0"
                              y1="4"
                              x2="58"
                              y2="4"
                              stroke="var(--color-muted)"
                              strokeOpacity="0.6"
                              strokeWidth="1"
                              strokeDasharray="3 5"
                            />
                            <path
                              d="M58 1 L63 4 L58 7"
                              stroke="var(--color-muted)"
                              strokeWidth="1"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col rounded-2xl border border-line bg-paper p-5 sm:p-6">
                      <p className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em]">
                        <span className="tabular-nums text-muted">
                          {plate.code}
                        </span>
                        <Spark className="size-3 text-brand" aria-hidden />
                      </p>
                      <p className="mt-4 text-[17px] font-medium tracking-[-0.01em] text-ink">
                        {plate.name}
                      </p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                        {plate.desc}
                      </p>
                      <p className="mt-5 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em]">
                        {plate.href ? (
                          <Link
                            href={plate.href}
                            className="group inline-flex items-center gap-1.5 text-ink/70 transition-colors hover:text-brand"
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
              <p className="mt-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                <span aria-hidden className="text-brand">
                  &#8634;
                </span>
                Signals feed the next diagnosis
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------------------------------------------------- FAQ */}
        <section
          aria-labelledby="method-faq-heading"
          className="border-t border-line"
        >
          <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-12">
              <Reveal className="lg:col-span-4">
                <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                  <Spark className="size-3.5 text-brand" aria-hidden />
                  Before the first gate
                </p>
                <h2
                  id="method-faq-heading"
                  className="mt-5 max-w-[14ch] font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
                >
                  The questions clients ask first.
                </h2>
                <p className="mt-6 max-w-[36ch] text-[14px] leading-relaxed text-muted">
                  Anything else, ask us when you request your diagnostic.
                  You&rsquo;ll get a straight answer either way.
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
      </div>

      {/* ------------------------------------------------ Closing */}
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
              WK 00 starts whenever you do
            </p>
            <h2
              id="method-cta-heading"
              className="mt-6 max-w-[22ch] font-sans text-[clamp(2rem,4.8vw,4rem)] font-normal leading-[1.05] tracking-[-0.02em]"
            >
              Your diagnosis is the{" "}
              <em className="italic">first deliverable</em>.
            </h2>
            <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-paper/85 sm:text-base">
              Every engagement starts with the Diagnostic: the six parts of
              your distribution scored, and the first fix named, within a
              business day. It&rsquo;s free, and yours to keep whatever you decide.
              The paid work starts after it.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-lg bg-paper px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-canvas"
              >
                Request a diagnostic
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/#distribution"
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
