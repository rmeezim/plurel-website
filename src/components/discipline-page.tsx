import Link from "next/link";
import { DisciplineArt } from "@/components/artifacts/discipline-art";
import { Readout } from "@/components/artifacts/kit";
import { ArrowUpRight } from "@/components/icons";
import { Measures, Numbers } from "@/components/instruments";
import { ChapterHead, Closing, PageHead, Room } from "@/components/page";
import { faqJsonLd, QuestionList } from "@/components/questions";
import { Reveal } from "@/components/reveal";
import { CtaLink, GRID } from "@/components/system";
import { DISCIPLINES, type Discipline } from "@/lib/disciplines";
import { AUDIT_HREF, LAYERS } from "@/lib/nav";
import { packagesUsing } from "@/lib/packages";
import { STAGES } from "@/lib/services-type";
import { SITE_URL } from "@/lib/site";

/*
  One individual service (app/services/[slug]), told as one story and
  always as part of the system: the job and the case for it, with the
  published numbers behind it (each with its source); how it works inside
  the system, as the page's drawing and its readout; what you get; the
  measures it answers to; where it sits in the Plurel System (the page's
  red room), with what it runs on and feeds; its questions; then the
  closing. Copy in lib/disciplines.ts; the drawing in
  artifacts/discipline-art.tsx.
*/

export function DisciplinePage({ d }: { d: Discipline }) {
  const layer = LAYERS.find((L) => L.key === d.layer)!;
  const packages = packagesUsing(d.slug);

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
            <p className="mt-4 text-[15px] leading-[1.55] text-paper">
              Part of {layer.name}, in{" "}
              <Link href="/services" className="underline decoration-signal underline-offset-4 hover:text-signal">
                the Plurel System
              </Link>
              {packages.length > 0 && (
                <>
                  . Runs in{" "}
                  {packages.map((p, i) => (
                    <span key={p.key}>
                      {i > 0 && (i === packages.length - 1 ? " and " : ", ")}
                      <Link href={p.href} className="underline decoration-signal underline-offset-4 hover:text-signal">
                        {p.term}
                      </Link>
                    </span>
                  ))}
                </>
              )}
              .
            </p>
          </>
        }
      >
        <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
      </PageHead>

      <Room labelledBy="job-heading" className="pt-0 lg:pt-4">
        <ChapterHead id="job-heading" lines={[d.job]} aside={d.body[0]} />

        {d.numbers && d.numbers.length > 0 && <Numbers items={d.numbers} />}

        <div className="mt-14 lg:mt-20">
          <DisciplineArt slug={d.slug} caption={<Readout items={d.readout} />} />
        </div>
      </Room>

      <Room labelledBy="get-heading" className="border-t border-paper/10">
        <ChapterHead id="get-heading" lines={["What you get."]} aside={d.body[1]} />
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

      <Room labelledBy="measures-heading" className="border-t border-paper/10">
        <ChapterHead
          id="measures-heading"
          lines={["The numbers", "it answers to."]}
          aside="Read with you in the Ledger, each as a cause of the one number agreed on day one."
        />
        <Measures items={d.metrics} />
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
                  <p className={`col-span-2 text-[15px] sm:col-span-4 lg:col-span-3 ${here ? "font-medium" : ""}`}>{st.builds}</p>
                  <ul className="col-span-4 flex flex-wrap gap-x-6 gap-y-1 sm:col-span-6 lg:col-span-6">
                    {others.map((x) => (
                      <li key={x.slug}>
                        {x.slug === d.slug ? (
                          <span className="text-[16px] font-medium underline decoration-paper underline-offset-[6px]">{x.name}</span>
                        ) : (
                          <Link href={x.href} className="group inline-flex items-center gap-1.5 text-[16px] underline-offset-[6px] hover:underline">
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

      <Room labelledBy="discipline-questions" className="pt-20 lg:pt-28">
        <ChapterHead id="discipline-questions" lines={["Questions."]} />
        <QuestionList items={d.questions} className="mt-12 lg:mt-16" />
      </Room>

      <Closing lines={["Start with a read", "of your business."]}>
        <CtaLink href={AUDIT_HREF} variant="paper">
          Request a diagnostic
        </CtaLink>
        <CtaLink href="/services" variant="outline-light" arrow="right">
          All services
        </CtaLink>
      </Closing>
    </main>
  );
}
