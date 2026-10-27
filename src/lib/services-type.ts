/*
  Services: the typographic figure and the Plurel System. The engine
  behind components/home/services-type.tsx (markup in
  services-chapter.tsx, pin, clone and band rules in
  services-type.module.css).

  The eight discipline names first appear the way eight different
  suppliers would set them: mismatched faces, weights, widths, cases,
  colours, slants and rotations. Scroll lines them up on the rows' grid
  ("Lined up, it's still a menu."), then sets them in one face, one scale
  and one rhythm, stage by stage along the chain (Narrative, Create,
  Distribute, Measure). Then the menu settles onto the floor and drains
  into the Plurel System, read top to bottom: layer by layer, Narrative
  first, a layer's names leave their rows, the rows above close ranks
  toward the floor, the layer's band comes down from the top (or from the
  foot of the band above it), and the names land in its rows. The menu
  runs in the System's order (nav.ts), so a layer's names are always the
  menu's top rows when they leave: they go straight into their band, and
  no row has to close ranks. The chain lights again as each layer locks.
  Last, the loop is drawn along the bands: the signal down through the
  layers, the Ledger's read back up to Narrative. The finished frame is
  the System.

  The bands are the real, accessible text: four layers, each with its
  name, what it builds, what it feeds and its services as links. The
  menu the names line up on and the eight clones that carry the motion
  are aria-hidden. Each clone hands its name to the menu's own text once
  it is set, takes it back when its layer leaves, and hands it to its
  band's link when it lands. HTML only: no canvas, no WebGL, no SVG.

  Pure parts first (stages and the System's copy, supplier tables,
  timeline, style functions, the flight, the loop's path), then the DOM
  engine (mountServicesType).
*/

/* ---------------------------------------------------------------- chain */

export type StageKey = "narrative" | "create" | "distribute" | "measure";

export type Stage = {
  key: StageKey;
  name: string;
  /** What the layer builds: the named instrument and its one line */
  builds: string;
  line: string;
  /** What it feeds: the layer below (Measure feeds back up) */
  feeds: string;
};

/**
  The chain the eight run on, in order, which is also the System's four
  layers, top to bottom.
*/
export const STAGES: readonly Stage[] = [
  {
    key: "narrative",
    name: "Narrative",
    builds: "The Core Brief",
    line: "Positioning, story, identity and voice: the one document every asset, ad and answer is cut from.",
    feeds: "Feeds Create",
  },
  {
    key: "create",
    name: "Create",
    builds: "The Asset System",
    line: "The site, content, film and creator kits, cut for every format and every surface from the brief.",
    feeds: "Feeds Distribute",
  },
  {
    key: "distribute",
    name: "Distribute",
    builds: "The Surface Plan",
    line: "Which surface gets which cut, in what order and on what budget: AI answers, search, paid, press, creators and stores.",
    feeds: "Feeds Measure",
  },
  {
    key: "measure",
    name: "Measure",
    builds: "The Ledger",
    line: "The one number, the signals that moved it and where the budget goes next, read every month.",
    feeds: "Feeds back into Narrative and Distribute every quarter",
  },
];

/** The System's title, its line, and the loop's note */
export const SYSTEM = {
  title: "The Plurel System",
  line: "Four layers, one loop. Each layer builds what the one below it runs on, and the last reads the result and feeds it back up.",
  note: "Read monthly. Reset quarterly.",
} as const;

/** Where each discipline sits in the chain, by service slug */
export const SERVICE_STAGE: Record<string, StageKey> = {
  "website-design": "create",
  "brand-identity": "narrative",
  "aeo-seo": "distribute",
  "content-marketing": "create",
  "paid-ads": "distribute",
  "pr-reputation": "distribute",
  "creative-direction": "narrative",
  "martech-consulting": "measure",
};

export const stageName = (k: StageKey) => STAGES.find((s) => s.key === k)?.name ?? k;

/** Rows grouped in chain order: the order the names are set in, and the order the layers stack */
export function setOrder(stages: readonly StageKey[]): number[][] {
  return STAGES.map((s) => stages.flatMap((k, i) => (k === s.key ? [i] : [])));
}

/** The layers the Ledger's read taps on its way back up (Measure feeds these) */
export const FEEDS_BACK: readonly StageKey[] = ["narrative", "distribute"];

/*
  The media query the pin needs, besides the measured fit check. Keep it
  identical to the gate in services-type.module.css (search TYPE_QUERY).
  Phones need 650px of height, so a 360x640 screen keeps the static
  system; lg needs 640px. The fit check then measures the finished frame
  against the visible (svh) screen.
*/
export const TYPE_QUERY =
  "(prefers-reduced-motion: no-preference) and (forced-colors: none) and (min-width: 360px) and (max-width: 63.99rem) and (min-height: 650px), " +
  "(prefers-reduced-motion: no-preference) and (forced-colors: none) and (min-width: 64rem) and (min-height: 640px)";

/* -------------------------------------------------------------- styles */

type Rgb = readonly [number, number, number];
export type Tone = "paper" | "fog" | "blush" | "signal" | "brand";

/** Brand tokens as RGB (the clones interpolate colour) */
export const TONE: Record<Tone, Rgb> = {
  paper: [251, 250, 246],
  fog: [185, 188, 194],
  blush: [242, 201, 191],
  signal: [232, 86, 78],
  brand: [191, 58, 54],
};

/** The house style (`type-title` in Geist, the face of the band links the names land on): where every supplier ends */
export const HOUSE = { mono: false, house: true, wght: 400, wdth: 100, tr: -0.018, rgb: TONE.paper, cs: "none", sk: 0 } as const;

/**
  One supplier's way of setting a name. x is a fraction of the list's
  content width, y a fraction of the poster's height (from the top of the
  list to the foot of the pinned screen); ax/ay pick which corner of the
  rotated box sits on (x, y). size is in px at the reference poster (REF)
  and scales with it, never below min: the quiet voices (thin tracked
  caps, mono, the vertical line) stay readable on a short laptop screen.
*/
export type Supplier = {
  who: string;
  cs: "upper" | "lower" | "none";
  mono?: boolean;
  wdth: number;
  wght: number;
  size: number;
  min?: number;
  tr: number;
  c: Tone;
  rot: number;
  sk: number;
  x: number;
  y: number;
  ax: "l" | "c" | "r";
  ay: "t" | "b";
};

/*
  Eight suppliers, eight house styles, one per row in the menu's order
  (the System's: Narrative, Create, Distribute, Measure; see nav.ts).
  Each name keeps roughly its own row's height in the poster, so no name
  ever has to cross another on its way to the grid; the disorder is in
  face, weight, width, case, slant, rotation, colour and x. Checked by the
  overlap probe at p 0 to 0.5 on eighteen screens, 360x740 to 2560x1440
  (min gap 8px between boxes).
*/
export const DESK: readonly Supplier[] = [
  { who: "brand studio", cs: "upper", wdth: 125, wght: 210, size: 20, min: 20, tr: 0.44, c: "blush", rot: 0, sk: 0, x: 1, y: 0, ax: "r", ay: "t" },
  { who: "creative studio", cs: "none", wdth: 112, wght: 200, size: 116, tr: -0.05, c: "paper", rot: 0, sk: 0, x: 0, y: 0.045, ax: "l", ay: "t" },
  { who: "web team", cs: "lower", wdth: 75, wght: 820, size: 92, tr: -0.045, c: "paper", rot: 0, sk: 0, x: 1, y: 0.25, ax: "r", ay: "t" },
  { who: "writers", cs: "none", wdth: 88, wght: 330, size: 40, tr: 0, c: "fog", rot: 0, sk: -13, x: 0.08, y: 0.31, ax: "l", ay: "t" },
  { who: "SEO agency", cs: "upper", wdth: 82, wght: 900, size: 54, tr: -0.012, c: "signal", rot: -7, sk: 0, x: 0.38, y: 0.4, ax: "l", ay: "t" },
  { who: "ads agency", cs: "upper", wdth: 125, wght: 900, size: 156, tr: -0.04, c: "brand", rot: 0, sk: 0, x: -0.004, y: 0.6, ax: "l", ay: "t" },
  { who: "PR firm", cs: "none", wdth: 100, wght: 540, size: 28, min: 18, tr: -0.005, c: "paper", rot: -90, sk: 0, x: 1, y: 0.93, ax: "r", ay: "b" },
  { who: "consultants", cs: "upper", mono: true, wdth: 100, wght: 400, size: 22, min: 20, tr: 0.06, c: "fog", rot: 0, sk: 0, x: 0, y: 1, ax: "l", ay: "b" },
];

