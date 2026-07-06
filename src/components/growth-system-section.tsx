"use client";

import { useEffect, useRef, useState } from "react";
import { Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";

/*
 * The Plurel Growth System as a ledger and its drawing. The left side is
 * an editorial index — nine layers as ruled rows, grouped into four
 * stages, typography doing all the work. The right side is one continuous
 * drafted panel: a bus with nine junctions, a scroll-driven fill, and a
 * readout that follows whichever layer the visitor is reading (scroll
 * focus or hover). The last row closes the loop: 09 returns to 01.
 * Reduced-motion and no-JS visitors get the finished drawing, fully lit.
 */

type Layer = {
  number: string;
  name: string;
  role: string;
  /** What this layer hands to the next; the last layer returns to 01 */
  out?: string;
  chips: readonly [string, string, string];
};

type Group = { numeral: string; name: string; layers: Layer[] };

const GROUPS: Group[] = [
  {
    numeral: "I",
    name: "Foundation",
    layers: [
      {
        number: "01",
        name: "Brand",
        role: "Positioning, identity, narrative",
        out: "identity & positioning",
        chips: ["Positioning", "Identity system", "Voice"],
      },
      {
        number: "02",
        name: "Website",
        role: "Conversion architecture and digital experience",
        out: "a conversion-ready home",
        chips: ["Conversion architecture", "Design system", "Build"],
      },
    ],
  },
  {
    numeral: "II",
    name: "Demand",
    layers: [
      {
        number: "03",
        name: "AI Search",
        role: "SEO, AEO, answer-engine visibility",
        out: "machine-readable authority",
        chips: ["AEO schema", "Search visibility", "Answer presence"],
      },
      {
        number: "04",
        name: "Content",
        role: "Thought leadership and demand creation",
        out: "proof & perspective",
        chips: ["Editorial engine", "Founder POV", "Case proof"],
      },
      {
        number: "05",
        name: "Paid Growth",
        role: "Campaigns, funnels, creative testing",
        out: "qualified attention",
        chips: ["Campaign systems", "Creative testing", "Funnels"],
      },
    ],
  },
  {
    numeral: "III",
    name: "Operations",
    layers: [
      {
        number: "06",
        name: "CRM",
        role: "Lead capture, routing, follow-up",
        out: "captured demand",
        chips: ["Lead capture", "Routing", "Pipeline hygiene"],
      },
      {
        number: "07",
        name: "Automation",
        role: "Workflows and marketing operations",
        out: "follow-through at scale",
        chips: ["Lifecycle flows", "Ops workflows", "Integrations"],
      },
    ],
  },
  {
    numeral: "IV",
    name: "Compounding",
    layers: [
      {
        number: "08",
        name: "Analytics",
        role: "Attribution, reporting, performance insight",
        out: "signal on what works",
        chips: ["Attribution", "Dashboards", "Signal reviews"],
      },
      {
        number: "09",
        name: "Reputation",
        role: "PR, trust signals, market authority",
        chips: ["PR placements", "Reviews & proof", "Authority signals"],
      },
    ],
  },
];

const LAYERS: Layer[] = GROUPS.flatMap((group) => group.layers);
const COUNT = LAYERS.length;

export function GrowthSystemSection() {
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  /* SSR and reduced motion show the finished drawing: bus fully lit,
     first layer on the readout. Scroll behavior arms after hydration. */
  const [frac, setFrac] = useState(1);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setFrac(0);

    let raf = 0;
    const measure = () => {
      raf = 0;
      const list = listRef.current;
      if (!list) return;
      const rect = list.getBoundingClientRect();
      const vh = window.innerHeight;
      setFrac(Math.min(Math.max((vh * 0.5 - rect.top) / rect.height, 0), 1));

      const focus = vh * 0.45;
      let best = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        const r = row.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - focus);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive((prev) => (prev === best ? prev : best));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const shown = hover ?? active;
  const shownLayer = LAYERS[shown];
  /* Junction y as a fraction of the panel's circuit area */
  const junctionY = (i: number) => ((i + 0.5) / COUNT) * 100;

  let flatIndex = -1;

  return (
    <section
      id="growth-system"
      aria-labelledby="growth-heading"
      className="overflow-x-clip border-t border-line"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        {/* Header — ledger-left, drawing title block right */}
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
          <Reveal className="max-w-[640px]">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              <Spark className="size-3.5 text-brand" aria-hidden />
              The system behind the brand
            </p>
            <h2
              id="growth-heading"
              className="mt-5 font-sans text-[clamp(2rem,4.2vw,3.5rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
            >
              The Plurel Growth System
            </h2>
            <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-ink/75 sm:text-base">
              Not a funnel &mdash; a circuit. Nine layers in four stages,
              wired so each one feeds the next and the last feeds the first:
              how modern companies are found, trusted, chosen, and
              remembered.
            </p>
          </Reveal>

          {/* Title block, like the corner of a technical drawing */}
          <Reveal delay={0.12} className="hidden sm:block">
            <dl
              aria-label="System summary"
              className="w-[248px] rounded-xl border border-line bg-paper text-[10px] font-semibold uppercase tracking-[0.16em]"
            >
              <div className="flex items-center justify-between px-4 py-2.5">
                <dt className="text-muted">System map</dt>
                <dd className="flex items-center gap-1.5 text-ink">
                  <Spark className="size-3 text-brand" aria-hidden />
                  SYS&middot;09
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                <dt className="text-muted">Layers</dt>
                <dd className="tabular-nums text-ink">09</dd>
              </div>
              <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                <dt className="text-muted">Stages</dt>
                <dd className="text-ink">I &ndash; IV</dd>
              </div>
              <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                <dt className="text-muted">Loop</dt>
                <dd className="text-brand">Compounding</dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <div className="mt-12 items-stretch gap-x-12 sm:mt-14 lg:grid lg:grid-cols-12">
          {/* The ledger */}
          <div ref={listRef} className="border-b border-line lg:col-span-7">
            {GROUPS.map((group) => (
              <Reveal key={group.numeral}>
                <p className="flex items-baseline gap-2 border-t border-ink/25 pb-2.5 pt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                  <span className="text-brand">{group.numeral}</span>
                  {group.name}
                </p>
                <ol>
                  {group.layers.map((layer) => {
                    flatIndex += 1;
                    const index = flatIndex;
                    const isShown = shown === index;
                    return (
                      <li
                        key={layer.number}
                        ref={(el) => {
                          rowRefs.current[index] = el;
                        }}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() =>
                          setHover((h) => (h === index ? null : h))
                        }
                        className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] border-t border-line py-4 sm:grid-cols-[3.25rem_minmax(0,1fr)_auto] sm:gap-x-6 sm:py-5"
                      >
                        {/* Focus tick */}
                        <span
                          aria-hidden
                          className={`absolute left-0 top-1/2 h-6 w-[2.5px] -translate-y-1/2 bg-brand transition-all duration-300 ${
                            isShown ? "opacity-100" : "scale-y-0 opacity-0"
                          }`}
                        />
                        <span
                          className={`pl-3 pt-[0.4em] text-[12px] font-semibold tabular-nums tracking-[0.08em] transition-colors duration-300 ${
                            isShown ? "text-brand" : "text-muted"
                          }`}
                        >
                          {layer.number}
                        </span>
                        <span className="min-w-0">
                          <span
                            className={`block text-[clamp(1.3rem,1.9vw,1.65rem)] font-normal leading-tight tracking-[-0.01em] transition-colors duration-300 ${
                              isShown ? "text-ink" : "text-ink/45"
                            }`}
                          >
                            {layer.name}
                          </span>
                          <span
                            className={`mt-1 block text-[13px] leading-snug transition-colors duration-300 ${
                              isShown ? "text-muted" : "text-muted/70"
                            }`}
                          >
                            {layer.role}
                          </span>
                          {/* Hand-off, inline on small screens */}
                          <span
                            className={`mt-2 block text-[9.5px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 sm:hidden ${
                              isShown ? "text-brand" : "text-muted/60"
                            }`}
                          >
                            {layer.out
                              ? `→ ${layer.out}`
                              : "↺ returns to 01 — compounds"}
                          </span>
                        </span>
                        {/* Hand-off annotation, right column */}
                        <span
                          className={`hidden self-center text-right text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 sm:block ${
                            isShown ? "text-brand" : "text-muted/60"
                          }`}
                        >
                          {layer.out
                            ? `→ ${layer.out}`
                            : "↺ returns to 01"}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </Reveal>
            ))}
          </div>

          {/* The drawing — one continuous drafted panel */}
          <Reveal
            aria-hidden
            delay={0.15}
            className="hidden lg:col-span-5 lg:block"
          >
            <div className="flex h-full flex-col rounded-3xl border border-line bg-paper">
              {/* Panel title strip */}
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em]">
                <span className="text-muted">
                  Plurel Growth System &mdash; schematic
                </span>
                <span className="flex items-center gap-1.5 text-ink">
                  <Spark className="size-3 text-brand" />
                  SYS&middot;09
                </span>
              </div>

              {/* Circuit */}
              <div className="relative flex-1">
                <div className="absolute inset-x-6 inset-y-7">
                  {/* Bus */}
                  <span className="absolute bottom-0 left-[5px] top-0 w-px bg-line" />
                  {/* Scroll fill + playhead */}
                  <span
                    className="absolute left-[4.5px] top-0 w-[1.5px] bg-brand transition-[height] duration-150 ease-linear"
                    style={{ height: `${frac * 100}%` }}
                  >
                    <span
                      className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-brand shadow-[0_0_10px_rgba(191,58,54,0.55)]"
                      style={{ opacity: frac > 0 && frac < 1 ? 1 : 0 }}
                    />
                  </span>

                  {/* Junctions */}
                  {LAYERS.map((layer, i) => {
                    const lit = (i + 0.5) / COUNT <= frac;
                    const isShown = shown === i;
                    return (
                      <span key={layer.number}>
                        <span
                          className={`absolute left-[5px] size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ${
                            isShown
                              ? "border-brand bg-brand shadow-[0_0_0_4px_rgba(191,58,54,0.14)]"
                              : lit
                                ? "border-brand bg-brand"
                                : "border-line bg-paper"
                          }`}
                          style={{ top: `${junctionY(i)}%` }}
                        />
                        <span
                          onMouseEnter={() => setHover(i)}
                          onMouseLeave={() =>
                            setHover((h) => (h === i ? null : h))
                          }
                          className={`absolute left-7 flex -translate-y-1/2 items-baseline gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-opacity duration-200 ${
                            isShown ? "opacity-0" : "opacity-100"
                          } ${lit ? "text-ink/70" : "text-muted/70"}`}
                          style={{ top: `${junctionY(i)}%` }}
                        >
                          <span className="tabular-nums text-muted">
                            {layer.number}
                          </span>
                          {layer.name}
                        </span>
                      </span>
                    );
                  })}

                  {/* Readout connector */}
                  <span
                    className="absolute left-[5px] right-[47%] border-t border-dashed border-brand/60 transition-[top] duration-300"
                    style={{ top: `${junctionY(shown)}%` }}
                  />
                  {/* Readout — follows the shown layer */}
                  <div
                    className="absolute right-0 w-[45%] -translate-y-1/2 transition-[top] duration-300"
                    style={{
                      top: `min(max(${junctionY(shown)}%, 72px), calc(100% - 72px))`,
                    }}
                  >
                    <div
                      key={shown}
                      className="glass-in rounded-xl border border-line bg-canvas p-4"
                    >
                      <p className="flex items-baseline gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                        <span className="tabular-nums text-brand">
                          {shownLayer.number}
                        </span>
                        {shownLayer.name}
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {shownLayer.chips.map((chip) => (
                          <li
                            key={chip}
                            className="rounded-full border border-line bg-paper px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink/70"
                          >
                            {chip}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 border-t border-line pt-2.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-muted">
                        {shownLayer.out
                          ? `→ ${shownLayer.out}`
                          : "↺ returns to 01"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel footer — the loop, stated */}
              <div className="flex items-center justify-between border-t border-line px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                <span>
                  <span className="pr-1.5 text-brand">&#8634;</span>
                  09 feeds 01
                </span>
                <span>The loop compounds</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
