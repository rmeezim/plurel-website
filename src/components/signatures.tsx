"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";

/*
  The signatures: one simple drawing per engagement and discipline page,
  set in the page's head beside its title, so each page opens on its own
  idea before a word of it is read. Each is the idea drawn as lines,
  nodes and a few labels (never a mock screen or a chart of results), on
  a 600 by 450 field that scales with its column. Labels stay HTML at
  13px and up; where a phone would crowd them they move into a numbered
  key under the drawing. A caption says in words what it shows.

  It draws once as the head settles (after the h1 is plotted): lines at a
  steady rate, nodes and labels lit by opacity, nothing moving into
  place. Without JS and under reduced motion it is simply drawn; with JS
  it waits hidden (globals.css, [data-sig]) until it starts, so it never
  flashes in finished and then redraws.
*/

type P = readonly [number, number];
type Tone = "dim" | "line" | "paper" | "signal";
type Ink = "fog" | "paper" | "signal";
type Timed = { at: number; dur?: number };
type Mark =
  | (Timed & { t: "path"; d: string; tone?: Tone; w?: number; fill?: Tone | "brand"; fillOp?: number; fade?: boolean; cap?: "butt" | "square" })
  | (Timed & { t: "rect"; x: number; y: number; w: number; h: number; tone?: Tone; fill?: Tone | "brand" | "graphite"; fillOp?: number })
  | (Timed & { t: "node"; x: number; y: number; s?: number; tone?: Tone })
  | (Timed & { t: "ring"; x: number; y: number; r: number; tone?: Tone })
  | (Timed & { t: "text"; x: number; y: number; text: string; ink?: Ink; align?: "l" | "c" | "r"; v?: "t" | "m" | "b"; size?: string; cls?: string; key?: number; sub?: { text: string; ink?: Ink } })
  | (Timed & { t: "num"; x: number; y: number; n: number });

/** A drawing: its marks on a field of w by h (600 by 450 unless it says) and what it shows, in words */
type Sig = { caption?: string; marks: Mark[]; w?: number; h?: number };

const COLOR: Record<Tone | "brand" | "graphite", [string, number]> = {
  dim: ["var(--color-paper)", 0.16],
  line: ["var(--color-paper)", 0.4],
  paper: ["var(--color-paper)", 0.85],
  signal: ["var(--color-signal)", 1],
  brand: ["var(--color-brand)", 1],
  graphite: ["var(--color-graphite)", 1],
};
const INK: Record<Ink, string> = { fog: "text-fog", paper: "text-paper", signal: "text-signal" };

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const poly = (pts: readonly P[]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join("");
/** A level-out curve between two points, as a flow between columns */
const curve = (x1: number, y1: number, x2: number, y2: number) => `M${x1} ${y1}C${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`;
const polar = (cx: number, cy: number, r: number, deg: number): P => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];

/* ------------------------------------------------------------ the fourteen */

function reach(): Sig {
  const cuts = [110, 160, 210, 260, 310, 360];
  const rise: P[] = [[210, 160], [260, 158], [310, 152], [360, 141], [410, 124], [460, 100], [510, 72], [560, 42]];
  return {
    caption: "One idea, cut for each surface. Most cuts are retired within a week; the one that takes off gets more behind it at each line it crosses.",
    marks: [
      ...cuts.map((y, i): Mark => ({ t: "path", d: curve(60, 235, 210, y), tone: "line", w: 1.25, at: 0.04 + i * 0.03 })),
      { t: "node", x: 60, y: 235, s: 12, tone: "paper", at: 0 },
      { t: "text", x: 60, y: 256, text: "One idea", ink: "paper", align: "c", at: 0.02 },
      ...cuts.map((y, i): Mark => ({ t: "node", x: 210, y, s: 8, tone: i === 1 ? "signal" : "paper", at: 0.2 + i * 0.03 })),
      { t: "text", x: 210, y: 90, text: "A cut for each surface", ink: "fog", align: "c", v: "b", at: 0.26 },
      ...cuts
        .filter((_, i) => i !== 1)
        .map((y, j): Mark => ({ t: "path", d: `M214 ${y}L${292 - j * 7} ${y + 9 + j * 2}`, tone: "dim", w: 1.25, at: 0.36 + j * 0.02 })),
      { t: "text", x: 215, y: 392, text: "Most are retired within a week", ink: "fog", at: 0.48 },
      { t: "path", d: poly(rise), tone: "signal", w: 2.5, at: 0.46, dur: 0.34 },
      ...([[310, 152, "2×"], [410, 124, "5×"], [510, 72, "10×"]] as const).flatMap(([x, y, s], i): Mark[] => [
        { t: "node", x, y, s: 8, tone: "signal", at: 0.56 + i * 0.09 },
        { t: "text", x: x + 9, y: y + 9, text: s, ink: "signal", size: "13px", at: 0.58 + i * 0.09 },
      ]),
      { t: "text", x: 565, y: 18, text: "Takes off: the budget follows", ink: "paper", align: "r", at: 0.84 },
    ],
  };
}

function reputation(): Sig {
  const places = ["Your own site", "Reviews", "Press", "Forums", "Directories"];
  const ys = [95, 160, 225, 290, 355];
  return {
    caption: "The places a buyer checks before trusting you, brought to say one story, so the answer an assistant gives says it too.",
    marks: [
      ...places.flatMap((p, i): Mark[] => [
        { t: "text", x: 40, y: ys[i], text: p, ink: "paper", v: "m", at: 0.02 + i * 0.04 },
        { t: "node", x: 205, y: ys[i], s: 8, tone: "paper", at: 0.05 + i * 0.04 },
        { t: "path", d: curve(205, ys[i], 395, 225), tone: "line", w: 1.25, at: 0.22 + i * 0.04, dur: 0.26 },
        { t: "path", d: curve(205, ys[i], 395, 225), tone: "signal", w: 1.75, at: 0.58 + i * 0.03, dur: 0.22 },
      ]),
      { t: "node", x: 395, y: 225, s: 16, tone: "signal", at: 0.78 },
      { t: "text", x: 415, y: 225, text: "Says your story", ink: "paper", v: "m", sub: { text: "in the answer" }, at: 0.82 },
    ],
  };
}

