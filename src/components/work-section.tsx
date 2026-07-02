import Link from "next/link";
import { ArrowUpRight, CircledX, Spark } from "@/components/icons";

function CaseCard({
  name,
  services,
  year,
  children,
}: {
  name: string;
  services: string;
  year: string;
  children: React.ReactNode;
}) {
  return (
    <Link href="/work" className="group block">
      {/* Visual composition is decorative placeholder art — hidden from AT so
          the link's accessible name stays the meta row */}
      <div
        aria-hidden
        className="overflow-hidden rounded-2xl border border-line"
      >
        <div className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.02]">
          {children}
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg text-ink transition-colors group-hover:text-brand">
            {name}
          </h3>
          <p className="mt-1 text-[13px] text-muted">
            {services} &mdash; {year}
          </p>
        </div>
        <ArrowUpRight className="mt-1.5 size-5 shrink-0 text-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

export function WorkSection() {
  return (
    <section id="work" aria-labelledby="work-heading" className="border-t border-line">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        {/* Header row */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Selected Work
            </p>
            <h2
              id="work-heading"
              className="mt-4 font-sans text-[clamp(2rem,4.5vw,3.75rem)] font-normal leading-[1.02] tracking-[-0.02em] text-ink"
            >
              Recent <span className="font-serif italic">transformations</span>.
            </h2>
          </div>
          <div className="lg:pb-1.5 lg:text-right">
            <div className="flex items-start gap-1 lg:justify-end">
              <span className="text-4xl font-normal leading-none tracking-tight text-ink">
                120
              </span>
              <span className="text-lg font-normal leading-none text-brand">
                +
              </span>
            </div>
            <p className="mt-2 text-[13px] text-muted">projects shipped</p>
          </div>
        </div>

        {/* Case grid — even cards drop on lg for editorial rhythm; the grid's
            lg bottom padding absorbs the translate so nothing overlaps */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:mt-14 lg:gap-10 lg:pb-12 lg:[&>*:nth-child(even)]:translate-y-12">
          {/* 1 — Aurem: dark studio mockup */}
          <CaseCard name="Aurem" services="Brand Identity, Web Design" year="2025">
            <div className="flex h-full flex-col bg-ink p-6 text-paper sm:p-8">
              <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.15em] text-paper/55">
                <span className="flex items-center gap-1.5 font-semibold text-paper">
                  <CircledX className="size-4" /> Aurem
                </span>
                <span className="flex gap-2.5">
                  <span>Work</span>
                  <span>About</span>
                  <span>Journal</span>
                </span>
              </div>
              <p className="mt-auto font-serif text-3xl leading-[1.05] sm:text-4xl">
                Strategic<span className="text-brand">*</span>
                <br />
                by design.
              </p>
              <p className="mt-3 max-w-[30ch] text-xs leading-relaxed text-paper/60">
                A branding and digital studio crafting considered experiences.
              </p>
            </div>
          </CaseCard>

          {/* 2 — Fence Labs: warm product still-life */}
          <CaseCard name="Fence Labs" services="Packaging, Art Direction" year="2025">
            <div
              className="relative h-full"
              style={{
                backgroundImage:
                  "linear-gradient(165deg, #d8cdbb 0%, #c7b49d 55%, #a65a45 100%)",
              }}
            >
              <p className="absolute left-6 top-6 max-w-[16ch] font-serif text-lg leading-snug text-ink/85 sm:left-8 sm:top-8 sm:text-xl">
                Formulated for daily performance.
              </p>
              {/* Stand-in for the bottle product photography */}
              <div className="absolute bottom-14 left-1/2 h-32 w-14 -translate-x-1/2 rounded-[12px] bg-ink/85 sm:h-36 sm:w-16">
                <span className="absolute -top-3.5 left-1/2 h-3.5 w-6 -translate-x-1/2 rounded-sm bg-ink" />
                <span className="absolute inset-x-2 top-[38%] h-9 rounded-[3px] bg-paper/15" />
              </div>
              <p className="absolute bottom-5 left-6 text-[10px] uppercase tracking-[0.2em] text-ink/60 sm:left-8">
                Fence Labs
              </p>
            </div>
          </CaseCard>

          {/* 3 — Northgate Legal: editorial typography study */}
          <CaseCard name="Northgate Legal" services="Website, AEO/SEO" year="2024">
            <div className="flex h-full flex-col bg-paper p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-line pb-3 text-[9px] uppercase tracking-[0.2em] text-muted">
                <span>Northgate Legal</span>
                <span>Est. 1962</span>
              </div>
              <div className="flex flex-1 items-center">
                <p className="font-serif text-3xl leading-[1.08] text-ink sm:text-4xl">
                  Counsel,
                  <br />
                  clarified.
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-line pt-3 text-[9px] uppercase tracking-[0.2em] text-muted">
                <span>Corporate</span>
                <span>Litigation</span>
                <span>Advisory</span>
              </div>
            </div>
          </CaseCard>

          {/* 4 — Mara Atelier: brand campaign card */}
          <CaseCard name="Mara Atelier" services="Brand Identity, Content" year="2024">
            <div className="flex h-full flex-col bg-brand p-6 text-paper sm:p-8">
              <span className="inline-flex size-10 items-center justify-center rounded-full border border-paper/40">
                <Spark className="size-5" />
              </span>
              <p className="mt-auto font-serif text-3xl leading-[1.05] sm:text-4xl">
                Made to
                <br />
                be kept.
              </p>
              <div className="mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-paper/70">
                <span>2024 Brand Campaign</span>
                <span>Mara Atelier</span>
              </div>
            </div>
          </CaseCard>
        </div>

        {/* All-work row */}
        <div className="mt-12 border-t border-line lg:mt-16">
          <Link
            href="/work"
            className="group flex items-center justify-between py-6"
          >
            <span className="text-[15px] font-medium text-ink transition-colors group-hover:text-brand">
              View all 120+ projects
            </span>
            <ArrowUpRight className="size-5 shrink-0 text-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
