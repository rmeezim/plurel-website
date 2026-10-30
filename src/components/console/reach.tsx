"use client";

import { useMemo, useRef, useState } from "react";
import { Console, useBox, useSim } from "@/components/console/console";
import { dayClock, fmt } from "@/lib/sim";
import { CUTS, HI, LO, reachQuarter, RULES, SPAN, STATUS_RULE, statusAt, THRESHOLDS, WEEKS, type Cut, type RuleKey, type Status } from "@/lib/sims/reach";

/*
  Reach: the amplification rules, run on a simulated quarter
  (lib/sims/reach.ts). The chart follows each week's cuts against the
  usual post on a log scale, the thresholds drawn where the rules act;
  the ladder beside it lights as a rule fires and filters the chart to
  the cuts it acted on; the log keeps what fired, newest first; the strip
  under it keeps the quarter, week by week, so the floor can be seen
  rising. Point at a trace (or pick a cut) to read it.
*/

const PAD = { l: 50, r: 16, t: 14, b: 30 };
const lnLo = Math.log(LO);
const lnHi = Math.log(HI);

const ACTION: Record<RuleKey, string> = {
  retire: "Retired",
  keep: "Kept running",
  paid: "Paid behind it",
  double: "Budget doubled, creators briefed",
  press: "Press briefed, page ready",
};
const STATE: Record<Status, string> = {
  running: "Running, no money behind it",
  kept: "Kept running",
  retired: "Retired",
  paid: "Paid behind it",
  doubled: "Budget doubled",
  press: "Press briefed",
};

const x1 = (v: number) => `${v < 10 ? fmt(v, 1) : fmt(v)}×`;

