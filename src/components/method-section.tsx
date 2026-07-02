import Link from "next/link";
import { ArrowUpRight, Spark } from "@/components/icons";

const PHASES = [
  {
    number: "01",
    name: "Diagnose",
    tagline: "Know where you stand",
    description:
      "A presence audit across brand, website, search, and AI visibility — where you win, where you leak, and what to fix first.",
    deliverables: [
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
    deliverables: [
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
    deliverables: [
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
    deliverables: [
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
              The method
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

        {/* Phases */}
        <ol className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {PHASES.map((phase) => (
            <li key={phase.number} className="group relative border-t border-line pt-7">
              {/* Timeline node sitting on the rule */}
              <span
                aria-hidden
                className="absolute -top-[8px] left-0 bg-paper pr-2"
              >
                <Spark className="size-3.5 text-brand" />
              </span>
              <span className="block text-5xl font-normal leading-none tracking-[-0.02em] text-muted/60 transition-colors duration-300 group-hover:text-brand">
                {phase.number}
              </span>
              <h3 className="mt-5 text-2xl font-normal tracking-[-0.01em] text-ink">
                {phase.name}
              </h3>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                {phase.tagline}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/70">
                {phase.description}
              </p>
              <ul className="mt-6 space-y-2">
                {phase.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-[13px] text-muted"
                  >
                    <span
                      aria-hidden
                      className="size-1 shrink-0 rounded-full bg-brand"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

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
