import type { CSSProperties, ReactNode } from "react";
import { clock, curve, Label, Line, Node, Pulse, Stage, Svg } from "@/components/artifacts/kit";
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
  - SuppliersArt (About): ten suppliers, each reporting its own number,
    brought together into one team and one number.
  - RadarArt (the Diagnostic): the six parts as a radar, with a sample
    read drawn on it, labelled as a sample.
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

/* ---------- About: ten suppliers, one number ---------- */

const SUPPLIERS = [
  { name: "Media agency", reports: "Reach" },
  { name: "Display team", reports: "Impressions" },
  { name: "Social agency", reports: "Followers" },
  { name: "Search team", reports: "Click-through" },
  { name: "Creator platform", reports: "Views" },
  { name: "Analytics vendor", reports: "Sessions" },
  { name: "PR firm", reports: "Mentions" },
  { name: "Content studio", reports: "Articles" },
  { name: "Web agency", reports: "PageSpeed" },
  { name: "SEO consultant", reports: "Organic traffic" },
];

function SuppliersWide() {
  const W = 720;
  const H = 460;
  const Y = (i: number) => 26 + i * 45;
  const NX = 182;
  const MERGE = { x: 560, y: 228 };
  const OUT = { x: 690, y: 228 };
  return (
    <Stage w={W} h={H}>
      <Svg w={W} h={H}>
        {SUPPLIERS.map((s, i) => (
          <Line key={s.name} d={`M${NX + 6} ${Y(i)}H${300}`} t={i * 90} dur={360} w={1.25} className="text-paper/40" />
        ))}
        {SUPPLIERS.map((s, i) => (
          <Node key={s.name} x={NX} y={Y(i)} t={i * 90} className="text-paper" />
        ))}
        {SUPPLIERS.map((s, i) => (
          <Line key={s.name} d={curve(420, Y(i), MERGE.x - 6, MERGE.y, 0.6)} t={1500 + i * 70} dur={700} w={1.25} className="text-paper/50" />
        ))}
        <Line d={`M${MERGE.x} ${MERGE.y}H${OUT.x - 8}`} t={2500} dur={500} w={2.5} className="text-signal" />
        <Node x={MERGE.x} y={MERGE.y} s={10} t={2400} className="text-paper" />
        <Node x={OUT.x} y={OUT.y} s={13} t={3000} className="text-signal" />
        <Pulse d={`M${MERGE.x} ${MERGE.y}H${OUT.x - 8}`} p={1600} w={3} className="text-paper" />
      </Svg>
      {SUPPLIERS.map((s, i) => (
        <Label key={s.name} w={W} h={H} x={NX - 14} y={Y(i)} ax="end" t={i * 90} className="text-paper">
          {s.name}
        </Label>
      ))}
      {SUPPLIERS.map((s, i) => (
        <Label key={s.reports} w={W} h={H} x={308} y={Y(i)} t={i * 90 + 300}>
          {s.reports}
        </Label>
      ))}
      <Label w={W} h={H} x={MERGE.x} y={MERGE.y - 16} ax="center" ay="bottom" t={2400} className="text-paper">
        One team
      </Label>
      <Label w={W} h={H} x={OUT.x} y={OUT.y + 18} ax="end" ay="top" t={3000} className="text-paper">
        One number
      </Label>
    </Stage>
  );
}

function SuppliersTall() {
  const W = 320;
  const H = 560;
  const Y = (i: number) => 22 + i * 44;
  const NX = 132;
  const END = { x: 262, y: 528 };
  return (
    <Stage w={W} h={H}>
      <Svg w={W} h={H}>
        {SUPPLIERS.map((s, i) => (
          <Line key={s.name} d={`M${NX + 6} ${Y(i)}C${END.x} ${Y(i)} ${END.x} ${Y(i)} ${END.x} ${END.y - 8}`} t={300 + i * 90} dur={800} w={1.25} className="text-paper/45" />
        ))}
        {SUPPLIERS.map((s, i) => (
          <Node key={s.name} x={NX} y={Y(i)} t={i * 90} className="text-paper" />
        ))}
        <Node x={END.x} y={END.y} s={13} t={1900} className="text-signal" />
        <Pulse d={`M${END.x} ${Y(0)}V${END.y - 8}`} p={2400} w={3} className="text-paper" />
      </Svg>
      {SUPPLIERS.map((s, i) => (
        <Label key={s.name} w={W} h={H} x={NX - 14} y={Y(i)} ax="end" t={i * 90} className="text-paper">
          {s.name}
        </Label>
      ))}
      <Label w={W} h={H} x={END.x - 18} y={END.y} ax="end" t={1900} className="text-paper">
        One team, one number
      </Label>
    </Stage>
  );
}

