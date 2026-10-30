"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CONTAINER, H2 } from "@/components/system";
import { BAR_H, BEATS, BRANDS, barY, LANE_FOOT, LANE_TOP, LAYERS, laneX, market, N, NONE, SURFACES, within, YOU } from "@/lib/engine";
import { motionAllowed } from "@/lib/pen";
import s from "./engine.module.css";

/*
  The engine, on graphite (it takes Why now's place): how the market
  moves, as a field of buyers (lib/engine.ts lays out every buyer in
  every beat). The chapter is pinned; the scroll carries the words: it
  chooses the beat, and the beat's line lights word by word as the reader
  scrolls through it. The field keeps its own time: it moves to each
  beat's state at a steady pace, one beat after another, whatever the
  scroll speed, and between moves it stays alive (the market drifts,
  surfaces stream into the Ledger, the system sends its work back out),
  only on screen and with a Pause control. At the end it stays as a graph
  to explore: point at a surface or a layer, or tab to it.

  Static (no JS, reduced motion, a screen under 600px tall) it is the
  last beat, unpinned, every beat's words in order beside it. It is an
  illustration, and says so.
*/

const COPY = [
  { lead: "The market, as it is.", line: "Each square is a buyer, near the brand that comes to mind first. Most were decided before anyone met them." },
  { lead: "Spread across surfaces.", line: "They ask an assistant, search, watch a creator, read the reviews. Each surface usually has its own supplier, and nobody sees all of them." },
  { lead: "One system reads all of it.", line: "Every surface streams into one Ledger, counted once: what buyers ask, watch, read and buy." },
  { lead: "Then it acts on all of it.", line: "One story, cut for every surface and placed where it moves the number. Buyers who were someone else’s start choosing you." },
  { lead: "Everything answers to one number.", line: "Agreed on day one, read every month. Point at a surface or a layer to see what it feeds." },
];

const LAYER_LINE = [
  "Builds the Core Brief: the one story every surface is cut from.",
  "Builds the Asset System: the site, content, film and creator kits.",
  "Builds the Surface Plan: which surface gets which cut, and when.",
  "Builds the Ledger: the one number, and what moved it.",
];

/** Seconds for the field to move from one beat to the next */
const MOVE = 1.8;

const ease = (t: number) => t * t * (3 - 2 * t);
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const stag = (k: number, lag: number) => ease(clamp((k - lag) / 0.6));

type K = [number, number, number, number];
const targetOf = (beat: number): K => [beat >= 1 ? 1 : 0, beat >= 2 ? 1 : 0, beat >= 3 ? 1 : 0, beat >= 4 ? 1 : 0];

