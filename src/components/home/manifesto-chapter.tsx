import { BraidStrip } from "@/components/home/braid-strip";
import { Reveal } from "@/components/reveal";
import {
  Accent,
  ChapterHead,
  CONTAINER,
  GRID,
  Meta,
} from "@/components/system";

/*
  (01) Why Plurel: one paper chapter, statement then figure. The thesis
  sets the kicker in the margin (columns 1 to 3) and the statement on the
  content column (4 to 12); Fig. 01 keeps the same axes, its caption in
  the margin and its lead on the content column, then takes the full
  width for the braid: ten suppliers, each reporting its own number,
  becoming one system. Generous paper below lets the chapter close before
  (02) Services cuts to graphite.
*/
export function ManifestoChapter() {
  return (
    <section aria-labelledby="manifesto-heading" className="bg-paper text-ink">
      <div className={`${CONTAINER} pb-28 pt-20 sm:pb-32 sm:pt-24 lg:pb-40 lg:pt-26`}>
        <ChapterHead index="01" label="Why Plurel" meta="What we were built to fix" />

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

        {/* Fig. 01: the fragmentation, and what one system makes of it */}
        <BraidStrip />
      </div>
    </section>
  );
}
