import type { CSSProperties, ReactNode } from "react";

/*
  The parts the plates are drawn with (plate.tsx holds the motion). A
  drawing is a Stage: a box at the drawing's own aspect ratio, an SVG in
  its coordinates for the lines and nodes, and HTML labels placed in the
  same coordinates, so type stays type (13px and up, never scaled with
  the drawing) on a phone and on a wide screen.

  Every element takes its clock in ms: t (when it starts), d (how long it
  draws), and for the looping ones p (its period) and pd (its delay).
*/

export type Clock = { t?: number; d?: number; p?: number; pd?: number };

export function clock({ t, d, p, pd }: Clock): CSSProperties {
  const c: Record<string, string> = {};
  if (t != null) c["--t"] = `${Math.round(t)}ms`;
  if (d != null) c["--d"] = `${Math.round(d)}ms`;
  if (p != null) c["--p"] = `${Math.round(p)}ms`;
  if (pd != null) c["--pd"] = `${Math.round(pd)}ms`;
  return c as CSSProperties;
}

const n = (v: number) => Math.round(v * 10) / 10;

/** A path through points, as straight segments */
export function polyline(points: readonly (readonly [number, number])[]) {
  return points.map(([x, y], i) => `${i ? "L" : "M"}${n(x)} ${n(y)}`).join("");
}

/** A level S-curve from one point to another, leaving and arriving flat */
export function curve(x1: number, y1: number, x2: number, y2: number, bend = 0.5) {
  const mx = x1 + (x2 - x1) * bend;
  return `M${n(x1)} ${n(y1)}C${n(mx)} ${n(y1)} ${n(x2 - (x2 - x1) * bend)} ${n(y2)} ${n(x2)} ${n(y2)}`;
}

/** A function sampled across [x0, x1] into a path */
export function plot(f: (x: number) => number, x0: number, x1: number, step = 2) {
  const pts: [number, number][] = [];
  for (let x = x0; x < x1; x += step) pts.push([x, f(x)]);
  pts.push([x1, f(x1)]);
  return polyline(pts);
}

/** The drawing's box, at its own aspect ratio */
export function Stage({ w, h, className = "", children }: { w: number; h: number; className?: string; children: ReactNode }) {
  return (
    <div className={`relative w-full ${className}`} style={{ aspectRatio: `${w} / ${h}` }}>
      {children}
    </div>
  );
}

/** The drawing's lines and nodes, in its coordinates */
export function Svg({ w, h, className = "", children }: { w: number; h: number; className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      className={`absolute inset-0 h-full w-full overflow-visible ${className}`}
    >
      {children}
    </svg>
  );
}

/** A line drawn at a steady rate */
export function Line({
  d,
  t = 0,
  dur = 600,
  w = 1.5,
  className = "",
  style,
}: {
  d: string;
  t?: number;
  dur?: number;
  w?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <path
      d={d}
      pathLength={1}
      strokeWidth={w}
      className={`pl-stroke ${className}`}
      style={{ ...clock({ t, d: dur }), ...style }}
    />
  );
}

/** A short dash that runs along a line, once the plate is live */
export function Pulse({ d, p = 2600, pd = 0, w = 3, className = "text-signal" }: { d: string; p?: number; pd?: number; w?: number; className?: string }) {
  return <path d={d} pathLength={1} strokeWidth={w} className={`pl-pulse ${className}`} style={clock({ p, pd })} />;
}

/** A square node that switches on */
export function Node({
  x,
  y,
  s = 8,
  t = 0,
  className = "text-paper",
  hollow = false,
}: {
  x: number;
  y: number;
  s?: number;
  t?: number;
  className?: string;
  hollow?: boolean;
}) {
  return (
    <rect
      x={x - s / 2}
      y={y - s / 2}
      width={s}
      height={s}
      fill={hollow ? "var(--color-graphite)" : "currentColor"}
      strokeWidth={hollow ? 1.5 : 0}
      className={`pl-lit ${className}`}
      style={clock({ t })}
    />
  );
}

type Ax = "start" | "center" | "end";
type Ay = "top" | "middle" | "bottom";
const TX: Record<Ax, string> = { start: "0", center: "-50%", end: "-100%" };
const TY: Record<Ay, string> = { top: "0", middle: "-50%", bottom: "-100%" };

/** HTML type placed at a point of the drawing */
export function Label({
  w,
  h,
  x,
  y,
  ax = "start",
  ay = "middle",
  t = 0,
  max,
  className = "text-fog",
  children,
}: {
  w: number;
  h: number;
  x: number;
  y: number;
  ax?: Ax;
  ay?: Ay;
  t?: number;
  /** Wraps past this width (CSS length) */
  max?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`pl-lit absolute text-[13px] leading-[1.25] sm:text-[14px] ${max ? "" : "whitespace-nowrap"} ${
        ax === "end" ? "text-right" : ax === "center" ? "text-center" : ""
      } ${className}`}
      style={{
        left: `${(x / w) * 100}%`,
        top: `${(y / h) * 100}%`,
        translate: `${TX[ax]} ${TY[ay]}`,
        maxWidth: max,
        width: max ? "max-content" : undefined,
        ...clock({ t }),
      }}
    >
      {children}
    </span>
  );
}

/**
 * The readout of a drawing: what it shows, step by step, each on a
 * hairline. Three across under the drawing, or one column beside it.
 */
export function Readout({
  items,
  tone = "dark",
  layout = "column",
}: {
  items: readonly ReactNode[];
  tone?: "dark" | "red";
  layout?: "row" | "column";
}) {
  return (
    <ol
      className={`mt-6 grid gap-x-8 gap-y-0 ${layout === "row" ? "sm:grid-cols-3" : "lg:mt-0"} ${tone === "red" ? "" : "text-paper"}`}
    >
      {items.map((item, i) => (
        <li
          key={i}
          className={`border-t py-4 text-[15px] leading-[1.5] sm:text-[16px] ${tone === "red" ? "border-paper/40" : "border-paper/15"}`}
        >
          {item}
        </li>
      ))}
    </ol>
  );
}

/**
 * A key for a chart on a phone, where its labels would crowd the drawing:
 * each line's swatch and what it is. Hidden from sm, where the labels sit
 * in the drawing.
 */
export function Legend({ items }: { items: readonly { swatch: "line" | "faint" | "dim" | "mark"; text: string }[] }) {
  return (
    <ul className="mt-5 space-y-2 sm:hidden">
      {items.map((item) => (
        <li key={item.text} className="flex items-center gap-3 text-[13px] leading-[1.3] text-fog">
          <span
            aria-hidden
            className={
              item.swatch === "mark"
                ? "ml-[5px] mr-[5px] block h-[9px] w-[2px] bg-signal"
                : `block h-[2px] w-3 ${item.swatch === "line" ? "bg-paper" : item.swatch === "dim" ? "bg-fog/70" : "bg-paper/30"}`
            }
          />
          {item.text}
        </li>
      ))}
    </ul>
  );
}