export function EngineChapter() {
  const track = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const data = useMemo(() => market(), []);
  const [armed, setArmed] = useState(false);
  const [motion, setMotion] = useState(false);
  const [p, setP] = useState(1);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [hot, setHot] = useState<{ kind: "lane" | "layer"; i: number } | null>(null);
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  // the field's own state, kept outside React and mirrored for the readouts
  const k = useRef<K>([1, 1, 1, 1]);
  const clock = useRef(0);
  const [shown, setShown] = useState<K>([1, 1, 1, 1]);

  const next = BEATS.findIndex((b) => p < b);
  const beat = !armed ? 4 : next < 0 ? 4 : Math.max(0, next - 1);
  const local = !armed ? 1 : within(p, beat);

  // arm: motion allowed and a screen tall enough to pin the field
  useEffect(() => {
    const decide = () => {
      const ok = motionAllowed();
      setMotion(ok);
      const pin = ok && window.innerHeight >= 600 && window.innerWidth >= 360;
      setArmed(pin);
      if (!pin) setP(1);
    };
    decide();
    window.addEventListener("resize", decide);
    return () => window.removeEventListener("resize", decide);
  }, []);

  // the scroll carries the words: which beat, and how far through it
  useEffect(() => {
    if (!armed) return;
    // the field starts from the market when the chapter is first armed
    k.current = [0, 0, 0, 0];
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = track.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      setP(clamp(-r.top / Math.max(1, travel)));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [armed]);

  useEffect(() => {
    const el = field.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  // the field's clock: it moves toward the beat the scroll chose, one beat
  // after another at a steady pace, and keeps its quiet motion between
  useEffect(() => {
    const cv = canvas.current;
    if (!cv || !box.w) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(box.w * dpr);
    cv.height = Math.round(box.h * dpr);
    const g = cv.getContext("2d")!;
    const css = getComputedStyle(cv);
    const paper = css.getPropertyValue("--color-paper").trim() || "#fbfaf6";
    const signal = css.getPropertyValue("--color-signal").trim() || "#e8564e";
    const W = box.w;
    const H = box.h;
    const X = (x: number) => x * W;
    const Y = (y: number) => y * H;
    const target = targetOf(beat);

    const draw = () => {
      const [k1, k2, k3, k4] = k.current;
      const t = clock.current;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      const vline = (x: number, y1: number, y2: number) => {
        g.beginPath();
        g.moveTo(Math.round(X(x)) + 0.5, Y(y1));
        g.lineTo(Math.round(X(x)) + 0.5, Y(y2));
        g.stroke();
      };
      // the System: four layers
      const sys = clamp(k2 * 3);
      if (sys > 0) {
        LAYERS.forEach((_, i) => {
          const lit = hot?.kind === "layer" ? hot.i === i : true;
          g.globalAlpha = sys * (lit ? 0.32 : 0.12);
          g.strokeStyle = paper;
          g.lineWidth = 1;
          g.strokeRect(Math.round(X(0.02)) + 0.5, Math.round(Y(barY(i))) + 0.5, Math.round(X(0.96)), Math.round(Y(BAR_H)));
          if (i === 3 && k4 > 0) {
            g.globalAlpha = 0.14 * k4;
            g.fillStyle = signal;
            g.fillRect(X(0.02), Y(barY(3)), X(0.96), Y(BAR_H));
          }
        });
      }
      // the streams into the Ledger, and the work sent back out
      const streams = ease(clamp((k2 - 0.15) / 0.45));
      const outs = ease(clamp(k3 / 0.35));
      SURFACES.forEach((_, i) => {
        const lit = hot ? (hot.kind === "lane" ? hot.i === i : hot.i === 3 || hot.i === 2) : true;
        const x = laneX(i) - 0.006;
        const y0 = LANE_FOOT + 0.025;
        const y1 = barY(3) + BAR_H / 2;
        if (streams > 0) {
          g.globalAlpha = (lit ? 0.45 : 0.1) * Math.min(1, streams * 2);
          g.strokeStyle = paper;
          g.lineWidth = 1;
          vline(x, y0, y0 + (y1 - y0) * streams);
          if (streams >= 1) {
            g.fillStyle = paper;
            for (let j = 0; j < 3; j++) {
              const f = (t * 0.32 + i * 0.37 + j / 3) % 1;
              g.globalAlpha = lit ? 0.9 : 0.2;
              g.fillRect(X(x) - 1.5, Y(y0 + (y1 - y0) * f) - 1.5, 3, 3);
            }
          }
        }
        if (outs > 0) {
          const xo = laneX(i) + 0.006;
          const yb = barY(2);
          g.globalAlpha = (lit ? 0.8 : 0.12) * Math.min(1, outs * 2);
          g.strokeStyle = signal;
          vline(xo, yb, yb - (yb - y0) * outs);
          if (outs >= 1) {
            g.fillStyle = signal;
            for (let j = 0; j < 2; j++) {
              const f = (t * 0.27 + i * 0.29 + j / 2) % 1;
              g.globalAlpha = lit ? 1 : 0.25;
              g.fillRect(X(xo) - 1.5, Y(yb - (yb - y0) * f) - 1.5, 3, 3);
            }
          }
        }
      });
      // the buyers
      const turned = clamp((k3 - 0.25) / 0.7);
      data.buyers.forEach((b, n) => {
        const m = stag(k1, b.lag);
        // the market drifts while it is still clustered
        const drift = (1 - m) * 0.006;
        let x = b.market[0] + Math.sin(t * 0.45 + n * 1.7) * drift + (b.lane[0] - b.market[0]) * m;
        let y = b.market[1] + Math.cos(t * 0.38 + n * 2.3) * drift + (b.lane[1] - b.market[1]) * m;
        const yours = b.brand === YOU || (b.turns && stag(turned, b.lag * 0.8) > 0.5);
        if (yours && k4 > 0) {
          const q = stag(k4 * 1.3, b.lag * 0.6);
          x += (b.ledger[0] - x) * q;
          y += (b.ledger[1] - y) * q;
        }
        const lane = hot?.kind === "lane" ? hot.i === b.surface : true;
        let a = b.brand === NONE ? 0.3 : b.brand < 4 ? BRANDS[b.brand].tone * 0.7 : 0.5;
        if (yours) a = 1;
        else if (k4 > 0) a *= 1 - 0.65 * ease(k4);
        if (!lane) a *= 0.2;
        g.globalAlpha = a;
        g.fillStyle = yours ? signal : paper;
        const sz = yours ? 4 : 3;
        g.fillRect(X(x) - sz / 2, Y(y) - sz / 2, sz, sz);
      });
      g.globalAlpha = 1;
    };

    let raf = 0;
    // without motion (or before arming) the field is its last beat, still
    if (!motion || !armed) {
      k.current = [1, 1, 1, 1];
      draw();
      return;
    }
    // a hidden tab needs no check: frames stop there, and a step is capped on return
    const run = onScreen && !held;
    if (!run) {
      // held: the field goes straight to the beat and stands; off screen it waits
      if (held) k.current = target.slice() as K;
      raf = requestAnimationFrame(() => {
        draw();
        setShown(k.current.slice() as K);
      });
      return () => cancelAnimationFrame(raf);
    }
    let last = performance.now();
    let mirror = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      clock.current += dt;
      const kk = k.current;
      // behind by more than a beat, it moves faster to catch up
      const gap = target.reduce((a, v, i) => a + Math.abs(v - kk[i]), 0);
      const step = (dt / MOVE) * (gap > 1.5 ? 2 : 1);
      for (let i = 0; i < 4; i++) {
        if (kk[i] < target[i]) {
          if (i === 0 || kk[i - 1] >= 1) kk[i] = Math.min(target[i], kk[i] + step);
          break;
        }
      }
      for (let i = 3; i >= 0; i--) {
        if (kk[i] > target[i]) {
          if (i === 3 || kk[i + 1] <= 0) kk[i] = Math.max(target[i], kk[i] - step);
          break;
        }
      }
      draw();
      if (now - mirror > 120) {
        mirror = now;
        setShown(kk.slice() as K);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [box, data, beat, hot, held, onScreen, motion, armed]);

  const [k1, k2, k3, k4] = armed ? shown : ([1, 1, 1, 1] as K);
  const surfacesRead = Math.round(ease(clamp((k2 - 0.15) / 0.45)) * SURFACES.length);
  const share = data.youShare[0] + (data.youShare[1] - data.youShare[0]) * ease(clamp((k3 - 0.25) / 0.7));
  const graph = !armed || (beat === 4 && k4 >= 1);
  const narrow = box.w > 0 && box.w < 640;

  return (
    <section id="engine" aria-labelledby="engine-heading" data-engine={armed ? "on" : undefined} className={`${s.root} relative bg-graphite text-paper`}>
      <div ref={track} className={s.track}>
        <div className={s.stage}>
          <div className={`${CONTAINER} ${s.grid}`}>
            <div className={s.copy}>
              <h2 id="engine-heading" className={`${H2} ${s.h}`}>
                Buyers decide
                <br />
                before they arrive.
              </h2>
              <ol className={s.beats}>
                {COPY.map((c, i) => {
                  const words = c.lead.split(" ");
                  const lit = i < beat ? words.length : i > beat ? 0 : Math.round(clamp(local * 1.8) * words.length);
                  return (
                    <li key={c.lead} data-on={!armed || i === beat || undefined} className={s.beat}>
                      <p className="type-title text-[clamp(1.25rem,1.1rem+0.6vw,1.625rem)] leading-[1.2]">
                        {words.map((w, j) => (
                          <span key={j} data-lit={!armed || j < lit || undefined} className={s.word}>
                            {w}{" "}
                          </span>
                        ))}
                      </p>
                      <p className={`${s.line} mt-2 max-w-[38ch] text-[16px] leading-[1.5] text-fog lg:text-[17px]`} data-lit={!armed || lit >= words.length || undefined}>
                        {c.line}
                      </p>
                    </li>
                  );
                })}
              </ol>
              <dl className={`${s.readouts} grid grid-cols-2 gap-x-6 border-t border-paper/15 pt-5`}>
                <div>
                  <dt className="text-[14px] text-fog">Surfaces read</dt>
                  <dd className="type-title mt-2 text-[30px] leading-none tabular-nums">
                    {surfacesRead}
                    <span className="text-fog"> of {SURFACES.length}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[14px] text-fog">Choose you first</dt>
                  <dd className="type-title mt-2 text-[30px] leading-none tabular-nums text-signal">{Math.round(share * 100)}%</dd>
                </div>
              </dl>
              <p className="mt-4 text-[13px] leading-[1.45] text-fog">An illustration: each square is a buyer, and the numbers are a drawing’s, not a market’s.</p>
            </div>

            <div className={s.fieldWrap}>
              <div ref={field} className={s.field} onPointerLeave={() => setHot(null)}>
                <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
                {BRANDS.map((b, i) => (
                  <span
                    key={b.name}
                    aria-hidden
                    className={`absolute -translate-x-1/2 text-[13px] leading-none transition-opacity duration-300 ${i === YOU ? "text-signal" : "text-fog"}`}
                    style={{ left: `${b.at[0] * 100}%`, top: `calc(${b.at[1] * 100}% - ${i === YOU ? 52 : 74}px)`, opacity: armed ? 1 - clamp(k1 * 4) : 0 }}
                  >
                    {b.name}
                  </span>
                ))}
                {SURFACES.map((name, i) => (
                  <button
                    key={name}
                    type="button"
                    tabIndex={graph ? 0 : -1}
                    aria-label={`${name}: ${Math.round((data.laneCount[i] / N) * 100)}% of buyers decide here; it streams into the Ledger and gets its cuts from the Surface Plan`}
                    onPointerEnter={() => graph && setHot({ kind: "lane", i })}
                    onFocus={() => setHot({ kind: "lane", i })}
                    onBlur={() => setHot(null)}
                    className={`absolute -translate-x-1/2 text-center text-[13px] leading-[1.2] transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper ${
                      hot?.kind === "lane" && hot.i === i ? "text-paper" : "text-fog"
                    } ${narrow ? "w-[24%] whitespace-nowrap" : "w-[11.5%]"}`}
                    style={{
                      left: `${laneX(i) * 100}%`,
                      // on a narrow field the names take two rows, alternating
                      top: `calc(${LANE_TOP * 100}% - ${narrow ? (i % 2 ? 46 : 26) : 34}px)`,
                      opacity: armed ? clamp((k1 - 0.5) * 3) : 1,
                    }}
                  >
                    {name}
                  </button>
                ))}
                {LAYERS.map((name, i) => (
                  <button
                    key={name}
                    type="button"
                    tabIndex={graph ? 0 : -1}
                    aria-label={`${name}: ${LAYER_LINE[i]}`}
                    onPointerEnter={() => graph && setHot({ kind: "layer", i })}
                    onFocus={() => setHot({ kind: "layer", i })}
                    onBlur={() => setHot(null)}
                    className={`absolute left-[3%] text-left text-[13px] leading-none transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper ${
                      i === 3 && k4 > 0 ? "text-signal" : "text-paper"
                    }`}
                    style={{ top: `calc(${(barY(i) + BAR_H / 2) * 100}% - 7px)`, opacity: armed ? clamp(k2 * 3) : 1 }}
                  >
                    {name}
                    {i === 3 && <span className="text-fog">: the Ledger</span>}
                  </button>
                ))}
                {hot && graph && (
                  <p aria-hidden className="pointer-events-none absolute right-0 top-0 max-w-[300px] border border-paper/20 bg-graphite px-3 py-2 text-[14px] leading-[1.4]">
                    {hot.kind === "lane" ? (
                      <>
                        <span className="text-paper">{SURFACES[hot.i]}</span>
                        <span className="text-fog">
                          : {Math.round((data.laneCount[hot.i] / N) * 100)}% of buyers decide here. It streams into the Ledger, and the Surface Plan sends it its cuts.
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-paper">{LAYERS[hot.i]}</span>
                        <span className="text-fog">: {LAYER_LINE[hot.i]}</span>
                      </>
                    )}
                  </p>
                )}
                {armed && (
                  // below lg the pinned copy drops its note, so the field carries a short one
                  <p className="absolute bottom-0 left-0 flex h-8 items-center text-[13px] leading-none text-fog lg:hidden">An illustration: each square is a buyer</p>
                )}
                {armed && (
                  <button
                    type="button"
                    onClick={() => setHeld((h) => !h)}
                    className="absolute bottom-0 right-0 inline-flex h-8 items-center border border-paper/30 bg-graphite px-2.5 text-[13px] font-medium leading-none text-paper transition-colors hover:border-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
                  >
                    {held ? "Play" : "Pause"}
                    <span className="sr-only"> the field</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
