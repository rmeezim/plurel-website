"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useArrival } from "@/components/type-reveal";
import { motionAllowed } from "@/lib/pen";

/*
  A plate: one of the site's drawn instruments (the artifacts on the
  service, package and company pages), in the site's motion vocabulary.

  - It is drawn once, as it enters: lines at a steady rate, nodes and
    labels lit by opacity, each at its own time (--t, --d in ms), through
    the same pen as the heads (useArrival), holding it for `hold` ms so
    what follows waits for the drawing. On screen at load, under reduced
    motion and without JS it is simply finished.
  - A plate with `loop` keeps one quiet motion going once drawn (pulses
    along its lines, a sweep, a ping): only while it is on screen, never
    under reduced motion, and with a Pause control (auto-moving media
    always gets one).
  - The drawing is aria-hidden: `label` says what it shows to assistive
    tech, and the caption (the readout) says it to everyone.

  The drawing's classes (pl-stroke, pl-lit, pl-x, pl-y, pl-pulse, pl-dot,
  pl-spin, pl-ping) and their motion live in globals.css ("Plates"), keyed
  to this element's data-state, data-live and data-run.
*/
export function Plate({
  label,
  hold,
  loop = false,
  tone = "dark",
  layout = "stack",
  className = "",
  frameClassName = "",
  caption,
  children,
}: {
  /** What the drawing shows, for assistive tech; none for a decorative glyph */
  label?: string;
  /** How long the drawing takes, ms (it holds the pen as long) */
  hold: number;
  /** Keeps a motion going once drawn, with a Pause control */
  loop?: boolean;
  tone?: "dark" | "red";
  /** The readout under the drawing, or beside it from lg (columns 1-8 and 9-12) */
  layout?: "stack" | "side";
  className?: string;
  /** Extra classes for the drawing's frame */
  frameClassName?: string;
  /** The readout, under or beside the drawing */
  caption?: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const state = useArrival(ref, true, hold);
  const [drawn, setDrawn] = useState(false);
  const [motion, setMotion] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [held, setHeld] = useState(false);
  const [finished, setFinished] = useState(false);

  // drawn once its drawing has run (a plate that never armed was finished from the start)
  useEffect(() => {
    if (state !== "in") return;
    const id = window.setTimeout(() => setDrawn(true), hold);
    return () => window.clearTimeout(id);
  }, [state, hold]);

  // a looping plate moves only while on screen; the first report also says
  // whether motion is allowed at all, and whether it was finished at load
  useEffect(() => {
    const el = ref.current;
    if (!el || !loop) return;
    let first = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false;
          setFinished(el.getBoundingClientRect().top < window.innerHeight);
          setMotion(motionAllowed());
        }
        setOnScreen(entry.isIntersecting);
      },
      { rootMargin: "80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loop]);

  const live = loop && motion && (drawn || (state === "idle" && finished));
  const frame =
    tone === "red" ? "bg-ember" : "border border-paper/10 bg-paper/[0.03]";

  return (
    <figure
      ref={ref}
      aria-hidden={label ? undefined : true}
      data-state={state}
      data-live={live || undefined}
      data-run={(live && onScreen && !held) || undefined}
      className={`plate m-0 ${layout === "side" ? "grid grid-cols-1 gap-y-2 lg:grid-cols-12 lg:gap-x-8" : ""} ${className}`}
    >
      <div className={`relative ${frame} ${layout === "side" ? "lg:col-span-8" : ""} ${frameClassName}`}>
        <div aria-hidden className="plate-drawing relative">
          {children}
        </div>
        {loop && motion && (
          <button
            type="button"
            onClick={() => setHeld((h) => !h)}
            className="absolute bottom-2.5 right-2.5 inline-flex h-8 items-center gap-2 border border-paper/35 bg-transparent px-2.5 text-[13px] font-medium leading-none text-paper transition-colors hover:border-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
          >
            <span aria-hidden className={`plate-hold${held ? " plate-hold-play" : ""}`} />
            {held ? "Play" : "Pause"}
            <span className="sr-only"> the drawing</span>
          </button>
        )}
      </div>
      {label && <p className="sr-only">{label}</p>}
      {caption && <figcaption className={layout === "side" ? "lg:col-span-4 lg:col-start-9" : ""}>{caption}</figcaption>}
    </figure>
  );
}
