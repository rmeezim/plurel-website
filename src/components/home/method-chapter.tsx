import { Reveal } from "@/components/reveal";
import {
  Accent,
  ChapterHead,
  CONTAINER,
  GRID,
  Meta,
  TextLink,
} from "@/components/system";
import { PHASES } from "@/lib/home";

/** (03) The operating model as four numbered chapters */
export function MethodChapter() {
  return (
    <section
      id="method"
      aria-labelledby="method-heading"
      className="relative bg-paper text-ink"
    >
      <div className={`${CONTAINER} relative py-24 lg:py-36`}>
        <ChapterHead index="03" label="Method" meta="Four phases · One operating model" />

        <div className={`${GRID} mt-14 gap-y-10 lg:mt-20`}>
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-8">
            <h2
              id="method-heading"
              className="text-[clamp(2.25rem,5vw,5rem)] font-normal leading-[0.98] tracking-[-0.04em]"
            >
              One operating model, from first <Accent>audit</Accent> to
              compounding growth.
            </h2>
          </Reveal>
          <Reveal
            delay={0.1}
            className="col-span-4 self-end sm:col-span-4 lg:col-span-3 lg:col-start-10"
          >
            <p className="text-[17px] leading-relaxed text-ink/70">
              Every engagement, from a focused sprint to a full transformation,
              runs the same four phases.
            </p>
            <TextLink href="/methodology" className="mt-7">
              The full method
            </TextLink>
          </Reveal>
        </div>

        <ol className={`${GRID} mt-16 gap-y-16 lg:mt-24`}>
          {PHASES.map((phase, i) => (
            <li key={phase.name} className="col-span-4 sm:col-span-3 lg:col-span-3">
              <Reveal delay={i * 0.08}>
                <span
                  aria-hidden
                  className="block text-[clamp(7rem,12vw,11.5rem)] font-light leading-[0.78] tracking-[-0.07em] text-brand"
                >
                  {phase.number}
                </span>
                <div className="mt-8 border-t border-ink/15 pt-5">
                  <Meta className="text-muted">
                    Phase {phase.number} · {phase.tagline}
                  </Meta>
                  <h3 className="mt-3 text-[28px] leading-tight tracking-[-0.02em]">
                    {phase.name}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
                    {phase.description}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {phase.outputs.map((output) => (
                      <li key={output} className="flex items-center gap-3 text-[14px] text-ink/80">
                        <span aria-hidden className="size-[5px] shrink-0 bg-ink/35" />
                        {output}
                      </li>
                    ))}
                  </ul>
                  <Meta as="p" className="mt-6 text-brand">
                    AI layer · {phase.ai}
                  </Meta>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
