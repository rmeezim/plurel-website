"use client";

import { useEffect, useRef } from "react";

/*
  Marks the sibling [data-pause-offscreen] list with data-off while it is
  outside the viewport; CSS pauses its animation then, so a far-off marquee
  does no work. Renders nothing.
*/
export function PauseOffscreen() {
  const mark = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = mark.current?.parentElement?.querySelector<HTMLElement>("[data-pause-offscreen]");
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.removeAttribute("data-off");
      else el.setAttribute("data-off", "");
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <span ref={mark} hidden />;
}
