import Link from "next/link";
import { ArrowUpRight, Spark } from "@/components/icons";

const SERVICES = [
  {
    number: "01",
    name: "Website Design",
    description: "Fast, considered sites that turn attention into inquiries.",
  },
  {
    number: "02",
    name: "Brand Identity",
    description: "Identity systems that make you instantly recognisable.",
  },
  {
    number: "03",
    name: "AEO / SEO",
    description:
      "Be the answer when customers — and their AI assistants — search.",
  },
  {
    number: "04",
    name: "Content Marketing",
    description: "Editorial systems that keep you visible and credible.",
  },
  {
    number: "05",
    name: "Paid Ads",
    description: "Campaigns tuned for return, not just reach.",
  },
  {
    number: "06",
    name: "PR & Reputation",
    description: "Press and proof that build trust before the first call.",
  },
  {
    number: "07",
    name: "Creative Direction",
    description: "One consistent visual voice across every touchpoint.",
  },
  {
    number: "08",
    name: "Consulting",
    description: "Senior eyes on your positioning, brand, and roadmap.",
  },
] as const;

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
                  className="group grid grid-cols-[2rem_minmax(0,1fr)_auto] items-baseline gap-x-4 py-6 sm:gap-x-6 sm:py-7 lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,19rem)_auto]"
                >
                  <span className="text-sm tabular-nums text-muted">
                    {service.number}
                  </span>
                  <span className="text-2xl font-normal tracking-[-0.01em] text-ink transition-colors duration-300 group-hover:text-brand sm:text-3xl">
                    {service.name}
                  </span>
                  {/* Wraps under the name until lg, then sits in its own column */}
                  <span className="col-start-2 row-start-2 mt-1.5 hidden text-[15px] leading-relaxed text-ink/70 sm:block lg:col-start-3 lg:row-start-1 lg:mt-0">
                    {service.description}
                  </span>
                  <ArrowUpRight className="col-start-3 row-start-1 size-5 self-center text-ink transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand lg:col-start-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
