import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/page";
import { CONTAINER, CtaLink, GRID } from "@/components/system";
import { AUDIT_HREF, MOBILE_NAV } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Page not found — Plurel",
  robots: { index: false },
};

/*
  The 404, in the graphite room like every page: what happened, the way
  home, and the site's index on hairlines, so a link to a page that has
  moved (the journal was /blog) still finds its way.
*/
export default function NotFound() {
  return (
    <main data-room="dark" className="bg-graphite text-paper">
      <PageHead
        lines={["This page isn’t here."]}
        standfirst="It may have moved when the site was rebuilt. Everything is still one click away."
      >
        <CtaLink href="/" arrow="right">
          Back to the homepage
        </CtaLink>
        <CtaLink href={AUDIT_HREF} variant="outline-light" arrow="right">
          Request a diagnostic
        </CtaLink>
      </PageHead>

      <nav aria-label="The site" className={`${CONTAINER} pb-24 lg:pb-32`}>
        <ul className="border-b border-paper/15">
          {MOBILE_NAV.map((item) => (
            <li key={item.href} className="border-t border-paper/15">
              <Link href={item.href} className={`group ${GRID} py-4`}>
                <span className="type-title col-span-4 text-[22px] leading-[1.2] transition-colors group-hover:text-signal sm:col-span-6 lg:col-span-6 lg:text-[26px]">
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
