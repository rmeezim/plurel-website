import { Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";

/*
 * A rest for the eye — the pacing layer of the design system. One huge
 * line, a tall surface, and nothing else to read. Placed between dense
 * organs (ledgers, consoles, chapters) so pages breathe. The line is the
 * only content; keep it under ~8 words with one italic accent.
 */

type Surface = "ink" | "charcoal" | "brand" | "clay";

const SURFACES: Record<
  Surface,
  { section: string; kicker: string; spark: string; note: string }
> = {
  ink: {
    section: "bg-ink text-paper",
    kicker: "text-paper/50",
    spark: "text-paper/[0.05]",
    note: "text-paper/40",
  },
  charcoal: {
    section: "bg-charcoal text-paper",
    kicker: "text-paper/50",
    spark: "text-paper/[0.05]",
    note: "text-paper/40",
  },
  brand: {
    section: "bg-brand text-paper",
    kicker: "text-paper/70",
    spark: "text-paper/10",
    note: "text-paper/60",
  },
  clay: {
    section: "bg-clay text-ink",
    kicker: "text-ink/55",
    spark: "text-ink/[0.06]",
    note: "text-ink/50",
  },
};

export function StatementSection({
  kicker,
  note,
  surface = "ink",
  footer,
  children,
}: {
  kicker?: string;
  /** Small annotation under the line — a house code or one short clause */
  note?: string;
  surface?: Surface;
  /** Optional slot for a single link */
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const s = SURFACES[surface];
  return (
    <section aria-label={kicker} className={`relative overflow-hidden ${s.section}`}>
      <Spark
        aria-hidden
        className={`absolute -bottom-32 -left-24 size-[420px] -rotate-12 ${s.spark}`}
      />
      <div className="relative mx-auto flex min-h-[52vh] w-full max-w-[1440px] flex-col justify-center px-5 py-24 sm:px-8 lg:min-h-[60vh] lg:px-12 lg:py-32">
        {kicker && (
          <Reveal>
            <p
              className={`flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] ${s.kicker}`}
            >
              <Spark className="size-3.5 text-brand" aria-hidden />
              {kicker}
            </p>
          </Reveal>
        )}
        <Reveal delay={0.08}>
          <p className="mt-7 max-w-[16ch] font-sans text-[clamp(2.75rem,7vw,6.5rem)] font-normal leading-[1.0] tracking-[-0.03em]">
            {children}
          </p>
        </Reveal>
        {(note || footer) && (
          <Reveal
            delay={0.16}
            className="mt-9 flex flex-wrap items-center gap-x-10 gap-y-4"
          >
            {note && (
              <p
                className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${s.note}`}
              >
                {note}
              </p>
            )}
            {footer}
          </Reveal>
        )}
      </div>
    </section>
  );
}
