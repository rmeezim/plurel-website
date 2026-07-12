import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cascade } from "@/components/cascade";
import { ArrowUpRight, Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { StatementSection } from "@/components/statement-section";
import { VisualPlate } from "@/components/visual-plate";
import { SERVICE_PAGES, getServicePage } from "@/lib/services-pages";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return SERVICE_PAGES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) return {};
  return {
    title: `${service.name} — Plurel`,
    description: `${service.tagline} ${service.plain[0]}`,
    alternates: { canonical: `/services/${service.slug}/` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) notFound();

  const related = service.related
    .map((relatedSlug) => getServicePage(relatedSlug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const JSON_LD = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.plain[0],
    provider: { "@id": `${SITE_URL}/#organization` },
    serviceType: service.name,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* ------------------------------------------------ Hero */}
      <section aria-labelledby="service-heading">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-12 sm:px-8 lg:px-12 lg:pb-16 lg:pt-20">
          <div className="grid grid-cols-1 items-end gap-x-16 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                <Spark className="size-3.5 text-brand" aria-hidden />
                Service &mdash; {service.code}
              </p>
              <h1
                id="service-heading"
                className="mt-5 max-w-[14ch] font-sans text-[clamp(2.5rem,5.6vw,5rem)] font-normal leading-[1.0] tracking-[-0.02em] text-ink"
              >
                <Cascade text={service.name} base={0.08} step={0.045} />
              </h1>
              <p className="mt-4 font-sans text-[clamp(1.25rem,2.4vw,1.8rem)] font-normal italic leading-snug tracking-[-0.01em] text-rust">
                {service.tagline}
              </p>
              <p className="fade-up mt-6 max-w-[58ch] text-[15px] leading-relaxed text-ink/80 sm:text-base [animation-delay:250ms]">
                {service.plain[0]}
              </p>
              <p className="fade-up mt-4 max-w-[58ch] text-[15px] leading-relaxed text-ink/70 [animation-delay:350ms]">
                {service.plain[1]}
              </p>
            </div>
            <Reveal delay={0.15} className="lg:col-span-5">
              <VisualPlate
                kind={service.plate.kind}
                label={service.plate.label}
                line={service.plate.line}
                className="aspect-[4/3] w-full lg:aspect-[4/5]"
              />
              <ul className="mt-4 flex flex-wrap gap-2">
                {service.layers.map((layer) => (
                  <li
                    key={layer}
                    className="rounded-full border border-line bg-paper px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink/75"
                  >
                    {layer}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------ Why it matters */}
      <section
        aria-labelledby="why-heading"
        className="border-t border-line bg-paper"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              <Spark className="size-3.5 text-brand" aria-hidden />
              Why it matters
            </p>
            <h2
              id="why-heading"
              className="mt-5 max-w-[24ch] font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
            >
              Three reasons this moves revenue.
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 sm:mt-12 sm:grid-cols-3">
            {service.why.map((reason, i) => (
              <Reveal
                key={reason.name}
                delay={i * 0.08}
                className={`border-t border-line py-6 lg:pb-2 ${
                  i > 0 ? "sm:border-l sm:pl-8" : ""
                } ${i < service.why.length - 1 ? "sm:pr-8" : ""}`}
              >
                <p className="text-[11px] font-semibold tabular-nums tracking-[0.08em] text-brand">
                  0{i + 1}
                </p>
                <p className="mt-3 text-[clamp(1.35rem,2vw,1.7rem)] font-normal leading-tight tracking-[-0.01em] text-ink">
                  {reason.name}
                </p>
                <p className="mt-2 max-w-[34ch] text-[14px] leading-relaxed text-muted">
                  {reason.clause}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------ The evidence */}
      <section
        aria-labelledby="evidence-heading"
        className="border-t border-line"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
            <h2
              id="evidence-heading"
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted"
            >
              The evidence &mdash; independent research
            </h2>
            <p className="max-w-[40ch] text-[13px] leading-relaxed text-muted">
              Published findings, sourced inline &mdash; not our numbers.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="mt-8">
            <div className="overflow-hidden rounded-3xl border border-line">
              <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-3">
                {service.stats.map((stat) => (
                  <div key={stat.label} className="bg-paper p-6 sm:p-7">
                    <p className="text-[clamp(2.5rem,4.5vw,3.5rem)] font-normal leading-none tracking-[-0.02em] text-brand">
                      {stat.value}
                    </p>
                    <p className="mt-3 min-h-[3lh] text-[13.5px] leading-relaxed text-ink/80">
                      {stat.label}
                    </p>
                    <p className="mt-4 border-t border-dashed border-line pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      {stat.source}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------ The cost of skipping it */}
      <section
        aria-labelledby="risk-heading"
        className="material-backstage material-drift grain relative overflow-hidden text-paper"
      >
        <div className="relative mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
                <Spark className="size-3.5 text-brand" aria-hidden />
                Without it
              </p>
              <h2
                id="risk-heading"
                className="mt-5 max-w-[16ch] font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em]"
              >
                The cost of skipping it.
              </h2>
              <div className="mt-9 max-w-[360px] rounded-xl border border-paper/20 p-5">
                <p className="text-[clamp(2.25rem,4vw,3rem)] font-normal leading-none tracking-[-0.02em] text-clay">
                  {service.riskStat.value}
                </p>
                <p className="mt-2.5 text-[13px] leading-relaxed text-paper/70">
                  {service.riskStat.label}
                </p>
                <p className="mt-3 border-t border-dashed border-paper/15 pt-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-paper/45">
                  {service.riskStat.source}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-7">
              <ol className="border-b border-paper/12">
                {service.risks.map((risk, i) => (
                  <li
                    key={risk.name}
                    className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 border-t border-paper/12 py-6"
                  >
                    <span className="pt-[0.35em] text-[11px] font-semibold tabular-nums tracking-[0.08em] text-clay">
                      R·0{i + 1}
                    </span>
                    <span>
                      <span className="block text-[clamp(1.4rem,2.2vw,1.9rem)] font-normal leading-tight tracking-[-0.015em] text-paper">
                        {risk.name}
                      </span>
                      <span className="mt-2 block max-w-[46ch] text-[14px] leading-relaxed text-paper/55">
                        {risk.clause}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------- How it works here */}
      <section
        aria-labelledby="how-heading"
        className="border-t border-line bg-paper"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                <Spark className="size-3.5 text-brand" aria-hidden />
                How it works at Plurel
              </p>
              <h2
                id="how-heading"
                className="mt-5 max-w-[22ch] font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
              >
                Run through the method, like everything else.
              </h2>
            </div>
            <Link
              href="/methodology"
              className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-brand"
            >
              MTD&middot;04 in full
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-y-4 border-y border-line py-6 sm:mt-12 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4">
            {service.how.map((step, i) => (
              <Reveal key={step.phase} delay={i * 0.07} className="flex gap-3">
                <span className="text-[11px] font-semibold tabular-nums text-brand">
                  0{i + 1}
                </span>
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                    {step.phase}
                  </span>
                  <span className="mt-1.5 block max-w-[32ch] text-[13.5px] leading-relaxed text-ink/80">
                    {step.action}
                  </span>
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------ Pairs well with */}
      <section aria-label="Related services" className="border-t border-line">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
              Pairs well with
            </h2>
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-brand"
            >
              All services
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/services/${rel.slug}`}
                className="group flex flex-col rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-ink/25 sm:p-6"
              >
                <p className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em]">
                  <span className="tabular-nums text-muted">{rel.code}</span>
                  <Spark className="size-3 text-brand" aria-hidden />
                </p>
                <p className="mt-4 text-[17px] font-medium tracking-[-0.01em] text-ink transition-colors group-hover:text-brand">
                  {rel.name}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  {rel.tagline}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Closing */}
      <StatementSection
        kicker="Start where every engagement starts"
        note={`${service.code} — scoped by evidence, not by pitch`}
        surface="brand"
        footer={
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-lg bg-paper px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-canvas"
          >
            Book Strategy Call
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        }
      >
        The audit tells us if{" "}
        <em className="italic">you even need this</em>.
      </StatementSection>
    </main>
  );
}
