"use client";

import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";
import {
  ANSWER,
  CHANNEL,
  CREATOR,
  FILM,
  MOSAIC_PHONE,
  MOSAIC_WIDE,
  OOH,
  PHONE_SEARCH,
  PRESS,
  REEL,
  SEARCH,
  mosaicKeys,
  mosaicLinear,
  type Channel,
  type ChannelClip,
  type ChannelClips,
  type ChannelKey,
  type MosaicNode,
} from "@/lib/channels";
import s from "./channel-tiles.module.css";

/*
  The channel tiles: Halden's one story cut into seven formats, each drawn
  in DOM and SVG as a screen recording that plays (copy in lib/channels.ts).
  The Attention Field shows them in its STORY stage.

  Two layouts, one set of tiles (each tile is about a hundred nodes, so
  they are never rendered twice)
  - Static, the default (no JS, reduced motion, short screens): the tiles
    are composed as one mosaic (MOSAIC_WIDE in lib/channels.ts), every
    edge shared, by flexbox alone. A row gives each child a share of its
    width (--p) plus a fixed part (--q gutters), which is exactly the cut
    mosaicLayout computes; each cell keeps its tile's aspect and scales the
    tile to its width (a container query). On upright tablets (40 to 64rem)
    the wrappers step aside and the cells wrap, the full width, into three
    bands (TALL_CELL: each cell's order, share and aspect). Under 40rem only
    the phone mosaic's four (MOSAIC_PHONE) stay: the answer, the reel beside
    the film, the search (reflowed to PHONE_SEARCH's page), stacked at the
    full width.
  - Pinned (the field's AF_PIN_QUERY with JS, mirrored in the CSS module):
    the wrappers step aside (display: contents) and every tile sits at the
    field's top left with transform-origin 0 0, hidden, for the engine to
    place (style.transform = translate + scale), show and stack.

  Contract with the field engine
  - Each tile is `[data-af-tile="<key>"]` at its nominal size (CHANNELS:
    w x h CSS px, true aspect).
  - A tile plays only while it has `data-play`. Without it every CSS
    animation in it is paused and its script stops, so it holds its frame.
    Before its first play it holds the frame at CHANNELS start, which is
    never blank. Its picture's ambient loops (grain, light leak, camera
    moves, flicker) run only with `data-fx` as well, which the field sets
    on tiles shown near full size, so small tiles cost little.
  - A tile may be given another size (style.width / style.height, nominal
    px) when the mosaic flexes its aspect (CHANNELS flex) or a phone
    reflows it: the pages reflow (a phone's search drops its window
    chrome, a short answer its app bar), the billboard's street crops.
  - `[data-af-note]` is the one line under the mosaic saying Halden is a
    sample; pinned, the field places it.
  - `data-still` on the wrapper (or on a tile) shows the designed still
    frame instead: the most telling moment, finished. Reduced motion and
    no JS get the same still frames on their own.
  - The tiles are decoration (aria-hidden, nothing focusable); the field's
    own text describes them.

  How a tile keeps time: each has a hidden clock, a compositor-only CSS
  animation one loop long (CHANNELS loop, started at CHANNELS start). Its
  script reads the clock when the tile starts or stops and runs on
  performance.now() between, so the scripted beats (phase flags in data-ph,
  streamed words, typed text, counters) and the loop-long CSS keyframes
  share one time base and pause together. With no clock (still frame) the
  scripts restore the still.

  A tile with real footage (lib/clips.ts) plays it, muted and looped, over
  its drawn picture ("scene") or over the whole tile ("screen"), only while
  the tile plays (never under reduced motion or data saver). Nothing of the
  clip is fetched before that (preload none): a still frame shows the
  clip's poster when it has one, else the drawing under it.
*/

type Css = CSSProperties & Record<`--${string}`, string | number>;

/* ---------- timelines, seconds into each tile's loop ---------- */

/** Deterministic jitter in [0, 1), so streamed words and typing feel human */
const jit = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

type Tok = { text: string; bold: boolean; cite?: number; tail?: string };

function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  let bold = false;
  for (const raw of src.split(" ")) {
    const cite = raw.match(/^\[(\d+)\](.*)$/);
    if (cite) {
      out.push({ text: cite[1], bold: false, cite: Number(cite[1]), tail: cite[2] });
      continue;
    }
    let w = raw;
    if (w.startsWith("**")) {
      bold = true;
      w = w.slice(2);
    }
    const close = w.includes("**");
    out.push({ text: w.replace("**", ""), bold });
    if (close) bold = false;
  }
  return out;
}

const TOKENS = tokenize(ANSWER.answer);

/**
 * The answer: the question stays; a short search, the words stream, the
 * sources land, and the answer holds until it fades to stream again
 */
const AT_ANSWER = { busy: 0.3, done: 0.85, stream: 0.95, out: CHANNEL.answer.loop - 0.4 };
const WORD_AT: number[] = (() => {
  let t = AT_ANSWER.stream;
  return TOKENS.map((tk, i) => {
    const at = t;
    const end = (tk.tail ?? tk.text).slice(-1);
    t += 0.055 + 0.07 * jit(i) + (end === "," || end === "." ? 0.2 : 0) + (tk.cite ? 0.1 : 0);
    return at;
  });
})();
const STREAM_END = WORD_AT[WORD_AT.length - 1] + 0.35;

/**
 * The search never leaves its results page: the pointer goes to Halden's
 * result, the page scrolls, then the query is retyped over the dimmed
 * results and the page refreshes (a half-second dip, back at the top).
 * The results hold for most of the loop.
 */
const AT_SEARCH = {
  hov: 0.35,
  hover: 1.45,
  unhov: 3,
  scroll: 3.2,
  back: 8,
  focus: 8.75,
  type: 9.05,
  sug: 9.15,
  enter: 11.75,
  refresh: 12,
  fresh: 12.25,
};
const CHAR_AT: number[] = (() => {
  const steps = [...SEARCH.query].map((ch, i) => 0.6 + jit(i + 7) + (ch === " " ? 0.5 : 0));
  const total = steps.reduce((a, b) => a + b, 0);
  const span = AT_SEARCH.enter - 0.3 - AT_SEARCH.type;
  let acc = 0;
  return steps.map((st) => {
    acc += st;
    return AT_SEARCH.type + (span * acc) / total;
  });
})();

/* Each restart is a crossfade of well under a second */
const AT_PRESS = { in: 0.02, s1: 2.4, s2: 5.4, s3: 8.6, out: CHANNEL.press.loop - 0.4 };
const AT_FILM = { in: 0.02, out: CHANNEL.film.loop - 0.28 };
const AT_CREATOR = { out: CHANNEL.creator.loop - 0.45 };
const AT_REEL_OUT = REEL.captionsEnd;

/* ---------- scripts: the timed beats, read off each tile's clock ---------- */

type Frame = (t: number | null) => void;

const flags = (t: number, marks: readonly (readonly [string, number, number?])[]) =>
  marks
    .filter(([, a, b = Infinity]) => t >= a && t < b)
    .map(([n]) => n)
    .join(" ");

/** Writes data-ph on the tile when it changes; null restores the still frame */
function phaser(el: HTMLElement) {
  let last: string | null | undefined;
  return (v: string | null) => {
    if (v === last) return;
    last = v;
    if (v === null) el.removeAttribute("data-ph");
    else el.setAttribute("data-ph", v);
  };
}

/** Writes a node's text when it changes; the still text is what React rendered */
function texter(node: Element | null) {
  const still = node?.textContent ?? "";
  let last = still;
  return (v: string | null) => {
    const next = v ?? still;
    if (!node || next === last) return;
    last = next;
    node.textContent = next;
  };
}

/** 2481 -> "2,481", locale-free so server and client agree */
const grouped = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const compact = (n: number) => `${(Math.floor(n / 100) / 10).toFixed(1)}K`;
const clock = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

