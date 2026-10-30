"use client";

import { useMemo, useRef, useState } from "react";
import { Console, useBox, useSim } from "@/components/console/console";
import { Chip, Controls, Figure } from "@/components/console/parts";
import { normal, rng } from "@/lib/sim";

/*
  Paid Media: one budget, moved every week. Five surfaces share it; each
  returns less for each extra dollar (diminishing returns) and less again
  as its ads wear out, faster on some surfaces than others. The rule
  reads each surface's cost for the next order and moves a slice of the
  budget from the dearest to the cheapest, every week. Freeze the split
  instead and the cost per order drifts up. The bands are each
  surface's share of the budget; the line under them is what each order
  cost, moved against frozen. Point at a band to read it. Illustrative
  model, not a client's results.
*/

const SURFACES = [
  { name: "Search", base: 40, k: 9000, wear: 0.012 },
  { name: "Social", base: 42, k: 7000, wear: 0.075 },
  { name: "Video", base: 50, k: 8000, wear: 0.06 },
  { name: "Creators", base: 45, k: 5000, wear: 0.085 },
  { name: "Retail media", base: 43, k: 6000, wear: 0.02 },
] as const;
const WEEKS = 13;
const BUDGET = 40000;
const TONES = [0.9, 0.62, 0.42, 0.28, 0.16];

type Week = { share: number[]; marginal: number[]; cpo: number; orders: number };

function simulate(moving: boolean): Week[] {
  const r = rng(13001);
  let share = [0.24, 0.26, 0.2, 0.15, 0.15];
  const out: Week[] = [];
  for (let w = 0; w < WEEKS; w++) {
    // ads wear out as the weeks go on; budget kept on a worn surface buys less
    const fatigue = SURFACES.map((s) => 1 + s.wear * w * 1.6);
    const spend = share.map((x) => x * BUDGET);
    const avg = SURFACES.map((s, i) => s.base * fatigue[i] * Math.pow(1 + spend[i] / s.k, 0.45) * (1 + normal(r) * 0.03));
    const marginal = avg.map((a, i) => a * (1 + (0.45 * spend[i]) / (SURFACES[i].k + spend[i])));
    const orders = spend.reduce((sum, x, i) => sum + x / avg[i], 0);
    out.push({ share: share.slice(), marginal, cpo: BUDGET / orders, orders });
    if (moving) {
      const hi = marginal.indexOf(Math.max(...marginal));
      const lo = marginal.indexOf(Math.min(...marginal));
      const move = Math.min(0.06, share[hi] - 0.05);
      if (hi !== lo && move > 0 && marginal[hi] > marginal[lo] * 1.06) {
        share = share.slice();
        share[hi] -= move;
        share[lo] += move;
      }
    }
  }
  return out;
}

const money = (x: number) => `$${Math.round(x).toLocaleString("en-US")}`;

