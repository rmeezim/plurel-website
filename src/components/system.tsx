import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "@/components/icons";

/*
  Plurel system primitives: Cinematic Red x Swiss Systems.

  - CONTAINER and GRID are the Swiss frame. Every chapter lays its content
    on GRID. The grid is never drawn: it shows through alignment, the
    hairline running heads, and the mono indexes.
  - Kicker is the Northeon family label (square marker, tracked caps).
  - Meta is Plurel's own Swiss metadata voice (mono, small caps).
  - Tones: "paper" (light chapters), "red" (brand chapters, hero),
    "dark" (oxblood and ink chapters).
*/

export const CONTAINER = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12";
export const GRID =
  "grid grid-cols-4 gap-x-5 sm:grid-cols-6 sm:gap-x-6 lg:grid-cols-12 lg:gap-x-8";

export type Tone = "paper" | "red" | "dark";

const KICKER_TONE: Record<Tone, { text: string; mark: string }> = {
  paper: { text: "text-ink/70", mark: "bg-brand" },
  red: { text: "text-paper/85", mark: "bg-paper" },
  dark: { text: "text-paper/70", mark: "bg-signal" },
};

/** Family label: square marker + tracked caps */
export function Kicker({
  children,
  tone = "paper",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const t = KICKER_TONE[tone];
  return (
    <p
      className={`flex items-center gap-3 text-[11px] font-medium uppercase leading-none tracking-[0.2em] ${t.text} ${className}`}
    >
      <span aria-hidden className={`size-[7px] shrink-0 ${t.mark}`} />
      {children}
    </p>
  );
}

/** Swiss metadata: mono caps for indexes, counts, clocks, parentheticals */
export function Meta({
  children,
  className = "",
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: "span" | "p" | "dt" | "dd" | "li";
}) {
  return (
    <Tag
      className={`font-mono text-[11px] uppercase leading-snug tracking-[0.06em] ${className}`}
    >
      {children}
    </Tag>
  );
}

/** The human accent: one serif italic phrase inside a sans headline */
export function Accent({ children }: { children: ReactNode }) {
  return (
    <em className="font-serif text-[1.08em] font-normal italic leading-[0.85] tracking-[-0.01em]">
      {children}
    </em>
  );
}

type CtaVariant = "solid" | "paper" | "outline" | "outline-light";

const CTA_VARIANT: Record<CtaVariant, string> = {
  solid: "bg-brand text-paper hover:bg-ember",
  paper: "bg-paper text-ink hover:bg-blush",
  outline: "border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  "outline-light":
    "border border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink",
};

/** Primary action: sharp block, tracked caps, diagonal arrow */
export function CtaLink({
  href,
  children,
  variant = "solid",
  size = "lg",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: CtaVariant;
  size?: "md" | "lg";
  className?: string;
}) {
  const sizing =
    size === "lg"
      ? "h-14 gap-4 px-7 text-[12px] tracking-[0.18em]"
      : "h-11 gap-3 px-5 text-[11px] tracking-[0.18em]";
  return (
    <Link
      href={href}
      className={`group inline-flex shrink-0 items-center justify-between font-medium uppercase transition-colors duration-300 ${sizing} ${CTA_VARIANT[variant]} ${className}`}
    >
      {children}
      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

const TEXT_TONE: Record<Tone, string> = {
  paper: "text-ink border-brand",
  red: "text-paper border-paper/70",
  dark: "text-paper border-signal",
};

/** Secondary action: tracked caps on an underline, straight arrow */
export function TextLink({
  href,
  children,
  tone = "paper",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 border-b pb-2 text-[12px] font-medium uppercase tracking-[0.18em] ${TEXT_TONE[tone]} ${className}`}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

const HEAD_TONE: Record<Tone, { rule: string; tick: string; index: string; meta: string }> = {
  paper: { rule: "border-ink/15", tick: "border-ink/30", index: "text-brand", meta: "text-muted" },
  red: { rule: "border-paper/25", tick: "border-paper/50", index: "text-paper", meta: "text-blush" },
  dark: { rule: "border-paper/15", tick: "border-paper/35", index: "text-signal", meta: "text-paper/50" },
};

/* Column ticks: one short mark per grid column on the running-head
   hairline, like registration marks on a print. The only place the grid
   is ever drawn. Which ticks show follows GRID (4 / 6 / 12 columns), and
   the last visible column also marks its right edge. */
const TICK_COLUMN = Array.from({ length: 12 }, (_, i) => {
  const show = i < 4 ? "block" : i < 6 ? "hidden sm:block" : "hidden lg:block";
  const close =
    i === 3
      ? "border-r sm:border-r-0"
      : i === 5
        ? "sm:border-r lg:border-r-0"
        : i === 11
          ? "lg:border-r"
          : "";
  return `${show} ${close}`;
});

/**
 * Chapter header: the Swiss running head that opens every section.
 * (02)  ■ SERVICES                         EIGHT DISCIPLINES · ONE SYSTEM
 */
export function ChapterHead({
  index,
  label,
  meta,
  tone = "paper",
  id,
}: {
  index: string;
  label: string;
  meta?: string;
  tone?: Tone;
  id?: string;
}) {
  const t = HEAD_TONE[tone];
  return (
    <div className={`${GRID} relative items-center border-t pt-5 ${t.rule}`}>
      <div aria-hidden data-ticks="" className={`${GRID} pointer-events-none absolute inset-x-0 top-0`}>
        {TICK_COLUMN.map((cls, i) => (
          <span key={i} className={`h-[6px] border-l ${t.tick} ${cls}`} />
        ))}
      </div>
      <Meta className={`col-span-1 sm:col-span-1 lg:col-span-2 ${t.index}`}>
        ({index})
      </Meta>
      <div className="col-span-3 sm:col-span-3 lg:col-span-6">
        <Kicker tone={tone}>
          <span id={id}>{label}</span>
        </Kicker>
      </div>
      {meta && (
        <Meta
          className={`col-span-2 hidden text-right sm:block lg:col-span-4 ${t.meta}`}
        >
          {meta}
        </Meta>
      )}
    </div>
  );
}
