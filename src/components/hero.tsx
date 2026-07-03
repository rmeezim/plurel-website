import Link from "next/link";
import { Cascade } from "@/components/cascade";
import {
  ArrowDownRight,
  ArrowUpRight,
  CircledX,
  Globe,
  Layers,
  Megaphone,
  Spark,
  Trend,
} from "@/components/icons";

/** Days lit up in the Content Engine card's mini calendar */
const HERO_CALENDAR_PUBLISHED = new Set([1, 4, 8, 11, 15, 22, 25]);

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
 * One set of showcase cards — each represents a capability of the Plurel
 * operating system, tagged consistently. Rendered twice (back to back) inside
 * the marquee track so the loop is seamless. Each card carries its own right
 * margin so the -50% translate lands exactly on the duplicate. The second set
 * is aria-hidden.
 */
function ShowcaseCards({ prefix, hidden }: { prefix: string; hidden?: boolean }) {
  const ariaHidden = hidden || undefined;
  return (
    <>
      {/* 1 — Brand System: identity tiles */}
      <article
        key={`${prefix}-brand`}
        aria-hidden={ariaHidden}
        className="mr-4 flex h-full w-[210px] shrink-0 flex-col overflow-hidden rounded-2xl bg-ink p-4 sm:w-[230px]"
      >
        <span className="grid flex-1 grid-cols-2 gap-2">
          <span className="flex items-center justify-center rounded-lg bg-brand">
            <Spark className="size-6 text-paper" />
          </span>
          <span className="flex items-center justify-center rounded-lg bg-paper font-serif text-3xl leading-none text-ink">
            Aa
          </span>
          <span className="flex items-center justify-center gap-1.5 rounded-lg bg-charcoal">
            <span className="size-2.5 rounded-full bg-brand" />
            <span className="size-2.5 rounded-full bg-clay" />
            <span className="size-2.5 rounded-full bg-paper" />
          </span>
          <span className="flex items-center justify-center rounded-lg bg-clay text-[10px] font-semibold tracking-[0.3em] text-ink">
            PLU
          </span>
        </span>
        <span className="mt-4 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-paper/70">
          <Spark className="size-3 text-brand" /> Brand System
        </span>
      </article>

      {/* 2 — Website Experience: dark studio mockup + interior shot */}
      <article
        key={`${prefix}-web`}
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
            <span className="mt-4 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-paper/70">
              <Spark className="size-3 text-brand" /> Website Experience
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

      {/* 3 — AI Search Visibility: rising query graph */}
      <article
        key={`${prefix}-search`}
        aria-hidden={ariaHidden}
        className="mr-4 flex h-full w-[230px] shrink-0 flex-col rounded-2xl bg-charcoal p-5 text-paper sm:w-[250px]"
      >
        <span className="flex h-9 items-center gap-2 rounded-full bg-paper/10 px-3">
          <span className="size-2.5 rounded-full border border-paper/50" />
          <span className="h-1.5 w-20 rounded-full bg-paper/25" />
        </span>
        <span className="mt-3 text-right text-sm font-medium leading-none text-brand">
          +185%
        </span>
        <span className="mt-auto flex h-28 items-end gap-2">
          {["30%", "44%", "58%", "76%", "100%"].map((h, i) => (
            <span
              key={h}
              style={{ height: h }}
              className={`flex-1 rounded-t-md ${i === 4 ? "bg-brand" : "bg-paper/20"}`}
            />
          ))}
        </span>
        <span className="mt-4 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-paper/70">
          <Spark className="size-3 text-brand" /> AI Search Visibility
        </span>
      </article>

      {/* 4 — Content Engine: editorial calendar */}
      <article
        key={`${prefix}-content`}
        aria-hidden={ariaHidden}
        className="mr-4 flex h-full w-[210px] shrink-0 flex-col rounded-2xl border border-line bg-paper p-5 text-ink sm:w-[230px]"
      >
        <span className="flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-[0.25em] text-muted">
            JUL
          </span>
          <span className="size-2 rounded-full bg-brand" />
        </span>
        <span className="mt-3 grid flex-1 grid-cols-7 content-start gap-1.5">
          {Array.from({ length: 28 }, (_, i) => (
            <span
              key={i}
              className={`aspect-square rounded-[3px] ${
                HERO_CALENDAR_PUBLISHED.has(i)
                  ? "bg-brand"
                  : i === 17
                    ? "bg-clay"
                    : "bg-line/70"
              }`}
            />
          ))}
        </span>
        <span className="mt-3 space-y-1.5">
          <span className="block h-1.5 w-3/4 rounded-full bg-line" />
          <span className="block h-1.5 w-1/2 rounded-full bg-line/70" />
        </span>
        <span className="mt-4 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-ink/60">
          <Spark className="size-3 text-brand" /> Content Engine
        </span>
      </article>

      {/* 5 — Campaign Intelligence: funnel + return stat */}
      <article
        key={`${prefix}-campaign`}
        aria-hidden={ariaHidden}
        className="mr-4 flex h-full w-[230px] shrink-0 flex-col rounded-2xl bg-brand p-5 text-paper sm:w-[250px]"
      >
        <span className="flex items-center justify-between text-[9px] font-medium uppercase tracking-[0.2em] text-paper/70">
          <span>Q3 &mdash; Awareness</span>
          <span className="text-sm font-semibold normal-case tracking-normal text-paper">
            4.2&times;
          </span>
        </span>
        <h3 className="mt-4 font-serif text-[26px] leading-[1.08]">
          Clarity Builds
          <br />
          Confidence.
        </h3>
        <span className="mt-auto flex flex-col gap-1.5">
          <span className="h-2.5 w-full rounded-full bg-paper/25" />
          <span className="h-2.5 w-[70%] rounded-full bg-paper/40" />
          <span className="h-2.5 w-[44%] rounded-full bg-paper/60" />
          <span className="h-2.5 w-[26%] rounded-full bg-paper" />
        </span>
        <span className="mt-4 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-paper/80">
          <Spark className="size-3 text-paper" /> Campaign Intelligence
        </span>
      </article>

      {/* 6 — Reputation Layer: trust signal map */}
      <article
        key={`${prefix}-reputation`}
        aria-hidden={ariaHidden}
        className="mr-4 flex h-full w-[210px] shrink-0 flex-col rounded-2xl bg-rust p-5 text-paper sm:w-[230px]"
      >
        <span className="flex items-center justify-between text-[9px] font-medium uppercase tracking-[0.2em] text-paper/70">
          <span>Signals</span>
          <span className="text-sm font-semibold normal-case tracking-normal text-paper">
            40+
          </span>
        </span>
        <span className="my-auto block">
          <svg viewBox="0 0 100 70" className="w-full">
            <g stroke="#fbfaf6" strokeOpacity="0.35" strokeWidth="0.75">
              <line x1="50" y1="37" x2="14" y2="14" />
              <line x1="50" y1="37" x2="56" y2="8" />
              <line x1="50" y1="37" x2="87" y2="16" />
              <line x1="50" y1="37" x2="90" y2="52" />
              <line x1="50" y1="37" x2="16" y2="58" />
            </g>
            <g fill="#fbfaf6" fillOpacity="0.7">
              <circle cx="14" cy="14" r="2.6" />
              <circle cx="56" cy="8" r="2.6" />
              <circle cx="87" cy="16" r="2.6" />
              <circle cx="90" cy="52" r="2.6" />
              <circle cx="16" cy="58" r="2.6" />
            </g>
            <circle cx="50" cy="37" r="6" fill="#110f0a" />
            <circle cx="50" cy="37" r="2" fill="#fbfaf6" />
          </svg>
        </span>
        <span className="mt-4 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-paper/80">
          <Spark className="size-3 text-paper" /> Reputation Layer
        </span>
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
            className="font-sans text-[clamp(2.25rem,6.4vw,7.5rem)] font-normal leading-[0.95] tracking-[-0.02em] text-ink"
          >
            <Cascade text="We build the" base={0.1} step={0.05} />
            <br className="hidden sm:block" />{" "}
            <Cascade
              text="visible layer of growth."
              base={0.1}
              step={0.05}
              offset={3}
            />
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
                  flows around it like the raised tab of a folder. The outer
                  wrapper clips the cast shadow so it falls only up/left onto
                  the cards — never onto the page below or right of the tab. */}
              <div className="pointer-events-none absolute bottom-0 right-0 z-20 overflow-hidden pl-12 pt-12">
              <Link
                href="/contact"
                aria-label="Book Strategy Call"
                className="group pointer-events-auto relative block rounded-tl-[25px] bg-canvas pl-[9px] pt-[9px] [filter:drop-shadow(-6px_-6px_10px_rgba(17,15,10,0.22))]"
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
