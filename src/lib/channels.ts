/*
  The channel tiles (components/home/channel-tiles.tsx): one fictional
  client's one story, cut into the seven formats it ships to, each drawn
  as a screen recording that plays in the Attention Field's STORY stage.

  The client is Halden, a maker of very quiet heat pumps for homeowners
  and building developers. Its campaign line rhymes with the field's
  NOISE stage. Everything here is invented: no real brand, publication,
  person or product appears in a tile.
*/

export type ChannelKey = "answer" | "search" | "reel" | "film" | "press" | "creator" | "ooh";

export type Channel = {
  key: ChannelKey;
  /** The format, as a reader would name it */
  name: string;
  /** The Attention Field lane it lands on (a name in AF_LANES) */
  lane: string;
  /** True aspect ratio, width / height */
  aspect: number;
  /** Nominal design size in CSS px; the field places a tile with translate + scale from this */
  w: number;
  h: number;
  /** Length of the recording's loop, in seconds (the tile's CSS keyframes are written against it) */
  loop: number;
  /** Where in the loop the recording starts, so a tile is never blank before it first plays */
  start: number;
  /**
   * The aspects the tile can reflow (a page, a feed) or crop (a scene) to,
   * so that the pinned mosaic's cuts line up (see mosaicLayout)
   */
  flex?: readonly [number, number];
  /**
   * What real footage replaces when public/video/channels/<key>.mp4 exists:
   * "scene" swaps the picture and keeps the product UI drawn over it,
   * "screen" swaps the whole tile (the clip is the screen recording)
   */
  clip: "scene" | "screen";
};

/**
 * In the order the story is cut: the answer and the search first, the
 * billboard last. Every loop has its own length, so no two recordings
 * restart together, and each starts (CHANNELS start, also the frame it
 * holds before it first plays) at its most telling moment.
 */
export const CHANNELS: readonly Channel[] = [
  { key: "answer", name: "AI answer", lane: "AI answers", aspect: 4 / 5, w: 320, h: 400, loop: 11.3, start: 6.2, clip: "screen" },
  { key: "search", name: "Search result", lane: "Search", aspect: 16 / 9, w: 480, h: 270, loop: 13.7, start: 0.9, flex: [1.6, 1.9], clip: "screen" },
  { key: "reel", name: "Reel", lane: "Social", aspect: 9 / 16, w: 225, h: 400, loop: 10, start: 1.2, clip: "scene" },
  { key: "film", name: "Brand film", lane: "Video", aspect: 16 / 9, w: 480, h: 270, loop: 12.4, start: 2.2, clip: "scene" },
  { key: "press", name: "Press feature", lane: "Press", aspect: 4 / 5, w: 320, h: 400, loop: 14.9, start: 0.6, flex: [0.72, 0.9], clip: "screen" },
  { key: "creator", name: "Creator post", lane: "Creators", aspect: 4 / 5, w: 320, h: 400, loop: 12.9, start: 2.6, flex: [0.72, 0.9], clip: "scene" },
  { key: "ooh", name: "Billboard", lane: "Paid media", aspect: 3, w: 600, h: 200, loop: 16, start: 0, flex: [2.7, 3.4], clip: "screen" },
];

export const CHANNEL = Object.fromEntries(CHANNELS.map((c) => [c.key, c])) as Record<ChannelKey, Channel>;

/** Real footage for a tile, found at build time by lib/clips.ts */
export type ChannelClip = { src: string; poster?: string };
export type ChannelClips = Partial<Record<ChannelKey, ChannelClip>>;

/* ---------- the mosaic ---------- */

/**
 * How the tiles are composed: side by side in a row (one height) or
 * stacked in a column (one width), nested. Every edge is shared, so the
 * mosaic is one rectangle cut into formats, like a guillotine cuts a
 * printed sheet: each gutter runs the full length of its row or column.
 * Where bands are stacked, their cuts line up or step well clear of each
 * other (mosaicJogs), never by a gutter or two.
 */
export type MosaicNode = ChannelKey | { row: readonly MosaicNode[] } | { col: readonly MosaicNode[] };

/**
 * Landscape: all seven, the answer and the search largest. The search and
 * the film share an aspect, so the right half is a true two-by-two grid.
 */
