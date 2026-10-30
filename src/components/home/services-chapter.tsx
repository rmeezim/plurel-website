import { Mona_Sans } from "next/font/google";
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { ServicesType } from "@/components/home/services-type";
import { ChapterHead } from "@/components/page";
import { CONTAINER, CtaLink, GRID } from "@/components/system";
import { SERVICES } from "@/lib/nav";
import { FEEDS_BACK, SERVICE_STAGE, STAGES, stageName, SYSTEM, type StageKey } from "@/lib/services-type";
import s from "./services-type.module.css";

/* The supplier voices' face, loaded for this chapter only: Mona Sans's width
   axis gives the ten suppliers their condensed, wide and in-between cuts.
   The house face they settle into is the site's own, Geist. */
const mona = Mona_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-mona",
  display: "swap",
});

/*
  Why Plurel, on graphite: the thesis, then the ten disciplines shown
  becoming one system. Between Why now and the red Method.

  The figure (ServicesType) starts as a menu: the ten names first
  appear in ten suppliers' voices, line up on the menu's rows ("still a
  menu"), are set in one face stage by stage along the chain, and then
  drain into the Plurel System, read top to bottom, layer by layer,
  Narrative first: each layer a full-bleed band in a graphite tone (a
  step deeper for each layer down), coming down from the foot of the one
  above, its names landing in its rows. Last the loop is drawn along the
  bands: down through the layers, and the Ledger's read back up. What
  stays is the System: four bands, each its name, what it builds, what it
  feeds and its services as links. With motion off, it is simply that.

  The menu is aria-hidden and shown only while the figure runs. Its rows:
  equal heights, hairlines on the container measure, the name flush on
  column 4; the index, stage, line and arrow are never shown but keep
  each row's measure exactly as the contents list had it, so the names
  land where they always did.
*/

const st = (slug: string): StageKey => SERVICE_STAGE[slug] ?? "create";

/** The bands, top to bottom: Narrative first, Measure last */
const LAYERS = STAGES.map((L, s) => ({
  ...L,
  s,
  services: SERVICES.flatMap((svc, i) => (st(svc.slug) === L.key ? [{ i, name: svc.name, href: svc.href }] : [])),
}));
const LAST = STAGES.length - 1;

/*
  The loop, drawn in each band from the same two lines, so they meet
  across the bands as one drawing: the spine (the signal down, through
  every layer's node, an arrowhead where it crosses into the layer
  below) and the return (the Ledger's read, dashed, back up to Narrative,
  tapping the layers it feeds back into). aria-hidden: the bands' text
  says the same in words ("Feeds Create").
*/
function Loop({ s: i, back, label }: { s: number; back: boolean; label: boolean }) {
  return (
    <span aria-hidden className={s.loop}>
      {i > 0 && <span data-loop="in" className={s.lIn} />}
      {i < LAST && <span data-loop="out" className={s.lOut} />}
      {i < LAST && <span data-loop="arrow" className={s.arrow} />}
      <span data-loop="ret" className={`${s.ret} ${i === LAST ? s.retStart : i === 0 ? s.retEnd : ""}`}>
        <span className={s.cover} />
      </span>
      {i === LAST && <span data-loop="stub" className={s.stub} />}
      {back && <span data-loop="tap" className={s.tap} />}
      <span data-loop="node" className={s.node} />
      {label && (
        <span data-loop="note" className={s.label}>
          {SYSTEM.note.replace(". ", ".\n")}
        </span>
      )}
    </span>
  );
}

