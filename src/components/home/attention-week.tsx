"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { GRID } from "@/components/system";
import { WEEK, WEEK_DAYS, momentAt } from "@/lib/attention-field";
import s from "./attention-field.module.css";

/*
  The week's narrator (attention-field.tsx renders the week itself). On a
  desktop with JS it is a sticky block on columns 1 to 4, vertically
  centred, that tells the moment whose tile holds the middle of the
  screen: the week strip, the day and time set large, and the moment's one
  sentence. When the moment changes the day and the time turn over like a
  clock (up, or down when scrolling back), then the sentence follows; with
  reduced motion they simply change. Everywhere else (phones, tablets, short screens, no JS) the CSS
  hides it and each moment's own text, server-rendered beside or above its
  tile, tells the story. The narrator is decoration (aria-hidden): the list
  is what assistive tech reads.

  It reads the tiles' boxes on scroll only while the week is near the
  screen, once a frame at most, and never in a layout that hides it.
*/

type At = { i: number; from: number; n: number };

export function AttentionWeek({ children }: { children: ReactNode }) {
  const list = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState<At>({ i: 0, from: 0, n: 0 });

  useEffect(() => {
    const root = list.current;
    const side = rail.current;
    if (!root || !side || typeof IntersectionObserver === "undefined") return;
    const media = [...root.querySelectorAll<HTMLElement>("[data-moment-media]")];
    if (!media.length) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      // hidden by the layout (phones, tablets, short screens): nothing to tell
      if (!side.offsetParent) return;
      const i = momentAt(
        media.map((el) => el.getBoundingClientRect()),
        window.innerHeight / 2,
      );
      setAt((a) => (a.i === i ? a : { i, from: a.i, n: a.n + 1 }));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    let on = false;
    const listen = (yes: boolean) => {
      if (yes === on) return;
      on = yes;
      if (yes) {
        window.addEventListener("scroll", queue, { passive: true });
        window.addEventListener("resize", queue);
        queue();
      } else {
        window.removeEventListener("scroll", queue);
        window.removeEventListener("resize", queue);
      }
    };
    const io = new IntersectionObserver(([e]) => listen(e.isIntersecting), { rootMargin: "25% 0px" });
    io.observe(root);
    return () => {
      io.disconnect();
      listen(false);
      cancelAnimationFrame(raf);
    };
  }, []);

  const now = WEEK[at.i];
  const was = WEEK[at.from];
  const moved = at.n > 0 && at.i !== at.from;

  return (
    <div className={`${GRID} ${s.week}`}>
      <div ref={rail} className={s.rail} aria-hidden="true">
        <div className={s.stick}>
          <Reveal className={s.block}>
            <div className={s.narrator} data-dir={at.i >= at.from ? "fwd" : "back"}>
              <Strip i={at.i} />
              <p className={`${s.clock} type-display`}>
                <Roll a={was.day} b={now.day} n={at.n} className={s.clockDay} />
                <Roll a={was.time} b={now.time} n={at.n} className={s.clockTime} />
              </p>
              <div className={s.lines}>
                {moved ? (
                  <p key={`o${at.n}`} className={s.lineOut}>
                    {was.line}
                  </p>
                ) : null}
                <p key={`i${at.n}`} className={moved ? s.lineIn : undefined}>
                  {now.line}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <div ref={list} className={s.list}>
        {children}
      </div>
    </div>
  );
}

/**
 * The week strip: a letter a day, Monday to the Monday she books, with a
 * square under it for each moment that day: ink once it has passed, red
 * for the one on screen, faint for the ones to come
 */
function Strip({ i }: { i: number }) {
  const today = WEEK[i].d;
  return (
    <div className={s.strip}>
      <div className={s.days}>
        {WEEK_DAYS.map((letter, d) => (
          <span key={d} className={s.stripDay} data-state={d < today ? "past" : d === today ? "now" : "next"}>
            <b>{letter}</b>
            <span className={s.ticks}>
              {WEEK.map((m, k) =>
                m.d === d ? <i key={k} data-state={k < i ? "past" : k === i ? "now" : "next"} /> : null,
              )}
            </span>
          </span>
        ))}
      </div>
      {/* in view for the whole week: the story is a sample */}
      <span className={s.sample}>Sample week</span>
    </div>
  );
}

/**
 * Text that rolls where it changes, like a clock turning over: the old
 * string leaves and the new one arrives in the same window, a character
 * at a time, from the first character that differs (what they share
 * stays put). Each string keeps its own proportional spacing, so the
 * figures stay the face's plain lining ones, not its tabular set.
 */
function Roll({ a, b, n, className = "" }: { a: string; b: string; n: number; className?: string }) {
  if (n === 0 || a === b) {
    return (
      <span className={className}>
        <span className={s.roll}>
          <span>{b}</span>
        </span>
      </span>
    );
  }
  let p = 0;
  while (p < a.length && p < b.length && a[p] === b[p]) p++;
  const chars = (str: string) =>
    [...str.slice(p)].map((ch, k) => (
      <span key={k} className={s.ch} style={{ "--k": k } as CSSProperties}>
        {ch}
      </span>
    ));
  return (
    <span className={className}>
      <span key={n} className={s.roll}>
        <span className={s.rollOut}>
          <span className={s.keep}>{a.slice(0, p)}</span>
          {chars(a)}
        </span>
        <span className={s.rollIn}>
          {b.slice(0, p)}
          {chars(b)}
        </span>
      </span>
    </span>
  );
}
