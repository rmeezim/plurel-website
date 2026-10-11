import { Reveal } from "@/components/reveal";
import { ChapterHead, CONTAINER, GRID, H2, Meta, TextLink } from "@/components/system";
import { PHASES } from "@/lib/home";

const pad = (n: number) => String(n).padStart(2, "0");

/*
  Method: the four phases as a time chart in a red room. Phase 01 is the
  Diagnostic, named here so the closing can pay it off. Mono only for the
  four phase numbers, whose order is real; the time axis is plain sans.

  Desktop: each phase is one column (span 3) whose rows line up across
  all four through subgrid: bar, name, description, deliverables. Mobile
  and tablet: the chart turns vertical. A thin left
  rail brackets phases 01-03 as quarter one and points down past 04 as
  always on, and each phase keeps a quarter-width bar shifted a quarter
  further along, so the staircase still reads.
*/

/* Gantt staircase. Desktop: each 10px bar drops one 16px step and runs
   across the gutter to where the next one starts; Compound's ends in an
   arrow. Mobile: a quarter-width bar, its start shifted a quarter per phase. */
const BAR = [
  "lg:mt-0 lg:-mr-8",
  "ml-[25%] lg:mt-4 lg:-mr-8",
  "ml-[50%] lg:mt-8 lg:-mr-8",
  "ml-[75%] lg:mt-12",
];
const ARROW_TIP =
  "[clip-path:polygon(0_0,calc(100%_-_10px)_0,100%_50%,calc(100%_-_10px)_100%,0_100%)]";

/* The bars draw left to right once, 120ms apart, keyed off each phase's
   Reveal: collapsed while it is armed, transitioning only once it is in.
   No-JS, reduced-motion and already-on-screen visitors get finished bars. */
const BAR_DRAW =
  "origin-left scale-x-100 motion-safe:[.reveal-armed_&]:scale-x-0 " +
  "motion-safe:[.reveal-in_&]:transition-transform motion-safe:[.reveal-in_&]:duration-700 " +
  "motion-safe:[.reveal-in_&]:ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-safe:[.reveal-in_&]:delay-200";
const BAR_DELAY = [
  "lg:motion-safe:[.reveal-in_&]:delay-150",
  "lg:motion-safe:[.reveal-in_&]:delay-[270ms]",
  "lg:motion-safe:[.reveal-in_&]:delay-[390ms]",
  "lg:motion-safe:[.reveal-in_&]:delay-[510ms]",
];

/* Mobile rail: a bracket from 01 to the end of 03 (ticks point at the
   content), then an open arrow down the side of 04 */
const RAIL = [
  "top-[7px] bottom-0 border-t",
  "top-0 bottom-0",
  "top-0 bottom-14 border-b sm:bottom-16",
  "top-[7px] bottom-0 border-t",
];
const RAIL_LABEL: Record<number, string> = { 0: "Quarter one", 3: "Always on" };

