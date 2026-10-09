/*
  (02) Services, Fig. 02: one typographic system. The engine behind
  components/home/services-type.tsx (markup in services-chapter.tsx, pin
  and clone rules in services-type.module.css).

  The eight discipline names first appear the way eight different
  suppliers would set them: mismatched faces, weights, widths, cases,
  colours, slants and rotations. Scroll lines them up on the rows' grid
  ("Lined up, it's still a menu."), then sets them in one face, one scale
  and one rhythm, stage by stage along the chain (Narrative, Create,
  Distribute, Measure), until the figure is simply the contents list.

  The list in the markup is the real, accessible text. Eight aria-hidden
  clones carry the motion; each one hands its row back to the real text
  the moment its name is set. HTML text only: no canvas, SVG or WebGL.

  Pure parts first (stages, supplier tables, timeline, style function),
  then the DOM engine (mountServicesType).
*/

/* ---------------------------------------------------------------- chain */

export type StageKey = "narrative" | "create" | "distribute" | "measure";

/** The chain the eight run on, in order */
export const STAGES: readonly { key: StageKey; name: string }[] = [
  { key: "narrative", name: "Narrative" },
  { key: "create", name: "Create" },
  { key: "distribute", name: "Distribute" },
  { key: "measure", name: "Measure" },
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

/** Rows grouped in chain order: the order the names are set in */
export function setOrder(stages: readonly StageKey[]): number[][] {
  return STAGES.map((s) => stages.flatMap((k, i) => (k === s.key ? [i] : [])));
}

/*
  The media query the pin needs, besides the measured fit check. Keep it
  identical to the gate in services-type.module.css (search TYPE_QUERY).
  Phones need 650px of height, so a 360x640 screen keeps the static list
  (its finished frame would fit, but only with names and lines too small
  to read comfortably); lg needs 640px, just under where the finished
  frame stops fitting (measured from 360 to 1920 wide), so the fit check
  rarely has to undo the pin CSS sized at first paint.
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
  p = progress through the short pin (0..1).

  0 ...... .155  .165 .... .34  .29 ..... .45 .485 ........... .8  .74 .... .9  1
  | poster held | baselines    | column      | menu | set, stage by stage | rhythm | rest
  The poster holds for the first 15% of the pin (about 150px of scroll at
  1440x900), whole on the pinned screen, before anything moves.
  Caption: a (eight voices) -> b at .35 (a menu) -> c at .53, as the
  first names are set (a system). The chain fades in at .35 and lights
  stage by stage as its rows are set; it takes the pointer with the rows,
  once every name is set (.9).
*/
export const T = {
  rule: { at: 0.155, step: 0.016, len: 0.14 }, // the rows' hairlines draw: the grid they land on
  gy: { at: 0.165, step: 0.007, len: 0.13 }, // onto the baselines: straighten, come down to row size
  gx: { at: 0.29, step: 0.007, len: 0.11 }, // onto the column: flush left on column 4
  chain: { at: 0.35, len: 0.1 },
  face: { at: 0.485, step: 0.07, inner: 0.012, len: 0.1 }, // one stage at a time
  meta: { lag: -0.012, inner: 0.012, len: 0.1 }, // index, stage, line, arrow, as the stage lands
  cap: [0.35, 0.53] as const,
  settled: 0.9, // rows and chain take the pointer from here
} as const;

export const seg = (p: number, at: number, len: number) => clamp((p - at) / len);

export type RowTimes = { face: number; meta: number; stage: number };

/** When each row is set (face start) and revealed (meta start), in chain order */
export function rowTimes(order: number[][]): RowTimes[] {
  const out: RowTimes[] = [];
  order.forEach((rows, s) => {
    const at = T.face.at + s * T.face.step;
    const end = at + (rows.length - 1) * T.face.inner + T.face.len;
    rows.forEach((i, j) => {
      out[i] = { face: at + j * T.face.inner, meta: end + T.meta.lag + j * T.meta.inner, stage: s };
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
};

export type TypeHandle = {
  destroy: () => void;
  /** Debug and probes only: render one progress value now */
  renderAt: (p: number) => void;
};

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
  const noop = { destroy() {}, renderAt() {} };
  if (!track || !stage || !stageIn || !head || !list || !cap || !chain) return noop;

  const rows = qa("[data-row]", list);
  const clones = qa("[data-type-clone]", stage);
  if (rows.length !== clones.length || rows.length === 0) return noop;
  const slots = rows.map((r) => q("[data-slot]", r)!);
  const rules = rows.map((r) => q("[data-rule]", r)!);
  const curs = rows.map((r) => q("[data-cur]", r)!);
  const metas = rows.map((r) => qa("[data-meta]", r));
  const ruleEnd = q("[data-rule-end]", list);
  const btns = qa("[data-stage-btn]", chain);
  const btnStage = btns.map((b) => STAGES.findIndex((x) => x.key === b.dataset.stageBtn));
  const stages = rows.map((r) => (r.dataset.st as StageKey) ?? "create");
  const order = setOrder(stages);
  const times = rowTimes(order);
  const windows = STAGES.map((_, s) => stageWindow(s, order));

  const rmMQ = matchMedia("(prefers-reduced-motion: reduce)");
  const gateMQ = matchMedia(TYPE_QUERY);

  let on = false;
  let geo: Geo[] | null = null;
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
  // false) or at its true size, at face step tq
  type Shape = { laid: boolean; tq: number };
  const shapes: Shape[] = rows.map(() => ({ laid: false, tq: 0 }));
  let pending = false; // a clone is a step behind its row: render again

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
  const cache = new Map<HTMLElement, Record<string, string>>();
  const put = (el: HTMLElement, prop: string, v: string) => {
    let c = cache.get(el);
    if (!c) cache.set(el, (c = {}));
    if (c[prop] !== v) {
      c[prop] = v;
      el.style.setProperty(prop, v);
    }
  };
  const flag = (el: HTMLElement, name: string, v: boolean) => {
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
    const specs = phone ? PHONE : DESK;
    const ref = phone ? REF.phone : REF.desk;
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
      styleFace(el, faceAt(specs[i], 0), Fs[i]);
    });
    posed.fill(false);
    shapes.forEach((sh) => {
      sh.laid = false;
      sh.tq = 0;
    });
    geo = rows.map((_, i) => {
      const sp = specs[i];
      const rr = slots[i].getBoundingClientRect();
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
      };
    });
  }

  /** Re-lays out at most `budget` clones (see SHAPES_PER_FRAME) */
  function render(pIn: number, budget = SHAPES_PER_FRAME) {
    if (!geo) return;
    pending = false;
    const p = forced ? 1 : clamp(pIn);
    const settled = p >= T.settled;
    if (settledFlag !== settled) {
      settledFlag = settled;
      flag(list!, "data-unsettled", !settled);
    }
    for (let i = 0; i < rows.length; i++) {
      const g = geo[i];
      const sp = g.sp;
      const el = clones[i];
      const tm = times[i];
      const ty = snap(seg(p, T.gy.at + i * T.gy.step, T.gy.len));
      const tx = snap(seg(p, T.gx.at + i * T.gx.step, T.gx.len));
      const tfRaw = seg(p, tm.face, T.face.len);
      const tf = snap(tfRaw);
      // The face (family, axes, tracking, case, size) moves in FACE_STEPS
      // even steps, and from mid-slide onto the column (hidden by the
      // motion) it is laid out at its true size rather than scaled. Every
      // new shape is a font instance to shape, the one real cost of a
      // frame: a frame lays out at most `budget` of them, and a clone left
      // a step behind catches up on the next frame.
      const want: Shape = { laid: tx >= 0.5 || tfRaw > 0, tq: Math.round(tf * FACE_STEPS) / FACE_STEPS };
      const sh = shapes[i];
      let behind = sh.laid !== want.laid || sh.tq !== want.tq;
      if (behind && budget > 0) {
        budget--;
        sh.laid = want.laid;
        sh.tq = want.tq;
        behind = false;
      }
      if (behind) pending = true;
      // hand the row to the real text the moment its name is set, and only
      // once the clone is exactly that text: never both, never a jump
      const set = tf >= 1 && tx >= 1 && ty >= 1 && sh.laid && sh.tq >= 1;
      flag(el, "data-set", set);
      flag(rows[i], "data-set", set);
      // a clone is only restyled while it moves: once posed (before its
      // row starts, in its poster shape) or set (hidden), a frame skips it
      const still = ty <= 0 && tx <= 0 && tfRaw <= 0;
      if (set || (still && posed[i])) {
        posed[i] = posed[i] && !set;
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
        const rowY = g.sy + bS * g.N - b * size;
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
      put(rules[i], "transform", `scaleX(${io(seg(p, T.rule.at + i * T.rule.step, T.rule.len)).toFixed(4)})`);
      // index, stage, line and arrow land with their stage, as --r and
      // --ry (so a held stage still steps them back, see .dim, and the
      // lift never adds or drops a transform, which would re-lay out the
      // row); once in place they go back to CSS (hover and chain states)
      const r = io(seg(p, tm.meta, T.meta.len));
      for (const m of metas[i]) {
        put(m, "--r", r >= 1 ? "" : r.toFixed(3));
        put(m, "--ry", r >= 1 ? "" : `${((1 - r) * 8).toFixed(2)}px`);
      }
    }
    if (ruleEnd) put(ruleEnd, "transform", `scaleX(${io(seg(p, T.rule.at + rows.length * T.rule.step, T.rule.len)).toFixed(4)})`);
    const tch = io(seg(p, T.chain.at, T.chain.len));
    put(chain!, "opacity", tch >= 1 ? "" : tch.toFixed(3));
    // the chain filters rows, so it waits for every row to be set
    flag(chain!, "data-dormant", !settled);
    btns.forEach((btn, j) => {
      const [a, b] = windows[btnStage[j]] ?? [2, 2];
      flag(btn, "data-lit", p >= a && p < b);
      flag(btn, "data-done", p >= b);
    });
    const ci = p < T.cap[0] ? "a" : p < T.cap[1] ? "b" : "c";
    if (cap!.dataset.cap !== ci) cap!.dataset.cap = ci;
  }

  let seen = false; // the stage is on screen now
  function read() {
    const y = scrollY;
    const raw = (y - trackTop) / travel;
    target = clamp(raw);
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
    for (const el of [...clones, ...rules, ...curs, ...metas.flat(), chain!]) {
      el.removeAttribute("style");
    }
    if (ruleEnd) ruleEnd.removeAttribute("style");
    cache.clear();
    for (const el of [...clones, ...rows]) el.removeAttribute("data-set");
    for (const el of clones) el.removeAttribute("data-laid");
    for (const b of btns) {
      b.removeAttribute("data-lit");
      b.removeAttribute("data-done");
    }
    list!.removeAttribute("data-unsettled");
    chain!.removeAttribute("data-dormant");
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
     (pinned -> static: the list where the figure stood; static -> pinned,
     while reading the list: the finished frame, which is what the static
     list shows). Above it, or static throughout, the browser's own scroll
     anchoring holds. */
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
     screen. Anything else keeps the static list. */
  function decide() {
    if (!alive) return;
    const before = lastPlace ?? livePlace();
    let want = gateMQ.matches && !rmMQ.matches;
    if (want) {
      // measure the armed, pinned layout
      root.dataset.typeMotion = "on";
      const cs = getComputedStyle(stageIn!);
      const room = stageIn!.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const need = list!.getBoundingClientRect().bottom - head!.getBoundingClientRect().top;
      want = need <= room + 0.5;
    }
    const was = on;
    on = want;
    root.dataset.typeMotion = on ? "on" : "off";
    keepPlace(before, livePlace());
    if (!on) {
      if (was) clear();
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

  // Keyboard: focus inside the figure finishes the set at once, without
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
      cur = clamp(p);
      render(cur, Infinity);
    },
  };
}
