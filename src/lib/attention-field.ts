import { MARK_CELLS } from "@/lib/mark";

/*
  The Attention Field: the engine behind the section that follows the hero
  (src/components/home/attention-field.tsx).

  One canvas of dots tells the distribution story in five scroll-scrubbed
  stages:
    NOISE   attention drifts in nine pools, one per surface
    STORY   the dots condense into the Plurel mark, which opens into the
            formats one story is cut into (outlined cards, crop marks)
    LANES   the cards fly to the starts of nine lanes (owned, earned, paid)
            and become their markers; each lane pours out of its marker
    SYSTEM  the lanes bend into one funnel; what passes through turns red
    DEMAND  the red stream rises along one curve: qualified demand as an
            index over baseline (illustrative, never inquiries or pipeline)

  Framework-free. mountAttentionField finds its parts inside `root` by data
  attributes, draws only while on screen in a visible tab (no pause control,
  as with the hero and footer glass), caps DPR at 2, sizes the particle
  count to the area, and reads only the track's rect per frame. Unpinned
  (reduced motion, or a screen too short to pin) it draws one still frame
  of the whole system instead: lanes, funnel and the rising curve.
*/

/**
 * When the section pins and scrubs. Must stay identical to the media query
 * in attention-field.module.css (search for AF_PIN_QUERY).
 */
export const AF_PIN_QUERY =
  "(prefers-reduced-motion: no-preference) and (min-width: 360px) and (min-height: 560px)";

export type AfIcon = "search" | "reel" | "film" | "ai" | "press" | "feed" | "creator" | "ooh" | "events";

export const AF_STAGES = [
  {
    tab: "Noise",
    title: "Attention is everywhere.",
    line: "Search, feeds, AI answers, creators, press, the room you’re not in.",
  },
  {
    tab: "Story",
    title: "One story, cut for every surface.",
    line: "Narrative first, then every format it needs.",
  },
  {
    tab: "Lanes",
    title: "Be where it gathers.",
    line: "Placed on every relevant surface: owned, earned and paid.",
  },
  {
    tab: "System",
    title: "Run it as one system.",
    line: "One narrative, one engine, one set of numbers.",
  },
  {
    tab: "Demand",
    title: "Qualified demand.",
    line: "The one number we answer for, in boardrooms and at checkout.",
  },
] as const;

export const AF_GROUPS = ["Owned", "Earned", "Paid"] as const;

type Lane = {
  name: string;
  group: 0 | 1 | 2;
  /** Share of the field's attention */
  share: number;
  /** Flow speed, lane lengths per second */
  speed: number;
  /** Share of the lane that qualifies through the funnel */
  qual: number;
  /** Its marker at the head of the lane */
  icon: AfIcon;
};

/** Nine lanes, like the hero's nine flutes */
export const AF_LANES: readonly Lane[] = [
  { name: "Search", group: 0, share: 0.15, speed: 0.03, qual: 0.28, icon: "search" },
  { name: "Social", group: 0, share: 0.14, speed: 0.025, qual: 0.17, icon: "reel" },
  { name: "Video", group: 0, share: 0.11, speed: 0.021, qual: 0.19, icon: "film" },
  { name: "AI answers", group: 1, share: 0.12, speed: 0.036, qual: 0.34, icon: "ai" },
  { name: "Press", group: 1, share: 0.07, speed: 0.019, qual: 0.27, icon: "press" },
  { name: "UGC", group: 1, share: 0.1, speed: 0.028, qual: 0.23, icon: "feed" },
  { name: "Creators", group: 2, share: 0.11, speed: 0.033, qual: 0.25, icon: "creator" },
  { name: "Paid media", group: 2, share: 0.12, speed: 0.041, qual: 0.22, icon: "ooh" },
  { name: "Events", group: 2, share: 0.08, speed: 0.017, qual: 0.31, icon: "events" },
];

type Card = { key: AfIcon; name: string; spec: string; size: string; ar: number };

/** The formats one story is cut into; each lands on the lane with its icon */
export const AF_CARDS: readonly Card[] = [
  { key: "reel", name: "Reel", spec: "9:16", size: "1080×1920", ar: 9 / 16 },
  { key: "film", name: "Film", spec: "16:9", size: "3840×2160", ar: 16 / 9 },
  { key: "ai", name: "AI answer", spec: "(cited)", size: "Source [1]", ar: 3 / 2 },
  { key: "feed", name: "Feed", spec: "1:1", size: "1080×1080", ar: 1 },
  { key: "creator", name: "Creator cut", spec: "4:5", size: "1080×1350", ar: 4 / 5 },
  { key: "ooh", name: "Out of home", spec: "48-sheet", size: "6096×3048", ar: 2 },
];

/** The demand index the curve reaches (×, vs. baseline 1.0) */
export const AF_INDEX = 3.2;

/* ---------- math ---------- */
const TAU = Math.PI * 2;
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const seg = (v: number, a: number, b: number) => clamp((v - a) / (b - a), 0, 1);
const ss = (a: number, b: number, v: number) => {
  const t = seg(v, a, b);
  return t * t * (3 - 2 * t);
};
const eio = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const sm5 = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const frac = (v: number) => v - Math.floor(v);
const mod = (v: number, m: number) => ((v % m) + m) % m;
const eoc = (t: number) => 1 - (1 - t) * (1 - t) * (1 - t);
/** The demand curve's shape, 0..1 over 0..1 */
const CURVE_K = 2.4;
const curveF = (s: number) => (Math.exp(CURVE_K * s) - 1) / (Math.exp(CURVE_K) - 1);

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- story constants ---------- */
const NL = AF_LANES.length;
/** Lane rows, with a half-row gap between the three groups */
const SLOT = [0, 1, 2, 3.5, 4.5, 5.5, 7, 8, 9];
const SPAN = 9;
const GROUP_RANGE: readonly [number, number][] = [
  [0, 2],
  [3, 5],
  [6, 8],
];
/** Where each surface's attention pools in the noise (fractions of the stage) */
const POOLS_DESK: readonly [number, number][] = [
  [0.15, 0.27], [0.37, 0.69], [0.79, 0.6], [0.61, 0.24], [0.56, 0.81],
  [0.33, 0.37], [0.88, 0.33], [0.83, 0.82], [0.1, 0.62],
];
const POOLS_PHONE: readonly [number, number][] = [
  [0.1, 0.2], [0.58, 0.31], [0.12, 0.44], [0.48, 0.15], [0.58, 0.58],
  [0.16, 0.69], [0.62, 0.45], [0.14, 0.84], [0.6, 0.79],
];
/** Marker sizes at a lane's head, px at desktop scale */
const ICON: Record<AfIcon, readonly [number, number]> = {
  search: [30, 11],
  reel: [12, 21],
  film: [30, 17],
  ai: [26, 17],
  press: [16, 21],
  feed: [18, 18],
  creator: [16, 20],
  ooh: [32, 16],
  events: [24, 16],
};
const CARD_LANE = AF_CARDS.map((c) => AF_LANES.findIndex((l) => l.icon === c.key));

/* Scroll timeline, p in [0, 1]: five stages of 0.2. Each heading rises in at
   its stage's start, holds while the visual changes under it (dimmed), then
   lifts away and the visual holds the stage on its own. */
// The two handoffs play clear of type: the STORY heading has lifted before
// the mark stamps, and the cards fly to their lanes before LANES rises.
// LANES lifts early so the nine labelled lanes hold the stage on their own
// (0.525 to 0.6) before SYSTEM rises and bends them.
const HEAD: readonly [number, number, number, number][] = [
  [-1, 0, 0.06, 0.1],
  [0.165, 0.195, 0.225, 0.25],
  [0.45, 0.47, 0.5, 0.525],
  [0.6, 0.63, 0.685, 0.715],
  [0.785, 0.815, 0.865, 0.9],
];
// STORY gets the longest stretch: its cards need a hold of their own
const STAGE_AT = [0, 0.18, 0.385, 0.6, 0.8, 1.0001];
/** Where a tab lands: its heading, fully in */
const TAB_TO = [0, 0.21, 0.485, 0.66, 0.84];
/** The running head's readout per stage: fixed words, never a device count */
const READ = ["Signals", "6 formats", "9 surfaces", "1 narrative", "1 number"];
/* The flight to the lanes: the cards leave one after another over KC0..KC1,
   in an order chosen per layout so that no card crosses another */
const KC0 = 0.385, KC1 = 0.45, FL_STG = 0.06, FL_DUR = 0.7;
/** When a lane with no card opens: its drawn marker is in */
const HEAD_NEW = 0.445;
/** A dot's run into its lane: to the head, then out along the lane (in p) */
const IN_T = 0.035, OUT_T = 0.032, HEAD_JIT = 0.024;

/* ---------- palette ---------- */
const FOG = "185,188,194";
const PAPER = "251,250,246";
const SIG = "232,86,78";
const rgba = (c: string, a: number) => `rgba(${c},${clamp(a, 0, 1).toFixed(3)})`;

// Particle styles: buckets of colour x alpha, so a frame sets fillStyle
// about a hundred times rather than once per dot
const PAL: number[][] = [];
{
  const f = [185, 188, 194], s = [232, 86, 78];
  for (let i = 0; i < 6; i++) PAL.push(f.map((c, j) => Math.round(lerp(c, s[j], i / 5))));
  PAL.push([251, 250, 246], [242, 201, 191]); // 6 paper, 7 blush
}
const C_SIG = 5;
const C_PAPER = 6;
const AL = 16;
const STYLES: string[] = [];
for (let c = 0; c < PAL.length; c++) {
  for (let a = 0; a < AL; a++) {
    const al = Math.pow(a / (AL - 1), 2);
    STYLES.push(`rgba(${PAL[c][0]},${PAL[c][1]},${PAL[c][2]},${al.toFixed(4)})`);
  }
}
const NB = STYLES.length;

type Rect = { x: number; y: number; w: number; h: number };
type LabelCache = { x: number; y: number; o: number };

/**
 * Mounts the field inside `root` (the section). Returns the cleanup.
 * Reduced motion is read live (a toggle needs no remount) and always gets
 * the still frame.
 */