export function ReachConsole() {
  const frame = useRef<HTMLElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const box = useBox(plotRef);
  const quarter = useMemo(() => reachQuarter(), []);
  const END = WEEKS * SPAN;
  const sim = useSim(frame, { end: END, rate: 18, by: 24, settled: END });
  const [pick, setPick] = useState<string | null>(null);
  const [rule, setRule] = useState<RuleKey | null>(null);
  const [cross, setCross] = useState<number | null>(null);

  const wk = Math.min(WEEKS - 1, Math.floor(sim.t / SPAN));
  const h = Math.min(SPAN, sim.t - wk * SPAN);
  const batch = quarter[wk];
  const W = box.w || 1000;
  const H = box.h || 420;
  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const X = (hour: number) => PAD.l + (hour / SPAN) * iw;
  const Y = (v: number) => PAD.t + (1 - (Math.log(v) - lnLo) / (lnHi - lnLo)) * ih;
  const narrow = W < 560;

  const hr = Math.floor(h);
  const traces = useMemo(
    () =>
      batch.cuts.map((c) => {
        const to = hr;
        let d = "";
        for (let k = c.posted; k <= to; k++) d += `${k === c.posted ? "M" : "L"}${X(k).toFixed(1)} ${Y(c.obs[k]).toFixed(1)}`;
        return { c, d, status: statusAt(c, to), last: to >= c.posted ? c.obs[to] : Number.NaN };
      }),
    // X and Y are drawn from W and H
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [batch, hr, W, H],
  );

  const fired = batch.events.filter((e) => e.at <= h);
  const counts: Record<RuleKey, number> = { retire: 0, keep: 0, paid: 0, double: 0, press: 0 };
  for (const e of fired) counts[e.rule]++;
  const recent = new Set(fired.filter((e) => h - e.at < 10).map((e) => e.rule));
  const out = batch.cuts.filter((c) => c.posted <= h).length;
  const sel = pick ? batch.cuts.find((c) => c.id === pick) ?? null : null;

  const tone = (status: Status, c: Cut) => {
    const dim = (sel && sel.id !== c.id) || (rule && STATUS_RULE[status] !== rule && !(rule === "paid" && (status === "doubled" || status === "press")));
    const base =
      status === "paid" || status === "doubled" || status === "press"
        ? { s: "var(--color-signal)", o: 1, w: status === "paid" ? 1.5 : 2.25 }
        : status === "retired"
          ? { s: "var(--color-paper)", o: 0.16, w: 1 }
          : status === "kept"
            ? { s: "var(--color-paper)", o: 0.42, w: 1 }
            : { s: "var(--color-paper)", o: 0.62, w: 1 };
    if (sel?.id === c.id) return { s: base.s === "var(--color-signal)" ? base.s : "var(--color-paper)", o: 1, w: 2.25 };
    return dim ? { ...base, o: base.o * 0.18 } : base;
  };

  // the quarter so far: each finished week's median and best cut
  const quarterDone = quarter.slice(0, wk + (h >= SPAN ? 1 : 0));
  const readout = (() => {
    if (sim.ended) {
      const all = quarter.flatMap((b) => b.cuts);
      const paid = all.filter((c) => c.paidAt != null).length;
      const dbl = all.filter((c) => c.doubledAt != null).length;
      const press = all.filter((c) => c.pressAt != null).length;
      return `Thirteen weeks, ${all.length} cuts: ${paid} with paid behind them, ${dbl} doubled, ${press} briefed to press. The median cut went from ${x1(quarter[0].median)} to ${x1(quarter[WEEKS - 1].median)} your usual post as each brief kept what the last one taught.`;
    }
    if (h >= SPAN) {
      const end = batch.cuts.map((c) => statusAt(c, SPAN));
      const n = (s: Status[]) => end.filter((x) => s.includes(x)).length;
      return `Week ${wk + 1}: ${CUTS} cuts. ${n(["retired"])} retired, ${n(["kept"])} kept running, ${n(["paid", "doubled", "press"])} with paid behind them${n(["doubled", "press"]) ? `, ${n(["doubled", "press"])} doubled` : ""}.`;
    }
    const hot = batch.cuts.filter((c) => c.paidAt != null && c.paidAt <= h).length;
    return `Week ${wk + 1}, day ${Math.floor(h / 24) + 1}: ${out === CUTS ? `all ${CUTS}` : `${out} of ${CUTS}`} cuts out. ${hot ? `${hot} passed 2× within 48 hours, and paid went behind ${hot === 1 ? "it" : "them"} the same day.` : "None has passed 2× yet, so no money is behind any of them."}`;
  })();

  return (
    <Console
      sim={sim}
      frameRef={frame}
      title="Amplification rules"
      clock={
        <>
          <span className="sm:hidden">{`W${String(wk + 1).padStart(2, "0")} · ${dayClock(Math.min(h, SPAN - 1)).replace("Day ", "D")}`}</span>
          <span className="max-sm:hidden">{`Week ${String(wk + 1).padStart(2, "0")} · ${dayClock(Math.min(h, SPAN - 1))}`}</span>
        </>
      }
      label="A simulated quarter of the Reach engagement: each week sixteen cuts of one idea go out and are followed for seven days against the usual post, and the amplification rules decide which are retired, kept, put behind paid, doubled or briefed to press."
      stepLabel="Step one day"
      readout={readout}
      note="Simulation with illustrative numbers, not a client’s results. The usual post is the median of an account’s last 30, by how many watch to the end; the thresholds are set per account in the Diagnostic."
    >
      <div className="grid lg:grid-cols-12">
        <div className="relative border-paper/12 lg:col-span-8 lg:border-r">
          <div
            ref={plotRef}
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - r.left;
              setCross(x >= PAD.l && x <= r.width - PAD.r ? x : null);
            }}
            onPointerLeave={() => setCross(null)}
            className="relative aspect-square w-full sm:aspect-[16/10] lg:aspect-auto lg:h-[440px]"
          >
            <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" fill="none" strokeLinecap="square">
              {[0.25, 0.5, 1, 2, 5, 10, 20].map((v) => (
                <line key={v} x1={PAD.l - 6} x2={PAD.l} y1={Y(v)} y2={Y(v)} stroke="var(--color-paper)" strokeOpacity={0.35} />
              ))}
              {THRESHOLDS.map((v) => (
                <line key={v} x1={PAD.l} x2={W - PAD.r} y1={Y(v)} y2={Y(v)} stroke="var(--color-paper)" strokeOpacity={v === 1 ? 0.3 : 0.12} />
              ))}
              {Array.from({ length: SPAN / 24 + 1 }, (_, d) => (
                <line key={d} x1={X(d * 24)} x2={X(d * 24)} y1={H - PAD.b} y2={H - PAD.b + 5} stroke="var(--color-paper)" strokeOpacity={0.35} />
              ))}
              <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke="var(--color-paper)" strokeOpacity={0.25} />
              {h < SPAN && (
                <line x1={X(h)} x2={X(h)} y1={PAD.t} y2={H - PAD.b} stroke="var(--color-paper)" strokeOpacity={0.22} />
              )}
              {cross != null && <line x1={cross} x2={cross} y1={PAD.t} y2={H - PAD.b} stroke="var(--color-signal)" strokeOpacity={0.7} />}
              {traces.map(({ c, d, status }) => {
                const st = tone(status, c);
                return <path key={c.id} d={d} stroke={st.s} strokeOpacity={st.o} strokeWidth={st.w} strokeLinejoin="round" />;
              })}
              {fired
                .filter((e) => e.rule === "paid" || e.rule === "double" || e.rule === "press")
                .map((e) => {
                  const c = batch.cuts.find((k) => k.id === e.cut)!;
                  const dim = (sel && sel.id !== c.id) || (rule && rule !== e.rule);
                  const s = e.rule === "paid" ? 5 : 7;
                  return (
                    <rect
                      key={e.cut + e.rule}
                      x={X(e.at) - s / 2}
                      y={Y(c.obs[e.at]) - s / 2}
                      width={s}
                      height={s}
                      fill={e.rule === "press" ? "var(--color-paper)" : "var(--color-signal)"}
                      opacity={dim ? 0.2 : 1}
                    />
                  );
                })}
              {traces.map(({ c, status, last }) =>
                Number.isNaN(last) || h >= SPAN || status === "retired" ? null : (
                  <rect key={c.id} x={X(Math.floor(h)) - 2} y={Y(last) - 2} width={4} height={4} fill={tone(status, c).s} opacity={tone(status, c).o} />
                ),
              )}
              {traces.map(({ c, d }) => (
                <path
                  key={c.id}
                  d={d}
                  stroke="transparent"
                  strokeWidth={12}
                  className="cursor-crosshair"
                  style={{ pointerEvents: "stroke" }}
                  onPointerEnter={() => setPick(c.id)}
                  onPointerLeave={() => setPick((p) => (p === c.id ? null : p))}
                  onClick={() => setPick(c.id)}
                />
              ))}
            </svg>
            {[0.25, 1, 5, 20].concat(narrow ? [] : [0.5, 2, 10]).map((v) => (
              <span key={v} aria-hidden className="absolute left-0 w-[42px] -translate-y-1/2 text-right font-mono text-[13px] leading-none text-fog" style={{ top: Y(v) }}>
                {`${v}×`}
              </span>
            ))}
            {cross != null && (
              <span
                aria-hidden
                className="pointer-events-none absolute top-0 -translate-x-1/2 bg-graphite px-1 font-mono text-[13px] leading-[18px] text-signal"
                style={{ left: cross }}
              >
                {dayClock(((cross - PAD.l) / iw) * SPAN).replace(" · ", " ")}
              </span>
            )}
            {!narrow &&
              ([
                [1, "Your usual post"],
                [2, "Paid goes behind it"],
                [5, "Budget doubles"],
                [10, "Press is briefed"],
              ] as const).map(([v, t]) => (
                <span key={v} aria-hidden className="absolute right-4 -translate-y-full pb-1 text-[13px] leading-none text-fog" style={{ top: Y(v) }}>
                  {t}
                </span>
              ))}
            {Array.from({ length: SPAN / 24 }, (_, d) =>
              narrow && d % 2 ? null : (
                <span
                  key={d}
                  aria-hidden
                  className="absolute bottom-0 h-[24px] font-mono text-[13px] leading-[24px] text-fog"
                  style={{ left: X(d * 24) + 4 }}
                >
                  {narrow ? `D${d + 1}` : `Day ${d + 1}`}
                </span>
              ),
            )}
          </div>

          <QuarterStrip quarter={quarter} done={quarterDone.length} current={wk} />
        </div>

        <div className="flex flex-col border-t border-paper/12 lg:col-span-4 lg:border-t-0">
          <Inspector cut={sel} h={h} batch={batch.cuts} onPick={setPick} />
          <ol className="border-t border-paper/12" aria-label="The amplification rules">
            {RULES.map((r) => {
              const on = rule === r.key;
              return (
                <li key={r.key} className="border-b border-paper/10 last:border-b-0">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setRule(on ? null : r.key)}
                    className={`grid w-full grid-cols-[10px_1fr_auto] items-start gap-x-3 px-3 py-2.5 text-left transition-colors sm:px-4 ${on ? "bg-paper/[0.07]" : "hover:bg-paper/[0.04]"}`}
                  >
                    <span aria-hidden className={`mt-[5px] size-[7px] transition-colors duration-300 ${recent.has(r.key) ? "bg-signal" : "bg-paper/20"}`} />
                    <span>
                      <span className="block font-mono text-[13px] leading-[1.35] text-paper">{r.when}</span>
                      <span className="mt-1 block text-[14px] leading-[1.4] text-fog">{r.then}</span>
                    </span>
                    <span className="font-mono text-[13px] leading-[1.35] tabular-nums text-paper">{counts[r.key]}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mt-auto border-t border-paper/12 px-3 py-3 sm:px-4">
            <p className="text-[13px] text-fog">What fired, newest first</p>
            <ol className="mt-2 space-y-1.5 font-mono text-[13px] leading-[1.35]">
              {fired.length === 0 && <li className="text-fog">Nothing yet this week.</li>}
              {fired
                .slice(-4)
                .reverse()
                .map((e) => (
                  <li key={e.cut + e.rule} className="grid grid-cols-[auto_auto_1fr] gap-x-3 text-paper/90">
                    <span className="text-fog">{dayClock(e.at).replace("Day ", "D").replace(" · ", " ")}</span>
                    <span>{e.cut.replace("Cut ", "C")}</span>
                    <span className="truncate font-sans text-[14px] text-paper">
                      {x1(e.x)} · {ACTION[e.rule]}
                    </span>
                  </li>
                ))}
            </ol>
          </div>
        </div>
      </div>
    </Console>
  );
}

function Inspector({ cut, h, batch, onPick }: { cut: Cut | null; h: number; batch: Cut[]; onPick: (id: string | null) => void }) {
  const live = batch.filter((c) => c.posted <= h);
  return (
    <div className="min-h-[148px] px-3 py-3 sm:px-4">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="reach-cut" className="text-[13px] text-fog">
          Inspect a cut
        </label>
        <select
          id="reach-cut"
          value={cut?.id ?? ""}
          onChange={(e) => onPick(e.target.value || null)}
          className="h-8 border border-paper/20 bg-graphite px-2 font-mono text-[13px] text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
        >
          <option value="">None</option>
          {live.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id}
            </option>
          ))}
        </select>
      </div>
      {cut && cut.posted <= h ? (
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[14px] leading-[1.35]">
          <dt className="text-fog">Cut</dt>
          <dd className="text-paper">
            {cut.id} · {cut.format}
          </dd>
          <dt className="text-fog">Hook</dt>
          <dd className="text-paper">{cut.hook}</dd>
          <dt className="text-fog">Went out</dt>
          <dd className="font-mono text-[13px] text-paper">{dayClock(cut.posted)}</dd>
          <dt className="text-fog">Now</dt>
          <dd className="font-mono text-[13px] text-paper">{x1(cut.obs[Math.floor(Math.min(h, SPAN))])} the usual post</dd>
          <dt className="text-fog">State</dt>
          <dd className="text-paper">{STATE[statusAt(cut, Math.floor(h))]}</dd>
        </dl>
      ) : (
        <p className="mt-3 max-w-[34ch] text-[14px] leading-[1.45] text-fog">
          Point at a trace, or pick a cut, to read it. Each line is one cut, against the account’s usual post.
        </p>
      )}
    </div>
  );
}

