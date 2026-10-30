"use client";

import { useRef, useState } from "react";
import { Figure, Toggle, line, partial, useDraw, useWidth } from "@/components/figures/kit";

/*
  The four engagements' figures, one point each (figures/kit.tsx has the
  rules). Reach: the amplification rules, on one cut. Reputation: when the
  places buyers check agree, the answer does. Mindshare: share of search
  moves first, market share follows. Revenue: the same visitors, more
  orders, once the costliest leaks are fixed.
*/

const signal = "var(--color-signal)";
const paper = "var(--color-paper)";

/* ---------------------------------------------------------------- Reach */

type Pt = readonly [number, number];
const TAKEOFF: Pt[] = [
  [0, 0.9], [0.5, 1.45], [1, 2.25], [1.5, 2.9], [2, 3.6], [2.5, 4.4], [3, 5.35], [3.5, 6.1],
  [4, 6.9], [4.5, 7.7], [5, 8.7], [5.5, 9.6], [6, 11.1], [6.5, 11.9], [7, 12.6],
];
const FADES: Pt[] = [[0, 1.25], [0.5, 1.15], [1, 1.0], [1.5, 0.92], [2, 0.85], [3, 0.76], [4, 0.69], [5, 0.63], [6, 0.59], [7, 0.56]];
const OTHERS: Pt[][] = [
  [[0, 0.8], [1, 0.75], [2, 0.7], [3, 0.66], [4, 0.63], [5, 0.61], [6, 0.6], [7, 0.59]],
  [[0, 1.1], [1, 1.05], [2, 0.98], [3, 0.94], [4, 0.9], [5, 0.86], [6, 0.84], [7, 0.83]],
  [[0, 0.95], [1, 0.86], [2, 0.8], [3, 0.76], [4, 0.73], [5, 0.71], [6, 0.7], [7, 0.69]],
];
const RULES = [
  { at: 2, what: "Paid goes behind it, the same day" },
  { at: 5, what: "Its budget doubles; creators answer it" },
  { at: 10, what: "Press is briefed; answer pages go up" },
];

function crossing(pts: Pt[], v: number): Pt | null {
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    if (y0 < v && y1 >= v) {
      const f = (Math.log(v) - Math.log(y0)) / (Math.log(y1) - Math.log(y0));
      return [x0 + (x1 - x0) * f, v];
    }
  }
  return null;
}

