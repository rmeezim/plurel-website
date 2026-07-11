import type { Metadata } from "next";
import Link from "next/link";
import { Cascade } from "@/components/cascade";
import { ArrowUpRight, Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { StatementSection } from "@/components/statement-section";

export const metadata: Metadata = {
  title: "The Studio — Plurel",
  description:
    "Inside the Plurel studio: one room of designers, engineers, and editors on the same method — brand, digital design and build, editorial and AEO, growth and martech — shipping the visible layer weekly.",
  alternates: { canonical: "/studio/" },
};

const DISCIPLINES = [
  {
    code: "D·01",
    name: "Brand & identity",
    line: "Positioning, identity systems, and voice.",
  },
  {
    code: "D·02",
    name: "Design & build",
    line: "Editorial websites, engineered to convert.",
  },
  {
    code: "D·03",
    name: "Editorial & AEO",
    line: "Content people read and machines cite.",
  },
  {
    code: "D·04",
    name: "Growth & martech",
    line: "Campaigns, CRM, automation, and signals.",
  },
];

const STACK = [
  { name: "Figma", className: "font-semibold tracking-[0.08em]" },
  { name: "Next.js", className: "font-medium tracking-[0.02em]" },
  { name: "Tailwind", className: "tracking-[0.16em] uppercase text-[13px]" },
  { name: "Vercel", className: "font-semibold uppercase tracking-[0.2em] text-[13px]" },
  { name: "HubSpot", className: "font-medium tracking-[0.04em]" },
  { name: "Segment", className: "tracking-[0.12em] uppercase text-[13px]" },
  { name: "GA4", className: "font-semibold tracking-[0.14em]" },
  { name: "Linear", className: "font-medium uppercase tracking-[0.24em] text-[13px]" },
  { name: "Notion", className: "font-semibold tracking-[0.02em]" },
];

export default function StudioPage() {
  return (
    <main>
      {/* ------------------------------------------------ Hero */}
      <section aria-labelledby="studio-heading">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-12 sm:px-8 lg:px-12 lg:pb-16 lg:pt-20">
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
            <div className="max-w-[720px]">
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                <Spark className="size-3.5 text-brand" aria-hidden />
                The Studio
              </p>
              <h1
                id="studio-heading"
                className="mt-5 max-w-[14ch] font-sans text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-[1.02] tracking-[-0.02em] text-ink"
              >
                <Cascade text="Where the work" base={0.08} step={0.045} />{" "}
                <em className="italic">
                  <Cascade
                    text="gets made."
                    base={0.08}
                    step={0.045}
                    offset={3}
                  />
                </em>
              </h1>
              <p className="fade-up mt-6 max-w-[54ch] text-[15px] leading-relaxed text-ink/80 sm:text-base [animation-delay:250ms]">
                One room &mdash; designers, engineers, and editors on the same
                method, shipping the visible layer weekly.
              </p>
            </div>

            {/* Title block */}
            <Reveal delay={0.12} className="hidden sm:block">
              <dl
                aria-label="Studio summary"
                className="w-[248px] rounded-xl border border-line bg-paper text-[10px] font-semibold uppercase tracking-[0.16em]"
              >
                <div className="flex items-center justify-between px-4 py-2.5">
                  <dt className="text-muted">Disciplines</dt>
                  <dd className="flex items-center gap-1.5 tabular-nums text-ink">
                    <Spark className="size-3 text-brand" aria-hidden />
                    04
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                  <dt className="text-muted">Runs on</dt>
                  <dd className="text-ink">MTD&middot;04</dd>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                  <dt className="text-muted">Cadence</dt>
                  <dd className="text-ink">Weekly ships</dd>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                  <dt className="text-muted">Doors</dt>
                  <dd className="text-brand">New York &middot; remote</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------ Disciplines */}
      <section
        aria-labelledby="disciplines-heading"
        className="border-t border-line bg-paper"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              <Spark className="size-3.5 text-brand" aria-hidden />
              Four disciplines, one desk
            </p>
            <h2
              id="disciplines-heading"
              className="mt-5 max-w-[22ch] font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
            >
              Everything the system needs, in-house.
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {DISCIPLINES.map((discipline, i) => (
              <Reveal
                key={discipline.code}
                delay={i * 0.07}
                className={`border-t border-line py-6 lg:pb-2 ${
                  i > 0 ? "lg:border-l lg:pl-8" : ""
                } ${i < DISCIPLINES.length - 1 ? "lg:pr-8" : ""}`}
              >
                <p className="text-[11px] font-semibold tabular-nums tracking-[0.08em] text-brand">
                  {discipline.code}
                </p>
                <p className="mt-3 text-[clamp(1.4rem,2vw,1.75rem)] font-normal leading-tight tracking-[-0.01em] text-ink">
                  {discipline.name}
                </p>
                <p className="mt-2 max-w-[30ch] text-[14px] leading-relaxed text-muted">
                  {discipline.line}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------- The creed */}
      <StatementSection
        kicker="The craft creed"
        note="Portfolio-grade or it doesn't ship"
        surface="ink"
      >
        Made by hand. <em className="italic text-clay">Run as a system.</em>
      </StatementSection>

      {/* ------------------------------------------ The wall */}
      <section aria-label="The studio wall" className="border-t border-line">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
              The wall &mdash; surfaces in progress
            </h2>
            <p className="max-w-[40ch] text-[13px] leading-relaxed text-muted">
              Composed in the house material language &mdash; photography
              joins as the studio does.
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Identity surface */}
            <Reveal>
              <div
                aria-hidden
                className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-ink"
              >
                <Spark className="absolute -right-12 -top-16 size-[240px] rotate-12 text-paper/[0.07]" />
                <p className="absolute left-6 top-6 font-serif text-3xl leading-[1.05] text-paper">
                  Aa
                </p>
                <span className="absolute bottom-5 left-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/45">
                  Identity &mdash; systems, not logos
                </span>
              </div>
            </Reveal>
            {/* Light study */}
            <Reveal delay={0.08}>
              <div
                aria-hidden
                className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-clay"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(112deg, rgba(251,250,246,0.55) 0%, rgba(251,250,246,0.14) 36%, rgba(251,250,246,0) 58%), linear-gradient(to top, rgba(17,15,10,0.18), rgba(17,15,10,0) 44%)",
                  }}
                />
                <span className="absolute bottom-5 left-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/55">
                  The room &mdash; work in progress
                </span>
              </div>
            </Reveal>
            {/* Campaign surface */}
            <Reveal delay={0.16}>
              <div
                aria-hidden
                className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-brand"
              >
                <span className="absolute left-6 top-6 inline-flex size-10 items-center justify-center rounded-full border border-paper/40">
                  <Spark className="size-5 text-paper" />
                </span>
                <p className="absolute bottom-14 left-6 font-serif text-3xl leading-[1.05] text-paper">
                  Made to
                  <br />
                  be kept.
                </p>
                <span className="absolute bottom-5 left-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/60">
                  Campaigns &mdash; with a point of view
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- The desk */}
      <section
        aria-labelledby="stack-heading"
        className="border-t border-line bg-paper"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-12">
          <Reveal className="flex flex-wrap items-center justify-between gap-x-12 gap-y-6">
            <h2
              id="stack-heading"
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted"
            >
              The desk &mdash; what the studio runs on
            </h2>
            <ul className="flex flex-wrap items-baseline gap-x-9 gap-y-4 text-[15px] text-muted">
              {STACK.map((tool) => (
                <li
                  key={tool.name}
                  className={`transition-colors hover:text-ink ${tool.className}`}
                >
                  {tool.name}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------ Keep exploring */}
      <section aria-label="Keep exploring" className="border-t border-line">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <Reveal>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                href="/careers"
                className="group flex flex-col rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-ink/25 sm:p-6"
              >
                <p className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em]">
                  <span className="tabular-nums text-muted">CRW</span>
                  <Spark className="size-3 text-brand" aria-hidden />
                </p>
                <p className="mt-4 text-[17px] font-medium tracking-[-0.01em] text-ink">
                  Join the studio
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  Small, senior, no layers &mdash; seats open.
                </p>
                <p className="mt-5 flex items-center gap-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/70 transition-colors group-hover:text-brand">
                  See open roles
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </p>
              </Link>
              <Link
                href="/methodology"
                className="group flex flex-col rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-ink/25 sm:p-6"
              >
                <p className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em]">
                  <span className="tabular-nums text-muted">MTD&middot;04</span>
                  <Spark className="size-3 text-brand" aria-hidden />
                </p>
                <p className="mt-4 text-[17px] font-medium tracking-[-0.01em] text-ink">
                  How the studio runs
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  The four-phase operating model, published in full.
                </p>
                <p className="mt-5 flex items-center gap-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/70 transition-colors group-hover:text-brand">
                  Read the methodology
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </p>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ Closing */}
      <section
        aria-labelledby="studio-cta-heading"
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
              Commission the studio
            </p>
            <h2
              id="studio-cta-heading"
              className="mt-6 max-w-[18ch] font-sans text-[clamp(2rem,4.8vw,4rem)] font-normal leading-[1.05] tracking-[-0.02em]"
            >
              Bring us the <em className="italic">before</em>.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-paper/85 sm:text-base">
              Book the strategy call &mdash; the audit tells us both where
              the work should start.
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
                href="/work"
                className="border-b border-paper/40 pb-0.5 text-sm text-paper transition-colors hover:border-paper"
              >
                See the afters
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
