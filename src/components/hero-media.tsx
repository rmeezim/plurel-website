"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "@/components/icons";

export type HeroSource = { src: string; type: string; media?: string };

/*
  The hero film. Muted, looping, inline. It fades in over the fallback
  scene once it can play, pauses whenever the hero is off screen, and
  never autoplays for visitors who ask for reduced motion or less data.
  The pause control is required: anything moving for more than five
  seconds needs a way to stop it (WCAG 2.2.2).
*/
export function HeroMedia({
  sources,
  poster,
}: {
  sources: HeroSource[];
  poster?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData === true;
    if (reduce || saveData) {
      userPaused.current = true;
      video.pause();
      return;
    }

    video.play().catch(() => {
      /* Autoplay refused (low-power mode). The play control stays available. */
    });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && !userPaused.current) {
          video.play().catch(() => {});
        } else if (!entry.isIntersecting) {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  return (
    <>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-hidden
        tabIndex={-1}
        onCanPlay={() => setReady(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${
          ready || poster ? "opacity-100" : "opacity-0"
        }`}
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} media={s.media} />
        ))}
      </video>

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause background film" : "Play background film"}
        className="absolute right-5 top-[92px] z-20 inline-flex sm:right-8 lg:bottom-7 lg:right-12 lg:top-auto items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-paper/75 transition-colors hover:text-paper sm:right-8 lg:right-12"
      >
        <span className="inline-flex size-8 items-center justify-center border border-paper/35">
          {playing ? <Pause className="size-3" /> : <Play className="size-3" />}
        </span>
        <span className="hidden sm:inline">{playing ? "Pause film" : "Play film"}</span>
      </button>
    </>
  );
}
