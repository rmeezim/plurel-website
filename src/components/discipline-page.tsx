import { Instrument } from "@/components/figures/instrument";
import { Closing } from "@/components/page";
import { faqJsonLd, QuestionList } from "@/components/questions";
import { CaseBand, DeliverableGrid, MeasureRail, Part, ServiceHead, SitsFlow } from "@/components/service";
import { CtaLink } from "@/components/system";
import { type Discipline } from "@/lib/disciplines";
import { engagementsUsing } from "@/lib/engagements";
import { AUDIT_HREF, LAYERS, SERVICES } from "@/lib/nav";
import { SITE_URL } from "@/lib/site";

/*
  One discipline (app/services/[slug]). It opens on its own drawing
  beside its name and four facts set large; then its case on red, with
  the published numbers behind it; how it works (its figure); what you
  get; the measures as a rail into the one number; where it sits in the
  Plurel System, as what it runs on, what it is and what it feeds;
  questions; the closing. Copy in lib/disciplines.ts, parts in
  components/service.tsx.
*/

const CADENCE = ["Daily", "Weekly", "Monthly", "Quarterly"];

export function DisciplinePage({ d }: { d: Discipline }) {
  const layer = LAYERS.find((L) => L.key === d.layer)!;
  const engagements = engagementsUsing(d.slug);
  const alongside = SERVICES.filter((s) => s.layer === d.layer && s.slug !== d.slug);
  const fastest = CADENCE.find((c) => d.metrics.some((m) => m.when === c)) ?? "Monthly";

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

      <ServiceHead
        lines={[d.name]}
        line={d.tagline}
        standfirst={<p>{d.lead}</p>}
        sig={d.slug}
        facts={[
          { value: layer.name, label: "its layer of the Plurel System" },
          { value: `${engagements.length} of 4`, label: "engagements it runs in, and hired on its own" },
          { value: fastest, label: "its measures are read in the Ledger" },
          { value: "Day 1", label: "it starts with the Diagnostic" },
        ]}
      >
        <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
        <CtaLink href="/services" variant="outline-light" arrow="right">
          All disciplines
        </CtaLink>
      </ServiceHead>

      <CaseBand id="case-heading" lines={[d.caseHead]} body={d.body[0]} stats={d.numbers ?? []} />

      <Part id="how-heading" title="How it works" lead={d.body[1]}>
        <div className="lg:max-w-[58rem]">
          <Instrument k={d.slug} />
        </div>
      </Part>

      <Part id="get-heading" title="What you get">
        <DeliverableGrid items={d.deliverables} />
      </Part>

      <Part id="measured-heading" title="How it’s measured" lead="Read with you in the Ledger, each as a cause of the one number.">
        <MeasureRail items={d.metrics} number="Orders, installs, demos or stockists: the one the business runs on, agreed on day one." />
      </Part>

      <Part id="sits-heading" title="Where it sits" lead={`Part of ${layer.name}, one of the Plurel System’s four layers, and always run as part of the whole.`}>
        <SitsFlow
          layer={layer.name}
          name={d.name}
          runsOn={d.runsOn}
          feeds={d.feeds}
          rows={[
            { k: "Runs in", links: engagements.map((e) => ({ name: e.term, href: e.href })), empty: "Every engagement" },
            { k: `Alongside it in ${layer.name}`, links: alongside.map((s) => ({ name: s.name, href: s.href })), empty: "It is the layer’s only discipline" },
          ]}
        />
      </Part>

      <Part id="questions-heading" title="Questions">
        <QuestionList items={d.questions} />
      </Part>

      <Closing lines={["Start with a read", "of your business."]}>
        <CtaLink href={AUDIT_HREF} variant="paper">
          Request a diagnostic
        </CtaLink>
        <CtaLink href="/services" variant="outline-light" arrow="right">
          All disciplines
        </CtaLink>
      </Closing>
    </main>
  );
}
