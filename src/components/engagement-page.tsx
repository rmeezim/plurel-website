import Link from "next/link";
import { Instrument } from "@/components/figures/instrument";
import { ArrowUpRight } from "@/components/icons";
import { PhaseTrack } from "@/components/interior/phase-track";
import { Closing } from "@/components/page";
import { faqJsonLd, QuestionList } from "@/components/questions";
import { CaseBand, Ladder, LayerFlow, MeasureRail, Part, ServiceHead, ShipCalendar, Steps } from "@/components/service";
import { CONTAINER, CtaLink, GRID } from "@/components/system";
import { ENGAGEMENTS, type Engagement } from "@/lib/engagements";
import { AUDIT_HREF, LAYERS, SERVICES } from "@/lib/nav";
import { STAGES } from "@/lib/services-type";
import { SITE_URL } from "@/lib/site";

/*
  An engagement (app/services/[slug] for reach, reputation, mindshare
  and revenue). It opens on its own drawing beside its title and four
  facts set large; then the case on red, with the published numbers
  behind it; how it works (its figure, then its steps, or Reach's rules
  as a ladder); the four layers as one line; what ships as a calendar of
  the quarter; the measures as a rail into the one number; the first
  ninety days; questions; the other three; the closing. Copy in
  lib/engagements.ts, parts in components/service.tsx.
*/

const ONE_NUMBER = "Orders, installs, demos or stockists: the one the business runs on, agreed on day one.";

export function EngagementPage({ pkg }: { pkg: Engagement }) {
  const SERVICE_LD = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${pkg.term}, a Plurel engagement`,
    description: pkg.lead,
    provider: { "@id": `${SITE_URL}/#organization` },
    serviceType: "Marketing and distribution",
  };
  const focus = LAYERS.flatMap((L) => pkg.uses[L.key]);
  const others = ENGAGEMENTS.filter((p) => p.key !== pkg.key);
  const layerName = (k: string) => LAYERS.find((L) => L.key === k)!.name;
  const number = pkg.metrics.find((m) => m.name === "The one number");

  return (
    <main data-room="dark" className="bg-graphite text-paper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd(pkg.questions) }} />

      <ServiceHead
        lines={[`${pkg.term}.`]}
        line={pkg.want}
        standfirst={<p>{pkg.lead}</p>}
        sig={pkg.key}
        facts={[
          { value: "4", label: "layers of the Plurel System, run by one team" },
          { value: focus.length, label: "disciplines, each also hired on its own" },
          { value: "Weekly", label: "something ships, from the first week on" },
          { value: "1", label: "number it answers to, agreed on day one" },
        ]}
      >
        <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
        <CtaLink href="/services" variant="outline-light" arrow="right">
          All engagements
        </CtaLink>
      </ServiceHead>

      <CaseBand id="case-heading" lines={pkg.caseHead} body={pkg.caseBody} stats={pkg.numbers} />

      <Part id="how-heading" title="How it works" lead={pkg.how.intro}>
        <div className="lg:max-w-[58rem]">
          <Instrument k={pkg.key} />
        </div>
        <div className="mt-16 lg:mt-20">{pkg.how.rules ? <Ladder rules={pkg.how.rules} /> : pkg.how.points && <Steps items={pkg.how.points} />}</div>
      </Part>

      <Part id="layers-heading" title="Four layers, one team" lead={`What each layer of the Plurel System does for ${pkg.term.toLowerCase()}, and the disciplines that do it.`}>
        <LayerFlow
          items={STAGES.map((st, i) => ({
            name: st.name,
            builds: st.builds.replace(/^The /, "the "),
            text: pkg.layers[i],
            links: pkg.uses[st.key].map((slug) => {
              const d = SERVICES.find((x) => x.slug === slug)!;
              return { name: d.name, href: d.href };
            }),
          }))}
          loop="What the Ledger reads goes back into the next quarter’s brief."
        />
      </Part>

      <Part id="ships-heading" title="What ships" lead="Everything is made from one brief and read against one number. How often is the commitment; the volumes are set with you in the Diagnostic.">
        <ShipCalendar
          caption="When each ships across a quarter of thirteen weeks: a square for each delivery, a line for work that runs every day, an outline for work timed to each push."
          items={pkg.deliverables.map((d) => ({ item: d.item, when: d.when, layer: layerName(d.layer), hot: d.layer === "measure" && d.item.includes("Ledger") }))}
        />
      </Part>

      <Part id="measured-heading" title="How it’s measured" lead="Read with you in the Ledger every month, each as a cause of the one number.">
        <MeasureRail items={pkg.metrics.filter((m) => m !== number)} number={number?.what ?? ONE_NUMBER} />
      </Part>

      <Part id="first-90-heading" title="The first ninety days" lead="It starts with the Diagnostic, and something ships every week after it.">
        <PhaseTrack items={pkg.first90} label={`The first ninety days of ${pkg.term}, week by week`} />
      </Part>

      <Part id="questions-heading" title="Questions">
        <QuestionList items={pkg.questions} />
      </Part>

      <section aria-labelledby="others-heading" className="border-t border-paper/10">
        <div className={`${CONTAINER} py-16 lg:py-20`}>
          <h2 id="others-heading" className="type-title text-[clamp(1.5rem,1.2rem+1vw,2.125rem)] leading-[1.12]">
            The other three
          </h2>
          <ul className={`${GRID} mt-8 gap-y-0`}>
            {others.map((o) => (
              <li key={o.key} className="col-span-4 sm:col-span-2 lg:col-span-4">
                <Link href={o.href} className="group block border-t border-paper/15 py-5">
                  <span className="flex items-center justify-between gap-4">
                    <span className="type-display text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-none transition-colors group-hover:text-signal">
                      {o.term}
                    </span>
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                  <span className="mt-2 block text-[15px] text-fog">{o.want}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Closing lines={["It starts with", "the Diagnostic."]}>
        <CtaLink href={AUDIT_HREF} variant="paper">
          Request a diagnostic
        </CtaLink>
        <CtaLink href="/method" variant="outline-light" arrow="right">
          How an engagement runs
        </CtaLink>
      </Closing>
    </main>
  );
}
