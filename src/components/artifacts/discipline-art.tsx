import type { CSSProperties, JSX, ReactNode } from "react";
import { clock, curve, Label, Line, Node, Pulse, Stage, Svg } from "@/components/artifacts/kit";
import { Plate } from "@/components/artifacts/plate";
import s from "./artifacts.module.css";

/*
  The eight services' drawings: how each one works inside the system, as
  a mechanism rather than a picture of a screen.
  - Website Design: every surface sends people to one site, and the site
    turns them into the number.
  - Brand Identity: the same signal, in the same place, on every surface.
  - AI Search & SEO: the sources an assistant trusts, and the answer they
    make, with you in it.
  - Content Marketing: one story, cut for every place buyers look.
  - Paid Ads: spend moving, week by week, to what works.
  - PR & Reputation: a story's echo, from press out to search and AI.
  - Creative Direction: many drafts, one direction kept, carried into
    every format.
  - Martech & Consulting: sources that each report their own way, one
    Ledger, one number.
*/

const W = 720;

/* ---------- Website Design ---------- */

function WebsiteArt() {
  const H = 420;
  const SOURCES = ["Ads", "Search", "AI answers", "Press", "Creators"];
  const SY = (i: number) => 70 + i * 70;
  const NX = 150;
  const BOX = { x: 300, y: 90, w: 170, h: 240 };
  const PAGES = ["Home", "Product", "Proof", "Checkout"];
  const IN = { x: BOX.x, y: 210 };
  const OUT = { x: 640, y: 210 };
  return (
    <Stage w={W} h={H}>
      <Svg w={W} h={H}>
        {SOURCES.map((name, i) => (
          <Line key={name} d={curve(NX + 6, SY(i), IN.x, IN.y)} t={300 + i * 120} dur={700} w={1.25} className="text-paper/45" />
        ))}
        {SOURCES.map((name, i) => (
          <Node key={name} x={NX} y={SY(i)} t={i * 100} className="text-paper" />
        ))}
        <Line d={`M${BOX.x} ${BOX.y}h${BOX.w}v${BOX.h}h${-BOX.w}Z`} t={1200} dur={800} className="text-paper/70" />
        {PAGES.map((p, i) => (
          <Line key={p} d={`M${BOX.x + 18} ${BOX.y + 70 + i * 50}h${BOX.w - 36}`} t={1800 + i * 120} dur={300} w={1} className="text-paper/30" />
        ))}
        <Line d={`M${BOX.x + BOX.w} ${OUT.y}H${OUT.x - 8}`} t={2400} dur={500} w={2} className="text-signal" />
        <Node x={OUT.x} y={OUT.y} s={12} t={2900} className="text-signal" />
        {SOURCES.map((name, i) => (
          <Pulse key={name} d={curve(NX + 6, SY(i), IN.x, IN.y)} p={3000} pd={i * 600} w={2.5} />
        ))}
        <Pulse d={`M${BOX.x + BOX.w} ${OUT.y}H${OUT.x - 8}`} p={1500} pd={300} w={3} className="text-paper" />
      </Svg>
      {SOURCES.map((name, i) => (
        <Label key={name} w={W} h={H} x={NX - 14} y={SY(i)} ax="end" t={i * 100}>
          {name}
        </Label>
      ))}
      <Label w={W} h={H} x={BOX.x} y={BOX.y - 12} ay="bottom" t={1700} className="text-paper">
        Your site
      </Label>
      {PAGES.map((p, i) => (
        <Label key={p} w={W} h={H} x={BOX.x + 18} y={BOX.y + 64 + i * 50} ay="bottom" t={1800 + i * 120}>
          {p}
        </Label>
      ))}
      <Label w={W} h={H} x={OUT.x} y={OUT.y + 18} ax="center" ay="top" t={2900} className="text-paper">
        The number
      </Label>
    </Stage>
  );
}

/* ---------- Brand Identity ---------- */