function mindshare(): Sig {
  const xs = [90, 220, 350, 480];
  const ry = (r: number) => 100 + (r - 1) * 80;
  const lines = [
    { name: "Brand A", r: [1, 1, 1, 2] },
    { name: "Brand B", r: [2, 2, 3, 3] },
    { name: "Brand C", r: [3, 4, 4, 4] },
  ];
  const you = [4, 3, 2, 1];
  return {
    caption: "Which brand buyers name first when they think of the category, year by year, as one position is said the same way everywhere.",
    marks: [
      ...["1st", "2nd", "3rd", "4th"].map((s, i): Mark => ({ t: "text", x: 62, y: ry(i + 1), text: s, ink: "fog", align: "r", v: "m", size: "13px", at: 0.02 })),
      ...["Now", "Year 1", "Year 2", "Year 3"].map((s, i): Mark => ({ t: "text", x: xs[i], y: 384, text: s, ink: "fog", align: "c", size: "13px", at: 0.04 })),
      { t: "text", x: 90, y: 40, text: "Who buyers name first", ink: "fog", size: "13px", at: 0.06 },
      ...lines.flatMap((l, i): Mark[] => [
        { t: "path", d: poly(l.r.map((r, j) => [xs[j], ry(r)] as const)), tone: "line", w: 1.5, at: 0.1 + i * 0.06, dur: 0.3 },
        ...l.r.map((r, j): Mark => ({ t: "node", x: xs[j], y: ry(r), s: 7, tone: "paper", at: 0.12 + i * 0.06 + j * 0.06 })),
        { t: "text", x: 500, y: ry(l.r[3]), text: l.name, ink: "fog", v: "m", at: 0.5 + i * 0.04 },
      ]),
      { t: "path", d: poly(you.map((r, j) => [xs[j], ry(r)] as const)), tone: "signal", w: 2.75, at: 0.42, dur: 0.34 },
      ...you.map((r, j): Mark => ({ t: "node", x: xs[j], y: ry(r), s: 10, tone: "signal", at: 0.44 + j * 0.1 })),
      { t: "text", x: 500, y: ry(1), text: "You", ink: "signal", v: "m", at: 0.82 },
    ],
  };
}

function revenue(): Sig {
  const steps = [
    { x: 60, name: "Visit" },
    { x: 180, name: "Product" },
    { x: 300, name: "Cart" },
    { x: 420, name: "Checkout" },
    { x: 540, name: "Order" },
  ];
  // the share of those who reached a step who leave before the next (the figure's illustrative path)
  const leave = [48, 72, 45, 30];
  // the costliest three, numbered in the order they are fixed
  const fixed = [2, 1, 3, 0];
  return {
    caption: "Every step from a first visit to an order loses buyers. Each leak is priced in your own numbers, and the costliest are fixed first.",
    marks: [
      { t: "text", x: 60, y: 64, text: "Leaks fixed, costliest first", ink: "paper", at: 0 },
      { t: "path", d: "M60 200L540 200", tone: "paper", w: 2, at: 0.04, dur: 0.3 },
      ...steps.flatMap((st, i): Mark[] => [
        { t: "node", x: st.x, y: 200, s: i === 4 ? 14 : 10, tone: i === 4 ? "signal" : "paper", at: 0.08 + i * 0.06 },
        { t: "text", x: st.x, y: 178, text: st.name, ink: i === 4 ? "signal" : "fog", align: "c", v: "b", size: "13px", at: 0.1 + i * 0.06 },
      ]),
      ...leave.flatMap((v, i): Mark[] => {
        const x = (steps[i].x + steps[i + 1].x) / 2;
        return [
          { t: "rect", x: x - 9, y: 208, w: 18, h: v * 2.2, fill: "paper", fillOp: 0.24, at: 0.4 + i * 0.06 },
          { t: "text", x, y: 216 + v * 2.2, text: `${v}% leave`, ink: "fog", align: "c", size: "13px", at: 0.5 + i * 0.06 },
          ...(fixed[i] ? [{ t: "num", x, y: 232, n: fixed[i], at: 0.6 + fixed[i] * 0.06 } as Mark] : []),
        ];
      }),
    ],
  };
}

function cmo(): Sig {
  const who = [
    { deg: 240, name: "Brand", side: "r" },
    { deg: 300, name: "Website", side: "l" },
    { deg: 0, name: "Content", side: "l" },
    { deg: 60, name: "Paid media", side: "l" },
    { deg: 120, name: "PR", side: "r" },
    { deg: 180, name: "Your team", side: "r" },
  ] as const;
  return {
    caption: "One senior owner sets the plan, the budget and the number, and every supplier and your own team works to them.",
    marks: [
      ...who.flatMap((w, i): Mark[] => {
        const [x, y] = polar(300, 215, 165, w.deg);
        return [
          { t: "path", d: `M300 215L${x.toFixed(1)} ${y.toFixed(1)}`, tone: "line", w: 1.25, at: 0.12 + i * 0.05, dur: 0.22 },
          { t: "node", x, y, s: 9, tone: "paper", at: 0.3 + i * 0.05 },
          { t: "text", x: x + (w.side === "l" ? 14 : -14), y, text: w.name, ink: "fog", align: w.side, v: "m", at: 0.34 + i * 0.05 },
        ];
      }),
      { t: "rect", x: 225, y: 192, w: 150, h: 46, tone: "signal", fill: "graphite", at: 0 },
      { t: "text", x: 300, y: 215, text: "One owner", ink: "paper", align: "c", v: "m", size: "15px", at: 0.04 },
    ],
  };
}

