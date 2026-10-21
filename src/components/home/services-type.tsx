"use client";

import { Fragment, useEffect, useRef, type ReactNode } from "react";
import { ArrowRight } from "@/components/icons";
import { CONTAINER, GRID } from "@/components/system";
import { mountServicesType, STAGES, SYSTEM, type StageKey } from "@/lib/services-type";
import s from "./services-type.module.css";

/*
  The figure of Services: the eight names, first set the way eight
  suppliers would set them, lined up on the menu's rows, set in one face
  stage by stage along the chain, then drained into the Plurel System:
  four bands, foundation first, each rising from the one below it as its
  names land in its rows, and the loop drawn along them last (engine in
  lib/services-type.ts). This component renders the figure head (the
  narrator, who hands over to the System's title, and the chain, which
  gives way to the System's line), the body (the menu, passed in as
  children, and the System's bands, passed in server-rendered) and the
  eight aria-hidden clones that carry the motion.

  Static (no JS, reduced motion, forced colours, a screen too short for
  the finished frame) it is simply the System, unpinned: its title, its
  line and the four bands.
*/

export function ServicesType({
  items,
  system,
  children,
}: {
  items: readonly { name: string; st: StageKey }[];
  system: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    // The engine follows reduced motion, the gate and the fit live, so it
    // mounts once
    return mountServicesType(section).destroy;
  }, []);

  return (
    <div ref={ref} data-type-track="" className={s.track}>
      <div data-type-stage="" className={s.stage}>
        <div data-type-stage-in="" className={s.stageIn}>
          <div className={CONTAINER}>
            <div data-type-head="" className={`${GRID} ${s.head}`}>
              <div
                data-type-cap=""
                className={`${s.cap} type-display col-span-4 text-[20px] leading-[1.12] text-paper sm:col-span-6 lg:col-span-3 lg:text-[clamp(1.25rem,1.5vw,1.375rem)]`}
              >
                <h3 id="system-heading" className={s.title}>
                  {SYSTEM.title}
                </h3>
                <p aria-hidden className={s.capMotion}>
                  <span className={s.ca}>Eight disciplines, eight voices.</span>
                  <span className={s.cb}>Lined up, it&rsquo;s still a menu.</span>
                  <span className={s.cc}>Set as one, it&rsquo;s a system.</span>
                </p>
              </div>

              <div
                aria-hidden
                data-type-chain=""
                className={`${s.chain} col-span-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] leading-[1.35] sm:col-span-6 sm:gap-x-3 sm:text-[15px] lg:col-span-9 lg:col-start-4 lg:text-[17px]`}
              >
                {STAGES.map((st, i) => (
                  <Fragment key={st.key}>
                    {i > 0 && <ArrowRight className="size-3 shrink-0 text-signal sm:size-3.5" />}
                    <span data-chain-word={st.key} className={s.word}>
                      {st.name}
                    </span>
                  </Fragment>
                ))}
              </div>

              <p
                data-type-line=""
                className={`${s.line} col-span-4 text-[16px] leading-[1.5] text-fog sm:col-span-6 lg:col-span-8 lg:col-start-4 lg:text-[17px] lg:leading-[1.45] xl:col-span-7 xl:col-start-4`}
              >
                {SYSTEM.line}
              </p>
            </div>
          </div>

          <div data-type-body="" className={s.body}>
            {children}
            {system}
          </div>
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
