"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "@/components/icons";
import type { LayerKey } from "@/lib/nav";

/*
  The Plurel System as a working map, on the engagement and discipline
  pages: the four layers left to right (top to bottom on a phone), each
  with what it builds and the disciplines in it, the ones a page puts to
  work lit and joined layer to layer by the hand-offs they make, and the
  loop back from Measure along the foot. Choosing a layer opens what it
  does here; pointing at a discipline lights its hand-offs.

  The edges are measured from the laid-out nodes, so the map keeps to
  the grid at every width; without JS it is the four columns, unjoined.
*/

export type MapLayer = { key: LayerKey; name: string; builds: string; line: string };
export type MapNode = { slug: string; name: string; tagline: string; href: string; layer: LayerKey };

type Edge = { from: string; to: string; d: string };

export function SystemMap({
  layers,
  nodes,
  focus,
  current,
  lines,
  tone = "dark",
  label,
  open,
}: {
  layers: readonly MapLayer[];
  nodes: readonly MapNode[];
  /** The disciplines this page puts to work */
  focus: readonly string[];
  /** The page's own discipline */
  current?: string;
  /** What each layer does here, in the System's order */
  lines?: readonly string[];
  tone?: "dark" | "red";
  label: string;
  /** The layer that opens chosen */
  open?: LayerKey;
}) {
  const red = tone === "red";
  const box = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState<LayerKey>(open ?? layers[0].key);
  const [hot, setHot] = useState<string | null>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loop, setLoop] = useState<{ d: string; lx: number; ly: number } | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const inPlay = new Set(focus);

  // measure the nodes and join each layer's lit ones to the next layer's
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const o = el.getBoundingClientRect();
      setSize({ w: o.width, h: o.height });
      const cols = layers.map((L) => el.querySelector<HTMLElement>(`[data-col="${L.key}"]`)!.getBoundingClientRect());
      const across = cols.length > 1 && cols[1].left > cols[0].right - 1;
      if (!across) {
        setEdges([]);
        setLoop(null);
        return;
      }
      const port = (slug: string, side: "out" | "in") => {
        const n = el.querySelector<HTMLElement>(`[data-node="${slug}"] ${side === "out" ? "[data-name]" : "[data-port]"}`);
        if (!n) return null;
        const r = n.getBoundingClientRect();
        return side === "out" ? { x: r.right - o.left + 8, y: r.top - o.top + r.height / 2 } : { x: r.left - o.left - 4, y: r.top - o.top + r.height / 2 };
      };
      const next: Edge[] = [];
      for (let i = 0; i < layers.length - 1; i++) {
        const a = nodes.filter((n) => n.layer === layers[i].key && inPlay.has(n.slug));
        const b = nodes.filter((n) => n.layer === layers[i + 1].key && inPlay.has(n.slug));
        for (const s of a)
          for (const t of b) {
            const p = port(s.slug, "out");
            const q = port(t.slug, "in");
            if (!p || !q) continue;
            const mx = (p.x + q.x) / 2;
            next.push({ from: s.slug, to: t.slug, d: `M${p.x} ${p.y}C${mx} ${p.y} ${mx} ${q.y} ${q.x} ${q.y}` });
          }
      }
      setEdges(next);
      // the loop: from Measure's lit nodes down to the foot, back to Narrative
      const last = nodes.filter((n) => n.layer === layers[layers.length - 1].key && inPlay.has(n.slug));
      const first = nodes.filter((n) => n.layer === layers[0].key && inPlay.has(n.slug));
      const p = last.length ? port(last[last.length - 1].slug, "out") : null;
      const q = first.length ? port(first[0].slug, "in") : null;
      if (p && q) {
        const foot = Math.max(...cols.map((c) => c.bottom)) - o.top + 26;
        const left = q.x - 14;
        setLoop({
          d: `M${p.x} ${p.y}H${p.x + 10}V${foot}H${left}V${q.y}H${q.x}`,
          lx: (p.x + left) / 2,
          ly: foot,
        });
      } else setLoop(null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers, nodes, focus.join()]);

  const L = layers.find((x) => x.key === sel)!;
  const li = layers.indexOf(L);
  const here = nodes.filter((n) => n.layer === sel);
  const stroke = red ? "var(--color-paper)" : "var(--color-paper)";

  return (
    <div className="mt-12 lg:mt-16">
      <div ref={box} role="group" aria-label={label} className="relative pb-0 lg:pb-14">
        <svg aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-visible lg:block" width={size.w} height={size.h} fill="none">
          {edges.map((e) => {
            const lit = hot ? e.from === hot || e.to === hot : true;
            return (
              <path
                key={e.from + e.to}
                d={e.d}
                stroke={stroke}
                strokeOpacity={lit ? (red ? 0.8 : 0.55) : 0.12}
                strokeWidth={hot && lit ? 1.5 : 1}
                className="transition-[stroke-opacity] duration-300"
              />
            );
          })}
          {loop && (
            <path d={loop.d} stroke={red ? "var(--color-paper)" : "var(--color-signal)"} strokeOpacity={hot ? 0.3 : 0.9} strokeWidth={1} />
          )}
        </svg>
        {loop && (
          <span
            aria-hidden
            className={`absolute hidden -translate-x-1/2 px-2 text-[13px] leading-none lg:block ${red ? "bg-brand text-paper" : "bg-graphite text-fog"}`}
            style={{ left: loop.lx, top: loop.ly - 6 }}
          >
            The Ledger feeds back: read monthly, reset quarterly
          </span>
        )}
        <ol className="grid grid-cols-1 gap-y-0 lg:grid-cols-4 lg:gap-x-10">
          {layers.map((layer) => {
            const chosen = layer.key === sel;
            return (
              <li
                key={layer.key}
                data-col={layer.key}
                className={`relative border-t py-5 lg:py-6 ${chosen ? (red ? "border-paper" : "border-paper/80") : red ? "border-paper/35" : "border-paper/15"}`}
              >
                <button
                  type="button"
                  aria-pressed={chosen}
                  onClick={() => setSel(layer.key)}
                  className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className={`type-title text-[clamp(1.375rem,1.1rem+0.9vw,1.75rem)] leading-none transition-opacity ${chosen ? "" : "opacity-70 group-hover:opacity-100"}`}>
                      {layer.name}
                    </span>
                    <span aria-hidden className={`size-[7px] transition-colors ${chosen ? (red ? "bg-paper" : "bg-signal") : red ? "border border-paper/60" : "border border-paper/40"}`} />
                  </span>
                  <span className={`mt-2 block text-[14px] leading-[1.35] ${red ? "text-paper" : "text-fog"}`}>Builds {lowerThe(layer.builds)}</span>
                </button>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {nodes
                    .filter((n) => n.layer === layer.key)
                    .map((n) => {
                      const on = inPlay.has(n.slug);
                      const me = n.slug === current;
                      return (
                        <li key={n.slug} data-node={n.slug}>
                          <Link
                            href={n.href}
                            aria-current={me ? "page" : undefined}
                            onPointerEnter={() => on && setHot(n.slug)}
                            onPointerLeave={() => setHot((h) => (h === n.slug ? null : h))}
                            onFocus={() => on && setHot(n.slug)}
                            onBlur={() => setHot((h) => (h === n.slug ? null : h))}
                            className={`group inline-flex items-center gap-2.5 text-[15px] leading-[1.3] transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper ${
                              on ? "" : "opacity-45 hover:opacity-90"
                            }`}
                          >
                            <span
                              data-port=""
                              aria-hidden
                              className={`size-[8px] shrink-0 ${me ? (red ? "bg-paper" : "bg-signal") : on ? "bg-paper" : "border border-paper/70"}`}
                            />
                            <span data-name="" className={me ? "font-medium underline decoration-1 underline-offset-[5px]" : ""}>
                              {n.name}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>

      <div
        aria-live="polite"
        className={`grid gap-y-6 border-t pt-6 lg:grid-cols-12 lg:gap-x-8 lg:pt-8 ${red ? "border-paper/35" : "border-paper/15"}`}
      >
        <div className="lg:col-span-6">
          <p className={`text-[13px] ${red ? "text-paper" : "text-fog"}`}>
            {L.name}, {lines ? "here" : "in the System"}
          </p>
          <p className="type-title mt-3 max-w-[30ch] text-[clamp(1.25rem,1.05rem+0.7vw,1.625rem)] leading-[1.25]">{lines ? lines[li] : L.line}</p>
        </div>
        <ul className="lg:col-span-6">
          {here.map((n) => (
            <li key={n.slug} className={`border-t py-3 first:border-t-0 first:pt-0 ${red ? "border-paper/25" : "border-paper/10"}`}>
              <Link href={n.href} className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4">
                <span>
                  <span className="text-[16px] font-medium leading-[1.3]">
                    {n.name}
                    {!inPlay.has(n.slug) && <span className={`ml-2 text-[13px] font-normal ${red ? "text-paper" : "text-fog"}`}>Not in this one</span>}
                  </span>
                  <span className={`mt-1 block text-[15px] leading-[1.4] ${red ? "text-paper" : "text-fog"}`}>{n.tagline}</span>
                </span>
                <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const lowerThe = (s: string) => s.replace(/^The /, "the ");
