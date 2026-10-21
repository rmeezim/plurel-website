/*
  Services: the typographic figure and the layered system. The engine
  behind components/home/services-type.tsx (markup in
  services-chapter.tsx, pin, clone and plate rules in
  services-type.module.css).

  The eight discipline names first appear the way eight different
  suppliers would set them: mismatched faces, weights, widths, cases,
  colours, slants and rotations. Scroll lines them up on the rows' grid
  ("Lined up, it's still a menu."), then sets them in one face, one scale
  and one rhythm, stage by stage along the chain (Narrative, Create,
  Distribute, Measure). Then the menu drains into the system: layer by
  layer, foundation first, a layer's names leave their rows and lie down
  on a plate of glass that settles onto the stack, the rows below close
  ranks, and the chain lights again as each layer locks into place. The
  finished figure is the layer list beside the stack.

  The layer list is the real, accessible text: eight service links,
  grouped by layer. The menu the names line up on, the eight clones that
  carry the motion and the plates are aria-hidden. Each clone hands its
  name to the menu's own text once it is set, takes it back when its
  layer leaves, and hands it to its plate when it lands. HTML and SVG
  only: no canvas, no WebGL.

  Pure parts first (stages and layers, supplier tables, timeline, style
  function, the stack's geometry, the flight), then the DOM engine
  (mountServicesType).
*/

/* ---------------------------------------------------------------- chain */

export type StageKey = "narrative" | "create" | "distribute" | "measure";

/**
  The chain the eight run on, in order, which is also the system's four
  layers, foundation first. `line` is the layer's one line in the list.
*/
export const STAGES: readonly { key: StageKey; name: string; line: string }[] = [
  { key: "narrative", name: "Narrative", line: "What you stand for and how it sounds, before anything is made." },
  { key: "create", name: "Create", line: "The site every buyer meets, and the content that earns attention." },
  { key: "distribute", name: "Distribute", line: "Putting the story where attention gathers: answers, search, paid and press." },
  { key: "measure", name: "Measure", line: "One set of numbers across every layer, counted as qualified demand." },
];

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

/*
  The media query the pin needs, besides the measured fit check. Keep it
  identical to the gate in services-type.module.css (search TYPE_QUERY).
  Phones need 650px of height, so a 360x640 screen keeps the static
  system (its finished frame would not hold the list and the stack at a
  comfortable size); lg needs 640px. The fit check then measures the
  finished frame against the visible (svh) screen.
*/
export const TYPE_QUERY =
  "(prefers-reduced-motion: no-preference) and (forced-colors: none) and (min-width: 360px) and (max-width: 63.99rem) and (min-height: 650px), " +
  "(prefers-reduced-motion: no-preference) and (forced-colors: none) and (min-width: 64rem) and (min-height: 640px)";

/** Below lg the stack sits under the list, and every layer starts closed */
export const STACKED_QUERY = "(max-width: 63.99rem)";

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

/** The house display style (`type-display`): where every supplier ends */
export const HOUSE = { mono: false, wght: 430, wdth: 110, tr: -0.018, rgb: TONE.paper, cs: "none", sk: 0 } as const;

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
  Eight suppliers, eight house styles. Each name keeps roughly its own
  row's height in the poster, so no name ever has to cross another on its
  way to the grid; the disorder is in face, weight, width, case, slant,
  rotation, colour and x. Checked by the overlap probe at p 0 to 0.45 on
  eighteen screens, 360x620 to 1920x1080 (min gap 8px between boxes).