function BrandArt() {
  const H = 420;
  const FRAMES = [
    { name: "Site", x: 24, y: 24, w: 270, h: 150 },
    { name: "Social", x: 314, y: 24, w: 150, h: 150 },
    { name: "Pack", x: 484, y: 24, w: 110, h: 168 },
    { name: "Deck", x: 24, y: 232, w: 210, h: 128 },
    { name: "Listing", x: 254, y: 232, w: 130, h: 150 },
    { name: "Ad", x: 404, y: 232, w: 292, h: 128 },
  ];
  const SIGNAL = 1900;
  return (
    <Stage w={W} h={H}>
      <Svg w={W} h={H}>
        {Array.from({ length: 6 }, (_, i) => 24 + i * 134.4).map((x, i) => (
          <Line key={x} d={`M${x} 8V${H - 8}`} t={i * 60} dur={500} w={1} className="text-paper/10" />
        ))}
        {FRAMES.map((f, i) => (
          <Line key={f.name} d={`M${f.x} ${f.y}h${f.w}v${f.h}h${-f.w}Z`} t={400 + i * 180} dur={520} w={1.25} className="text-paper/60" />
        ))}
        {FRAMES.map((f) => (
          <g key={f.name} className="pl-lit" style={clock({ t: SIGNAL })}>
            <rect x={f.x + 12} y={f.y + 12} width={12} height={12} fill="currentColor" stroke="none" className="text-signal" />
            <path d={`M${f.x + 12} ${f.y + 40}h${f.w * 0.55}M${f.x + 12} ${f.y + 52}h${f.w * 0.34}`} strokeWidth={3} className="text-paper/70" />
            <path d={`M${f.x + 12} ${f.y + f.h - 14}h${f.w - 24}`} strokeWidth={1} className="text-signal" />
          </g>
        ))}
      </Svg>
      {FRAMES.map((f, i) => (
        <Label key={f.name} w={W} h={H} x={f.x} y={f.y + f.h + 8} ay="top" t={400 + i * 180}>
          {f.name}
        </Label>
      ))}
    </Stage>
  );
}

/* ---------- AI Search & SEO ---------- */

function AnswerArt() {
  const H = 420;
  const Q = { x: 60, y: 210 };
  const BOX = { x: 250, y: 120, w: 200, h: 180 };
  const SOURCES = ["Your site", "Reviews", "Press", "Directories", "Forums"];
  const SY = (i: number) => 60 + i * 75;
  const SX = 640;
  const SLOTS = [160, 210, 260];
  return (
    <Stage w={W} h={H}>
      <Svg w={W} h={H}>
        <Line d={`M${Q.x + 8} ${Q.y}H${BOX.x}`} t={200} dur={500} className="text-paper/60" />
        <Line d={`M${BOX.x} ${BOX.y}h${BOX.w}v${BOX.h}h${-BOX.w}Z`} t={600} dur={700} className="text-paper/70" />
        {SOURCES.map((name, i) => (
          <Line key={name} d={curve(SX - 8, SY(i), BOX.x + BOX.w, BOX.y + BOX.h / 2)} t={1300 + i * 140} dur={700} w={1.25} className="text-paper/40" />
        ))}
        {SOURCES.map((name, i) => (
          <Node key={name} x={SX} y={SY(i)} t={1100 + i * 100} className="text-paper" />
        ))}
        {SLOTS.map((y, i) => (
          <g key={y} className="pl-lit" style={clock({ t: 2300 + i * 120 })}>
            <rect x={BOX.x + 20} y={y - 4} width={8} height={8} fill="currentColor" stroke="none" className={i === 0 ? "text-signal" : "text-paper/45"} />
            <path d={`M${BOX.x + 40} ${y}h${i === 0 ? 120 : 100 - i * 14}`} strokeWidth={i === 0 ? 3 : 2} className={i === 0 ? "text-signal" : "text-paper/30"} />
          </g>
        ))}
        <Node x={Q.x} y={Q.y} s={10} t={0} className="text-paper" />
        {SOURCES.map((name, i) => (
          <Pulse key={name} d={curve(SX - 8, SY(i), BOX.x + BOX.w, BOX.y + BOX.h / 2)} p={3200} pd={i * 640} w={2.5} />
        ))}
      </Svg>
      <Label w={W} h={H} x={Q.x} y={Q.y - 16} ax="center" ay="bottom" t={0} className="text-paper" max="6.5rem">
        A buyer’s question
      </Label>
      <Label w={W} h={H} x={BOX.x} y={BOX.y - 12} ay="bottom" t={1100} className="text-paper">
        The answer
      </Label>
      <Label w={W} h={H} x={BOX.x} y={BOX.y + BOX.h + 12} ay="top" t={2800} className="text-signal">
        You, named first
      </Label>
      {SOURCES.map((name, i) => (
        <Label key={name} w={W} h={H} x={SX} y={SY(i) - 12} ax="center" ay="bottom" t={1100 + i * 100}>
          {name}
        </Label>
      ))}
    </Stage>
  );
}

