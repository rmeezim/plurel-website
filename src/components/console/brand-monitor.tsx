"use client";

import { useMemo, useRef, useState } from "react";
import { Console, useBox, useSim } from "@/components/console/console";
import { Figure } from "@/components/console/parts";
import { rng } from "@/lib/sim";

/*
  Branding: the brand, checked as it ships. Each mark is one thing that
  went out (a page, an ad, a post, a pack, a slide), on its surface's
  lane, week by week. Each is checked against the brand system (type,
  colour, layout and voice): on brand, or off it and why. Before the
  system, every team improvises; from week 8 the Core Brief and the
  checks hold. The line under the lanes is recognition: of people shown
  a piece with the name covered, how many can say whose it is. It only
  climbs while what ships stays consistent. Point at a mark to read it.
  Illustrative model, not a client's results.
*/

const WEEKS = 26;
const START = 8;
const LANES = ["Website", "Paid ads", "Social", "Email", "Product and pack", "Sales deck", "Events"] as const;
/** Pieces shipped per week, by lane */
const RATE = [0.9, 0.95, 1.4, 0.6, 0.25, 0.3, 0.15];
const FAULTS = ["A different red", "The old logo", "Stock photography", "A borrowed typeface", "Off-voice copy", "A cramped layout", "The wrong product name"];

type Item = { lane: number; week: number; ok: boolean; fault: string | null; what: string };
const WHAT: Record<(typeof LANES)[number], string[]> = {
  Website: ["Landing page", "Product page", "Pricing page"],
  "Paid ads": ["Search ad", "Social ad", "Video ad"],
  Social: ["Post", "Carousel", "Short video"],
  Email: ["Newsletter", "Welcome email"],
  "Product and pack": ["Pack front", "Insert card"],
  "Sales deck": ["Pitch slide", "One-pager"],
  Events: ["Stand graphic", "Badge"],
};

function shipped(): Item[] {
  const r = rng(77711);
  const out: Item[] = [];
  for (let w = 0; w < WEEKS; w++)
    LANES.forEach((lane, li) => {
      const rate = RATE[li];
      const n = Math.floor(rate) + (r() < rate % 1 ? 1 : 0);
      for (let k = 0; k < n; k++) {
        const pOk = w < START ? 0.42 : Math.min(0.97, 0.78 + (w - START) * 0.02);
        const ok = r() < pOk;
        out.push({ lane: li, week: w + r() * 0.85, ok, fault: ok ? null : FAULTS[Math.floor(r() * FAULTS.length)], what: WHAT[lane][Math.floor(r() * WHAT[lane].length)] });
      }
    });
  return out.sort((a, b) => a.week - b.week);
}

