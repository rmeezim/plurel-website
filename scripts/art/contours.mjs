#!/usr/bin/env node
/*
  Plurel's contour fields: the ground buyers decide on, surveyed.

  Each seed is a piece of synthetic terrain: broad landforms from
  domain-warped fractal noise, a summit or two, then rain (a droplet
  erosion model) that cuts gullies into the slopes and leaves spurs and
  saddles between them. It is drawn the way a survey sheet draws ground:
  contours at a fixed interval, every fifth one an index contour, a little
  heavier. One static SVG per seed goes to public/art/, used as a CSS mask
  over a token-colored layer (src/components/art.tsx), so the files carry
  no color of their own.

  The terrain is periodic: the field wraps around like a torus, so a tile
  meets its neighbor with no seam. Each file stamps one tile 5 x 4 across a
  single sheet (8000 x 6400 px), which the page shows once at one fixed
  scale (1 SVG px = 1 CSS px) with no CSS repeat: never stretched, so its
  hairlines stay hairlines, and painted as plain vector in every engine.

  Usage:  node scripts/art/contours.mjs            (every seed)
          node scripts/art/contours.mjs 3 4        (just these)
  Deterministic: a seed always draws the same field. If the tile, the
  sheet, the interval or a summit moves, update TILE, SHEET, INTERVAL and
  SUMMIT in src/components/art.tsx from the printed summary.
*/

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "public", "art");
const SEEDS = [1, 2, 3, 4, 5, 6];

/** The sheet: tile size in CSS px and the survey's own numbers */
const TILE = { w: 1600, h: 1600 };
const CELL = 4; // survey grid, px
const INTERVAL = 4; // contour interval, in the sheet's units
const LEVELS = 16; // contours per field: 12 to 18 reads as surveyed, not wavy
const INDEX_EVERY = 5; // every fifth contour is an index contour
const UNITS = 4; // path coordinates in quarter pixels, written as integers
const SHEET = { cols: 5, rows: 4 }; // tiles per file: covers any chapter up to wide screens

/** The ground */
const WARP = 0.13; // how far the landforms flow, in tiles
const BASE_GAIN = 0.42; // falloff of the finer octaves: lower is calmer
const PEAK = { height: 0.7, radius: 210 }; // the main summit (px); a lesser one beside it
const TEXTURE = 0.01; // fine ground texture

/** The rain */
const RAIN = {
  cell: 8, // erosion grid, px
  drops: 100000,
  radius: 4, // erosion brush, cells
  inertia: 0.15,
  capacity: 4,
  minCapacity: 0.01,
  deposit: 0.3,
  erode: 0.3,
  evaporate: 0.015,
  gravity: 4,
  steps: 48,
};
const SOFTEN = 1.8; // blur after the rain, in survey cells

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

/* ------------------------------------------------------------------ */
/* The ground                                                          */
/* ------------------------------------------------------------------ */

/** Distance on the torus, in px */
function torus(x, y, px, py) {
  let dx = Math.abs(x - px);
  let dy = Math.abs(y - py);
  dx = Math.min(dx, 1 - dx) * TILE.w;
  dy = Math.min(dy, 1 - dy) * TILE.h;
  return Math.hypot(dx, dy);
}

