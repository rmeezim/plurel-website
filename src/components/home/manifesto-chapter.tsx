import { Reveal } from "@/components/reveal";
import {
  Accent,
  ChapterHead,
  CONTAINER,
  GRID,
  Meta,
} from "@/components/system";
import { PILLARS } from "@/lib/home";

/** (01) The thesis, in a red room */
export function ManifestoChapter() {
  return (
    <section
      aria-labelledby="manifesto-heading"
      className="bg-brand text-paper"
    >
      <div className={`${CONTAINER} py-24 lg:py-36`}>
        <ChapterHead index="01" label="Why Plurel" meta="The AI-era standard" tone="red" />

        <Reveal>
          <h2
            id="manifesto-heading"
            className="mt-14 max-w-[21ch] text-[clamp(2.25rem,5.6vw,5.75rem)] font-normal leading-[0.98] tracking-[-0.04em] lg:mt-24"
          >
            Most businesses don&apos;t have a quality problem. They have a{" "}
            <Accent>presence</Accent> problem.
          </h2>
        </Reveal>

        <div className={`${GRID} mt-12 lg:mt-16`}>
          <Reveal className="col-span-4 sm:col-span-5 lg:col-span-5">
            <p className="max-w-[44ch] text-[17px] leading-relaxed text-paper/85 lg:text-[19px]">
              We build the visible layer of your brand, so the work you&apos;re
              proud of finally looks the part. One team, accountable for how
              you&apos;re found, trusted, chosen, and remembered.
            </p>
          </Reveal>
        </div>

        <ol className={`${GRID} mt-16 gap-y-12 lg:mt-24`}>
          {PILLARS.map((pillar, i) => (
            <li key={pillar.word} className="col-span-4 sm:col-span-3 lg:col-span-3">
              <Reveal delay={i * 0.08} className="border-t border-paper/30 pt-5">
                <Meta className="text-blush">({String(i + 1).padStart(2, "0")})</Meta>
                <p className="mt-8 text-[clamp(2.25rem,3.4vw,3.25rem)] leading-none tracking-[-0.04em]">
                  {pillar.word}
                </p>
                <p className="mt-4 max-w-[28ch] text-[15px] leading-relaxed text-paper/75">
                  {pillar.line}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