/* ---------- Content Marketing ---------- */

function ContentArt() {
  const H = 420;
  const STORY = { x: 64, y: 210 };
  const CUTS = ["Article", "Film", "Short clips", "Posts", "Newsletter", "Creator kit"];
  const CY = (i: number) => 50 + i * 64;
  const CX = 300;
  const BRACKET = 640;
  return (
    <Stage w={W} h={H}>
      <Svg w={W} h={H}>
        {CUTS.map((c, i) => (
          <Line key={c} d={curve(STORY.x + 8, STORY.y, CX - 6, CY(i))} t={200 + i * 140} dur={700} w={1.25} className="text-paper/45" />
        ))}
        {CUTS.map((c, i) => (
          <Node key={c} x={CX} y={CY(i)} t={900 + i * 140} className="text-paper" />
        ))}
        {CUTS.map((c, i) => (
          <Line key={c} d={`M490 ${CY(i)}H${BRACKET - 8}`} t={1700 + i * 90} dur={500} w={1} className="text-paper/30" />
        ))}
        <Line d={`M${BRACKET} ${CY(0)}V${CY(5)}`} t={2300} dur={500} w={2} className="text-signal" />
        <Node x={STORY.x} y={STORY.y} s={12} t={0} className="text-signal" />
        {CUTS.map((c, i) => (
          <Pulse key={c} d={curve(STORY.x + 8, STORY.y, CX - 6, CY(i))} p={2800} pd={i * 460} w={2.5} />
        ))}
        {CUTS.map((c, i) => (
          <Pulse key={`o${c}`} d={`M490 ${CY(i)}H${BRACKET - 8}`} p={2800} pd={1400 + i * 460} w={2.5} className="text-paper" />
        ))}
      </Svg>
      <Label w={W} h={H} x={STORY.x} y={STORY.y + 18} ax="center" ay="top" t={0} className="text-paper" max="5rem">
        One story
      </Label>
      {CUTS.map((c, i) => (
        <Label key={c} w={W} h={H} x={CX + 16} y={CY(i)} t={900 + i * 140}>
          {c}
        </Label>
      ))}
      <Label w={W} h={H} x={W - 4} y={CY(0) - 24} ax="end" ay="bottom" t={2700} className="text-paper">
        Where buyers look
      </Label>
    </Stage>
  );
}

/* ---------- Paid Ads ---------- */

function PaidArt() {
  const H = 380;
  const X0 = 150;
  const MAX = 520;
  const ROWS = [
    { name: "Search", w: [0.4, 0.46, 0.55, 0.62, 0.68, 0.72] },
    { name: "Social", w: [0.4, 0.48, 0.58, 0.67, 0.75, 0.8] },
    { name: "Video", w: [0.4, 0.33, 0.26, 0.2, 0.16, 0.14] },
    { name: "Creators", w: [0.4, 0.44, 0.5, 0.54, 0.58, 0.6] },
    { name: "Retargeting", w: [0.4, 0.31, 0.22, 0.16, 0.12, 0.1] },
  ];
  const RY = (i: number) => 92 + i * 56;
  const WEEKS = 6;
  const WX = (k: number) => X0 + (k * MAX) / (WEEKS - 1);
  return (
    <Stage w={W} h={H}>
      <Svg w={W} h={H}>
        <Line d={`M${X0} 40H${X0 + MAX}`} t={0} dur={500} w={1} className="text-paper/30" />
        {Array.from({ length: WEEKS }, (_, k) => (
          <path key={k} d={`M${WX(k)} 34v12`} strokeWidth={1.5} className="pl-lit text-paper/50" style={clock({ t: 200 + k * 60 })} />
        ))}
        <rect x={WX(0) - 5} y={35} width={10} height={10} fill="currentColor" stroke="none" className={`${s.week} text-signal`} style={{ ...clock({ t: 900, d: 4000 }), "--to": `${MAX}px` } as CSSProperties} />
        <Line d={`M${X0} 60V${H - 24}`} t={300} dur={500} w={1} className="text-paper/30" />
        {ROWS.map((r, i) => (
          <rect
            key={r.name}
            x={X0}
            y={RY(i) - 9}
            width={MAX}
            height={18}
            fill="currentColor"
            stroke="none"
            className={`${s.bar} ${i === 1 || i === 0 ? "text-paper" : "text-paper/40"}`}
            style={
              {
                ...clock({ t: 500 + i * 80, d: 4400 }),
                "--w1": r.w[0],
                "--w2": r.w[1],
                "--w3": r.w[2],
                "--w4": r.w[3],
                "--w5": r.w[4],
                "--w6": r.w[5],
              } as CSSProperties
            }
          />
        ))}
      </Svg>
      <Label w={W} h={H} x={24} y={40} t={200}>
        Week
      </Label>
      {Array.from({ length: WEEKS }, (_, k) => (
        <Label key={k} w={W} h={H} x={WX(k)} y={22} ax="center" ay="bottom" t={200 + k * 60}>
          {k + 1}
        </Label>
      ))}
      {ROWS.map((r, i) => (
        <Label key={r.name} w={W} h={H} x={X0 - 14} y={RY(i)} ax="end" t={500 + i * 80} className="text-paper">
          {r.name}
        </Label>
      ))}
    </Stage>
  );
}

