import Link from "next/link";
import { ArrowUpRight, Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ServicesShowcase } from "@/components/services-showcase";

const SERVICES = [
  {
    number: "01",
    name: "Website Design",
    description: "Fast, considered sites that turn attention into inquiries.",
    module: "web",
  },
  {
    number: "02",
    name: "Brand Identity",
    description: "Identity systems that make you instantly recognisable.",
    module: "identity",
  },
  {
    number: "03",
    name: "AI Search & SEO",
    description:
      "Be the answer when customers — and their AI assistants — search.",
    module: "search",
  },
  {
    number: "04",
    name: "Content Marketing",
    description: "Editorial systems that keep you visible and credible.",
    module: "content",
  },
  {
    number: "05",
    name: "Paid Ads",
    description: "Campaigns tuned for return, not just reach.",
    module: "ads",
  },
  {
    number: "06",
    name: "PR & Reputation",
    description: "Press and proof that build trust before the first call.",
    module: "pr",
  },
  {
    number: "07",
    name: "Creative Direction",
    description: "One consistent visual voice across every touchpoint.",
    module: "creative",
  },
  {
    number: "08",
    name: "Consulting",
    description: "Senior eyes on your positioning, brand, and roadmap.",
    module: "consulting",
  },
] as const;

type Module = (typeof SERVICES)[number]["module"];

/** Days lit up in the mini editorial calendar */
const CALENDAR_PUBLISHED = new Set([2, 5, 9, 12, 16, 19, 24]);
const CALENDAR_DRAFT = 14;

/**
 * Miniature system UI revealed when a service row is hovered — page
 * wireframes, dashboards, graphs. Purely decorative (aria-hidden upstream).
 */
function ServiceModule({ kind }: { kind: Module }) {
  switch (kind) {
    case "web":
      // Page architecture preview
      return (
        <span className="flex h-full w-full flex-col gap-1.5 bg-paper p-2.5">
          <span className="flex items-center gap-1">
            <span className="size-1 rounded-full bg-line" />
            <span className="size-1 rounded-full bg-line" />
            <span className="size-1 rounded-full bg-line" />
            <span className="ml-1 h-1.5 flex-1 rounded-full bg-line/70" />
          </span>
          <span className="relative h-7 rounded-[4px] bg-clay/70">
            <span className="absolute left-1.5 top-2 h-1.5 w-10 rounded-sm bg-ink/75" />
            <span className="absolute left-1.5 top-4.5 h-1 w-6 rounded-sm bg-ink/40" />
          </span>
          <span className="flex flex-1 gap-1.5">
            <span className="flex-[2] rounded-[4px] bg-line/60" />
            <span className="flex-1 rounded-[4px] bg-line/40" />
          </span>
          <span className="h-2 w-12 self-start rounded-[3px] bg-brand" />
        </span>
      );
    case "identity":
      // Identity system tiles
      return (
        <span className="grid h-full w-full grid-cols-2 gap-1.5 bg-ink p-2">
          <span className="flex items-center justify-center rounded-[4px] bg-brand">
            <Spark className="size-4 text-paper" />
          </span>
          <span className="flex items-center justify-center rounded-[4px] bg-paper font-serif text-sm leading-none text-ink">
            Aa
          </span>
          <span className="flex items-center justify-center gap-1 rounded-[4px] bg-charcoal">
            <span className="size-2 rounded-full bg-brand" />
            <span className="size-2 rounded-full bg-clay" />
            <span className="size-2 rounded-full bg-paper" />
          </span>
          <span className="flex items-center justify-center rounded-[4px] bg-clay text-[8px] font-semibold tracking-[0.25em] text-ink">
            PLR
          </span>
        </span>
      );
    case "search":
      // Search visibility graph
      return (
        <span className="flex h-full w-full flex-col bg-charcoal p-2.5">
          <span className="flex items-center justify-between">
            <span className="h-3 w-16 rounded-full bg-paper/15" />
            <span className="text-[10px] font-medium leading-none text-brand">
              +185%
            </span>
          </span>
          <span className="mt-auto flex h-12 items-end gap-1.5">
            {["28%", "42%", "55%", "72%", "100%"].map((h, i) => (
              <span
                key={h}
                style={{ height: h }}
                className={`flex-1 rounded-t-sm ${i === 4 ? "bg-brand" : "bg-paper/20"}`}
              />
            ))}
          </span>
        </span>
      );
    case "content":
      // Editorial calendar grid
      return (
        <span className="flex h-full w-full flex-col bg-paper p-2.5">
          <span className="flex items-center justify-between">
            <span className="text-[9px] font-semibold tracking-[0.2em] text-muted">
              JUN
            </span>
            <span className="size-1.5 rounded-full bg-brand" />
          </span>
          <span className="mt-2 grid flex-1 grid-cols-7 gap-[3px]">
            {Array.from({ length: 28 }, (_, i) => (
              <span
                key={i}
                className={`rounded-[2px] ${
                  CALENDAR_PUBLISHED.has(i)
                    ? "bg-brand"
                    : i === CALENDAR_DRAFT
                      ? "bg-clay"
                      : "bg-line/60"
                }`}
              />
            ))}
          </span>
        </span>
      );
    case "ads":
      // Funnel + campaign dashboard
      return (
        <span className="flex h-full w-full flex-col bg-ink p-2.5">
          <span className="flex items-center justify-between">
            <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-paper/50">
              Campaign
            </span>
            <span className="text-[10px] font-medium leading-none text-brand">
              4.2&times;
            </span>
          </span>
          <span className="mt-auto flex flex-col items-center gap-1.5">
            <span className="h-2.5 w-full rounded-full bg-paper/15" />
            <span className="h-2.5 w-[72%] rounded-full bg-paper/25" />
            <span className="h-2.5 w-[48%] rounded-full bg-paper/40" />
            <span className="h-2.5 w-[28%] rounded-full bg-brand" />
          </span>
        </span>
      );
    case "pr":
      // Trust signal map
      return (
        <span className="block h-full w-full bg-charcoal p-1.5">
          <svg viewBox="0 0 100 64" className="h-full w-full">
            <g stroke="#fbfaf6" strokeOpacity="0.25" strokeWidth="0.75">
              <line x1="50" y1="34" x2="15" y2="12" />
              <line x1="50" y1="34" x2="58" y2="8" />
              <line x1="50" y1="34" x2="86" y2="14" />
              <line x1="50" y1="34" x2="89" y2="48" />
              <line x1="50" y1="34" x2="18" y2="52" />
            </g>
            <g fill="#fbfaf6" fillOpacity="0.55">
              <circle cx="15" cy="12" r="2.4" />
              <circle cx="58" cy="8" r="2.4" />
              <circle cx="86" cy="14" r="2.4" />
              <circle cx="89" cy="48" r="2.4" />
              <circle cx="18" cy="52" r="2.4" />
            </g>
            <circle cx="50" cy="34" r="5.5" fill="#bf3a36" />
            <circle cx="50" cy="34" r="1.8" fill="#fbfaf6" />
          </svg>
        </span>
      );
    case "creative":
      // Art-direction frame board
      return (
        <span className="relative block h-full w-full overflow-hidden bg-clay">
          <span className="absolute left-3 top-3 h-14 w-16 -rotate-[5deg] rounded-[4px] bg-gradient-to-br from-rust to-ink shadow-sm" />
          <span className="absolute right-4 top-7 h-12 w-12 rotate-[6deg] rounded-[4px] border-2 border-paper" />
          <Spark className="absolute bottom-2.5 left-4 size-3.5 text-ink/70" />
        </span>
      );
    case "consulting":
      // Engagement roadmap
      return (
        <span className="relative flex h-full w-full flex-col justify-center gap-2.5 bg-paper p-3">
          <span className="absolute inset-y-2 left-[58%] w-px bg-ink/15" />
          <span className="absolute left-[58%] top-2 size-1.5 -translate-x-1/2 rounded-full bg-brand" />
          <span className="h-2 w-[45%] rounded-full bg-line" />
          <span className="ml-[18%] h-2 w-[52%] rounded-full bg-clay" />
          <span className="ml-[42%] h-2 w-[40%] rounded-full bg-brand" />
        </span>
      );
  }
}

