import type { ReactNode } from "react";
import { ArtField } from "@/components/art";
import { Reveal } from "@/components/reveal";
import { CONTAINER, GRID, H2, Kicker } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";

/*
  Who it's for, on red: different buyers, one system. Four kinds of
  business as the four rows of one table, read across: the business, where
  its buyers decide, and the number we answer for. Few words per cell, so
  the table reads at a glance. From lg the two column heads sit once over
  the table; below it each row carries its own small labels. Paper on red
  throughout (5.2:1). Behind it, a faint survey of the terrain, a
  different stretch from Why now's.
*/

const TYPES = [
  { key: "consumer", name: "Consumer brands", decide: "Feeds, creators and reviews", number: "Orders" },
  { key: "products", name: "Physical products", decide: "Shelves, marketplaces and reviews", number: "Sell-through" },
  { key: "b2b", name: "B2B technology", decide: "AI answers, search and peers", number: "Demos with buyers who fit" },
  { key: "apps", name: "Consumer apps", decide: "App stores, feeds and friends", number: "Installs that stay" },
] as const;

const HEADS = ["Where their buyers decide", "The number we answer for"] as const;

/** Hyphenated compounds never break across lines ("Sell-through") */
function keepCompounds(text: string): ReactNode {
  return text
    .split(/(\S+-\S+)/)
    .map((part, i) => (i % 2 ? <span key={i} className="whitespace-nowrap">{part}</span> : part));
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
              The four layers stay the same. What changes is where your buyers decide, and the
              number we answer for.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 border-b border-paper/40 sm:mt-20 lg:mt-24">
          {/* the column heads, once over the table */}
          <div aria-hidden className={`${GRID} hidden pb-4 text-[14px] font-medium lg:grid`}>
            <span className="col-span-5 col-start-5">{HEADS[0]}</span>
            <span className="col-span-3 col-start-10">{HEADS[1]}</span>
          </div>
          {TYPES.map((t, i) => (
            <Reveal key={t.key} delay={i * 0.08}>
              <article
                aria-labelledby={`who-${t.key}`}
                className={`${GRID} gap-y-5 border-t border-paper/40 py-7 sm:py-8 lg:items-baseline lg:py-9`}
              >
                <TypeReveal
                  as="h3"
                  id={`who-${t.key}`}
                  variant="chars"
                  lines={[t.name]}
                  className="type-display col-span-4 text-[clamp(1.875rem,1.3rem+1.6vw,2.75rem)] leading-[0.98] sm:col-span-6 lg:col-span-4"
                />
                <dl className="col-span-4 grid grid-cols-4 gap-x-5 gap-y-4 sm:col-span-6 sm:grid-cols-6 sm:gap-x-6 lg:col-span-8 lg:col-start-5 lg:grid-cols-subgrid lg:items-baseline lg:gap-x-8">
                  <div className="col-span-4 sm:col-span-3 lg:col-span-5">
                    <dt className="text-[13px] font-medium lg:sr-only">{HEADS[0]}</dt>
                    <dd className="mt-1.5 text-[17px] leading-[1.4] lg:mt-0 lg:text-[19px]">
                      {keepCompounds(t.decide)}
                    </dd>
                  </div>
                  <div className="col-span-4 sm:col-span-3 lg:col-span-3">
                    <dt className="text-[13px] font-medium lg:sr-only">{HEADS[1]}</dt>
                    <dd className="type-title mt-1.5 text-[22px] leading-[1.1] lg:mt-0 lg:text-[26px]">
                      {keepCompounds(t.number)}
                    </dd>
                  </div>
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
