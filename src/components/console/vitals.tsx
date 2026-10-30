"use client";

import { useEffect, useRef, useState } from "react";
import { Console, useBox, useSim } from "@/components/console/console";
import { Figure } from "@/components/console/parts";

/*
  Website Design: this page, measured. Nothing here is simulated: the
  console reads the browser's own timings for the page you are on (the
  document, every request it made, when the first and the largest content
  painted, how much the layout shifted, how quickly it answered your taps)
  and replays the load as a waterfall at a tenth of its speed. Each
  figure sits against Google's line for good and against our own stricter
  budget. Nothing is sent anywhere.
*/

type Row = { name: string; kind: string; start: number; end: number; size: number };
type Read = { rows: Row[]; ttfb: number; fcp: number; lcp: number; load: number; cls: number; bytes: number; total: number };

const KIND_TONE: Record<string, string> = {
  document: "var(--color-signal)",
  script: "var(--color-paper)",
  style: "color-mix(in srgb, var(--color-paper) 70%, transparent)",
  font: "color-mix(in srgb, var(--color-paper) 50%, transparent)",
  image: "color-mix(in srgb, var(--color-paper) 35%, transparent)",
  other: "color-mix(in srgb, var(--color-paper) 25%, transparent)",
};

function kindOf(r: PerformanceResourceTiming): string {
  const n = r.name.split("?")[0];
  if (/\.(woff2?|ttf|otf)$/.test(n)) return "font";
  if (/\.css$/.test(n) || r.initiatorType === "link" && /css/.test(n)) return "style";
  if (/\.(js|mjs)$/.test(n) || r.initiatorType === "script") return "script";
  if (/\.(png|jpe?g|webp|avif|svg|gif)$/.test(n) || r.initiatorType === "img") return "image";
  return "other";
}

const short = (url: string) => {
  try {
    const u = new URL(url);
    const p = u.pathname.split("/").filter(Boolean);
    return p.length ? p[p.length - 1] : u.host;
  } catch {
    return url;
  }
};

const GOOD = { lcp: 2500, cls: 0.1, inp: 200, ttfb: 800, fcp: 1800 };
const OURS = { lcp: 1800, cls: 0.05, inp: 150, ttfb: 600, fcp: 1200 };

function verdict(v: number, key: keyof typeof GOOD) {
  if (v <= OURS[key]) return { word: "Within our budget", tone: "signal" as const };
  if (v <= GOOD[key]) return { word: "Good by Google’s line", tone: "paper" as const };
  return { word: "Over the line", tone: "fog" as const };
}

