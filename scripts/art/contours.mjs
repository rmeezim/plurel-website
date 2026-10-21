#!/usr/bin/env node
/*
  Plurel's contour fields: the terrain buyers decide on, surveyed.

  Each seed is a piece of synthetic terrain (domain-warped fractal noise,
  a ridged layer for spurs and crests, and a summit or two), drawn the way
  a survey sheet draws it: contours at a fixed interval, every fifth one
  an index contour, slightly heavier. The output is one static SVG per
  seed in public/art/, used as a CSS mask over a token-colored layer
  (src/components/art.tsx), so the files carry no color of their own.

  The terrain is periodic: the field wraps around like a torus, so a tile
  repeats edge to edge with no seam and covers a chapter of any height at
  one fixed scale (1 SVG px = 1 CSS px). The SVG is drawn at that scale and
  never stretched, so its hairlines stay hairlines.

  Usage:  node scripts/art/contours.mjs            (all seeds)
          node scripts/art/contours.mjs 3 5        (just these seeds)
  Deterministic: the same seed always draws the same field.
*/

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = join(ROOT, "public", "art");

/** Tile size in CSS px, the sampling cell, and the survey's own numbers */
const TILE = { w: 1600, h: 1600 };
const CELL = 4; // marching-squares cell, px
const INTERVAL = 4; // contour interval, in the sheet's own units
const LEVELS = 16; // contours per field (12 to 18 reads as surveyed, not wavy)
const INDEX_EVERY = 5; // every fifth contour is an index contour
const UNITS = 4; // path coordinates in quarter pixels, written as integers

const SEEDS = [1, 2, 3, 4, 5, 6];

/* ------------------------------------------------------------------ */
/* Seeded randomness and periodic gradient noise                       */
/* ------------------------------------------------------------------ */

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Perlin gradient noise on a px x py lattice that wraps, so it tiles */
function periodicPerlin(rand, px, py) {
  const n = px * py;
  const gx = new Float64Array(n);
  const gy = new Float64Array(n);
  for (let k = 0; k < n; k++) {
    const a = rand() * Math.PI * 2;
    gx[k] = Math.cos(a);
    gy[k] = Math.sin(a);
  }
  return (u, v) => {
    const iu = Math.floor(u);
    const iv = Math.floor(v);
    const fu = u - iu;
    const fv = v - iv;
    const i0 = ((iu % px) + px) % px;
    const j0 = ((iv % py) + py) % py;
    const i1 = (i0 + 1) % px;
    const j1 = (j0 + 1) % py;
    const k00 = j0 * px + i0;
    const k10 = j0 * px + i1;
    const k01 = j1 * px + i0;
    const k11 = j1 * px + i1;
    const n00 = gx[k00] * fu + gy[k00] * fv;
    const n10 = gx[k10] * (fu - 1) + gy[k10] * fv;
    const n01 = gx[k01] * fu + gy[k01] * (fv - 1);
    const n11 = gx[k11] * (fu - 1) + gy[k11] * (fv - 1);
    const su = fu * fu * fu * (fu * (fu * 6 - 15) + 10);
    const sv = fv * fv * fv * (fv * (fv * 6 - 15) + 10);
    const a = n00 + su * (n10 - n00);
    const b = n01 + su * (n11 - n01);
    return (a + sv * (b - a)) * Math.SQRT2;
  };
}

/** Octaves at doubling integer frequencies, each periodic over the tile */
function octaves(rand, fx, fy, count) {
  return Array.from({ length: count }, (_, k) => {
    const ox = fx * 2 ** k;
    const oy = fy * 2 ** k;
    return { fx: ox, fy: oy, n: periodicPerlin(rand, ox, oy) };
  });
}

function fbm(stack, x, y, gain) {
  let s = 0;
  let amp = 1;
  let norm = 0;
  for (const o of stack) {
    s += amp * o.n(x * o.fx, y * o.fy);
    norm += amp;
    amp *= gain;
  }
  return s / norm;
}