function branding(): Sig {
  const cols = Array.from({ length: 6 }, (_, i) => 30 + i * 42);
  return {
    caption: "What a brand system holds, shown with Plurel’s own: one type family, four colours, a layout grid and a voice, checked on everything that ships.",
    marks: [
      { t: "path", d: "M300 20L300 430", tone: "dim", w: 1, at: 0 },
      { t: "path", d: "M20 225L580 225", tone: "dim", w: 1, at: 0.04 },
      { t: "text", x: 30, y: 30, text: "Type", ink: "fog", size: "13px", at: 0.06 },
      { t: "text", x: 30, y: 62, text: "Aa", ink: "paper", size: "15cqw", cls: "type-display leading-none", at: 0.12 },
      { t: "text", x: 30, y: 186, text: "One family, three sizes", ink: "fog", size: "13px", at: 0.2 },
      { t: "text", x: 320, y: 30, text: "Colour", ink: "fog", size: "13px", at: 0.24 },
      ...(["brand", "signal", "paper", "graphite"] as const).map((f, i): Mark => ({ t: "rect", x: 320 + i * 60, y: 62, w: 50, h: 50, tone: "line", fill: f, fillOp: 1, at: 0.28 + i * 0.05 })),
      { t: "text", x: 320, y: 132, text: "Four, each with a job", ink: "fog", size: "13px", at: 0.46 },
      { t: "text", x: 30, y: 248, text: "Layout", ink: "fog", size: "13px", at: 0.5 },
      ...cols.map((x, i): Mark => ({ t: "rect", x, y: 274, w: 34, h: 128, tone: "dim", at: 0.52 + i * 0.02 })),
      { t: "rect", x: 30, y: 274, w: 202, h: 26, fill: "paper", fillOp: 0.4, at: 0.66 },
      { t: "rect", x: 30, y: 312, w: 118, h: 90, fill: "paper", fillOp: 0.13, at: 0.7 },
      { t: "rect", x: 156, y: 312, w: 118, h: 30, fill: "paper", fillOp: 0.22, at: 0.72 },
      { t: "rect", x: 156, y: 382, w: 42, h: 20, fill: "signal", fillOp: 1, at: 0.74 },
      { t: "text", x: 320, y: 248, text: "Voice", ink: "fog", size: "13px", at: 0.76 },
      { t: "text", x: 320, y: 276, text: "Precise, and quiet.", ink: "paper", size: "4.6cqw", cls: "type-title max-w-[40%] leading-[1.15]", at: 0.8 },
      { t: "text", x: 320, y: 380, text: "Words to use and avoid", ink: "fog", size: "13px", at: 0.88 },
    ],
  };
}

function website(): Sig {
  const zones = [
    { y: 130, n: 1, text: "Looks like the choice" },
    { y: 243, n: 2, text: "Gives reasons to believe" },
    { y: 349, n: 3, text: "The shortest way to buy" },
  ];
  return {
    caption: "A page is judged in a glance, then read for reasons, then used: designed in that order, and measured in your own browser further down this page.",
    marks: [
      { t: "rect", x: 40, y: 40, w: 320, h: 370, tone: "line", at: 0 },
      { t: "path", d: "M40 64L360 64", tone: "dim", w: 1, at: 0.06 },
      { t: "rect", x: 64, y: 92, w: 186, h: 16, fill: "paper", fillOp: 0.55, at: 0.12 },
      { t: "rect", x: 64, y: 116, w: 136, h: 16, fill: "paper", fillOp: 0.55, at: 0.15 },
      { t: "rect", x: 64, y: 150, w: 60, h: 18, fill: "signal", fillOp: 1, at: 0.18 },
      { t: "rect", x: 262, y: 92, w: 74, h: 76, tone: "dim", at: 0.2 },
      ...[64, 161, 258].map((x, i): Mark => ({ t: "rect", x, y: 206, w: 78, h: 74, tone: "dim", at: 0.3 + i * 0.04 })),
      { t: "rect", x: 64, y: 318, w: 272, h: 30, fill: "paper", fillOp: 0.12, at: 0.44 },
      { t: "rect", x: 64, y: 362, w: 76, h: 18, fill: "signal", fillOp: 1, at: 0.47 },
      ...zones.flatMap((z, i): Mark[] => [
        { t: "num", x: 360, y: z.y, n: z.n, at: 0.58 + i * 0.1 },
        { t: "text", x: 384, y: z.y, text: z.text, ink: "paper", v: "m", key: z.n, at: 0.6 + i * 0.1 },
      ]),
    ],
  };
}

function content(): Sig {
  const bars = Array.from({ length: 40 }, (_, i) => {
    const x = 40 + i * 6;
    const h = 10 + 46 * Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.37));
    return `M${x} ${150 - h / 2}L${x} ${150 + h / 2}`;
  }).join("");
  const passages = [
    [46, 82],
    [106, 142],
    [166, 196],
    [226, 262],
  ];
  const cols = [340, 400, 460, 520];
  const pieces = [2, 3, 2, 1];
  return {
    caption: "One recorded conversation with the person who knows the subject best, its marked passages cut into a month of pieces.",
    marks: [
      { t: "path", d: bars, tone: "line", w: 3, cap: "butt", at: 0, dur: 0.32 },
      { t: "text", x: 40, y: 206, text: "One 48-minute conversation", ink: "fog", size: "13px", at: 0.2 },
      ...passages.flatMap(([a, b], i): Mark[] => [
        { t: "path", d: `M${a} 112L${a} 104L${b} 104L${b} 112`, tone: "signal", w: 1.5, at: 0.3 + i * 0.05, dur: 0.12 },
      ]),
      { t: "path", d: "M288 150L326 150M318 143L326 150L318 157", tone: "paper", w: 1.5, at: 0.5, dur: 0.12 },
      ...cols.flatMap((x, i): Mark[] => [
        ...Array.from({ length: pieces[i] }, (_, j): Mark => ({ t: "rect", x, y: 110 + j * 38, w: 46, h: 30, tone: "line", fill: "paper", fillOp: 0.1, at: 0.6 + i * 0.06 + j * 0.03 })),
        { t: "text", x: x + 23, y: 230, text: `${i + 1}`, ink: "fog", align: "c", size: "13px", at: 0.62 + i * 0.06 },
      ]),
      { t: "text", x: 340, y: 256, text: "A month of pieces", ink: "paper", at: 0.86 },
    ],
  };
}

