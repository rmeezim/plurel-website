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
 * Editorial service index (lg and up), three columns: the sticky intro,
 * the type list, and an artifact rail. Each row's indent is computed from
 * its distance to the viewport center, so the list bows gently toward the
 * rail and relaxes back as rows pass — a lens that follows the scroll.
 * The centered row is "active": it turns brand, a thumb glides to it on
 * the progress track beside the list, and its living schematic and
 * one-liner ride the right rail, pinned at the viewport's vertical center
 * so they always sit beside the highlighted row. Below lg (and for no-JS /
 * reduced motion) the plain `fallback` list is shown and none of this runs.
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
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [thumbY, setThumbY] = useState(40);
  const [offsets, setOffsets] = useState<number[]>(() => services.map(() => 0));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const list = listRef.current;
      if (!list) return;
      const vh = window.innerHeight;
      /* Gentle bow: amplitude scales with the column and collapses when
         the column has no room to spare. */
      const amplitude = Math.max(0, Math.min(list.clientWidth - 440, 84));
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
      const bestEl = rowRefs.current[best];
      if (bestEl) setThumbY(bestEl.offsetTop + bestEl.offsetHeight / 2);
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
    <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-[minmax(0,250px)_minmax(0,1fr)_minmax(0,270px)] lg:gap-x-10 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)_420px] xl:gap-x-12">
      {/* Left: sticky intro */}
      <div className="lg:sticky lg:top-28 lg:self-start">{intro}</div>

      {/* Center: the lens list, with a progress track the thumb glides on */}
      <div ref={listRef} className="relative hidden lg:block">
        <span
          aria-hidden
          className="absolute bottom-4 left-[3px] top-4 hidden w-px bg-line xl:block"
        />
        <span
          aria-hidden
          className="absolute left-0 top-0 hidden h-7 w-[7px] rounded-full bg-brand xl:block"
          style={{
            transform: `translateY(${thumbY - 14}px)`,
            transition: "transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1)",
          }}
        />
        <ul className="xl:pl-20">
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
                    className={`pt-1.5 text-[12px] font-semibold tracking-[0.14em] transition-colors duration-300 ${
                      isActive ? "text-brand" : "text-muted/70"
                    }`}
                  >
                    {service.number}
                  </span>
                  <span
                    className={`text-[clamp(1.9rem,2.5vw,2.5rem)] font-normal leading-[1.1] tracking-[-0.02em] transition-colors duration-300 group-hover:text-brand ${
                      isActive ? "text-brand" : "text-ink/30"
                    }`}
                  >
                    {service.name}
                    <span className="sr-only"> &mdash; {service.description}</span>
                  </span>
                  <ArrowUpRight
                    className={`mt-2.5 size-5 shrink-0 transition-opacity duration-300 ${
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
      </div>

      {/* Right: artifact zone — the active service's schematic drawn
          directly on the page surface, unframed and faint, filling the
          column; pinned at the viewport's vertical center so it always
          sits beside the highlighted row */}
      <aside className="relative hidden lg:flex lg:items-center">
        {/* Scrolls with the flow (no pin); right-aligned and sized under the
            column so the extra space falls as a gap toward the list */}
        <div className="ml-auto w-[85%]">
          {/* Faint, desaturated so full-strength brand red stays reserved
              for the active list row — the schematic reads as ambient
              blueprint, not a second focal point */}
          <div
            aria-hidden
            className="relative aspect-[12/7] w-full opacity-[0.45] [filter:saturate(0.65)]"
          >
            {modules.map((node, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-all duration-500"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform:
                    i === active
                      ? "translateY(0) scale(1)"
                      : "translateY(12px) scale(0.985)",
                }}
              >
                {node}
              </div>
            ))}
          </div>
          <div key={active} className="glass-in mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              {services[active].number} &mdash; {services[active].name}
            </p>
            <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-muted">
              {services[active].description}
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:hidden">{fallback}</div>
    </div>
  );
}
