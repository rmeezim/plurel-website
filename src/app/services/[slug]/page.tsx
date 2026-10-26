import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "@/components/icons";
import { ChapterHead, Closing, PageHead, Room } from "@/components/page";
import { faqJsonLd, QuestionList } from "@/components/questions";
import { Reveal } from "@/components/reveal";
import { CtaLink, GRID } from "@/components/system";
import { DISCIPLINES, disciplineBySlug } from "@/lib/disciplines";
import { pageMetadata } from "@/lib/metadata";
import { AUDIT_HREF, LAYERS } from "@/lib/nav";
import { STAGES } from "@/lib/services-type";
import { SITE_URL } from "@/lib/site";

/*
  One discipline (app/services/[slug]), always told as part of the system:
  its job set large beside what it means; what you get; where it sits in
  the Plurel System (the page's red room: the four layers top to bottom,
  its own lit, the others' disciplines a click away), what it runs on and
  feeds; how it is read in the Ledger; its questions; then the closing.
  Copy lives in lib/disciplines.ts.
*/

export function generateStaticParams() {
  return DISCIPLINES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = disciplineBySlug(slug);
  if (!d) return {};
  return pageMetadata({
    title: `${d.name} — Plurel`,
    description: `${d.tagline} ${d.lead}`,
    path: `/services/${d.slug}/`,
  });
}

export default async function DisciplinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = disciplineBySlug(slug);
  if (!d) notFound();
  const layer = LAYERS.find((L) => L.key === d.layer)!;

  const SERVICE_LD = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: d.name,
    description: d.lead,
    provider: { "@id": `${SITE_URL}/#organization` },
    serviceType: d.name,
  };

  return (
    <main data-room="dark" className="bg-graphite text-paper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd(d.questions) }} />

      <PageHead
        lines={[d.name]}
        standfirst={
          <>
            <p>{d.lead}</p>
            <p className="mt-4 text-[15px] text-paper">
              Part of {layer.name}, in{" "}
              <Link href="/services" className="underline decoration-signal underline-offset-4 hover:text-signal">
                the Plurel System
              </Link>
              .
            </p>
          </>
        }
      >
        <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
      </PageHead>

      <Room labelledBy="job-heading" className="pt-0 lg:pt-4">
        <div className={`${GRID} gap-y-10 border-t border-paper/15 pt-10 lg:pt-14`}>
          <h2
            id="job-heading"
            className="type-display col-span-4 text-[clamp(2rem,1.4rem+2.4vw,3.5rem)] leading-[1.02] sm:col-span-6 lg:col-span-6"
          >
            {d.job}
          </h2>
          <Reveal className="col-span-4 space-y-5 sm:col-span-6 lg:col-span-5 lg:col-start-8">
            {d.body.map((para) => (
              <p key={para.slice(0, 24)} className="max-w-[56ch] text-[17px] leading-[1.6] text-fog">
                {para}
              </p>
            ))}
          </Reveal>
        </div>
      </Room>

      <Room labelledBy="get-heading" className="border-t border-paper/10">
        <ChapterHead id="get-heading" lines={["What you get."]} />
        <Reveal className="mt-12 lg:mt-16">
          <ul className="grid border-b border-paper/15 sm:grid-cols-2 sm:gap-x-8">
            {d.deliverables.map((item) => (
              <li key={item} className="flex items-baseline gap-3.5 border-t border-paper/15 py-4 text-[17px] leading-[1.4] lg:py-5 lg:text-[18px]">
                <span aria-hidden className="size-[6px] shrink-0 -translate-y-[3px] bg-signal" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </Room>

      <Room labelledBy="sits-heading" tone="red">
        <ChapterHead
          id="sits-heading"
          tone="red"
          lines={["Where it sits."]}
          aside={
            <>
              <span className="font-medium">Runs on</span> {d.runsOn}
              <br />
              <span className="mt-3 inline-block font-medium">Feeds</span> {d.feeds}
            </>
          }
        />
        <Reveal className="mt-12 lg:mt-16">
          <ol aria-label="The Plurel System, top to bottom" className="border-b border-paper/30">
            {STAGES.map((st) => {
              const here = st.key === d.layer;
              const others = DISCIPLINES.filter((x) => x.layer === st.key);
              return (
                <li
                  key={st.key}
                  aria-current={here ? "true" : undefined}
                  className={`${GRID} relative items-baseline gap-y-3 py-5 lg:py-6 ${here ? "border-t-2 border-paper" : "border-t border-paper/30"}`}
                >
                  <p className="col-span-2 flex items-baseline gap-3 text-[clamp(1.375rem,1.1rem+0.9vw,1.75rem)] leading-none sm:col-span-2 lg:col-span-3">
                    <span aria-hidden className={`size-[7px] shrink-0 -translate-y-[3px] ${here ? "bg-paper" : "border border-paper"}`} />
                    <span className="type-title">{st.name}</span>
                  </p>
                  <p className={`col-span-2 text-[15px] sm:col-span-4 lg:col-span-3 ${here ? "font-medium" : ""}`}>
                    {st.builds}
                  </p>
                  <ul className="col-span-4 flex flex-wrap gap-x-6 gap-y-1 sm:col-span-6 lg:col-span-6">
                    {others.map((x) => (
                      <li key={x.slug}>
                        {x.slug === d.slug ? (
                          <span className="text-[16px] font-medium underline decoration-paper underline-offset-[6px]">{x.name}</span>
                        ) : (
                          <Link
                            href={x.href}
                            className="group inline-flex items-center gap-1.5 text-[16px] underline-offset-[6px] hover:underline"
                          >
                            {x.name}
                            <ArrowUpRight className="size-3 opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </Room>

      <Room labelledBy="read-heading">
        <ChapterHead
          id="read-heading"
          lines={["How we read it."]}
          aside="Every signal sits in the Ledger as a cause of the one number, never as a result of its own."
        />
        <Reveal className="mt-12 lg:mt-16">
          <ul className={`${GRID} gap-y-0`}>
            {d.signals.map((sig) => (
              <li
                key={sig}
                className="col-span-4 border-t border-paper/15 py-5 text-[18px] leading-[1.4] sm:col-span-3 lg:col-span-3 lg:pr-6 lg:text-[19px]"
              >
                {sig}
              </li>
            ))}
          </ul>
        </Reveal>
      </Room>

      <Room labelledBy="discipline-questions" className="border-t border-paper/10 pt-20 lg:pt-28">
        <ChapterHead id="discipline-questions" lines={["Questions."]} />
        <QuestionList items={d.questions} className="mt-12 lg:mt-16" />
      </Room>

      <Closing lines={["Start with a read", "of your business."]}>
        <CtaLink href={AUDIT_HREF} variant="paper">
          Request a diagnostic
        </CtaLink>
        <CtaLink href="/services" variant="outline-light" arrow="right">
          The Plurel System
        </CtaLink>
      </Closing>
    </main>
  );
}
