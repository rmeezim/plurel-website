import { MARK_CELLS } from "@/lib/mark";

/*
  Fig. 01, the manifesto braid: "ten suppliers, one system" in miniature.
  A framework-free 2D canvas engine; the React wrapper is
  components/home/braid-strip.tsx.

  Scroll scrubs it while the strip passes through the viewport (it is not
  pinned): progress 0 once the whole strip is in view (its bottom at 99%
  of the viewport), 1 once its top has risen to 15% (never under the
  header): about half a viewport of scroll. The tangle holds for a beat
  after it is fully in view.
    p = 0    ten suppliers, each a bundle of 2 to 4 paper hairlines that
             starts at a tiny mono label (supplier · vanity metric),
             tangled and crossing
    p = 0.5  the strands straighten into evenly spaced lanes
    p = 1    they converge through the Plurel mark and leave as one
             braided strand (three plies; two on phones) to "One system ·
             one number"; the supplier names fade to 45%, metrics to 35%
  Narrow canvases (phones) draw six strands with shorter labels set above
  their lanes. Reduced motion draws the finished state once, with no
  ambient motion and the supplier labels a little stronger, since that
  still is all it shows. The loop runs only while the canvas is near the
  viewport, reads one rect per frame, and caps the pixel ratio at 2.
*/

export type BraidOptions = { reduced: boolean };

/** Lane order, top to bottom: the band's four (Paid, Search, Brand, Social) lead */
const SUPPLIERS_WIDE: readonly (readonly [string, string])[] = [
  ["Ads agency", "CTR 2.1%"],
  ["SEO agency", "Traffic +12%"],
  ["Brand studio", "Lift +4 pts"],
  ["Social team", "Views 1.4M"],
  ["PR firm", "Mentions 38"],
  ["Creators", "Reach 2.4M"],
  ["UGC", "Posts 410"],
  ["Web team", "PageSpeed 96"],
  ["Writers", "Articles 24/mo"],
  ["Analytics", "Sessions 84K"],
];
/** The same lead four; the shortest label last, where its lane climbs steepest */
const SUPPLIERS_NARROW: readonly (readonly [string, string])[] = [
  ["Ads", "CTR 2.1%"],
  ["SEO", "Traffic +12%"],
  ["Brand", "Lift +4 pts"],
  ["Social", "Views 1.4M"],
  ["PR", "Mentions 38"],
  ["UGC", "Posts 410"],
];
const END_LABEL = "One system · one number";
/** The same label, stacked under the braid's end where the strip is narrow */
const END_LINES_NARROW = ["One system", "One number"];

/** Below this canvas width: six strands, short labels set above the lanes */
const NARROW_W = 560;
/** Progress 0: the canvas bottom at this fraction of the viewport height */
const P_START = 0.99;
/** Progress 1: the canvas top at this fraction, at least P_END_MIN px down */
const P_END = 0.15;
const P_END_MIN = 88;
/** Even a stretched scrub never ends with the canvas under the floating header */
const P_END_FLOOR = 70;
/** The shortest scrub, as a fraction of the viewport (short landscape screens) */
const P_SPAN_MIN = 0.42;
/** Stage windows in progress units: hold the tangle, untangle, then converge */
const UNTANGLE: readonly [number, number] = [0.04, 0.46];
const CONVERGE: readonly [number, number] = [0.52, 0.96];
/** Fraction of each strand's samples that runs up to the mark */
const SN = 0.4;

const PAPER = "251,250,246";
const BLUSH = "242,201,191";

const TAU = Math.PI * 2;
const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ss = (t: number) => t * t * (3 - 2 * t);
const s5 = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const rgba = (c: string, a: number) => `rgba(${c},${a.toFixed(3)})`;
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
  /** Phase in the braid: strands share one of PLIES phases, so it reads as a plait */
  ph: number;
  /** Lane, top to bottom: the supplier's place in the list */
  lane: number;
  broken: boolean;
  fray: boolean;
  /** This frame: centre line, normals, bundle width, twist, untangle amount */
  X: Float32Array;
  Y: Float32Array;
  NX: Float32Array;
  NY: Float32Array;
  Wd: Float32Array;
  Fc: Float32Array;
  E: Float32Array;
};

