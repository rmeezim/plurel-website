import { Spark } from "@/components/icons";
import type { CoverKind } from "@/lib/posts";

/**
 * Category-themed cover compositions for journal articles. Scales with its
 * container — the parent sets the aspect ratio and rounding. Decorative:
 * render inside an aria-hidden container.
 */
export function PostCover({ kind }: { kind: CoverKind }) {
  switch (kind) {
    case "ai-search":
      // Query pill, answer lines, rising visibility bars
      return (
        <span className="flex h-full w-full flex-col bg-charcoal p-[6%]">
          <span className="flex h-[13%] w-3/4 items-center gap-[3%] rounded-full bg-paper/10 px-[4%]">
            <span className="aspect-square h-[45%] rounded-full border border-paper/50" />
            <span className="h-[18%] w-2/5 rounded-full bg-paper/25" />
          </span>
          <span className="mt-[4%] space-y-[2.5%]">
            <span className="block h-[3.5%] min-h-1 w-1/2 rounded-full bg-paper/20" />
            <span className="block h-[3.5%] min-h-1 w-2/5 rounded-full bg-paper/15" />
          </span>
          <span className="mt-auto flex h-1/3 w-2/5 items-end gap-[3%] self-end">
            <span style={{ height: "34%" }} className="flex-1 rounded-t-md bg-paper/20" />
            <span style={{ height: "52%" }} className="flex-1 rounded-t-md bg-paper/20" />
            <span style={{ height: "72%" }} className="flex-1 rounded-t-md bg-paper/20" />
            <span style={{ height: "100%" }} className="flex-1 rounded-t-md bg-brand" />
          </span>
        </span>
      );
    case "brand-systems":
      // Identity system tiles
      return (
        <span className="grid h-full w-full grid-cols-2 gap-[3%] bg-ink p-[5%]">
          <span className="flex items-center justify-center rounded-lg bg-brand">
            <Spark className="size-[28%] text-paper" />
          </span>
          <span className="flex items-center justify-center rounded-lg bg-paper font-serif text-[clamp(1rem,4vw,2rem)] leading-none text-ink">
            Aa
          </span>
          <span className="flex items-center justify-center gap-[6%] rounded-lg bg-charcoal">
            <span className="aspect-square w-[12%] rounded-full bg-brand" />
            <span className="aspect-square w-[12%] rounded-full bg-clay" />
            <span className="aspect-square w-[12%] rounded-full bg-paper" />
          </span>
          <span className="flex items-center justify-center rounded-lg bg-clay text-[clamp(0.5rem,1.4vw,0.8rem)] font-semibold tracking-[0.3em] text-ink">
            PLU
          </span>
        </span>
      );
    case "growth-strategy":
      // Ascending performance bars
      return (
        <span className="flex h-full w-full items-end gap-[4%] bg-paper p-[7%]">
          <span style={{ height: "26%" }} className="flex-1 rounded-t-md bg-line" />
          <span style={{ height: "42%" }} className="flex-1 rounded-t-md bg-line" />
          <span style={{ height: "58%" }} className="flex-1 rounded-t-md bg-clay" />
          <span style={{ height: "76%" }} className="flex-1 rounded-t-md bg-clay" />
          <span style={{ height: "100%" }} className="flex-1 rounded-t-md bg-brand" />
        </span>
      );
    case "martech":
      // Stacked system layers
      return (
        <span className="flex h-full w-full flex-col justify-center gap-[5%] bg-charcoal p-[9%]">
          <span className="h-[9%] min-h-1.5 w-full rounded-full bg-paper/20" />
          <span className="ml-[6%] h-[9%] min-h-1.5 w-[82%] rounded-full bg-clay" />
          <span className="ml-[12%] h-[9%] min-h-1.5 w-[64%] rounded-full bg-brand" />
        </span>
      );
    case "reputation":
      // Trust signal constellation
      return (
        <span className="block h-full w-full bg-rust p-[3%]">
          <svg viewBox="0 0 100 64" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
            <g stroke="#fbfaf6" strokeOpacity="0.35" strokeWidth="0.75">
              <line x1="50" y1="34" x2="15" y2="12" />
              <line x1="50" y1="34" x2="58" y2="8" />
              <line x1="50" y1="34" x2="86" y2="14" />
              <line x1="50" y1="34" x2="89" y2="48" />
              <line x1="50" y1="34" x2="18" y2="52" />
            </g>
            <g fill="#fbfaf6" fillOpacity="0.7">
              <circle cx="15" cy="12" r="2.4" />
              <circle cx="58" cy="8" r="2.4" />
              <circle cx="86" cy="14" r="2.4" />
              <circle cx="89" cy="48" r="2.4" />
              <circle cx="18" cy="52" r="2.4" />
            </g>
            <circle cx="50" cy="34" r="5.5" fill="#110f0a" />
            <circle cx="50" cy="34" r="1.8" fill="#fbfaf6" />
          </svg>
        </span>
      );
  }
}
