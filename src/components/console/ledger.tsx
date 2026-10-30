"use client";

import { useMemo, useRef, useState } from "react";
import { Console, useSim } from "@/components/console/console";
import { Figure } from "@/components/console/parts";
import { fmt, rng } from "@/lib/sim";

/*
  Analytics & Martech: the Ledger, ingesting. Orders happen in the store;
  every platform that touched the buyer on the way reports the order as
  its own, a little late, and analytics loses some to blocked cookies.
  Claims stream in on the left; the Ledger keeps each order once, by its
  order number, with the path that led to it and who claimed it. The
  figures above keep the gap between what the platforms claim and what
  happened. Point at an order to see its lineage. Seeded simulation,
  illustrative numbers.
*/

const SOURCES = [
  { key: "adA", name: "Ad platform A", p: 0.9 },
  { key: "adB", name: "Ad platform B", p: 0.85 },
  { key: "analytics", name: "Site analytics", p: 0.78 },
  { key: "email", name: "Email platform", p: 0.9 },
  { key: "affiliate", name: "Affiliate network", p: 0.95 },
  { key: "store", name: "Store", p: 1 },
] as const;
type SourceKey = (typeof SOURCES)[number]["key"];

const TOUCH: Record<Exclude<SourceKey, "store" | "analytics">, string> = {
  adA: "Social ad",
  adB: "Search ad",
  email: "Email",
  affiliate: "Affiliate",
};
const ORGANIC = ["Organic search", "AI answer", "Direct", "Creator post"];

type Order = { id: number; at: number; value: number; path: string[]; claims: { src: SourceKey; at: number }[] };

const SPAN = 1200; // sim seconds: twenty minutes of a trading day
const START = 14 * 3600 + 2 * 60; // the clock opens at 14:02

function run(): Order[] {
  const r = rng(40417);
  const orders: Order[] = [];
  let t = 4;
  let id = 10480;
  while (t < SPAN) {
    t += -Math.log(1 - r()) * 8.5;
    if (t >= SPAN) break;
    const path: string[] = [];
    const claimers: SourceKey[] = [];
    const steps = 1 + Math.floor(r() * 3.6);
    for (let k = 0; k < steps; k++) {
      if (r() < 0.76) {
        const keys = Object.keys(TOUCH) as (keyof typeof TOUCH)[];
        const key = keys[Math.floor(r() * keys.length)];
        if (!claimers.includes(key)) {
          claimers.push(key);
          path.push(TOUCH[key]);
        }
      } else path.push(ORGANIC[Math.floor(r() * ORGANIC.length)]);
    }
    const claims: { src: SourceKey; at: number }[] = [{ src: "store", at: t + 1 + r() * 2 }];
    if (r() < 0.78) claims.push({ src: "analytics", at: t + 3 + r() * 10 });
    for (const c of claimers) {
      const p = SOURCES.find((s) => s.key === c)!.p;
      if (r() < p) claims.push({ src: c, at: t + 5 + r() * 36 });
    }
    orders.push({ id: id++, at: t, value: Math.round(38 + r() * r() * 220), path: [...new Set(path)], claims });
  }
  return orders;
}

const clockOf = (s: number) => {
  const v = Math.floor(START + s);
  return `${String(Math.floor(v / 3600)).padStart(2, "0")}:${String(Math.floor((v % 3600) / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`;
};

