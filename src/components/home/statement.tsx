"use client";

import { useEffect, useRef } from "react";
import { ArtField } from "@/components/art";
import { CONTAINER, GRID } from "@/components/system";
import s from "./statement.module.css";

/*
  What Plurel is: the hero's second beat, in the same graphite room and
  with no label. One statement whose words light as the reader reaches
  them, scroll-linked (the work runs in a frame only while it is on
  screen), then the firm's particulars as a fact sheet on a hairline.
  Behind the type, the mark is stamped faintly into the room, cropped by
  its right edge. Without JS, or with reduced motion, the words are lit.

  Each word is one span whose text carries its own trailing space, so the
  paragraph reads as one sentence in the accessibility tree.
*/

const STATEMENT =
  "Plurel is a distribution engineering firm. We build and run the system that makes a growing company impossible to miss for the people it sells to, and we answer for the growth it brings.";

const WORDS = STATEMENT.split(" ");

const FACTS = [
  ["Built for", "Consumer brands, physical products, B2B technology and apps"],
  ["How it runs", "One team, one brief, every relevant surface"],
  ["Answers for", "One number, agreed on day one"],
  ["Starts with", "The Diagnostic, back within a business day"],
] as const;

export function StatementChapter() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const words = Array.from(p.querySelectorAll<HTMLElement>("[data-word]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let lit = -1;
    let listening = false;

    const paint = () => {
      raf = 0;
      let n = words.length;
      if (!reduce.matches) {
        // the first word lights as the statement clears 85% of the screen,
        // the last as its foot reaches 60%
        const r = p.getBoundingClientRect();
        const vh = window.innerHeight;
        const from = vh * 0.85;
        const to = vh * 0.6;
        const t = (from - r.top) / (from - to + r.height);
        n = Math.round(Math.min(1, Math.max(0, t)) * words.length);
      }
      if (n === lit) return;
      lit = n;
      words.forEach((w, i) => w.toggleAttribute("data-lit", i < n));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) window.addEventListener("scroll", queue, { passive: true });
      else window.removeEventListener("scroll", queue);
    };

    // scroll work only while the statement is on screen; one last paint as
    // it leaves settles it lit (passed) or dim (still to come)
    const io = new IntersectionObserver(([e]) => {
      listen(e.isIntersecting);
      queue();
    });
    io.observe(p);
    window.addEventListener("resize", queue);
    reduce.addEventListener("change", queue);
    paint();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      listen(false);
      window.removeEventListener("resize", queue);
      reduce.removeEventListener("change", queue);
    };
  }, []);

  return (
    <section aria-labelledby="statement-heading" className="bg-graphite text-paper">
      {/* The statement's room: the mark sits behind it, centered on it and
          cropped by the right edge; the fact sheet below stays clear. This
          block, not the section, clips the art, so its drift reads the page
          scroll. */}
      <div className="relative isolate overflow-hidden">
        <ArtField kind="mark" tone="dark" />
        <div className={`${CONTAINER} pb-24 pt-28 sm:pt-36 lg:pb-36 lg:pt-48`}>
          <h2 id="statement-heading" className="sr-only">
            What Plurel is
          </h2>
          <p
            ref={ref}
            className="max-w-[22ch] text-[clamp(2.1rem,1rem+3.4vw,4.6rem)] font-normal leading-[1.04] tracking-[-0.03em] sm:max-w-[24ch] lg:max-w-[25ch]"
          >
            {WORDS.map((w, i) => (
              <span key={i} data-word="" className={s.word}>
                {i < WORDS.length - 1 ? `${w} ` : w}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className={`${CONTAINER} pb-24 lg:pb-32`}>
        <dl className={`${GRID} gap-y-9 border-t border-paper/15 pt-8`}>
          {FACTS.map(([k, v]) => (
            <div key={k} className="col-span-2 sm:col-span-3 lg:col-span-3">
              <dt className="text-[13px] text-fog">{k}</dt>
              <dd className="mt-2.5 max-w-[26ch] text-[17px] leading-[1.35] lg:text-[19px]">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