/** Ridged multifractal: sharp crests where the noise crosses zero */
function ridged(stack, x, y, gain) {
  let s = 0;
  let amp = 1;
  let norm = 0;
  let weight = 1;
  for (const o of stack) {
    let r = 1 - Math.abs(o.n(x * o.fx, y * o.fy));
    r *= r;
    r *= weight;
    weight = Math.min(1, Math.max(0, r * 1.5));
    s += amp * r;
    norm += amp;
    amp *= gain;
  }
  return s / norm;
}

/* ------------------------------------------------------------------ */
/* The terrain                                                         */
/* ------------------------------------------------------------------ */

const R = (k, d) => Number(process.env[k] ?? d);
const P = {
  warp: R("WARP", 0.1),
  baseGain: R("BASEGAIN", 0.42),
  baseOct: R("BASEOCT", 4),
  peakA: R("PEAKA", 0.55),
  peakR: R("PEAKR", 190),
  valley: R("VALLEY", 0.12),
  valleyPow: R("VALLEYPOW", 6),
  detail: R("DETAIL", 0.03),
  shape: R("SHAPE", 1),
  peaks: R("PEAKS", 2),
};

/** Distance on the torus, in px */
function torus(x, y, px, py) {
  let dx = Math.abs(x - px);
  let dy = Math.abs(y - py);
  dx = Math.min(dx, 1 - dx) * TILE.w;
  dy = Math.min(dy, 1 - dy) * TILE.h;
  return Math.hypot(dx, dy);
}

function terrain(seed) {
  const rand = mulberry32(seed * 7919 + 104729);
  const aspect = TILE.w / TILE.h;
  const fx = (f) => Math.max(1, Math.round(f * aspect));
  const warpA = octaves(rand, fx(1), 1, 3);
  const warpB = octaves(rand, fx(1), 1, 3);
  const base = octaves(rand, fx(2), 2, P.baseOct);
  const valley = octaves(rand, fx(3), 3, 2);
  const detail = octaves(rand, fx(8), 8, 3);

  // a summit or two, placed on the torus so they tile like everything else
  const peaks = Array.from({ length: P.peaks }, (_, k) => ({
    x: rand(),
    y: rand(),
    a: P.peakA * (k === 0 ? 1 : 0.55 + rand() * 0.25),
    r: P.peakR * (k === 0 ? 1 : 0.7 + rand() * 0.2),
  }));

  return (x, y) => {
    const X = x + P.warp * fbm(warpA, x, y, 0.5);
    const Y = y + P.warp * fbm(warpB, x, y, 0.5);
    let h = fbm(base, X, Y, P.baseGain); // the broad landforms
    for (const p of peaks) {
      const t = torus(X, Y, p.x, p.y) / p.r;
      h += p.a * Math.exp(-t * t * 0.5);
    }
    const v = 1 - Math.abs(fbm(valley, X, Y, 0.5)); // drainage where the noise crosses zero
    h -= P.valley * v ** P.valleyPow;
    h += P.detail * fbm(detail, X, Y, 0.5); // ground texture
    return h;
  };
}

/* ------------------------------------------------------------------ */
/* Survey: sample, contour (marching squares on the torus), chain      */
/* ------------------------------------------------------------------ */

const E = {
  cell: R("ECELL", 8), // erosion grid, px
  drops: R("DROPS", 60000),
  radius: R("ERADIUS", 3),
  blur: R("BLUR", 1),
  relief: R("ERELIEF", 1), // steeper ground cuts deeper valleys
};

function normalize(v) {
  let lo = Infinity;
  let hi = -Infinity;
  for (const z of v) {
    if (z < lo) lo = z;
    if (z > hi) hi = z;
  }
  for (let k = 0; k < v.length; k++) v[k] = (v[k] - lo) / (hi - lo);
  return v;
}

/**
 * Hydraulic erosion (after Hans Theobald Beyer's droplet model): rain
 * runs downhill, picks up ground on the slopes and drops it where it
 * slows, which cuts the valleys and leaves the spurs between them. The
 * droplets wrap around the tile, so the result still tiles.
 */
