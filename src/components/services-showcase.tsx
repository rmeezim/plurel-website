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
 * The centered row is "active": it turns brand, and its system module and
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
      /* Gentle bow: amplitude scales with the column and collapses when
         the column has no room to spare. */
      const amplitude = Math.max(0, Math.min(list.clientWidth - 480, 84));
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
    <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)_240px] lg:gap-x-10 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)_280px] xl:gap-x-14">
      {/* Left: sticky intro */}
      <div className="lg:sticky lg:top-28 lg:self-start">{intro}</div>

      {/* Center: the lens list */}
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
                  className={`pt-1.5 text-[12px] font-semibold tracking-[0.14em] transition-colors duration-300 ${
                    isActive ? "text-brand" : "text-muted/70"
                  }`}
                >
                  {service.number}
                </span>
                <span
                  className={`text-[clamp(2rem,2.9vw,3rem)] font-normal leading-[1.1] tracking-[-0.02em] transition-colors duration-300 group-hover:text-brand ${
                    isActive ? "text-brand" : "text-ink/30"
                  }`}
                >
                  {service.name}
                  <span className="sr-only"> — {service.description}</span>
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

      {/* Right: artifact rail — pinned at the viewport's vertical center so
          the active service's module and one-liner sit beside its row */}
      <aside className="relative hidden lg:block">
        <div className="lg:sticky lg:top-[calc(50vh-132px)]">
          <div aria-hidden className="relative h-[176px]">
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
                <span className="block h-[160px] w-[240px] max-w-full overflow-hidden rounded-xl border border-line shadow-[0_22px_44px_-24px_rgba(17,15,10,0.5)]">
                  {node}
                </span>
              </div>
            ))}
          </div>
          <div key={active} className="glass-in mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              {services[active].number} &mdash; {services[active].name}
            </p>
            <p className="mt-2 max-w-[30ch] text-[13px] leading-relaxed text-muted">
              {services[active].description}
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:hidden">{fallback}</div>
    </div>
  );
}
