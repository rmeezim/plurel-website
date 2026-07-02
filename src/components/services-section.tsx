import Link from "next/link";
import {
  ArrowUpRight,
  CircledArrow,
  Globe,
  Layers,
  Megaphone,
  Spark,
  Trend,
} from "@/components/icons";

const SERVICES = [
  {
    number: "01",
    name: "Website Design",
    description: "Fast, considered sites that turn attention into inquiries.",
    motif: "web",
  },
  {
    number: "02",
    name: "Brand Identity",
    description: "Identity systems that make you instantly recognisable.",
    motif: "identity",
  },
  {
    number: "03",
    name: "AEO / SEO",
    description:
      "Be the answer when customers — and their AI assistants — search.",
    motif: "aeo",
  },
  {
    number: "04",
    name: "Content Marketing",
    description: "Editorial systems that keep you visible and credible.",
    motif: "content",
  },
  {
    number: "05",
    name: "Paid Ads",
    description: "Campaigns tuned for return, not just reach.",
    motif: "ads",
  },
  {
    number: "06",
    name: "PR & Reputation",
    description: "Press and proof that build trust before the first call.",
    motif: "pr",
  },
  {
    number: "07",
    name: "Creative Direction",
    description: "One consistent visual voice across every touchpoint.",
    motif: "creative",
  },
  {
    number: "08",
    name: "Consulting",
    description: "Senior eyes on your positioning, brand, and roadmap.",
    motif: "consulting",
  },
] as const;

type Motif = (typeof SERVICES)[number]["motif"];

/** Small CSS-composed visual, revealed when its row is hovered */
function MotifCard({ kind }: { kind: Motif }) {
  switch (kind) {
    case "web":
      return (
        <span className="flex h-full w-full flex-col justify-between bg-ink p-2.5">
          <span className="flex gap-1">
            <span className="size-1 rounded-full bg-paper/50" />
            <span className="size-1 rounded-full bg-paper/50" />
            <span className="size-1 rounded-full bg-paper/50" />
          </span>
          <span className="self-end font-serif text-2xl leading-none text-paper">
            Aa
          </span>
        </span>
      );
    case "identity":
      return (
        <span className="flex h-full w-full items-center justify-center bg-brand">
          <Spark className="size-6 text-paper" />
        </span>
      );
    case "aeo":
      return (
        <span className="flex h-full w-full items-center justify-center border border-line bg-paper font-serif text-2xl leading-none text-ink">
          A<span className="text-brand">*</span>
        </span>
      );
    case "content":
      return (
        <span className="flex h-full w-full items-center justify-center bg-charcoal">
          <Layers className="size-6 text-paper" />
        </span>
      );
    case "ads":
      return (
        <span className="flex h-full w-full items-center justify-center bg-clay">
          <Trend className="size-6 text-ink" />
        </span>
      );
    case "pr":
      return (
        <span className="flex h-full w-full items-center justify-center bg-rust">
          <Megaphone className="size-6 text-paper" />
        </span>
      );
    case "creative":
      return (
        <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand from-55% to-ink to-55%">
          <Spark className="size-6 text-paper" />
        </span>
      );
    case "consulting":
      return (
        <span className="flex h-full w-full items-center justify-center bg-line">
          <CircledArrow className="size-6 text-ink" />
        </span>
      );
  }
}

export function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="border-t border-line"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-x-16">
          {/* Left: sticky intro */}
          <div className="lg:sticky lg:top-28 lg:self-start">
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
              Plurel modernizes how your business looks, communicates, and
              attracts customers &mdash; one partner for the entire visible
              layer of your brand.
            </p>
            <Link
              href="/services"
              className="group mt-8 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-brand"
            >
              All services
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Right: numbered index */}
          <ul>
            {SERVICES.map((service) => (
              <li
                key={service.number}
                className="border-t border-line last:border-b"
              >
                <Link
                  href="/services"
                  className="group grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-x-4 py-6 transition-colors duration-300 hover:bg-paper/60 sm:gap-x-6 sm:py-5 lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,17rem)_7.5rem_auto]"
                >
                  <span className="text-sm tabular-nums text-muted transition-colors duration-300 group-hover:text-brand">
                    {service.number}
                  </span>
                  <span className="text-2xl font-normal tracking-[-0.01em] text-ink transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-brand sm:text-3xl">
                    {service.name}
                  </span>
                  {/* Wraps under the name until lg, then sits in its own column */}
                  <span className="col-start-2 row-start-2 mt-1.5 hidden text-[15px] leading-relaxed text-ink/70 sm:block lg:col-start-3 lg:row-start-1 lg:mt-0">
                    {service.description}
                  </span>
                  {/* Motif card — slides out like a pulled sample on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none col-start-4 row-start-1 hidden justify-center lg:flex"
                  >
                    <span className="h-[72px] w-[104px] -rotate-6 scale-90 overflow-hidden rounded-xl opacity-0 shadow-[0_14px_28px_-14px_rgba(17,15,10,0.45)] transition-all duration-300 group-hover:rotate-3 group-hover:scale-100 group-hover:opacity-100">
                      <MotifCard kind={service.motif} />
                    </span>
                  </span>
                  {/* Circled arrow — fills brand on hover */}
                  <span className="col-start-3 row-start-1 inline-flex size-10 items-center justify-center self-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-paper lg:col-start-5">
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
