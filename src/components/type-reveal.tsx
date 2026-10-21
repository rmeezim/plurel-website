"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type RefObject,
} from "react";

/*
  One type-reveal vocabulary for the whole site. Every category rises; none
  bounces, blurs, scales or overshoots. The rise is a long exponential
  ease-out, cubic-bezier(0.16, 1, 0.3, 1), so a word clears its mask in a
  breath and spends the rest of its time settling.

  Category  Used for                     What moves                          Timing
  --------  ---------------------------  ----------------------------------  ------------------------------------
  hero      the h1, from first paint     words, each out of its own mask     1.1s a word, 65ms apart, the next
            (onLoad)                                                         line 70ms later; the light Accent
                                                                             waits 120ms more and takes 1.4s
  display   chapter h2s                  words, each out of its own mask     1.0s a word, 32ms apart, the next
                                                                             line 80ms later: one wave
  title     smaller heads: h3s and       words, 0.4em up with opacity,       0.8s (opacity 0.6s), 22ms apart,
            display-set lines            no mask                             the next line 60ms later
  chars     names set as display words   letters, out of their word's mask   0.95s a letter, 24ms apart
  kicker    the chapter label (Kicker)   the square scales in, then the      0.55s; the label from +110ms
                                         label slides 0.5em in and fades     over 0.9s (opacity 0.7s)

  Body copy stays on Reveal (fade-up, 0.75s). The hero's kicker, copy,
  action and glass are timed to its headline in hero.tsx.

  Rules. Transforms and opacity only; the masks are clip-paths with room
  for accents above and descenders below, so finished type is never cut,
  even at the hero's tight leading, and nothing shifts. The motion lives
  in globals.css ("Type reveal") behind prefers-reduced-motion, screen
  media and html[data-js]: no JS, reduced motion, print, and anything
  already on screen when the page hydrates get finished type. A head
  below the fold arms after hydration and plays once, when it comes an
  eighth of the way up the screen (or the page can scroll no further).

  Reading. Chrome's accessibility tree drops the spaces between word (or
  letter) boxes from the text it exposes: a head's computed name keeps
  them, but its text runs together ("Buyersdecide...") and letters read
  one by one ("T h e"). So every variant carries its words once as plain
  text, visually hidden (sr-only, not selectable, so a copy takes the
  visible words), and hides the animated boxes from assistive tech. The
  boxes keep plain spaces between them, so they still set, wrap, select
  and copy as one sentence.
*/

export type RevealSegment =
  | string
  | {
      text: string;
      className?: string;
      /** Set in the light Accent (an <em>) and arrive last, a touch slower */
      accent?: boolean;
    };

/** A line: one string, or segments (joined with a space) with their own class */
export type RevealLine = string | readonly RevealSegment[];

export type TypeRevealProps = {
  as?: "h1" | "h2" | "h3" | "p" | "span";
  id?: string;
  className?: string;
  /** The line breaks: each line is a block */
  lines: readonly RevealLine[];
  /** "display" for chapter heads, "title" for smaller heads, "chars" for names */
  variant?: "display" | "title" | "chars";
  /** Play from the first paint, in CSS (the hero) instead of on entering the screen */
  onLoad?: boolean;
  /** Milliseconds before the first word (or letter) moves */
  delay?: number;
  /** An extra class for each line, by index (e.g. to tone the second line) */
  lineClassName?: readonly (string | undefined)[];
};

type Variant = NonNullable<TypeRevealProps["variant"]>;
type Css = CSSProperties & Record<`--${string}`, string | number>;

/** Stagger in ms: between units, and the extra wait before each new line */
const RHYTHM: Record<Variant | "hero", { step: number; line: number }> = {
  hero: { step: 65, line: 70 },
  display: { step: 32, line: 80 },
  title: { step: 22, line: 60 },
  chars: { step: 24, line: 60 },
};
/** The Accent's extra wait (its longer duration is in globals.css) */
const ACCENT_WAIT = 120;

/* ---------- Arrival: armed below the fold, in once on screen ---------- */

export type Arrival = "idle" | "armed" | "in";

/* One observer for every head and label on the page. A head is let in
   when its top comes 12% above the bottom of the screen, or, on a page
   that cannot scroll that far, once the reader reaches the end. */