export function ReachFigure() {
  const box = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"takes" | "fades">("takes");
  const W = useWidth(box);
  const k = useDraw(box, 1600, mode);
  const narrow = W < 560;
  const H = narrow ? 280 : 340;
  const P = { l: 40, r: 12, t: 12, b: 28 };
  const lo = Math.log(0.45);
  const hi = Math.log(16);
  const X = (d: number) => P.l + (d / 7) * (W - P.l - P.r);
  const Y = (v: number) => P.t + (1 - (Math.log(v) - lo) / (hi - lo)) * (H - P.t - P.b);
  const main = mode === "takes" ? TAKEOFF : FADES;
  const drawn = partial(main.map(([d, v]) => [X(d), Y(v)] as const), k);
  const tip = drawn[drawn.length - 1];
  const passed = RULES.map((r) => {
    const c = crossing(TAKEOFF, r.at);
    return mode === "takes" && c && k >= c[0] / 7 ? c : null;
  });

  return (
    <Figure
      title={mode === "takes" ? "Each line a cut crosses triggers the next move." : "Most cuts never cross the first line, and are retired."}
      sub="One cut of an idea, against your usual post, over its first seven days. The scale doubles at each step."
      control={
        <Toggle
          label="Which cut"
          value={mode}
          onChange={setMode}
          options={[
            { key: "takes", label: "A cut that takes off" },
            { key: "fades", label: "A cut that fades" },
          ]}
        />
      }
      label="A chart of one cut's views against the usual post over seven days, with lines at 2, 5 and 10 times the usual post: crossing each one puts paid behind it, doubles its budget with creators answering it, and briefs press. A cut that stays under the usual post is retired after seven days."
      note="An illustration, not a client’s results. Your usual post is the median of your last thirty, by how many watch to the end; the lines are set with you in the Diagnostic."
    >
      <div ref={box} className="relative" style={{ height: H }}>
        <svg aria-hidden width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 overflow-visible" fill="none">
          {[0.5, 1, 2, 5, 10].map((v) => (
            <line key={v} x1={P.l} x2={W - P.r} y1={Y(v)} y2={Y(v)} stroke={paper} strokeOpacity={v === 1 ? 0.45 : 0.12} />
          ))}
          {OTHERS.map((o, i) => (
            <path key={i} d={line(partial(o.map(([d, v]) => [X(d), Y(v)] as const), k))} stroke={paper} strokeOpacity={0.22} strokeWidth={1.25} />
          ))}
          <path d={line(drawn)} stroke={mode === "takes" ? signal : paper} strokeWidth={2.25} strokeLinejoin="round" />
          {passed.map((c, i) => (c ? <rect key={i} x={X(c[0]) - 4} y={Y(c[1]) - 4} width={8} height={8} fill={signal} /> : null))}
          {mode === "fades" && k >= 1 && <rect x={tip[0] - 4} y={tip[1] - 4} width={8} height={8} fill={paper} />}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((d) => (
            <line key={d} x1={X(d)} x2={X(d)} y1={H - P.b} y2={H - P.b + 5} stroke={paper} strokeOpacity={0.35} />
          ))}
        </svg>
        {[0.5, 1, 2, 5, 10].map((v) => (
          <span key={v} aria-hidden className="absolute left-0 w-[32px] -translate-y-1/2 text-right text-[13px] leading-none text-fog" style={{ top: Y(v) }}>
            {v}×
          </span>
        ))}
        <span aria-hidden className="absolute -translate-y-full pb-1.5 text-[14px] leading-none text-fog" style={{ top: Y(1), left: X(narrow ? 2.4 : 1.7) }}>
          Your usual post
        </span>
        {RULES.map((r, i) => {
          // under its line just past where the cut crosses it, where the line has already
          // risen above; if it won't fit there, over its line at the left, where the line is far below
          const text = narrow ? r.what.split(/[;,]/)[0] : r.what;
          const x = X(crossing(TAKEOFF, r.at)![0]) + 12;
          const under = x + text.length * 7.4 <= W - P.r;
          return (
            <span
              key={r.at}
              aria-hidden
              className={`absolute whitespace-nowrap text-[14px] leading-none transition-colors duration-300 ${under ? "pt-1.5" : "-translate-y-full pb-1.5"} ${passed[i] ? "text-paper" : "text-fog"}`}
              style={{ top: Y(r.at), left: under ? x : P.l + 6 }}
            >
              {text}
            </span>
          );
        })}
        {mode === "fades" && k >= 1 && (
          <span aria-hidden className="absolute -translate-x-full pr-3 text-right text-[14px] leading-[1.3] text-paper" style={{ top: tip[1] + 8, left: tip[0] }}>
            Retired after seven days.
            <br />
            <span className="text-fog">What it taught goes into the next brief.</span>
          </span>
        )}
        {[1, 2, 3, 4, 5, 6, 7].map((d) =>
          narrow && d % 2 === 0 ? null : (
            <span key={d} aria-hidden className={`absolute bottom-0 whitespace-nowrap text-[13px] leading-none text-fog ${d === 7 ? "-translate-x-full" : "-translate-x-1/2"}`} style={{ left: X(d) }}>
              {narrow ? `D${d}` : `Day ${d}`}
            </span>
          ),
        )}
      </div>
    </Figure>
  );
}

/* ----------------------------------------------------------- Reputation */