export function SuppliersArt({ caption }: { caption?: ReactNode }) {
  return (
    <Plate
      label="A diagram: ten suppliers, from a media agency to an SEO consultant, each reporting its own number (reach, impressions, followers and so on), brought together into one team that answers for one number."
      hold={3100}
      loop
      layout="side"
      caption={caption}
      frameClassName="px-5 pb-14 pt-6 sm:px-8 sm:pt-8 lg:px-10 lg:pt-10"
    >
      <div className="hidden sm:block">
        <SuppliersWide />
      </div>
      <div className="sm:hidden">
        <SuppliersTall />
      </div>
    </Plate>
  );
}

/* ---------- The Diagnostic: six parts ---------- */

export function RadarArt({ parts, sample }: { parts: readonly { short: string; score: number }[]; sample: string }) {
  const W = 560;
  const H = 440;
  const C = { x: 280, y: 222 };
  const R = 142;
  const n = parts.length;
  const at = (i: number, r: number) => {
    const a = ((i * 360) / n - 90) * (Math.PI / 180);
    return { x: C.x + r * Math.cos(a), y: C.y + r * Math.sin(a) };
  };
  const ring = (r: number) => parts.map((_, i) => at(i, r)).map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("") + "Z";
  const shape = parts.map((p, i) => at(i, (p.score / 10) * R)).map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("") + "Z";
  return (
    <Plate
      label={`A radar of the six parts, each scored out of 10, with ${sample}'s sample read: ${parts.map((p) => `${p.short} ${p.score}`).join(", ")}.`}
      hold={2400}
      frameClassName="px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8"
    >
      <Stage w={W} h={H}>
        <Svg w={W} h={H}>
          {[2, 4, 6, 8, 10].map((k, i) => (
            <path key={k} d={ring((k / 10) * R)} pathLength={1} strokeWidth={1} className="pl-stroke text-paper/15" style={clock({ t: i * 120, d: 500 })} />
          ))}
          {parts.map((p, i) => {
            const e = at(i, R);
            return <path key={p.short} d={`M${C.x} ${C.y}L${e.x} ${e.y}`} strokeWidth={1} className="pl-lit text-paper/20" style={clock({ t: 500 })} />;
          })}
          <path d={shape} fill="currentColor" stroke="none" className="pl-lit text-signal/15" style={clock({ t: 1900 })} />
          <path d={shape} pathLength={1} strokeWidth={2} className="pl-stroke text-signal" style={clock({ t: 1000, d: 900 })} />
          {parts.map((p, i) => {
            const q = at(i, (p.score / 10) * R);
            return <Node key={p.short} x={q.x} y={q.y} s={7} t={1000 + i * 150} className="text-paper" />;
          })}
        </Svg>
        {parts.map((p, i) => {
          const e = at(i, R + 16);
          const side = e.x < C.x - 10 ? "end" : e.x > C.x + 10 ? "start" : "center";
          return (
            <Label
              key={p.short}
              w={W}
              h={H}
              x={e.x}
              y={e.y}
              ax={side}
              ay={side === "center" ? (e.y < C.y ? "bottom" : "top") : "middle"}
              t={600 + i * 80}
              className="text-fog"
            >
              {p.short} <span className="text-paper">{p.score}</span>
            </Label>
          );
        })}
        <Label w={W} h={H} x={0} y={0} ay="top" t={0} className="text-signal">
          Sample: {sample}
        </Label>
      </Stage>
    </Plate>
  );
}