/** Height at (x, y) in tile units, before the rain */
function terrain(seed) {
  const rand = mulberry32(seed * 7919 + 104729);
  const fx = (f) => Math.max(1, Math.round((f * TILE.w) / TILE.h));
  const warpA = octaves(rand, fx(1), 1, 3);
  const warpB = octaves(rand, fx(1), 1, 3);
  const base = octaves(rand, fx(2), 2, 4);
  // draws once spent on a drainage layer the rain replaced, so every seed
  // keeps the ground it was chosen for
  octaves(rand, fx(3), 3, 2);
  const texture = octaves(rand, fx(8), 8, 3);

  // a summit and a lesser one, placed on the torus so they tile too
  const peaks = [0, 1].map((k) => ({
    x: rand(),
    y: rand(),
    a: PEAK.height * (k === 0 ? 1 : 0.55 + rand() * 0.25),
    r: PEAK.radius * (k === 0 ? 1 : 0.7 + rand() * 0.2),
  }));

  return (x, y) => {
    const X = x + WARP * fbm(warpA, x, y, 0.5);
    const Y = y + WARP * fbm(warpB, x, y, 0.5);
    let h = fbm(base, X, Y, BASE_GAIN);
    for (const p of peaks) {
      const t = torus(X, Y, p.x, p.y) / p.r;
      h += p.a * Math.exp(-t * t * 0.5);
    }
    return h + TEXTURE * fbm(texture, X, Y, 0.5);
  };
}

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
 * Rain (after Hans Theobald Beyer's droplet model): each drop runs
 * downhill, picks up ground while it speeds up and drops it where it
 * slows, which cuts gullies into the slopes and leaves spurs between them.
 * Drops wrap around the tile, so the eroded ground still tiles.
 */
function rain(v, N, M, rand) {
  const mod = (a, n) => ((a % n) + n) % n;
  const idx = (i, j) => mod(j, M) * N + mod(i, N);
  const brush = [];
  let wsum = 0;
  for (let dy = -RAIN.radius; dy <= RAIN.radius; dy++) {
    for (let dx = -RAIN.radius; dx <= RAIN.radius; dx++) {
      const d = Math.hypot(dx, dy);
      if (d < RAIN.radius) {
        brush.push([dx, dy, 1 - d / RAIN.radius]);
        wsum += 1 - d / RAIN.radius;
      }
    }
  }
  for (const b of brush) b[2] /= wsum;

  // height and gradient, bilinear
  const at = (x, y) => {
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

  for (let n = 0; n < RAIN.drops; n++) {
    let x = rand() * N;
    let y = rand() * M;
    let dx = 0;
    let dy = 0;
    let speed = 1;
    let water = 1;
    let sediment = 0;
    for (let step = 0; step < RAIN.steps; step++) {
      const i = Math.floor(x);
      const j = Math.floor(y);
      const u = x - i;
      const w = y - j;
      const [h, gx, gy] = at(x, y);
      dx = dx * RAIN.inertia - gx * (1 - RAIN.inertia);
      dy = dy * RAIN.inertia - gy * (1 - RAIN.inertia);
      const len = Math.hypot(dx, dy);
      if (len < 1e-12) break;
      dx /= len;
      dy /= len;
      x += dx;
      y += dy;
      const dh = at(x, y)[0] - h;
      const capacity = Math.max(-dh * speed * water * RAIN.capacity, RAIN.minCapacity);
      if (sediment > capacity || dh > 0) {
        // uphill or overloaded: leave ground behind
        const amount = dh > 0 ? Math.min(dh, sediment) : (sediment - capacity) * RAIN.deposit;
        sediment -= amount;
        v[idx(i, j)] += amount * (1 - u) * (1 - w);
        v[idx(i + 1, j)] += amount * u * (1 - w);
        v[idx(i, j + 1)] += amount * (1 - u) * w;
        v[idx(i + 1, j + 1)] += amount * u * w;
      } else {
        // downhill with room to carry: cut into the slope
        const amount = Math.min((capacity - sediment) * RAIN.erode, -dh);
        for (const [bx, by, bw] of brush) {
          v[idx(i + bx, j + by)] -= amount * bw;
          sediment += amount * bw;
        }
      }
      speed = Math.sqrt(Math.max(0, speed * speed - dh * RAIN.gravity)); // faster downhill
      water *= 1 - RAIN.evaporate;
    }
  }
  return v;
}

/** Periodic Catmull-Rom upsampling from the rain's grid to the survey grid */
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
function soften(v, N, M, sigma) {
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

/** The surveyed ground: heights on the survey grid, in the sheet's units */
function ground(seed) {
  const N = TILE.w / CELL;
  const M = TILE.h / CELL;
  const n = TILE.w / RAIN.cell;
  const m = TILE.h / RAIN.cell;
  const h = terrain(seed);
  const coarse = new Float64Array(n * m);
  for (let j = 0; j < m; j++) {
    for (let i = 0; i < n; i++) coarse[j * n + i] = h(i / n, j / m);
  }
  rain(normalize(coarse), n, m, mulberry32(seed * 31337 + 7));
  const v = normalize(soften(upsample(coarse, n, m, N, M), N, M, SOFTEN));
  const relief = INTERVAL * (LEVELS + 1);
  for (let k = 0; k < v.length; k++) v[k] *= relief;
  return { N, M, v };
}

/* ------------------------------------------------------------------ */
/* The survey: marching squares on the torus, chained into loops       */
/* ------------------------------------------------------------------ */

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
  const at = (i, j) => v[(j % M) * N + (i % N)];
  const pts = new Map();
  const cross = (id, i0, j0, i1, j1) => {
    if (pts.has(id)) return;
    const a = at(i0, j0);
    const b = at(i1, j1);
    if (a > level === b > level) return; // this edge isn't crossed
    const t = (level - a) / (b - a);
    pts.set(id, [(i0 + t * (i1 - i0)) * CELL, (j0 + t * (j1 - j0)) * CELL]);
  };

  const ends = new Map(); // edge id -> the two segments that meet on it
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
      cross(T, i, j, i + 1, j);
      cross(R, i + 1, j, i + 1, j + 1);
      cross(B, i, j + 1, i + 1, j + 1);
      cross(L, i, j, i, j + 1);
      const mid = (tl + tr + br + bl) / 4 > level; // settles the two saddle cases
      switch (c) {
        case 1: case 14: add(L, B); break;
        case 2: case 13: add(B, R); break;
        case 3: case 12: add(L, R); break;
        case 4: case 11: add(T, R); break;
        case 6: case 9: add(T, B); break;
        case 7: case 8: add(L, T); break;
        case 5: if (mid) { add(L, T); add(B, R); } else { add(T, R); add(L, B); } break;
        case 10: if (mid) { add(T, R); add(L, B); } else { add(L, T); add(B, R); } break;
      }
    }
  }

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
      const [a, b] = ends.get(edge);
      const next = a === prev ? b : a;
      used[next] = 1;
      const [e0, e1] = segs[next];
      edge = e0 === edge ? e1 : e0;
      prev = next;
    }
    // unwrap across the seam: each step is under a cell long, so the
    // nearest copy of the next point is the right one
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
    loops.push({
      points: out,
      shift: [Math.round((last[0] - out[0][0]) / W) * W, Math.round((last[1] - out[0][1]) / H) * H],
    });
  }
  return loops;
}