export const MOSAIC_WIDE: MosaicNode = {
  row: [
    { col: [{ row: ["answer", "reel"] }, "ooh"] },
    { col: [{ row: ["search", "creator"] }, { row: ["film", "press"] }] },
  ],
};
/** Upright tablets: all seven in three bands (flexible tiles line the cuts up) */
export const MOSAIC_TALL: MosaicNode = {
  col: [{ row: ["answer", "reel", "creator"] }, { row: ["search", "press"] }, { row: ["film", "ooh"] }],
};
/**
 * Phones: two, sized to read (their body type at 11px or more): the answer
 * over the search, each the full width. The search reflows to a narrower
 * page there (PHONE_SEARCH), and a short phone crops the answer's foot. The
 * static mosaic shows the same two below 40rem.
 */
export const MOSAIC_PHONE: MosaicNode = { col: ["answer", "search"] };
/** A phone wide enough to show the answer and the reel side by side at a size to read */
export const MOSAIC_PHONE_WIDE: MosaicNode = {
  col: [{ row: ["answer", "reel"] }, "search"],
};
/**
 * The search result's page on a phone: reflowed to this nominal width, at
 * this aspect in the pinned field and a taller one (the whole top result)
 * in the static mosaic, where the page scrolls on
 */
export const PHONE_SEARCH = { w: 340, aspect: 1.6, still: 1.32 };

type Aspect = (k: ChannelKey) => number;
const nominal: Aspect = (k) => CHANNEL[k].aspect;

/**
 * A node's width as a function of its height: w = a·h + g·bg, for a
 * gutter g (rows add their gutters to the width, columns take theirs off
 * the height). The static mosaic hands these to flexbox (grow a, basis
 * g·bg), which then cuts exactly the same rectangle as mosaicLayout.
 */
export function mosaicLinear(n: MosaicNode, ar: Aspect = nominal): { a: number; bg: number } {
  if (typeof n === "string") return { a: ar(n), bg: 0 };
  if ("row" in n) {
    const ks = n.row.map((k) => mosaicLinear(k, ar));
    return { a: ks.reduce((s, k) => s + k.a, 0), bg: ks.reduce((s, k) => s + k.bg, 0) + ks.length - 1 };
  }
  const ks = n.col.map((k) => mosaicLinear(k, ar));
  const inv = ks.reduce((s, k) => s + 1 / k.a, 0);
  const a = 1 / inv;
  return { a, bg: a * (ks.reduce((s, k) => s + k.bg / k.a, 0) - (ks.length - 1)) };
}

export type MosaicRect = { x: number; y: number; w: number; h: number };
/** A gutter, in the order a guillotine makes them (outermost first) */
export type MosaicCut = MosaicRect & { depth: number; vertical: boolean };
export type MosaicLayout = {
  frame: MosaicRect;
  tiles: Partial<Record<ChannelKey, MosaicRect>>;
  cuts: MosaicCut[];
  /** Each tile's scale from its nominal width */
  scale: Partial<Record<ChannelKey, number>>;
  /** Each tile's aspect here: a flexible tile's can differ from its nominal one */
  aspect: Partial<Record<ChannelKey, number>>;
};

export const mosaicKeys = (n: MosaicNode): ChannelKey[] =>
  typeof n === "string" ? [n] : ("row" in n ? n.row : n.col).flatMap(mosaicKeys);

/**
 * Cuts that nearly line up: two parallel gutters in stacked bands (their
 * spans apart) that are neither within 1px of each other nor at least
 * three gutters apart read as a mistake, a step of a gutter or two.
 */
export function mosaicJogs(L: MosaicLayout, g: number): { a: number; b: number; d: number }[] {
  const out: { a: number; b: number; d: number }[] = [];
  L.cuts.forEach((p, a) =>
    L.cuts.forEach((q, b) => {
      if (b <= a || p.vertical !== q.vertical) return;
      const apart = p.vertical ? p.y + p.h <= q.y + 0.5 || q.y + q.h <= p.y + 0.5 : p.x + p.w <= q.x + 0.5 || q.x + q.w <= p.x + 0.5;
      if (!apart) return;
      const d = Math.abs(p.vertical ? p.x - q.x : p.y - q.y);
      if (d > 1 && d < 3 * g - 0.5) out.push({ a, b, d });
    }),
  );
  return out;
}

