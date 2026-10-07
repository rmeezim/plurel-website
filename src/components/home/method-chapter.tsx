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

const pad = (n: number) => String(n).padStart(2, "0");
const DELIVERABLES = PHASES.reduce((total, phase) => total + phase.outputs.length, 0);

/*
  The operating model as a schematic time chart in a red room.

  Desktop: each phase is one column (span 3) whose rows line up across
  all four through subgrid: bar, name, description, lane head,
  deliverables. Mobile and tablet: the chart turns vertical. A thin left
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

/** (03) Method: the four-phase operating model drawn as a time chart */
export function MethodChapter() {
  return (
    <section
      id="method"
      aria-labelledby="method-heading"
      className="bg-brand text-paper"
    >
      <div className={`${CONTAINER} py-24 lg:py-36`}>
        {/* ChapterHead's red tone sets its 11px meta in blush (3.6:1, below
            AA); hold it at paper until the primitive does. */}
        <div className="[&_span]:text-paper">
          <ChapterHead
            index="03"
            label="Method"
            meta="Four phases · One operating model"
            tone="red"
          />
        </div>

        <div className={`${GRID} mt-14 gap-y-8 lg:mt-[72px] lg:items-end`}>
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-8">
            <h2
              id="method-heading"
              className="type-display text-[clamp(2.5rem,4.7vw,3.75rem)] leading-none"
            >
              One operating model, from first{" "}
              <Accent className="text-blush">diagnosis</Accent> to compounding
              growth.
            </h2>
          </Reveal>
          <Reveal
            delay={0.1}
            className="col-span-4 sm:col-span-4 lg:col-span-3 lg:col-start-10 lg:pb-1"
          >
            <p className="max-w-[40ch] text-[16px] leading-[1.55]">
              Every engagement, from a focused sprint to a full transformation,
              runs the same four phases.
            </p>
            <TextLink href="/methodology" tone="red" className="mt-4">
              The full method
            </TextLink>
          </Reveal>
        </div>

        <figure className="mt-16 lg:mt-20">
          <figcaption
            className={`${GRID} items-baseline gap-y-1.5 border-b border-paper pb-3.5`}
          >
            <Meta className="col-span-1 lg:col-span-3">Fig. 03</Meta>
            <span className="col-span-3 text-[15px] font-medium lg:col-span-5">
              The operating model over time
            </span>
            <Meta className="col-span-3 col-start-2 sm:col-span-2 sm:col-start-auto sm:text-right lg:col-span-4">
              Schematic · not to scale
            </Meta>
          </figcaption>

          {/* Time axis, drawn once: a bracket for quarter one (01-03) and an
              open arrow for always on (04). Below lg the rail takes over. */}
          <div aria-hidden className="mt-[26px] hidden lg:block">
            <div className={GRID}>
              <div className="relative col-span-9 pb-3">
                <Meta className="block">Quarter one</Meta>
                <span className="absolute inset-x-0 bottom-0 h-[7px] border border-b-0 border-paper" />
              </div>
              <div className="relative col-span-3 pb-3">
                <Meta className="block">Always on</Meta>
                <span className="absolute inset-x-0 bottom-0 h-[7px] border-l border-t border-paper" />
                <span className="absolute bottom-[3px] right-px size-2 rotate-45 border-r border-t border-paper" />
              </div>
            </div>
          </div>

          <ol className={`${GRID} mt-10 lg:mt-4`}>
            {PHASES.map((phase, i) => {
              const count = phase.outputs.length;
              return (
                <li
                  key={phase.name}
                  className={`relative col-span-4 pl-6 sm:col-span-6 sm:pl-8 lg:col-span-3 lg:row-span-5 lg:grid lg:grid-rows-subgrid lg:pb-0 lg:pl-0 ${
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
                    className="lg:row-span-5 lg:grid lg:grid-rows-subgrid"
                  >
                    {RAIL_LABEL[i] && (
                      <Meta as="p" className="mb-4 lg:sr-only">
                        {RAIL_LABEL[i]}
                      </Meta>
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

                    {/* Row 4: lane head. On desktop the first phase's runs
                        across all four columns and counts every deliverable. */}
                    <p
                      className={`mt-8 flex items-baseline justify-between gap-4 border-b border-paper/45 pb-2.5 lg:mt-9 ${
                        i === 0 ? "lg:w-[calc(400%+6rem)]" : "lg:invisible"
                      }`}
                    >
                      <Meta>Deliverables</Meta>
                      {i === 0 ? (
                        <Meta>
                          <span className="lg:hidden">{pad(count)}</span>
                          <span className="hidden lg:inline">{pad(DELIVERABLES)}</span>
                        </Meta>
                      ) : (
                        <Meta>{pad(count)}</Meta>
                      )}
                    </p>

                    {/* Row 5: the indexed deliverables */}
                    <ul className="sm:grid sm:grid-cols-2 sm:gap-x-6 lg:block">
                      {phase.outputs.map((output, j) => (
                        <li
                          key={output}
                          className="grid grid-cols-[30px_1fr] items-baseline border-b border-paper/30 py-[9px] text-[14px] leading-[1.35]"
                        >
                          <Meta>
                            {phase.number}.{j + 1}
                          </Meta>
                          {output}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </li>
              );
            })}
          </ol>

          {/* The AI layer: one continuous band under all four phases */}
          <Reveal delay={0.1} className="mt-14 lg:mt-9">
            <p className="flex items-baseline justify-between gap-4 border-b border-paper/45 pb-2.5">
              <Meta>AI layer · runs under every phase</Meta>
              <Meta>{pad(PHASES.length)}</Meta>
            </p>
            <ul className={`${GRID} bg-graphite px-5 sm:px-6 lg:px-0`}>
              {PHASES.map((phase, i) => (
                <li
                  key={phase.ai}
                  className="col-span-4 flex items-center gap-3 border-t border-fog/20 py-4 first:border-t-0 sm:col-span-6 lg:col-span-3 lg:gap-2.5 lg:border-t-0 lg:py-[18px] lg:pl-4"
                >
                  <Meta className="w-7 shrink-0 text-fog lg:hidden">{pad(i + 1)}</Meta>
                  <span aria-hidden className="size-[7px] shrink-0 bg-signal" />
                  <span className="text-[14px] leading-[1.35]">{phase.ai}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </figure>
      </div>
    </section>
  );
}
