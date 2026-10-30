import type { CSSProperties, JSX, ReactNode } from "react";
import { clock, curve, Label, Legend, Line, Node, plot, Pulse, Stage, Svg } from "@/components/artifacts/kit";
import { Plate } from "@/components/artifacts/plate";
import type { EngagementKey } from "@/lib/nav";
import s from "./artifacts.module.css";

/*
  The four packages' signature drawings, one idea each:
  - Reach: luck against a system. One viral spike that falls back, and a
    chance taken every week that keeps a little of each lift.
  - Reputation: one story, carried the same way by every mention (their
    needles turn to point the same way) to where buyers check last.
  - Mindshare: memory. It fades between meetings; each meeting the same
    way lifts it and it fades less, until you are the name that comes to
    mind first.
  - Revenue: the path to purchase. It leaks at each step that doesn't
    answer the buyer; the costly leaks are closed, and more of the same
    attention arrives at the one number.
  Drawn once as they enter (plate.tsx); each keeps one quiet pulse going.
*/

/* ---------- Reach ---------- */

function ReachArt() {
  return (
    <>
      <ReachChart />
      <Legend
        items={[
          { swatch: "line", text: "A system: a chance every week" },
          { swatch: "dim", text: "One viral moment" },
          { swatch: "mark", text: "Each chance, over the weeks" },
        ]}
      />
    </>
  );
}

function ReachChart() {
  const W = 720;
  const H = 400;
  const Y0 = 336;
  const X0 = 24;
  const X1 = 700;
  const at = (x: number, t0: number, dur: number) => t0 + ((x - X0) / (X1 - X0)) * dur;

  const luck = (x: number) =>
    Y0 - (x < 196 ? 6 : x < 208 ? 6 + ((x - 196) / 12) * 256 : 6 + 256 * Math.exp(-(x - 208) / 30));
  const CH = Array.from({ length: 9 }, (_, i) => 96 + i * 66);
  const system = (x: number) => {
    let i = -1;
    CH.forEach((c, k) => {
      if (x >= c) i = k;
    });
    return Y0 - (i < 0 ? 6 : 6 + (i + 1) * 20 + 50 * Math.exp(-(x - CH[i]) / 14));
  };
  const luckPath = plot(luck, X0, X1);
  const systemPath = plot(system, X0, X1);
  const SYS = { t: 1700, d: 2600 };

  return (
    <Stage w={W} h={H}>
      <Svg w={W} h={H}>
        <Line d={`M${X0} ${Y0}H${X1}`} t={0} dur={500} w={1} className="text-paper/40" />
        <Line d={luckPath} t={500} dur={1200} className="text-fog/70" />
        <Line d={systemPath} t={SYS.t} dur={SYS.d} w={2} className="text-paper" />
        {CH.map((c) => (
          <path key={c} d={`M${c} ${Y0 + 6}v9`} strokeWidth={2} className="pl-lit text-signal" style={clock({ t: at(c, SYS.t, SYS.d) })} />
        ))}
        <path d={`M196 ${Y0 + 6}v9`} strokeWidth={2} className="pl-lit text-fog" style={clock({ t: at(196, 500, 1200) })} />
        <Node x={X1} y={system(X1)} t={SYS.t + SYS.d} className="text-signal" />
        <Pulse d={systemPath} p={4200} />
        <Pulse d={systemPath} p={4200} pd={2100} />
      </Svg>
      <Label w={W} h={H} x={X0} y={10} ay="top" t={200} className="text-fog max-sm:hidden">
        People who know you
      </Label>
      <Label w={W} h={H} x={X1} y={Y0 + 22} ax="end" ay="top" t={200} className="text-fog max-sm:hidden">
        Weeks
      </Label>
      <Label w={W} h={H} x={218} y={78} t={900} className="text-fog max-sm:hidden">
        One viral moment
      </Label>
      <Label w={W} h={H} x={X1} y={system(X1) + 48} ax="end" ay="top" t={SYS.t + SYS.d} className="text-paper max-sm:hidden">
        A system: a chance every week
      </Label>
    </Stage>
  );
}

/* ---------- Reputation ---------- */

