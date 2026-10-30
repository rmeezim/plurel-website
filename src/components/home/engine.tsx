"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { CONTAINER, H2 } from "@/components/system";
import { BAR_H, BEATS, BRANDS, barY, LANE_FOOT, LANE_TOP, LAYERS, laneX, market, N, NONE, SURFACES, SYSTEM_TOP, within, YOU } from "@/lib/engine";
import { motionAllowed } from "@/lib/pen";
import s from "./engine.module.css";

/*
  The engine, on graphite (it takes Why now's place): how the market
  moves, drawn as a field of buyers and scrubbed by the scroll while the
  chapter is pinned (lib/engine.ts lays out every buyer in every beat).
  The copy on the left changes with the beat; the readouts under it count
  what the field shows. At the end the field stays as a graph to explore:
  point at a surface or a layer (or tab to it) to light what it feeds.

  Static (no JS, reduced motion, a screen too short to pin) it is simply
  the last beat: the graph, every beat's words in order beside it.
  Illustrative throughout, and labelled so.
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

const ease = (t: number) => t * t * (3 - 2 * t);
const stag = (k: number, lag: number) => ease(Math.min(1, Math.max(0, (k - lag) / 0.6)));

export function EngineChapter() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [armed, setArmed] = useState(false);
  const [p, setP] = useState(1);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [hot, setHot] = useState<{ kind: "lane" | "layer"; i: number } | null>(null);
  const data = useMemo(() => market(), []);

  // arm: motion allowed and a screen tall enough to pin the field
  useEffect(() => {
    const decide = () => {
      const ok = motionAllowed() && window.innerHeight >= 600 && window.innerWidth >= 360;
      setArmed(ok);
      if (!ok) setP(1);
    };
    decide();
    window.addEventListener("resize", decide);
    return () => window.removeEventListener("resize", decide);
  }, []);

  // progress through the pinned track
  useEffect(() => {
    if (!armed) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = track.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      setP(Math.min(1, Math.max(0, -r.top / Math.max(1, travel))));
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
    return () => ro.disconnect();
  }, []);

  const k1 = within(p, 0) >= 1 ? within(p, 1) : 0; // market -> surfaces
  const k2 = within(p, 2); // ingestion
  const k3 = within(p, 3); // absorption
  const k4 = within(p, 4); // one number
  const next = BEATS.findIndex((b) => p < b);
  const beat = next < 0 ? 4 : Math.max(0, next - 1);

  // draw
  useEffect(() => {
    const cv = canvas.current;
    if (!cv || !box.w) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(box.w * dpr);
    cv.height = Math.round(box.h * dpr);
    const g = cv.getContext("2d")!;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, box.w, box.h);
    const css = getComputedStyle(cv);
    const paper = css.getPropertyValue("--color-paper").trim() || "#fbfaf6";
    const signal = css.getPropertyValue("--color-signal").trim() || "#e8564e";
    const W = box.w;
    const H = box.h;
    const X = (x: number) => x * W;
    const Y = (y: number) => y * H;
    const line = (x1: number, y1: number, x2: number, y2: number) => {
      g.beginPath();
      g.moveTo(Math.round(X(x1)) + 0.5, Y(y1));
      g.lineTo(Math.round(X(x2)) + 0.5, Y(y2));
      g.stroke();
    };
    const sys = Math.min(1, k2 * 3);
    // the System: four layers, drawn in as it arrives
    if (sys > 0) {
      LAYERS.forEach((_, i) => {
        const lit = hot?.kind === "layer" ? hot.i === i : true;
        g.globalAlpha = sys * (lit ? 1 : 0.35);
        g.strokeStyle = paper;
        g.lineWidth = 1;
        g.globalAlpha *= 0.32;
        g.strokeRect(Math.round(X(0.02)) + 0.5, Math.round(Y(barY(i))) + 0.5, Math.round(X(0.96)), Math.round(Y(BAR_H)));
        if (i === 3 && k4 > 0) {
          g.globalAlpha = 0.14 * k4;
          g.fillStyle = signal;
          g.fillRect(X(0.02), Y(barY(3)), X(0.96), Y(BAR_H));
        }
      });
    }
    // the streams: every surface into the Ledger
    const streams = ease(Math.min(1, Math.max(0, (k2 - 0.15) / 0.45)));
    const outs = ease(Math.min(1, k3 / 0.35));
    SURFACES.forEach((_, i) => {
      const lit = hot ? (hot.kind === "lane" ? hot.i === i : hot.i === 3 || hot.i === 2) : true;
      const x = laneX(i) - 0.006;
      const y0 = LANE_FOOT + 0.025;
      const y1 = barY(3) + BAR_H / 2;
      if (streams > 0) {
        g.globalAlpha = (lit ? 0.5 : 0.12) * Math.min(1, streams * 2);
        g.strokeStyle = paper;
        g.lineWidth = 1;
        line(x, y0, x, y0 + (y1 - y0) * streams);
        // what flows down them: squares, moved by the scroll
        if (streams >= 1 && p < BEATS[5]) {
          g.fillStyle = paper;
          for (let j = 0; j < 3; j++) {
            const f = (p * 14 + i * 0.37 + j / 3) % 1;
            g.globalAlpha = lit ? 0.9 : 0.25;
            g.fillRect(X(x) - 1.5, Y(y0 + (y1 - y0) * f) - 1.5, 3, 3);
          }
        }
      }
      // what the system sends back up: from Distribute to every surface
      if (outs > 0) {
        const xo = laneX(i) + 0.006;
        const yb = barY(2);
        g.globalAlpha = (lit ? 0.85 : 0.15) * Math.min(1, outs * 2);
        g.strokeStyle = signal;
        line(xo, yb, xo, yb - (yb - y0) * outs);
        if (outs >= 1 && k4 < 1) {
          g.fillStyle = signal;
          for (let j = 0; j < 2; j++) {
            const f = (p * 11 + i * 0.29 + j / 2) % 1;
            g.globalAlpha = lit ? 1 : 0.3;
            g.fillRect(X(xo) - 1.5, Y(yb - (yb - y0) * f) - 1.5, 3, 3);
          }
        }
      }
    });
    // the buyers
    const turn = (lag: number) => stag(Math.min(1, Math.max(0, (k3 - 0.25) / 0.7)), lag * 0.8);
    for (const b of data.buyers) {
      const m = stag(k1, b.lag);
      let x = b.market[0] + (b.lane[0] - b.market[0]) * m;
      let y = b.market[1] + (b.lane[1] - b.market[1]) * m;
      const yours = b.brand === YOU || (b.turns && turn(b.lag) > 0.5);
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
    }
    g.globalAlpha = 1;
  }, [box, data, p, k1, k2, k3, k4, hot]);

  // the field's readouts
  const surfacesRead = Math.round(Math.min(1, Math.max(0, (k2 - 0.15) / 0.45)) * SURFACES.length);
  const signals = Math.round(1204330 * ease(Math.min(1, Math.max(0, (p - BEATS[2]) / (1 - BEATS[2])))));
  const share = data.youShare[0] + (data.youShare[1] - data.youShare[0]) * ease(Math.min(1, Math.max(0, (k3 - 0.25) / 0.7)));
  const number = Math.round(1284 * ease(Math.min(1, Math.max(0, (k4 - 0.25) / 0.6))));
  const graph = !armed || p >= BEATS[4] + 0.05;
  const lanes = SURFACES.map((name, i) => ({ name, n: data.laneCount[i] }));
  const narrow = box.w > 0 && box.w < 640;

  const fieldStyle = { "--sys": SYSTEM_TOP } as CSSProperties;

  return (
    <section
      ref={root}
      id="engine"
      aria-labelledby="engine-heading"
      data-engine={armed ? "on" : undefined}
      className={`${s.root} relative bg-graphite text-paper`}
    >
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
                {COPY.map((c, i) => (
                  <li key={c.lead} data-on={!armed || i === beat || undefined} className={s.beat}>
                    <p className="type-title text-[clamp(1.25rem,1.1rem+0.6vw,1.625rem)] leading-[1.2]">{c.lead}</p>
                    <p className="mt-2 max-w-[38ch] text-[16px] leading-[1.5] text-fog lg:text-[17px]">{c.line}</p>
                  </li>
                ))}
              </ol>
              <dl className={`${s.readouts} grid grid-cols-2 gap-x-5 gap-y-4 border-t border-paper/15 pt-4`}>
                <div>
                  <dt className="text-[13px] text-fog">Surfaces read</dt>
                  <dd className="mt-1 font-mono text-[20px] leading-none tabular-nums">
                    {armed ? surfacesRead : SURFACES.length} of {SURFACES.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-[13px] text-fog">Signals, counted once</dt>
                  <dd className="mt-1 font-mono text-[20px] leading-none tabular-nums">{(armed ? signals : 1204330).toLocaleString("en-US")}</dd>
                </div>
                <div>
                  <dt className="text-[13px] text-fog">Choose you first</dt>
                  <dd className="mt-1 font-mono text-[20px] leading-none tabular-nums text-signal">{Math.round((armed ? share : data.youShare[1]) * 100)}%</dd>
                </div>
                <div>
                  <dt className="text-[13px] text-fog">The one number</dt>
                  <dd className="mt-1 font-mono text-[20px] leading-none tabular-nums">{(armed ? number : 1284).toLocaleString("en-US")}</dd>
                </div>
              </dl>
              <p className="mt-4 text-[13px] leading-[1.45] text-fog">Illustration: each square is a buyer, and the numbers are a drawing’s, not a market’s.</p>
            </div>

            <div className={s.fieldWrap}>
              <div ref={field} className={s.field} style={fieldStyle} onPointerLeave={() => setHot(null)}>
                <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
                {/* the brands, while the market is still clustered */}
                {BRANDS.map((b, i) => (
                  <span
                    key={b.name}
                    aria-hidden
                    className={`absolute -translate-x-1/2 text-[13px] leading-none transition-opacity duration-300 ${i === YOU ? "text-signal" : "text-fog"}`}
                    style={{ left: `${b.at[0] * 100}%`, top: `calc(${b.at[1] * 100}% - ${i === YOU ? 52 : 74}px)`, opacity: armed ? 1 - Math.min(1, k1 * 4) : 0 }}
                  >
                    {b.name}
                  </span>
                ))}
                {/* the surfaces: labels over the lanes, and the graph's nodes */}
                {lanes.map((l, i) => (
                  <button
                    key={l.name}
                    type="button"
                    tabIndex={graph ? 0 : -1}
                    aria-label={`${l.name}: ${Math.round((l.n / N) * 100)}% of buyers decide here; it streams into the Ledger and gets its cuts from the Surface Plan`}
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
                      opacity: armed ? Math.min(1, Math.max(0, (k1 - 0.5) * 3)) : 1,
                    }}
                  >
                    {l.name}
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
                    style={{ top: `calc(${(barY(i) + BAR_H / 2) * 100}% - 7px)`, opacity: armed ? Math.min(1, k2 * 3) : 1 }}
                  >
                    {name}
                    {i === 3 && <span className="text-fog">: the Ledger</span>}
                  </button>
                ))}
                {hot && graph && (
                  <p
                    aria-hidden
                    className="pointer-events-none absolute right-0 top-0 max-w-[300px] border border-paper/20 bg-graphite px-3 py-2 text-[13px] leading-[1.4]"
                  >
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
