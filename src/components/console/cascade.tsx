"use client";

import { useMemo, useRef, useState } from "react";
import { Console, useBox, useSim } from "@/components/console/console";
import { Chip, Controls, Figure } from "@/components/console/parts";
import { rng } from "@/lib/sim";

/*
  PR & Reputation: one story, followed for thirty days. Each square is a
  pickup, placed by the day it ran and the kind of place it ran in, joined
  to the one it cites. Placed as an exclusive with the research behind
  it, the first story is picked up, cited and asked about, and weeks
  later it is what search and AI answers quote. Sent to everyone as a
  release, it lands as copies on day one and stops. Point at a square to
  read it. Illustrative model, not a client's coverage.
*/

const DAYS = 30;
const TIERS = ["First story", "National press", "Trade press", "Newsletters", "Podcasts", "Social", "Forums", "Wire copies", "Search", "AI answers"] as const;
type Tier = (typeof TIERS)[number];
type Node = { id: number; tier: Tier; day: number; parent: number | null; size: number; what: string };

function cascade(kind: "exclusive" | "wire"): Node[] {
  const r = rng(kind === "exclusive" ? 61211 : 61331);
  const out: Node[] = [];
  const add = (tier: Tier, day: number, parent: number | null, size: number, what: string) => {
    out.push({ id: out.length, tier, day, parent, size, what });
    return out.length - 1;
  };
  if (kind === "exclusive") {
    const root = add("First story", 0.2, null, 10, "The exclusive, with the research behind it");
    const trade: number[] = [];
    for (let i = 0; i < 5; i++) trade.push(add("Trade press", 0.5 + r() * 2.2, root, 6, "Picks up the research, with its own angle"));
    const nat = add("National press", 2.5 + r() * 2, root, 8, "A follow-up, quoting the data");
    for (let i = 0; i < 7; i++) add("Newsletters", 1 + r() * 6, r() < 0.5 ? root : trade[Math.floor(r() * trade.length)], 4, "Links it as the example of the week");
    for (let i = 0; i < 3; i++) add("Podcasts", 7 + r() * 9, r() < 0.6 ? root : nat, 6, "Invites the founder to talk it through");
    for (let i = 0; i < 12; i++) add("Social", 0.3 + r() * 9, r() < 0.5 ? root : trade[Math.floor(r() * trade.length)], 3, "Shared, with the chart");
    for (let i = 0; i < 5; i++) add("Forums", 3 + r() * 14, r() < 0.5 ? nat : root, 4, "Cited in a thread as the source");
    const s1 = add("Search", 3 + r() * 3, root, 6, "Your page on the research ranks for the question");
    add("Search", 9 + r() * 5, nat, 5, "The follow-up ranks next to it");
    for (let i = 0; i < 4; i++) add("AI answers", 12 + r() * 17, r() < 0.5 ? s1 : root, 6, "An assistant quotes the research, with a link");
  } else {
    const root = add("First story", 0.2, null, 6, "The release, sent to everyone at once");
    for (let i = 0; i < 16; i++) add("Wire copies", 0.2 + r() * 1.2, root, 3, "Republished word for word on a news site");
    add("Trade press", 1 + r() * 2, root, 5, "A short item, from the release");
    for (let i = 0; i < 4; i++) add("Social", 0.3 + r() * 2.5, root, 3, "Shared once, by the team");
    add("Newsletters", 2 + r() * 3, root, 3, "A line in a round-up");
  }
  return out.sort((a, b) => a.day - b.day);
}

