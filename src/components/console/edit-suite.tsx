"use client";

import { useMemo, useRef, useState } from "react";
import { Console, useBox, useSim } from "@/components/console/console";
import { Figure } from "@/components/console/parts";
import { rng } from "@/lib/sim";

/*
  Content Marketing: one conversation, cut. A 48-minute conversation with
  the person who knows the subject best is recorded once. As the playhead
  runs, each passage marked in the edit becomes a piece (the article, an
  answer page, clips, posts, the newsletter), and each piece takes its
  place in the four weeks after, on the surface it was cut for. Point at
  a passage or a piece to see where one came from. Illustrative edit.
*/

const LENGTH = 48; // minutes
const SURFACES = ["Search and answers", "Your newsletter", "Short-form", "Social", "Partners and press"] as const;
type Surface = (typeof SURFACES)[number];
type Cut = { from: number; to: number; piece: string; surface: Surface; week: number };

const CUTS: Cut[] = [
  { from: 1.5, to: 6.5, piece: "Clip, 0:41: the question everyone asks", surface: "Short-form", week: 1 },
  { from: 4, to: 17, piece: "Article, 1,800 words", surface: "Search and answers", week: 1 },
  { from: 9, to: 11.5, piece: "Quote card", surface: "Social", week: 1 },
  { from: 13, to: 15, piece: "Clip, 0:28: the number nobody shows", surface: "Short-form", week: 2 },
  { from: 15, to: 24, piece: "Answer page: why it costs what it costs", surface: "Search and answers", week: 2 },
  { from: 19, to: 22, piece: "Carousel, 7 frames", surface: "Social", week: 2 },
  { from: 21, to: 34, piece: "Newsletter, the long version", surface: "Your newsletter", week: 2 },
  { from: 26, to: 28.5, piece: "Clip, 0:33: what went wrong", surface: "Short-form", week: 3 },
  { from: 29, to: 36, piece: "Guest piece for a trade title", surface: "Partners and press", week: 3 },
  { from: 33, to: 35, piece: "Post: the chart", surface: "Social", week: 3 },
  { from: 37, to: 39.5, piece: "Clip, 0:38: the answer to the comment", surface: "Short-form", week: 4 },
  { from: 38, to: 46, piece: "Answer page: how to choose", surface: "Search and answers", week: 4 },
  { from: 42, to: 44, piece: "Clip, 0:24: one thing to do today", surface: "Short-form", week: 4 },
];

/** The recording's level, in 240 slices: a voice, with pauses between answers */
function waveform() {
  const r = rng(48113);
  const out: number[] = [];
  let v = 0.5;
  for (let i = 0; i < 240; i++) {
    v = Math.min(1, Math.max(0.08, v + (r() - 0.5) * 0.35));
    out.push(v * (Math.sin(i * 0.37) > 0.92 ? 0.15 : 1));
  }
  return out;
}

