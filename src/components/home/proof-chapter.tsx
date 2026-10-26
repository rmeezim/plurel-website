import { Reveal } from "@/components/reveal";
import { CONTAINER, CtaLink, GRID, H2 } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import { AUDIT_HREF } from "@/lib/nav";
import { PROOF_ID, SAMPLE_DIAGNOSTIC as D, SAMPLE_HREF, SAMPLE_TOTAL } from "@/lib/proof";

/*
  Proof: what a Diagnostic hands back, in one screen.

  There are no client cases yet, so the chapter shows the deliverable
  itself, cut to what a visitor needs to believe it: a sample Diagnostic
  for Halden, a sample company the intro introduces as one and the sheet
  labels as one in its top bar. The sheet, a step up from the graphite
  room, carries the company and its total, the six parts' scores, and the
  read in three short lines. The full sample (the findings, what runs
  first, what we would measure) is a page of its own, one action away.

  Server component. Motion: the headline and the company's name plotted
  on TypeReveal, the sheet lit by Reveal, and its six bars drawn together
  at one steady rate once it lights, like an instrument reading out
  (no-JS and reduced motion get finished type and bars).
*/

/** The scores that read as weak, marked in signal red */
const WEAK = 3;

/* A bar draws left to right, at a steady rate, once the sheet's Reveal
   comes in: all six at once, a beat after the sheet lights. Collapsed only
   while armed; finished for no-JS, reduced motion and anything already on
   screen. */
const DRAW =
  "origin-left motion-safe:[.reveal-armed_&]:scale-x-0 " +
  "motion-safe:[.reveal-in_&]:transition-transform motion-safe:[.reveal-in_&]:duration-500 " +
  "motion-safe:[.reveal-in_&]:ease-linear motion-safe:[.reveal-in_&]:delay-150";

export function ProofChapter() {
  return (
    <section id={PROOF_ID} aria-labelledby="proof-heading" className="bg-graphite text-paper">
      <div className={`${CONTAINER} py-24 lg:py-36`}>
        <div className={`${GRID} gap-y-8 lg:items-end`}>
          <div className="col-span-4 sm:col-span-6 lg:col-span-8">
            <TypeReveal
              id="proof-heading"
              className={H2}
              lines={["What a Diagnostic finds."]}
            />
          </div>
          <Reveal className="col-span-4 sm:col-span-4 lg:col-span-3 lg:col-start-10 lg:pb-1">
            <p className="max-w-[40ch] text-[16px] leading-[1.55] text-fog">
              An excerpt of a Diagnostic run on Halden, a sample company that sells
              quiet heat pumps to homeowners and housebuilders.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-14 lg:mt-20">
          <article
            aria-labelledby="proof-sample-title"
            className="bg-paper/[0.04] px-5 pb-8 pt-5 sm:px-8 sm:pb-10 sm:pt-6 lg:px-12 lg:pb-12 lg:pt-7"
          >
            {/* Top bar: the sample label, in plain view */}
            <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2.5">
              <p className="text-[14px] font-medium">{D.label}</p>
              <p className="text-[14px] font-medium text-signal">{D.note}</p>
            </div>

            <div className={`${GRID} mt-10 gap-y-10 sm:mt-12 lg:mt-14`}>
              {/* The company and its total */}
              <div className="col-span-4 sm:col-span-6 lg:col-span-5">
                <TypeReveal
                  as="h3"
                  id="proof-sample-title"
                  className="type-display text-[clamp(3.25rem,1.9rem+4.2vw,5.5rem)] leading-[0.9]"
                  lines={[D.client]}
                />
                <p className="mt-4 max-w-[30ch] text-[15px] leading-[1.45] text-fog">{D.about}</p>
                <p className="mt-6 flex items-baseline gap-2 text-[14px] text-fog">
                  <span className="type-title figures text-[32px] leading-none text-paper">
                    {SAMPLE_TOTAL}
                  </span>
                  out of 60
                </p>
              </div>

              {/* The six parts, scored out of 10 */}
              <ul
                aria-label="Six parts, scored out of 10"
                className="col-span-4 sm:col-span-6 lg:col-span-7 lg:col-start-6"
              >
                {D.parts.map((p) => {
                  const weak = p.score <= WEAK;
                  return (
                    <li
                      key={p.part}
                      className="grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,6rem)] items-center gap-x-4 border-t border-paper/12 py-2.5 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(0,1fr)_2rem_minmax(0,9rem)]"
                    >
                      <span className="text-[15px] leading-[1.3]">{p.part}</span>
                      <span
                        className={`type-title figures text-right text-[22px] leading-none ${weak ? "text-signal" : ""}`}
                      >
                        {p.score}
                        <span className="sr-only"> out of 10</span>
                      </span>
                      <span aria-hidden className="relative h-[6px] bg-paper/10">
                        <span
                          className={`absolute inset-y-0 left-0 ${weak ? "bg-signal" : "bg-paper"} ${DRAW}`}
                          style={{ width: `${p.score * 10}%` }}
                        />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* The read, in three short lines */}
            <div className={`${GRID} mt-12 gap-y-8 lg:mt-14`}>
              {D.read.map((r, i) => {
                const fix = i === D.read.length - 1;
                return (
                  <div
                    key={r.head}
                    className={`col-span-4 border-t-2 pt-4 sm:col-span-6 lg:col-span-4 ${fix ? "border-signal" : "border-paper"}`}
                  >
                    <h4 className={`text-[15px] font-medium ${fix ? "text-signal" : ""}`}>{r.head}</h4>
                    <p className="mt-2.5 max-w-[38ch] text-[16px] leading-[1.45]">{r.short}</p>
                  </div>
                );
              })}
            </div>
          </article>
        </Reveal>

        <Reveal className="mt-10 flex flex-wrap gap-2 lg:mt-12">
          <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
          <CtaLink href={SAMPLE_HREF} variant="outline-light" arrow="right">
            See the full sample
          </CtaLink>
        </Reveal>
      </div>
    </section>
  );
}
