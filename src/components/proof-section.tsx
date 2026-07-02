import Link from "next/link";
import { ArrowUpRight, Spark } from "@/components/icons";

const STATS = [
  { value: "3.2", suffix: "×", label: "Average lift in qualified inquiries" },
  { value: "+185", suffix: "%", label: "Organic & AI-search visibility gained" },
  { value: "92", suffix: "%", label: "Of clients continue past year one" },
  { value: "120", suffix: "+", label: "Transformations shipped" },
] as const;

const QUOTES = [
  {
    quote:
      "Plurel made us look like the firm we actually are. Within a quarter, prospects stopped asking who we were — they arrived already convinced.",
    name: "Amelia Hart",
    role: "Managing Partner, Northgate Legal",
  },
  {
    quote:
      "They rebuilt our presence end to end — brand, site, search, the lot. The rebrand paid for itself before the launch campaign even finished.",
    name: "Daniel Okafor",
    role: "Founder, Fence Labs",
  },
] as const;

export function ProofSection() {
  return (
    <section
      id="proof"
      aria-labelledby="proof-heading"
      className="bg-charcoal text-paper"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
          <Spark className="size-3.5 text-brand" aria-hidden />
          Results &amp; reputation
        </p>
        <h2
          id="proof-heading"
          className="mt-5 max-w-[20ch] font-sans text-[clamp(2rem,4.4vw,3.75rem)] font-normal leading-[1.05] tracking-[-0.02em]"
        >
          Transformation you can{" "}
          <em className="font-serif italic text-clay">measure</em>.
        </h2>

        {/* Stats */}
        <dl className="mt-12 grid grid-cols-2 gap-y-10 lg:mt-16 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="border-l border-paper/15 pl-5 sm:pl-6"
            >
              <dd className="flex items-start gap-0.5">
                <span className="text-5xl font-normal leading-none tracking-[-0.02em] sm:text-6xl">
                  {stat.value}
                </span>
                <span className="text-xl font-normal leading-none text-brand sm:text-2xl">
                  {stat.suffix}
                </span>
              </dd>
              <dt className="mt-3 max-w-[24ch] text-[13px] leading-relaxed text-paper/60">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>

        {/* Testimonials */}
        <div className="mt-14 grid grid-cols-1 gap-5 lg:mt-16 lg:grid-cols-2 lg:gap-6">
          {QUOTES.map((item) => (
            <figure
              key={item.name}
              className="flex flex-col rounded-2xl border border-paper/15 p-7 sm:p-9"
            >
              <span
                aria-hidden
                className="font-serif text-5xl leading-none text-brand"
              >
                &ldquo;
              </span>
              <blockquote className="mt-3 font-serif text-xl leading-snug sm:text-[22px]">
                {item.quote}
              </blockquote>
              <figcaption className="mt-8 border-t border-paper/15 pt-5">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="mt-1 text-[13px] text-paper/50">{item.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Closing rail */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-t border-paper/15 pt-7">
          <p className="max-w-[36ch] text-[15px] leading-relaxed text-paper/70">
            Your before-and-after starts with one call.
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-[#a8302c]"
          >
            Book Strategy Call
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
