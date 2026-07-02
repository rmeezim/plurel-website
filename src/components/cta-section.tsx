import Link from "next/link";
import { ArrowUpRight, Spark } from "@/components/icons";

export function CtaSection() {
  return (
    <section
      id="start"
      aria-labelledby="cta-heading"
      className="relative overflow-hidden bg-brand text-paper"
    >
      {/* Oversized brand mark, clipped by the band */}
      <Spark
        aria-hidden
        className="absolute -right-16 -top-24 size-[340px] rotate-12 text-paper/10"
      />
      <div className="relative mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/70">
          <Spark className="size-3.5" aria-hidden />
          Start your transformation
        </p>
        <h2
          id="cta-heading"
          className="mt-6 max-w-[16ch] font-sans text-[clamp(2.5rem,6.4vw,5.5rem)] font-normal leading-[1.02] tracking-[-0.02em]"
        >
          Let&rsquo;s build what{" "}
          <em className="font-serif italic">sets you apart</em>.
        </h2>
        <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-paper/85 sm:text-base">
          Book a 30-minute strategy call. You&rsquo;ll leave with a sharper
          read on your brand, your visibility, and your next move &mdash;
          whatever you decide.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-lg bg-paper px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-canvas"
          >
            Book Strategy Call
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <a
            href="mailto:hello@plurel.com"
            className="border-b border-paper/40 pb-0.5 text-sm text-paper transition-colors hover:border-paper"
          >
            hello@plurel.com
          </a>
        </div>
      </div>
    </section>
  );
}
