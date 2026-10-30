"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Figure, Key, Notes, NumberMark, Toggle, line, partial, useDraw, useWidth } from "@/components/figures/kit";

/*
  The ten disciplines' figures, one point each (figures/kit.tsx has the
  rules). Website Design's is the only one that measures anything real:
  the page it sits on, in the reader's browser. The rest are labelled
  illustrations.
*/

const signal = "var(--color-signal)";
const paper = "var(--color-paper)";
const ILLUSTRATION = "An illustration with made-up numbers, not a client’s results.";

/* ------------------------------------------------------- Fractional CMO */

const DECISIONS = [
  { w: 3, lift: 22, ramp: 2, what: "Ended a retainer that wasn’t moving the number" },
  { w: 9, lift: 44, ramp: 1, what: "Fixed checkout" },
  { w: 13, lift: 30, ramp: 3, what: "Reset the quarter from the Ledger" },
  { w: 19, lift: 32, ramp: 6, what: "Moved budget into brand work" },
  { w: 23, lift: 38, ramp: 1, what: "More search budget for the season" },
];
const WEEKS = Array.from({ length: 27 }, (_, w) => w);
const none = (w: number) => 384 - 1.1 * w + Math.sin(w * 1.3) * 5 + Math.sin(w * 0.55 + 1) * 4;
const withAll = (w: number) => none(w) + DECISIONS.reduce((s, d) => s + (w > d.w ? d.lift * Math.min(1, (w - d.w) / d.ramp) : 0), 0);
const plan = (w: number) => 400 + (160 * w) / 26;

export function CmoFigure() {
  const box = useRef<HTMLDivElement>(null);
  const W = useWidth(box);
  const k = useDraw(box, 1800);
  const narrow = W < 600;
  const H = narrow ? 260 : 320;
  const P = { l: 40, r: narrow ? 12 : 96, t: 16, b: 28 };
  const X = (w: number) => P.l + (w / 26) * (W - P.l - P.r);
  const Y = (v: number) => P.t + (1 - (v - 330) / 250) * (H - P.t - P.b);
  const act = partial(WEEKS.map((w) => [X(w), Y(withAll(w))] as const), k);
  const nil = partial(WEEKS.map((w) => [X(w), Y(none(w))] as const), k);
  return (
    <Figure
      title="Every decision is logged with what it did to the number."
      sub="Two quarters of the one number, a week at a time: the plan, what happened, and what would have happened with no decisions."
      label="A chart over 26 weeks: the plan rising, the number with five logged decisions rising toward it, and the number with no decisions drifting down."
      note={ILLUSTRATION}
    >
      <div ref={box} className="relative" style={{ height: H }}>
        <svg aria-hidden width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 overflow-visible" fill="none">
          {[400, 500].map((v) => (
            <line key={v} x1={P.l} x2={W - P.r} y1={Y(v)} y2={Y(v)} stroke={paper} strokeOpacity={0.1} />
          ))}
          <line x1={P.l} x2={W - P.r} y1={H - P.b} y2={H - P.b} stroke={paper} strokeOpacity={0.3} />
          <path d={`M${X(0)} ${Y(plan(0))}L${X(26)} ${Y(plan(26))}`} stroke={paper} strokeOpacity={0.45} strokeDasharray="5 5" />
          <path d={line(nil)} stroke={paper} strokeOpacity={0.35} strokeWidth={1.5} />
          <path d={line(act)} stroke={signal} strokeWidth={2.25} />
        </svg>
        {[400, 500].map((v) => (
          <span key={v} aria-hidden className="absolute left-0 w-[32px] -translate-y-1/2 text-right text-[13px] leading-none text-fog" style={{ top: Y(v) }}>
            {v}
          </span>
        ))}
        {DECISIONS.map((d, i) => (k >= d.w / 26 ? <NumberMark key={d.w} n={i + 1} x={X(d.w)} y={Y(withAll(d.w))} /> : null))}
        {!narrow && k >= 1 && (
          <>
            <span aria-hidden className="absolute text-[14px] leading-none text-fog" style={{ left: W - P.r + 10, top: Y(plan(26)) - 7 }}>
              The plan
            </span>
            <span aria-hidden className="absolute text-[14px] leading-none text-signal" style={{ left: W - P.r + 10, top: Y(withAll(26)) - 7 }}>
              The number
            </span>
            <span aria-hidden className="absolute text-[14px] leading-[1.2] text-fog" style={{ left: W - P.r + 10, top: Y(none(26)) - 7 }}>
              No decisions
            </span>
          </>
        )}
        {[
          [0, "Week 0"],
          [13, "Week 13"],
          [26, "Week 26"],
        ].map(([w, t]) => (
          <span key={w as number} aria-hidden className={`absolute bottom-0 whitespace-nowrap text-[13px] leading-none text-fog ${w === 26 ? "-translate-x-full" : w ? "-translate-x-1/2" : ""}`} style={{ left: X(w as number) }}>
            {t}
          </span>
        ))}
      </div>
      {narrow && (
        <Key
          items={[
            { label: "The number", tone: "signal" },
            { label: "The plan", tone: "dashed" },
            { label: "No decisions", tone: "paper" },
          ]}
        />
      )}
      <Notes items={DECISIONS.map((d) => ({ when: `Week ${d.w}`, what: d.what }))} />
    </Figure>
  );
}

