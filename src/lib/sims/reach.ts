import { clamp, logNormal, normal, pick, rng, span } from "@/lib/sim";

/*
  The Reach engagement's instrument (console/reach.tsx): the amplification
  rules, run on a simulated quarter. Each week a batch of cuts of one idea
  goes out over three days; each is followed for seven days against the
  account's usual post, and the rules decide what it earns:

    under 1x after 7 days      retired; what it taught goes into the brief
    1x to 2x                   kept running, no money behind it yet
    2x or more within 48 hours paid goes behind it the same day
    5x for 3 days              its budget doubles; creators answer it
    10x or more                press briefed; search and answers get a page

  The batches learn: each week's brief keeps what the last one taught, so
  the median cut drifts up over the quarter (the floor rises). Seeded, so
  every visitor sees the same quarter. Numbers are illustrative.
*/

export const WEEKS = 13;
export const CUTS = 16;
/** Hours a batch is followed: posted over three days, each cut watched for seven */
export const SPAN = 240;
export const POSTING = 72;
export const LO = 0.25;
export const HI = 20;
export const THRESHOLDS = [1, 2, 5, 10] as const;

export type Status = "running" | "kept" | "retired" | "paid" | "doubled" | "press";
export type RuleKey = "retire" | "keep" | "paid" | "double" | "press";

export type Cut = {
  id: string;
  /** Hour of the batch it went out */
  posted: number;
  format: string;
  hook: string;
  /** Its multiple of the usual post, hour by hour of the batch (NaN before it went out) */
  obs: Float32Array;
  paidAt: number | null;
  doubledAt: number | null;
  pressAt: number | null;
  retiredAt: number | null;
  keptAt: number | null;
};

export type Event = { at: number; cut: string; rule: RuleKey; x: number };

export type Batch = { week: number; cuts: Cut[]; events: Event[]; median: number; best: number };

const FORMATS = ["Vertical, 0:15", "Vertical, 0:21", "Vertical, 0:34", "Carousel, 6 frames", "Square, 0:12", "Creator duet, 0:28", "Stitch, 0:19", "Still with caption"];
const HOOKS = ["The price nobody shows", "What we got wrong", "Ten seconds in the factory", "The question we hear most", "Before and after", "Why it costs what it costs", "The founder answers", "What reviewers missed"];

function runBatch(week: number): Batch {
  const r = rng(9173 + week * 7919);
  // the brief learns: the median cut rises a little each week
  const mu = Math.log(0.72) + 0.042 * week;
  const cuts: Cut[] = [];
  const events: Event[] = [];
  for (let i = 0; i < CUTS; i++) {
    const posted = Math.min(POSTING - 1, Math.round((i * POSTING) / CUTS + r() * 3));
    const m = clamp(logNormal(r, mu, 0.82), 0.18, 9);
    const wobble = normal(r) * 0.42;
    const obs = new Float32Array(SPAN + 1).fill(Number.NaN);
    const cut: Cut = {
      id: `Cut ${String(i + 1).padStart(2, "0")}`,
      posted,
      format: pick(r, FORMATS),
      hook: pick(r, HOOKS),
      obs,
      paidAt: null,
      doubledAt: null,
      pressAt: null,
      retiredAt: null,
      keptAt: null,
    };
    let above5 = 0;
    let jitter = 0;
    for (let h = posted; h <= SPAN; h++) {
      const age = h - posted;
      // early reads are noisy; a cut settles on its own multiple, with the
      // hour-to-hour jitter of a real count
      jitter = 0.86 * jitter + 0.035 * normal(r);
      let v = m * Math.exp(wobble * Math.exp(-age / 16) + jitter * (0.4 + 0.6 * Math.exp(-age / 60)));
      if (cut.paidAt != null) v *= 1 + 0.55 * span(h - cut.paidAt, 0, 24);
      if (cut.doubledAt != null) v *= 1 + 0.35 * span(h - cut.doubledAt, 0, 24);
      v = clamp(v, LO * 1.02, HI * 0.98);
      obs[h] = v;
      if (cut.retiredAt != null) continue;
      if (cut.paidAt == null && age <= 48 && age >= 6 && v >= 2) {
        cut.paidAt = h;
        events.push({ at: h, cut: cut.id, rule: "paid", x: v });
      }
      if (cut.paidAt != null && cut.doubledAt == null) {
        above5 = v >= 5 ? above5 + 1 : 0;
        if (above5 >= 72) {
          cut.doubledAt = h;
          events.push({ at: h, cut: cut.id, rule: "double", x: v });
        }
      }
      if (cut.pressAt == null && v >= 10) {
        cut.pressAt = h;
        events.push({ at: h, cut: cut.id, rule: "press", x: v });
      }
      if (age === 168 && cut.paidAt == null) {
        if (v < 1) {
          cut.retiredAt = h;
          events.push({ at: h, cut: cut.id, rule: "retire", x: v });
        } else {
          cut.keptAt = h;
          events.push({ at: h, cut: cut.id, rule: "keep", x: v });
        }
      }
    }
    cuts.push(cut);
  }
  events.sort((a, b) => a.at - b.at);
  const finals = cuts.map((c) => c.obs[SPAN]).sort((a, b) => a - b);
  return { week, cuts, events, median: (finals[7] + finals[8]) / 2, best: finals[finals.length - 1] };
}

let quarter: Batch[] | null = null;
/** The simulated quarter, thirteen batches */
export function reachQuarter(): Batch[] {
  if (!quarter) quarter = Array.from({ length: WEEKS }, (_, w) => runBatch(w));
  return quarter;
}

/** A cut's status at an hour of its batch */
export function statusAt(c: Cut, h: number): Status {
  if (c.pressAt != null && h >= c.pressAt) return "press";
  if (c.doubledAt != null && h >= c.doubledAt) return "doubled";
  if (c.paidAt != null && h >= c.paidAt) return "paid";
  if (c.retiredAt != null && h >= c.retiredAt) return "retired";
  if (c.keptAt != null && h >= c.keptAt) return "kept";
  return "running";
}

/** Which rule a status answers to, for the ladder's filter */
export const STATUS_RULE: Record<Status, RuleKey | null> = {
  running: null,
  kept: "keep",
  retired: "retire",
  paid: "paid",
  doubled: "double",
  press: "press",
};

/** The rules, in the order they are read, with what each one does */
export const RULES: readonly { key: RuleKey; when: string; then: string }[] = [
  { key: "retire", when: "Under 1× after 7 days", then: "Retired. What it taught goes into next week’s brief." },
  { key: "keep", when: "1× to 2×", then: "Kept running, with no money behind it yet." },
  { key: "paid", when: "2× or more within 48 hours", then: "Paid goes behind it the same day, aimed at people like the ones who watched it through." },
  { key: "double", when: "5× for 3 days, under target cost", then: "Its budget doubles, and two creators are briefed to answer it in their own words." },
  { key: "press", when: "10× or more", then: "Press is briefed within a day, and search and AI answers get a page ready for the people it brings." },
];
