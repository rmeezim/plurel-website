import type { CSSProperties } from "react";

/**
 * Interior headlines, plotted: each word is drawn left to right in reading
 * order at one steady pace (`word-in`, the type reveal's sweep), the pen
 * crossing each space in one character's time, so a longer word takes
 * longer and the speed never changes. Pure CSS: safe in server components,
 * and under reduced motion the words simply render (the animation class
 * only exists inside the no-preference media block).
 *
 * For headlines built from several styled segments, pass the running word
 * `offset` so later segments continue where the earlier ones stopped
 * (counted as six characters a word).
 */

/** Milliseconds per character: the hero's pace */
const PACE = 26;
/** An earlier segment's word, with its space, in characters */
const WORD = 6;

/** Each word's start and length, ms, on one clock */
function schedule(words: string[], start: number) {
  let clock = start;
  return words.map((word, i) => {
    if (i > 0) clock += PACE;
    const timed = { word, t: Math.round(clock), d: Array.from(word).length * PACE };
    clock += timed.d;
    return timed;
  });
}

export function Cascade({
  text,
  base = 0,
  offset = 0,
}: {
  text: string;
  /** Seconds before the pen starts on the whole headline */
  base?: number;
  /** @deprecated the pace is fixed now; ignored */
  step?: number;
  /** Number of words rendered by earlier segments of the same headline */
  offset?: number;
}) {
  const words = schedule(text.split(/\s+/).filter(Boolean), base * 1000 + offset * WORD * PACE);
  return (
    <>
      {words.map(({ word, t, d }, i) => (
        <span key={i}>
          {i > 0 && " "}
          <span className="word-in" style={{ "--t": `${t}ms`, "--d": `${d}ms` } as CSSProperties}>
            <span>{word}</span>
          </span>
        </span>
      ))}
    </>
  );
}