const SCRIPTS: Partial<Record<ChannelKey, (el: HTMLElement) => Frame>> = {
  answer(el) {
    const ph = phaser(el);
    const box = el.querySelector<HTMLElement>("[data-words]");
    const words = [...el.querySelectorAll<HTMLElement>("[data-w]")];
    let k = -1;
    let at = -1;
    const caret = (i: number) => {
      if (i === at) return;
      words[at]?.removeAttribute("data-at");
      words[i]?.setAttribute("data-at", "");
      at = i;
    };
    return (t) => {
      if (t === null) {
        ph(null);
        box?.style.removeProperty("--k");
        caret(-1);
        k = -1;
        return;
      }
      const A = AT_ANSWER;
      ph(
        flags(t, [
          ["busy", A.busy, A.done],
          ["done", A.done],
          ["src", STREAM_END + 0.25],
          ["act", STREAM_END + 0.7],
          ["out", A.out],
        ]),
      );
      let n = 0;
      while (n < WORD_AT.length && WORD_AT[n] <= t) n++;
      if (n !== k) {
        k = n;
        box?.style.setProperty("--k", String(n));
      }
      caret(t >= A.done && t < STREAM_END ? Math.max(0, n - 1) : -1);
    };
  },

  search(el) {
    const ph = phaser(el);
    const q = texter(el.querySelector("[data-q]"));
    return (t) => {
      if (t === null) {
        ph(null);
        q(null);
        return;
      }
      const S = AT_SEARCH;
      ph(
        flags(t, [
          ["p1", S.hov, S.scroll],
          ["hover", S.hover, S.unhov],
          ["p2", S.scroll, S.back],
          ["scroll", S.scroll, S.refresh],
          ["p3", S.back],
          ["focus", S.focus, S.enter + 0.2],
          ["sel", S.focus, S.type],
          ["sug", S.sug, S.enter],
          ["load", S.enter, S.fresh],
          ["fresh", S.fresh],
        ]),
      );
      let n = CHAR_AT.length;
      if (t >= S.type && t < S.enter) {
        n = 0;
        while (n < CHAR_AT.length && CHAR_AT[n] <= t) n++;
      }
      q(SEARCH.query.slice(0, n));
    };
  },

  reel(el) {
    const ph = phaser(el);
    const groups = [...el.querySelectorAll<HTMLElement>("[data-cg]")];
    const words = groups.map((g) => [...g.querySelectorAll<HTMLElement>("[data-cw]")]);
    const likes = texter(el.querySelector("[data-likes]"));
    const comments = texter(el.querySelector("[data-comments]"));
    let last = "";
    const show = (g: number, w: number) => {
      const key = `${g}:${w}`;
      if (key === last) return;
      last = key;
      groups.forEach((node, gi) => node.toggleAttribute("data-on", gi === g));
      words.forEach((ws, gi) => ws.forEach((node, wi) => node.toggleAttribute("data-hl", gi === g && wi === w)));
    };
    return (t) => {
      if (t === null) {
        ph(null);
        show(-2, -2);
        groups.forEach((node) => node.removeAttribute("data-on"));
        words.flat().forEach((node) => node.removeAttribute("data-hl"));
        last = "";
        likes(null);
        comments(null);
        return;
      }
      ph(flags(t, [["out", AT_REEL_OUT]]));
      let g = -1;
      let w = -1;
      if (t < AT_REEL_OUT) {
        REEL.captions.forEach((grp, gi) =>
          grp.forEach((word, wi) => {
            if (word.at <= t) {
              g = gi;
              w = wi;
            }
          }),
        );
      }
      show(g, w);
      likes(compact(REEL.likes + Math.floor(t * 31)));
      comments(grouped(REEL.comments + Math.floor(t * 0.9)));
    };
  },

  film(el) {
    const ph = phaser(el);
    const tc = texter(el.querySelector("[data-tc]"));
    return (t) => {
      if (t === null) {
        ph(null);
        tc(null);
        return;
      }
      ph(
        flags(t, [
          ["in", AT_FILM.in],
          ...FILM.subtitles.map((sub, i) => [`sub${i + 1}`, sub.from, sub.to] as const),
          ["out", AT_FILM.out],
        ]),
      );
      tc(clock(FILM.from + t));
    };
  },

  press(el) {
    const ph = phaser(el);
    return (t) => {
      if (t === null) {
        ph(null);
        return;
      }
      const P = AT_PRESS;
      ph(
        flags(t, [
          ["in", P.in],
          ["s1", P.s1],
          ["s2", P.s2],
          ["s3", P.s3],
          ["out", P.out],
        ]),
      );
    };
  },

  creator(el) {
    const ph = phaser(el);
    const likes = texter(el.querySelector("[data-likes]"));
    const count = texter(el.querySelector("[data-comments]"));
    const meter = texter(el.querySelector("[data-db]"));
    return (t) => {
      if (t === null) {
        ph(null);
        likes(null);
        count(null);
        meter(null);
        return;
      }
      const popped = CREATOR.thread.filter((c) => c.at > 0 && c.at <= t).length;
      ph(
        flags(t, [
          ...CREATOR.thread.map((c, i) => [`c${i}`, c.at] as const),
          ["out", AT_CREATOR.out],
        ]),
      );
      likes(grouped(CREATOR.likes + Math.floor(t * 1.7)));
      count(`${CREATOR.comments + popped}`);
      // A meter on SLOW response: a fresh reading four times a second
      const q = Math.floor(t * 4);
      const v = CREATOR.db + 0.25 * Math.sin(q * 1.7) + 0.2 * (jit(q) - 0.5);
      meter(v.toFixed(1));
    };
  },
};

/* ---------- the runtime: one loop for every playing tile ---------- */

type Item = {
  el: HTMLElement;
  loop: number;
  clock: HTMLElement | null;
  frame?: Frame;
  video: HTMLVideoElement | null;
  /** Loop time (s) read off the CSS clock at the last change, NaN for the still frame */
  base: number;
  /** performance.now() at that read */
  since: number;
  live: boolean;
};

function mountTiles(root: HTMLElement) {
  const items: Item[] = [...root.querySelectorAll<HTMLElement>("[data-af-tile]")].map((el) => {
    const c = CHANNEL[el.dataset.afTile as ChannelKey];
    const screen = el.dataset.clip === "screen";
    return {
      el,
      loop: c.loop,
      clock: el.querySelector<HTMLElement>("[data-clock]"),
      frame: screen ? undefined : SCRIPTS[c.key]?.(el),
      video: el.querySelector("video"),
      base: Number.NaN,
      since: 0,
      live: false,
    };
  });
  const save = () => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    return nav.connection?.saveData === true;
  };

  /*
    The CSS clock is read only when a tile starts, stops or changes mode
    (reading it flushes style); between those reads the loop time runs on
    performance.now(), which keeps pace with the document timeline the CSS
    animations run on.
  */
  const read = (it: Item, now: number) => {
    const p = it.clock?.getAnimations()[0]?.effect?.getComputedTiming().progress;
    it.base = typeof p === "number" ? p * it.loop : Number.NaN;
    it.since = now;
    it.live = it.el.hasAttribute("data-play") && !document.hidden && !Number.isNaN(it.base);
  };
  const time = (it: Item, now: number) =>
    Number.isNaN(it.base) ? null : (it.base + (it.live ? (now - it.since) / 1000 : 0)) % it.loop;

  let raf = 0;
  const tick = (now: number) => {
    raf = 0;
    for (const it of items) if (it.live) it.frame?.(time(it, now));
    if (items.some((it) => it.live && it.frame)) raf = requestAnimationFrame(tick);
  };
  const kick = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    const now = performance.now();
    for (const it of items) {
      read(it, now);
      it.frame?.(time(it, now));
      const v = it.video;
      if (v) {
        if (it.live && !save() && v.paused) {
          v.muted = true;
          // shown once it has a frame of its own (until then the drawing)
          v.addEventListener("playing", () => v.setAttribute("data-ready", ""), { once: true });
          v.play().catch(() => {});
        } else if ((!it.live || save()) && !v.paused) v.pause();
      }
    }
    if (items.some((it) => it.live && it.frame)) raf = requestAnimationFrame(tick);
  };

  const mo = new MutationObserver(kick);
  mo.observe(root, { subtree: true, attributes: true, attributeFilter: ["data-play", "data-still"] });
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduce.addEventListener("change", kick);
  document.addEventListener("visibilitychange", kick);
  kick();
  return () => {
    cancelAnimationFrame(raf);
    mo.disconnect();
    reduce.removeEventListener("change", kick);
    document.removeEventListener("visibilitychange", kick);
  };
}

