/*
  Fig. 01, the manifesto braid: ten suppliers, each reporting its own
  number, become one system. The centrepiece of the paper manifesto
  chapter. A framework-free 2D canvas engine; the React wrapper is
  components/home/braid-strip.tsx, which sets the figure's words in HTML
  (the lead above, the end statement beside or under the braid's end) and
  hands the end statement to the engine.

  Scroll scrubs it while the figure passes through the viewport (it is
  never pinned). Progress 0 is the moment the whole canvas is in view, so
  nobody meets the drawing already half straightened; before that the
  tangle simply stands. Progress 1 is the figure's top (with its lead)
  just under the floating header, or, where that leaves too short a
  scrub, later: the lead slides under the header while the canvas stays
  clear of it. The tangle holds for a beat first.
    p = 0    ten suppliers, each a bundle of 2 to 4 ink hairlines that
             starts at a mono label (supplier · the number it reports),
             tangled, crossing, some of them broken off
    p = 0.5  the strands straighten into evenly spaced lanes: ten parallel
             efforts, ten separate numbers (a tick at each lane's end)
    p = 1    the suppliers' own numbers fade out; the lanes funnel into
             one junction and leave it as one braided strand in brand red
             (three plies; two on phones) that ends at the HTML statement
             "One system. One number." The braid forms back from that
             statement, so no strand ever pinches in and opens out again
  The junction is no logo: the ink strands simply meet, bind for a short
  straight run and become one. The red is laid on each strand only where,
  and as far as, it has joined the braid, so it never shows on a strand
  still on its way in; once all have arrived it starts in one clean cut. Colours come from CSS (the canvas's `color` for
  ink, its `--braid-accent` for red), so the figure follows the tokens.

  Wide canvases set each label right-aligned against its strand's start,
  so once the lanes form the labels end on a common spine (the content
  column's edge on desktop): an axis, each name beside its own lane. As
  the numbers fade the names close up to it, deleting the numbers a
  character at a time. Narrow canvases (phones) draw six strands with
  short labels set above their lanes. In the tangle a loose end is either
  broken off (a small cross) or trails away, never simply cut.
  Reduced motion draws the finished state once: on wide canvases the
  numbers stay beside the names; on phones only the names, so no label
  ever sits across a converging strand.
  Nothing moves on its own: it draws only when progress changes, only
  while the canvas is near the viewport, reads one rect per frame, and
  caps the pixel ratio at 2.
*/

export type BraidOptions = {
  reduced: boolean;
  /** The end statement in HTML: the braid ends at it and it fades in with the braid */
  end?: HTMLElement | null;
  /** Where lanes start on wide canvases (the content column's edge), if laid out */
  spine?: HTMLElement | null;
};

export type Supplier = { name: string; short: string; metric: string };

/** Lane order, top to bottom: the four the standfirst names lead */
export const SUPPLIERS: readonly Supplier[] = [
  { name: "Ads agency", short: "Ads", metric: "CTR 2.1%" },
  { name: "SEO agency", short: "SEO", metric: "Traffic +12%" },
  { name: "Brand studio", short: "Brand", metric: "Consistency 94%" },
  { name: "Social team", short: "Social", metric: "Followers +8%" },
  { name: "PR firm", short: "PR", metric: "Mentions 38" },
  { name: "Web team", short: "Web", metric: "PageSpeed 96" },
  { name: "Creators", short: "Creators", metric: "Reach 2.4M" },
  { name: "Writers", short: "Writers", metric: "Articles 24/mo" },
  { name: "Video studio", short: "Video", metric: "Views 1.4M" },
  { name: "Analytics", short: "Analytics", metric: "Sessions 84K" },
];
/** Phones draw six: the lead four, then the shortest label last, where its lane climbs steepest */
const NARROW_PICK = [0, 1, 2, 3, 5, 4];

/** Below this canvas width: six strands, short labels set above the lanes */
export const NARROW_W = 560;
/** Progress 0: the canvas bottom at this fraction of the viewport height */
const P_START = 0.99;
/** Progress 1: the figure top at this fraction, at least P_END_MIN px down */
const P_END = 0.11;
/** A stretched scrub may end later, but never with the canvas under the
    header (the scrolled pill ends 58px down) */
const P_END_MIN = 64;
/** The shortest scrub, as a fraction of the viewport */
const P_SPAN_MIN = 0.42;
/** Stage windows in progress units: hold the tangle, untangle, then converge */
const UNTANGLE: readonly [number, number] = [0.06, 0.46];
const CONVERGE: readonly [number, number] = [0.5, 1];
/** Fraction of each strand's samples that runs up to the junction */
const SN = 0.4;
/** In the converge, how far each strand's head lags its tail, and how long each sample takes */
const LAG = 0.12;
const GATHER = 0.48;
/** Alpha steps the red is quantized into, so it costs a handful of strokes */
const RED_STEPS = 8;
/** In the tangle, the share of each loose end that trails away, in how many steps */
const TAIL = 0.14;
const TAIL_STEPS = 5;
/** Gap between a label and its strand's start tick, on wide canvases */
const LAB_GAP = 14;

