import type { CSSProperties } from "react";
import { MARK_CELLS } from "@/lib/mark";
import { asset } from "@/lib/site";

/*
  Faint branded art behind a chapter: Plurel's survey of the ground its
  buyers decide on, and its mark pressed into the material.

  - kind="contours": a topographic contour field (public/art/contours-N.svg,
    drawn by scripts/art/contours.mjs: seeded terrain, eroded by rain,
    surveyed at a fixed interval with every fifth contour an index line).
    The SVG is a mask over a token-colored layer, so the files carry no
    color. Its terrain tiles seamlessly and each file stamps one tile 5 x 4
    across a single sheet, shown once at 1:1 (1 SVG px = 1 CSS px) with no
    CSS repeat: one scale from a phone to a wide screen, hairlines that stay
    hairlines, and plain vector painting in every engine (a repeating SVG
    mask would be rasterized a whole tile at a time).
  - kind="mark": the Plurel mark, huge and cropped by the chapter's right
    edge, engraved rather than printed: each cell's outline with fine
    vertical lines cut into it, the nine flutes of the hero's glass. Never
    filled, split, opened or assembled.
  - annotate: one quiet survey readout, fixed to the sheet while the field
    moves under it: registration crosses at two corners of the grid and a
    single mono line. One per page at most; leave it off where it would
    read as a label.
  - drift (default on): the field slides a few dozen pixels against the
    scroll while its chapter crosses the screen. A CSS scroll-driven
    animation, so it runs on the compositor, does nothing off screen, and
    stays still under reduced motion, without JS, and in browsers that lack
    scroll timelines.

  Usage: inside a `relative isolate` parent (usually `overflow-hidden`
  too), first child, as decoration. It fills the parent at -z-10, is
  aria-hidden and never takes the pointer. Not inside the pinned services
  chapter.
*/

export type ArtKind = "contours" | "mark";
export type ArtTone = "paper" | "dark" | "red";

/** The survey's own numbers, shared with scripts/art/contours.mjs */
const TILE = 1600; // px, each tile is drawn and shown at 1:1
const SHEET = { cols: 5, rows: 4 }; // tiles stamped across each file
const ANCHOR = { col: 2, row: 1 }; // the stamp whose summit sits at `focus`
const INTERVAL = 4; // contour interval, in the sheet's units

/** The fields in public/art, by seed: where each summit sits in its tile, px */
const SUMMIT: Record<number, readonly [number, number]> = {
  1: [1596, 1292],
  2: [720, 1516],
  3: [672, 536],
  4: [236, 796],
  5: [448, 428],
  6: [1352, 440],
};

/**
 * Line color per surface: ink on paper, paper on graphite, and ember on
 * red, cut into the red like intaglio. Ember only darkens what it crosses,
 * so paper type on red keeps its contrast where a line runs under it.
 */
const TONE: Record<ArtTone, string> = {
  paper: "text-ink",
  dark: "text-paper",
  red: "text-ember",
};

/** How much of the line color shows: felt more than seen */
const STRENGTH: Record<ArtKind, Record<ArtTone, number>> = {
  contours: { paper: 0.07, dark: 0.09, red: 0.45 },
  mark: { paper: 0.07, dark: 0.08, red: 0.5 },
};

/** The readout's own tone: AA for its 11px line, quieter for its crosses */
const READOUT: Record<ArtTone, { text: string; cross: string }> = {
  paper: { text: "text-muted", cross: "text-ink/35" },
  dark: { text: "text-fog", cross: "text-paper/35" },
  red: { text: "text-paper", cross: "text-paper/45" },
};

/** Total travel each way, px */
const DRIFT: Record<ArtKind, number> = { contours: 24, mark: 32 };

/*
  The drift. The timeline is the chapter itself (the art's parent): an
  overflow-hidden chapter is a scroll container, so a timeline declared
  inside it would measure against the chapter, which never scrolls. The
  layer travels from -drift to +drift while the chapter crosses the
  screen. Zero specificity, so a chapter's own view-timeline still wins.
  Hoisted once into <head> by React.
*/
const CSS = `
:where(*):has(> .plurel-art[data-drift]){view-timeline:--plurel-art block}
@keyframes plurel-art-drift{from{translate:0 calc(var(--art-drift) * -1)}to{translate:0 var(--art-drift)}}
@media (prefers-reduced-motion:no-preference){@supports (animation-timeline:view()){
html[data-js] .plurel-art[data-drift] .plurel-art-layer{animation:plurel-art-drift linear both;animation-timeline:--plurel-art;animation-range:cover}
}}
`;

