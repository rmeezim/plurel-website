"use client";

import { useMemo, useRef, useState } from "react";
import { Console, useBox, useSim } from "@/components/console/console";
import { Figure } from "@/components/console/parts";
import { rng } from "@/lib/sim";

/*
  Mindshare: who comes to mind. Four hundred buyers in a category, each
  with a memory of four brands that fades a little every week and lifts
  each time they meet a brand, more when the brand looks and sounds the
  same as last time. Each square is a buyer, lit by the brand that comes
  to mind first. From week 8 the system runs: the brand shows up steadily
  and the same way every time. Change how consistent and how present it
  is, and the year re-runs from week 8. The line under the grid keeps
  each brand's share of first mentions, and the brand's share of search,
  which follows it a few weeks behind. Illustrative model and numbers.
*/

const N = 400;
const WEEKS = 52;
const START = 8;
const BRANDS = ["You", "Brand A", "Brand B", "Brand C"] as const;
const FILL = ["var(--color-signal)", "var(--color-paper)", "color-mix(in srgb, var(--color-paper) 52%, transparent)", "color-mix(in srgb, var(--color-paper) 24%, transparent)"];

type RunOut = { first: Uint8Array[]; mem: Float32Array[]; share: number[][]; search: number[] };

function simulate(consistency: number, presence: number): RunOut {
  const r = rng(52093);
  const exp = [0.17, 0.34, 0.25, 0.22];
  const con = [0.35, 0.72, 0.6, 0.5];
  const m = new Float32Array(N * 4);
  const init = [0.3, 0.44, 0.36, 0.3];
  for (let i = 0; i < N; i++) for (let b = 0; b < 4; b++) m[i * 4 + b] = Math.max(0, init[b] + (r() - 0.5) * 0.5);
  const first: Uint8Array[] = [];
  const mem: Float32Array[] = [];
  const share: number[][] = [];
  const search: number[] = [];
  let ema = 0;
  for (let w = 0; w <= WEEKS; w++) {
    if (w > 0) {
      const e = w >= START ? [presence, ...exp.slice(1)] : exp;
      const c = w >= START ? [consistency, ...con.slice(1)] : con;
      for (let i = 0; i < N; i++)
        for (let b = 0; b < 4; b++) {
          let v = m[i * 4 + b] * 0.93;
          if (r() < e[b]) v += 0.26 * c[b] * (1 - v);
          m[i * 4 + b] = v;
        }
    }
    const f = new Uint8Array(N);
    const counts = [0, 0, 0, 0];
    for (let i = 0; i < N; i++) {
      let best = 0;
      let bv = -1;
      for (let b = 0; b < 4; b++) {
        const v = m[i * 4 + b] + (r() - 0.5) * 0.04;
        if (v > bv) {
          bv = v;
          best = b;
        }
      }
      f[i] = best;
      counts[best]++;
    }
    first.push(f);
    mem.push(m.slice());
    const s = counts.map((c) => c / N);
    share.push(s);
    ema = w === 0 ? s[0] : ema + 0.16 * (s[0] - ema);
    search.push(ema);
  }
  return { first, mem, share, search };
}

const pct = (x: number) => `${Math.round(x * 100)}%`;

