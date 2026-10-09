import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { ServicesType } from "@/components/home/services-type";
import { Accent, ChapterHead, CONTAINER, CtaLink, GRID } from "@/components/system";
import { SERVICES } from "@/lib/nav";
import { SERVICE_STAGE, stageName } from "@/lib/services-type";
import s from "./services-type.module.css";

/*
  (02) Services, on graphite: a hard cut from the paper manifesto, whose
  braid ends on "One system. One number.", and before (03) Method on red.

  The figure (Fig. 02, ServicesType) is the contents list itself: the
  eight names first appear in eight suppliers' voices, line up on the
  rows ("still a menu"), then are set as one system, stage by stage along
  the chain. Everything here is the server-rendered, finished chapter;
  with motion off it is simply the list, with the chain live.

  The rows: equal heights, hairlines on the container measure (the same
  edges as the running head), index in column 1, stage in 2 to 3, the
  name flush on column 4, the line on 9 to 12 (8 to 12 below xl, where
  the names step down to leave it one line). Phones and tablets: index,
  name, stage and arrow, then the line, never wrapping from 360px up.
*/
export function ServicesChapter() {
  const last = SERVICES.length - 1;

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className={`${s.root} bg-graphite text-paper`}
    >
      <div className={`${CONTAINER} pt-24 lg:pt-36`}>
        <ChapterHead index="02" label="Services" meta="Eight disciplines · One system" tone="dark" />

        <div className={`${GRID} mt-12 items-start gap-y-7 lg:mt-16`}>
          <h2
            id="services-heading"
            className="type-display col-span-4 text-[clamp(2.25rem,1.4rem+3.6vw,5.25rem)] leading-none sm:col-span-6 lg:col-span-9 lg:col-start-4 lg:row-start-1"
          >
            Everything that makes you <Accent className="text-fog">visible</Accent>, built as one system.
          </h2>
          <p className="col-span-4 max-w-[34ch] text-[17px] leading-[1.5] text-fog lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:pt-3.5 lg:text-[16px]">
            Every relevant channel, run as one system. The budget follows the bottleneck.
          </p>
        </div>
      </div>

      <ServicesType items={SERVICES.map((svc) => ({ name: svc.name, st: SERVICE_STAGE[svc.slug] ?? "create" }))}>
        <ol data-type-list="" className={`${s.list} ${CONTAINER} m-0 grid list-none`}>
          {SERVICES.map((svc, i) => {
            const st = SERVICE_STAGE[svc.slug] ?? "create";
            return (
              <li key={svc.slug} data-row="" data-st={st} className={`${s.row} relative`}>
                <span
                  aria-hidden
                  data-rule=""
                  className={`${s.rule} absolute inset-x-0 top-0 h-px origin-left bg-paper/20`}
                />
                <span
                  aria-hidden
                  className={`${s.hot} absolute inset-x-0 -top-px h-0.5 origin-left bg-signal`}
                />
                <span
                  aria-hidden
                  data-cur=""
                  className={`${s.cur} pointer-events-none absolute inset-x-0 -top-px h-0.5 origin-left bg-signal`}
                />
                {i === last && (
                  <span
                    aria-hidden
                    data-rule-end=""
                    className={`${s.rule} absolute inset-x-0 bottom-0 h-px origin-left bg-paper/20`}
                  />
                )}
                <Link
                  href={svc.href}
                  className="grid h-full grid-cols-[1.625rem_auto_minmax(0,1fr)_1.25rem] content-start sm:grid-cols-[2.75rem_auto_minmax(0,1fr)_1.25rem] items-baseline py-[var(--rp)] outline-none lg:grid-cols-12 lg:gap-x-8"
                >
                  <span
                    data-meta=""
                    className={`${s.dim} col-start-1 row-start-1 text-[13px] tabular-nums text-signal sm:text-[14px] lg:text-[15px]`}
                  >
                    {svc.index}
                  </span>
                  <span
                    data-slot=""
                    className={`${s.dim} ${s.name} type-display relative col-start-2 row-start-1 whitespace-nowrap leading-none lg:col-span-4 lg:col-start-4 xl:col-span-5`}
                  >
                    <span data-nm="">{svc.name}</span>
                  </span>
                  <span
                    data-meta=""
                    className={`${s.dim} col-start-3 row-start-1 justify-self-end whitespace-nowrap pl-2.5 pr-2 text-[13px] text-fog sm:text-[15px] lg:col-span-2 lg:col-start-2 lg:justify-self-start lg:p-0`}
                  >
                    {stageName(st)}
                  </span>
                  <span
                    data-meta=""
                    className={`${s.dim} ${s.tag} col-span-3 col-start-2 row-start-2 mt-1 text-[13px] min-[414px]:text-[14px] leading-[1.3] text-fog sm:text-[15px] lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mt-0 lg:pr-8 lg:text-[clamp(14px,1.05vw,15px)] lg:leading-[1.4] xl:col-span-4 xl:col-start-9`}
                  >
                    {svc.tagline}
                  </span>
                  <span
                    data-meta=""
                    className={`${s.dim} ${s.arr} col-start-4 row-start-1 self-center justify-self-end text-paper/45 lg:col-start-12 lg:self-baseline`}
                  >
                    <ArrowUpRight className="block size-[18px] lg:size-5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </ServicesType>

      <div className={`${CONTAINER} pb-28 pt-10 lg:pb-40 lg:pt-12`}>
        <div className={GRID}>
          <div className="col-span-4 sm:col-span-3">
            <CtaLink href="/services" className="w-full">
              All services
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
