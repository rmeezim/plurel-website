import type { CSSProperties } from "react";
import { SHEET, SUMMIT, TILE } from "@/components/art";
import { asset } from "@/lib/site";

/*
  A journal essay's cover: a survey plate. Each essay gets its own patch
  of the site's contour terrain (public/art, the same survey as the faint
  art behind the homepage's chapters), a pair of survey lines crossing at
  one point, and a mark where they meet: Plurel's ground, read at one
  place. The patch and the point come from the essay's slug, the terrain
  from its category, so essays on one subject share their ground. Static,
  decorative (aria-hidden), and the same with or without JS.
*/

/** The terrain each category is surveyed on (contour fields 1 to 6) */
const FIELD: Record<string, number> = {
  "AI Search": 3,
  "Brand Systems": 5,
  "Growth Strategy": 2,
  Martech: 6,
  Reputation: 4,
};

/** A small, stable number from a string */
function hash(text: string, salt = 0) {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export function Cover({ slug, category, className = "" }: { slug: string; category: string; className?: string }) {
  const field = FIELD[category] ?? 1;
  // the field's summit in one of the sheet's inner stamps, placed in the
  // plate's middle band; the plate turned or mirrored per essay, so
  // essays on one subject share terrain without sharing a view of it
  const col = 1 + Math.floor(hash(slug, 1) * 3);
  const row = 1 + Math.floor(hash(slug, 2) * 2);
  const sx = SUMMIT[field][0] + col * TILE;
  const sy = SUMMIT[field][1] + row * TILE;
  const fx = 0.3 + hash(slug, 3) * 0.4;
  const fy = 0.3 + hash(slug, 4) * 0.4;
  const turn = Math.floor(hash(slug, 5) * 4) * 90;
  const flip = hash(slug, 6) > 0.5 ? -1 : 1;
  const url = `url(${asset(`/art/contours-${field}.svg`)})`;
  const size = `${SHEET.cols * TILE}px ${SHEET.rows * TILE}px`;
  // the layer is twice the plate (half a plate over each edge, so a turn
  // never shows its corners): the summit sits at (fx, fy) of the plate
  const at = `calc(${(0.5 + fx) * 100}cqw - ${sx}px) calc(${(0.5 + fy) * 100}cqh - ${sy}px)`;
  const mask: CSSProperties = {
    maskImage: url,
    WebkitMaskImage: url,
    maskSize: size,
    WebkitMaskSize: size,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: at,
    WebkitMaskPosition: at,
  };
  return (
    <div aria-hidden className={`relative overflow-hidden border border-paper/10 bg-paper/[0.03] forced-colors:hidden ${className}`}>
      <div
        className="absolute inset-0 [container-type:size]"
        style={{ transform: `rotate(${turn}deg) scale(${flip}, 1)`, transformOrigin: `${fx * 100}% ${fy * 100}%` }}
      >
        <div className="absolute -inset-[50%] bg-paper opacity-40" style={mask} />
      </div>
      <div className="absolute inset-y-0 w-px bg-paper/25" style={{ left: `${fx * 100}%` }} />
      <div className="absolute inset-x-0 h-px bg-paper/25" style={{ top: `${fy * 100}%` }} />
      <div className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 bg-signal" style={{ left: `${fx * 100}%`, top: `${fy * 100}%` }} />
    </div>
  );
}