export function AllocationConsole() {
  const frame = useRef<HTMLElement>(null);
  const plot = useRef<HTMLDivElement>(null);
  const box = useBox(plot);
  const moved = useMemo(() => simulate(true), []);
  const frozen = useMemo(() => simulate(false), []);
  const [mode, setMode] = useState<"moved" | "frozen">("moved");
  const sim = useSim(frame, { end: WEEKS - 1, rate: 0.9, by: 1 });
  const [hot, setHot] = useState<number | null>(null);
  const run = mode === "moved" ? moved : frozen;
  const t = sim.t;
  const w = Math.min(WEEKS - 1, Math.floor(t));

  const W = box.w || 900;
  const H = box.h || 300;
  const P = { l: 10, r: 10, t: 8, b: 92 };
  const ih = H - P.t - P.b;
  const X = (k: number) => P.l + (k / (WEEKS - 1)) * (W - P.l - P.r);
  // stacked bands, drawn up to the clock (the last week eased in)
  const upto = Math.min(WEEKS - 1, t);
  const pts = (k: number) => {
    const a = Math.floor(k);
    const b = Math.min(WEEKS - 1, a + 1);
    const f = k - a;
    return run[a].share.map((s, i) => s + (run[b].share[i] - s) * f);
  };
  const steps: number[] = [];
  for (let k = 0; k <= upto + 1e-9; k += 0.25) steps.push(Math.min(upto, k));
  if (steps[steps.length - 1] !== upto) steps.push(upto);
  const bands = SURFACES.map((_, i) => {
    const top: string[] = [];
    const bottom: string[] = [];
    for (const k of steps) {
      const sh = pts(k);
      const below = sh.slice(0, i).reduce((a, b) => a + b, 0);
      top.push(`${X(k).toFixed(1)},${(P.t + (1 - (below + sh[i])) * ih).toFixed(1)}`);
      bottom.push(`${X(k).toFixed(1)},${(P.t + (1 - below) * ih).toFixed(1)}`);
    }
    return `M${top.join("L")}L${bottom.reverse().join("L")}Z`;
  });
  // cost per order, both ways, under the bands
  const cpoTop = H - P.b + 22;
  const cpoH = P.b - 34;
  const all = [...moved, ...frozen].map((x) => x.cpo);
  const lo = Math.min(...all) * 0.97;
  const hi = Math.max(...all) * 1.03;
  const CY = (v: number) => cpoTop + (1 - (v - lo) / (hi - lo)) * cpoH;
  const cpoPath = (xs: Week[]) => xs.slice(0, w + 1).map((x, k) => `${k ? "L" : "M"}${X(k).toFixed(1)} ${CY(x.cpo).toFixed(1)}`).join("");
  const now = run[w];
  const best = now.marginal.indexOf(Math.min(...now.marginal));

  return (
    <Console
      sim={sim}
      frameRef={frame}
      title="One budget, moved weekly"
      clock={`Week ${String(w + 1).padStart(2, "0")} of ${WEEKS}`}
      label="A simulated quarter of one paid budget across five surfaces: each week the rule moves a slice of the budget from the surface where the next order costs most to where it costs least; frozen, the cost per order drifts up as ads wear out."
      stepLabel="Step one week"
      readout={
        mode === "moved"
          ? `Week ${w + 1}: an order costs ${money(now.cpo)}, against ${money(frozen[w].cpo)} with the split frozen. ${SURFACES[best].name} is where the next order is cheapest, so it gets more next week.`
          : `Week ${w + 1}, split frozen: an order costs ${money(now.cpo)}. The ads wear out and nothing moves toward what still works.`
      }
      note="Illustrative model, not a client’s results. Real allocation reads each surface against the one number in the Ledger, and keeps a floor for the brand work that pays later."
    >
      <Controls>
        <div role="group" aria-label="How the budget moves" className="flex gap-1.5">
          <Chip on={mode === "moved"} onClick={() => setMode("moved")}>
            Moved weekly
          </Chip>
          <Chip on={mode === "frozen"} onClick={() => setMode("frozen")}>
            Split frozen
          </Chip>
        </div>
        <p className="text-[13px] text-fog sm:ml-auto">{money(BUDGET)} a week, across five surfaces</p>
      </Controls>
      <div className="grid lg:grid-cols-12">
        <div ref={plot} className="relative h-[360px] border-b border-paper/12 lg:col-span-9 lg:h-[400px] lg:border-b-0 lg:border-r">
          <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" fill="none">
            {bands.map((d, i) => (
              <path
                key={i}
                d={d}
                fill={i === best ? "var(--color-signal)" : "var(--color-paper)"}
                fillOpacity={i === best ? 0.55 : TONES[i] * (hot == null || hot === i ? 0.42 : 0.12)}
                stroke="var(--color-graphite)"
                strokeWidth={1}
                style={{ pointerEvents: "all", cursor: "crosshair" }}
                onPointerEnter={() => setHot(i)}
                onPointerLeave={() => setHot((h) => (h === i ? null : h))}
              />
            ))}
            <line x1={P.l} x2={W - P.r} y1={cpoTop + cpoH + 6} y2={cpoTop + cpoH + 6} stroke="var(--color-paper)" strokeOpacity={0.15} />
            <path d={cpoPath(frozen)} stroke="var(--color-paper)" strokeOpacity={0.5} strokeWidth={1} strokeDasharray="3 3" />
            <path d={cpoPath(moved)} stroke="var(--color-signal)" strokeWidth={1.75} />
          </svg>
          {(() => {
            const sh = run[w].share;
            return SURFACES.map((s, i) => {
              const mid = sh.slice(0, i).reduce((a, b) => a + b, 0) + sh[i] / 2;
              return sh[i] > 0.06 ? (
                <span
                  key={s.name}
                  aria-hidden
                  className={`pointer-events-none absolute -translate-y-1/2 text-[13px] leading-none ${i === best ? "text-paper" : "text-paper/90"}`}
                  style={{ top: P.t + (1 - mid) * ih, left: Math.min(X(Math.min(upto, WEEKS - 1)), W - 120) - 110 }}
                >
                  {s.name} <span className="font-mono">{Math.round(sh[i] * 100)}%</span>
                </span>
              ) : null;
            });
          })()}
          <span aria-hidden className="absolute left-3 text-[13px] leading-none text-fog" style={{ top: cpoTop - 18 }}>
            Cost per order: <span className="text-signal">moved</span>, against frozen
          </span>
        </div>
        <div className="flex flex-col lg:col-span-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 border-b border-paper/12 px-3 py-4 sm:px-4 lg:grid-cols-1">
            <Figure label="Cost per order, moved" value={money(moved[w].cpo)} tone="signal" />
            <Figure label="Cost per order, frozen" value={money(frozen[w].cpo)} tone="fog" />
          </div>
          <ul className="px-3 py-3 sm:px-4">
            <li className="mb-1 grid grid-cols-[1fr_auto_auto] gap-x-3 text-[13px] text-fog">
              <span>Surface</span>
              <span>Share</span>
              <span>Next order</span>
            </li>
            {SURFACES.map((s, i) => (
              <li
                key={s.name}
                onPointerEnter={() => setHot(i)}
                onPointerLeave={() => setHot((h) => (h === i ? null : h))}
                className={`grid grid-cols-[1fr_auto_auto] gap-x-3 border-t border-paper/10 py-1.5 text-[14px] transition-opacity ${hot != null && hot !== i ? "opacity-40" : ""}`}
              >
                <span className={i === best ? "text-signal" : ""}>{s.name}</span>
                <span className="font-mono text-[13px] tabular-nums">{Math.round(now.share[i] * 100)}%</span>
                <span className="w-[52px] text-right font-mono text-[13px] tabular-nums text-fog">{money(now.marginal[i])}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Console>
  );
}
