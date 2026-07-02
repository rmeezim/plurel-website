import Link from "next/link";
import { ArrowUpRight, CircledArrow, Spark } from "@/components/icons";

const PHASES = [
  {
    number: "01",
    name: "Diagnose",
    tagline: "Know where you stand",
    description:
      "A presence audit across brand, website, search, and AI visibility — where you win, where you leak, and what to fix first.",
    outputs: [
      "Brand & presence audit",
      "Competitor map",
      "SEO / AEO baseline",
      "Growth gap report",
    ],
  },
  {
    number: "02",
    name: "Design",
    tagline: "Build the visible layer",
    description:
      "Identity, website, and content systems designed as one coherent experience — considered, premium, unmistakably yours.",
    outputs: [
      "Brand identity",
      "Website design",
      "Content architecture",
      "Creative direction",
    ],
  },
  {
    number: "03",
    name: "Deploy",
    tagline: "Launch and integrate",
    description:
      "Ship the new presence and wire the machinery underneath — analytics, CRM, automation, and attribution from day one.",
    outputs: [
      "Site build & QA",
      "Martech stack",
      "Tracking & attribution",
      "Launch PR",
    ],
  },
  {
    number: "04",
    name: "Compound",
    tagline: "Turn presence into growth",
    description:
      "Always-on content, paid, and reputation programs that stack results quarter over quarter — growth that compounds.",
    outputs: [
      "Content engine",
      "Paid media",
      "PR & reputation",
      "Quarterly strategy",
    ],
  },
] as const;

export function MethodSection() {
  return (
    <section
      id="method"
      aria-labelledby="method-heading"
      className="border-t border-line bg-paper"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        {/* Header */}
        <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end lg:gap-x-16">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              <Spark className="size-3.5 text-brand" aria-hidden />
              The Plurel operating model
            </p>
            <h2
              id="method-heading"
              className="mt-5 max-w-[22ch] font-sans text-[clamp(2rem,4.4vw,3.75rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
            >
              One methodology &mdash; from outdated to{" "}
              <em className="font-serif italic">unmissable</em>.
            </h2>
          </div>
          <p className="max-w-[46ch] text-[15px] leading-relaxed text-ink/80 lg:justify-self-end">
            Every engagement runs the same four-phase growth transformation
            &mdash; the framework we&rsquo;re scaling into the AI era, with
            search-and-assistant visibility and a modern martech core built in
            from the start.
          </p>
        </div>

        {/* System map */}
        <div className="relative mt-14 lg:mt-24">
          {/* Flow captions — sit on the rail ends (desktop) */}
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.18em] text-muted lg:absolute lg:-top-9 lg:left-0 lg:mb-0">
            In &mdash; an outdated presence
          </p>
          <p className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-brand lg:absolute lg:-top-9 lg:right-0 lg:block">
            Out &mdash; compounding growth
          </p>

          {/* Horizontal rail (desktop) */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-[7px] hidden h-px bg-line lg:block"
          />
          <span
            aria-hidden
            className="absolute right-0 top-[7px] hidden -translate-y-1/2 rounded-full bg-paper text-brand lg:block"
          >
            <CircledArrow className="size-5" />
          </span>
          {/* Vertical rail (mobile / tablet) */}
          <div
            aria-hidden
            className="absolute bottom-2 left-[6px] top-2 w-px bg-line lg:hidden"
          />

          <ol className="grid grid-cols-1 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
            {PHASES.map((phase) => (
              <li key={phase.number} className="group relative pl-10 lg:pl-0 lg:pt-10">
                {/* Node on the rail */}
                <span
                  aria-hidden
                  className="absolute left-0 top-1 size-3.5 rounded-full bg-brand ring-4 ring-brand/15 lg:top-0"
                />
                <span className="block text-4xl font-normal leading-none tracking-[-0.02em] text-muted/60 transition-colors duration-300 group-hover:text-brand">
                  {phase.number}
                </span>
                <h3 className="mt-3 text-2xl font-normal tracking-[-0.01em] text-ink">
                  {phase.name}
                </h3>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                  {phase.tagline}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink/75">
                  {phase.description}
                </p>

                {/* Output cards */}
                <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                  Outputs
                </p>
                <ul className="mt-3 space-y-2">
                  {phase.outputs.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-sm leading-snug text-ink/80"
                    >
                      <span
                        aria-hidden
                        className="size-1.5 shrink-0 rounded-full bg-brand"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          {/* Mobile flow caption (end) */}
          <p className="mt-8 pl-10 text-[11px] font-medium uppercase tracking-[0.18em] text-brand lg:hidden">
            Out &mdash; compounding growth
          </p>
        </div>

        {/* Footnote */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-line pt-6">
          <p className="max-w-[52ch] text-[13px] leading-relaxed text-muted">
            Built AI-era ready &mdash; AEO, martech, and growth systems are
            part of the method, not an add-on.
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-brand"
          >
            Start with a diagnosis
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
