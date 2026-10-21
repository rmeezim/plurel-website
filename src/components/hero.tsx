import type { CSSProperties } from "react";
import { GlassBand } from "@/components/glass-band";
import { CONTAINER, CtaLink, GRID } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import { heroFilm } from "@/lib/film";
import { labelTime } from "@/lib/pen";
import { AUDIT_HREF } from "@/lib/nav";

/*
  Home hero: the statement, then a full-bleed band of glass over the film.
  The glass (GlassBand) hangs well clear of the statement and steps into a
  rising staircase as the visitor scrolls on; a cursor brings warm light
  into it. What Plurel is (the next chapter, still graphite) picks up
  from here.

  The one orchestrated load, from first paint, in CSS (the vocabulary is
  in type-reveal.tsx): one pen, so nothing arrives at once. In ms: the
  kicker's square lights at 120 and its label is plotted from 180; the
  headline is plotted from 440 at the hero's pace, a line at a time, the
  pen lifting once before the fog-toned "Everywhere." (about 1.1s in
  all); the copy and the action light at 980 and 1080; the glass comes up
  last, from 1200 over 1.4s, by which time the film is drawing. No travel
  anywhere. No JS or reduced motion: finished and still.
*/

const KICKER = "Distribution, engineered";

const at = (delay: number, duration?: number): CSSProperties => ({
  animationDelay: `${delay}ms`,
  ...(duration ? { animationDuration: `${duration}ms` } : {}),
});

export function Hero() {
  const film = heroFilm();

  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden bg-graphite text-paper">
      {/* Statement, with the action bottom-aligned on cols 10-12 */}
      <div className={`${CONTAINER} pt-32 sm:pt-36 lg:pt-40`}>
        <div className={`${GRID} gap-y-9 lg:items-end`}>
          <div className="col-span-4 sm:col-span-6 lg:col-span-8">
            <p
              data-arrive="load"
              className="flex items-start gap-2.5 text-[13px] font-medium leading-[1.5]"
              style={{ "--kd": "120ms", "--kdur": `${labelTime(KICKER.length)}ms` } as CSSProperties}
            >
              <i aria-hidden className="kicker-mark mt-[6px] block size-[7px] shrink-0 bg-signal" />
              <span className="kicker-label">
                <span className="kicker-text">{KICKER}</span>
              </span>
            </p>
            <TypeReveal
              as="h1"
              id="hero-heading"
              onLoad
              delay={440}
              className="type-display mt-6 text-[clamp(2.75rem,6.4vw,6.25rem)] leading-[0.98] [--display-tracking:-0.044em] [--display-weight:360]"
              lines={["Made to be", ["seen.", { text: "Everywhere.", accent: true, className: "text-fog" }]]}
            />
          </div>
          <div className="col-span-4 flex flex-col items-start gap-6 sm:col-span-5 lg:col-span-4 lg:col-start-9 lg:pb-2">
            <p className="fade-in max-w-[36ch] text-[17px] leading-[1.5] text-fog lg:text-[18px]" style={at(980)}>
              Great work no longer sells itself. Distribution does. Plurel engineers
              yours as one system, so the right customers find you and growth compounds.
            </p>
            <div className="fade-in flex w-full sm:w-auto" style={at(1080)}>
              <CtaLink href={AUDIT_HREF} className="w-full sm:w-auto">
                Request a diagnostic
              </CtaLink>
            </div>
          </div>
        </div>
      </div>

      {/* Glass over the film: full bleed, well clear of the statement. It
          comes up last and slowly, by which time the film is drawing. */}
      <div className="fade-in mt-20 sm:mt-24 lg:mt-28" style={at(1200, 1400)}>
        <GlassBand
          film={film}
          profile="rise"
          rest={0.56}
          progress="page"
          end={0.16}
          className="h-[clamp(300px,54svh,560px)]"
        />
      </div>
    </section>
  );
}