export const PHONE: readonly Supplier[] = [
  { who: "brand studio", cs: "upper", wdth: 125, wght: 210, size: 16, min: 16, tr: 0.36, c: "blush", rot: 0, sk: 0, x: 1, y: 0, ax: "r", ay: "t" },
  { who: "creative studio", cs: "none", wdth: 112, wght: 200, size: 44, tr: -0.05, c: "paper", rot: 0, sk: 0, x: 0, y: 0.075, ax: "l", ay: "t" },
  { who: "web team", cs: "lower", wdth: 75, wght: 820, size: 46, tr: -0.045, c: "paper", rot: 0, sk: 0, x: 1, y: 0.2, ax: "r", ay: "t" },
  { who: "writers", cs: "none", wdth: 88, wght: 330, size: 23, tr: 0, c: "fog", rot: 0, sk: -13, x: 0, y: 0.335, ax: "l", ay: "t" },
  { who: "SEO agency", cs: "upper", wdth: 80, wght: 900, size: 29, tr: -0.012, c: "signal", rot: -7, sk: 0, x: 0.3, y: 0.42, ax: "l", ay: "t" },
  { who: "ads agency", cs: "upper", wdth: 125, wght: 900, size: 58, tr: -0.04, c: "brand", rot: 0, sk: 0, x: -0.01, y: 0.56, ax: "l", ay: "t" },
  { who: "PR firm", cs: "none", wdth: 100, wght: 540, size: 16, min: 16, tr: -0.005, c: "paper", rot: -90, sk: 0, x: 1, y: 0.86, ax: "r", ay: "b" },
  { who: "consultants", cs: "upper", mono: true, wdth: 100, wght: 400, size: 20, min: 20, tr: 0.04, c: "fog", rot: 0, sk: 0, x: 0, y: 1, ax: "l", ay: "b" },
];

/** Reference poster each table is drawn for (content width x poster height) */
export const REF = { desk: { w: 1344, h: 680 }, phone: { w: 350, h: 480 } } as const;

/** Mono suppliers change family a little before the case flips: the "set" moment */
const FAMILY_FLIP = 0.42;
/**
 * Every voice (Mona Sans, for its width axis) changes into the house family
 * (Geist) late in its set, once its width is within 4% of normal: the
 * change hides in the motion.
 */
export const HOUSE_FLIP = 0.85;
const CASE_FLIP = 0.5;
/** Steps a set takes in its face (axes, size, case): see render() */
export const FACE_STEPS = 20;
/** New clone shapes (font instances) a scrolled frame lays out, at most: one
    while frames are running late (a slow phone), else two */
const SHAPES_PER_FRAME = 2;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** in-out cubic: rules, reveals */
export const io = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** in-out quart: the decisive snap of a set */
export const snap = (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);

/* Colour. The quiet tones (fog, blush) move to paper in OKLab (OKLCH's
   cartesian form), never through sRGB's muddy midtones. The two reds
   would pass through pink on any path to paper, so they don't take one:
   they turn paper on the very step their case flips, the "set" moment,
   where the glyphs themselves change and hide the cut. */