export function VitalsConsole() {
  const frame = useRef<HTMLElement>(null);
  const plot = useRef<HTMLDivElement>(null);
  const box = useBox(plot);
  const [read, setRead] = useState<Read | null>(null);
  const [inp, setInp] = useState<number | null>(null);
  const [hot, setHot] = useState<number | null>(null);
  const sim = useSim(frame, { end: read?.total ?? 1000, rate: (read?.total ?? 1000) / 9, by: 100 });

  useEffect(() => {
    let lcp = 0;
    let cls = 0;
    const observers: PerformanceObserver[] = [];
    const watch = (type: string, cb: (list: PerformanceObserverEntryList) => void, extra: Record<string, unknown> = {}) => {
      try {
        const o = new PerformanceObserver(cb);
        o.observe({ type, buffered: true, ...extra } as PerformanceObserverInit);
        observers.push(o);
      } catch {
        // not supported here
      }
    };
    watch("largest-contentful-paint", (l) => {
      const e = l.getEntries();
      if (e.length) lcp = e[e.length - 1].startTime;
    });
    watch("layout-shift", (l) => {
      for (const e of l.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) if (!e.hadRecentInput) cls += e.value;
    });
    watch(
      "event",
      (l) => {
        const xs = (l.getEntries() as (PerformanceEntry & { interactionId?: number })[]).filter((e) => e.interactionId);
        if (xs.length) setInp((v) => Math.max(v ?? 0, ...xs.map((e) => e.duration)));
      },
      { durationThreshold: 16 },
    );
    const take = () => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (!nav) return;
      const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0;
      const rows: Row[] = [
        { name: short(location.href) || "this page", kind: "document", start: nav.startTime, end: nav.responseEnd, size: nav.transferSize },
        ...res
          .filter((r) => r.startTime < (nav.loadEventEnd || 4000) + 600)
          .sort((a, b) => a.startTime - b.startTime)
          .slice(0, 23)
          .map((r) => ({ name: short(r.name), kind: kindOf(r), start: r.startTime, end: r.responseEnd || r.startTime + r.duration, size: r.transferSize })),
      ];
      const bytes = res.reduce((s, r) => s + (r.transferSize || 0), nav.transferSize || 0);
      const total = Math.max(nav.loadEventEnd, lcp, ...rows.map((r) => r.end)) * 1.06;
      setRead({ rows, ttfb: nav.responseStart, fcp, lcp: lcp || fcp, load: nav.loadEventEnd, cls, bytes, total });
    };
    // read once the page has loaded and the largest paint has settled
    const id = window.setTimeout(take, document.readyState === "complete" ? 400 : 1600);
    return () => {
      window.clearTimeout(id);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  const W = box.w || 900;
  const t = sim.t;
  const lab = W < 560 ? 104 : 150;
  const X = (ms: number) => lab + (ms / (read?.total ?? 1000)) * (W - lab - 10);
  const sec = (ms: number) => `${(ms / 1000).toFixed(2)} s`;
  const hr = hot != null && read ? read.rows[hot] : null;

  return (
    <Console
      sim={sim}
      frameRef={frame}
      title="This page, measured"
      kind="Live measurement"
      clock={read ? `Replay ${sec(Math.min(t, read.total))}` : "Measuring"}
      label="A live measurement of this page in your browser: its timings, every request it made as a waterfall, and its Core Web Vitals against Google's thresholds and Plurel's own budget."
      stepLabel="Step a tenth of a second"
      readout={
        read
          ? `This page drew its largest content at ${sec(read.lcp)}, shifted by ${read.cls.toFixed(3)}, and made ${read.rows.length > 23 ? "more than 24" : read.rows.length} requests weighing ${Math.round(read.bytes / 1024)} KB. ${inp != null ? `Your last tap was answered in ${Math.round(inp)} ms.` : "Tap anything on the page and the response is timed here."}`
          : "Reading this page’s own timings from your browser."
      }
      note="Measured in your browser just now, on this page; nothing is sent anywhere. A cached visit loads faster than a first one, and a phone on a slow network slower."
    >
      <div ref={plot} className="min-w-0">
        {read ? (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 border-b border-paper/12 px-3 py-4 sm:px-4 lg:grid-cols-5">
              {(
                [
                  ["Largest paint", sec(read.lcp), verdict(read.lcp, "lcp")],
                  ["Layout shift", read.cls.toFixed(3), verdict(read.cls, "cls")],
                  ["Response to a tap", inp != null ? `${Math.round(inp)} ms` : "Tap to time", inp != null ? verdict(inp, "inp") : null],
                  ["First byte", `${Math.round(read.ttfb)} ms`, verdict(read.ttfb, "ttfb")],
                  ["First paint", sec(read.fcp), verdict(read.fcp, "fcp")],
                ] as const
              ).map(([label, value, v]) => (
                <Figure key={label} label={label} value={value} tone={v?.tone === "signal" ? "signal" : "paper"} sub={v ? v.word : "Interaction to Next Paint"} />
              ))}
            </div>
            <div className="relative px-0 py-3">
              <div aria-hidden className="relative mb-1 h-4 font-mono text-[13px] leading-none text-fog">
                {[0, 0.25, 0.5, 0.75, 1].map((f) => (
                  <span key={f} className={`absolute ${f === 1 ? "-translate-x-full" : f ? "-translate-x-1/2" : ""}`} style={{ left: X(f * read.total) }}>
                    {sec(f * read.total)}
                  </span>
                ))}
              </div>
              <ol className="relative">
                {(
                  [
                    ["First paint", read.fcp],
                    ["Largest paint", read.lcp],
                    ["Loaded", read.load],
                  ] as const
                ).map(([name, ms], k) =>
                  t >= ms ? (
                    <li key={name} aria-hidden className="pointer-events-none absolute inset-y-0 z-10 w-px bg-signal/70" style={{ left: X(ms) }}>
                      <span
                        className={`absolute whitespace-nowrap bg-graphite px-1 text-[13px] leading-none text-signal ${X(ms) > W - 140 ? "right-1.5" : "left-1.5"}`}
                        style={{ top: k * 17 }}
                      >
                        {name}
                      </span>
                    </li>
                  ) : null,
                )}
                {read.rows.map((r, i) => {
                  const shown = t >= r.start;
                  const to = Math.min(t, r.end);
                  return (
                    <li
                      key={i}
                      onPointerEnter={() => setHot(i)}
                      onPointerLeave={() => setHot((h) => (h === i ? null : h))}
                      className={`relative h-[18px] transition-opacity ${hot != null && hot !== i ? "opacity-40" : ""}`}
                    >
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 truncate font-mono text-[13px] leading-none text-fog sm:left-4" style={{ width: lab - 20 }}>
                        {r.name}
                      </span>
                      {shown && (
                        <span
                          aria-hidden
                          className="absolute top-1/2 h-[7px] -translate-y-1/2"
                          style={{ left: X(r.start), width: Math.max(2, X(to) - X(r.start)), background: KIND_TONE[r.kind] }}
                        />
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className="flex min-h-[46px] flex-wrap items-center gap-x-5 gap-y-2 border-t border-paper/12 px-3 py-3 text-[13px] text-fog sm:px-4">
              {hr ? (
                <span className="text-paper">
                  <span className="text-fog">{hr.kind}: </span>
                  {hr.name} · starts {Math.round(hr.start)} ms · takes {Math.round(hr.end - hr.start)} ms
                  {hr.size ? ` · ${(hr.size / 1024).toFixed(1)} KB` : " · from cache"}
                </span>
              ) : (
                Object.keys(KIND_TONE).map((k) => (
                  <span key={k} className="inline-flex items-center gap-1.5">
                    <span aria-hidden className="h-[7px] w-3" style={{ background: KIND_TONE[k] }} />
                    {k[0].toUpperCase() + k.slice(1)}
                  </span>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="flex h-[320px] items-center justify-center text-[14px] text-fog">Reading this page’s timings…</div>
        )}
      </div>
    </Console>
  );
}
