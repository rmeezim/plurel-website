import type { CSSProperties } from "react";
import { MARK_CELLS } from "@/lib/mark";
import { asset } from "@/lib/site";

/*
  Faint branded art behind a chapter (exploration build).
*/

export type ArtKind = "contours" | "mark";
export type ArtTone = "paper" | "dark" | "red";

/** Line color per tone (the layer paints in currentColor) */
const TONE: Record<ArtTone, string> = {
  paper: "text-ink",
  dark: "text-paper",
  red: "text-blush",
};

/** How strongly the art shows on each surface */
const STRENGTH: Record<ArtKind, Record<ArtTone, number>> = {
  contours: { paper: 0.07, dark: 0.09, red: 0.13 },
  mark: { paper: 0.08, dark: 0.1, red: 0.14 },
};

/** Where each seed's summit sits in its 1600px tile (scripts/art/contours.mjs) */
const SUMMIT: Record<number, [number, number]> = {
  1: [1596, 1292],
  2: [720, 1516],
  3: [672, 536],
  4: [236, 796],
  5: [552, 620],
  6: [1388, 1332],
};

const TILE = 1600;
const R = 2.6 / 19.2; // the logo's corner radius, in mark units

const CSS = `
.plurel-art{view-timeline:--plurel-art block}
@keyframes plurel-art-drift{from{translate:0 calc(var(--art-drift) * -1)}to{translate:0 var(--art-drift)}}
@media (prefers-reduced-motion:no-preference){@supports (animation-timeline:view()){
html[data-js] .plurel-art[data-drift] .plurel-art-layer{animation:plurel-art-drift linear both;animation-timeline:--plurel-art;animation-range:cover}
}}
`;

function MarkLines({ variant }: { variant: string }) {
  const lines: React.ReactNode[] = [];
  MARK_CELLS.forEach(([x, y, w, h], i) => {
    lines.push(
      <rect key={`o${i}`} x={x} y={y} width={w} height={h} rx={R} vectorEffect="non-scaling-stroke" />,
    );
    if (variant === "double") {
      const d = 0.09;
      lines.push(
        <rect
          key={`d${i}`}
          x={x + d}
          y={y + d}
          width={w - 2 * d}
          height={h - 2 * d}
          rx={Math.max(0, R - d)}
          vectorEffect="non-scaling-stroke"
          strokeOpacity={0.55}
        />,
      );
    }
    if (variant === "concentric") {
      const d = 0.2;
      for (let k = 1; w - 2 * k * d > d * 0.9 && h - 2 * k * d > d * 0.9; k++) {
        lines.push(
          <rect
            key={`c${i}-${k}`}
            x={x + k * d}
            y={y + k * d}
            width={w - 2 * k * d}
            height={h - 2 * k * d}
            rx={Math.max(0, R - k * d)}
            vectorEffect="non-scaling-stroke"
            strokeOpacity={0.6}
          />,
        );
      }
    }
    if (variant === "hatch") {
      const p = 0.125;
      for (let k = 1; k * p < w - 0.01; k++) {
        lines.push(
          <line
            key={`h${i}-${k}`}
            x1={x + k * p}
            x2={x + k * p}
            y1={y}
            y2={y + h}
            vectorEffect="non-scaling-stroke"
            strokeOpacity={0.5}
          />,
        );
      }
    }
  });
  return <>{lines}</>;
}

export function ArtField({
  kind,
  seed = 1,
  tone,
  annotate = false,
  drift = true,
  summit,
  variant = "outline",
  className = "",
}: {
  kind: ArtKind;
  seed?: number;
  tone: ArtTone;
  annotate?: boolean;
  drift?: boolean;
  summit?: [number, number];
  variant?: string;
  className?: string;
}) {
  const strength = STRENGTH[kind][tone];
  const [sx, sy] = SUMMIT[seed] ?? SUMMIT[1];
  const [fx, fy] = summit ?? [0.76, 0.36];
  const url = `url(${asset(`/art/contours-${seed}.svg`)})`;
  const position = `calc(${fx * 100}cqw - ${sx}px) calc(${fy * 100}cqh - ${sy}px + var(--art-drift))`;
  return (
    <div
      aria-hidden
      data-art={kind}
      data-drift={drift ? "" : undefined}
      className={`plurel-art pointer-events-none absolute inset-0 -z-10 overflow-hidden [container-type:size] ${TONE[tone]} ${className}`}
      style={{ "--art-drift": kind === "mark" ? "40px" : "28px" } as CSSProperties}
    >
      <style href="plurel-art" precedence="medium">
        {CSS}
      </style>
      <div className="plurel-art-layer absolute inset-x-0 -inset-y-[var(--art-drift)]">
        {kind === "contours" ? (
          <div
            className="absolute inset-0 bg-current"
            style={{
              opacity: strength,
              maskImage: url,
              WebkitMaskImage: url,
              maskSize: `${TILE}px ${TILE}px`,
              WebkitMaskSize: `${TILE}px ${TILE}px`,
              maskRepeat: "repeat",
              WebkitMaskRepeat: "repeat",
              maskPosition: position,
              WebkitMaskPosition: position,
            }}
          />
        ) : (
          <svg
            viewBox="-0.05 -0.05 10.1 10.1"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            className="absolute right-0 top-1/2 aspect-square h-[min(84cqh,120cqw)] -translate-y-1/2 translate-x-[38%]"
            style={{ opacity: strength }}
          >
            <MarkLines variant={variant} />
          </svg>
        )}
      </div>
      {annotate ? null : null}
    </div>
  );
}