/* ------------------------------------------------------------- Branding */

const FAULTS = ["A different red", "The old logo", "Stock photography", "A borrowed typeface", "Copy off the voice", "A cramped layout"];
const BEFORE_OFF = new Set([1, 2, 4, 7, 8, 10, 13, 15, 16, 18, 20, 22, 23]);
const AFTER_OFF = new Set([17]);

export function BrandingFigure() {
  const box = useRef<HTMLDivElement>(null);
  const k = useDraw(box, 1600);
  const [hot, setHot] = useState<{ row: number; i: number } | null>(null);
  const rows = [
    { label: "Before: each team improvises", off: BEFORE_OFF, seen: "14%" },
    { label: "After: every piece checked against the system", off: AFTER_OFF, seen: "31%" },
  ];
  return (
    <Figure
      title="A brand is recognized when everything looks like it."
      sub="Twenty-four pieces shipped in a quarter, each checked against the brand system before and after it exists, and how many people know whose a piece is with the name covered."
      label="Two rows of twenty-four pieces: before the system, eleven are on brand; after it, twenty-three are, and recognition with the name covered goes from 14% to 31%."
      note={ILLUSTRATION}
    >
      <div ref={box} className="space-y-6">
        {rows.map((r, ri) => {
          const on = 24 - r.off.size;
          return (
            <div key={r.label}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="text-[15px] text-paper">{r.label}</p>
                <p className="text-[14px] tabular-nums text-fog">
                  {on} of 24 on brand · <span className="text-paper">{r.seen}</span> recognized
                </p>
              </div>
              <ol className="mt-3 grid grid-cols-12 gap-[5px] sm:grid-cols-24">
                {Array.from({ length: 24 }, (_, i) => {
                  const off = r.off.has(i);
                  const lit = k >= (ri * 24 + i + 1) / 48;
                  return (
                    <li
                      key={i}
                      onPointerEnter={() => setHot({ row: ri, i })}
                      onPointerLeave={() => setHot(null)}
                      className={`aspect-square transition-colors duration-300 ${!lit ? "bg-paper/[0.05]" : off ? "bg-signal" : "bg-paper/70"} ${
                        hot?.row === ri && hot.i === i ? "outline outline-1 outline-offset-2 outline-paper" : ""
                      }`}
                    />
                  );
                })}
              </ol>
            </div>
          );
        })}
        <p className="flex flex-wrap gap-x-5 gap-y-1 text-[14px] text-fog">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="size-[10px] bg-paper/70" /> On brand
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="size-[10px] bg-signal" /> Off brand
          </span>
        </p>
        <p className="min-h-[1.5em] text-[14px] text-fog">
          {hot
            ? rows[hot.row].off.has(hot.i)
              ? `Off brand: ${FAULTS[(hot.i + hot.row) % FAULTS.length].toLowerCase()}.`
              : "On brand: type, colour, layout and voice all from the system."
            : "Point at a piece to see why it passed, or didn’t."}
        </p>
      </div>
    </Figure>
  );
}

/* ------------------------------------------------------- Website Design */

type Read = { lcp: number; cls: number; ttfb: number };
const SCALES = [
  { key: "lcp", name: "Largest content shown", good: 2500, poor: 4000, ours: 1800, max: 5000, fmt: (v: number) => `${(v / 1000).toFixed(2)} s` },
  { key: "cls", name: "Layout shift", good: 0.1, poor: 0.25, ours: 0.05, max: 0.32, fmt: (v: number) => v.toFixed(3) },
  { key: "inp", name: "Response to a tap", good: 200, poor: 500, ours: 150, max: 640, fmt: (v: number) => `${Math.round(v)} ms` },
] as const;

