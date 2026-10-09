import {
  CHANNEL,
  CHANNELS,
  MOSAIC_TALL,
  MOSAIC_WIDE,
  PHONE_SEARCH,
  mosaicJogs,
  mosaicLayout,
  type ChannelKey,
  type MosaicLayout,
} from "@/lib/channels";

/*
  The Attention Field: the engine behind the section that follows the hero
  (src/components/home/attention-field.tsx).

  One canvas of dots tells the distribution story in five scroll-scrubbed
  stages:
    NOISE   attention gathers, loosely, round nine markers, one per
            surface. The mesh answers a fine pointer (a soft lens that
            pushes the nearest dots aside and lights them), and each
            marker can be picked up and dragged on its own: the mesh parts
            round it as it does round the pointer, no dots follow it, and
            let go it eases home (see "touch" below)
    STORY   the dots settle into one master frame, an even dot screen; a
            beat, then a blade cuts it along the gutters of a mosaic, one
            cut after another, outermost first, the pieces parting behind
            it like a cut sheet; another beat, the red cuts fading, and
            only then does each piece develop into a live recording of
            that one story in one format (the channel tiles: an AI answer,
            a search result, a reel...)
    LANES   the recordings hand over to the heads of nine lanes (owned,
            earned, paid): one by one each shrinks in place and slides to
            its head, and its lane pours out of it as it lands
    SYSTEM  the lanes bend into one funnel; what passes through turns red
    DEMAND  the red stream rises along one curve: qualified demand as an
            index over baseline (illustrative, never inquiries or pipeline),
            and the one link, to the method, arrives with the readout

  Framework-free. mountAttentionField finds its parts inside `root` by data
  attributes, draws only while on screen in a visible tab (no pause control,
  as with the hero and footer glass), caps DPR at 2, sizes the particle
  count to the area, and reads only the track's rect per frame. The tiles
  are DOM (components/home/channel-tiles.tsx): pinned, the engine places
  each with a transform and lets it play (data-play) only while it shows
  in the STORY mosaic, its scene loops (data-fx) only near full size.
  Unpinned (reduced motion, or a screen too short to pin) it draws one
  still frame of the whole system instead, and the tiles sit in their
  static mosaic as still frames (data-still).
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
/** The share of a surface's dots that gather round its marker in the noise */
const POOL_SHARE = 0.55;
/** Their spread (one sigma) as a share of the stage's width and height:
    phones, then wider screens */
const POOL_SX = [0.078, 0.054] as const, POOL_SY = [0.046, 0.07] as const;
/** The aspect of a drawn head (a lane with no tile; every head in the
    still frame takes its tile's from lib/channels.ts) */
const HEAD_AR: Record<AfIcon, number> = {
  search: 16 / 9, reel: 9 / 16, film: 16 / 9, ai: 0.8, press: 0.8, feed: 1, creator: 0.8, ooh: 3, events: 1.5,
};
const NT = CHANNELS.length;
/** Each lane's tile (-1: none, it keeps a drawn head), and each tile's lane */
const LANE_TILE = AF_LANES.map((L) => CHANNELS.findIndex((c) => c.lane === L.name));
const TILE_LANE = CHANNELS.map((c) => AF_LANES.findIndex((L) => L.name === c.lane));

/* The scroll timeline. The track's scroll fraction (0..1) times T_LEN is
   the timeline's p, so 0.01 of p is always the same distance (4.6% of a
   screen: about 41px on a 900px one). The track is 615svh (see
   attention-field.module.css), the stage one screen: STORY was given 0.07
   more p for its cuts, and another 0.05 for the beat that holds the
   finished cut grid before the tiles, everything after it moving on by
   each.
   Five stages; each heading rises in at its stage's start, holds while the
   visual changes under it (dimmed), then lifts away and the visual holds
   the stage on its own. */
// STORY gets the longest stretch: its heading has lifted before the cuts
// are made, so the frame, the cuts and the mosaic of recordings hold the
// stage on their own, and the tiles reach their lanes before LANES rises.
// LANES lifts early so the nine lanes hold the stage on their own (0.66 to
// 0.72) before SYSTEM bends them.
const T_LEN = 1.12;
const HEAD: readonly [number, number, number, number][] = [
  [-1, 0, 0.06, 0.1],
  [0.165, 0.195, 0.222, 0.245],
  [0.588, 0.608, 0.635, 0.66],
  [0.72, 0.75, 0.805, 0.835],
  [0.905, 0.935, 0.985, 1.02],
];
/** The link to the method: in over END0..END1, and where focusing it lands */
const END0 = 1.02, END1 = 1.06, END_AT = 1.08;
/* STORY, in p. The dots settle into one master frame over G0..G1 (under
   the heading), an even dot screen, and it holds alone for a beat once the
   heading has gone. The blade then makes the mosaic's cuts one after
   another, outermost first, each a red line run the length of its gutter
   over CUT_T, all inside CUT0..CUT1: behind the blade the gutter opens,
   each piece's points closing up into its tile's rectangle (a dot takes
   OPEN_T to move, parting a little past it and settling) and its cut edge
   staying lit. The red lines stay until the last cut is through, and the
   finished cut grid then holds, lines lit and dots showing, for a second
   beat (CUT1..FADE0: 0.05 of p, some 205px of scroll on a 900px screen),
   so the cuts are read well before anything develops. Only then do the red
   lines fade (FADE0..FADE1), leaving the frame in pieces, and each piece
   develops into its recording over DEV_T from DEV0, top to bottom, in the
   order the story is told (CHANNELS), and a line under the mosaic says
   Halden is a sample (NOTE0..). The finished mosaic, the recordings the
   reader came for, holds and plays for the longest stretch of STORY (about
   0.09 of p: some 390px of scroll on a 900px screen, DEV0 + NT·DEV_STG +
   DEV_T to KC0). Then the tiles hand over to the lanes' heads over
   KC0..KC1, one after another (FL_STG apart, nearest the lanes first, so
   the column of heads is clear before anything lands in it): each shrinks
   in place to its head's size, then slides to the head, on top of every
   tile bound for a lower lane (see flightRect). Its lane pours out of it
   as it lands. A tile plays until it leaves the mosaic, then holds its
   frame: in flight it is one raster the compositor scales, and as a head a
   few dozen pixels tall it costs nothing. */
const G0 = 0.17, G1 = 0.244;
const CUT0 = 0.262, CUT1 = 0.326, CUT_T = 0.012, OPEN_T = 0.008;
const FADE0 = CUT1 + 0.05, FADE1 = FADE0 + 0.014;
const DEV0 = 0.394, DEV_STG = 0.005, DEV_T = 0.014;
const NOTE0 = 0.42, NOTE1 = 0.436;
const KC0 = 0.532, KC1 = 0.59, FL_STG = 0.1;
/** When a lane with no tile opens: its drawn head is in */
const HEAD_NEW = 0.56;
/** A dot's run into its lane (in p): on a phone down out of its head
    (IN_T), then along the lane (OUT_T); a lane starts to pour when its
    tile is POUR_AT through its flight */
const IN_T = 0.012, OUT_T = 0.034, HEAD_JIT = 0.024, POUR_AT = 0.86;
/** A point of the master frame's light: FRAME_A + FRAME_B × its dot's brightness */
const FRAME_A = 0.34, FRAME_B = 0.34;
/** The scene loops in a tile run only at this scale or more */
const FX_SCALE = 0.8;

/* Touch, in NOISE only. The lens: radius in CSS px, and how far it pushes
   the dot at its centre, as a share of the radius (under 0.5, so the dots
   never cross: a clean hole with a lit, crowded rim). The springs are
   stiffness and damping per second: each dot's give, and a dropped
   marker's glide home (damped just short of critical, so it settles
   without a bounce). */
const LENS_R = 110, LENS_R_PHONE = 84, LENS_PUSH = 0.42;
const DOT_K = 110, DOT_C = 9.5;
const MK_K = 110, MK_C = 19;

