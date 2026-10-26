import type { CSSProperties } from "react";
import { GlassBand } from "@/components/glass-band";
import { CONTAINER, CtaLink, GRID } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import { heroFilm } from "@/lib/film";
import { AUDIT_HREF } from "@/lib/nav";
import { SAMPLE_HREF } from "@/lib/proof";

/*
  Home hero: the statement, then a full-bleed band of glass over the film.
  The glass (GlassBand) hangs well clear of the statement and steps into a
  rising staircase as the visitor scrolls on; a cursor brings warm light
  into it. What Plurel is (the next chapter, still graphite) picks up
  from here.

  The one orchestrated load, from first paint, in CSS (the vocabulary is
  in type-reveal.tsx): one pen, so nothing arrives at once, and no label
  over the headline. In ms: the headline is plotted from 160 at the
  hero's pace, a line at a time, the pen lifting once before the
  fog-toned "Everywhere." (about 1.1s in all); the copy and the two
  actions (a diagnostic, or a sample of one) light at 700 and 800; the
  glass comes up last, from 920 over 1.4s, by which time the film is
  drawing. No travel anywhere. No JS or reduced motion: finished and
  still.
*/

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
            <TypeReveal
              as="h1"
              id="hero-heading"
              onLoad
              delay={160}
              className="type-display text-[clamp(2.75rem,6.4vw,6.25rem)] leading-[0.98] [--display-tracking:-0.044em] [--display-weight:360]"
              lines={["Made to be", ["seen.", { text: "Everywhere.", accent: true, className: "text-fog" }]]}
            />
          </div>
          <div className="col-span-4 flex flex-col items-start gap-6 sm:col-span-5 lg:col-span-4 lg:col-start-9 lg:pb-2">
            <p className="fade-in max-w-[36ch] text-[17px] leading-[1.5] text-fog lg:text-[18px]" style={at(700)}>
              Great work no longer sells itself. Distribution does. Plurel engineers
              yours, from reach to revenue, as one system, so growth compounds.
            </p>
            <div className="fade-in flex flex-wrap gap-2" style={at(800)}>
              <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
              <CtaLink href={SAMPLE_HREF} variant="outline-light" arrow="right">
                See a sample
              </CtaLink>
            </div>
          </div>
        </div>
      </div>

      {/* Glass over the film: full bleed, well clear of the statement. It
          comes up last and slowly, by which time the film is drawing. */}
      <div className="fade-in mt-20 sm:mt-24 lg:mt-28" style={at(920, 1400)}>
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
