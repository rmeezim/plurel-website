"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "@/components/icons";
import { CONTAINER, GRID, Meta } from "@/components/system";
import { mountServicesType, STAGES, type StageKey } from "@/lib/services-type";
import s from "./services-type.module.css";

/*
  Fig. 02, the figure of (02) Services: the eight names, first set the
  way eight suppliers would set them, lined up on the rows' grid, then set
  as one system, stage by stage along the chain (engine in
  lib/services-type.ts). The contents list itself is the figure: it comes
  in as children, server-rendered by ServicesChapter, and stays the real,
  accessible text. This component adds the figure head (the narrator and
  the chain) and the eight aria-hidden clones that carry the motion.

  The chain's four stages are toggles at every width: a tap, click or
  Enter holds that stage's rows and steps the rest back (a second press,
  a tap elsewhere or Escape clears it); with a fine pointer, hovering
  does the same while nothing is pressed. Hovering a row lights its
  stage. With motion, the chain takes the pointer once every name is set.

  Static (no JS, reduced motion, forced colours, a screen too short for
  the finished frame) it is simply the list, unpinned, and the narrator
  says it outright: "Not eight voices. One system."
*/

export function ServicesType({
  items,
  children,
}: {
  items: readonly { name: string; st: StageKey }[];
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<StageKey | null>(null);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    // The engine follows reduced motion, the gate and the fit live, so it
    // mounts once
    return mountServicesType(section).destroy;
  }, []);

  // A pressed stage clears on a tap anywhere else, or Escape
  useEffect(() => {
    if (!filter) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Element) || !t.closest("[data-stage-btn]")) setFilter(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFilter(null);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [filter]);

  return (
    <div ref={ref} data-type-track="" data-filter={filter ?? undefined} className={s.track}>
      <div data-type-stage="" className={s.stage}>
        <div data-type-stage-in="" className={s.stageIn}>
          <div className={CONTAINER}>
            <div data-type-head="" className={`${GRID} ${s.head}`}>
              <p
                data-type-cap=""
                className={`${s.cap} col-span-4 sm:col-span-6 lg:col-span-3`}
              >
                <Meta className="mb-2.5 hidden text-signal lg:block">Fig. 02</Meta>
                <span className="type-display block text-[20px] leading-[1.12] text-paper lg:text-[clamp(1.25rem,1.5vw,1.375rem)]">
                  <span className={s.capStatic}>
                    <span className="lg:block">Not eight voices.</span>{" "}
                    <span className="lg:block">One system.</span>
                  </span>
                  <span aria-hidden className={s.capMotion}>
                    <span className={s.ca}>Eight disciplines, eight voices.</span>
                    <span className={s.cb}>Lined up, it&rsquo;s still a menu.</span>
                    <span className={s.cc}>Set as one, it&rsquo;s a system.</span>
                  </span>
                </span>
              </p>

              <div
                role="group"
                aria-label="The chain the eight run on"
                data-type-chain=""
                className={`${s.chain} col-span-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] leading-[1.35] sm:col-span-6 sm:gap-x-3 sm:text-[15px] lg:col-span-9 lg:col-start-4 lg:text-[17px]`}
              >
                {STAGES.map((st, i) => (
                  <Fragment key={st.key}>
                    {i > 0 && <ArrowRight className="size-3 shrink-0 text-signal sm:size-3.5" />}
                    <span className={`${s.plain}`}>{st.name}</span>
                    <button
                      type="button"
                      data-stage-btn={st.key}
                      aria-pressed={filter === st.key}
                      aria-label={`Show ${st.name} disciplines`}
                      onClick={() => setFilter((f) => (f === st.key ? null : st.key))}
                      className={s.btn}
                    >
                      {st.name}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
          {children}
        </div>

        <div aria-hidden className={s.fx}>
          {items.map((it) => (
            <span key={it.name} data-type-clone="" data-st={it.st} className={s.clone}>
              {it.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
