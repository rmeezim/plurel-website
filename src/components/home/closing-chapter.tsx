import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { GlassBand } from "@/components/glass-band";
import { Reveal } from "@/components/reveal";
import { CONTAINER, GRID } from "@/components/system";
import { heroFilm } from "@/lib/film";
import { AUDIT_HREF, CONTACT_EMAIL } from "@/lib/nav";

/* What comes back, in a sentence. The Proof chapter has already shown its
   win, leak and fix headings, so they are not repeated here. */
const OUTPUT = ["The same read as Halden's,", "run on your business."];

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper";

/*
  The last red room before the footer: the offer, specified, with one
  action and a person to write to. No running head: the headline names
  the chapter. Each fact lands once: what is scored (the sub-line), what
  comes back (the sentence on the right), what it costs and how fast
  (under the button), and that it is yours to keep.
*/
export function ClosingChapter() {
  return (
    <section aria-labelledby="closing-heading" className="relative bg-brand text-paper">
      <div className={`${CONTAINER} pt-24 pb-28 sm:pt-28 sm:pb-32 lg:pt-38 lg:pb-40`}>
        <Reveal>
          <h2
            id="closing-heading"
            className="type-display text-[clamp(3.5rem,10.6vw,8.5rem)] leading-none"
          >
            The Diagnostic.
          </h2>
        </Reveal>

        <div className={`${GRID} mt-10 gap-y-14 sm:mt-14 sm:gap-y-16 lg:mt-18 lg:gap-y-0`}>
          {/* Columns 1 to 6: what it is, then the action on the bottom edge */}
          <div className="col-span-4 flex flex-col sm:col-span-6">
            <p className="type-display max-w-[15em] text-[clamp(1.5rem,2.66vw,2.125rem)] leading-[1.12]">
              Six parts of your distribution, scored by a strategist.
            </p>
            <div className="mt-auto pt-10 lg:pt-12">
              <div className="grid grid-cols-4 gap-x-5 sm:grid-cols-6 sm:gap-x-6 lg:gap-x-8">
                <Link
                  href={AUDIT_HREF}
                  className={`group col-span-4 flex h-16 items-center justify-between gap-6 bg-paper px-6 text-[17px] font-medium tracking-[-0.01em] text-ink transition-colors duration-300 hover:bg-blush ${FOCUS}`}
                >
                  Request a diagnostic
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 shrink-0 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                  />
                </Link>
                <p className="col-span-4 mt-3.5 text-[15px] leading-[1.4]">
                  Free. Back within a business day.
                </p>
              </div>
              <p className="mt-9 text-[17px] leading-[1.4] tracking-[-0.01em] sm:mt-10">
                {"Or write to "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className={`relative whitespace-nowrap border-b border-paper/60 pb-1 font-medium transition-colors duration-300 after:absolute after:inset-x-0 after:-inset-y-3 hover:border-paper ${FOCUS}`}
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
          </div>

          {/* Columns 8 to 12: what comes back */}
          <div className="col-span-4 sm:col-span-6 lg:col-span-5 lg:col-start-8">
            <Reveal delay={0.08} className="border-b border-paper/30 pb-6">
              <p className="type-display text-[clamp(1.625rem,2.66vw,2.125rem)] leading-[1.12]">
                {OUTPUT.map((line, i) => (
                  <span key={line} className={`block ${i === OUTPUT.length - 1 ? "text-blush" : ""}`}>
                    {line}
                  </span>
                ))}
              </p>
            </Reveal>
            <p className="pt-4 text-[16px] leading-[1.45]">Yours to keep, whatever you decide.</p>
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