/**
 * The flexible tiles of a column's bands, solved for a column `w` wide:
 * the first band sets the cuts; in each band below, one flexible tile takes
 * the aspect (in its range, as near its own as it can) that puts every cut
 * of the band on a cut above or at least three gutters clear of them all,
 * preferring a cut that lines up. Only bands that are rows of tiles count.
 */
function solveBands(m: { col: readonly MosaicNode[] }, w: number, g: number, ar: Aspect, next: Partial<Record<ChannelKey, number>>) {
  const E: number[] = [];
  for (const band of m.col) {
    if (typeof band === "string" || !("row" in band) || band.row.some((k) => typeof k !== "string")) continue;
    const keys = band.row as readonly ChannelKey[];
    const n = keys.length;
    const R = w - (n - 1) * g;
    const cutsAt = (asp: number[]) => {
      const h = R / asp.reduce((s, v) => s + v, 0);
      const c: number[] = [];
      let x = 0;
      for (let i = 0; i < n - 1; i++) {
        x += asp[i] * h;
        c.push(x);
        x += g;
      }
      return c;
    };
    const base = keys.map(ar);
    const score = (asp: number[]) => {
      const c = cutsAt(asp);
      let aligned = false;
      for (const ci of c) {
        for (const e of E) {
          const d = Math.abs(ci - e);
          if (d <= 0.5) aligned = true;
          // a margin over the check's three gutters, so the solve never sits on its edge
          else if (d < 3.2 * g) return Infinity;
        }
      }
      const drift = keys.reduce((s, k, i) => s + Math.abs(asp[i] - CHANNEL[k].aspect) / CHANNEL[k].aspect, 0);
      return drift - (aligned ? 0.06 : 0);
    };
    let best = base, bestS = score(base);
    keys.forEach((k, f) => {
      const fl = CHANNEL[k].flex;
      if (!fl) return;
      const cands: number[] = [];
      for (let s = 0; s <= 48; s++) cands.push(fl[0] + ((fl[1] - fl[0]) * s) / 48);
      cands.push(CHANNEL[k].aspect);
      // exact solutions: cut i lands on an earlier cut e
      const S1 = base.reduce((s, v, i) => (i === f ? s : s + v), 0);
      for (let i = 0; i < n - 1; i++) {
        for (const e of E) {
          const T = e - i * g;
          const A1 = base.reduce((s, v, j) => (j <= i && j !== f ? s + v : s), 0);
          const x = f <= i ? (R === T ? NaN : (T * S1 - A1 * R) / (R - T)) : A1 * (R / T) - S1;
          if (x >= fl[0] && x <= fl[1]) cands.push(x);
        }
      }
      for (const x of cands) {
        const asp = base.slice();
        asp[f] = x;
        const sc = score(asp);
        if (sc < bestS) {
          bestS = sc;
          best = asp;
        }
      }
    });
    keys.forEach((k, i) => {
      if (CHANNEL[k].flex) next[k] = best[i];
    });
    E.push(...cutsAt(best));
  }
}

/**
 * Lays a mosaic out as large as fits in a box (centred in it), with no tile
 * above `maxScale` of its nominal size. With `flex`, flexible tiles take
 * the aspects that line the cuts of stacked bands up (solveBands; the
 * layout and the solve settle together in a few rounds).
 */
export function mosaicLayout(
  n: MosaicNode,
  box: MosaicRect,
  g: number,
  maxScale = Infinity,
  flex = false,
): MosaicLayout {
  let cur: Partial<Record<ChannelKey, number>> = {};
  let out = layoutOnce(n, box, g, maxScale, (k) => cur[k] ?? nominal(k), null);
  for (let round = 0; flex && round < 8; round++) {
    const next: Partial<Record<ChannelKey, number>> = { ...cur };
    const ar: Aspect = (k) => cur[k] ?? nominal(k);
    out = layoutOnce(n, box, g, maxScale, ar, next);
    const moved = mosaicKeys(n).some((k) => Math.abs((next[k] ?? nominal(k)) - ar(k)) > 1e-7);
    if (!moved) break;
    cur = next;
    out = layoutOnce(n, box, g, maxScale, (k) => cur[k] ?? nominal(k), null);
  }
  return out;
}

