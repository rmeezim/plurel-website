/*
  The services fold, as pure math. No imports and no DOM, so the whole
  timeline can be tested on its own.

  Three geometric states for the nine cells of the Plurel mark:
    R0  room  — the manifesto's red room, cut into 25/50/25% bands, no gaps
    R1  plan  — nine panels on the page GRID, 2:4:2 with grid gutters
    R2  mark  — the exact mark, at its resting size beside the headline
  frameAt(p) turns scroll progress p (0..1) into every value the component
  writes. It holds no state, so scrolling backwards, deep links, resize and
  rotation all land on the right frame.
*/

/**
 * When the fold runs. Must stay identical to the gate in globals.css
 * (search for "FOLD_QUERY").
 */
export const FOLD_QUERY =
  "(prefers-reduced-motion: no-preference) and (forced-colors: none) and (min-width: 22.5rem) and (max-width: 39.99rem) and (min-height: 35rem), " +
  "(prefers-reduced-motion: no-preference) and (forced-colors: none) and (min-width: 40rem) and (min-height: 40rem)";

/**
 * Service k (0..7, in site order) sits in mark cell CLOCKWISE[k]:
 * top-left, top, top-right, right, bottom-right, bottom, bottom-left, left.
 * The center cell (4) is the visitor's brand.
 */
export const CLOCKWISE = [0, 1, 2, 5, 8, 7, 6, 3] as const;

/** Timeline, in progress units */
export const T = {
  split: [0.06, 0.28],
  footIn: [0.24, 0.3],
  labelsStart: 0.26,
  labelStep: 0.018,
  labelDur: 0.06,
  namesOut: [0.54, 0.62],
  roomOut: [0.54, 0.64],
  fold: [0.54, 0.84],
  centerIn: [0.78, 0.84],
  headIn: [0.8, 0.88],
  footOut: [0.78, 0.84],
  handoff: 0.84,
  cellsOut: [0.84, 0.88],
  h2In: [0.84, 0.94],
  captionIn: [0.86, 0.94],
  rest: 0.92,
} as const;

export type Rect = { x: number; y: number; w: number; h: number };
export type Point = { x: number; y: number };
export type Band = readonly [number, number];
type Cell = readonly [number, number, number, number];

export type Layout = {
  dpr: number;
  /** Label inset inside a panel during the plan */
  pad: number;
  /** Nine rects each, in mark-cell order */
  R0: Rect[];
  R1: Rect[];
  R2: Rect[];
  /** Resting offset of each service index from its cell's top-left, clockwise k order */
  off: Point[];
  /** Resting offset of "Your brand" from the center cell's top-left */
  offC: Point;
  /** Unscaled size of the "Your brand." room line */
  room: { w: number; h: number };
};

export type Frame = {
  cells: { rect: Rect; opacity: number }[];
  backdrop: number;
  labels: { x: number; y: number; opacity: number }[];
  nameOpacity: number;
  center: { x: number; y: number; opacity: number };
  roomLine: { x: number; y: number; s: number; opacity: number };
  foot: number;
  head: number;
  h2: { opacity: number; y: number };
  art: number;
  caption: number;
  rest: boolean;
};

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** Progress through [a, b], clamped to 0..1 */
export const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const inOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const outCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
});

/** Round every edge to the device pixel grid so gutters never shimmer */
export function snapRect(r: Rect, dpr: number): Rect {
  const s = (v: number) => Math.round(v * dpr) / dpr;
  const x = s(r.x);
  const y = s(r.y);
  return { x, y, w: s(r.x + r.w) - x, h: s(r.y + r.h) - y };
}

/** Which of the three bands a mark coordinate (0, 3 or 8) falls in */
const band = (u: number) => (u === 0 ? 0 : u === 3 ? 1 : 2);

function fromBands(xs: readonly Band[], ys: readonly Band[], cells: readonly Cell[]): Rect[] {
  return cells.map(([cx, cy]) => {
    const [x0, x1] = xs[band(cx)];
    const [y0, y1] = ys[band(cy)];
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  });
}