/* ---------- the component ---------- */

export function ChannelTiles({
  clips = {},
  still = false,
  note,
  className = "",
}: {
  /** Real footage per tile, from channelClips() in lib/clips.ts (server) */
  clips?: ChannelClips;
  /** Show every tile's still frame (the field sets data-still itself when it needs to) */
  still?: boolean;
  /** One quiet line under the mosaic */
  note?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    return mountTiles(root);
  }, []);

  return (
    <div
      ref={ref}
      className={`${s.root} ${className}`}
      data-af-tiles=""
      data-still={still ? "" : undefined}
      aria-hidden="true"
    >
      <Node n={MOSAIC_WIDE} clips={clips} top />
      {note ? (
        <p className={s.note} data-af-note="">
          {note}
        </p>
      ) : null}
    </div>
  );
}

const fix = (v: number) => Number(v.toFixed(6));
/** The tiles a phone shows */
const ON_PHONE = new Set(mosaicKeys(MOSAIC_PHONE));

/**
 * Each cell on a phone (static): its place in the flow (--po) and its
 * share of the line (--ps, plus --pq gutters): a whole line for a tile of
 * the column, a row's linear share for the tiles that sit side by side
 */
const PHONE_CELL: Partial<Record<ChannelKey, Css>> = (() => {
  const out: Partial<Record<ChannelKey, Css>> = {};
  let o = 0;
  const walk = (n: MosaicNode) => {
    if (typeof n === "string") {
      out[n] = { "--po": o++, "--ps": 1, "--pq": 0 };
    } else if ("row" in n) {
      const sh = shares(n.row);
      n.row.forEach((k, i) => {
        if (typeof k === "string") out[k] = { "--po": o++, "--ps": sh[i].p, "--pq": sh[i].q };
        else walk(k);
      });
    } else n.col.forEach(walk);
  };
  walk(MOSAIC_PHONE);
  return out;
})();

/** A row's shares (--p, --q) for `kids`, from the linear model */
function shares(kids: readonly MosaicNode[]) {
  const lins = kids.map((k) => mosaicLinear(k));
  const sa = lins.reduce((t, k) => t + k.a, 0);
  const sb = lins.reduce((t, k) => t + k.bg, 0) + kids.length - 1;
  return lins.map((l) => ({ p: fix(l.a / sa), q: fix(l.bg - (l.a * sb) / sa) }));
}

/**
 * Each cell on an upright tablet (static): three bands, ordered and flexed
 * so that no cut in a band falls within three gutters of a cut in the band
 * next to it, at any width from 40 to 64rem (as fractions of the width,
 * nominal aspects put several cuts within a percent or two of each other,
 * which reads as a mistake): the reel leads the first band and the article
 * takes its narrowest page. Each cell's place in the flow (--o), its share
 * of its band (--tp, plus --tq gutters), its aspect (--art) and its tile's
 * nominal height at that aspect (--tht).
 */
const TALL_BANDS: readonly (readonly ChannelKey[])[] = [
  ["reel", "answer", "creator"],
  ["search", "press"],
  ["film", "ooh"],
];
const TALL_CELL: Partial<Record<ChannelKey, Css>> = (() => {
  const ar = (k: ChannelKey) => (k === "press" ? (CHANNEL.press.flex?.[0] ?? CHANNEL.press.aspect) : CHANNEL[k].aspect);
  const out: Partial<Record<ChannelKey, Css>> = {};
  let o = 0;
  for (const keys of TALL_BANDS) {
    const sum = keys.reduce((t, k) => t + ar(k), 0);
    for (const k of keys) {
      const a = ar(k);
      out[k] = {
        "--o": o++,
        "--tp": fix(a / sum),
        "--tq": fix((-(keys.length - 1) * a) / sum),
        "--art": fix(a),
        "--tht": `${fix(CHANNEL[k].w / a)}px`,
      };
    }
  }
  return out;
})();

/**
 * One node of the mosaic. A row hands each child its width as a share of
 * the row (--p) plus a number of gutters (--q, often negative), from the
 * same linear model mosaicLayout cuts with, so every child comes out the
 * row's height; a column stacks its children at its width. Each cell also
 * carries its tablet place (TALL_CELL) and whether a phone keeps it.
 */
function Node({ n, clips, top = false }: { n: MosaicNode; clips: ChannelClips; top?: boolean }) {
  if (typeof n === "string") {
    const c = CHANNEL[n];
    const style: Css = { "--ar": `${c.w} / ${c.h}`, ...TALL_CELL[n], ...PHONE_CELL[n] };
    if (n === "search") {
      style["--pw"] = `${PHONE_SEARCH.w}px`;
      style["--ph"] = `${fix(PHONE_SEARCH.w / PHONE_SEARCH.still)}px`;
      style["--par"] = PHONE_SEARCH.still;
    }
    return (
      <div className={s.cell} style={style} data-k={n} data-phone={ON_PHONE.has(n) ? "" : undefined}>
        <Tile c={c} clip={clips[n]} />
      </div>
    );
  }
  const row = "row" in n;
  const kids = row ? n.row : n.col;
  const all = shares(kids);
  return (
    <div className={`${row ? s.row : s.col} ${top ? s.top : ""}`}>
      {kids.map((k, i) => (
        <div key={i} className={s.slot} style={row ? ({ "--p": all[i].p, "--q": all[i].q } as Css) : undefined}>
          <Node n={k} clips={clips} />
        </div>
      ))}
    </div>
  );
}

function Tile({ c, clip }: { c: Channel; clip?: ChannelClip }) {
  // its size as variables, so the static layouts and the field can resize it
  const style: Css = {
    "--tw": `${c.w}px`,
    "--th": `${c.h}px`,
    "--loop": `${c.loop}s`,
    "--start": `${-c.start}s`,
  };
  const mode = clip ? c.clip : undefined;
  return (
    <div className={`${s.tile} ${s[c.key] ?? ""}`} data-af-tile={c.key} data-clip={mode} style={style}>
      <i className={s.clock} data-clock="" />
      <Body k={c.key} clip={clip} />
      {mode === "screen" && clip ? <Clip clip={clip} className={s.screenClip} /> : null}
    </div>
  );
}

/**
 * Real footage over the drawing. Nothing is fetched until the tile plays
 * (preload none); a poster shows at once, otherwise the clip stays
 * invisible over the drawn still until it has a frame (data-ready)
 */
function Clip({ clip, className }: { clip: ChannelClip; className?: string }) {
  return (
    <video
      className={`${className ?? ""} ${clip.poster ? s.posterClip : ""}`}
      src={clip.src}
      poster={clip.poster}
      muted
      loop
      playsInline
      disablePictureInPicture
      preload="none"
      tabIndex={-1}
    />
  );
}

function Body({ k, clip }: { k: ChannelKey; clip?: ChannelClip }) {
  switch (k) {
    case "answer":
      return <AnswerTile />;
    case "search":
      return <SearchTile />;
    case "reel":
      return <ReelTile clip={clip} />;
    case "film":
      return <FilmTile clip={clip} />;
    case "press":
      return <PressTile />;
    case "creator":
      return <CreatorTile clip={clip} />;
    case "ooh":
      return <OohTile />;
  }
}

/* ---------- icons ---------- */

const ring = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