function layoutOnce(
  n: MosaicNode,
  box: MosaicRect,
  g: number,
  maxScale: number,
  ar: Aspect,
  next: Partial<Record<ChannelKey, number>> | null,
): MosaicLayout {
  const lin = (m: MosaicNode) => {
    const k = mosaicLinear(m, ar);
    return { a: k.a, b: k.bg * g };
  };
  const root = lin(n);
  let h = Math.max(1, Math.min(box.h, (box.w - root.b) / root.a));
  const out: MosaicLayout = { frame: { x: 0, y: 0, w: 0, h: 0 }, tiles: {}, cuts: [], scale: {}, aspect: {} };
  const place = (m: MosaicNode, x: number, y: number, w: number, hh: number, depth: number) => {
    if (typeof m === "string") {
      out.tiles[m] = { x, y, w, h: hh };
      out.scale[m] = w / CHANNEL[m].w;
      out.aspect[m] = ar(m);
      return;
    }
    const row = "row" in m;
    if (!row && next) solveBands(m, w, g, ar, next);
    const kids = row ? m.row : m.col;
    let at = row ? x : y;
    kids.forEach((k, i) => {
      const l = lin(k);
      if (row) {
        const cw = l.a * hh + l.b;
        place(k, at, y, cw, hh, depth + 1);
        at += cw;
      } else {
        const ch = (w - l.b) / l.a;
        place(k, x, at, w, ch, depth + 1);
        at += ch;
      }
      if (i < kids.length - 1) {
        out.cuts.push(row ? { x: at, y, w: g, h: hh, depth, vertical: true } : { x, y: at, w, h: g, depth, vertical: false });
        at += g;
      }
    });
  };
  // the cap: tile sizes grow with h (affine, through the gutters), so two
  // passes settle it
  for (let pass = 0; pass < 2; pass++) {
    out.tiles = {};
    out.scale = {};
    out.aspect = {};
    out.cuts = [];
    place(n, 0, 0, root.a * h + root.b, h, 0);
    const top = Math.max(...Object.values(out.scale));
    if (top <= maxScale) break;
    h *= maxScale / top;
  }
  const w = root.a * h + root.b;
  const ox = box.x + (box.w - w) / 2, oy = box.y + (box.h - h) / 2;
  const shift = (r: MosaicRect) => {
    r.x += ox;
    r.y += oy;
  };
  Object.values(out.tiles).forEach(shift);
  out.cuts.forEach(shift);
  out.cuts.sort((p, q) => p.depth - q.depth || p.x + p.y - (q.x + q.y));
  out.frame = { x: ox, y: oy, w, h };
  return out;
}

/* ---------- the story ---------- */

export const HALDEN = {
  name: "Halden",
  line: "Heat, without the noise.",
  product: "Q7",
  site: "haldenheat.com",
};

/**
 * AI answer. In `answer`, **bold** marks emphasis and [n] a citation chip
 * pointing at sources[n - 1].
 */
export const ANSWER = {
  question: "What's the quietest heat pump for a terraced house?",
  status: { busy: "Searching the web", done: "Searched 14 sources" },
  answer:
    "For a terraced house, with the outdoor unit a few metres from your neighbours, the quietest option in independent tests is the **Halden Q7** [1]. It measured **32 dB** at three metres, quieter than a library, and runs lower still at night [2].",
  sources: [
    { n: 1, site: "haldenheat.com", mark: "H" },
    { n: 2, site: "Hearth & Grid", mark: "HG" },
  ],
  input: "Ask a follow-up",
};

