/*
  The instruments' simulations (components/console): a seeded random
  source, so every visitor sees the same run and a reset replays it, and
  the few distributions and easings they draw from. Pure, so the runs can
  be tested and rendered on the server.
*/

export type Rand = () => number;

/** A seeded source of numbers in [0, 1) (mulberry32) */
export function rng(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A standard normal draw (Box-Muller) */
export function normal(r: Rand): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = r();
  while (v === 0) v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** A log-normal draw: its median is e^mu */
export function logNormal(r: Rand, mu: number, sigma: number): number {
  return Math.exp(mu + sigma * normal(r));
}

export function pick<T>(r: Rand, xs: readonly T[]): T {
  return xs[Math.floor(r() * xs.length) % xs.length];
}

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Where x sits between a and b, clamped to [0, 1] */
export const span = (x: number, a: number, b: number) => clamp((x - a) / (b - a));
/** A steady ease in and out, for values that settle (never a bounce) */
export const smooth = (t: number) => t * t * (3 - 2 * t);

/** A whole number with thousands separators, in tabular figures by the stylesheet */
export function fmt(n: number, digits = 0): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/** Simulated hours as "Day 3 · 14:00" */
export function dayClock(hours: number): string {
  const h = Math.max(0, Math.floor(hours));
  const day = Math.floor(h / 24) + 1;
  return `Day ${day} · ${String(h % 24).padStart(2, "0")}:00`;
}