/** The logo's corner radius (2.6 on its 19.2 grid unit), in mark units */
const RADIUS = 2.6 / 19.2;
/** Engraving pitch, in mark units: 16 lines to a 2-unit cell */
const PITCH = 0.125;

/** Each cell's vertical engraving, as one path */
const ENGRAVING = MARK_CELLS.map(([x, y, w, h]) => {
  let d = "";
  for (let k = 1; k * PITCH < w - 0.01; k++) d += `M${x + k * PITCH} ${y}v${h}`;
  return d;
}).join("");

function Mark() {
  return (
    <svg
      viewBox="-0.05 -0.05 10.1 10.1"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      className="absolute right-0 top-1/2 aspect-square h-[min(84cqh,120cqw)] -translate-y-1/2 translate-x-[38%]"
    >
      {MARK_CELLS.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx={RADIUS} vectorEffect="non-scaling-stroke" />
      ))}
      <path d={ENGRAVING} strokeOpacity={0.5} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** A registration cross: a ring on a hairline cross, centered on its point */
function Cross({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 17 17"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      className={`absolute size-[17px] ${className}`}
    >
      <circle cx="8.5" cy="8.5" r="4" />
      <path d="M8.5 0v17M0 8.5h17" />
    </svg>
  );
}

function Readout({ seed, tone }: { seed: number; tone: ArtTone }) {
  const t = READOUT[tone];
  return (
    <div className="absolute inset-0 hidden sm:block">
      {/* the grid's own frame: the same edges as CONTAINER's content */}
      <div className="relative mx-auto h-full max-w-[1440px]">
        <div className="absolute inset-y-0 left-8 right-8 lg:left-12 lg:right-12">
          <Cross className={`right-0 top-10 -translate-y-1/2 translate-x-1/2 ${t.cross}`} />
          <Cross className={`bottom-10 left-0 -translate-x-1/2 translate-y-1/2 ${t.cross}`} />
          <p
            className={`absolute bottom-10 left-5 translate-y-1/2 font-mono text-[11px] uppercase leading-none tracking-[0.03em] ${t.text}`}
          >
            Field {String(seed).padStart(2, "0")} · Contour interval {INTERVAL}
          </p>
        </div>
      </div>
    </div>
  );
}

/** The field as a mask: the anchor stamp's summit placed at `focus` */
function contourMask(seed: number, tone: ArtTone, focus: readonly [number, number]): CSSProperties {
  const x = SUMMIT[seed][0] + ANCHOR.col * TILE;
  const y = SUMMIT[seed][1] + ANCHOR.row * TILE;
  const url = `url(${asset(`/art/contours-${seed}.svg`)})`;
  // the layer is taller than the chapter by the drift, top and bottom
  const at = `calc(${focus[0] * 100}cqw - ${x}px) calc(${focus[1] * 100}cqh + var(--art-drift) - ${y}px)`;
  const size = `${SHEET.cols * TILE}px ${SHEET.rows * TILE}px`;
  return {
    opacity: STRENGTH.contours[tone],
    maskImage: url,
    WebkitMaskImage: url,
    maskSize: size,
    WebkitMaskSize: size,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: at,
    WebkitMaskPosition: at,
  };
}

export function ArtField({
  kind,
  seed = 1,
  tone,
  annotate = false,
  drift = true,
  focus = [0.74, 0.34],
  className = "",
}: {
  kind: ArtKind;
  /** Which contour field (1 to 6); ignored by the mark */
  seed?: number;
  tone: ArtTone;
  /** One survey readout (contours only): crosses and a mono line */
  annotate?: boolean;
  /** A slow parallax against the scroll */
  drift?: boolean;
  /** Where the field's summit sits, as fractions of the chapter [x, y] */
  focus?: readonly [number, number];
  className?: string;
}) {
  const field = SUMMIT[seed] ? seed : 1;
  return (
    <div
      aria-hidden
      data-art={kind}
      data-drift={drift ? "" : undefined}
      className={`plurel-art pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden [container-type:size] forced-colors:hidden print:hidden ${TONE[tone]} ${className}`}
      style={{ "--art-drift": `${DRIFT[kind]}px` } as CSSProperties}
    >
      <style href="plurel-art" precedence="medium">
        {CSS}
      </style>
      <div className="plurel-art-layer absolute inset-x-0 -inset-y-[var(--art-drift)]">
        {kind === "contours" ? (
          <div className="absolute inset-0 bg-current" style={contourMask(field, tone, focus)} />
        ) : (
          <div className="absolute inset-0" style={{ opacity: STRENGTH.mark[tone] }}>
            <Mark />
          </div>
        )}
      </div>
      {annotate && kind === "contours" ? <Readout seed={field} tone={tone} /> : null}
    </div>
  );
}