export function BrandMonitorConsole() {
  const frame = useRef<HTMLElement>(null);
  const plot = useRef<HTMLDivElement>(null);
  const box = useBox(plot);
  const items = useMemo(() => shipped(), []);
  const sim = useSim(frame, { end: WEEKS, rate: 1.5, by: 1 });
  const [hot, setHot] = useState<number | null>(null);
  const t = sim.t;
  const shown = items.filter((x) => x.week <= t);

  // recognition climbs with the share on brand over the last six weeks
  const recog = useMemo(() => {
    const out: number[] = [];
    let v = 0.14;
    for (let w = 0; w <= WEEKS; w++) {
      const recent = items.filter((x) => x.week > w - 6 && x.week <= w);
      const share = recent.length ? recent.filter((x) => x.ok).length / recent.length : 0.4;
      v += (0.12 + 0.5 * Math.max(0, share - 0.45) - v) * 0.09;
      out.push(v);
    }
    return out;
  }, [items]);

  const W = box.w || 900;
  const laneH = 30;
  const top = 6;
  const L = 132;
  const R = 12;
  const X = (wk: number) => L + (wk / WEEKS) * (W - L - R);
  const chartTop = top + LANES.length * laneH + 22;
  const chartH = 90;
  const Y = (v: number) => chartTop + (1 - v / 0.5) * chartH;
  const H = chartTop + chartH + 26;
  const w = Math.min(WEEKS, Math.floor(t));
  const recent = shown.filter((x) => x.week > t - 4);
  const onBrand = recent.length ? recent.filter((x) => x.ok).length / recent.length : 0;
  const hi = hot != null ? shown[hot] : null;

  return (
    <Console
      sim={sim}
      frameRef={frame}
      title="On brand, as it ships"
      clock={`Week ${String(w).padStart(2, "0")} of ${WEEKS}`}
      label="A simulated half year of everything a company ships, lane by lane, each piece checked against the brand system; from week 8 the system holds, and recognition, how many people know whose a piece is with the name covered, climbs."
      stepLabel="Step one week"
      readout={
        w < START
          ? `Week ${w}: ${Math.round(onBrand * 100)}% of what shipped this month was on brand. Each team improvises, so each surface looks a little different.`
          : `Week ${w}: ${Math.round(onBrand * 100)}% on brand, every piece checked against the system before it ships. ${Math.round(recog[w] * 100)}% of people now know whose a piece is with the name covered.`
      }
      note="Illustrative model, not a client’s results. Recognition is read by showing a sample of buyers your work with the name covered, before and after."
    >
      <div className="grid grid-cols-3 gap-x-4 border-b border-paper/12 px-3 py-3 sm:px-4">
        <Figure label="On brand, last four weeks" value={`${Math.round(onBrand * 100)}%`} tone={onBrand > 0.8 ? "signal" : "paper"} />
        <Figure label="Recognised with the name covered" value={`${Math.round(recog[w] * 100)}%`} />
        <Figure label="Pieces checked" value={shown.length} tone="fog" />
      </div>
      <div ref={plot} className="relative overflow-hidden" style={{ height: H }}>
        <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" fill="none">
          {LANES.map((_, i) => (
            <line key={i} x1={L} x2={W - R} y1={top + (i + 1) * laneH} y2={top + (i + 1) * laneH} stroke="var(--color-paper)" strokeOpacity={0.07} />
          ))}
          <line x1={X(START)} x2={X(START)} y1={top} y2={H - 26} stroke="var(--color-signal)" strokeOpacity={0.55} />
          {t < WEEKS && <line x1={X(t)} x2={X(t)} y1={top} y2={H - 26} stroke="var(--color-paper)" strokeOpacity={0.2} />}
          {shown.map((x, i) => (
            <rect
              key={i}
              x={X(x.week) - 3}
              y={top + x.lane * laneH + laneH / 2 - 7}
              width={6}
              height={14}
              fill={x.ok ? "var(--color-paper)" : "var(--color-signal)"}
              fillOpacity={hot != null && hot !== i ? 0.25 : x.ok ? 0.8 : 1}
              style={{ pointerEvents: "all", cursor: "crosshair" }}
              onPointerEnter={() => setHot(i)}
              onPointerLeave={() => setHot((h) => (h === i ? null : h))}
            />
          ))}
          <line x1={L} x2={W - R} y1={Y(0)} y2={Y(0)} stroke="var(--color-paper)" strokeOpacity={0.2} />
          <path d={recog.slice(0, w + 1).map((v, k) => `${k ? "L" : "M"}${X(k).toFixed(1)} ${Y(v).toFixed(1)}`).join("")} stroke="var(--color-signal)" strokeWidth={1.75} />
        </svg>
        {LANES.map((l, i) => (
          <span key={l} aria-hidden className="absolute left-3 w-[118px] -translate-y-1/2 truncate text-[13px] leading-none text-fog sm:left-4" style={{ top: top + i * laneH + laneH / 2 }}>
            {l}
          </span>
        ))}
        <span aria-hidden className="absolute left-3 w-[118px] text-[13px] leading-[1.25] text-fog sm:left-4" style={{ top: chartTop }}>
          Recognised, name covered
        </span>
        <span aria-hidden className="absolute text-[13px] leading-none text-signal" style={{ left: X(START) + 6, top: top + 2 }}>
          The system holds
        </span>
        {[0, 13, 26].map((k) => (
          <span key={k} aria-hidden className={`absolute bottom-0 h-[22px] whitespace-nowrap font-mono text-[13px] leading-[22px] text-fog ${k === 26 ? "-translate-x-full" : k ? "-translate-x-1/2" : ""}`} style={{ left: X(k) }}>
            Week {k}
          </span>
        ))}
      </div>
      <p className="min-h-[46px] border-t border-paper/12 px-3 py-3 text-[14px] leading-[1.4] sm:px-4">
        {hi ? (
          <>
            <span className="text-fog">
              {LANES[hi.lane]}, week {Math.floor(hi.week)}:{" "}
            </span>
            {hi.what}, {hi.ok ? "on brand" : <span className="text-signal">off brand: {hi.fault!.toLowerCase()}</span>}
          </>
        ) : (
          <span className="text-fog">Point at a mark to read what shipped, and why it passed or didn’t.</span>
        )}
      </p>
    </Console>
  );
}