export function EditSuiteConsole() {
  const frame = useRef<HTMLElement>(null);
  const tl = useRef<HTMLDivElement>(null);
  const box = useBox(tl);
  const sim = useSim(frame, { end: LENGTH, rate: 2.6, by: 4 });
  const [hot, setHot] = useState<number | null>(null);
  const m = sim.t;
  const wave = useMemo(() => waveform(), []);
  const made = CUTS.map((c) => m >= c.to);
  const count = made.filter(Boolean).length;
  const W = box.w || 900;
  const X = (min: number) => (min / LENGTH) * W;
  const kinds = (pred: (c: Cut) => boolean) => CUTS.filter((c, i) => made[i] && pred(c)).length;

  return (
    <Console
      sim={sim}
      frameRef={frame}
      title="One conversation, cut"
      clock={`${String(Math.floor(m)).padStart(2, "0")}:${String(Math.floor((m % 1) * 60)).padStart(2, "0")} / ${LENGTH}:00`}
      label="A simulated edit: one 48-minute conversation, recorded once; each marked passage becomes a piece, and each piece is placed in the four weeks after on the surface it was cut for."
      stepLabel="Step four minutes"
      readout={
        count === CUTS.length
          ? `From one 48-minute conversation: an article, two answer pages, five clips, three posts, a newsletter and a guest piece, spread over four weeks. Nobody wrote anything twice.`
          : `${count} of ${CUTS.length} pieces cut so far. Each one is made for where it will be found, not resized from the last.`
      }
      note="An illustrative edit. In a real month the conversation, the cuts and the calendar come from the Core Brief and the questions the Surface Plan ranks."
    >
      <div className="border-b border-paper/12 px-3 pb-3 pt-3 sm:px-4">
        <div className="flex items-baseline justify-between text-[13px] text-fog">
          <span>The recording</span>
          <span className="font-mono">48 min</span>
        </div>
        <div ref={tl} className="relative mt-2 h-[132px]">
          {/* passages marked in the edit */}
          {CUTS.map((c, i) => {
            const row = i % 3;
            const lit = hot == null || hot === i;
            return (
              <button
                key={c.piece}
                type="button"
                onPointerEnter={() => setHot(i)}
                onPointerLeave={() => setHot((h) => (h === i ? null : h))}
                onFocus={() => setHot(i)}
                onBlur={() => setHot((h) => (h === i ? null : h))}
                aria-label={`${c.from} to ${c.to} minutes: ${c.piece}`}
                className={`absolute h-[18px] border text-left transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-paper ${
                  made[i] ? "border-paper/70 bg-paper/[0.12]" : "border-paper/25"
                } ${lit ? "" : "opacity-25"} ${hot === i ? "outline outline-1 outline-signal" : ""}`}
                style={{ left: X(c.from), width: Math.max(6, X(c.to) - X(c.from)), top: row * 22 }}
              >
                <span aria-hidden className={`absolute inset-y-0 left-0 w-[2px] ${made[i] ? "bg-signal" : "bg-paper/40"}`} />
              </button>
            );
          })}
          {/* the waveform */}
          <svg aria-hidden viewBox={`0 0 ${W} 60`} preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[60px] w-full">
            {wave.map((v, i) => {
              const x = (i / wave.length) * W;
              const played = (i / wave.length) * LENGTH <= m;
              return <rect key={i} x={x} y={30 - v * 26} width={Math.max(1, W / wave.length - 1.5)} height={v * 52} fill="var(--color-paper)" opacity={played ? 0.75 : 0.22} />;
            })}
          </svg>
          {/* the playhead */}
          <span aria-hidden className="absolute -top-1 bottom-0 w-px bg-signal" style={{ left: X(Math.min(m, LENGTH)) }} />
        </div>
        <div aria-hidden className="relative mt-1 h-4 font-mono text-[13px] leading-none text-fog">
          {[0, 12, 24, 36, 48].map((t) => (
            <span key={t} className={`absolute ${t === 48 ? "-translate-x-full" : t ? "-translate-x-1/2" : ""}`} style={{ left: X(t) }}>
              {t}:00
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">The pieces, by surface and week</caption>
          <thead>
            <tr className="text-[13px] text-fog">
              <th scope="col" className="w-[19%] border-b border-paper/12 px-3 py-2 font-normal sm:px-4">
                Surface
              </th>
              {[1, 2, 3, 4].map((w) => (
                <th key={w} scope="col" className="border-b border-l border-paper/12 px-3 py-2 font-normal">
                  Week {w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SURFACES.map((s) => (
              <tr key={s}>
                <th scope="row" className="border-b border-paper/10 px-3 py-2 align-top text-[13px] font-normal text-fog sm:px-4">
                  {s}
                </th>
                {[1, 2, 3, 4].map((w) => (
                  <td key={w} className="border-b border-l border-paper/10 px-2 py-1.5 align-top">
                    <ul className="flex flex-col gap-1">
                      {CUTS.map((c, i) =>
                        c.surface === s && c.week === w ? (
                          <li
                            key={c.piece}
                            onPointerEnter={() => setHot(i)}
                            onPointerLeave={() => setHot((h) => (h === i ? null : h))}
                            className={`border px-2 py-1 text-[13px] leading-[1.3] transition-opacity duration-300 ${
                              made[i] ? "border-paper/30 text-paper" : "border-transparent text-transparent"
                            } ${hot != null && hot !== i && made[i] ? "opacity-30" : ""} ${hot === i ? "border-signal" : ""}`}
                          >
                            {c.piece}
                          </li>
                        ) : null,
                      )}
                    </ul>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-paper/12 px-3 py-3 sm:px-4 lg:grid-cols-4">
        <Figure label="Pieces from one recording" value={`${count} of ${CUTS.length}`} />
        <Figure label="Clips" value={kinds((c) => c.piece.startsWith("Clip"))} />
        <Figure label="Answer pages and articles" value={kinds((c) => c.surface === "Search and answers")} />
        <Figure label="Recorded" value="Once" tone="signal" />
      </div>
    </Console>
  );
}
