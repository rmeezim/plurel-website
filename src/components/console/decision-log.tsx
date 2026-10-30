"use client";

import { useMemo, useRef, useState } from "react";
import { Console, useBox, useSim } from "@/components/console/console";
import { Figure } from "@/components/console/parts";
import { normal, rng } from "@/lib/sim";

/*
  Fractional CMO: the plan, the number and the decisions between them.
  Two quarters, week by week: the plan sets the number, the line under
  it is what happened, and every decision the CMO makes is logged with
  what it did. Untick a decision to see the number without it; the faint
  line is the number with none of them. Illustrative decisions and
  numbers, not a client's.
*/

const WEEKS = 26;
type Decision = { week: number; what: string; lift: number; ramp: number; dip?: number };
const DECISIONS: Decision[] = [
  { week: 3, what: "Ended the retainer that wasn’t moving the number; its budget went to search", lift: 18, ramp: 2 },
  { week: 6, what: "Reshot the winning hook in-house; paused two creator contracts", lift: 12, ramp: 2 },
  { week: 9, what: "Fixed checkout: guest checkout, and the price on the page", lift: 36, ramp: 1 },
  { week: 13, what: "Quarter reset from the Ledger: new brief, retail media dropped", lift: 20, ramp: 3 },
  { week: 16, what: "Hired a content lead and handed over the newsletter", lift: 9, ramp: 5 },
  { week: 19, what: "Moved 15% of paid into brand work for the second half", lift: 26, ramp: 6, dip: -8 },
  { week: 23, what: "Board page: asked for more search budget for the season, and got it", lift: 30, ramp: 1 },
];

function line(taken: boolean[]) {
  const r = rng(26061);
  const out: number[] = [];
  for (let w = 0; w <= WEEKS; w++) {
    let v = 384 - w * 1.1 + normal(r) * 7;
    DECISIONS.forEach((d, i) => {
      if (!taken[i] || w <= d.week) return;
      const k = Math.min(1, (w - d.week) / d.ramp);
      v += d.lift * k + (d.dip ? d.dip * Math.max(0, 1 - (w - d.week) / 4) : 0);
    });
    out.push(v);
  }
  return out;
}

const plan = (w: number) => 400 + (160 * w) / WEEKS;

