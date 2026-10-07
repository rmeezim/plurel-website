"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  AF_CARDS,
  AF_GROUPS,
  AF_INDEX,
  AF_LANES,
  AF_STAGES,
  mountAttentionField,
} from "@/lib/attention-field";
import s from "./attention-field.module.css";

/*
  The Attention Field: how Plurel distributes, as one canvas of dots
  (engine in lib/attention-field.ts). Directly after the hero, on graphite.

  Pinned and scrubbed by the visitor's own scroll when JS is on, motion is
  allowed and the screen is at least 360 x 560 (AF_PIN_QUERY, mirrored in
  the CSS module): five stages, NOISE / STORY / LANES / SYSTEM / DEMAND,
  each a heading that lifts away as the visual takes the stage, with a
  stage control at the foot (the stage tabs, a nav, then the link to the
  method). The field drifts on its own while pinned, with no pause control,
  as the hero and footer glass do. Everywhere else it is a calm static
  chapter: the five stages as a list beside one still frame of the whole
  system, and only the link shows.

  The five stages are always real headings in the accessibility tree; the
  canvas and its labels are decoration. Sticky breaks if this section or
  any ancestor gets overflow hidden/clip; the stage clips itself.
*/

const two = (n: number) => String(n).padStart(2, "0");

export function AttentionField() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let unmount = mountAttentionField(root, { reduced: mq.matches });
    const onChange = () => {
      unmount();
      unmount = mountAttentionField(root, { reduced: mq.matches });
    };
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      unmount();
    };
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
          <div className={s.meta} aria-hidden="true">
            <span className={s.metaKey}>
              <i className={s.sq} />
              Attention field
            </span>
            <span className={s.metaRead} data-af-read="">
              Signals
            </span>
            <span className={s.metaFig}>Still frame</span>
          </div>

          <div className={s.fig} data-af-fig="">
            <canvas className={s.canvas} aria-hidden="true" data-af-canvas="" />
            <div className={s.labels} aria-hidden="true">
              {AF_LANES.map((l, i) => (
                <span key={l.name} className={`${s.l} ${s.lane}`} data-af-lane="">
                  <span>
                    <b>{two(i + 1)}</b>
                    {l.name}
                  </span>
                </span>
              ))}
              {AF_GROUPS.map((g) => (
                <span key={g} className={`${s.l} ${s.grp}`} data-af-group="">
                  <span>{g}</span>
                </span>
              ))}
              {AF_CARDS.map((c) => (
                <span key={c.key} className={`${s.l} ${s.card}`} data-af-card="">
                  <span>
                    <b>
                      {c.name} {c.spec}
                    </b>
                    <i>{c.size}</i>
                  </span>
                </span>
              ))}
              <span className={`${s.l} ${s.story}`} data-af-story="">
                <span>One story</span>
              </span>
              <span className={`${s.l} ${s.throat}`} data-af-throat="">
                <span>Qualified</span>
              </span>
              {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                <span key={q} className={`${s.l} ${s.q}`} data-af-q="">
                  <span>{q}</span>
                </span>
              ))}
              <span className={`${s.l} ${s.base}`} data-af-base="">
                <span>Baseline 1.0×</span>
              </span>
              <span className={`${s.l} ${s.cap}`} data-af-cap="">
                <span>Illustrative</span>
              </span>
              <span className={`${s.l} ${s.readout}`} data-af-readout="">
                <span>
                  <em>Qualified demand</em>
                  <strong data-af-value="">{`${AF_INDEX.toFixed(1)}×`}</strong>
                  <small>vs. baseline</small>
                </span>
              </span>
            </div>
          </div>

          <ol className={s.steps}>
            {AF_STAGES.map((st, i) => (
              <li key={st.tab} className={s.step} data-af-step="">
                <p className={s.index} aria-hidden="true">
                  {two(i + 1)}
                  <span className={s.of}> / {two(AF_STAGES.length)}</span>
                </p>
                <h3 className={`${s.title} type-display`}>{st.title}</h3>
                <p className={s.line}>{st.line}</p>
              </li>
            ))}
          </ol>

          <div className={s.ctrl}>
            <nav className={s.tabs} aria-label="Stages">
              {AF_STAGES.map((st, i) => (
                <button
                  key={st.tab}
                  type="button"
                  className={s.tab}
                  data-af-tab=""
                  aria-current={i === 0 ? "step" : undefined}
                >
                  <i className={s.tabMark} aria-hidden="true" />
                  <span className={s.tabNum} aria-hidden="true">
                    {two(i + 1)}
                  </span>
                  <span className={s.tabName}>{st.tab}</span>
                  <span className={s.prog} aria-hidden="true" data-af-prog="" />
                </button>
              ))}
            </nav>
            <span className={s.sep} aria-hidden="true" />
            <Link href="/methodology" className={s.cta}>
              <span>
                <span className={s.ctaLong}>See the </span>
                method
              </span>
              <span aria-hidden="true" className={s.arrow}>
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
