"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/**
 * Scroll-entrance wrapper: content rises and fades in the first time it
 * scrolls into view. Children stay server-rendered; this wrapper only arms
 * itself after hydration, and only for content still below the fold — so
 * no-JS visitors, reduced-motion visitors, and anything already on screen
 * render plainly. Stagger siblings with `delay` (seconds).
 */
export function Reveal({
  children,
  delay = 0,
  sweep = false,
  className,
}: {
  children: ReactNode;
  delay?: number;
  /** Arrive diagonally from the lower left instead of straight up */
  sweep?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "armed" | "in">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.92) return;

    setState("armed");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setState("in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${state === "armed" ? "reveal-armed" : ""}${
        state === "in" ? "reveal-in" : ""
      }${sweep ? " reveal-sweep" : ""}${className ? ` ${className}` : ""}`}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