type Lab = readonly [number, number, number];
const lin = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};
const gam = (c: number) => {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(clamp(v) * 255);
};
export function toOklab(rgb: Rgb): Lab {
  const [r, g, b] = rgb.map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, A, B];
}
export function fromOklab([L, A, B]: Lab): Rgb {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    gam(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    gam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    gam(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}
const LAB = Object.fromEntries(Object.entries(TONE).map(([k, v]) => [k, toOklab(v)])) as Record<Tone, Lab>;
const HOUSE_LAB = toOklab(HOUSE.rgb);

/** A supplier's colour on its way to paper, at set progress t */
export function toneAt(c: Tone, t: number): Rgb {
  const a = LAB[c];
  const z = HOUSE_LAB;
  if (Math.hypot(a[1], a[2]) > 0.1) return t >= CASE_FLIP ? HOUSE.rgb : TONE[c];
  const k = clamp(t);
  if (k <= 0) return TONE[c];
  if (k >= 1) return HOUSE.rgb;
  // chroma drains a little ahead of the lightness: no pastel on the way
  const kc = 1 - (1 - k) * (1 - k);
  return fromOklab([lerp(a[0], z[0], k), lerp(a[1], z[1], kc), lerp(a[2], z[2], kc)]);
}

export type Face = {
  mono: boolean;
  /** set in the house family (Geist) rather than a voice's */
  house: boolean;
  wght: number;
  wdth: number;
  tr: number;
  rgb: Rgb;
  cs: Supplier["cs"];
  sk: number;
};

/**
 * A supplier's face at set progress t (0 = its own voice, 1 = the house
 * style). Weight moves in steps of 10 and width of 1%: every new pair is
 * a new variable-font instance to shape (the one real cost of a frame
 * here), and steps that size are invisible in motion while the font cache
 * reuses them. At t = 1 it is exactly HOUSE, for every supplier (see
 * services-type.test.ts).
 */
export function faceAt(sp: Supplier, t: number): Face {
  if (t >= 1) return { ...HOUSE };
  const mono = !!sp.mono && t < FAMILY_FLIP;
  // A mono face has no width axis: after the flip, width eases from 100
  // to the house width, so the row never ends off the others' width
  const wdth = mono ? 100 : Math.round(lerp(sp.mono ? 100 : sp.wdth, HOUSE.wdth, t));
  return {
    mono,
    house: !mono && t >= HOUSE_FLIP,
    wght: Math.round(lerp(sp.wght, HOUSE.wght, t) / 10) * 10,
    wdth,
    tr: Math.round(lerp(sp.tr, HOUSE.tr, t) * 10000) / 10000,
    rgb: toneAt(sp.c, t),
    cs: t < CASE_FLIP ? sp.cs : "none",
    sk: lerp(sp.sk, 0, t),
  };
}

/** Size, poster -> row (on the baselines) -> house (with the face), in log space */
export function sizeAt(px: number, grid: number, house: number, ty: number, tf: number): number {
  if (tf >= 1) return house;
  return Math.exp(lerp(lerp(Math.log(px), Math.log(grid), ty), Math.log(house), tf));
}

/** A size laid out as text: half-pixel steps counted from the house size, so
    the last steps land on it exactly */
export const textSize = (s: number, house: number) => house + Math.round((s - house) * 2) / 2;

/* ------------------------------------------------------------- timeline */

/*
  p = progress through the pin, in units of the first two beats' pin: 1 is
  the pin they were drawn for (110svh on desktop, 96svh on phones), and
  the pin runs on to END, so the first two beats keep their exact scroll
  distances.

  0 ...... .155  .165 .... .34  .29 ..... .45 .485 ........... .8  .86 ................... 1.175  1.175 ... 1.265  1.27 . END
  | poster held | baselines    | column      | menu | set, stage by stage | the bands, layer by layer | the loop  | rest
  The poster holds for the first 15% of the first beats' pin (about
  150px of scroll at 1440x900), whole on the pinned screen, before
  anything moves. Caption: a (eight voices) -> b at .35 (a menu) -> c at
  .53, as the first names are set (a system) -> d at 1.175, the System's
  title. The chain fades in at .35 and lights stage by stage as its rows
  are set; then, once every name is set, the menu settles onto the floor
  and drains into the bands, Narrative first, each band coming down under
  the one before, and the chain lights again as each layer locks. The
  chain gives way to the System's line, the loop is drawn, and the
  figure takes the pointer (1.27).
*/
export const END = 1.32; // 145.2svh / 110svh on desktop; 126.7svh / 96svh on phones

export const T = {
  rule: { at: 0.155, step: 0.016, len: 0.14 }, // the rows' hairlines draw: the grid they land on
  gy: { at: 0.165, step: 0.007, len: 0.13 }, // onto the baselines: straighten, come down to row size
  gx: { at: 0.29, step: 0.007, len: 0.11 }, // onto the column: flush left on column 4
  chain: { at: 0.35, len: 0.1 },
  face: { at: 0.485, step: 0.07, inner: 0.012, len: 0.1 }, // one stage at a time
  cap: [0.35, 0.53] as const,
  // the set menu settles onto the floor, clearing the top for the bands
  sink: { at: 0.85, len: 0.065 },
  // one layer at a time: its names leave together, its band comes down
  // and they land in it as it locks, len after the layer's turn starts
  drain: { at: 0.86, step: 0.07, inner: 0, len: 0.105 },
  // the rows above close ranks once the names have cleared the menu: 60%
  // into a flight (desktop), or as soon as a name has folded away (below
  // lg, in fold); as fractions of drain.len
  close: { lag: 0.6, foldLag: 0.45, len: 0.35 },
  fold: 0.45,
  // a layer's band comes down (from the top, or from the foot of the band
  // above) once the rows have closed ranks below its place, and its name
  // and text light as it locks; as fractions of drain.len
  band: { lag: 0.6, text: 0.7 },
  chainOut: { at: 1.12, len: 0.08 },
  line: { at: 1.175, len: 0.06 }, // the System's line takes the chain's place
  title: 1.175, // the narrator hands over to the System's title
  loop: { at: 1.175, len: 0.09 }, // the loop is drawn: down through the layers, then back up
  settled: 1.27, // the bands take the pointer from here
} as const;

export const seg = (p: number, at: number, len: number) => clamp((p - at) / len);

/** When each row is set (face start), in chain order */
export function rowTimes(order: number[][]): { face: number; stage: number }[] {
  const out: { face: number; stage: number }[] = [];
  order.forEach((rows, s) => {
    const at = T.face.at + s * T.face.step;
    rows.forEach((i, j) => {
      out[i] = { face: at + j * T.face.inner, stage: s };
    });
  });
  return out;
}

/** A stage's chain word lights while its rows are being set */
export function stageWindow(s: number, order: number[][]): [number, number] {
  const at = T.face.at + s * T.face.step;
  const last = s === order.length - 1;
  return [at, last ? at + (order[s].length - 1) * T.face.inner + T.face.len + 0.02 : at + T.face.step];
}

/** When each row leaves the menu, and when its layer locks into its band */
export function drainTimes(order: number[][]): { leave: number; land: number; layer: number }[] {
  const out: { leave: number; land: number; layer: number }[] = [];
  order.forEach((rows, s) => {
    const at = T.drain.at + s * T.drain.step;
    rows.forEach((i, j) => {
      out[i] = { leave: at + j * T.drain.inner, land: at + T.drain.len, layer: s };
    });
  });
  return out;
}

/** A layer's turn: [its names leave, it locks] */
export function lockWindow(s: number): [number, number] {
  const at = T.drain.at + s * T.drain.step;
  return [at, at + T.drain.len];
}

/** A layer's band coming down into place: [starts, locks] */
export function bandWindow(s: number): [number, number] {
  const [at, lock] = lockWindow(s);
  return [at + T.band.lag * T.drain.len, lock];
}

/** A layer's name and text lighting: [starts, locks] */
export function textWindow(s: number): [number, number] {
  const [at, lock] = lockWindow(s);
  return [at + T.band.text * T.drain.len, lock];
}

/** How far a leaving row's slot has closed (the rows below it close ranks), at p */
export function closeAt(p: number, leave: number, desk: boolean) {
  return snap(seg(p, leave + (desk ? T.close.lag : T.close.foldLag) * T.drain.len, T.close.len * T.drain.len));
}

/** How far a layer's band has come down into place, at p (0 to 1) */
export function dropAt(p: number, s: number) {
  const [a, b] = bandWindow(s);
  return io(seg(p, a, b - a));
}

/** How far the set menu has settled onto the floor, at p (0 to 1) */
export function sinkAt(p: number) {
  return io(seg(p, T.sink.at, T.sink.len));
}

/** A stage's chain word lights again for its layer's turn, until the next layer's starts */
export function relightWindow(s: number, n = STAGES.length): [number, number] {
  const [at, lock] = lockWindow(s);
  return [at, s === n - 1 ? lock + 0.02 : at + T.drain.step];
}

/* --------------------------------------------------------------- flight */

/** How far across a flight has gone, at flight progress t (0 to 1): out of the menu first */
export const flightX = (t: number) => 1 - Math.pow(1 - io(clamp(t)), 4);

/**
 * A name on its way from its row to its band, at flight progress t: the
 * box's corner swoops out of the menu to the right first and comes down
 * into the band last (so it never crosses a name still on the rows), and
 * the name comes down to the band's size on the way (s is its scale, 1 at
 * the row's size). (x0, y0) is the row's box, (x1, y1) the band link's,
 * s1 the link's size over the row's. At t = 1 it is exactly the link (see
 * services-type.test.ts).
 */
export function flightAt(t: number, x0: number, y0: number, x1: number, y1: number, s1: number) {
  if (t >= 1) return { x: x1, y: y1, s: s1 };
  const u = io(clamp(t));
  return {
    x: lerp(x0, x1, flightX(t)),
    y: lerp(y0, y1, Math.pow(u, 2.5)),
    s: Math.exp(Math.log(s1) * io(clamp(t / 0.85))),
  };
}

/* ----------------------------------------------------------------- loop */

/*
  The loop, as one path drawn along the bands at a steady pace: the
  signal down the spine, Narrative first (each band's way in from above,
  its node, its way out to the band below, and the arrowhead where it
  crosses), then the Ledger's read: a stub across to the return line and
  the return up through every band to Narrative, tapping the layers it
  feeds back into on the way. Taps draw alongside the return (they start
  as it passes their node); everything else in order.
*/
export type LoopPart = {
  /** which band (stage index) and which part of its drawing */
  s: number;
  kind: "in" | "node" | "out" | "arrow" | "stub" | "ret" | "tap" | "note";
  /** px: a line's length; for taps, how far along the band's return line (from its foot) its node sits */
  len: number;
  at?: number;
};

export type LoopSpan = { s: number; kind: LoopPart["kind"]; d0: number; d1: number };

/** Lay the parts on one path: returns each part's [d0, d1] and the total */
export function loopPath(parts: readonly LoopPart[], n = STAGES.length) {
  const pick = (s: number, kind: LoopPart["kind"]) => parts.find((p) => p.s === s && p.kind === kind);
  const spans: LoopSpan[] = [];
  const POP = 10; // a node or an arrowhead pops in over 10px of the path
  let d = 0;
  const run = (s: number, kind: LoopPart["kind"]) => {
    const p = pick(s, kind);
    if (!p) return;
    spans.push({ s, kind, d0: d, d1: d + Math.max(1, p.len) });
    d += Math.max(1, p.len);
  };
  for (let s = 0; s < n; s++) {
    if (s > 0) run(s, "in");
    if (pick(s, "node")) spans.push({ s, kind: "node", d0: d, d1: d + POP });
    if (s < n - 1) {
      run(s, "out");
      if (pick(s, "arrow")) spans.push({ s, kind: "arrow", d0: d - POP / 2, d1: d + POP / 2 });
    }
  }
  run(n - 1, "stub");
  for (let s = n - 1; s >= 0; s--) {
    const r = pick(s, "ret");
    const t = pick(s, "tap");
    const top = d;
    run(s, "ret");
    if (r && t) spans.push({ s, kind: "tap", d0: top + (t.at ?? 0), d1: top + (t.at ?? 0) + Math.max(1, t.len) });
  }
  const end = Math.max(d, ...spans.map((x) => x.d1));
  const note = parts.find((p) => p.kind === "note");
  if (note) spans.push({ s: note.s, kind: "note", d0: end, d1: end + 4 * POP });
  return { spans, total: Math.max(end, ...spans.map((x) => x.d1)) };
}

/* ---------------------------------------------------------------- engine */

type Styled = HTMLElement;

const CASE_CSS = { upper: "uppercase", lower: "lowercase", none: "none" } as const;
/** The voices' face, the house face and the consultants' mono */
const SANS = "var(--font-mona), system-ui, sans-serif";
const HOUSE_FAMILY = "var(--font-geist), system-ui, sans-serif";
const MONO = "var(--font-jetbrains), ui-monospace, monospace";

type Geo = {
  sp: Supplier;
  px: number; // poster size
  G: number; // size on the grid, before the face
  N: number; // house size (the row's name size)
  F: number; // the clone's font-size while it travels: the largest it is shown at
  w0: number; // unrotated poster box, at F
  h0: number;
  X: number; // poster anchor, in stage coordinates
  Y: number;
  sx: number; // the row's name slot, in stage coordinates
  sy: number;
  pitch: number; // the row's share of the menu (closing ranks)
  to: { x: number; y: number } | null; // its band link's box, in stage coordinates (desktop)
  fs: number; // the band link's font size
  rgb: Rgb; // ... and its colour at rest
  a: number;
};

export type TypeHandle = {
  destroy: () => void;
  /** Debug and probes only: render one progress value now (timeline units, 0 to END) */
  renderAt: (p: number) => void;
};

/** "rgb(1, 2, 3)" or "rgba(1, 2, 3, 0.5)" -> [r, g, b] and alpha */
function parseRgb(c: string): { rgb: Rgb; a: number } {
  const m = c.match(/[\d.]+/g)?.map(Number) ?? [];
  return { rgb: [m[0] ?? 251, m[1] ?? 250, m[2] ?? 246], a: m.length > 3 ? m[3] : 1 };
}

/**
 * Mount the figure on its section. Returns the cleanup (and a probe hook).
 * The section carries the motion flag: data-type-motion="on" | "off".
 */
export function mountServicesType(root: HTMLElement): TypeHandle {
  const q = (sel: string, el: ParentNode = root) => el.querySelector<HTMLElement>(sel);
  const qa = (sel: string, el: ParentNode = root) => Array.from(el.querySelectorAll<HTMLElement>(sel));

  const track = q("[data-type-track]");
  const stage = q("[data-type-stage]");
  const stageIn = q("[data-type-stage-in]");
  const head = q("[data-type-head]");
  const list = q("[data-type-list]");
  const cap = q("[data-type-cap]");
  const chain = q("[data-type-chain]");
  const line = q("[data-type-line]");
  const body = q("[data-type-body]");
  const system = q("[data-type-system]");
  const noop = { destroy() {}, renderAt() {} };
  if (!track || !stage || !stageIn || !head || !list || !cap || !chain || !line || !body || !system) return noop;

  const rows = qa("[data-row]", list);
  const clones = qa("[data-type-clone]", stage);
  if (rows.length !== clones.length || rows.length === 0) return noop;
  const slots = rows.map((r) => q("[data-slot]", r)!);
  const rules = rows.map((r) => q("[data-rule]", r)!);
  const curs = rows.map((r) => q("[data-cur]", r)!);
  const ruleEnd = q("[data-rule-end]", list);
  const words = qa("[data-chain-word]", chain);
  const wordStage = words.map((b) => STAGES.findIndex((x) => x.key === b.dataset.chainWord));
  // the bands, top to bottom: their stage indexes, Narrative 0 first
  const bands = qa("[data-band]", system);
  const bandStage = bands.map((b) => STAGES.findIndex((x) => x.key === b.dataset.band));
  const fills = bands.map((b) => q("[data-band-fill]", b));
  const texts = bands.map((b) => qa("[data-band-in]", b));
  const targets = rows.map((_, i) => q(`[data-band-name="${i}"]`, system));
  const loopEls = qa("[data-loop]", system);
  const covers = loopEls.flatMap((el) => (el.dataset.loop === "ret" && el.firstElementChild ? [el.firstElementChild as HTMLElement] : []));
  const stages = rows.map((r) => (r.dataset.st as StageKey) ?? "create");
  const order = setOrder(stages);
  const times = rowTimes(order);
  const drains = drainTimes(order);
  const windows = STAGES.map((_, s) => stageWindow(s, order));
  const relights = STAGES.map((_, s) => relightWindow(s));
  const textIn = STAGES.map((_, s) => textWindow(s));
  // the row that leaves last (the menu's foot goes with it)
  const lastRow = drains.reduce((m, d, i) => (d.leave > drains[m].leave ? i : m), 0);

  const rmMQ = matchMedia("(prefers-reduced-motion: reduce)");
  const gateMQ = matchMedia(TYPE_QUERY);

  let on = false;
  let geo: Geo[] | null = null;
  let desk = true; // names fly into their bands (lg); below lg they fold away
  let narrowK = 1; // desktop: the menu's rules draw back clear of the bands' link column
  let sinkBy = 0; // the room under the set menu, down to the visible floor: how far it settles
  let ruleW = 0; // a row's hairline at full length
  let cur = -1; // eased progress (-1: not yet read)
  let target = 0;
  let raf = 0;
  let last = 0;
  let visible = false;
  let forced = false;
  let pinned = false;
  let alive = true;
  let settledFlag: boolean | null = null;
  // rows whose clone already shows its untouched poster pose
  const posed = rows.map(() => false);
  // the shape each clone is laid out in now: on transform: scale (laid
  // false) or at its true size, at face step tq; small: at its link's size
  type Shape = { laid: boolean; tq: number; small: boolean };
  const shapes: Shape[] = rows.map(() => ({ laid: false, tq: 0, small: false }));
  let pending = false; // a clone is a step behind its row: render again
  // a row's slot closes once its name has cleared the menu (flown out, or folded away)
  const closedAt = (j: number, at: number) => closeAt(at, drains[j].leave, desk);
  const pulled = rows.map(() => 0); // how far each row's hairline has been pulled after its name
  // the loop: each drawn part's place on the path (px), measured at rest
  let loop: { el: HTMLElement; kind: LoopPart["kind"]; d0: number; d1: number }[] = [];
  let loopTotal = 1;

  /* The track in document coordinates, measured off the hot path (when
     the gate decides, when the page's height changes, when the figure
     comes into view): a frame reads only scrollY */
  let trackTop = 0;
  let trackH = 0;
  let travel = 1;
  let headOff = 0; // the figure head, from the top of the stage
  let measured = false;
  function measureTrack() {
    const r = track!.getBoundingClientRect();
    trackTop = r.top + scrollY;
    trackH = track!.offsetHeight;
    travel = Math.max(1, trackH - stage!.offsetHeight);
    headOff = head!.getBoundingClientRect().top - stage!.getBoundingClientRect().top;
    measured = true;
  }

  /* Cached writes: a style or attribute is touched only when it changes */
  const cache = new Map<Styled, Record<string, string>>();
  const put = (el: Styled, prop: string, v: string) => {
    let c = cache.get(el);
    if (!c) cache.set(el, (c = {}));
    if (c[prop] !== v) {
      c[prop] = v;
      el.style.setProperty(prop, v);
    }
  };
  const flag = (el: Element, name: string, v: boolean) => {
    if (el.hasAttribute(name) !== v) el.toggleAttribute(name, v);
  };

  function styleFace(el: HTMLElement, f: Face, size: number) {
    put(el, "font-family", f.mono ? MONO : f.house ? HOUSE_FAMILY : SANS);
    put(el, "font-size", `${size}px`);
    put(el, "font-weight", String(f.wght));
    put(el, "font-stretch", `${f.wdth}%`);
    put(el, "letter-spacing", `${f.tr}em`);
    put(el, "text-transform", CASE_CSS[f.cs]);
    put(el, "color", `rgb(${f.rgb[0]},${f.rgb[1]},${f.rgb[2]})`);
  }

  /** Baseline of a face as a fraction of its size, in a line-height 1 box */
  function baselineOf(family: string, stretch: string) {
    const box = document.createElement("div");
    box.style.cssText = `position:absolute;left:0;top:0;visibility:hidden;font:100px/1 ${family};font-stretch:${stretch};white-space:nowrap`;
    box.innerHTML = 'Hx<i style="display:inline-block;width:0;height:0"></i>';
    stage!.appendChild(box);
    const b = (box.lastChild as HTMLElement).offsetTop / 100;
    box.remove();
    return b;
  }

  let bS = 0.86;
  let bH = 0.86;
  let bM = 0.8;

  /* The bands reach from the menu's top to the floor of the stage (the
     lvh screen), whatever the room the head and the menu leave below */
  function placeSystem() {
    const below = Math.max(0, stage!.getBoundingClientRect().bottom - body!.getBoundingClientRect().bottom);
    put(system!, "--below", `${below.toFixed(1)}px`);
  }

  function measure() {
    const phone = innerWidth < 1024;
    const specs = phone ? PHONE : DESK;
    const ref = phone ? REF.phone : REF.desk;
    // measure the figure at rest: no row shifted, no band on its way, the
    // loop drawn, nothing lit by the pointer
    for (const el of rows) put(el, "translate", "");
    for (const el of fills) if (el) put(el, "transform", "");
    for (const el of texts.flat()) put(el, "opacity", "");
    for (const el of [...loopEls, ...covers]) {
      put(el, "transform", "");
      put(el, "opacity", "");
      put(el, "visibility", "");
    }
    flag(system!, "data-unsettled", true);
    placeSystem();
    const sr = stage!.getBoundingClientRect();
    const lr = list!.getBoundingClientRect();
    const ir = stageIn!.getBoundingClientRect();
    const cs = getComputedStyle(list!);
    const padL = parseFloat(cs.paddingLeft);
    const padR = parseFloat(cs.paddingRight);
    const cl = lr.left - sr.left + padL;
    const cw = lr.width - padL - padR;
    const top = lr.top - sr.top;
    // The poster runs from the top of the list to the foot of the pinned
    // (svh) screen: on a tall phone or a tablet it uses the room the
    // finished list leaves below it
    const foot = ir.bottom - sr.top - parseFloat(getComputedStyle(stageIn!).paddingBottom);
    const H = Math.max(lr.height, foot - top);
    // before it drains, the set menu settles onto that floor (never past
    // the visible foot), so the bands can come down from the top
    sinkBy = Math.max(0, foot - (lr.bottom - sr.top));
    const k = phone
      ? clamp(Math.min(cw / ref.w, H / ref.h), 0.8, 1.9)
      : clamp(Math.min(cw / ref.w, H / ref.h), 0.6, 1.12);
    bS = baselineOf(SANS, "100%");
    bH = baselineOf(HOUSE_FAMILY, "100%");
    bM = baselineOf(MONO, "100%");
    measureTrack();
    // the rules span the rows; on desktop they draw back clear of the
    // bands' link column, where the names come down
    const rr0 = rows[0].getBoundingClientRect();
    const firstLink = targets.find(Boolean)?.closest("ul")?.getBoundingClientRect();
    ruleW = rr0.width;
    desk = !phone && targets.every(Boolean);
    narrowK = !desk || !firstLink || rr0.width <= 0 ? 1 : clamp((firstLink.left - 40 - rr0.left) / rr0.width, 0.2, 1);

    // While a name travels, size moves on transform: scale, so those frames
    // never re-lay out text; the clone keeps one font-size, the largest it
    // is shown at, and scales down from it. Write every clone at its poster
    // face, then read them all.
    const sizes = specs.map((sp) => Math.max(sp.min ?? 0, Math.round(sp.size * k * 4) / 4));
    const Ns = slots.map((sl) => parseFloat(getComputedStyle(sl).fontSize));
    // On the grid but still in its own voice: big names come down to the
    // row, small ones keep their size (a menu, not yet a system)
    const Gs = sizes.map((px, i) => clamp(px, 0.3 * Ns[i], 1.12 * Ns[i]));
    const Fs = sizes.map((px, i) => Math.max(px, Gs[i], Ns[i]));
    clones.forEach((el, i) => {
      put(el, "transform", "none");
      put(el, "opacity", "");
      put(el, "text-rendering", "");
      styleFace(el, faceAt(specs[i], 0), Fs[i]);
    });
    posed.fill(false);
    shapes.forEach((sh) => {
      sh.laid = false;
      sh.tq = 0;
      sh.small = false;
    });
    const rects = rows.map((r) => r.getBoundingClientRect());
    geo = rows.map((_, i) => {
      const sp = specs[i];
      const rr = slots[i].getBoundingClientRect();
      const tn = targets[i];
      let to: Geo["to"] = null;
      let fs = Ns[i];
      let col = { rgb: HOUSE.rgb as Rgb, a: 1 };
      if (tn) {
        const tcs = getComputedStyle(tn);
        fs = parseFloat(tcs.fontSize) || Ns[i];
        col = parseRgb(tcs.color);
        if (desk) {
          // the link's text box (the house family): a line-height 1 box
          // laid on its baseline
          const b = tn.getBoundingClientRect();
          const base = b.top + (b.height - fs) / 2 + bH * fs;
          to = { x: b.left - sr.left, y: base - bH * fs - sr.top };
        }
      }
      return {
        sp,
        px: sizes[i],
        G: Gs[i],
        N: Ns[i],
        F: Fs[i],
        w0: clones[i].offsetWidth,
        h0: clones[i].offsetHeight,
        X: cl + sp.x * cw,
        Y: top + sp.y * H,
        sx: rr.left - sr.left,
        sy: rr.top - sr.top,
        pitch: i < rows.length - 1 ? rects[i + 1].top - rects[i].top : rects[i].height,
        to,
        fs,
        rgb: col.rgb,
        a: col.a,
      };
    });
    measureLoop();
  }

  /* The loop's parts at rest, laid on one path (see loopPath) */
  function measureLoop() {
    const parts: (LoopPart & { el: HTMLElement })[] = [];
    for (const el of loopEls) {
      const kind = el.dataset.loop as LoopPart["kind"];
      const band = el.closest<HTMLElement>("[data-band]");
      const s = STAGES.findIndex((x) => x.key === band?.dataset.band);
      if (s < 0) continue;
      const r = el.getBoundingClientRect();
      const horiz = kind === "stub" || kind === "tap";
      let at: number | undefined;
      if (kind === "tap") {
        // the return runs up: how far it has come from its foot to this node
        const ret = band!.querySelector<HTMLElement>('[data-loop="ret"]')?.getBoundingClientRect();
        at = ret ? ret.bottom - (r.top + r.height / 2) : 0;
      }
      parts.push({ el, s, kind, len: horiz ? r.width : r.height, at });
    }
    const { spans, total } = loopPath(parts);
    loopTotal = Math.max(1, total);
    loop = spans.flatMap((sp) => {
      const p = parts.find((x) => x.s === sp.s && x.kind === sp.kind);
      return p ? [{ el: p.el, kind: sp.kind, d0: sp.d0, d1: sp.d1 }] : [];
    });
  }

  /** A hairline drawn to `len` of the row, `gone` of it pulled away from the left */
  const ruleAt = (len: number, gone: number) =>
    gone > 0 ? `translateX(${(ruleW * len * gone).toFixed(2)}px) scaleX(${(len * (1 - gone)).toFixed(4)})` : `scaleX(${len.toFixed(4)})`;

  /** Re-lays out at most `budget` clones (see SHAPES_PER_FRAME) */
  function render(pIn: number, budget = SHAPES_PER_FRAME) {
    if (!geo) return;
    pending = false;
    const p = forced ? END : clamp(pIn, 0, END);
    const settled = p >= T.settled;
    if (settledFlag !== settled) {
      settledFlag = settled;
      flag(system!, "data-unsettled", !settled);
    }
    // The set menu settles onto the floor, then closes ranks toward it:
    // each row moves down by the share of every row below it that has
    // left (as its slot closes), so the menu drains from the floor of each
    // gap and never leaves a hole, and the top stays clear for the bands
    const shift: number[] = [];
    const sunk = sinkAt(p) * sinkBy;
    // (a row follows the slots that close below it from earlier layers
    // only: never its own layer's, which close once it has cleared the
    // menu, so a leaving name moves in step with the rows around it)
    for (let i = 0; i < rows.length; i++) {
      let down = sunk;
      for (let j = i + 1; j < rows.length; j++) if (drains[j].layer < drains[i].layer) down += closedAt(j, p) * geo[j].pitch;
      shift[i] = down;
    }
    const narrow = lerp(1, narrowK, io(seg(p, T.drain.at - 0.05, 0.08)));
    for (let i = 0; i < rows.length; i++) {
      const g = geo[i];
      const sp = g.sp;
      const el = clones[i];
      const tm = times[i];
      const dr = drains[i];
      const ty = snap(seg(p, T.gy.at + i * T.gy.step, T.gy.len));
      const tx = snap(seg(p, T.gx.at + i * T.gx.step, T.gx.len));
      const tfRaw = seg(p, tm.face, T.face.len);
      const tf = snap(tfRaw);
      // its layer's turn: the name leaves its row (and, desktop, flies
      // into its band, landing as the band locks; below lg it folds away)
      const tl = seg(p, dr.leave, dr.land - dr.leave);
      const leaving = p > dr.leave;
      const flies = desk && !!g.to;
      const landed = flies ? p >= dr.land : tl >= T.fold;
      // The face (family, axes, tracking, case, size) moves in FACE_STEPS
      // even steps, and from mid-slide onto the column (hidden by the
      // motion) it is laid out at its true size rather than scaled. Every
      // new shape is a font instance to shape, the one real cost of a
      // frame: a frame lays out at most `budget` of them, and a clone left
      // a step behind catches up on the next frame. On its way into its
      // band the name is laid out again, at the link's size, halfway there.
      const small = flies && leaving && tl >= 0.55;
      const want: Shape = { laid: tx >= 0.5 || tfRaw > 0, tq: Math.round(tf * FACE_STEPS) / FACE_STEPS, small };
      const sh = shapes[i];
      let behind = sh.laid !== want.laid || sh.tq !== want.tq || sh.small !== want.small;
      if (behind && budget > 0) {
        budget--;
        sh.laid = want.laid;
        sh.tq = want.tq;
        sh.small = want.small;
        behind = false;
      }
      if (behind) pending = true;
      // hand the row to the menu's own text the moment its name is set, and
      // only once the clone is exactly that text: never both, never a jump.
      // The clone takes the name back when its layer leaves, and hides once
      // it has landed in its band (or folded away).
      const set = !leaving && tf >= 1 && tx >= 1 && ty >= 1 && sh.laid && sh.tq >= 1 && !sh.small;
      flag(rows[i], "data-set", set);
      flag(el, "data-set", set || landed);
      const tn = targets[i];
      if (tn) flag(tn, "data-wait", flies && !landed);
      put(rows[i], "translate", shift[i] ? `0 ${shift[i].toFixed(2)}px` : "");
      // a clone is only restyled while it moves: once posed (before its
      // row starts, in its poster shape) or set (hidden), a frame skips it
      const still = ty <= 0 && tx <= 0 && tfRaw <= 0;
      if (set || landed || (still && posed[i])) {
        posed[i] = posed[i] && !set && !landed;
      } else if (leaving && flies && g.to) {
        posed[i] = false;
        // the flight: house face, at the row's size and then the link's,
        // its colour easing to the link's over the second half
        const size = sh.small ? g.fs : g.N;
        const f = faceAt(sp, 1);
        const kc = io(seg(tl, 0.45, 0.55));
        styleFace(el, kc > 0 ? { ...f, rgb: [0, 1, 2].map((c) => Math.round(lerp(HOUSE.rgb[c], g.rgb[c], kc))) as unknown as Rgb } : f, size);
        flag(el, "data-laid", true);
        put(el, "opacity", g.a < 1 && kc > 0 ? lerp(1, g.a, kc).toFixed(3) : "");
        put(el, "text-rendering", "geometricPrecision");
        const m = flightAt(tl, g.sx, g.sy + shift[i], g.to.x, g.to.y, g.fs / g.N);
        const n = sh.small ? (m.s * g.N) / g.fs : m.s;
        put(el, "transform", `translate3d(${m.x.toFixed(3)}px,${m.y.toFixed(3)}px,0) scale(${n.toFixed(5)})`);
      } else {
        posed[i] = still && !behind;
        // Colour steps with the face (so a red turns paper on the very step
        // its case flips); the slant stays continuous until the last step,
        // from which the clone is exactly the row's own text, however fast
        // or slow the reader scrolls. While a name
        // travels from the poster down to its row, its size rides on
        // transform: scale; laid out at its true size, the clone ends as
        // the very text of the row, and it also leaves its compositor layer
        // (.clone[data-laid]): painted with the rows, it rasterizes exactly
        // as the row's text, so the hand-off changes no pixel.
        const { laid, tq } = sh;
        const fq = faceAt(sp, tq);
        const fc = tq >= 1 || tq === tf ? fq : faceAt(sp, tf);
        flag(el, "data-laid", laid);
        const size = laid ? textSize(sizeAt(g.px, g.G, g.N, 1, tq), g.N) : sizeAt(g.px, g.G, g.N, ty, 0);
        styleFace(el, fq, laid ? size : g.F);
        // below lg a leaving name folds away: it drops a little and fades
        const fold = leaving ? io(clamp(tl / T.fold)) : 0;
        put(el, "opacity", fold > 0 ? (1 - fold).toFixed(3) : "");
        put(el, "text-rendering", "");
        // straighten while settling onto the baseline, keeping the poster anchor
        const rot = sp.rot * (1 - snap(clamp(ty / 0.75)));
        const s = size / g.F;
        const w = g.w0 * s;
        const h = g.h0 * s;
        const a = (rot * Math.PI) / 180;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        const xs = [0, w * ca, -h * sa, w * ca - h * sa];
        const ys = [0, w * sa, h * ca, w * sa + h * ca];
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const bx = sp.ax === "l" ? minX : sp.ax === "r" ? maxX : (minX + maxX) / 2;
        const by = sp.ay === "t" ? minY : maxY;
        // the row: flush left on the column, sitting on the row's baseline
        // (the rows are set in the house family)
        const b = fq.mono ? bM : fq.house ? bH : bS;
        const rowY = g.sy + shift[i] + 14 * fold + bH * g.N - b * size;
        const ox = lerp(g.X - bx, g.sx, tx);
        const oy = lerp(g.Y - by, rowY, ty);
        put(
          el,
          "transform",
          `translate3d(${ox.toFixed(3)}px,${oy.toFixed(3)}px,0) rotate(${rot.toFixed(3)}deg) skewX(${fc.sk.toFixed(3)}deg)` +
            (laid ? "" : ` scale(${s.toFixed(4)})`),
        );
      }
      // the setting cursor: a signal rule sweeps the row while its name is set
      const tc = clamp(tfRaw / 0.62);
      put(curs[i], "transform", `scaleX(${io(tc).toFixed(4)})`);
      put(curs[i], "opacity", (tc <= 0 || tc >= 1 ? 0 : Math.sin(Math.PI * tc)).toFixed(3));
      // the rows' hairlines: drawn as the names line up, drawn back clear of
      // the bands' link column as the menu starts to drain, and, as a name
      // leaves, pulled out after it (the right end holds), gone as it clears
      const draw = io(seg(p, T.rule.at + i * T.rule.step, T.rule.len));
      pulled[i] = leaving ? (flies ? flightX(tl) : io(clamp(tl / T.fold))) : 0;
      put(rules[i], "transform", ruleAt(draw * narrow, pulled[i]));
    }
    if (ruleEnd) {
      // the menu's foot rides on the last row, and goes with the last to leave
      const draw = io(seg(p, T.rule.at + rows.length * T.rule.step, T.rule.len));
      put(ruleEnd, "transform", ruleAt(draw * narrow, pulled[lastRow]));
    }
    // the bands come down into place, Narrative first, each from the foot
    // of the one above it; their names and text light as they lock
    bands.forEach((_, j) => {
      const s = bandStage[j];
      const fl = fills[j];
      if (s < 0) return;
      const e = dropAt(p, s);
      if (fl) put(fl, "transform", e >= 1 ? "" : `scaleY(${e.toFixed(4)})`);
      const c = io(seg(p, textIn[s][0], textIn[s][1] - textIn[s][0]));
      for (const el of texts[j]) put(el, "opacity", c >= 1 ? "" : c.toFixed(3));
    });
    // the loop, drawn along the bands at a steady pace once they all stand
    const d = seg(p, T.loop.at, T.loop.len) * loopTotal;
    for (const pt of loop) {
      const k = clamp((d - pt.d0) / (pt.d1 - pt.d0));
      if (pt.kind === "node" || pt.kind === "arrow" || pt.kind === "note") put(pt.el, "opacity", k >= 1 ? "" : k.toFixed(3));
      else if (pt.kind === "ret") {
        // the dashed return is drawn in place, upward: its cover (in its
        // band's tone) slides up off it; before it starts, neither shows
        const cv = pt.el.firstElementChild as HTMLElement | null;
        put(pt.el, "visibility", k <= 0 ? "hidden" : "");
        if (cv) put(cv, "transform", k >= 1 ? "" : `translateY(${(-k * 101).toFixed(2)}%)`);
      } else {
        const sc = pt.kind === "stub" || pt.kind === "tap" ? "scaleX" : "scaleY";
        put(pt.el, "transform", k >= 1 ? "" : `${sc}(${k.toFixed(4)})`);
      }
    }
    const tch = io(seg(p, T.chain.at, T.chain.len));
    const tco = io(seg(p, T.chainOut.at, T.chainOut.len));
    const op = tch * (1 - tco);
    put(chain!, "opacity", op >= 1 ? "" : op.toFixed(3));
    // the System's line takes the chain's place
    const tli = io(seg(p, T.line.at, T.line.len));
    put(line!, "opacity", tli >= 1 ? "" : tli.toFixed(3));
    // a stage's word lights while its names are set, and again while its
    // layer locks into place
    words.forEach((w, j) => {
      const [a, b] = windows[wordStage[j]] ?? [9, 9];
      const [c, e] = relights[wordStage[j]] ?? [9, 9];
      const lit = (p >= a && p < b) || (p >= c && p < e);
      flag(w, "data-lit", lit);
      flag(w, "data-done", p >= b && !lit);
    });
    const ci = p < T.cap[0] ? "a" : p < T.cap[1] ? "b" : p < T.title ? "c" : "d";
    if (cap!.dataset.cap !== ci) cap!.dataset.cap = ci;
  }

  let seen = false; // the stage is on screen now
  function read() {
    const y = scrollY;
    const raw = (y - trackTop) / travel;
    target = clamp(raw) * END;
    seen = trackTop - y < innerHeight && trackTop + trackH - y > 0;
    const nowPinned = raw >= 0 && raw <= 1;
    if (nowPinned !== pinned) {
      pinned = nowPinned;
      flag(root, "data-type-pinned", pinned);
    }
  }

  function frame(now: number) {
    raf = 0;
    if (!on) return;
    const dt = Math.min(64, now - (last || now));
    last = now;
    read();
    const prev = cur;
    // Rendering eases toward the scroll position (tau 70ms), so wheel
    // steps never stutter; the visitor's scroll itself is never touched
    // (off screen, after a jump, it goes straight there)
    const next = cur < 0 || !seen ? target : cur + (target - cur) * (1 - Math.exp(-dt / 70));
    cur = Math.abs(next - target) < 1e-4 ? target : next;
    if (cur !== prev || pending) render(cur, dt > 22 ? 1 : SHAPES_PER_FRAME);
    if (visible && (cur !== target || pending)) raf = requestAnimationFrame(frame);
    else last = 0;
  }
  const kick = () => {
    if (on && visible && !raf) raf = requestAnimationFrame(frame);
  };

  function clear() {
    for (const el of [...clones, ...rules, ...curs, ...rows, ...texts.flat(), ...loopEls, ...covers, chain!, line!]) {
      el.removeAttribute("style");
    }
    for (const el of fills) el?.removeAttribute("style");
    if (ruleEnd) ruleEnd.removeAttribute("style");
    system!.style.removeProperty("--below");
    cache.clear();
    for (const el of [...clones, ...rows]) el.removeAttribute("data-set");
    for (const el of clones) el.removeAttribute("data-laid");
    for (const el of targets) el?.removeAttribute("data-wait");
    for (const w of words) {
      w.removeAttribute("data-lit");
      w.removeAttribute("data-done");
    }
    system!.removeAttribute("data-unsettled");
    root.removeAttribute("data-type-pinned");
    delete cap!.dataset.cap;
    settledFlag = null;
    pinned = false;
    posed.fill(false);
  }

  /* Where the reader is against the track. A gate flip, or a resize that
     re-lays the page out, moves the track; the place is taken from the
     layout the reader was actually looking at: kept on every scroll from
     the cached geometry, and frozen from the first resize event (before
     the browser lays out the new size) until the engine has re-decided. */
  type Place = { y: number; top: number; h: number; travel: number; head: number; pinned: boolean };
  const livePlace = (): Place => {
    const r = track!.getBoundingClientRect();
    return {
      y: scrollY,
      top: r.top + scrollY,
      h: r.height,
      travel: track!.offsetHeight - stage!.offsetHeight,
      head: head!.getBoundingClientRect().top,
      pinned: getComputedStyle(stage!).position === "sticky",
    };
  };
  const cachedPlace = (): Place => {
    const y = scrollY;
    const st = on ? clamp(y, trackTop, trackTop + travel) : trackTop;
    return { y, top: trackTop, h: trackH, travel: on ? travel : 0, head: st - y + headOff, pinned: on };
  };
  let lastPlace: Place | null = null;
  let frozen = false;
  const note = () => {
    if (measured && !frozen) lastPlace = cachedPlace();
  };

  /* Keep the reader on what they were looking at: past the chapter, the
     same distance past it; inside the pin, the same point of the figure
     (pinned -> static: the System where the figure stood; static ->
     pinned, while reading the System: the finished frame, which is what
     the static chapter shows). Above it, or static throughout, the
     browser's own scroll anchoring holds. */
  function keepPlace(a: Place, b: Place) {
    let to: number;
    if (a.y >= a.top + a.h) to = b.top + b.h + (a.y - a.top - a.h);
    else if (!a.pinned && b.pinned && a.head < innerHeight / 2) to = b.top + b.travel;
    else if (a.y <= a.top + 0.5) return;
    else if (a.pinned && b.pinned) {
      const past = a.y - a.top - a.travel;
      to = b.top + (past > 0 ? b.travel + past : ((a.y - a.top) / a.travel) * b.travel);
    } else if (a.pinned) to = b.y + (b.head - Math.max(a.head, 80)); // header clear
    else if (b.pinned) to = b.top + b.travel;
    else return;
    to = Math.max(0, Math.round(to));
    if (Math.abs(to - scrollY) >= 1) scrollTo({ top: to, behavior: "instant" });
  }

  /* The gate: motion preference, forced colours and size (TYPE_QUERY),
     then a fit check of the finished frame against the visible (svh)
     screen: the head and the menu in the room, and every band's content
     between the menu's top and the room's foot. Anything else keeps the
     static chapter. */
  function decide() {
    if (!alive) return;
    const before = lastPlace ?? livePlace();
    let want = gateMQ.matches && !rmMQ.matches;
    if (want) {
      // measure the armed, pinned layout
      root.dataset.typeMotion = "on";
      placeSystem();
      const cs = getComputedStyle(stageIn!);
      const room = stageIn!.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const foot = stageIn!.getBoundingClientRect().top + stageIn!.clientHeight - parseFloat(cs.paddingBottom);
      const top = head!.getBoundingClientRect().top;
      const lr = list!.getBoundingClientRect();
      // the bands at their natural heights (each its content and its
      // padding; the last's reaches down to the floor) must fit
      // between the menu's top and the floor of the stage
      system!.setAttribute("data-measure", "");
      const natural = bands.reduce((sum, b) => sum + b.getBoundingClientRect().height, 0);
      system!.removeAttribute("data-measure");
      const floor = stage!.getBoundingClientRect().bottom;
      want = lr.bottom - top <= room + 0.5 && lr.bottom <= foot + 0.5 && natural <= floor - lr.top + 0.5;
    }
    const was = on;
    on = want;
    root.dataset.typeMotion = on ? "on" : "off";
    if (!on && was) clear();
    keepPlace(before, livePlace());
    if (!on) {
      geo = null;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      system!.style.removeProperty("--below");
      cache.delete(system!);
      measureTrack();
    } else {
      measure();
      read();
      cur = target;
      render(cur, Infinity);
      kick();
    }
    frozen = false;
    note();
  }

  // Pinned, everything is laid out in the svh box, so a mobile toolbar
  // showing or hiding changes nothing measured: re-decide only when the
  // width or that box changes (or, static, when the window does)
  let rt = 0;
  let lastKey = "";
  const sizeKey = () => `${innerWidth}x${on ? stageIn.clientHeight : innerHeight}`;
  const onResize = () => {
    frozen = true;
    clearTimeout(rt);
    rt = window.setTimeout(() => {
      if (sizeKey() !== lastKey) decide();
      else {
        measureTrack();
        frozen = false;
        note();
      }
      lastKey = sizeKey();
    }, 120);
  };
  const onScroll = () => {
    note();
    kick();
  };

  // The page above can change height on its own (a chapter reflows, an
  // embed loads): re-measure the track whenever the page's height changes
  const ro = new ResizeObserver(() => {
    if (!measured) return;
    measureTrack();
    note();
  });
  ro.observe(document.body);

  const io$ = new IntersectionObserver(
    (es) => {
      const v = es[es.length - 1].isIntersecting;
      if (v && !visible && on) {
        // coming back into view: start from where the reader is, not
        // from where the figure was left
        measureTrack();
        read();
        cur = target;
        render(cur, Infinity);
      }
      visible = v;
      kick();
    },
    { rootMargin: "25% 0px" },
  );
  io$.observe(track);

  // Keyboard: focus inside the figure finishes it at once, without
  // moving the page, until focus leaves it
  const onFocusIn = (e: FocusEvent) => {
    const t = e.target as HTMLElement | null;
    if (!on || !t || !t.matches(":focus-visible")) return;
    forced = true;
    render(cur, Infinity);
  };
  const onFocusOut = (e: FocusEvent) => {
    if (!forced || stage.contains(e.relatedTarget as Node | null)) return;
    forced = false;
    render(cur, Infinity);
  };

  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onResize);
  rmMQ.addEventListener("change", decide);
  gateMQ.addEventListener("change", decide);
  stage.addEventListener("focusin", onFocusIn);
  stage.addEventListener("focusout", onFocusOut);

  // Measurements are true only once the faces are in
  document.fonts.ready.then(() => {
    if (!alive) return;
    decide();
    lastKey = sizeKey();
  });

  return {
    destroy() {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(rt);
      io$.disconnect();
      ro.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      rmMQ.removeEventListener("change", decide);
      gateMQ.removeEventListener("change", decide);
      stage.removeEventListener("focusin", onFocusIn);
      stage.removeEventListener("focusout", onFocusOut);
      clear();
      delete root.dataset.typeMotion;
    },
    renderAt(p: number) {
      if (!on) return;
      cur = clamp(p, 0, END);
      render(cur, Infinity);
    },
  };
}