/* ---------- PR & Reputation ---------- */

function EchoArt() {
  const H = 420;
  const C = { x: 360, y: 210 };
  const ORBITS = [
    { rx: 130, ry: 80, t: 900 },
    { rx: 240, ry: 140, t: 1500 },
    { rx: 340, ry: 195, t: 2100 },
  ];
  const at = (o: number, deg: number) => {
    const a = (deg * Math.PI) / 180;
    return { x: C.x + ORBITS[o].rx * Math.cos(a), y: C.y + ORBITS[o].ry * Math.sin(a) };
  };
  const OUTLETS = [
    { name: "Press", o: 0, deg: 200, ay: "bottom" as const },
    { name: "Podcasts", o: 0, deg: 340, ay: "bottom" as const },
    { name: "Reviews", o: 1, deg: 150, ay: "top" as const },
    { name: "Creators", o: 1, deg: 30, ay: "top" as const },
    { name: "Search", o: 2, deg: 212, ay: "bottom" as const },
    { name: "AI answers", o: 2, deg: 328, ay: "bottom" as const },
  ];
  return (
    <Stage w={W} h={H}>
      <Svg w={W} h={H}>
        {ORBITS.map((o, i) => (
          <ellipse key={i} cx={C.x} cy={C.y} rx={o.rx} ry={o.ry} pathLength={1} strokeWidth={1} className="pl-stroke text-paper/15" style={clock({ t: i * 260, d: 900 })} />
        ))}
        {[0, 1, 2].map((k) => (
          <ellipse key={k} cx={C.x} cy={C.y} rx={360} ry={206} strokeWidth={1.5} className="pl-ping text-signal" style={clock({ p: 3600, pd: k * 1200 })} />
        ))}
        {OUTLETS.map((n) => {
          const p = at(n.o, n.deg);
          return <Node key={n.name} x={p.x} y={p.y} t={ORBITS[n.o].t} className={n.o === 2 ? "text-signal" : "text-paper"} />;
        })}
        <Node x={C.x} y={C.y} s={14} t={0} className="text-signal" />
      </Svg>
      <Label w={W} h={H} x={C.x} y={C.y + 20} ax="center" ay="top" t={100} className="text-paper">
        One story
      </Label>
      {OUTLETS.map((n) => {
        const p = at(n.o, n.deg);
        return (
          <Label key={n.name} w={W} h={H} x={p.x} y={n.ay === "bottom" ? p.y - 12 : p.y + 12} ax="center" ay={n.ay} t={ORBITS[n.o].t} className={n.o === 2 ? "text-paper" : "text-fog"}>
            {n.name}
          </Label>
        );
      })}
    </Stage>
  );
}

/* ---------- Creative Direction ---------- */

