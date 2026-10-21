"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useArrival } from "@/components/type-reveal";

/**
 * Scroll-entrance wrapper: content lights (opacity alone, never
 * travelling) the first time it scrolls into view. It arrives through the
 * same observer and pen as the type reveal (lib/pen.ts), so a block waits
 * for the head above it, in reading order. A block that draws a figure
 * (Why now's route) holds the pen for `hold` ms, so what follows waits for
 * the drawing. Children stay server-rendered; this wrapper only arms
 * itself after hydration, and only for content still below the fold, so
 * no-JS visitors, reduced-motion visitors, and anything already on screen
 * render plainly. `delay` (seconds) holds a block back further, rarely
 * needed.
 */
export function Reveal({
  children,
  delay = 0,
  hold = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  /** Milliseconds this block holds the pen once it lights */
  hold?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const arrival = useArrival(ref, true, hold);
  // a keyboard user tabbing into a block below the fold sees it at once
  const [focused, setFocused] = useState(false);
  const state = focused && arrival === "armed" ? "in" : arrival;

  return (
    <div
      ref={ref}
      onFocusCapture={() => setFocused(true)}
      className={`${state === "armed" ? "reveal-armed" : ""}${
        state === "in" ? "reveal-in" : ""
      }${className ? ` ${className}` : ""}`}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