export function CascadeConsole() {
  const frame = useRef<HTMLElement>(null);
  const plot = useRef<HTMLDivElement>(null);
  const box = useBox(plot);
  const [kind, setKind] = useState<"exclusive" | "wire">("exclusive");
  const nodes = useMemo(() => cascade(kind), [kind]);
  const sim = useSim(frame, { end: DAYS, rate: 1.6, by: 1 });
  const [hot, setHot] = useState<number | null>(null);
  const day = sim.t;

  const W = box.w || 900;
  const H = box.h || 360;
  const P = { l: 116, r: 14, t: 10, b: 26 };
  const X = (d: number) => P.l + (d / DAYS) * (W - P.l - P.r);
  const row = (t: Tier) => TIERS.indexOf(t);
  const jitter = (n: Node) => (((n.id * 7919) % 97) / 97 - 0.5) * 0.56;
  const Y = (n: Node) => P.t + ((row(n.tier) + 0.5 + jitter(n)) / TIERS.length) * (H - P.t - P.b);
  const shown = nodes.filter((n) => n.day <= day);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const stories = shown.filter((n) => ["First story", "National press", "Trade press", "Podcasts"].includes(n.tier)).length;
  const copies = shown.filter((n) => n.tier === "Wire copies").length;
  const answers = shown.filter((n) => n.tier === "AI answers").length;
  const cites = shown.filter((n) => n.parent != null).length;
  const narrow = W < 560;
  const hn = hot != null ? byId.get(hot) ?? null : null;

  const lineage = new Set<number>();
  if (hn) {
    let p: Node | undefined = hn;
    while (p) {
      lineage.add(p.id);
      p = p.parent != null ? byId.get(p.parent) : undefined;
    }
    for (const n of nodes) if (n.parent === hn.id) lineage.add(n.id);
  }

  const switchTo = (k: "exclusive" | "wire") => {
    setKind(k);
    setHot(null);
    sim.reset();
  };

  return (
    <Console
      sim={sim}
      frameRef={frame}
      title="One story, thirty days"
      clock={`Day ${String(Math.min(DAYS, Math.floor(day))).padStart(2, "0")}`}
      label="A simulated month after one story: each square a pickup by the day it ran and where, joined to what it cites. Placed as an exclusive with research, it is picked up and later quoted by search and AI answers; sent as a release, it lands as copies and stops."
      stepLabel="Step one day"
      readout={
        kind === "exclusive"
          ? `Day ${Math.floor(day)}: ${stories} stories, ${cites} citations, ${answers} AI answers quoting it. What it said keeps being repeated after the news has moved on.`
          : `Day ${Math.floor(day)}: ${copies} copies of the release, ${stories} stories. Copies are not coverage: nobody cites them, and no answer quotes them.`
      }
      note="Illustrative model, not a client’s coverage. Which stories, for which outlets, and what each is asked to carry, is set from the Core Brief."
    >
      <Controls>
        <div role="group" aria-label="How the story goes out" className="flex gap-1.5">
          <Chip on={kind === "exclusive"} onClick={() => switchTo("exclusive")}>
            An exclusive, with research
          </Chip>
          <Chip on={kind === "wire"} onClick={() => switchTo("wire")}>
            A release to everyone
          </Chip>
        </div>
      </Controls>
      <div ref={plot} className="relative h-[380px] sm:h-[400px]">
        <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" fill="none">
          {TIERS.map((t, i) => (
            <line
              key={t}
              x1={P.l}
              x2={W - P.r}
              y1={P.t + ((i + 1) / TIERS.length) * (H - P.t - P.b)}
              y2={P.t + ((i + 1) / TIERS.length) * (H - P.t - P.b)}
              stroke="var(--color-paper)"
              strokeOpacity={0.07}
            />
          ))}
          {[0, 7, 14, 21, 28].map((d) => (
            <line key={d} x1={X(d)} x2={X(d)} y1={H - P.b} y2={H - P.b + 5} stroke="var(--color-paper)" strokeOpacity={0.35} />
          ))}
          <line x1={X(Math.min(day, DAYS))} x2={X(Math.min(day, DAYS))} y1={P.t} y2={H - P.b} stroke="var(--color-paper)" strokeOpacity={0.18} />
          {shown.map((n) => {
            if (n.parent == null) return null;
            const p = byId.get(n.parent)!;
            const x1 = X(p.day);
            const y1 = Y(p);
            const x2 = X(n.day);
            const y2 = Y(n);
            const mx = (x1 + x2) / 2;
            const lit = hn ? lineage.has(n.id) && lineage.has(p.id) : true;
            return (
              <path
                key={n.id}
                d={`M${x1} ${y1}C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`}
                stroke={n.tier === "AI answers" || n.tier === "Search" ? "var(--color-signal)" : "var(--color-paper)"}
                strokeOpacity={lit ? (hn ? 0.9 : 0.28) : 0.06}
              />
            );
          })}
          {shown.map((n) => (
            <rect
              key={n.id}
              x={X(n.day) - n.size / 2}
              y={Y(n) - n.size / 2}
              width={n.size}
              height={n.size}
              fill={n.tier === "AI answers" || n.tier === "Search" ? "var(--color-signal)" : n.tier === "Wire copies" ? "none" : "var(--color-paper)"}
              stroke={n.tier === "Wire copies" ? "var(--color-paper)" : "none"}
              strokeOpacity={0.6}
              opacity={hn && !lineage.has(n.id) ? 0.2 : 1}
            />
          ))}
          {shown.map((n) => (
            <rect
              key={`h${n.id}`}
              x={X(n.day) - 9}
              y={Y(n) - 9}
              width={18}
              height={18}
              fill="transparent"
              style={{ pointerEvents: "all", cursor: "crosshair" }}
              onPointerEnter={() => setHot(n.id)}
              onPointerLeave={() => setHot((h) => (h === n.id ? null : h))}
            />
          ))}
        </svg>
        {TIERS.map((t, i) => (
          <span
            key={t}
            aria-hidden
            className={`absolute left-3 w-[104px] -translate-y-1/2 truncate text-[13px] leading-none sm:left-4 ${t === "AI answers" || t === "Search" ? "text-signal" : "text-fog"}`}
            style={{ top: P.t + ((i + 0.5) / TIERS.length) * (H - P.t - P.b) }}
          >
            {t}
          </span>
        ))}
        {[0, 7, 14, 21, 28].map((d) => (
          <span key={d} aria-hidden className="absolute bottom-0 h-[22px] font-mono text-[13px] leading-[22px] text-fog" style={{ left: X(d) + 4 }}>
            {narrow ? `D${d}` : `Day ${d}`}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-paper/12 px-3 py-3 sm:px-4 lg:grid-cols-4">
        <Figure label="Stories" value={stories} />
        <Figure label="Citations" value={cites} />
        <Figure label="Copies of the release" value={copies} tone="fog" />
        <Figure label="AI answers quoting it" value={answers} tone={answers ? "signal" : "paper"} />
      </div>
      <p className="min-h-[44px] border-t border-paper/12 px-3 py-3 text-[14px] leading-[1.4] sm:px-4">
        {hn ? (
          <>
            <span className="text-fog">
              {hn.tier}, day {Math.max(0, Math.round(hn.day))}:{" "}
            </span>
            {hn.what}
            {hn.parent != null && <span className="text-fog"> · cites the {byId.get(hn.parent)!.tier.toLowerCase()}</span>}
          </>
        ) : (
          <span className="text-fog">Point at a square to read the pickup, and what it cites.</span>
        )}
      </p>
    </Console>
  );
}