*/
export const DESK: readonly Supplier[] = [
  { who: "web team", cs: "lower", wdth: 75, wght: 820, size: 92, tr: -0.045, c: "paper", rot: 0, sk: 0, x: 0, y: 0, ax: "l", ay: "t" },
  { who: "brand studio", cs: "upper", wdth: 125, wght: 210, size: 20, min: 20, tr: 0.44, c: "blush", rot: 0, sk: 0, x: 1, y: 0.04, ax: "r", ay: "t" },
  { who: "SEO agency", cs: "upper", wdth: 82, wght: 900, size: 54, tr: -0.012, c: "signal", rot: -7, sk: 0, x: 0.36, y: 0.165, ax: "l", ay: "t" },
  { who: "writers", cs: "none", wdth: 88, wght: 330, size: 40, tr: 0, c: "fog", rot: 0, sk: -13, x: 0.87, y: 0.335, ax: "r", ay: "t" },
  { who: "ads agency", cs: "upper", wdth: 125, wght: 900, size: 156, tr: -0.04, c: "brand", rot: 0, sk: 0, x: -0.004, y: 0.465, ax: "l", ay: "t" },
  { who: "PR firm", cs: "none", wdth: 100, wght: 540, size: 28, min: 18, tr: -0.005, c: "paper", rot: -90, sk: 0, x: 1, y: 0.75, ax: "r", ay: "b" },
  { who: "creative studio", cs: "none", wdth: 112, wght: 200, size: 116, tr: -0.05, c: "paper", rot: 0, sk: 0, x: 0.3, y: 0.765, ax: "l", ay: "t" },
  { who: "consultants", cs: "upper", mono: true, wdth: 100, wght: 400, size: 22, min: 20, tr: 0.06, c: "fog", rot: 0, sk: 0, x: 0, y: 1, ax: "l", ay: "b" },
];

export const PHONE: readonly Supplier[] = [
  { who: "web team", cs: "lower", wdth: 75, wght: 820, size: 46, tr: -0.045, c: "paper", rot: 0, sk: 0, x: 0, y: 0, ax: "l", ay: "t" },
  { who: "brand studio", cs: "upper", wdth: 125, wght: 210, size: 16, min: 16, tr: 0.36, c: "blush", rot: 0, sk: 0, x: 1, y: 0.125, ax: "r", ay: "t" },
  { who: "SEO agency", cs: "upper", wdth: 80, wght: 900, size: 29, tr: -0.012, c: "signal", rot: -7, sk: 0, x: 0.1, y: 0.2, ax: "l", ay: "t" },
  { who: "writers", cs: "none", wdth: 88, wght: 330, size: 23, tr: 0, c: "fog", rot: 0, sk: -13, x: 0.82, y: 0.345, ax: "r", ay: "t" },
  { who: "ads agency", cs: "upper", wdth: 125, wght: 900, size: 58, tr: -0.04, c: "brand", rot: 0, sk: 0, x: -0.01, y: 0.455, ax: "l", ay: "t" },
  { who: "PR firm", cs: "none", wdth: 100, wght: 540, size: 16, min: 16, tr: -0.005, c: "paper", rot: -90, sk: 0, x: 1, y: 0.7, ax: "r", ay: "b" },
  { who: "creative studio", cs: "none", wdth: 112, wght: 200, size: 44, tr: -0.05, c: "paper", rot: 0, sk: 0, x: 0, y: 0.73, ax: "l", ay: "t" },
  { who: "consultants", cs: "upper", mono: true, wdth: 100, wght: 400, size: 20, min: 20, tr: 0.04, c: "fog", rot: 0, sk: 0, x: 1, y: 1, ax: "r", ay: "b" },
];

/** Reference poster each table is drawn for (content width x poster height) */
export const REF = { desk: { w: 1344, h: 680 }, phone: { w: 350, h: 480 } } as const;

/** Mono suppliers change family a little before the case flips: the "set" moment */
const FAMILY_FLIP = 0.42;
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
  // to the house 110, so the row never ends narrower than the others
  const wdth = mono ? 100 : Math.round(lerp(sp.mono ? 100 : sp.wdth, HOUSE.wdth, t));
  return {
    mono,
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
  the pin now runs on to END, so the first two beats keep their exact
  scroll distances.

  0 ...... .155  .165 .... .34  .29 ..... .45 .485 ........... .8  .86 ............... 1.2  1.15 ..... 1.27 .... END
  | poster held | baselines    | column      | menu | set, stage by stage | drain, layer by layer | the list  | rest
  The poster holds for the first 15% of the first beats' pin (about
  150px of scroll at 1440x900), whole on the pinned screen, before
  anything moves. Caption: a (eight voices) -> b at .35 (a menu) -> c at
  .53, as the first names are set (a system). The chain fades in at .35
  and lights stage by stage as its rows are set; then, once every name is
  set, the menu drains into the stack, foundation first, and the chain
  lights again as each layer locks. The list rises where the menu stood,
  the chain gives way to it, and the figure takes the pointer (1.27).
