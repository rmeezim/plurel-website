import type { Metadata } from "next";
import Link from "next/link";
import { Cascade } from "@/components/cascade";
import { ArrowUpRight, CircledX, Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { StatementSection } from "@/components/statement-section";

export const metadata: Metadata = {
  title: "Case Studies — Plurel",
  description:
    "Transformations, with the numbers: how Plurel takes businesses from outdated presence to compounding growth systems — brand, website, AI search, content, and the martech underneath.",
  alternates: { canonical: "/work/" },
};

/*
 * The case ledger. Each engagement is told the way the method runs it —
 * the situation, the system built (which SYS·09 layers), the outcome —
 * with the same Before / Built / After framing the homepage introduces.
 * Visual compositions are the house placeholder art shared with the
 * homepage work section, scaled up to chapter size.
 */

type CaseStudy = {
  code: string;
  slug: string;
  name: string;
  sector: string;
  year: string;
  scope: string;
  line: string;
  before: string;
  built: string;
  after: string;
  metricValue: string;
  metricLabel: string;
  facts: [string, string];
  layers: string[];
  quote: string;
  attribution: string;
  weeks: string;
};

const CASES: CaseStudy[] = [
  {
    code: "CS·01",
    slug: "aurem",
    name: "Aurem",
    sector: "Design studio",
    year: "2025",
    scope: "Brand identity · Website · AI search",
    line: "A studio whose work outclassed its presence.",
    before:
      "A strong portfolio behind a dated identity — referrals converted, strangers bounced, search never surfaced them.",
    built:
      "An identity system, an editorial website, and a machine-readable case library built for the engines that answer buyers.",
    after:
      "Premium perception, better-fit pipeline — qualified inquiries up 212% in two quarters.",
    metricValue: "+212%",
    metricLabel: "qualified inquiries",
    facts: ["Launch in seven weeks", "Cited case library, AEO-ready"],
    layers: ["01 Brand", "02 Website", "03 AI Search"],
    quote:
      "Plurel made us look like the studio we actually are — and the right clients started finding us on their own.",
    attribution: "Founder, Aurem",
    weeks: "WK 00 → 07 to launch · compounding since",
  },
  {
    code: "CS·02",
    slug: "fence-labs",
    name: "Fence Labs",
    sector: "Consumer wellness",
    year: "2025",
    scope: "Brand · Packaging · Launch campaign",
    line: "A better formula stuck on a generic shelf.",
    before:
      "A better product with generic packaging, flat pages, and paid spend buying attention the brand couldn't hold.",
    built:
      "A brand world, a packaging system, launch art direction, and a conversion pass across the DTC funnel.",
    after:
      "Category-distinct at arm's length — DTC conversion up 64% after launch.",
    metricValue: "+64%",
    metricLabel: "DTC conversion",
    facts: ["Launch in nine weeks", "Creative-testing harness live"],
    layers: ["01 Brand", "02 Website", "05 Paid Growth"],
    quote:
      "The rebrand paid for itself inside the first quarter — on conversion alone.",
    attribution: "CEO, Fence Labs",
    weeks: "WK 00 → 09 to launch · compounding since",
  },
  {
    code: "CS·03",
    slug: "northgate-legal",
    name: "Northgate Legal",
    sector: "Law firm — est. 1962",
    year: "2024",
    scope: "Website · AEO/SEO · Editorial",
    line: "Sixty years of counsel, invisible to anyone who searched.",
    before:
      "Referral-only pipeline, page-four rankings — sixty years of authority, unreadable to machines.",
    built:
      "A new website with a full schema layer, an AEO program, and counsel-led monthly editorial.",
    after:
      "The cited answer in its region — visibility up 185%, inbound carrying half of new matters.",
    metricValue: "+185%",
    metricLabel: "search visibility",
    facts: ["Cited by AI assistants", "Inbound ≈ half of new matters"],
    layers: ["02 Website", "03 AI Search", "04 Content"],
    quote:
      "We stopped explaining who we are. People arrive already knowing — and already convinced.",
    attribution: "Managing Partner, Northgate Legal",
    weeks: "WK 00 → 11 to launch · compounding since",
  },
  {
    code: "CS·04",
    slug: "mara-atelier",
    name: "Mara Atelier",
    sector: "Fashion house",
    year: "2024",
    scope: "Brand · Content · Email & CRM",
    line: "Beautiful product, a brand too flat to keep anyone.",
    before:
      "One-time buyers and an email list treated as a discount channel — no voice, no world to belong to.",
    built:
      "A brand voice and campaign system, an editorial engine, and lifecycle email wired into the CRM.",
    after:
      "An audience that stays — email revenue at 2.6× in a year, retention compounding.",
    metricValue: "2.6×",
    metricLabel: "email-driven revenue",
    facts: ["Lifecycle flows live in-house", "Retention compounding"],
    layers: ["01 Brand", "04 Content", "06 CRM", "07 Automation"],
    quote: "Our customers read us now — and then they buy again.",
    attribution: "Creative Director, Mara Atelier",
    weeks: "WK 00 → 10 to launch · compounding since",
  },
];

const WORK_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Plurel case studies",
  itemListElement: CASES.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `${c.name} — ${c.scope}`,
  })),
};

