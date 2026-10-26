import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { CONTAINER, GRID, H2 } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import { PACE, plotEnd, type RevealLine } from "@/lib/plot";

/*
  The interior pages' parts, in the homepage's system: every page opens
  in the graphite room under the floating header, its chapters lie on the
  same 12-column grid, and most close in a red room (the Diagnostic ends
  on its request form). No labels over headlines: each headline names its
  chapter. Anchored rooms clear the header through the page's
  scroll-padding (globals.css), not a margin of their own.

  - PageHead: the page's h1, plotted on load at the hero's pace (the
    page's one orchestrated moment), its standfirst and then its actions
    lit as the pen lifts (timed from the head's own length, lib/plot.ts),
    on columns 9-12.
  - ChapterHead: a chapter's h2 (plotted as it enters) with an optional
    aside on columns 9-12.
  - Room: a chapter's room, graphite or red, with the chapter padding.
  - Closing: the red room a page ends on: one line and its actions.
*/

const at = (ms: number): CSSProperties => ({ animationDelay: `${Math.round(ms)}ms` });

/** The page head's pen: when it starts, and the beat before what lights after it */
const HEAD = { delay: 160, beat: 100 } as const;

export function PageHead({
  lines,
  standfirst,
  children,
  id = "page-heading",
}: {
  lines: readonly RevealLine[];
  standfirst: ReactNode;
  /** The page's actions, under the standfirst */
  children?: ReactNode;
  id?: string;
}) {
  const lit = plotEnd(lines, PACE.hero, HEAD.delay) + HEAD.beat;
  return (
    <div className={`${CONTAINER} pb-20 pt-32 sm:pt-36 lg:pb-28 lg:pt-44`}>
      <div className={`${GRID} gap-y-8 lg:items-end`}>
        <div className="col-span-4 sm:col-span-6 lg:col-span-8">
          <TypeReveal
            as="h1"
            id={id}
            onLoad
            delay={HEAD.delay}
            className="type-display text-[clamp(2.75rem,1.4rem+5vw,5.75rem)] leading-[0.98] [--display-tracking:-0.044em] [--display-weight:360]"
            lines={lines}
          />
        </div>
        <div className="col-span-4 sm:col-span-5 lg:col-span-4 lg:col-start-9 lg:pb-2">
          <div className="fade-in max-w-[40ch] text-[17px] leading-[1.55] text-fog lg:text-[18px]" style={at(lit)}>
            {standfirst}
          </div>
          {children && (
            <div className="fade-in mt-7 flex flex-wrap gap-2" style={at(lit + HEAD.beat)}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ChapterHead({
  id,
  lines,
  aside,
  tone = "dark",
  className = "",
}: {
  id: string;
  lines: readonly RevealLine[];
  aside?: ReactNode;
  tone?: "dark" | "red";
  className?: string;
}) {
  return (
    <div className={`${GRID} gap-y-6 lg:items-end ${className}`}>
      <TypeReveal id={id} className={`${H2} col-span-4 sm:col-span-6 lg:col-span-8`} lines={lines} />
      {aside && (
        <Reveal className="col-span-4 sm:col-span-5 lg:col-span-4 lg:col-start-9 lg:pb-1">
          <div className={`max-w-[40ch] text-[16px] leading-[1.55] ${tone === "red" ? "" : "text-fog"}`}>{aside}</div>
        </Reveal>
      )}
    </div>
  );
}

export function Room({
  labelledBy,
  tone = "dark",
  id,
  children,
  className = "",
}: {
  labelledBy: string;
  tone?: "dark" | "red";
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`${tone === "red" ? "bg-brand" : "bg-graphite"} text-paper`}
    >
      <div className={`${CONTAINER} py-24 lg:py-32 ${className}`}>{children}</div>
    </section>
  );
}

export function Closing({
  id = "closing-line",
  lines,
  children,
}: {
  id?: string;
  lines: readonly RevealLine[];
  /** The actions: a paper CtaLink, and an outlined one beside it */
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="bg-brand text-paper">
      <div className={`${CONTAINER} py-24 lg:py-32`}>
        <div className={`${GRID} gap-y-10 lg:items-end`}>
          <TypeReveal
            as="h2"
            id={id}
            className="type-display col-span-4 text-[clamp(2.25rem,1.6rem+2.6vw,4rem)] leading-none sm:col-span-6 lg:col-span-8"
            lines={lines}
          />
          <Reveal className="col-span-4 flex flex-wrap gap-2 sm:col-span-6 lg:col-span-4 lg:col-start-9 lg:justify-end lg:pb-1">
            {children}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