function erode(v, N, M, rand) {
  const mod = (a, n) => ((a % n) + n) % n;
  const idx = (i, j) => mod(j, M) * N + mod(i, N);
  const brush = [];
  let wsum = 0;
  const r = E.radius;
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      const d = Math.hypot(dx, dy);
      if (d < r) {
        brush.push([dx, dy, 1 - d / r]);
        wsum += 1 - d / r;
      }
    }
  }
  for (const b of brush) b[2] /= wsum;
  const inertia = R("INERTIA", 0.05);
  const capacityK = 4;
  const minCapacity = 0.01;
  const depositK = 0.3;
  const erodeK = 0.3;
  const evaporate = 0.015;
  const gravity = 4;
  const sampleAt = (x, y) => {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const u = x - i;
    const w = y - j;
    const a = v[idx(i, j)];
    const b = v[idx(i + 1, j)];
    const c = v[idx(i, j + 1)];
    const d = v[idx(i + 1, j + 1)];
    return [
      a * (1 - u) * (1 - w) + b * u * (1 - w) + c * (1 - u) * w + d * u * w,
      (b - a) * (1 - w) + (d - c) * w,
      (c - a) * (1 - u) + (d - b) * u,
    ];
  };
  for (let n = 0; n < E.drops; n++) {
    let x = rand() * N;
    let y = rand() * M;
    let dx = 0;
    let dy = 0;
    let speed = 1;
    let water = 1;
    let sediment = 0;
    for (let step = 0; step < 48; step++) {
      const i = Math.floor(x);
      const j = Math.floor(y);
      const u = x - i;
      const w = y - j;
      const [h, gx, gy] = sampleAt(x, y);
      dx = dx * inertia - gx * (1 - inertia);
      dy = dy * inertia - gy * (1 - inertia);
      const len = Math.hypot(dx, dy);
      if (len < 1e-12) break;
      dx /= len;
      dy /= len;
      x += dx;
      y += dy;
      const dh = sampleAt(x, y)[0] - h;
      const capacity = Math.max(-dh * speed * water * capacityK, minCapacity);
      if (sediment > capacity || dh > 0) {
        const amount = dh > 0 ? Math.min(dh, sediment) : (sediment - capacity) * depositK;
        sediment -= amount;
        v[idx(i, j)] += amount * (1 - u) * (1 - w);
        v[idx(i + 1, j)] += amount * u * (1 - w);
        v[idx(i, j + 1)] += amount * (1 - u) * w;
        v[idx(i + 1, j + 1)] += amount * u * w;
      } else {
        const amount = Math.min((capacity - sediment) * erodeK, -dh);
        for (const [bx, by, bw] of brush) {
          const k = idx(i + bx, j + by);
          const take = amount * bw;
          v[k] -= take;
          sediment += take;
        }
      }
      speed = Math.sqrt(Math.max(0, speed * speed - dh * gravity)); // faster downhill
      water *= 1 - evaporate;
    }
  }
  return v;
}

/** Periodic Catmull-Rom upsampling from the erosion grid to the survey grid */
function upsample(src, n, m, N, M) {
  const mod = (a, k) => ((a % k) + k) % k;
  const at = (i, j) => src[mod(j, m) * n + mod(i, n)];
  const cr = (p0, p1, p2, p3, t) =>
    p1 + 0.5 * t * (p2 - p0 + t * (2 * p0 - 5 * p1 + 4 * p2 - p3 + t * (3 * (p1 - p2) + p3 - p0)));
  const out = new Float64Array(N * M);
  for (let J = 0; J < M; J++) {
    const y = (J * m) / M;
    const j = Math.floor(y);
    const ty = y - j;
    for (let I = 0; I < N; I++) {
      const x = (I * n) / N;
      const i = Math.floor(x);
      const tx = x - i;
      const row = (jj) => cr(at(i - 1, jj), at(i, jj), at(i + 1, jj), at(i + 2, jj), tx);
      out[J * N + I] = cr(row(j - 1), row(j), row(j + 1), row(j + 2), ty);
    }
  }
  return out;
}

