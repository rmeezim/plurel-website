import Link from "next/link";
import { CityClock } from "@/components/city-clock";
import { ArrowUpRight } from "@/components/icons";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { CONTAINER, GRID } from "@/components/system";
import { COMPANY, CONTACT_EMAIL, DIAGNOSTIC_HREF, PACKAGES, SERVICES } from "@/lib/nav";

/*
  Footer: the quiet firm index every page ends on. The closing chapter
  above does the inviting, so there is no headline and no second CTA here:
  the lockup and the identity line frame the identity column, and the legal
  bar registers to the same column edges as the index above it, under one
  plain hairline. No numbers, no mono: it is a list of links.

  Graphite room, paper type, fog labels, red only as markers and the
  lockup's signature. The top 72/96px stays empty for the glass band that
  hangs over the footer's top edge.
*/

/* One row pitch across all three lists, so rows line up horizontally:
   30px for a mouse on desktop (the mock), 40px wherever a finger taps. */
const ROW = "min-h-10 lg:pointer-fine:min-h-[30px]";
const LIST = "mt-3 lg:pointer-fine:mt-[18px]";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

const LINK = `inline-flex items-center ${ROW} text-[15px] leading-[1.25] text-paper transition-colors hover:text-signal ${FOCUS}`;

const LABEL =
  "flex gap-2.5 text-[14px] font-medium leading-5 tracking-[-0.005em] text-fog";

const BAR_LINK = `inline-flex min-h-10 items-center transition-colors hover:text-paper ${FOCUS}`;

export function SiteFooter() {
  return (
    <footer className="bg-graphite text-paper">
      <div className={`${CONTAINER} pb-6 pt-[72px] lg:pb-7 lg:pt-24`}>
        <Reveal>
          <div className={`${GRID} items-stretch gap-y-12 lg:gap-y-0`}>
            {/* Identity: lockup on top, the identity line pinned to the
                bottom of the index, so the two frame it */}
            <div className="col-span-4 flex flex-col justify-between gap-6 sm:col-span-6 lg:col-span-3">
              <Logo className="block h-auto w-[148px] text-brand" title="Plurel" />
              <p className="max-w-[320px] text-[14px] leading-[22px] text-fog lg:mb-1">
                Plurel is a distribution engineering firm: one team for every
                relevant channel, answerable for one number.
              </p>
            </div>

            <nav
              aria-label="Packages"
              className="col-span-4 min-[390px]:col-span-2 lg:col-span-2 lg:col-start-4"
            >
              <p className={LABEL}>
                Packages
              </p>
              <ul className={LIST}>
                {PACKAGES.map((p) => (
                  <li key={p.key} className="flex">
                    <Link href={p.href} className={LINK}>
                      {p.term}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav
              aria-label="Services"
              className="col-span-4 min-[390px]:col-span-2 lg:col-span-3 lg:col-start-6"
            >
              <p className={LABEL}>
                Services
              </p>
              <ul className={LIST}>
                {SERVICES.map((s) => (
                  <li key={s.slug} className="flex">
                    <Link href={s.href} className={LINK}>
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav
              aria-label="Company"
              className="col-span-4 min-[390px]:col-span-2 lg:col-span-2 lg:col-start-9"
            >
              <p className={LABEL}>
                Company
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

            <div className="col-span-4 min-[390px]:col-span-2 lg:col-span-2 lg:col-start-11">
              <p className={LABEL}>Contact</p>
              <ul className={LIST}>
                <li className="flex">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className={`${LINK} underline decoration-signal decoration-1 underline-offset-[6px]`}
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li className="flex">
                  <Link href={DIAGNOSTIC_HREF} className={`group gap-2 ${LINK}`}>
                    The Diagnostic
                    <ArrowUpRight
                      aria-hidden
                      strokeWidth={2.4}
                      className="size-3 shrink-0 text-signal motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
                <li>
                  <p className={`flex items-center gap-2 ${ROW} text-[15px] leading-[1.25]`}>
                    <span aria-hidden className="block size-1.5 shrink-0 rounded-full bg-signal" />
                    <CityClock className="[&>span]:mx-0.5 [&>span]:text-fog" />
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Legal bar under one plain hairline. Phones: copyright and Back
            to top, then Privacy and Terms. Desktop: registered to the
            columns at 1, 4, 6 and 9. */}
        <div className={`${GRID} mt-14 border-t border-paper/15 pt-1 text-[14px] text-fog lg:mt-20`}>
          <p className="order-1 col-span-2 flex min-h-10 items-center sm:order-none lg:col-span-3">
            &copy; 2026 Plurel
          </p>
          <p className="order-3 col-span-2 sm:order-none sm:col-span-1 lg:col-span-2">
            <Link href="/privacy" className={BAR_LINK}>
              Privacy
            </Link>
          </p>
          <p className="order-4 col-span-2 sm:order-none sm:col-span-1 lg:col-span-3">
            <Link href="/terms" className={BAR_LINK}>
              Terms
            </Link>
          </p>
          <p className="order-2 col-span-2 sm:order-none lg:col-span-4">
            <a href="#top" className={BAR_LINK}>
              Back to top <span aria-hidden>&uarr;</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