/* ------------------------------------------------------------------ */
/* Line work: smooth, simplify                                         */
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

function perimeter(pts) {
  let s = Math.hypot(pts[0][0] - pts.at(-1)[0], pts[0][1] - pts.at(-1)[1]);
  for (let k = 1; k < pts.length; k++) s += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
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
    const dx = pts[b][0] - ax;
    const dy = pts[b][1] - ay;
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

function simplify({ points: pts, shift }, eps) {
  if (shift[0] || shift[1]) {
    // one period of a line that wraps the tile: open, end = start + shift
    return { points: rdp([...pts, [pts[0][0] + shift[0], pts[0][1] + shift[1]]], eps), closed: false };
  }
  // a ring: split at the point farthest from the first
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
  let first = true;
  for (let k = 1; k < pts.length; k++) {
    const nx = q(pts[k][0] + dx);
    const ny = q(pts[k][1] + dy);
    const rx = nx - x;
    const ry = ny - y;
    if (rx === 0 && ry === 0) continue;
    const pair = `${rx}${ry < 0 ? "" : " "}${ry}`;
    d += first ? `l${pair}` : `${rx < 0 ? "" : " "}${pair}`;
    first = false;
    x = nx;
    y = ny;
  }
  return closed ? `${d}z` : d;
}

/** Every copy of a line that falls on the tile, so the wrap stays seamless */
function tileCopies(line, margin) {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const [x, y] of line.points) {
    x0 = Math.min(x0, x);
    x1 = Math.max(x1, x);
    y0 = Math.min(y0, y);
    y1 = Math.max(y1, y);
  }
  const out = [];
  for (let a = -2; a <= 2; a++) {
    for (let b = -2; b <= 2; b++) {
      const dx = a * TILE.w;
      const dy = b * TILE.h;
      if (x1 + dx < -margin || x0 + dx > TILE.w + margin) continue;
      if (y1 + dy < -margin || y0 + dy > TILE.h + margin) continue;
      out.push(pathData(line.points, line.closed, dx, dy));
    }
  }
  return out;
}

function survey(seed) {
  const field = ground(seed);
  let top = 0;
  for (let k = 1; k < field.v.length; k++) if (field.v[k] > field.v[top]) top = k;
  const summit = [(top % field.N) * CELL, Math.floor(top / field.N) * CELL];

  const regular = [];
  const index = [];
  for (let n = 1; n <= LEVELS; n++) {
    for (const raw of contour(field, n * INTERVAL + 1e-7)) {
      const ring = !raw.shift[0] && !raw.shift[1];
      if (ring && perimeter(raw.points) < 40) continue; // specks read as noise
      const line = simplify(smooth(raw), 0.35);
      if (line.points.length < 3) continue;
      (n % INDEX_EVERY === 0 ? index : regular).push(...tileCopies(line, 3));
    }
  }
  // One tile, stamped across the sheet: the sheet is drawn once with no CSS
  // repeat, so every engine paints it as clipped vector instead of
  // rasterizing a whole tile per paint for a repeating pattern
  const tile =
    `<symbol id="f" viewBox="0 0 ${TILE.w * UNITS} ${TILE.h * UNITS}" overflow="hidden">` +
    `<g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round">` +
    `<path stroke-width="${UNITS}" stroke-opacity=".62" d="${regular.join("")}"/>` +
    `<path stroke-width="${UNITS * 1.7}" d="${index.join("")}"/>` +
    `</g></symbol>`;
  let stamps = "";
  for (let j = 0; j < SHEET.rows; j++) {
    for (let i = 0; i < SHEET.cols; i++) {
      const at = `${i ? ` x="${i * TILE.w}"` : ""}${j ? ` y="${j * TILE.h}"` : ""}`;
      stamps += `<use href="#f"${at} width="${TILE.w}" height="${TILE.h}"/>`;
    }
  }
  const W = TILE.w * SHEET.cols;
  const H = TILE.h * SHEET.rows;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${tile}${stamps}</svg>\n`;
  return { svg, summit };
}

const only = process.argv.slice(2).map(Number).filter(Boolean);
mkdirSync(OUT, { recursive: true });
for (const seed of only.length ? only : SEEDS) {
  const { svg, summit } = survey(seed);
  writeFileSync(join(OUT, `contours-${seed}.svg`), svg);
  console.log(`contours-${seed}.svg  ${(svg.length / 1024).toFixed(1)} KB  summit at [${summit}]`);
}
