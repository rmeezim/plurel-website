import Link from "next/link";
import { Spark } from "@/components/icons";

const EXPLORE = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const SERVICES = [
  { label: "Website Design", slug: "website-design" },
  { label: "Brand Identity", slug: "brand-identity" },
  { label: "AEO / SEO", slug: "aeo-seo" },
  { label: "Content Marketing", slug: "content-marketing" },
  { label: "Paid Ads", slug: "paid-ads" },
  { label: "PR & Reputation", slug: "pr-reputation" },
];

export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-paper">
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-8 pt-16 sm:px-8 lg:px-12 lg:pt-20">
        {/* Top: brand + link columns */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-[minmax(0,1fr)_auto_auto] lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:gap-x-20">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <p className="flex items-center gap-3">
              <span className="text-xl font-extrabold tracking-tight">
                PLUREL
              </span>
              <Spark className="size-3.5 text-brand" aria-hidden />
            </p>
            <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
              A Northeon division
            </p>
            <p className="mt-5 max-w-[32ch] text-sm leading-relaxed text-paper/60">
              Premium digital brand experiences &mdash; and the growth systems
              behind them.
            </p>
          </div>

          <nav aria-label="Explore">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-paper/80 transition-colors hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
              Services
            </p>
            <ul className="mt-4 space-y-2.5">
              {SERVICES.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/services/${item.slug}`}
                    className="text-sm text-paper/80 transition-colors hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
              Contact
            </p>
            <address className="mt-4 space-y-2.5 not-italic">
              <p>
                <a
                  href="mailto:hello@plurel.com"
                  className="text-sm text-paper/80 transition-colors hover:text-paper"
                >
                  hello@plurel.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+15550123456"
                  className="text-sm text-paper/80 transition-colors hover:text-paper"
                >
                  +1 (555) 012-3456
                </a>
              </p>
              <p className="text-sm leading-relaxed text-paper/60">
                12 Harbor Lane, Suite 400
                <br />
                New York, NY
              </p>
            </address>
          </div>
        </div>

        {/* Oversized wordmark */}
        <p
          aria-hidden
          className="mt-16 select-none text-[clamp(4rem,13.5vw,12.5rem)] font-extrabold leading-[0.85] tracking-[-0.04em] text-paper/[0.07]"
        >
          PLUREL<span className="text-brand/30">*</span>
        </p>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-paper/15 pt-6">
          <p className="text-[13px] text-paper/50">
            &copy; 2026 Plurel &mdash; A Northeon division
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-[13px] text-paper/50 transition-colors hover:text-paper"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-[13px] text-paper/50 transition-colors hover:text-paper"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
