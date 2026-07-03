"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";

export interface ShowcaseService {
  number: string;
  name: string;
  description: string;
}

/**
 * Editorial service index (lg and up): oversized type rows whose indent is
 * computed from each row's distance to the viewport center, so the list
 * continuously bows right around the sticky intro and relaxes back as rows
 * pass — a lens that follows the scroll. The centered row is "active": it
 * turns brand and its system module + one-liner dock into the left column.
 * Below lg (and for no-JS / reduced motion) the plain `fallback` list is
 * shown and none of this runs.
 */
export function ServicesShowcase({
  intro,
  services,
  modules,
  fallback,
}: {
  intro: ReactNode;
  services: ShowcaseService[];
  modules: ReactNode[];
  fallback: ReactNode;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [offsets, setOffsets] = useState<number[]>(() => services.map(() => 0));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const list = listRef.current;
      if (!list) return;
      const vh = window.innerHeight;
      /* Bulge amplitude scales with the column, and collapses entirely when
         the column is too narrow to spare the travel. */
      const amplitude = Math.max(0, Math.min(list.clientWidth - 500, 140));
      let best = 0;
      let bestDist = Infinity;
      const next = rowRefs.current.map((el, i) => {
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2 - vh / 2;
        if (Math.abs(mid) < bestDist) {
          bestDist = Math.abs(mid);
          best = i;
        }
        const norm = mid / vh;
        return Math.round(amplitude * Math.exp(-((norm * 2.2) ** 2)) * 10) / 10;
      });
      setOffsets(next);
      setActive(best);
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

  return (
    <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-x-16">
      {/* Left: sticky intro with the active service's artifact docked below */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        {intro}

        <div aria-hidden className="relative mt-12 hidden h-[216px] lg:block">
          {modules.map((node, i) => (
            <div
              key={i}
              className="absolute left-0 top-0 transition-all duration-500"
              style={{
                opacity: i === active ? 1 : 0,
                transform:
                  i === active
                    ? "rotate(-2deg) scale(1)"
                    : "rotate(-5deg) scale(0.95)",
              }}
            >
              <span className="block h-[144px] w-[216px] overflow-hidden rounded-xl border border-line shadow-[0_22px_44px_-24px_rgba(17,15,10,0.5)]">
                {node}
              </span>
            </div>
          ))}
          <p
            key={active}
            className="glass-in absolute inset-x-0 bottom-0 max-w-[38ch] text-[13px] leading-relaxed text-muted"
          >
            {services[active].description}
          </p>
        </div>
      </div>

      {/* Right: the lens list (lg) / plain index (below lg) */}
      <ul ref={listRef} className="hidden lg:block">
        {services.map((service, i) => {
          const isActive = i === active;
          return (
            <li
              key={service.number}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              className="py-2"
            >
              <Link
                href="/services"
                className="group inline-flex w-max items-start gap-4"
                style={{ transform: `translateX(${offsets[i] ?? 0}px)` }}
              >
                <span
                  className={`pt-1.5 text-[13px] font-semibold tracking-[0.14em] transition-colors duration-300 ${
                    isActive ? "text-brand" : "text-muted/70"
                  }`}
                >
                  {service.number}
                </span>
                <span
                  className={`text-[clamp(2.25rem,3.4vw,3.5rem)] font-normal leading-[1.08] tracking-[-0.02em] transition-colors duration-300 group-hover:text-brand ${
                    isActive ? "text-brand" : "text-ink/30"
                  }`}
                >
                  {service.name}
                </span>
                <ArrowUpRight
                  className={`mt-3 size-5 shrink-0 transition-opacity duration-300 ${
                    isActive
                      ? "text-brand opacity-100"
                      : "opacity-0 group-hover:opacity-60"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="lg:hidden">{fallback}</div>
    </div>
  );
}
