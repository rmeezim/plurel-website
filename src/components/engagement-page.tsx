import Link from "next/link";
import { PackageArt } from "@/components/artifacts/package-art";
import { Readout } from "@/components/artifacts/kit";
import { ArrowUpRight } from "@/components/icons";
import { LayerRows, Measures, Numbers, Steps } from "@/components/instruments";
import { ChapterHead, Closing, PageHead, Room } from "@/components/page";
import { faqJsonLd, QuestionList } from "@/components/questions";
import { CtaLink, GRID } from "@/components/system";
import { DISCIPLINES } from "@/lib/disciplines";
import { AUDIT_HREF, LAYERS } from "@/lib/nav";
import { ENGAGEMENTS, type Engagement } from "@/lib/engagements";
import { SITE_URL } from "@/lib/site";

/*
  An engagement (app/services/[slug] for reach, reputation, mindshare
  and revenue): what a company comes for, told as one argument. The want
  and who it is for; the case, with its live instrument (the page's
  artifact); the four layers tuned for it, with the disciplines that do
  each; the numbers it answers to, in the page's red room; the first
  ninety days; its questions; the other three engagements; then the
  closing. Copy in lib/engagements.ts.
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
  const rows = LAYERS.map((L, i) => ({
    key: L.key,
    name: L.name,
    line: pkg.layers[i],
    links: pkg.uses[L.key].map((slug) => {
      const d = DISCIPLINES.find((x) => x.slug === slug)!;
      return { name: d.name, href: d.href };
    }),
  }));
  const others = ENGAGEMENTS.filter((p) => p.key !== pkg.key);

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
      >
        <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
        <CtaLink href="/services" variant="outline-light" arrow="right">
          All engagements
        </CtaLink>
      </PageHead>

      <Room labelledBy="case-heading" className="pt-0 lg:pt-4">
        <ChapterHead id="case-heading" lines={pkg.caseHead} aside={pkg.caseBody} />
        <Numbers items={pkg.numbers} />
        <div className="mt-14 lg:mt-20">
          <PackageArt pkg={pkg.key} caption={<Readout items={pkg.readout} />} />
        </div>
      </Room>

      <Room labelledBy="layers-heading" className="border-t border-paper/10">
        <ChapterHead
          id="layers-heading"
          lines={["Four layers,", `tuned for ${pkg.term.toLowerCase()}.`]}
          aside="The same system runs every engagement. What changes is what each layer does, and which disciplines do it."
        />
        <LayerRows rows={rows} label={`The Plurel System, tuned for ${pkg.term.toLowerCase()}`} />
      </Room>

      <Room labelledBy="numbers-heading" tone="red">
        <ChapterHead
          id="numbers-heading"
          tone="red"
          lines={["The numbers", "it answers to."]}
          aside="Read with you in the Ledger, each as a cause of the one number agreed on day one."
        />
        <Measures items={pkg.metrics} tone="red" />
      </Room>

      <Room labelledBy="first90-heading">
        <ChapterHead id="first90-heading" lines={["The first", "ninety days."]} aside="It starts with the Diagnostic, and something ships every week after it." />
        <Steps items={pkg.first90.map((f) => ({ head: f.when, line: f.what }))} />
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
