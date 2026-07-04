import { Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";

/** The nine connected stages of the Plurel growth system, in flow order */
const STAGES = [
  { number: "01", name: "Brand", desc: "Positioning, identity, narrative" },
  {
    number: "02",
    name: "Website",
    desc: "Conversion architecture and digital experience",
  },
  {
    number: "03",
    name: "AI Search",
    desc: "SEO, AEO, answer-engine visibility",
  },
  {
    number: "04",
    name: "Content",
    desc: "Thought leadership and demand creation",
  },
  {
    number: "05",
    name: "Paid Growth",
    desc: "Campaigns, funnels, creative testing",
  },
  { number: "06", name: "CRM", desc: "Lead capture, routing, follow-up" },
  {
    number: "07",
    name: "Automation",
    desc: "Workflows and marketing operations",
  },
  {
    number: "08",
    name: "Analytics",
    desc: "Attribution, reporting, performance insight",
  },
  {
    number: "09",
    name: "Reputation",
    desc: "PR, trust signals, market authority",
  },
] as const;

function StageCard({
  number,
  name,
  desc,
}: {
  number: string;
  name: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-paper p-4 shadow-[0_14px_30px_-22px_rgba(17,15,10,0.45)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
        {number}
      </p>
      <p className="mt-1.5 text-[15px] font-medium leading-tight tracking-[-0.01em] text-ink">
        {name}
      </p>
      <p className="mt-1 text-[11px] leading-snug text-muted">{desc}</p>
    </div>
  );
}

export function GrowthSystemSection() {
  return (
    <section
      id="growth-system"
      aria-labelledby="growth-heading"
      className="overflow-x-clip border-t border-line"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        {/* Header — centered */}
        <Reveal className="mx-auto max-w-[680px] text-center">
          <p className="flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            <Spark className="size-3.5 text-brand" aria-hidden />
            The system behind the brand
          </p>
          <h2
            id="growth-heading"
            className="mt-5 font-sans text-[clamp(2rem,4.4vw,3.75rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
          >
            The Plurel{" "}
            <em className="font-serif italic">Growth System</em>
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-[15px] leading-relaxed text-ink/75 sm:text-base">
            A connected system for how modern companies are found, trusted,
            chosen, and remembered.
          </p>
        </Reveal>

        {/* Horizontal system map — alternating timeline on desktop */}
        <Reveal>
          <div
            aria-hidden
            className="relative mt-10 hidden lg:block"
            style={{ height: 360 }}
          >
            {/* Spine — faded at both ends */}
            <div
              className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
              style={{
                background:
                  "linear-gradient(to right, transparent, var(--color-line) 5%, var(--color-line) 95%, transparent)",
              }}
            />
            {/* Soft brand pulse sweeping the spine */}
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 overflow-hidden">
              <span className="growth-pulse absolute top-0 h-px w-28 bg-gradient-to-r from-transparent via-brand to-transparent" />
            </div>
            {/* Direction arrowhead at the right end */}
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-line">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 2 L8 6 L2 10"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            {/* Nodes + cards */}
            <div className="grid h-full grid-cols-9">
              {STAGES.map((stage, i) => {
                const above = i % 2 === 0;
                return (
                  <div key={stage.number} className="relative">
                    {/* Stem */}
                    <span
                      className={`absolute left-1/2 w-px -translate-x-1/2 bg-line ${
                        above ? "bottom-1/2 h-8" : "top-1/2 h-8"
                      }`}
                    />
                    {/* Node on the spine */}
                    <span className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand ring-4 ring-brand/10" />
                    {/* Card */}
                    <div
                      className={`absolute left-1/2 w-[170px] -translate-x-1/2 ${
                        above ? "bottom-1/2 mb-8" : "top-1/2 mt-8"
                      }`}
                    >
                      <StageCard {...stage} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Vertical spine — mobile / tablet */}
        <div className="relative mt-12 lg:hidden">
          <div
            aria-hidden
            className="absolute bottom-2 left-[7px] top-2 w-px bg-line"
          />
          <ol className="space-y-6">
            {STAGES.map((stage) => (
              <li key={stage.number} className="relative pl-9">
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 size-3.5 rounded-full bg-brand ring-4 ring-brand/15"
                />
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  {stage.number}
                </p>
                <p className="mt-0.5 text-lg font-medium tracking-[-0.01em] text-ink">
                  {stage.name}
                </p>
                <p className="mt-0.5 text-[13px] leading-snug text-muted">
                  {stage.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
