import type { Metadata } from "next";
import Link from "next/link";
import { Cascade } from "@/components/cascade";
import { ArrowUpRight, Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { StatementSection } from "@/components/statement-section";

export const metadata: Metadata = {
  title: "Careers — Plurel",
  description:
    "Join a small senior team building the visible layer of growth — brand, web, AI search, content, and campaigns that ship publicly and compound. Open roles at Plurel, a Northeon division.",
  alternates: { canonical: "/careers/" },
};

const PRINCIPLES = [
  {
    code: "W·01",
    name: "Small and senior",
    rule: "No bench, no account layer — the person in the room does the work.",
  },
  {
    code: "W·02",
    name: "The method is the manager",
    rule: "The same model clients buy runs us — phases, gates, weekly ships.",
  },
  {
    code: "W·03",
    name: "Writing over meetings",
    rule: "Ship notes beat standups. The work is the update.",
  },
  {
    code: "W·04",
    name: "Craft is the bar",
    rule: "Everything ships publicly. Portfolio-grade or it doesn't go out.",
  },
  {
    code: "W·05",
    name: "Compound yourself",
    rule: "Time and budget to learn and publish — your visibility compounds too.",
  },
];

const QUALITIES = [
  {
    number: "01",
    name: "Craft",
    detail:
      "You've shipped work you'd sign. You sweat details other people don't notice — until they do.",
  },
  {
    number: "02",
    name: "Ownership",
    detail:
      "You run a lane end to end: scope it, ship it, stand behind it. Nobody has to chase you.",
  },
  {
    number: "03",
    name: "Range",
    detail:
      "Deep in your discipline, curious about the rest of the system. You can talk brand and pipeline in one sentence.",
  },
];

const ROLES = [
  {
    code: "R·01",
    name: "Founding Brand Designer",
    discipline: "Brand & identity systems",
    type: "Full-time",
    location: "Remote",
  },
  {
    code: "R·02",
    name: "Growth Engineer",
    discipline: "Martech, automation & analytics",
    type: "Full-time",
    location: "Remote",
  },
  {
    code: "R·03",
    name: "Content Strategist",
    discipline: "Editorial, AEO & founder POV",
    type: "Contract to hire",
    location: "Remote",
  },
];

const PROCESS = [
  {
    number: "01",
    name: "Intro call — 30 minutes",
    detail:
      "Mutual fit, honest about where we are as a company and where you are in your career.",
  },
  {
    number: "02",
    name: "Craft conversation",
    detail:
      "Walk us through real work you've shipped. If useful, a short paid exercise — never spec work.",
  },
  {
    number: "03",
    name: "Decision in days",
    detail:
      "An offer, or a straight no with reasons. Two weeks start to finish — your time is respected.",
  },
];

export default function CareersPage() {
  return (
    <main>
      {/* ------------------------------------------------ Hero */}
      <section aria-labelledby="careers-heading">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-12 sm:px-8 lg:px-12 lg:pb-16 lg:pt-20">
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
            <div className="max-w-[720px]">
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                <Spark className="size-3.5 text-brand" aria-hidden />
                Careers at Plurel
              </p>
              <h1
                id="careers-heading"
                className="mt-5 max-w-[14ch] font-sans text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-[1.02] tracking-[-0.02em] text-ink"
              >
                <Cascade text="Do work people" base={0.08} step={0.045} />{" "}
                <em className="italic">
                  <Cascade
                    text="actually see."
                    base={0.08}
                    step={0.045}
                    offset={3}
                  />
                </em>
              </h1>
              <p className="fade-up mt-6 max-w-[56ch] text-[15px] leading-relaxed text-ink/80 sm:text-base [animation-delay:250ms]">
                We&rsquo;re the small senior team inside Northeon building the
                visible layer of growth &mdash; brand, web, AI search,
                content, and campaigns that ship publicly and compound. If
                you want your work in the world rather than in a deck,
                you&rsquo;ll like it here.
              </p>
            </div>

            {/* Title block */}
            <Reveal delay={0.12} className="hidden sm:block">
              <dl
                aria-label="Team summary"
                className="w-[248px] rounded-xl border border-line bg-paper text-[10px] font-semibold uppercase tracking-[0.16em]"
              >
                <div className="flex items-center justify-between px-4 py-2.5">
                  <dt className="text-muted">The team</dt>
                  <dd className="flex items-center gap-1.5 text-ink">
                    <Spark className="size-3 text-brand" aria-hidden />
                    Small &middot; senior
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                  <dt className="text-muted">Management layers</dt>
                  <dd className="tabular-nums text-ink">00</dd>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                  <dt className="text-muted">Cadence</dt>
                  <dd className="text-ink">Weekly ships</dd>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                  <dt className="text-muted">Open roles</dt>
                  <dd className="tabular-nums text-brand">
                    {String(ROLES.length).padStart(2, "0")}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------ How we work */}
      <section
        aria-labelledby="how-we-work-heading"
        className="border-t border-line bg-paper"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                <Spark className="size-3.5 text-brand" aria-hidden />
                How we work
              </p>
              <h2
                id="how-we-work-heading"
                className="mt-5 max-w-[24ch] font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
              >
                Run on the method, not on meetings.
              </h2>
            </div>
            <p className="max-w-[40ch] text-[14px] leading-relaxed text-muted">
              The same operating model we sell is the one we work inside
              &mdash; read it before you apply.
            </p>
          </Reveal>

          <div className="mt-10 border-b border-line sm:mt-12">
            <ol className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-16">
              {PRINCIPLES.map((principle) => (
                <li
                  key={principle.code}
                  className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 border-t border-line py-5 sm:py-6"
                >
                  <span className="pt-[0.35em] text-[11px] font-semibold tabular-nums tracking-[0.08em] text-brand">
                    {principle.code}
                  </span>
                  <span>
                    <span className="block text-[clamp(1.5rem,2.4vw,2rem)] font-normal leading-tight tracking-[-0.01em] text-ink">
                      {principle.name}
                    </span>
                    <span className="mt-2 block max-w-[46ch] text-[14px] leading-relaxed text-muted">
                      {principle.rule}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <Reveal className="mt-8">
            <Link
              href="/methodology"
              className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-brand"
            >
              Read the full methodology
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------- What we look for */}
      <section
        aria-labelledby="look-for-heading"
        className="border-t border-line"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              <Spark className="size-3.5 text-brand" aria-hidden />
              What we look for
            </p>
            <h2
              id="look-for-heading"
              className="mt-5 max-w-[22ch] font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
            >
              Three things, in every seat.
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 sm:mt-12 sm:grid-cols-3">
            {QUALITIES.map((quality, i) => (
              <Reveal
                key={quality.number}
                delay={i * 0.08}
                className={`border-t border-line py-6 sm:py-2 sm:pt-6 ${
                  i > 0 ? "sm:border-l sm:pl-8" : ""
                } ${i < QUALITIES.length - 1 ? "sm:pr-8" : ""}`}
              >
                <p className="text-[11px] font-semibold tabular-nums tracking-[0.08em] text-brand">
                  {quality.number}
                </p>
                <p className="mt-3 text-[21px] font-normal tracking-[-0.01em] text-ink sm:text-2xl">
                  {quality.name}
                </p>
                <p className="mt-2 max-w-[38ch] text-[13.5px] leading-relaxed text-muted">
                  {quality.detail}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------- The deal */}
      <StatementSection
        kicker="The deal"
        note="W·01–05 — how we work, in practice"
        surface="ink"
      >
        No bench. No layers.{" "}
        <em className="italic text-clay">No busywork.</em>
      </StatementSection>

      {/* ------------------------------------------- Open roles */}
      <section
        aria-labelledby="roles-heading"
        className="border-t border-line bg-paper"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                <Spark className="size-3.5 text-brand" aria-hidden />
                Open roles
              </p>
              <h2
                id="roles-heading"
                className="mt-5 font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
              >
                {String(ROLES.length).padStart(2, "0")} seats open.
              </h2>
            </div>
            <p className="max-w-[40ch] text-[14px] leading-relaxed text-muted">
              Applications by email &mdash; a short note and links to shipped
              work beat any résumé format.
            </p>
          </Reveal>

          <div className="mt-10 border-b border-line sm:mt-12">
            <ol>
              {ROLES.map((role) => (
                <li key={role.code} className="border-t border-line">
                  <a
                    href={`mailto:hello@plurel.com?subject=${encodeURIComponent(
                      `Application — ${role.name}`,
                    )}`}
                    className="group grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-x-4 py-5 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:gap-x-6 sm:py-6"
                  >
                    <span className="text-[11px] font-semibold tabular-nums tracking-[0.08em] text-muted">
                      {role.code}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[clamp(1.3rem,1.9vw,1.65rem)] font-normal leading-tight tracking-[-0.01em] text-ink transition-colors duration-300 group-hover:text-brand">
                        {role.name}
                      </span>
                      <span className="mt-1 block text-[13px] leading-snug text-muted">
                        {role.discipline}
                        <span className="px-2 text-line">/</span>
                        {role.type}
                        <span className="px-2 text-line">/</span>
                        {role.location}
                      </span>
                    </span>
                    <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors duration-300 group-hover:text-brand">
                      <span className="hidden sm:inline">Apply</span>
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>

          <Reveal className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
            <p className="max-w-[52ch] text-[13px] leading-relaxed text-muted">
              No fit above? Introduce yourself anyway &mdash; the best hires
              rarely match a listing.
            </p>
            <a
              href="mailto:hello@plurel.com?subject=Introduction"
              className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-brand"
            >
              hello@plurel.com
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------ The process */}
      <section
        aria-labelledby="hiring-heading"
        className="bg-ink text-paper"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal className="max-w-[640px]">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
              <Spark className="size-3.5 text-brand" aria-hidden />
              How hiring works
            </p>
            <h2
              id="hiring-heading"
              className="mt-5 font-sans text-[clamp(2rem,4.4vw,3.75rem)] font-normal leading-[1.05] tracking-[-0.02em]"
            >
              Two weeks, <em className="italic text-clay">start to finish</em>.
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-12 sm:mt-14">
            <div className="overflow-hidden rounded-3xl border border-paper/15">
              <div className="flex items-center justify-between border-b border-paper/15 px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em]">
                <span className="text-paper/50">
                  Hiring process &mdash; every candidate
                </span>
                <span className="flex items-center gap-1.5 text-paper/80">
                  <Spark className="size-3 text-brand" aria-hidden />
                  HRG&middot;03
                </span>
              </div>
              <div className="grid grid-cols-1 gap-px bg-paper/15 lg:grid-cols-3">
                {PROCESS.map((step) => (
                  <div key={step.number} className="bg-ink p-6 sm:p-7">
                    <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-brand">
                      Step {step.number}
                    </p>
                    <p className="mt-4 text-[16px] font-medium tracking-[-0.01em] text-paper sm:text-[17px]">
                      {step.name}
                    </p>
                    <p className="mt-1.5 min-h-[3lh] text-[13px] leading-relaxed text-paper/55">
                      {step.detail}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-paper/15 px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/45">
                <span>We reply to every application</span>
                <span className="flex items-center gap-2">
                  <Spark className="size-3 text-brand" aria-hidden />A Plurel
                  operating standard
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ Closing */}
      <section
        aria-labelledby="careers-cta-heading"
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
              One email starts it
            </p>
            <h2
              id="careers-cta-heading"
              className="mt-6 max-w-[20ch] font-sans text-[clamp(2rem,4.8vw,4rem)] font-normal leading-[1.05] tracking-[-0.02em]"
            >
              Introduce yourself &mdash; show us something{" "}
              <em className="italic">you shipped</em>.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-paper/85 sm:text-base">
              A short note, links to real work, and what you want to own.
              We&rsquo;ll reply within one business day &mdash; every time.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
              <a
                href="mailto:hello@plurel.com?subject=Introduction"
                className="group inline-flex items-center gap-2 rounded-lg bg-paper px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-canvas"
              >
                Introduce Yourself
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <Link
                href="/methodology"
                className="border-b border-paper/40 pb-0.5 text-sm text-paper transition-colors hover:border-paper"
              >
                Read the method you&rsquo;ll run
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
