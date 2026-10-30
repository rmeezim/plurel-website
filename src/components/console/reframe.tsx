"use client";

import { useMemo, useRef, useState } from "react";
import { Console, useBox, useSim } from "@/components/console/console";
import { Chip, Controls, Figure } from "@/components/console/parts";
import { clamp, smooth } from "@/lib/sim";

/*
  Video & Photo: one take, framed for every surface. The master frame is
  the widest picture (16:9); inside it the tracked subject moves through
  the take, and each crop the plan needs (4:5, 1:1, 9:16) follows it,
  held inside the frame. Shot only for the wide frame, the action runs
  to the edges and the narrow crops lose it; blocked for every crop, the
  action keeps to the middle and every crop survives. The playhead runs
  the take; click the strip to move it. A drawn framing chart, not
  footage: the composition is illustrative.
*/

const TAKE = 12; // seconds
const CROPS = [
  { name: "4:5", ar: 4 / 5 },
  { name: "1:1", ar: 1 },
  { name: "9:16", ar: 9 / 16 },
] as const;

type Mode = "planned" | "wide";
// the subject's centre across the take, as a share of the frame
const PATHS: Record<Mode, (t: number) => [number, number]> = {
  planned: (t) => [0.5 + 0.11 * Math.sin((t / TAKE) * Math.PI * 1.6), 0.5 + 0.05 * Math.sin((t / TAKE) * Math.PI * 3)],
  wide: (t) => [0.14 + 0.72 * smooth(clamp(t / TAKE)), 0.52 + 0.08 * Math.sin((t / TAKE) * Math.PI * 2)],
};

