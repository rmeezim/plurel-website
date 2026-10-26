"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "@/components/reveal";
import { CONTAINER, GRID, H2 } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import s from "./accountability.module.css";

/*
  Accountability, on graphite: ten suppliers report ten numbers, we
  answer for one. Between the headline and the terms, two strips of display type
  cross the full width as the reader scrolls through them (no pin): the
  figures suppliers report, dimmed, drift left; the numbers a business
  runs on, in full paper, each marked with a signal-red square,
  drift right, a little slower. Each strip lands exactly on the grid, its
  first figure under its label, as it crosses the middle of the screen.
  The supplier figures are generic examples, not anyone's results: ten
  of them, one for each supplier the headline counts.

  Transforms only; the frame work runs only while the strips are on
  screen, and widths are measured on resize and once fonts load. Without
  JS or with reduced motion the strips stand still, wrapped, every figure
  in view (accountability.module.css).
*/

const REPORTED = [
  "Reach 2.4M",
  "Impressions 1.2M",
  "Followers +8%",
  "Click-through 2.1%",
  "Views 1.4M",
  "Sessions 84K",
  "Mentions 38",
  "Articles 24",
  "PageSpeed 96",
  "Organic traffic +12%",
];

const ANSWERED = ["Orders", "Installs", "Demos", "Stockists", "Bookings", "Sign-ups", "Renewals"];

const TERMS = [
  ["Agreed", "In the Diagnostic, before any work starts"],
  ["Read", "Every month, with the signals that moved it"],
  ["Reset", "Every quarter, when the budget moves to the bottleneck"],
] as const;

/** Slide to the right per pixel scrolled down: the suppliers' strip left, a touch faster */
const DRIFT = { report: -1.35, answer: 0.95 } as const;

type Tone = keyof typeof DRIFT;

function Strip({
  id,
  label,
  items,
  tone,
  className = "",
}: {
  id: string;
  label: string;
  items: readonly string[];
  tone: Tone;
  className?: string;
}) {
  const ink = tone === "report" ? "text-paper/40" : "text-paper";
  const labelTone = tone === "report" ? "text-fog" : "text-paper";
  const list = (copy: boolean) => (
    <ul
      aria-hidden={copy || undefined}
      aria-labelledby={copy ? undefined : id}
      data-list={copy ? undefined : ""}
      className={`${s.list} ${copy ? s.copy : ""}`}
    >
      {items.map((m) => (
        <li key={m} className={s.item}>
          {m}
        </li>
      ))}
    </ul>
  );
  return (
    <div className={className}>
      <div className={CONTAINER}>
        <p
          id={id}
          className={`border-t border-paper/15 pt-5 text-[14px] font-medium leading-none sm:text-[15px] ${labelTone}`}
        >
          {label}
        </p>
      </div>
      <div className={`${s.clip} mt-5 sm:mt-6`}>
        <div className={CONTAINER}>
          <div data-strip={tone} className={`${s.strip} ${s[tone]} type-display ${ink}`}>
            {list(true)}
            {list(false)}
            {list(true)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccountabilityChapter() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const strips = Array.from(root.querySelectorAll<HTMLElement>("[data-strip]")).map((el) => ({
      el,
      drift: DRIFT[el.dataset.strip as Tone] ?? 0,
      // cached: the grid edge it rests on, where its real list starts
      // inside it, its width, and its middle below the block's top
      rest: 0,
      lead: 0,
      width: 0,
      mid: 0,
    }));
    if (!strips.length) return;

    let raf = 0;
    let listening = false;
    let moving = false;
    let vw = 0;

    const measure = () => {
      // the stylesheet decides: one line per strip with JS and motion allowed
      moving = motion.matches && getComputedStyle(strips[0].el).display === "flex";
      vw = document.documentElement.clientWidth;
      const top = root.getBoundingClientRect().top;
      for (const st of strips) {
        const box = st.el.parentElement!;
        const real = st.el.querySelector<HTMLElement>("[data-list]")!;
        const r = st.el.getBoundingClientRect();
        st.rest = box.getBoundingClientRect().left + parseFloat(getComputedStyle(box).paddingLeft);
        st.lead = real.offsetLeft - st.el.offsetLeft;
        st.width = st.el.scrollWidth;
        st.mid = r.top - top + r.height / 2;
      }
    };

    const paint = () => {
      raf = 0;
      if (!moving) {
        for (const st of strips) st.el.style.transform = "";
        return;
      }
      const top = root.getBoundingClientRect().top;
      const vh = window.innerHeight;
      for (const st of strips) {
        // distance of the strip's middle below the middle of the screen
        const off = top + st.mid - vh / 2;
        let x = -st.lead - st.drift * off;
        // keep the line wider than the screen on both sides
        x = Math.min(-st.rest, Math.max(vw - st.rest - st.width, x));
        st.el.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      }
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const remeasure = () => {
      measure();
      queue();
    };
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      for (const st of strips) st.el.classList.toggle(s.live, on);
      if (on) window.addEventListener("scroll", queue, { passive: true });
      else window.removeEventListener("scroll", queue);
    };

    measure();
    paint();
    const io = new IntersectionObserver(
      ([e]) => {
        listen(e.isIntersecting);
        queue();
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(root);
    const ro = new ResizeObserver(remeasure);
    ro.observe(root);
    document.fonts?.ready.then(remeasure);
    motion.addEventListener("change", remeasure);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      listen(false);
      motion.removeEventListener("change", remeasure);
    };
  }, []);

  return (
    <section aria-labelledby="accountability-heading" className="bg-graphite text-paper">
      <div className={`${CONTAINER} pt-24 lg:pt-36`}>
        <TypeReveal
          as="h2"
          id="accountability-heading"
          className={H2}
          lines={["Ten suppliers report ten numbers.", "We answer for one."]}
        />
      </div>

      <div ref={ref} className="mt-24 sm:mt-28 lg:mt-36">
        <Strip id="accountability-reported" label="What suppliers report" items={REPORTED} tone="report" />
        <Strip
          id="accountability-answered"
          label="What we answer for"
          items={ANSWERED}
          tone="answer"
          className="mt-14 sm:mt-16 lg:mt-20"
        />
      </div>

      <div className={`${CONTAINER} pb-24 pt-24 sm:pt-28 lg:pb-36 lg:pt-36`}>
        <div className={`${GRID} gap-y-12`}>
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-6">
            <p className="max-w-[36ch] text-[20px] leading-[1.45] lg:text-[23px]">
              Reach and mentions are tracked as causes. We answer for the effect: the one number
              your business runs on, agreed before any work starts. Orders for a consumer brand,
              installs for an app, demos for a software company, stockists for a product on
              shelves.
            </p>
          </Reveal>
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-5 lg:col-start-8">
            <dl>
              {TERMS.map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[6.5rem_1fr] gap-4 border-t border-paper/15 py-4 first:border-t-0 first:pt-1"
                >
                  <dt className="text-[14px] leading-[1.6] text-fog">{k}</dt>
                  <dd className="text-[16px] leading-[1.5]">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
