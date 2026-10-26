import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { Closing, PageHead } from "@/components/page";
import { Reveal } from "@/components/reveal";
import { CONTAINER, CtaLink, GRID } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import { DISCIPLINES } from "@/lib/disciplines";
import { pageMetadata } from "@/lib/metadata";
import { AUDIT_HREF } from "@/lib/nav";
import { STAGES, type StageKey } from "@/lib/services-type";

export const metadata = pageMetadata({
  title: "Services: the Plurel System — Plurel",
  description:
    "Brand, site, search, content, paid and press, run as one system: four layers (Narrative, Create, Distribute, Measure), eight disciplines, one team and one number.",
  path: "/services/",
});

/*
  /services: the Plurel System in full, the page the homepage's services
  chapter points to. Its four layers as four full-width bands, read top to
  bottom as on the homepage, each a graphite tone a step deeper than the
  one above: the layer's name and the instrument it builds; what that is
  and what goes into it; its disciplines (each to its own page), its
  cadence and what it feeds. The loop is said in Measure's band, and the
  page closes in the red room.
*/

const DETAIL: Record<StageKey, { what: string; contains: readonly string[]; cadence: string; tone: number }> = {
  narrative: {
    what: "The Core Brief is the one document every asset, ad and answer is cut from: who you are for, what you promise, why it is true, and how you sound, in the words your buyers use.",
    contains: [
      "The position, in one sentence",
      "The proof behind it",
      "A message for each buyer",
      "The identity and the voice",
      "What you never say",
    ],
    cadence: "Written in the first weeks, and reset every quarter from what the Ledger reads.",
    tone: 16,
  },
  create: {
    what: "The Asset System is everything the brief turns into: the site, content, film, creator kits and ads, each cut for the surface it runs on, from one shoot and one story.",
    contains: [
      "The site and its pages",
      "Film, cut for every format",
      "Creator and UGC kits",
      "Ads, built in sets",
      "Articles and research worth citing",
    ],
    cadence: "Something ships every week.",
    tone: 12,
  },
  distribute: {
    what: "The Surface Plan decides which surface gets which cut, in what order and on what budget, from AI answers and search to paid, press, creators and stores.",
    contains: [
      "Where your buyers decide, ranked",
      "The order surfaces open in",
      "A budget and a ceiling for each",
      "Who carries each message",
      "What runs this month",
    ],
    cadence: "Planned each quarter, and moved each month.",
    tone: 8,
  },
  measure: {
    what: "The Ledger holds the one number, agreed on day one, with the signals that moved it and where the budget goes next. Reach, mentions and clicks sit in it as causes, never as results.",
    contains: [
      "The one number, for each buyer",
      "The signals that moved it",
      "Spend against what it produced",
      "What moves next month",
      "What resets next quarter",
    ],
    cadence: "Read with you every month, and reset every quarter: what it learns goes back into Narrative and Distribute.",
    tone: 5,
  },
};

export default function ServicesPage() {
  return (
    <main data-room="dark" className="bg-graphite text-paper">
      <PageHead
        lines={["Your marketing,", "as one system."]}
        standfirst="Brand, site, search, content, paid and press usually sit with different suppliers, each with its own brief and its own report. We run them as four layers of one system, against one number."
      >
        <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
        <CtaLink href="/method" variant="outline-light" arrow="right">
          How an engagement runs
        </CtaLink>
      </PageHead>

      <ol aria-label="The Plurel System, top to bottom">
        {STAGES.map((st, i) => {
          const d = DETAIL[st.key];
          const disciplines = DISCIPLINES.filter((x) => x.layer === st.key);
          const last = i === STAGES.length - 1;
          return (
            <li
              key={st.key}
              className="border-t border-graphite"
              style={{ backgroundColor: `color-mix(in srgb, var(--color-graphite), var(--color-fog) ${d.tone}%)` } as CSSProperties}
            >
              <div className={`${CONTAINER} py-14 lg:py-20`}>
                <div className={`${GRID} gap-y-10`}>
                  <div className="col-span-4 sm:col-span-6 lg:col-span-4">
                    <TypeReveal
                      as="h2"
                      id={`layer-${st.key}`}
                      className="type-display text-[clamp(2.75rem,1rem+4.2vw,5.25rem)] leading-[0.9]"
                      lines={[st.name]}
                    />
                    <p className="type-title mt-5 text-[clamp(1.25rem,1rem+0.8vw,1.625rem)] leading-[1.15]">{st.builds}</p>
                  </div>

                  <Reveal className="col-span-4 sm:col-span-6 lg:col-span-4">
                    <p className="max-w-[46ch] text-[17px] leading-[1.55]">{d.what}</p>
                    <ul aria-label={`In ${st.builds}`} className="mt-6 border-b border-paper/15">
                      {d.contains.map((c) => (
                        <li key={c} className="border-t border-paper/15 py-2.5 text-[15px] leading-[1.4] text-fog">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </Reveal>

                  <Reveal className="col-span-4 sm:col-span-6 lg:col-span-4">
                    <ul aria-label={`${st.name} disciplines`} className="border-b border-paper/15">
                      {disciplines.map((x) => (
                        <li key={x.slug} className="border-t border-paper/15">
                          <Link href={x.href} className="group flex items-baseline justify-between gap-4 py-3.5">
                            <span>
                              <span className="type-title block text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] leading-[1.2] transition-colors group-hover:text-signal">
                                {x.name}
                              </span>
                              <span className="mt-1 block text-[14px] leading-[1.4] text-fog">{x.tagline}</span>
                            </span>
                            <ArrowUpRight className="size-4 shrink-0 opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-6 max-w-[40ch] text-[15px] leading-[1.5] text-fog">{d.cadence}</p>
                    <p className="mt-3 flex items-center gap-2 text-[15px] font-medium">
                      {last ? (
                        st.feeds
                      ) : (
                        <>
                          <ArrowRight aria-hidden className="size-3.5 rotate-90 text-signal" />
                          {st.feeds}
                        </>
                      )}
                    </p>
                  </Reveal>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <Closing lines={["Four layers.", "One number."]}>
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
