"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motionAllowed } from "@/lib/pen";

/*
  The numbers a page answers to, as a graph: each measure a node on the
  left, joined to the one number on the right, the number the business
  runs on (orders, installs, demos or stockists: the reader picks theirs).
  A square travels each line as often as that measure is read (weekly,
  monthly, quarterly), so the rhythm of the reading is the motion: only on
  screen, never under reduced motion, with a Pause control. Pointing at a
  measure lights its line. On a phone the measures stack on a spine that
  runs down into the number.
*/

export type GraphMetric = { name: string; what: string; when: string };

const PERIOD: Record<string, number> = { weekly: 2.2, monthly: 4.4, quarterly: 8.8 };
const KINDS = ["Orders", "Installs", "Demos", "Stockists"] as const;

type Edge = { p: [number, number, number, number, number, number, number, number] };

const bez = (e: Edge, t: number) => {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = e.p;
  const u = 1 - t;
  return {
    x: u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
    y: u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3,
  };
};

export function MetricGraph({ metrics, tone = "dark", label }: { metrics: readonly GraphMetric[]; tone?: "dark" | "red"; label: string }) {
  const red = tone === "red";
  const num = metrics.find((m) => m.name === "The one number");
  const feeds = useMemo(() => metrics.filter((m) => m.name !== "The one number"), [metrics]);
  const box = useRef<HTMLDivElement>(null);
  const pulses = useRef<(SVGRectElement | null)[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hot, setHot] = useState<number | null>(null);
  const [kind, setKind] = useState<(typeof KINDS)[number]>("Orders");
  const [held, setHeld] = useState(false);
  const [motion, setMotion] = useState(false);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    setMotion(motionAllowed());
    const measure = () => {
      const o = el.getBoundingClientRect();
      setSize({ w: o.width, h: o.height });
      const target = el.querySelector<HTMLElement>("[data-number]")!.getBoundingClientRect();
      const cards = [...el.querySelectorAll<HTMLElement>("[data-feed]")].map((c) => c.getBoundingClientRect());
      if (!cards.length || target.left < cards[0].right) {
        setEdges([]);
        return;
      }
      const qx = target.left - o.left;
      const qy = target.top - o.top + Math.min(target.height / 2, 64);
      setEdges(
        cards.map((c, i) => {
          const px = c.right - o.left;
          const py = c.top - o.top + c.height / 2;
          const k = (qx - px) * 0.55;
          const spread = (i - (cards.length - 1) / 2) * 6;
          return { p: [px, py, px + k, py, qx - k, qy + spread, qx, qy + spread] };
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const live = motion && onScreen && !held && edges.length > 0;
  useEffect(() => {
    if (!live) return;
    let raf = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      const s = (now - t0) / 1000;
      edges.forEach((e, i) => {
        const r = pulses.current[i];
        if (!r) return;
        const period = PERIOD[feeds[i].when.toLowerCase()] ?? 4.4;
        const t = ((s + i * 0.37 * period) % period) / period;
        // each pulse travels in the first 40% of its period, then waits
        const k = Math.min(1, t / 0.4);
        const p = bez(e, k);
        r.setAttribute("x", (p.x - 3).toFixed(1));
        r.setAttribute("y", (p.y - 3).toFixed(1));
        r.setAttribute("opacity", k >= 1 ? "0" : "1");
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [live, edges, feeds]);

  const line = red ? "border-paper/40" : "border-paper/15";
  const mute = red ? "text-paper" : "text-fog";

  return (
    <div className="mt-12 lg:mt-16">
      <div ref={box} role="group" aria-label={label} className="relative grid gap-y-8 lg:grid-cols-12 lg:gap-x-8">
        <svg aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-visible lg:block" width={size.w} height={size.h} fill="none">
          {edges.map((e, i) => {
            const [x0, y0, x1, y1, x2, y2, x3, y3] = e.p;
            const lit = hot == null || hot === i;
            return (
              <path
                key={i}
                d={`M${x0} ${y0}C${x1} ${y1} ${x2} ${y2} ${x3} ${y3}`}
                stroke="var(--color-paper)"
                strokeOpacity={lit ? (red ? 0.75 : 0.45) : 0.12}
                strokeWidth={hot === i ? 1.5 : 1}
                className="transition-[stroke-opacity] duration-300"
              />
            );
          })}
          {edges.map((_, i) => (
            <rect
              key={i}
              ref={(r) => {
                pulses.current[i] = r;
              }}
              width={6}
              height={6}
              opacity={0}
              fill={red ? "var(--color-paper)" : "var(--color-signal)"}
            />
          ))}
        </svg>

        <ol className={`relative flex flex-col gap-3 max-lg:border-l max-lg:pl-5 lg:col-span-5 ${line}`}>
          {feeds.map((m, i) => (
            <li key={m.name} data-feed="">
              <button
                type="button"
                onPointerEnter={() => setHot(i)}
                onPointerLeave={() => setHot((h) => (h === i ? null : h))}
                onFocus={() => setHot(i)}
                onBlur={() => setHot((h) => (h === i ? null : h))}
                className={`relative block w-full border px-4 py-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper ${line} ${
                  hot === i ? (red ? "bg-paper/10" : "bg-paper/[0.05]") : ""
                }`}
              >
                <span aria-hidden className={`absolute -left-[25px] top-1/2 size-[7px] -translate-y-1/2 lg:hidden ${red ? "bg-paper" : "bg-signal"}`} />
                <span className="flex items-baseline justify-between gap-4">
                  <span className="type-title text-[clamp(1.25rem,1.1rem+0.5vw,1.5rem)] leading-[1.15]">{m.name}</span>
                  <span className={`shrink-0 font-mono text-[13px] leading-none ${mute}`}>{m.when}</span>
                </span>
                <span className={`mt-2 block max-w-[46ch] text-[15px] leading-[1.45] ${mute}`}>{m.what}</span>
              </button>
            </li>
          ))}
        </ol>

        <div data-number="" className={`self-center border-t-2 pt-5 lg:col-span-4 lg:col-start-9 ${red ? "border-paper" : "border-paper/80"}`}>
          <p className={`text-[13px] ${mute}`}>The one number</p>
          <p className="type-display mt-2 text-[clamp(3rem,2.2rem+3vw,5rem)] leading-none [--display-weight:340]" aria-live="polite">
            {kind}
          </p>
          <div role="group" aria-label="The number your business runs on" className="mt-5 flex flex-wrap gap-1.5">
            {KINDS.map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
                className={`h-8 border px-2.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper ${
                  kind === k ? (red ? "border-paper bg-paper text-brand" : "border-paper bg-paper text-ink") : `${line} hover:border-paper/70`
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          <p className={`mt-5 max-w-[36ch] text-[15px] leading-[1.5] ${mute}`}>
            {num?.what ?? "The number your business runs on, agreed on day one in the Diagnostic."} Read with you in the Ledger, every month.
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className={`text-[13px] ${mute}`}>Each square travels its line as often as that measure is read.</p>
        {motion && edges.length > 0 && (
          <button
            type="button"
            onClick={() => setHeld((h) => !h)}
            className={`inline-flex h-8 items-center gap-2 border px-2.5 text-[13px] font-medium leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper ${line} hover:border-paper`}
          >
            {held ? "Play" : "Pause"}
            <span className="sr-only"> the graph</span>
          </button>
        )}
      </div>
    </div>
  );
}