const PLACES = [
  { name: "Your own site", before: ["differ", "Describes a product you stopped selling"], after: "What you do, for whom, at what price" },
  { name: "Reviews", before: ["differ", "Complaints about slow replies, unanswered"], after: "Recent, and every one answered" },
  { name: "Press", before: ["silent", "Nothing in two years"], after: "Your research, covered twice" },
  { name: "Forums", before: ["differ", "“Avoid, they never reply”"], after: "“They sorted it within a day”" },
  { name: "Lists and rankings", before: ["silent", "Not listed"], after: "Listed, for the use you are best at" },
  { name: "Directories", before: ["differ", "An old address and the wrong category"], after: "Corrected" },
] as const;

export function ReputationFigure() {
  const box = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"today" | "after">("today");
  const k = useDraw(box, 1200, mode);
  const after = mode === "after";
  return (
    <Figure
      title={after ? "When the places buyers check agree, so does the answer." : "Today the places buyers check disagree, so the answer hedges."}
      sub="Six kinds of place a buyer checks before trusting you, and what an AI assistant says when asked about you."
      control={
        <Toggle
          label="When"
          value={mode}
          onChange={setMode}
          options={[
            { key: "today", label: "Today" },
            { key: "after", label: "After a quarter" },
          ]}
        />
      }
      label="Six places buyers check, each agreeing with your story or not, and the answer an AI assistant gives: mixed today, consistent after a quarter of work."
      note="An illustration, not a client’s results. Which places your buyers check, and what each says today, is read in the Diagnostic."
    >
      <div ref={box} className="grid gap-x-10 gap-y-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <ul>
          {PLACES.map((p, i) => {
            const lit = k >= (i + 1) / (PLACES.length + 1);
            const state = after ? "agree" : p.before[0];
            return (
              <li key={p.name} className="grid grid-cols-[14px_minmax(0,9rem)_1fr] items-baseline gap-x-3 border-b border-paper/10 py-3 first:pt-0">
                <span
                  aria-hidden
                  className={`size-[8px] translate-y-[-1px] transition-colors duration-500 ${
                    !lit ? "bg-transparent" : state === "agree" ? "bg-paper" : state === "differ" ? "bg-signal" : "border border-paper/50"
                  }`}
                />
                <span className="text-[15px] text-paper">{p.name}</span>
                <span className={`text-[15px] leading-[1.4] transition-opacity duration-500 ${lit ? "opacity-100" : "opacity-0"} ${after ? "text-paper" : "text-fog"}`}>
                  {after ? p.after : p.before[1]}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="self-start border-l-2 border-paper/80 pl-5">
          <p className="text-[14px] text-fog">Asked “Is it any good?”, an assistant says:</p>
          <p className={`type-title mt-3 text-[clamp(1.125rem,1rem+0.4vw,1.3125rem)] leading-[1.4] transition-opacity duration-500 ${k >= 0.85 ? "opacity-100" : "opacity-0"}`}>
            {after
              ? "Well reviewed, with replies within a day. Covered in the trade press for its research, and best known for the use its customers describe."
              : "Opinions are mixed. Reviewers mention slow replies, and some sources describe a product the company no longer sells."}
          </p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-fog">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="size-[8px] bg-paper" /> Says your story
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="size-[8px] bg-signal" /> Says something else
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="size-[8px] border border-paper/50" /> Says nothing
            </span>
          </p>
        </div>
      </div>
    </Figure>
  );
}

/* ------------------------------------------------------------ Mindshare */

const months = Array.from({ length: 37 }, (_, m) => m);
const ease = (t: number) => t * t * (3 - 2 * t);
const rise = (m: number, from: number, to: number, a: number, b: number) => from + (to - from) * ease(Math.min(1, Math.max(0, (m - a) / (b - a))));
const wob = (m: number, s: number) => Math.sin(m * 1.7 + s) * 0.35 + Math.sin(m * 0.6 + s * 2) * 0.25;
const SEARCH = months.map((m) => [m, rise(m, 12, 21.5, 4, 17) + wob(m, 1)] as const);
const MARKET = months.map((m) => [m, rise(m, 10, 18.5, 13.5, 26.5) + wob(m, 4) * 0.5] as const);
/** The month a line first rises through v: market share reaches each level about twelve months after search */
const reaches = (pts: readonly (readonly [number, number])[], v: number) => {
  for (let i = 1; i < pts.length; i++) {
    const [m0, a] = pts[i - 1];
    const [m1, b] = pts[i];
    if (a < v && b >= v) return m0 + ((v - a) / (b - a)) * (m1 - m0);
  }
  return pts[pts.length - 1][0];
};
const GAP = 16;

export function MindshareFigure() {
  const box = useRef<HTMLDivElement>(null);
  const W = useWidth(box);
  const k = useDraw(box, 1800);
  const narrow = W < 560;
  const H = narrow ? 260 : 320;
  const P = { l: 40, r: narrow ? 12 : 118, t: 14, b: 28 };
  const X = (m: number) => P.l + (m / 36) * (W - P.l - P.r);
  const Y = (v: number) => P.t + (1 - (v - 8) / 16) * (H - P.t - P.b);
  const s = partial(SEARCH.map(([m, v]) => [X(m), Y(v)] as const), k);
  const mk = partial(MARKET.map(([m, v]) => [X(m), Y(v)] as const), k);
  const gapY = Y(GAP);
  const [g0, g1] = [X(reaches(SEARCH, GAP)), X(reaches(MARKET, GAP))];
  // the label sits over the bracket, centred between the two lines at its own height,
  // and shortens when the gap is narrow
  const v = GAP + 13 / ((H - P.t - P.b) / 16);
  const [l0, l1] = [X(reaches(SEARCH, v)), X(reaches(MARKET, v))];
  const gapLabel = l1 - l0 - 16 >= 19 * 7.4 ? "About twelve months" : "About a year";
  return (
    <Figure
      title="Share of search moves first. Market share follows."
      sub="Your share of searches in your category, and your share of its sales, over three years."
      label="A chart of two lines over three years: share of search rises first, and market share rises about twelve months later, the pattern Les Binet described."
      note={
        <>
          An illustration of the pattern Les Binet found for UK car brands, where share of search ran about twelve months ahead of market share (IPA, 2020);
          not real brand data. Share of search is read in the Ledger every month.
        </>
      }
    >
      <div ref={box} className="relative" style={{ height: H }}>
        <svg aria-hidden width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 overflow-visible" fill="none">
          {[10, 15, 20].map((v) => (
            <line key={v} x1={P.l} x2={W - P.r} y1={Y(v)} y2={Y(v)} stroke={paper} strokeOpacity={0.1} />
          ))}
          <line x1={P.l} x2={W - P.r} y1={H - P.b} y2={H - P.b} stroke={paper} strokeOpacity={0.3} />
          <path d={line(mk)} stroke={paper} strokeOpacity={0.75} strokeWidth={1.75} />
          <path d={line(s)} stroke={signal} strokeWidth={2.25} />
          {k >= 1 && (
            <g>
              <line x1={g0} x2={g1} y1={gapY} y2={gapY} stroke={paper} strokeOpacity={0.6} />
              <line x1={g0} x2={g0} y1={gapY - 5} y2={gapY + 5} stroke={paper} strokeOpacity={0.6} />
              <line x1={g1} x2={g1} y1={gapY - 5} y2={gapY + 5} stroke={paper} strokeOpacity={0.6} />
            </g>
          )}
        </svg>
        {[10, 15, 20].map((v) => (
          <span key={v} aria-hidden className="absolute left-0 w-[32px] -translate-y-1/2 text-right text-[13px] leading-none text-fog" style={{ top: Y(v) }}>
            {v}%
          </span>
        ))}
        {k >= 1 && (
          <span aria-hidden className="absolute -translate-x-1/2 -translate-y-full whitespace-nowrap pb-1.5 text-[14px] leading-none text-paper" style={{ left: (l0 + l1) / 2, top: gapY }}>
            {gapLabel}
          </span>
        )}
        <span aria-hidden className={`absolute text-[14px] leading-[1.2] text-signal transition-opacity duration-500 ${k >= 1 ? "opacity-100" : "opacity-0"}`} style={narrow ? { left: X(24), top: Y(23.6) } : { left: W - P.r + 10, top: Y(SEARCH[36][1]) - 8 }}>
          Share of search
        </span>
        <span aria-hidden className={`absolute text-[14px] leading-[1.2] text-paper transition-opacity duration-500 ${k >= 1 ? "opacity-100" : "opacity-0"}`} style={narrow ? { left: X(27), top: Y(17.4) } : { left: W - P.r + 10, top: Y(MARKET[36][1]) - 8 }}>
          Market share
        </span>
        {[
          [0, "Year 1"],
          [12, "Year 2"],
          [24, "Year 3"],
        ].map(([m, t]) => (
          <span key={m as number} aria-hidden className="absolute bottom-0 text-[13px] leading-none text-fog" style={{ left: X(m as number) }}>
            {t}
          </span>
        ))}
      </div>
    </Figure>
  );
}

/* -------------------------------------------------------------- Revenue */

const STEPS = ["Visit", "Product page", "Cart", "Checkout", "Order"] as const;
const OPEN = [1000, 520, 146, 80, 56];
const FIXED = [1000, 620, 223, 138, 108];

export function RevenueFigure() {
  const box = useRef<HTMLOListElement>(null);
  const [mode, setMode] = useState<"open" | "fixed">("open");
  const k = useDraw(box, 1200);
  const vals = mode === "open" ? OPEN : FIXED;
  return (
    <Figure
      title={mode === "open" ? "Most buyers who start never finish." : "Fix the costliest leaks, and the same visitors buy twice as often."}
      sub="Of every 1,000 visitors, how many reach each step on the way to an order."
      control={
        <Toggle
          label="The path"
          value={mode}
          onChange={setMode}
          options={[
            { key: "open", label: "Leaks open" },
            { key: "fixed", label: "Three leaks fixed" },
          ]}
        />
      }
      label="Bars for each step from visit to order, per 1,000 visitors: 56 orders with the leaks open, 108 with three leaks fixed."
      note={
        mode === "fixed" ? (
          <>The three fixes: the first page loads in 1.9 seconds instead of 4.1; price and delivery are shown up front; checkout no longer asks for an account. Illustrative rates, not a client’s; each step is measured on your own path in the Diagnostic.</>
        ) : (
          <>Illustrative rates, not a client’s; each step is measured on your own path, by source, in the Diagnostic.</>
        )
      }
    >
      <ol ref={box} className="space-y-3">
        {STEPS.map((s, i) => {
          const v = vals[i];
          const last = i === STEPS.length - 1;
          const shown = Math.min(1, Math.max(0, k * STEPS.length - i));
          return (
            <li key={s} className="grid grid-cols-[minmax(0,7.5rem)_1fr_3.5rem] items-center gap-x-4 sm:grid-cols-[9rem_1fr_4rem]">
              <span className={`text-[15px] ${last ? "text-paper" : "text-fog"}`}>{s}</span>
              <span aria-hidden className="relative h-[14px] bg-paper/[0.06]">
                <span
                  className={`absolute inset-y-0 left-0 transition-[width] duration-700 ease-linear ${last ? "bg-signal" : "bg-paper/45"}`}
                  style={{ width: `${(v / 1000) * 100 * shown}%` }}
                />
              </span>
              <span className={`text-right text-[16px] tabular-nums ${last ? "text-signal" : "text-paper"}`}>{v.toLocaleString("en-US")}</span>
            </li>
          );
        })}
      </ol>
    </Figure>
  );
}