export const SEARCH = {
  query: "quietest heat pump for a terraced house",
  suggest: [
    "quietest heat pump for a terraced house",
    "quietest heat pump uk 2026",
    "quietest air source heat pump for small gardens",
  ],
  tabs: ["All", "News", "Images", "Videos", "Shopping", "Forums"],
  stats: "About 2,140,000 results (0.38 seconds)",
  results: [
    {
      site: "Halden",
      url: "https://haldenheat.com › q7",
      mark: "H",
      title: "Halden Q7: the quiet heat pump for terraced homes",
      text: "Tested at 32 dB at 3 m, quieter than a library. Fits a 1 m side return and works with the radiators you have. Book a free home survey.",
      links: [
        { title: "Book a home survey", text: "Free, in person, within a week." },
        { title: "For developers", text: "Specs, BIM files, volume pricing." },
      ],
    },
    {
      site: "Hearth & Grid",
      url: "https://hearthandgrid.com › reviews",
      mark: "HG",
      title: "The heat pump you can't hear: Halden's Q7 at 32 dB",
      text: "3 days ago · We stood next to it in a Leeds terrace and still asked if it was on. Here is how it measured, and what it costs to run.",
    },
    {
      site: "Retrofit Forum",
      url: "https://retrofitforum.org › noise",
      mark: "RF",
      title: "Heat pump noise and neighbours: what the rules say",
      text: "Permitted development needs 42 dB or less at the nearest neighbour's window. Most terraces are tight, so the quietest units matter.",
    },
  ],
};

export const REEL = {
  handle: "halden",
  /** Spoken captions, one group on screen at a time; `at` in seconds into the loop */
  captions: [
    [{ w: "This", at: 0.5 }, { w: "is", at: 0.78 }, { w: "it,", at: 0.98 }],
    [{ w: "running", at: 1.75 }, { w: "flat", at: 2.15 }, { w: "out.", at: 2.45 }],
    [{ w: "Listen...", at: 4.3 }, { w: "nothing.", at: 6.3 }],
  ],
  /** Captions clear before the loop cuts back */
  captionsEnd: 9.5,
  text: "Running flat out at 2am. Can you hear it?",
  tag: "#quietheat",
  audio: "Original audio · halden",
  likes: 48210,
  comments: 1204,
  shares: 3118,
};

export const FILM = {
  title: "Halden · Heat, without the noise.",
  /** Clip length and where the loop starts and ends in it, seconds */
  length: 30,
  from: 9,
  subtitles: [
    { text: "Is it even on?", from: 1.4, to: 4.2 },
    { text: "Heat, without the noise.", from: 6, to: 10.8 },
  ],
};

export const PRESS = {
  masthead: "Hearth & Grid",
  nav: ["Energy", "Retrofit", "Reviews", "Homes"],
  kicker: "Reviews · Heat pumps",
  headline: "The heat pump you can't hear",
  standfirst: "Halden's Q7 measured 32 dB in a Leeds terrace. We stood next to it and still asked if it was on.",
  byline: "Amira Hassan",
  date: "12 March 2026 · 6 min read",
  caption: "The Q7 on test in Headingley, Leeds.",
  body: [
    "Terraced streets are the hardest place to fit a heat pump. The outdoor unit sits a few metres from a neighbour's bedroom window, and the rules allow 42 dB there, no more.",
    "Halden built the Q7 for exactly that garden. On our meter it read 32 dB at three metres while heating the whole house, and it dropped to 29 dB in night mode.",
  ],
  quote: "The loudest thing in the garden was the birds.",
  quoteBy: "Owen Price, homeowner",
  more: [
    "Developers are paying attention too. Two housebuilders in Yorkshire now specify the Q7 as standard for new terraces, citing fewer noise complaints at handover.",
    "It is not the cheapest unit we tested, but it was the only one we forgot was running.",
  ],
  related: ["Ten retrofits, one winter: what the bills said", "Do heat pumps work in old stone houses?"],
};

export const CREATOR = {
  name: "Nora Pike",
  handle: "@nora.retrofits",
  age: "2h",
  hook: "I measured it: 32 dB.",
  text: "Quieter than my fridge. Full retrofit diary on my page.",
  tags: "#heatpump #retrofit",
  likes: 2481,
  /** Comments already there, then the ones that pop in during the loop (`at` in seconds) */
  comments: 183,
  thread: [
    { who: "dev.okafor", text: "Quieter than my dishwasher, honestly", at: 0 },
    { who: "halden", text: "Thanks for testing it properly, Nora.", at: 2.2 },
    { who: "ellie_builds", text: "Which model is this?", at: 4.6 },
    { who: "nora.retrofits", text: "The Q7, the 7 kW one.", at: 6.8 },
  ],
  /** The meter in the shot reads around this */
  db: 32.1,
};

export const OOH = {
  line: HALDEN.line,
  note: "Q7 · 32 dB",
};