export function DecisionLogConsole() {
  const frame = useRef<HTMLElement>(null);
  const plot = useRef<HTMLDivElement>(null);
  const box = useBox(plot);
  const sim = useSim(frame, { end: WEEKS, rate: 1.3, by: 1 });
  const [taken, setTaken] = useState<boolean[]>(DECISIONS.map(() => true));
  const [hot, setHot] = useState<number | null>(null);
  const actual = useMemo(() => line(taken), [taken]);
  const none = useMemo(() => line(DECISIONS.map(() => false)), []);
  const without = useMemo(() => (hot != null ? line(taken.map((v, i) => (i === hot ? false : v))) : null), [hot, taken]);
  const w = Math.min(WEEKS, Math.floor(sim.t));

  const W = box.w || 800;
  const H = box.h || 300;
  const P = { l: 46, r: 12, t: 12, b: 26 };
  const lo = 340;
  const hi = 600;
  const X = (k: number) => P.l + (k / WEEKS) * (W - P.l - P.r);
  const Y = (v: number) => P.t + (1 - (v - lo) / (hi - lo)) * (H - P.t - P.b);
  const path = (xs: number[], upto = w) => xs.slice(0, upto + 1).map((v, k) => `${k ? "L" : "M"}${X(k).toFixed(1)} ${Y(v).toFixed(1)}`).join("");
  const gap = actual[w] / plan(w) - 1;
  const logged = DECISIONS.filter((d) => d.week <= w);

  let band = "";
  if (without && hot != null) {
    const from = DECISIONS[hot].week;
    const top = actual.slice(from, w + 1).map((v, k) => `${X(from + k).toFixed(1)},${Y(v).toFixed(1)}`);
    const bot = without.slice(from, w + 1).map((v, k) => `${X(from + k).toFixed(1)},${Y(v).toFixed(1)}`);
    if (top.length > 1) band = `M${top.join("L")}L${bot.reverse().join("L")}Z`;
  }

  return (
    <Console
      sim={sim}
      frameRef={frame}
      title="The plan and the number"
      clock={`Week ${String(w).padStart(2, "0")} of ${WEEKS}`}
      label="A simulated half year: the plan for the one number, what happened week by week, and each decision the fractional CMO made, logged with what it did. Untick a decision to see the number without it."
      stepLabel="Step one week"
      readout={`Week ${w}: ${Math.round(actual[w])} orders a week, ${gap >= 0 ? `${Math.round(gap * 100)}% over` : `${Math.round(-gap * 100)}% under`} the plan. ${logged.length} decisions logged; without any of them the number would be ${Math.round(none[w])}.`}
      note="Illustrative decisions and numbers, not a client’s. Each real decision is logged in the Ledger with what it moved, and read with you every month."
    >
      <div className="grid lg:grid-cols-12">
        <div className="border-b border-paper/12 lg:col-span-7 lg:border-b-0 lg:border-r">
          <div className="grid grid-cols-3 gap-x-4 border-b border-paper/12 px-3 py-3 sm:px-4">
            <Figure label="Orders this week" value={Math.round(actual[w])} />
            <Figure label="Against plan" value={`${gap >= 0 ? "+" : "−"}${Math.abs(Math.round(gap * 100))}%`} tone={gap >= 0 ? "signal" : "paper"} />
            <Figure label="With no decisions" value={Math.round(none[w])} tone="fog" />
          </div>
          <div ref={plot} className="relative h-[300px] lg:h-[340px]">
            <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" fill="none">
              {[400, 500, 600].map((v) => (
                <line key={v} x1={P.l} x2={W - P.r} y1={Y(v)} y2={Y(v)} stroke="var(--color-paper)" strokeOpacity={0.08} />
              ))}
              {[0, 13, 26].map((k) => (
                <line key={k} x1={X(k)} x2={X(k)} y1={H - P.b} y2={H - P.b + 5} stroke="var(--color-paper)" strokeOpacity={0.35} />
              ))}
              <line x1={X(13)} x2={X(13)} y1={P.t} y2={H - P.b} stroke="var(--color-paper)" strokeOpacity={0.12} />
              <path d={`M${X(0)} ${Y(plan(0))}L${X(WEEKS)} ${Y(plan(WEEKS))}`} stroke="var(--color-paper)" strokeOpacity={0.4} strokeDasharray="4 4" />
              {band && <path d={band} fill="var(--color-signal)" fillOpacity={0.22} />}
              <path d={path(none)} stroke="var(--color-paper)" strokeOpacity={0.25} />
              <path d={path(actual)} stroke="var(--color-paper)" strokeWidth={1.75} />
              {logged.map((d) => {
                const i = DECISIONS.indexOf(d);
                return (
                  <rect
                    key={d.week}
                    x={X(d.week) - 4}
                    y={Y(actual[d.week]) - 4}
                    width={8}
                    height={8}
                    fill={taken[i] ? "var(--color-signal)" : "var(--color-graphite)"}
                    stroke="var(--color-signal)"
                    opacity={hot != null && hot !== i ? 0.35 : 1}
                  />
                );
              })}
            </svg>
            {[400, 500, 600].map((v) => (
              <span key={v} aria-hidden className="absolute left-2 -translate-y-1/2 font-mono text-[13px] leading-none text-fog sm:left-3" style={{ top: Y(v) }}>
                {v}
              </span>
            ))}
            {[
              [0, "Week 0"],
              [13, "Quarter reset"],
              [26, "Week 26"],
            ].map(([k, label]) => (
              <span
                key={k as number}
                aria-hidden
                className={`absolute bottom-0 h-[22px] whitespace-nowrap font-mono text-[13px] leading-[22px] text-fog ${k === 26 ? "-translate-x-full" : k ? "-translate-x-1/2" : ""}`}
                style={{ left: X(k as number) }}
              >
                {label}
              </span>
            ))}
            <span aria-hidden className="absolute right-3 text-[13px] leading-none text-fog" style={{ top: Y(plan(WEEKS)) - 20 }}>
              The plan
            </span>
          </div>
        </div>
        <div className="lg:col-span-5">
          <p className="px-3 pt-3 text-[13px] text-fog sm:px-4">The decision log</p>
          <ol className="px-3 pb-3 pt-1 sm:px-4">
            {DECISIONS.map((d, i) => {
              const shown = d.week <= w;
              return (
                <li
                  key={d.week}
                  onPointerEnter={() => shown && setHot(i)}
                  onPointerLeave={() => setHot((h) => (h === i ? null : h))}
                  className={`grid grid-cols-[52px_1fr_auto] items-start gap-x-3 border-b border-paper/10 py-2.5 transition-opacity duration-300 ${shown ? "" : "invisible"} ${
                    hot != null && hot !== i && shown ? "opacity-45" : ""
                  }`}
                >
                  <span className="font-mono text-[13px] leading-[1.4] text-fog">Wk {String(d.week).padStart(2, "0")}</span>
                  <span className={`text-[14px] leading-[1.4] ${taken[i] ? "text-paper" : "text-fog line-through decoration-paper/40"}`}>{d.what}</span>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] text-fog">
                    <input
                      type="checkbox"
                      checked={taken[i]}
                      disabled={!shown}
                      onChange={() => setTaken((t) => t.map((v, k) => (k === i ? !v : v)))}
                      onFocus={() => shown && setHot(i)}
                      onBlur={() => setHot((h) => (h === i ? null : h))}
                      className="size-4 accent-[var(--color-signal)]"
                    />
                    <span className="sr-only">Taken: {d.what}</span>
                    <span aria-hidden className="font-mono">+{d.lift}</span>
                  </label>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Console>
  );
}
