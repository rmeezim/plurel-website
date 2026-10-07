import { BraidStrip } from "@/components/home/braid-strip";
import { Reveal } from "@/components/reveal";
import {
  Accent,
  ChapterHead,
  CONTAINER,
  GRID,
  Meta,
} from "@/components/system";
import { PILLARS } from "@/lib/home";

/*
  The hairline cross on the red band, drawn once on entry: the vertical
  first, then the horizontal from the crossing outward. The draw keys off
  the matrix's Reveal wrapper: collapsed while it is armed, transitioning
  only once it is in. It never runs for reduced-motion visitors, no-JS
  visitors, or content already on screen; they get the finished cross.
*/
const CROSS_VERTICAL =
  // Centred in the gutter between matrix columns 5 and 6 (page grid 8 and 9):
  // five ninths of (width - 8 gutters), plus four and a half 2rem gutters.
  "lg:after:absolute lg:after:inset-y-0 lg:after:left-[calc((100%_-_16rem)*5/9_+_9rem)] lg:after:w-px lg:after:bg-paper/50 " +
  "lg:after:origin-top lg:after:scale-y-100 motion-safe:lg:[.reveal-in_&]:after:transition-transform motion-safe:lg:[.reveal-in_&]:after:duration-400 motion-safe:lg:[.reveal-in_&]:after:ease-out motion-safe:lg:[.reveal-in_&]:after:delay-200 " +
  "motion-safe:lg:[.reveal-armed_&]:after:scale-y-0";

/* Each half of the horizontal rule under the top row, drawn after the vertical */
const CROSS_HALF =
  "lg:before:absolute lg:before:bottom-0 lg:before:h-px lg:before:bg-paper/50 " +
  "lg:before:scale-x-100 motion-safe:lg:[.reveal-in_&]:before:transition-transform motion-safe:lg:[.reveal-in_&]:before:duration-400 motion-safe:lg:[.reveal-in_&]:before:ease-out motion-safe:lg:[.reveal-in_&]:before:delay-500 " +
  "motion-safe:lg:[.reveal-armed_&]:before:scale-x-0";

/* Per-cell placement on the 9-column matrix (cols 4-8 and 9-12 of the
   page grid), plus each half of the horizontal rule under the top row. */
const CELL = [
  `lg:col-span-5 lg:pt-0 lg:pb-10 lg:before:left-0 lg:before:-right-4 lg:before:origin-right ${CROSS_HALF}`,
  `lg:col-span-4 lg:pt-0 lg:pb-10 lg:before:-left-4 lg:before:right-0 lg:before:origin-left ${CROSS_HALF}`,
  "lg:col-span-5 lg:pt-9 lg:pb-0",
  "lg:col-span-4 lg:pt-9 lg:pb-0",
];

/** (01) Why Plurel: the thesis on paper, then the fragmentation it answers, on red */
export function ManifestoChapter() {
  return (
    <section aria-labelledby="manifesto-heading" className="bg-paper text-ink">
      <div className={`${CONTAINER} py-20 sm:py-24 lg:py-26`}>
        <ChapterHead index="01" label="Why Plurel" meta="One system, not ten suppliers" />

        {/* Thesis: the kicker in the margin, the statement across cols 4-12 */}
        <div className={`${GRID} mt-14 sm:mt-16 lg:mt-26 lg:items-start lg:gap-y-11`}>
          <Meta
            as="p"
            className="col-span-4 text-brand sm:col-span-6 lg:col-span-3 lg:row-start-1 lg:pt-3"
          >
            Point of view
          </Meta>

          <Reveal className="col-span-4 mt-5 sm:col-span-6 lg:col-span-9 lg:col-start-4 lg:row-start-1 lg:mt-0">
            <h2
              id="manifesto-heading"
              className="type-display text-[clamp(2.25rem,1.5rem+2.95vw,3rem)] leading-none text-ink lg:text-[clamp(3rem,4.84vw,4.25rem)]"
            >
              <span className="block">
                Your marketing shouldn&rsquo;t be ten companies.
              </span>{" "}
              <span className="block">
                It should be <Accent className="text-brand">one system</Accent>.
              </span>
            </h2>
          </Reveal>

          <Reveal
            delay={0.08}
            className="col-span-4 mt-8 sm:col-span-5 lg:col-span-6 lg:col-start-4 lg:row-start-2 lg:mt-0"
          >
            <p className="text-[17px] leading-[1.55] text-ink/75 lg:text-[20px]">
              Brand, website, search, content, social, paid and press usually sit
              with different suppliers. Each can be good at its part, and nobody
              owns the whole. Plurel rebuilds them as one system: one narrative,
              one creative engine, one set of numbers, one accountable team.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Findings: a full-bleed red band that hands red to the services fold,
          closing on Fig. 01, the ten suppliers braided into one system */}
      <div className="bg-brand pb-16 pt-14 text-paper sm:pb-20 sm:pt-16 lg:pb-26 lg:pt-18">
        <div className={CONTAINER}>
          <div className={`${GRID} items-start`}>
            <Reveal className="col-span-4 sm:col-span-6 lg:col-span-3">
              <h3
                id="manifesto-fragments"
                className="type-display max-w-[16em] text-[1.5rem] leading-none text-paper lg:max-w-[10em] lg:text-[clamp(1.375rem,2.19vw,1.75rem)]"
              >
                Every supplier reports its own number. Nobody owns the outcome.
              </h3>
            </Reveal>

            <Reveal
              delay={0.08}
              className="col-span-4 mt-10 sm:col-span-6 sm:mt-12 lg:col-span-9 lg:col-start-4 lg:mt-0"
            >
              <ol
                aria-labelledby="manifesto-fragments"
                className={`relative lg:grid lg:grid-cols-9 lg:gap-x-8 ${CROSS_VERTICAL}`}
              >
                {PILLARS.map((pillar, i) => (
                  <li
                    key={pillar.word}
                    className={`relative border-t border-paper/50 py-6 first:border-t-0 first:pt-0 last:pb-0 sm:grid sm:grid-cols-6 sm:items-baseline sm:gap-x-6 lg:flex lg:flex-col lg:border-t-0 ${CELL[i]}`}
                  >
                    <div className="flex items-baseline gap-4 sm:col-span-3 lg:flex-col lg:items-start lg:gap-0">
                      <Meta className="text-[12px]! text-paper">
                        {String(i + 1).padStart(2, "0")}
                      </Meta>
                      <p className="type-display text-[1.875rem] leading-none text-paper lg:mt-5 lg:text-[clamp(2rem,2.97vw,2.625rem)]">
                        {pillar.word}
                      </p>
                    </div>
                    <p className="mt-3 max-w-[30ch] text-[16px] leading-normal text-paper sm:col-span-3 sm:mt-0 lg:mt-3">
                      {pillar.line}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <BraidStrip />
        </div>
      </div>
    </section>
  );
}
