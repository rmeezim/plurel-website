"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Pause, Play } from "@/components/icons";

export type HeroSource = { src: string; type: string; media?: string };

/*
  Hero motion: one film, many surfaces.

  HeroMotion owns the single <video>. It plays full-bleed behind the hero,
  softened and graded red, and every FilmCanvas on the distribution wall
  mirrors the same frame, cropped to its own format. One decode, perfectly
  in sync: the same story cut for a reel, a feed post, a billboard.

  It also owns the one pause control. Pausing stops the film and the
  wall's drift together (anything moving for more than five seconds needs
  a way to stop it, WCAG 2.2.2). Reduced-motion and data-saver visitors
  start paused.
*/

type Focus = { x: number; y: number };
type Entry = { focus: Focus; visible: boolean };

type MotionState = {
  hasFilm: boolean;
  paused: boolean;
  canPlay: boolean;
  toggle: () => void;
  register: (canvas: HTMLCanvasElement, focus: Focus) => () => void;
};

const MotionContext = createContext<MotionState | null>(null);

/** object-fit: cover, with a focal point, from the video into a canvas */
function drawCover(canvas: HTMLCanvasElement, video: HTMLVideoElement, focus: Focus) {
  const ctx = canvas.getContext("2d");
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!ctx || !vw || !vh || !canvas.width || !canvas.height) return;
  const scale = Math.max(canvas.width / vw, canvas.height / vh);
  const sw = canvas.width / scale;
  const sh = canvas.height / scale;
  ctx.drawImage(
    video,
    (vw - sw) * focus.x,
    (vh - sh) * focus.y,
    sw,
    sh,
    0,
    0,
    canvas.width,
    canvas.height,
  );
}

export function HeroMotion({
  sources,
  poster,
  className = "",
  labelledBy,
  children,
}: {
  sources: HeroSource[] | null;
  poster?: string;
  className?: string;
  labelledBy: string;
  children: ReactNode;
}) {
  const hasFilm = !!sources?.length;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvases = useRef(new Map<HTMLCanvasElement, Entry>());
  const userPaused = useRef(false);
  const [paused, setPaused] = useState(false);
  const [canPlay, setCanPlay] = useState(true);
  const [ready, setReady] = useState(false);

  const paint = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;
    canvases.current.forEach((entry, canvas) => {
      if (entry.visible) drawCover(canvas, video, entry.focus);
    });
  }, []);

  const register = useCallback(
    (canvas: HTMLCanvasElement, focus: Focus) => {
      const entry: Entry = { focus, visible: true };
      canvases.current.set(canvas, entry);
      const io = new IntersectionObserver(([e]) => {
        entry.visible = !!e?.isIntersecting;
      });
      io.observe(canvas);
      paint();
      return () => {
        io.disconnect();
        canvases.current.delete(canvas);
      };
    },
    [paint],
  );

  // Who starts paused, and the off-screen pause
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData === true;

    if (reduce || saveData) {
      userPaused.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a user preference
      setPaused(true);
      if (!hasFilm) setCanPlay(false);
      videoRef.current?.pause();
      return;
    }

    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      /* Autoplay refused (low-power mode); the control stays available */
    });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && !userPaused.current) video.play().catch(() => {});
        else if (!entry.isIntersecting) video.pause();
      },
      { threshold: 0.1 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [hasFilm]);

  // Mirror loop: ~30fps while playing, one frame when paused or seeked
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (t - last < 33) return;
      last = t;
      paint();
    };
    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      paint();
    };
    video.addEventListener("play", start);
    video.addEventListener("pause", stop);
    video.addEventListener("loadeddata", paint);
    video.addEventListener("seeked", paint);
    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("play", start);
      video.removeEventListener("pause", stop);
      video.removeEventListener("loadeddata", paint);
      video.removeEventListener("seeked", paint);
    };
  }, [paint]);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    const next = !paused;
    userPaused.current = next;
    setPaused(next);
    if (!video) return;
    if (next) video.pause();
    else video.play().catch(() => {});
  }, [paused]);

  const state = useMemo(
    () => ({ hasFilm, paused, canPlay, toggle, register }),
    [hasFilm, paused, canPlay, toggle, register],
  );

  return (
    <MotionContext.Provider value={state}>
      <section
        aria-labelledby={labelledBy}
        data-paused={paused ? "true" : "false"}
        className={className}
      >
        {hasFilm && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="auto"
            poster={poster}
            aria-hidden
            tabIndex={-1}
            onCanPlay={() => setReady(true)}
            className={`hero-film absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-[1400ms] ${
              ready || poster ? "opacity-100" : "opacity-0"
            }`}
          >
            {sources!.map((s) => (
              <source key={s.src} src={s.src} type={s.type} media={s.media} />
            ))}
          </video>
        )}
        {children}
      </section>
    </MotionContext.Provider>
  );
}

/** A frame on the wall that shows the hero film, cropped around `focus` */
export function FilmCanvas({
  focus = { x: 0.5, y: 0.5 },
  className = "",
}: {
  focus?: Focus;
  className?: string;
}) {
  const ctx = useContext(MotionContext);
  const ref = useRef<HTMLCanvasElement>(null);
  const register = ctx?.register;
  const fx = focus.x;
  const fy = focus.y;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !register) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const size = () => {
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    const unregister = register(canvas, { x: fx, y: fy });
    return () => {
      ro.disconnect();
      unregister();
    };
  }, [register, fx, fy]);

  return <canvas ref={ref} aria-hidden className={`absolute inset-0 h-full w-full ${className}`} />;
}

/** The single pause control for the film and the wall */
export function MotionControl({ className = "" }: { className?: string }) {
  const ctx = useContext(MotionContext);
  if (!ctx || !ctx.canPlay) return null;
  const { paused, toggle, hasFilm } = ctx;
  const noun = hasFilm ? "film" : "motion";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={paused ? `Play ${noun}` : `Pause ${noun}`}
      className={`inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-paper/80 transition-colors hover:text-paper ${className}`}
    >
      <span className="inline-flex size-8 items-center justify-center border border-paper/40">
        {paused ? <Play className="size-3" /> : <Pause className="size-3" />}
      </span>
      {paused ? `Play ${noun}` : `Pause ${noun}`}
    </button>
  );
}
