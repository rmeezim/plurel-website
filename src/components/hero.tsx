import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  CircledArrow,
  CircledX,
  Globe,
  Layers,
  Megaphone,
  Spark,
  Trend,
} from "@/components/icons";

const SIDE_LABELS = ["Brand Systems", "Web Design", "Content / PR"];

const SERVICES = [
  { label: "Brand Identity", icon: "brand" },
  { label: "Web Design", icon: "web" },
  { label: "Content Systems", icon: "content" },
  { label: "Paid Media", icon: "paid" },
  { label: "PR", icon: "pr" },
] as const;

function ServiceIcon({ kind }: { kind: (typeof SERVICES)[number]["icon"] }) {
  switch (kind) {
    case "brand":
      return (
        <span className="relative inline-flex">
          <Spark className="size-7 text-ink" />
          <Spark className="absolute -right-1.5 -top-1.5 size-3 text-brand" />
        </span>
      );
    case "web":
      return <Globe className="size-7 text-ink" />;
    case "content":
      return <Layers className="size-7 text-ink" />;
    case "paid":
      return <Trend className="size-7 text-ink" />;
    case "pr":
      return <Megaphone className="size-7 text-ink" />;
  }
}

/**
 * One set of showcase cards. Rendered twice (back to back) inside the marquee
 * track so the loop is seamless. Each card carries its own right margin so the
 * -50% translate lands exactly on the duplicate. The second set is aria-hidden.
 */
