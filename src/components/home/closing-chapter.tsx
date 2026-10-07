import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { GlassBand } from "@/components/glass-band";
import { Reveal } from "@/components/reveal";
import { CONTAINER, GRID, Meta } from "@/components/system";
import { heroFilm } from "@/lib/film";
import { NEXT_STEPS } from "@/lib/home";
import { AUDIT_HREF } from "@/lib/nav";

/* What the audit hands back: the Diagnose phase's own promise
   ("where you win, where you leak, and what to fix first"). */
const OUTPUT = ["Where you win.", "Where you leak.", "What to fix first."];

/* The last step of the engagement path: "Your audit & roadmap" */
const KEEP = NEXT_STEPS[NEXT_STEPS.length - 1].detail;

/* Column ticks on the running-head hairline, following GRID
   (4 / 6 / 12 columns); the last visible column also marks its right
   edge. Same registration marks as ChapterHead, for an unnumbered head. */
const TICKS = Array.from({ length: 12 }, (_, i) => {
  const show = i < 4 ? "block" : i < 6 ? "hidden sm:block" : "hidden lg:block";
  const close =
    i === 3
      ? "border-r sm:border-r-0"
      : i === 5
        ? "sm:border-r lg:border-r-0"
        : i === 11
          ? "lg:border-r"
          : "";
  return `${show} ${close}`;
});

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper";

/* Output rows: an inline index on phones, a hanging index column from
   sm (column 1 of 6) and lg (column 8 of 12, lines from column 9). */
const ROW =
  "flex items-baseline gap-4 sm:grid sm:grid-cols-6 sm:gap-x-6 lg:grid-cols-5 lg:gap-x-8";
const ROW_LINE = "sm:col-span-5 lg:col-span-4";

/** The last red room before the footer: the offer, specified, with two doors */
export function ClosingChapter() {
  return (
    <section aria-labelledby="closing-heading" className="relative bg-brand text-paper">
      <div className={`${CONTAINER} pt-24 pb-28 sm:pt-28 sm:pb-32 lg:pt-38 lg:pb-40`}>
        {/* Running head: the invitation and the audit's three facts */}
        <div className="relative border-t border-paper/30 pt-4.5">
          <div
            aria-hidden
            className={`${GRID} pointer-events-none absolute inset-x-0 top-0`}
          >
            {TICKS.map((cls, i) => (
              <span key={i} className={`h-[6px] border-l border-paper/60 ${cls}`} />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2.5">
            <Meta as="p" className="flex items-center gap-3 text-paper">
              <span aria-hidden className="size-[7px] shrink-0 bg-paper" />
              Start a growth transformation
            </Meta>
            <Meta as="p" className="text-paper">
              <span className="whitespace-nowrap">Free · ~1 business day ·</span>{" "}
              <span className="whitespace-nowrap">Read by a strategist</span>
            </Meta>
          </div>
        </div>

        <Reveal className="mt-14 sm:mt-20 lg:mt-24">
          <h2
            id="closing-heading"
            className="type-display text-[clamp(3.5rem,10.6vw,8.5rem)] leading-none"
          >
            The Growth Audit.
          </h2>
        </Reveal>

        <div className={`${GRID} mt-10 gap-y-16 sm:mt-14 sm:gap-y-20 lg:mt-18 lg:gap-y-0`}>
          {/* Columns 1 to 6: what it is, then the two doors on the bottom edge */}
          <div className="col-span-4 flex flex-col sm:col-span-6">
            <p className="type-display max-w-[15em] text-[clamp(1.5rem,2.66vw,2.125rem)] leading-[1.12]">
              A strategist&apos;s read on where your marketing system breaks.
            </p>
            <div className="mt-auto grid grid-cols-4 items-center gap-x-5 gap-y-5 pt-10 sm:grid-cols-6 sm:gap-x-6 lg:gap-x-8 lg:pt-12">
              <Link
                href={AUDIT_HREF}
                className={`group col-span-4 flex h-16 items-center justify-between gap-6 bg-paper px-6 text-[17px] font-medium tracking-[-0.01em] text-ink transition-colors duration-300 hover:bg-blush ${FOCUS}`}
              >
                Book a growth audit
                <ArrowUpRight
                  aria-hidden
                  className="size-4 shrink-0 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/contact"
                className={`group col-span-4 inline-flex min-h-11 items-center gap-2.5 justify-self-start whitespace-nowrap border-b border-paper/60 pb-1.5 text-[17px] font-medium tracking-[-0.01em] text-paper transition-colors duration-300 hover:border-paper sm:col-span-2 ${FOCUS}`}
              >
                Or a strategy call
                <ArrowRight
                  aria-hidden
                  className="size-3.5 shrink-0 transition-transform duration-300 motion-safe:group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* Columns 8 to 12: the output, indexes hanging in column 8 */}
          <div className="col-span-4 sm:col-span-6 lg:col-span-5 lg:col-start-8">
            <div className={`${ROW} justify-between border-b border-paper/30 pb-3.5`}>
              <Meta as="p" className="text-paper">
                Output
              </Meta>
              <Meta as="p" className={`text-paper ${ROW_LINE}`}>
                A prioritized read
              </Meta>
            </div>
            <ol className="border-b border-paper/30 pt-2.5 pb-5">
              {OUTPUT.map((line, i) => (
                <li key={line}>
                  <Reveal delay={0.08 * (i + 1)} className={`${ROW} pt-3`}>
                    <Meta className="text-paper">
                      {String(i + 1).padStart(2, "0")}
                    </Meta>
                    <span
                      className={`type-display text-[clamp(1.625rem,2.66vw,2.125rem)] leading-[1.08] ${ROW_LINE} ${
                        i === OUTPUT.length - 1 ? "text-blush" : "text-paper"
                      }`}
                    >
                      {line}
                    </span>
                  </Reveal>
                </li>
              ))}
            </ol>
            <div className={`${ROW} pt-4`}>
              <p className="text-[16px] leading-[1.45] text-paper sm:col-start-2 sm:col-end-7 lg:col-end-6">
                {KEEP}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* The glass edge: the red room ends in the hero's nine flutes, hung
          over a paper strip that leads into the footer. They start on a
          short fringe and drop into an arc as the footer comes up, deepest
          at the center, so the page settles rather than climbs. */}
      <div className="relative h-[clamp(152px,15vw,208px)] bg-paper">
        <GlassBand
          film={heroFilm()}
          profile="arc"
          rest={0.2}
          progress="viewport"
          start={0.98}
          end={0.4}
          className="h-full"
        />
      </div>
    </section>
  );
}
