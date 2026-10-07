import Link from "next/link";
import { CityClock } from "@/components/city-clock";
import { ArrowUpRight } from "@/components/icons";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { CONTAINER, GRID, Meta } from "@/components/system";
import { AUDIT_HREF, COMPANY, CONTACT_EMAIL, SERVICES } from "@/lib/nav";

/*
  Footer: the quiet firm index every page ends on. The closing chapter
  above does the inviting, so there is no headline and no second CTA here:
  the lockup and the Northeon line frame the identity column, Services hangs
  its indexes in the gutter, and the legal bar registers to the same column
  edges as the index above it, marked by the ticked hairline.

  Paper room, ink type, muted labels, brand red only as markers and the
  lockup's signature. The top 72/96px stays empty for the glass band that
  hangs over the footer's top edge.
*/

const count = (n: number) => String(n).padStart(2, "0");

/* One row pitch across all three lists, so rows line up horizontally:
   30px for a mouse on desktop (the mock), 40px wherever a finger taps. */
const ROW = "min-h-10 lg:pointer-fine:min-h-[30px]";
const LIST = "mt-3 lg:pointer-fine:mt-[18px]";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const LINK = `inline-flex items-center ${ROW} text-[15px] leading-[1.25] text-ink transition-colors hover:text-brand ${FOCUS}`;

const LABEL =
  "flex gap-2.5 text-[12px] font-medium uppercase leading-4 tracking-[0.09em] text-muted";

const BAR_LINK = `inline-flex min-h-10 items-center transition-colors hover:text-ink ${FOCUS}`;

/* Ticked hairline: phones mark the four column edges; from sm up both
   edges of every column, so the gutters read like registration marks. */
const TICK = Array.from({ length: 12 }, (_, i) =>
  i < 4 ? "block" : i < 6 ? "hidden sm:block" : "hidden lg:block",
);

export function SiteFooter() {
  return (
    <footer className="bg-paper text-ink">
      <div className={`${CONTAINER} pb-6 pt-[72px] lg:pb-7 lg:pt-24`}>
        <Reveal>
          <div className={`${GRID} items-stretch gap-y-12 lg:gap-y-0`}>
            {/* Identity: lockup on top, the Northeon line pinned to the
                bottom of the index, so the two frame it */}
            <div className="col-span-4 flex flex-col justify-between gap-6 sm:col-span-6 lg:col-span-4">
              <Logo className="block h-auto w-[148px] text-brand" title="Plurel" />
              <p className="max-w-[320px] text-[14px] leading-[22px] text-muted lg:mb-1">
                Plurel is Northeon&rsquo;s distribution engineering company:
                every relevant channel, run as one system. Its sister, Kelwin, turns
                that demand into revenue.
              </p>
            </div>

            <nav
              aria-label="Services"
              className="col-span-4 min-[390px]:col-span-2 lg:col-span-3 lg:col-start-5"
            >
              <p className={LABEL}>
                Services <span className="font-normal tabular-nums">{count(SERVICES.length)}</span>
              </p>
              <ol className={LIST}>
                {SERVICES.map((s) => (
                  <li
                    key={s.slug}
                    className="grid grid-cols-[24px_minmax(0,1fr)] items-baseline lg:-ml-[30px] lg:grid-cols-[30px_minmax(0,1fr)]"
                  >
                    <span aria-hidden className="text-[11px] leading-none">
                      <Meta className="tabular-nums text-muted">{s.index}</Meta>
                    </span>
                    <span className="flex">
                      <Link href={s.href} className={LINK}>
                        {s.name}
                      </Link>
                    </span>
                  </li>
                ))}
              </ol>
            </nav>

            <nav
              aria-label="Company"
              className="col-span-4 min-[390px]:col-span-2 lg:col-span-2 lg:col-start-8"
            >
              <p className={LABEL}>
                Company <span className="font-normal tabular-nums">{count(COMPANY.length)}</span>
              </p>
              <ul className={LIST}>
                {COMPANY.map((item) => (
                  <li key={item.href} className="flex">
                    <Link href={item.href} className={LINK}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="col-span-4 sm:col-span-2 lg:col-span-3 lg:col-start-10">
              <p className={LABEL}>Contact</p>
              <ul className={LIST}>
                <li className="flex">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className={`${LINK} underline decoration-brand decoration-1 underline-offset-[6px]`}
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li className="flex">
                  <Link href={AUDIT_HREF} className={`group gap-2 ${LINK}`}>
                    The Diagnostic
                    <ArrowUpRight
                      aria-hidden
                      strokeWidth={2.4}
                      className="size-3 shrink-0 text-brand motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
                <li>
                  <p className={`flex items-center gap-2 ${ROW} text-[15px] leading-[1.25]`}>
                    <span aria-hidden className="block size-1.5 shrink-0 rounded-full bg-brand" />
                    <CityClock className="[&>span]:mx-0.5 [&>span]:text-muted" />
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Ticked hairline: the bar items below start on the same column
            edges as the index above */}
        <div aria-hidden className="relative mt-14 border-t border-ink/15 lg:mt-20">
          <div className={`${GRID} pointer-events-none absolute inset-x-0 top-0`}>
            {TICK.map((show, i) => (
              <span key={i} className={`h-[6px] border-l border-ink/30 sm:border-r ${show}`} />
            ))}
          </div>
        </div>

        {/* Legal bar. Phones: copyright and Back to top, then Privacy and
            Terms. Desktop: registered to the col 1, 5, 8 and 10 ticks. */}
        <div className={`${GRID} pt-1 text-muted`}>
          <Meta as="p" className="order-1 col-span-2 flex min-h-10 items-center sm:order-none lg:col-span-4">
            &copy; 2026 Plurel
          </Meta>
          <p className="order-3 col-span-2 sm:order-none sm:col-span-1 lg:col-span-3">
            <Link href="/privacy" className={BAR_LINK}>
              <Meta>Privacy</Meta>
            </Link>
          </p>
          <p className="order-4 col-span-2 sm:order-none sm:col-span-1 lg:col-span-2">
            <Link href="/terms" className={BAR_LINK}>
              <Meta>Terms</Meta>
            </Link>
          </p>
          <p className="order-2 col-span-2 sm:order-none lg:col-span-3">
            <a href="#top" className={BAR_LINK}>
              <Meta>
                Back to top <span aria-hidden>&uarr;</span>
              </Meta>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
