import { Reveal } from "@/components/reveal";
import { ChapterHead, CONTAINER, GRID, Meta } from "@/components/system";
import { STATS, VOICES } from "@/lib/home";

/** (05) The numbers in red on paper, then the people behind them */
export function ResultsChapter() {
  const [lead, ...rest] = VOICES;
  return (
    <section
      aria-labelledby="results-heading"
      className="bg-paper text-ink"
    >
      <div className={`${CONTAINER} py-24 lg:py-36`}>
        <ChapterHead
          index="05"
          label="Results"
          meta="Across recent engagements"
          id="results-heading"
        />

        <div className={`${GRID} mt-16 gap-y-12 lg:mt-24`}>
          {STATS.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 0.08}
              className="col-span-2 sm:col-span-3 lg:col-span-3"
            >
              <div className="flex flex-col-reverse border-t border-ink/15 pt-5">
                <p className="mt-4 max-w-[22ch] text-[14px] leading-snug text-ink/65">
                  {stat.label}
                </p>
                <p className="text-[clamp(3.25rem,7vw,7rem)] font-light leading-[0.85] tracking-[-0.055em] text-brand">
                  {stat.value}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className={`${GRID} mt-24 gap-y-14 lg:mt-36`}>
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-8">
            <figure>
              <blockquote className="text-[clamp(1.875rem,4vw,3.5rem)] leading-[1.06] tracking-[-0.035em]">
                &ldquo;{lead.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span aria-hidden className="h-[2px] w-10 bg-brand" />
                <Meta className="text-muted">
                  {lead.name} · {lead.role}
                </Meta>
              </figcaption>
            </figure>
          </Reveal>
          <ul className="col-span-4 space-y-10 self-end sm:col-span-6 lg:col-span-3 lg:col-start-10">
            {rest.map((v, i) => (
              <li key={v.name}>
                <Reveal delay={0.1 + i * 0.08} className="border-t border-ink/15 pt-5">
                  <p className="font-serif text-[22px] italic leading-snug text-ink/85">&ldquo;{v.quote}&rdquo;</p>
                  <Meta as="p" className="mt-4 text-muted">
                    {v.name} · {v.role}
                  </Meta>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
