import type { CSSProperties } from "react";
import { ArrowUpRight } from "@/components/icons";
import { ServicesType, type LayerData } from "@/components/home/services-type";
import { ChapterHead, CONTAINER, CtaLink, GRID, H2 } from "@/components/system";
import { SERVICES } from "@/lib/nav";
import { SERVICE_STAGE, STAGES, stackGeometry, stageName, type Pt } from "@/lib/services-type";
import s from "./services-type.module.css";

/*
  Services, on graphite: what the team is made of, as one system. Between
  the red manifesto and the red Method.

  The figure (ServicesType) starts as a menu: the eight names first
  appear in eight suppliers' voices, line up on the menu's rows ("still a
  menu"), are set in one face stage by stage along the chain, and then
  drain into the system, layer by layer, foundation first, each layer a
  plate of glass settling onto the stack. The narrator ends on "Set as
  one, it's a system." What stays is the system: the layer list (the
  real contents, eight service links grouped in four layers) beside the
  stack. With motion off, it is simply that.

  The menu is aria-hidden and shown only while the figure runs. Its rows:
  equal heights, hairlines on the container measure, the name flush on
  column 4; the index, stage, line and arrow are never shown but keep
  each row's measure exactly as the contents list had it, so the names
  land where they always did.
*/

const fmt = (pts: readonly Pt[]) => pts.map((p) => `${p[0]},${p[1]}`).join(" ");

const st = (slug: string) => SERVICE_STAGE[slug] ?? "create";

const LAYERS: LayerData[] = STAGES.map((stg) => ({
  key: stg.key,
  name: stg.name,
  line: stg.line,
  services: SERVICES.filter((svc) => st(svc.slug) === stg.key).map((svc) => ({
    name: svc.name,
    tagline: svc.tagline,
    href: svc.href,
  })),
}));

const GEO = stackGeometry(
  STAGES.map((stg) => ({
    key: stg.key,
    names: SERVICES.flatMap((svc, i) => (st(svc.slug) === stg.key ? [{ i, text: svc.name }] : [])),
  })),
);

/** The stack: four plates, foundation first (each covers the back of the one below) */
function ServicesStack() {
  return (
    <svg
      aria-hidden
      focusable="false"
      data-type-stack=""
      viewBox={`0 0 ${GEO.w} ${GEO.h}`}
      preserveAspectRatio="xMinYMin meet"
      className={s.stack}
      style={{ "--ar": (GEO.w / GEO.h).toFixed(4) } as CSSProperties}
    >
      {GEO.plates.map((p) => (
        <g key={p.key} data-plate={p.key}>
          <g className={s.plateIn}>
            <polygon className={s.sideL} points={fmt(p.sideL)} />
            <polygon className={s.sideR} points={fmt(p.sideR)} />
            <polygon className={s.face} points={fmt(p.face)} />
            <polygon className={s.bezel} points={fmt(p.bezel)} />
            <polyline className={s.edge} points={fmt(p.edge)} />
            <polyline className={s.lip} points={fmt(p.lip)} />
            <polyline data-plate-flash="" className={s.hotEdge} points={fmt(p.edge)} />
            {p.names.map((nm) => (
              <text key={nm.i} data-plate-name={nm.i} className={s.pname} transform={`matrix(${nm.m.join(" ")})`}>
                {nm.text}
              </text>
            ))}
          </g>
        </g>
      ))}
      {GEO.plates.map((p) => (
        <polygon key={p.key} data-plate-hit={p.key} className={s.hit} points={fmt(p.hit)} />
      ))}
    </svg>
  );
}

export function ServicesChapter() {
  const last = SERVICES.length - 1;

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className={`${s.root} bg-graphite text-paper`}
    >
      <div className={`${CONTAINER} pt-24 lg:pt-36`}>
        <div className={`${GRID} items-start gap-y-7 lg:grid-rows-[auto_1fr]`}>
          <ChapterHead
            label="Services"
            tone="dark"
            className="col-span-4 sm:col-span-6 lg:col-span-3 lg:row-start-1 lg:pt-4"
          />
          <h2
            id="services-heading"
            className={`${H2} col-span-4 sm:col-span-6 lg:col-span-9 lg:col-start-4 lg:row-span-2 lg:row-start-1`}
          >
            Everything that makes you visible, built as one system.
          </h2>
          <p className="col-span-4 max-w-[34ch] text-[17px] leading-[1.5] text-fog sm:col-span-6 lg:col-span-3 lg:col-start-1 lg:row-start-2 lg:max-w-[30ch] lg:text-[16px]">
            Only the channels that fit your market. The budget follows the
            bottleneck.
          </p>
        </div>
      </div>

      <ServicesType
        items={SERVICES.map((svc) => ({ name: svc.name, st: st(svc.slug) }))}
        layers={LAYERS}
        stack={<ServicesStack />}
      >
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
                    className={`${s.name} type-display relative col-start-2 row-start-1 whitespace-nowrap leading-none lg:col-span-4 lg:col-start-4 xl:col-span-5`}
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
