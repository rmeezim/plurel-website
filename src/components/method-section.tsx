import Link from "next/link";
import { ArrowUpRight, Spark } from "@/components/icons";
import { MethodStage, type MethodPhase } from "@/components/method-stage";

const PHASES: MethodPhase[] = [
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
    ai: "AI visibility scan",
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
    ai: "Generative concepting",
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
    ai: "Automation & agent wiring",
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
    ai: "Predictive optimization",
  },
];

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

        {/* Operating model — scroll stage on desktop, timeline elsewhere */}
        <MethodStage phases={PHASES} />

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