const waiting = new Map<Element, () => void>();
let observer: IntersectionObserver | undefined;

function letIn(el: Element) {
  const done = waiting.get(el);
  forget(el);
  done?.();
}

function forget(el: Element) {
  if (!waiting.delete(el)) return;
  observer?.unobserve(el);
  if (!waiting.size) window.removeEventListener("scroll", atEnd);
}

function atEnd() {
  const doc = document.documentElement;
  if (window.scrollY + window.innerHeight < doc.scrollHeight - 2) return;
  for (const el of [...waiting.keys()]) {
    if (el.getBoundingClientRect().top < window.innerHeight) letIn(el);
  }
}

function watch(el: Element, done: () => void) {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) letIn(entry.target);
    },
    { rootMargin: "0px 0px -12% 0px" },
  );
  if (!waiting.size) window.addEventListener("scroll", atEnd, { passive: true });
  waiting.set(el, done);
  observer.observe(el);
  return () => forget(el);
}

/** Motion is allowed on this screen (the same test the CSS makes) */
function motionAllowed() {
  return window.matchMedia("screen and (prefers-reduced-motion: no-preference)").matches;
}

/**
 * "armed" when the element starts below the fold (after hydration, motion
 * allowed), then "in" the first time it comes on screen. Anything on
 * screen, or above it, at mount stays "idle": finished and still.
 */
export function useArrival(ref: RefObject<HTMLElement | null>, enabled = true): Arrival {
  const [state, setState] = useState<Arrival>("idle");
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || !motionAllowed()) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setState("armed");
    return watch(el, () => setState("in"));
  }, [enabled, ref]);
  return state;
}

/**
 * A wrapper that carries its arrival as data-arrive ("armed", then "in")
 * for CSS to animate, so server markup inside it (the Kicker) can arrive
 * without becoming a client component. Renders plain without JS.
 */
export function Arrive({
  as = "div",
  className,
  children,
}: {
  as?: "div" | "p" | "span";
  className?: string;
  children: ReactNode;
}) {
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement>(null);
  const state = useArrival(ref);
  return (
    <Tag ref={ref} className={className} data-arrive={state === "idle" ? undefined : state}>
      {children}
    </Tag>
  );
}

/* ---------- TypeReveal ---------- */

type Seg = { text: string; className?: string; accent?: boolean };

function segments(line: RevealLine): Seg[] {
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
    seg ? Array.from(seg.segment(word), (g) => g.segment) : Array.from(word);
})();

export function TypeReveal({
  as = "h2",
  id,
  className = "",
  lines,
  variant = "display",
  onLoad = false,
  delay = 0,
  lineClassName = [],
}: TypeRevealProps) {
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement>(null);
  const arrival = useArrival(ref, !onLoad);

  const rhythm = RHYTHM[onLoad && variant === "display" ? "hero" : variant];
  const chars = variant === "chars";
  const parsed = lines.map(segments);

  // One running index across the head, so the wave carries over lines
  let unit = 0;
  const words = (seg: Seg, li: number) => {
    const list = seg.text.split(/\s+/);
    return list.map((word, wi) => {
      const parts = chars ? graphemes(word) : [word];
      const node = (
        <span key={wi} className="tr-w">
          {parts.map((part, pi) => {
            const t = delay + li * rhythm.line + unit++ * rhythm.step + (seg.accent ? ACCENT_WAIT : 0);
            return (
              <span key={pi} className="tr-u" style={{ "--t": `${t}ms` } as Css}>
                {part}
              </span>
            );
          })}
        </span>
      );
      return wi < list.length - 1 ? [node, " "] : node;
    });
  };

  const body = parsed.map((segs, li) => [
    li > 0 ? " " : null,
    <span key={li} className={`tr-line${lineClassName[li] ? ` ${lineClassName[li]}` : ""}`}>
      {segs.map((seg, si) => {
        const inner = words(seg, li);
        const node = seg.accent ? (
          <em key={si} className={`type-accent tr-accent not-italic${seg.className ? ` ${seg.className}` : ""}`}>
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
      data-variant={variant}
      data-state={onLoad ? "load" : arrival}
    >
      <span className="sr-only select-none">{plain}</span>
      <span aria-hidden="true">{body}</span>
    </Tag>
  );
}