/* ---------- palette ---------- */
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
  const laneEls = all("[data-af-lane]");
  const grpEls = all("[data-af-group]");
  const throatQ = one("[data-af-throat]");
  const readoutQ = one("[data-af-readout]");
  const valueQ = one("[data-af-value]");
  const endQ = one("[data-af-end]");
  // the recordings (components/home/channel-tiles.tsx), in CHANNELS order
  const tilesRoot = one("[data-af-tiles]");
  const tileEls = CHANNELS.map((c) => one(`[data-af-tile="${c.key}"]`));
  // the line under the mosaic: Halden is a sample
  const noteEl = one("[data-af-note]");
  const ctxQ = canvasQ ? canvasQ.getContext("2d") : null;
  if (
    !trackQ || !figQ || !canvasQ || !ctxQ || !throatQ || !readoutQ || !valueQ || !endQ ||
    steps.length !== AF_STAGES.length || laneEls.length !== NL || grpEls.length !== 3
  ) {
    return () => {};
  }
  // Non-null from here on, also inside the hoisted helpers below
  const track: HTMLElement = trackQ;
  const fig: HTMLElement = figQ;
  const canvas: HTMLCanvasElement = canvasQ;
  const ctx: CanvasRenderingContext2D = ctxQ;
  const throatEl: HTMLElement = throatQ;
  const readoutEl: HTMLElement = readoutQ;
  const valueEl: HTMLElement = valueQ;
  const endEl: HTMLElement = endQ;
  const labelEls = [...laneEls, ...grpEls, throatEl, readoutEl];
  const tiles = tileEls.filter((el): el is HTMLElement => el !== null);

  /* ---------- state ---------- */
  const pinMQ = window.matchMedia(AF_PIN_QUERY);
  const reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = () => reducedMQ.matches;
  let pinned = false;
  let W = 0, H = 0, dpr = 1, phone = false;
  // Hs: the part of the stage always on screen (svh), H: the whole (lvh)
  let pad = 24, Fy = 0, Fh = 0, Hs = 0;
  let laneWs: number[] = [];
  // headsOn: the lanes have heads; headR: their right edge (iconX, pinned
  // phones: their left)
  let A0 = 0, A1 = 0, grpX = 0, brX = 0, labX = 0, iconX = 0, headR = 0, headsOn = true;
  let pitch = 50, bh = 12, Cc = 0, um = 0.38, ut = 0.78;
  const gT = 0.016, wT = 0.11;
  const C = new Float32Array(NL);
  let pools = POOLS_DESK;
  const ax = new Float32Array(NL), ay = new Float32Array(NL);
  // demand curve
  const TN = 241;
  const cvX = new Float32Array(TN), cvY = new Float32Array(TN), cvNX = new Float32Array(TN), cvNY = new Float32Array(TN);
  let xL = 0, xR = 0, yb = 0, yt = 0, spread = 20;
  // story: the mosaic (its frame, the tiles' places and the cuts), which
  // tiles it shows, and each lane's head (a tile at the end of its flight,
  // or a drawn thumbnail)
  let lay: MosaicLayout = { frame: { x: 0, y: 0, w: 0, h: 0 }, tiles: {}, cuts: [], scale: {}, aspect: {} };
  const shown = new Uint8Array(NT);
  const tR: Rect[] = CHANNELS.map(() => ({ x: 0, y: 0, w: 0, h: 0 }));
  // each tile's aspect in the mosaic (a flexible one's can differ from
  // CHANNELS), its piece of the master frame (the tile and half of each
  // gutter round it) and the cuts on its four sides (255: the frame's edge)
  const tAR = CHANNELS.map((c) => c.aspect);
  // and its nominal width (a phone reflows the answer and the search)
  const tNW = CHANNELS.map((c) => c.w);
  const reg: Rect[] = CHANNELS.map(() => ({ x: 0, y: 0, w: 0, h: 0 }));
  const sideCut = CHANNELS.map(() => new Uint8Array(4).fill(255));
  let heads: Rect[] = AF_LANES.map(() => ({ x: 0, y: 0, w: 0, h: 0 }));
  // when each cut starts and each tile develops (p), each tile's place in
  // the departure order, and when each lane opens
  let cutAt: number[] = [];
  const devAt = new Float32Array(NT);
  const rank = new Float32Array(NT);
  let flStg = 0;
  const headAt = new Float32Array(NL);
  // still
  let stillCurveSplit = false;
  // the link's height
  let endH = 40;

  // touch (NOISE only; the handlers and the step are under "touch" below).
  // The pointer in client px, and the lens' eased centre, radius and
  // strength in stage px
  let ptrCX = 0, ptrCY = 0, hover = false;
  let lensX = 0, lensY = 0, lensR = LENS_R, lensA = 0;
  // some dot still has give to spend
  let jOn = false;
  // Each marker, as an offset from its pool's home, and its velocity: only
  // a marker moves when it is dragged, never its pool's dots
  const mkX = new Float32Array(NL), mkY = new Float32Array(NL), mkVX = new Float32Array(NL), mkVY = new Float32Array(NL);
  // the marker in hand (-1 none), its pointer, and where on it it was taken
  let dragK = -1, dragId = -1, grabDX = 0, grabDY = 0;
  // where the stage sits in the viewport (read with the track's rect)
  let stageL = 0, stageT = 0;

  // particles
  let N = 0, drawN = 0;
  let stray = new Uint8Array(0), ln = new Uint8Array(0), qd = new Uint8Array(0), cl = new Uint8Array(0);
  let hi = new Uint8Array(0), tw = new Uint8Array(0);
  let gx = new Float32Array(0), gy = new Float32Array(0), nx = new Float32Array(0), ny = new Float32Array(0);
  let dvx = new Float32Array(0), dvy = new Float32Array(0), amp = new Float32Array(0), fr = new Float32Array(0);
  let ph = new Float32Array(0), u0 = new Float32Array(0), sp = new Float32Array(0), off = new Float32Array(0);
  let br = new Float32Array(0), sz = new Float32Array(0), dl = new Float32Array(0), arc = new Float32Array(0);
  let ps0 = new Float32Array(0), pof = new Float32Array(0);
  // story: each dot's point in the master frame (fp), the piece it belongs
  // to (ft) and where in that piece (fu, fv: 0..1 across it); fdup marks a
  // dot beyond the frame's points, which dissolves as it arrives
  let fpx = new Float32Array(0), fpy = new Float32Array(0), fu = new Float32Array(0), fv = new Float32Array(0);
  let ft = new Uint8Array(0), fdup = new Uint8Array(0);
  // the frame's dot pitch (px)
  let fPitch = 12;
  // touch: each dot's give (displacement, velocity)
  let jx = new Float32Array(0), jy = new Float32Array(0), jvx = new Float32Array(0), jvy = new Float32Array(0);
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
    stray = U8(); ln = U8(); qd = U8(); cl = U8(); hi = U8(); tw = U8();
    gx = F(); gy = F(); nx = F(); ny = F(); dvx = F(); dvy = F(); amp = F(); fr = F(); ph = F();
    u0 = F(); sp = F(); off = F(); br = F(); sz = F(); dl = F(); arc = F(); ps0 = F(); pof = F();
    fpx = F(); fpy = F(); fu = F(); fv = F(); ft = U8(); fdup = U8();
    jx = F(); jy = F(); jvx = F(); jvy = F();
    jOn = false;
    sx = new Float32Array(2 * n); sy = new Float32Array(2 * n); ss2 = new Float32Array(2 * n);
    sb = new Uint16Array(2 * n); order = new Int32Array(2 * n);
    const cum: number[] = [];
    let acc = 0;
    for (const L of AF_LANES) cum.push((acc += L.share));
    // A few strays drift over the whole field; about half of each
    // surface's attention gathers loosely round its marker, enough for the
    // field to read as nine surfaces and no more (no lit core: nothing
    // reads as a body that belongs to the marker); the rest wander
    for (let i = 0; i < n; i++) {
      stray[i] = r() < 0.04 ? 1 : 0;
      const x = r() * acc;
      let k = 0;
      while (k < NL - 1 && x > cum[k]) k++;
      ln[i] = k;
      qd[i] = !stray[i] && r() < AF_LANES[k].qual ? 1 : 0;
      cl[i] = !stray[i] && r() < POOL_SHARE ? 1 : 0;
      hi[i] = r() < 0.05 ? 1 : 0;
      tw[i] = r() < 0.05 ? 1 : 0;
      r(); // a spare draw: keeps every later one, and so the field's look, stable
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
    }
  }

  /* ---------- layout: pinned ---------- */
  function layoutPinned() {
    phone = W < 700;
    pools = phone ? POOLS_PHONE : POOLS_DESK;
    pad = phone ? 16 : Math.max(clamp(W * 0.036, 24, 64), (W - 1440) / 2 + 48);
    // the composition keeps to the always-visible part of the stage; the
    // dots of the noise still reach the floor under a collapsed toolbar
    const top = phone ? 92 : 100, bot = phone ? 60 : 72;
    Fy = top;
    Fh = Hs - top - bot;
    headsOn = true;
    if (phone) {
      grpX = pad + 4; brX = pad + 13; A0 = pad + 32; A1 = W - pad; labX = A0;
      iconX = labX;
    } else {
      grpX = pad; brX = pad + 72; labX = pad + 88; A0 = pad + 292; A1 = W - pad - 64;
      headR = A0 - 30;
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
    layoutStory();
    layoutHeads();
    assignFrame();
    orderStory();
    placeFixed();
  }
  /** A lane's head takes its tile's aspect as the mosaic shows it */
  const headAspect = (k: number) => {
    const j = LANE_TILE[k];
    if (j < 0) return HEAD_AR[AF_LANES[k].icon];
    return pinned && shown[j] ? tAR[j] : CHANNELS[j].aspect;
  };

  /**
   * Each lane's head, in its tile's aspect: right-aligned on one column
   * before the lane (pinned phones: left of the name, over the lane)
   */
  function layoutHeads() {
    let h0: number, maxW: number;
    if (pinned && phone) {
      h0 = 15;
      maxW = 30;
    } else if (pinned) {
      h0 = Math.round(clamp(pitch * 0.58, 22, 36));
      maxW = Math.round(h0 * 1.8);
    } else {
      h0 = Math.round(clamp(pitch * 0.42, 12, 20));
      maxW = Math.round(h0 * 1.8);
    }
    heads = AF_LANES.map((_, k) => {
      const ar = headAspect(k);
      let w = h0 * ar, h = h0;
      if (w > maxW) {
        w = maxW;
        h = w / ar;
      }
      if (pinned && phone) return { x: iconX, y: C[k] - bh - 9 - h / 2, w, h };
      return { x: headR - w, y: C[k] - h / 2, w, h };
    });
  }

  /**
   * Phones (MOSAIC_PHONE): the answer, a row of footage (the reel beside
   * the film, or beside the billboard on a short phone) and the search,
   * each full width but the row. The answer and the search keep their body
   * type at 11px or more (the answer a scale of 0.9 or more, the search
   * 0.94), both reflowed to the width (the search to a narrower page,
   * PHONE_SEARCH); the row, which has no small type, takes the height it
   * needs at the width. The answer takes what its written answer needs
   * (about 1:1.12; a short phone crops its foot, see the tiles' CSS), the
   * search PHONE_SEARCH's aspect or, given the room, more of its page. The
   * film's row is tried first, then the billboard's, then no row at all (a
   * very short phone shows the pair); if even that does not fit, both shrink
   * together.
   */
  function phoneLayout(box: Rect, g: number): MosaicLayout {
    const sized = (w: number, foot: ChannelKey | null) => {
      const sA = clamp(w / CHANNELS[0].w, 0.9, 1.1), sS = clamp(w / PHONE_SEARCH.w, 0.94, 1.1);
      const minA = w * 0.82;
      const aspects = foot ? CHANNEL.reel.aspect + CHANNEL[foot].aspect : 0;
      const hR = foot ? (w - g) / aspects : 0;
      const room = box.h - (foot ? hR + g : 0);
      let hS = w / PHONE_SEARCH.aspect;
      let hA = Math.min(w * 1.12, room - g - hS);
      if (hA < minA) {
        hS = Math.max(w / 1.9, room - g - minA);
        hA = Math.max(minA, room - g - hS);
      } else hS = Math.min(w / 1.3, room - g - hA);
      return { sA, sS, hA, hS, hR, h: hA + g + (foot ? hR + g : 0) + hS };
    };
    let w = box.w;
    const foot: (ChannelKey | null)[] = ["film", "ooh", null];
    // the first row whose pair fits at the full width; none: the pair, shrunk
    let f = foot.find((k) => sized(w, k).h <= box.h + 0.5);
    if (f === undefined) {
      f = null;
      for (let pass = 0; pass < 3 && sized(w, f).h > box.h + 0.5; pass++) w *= box.h / sized(w, f).h;
    }
    const z = sized(w, f);
    const x = box.x + (box.w - w) / 2, y = box.y + Math.max(0, (box.h - z.h) / 2);
    const tiles: MosaicLayout["tiles"] = { answer: { x, y, w, h: z.hA } };
    const scale: MosaicLayout["scale"] = { answer: z.sA, search: z.sS };
    const aspect: MosaicLayout["aspect"] = { answer: w / z.hA, search: w / z.hS };
    const cuts: MosaicLayout["cuts"] = [{ x, y: y + z.hA, w, h: g, depth: 0, vertical: false }];
    let at = y + z.hA + g;
    if (f) {
      const wr = z.hR * CHANNEL.reel.aspect, wf = z.hR * CHANNEL[f].aspect;
      tiles.reel = { x, y: at, w: wr, h: z.hR };
      tiles[f] = { x: x + wr + g, y: at, w: wf, h: z.hR };
      for (const k of ["reel", f] as const) {
        scale[k] = (tiles[k] as Rect).w / CHANNEL[k].w;
        aspect[k] = CHANNEL[k].aspect;
      }
      cuts.push({ x: x + wr, y: at, w: g, h: z.hR, depth: 1, vertical: true });
      at += z.hR;
      cuts.push({ x, y: at, w, h: g, depth: 0, vertical: false });
      at += g;
    }
    tiles.search = { x, y: at, w, h: z.hS };
    cuts.sort((p, q) => p.depth - q.depth || p.x + p.y - (q.x + q.y));
    return { frame: { x, y, w, h: z.h }, tiles, cuts, scale, aspect };
  }

  /**
   * The mosaic: on phones four tiles (the answer, the reel beside the film
   * or billboard, the search), elsewhere all seven, in whichever
   * arrangement shows the answer and the search larger and keeps its cuts
   * in line (mosaicJogs). Flexible tiles take the aspect the mosaic gives
   * them, reflowed tiles their width: the engine sets the tile's size.
   */
  function layoutStory() {
    const box = { x: pad, y: Fy, w: W - 2 * pad, h: Fh };
    const g = phone ? 10 : W < 1100 ? 14 : 16;
    if (phone) {
      lay = phoneLayout(box, g);
    } else {
      const read = (L: MosaicLayout) => Math.min(L.scale.answer ?? 0, L.scale.search ?? 0);
      const wide = mosaicLayout(MOSAIC_WIDE, box, g, 1.1, true), tall = mosaicLayout(MOSAIC_TALL, box, g, 1.1, true);
      const pref = read(tall) > read(wide) * 1.04 ? [tall, wide] : [wide, tall];
      lay = pref.find((L) => !mosaicJogs(L, g).length) ?? pref[0];
    }
    CHANNELS.forEach((c, j) => {
      const r = lay.tiles[c.key];
      shown[j] = r ? 1 : 0;
      tAR[j] = lay.aspect[c.key] ?? c.aspect;
      tNW[j] = r ? r.w / (lay.scale[c.key] ?? r.w / c.w) : c.w;
      // whole pixels, so every tile's type sits on the pixel grid
      if (r) tR[j] = { x: Math.round(r.x), y: Math.round(r.y), w: r.w, h: r.h };
      const el = tileEls[j];
      if (!el) return;
      const nw = Math.abs(tNW[j] - c.w) > 0.01, nh = nw || Math.abs(tAR[j] - c.aspect) > 1e-4;
      el.style.width = nw ? `${tNW[j].toFixed(2)}px` : "";
      el.style.height = nh ? `${(tNW[j] / tAR[j]).toFixed(2)}px` : "";
    });
    // each piece: the tile and half of each gutter beside it, and the cut
    // that makes each side (the frame's own edge has none)
    const g2 = g / 2;
    CHANNELS.forEach((c, j) => {
      const r = lay.tiles[c.key];
      if (!r) return;
      const sc = sideCut[j];
      sc.fill(255);
      lay.cuts.forEach((cu, ci) => {
        if (cu.vertical) {
          if (cu.y > r.y + r.h - 1 || cu.y + cu.h < r.y + 1) return;
          if (Math.abs(cu.x + cu.w - r.x) < 0.75) sc[0] = ci;
          else if (Math.abs(cu.x - (r.x + r.w)) < 0.75) sc[1] = ci;
        } else {
          if (cu.x > r.x + r.w - 1 || cu.x + cu.w < r.x + 1) return;
          if (Math.abs(cu.y + cu.h - r.y) < 0.75) sc[2] = ci;
          else if (Math.abs(cu.y - (r.y + r.h)) < 0.75) sc[3] = ci;
        }
      });
      const l = sc[0] < 255 ? g2 : 0, rr = sc[1] < 255 ? g2 : 0, t = sc[2] < 255 ? g2 : 0, b = sc[3] < 255 ? g2 : 0;
      reg[j] = { x: r.x - l, y: r.y - t, w: r.w + l + rr, h: r.h + t + b };
    });
  }

  /**
   * The master frame: an even dot screen over the mosaic's whole
   * rectangle, its gutters included. About half the dots make its points,
   * so it stays whole when dots are shed for cost (never below 0.55 N); the
   * rest double up and dissolve on arrival. Each point belongs to the piece
   * of the frame it lies in.
   */
  function assignFrame() {
    const F = lay.frame;
    let avail = 0;
    for (let i = 0; i < N; i++) if (!stray[i]) avail++;
    const budget = Math.max(16, avail * 0.5);
    // the finest square-ish pitch whose points fit the budget
    let sp = Math.sqrt((F.w * F.h) / budget);
    let cols = 2, rows = 2;
    for (let pass = 0; pass < 4; pass++) {
      cols = Math.max(2, Math.round(F.w / sp));
      rows = Math.max(2, Math.round(F.h / sp));
      if (cols * rows <= budget) break;
      sp *= Math.sqrt((cols * rows) / budget) * 1.02;
    }
    const dx = F.w / cols, dy = F.h / rows, pts = cols * rows;
    fPitch = Math.max(dx, dy);
    const ks = CHANNELS.map((_, j) => j).filter((j) => shown[j]);
    let n = 0;
    for (let i = 0; i < N; i++) {
      if (stray[i]) continue;
      const q = n % pts;
      fdup[i] = n >= pts ? 1 : 0;
      n++;
      const x = F.x + ((q % cols) + 0.5) * dx, y = F.y + (Math.floor(q / cols) + 0.5) * dy;
      fpx[i] = x;
      fpy[i] = y;
      // the piece it lies in (the pieces tile the frame), or the nearest
      let best = -1, bd = Infinity;
      for (const j of ks) {
        const r = reg[j];
        const ex = Math.max(r.x - x, 0, x - (r.x + r.w)), ey = Math.max(r.y - y, 0, y - (r.y + r.h));
        const d = ex * ex + ey * ey;
        if (d < bd) {
          bd = d;
          best = j;
          if (d === 0) break;
        }
      }
      ft[i] = best < 0 ? 255 : best;
      if (best >= 0) {
        const r = reg[best];
        fu[i] = clamp((x - r.x) / r.w, 0, 1);
        fv[i] = clamp((y - r.y) / r.h, 0, 1);
      }
    }
  }

  /**
   * The story's order: the cuts as the guillotine makes them, the pieces
   * developing in the order the story is told, and the hand-over, nearest
   * the lanes first (the tiles over the column of heads clear it before
   * anything lands there), a column's tiles top lane first. A lane starts
   * to pour as its tile lands; one with no tile as its drawn head comes in.
   */
  function orderStory() {
    const nc = lay.cuts.length;
    cutAt = lay.cuts.map((_, j) => CUT0 + (nc > 1 ? (j * (CUT1 - CUT0 - CUT_T)) / (nc - 1) : 0));
    const ks = CHANNELS.map((_, j) => j).filter((j) => shown[j]);
    ks.forEach((j, i) => (devAt[j] = DEV0 + i * DEV_STG));
    const cx = (j: number) => tR[j].x + tR[j].w / 2;
    const byX = ks.slice().sort((a, b) => (Math.abs(cx(a) - cx(b)) > 8 ? cx(a) - cx(b) : TILE_LANE[a] - TILE_LANE[b]));
    byX.forEach((j, i) => (rank[j] = i));
    // a tile's flight takes what the stagger leaves of KC0..KC1
    flStg = ks.length > 1 ? Math.min(FL_STG, 0.6 / (ks.length - 1)) : 0;
    flDur = 1 - (ks.length - 1) * flStg;
    headAt.fill(HEAD_NEW);
    // (the first of its dots leaves the tile as it is POUR_AT of the way in)
    for (const j of ks) headAt[TILE_LANE[j]] = KC0 + (KC1 - KC0) * (rank[j] * flStg + POUR_AT * flDur) + (phone ? IN_T : 0);
  }
  let flDur = 1;
  const flightAt = (kc: number, j: number) => seg(kc, rank[j] * flStg, rank[j] * flStg + flDur);
  /** A tile's rect at flight progress kj, mosaic to lane head. It shrinks
      first, in place about its centre (a quick ease-out, done in the first
      45% of its flight), then slides to its head (from 28% on, eased in
      and out): a recording never crosses the stage at size, and the few
      in the air at once are small */
  const flt: Rect = { x: 0, y: 0, w: 0, h: 0 };
  function flightRect(j: number, kj: number): Rect {
    const r0 = tR[j], r1 = heads[TILE_LANE[j]];
    const k = 1 - seg(kj, 0, 0.45), ks = 1 - k * k * k, q = eio(seg(kj, 0.28, 1));
    const w = lerp(r0.w, r1.w, ks), h = lerp(r0.h, r1.h, ks);
    flt.x = lerp(r0.x + r0.w / 2, r1.x + r1.w / 2, q) - w / 2;
    flt.y = lerp(r0.y + r0.h / 2, r1.y + r1.h / 2, q) - h / 2;
    flt.w = w;
    flt.h = h;
    return flt;
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
      // labels | heads | lanes into the funnel | the curve rising out of it
      headsOn = W >= 760;
      grpX = 0; brX = 70; labX = 86; headR = labX + 142;
      A0 = headsOn ? labX + 170 : labX + 128;
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
      headsOn = false;
      grpX = 5; brX = 13; labX = 22; A0 = labX + 102;
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
    layoutHeads();
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
  /* The link to the method. Never `visibility: hidden` (put's way): hidden
     it keeps its place in the tab order, and focusing it jumps to it */
  const endCache = { x: NaN, y: NaN, o: -1 };
  function putEnd(x: number, y: number, o: number) {
    o = Math.round(o * 500) / 500;
    if (!(Math.abs(endCache.x - x) <= 0.05 && Math.abs(endCache.y - y) <= 0.05)) {
      endCache.x = x;
      endCache.y = y;
      endEl.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
    }
    if (o !== endCache.o) {
      endCache.o = o;
      endEl.style.opacity = String(o);
      if (o > 0.9) endEl.dataset.on = "";
      else delete endEl.dataset.on;
    }
  }

  /* The tiles: placed by transform (translate, then scale from the
     nominal width, origin top left), stacked by zIndex, played by
     data-play; their scene loops run with data-fx, only near full size.
     In flight a tile keeps one raster (will-change), so its shrinking
     costs a scale on the compositor, not a repaint per frame. */
  type TileCache = { x: number; y: number; s: number; o: number; z: number; v: number; play: boolean; fx: boolean; fly: boolean };
  const tileCache: TileCache[] = CHANNELS.map(() => ({ x: NaN, y: NaN, s: NaN, o: -1, z: -1, v: -1, play: false, fx: false, fly: false }));
  /** `v`: how much of the tile has developed, top down (1: all of it) */
  function putTile(j: number, r: Rect | null, o: number, z: number, v: number, play: boolean, fly = false) {
    const el = tileEls[j];
    if (!el) return;
    const c = tileCache[j];
    if (r) {
      const sc = r.w / tNW[j];
      if (!(Math.abs(c.x - r.x) <= 0.05 && Math.abs(c.y - r.y) <= 0.05 && Math.abs(c.s - sc) <= 1e-4)) {
        c.x = r.x;
        c.y = r.y;
        c.s = sc;
        el.style.transform = `translate(${r.x.toFixed(2)}px,${r.y.toFixed(2)}px) scale(${sc.toFixed(5)})`;
      }
    }
    o = r ? Math.round(o * 500) / 500 : 0;
    if (o !== c.o) {
      c.o = o;
      el.style.opacity = String(o);
      el.style.visibility = o > 0 ? "visible" : "hidden";
    }
    if (z !== c.z) {
      c.z = z;
      el.style.zIndex = String(z);
    }
    v = v >= 0.999 ? 1 : Math.round(v * 1000) / 1000;
    if (v !== c.v) {
      c.v = v;
      el.style.clipPath = v >= 1 ? "" : `inset(0 0 ${((1 - v) * 100).toFixed(2)}% 0)`;
    }
    play = play && o > 0;
    if (play !== c.play) {
      c.play = play;
      if (play) el.dataset.play = "";
      else delete el.dataset.play;
    }
    const fx = play && !fly && c.s >= FX_SCALE;
    if (fx !== c.fx) {
      c.fx = fx;
      if (fx) el.dataset.fx = "";
      else delete el.dataset.fx;
    }
    fly = fly && o > 0;
    if (fly !== c.fly) {
      c.fly = fly;
      el.style.willChange = fly ? "transform" : "";
    }
  }
  /** Hold every tile's frame (the loop stopped: off screen, a hidden tab) */
  function holdTiles() {
    tileCache.forEach((c, j) => {
      if (!c.play) return;
      c.play = c.fx = false;
      delete tileEls[j]?.dataset.play;
      delete tileEls[j]?.dataset.fx;
    });
  }

  function clearInline() {
    for (const el of [...steps, ...labelEls, endEl, ...tiles, ...(noteEl ? [noteEl] : [])]) {
      el.style.transform = "";
      el.style.opacity = "";
      el.style.visibility = "";
    }
    CHANNELS.forEach((c, j) => {
      const el = tileEls[j];
      if (!el) return;
      el.style.zIndex = "";
      el.style.clipPath = "";
      el.style.willChange = "";
      el.style.width = "";
      el.style.height = "";
      tNW[j] = c.w;
      delete el.dataset.play;
      delete el.dataset.fx;
    });
    for (const c of tileCache) {
      c.x = c.y = c.s = NaN;
      c.o = c.z = c.v = -1;
      c.play = c.fx = c.fly = false;
    }
    for (const el of laneEls) {
      delete el.dataset.pool;
      delete el.dataset.grab;
      delete el.dataset.drag;
    }
    delete endEl.dataset.on;
    cache.clear();
    stepCache.clear();
    endCache.o = -1;
    endCache.x = endCache.y = NaN;
  }

  /** Positions that only change on resize; opacity is written per frame */
  function placeFixed() {
    cache.clear();
    laneWs = laneEls.map((el) => (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 80);
    endH = (endEl.firstElementChild as HTMLElement | null)?.offsetHeight || 40;
    GROUP_RANGE.forEach(([a, b], g) => {
      align(grpEls[g], phone ? "rot" : "l");
      put(grpEls[g], grpX, (C[a] + C[b]) / 2, 0);
    });
    if (pinned) {
      align(throatEl, "l");
      put(throatEl, A0 + ut * (A1 - A0) + 16, Cc - 18, 0);
    } else {
      // narrow: above the stream; wide: centred over the throat, clear of the curve
      align(throatEl, phone ? "l" : "c");
      put(throatEl, A0 + ut * (A1 - A0) + (phone ? 8 : 0), Cc - (phone ? 15 : 28), 0);
    }
  }

  /* ---------- canvas helpers ---------- */
  /**
   * A lane's head where no tile lands (and every head in the still frame):
   * a thumbnail of the format in the tiles' own colours, so a column of
   * heads reads as one set of recordings
   */
  function drawHead(key: AfIcon, r: Rect, a: number) {
    if (a <= 0.01) return;
    const c = ctx;
    const x = Math.round(r.x), y = Math.round(r.y);
    const w = Math.max(4, Math.round(r.w)), h = Math.max(4, Math.round(r.h));
    const ga = c.globalAlpha;
    c.save();
    c.globalAlpha = ga * a;
    c.beginPath();
    c.rect(x, y, w, h);
    c.clip();
    // a block at fractions of the head
    const f = (col: string | CanvasGradient, fx: number, fy: number, fw: number, fh: number, min = 1) => {
      c.fillStyle = col;
      c.fillRect(Math.round(x + fx * w), Math.round(y + fy * h), Math.max(min, Math.round(fw * w)), Math.max(min, Math.round(fh * h)));
    };
    const vg = (top: string, bot: string) => {
      const g = c.createLinearGradient(0, y, 0, y + h);
      g.addColorStop(0, top);
      g.addColorStop(1, bot);
      return g;
    };
    switch (key) {
      case "search":
        f("#fbfaf6", 0, 0, 1, 1);
        f("#e6e2da", 0, 0, 1, 0.13);
        f("#d8d2c8", 0.08, 0.24, 0.5, 0.09);
        f("#1a35b0", 0.08, 0.46, 0.66, 0.09);
        f("#b9b4ab", 0.08, 0.62, 0.8, 0.05);
        f("#b9b4ab", 0.08, 0.72, 0.56, 0.05);
        break;
      case "reel":
        f(vg("#5a1b16", "#140707"), 0, 0, 1, 1);
        f("#d9cfc6", 0.22, 0.42, 0.56, 0.2);
        f("#fbfaf6", 0.08, 0.03, 0.84, 0.012);
        f("#fbfaf6", 0.2, 0.28, 0.6, 0.045);
        break;
      case "film": {
        const g = c.createLinearGradient(x, 0, x + w, 0);
        g.addColorStop(0, "#c2563a");
        g.addColorStop(0.45, "#5a1d17");
        g.addColorStop(1, "#1b2434");
        f(g, 0, 0, 1, 1);
        f("#050303", 0, 0, 1, 0.12);
        f("#050303", 0, 0.88, 1, 0.12);
        f("#fbfaf6", 0.34, 0.68, 0.32, 0.05);
        f("#e8564e", 0.05, 0.92, 0.42, 0.02);
        break;
      }
      case "ai":
        f("#202124", 0, 0, 1, 1);
        f("#3a3b3f", 0.34, 0.1, 0.58, 0.13);
        f("#b9bcc2", 0.08, 0.34, 0.84, 0.045);
        f("#b9bcc2", 0.08, 0.44, 0.78, 0.045);
        f("#b9bcc2", 0.08, 0.54, 0.5, 0.045);
        f("#e8564e", 0.62, 0.53, 0.08, 0.065);
        f("#2c2d31", 0.08, 0.82, 0.84, 0.1);
        break;
      case "press":
        f("#f4f1ea", 0, 0, 1, 1);
        f("#110f0a", 0.22, 0.06, 0.56, 0.045);
        f("#110f0a", 0.08, 0.18, 0.8, 0.07);
        f("#110f0a", 0.08, 0.28, 0.5, 0.07);
        f(vg("#a8462f", "#4a1a14"), 0.08, 0.42, 0.84, 0.28);
        f("#a39d93", 0.08, 0.78, 0.84, 0.04);
        f("#a39d93", 0.08, 0.86, 0.6, 0.04);
        break;
      case "feed": {
        // a customer's phone photo of their unit against the brick, with
        // the post's caption bar over its foot
        f(vg("#7a2a22", "#2a0d0b"), 0, 0, 1, 1);
        for (let r = 0; r < 6; r++) f("rgba(20,6,5,0.45)", 0, 0.06 + r * 0.15, 1, 0.012, 0.5);
        f("#efe4dc", 0.18, 0.3, 0.6, 0.42);
        f("rgba(120,80,72,0.55)", 0.73, 0.3, 0.05, 0.42);
        c.fillStyle = "#2c1715";
        c.beginPath();
        c.arc(x + w * 0.4, y + h * 0.51, Math.max(1, Math.min(w, h) * 0.15), 0, TAU);
        c.fill();
        f("rgba(8,3,3,0.72)", 0, 0.78, 1, 0.22);
        c.fillStyle = "#d39a83";
        c.beginPath();
        c.arc(x + w * 0.12, y + h * 0.89, Math.max(1, h * 0.055), 0, TAU);
        c.fill();
        f("#fbfaf6", 0.22, 0.85, 0.5, 0.035);
        f("#b9bcc2", 0.22, 0.91, 0.34, 0.03);
        break;
      }
      case "creator":
        f("#ffffff", 0, 0, 1, 1);
        c.fillStyle = "#c96f55";
        c.beginPath();
        c.arc(x + w * 0.16, y + h * 0.1, Math.max(1, w * 0.08), 0, TAU);
        c.fill();
        f("#110f0a", 0.3, 0.08, 0.4, 0.04);
        f(vg("#a8462f", "#3b1410"), 0.06, 0.24, 0.88, 0.5);
        f("#b9b4ab", 0.06, 0.8, 0.8, 0.04);
        f("#b9b4ab", 0.06, 0.88, 0.5, 0.04);
        break;
      case "ooh":
        f(vg("#2b1a33", "#c0604a"), 0, 0, 1, 1);
        f("#140c10", 0, 0.8, 1, 0.2);
        f("#3a2a2e", 0.53, 0.62, 0.02, 0.2);
        f("#ece6dc", 0.36, 0.16, 0.36, 0.48);
        f("#110f0a", 0.4, 0.26, 0.18, 0.08);
        break;
      default: {
        // events: a stage, the campaign on the screen behind, a lit Halden
        // lectern and the audience's heads against the light
        f("#0d0809", 0, 0, 1, 1);
        f("#1c1214", 0.12, 0.1, 0.76, 0.42);
        f("#e8564e", 0.2, 0.22, 0.4, 0.06);
        f("#f2c9bf", 0.2, 0.33, 0.26, 0.04);
        const g = c.createRadialGradient(x + w * 0.66, y + h * 0.5, 0, x + w * 0.66, y + h * 0.5, Math.max(w, h) * 0.42);
        g.addColorStop(0, "rgba(255,226,194,0.42)");
        g.addColorStop(1, "rgba(255,226,194,0)");
        f(g, 0, 0, 1, 1);
        f("#2a1a1a", 0, 0.66, 1, 0.08);
        f("#efe6dc", 0.6, 0.48, 0.14, 0.22);
        f("#110f0a", 0.64, 0.53, 0.06, 0.035);
        c.fillStyle = "#050304";
        for (let i = 0; i < 6; i++) {
          c.beginPath();
          c.arc(x + w * (0.08 + i * 0.17), y + h * 0.9, Math.max(1, h * 0.08), 0, TAU);
          c.fill();
        }
        f("#050304", 0, 0.92, 1, 0.08);
      }
    }
    c.restore();
    // the screen's edge, as on the tiles
    c.strokeStyle = rgba(PAPER, 0.16 * a * ga);
    c.lineWidth = 1;
    c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
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
  /** The three groups' brackets */
  function drawFurniture(grpA: number) {
    const c = ctx;
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
  /** Baseline (dashed) and the drop from the head */
  function drawAxis(a: number, hx: number, hy: number) {
    if (a <= 0.002) return;
    const c = ctx;
    c.globalAlpha = a;
    c.fillStyle = "rgba(185,188,194,0.42)";
    const y = Math.round(yb);
    for (let x = xL; x < xR; x += 6) c.fillRect(Math.round(x), y, Math.min(3, xR - x), 1);
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

  /* ---------- touch: the mesh answers the pointer (NOISE only) ----------
     Two things, both off the instant the stage moves on and free while
     the pointer is elsewhere:
     - the lens: a fine pointer over the field (pointerType mouse or pen;
       touch has no hover) pushes the nearest dots aside and lights them.
       Its centre, radius and strength ease; each dot rides a damped
       spring to its push and back (jx/jy, stepped in render's dot loop
       only while some dot has give left: jOn).
     - the easter egg: press a marker (its name and square, which take the
       pointer only while grabbable: data-grab) and drag. The marker alone
       follows the pointer, rubber-banded at the field's edges; no dots go
       with it. The lens rides with it, as it rides with a pointer, so the
       mesh parts round the marker as it passes (its own pool's dots too)
       and closes behind it. Let go, the marker eases home to its pool on
       a spring; STORY sends any still under way home at once. Pointer
       capture is on the marker alone and only the marker has
       touch-action: none, so a page scroll is never taken.
     The handlers only record; touchStep (called by render) does the work. */
  const rubber = (v: number, lo: number, hi: number) =>
    v < lo ? lo - (60 * (lo - v)) / (lo - v + 60) : v > hi ? hi + (60 * (v - hi)) / (v - hi + 60) : v;
  // some marker is away from home (or on its way back)
  let marksOut = false;
  function homeMarks() {
    for (const a of [mkX, mkY, mkVX, mkVY]) a.fill(0);
    marksOut = false;
  }
  function endDrag() {
    const k = dragK;
    if (k < 0) return;
    dragK = -1;
    const grip = laneEls[k].firstElementChild;
    if (grip && dragId >= 0 && grip.hasPointerCapture(dragId)) grip.releasePointerCapture(dragId);
    dragId = -1;
    delete laneEls[k].dataset.drag;
    // dropped: it eases home from where it was let go (touchStep)
  }
  /** One step of the touch state */
  function touchStep(dt: number, noiseW: number, grabV: number) {
    if (noiseW <= 0) {
      // STORY has every dot: a marker still on its way home is home
      endDrag();
      if (marksOut) homeMarks();
    } else if (grabV < 0.5) endDrag();
    const px = ptrCX - stageL, py = ptrCY - stageT;
    let want = 0, cx = 0, cy = 0;
    const R = phone ? LENS_R_PHONE : LENS_R;
    if (dragK >= 0) {
      // the marker under the pointer, where it was taken; the lens where it
      // is held (the pointer, or where the band holds it at an edge)
      const k = dragK;
      const x = rubber(px - grabDX, pad + 12, W - pad - 12), y = rubber(py - grabDY, Fy + 12, Fy + Fh - 12);
      mkX[k] = x - ax[k];
      mkY[k] = y - ay[k];
      mkVX[k] = mkVY[k] = 0;
      cx = x + grabDX;
      cy = y + grabDY;
      want = 1;
    } else if (hover && py >= 0 && py <= H) {
      cx = px;
      cy = py;
      want = 1;
    }
    want *= noiseW;
    if (dt > 0) {
      lensA += (want - lensA) * (1 - Math.exp(-dt * 7));
      if (want > 0) {
        const e = 1 - Math.exp(-dt * 20);
        // a fresh lens starts where it is wanted, not across the field
        if (lensA < 0.02) {
          lensX = cx;
          lensY = cy;
        } else {
          lensX += (cx - lensX) * e;
          lensY += (cy - lensY) * e;
        }
        lensR += (R - lensR) * e;
      } else if (lensA < 0.003) lensA = 0;
    }
    if (lensA > 0) jOn = true;
    if (!marksOut || dt <= 0) return;
    // the dropped markers' glide home, in two half steps when a frame runs long
    const n = dt > 1 / 50 ? 2 : 1, h = dt / n;
    let busy = dragK >= 0;
    for (let s = 0; s < n; s++) {
      for (let k = 0; k < NL; k++) {
        if (k === dragK) continue;
        mkVX[k] += (-mkX[k] * MK_K - mkVX[k] * MK_C) * h;
        mkVY[k] += (-mkY[k] * MK_K - mkVY[k] * MK_C) * h;
        mkX[k] += mkVX[k] * h;
        mkY[k] += mkVY[k] * h;
      }
    }
    for (let k = 0; k < NL && !busy; k++) {
      if (Math.abs(mkVX[k]) + Math.abs(mkVY[k]) > 0.5 || Math.abs(mkX[k]) + Math.abs(mkY[k]) > 0.3) busy = true;
    }
    // all home: snap the last fraction of a pixel and stop stepping
    if (!busy) homeMarks();
  }

  /* ---------- pinned render ---------- */
  let lastVal = "", lastT = -1, poolOn = false, grabOn = false;
  // each piece's development (0..1) this frame
  const dev = new Float32Array(NT);
  // where each lane pours from this frame: its tile, in flight or landed,
  // or its drawn head
  const src: Rect[] = AF_LANES.map(() => ({ x: 0, y: 0, w: 0, h: 0 }));

  function render(p: number, t: number) {
    const c = ctx;
    // the springs' step: real time, capped so a stall never flings anything
    const dt = lastT < 0 ? 0 : clamp(t - lastT, 0, 1 / 30);
    lastT = t;
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

    // phases (the markers have gone before STORY's heading is a third in)
    const poolV = ss(0.085, 0.115, p) * (1 - ss(0.148, 0.168, p));
    // the gather into the master frame
    const k1 = seg(p, G0, G1);
    // the flight to the lanes plays alone, before the LANES heading rises
    const kc = seg(p, KC0, KC1);
    // the dots leave the story (all hidden by now under the tiles) for
    // their lanes
    const lanesOn = p > KC0 - 0.01;
    const labV = ss(0.564, 0.598, p) * (1 - ss(0.925, 0.96, p));
    const grpV = ss(0.578, 0.618, p) * (1 - ss(0.925, 0.96, p));
    const newV = ss(HEAD_NEW - 0.015, HEAD_NEW + 0.02, p) * (1 - ss(0.925, 0.96, p));
    const beta = eio(seg(p, 0.76, 0.865));
    const throatV = ss(0.84, 0.88, p) * (1 - ss(0.92, 0.95, p));
    const m3 = seg(p, 0.92, 1.03);
    const flowV = beta * (1 - ss(0.92, 0.995, p));
    const curveV = ss(0.94, 1.02, p);
    const axisV = ss(0.97, 1.02, p);
    // the head reaches the index by 1.06, so the climax holds before release
    const headS = lerp(0.22, 1, eio(seg(p, 0.965, 1.06)));
    // the index climbs from baseline as it fades in, and lands with the head
    const readV = ss(0.98, 1.02, p);
    const tickV = ss(0.98, 1.06, p);
    const strayA = lerp(0.34, 0.1, ss(0.17, 0.3, p)) * lerp(1, 0.55, ss(0.92, 1.03, p));
    const noiseW = 1 - k1;
    // the heads and the lanes' names go as the funnel hands over to the curve
    const keep = 1 - ss(0.925, 0.96, p);
    for (let j = 0; j < NT; j++) dev[j] = shown[j] ? eio(seg(p, devAt[j], devAt[j] + DEV_T)) : 0;

    // drifting pools of attention: each pool's home, which its marker
    // leaves only while it is dragged or on its way back
    for (let k = 0; k < NL; k++) {
      ax[k] = pad + pools[k][0] * (W - 2 * pad) + Math.sin(t * 0.11 + k * 1.7) * 14;
      ay[k] = Fy + pools[k][1] * Fh + Math.cos(t * 0.09 + k * 2.3) * 10;
    }
    const sgx = W * (phone ? POOL_SX[0] : POOL_SX[1]), sgy = H * (phone ? POOL_SY[0] : POOL_SY[1]);
    // the markers can be taken while their names are well in
    const grabV = poolV * dimLab;
    touchStep(dt, noiseW, grabV);

    /* --- DOM --- */
    const pooled = p < 0.3;
    if (pooled !== poolOn) {
      poolOn = pooled;
      for (const el of laneEls) {
        if (pooled) el.dataset.pool = "";
        else delete el.dataset.pool;
      }
    }
    const canGrab = pooled && grabV > 0.5;
    if (canGrab !== grabOn) {
      grabOn = canGrab;
      for (const el of laneEls) {
        if (canGrab) el.dataset.grab = "";
        else delete el.dataset.grab;
      }
    }
    for (let k = 0; k < NL; k++) {
      const el = laneEls[k];
      if (pooled) {
        // the name hangs right of its marker (the square at the marker
        // itself), or left of it near the right edge
        const mx = ax[k] + mkX[k], my = ay[k] + mkY[k];
        const left = mx + 13 + laneWs[k] > W - pad;
        align(el, left ? "r" : "l");
        put(el, left ? mx - 13 : mx + 13, my, grabV);
      } else {
        const ly = phone ? C[k] - bh - 9 : C[k];
        const lx = phone ? labX + heads[k].w + 8 : labX;
        align(el, "l");
        put(el, lx, ly, labV * dimLab);
      }
    }
    for (let g = 0; g < 3; g++) put(grpEls[g], null, 0, grpV * dimLab);
    put(throatEl, null, 0, throatV * dimLab);
    const hj = headS * (TN - 1), h0 = Math.floor(hj), hf = hj - h0, h1 = Math.min(TN - 1, h0 + 1);
    const hx = lerp(cvX[h0], cvX[h1], hf), hy = lerp(cvY[h0], cvY[h1], hf);
    if (phone) {
      align(readoutEl, "upr");
      put(readoutEl, W - pad, yt - 30, readV * dimLab);
    } else {
      align(readoutEl, "l");
      put(readoutEl, hx + 24, hy, readV * dimLab);
    }
    // the one link arrives with the readout, lifting into place, across
    // the field from it: on the container's left edge, its foot on the
    // chart's baseline, where the curve starts. Where the curve starts near
    // that edge (under 1100px, phones) it sits just under the baseline
    const endV = ss(END0, END1, p);
    const endLift = (1 - endV) * 14;
    if (phone) putEnd(xL, yb + 28 + endLift, endV);
    else if (W < 1100) putEnd(pad, yb + 28 + endLift, endV);
    else putEnd(pad, yb - endH + endLift, endV);
    const val = `${(1 + (AF_INDEX - 1) * curveF(tickV)).toFixed(1)}×`;
    if (val !== lastVal) {
      lastVal = val;
      valueEl.textContent = val;
    }
    // the tiles: each develops in its piece of the mosaic, holds, then flies
    // to its lane's head (in the air over every tile still in place, and
    // over those bound for lower lanes); they play while they show in STORY
    // and hold their frame once landed. Each lane pours out of where its
    // tile is now (src)
    for (let k = 0; k < NL; k++) {
      const r = heads[k];
      src[k].x = r.x; src[k].y = r.y; src[k].w = r.w; src[k].h = r.h;
    }
    for (let j = 0; j < NT; j++) {
      if (!dev[j]) {
        putTile(j, null, 0, 1, 0, false);
        continue;
      }
      const kj = flightAt(kc, j);
      const z = kj <= 0 ? 1 : kj >= 1 ? 2 : 3 + NL - TILE_LANE[j];
      const r = kj > 0 ? flightRect(j, kj) : tR[j];
      if (kj < 1) {
        const sr = src[TILE_LANE[j]];
        sr.x = r.x; sr.y = r.y; sr.w = r.w; sr.h = r.h;
      }
      putTile(j, r, keep * (kj >= 1 ? dimLab : dim), z, dev[j], running && kj <= 0, kj > 0 && kj < 1);
    }
    // the line under the mosaic, while it holds
    if (noteEl) {
      const F = lay.frame;
      put(noteEl, Math.round(F.x), Math.round(F.y + F.h + 14), ss(NOTE0, NOTE1, p) * (1 - ss(KC0 - 0.004, KC0 + 0.008, p)) * dim);
    }

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

    drawFurniture(grpV * dim);

    // lanes with no tile here get a drawn head
    if (newV > 0.01) {
      c.globalAlpha = dim;
      for (let k = 0; k < NL; k++) {
        if (LANE_TILE[k] >= 0 && shown[LANE_TILE[k]]) continue;
        const r = heads[k], sc = lerp(0.7, 1, newV);
        const rs: Rect = { x: r.x + r.w * (1 - sc), y: r.y + (r.h * (1 - sc)) / 2, w: r.w * sc, h: r.h * sc };
        drawHead(AF_LANES[k].icon, rs, newV);
      }
      c.globalAlpha = 1;
    }

    /* --- particles --- */
    let vn = 0, jMoving = 0;
    const twOn = !reduced() && noiseW > 0;
    const cutting = p > CUT0;
    for (let i = 0; i < drawN; i++) {
      const k = ln[i];
      let x = 0, y = 0, a = 0, col = 0, size = sz[i];
      let nxp = 0, nyp = 0, na = 0;
      const needNoise = stray[i] === 1 || k1 < 1;
      let lit = 0;
      if (needNoise) {
        const w = ph[i], A = amp[i], f = fr[i];
        if (cl[i]) {
          // a pooled dot keeps to its pool's home, wherever its marker is
          nxp = ax[k] + gx[i] * sgx + A * Math.sin(f * t + w);
          nyp = ay[k] + gy[i] * sgy + A * Math.cos(f * 0.83 * t + w * 1.3);
          na = 0.18 + 0.36 * br[i];
        } else {
          nxp = mod(nx[i] * W + dvx[i] * t + A * Math.sin(f * t + w), W);
          nyp = mod(ny[i] * H + dvy[i] * t + A * Math.cos(f * 0.83 * t + w * 1.3), H);
          na = 0.12 + 0.3 * br[i];
        }
        if (jOn) {
          // the lens' push on this dot, and the spring that carries it
          // there and back
          let tx = 0, ty = 0;
          if (lensA > 0) {
            const dx = nxp - lensX, dy = nyp - lensY;
            if (dx < lensR && dx > -lensR && dy < lensR && dy > -lensR) {
              const d = Math.sqrt(dx * dx + dy * dy) + 1e-3;
              if (d < lensR) {
                const f1 = 1 - d / lensR;
                lit = f1 * f1 * lensA;
                const pu = (lensR * LENS_PUSH * lit) / d;
                tx = dx * pu;
                ty = dy * pu;
              }
            }
          }
          // a dot at rest outside the lens costs one test
          if (tx !== 0 || ty !== 0 || jx[i] !== 0 || jy[i] !== 0 || jvx[i] !== 0 || jvy[i] !== 0) {
            const vx = (jvx[i] += ((tx - jx[i]) * DOT_K - jvx[i] * DOT_C) * dt);
            const vy = (jvy[i] += ((ty - jy[i]) * DOT_K - jvy[i] * DOT_C) * dt);
            const ex = (jx[i] += vx * dt), ey = (jy[i] += vy * dt);
            if (ex * ex + ey * ey > 0.01 || vx * vx + vy * vy > 0.25) jMoving++;
            else if (tx === 0 && ty === 0) jx[i] = jy[i] = jvx[i] = jvy[i] = 0;
            nxp += ex;
            nyp += ey;
            // the nearest light up
            na += 0.55 * lit;
          }
        }
      }
      if (stray[i]) {
        vn = slot(vn, nxp, nyp, strayA * br[i] + 0.5 * lit, lit > 0.3 ? C_PAPER : 0, sz[i]);
        continue;
      }
      const lu = frac(u0[i] + t * AF_LANES[k].speed * sp[i]);
      if (!lanesOn) {
        // noise, settling into its point of the master frame. Behind the
        // blade each piece closes up into its tile's rectangle, opening the
        // gutter (its edge dots lit as it goes), and later the recording
        // develops over it
        const kk = eio(seg(k1, dl[i] * 0.4, dl[i] * 0.4 + 0.6));
        let fx = fpx[i], fy = fpy[i];
        let fa = fdup[i] ? 0 : FRAME_A + FRAME_B * br[i];
        const fj = ft[i];
        let flash = 0, edge = 0;
        if (cutting && fj !== 255) {
          const sc = sideCut[fj], r = reg[fj], t = tR[fj], u = fu[i], v = fv[i];
          // each side: how far its cut has opened here (parting a little
          // past the gutter, then settling), and the push
          for (let sd = 0; sd < 4; sd++) {
            const ci = sc[sd];
            if (ci === 255) continue;
            const cu = lay.cuts[ci];
            const along = cu.vertical ? (fpy[i] - cu.y) / cu.h : (fpx[i] - cu.x) / cu.w;
            const tc = cutAt[ci] + clamp(along, 0, 1) * CUT_T;
            const q = seg(p, tc, tc + OPEN_T);
            if (q <= 0) continue;
            const e = q >= 1 ? 1 : 1 - (1 - q) * (1 - q) * (1 - q) + 0.9 * Math.sin(Math.PI * q) * (1 - q);
            if (sd === 0) fx += e * (t.x - r.x) * (1 - u);
            else if (sd === 1) fx -= e * (r.x + r.w - t.x - t.w) * u;
            else if (sd === 2) fy += e * (t.y - r.y) * (1 - v);
            else fy -= e * (r.y + r.h - t.y - t.h) * v;
            // the dots along the fresh edge: a flash as it parts, then lit
            const d = sd === 0 ? u * r.w : sd === 1 ? (1 - u) * r.w : sd === 2 ? v * r.h : (1 - v) * r.h;
            if (d < 26) flash = Math.max(flash, Math.sin(Math.PI * q) * (1 - d / 26));
            if (d < fPitch) edge = Math.max(edge, ss(0.2, 0.8, q));
          }
          fa = Math.max(fa, lerp(fa, 0.62 + 0.3 * br[i], edge)) + 0.6 * flash;
        }
        // its piece develops from the top: gone once the edge has passed it
        if (fj !== 255 && dev[fj] > 0 && fy < tR[fj].y + dev[fj] * tR[fj].h + 1) fa = 0;
        x = lerp(nxp, fx, kk);
        y = lerp(nyp, fy, kk) + Math.sin(kk * Math.PI) * arc[i];
        a = lerp(na, fa, kk);
        size = lerp(size, 1.5, kk);
        col = kk > 0.55 ? C_PAPER : 0;
        if (twOn && tw[i] && kk < 0.5) {
          const tws = Math.pow(Math.max(0, Math.sin(t * 0.7 + ph[i] * 5)), 14) * noiseW;
          a += tws * 0.6;
          if (tws > 0.3) col = C_PAPER;
        }
        if (lit > 0.3 && kk < 0.5) col = C_PAPER;
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
        // out of its tile as it lands, fading in, then along the lane, so
        // each lane grows rightward from its head: from the head's right
        // edge straight into the lane (a phone's head sits above its lane:
        // down from its foot to the lane's mouth first)
        const ar = headAt[k] + dl[i] * HEAD_JIT;
        const e2 = seg(p, ar, ar + OUT_T);
        if (e2 < 1 && !phone) {
          const hr = src[k], q = 1 - Math.pow(1 - e2, 3);
          x = lerp(hr.x + hr.w - 1, lx, q);
          y = lerp(hr.y + hr.h / 2 + off[i] * hr.h * 0.3, ly, eio(seg(e2, 0, 0.3)));
          a = la * lerp(0.32, ef, q) * ss(0, 0.12, e2);
          col = hi[i] ? C_PAPER : 0;
        } else if (e2 < 1) {
          const e1 = seg(p, ar - IN_T, ar);
          if (e1 < 1) {
            const hr = src[k];
            x = lerp(hr.x + hr.w / 2, A0, e1);
            y = lerp(hr.y + hr.h, ly, eio(e1));
            a = la * 0.5 * ss(0.1, 0.7, e1);
            col = hi[i] ? C_PAPER : 0;
          } else {
            const q = 1 - Math.pow(1 - e2, 3);
            x = lerp(A0, lx, q);
            y = ly;
            a = la * lerp(0.32, ef, q);
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
      vn = slot(vn, x, y, a, col, size);
    }
    flush(vn, dim);
    // every dot has come to rest and nothing pushes: the give is spent
    if (jOn && lensA === 0 && (jMoving === 0 || k1 >= 1)) {
      jOn = false;
      jx.fill(0);
      jy.fill(0);
      jvx.fill(0);
      jvy.fill(0);
    }

    // the blade: each cut runs the length of its gutter as it is made, a
    // 2px signal line with a bright point at its edge, the gutter opening
    // behind it. A cut that is through stays, a little quieter, so the
    // whole cut reads; once the last is through they all fade together
    // (after the second beat, which holds the finished grid), and only then
    // do the recordings develop
    if (cutting && p < DEV0) {
      c.globalAlpha = dim;
      const out = 1 - ss(FADE0, FADE1, p);
      lay.cuts.forEach((cu, j) => {
        const q = seg(p, cutAt[j], cutAt[j] + CUT_T);
        const fade = out * (1 - 0.3 * ss(cutAt[j] + CUT_T, cutAt[j] + CUT_T + 0.01, p));
        if (q <= 0 || fade <= 0) return;
        const v = cu.vertical;
        const x0 = Math.round(cu.x + (v ? cu.w / 2 : 0)) - (v ? 1 : 0), y0 = Math.round(cu.y + (v ? 0 : cu.h / 2)) - (v ? 0 : 1);
        const len = (v ? cu.h : cu.w) * q;
        c.fillStyle = rgba(SIG, 0.95 * fade);
        if (v) c.fillRect(x0, y0, 2, len);
        else c.fillRect(x0, y0, len, 2);
        if (q < 1) {
          const tx = v ? x0 + 1 : x0 + len, ty = v ? y0 + len : y0 + 1;
          const glow = c.createRadialGradient(tx, ty, 0, tx, ty, 9);
          glow.addColorStop(0, "rgba(255,236,226,0.9)");
          glow.addColorStop(0.4, "rgba(232,86,78,0.35)");
          glow.addColorStop(1, "rgba(232,86,78,0)");
          c.fillStyle = glow;
          c.fillRect(tx - 9, ty - 9, 18, 18);
          c.fillStyle = rgba(PAPER, 1);
          c.fillRect(Math.round(tx) - 1.5, Math.round(ty) - 1.5, 3, 3);
        }
      });
      c.globalAlpha = 1;
    }

    // each piece's developing edge, a hairline running down it
    if (p > DEV0 && p < DEV0 + NT * DEV_STG + DEV_T) {
      c.globalAlpha = dim;
      for (let j = 0; j < NT; j++) {
        const v = dev[j];
        if (v <= 0 || v >= 1) continue;
        const r = tR[j];
        c.fillStyle = rgba(PAPER, 0.85 * Math.sin(Math.PI * v));
        c.fillRect(Math.round(r.x), Math.round(r.y + v * r.h), Math.round(r.w), 1);
      }
      c.globalAlpha = 1;
    }

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
    drawFurniture(1);
    if (headsOn) for (let k = 0; k < NL; k++) drawHead(AF_LANES[k].icon, heads[k], 0.92);
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
  let slow = 0, fast = 0, lastNow = 0;
  const clock = (now: number) => T0 + (now - tStart) / 1000;

  let trackTop = 0;
  function progress() {
    const r = track.getBoundingClientRect();
    trackTop = r.top;
    // the sticky stage's place in the viewport, for the pointer
    stageL = r.left;
    stageT = Math.min(Math.max(r.top, 0), r.bottom - H);
    const span = r.height - H;
    return span > 0 ? clamp(-r.top / span, 0, 1) * T_LEN : 0;
  }
  function tick(now: number) {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    const p = progress();
    // a sliver at the fold is not worth a frame: draw nothing until at
    // least 48px of the section is in (resize() drew the first frame)
    if (window.innerHeight - trackTop < 48) {
      lastNow = 0;
      return;
    }
    // Shed dots only for the field's own cost, measured while the stage is
    // pinned and whole on screen (other work on the page, like the hero's
    // WebGL, must not count against it), and win them back when cheap
    const t0 = performance.now();
    render(p, clock(now));
    const cost = performance.now() - t0;
    const whole = trackTop <= 0 && track.getBoundingClientRect().bottom >= window.innerHeight;
    if (whole && lastNow) {
      if (cost > 8) {
        slow += 1;
        fast = 0;
      } else {
        slow = Math.max(0, slow - 1);
        fast = cost < 4 ? fast + 1 : 0;
      }
      if (slow > 45 && drawN > N * 0.55) {
        drawN = Math.round(drawN * 0.85);
        slow = 0;
      } else if (fast > 120 && drawN < N) {
        drawN = Math.min(N, Math.round(drawN / 0.85));
        fast = 0;
      }
    }
    lastNow = now;
    lastP = p;
  }
  /* The page is behind the mobile menu (the header marks the #main wrapper
     inert while it is open and the menu is opaque): nothing here is seen,
     so the loop and the tiles rest as they do in a hidden tab */
  const main = root.closest("#main") ?? root.closest("main");
  const covered = () => !!root.closest("[inert]");
  function start() {
    if (running || !pinned || document.hidden || covered()) return;
    running = true;
    lastNow = 0;
    raf = requestAnimationFrame(tick);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
    holdTiles();
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
    const target = Math.round(clamp((w * h) / (w < 700 ? 130 : 150), 1200, 8400));
    if (!N || Math.abs(target - N) > N * 0.12) build(target);
    if (pinned) {
      layoutPinned();
      endDrag();
      homeMarks();
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
  */
  type Geo = { top: number; h: number; y: number; vw: number; vh: number; anchor: Element | null; at: number };
  let geo: Geo = { top: 0, h: 0, y: 0, vw: 0, vh: 0, anchor: null, at: 0 };
  // The chapter under the header line (a child of <main>) and how far into
  // it the reader is: what keepPlace restores after the page reflows
  const anchorNow = () => {
    const main = root.parentElement;
    if (!main) return { anchor: null, at: 0 };
    for (const el of Array.from(main.children)) {
      const r = el.getBoundingClientRect();
      if (r.bottom > 80) return { anchor: el, at: r.top };
    }
    return { anchor: null, at: 0 };
  };
  const snap = () => {
    const r = track.getBoundingClientRect();
    geo = {
      top: r.top + window.scrollY,
      h: track.offsetHeight,
      y: window.scrollY,
      vw: window.innerWidth,
      vh: window.innerHeight,
      ...anchorNow(),
    };
  };
  const keepPlace = () => {
    const was = geo;
    if (!was.h) return snap();
    const end = was.top + Math.max(0, was.h - was.vh);
    if (was.y >= was.top - 1 && was.y <= end) {
      // Inside the field: land at its start
      const r = track.getBoundingClientRect();
      window.scrollTo({ top: r.top + window.scrollY, behavior: "instant" });
    } else if (was.y > end && was.anchor?.isConnected) {
      // Below it: the same chapter, the same distance in
      const r = was.anchor.getBoundingClientRect();
      window.scrollTo({ top: r.top + window.scrollY - was.at, behavior: "instant" });
    }
    snap();
  };

  function syncMode() {
    const next = !reduced() && pinMQ.matches;
    if (next === pinned && N) return;
    const flipped = N > 0;
    pinned = next;
    stop();
    endDrag();
    homeMarks();
    clearInline();
    lastP = -1;
    lastT = -1;
    poolOn = grabOn = false;
    hover = false;
    lensA = 0;
    // unpinned, the tiles sit in their static mosaic as designed stills
    if (tilesRoot) {
      if (pinned) delete tilesRoot.dataset.still;
      else tilesRoot.dataset.still = "";
    }
    resize();
    if (flipped) keepPlace();
    else snap();
    markFraction();
    if (pinned && visible) start();
  }

  /* ---------- wiring ---------- */
  let visible = false;
  // A resize that keeps the mode re-caches the geometry; a flip is handled
  // by syncMode (media query changes are reported before resize observers)
  // Pinned, the track is 560svh, so a window that changes height changes the
  // track's height under a scroll position that stays put: the reader keeps
  // their fraction of the way through, as the services chapter does
  // (`fraction` is cached by scrolls only: the resize event's own snap runs
  // before this observer and would already see the new height)
  let fraction = -1;
  const markFraction = () => {
    const span = geo.h - H;
    fraction = pinned && H > 0 && span > 0 ? (geo.y - geo.top) / span : -1;
  };
  const ro = new ResizeObserver(() => {
    const was = fraction;
    const same = (!reduced() && pinMQ.matches) === pinned;
    resize();
    if (!same) return;
    if (was >= 0 && was <= 1) {
      const r = track.getBoundingClientRect();
      const span = r.height - H;
      const y = r.top + window.scrollY + was * span;
      if (span > 0 && Math.abs(y - window.scrollY) > 1) window.scrollTo({ top: y, behavior: "instant" });
    }
    snap();
    markFraction();
  });
  ro.observe(fig);
  // Scrolls caused by a resize (the browser clamping a shorter page) must
  // not overwrite the snapshot taken before it; a settled resize re-snaps
  const onScroll = () => {
    if (window.innerWidth !== geo.vw || window.innerHeight !== geo.vh) return;
    snap();
    markFraction();
  };
  let resizeRaf = 0;
  const onResize = () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      if ((!reduced() && pinMQ.matches) === pinned) snap();
    });
  };
  window.addEventListener("resize", onResize);
  window.addEventListener("scroll", onScroll, { passive: true });
  const io = new IntersectionObserver(
    (es) => {
      for (const e of es) {
        visible = e.isIntersecting;
        if (visible) start();
        else stop();
      }
    },
    { rootMargin: "0px 0px -48px 0px" },
  );
  io.observe(root);
  pinMQ.addEventListener("change", syncMode);
  reducedMQ.addEventListener("change", syncMode);
  const onVis = () => {
    if (document.hidden) stop();
    else if (visible) start();
  };
  document.addEventListener("visibilitychange", onVis);
  const mo = main ? new MutationObserver(() => (covered() ? stop() : visible && start())) : null;
  if (main) mo?.observe(main, { attributes: true, attributeFilter: ["inert"] });

  // The link is the one stop in the tab order. Hidden (any stage before
  // DEMAND's readout), focusing it jumps straight to where it shows
  const onFocusIn = (e: FocusEvent) => {
    if (!pinned || !endEl.contains(e.target as Node | null)) return;
    const r = track.getBoundingClientRect();
    const span = r.height - H;
    if (span <= 0) return;
    const p = (-r.top / span) * T_LEN;
    if (p >= END1 && p <= T_LEN) return;
    window.scrollTo({ top: window.scrollY + r.top + (END_AT / T_LEN) * span, behavior: "instant" });
  };
  root.addEventListener("focusin", onFocusIn);

  // touch (see "touch" above): the handlers only record
  const laneAt = (t: EventTarget | null) => {
    const lane = (t as Element | null)?.closest("[data-af-lane]");
    return lane ? laneEls.indexOf(lane as HTMLElement) : -1;
  };
  const onPointerMove = (e: PointerEvent) => {
    if (!pinned) return;
    if (e.pointerId === dragId || (dragK < 0 && e.pointerType !== "touch")) {
      ptrCX = e.clientX;
      ptrCY = e.clientY;
      if (e.pointerType !== "touch") hover = true;
    }
  };
  const onPointerLeave = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    hover = false;
  };
  const onPointerDown = (e: PointerEvent) => {
    if (!pinned || dragK >= 0 || (e.pointerType === "mouse" && e.button !== 0)) return;
    const k = laneAt(e.target);
    if (k < 0 || !("grab" in laneEls[k].dataset)) return;
    // the marker takes this pointer: no text selection, no page scroll
    e.preventDefault();
    const grip = laneEls[k].firstElementChild as HTMLElement;
    try {
      grip.setPointerCapture(e.pointerId);
    } catch {
      return;
    }
    dragK = k;
    dragId = e.pointerId;
    ptrCX = e.clientX;
    ptrCY = e.clientY;
    grabDX = e.clientX - stageL - (ax[k] + mkX[k]);
    grabDY = e.clientY - stageT - (ay[k] + mkY[k]);
    laneEls[k].dataset.drag = "";
    marksOut = true;
  };
  const onPointerEnd = (e: PointerEvent) => {
    if (e.pointerId === dragId) endDrag();
  };
  fig.addEventListener("pointermove", onPointerMove, { passive: true });
  fig.addEventListener("pointerleave", onPointerLeave);
  fig.addEventListener("pointerdown", onPointerDown);
  fig.addEventListener("pointerup", onPointerEnd);
  fig.addEventListener("pointercancel", onPointerEnd);
  fig.addEventListener("lostpointercapture", onPointerEnd);

  let alive = true;
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (!alive || !W) return;
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
    window.removeEventListener("resize", onResize);
    cancelAnimationFrame(resizeRaf);
    root.removeEventListener("focusin", onFocusIn);
    fig.removeEventListener("pointermove", onPointerMove);
    fig.removeEventListener("pointerleave", onPointerLeave);
    fig.removeEventListener("pointerdown", onPointerDown);
    fig.removeEventListener("pointerup", onPointerEnd);
    fig.removeEventListener("pointercancel", onPointerEnd);
    fig.removeEventListener("lostpointercapture", onPointerEnd);
    document.removeEventListener("visibilitychange", onVis);
    mo?.disconnect();
  };
}
