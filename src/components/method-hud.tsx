"use client";

import { useEffect, useState } from "react";

/*
 * A fixed "you are here" instrument for the methodology page. Watches the
 * [data-act] sections and reports which phase of the engagement the reader
 * is inside — phase name and week range — from a small chip pinned to the
 * bottom-left of the viewport. Desktop only; stays away for reduced-motion
 * readers and disappears outside the acts.
 */
export function MethodHud() {
  const [label, setLabel] = useState<{ act: string; week: string } | null>(
    null,
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const measure = () => {
      raf = 0;
      const sections =
        document.querySelectorAll<HTMLElement>("section[data-act]");
      const focus = window.innerHeight * 0.5;
      let current: { act: string; week: string } | null = null;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= focus && rect.bottom > focus) {
          current = {
            act: section.dataset.act ?? "",
            week: section.dataset.week ?? "",
          };
        }
      });
      setLabel((prev) =>
        prev?.act === current?.act && prev?.week === current?.week
          ? prev
          : current,
      );
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={`fixed bottom-5 left-5 z-40 hidden items-center gap-2.5 rounded-full border border-paper/20 bg-ink/90 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-paper shadow-[0_10px_30px_-12px_rgba(17,15,10,0.6)] backdrop-blur-sm transition-all duration-300 lg:flex ${
        label ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <span className="diagram-blink size-1.5 rounded-full bg-brand" />
      <span className="text-paper/60">MTD&middot;04</span>
      <span className="text-paper/30">/</span>
      <span>{label?.act}</span>
      <span className="text-paper/30">/</span>
      <span className="text-paper/60">{label?.week}</span>
    </div>
  );
}