function ReputationArt() {
  const W = 720;
  const H = 440;
  const STORY = { x: 70, y: 220 };
  const MENTIONS = [
    { name: "Press", y: 70, a0: 38 },
    { name: "Podcasts", y: 170, a0: -64 },
    { name: "Reviews", y: 270, a0: 112 },
    { name: "Creators", y: 370, a0: -28 },
  ];
  const MX = 330;
  const CHECKS = [
    { name: "Search", y: 160 },
    { name: "AI answers", y: 280 },
  ];
  const CX = 560;

  return (
    <Stage w={W} h={H}>
      <Svg w={W} h={H}>
        {MENTIONS.map((m, i) => (
          <Line key={m.name} d={curve(STORY.x, STORY.y, MX - 34, m.y)} t={300 + i * 180} dur={600} className="text-paper/45" />
        ))}
        {MENTIONS.map((m, i) => (
          <g key={m.name}>
            <rect x={MX - 3.5} y={m.y - 3.5} width={7} height={7} fill="currentColor" className="pl-lit text-paper" style={clock({ t: 900 + i * 180 })} />
            {/* the needle: each mention's own heading, turned to the one the story sets */}
            <path
              d={`M${MX - 30} ${m.y}H${MX + 30}M${MX + 22} ${m.y - 6}L${MX + 30} ${m.y}L${MX + 22} ${m.y + 6}`}
              strokeWidth={1.75}
              className={`${s.needle} text-signal`}
              style={{ ...clock({ t: 900 + i * 180 }), "--a0": `${m.a0}deg`, "--nt": `${1900 + i * 140}ms` } as CSSProperties}
            />
          </g>
        ))}
        {MENTIONS.map((m, i) =>
          CHECKS.map((c, j) => (
            <Line key={`${m.name}-${c.name}`} d={curve(MX + 34, m.y, CX - 8, c.y)} t={2700 + i * 120 + j * 60} dur={700} w={1} className="text-paper/30" />
          )),
        )}
        {CHECKS.map((c, j) => (
          <Node key={c.name} x={CX} y={c.y} s={10} t={3500 + j * 120} className="text-signal" />
        ))}
        <Node x={STORY.x} y={STORY.y} s={12} t={0} className="text-paper" />
        {MENTIONS.map((m, i) => (
          <Pulse key={m.name} d={curve(STORY.x, STORY.y, MX - 34, m.y)} p={3600} pd={i * 900} />
        ))}
        {CHECKS.map((c, j) => (
          <Pulse key={c.name} d={curve(MX + 34, MENTIONS[j * 2 + 1].y, CX - 8, c.y)} p={3600} pd={1800 + j * 900} w={2.5} />
        ))}
      </Svg>
      <Label w={W} h={H} x={STORY.x} y={STORY.y + 22} ax="center" ay="top" t={100} className="text-paper">
        One story
      </Label>
      {MENTIONS.map((m, i) => (
        <Label key={m.name} w={W} h={H} x={MX} y={m.y - 16} ax="center" ay="bottom" t={900 + i * 180}>
          {m.name}
        </Label>
      ))}
      {CHECKS.map((c, j) => (
        <Label key={c.name} w={W} h={H} x={CX + 18} y={c.y} t={3500 + j * 120} className="text-paper">
          {c.name}
        </Label>
      ))}
    </Stage>
  );
}

/* ---------- Mindshare ---------- */

function MindshareArt() {
  return (
    <>
      <MindshareChart />
      <Legend
        items={[
          { swatch: "line", text: "How easily they recall you" },
          { swatch: "faint", text: "The name that comes to mind first" },
          { swatch: "mark", text: "Each meeting, the same way" },
        ]}
      />
    </>
  );
}

