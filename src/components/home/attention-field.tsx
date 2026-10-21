import type { CSSProperties } from "react";
import { ChannelTile } from "@/components/home/channel-tiles";
import { AttentionWeek } from "@/components/home/attention-week";
import { Reveal } from "@/components/reveal";
import { ChapterHead, CONTAINER, CtaLink, GRID, H2 } from "@/components/system";
import { WEEK } from "@/lib/attention-field";
import type { ChannelClips } from "@/lib/channels";
import s from "./attention-field.module.css";

/*
  The attention section, right under the hero, on paper: "Attention is
  everywhere", told as one buyer's week. Maya meets the sample brand Halden
  seven times in seven places (a search, a reel, an AI answer, a
  billboard, a review, a creator's post, a film before her show), each
  time with the same story, and then she books a home survey. The close
  lands it and says it holds for a B2B buyer too; the next chapter names
  the number that booking counts towards.

  Everything here is server-rendered and finished without JS: the eight
  moments in order, each with its day and time, its sentence and its tile
  (a still frame until it plays). The client parts only add behaviour:
  each tile plays while it is on screen (ChannelTile), and on a desktop
  the moments' own text gives way to one sticky narrator beside the tiles
  (AttentionWeek). Native scroll throughout: nothing pins, nothing is
  scrubbed. Maya and Halden are made up, and the opening says so in plain
  view.
*/

export function AttentionField({ clips = {} }: { clips?: ChannelClips }) {
  return (
    <section id="distribution" aria-labelledby="distribution-heading" className="bg-paper text-ink">
      <div className={`${CONTAINER} pb-28 pt-24 sm:pb-32 sm:pt-28 lg:pb-40 lg:pt-36`}>
        {/* The opening: the claim, and whose week this is */}
        <ChapterHead label="How distribution works" />
        <div className={`${GRID} mt-7 gap-y-8 lg:mt-9`}>
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-7">
            <h2 id="distribution-heading" className={H2}>
              <span className="sm:block">Attention is</span> <span className="sm:block">everywhere.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="col-span-4 sm:col-span-5 lg:col-span-4 lg:col-start-9 lg:pt-1.5">
            <p className="text-[18px] leading-[1.5] text-ink/80 lg:text-[20px]">
              Search, feeds, creators, press, and now AI answers that pick for your buyer.
            </p>
            <p className="mt-5 text-[16px] leading-[1.55] text-muted lg:text-[17px]">
              Here is a sample week. Maya owns a terraced house in Leeds and a boiler that sounds like
              a jet. Halden, the heat pump brand she keeps meeting, is one we made up.
            </p>
          </Reveal>
        </div>

        {/* The week: eight moments, each a tile; the narrator stays beside them on a desktop */}
        <AttentionWeek>
          <ol className={s.moments} aria-label="Maya’s week, a sample">
            {WEEK.map((m) => {
              const style = {
                "--ar": m.size.w / m.size.h,
                "--show": `${m.show}px`,
                "--phone": m.phone ?? 1,
              } as CSSProperties;
              return (
                <li key={m.key} className={`${GRID} ${s.moment}`}>
                  <div className={`${s.text} col-span-4 sm:col-span-6 lg:col-span-4`}>
                    <p className={`${s.when} type-display`}>
                      <time dateTime={m.iso}>
                        <span className={s.whenDay}>
                          <span aria-hidden="true">{m.day}</span>
                          <span className="sr-only">{m.dayName}</span>
                        </span>
                        {` ${m.time}`}
                      </time>
                    </p>
                    <p className={s.what}>{m.line}</p>
                  </div>
                  <div
                    className={`${s.media} col-span-4 sm:col-span-6 lg:col-span-7 lg:col-start-6`}
                    style={style}
                    data-moment-media=""
                  >
                    <p className="sr-only">{m.alt}</p>
                    <Reveal>
                      <ChannelTile k={m.key} clip={clips[m.key]} size={m.size} narrow={m.narrow} />
                    </Reveal>
                  </div>
                </li>
              );
            })}
          </ol>
        </AttentionWeek>

        {/* The close: what the week adds up to, then the same for a B2B buyer,
            stepping across from the narrator's column to the tiles' */}
        <div className={`${GRID} ${s.close} lg:items-baseline`}>
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-12 xl:col-span-9">
            <p className={`${H2} text-ink`}>
              <span className="lg:block">
                <span className="block lg:inline">Seven times,</span>{" "}
                <span className="block lg:inline">in seven places,</span>
              </span>{" "}
              <span className="block">the same story.</span>{" "}
              <span className="block">Then she booked.</span>
            </p>
          </Reveal>
          <Reveal delay={0.06} className="col-span-4 mt-8 sm:col-span-5 lg:col-span-5 lg:col-start-6 lg:mt-14">
            <p className="max-w-[34ch] text-[18px] leading-[1.5] text-ink/75 lg:text-[20px]">
              For a developer buying fifty units, the week looks different. The story doesn&rsquo;t.
            </p>
            <CtaLink href="/methodology" variant="outline" size="lg" className="mt-8">
              See the method
            </CtaLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
