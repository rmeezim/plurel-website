"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "@/components/reveal";
import { GRID, Meta } from "@/components/system";
import { mountBraid, SUPPLIERS } from "@/lib/braid";

/*
  Fig. 01, the manifesto's centrepiece, on paper: ten suppliers' strands,
  tangled, then straightened into lanes, then braided into one red strand
  (engine in lib/braid.ts). Scroll scrubs it while it passes through the
  viewport; it is never pinned.

  The words are HTML, composed on the page grid like the thesis above:
  the caption in the margin (columns 1 to 3), the lead (h3) on the content
  column, read with the tangle under it; the end statement, "One system.
  One number.", where the braid ends (beside it from lg, at column 10;
  under its end, right-aligned, below lg), fading in as the strand forms.
  The suppliers and the numbers they report are drawn on the strands; the
  caption lists them for screen readers. On desktop the supplier labels
  end on the content column's edge (the spine), where the lanes start, so
  the figure keeps the chapter's axis.

  The canvas is sized from the viewport, so the lead and the whole
  drawing fit on screen together and the tangle is whole when it is first
  seen, on laptops, phones and phones held sideways (capped at half the
  viewport's height) alike. Reduced motion shows the finished braid,
  still. Without JS a small drawing of that end state stands in for the
  canvas, its lines named in the margin and the end statement beside it.
  Below 560px of figure width (the engine's narrow layout, matched here
  with a container query) it draws six of the ten strands, and the
  caption says so.
*/

const SR_LIST = SUPPLIERS.map((s) => `${s.name}, ${s.metric}`).join("; ");

/** The no-JS drawing: ten ink lines meet at one junction and leave it as one red line */
const STATIC_Y = SUPPLIERS.map((_, i) => 14 + (i * 212) / (SUPPLIERS.length - 1));

export function BraidStrip() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const end = useRef<HTMLParagraphElement>(null);
  const spine = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mount = () =>
      mountBraid(cv, { reduced: mq.matches, end: end.current, spine: spine.current });
    let unmount = mount();
    const onChange = () => {
      unmount();
      unmount = mount();
    };
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      unmount();
    };
  }, []);

  return (
    <figure className={`@container ${GRID} mt-24 sm:mt-28 lg:mt-36`}>
      {/* The lead: the problem, set over the tangle */}
      <Reveal className="col-span-4 sm:col-span-6 lg:col-span-8 lg:col-start-4 lg:row-start-1">
        <h3
          className="type-display text-[clamp(1.5rem,6.8vw,1.625rem)] leading-[1.04] text-ink sm:text-[2rem] lg:text-[clamp(2rem,2.78vw,2.5rem)]"
        >
          <span className="block">Every supplier reports its own number.</span>{" "}
          <span className="block text-muted">Nobody owns the outcome.</span>
        </h3>
      </Reveal>

      {/* The drawing, full width, with the end statement on the grid */}
      <div className="relative col-span-4 mt-9 sm:col-span-6 sm:mt-10 lg:col-span-12 lg:row-start-2 lg:mt-12">
        <canvas
          ref={canvas}
          aria-hidden
          className="hidden h-[clamp(260px,calc(100svh-330px),380px)] max-h-[50svh] w-full font-mono text-ink [--braid-accent:var(--color-brand)] sm:h-[clamp(300px,calc(100svh-340px),440px)] lg:h-[clamp(320px,calc(100svh-420px),440px)] [html[data-js]_&]:block"
        />
        <div
          className={`${GRID} pointer-events-none relative h-[200px] grid-rows-1 sm:h-[220px] lg:h-[260px] [html[data-js]_&]:absolute [html[data-js]_&]:inset-0 [html[data-js]_&]:h-auto`}
        >
          <span ref={spine} aria-hidden className="hidden lg:col-start-4 lg:row-start-1 lg:block" />
          {/* Without JS: the end state, drawn once, each line named in the
              margin as the canvas names its lanes */}
          <ul
            aria-hidden
            className="relative col-span-1 col-start-1 row-start-1 font-mono text-[11px] uppercase leading-none tracking-[0.03em] text-ink/90 lg:col-span-3 lg:text-[12px] xl:text-[13px] [html[data-js]_&]:hidden"
          >
            {SUPPLIERS.map((s, i) => (
              <li
                key={s.name}
                className="absolute right-0 -translate-y-1/2 whitespace-nowrap"
                style={{ top: `${(STATIC_Y[i] / 240) * 100}%` }}
              >
                <span className="lg:hidden">{s.short}</span>
                <span className="hidden lg:inline">{s.name}</span>
              </li>
            ))}
          </ul>
          <svg
            aria-hidden
            viewBox="0 0 600 240"
            preserveAspectRatio="none"
            className="col-span-3 col-start-2 row-start-1 h-full w-full sm:col-span-5 lg:col-span-6 lg:col-start-4 [html[data-js]_&]:hidden"
          >
            {/* Group opacity, so the lines meeting at the junction never stack into black */}
            <g fill="none" stroke="currentColor" opacity={0.55} className="text-ink">
              {STATIC_Y.map((y) => (
                <path
                  key={y}
                  d={`M0 ${y - 5}V${y + 5}M0 ${y}H30C165 ${y} 165 120 300 120`}
                  strokeWidth={0.8}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
            <g fill="none" stroke="currentColor" className="text-brand">
              <path d="M300 120H596" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
              <path
                d="M596 120h0.01"
                strokeWidth={6}
                strokeLinecap="square"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </svg>
          <p
            ref={end}
            className="type-display col-span-4 col-start-1 row-start-1 translate-y-[calc(50%+1.25rem)] self-center justify-self-end text-right text-[1.375rem] leading-[1.04] text-brand sm:col-span-6 sm:text-[1.75rem] lg:col-span-3 lg:col-start-10 lg:translate-y-0 lg:justify-self-start lg:text-left lg:text-[clamp(1.75rem,2.36vw,2.125rem)] [html[data-js]_&]:opacity-0"
          >
            <span className="block">One system.</span>{" "}
            <span className="block">One number.</span>
          </p>
        </div>
      </div>

      <figcaption className="col-span-4 mt-6 sm:col-span-6 lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:pt-2.5">
        <Meta as="p" className="text-muted">
          <span className="text-brand">Fig. 01</span>
          <span aria-hidden className="lg:hidden"> · </span>
          <span className="lg:mt-1.5 lg:block">Who owns the number</span>
          <span aria-hidden className="hidden [html[data-js]_&]:@max-[559px]:inline">
            , 6/10 shown
          </span>
          <span className="sr-only">
            . One strand per supplier, each with the number it reports: {SR_LIST}. The
            tangle straightens into lanes, then the lanes braid into one red strand: one
            system, one number.
          </span>
        </Meta>
      </figcaption>
    </figure>
  );
}