function MindshareChart() {
  const W = 720;
  const H = 400;
  const Y0 = 336;
  const X0 = 24;
  const X1 = 700;
  const MEET = Array.from({ length: 13 }, (_, i) => 70 + i * 48);
  const LIFT = 95;
  const CAP = 290;
  const k = (i: number) => 16 + 11 * i;
  // each meeting lifts memory by LIFT; it fades, more slowly after each meeting
  const peaks: number[] = [];
  MEET.forEach((m, j) => {
    const before = j === 0 ? 0 : peaks[j - 1] * Math.exp(-(m - MEET[j - 1]) / k(j - 1));
    peaks.push(Math.min(CAP, before + LIFT));
  });
  const memory = (x: number) => {
    let i = -1;
    MEET.forEach((m, j) => {
      if (x >= m) i = j;
    });
    return Y0 - (i < 0 ? 0 : peaks[i] * Math.exp(-(x - MEET[i]) / k(i)));
  };
  const path = plot(memory, X0, X1);
  const LINE = Y0 - 150;
  const T = { t: 900, d: 3000 };
  const at = (x: number) => T.t + ((x - X0) / (X1 - X0)) * T.d;
  const CROSS = MEET[10];

  return (
    <Stage w={W} h={H}>
      <Svg w={W} h={H}>
        <Line d={`M${X0} ${Y0}H${X1}`} t={0} dur={500} w={1} className="text-paper/40" />
        <Line d={`M${X0} ${LINE}H${X1}`} t={400} dur={600} w={1} className="text-paper/25" />
        <Line d={path} t={T.t} dur={T.d} w={2} className="text-paper" />
        {MEET.map((m) => (
          <path key={m} d={`M${m} ${Y0 + 6}v9`} strokeWidth={2} className="pl-lit text-signal" style={clock({ t: at(m) })} />
        ))}
        <Node x={CROSS} y={memory(CROSS - 2)} s={9} t={at(CROSS)} className="text-signal" />
        <Pulse d={path} p={4400} />
      </Svg>
      <Label w={W} h={H} x={X0} y={10} ay="top" t={200} className="text-fog max-sm:hidden">
        How easily they recall you
      </Label>
      <Label w={W} h={H} x={X0} y={LINE - 10} ay="bottom" t={700} className="text-paper max-sm:hidden">
        The name that comes to mind first
      </Label>
      <Label w={W} h={H} x={MEET[0]} y={Y0 + 22} ay="top" t={at(MEET[0])} className="text-fog max-sm:hidden">
        Each meeting, the same way
      </Label>
    </Stage>
  );
}

/* ---------- Revenue ---------- */

function RevenueArt() {
  return (
    <>
      <div className="hidden sm:block">
        <RevenueWide />
      </div>
      <div className="sm:hidden">
        <RevenueTall />
      </div>
    </>
  );
}

const STEP_NAMES = ["First visit", "Reasons", "Checkout", "The number"];
const LEAK_NAMES = ["A slow page", "No reason to believe", "One step too many"];
/** When each leak opens and when it is closed, ms */
const LEAK_T = (i: number) => ({ t: 700 + i * 260, fix: 2300 + i * 320 });

/* Across, from sm: the path left to right, the leaks falling from it */
function RevenueWide() {
  const W = 720;
  const H = 300;
  const Y = 70;
  const SX = [50, 250, 450, 670];
  const LEAKS = [
    { x: 150, len: 120 },
    { x: 350, len: 92 },
    { x: 560, len: 140 },
  ];
  const BOTTOM = 230;
  const path = `M${SX[0]} ${Y}H${SX[3]}`;
  return (
    <Stage w={W} h={H}>
      <Svg w={W} h={H}>
        <Line d={path} t={0} dur={700} className="text-paper/35" />
        {LEAKS.map((l, i) => (
          <g key={i}>
            <path d={`M${l.x} ${Y}V${BOTTOM - 12}`} strokeWidth={1} className="pl-lit text-paper/15" style={clock({ t: LEAK_T(i).t })} />
            <path
              d={`M${l.x} ${Y}V${Y + l.len}`}
              strokeWidth={1.75}
              className={`${s.leak} text-fog`}
              style={{ ...clock({ t: LEAK_T(i).t, d: 520 }), "--fix": `${LEAK_T(i).fix}ms` } as CSSProperties}
            />
            <Line d={`M${l.x - 9} ${Y + l.len * 0.14}H${l.x + 9}`} t={LEAK_T(i).fix + 420} dur={160} w={2} className="text-signal" />
          </g>
        ))}
        <Line d={path} t={3300} dur={1100} w={2.5} className="text-signal" />
        {SX.map((x, i) => (
          <Node key={x} x={x} y={Y} s={i === 3 ? 12 : 8} t={i === 3 ? 4400 : 100 + i * 120} className={i === 3 ? "text-signal" : "text-paper"} />
        ))}
        <Pulse d={path} p={2800} w={3.5} className="text-paper" />
        <Pulse d={path} p={2800} pd={1400} w={3.5} className="text-paper" />
      </Svg>
      {SX.map((x, i) => (
        <Label key={x} w={W} h={H} x={x} y={Y - 20} ax={i === 0 ? "start" : i === 3 ? "end" : "center"} ay="bottom" t={100 + i * 120} className="text-paper">
          {STEP_NAMES[i]}
        </Label>
      ))}
      {LEAKS.map((l, i) => (
        <Label key={i} w={W} h={H} x={l.x} y={BOTTOM} ax="center" ay="top" max="8.5rem" t={LEAK_T(i).t}>
          {LEAK_NAMES[i]}
        </Label>
      ))}
    </Stage>
  );
}