*/
export const END = 15 / 11; // 150svh / 110svh: 40svh more pin on desktop, 35svh on phones

export const T = {
  rule: { at: 0.155, step: 0.016, len: 0.14 }, // the rows' hairlines draw: the grid they land on
  gy: { at: 0.165, step: 0.007, len: 0.13 }, // onto the baselines: straighten, come down to row size
  gx: { at: 0.29, step: 0.007, len: 0.11 }, // onto the column: flush left on column 4
  chain: { at: 0.35, len: 0.1 },
  face: { at: 0.485, step: 0.07, inner: 0.012, len: 0.1 }, // one stage at a time
  cap: [0.35, 0.53] as const,
  // one layer at a time: its names leave together, its plate settles, and
  // it locks len after the layer's turn starts
  drain: { at: 0.86, step: 0.075, inner: 0, len: 0.11 },
  // the rows below close ranks once the names have cleared the menu: 60%
  // into a flight (desktop), or as soon as a name has folded away (below
  // lg, in fold); as fractions of drain.len
  close: { lag: 0.6, foldLag: 0.45, len: 0.35 },
  fold: 0.45,
  // a plate arrives from 40 units up, under its flying names (desktop),
  // or below lg, once the rows above its place have closed ranks
  plate: { lag: 0.3, foldLag: 0.6, rise: 40 },
  list: { at: 1.15, step: 0.018, len: 0.06 }, // the list's four rows rise in where the menu stood
  chainOut: { at: 1.14, len: 0.08 },
  settled: 1.27, // the list and the stack take the pointer from here
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

/** When each row leaves the menu, and when its layer locks onto the stack */
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

/** A layer's turn on the stack: [its names leave, it locks] */
export function lockWindow(s: number): [number, number] {
  const at = T.drain.at + s * T.drain.step;
  return [at, at + T.drain.len];
}

/** A stage's chain word lights again for its layer's turn, until the next layer's starts */
export function relightWindow(s: number, n = STAGES.length): [number, number] {
  const [at, lock] = lockWindow(s);
  return [at, s === n - 1 ? lock + 0.02 : at + T.drain.step];
}

/* ---------------------------------------------------------------- stack */

/** A 2D affine matrix, as CSS and SVG write it: [a, b, c, d, e, f] */
export type Mat = readonly [number, number, number, number, number, number];
export type Pt = readonly [number, number];

/*
  The stack: four plates of glass, foundation at the bottom, in a dimetric
  view. Each plate is turned phi in its own plane and its depth is
  foreshortened by k (a camera looking down at 30 degrees: sin 30 = 0.5),
  so a plate point (u, v) lands on (u cos phi - v sin phi, k (u sin phi +
  v cos phi)). Units are SVG user units: the stack is one SVG whose
  viewBox scales to its column, and its 1px edges never scale with it.
  The names lie on their plate along u, near the front edge: the strip of
  a plate that the plate above never covers.
*/
export const PLATE = {
  phi: -30,
  k: 0.5,
  W: 520, // along the names
  D: 300, // depth
  t: 8, // thickness
  gap: 104, // from one plate to the next, on screen
  lift: 14, // the open layer's plate
  bezel: 12, // the inner line, in from the edge
  pad: 84, // the names start this far along u (clear of the menu's longest name, on the way)
  padv: 24, // the front name's baseline, in from the front edge
  pitch: 32, // from one name to the next
  m: 2, // margin
  mL: 36, // more on the left, clear of the list
} as const;

/** The plate projection as a matrix with no translation */
export function plateMatrix(phi = PLATE.phi, k = PLATE.k): Mat {
  const r = (phi * Math.PI) / 180;
  return [Math.cos(r), k * Math.sin(r), -Math.sin(r), k * Math.cos(r), 0, 0];
}

export type PlateGeo = {
  key: StageKey;
  face: Pt[]; // left, back, right and front corners
  bezel: Pt[];
  sideL: Pt[]; // the thickness under the left-front edge
  sideR: Pt[]; // ... and under the front-right edge
  edge: Pt[]; // the lit front edges: left, front, right corners
  lip: Pt[]; // the bottom of the thickness
  hit: Pt[]; // the silhouette, for the pointer
  names: { i: number; text: string; m: Mat }[]; // i: the service's place in the menu
};

const r2 = (n: number) => Math.round(n * 100) / 100;
const r5 = (n: number) => Math.round(n * 1e5) / 1e5;

/**
 * The stack's geometry, foundation first (plate 0 is drawn first, at the
 * bottom, and every plate above it covers its back). `layers` lists each
 * layer's names in menu order.
 */
export function stackGeometry(layers: readonly { key: StageKey; names: readonly { i: number; text: string }[] }[]) {
  const { W, D, t, gap, lift, bezel, pad, padv, pitch, m, mL } = PLATE;
  const [a, b, c, d] = plateMatrix();
  const P = (u: number, v: number): Pt => [a * u + c * v, b * u + d * v];
  const cs = [P(0, 0), P(W, 0), P(W, D), P(0, D)];
  const minX = Math.min(...cs.map((p) => p[0]));
  const maxX = Math.max(...cs.map((p) => p[0]));
  const minY = Math.min(...cs.map((p) => p[1]));
  const maxY = Math.max(...cs.map((p) => p[1]));
  const n = layers.length;
  const w = Math.ceil(mL + maxX - minX + m);
  const h = Math.ceil(m + lift + maxY - minY + t + (n - 1) * gap + m);
  const plates: PlateGeo[] = layers.map((L, idx) => {
    const ox = mL - minX;
    const oy = m + lift - minY + (n - 1 - idx) * gap;
    const S = (u: number, v: number): Pt => {
      const p = P(u, v);
      return [r2(ox + p[0]), r2(oy + p[1])];
    };
    const dn = (p: Pt): Pt => [p[0], r2(p[1] + t)];
    const L0 = S(0, 0);
    const B = S(W, 0);
    const R = S(W, D);
    const F = S(0, D);
    return {
      key: L.key,
      face: [L0, B, R, F],
      bezel: [S(bezel, bezel), S(W - bezel, bezel), S(W - bezel, D - bezel), S(bezel, D - bezel)],
      sideL: [L0, F, dn(F), dn(L0)],
      sideR: [F, R, dn(R), dn(F)],
      edge: [L0, F, R],
      lip: [dn(L0), dn(F), dn(R)],
      hit: [L0, B, R, dn(R), dn(F), dn(L0)],
      names: L.names.map((nm, j) => {
        const [e, f] = S(pad, D - padv - (L.names.length - 1 - j) * pitch);
        return { i: nm.i, text: nm.text, m: [r5(a), r5(b), r5(c), r5(d), e, f] as Mat };
      }),
    };
  });
  return { w, h, plates };
}

/** A matrix as scale x turn x foreshortening (the plate matrix's form) */
export function decompose(m: Mat) {
  const s = Math.hypot(m[0], m[2]);
  return { s, phi: Math.atan2(-m[2], m[0]), k: Math.hypot(m[1], m[3]) / s };
}

export function compose(s: number, phi: number, k: number, e: number, f: number): Mat {
  const c = Math.cos(phi);
  const n = Math.sin(phi);
  return [s * c, s * k * n, -s * n, s * k * c, e, f];
}

/** How far across a flight has gone, at flight progress t (0 to 1): out of the menu first */
export const flightX = (t: number) => 1 - Math.pow(1 - io(clamp(t)), 4);

/**
 * A name on its way from its row to its plate, at flight progress t. The
 * box's corner swoops out of the menu to the right first and comes down
 * onto the plate last (so it never crosses a name still on the rows), the
 * name comes down to the plate's size on the way, and over the second
 * half it lies down onto the plate's plane. (x0, y0) is the row's box, to
 * the plate name's matrix, both for the same font size. At t = 1 it is
 * exactly `to` (see services-type.test.ts).
 */
export function flightAt(t: number, x0: number, y0: number, to: Mat): Mat {
  if (t >= 1) return to;
  const g = decompose(to);
  const u = io(clamp(t));
  const fx = flightX(t);
  const fy = Math.pow(u, 2.5);
  const lie = snap(clamp((u - 0.42) / 0.58));
  const s = Math.exp(Math.log(g.s) * io(clamp(t / 0.85)));
  return compose(s, g.phi * lie, lerp(1, g.k, lie), lerp(x0, to[4], fx), lerp(y0, to[5], fy));
}

/* ---------------------------------------------------------------- engine */

const CASE_CSS = { upper: "uppercase", lower: "lowercase", none: "none" } as const;
const SANS = "var(--font-mona), system-ui, sans-serif";
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
  to: Mat | null; // its plate name, for a box at font-size N (desktop)
  fs: number; // the plate name's font size
};

