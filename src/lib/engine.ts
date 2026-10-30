import { normal, rng } from "@/lib/sim";

/*
  The homepage engine (components/home/engine.tsx): the market, as a
  field of buyers, absorbed by the system in five beats as the reader
  scrolls. Pure: every buyer's place in every beat is laid out here,
  seeded, so the drawing only interpolates between them by progress.

  1. The market: buyers clustered around the brands they think of first.
  2. The surfaces: the same buyers sorted by where they decide (AI
     answers, search, creators, reviews, stores, word of mouth, social,
     press), each surface a column.
  3. Ingestion: the Plurel System under them; every surface streams into
     the Ledger, counted once.
  4. Absorption: the system acts on every surface at once, and buyers who
     were someone else's start choosing you.
  5. One number: your buyers go into the Ledger as the one number; the
     surfaces, the layers and the streams stay, to be explored.

  Field coordinates are fractions of the field's width (x) and height
  (y). Illustrative: the shares are a drawing's, not a market's.
*/

export const SURFACES = ["AI answers", "Search", "Creators", "Reviews", "Stores", "Word of mouth", "Social", "Press"] as const;
const SURFACE_WEIGHT = [0.15, 0.2, 0.14, 0.12, 0.12, 0.1, 0.1, 0.07];

export const BRANDS = [
  { name: "Brand A", at: [0.22, 0.32] as const, share: 0.33, tone: 0.78 },
  { name: "Brand B", at: [0.66, 0.24] as const, share: 0.27, tone: 0.55 },
  { name: "Brand C", at: [0.38, 0.68] as const, share: 0.22, tone: 0.38 },
  { name: "You", at: [0.82, 0.66] as const, share: 0.06, tone: 1 },
] as const;
const UNDECIDED = 0.12;
export const YOU = 3;
export const NONE = 4;

export const N = 560;
/** The share of buyers who come to choose you by the end (on top of your own) */
export const CONVERT = 0.17;

/** The field's bands: where the lanes stand, where the streams run, where the System sits */
export const LANE_FOOT = 0.5;
export const LANE_TOP = 0.11;
export const SYSTEM_TOP = 0.62;
export const BAR_H = 0.058;
export const BAR_GAP = 0.016;
export const LAYERS = ["Narrative", "Create", "Distribute", "Measure"] as const;
export const barY = (i: number) => SYSTEM_TOP + i * (BAR_H + BAR_GAP);
export const laneX = (i: number) => 0.07 + (i * 0.86) / (SURFACES.length - 1);

/** The beats, as spans of the chapter's progress */
export const BEATS = [0, 0.17, 0.37, 0.58, 0.79, 1] as const;

export type Buyer = {
  brand: number;
  surface: number;
  /** comes to choose you in beat 4 */
  turns: boolean;
  /** when, within a beat, this buyer moves (a stagger) */
  lag: number;
  market: [number, number];
  lane: [number, number];
  ledger: [number, number];
};

const pickWeighted = (r: () => number, w: readonly number[]) => {
  let x = r() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < w.length; i++) {
    x -= w[i];
    if (x <= 0) return i;
  }
  return w.length - 1;
};

let cache: { buyers: Buyer[]; laneCount: number[]; youShare: [number, number] } | null = null;

export function market() {
  if (cache) return cache;
  const r = rng(90211);
  const brandW = [...BRANDS.map((b) => b.share), UNDECIDED];
  const buyers: Buyer[] = [];
  for (let i = 0; i < N; i++) {
    const brand = pickWeighted(r, brandW);
    const surface = pickWeighted(r, SURFACE_WEIGHT);
    const at = brand < 4 ? BRANDS[brand].at : ([0.1 + r() * 0.8, 0.1 + r() * 0.8] as const);
    const spread = brand === YOU ? 0.045 : brand === NONE ? 0 : 0.085;
    buyers.push({
      brand,
      surface,
      turns: false,
      lag: r() * 0.4,
      market: [Math.min(0.97, Math.max(0.03, at[0] + normal(r) * spread * 0.8)), Math.min(0.95, Math.max(0.05, at[1] + normal(r) * spread))],
      lane: [0, 0],
      ledger: [0, 0],
    });
  }
  // who turns: buyers of the others (and the undecided), spread over every surface
  const others = buyers.map((b, i) => ({ b, i, k: r() })).filter((x) => x.b.brand !== YOU);
  others.sort((a, b) => a.k - b.k);
  const turnN = Math.round(N * CONVERT);
  for (let k = 0; k < turnN; k++) others[k].b.turns = true;

  // the lanes: each surface a column of buyers, stacked up from the foot,
  // yours at the foot (nearest the System)
  const laneCount = SURFACES.map(() => 0);
  const bySurface = SURFACES.map((_, s) => buyers.filter((b) => b.surface === s));
  const cols = 5;
  const tallest = Math.max(...bySurface.map((l) => Math.ceil(l.length / cols)));
  const dy = (LANE_FOOT - LANE_TOP) / tallest;
  bySurface.forEach((lane, s) => {
    lane.sort((a, b) => (a.brand === YOU ? 0 : a.turns ? 1 : 2) - (b.brand === YOU ? 0 : b.turns ? 1 : 2) || a.brand - b.brand);
    lane.forEach((b, k) => {
      const col = k % cols;
      const row = Math.floor(k / cols);
      b.lane = [laneX(s) + (col - (cols - 1) / 2) * 0.0118, LANE_FOOT - row * dy];
    });
    laneCount[s] = lane.length;
  });

  // the Ledger: your buyers, as one block in the Measure layer
  const yours = buyers.filter((b) => b.brand === YOU || b.turns);
  const lcols = 40;
  yours.forEach((b, k) => {
    const col = k % lcols;
    const row = Math.floor(k / lcols);
    b.ledger = [0.52 + col * 0.0105, barY(3) + 0.012 + row * 0.0125];
  });
  const own = buyers.filter((b) => b.brand === YOU).length / N;
  cache = { buyers, laneCount, youShare: [own, own + turnN / N] };
  return cache;
}

/** Progress within beat i (0 to 1), from the chapter's progress */
export const within = (p: number, i: number) => Math.min(1, Math.max(0, (p - BEATS[i]) / (BEATS[i + 1] - BEATS[i])));
