"use client";

import { useEffect, useState, type ReactNode } from "react";

/*
  The brief's contents rail (desktop): the page's sections, the one being
  read lit, each a link to its section; under them the page's action. It
  keeps to the screen as the page scrolls.
*/
export function BriefRail({ sections, children }: { sections: readonly { id: string; title: string }[]; children?: ReactNode }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav aria-label="On this page" className="sticky top-28">
      <p className="text-[13px] text-fog">On this page</p>
      <ol className="mt-4 border-l border-paper/15">
        {sections.map((s) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={on ? "location" : undefined}
                className={`-ml-px block border-l py-1.5 pl-4 text-[15px] leading-[1.35] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper ${
                  on ? "border-signal text-paper" : "border-transparent text-fog hover:text-paper"
                }`}
              >
                {s.title}
              </a>
            </li>
          );
        })}
      </ol>
      {children && <div className="mt-8">{children}</div>}
    </nav>
  );
}