export function mountAttentionField(root: HTMLElement): () => void {
  const one = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel);
  const all = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

  const trackQ = one("[data-af-track]");
  const figQ = one("[data-af-fig]");
  const canvasQ = one<HTMLCanvasElement>("[data-af-canvas]");
  const steps = all("[data-af-step]");
  const tabs = all("[data-af-tab]");
  const progs = all("[data-af-prog]");
  const laneEls = all("[data-af-lane]");
  const grpEls = all("[data-af-group]");
  const cardEls = all("[data-af-card]");
  const qEls = all("[data-af-q]");
  const storyQ = one("[data-af-story]");
  const throatQ = one("[data-af-throat]");
  const baseQ = one("[data-af-base]");
  const capQ = one("[data-af-cap]");
  const readoutQ = one("[data-af-readout]");
  const valueQ = one("[data-af-value]");
  const readEl = one("[data-af-read]");
  const ctxQ = canvasQ ? canvasQ.getContext("2d") : null;
  if (
    !trackQ || !figQ || !canvasQ || !ctxQ || !storyQ || !throatQ || !baseQ || !capQ ||
    !readoutQ || !valueQ || steps.length !== AF_STAGES.length || tabs.length !== AF_STAGES.length ||
    laneEls.length !== NL || grpEls.length !== 3 || cardEls.length !== AF_CARDS.length || qEls.length !== 4
  ) {
    return () => {};
  }
  // Non-null from here on, also inside the hoisted helpers below
  const track: HTMLElement = trackQ;
  const fig: HTMLElement = figQ;
  const canvas: HTMLCanvasElement = canvasQ;
  const ctx: CanvasRenderingContext2D = ctxQ;
  const storyEl: HTMLElement = storyQ;
  const throatEl: HTMLElement = throatQ;
  const baseEl: HTMLElement = baseQ;
  const capEl: HTMLElement = capQ;
  const readoutEl: HTMLElement = readoutQ;
  const valueEl: HTMLElement = valueQ;
  const labelEls = [...laneEls, ...grpEls, ...cardEls, ...qEls, storyEl, throatEl, baseEl, capEl, readoutEl];

  /* ---------- state ---------- */
  const pinMQ = window.matchMedia(AF_PIN_QUERY);
  const reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = () => reducedMQ.matches;
  let pinned = false;
  let W = 0, H = 0, dpr = 1, phone = false;
  // Hs: the part of the stage always on screen (svh), H: the whole (lvh)
  let pad = 24, Fy = 0, Fh = 0, Hs = 0;
  let A0 = 0, A1 = 0, grpX = 0, brX = 0, labX = 0, dashX = 0, dashW = 8, iconX = 0, iconS = 1;
  let pitch = 50, bh = 12, Cc = 0, um = 0.38, ut = 0.78;
  const gT = 0.016, wT = 0.11;
  const C = new Float32Array(NL);
  let pools = POOLS_DESK;
  const ax = new Float32Array(NL), ay = new Float32Array(NL);
  // demand curve
  const TN = 241;
  const cvX = new Float32Array(TN), cvY = new Float32Array(TN), cvNX = new Float32Array(TN), cvNY = new Float32Array(TN);
  let xL = 0, xR = 0, yb = 0, yt = 0, spread = 20;
  // story
  let MX = 0, MY = 0, MS = 100;
  let cards: Rect[] = AF_CARDS.map(() => ({ x: 0, y: 0, w: 0, h: 0 }));
  let icons: Rect[] = AF_LANES.map(() => ({ x: 0, y: 0, w: 0, h: 0 }));
  // each card's place in the departure order, and when each lane opens (p)
  let rank: number[] = AF_CARDS.map((_, j) => j);
  let rowFirst = false;
  const headAt = new Float32Array(NL);
  // still
  let stillCurveSplit = false;
  let mono = "monospace";

  // particles
  let N = 0, drawN = 0;
  let stray = new Uint8Array(0), ln = new Uint8Array(0), qd = new Uint8Array(0), cl = new Uint8Array(0);
  let hi = new Uint8Array(0), tw = new Uint8Array(0), mc = new Uint8Array(0), oc = new Uint8Array(0);
  let gx = new Float32Array(0), gy = new Float32Array(0), nx = new Float32Array(0), ny = new Float32Array(0);
  let dvx = new Float32Array(0), dvy = new Float32Array(0), amp = new Float32Array(0), fr = new Float32Array(0);
  let ph = new Float32Array(0), u0 = new Float32Array(0), sp = new Float32Array(0), off = new Float32Array(0);
  let br = new Float32Array(0), sz = new Float32Array(0), dl = new Float32Array(0), arc = new Float32Array(0);
  let ps0 = new Float32Array(0), pof = new Float32Array(0), mu = new Float32Array(0), mv = new Float32Array(0);
  let ost = new Float32Array(0), osw = new Float32Array(0), ox = new Float32Array(0), oy = new Float32Array(0);
  // draw slots (twice N: the still draws qualified dots on their lane and on the curve)
  let sx = new Float32Array(0), sy = new Float32Array(0), ss2 = new Float32Array(0);
  let sb = new Uint16Array(0), order = new Int32Array(0);
  const bCount = new Int32Array(NB), bStart = new Int32Array(NB);

  function build(n: number) {
    N = n;
    drawN = n;
    const r = rng(20261007);
    const gauss = () => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(TAU * r());
    const U8 = () => new Uint8Array(n), F = () => new Float32Array(n);
    stray = U8(); ln = U8(); qd = U8(); cl = U8(); hi = U8(); tw = U8(); mc = U8(); oc = U8();
    gx = F(); gy = F(); nx = F(); ny = F(); dvx = F(); dvy = F(); amp = F(); fr = F(); ph = F();
    u0 = F(); sp = F(); off = F(); br = F(); sz = F(); dl = F(); arc = F(); ps0 = F(); pof = F();
    mu = F(); mv = F(); ost = F(); osw = F(); ox = F(); oy = F();
    sx = new Float32Array(2 * n); sy = new Float32Array(2 * n); ss2 = new Float32Array(2 * n);
    sb = new Uint16Array(2 * n); order = new Int32Array(2 * n);
    const cum: number[] = [];
    let acc = 0;
    for (const L of AF_LANES) cum.push((acc += L.share));
    const areas = MARK_CELLS.map((c) => c[2] * c[3]);
    const aTot = areas.reduce((a, b) => a + b, 0);
    for (let i = 0; i < n; i++) {
      stray[i] = r() < 0.08 ? 1 : 0;
      const x = r() * acc;
      let k = 0;
      while (k < NL - 1 && x > cum[k]) k++;
      ln[i] = k;
      qd[i] = !stray[i] && r() < AF_LANES[k].qual ? 1 : 0;
      cl[i] = !stray[i] && r() < 0.5 ? 1 : 0;
      hi[i] = r() < 0.05 ? 1 : 0;
      tw[i] = r() < 0.05 ? 1 : 0;
      gx[i] = clamp(gauss(), -3, 3);
      gy[i] = clamp(gauss(), -3, 3);
      nx[i] = r(); ny[i] = r();
      dvx[i] = (r() - 0.5) * 9; dvy[i] = (r() - 0.5) * 6;
      amp[i] = 2 + r() * 9; fr[i] = 0.12 + r() * 0.38; ph[i] = r() * TAU;
      u0[i] = r(); sp[i] = 0.78 + r() * 0.44;
      off[i] = (r() + r() + r()) / 1.5 - 1;
      br[i] = 0.25 + 0.75 * Math.pow(r(), 0.8);
      const s = r();
      sz[i] = s < 0.7 ? 1.1 : s < 0.97 ? 1.6 : 2.1;
      dl[i] = r(); arc[i] = (r() - 0.5) * 70;
      ps0[i] = r(); pof[i] = clamp(gauss() * 0.5, -1.4, 1.4);
      // a place inside the mark, cells weighted by area
      let m = r() * aTot, c = 0;
      while (c < 8 && m > areas[c]) m -= areas[c++];
      mc[i] = c; mu[i] = r(); mv[i] = r();
      ost[i] = r() * 0.32; osw[i] = (r() - 0.5) * 70;
      oc[i] = 255;
    }
  }

  /* ---------- layout: pinned ---------- */
  function layoutPinned() {
    phone = W < 700;
    pools = phone ? POOLS_PHONE : POOLS_DESK;
    pad = phone ? 16 : clamp(W * 0.036, 24, 64);
    // the composition keeps to the always-visible part of the stage; the
    // dots of the noise still reach the floor under a collapsed toolbar
    const top = phone ? 104 : 112, bot = phone ? 90 : 104;
    Fy = top;
    Fh = Hs - top - bot;
    if (phone) {
      grpX = pad + 4; brX = pad + 13; dashX = pad + 19; dashW = 6; A0 = pad + 32; A1 = W - pad; labX = A0;
      iconS = 0.55; iconX = labX;
    } else {
      grpX = pad; brX = pad + 72; labX = pad + 88; A0 = pad + 292; dashX = A0 - 20; dashW = 8; A1 = W - pad - 64;
      iconS = 1; iconX = A0 - 48;
    }
    const S = phone ? Math.min(Fh * 0.84, 540) : Math.min(Fh * 0.78, 560);
    pitch = S / SPAN;
    bh = phone ? Math.min(10, pitch * 0.17) : Math.min(14, pitch * 0.24);
    const mid = Fy + Fh * (phone ? 0.52 : 0.5);
    for (let k = 0; k < NL; k++) C[k] = mid - S / 2 + SLOT[k] * pitch;
    Cc = mid;
    um = phone ? 0.3 : 0.38;
    ut = phone ? 0.74 : 0.78;
    // demand chart
    if (phone) {
      xL = pad + 4; xR = W - pad - 24; yb = Fy + Fh * 0.84; yt = Fy + Fh * 0.36; spread = 13;
    } else {
      xL = W < 1100 ? labX : A0;
      xR = Math.min(xL + (A1 - xL) * 0.74, W - pad - 210);
      yb = Fy + Fh * 0.86; yt = Fy + Fh * 0.12; spread = 22;
    }
    buildCurve();
    layoutIcons();
    layoutStory();
    assignOutlines();
    orderFlight();
    placeFixed();
  }

  function layoutIcons() {
    icons = AF_LANES.map((L, k) => {
      const [w0, h0] = ICON[L.icon];
      const w = Math.round(w0 * iconS), h = Math.round(h0 * iconS);
      if (phone && pinned) {
        const y = C[k] - bh - 9;
        return { x: iconX, y: y - h / 2, w, h };
      }
      return { x: iconX - w / 2, y: C[k] - h / 2, w, h };
    });
  }

  function layoutStory() {
    const Fw = W - 2 * pad;
    const rect = (cx: number, cy: number, w: number, h: number): Rect => ({
      x: Math.round(cx - w / 2), y: Math.round(cy - h / 2), w: Math.round(w), h: Math.round(h),
    });
    // portrait stages (phones, tablets upright) stack the cards in rows
    const tall = phone || W / Hs < 0.85;
    if (!tall) {
      const U = Math.min(Fh, W * 0.56);
      MS = Math.round(clamp(U * 0.17, 72, 128) / 2) * 2;
      MX = Math.round(W / 2);
      MY = Math.round(Fy + Fh * 0.5);
      const at = (fx: number, fy: number) => [W / 2 + fx * Fw, Fy + fy * Fh] as const;
      const by = (key: AfIcon, cxy: readonly [number, number], size: number, byH: boolean) => {
        const ar = AF_CARDS.find((c) => c.key === key)?.ar ?? 1;
        const w = byH ? size * ar : size, h = byH ? size : size / ar;
        return rect(cxy[0], cxy[1], w, h);
      };
      // narrow landscape (iPad, small laptops): the two cards that flank the
      // mark's caption step out from it
      const tight = Fw / U < 1.85;
      cards = AF_CARDS.map((c) => {
        switch (c.key) {
          case "reel": return by(c.key, at(-0.33, 0.53), U * 0.44, true);
          case "film": return by(c.key, at(0.19, 0.22), U * 0.44, false);
          case "ai": return by(c.key, at(0.33, 0.62), U * 0.37, false);
          case "feed": return by(c.key, tight ? at(0.115, 0.835) : at(0.11, 0.8), U * 0.23, false);
          case "creator": return by(c.key, at(tight ? -0.155 : -0.13, 0.79), U * 0.29, true);
          default: return by(c.key, at(-0.12, 0.2), U * 0.37, false);
        }
      });
    } else {
      // three rows (film + feed, reel + mark + creator, out of home + AI
      // answer), each under a two-line label, spread evenly down the field
      // phones use the width; upright tablets a centred column
      // phones inset 10px a side so the crop marks stay inside the gutter
      const Fw2 = phone ? W - 2 * pad - 20 : Math.min(W - 2 * pad, Fh * 0.56), g = phone ? 12 : 20, lab = 36;
      const L0 = Math.round((W - Fw2) / 2), R0 = L0 + Fw2;
      const filmW = Fw2 * 0.6, filmH = (filmW * 9) / 16;
      const feedS = Math.min(Fw2 - filmW - g, filmH * 1.15);
      const creW = Fw2 * 0.3, creH = (creW * 5) / 4;
      const oohW = Fw2 * 0.52, oohH = oohW / 2;
      const aiW = Fw2 - oohW - g, aiH = aiW / 1.5;
      let reelH = Math.max(creH, Fh * 0.27);
      const hA = Math.max(filmH, feedS), hC = Math.max(oohH, aiH);
      let hB = Math.max(reelH, creH);
      const k = Math.min(1, (Fh - 3 * lab - 2 * 14) / (hA + hB + hC));
      reelH *= k;
      hB *= k;
      // the three rows at their final (scaled) heights
      const rows = (hA + hC) * k + hB;
      const gap = Math.min(56, (Fh - 3 * lab - rows) / 2);
      const used = 3 * lab + rows + 2 * gap;
      const yA = Fy + (Fh - used) / 2 + lab, yB = yA + hA * k + gap + lab, yC = yB + hB + gap + lab;
      MS = Math.round(clamp(Fw2 * (phone ? 0.2 : 0.15), 52, phone ? 80 : 112) * Math.min(1, k * 1.1) / 2) * 2;
      MX = Math.round(W / 2);
      MY = Math.round(yB + hB / 2);
      const box = (x: number, y: number, w: number, h: number): Rect => ({
        x: Math.round(x), y: Math.round(y), w: Math.round(w * k), h: Math.round(h * k),
      });
      cards = AF_CARDS.map((c) => {
        switch (c.key) {
          case "film": return box(L0, yA, filmW, filmH);
          case "feed": return box(R0 - feedS * k, yA, feedS, feedS);
          case "reel": return box(L0, yB + (hB - reelH) / 2, (reelH / k) * 9 / 16, reelH / k);
          case "creator": return box(R0 - creW * k, yB + (hB - creH * k) / 2, creW, creH);
          case "ooh": return box(L0, yC + (hC * k - oohH * k) / 2, oohW, oohH);
          default: return box(R0 - aiW * k, yC + (hC * k - aiH * k) / 2, aiW, aiH);
        }
      });
    }
  }

  /** Give each card's outline its share of dots, evenly round its perimeter */
  function assignOutlines() {
    oc.fill(255);
    const per = cards.map((r) => 2 * (r.w + r.h));
    const total = per.reduce((a, b) => a + b, 0);
    let avail = 0;
    for (let i = 0; i < N; i++) if (!stray[i]) avail++;
    let gap = phone ? 3.2 : 3.4;
    if (total / gap > avail * 0.5) gap = total / (avail * 0.5);
    let i = 0;
    for (let j = 0; j < cards.length; j++) {
      const r = cards[j], P = per[j], cnt = Math.round(P / gap);
      for (let k = 0; k < cnt; k++) {
        while (i < N && stray[i]) i++;
        if (i >= N) return;
        let d = (k / cnt) * P, tx: number, ty: number;
        if (d < r.w) { tx = r.x + d; ty = r.y; }
        else if ((d -= r.w) < r.h) { tx = r.x + r.w; ty = r.y + d; }
        else if ((d -= r.h) < r.w) { tx = r.x + r.w - d; ty = r.y + r.h; }
        else { d -= r.w; tx = r.x; ty = r.y + r.h - d; }
        oc[i] = j; ox[i] = tx; oy[i] = ty;
        i++;
      }
    }
  }

  /**
   * A card's rect at flight progress kj: card to lane marker. Its size eases
   * out ahead of its travel, so it is near marker size before it reaches
   * the column of markers already landed. With `rowFirst` it also finds its
   * lane's height early and comes in along the row (chosen per layout).
   */
  function flightBox(j: number, kj: number, rf: boolean, o: Float32Array, at: number) {
    const r0 = cards[j], ic = icons[CARD_LANE[j]], ks = eoc(kj);
    const w = lerp(r0.w, ic.w, ks), h = lerp(r0.h, ic.h, ks);
    o[at] = lerp(r0.x + r0.w / 2, ic.x + ic.w / 2, kj) - w / 2;
    o[at + 1] = lerp(r0.y + r0.h / 2, ic.y + ic.h / 2, rf ? ks : kj) - h / 2;
    o[at + 2] = w;
    o[at + 3] = h;
  }
  const fb = new Float32Array(4);
  function flightRect(j: number, kj: number): Rect {
    flightBox(j, kj, rowFirst, fb, 0);
    return { x: fb[0], y: fb[1], w: fb[2], h: fb[3] };
  }
  const flightAt = (kc: number, j: number) => eio(seg(kc, rank[j] * FL_STG, rank[j] * FL_STG + FL_DUR));

  /**
   * The departure order and the path: of all 720 orders, each with either
   * path, the one whose cards overlap least in flight (a card in the air
   * over one still in place, a marker landed, or another in the air),
   * nearest the lanes first on a tie. Then each lane's opening.
   */
  function orderFlight() {
    const n = cards.length, S = 40, M = 10;
    const kjs = new Float32Array(n), fr4 = new Float32Array(4 * n);
    const perm = cards.map((_, j) => j);
    const dist = cards.map((r, j) => r.x + r.w / 2 - icons[CARD_LANE[j]].x);
    let best = Infinity, bestRank = rank.slice(), bestRf = false, rf = false;
    const score = () => {
      const rk = new Array<number>(n);
      perm.forEach((j, i) => (rk[j] = i));
      let cost = 0;
      for (let s = 0; s <= S; s++) {
        const kc = s / S;
        for (let j = 0; j < n; j++) {
          const kj = (kjs[j] = eio(seg(kc, rk[j] * FL_STG, rk[j] * FL_STG + FL_DUR)));
          flightBox(j, kj, rf, fr4, 4 * j);
        }
        for (let a = 0; a < n; a++) {
          for (let b = a + 1; b < n; b++) {
            const ma = kjs[a] > 0 && kjs[a] < 1, mb = kjs[b] > 0 && kjs[b] < 1;
            if (!ma && !mb) continue;
            const A = 4 * a, B = 4 * b;
            const ox = Math.min(fr4[A] + fr4[A + 2], fr4[B] + fr4[B + 2]) + M - Math.max(fr4[A], fr4[B]);
            const oy = Math.min(fr4[A + 1] + fr4[A + 3], fr4[B + 1] + fr4[B + 3]) + M - Math.max(fr4[A + 1], fr4[B + 1]);
            // as a share of the smaller, so a brush over a small marker counts
            if (ox > 0 && oy > 0) cost += (ox * oy) / Math.min((fr4[A + 2] + M) * (fr4[A + 3] + M), (fr4[B + 2] + M) * (fr4[B + 3] + M));
          }
        }
        // already no better than the best: stop (most orders end here early)
        if (cost >= best) return;
      }
      for (let j = 0; j < n; j++) cost += rk[j] * dist[j] * 1e-6;
      if (cost < best) {
        best = cost;
        bestRank = rk;
        bestRf = rf;
      }
    };
    for (const mode of [false, true]) {
      rf = mode;
      // Heap's algorithm over every order
      for (let j = 0; j < n; j++) perm[j] = j;
      const cnt = new Array<number>(n).fill(0);
      score();
      for (let i = 1; i < n; ) {
        if (cnt[i] < i) {
          const sw = i % 2 ? cnt[i] : 0;
          [perm[sw], perm[i]] = [perm[i], perm[sw]];
          score();
          cnt[i]++;
          i = 1;
        } else cnt[i++] = 0;
      }
    }
    rank = bestRank;
    rowFirst = bestRf;
    // a lane opens as its card lands; the rest as their markers come in
    headAt.fill(HEAD_NEW);
    CARD_LANE.forEach((k, j) => {
      headAt[k] = KC0 + (KC1 - KC0) * (rank[j] * FL_STG + FL_DUR * 0.74);
    });
  }

  function buildCurve() {
    for (let j = 0; j < TN; j++) {
      const s = j / (TN - 1);
      cvX[j] = xL + s * (xR - xL);
      cvY[j] = yb - (yb - yt) * curveF(s);
    }
    for (let j = 0; j < TN; j++) {
      const a = Math.max(0, j - 1), b = Math.min(TN - 1, j + 1);
      const dx = cvX[b] - cvX[a], dy = cvY[b] - cvY[a], l = Math.hypot(dx, dy) || 1;
      cvNX[j] = -dy / l;
      cvNY[j] = dx / l;
    }
  }

  /* ---------- layout: still ---------- */
  function layoutStill() {
    phone = W < 480;
    stillCurveSplit = phone;
    pad = 0;
    if (!phone) {
      // labels | markers | lanes into the funnel | the curve rising out of it
      const withIcons = W >= 760;
      iconS = withIcons ? 1 : 0;
      grpX = 0; brX = 70; labX = 86; iconX = labX + 128; dashW = 8;
      dashX = withIcons ? labX + 150 : labX + 108;
      A0 = withIcons ? labX + 170 : labX + 128;
      const tx = Math.round(A0 + (W - A0) * 0.5);
      ut = 0.86; um = 0.42;
      A1 = A0 + (tx - A0) / ut;
      const S = H * 0.64;
      pitch = S / SPAN;
      bh = Math.min(12, pitch * 0.24);
      Cc = H * 0.55;
      for (let k = 0; k < NL; k++) C[k] = Cc - S / 2 + SLOT[k] * pitch;
      // the head rises high, with room above it for the readout
      const rh = (readoutEl.firstElementChild as HTMLElement | null)?.offsetHeight || 80;
      xL = tx; yb = Cc; xR = W - 12; yt = Math.max(H * 0.14, rh + 26); spread = 16;
    } else {
      // two panels: lanes into the funnel above, the curve below
      iconS = 0;
      grpX = 5; brX = 13; labX = 22; dashX = -99; dashW = 0; A0 = labX + 102; iconX = -99;
      const tx = Math.round(W * 0.78);
      ut = 0.84; um = 0.36;
      A1 = A0 + (tx - A0) / ut;
      const S = H * 0.44;
      pitch = S / SPAN;
      bh = Math.min(8, pitch * 0.26);
      Cc = 10 + S / 2;
      for (let k = 0; k < NL; k++) C[k] = Cc - S / 2 + SLOT[k] * pitch;
      xL = 2; xR = W - 14; yb = H - 46; yt = H * 0.68; spread = 10;
    }
    buildCurve();
    layoutIcons();
  }

  /* ---------- DOM writers (write-only, cached) ---------- */
  const cache = new Map<HTMLElement, LabelCache>();
  function put(el: HTMLElement, x: number | null, y: number, o: number) {
    let s = cache.get(el);
    if (!s) cache.set(el, (s = { x: NaN, y: NaN, o: -1 }));
    if (x !== null && !(Math.abs(s.x - x) <= 0.05 && Math.abs(s.y - y) <= 0.05)) {
      s.x = x; s.y = y;
      el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
    }
    o = Math.round(o * 500) / 500;
    if (o !== s.o) {
      s.o = o;
      el.style.opacity = String(o);
      el.style.visibility = o > 0 ? "visible" : "hidden";
    }
  }
  const align = (el: HTMLElement, a: string) => {
    if (el.dataset.align !== a) el.dataset.align = a;
  };
  const stepCache = new Map<HTMLElement, { o: number; y: number }>();
  function setStep(el: HTMLElement, o: number, ty: number) {
    let s = stepCache.get(el);
    if (!s) stepCache.set(el, (s = { o: -1, y: NaN }));
    o = Math.round(o * 500) / 500;
    if (o !== s.o) {
      s.o = o;
      el.style.opacity = String(o);
    }
    if (!(Math.abs(ty - s.y) <= 0.05)) {
      s.y = ty;
      el.style.transform = `translate3d(0,${ty.toFixed(1)}px,0)`;
    }
  }
  function clearInline() {
    for (const el of [...steps, ...labelEls]) {
      el.style.transform = "";
      el.style.opacity = "";
      el.style.visibility = "";
    }
    for (const el of progs) el.style.transform = "";
    cache.clear();
    stepCache.clear();
  }

  /** Positions that only change on resize; opacity is written per frame */
  function placeFixed() {
    cache.clear();
    GROUP_RANGE.forEach(([a, b], g) => {
      align(grpEls[g], phone ? "rot" : "l");
      put(grpEls[g], grpX, (C[a] + C[b]) / 2, 0);
    });
    if (pinned) {
      // the mark and its caption keep the card labels off them
      const capY = MY + MS / 2 + 22;
      const capW = ((storyEl.firstElementChild as HTMLElement | null)?.offsetWidth ?? 70) / 2 + 12;
      const keep: [number, number, number, number][] = [
        [MX - MS / 2 - 12, MX + MS / 2 + 12, MY - MS / 2 - 8, MY + MS / 2 + 8],
        [MX - capW, MX + capW, capY - 12, capY + 12],
      ];
      AF_CARDS.forEach((_, j) => {
        const r = cards[j], el = cardEls[j];
        const inner = el.firstElementChild as HTMLElement | null;
        let over = false;
        const measure = (stack: boolean) => {
          el.dataset.stack = stack ? "1" : "";
          const lw = inner?.offsetWidth ?? 0, lh = inner?.offsetHeight ?? 11;
          // a label that would run off the stage hangs from the card's right edge
          over = r.x + lw > W - 6;
          const x0 = over ? r.x + r.w - lw : r.x, y0 = r.y - 9 - lh - 3, y1 = r.y - 6;
          return keep.some(([a, b, c, d]) => x0 < b && x0 + lw > a && y0 < d && y1 > c);
        };
        // phones always stack the pixel size; elsewhere only when that
        // clears the mark (a taller label that still hits stays on one line)
        if (!phone && measure(false) && measure(true)) measure(false);
        else if (phone) measure(true);
        align(el, over ? "upr" : "up");
        put(el, over ? r.x + r.w : r.x, r.y - 9, 0);
      });
      align(storyEl, "c");
      put(storyEl, MX, capY, 0);
      align(throatEl, "l");
      put(throatEl, A0 + ut * (A1 - A0) + 16, Cc - 17, 0);
    } else {
      for (const el of cardEls) put(el, 0, 0, 0);
      put(storyEl, 0, 0, 0);
      // narrow: above the stream; wide: centred over the throat, clear of the curve
      align(throatEl, phone ? "l" : "c");
      put(throatEl, A0 + ut * (A1 - A0) + (phone ? 8 : 0), Cc - (phone ? 15 : 28), 0);
    }
    qEls.forEach((el, i) => {
      align(el, "c");
      put(el, xL + (i + 0.5) * (xR - xL) / 4, yb + 17, 0);
    });
    align(capEl, "l");
    put(capEl, xL, yb + 38, 0);
    // the legend row under the quarters: what the figure is, what the dashes
    // are; a chart too narrow for both on one row drops the baseline a row
    const capW = (capEl.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
    const baseW = (baseEl.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
    align(baseEl, "r");
    put(baseEl, xR, yb + (xL + capW + 20 > xR - baseW ? 58 : 38), 0);
  }

  /* ---------- canvas helpers ---------- */
  function strokeRect(r: Rect, col: string, a: number) {
    if (a <= 0.01) return;
    ctx.strokeStyle = rgba(col, a);
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(r.x) + 0.5, Math.round(r.y) + 0.5, Math.round(r.w), Math.round(r.h));
  }
  function hline(x1: number, x2: number, y: number, col: string, a: number, w = 1) {
    if (a <= 0.01 || x2 <= x1) return;
    ctx.fillStyle = rgba(col, a);
    ctx.fillRect(Math.round(x1), Math.round(y - w / 2), Math.round(x2 - x1), w);
  }
  function crop(r: Rect, a: number) {
    if (a <= 0.01) return;
    const g = 4, l = 6, x0 = Math.round(r.x), y0 = Math.round(r.y), x1 = x0 + Math.round(r.w), y1 = y0 + Math.round(r.h);
    const c = ctx;
    c.fillStyle = rgba(FOG, a);
    for (const [x, y, dx, dy] of [[x0, y0, -1, -1], [x1, y0, 1, -1], [x0, y1, -1, 1], [x1, y1, 1, 1]]) {
      c.fillRect(dx < 0 ? x - g - l : x + g + 1, y, l, 1);
      c.fillRect(x, dy < 0 ? y - g - l : y + g + 1, 1, l);
    }
  }
  /** The Plurel mark: paper cells round a signal centre. `push` spreads the cells apart. */
  function drawMark(cx: number, cy: number, size: number, a: number, outer = 0.94, push = 0) {
    if (a <= 0.01 || size < 2) return;
    const c = ctx;
    const u = size / 10, x0 = cx - size / 2, y0 = cy - size / 2;
    for (let j = 0; j < 9; j++) {
      const [mx, my, mw, mh] = MARK_CELLS[j];
      const dx = (mx + mw / 2 - 5) / 5, dy = (my + mh / 2 - 5) / 5;
      c.fillStyle = j === 4 ? rgba(SIG, a) : rgba(PAPER, a * outer);
      c.fillRect(x0 + mx * u + dx * push, y0 + my * u + dy * push, mw * u, mh * u);
    }
  }
  function cardInner(key: AfIcon, r: Rect, a: number) {
    if (a <= 0.01) return;
    const { x, y, w, h } = r, cx = x + w / 2, cy = y + h / 2;
    const c = ctx;
    if (key === "reel") {
      drawMark(cx, y + h * 0.4, Math.round(w * 0.36), a * 0.9, 0.42);
      hline(cx - w * 0.3, cx + w * 0.3, y + h * 0.7, FOG, 0.55 * a);
      hline(cx - w * 0.3, cx + w * 0.08, y + h * 0.76, FOG, 0.4 * a);
    } else if (key === "film") {
      drawMark(x + w * 0.28, cy - h * 0.04, Math.round(h * 0.38), a * 0.9, 0.42);
      hline(x + w * 0.5, x + w * 0.84, cy - h * 0.1, FOG, 0.55 * a);
      hline(x + w * 0.5, x + w * 0.72, cy + h * 0.02, FOG, 0.4 * a);
      hline(x + 8, x + w - 8, y + h - 9, FOG, 0.25 * a);
      hline(x + 8, x + 8 + (w - 16) * 0.38, y + h - 9, SIG, 0.95 * a);
    } else if (key === "feed") {
      drawMark(cx, cy - h * 0.06, Math.round(w * 0.38), a * 0.9, 0.42);
      hline(cx - w * 0.19, cx + w * 0.19, y + h * 0.82, FOG, 0.4 * a);
    } else if (key === "ai") {
      const p = Math.max(8, w * 0.08), iw = w - p * 2;
      c.fillStyle = rgba(SIG, a);
      c.fillRect(Math.round(x + p), Math.round(y + p + 2), 4, 4);
      hline(x + p + 12, x + p + iw * 0.5, y + p + 4, PAPER, 0.6 * a);
      const ys = [0.42, 0.56, 0.7], ws = [0.9, 0.78, 0.46];
      for (let i = 0; i < 3; i++) hline(x + p, x + p + iw * ws[i], y + h * ys[i], FOG, 0.45 * a);
      if (w > 90) {
        c.font = `400 ${w > 160 ? 11 : 9}px ${mono}`;
        c.textBaseline = "middle";
        c.textAlign = "left";
        c.fillStyle = rgba(SIG, a);
        c.fillText("[1]", x + p + iw * 0.46 + 8, y + h * 0.7 + 0.5);
      }
    } else if (key === "creator") {
      const rr = Math.max(3, w * 0.07);
      c.strokeStyle = rgba(PAPER, 0.6 * a);
      c.lineWidth = 1;
      c.beginPath();
      c.arc(x + w * 0.12 + rr, y + w * 0.12 + rr, rr, 0, TAU);
      c.stroke();
      hline(x + w * 0.12 + rr * 2 + 6, x + w * 0.62, y + w * 0.12 + rr, FOG, 0.5 * a);
      drawMark(cx, cy + h * 0.02, Math.round(w * 0.34), a * 0.9, 0.42);
      hline(x + w * 0.14, x + w * 0.86, y + h * 0.8, FOG, 0.5 * a);
      hline(x + w * 0.14, x + w * 0.5, y + h * 0.86, FOG, 0.35 * a);
    } else if (key === "ooh") {
      drawMark(x + h * 0.5, cy, Math.round(h * 0.5), a * 0.9, 0.42);
      hline(x + h, x + h + w * 0.42, cy - h * 0.1, PAPER, 0.6 * a, 2);
      hline(x + h, x + h + w * 0.28, cy + h * 0.12, FOG, 0.45 * a);
    }
  }
  /** A card's identity at marker size: one cue from its contents survives */
  function cue(key: AfIcon, r: Rect, a: number) {
    if (a <= 0.01) return;
    const c = ctx;
    const x = Math.round(r.x), y = Math.round(r.y), w = Math.round(r.w), h = Math.round(r.h);
    const cx = x + w / 2, cy = y + h / 2;
    const d = h < 14 ? 2 : 3, m = Math.min(w, h) < 14 ? 2 : 4;
    const dot = (px: number, py: number) => {
      c.fillStyle = rgba(SIG, a);
      c.fillRect(Math.round(px - d / 2), Math.round(py - d / 2), d, d);
    };
    if (key === "reel") {
      // upright: the mark high, a caption under it
      dot(cx, y + h * 0.36);
      hline(x + m, x + w - m + 1, y + h * 0.7, FOG, 0.65 * a);
    } else if (key === "film") {
      // the mark left of a title, a progress bar along the foot
      dot(x + w * 0.27, cy - 1);
      hline(x + w * 0.48, x + w - m, cy - 1, FOG, 0.55 * a);
      hline(x + m, x + w - m + 1, y + h - m + 1, FOG, 0.3 * a);
      hline(x + m, x + m + (w - 2 * m) * 0.4, y + h - m + 1, SIG, a);
    } else if (key === "ai") {
      // the cited source, then a line of answer
      c.fillStyle = rgba(SIG, a);
      c.fillRect(x + m, y + m, 2, 2);
      hline(x + m + 5, Math.max(x + m + 8, x + w * 0.62), y + m + 1, PAPER, 0.7 * a);
      hline(x + m, x + w - m + 1, y + h - m - (h < 14 ? 0 : 2), FOG, 0.5 * a);
    } else if (key === "feed") {
      // a grid of posts, one of them lit
      // marker-sized even while the card is still shrinking onto the lane
      const g = w < 14 ? 1 : 2, s = clamp(Math.floor((w - 2 * m - g) / 2), 2, 4);
      const x0 = Math.round(cx - s - g / 2), y0 = Math.round(cy - s - g / 2);
      for (let i = 0; i < 4; i++) {
        c.fillStyle = i === 0 ? rgba(SIG, a) : rgba(FOG, 0.55 * a);
        c.fillRect(x0 + (i % 2) * (s + g), y0 + (i >> 1) * (s + g), s, s);
      }
    } else if (key === "creator") {
      // a face in the corner, the mark under it
      const rr = w < 14 ? 1.5 : 2.5;
      c.strokeStyle = rgba(PAPER, 0.75 * a);
      c.lineWidth = 1;
      c.beginPath();
      c.arc(x + m + rr, y + m + rr, rr, 0, TAU);
      c.stroke();
      dot(cx, y + h * 0.6);
    } else {
      // out of home: the mark at the left of one heavy line
      dot(x + h * 0.5, cy);
      hline(x + h, x + w - m, cy, PAPER, 0.65 * a, 2);
    }
  }
  /** Small lane marker: the card it came from, or a drawn surface */
  function drawIcon(key: AfIcon, r: Rect, a: number, fresh: boolean) {
    if (a <= 0.01) return;
    strokeRect(r, PAPER, 0.8 * a);
    if (!fresh) {
      cue(key, r, a);
      return;
    }
    const c = ctx;
    const cy = Math.round(r.y + r.h / 2);
    const d = r.h < 14 ? 2 : 3;
    c.fillStyle = rgba(SIG, a);
    if (key === "search") {
      hline(r.x + 4, r.x + r.w * 0.45, cy, FOG, 0.6 * a);
      c.fillStyle = rgba(SIG, a);
      c.fillRect(Math.round(r.x + r.w - 4 - d), cy - d / 2, d, d);
    } else if (key === "press") {
      for (let i = 0; i < 3; i++) hline(r.x + 3, r.x + r.w - 3, r.y + r.h * (0.3 + i * 0.2), FOG, 0.5 * a);
    } else {
      const px = Math.round(r.x + r.w * 0.66);
      c.fillStyle = rgba(FOG, 0.55 * a);
      for (let y = Math.round(r.y) + 3; y < r.y + r.h - 2; y += 3) c.fillRect(px, y, 1, 1.5);
      c.fillStyle = rgba(SIG, a);
      c.fillRect(Math.round(r.x + r.w * 0.33 - d / 2), cy - d / 2, d, d);
    }
  }
  function laneY(k: number, u: number, o: number, b: number) {
    let g = 1, ws = 1;
    if (u > um) {
      const f = u >= ut ? 1 : sm5((u - um) / (ut - um));
      g = 1 - b * f * (1 - gT);
      ws = 1 - b * f * (1 - wT);
    }
    return Cc + (C[k] - Cc) * g + o * bh * ws;
  }
  function drawRibbons(a: number, t: number, pulses: boolean) {
    const c = ctx;
    const AW = A1 - A0;
    const steps = phone ? 48 : 72;
    c.lineWidth = 1;
    c.globalAlpha = a;
    for (let k = 0; k < NL; k++) {
      for (let r = -2; r <= 2; r++) {
        const o = r * 0.42;
        c.strokeStyle = r === 0 ? "rgba(185,188,194,0.26)" : "rgba(185,188,194,0.15)";
        c.beginPath();
        for (let j = 0; j <= steps; j++) {
          const u = (j / steps) * ut;
          const y = laneY(k, u, o, 1);
          if (j === 0) c.moveTo(A0 + u * AW, y);
          else c.lineTo(A0 + u * AW, y);
        }
        c.stroke();
      }
    }
    if (pulses) {
      // a short comet down each lane, red once it has passed the funnel's mouth
      c.lineWidth = 1.2;
      for (let k = 0; k < NL; k++) {
        const pu = frac(t * AF_LANES[k].speed * 2.4 + k * 0.37);
        const red = pu > um + 0.12;
        const rgb = red ? SIG : PAPER;
        for (let j = 0; j < 6; j++) {
          const ua = pu - 0.05 + j * 0.0083, ub = ua + 0.0083;
          if (ub <= 0 || ua > ut) continue;
          c.strokeStyle = rgba(rgb, ((j + 1) / 6) * (red ? 0.95 : 0.6));
          c.beginPath();
          c.moveTo(A0 + Math.max(0, ua) * AW, laneY(k, Math.max(0, ua), 0, 1));
          c.lineTo(A0 + ub * AW, laneY(k, ub, 0, 1));
          c.stroke();
        }
      }
    }
    c.globalAlpha = 1;
  }
  function drawFurniture(tickA: number, grpA: number) {
    const c = ctx;
    if (tickA > 0.002 && dashW > 0) {
      c.globalAlpha = tickA;
      c.fillStyle = "rgba(185,188,194,0.55)";
      for (let k = 0; k < NL; k++) {
        for (let j = 0; j < 4; j++) c.fillRect(dashX, Math.round(C[k] + (j - 1.5) * 4.5), dashW, 1);
      }
      c.globalAlpha = 1;
    }
    if (grpA > 0.002) {
      c.globalAlpha = grpA;
      c.fillStyle = "rgba(185,188,194,0.45)";
      const above = phone && pinned;
      for (const [a, b] of GROUP_RANGE) {
        const y0 = Math.round(C[a] - bh - (above ? 16 : 3)), y1 = Math.round(C[b] + bh + 3);
        c.fillRect(brX, y0, 1, y1 - y0);
        c.fillRect(brX, y0, 5, 1);
        c.fillRect(brX, y1 - 1, 5, 1);
      }
      c.globalAlpha = 1;
    }
  }
  function curvePath(end: number, hx: number, hy: number) {
    const c = ctx;
    c.beginPath();
    c.moveTo(cvX[0], cvY[0]);
    for (let i = 1; i < end; i++) c.lineTo(cvX[i], cvY[i]);
    c.lineTo(hx, hy);
  }
  function drawCurve(a: number, end: number, hx: number, hy: number) {
    if (a <= 0.002) return;
    const c = ctx;
    c.globalAlpha = a;
    c.lineJoin = "round";
    c.lineCap = "round";
    curvePath(end, hx, hy);
    c.strokeStyle = "rgba(232,86,78,0.07)";
    c.lineWidth = 12;
    c.stroke();
    curvePath(end, hx, hy);
    c.strokeStyle = "rgba(232,86,78,0.14)";
    c.lineWidth = 4;
    c.stroke();
    const g = c.createLinearGradient(xL, 0, hx + 0.01, 0);
    g.addColorStop(0, "rgba(191,58,54,0.35)");
    g.addColorStop(0.7, "rgba(232,86,78,0.9)");
    g.addColorStop(1, "rgba(242,201,191,1)");
    curvePath(end, hx, hy);
    c.strokeStyle = g;
    c.lineWidth = 1.2;
    c.stroke();
    c.lineCap = "butt";
    c.globalAlpha = 1;
  }
  /** Baseline (dashed), quarter ticks, and the drop from the head */
  function drawAxis(a: number, hx: number, hy: number) {
    if (a <= 0.002) return;
    const c = ctx;
    c.globalAlpha = a;
    c.fillStyle = "rgba(185,188,194,0.42)";
    const y = Math.round(yb);
    for (let x = xL; x < xR; x += 6) c.fillRect(Math.round(x), y, Math.min(3, xR - x), 1);
    c.fillStyle = "rgba(185,188,194,0.6)";
    for (let i = 0; i <= 4; i++) c.fillRect(Math.round(xL + (i * (xR - xL)) / 4), y + 3, 1, 6);
    c.fillStyle = "rgba(232,86,78,0.55)";
    for (let yy = hy + 10; yy < yb - 3; yy += 5) c.fillRect(Math.round(hx), yy, 1, 2);
    c.globalAlpha = 1;
  }
  /** The one bright point */
  function drawPoint(px: number, py: number, big: number, a: number, t: number, pulse: boolean) {
    if (a <= 0.002) return;
    const c = ctx;
    c.globalAlpha = a;
    const glow = c.createRadialGradient(px, py, 0, px, py, 30 * big);
    glow.addColorStop(0, "rgba(232,86,78,0.42)");
    glow.addColorStop(0.35, "rgba(232,86,78,0.12)");
    glow.addColorStop(1, "rgba(232,86,78,0)");
    c.fillStyle = glow;
    c.fillRect(px - 32 * big, py - 32 * big, 64 * big, 64 * big);
    if (pulse) {
      for (let r = 0; r < 2; r++) {
        const p2 = frac(t * 0.42 + r * 0.5);
        c.strokeStyle = rgba(SIG, 0.5 * (1 - p2));
        c.lineWidth = 1;
        c.beginPath();
        c.arc(px, py, 5 + p2 * 22 * big, 0, TAU);
        c.stroke();
      }
    }
    c.strokeStyle = "rgba(232,86,78,0.95)";
    c.lineWidth = 1;
    c.beginPath();
    c.arc(px, py, 5.5, 0, TAU);
    c.stroke();
    c.fillStyle = "#fbfaf6";
    c.beginPath();
    c.arc(px, py, 2.6, 0, TAU);
    c.fill();
    c.globalAlpha = 1;
  }
  /** Draw the first `vn` slots, grouped by style */
  function flush(vn: number, alpha: number) {
    bCount.fill(0);
    for (let j = 0; j < vn; j++) bCount[sb[j]]++;
    let acc = 0;
    for (let b = 0; b < NB; b++) {
      bStart[b] = acc;
      acc += bCount[b];
    }
    for (let j = 0; j < vn; j++) order[bStart[sb[j]]++] = j;
    const c = ctx;
    c.globalAlpha = alpha;
    let j = 0;
    for (let b = 0; b < NB; b++) {
      const cnt = bCount[b];
      if (!cnt) continue;
      c.fillStyle = STYLES[b];
      for (const end = j + cnt; j < end; j++) {
        const k = order[j], s = ss2[k];
        c.fillRect(sx[k] - s * 0.5, sy[k] - s * 0.5, s, s);
      }
    }
    c.globalAlpha = 1;
  }
  /** Queue a dot; returns the next slot */
  function slot(vn: number, x: number, y: number, a: number, col: number, s: number) {
    if (a <= 0.005) return vn;
    const ai = Math.round(Math.sqrt(a > 1 ? 1 : a) * (AL - 1));
    if (!ai) return vn;
    sx[vn] = x; sy[vn] = y; ss2[vn] = s; sb[vn] = col * AL + ai;
    return vn + 1;
  }

  /* ---------- pinned render ---------- */
  let curStage = -1, lastRead = "", lastVal = "", lastQ = -1;
  const flKj = new Float32Array(AF_CARDS.length), flKey = new Float32Array(AF_CARDS.length);
  const flOrd: number[] = AF_CARDS.map((_, j) => j);

  function render(p: number, t: number) {
    const c = ctx;
    // headings
    let hmax = 0;
    for (let i = 0; i < 5; i++) {
      const h = HEAD[i];
      const vin = i === 0 ? 1 : ss(h[0], h[1], p), vout = ss(h[2], h[3], p);
      const o = vin * (1 - vout);
      if (o > hmax) hmax = o;
      setStep(steps[i], o, (1 - vin) * 22 - vout * 44);
    }
    const dimLab = 1 - 0.88 * hmax;
    const dim = 1 - 0.56 * hmax;

    // phases
    const poolV = ss(0.085, 0.115, p) * (1 - ss(0.155, 0.18, p));
    const k1 = seg(p, 0.17, 0.26);
    const solid = ss(0.25, 0.275, p);
    const fOpen = seg(p, 0.27, 0.33);
    // the flight to the lanes plays alone, before the LANES heading rises
    const kc = seg(p, KC0, KC1);
    const markOut = ss(0.385, 0.415, p);
    // the dots leave the story (all hidden by now under the mark and the
    // card outlines) for their lanes
    const lanesOn = p > 0.38;
    const labV = ss(0.44, 0.48, p) * (1 - ss(0.805, 0.84, p));
    const grpV = ss(0.455, 0.5, p) * (1 - ss(0.805, 0.84, p));
    const newV = ss(HEAD_NEW - 0.015, HEAD_NEW + 0.02, p) * (1 - ss(0.805, 0.84, p));
    const beta = eio(seg(p, 0.64, 0.745));
    const throatV = ss(0.72, 0.76, p) * (1 - ss(0.8, 0.83, p));
    const m3 = seg(p, 0.8, 0.91);
    const flowV = beta * (1 - ss(0.8, 0.875, p));
    const curveV = ss(0.82, 0.9, p);
    const axisV = ss(0.85, 0.9, p);
    // the head reaches the index by 0.94, so the climax holds before release
    const headS = lerp(0.22, 1, eio(seg(p, 0.845, 0.94)));
    // the index climbs from baseline as it fades in, and lands with the head
    const readV = ss(0.86, 0.9, p);
    const tickV = ss(0.86, 0.94, p);
    const strayA = lerp(0.34, 0.13, ss(0.17, 0.27, p)) * lerp(1, 0.55, ss(0.8, 0.91, p));
    const noiseW = 1 - k1;
    // cards
    const fo = ss(0.72, 1, fOpen);
    const fi = ss(0.85, 1, fOpen);
    const fl = ss(0.32, 0.345, p) * (1 - ss(0.38, 0.393, p));
    const con = ss(0.7, 1, fOpen) * (1 - ss(0.38, 0.395, p));
    const keep = 1 - ss(0.805, 0.84, p);
    const push = Math.sin(Math.PI * seg(fOpen, 0, 0.7)) * MS * 0.07;

    // drifting pools of attention
    for (let k = 0; k < NL; k++) {
      ax[k] = pad + pools[k][0] * (W - 2 * pad) + Math.sin(t * 0.11 + k * 1.7) * 14;
      ay[k] = Fy + pools[k][1] * Fh + Math.cos(t * 0.09 + k * 2.3) * 10;
    }

    /* --- DOM --- */
    const pooled = p < 0.29;
    for (let k = 0; k < NL; k++) {
      const el = laneEls[k];
      if (pooled) put(el, ax[k] + 10, ay[k], poolV * dimLab);
      else {
        const ly = phone ? C[k] - bh - 9 : C[k];
        const lx = phone ? labX + icons[k].w + 8 : labX;
        put(el, lx, ly, labV * dimLab);
      }
    }
    for (let g = 0; g < 3; g++) put(grpEls[g], null, 0, grpV * dimLab);
    for (let j = 0; j < cardEls.length; j++) put(cardEls[j], null, 0, fl * dimLab);
    put(storyEl, null, 0, ss(0.275, 0.3, p) * (1 - ss(0.38, 0.393, p)) * dimLab);
    put(throatEl, null, 0, throatV * dimLab);
    for (let i = 0; i < 4; i++) put(qEls[i], null, 0, axisV * dimLab);
    put(capEl, null, 0, axisV * dimLab);
    put(baseEl, null, 0, axisV * dimLab);
    const hj = headS * (TN - 1), h0 = Math.floor(hj), hf = hj - h0, h1 = Math.min(TN - 1, h0 + 1);
    const hx = lerp(cvX[h0], cvX[h1], hf), hy = lerp(cvY[h0], cvY[h1], hf);
    if (phone) {
      align(readoutEl, "upr");
      put(readoutEl, W - pad, yt - 30, readV * dimLab);
    } else {
      align(readoutEl, "l");
      put(readoutEl, hx + 24, hy, readV * dimLab);
    }
    const val = `${(1 + (AF_INDEX - 1) * curveF(tickV)).toFixed(1)}×`;
    if (val !== lastVal) {
      lastVal = val;
      valueEl.textContent = val;
    }
    const qn = Math.min(3, Math.floor(headS * 4 - 1e-6));
    if (qn !== lastQ) {
      lastQ = qn;
      qEls.forEach((el, i) => {
        if (i === qn) el.dataset.on = "";
        else delete el.dataset.on;
      });
    }
    let st = 0;
    while (st < 4 && p >= STAGE_AT[st + 1]) st++;
    if (st !== curStage) {
      curStage = st;
      tabs.forEach((b, i) => {
        if (i === st) b.setAttribute("aria-current", "step");
        else b.removeAttribute("aria-current");
      });
    }
    if (readEl) {
      const rd = READ[st];
      if (rd !== lastRead) {
        lastRead = rd;
        readEl.textContent = rd;
      }
    }
    progs.forEach((el, i) => {
      const v = i === st ? seg(p, STAGE_AT[i], Math.min(1, STAGE_AT[i + 1])) : 0;
      const s = (Math.round(v * 400) / 400).toString();
      if (el.dataset.v !== s) {
        el.dataset.v = s;
        el.style.transform = `scaleX(${s})`;
      }
    });

    /* --- canvas --- */
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, W, H);

    drawAxis(axisV * dim, hx, hy);

    const AW = A1 - A0;
    if (flowV > 0.002) {
      drawRibbons(flowV * dim, t, !reduced());
      // the qualified stream after the throat
      const tx = A0 + ut * AW;
      c.globalAlpha = flowV * dim;
      c.fillStyle = "rgba(232,86,78,0.12)";
      c.fillRect(tx, Cc - 3.5, A1 - tx, 7);
      c.fillStyle = "rgba(232,86,78,0.75)";
      c.fillRect(tx, Cc - 0.5, A1 - tx, 1);
      c.globalAlpha = 1;
    }

    drawFurniture(labV * dim, grpV * dim);

    // pool markers in the noise
    const mk = poolV * dim;
    if (mk > 0.002) {
      c.globalAlpha = mk;
      c.fillStyle = "#e8564e";
      for (let k = 0; k < NL; k++) c.fillRect(ax[k] - 1.5, ay[k] - 1.5, 4, 4);
      c.globalAlpha = 1;
    }

    // once the cards fly, the fading mark stays under them
    const storyMark = () => {
      if (solid > 0.01 && markOut < 1) {
        drawMark(MX, MY, MS * lerp(1, 0.55, markOut), solid * (1 - markOut) * dim, 0.94, push);
      }
    };
    if (p >= KC0) storyMark();

    // story: the cut from the mark to each format
    if (con > 0.01) {
      c.globalAlpha = dim;
      c.setLineDash([2, 4]);
      c.lineWidth = 1;
      c.strokeStyle = rgba(FOG, 0.3 * con);
      c.beginPath();
      const half = MS / 2 + 10;
      for (const r of cards) {
        const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
        const dx = cx - MX, dy = cy - MY;
        const t0 = Math.min(half / Math.abs(dx || 1e-6), half / Math.abs(dy || 1e-6));
        const t1 = 1 - Math.min((r.w / 2 + 8) / Math.abs(dx || 1e-6), (r.h / 2 + 8) / Math.abs(dy || 1e-6));
        if (t1 <= t0) continue;
        const te = lerp(t0, t1, ss(0.7, 1, fOpen));
        c.moveTo(MX + dx * t0, MY + dy * t0);
        c.lineTo(MX + dx * te, MY + dy * te);
      }
      c.stroke();
      c.setLineDash([]);
      c.globalAlpha = 1;
    }
    // cards: outline, crop marks, contents; then they fly to their lanes.
    // Each is a solid graphite card, drawn still ones first, landed markers
    // next and cards in the air last, so a passing card cleanly covers.
    if (fo > 0.01) {
      c.globalAlpha = dim;
      for (let j = 0; j < cards.length; j++) {
        const kj = flightAt(kc, j);
        flKj[j] = kj;
        flOrd[j] = j;
        flKey[j] = kj <= 0 ? 0 : kj > 0.99 ? 1 : 2 + kj;
      }
      flOrd.sort((a, b) => flKey[a] - flKey[b]);
      for (const j of flOrd) {
        const kj = flKj[j];
        const r = flightRect(j, kj);
        const fa = fo * (kj > 0.99 ? keep : 1);
        if (kj > 0.99) {
          drawIcon(AF_CARDS[j].key, r, fa, false);
        } else {
          c.fillStyle = `rgba(20,21,23,${fa.toFixed(3)})`;
          c.fillRect(Math.round(r.x), Math.round(r.y), Math.round(r.w) + 1, Math.round(r.h) + 1);
          strokeRect(r, PAPER, lerp(0.58, 0.8, kj) * fa);
          // crop marks go as it leaves; the contents ride with the card most
          // of the way, then hand over to the cue the marker keeps
          crop(r, 0.5 * fi * (1 - ss(0, 0.3, kj)));
          cardInner(AF_CARDS[j].key, r, fi * (1 - ss(0.6, 0.85, kj)));
          cue(AF_CARDS[j].key, r, ss(0.6, 0.95, kj) * fa);
        }
      }
      c.globalAlpha = 1;
    }
    // lanes without a card get a drawn marker
    if (newV > 0.01) {
      c.globalAlpha = dim;
      for (let k = 0; k < NL; k++) {
        if (CARD_LANE.includes(k)) continue;
        const r = icons[k], s = lerp(0.6, 1, newV);
        const rs: Rect = { x: r.x + (r.w * (1 - s)) / 2, y: r.y + (r.h * (1 - s)) / 2, w: r.w * s, h: r.h * s };
        drawIcon(AF_LANES[k].icon, rs, newV, true);
      }
      c.globalAlpha = 1;
    }

    /* --- particles --- */
    let vn = 0;
    const sgx = W * (phone ? 0.085 : 0.06), sgy = H * (phone ? 0.05 : 0.075);
    const twOn = !reduced() && noiseW > 0;
    const u = MS / 10, mx0 = MX - MS / 2, my0 = MY - MS / 2;
    const oFade = 1 - ss(0.84, 1, fOpen);
    for (let i = 0; i < drawN; i++) {
      const k = ln[i];
      let x = 0, y = 0, a = 0, col = 0;
      let nxp = 0, nyp = 0, na = 0;
      const needNoise = stray[i] === 1 || k1 < 1;
      if (needNoise) {
        const w = ph[i], A = amp[i], f = fr[i];
        if (cl[i]) {
          nxp = ax[k] + gx[i] * sgx + A * Math.sin(f * t + w);
          nyp = ay[k] + gy[i] * sgy + A * Math.cos(f * 0.83 * t + w * 1.3);
          na = 0.2 + 0.36 * br[i];
        } else {
          nxp = mod(nx[i] * W + dvx[i] * t + A * Math.sin(f * t + w), W);
          nyp = mod(ny[i] * H + dvy[i] * t + A * Math.cos(f * 0.83 * t + w * 1.3), H);
          na = 0.12 + 0.3 * br[i];
        }
      }
      if (stray[i]) {
        vn = slot(vn, nxp, nyp, strayA * br[i], 0, sz[i]);
        continue;
      }
      // its place in the mark
      const cell = MARK_CELLS[mc[i]];
      const cdx = (cell[0] + cell[2] / 2 - 5) / 5, cdy = (cell[1] + cell[3] / 2 - 5) / 5;
      const mxp = mx0 + (cell[0] + mu[i] * cell[2]) * u + cdx * push;
      const myp = my0 + (cell[1] + mv[i] * cell[3]) * u + cdy * push;
      const lu = frac(u0[i] + t * AF_LANES[k].speed * sp[i]);
      if (!lanesOn) {
        // noise, condensing into the mark, then out to the card outlines
        const kk = eio(seg(k1, dl[i] * 0.4, dl[i] * 0.4 + 0.6));
        x = lerp(nxp, mxp, kk);
        y = lerp(nyp, myp, kk) + Math.sin(kk * Math.PI) * arc[i];
        a = lerp(na, (0.35 + 0.55 * br[i]) * (1 - solid), kk);
        col = kk > 0.55 ? (mc[i] === 4 ? C_SIG : C_PAPER) : 0;
        if (twOn && tw[i] && kk < 0.5) {
          const tws = Math.pow(Math.max(0, Math.sin(t * 0.7 + ph[i] * 5)), 14) * noiseW;
          a += tws * 0.6;
          if (tws > 0.3) col = C_PAPER;
        }
        if (oc[i] !== 255 && fOpen > 0) {
          const e = eio(seg(fOpen, ost[i], ost[i] + 0.6));
          if (e > 0) {
            const dx = ox[i] - mxp, dy = oy[i] - myp, dd = Math.hypot(dx, dy) || 1;
            const sw = Math.sin(Math.PI * e) * osw[i];
            x = mxp + dx * e - (dy / dd) * sw;
            y = myp + dy * e + (dx / dd) * sw;
            a = 0.85 * oFade;
            col = C_PAPER;
          }
        }
      } else {
        const ef = ss(0, 0.045, lu) * (1 - ss(0.94, 1, lu));
        const lx = A0 + lu * AW;
        let g = 1, ws = 1;
        if (beta > 0 && lu > um) {
          const f = lu >= ut ? 1 : sm5((lu - um) / (ut - um));
          g = 1 - beta * f * (1 - gT);
          ws = 1 - beta * f * (1 - wT);
        }
        const ly = Cc + (C[k] - Cc) * g + off[i] * bh * ws;
        let la = 0.3 + 0.55 * br[i], mix = 0;
        if (beta > 0) {
          if (qd[i]) mix = beta * ss(um + 0.12, ut, lu);
          else la *= 1 - beta * ss(um + 0.04, ut - 0.01, lu);
        }
        // into the lane through its head (as its card lands there), then
        // out along it, so each lane grows rightward from its marker
        const ar = headAt[k] + dl[i] * HEAD_JIT;
        const e2 = seg(p, ar, ar + OUT_T);
        if (e2 < 1) {
          const e1 = seg(p, ar - IN_T, ar);
          if (e1 < 1) {
            const q = eio(e1);
            const sx0 = oc[i] !== 255 ? ox[i] : mxp, sy0 = oc[i] !== 255 ? oy[i] : myp;
            x = lerp(sx0, A0, q);
            y = lerp(sy0, ly, q) + Math.sin(q * Math.PI) * arc[i] * 0.5;
            a = la * 0.6 * ss(0.3, 1, e1);
            col = q < 0.5 && oc[i] === 255 ? (mc[i] === 4 ? C_SIG : C_PAPER) : 0;
          } else {
            const q = 1 - Math.pow(1 - e2, 3);
            x = lerp(A0, lx, q);
            y = ly;
            a = la * lerp(0.6, ef, q);
            col = hi[i] ? C_PAPER : 0;
          }
        } else if (m3 > 0) {
          const kq = eio(seg(m3, dl[i] * 0.4, dl[i] * 0.4 + 0.6));
          if (qd[i]) {
            const s = frac(ps0[i] + t * 0.05 * sp[i]);
            const cj = s * headS * (TN - 1), j0 = cj | 0, jf = cj - j0, j1 = Math.min(TN - 1, j0 + 1);
            const sprd = Math.pow(1 - s, 1.25) * spread + 0.5;
            const px = lerp(cvX[j0], cvX[j1], jf) + lerp(cvNX[j0], cvNX[j1], jf) * pof[i] * sprd;
            const py = lerp(cvY[j0], cvY[j1], jf) + lerp(cvNY[j0], cvNY[j1], jf) * pof[i] * sprd;
            const pa = (0.42 + 0.58 * br[i]) * ss(0, 0.06, s) * (1 - 0.9 * ss(0.93, 1, s));
            x = lerp(lx, px, kq);
            y = lerp(ly, py, kq);
            a = lerp(la * ef, pa, kq);
            mix = lerp(mix, 1, Math.min(1, kq * 1.6));
          } else {
            x = lx; y = ly;
            a = la * ef * (1 - kq);
          }
          col = mix > 0.02 ? Math.round(1 + mix * 4) : 0;
        } else {
          x = lx; y = ly;
          a = la * ef;
          col = mix > 0.02 ? Math.round(1 + mix * 4) : hi[i] && beta < 0.5 ? C_PAPER : 0;
        }
      }
      vn = slot(vn, x, y, a, col, sz[i]);
    }
    flush(vn, dim);

    // the mark, over the dots that made it (until the cards take off)
    if (p < KC0) storyMark();

    // demand curve
    if (curveV > 0.002) drawCurve(curveV * dim, Math.max(1, Math.round(headS * (TN - 1))), hx, hy);

    // the one bright point: funnel throat, then the head of the curve
    if (beta > 0.002) {
      const tx = A0 + ut * AW;
      const km = eio(m3);
      drawPoint(lerp(tx, hx, km), lerp(Cc, hy, km), lerp(1, 1.35, km), beta * dim, t, !reduced());
    }
  }

  /* ---------- still frame: lanes, funnel and the rising curve ---------- */
  const T0 = 24;
  function renderStill() {
    const c = ctx;
    const t = T0;
    const AW = A1 - A0;
    const tx = A0 + ut * AW;
    // DOM
    for (let k = 0; k < NL; k++) {
      align(laneEls[k], "l");
      put(laneEls[k], labX, C[k], 1);
    }
    for (let g = 0; g < 3; g++) put(grpEls[g], null, 0, 1);
    put(throatEl, null, 0, 1);
    for (let i = 0; i < 4; i++) put(qEls[i], null, 0, 1);
    qEls.forEach((el) => delete el.dataset.on);
    qEls[3].dataset.on = "";
    put(capEl, null, 0, 1);
    put(baseEl, null, 0, 1);
    const hx = cvX[TN - 1], hy = cvY[TN - 1];
    if (stillCurveSplit) {
      align(readoutEl, "upr");
      put(readoutEl, hx - 18, hy - 2, 1);
    } else {
      align(readoutEl, "upr");
      put(readoutEl, hx + 4, hy - 22, 1);
    }
    valueEl.textContent = `${AF_INDEX.toFixed(1)}×`;

    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, W, H);
    drawAxis(1, hx, hy);
    drawRibbons(1, t, false);
    // the qualified stream: straight on to the edge when the curve has its own panel
    if (stillCurveSplit) {
      c.fillStyle = "rgba(232,86,78,0.12)";
      c.fillRect(tx, Cc - 3.5, W - tx, 7);
      c.fillStyle = "rgba(232,86,78,0.75)";
      c.fillRect(tx, Cc - 0.5, W - tx, 1);
    }
    drawFurniture(1, 1);
    if (iconS > 0) {
      for (let k = 0; k < NL; k++) {
        const fresh = !CARD_LANE.includes(k);
        drawIcon(AF_LANES[k].icon, icons[k], 0.9, fresh);
      }
    }
    let vn = 0;
    for (let i = 0; i < N; i++) {
      const k = ln[i];
      if (stray[i]) {
        const x = mod(nx[i] * W + dvx[i] * t, W), y = mod(ny[i] * H + dvy[i] * t, H);
        vn = slot(vn, x, y, 0.1 * br[i], 0, sz[i]);
        continue;
      }
      const lu = frac(u0[i] + t * AF_LANES[k].speed * sp[i]);
      if (lu <= ut + 0.01 || !qd[i]) {
        const uu = Math.min(lu, ut + 0.01);
        const ef = ss(0, 0.045, lu);
        let g = 1, ws = 1;
        if (uu > um) {
          const f = uu >= ut ? 1 : sm5((uu - um) / (ut - um));
          g = 1 - f * (1 - gT);
          ws = 1 - f * (1 - wT);
        }
        const ly = Cc + (C[k] - Cc) * g + off[i] * bh * ws;
        let la = (0.3 + 0.55 * br[i]) * ef, mix = 0;
        if (qd[i]) mix = ss(um + 0.12, ut, uu);
        else la *= 1 - ss(um + 0.04, ut - 0.01, uu);
        if (lu <= ut + 0.01) vn = slot(vn, A0 + uu * AW, ly, la, mix > 0.02 ? Math.round(1 + mix * 4) : 0, sz[i]);
      }
      if (qd[i]) {
        // and every qualified dot on the curve
        const s = ps0[i];
        const cj = s * (TN - 1), j0 = cj | 0, jf = cj - j0, j1 = Math.min(TN - 1, j0 + 1);
        const sprd = Math.pow(1 - s, 1.25) * spread + 0.5;
        const px = lerp(cvX[j0], cvX[j1], jf) + lerp(cvNX[j0], cvNX[j1], jf) * pof[i] * sprd;
        const py = lerp(cvY[j0], cvY[j1], jf) + lerp(cvNY[j0], cvNY[j1], jf) * pof[i] * sprd;
        const pa = (0.42 + 0.58 * br[i]) * ss(0, 0.06, s) * (1 - 0.9 * ss(0.93, 1, s));
        vn = slot(vn, px, py, pa, C_SIG, sz[i]);
      }
    }
    flush(vn, 1);
    drawCurve(1, TN - 1, hx, hy);
    if (!stillCurveSplit) drawPoint(tx, Cc, 0.7, 0.5, t, false);
    drawPoint(hx, hy, 1.2, 1, t, false);
  }

  /* ---------- loop ---------- */
  // The drift runs while the stage is pinned and on screen, and stops off
  // screen and in a hidden tab; reduced motion never gets here.
  let running = false, raf = 0, lastP = -1;
  const tStart = performance.now();
  let slow = 0, lastNow = 0;
  const clock = (now: number) => T0 + (now - tStart) / 1000;

  let trackTop = 0;
  function progress() {
    const r = track.getBoundingClientRect();
    trackTop = r.top;
    const span = r.height - H;
    return span > 0 ? clamp(-r.top / span, 0, 1) : 0;
  }
  function tick(now: number) {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    const p = progress();
    // the observer counts a section touching the fold as on screen: draw
    // nothing until it is in (resize() drew the first frame)
    if (trackTop >= window.innerHeight - 1) {
      lastNow = 0;
      return;
    }
    // shed dots if the device can't hold the frame rate
    if (lastNow) {
      const dt = now - lastNow;
      slow = dt > 30 && dt < 200 ? slow + 1 : Math.max(0, slow - 1);
      if (slow > 45 && drawN > N * 0.55) {
        drawN = Math.round(drawN * 0.85);
        slow = 0;
      }
    }
    lastNow = now;
    render(p, clock(now));
    lastP = p;
  }
  function start() {
    if (running || !pinned || document.hidden) return;
    running = true;
    lastNow = 0;
    raf = requestAnimationFrame(tick);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function readMono() {
    const f = getComputedStyle(laneEls[0]).fontFamily;
    if (f) mono = f;
  }

  function resize() {
    const w = fig.clientWidth, h = fig.clientHeight;
    if (!w || !h) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = w;
    H = h;
    // pinned, the stage is 100lvh and the stage texts' box 100svh
    const sv = pinned ? (steps[0].parentElement?.clientHeight ?? 0) : 0;
    Hs = sv > 0 && sv < h ? sv : h;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    readMono();
    const target = Math.round(clamp((w * h) / (w < 700 ? 130 : 150), 1200, 8400));
    if (!N || Math.abs(target - N) > N * 0.12) build(target);
    if (pinned) {
      layoutPinned();
      curStage = -1;
      lastQ = -1;
      render(lastP < 0 ? progress() : lastP, clock(performance.now()));
    } else {
      layoutStill();
      placeFixed();
      renderStill();
    }
  }

  /*
    Where the track sits on the page and where the reader was, cached on
    scroll (and on resizes that keep the mode). When the mode flips (a phone
    rotates, a window gets short, reduced motion toggles) the track changes
    height by thousands of pixels, so syncMode puts the reader back: inside
    the field they land at its start, below it they stay on the same content.
    Like the services fold's keepPlace.
  */
  let geo = { top: 0, h: 0, y: 0, vh: 0 };
  const snap = () => {
    const r = track.getBoundingClientRect();
    geo = { top: r.top + window.scrollY, h: track.offsetHeight, y: window.scrollY, vh: window.innerHeight };
  };
  const keepPlace = () => {
    const was = geo;
    if (!was.h) return snap();
    const r = track.getBoundingClientRect();
    const top = r.top + window.scrollY;
    const h = track.offsetHeight;
    if (was.y > was.top && was.y < was.top + was.h - was.vh) {
      window.scrollTo({ top, behavior: "instant" });
    } else if (was.y >= was.top + was.h - was.vh) {
      window.scrollTo({ top: was.y + (top + h) - (was.top + was.h), behavior: "instant" });
    }
    snap();
  };

  function syncMode() {
    const next = !reduced() && pinMQ.matches;
    if (next === pinned && N) return;
    const flipped = N > 0;
    pinned = next;
    stop();
    clearInline();
    lastP = -1;
    curStage = -1;
    if (pinned) {
      tabs.forEach((b, i) => {
        if (i === 0) b.setAttribute("aria-current", "step");
        else b.removeAttribute("aria-current");
      });
    } else {
      tabs.forEach((b) => b.removeAttribute("aria-current"));
      for (const el of steps) {
        el.style.opacity = "";
        el.style.transform = "";
      }
    }
    resize();
    if (flipped) keepPlace();
    else snap();
    if (pinned && visible) start();
  }

  /* ---------- wiring ---------- */
  let visible = false;
  // A resize that keeps the mode re-caches the geometry; a flip is handled
  // by syncMode (media query changes are reported before resize observers)
  const ro = new ResizeObserver(() => {
    resize();
    if ((!reduced() && pinMQ.matches) === pinned) snap();
  });
  ro.observe(fig);
  const onScroll = () => snap();
  window.addEventListener("scroll", onScroll, { passive: true });
  const io = new IntersectionObserver(
    (es) => {
      for (const e of es) {
        visible = e.isIntersecting;
        if (visible) start();
        else stop();
      }
    },
    { rootMargin: "0px" },
  );
  io.observe(root);
  pinMQ.addEventListener("change", syncMode);
  reducedMQ.addEventListener("change", syncMode);
  const onVis = () => {
    if (document.hidden) stop();
    else if (visible) start();
  };
  document.addEventListener("visibilitychange", onVis);

  const onTab = (i: number) => () => {
    if (!pinned) return;
    const r = track.getBoundingClientRect();
    const span = r.height - H;
    const top = window.scrollY + r.top + TAB_TO[i] * span + 1;
    window.scrollTo({ top, behavior: "smooth" });
  };
  const handlers = tabs.map((b, i) => {
    const fn = onTab(i);
    b.addEventListener("click", fn);
    return fn;
  });

  let alive = true;
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (!alive || !W) return;
      readMono();
      if (pinned) {
        // label widths were measured in the fallback face
        layoutPinned();
        lastP = -1;
        render(progress(), clock(performance.now()));
      } else {
        layoutStill();
        placeFixed();
        renderStill();
      }
    });
  }

  syncMode();

  return () => {
    alive = false;
    stop();
    ro.disconnect();
    io.disconnect();
    pinMQ.removeEventListener("change", syncMode);
    reducedMQ.removeEventListener("change", syncMode);
    window.removeEventListener("scroll", onScroll);
    tabs.forEach((b, i) => b.removeEventListener("click", handlers[i]));
    document.removeEventListener("visibilitychange", onVis);
  };
}
