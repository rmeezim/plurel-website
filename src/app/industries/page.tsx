import { ChapterHead, Closing, PageHead, Room } from "@/components/page";
import { Reveal } from "@/components/reveal";
import { CtaLink, GRID } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import { INDUSTRIES, SAMPLE_LABEL } from "@/lib/industries";
import { pageMetadata } from "@/lib/metadata";
import { AUDIT_HREF, LAYERS } from "@/lib/nav";

export const metadata = pageMetadata({
  title: "Who we work with — Plurel",
  description:
    "Plurel works with growing consumer brands, physical products, B2B technology and consumer technology companies: one system, tuned to where each one's buyers decide, and answerable for the number each one runs on.",
  path: "/industries/",
});

/*
  /industries: who Plurel works with, the page the homepage's Who it's for
  points to. The symptom first (the signs heard in a first call), then the
  four kinds of business, each on its own stretch of the room: who they
  are, where their buyers decide and the number we answer for, how each
  layer of the system is tuned for them, and one sample engagement,
  labelled as a sample in plain view. Data in lib/industries.ts.
*/

const SIGNS = [
  "Each supplier reports a different number, and none of them is the one you run on.",
  "The site says one thing, the ads another, and the press a third.",
  "Creators get a product and no brief.",
  "AI assistants name your competitors when your buyers ask.",
  "Nobody owns the whole path from first look to purchase.",
];

export default function IndustriesPage() {
  return (
    <main data-room="dark" className="bg-graphite text-paper">
      <PageHead
        lines={["Who we work with."]}
        standfirst="Growing companies whose marketing has outgrown one person and split across suppliers. Four kinds of business, one system, and a different number for each."
      >
        <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
      </PageHead>

      <Room labelledBy="signs-heading" className="pt-0 lg:pt-4">
        <ChapterHead
          id="signs-heading"
          lines={["Everything works.", "Nothing works together."]}
          aside="The industry matters less than the symptom. These are the signs we hear in a first call."
        />
        <Reveal className="mt-12 border-b border-paper/15 lg:mt-16">
          <ul>
            {SIGNS.map((sign) => (
              <li key={sign} className={`${GRID} border-t border-paper/15 py-5`}>
                <p className="type-title col-span-4 flex items-baseline gap-4 text-[19px] leading-[1.35] sm:col-span-6 lg:col-span-9 lg:text-[22px]">
                  <span aria-hidden className="size-[6px] shrink-0 -translate-y-[3px] bg-signal" />
                  {sign}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Room>

      {INDUSTRIES.map((ind) => (
        <section key={ind.key} id={ind.key} aria-labelledby={`industry-${ind.key}`} className="border-t border-paper/10">
          <div className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className={`${GRID} gap-y-10`}>
              <div className="col-span-4 sm:col-span-6 lg:col-span-4">
                <TypeReveal
                  id={`industry-${ind.key}`}
                  className="type-display text-[clamp(2.5rem,1.6rem+2.8vw,4rem)] leading-[0.95]"
                  lines={[ind.name]}
                />
                <Reveal>
                  <p className="mt-5 max-w-[38ch] text-[16px] leading-[1.55] text-fog">{ind.who}</p>
                  <dl className="mt-8 border-b border-paper/15">
                    <div className="border-t border-paper/15 py-3.5">
                      <dt className="text-[14px] font-medium text-fog">Where their buyers decide</dt>
                      <dd className="mt-1 text-[17px] leading-[1.4]">{ind.decide}</dd>
                    </div>
                    <div className="border-t border-paper/15 py-3.5">
                      <dt className="text-[14px] font-medium text-fog">The number we answer for</dt>
                      <dd className="mt-1 text-[17px] leading-[1.4]">{ind.numberLong}</dd>
                    </div>
                  </dl>
                </Reveal>
              </div>

              <Reveal className="col-span-4 sm:col-span-6 lg:col-span-7 lg:col-start-6">
                <p className="text-[15px] font-medium text-fog">How the system is tuned</p>
                <ol className="mt-3 border-b border-paper/15">
                  {LAYERS.map((L, i) => (
                    <li key={L.key} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 border-t border-paper/15 py-3.5 sm:grid-cols-[8rem_minmax(0,1fr)]">
                      <span className="text-[15px] text-fog">{L.name}</span>
                      <span className="text-[16px] leading-[1.5] lg:text-[17px]">{ind.tuning[i]}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-8 bg-paper/[0.04] p-5 sm:p-6 lg:p-7">
                  <p className="text-[14px] font-medium text-signal">{SAMPLE_LABEL}</p>
                  <div className="mt-4 grid gap-6 sm:grid-cols-2 sm:gap-8">
                    <div>
                      <p className="text-[14px] font-medium text-fog">What the Diagnostic found</p>
                      <p className="mt-2 text-[16px] leading-[1.55]">{ind.sample.found}</p>
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-fog">What ran first</p>
                      <p className="mt-2 text-[16px] leading-[1.55]">{ind.sample.ran}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      <Closing lines={["Your number,", "agreed on day one."]}>
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
