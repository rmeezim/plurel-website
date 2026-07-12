import type { Metadata } from "next";
import Link from "next/link";
import { Cascade } from "@/components/cascade";
import { ArrowUpRight, Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { StatementSection } from "@/components/statement-section";
import { SERVICE_PAGES } from "@/lib/services-pages";

export const metadata: Metadata = {
  title: "Services — Plurel",
  description:
    "Plurel builds the visible layer of growth as one system: website design, brand identity, AI search & SEO, content marketing, paid ads, PR & reputation, creative direction, and the martech underneath.",
  alternates: { canonical: "/services/" },
};

const MODELS = [
  {
    number: "01",
    name: "Project",
    detail: "One layer, fixed scope — a website, an identity, a launch.",
  },
  {
    number: "02",
    name: "Retainer",
    detail: "A standing lane run on the weekly rhythm — content, paid, PR.",
  },
  {
    number: "03",
    name: "Growth transformation",
    detail: "The full system, all four phases — diagnosis to compounding.",
  },
];

export default function ServicesIndexPage() {
  return (
    <main>
      {/* ------------------------------------------------ Hero */}
      <section aria-labelledby="services-page-heading">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-12 sm:px-8 lg:px-12 lg:pb-16 lg:pt-20">
          <div className="max-w-[760px]">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              <Spark className="size-3.5 text-brand" aria-hidden />
              Services &mdash; SVC&middot;01&ndash;08
            </p>
            <h1
              id="services-page-heading"
              className="mt-5 max-w-[16ch] font-sans text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-[1.02] tracking-[-0.02em] text-ink"
            >
              <Cascade text="One team. The whole" base={0.08} step={0.045} />{" "}
              <em className="italic">
                <Cascade
                  text="visible layer."
                  base={0.08}
                  step={0.045}
                  offset={4}
                />
              </em>
            </h1>
            <p className="fade-up mt-6 max-w-[60ch] text-[15px] leading-relaxed text-ink/80 sm:text-base [animation-delay:250ms]">
              In plain terms: Plurel builds everything a buyer meets before
              they talk to you &mdash; your brand, your website, how you show
              up in Google and AI answers, your content, your ads, and your
              reputation &mdash; and wires it into one measured system
              instead of eight disconnected vendors.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------ The index */}
      <section
        aria-labelledby="service-index-heading"
        className="border-t border-line bg-paper"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
            <h2
              id="service-index-heading"
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted"
            >
              The eight services &mdash; each explained on its own page
            </h2>
            <p className="max-w-[40ch] text-[13px] leading-relaxed text-muted">
              What it is, why it matters, the research, and the cost of
              skipping it.
            </p>
          </Reveal>
          <div className="mt-8 border-b border-line">
            <ol>
              {SERVICE_PAGES.map((service) => (
                <li key={service.slug} className="border-t border-line">
                  <Link
                    href={`/services/${service.slug}`}
                    className="group grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-x-4 py-5 sm:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1fr)_auto] sm:gap-x-6 sm:py-6"
                  >
                    <span className="text-[11px] font-semibold tabular-nums tracking-[0.08em] text-muted">
                      {service.code}
                    </span>
                    <span className="text-[clamp(1.3rem,1.9vw,1.65rem)] font-normal leading-tight tracking-[-0.01em] text-ink transition-colors duration-300 group-hover:text-brand">
                      {service.name}
                    </span>
                    <span className="hidden text-[13px] leading-snug text-muted sm:block">
                      {service.tagline}
                    </span>
                    <ArrowUpRight className="size-5 text-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
          <Reveal className="mt-8">
            <Link
              href="/#growth-system"
              className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-brand"
            >
              How the eight connect &mdash; the growth system
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------ The point */}
      <StatementSection
        kicker="Why one team"
        note="SYS·09 — nine layers, one scoreboard"
        surface="ink"
      >
        Eight services. <em className="italic text-clay">One system.</em>
      </StatementSection>

      {/* ------------------------------------------ Engagement models */}
      <section
        aria-labelledby="models-heading"
        className="border-t border-line"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              <Spark className="size-3.5 text-brand" aria-hidden />
              Three ways to engage
            </p>
            <h2
              id="models-heading"
              className="mt-5 max-w-[22ch] font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
            >
              Sized to the gap, not the pitch.
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 sm:mt-12 sm:grid-cols-3">
            {MODELS.map((model, i) => (
              <Reveal
                key={model.number}
                delay={i * 0.08}
                className={`border-t border-line py-6 lg:pb-2 ${
                  i > 0 ? "sm:border-l sm:pl-8" : ""
                } ${i < MODELS.length - 1 ? "sm:pr-8" : ""}`}
              >
                <p className="text-[11px] font-semibold tabular-nums tracking-[0.08em] text-brand">
                  {model.number}
                </p>
                <p className="mt-3 text-[clamp(1.35rem,2vw,1.7rem)] font-normal leading-tight tracking-[-0.01em] text-ink">
                  {model.name}
                </p>
                <p className="mt-2 max-w-[34ch] text-[14px] leading-relaxed text-muted">
                  {model.detail}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-6">
            <p className="max-w-[52ch] text-[13px] leading-relaxed text-muted">
              Every engagement &mdash; any size &mdash; starts with the
              audit, so scope comes from evidence.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-brand"
            >
              Book Strategy Call
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
