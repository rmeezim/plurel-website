"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  {
    target: 3.2,
    decimals: 1,
    prefix: "",
    suffix: "×",
    label: "Average lift in qualified inquiries",
  },
  {
    target: 64,
    decimals: 0,
    prefix: "+",
    suffix: "%",
    label: "Average conversion-rate improvement",
  },
  {
    target: 185,
    decimals: 0,
    prefix: "+",
    suffix: "%",
    label: "Organic & AI-search visibility gained",
  },
  {
    target: 0.9,
    decimals: 1,
    prefix: "",
    suffix: "s",
    label: "Median page load after rebuild",
  },
] as const;

const DURATION_MS = 1400;

/**
 * Headline metrics that count up from zero when the row scrolls into view.
 * A single eased rAF loop drives all four counters in sync. Renders final
 * values on the server so no-JS visitors and reduced-motion users see the
 * real numbers immediately.
 */
export function ProofStats() {
  const ref = useRef<HTMLDListElement>(null);
  // 1 = final values; the count-up drives 0 -> 1 after mount.
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setProgress(0);
    let raf = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION_MS);
          setProgress(1 - Math.pow(1 - t, 3));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <dl
      ref={ref}
      className="mt-12 grid grid-cols-2 gap-y-10 lg:mt-16 lg:grid-cols-4"
    >
      {STATS.map((stat) => (
        <div key={stat.label} className="border-l border-paper/15 pl-5 sm:pl-6">
          <dd className="flex items-start gap-0.5">
            <span className="text-5xl font-normal leading-none tracking-[-0.02em] tabular-nums sm:text-6xl">
              {stat.prefix}
              {(stat.target * progress).toFixed(stat.decimals)}
            </span>
            <span className="text-xl font-normal leading-none text-brand sm:text-2xl">
              {stat.suffix}
            </span>
          </dd>
          <dt className="mt-3 max-w-[24ch] text-[13px] leading-relaxed text-paper/60">
            {stat.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}
