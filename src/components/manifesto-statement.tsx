"use client";

import { useEffect, useRef, useState } from "react";

type Segment = { text: string; accent?: boolean; glue?: boolean };

const SEGMENTS: Segment[] = [
  { text: "Most businesses don’t have a quality problem — they have a" },
  { text: "presence", accent: true },
  {
    text: "problem. We build the visible layer of your brand, so the work you’re proud of finally",
  },
  { text: "looks the part", accent: true },
  { text: ".", glue: true },
];

type Word = { text: string; accent?: boolean; glue?: boolean };

const WORDS: Word[] = SEGMENTS.flatMap((segment) =>
  segment.text
    .split(" ")
    .map((text, i) => ({
      text,
      accent: segment.accent,
      glue: i === 0 ? segment.glue : undefined,
    })),
);

const FAINT = 0.15;
/** How many words the soft leading edge of the sweep spans */
const RAMP = 1.75;

/**
 * The manifesto statement with a scroll-scrubbed reveal: words start faint
 * and sweep to full strength as the section moves through the viewport
 * (and back again when scrolling up). Renders at full opacity on the server
 * so no-JS visitors and reduced-motion users always get readable text.
 */
export function ManifestoStatement() {
  const ref = useRef<HTMLHeadingElement>(null);
  // 1 = fully revealed; the scroll effect drives this after mount.
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const start = window.innerHeight * 0.8;
      const span = Math.max(rect.height * 0.9, 1);
      const p = Math.min(1, Math.max(0, (start - rect.top) / span));
      setProgress(Math.round(p * 500) / 500);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const sweep = progress * (WORDS.length + RAMP);

  return (
    <h2
      id="manifesto-heading"
      ref={ref}
      className="mt-8 max-w-[26ch] font-sans text-[clamp(1.9rem,4.4vw,4rem)] font-normal leading-[1.12] tracking-[-0.02em]"
    >
      {WORDS.map((word, i) => {
        const reveal = Math.min(1, Math.max(0, (sweep - i) / RAMP));
        const opacity = FAINT + (1 - FAINT) * reveal;
        return (
          <span key={i}>
            {i > 0 && !word.glue ? " " : ""}
            <span
              style={{ opacity }}
              className={`transition-opacity duration-150 ease-linear ${
                word.accent ? "italic text-clay" : ""
              }`}
            >
              {word.text}
            </span>
          </span>
        );
      })}
    </h2>
  );
}