function video(): Sig {
  const crops = [
    { name: "1:1", w: 180 },
    { name: "4:5", w: 144 },
    { name: "9:16", w: 101 },
  ];
  const outs = [
    { name: "16:9", x: 40, w: 96, h: 54 },
    { name: "1:1", x: 176, w: 60, h: 60 },
    { name: "4:5", x: 276, w: 48, h: 60 },
    { name: "9:16", x: 364, w: 34, h: 60 },
  ];
  return {
    caption: "One take, lit for the widest frame and composed for the narrowest, so the film, the square, the post and the vertical clip all keep the subject.",
    marks: [
      { t: "rect", x: 40, y: 40, w: 320, h: 180, tone: "paper", at: 0 },
      ...crops.map((c, i): Mark => ({ t: "rect", x: 200 - c.w / 2, y: 40, w: c.w, h: 180, tone: i === 2 ? "line" : "dim", at: 0.1 + i * 0.05 })),
      { t: "path", d: "M182 148C186 112 214 112 214 136S198 168 182 148", tone: "signal", w: 2, at: 0.26, dur: 0.2 },
      { t: "node", x: 200, y: 128, s: 9, tone: "signal", at: 0.4 },
      { t: "text", x: 376, y: 130, text: "One take,", ink: "paper", v: "m", sub: { text: "every crop", ink: "paper" }, at: 0.42 },
      ...outs.flatMap((o, i): Mark[] => [
        { t: "path", d: `M200 220C200 268 ${o.x + o.w / 2} ${320 - o.h} ${o.x + o.w / 2} ${360 - o.h}`, tone: "dim", w: 1.25, at: 0.5 + i * 0.05, dur: 0.18 },
        { t: "rect", x: o.x, y: 360 - o.h, w: o.w, h: o.h, tone: "paper", at: 0.62 + i * 0.05 },
        { t: "node", x: o.x + o.w / 2, y: 360 - o.h / 2, s: 7, tone: "signal", at: 0.66 + i * 0.05 },
        { t: "text", x: o.x + o.w / 2, y: 372, text: o.name, ink: "fog", align: "c", size: "13px", at: 0.68 + i * 0.05 },
      ]),
    ],
  };
}

function ugc(): Sig {
  const holds = [52, 47, 41, 39, 37, 35, 33, 30, 27, 24];
  return {
    caption: "Ten hooks from one brief, each filmed by creators, ranked by how many viewers are still watching at three seconds; the top two go on, with paid behind them.",
    marks: [
      { t: "text", x: 40, y: 62, text: "Ten hooks from one brief", ink: "paper", v: "b", at: 0 },
      ...holds.flatMap((v, i): Mark[] => {
        const x = 40 + i * 54;
        const top = 360 - v * 3.2;
        const win = i < 2;
        return [
          { t: "rect", x, y: 80, w: 44, h: 78, tone: win ? "signal" : "line", at: 0.04 + i * 0.03 },
          { t: "rect", x, y: top, w: 44, h: 360 - top, fill: win ? "signal" : "paper", fillOp: win ? 1 : 0.28, at: 0.36 + i * 0.03 },
          { t: "text", x: x + 22, y: top - 6, text: `${v}%`, ink: win ? "signal" : "fog", align: "c", v: "b", size: "13px", at: 0.46 + i * 0.03 },
        ];
      }),
      { t: "path", d: "M36 360L574 360", tone: "line", w: 1, at: 0.34 },
      { t: "text", x: 40, y: 374, text: "Still watching at three seconds", ink: "fog", size: "13px", sub: { text: "The top two are reshot, with paid behind them", ink: "signal" }, at: 0.7 },
    ],
  };
}

function aeo(): Sig {
  const sources = [
    { y: 140, name: "A review site" },
    { y: 225, name: "A forum thread" },
    { y: 310, name: "Your site", you: true },
  ];
  return {
    caption: "An assistant answers a buyer’s question from a few sources it trusts. The work is to make your own site one of them.",
    marks: [
      { t: "node", x: 430, y: 80, s: 10, tone: "paper", at: 0 },
      { t: "text", x: 430, y: 62, text: "A buyer’s question", ink: "fog", align: "c", v: "b", size: "13px", at: 0.02 },
      { t: "path", d: "M430 85L430 214", tone: "line", w: 1.25, at: 0.08, dur: 0.2 },
      ...sources.flatMap((s, i): Mark[] => [
        { t: "node", x: 200, y: s.y, s: 9, tone: s.you ? "signal" : "paper", at: 0.2 + i * 0.05 },
        { t: "text", x: 185, y: s.y, text: s.name, ink: s.you ? "signal" : "fog", align: "r", v: "m", at: 0.22 + i * 0.05 },
        { t: "path", d: curve(205, s.y, 422, 225), tone: s.you ? "signal" : "line", w: s.you ? 2 : 1.25, at: 0.4 + i * 0.07, dur: 0.24 },
      ]),
      { t: "node", x: 430, y: 225, s: 16, tone: "paper", at: 0.72 },
      { t: "text", x: 452, y: 225, text: "One answer", ink: "paper", v: "m", at: 0.76 },
    ],
  };
}

