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

/**
 * Each variant: the whole control, its label, and its arrow cell. A filled
 * action is two tones, the label and a deeper square for the arrow, like a
 * key and its port; an outlined one draws the same split as a hairline.
 */
const CTA_VARIANT: Record<CtaVariant, { root: string; label: string; cell: string }> = {
  solid: {
    root: "text-paper",
    label: "bg-brand group-hover:bg-ember",
    cell: "bg-ember",
  },
  paper: {
    root: "text-ink",
    label: "bg-paper group-hover:bg-blush",
    cell: "bg-blush",
  },
  outline: {
    root: "border border-ink/25 text-ink hover:border-ink",
    label: "group-hover:bg-ink/[0.04]",
    cell: "border-l border-ink/25 group-hover:border-ink",
  },
  "outline-light": {
    root: "border border-paper/35 text-paper hover:border-paper",
    label: "group-hover:bg-paper/[0.06]",
    cell: "border-l border-paper/35 group-hover:border-paper",
  },
};

const CTA_SIZE = {
  md: { root: "h-10 text-[14px]", label: "px-4" },
  lg: { root: "h-11 text-[15px]", label: "px-[18px]" },
} as const;

/**
 * An action: a compact, sharp control in sentence case, the label beside a
 * square arrow cell (diagonal for a step out, straight for a page on the
 * site). `solid` is the one primary action per view; a secondary beside it
 * is `outline-light` on graphite and red, `outline` on paper.
 */
export function CtaLink({
  href,
  children,
  variant = "solid",
  size = "md",
  arrow = "up-right",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: CtaVariant;
  size?: keyof typeof CTA_SIZE;
  arrow?: "up-right" | "right";
  className?: string;
}) {
  const v = CTA_VARIANT[variant];
  const s = CTA_SIZE[size];
  const Icon = arrow === "right" ? ArrowRight : ArrowUpRight;
  return (
    <Link
      href={href}
      className={`group inline-flex shrink-0 items-stretch font-medium leading-none tracking-[-0.005em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${s.root} ${v.root} ${className}`}
    >
      <span className={`flex flex-1 items-center transition-colors duration-300 ${s.label} ${v.label}`}>
        {children}
      </span>
      <span aria-hidden className={`grid aspect-square place-items-center transition-colors duration-300 ${v.cell}`}>
        <Icon
          className={`size-3.5 transition-transform duration-300 ${
            arrow === "right"
              ? "motion-safe:group-hover:translate-x-0.5"
              : "motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
          }`}
        />
      </span>
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