type Pulse = { i: number; off: number; spd: number };

export function mountBraid(canvas: HTMLCanvasElement, opts: BraidOptions): () => void {
  const ctx2d = canvas.getContext("2d");
  if (!ctx2d) return () => {};
  const ctx: CanvasRenderingContext2D = ctx2d;
  const reduced = opts.reduced;

  /* Layout, in CSS pixels */
  let W = 0;
  let H = 0;
  let DPR = 1;
  let narrow = false;
  let family = "ui-monospace, monospace";
  let fs = 11;
  let capH = 8;
  let N = 200;
  let n = 0;
  let S: Strand[] = [];
  let laneY = new Float32Array(0);
  let stepB = new Float32Array(0);
  let pulses: Pulse[] = [];
  let xL = 0;
  let xR = 0;
  let xN = 0;
  let xE = 0;
  let xC = 0;
  let yc = 0;
  let endW = 0;
  let endLines: string[] = [];
  let wA = 4.6;
  let wB = 2.6;
  let AMP = 4.5;
  let LAM = 54;
  let RAMP = 28;
  let OUT = 70;
  let LW = 0.8;
  let markS = 20;
  let ready = false;

  const setFont = () => {
    ctx.font = `400 ${fs}px ${family}`;
    // Mono metadata tracking (Meta: 0.03em), where canvas supports it
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${(fs * 0.03).toFixed(2)}px`;
  };

  /** Lane x for sample fraction s: the first SN of samples reach the mark */
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
    narrow = W < NARROW_W;
    family = getComputedStyle(canvas).fontFamily || family;
    fs = narrow ? 10 : 11;
    capH = Math.round(fs * 0.73);
    setFont();

    const list = narrow ? SUPPLIERS_NARROW : SUPPLIERS_WIDE;
    n = list.length;
    N = narrow ? 150 : 200;
    wA = narrow ? 3.6 : 4.6;
    wB = narrow ? 2.2 : 2.6;
    AMP = narrow ? 3.6 : 5.5;
    LAM = narrow ? 40 : 84;
    RAMP = narrow ? 18 : 28;
    LW = narrow ? 0.75 : 0.8;
    markS = narrow ? 15 : 20;
    endLines = (narrow ? END_LINES_NARROW : [END_LABEL]).map((l) => l.toUpperCase());
    endW = Math.max(...endLines.map((l) => ctx.measureText(l).width));

    if (!S.length || S.length !== n || S[0].X.length !== N) {
      S = list.map(([name, metric], i) => ({
        name: name.toUpperCase(),
        metric: ` · ${metric}`.toUpperCase(),
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
      }));
    }
    let labMax = 0;
    for (const sd of S) {
      sd.nameW = ctx.measureText(sd.name).width;
      sd.labW = sd.nameW + ctx.measureText(sd.metric).width;
      labMax = Math.max(labMax, sd.labW);
    }

    laneY = new Float32Array(n);
    if (narrow) {
      // Labels sit above their lanes; the braid and its label take the right
      const top = 24;
      const bot = H - 18;
      for (let i = 0; i < n; i++) laneY[i] = Math.round(top + ((bot - top) * i) / (n - 1)) + 0.5;
      xL = 1;
      xR = W - 1;
      // Room for the end point's pulse ring (radius up to 12) inside the canvas
      xE = W - 13;
      xN = Math.round(W * 0.58);
      // Late enough that no strand bends under another lane's label
      xC = Math.round(W * 0.3);
    } else {
      // Labels in a right-aligned column; lanes start at a common spine. The
      // first label's baseline (canvas y 11) sits on the caption's first
      // baseline (Meta: 11px mono on a 1.375 line), when they share a row
      const top = 6;
      const bot = H - 11;
      for (let i = 0; i < n; i++) laneY[i] = Math.round(top + ((bot - top) * i) / (n - 1)) + 0.5;
      // The longest label starts flush with the canvas edge (a grid column)
      xL = Math.round(labMax + 10);
      xR = W - 1;
      xE = Math.round(W - endW - 22);
      xN = Math.round(xL + (xE - xL) * 0.38);
      xC = xL + (xN - xL) * 0.06;
    }
    yc = Math.round((laneY[0] + laneY[n - 1]) / 2) + 0.5;
    OUT = Math.min(90, (xE - xN) * 0.28);

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
    const T0 = 4;
    const B0 = H - 4;

    // Scatter the labels (best of many candidates, never overlapping), each
    // with its strand's start point. Rows are jittered but keep the lane
    // order, top to bottom, so the labels sort into their lanes without
    // ever passing over one another; only the x is free
    type Box = { l: number; t: number; r: number; b: number };
    const boxOf = (sd: Strand, x0: number, y0: number): Box =>
      narrow
        ? { l: x0 - 4, t: y0 - 8 - capH - 6, r: x0 + sd.labW + 6, b: y0 + 5 }
        : { l: x0 - 14 - sd.labW, t: y0 - capH / 2 - 7, r: x0 + 24, b: y0 + capH / 2 + 7 };
    const yTop = narrow ? capH + 16 : 12;
    const yBot = narrow ? H - 14 : H - 12;
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
          : sd.labW + 16 + R() * Math.max(0, W * 0.86 - sd.labW - 16);
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
      // Strands leave the mark as a few plies (three; two on phones), each
      // a group of strands in step, so the braid stays legible at 1x
      const plies = narrow ? 2 : 3;
      sd.ph = (TAU * (i % plies)) / plies;
    }
    pulses = [];
    const np = narrow ? 5 : 8;
    for (let k = 0; k < np; k++) pulses.push({ i: (k * 7) % n, off: R(), spd: 0.05 + R() * 0.045 });
  }

  /* The converged path: into the mark, then braided to the end point */
  let gy = 0;
  let gw = 0;
  function converged(i: number, x: number, t: number) {
    if (x <= xN) {
      const k = s5(clamp((x - xC) / (xN - xC)));
      gy = lerp(laneY[S[i].lane], yc, k);
      gw = lerp(wB, 0.4, k);
      return;
    }
    const xb = x - xN;
    const a = AMP * s5(clamp(xb / RAMP)) * (1 - s5(clamp((x - (xE - OUT)) / OUT)));
    gy = yc + a * Math.sin((TAU * xb) / LAM + S[i].ph - t * 1.1);
    gw = 0.4;
  }

  function computeStrand(i: number, q1: number, q2: number, t: number) {
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
      const x0 = lerp(sd.ax, xL, s5(clamp((q1 - 0.35) / 0.65)));
      const y0 = lerp(sd.ay, ly, s5(clamp(q1 / 0.55)));
      // The lane runs from wherever the start is now to the right edge
      const span = (xR - x0) / (xR - xL);
      const e0 = eAt(0);
      let x = x0;
      let y = y0;
      X[0] = x;
      Y[0] = y;
      E[0] = e0;
      for (let k = 0; k < last; k++) {
        const s = k / last;
        const e = eAt(s);
        const drift = t ? 0.07 * Math.sin(t * 0.45 + i * 1.7 + s * 4) * (1 - e) : 0;
        const a = lerp(sd.thA[k] + drift, sd.thT, e);
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
      // Soft walls, so drifting strands stay inside the strip
      const lo = 3;
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
        Fc[k] = lerp(Math.cos(TAU * sd.twist * s + sd.twist0 - t * 0.5), 1, e);
        const fray = sd.fray ? 2.2 * ss(clamp((s - 0.84) / 0.16)) : 0;
        Wd[k] = lerp(wA * (1 + fray), wB, e);
      }
    } else {
      // Lanes to one system: converge from the left, braid, end at one point
      const ex = s5(clamp(q2 / 0.75));
      for (let k = 0; k <= last; k++) {
        const s = k / last;
        const e = s5(clamp((q2 - sd.dB - 0.3 * s) / 0.55));
        const x = lerp(xOf(s, xR), xOf(s, xE), ex);
        converged(i, x, t);
        X[k] = x;
        Y[k] = lerp(laneY[sd.lane], gy, e);
        Wd[k] = lerp(wB, gw, e);
        Fc[k] = 1;
        E[k] = 1;
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

  /** Where a supplier's label sits, from its strand's start point */
  const labelAt = (sd: Strand) =>
    narrow
      ? { x: Math.round(sd.X[0] - 1), y: Math.round(sd.Y[0] - 8) }
      : { x: Math.round(sd.X[0] - 10 - sd.labW), y: Math.round(sd.Y[0] + capH / 2) };

  function draw(p: number, t: number) {
    if (!ready) return;
    const q1 = clamp((p - UNTANGLE[0]) / (UNTANGLE[1] - UNTANGLE[0]));
    const q2 = clamp((p - CONVERGE[0]) / (CONVERGE[1] - CONVERGE[0]));
    const last = N - 1;
    for (let i = 0; i < n; i++) computeStrand(i, q1, q2, t);

    const c = ctx;
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    c.clearRect(0, 0, W, H);
    c.lineJoin = "round";
    c.lineCap = "butt";

    /* the strands: 2 to 4 hairlines a bundle */
    c.lineWidth = LW;
    c.strokeStyle = rgba(PAPER, 1);
    const baseA = q2 > 0 ? lerp(0.5, 0.46, q2) : lerp(0.44, 0.5, q1);
    for (let i = 0; i < n; i++) {
      const sd = S[i];
      const { X, Y, NX, NY, Wd, Fc } = sd;
      c.globalAlpha = Math.min(1, baseA * sd.alpha);
      c.beginPath();
      for (let j = 0; j < sd.K; j++) {
        const uj = sd.u[j];
        const kmax = sd.se[j] < 1 ? Math.floor(lerp(sd.se[j], 1, sd.E[last]) * last) : last;
        for (let k = 0; k <= kmax; k++) {
          const o = uj * Wd[k] * Fc[k];
          const px = X[k] + NX[k] * o;
          const py = Y[k] + NY[k] * o;
          if (k) c.lineTo(px, py);
          else c.moveTo(px, py);
        }
      }
      c.stroke();
    }

    /* a start tick across each bundle */
    c.globalAlpha = 0.8;
    c.lineWidth = 1;
    c.beginPath();
    for (let i = 0; i < n; i++) {
      const sd = S[i];
      const h = sd.Wd[0] + 2.5;
      c.moveTo(sd.X[0] - sd.NX[0] * h, sd.Y[0] - sd.NY[0] * h);
      c.lineTo(sd.X[0] + sd.NX[0] * h, sd.Y[0] + sd.NY[0] * h);
    }
    c.stroke();

    /* broken ends in the tangle: a small blush cross where a strand stops */
    c.strokeStyle = rgba(BLUSH, 1);
    for (let i = 0; i < n; i++) {
      const sd = S[i];
      if (!sd.broken) continue;
      const a = 0.9 * (1 - sd.E[last]);
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
      c.globalAlpha = laneEnd * 0.7;
      c.strokeStyle = rgba(PAPER, 1);
      c.beginPath();
      for (let i = 0; i < n; i++) {
        const sd = S[i];
        const h = sd.Wd[last] + 2.5;
        const x = Math.round(sd.X[last]) - 0.5;
        c.moveTo(x, sd.Y[last] - h);
        c.lineTo(x, sd.Y[last] + h);
      }
      c.stroke();
    }

    /* ambient pulses travelling along the strands */
    if (t && pulses.length) {
      const trail = narrow ? 9 : 12;
      c.lineWidth = 1.1;
      for (const pu of pulses) {
        const s = ((t * pu.spd + pu.off) % 1) * 1.2 - 0.1;
        if (s < 0 || s > 1) continue;
        const sd = S[pu.i];
        const kk = Math.round(s * last);
        const a = Math.pow(Math.sin(Math.PI * s), 0.6) * 0.75;
        const { X, Y } = sd;
        const k0 = Math.max(0, kk - trail);
        const g = c.createLinearGradient(X[k0], Y[k0], X[kk], Y[kk]);
        g.addColorStop(0, rgba(PAPER, 0));
        g.addColorStop(1, rgba(PAPER, a));
        c.globalAlpha = 1;
        c.strokeStyle = g;
        c.beginPath();
        for (let k = k0; k <= kk; k++) {
          if (k === k0) c.moveTo(X[k], Y[k]);
          else c.lineTo(X[k], Y[k]);
        }
        c.stroke();
        c.fillStyle = rgba(PAPER, Math.min(1, a * 1.2));
        c.fillRect(X[kk] - 1.25, Y[kk] - 1.25, 2.5, 2.5);
      }
    }

    /* knockouts: the red shows through behind every label and the mark */
    // Supplier labels fade as the system forms; reduced motion only ever
    // shows this end state, so there they stay a little stronger
    const fade = ss(clamp((q2 - 0.15) / 0.6));
    // Reduced motion only ever shows the end state, so its labels stay
    // fully legible (paper on brand red is about 4.8:1)
    const nameOp = reduced ? 1 : lerp(1, 0.45, fade);
    const metOp = reduced ? 1 : lerp(1, 0.35, fade);
    // On phones the converging strands climb through the label rows: once
    // they start to bend, the labels stop cutting them, so they pass
    // cleanly behind the fading type instead of being chopped
    const kLab = narrow ? 1 - ss(clamp(q2 / 0.4)) : 1;
    const kNode = s5(clamp((q2 - 0.3) / 0.45));
    const kEnd = ss(clamp((q2 - 0.62) / 0.34));
    const pad = Math.round(markS * 0.45);
    const mx = Math.round(xN - markS / 2);
    const my = Math.round(yc - markS / 2);
    // End label: after the end point, or stacked under it, right-aligned
    const endX = narrow ? Math.round(xE + 3 - endW) : Math.round(xE + 13);
    const endY = narrow ? Math.round(yc + 14 + capH) : Math.round(yc + capH / 2);
    const lineH = capH + 6;
    const endH = capH + (endLines.length - 1) * lineH;
    c.globalCompositeOperation = "destination-out";
    c.fillStyle = "#000";
    if (kLab > 0.01) {
      c.globalAlpha = kLab;
      for (let i = 0; i < n; i++) {
        const sd = S[i];
        const { x, y } = labelAt(sd);
        c.fillRect(x - 4, y - capH - 4, sd.labW + 8, capH + 8);
      }
    }
    if (kNode > 0.01) {
      c.globalAlpha = kNode;
      c.fillRect(mx - pad, my - pad, markS + pad * 2, markS + pad * 2);
    }
    if (kEnd > 0.01) {
      c.globalAlpha = kEnd;
      c.fillRect(endX - 5, endY - capH - 5, endW + 10, endH + 10);
    }
    c.globalCompositeOperation = "source-over";

    /* the Plurel mark where the strands meet */
    if (kNode > 0.01) {
      c.globalAlpha = kNode * 0.5;
      c.strokeStyle = rgba(PAPER, 1);
      c.lineWidth = 1;
      c.strokeRect(mx - pad + 0.5, my - pad + 0.5, markS + pad * 2 - 1, markS + pad * 2 - 1);
      c.globalAlpha = kNode;
      c.fillStyle = rgba(PAPER, 1);
      const u = markS / 10;
      for (const [cx, cy, cw, ch] of MARK_CELLS) c.fillRect(mx + cx * u, my + cy * u, cw * u, ch * u);
    }

    /* the end point: one strand, one number */
    if (kEnd > 0.01) {
      const ex = Math.round(xE);
      const ey = Math.round(yc);
      if (t) {
        const ph = (t / 2.6) % 1;
        const r = 3 + ph * 9;
        c.globalAlpha = kEnd * 0.6 * (1 - ph);
        c.strokeStyle = rgba(BLUSH, 1);
        c.lineWidth = 1;
        c.strokeRect(ex - r + 0.5, ey - r + 0.5, r * 2 - 1, r * 2 - 1);
      }
      c.globalAlpha = kEnd;
      c.fillStyle = rgba(PAPER, 1);
      c.fillRect(ex - 3, ey - 3, 6, 6);
    }

    /* labels: supplier in paper, vanity metric in blush */
    setFont();
    c.textBaseline = "alphabetic";
    c.textAlign = "left";
    for (let i = 0; i < n; i++) {
      const sd = S[i];
      const { x, y } = labelAt(sd);
      c.globalAlpha = nameOp;
      c.fillStyle = rgba(PAPER, 0.95);
      c.fillText(sd.name, x, y);
      c.globalAlpha = metOp;
      c.fillStyle = reduced ? rgba(PAPER, 0.95) : rgba(BLUSH, 0.95);
      c.fillText(sd.metric, x + sd.nameW, y);
    }
    if (kEnd > 0.01) {
      c.globalAlpha = kEnd;
      c.fillStyle = rgba(PAPER, 1);
      c.textAlign = narrow ? "right" : "left";
      const ax = narrow ? endX + endW : endX;
      endLines.forEach((l, k) => c.fillText(l, ax, endY + k * lineH));
      c.textAlign = "left";
    }
    c.globalAlpha = 1;
  }

  /* progress, loop, observers */
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
    // Canvas top at progress 1, then at progress 0 (the whole strip in view).
    // On short screens, stretch the scrub to its minimum from both ends
    let end = Math.max(P_END_MIN, vh * P_END);
    let start = vh * P_START - r.height;
    const short = vh * P_SPAN_MIN - (start - end);
    if (short > 0) {
      const room = Math.min(short / 2, Math.max(0, end - P_END_FLOOR));
      end -= room;
      start += short - room;
    }
    return clamp((start - r.top) / (start - end));
  };

  const tick = (now: number) => {
    raf = 0;
    if (!visible || disposed) return;
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    const goal = target();
    // A short glide, so wheel steps read as motion rather than jumps
    p = shown < 0 ? goal : p + (goal - p) * (1 - Math.exp(-dt * 10));
    if (Math.abs(goal - p) < 0.0005) p = goal;
    draw(p, now / 1000);
    shown = p;
    raf = requestAnimationFrame(tick);
  };
  const start = () => {
    if (reduced) {
      draw(1, 0);
      return;
    }
    if (visible && !raf && !disposed) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  };
  // Lay out again only when the size or the label face has changed
  let key = "";
  const refresh = () => {
    if (disposed) return;
    const fam = getComputedStyle(canvas).fontFamily;
    ctx.font = `400 11px ${fam}`;
    const k = `${canvas.clientWidth}x${canvas.clientHeight}@${window.devicePixelRatio}:${fam}:${ctx.measureText(END_LABEL).width}`;
    if (k === key) return;
    key = k;
    relayout();
    if (reduced) draw(1, 0);
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
  const ro = new ResizeObserver(refresh);
  ro.observe(canvas);

  // Labels are measured in the mono face: lay out again once it has loaded
  const fonts = document.fonts;
  const onFonts = () => refresh();
  if (fonts) {
    void fonts.load(`400 11px ${getComputedStyle(canvas).fontFamily}`).then(onFonts, () => {});
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
    fonts?.removeEventListener?.("loadingdone", onFonts);
  };
}
