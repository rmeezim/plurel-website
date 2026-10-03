import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { ServicesFold } from "@/components/services-fold";
import {
  Accent,
  ChapterHead,
  CONTAINER,
  GRID,
  Meta,
  TextLink,
} from "@/components/system";
import { CLOCKWISE } from "@/lib/fold";
import { MARK_CELLS } from "@/lib/mark";
import { SERVICES } from "@/lib/nav";

const MARK_NAME = "The Plurel mark: eight disciplines, numbered 01 to 08, around your brand";

/*
  (02) Services opens with the fold: the manifesto's red room continues,
  splits along the page grid into nine panels (your brand at the center,
  the eight disciplines around it), then folds into the Plurel mark beside
  the headline. The mark stays as a small index of the eight services.
  ServicesFold drives the motion; everything here is the server-rendered
  markup, and with motion off it is simply the finished, static chapter.
  The eight rows below stay the primary list of services.
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
              className="fold-room absolute left-0 top-0 m-0 origin-top-left whitespace-nowrap font-serif text-[clamp(2.25rem,9vw,7.5rem)] italic leading-none text-paper"
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

            <div className={`fold-body ${GRID} mt-14 gap-y-10 lg:mt-20 lg:items-end`}>
              <h2
                id="services-heading"
                data-fold-h2
                className="col-span-4 text-[clamp(2.25rem,5vw,5rem)] font-normal leading-[0.98] tracking-[-0.04em] sm:col-span-6 lg:col-span-8 lg:self-end"
              >
                Everything that makes you <Accent>visible</Accent>, built as one system.
              </h2>

              <div className="fold-slot col-span-3 lg:col-span-3 lg:col-start-10">
                <figure className="fold-fig m-0">
                  <div
                    data-fold-art
                    className="fold-mark relative aspect-square w-full [container-type:inline-size]"
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

                  <figcaption data-fold-caption className="mt-3 grid text-[11px] leading-snug text-ink/60">
                    <span data-readout="default" className="[grid-area:1/1]">
                      <Meta>Fig. 02 · Eight disciplines around one brand</Meta>
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

      <div className={CONTAINER}>
        <div className={`${GRID} pt-12 lg:pt-16`}>
          <Reveal className="col-span-4 sm:col-span-4 lg:col-span-3 lg:col-start-10">
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
            <Link href={s.href} className="group relative block overflow-hidden outline-hidden">
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
                    <span className="mt-2 block text-[13px] text-muted transition-colors group-hover:text-paper/85 group-focus-visible:text-paper/85 sm:hidden">
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