function paid(): Sig {
  const xs = [40, 213, 386, 560];
  // shares of one budget, bottom to top, at weeks 1, 5, 9 and 13
  const shares = [
    [22, 30, 38, 45],
    [30, 28, 26, 24],
    [28, 25, 21, 18],
    [20, 17, 15, 13],
  ];
  const base = 370;
  const span = 260;
  const tops = shares.map((_, layer) => xs.map((_, t) => base - (shares.slice(0, layer + 1).reduce((a, s) => a + s[t], 0) / 100) * span));
  const area = (layer: number) => {
    const upper = xs.map((x, t) => [x, tops[layer][t]] as const);
    const lower = xs.map((x, t) => [x, layer ? tops[layer - 1][t] : base] as const).reverse();
    return `${poly([...upper, ...lower])}Z`;
  };
  return {
    caption: "One budget across your surfaces, moved every week toward wherever the next order costs least.",
    marks: [
      { t: "text", x: 40, y: 92, text: "One budget, moved every week", ink: "paper", v: "b", at: 0 },
      ...[3, 2, 1].map((layer, i): Mark => ({ t: "path", d: area(layer), tone: "line", w: 1, fill: "paper", fillOp: 0.06 + i * 0.05, fade: true, at: 0.06 + i * 0.08, dur: 0.24 })),
      { t: "path", d: area(0), tone: "signal", w: 1, fill: "brand", fillOp: 1, fade: true, at: 0.36, dur: 0.3 },
      { t: "text", x: 52, y: 346, text: "Where the next order costs least", ink: "paper", v: "m", at: 0.66 },
      ...["Week 1", "Week 5", "Week 9", "Week 13"].map((s, i): Mark => ({ t: "text", x: xs[i], y: 386, text: s, ink: "fog", align: i === 0 ? "l" : i === 3 ? "r" : "c", size: "13px", at: 0.04 + i * 0.02 })),
    ],
  };
}

function pr(): Sig {
  const rings = [
    { r: 70, label: "Week 1: trade press", at: [20, 110, 160, 340] },
    { r: 128, label: "Week 2: podcasts", at: [0, 50, 100, 140, 190, 225, 320] },
    { r: 186, label: "Week 3: AI answers", at: [10, 35, 60, 85, 115, 145, 170, 200, 230, 315, 340] },
  ];
  return {
    caption: "One story, placed well, keeps being repeated: trade press first, then podcasts, then the answers assistants give.",
    marks: [
      ...rings.flatMap((g, i): Mark[] => [
        { t: "ring", x: 300, y: 230, r: g.r, tone: "dim", at: 0.08 + i * 0.12, dur: 0.3 },
        { t: "text", x: 300, y: 230 - g.r - 8, text: g.label, ink: "fog", align: "c", v: "b", size: "13px", at: 0.2 + i * 0.12 },
        ...g.at.map((deg, j): Mark => {
          const [x, y] = polar(300, 230, g.r, deg);
          return { t: "node", x, y, s: 7, tone: "paper", at: 0.28 + i * 0.14 + j * 0.012 };
        }),
      ]),
      { t: "node", x: 300, y: 230, s: 14, tone: "signal", at: 0 },
      { t: "text", x: 300, y: 248, text: "One story", ink: "paper", align: "c", at: 0.04 },
    ],
  };
}

function analytics(): Sig {
  const sources = ["Ad platform A", "Ad platform B", "Email", "Your store", "Your CRM"];
  const ys = [95, 155, 215, 275, 335];
  return {
    caption: "Every source reports into one Ledger, so each order is counted once, the same way, everywhere.",
    marks: [
      ...sources.flatMap((s, i): Mark[] => [
        { t: "text", x: 176, y: ys[i], text: s, ink: "fog", align: "r", v: "m", at: 0.02 + i * 0.04 },
        { t: "node", x: 190, y: ys[i], s: 8, tone: "paper", at: 0.04 + i * 0.04 },
        { t: "path", d: curve(195, ys[i], 362, 215), tone: "line", w: 1.25, at: 0.2 + i * 0.05, dur: 0.24 },
      ]),
      { t: "rect", x: 362, y: 197, w: 36, h: 36, tone: "paper", fill: "graphite", at: 0.5 },
      { t: "text", x: 380, y: 186, text: "The Ledger", ink: "paper", align: "c", v: "b", at: 0.54 },
      { t: "path", d: "M398 215L501 215", tone: "signal", w: 2.5, at: 0.6, dur: 0.16 },
      { t: "node", x: 510, y: 215, s: 18, tone: "signal", at: 0.74 },
      { t: "text", x: 510, y: 238, text: "One number", ink: "paper", align: "c", sub: { text: "counted once" }, at: 0.78 },
    ],
  };
}


/* ------------------------------------------------- the rest of the site */

const SURFACES = ["AI answers", "Search", "Creators", "Reviews", "Social", "Word of mouth", "Press", "Stores"];

/** The homepage's shift, wide: the choice is made along the way, before the buyer arrives */
function shiftWide(): Sig {
  const xs = SURFACES.map((_, i) => 110 + i * 107);
  return {
    w: 1200,
    h: 440,
    marks: [
      { t: "path", d: "M40 310L1160 310", tone: "line", w: 1.25, at: 0, dur: 0.24 },
      { t: "text", x: 40, y: 348, text: "A need", ink: "fog", size: "13px", at: 0.02 },
      ...xs.flatMap((x, i): Mark[] => [
        { t: "node", x, y: 310, s: 9, tone: "paper", at: 0.08 + i * 0.03 },
        { t: "text", x, y: i % 2 ? 348 : 326, text: SURFACES[i], ink: "fog", align: "c", size: "13px", at: 0.1 + i * 0.03 },
      ]),
      { t: "path", d: "M940 70L940 330", tone: "paper", w: 1.5, at: 0.36, dur: 0.14 },
      { t: "text", x: 952, y: 326, text: "They arrive", ink: "paper", sub: { text: "where most marketing starts" }, at: 0.44 },
      { t: "path", d: "M40 300C360 298 520 120 940 100L1160 98", tone: "signal", w: 2.5, at: 0.4, dur: 0.36 },
      { t: "text", x: 380, y: 200, text: "How much of the choice is made", ink: "signal", size: "13px", v: "b", at: 0.58 },
      { t: "path", d: "M40 384L40 392L940 392L940 384", tone: "paper", w: 1, at: 0.74, dur: 0.14 },
      { t: "text", x: 490, y: 402, text: "Decided here, before they arrive", ink: "paper", align: "c", at: 0.82 },
    ],
  };
}