/** Sticky-column intro — server-rendered, passed into the client showcase */
function Intro() {
  return (
    <Reveal>
      <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        <Spark className="size-3.5 text-brand" aria-hidden />
        What we do
      </p>
      <h2
        id="services-heading"
        className="mt-5 font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
      >
        Services that make you the{" "}
        <em className="font-serif italic">obvious</em> choice.
      </h2>
      <p className="mt-6 max-w-[42ch] text-[15px] leading-relaxed text-ink/80">
        Plurel modernizes how your business looks, communicates, and attracts
        customers &mdash; one partner for the entire visible layer of your
        brand.
      </p>
      <Link
        href="/services"
        className="group mt-8 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-brand"
      >
        All services
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </Reveal>
  );
}

/** Plain numbered index — the below-lg / fallback presentation */
function StaticRows() {
  return (
    <ul>
      {SERVICES.map((service, index) => (
        <li key={service.number} className="border-t border-line last:border-b">
          <Reveal sweep delay={Math.min(index * 0.08, 0.4)}>
            <Link
              href="/services"
              className="group grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-x-4 py-6 transition-colors duration-300 hover:bg-paper/60 sm:gap-x-6 sm:py-5"
            >
              <span className="text-sm tabular-nums text-muted transition-colors duration-300 group-hover:text-brand">
                {service.number}
              </span>
              <span>
                <span className="block text-2xl font-normal tracking-[-0.01em] text-ink transition-colors duration-300 group-hover:text-brand sm:text-3xl">
                  {service.name}
                </span>
                <span className="mt-1.5 hidden text-[15px] leading-relaxed text-ink/70 sm:block">
                  {service.description}
                </span>
              </span>
              <span className="inline-flex size-10 items-center justify-center self-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-paper">
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="overflow-x-clip border-t border-line"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <ServicesShowcase
          intro={<Intro />}
          services={SERVICES.map(({ number, name, description }) => ({
            number,
            name,
            description,
          }))}
          modules={SERVICES.map((service) => (
            <ServiceModule key={service.number} kind={service.module} />
          ))}
          fallback={<StaticRows />}
        />
      </div>
    </section>
  );
}