/* House placeholder art — the same compositions as the homepage work
   section, scaled to chapter size */
function CaseVisual({ slug }: { slug: string }) {
  switch (slug) {
    case "aurem":
      return (
        <div className="flex h-full flex-col bg-ink p-7 text-paper sm:p-10">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-paper/55">
            <span className="flex items-center gap-1.5 font-semibold text-paper">
              <CircledX className="size-4" /> Aurem
            </span>
            <span className="flex gap-3">
              <span>Work</span>
              <span>About</span>
              <span>Journal</span>
            </span>
          </div>
          <p className="mt-auto font-serif text-4xl leading-[1.05] sm:text-5xl">
            Strategic<span className="text-brand">*</span>
            <br />
            by design.
          </p>
          <p className="mt-4 max-w-[30ch] text-[13px] leading-relaxed text-paper/60">
            A branding and digital studio crafting considered experiences.
          </p>
        </div>
      );
    case "fence-labs":
      return (
        <div
          className="relative h-full"
          style={{
            backgroundImage:
              "linear-gradient(165deg, #d8cdbb 0%, #c7b49d 55%, #a65a45 100%)",
          }}
        >
          <p className="absolute left-7 top-7 max-w-[16ch] font-serif text-xl leading-snug text-ink/85 sm:left-10 sm:top-10 sm:text-2xl">
            Formulated for daily performance.
          </p>
          <div className="absolute bottom-16 left-1/2 h-36 w-16 -translate-x-1/2 rounded-[12px] bg-ink/85 sm:h-44 sm:w-20">
            <span className="absolute -top-4 left-1/2 h-4 w-7 -translate-x-1/2 rounded-sm bg-ink" />
            <span className="absolute inset-x-2.5 top-[38%] h-11 rounded-[3px] bg-paper/15" />
          </div>
          <p className="absolute bottom-6 left-7 text-[10px] uppercase tracking-[0.2em] text-ink/60 sm:left-10">
            Fence Labs
          </p>
        </div>
      );
    case "northgate-legal":
      return (
        <div className="flex h-full flex-col bg-paper p-7 sm:p-10">
          <div className="flex items-center justify-between border-b border-line pb-3.5 text-[10px] uppercase tracking-[0.2em] text-muted">
            <span>Northgate Legal</span>
            <span>Est. 1962</span>
          </div>
          <div className="flex flex-1 items-center">
            <p className="font-serif text-4xl leading-[1.08] text-ink sm:text-5xl">
              Counsel,
              <br />
              clarified.
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-3.5 text-[10px] uppercase tracking-[0.2em] text-muted">
            <span>Corporate</span>
            <span>Litigation</span>
            <span>Advisory</span>
          </div>
        </div>
      );
    default:
      return (
        <div className="flex h-full flex-col bg-brand p-7 text-paper sm:p-10">
          <span className="inline-flex size-11 items-center justify-center rounded-full border border-paper/40">
            <Spark className="size-5" />
          </span>
          <p className="mt-auto font-serif text-4xl leading-[1.05] sm:text-5xl">
            Made to
            <br />
            be kept.
          </p>
          <div className="mt-7 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-paper/70">
            <span>2024 Brand Campaign</span>
            <span>Mara Atelier</span>
          </div>
        </div>
      );
  }
}