/** Periodic separable gaussian blur, sigma in cells */
function blur(v, N, M, sigma) {
  if (sigma <= 0) return v;
  const r = Math.ceil(sigma * 3);
  const k = Array.from({ length: 2 * r + 1 }, (_, t) => Math.exp(-((t - r) ** 2) / (2 * sigma * sigma)));
  const ks = k.reduce((a, b) => a + b, 0);
  const tmp = new Float64Array(v.length);
  for (let j = 0; j < M; j++) {
    for (let i = 0; i < N; i++) {
      let s = 0;
      for (let t = -r; t <= r; t++) s += k[t + r] * v[j * N + ((i + t + N) % N)];
      tmp[j * N + i] = s / ks;
    }
  }
  for (let j = 0; j < M; j++) {
    for (let i = 0; i < N; i++) {
      let s = 0;
      for (let t = -r; t <= r; t++) s += k[t + r] * tmp[((j + t + M) % M) * N + i];
      v[j * N + i] = s / ks;
    }
  }
  return v;
}

function sample(seed) {
  const N = TILE.w / CELL;
  const M = TILE.h / CELL;
  const n = TILE.w / E.cell;
  const m = TILE.h / E.cell;
  const h = terrain(seed);
  let coarse = new Float64Array(n * m);
  for (let j = 0; j < m; j++) {
    for (let i = 0; i < n; i++) coarse[j * n + i] = h(i / n, j / m);
  }
  coarse = normalize(coarse).map((z) => z * E.relief);
  if (E.drops > 0) erode(coarse, n, m, mulberry32(seed * 31337 + 7));
  const v = normalize(blur(upsample(coarse, n, m, N, M), N, M, E.blur));
  // to the sheet's elevations: valleys flatten out, slopes steepen toward
  // the crests, so the spacing varies the way real ground does
  const relief = INTERVAL * (LEVELS + 1);
  for (let k = 0; k < v.length; k++) v[k] = relief * Math.pow(v[k], P.shape);
  return { N, M, v, relief };
}

/**
 * Closed contour loops for one level. On the torus every crossing edge is
 * shared by exactly two cells, so every chain closes; a loop that wraps
 * around the tile comes back shifted by a whole tile (`shift`).
 */
function contour({ N, M, v }, level) {
  const W = TILE.w;
  const H = TILE.h;
  const hEdge = (i, j) => (j % M) * N + (i % N);
  const vEdge = (i, j) => N * M + (j % M) * N + (i % N);
  const pts = new Map();
  const at = (i, j) => v[(j % M) * N + (i % N)];

  const cross = (id, i0, j0, i1, j1) => {
    if (pts.has(id)) return;
    const a = at(i0, j0);
    const b = at(i1, j1);
    const t = (level - a) / (b - a);
    pts.set(id, [(i0 + t * (i1 - i0)) * CELL, (j0 + t * (j1 - j0)) * CELL]);
  };

  const ends = new Map(); // edge id -> [segment index, ...]
  const segs = [];
  const add = (e0, e1) => {
    const s = segs.length;
    segs.push([e0, e1]);
    for (const e of [e0, e1]) {
      const list = ends.get(e);
      if (list) list.push(s);
      else ends.set(e, [s]);
    }
  };

  for (let j = 0; j < M; j++) {
    for (let i = 0; i < N; i++) {
      const tl = at(i, j);
      const tr = at(i + 1, j);
      const br = at(i + 1, j + 1);
      const bl = at(i, j + 1);
      const c = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
      if (c === 0 || c === 15) continue;
      const T = hEdge(i, j);
      const R = vEdge(i + 1, j);
      const B = hEdge(i, j + 1);
      const L = vEdge(i, j);
      const need = (e) => {
        if (e === T) cross(T, i, j, i + 1, j);
        else if (e === R) cross(R, i + 1, j, i + 1, j + 1);
        else if (e === B) cross(B, i, j + 1, i + 1, j + 1);
        else cross(L, i, j, i, j + 1);
      };
      const seg = (a, b) => {
        need(a);
        need(b);
        add(a, b);
      };
      const mid = (tl + tr + br + bl) / 4 > level;
      switch (c) {
        case 1: case 14: seg(L, B); break;
        case 2: case 13: seg(B, R); break;
        case 3: case 12: seg(L, R); break;
        case 4: case 11: seg(T, R); break;
        case 6: case 9: seg(T, B); break;
        case 7: case 8: seg(L, T); break;
        case 5:
          if (mid) { seg(L, T); seg(B, R); } else { seg(T, R); seg(L, B); }
          break;
        case 10:
          if (mid) { seg(T, R); seg(L, B); } else { seg(L, T); seg(B, R); }
          break;
      }
    }
  }

  // Points sit on the tile's own coordinates; a crossing on the wrap edge
  // can read as x = W, which is the same place as x = 0
  const loops = [];
  const used = new Uint8Array(segs.length);
  for (let s0 = 0; s0 < segs.length; s0++) {
    if (used[s0]) continue;
    used[s0] = 1;
    const [start, first] = segs[s0];
    const ids = [start];
    let edge = first;
    let prev = s0;
    while (edge !== start) {
      ids.push(edge);
      const list = ends.get(edge);
      const next = list[0] === prev ? list[1] : list[0];
      used[next] = 1;
      const [a, b] = segs[next];
      edge = a === edge ? b : a;
      prev = next;
    }
    // unwrap: each step is under a cell long, so the nearest copy is right
    const out = [];
    let px = 0;
    let py = 0;
    for (let k = 0; k <= ids.length; k++) {
      let [x, y] = pts.get(ids[k % ids.length]);
      if (k > 0) {
        x += Math.round((px - x) / W) * W;
        y += Math.round((py - y) / H) * H;
      }
      out.push([x, y]);
      px = x;
      py = y;
    }
    const last = out.pop(); // the start again, possibly a tile over
    const shift = [Math.round((last[0] - out[0][0]) / W) * W, Math.round((last[1] - out[0][1]) / H) * H];
    loops.push({ points: out, shift });
  }
  return loops;
}

