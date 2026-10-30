"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { motionAllowed } from "@/lib/pen";

/*
  The console: the one frame every live instrument on the site shares
  (the engagement and discipline pages, the homepage's engine), so they
  read as views of one system rather than drawings made for a page.

  An instrument is a small working model of something the system does,
  run as a labelled simulation (seeded, so every visitor sees the same
  run) or a real measurement (the page measuring itself). It answers one
  question a buyer asks, shows the mechanism moving, and lets the reader
  act on it: inspect a mark, step the clock, change an input.

  - useSim keeps its clock: it runs only while the console is on screen,
    in a visible tab, and with motion allowed. It renders on the server
    (and without JS) at its settled state, the run finished; with motion
    it starts from the beginning on the client and plays once on screen;
    under reduced motion it stays settled and moves only when stepped.
  - Console is the frame: a bar with the instrument's name, what kind of
    view it is, its clock and its controls (play and pause, step, reset),
    the instrument itself, and a foot with its readout (what it shows, in
    words) and its note (what the numbers are, in plain view).

  Its parts are flat: hairlines, squares and tabular figures, paper and
  fog on graphite, the signal red for what is live. No glows, gradients
  or blur, and nothing eases in or bounces.
*/

export type Sim = {
  /** The clock, in the instrument's own unit */
  t: number;
  /** The reader wants it running (not paused) */
  playing: boolean;
  /** It is advancing now: playing, on screen, visible, motion allowed */
  running: boolean;
  /** Motion is allowed on this screen */
  motion: boolean;
  /** It reached its end */
  ended: boolean;
  /** Has been on screen at least once */
  seen: boolean;
  toggle: () => void;
  step: () => void;
  reset: () => void;
  seek: (t: number) => void;
};

/**
 * The instrument's clock. `end` is its length; `rate` units per second;
 * `by` what a step adds; `settled` where it opens under reduced motion
 * (its finished state, by default the end).
 */
