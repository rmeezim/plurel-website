"use client";

import { useMemo, useRef, useState } from "react";
import { Console, useSim } from "@/components/console/console";
import { Figure } from "@/components/console/parts";
import { normal, rng } from "@/lib/sim";

/*
  UGC & Creators: the hook test. One brief, ten hooks, three creators
  each: thirty videos posted together. Views come in over three days;
  each video is read on how many people are still watching at three
  seconds, with an interval that narrows as the views grow. At 48 hours
  the leaders get paid behind them; at 72 the winning hooks are reshot by
  the creators who carried them, and the rest are retired. Point at a
  video to read it. Illustrative model, not a client's results.
*/

const HOOKS = [
  "The price nobody shows",
  "Before and after, one take",
  "What I wish I’d known",
  "Unboxing, no talking",
  "The founder answers a comment",
  "A day with it",
  "Three things it can’t do",
  "Asked a stranger to try it",
  "The cheaper one, side by side",
  "Why it costs what it costs",
];
const CREATORS = ["Creator A", "Creator B", "Creator C"];
const HOURS = 72;

type Cell = { hook: number; creator: number; p: number; views: (h: number) => number };

function cells(): Cell[] {
  const r = rng(80297);
  const hookEffect = HOOKS.map(() => normal(r) * 0.07);
  const creatorEffect = CREATORS.map(() => normal(r) * 0.04);
  const out: Cell[] = [];
  HOOKS.forEach((_, h) =>
    CREATORS.forEach((_, c) => {
      const p = Math.min(0.78, Math.max(0.12, 0.38 + hookEffect[h] + creatorEffect[c] + normal(r) * 0.035));
      const reach = 900 + r() * 5200;
      const speed = 8 + r() * 14;
      out.push({ hook: h, creator: c, p, views: (hr: number) => Math.round(reach * (1 - Math.exp(-hr / speed))) });
    }),
  );
  return out;
}

// what the read shows at an hour: the share held, drawn from the views so far
function read(c: Cell, hr: number, seed: number) {
  const n = c.views(hr);
  if (n < 30) return null;
  const r = rng(seed * 131 + Math.floor(hr));
  const se = Math.sqrt((c.p * (1 - c.p)) / n);
  const est = Math.min(0.95, Math.max(0.02, c.p + normal(r) * se * 0.8));
  return { n, est, ci: 1.96 * se };
}

const pct = (x: number) => `${Math.round(x * 100)}%`;

