import { Reveal } from "@/components/reveal";
import { Accent, ChapterHead, CONTAINER, GRID, Meta, TextLink } from "@/components/system";
import { CASES, STATS, VOICES } from "@/lib/home";

/* The category over each key figure, in STATS order */
const STAT_TOPICS = ["Demand", "Conversion", "Search & AI", "Performance"];

/* "+185%" -> sign, number, unit, so the sign and unit can sit smaller on
   the baseline instead of rising as superscripts */
function splitFigure(value: string) {
  const m = /^([+\-−]?)(\d[\d.,]*)(.*)$/.exec(value);
  return m ? { sign: m[1], num: m[2], unit: m[3] } : { sign: "", num: value, unit: "" };
}

/** Margin label: one recipe down the chapter, ink caps over a muted line */
function MarginLabel({
  title,
  note,
  bar = false,
  className = "",
}: {
  title: string;
  note: string;
  bar?: boolean;
  className?: string;
}) {
  return (
    <div className={`col-span-4 sm:col-span-6 lg:col-span-3 ${className}`}>
      {bar && <span aria-hidden className="mb-4 block h-px w-12 bg-ink" />}
      <Meta as="p" className="text-ink">
        {title}
      </Meta>
      <Meta as="p" className="mt-1.5 text-muted">
        {note}
      </Meta>
    </div>
  );
}

/** (05) Key figures report: the finding, four figures on a stone band, one voice */
export function ResultsChapter() {
  const lead = VOICES[0];
  const company = lead.role.split(", ").at(-1) ?? lead.role;
  const year = CASES.find((c) => c.name === company)?.year;

  return (
    <section id="results" aria-labelledby="results-heading" className="bg-paper py-24 text-ink lg:py-36">
      <div className={CONTAINER}>
        <ChapterHead index="05" label="Results" meta="Across recent engagements" />

        {/* Statement: the chapter's claim, the largest reading line here */}
        <div className={`${GRID} mt-12 gap-y-5 lg:mt-18`}>
          <MarginLabel title="Measured outcomes" note="Four signals" className="lg:pt-3.5" />
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-8 lg:col-start-4">
            <h2
              id="results-heading"
              className="type-display text-[clamp(1.875rem,4.0625vw,3.25rem)] leading-[1.06]"
            >
              Measured as one system, not ten reports. Demand signals move within the
              first <Accent className="text-muted">quarter.</Accent>
            </h2>
          </Reveal>
        </div>
      </div>

      {/* Key figures: one flat full-bleed stone band, captions on its floor */}
      <div className="mt-12 bg-ink/4 lg:mt-18">
        <ul className={`${CONTAINER} ${GRID}`}>
          {STATS.map((stat, i) => {
            const { sign, num, unit } = splitFigure(stat.value);
            return (
              <li key={stat.label} className="col-span-2 sm:col-span-3">
                <Reveal
                  delay={i * 0.08}
                  className="flex h-full flex-col py-7 lg:min-h-90 lg:pt-[30px] lg:pb-[34px]"
                >
                  <Meta as="p" className="flex justify-between gap-3 text-muted">
                    <span aria-hidden className="text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {STAT_TOPICS[i] && <span>{STAT_TOPICS[i]}</span>}
                  </Meta>
                  <p className="type-display figures mt-6 whitespace-nowrap text-[3rem] leading-[0.86] sm:text-[clamp(4rem,9vw,5.5rem)] lg:mt-9 lg:mb-8 lg:text-[clamp(4.25rem,7.5vw,6rem)]">
                    {sign && <span className="mr-[0.04em] text-[0.72em]">{sign}</span>}
                    {num}
                    {unit && <span className="ml-[0.03em] text-[0.6em]">{unit}</span>}
                  </p>
                  <p className="mt-4 min-h-[2.84em] max-w-[22ch] text-[15px] leading-[1.42] text-ink/75 lg:mt-auto">
                    {stat.label}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={CONTAINER}>
        {/* Testimony: one voice, set as the report's pull quote */}
        <div className={`${GRID} mt-16 gap-y-6 lg:mt-22`}>
          <MarginLabel
            bar
            title="In their words"
            note={year ? `${company} · ${year}` : company}
            className="lg:pt-3"
          />
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-8 lg:col-start-4">
            <figure>
              <blockquote className="type-display max-w-[21em] -indent-[0.4em] text-[clamp(1.75rem,3.125vw,2.5rem)] leading-[1.1]">
                &ldquo;{lead.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-[15px] lg:mt-[26px]">
                <span className="font-medium text-ink">{lead.name}</span>
                <span className="text-muted">{lead.role}</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* Measured how: signals and cadence, then the way into the work */}
        <div className={`${GRID} mt-16 gap-y-6 border-t border-ink/12 pt-[22px] lg:mt-20`}>
          <MarginLabel title="Measured how" note="Signals and cadence" />
          <div className="col-span-4 sm:col-span-3">
            <Meta as="p" className="text-muted">
              Signals
            </Meta>
            <p className="mt-2 max-w-[30ch] text-[15px] leading-[1.45]">
              Demand quality, search and AI visibility, and conversion
            </p>
          </div>
          <div className="col-span-4 sm:col-span-3">
            <Meta as="p" className="text-muted">
              Cadence
            </Meta>
            <p className="mt-2 max-w-[30ch] text-[15px] leading-[1.45]">
              Programs are reviewed against your targets every quarter
            </p>
          </div>
          <div className="col-span-4 sm:col-span-6 lg:col-span-3 lg:col-start-10 lg:-mt-2.5 lg:justify-self-end">
            <TextLink
              href="/work"
              className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              All case studies
            </TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