/* Down, on a phone: the path top to bottom, the leaks running off to the right */
function RevenueTall() {
  const W = 320;
  const H = 470;
  const X = 28;
  const SY = [24, 160, 300, 446];
  const LEAKS = [
    { y: 92, len: 150 },
    { y: 230, len: 110 },
    { y: 373, len: 170 },
  ];
  const path = `M${X} ${SY[0]}V${SY[3]}`;
  return (
    <Stage w={W} h={H}>
      <Svg w={W} h={H}>
        <Line d={path} t={0} dur={700} className="text-paper/35" />
        {LEAKS.map((l, i) => (
          <g key={i}>
            <path d={`M${X} ${l.y}H${W - 8}`} strokeWidth={1} className="pl-lit text-paper/15" style={clock({ t: LEAK_T(i).t })} />
            <path
              d={`M${X} ${l.y}H${X + l.len}`}
              strokeWidth={1.75}
              className={`${s.leakX} text-fog`}
              style={{ ...clock({ t: LEAK_T(i).t, d: 520 }), "--fix": `${LEAK_T(i).fix}ms` } as CSSProperties}
            />
            <Line d={`M${X + l.len * 0.14} ${l.y - 9}V${l.y + 9}`} t={LEAK_T(i).fix + 420} dur={160} w={2} className="text-signal" />
          </g>
        ))}
        <Line d={path} t={3300} dur={1100} w={2.5} className="text-signal" />
        {SY.map((y, i) => (
          <Node key={y} x={X} y={y} s={i === 3 ? 12 : 8} t={i === 3 ? 4400 : 100 + i * 120} className={i === 3 ? "text-signal" : "text-paper"} />
        ))}
        <Pulse d={path} p={2800} w={3.5} className="text-paper" />
        <Pulse d={path} p={2800} pd={1400} w={3.5} className="text-paper" />
      </Svg>
      {SY.map((y, i) => (
        <Label key={y} w={W} h={H} x={X + 20} y={y} t={100 + i * 120} className="text-paper">
          {STEP_NAMES[i]}
        </Label>
      ))}
      {LEAKS.map((l, i) => (
        <Label key={i} w={W} h={H} x={X + 20} y={l.y + 10} ay="top" t={LEAK_T(i).t}>
          {LEAK_NAMES[i]}
        </Label>
      ))}
    </Stage>
  );
}

const ART: Record<EngagementKey, { draw: () => JSX.Element; hold: number; label: string }> = {
  reach: {
    draw: ReachArt,
    hold: 4400,
    label:
      "A chart of people who know you over the weeks: one viral moment spikes and falls back to where it started, while a system takes a chance every week and keeps a little of each, so its line ends far higher.",
  },
  reputation: {
    draw: ReputationArt,
    hold: 3800,
    label:
      "A diagram: one story feeds press, podcasts, reviews and creators; their headings turn to point the same way, and together they reach search and AI answers, where buyers check last.",
  },
  mindshare: {
    draw: MindshareArt,
    hold: 4000,
    label:
      "A chart of how easily buyers recall you: memory fades between meetings, each meeting the same way lifts it and it fades less, until it stays above the line where you are the name that comes to mind first.",
  },
  revenue: {
    draw: RevenueArt,
    hold: 4500,
    label:
      "A diagram of the path from first visit to reasons, checkout and the one number: buyers leak out at a slow page, a missing reason and one step too many; the leaks are closed and more of the same attention reaches the number.",
  },
};

export function PackageArt({ pkg, caption }: { pkg: EngagementKey; caption?: ReactNode }) {
  const { draw: Draw, hold, label } = ART[pkg];
  return (
    <Plate label={label} hold={hold} loop layout="side" caption={caption} frameClassName="px-5 pb-14 pt-6 sm:px-8 sm:pt-8 lg:px-10 lg:pt-10">
      <Draw />
    </Plate>
  );
}