function QuarterStrip({ quarter, done, current }: { quarter: ReturnType<typeof reachQuarter>; done: number; current: number }) {
  const lnL = Math.log(0.5);
  const lnH = Math.log(HI);
  const y = (v: number) => 1 - (Math.log(Math.max(0.5, v)) - lnL) / (lnH - lnL);
  return (
    <div className="border-t border-paper/12 px-3 pb-2 pt-3 sm:px-4">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[13px] text-fog">The quarter: each week’s median cut, and its best</p>
        <p className="hidden items-center gap-4 text-[13px] text-fog sm:flex">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="h-3 w-[3px] bg-paper/50" /> Median
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="h-[3px] w-3 bg-signal" /> Best
          </span>
        </p>
      </div>
      <ol className="mt-2 grid h-[64px] grid-cols-13 gap-x-1" aria-label="Each week's median and best cut">
        {quarter.map((b, i) => {
          const shown = i < done;
          return (
            <li key={b.week} className="relative" aria-label={shown ? `Week ${i + 1}: median ${x1(b.median)}, best ${x1(b.best)}` : `Week ${i + 1}: not yet run`}>
              <span aria-hidden className={`absolute inset-x-0 bottom-0 top-0 ${i === current ? "bg-paper/[0.06]" : ""}`} />
              {shown && (
                <>
                  <span aria-hidden className="absolute bottom-0 left-1/2 w-[3px] -translate-x-1/2 bg-paper/50" style={{ top: `${y(b.median) * 100}%` }} />
                  <span aria-hidden className="absolute left-[18%] right-[18%] h-[3px] bg-signal" style={{ top: `${y(b.best) * 100}%` }} />
                </>
              )}
            </li>
          );
        })}
      </ol>
      <div aria-hidden className="mt-1 grid grid-cols-13 gap-x-1 font-mono text-[13px] leading-none text-fog">
        {quarter.map((b, i) => (
          <span key={b.week} className={`text-center ${i % 3 && i !== 12 ? "max-sm:invisible" : ""}`}>
            {i + 1}
          </span>
        ))}
      </div>
    </div>
  );
}
