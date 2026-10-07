"use client";

import { useEffect, useRef, useState } from "react";
import {
  GLASS_FRAG,
  GLASS_VERT,
  MAX_SPLATS,
  SPLAT,
  createTrail,
  fluteHeight,
  packTrail,
  trailAge,
  trailBreak,
  trailTo,
  type GlassProfile,
} from "@/lib/glass";
import type { Film } from "@/lib/film";

/*
  A band of nine glass flutes over the film (shader and profiles in
  lib/glass.ts). Scrolling moves the flute bottoms. A mouse or pen brings
  warm light into the scene behind the glass: its path leaves a soft
  ribbon, tinted by the direction of travel, that stays where it was laid
  and fades calmly, and each rod bends its own slice of it. Touch is
  ignored. The film loops while the band is on screen and the tab is
  visible; reduced motion and data saver get a still frame and the
  finished profile, with no light trail.

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

// Reduced motion or data saver: a still frame
const STILL_QUERY = "(prefers-reduced-motion: reduce)";
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
  className?: string;
};

export function GlassBand({ film, profile, rest, progress, start = 0.85, end = 0.2, className = "" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [noGl, setNoGl] = useState(false);

  useEffect(() => {
    const box = wrap.current;
    const cv = canvas.current;
    if (!box || !cv) return;

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
      arc: U("uArc"), useVideo: U("uUseVideo"), scale: U("uVideoScale"), offset: U("uVideoOffset"),
      spN: U("uSpN"), spR: U("uSpR"), sp: U("uSp"),
    };
    gl.uniform3fv(U("uDark"), COLORS.dark);
    gl.uniform3fv(U("uRed"), COLORS.red);
    gl.uniform3fv(U("uEmber"), COLORS.ember);
    gl.uniform3fv(U("uBlush"), COLORS.blush);
    gl.uniform3fv(U("uPaper"), COLORS.paper);
    gl.uniform1f(u.n, N);
    gl.uniform1f(u.rest, rest);
    gl.uniform1f(u.arc, profile === "arc" ? 1 : 0);

    // The film: one small video, drawn into a tiny canvas and uploaded as a
    // texture each frame. Reduced motion uses the poster as a still.
    let video: HTMLVideoElement | null = null;
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
      const img = new Image();
      img.onload = () => {
        upload(img, img.naturalWidth, img.naturalHeight);
        dirty = true;
        kick();
      };
      img.src = film.poster;
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
    let raf = 0;
    let last = performance.now();
    let H = 0;
    const trail = createTrail(still ? SPLAT.lifeStill : SPLAT.life);
    const spA = new Float32Array(MAX_SPLATS * 4);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      H = box.clientHeight;
      cv.width = Math.max(1, Math.round(box.clientWidth * dpr));
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
      if (video && visible && !document.hidden) void video.play().catch(() => {});
    };
    const stop = () => video?.pause();

    const draw = () => {
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(u.res, cv.width, cv.height);
      gl.uniform1f(u.t, t);
      gl.uniform1f(u.p, p);
      gl.uniform1f(u.aspect, cv.width / cv.height);
      gl.uniform1f(u.useVideo, haveFrame ? 1 : 0);
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
      const n = packTrail(trail, spA);
      gl.uniform1f(u.spN, n);
      gl.uniform1f(u.spR, SPLAT.radius / Math.max(1, H));
      if (n) gl.uniform4fv(u.sp, spA);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const real = (now - last) / 1000;
      const dt = Math.min(0.05, real);
      last = now;
      const np = progressNow();
      if (Math.abs(np - p) > 0.0004) {
        p = np;
        dirty = true;
      }
      if (!still) {
        t += dt;
        dirty = true;
      }
      if (trail.points.length) {
        // The light keeps real time even when frames are slow, so its fade
        // stays as long as it should (the ration refills on the same clock)
        trailAge(trail, Math.min(0.25, real));
        dirty = true;
      }
      if (video && video.readyState >= 2 && !video.paused) upload(video, video.videoWidth, video.videoHeight);
      if (dirty) {
        draw();
        dirty = false;
      }
      // A still frame with no light left idles until scroll, resize or the pointer
      if (still && !trail.points.length) return;
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

    // The cursor brings light: a mouse or pen over the glass lays a trail
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || still) return;
      const r = box.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const i = Math.min(N - 1, Math.max(0, Math.floor((x / r.width) * N)));
      if (x < 0 || x > r.width || y < 0 || y > (fluteHeight(i, N, p, profile, rest) + 0.02) * r.height) {
        trailBreak(trail);
        return;
      }
      trailTo(trail, x, y, r.width, r.height);
      kick();
    };
    const onLeave = () => trailBreak(trail);
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerleave", onLeave);
    const onScroll = () => kick();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onVisibility = () => (document.hidden ? stop() : play());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
      if (video) {
        video.removeAttribute("src");
        video.load();
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [film, profile, rest, progress, start, end]);

  return (
    <div ref={wrap} className={`relative ${className}`}>
      <canvas ref={canvas} aria-hidden className="absolute inset-0 block size-full" />
      {/* Flat bars in the finished profile: without JS (hidden once JS
          runs) and without WebGL */}
      <div
        aria-hidden
        className={`absolute inset-x-0 top-0 grid h-full grid-cols-9 items-start ${noGl ? "" : "[html[data-js]_&]:hidden"}`}
      >
        {Array.from({ length: N }, (_, i) => (
          <span
            key={i}
            className={`block ${i % 2 ? "bg-ember" : "bg-brand"}`}
            style={{ height: `${fluteHeight(i, N, 1, profile, rest) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
