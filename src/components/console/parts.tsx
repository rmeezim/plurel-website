"use client";

import type { ReactNode } from "react";

/*
  Small parts the instruments share inside their console: a toggle chip
  for a mode or an input, a readout figure (a label over a tabular
  number), and a legend key. Sentence case, 13px and up.
*/

export function Chip({
  on,
  onClick,
  children,
  title,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      title={title}
      onClick={onClick}
      className={`inline-flex h-8 items-center gap-2 border px-2.5 text-[13px] font-medium leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper ${
        on ? "border-paper bg-paper text-ink" : "border-paper/20 text-paper hover:border-paper/60"
      }`}
    >
      {children}
    </button>
  );
}

export function Figure({ label, value, tone = "paper", sub }: { label: string; value: ReactNode; tone?: "paper" | "signal" | "fog"; sub?: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[13px] leading-[1.3] text-fog">{label}</p>
      <p
        className={`mt-1 font-mono text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] leading-none tabular-nums ${
          tone === "signal" ? "text-signal" : tone === "fog" ? "text-fog" : "text-paper"
        }`}
      >
        {value}
      </p>
      {sub && <p className="mt-1.5 text-[13px] leading-[1.35] text-fog">{sub}</p>}
    </div>
  );
}

export function Key({ swatch, children }: { swatch: "paper" | "signal" | "dim" | "hollow" | "line"; children: ReactNode }) {
  const s =
    swatch === "signal"
      ? "size-[8px] bg-signal"
      : swatch === "dim"
        ? "size-[8px] bg-paper/30"
        : swatch === "hollow"
          ? "size-[8px] border border-paper/60"
          : swatch === "line"
            ? "h-px w-3 bg-paper/70"
            : "size-[8px] bg-paper";
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] leading-none text-fog">
      <span aria-hidden className={s} />
      {children}
    </span>
  );
}

/** A quiet row of controls above an instrument's body */
export function Controls({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-paper/12 px-3 py-2.5 sm:px-4 ${className}`}>{children}</div>;
}
