"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { CONTAINER, GRID } from "@/components/system";
import { mountServicesType, STACKED_QUERY, STAGES, type StageKey } from "@/lib/services-type";
import s from "./services-type.module.css";

/*
  The figure of Services: the eight names, first set the way eight
  suppliers would set them, lined up on the menu's rows, set in one face
  stage by stage along the chain, then drained into the system: four
  layers, foundation first, each a plate of glass that settles onto the
  stack (engine in lib/services-type.ts). This component renders the
  figure head (the narrator and the chain), the system (the layer list
  and the stack, passed in server-rendered) and the eight aria-hidden
  clones that carry the motion; the menu comes in as children.

  The layer list is the real, accessible contents: four disclosures (one
  open at a time, the foundation first on desktop; below lg all start
  closed), each with its services as links. It needs no script: the
  browser opens and closes them. Pointing at or focusing a layer lifts
  its plate; pointing at a plate lights its row, and a click on it opens
  the layer (the list is the keyboard's way in).

  Static (no JS, reduced motion, forced colours, a screen too short for
  the finished frame) it is simply the system, unpinned, and the
  narrator says what it shows: "Eight kinds of work, in four layers."
*/

export type LayerData = {
  key: StageKey;
  name: string;
  line: string;
  services: readonly { name: string; tagline: string; href: string }[];
};

export function ServicesType({
  items,
  layers,
  stack,
  children,
}: {
  items: readonly { name: string; st: StageKey }[];
  layers: readonly LayerData[];
  stack: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  // Below lg every layer starts closed: the server opens the foundation,
  // which is right for desktop and for no script. It closes at once, not
  // on its height (and before the engine measures the finished frame).
  useEffect(() => {
    const list = listRef.current;
    if (!list || !matchMedia(STACKED_QUERY).matches) return;
    list.setAttribute("data-instant", "");
    list.querySelectorAll<HTMLDetailsElement>("details[open]").forEach((d) => {
      d.open = false;
    });
    void list.offsetHeight;
    const raf = requestAnimationFrame(() => list.removeAttribute("data-instant"));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    // The engine follows reduced motion, the gate and the fit live, so it
    // mounts once
    return mountServicesType(section).destroy;
  }, []);

  // A plate opens its layer (pointer only: the list is the keyboard's way in)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onClick = (e: MouseEvent) => {
      const key = (e.target as Element | null)?.closest?.("[data-plate-hit]")?.getAttribute("data-plate-hit");
      const d = key ? listRef.current?.querySelector<HTMLDetailsElement>(`[data-layer="${key}"] > details`) : null;
      if (d) d.open = true;
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, []);

  return (
    <div ref={ref} data-type-track="" className={s.track}>
      <div data-type-stage="" className={s.stage}>
        <div data-type-stage-in="" className={s.stageIn}>
          <div className={CONTAINER}>
            <div data-type-head="" className={`${GRID} ${s.head}`}>
              <p
                data-type-cap=""
                className={`${s.cap} col-span-4 sm:col-span-6 lg:col-span-3`}
              >
                <span className="type-display block text-[20px] leading-[1.12] text-paper lg:text-[clamp(1.25rem,1.5vw,1.375rem)]">
                  <span className={s.capStatic}>
                    <span className="lg:block">Eight kinds of work,</span>{" "}
                    <span className="lg:block">in four layers.</span>
                  </span>
                  <span aria-hidden className={s.capMotion}>
                    <span className={s.ca}>Eight disciplines, eight voices.</span>
                    <span className={s.cb}>Lined up, it&rsquo;s still a menu.</span>
                    <span className={s.cc}>Set as one, it&rsquo;s a system.</span>
                  </span>
                </span>
              </p>

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
            </div>
          </div>

          <div className={s.body}>
            {children}
            <div data-type-system="" className={s.system}>
              <div className={`${CONTAINER} ${s.systemIn}`}>
                <div className={`${GRID} ${s.systemGrid} items-start`}>
                  <ol
                    ref={listRef}
                    data-type-layers=""
                    aria-label="Services, in four layers"
                    className={`${s.layers} col-span-4 sm:col-span-6 lg:col-span-6`}
                  >
                    {layers.map((L, i) => (
                      <li key={L.key} data-layer-row="" data-layer={L.key} className={s.lrow}>
                        <details name="services-layers" open={i === 0} className={s.layer}>
                          <summary className={s.sum}>
                            <span className={`${s.lname} type-display`}>
                              {L.name}
                              <span className="sr-only">: </span>
                            </span>
                            <span aria-hidden className={s.pm} />
                            <span className={s.lline}>{L.line}</span>
                          </summary>
                          <ul data-panel="" className={s.panel}>
                            {L.services.map((svc) => (
                              <li key={svc.href}>
                                <Link href={svc.href} className={s.svc}>
                                  <span className={`${s.sname} type-display`}>
                                    {svc.name}
                                    <span className="sr-only">: </span>
                                  </span>
                                  <ArrowUpRight className={s.arr} />
                                  <span className={s.stag}>{svc.tagline}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      </li>
                    ))}
                  </ol>
                  <div className={`${s.stackCell} col-span-4 sm:col-span-6 lg:col-span-6 lg:col-start-7`}>{stack}</div>
                </div>
              </div>
            </div>
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
