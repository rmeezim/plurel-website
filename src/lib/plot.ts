/*
  The clock of plotted type (components/type-reveal.tsx): how long the pen
  takes over each word of a head, and when it finishes. Pure, so a server
  component can time what lights after a head (PageHead lights its
  standfirst once the h1 is drawn) from the same numbers the head is
  drawn with.
*/

export type RevealSegment =
  | string
  | {
      text: string;
      className?: string;
      /** Set in the quieter Accent (an <em>), after a short lift of the pen */
      accent?: boolean;
    };

/** A line: one string, or segments (joined with a space) with their own class */
export type RevealLine = string | readonly RevealSegment[];

/** Milliseconds per character */
export const PACE = { hero: 30, display: 18, title: 11 } as const;
/** A new line: the pen returns */
const RETURN = 60;
/** Before the Accent: the pen lifts */
const LIFT = 120;

export type Seg = { text: string; className?: string; accent?: boolean };

export function segments(line: RevealLine): Seg[] {
  const list = typeof line === "string" ? [line] : line;
  return list
    .map((s) => (typeof s === "string" ? { text: s } : s))
    .map((s) => ({ ...s, text: s.text.trim() }))
    .filter((s) => s.text);
}

const graphemes = (() => {
  const seg =
    typeof Intl !== "undefined" && "Segmenter" in Intl
      ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
      : undefined;
  return (word: string) =>
    seg ? Array.from(seg.segment(word), (g) => g.segment).length : Array.from(word).length;
})();

type Timed = { text: string; t: number; d: number };
export type TimedSeg = Omit<Seg, "text"> & { words: Timed[] };

/** Where the pen is at each word: one clock across the head, each word starting where the last ended */
export function schedule(lines: Seg[][], pen: number, delay: number) {
  let clock = delay;
  const timed = lines.map((segs, li) => {
    if (li > 0) clock += RETURN;
    return segs.map((seg, si): TimedSeg => {
      if (seg.accent) clock += LIFT;
      const words = seg.text.split(/\s+/).map((text, wi) => {
        if (si > 0 || wi > 0) clock += pen;
        const word = { text, t: clock, d: graphemes(text) * pen };
        clock += word.d;
        return word;
      });
      return { className: seg.className, accent: seg.accent, words };
    });
  });
  return { timed, total: clock };
}

/** When the pen lifts off a head plotted at `pace`, starting after `delay`, in ms */
export function plotEnd(lines: readonly RevealLine[], pace: number, delay = 0): number {
  return schedule(lines.map(segments), pace, delay).total;
}
