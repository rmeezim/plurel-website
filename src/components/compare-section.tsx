import { Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";

const CONTRASTS = [
  {
    typical: "Makes things look good",
    plurel: "Redesigns the growth system behind them",
  },
  {
    typical: "Delivers files and handoffs",
    plurel: "Installs systems that keep working",
  },
  {
    typical: "Runs one-off campaigns",
    plurel: "Builds compounding programs, reviewed quarterly",
  },
  {
    typical: "Reports activity",
    plurel: "Reports outcomes tied to pipeline",
  },
  {
    typical: "Optimizes for search engines",
    plurel: "Builds visibility across search and AI answers",
  },
  {
    typical: "Scope ends at launch",
    plurel: "Launch is the midpoint of the method",
  },
] as const;

export function CompareSection() {
  return (
    <section
      id="difference"
      aria-labelledby="difference-heading"
      className="border-t border-line"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-x-16">
          {/* Left: framing */}
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              <Spark className="size-3.5 text-brand" aria-hidden />
              Why teams switch
            </p>
            <h2
              id="difference-heading"
              className="mt-5 max-w-[16ch] font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
            >
              Decoration is not a{" "}
              <em className="font-serif italic">growth strategy</em>.
            </h2>
            <p className="mt-6 max-w-[42ch] text-[15px] leading-relaxed text-ink/80">
              Most agencies are built to produce deliverables. Plurel is built
              to change how your company is found, trusted, chosen, and
              remembered &mdash; and to prove it.
            </p>
          </Reveal>

          {/* Right: the ledger */}
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-x-6 border-b border-line pb-3 sm:gap-x-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                A typical agency
              </p>
              <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-brand">
                <Spark className="size-3" aria-hidden />
                Plurel
              </p>
            </div>
            <ul className="divide-y divide-line">
              {CONTRASTS.map((row) => (
                <li
                  key={row.typical}
                  className="grid grid-cols-2 gap-x-6 py-4 sm:gap-x-10 sm:py-5"
                >
                  <p className="text-[14px] leading-relaxed text-muted sm:text-[15px]">
                    {row.typical}
                  </p>
                  <p className="text-[14px] font-medium leading-relaxed text-ink sm:text-[15px]">
                    {row.plurel}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
