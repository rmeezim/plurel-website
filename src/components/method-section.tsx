import Link from "next/link";
import { ArrowUpRight, Spark } from "@/components/icons";
import { MethodStage, type MethodPhase } from "@/components/method-stage";
import { Reveal } from "@/components/reveal";

const PHASES: MethodPhase[] = [
  {
    number: "01",
    name: "Diagnose",
    tagline: "Know where you stand",
    description:
      "A presence audit across brand, website, search, and AI visibility — where you win, where you leak, and what to fix first.",
    outputs: [
      {
        label: "Brand & presence audit",
        detail:
          "A scored review of your identity, website, and profiles — what builds trust today and what quietly leaks it.",
      },
      {
        label: "Competitor map",
        detail:
          "Who you're actually compared against, and exactly where they beat you on visibility, clarity, and proof.",
      },
      {
        label: "SEO / AEO baseline",
        detail:
          "Your current rankings, plus how AI assistants answer your category's buying questions right now.",
      },
      {
        label: "Growth gap report",
        detail:
          "The prioritized fix list — what to tackle first, and the projected impact of each move.",
      },
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
      {
        label: "Brand identity",
        detail:
          "Logo, color, type, and usage rules — a system your team can apply without guesswork.",
      },
      {
        label: "Website design",
        detail:
          "Page-by-page UX and UI, designed around the actions you need visitors to take.",
      },
      {
        label: "Content architecture",
        detail:
          "The page map, messaging hierarchy, and templates your content will live in.",
      },
      {
        label: "Creative direction",
        detail:
          "The photography, illustration, and motion language that keeps every touchpoint unmistakably yours.",
      },
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
      {
        label: "Site build & QA",
        detail:
          "The site engineered fast and accessible, tested across devices before it ships.",
      },
      {
        label: "Martech stack",
        detail:
          "Analytics, CRM, and automation wired together — one source of truth from day one.",
      },
      {
        label: "Tracking & attribution",
        detail:
          "Every inquiry tagged to its source, so spend decisions run on data instead of hunches.",
      },
      {
        label: "Launch PR",
        detail:
          "Announcement placements and refreshed profiles that turn the relaunch into a visibility event.",
      },
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
      {
        label: "Content engine",
        detail:
          "An editorial cadence that keeps you present in search, feeds, and AI answers.",
      },
      {
        label: "Paid media",
        detail:
          "Campaigns managed against return targets — scaled when they earn it, cut when they don't.",
      },
      {
        label: "PR & reputation",
        detail:
          "A steady drumbeat of coverage, reviews, and citations that compounds trust.",
      },
      {
        label: "Quarterly strategy",
        detail:
          "A standing review of the numbers — what's compounding, what gets cut, what's next.",
      },
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
        <Reveal className="grid grid-cols-1 gap-y-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end lg:gap-x-16">
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
        </Reveal>

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