/* ------------------------------------------------------------------ */
/* Line work: smooth, simplify, measure                                */
/* ------------------------------------------------------------------ */

/** Cyclic neighbor, carrying the wrap shift across the seam */
function neighbor(pts, shift, k) {
  const n = pts.length;
  if (k < 0) return [pts[k + n][0] - shift[0], pts[k + n][1] - shift[1]];
  if (k >= n) return [pts[k - n][0] + shift[0], pts[k - n][1] + shift[1]];
  return pts[k];
}

/** Taubin smoothing: takes the grid's facets out without shrinking rings */
function smooth(loop, iterations = 6) {
  let pts = loop.points;
  const pass = (f) => {
    pts = pts.map((p, k) => {
      const a = neighbor(pts, loop.shift, k - 1);
      const b = neighbor(pts, loop.shift, k + 1);
      return [p[0] + f * ((a[0] + b[0]) / 2 - p[0]), p[1] + f * ((a[1] + b[1]) / 2 - p[1])];
    });
  };
  for (let i = 0; i < iterations; i++) {
    pass(0.5);
    pass(-0.53);
  }
  return { points: pts, shift: loop.shift };
}

function perimeter(pts, closed) {
  let s = 0;
  for (let k = 1; k < pts.length; k++) s += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
  if (closed) s += Math.hypot(pts[0][0] - pts.at(-1)[0], pts[0][1] - pts.at(-1)[1]);
  return s;
}

/** Ramer-Douglas-Peucker on an open run of points */
function rdp(pts, eps) {
  if (pts.length < 3) return pts.slice();
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1e-9;
    let worst = -1;
    let at = -1;
    for (let k = a + 1; k < b; k++) {
      const d = Math.abs((pts[k][0] - ax) * dy - (pts[k][1] - ay) * dx) / len;
      if (d > worst) {
        worst = d;
        at = k;
      }
    }
    if (worst > eps) {
      keep[at] = 1;
      stack.push([a, at], [at, b]);
    }
  }
  return pts.filter((_, k) => keep[k]);
}

