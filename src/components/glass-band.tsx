"use client";

import { useEffect, useRef, useState } from "react";
import { GLASS_FRAG, GLASS_VERT, MAX_SPLATS, fluteHeight, type GlassProfile } from "@/lib/glass";
import type { Film } from "@/lib/film";

/*
  A band of nine glass flutes over the film (shader and profiles in
  lib/glass.ts). Scrolling moves the flute bottoms. A mouse or pen pours
  light into the scene behind the glass: each stretch of travel leaves a
  splat, tinted by its direction, that drifts on, spreads and fades, so
  the flutes refract it into liquid shapes. The film loops while the band
  is on screen and the tab is visible; reduced motion and data saver get a
  still frame, the finished profile and a shorter-lived glow.

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

/** Seconds a splat of poured light lives (shorter under reduced motion) */
const SPLAT_LIFE = 1.8;
const SPLAT_LIFE_STILL = 0.7;
/** Pixels of pointer travel between splats */
const SPLAT_GAP = 34;
/** Starting radius in pixels; a splat spreads to 1.9x as it fades */
const SPLAT_R = 42;

type Splat = { x: number; y: number; vx: number; vy: number; hue: number; s: number; age: number };

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
    const life = still ? SPLAT_LIFE_STILL : SPLAT_LIFE;

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
      spN: U("uSpN"), sp: U("uSp"), spHue: U("uSpHue"),
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
    let W = 0;
    let H = 0;
    const splats: Splat[] = [];
    const spA = new Float32Array(MAX_SPLATS * 4);
    const spH = new Float32Array(MAX_SPLATS);
    let lastPt: { x: number; y: number; at: number } | null = null;

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
      // Splats: position in band space, radius in band heights, weight
      // rising over 80ms and falling as it spreads
      splats.forEach((s, k) => {
        const a = s.age / life;
        spA[k * 4] = s.x;
        spA[k * 4 + 1] = s.y;
        spA[k * 4 + 2] = (SPLAT_R * (1 + 0.9 * a)) / Math.max(1, H);
        spA[k * 4 + 3] = s.s * Math.min(1, s.age / 0.08) * Math.pow(1 - a, 1.6);
        spH[k] = s.hue;
      });
      gl.uniform1f(u.spN, splats.length);
      if (splats.length) {
        gl.uniform4fv(u.sp, spA);
        gl.uniform4fv(u.spHue, spH);
      }
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
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
      if (!still) {
        t += dt;
        dirty = true;
      }
      if (splats.length) {
        const damp = Math.exp(-2.5 * dt);
        for (const s of splats) {
          s.age += dt;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.vx *= damp;
          s.vy *= damp;
        }
        for (let k = splats.length - 1; k >= 0; k--) if (splats[k].age >= life) splats.splice(k, 1);
        dirty = true;
      }
      if (video && video.readyState >= 2 && !video.paused) upload(video, video.videoWidth, video.videoHeight);
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

    // The cursor pours light: one splat per stretch of travel over the glass,
    // carrying the direction (its tint) and a little of the speed (its drift)
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = box.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const i = Math.min(N - 1, Math.max(0, Math.floor(x * N)));
      if (x < 0 || x > 1 || y < 0 || y > fluteHeight(i, N, p, profile, rest) + 0.02) {
        lastPt = null;
        return;
      }
      const now = performance.now();
      if (!lastPt) {
        lastPt = { x: e.clientX, y: e.clientY, at: now };
        return;
      }
      const dx = e.clientX - lastPt.x;
      const dy = e.clientY - lastPt.y;
      const dist = Math.hypot(dx, dy);
      if (dist < SPLAT_GAP * 0.5) return;
      const secs = Math.max(0.016, (now - lastPt.at) / 1000);
      const hue = (((Math.atan2(-dy, dx) / (2 * Math.PI)) % 1) + 1) % 1;
      const strength = Math.min(1, Math.max(0.45, dist / 60));
      const vx = Math.max(-0.4, Math.min(0.4, (dx / r.width / secs) * 0.12));
      const vy = Math.max(-0.4, Math.min(0.4, (dy / r.height / secs) * 0.12));
      const steps = Math.min(4, Math.max(1, Math.round(dist / SPLAT_GAP)));
      const x0 = (lastPt.x - r.left) / r.width;
      const y0 = (lastPt.y - r.top) / r.height;
      for (let k = 1; k <= steps; k++) {
        const f = k / steps;
        splats.push({ x: x0 + (x - x0) * f, y: y0 + (y - y0) * f, vx, vy, hue, s: strength, age: 0 });
      }
      while (splats.length > MAX_SPLATS) splats.shift();
      lastPt = { x: e.clientX, y: e.clientY, at: now };
      kick();
    };
    const onLeave = () => {
      lastPt = null;
    };
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
    </div>
  );
}
