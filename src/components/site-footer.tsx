import Link from "next/link";
import { CityClock } from "@/components/city-clock";
import { Logo } from "@/components/logo";
import {
  CONTAINER,
  GRID,
  Kicker,
  Meta,
} from "@/components/system";
import { COMPANY, CONTACT_EMAIL, SERVICES } from "@/lib/nav";

/*
  Footer: the oxblood room every page ends in. One invitation, the index
  of the site in Swiss columns, then the full-width lockup signing off.
*/
export function SiteFooter() {
  return (
    <footer className="bg-oxblood text-paper">

      <div className={`${CONTAINER} pt-20 lg:pt-28`}>
        <div className={`${GRID} gap-y-14`}>
          {/* Invitation */}
          <div className="col-span-4 sm:col-span-6 lg:col-span-5">
            <Kicker tone="dark">New business</Kicker>
            <p className="mt-6 max-w-[16ch] text-[clamp(2rem,4vw,3.5rem)] leading-[1] tracking-[-0.035em]">
              Tell us where growth is stuck.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-8 inline-block border-b border-signal pb-1 text-[clamp(1.25rem,2vw,1.625rem)] tracking-[-0.01em] text-paper transition-colors hover:text-blush"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          {/* Index */}
          <nav
            aria-label="Services"
            className="col-span-4 sm:col-span-3 lg:col-span-3 lg:col-start-7"
          >
            <Meta className="text-paper/45">(Services)</Meta>
            <ul className="mt-5 space-y-3">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={s.href}
                    className="text-[15px] text-paper/80 transition-colors hover:text-paper"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company" className="col-span-4 sm:col-span-3 lg:col-span-3">
            <Meta className="text-paper/45">(Company)</Meta>
            <ul className="mt-5 space-y-3">
              {COMPANY.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[15px] text-paper/80 transition-colors hover:text-paper"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

        </div>

        {/* Full-width lockup */}
        <div className="mt-24 lg:mt-32">
          <Logo className="h-auto w-full text-brand" title="Plurel" />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-paper/15 py-6 text-paper/50">
          <Meta>&copy; 2026 Plurel · A Northeon division</Meta>
          <Meta>
            <CityClock />
          </Meta>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-paper">
              <Meta>Privacy</Meta>
            </Link>
            <Link href="/terms" className="transition-colors hover:text-paper">
              <Meta>Terms</Meta>
            </Link>
            <a href="#top" className="transition-colors hover:text-paper">
              <Meta>Back to top ↑</Meta>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
