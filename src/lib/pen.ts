/*
  The pen: the clock a chapter's entrances share, so things arriving
  together are drawn one after another, in reading order, rather than all
  at once. Each chapter (its <section>) has its own pen, so one chapter
  never waits on another. A plotted head holds the pen for as long as it
  takes to plot, a drawn figure (Why now's route) for as long as it draws,
  and a block that only lights (Reveal) waits for the pen without holding
  it. The pen only waits for strokes still on screen: one the reader has
  scrolled past lets go at once, so a quick scroll never stacks up delays.
  Nothing waits longer than MAX_WAIT.

  plot and motionAllowed are client only (performance.now, setTimeout,
  matchMedia): call them from effects. labelTime is pure.
*/

/** The longest anything waits for the pen, ms */
const MAX_WAIT = 2400;

/** The chapter label: ms per character, its shortest plot, and the beat after its square lights */
export const LABEL = { pace: 12, min: 180, beat: 60 } as const;

/** How long a chapter label takes to plot, ms, from its length (pure: safe on the server) */
export function labelTime(chars: number): number {
  return Math.max(LABEL.min, chars * LABEL.pace);
}

/** What each chapter's pen has drawn or will draw, and when each stroke ends */
const strokes: { el: Element; chapter: Element; end: number }[] = [];

function chapterOf(el: Element): Element {
  return el.closest("section") ?? document.body;
}

function onScreen(el: Element) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
}

/**
 * Run `start` for `el` once its chapter's pen is free of every stroke
 * still on screen (at most MAX_WAIT from now), and hold the pen for
 * `hold` ms.
 * Returns a cancel for a start still waiting.
 */
export function plot(el: Element, hold: number, start: () => void): () => void {
  const now = performance.now();
  const chapter = chapterOf(el);
  let free = now;
  for (let i = strokes.length - 1; i >= 0; i--) {
    const stroke = strokes[i];
    if (stroke.end <= now) strokes.splice(i, 1);
    else if (stroke.chapter === chapter && onScreen(stroke.el)) free = Math.max(free, stroke.end);
  }
  const at = Math.min(free, now + MAX_WAIT);
  strokes.push({ el, chapter, end: at + hold });
  const wait = at - now;
  if (wait < 16) {
    start();
    return () => {};
  }
  const timer = window.setTimeout(start, wait);
  return () => window.clearTimeout(timer);
}

/** Reading order: the earlier element in the document first */
export function inReadingOrder(a: Element, b: Element): number {
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

/** Motion is allowed on this screen (the same test the stylesheet makes) */
export function motionAllowed(): boolean {
  return window.matchMedia("screen and (prefers-reduced-motion: no-preference)").matches;
}