const TAU = Math.PI * 2;
const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ss = (t: number) => t * t * (3 - 2 * t);
const s5 = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
/** Small seeded PRNG (mulberry32), so every layout is reproducible */
const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type Strand = {
  name: string;
  metric: string;
  nameW: number;
  labW: number;
  /** Tangled state: start point, heading per step, step length, sampled path */
  ax: number;
  ay: number;
  stepA: number;
  thA: Float32Array;
  XA: Float32Array;
  YA: Float32Array;
  /** Straight heading the tangle relaxes to (a whole number of turns from its mean) */
  thT: number;
  /** Hairlines in the bundle: count, offsets in -1..1, where frayed ones stop */
  K: number;
  u: Float32Array;
  se: Float32Array;
  alpha: number;
  twist: number;
  twist0: number;
  /** Per-strand stagger for the untangle and the converge */
  dA: number;
  dB: number;
  /** Phase in the braid: strands share one of the plies' phases, so it reads as a plait */
  ph: number;
  /** Lane, top to bottom: the supplier's place in the list */
  lane: number;
  broken: boolean;
  fray: boolean;
  /** This frame: centre line, normals, bundle width, twist, untangle amount,
      and (in the converge) how far each sample has joined the braid, 0 to 1 */
  X: Float32Array;
  Y: Float32Array;
  NX: Float32Array;
  NY: Float32Array;
  Wd: Float32Array;
  Fc: Float32Array;
  E: Float32Array;
  J: Float32Array;
  /** This frame, per segment: its red weight in steps of 1 / RED_STEPS */
  L: Uint8Array;
};