function SystemBands() {
  return (
    <div data-type-system="" className={s.system}>
      <ol data-type-bands="" aria-labelledby="system-heading" className={s.bands}>
        {LAYERS.map((L) => (
          <li key={L.key} data-band={L.key} className={s.band}>
            <div aria-hidden data-band-fill="" className={s.fill} />
            <div className={`${CONTAINER} ${GRID} ${s.bandIn}`}>
              <h4 data-band-in="" className={`${s.bname} type-display`}>
                {L.name}
              </h4>
              <div data-band-in="" className={s.builds}>
                <p className={`${s.bt} type-title`}>{L.builds}</p>
                <p className={s.bl}>{L.line}</p>
                <p className={s.bf}>{L.feeds}</p>
                {L.s === LAST && <p className={s.bnote}>{SYSTEM.note}</p>}
              </div>
              <ul data-band-in="" className={s.svcs}>
                {L.services.map((svc) => (
                  <li key={svc.href}>
                    <Link href={svc.href} className={s.svc}>
                      <span data-band-name={svc.i} className={`${s.sname} type-title`}>
                        {svc.name}
                      </span>
                      <ArrowUpRight className={s.arr} />
                    </Link>
                  </li>
                ))}
              </ul>
              <Loop s={L.s} back={FEEDS_BACK.includes(L.key)} label={L.key === "create"} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/*
  Below lg, while the figure runs, the pinned frame shows each band's
  name and services only; what each layer builds and feeds follows the
  pin here, top to bottom, in the order the loop runs. Hidden everywhere
  else (the bands carry it).
*/
function SystemLegend() {
  return (
    <div data-type-legend="" className={`${s.legend} ${CONTAINER}`}>
      <p className={s.legLine}>{SYSTEM.line}</p>
      <ol className={s.legList}>
        {STAGES.map((L) => (
          <li key={L.key} className={s.legItem}>
            <p className={s.legLayer}>
              <span aria-hidden data-tone={L.key} className={s.legMark} />
              {L.name}
            </p>
            <p className={`${s.legTitle} type-title`}>{L.builds}</p>
            <p className={s.legText}>{L.line}</p>
            <p className={s.legFeeds}>{L.feeds}</p>
          </li>
        ))}
      </ol>
      <p className={s.legNote}>{SYSTEM.note}</p>
    </div>
  );
}

export function ServicesChapter() {
  const last = SERVICES.length - 1;

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className={`${mona.variable} ${s.root} bg-graphite text-paper`}
    >
      <div className={`${CONTAINER} pt-24 lg:pt-36`}>
        <ChapterHead
          id="services-heading"
          lines={["Your marketing shouldn’t be ten companies.", "It should be one system."]}
          aside="Strategy, brand, site, content, film, creators, search, paid, press and analytics usually sit with ten different suppliers. We run them as one."
        />
      </div>

      <ServicesType items={SERVICES.map((svc) => ({ name: svc.name, st: st(svc.slug) }))} system={<SystemBands />}>
        <ol aria-hidden data-type-list="" className={`${s.menu} ${CONTAINER} m-0 grid list-none`}>
          {SERVICES.map((svc, i) => {
            const stg = st(svc.slug);
            return (
              <li key={svc.slug} data-row="" data-st={stg} className={`${s.row} relative`}>
                <span
                  data-rule=""
                  className="absolute inset-x-0 top-0 h-px origin-left bg-paper/20"
                />
                <span
                  data-cur=""
                  className={`${s.cur} pointer-events-none absolute inset-x-0 -top-px h-0.5 origin-left bg-signal`}
                />
                {i === last && (
                  <span
                    data-rule-end=""
                    className="absolute inset-x-0 bottom-0 h-px origin-left bg-paper/20"
                  />
                )}
                <div className="grid h-full grid-cols-[1.625rem_auto_minmax(0,1fr)_1.25rem] content-start sm:grid-cols-[2.75rem_auto_minmax(0,1fr)_1.25rem] items-baseline py-[var(--rp)] lg:grid-cols-12 lg:gap-x-8">
                  <span
                    data-meta=""
                    className="col-start-1 row-start-1 text-[13px] tabular-nums sm:text-[14px] lg:text-[15px]"
                  >
                    {svc.index}
                  </span>
                  <span
                    data-slot=""
                    className={`${s.name} type-title relative col-start-2 row-start-1 whitespace-nowrap leading-none lg:col-span-4 lg:col-start-4 xl:col-span-5`}
                  >
                    <span data-nm="">{svc.name}</span>
                  </span>
                  <span
                    data-meta=""
                    className="col-start-3 row-start-1 justify-self-end whitespace-nowrap pl-2.5 pr-2 text-[13px] sm:text-[15px] lg:col-span-2 lg:col-start-2 lg:justify-self-start lg:p-0"
                  >
                    {stageName(stg)}
                  </span>
                  <span
                    data-meta=""
                    className={`${s.tag} col-span-3 col-start-2 row-start-2 mt-1 text-[13px] min-[414px]:text-[14px] leading-[1.3] sm:text-[15px] lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mt-0 lg:pr-8 lg:text-[clamp(14px,1.05vw,15px)] lg:leading-[1.4] xl:col-span-4 xl:col-start-9`}
                  >
                    {svc.tagline}
                  </span>
                  <span
                    data-meta=""
                    className="col-start-4 row-start-1 self-center justify-self-end lg:col-start-12 lg:self-baseline"
                  >
                    <ArrowUpRight className="block size-[18px] lg:size-5" />
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </ServicesType>

      <SystemLegend />

      <div className={`${CONTAINER} pb-28 pt-10 lg:pb-40 lg:pt-12`}>
        <div className={GRID}>
          <div className="col-span-4 sm:col-span-3">
            <CtaLink href="/services" variant="outline-light" arrow="right">
              All services
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
