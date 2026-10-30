import Link from "next/link";
import { Instrument } from "@/components/console/instrument";
import { ArrowUpRight } from "@/components/icons";
import { Manifest } from "@/components/interior/manifest";
import { MetricGraph } from "@/components/interior/metric-graph";
import { PhaseTrack } from "@/components/interior/phase-track";
import { SystemMap } from "@/components/interior/system-map";
import { Numbers } from "@/components/instruments";
import { ChapterHead, Closing, PageHead, Room } from "@/components/page";
import { faqJsonLd, QuestionList } from "@/components/questions";
import { CtaLink, GRID } from "@/components/system";
import { ENGAGEMENTS, type Engagement } from "@/lib/engagements";
import { AUDIT_HREF, LAYERS, SERVICES } from "@/lib/nav";
import { STAGES } from "@/lib/services-type";
import { SITE_URL } from "@/lib/site";

/*
  An engagement (app/services/[slug] for reach, reputation, mindshare
  and revenue): what a company comes for, told so it can be understood
  in a minute. The head says what it is and who it is for, with its spec
  sheet (what it runs on, how it starts, what ships, what it answers to,
  how it is read); the case, with the page's live instrument (a working
  model of the mechanism) and the published numbers behind it; what
  ships, as a manifest; the System, mapped with this engagement's
  disciplines lit; the numbers it answers to, as a graph into the one
  number, in the page's red room; the first ninety days on a ruler of
  weeks; its questions; the other three; then the closing. Copy in
  lib/engagements.ts.
*/

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

  return (
    <main data-room="dark" className="bg-graphite text-paper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd(pkg.questions) }} />

      <PageHead
        lines={[`${pkg.term}.`]}
        standfirst={
          <>
            <p className="type-title text-[20px] leading-[1.3] text-paper lg:text-[22px]">{pkg.want}</p>
            <p className="mt-4">{pkg.lead}</p>
          </>
        }
        spec={[
          { k: "Runs on", v: `All four layers, ${focus.length} disciplines` },
          { k: "Starts with", v: "The Diagnostic, read within a business day" },
          { k: "Ships", v: "Something every week" },
          { k: "Answers to", v: "One number, agreed on day one" },
          { k: "Read", v: "Monthly in the Ledger, reset each quarter" },
        ]}
      >
        <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
        <CtaLink href="/services" variant="outline-light" arrow="right">
          All engagements
        </CtaLink>
      </PageHead>

      <Room labelledBy="case-heading" className="pt-4 lg:pt-8">
        <ChapterHead id="case-heading" lines={pkg.caseHead} aside={pkg.caseBody} />
        <div className="mt-12 lg:mt-16">
          <Instrument k={pkg.key} readout={pkg.readout} />
        </div>
        <Numbers items={pkg.numbers} />
      </Room>

      <Room labelledBy="ships-heading" className="border-t border-paper/10">
        <ChapterHead
          id="ships-heading"
          lines={["What ships."]}
          aside="Everything below is made from one brief and read against one number. How often is the commitment; the volumes are set with you in the Diagnostic."
        />
        <Manifest
          label={`What the ${pkg.term} engagement ships`}
          items={pkg.deliverables.map((d) => ({ item: d.item, when: d.when, layer: layerName(d.layer) }))}
        />
      </Room>

      <Room labelledBy="layers-heading" className="border-t border-paper/10">
        <ChapterHead
          id="layers-heading"
          lines={["Four layers,", `tuned for ${pkg.term.toLowerCase()}.`]}
          aside="The same system runs every engagement. What changes is what each layer does, and which disciplines do it. Choose a layer to see its part here."
        />
        <SystemMap
          label={`The Plurel System, tuned for ${pkg.term.toLowerCase()}: the disciplines it puts to work, layer by layer`}
          layers={STAGES.map((s) => ({ key: s.key, name: s.name, builds: s.builds, line: s.line }))}
          nodes={SERVICES.map((s) => ({ slug: s.slug, name: s.name, tagline: s.tagline, href: s.href, layer: s.layer }))}
          focus={focus}
          lines={pkg.layers}
        />
      </Room>

      <Room labelledBy="numbers-heading" tone="red">
        <ChapterHead
          id="numbers-heading"
          tone="red"
          lines={["The numbers", "it answers to."]}
          aside="Read with you in the Ledger, each as a cause of the one number agreed on day one."
        />
        <MetricGraph metrics={pkg.metrics} tone="red" label={`The measures ${pkg.term} answers to, and the one number they feed`} />
      </Room>

      <Room labelledBy="first90-heading">
        <ChapterHead id="first90-heading" lines={["The first", "ninety days."]} aside="It starts with the Diagnostic, and something ships every week after it." />
        <PhaseTrack items={pkg.first90} label={`The first ninety days of ${pkg.term}, week by week`} />
      </Room>

      <Room labelledBy="engagement-questions" className="border-t border-paper/10">
        <ChapterHead id="engagement-questions" lines={["Questions."]} />
        <QuestionList items={pkg.questions} className="mt-12 lg:mt-16" />
      </Room>

      <section aria-labelledby="others-heading" className="border-t border-paper/10">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
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
