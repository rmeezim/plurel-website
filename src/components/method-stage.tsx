"use client";

import { useEffect, useRef, useState } from "react";
import { Cascade } from "@/components/cascade";
import { Spark } from "@/components/icons";

export interface MethodOutput {
  label: string;
  detail: string;
}

export interface MethodPhase {
  number: string;
  name: string;
  tagline: string;
  description: string;
  outputs: MethodOutput[];
  ai: string;
}

/* Fixed diagram geometry (px, inside a 620x440 canvas) */
const DIAGRAM_W = 620;
const DIAGRAM_H = 440;
const CARD_W = 230;
const BUS_X = 302; // distribution spine — kept clear of the Outputs frame
const CHIP_LEFT = 374; // where connectors dock into the output nodes
const OUTPUT_Y = [62, 166, 270, 374];

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (t: number) => t * t * (3 - 2 * t);

/* Sequential scene windows: the outgoing scene finishes leaving at d=0.85
   exactly as the incoming one starts at its d=-0.15, so two phases never
   share the stage. Shared by the scenes and the stage-panel tints. */
function sceneWindow(d: number, last: boolean) {
  if (d < -0.15) return { alpha: 0, tx: 70 };
  if (d < 0) {
    const t = smooth((d + 0.15) / 0.15);
    return { alpha: t, tx: 70 * (1 - t) };
  }
  if (d <= 0.7 || last) return { alpha: 1, tx: 0 };
  if (d <= 0.85) {
    const t = smooth((d - 0.7) / 0.15);
    return { alpha: 1 - t, tx: -70 * t };
  }
  return { alpha: 0, tx: -70 };
}

/* The diagram panel warms subtly as the phases advance — canvas, then clay,
   then terracotta, landing on a faint brand tone for Compound. */
const PANEL_TINTS = [
  "rgba(236, 232, 223, 0)",
  "rgba(199, 180, 157, 0.18)",
  "rgba(166, 90, 69, 0.1)",
  "rgba(191, 58, 54, 0.08)",
];

/** Shared grid template so the static Outputs frame aligns with the scenes */
const SCENE_GRID =
  "mx-auto grid w-full max-w-[1160px] grid-cols-[minmax(0,400px)_620px] items-center justify-between gap-x-10";

/**
 * Scroll-driven operating-model stage. The section pins while the visitor
 * scrolls through four phases; each phase is a workflow diagram — a central
 * node feeding a framed group of output nodes over elbow connectors with a
 * continuous same-thickness pulse travelling the path — plus an AI sub-node
 * anchored to the card. Hovering an output opens a glass detail card with a
 * word-by-word cascade. Mobile, no-JS, and reduced-motion visitors get the
 * static timeline instead.
 */
