import type { CSSProperties } from "react";
import { clock, Label, Line, Node, Pulse, Stage, Svg } from "@/components/artifacts/kit";
import { Plate } from "@/components/artifacts/plate";

/*
  The company pages' drawings:
  - RhythmArt (Method): the cadence every engagement keeps, as three
    rings, a tick for each week of the quarter, an arc for each month, the
    quarter around them, and a sweep that keeps time.
  - TeamArt (Method): one senior team around you, each role wired
    straight to you, with nobody in between.
  - PathArt (Industries): the surfaces a kind of buyer passes through, in
    order, to the number we answer for.
  (About and the Diagnostic open on their own drawings instead:
  components/signatures.tsx.)
*/

/* ---------- Method: the rhythm ---------- */

export function RhythmArt() {
  const S = 360;
  const C = S / 2;
  const R = { week: 78, month: 116, quarter: 152 };
  const WEEKS = 13;
  const at = (r: number, deg: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
  };
  const arc = (r: number, a0: number, a1: number) => {
    const [x0, y0] = at(r, a0);
    const [x1, y1] = at(r, a1);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };
  return (
    <Plate
      label="A clock of the engagement's rhythm: thirteen weekly ticks, three monthly arcs and one quarterly ring around the one number, with a sweep that keeps time."
      hold={2600}
      loop
      tone="red"
      frameClassName="px-5 pb-14 pt-6 sm:px-8 lg:px-10 lg:pt-10"
    >
      <Stage w={S} h={S} className="mx-auto max-w-[420px]">
        <Svg w={S} h={S}>
          <circle cx={C} cy={C} r={R.quarter} pathLength={1} strokeWidth={1.5} className="pl-stroke text-paper" style={clock({ t: 1700, d: 800 })} />
          {[0, 1, 2].map((m) => (
            <path key={m} d={arc(R.month, m * 120 + 6, m * 120 + 114)} pathLength={1} strokeWidth={3} className="pl-stroke text-paper" style={clock({ t: 900 + m * 220, d: 260 })} />
          ))}
          {Array.from({ length: WEEKS }, (_, w) => {
            const deg = (w * 360) / WEEKS;
            const [x0, y0] = at(R.week - 9, deg);
            const [x1, y1] = at(R.week + 9, deg);
            return <path key={w} d={`M${x0} ${y0}L${x1} ${y1}`} strokeWidth={2} className="pl-lit text-paper" style={clock({ t: 60 + w * 55 })} />;
          })}
          <g className="pl-spin" style={{ ...clock({ p: 13000 }), transformOrigin: `${C}px ${C}px` } as CSSProperties}>
            <path d={`M${C} ${C}V${C - R.quarter - 10}`} strokeWidth={1.5} className="text-paper/70" />
          </g>
          <Node x={C} y={C} s={12} t={2400} className="text-paper" />
        </Svg>
        <Label w={S} h={S} x={C} y={C + 16} ax="center" ay="top" t={2400} className="text-paper">
          The one number
        </Label>
      </Stage>
    </Plate>
  );
}

/* ---------- Method: the team ---------- */

