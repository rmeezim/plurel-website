import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import {
  Accent,
  ChapterHead,
  CONTAINER,
  GRID,
  Meta,
  TextLink,
} from "@/components/system";
import { SERVICES } from "@/lib/nav";

/** (02) The eight disciplines as a Swiss index; each row floods red on hover */
export function ServicesChapter() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative bg-paper text-ink"
    >
      <div className={`${CONTAINER} relative pt-24 lg:pt-36`}>
        <ChapterHead index="02" label="Services" meta="Eight disciplines · One system" />

        <div className={`${GRID} mt-14 gap-y-10 lg:mt-20`}>
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-7">
            <h2
              id="services-heading"
              className="text-[clamp(2.25rem,5vw,5rem)] font-normal leading-[0.98] tracking-[-0.04em]"
            >
              Everything that makes you <Accent>visible</Accent>, built as one
              system.
            </h2>
          </Reveal>
          <Reveal
            delay={0.1}
            className="col-span-4 self-end sm:col-span-4 lg:col-span-4 lg:col-start-9"
          >
            <p className="max-w-[40ch] text-[17px] leading-relaxed text-ink/70">
              Hire one discipline or the whole system. Every piece is designed
              to feed the next: brand into site, site into search, search into
              pipeline.
            </p>
            <TextLink href="/services" className="mt-7">
              All services
            </TextLink>
          </Reveal>
        </div>
      </div>

      <ul className="relative mt-16 border-b border-ink/15 lg:mt-24">
        {SERVICES.map((s) => (
          <li key={s.slug} className="border-t border-ink/15">
            <Link href={s.href} className="group relative block overflow-hidden outline-none">
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-brand transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
              />
              <span className={`${CONTAINER} relative block`}>
                <span className={`${GRID} items-center py-6 lg:py-8`}>
                  <Meta className="col-span-1 text-brand transition-colors group-hover:text-paper group-focus-visible:text-paper lg:col-span-2">
                    ({s.index})
                  </Meta>
                  <span className="col-span-3 sm:col-span-3 lg:col-span-5">
                    <span className="block text-[clamp(1.5rem,3.2vw,2.75rem)] leading-none tracking-[-0.03em] transition-colors group-hover:text-paper group-focus-visible:text-paper">
                      {s.name}
                    </span>
                    <span className="mt-2 block text-[13px] text-muted transition-colors group-hover:text-paper/85 sm:hidden">
                      {s.tagline}
                    </span>
                  </span>
                  <span className="hidden text-[15px] text-muted transition-colors group-hover:text-paper/85 group-focus-visible:text-paper/85 sm:col-span-2 sm:block lg:col-span-4">
                    {s.tagline}
                  </span>
                  <span className="hidden justify-end lg:col-span-1 lg:flex">
                    <ArrowUpRight className="size-6 text-ink/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper group-focus-visible:text-paper" />
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