function simplify(loop, eps) {
  const { points: pts, shift } = loop;
  const closed = shift[0] === 0 && shift[1] === 0;
  if (!closed) {
    // one period of a curve that wraps the tile: open, end = start + shift
    const run = [...pts, [pts[0][0] + shift[0], pts[0][1] + shift[1]]];
    return { points: rdp(run, eps), closed: false };
  }
  // closed ring: split at the point farthest from the first
  let far = 0;
  let best = -1;
  for (let k = 1; k < pts.length; k++) {
    const d = Math.hypot(pts[k][0] - pts[0][0], pts[k][1] - pts[0][1]);
    if (d > best) {
      best = d;
      far = k;
    }
  }
  const a = rdp(pts.slice(0, far + 1), eps);
  const b = rdp([...pts.slice(far), pts[0]], eps);
  return { points: [...a, ...b.slice(1, -1)], closed: true };
}

/* ------------------------------------------------------------------ */
/* SVG                                                                 */
/* ------------------------------------------------------------------ */

/** Compact path data in quarter-pixel integers, relative after the move */
function pathData(pts, closed, dx, dy) {
  const q = (n) => Math.round(n * UNITS);
  let x = q(pts[0][0] + dx);
  let y = q(pts[0][1] + dy);
  let d = `M${x} ${y}`;
  let cmd = "";
  for (let k = 1; k < pts.length; k++) {
    const nx = q(pts[k][0] + dx);
    const ny = q(pts[k][1] + dy);
    const rx = nx - x;
    const ry = ny - y;
    if (rx === 0 && ry === 0) continue;
    const pair = `${rx}${ry < 0 ? "" : " "}${ry}`;
    if (!cmd) {
      d += `l${pair}`;
      cmd = "l";
    } else {
      d += `${rx < 0 ? "" : " "}${pair}`;
    }
    x = nx;
    y = ny;
  }
  return closed ? `${d}z` : d;
}

/** Every copy of a line that the tile shows, so the wrap stays seamless */
function tileCopies(line, margin) {
  const W = TILE.w;
  const H = TILE.h;
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const [x, y] of line.points) {
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  const out = [];
  for (let a = -2; a <= 2; a++) {
    for (let b = -2; b <= 2; b++) {
      const dx = a * W;
      const dy = b * H;
      if (x1 + dx < -margin || x0 + dx > W + margin) continue;
      if (y1 + dy < -margin || y0 + dy > H + margin) continue;
      out.push(pathData(line.points, line.closed, dx, dy));
    }
  }
  return out;
}

function survey(seed) {
  const field = sample(seed);
  const regular = [];
  const index = [];
  let summit = { z: -Infinity, x: 0, y: 0 };
  for (let k = 0; k < field.v.length; k++) {
    if (field.v[k] > summit.z) {
      summit = { z: field.v[k], x: (k % field.N) * CELL, y: Math.floor(k / field.N) * CELL };
    }
  }
  let rings = 0;
  for (let n = 1; n <= LEVELS; n++) {
    const level = n * INTERVAL;
    const isIndex = n % INDEX_EVERY === 0;
    for (const raw of contour(field, level + 1e-7)) {
      const closed = raw.shift[0] === 0 && raw.shift[1] === 0;
      if (closed && perimeter(raw.points, true) < 40) continue; // specks read as noise
      const line = simplify(smooth(raw), 0.35);
      if (line.points.length < 3) continue;
      rings++;
      (isIndex ? index : regular).push(...tileCopies(line, 3));
    }
  }
  const W = TILE.w;
  const H = TILE.h;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W * UNITS} ${H * UNITS}" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round">` +
    `<path stroke-width="${UNITS}" stroke-opacity=".62" d="${regular.join("")}"/>` +
    `<path stroke-width="${UNITS * 1.7}" d="${index.join("")}"/>` +
    `</svg>\n`;
  return { svg, rings, summit, relief: field.relief };
}

const seeds = process.argv.slice(2).map(Number).filter(Boolean);
mkdirSync(OUT, { recursive: true });
for (const seed of seeds.length ? seeds : SEEDS) {
  const { svg, rings, summit } = survey(seed);
  const file = join(OUT, `contours-${seed}.svg`);
  writeFileSync(file, svg);
  console.log(
    `contours-${seed}.svg  ${(svg.length / 1024).toFixed(1)} KB  ${rings} lines  ` +
      `interval ${INTERVAL}, ${LEVELS} levels, summit ${summit.z.toFixed(0)} at ${summit.x},${summit.y}`,
  );
}
