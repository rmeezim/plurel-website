import Link from "next/link";
import { Instrument } from "@/components/console/instrument";
import { Manifest } from "@/components/interior/manifest";
import { MetricGraph } from "@/components/interior/metric-graph";
import { SystemMap } from "@/components/interior/system-map";
import { Numbers } from "@/components/instruments";
import { ChapterHead, Closing, PageHead, Room } from "@/components/page";
import { faqJsonLd, QuestionList } from "@/components/questions";
import { CtaLink } from "@/components/system";
import { type Discipline } from "@/lib/disciplines";
import { engagementsUsing } from "@/lib/engagements";
import { AUDIT_HREF, LAYERS, SERVICES } from "@/lib/nav";
import { STAGES } from "@/lib/services-type";
import { SITE_URL } from "@/lib/site";

/*
  One discipline (app/services/[slug]), told so it can be understood in
  a minute and always as part of the system. The head says what it is,
  with its spec sheet (its layer, the engagements it runs in, how it is
  hired, how it starts, how often it is read); the job and the case for
  it, with the page's live instrument (a working model of what it does)
  and the published numbers behind it; what you get; the measures it
  answers to, as a graph into the one number; where it sits in the
  Plurel System, mapped, in the page's red room; its questions; then the
  closing. Copy in lib/disciplines.ts.
*/

const cadence = (whens: readonly string[]) => {
  const set = ["Weekly", "Monthly", "Quarterly"].filter((w) => whens.includes(w));
  return set.length > 1 ? `${set.slice(0, -1).join(", ")} and ${set[set.length - 1].toLowerCase()}` : set[0] ?? "Monthly";
};

export function DisciplinePage({ d }: { d: Discipline }) {
  const layer = LAYERS.find((L) => L.key === d.layer)!;
  const stage = STAGES.find((s) => s.key === d.layer)!;
  const engagements = engagementsUsing(d.slug);

  const SERVICE_LD = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: d.name,
    description: d.lead,
    provider: { "@id": `${SITE_URL}/#organization` },
    serviceType: d.name,
  };

  const link = "underline decoration-signal decoration-1 underline-offset-[5px] transition-colors hover:text-signal";

  return (
    <main data-room="dark" className="bg-graphite text-paper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd(d.questions) }} />

      <PageHead
        lines={[d.name]}
        standfirst={<p>{d.lead}</p>}
        spec={[
          {
            k: "Layer",
            v: (
              <>
                <Link href="/services" className={link}>
                  {layer.name}
                </Link>
                , building {stage.builds.replace(/^The /, "the ")}
              </>
            ),
          },
          {
            k: "Runs in",
            v:
              engagements.length > 0 ? (
                <>
                  {engagements.map((p, i) => (
                    <span key={p.key}>
                      {i > 0 && (i === engagements.length - 1 ? " and " : ", ")}
                      <Link href={p.href} className={link}>
                        {p.term}
                      </Link>
                    </span>
                  ))}
                </>
              ) : (
                "Every engagement"
              ),
          },
          { k: "Hired", v: "On its own, or inside an engagement" },
          { k: "Starts with", v: "The Diagnostic, read within a business day" },
          { k: "Read", v: `${cadence(d.metrics.map((m) => m.when))} in the Ledger` },
        ]}
      >
        <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
        <CtaLink href="/services" variant="outline-light" arrow="right">
          All disciplines
        </CtaLink>
      </PageHead>

      <Room labelledBy="job-heading" className="pt-4 lg:pt-8">
        <ChapterHead id="job-heading" lines={[d.job]} aside={d.body[0]} />
        <div className="mt-12 lg:mt-16">
          <Instrument k={d.slug} />
        </div>
        {d.numbers && d.numbers.length > 0 && <Numbers items={d.numbers} />}
      </Room>

      <Room labelledBy="get-heading" className="border-t border-paper/10">
        <ChapterHead id="get-heading" lines={["What you get."]} aside={d.body[1]} />
        <Manifest label={`What ${d.name} delivers`} items={d.deliverables.map((item) => ({ item }))} />
      </Room>

      <Room labelledBy="measures-heading" className="border-t border-paper/10">
        <ChapterHead
          id="measures-heading"
          lines={["The numbers", "it answers to."]}
          aside="Read with you in the Ledger, each as a cause of the one number agreed on day one."
        />
        <MetricGraph metrics={d.metrics} label={`The measures ${d.name} answers to, and the one number they feed`} />
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
        <SystemMap
          tone="red"
          label={`${d.name} in the Plurel System, with the other disciplines layer by layer`}
          layers={STAGES.map((s) => ({ key: s.key, name: s.name, builds: s.builds, line: s.line }))}
          nodes={SERVICES.map((s) => ({ slug: s.slug, name: s.name, tagline: s.tagline, href: s.href, layer: s.layer }))}
          focus={[d.slug]}
          current={d.slug}
          open={d.layer}
        />
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
          All disciplines
        </CtaLink>
      </Closing>
    </main>
  );
}
