"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType } from "react";

/*
  Headings that arrive: each word rises out of its own mask the first time
  the heading enters the screen (or on load, for the hero). The text is
  server-rendered and readable without JS; the motion arms only after
  hydration, only for headings still below the fold, and never under
  reduced motion. Words are spans with plain spaces between them (never a
  space on its own between text markers, which Chrome's accessibility tree
  drops), so the heading reads as one sentence.

  `lines` sets the line breaks (each line is a block); `variant` picks the
  category: "display" for chapter headlines, "title" for smaller heads,
  "chars" for single display words. Styles live in globals.css (.type-reveal).
*/

export type TypeRevealProps = {
  as?: "h1" | "h2" | "h3" | "p" | "span";
  id?: string;
  className?: string;
  lines: readonly string[];
  variant?: "display" | "title" | "chars";
  /** Start once mounted (the hero) instead of on entering the screen */
  onLoad?: boolean;
  /** Milliseconds before the first word moves */
  delay?: number;
  /** An extra class for each line, by index (e.g. to tone the second line) */
  lineClassName?: readonly (string | undefined)[];
};

type Css = CSSProperties & Record<`--${string}`, string | number>;

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
  const [state, setState] = useState<"idle" | "armed" | "in">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // on load (the hero) the motion is CSS alone, from the first paint
    if (onLoad || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.92) return;
    setState("armed");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setState("in");
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onLoad]);

  let k = 0;
  return (
    <Tag
      ref={ref}
      id={id}
      className={`type-reveal ${className}`}
      data-variant={variant}
      data-state={onLoad ? "load" : state}
      style={{ "--d": `${delay}ms` } as Css}
    >
      {lines.map((line, li) => [
        li > 0 ? " " : null,
        <span key={li} className={`tr-line ${lineClassName[li] ?? ""}`}>
          {line.split(" ").map((word, wi, words) => {
            const i = k++;
            return [
              <span key={wi} className="tr-w">
                <span className="tr-wi" style={{ "--i": i } as Css}>
                  {word}
                </span>
              </span>,
              wi < words.length - 1 ? " " : null,
            ];
          })}
        </span>,
      ])}
    </Tag>
  );
}
