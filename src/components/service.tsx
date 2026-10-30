import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { Signature } from "@/components/signatures";
import { CONTAINER, GRID } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import type { Measure, Stat } from "@/lib/brief";
import { PACE, plotEnd, type RevealLine } from "@/lib/plot";

/*
  The engagement and discipline pages' parts. Each page opens on its own
  drawing (signatures.tsx) beside its title, and every part after it
  carries its point in a form the eye takes in before the words: big
  numbers, numbered steps, a flow, a calendar, a rail into the one number.
  Words support them, a sentence or two at a time.

  - ServiceHead: the h1 (plotted on load), its line and standfirst, the
    actions, the page's signature beside them; then four facts set large.
  - CaseBand: the red room: the case in one line, why it matters, and the
    published numbers behind it, set large.
  - Part: a graphite chapter with its h2 and one line beside it.
  - Steps, Ladder: how the work works, as numbered steps or Reach's rules
    as a rising ladder.
  - LayerFlow: the four layers as one line with four stops, and the loop.
  - ShipCalendar: what ships, as marks across the thirteen weeks of a
    quarter. DeliverableGrid: what a discipline hands over.
  - MeasureRail: the measures, each feeding the one number.
  - SitsFlow: what a discipline runs on, what it is, what it feeds.
*/

const at = (ms: number): CSSProperties => ({ animationDelay: `${Math.round(ms)}ms` });
const HEAD = { delay: 160, beat: 100 } as const;