export function VitalsFigure() {
  const box = useRef<HTMLUListElement>(null);
  const [read, setRead] = useState<Read | null>(null);
  const [inp, setInp] = useState<number | null>(null);
  const k = useDraw(box, 900, read ? 1 : 0);

  useEffect(() => {
    let lcp = 0;
    let cls = 0;
    const obs: PerformanceObserver[] = [];
    const watch = (type: string, cb: (l: PerformanceObserverEntryList) => void, extra: Record<string, unknown> = {}) => {
      try {
        const o = new PerformanceObserver(cb);
        o.observe({ type, buffered: true, ...extra } as PerformanceObserverInit);
        obs.push(o);
      } catch {
        // not measured in this browser
      }
    };
    watch("largest-contentful-paint", (l) => {
      const e = l.getEntries();
      if (e.length) lcp = e[e.length - 1].startTime;
    });
    watch("layout-shift", (l) => {
      for (const e of l.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) if (!e.hadRecentInput) cls += e.value;
    });
    watch(
      "event",
      (l) => {
        const xs = (l.getEntries() as (PerformanceEntry & { interactionId?: number })[]).filter((e) => e.interactionId);
        if (xs.length) setInp((v) => Math.max(v ?? 0, ...xs.map((e) => e.duration)));
      },
      { durationThreshold: 16 },
    );
    const id = window.setTimeout(() => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0;
      setRead({ lcp: lcp || fcp, cls, ttfb: nav?.responseStart ?? 0 });
    }, document.readyState === "complete" ? 300 : 1500);
    return () => {
      window.clearTimeout(id);
      obs.forEach((o) => o.disconnect());
    };
  }, []);

  const value = (key: string) => (key === "lcp" ? read?.lcp ?? null : key === "cls" ? read?.cls ?? null : inp);
  return (
    <Figure
      title="This page, measured in your browser just now."
      sub="Google’s three measures of how a page feels, each against Google’s line for good and our own stricter budget."
      label="Three live measurements of this page in your browser: how long its largest content took to show, how much its layout shifted, and how quickly it answered your last tap, each on a scale of good, needs work and poor."
      note="Measured on your device as you read; nothing is sent anywhere. A first visit on a slow network is slower than this one."
    >
      <ul ref={box} className="space-y-7">
        {SCALES.map((s) => {
          const v = value(s.key);
          const pos = (x: number) => `${(Math.min(x, s.max) / s.max) * 100}%`;
          return (
            <li key={s.key}>
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-[15px] text-paper">{s.name}</p>
                {v == null && s.key === "inp" ? (
                  <p className="text-[14px] text-fog">Tap anything to measure it</p>
                ) : (
                  <p className={`type-title text-[22px] leading-none tabular-nums ${v != null && v <= s.ours ? "text-signal" : "text-paper"}`}>{v == null ? "…" : s.fmt(v)}</p>
                )}
              </div>
              <div aria-hidden className="relative mt-3 h-[10px]">
                <span className="absolute inset-y-0 left-0 bg-paper/25" style={{ width: pos(s.good) }} />
                <span className="absolute inset-y-0 bg-paper/12" style={{ left: pos(s.good), width: `calc(${pos(s.poor)} - ${pos(s.good)})` }} />
                <span className="absolute inset-y-0 right-0 bg-paper/[0.05]" style={{ left: pos(s.poor) }} />
                <span className="absolute -inset-y-1 w-px bg-paper" style={{ left: pos(s.ours) }} />
                {v != null && (
                  // centred on the reading, kept inside the scale at either end
                  <span className="absolute -inset-y-1.5 w-[3px] bg-signal transition-[left] duration-700 ease-linear" style={{ left: `clamp(0px, calc(${pos(v)} * ${k} - 1.5px), calc(100% - 3px))` }} />
                )}
              </div>
              <div aria-hidden className="relative mt-2 h-4 text-[13px] leading-none text-fog">
                <span className="absolute left-0">Good</span>
                <span className="absolute" style={{ left: pos(s.good) }}>
                  Needs work
                </span>
                <span className="absolute" style={{ left: pos(s.poor) }}>
                  Poor
                </span>
              </div>
            </li>
          );
        })}
        <li className="flex items-center gap-2 text-[13px] text-fog">
          <span aria-hidden className="h-3 w-px bg-paper" /> Our budget, stricter than Google’s line
        </li>
      </ul>
    </Figure>
  );
}

/* ---------------------------------------------------- Content Marketing */

const LENGTH = 48;
const PIECES = [
  { from: 1.5, to: 6.5, piece: "A clip: the question everyone asks", where: "Short-form", week: 1 },
  { from: 4, to: 17, piece: "An article, 1,800 words", where: "Search and AI answers", week: 1 },
  { from: 15, to: 24, piece: "An answer page: why it costs what it costs", where: "Search and AI answers", week: 2 },
  { from: 19, to: 22, piece: "A carousel, seven frames", where: "Social", week: 2 },
  { from: 21, to: 34, piece: "The newsletter, the long version", where: "Your list", week: 2 },
  { from: 26, to: 28.5, piece: "A clip: what went wrong", where: "Short-form", week: 3 },
  { from: 29, to: 36, piece: "A guest piece for a trade title", where: "Partners and press", week: 3 },
  { from: 38, to: 46, piece: "An answer page: how to choose", where: "Search and AI answers", week: 4 },
];

