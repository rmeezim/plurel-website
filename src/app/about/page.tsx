import type { Metadata } from "next";
import Link from "next/link";
import { Cascade } from "@/components/cascade";
import { ArrowUpRight, Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { StatementSection } from "@/components/statement-section";
import { VisualPlate } from "@/components/visual-plate";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About | Plurel",
  description:
    "Plurel is a distribution engineering firm: a small senior team that answers for how growth-stage companies get chosen, across brand, website, AI search, content and creators, campaigns and the martech underneath.",
  alternates: { canonical: "/about/" },
};

const ABOUT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Plurel",
  mainEntity: { "@id": `${SITE_URL}/#organization` },
};

const BELIEFS = [
  {
    code: "B·01",
    name: "Presence is infrastructure",
    rule: "It is the part of you buyers actually meet, so it deserves engineering.",
  },
  {
    code: "B·02",
    name: "The front door moved",
    rule: "Buying begins in AI answers; unreadable brands don't get chosen.",
  },
  {
    code: "B·03",
    name: "Taste sets the price",
    rule: "Look and feel set price expectations before a word is read.",
  },
  {
    code: "B·04",
    name: "Proof builds on proof",
    rule: "Every review and placement makes the next one easier to win.",
  },
  {
    code: "B·05",
    name: "One owner beats five vendors",
    rule: "When one team answers for the result, you get growth instead of a pile of deliverables.",
  },
];

const STANDARDS = [
  {
    number: "01",
    name: "Diagnosis before design",
    detail:
      "No build before evidence: every engagement opens with the free Diagnostic, then a signed diagnosis report before any design.",
  },
  {
    number: "02",
    name: "A senior lead, end to end",
    detail:
      "The person in your reviews is the person doing the thinking. No handoffs, no account layer.",
  },
  {
    number: "03",
    name: "Weekly ships, written",
    detail:
      "Something live every week, with a note that says what, why, and what's next.",
  },
  {
    number: "04",
    name: "One number from launch",
    detail:
      "The number is agreed with you on day one and measured from launch, with the signals behind it. Reviewed monthly, reset every quarter.",
  },
];

const EXPLORE = [
  {
    code: "MTD·04",
    name: "The Method",
    desc: "The four phases, published in full.",
    href: "/methodology",
    label: "Read the methodology",
  },
  {
    code: "CRW",
    name: "Careers",
    desc: "A small senior team, and the kinds of roles we hire for.",
    href: "/careers",
    label: "See the roles",
  },
  {
    code: "JNL",
    name: "The Journal",
    desc: "What we’re learning about AI search, brand and growth.",
    href: "/blog",
    label: "Read the journal",
  },
];