/*
  Each package's glyph: its drawing reduced to one small figure, no
  labels, for the packages index and the menu. Drawn once as it enters.
*/
function GlyphPaths({ pkg }: { pkg: EngagementKey }) {
  const W = 240;
  if (pkg === "reach") {
    const luck = (x: number) => 126 - (x < 64 ? 2 : x < 70 ? 2 + ((x - 64) / 6) * 104 : 2 + 104 * Math.exp(-(x - 70) / 12));
    const CH = [30, 58, 86, 114, 142, 170, 198];
    const sys = (x: number) => {
      let i = -1;
      CH.forEach((c, k) => {
        if (x >= c) i = k;
      });
      return 126 - (i < 0 ? 2 : 2 + (i + 1) * 9 + 20 * Math.exp(-(x - CH[i]) / 6));
    };
    return (
      <>
        <Line d={`M8 128H${W - 8}`} t={0} dur={300} w={1} className="text-paper/35" />
        <Line d={plot(luck, 8, W - 8, 1)} t={200} dur={700} w={1.25} className="text-fog/70" />
        <Line d={plot(sys, 8, W - 8, 1)} t={700} dur={1200} w={2} className="text-paper" />
      </>
    );
  }
  if (pkg === "reputation") {
    const rows = [30, 60, 90, 120];
    return (
      <>
        {rows.map((y, i) => (
          <Line key={y} d={curve(20, 75, 96, y)} t={i * 120} dur={500} w={1.25} className="text-paper/40" />
        ))}
        {rows.map((y, i) => (
          <path key={y} d={`M104 ${y}H156M148 ${y - 5}L156 ${y}L148 ${y + 5}`} strokeWidth={1.75} className="pl-lit text-signal" style={clock({ t: 600 + i * 120 })} />
        ))}
        {rows.map((y, i) => (
          <Line key={`c${y}`} d={curve(164, y, 220, 75)} t={1100 + i * 80} dur={500} w={1} className="text-paper/30" />
        ))}
        <Node x={20} y={75} s={8} t={0} className="text-paper" />
        <Node x={222} y={75} s={8} t={1600} className="text-signal" />
      </>
    );
  }
  if (pkg === "mindshare") {
    const M = [24, 46, 68, 90, 112, 134, 156, 178, 200, 222];
    const pk: number[] = [];
    M.forEach((m, j) => {
      const before = j === 0 ? 0 : pk[j - 1] * Math.exp(-(m - M[j - 1]) / (6 + 4 * (j - 1)));
      pk.push(Math.min(112, before + 38));
    });
    const mem = (x: number) => {
      let i = -1;
      M.forEach((m, j) => {
        if (x >= m) i = j;
      });
      return 128 - (i < 0 ? 0 : pk[i] * Math.exp(-(x - M[i]) / (6 + 4 * i)));
    };
    return (
      <>
        <Line d={`M8 128H${W - 8}`} t={0} dur={300} w={1} className="text-paper/35" />
        <Line d={`M8 70H${W - 8}`} t={200} dur={400} w={1} className="text-paper/25" />
        <Line d={plot(mem, 8, W - 8, 1)} t={500} dur={1400} w={2} className="text-paper" />
      </>
    );
  }
  // revenue
  const LEAKS = [70, 130, 190];
  return (
    <>
      <Line d={`M14 46H226`} t={0} dur={500} className="text-paper/35" />
      {LEAKS.map((x, i) => (
        <g key={x}>
          <path d={`M${x} 46V124`} strokeWidth={1} className="pl-lit text-paper/15" style={clock({ t: 400 + i * 150 })} />
          <Line d={`M${x - 6} 56H${x + 6}`} t={900 + i * 150} dur={120} w={2} className="text-signal" />
        </g>
      ))}
      <Line d={`M14 46H226`} t={1300} dur={700} w={2.5} className="text-signal" />
      <Node x={14} y={46} t={0} className="text-paper" />
      <Node x={226} y={46} s={10} t={2000} className="text-signal" />
    </>
  );
}

export function PackageGlyph({ pkg }: { pkg: EngagementKey }) {
  return (
    <Plate hold={2100} frameClassName="px-4 py-4">
      <Stage w={240} h={150}>
        <Svg w={240} h={150}>
          <GlyphPaths pkg={pkg} />
        </Svg>
      </Stage>
    </Plate>
  );
}