export type TypeHandle = {
  destroy: () => void;
  /** Debug and probes only: render one progress value now (timeline units, 0 to END) */
  renderAt: (p: number) => void;
};

type Styled = HTMLElement | SVGElement;

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
  const system = q("[data-type-system]");
  const layers = q("[data-type-layers]");
  const stack = root.querySelector<SVGSVGElement>("svg[data-type-stack]");
  const noop = { destroy() {}, renderAt() {} };
  if (!track || !stage || !stageIn || !head || !list || !cap || !chain || !system || !layers || !stack) return noop;

  const rows = qa("[data-row]", list);
  const clones = qa("[data-type-clone]", stage);
  if (rows.length !== clones.length || rows.length === 0) return noop;
  const slots = rows.map((r) => q("[data-slot]", r)!);
  const rules = rows.map((r) => q("[data-rule]", r)!);
  const curs = rows.map((r) => q("[data-cur]", r)!);
  const ruleEnd = q("[data-rule-end]", list);
  const words = qa("[data-chain-word]", chain);
  const wordStage = words.map((b) => STAGES.findIndex((x) => x.key === b.dataset.chainWord));
  const lrows = qa("[data-layer-row]", layers);
  const plates = Array.from(stack.querySelectorAll<SVGGElement>("g[data-plate]"));
  const plateStage = plates.map((g) => STAGES.findIndex((x) => x.key === g.dataset.plate));
  const flashes = plates.map((g) => g.querySelector<SVGElement>("[data-plate-flash]"));
  const pnames = rows.map((_, i) => stack.querySelector<SVGTextElement>(`[data-plate-name="${i}"]`));
  const stages = rows.map((r) => (r.dataset.st as StageKey) ?? "create");
  const order = setOrder(stages);
  const times = rowTimes(order);
  const drains = drainTimes(order);
  const windows = STAGES.map((_, s) => stageWindow(s, order));
  const locks = STAGES.map((_, s) => lockWindow(s));
  const relights = STAGES.map((_, s) => relightWindow(s));
  // the row that leaves last (the menu's foot goes with it)
  const lastRow = drains.reduce((m, d, i) => (d.leave > drains[m].leave ? i : m), 0);

  const rmMQ = matchMedia("(prefers-reduced-motion: reduce)");
  const gateMQ = matchMedia(TYPE_QUERY);

  let on = false;
  let geo: Geo[] | null = null;
  let desk = true; // names fly to their plates (lg); below lg they fold away
  let narrowK = 1; // desktop: the menu's rules draw back to the list's column
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
  // false) or at its true size, at face step tq; small: at its plate's size
  type Shape = { laid: boolean; tq: number; small: boolean };
  const shapes: Shape[] = rows.map(() => ({ laid: false, tq: 0, small: false }));
  let pending = false; // a clone is a step behind its row: render again
  // a row's slot closes once its name has cleared the menu (flown out, or folded away)
  const closedAt = (j: number, at: number) =>
    snap(seg(at, drains[j].leave + (desk ? T.close.lag : T.close.foldLag) * T.drain.len, T.close.len * T.drain.len));
  const pulled = rows.map(() => 0); // how far each row's hairline has been pulled after its name

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
    put(el, "font-family", f.mono ? MONO : SANS);
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
  let bM = 0.8;

  function measure() {
    const phone = innerWidth < 1024;
    desk = !phone;
    const specs = phone ? PHONE : DESK;
    const ref = phone ? REF.phone : REF.desk;
    // measure the figure at rest: no row shifted, no plate on its way
    for (const el of rows) put(el, "translate", "");
    for (const el of plates) put(el, "transform", "");
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
    const k = phone
      ? clamp(Math.min(cw / ref.w, H / ref.h), 0.8, 1.9)
      : clamp(Math.min(cw / ref.w, H / ref.h), 0.6, 1.12);
    bS = baselineOf(SANS, "110%");
    bM = baselineOf(MONO, "100%");
    measureTrack();
    // the rules span the rows; on desktop they draw back to the list's column
    const rr0 = rows[0].getBoundingClientRect();
    const lyr = layers!.getBoundingClientRect();
    ruleW = rr0.width;
    narrowK = phone || rr0.width <= 0 ? 1 : clamp((lyr.right - rr0.left) / rr0.width, 0.2, 1);
    // the plate names, at rest, in stage coordinates
    const ctm = stack!.getScreenCTM();

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
      let to: Mat | null = null;
      let fs = Ns[i];
      const tn = pnames[i];
      const tm = tn?.transform.baseVal.consolidate()?.matrix;
      if (!phone && ctm && tn && tm) {
        fs = parseFloat(getComputedStyle(tn).fontSize) || Ns[i];
        const A = ctm.multiply(tm);
        // the clone's box corner: its baseline sits bS of the size below it
        const ox = A.e - A.c * bS * fs - sr.left;
        const oy = A.f - A.d * bS * fs - sr.top;
        const n = fs / Ns[i];
        to = [A.a * n, A.b * n, A.c * n, A.d * n, ox, oy];
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
      };
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
    // Closing ranks: each row moves up by the share of every row above it
    // that has left (as its slot closes), so the menu drains from the top
    // of each gap and never leaves a hole
    const shift: number[] = [];
    // (a row follows the slots that close above it from earlier layers
    // only: never its own layer's, which close once it has cleared the
    // menu, so a leaving name moves in step with the rows around it)
    for (let i = 0; i < rows.length; i++) {
      let up = 0;
      for (let j = 0; j < i; j++) if (drains[j].layer < drains[i].layer) up += closedAt(j, p) * geo[j].pitch;
      shift[i] = -up;
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
      // its layer's turn: the name leaves its row (and, desktop, flies to
      // its plate, landing as the plate locks; below lg it folds away)
      const tl = seg(p, dr.leave, dr.land - dr.leave);
      const leaving = p > dr.leave;
      const landed = desk ? p >= dr.land && !!g.to : tl >= T.fold;
      // The face (family, axes, tracking, case, size) moves in FACE_STEPS
      // even steps, and from mid-slide onto the column (hidden by the
      // motion) it is laid out at its true size rather than scaled. Every
      // new shape is a font instance to shape, the one real cost of a
      // frame: a frame lays out at most `budget` of them, and a clone left
      // a step behind catches up on the next frame. On its way to a plate
      // the name is laid out again, at the plate's size, halfway there.
      const small = desk && !!g.to && leaving && tl >= 0.55;
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
      // it has landed on its plate (or folded away).
      const set = !leaving && tf >= 1 && tx >= 1 && ty >= 1 && sh.laid && sh.tq >= 1 && !sh.small;
      flag(rows[i], "data-set", set);
      flag(el, "data-set", set || landed);
      const pn = pnames[i];
      if (pn) flag(pn, "data-wait", desk && !landed);
      put(rows[i], "translate", shift[i] ? `0 ${shift[i].toFixed(2)}px` : "");
      // a clone is only restyled while it moves: once posed (before its
      // row starts, in its poster shape) or set (hidden), a frame skips it
      const still = ty <= 0 && tx <= 0 && tfRaw <= 0;
      if (set || landed || (still && posed[i])) {
        posed[i] = posed[i] && !set && !landed;
      } else if (leaving && desk && g.to) {
        posed[i] = false;
        // the flight: house face, at the row's size and then the plate's
        const size = sh.small ? g.fs : g.N;
        styleFace(el, faceAt(sp, 1), size);
        flag(el, "data-laid", true);
        put(el, "opacity", "");
        put(el, "text-rendering", "geometricPrecision");
        const m = flightAt(tl, g.sx, g.sy + shift[i], g.to);
        const n = sh.small ? g.N / g.fs : 1;
        put(
          el,
          "transform",
          `matrix(${(m[0] * n).toFixed(5)},${(m[1] * n).toFixed(5)},${(m[2] * n).toFixed(5)},${(m[3] * n).toFixed(5)},${m[4].toFixed(3)},${m[5].toFixed(3)})`,
        );
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
        const b = fq.mono ? bM : bS;
        const rowY = g.sy + shift[i] + 14 * fold + bS * g.N - b * size;
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
      // the rows' hairlines: drawn as the names line up, drawn back to the
      // list's column as the menu starts to drain, and, as a name leaves,
      // pulled out after it (the right end holds), gone as it clears
      const draw = io(seg(p, T.rule.at + i * T.rule.step, T.rule.len));
      pulled[i] = leaving ? (desk && g.to ? flightX(tl) : io(clamp(tl / T.fold))) : 0;
      put(rules[i], "transform", ruleAt(draw * narrow, pulled[i]));
    }
    if (ruleEnd) {
      // the menu's foot rides on the last row, and goes with the last to leave
      const draw = io(seg(p, T.rule.at + rows.length * T.rule.step, T.rule.len));
      put(ruleEnd, "transform", ruleAt(draw * narrow, pulled[lastRow]));
    }
    // the plates settle onto the stack, foundation first; each flashes its
    // signal edge as it locks
    plates.forEach((pl, j) => {
      const [a, b] = locks[plateStage[j]] ?? [9, 9];
      const lag = desk ? T.plate.lag : T.plate.foldLag;
      const e = io(seg(p, a + lag * (b - a), (1 - lag) * (b - a)));
      put(pl, "transform", e >= 1 ? "" : `translate(0px, ${(-T.plate.rise * (1 - e)).toFixed(2)}px)`);
      put(pl, "opacity", e >= 1 ? "" : e.toFixed(3));
      const fl = flashes[j];
      if (fl) {
        const f = seg(p, b - 0.02, 0.09);
        put(fl, "opacity", f > 0 && f < 1 ? Math.sin(Math.PI * f).toFixed(3) : "");
      }
    });
    const tch = io(seg(p, T.chain.at, T.chain.len));
    const tco = io(seg(p, T.chainOut.at, T.chainOut.len));
    const op = tch * (1 - tco);
    put(chain!, "opacity", op >= 1 ? "" : op.toFixed(3));
    // a stage's word lights while its names are set, and again while its
    // layer locks into place
    words.forEach((w, j) => {
      const [a, b] = windows[wordStage[j]] ?? [9, 9];
      const [c, d] = relights[wordStage[j]] ?? [9, 9];
      const lit = (p >= a && p < b) || (p >= c && p < d);
      flag(w, "data-lit", lit);
      flag(w, "data-done", p >= b && !lit);
    });
    // the list rises where the menu stood, foundation first
    lrows.forEach((lr, j) => {
      const r = io(seg(p, T.list.at + j * T.list.step, T.list.len));
      put(lr, "--r", r >= 1 ? "" : r.toFixed(3));
      put(lr, "--ry", r >= 1 ? "" : `${((1 - r) * 12).toFixed(2)}px`);
    });
    const ci = p < T.cap[0] ? "a" : p < T.cap[1] ? "b" : "c";
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
    for (const el of [...clones, ...rules, ...curs, ...rows, ...lrows, ...plates, chain!]) {
      el.removeAttribute("style");
    }
    for (const el of flashes) el?.removeAttribute("style");
    if (ruleEnd) ruleEnd.removeAttribute("style");
    cache.clear();
    for (const el of [...clones, ...rows]) el.removeAttribute("data-set");
    for (const el of clones) el.removeAttribute("data-laid");
    for (const el of pnames) el?.removeAttribute("data-wait");
    for (const w of words) {
      w.removeAttribute("data-lit");
      w.removeAttribute("data-done");
    }
    system!.removeAttribute("data-unsettled");
    root.removeAttribute("data-type-pinned");
    root.style.removeProperty("--extra");
    extra = 0;
    delete cap!.dataset.cap;
    settledFlag = null;
    pinned = false;
    posed.fill(false);
  }

  /* An open layer the pinned frame has no room for: the stage grows by the
     difference (and the track with it, so the pin's travel is unchanged),
     and the rest of the list follows the pin as the page scrolls on */
  let extra = 0;
  const systemBottom = () => Math.max(layers!.getBoundingClientRect().bottom, stack!.getBoundingClientRect().bottom);
  function fitExtra() {
    if (!on) return;
    const cs = getComputedStyle(stageIn!);
    const foot = stageIn!.getBoundingClientRect().top + stageIn!.clientHeight - parseFloat(cs.paddingBottom);
    const next = Math.max(0, Math.ceil(systemBottom() - foot));
    if (next !== extra) {
      extra = next;
      if (extra) root.style.setProperty("--extra", `${extra}px`);
      else root.style.removeProperty("--extra");
    }
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
     (pinned -> static: the system where the figure stood; static ->
     pinned, while reading the system: the finished frame, which is what
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
     screen: the menu, and the system with every layer closed (an open
     layer that does not fit grows the stage instead, see fitExtra).
     Anything else keeps the static chapter. */
  function decide() {
    if (!alive) return;
    const before = lastPlace ?? livePlace();
    let want = gateMQ.matches && !rmMQ.matches;
    if (want) {
      // measure the armed, pinned layout
      root.dataset.typeMotion = "on";
      root.style.removeProperty("--extra");
      const cs = getComputedStyle(stageIn!);
      const room = stageIn!.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      // the head and the menu sit centred in the room: what hangs below the
      // menu has only the room's foot to reach
      const foot = stageIn!.getBoundingClientRect().top + stageIn!.clientHeight - parseFloat(cs.paddingBottom);
      // an open layer: its panel, and (phones) the line it shows only open
      const openD = layers!.querySelector<HTMLElement>("details[open]");
      const closedS = layers!.querySelector<HTMLElement>("details:not([open]) > summary");
      const panel = openD?.querySelector<HTMLElement>("[data-panel]");
      const sumH = (d: HTMLElement | null | undefined) => d?.querySelector("summary")?.getBoundingClientRect().height ?? 0;
      const open = panel
        ? panel.getBoundingClientRect().height + (closedS ? Math.max(0, sumH(openD) - closedS.getBoundingClientRect().height) : 0)
        : 0;
      const top = head!.getBoundingClientRect().top;
      const sr = stack!.getBoundingClientRect();
      const lyB = layers!.getBoundingClientRect().bottom;
      // the stack under the list (below lg) moves with an open layer; beside it, it does not
      const below = sr.top >= lyB - 1;
      const base = below ? sr.bottom - open : Math.max(sr.bottom, lyB - open);
      const need = Math.max(list!.getBoundingClientRect().bottom, base) - top;
      want = need <= room + 0.5 && base <= foot + 0.5;
    }
    const was = on;
    on = want;
    root.dataset.typeMotion = on ? "on" : "off";
    if (!on) {
      if (was) clear();
      root.style.removeProperty("--extra");
      extra = 0;
    } else {
      extra = -1;
      fitExtra();
    }
    keepPlace(before, livePlace());
    if (!on) {
      geo = null;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
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
  // A layer opened or closed: the pinned frame may need more (or less) room
  const rs = new ResizeObserver(() => fitExtra());
  rs.observe(layers);

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
      rs.disconnect();
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
