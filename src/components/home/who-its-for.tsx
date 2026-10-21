import type { ReactNode } from "react";
import { ArtField } from "@/components/art";
import { Reveal } from "@/components/reveal";
import { CONTAINER, GRID, H2, Kicker } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";

/*
  Who it's for, on red: different buyers, one system. Four kinds of
  business, each a column (2x2 on tablets, stacked on phones): the name in
  the display face, then where its buyers decide, what we build first and
  the number we answer for. From sm the rows run on a shared subgrid, so
  every label sits on one line across the columns. Type is paper on red
  throughout (5.2:1); blush is too faint for 13px labels on brand red
  (3.6:1), so the labels are paper too, set small and medium against the
  regular-weight text. Behind it, a faint survey of the terrain, a
  different stretch from Why now's.
*/

const TYPES = [
  {
    key: "consumer",
    name: ["Consumer", "brands"],
    decide: "Feeds, creators, reviews and the store page.",
    build: "A creative platform that travels, creator programs and paid social that compounds.",
    number: "Orders",
  },
  {
    key: "products",
    name: ["Physical", "products"],
    decide: "The shelf, marketplaces, search and reviews.",
    build: "Product pages that sell, marketplace and review strategy, and retail-ready assets.",
    number: "Sell-through",
  },
  {
    key: "b2b",
    name: ["B2B", "technology"],
    decide: "AI answers, search, peers and the shortlist.",
    build: "The category story, visibility in AI answers and a site that turns visits into demos.",
    number: "Demos with buyers who fit",
  },
  {
    key: "apps",
    name: ["Consumer", "apps"],
    decide: "The app store, feeds, creators and friends.",
    build: "The store listing, launch moments, and referral and creator loops.",
    number: "Installs that stay",
  },
] as const;

/** Hyphenated compounds never break across lines ("retail-ready", "Sell-through") */
function keepCompounds(text: string): ReactNode {
  return text
    .split(/(\S+-\S+)/)
    .map((part, i) => (i % 2 ? <span key={i} className="whitespace-nowrap">{part}</span> : part));
}

function Field({ label, children, number = false }: { label: string; children: ReactNode; number?: boolean }) {
  return (
    <div className="border-t border-paper/25 pb-7 pt-4 sm:pb-8">
      <dt className="text-[13px] font-medium leading-snug">{label}</dt>
      <dd
        className={
          number
            ? "type-display mt-2.5 text-[23px] leading-[1.1] lg:text-[26px]"
            : "mt-2 max-w-[34ch] text-[16px] leading-[1.45] lg:text-[17px]"
        }
      >
        {children}
      </dd>
    </div>
  );
}

export function WhoItsForChapter() {
  return (
    <section
      aria-labelledby="who-heading"
      className="relative isolate overflow-hidden bg-brand text-paper"
    >
      <ArtField kind="contours" seed={4} tone="red" />
      <div className={`${CONTAINER} py-24 lg:py-36`}>
        <div className={`${GRID} gap-y-8`}>
          <div className="col-span-4 sm:col-span-6 lg:col-span-7">
            <Kicker tone="red">Who it&rsquo;s for</Kicker>
            <TypeReveal
              as="h2"
              id="who-heading"
              className={`${H2} mt-7`}
              lines={["Different buyers.", "One system."]}
            />
          </div>
          <Reveal className="col-span-4 sm:col-span-5 lg:col-span-4 lg:col-start-9 lg:pt-12">
            <p className="text-[18px] leading-[1.5] lg:text-[19px]">
              The four layers stay the same. What changes is where your buyers decide, what we
              build first and the number we answer for.
            </p>
          </Reveal>
        </div>

        <div className={`${GRID} mt-20 gap-y-14 sm:gap-y-0 lg:mt-28`}>
          {TYPES.map((t) => (
            <article
              key={t.key}
              aria-labelledby={`who-${t.key}`}
              className="col-span-4 sm:col-span-3 sm:row-span-4 sm:grid sm:grid-rows-subgrid sm:nth-[n+3]:mt-16 lg:nth-[n+3]:mt-0"
            >
              <TypeReveal
                as="h3"
                id={`who-${t.key}`}
                variant="chars"
                lines={t.name}
                className="type-display border-t border-paper pb-8 pt-5 text-[clamp(2rem,1.4rem+2.6vw,3rem)] leading-[0.95] lg:text-[clamp(2rem,3.2vw,3rem)]"
              />
              <dl className="sm:row-span-3 sm:grid sm:grid-rows-subgrid">
                <Field label="Where buyers decide">{keepCompounds(t.decide)}</Field>
                <Field label="What we build first">{keepCompounds(t.build)}</Field>
                <Field label="The number" number>
                  {keepCompounds(t.number)}
                </Field>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
