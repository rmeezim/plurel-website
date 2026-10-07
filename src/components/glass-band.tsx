"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { GLASS_FRAG, GLASS_VERT, fluteHeight, type GlassProfile } from "@/lib/glass";
import type { Film } from "@/lib/film";

/*
  A band of nine glass flutes over the film (shader and profiles in
  lib/glass.ts). Scrolling moves the flute bottoms; hovering a flute clears
  its glass and lowers it a step. The film plays only while the band is on
  screen and always has a pause control; reduced motion and data saver get
  a still frame and the finished profile.

  progress "page": 0 at the top of the page, 1 once the band's top has
  scrolled up to `end` of the viewport (the hero). progress "viewport": 0
  when the band's top enters at `start` of the viewport, 1 at `end` (the
  closing edge).
*/

const COLORS = {
  dark: [0x14 / 255, 0x15 / 255, 0x17 / 255],
  red: [0xbf / 255, 0x3a / 255, 0x36 / 255],
  ember: [0x8e / 255, 0x28 / 255, 0x24 / 255],
  blush: [0xf2 / 255, 0xc9 / 255, 0xbf / 255],
  paper: [0xfb / 255, 0xfa / 255, 0xf6 / 255],
} as const;

const N = 9;

// Reduced motion or data saver: start on a still frame
const STILL_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeStill = (cb: () => void) => {
  const mq = window.matchMedia(STILL_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const readStill = () =>
  window.matchMedia(STILL_QUERY).matches ||
  Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
const FILM_W = 192; // the film is drawn this small, so it arrives soft

type Props = {
  film: Film;
  profile: GlassProfile;
  rest: number;
  progress: "page" | "viewport";
  start?: number;
  end?: number;
  caption?: ReactNode;
  /** Colour of the caption, index and control: on graphite or on paper */
  tone?: "dark" | "light";
  /** Where the caption and pause control sit: just under the glass at rest, or at the band's foot */
  foot?: "rest" | "bottom";
  className?: string;
};

export function GlassBand({
  film,
  profile,
  rest,
  progress,
  start = 0.85,
  end = 0.2,
  caption,
  tone = "dark",
  foot = "bottom",
  className = "",
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const index = useRef<HTMLSpanElement>(null);
  const still = useSyncExternalStore(subscribeStill, readStill, () => false);
  const [override, setOverride] = useState<boolean | null>(null);
  const paused = override ?? still;
  const [noGl, setNoGl] = useState(false);
  const pausedRef = useRef(paused);
  const toggleRef = useRef<((v: boolean) => void) | null>(null);

  useEffect(() => {
    const box = wrap.current;
    const cv = canvas.current;
    const idx = index.current;
    if (!box || !cv || !idx) return;

    const still = readStill();

    const gl = cv.getContext("webgl", { premultipliedAlpha: false, antialias: false, alpha: true });
    if (!gl) {
      setNoGl(true);
      return;
    }
    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, GLASS_VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, GLASS_FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setNoGl(true);
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (name: string) => gl.getUniformLocation(prog, name);
    const u = {
      res: U("uRes"), t: U("uT"), p: U("uP"), n: U("uN"), rest: U("uRest"), aspect: U("uAspect"),
      hover: U("uHover"), hoverK: U("uHoverK"), retract: U("uRetract"), useVideo: U("uUseVideo"),
      scale: U("uVideoScale"), offset: U("uVideoOffset"),
    };
    gl.uniform3fv(U("uDark"), COLORS.dark);
    gl.uniform3fv(U("uRed"), COLORS.red);
    gl.uniform3fv(U("uEmber"), COLORS.ember);
    gl.uniform3fv(U("uBlush"), COLORS.blush);
    gl.uniform3fv(U("uPaper"), COLORS.paper);
    gl.uniform1f(u.n, N);
    gl.uniform1f(u.rest, rest);
    gl.uniform1f(u.retract, profile === "retract" ? 1 : 0);

    // The film: one small video, drawn into a tiny canvas and uploaded as a
    // texture each frame. Reduced motion uses the poster as a still.
    let video: HTMLVideoElement | null = null;
    let still2d: HTMLImageElement | null = null;
    let haveFrame = false;
    let filmAspect = 16 / 9;
    const small = document.createElement("canvas");
    const sctx = small.getContext("2d");
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const upload = (src: CanvasImageSource, w: number, h: number) => {
      if (!sctx || !w || !h) return;
      filmAspect = w / h;
      small.width = FILM_W;
      small.height = Math.max(1, Math.round(FILM_W / filmAspect));
      sctx.drawImage(src, 0, 0, small.width, small.height);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, small);
      haveFrame = true;
    };
    if (film && still && film.poster) {
      still2d = new Image();
      still2d.onload = () => {
        if (still2d) upload(still2d, still2d.naturalWidth, still2d.naturalHeight);
        dirty = true;
      };
      still2d.src = film.poster;
    } else if (film && !still) {
      video = document.createElement("video");
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.setAttribute("aria-hidden", "true");
      for (const s of film.sources) {
        const el = document.createElement("source");
        el.src = s.src;
        el.type = s.type;
        if (s.media) el.media = s.media;
        video.appendChild(el);
      }
      if (film.poster) video.poster = film.poster;
    }

    let visible = false;
    let dirty = true;
    let t = 7;
    let p = 0;
    let hover = -1;
    let hoverTarget = 0;
    let hoverK = 0;
    let raf = 0;
    let last = performance.now();
    let W = 0;
    let H = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = box.clientWidth;
      H = box.clientHeight;
      cv.width = Math.max(1, Math.round(W * dpr));
      cv.height = Math.max(1, Math.round(H * dpr));
      dirty = true;
    };
    const progressNow = () => {
      if (still) return 1;
      const r = box.getBoundingClientRect();
      const vh = window.innerHeight;
      if (progress === "page") {
        const top = r.top + window.scrollY;
        return Math.min(1, Math.max(0, window.scrollY / Math.max(1, top - end * vh)));
      }
      return Math.min(1, Math.max(0, (start * vh - r.top) / Math.max(1, (start - end) * vh)));
    };
    const play = () => {
      if (video && visible && !pausedRef.current) void video.play().catch(() => {});
    };
    const stop = () => video?.pause();

    const draw = () => {
      const useVideo = haveFrame ? 1 : 0;
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(u.res, cv.width, cv.height);
      gl.uniform1f(u.t, t);
      gl.uniform1f(u.p, p);
      gl.uniform1f(u.aspect, cv.width / cv.height);
      gl.uniform1f(u.hover, hover);
      gl.uniform1f(u.hoverK, hoverK);
      gl.uniform1f(u.useVideo, useVideo);
      const band = cv.width / cv.height;
      if (band > filmAspect) {
        const s = filmAspect / band;
        gl.uniform2f(u.scale, 1, s);
        gl.uniform2f(u.offset, 0, 0.5 - 0.5 * s);
      } else {
        const s = band / filmAspect;
        gl.uniform2f(u.scale, s, 1);
        gl.uniform2f(u.offset, 0.5 - 0.5 * s, 0);
      }
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      // The hovered flute's index rides just under its bottom edge
      if (hover >= 0 && hoverK > 0.02) {
        const h = Math.min(1, fluteHeight(hover, N, p, profile, rest) + 0.07 * hoverK);
        idx.style.opacity = String(hoverK);
        idx.style.transform = `translate3d(${((hover + 0.5) / N) * W}px, ${h * H + 8}px, 0) translateX(-50%)`;
        idx.textContent = String(hover + 1).padStart(2, "0");
      } else {
        idx.style.opacity = "0";
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const np = progressNow();
      if (Math.abs(np - p) > 0.0004) {
        p = np;
        dirty = true;
      }
      if (!pausedRef.current) {
        t += dt;
        dirty = true;
      }
      const k = still ? hoverTarget : hoverK + (hoverTarget - hoverK) * Math.min(1, dt * 10);
      if (Math.abs(k - hoverK) > 0.001) {
        hoverK = k;
        dirty = true;
      } else if (hoverK !== hoverTarget && Math.abs(hoverTarget - hoverK) <= 0.001) {
        hoverK = hoverTarget;
        if (hoverK === 0) hover = -1;
        dirty = true;
      }
      if (video && video.readyState >= 2 && !pausedRef.current) upload(video, video.videoWidth, video.videoHeight);
      if (dirty) {
        draw();
        dirty = false;
      }
      raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && visible) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1];
        if (!e) return;
        visible = e.isIntersecting;
        if (visible) {
          dirty = true;
          play();
          kick();
        } else {
          stop();
        }
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(box);
    const ro = new ResizeObserver(() => {
      resize();
      kick();
    });
    ro.observe(box);
    resize();

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = box.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const i = Math.min(N - 1, Math.max(0, Math.floor(x * N)));
      const inside = y >= 0 && y <= fluteHeight(i, N, p, profile, rest) + 0.07;
      if (inside) {
        if (i !== hover) hoverK = hover >= 0 ? hoverK * 0.4 : hoverK;
        hover = i;
        hoverTarget = 1;
      } else {
        hoverTarget = 0;
      }
      kick();
    };
    const onLeave = () => {
      hoverTarget = 0;
      kick();
    };
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerleave", onLeave);
    const onScroll = () => kick();
    window.addEventListener("scroll", onScroll, { passive: true });

    toggleRef.current = (v: boolean) => {
      pausedRef.current = v;
      if (v) stop();
      else play();
      dirty = true;
      kick();
    };

    return () => {
      toggleRef.current = null;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      stop();
      if (video) {
        video.removeAttribute("src");
        video.load();
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [film, profile, rest, progress, start, end]);

  // Keep the drawing loop in step with the pause control
  useEffect(() => {
    pausedRef.current = paused;
    toggleRef.current?.(paused);
  }, [paused]);

  const toggle = () => setOverride(!paused);

  const ink = tone === "dark" ? "text-paper" : "text-ink";
  const sub = tone === "dark" ? "text-fog" : "text-muted";
  const btn =
    tone === "dark"
      ? "border-paper/35 bg-graphite/70 text-paper hover:border-paper aria-pressed:bg-paper aria-pressed:text-graphite"
      : "border-ink/30 bg-paper/80 text-ink hover:border-ink aria-pressed:bg-ink aria-pressed:text-paper";

  return (
    <div ref={wrap} className={`relative ${className}`}>
      <canvas ref={canvas} aria-hidden className="absolute inset-0 block size-full" />
      {noGl && (
        <div aria-hidden className="absolute inset-x-0 top-0 grid h-full grid-cols-9 items-start">
          {Array.from({ length: N }, (_, i) => (
            <span
              key={i}
              className={`block ${i % 2 ? "bg-ember" : "bg-brand"}`}
              style={{ height: `${fluteHeight(i, N, 1, profile, rest) * 100}%` }}
            />
          ))}
        </div>
      )}
      <span
        ref={index}
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 font-mono text-[11px] tracking-[0.03em] opacity-0 ${ink}`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 flex items-center gap-4 px-5 sm:px-8 lg:px-12 ${foot === "bottom" ? "bottom-3" : ""} ${sub}`}
        style={foot === "rest" ? { top: `calc(${rest * 100}% + 14px)` } : undefined}
      >
        <div className="mr-auto">{caption}</div>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={paused}
          className={`pointer-events-auto inline-flex h-9 items-center gap-2 border px-3 text-[13px] font-medium transition-colors ${btn}`}
        >
          <span aria-hidden className="inline-flex gap-[3px]">
            {paused ? (
              <span className="size-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-current" />
            ) : (
              <>
                <span className="h-[11px] w-[3px] bg-current" />
                <span className="h-[11px] w-[3px] bg-current" />
              </>
            )}
          </span>
          {paused ? "Play film" : "Pause film"}
        </button>
      </div>
    </div>
  );
}