export function HookTestConsole() {
  const frame = useRef<HTMLElement>(null);
  const all = useMemo(() => cells(), []);
  const sim = useSim(frame, { end: HOURS, rate: 5, by: 6 });
  const [hot, setHot] = useState<number | null>(null);
  const hr = sim.t;
  const reads = all.map((c, i) => read(c, hr, i + 1));
  const ranked = reads
    .map((x, i) => ({ i, est: x?.est ?? 0 }))
    .sort((a, b) => b.est - a.est)
    .map((x) => x.i);
  const paid = hr >= 48 ? new Set(ranked.slice(0, 4)) : new Set<number>();
  const hookAvg = HOOKS.map((_, h) => {
    const xs = reads.filter((x, i) => x && all[i].hook === h).map((x) => x!.est);
    return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
  });
  const hookRank = hookAvg.map((v, h) => ({ v, h })).sort((a, b) => b.v - a.v);
  const winners = hr >= HOURS ? new Set(hookRank.slice(0, 2).map((x) => x.h)) : new Set<number>();
  const views = reads.reduce((s, x) => s + (x?.n ?? 0), 0);
  const hc = hot != null ? all[hot] : null;
  const hx = hot != null ? reads[hot] : null;
  const shade = (est: number) => Math.min(1, Math.max(0, (est - 0.2) / 0.4));

  return (
    <Console
      sim={sim}
      frameRef={frame}
      title="The hook test"
      clock={`Hour ${String(Math.floor(hr)).padStart(2, "0")} of ${HOURS}`}
      label="A simulated three-day test of thirty creator videos, ten hooks by three creators: each read on how many viewers are still watching at three seconds, with paid behind the leaders at 48 hours and the two winning hooks reshot at 72."
      stepLabel="Step six hours"
      readout={
        hr >= HOURS
          ? `Hour 72: “${HOOKS[hookRank[0].h]}” and “${HOOKS[hookRank[1].h]}” hold best. They are reshot by the creators who carried them, with paid behind them; the other eight are retired, and what they taught goes into the next brief.`
          : hr >= 48
            ? `Hour ${Math.floor(hr)}: paid goes behind the four videos holding best. The intervals are still narrowing; nothing is decided on a hunch.`
            : `Hour ${Math.floor(hr)}: ${views.toLocaleString("en-US")} views so far. Early reads are wide; each narrows as the views grow.`
      }
      note="Illustrative model and numbers, not a client’s results. Hooks, creators and rights are set in the brief before anyone films."
    >
      <div className="grid lg:grid-cols-12">
        <div className="overflow-x-auto border-b border-paper/12 p-3 sm:p-4 lg:col-span-8 lg:border-b-0 lg:border-r">
          <table className="w-full min-w-[520px] border-separate border-spacing-[3px] text-left">
            <caption className="sr-only">Share still watching at three seconds, by hook and creator</caption>
            <thead>
              <tr className="text-[13px] text-fog">
                <th scope="col" className="pb-1 font-normal">Hook</th>
                {CREATORS.map((c) => (
                  <th key={c} scope="col" className="w-[17%] pb-1 font-normal">
                    {c}
                  </th>
                ))}
                <th scope="col" className="w-[12%] pb-1 text-right font-normal">Hook</th>
              </tr>
            </thead>
            <tbody>
              {HOOKS.map((name, h) => (
                <tr key={name}>
                  <th scope="row" className={`pr-2 text-[13px] font-normal leading-[1.25] ${winners.has(h) ? "text-signal" : "text-paper"}`}>
                    {name}
                  </th>
                  {CREATORS.map((_, c) => {
                    const i = h * CREATORS.length + c;
                    const x = reads[i];
                    return (
                      <td key={c} className="p-0">
                        <button
                          type="button"
                          onPointerEnter={() => setHot(i)}
                          onPointerLeave={() => setHot((v) => (v === i ? null : v))}
                          onFocus={() => setHot(i)}
                          onBlur={() => setHot((v) => (v === i ? null : v))}
                          aria-label={`${name}, ${CREATORS[c]}: ${x ? `${pct(x.est)} still watching` : "no read yet"}`}
                          className={`relative flex h-[34px] w-full items-center justify-between gap-2 border px-2 font-mono text-[13px] tabular-nums transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-paper ${
                            paid.has(i) ? "border-signal" : "border-paper/10"
                          } ${hot === i ? "outline outline-1 outline-paper" : ""}`}
                          style={{ background: x ? `color-mix(in srgb, var(--color-paper) ${Math.round(4 + shade(x.est) * 30)}%, transparent)` : undefined }}
                        >
                          <span className={x ? "text-paper" : "text-fog"}>{x ? pct(x.est) : "–"}</span>
                          {x && (
                            <span aria-hidden className="h-[3px] bg-paper/60" style={{ width: `${Math.min(40, x.ci * 400)}px` }} />
                          )}
                        </button>
                      </td>
                    );
                  })}
                  <td className={`text-right font-mono text-[13px] tabular-nums ${winners.has(h) ? "text-signal" : "text-fog"}`}>
                    {hookAvg[h] ? pct(hookAvg[h]) : "–"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col lg:col-span-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 border-b border-paper/12 px-3 py-4 sm:px-4">
            <Figure label="Views so far" value={views.toLocaleString("en-US")} />
            <Figure label="Paid behind" value={hr >= 48 ? "4 videos" : "None yet"} tone={hr >= 48 ? "signal" : "fog"} />
          </div>
          <div className="min-h-[150px] px-3 py-3 sm:px-4">
            {hc && hx ? (
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[14px] leading-[1.35]">
                <dt className="text-fog">Hook</dt>
                <dd>{HOOKS[hc.hook]}</dd>
                <dt className="text-fog">Creator</dt>
                <dd>{CREATORS[hc.creator]}</dd>
                <dt className="text-fog">Views</dt>
                <dd className="font-mono text-[13px]">{hx.n.toLocaleString("en-US")}</dd>
                <dt className="text-fog">At 3 s</dt>
                <dd className="font-mono text-[13px]">
                  {pct(hx.est)} still watching, ± {Math.max(1, Math.round(hx.ci * 100))} points
                </dd>
                <dt className="text-fog">State</dt>
                <dd>{winners.has(hc.hook) ? "Reshot, with paid behind it" : paid.has(hot!) ? "Paid behind it" : hr >= HOURS ? "Retired" : "Running"}</dd>
              </dl>
            ) : (
              <p className="max-w-[34ch] text-[14px] leading-[1.45] text-fog">
                Point at a video to read it. The bar in each cell is its interval: wide on few views, narrow on many.
              </p>
            )}
          </div>
          <div className="mt-auto border-t border-paper/12 px-3 py-3 text-[13px] text-fog sm:px-4">
            <p className="flex items-center gap-2">
              <span aria-hidden className="size-[9px] border border-signal" /> Paid behind it, from hour 48
            </p>
            <p className="mt-1.5 flex items-center gap-2">
              <span aria-hidden className="h-[3px] w-4 bg-paper/60" /> The read’s interval, narrowing
            </p>
          </div>
        </div>
      </div>
    </Console>
  );
}