const MOTION_QUERY = "screen and (prefers-reduced-motion: no-preference)";
function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function useSim(
  ref: RefObject<HTMLElement | null>,
  { end, rate, by, settled = end, hz = 30 }: { end: number; rate: number; by: number; settled?: number; hz?: number },
): Sim {
  // null until the reader's run starts: the server, no JS and reduced
  // motion show the settled state; with motion the run starts at zero
  const [own, setOwn] = useState<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const [onScreen, setOnScreen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [seen, setSeen] = useState(false);
  const motion = useSyncExternalStore(subscribeMotion, motionAllowed, () => false);
  const t = own ?? (motion ? 0 : settled);
  const tRef = useRef(t);
  useLayoutEffect(() => {
    tRef.current = t;
  }, [t]);

  const set = useCallback((v: number) => {
    tRef.current = v;
    setOwn(v);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setOnScreen(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    const vis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", vis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, [ref]);

  const ended = t >= end;
  const running = playing && onScreen && visible && motion && !ended;

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      acc += dt;
      if (acc >= 1 / hz) {
        const next = Math.min(end, tRef.current + acc * rate);
        acc = 0;
        set(next);
        if (next >= end) return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [running, end, rate, hz, set]);

  return {
    t,
    playing,
    running,
    motion,
    ended,
    seen,
    toggle: () => {
      if (tRef.current >= end) {
        set(0);
        setPlaying(true);
      } else setPlaying((p) => !p);
    },
    step: () => {
      setPlaying(false);
      set(Math.min(end, Math.floor(tRef.current / by + 1e-6) * by + by));
    },
    reset: () => {
      set(0);
      setPlaying(motion);
    },
    seek: (v: number) => set(Math.max(0, Math.min(end, v))),
  };
}

/** The frame every instrument shares */
export function Console({
  sim,
  title,
  kind = "Simulation",
  clock,
  label,
  stepLabel,
  readout,
  note,
  tone = "dark",
  className = "",
  frameRef,
  children,
}: {
  sim?: Sim;
  title: string;
  /** What kind of view it is: a simulation, or a real measurement */
  kind?: "Simulation" | "Live measurement" | "Illustration";
  /** The clock's reading, in words and figures */
  clock?: ReactNode;
  /** What the instrument shows, for assistive tech */
  label: string;
  /** What one step does, for the Step control's name */
  stepLabel?: string;
  /** What it shows now, in words */
  readout?: ReactNode;
  /** What the numbers are, in plain view */
  note: ReactNode;
  tone?: "dark" | "red";
  className?: string;
  frameRef?: RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  const red = tone === "red";
  const line = red ? "border-paper/35" : "border-paper/12";
  return (
    <figure
      ref={frameRef as RefObject<HTMLElement>}
      className={`m-0 border ${line} ${red ? "bg-ember/40" : "bg-paper/[0.025]"} ${className}`}
    >
      <div className={`flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b ${line} px-3 py-2 sm:px-4`}>
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden
            className={`size-[7px] shrink-0 transition-colors duration-300 ${sim?.running ? "bg-signal" : red ? "bg-paper/50" : "bg-fog/50"}`}
          />
          <span className="truncate text-[14px] font-medium leading-none text-paper">{title}</span>
          <span className={`inline-flex h-[22px] shrink-0 items-center border px-1.5 text-[13px] leading-none ${red ? "border-paper/40 text-paper" : "border-paper/20 text-fog"}`}>
            {kind}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {clock != null && (
            <span className={`font-mono text-[13px] leading-none tabular-nums ${red ? "text-paper" : "text-fog"}`}>{clock}</span>
          )}
          {sim && (
            <div className="flex items-center gap-1">
              {sim.motion && (
                <ConsoleButton onClick={sim.toggle} label={sim.ended ? "Replay" : sim.playing ? "Pause" : "Play"} red={red} wide>
                  {sim.playing && !sim.ended ? <PauseIcon /> : <PlayIcon />}
                  <span aria-hidden className="text-[13px] font-medium">
                    {sim.ended ? "Replay" : sim.playing ? "Pause" : "Play"}
                  </span>
                </ConsoleButton>
              )}
              <ConsoleButton onClick={sim.step} label={stepLabel ?? "Step"} red={red} disabled={sim.ended}>
                <StepIcon />
              </ConsoleButton>
              <ConsoleButton onClick={sim.reset} label="Start again" red={red}>
                <ResetIcon />
              </ConsoleButton>
            </div>
          )}
        </div>
      </div>
      <p className="sr-only">{label}</p>
      {children}
      {(readout || note) && (
        <figcaption className={`grid gap-y-2 border-t ${line} px-3 py-3 sm:px-4 lg:grid-cols-12 lg:gap-x-6`}>
          {readout && <p className="text-[15px] leading-[1.5] text-paper lg:col-span-7">{readout}</p>}
          <p className={`text-[13px] leading-[1.5] lg:col-span-5 lg:text-right ${red ? "text-paper/85" : "text-fog"}`}>{note}</p>
        </figcaption>
      )}
    </figure>
  );
}

export function ConsoleButton({
  onClick,
  label,
  red = false,
  wide = false,
  disabled = false,
  pressed,
  children,
}: {
  onClick: () => void;
  label: string;
  red?: boolean;
  wide?: boolean;
  disabled?: boolean;
  pressed?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      disabled={disabled}
      className={`inline-flex h-8 items-center justify-center gap-1.5 border text-paper transition-colors disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper ${
        wide ? "px-2.5" : "w-8"
      } ${red ? "border-paper/40 hover:border-paper" : "border-paper/20 hover:border-paper/70"} ${pressed ? "bg-paper/10" : ""}`}
    >
      {children}
    </button>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden viewBox="0 0 10 10" className="size-2.5 fill-current">
      <path d="M2 1l7 4-7 4z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg aria-hidden viewBox="0 0 10 10" className="size-2.5 fill-current">
      <path d="M2 1h2v8H2zM6 1h2v8H6z" />
    </svg>
  );
}
function StepIcon() {
  return (
    <svg aria-hidden viewBox="0 0 10 10" className="size-2.5 fill-current">
      <path d="M1 1l5 4-5 4zM7 1h2v8H7z" />
    </svg>
  );
}
function ResetIcon() {
  return (
    <svg aria-hidden viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square">
      <path d="M2.5 6a3.5 3.5 0 1 0 1.1-2.55" />
      <path d="M2 1.5v2.5h2.5" />
    </svg>
  );
}

/** Tracks the element's size, for instruments that lay out to their box */
export function useBox(ref: RefObject<HTMLElement | null>) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const r = e.contentRect;
      setBox((b) => (Math.abs(b.w - r.width) < 0.5 && Math.abs(b.h - r.height) < 0.5 ? b : { w: r.width, h: r.height }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return box;
}
