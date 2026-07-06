import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Spark } from "@/components/icons";
import { ProofStats } from "@/components/proof-stats";
import { Reveal } from "@/components/reveal";

const CASES = [
  {
    client: "Aurem",
    engagement: "Brand & web — 2025",
    before: "Dated identity and a template site, losing pitches on look alone.",
    after: "A premium brand system the market reads as top-tier on first contact.",
    metrics: [
      { value: "+212%", label: "Qualified inquiries" },
      { value: "0.8s", label: "Page load" },
    ],
    quote: "The rebrand changed how the market reads us — instantly.",
    name: "Elena Voss",
    role: "CEO, Aurem",
  },
  {
    client: "Northgate Legal",
    engagement: "Web & AI search — 2024",
    before: "Invisible in search; new business arrived by referral only.",
    after: "The first answer in AI and organic search for its practice areas.",
    metrics: [
      { value: "+185%", label: "Search visibility" },
      { value: "3.1×", label: "Consultations booked" },
    ],
    quote: "Within a quarter, prospects stopped asking who we were.",
    name: "Amelia Hart",
    role: "Managing Partner",
  },
  {
    client: "Fence Labs",
    engagement: "Brand, pack & launch — 2025",
    before: "A great product with generic shelf presence and no press story.",
    after: "A category-distinct brand across pack, site, and launch coverage.",
    metrics: [
      { value: "+64%", label: "DTC conversion" },
      { value: "40+", label: "Press mentions" },
    ],
    quote: "The rebrand paid for itself before the campaign finished.",
    name: "Daniel Okafor",
    role: "Founder, Fence Labs",
  },
] as const;

const TRUST_SIGNALS = [
  "4.9 / 5 average client rating",
  "92% of clients continue past year one",
  "A Northeon division — global delivery network",
  "Featured in Brandweek & MarTech Today",
] as const;

export function ProofSection() {
  return (
    <section
      id="proof"
      aria-labelledby="proof-heading"
      className="bg-charcoal text-paper"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal>
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
            <Spark className="size-3.5 text-brand" aria-hidden />
            The proof layer
          </p>
          <h2
            id="proof-heading"
            className="mt-5 max-w-[20ch] font-sans text-[clamp(2rem,4.4vw,3.75rem)] font-normal leading-[1.05] tracking-[-0.02em]"
          >
            Transformation you can{" "}
            <em className="italic text-clay">measure</em>.
          </h2>
        </Reveal>

        {/* Headline metrics — count up from zero when scrolled into view */}
        <ProofStats />

        {/* Client result cards */}
        <div className="mt-14 grid grid-cols-1 gap-5 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {CASES.map((item, index) => (
            <Reveal
              key={item.client}
              delay={index * 0.09}
              className="flex"
            >
            <article className="flex w-full flex-col rounded-2xl border border-paper/15 p-6 sm:p-7">
              {/* Client + engagement */}
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-medium tracking-[-0.01em]">
                  {item.client}
                </h3>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-paper/50">
                  {item.engagement}
                </p>
              </div>

              {/* Before / after perception shift */}
              <div className="mt-5 rounded-xl bg-ink/40 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/40">
                  Before
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-paper/55">
                  {item.before}
                </p>
                <p className="mt-3.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
                  <ArrowDownRight className="size-3.5" aria-hidden />
                  After
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-paper/95">
                  {item.after}
                </p>
              </div>

              {/* Outcome metrics */}
              <dl className="mt-4 grid grid-cols-2 gap-3">
                {item.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-paper/15 px-3.5 py-3"
                  >
                    <dd className="text-xl font-medium leading-none text-brand">
                      {metric.value}
                    </dd>
                    <dt className="mt-1.5 text-[11px] leading-snug text-paper/60">
                      {metric.label}
                    </dt>
                  </div>
                ))}
              </dl>

              {/* Voice of the client */}
              <figure className="mt-auto pt-5">
                <blockquote className="border-t border-paper/10 pt-4 font-serif text-[15px] leading-snug text-paper/85">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-2.5 text-[12px] text-paper/50">
                  {item.name} &mdash; {item.role}
                </figcaption>
              </figure>
            </article>
            </Reveal>
          ))}
        </div>

        {/* Trust indicators */}
        <Reveal>
        <ul className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-paper/15 pt-6">
          {TRUST_SIGNALS.map((signal) => (
            <li
              key={signal}
              className="flex items-center gap-2 text-[13px] text-paper/60"
            >
              <Spark className="size-3 shrink-0 text-brand" aria-hidden />
              {signal}
            </li>
          ))}
        </ul>
        </Reveal>

        {/* Closing rail */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-t border-paper/15 pt-7">
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
