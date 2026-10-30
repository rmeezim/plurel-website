"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";

/*
  The figures on the engagement and discipline pages: each one point,
  made the way an editor would make a chart for a report, not a
  dashboard. Its title states the point; a line under it says what is
  drawn; the drawing labels itself (no legends, no boxes, one highlight
  in signal red, everything else paper at a lower tone); a caption says
  what the numbers are. It sits in the page's reading column and keeps
  to it at every width.

  Type: Geist only, with tabular figures for numbers, at three sizes:
  the title, 14px for labels, 13px for ticks and the caption. Motion:
  it draws once as it comes into view, lines at a steady rate (useDraw),
  and stays still; a toggle redraws it. Server-rendered, without JS and
  under reduced motion it is simply drawn.
*/

const MOTION = "screen and (prefers-reduced-motion: no-preference)";
function subscribe(cb: () => void) {
  const mq = window.matchMedia(MOTION);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const motionNow = () => window.matchMedia(MOTION).matches;

/**
 * How far the figure is drawn, 0 to 1: it starts when the figure is well
 * into view, runs `ms` at a steady rate, and holds. `key` restarts it.
 */
export function useDraw(ref: RefObject<Element | null>, ms = 1400, key: unknown = 0) {
  const motion = useSyncExternalStore(subscribe, motionNow, () => false);
  const [t, setT] = useState<number | null>(null);
  const seen = useRef(false);
  const started = useRef<unknown>(Symbol());

  useEffect(() => {
    const el = ref.current;
    if (!el || !motion) return;
    let raf = 0;
    const run = () => {
      const t0 = performance.now();
      const frame = (now: number) => {
        const k = Math.min(1, (now - t0) / ms);
        setT(k);
        if (k < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };
    if (seen.current && started.current !== key) {
      started.current = key;
      run();
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || seen.current) return;
        seen.current = true;
        started.current = key;
        io.disconnect();
        run();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref, motion, ms, key]);

  // drawn on the server, without JS and under reduced motion; with motion
  // it waits at zero until it is seen
  if (!motion) return 1;
  return t ?? 0;
}

/** The figure's width, for drawings laid out in pixels */
export function useWidth(ref: RefObject<HTMLElement | null>, fallback = 720) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w || fallback;
}

/** A path through points */
export const line = (pts: readonly (readonly [number, number])[]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");

/** The first part of a polyline, as far as k (0 to 1) of its length */
export function partial(pts: readonly (readonly [number, number])[], k: number): [number, number][] {
  if (k >= 1 || pts.length < 2) return pts.map((p) => [p[0], p[1]]);
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  let left = seg.reduce((a, b) => a + b, 0) * Math.max(0, k);
  const out: [number, number][] = [[pts[0][0], pts[0][1]]];
  for (let i = 0; i < seg.length; i++) {
    if (left >= seg[i]) {
      out.push([pts[i + 1][0], pts[i + 1][1]]);
      left -= seg[i];
    } else {
      const f = seg[i] ? left / seg[i] : 0;
      out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]);
      break;
    }
  }
  return out;
}

/** Two choices, side by side: the figure's one control */
export function Toggle<T extends string>({ value, options, onChange, label }: { value: T; options: readonly { key: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex border border-paper/20 p-[3px]">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          role="radio"
          aria-checked={value === o.key}
          onClick={() => onChange(o.key)}
          className={`h-8 px-3 text-[14px] leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper ${
            value === o.key ? "bg-paper text-ink" : "text-fog hover:text-paper"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const MARK = "flex size-[18px] shrink-0 items-center justify-center bg-paper text-[13px] font-medium leading-none tabular-nums text-ink";

/** A numbered square on a point of a chart, where its words would crowd the lines: the words go in Notes */
export function NumberMark({ n, x, y }: { n: number; x: number; y: number }) {
  return (
    <span aria-hidden className={`${MARK} absolute -translate-x-1/2 -translate-y-1/2`} style={{ left: x, top: y }}>
      {n}
    </span>
  );
}

/** What each numbered mark is, under the chart */
export function Notes({ items }: { items: readonly { when?: string; what: string }[] }) {
  return (
    <ol className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
      {items.map((it, i) => (
        <li key={it.what} className="flex gap-3 text-[15px] leading-[1.4] text-paper">
          <span aria-hidden className={`${MARK} mt-px`}>
            {i + 1}
          </span>
          <span>
            {it.when && <span className="text-fog">{it.when}: </span>}
            {it.what}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Which line is which, where the chart has no room to name them at their ends */
export function Key({ items }: { items: readonly { label: string; tone: "signal" | "paper" | "dashed" }[] }) {
  return (
    <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[14px]">
      {items.map((it) => (
        <span key={it.label} className={`inline-flex items-center gap-2 ${it.tone === "signal" ? "text-signal" : "text-fog"}`}>
          <span
            aria-hidden
            className={`w-4 ${it.tone === "signal" ? "h-[2px] bg-signal" : it.tone === "paper" ? "h-[2px] bg-paper/55" : "border-t-2 border-dashed border-paper/50"}`}
          />
          {it.label}
        </span>
      ))}
    </p>
  );
}

/** The frame every figure shares: its point, what is drawn, the drawing, what the numbers are */
export function Figure({
  title,
  sub,
  control,
  note,
  label,
  children,
}: {
  /** The point, in one sentence */
  title: string;
  /** What is drawn */
  sub?: ReactNode;
  /** A toggle, if the figure has one */
  control?: ReactNode;
  /** What the numbers are, in plain view */
  note: ReactNode;
  /** What the drawing shows, for assistive tech */
  label: string;
  children: ReactNode;
}) {
  return (
    <figure className="m-0 border-t border-paper/15 pt-6">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
        <div className="max-w-[46ch]">
          <p className="type-title text-[clamp(1.25rem,1.12rem+0.5vw,1.5rem)] leading-[1.25] text-paper">{title}</p>
          {sub && <p className="mt-2 text-[15px] leading-[1.5] text-fog">{sub}</p>}
        </div>
        {control}
      </div>
      <div className="mt-8 font-sans tabular-nums">
        <p className="sr-only">{label}</p>
        {children}
      </div>
      <figcaption className="mt-5 text-[13px] leading-[1.5] text-fog">{note}</figcaption>
    </figure>
  );
}
