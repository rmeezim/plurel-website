"use client";

import { useEffect, useRef } from "react";
import { CtaLink } from "@/components/system";
import { ChannelTiles } from "@/components/home/channel-tiles";
import { CHANNELS, HALDEN, type ChannelClips } from "@/lib/channels";
import {
  AF_GROUPS,
  AF_INDEX,
  AF_LANES,
  AF_STAGES,
  mountAttentionField,
} from "@/lib/attention-field";
import s from "./attention-field.module.css";

/*
  The Attention Field: how Plurel distributes, as one canvas of dots
  (engine in lib/attention-field.ts) and seven recordings of one client's
  one story (the channel tiles). Directly after the hero, on graphite.

  Pinned and scrubbed by the visitor's own scroll when JS is on, motion is
  allowed and the screen is at least 360 x 560 (AF_PIN_QUERY, mirrored in
  the CSS modules): five stages, NOISE / STORY / LANES / SYSTEM / DEMAND,
  each a heading that lifts away as the visual takes the stage. No chrome
  round it: the one action, the link to the method, arrives with the
  final readout. In NOISE the mesh answers a fine pointer, and each
  surface's marker can be picked up and its pool dragged about (an
  unannounced easter egg; the engine owns the pointer code). In STORY the
  dots settle into one frame that is cut into the tiles, which play (muted
  footage from public/video/channels where it exists, see lib/clips.ts)
  and then become the heads of their lanes. The field drifts on its own
  while pinned, with no pause control, as the hero and footer glass do.
  Everywhere else it is a calm static chapter: the tiles as one mosaic of
  still frames, the five stages as a list beside one still frame of the
  whole system, then the link. Under the mosaic, pinned or not, one quiet
  line says Halden is a sample brief.

  The five stages are always real headings in the accessibility tree; the
  canvas, its labels and the tiles are decoration. Sticky breaks if this
  section or any ancestor gets overflow hidden/clip; the stage clips
  itself.
*/

// "an AI answer, a search result, ..." for the figure's description
const FORMATS = CHANNELS.map(({ name }) => {
  const n = name.startsWith("AI") ? name : name.toLowerCase();
  return `${/^[aeiou]/i.test(n) ? "an" : "a"} ${n}`;
});

export function AttentionField({ clips = {} }: { clips?: ChannelClips }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    // The engine follows reduced motion and the pin query live, and keeps
    // the reader's place when either flips, so it mounts once
    return mountAttentionField(root);
  }, []);

  return (
    <section
      ref={ref}
      id="distribution"
      aria-labelledby="distribution-heading"
      className={`${s.root} bg-graphite text-paper`}
    >
      <h2 id="distribution-heading" className="sr-only">
        How Plurel distributes
      </h2>
      <div className={s.track} data-af-track="">
        <div className={s.stage}>
          <div className={s.fig} data-af-fig="">
            <p className="sr-only">
              The figure: nine lanes of attention.{" "}
              {AF_GROUPS.map(
                (g, gi) =>
                  `${g}: ${AF_LANES.filter((l) => l.group === gi)
                    .map((l) => l.name)
                    .join(", ")}. `,
              )}
              They run as one funnel into qualified demand, shown as an
              illustrative {AF_INDEX.toFixed(1)}× index over a 1.0× baseline.
            </p>
            <canvas className={s.canvas} aria-hidden="true" data-af-canvas="" />
            <div className={s.labels} aria-hidden="true">
              {AF_LANES.map((l) => (
                <span key={l.name} className={`${s.l} ${s.lane}`} data-af-lane="">
                  <span>{l.name}</span>
                </span>
              ))}
              {AF_GROUPS.map((g) => (
                <span key={g} className={`${s.l} ${s.grp}`} data-af-group="">
                  <span>{g}</span>
                </span>
              ))}
              <span className={`${s.l} ${s.throat}`} data-af-throat="">
                <span>Qualified</span>
              </span>
              <span className={`${s.l} ${s.readout}`} data-af-readout="">
                <span>
                  <em>Qualified demand</em>
                  <strong data-af-value="">{`${AF_INDEX.toFixed(1)}×`}</strong>
                  <small>vs. baseline · Illustrative</small>
                </span>
              </span>
            </div>
          </div>

          {/* Outside the figure, which is not drawn without JS: the tiles
              show then, and need their text alternative (and the disclosure
              that Halden is made up) all the same */}
          <p className="sr-only">
            One story, for {HALDEN.name}, a fictional maker of quiet heat
            pumps, is cut into {FORMATS.slice(0, -1).join(", ")} and{" "}
            {FORMATS[FORMATS.length - 1]}, each shown as a short recording.
          </p>

          <ChannelTiles clips={clips} note={`${HALDEN.name} is a sample brief.`} className={s.tiles} />

          <ol className={s.steps}>
            {AF_STAGES.map((st) => (
              <li key={st.tab} className={s.step} data-af-step="">
                <h3 className={`${s.title} type-display`}>{st.title}</h3>
                <p className={s.line}>{st.line}</p>
              </li>
            ))}
          </ol>

          {/* The one action: pinned, it arrives with the final readout */}
          <div className={s.end} data-af-end="">
            <CtaLink href="/methodology" size="md">
              See the method
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