function ShowcaseCards({ prefix, hidden }: { prefix: string; hidden?: boolean }) {
  const ariaHidden = hidden || undefined;
  return (
    <>
      {/* 1 — Editorial collage (placeholder image) */}
      <article
        key={`${prefix}-collage`}
        aria-hidden={ariaHidden}
        className="relative mr-4 h-full w-[200px] shrink-0 overflow-hidden rounded-2xl bg-clay sm:w-[230px]"
      >
        <div className="absolute inset-x-0 top-0 h-1/2 -skew-y-6 bg-brand/90" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 skew-y-6 bg-ink" />
        <span className="absolute bottom-4 left-4 font-sans text-7xl font-extrabold leading-none text-paper/90">
          STR
        </span>
        <Spark className="absolute right-4 top-4 size-5 text-paper" />
      </article>

      {/* 2 — Website mockup: dark studio panel + interior shot */}
      <article
        key={`${prefix}-studio`}
        aria-hidden={ariaHidden}
        className="mr-4 flex h-full w-[340px] shrink-0 overflow-hidden rounded-2xl bg-ink text-paper sm:w-[420px]"
      >
        <div className="flex w-[60%] flex-col p-5 sm:p-6">
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.15em] text-paper/55">
            <span className="flex items-center gap-1.5 font-semibold text-paper">
              <CircledX className="size-4" /> Aurem
            </span>
            <span className="hidden gap-2.5 sm:flex">
              <span>Work</span>
              <span>About</span>
              <span>Journal</span>
            </span>
          </div>
          <div className="mt-auto">
            <h3 className="font-serif text-[26px] leading-[1.05] sm:text-3xl">
              Strategic<span className="text-brand">*</span>
              <br />
              by design.
            </h3>
            <p className="mt-3 max-w-[26ch] text-xs leading-relaxed text-paper/60">
              A branding and digital studio crafting considered experiences for
              forward-thinking companies.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-paper/80">
              View case study <CircledArrow className="size-4" />
            </span>
          </div>
        </div>
        {/* Placeholder interior photograph */}
        <div
          aria-hidden
          className="w-[40%]"
          style={{
            backgroundImage:
              "linear-gradient(155deg, #c7b49d 0%, #a65a45 70%, #4a342b 100%)",
          }}
        />
      </article>

      {/* 3 — Red campaign card */}
      <article
        key={`${prefix}-campaign`}
        aria-hidden={ariaHidden}
        className="mr-4 flex h-full w-[230px] shrink-0 flex-col rounded-2xl bg-brand p-6 text-paper sm:w-[250px]"
      >
        <h3 className="font-serif text-3xl leading-[1.05] sm:text-[34px]">
          Clarity
          <br />
          Builds
          <br />
          Confidence.
        </h3>
        <div className="mt-auto pt-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-paper/70">
            2025 Brand Campaign
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm font-semibold">
            <Spark className="size-4" /> Aurem
          </p>
        </div>
      </article>

      {/* 4 — Plurel business card */}
      <article
        key={`${prefix}-card`}
        aria-hidden={ariaHidden}
        className="relative mr-4 h-full w-[230px] shrink-0 overflow-hidden rounded-2xl bg-charcoal p-6 text-paper sm:w-[250px]"
      >
        <Spark className="absolute -right-6 top-6 size-32 text-paper/10" />
        <div className="flex h-full flex-col justify-end">
          <p className="text-2xl font-extrabold tracking-tight text-brand">
            PLUREL
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-paper/50">
            A Northeon Division
          </p>
        </div>
      </article>

      {/* 5 — Product shot (placeholder image) */}
      <article
        key={`${prefix}-product`}
        aria-hidden={ariaHidden}
        className="relative mr-4 h-full w-[200px] shrink-0 overflow-hidden rounded-2xl sm:w-[220px]"
        style={{
          backgroundImage:
            "linear-gradient(165deg, #d8cdbb 0%, #c7b49d 55%, #a65a45 100%)",
        }}
      >
        <p className="absolute left-4 top-4 max-w-[18ch] font-serif text-sm leading-snug text-ink/85">
          Formulated for daily performance.
        </p>
        {/* Stand-in for the bottle product photography */}
        <div className="absolute bottom-10 left-1/2 h-28 w-12 -translate-x-1/2 rounded-[10px] bg-ink/85">
          <span className="absolute -top-3 left-1/2 h-3 w-5 -translate-x-1/2 rounded-sm bg-ink" />
        </div>
        <p className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.2em] text-ink/60">
          Fence Labs
        </p>
      </article>

      {/* 6 — Plurel campaign card */}
      <article
        key={`${prefix}-plurel`}
        aria-hidden={ariaHidden}
        className="relative mr-4 flex h-full w-[230px] shrink-0 flex-col rounded-2xl bg-brand p-6 text-paper sm:w-[250px]"
      >
        <span className="inline-flex size-10 items-center justify-center rounded-full border border-paper/40">
          <Spark className="size-5" />
        </span>
        <h3 className="mt-6 font-serif text-3xl leading-[1.05]">
          Built to
          <br />
          be chosen.
        </h3>
        <div className="mt-auto pt-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-paper/70">
            Plurel &mdash; Selected Work
          </p>
        </div>
      </article>
    </>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-heading">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Headline + vertical service labels */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pb-8 pt-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:pb-10 lg:pt-14">
          <h1
            id="hero-heading"
            className="fade-up font-sans text-[clamp(2.25rem,6.4vw,7.5rem)] font-normal leading-[0.95] tracking-[-0.02em] text-ink"
          >
            We build the
            <br className="hidden sm:block" /> visible layer of growth.
          </h1>

          <ul className="fade-up flex flex-wrap items-center gap-x-6 gap-y-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted lg:w-44 lg:flex-col lg:items-end lg:gap-0 lg:text-right">
            {SIDE_LABELS.map((label) => (
              <li
                key={label}
                className="lg:w-full lg:border-t lg:border-line lg:py-3"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Intro column + work showcase rail */}
        <div className="grid grid-cols-1 gap-10 border-t border-line py-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12 lg:py-10">
          {/* Left: intro + selected work stat */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              {/* Placeholder avatar — swap for a real headshot */}
              <span
                aria-hidden
                className="size-12 shrink-0 rounded-full bg-clay ring-1 ring-line"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 35%, #d8c7b0 0 30%, #b79f86 31% 60%, #8f8981 61%)",
                }}
              />
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-brand text-brand">
                <ArrowDownRight className="size-5" />
              </span>
            </div>

            <p className="mt-6 max-w-[34ch] text-[15px] leading-relaxed text-ink/80">
              Plurel is Northeon&rsquo;s creative division &mdash; shaping brand
              identity, websites, content systems, paid campaigns, and PR assets
              that make companies look sharper, more trusted, and easier to
              choose.
            </p>

            <div className="mt-auto border-t border-line pt-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="flex items-start gap-1">
                    <span className="text-6xl font-normal leading-none tracking-tight text-ink">
                      120
                    </span>
                    <span className="text-2xl font-normal leading-none text-brand">
                      +
                    </span>
                  </div>
                  <p className="mt-2 font-medium text-brand">Selected Work</p>
                </div>
                <span className="mb-1 flex items-center gap-2 text-ink">
                  <span className="h-px w-10 bg-ink/30" />
                  <ArrowUpRight className="size-6" />
                </span>
              </div>
            </div>
          </div>

          {/* Right: infinite marquee of work + anchored primary CTA */}
          <div className="min-w-0">
            <div className="fade-up relative">
              <div className="marquee-mask relative h-[320px] overflow-hidden sm:h-[350px]">
                <div className="animate-marquee flex h-full w-max will-change-transform">
                  <ShowcaseCards prefix="a" />
                  <ShowcaseCards prefix="b" hidden />
                </div>
                {/* Raised-edge shadows — the page surface on either side reads
                    as a layer sitting above the cards passing beneath it */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-ink/35 via-ink/10 via-45% to-transparent"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-ink/35 via-ink/10 via-45% to-transparent"
                />
              </div>

              {/* Primary CTA — a folder-tab corner. The panel is carved into
                  the slider's bottom-right corner: a canvas mask pads its top
                  and left edges, and two concave fillets weld the cutout into
                  the slider's bottom and right boundaries, so the page surface
                  flows around it like the raised tab of a folder. */}
              <Link
                href="/contact"
                aria-label="Book Strategy Call"
                className="group absolute bottom-0 right-0 z-20 block rounded-tl-[25px] bg-canvas pl-[9px] pt-[9px] [filter:drop-shadow(-6px_-6px_10px_rgba(17,15,10,0.22))]"
              >
                {/* Concave fillets — page-colored quarter-curves that blend
                    the tab into the slider's right and bottom edges */}
                <span
                  aria-hidden
                  className="absolute -top-6 right-0 size-6"
                  style={{
                    background:
                      "radial-gradient(circle 24px at 0 0, transparent 23px, var(--color-canvas) 24px)",
                  }}
                />
                <span
                  aria-hidden
                  className="absolute -left-6 bottom-0 size-6"
                  style={{
                    background:
                      "radial-gradient(circle 24px at 0 0, transparent 23px, var(--color-canvas) 24px)",
                  }}
                />
                <span className="relative block h-[100px] w-[284px] rounded-[16px] bg-brand transition-colors duration-300 group-hover:bg-[#b0332f] sm:h-[112px] sm:w-[316px]">
                  {/* Plurel mark, subtle, top-right */}
                  <Spark className="absolute right-5 top-4 size-3.5 text-paper/70" />
                  {/* Label, left-aligned */}
                  <span className="absolute bottom-4 left-6 font-sans text-[21px] font-medium leading-[1.16] tracking-[-0.01em] text-paper sm:text-[24px]">
                    Book
                    <br />
                    Strategy Call
                  </span>
                  {/* Diagonal arrow, right */}
                  <ArrowUpRight className="absolute bottom-4 right-5 size-5 text-paper transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Services strip */}
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {SERVICES.map((service) => (
            <li
              key={service.label}
              className="flex flex-col items-center justify-center gap-3 border-l border-t border-line px-4 py-8 text-center odd:border-l-0 sm:odd:border-l sm:[&:nth-child(3n+1)]:border-l-0 lg:[&:nth-child(3n+1)]:border-l lg:[&:nth-child(5n+1)]:border-l-0"
            >
              <ServiceIcon kind={service.icon} />
              <span className="text-sm font-medium text-ink sm:text-base">
                {service.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