const ICON = {
  sidebar: "M4 5h16v14H4z M9.5 5v14",
  compose: "M12 20h8 M16.5 3.6a2.1 2.1 0 0 1 3 3L7.2 18.9 3.5 20l1.1-3.7z",
  chevron: "M7 10l5 5 5-5",
  right: "M10 7l5 5-5 5",
  globe: `${ring(12, 12, 8.5)} M3.5 12h17 M12 3.5c2.6 2.6 2.6 14.4 0 17 M12 3.5c-2.6 2.6-2.6 14.4 0 17`,
  plus: "M12 5v14 M5 12h14",
  up: "M12 19V6 M6 11.5l6-6 6 6",
  copy: "M9 9h11v11H9z M15 9V4H4v11h5",
  thumb: "M7.5 10.5V20H4v-9.5z M7.5 10.5 11.2 4a1.9 1.9 0 0 1 3.4 1.6l-1 3.9h5.2a2 2 0 0 1 2 2.4l-1.4 6.5a2 2 0 0 1-2 1.6H7.5",
  redo: "M19.5 12a7.5 7.5 0 1 1-2.2-5.3 M19.5 4.5v4.6h-4.6",
  search: `${ring(10.8, 10.8, 6.3)} M15.5 15.5 20 20`,
  mic: "M12 3.5a2.8 2.8 0 0 1 2.8 2.8v5.4a2.8 2.8 0 0 1-5.6 0V6.3A2.8 2.8 0 0 1 12 3.5z M5.8 11.2a6.2 6.2 0 0 0 12.4 0 M12 17.6v3",
  close: "M6.5 6.5l11 11 M17.5 6.5l-11 11",
  heart: "M12 20s-7.2-4.3-9-9.1A4.9 4.9 0 0 1 12 7a4.9 4.9 0 0 1 9 3.9C19.2 15.7 12 20 12 20z",
  comment: "M20.5 11.6a8.2 8.2 0 0 1-12 7.3L3.6 20l1.2-4.4a8.2 8.2 0 1 1 15.7-4z",
  send: "M20.5 3.5 10 14 M20.5 3.5 14 20.5l-4-6.5-6.5-4z",
  bookmark: "M6.5 3.5h11v17l-5.5-4-5.5 4z",
  repost: "M16.5 3 19.5 6l-3 3 M4.5 11V9.5a3.5 3.5 0 0 1 3.5-3.5h11.5 M7.5 21l-3-3 3-3 M19.5 13v1.5a3.5 3.5 0 0 1-3.5 3.5H4.5",
  more: `${ring(5.5, 12, 0.6)} ${ring(12, 12, 0.6)} ${ring(18.5, 12, 0.6)}`,
  music: "M9 17.5V5.5l10.5-2v11.5 M9 17.5a2.6 2.6 0 1 1-2.6-2.6A2.6 2.6 0 0 1 9 17.5z M19.5 15a2.6 2.6 0 1 1-2.6-2.6 2.6 2.6 0 0 1 2.6 2.6z",
  mute: "M11 5.5 6.6 9H3.5v6h3.1l4.4 3.5z M15.5 9.5l5 5 M20.5 9.5l-5 5",
  pause: "M8 5v14 M16 5v14",
  sliders: `M4 7.5h9 M18 7.5h2 M4 16.5h3 M11 16.5h9 ${ring(15.5, 7.5, 2.3)} ${ring(9, 16.5, 2.3)}`,
  full: "M4 9V4h5 M20 9V4h-5 M4 15v5h5 M20 15v5h-5",
  menu: "M4 7h16 M4 12h16 M4 17h16",
  lock: "M6 11h12v9H6z M8.5 11V8a3.5 3.5 0 0 1 7 0v3",
  back: "M15 5l-7 7 7 7",
  reload: "M19 12a7 7 0 1 1-2-4.9 M19 4.5v4h-4",
  dots: `${ring(12, 5.5, 0.6)} ${ring(12, 12, 0.6)} ${ring(12, 18.5, 0.6)}`,
} as const;