/** The same, on a phone: time runs down the page */
function shiftNarrow(): Sig {
  const ys = SURFACES.map((_, i) => 96 + i * 66);
  return {
    w: 600,
    h: 760,
    marks: [
      { t: "text", x: 560, y: 4, text: "How much of the choice is made", ink: "signal", align: "r", size: "13px", at: 0.5 },
      { t: "path", d: "M270 60L270 700", tone: "line", w: 1.25, at: 0, dur: 0.24 },
      { t: "text", x: 250, y: 60, text: "A need", ink: "fog", align: "r", v: "m", size: "13px", at: 0.02 },
      ...ys.flatMap((y, i): Mark[] => [
        { t: "node", x: 270, y, s: 10, tone: "paper", at: 0.08 + i * 0.03 },
        { t: "text", x: 250, y, text: SURFACES[i], ink: "fog", align: "r", v: "m", at: 0.1 + i * 0.03 },
      ]),
      { t: "path", d: "M280 80C282 320 528 380 548 620L548 700", tone: "signal", w: 2.5, at: 0.4, dur: 0.36 },
      { t: "path", d: "M40 640L560 640", tone: "paper", w: 1.5, at: 0.36, dur: 0.14 },
      { t: "text", x: 40, y: 654, text: "They arrive", ink: "paper", sub: { text: "where most marketing starts" }, at: 0.44 },
    ],
  };
}

/** /services: four engagements, each through all four layers, into one number */
function servicesSig(): Sig {
  const xs = [205, 315, 425, 535];
  const names = ["Reach", "Reputation", "Mindshare", "Revenue"];
  const layers = ["Narrative", "Create", "Distribute", "Measure"];
  const ys = [124, 182, 240, 298];
  return {
    caption: "Four engagements, each running on all four layers of one system, built from ten disciplines and answering to one number.",
    marks: [
      ...layers.flatMap((l, i): Mark[] => [
        { t: "rect", x: 150, y: ys[i] - 16, w: 420, h: 32, tone: "dim", at: 0.04 + i * 0.04 },
        { t: "text", x: 138, y: ys[i], text: l, ink: "fog", align: "r", v: "m", size: "13px", at: 0.06 + i * 0.04 },
      ]),
      ...xs.flatMap((x, i): Mark[] => [
        { t: "text", x, y: i % 2 ? 38 : 58, text: names[i], ink: "paper", align: "c", v: "b", size: "13px", at: 0.2 + i * 0.04 },
        { t: "node", x, y: 76, s: 9, tone: "paper", at: 0.22 + i * 0.04 },
        { t: "path", d: `M${x} 80L${x} 330C${x} 370 370 360 370 398`, tone: "line", w: 1.25, at: 0.3 + i * 0.05, dur: 0.3 },
        ...ys.map((y, j): Mark => ({ t: "node", x, y, s: 6, tone: "paper", at: 0.42 + i * 0.05 + j * 0.03 })),
      ]),
      { t: "node", x: 370, y: 404, s: 14, tone: "signal", at: 0.78 },
      { t: "text", x: 390, y: 404, text: "One number", ink: "paper", v: "m", at: 0.82 },
    ],
  };
}