function CaseChapter({ cs, flip }: { cs: CaseStudy; flip: boolean }) {
  return (
    <article id={cs.slug} aria-labelledby={`case-${cs.slug}`}>
      {/* Chapter rule + spec line */}
      <Reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t-2 border-ink/20 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            Case {cs.code}
            <span className="px-2 text-line">/</span>
            {cs.sector}
          </p>
          <p className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            <span>{cs.year}</span>
            <span className="text-rust">{cs.weeks}</span>
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <h3
            id={`case-${cs.slug}`}
            className="font-sans text-[clamp(2.25rem,5vw,4rem)] font-normal leading-[0.98] tracking-[-0.02em] text-ink"
          >
            {cs.name}
          </h3>
          <p className="text-[15px] italic text-muted sm:text-base">
            {cs.line}
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-12">
        {/* Visual + metric */}
        <Reveal
          delay={0.08}
          className={`lg:col-span-6 ${flip ? "lg:order-2" : ""}`}
        >
          <div
            aria-hidden
            className="grain relative overflow-hidden rounded-2xl border border-line"
          >
            <div className="aspect-[4/3] w-full">
              <CaseVisual slug={cs.slug} />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div>
              <p className="text-[clamp(2.25rem,4vw,3.25rem)] font-normal leading-none tracking-[-0.02em] text-brand">
                {cs.metricValue}
              </p>
              <p className="mt-1.5 text-[13px] text-muted">{cs.metricLabel}</p>
            </div>
            <ul className="space-y-1.5 text-right text-[12px] text-muted">
              {cs.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* The transformation */}
        <Reveal
          delay={0.16}
          className={`lg:col-span-6 ${flip ? "lg:order-1" : ""}`}
        >
          <dl className="space-y-6">
            {[
              { label: "Before", value: cs.before, accent: false },
              { label: "Built", value: cs.built, accent: false },
              { label: "After", value: cs.after, accent: true },
            ].map((row) => (
              <div
                key={row.label}
                className={`border-l-2 pl-5 ${
                  row.accent ? "border-brand" : "border-line"
                }`}
              >
                <dt
                  className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                    row.accent ? "text-brand" : "text-muted"
                  }`}
                >
                  {row.label}
                </dt>
                <dd className="mt-2 max-w-[58ch] text-[14.5px] leading-relaxed text-ink/80">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            Layers deployed &mdash; SYS&middot;09
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {cs.layers.map((layer) => (
              <li
                key={layer}
                className="rounded-full border border-line bg-paper px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink/75"
              >
                {layer}
              </li>
            ))}
          </ul>

          <blockquote className="mt-8 border-t border-line pt-6">
            <p className="max-w-[44ch] font-serif text-[19px] italic leading-snug text-ink/85 sm:text-[21px]">
              &ldquo;{cs.quote}&rdquo;
            </p>
            <footer className="mt-3 text-[12px] font-medium uppercase tracking-[0.14em] text-muted">
              {cs.attribution}
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </article>
  );
}

export default function WorkPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WORK_JSON_LD) }}
      />

      {/* ------------------------------------------------ Hero */}
      <section aria-labelledby="work-page-heading">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-12 pt-12 sm:px-8 lg:px-12 lg:pb-14 lg:pt-20">
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
            <div className="max-w-[720px]">
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                <Spark className="size-3.5 text-brand" aria-hidden />
                Case studies
              </p>
              <h1
                id="work-page-heading"
                className="mt-5 max-w-[16ch] font-sans text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-[1.02] tracking-[-0.02em] text-ink"
              >
                <Cascade text="Transformations, with" base={0.08} step={0.045} />{" "}
                <em className="italic">
                  <Cascade
                    text="the numbers."
                    base={0.08}
                    step={0.045}
                    offset={2}
                  />
                </em>
              </h1>
              <p className="fade-up mt-6 max-w-[58ch] text-[15px] leading-relaxed text-ink/80 sm:text-base [animation-delay:250ms]">
                Four engagements, told the way the method runs them: the
                situation, the system built, and what changed &mdash; before,
                built, after. Numbers included, because that&rsquo;s the
                point.
              </p>
            </div>

            {/* Title block */}
            <Reveal delay={0.12} className="hidden sm:block">
              <dl
                aria-label="Case index summary"
                className="w-[248px] rounded-xl border border-line bg-paper text-[10px] font-semibold uppercase tracking-[0.16em]"
              >
                <div className="flex items-center justify-between px-4 py-2.5">
                  <dt className="text-muted">Case index</dt>
                  <dd className="flex items-center gap-1.5 text-ink">
                    <Spark className="size-3 text-brand" aria-hidden />
                    CS&middot;04
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                  <dt className="text-muted">In depth</dt>
                  <dd className="tabular-nums text-ink">04</dd>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                  <dt className="text-muted">Shipped to date</dt>
                  <dd className="tabular-nums text-ink">120+</dd>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                  <dt className="text-muted">Framing</dt>
                  <dd className="text-brand">Before &rarr; After</dd>
                </div>
              </dl>
            </Reveal>
          </div>

          {/* Case index — table of contents */}
          <Reveal delay={0.15} className="mt-12">
            <ol className="border-b border-line">
              {CASES.map((cs) => (
                <li key={cs.code} className="border-t border-line">
                  <a
                    href={`#${cs.slug}`}
                    className="group grid grid-cols-[3rem_minmax(0,1fr)_auto] items-baseline gap-x-4 py-3.5 sm:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1fr)_auto] sm:gap-x-6"
                  >
                    <span className="text-[11px] font-semibold tabular-nums tracking-[0.08em] text-muted">
                      {cs.code}
                    </span>
                    <span className="text-[15px] font-medium tracking-[-0.01em] text-ink transition-colors duration-300 group-hover:text-brand sm:text-[16px]">
                      {cs.name}
                    </span>
                    <span className="hidden text-[12px] text-muted sm:block">
                      {cs.scope}
                    </span>
                    <span className="text-[12px] font-semibold tabular-nums text-brand">
                      {cs.metricValue}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------ The chapters */}
      <section
        aria-label="Case studies in depth"
        className="border-t border-line bg-paper"
      >
        <div className="mx-auto w-full max-w-[1440px] space-y-20 px-5 py-16 sm:px-8 sm:py-20 lg:space-y-24 lg:px-12 lg:py-24">
          {CASES.map((cs, i) => (
            <CaseChapter key={cs.code} cs={cs} flip={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------ The pattern */}
      <StatementSection
        kicker="The pattern"
        note="Every case began with the audit"
        surface="ink"
        footer={
          <Link
            href="/methodology"
            className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-paper transition-colors hover:text-clay"
          >
            Read the full methodology
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        }
      >
        Different sectors. <em className="italic text-clay">Same system.</em>
      </StatementSection>

      {/* ------------------------------------------------ Closing */}
      <section
        aria-labelledby="work-cta-heading"
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
              Your case study starts here
            </p>
            <h2
              id="work-cta-heading"
              className="mt-6 max-w-[20ch] font-sans text-[clamp(2rem,4.8vw,4rem)] font-normal leading-[1.05] tracking-[-0.02em]"
            >
              The before is where{" "}
              <em className="italic">every one of these began</em>.
            </h2>
            <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-paper/85 sm:text-base">
              Book the strategy call and get the audit &mdash; a clear read
              on your presence across all nine layers, and what to fix first.
              The after is the part we build together.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-lg bg-paper px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-canvas"
              >
                Book Strategy Call
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="mailto:hello@plurel.com"
                className="border-b border-paper/40 pb-0.5 text-sm text-paper transition-colors hover:border-paper"
              >
                hello@plurel.com
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
