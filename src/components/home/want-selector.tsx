"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { GRID } from "@/components/system";
import { useArrival } from "@/components/type-reveal";
import s from "./came-for.module.css";

/*
  The selector behind What you came for (came-for.tsx). The four wants are
  the chapter's headline and its controls at once: a tab list set in
  display type, the chosen one in paper with a paper rule under it, the
  others in blush. Under them, one panel per want: the want in the
  visitor's words, Plurel's line on it, and the four layers of the
  Plurel System, each with what it does for that want, on a spine.

  Motion, in the site's vocabulary: the four words are plotted once as
  the chapter arrives (the same window-over-text sweep as TypeReveal,
  one pen, reading order), then the chosen word's rule is drawn. Picking
  another want lights its panel, its lines one after another, by opacity
  alone. Without JS every panel shows, one after another; reduced
  motion gets the same switching with no motion.

  Keyboard: the tabs follow the ARIA tabs pattern (arrows, Home, End).
*/

export type Want = {
  key: string;
  term: string;
  /** What the visitor wants, in their words */
  want: string;
  /** Plurel's line on it */
  stance: string;
  /** What each layer does for it, in the System's order */
  layers: readonly string[];
};

/** The tabs' plotting pace and a space's crossing, in ms per character */
const PACE = 24;

/** Where the pen is at each word, and when it lifts: one clock across the four */
function schedule(terms: readonly string[]) {
  let clock = 0;
  const timed = terms.map((term, i) => {
    if (i > 0) clock += PACE;
    const t = { t: clock, d: term.length * PACE };
    clock += t.d;
    return t;
  });
  return { timed, total: clock };
}

export function WantSelector({
  wants,
  layerNames,
  labelledBy,
  children,
}: {
  wants: readonly Want[];
  layerNames: readonly string[];
  labelledBy: string;
  /** What sits between the four words and the panel (the standfirst) */
  children?: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [moved, setMoved] = useState(false);
  const [played, setPlayed] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { timed, total } = schedule(wants.map((w) => w.term));
  const arrival = useArrival(listRef, true, total);
  // the panel lights once the words are plotted (it waits for the pen)
  const panelsIn = useArrival(panelsRef, true);

  // once the words are plotted, a new choice draws its rule at once
  useEffect(() => {
    if (arrival !== "in") return;
    const id = window.setTimeout(() => setPlayed(true), total + 300);
    return () => window.clearTimeout(id);
  }, [arrival, total]);

  const choose = (i: number, focus = false) => {
    setActive(i);
    setMoved(true);
    if (focus) tabs.current[i]?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const n = wants.length;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (active + 1) % n
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (active - 1 + n) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    choose(next, true);
  };

  return (
    <div className={s.selector} data-moved={moved || undefined}>
      <div
        ref={listRef}
        role="tablist"
        aria-labelledby={labelledBy}
        className={`${s.tabs} type-reveal`}
        data-state={arrival}
        data-played={played || undefined}
        style={{ "--total": `${total}ms` } as CSSProperties}
      >
        {wants.map((w, i) => (
          <button
            key={w.key}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`want-tab-${w.key}`}
            aria-selected={i === active}
            aria-controls={`want-panel-${w.key}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => choose(i)}
            onKeyDown={onKey}
            className={`${s.tab} type-display`}
          >
            <span
              className="tr-w"
              style={{ "--t": `${timed[i].t}ms`, "--d": `${timed[i].d}ms` } as CSSProperties}
            >
              <span className="tr-u">{w.term}</span>
            </span>
          </button>
        ))}
      </div>

      {children}

      <div
        ref={panelsRef}
        className={`${s.panels}${panelsIn === "armed" ? " reveal-armed" : panelsIn === "in" ? " reveal-in" : ""}`}
      >
        {wants.map((w, i) => (
          <div
            key={w.key}
            role="tabpanel"
            id={`want-panel-${w.key}`}
            aria-labelledby={`want-tab-${w.key}`}
            tabIndex={0}
            className={s.panel}
            data-active={i === active || undefined}
          >
            <div className={`${GRID} gap-y-4`}>
              <p className={`${s.want} type-title`} style={{ "--i": 0 } as CSSProperties}>
                {w.want}
              </p>
              <p className={s.stance} style={{ "--i": 1 } as CSSProperties}>
                {w.stance}
              </p>
            </div>
            <ol className={s.layers}>
              {w.layers.map((line, j) => (
                <li key={layerNames[j]} className={s.layer} style={{ "--i": j + 2 } as CSSProperties}>
                  <span aria-hidden className={s.node} />
                  <span className={s.lname}>{layerNames[j]}</span>
                  <span className={s.lline}>{line}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