function I({ n, fill = false, className = "" }: { n: keyof typeof ICON; fill?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${s.icon} ${className}`}
      fill={fill ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={fill ? 0 : 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ICON[n]} />
    </svg>
  );
}

/** Halden's mark: a ring with a level line, the quiet fan */
function HaldenMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2.4}>
      <circle cx="12" cy="12" r="7.6" />
      <path d="M7.5 12h9" strokeLinecap="round" />
    </svg>
  );
}

function Fav({ mark, className = "" }: { mark: string; className?: string }) {
  if (mark === "H") {
    return (
      <span className={`${s.fav} ${s.favH} ${className}`}>
        <HaldenMark className={s.favMark} />
      </span>
    );
  }
  return <span className={`${s.fav} ${mark === "HG" ? s.favHG : s.favRF} ${className}`}>{mark === "HG" ? "H&G" : mark}</span>;
}

/** A mouse pointer, for the recordings a person is driving */
function Pointer({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 22" className={`${s.pointer} ${className}`}>
      <path d="M1.5 1.5v16.2l4.1-3.9 2.8 6.4 2.6-1.1-2.8-6.3 5.6-.3z" fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

/** Film grain, light leak and vignette over every drawn picture */
function Grade({ leak = true }: { leak?: boolean }) {
  return (
    <>
      {leak ? <i className={s.leak} /> : null}
      <i className={s.vig} />
      <i className={s.grain} />
    </>
  );
}

/* ---------- 1. AI answer ---------- */

function AnswerTile() {
  return (
    <div className={s.app}>
      <div className={s.aTop}>
        <I n="sidebar" />
        <span className={s.aModel}>
          Assistant <I n="chevron" className={s.aChev} />
        </span>
        <I n="compose" />
      </div>
      <div className={s.aBody}>
        <p className={s.aAsk}>{ANSWER.question}</p>
        <p className={s.aStatus}>
          <I n="globe" className={s.aGlobe} />
          <span className={s.aBusy}>{ANSWER.status.busy}</span>
          <span className={s.aDone}>
            {ANSWER.status.done}
            <I n="right" className={s.aChevR} />
          </span>
        </p>
        <p className={s.aText} data-words="">
          {TOKENS.map((tk, i) => (
            <span key={i}>
              {tk.cite ? (
                <span className={`${s.w} ${s.cite}`} data-w="" style={{ "--i": i } as Css}>
                  <span className={s.chip}>{tk.text}</span>
                  {tk.tail}
                </span>
              ) : (
                <span className={`${s.w} ${tk.bold ? s.b : ""}`} data-w="" style={{ "--i": i } as Css}>
                  {tk.text}
                </span>
              )}
              {i < TOKENS.length - 1 ? " " : null}
            </span>
          ))}
        </p>
        <div className={s.aSources}>
          {ANSWER.sources.map((src) => (
            <span key={src.n} className={s.aSrc}>
              <Fav mark={src.mark} />
              {src.site}
              <b>{src.n}</b>
            </span>
          ))}
        </div>
        <div className={s.aActs}>
          <I n="copy" />
          <I n="thumb" />
          <I n="thumb" className={s.flip} />
          <I n="redo" />
        </div>
      </div>
      <div className={s.aInput}>
        <I n="plus" className={s.aPlus} />
        <span>{ANSWER.input}</span>
        <span className={s.aSend}>
          <I n="up" />
        </span>
      </div>
    </div>
  );
}

/* ---------- 2. Search ---------- */

function SearchTile() {
  const [top, ...rest] = SEARCH.results;
  return (
    <div className={s.app}>
      <div className={s.chrome}>
        <span className={s.lights}>
          <i />
          <i />
          <i />
        </span>
        <span className={s.addr}>
          <I n="search" className={s.addrLock} />
          <span className={s.addrQ}>{SEARCH.query}</span>
        </span>
      </div>
      <div className={s.sHead}>
        <div className={s.field}>
          <I n="search" className={s.fieldMag} />
          <span className={s.fieldText}>
            <span data-q="">{SEARCH.query}</span>
            <i className={s.caret} />
          </span>
          <I n="close" className={s.fieldX} />
          <i className={s.fieldSep} />
          <I n="mic" className={s.fieldMic} />
        </div>
        <ul className={s.sug}>
          {SEARCH.suggest.map((q) => (
            <li key={q}>
              <I n="search" />
              {q}
            </li>
          ))}
        </ul>
        <nav className={s.sTabs}>
          {SEARCH.tabs.map((t, i) => (
            <span key={t} data-on={i === 0 ? "" : undefined}>
              {t}
            </span>
          ))}
        </nav>
        <i className={s.loadbar} />
      </div>
      <div className={s.sView}>
        <div className={s.sPage}>
          <p className={s.sStats}>{SEARCH.stats}</p>
          <article className={s.res}>
            <div className={s.resSite}>
              <Fav mark={top.mark} />
              <span>
                <b>{top.site}</b>
                <small>{top.url}</small>
              </span>
              <I n="dots" className={s.resMore} />
            </div>
            <h4 className={`${s.resTitle} ${s.resTop}`}>{top.title}</h4>
            <p className={s.resText}>{top.text}</p>
            <div className={s.links}>
              {top.links?.map((l) => (
                <span key={l.title}>
                  <b>{l.title}</b>
                  <small>{l.text}</small>
                </span>
              ))}
            </div>
          </article>
          {rest.map((r) => (
            <article key={r.site} className={s.res}>
              <div className={s.resSite}>
                <Fav mark={r.mark} />
                <span>
                  <b>{r.site}</b>
                  <small>{r.url}</small>
                </span>
                <I n="dots" className={s.resMore} />
              </div>
              <h4 className={s.resTitle}>{r.title}</h4>
              <p className={s.resText}>{r.text}</p>
            </article>
          ))}
        </div>
      </div>
      <Pointer className={s.sPtr} />
    </div>
  );
}

/* ---------- the shared picture: a Halden unit against a brick terrace wall ---------- */

/** The scene is drawn on a 480 x 480 board; each tile crops it with a viewBox of its own aspect */
type Box = readonly [number, number, number, number];
const FAN = { cx: 216, cy: 306, r: 50 };

const pct = (vb: Box, x: number, y: number, w: number, h: number): CSSProperties => ({
  left: `${((x - vb[0]) / vb[2]) * 100}%`,
  top: `${((y - vb[1]) / vb[3]) * 100}%`,
  width: `${(w / vb[2]) * 100}%`,
  height: `${(h / vb[3]) * 100}%`,
});

/**
 * The scene as a lens sees it: `vb` frames it (each tile shoots it from its
 * own distance), `dof` blurs the wall behind the unit, `soft` the unit
 * itself (a subject out of focus behind something nearer, or just a lens'
 * softness: nothing is ever vector-crisp), `fg` adds the out-of-focus
 * leaves in front. The wall runs well past the board, so a wide frame
 * still shows brick.
 */
function UnitScene({
  vb,
  dof = 1.4,
  soft = 0.45,
  fg = false,
  children,
}: {
  vb: Box;
  dof?: number;
  soft?: number;
  fg?: boolean;
  children?: ReactNode;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const box = vb.join(" ");
  return (
    <div className={s.scene} style={{ "--dof": `${dof}px`, "--soft": `${soft}px` } as Css}>
      <div className={s.cam}>
        {/* the wall, out of focus behind the unit */}
        <svg viewBox={box} preserveAspectRatio="xMidYMid slice" className={`${s.layer} ${s.wall}`}>
          <defs>
            <pattern id={`${id}b`} width="60" height="22" patternUnits="userSpaceOnUse">
              <rect width="60" height="22" fill="#260b09" />
              <rect x="1" y="1" width="28" height="9.6" rx="1" fill="#6d231d" />
              <rect x="31" y="1" width="28" height="9.6" rx="1" fill="#5a1c17" />
              <rect x="-14" y="12" width="28" height="9.6" rx="1" fill="#63211b" />
              <rect x="16" y="12" width="28" height="9.6" rx="1" fill="#74281f" />
              <rect x="46" y="12" width="28" height="9.6" rx="1" fill="#63211b" />
            </pattern>
            <pattern id={`${id}v`} width="180" height="66" patternUnits="userSpaceOnUse">
              <rect x="31" y="1" width="28" height="9.6" fill="#f08a6a" opacity="0.18" />
              <rect x="106" y="23" width="28" height="9.6" fill="#000" opacity="0.3" />
              <rect x="76" y="45" width="28" height="9.6" fill="#f08a6a" opacity="0.13" />
              <rect x="151" y="1" width="28" height="9.6" fill="#000" opacity="0.24" />
              <rect x="16" y="34" width="28" height="9.6" fill="#000" opacity="0.22" />
              <rect x="136" y="45" width="28" height="9.6" fill="#ffb08f" opacity="0.12" />
            </pattern>
            <radialGradient id={`${id}k`} cx="96" cy="86" r="400" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ff9a74" stopOpacity="0.7" />
              <stop offset="0.35" stopColor="#d2463a" stopOpacity="0.28" />
              <stop offset="1" stopColor="#1a0605" stopOpacity="0.2" />
            </radialGradient>
            <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="480" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#7a9cc2" stopOpacity="0.42" />
              <stop offset="0.36" stopColor="#7a9cc2" stopOpacity="0" />
              <stop offset="0.6" stopColor="#0a0303" stopOpacity="0" />
              <stop offset="1" stopColor="#0a0303" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id={`${id}g`} x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0" stopColor="#5b7898" />
              <stop offset="0.5" stopColor="#1f2c3c" />
              <stop offset="1" stopColor="#d17a52" />
            </linearGradient>
          </defs>
          <rect x="-240" y="-240" width="960" height="960" fill={`url(#${id}b)`} />
          <rect x="-240" y="-240" width="960" height="960" fill={`url(#${id}v)`} />
          {/* window, upper right: sky in the glass, a lamp inside */}
          <rect x="292" y="168" width="148" height="9" fill="#d9b2a3" />
          <rect x="300" y="36" width="132" height="132" fill="#170b0a" />
          {[0, 1].map((r) =>
            [0, 1].map((c) => <rect key={`${r}${c}`} x={306 + c * 62} y={42 + r * 62} width="58" height="58" fill={`url(#${id}g)`} />),
          )}
          <path d="M306 42h44L306 88z M368 42h26L368 70z" fill="#fff" opacity="0.12" />
          {/* downpipe */}
          <rect x="48" y="0" width="13" height="420" fill="#1d0c0b" />
          <rect x="50" y="0" width="2.5" height="420" fill="#b06a5a" opacity="0.6" />
          {[70, 200, 330].map((y) => (
            <rect key={y} x="45" y={y} width="19" height="6" fill="#140706" />
          ))}
          {/* pipes into the wall */}
          <path d="M348 318h34a8 8 0 0 0 8-8V226" stroke="#0e0606" strokeWidth="11" fill="none" />
          <path d="M348 338h46a8 8 0 0 0 8-8V226" stroke="#0e0606" strokeWidth="11" fill="none" />
          <path d="M385 300V226 M397 320V226" stroke="#d08a6a" strokeWidth="2" opacity="0.45" />
          {/* the unit's shadow, thrown down and right by the key light */}
          <path d="M162 240h200l16 14v146H178z" fill="#0b0302" opacity="0.5" />
          {/* ground */}
          <rect x="-240" y="392" width="960" height="348" fill="#1b0b0a" />
          <path d="M-240 404h960 M-240 424h960 M-240 450h960 M-30 392l-40 88 M90 392l-30 88 M210 392l-6 88 M330 392l20 88 M440 392l40 88 M560 392l50 88" stroke="#3a1714" strokeWidth="1.4" />
          <ellipse cx="250" cy="397" rx="150" ry="11" fill="#000" opacity="0.65" />
          <rect x="-240" y="-240" width="960" height="960" fill={`url(#${id}k)`} />
          <rect x="-240" y="-240" width="960" height="960" fill={`url(#${id}s)`} />
        </svg>
        {/* the unit, in focus */}
        <svg viewBox={box} preserveAspectRatio="xMidYMid slice" className={`${s.layer} ${s.subject}`}>
          <defs>
            <linearGradient id={`${id}f`} x1="0" y1="0" x2="1" y2="0.45">
              <stop offset="0" stopColor="#f6e2d8" />
              <stop offset="0.5" stopColor="#d6ae9f" />
              <stop offset="1" stopColor="#8a635b" />
            </linearGradient>
            <linearGradient id={`${id}o`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0.6" stopColor="#2a0d0b" stopOpacity="0" />
              <stop offset="1" stopColor="#2a0d0b" stopOpacity="0.55" />
            </linearGradient>
            <linearGradient id={`${id}r`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0.25" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.42" stopColor="#fff" stopOpacity="0.32" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <radialGradient id={`${id}h`} cx="0.5" cy="0.42" r="0.58">
              <stop offset="0" stopColor="#2c1715" />
              <stop offset="1" stopColor="#0a0505" />
            </radialGradient>
          </defs>
          <path d="M140 230h200l12-9H152z" fill="#fbeee6" />
          <path d="M340 230l12-9v152l-12 9z" fill="#6e4d47" />
          <rect x="140" y="230" width="200" height="152" rx="3" fill={`url(#${id}f)`} />
          <circle cx={FAN.cx} cy={FAN.cy} r={FAN.r + 7} fill="#b38c82" />
          <circle cx={FAN.cx} cy={FAN.cy} r={FAN.r + 7} fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.2" />
          <circle cx={FAN.cx} cy={FAN.cy} r={FAN.r + 1} fill={`url(#${id}h)`} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect key={i} x="288" y={302 + i * 7} width="34" height="2.2" rx="1" fill="#5d3f3a" opacity="0.5" />
          ))}
          <circle cx="327" cy="247" r="1.8" fill="#a8f5de" />
          <rect x="140" y="230" width="200" height="152" rx="3" fill={`url(#${id}o)`} />
          <rect x="140" y="230" width="200" height="152" rx="3" fill={`url(#${id}r)`} />
          <rect x="152" y="382" width="26" height="12" fill="#160a09" />
          <rect x="300" y="382" width="26" height="12" fill="#160a09" />
          <path d="M141 231.5h198" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.4" />
          <path d="M141 232v148" stroke="#ffb59a" strokeOpacity="0.55" strokeWidth="1.6" />
        </svg>
        <div className={s.fan} style={pct(vb, FAN.cx - FAN.r, FAN.cy - FAN.r, FAN.r * 2, FAN.r * 2)}>
          <svg viewBox="-50 -50 100 100" className={s.fanSvg}>
            {[0, 72, 144, 216, 288].map((a) => (
              <path key={a} transform={`rotate(${a})`} d="M6 -5C17 -18 34 -22 45 -11C42 0 30 5 9 5Z" fill="#5a3a35" />
            ))}
            <circle r="9" fill="#2a1817" />
          </svg>
        </div>
        {/* the grille over the fan, and the status light's glow */}
        <svg viewBox={box} preserveAspectRatio="xMidYMid slice" className={`${s.layer} ${s.subject}`}>
          {[50, 42, 34, 26, 18].map((r) => (
            <circle key={r} cx={FAN.cx} cy={FAN.cy} r={r} fill="none" stroke="#a7837b" strokeOpacity="0.6" strokeWidth="1.2" />
          ))}
          <path d={`M${FAN.cx - 50} ${FAN.cy}h100 M${FAN.cx} ${FAN.cy - 50}v100`} stroke="#a7837b" strokeOpacity="0.6" strokeWidth="1.5" />
          <circle cx={FAN.cx} cy={FAN.cy} r="6" fill="#c9a49a" />
          <path d={`M${FAN.cx - 46} ${FAN.cy - 24}a52 52 0 0 1 30 -26`} stroke="#fff" strokeOpacity="0.4" strokeWidth="2.2" fill="none" />
        </svg>
        {/* HTML, not SVG text: SVG text re-lays out on every frame of a camera move */}
        <span className={s.plate} style={{ ...pct(vb, 288, 255, 60, 10), fontSize: `${(8.5 / vb[2]) * 100}cqw` }}>
          HALDEN
        </span>
        <i className={s.led} style={pct(vb, 319, 239, 16, 16)} />
        {fg ? (
          <svg viewBox={box} preserveAspectRatio="xMidYMid slice" className={`${s.layer} ${s.fg}`}>
            <path d="M80 480c-6-60 10-120 52-150-8 46-14 96-6 150z M40 480c4-50 28-92 66-112-18 38-26 76-24 112z M150 480c2-36 20-62 46-74-10 26-14 50-10 74z" fill="#0b0302" />
          </svg>
        ) : null}
      </div>
      {children}
    </div>
  );
}

