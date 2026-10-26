"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type RefObject,
} from "react";
import { inReadingOrder, motionAllowed, plot } from "@/lib/pen";
import { PACE, schedule, segments, type RevealLine } from "@/lib/plot";

/*
  One reveal vocabulary for the whole site, taken from instruments rather
  than slideshows: type is plotted, lines are drawn, and states light.

  - Type is plotted. A head is drawn left to right in reading order by a
    hard-edged sweep at one steady pace: each word is uncovered at a
    constant rate, the pen crosses each space in one character's time, a
    new line waits a short return, and the quieter Accent a short lift.
    A long line takes longer than a short one; the speed never changes.
    Nothing rises, fades, blurs, scales or bounces.
  - One pen (lib/pen.ts). Heads and labels that arrive together are
    plotted one after another in reading order, never all at once, and a
    block that lights (Reveal) waits for the head above it.
  - Lines are drawn at a steady rate too (rules, the route, bars: linear,
    in each chapter's own CSS), and states light: a node, a marker or a
    block of copy switches on by opacity alone and never travels.

  Pace      Used for                              ms per character
  --------  ------------------------------------  ------------------------
  hero      the h1, from first paint (onLoad)     30
  display   chapter h2s and names set large       18, or `pace`
  title     smaller heads and display-set lines   11

  Rules. Transforms only, so the compositor draws it even while the page
  is busy: each word is a window (.tr-w) sliding right over its own text
  (.tr-u), which slides left by exactly as much, so the type stands still
  while the window uncovers it. The window's clip reaches past the line
  box for accents, descenders and overhangs, so finished type is never
  cut, and nothing shifts. The motion lives in
  globals.css ("Type reveal") behind prefers-reduced-motion, screen media
  and html[data-js]: no JS, reduced motion, print, forced colors and
  anything already on screen when the page hydrates get finished type. A
  head below the fold arms after hydration and is plotted once, when it
  comes an eighth of the way up the screen (or the page can scroll no
  further) and the pen is free.

  Reading. Chrome's accessibility tree drops the spaces between word boxes
  from the text it exposes: a head's computed name keeps them, but its
  text runs together ("Buyersdecide..."). So every head carries its words
  once as plain text, visually hidden (sr-only, not selectable, so a copy
  takes the visible words), and hides the drawn words from assistive
  tech. The words keep plain spaces between them, so they still set,
  wrap, select and copy as one sentence.
*/

export type { RevealLine, RevealSegment } from "@/lib/plot";

export type TypeRevealProps = {
  as?: "h1" | "h2" | "h3" | "p" | "span";
  id?: string;
  className?: string;
  /** The line breaks: each line is a block */
  lines: readonly RevealLine[];
  /** "display" for chapter heads and names set large, "title" for smaller heads */
  variant?: "display" | "title";
  /** Milliseconds per character, in place of the variant's pace */
  pace?: number;
  /** Plot from the first paint, in CSS (the hero) instead of on entering the screen */
  onLoad?: boolean;
  /** Milliseconds before the pen starts */
  delay?: number;
  /** An extra class for each line, by index (e.g. to tone the second line) */
  lineClassName?: readonly (string | undefined)[];
};

type Css = CSSProperties & Record<`--${string}`, string | number>;

/* ---------- Arrival: armed below the fold, in once on screen ---------- */

export type Arrival = "idle" | "armed" | "in";

/* One observer for every head and label on the page. A head is let in
   when its top comes 12% above the bottom of the screen, or, on a page
   that cannot scroll that far, once the reader reaches the end; heads let
   in together queue for the pen in reading order. */
const waiting = new Map<Element, () => void>();
let observer: IntersectionObserver | undefined;

function letIn(el: Element) {
  const go = waiting.get(el);
  forget(el);
  go?.();
}

function forget(el: Element) {
  if (!waiting.delete(el)) return;
  observer?.unobserve(el);
  if (!waiting.size) window.removeEventListener("scroll", atEnd);
}

function atEnd() {
  const doc = document.documentElement;
  if (window.scrollY + window.innerHeight < doc.scrollHeight - 2) return;
  for (const el of [...waiting.keys()].sort(inReadingOrder)) {
    if (el.getBoundingClientRect().top < window.innerHeight) letIn(el);
  }
}

function watch(el: Element, hold: number, done: () => void) {
  let cancel = () => {};
  observer ??= new IntersectionObserver(
    (entries) => {
      const arriving = entries.filter((e) => e.isIntersecting).map((e) => e.target);
      for (const target of arriving.sort(inReadingOrder)) letIn(target);
    },
    { rootMargin: "0px 0px -12% 0px" },
  );
  if (!waiting.size) window.addEventListener("scroll", atEnd, { passive: true });
  waiting.set(el, () => {
    cancel = plot(el, hold, done);
  });
  observer.observe(el);
  return () => {
    forget(el);
    cancel();
  };
}

/**
 * "armed" when the element starts below the fold (after hydration, motion
 * allowed), then "in" the first time it comes on screen and the pen is
 * free; it then holds the pen for `hold` ms. Anything on screen, or above
 * it, at mount stays "idle": finished and still.
 */
export function useArrival(
  ref: RefObject<HTMLElement | null>,
  enabled = true,
  hold = 0,
): Arrival {
  const [state, setState] = useState<Arrival>("idle");
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || !motionAllowed()) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setState("armed");
    return watch(el, hold, () => setState("in"));
  }, [enabled, hold, ref]);
  return state;
}

/* ---------- TypeReveal ---------- */

export function TypeReveal({
  as = "h2",
  id,
  className = "",
  lines,
  variant = "display",
  pace,
  onLoad = false,
  delay = 0,
  lineClassName = [],
}: TypeRevealProps) {
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement>(null);

  const parsed = lines.map(segments);
  const { timed, total } = schedule(parsed, pace ?? PACE[onLoad ? "hero" : variant], delay);
  const arrival = useArrival(ref, !onLoad, total);

  const body = timed.map((segs, li) => [
    li > 0 ? " " : null,
    <span key={li} className={`tr-line${lineClassName[li] ? ` ${lineClassName[li]}` : ""}`}>
      {segs.map((seg, si) => {
        const inner = seg.words.map((w, wi) => {
          const node = (
            <span key={wi} className="tr-w" style={{ "--t": `${w.t}ms`, "--d": `${w.d}ms` } as Css}>
              <span className="tr-u">{w.text}</span>
            </span>
          );
          return wi < seg.words.length - 1 ? [node, " "] : node;
        });
        const node = seg.accent ? (
          <em key={si} className={`type-accent not-italic${seg.className ? ` ${seg.className}` : ""}`}>
            {inner}
          </em>
        ) : seg.className ? (
          <span key={si} className={seg.className}>
            {inner}
          </span>
        ) : (
          inner
        );
        return si > 0 ? [" ", node] : node;
      })}
    </span>,
  ]);

  const plain = parsed.map((segs) => segs.map((seg) => seg.text).join(" ")).join(" ");

  return (
    <Tag
      ref={ref}
      id={id}
      className={`type-reveal ${className}`}
      data-state={onLoad ? "load" : arrival}
    >
      <span className="sr-only select-none">{plain}</span>
      <span aria-hidden="true">{body}</span>
    </Tag>
  );
}