export function mountBraid(canvas: HTMLCanvasElement, opts: BraidOptions): () => void {
  const endEl = opts.end ?? null;
  const ctx2d = canvas.getContext("2d");
  if (!ctx2d) {
    // Nothing to draw: the end statement still stands on its own
    if (endEl) endEl.style.opacity = "1";
    return () => {};
  }
  const ctx: CanvasRenderingContext2D = ctx2d;
  const reduced = opts.reduced;
  // The converging strands are drawn opaque here, then laid down at one
  // alpha, so ten strands meeting at the junction never stack into black
  // (thin strokes accumulate even within one path at a pixel ratio of 1)
  const layer = document.createElement("canvas");
  const lctx = layer.getContext("2d");

  /* Layout, in CSS pixels */
  let W = 0;
  let H = 0;
  let DPR = 1;
  let narrow = false;
  let family = "ui-monospace, monospace";
  let ink = "#000";
  let accent = "#000";
  let fs = 12;
  let capH = 9;
  let N = 200;
  let n = 0;
  let S: Strand[] = [];
  let laneY = new Float32Array(0);
  let stepB = new Float32Array(0);
  let xL = 0;
  let xR = 0;
  let xN = 0;
  let xE = 0;
  let xC = 0;
  let yc = 0;
  /** The end statement's box, relative to the canvas (knocked out behind it) */
  let eBox = { l: 0, t: 0, r: 0, b: 0 };
  let wA = 4.6;
  let wB = 2.6;
  let AMP = 4.5;
  let LAM = 54;
  let RAMP = 28;
  let OUT = 70;
  let LW = 0.8;
  let RW = 1.4;
  let ready = false;
  /** Per frame: how far the strands' starts have slid onto the spine (0 in
      the tangle, 1 in lanes), how far the suppliers' numbers have faded,
      and how far the names have closed up to the spine as they go (wide
      canvases) */
  let slide = 0;
  let metOp = 1;
  let glide = 0;

  const setFont = () => {
    ctx.font = `400 ${fs}px ${family}`;
    // Mono metadata tracking (Meta: 0.03em), where canvas supports it
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${(fs * 0.03).toFixed(2)}px`;
  };

  /** Lane x for sample fraction s: the first SN of samples reach the junction */
  const xOf = (s: number, xEnd: number) =>
    s <= SN ? xL + (s / SN) * (xN - xL) : xN + ((s - SN) / (1 - SN)) * (xEnd - xN);

  function relayout() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    W = w;
    H = h;
    DPR = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    layer.width = canvas.width;
    layer.height = canvas.height;
    narrow = W < NARROW_W;
    const cs = getComputedStyle(canvas);
    family = cs.fontFamily || family;
    ink = cs.color || ink;
    accent = cs.getPropertyValue("--braid-accent").trim() || ink;
    // Labels carry the argument: a size up on wide screens
    fs = narrow ? 11 : W >= 1100 ? 13 : 12;
    capH = Math.round(fs * 0.73);
    setFont();

    const list = narrow ? NARROW_PICK.map((k) => SUPPLIERS[k]) : SUPPLIERS;
    n = list.length;
    N = narrow ? 150 : 220;
    wA = narrow ? 3.6 : 4.8;
    wB = narrow ? 2.2 : 2.6;
    AMP = narrow ? 4 : 7;
    LAM = narrow ? 44 : 88;
    RAMP = narrow ? 22 : 34;
    LW = narrow ? 0.75 : 0.8;
    // The red plies, a step heavier than the ink they resolve
    RW = narrow ? 1.2 : 1.4;

    if (!S.length || S.length !== n || S[0].X.length !== N) {
      S = list.map((sup, i) => ({
        name: (narrow ? sup.short : sup.name).toUpperCase(),
        metric: ` · ${sup.metric}`.toUpperCase(),
        nameW: 0,
        labW: 0,
        ax: 0,
        ay: 0,
        stepA: 0,
        thA: new Float32Array(N - 1),
        XA: new Float32Array(N),
        YA: new Float32Array(N),
        thT: 0,
        K: 3,
        u: new Float32Array(4),
        se: new Float32Array(4),
        alpha: 1,
        twist: 1,
        twist0: 0,
        dA: 0,
        dB: 0,
        ph: 0,
        lane: i,
        broken: false,
        fray: false,
        X: new Float32Array(N),
        Y: new Float32Array(N),
        NX: new Float32Array(N),
        NY: new Float32Array(N),
        Wd: new Float32Array(N),
        Fc: new Float32Array(N),
        E: new Float32Array(N),
        J: new Float32Array(N),
        L: new Uint8Array(N),
      }));
    }
    let labMax = 0;
    for (const sd of S) {
      sd.nameW = ctx.measureText(sd.name).width;
      sd.labW = sd.nameW + ctx.measureText(sd.metric).width;
      labMax = Math.max(labMax, sd.labW);
    }

    // Lanes sit symmetrically about the centre line, where the braid runs
    yc = Math.round(H / 2) + 0.5;
    const top = narrow ? 30 : 12;
    laneY = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      laneY[i] = Math.round(top + ((H - 2 * top) * i) / (n - 1)) + 0.5;
    }

    // Where the end statement sits decides where the braid ends: beside it
    // (wide), or above its right edge when it is stacked under the centre
    const cr = canvas.getBoundingClientRect();
    const er = endEl?.getBoundingClientRect();
    const stacked = er ? er.top - cr.top > H / 2 : true;
    if (er && er.width) {
      eBox = { l: er.left - cr.left, t: er.top - cr.top, r: er.right - cr.left, b: er.bottom - cr.top };
      xE = Math.round(stacked ? eBox.r - 4 : eBox.l - 24);
    } else {
      eBox = { l: 0, t: 0, r: 0, b: 0 };
      xE = W - 6;
    }
    xR = W - 1;

    if (narrow) {
      // Labels sit above their lanes; the braid takes the right
      xL = 1;
      xN = Math.round(W * 0.6);
      // Late enough that no strand bends under another lane's label
      xC = Math.round(W * 0.34);
    } else {
      // Lanes start at a common spine, the labels set right-aligned against
      // it: the content column's edge where it is laid out (desktop), else
      // just clear of the longest label
      const sr = opts.spine?.getBoundingClientRect();
      const spineX = sr && (sr.width || sr.height || sr.left) ? sr.left - cr.left : 0;
      xL = Math.round(Math.max(labMax + LAB_GAP + 2, spineX));
      xN = Math.round(xL + (xE - xL) * 0.5);
      xC = xL + (xN - xL) * 0.08;
    }
    OUT = Math.min(96, (xE - xN) * 0.3);

    stepB = new Float32Array(N - 1);
    for (let k = 0; k < N - 1; k++) stepB[k] = xOf((k + 1) / (N - 1), xR) - xOf(k / (N - 1), xR);
    genTangle();
    ready = true;
  }

  /* The tangle: each supplier's strand wanders off from its own label */
  function genTangle() {
    const R = rng(narrow ? 1307 : W < 900 ? 2203 : 4409);
    const th = new Float32Array(N - 1);
    const L0 = 2;
    const R0 = W - 2;
    // Phones keep the tangle a little further off the top edge, so no
    // bundle is cut short there
    const T0 = narrow ? 14 : 4;
    const B0 = H - 4;

    // Scatter the labels (best of many candidates, never overlapping), each
    // with its strand's start point. Rows are jittered but keep the lane
    // order, top to bottom, so the labels sort into their lanes without
    // ever passing over one another; only the x is free
    type Box = { l: number; t: number; r: number; b: number };
    const boxOf = (sd: Strand, x0: number, y0: number): Box =>
      narrow
        ? { l: x0 - 4, t: y0 - 8 - capH - 6, r: x0 + sd.labW + 6, b: y0 + 5 }
        : { l: x0 - LAB_GAP - 5 - sd.labW, t: y0 - capH / 2 - 8, r: x0 + 24, b: y0 + capH / 2 + 8 };
    const yTop = narrow ? capH + 18 : 14;
    const yBot = narrow ? H - 16 : H - 14;
    const jit = narrow ? 0.25 : 0.7;
    const rows = Array.from(
      { length: n },
      (_, k) => yTop + (yBot - yTop) * clamp((k + 0.5 + (R() - 0.5) * jit) / n),
    ).sort((a, b) => a - b);
    const placed: Box[] = [];
    for (let i = 0; i < n; i++) {
      const sd = S[i];
      sd.lane = i;
      const y0 = rows[i];
      let bestD = -2;
      for (let c = 0; c < 60; c++) {
        const x0 = narrow
          ? 2 + R() * Math.max(0, W - sd.labW - 30)
          : sd.labW + LAB_GAP + 4 + R() * Math.max(0, W * 0.86 - sd.labW - LAB_GAP - 4);
        const bx = boxOf(sd, x0, y0);
        let d = Infinity;
        for (const o of placed) {
          if (bx.l < o.r + 4 && bx.r > o.l - 4 && bx.t < o.b + 4 && bx.b > o.t - 4) {
            d = -1;
            break;
          }
          const dx = (bx.l + bx.r - o.l - o.r) / 2;
          const dy = (bx.t + bx.b - o.t - o.b) / 2;
          d = Math.min(d, Math.hypot(dx, dy * 1.6));
        }
        if (d > bestD) {
          bestD = d;
          sd.ax = x0;
          sd.ay = y0;
        }
      }
      placed.push(boxOf(sd, sd.ax, sd.ay));
    }

    // Loose ends stay clear of every label, so a broken end never reads
    // as part of one
    for (let i = 0; i < n; i++) {
      const sd = S[i];
      const x0 = sd.ax;
      const y0 = sd.ay;
      let best = Infinity;
      for (let attempt = 0; attempt < 140 && best > 0; attempt++) {
        // Leave the label nearly level, so its start tick stands upright. On
        // phones the label sits above the start: leave level or downward
        const th0 = narrow
          ? 0.2 + (R() - 0.5) * 0.45
          : (R() - 0.5) * 0.7 + (y0 < H / 2 ? 0.15 : -0.15);
        const L = narrow ? W * (0.7 + R() * 0.45) : W * (0.32 + R() * 0.3);
        const c1 = (0.35 + R() * 0.7) * (R() < 0.5 ? -1 : 1);
        const f1 = 0.6 + R() * 1.1;
        const p1 = R() * TAU;
        const c2 = (0.1 + R() * 0.35) * (R() < 0.5 ? -1 : 1);
        const f2 = 1.6 + R() * 2;
        const p2 = R() * TAU;
        const bias = (R() * 2 - 1) * 2.6;
        const step = L / (N - 1);
        let x = x0;
        let y = y0;
        let score = 0;
        for (let k = 0; k < N - 1; k++) {
          const s = k / (N - 1);
          const ang =
            th0 +
            bias * s +
            c1 * (Math.sin(TAU * f1 * s + p1) - Math.sin(p1)) +
            c2 * (Math.sin(TAU * f2 * s + p2) - Math.sin(p2));
          th[k] = ang;
          x += Math.cos(ang) * step;
          y += Math.sin(ang) * step;
          score +=
            Math.max(0, L0 - x) + Math.max(0, x - R0) + Math.max(0, T0 - y) + Math.max(0, y - B0);
          // Keep the first stretch clear of the strand's own label
          if (!narrow && s < 0.25 && x < x0 - 6) score += x0 - 6 - x;
          if (narrow && s < 0.3 && y < y0 - 3 && x < x0 + sd.labW + 8) score += (y0 - 3 - y) * 4;
        }
        for (const o of placed) {
          if (x > o.l - 12 && x < o.r + 12 && y > o.t - 8 && y < o.b + 8) score += 80;
        }
        if (score < best) {
          best = score;
          sd.stepA = step;
          sd.thA.set(th);
        }
      }
      let x = sd.ax;
      let y = sd.ay;
      sd.XA[0] = x;
      sd.YA[0] = y;
      let m = 0;
      for (let k = 0; k < N - 1; k++) {
        x += Math.cos(sd.thA[k]) * sd.stepA;
        y += Math.sin(sd.thA[k]) * sd.stepA;
        sd.XA[k + 1] = x;
        sd.YA[k + 1] = y;
        if (k < (N - 1) * 0.3) m += sd.thA[k];
      }
      // Straighten toward the whole turn nearest the strand's opening
      // stretch, so the start (and its label) never swings back on itself
      sd.thT = TAU * Math.round(m / Math.ceil((N - 1) * 0.3) / TAU);
      sd.K = 2 + ((R() * 3) | 0);
      for (let j = 0; j < sd.K; j++) {
        sd.u[j] = sd.K === 1 ? 0 : (j / (sd.K - 1)) * 2 - 1 + (R() - 0.5) * 0.2;
        sd.se[j] = 1;
      }
      sd.fray = i % 4 === 1;
      sd.broken = i % 3 === 0;
      if (sd.fray) for (let j = 1; j < sd.K; j++) sd.se[j] = 1 - (0.04 + R() * 0.16);
      sd.alpha = 0.86 + R() * 0.24;
      sd.twist = 0.6 + R() * 1.1;
      sd.twist0 = R() * TAU;
      sd.dA = R() * 0.18;
      sd.dB = (0.15 * Math.abs(sd.lane - (n - 1) / 2)) / ((n - 1) / 2);
      // Strands leave the junction as a few plies (three; two on phones),
      // each a group of strands in step, so the braid stays legible at 1x
      const plies = narrow ? 2 : 3;
      sd.ph = (TAU * (i % plies)) / plies;
    }
    // Two crosses side by side read as clutter: of two broken ends that
    // land close together, the second trails away instead
    const ends: [number, number][] = [];
    for (const sd of S) {
      if (!sd.broken) continue;
      const ex = sd.XA[N - 1];
      const ey = sd.YA[N - 1];
      if (ends.some(([x, y]) => Math.hypot(x - ex, y - ey) < 32)) sd.broken = false;
      else ends.push([ex, ey]);
    }
  }

  /* The converged path: into the junction, then braided to the end point.
     Sets the path's line (gy: the curve in, then the centre line), the
     plait's offset from it (gp) and the bundle's width (gw) */
  let gy = 0;
  let gp = 0;
  let gw = 0;
  function converged(i: number, x: number) {
    if (x <= xN) {
      const k = s5(clamp((x - xC) / (xN - xC)));
      gy = lerp(laneY[S[i].lane], yc, k);
      gp = 0;
      gw = lerp(wB, 0.4, k);
      return;
    }
    // A short straight binding past the junction, then the plait, which
    // settles back into one line before the end point
    const xb = x - xN;
    const a =
      AMP * s5(clamp((xb - RAMP * 0.5) / RAMP)) * (1 - s5(clamp((x - (xE - OUT)) / OUT)));
    gy = yc;
    gp = a * Math.sin((TAU * (xb - RAMP * 0.5)) / LAM + S[i].ph);
    gw = 0.4;
  }

  function computeStrand(i: number, q1: number, q2: number) {
    const sd = S[i];
    const { X, Y, E, Wd, Fc } = sd;
    const last = N - 1;
    if (q2 <= 0) {
      // Tangle to lanes: each heading relaxes to straight. Head and tail
      // relax first (the tail fastest), so the tails find their own rows
      // early and never pile up at the wall
      const eAt = (s: number) => {
        const dur = 0.72 - 0.25 * ss(clamp((s - 0.3) / 0.7));
        return s5(clamp((q1 - sd.dA - 0.2 * Math.min(s, 1 - s)) / dur));
      };
      // The label (and the strand's start) moves to its row first, then
      // slides into the label column: all together, so no two ever cross
      const ly = laneY[sd.lane];
      const x0 = lerp(sd.ax, xL, slide);
      const y0 = lerp(sd.ay, ly, s5(clamp(q1 / 0.55)));
      // The lane runs from wherever the start is now to the right edge
      const span = (xR - x0) / (xR - xL);
      let x = x0;
      let y = y0;
      X[0] = x;
      Y[0] = y;
      E[0] = eAt(0);
      for (let k = 0; k < last; k++) {
        const e = eAt(k / last);
        const a = lerp(sd.thA[k], sd.thT, e);
        const step = lerp(sd.stepA, stepB[k] * span, e);
        x += Math.cos(a) * step;
        y += Math.sin(a) * step;
        X[k + 1] = x;
        Y[k + 1] = y;
        E[k + 1] = eAt((k + 1) / last);
      }
      // Mid-untangle, pull toward a direct blend so no strand swings wide.
      // Where a stretch has already relaxed the pull holds (and the tail is
      // pinned to its lane end), so the tails never pinch at the wall
      if (q1 > 0 && q1 < 1) {
        for (let k = 1; k <= last; k++) {
          const e = E[k];
          const m = 0.8 * Math.sin(Math.PI * Math.min(e, 0.5)) + 0.2 * ss(clamp(e * 2 - 1));
          if (m < 0.001) continue;
          const lx = x0 + (xOf(k / last, xR) - xL) * span;
          X[k] = lerp(X[k], lerp(sd.XA[k] + x0 - sd.ax, lx, e), m);
          Y[k] = lerp(Y[k], lerp(sd.YA[k] + y0 - sd.ay, ly, e), m);
        }
      }
      // Soft walls, so drifting strands stay inside the figure
      const lo = narrow ? 10 : 3;
      const hi = H - 3;
      const le = 1;
      const ri = W - 1;
      for (let k = 1; k <= last; k++) {
        const yy = Y[k];
        const xx = X[k];
        if (yy < lo + 8) Y[k] = lo + 8 - 8 * Math.tanh((lo + 8 - yy) / 8);
        else if (yy > hi - 8) Y[k] = hi - 8 + 8 * Math.tanh((yy - hi + 8) / 8);
        if (xx < le + 8) X[k] = le + 8 - 8 * Math.tanh((le + 8 - xx) / 8);
        else if (xx > ri - 8) X[k] = ri - 8 + 8 * Math.tanh((xx - ri + 8) / 8);
      }
      for (let k = 0; k <= last; k++) {
        const s = k / last;
        const e = E[k];
        Fc[k] = lerp(Math.cos(TAU * sd.twist * s + sd.twist0), 1, e);
        const fray = sd.fray ? 2.2 * ss(clamp((s - 0.84) / 0.16)) : 0;
        Wd[k] = lerp(wA * (1 + fray), wB, e);
      }
    } else {
      // Lanes to one system: converge from the left, braid, end at one point.
      // The tail leads (the braid forms back from the end statement), so at
      // every moment each strand only closes on the centre line from left to
      // right: a funnel, never a pinch that opens out again. The plait's
      // wave is laid on only as a sample nears its line, so strands still on
      // their way bend in cleanly
      const ex = s5(clamp(q2 / 0.75));
      const { J } = sd;
      for (let k = 0; k <= last; k++) {
        const s = k / last;
        const e = s5(clamp((q2 - sd.dB - LAG * (1 - s)) / GATHER));
        const x = lerp(xOf(s, xR), xOf(s, xE), ex);
        converged(i, x);
        const yb = lerp(laneY[sd.lane], gy, e);
        // How far this sample still is from its line
        const d = Math.abs(yb - gy);
        const y = yb + gp * ss(clamp(1 - d / 12));
        X[k] = x;
        Y[k] = y;
        Wd[k] = lerp(wB, gw, e);
        Fc[k] = 1;
        E[k] = 1;
        // Joined: past the junction, and within a few pixels of its line.
        // Where the strands have all arrived the red starts at once, a few
        // pixels on: one clean cut from ink to red, with no faint steps
        // stacking up on the last of the ink
        J[k] = x > xN + 6 ? ss(clamp(1 - d / 6)) : 0;
      }
    }
    const { NX, NY } = sd;
    for (let k = 0; k <= last; k++) {
      const a = k ? k - 1 : 0;
      const b = k < last ? k + 1 : last;
      const dx = X[b] - X[a];
      const dy = Y[b] - Y[a];
      const l = Math.hypot(dx, dy) || 1;
      NX[k] = -dy / l;
      NY[k] = dx / l;
    }
  }

  /** Where a supplier's label sits: above its strand's start (narrow), or
      right-aligned against it (wide), so in lanes every label ends on the
      spine beside its own lane; as its number goes, the name closes up */
  const labelAt = (sd: Strand) =>
    narrow
      ? { x: Math.round(sd.X[0] - 1), y: Math.round(sd.Y[0] - 9) }
      : {
          x: Math.round(sd.X[0] - LAB_GAP - sd.nameW - (sd.labW - sd.nameW) * (1 - glide)),
          y: Math.round(sd.Y[0] + capH / 2),
        };

  /** Where a wide label's number is cut off as it slides into the strand */
  const metR = (sd: Strand) => (narrow ? Infinity : sd.X[0] - LAB_GAP + 1);

  /** One bundle's hairlines over samples k0..k1 */
  function bundle(sd: Strand, k0: number, k1: number, g: CanvasRenderingContext2D = ctx) {
    const { X, Y, NX, NY, Wd, Fc } = sd;
    const last = N - 1;
    for (let j = 0; j < sd.K; j++) {
      const uj = sd.u[j];
      // A frayed hairline stops short in the tangle and grows back as it straightens
      const kmax = sd.se[j] < 1 ? Math.floor(lerp(sd.se[j], 1, sd.E[last]) * last) : last;
      const kEnd = Math.min(k1, kmax);
      for (let k = k0; k <= kEnd; k++) {
        const o = uj * Wd[k] * Fc[k];
        const px = X[k] + NX[k] * o;
        const py = Y[k] + NY[k] * o;
        if (k > k0) g.lineTo(px, py);
        else g.moveTo(px, py);
      }
    }
  }

  function draw(p: number) {
    if (!ready) return;
    const q1 = clamp((p - UNTANGLE[0]) / (UNTANGLE[1] - UNTANGLE[0]));
    const q2 = clamp((p - CONVERGE[0]) / (CONVERGE[1] - CONVERGE[0]));
    const last = N - 1;
    slide = s5(clamp((q1 - 0.35) / 0.65));
    // The suppliers' own numbers fade as the lanes converge: ten numbers
    // become one. Reduced motion shows only the end state: wide canvases
    // keep the numbers there (in the margin, clear of every strand), phones
    // only the names, which sit on their lanes' straight runs
    metOp = reduced ? (narrow ? 0 : 1) : 1 - ss(clamp((q2 - 0.12) / 0.38));
    // As each number fades the name slides right with it, pushing the
    // number into the strand's start, so a label never floats off its lane
    glide = reduced ? 0 : 1 - metOp;
    for (let i = 0; i < n; i++) computeStrand(i, q1, q2);

    const c = ctx;
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    c.clearRect(0, 0, W, H);
    c.lineJoin = "round";
    c.lineCap = "butt";

    /* the strands: 2 to 4 ink hairlines a bundle. In the tangle each is
       stroked on its own, so crossings read darker; once the lanes start
       to converge they go whole through the opaque layer, so the junction
       stays one even grey and no stretch is stroked twice. Then the red is
       laid over each strand only where it has joined the braid */
    const baseA = q2 > 0 ? 0.56 : lerp(0.48, 0.56, q1);
    const kRed = s5(clamp((q2 - 0.1) / 0.4));
    c.lineWidth = LW;
    c.strokeStyle = ink;
    if (q2 <= 0) {
      for (let i = 0; i < n; i++) {
        const sd = S[i];
        // Per-strand weight in the tangle, even by the time the lanes are straight
        const a = Math.min(0.7, baseA * lerp(sd.alpha, 1, q1));
        // A loose end that is not broken off (marked with a cross) trails
        // away in a few steps, so no end ever reads as cut off; the trail
        // closes up as the strand straightens into its lane
        const fade = sd.broken ? 0 : 1 - sd.E[last];
        const kF = fade > 0.02 ? Math.round(last * (1 - TAIL)) : last;
        c.globalAlpha = a;
        c.beginPath();
        bundle(sd, 0, kF);
        c.stroke();
        for (let t = 0; kF < last && t < TAIL_STEPS; t++) {
          c.globalAlpha = a * (1 - (fade * (t + 1)) / (TAIL_STEPS + 0.5));
          c.beginPath();
          bundle(
            sd,
            kF + Math.round(((last - kF) * t) / TAIL_STEPS),
            kF + Math.round(((last - kF) * (t + 1)) / TAIL_STEPS),
          );
          c.stroke();
        }
      }
    } else {
      // Each segment's red weight, quantized into a few alpha steps (one
      // path per step). The red stroke is a touch wider than the ink, so at
      // full weight it covers it and the ink under it can be left out
      for (let i = 0; i < n; i++) {
        const { J, L } = S[i];
        for (let k = 0; k < last; k++) L[k] = Math.round(kRed * 0.5 * (J[k] + J[k + 1]) * RED_STEPS);
      }
      /** One hairline's segments whose step passes `keep`, as runs of lines */
      const runs = (
        g: CanvasRenderingContext2D | Path2D,
        sd: Strand,
        j: number,
        keep: (lv: number) => boolean,
      ) => {
        const { X, Y, NX, NY, Wd, L } = sd;
        const uj = sd.u[j];
        let open = -1;
        for (let k = 0; k < last; k++) {
          const lv = L[k];
          if (!keep(lv)) {
            open = -1;
            continue;
          }
          if (open !== lv) {
            const o = uj * Wd[k];
            g.moveTo(X[k] + NX[k] * o, Y[k] + NY[k] * o);
          }
          const o = uj * Wd[k + 1];
          g.lineTo(X[k + 1] + NX[k + 1] * o, Y[k + 1] + NY[k + 1] * o);
          open = lv;
        }
      };
      const notFull = (lv: number) => lv < RED_STEPS;
      const g = lctx ?? c;
      g.setTransform(DPR, 0, 0, DPR, 0, 0);
      if (lctx) {
        lctx.clearRect(0, 0, W, H);
        lctx.lineJoin = "round";
        lctx.lineWidth = LW;
        lctx.strokeStyle = ink;
      } else c.globalAlpha = baseA;
      g.beginPath();
      // Every run of ink is opaque within the layer, so where one stops and
      // another starts nothing is stroked twice
      for (let i = 0; i < n; i++) for (let j = 0; j < S[i].K; j++) runs(g, S[i], j, notFull);
      g.stroke();
      if (lctx) {
        c.setTransform(1, 0, 0, 1, 0, 0);
        c.globalAlpha = baseA;
        c.drawImage(layer, 0, 0);
        c.setTransform(DPR, 0, 0, DPR, 0, 0);
      }
      if (kRed > 0) {
        c.strokeStyle = accent;
        for (let lv = 1; lv <= RED_STEPS; lv++) {
          const path = new Path2D();
          let any = false;
          const at = (v: number) => v === lv && (any = true);
          for (let i = 0; i < n; i++) for (let j = 0; j < S[i].K; j++) runs(path, S[i], j, at);
          if (!any) continue;
          const a = lv / RED_STEPS;
          c.globalAlpha = a;
          c.lineWidth = lerp(LW, RW, a);
          c.stroke(path);
        }
        c.lineWidth = LW;
        c.strokeStyle = ink;
      }
    }

    /* a start tick across each bundle */
    c.strokeStyle = ink;
    c.globalAlpha = 0.7;
    c.lineWidth = 1;
    c.beginPath();
    for (let i = 0; i < n; i++) {
      const sd = S[i];
      const h = sd.Wd[0] + 3;
      c.moveTo(sd.X[0] - sd.NX[0] * h, sd.Y[0] - sd.NY[0] * h);
      c.lineTo(sd.X[0] + sd.NX[0] * h, sd.Y[0] + sd.NY[0] * h);
    }
    c.stroke();

    /* broken ends in the tangle: a small cross where a strand stops */
    for (let i = 0; i < n; i++) {
      const sd = S[i];
      if (!sd.broken) continue;
      const a = 0.6 * (1 - sd.E[last]);
      if (a < 0.02) continue;
      const { X, Y } = sd;
      let dx = X[last] - X[last - 2];
      let dy = Y[last] - Y[last - 2];
      const l = Math.hypot(dx, dy) || 1;
      dx /= l;
      dy /= l;
      const r = 3;
      const cx = clamp(X[last] + dx * 7, r + 1, W - r - 1);
      const cy = clamp(Y[last] + dy * 7, r + 1, H - r - 1);
      c.globalAlpha = a;
      c.beginPath();
      c.moveTo(cx - r, cy - r);
      c.lineTo(cx + r, cy + r);
      c.moveTo(cx + r, cy - r);
      c.lineTo(cx - r, cy + r);
      c.stroke();
    }

    /* lane ends: ten separate numbers, shown while the lanes are straight */
    const laneEnd = ss(clamp((q1 - 0.7) / 0.3)) * (1 - ss(clamp(q2 / 0.25)));
    if (laneEnd > 0.01) {
      c.globalAlpha = laneEnd * 0.6;
      c.beginPath();
      for (let i = 0; i < n; i++) {
        const sd = S[i];
        const h = sd.Wd[last] + 3;
        const x = Math.round(sd.X[last]) - 0.5;
        c.moveTo(x, sd.Y[last] - h);
        c.lineTo(x, sd.Y[last] + h);
      }
      c.stroke();
    }

    /* knockouts: the paper shows through behind every label and the end
       statement, so no strand ever runs through type */
    // On phones the converging strands climb through the numbers' rows:
    // once they start to bend, the numbers stop cutting them, so they pass
    // cleanly behind the fading type instead of being chopped. The names
    // sit left of every bend, so they keep their knockouts
    const kMet = narrow ? 1 - ss(clamp(q2 / 0.4)) : 1;
    const kEnd = reduced ? 1 : ss(clamp((q2 - 0.6) / 0.36));
    c.globalCompositeOperation = "destination-out";
    c.fillStyle = "#000";
    for (let i = 0; i < n; i++) {
      const sd = S[i];
      const { x, y } = labelAt(sd);
      c.globalAlpha = 1;
      c.fillRect(x - 5, y - capH - 5, sd.nameW + 10, capH + 10);
      if (metOp > 0.01 && kMet > 0.01) {
        c.globalAlpha = kMet;
        const r = Math.min(x + sd.labW, metR(sd)) + 5;
        c.fillRect(x + sd.nameW + 5, y - capH - 5, r - x - sd.nameW - 5, capH + 10);
      }
    }
    if (kEnd > 0.01 && eBox.r > eBox.l) {
      c.globalAlpha = kEnd;
      c.fillRect(eBox.l - 8, eBox.t - 4, eBox.r - eBox.l + 16, eBox.b - eBox.t + 8);
    }
    c.globalCompositeOperation = "source-over";

    /* the end point: one strand, one number */
    if (kEnd > 0.01) {
      c.globalAlpha = kEnd;
      c.fillStyle = accent;
      c.fillRect(Math.round(xE) - 3, Math.round(yc - 0.5) - 3, 6, 6);
    }

    /* labels: supplier in ink, the number it reports a step quieter */
    setFont();
    c.textBaseline = "alphabetic";
    c.textAlign = "left";
    c.fillStyle = ink;
    for (let i = 0; i < n; i++) {
      const sd = S[i];
      const { x, y } = labelAt(sd);
      c.globalAlpha = 0.9;
      c.fillText(sd.name, x, y);
      if (metOp > 0.01) {
        // (it dims faster than it is deleted, so a part-deleted number is faint)
        c.globalAlpha = 0.66 * metOp * metOp;
        // Wide canvases: as the name closes up, the number is deleted from
        // its end, a character at a time (the face is mono), so it never
        // crosses the strand's start and no glyph is ever cut
        let t = sd.metric;
        if (!narrow && glide > 0) {
          const adv = (sd.labW - sd.nameW) / t.length;
          t = t.slice(0, Math.max(0, Math.floor((metR(sd) - x - sd.nameW) / adv + 0.01)));
        }
        if (t.trim()) c.fillText(t, x + sd.nameW, y);
      }
    }
    c.globalAlpha = 1;
    if (endEl) endEl.style.opacity = kEnd.toFixed(3);
  }

  /* progress, loop, observers */
  const figure = canvas.closest("figure");
  let raf = 0;
  let visible = false;
  let disposed = false;
  let shown = -1;
  let p = reduced ? 1 : 0;
  let last = 0;

  const target = () => {
    if (reduced) return 1;
    const r = canvas.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    // Progress 0: the whole canvas in view. Progress 1: the figure's top,
    // with its lead heading, just under the header
    const capOff = figure ? Math.max(0, r.top - figure.getBoundingClientRect().top) : 0;
    let start = vh * P_START - r.height;
    let end = Math.max(P_END_MIN, vh * P_END) + capOff;
    // Too short a scrub (short screens): end later, letting the lead slide
    // under the header while the canvas stays clear of it. Never start
    // before the whole canvas is in view, unless the canvas is too tall to
    // leave even most of the minimum (a phone held sideways)
    const min = vh * P_SPAN_MIN;
    if (start - end < min) end = Math.max(P_END_MIN, start - min);
    if (start - end < min * 0.75) start = end + min * 0.75;
    return clamp((start - r.top) / (start - end));
  };

  const tick = (now: number) => {
    raf = 0;
    if (!visible || disposed) return;
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    const goal = target();
    // A short glide, so wheel steps read as motion rather than jumps
    p = shown < 0 ? goal : p + (goal - p) * (1 - Math.exp(-dt * 7));
    const settled = Math.abs(goal - p) < 0.0005;
    if (settled) p = goal;
    // The braid moves only with the visitor's scroll
    if (p !== shown) draw(p);
    shown = p;
    if (!settled) raf = requestAnimationFrame(tick);
  };
  const start = () => {
    if (reduced) {
      draw(1);
      return;
    }
    if (visible && !raf && !disposed) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  };
  // Lay out again only when a size, a colour or a face has changed
  let key = "";
  const refresh = () => {
    if (disposed) return;
    const cs = getComputedStyle(canvas);
    ctx.font = `400 12px ${cs.fontFamily}`;
    const k = [
      canvas.clientWidth,
      canvas.clientHeight,
      window.devicePixelRatio,
      cs.fontFamily,
      cs.color,
      ctx.measureText("ONE SYSTEM").width,
      endEl ? `${endEl.offsetWidth}x${endEl.offsetHeight}` : "",
    ].join("|");
    if (k === key) return;
    key = k;
    relayout();
    // A resized canvas is blank: draw again even if progress has not moved
    shown = -1;
    if (reduced) draw(1);
    else start();
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) visible = e.isIntersecting;
      if (!visible) shown = -1;
      start();
    },
    { rootMargin: "120px 0px" },
  );
  io.observe(canvas);
  const onScroll = () => start();
  window.addEventListener("scroll", onScroll, { passive: true });
  const ro = new ResizeObserver(refresh);
  ro.observe(canvas);
  if (endEl) ro.observe(endEl);

  // Labels are measured in the mono face, the end statement in the display
  // face: lay out again once they have loaded
  const fonts = document.fonts;
  const onFonts = () => refresh();
  if (fonts) {
    void fonts.load(`400 12px ${getComputedStyle(canvas).fontFamily}`).then(onFonts, () => {});
    void fonts.ready.then(onFonts);
    fonts.addEventListener?.("loadingdone", onFonts);
  }

  refresh();

  return () => {
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("scroll", onScroll);
    fonts?.removeEventListener?.("loadingdone", onFonts);
  };
}
