import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { Arrive } from "@/components/type-reveal";

/*
  Plurel system primitives: Cinematic Red x Swiss Systems.

  - CONTAINER and GRID are the Swiss frame. Every chapter lays its content
    on GRID. The grid is never drawn: it shows only through alignment.
  - Kicker is the chapter label: a square marker and a sentence-case
    label. A chapter carries one at most (ChapterHead), or none when its
    headline names it. Below the fold it arrives just before its
    headline: the square lights, then the label is plotted (type-reveal.tsx).
  - Meta is Plurel's own Swiss metadata voice (mono, small caps), kept for
    data: dates, units, tags, counts with a real order. Never a caption
    that only announces what follows.
  - Tones: "paper" (light chapters), "red" (brand chapters), "dark"
    (graphite chapters).
*/

export const CONTAINER = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12";
export const GRID =
  "grid grid-cols-4 gap-x-5 sm:grid-cols-6 sm:gap-x-6 lg:grid-cols-12 lg:gap-x-8";

/**
 * One scale for every chapter headline (the hero and the closing keep
 * their own): 36px on a phone, 64px from a wide laptop up.
 */
export const H2 = "type-display leading-none text-[clamp(2.25rem,1.6rem+2.6vw,4rem)]";

export type Tone = "paper" | "red" | "dark";

const KICKER_TONE: Record<Tone, { text: string; mark: string }> = {
  paper: { text: "text-ink/70", mark: "bg-brand" },
  red: { text: "text-paper", mark: "bg-paper" },
  dark: { text: "text-paper", mark: "bg-signal" },
};

/**
 * Chapter label: square marker + sentence-case label. Server markup; its
 * arrival (the square lights, the label is plotted) is CSS armed by
 * <Arrive>, and it renders finished without JS, under reduced motion and
 * when on screen at load. `chars`, the label's length, sets how long it
 * takes to plot; a plain-text label gives its own.
 */
export function Kicker({
  children,
  tone = "paper",
  chars,
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  chars?: number;
  className?: string;
}) {
  const t = KICKER_TONE[tone];
  return (
    <Arrive
      as="p"
      chars={chars ?? (typeof children === "string" ? children.length : undefined)}
      className={`flex items-center gap-2.5 text-[14px] font-medium leading-none tracking-[-0.005em] sm:text-[15px] ${t.text} ${className}`}
    >
      <span aria-hidden className={`kicker-mark size-[7px] shrink-0 ${t.mark}`} />
      <span className="kicker-label">
        <span className="kicker-text">{children}</span>
      </span>
    </Arrive>
  );
}

/** Swiss metadata: mono caps for data only (dates, units, tags, real order) */
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
      className={`font-mono text-[11px] uppercase leading-snug tracking-[0.03em] ${className}`}
    >
      {children}
    </Tag>
  );
}

/**
 * The one quieter phrase in a headline: the same face and weight, set back
 * by tone alone (the caller's color, e.g. text-fog on graphite), never by a
 * lighter weight or a second typeface. Reserved for the hero and the
 * closing.
 */
export function Accent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <em className={`type-accent not-italic ${className}`}>{children}</em>;
}

type CtaVariant = "solid" | "paper" | "outline" | "outline-light";

const CTA_VARIANT: Record<CtaVariant, string> = {
  solid: "bg-brand text-paper hover:bg-ember",
  paper: "bg-paper text-ink hover:bg-blush",
  outline: "border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  "outline-light":
    "border border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink",
};

/** Primary action: sharp block, sentence case, diagonal arrow */
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
  size?: "md" | "lg" | "xl";
  className?: string;
}) {
  const sizing =
    size === "xl"
      ? "h-16 gap-6 px-6 text-[17px] tracking-[-0.01em]"
      : size === "lg"
        ? "h-12 gap-6 px-6 text-[15px]"
        : "h-10 gap-4 px-4 text-[14px]";
  return (
    <Link
      href={href}
      className={`group inline-flex shrink-0 items-center justify-between font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${sizing} ${CTA_VARIANT[variant]} ${className}`}
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

/** Secondary action: sentence case on an underline, straight arrow */
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
      className={`group inline-flex min-h-11 items-center gap-2 border-b pb-1 text-[15px] font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${TEXT_TONE[tone]} ${className}`}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

/**
 * Chapter label: the one quiet line that names a chapter ("Services",
 * "Method"), set as a Kicker. No number, no running head, no ruler: the
 * headline below carries the chapter. `index` and `meta` are accepted
 * only so older callers keep compiling; neither renders.
 */
export function ChapterHead({
  label,
  tone = "paper",
  id,
  className = "",
}: {
  label: string;
  tone?: Tone;
  id?: string;
  className?: string;
  /** @deprecated chapter numbers are retired; ignored */
  index?: string;
  /** @deprecated running heads are retired; ignored */
  meta?: string;
}) {
  return (
    <Kicker tone={tone} chars={label.length} className={className}>
      <span id={id}>{label}</span>
    </Kicker>
  );
}