export function LedgerConsole() {
  const frame = useRef<HTMLElement>(null);
  const orders = useMemo(() => run(), []);
  const sim = useSim(frame, { end: SPAN + 80, rate: 22, by: 60 });
  const [hot, setHot] = useState<number | null>(null);
  const t = sim.t;

  const claims = useMemo(
    () =>
      orders
        .flatMap((o) => o.claims.filter((c) => c.src !== "store").map((c) => ({ ...c, order: o.id, value: o.value })))
        .sort((a, b) => a.at - b.at),
    [orders],
  );
  const seen = claims.filter((c) => c.at <= t);
  const ledger = orders.filter((o) => o.claims[0].at <= t);
  const claimedBy: Record<string, number> = {};
  for (const c of seen) claimedBy[c.src] = (claimedBy[c.src] ?? 0) + 1;
  const platformClaims = seen.filter((c) => c.src !== "analytics").length;
  const platformValue = seen.filter((c) => c.src !== "analytics").reduce((s, c) => s + c.value, 0);
  const ledgerValue = ledger.reduce((s, o) => s + o.value, 0);
  const over = ledger.length ? platformClaims / ledger.length - 1 : 0;
  const recentSrc = new Set(seen.filter((c) => t - c.at < 6).map((c) => c.src));
  if (ledger.some((o) => t - o.claims[0].at < 6)) recentSrc.add("store");
  const hotOrder = hot != null ? orders.find((o) => o.id === hot) ?? null : null;
  const hotSrc = new Set(hotOrder ? hotOrder.claims.filter((c) => c.at <= t).map((c) => c.src) : []);

  const readout = ledger.length
    ? `${fmt(ledger.length)} orders in the store. The platforms claim ${fmt(platformClaims)} between them, ${over > 0 ? `${Math.round(over * 100)}% more than happened` : "about as many as happened"}; analytics saw ${fmt(claimedBy.analytics ?? 0)}. The Ledger keeps each order once, with the path that led to it.`
    : "The store opens the count; the platforms report theirs a little later.";

  return (
    <Console
      sim={sim}
      frameRef={frame}
      title="The Ledger"
      clock={clockOf(Math.min(t, SPAN + 79))}
      label="A simulated twenty minutes of orders: each platform claims the orders it touched, late and overlapping, and the Ledger keeps each order once by its order number, with its path and who claimed it."
      stepLabel="Step one minute"
      readout={readout}
      note="Simulation with illustrative numbers, not a client’s results. Platform names are generic; the Ledger is built in the first month and read with you every month."
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 border-b border-paper/12 px-3 py-4 sm:px-4 lg:grid-cols-4">
        <Figure label="Orders in the store" value={fmt(ledger.length)} />
        <Figure label="Orders the platforms claim" value={fmt(platformClaims)} tone="signal" />
        <Figure label="Revenue they claim" value={`$${fmt(platformValue)}`} tone="signal" />
        <Figure label="Revenue in the Ledger" value={`$${fmt(ledgerValue)}`} />
      </div>
      <div className="grid lg:grid-cols-12">
        <div className="border-b border-paper/12 lg:col-span-3 lg:border-b-0 lg:border-r">
          <p className="px-3 pt-3 text-[13px] text-fog sm:px-4">Sources</p>
          <ul className="grid grid-cols-2 gap-x-4 px-3 pb-3 pt-2 sm:px-4 lg:grid-cols-1">
            {SOURCES.map((s) => {
              const lit = hotOrder ? hotSrc.has(s.key) : recentSrc.has(s.key);
              const n = s.key === "store" ? ledger.length : claimedBy[s.key] ?? 0;
              return (
                <li key={s.key} className={`flex items-center justify-between gap-3 border-b border-paper/10 py-2 transition-opacity ${hotOrder && !lit ? "opacity-35" : ""}`}>
                  <span className="inline-flex min-w-0 items-center gap-2 text-[14px]">
                    <span aria-hidden className={`size-[7px] shrink-0 transition-colors duration-200 ${lit ? (s.key === "store" ? "bg-paper" : "bg-signal") : "bg-paper/20"}`} />
                    <span className="truncate">{s.name}</span>
                  </span>
                  <span className="font-mono text-[13px] tabular-nums text-fog">{fmt(n)}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="hidden border-r border-paper/12 lg:col-span-4 lg:block">
          <p className="px-4 pt-3 text-[13px] text-fog">Claims, as they arrive</p>
          <ol className="px-4 pb-3 pt-2 font-mono text-[13px] leading-none">
            {seen
              .slice(-11)
              .reverse()
              .map((c) => {
                const fresh = t - c.at < 4;
                const dim = hot != null && hot !== c.order;
                return (
                  <li
                    key={c.src + c.order}
                    className={`grid grid-cols-[auto_1fr_auto] items-center gap-x-3 border-b border-paper/[0.07] py-[7px] transition-opacity ${dim ? "opacity-25" : ""}`}
                  >
                    <span className={fresh ? "text-signal" : "text-fog"}>{clockOf(c.at).slice(3)}</span>
                    <span className="truncate font-sans text-[13px] text-paper/90">{SOURCES.find((s) => s.key === c.src)!.name}</span>
                    <span className={hot === c.order ? "text-paper" : "text-fog"}>#{c.order}</span>
                  </li>
                );
              })}
          </ol>
        </div>
        <div className="lg:col-span-5">
          <p className="px-3 pt-3 text-[13px] text-fog sm:px-4">The Ledger: each order once</p>
          <ol className="px-3 pb-3 pt-2 sm:px-4">
            {ledger
              .slice(-8)
              .reverse()
              .map((o) => {
                const got = o.claims.filter((c) => c.at <= t && c.src !== "store");
                const fresh = t - o.claims[0].at < 4;
                return (
                  <li key={o.id}>
                    <button
                      type="button"
                      onPointerEnter={() => setHot(o.id)}
                      onPointerLeave={() => setHot((h) => (h === o.id ? null : h))}
                      onFocus={() => setHot(o.id)}
                      onBlur={() => setHot((h) => (h === o.id ? null : h))}
                      className={`grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-3 border-b border-paper/10 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-paper ${
                        hot === o.id ? "bg-paper/[0.06]" : ""
                      }`}
                    >
                      <span className={`font-mono text-[13px] ${fresh ? "text-signal" : "text-paper"}`}>#{o.id}</span>
                      <span className="truncate text-[13px] text-fog">{o.path.length ? o.path.join(" → ") : "Direct"}</span>
                      <span className="inline-flex items-center gap-2">
                        <span aria-label={`Claimed by ${got.length}`} className="inline-flex gap-[3px]">
                          {got.map((c) => (
                            <span key={c.src} aria-hidden className={`size-[6px] ${c.src === "analytics" ? "border border-paper/70" : "bg-signal"}`} />
                          ))}
                        </span>
                        <span className="w-[52px] text-right font-mono text-[13px] tabular-nums text-paper">${o.value}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
          </ol>
          <p className="flex flex-wrap gap-x-4 gap-y-1 px-3 pb-3 text-[13px] text-fog sm:px-4">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="size-[6px] bg-signal" /> A platform’s claim
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="size-[6px] border border-paper/70" /> Seen by analytics
            </span>
          </p>
        </div>
      </div>
    </Console>
  );
}