export default function AboutPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_JSON_LD) }}
      />

      {/* ------------------------------------------------ Hero */}
      <section aria-labelledby="about-heading">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-12 sm:px-8 lg:px-12 lg:pb-16 lg:pt-20">
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
            <div className="max-w-[720px]">
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                <Spark className="size-3.5 text-brand" aria-hidden />
                About Plurel
              </p>
              <h1
                id="about-heading"
                className="mt-5 max-w-[14ch] font-sans text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-[1.02] tracking-[-0.02em] text-ink"
              >
                <Cascade text="The team behind" base={0.08} step={0.045} />{" "}
                <em className="italic">
                  <Cascade
                    text="the visible layer."
                    base={0.08}
                    step={0.045}
                    offset={3}
                  />
                </em>
              </h1>
              <p className="fade-up mt-6 max-w-[58ch] text-[15px] leading-relaxed text-ink/80 sm:text-base [animation-delay:250ms]">
                Plurel is a distribution engineering firm. One senior team
                answers for how businesses get chosen: brand, website, AI
                search, content, campaigns and the martech underneath, all
                working from the same brief.
              </p>
            </div>

            {/* Title block */}
            <Reveal delay={0.12} className="hidden sm:block">
              <dl
                aria-label="Company summary"
                className="w-[248px] rounded-xl border border-line bg-paper text-[10px] font-semibold uppercase tracking-[0.16em]"
              >
                <div className="flex items-center justify-between px-4 py-2.5">
                  <dt className="text-muted">Method</dt>
                  <dd className="text-ink">MTD&middot;04</dd>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                  <dt className="text-muted">The team</dt>
                  <dd className="text-ink">Small &middot; senior</dd>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                  <dt className="text-muted">Base</dt>
                  <dd className="text-brand">New York &middot; remote</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- The story */}
      <section
        aria-labelledby="story-heading"
        className="border-t border-line bg-paper"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                <Spark className="size-3.5 text-brand" aria-hidden />
                Why Plurel exists
              </p>
              <h2
                id="story-heading"
                className="mt-5 max-w-[16ch] font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
              >
                Built from a pattern we couldn&rsquo;t unsee.
              </h2>
            </Reveal>
            <Reveal
              delay={0.1}
              className="space-y-6 text-[15px] leading-[1.75] text-ink/85 sm:text-base lg:col-span-4"
            >
              <p>
                Good businesses kept losing to visible ones. Great work sat on
                page four of the search results, and good outcomes went
                untold. The cause was structural: marketing bought in pieces,
                with nobody accountable for the whole.
              </p>
              <p>
                So we built the firm we kept wishing existed. A small senior
                team takes the whole job, from the brand to the reporting,
                and answers for one number, agreed with you on day one.
              </p>
              <p>
                Buying now begins inside AI answers as often as in search
                results, so everything we build is made to be read by both
                people and assistants.
              </p>
            </Reveal>
            <Reveal delay={0.18} className="lg:col-span-4">
              <VisualPlate
                kind="room"
                label="Plurel · The studio"
                className="aspect-[16/10] w-full lg:aspect-[4/5]"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------ What we believe */}
      <section
        aria-labelledby="beliefs-heading"
        className="border-t border-line"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                <Spark className="size-3.5 text-brand" aria-hidden />
                What we believe
              </p>
              <h2
                id="beliefs-heading"
                className="mt-5 max-w-[22ch] font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
              >
                Five convictions run the work.
              </h2>
            </div>
            <p className="max-w-[40ch] text-[14px] leading-relaxed text-muted">
              The method puts them into practice. These are the reasons
              behind its rules.
            </p>
          </Reveal>

          <div className="mt-10 border-b border-line sm:mt-12">
            <ol className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-16">
              {BELIEFS.map((belief) => (
                <li
                  key={belief.code}
                  className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 border-t border-line py-5 sm:py-6"
                >
                  <span className="pt-[0.35em] text-[11px] font-semibold tabular-nums tracking-[0.08em] text-brand">
                    {belief.code}
                  </span>
                  <span>
                    <span className="block text-[clamp(1.5rem,2.4vw,2rem)] font-normal leading-tight tracking-[-0.01em] text-ink">
                      {belief.name}
                    </span>
                    <span className="mt-2 block max-w-[46ch] text-[14px] leading-relaxed text-muted">
                      {belief.rule}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- The mandate */}
      <StatementSection
        kicker="The mandate"
        note="Distribution engineering"
        surface="ink"
      >
        Good business, made{" "}
        <em className="italic text-clay">impossible to miss</em>.
      </StatementSection>

      {/* ------------------------------------------ The standards */}
      <section
        aria-labelledby="standards-heading"
        className="border-t border-line bg-paper"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
            <h2
              id="standards-heading"
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted"
            >
              What every engagement includes &middot; STD&middot;04
            </h2>
            <p className="max-w-[40ch] text-[13px] leading-relaxed text-muted">
              They hold on every engagement, at every size.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="mt-8">
            <div className="overflow-hidden rounded-3xl border border-line">
              <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
                {STANDARDS.map((standard) => (
                  <div key={standard.number} className="bg-paper p-6 sm:p-7">
                    <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-brand">
                      Standard {standard.number}
                    </p>
                    <p className="mt-4 text-[16px] font-medium tracking-[-0.01em] text-ink sm:text-[17px]">
                      {standard.name}
                    </p>
                    <p className="mt-1.5 min-h-[3lh] text-[13px] leading-relaxed text-muted">
                      {standard.detail}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-line bg-paper px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                <span>If a standard slips, you hear it from us first</span>
                <span className="flex items-center gap-2">
                  <Spark className="size-3 text-brand" aria-hidden />A Plurel
                  operating standard
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------- The founder */}
      <section
        aria-labelledby="about-founder-heading"
        className="border-t border-line"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-3">
              {/* Placeholder portrait — swap for a real photograph */}
              <div
                aria-hidden
                className="aspect-[4/5] w-44 rounded-lg ring-1 ring-line sm:w-48"
                style={{
                  backgroundImage:
                    "linear-gradient(to top, rgba(17,15,10,0.22), transparent 45%), radial-gradient(ellipse 90% 70% at 50% 30%, #d8c7b0 0%, #b79f86 52%, #8f8981 100%)",
                }}
              />
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-7">
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                <Spark className="size-3.5 text-brand" aria-hidden />
                The founder
              </p>
              <h2
                id="about-founder-heading"
                className="mt-5 font-sans text-[clamp(1.75rem,3.4vw,2.75rem)] font-normal leading-[1.08] tracking-[-0.02em] text-ink"
              >
                Rameez Imran
              </h2>
              <p className="mt-1.5 text-[13px] text-muted">
                Founder, Plurel
              </p>
              <div className="mt-6 max-w-[62ch] space-y-5 text-[15px] leading-[1.75] text-ink/85">
                <p>
                  Rameez founded Plurel after years of watching good
                  businesses lose the moments that decide a shortlist, and
                  built the method so it never comes down to luck. He reads
                  every Diagnostic before it goes out and leads the diagnosis
                  that follows it.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-10 gap-y-4">
                <span
                  aria-hidden
                  className="inline-block -rotate-2 font-serif text-[2.4rem] italic leading-none tracking-tight text-ink/70"
                >
                  Rameez
                </span>
                <a
                  href="mailto:hello@plurel.com?subject=For%20Rameez"
                  className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-brand"
                >
                  Write to Rameez
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------ Keep exploring */}
      <section aria-label="Keep exploring" className="border-t border-line">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <Reveal>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {EXPLORE.map((item) => (
                <Link
                  key={item.code}
                  href={item.href}
                  className="group flex flex-col rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-ink/25 sm:p-6"
                >
                  <p className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em]">
                    <span className="tabular-nums text-muted">
                      {item.code}
                    </span>
                    <Spark className="size-3 text-brand" aria-hidden />
                  </p>
                  <p className="mt-4 text-[17px] font-medium tracking-[-0.01em] text-ink">
                    {item.name}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                    {item.desc}
                  </p>
                  <p className="mt-5 flex items-center gap-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/70 transition-colors group-hover:text-brand">
                    {item.label}
                    <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </p>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ Closing */}
      <section
        aria-labelledby="about-cta-heading"
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
              Meet us properly
            </p>
            <h2
              id="about-cta-heading"
              className="mt-6 max-w-[20ch] font-sans text-[clamp(2rem,4.8vw,4rem)] font-normal leading-[1.05] tracking-[-0.02em]"
            >
              The Diagnostic tells you{" "}
              <em className="italic">more than any about page</em>.
            </h2>
            <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-paper/85 sm:text-base">
              Request a diagnostic and you&rsquo;ll have a scored read of
              your distribution within a business day, whatever you decide
              about us.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-lg bg-paper px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-canvas"
              >
                Request a diagnostic
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