export function ReframeConsole() {
  const frame = useRef<HTMLElement>(null);
  const plot = useRef<HTMLDivElement>(null);
  const box = useBox(plot);
  const [mode, setMode] = useState<Mode>("planned");
  const sim = useSim(frame, { end: TAKE, rate: 1, by: 1, settled: TAKE * 0.55 });
  const t = sim.t;

  const W = box.w || 800;
  const H = (W * 9) / 16;
  const [sx, sy] = PATHS[mode](t);
  const subj = { x: sx * W, y: sy * H, w: W * 0.11, h: H * 0.42 };
  // each crop follows the subject, held inside the frame
  const crops = CROPS.map((c) => {
    const ch = H;
    const cw = ch * c.ar;
    const x = clamp(subj.x - cw / 2, 0, W - cw);
    const lost = subj.x - subj.w / 2 < x + 4 || subj.x + subj.w / 2 > x + cw - 4;
    return { ...c, x, w: cw, lost };
  });
  // over the whole take, how much of it each crop keeps the subject in
  const kept = useMemo(
    () =>
      CROPS.map((c) => {
        let ok = 0;
        for (let k = 0; k <= 120; k++) {
          const tt = (k / 120) * TAKE;
          const [px] = PATHS[mode](tt);
          const cw = c.ar * 9;
          const fx = clamp(px * 16 - cw / 2, 0, 16 - cw);
          const half = 0.11 * 8;
          if (px * 16 - half >= fx && px * 16 + half <= fx + cw) ok++;
        }
        return ok / 121;
      }),
    [mode],
  );
  const lostAny = crops.some((c) => c.lost);

  return (
    <Console
      sim={sim}
      frameRef={frame}
      title="One take, every frame"
      clock={`00:00:${String(Math.floor(t)).padStart(2, "0")}:${String(Math.floor((t % 1) * 25)).padStart(2, "0")}`}
      label="A drawn framing chart: one take in the widest frame, with the subject tracked and each narrower crop following it. Shot only for the wide frame, the narrow crops lose the subject; blocked for every crop, they all hold."
      stepLabel="Step one second"
      readout={
        mode === "planned"
          ? `Blocked for every crop: the action keeps to the middle third, so 4:5, 1:1 and 9:16 all hold the subject for the whole take. One shoot day, every surface it was planned for.`
          : `Shot for the wide frame only: the subject crosses the frame, and the 9:16 crop keeps it for ${Math.round(kept[2] * 100)}% of the take. The vertical cut needs a reshoot.`
      }
      note="A drawn framing chart, not footage; the composition is illustrative. The crops each surface needs come from the Surface Plan’s cut list, before the shoot."
    >
      <Controls>
        <div role="group" aria-label="How the take was blocked" className="flex gap-1.5">
          <Chip on={mode === "planned"} onClick={() => setMode("planned")}>
            Blocked for every crop
          </Chip>
          <Chip on={mode === "wide"} onClick={() => setMode("wide")}>
            Shot for 16:9 only
          </Chip>
        </div>
      </Controls>
      <div className="grid lg:grid-cols-12">
        <div className="border-b border-paper/12 p-3 sm:p-4 lg:col-span-8 lg:border-b-0 lg:border-r">
          <div ref={plot} className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" fill="none">
              <rect x={0.5} y={0.5} width={W - 1} height={H - 1} stroke="var(--color-paper)" strokeOpacity={0.45} />
              {/* the set: a horizon, a table, a window, drawn as lines */}
              <line x1={0} x2={W} y1={H * 0.62} y2={H * 0.62} stroke="var(--color-paper)" strokeOpacity={0.12} />
              <rect x={W * 0.3} y={H * 0.66} width={W * 0.4} height={H * 0.05} stroke="var(--color-paper)" strokeOpacity={0.14} />
              <rect x={W * 0.72} y={H * 0.12} width={W * 0.16} height={H * 0.32} stroke="var(--color-paper)" strokeOpacity={0.1} />
              {/* the centre third the blocking keeps to */}
              {[1 / 3, 2 / 3].map((f) => (
                <g key={f}>
                  <line x1={W * f} x2={W * f} y1={0} y2={10} stroke="var(--color-paper)" strokeOpacity={0.4} />
                  <line x1={W * f} x2={W * f} y1={H - 10} y2={H} stroke="var(--color-paper)" strokeOpacity={0.4} />
                </g>
              ))}
              {crops.map((c, i) => (
                <rect
                  key={c.name}
                  x={c.x + 0.5 + i}
                  y={0.5 + i}
                  width={c.w - 1 - 2 * i}
                  height={H - 1 - 2 * i}
                  stroke={c.lost ? "var(--color-signal)" : "var(--color-paper)"}
                  strokeOpacity={c.lost ? 1 : 0.55 + i * 0.12}
                  strokeWidth={c.name === "9:16" ? 1.5 : 1}
                />
              ))}
              {/* the tracked subject: corner brackets, as a camera draws them */}
              {(() => {
                const x0 = subj.x - subj.w / 2;
                const y0 = subj.y - subj.h / 2;
                const k = 9;
                const d = `M${x0} ${y0 + k}V${y0}H${x0 + k}M${x0 + subj.w - k} ${y0}H${x0 + subj.w}V${y0 + k}M${x0 + subj.w} ${y0 + subj.h - k}V${y0 + subj.h}H${x0 + subj.w - k}M${x0 + k} ${y0 + subj.h}H${x0}V${y0 + subj.h - k}`;
                return <path d={d} stroke="var(--color-signal)" strokeWidth={1.5} />;
              })()}
              <rect x={subj.x - 2} y={subj.y - 2} width={4} height={4} fill="var(--color-signal)" />
            </svg>
            {crops.map((c, i) => (
              <span
                key={c.name}
                aria-hidden
                className={`absolute font-mono text-[13px] leading-none ${c.lost ? "text-signal" : "text-paper"}`}
                style={{ left: c.x + 6 + i, top: H - 20 - i * 18 }}
              >
                {c.name}
                {c.lost ? " · lost" : ""}
              </span>
            ))}
            <span aria-hidden className="absolute right-2 top-2 font-mono text-[13px] leading-none text-fog">
              16:9
            </span>
          </div>
          <button
            type="button"
            aria-label="Move the playhead"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              sim.seek(((e.clientX - r.left) / r.width) * TAKE);
            }}
            className="relative mt-3 block h-6 w-full border border-paper/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
          >
            <span aria-hidden className="absolute inset-y-0 left-0 bg-paper/10" style={{ width: `${(t / TAKE) * 100}%` }} />
            <span aria-hidden className="absolute inset-y-0 w-px bg-signal" style={{ left: `${(t / TAKE) * 100}%` }} />
          </button>
        </div>
        <div className="flex flex-col lg:col-span-4">
          <div className="border-b border-paper/12 px-3 py-4 sm:px-4">
            <p className="text-[13px] text-fog">Each crop, over the whole take</p>
            <ul className="mt-2">
              {CROPS.map((c, i) => (
                <li key={c.name} className="grid grid-cols-[52px_1fr_48px] items-center gap-3 border-b border-paper/10 py-2 text-[14px] last:border-b-0">
                  <span className="font-mono text-[13px]">{c.name}</span>
                  <span aria-hidden className="h-[4px] bg-paper/10">
                    <span className={`block h-full ${kept[i] < 0.98 ? "bg-signal" : "bg-paper"}`} style={{ width: `${kept[i] * 100}%` }} />
                  </span>
                  <span className={`text-right font-mono text-[13px] tabular-nums ${kept[i] < 0.98 ? "text-signal" : "text-paper"}`}>{Math.round(kept[i] * 100)}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-3 py-4 sm:px-4">
            <Figure label="Subject in every crop" value={lostAny ? "No" : "Yes"} tone={lostAny ? "signal" : "paper"} />
            <Figure label="Reshoots needed" value={kept.some((k) => k < 0.98) ? kept.filter((k) => k < 0.98).length : 0} />
          </div>
          <p className="mt-auto border-t border-paper/12 px-3 py-3 text-[13px] leading-[1.45] text-fog sm:px-4">
            From one day blocked like this: the hero film and its cut-downs, the verticals, squares and portraits, and the stills, each framed on set rather than rescued in the edit.
          </p>
        </div>
      </div>
    </Console>
  );
}
