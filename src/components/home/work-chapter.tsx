import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import {
  Accent,
  ChapterHead,
  CONTAINER,
  GRID,
  GridGuides,
  Meta,
  TextLink,
} from "@/components/system";
import { CASES, type CaseScene } from "@/lib/home";

/*
  Case frames are title cards: a lit color field, the client set large,
  the result as the loudest number. They stand in for case photography
  and footage, and keep the same frame when real stills arrive.
*/
const SCENE: Record<CaseScene, { bg: string; light: string; text: string; sub: string }> = {
  red: {
    bg: "bg-[linear-gradient(160deg,#cf4640_0%,#b3352f_55%,#7d2421_100%)]",
    light: "bg-[radial-gradient(closest-side,rgba(255,200,182,0.45),transparent)]",
    text: "text-paper",
    sub: "text-blush",
  },
  night: {
    bg: "bg-[linear-gradient(165deg,#1d0807_0%,#110f0a_60%,#2a0d0b_100%)]",
    light: "bg-[radial-gradient(closest-side,rgba(232,86,78,0.5),transparent)]",
    text: "text-paper",
    sub: "text-signal",
  },
  blush: {
    bg: "bg-[linear-gradient(160deg,#f6ddd5_0%,#efc7bc_55%,#e3a99a_100%)]",
    light: "bg-[radial-gradient(closest-side,rgba(255,255,255,0.65),transparent)]",
    text: "text-ink",
    sub: "text-brand",
  },
  ember: {
    bg: "bg-[linear-gradient(150deg,#8e2824_0%,#5e1a17_55%,#2a0d0b_100%)]",
    light: "bg-[radial-gradient(closest-side,rgba(242,201,191,0.35),transparent)]",
    text: "text-paper",
    sub: "text-blush",
  },
};

function TitleCard({ c, index }: { c: (typeof CASES)[number]; index: number }) {
  const s = SCENE[c.scene];
  return (
    <div className={`grain relative h-[420px] overflow-hidden sm:h-[480px] lg:h-[560px] ${s.text}`}>
      <div
        className={`absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.04] ${s.bg}`}
      >
        <div className={`absolute -right-[10%] -top-[20%] h-[90%] w-[75%] ${s.light}`} />
      </div>

      <div className="relative z-[2] flex h-full flex-col justify-between p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <Meta className="opacity-70">Case {String(index + 1).padStart(2, "0")}</Meta>
          <Meta className="opacity-70">{c.year}</Meta>
        </div>

        <div>
          <p className="text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.92] tracking-[-0.045em]">
            {c.name}
          </p>
          <p className={`mt-2 text-[clamp(1.25rem,2vw,1.75rem)] ${s.sub}`}>
            <Accent>{c.accent}</Accent>
          </p>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[clamp(3rem,6vw,5.5rem)] font-light leading-[0.85] tracking-[-0.05em]">
              {c.metric}
            </p>
            <Meta as="p" className="mt-3 opacity-75">
              {c.metricLabel}
            </Meta>
          </div>
          <span className="inline-flex size-12 shrink-0 items-center justify-center border border-current/40 transition-colors duration-300 group-hover:bg-paper group-hover:text-ink">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
    </div>
  );
}

const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

/** (04) Selected work: cinematic title cards with the number up front */
export function WorkChapter() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="surface-oxblood grain relative overflow-hidden text-paper"
    >
      <GridGuides tone="dark" />
      <div className={`${CONTAINER} relative z-[2] py-24 lg:py-36`}>
        <ChapterHead
          index="04"
          label="Selected work"
          meta="Transformations, with the numbers"
          tone="dark"
        />

        <div className={`${GRID} mt-14 gap-y-10 lg:mt-20`}>
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-8">
            <h2
              id="work-heading"
              className="text-[clamp(2.25rem,5vw,5rem)] font-normal leading-[0.98] tracking-[-0.04em]"
            >
              Recent <Accent>transformations</Accent>.
            </h2>
          </Reveal>
          <Reveal
            delay={0.1}
            className="col-span-4 self-end sm:col-span-4 lg:col-span-3 lg:col-start-10"
          >
            <TextLink href="/work" tone="dark">
              All case studies
            </TextLink>
          </Reveal>
        </div>

        <div className={`${GRID} mt-16 gap-y-16 lg:mt-24`}>
          {CASES.map((c, i) => (
            <Reveal
              key={c.name}
              delay={(i % 2) * 0.1}
              className={`col-span-4 sm:col-span-6 ${SPANS[i]}`}
            >
              <article>
                <Link href="/work" className="group block" aria-label={`${c.name}: ${c.metric} ${c.metricLabel.toLowerCase()}`}>
                  <TitleCard c={c} index={i} />
                </Link>
                <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="text-[22px] tracking-[-0.02em]">{c.name}</h3>
                  <Meta className="text-paper/50">{c.services}</Meta>
                </div>
                <dl className="mt-4 grid grid-cols-1 gap-3 border-t border-paper/15 pt-4 sm:grid-cols-3 sm:gap-6">
                  {(
                    [
                      ["Before", c.before],
                      ["Built", c.built],
                      ["After", c.after],
                    ] as const
                  ).map(([term, detail]) => (
                    <div key={term}>
                      <Meta as="dt" className={term === "After" ? "text-signal" : "text-paper/45"}>
                        {term}
                      </Meta>
                      <dd className={`mt-1.5 text-[14px] leading-snug ${term === "After" ? "text-paper" : "text-paper/65"}`}>
                        {detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