export function ServiceHead({
  lines,
  line,
  standfirst,
  sig,
  facts,
  children,
  id = "page-heading",
}: {
  lines: readonly RevealLine[];
  line: ReactNode;
  standfirst: ReactNode;
  /** The page's signature drawing (signatures.tsx) */
  sig: string;
  /** Four facts, each a value set large and what it is */
  facts: readonly { value: ReactNode; label: ReactNode }[];
  children?: ReactNode;
  id?: string;
}) {
  const lit = plotEnd(lines, PACE.hero, HEAD.delay) + HEAD.beat;
  return (
    <div className={`${CONTAINER} pb-16 pt-32 sm:pt-36 lg:pb-20 lg:pt-40`}>
      <div className={`${GRID} gap-y-12 lg:items-center`}>
        <div className="col-span-4 sm:col-span-6 lg:col-span-6">
          <TypeReveal
            as="h1"
            id={id}
            onLoad
            delay={HEAD.delay}
            className="type-display text-[clamp(2.75rem,1.4rem+4.2vw,5.25rem)] leading-[0.98] [--display-tracking:-0.044em] [--display-weight:360]"
            lines={lines}
          />
          <div className="fade-in" style={at(lit)}>
            <p className="type-title mt-6 text-[clamp(1.375rem,1.2rem+0.8vw,1.875rem)] leading-[1.25] text-paper">{line}</p>
            <div className="mt-4 max-w-[46ch] text-[17px] leading-[1.55] text-fog lg:text-[18px]">{standfirst}</div>
          </div>
          {children && (
            <div className="fade-in mt-8 flex flex-wrap gap-2" style={at(lit + HEAD.beat)}>
              {children}
            </div>
          )}
        </div>
        <div className="col-span-4 sm:col-span-6 lg:col-span-6">
          <Signature k={sig} delay={lit} />
        </div>
      </div>
      <dl className="fade-in mt-14 grid grid-cols-2 gap-x-6 border-t border-paper/15 lg:mt-20 lg:grid-cols-4" style={at(lit + 2 * HEAD.beat)}>
        {facts.map((f, i) => (
          <div key={i} className="flex flex-col-reverse justify-end border-b border-paper/10 py-5 lg:border-b-0 lg:py-6">
            <dt className="mt-2 text-[14px] leading-[1.4] text-fog">{f.label}</dt>
            <dd className="type-title text-[clamp(1.625rem,1.3rem+1.2vw,2.375rem)] leading-none tabular-nums text-paper">{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function CaseBand({ id, lines, body, stats }: { id: string; lines: readonly RevealLine[]; body: ReactNode; stats: readonly Stat[] }) {
  return (
    <section aria-labelledby={id} className="bg-brand text-paper">
      <div className={`${CONTAINER} py-20 lg:py-28`}>
        <div className={`${GRID} gap-y-12`}>
          <div className="col-span-4 sm:col-span-6 lg:col-span-7">
            <TypeReveal id={id} className="type-display text-[clamp(2.25rem,1.5rem+3vw,4.25rem)] leading-[1.02]" lines={lines} />
            <Reveal>
              <p className="mt-8 max-w-[50ch] text-[17px] leading-[1.6] lg:text-[18px]">{body}</p>
            </Reveal>
          </div>
          {stats.length > 0 && (
            <Reveal className="col-span-4 grid content-start gap-10 sm:col-span-6 lg:col-span-4 lg:col-start-9">
              {stats.map((s) => (
                <figure key={s.figure + s.source} className="m-0 border-t border-paper/40 pt-5">
                  <p className="type-display text-[clamp(3rem,2.2rem+2.6vw,4.5rem)] leading-none tabular-nums">{s.figure}</p>
                  <p className="mt-3 max-w-[36ch] text-[15px] leading-[1.5]">{s.text}</p>
                  <figcaption className="mt-2 text-[13px] leading-[1.45]">
                    <a href={s.url} className="underline decoration-paper/50 underline-offset-[3px] transition-colors hover:decoration-paper">
                      {s.source}
                    </a>
                  </figcaption>
                </figure>
              ))}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

export function Part({ id, title, lead, children }: { id: string; title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-paper/10 bg-graphite text-paper first:border-t-0">
      <div className={`${CONTAINER} py-20 lg:py-28`}>
        <div className={`${GRID} gap-y-5 lg:items-end`}>
          <TypeReveal id={id} className="type-display col-span-4 text-[clamp(2rem,1.5rem+2vw,3.25rem)] leading-[1.02] sm:col-span-6 lg:col-span-7" lines={[title]} />
          {lead && (
            <Reveal className="col-span-4 sm:col-span-5 lg:col-span-4 lg:col-start-9 lg:pb-1">
              <p className="max-w-[40ch] text-[16px] leading-[1.55] text-fog">{lead}</p>
            </Reveal>
          )}
        </div>
        <div className="mt-12 lg:mt-16">{children}</div>
      </div>
    </section>
  );
}

/** How the work works, as numbered steps */
export function Steps({ items }: { items: readonly { title: string; text: string }[] }) {
  return (
    <Reveal>
      <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s, i) => (
          <li key={s.title} className="border-t border-paper/20 pt-5">
            <p className="type-display text-[52px] leading-none tabular-nums text-signal">{i + 1}</p>
            <p className="mt-6 text-[18px] font-medium leading-[1.3]">{s.title}</p>
            <p className="mt-2 text-[15px] leading-[1.55] text-fog">{s.text}</p>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

/** Reach's rules as a ladder: each threshold a step higher, what happens under it */
export function Ladder({ rules }: { rules: readonly { when: string; then: string }[] }) {
  const parts = rules.map((r) => {
    const big = r.when.match(/^(Under 1×|1× to 2×|\d+×)/)?.[0] ?? r.when;
    const rest = r.when.slice(big.length).replace(/^ or more/, "").replace(/^[,\s]+/, "");
    return { big, rest, then: r.then };
  });
  return (
    <Reveal>
      <ol className="grid gap-y-6 lg:grid-cols-5 lg:items-end lg:gap-x-6" aria-label="The rules a cut runs on, from retired to the whole system behind it">
        {parts.map((p, i) => {
          const live = i >= 2;
          return (
            <li key={p.big} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-5 lg:block">
              <div className="lg:flex lg:h-56 lg:flex-col lg:justify-end">
                <p className={`type-title text-[26px] leading-none tabular-nums lg:text-[30px] ${live ? "text-signal" : "text-paper"}`}>{p.big}</p>
                <span
                  aria-hidden
                  className={`mt-3 hidden w-full border-t-2 lg:block ${live ? "border-signal bg-signal/15" : i ? "border-paper/50 bg-paper/[0.06]" : "border-paper/25 bg-paper/[0.03]"}`}
                  style={{ height: `${28 + i * 34}px` }}
                />
              </div>
              <div className="lg:mt-4 lg:border-t lg:border-paper/20 lg:pt-4">
                {p.rest && <p className="text-[13px] leading-[1.4] text-fog">{p.rest}</p>}
                <p className="mt-1 text-[15px] leading-[1.5]">{p.then}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Reveal>
  );
}

/** The four layers as one line with four stops, and the loop back from the Ledger */
export function LayerFlow({ items, loop }: { items: readonly { name: string; builds: string; text: string; links: readonly { name: string; href: string }[] }[]; loop: string }) {
  return (
    <Reveal>
      <ol className="grid gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-0">
        {items.map((L, i) => (
          <li key={L.name} className="relative border-t border-paper/60 pt-6 lg:pr-8">
            <span aria-hidden className={`absolute -top-[5px] left-0 size-[9px] ${i === items.length - 1 ? "bg-signal" : "bg-paper"}`} />
            <p className="type-title text-[24px] leading-none">{L.name}</p>
            <p className="mt-2 text-[13px] text-fog">Builds {L.builds}</p>
            <p className="mt-5 max-w-[34ch] text-[16px] leading-[1.5]">{L.text}</p>
            {L.links.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {L.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex h-8 items-center border border-paper/25 px-2.5 text-[13px] transition-colors hover:border-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-10 flex items-center gap-3 text-[14px] text-fog">
        <svg aria-hidden width="40" height="10" viewBox="0 0 40 10" className="shrink-0 text-signal">
          <path d="M39 5H2M6 1L2 5L6 9" stroke="currentColor" strokeWidth="1.25" fill="none" />
        </svg>
        {loop}
      </p>
    </Reveal>
  );
}

const WEEKS = 13;
/** Which weeks of a quarter a cadence ships in: filled, a hollow mark, or a run */
function marks(when: string): { fill: number[]; hollow: number[]; run?: [number, number]; thin?: [number, number] } {
  const w = when.toLowerCase();
  const all = Array.from({ length: WEEKS }, (_, i) => i + 1);
  if (w.startsWith("weekly")) return { fill: all, hollow: [] };
  if (w.startsWith("monthly")) return { fill: [4, 8, 13], hollow: [] };
  if (w.startsWith("each quarter")) return { fill: [1], hollow: [] };
  if (w.startsWith("first month")) return { fill: [1, 2, 3, 4], hollow: [] };
  if (w.startsWith("daily") || w.startsWith("always")) return { fill: [], hollow: [], run: [1, WEEKS] };
  if (w.startsWith("each push")) return { fill: [], hollow: [3, 7, 11] };
  if (w.startsWith("once")) return { fill: [1], hollow: [], thin: [2, WEEKS] };
  return { fill: [], hollow: [] };
}

/** What ships, as marks across the thirteen weeks of a quarter */
export function ShipCalendar({ items, caption }: { items: readonly { item: string; when: string; layer: string; hot?: boolean }[]; caption: string }) {
  const cell = (w: number) => `${((w - 1) / WEEKS) * 100}%`;
  return (
    <Reveal>
      <div role="table" aria-label={caption}>
        <div role="row" className="hidden border-b border-paper/20 pb-3 text-[13px] text-fog lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-10">
          <span role="columnheader">What ships</span>
          <span role="columnheader" className="relative">
            <span className="sr-only">When, across a quarter</span>
            {[1, 4, 8, 13].map((w) => (
              <span key={w} aria-hidden className="absolute tabular-nums" style={{ left: cell(w) }}>
                {w === 1 ? "Week 1" : w}
              </span>
            ))}
          </span>
        </div>
        {items.map((it) => {
          const m = marks(it.when);
          const tone = it.hot ? "bg-signal" : "bg-paper/80";
          return (
            <div key={it.item} role="row" className="grid gap-y-3 border-b border-paper/10 py-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-x-10">
              <div role="cell">
                <p className="text-[16px] leading-[1.4]">{it.item}</p>
                <p className="mt-1 text-[13px] text-fog">
                  {it.when} · {it.layer}
                </p>
              </div>
              <div role="cell" aria-hidden className="relative h-4">
                {Array.from({ length: WEEKS }, (_, i) => (
                  <span key={i} className="absolute top-1/2 h-px w-[calc(100%/13-4px)] -translate-y-1/2 bg-paper/10" style={{ left: cell(i + 1) }} />
                ))}
                {m.thin && <span className="absolute top-1/2 h-px -translate-y-1/2 bg-paper/50" style={{ left: cell(m.thin[0]), width: `calc(${((m.thin[1] - m.thin[0] + 1) / WEEKS) * 100}% - 4px)` }} />}
                {m.run && <span className={`absolute top-1/2 h-[3px] -translate-y-1/2 ${tone}`} style={{ left: cell(m.run[0]), width: `calc(${((m.run[1] - m.run[0] + 1) / WEEKS) * 100}% - 4px)` }} />}
                {m.fill.map((w) => (
                  <span key={w} className={`absolute inset-y-0 w-[calc(100%/13-4px)] max-w-4 ${tone}`} style={{ left: cell(w) }} />
                ))}
                {m.hollow.map((w) => (
                  <span key={w} className="absolute inset-y-0 w-[calc(100%/13-4px)] max-w-4 border border-paper/70" style={{ left: cell(w) }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-[13px] leading-[1.5] text-fog">{caption}</p>
    </Reveal>
  );
}

/** What a discipline hands over, numbered */
export function DeliverableGrid({ items }: { items: readonly string[] }) {
  return (
    <Reveal>
      <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((d, i) => (
          <li key={d} className="flex gap-4 border-t border-paper/15 py-6">
            <span aria-hidden className="type-title w-6 shrink-0 text-[22px] leading-[1.15] tabular-nums text-signal">
              {i + 1}
            </span>
            <p className="type-title text-[19px] leading-[1.3]">{d}</p>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

/** The measures, each feeding the one number */
export function MeasureRail({ items, number }: { items: readonly Measure[]; number: string }) {
  return (
    <Reveal>
      <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]" style={{ "--n": items.length } as CSSProperties}>
        {items.map((m) => (
          <li key={m.name} className="relative border-t border-paper/25 pt-5 lg:pb-12">
            <p className="text-[17px] leading-[1.3]">{m.name}</p>
            <p className="mt-2 text-[14px] leading-[1.5] text-fog">{m.what}</p>
            <p className="mt-4 inline-flex h-7 items-center border border-paper/20 px-2 text-[13px] text-fog">Read {m.when.toLowerCase()}</p>
            <span aria-hidden className="absolute bottom-0 left-0 hidden h-8 w-px bg-paper/25 lg:block" />
          </li>
        ))}
      </ul>
      <div className="relative mt-8 flex items-center gap-4 lg:mt-0">
        <span aria-hidden className="hidden h-px flex-1 bg-paper/25 lg:block" />
        <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" className="hidden shrink-0 text-paper/50 lg:block">
          <path d="M1 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.25" fill="none" />
        </svg>
        <p className="flex items-center gap-3 border-l-2 border-signal pl-4 lg:max-w-[38ch]">
          <span className="text-[16px] leading-[1.45]">
            <span className="text-signal">The one number.</span> <span className="text-fog">{number}</span>
          </span>
        </p>
      </div>
    </Reveal>
  );
}

/** What a discipline runs on, what it is, and what it feeds */
export function SitsFlow({
  layer,
  name,
  runsOn,
  feeds,
  rows,
}: {
  layer: string;
  name: string;
  runsOn: ReactNode;
  feeds: ReactNode;
  rows: readonly { k: string; links: readonly { name: string; href: string }[]; empty?: string }[];
}) {
  const arrow = (
    <svg aria-hidden width="28" height="14" viewBox="0 0 28 14" className="hidden shrink-0 self-center text-paper/50 lg:block">
      <path d="M1 7H26M22 3L26 7L22 11" stroke="currentColor" strokeWidth="1.25" fill="none" />
    </svg>
  );
  return (
    <Reveal>
      <div className="grid gap-y-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-x-5">
        <div className="border-t border-paper/25 pt-5">
          <p className="text-[13px] text-fog">Runs on</p>
          <p className="mt-2 text-[16px] leading-[1.5]">{runsOn}</p>
        </div>
        {arrow}
        <div className="border-t-2 border-signal pt-5">
          <p className="text-[13px] text-signal">{layer}</p>
          <p className="type-title mt-2 text-[clamp(1.5rem,1.3rem+0.8vw,2rem)] leading-[1.1]">{name}</p>
        </div>
        {arrow}
        <div className="border-t border-paper/25 pt-5">
          <p className="text-[13px] text-fog">Feeds</p>
          <p className="mt-2 text-[16px] leading-[1.5]">{feeds}</p>
        </div>
      </div>
      <dl className="mt-12 grid gap-y-6 sm:grid-cols-2 sm:gap-x-8">
        {rows.map((r) => (
          <div key={r.k}>
            <dt className="text-[13px] text-fog">{r.k}</dt>
            <dd className="mt-3 flex flex-wrap gap-2">
              {r.links.length
                ? r.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="group inline-flex h-9 items-center gap-1.5 border border-paper/25 px-3 text-[14px] transition-colors hover:border-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
                    >
                      {l.name}
                      <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  ))
                : <span className="text-[15px] text-fog">{r.empty}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