/** /method: one engagement as a loop */
function methodSig(): Sig {
  const c = [290, 225] as const;
  const r = 110;
  const stops = [
    { deg: 270, name: "Diagnose", sub: "find where it breaks", side: "t" },
    { deg: 0, name: "Design", sub: "rebuild the story", side: "r" },
    { deg: 90, name: "Deploy", sub: "launch where buyers are", side: "b" },
    { deg: 180, name: "Compound", sub: "run it, read it", side: "l" },
  ] as const;
  const at = (deg: number) => polar(c[0], c[1], r, deg);
  const arc = (a: number, b: number) => {
    const [x1, y1] = at(a);
    const [x2, y2] = at(b);
    return `M${x1.toFixed(1)} ${y1.toFixed(1)}A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  };
  return {
    caption: "One engagement as a loop: the Diagnostic first, then the story, then the work where buyers are, and what the Ledger reads goes back into the next quarter.",
    marks: [
      { t: "path", d: arc(276, 354), tone: "line", w: 1.5, at: 0.1, dur: 0.16 },
      { t: "path", d: arc(6, 84), tone: "line", w: 1.5, at: 0.24, dur: 0.16 },
      { t: "path", d: arc(96, 174), tone: "line", w: 1.5, at: 0.38, dur: 0.16 },
      { t: "path", d: arc(186, 264), tone: "signal", w: 2.25, at: 0.52, dur: 0.18 },
      { t: "path", d: (() => { const [x, y] = at(264); return `M${(x - 9).toFixed(1)} ${(y - 6).toFixed(1)}L${x.toFixed(1)} ${y.toFixed(1)}L${(x - 7).toFixed(1)} ${(y + 8).toFixed(1)}`; })(), tone: "signal", w: 2, at: 0.68, dur: 0.06 },
      ...stops.flatMap((s, i): Mark[] => {
        const [x, y] = at(s.deg);
        const lab: Mark =
          s.side === "t"
            ? { t: "text", x, y: y - 16, text: s.name, ink: "paper", align: "c", v: "b", sub: { text: s.sub }, at: 0.04 + i * 0.14 }
            : s.side === "b"
              ? { t: "text", x, y: y + 16, text: s.name, ink: "paper", align: "c", sub: { text: s.sub }, at: 0.04 + i * 0.14 }
              : { t: "text", x: s.side === "r" ? x + 18 : x - 18, y, text: s.name, ink: "paper", align: s.side === "r" ? "l" : "r", v: "m", sub: { text: s.sub }, at: 0.04 + i * 0.14 };
        return [{ t: "node", x, y, s: 12, tone: i === 0 ? "signal" : "paper", at: 0.02 + i * 0.14 }, lab];
      }),
      { t: "text", x: c[0], y: c[1], text: "One number", ink: "paper", align: "c", v: "m", sub: { text: "read every month" }, at: 0.74 },
    ],
  };
}

/** /industries: four kinds of business, four paths to a purchase, four numbers */
function industriesSig(): Sig {
  const kinds = [
    { name: "Consumer brands", n: "Orders", last: "Your site or a store" },
    { name: "Physical products", n: "Sell-through", last: "The shelf" },
    { name: "B2B technology", n: "Demos with buyers who fit", last: "Your site" },
    { name: "Consumer technology", n: "Users who stay", last: "The first week" },
  ];
  const q = [
    [20, 20],
    [310, 20],
    [20, 235],
    [310, 235],
  ];
  return {
    caption: "Four kinds of growing business, each with its own path to a purchase and its own number: the one it runs on, agreed on day one.",
    marks: [
      { t: "path", d: "M300 20L300 430", tone: "dim", w: 1, at: 0 },
      { t: "path", d: "M20 225L580 225", tone: "dim", w: 1, at: 0.04 },
      ...kinds.flatMap((k, i): Mark[] => {
        const [x, y] = q[i];
        const nodes = [x + 24, x + 101, x + 178, x + 255];
        return [
          { t: "text", x: x + 20, y: y + 22, text: k.name, ink: "paper", sub: { text: k.n }, at: 0.08 + i * 0.08 },
          { t: "path", d: `M${nodes[0]} ${y + 140}L${nodes[3]} ${y + 140}`, tone: "line", w: 1.25, at: 0.2 + i * 0.08, dur: 0.18 },
          ...nodes.map((nx, j): Mark => ({ t: "node", x: nx, y: y + 140, s: j === 3 ? 12 : 8, tone: j === 3 ? "signal" : "paper", at: 0.26 + i * 0.08 + j * 0.03 })),
          { t: "text", x: nodes[3] + 6, y: y + 158, text: k.last, ink: "signal", align: "r", size: "13px", at: 0.42 + i * 0.08 },
        ];
      }),
    ],
  };
}

/** /about: ten suppliers and ten numbers, or one team and one */
function aboutSig(): Sig {
  const loose: P[] = [[70, 112], [150, 96], [232, 128], [92, 190], [190, 176], [250, 222], [62, 272], [146, 256], [224, 302], [112, 344]];
  const dirs = [30, 160, 300, 220, 80, 20, 140, 260, 340, 110];
  const tidy: P[] = Array.from({ length: 10 }, (_, i) => [350 + (i % 2) * 70, 110 + Math.floor(i / 2) * 58] as const);
  return {
    caption: "Ten suppliers, each answering for a number of its own. Plurel is one senior team that answers for one.",
    marks: [
      { t: "text", x: 40, y: 40, text: "Ten suppliers, ten numbers", ink: "fog", size: "13px", at: 0 },
      { t: "text", x: 340, y: 40, text: "One team, one number", ink: "paper", at: 0.4 },
      { t: "path", d: "M300 30L300 420", tone: "dim", w: 1, at: 0.02 },
      ...loose.flatMap(([x, y], i): Mark[] => {
        const [ex, ey] = polar(x, y, 26, dirs[i]);
        return [
          { t: "node", x, y, s: 8, tone: "paper", at: 0.04 + i * 0.025 },
          { t: "path", d: `M${x} ${y}L${ex.toFixed(1)} ${ey.toFixed(1)}`, tone: "line", w: 1.25, at: 0.12 + i * 0.025, dur: 0.1 },
          { t: "node", x: ex, y: ey, s: 5, tone: "dim", at: 0.16 + i * 0.025 },
        ];
      }),
      ...tidy.flatMap(([x, y], i): Mark[] => [
        { t: "path", d: curve(x + 4, y, 520, 225), tone: "line", w: 1.25, at: 0.5 + i * 0.02, dur: 0.18 },
        { t: "node", x, y, s: 8, tone: "paper", at: 0.46 + i * 0.02 },
      ]),
      { t: "node", x: 520, y: 225, s: 16, tone: "signal", at: 0.8 },
      { t: "text", x: 520, y: 248, text: "One number", ink: "paper", align: "c", at: 0.84 },
    ],
  };
}

/** /diagnostic: a sample read, six parts scored out of ten */
function diagnosticSig(): Sig {
  const parts = [
    ["Market", 8],
    ["Narrative", 5],
    ["Website", 4],
    ["Assets", 6],
    ["Distribution", 3],
    ["Measurement", 2],
  ] as const;
  const weakest = Math.min(...parts.map((p) => p[1]));
  return {
    caption: "A sample read, not a client: the six parts of a company’s distribution, each scored out of ten, and the weakest fixed first.",
    marks: [
      { t: "text", x: 40, y: 28, text: "A sample read: 28 out of 60", ink: "fog", size: "13px", at: 0 },
      ...parts.flatMap(([name, score], i): Mark[] => {
        const y = 92 + i * 60;
        const low = score === weakest;
        return [
          { t: "text", x: 40, y: y - 10, text: name, ink: low ? "signal" : "paper", v: "b", at: 0.04 + i * 0.05 },
          { t: "rect", x: 40, y, w: 440, h: 12, fill: "paper", fillOp: 0.07, at: 0.06 + i * 0.05 },
          { t: "rect", x: 40, y, w: (score / 10) * 440, h: 12, fill: low ? "signal" : "paper", fillOp: low ? 1 : 0.6, at: 0.2 + i * 0.07 },
          { t: "text", x: 560, y: y + 6, text: `${score}/10`, ink: low ? "signal" : "fog", align: "r", v: "m", size: "13px", at: 0.3 + i * 0.07 },
        ];
      }),
    ],
  };
}

const SIGS: Record<string, () => Sig> = {
  reach,
  reputation,
  mindshare,
  revenue,
  "fractional-cmo": cmo,
  branding,
  "website-design": website,
  "content-marketing": content,
  "video-photo": video,
  "ugc-creators": ugc,
  "aeo-seo": aeo,
  "paid-media": paid,
  "pr-reputation": pr,
  "analytics-martech": analytics,
  "shift-wide": shiftWide,
  "shift-narrow": shiftNarrow,
  services: servicesSig,
  method: methodSig,
  industries: industriesSig,
  about: aboutSig,
  diagnostic: diagnosticSig,
};

/* ------------------------------------------------------------- the drawing */

const MOTION = "screen and (prefers-reduced-motion: no-preference)";
function subscribe(cb: () => void) {
  const mq = window.matchMedia(MOTION);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const motionNow = () => window.matchMedia(MOTION).matches;

/** How far the drawing is drawn, 0 to 1: from `delay` after it is in view, over `ms` */
function useSigDraw(ref: { current: Element | null }, ms: number, delay: number) {
  const motion = useSyncExternalStore(subscribe, motionNow, () => false);
  const [k, setK] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !motion) return;
    let raf = 0;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => {
          const t0 = performance.now();
          const frame = (now: number) => {
            const v = Math.min(1, (now - t0) / ms);
            setK(v);
            if (v < 1) raf = requestAnimationFrame(frame);
          };
          raf = requestAnimationFrame(frame);
        }, delay);
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [ref, motion, ms, delay]);
  return { k: motion ? (k ?? 0) : 1, started: motion && k !== null };
}

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const ALIGN = { l: "", c: "-translate-x-1/2", r: "-translate-x-full" } as const;
const VALIGN = { t: "", m: "-translate-y-1/2", b: "-translate-y-full" } as const;
const MARK = "flex size-[18px] items-center justify-center bg-paper text-[13px] font-medium leading-none tabular-nums text-ink";

export function Signature({ k: slug, delay = 0, className = "" }: { k: string; delay?: number; className?: string }) {
  const sig = SIGS[slug]?.();
  const box = useRef<HTMLDivElement>(null);
  const { k, started } = useSigDraw(box, 2400, delay);
  if (!sig) return null;
  const W = sig.w ?? 600;
  const H = sig.h ?? 450;
  // every mark is whole once the drawing is done, whatever its timing
  const p = (m: Timed) => (k >= 1 ? 1 : clamp((k - m.at) / (m.dur ?? 0.2)));
  const keyed = sig.marks.filter((m): m is Extract<Mark, { t: "text" }> => m.t === "text" && m.key != null);

  return (
    <figure className={`@container m-0 ${className}`}>
      <div ref={box} data-sig="" data-ready={started || undefined} aria-hidden className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible" fill="none">
          {sig.marks.map((m, i) => {
            const v = p(m);
            if (m.t === "path") {
              const [c, o] = COLOR[m.tone ?? "line"];
              const fill = m.fill ? COLOR[m.fill] : null;
              const draw = !m.fade && !m.fill;
              return (
                <path
                  key={i}
                  d={m.d}
                  pathLength={draw ? 1 : undefined}
                  stroke={c}
                  strokeOpacity={o}
                  strokeWidth={m.w ?? 1.25}
                  strokeLinecap={m.cap ?? "square"}
                  strokeDasharray={draw ? "1 1" : undefined}
                  strokeDashoffset={draw ? 1 - v : undefined}
                  fill={fill ? fill[0] : "none"}
                  fillOpacity={fill ? (m.fillOp ?? fill[1]) : undefined}
                  opacity={draw ? (v > 0 ? 1 : 0) : v}
                />
              );
            }
            if (m.t === "ring") {
              const [c, o] = COLOR[m.tone ?? "dim"];
              return <circle key={i} cx={m.x} cy={m.y} r={m.r} pathLength={1} stroke={c} strokeOpacity={o} strokeWidth={1.25} strokeDasharray="1 1" strokeDashoffset={1 - v} opacity={v > 0 ? 1 : 0} />;
            }
            if (m.t === "rect") {
              const stroke = m.tone ? COLOR[m.tone] : null;
              const fill = m.fill ? COLOR[m.fill] : null;
              return (
                <rect
                  key={i}
                  x={m.x}
                  y={m.y}
                  width={m.w}
                  height={m.h}
                  stroke={stroke ? stroke[0] : "none"}
                  strokeOpacity={stroke ? stroke[1] : undefined}
                  strokeWidth={1.25}
                  fill={fill ? fill[0] : "none"}
                  fillOpacity={fill ? (m.fillOp ?? fill[1]) : undefined}
                  opacity={v}
                />
              );
            }
            if (m.t === "node") {
              const s = m.s ?? 8;
              const [c, o] = COLOR[m.tone ?? "paper"];
              return <rect key={i} x={m.x - s / 2} y={m.y - s / 2} width={s} height={s} fill={c} fillOpacity={o} opacity={v} />;
            }
            return null;
          })}
        </svg>
        {sig.marks.map((m, i) => {
          if (m.t === "num") {
            return (
              <span key={i} className={`${MARK} absolute -translate-x-1/2 -translate-y-1/2`} style={{ left: pct(m.x, W), top: pct(m.y, H), opacity: p(m) }}>
                {m.n}
              </span>
            );
          }
          if (m.t !== "text") return null;
          const style: CSSProperties = { left: pct(m.x, W), top: pct(m.y, H), opacity: p(m), fontSize: m.size };
          return (
            <span
              key={i}
              className={`absolute whitespace-nowrap leading-[1.2] ${m.size ? "" : m.ink === "fog" ? "text-[13px]" : "text-[14px]"} ${INK[m.ink ?? "paper"]} ${ALIGN[m.align ?? "l"]} ${VALIGN[m.v ?? "t"]} ${m.cls ?? ""} ${m.key != null ? "hidden @md:block" : ""}`}
              style={style}
            >
              {m.text}
              {m.sub && <span className={`block text-[13px] ${INK[m.sub.ink ?? "fog"]}`}>{m.sub.text}</span>}
            </span>
          );
        })}
      </div>
      {keyed.length > 0 && (
        <ol className="mt-4 grid gap-2 @md:hidden">
          {keyed.map((m) => (
            <li key={m.key} className="flex items-center gap-3 text-[15px] leading-[1.35] text-paper">
              <span aria-hidden className={MARK}>
                {m.key}
              </span>
              {m.text}
            </li>
          ))}
        </ol>
      )}
      {sig.caption && <figcaption className="mt-4 max-w-[52ch] text-[13px] leading-[1.5] text-fog">{sig.caption}</figcaption>}
    </figure>
  );
}