export function MemoryConsole() {
  const frame = useRef<HTMLElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const box = useBox(chartRef);
  const [consistency, setConsistency] = useState(0.9);
  const [presence, setPresence] = useState(0.26);
  const run = useMemo(() => simulate(consistency, presence), [consistency, presence]);
  const sim = useSim(frame, { end: WEEKS, rate: 2.2, by: 1 });
  const [hot, setHot] = useState<number | null>(null);
  const w = Math.min(WEEKS, Math.floor(sim.t));
  const f = run.first[w];
  const s = run.share[w];
  const rank = [...s].sort((a, b) => b - a).indexOf(s[0]) + 1;

  // the share chart
  const W = box.w || 600;
  const H = box.h || 150;
  const P = { l: 34, r: 8, t: 8, b: 20 };
  const X = (k: number) => P.l + (k / WEEKS) * (W - P.l - P.r);
  const Y = (v: number) => P.t + (1 - v / 0.7) * (H - P.t - P.b);
  const line = (vals: number[]) => vals.slice(0, w + 1).map((v, k) => `${k ? "L" : "M"}${X(k).toFixed(1)} ${Y(v).toFixed(1)}`).join("");

  const mem = hot != null ? Array.from(run.mem[w].slice(hot * 4, hot * 4 + 4)) : null;
  const order = mem ? [0, 1, 2, 3].sort((a, b) => mem[b] - mem[a]) : null;

  return (
    <Console
      sim={sim}
      frameRef={frame}
      title="Who comes to mind"
      clock={`Week ${String(w).padStart(2, "0")} of ${WEEKS}`}
      label="A simulated year of four hundred buyers' memory of four brands. Each square is a buyer, lit by the brand that comes to mind first; from week 8 the system makes the brand steady and consistent, and its share of first mentions rises, with its share of search following behind."
      stepLabel="Step one week"
      readout={
        w < START
          ? `Week ${w}: you come to mind first for ${pct(s[0])} of buyers, ${["first", "second", "third", "fourth"][rank - 1]} of four. Between meetings, memory fades.`
          : `Week ${w}: ${pct(s[0])} of buyers think of you first, up from ${pct(run.share[START][0])} when the system started, ${["first", "second", "third", "fourth"][rank - 1]} of four. Share of search follows a few weeks behind.`
      }
      note="Illustrative model and numbers, not a client’s results. Memory fades a little each week and lifts with each meeting, more when the brand looks the same as last time."
    >
      <div className="grid lg:grid-cols-12">
        <div className="border-b border-paper/12 p-3 sm:p-4 lg:col-span-7 lg:border-b-0 lg:border-r">
          <div role="img" aria-label={`${pct(s[0])} of four hundred buyers think of you first in week ${w}`} className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-[3px]">
            {Array.from(f).map((b, i) => (
              <span
                key={i}
                onPointerEnter={() => setHot(i)}
                onPointerLeave={() => setHot((h) => (h === i ? null : h))}
                className={`aspect-square transition-colors duration-150 ${hot === i ? "outline outline-1 outline-offset-1 outline-paper" : ""}`}
                style={{ background: FILL[b] }}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {BRANDS.map((b, i) => (
              <span key={b} className="inline-flex items-center gap-1.5 text-[13px] text-fog">
                <span aria-hidden className="size-[9px]" style={{ background: FILL[i] }} />
                {b} <span className="font-mono tabular-nums text-paper">{pct(s[i])}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:col-span-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 border-b border-paper/12 px-3 py-4 sm:px-4">
            <Figure label="Think of you first" value={pct(s[0])} tone="signal" sub={`Week 8: ${pct(run.share[START][0])}`} />
            <Figure label="Your share of search" value={pct(run.search[w])} sub="Follows memory, behind it" />
          </div>
          <div className="border-b border-paper/12 px-3 py-4 sm:px-4">
            <Slider id="mem-con" label="Consistency" hint="How much of what ships looks and sounds the same" value={consistency} min={0.3} max={1} onChange={setConsistency} />
            <Slider id="mem-pre" label="Presence" hint="How often a buyer meets you in a week" value={presence} min={0.1} max={0.5} onChange={setPresence} />
          </div>
          <div className="min-h-[104px] px-3 py-3 sm:px-4">
            {mem && order ? (
              <>
                <p className="text-[13px] text-fog">Buyer {hot! + 1}: who comes to mind, in order</p>
                <ul className="mt-2 space-y-1.5">
                  {order.map((b) => (
                    <li key={b} className="grid grid-cols-[64px_1fr_40px] items-center gap-2 text-[13px]">
                      <span className={b === 0 ? "text-signal" : "text-paper"}>{BRANDS[b]}</span>
                      <span className="h-[4px] bg-paper/10">
                        <span className="block h-full" style={{ width: `${Math.min(100, mem[b] * 100)}%`, background: FILL[b] }} />
                      </span>
                      <span className="text-right font-mono tabular-nums text-fog">{mem[b].toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="max-w-[36ch] text-[14px] leading-[1.45] text-fog">Point at a buyer to read their memory of the four brands.</p>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-paper/12 px-3 pb-2 pt-3 sm:px-4">
        <p className="text-[13px] text-fog">Share of first mentions, week by week</p>
        <div ref={chartRef} className="relative mt-1 h-[150px]">
          <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" fill="none">
            {[0, 0.2, 0.4, 0.6].map((v) => (
              <line key={v} x1={P.l} x2={W - P.r} y1={Y(v)} y2={Y(v)} stroke="var(--color-paper)" strokeOpacity={v === 0 ? 0.25 : 0.08} />
            ))}
            <line x1={X(START)} x2={X(START)} y1={P.t} y2={H - P.b} stroke="var(--color-signal)" strokeOpacity={0.6} />
            {[3, 2, 1].map((b) => (
              <path key={b} d={line(run.share.map((x) => x[b]))} stroke={FILL[b]} strokeWidth={1.25} />
            ))}
            <path d={line(run.search)} stroke="var(--color-paper)" strokeOpacity={0.55} strokeWidth={1} strokeDasharray="2 3" />
            <path d={line(run.share.map((x) => x[0]))} stroke="var(--color-signal)" strokeWidth={2} />
          </svg>
          {[0, 0.2, 0.4].map((v) => (
            <span key={v} aria-hidden className="absolute left-0 -translate-y-1/2 font-mono text-[13px] leading-none text-fog" style={{ top: Y(v) }}>
              {pct(v)}
            </span>
          ))}
          <span aria-hidden className="absolute text-[13px] leading-none text-signal" style={{ left: X(START) + 6, top: Y(0) - 18 }}>
            The system starts
          </span>
        </div>
      </div>
    </Console>
  );
}

function Slider({ id, label, hint, value, min, max, onChange }: { id: string; label: string; hint: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[14px] text-paper">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-[13px] tabular-nums text-paper">
          {pct(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={0.02}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="console-range mt-2 w-full"
      />
      <p className="mt-1 text-[13px] leading-[1.35] text-fog">{hint}</p>
    </div>
  );
}
