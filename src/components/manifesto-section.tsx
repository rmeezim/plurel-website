import Link from "next/link";
import { ArrowUpRight, Spark } from "@/components/icons";

export function ManifestoSection() {
  return (
    <section
      id="manifesto"
      aria-labelledby="manifesto-heading"
      className="bg-charcoal text-paper"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
          <Spark className="size-3.5 text-brand" aria-hidden />
          The Plurel manifesto
        </p>

        <h2
          id="manifesto-heading"
          className="mt-8 max-w-[26ch] font-sans text-[clamp(1.9rem,4.4vw,4rem)] font-normal leading-[1.12] tracking-[-0.02em]"
        >
          Most businesses don&rsquo;t have a quality problem &mdash; they have
          a <em className="font-serif italic text-clay">presence</em>
          {" problem. We build the visible layer of your brand, so the work "}
          you&rsquo;re proud of finally{" "}
          <em className="font-serif italic text-clay">looks the part</em>.
        </h2>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-paper/15 pt-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
            A Northeon division
          </p>
          <p className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50 sm:block">
            8 disciplines &middot; one partner
          </p>
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-paper transition-colors hover:text-clay"
          >
            Our story
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
