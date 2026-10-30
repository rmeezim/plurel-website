"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Console, useBox, useSim } from "@/components/console/console";
import { Chip, Controls, Figure } from "@/components/console/parts";
import { fmt, rng } from "@/lib/sim";

/*
  Revenue: the path, leaking. Buyers arrive from every surface and walk
  the path to the one number; at each step some leave, and each step has
  a leak that makes more of them leave than need to. Fix a leak and watch
  the same attention arrive at the end: each buyer's chance at each step
  is drawn once, so a fix changes who gets through, not who arrives. The
  figures are expected values per 1,000 arrivals; the flow is the same
  model, drawn one buyer at a time. Illustrative rates, not a client's.
*/

type Kind = "shop" | "demo";
const STEPS: Record<Kind, readonly string[]> = {
  shop: ["Arrive", "Product", "Cart", "Checkout", "Order"],
  demo: ["Arrive", "Product", "Pricing", "Form", "Demo booked"],
};
const LEAKS: Record<Kind, readonly { leak: string; fix: string; drop: [number, number] }[]> = {
  shop: [
    { leak: "First page loads in 4.1 s", fix: "Loads in 1.9 s", drop: [0.48, 0.38] },
    { leak: "No price or delivery on the page", fix: "Price and delivery up front", drop: [0.72, 0.64] },
    { leak: "No proof by the button", fix: "Reviews by the button", drop: [0.45, 0.38] },
    { leak: "An account before paying", fix: "Guest checkout", drop: [0.3, 0.22] },
  ],
  demo: [
    { leak: "First page loads in 4.1 s", fix: "Loads in 1.9 s", drop: [0.5, 0.4] },
    { leak: "Says what it is, not what it does", fix: "Outcomes in the buyer’s words", drop: [0.66, 0.56] },
    { leak: "Pricing hidden behind a call", fix: "Pricing on the page", drop: [0.6, 0.48] },
    { leak: "Eleven fields on the form", fix: "Four fields", drop: [0.42, 0.3] },
  ],
};

const RATE = 64; // arrivals per second of the run
const TRAVEL = 5.5; // seconds to cross the path

type Buyer = { at: number; lane: number; u: number[] };

function buyers(n: number): Buyer[] {
  const r = rng(77141);
  const out: Buyer[] = [];
  let t = 0;
  for (let i = 0; i < n; i++) {
    t += -Math.log(1 - r()) / RATE;
    out.push({ at: t, lane: r(), u: [r(), r(), r(), r()] });
  }
  return out;
}

