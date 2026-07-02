import Link from "next/link";
import { ArrowUpRight, Spark } from "@/components/icons";
import { ManifestoStatement } from "@/components/manifesto-statement";

export function ManifestoSection() {
  return (
    <section
      id="manifesto"
      aria-labelledby="manifesto-heading"
      className="relative overflow-hidden bg-charcoal text-paper"
    >
      {/* Growth-system blueprint — a faint schematic of the machinery
          behind the brand: channels wired into one hub */}
      <svg
        aria-hidden
        viewBox="0 0 340 280"
        className="pointer-events-none absolute right-4 top-1/2 hidden w-[400px] -translate-y-1/2 lg:block xl:right-12"
      >
        <g stroke="#fbfaf6" strokeOpacity="0.14" strokeWidth="1">
          <line x1="170" y1="138" x2="52" y2="36" />
          <line x1="170" y1="138" x2="268" y2="28" />
          <line x1="170" y1="138" x2="292" y2="140" />
          <line x1="170" y1="138" x2="226" y2="240" />
          <line x1="170" y1="138" x2="66" y2="232" />
        </g>
        <g fill="#fbfaf6" fillOpacity="0.18">
          <circle cx="111" cy="87" r="2" />
          <circle cx="231" cy="189" r="2" />
        </g>
        <g fill="#20201e" stroke="#fbfaf6" strokeOpacity="0.22">
          <rect x="20" y="24" width="64" height="24" rx="12" />
          <rect x="236" y="16" width="64" height="24" rx="12" />
          <rect x="260" y="128" width="64" height="24" rx="12" />
          <rect x="194" y="228" width="64" height="24" rx="12" />
          <rect x="34" y="220" width="64" height="24" rx="12" />
        </g>
        <g
          fill="#fbfaf6"
          fillOpacity="0.4"
          fontSize="8"
          letterSpacing="2"
          textAnchor="middle"
        >
          <text x="52" y="39">WEB</text>
          <text x="268" y="31">AEO</text>
          <text x="292" y="143">CRM</text>
          <text x="226" y="243">CONTENT</text>
          <text x="66" y="235">PAID</text>
        </g>
        <circle cx="170" cy="138" r="12" fill="none" stroke="#bf3a36" strokeOpacity="0.6" />
        <circle cx="170" cy="138" r="4.5" fill="#bf3a36" fillOpacity="0.75" />
      </svg>
      <div className="relative mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
          <Spark className="size-3.5 text-brand" aria-hidden />
          The Plurel manifesto
        </p>

        <ManifestoStatement />

        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-paper/15 pt-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
            A Northeon division
          </p>
          <p className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50 sm:block">
            We redesign the growth system behind the brand
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
