import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { CONTAINER, GRID, H2 } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import type { Stat } from "@/lib/brief";
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
    on columns 9-12; then, on the service pages, its spec sheet: what it
    is in a few plain facts, across the grid.
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
  spec,
  id = "page-heading",
}: {
  lines: readonly RevealLine[];
  standfirst: ReactNode;
  /** The page's actions, under the standfirst */
  children?: ReactNode;
  /** The page's spec sheet: a few plain facts, label and value */
  spec?: readonly { k: string; v: ReactNode }[];
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
      {spec && (
        <dl
          className="fade-in mt-16 grid grid-cols-2 border-t border-paper/15 sm:grid-cols-3 lg:mt-24 lg:grid-cols-5"
          style={at(lit + 2 * HEAD.beat)}
        >
          {spec.map((r) => (
            <div
              key={r.k}
              className="relative border-b border-paper/10 py-4 pr-4 before:absolute before:inset-x-0 before:-top-px before:h-px before:origin-left before:scale-x-0 before:bg-signal before:transition-transform before:duration-500 before:ease-linear hover:before:scale-x-100 sm:py-5 lg:border-b-0 lg:border-l lg:px-5 lg:first:border-l-0 lg:first:pl-0"
            >
              <dt className="text-[13px] leading-[1.3] text-fog">{r.k}</dt>
              <dd className="mt-2 text-[16px] leading-[1.35] text-paper lg:text-[17px]">{r.v}</dd>
            </div>
          ))}
        </dl>
      )}
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

/*
  The brief: the engagement and discipline pages, laid out like a
  document so they can be read top to bottom in a few minutes. The head
  sets its h1, its line and its standfirst in one column, the actions
  under them and the spec sheet across the grid; then the sections run in
  one reading column (columns 5 to 12 from lg), each with the same parts
  on the same left edge (heading, lead, body, then a figure or a table),
  with the contents rail on columns 1 to 3, sticky, beside them.
*/

export function BriefHead({
  lines,
  line,
  standfirst,
  spec,
  children,
  id = "page-heading",
}: {
  lines: readonly RevealLine[];
  /** One sentence under the h1: what it is for */
  line: ReactNode;
  standfirst: ReactNode;
  spec: readonly { k: string; v: ReactNode }[];
  children?: ReactNode;
  id?: string;
}) {
  const lit = plotEnd(lines, PACE.hero, HEAD.delay) + HEAD.beat;
  return (
    <div className={`${CONTAINER} pb-16 pt-32 sm:pt-36 lg:pb-20 lg:pt-44`}>
      <div className="max-w-[60rem]">
        <TypeReveal
          as="h1"
          id={id}
          onLoad
          delay={HEAD.delay}
          className="type-display text-[clamp(2.75rem,1.4rem+5vw,5.75rem)] leading-[0.98] [--display-tracking:-0.044em] [--display-weight:360]"
          lines={lines}
        />
        <div className="fade-in" style={at(lit)}>
          <p className="type-title mt-6 text-[clamp(1.375rem,1.2rem+0.8vw,1.875rem)] leading-[1.25] text-paper">{line}</p>
          <div className="mt-4 max-w-[60ch] text-[18px] leading-[1.55] text-fog">{standfirst}</div>
        </div>
        {children && (
          <div className="fade-in mt-8 flex flex-wrap gap-2" style={at(lit + HEAD.beat)}>
            {children}
          </div>
        )}
      </div>
      <dl className="fade-in mt-14 grid grid-cols-2 border-t border-paper/15 sm:grid-cols-3 lg:mt-20 lg:grid-cols-5" style={at(lit + 2 * HEAD.beat)}>
        {spec.map((r) => (
          <div key={r.k} className="border-b border-paper/10 py-4 pr-4 sm:py-5 lg:border-b-0 lg:border-l lg:px-5 lg:first:border-l-0 lg:first:pl-0">
            <dt className="text-[13px] leading-[1.3] text-fog">{r.k}</dt>
            <dd className="mt-2 text-[16px] leading-[1.35] text-paper">{r.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function BriefLayout({ rail, children }: { rail: ReactNode; children: ReactNode }) {
  return (
    <div className={`${CONTAINER} pb-16 lg:pb-24`}>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div className="hidden lg:col-span-3 lg:block">{rail}</div>
        <div className="min-w-0 lg:col-span-8 lg:col-start-5">{children}</div>
      </div>
    </div>
  );
}

export function BriefSection({ id, title, lead, children }: { id: string; title: string; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="border-t border-paper/12 py-14 first:border-t-0 first:pt-2 lg:py-20 lg:first:pt-4">
      <TypeReveal id={`${id}-heading`} className="type-title text-[clamp(1.625rem,1.35rem+1vw,2.25rem)] leading-[1.15]" lines={[title]} />
      {lead && <p className="mt-5 max-w-[56ch] text-[19px] leading-[1.5] text-paper lg:text-[20px]">{lead}</p>}
      {children && <div className="mt-8">{children}</div>}
    </section>
  );
}

/** Body text in the brief's measure */
export function Prose({ children }: { children: ReactNode }) {
  return <div className="max-w-[64ch] text-[17px] leading-[1.65] text-fog [&_p+p]:mt-4 [&_strong]:font-medium [&_strong]:text-paper">{children}</div>;
}

/** A plain table in the brief: a header row, then rows on hairlines */
export function BriefTable({
  head,
  rows,
  caption,
}: {
  head: readonly string[];
  rows: readonly (readonly ReactNode[])[];
  caption: string;
}) {
  return (
    <>
      {/* On a phone each row stacks: its first cell, then the others as labelled lines */}
      <ul aria-label={caption} className="border-t border-paper/20 sm:hidden">
        {rows.map((r, i) => (
          <li key={i} className="border-b border-paper/10 py-4">
            <p className="text-[16px] leading-[1.4] text-paper">{r[0]}</p>
            <dl className="mt-1.5 space-y-1 text-[15px] leading-[1.5]">
              {r.slice(1).map((c, j) => (
                <div key={j}>
                  <dt className="inline text-paper/60">{head[j + 1]}: </dt>
                  <dd className="inline text-fog">{c}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      <table className="hidden w-full border-collapse text-left sm:table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-paper/20">
            {head.map((h) => (
              <th key={h} scope="col" className="pb-3 pr-6 text-[13px] font-normal text-fog last:pr-0">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-paper/10 align-baseline">
              {r.map((c, j) =>
                j === 0 ? (
                  <th key={j} scope="row" className="py-4 pr-6 text-[16px] font-normal leading-[1.4] text-paper">
                    {c}
                  </th>
                ) : (
                  <td key={j} className="py-4 pr-6 text-[15px] leading-[1.5] text-fog last:pr-0">
                    {c}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/** Published numbers in the brief: the figure, what it measured, its source */
export function BriefStats({ items }: { items: readonly Stat[] }) {
  return (
    <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
      {items.map((n) => (
        <figure key={n.figure + n.source} className="m-0 border-t border-paper/15 pt-5">
          <p className="type-title text-[clamp(2.25rem,1.9rem+1.4vw,3rem)] leading-none tabular-nums">{n.figure}</p>
          <p className="mt-3 max-w-[38ch] text-[15px] leading-[1.5] text-paper">{n.text}</p>
          <figcaption className="mt-2 text-[13px] leading-[1.45] text-fog">
            <a href={n.url} className="underline decoration-paper/30 underline-offset-[3px] transition-colors hover:text-paper hover:decoration-paper">
              {n.source}
            </a>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
