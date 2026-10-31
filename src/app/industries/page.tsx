import { PathArt } from "@/components/artifacts/page-art";
import { ChapterHead, Closing, Room } from "@/components/page";
import { ServiceHead } from "@/components/service";
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
  points to. It opens on its drawing (four kinds of business, four paths,
  four numbers) and four facts set large; then the symptom (the signs heard in a first call), then the
  four kinds of business, each on its own stretch of the room: who they
  are, the number we answer for set large, where their buyers decide, how each
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
      <ServiceHead
        lines={["Who we work with."]}
        line="Four kinds of business, one system."
        standfirst={<p>Growing companies whose marketing has outgrown one person and split across suppliers, each with a different number.</p>}
        sig="industries"
        facts={[
          { value: "4", label: "kinds of growing business" },
          { value: "1", label: "system, tuned to where their buyers decide" },
          { value: "1", label: "number each answers to: the one it runs on" },
          { value: "Day 1", label: "that number agreed, in the Diagnostic" },
        ]}
      >
        <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
      </ServiceHead>

      <Room labelledBy="signs-heading" className="pt-0 lg:pt-4">
        <ChapterHead
          id="signs-heading"
          lines={["Everything works.", "Nothing works together."]}
          aside="The industry matters less than the symptom. These are the signs we hear in a first call."
        />
        <Reveal className="mt-12 lg:mt-16">
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {SIGNS.map((sign) => (
              <li key={sign} className="border-t border-paper/20 pb-8 pt-5">
                <span aria-hidden className="block size-[9px] bg-signal" />
                <p className="type-title mt-5 max-w-[30ch] text-[20px] leading-[1.3] lg:text-[22px]">{sign}</p>
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
                  <dl className="mt-8">
                    <div className="border-t border-paper/15 pt-5">
                      <dt className="text-[13px] text-fog">The number we answer for</dt>
                      <dd className="mt-2">
                        <span className="type-display block text-[clamp(1.875rem,1.5rem+1.4vw,2.625rem)] leading-[1.02] text-signal">{ind.number}</span>
                        <span className="mt-2 block max-w-[38ch] text-[15px] leading-[1.5] text-fog">{ind.numberLong}</span>
                      </dd>
                    </div>
                    <div className="mt-7 border-t border-paper/15 pt-5">
                      <dt className="text-[13px] text-fog">Where their buyers decide</dt>
                      <dd className="mt-3 flex flex-wrap gap-2">
                        {ind.decide.split(/, | and /).map((d) => (
                          <span key={d} className="inline-flex h-9 items-center border border-paper/25 px-3 text-[14px]">
                            {d.charAt(0).toUpperCase() + d.slice(1)}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </dl>
                </Reveal>
              </div>

              <div className="col-span-4 sm:col-span-6 lg:col-span-7 lg:col-start-6">
                <p className="mb-3 text-[15px] font-medium text-fog">How their buyers get to the number</p>
                <PathArt
                  steps={ind.path}
                  end={ind.number}
                  label={`The path ${ind.name.toLowerCase()} buyers take: ${ind.path.join(", then ")}, and then ${ind.number.toLowerCase()}.`}
                />
                <Reveal className="mt-10">
                  <p className="text-[15px] font-medium text-fog">How the system is tuned</p>
                  <ol className="mt-3 grid gap-x-8 sm:grid-cols-2">
                    {LAYERS.map((L, i) => (
                      <li key={L.key} className="border-t border-paper/15 py-4">
                        <span className="block text-[13px] text-fog">{L.name}</span>
                        <span className="mt-1 block text-[16px] leading-[1.5]">{ind.tuning[i]}</span>
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
