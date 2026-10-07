import type { ReactNode } from "react";
import { GlassBand } from "@/components/glass-band";
import { Accent, CONTAINER, CtaLink, GRID } from "@/components/system";
import { heroFilm } from "@/lib/film";
import { AUDIT_HREF } from "@/lib/nav";

/*
  Home hero: the statement, then a full-bleed band of glass over the film.
  The glass (GlassBand) hangs well clear of the statement and steps into a
  rising staircase as the visitor scrolls on; a cursor brings warm light
  into it. The Attention Field (the next section) picks up from here.
*/

/** Staggered line reveal: each line rises out of its own mask */
function Line({ children, delay, className = "" }: { children: ReactNode; delay: number; className?: string }) {
  return (
    <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em] pr-[0.1em]">
      <span className={`line-rise ${className}`} style={{ animationDelay: `${delay}ms` }}>
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  const film = heroFilm();

  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden bg-graphite text-paper">
      {/* Statement, with the action bottom-aligned on cols 10-12 */}
      <div className={`${CONTAINER} pt-32 sm:pt-36 lg:pt-40`}>
        <div className={`${GRID} gap-y-9 lg:items-end`}>
          <div className="col-span-4 sm:col-span-6 lg:col-span-8">
            {/* One flowing line; on narrow phones the Northeon tag drops whole to a second */}
            <p className="fade-up flex items-start gap-2.5 text-[13px] font-medium leading-[1.5]" style={{ animationDelay: "60ms" }}>
              <i aria-hidden className="mt-[6px] block size-[7px] shrink-0 bg-signal" />
              <span>
                Distribution, engineered{" "}
                <span className="whitespace-nowrap text-fog">· A Northeon company</span>
              </span>
            </p>
            <h1 id="hero-heading" className="type-display mt-6 text-[clamp(2.75rem,6.4vw,6.25rem)] leading-[0.98]">
              <Line delay={150}>Made to be</Line>
              <Line delay={290}>
                seen. <Accent className="text-fog">Everywhere.</Accent>
              </Line>
            </h1>
          </div>
          <div
            className="fade-up col-span-4 flex flex-col items-start gap-6 sm:col-span-5 lg:col-span-4 lg:col-start-9 lg:pb-2"
            style={{ animationDelay: "520ms" }}
          >
            <p className="max-w-[36ch] text-[17px] leading-[1.5] text-fog lg:text-[18px]">
              Great work no longer sells itself. Distribution does. Plurel engineers
              yours as one system, so the right clients find you and growth compounds.
            </p>
            <CtaLink href={AUDIT_HREF} className="w-full sm:w-auto">
              Request a diagnostic
            </CtaLink>
          </div>
        </div>
      </div>

      {/* Glass over the film: full bleed, well clear of the statement */}
      <GlassBand
        film={film}
        profile="rise"
        rest={0.56}
        progress="page"
        end={0.16}
        className="fade-up mt-20 h-[clamp(300px,54svh,560px)] sm:mt-24 lg:mt-28"
      />
    </section>
  );
}