/* ---------- 3. Reel ---------- */

function ReelTile({ clip }: { clip?: ChannelClip }) {
  return (
    <div className={s.reelApp}>
      {/* a phone held close to the fan: the grille fills the frame, the
          wall melts behind it */}
      <UnitScene vb={[138, 196, 156, 277.3]} dof={7} soft={0.35} fg>
        <Grade />
      </UnitScene>
      {clip ? <Clip clip={clip} className={s.sceneClip} /> : null}
      <i className={s.reelShade} />
      <div className={s.reelBars}>
        <i data-full="" />
        <i>
          <b />
        </i>
        <i />
        <i />
      </div>
      <div className={s.reelHead}>
        <span className={s.reelAv}>
          <HaldenMark />
        </span>
        <b>{REEL.handle}</b>
        <span className={s.reelFollow}>Follow</span>
        <I n="mute" className={s.reelMute} />
      </div>
      <div className={s.caps}>
        {REEL.captions.map((grp, gi) => (
          <p key={gi} data-cg="" className={gi === REEL.captions.length - 1 ? s.capStill : undefined}>
            {grp.map((w, wi) => (
              <span key={wi} data-cw="" className={gi === REEL.captions.length - 1 && wi === grp.length - 1 ? s.hlStill : undefined}>
                {w.w}
              </span>
            ))}
          </p>
        ))}
      </div>
      <div className={s.rail}>
        <span>
          <I n="heart" fill className={s.liked} />
          <small data-likes="">{compact(REEL.likes + 230)}</small>
        </span>
        <span>
          <I n="comment" fill />
          <small data-comments="">{grouped(REEL.comments + 7)}</small>
        </span>
        <span>
          <I n="send" fill />
          <small>{grouped(REEL.shares)}</small>
        </span>
        <span>
          <I n="more" />
        </span>
      </div>
      <div className={s.reelFoot}>
        <b>@{REEL.handle}</b>
        <p>
          {REEL.text} <span>{REEL.tag}</span>
        </p>
        <div className={s.audio}>
          <I n="music" />
          <span className={s.marquee}>
            <span>
              {REEL.audio} · {REEL.audio} ·{" "}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- 4. Brand film ---------- */

function FilmTile({ clip }: { clip?: ChannelClip }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <div className={s.filmApp}>
      <div className={s.filmTop}>
        <span>{FILM.title}</span>
        <span className={s.hd}>4K</span>
      </div>
      <div className={s.pic}>
        <div className={s.scene}>
          <div className={s.push}>
            <svg viewBox="0 0 480 202" preserveAspectRatio="xMidYMid slice" className={`${s.layer} ${s.outside}`}>
              <defs>
                <linearGradient id={`${id}n`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1d3048" />
                  <stop offset="0.6" stopColor="#152234" />
                  <stop offset="1" stopColor="#0b121c" />
                </linearGradient>
              </defs>
              <rect width="480" height="202" fill={`url(#${id}n)`} />
              <path
                d="M236 92h22v-10h8v10h40l14-16 14 16h34v-8h8v8h30l12-14 12 14h30v110H236z"
                fill="#0a0f17"
              />
              {[
                [262, 104],
                [292, 120],
                [346, 102],
                [384, 124],
                [420, 106],
                [318, 140],
              ].map(([x, y]) => (
                <rect key={`${x}`} x={x} y={y} width="9" height="12" fill="#f4a86c" opacity="0.75" />
              ))}
            </svg>
            <div className={s.bokeh}>
              <i style={{ left: "58%", top: "30%", width: "9%" }} />
              <i style={{ left: "71%", top: "18%", width: "6%" }} />
              <i style={{ left: "83%", top: "36%", width: "11%" }} />
              <i style={{ left: "64%", top: "52%", width: "5%" }} />
            </div>
            <svg viewBox="0 0 480 202" preserveAspectRatio="xMidYMid slice" className={`${s.layer} ${s.room}`}>
              <defs>
                <radialGradient id={`${id}l`} cx="0.13" cy="0.3" r="0.62">
                  <stop offset="0" stopColor="#e8644c" stopOpacity="0.85" />
                  <stop offset="0.5" stopColor="#8e2824" stopOpacity="0.45" />
                  <stop offset="1" stopColor="#2a0d0b" stopOpacity="0" />
                </radialGradient>
                <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="0" spreadMethod="repeat" gradientTransform="scale(0.24 1)">
                  <stop offset="0" stopColor="#3e100d" />
                  <stop offset="0.35" stopColor="#b2402f" />
                  <stop offset="0.6" stopColor="#7a2219" />
                  <stop offset="1" stopColor="#3e100d" />
                </linearGradient>
                <linearGradient id={`${id}cs`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#ff9a74" stopOpacity="0.28" />
                  <stop offset="1" stopColor="#120404" stopOpacity="0.55" />
                </linearGradient>
                <linearGradient id={`${id}r`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#c45a44" />
                  <stop offset="1" stopColor="#4a1411" />
                </linearGradient>
                <linearGradient id={`${id}sp`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffc49a" stopOpacity="0.3" />
                  <stop offset="1" stopColor="#ffc49a" stopOpacity="0" />
                </linearGradient>
                <filter id={`${id}soft`} x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="1.1" />
                </filter>
                <filter id={`${id}spill`} x="-40%" y="-20%" width="180%" height="140%">
                  <feGaussianBlur stdDeviation="7" />
                </filter>
              </defs>
              {/* the room, with the window cut out */}
              <path d="M0 0h480v202H0z M246 18v150h190V18z" fillRule="evenodd" fill="#230908" />
              <path d="M0 0h480v202H0z M246 18v150h190V18z" fillRule="evenodd" fill={`url(#${id}l)`} />
              {/* window frame and mullions */}
              <path d="M240 12h202v162H240z M246 18v150h190V18z" fillRule="evenodd" fill="#140606" />
              <path d="M339 18v150 M246 93h190" stroke="#140606" strokeWidth="5" />
              <rect x="236" y="170" width="210" height="6" fill="#7a2a22" />
              {/* radiator under the sill */}
              {Array.from({ length: 16 }, (_, i) => (
                <rect key={i} x={254 + i * 11} y="180" width="8" height="26" rx="3" fill={`url(#${id}r)`} />
              ))}
              {/* curtain */}
              <path d="M204 4h44l-2 198h-44z" fill={`url(#${id}c)`} />
              <path d="M204 4h44l-2 198h-44z" fill={`url(#${id}cs)`} />
              {/* floor lamp, spilling light down the wall */}
              <path d="M26 66h56l34 136H-8z" fill={`url(#${id}sp)`} filter={`url(#${id}spill)`} />
              <path d="M54 66v136" stroke="#120504" strokeWidth="3" />
              <path d="M34 34h40l9 32H25z" fill="#ffc9a3" />
              <path d="M34 34h40l2 7H32z" fill="#fff1e2" opacity="0.7" />
              {/* the person at the window, back to us, holding a mug */}
              <path
                d="M262 202C262 168 268 136 288 124C296 119 304 116 310 113L311 100C302 95 297 84 298 72C299 58 308 49 320 49C333 49 341 59 341 72C343 73 344 77 341 81C339 90 334 97 327 100L328 112C338 114 350 118 358 124C368 132 376 150 380 168C382 178 378 186 372 190L376 202z"
                fill="#0e0404"
              />
              <circle cx="313" cy="47" r="9" fill="#0e0404" />
              <g filter={`url(#${id}soft)`} fill="none">
                <path
                  d="M262 202C262 168 268 136 288 124C296 119 304 116 310 113 M298 72C299 58 304 50 306 42"
                  stroke="#f0785a"
                  strokeWidth="2.6"
                  opacity="0.7"
                />
                <path d="M322 49C333 49 341 59 341 72C343 73 344 77 341 81 M358 124C368 132 376 150 380 168C382 178 378 186 372 190" stroke="#a9cdea" strokeWidth="2.2" opacity="0.5" />
              </g>
            </svg>
            <div className={s.steam} style={{ left: "72%", top: "30%" }}>
              <i />
              <i />
              <i />
            </div>
            <i className={s.lampGlow} />
          </div>
          <Grade />
        </div>
        {clip ? <Clip clip={clip} className={s.sceneClip} /> : null}
        <div className={s.subs}>
          {FILM.subtitles.map((sub, i) => (
            <p key={i} data-sub={i + 1} className={i === FILM.subtitles.length - 1 ? s.subStill : undefined}>
              {sub.text}
            </p>
          ))}
        </div>
      </div>
      <div className={s.player}>
        <div className={s.scrub}>
          <i className={s.buffer} />
          <i className={s.played} />
        </div>
        <div className={s.ctrls}>
          <I n="pause" className={s.ctrlPlay} />
          <span className={s.tc}>
            <span data-tc="">{clock(FILM.from + 7.5)}</span> / {clock(FILM.length)}
          </span>
          <span className={s.ctrlR}>
            <span className={s.cc}>CC</span>
            <I n="sliders" />
            <I n="full" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- 5. Press ---------- */

function PressTile() {
  return (
    <div className={s.pressApp}>
      <div className={s.pHead}>
        <I n="menu" />
        <span className={s.mast}>{PRESS.masthead}</span>
        <span className={s.subscribe}>Subscribe</span>
      </div>
      <nav className={s.pNav}>
        {PRESS.nav.map((n) => (
          <span key={n} data-on={n === "Reviews" ? "" : undefined}>
            {n}
          </span>
        ))}
      </nav>
      <i className={s.pProg} />
      <div className={s.pView}>
        <article className={s.pPage}>
          <p className={s.pKick}>{PRESS.kicker}</p>
          <h4 className={s.pTitle}>{PRESS.headline}</h4>
          <p className={s.pStand}>{PRESS.standfirst}</p>
          <div className={s.byline}>
            <span className={s.byAv} />
            <span>
              <b>By {PRESS.byline}</b>
              <small>{PRESS.date}</small>
            </span>
          </div>
          <figure className={s.pFig}>
            <div className={s.pImg}>
              {/* the photographer's wide shot: the unit at the foot of
                  the terrace wall, under the window */}
              <UnitScene vb={[-70, 40, 610, 305]} dof={0.8} soft={0.4}>
                <Grade leak={false} />
              </UnitScene>
            </div>
            <figcaption>{PRESS.caption}</figcaption>
          </figure>
          {PRESS.body.map((p, i) => (
            <p key={i} className={`${s.pBody} ${i === 0 ? s.drop : ""}`}>
              {p}
            </p>
          ))}
          <blockquote className={s.pull}>
            <p>{PRESS.quote}</p>
            <small>{PRESS.quoteBy}</small>
          </blockquote>
          {PRESS.more.map((p, i) => (
            <p key={i} className={s.pBody}>
              {p}
            </p>
          ))}
          <div className={s.related}>
            <small>More in Reviews</small>
            {PRESS.related.map((r) => (
              <p key={r}>
                <i />
                {r}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

/* ---------- 6. Creator ---------- */

function CreatorTile({ clip }: { clip?: ChannelClip }) {
  const vb: Box = [128, 200, 272, 153];
  return (
    <div className={s.app}>
      <div className={s.cHead}>
        <span className={s.cAv} />
        <span className={s.cWho}>
          <b>{CREATOR.name}</b>
          <small>
            {CREATOR.handle} · {CREATOR.age}
          </small>
        </span>
        <span className={s.cFollow}>Follow</span>
        <I n="more" className={s.cMore} />
      </div>
      <p className={s.cText}>
        <b>{CREATOR.hook}</b> {CREATOR.text} <span>{CREATOR.tags}</span>
      </p>
      <div className={s.cMedia}>
        {/* her hand and the meter in focus, close; the unit soft behind */}
        <UnitScene vb={vb} dof={5} soft={2.6}>
          <div className={s.meter} style={pct(vb, 148, 226, 104, 150)}>
            <div className={s.meterBody}>
              <div className={s.lcd}>
                <small>SLOW · A</small>
                <b data-db="">{CREATOR.db.toFixed(1)}</b>
                <small>dB</small>
              </div>
              <i className={s.meterBtn} />
            </div>
            <i className={s.thumb} />
          </div>
          <Grade />
        </UnitScene>
        {clip ? <Clip clip={clip} className={s.sceneClip} /> : null}
        <span className={s.cDur}>0:12</span>
        <I n="mute" className={s.cMute} />
      </div>
      <div className={s.cActs}>
        <span>
          <I n="heart" fill className={s.liked} />
          <small data-likes="">{grouped(CREATOR.likes + 17)}</small>
        </span>
        <span>
          <I n="comment" />
          <small data-comments="">{CREATOR.comments + CREATOR.thread.length - 1}</small>
        </span>
        <span>
          <I n="repost" />
          <small>96</small>
        </span>
        <I n="bookmark" className={s.cSave} />
      </div>
      <ul className={s.thread}>
        {CREATOR.thread.map((c, i) => (
          <li key={i} data-c={i}>
            <span className={`${s.tAv} ${c.who === "halden" ? s.tAvH : ""}`}>
              {c.who === "halden" ? <HaldenMark /> : c.who[0].toUpperCase()}
            </span>
            <p>
              <b>{c.who}</b> {c.text}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- 7. Billboard ---------- */

function OohTile() {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const vb: Box = [0, 0, 600, 200];
  // Lit windows in the near building: warm lamps, one cool screen, the rest dark
  const lit = ["w", "", "", "", "b", "w", "", "w", "", "", "", "w"];
  return (
    <div className={s.scene}>
      <div className={s.street}>
        {/* the far city at dusk, soft with distance */}
        <svg viewBox="0 0 600 200" preserveAspectRatio="xMidYMid slice" className={`${s.layer} ${s.far}`}>
          <defs>
            <linearGradient id={`${id}d`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0d1424" />
              <stop offset="0.34" stopColor="#1e2745" />
              <stop offset="0.58" stopColor="#552848" />
              <stop offset="0.74" stopColor="#ad4639" />
              <stop offset="0.86" stopColor="#e47c4c" />
            </linearGradient>
            <radialGradient id={`${id}u`} cx="0.22" cy="0.8" r="0.55">
              <stop offset="0" stopColor="#ffb27c" stopOpacity="0.8" />
              <stop offset="1" stopColor="#ff7a50" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`${id}hz`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e47c4c" stopOpacity="0" />
              <stop offset="0.6" stopColor="#c45a44" stopOpacity="0.35" />
              <stop offset="1" stopColor="#3a1c2c" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="600" height="200" fill={`url(#${id}d)`} />
          <rect width="600" height="200" fill={`url(#${id}u)`} />
          <path
            d="M0 156V122h22v-14h18v20h26V100h14v-8h6v8h12v56h18v-30h30v-12h20v42h28v-22h16v-34h10v-8h4v8h12v56h24v-26h40v-18h22v44h30v-30h34v30h26V112h12v-10h18v52h30v-20h28v-34h22v54h28v-28h26v28h36v-16h20v72H0z"
            fill="#1d1529"
          />
          {[
            [28, 130],
            [84, 108],
            [92, 120],
            [146, 134],
            [222, 118],
            [238, 130],
            [312, 140],
            [376, 134],
            [440, 122],
            [530, 134],
            [548, 144],
            [470, 142],
          ].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="3" height="4" fill="#ffc07e" opacity="0.85" />
          ))}
          <rect x="0" y="118" width="600" height="56" fill={`url(#${id}hz)`} />
        </svg>
        {/* the street: a corner building, the billboard, a lamp */}
        <svg viewBox="0 0 600 200" preserveAspectRatio="xMidYMid slice" className={`${s.layer} ${s.near}`}>
          <defs>
            <linearGradient id={`${id}cone`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff3dc" stopOpacity="0.34" />
              <stop offset="1" stopColor="#fff3dc" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`${id}rd`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#221d2a" />
              <stop offset="1" stopColor="#0b0a10" />
            </linearGradient>
            <linearGradient id={`${id}bw`} x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="#3a2433" />
              <stop offset="0.4" stopColor="#140f1a" />
            </linearGradient>
          </defs>
          <path d="M0 50h96l8 4v118H0z" fill={`url(#${id}bw)`} />
          <path d="M0 46h100v6H0z" fill="#0b0910" />
          {lit.map((l, i) => {
            const x = 10 + (i % 3) * 30;
            const y = 62 + Math.floor(i / 3) * 22;
            return (
              <g key={i}>
                <rect x={x} y={y} width="16" height="15" fill={l === "w" ? "#f0a265" : l === "b" ? "#5f86b8" : "#191522"} opacity={l ? 0.9 : 1} />
                <path d={`M${x + 8} ${y}v15`} stroke="#0b0910" strokeWidth="1.2" />
                <rect x={x - 1} y={y + 15} width="18" height="2" fill="#2a2230" />
              </g>
            );
          })}
          <rect x="0" y="150" width="96" height="20" fill="#f19a5e" opacity="0.55" />
          <path d="M0 146h100l-4 6H0z" fill="#3a1714" />
          {/* billboard */}
          <rect x="366" y="132" width="7" height="40" fill="#0c0a10" />
          <rect x="452" y="132" width="7" height="40" fill="#0c0a10" />
          <rect x="300" y="22" width="224" height="114" fill="#0c0a10" />
          <rect x="300" y="132" width="224" height="3" fill="#2a2532" />
          {[336, 412, 488].map((x) => (
            <g key={x}>
              <path d={`M${x} 22v-8h8`} stroke="#0c0a10" strokeWidth="2.5" fill="none" />
              <rect x={x + 5} y="11" width="10" height="5" fill="#2a2630" />
              <path d={`M${x + 6} 16 L${x - 36} 132 L${x + 56} 132 L${x + 14} 16z`} fill={`url(#${id}cone)`} />
            </g>
          ))}
          {/* street lamp */}
          <path d="M196 176V66h18" stroke="#0b0a10" strokeWidth="3" fill="none" />
          <rect x="208" y="64" width="16" height="5" fill="#3a3440" />
          {/* road and pavement */}
          <rect x="0" y="166" width="600" height="34" fill={`url(#${id}rd)`} />
          <rect x="0" y="166" width="600" height="6" fill="#2c2734" />
          <path d="M40 189h40 M140 189h40 M240 189h40 M340 189h40 M440 189h40 M540 189h40" stroke="#5a5160" strokeWidth="1.5" opacity="0.55" />
        </svg>
        <i className={s.lampHalo} />
        <i className={s.glare} style={pct(vb, 200, 172, 30, 28)} />
        <i className={s.puddle} style={pct(vb, 306, 172, 212, 26)} />
        <i className={s.bloom} style={pct(vb, 296, 18, 232, 123)} />
        <div className={s.poster} style={pct(vb, 306, 28, 212, 103)}>
          <div className={s.posterArt}>
            <p className={s.posterLine}>{OOH.line}</p>
            <span className={s.posterMark}>
              <HaldenMark />
              halden
            </span>
            <span className={s.posterNote}>{OOH.note}</span>
            <svg viewBox="0 0 100 80" className={s.posterUnit}>
              <rect x="6" y="10" width="84" height="62" rx="2" fill="#ece5dc" stroke="#cfc4b7" />
              <path d="M90 10l6-5v62l-6 5z" fill="#c4b8aa" />
              <path d="M6 10l6-5h84l-6 5z" fill="#f7f2ec" />
              <circle cx="38" cy="41" r="23" fill="#2c2a2a" />
              {[23, 18, 13, 8].map((r) => (
                <circle key={r} cx="38" cy="41" r={r} fill="none" stroke="#8c847c" strokeWidth="0.9" />
              ))}
              <path d="M15 41h46 M38 18v46" stroke="#8c847c" strokeWidth="0.9" />
              <rect x="70" y="16" width="14" height="2" fill="#9a9086" />
            </svg>
          </div>
          <i className={s.sweep} />
        </div>
        <div className={s.walkers}>
          <Walker className={s.walkA} />
          <Walker className={s.walkB} />
          <Walker className={s.walkC} />
        </div>
        <div className={s.car}>
          <i className={s.carBody} />
          <i className={s.carHead} />
          <i className={s.carTail} />
        </div>
      </div>
      <Grade />
    </div>
  );
}

function Walker({ className }: { className: string }) {
  return (
    <span className={`${s.walker} ${className}`}>
      <span className={s.walkerBody}>
        <i className={s.legA} />
        <i className={s.legB} />
        <svg viewBox="0 0 20 52" className={s.walkerSvg}>
          <circle cx="10" cy="5.5" r="4.6" fill="#07060a" />
          <path d="M4 13c0-2 2-3 6-3s6 1 6 3l1 17h-3l-.5 2H6.5L6 30H3z" fill="#07060a" />
        </svg>
      </span>
    </span>
  );
}
