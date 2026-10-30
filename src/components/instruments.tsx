import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { GRID } from "@/components/system";

/*
  Shared parts of the discipline, engagement and company pages, set as
  instruments rather than paragraphs: the measures a page answers to, a
  run of steps on a hairline, and the System's four layers as rows.
*/

export type Measure = { name: string; what: string; when: string };

/** A published number, quoted within its source's own scope */
export type Stat = { figure: string; text: string; source: string; url: string };

/**
 * Published numbers that make a page's case: the figure set large, what
 * it measured, and its source (publisher, title, year), linked.
 */
export function Numbers({ items }: { items: readonly Stat[] }) {
  return (
    <Reveal className={`${GRID} mt-14 gap-y-10 lg:mt-20`}>
      {items.map((n) => (
        <figure key={n.figure + n.source} className="col-span-4 m-0 border-t border-paper/15 pt-6 sm:col-span-3 lg:col-span-4">
          <p className="type-display figures text-[clamp(3rem,2.2rem+3vw,5rem)] leading-none [--display-weight:340]">{n.figure}</p>
          <p className="mt-4 max-w-[36ch] text-[16px] leading-[1.5]">{n.text}</p>
          <figcaption className="mt-3 max-w-[40ch] text-[13px] leading-[1.45] text-fog">
            <a href={n.url} className="underline decoration-paper/30 underline-offset-[3px] transition-colors hover:text-paper hover:decoration-paper">
              {n.source}
            </a>
          </figcaption>
        </figure>
      ))}
    </Reveal>
  );
}

/**
 * The measures a page answers to: each a 2px rule, its name, what it is,
 * and how often it is read. Four across from lg.
 */
export function Measures({ items, tone = "dark" }: { items: readonly Measure[]; tone?: "dark" | "red" }) {
  const red = tone === "red";
  return (
    <Reveal className={`${GRID} mt-12 gap-y-10 lg:mt-16`}>
      {items.map((m) => (
        <div key={m.name} className={`col-span-4 border-t-2 pt-5 sm:col-span-3 lg:col-span-3 ${red ? "border-paper" : "border-paper/80"}`}>
          <h3 className="type-title text-[clamp(1.375rem,1.15rem+0.8vw,1.75rem)] leading-[1.15]">{m.name}</h3>
          <p className={`mt-3 max-w-[34ch] text-[16px] leading-[1.5] ${red ? "" : "text-fog"}`}>{m.what}</p>
          <p className="mt-4 flex items-center gap-2 text-[14px] font-medium">
            <span aria-hidden className={`size-[6px] ${red ? "bg-paper" : "bg-signal"}`} />
            Read {m.when.toLowerCase()}
          </p>
        </div>
      ))}
    </Reveal>
  );
}

/**
 * Steps on a hairline: down the left on a phone, across from lg, a node
 * at each and the last one lit. `head` is the step's name or its time.
 */
export function Steps({ items }: { items: readonly { head: string; line: string }[] }) {
  return (
    <Reveal className="mt-14 lg:mt-20">
      <ol className={`${GRID} gap-y-0`}>
        {items.map((st, i) => (
          <li
            key={st.head}
            className="relative col-span-4 border-l border-paper/20 pb-10 pl-7 last:pb-0 sm:col-span-6 lg:col-span-3 lg:border-l-0 lg:border-t lg:pb-0 lg:pl-0 lg:pt-8"
          >
            <span
              aria-hidden
              className={`absolute -left-[4px] top-1.5 size-[7px] lg:-top-[4px] lg:left-0 ${i === items.length - 1 ? "bg-signal" : "bg-paper"}`}
            />
            <h3 className="type-title text-[20px] leading-[1.2] lg:text-[22px]">{st.head}</h3>
            <p className="mt-2.5 max-w-[32ch] text-[15px] leading-[1.5] text-fog lg:text-[16px]">{st.line}</p>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

export type LayerRow = {
  key: string;
  name: string;
  line: ReactNode;
  links: readonly { name: string; href: string; current?: boolean }[];
};

/**
 * The System's four layers as rows, top to bottom: the layer, what it does
 * here, and the services that do it.
 */
export function LayerRows({ rows, label }: { rows: readonly LayerRow[]; label: string }) {
  return (
    <Reveal className="mt-12 lg:mt-16">
      <ol aria-label={label} className="border-b border-paper/15">
        {rows.map((r, i) => (
          <li key={r.key} className={`${GRID} relative items-baseline gap-y-3 border-t border-paper/15 py-6 lg:py-7`}>
            <p className="col-span-4 flex items-baseline gap-3 sm:col-span-2 lg:col-span-3">
              <span aria-hidden className={`size-[7px] shrink-0 -translate-y-[3px] ${i === rows.length - 1 ? "bg-signal" : "bg-paper"}`} />
              <span className="type-title text-[clamp(1.375rem,1.1rem+0.9vw,1.75rem)] leading-none">{r.name}</span>
            </p>
            <p className="col-span-4 max-w-[52ch] text-[17px] leading-[1.5] sm:col-span-4 lg:col-span-5 lg:text-[18px]">{r.line}</p>
            <ul className="col-span-4 flex flex-wrap gap-x-5 gap-y-1.5 sm:col-span-4 sm:col-start-3 lg:col-span-4 lg:col-start-9 lg:justify-end">
              {r.links.map((l) => (
                <li key={l.href}>
                  {l.current ? (
                    <span className="text-[15px] font-medium underline decoration-signal underline-offset-[6px]">{l.name}</span>
                  ) : (
                    <Link href={l.href} className="group inline-flex items-center gap-1.5 text-[15px] text-fog transition-colors hover:text-paper">
                      {l.name}
                      <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}