/**
 * R0: the stage cut 25/50/25 on both axes with no gaps. Rows split the
 * visible (svh) height; the bottom row runs on to the full (lvh) floor.
 */
export function roomRects(W: number, Hs: number, H: number, cells: readonly Cell[]): Rect[] {
  const xs: Band[] = [
    [0, 0.25 * W],
    [0.25 * W, 0.75 * W],
    [0.75 * W, W],
  ];
  const ys: Band[] = [
    [0, 0.25 * Hs],
    [0.25 * Hs, 0.75 * Hs],
    [0.75 * Hs, H],
  ];
  return fromBands(xs, ys, cells);
}

/** R1: panels on measured GRID bands */
export function planRects(xs: readonly Band[], ys: readonly Band[], cells: readonly Cell[]): Rect[] {
  return fromBands(xs, ys, cells);
}

/** R2: the exact mark inside the measured art box (side S) */
export function markRects(art: Rect, cells: readonly Cell[]): Rect[] {
  const u = art.w / 10;
  return cells.map(([cx, cy, w, h]) => ({
    x: art.x + cx * u,
    y: art.y + cy * u,
    w: w * u,
    h: h * u,
  }));
}

/** The whole timeline: progress in, every written value out */
export function frameAt(p: number, L: Layout): Frame {
  const e1 = inOut(seg(p, T.split[0], T.split[1]));
  const e2 = inOut(seg(p, T.fold[0], T.fold[1]));
  const cellOpacity = 1 - seg(p, T.cellsOut[0], T.cellsOut[1]);

  // Cells are snapped to device pixels so gutters never shimmer. Text
  // (labels, "Your brand", the room line) follows the unsnapped geometry,
  // so it glides and lands exactly on the resting overlay at the handoff.
  const raw = L.R0.map((r0, i) => lerpRect(lerpRect(r0, L.R1[i], e1), L.R2[i], e2));
  const cells = raw.map((rr) => ({ rect: snapRect(rr, L.dpr), opacity: cellOpacity }));

  // The backdrop hides sub-pixel seams in the room; it drops the moment a
  // real gutter (one device pixel) opens.
  const sn = cells.map((c) => c.rect);
  const gutterX = sn[1].x - (sn[0].x + sn[0].w);
  const gutterY = sn[3].y - (sn[0].y + sn[0].h);
  const backdrop = Math.min(gutterX, gutterY) < 1 / L.dpr ? 1 : 0;

  const handedOff = p >= T.handoff;
  const labels = CLOCKWISE.map((c, k) => {
    const a = T.labelsStart + T.labelStep * k;
    const t = outCubic(seg(p, a, a + T.labelDur));
    return {
      x: raw[c].x + lerp(L.pad, L.off[k].x, e2),
      y: raw[c].y + lerp(L.pad, L.off[k].y, e2) + 12 * (1 - t),
      opacity: handedOff ? 0 : t,
    };
  });

  const r4 = raw[4];
  const s = (r4.w / L.R0[4].w) * lerp(1, 0.6, e2);
  const h2t = outCubic(seg(p, T.h2In[0], T.h2In[1]));

  return {
    cells,
    backdrop,
    labels,
    nameOpacity: 1 - seg(p, T.namesOut[0], T.namesOut[1]),
    center: {
      x: r4.x + L.offC.x,
      y: r4.y + L.offC.y,
      opacity: handedOff ? 0 : seg(p, T.centerIn[0], T.centerIn[1]),
    },
    roomLine: {
      x: r4.x + (r4.w - L.room.w * s) / 2,
      y: r4.y + (r4.h - L.room.h * s) / 2,
      s,
      opacity: 1 - seg(p, T.roomOut[0], T.roomOut[1]),
    },
    foot: Math.min(seg(p, T.footIn[0], T.footIn[1]), 1 - seg(p, T.footOut[0], T.footOut[1])),
    head: seg(p, T.headIn[0], T.headIn[1]),
    h2: { opacity: h2t, y: 16 * (1 - h2t) },
    art: handedOff ? 1 : 0,
    caption: seg(p, T.captionIn[0], T.captionIn[1]),
    rest: p >= T.rest,
  };
}