export function ContentFigure() {
  const box = useRef<HTMLDivElement>(null);
  const k = useDraw(box, 1800);
  const [hot, setHot] = useState<number | null>(null);
  const at = (m: number) => `${(m / LENGTH) * 100}%`;
  return (
    <Figure
      title="One recorded conversation becomes a month of pieces."
      sub="A 48-minute conversation with the person who knows the subject best; each marked passage becomes a piece, placed in the four weeks after."
      label="A 48-minute recording with eight marked passages, each becoming a piece placed in one of four weeks: articles and answer pages, clips, a carousel, the newsletter and a guest piece."
      note="An illustrative edit. In a real month the conversation and the cuts come from the Core Brief and the questions buyers ask."
    >
      <div ref={box}>
        <div className="relative h-[52px]">
          {PIECES.map((p, i) => (
            <span
              key={p.piece}
              aria-hidden
              onPointerEnter={() => setHot(i)}
              onPointerLeave={() => setHot(null)}
              className={`absolute h-[14px] border-x border-t transition-opacity duration-300 ${hot === i ? "border-signal" : "border-paper/50"} ${
                k >= (i + 1) / (PIECES.length + 1) ? "opacity-100" : "opacity-0"
              }`}
              style={{ left: at(p.from), width: `calc(${at(p.to)} - ${at(p.from)})`, top: (i % 3) * 16 }}
            />
          ))}
        </div>
        <div aria-hidden className="relative h-[10px] bg-paper/[0.08]">
          <span className="absolute inset-y-0 left-0 bg-paper/35" style={{ width: `${k * 100}%` }} />
        </div>
        <div aria-hidden className="mt-2 flex justify-between text-[13px] text-fog">
          <span>0:00</span>
          <span>24:00</span>
          <span>48:00</span>
        </div>
        <ol className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6 lg:grid-cols-4">
          {[1, 2, 3, 4].map((w) => (
            <li key={w} className="border-t border-paper/15 pt-3">
              <p className="text-[13px] text-fog">Week {w}</p>
              <ul className="mt-2 space-y-3">
                {PIECES.map((p, i) =>
                  p.week === w ? (
                    <li
                      key={p.piece}
                      onPointerEnter={() => setHot(i)}
                      onPointerLeave={() => setHot(null)}
                      className={`transition-opacity duration-300 ${k >= (i + 1) / (PIECES.length + 1) ? "opacity-100" : "opacity-0"}`}
                    >
                      <p className={`text-[15px] leading-[1.35] ${hot === i ? "text-signal" : "text-paper"}`}>{p.piece}</p>
                      <p className="mt-0.5 text-[13px] text-fog">{p.where}</p>
                    </li>
                  ) : null,
                )}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </Figure>
  );
}

/* --------------------------------------------------------- Video & Photo */

export function VideoFigure() {
  const box = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"planned" | "wide">("planned");
  const W = useWidth(box);
  const k = useDraw(box, 1400, mode);
  const H = (W * 9) / 16;
  const v916 = { x0: 0.5 - (9 / 16) * (9 / 16) * 0.5, x1: 0.5 + (9 / 16) * (9 / 16) * 0.5 };
  const path = Array.from({ length: 41 }, (_, i) => {
    const t = i / 40;
    const x = mode === "planned" ? 0.5 + 0.1 * Math.sin(t * Math.PI * 1.6) : 0.13 + 0.74 * t;
    const y = 0.56 + 0.07 * Math.sin(t * Math.PI * 2.2);
    return [x, y] as const;
  });
  const pts = partial(path.map(([x, y]) => [x * W, y * H] as const), k);
  const outside = (x: number) => x < v916.x0 + 0.045 || x > v916.x1 - 0.045;
  const lost = mode === "wide";
  const crops = [
    { name: "9:16", w: (9 / 16) * (9 / 16) },
    { name: "1:1", w: 9 / 16 },
    { name: "4:5", w: (9 / 16) * 0.8 },
  ];
  return (
    <Figure
      title={lost ? "Shot only for the wide frame, the vertical cut loses the subject." : "Blocked for every crop, one take works on every surface."}
      sub="The widest frame of one take, the crops each surface needs inside it, and the path the subject moves along."
      control={
        <Toggle
          label="How the take was blocked"
          value={mode}
          onChange={setMode}
          options={[
            { key: "planned", label: "Blocked for every crop" },
            { key: "wide", label: "Shot for 16:9 only" },
          ]}
        />
      }
      label="A framing chart of one 16:9 take with the 4:5, 1:1 and 9:16 crops centred inside it and the subject's path: kept to the middle it stays inside every crop; crossing the frame it leaves the 9:16 crop."
      note="A drawn framing chart, not footage. The crops each surface needs come from the cut list, before the shoot."
    >
      {/* capped, so the frame stays a figure in the column and never a screen of its own */}
      <div ref={box} className="relative w-full max-w-[560px]" style={{ height: H }}>
        <svg aria-hidden width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0" fill="none">
          <rect x={0.5} y={0.5} width={W - 1} height={H - 1} stroke={paper} strokeOpacity={0.5} />
          {crops.map((c) => (
            <rect key={c.name} x={(0.5 - c.w / 2) * W + 0.5} y={0.5} width={c.w * W - 1} height={H - 1} stroke={paper} strokeOpacity={c.name === "9:16" ? 0.7 : 0.25} />
          ))}
          {pts.slice(1).map((p, i) => {
            const a = pts[i];
            const bad = lost && outside(a[0] / W);
            return <line key={i} x1={a[0]} y1={a[1]} x2={p[0]} y2={p[1]} stroke={bad ? signal : paper} strokeWidth={2} />;
          })}
          {k >= 1 && <rect x={pts[pts.length - 1][0] - 5} y={pts[pts.length - 1][1] - 5} width={10} height={10} fill={lost ? signal : paper} />}
        </svg>
        <span aria-hidden className="absolute right-2 top-2 text-[13px] text-fog">
          16:9
        </span>
        {crops.map((c, i) => (
          <span key={c.name} aria-hidden className="absolute text-[13px] text-fog" style={{ left: `calc(${(0.5 - c.w / 2) * 100}% + 6px)`, top: 8 + i * 18 }}>
            {c.name}
          </span>
        ))}
        {lost && k >= 1 && (
          <span aria-hidden className="absolute bottom-3 left-3 text-[14px] text-signal">
            Outside the 9:16 crop: a reshoot
          </span>
        )}
      </div>
    </Figure>
  );
}

/* ------------------------------------------------------- UGC & Creators */

const HOOKS = [
  ["The founder answers a comment", 52],
  ["Before and after, one take", 47],
  ["Asked a stranger to try it", 41],
  ["The price nobody shows", 39],
  ["What I wish I’d known", 37],
  ["Unboxing, no talking", 35],
  ["The cheaper one, side by side", 33],
  ["A day with it", 30],
  ["Why it costs what it costs", 27],
  ["Three things it can’t do", 24],
] as const;

export function UgcFigure() {
  const box = useRef<HTMLOListElement>(null);
  const k = useDraw(box, 1400);
  return (
    <Figure
      title="Test ten hooks before spending on one."
      sub="Ten hooks from one brief, each filmed by three creators: the share of viewers still watching at three seconds, after three days."
      label="Ten hooks ranked by the share of viewers still watching at three seconds, from 52% down to 24%; the top two are reshot with paid behind them and the rest are retired."
      note={`${ILLUSTRATION} Hooks, creators and usage rights are set in the brief before anyone films.`}
    >
      <ol ref={box} className="space-y-2.5">
        {HOOKS.map(([h, v], i) => {
          const win = i < 2;
          return (
            <li key={h} className="grid grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_2.5rem] items-center gap-x-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_2.75rem] sm:gap-x-4">
              <span className={`text-[15px] leading-[1.3] ${win ? "text-paper" : "text-fog"}`}>{h}</span>
              <span aria-hidden className="relative h-[12px]">
                <span className={`absolute inset-y-0 left-0 ${win ? "bg-signal" : "bg-paper/35"}`} style={{ width: `${(v / 60) * 100 * Math.min(1, Math.max(0, k * 1.4 - i * 0.04))}%` }} />
              </span>
              <span className={`text-right text-[15px] tabular-nums ${win ? "text-signal" : "text-paper"}`}>{v}%</span>
            </li>
          );
        })}
      </ol>
      <p className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-[14px]">
        <span className="inline-flex items-center gap-2 text-paper">
          <span aria-hidden className="h-[10px] w-4 bg-signal" /> Reshot, with paid behind them
        </span>
        <span className="inline-flex items-center gap-2 text-fog">
          <span aria-hidden className="h-[10px] w-4 bg-paper/35" /> Retired; what they taught goes into the next brief
        </span>
      </p>
    </Figure>
  );
}

/* ------------------------------------------------------ AI Search & SEO */

const ANSWERS = {
  today: {
    text: [
      ["For flat feet, most reviewers point to stability shoes with a firm midsole.", [1]],
      ["Brand A’s Guide line is the most recommended, and Brand B is a common pick for wider feet.", [1, 2]],
    ],
    sources: [
      ["A review site", "Best stability shoes, tested over 300 miles", false],
      ["A forum thread", "Flat feet runners: what finally worked?", false],
      ["Your site", "Product page, read but too thin to quote", true],
    ],
    named: false,
  },
  after: {
    text: [
      ["For flat feet, most reviewers point to stability shoes with a firm midsole.", [1]],
      ["Brand A’s Guide line is widely recommended, and Your brand’s Arc is a frequent pick for its measured arch support and wide fit.", [1, 2, 3]],
    ],
    sources: [
      ["A review site", "Best stability shoes, tested over 300 miles", false],
      ["Your site", "Stability shoes compared, with measured arch heights", true],
      ["Your site", "Which of our shoes suit flat feet?", true],
    ],
    named: true,
  },
} as const;

export function AeoFigure() {
  const box = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"today" | "after">("today");
  const k = useDraw(box, 900, mode);
  const a = ANSWERS[mode];
  return (
    <Figure
      title={a.named ? "Write pages worth quoting, and the answer names you." : "An assistant can only name you if its sources do."}
      sub="A buyer asks an AI assistant a question in your category. What it answers, and the sources it quotes."
      control={
        <Toggle
          label="When"
          value={mode}
          onChange={setMode}
          options={[
            { key: "today", label: "Today" },
            { key: "after", label: "After the work" },
          ]}
        />
      }
      label="A question to an AI assistant, its answer and the sources it quotes: today the brand is missing; after the work its own pages are quoted and it is named."
      note="A simulated answer with placeholder brands, not a client’s results; no assistant was queried. Which questions to track, and on which assistants, is set in the Diagnostic."
    >
      <div ref={box} className="grid gap-x-10 gap-y-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div>
          <p className="text-[14px] text-fog">“What’s a good running shoe for flat feet?”</p>
          <p className={`type-title mt-3 text-[clamp(1.125rem,1rem+0.4vw,1.3125rem)] leading-[1.45] transition-opacity duration-500 ${k > 0.3 ? "opacity-100" : "opacity-0"}`}>
            {a.text.map(([t, cites], i) => (
              <Fragment key={i}>
                {t.split("Your brand").map((part, j) => (
                  <Fragment key={j}>
                    {j > 0 && <span className="text-signal underline decoration-1 underline-offset-[5px]">Your brand</span>}
                    {part}
                  </Fragment>
                ))}
                <sup className="ml-0.5 text-[13px] text-fog">{cites.join(",")}</sup>{" "}
              </Fragment>
            ))}
          </p>
        </div>
        <ol className="space-y-3 self-start">
          {a.sources.map(([kind, title, yours], i) => (
            <li key={title} className={`grid grid-cols-[1.25rem_1fr] gap-x-2 border-b border-paper/10 pb-3 transition-opacity duration-500 ${k > (i + 1) / 4 ? "opacity-100" : "opacity-0"}`}>
              <span className="text-[13px] tabular-nums text-fog">{i + 1}</span>
              <span>
                <span className={`block text-[13px] ${yours ? "text-signal" : "text-fog"}`}>{kind}</span>
                <span className="block text-[15px] leading-[1.35] text-paper">{title}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Figure>
  );
}

/* ----------------------------------------------------------- Paid Media */

const FROZEN = [62, 66, 72, 74, 79, 81, 87, 90, 95, 96, 101, 102, 108];
const MOVED = [62, 65, 71, 71, 75, 77, 80, 82, 86, 85, 90, 89, 94];

export function PaidFigure() {
  const box = useRef<HTMLDivElement>(null);
  const W = useWidth(box);
  const k = useDraw(box, 1600);
  const narrow = W < 560;
  const H = narrow ? 250 : 300;
  const P = { l: 44, r: narrow ? 50 : 150, t: 14, b: 28 };
  const X = (w: number) => P.l + (w / 12) * (W - P.l - P.r);
  const Y = (v: number) => P.t + (1 - (v - 50) / 70) * (H - P.t - P.b);
  const f = partial(FROZEN.map((v, w) => [X(w), Y(v)] as const), k);
  const m = partial(MOVED.map((v, w) => [X(w), Y(v)] as const), k);
  return (
    <Figure
      title="Move the budget every week, and each order stays cheaper."
      sub="What an order costs over a quarter, with the split across surfaces frozen, and moved each week toward where the next order costs least."
      label="Two lines over thirteen weeks: cost per order rises from $62 to $108 with the split frozen, and to $94 when the budget is moved weekly."
      note={`${ILLUSTRATION} Ads wear out over the weeks, faster on some surfaces than others; a floor stays on brand work that pays later.`}
    >
      <div ref={box} className="relative" style={{ height: H }}>
        <svg aria-hidden width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 overflow-visible" fill="none">
          {[60, 80, 100].map((v) => (
            <line key={v} x1={P.l} x2={W - P.r} y1={Y(v)} y2={Y(v)} stroke={paper} strokeOpacity={0.1} />
          ))}
          <line x1={P.l} x2={W - P.r} y1={H - P.b} y2={H - P.b} stroke={paper} strokeOpacity={0.3} />
          <path d={line(f)} stroke={paper} strokeOpacity={0.55} strokeWidth={1.75} />
          <path d={line(m)} stroke={signal} strokeWidth={2.25} />
        </svg>
        {[60, 80, 100].map((v) => (
          <span key={v} aria-hidden className="absolute left-0 w-[36px] -translate-y-1/2 text-right text-[13px] leading-none text-fog" style={{ top: Y(v) }}>
            ${v}
          </span>
        ))}
        {k >= 1 && (
          <>
            <span aria-hidden className="absolute text-[14px] leading-[1.25] text-paper" style={{ left: X(12) + 10, top: Y(108) - 9 }}>
              ${108}
              {!narrow && <span className="text-fog"> split frozen</span>}
            </span>
            <span aria-hidden className="absolute text-[14px] leading-[1.25] text-signal" style={{ left: X(12) + 10, top: Y(94) - 9 }}>
              ${94}
              {!narrow && <span> moved weekly</span>}
            </span>
          </>
        )}
        {[
          [0, "Week 1"],
          [6, "Week 7"],
          [12, "Week 13"],
        ].map(([w, t]) => (
          <span key={w as number} aria-hidden className={`absolute bottom-0 whitespace-nowrap text-[13px] leading-none text-fog ${w === 12 ? "-translate-x-full" : w ? "-translate-x-1/2" : ""}`} style={{ left: X(w as number) }}>
            {t}
          </span>
        ))}
      </div>
      {narrow && (
        <Key
          items={[
            { label: "Moved weekly", tone: "signal" },
            { label: "Split frozen", tone: "paper" },
          ]}
        />
      )}
    </Figure>
  );
}

/* ------------------------------------------------------ PR & Reputation */

const RELEASE = [[0, 0], [1, 17], [3, 18], [30, 18]] as const;
const EXCLUSIVE = [[0, 1], [2, 6], [5, 10], [9, 14], [14, 19], [16, 21], [21, 26], [30, 31]] as const;
const MOMENTS = [
  { d: 2, v: 6, what: "Trade press picks it up" },
  { d: 9, v: 14, what: "Podcasts invite the founder" },
  { d: 14, v: 19, what: "AI answers start quoting it", over: true },
];

export function PrFigure() {
  const box = useRef<HTMLDivElement>(null);
  const W = useWidth(box);
  const k = useDraw(box, 1800);
  const narrow = W < 560;
  const H = narrow ? 260 : 310;
  const P = { l: 36, r: narrow ? 14 : 160, t: 14, b: 28 };
  const X = (d: number) => P.l + (d / 30) * (W - P.l - P.r);
  const Y = (v: number) => P.t + (1 - v / 34) * (H - P.t - P.b);
  const ex = partial(EXCLUSIVE.map(([d, v]) => [X(d), Y(v)] as const), k);
  const re = partial(RELEASE.map(([d, v]) => [X(d), Y(v)] as const), k);
  return (
    <Figure
      title="Placed well, one story keeps being repeated."
      sub="Everything that cites one story in the thirty days after it runs: sent to everyone as a release, and placed as an exclusive with the research behind it."
      label="Two lines over thirty days: a release jumps to eighteen copies on day one and stops; an exclusive with research grows to thirty-one citations, picked up by trade press, podcasts and, from day fourteen, AI answers."
      note={`${ILLUSTRATION} Copies of a release are counted as citations here, though nobody quotes them.`}
    >
      <div ref={box} className="relative" style={{ height: H }}>
        <svg aria-hidden width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 overflow-visible" fill="none">
          {[10, 20, 30].map((v) => (
            <line key={v} x1={P.l} x2={W - P.r} y1={Y(v)} y2={Y(v)} stroke={paper} strokeOpacity={0.1} />
          ))}
          <line x1={P.l} x2={W - P.r} y1={H - P.b} y2={H - P.b} stroke={paper} strokeOpacity={0.3} />
          <path d={line(re)} stroke={paper} strokeOpacity={0.55} strokeWidth={1.75} />
          <path d={line(ex)} stroke={signal} strokeWidth={2.25} />
          {!narrow && MOMENTS.map((mo) => (k >= mo.d / 30 ? <rect key={mo.d} x={X(mo.d) - 4} y={Y(mo.v) - 4} width={8} height={8} fill={paper} /> : null))}
        </svg>
        {[10, 20, 30].map((v) => (
          <span key={v} aria-hidden className="absolute left-0 w-[26px] -translate-y-1/2 text-right text-[13px] leading-none text-fog" style={{ top: Y(v) }}>
            {v}
          </span>
        ))}
        {MOMENTS.map((mo, i) =>
          k < mo.d / 30 ? null : narrow ? (
            <NumberMark key={mo.d} n={i + 1} x={X(mo.d)} y={Y(mo.v)} />
          ) : (
            // under and right of its point, where the line has already risen; the last sits
            // over and left of it instead, as the release's line runs just under it
            <span
              key={mo.d}
              aria-hidden
              className={`absolute whitespace-nowrap text-[14px] leading-none text-paper ${mo.over ? "-translate-x-full -translate-y-full" : ""}`}
              style={mo.over ? { left: X(mo.d) - 10, top: Y(mo.v) - 6 } : { left: X(mo.d) + 10, top: Y(mo.v) + 6 }}
            >
              {mo.what}
            </span>
          ),
        )}
        {k >= 1 && !narrow && (
          <>
            <span aria-hidden className="absolute text-[14px] leading-[1.25] text-signal" style={{ left: X(30) + 10, top: Y(31) - 9 }}>
              An exclusive, with research
            </span>
            <span aria-hidden className="absolute text-[14px] leading-[1.25] text-fog" style={{ left: X(30) + 10, top: Y(18) - 9 }}>
              A release to everyone
            </span>
          </>
        )}
        {[0, 10, 20, 30].map((d) => (
          <span key={d} aria-hidden className={`absolute bottom-0 whitespace-nowrap text-[13px] leading-none text-fog ${d === 30 ? "-translate-x-full" : d ? "-translate-x-1/2" : ""}`} style={{ left: X(d) }}>
            Day {d}
          </span>
        ))}
      </div>
      {narrow && (
        <>
          <Key
            items={[
              { label: "An exclusive, with research", tone: "signal" },
              { label: "A release to everyone", tone: "paper" },
            ]}
          />
          <Notes items={MOMENTS.map((mo) => ({ when: `Day ${mo.d}`, what: mo.what }))} />
        </>
      )}
    </Figure>
  );
}

/* -------------------------------------------------- Analytics & Martech */

const CLAIMS = [
  ["Ad platform A", 210],
  ["Ad platform B", 160],
  ["Email platform", 70],
  ["Affiliate network", 40],
] as const;
const HAPPENED = 270;

export function AnalyticsFigure() {
  const box = useRef<HTMLDivElement>(null);
  const k = useDraw(box, 1400);
  const [hot, setHot] = useState<number | null>(null);
  const total = CLAIMS.reduce((s, [, v]) => s + v, 0);
  const max = total;
  return (
    <Figure
      title="Add up what each platform claims, and you sell more than you do."
      sub="One month of orders: what four platforms each report as theirs, against the orders that happened in the store."
      label={`Four platforms claim ${total} orders between them; ${HAPPENED} happened. Each counts every order it touched.`}
      note={`${ILLUSTRATION} The Ledger counts each order once, by its order number, with the path that led to it.`}
    >
      <div ref={box} className="space-y-6">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[15px] text-paper">What the platforms claim</p>
            <p className="type-title text-[22px] leading-none tabular-nums text-paper">{total}</p>
          </div>
          <div aria-hidden className="mt-3 flex h-[18px]" style={{ width: `${(total / max) * 100 * k}%` }}>
            {CLAIMS.map(([n, v], i) => (
              <span
                key={n}
                onPointerEnter={() => setHot(i)}
                onPointerLeave={() => setHot(null)}
                className={`h-full border-r-2 border-graphite transition-opacity ${hot != null && hot !== i ? "opacity-40" : ""}`}
                style={{ width: `${(v / total) * 100}%`, background: `color-mix(in srgb, var(--color-paper) ${70 - i * 14}%, transparent)` }}
              />
            ))}
          </div>
          <p className="mt-2 min-h-[1.4em] text-[14px] text-fog">
            {hot != null ? `${CLAIMS[hot][0]}: ${CLAIMS[hot][1]} orders` : CLAIMS.map(([n, v]) => `${n} ${v}`).join(" · ")}
          </p>
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[15px] text-paper">Orders that happened</p>
            <p className="type-title text-[22px] leading-none tabular-nums text-signal">{HAPPENED}</p>
          </div>
          <div aria-hidden className="mt-3 h-[18px] bg-signal" style={{ width: `${(HAPPENED / max) * 100 * k}%` }} />
          <p className="mt-2 text-[14px] text-fog">The platforms claim {Math.round((total / HAPPENED - 1) * 100)}% more than happened.</p>
        </div>
      </div>
    </Figure>
  );
}