function DirectionArt() {
  const H = 400;
  const COLS = 4;
  const ROWS = 3;
  const FW = 112;
  const FH = 82;
  const GAP = 16;
  const X0 = 24;
  const Y0 = 50;
  const KEPT = 11; // bottom row, last column
  const fx = (i: number) => X0 + (i % COLS) * (FW + GAP);
  const fy = (i: number) => Y0 + Math.floor(i / COLS) * (FH + GAP);
  // each draft's own composition: where its mark sits and how long its lines run
  const mark = (i: number) => ({ mx: [0.1, 0.6, 0.35, 0.75, 0.2, 0.5, 0.65, 0.1, 0.4, 0.7, 0.15, 0.55][i], my: [0.15, 0.55, 0.3, 0.2, 0.6, 0.15, 0.45, 0.15, 0.65, 0.35, 0.4, 0.6][i] });
  const FORMATS = ["Film", "Site", "Ads", "Pack"];
  const FY = (i: number) => 74 + i * 84;
  const KX = fx(KEPT) + FW;
  const KY = fy(KEPT) + FH / 2;
  const GRID_W = COLS * FW + (COLS - 1) * GAP;
  return (
    <Stage w={W} h={H}>
      <Svg w={W} h={H}>
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const m = mark(i);
          const kept = i === KEPT;
          return (
            <g key={i} className={kept ? "" : s.draft} style={clock({ t: 1700 })}>
              <Line d={`M${fx(i)} ${fy(i)}h${FW}v${FH}h${-FW}Z`} t={i * 70} dur={420} w={kept ? 2 : 1.25} className={kept ? "text-signal" : "text-paper/60"} />
              <rect x={fx(i) + m.mx * (FW - 18)} y={fy(i) + m.my * (FH - 30)} width={12} height={12} fill="currentColor" stroke="none" className={`pl-lit ${kept ? "text-signal" : "text-paper/50"}`} style={clock({ t: 300 + i * 70 })} />
              <path d={`M${fx(i) + 10} ${fy(i) + FH - 16}h${FW * (0.3 + ((i * 37) % 50) / 100)}`} strokeWidth={2} className="pl-lit text-paper/40" style={clock({ t: 300 + i * 70 })} />
            </g>
          );
        })}
        <rect x={X0} y={Y0 - 14} width={2} height={ROWS * FH + (ROWS - 1) * GAP + 28} fill="currentColor" stroke="none" className={`${s.scan} text-signal`} style={{ ...clock({ p: 5200 }), "--to": `${GRID_W}px` } as CSSProperties} />
        {FORMATS.map((f, i) => (
          <Line key={f} d={curve(KX, KY, 632, FY(i))} t={2000 + i * 140} dur={600} w={1.25} className="text-paper/60" />
        ))}
        {FORMATS.map((f, i) => (
          <Node key={f} x={640} y={FY(i)} t={2600 + i * 120} className="text-paper" />
        ))}
      </Svg>
      {FORMATS.map((f, i) => (
        <Label key={f} w={W} h={H} x={656} y={FY(i)} t={2600 + i * 120} className="text-paper">
          {f}
        </Label>
      ))}
      <Label w={W} h={H} x={X0} y={Y0 - 22} ay="bottom" t={0}>
        Directions drafted
      </Label>
      <Label w={W} h={H} x={fx(KEPT) + FW} y={fy(KEPT) + FH + 8} ax="end" ay="top" t={1900} className="text-signal">
        The one kept
      </Label>
    </Stage>
  );
}

/* ---------- Martech & Consulting ---------- */