export function MethodStage({ phases }: { phases: MethodPhase[] }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [openOutput, setOpenOutput] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setMounted(true);

    let raf = 0;
    const update = () => {
      raf = 0;
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.6) setEntered(true);
      const span = rect.height - window.innerHeight;
      if (span <= 0) return;
      setProgress(Math.round(clamp(-rect.top / span) * 2000) / 2000);
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

  const phaseFloat = progress * phases.length;
  /** The phase whose scene has begun entering — drives the narrative cascade */
  const activeIndex = Math.min(
    phases.length - 1,
    Math.max(0, Math.floor(phaseFloat + 0.15)),
  );

  return (
    <>
      {/* Scroll stage — desktop with JS and motion allowed */}
      {mounted && (
        <div ref={outerRef} className="relative hidden h-[380vh] lg:block">
          <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pb-8 pt-32">
            {/* Progress rail */}
            <div className="flex items-center gap-4">
              <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                In &mdash; an outdated presence
              </span>
              <div className="flex flex-1 items-center gap-3">
                {phases.map((phase, i) => {
                  const fill = clamp(phaseFloat - i);
                  const active = phaseFloat >= i && phaseFloat < i + 1;
                  return (
                    <div key={phase.number} className="flex-1">
                      <p
                        className={`text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                          active ? "text-ink" : "text-muted/70"
                        }`}
                      >
                        {phase.number} {phase.name}
                      </p>
                      <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-line">
                        <div
                          className="h-full origin-left rounded-full bg-brand"
                          style={{ transform: `scaleX(${fill})` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.18em] text-brand">
                Out &mdash; compounding growth
              </span>
            </div>

            {/* Stage area */}
            <div className="relative mt-6 flex-1">
              {/* Static stage furniture — the split panel the diagram lives
                  on and the Outputs frame, both persisting while scenes
                  change inside them */}
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 ${SCENE_GRID}`}
              >
                <div />
                <div
                  className="relative"
                  style={{ width: DIAGRAM_W, height: DIAGRAM_H }}
                >
                  {/* Panel — canvas surface, tint crossfading per phase */}
                  <div className="absolute -inset-y-8 -left-12 -right-8 rounded-[2rem] border border-line/70 bg-canvas">
                    {phases.map((phase, i) => (
                      <div
                        key={phase.number}
                        className="absolute inset-0 rounded-[2rem]"
                        style={{
                          backgroundColor: PANEL_TINTS[i] ?? PANEL_TINTS[0],
                          opacity: sceneWindow(
                            phaseFloat - i,
                            i === phases.length - 1,
                          ).alpha,
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute bottom-[16px] right-0 top-[14px] w-[280px] rounded-3xl border border-dashed border-muted/40">
                    <span className="absolute -top-7 left-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                      Outputs
                    </span>
                  </div>
                </div>
              </div>

              {/* Scenes */}
              {phases.map((phase, i) => {
                const d = phaseFloat - i;
                const last = i === phases.length - 1;
                const { alpha: opacity, tx } = sceneWindow(d, last);
                const branch = clamp(d / 0.5);
                const aiReveal = clamp((branch - 0.62) / 0.3);
                const pop = 0.94 + 0.06 * clamp((d + 0.15) / 0.3);
                const active = entered && i === activeIndex;

                return (
                  <div
                    key={phase.number}
                    aria-hidden={opacity === 0 || undefined}
                    className={`absolute inset-0 ${SCENE_GRID}`}
                    style={{
                      opacity,
                      transform: `translateX(${tx}px)`,
                      pointerEvents: opacity === 0 ? "none" : undefined,
                    }}
                  >
                    {/* Narrative column — assembles word by word when the
                        phase becomes active, renders plain otherwise */}
                    <div>
                      <span className="block text-7xl font-normal leading-none tracking-[-0.02em] text-muted/50">
                        {active ? <Cascade text={phase.number} /> : phase.number}
                      </span>
                      <h3 className="mt-5 text-3xl font-normal tracking-[-0.01em] text-ink">
                        {active ? (
                          <Cascade text={phase.name} base={0.06} />
                        ) : (
                          phase.name
                        )}
                      </h3>
                      <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                        {active ? (
                          <Cascade text={phase.tagline} base={0.12} step={0.025} />
                        ) : (
                          phase.tagline
                        )}
                      </p>
                      <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-ink/75">
                        {active ? (
                          <Cascade
                            text={phase.description}
                            base={0.2}
                            step={0.014}
                          />
                        ) : (
                          phase.description
                        )}
                      </p>
                    </div>

                    {/* Workflow diagram */}
                    <div
                      className="relative"
                      style={{ width: DIAGRAM_W, height: DIAGRAM_H }}
                    >
                      {/* Connectors */}
                      <svg
                        aria-hidden
                        width={DIAGRAM_W}
                        height={DIAGRAM_H}
                        viewBox={`0 0 ${DIAGRAM_W} ${DIAGRAM_H}`}
                        className="absolute inset-0"
                      >
                        {OUTPUT_Y.map((y, k) => {
                          const reveal = clamp((branch - 0.12 * k) / 0.4);
                          const d2 = `M${CARD_W} ${DIAGRAM_H / 2} H${BUS_X} V${y} H${CHIP_LEFT}`;
                          return (
                            <g key={y} fill="none" strokeLinecap="round">
                              <path d={d2} stroke="#d8d2c8" strokeWidth="1.5" />
                              <path
                                d={d2}
                                stroke="#bf3a36"
                                strokeOpacity="0.5"
                                strokeWidth="1.5"
                                pathLength={100}
                                strokeDasharray="100"
                                strokeDashoffset={100 * (1 - reveal)}
                              />
                              <path
                                d={d2}
                                className="method-pulse"
                                stroke="#bf3a36"
                                strokeWidth="1.5"
                                pathLength={100}
                                style={{
                                  opacity: reveal >= 1 ? 0.9 : 0,
                                  animationDelay: `${-(k * 550)}ms`,
                                }}
                              />
                            </g>
                          );
                        })}
                      </svg>

                      {/* Central node with anchored AI sub-node */}
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2"
                        style={{ width: CARD_W }}
                      >
                        <div
                          className="rounded-2xl border border-line bg-paper p-5 shadow-[0_16px_32px_-20px_rgba(17,15,10,0.4)]"
                          style={{ transform: `scale(${pop})` }}
                        >
                          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                            <span className="relative flex size-2">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
                              <span className="relative inline-flex size-2 rounded-full bg-brand" />
                            </span>
                            Phase {phase.number}
                          </p>
                          <p className="mt-2.5 text-[26px] font-normal leading-none tracking-[-0.01em] text-ink">
                            {phase.name}
                          </p>
                          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                            {phase.tagline}
                          </p>
                        </div>
                        {/* Dashed tail into the AI node — anchored to the card */}
                        <span
                          aria-hidden
                          className="absolute left-1/2 top-full h-[52px] border-l border-dashed border-brand/50"
                          style={{ opacity: aiReveal }}
                        />
                        <div
                          className="absolute left-1/2 top-[calc(100%+52px)] -translate-x-1/2"
                          style={{
                            opacity: aiReveal,
                            marginTop: `${6 * (1 - aiReveal)}px`,
                          }}
                        >
                          <span className="flex w-max items-center gap-2 rounded-full border border-dashed border-brand/60 bg-paper px-4 py-2.5 text-[13px] text-ink/80">
                            <Spark
                              className="size-3.5 shrink-0 text-brand"
                              aria-hidden
                            />
                            {phase.ai}
                          </span>
                        </div>
                      </div>

                      {/* Output nodes — hover for the glass detail card */}
                      {phase.outputs.map((output, k) => {
                        const reveal = clamp((branch - 0.12 * k - 0.18) / 0.3);
                        const key = `${phase.number}-${k}`;
                        const open = openOutput === key;
                        const below = k < 2;
                        return (
                          <div
                            key={output.label}
                            className="absolute right-[16px] w-[230px]"
                            style={{
                              top: OUTPUT_Y[k],
                              transform: `translateY(-50%) translateX(${14 * (1 - reveal)}px)`,
                              opacity: reveal,
                              zIndex: open ? 30 : undefined,
                            }}
                            onMouseEnter={() => setOpenOutput(key)}
                            onMouseLeave={() =>
                              setOpenOutput((current) =>
                                current === key ? null : current,
                              )
                            }
                          >
                            <span
                              tabIndex={0}
                              onFocus={() => setOpenOutput(key)}
                              onBlur={() =>
                                setOpenOutput((current) =>
                                  current === key ? null : current,
                                )
                              }
                              className={`flex w-full cursor-help items-center gap-2.5 rounded-full border bg-paper px-4 py-3 text-left text-sm leading-snug text-ink/85 shadow-[0_10px_20px_-16px_rgba(17,15,10,0.4)] outline-none transition-colors duration-300 ${
                                open
                                  ? "border-brand/70"
                                  : "border-line"
                              }`}
                            >
                              <span
                                aria-hidden
                                className="size-1.5 shrink-0 rounded-full bg-brand"
                              />
                              {output.label}
                            </span>
                            {open && (
                              <div
                                className={`glass-in absolute right-0 z-20 w-[248px] rounded-2xl border border-paper/70 bg-paper/70 p-4 text-[13px] leading-relaxed text-ink/85 shadow-[0_22px_44px_-20px_rgba(17,15,10,0.4)] backdrop-blur-md ${
                                  below ? "top-full mt-2.5" : "bottom-full mb-2.5"
                                }`}
                              >
                                {output.detail.split(" ").map((word, w) => (
                                  <span key={w}>
                                    {w > 0 && " "}
                                    <span
                                      className="word-in"
                                      style={{
                                        animationDelay: `${0.08 + w * 0.028}s`,
                                      }}
                                    >
                                      {word}
                                    </span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Static timeline — mobile, no-JS, and reduced motion */}
      <div className={`relative mt-14 lg:mt-24 ${mounted ? "lg:hidden" : ""}`}>
        <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.18em] text-muted lg:absolute lg:-top-9 lg:left-0 lg:mb-0">
          In &mdash; an outdated presence
        </p>
        <p className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-brand lg:absolute lg:-top-9 lg:right-0 lg:block">
          Out &mdash; compounding growth
        </p>

        <div
          aria-hidden
          className="absolute inset-x-0 top-[7px] hidden h-px bg-line lg:block"
        />
        <div
          aria-hidden
          className="absolute bottom-2 left-[6px] top-2 w-px bg-line lg:hidden"
        />

        <ol className="grid grid-cols-1 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
          {phases.map((phase) => (
            <li key={phase.number} className="group relative pl-10 lg:pl-0 lg:pt-10">
              <span
                aria-hidden
                className="absolute left-0 top-1 size-3.5 rounded-full bg-brand ring-4 ring-brand/15 lg:top-0"
              />
              <span className="block text-4xl font-normal leading-none tracking-[-0.02em] text-muted/60 transition-colors duration-300 group-hover:text-brand">
                {phase.number}
              </span>
              <h3 className="mt-3 text-2xl font-normal tracking-[-0.01em] text-ink">
                {phase.name}
              </h3>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                {phase.tagline}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/75">
                {phase.description}
              </p>

              <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                Outputs
              </p>
              <ul className="mt-3 space-y-2">
                {phase.outputs.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-2.5 rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-sm leading-snug text-ink/80"
                  >
                    <span
                      aria-hidden
                      className="size-1.5 shrink-0 rounded-full bg-brand"
                    />
                    {item.label}
                  </li>
                ))}
                <li className="flex items-center gap-2.5 rounded-lg border border-dashed border-brand/50 bg-paper px-3.5 py-2.5 text-sm leading-snug text-ink/80">
                  <Spark className="size-3.5 shrink-0 text-brand" aria-hidden />
                  {phase.ai}
                </li>
              </ul>
            </li>
          ))}
        </ol>

        <p className="mt-8 pl-10 text-[11px] font-medium uppercase tracking-[0.18em] text-brand lg:hidden">
          Out &mdash; compounding growth
        </p>
      </div>
    </>
  );
}