/** Method: the four phases drawn as a time chart */
export function MethodChapter() {
  return (
    <section
      id="method"
      aria-labelledby="method-heading"
      className="bg-brand text-paper"
    >
      <div className={`${CONTAINER} py-24 lg:py-36`}>
        <ChapterHead label="Method" tone="red" />

        <div className={`${GRID} mt-8 gap-y-8 lg:mt-10 lg:items-end`}>
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-8">
            <h2
              id="method-heading"
              className={H2}
            >
              One operating model, from first diagnosis to compounding growth.
            </h2>
          </Reveal>
          <Reveal
            delay={0.1}
            className="col-span-4 sm:col-span-4 lg:col-span-3 lg:col-start-10 lg:pb-1"
          >
            <p className="max-w-[40ch] text-[16px] leading-[1.55]">
              Most engagements run all four as one monthly partnership. A focused
              sprint, like a rebrand or a new site, takes four to eight weeks.
            </p>
            <TextLink href="/methodology" tone="red" className="mt-4">
              The full method
            </TextLink>
          </Reveal>
        </div>

        <figure aria-label="The four phases over time" className="mt-16 lg:mt-24">
          {/* Time axis, drawn once: a bracket for quarter one (01-03) and an
              open arrow for always on (04). Below lg the rail takes over. */}
          <div aria-hidden className="hidden lg:block">
            <div className={GRID}>
              <div className="relative col-span-9 pb-3">
                <span className="block text-[14px] font-medium">Quarter one</span>
                <span className="absolute inset-x-0 bottom-0 h-[7px] border border-b-0 border-paper" />
              </div>
              <div className="relative col-span-3 pb-3">
                <span className="block text-[14px] font-medium">Always on</span>
                <span className="absolute inset-x-0 bottom-0 h-[7px] border-l border-t border-paper" />
                <span className="absolute bottom-[3px] right-px size-2 rotate-45 border-r border-t border-paper" />
              </div>
            </div>
          </div>

          <ol className={`${GRID} mt-10 lg:mt-4`}>
            {PHASES.map((phase, i) => {
              return (
                <li
                  key={phase.name}
                  className={`relative col-span-4 pl-6 sm:col-span-6 sm:pl-8 lg:col-span-3 lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:pb-0 lg:pl-0 ${
                    i < PHASES.length - 1 ? "pb-14 sm:pb-16" : ""
                  }`}
                >
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute left-0 w-[7px] border-l border-paper lg:hidden ${RAIL[i]}`}
                  >
                    {i === PHASES.length - 1 && (
                      <span className="absolute -bottom-px left-[-4.5px] size-2 rotate-45 border-b border-r border-paper" />
                    )}
                  </span>

                  <Reveal
                    delay={i * 0.08}
                    className="lg:row-span-4 lg:grid lg:grid-rows-subgrid"
                  >
                    {RAIL_LABEL[i] && (
                      <p className="mb-4 text-[14px] font-medium lg:sr-only">
                        {RAIL_LABEL[i]}
                      </p>
                    )}

                    {/* Row 1: the phase's bar on the staircase */}
                    <span
                      aria-hidden
                      className={`block h-2.5 w-1/4 bg-paper lg:ml-0 lg:w-auto ${BAR[i]} ${BAR_DRAW} ${BAR_DELAY[i]} ${
                        i === PHASES.length - 1 ? ARROW_TIP : ""
                      }`}
                    />

                    {/* Row 2: index, name, tagline */}
                    <div className="mt-6 lg:mt-[30px]">
                      <div aria-hidden className="flex">
                        <Meta>{pad(i + 1)}</Meta>
                      </div>
                      <h3 className="type-display mt-3 text-[2rem] leading-none lg:text-[clamp(2rem,3.1vw,2.5rem)]">
                        {phase.name}
                      </h3>
                      <p className="mt-2.5 text-[15px] font-medium">
                        {phase.tagline}
                      </p>
                    </div>

                    {/* Row 3: description */}
                    <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.55] lg:mt-5 lg:max-w-none lg:pr-2 lg:text-[14px]">
                      {phase.description}
                    </p>

                    {/* Row 4: the deliverables */}
                    <ul
                      aria-label={`${phase.name} deliverables`}
                      className="mt-8 border-t border-paper/45 sm:grid sm:grid-cols-2 sm:gap-x-6 lg:mt-9 lg:block"
                    >
                      {phase.outputs.map((output) => (
                        <li
                          key={output}
                          className="border-b border-paper/30 py-[9px] text-[14px] leading-[1.35]"
                        >
                          {output}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </li>
              );
            })}
          </ol>

          {/* Where AI helps: one continuous band under all four phases,
              each line under its own phase */}
          <Reveal delay={0.1} className="mt-14 lg:mt-12">
            <p
              id="method-ai"
              className="border-b border-paper/45 pb-3 text-[15px] font-medium leading-[1.35]"
            >
              Where AI helps, and where a person decides
            </p>
            <ul aria-labelledby="method-ai" className={`${GRID} bg-graphite px-5 sm:px-6 lg:px-0`}>
              {PHASES.map((phase) => (
                <li
                  key={phase.ai}
                  className="col-span-4 flex items-baseline gap-3 border-t border-fog/20 py-4 first:border-t-0 sm:col-span-6 lg:col-span-3 lg:gap-2.5 lg:border-t-0 lg:py-5 lg:pl-4 lg:pr-3"
                >
                  <span aria-hidden className="size-[7px] shrink-0 -translate-y-px bg-signal" />
                  <span className="text-[14px] leading-[1.45]">{phase.ai}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </figure>
      </div>
    </section>
  );
}
