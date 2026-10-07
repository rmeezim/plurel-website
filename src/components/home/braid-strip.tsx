"use client";

import { useEffect, useRef } from "react";
import { GRID, Meta } from "@/components/system";
import { mountBraid } from "@/lib/braid";

/*
  Fig. 01, the closing figure of the manifesto's red band: ten suppliers'
  strands, tangled, then straightened into lanes, then braided through the
  Plurel mark into one strand (engine in lib/braid.ts). Scroll scrubs it
  while it passes through the viewport; it is never pinned. Reduced motion
  shows the finished braid, still. The canvas is decorative: the caption
  carries the figure's meaning for screen readers. Without JS the figure
  stays out of the layout, since there would be nothing to draw.

  The canvas is capped at 40% of the small viewport height, so on short
  phones the whole tangle fits on screen with room left to scrub. Below
  560px of figure width (the engine's narrow layout, matched here with a
  container query) it draws six of the ten strands, and the caption says so.
*/
export function BraidStrip() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let unmount = mountBraid(cv, { reduced: mq.matches });
    const onChange = () => {
      unmount();
      unmount = mountBraid(cv, { reduced: mq.matches });
    };
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      unmount();
    };
  }, []);

  return (
    <figure className="@container mt-16 hidden border-t border-paper/50 pt-5 sm:mt-20 lg:mt-24 [html[data-js]_&]:block">
      <div className={`${GRID} items-start`}>
        <figcaption className="col-span-4 sm:col-span-6 lg:col-span-3">
          <Meta as="p" className="text-paper">
            Fig. 01 <span aria-hidden className="text-paper lg:hidden">· </span>
            <span className="lg:mt-1.5 lg:block">Ten suppliers, one system</span>
            <span aria-hidden className="mt-1.5 block text-paper @min-[560px]:hidden">
              Six of ten shown
            </span>
            <span className="sr-only">
              . One strand per supplier (ads agency, SEO agency, brand studio,
              social team, PR firm, creators, UGC, web team, writers,
              analytics), each reporting its own number. The tangle
              straightens into lanes, then braids through the Plurel mark
              into one strand: one system, one number.
            </span>
          </Meta>
        </figcaption>
        <canvas
          ref={canvas}
          aria-hidden
          className="col-span-4 mt-7 block h-[clamp(220px,40svh,280px)] w-full font-mono sm:col-span-6 sm:mt-8 sm:h-[clamp(200px,40svh,300px)] lg:col-span-9 lg:col-start-4 lg:mt-0"
        />
      </div>
    </figure>
  );
}
