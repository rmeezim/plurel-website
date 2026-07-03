"use client";

import { useEffect, useRef, useState } from "react";
import { Close, Spark } from "@/components/icons";

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

/** Vertical positions (%) of the four output nodes */
const OUTPUT_Y = [14, 38, 62, 86];

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Scroll-driven operating-model stage. The section pins while the visitor
 * scrolls through four phases; each phase is a workflow diagram — a central
 * node feeding a framed group of output nodes over energized connectors with
 * a continuous pulse current, plus a dashed AI sub-node. Output nodes expand
 * on click to explain their deliverable. Mobile, no-JS, and reduced-motion
 * visitors get the static timeline instead.
 */
export function MethodStage({ phases }: { phases: MethodPhase[] }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
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

  return (
    <>
      {/* Scroll stage — desktop with JS and motion allowed */}
      {mounted && (
        <div ref={outerRef} className="relative hidden h-[380vh] lg:block">
          <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pb-8 pt-24">
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

            {/* Scenes */}
            <div className="relative mt-6 flex-1">
              {phases.map((phase, i) => {
                const d = phaseFloat - i;
                const last = i === phases.length - 1;
                let opacity = 0;
                let tx = 90;
                if (d < -0.28) {
                  opacity = 0;
                  tx = 90;
                } else if (d < 0) {
                  const t = (d + 0.28) / 0.28;
                  opacity = t;
                  tx = 90 * (1 - t);
                } else if (d <= 0.72 || last) {
                  opacity = 1;
                  tx = 0;
                } else if (d <= 1) {
                  const t = (d - 0.72) / 0.28;
                  opacity = 1 - t;
                  tx = -90 * t;
                }
                if (d > 1 && !last) opacity = 0;
                const branch = clamp(d / 0.5);
                const aiReveal = clamp((branch - 0.62) / 0.3);
                const pop = 0.94 + 0.06 * clamp((d + 0.28) / 0.32);

                return (
                  <div
                    key={phase.number}
                    aria-hidden={opacity === 0 || undefined}
                    className="absolute inset-0 grid grid-cols-[minmax(0,380px)_minmax(0,1fr)] items-center gap-x-16"
                    style={{
                      opacity,
                      transform: `translateX(${tx}px)`,
                      pointerEvents: opacity === 0 ? "none" : undefined,
                    }}
                  >
                    {/* Narrative column */}
                    <div>
                      <span className="block text-7xl font-normal leading-none tracking-[-0.02em] text-muted/50">
                        {phase.number}
                      </span>
                      <h3 className="mt-5 text-3xl font-normal tracking-[-0.01em] text-ink">
                        {phase.name}
                      </h3>
                      <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                        {phase.tagline}
                      </p>
                      <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-ink/75">
                        {phase.description}
                      </p>
                    </div>

                    {/* Workflow diagram */}
                    <div className="relative h-[440px]">
                      {/* Output group frame */}
                      <div
                        aria-hidden
                        className="absolute -right-4 bottom-[2%] top-[4%] w-[286px] rounded-2xl border border-dashed border-muted/40"
                        style={{ opacity: clamp(branch * 1.6) }}
                      >
                        <span className="absolute -top-2.5 left-5 bg-paper px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                          Outputs
                        </span>
                      </div>

                      {/* Connectors — elbow segments that energize in sequence */}
                      {OUTPUT_Y.map((y, k) => {
                        const reveal = clamp((branch - 0.12 * k) / 0.4);
                        const up = y < 50;
                        const vTop = up ? y : 50;
                        const vHeight = Math.abs(y - 50);
                        const seg = reveal * 3;
                        const h1 = clamp(seg);
                        const v = clamp(seg - 1);
                        const h2 = clamp(seg - 2);
                        return (
                          <span aria-hidden key={y}>
                            {/* Base lines */}
                            <span className="absolute left-[26%] top-1/2 h-px w-[24%] bg-line" />
                            <span
                              className="absolute left-1/2 w-px bg-line"
                              style={{ top: `${vTop}%`, height: `${vHeight}%` }}
                            />
                            <span
                              className="absolute left-1/2 h-px w-[23%] bg-line"
                              style={{ top: `${y}%` }}
                            />
                            {/* Energized overlay */}
                            <span
                              className="absolute left-[26%] top-1/2 h-px w-[24%] origin-left bg-brand/60"
                              style={{ transform: `scaleX(${h1})` }}
                            />
                            <span
                              className={`absolute left-1/2 w-px bg-brand/60 ${up ? "origin-bottom" : "origin-top"}`}
                              style={{
                                top: `${vTop}%`,
                                height: `${vHeight}%`,
                                transform: `scaleY(${v})`,
                              }}
                            />
                            <span
                              className="absolute left-1/2 h-px w-[23%] origin-left bg-brand/60"
                              style={{ top: `${y}%`, transform: `scaleX(${h2})` }}
                            />
                            {/* Continuous pulse current, once energized */}
                            <span
                              className="absolute left-[26%] top-1/2 h-px w-[24%]"
                              style={{ opacity: h1 >= 1 ? 1 : 0 }}
                            >
                              <span
                                className="method-comet"
                                style={{ animationDelay: `${k * 0.65}s` }}
                              />
                            </span>
                            <span
                              className="absolute left-1/2 h-px w-[23%]"
                              style={{
                                top: `${y}%`,
                                opacity: h2 >= 1 ? 1 : 0,
                              }}
                            >
                              <span
                                className="method-comet"
                                style={{ animationDelay: `${k * 0.65 + 0.9}s` }}
                              />
                            </span>
                          </span>
                        );
                      })}

                      {/* Dashed drop to the AI sub-node */}
                      <span
                        aria-hidden
                        className="absolute left-[11%] top-[68%] h-[16%] border-l border-dashed border-brand/50"
                        style={{ opacity: aiReveal }}
                      />

                      {/* Central node */}
                      <div
                        className="absolute left-0 top-1/2 w-[240px] -translate-y-1/2 rounded-2xl border border-line bg-canvas p-5 shadow-[0_16px_32px_-20px_rgba(17,15,10,0.4)]"
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

                      {/* Output nodes — click to expand what each one is */}
                      {phase.outputs.map((output, k) => {
                        const reveal = clamp((branch - 0.12 * k - 0.18) / 0.3);
                        const key = `${phase.number}-${k}`;
                        const open = openOutput === key;
                        const popBelow = k < 2;
                        return (
                          <div
                            key={output.label}
                            className="absolute right-0 w-[250px]"
                            style={{
                              top: `${OUTPUT_Y[k]}%`,
                              transform: `translateY(-50%) translateX(${14 * (1 - reveal)}px)`,
                              opacity: reveal,
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => setOpenOutput(open ? null : key)}
                              aria-expanded={open}
                              className={`flex w-full items-center gap-2.5 rounded-full border bg-canvas px-4 py-3 text-left text-sm leading-snug text-ink/85 shadow-[0_10px_20px_-16px_rgba(17,15,10,0.4)] transition-colors ${
                                open
                                  ? "border-brand"
                                  : "border-line hover:border-brand/60"
                              }`}
                            >
                              <span
                                aria-hidden
                                className="size-1.5 shrink-0 rounded-full bg-brand"
                              />
                              <span className="flex-1">{output.label}</span>
                              <Close
                                aria-hidden
                                className={`size-3.5 shrink-0 text-muted transition-transform duration-300 ${
                                  open ? "rotate-0 text-brand" : "rotate-45"
                                }`}
                              />
                            </button>
                            {open && (
                              <div
                                className={`absolute right-0 z-10 w-[250px] rounded-xl border border-line bg-paper p-4 text-[13px] leading-relaxed text-ink/75 shadow-[0_18px_36px_-16px_rgba(17,15,10,0.35)] ${
                                  popBelow ? "top-full mt-2" : "bottom-full mb-2"
                                }`}
                              >
                                {output.detail}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* AI sub-node */}
                      <div
                        className="absolute bottom-[6%] left-0"
                        style={{
                          opacity: aiReveal,
                          transform: `translateY(${8 * (1 - aiReveal)}px)`,
                        }}
                      >
                        <span className="flex items-center gap-2 rounded-full border border-dashed border-brand/60 bg-paper px-4 py-2.5 text-[13px] text-ink/80">
                          <Spark className="size-3.5 shrink-0 text-brand" aria-hidden />
                          {phase.ai}
                        </span>
                      </div>
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