export function TeamArt({ roles }: { roles: readonly string[] }) {
  const W = 720;
  const H = 400;
  const C = { x: 360, y: 200 };
  const RX = 250;
  const RY = 150;
  const at = (i: number) => {
    const a = ((i * 360) / roles.length - 90) * (Math.PI / 180);
    return { x: C.x + RX * Math.cos(a), y: C.y + RY * Math.sin(a) };
  };
  return (
    <Plate
      label={`A diagram: you at the center, wired straight to each of the team: ${roles.join(", ")}. Nobody stands in between.`}
      hold={2400}
      loop
      frameClassName="px-5 pb-14 pt-8 sm:px-8 lg:px-10"
    >
      <Stage w={W} h={H}>
        <Svg w={W} h={H}>
          <ellipse cx={C.x} cy={C.y} rx={RX} ry={RY} pathLength={1} strokeWidth={1} className="pl-stroke text-paper/15" style={clock({ t: 0, d: 900 })} />
          {roles.map((r, i) => {
            const p = at(i);
            return <Line key={r} d={`M${C.x} ${C.y}L${p.x} ${p.y}`} t={700 + i * 140} dur={420} w={1.25} className="text-paper/45" />;
          })}
          {roles.map((r, i) => {
            const p = at(i);
            return <Node key={r} x={p.x} y={p.y} t={1100 + i * 140} className="text-paper" />;
          })}
          {roles.map((r, i) => {
            const p = at(i);
            return <Pulse key={r} d={`M${p.x} ${p.y}L${C.x} ${C.y}`} p={3400} pd={i * 480} w={2.5} />;
          })}
          <Node x={C.x} y={C.y} s={14} t={400} className="text-signal" />
        </Svg>
        <Label w={W} h={H} x={C.x} y={C.y + 18} ax="center" ay="top" t={400} className="text-paper">
          You
        </Label>
        {roles.map((r, i) => {
          const p = at(i);
          const side = p.x < C.x - 20 ? "end" : p.x > C.x + 20 ? "start" : "center";
          return (
            <Label
              key={r}
              w={W}
              h={H}
              x={side === "end" ? p.x - 14 : side === "start" ? p.x + 14 : p.x}
              y={side === "center" ? p.y - 14 : p.y}
              ax={side}
              ay={side === "center" ? "bottom" : "middle"}
              t={1100 + i * 140}
              className="text-fog max-sm:hidden"
            >
              {r}
            </Label>
          );
        })}
      </Stage>
    </Plate>
  );
}

/* ---------- Industries: the path to the number ---------- */

function PathWide({ steps, end }: { steps: readonly string[]; end: string }) {
  const W = 720;
  const H = 120;
  const Y = 34;
  const n = steps.length;
  const X = (i: number) => 16 + (i * (W - 32)) / n;
  const path = `M${X(0)} ${Y}H${X(n)}`;
  return (
    <Stage w={W} h={H}>
      <Svg w={W} h={H}>
        <Line d={path} t={0} dur={900} className="text-paper/40" />
        {steps.map((s, i) => (
          <Node key={s} x={X(i)} y={Y} t={i * 220} className="text-paper" />
        ))}
        <Node x={X(n)} y={Y} s={12} t={n * 220} className="text-signal" />
        <Pulse d={path} p={3000} w={3} />
      </Svg>
      {steps.map((s, i) => (
        <Label key={s} w={W} h={H} x={X(i)} y={Y + 18} ax={i === 0 ? "start" : "center"} ay="top" t={i * 220} max="8.5rem">
          {s}
        </Label>
      ))}
      <Label w={W} h={H} x={X(n)} y={Y + 18} ax="end" ay="top" t={n * 220} max="9rem" className="text-paper">
        {end}
      </Label>
    </Stage>
  );
}

function PathTall({ steps, end }: { steps: readonly string[]; end: string }) {
  const W = 320;
  const n = steps.length;
  const STEP = 52;
  const H = 24 + n * STEP + 24;
  const X = 12;
  const Y = (i: number) => 18 + i * STEP;
  const path = `M${X} ${Y(0)}V${Y(n)}`;
  return (
    <Stage w={W} h={H}>
      <Svg w={W} h={H}>
        <Line d={path} t={0} dur={900} className="text-paper/40" />
        {steps.map((s, i) => (
          <Node key={s} x={X} y={Y(i)} t={i * 220} className="text-paper" />
        ))}
        <Node x={X} y={Y(n)} s={12} t={n * 220} className="text-signal" />
        <Pulse d={path} p={3000} w={3} />
      </Svg>
      {steps.map((s, i) => (
        <Label key={s} w={W} h={H} x={X + 22} y={Y(i)} t={i * 220}>
          {s}
        </Label>
      ))}
      <Label w={W} h={H} x={X + 22} y={Y(n)} t={n * 220} className="text-paper">
        {end}
      </Label>
    </Stage>
  );
}

export function PathArt({ steps, end, label }: { steps: readonly string[]; end: string; label: string }) {
  return (
    <Plate label={label} hold={steps.length * 220 + 300} loop frameClassName="px-5 pb-12 pt-6 sm:px-6 sm:pt-6">
      <div className="hidden sm:block">
        <PathWide steps={steps} end={end} />
      </div>
      <div className="sm:hidden">
        <PathTall steps={steps} end={end} />
      </div>
    </Plate>
  );
}
