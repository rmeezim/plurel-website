import Link from "next/link";
import { BriefRail } from "@/components/brief-rail";
import { Instrument } from "@/components/figures/instrument";
import { BriefHead, BriefLayout, BriefSection, BriefStats, BriefTable, Closing, Prose } from "@/components/page";
import { faqJsonLd, QuestionList } from "@/components/questions";
import { CtaLink } from "@/components/system";
import { type Discipline } from "@/lib/disciplines";
import { engagementsUsing } from "@/lib/engagements";
import { AUDIT_HREF, LAYERS, SERVICES } from "@/lib/nav";
import { STAGES } from "@/lib/services-type";
import { SITE_URL } from "@/lib/site";

/*
  One discipline (app/services/[slug]), laid out as a brief
  (components/page.tsx), the same anatomy as the engagements: the head
  with what it is and its spec sheet; then an overview with the
  published numbers behind it; how it works, with its one figure; what
  you get; how it is measured; where it sits in the Plurel System;
  questions; then the closing. Copy in lib/disciplines.ts.
*/

const SECTIONS = [
  { id: "overview", title: "Overview" },
  { id: "how-it-works", title: "How it works" },
  { id: "deliverables", title: "What you get" },
  { id: "measured", title: "How it’s measured" },
  { id: "system", title: "Where it sits" },
  { id: "questions", title: "Questions" },
];

const cadence = (whens: readonly string[]) => {
  const set = ["Weekly", "Monthly", "Quarterly"].filter((w) => whens.includes(w));
  return set.length > 1 ? `${set.slice(0, -1).join(", ")} and ${set[set.length - 1].toLowerCase()}` : set[0] ?? "Monthly";
};

const link = "underline decoration-signal decoration-1 underline-offset-[5px] transition-colors hover:text-signal";

export function DisciplinePage({ d }: { d: Discipline }) {
  const layer = LAYERS.find((L) => L.key === d.layer)!;
  const stage = STAGES.find((s) => s.key === d.layer)!;
  const engagements = engagementsUsing(d.slug);
  const alongside = SERVICES.filter((s) => s.layer === d.layer && s.slug !== d.slug);

  const SERVICE_LD = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: d.name,
    description: d.lead,
    provider: { "@id": `${SITE_URL}/#organization` },
    serviceType: d.name,
  };

  const inEngagements =
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
    );

  return (
    <main data-room="dark" className="bg-graphite text-paper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd(d.questions) }} />

      <BriefHead
        lines={[d.name]}
        line={d.tagline}
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
          { k: "Runs in", v: inEngagements },
          { k: "Hired", v: "On its own, or inside an engagement" },
          { k: "Starts with", v: "The Diagnostic, read within a business day" },
          { k: "Read", v: `${cadence(d.metrics.map((m) => m.when))} in the Ledger` },
        ]}
      >
        <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
        <CtaLink href="/services" variant="outline-light" arrow="right">
          All disciplines
        </CtaLink>
      </BriefHead>

      <BriefLayout
        rail={
          <BriefRail sections={SECTIONS}>
            <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
          </BriefRail>
        }
      >
        <BriefSection id="overview" title="Overview" lead={d.caseHead}>
          <Prose>
            <p>{d.body[0]}</p>
          </Prose>
          {d.numbers && d.numbers.length > 0 && <BriefStats items={d.numbers} />}
        </BriefSection>

        <BriefSection id="how-it-works" title="How it works" lead={d.body[1]}>
          <Instrument k={d.slug} />
        </BriefSection>

        <BriefSection id="deliverables" title="What you get">
          <ul className="grid gap-x-10 border-t border-paper/15 sm:grid-cols-2">
            {d.deliverables.map((item) => (
              <li key={item} className="flex items-baseline gap-3 border-b border-paper/10 py-4 text-[17px] leading-[1.45] text-paper">
                <span aria-hidden className="size-[6px] shrink-0 -translate-y-[3px] bg-signal" />
                {item}
              </li>
            ))}
          </ul>
        </BriefSection>

        <BriefSection id="measured" title="How it’s measured" lead="Read with you in the Ledger, each as a cause of the one number agreed on day one.">
          <BriefTable caption={`The measures ${d.name} answers to`} head={["Measure", "What it is", "Read"]} rows={d.metrics.map((m) => [m.name, m.what, m.when])} />
        </BriefSection>

        <BriefSection id="system" title="Where it sits" lead={`Part of ${layer.name}, one of the Plurel System’s four layers, and always run as part of the whole.`}>
          <dl className="border-t border-paper/15">
            {[
              ["Runs on", d.runsOn],
              ["Feeds", d.feeds],
              ["Runs in", inEngagements],
              [
                `Alongside it in ${layer.name}`,
                alongside.length ? (
                  <>
                    {alongside.map((s, i) => (
                      <span key={s.slug}>
                        {i > 0 && (i === alongside.length - 1 ? " and " : ", ")}
                        <Link href={s.href} className={link}>
                          {s.name}
                        </Link>
                      </span>
                    ))}
                  </>
                ) : (
                  "It is the layer’s only discipline"
                ),
              ],
            ].map(([k, v]) => (
              <div key={k as string} className="grid gap-x-8 gap-y-1 border-b border-paper/10 py-4 sm:grid-cols-[11rem_1fr]">
                <dt className="text-[15px] text-fog">{k}</dt>
                <dd className="max-w-[56ch] text-[16px] leading-[1.55] text-paper">{v}</dd>
              </div>
            ))}
          </dl>
        </BriefSection>

        <BriefSection id="questions" title="Questions">
          <QuestionList items={d.questions} />
        </BriefSection>
      </BriefLayout>

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
