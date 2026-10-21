import { ArtField } from "@/components/art";
import { Reveal } from "@/components/reveal";
import { CONTAINER, GRID, H2, Kicker, Meta } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import s from "./why-now.module.css";

/*
  Why now, on paper: buyers decide before they arrive. The head follows
  the chapter anatomy (kicker, a two-line headline, the standfirst beside
  it). Then the six places the choice gets made, set as a typographic
  sequence down the page: one large line each on a hairline, its channel
  as a data tag on the right, for consumer and business buyers alike.
  Each line rises as it enters while its rule draws in from the left. The
  sequence ends on a brand-red rule, like the total under a sum, and the
  line that answers it. Behind it all, a faint survey of the terrain
  buyers decide on.
*/

const MOMENTS = [
  ["The answer an assistant gives.", "AI answers"],
  ["The first three results.", "Search"],
  ["A creator they already trust.", "Creators"],
  ["The reviews under the product.", "Reviews"],
  ["The shelf, the store page, the app listing.", "Retail and app stores"],
  ["The friend or colleague who has used it.", "Word of mouth"],
] as const;

/** One scale for the moments: 28px on a phone, about 50px on a laptop, 56px wide */
const LINE = "type-display text-[clamp(1.75rem,1rem+2.4vw,3.5rem)] leading-[1.02]";

export function WhyNowChapter() {
  return (
    <section
      aria-labelledby="why-now-heading"
      className="relative isolate overflow-hidden bg-paper text-ink"
    >
      <ArtField kind="contours" seed={3} tone="paper" />
      <div className={`${CONTAINER} py-24 lg:py-36`}>
        <div className={`${GRID} gap-y-8`}>
          <div className="col-span-4 sm:col-span-6 lg:col-span-7">
            <Kicker>Why now</Kicker>
            <TypeReveal
              as="h2"
              id="why-now-heading"
              className={`${H2} mt-7`}
              lines={["Buyers decide", "before they arrive."]}
            />
          </div>
          <Reveal className="col-span-4 sm:col-span-5 lg:col-span-4 lg:col-start-9 lg:pt-12">
            <p className="text-[18px] leading-[1.5] text-ink/75 lg:text-[19px]">
              They ask an assistant, watch a creator, read the reviews, compare the shelf or the
              shortlist. By the time they reach you, most of the choice is made, and distribution
              made it.
            </p>
          </Reveal>
        </div>

        <ul className="mt-20 lg:mt-28">
          {MOMENTS.map(([line, tag]) => (
            <li
              key={tag}
              className={`${s.row} relative ${GRID} items-baseline gap-y-3 py-6 sm:py-7 lg:py-8`}
            >
              <span aria-hidden className={s.rule} />
              <TypeReveal
                as="p"
                className={`${LINE} col-span-4 sm:col-span-4 lg:col-span-9`}
                lines={[line]}
              />
              <Meta
                as="p"
                className={`${s.tag} order-first col-span-4 justify-self-end text-muted sm:order-none sm:col-span-2 lg:col-span-3`}
              >
                {tag}
              </Meta>
            </li>
          ))}
        </ul>

        <div className={`${s.row} relative pt-10 sm:pt-12 lg:pt-14`}>
          <span aria-hidden className={s.total} />
          <TypeReveal
            as="p"
            className={`${LINE} max-w-[24ch]`}
            lines={["We engineer the ones your buyers use, as one system."]}
          />
        </div>
      </div>
    </section>
  );
}
