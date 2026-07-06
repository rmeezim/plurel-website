import { Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";

type Glyph =
  | "visibility"
  | "quality"
  | "readiness"
  | "velocity"
  | "reputation"
  | "efficiency";

/**
 * Thin abstract line glyphs — the measurement discipline drawn in the site's
 * schematic language. Deliberately not fake charts with invented numbers.
 */
function MetricGlyph({ kind }: { kind: Glyph }) {
  const base = { fill: "none", stroke: "#fbfaf6", strokeOpacity: 0.3, strokeWidth: 1.25 };
  switch (kind) {
    case "visibility":
      // Broadcast arcs radiating from a source — presence across engines
      return (
        <svg viewBox="0 0 44 44" className="size-11">
          <g {...base} strokeLinecap="round">
            <path d="M15 30 A 11 11 0 0 1 26 19" />
            <path d="M15 30 A 17 17 0 0 1 32 13" />
            <path d="M15 30 A 23 23 0 0 1 38 8" />
          </g>
          <circle cx="15" cy="30" r="3" fill="#bf3a36" />
        </svg>
      );
    case "quality":
      // Filter narrowing to a qualified signal
      return (
        <svg viewBox="0 0 44 44" className="size-11">
          <path
            d="M9 11 H35 L26 23 V33 L18 29 V23 Z"
            fill="none"
            stroke="#fbfaf6"
            strokeOpacity={0.3}
            strokeWidth={1.25}
            strokeLinejoin="round"
          />
          <circle cx="22" cy="31.5" r="2.5" fill="#bf3a36" />
        </svg>
      );
    case "readiness":
      // Gauge with a needle — a readiness score, no number
      return (
        <svg viewBox="0 0 44 44" className="size-11">
          <path
            d="M8 31 A 14 14 0 0 1 36 31"
            fill="none"
            stroke="#fbfaf6"
            strokeOpacity={0.3}
            strokeWidth={1.25}
            strokeLinecap="round"
          />
          <line
            x1="22"
            y1="31"
            x2="31"
            y2="20"
            stroke="#bf3a36"
            strokeWidth={1.25}
            strokeLinecap="round"
          />
          <circle cx="22" cy="31" r="2.5" fill="#bf3a36" />
        </svg>
      );
    case "velocity":
      // Cadence ticks with a rising trend
      return (
        <svg viewBox="0 0 44 44" className="size-11">
          <g {...base} strokeLinecap="round">
            <line x1="9" y1="34" x2="35" y2="34" />
            <line x1="13" y1="34" x2="13" y2="30" />
            <line x1="20" y1="34" x2="20" y2="30" />
            <line x1="27" y1="34" x2="27" y2="30" />
            <line x1="34" y1="34" x2="34" y2="30" />
          </g>
          <path
            d="M11 26 L19 21 L26 23 L35 12"
            fill="none"
            stroke="#bf3a36"
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "reputation":
      // Signal constellation
      return (
        <svg viewBox="0 0 44 44" className="size-11">
          <g {...base}>
            <line x1="22" y1="22" x2="11" y2="12" />
            <line x1="22" y1="22" x2="34" y2="10" />
            <line x1="22" y1="22" x2="36" y2="30" />
            <line x1="22" y1="22" x2="12" y2="33" />
          </g>
          <g fill="#fbfaf6" fillOpacity={0.5}>
            <circle cx="11" cy="12" r="2.2" />
            <circle cx="34" cy="10" r="2.2" />
            <circle cx="36" cy="30" r="2.2" />
            <circle cx="12" cy="33" r="2.2" />
          </g>
          <circle cx="22" cy="22" r="3" fill="#bf3a36" />
        </svg>
      );
    case "efficiency":
      // Target — spend meeting the mark
      return (
        <svg viewBox="0 0 44 44" className="size-11">
          <g {...base}>
            <circle cx="22" cy="22" r="13" />
            <circle cx="22" cy="22" r="7.5" />
          </g>
          <circle cx="22" cy="22" r="2.75" fill="#bf3a36" />
        </svg>
      );
  }
}

const METRICS: { code: string; name: string; desc: string; glyph: Glyph }[] = [
  {
    code: "S·01",
    name: "AI Search Visibility",
    desc: "Track how often the brand appears in answer engines.",
    glyph: "visibility",
  },
  {
    code: "S·02",
    name: "Qualified Inquiry Quality",
    desc: "Measure whether better-fit leads are entering the pipeline.",
    glyph: "quality",
  },
  {
    code: "S·03",
    name: "Conversion Readiness",
    desc: "Score landing pages, CTAs, proof, and offer clarity.",
    glyph: "readiness",
  },
  {
    code: "S·04",
    name: "Content Velocity",
    desc: "Track publishing consistency and distribution strength.",
    glyph: "velocity",
  },
  {
    code: "S·05",
    name: "Reputation Signals",
    desc: "Monitor proof, reviews, PR, founder presence, and trust assets.",
    glyph: "reputation",
  },
  {
    code: "S·06",
    name: "Campaign Efficiency",
    desc: "Measure paid creative, landing page performance, and retargeting.",
    glyph: "efficiency",
  },
];

export function PerformanceSection() {
  return (
    <section
      id="performance"
      aria-labelledby="performance-heading"
      className="bg-ink text-paper"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        {/* Header — the measurement philosophy */}
        <Reveal className="max-w-[640px]">
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
            <Spark className="size-3.5 text-brand" aria-hidden />
            Performance intelligence
          </p>
          <h2
            id="performance-heading"
            className="mt-5 font-sans text-[clamp(2rem,4.4vw,3.75rem)] font-normal leading-[1.05] tracking-[-0.02em]"
          >
            Performance, <em className="italic text-clay">instrumented</em>.
          </h2>
          <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-paper/70 sm:text-base">
            Every engagement is wired to a set of living signals &mdash; so
            growth is something we can see, steer, and compound, not hope for.
          </p>
        </Reveal>

        {/* Measurement dimensions */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {METRICS.map((metric, i) => (
            <Reveal key={metric.code} delay={(i % 3) * 0.08} className="flex">
              <article className="flex w-full flex-col rounded-2xl border border-paper/10 bg-paper/[0.03] p-6 sm:p-7">
                <div className="flex items-start justify-between">
                  <MetricGlyph kind={metric.glyph} />
                  <span className="pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] tabular-nums text-paper/35">
                    {metric.code}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-medium tracking-[-0.01em] text-paper">
                  {metric.name}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-paper/55">
                  {metric.desc}
                </p>
                <div className="mt-7 flex items-center gap-2 border-t border-paper/10 pt-4 sm:mt-auto">
                  <span
                    className="size-1.5 rounded-full bg-brand diagram-blink"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                  <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-paper/40">
                    Tracked continuously
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Closing standard */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-paper/10 pt-6">
          <p className="max-w-[56ch] text-[13px] leading-relaxed text-paper/50">
            Signals are reviewed every quarter against your targets &mdash; what
            compounds gets scaled, what doesn&rsquo;t gets cut.
          </p>
          <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-paper/40">
            <Spark className="size-3 text-brand" aria-hidden />
            A Plurel operating standard
          </span>
        </div>
      </div>
    </section>
  );
}
