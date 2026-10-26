import type { CSSProperties } from "react";
import { ArtField } from "@/components/art";
import { Reveal } from "@/components/reveal";
import { CONTAINER, GRID, H2 } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import s from "./why-now.module.css";

/*
  Why now, on graphite: buyers decide before they arrive. The head follows
  the chapter anatomy (a two-line headline, the standfirst beside
  it). Then the argument drawn rather than told: a route of six small
  stations on one hairline, under a bracket that names them as where the
  choice gets made, ending at the red node where the buyer finally reaches
  you, noted in red as where most marketing starts. On desktop the route runs
  across the page on a seven-column grid; below lg it turns into a rail
  down the left. The line is drawn at one steady rate and each station
  lights the moment it arrives, then one quieter line answers it: its
  rule is drawn first, then the line is plotted. Behind it all, a faint
  survey of the terrain buyers decide on.
*/

const STATIONS = [
  ["AI answers", "What an assistant says"],
  ["Search", "The first three results"],
  ["Creators", "Someone they already trust"],
  ["Reviews", "What other buyers wrote"],
  ["Stores", "The shelf, the page, the listing"],
  ["Word of mouth", "A friend who has used it"],
] as const;

const at = (i: number) => ({ "--i": i }) as CSSProperties;

export function WhyNowChapter() {
  return (
    <section
      aria-labelledby="why-now-heading"
      className="relative isolate overflow-hidden bg-graphite text-paper"
    >
      <ArtField kind="contours" seed={3} tone="dark" annotate />
      <div className={`${CONTAINER} py-24 lg:py-36`}>
        <div className={`${GRID} gap-y-8`}>
          <div className="col-span-4 sm:col-span-6 lg:col-span-7">
            <TypeReveal
              as="h2"
              id="why-now-heading"
              className={H2}
              lines={["Buyers decide", "before they arrive."]}
            />
          </div>
          <Reveal className="col-span-4 sm:col-span-5 lg:col-span-4 lg:col-start-9 lg:pt-1.5">
            <p className="text-[18px] leading-[1.5] text-fog lg:text-[19px]">
              They ask an assistant, watch a creator, read the reviews. By the time they reach
              you, the choice is mostly made.
            </p>
          </Reveal>
        </div>

        {/* holds the pen while the route draws: 0.25s, six stations 0.16s
            apart, then where most marketing starts (why-now.module.css) */}
        <Reveal hold={1450} className="mt-16 sm:mt-20 lg:mt-28">
          <figure aria-labelledby="why-now-route" className={s.route}>
            <p id="why-now-route" className={s.made}>
              Where the choice gets made
            </p>
            <div className={s.track}>
              <span aria-hidden className={s.line} />
              <ol className={s.stations}>
                {STATIONS.map(([name, line], i) => (
                  <li key={name} className={s.station} style={at(i)}>
                    <span aria-hidden className={s.node} />
                    <p className={`${s.name} type-title`}>{name}</p>
                    <p className={s.note}>{line}</p>
                  </li>
                ))}
              </ol>
              <div className={s.you} style={at(STATIONS.length)}>
                <span aria-hidden className={s.nodeYou} />
                <p className={`${s.name} ${s.youName} type-display`}>You</p>
                <p className={s.note}>Your site or store</p>
                <p className={s.starts}>Where most marketing starts</p>
              </div>
            </div>
          </figure>
        </Reveal>

        <div className={`${s.row} relative mt-20 pt-8 sm:mt-24 sm:pt-10 lg:mt-28`}>
          <span aria-hidden className={s.total} />
          <TypeReveal
            as="p"
            variant="title"
            delay={480}
            className="type-title max-w-[24ch] text-[clamp(1.5rem,1rem+1.5vw,2.375rem)] leading-[1.1]"
            lines={["We engineer the ones your buyers use, as one system."]}
          />
        </div>
      </div>
    </section>
  );
}
