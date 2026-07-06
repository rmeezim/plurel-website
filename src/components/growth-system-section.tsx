"use client";

import { useEffect, useRef, useState } from "react";
import { Megaphone, Spark, Trend } from "@/components/icons";
import { Reveal } from "@/components/reveal";

/*
 * The Plurel Growth System as a vertical circuit. A spine runs down the
 * page; a brand-red fill tracks the visitor's scroll and ignites each
 * layer's node as it passes. Edges carry meaning — a serif flow label
 * between layers names what each one hands to the next — and a dashed
 * return rail climbs the right margin from the last node back to the
 * first, closing the loop the section is about. Reduced-motion and no-JS
 * visitors get the complete, fully-lit diagram with no scroll theatre.
 */

type IconProps = React.SVGProps<SVGSVGElement>;

function GlyphSite(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M4 9h16" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6.8" cy="7" r="0.9" fill="currentColor" />
      <path
        d="M7 13.5h6M7 16h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlyphSearch(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m14.8 14.8 4.7 4.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10.5 8.2v4.6M8.2 10.5h4.6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlyphContent(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M5 6h14M5 10.5h14M5 15h9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M5 19h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

function GlyphCrm(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="7" cy="7.5" r="2.6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="7.5" r="2.6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="17" r="2.6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9.6 7.5h4.8M8.2 9.8l2.4 4.6M15.8 9.8l-2.4 4.6"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function GlyphAutomation(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M19 12a7 7 0 1 1-2.05-4.95"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17.2 3.6v3.6h-3.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

function GlyphAnalytics(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M5 19.5v-6M10.5 19.5V9M16 19.5v-8.5M21 19.5v-13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

type Stage = {
  number: string;
  name: string;
  desc: string;
  Glyph: (props: IconProps) => React.ReactElement;
  /** What this layer hands to the next — rendered on the edge below it */
  flow?: string;
};

type Group = { numeral: string; name: string; stages: Stage[] };

const GROUPS: Group[] = [
  {
    numeral: "I",
    name: "Foundation",
    stages: [
      {
        number: "01",
        name: "Brand",
        desc: "Positioning, identity, narrative",
        Glyph: Spark,
        flow: "identity & positioning",
      },
      {
        number: "02",
        name: "Website",
        desc: "Conversion architecture and digital experience",
        Glyph: GlyphSite,
        flow: "a conversion-ready home",
      },
    ],
  },
  {
    numeral: "II",
    name: "Demand",
    stages: [
      {
        number: "03",
        name: "AI Search",
        desc: "SEO, AEO, answer-engine visibility",
        Glyph: GlyphSearch,
        flow: "machine-readable authority",
      },
      {
        number: "04",
        name: "Content",
        desc: "Thought leadership and demand creation",
        Glyph: GlyphContent,
        flow: "proof & perspective",
      },
      {
        number: "05",
        name: "Paid Growth",
        desc: "Campaigns, funnels, creative testing",
        Glyph: Trend,
        flow: "qualified attention",
      },
    ],
  },
  {
    numeral: "III",
    name: "Operations",
    stages: [
      {
        number: "06",
        name: "CRM",
        desc: "Lead capture, routing, follow-up",
        Glyph: GlyphCrm,
        flow: "captured demand",
      },
      {
        number: "07",
        name: "Automation",
        desc: "Workflows and marketing operations",
        Glyph: GlyphAutomation,
        flow: "follow-through at scale",
      },
    ],
  },
  {
    numeral: "IV",
    name: "Compounding",
    stages: [
      {
        number: "08",
        name: "Analytics",
        desc: "Attribution, reporting, performance insight",
        Glyph: GlyphAnalytics,
        flow: "signal on what works",
      },
      {
        number: "09",
        name: "Reputation",
        desc: "PR, trust signals, market authority",
        Glyph: Megaphone,
      },
    ],
  },
];

const STAGE_COUNT = GROUPS.reduce((n, g) => n + g.stages.length, 0);

/* Shared row template: 0-width label col on mobile, 210px on desktop;
   28px spine gutter on mobile, 56px on desktop. The spine line lives at
   the gutter's center — 14px / 238px from the block's left edge. */
const ROW_GRID =
  "grid grid-cols-[0px_28px_minmax(0,1fr)] lg:grid-cols-[210px_56px_minmax(0,1fr)]";

export function GrowthSystemSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  /* SSR + reduced motion render the finished diagram: every node lit, no
     fill. The scroll treatment only arms after hydration. */
  const [dynamic, setDynamic] = useState(false);
  const [fill, setFill] = useState(0);
  const [lit, setLit] = useState<boolean[]>(() =>
    Array.from({ length: STAGE_COUNT }, () => true),
  );
  const [rail, setRail] = useState<{
    w: number;
    y1: number;
    y2: number;
  } | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setDynamic(true);
    setLit(Array.from({ length: STAGE_COUNT }, () => false));

    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      /* The fill's leading edge rides slightly above the viewport's
         center, so a node ignites right as its card settles into focus */
      const front = Math.min(
        Math.max(window.innerHeight * 0.55 - rect.top, 0),
        rect.height,
      );
      setFill(Math.round(front));

      const centers = nodeRefs.current.map((node) => {
        if (!node) return Number.POSITIVE_INFINITY;
        const r = node.getBoundingClientRect();
        return r.top + r.height / 2 - rect.top;
      });
      setLit((prev) => {
        const next = centers.map((c) => c <= front);
        return next.every((v, i) => v === prev[i]) ? prev : next;
      });

      const y1 = centers[0];
      const y2 = centers[centers.length - 1];
      if (Number.isFinite(y1) && Number.isFinite(y2)) {
        setRail((prev) =>
          prev &&
          Math.abs(prev.w - rect.width) < 1 &&
          Math.abs(prev.y1 - y1) < 1 &&
          Math.abs(prev.y2 - y2) < 1
            ? prev
            : { w: rect.width, y1, y2 },
        );
      }
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

  /* Return rail geometry — from the last node, out to the right margin,
     up, and back into the first node. Drawn start-to-end so the travelling
     pulse climbs the rail in the compounding direction. */
  const railX = rail ? rail.w - 8 : 0;
  const railPath = rail
    ? `M 238 ${rail.y2} H ${railX - 28} Q ${railX} ${rail.y2} ${railX} ${
        rail.y2 - 28
      } V ${rail.y1 + 28} Q ${railX} ${rail.y1} ${railX - 28} ${
        rail.y1
      } H 246`
    : "";

  let stageIndex = -1;

  return (
    <section
      id="growth-system"
      aria-labelledby="growth-heading"
      className="overflow-x-clip border-t border-line"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        {/* Header — centered */}
        <Reveal className="mx-auto max-w-[680px] text-center">
          <p className="flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            <Spark className="size-3.5 text-brand" aria-hidden />
            The system behind the brand
          </p>
          <h2
            id="growth-heading"
            className="mt-5 font-sans text-[clamp(2rem,4.4vw,3.75rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
          >
            The Plurel <em className="font-serif italic">Growth System</em>
          </h2>
          <p className="mx-auto mt-5 max-w-[54ch] text-[15px] leading-relaxed text-ink/75 sm:text-base">
            Not a funnel &mdash; a circuit. Nine layers, each feeding the
            next, for how modern companies are found, trusted, chosen, and
            remembered.
          </p>
        </Reveal>

        {/* The circuit */}
        <div
          ref={wrapRef}
          className="relative mx-auto mt-12 w-full max-w-[1120px] sm:mt-16"
        >
          {/* Spine track */}
          <div
            aria-hidden
            className="absolute bottom-3 top-1 w-px bg-line left-[14px] lg:left-[238px]"
          />
          {/* Scroll fill + playhead */}
          {dynamic && (
            <div
              aria-hidden
              className="absolute top-1 w-[1.5px] bg-brand left-[13.5px] lg:left-[237.5px]"
              style={{ height: fill }}
            >
              <span
                className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-brand shadow-[0_0_10px_rgba(191,58,54,0.55)]"
                style={{ opacity: fill > 0 ? 1 : 0 }}
              />
            </div>
          )}

          {/* Return rail — desktop only, measured after mount */}
          {rail && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden lg:block"
            >
              <svg
                className="absolute inset-0 h-full w-full"
                fill="none"
                aria-hidden
              >
                <path
                  d={railPath}
                  stroke="var(--color-line)"
                  strokeWidth="1"
                  strokeDasharray="3 7"
                />
                <path
                  d={railPath}
                  className="method-pulse"
                  pathLength={100}
                  stroke="var(--color-brand)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.8"
                  style={{
                    strokeDasharray: "4 100",
                    animationDuration: "7s",
                  }}
                />
                {/* Arrowhead feeding back into Brand */}
                <path
                  d={`M 249 ${rail.y1 - 3.5} L 242 ${rail.y1} L 249 ${
                    rail.y1 + 3.5
                  }`}
                  stroke="var(--color-muted)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 font-serif text-[12.5px] italic text-muted"
                style={{ left: railX, top: (rail.y1 + rail.y2) / 2 }}
              >
                <span aria-hidden className="not-italic">
                  &#8634;
                </span>
                compounds
              </span>
            </div>
          )}

          {/* Layers, grouped */}
          {GROUPS.map((group, groupIdx) => (
            <div key={group.numeral} className={groupIdx > 0 ? "mt-2" : ""}>
              {/* Stage kicker — left of the spine on desktop, above on mobile */}
              <Reveal className={ROW_GRID}>
                <p className="hidden pr-6 pt-1 text-right text-[10px] font-semibold uppercase tracking-[0.2em] text-muted lg:col-start-1 lg:block">
                  <span className="text-brand">{group.numeral}</span>
                  <span className="px-1.5 text-line">&mdash;</span>
                  {group.name}
                </p>
                <p className="col-start-3 pb-3 pl-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted lg:hidden">
                  <span className="text-brand">{group.numeral}</span>
                  <span className="px-1.5 text-line">&mdash;</span>
                  {group.name}
                </p>
              </Reveal>

              <ol>
                {group.stages.map((stage) => {
                  stageIndex += 1;
                  const index = stageIndex;
                  const isLit = lit[index];
                  return (
                    <li key={stage.number}>
                      <div className={`relative ${ROW_GRID}`}>
                        {/* Node on the spine */}
                        <span aria-hidden className="relative col-start-2 block">
                          <span
                            ref={(el) => {
                              nodeRefs.current[index] = el;
                            }}
                            className={`absolute left-1/2 top-6 size-3 -translate-x-1/2 rounded-full border-[1.5px] transition-all duration-500 ${
                              isLit
                                ? "border-brand bg-brand shadow-[0_0_0_5px_rgba(191,58,54,0.12)]"
                                : "border-line bg-canvas"
                            }`}
                          />
                        </span>
                        {/* Connector, spine → card */}
                        <span
                          aria-hidden
                          className={`absolute top-[30px] border-t border-dashed transition-colors duration-500 left-[14px] w-[30px] lg:left-[238px] lg:w-[52px] ${
                            isLit ? "border-brand/50" : "border-line"
                          }`}
                        />
                        {/* Card */}
                        <div className="col-start-3 min-w-0 pb-4 pl-4 lg:pl-6">
                          <Reveal>
                            <div
                              className={`flex max-w-[560px] items-start justify-between gap-4 rounded-2xl border bg-paper p-5 shadow-[0_14px_30px_-24px_rgba(17,15,10,0.4)] transition-colors duration-500 ${
                                isLit ? "border-ink/15" : "border-line"
                              }`}
                            >
                              <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                                  {stage.number}
                                </p>
                                <p className="mt-1.5 text-[16px] font-medium leading-tight tracking-[-0.01em] text-ink sm:text-[17px]">
                                  {stage.name}
                                </p>
                                <p className="mt-1 text-[13px] leading-snug text-muted">
                                  {stage.desc}
                                </p>
                              </div>
                              <span
                                aria-hidden
                                className={`grid size-11 shrink-0 place-items-center rounded-full border bg-canvas transition-colors duration-500 ${
                                  isLit
                                    ? "border-brand/40 text-brand"
                                    : "border-line text-ink/70"
                                }`}
                              >
                                <stage.Glyph className="size-[18px]" />
                              </span>
                            </div>
                          </Reveal>
                        </div>
                      </div>

                      {/* Edge — what this layer hands to the next */}
                      {stage.flow && (
                        <Reveal className={ROW_GRID} delay={0.08}>
                          <p className="hidden pb-4 pr-6 pt-1 text-right font-serif text-[13px] italic leading-snug text-muted lg:col-start-1 lg:block">
                            {stage.flow}
                            <span aria-hidden className="pl-1.5 not-italic">
                              &darr;
                            </span>
                          </p>
                          <p className="col-start-3 pb-5 pl-4 font-serif text-[13px] italic text-muted lg:hidden">
                            <span aria-hidden className="pr-1.5 not-italic">
                              &darr;
                            </span>
                            {stage.flow}
                          </p>
                        </Reveal>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}

          {/* The loop, spelled out where the rail can't be drawn */}
          <Reveal className={`${ROW_GRID} lg:hidden`}>
            <p className="col-start-3 pl-4 pt-2 font-serif text-[13px] italic text-muted">
              <span aria-hidden className="pr-1.5 not-italic">
                &#8634;
              </span>
              trust feeds back into the brand &mdash; the loop compounds
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