function WiringArt() {
  const H = 400;
  const SOURCES = ["Site", "Store", "Ads", "Email", "Reviews"];
  const SY = (i: number) => 60 + i * 70;
  const NX = 110;
  const GATE = { x: 300, y: 44, w: 150, h: 326 };
  const OUT = { x: 640, y: 200 };
  // each source reports at its own irregular pace; the Ledger's output is steady
  const PACES = [2300, 3700, 1900, 3100, 2700];
  return (
    <Stage w={W} h={H}>
      <Svg w={W} h={H}>
        {SOURCES.map((name, i) => (
          <Line key={name} d={`M${NX + 6} ${SY(i)}H${GATE.x}`} t={300 + i * 110} dur={500} w={1.25} className="text-paper/45" />
        ))}
        {SOURCES.map((name, i) => (
          <Node key={name} x={NX} y={SY(i)} t={i * 90} className="text-paper" />
        ))}
        <Line d={`M${GATE.x} ${GATE.y}h${GATE.w}v${GATE.h}h${-GATE.w}Z`} t={900} dur={800} className="text-paper/70" />
        {SOURCES.map((name, i) => (
          <Line key={name} d={`M${GATE.x} ${SY(i)}H${GATE.x + 60}V${OUT.y}`} t={1600 + i * 100} dur={500} w={1} className="text-paper/30" />
        ))}
        <Line d={`M${GATE.x + 60} ${OUT.y}H${OUT.x - 8}`} t={2200} dur={700} w={2.5} className="text-signal" />
        <Node x={OUT.x} y={OUT.y} s={12} t={2900} className="text-signal" />
        {SOURCES.map((name, i) => (
          <Pulse key={name} d={`M${NX + 6} ${SY(i)}H${GATE.x}`} p={PACES[i]} pd={i * 370} w={2.5} className="text-paper" />
        ))}
        <Pulse d={`M${GATE.x + 60} ${OUT.y}H${OUT.x - 8}`} p={1200} w={3} />
      </Svg>
      {SOURCES.map((name, i) => (
        <Label key={name} w={W} h={H} x={NX - 14} y={SY(i)} ax="end" t={i * 90}>
          {name}
        </Label>
      ))}
      <Label w={W} h={H} x={GATE.x + GATE.w / 2} y={GATE.y - 12} ax="center" ay="bottom" t={1500} className="text-paper">
        The Ledger
      </Label>
      <Label w={W} h={H} x={OUT.x} y={OUT.y + 18} ax="center" ay="top" t={2900} className="text-paper">
        One number
      </Label>
    </Stage>
  );
}

type Art = { draw: () => JSX.Element; hold: number; loop: boolean; label: string };

const ART: Record<string, Art> = {
  "website-design": {
    draw: WebsiteArt,
    hold: 3000,
    loop: true,
    label: "A diagram: ads, search, AI answers, press and creators all send people to your site, which takes them from home to product, proof and checkout, and on to the one number.",
  },
  "brand-identity": {
    draw: BrandArt,
    hold: 2100,
    loop: false,
    label: "A diagram of six surfaces (site, social, pack, deck, listing and ad), each carrying the same signal in the same place, on one grid.",
  },
  "aeo-seo": {
    draw: AnswerArt,
    hold: 3000,
    loop: true,
    label: "A diagram: a buyer's question goes to an assistant, whose answer is built from your site, reviews, press, directories and forums; the answer names you first.",
  },
  "content-marketing": {
    draw: ContentArt,
    hold: 2800,
    loop: true,
    label: "A diagram: one story is cut into an article, a film, short clips, posts, a newsletter and a creator kit, each carried to where buyers look.",
  },
  "paid-ads": {
    draw: PaidArt,
    hold: 4900,
    loop: false,
    label: "A chart of spend across search, social, video, creators and retargeting over six weeks: it starts even and moves, week by week, toward what works.",
  },
  "pr-reputation": {
    draw: EchoArt,
    hold: 2300,
    loop: true,
    label: "A diagram: one story at the center echoes out, first to press and podcasts, then to reviews and creators, and last to search and AI answers.",
  },
  "creative-direction": {
    draw: DirectionArt,
    hold: 3100,
    loop: true,
    label: "A diagram: twelve drafted directions, one kept, carried into film, the site, ads and the pack.",
  },
  "martech-consulting": {
    draw: WiringArt,
    hold: 3000,
    loop: true,
    label: "A diagram: your site, store, ads, email and reviews each report their own way into the Ledger, which puts out one number.",
  },
};

export function DisciplineArt({ slug, caption }: { slug: string; caption?: ReactNode }) {
  const art = ART[slug];
  if (!art) return null;
  const Draw = art.draw;
  return (
    <Plate label={art.label} hold={art.hold} loop={art.loop} layout="side" caption={caption} frameClassName={`px-5 pt-6 sm:px-8 sm:pt-8 lg:px-10 lg:pt-10 ${art.loop ? "pb-14" : "pb-6 sm:pb-8 lg:pb-10"}`}>
      <Draw />
    </Plate>
  );
}
