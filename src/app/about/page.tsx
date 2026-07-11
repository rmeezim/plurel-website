import type { Metadata } from "next";
import Link from "next/link";
import { Cascade } from "@/components/cascade";
import { ArrowUpRight, Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About — Plurel",
  description:
    "Plurel is Northeon's creative and growth division — one senior team accountable for how businesses are found, trusted, chosen, and remembered: brand, website, AI search, content, campaigns, and the martech underneath.",
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
    rule: "Not a campaign or a coat of paint — the operating layer buyers actually meet. It deserves engineering.",
  },
  {
    code: "B·02",
    name: "The front door moved",
    rule: "Buying begins inside search and AI answers. Brands that machines can't read don't get chosen.",
  },
  {
    code: "B·03",
    name: "Taste is a growth lever",
    rule: "Premium look and feel changes what buyers assume about price, quality, and risk — before a word is read.",
  },
  {
    code: "B·04",
    name: "Proof compounds",
    rule: "Results, reviews, and reputation feed back into brand. The loop, not the logo, is the moat.",
  },
  {
    code: "B·05",
    name: "One owner beats five vendors",
    rule: "Accountability for the whole system is the difference between deliverables and growth.",
  },
];

const STANDARDS = [
  {
    number: "01",
    name: "Diagnosis before design",
    detail:
      "No build before evidence: every engagement opens with the audit and a signed Growth Gap Report.",
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
    name: "Six signals from launch",
    detail:
      "Instrumented from day one, reviewed monthly, reset quarterly. Evidence, not anecdotes.",
  },
];

const EXPLORE = [
  {
    code: "MTD·04",
    name: "The Method",
    desc: "The four-phase operating model, published in full.",
    href: "/methodology",
    label: "Read the methodology",
  },
  {
    code: "CRW",
    name: "Careers",
    desc: "A small senior team, run on the method — seats open.",
    href: "/careers",
    label: "See open roles",
  },
  {
    code: "JNL",
    name: "The Journal",
    desc: "Notes on staying visible — AI search, brand systems, growth.",
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
                About &mdash; a Northeon division
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
                Plurel is Northeon&rsquo;s creative and growth division &mdash;
                one senior team accountable for how businesses are found,
                trusted, chosen, and remembered: brand, website, AI search,
                content, campaigns, and the martech underneath, built as one
                system.
              </p>
            </div>

            {/* Title block */}
            <Reveal delay={0.12} className="hidden sm:block">
              <dl
                aria-label="Company summary"
                className="w-[248px] rounded-xl border border-line bg-paper text-[10px] font-semibold uppercase tracking-[0.16em]"
              >
                <div className="flex items-center justify-between px-4 py-2.5">
                  <dt className="text-muted">Division of</dt>
                  <dd className="flex items-center gap-1.5 text-ink">
                    <Spark className="size-3 text-brand" aria-hidden />
                    Northeon
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                  <dt className="text-muted">Operating model</dt>
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
              className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:col-span-8"
            >
              <div className="space-y-6 text-[15px] leading-[1.75] text-ink/85">
                <p>
                  Good businesses kept losing to visible ones. Excellent work
                  buried on page four; real results told to no one; buyers
                  deciding shortlists in moments the business never even
                  appeared in.
                </p>
                <p>
                  The cause was structural, not effort. Presence gets built
                  in pieces &mdash; a website from one vendor, content from
                  another, ads from a third &mdash; and nobody is accountable
                  for how it performs as a whole. Pieces don&rsquo;t
                  compound. Systems do.
                </p>
              </div>
              <div className="space-y-6 text-[15px] leading-[1.75] text-ink/85">
                <p>
                  So Northeon built the division it kept wishing existed: one
                  senior team, one method, one scoreboard &mdash; brand,
                  website, AI search, content, campaigns, and the martech
                  underneath, engineered as a single compounding system.
                </p>
                <p>
                  And because buying now begins inside AI answers as often as
                  search results, that&rsquo;s the direction we build in:
                  Plurel is becoming Northeon&rsquo;s global AI and
                  technology division for martech, marketing, and growth
                  transformations &mdash; the systems layer for how modern
                  companies grow.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------ The Northeon relationship */}
      <section
        aria-labelledby="northeon-heading"
        className="bg-charcoal text-paper"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid grid-cols-1 items-end gap-x-16 gap-y-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-6">
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
                <Spark className="size-3.5 text-brand" aria-hidden />
                The Northeon relationship
              </p>
              <h2
                id="northeon-heading"
                className="mt-5 max-w-[20ch] font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.08] tracking-[-0.02em]"
              >
                A studio&rsquo;s craft, an{" "}
                <em className="italic text-clay">operator&rsquo;s spine</em>.
              </h2>
              <p className="mt-5 max-w-[52ch] text-[14.5px] leading-relaxed text-paper/65">
                Northeon builds and operates companies with long horizons.
                Plurel is its creative and growth division &mdash; which
                means clients get studio-grade craft backed by engineering
                depth, operating discipline, and a parent that isn&rsquo;t
                going anywhere.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch sm:gap-0">
                <div className="flex flex-col rounded-2xl border border-paper/15 p-5 sm:p-6">
                  <p className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em]">
                    <span className="text-paper/45">Parent</span>
                    <span className="size-1.5 rounded-full bg-paper/40" />
                  </p>
                  <p className="mt-4 text-[17px] font-medium tracking-[-0.01em] text-paper">
                    Northeon
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-paper/55">
                    Builds and operates companies &mdash; capital, systems,
                    and long horizons.
                  </p>
                </div>
                <div aria-hidden className="hidden items-center px-2 sm:flex">
                  <div className="flex w-20 flex-col items-center gap-1.5">
                    <span className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.16em] text-paper/40">
                      Division
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
                <div className="flex flex-col rounded-2xl border border-paper/15 p-5 sm:p-6">
                  <p className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em]">
                    <span className="text-paper/45">Division</span>
                    <Spark className="size-3 text-brand" aria-hidden />
                  </p>
                  <p className="mt-4 text-[17px] font-medium tracking-[-0.01em] text-paper">
                    Plurel
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-paper/55">
                    The creative &amp; growth division &mdash; presence and
                    growth systems for clients.
                  </p>
                </div>
              </div>
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
              The method operationalizes them &mdash; these are the reasons
              behind its laws.
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
                    <span className="block text-[19px] font-normal tracking-[-0.01em] text-ink sm:text-[21px]">
                      {belief.name}
                    </span>
                    <span className="mt-1.5 block max-w-[52ch] text-[13.5px] leading-relaxed text-muted">
                      {belief.rule}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

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
              What every engagement includes &mdash; STD&middot;04
            </h2>
            <p className="max-w-[40ch] text-[13px] leading-relaxed text-muted">
              Not promises &mdash; defaults. They hold on every engagement,
              at every size.
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
                Founder &mdash; Plurel, a Northeon division
              </p>
              <div className="mt-6 max-w-[62ch] space-y-5 text-[15px] leading-[1.75] text-ink/85">
                <p>
                  Rameez founded Plurel after years of watching good
                  businesses lose the moments that decide a shortlist &mdash;
                  and built the method so it never comes down to luck. He
                  leads the first two weeks of every engagement personally:
                  the audit carries his signature.
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
              Thirty minutes tells you{" "}
              <em className="italic">more than any about page</em>.
            </h2>
            <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-paper/85 sm:text-base">
              Book the strategy call. You&rsquo;ll leave with a sharper read
              on your brand, your visibility, and your next move &mdash;
              whatever you decide about us.
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
