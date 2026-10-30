import Link from "next/link";
import { BriefRail } from "@/components/brief-rail";
import { Instrument } from "@/components/figures/instrument";
import { ArrowUpRight } from "@/components/icons";
import { PhaseTrack } from "@/components/interior/phase-track";
import { BriefHead, BriefLayout, BriefSection, BriefStats, BriefTable, Closing, Prose } from "@/components/page";
import { faqJsonLd, QuestionList } from "@/components/questions";
import { CONTAINER, CtaLink, GRID } from "@/components/system";
import { ENGAGEMENTS, WORKING, type Engagement } from "@/lib/engagements";
import { AUDIT_HREF, LAYERS, SERVICES } from "@/lib/nav";
import { STAGES } from "@/lib/services-type";
import { SITE_URL } from "@/lib/site";

/*
  An engagement (app/services/[slug] for reach, reputation, mindshare
  and revenue), laid out as a brief (components/page.tsx): read top to
  bottom in one column, the contents rail beside it. The head says what
  it is, for whom, and its spec sheet; then the sections, each the same
  anatomy: an overview with the published numbers behind it; how it
  works, with its one figure and its rules or steps; what each layer
  does; what ships; how it is measured; the first ninety days; how we
  work together; questions. Then the other three, and the closing.
  Copy in lib/engagements.ts.
*/

const SECTIONS = [
  { id: "overview", title: "Overview" },
  { id: "how-it-works", title: "How it works" },
  { id: "layers", title: "What each layer does" },
  { id: "ships", title: "What ships" },
  { id: "measured", title: "How it’s measured" },
  { id: "first-90", title: "The first ninety days" },
  { id: "working", title: "How we work together" },
  { id: "questions", title: "Questions" },
];

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

      <BriefHead
        lines={[`${pkg.term}.`]}
        line={pkg.want}
        standfirst={<p>{pkg.lead}</p>}
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
      </BriefHead>

      <BriefLayout
        rail={
          <BriefRail sections={SECTIONS}>
            <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
          </BriefRail>
        }
      >
        <BriefSection id="overview" title="Overview" lead={`${pkg.caseHead[0]} ${pkg.caseHead[1]}`}>
          <Prose>
            <p>{pkg.caseBody}</p>
          </Prose>
          <BriefStats items={pkg.numbers} />
        </BriefSection>

        <BriefSection id="how-it-works" title="How it works" lead={pkg.how.intro}>
          <Instrument k={pkg.key} />
          {pkg.how.rules && (
            <div className="mt-12">
              <BriefTable
                caption={`The rules ${pkg.term} runs on`}
                head={["When a cut is", "What happens"]}
                rows={pkg.how.rules.map((r) => [r.when, r.then])}
              />
            </div>
          )}
          {pkg.how.points && (
            <ol className="mt-12 grid gap-x-10 border-t border-paper/15 sm:grid-cols-2">
              {pkg.how.points.map((pt) => (
                <li key={pt.title} className="border-b border-paper/10 py-5">
                  <p className="text-[17px] font-medium leading-[1.35] text-paper">{pt.title}</p>
                  <p className="mt-2 text-[15px] leading-[1.55] text-fog">{pt.text}</p>
                </li>
              ))}
            </ol>
          )}
        </BriefSection>

        <BriefSection
          id="layers"
          title="What each layer does"
          lead={`The same four layers run every engagement. For ${pkg.term.toLowerCase()}, this is what each one does, and which disciplines do it.`}
        >
          <ol className="border-t border-paper/15">
            {STAGES.map((st, i) => (
              <li key={st.key} className="grid gap-x-8 gap-y-3 border-b border-paper/10 py-6 sm:grid-cols-[11rem_1fr]">
                <div>
                  <p className="type-title text-[21px] leading-[1.2]">{st.name}</p>
                  <p className="mt-1 text-[13px] text-fog">Builds {st.builds.replace(/^The /, "the ")}</p>
                </div>
                <div>
                  <p className="max-w-[56ch] text-[17px] leading-[1.55] text-paper">{pkg.layers[i]}</p>
                  <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                    {pkg.uses[st.key].map((slug) => {
                      const d = SERVICES.find((x) => x.slug === slug)!;
                      return (
                        <li key={slug}>
                          <Link href={d.href} className="group inline-flex items-center gap-1.5 text-[15px] text-fog transition-colors hover:text-paper">
                            {d.name}
                            <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </BriefSection>

        <BriefSection
          id="ships"
          title="What ships"
          lead="Everything here is made from one brief and read against one number. How often is the commitment; the volumes are set with you in the Diagnostic."
        >
          <BriefTable
            caption={`What the ${pkg.term} engagement ships`}
            head={["What ships", "How often", "Made in"]}
            rows={pkg.deliverables.map((d) => [d.item, d.when, layerName(d.layer)])}
          />
        </BriefSection>

        <BriefSection id="measured" title="How it’s measured" lead="Read with you in the Ledger, each as a cause of the one number agreed on day one: orders, installs, demos or stockists.">
          <BriefTable caption={`The measures ${pkg.term} answers to`} head={["Measure", "What it is", "Read"]} rows={pkg.metrics.map((m) => [m.name, m.what, m.when])} />
        </BriefSection>

        <BriefSection id="first-90" title="The first ninety days" lead="It starts with the Diagnostic, and something ships every week after it.">
          <PhaseTrack items={pkg.first90} label={`The first ninety days of ${pkg.term}, week by week`} />
        </BriefSection>

        <BriefSection id="working" title="How we work together" lead="One team, one brief and one number, from the first read to every quarter after it.">
          <ol className="border-t border-paper/15">
            {WORKING.map((w) => (
              <li key={w.step} className="grid gap-x-8 gap-y-2 border-b border-paper/10 py-5 sm:grid-cols-[11rem_1fr]">
                <p className="text-[17px] font-medium leading-[1.35] text-paper">{w.step}</p>
                <p className="max-w-[56ch] text-[16px] leading-[1.55] text-fog">{w.text}</p>
              </li>
            ))}
          </ol>
        </BriefSection>

        <BriefSection id="questions" title="Questions">
          <QuestionList items={pkg.questions} />
        </BriefSection>
      </BriefLayout>

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
