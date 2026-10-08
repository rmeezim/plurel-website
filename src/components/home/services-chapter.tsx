import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { ServicesFold } from "@/components/services-fold";
import {
  Accent,
  ChapterHead,
  CONTAINER,
  CtaLink,
  GRID,
  Meta,
} from "@/components/system";
import { CLOCKWISE } from "@/lib/fold";
import { MARK_CELLS } from "@/lib/mark";
import { SERVICES } from "@/lib/nav";

const MARK_NAME = "The Plurel mark: eight disciplines, numbered 01 to 08, around your brand";

/** Where each discipline sits in the system the margin chain names */
const STAGE: Record<string, string> = {
  "website-design": "Create",
  "brand-identity": "Narrative",
  "aeo-seo": "Distribute",
  "content-marketing": "Create",
  "paid-ads": "Distribute",
  "pr-reputation": "Distribute",
  "creative-direction": "Narrative",
  "martech-consulting": "Measure",
};

/*
  (02) Services opens with the fold: the manifesto's red room continues,
  splits along the page grid into nine panels (your brand at the center,
  the eight disciplines around it), then folds into the Plurel mark in the
  left margin, under the standfirst and beside the statement. The mark
  stays as a small index of the eight services. ServicesFold drives the
  motion; everything here is the server-rendered markup, and with motion
  off it is simply the finished, static chapter. The contents page below
  stays the primary list of services: it reads down, then across.
*/
export function ServicesChapter() {
  // Service k sits in mark cell CLOCKWISE[k], clockwise from top-left
  const placed = SERVICES.map((s, k) => ({ ...s, cell: MARK_CELLS[CLOCKWISE[k]] }));

  return (
    <section aria-labelledby="services-heading" className="fold relative bg-paper text-ink">
      <a
        href="#services"
        className="fold-skip sr-only z-20 bg-ink px-4 py-3 text-sm text-paper focus:not-sr-only focus:absolute focus:left-5 focus:top-24 lg:focus:left-12"
      >
        Skip the services animation
      </a>

      <ServicesFold>
        <span
          id="services"
          aria-hidden
          className="fold-anchor pointer-events-none absolute left-0 top-0 h-px w-px"
        />

        <div data-fold-stage className="fold-stage relative">
          {/* The moving layer: room, panels, labels. Decorative only; the
              same information lives in the figure and the rows. */}
          <div data-fold-fx aria-hidden className="fold-fx absolute inset-0">
            <span data-fold-backdrop className="absolute inset-0 bg-brand" />
            {MARK_CELLS.map((_, i) => (
              <span
                key={i}
                data-fold-cell
                className="fold-cell absolute left-0 top-0 origin-top-left bg-brand"
              />
            ))}
            <p
              data-fold-room
              className="fold-room type-display absolute left-0 top-0 m-0 origin-top-left whitespace-nowrap text-[clamp(2.25rem,9vw,7.5rem)] leading-none text-paper"
            >
              Your brand.
            </p>
            {placed.map((s) => (
              <span
                key={s.slug}
                data-fold-label
                className="fold-label absolute left-0 top-0 text-paper"
              >
                <Meta className="block">{s.index}</Meta>
                <span
                  data-fold-name
                  className="mt-1 block whitespace-nowrap text-[12px] leading-tight tracking-[-0.01em] sm:text-[15px] lg:text-[clamp(0.9375rem,1.4vw,1.25rem)]"
                >
                  <span className="lg:hidden">{s.short}</span>
                  <span className="hidden lg:inline">{s.name}</span>
                </span>
              </span>
            ))}
            <span data-fold-center className="absolute left-0 top-0 text-paper">
              <Meta>Your brand</Meta>
            </span>
          </div>

          {/* The resolved frame. With motion off, this is the chapter. */}
          <div
            data-fold-content
            className={`fold-content relative z-10 ${CONTAINER} pt-24 lg:pt-36`}
          >
            <div data-fold-head>
              <ChapterHead index="02" label="Services" meta="Eight disciplines · One system" />
            </div>

            <div className={`fold-body ${GRID} mt-12 gap-y-8 lg:mt-16 lg:gap-y-12`}>
              {/* Margin: a small standfirst and the chain the system runs on */}
              <div data-fold-h2 className="col-span-4 sm:col-span-4 lg:col-span-3 lg:row-start-1 lg:pt-3">
                <p className="max-w-[34ch] text-[15px] leading-[1.5] text-ink/70 sm:text-[16px] sm:leading-[1.55]">
                  Every relevant channel, run as one system. The budget follows the bottleneck.
                </p>
                {/* Two unbreakable halves, so a narrow margin wraps the chain in balance */}
                <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-ink/15 pt-3 font-mono text-[11px] uppercase tracking-[0.03em]">
                  {[["Narrative", "Create"], ["Distribute", "Measure"]].map((half, h) => (
                    <span key={h} className="inline-flex items-center gap-2 whitespace-nowrap">
                      {half.map((w, i) =>
                        h === 1 && i === 1 ? (
                          <b key={w} className="font-medium text-brand">{w}</b>
                        ) : (
                          <span key={w} className="inline-flex items-center gap-2">
                            {w}
                            <svg viewBox="0 0 24 24" aria-hidden className="size-3 fill-none stroke-brand stroke-2">
                              <path d="M4 12h16M14 6l6 6-6 6" />
                            </svg>
                          </span>
                        ),
                      )}
                    </span>
                  ))}
                </p>
              </div>

              <h2
                id="services-heading"
                data-fold-h2
                className="type-display col-span-4 text-[clamp(2rem,min(5.6vw,9svh),5.25rem)] leading-[1.02] sm:col-span-6 lg:col-span-8 lg:col-start-5 lg:row-start-1"
              >
                Everything that makes you <Accent className="text-muted">visible</Accent>, built as one system.
              </h2>

              <div className="fold-slot col-span-4 sm:col-span-3 lg:col-span-3 lg:col-start-1 lg:row-start-2">
                {/* Phones: the mark and its caption side by side; sm and up: caption below */}
                <figure className="fold-fig m-0 flex items-end gap-4 sm:block">
                  <div
                    data-fold-art
                    className="fold-mark relative aspect-square w-[calc(50%-0.5rem)] shrink-0 [container-type:inline-size] sm:w-full"
                  >
                    <LogoMark className="block size-full text-brand forced-colors:text-[CanvasText]" title={MARK_NAME} />

                    {/* Pointer index: each outer cell opens its service.
                        Keyboard and screen readers use the rows below. */}
                    {placed.map((s) => {
                      const [cx, cy, w, h] = s.cell;
                      return (
                        <Link
                          key={s.slug}
                          href={s.href}
                          aria-hidden
                          tabIndex={-1}
                          data-i={s.index}
                          className="fold-hit group absolute overflow-hidden"
                          style={{
                            // 1px of bleed so the flood covers the mark's
                            // anti-aliased edge
                            left: `calc(${cx * 10}% - 1px)`,
                            top: `calc(${cy * 10}% - 1px)`,
                            width: `calc(${w * 10}% + 2px)`,
                            height: `calc(${h * 10}% + 2px)`,
                            borderRadius: "calc(1.35cqw + 1px)",
                          }}
                        >
                          <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-y-100 motion-reduce:transition-none" />
                        </Link>
                      );
                    })}

                    <div aria-hidden>
                      {placed.map((s) => {
                        const [cx, cy] = s.cell;
                        return (
                          <span
                            key={s.slug}
                            data-fold-mark-label
                            className="fold-mark-label pointer-events-none absolute text-paper"
                            style={{ left: `calc(${cx * 10}% + 6px)`, top: `calc(${cy * 10}% + 6px)` }}
                          >
                            <Meta className="block">{s.index}</Meta>
                          </span>
                        );
                      })}
                      <span
                        data-fold-mark-center
                        className="fold-mark-label pointer-events-none absolute text-paper"
                        style={{ left: "calc(30% + 6px)", top: "calc(30% + 6px)", width: "calc(40% - 12px)" }}
                      >
                        <Meta>Your brand</Meta>
                      </span>
                    </div>
                  </div>

                  <figcaption data-fold-caption className="grid min-w-0 flex-1 text-[11px] leading-snug text-ink/60 sm:mt-3">
                    <span data-readout="default" className="[grid-area:1/1]">
                      <Meta>
                        <span className="text-brand">Fig. 02</span> · Eight disciplines around your brand
                      </Meta>
                    </span>
                    {SERVICES.map((s) => (
                      <span
                        key={s.slug}
                        aria-hidden
                        data-readout={s.index}
                        className="fold-readout opacity-0 [grid-area:1/1]"
                      >
                        <Meta className="inline-flex items-center gap-2">
                          ({s.index}) {s.name} <ArrowUpRight className="size-3" />
                        </Meta>
                      </span>
                    ))}
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>

          <div data-fold-foot aria-hidden className="fold-foot absolute inset-x-0">
            <div className={CONTAINER}>
              <div className="flex justify-between gap-4 border-t border-ink/15 pb-5 pt-3">
                <Meta className="text-ink/60">Fig. 02 · The mark, at room scale</Meta>
                <Meta className="hidden text-ink/60 sm:block">Eight disciplines · One brand</Meta>
              </div>
            </div>
          </div>
        </div>
      </ServicesFold>

      <div className={`fold-after ${CONTAINER} pb-24 lg:pb-36`}>
        <div className={`${GRID} gap-y-10 pt-12 lg:pt-16`}>
          <div className="order-2 col-span-4 flex sm:col-span-3 lg:pointer-events-none lg:order-1 lg:col-span-3 lg:items-end">
            <CtaLink href="/services" className="pointer-events-auto w-full">
              All services
            </CtaLink>
          </div>

          <Reveal className="order-1 col-span-4 sm:col-span-6 lg:order-2 lg:col-span-8 lg:col-start-5">
            <div className="flex h-9 items-center justify-between">
              <Meta>Contents</Meta>
              <Meta className="text-muted">01–08</Meta>
            </div>
            <ol className="grid gap-x-8 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-4">
              {SERVICES.map((s, i) => (
                <li
                  key={s.slug}
                  className={`border-t ${i === 0 || i === 4 ? "border-ink" : "border-ink/15"} ${i === 3 || i === 7 ? "sm:border-b sm:border-b-ink/15" : ""} ${i === 7 ? "border-b border-b-ink/15" : ""}`}
                >
                  <Link
                    href={s.href}
                    className="group relative -mt-px grid grid-cols-[minmax(0,1fr)_1.25rem] border-t-2 border-transparent pb-5 pt-3.5 outline-none transition-colors hover:border-brand focus-visible:border-brand"
                  >
                    <Meta className="text-brand">
                      {s.index}
                      <span className="text-muted"> · {STAGE[s.slug]}</span>
                    </Meta>
                    <ArrowUpRight className="size-[18px] justify-self-end text-ink/35 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand group-focus-visible:text-brand" />
                    <span className="type-display col-span-2 mt-2 text-[clamp(1.375rem,2.3vw,1.875rem)] leading-[1.05]">
                      {s.name}
                    </span>
                    <span className="col-span-2 mt-2 text-[15px] leading-[1.45] text-muted">{s.tagline}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
