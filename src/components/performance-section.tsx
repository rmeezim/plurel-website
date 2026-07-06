import { Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";

type Kind =
  | "visibility"
  | "quality"
  | "readiness"
  | "velocity"
  | "reputation"
  | "efficiency";

/*
 * Wide instrument strips — each signal drawn as a live readout in the
 * site's schematic language, not an icon. Deliberately abstract: no
 * invented numbers, just the shape of what each instrument watches.
 * Motion classes are gated behind prefers-reduced-motion in globals.
 */
function Instrument({ kind, index }: { kind: Kind; index: number }) {
  const faint = {
    fill: "none",
    stroke: "#fbfaf6",
    strokeOpacity: 0.28,
    strokeWidth: 1.25,
  } as const;
  const delay = { animationDelay: `${index * -0.9}s` };
  switch (kind) {
    case "visibility":
      // A source broadcasting; engine ticks answering along the rail
      return (
        <svg viewBox="0 0 340 48" className="h-12 w-full" preserveAspectRatio="xMinYMid meet" aria-hidden>
          <g {...faint} strokeLinecap="round">
            <path d="M18 38 A 12 12 0 0 1 30 26" />
            <path d="M18 38 A 19 19 0 0 1 37 19" />
            <path d="M18 38 A 26 26 0 0 1 44 12" />
          </g>
          <circle cx="18" cy="38" r="3" fill="#bf3a36" />
          <line x1="52" y1="38" x2="330" y2="38" stroke="#fbfaf6" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="3 7" className="diagram-flow" style={delay} />
          {[116, 186, 256, 326].map((x, i) => (
            <g key={x}>
              <line x1={x} y1="38" x2={x} y2="30" stroke="#fbfaf6" strokeOpacity="0.3" strokeWidth="1.25" strokeLinecap="round" />
              <circle cx={x} cy="26" r="2" fill={i === 1 ? "#bf3a36" : "#fbfaf6"} fillOpacity={i === 1 ? 1 : 0.35} className={i === 1 ? "diagram-blink" : undefined} style={i === 1 ? delay : undefined} />
            </g>
          ))}
        </svg>
      );
    case "quality":
      // Wide intake narrowing to one qualified signal
      return (
        <svg viewBox="0 0 340 48" className="h-12 w-full" preserveAspectRatio="xMinYMid meet" aria-hidden>
          <g fill="#fbfaf6">
            <circle cx="16" cy="12" r="2" fillOpacity="0.3" />
            <circle cx="14" cy="24" r="2" fillOpacity="0.45" />
            <circle cx="16" cy="36" r="2" fillOpacity="0.3" />
          </g>
          <path d="M28 8 L172 20" {...faint} strokeDasharray="3 7" className="diagram-flow" style={delay} />
          <path d="M28 40 L172 28" {...faint} strokeDasharray="3 7" className="diagram-flow" style={{ animationDelay: `${index * -0.9 - 0.6}s` }} />
          <path d="M172 20 L172 28" {...faint} />
          <line x1="172" y1="24" x2="296" y2="24" stroke="#fbfaf6" strokeOpacity="0.35" strokeWidth="1.25" />
          <circle cx="306" cy="24" r="3" fill="#bf3a36" />
          <circle cx="306" cy="24" r="7" fill="none" stroke="#bf3a36" strokeOpacity="0.35" strokeWidth="1" className="diagram-blink" style={delay} />
        </svg>
      );
    case "readiness":
      // A scored meter — ticks, filled span, marker at the current read
      return (
        <svg viewBox="0 0 340 48" className="h-12 w-full" preserveAspectRatio="xMinYMid meet" aria-hidden>
          <line x1="12" y1="28" x2="330" y2="28" stroke="#fbfaf6" strokeOpacity="0.18" strokeWidth="1.25" />
          {[12, 65, 118, 171, 224, 277, 330].map((x) => (
            <line key={x} x1={x} y1="33" x2={x} y2="23" stroke="#fbfaf6" strokeOpacity="0.28" strokeWidth="1" />
          ))}
          <line x1="12" y1="28" x2="218" y2="28" stroke="#fbfaf6" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
          <line x1="218" y1="36" x2="218" y2="14" stroke="#bf3a36" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="218" cy="10" r="2.5" fill="#bf3a36" className="diagram-blink" style={delay} />
        </svg>
      );
    case "velocity":
      // Publishing cadence with a travelling read along the trend
      return (
        <svg viewBox="0 0 340 48" className="h-12 w-full" preserveAspectRatio="xMinYMid meet" aria-hidden>
          <line x1="12" y1="38" x2="330" y2="38" stroke="#fbfaf6" strokeOpacity="0.18" strokeWidth="1.25" />
          {[50, 106, 162, 218, 274].map((x) => (
            <line key={x} x1={x} y1="38" x2={x} y2="32" stroke="#fbfaf6" strokeOpacity="0.3" strokeWidth="1" />
          ))}
          <path d="M12 30 L88 24 L168 27 L248 13 L330 8" {...faint} strokeLinejoin="round" />
          <path d="M12 30 L88 24 L168 27 L248 13 L330 8" fill="none" stroke="#bf3a36" strokeWidth="1.5" strokeLinecap="round" pathLength={100} className="method-pulse" style={{ strokeDasharray: "10 100", animationDuration: "4.5s", ...delay }} />
        </svg>
      );
    case "reputation":
      // Trust constellation accumulating around the brand
      return (
        <svg viewBox="0 0 340 48" className="h-12 w-full" preserveAspectRatio="xMinYMid meet" aria-hidden>
          <g {...faint} strokeOpacity="0.2">
            <line x1="170" y1="24" x2="34" y2="12" />
            <line x1="170" y1="24" x2="90" y2="38" />
            <line x1="170" y1="24" x2="244" y2="10" />
            <line x1="170" y1="24" x2="290" y2="36" />
            <line x1="170" y1="24" x2="326" y2="16" />
          </g>
          {[
            [34, 12, 0],
            [90, 38, 1],
            [244, 10, 2],
            [290, 36, 3],
            [326, 16, 4],
          ].map(([x, y, i]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill="#fbfaf6" fillOpacity="0.5" className="diagram-blink" style={{ animationDelay: `${i * -0.7 + index * -0.3}s` }} />
          ))}
          <circle cx="170" cy="24" r="3.5" fill="#bf3a36" />
        </svg>
      );
    case "efficiency":
      // Spend routed into a target — input meeting the mark
      return (
        <svg viewBox="0 0 340 48" className="h-12 w-full" preserveAspectRatio="xMinYMid meet" aria-hidden>
          <line x1="12" y1="24" x2="266" y2="24" stroke="#fbfaf6" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="3 7" className="diagram-flow" style={delay} />
          <g {...faint}>
            <circle cx="290" cy="24" r="16" />
            <circle cx="290" cy="24" r="9" />
          </g>
          <circle cx="290" cy="24" r="3" fill="#bf3a36" className="diagram-blink" style={delay} />
        </svg>
      );
  }
}

const SIGNALS: { code: string; name: string; question: string; kind: Kind }[] =
  [
    {
      code: "S·01",
      name: "AI Search Visibility",
      question: "How often do answer engines surface and cite the brand?",
      kind: "visibility",
    },
    {
      code: "S·02",
      name: "Qualified Inquiry Quality",
      question: "Are better-fit buyers entering the pipeline?",
      kind: "quality",
    },
    {
      code: "S·03",
      name: "Conversion Readiness",
      question: "Do pages, proof, and offers turn attention into action?",
      kind: "readiness",
    },
    {
      code: "S·04",
      name: "Content Velocity",
      question: "Is publishing consistent — and is distribution compounding?",
      kind: "velocity",
    },
    {
      code: "S·05",
      name: "Reputation Signals",
      question: "Is third-party trust accumulating where buyers check?",
      kind: "reputation",
    },
    {
      code: "S·06",
      name: "Campaign Efficiency",
      question: "Is paid spend meeting the mark it's aimed at?",
      kind: "efficiency",
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
            growth is something we can see, steer, and compound, not hope
            for.
          </p>
        </Reveal>

        {/* The signal console — one instrument panel, hairline divisions */}
        <Reveal delay={0.1} className="mt-12 sm:mt-14">
          <div className="overflow-hidden rounded-3xl border border-paper/15">
            {/* Console title strip */}
            <div className="flex items-center justify-between border-b border-paper/15 px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em]">
              <span className="text-paper/50">
                Signal console &mdash; every engagement
              </span>
              <span className="flex items-center gap-1.5 text-paper/80">
                <Spark className="size-3 text-brand" aria-hidden />
                SIG&middot;06
              </span>
            </div>

            {/* Instrument cells — panel color shows through 1px gaps */}
            <div className="grid grid-cols-1 gap-px bg-paper/15 sm:grid-cols-2 lg:grid-cols-3">
              {SIGNALS.map((signal, i) => (
                <article key={signal.code} className="bg-ink p-6 sm:p-7">
                  <div className="flex items-center justify-between text-[9.5px] font-semibold uppercase tracking-[0.18em]">
                    <span className="tabular-nums text-paper/40">
                      {signal.code}
                    </span>
                    <span className="flex items-center gap-1.5 text-paper/40">
                      <span
                        className="diagram-blink size-1 rounded-full bg-brand"
                        style={{ animationDelay: `${i * 0.4}s` }}
                      />
                      Live
                    </span>
                  </div>
                  <h3 className="mt-4 text-[16px] font-medium tracking-[-0.01em] text-paper sm:text-[17px]">
                    {signal.name}
                  </h3>
                  <p className="mt-1.5 min-h-[2lh] text-[13px] leading-relaxed text-paper/55">
                    {signal.question}
                  </p>
                  <div className="mt-5 border-t border-dashed border-paper/10 pt-4">
                    <Instrument kind={signal.kind} index={i} />
                  </div>
                </article>
              ))}
            </div>

            {/* Console footer — the operating standard */}
            <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-paper/15 px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/45">
              <span>
                Reviewed quarterly &mdash; what compounds gets scaled, what
                doesn&rsquo;t gets cut
              </span>
              <span className="flex items-center gap-2">
                <Spark className="size-3 text-brand" aria-hidden />A Plurel
                operating standard
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