export function PathFlowConsole() {
  const frame = useRef<HTMLElement>(null);
  const plot = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const box = useBox(plot);
  const END = 240;
  const sim = useSim(frame, { end: END, rate: 1, by: 5, settled: 30 });
  const [kind, setKind] = useState<Kind>("shop");
  const [fixed, setFixed] = useState<boolean[]>([false, false, false, false]);
  const crowd = useMemo(() => buyers(Math.ceil(RATE * (END + TRAVEL + 2))), []);
  const leaks = LEAKS[kind];
  const steps = STEPS[kind];
  const drop = leaks.map((l, i) => l.drop[fixed[i] ? 1 : 0]);

  // expected flow per 1,000 arrivals, now and with every leak open
  const flow = (d: number[]) => d.reduce<number[]>((acc, x) => [...acc, acc[acc.length - 1] * (1 - x)], [1000]);
  const now = flow(drop);
  const base = flow(leaks.map((l) => l.drop[0]));
  const worth = leaks.map((l, i) => {
    const alt = drop.slice();
    alt[i] = l.drop[fixed[i] ? 0 : 1];
    return Math.abs(flow(alt)[4] - now[4]);
  });

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
    const L = 8;
    const R = box.w - 8;
    const top = 14;
    const bot = box.h - 46;
    const yc = (top + bot) / 2;
    const full = bot - top;
    const gx = (i: number) => L + ((R - L) * i) / 4;
    // the band narrows at each gate by the share that walks on (a flow
    // drawn to its own numbers)
    const share = [1, ...drop.map((_, i) => drop.slice(0, i + 1).reduce((a, d) => a * (1 - d), 1))];
    const hseg = (seg: number) => Math.max(6, full * share[Math.min(4, seg)]);
    const ease = 34;
    const halfAt = (x: number) => {
      const seg = Math.max(0, Math.min(4, Math.floor(((x - L) / (R - L)) * 4)));
      const gate = gx(seg);
      const prev = hseg(Math.max(0, seg - 1));
      const k = seg === 0 ? 1 : Math.min(1, (x - gate) / ease);
      return (prev + (hseg(seg) - prev) * k * k * (3 - 2 * k)) / 2;
    };
    // the band's edges
    g.strokeStyle = paper;
    g.lineWidth = 1;
    g.globalAlpha = 0.18;
    for (const sign of [-1, 1]) {
      g.beginPath();
      for (let x = L; x <= R; x += 3) {
        const y = yc + sign * halfAt(x);
        if (x === L) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    }
    // the gates, as tall as the flow that reaches them
    g.globalAlpha = 0.3;
    for (let i = 1; i <= 4; i++) {
      const h = hseg(i - 1) / 2 + 6;
      g.beginPath();
      g.moveTo(Math.round(gx(i)) + 0.5, yc - h);
      g.lineTo(Math.round(gx(i)) + 0.5, yc + h);
      g.stroke();
    }
    const t = sim.t;
    for (const b of crowd) {
      const age = t - b.at;
      if (age < 0) break;
      if (age > TRAVEL + 1.4) continue;
      const x = L + (age / TRAVEL) * (R - L);
      let out = -1;
      for (let i = 0; i < 4; i++) {
        if (b.u[i] < drop[i]) {
          out = i;
          break;
        }
      }
      const gate = out >= 0 ? gx(out + 1) : Infinity;
      if (x <= gate) {
        if (x > R) continue;
        const y = yc + (b.lane - 0.5) * 2 * Math.max(1, halfAt(x) - 2);
        const won = out < 0 && x > gx(3) + ease;
        g.globalAlpha = won ? 1 : 0.8;
        g.fillStyle = won ? signal : paper;
        g.fillRect(x - 1.5, y - 1.5, 3, 3);
      } else {
        // it left at the gate: it falls out of the bottom of the flow
        const since = ((x - gate) / (R - L)) * TRAVEL;
        if (since > 1.1) continue;
        const y0 = yc + (b.lane - 0.5) * 2 * Math.max(1, halfAt(gate - 1) - 2);
        const fall = Math.max(0, bot + 30 - y0);
        g.globalAlpha = 0.55 * (1 - since / 1.1);
        g.fillStyle = signal;
        g.fillRect(gate - 1.5, y0 + (since / 1.1) * fall - 1.5, 3, 3);
      }
    }
    g.globalAlpha = 1;
  }, [sim.t, box, crowd, drop]);

  const toggle = (i: number) => setFixed((f) => f.map((v, k) => (k === i ? !v : v)));
  const anyFixed = fixed.some(Boolean);

  return (
    <Console
      sim={sim}
      frameRef={frame}
      title="The path"
      clock={`${fmt(Math.floor(sim.t * RATE))} arrivals`}
      label="A simulated path to purchase: buyers arrive and pass through four steps to the one number; each step has a leak, and fixing it lets more of the same buyers through."
      stepLabel="Step five seconds"
      readout={
        anyFixed
          ? `Same attention, ${fmt(now[4])} instead of ${fmt(base[4])} ${steps[4].toLowerCase()}s per 1,000 arrivals: ${Math.round((now[4] / base[4] - 1) * 100)}% more, without one more visitor.`
          : `${fmt(base[4])} ${steps[4].toLowerCase()}s per 1,000 arrivals with every leak open. Fix one to see what it is worth.`
      }
      note="Illustrative rates, not a client’s. In the Diagnostic each step is measured on your own path, by source, and each leak priced in your own numbers."
    >
      <Controls>
        <div role="group" aria-label="The kind of path" className="flex gap-1.5">
          <Chip on={kind === "shop"} onClick={() => setKind("shop")}>
            A shop
          </Chip>
          <Chip on={kind === "demo"} onClick={() => setKind("demo")}>
            A demo request
          </Chip>
        </div>
        <p className="text-[13px] text-fog sm:ml-auto">Fix a leak below to change who gets through.</p>
      </Controls>

      <div className="grid grid-cols-5 border-b border-paper/12 px-1 pt-3 text-[13px] sm:relative sm:block sm:h-[88px] sm:px-0 sm:pt-0">
        {steps.map((st, i) => (
          <div
            key={st}
            className={`min-w-0 px-1.5 pb-2 sm:absolute sm:top-3 sm:px-0 sm:pb-0 ${i === 4 ? "sm:right-2 sm:text-right" : i === 0 ? "sm:left-2" : "sm:left-[var(--x)] sm:-translate-x-[6px]"}`}
            style={i > 0 && i < 4 ? ({ "--x": `calc(8px + (100% - 16px) * ${i / 4})` } as CSSProperties) : undefined}
          >
            <p className="truncate text-fog">{st}</p>
            <p className={`mt-1 font-mono text-[clamp(1rem,0.9rem+0.6vw,1.375rem)] leading-none tabular-nums ${i === 4 ? "text-signal" : "text-paper"}`}>{fmt(now[i])}</p>
            <p className="mt-1 h-4 font-mono text-[13px] tabular-nums text-fog max-sm:hidden">{i > 0 ? `${Math.round((now[i] / now[i - 1]) * 100)}%` : "of 1,000"}</p>
          </div>
        ))}
      </div>
      <div ref={plot} className="relative h-[230px] sm:h-[260px] lg:h-[300px]">
        <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
        {drop.map((d, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute bottom-2 -translate-x-1/2 font-mono text-[13px] leading-none text-signal"
            style={{ left: `calc(8px + (100% - 16px) * ${(i + 1) / 4})` }}
          >
            {i === 3 ? "" : `−${Math.round(d * 100)}%`}
          </span>
        ))}
        <span aria-hidden className="absolute bottom-2 right-2 font-mono text-[13px] leading-none text-signal">
          −{Math.round(drop[3] * 100)}%
        </span>
      </div>
      <ol className="grid border-t border-paper/12 sm:grid-cols-2 lg:grid-cols-4">
        {leaks.map((l, i) => (
          <li key={l.leak} className="border-b border-paper/10 sm:odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
            <button
              type="button"
              aria-pressed={fixed[i]}
              onClick={() => toggle(i)}
              className={`flex h-full w-full flex-col gap-2 px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-paper sm:px-4 ${
                fixed[i] ? "bg-paper/[0.06]" : "hover:bg-paper/[0.03]"
              }`}
            >
              <span className="flex items-center justify-between gap-3 text-[13px] text-fog">
                <span>
                  {steps[i]} to {steps[i + 1].toLowerCase()}
                </span>
                <span className={`inline-flex h-[22px] items-center border px-1.5 leading-none ${fixed[i] ? "border-paper bg-paper text-ink" : "border-signal/70 text-signal"}`}>
                  {fixed[i] ? "Fixed" : "Leak"}
                </span>
              </span>
              <span className="text-[15px] leading-[1.35] text-paper">{fixed[i] ? l.fix : l.leak}</span>
              <span className="font-mono text-[13px] tabular-nums text-fog">
                {fixed[i] ? "Adds" : "Worth"} {fmt(worth[i])} per 1,000
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="grid grid-cols-2 gap-x-4 border-t border-paper/12 px-3 py-3 sm:px-4 lg:grid-cols-4">
        <Figure label="With every leak open" value={fmt(base[4])} tone="fog" />
        <Figure label="Now" value={fmt(now[4])} tone="signal" />
      </div>
    </Console>
  );
}
