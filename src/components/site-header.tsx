"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CityClock } from "@/components/city-clock";
import { ArrowUpRight, Close, Menu } from "@/components/icons";
import { Logo } from "@/components/logo";
import { CONTAINER, GRID, Kicker, Meta } from "@/components/system";
import {
  AUDIT_HREF,
  COMPANY,
  CONTACT_EMAIL,
  MOBILE_NAV,
  OVERLAY_ROUTES,
  SERVICES,
} from "@/lib/nav";

type MenuKey = "services" | "company";

/*
  The header is one fixed bar in two states. Over a cinematic hero it is
  transparent with paper type and a hairline (overlay); everywhere else,
  and as soon as the page scrolls, it is a paper bar with ink type (solid).
  Desktop menus drop a full-width Swiss panel; mobile opens a full-screen
  red index.
*/

const BAR_HEIGHT = "h-[72px] lg:h-[84px]";

function NavLink({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="px-3 py-2 text-[12px] font-medium uppercase tracking-[0.18em] opacity-80 transition-opacity hover:opacity-100 xl:px-4"
    >
      {children}
    </Link>
  );
}

function MenuTrigger({
  label,
  menuKey,
  open,
  onOpen,
  onToggle,
}: {
  label: string;
  menuKey: MenuKey;
  open: boolean;
  onOpen: (key: MenuKey) => void;
  onToggle: (key: MenuKey) => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={`menu-${menuKey}`}
      onMouseEnter={() => onOpen(menuKey)}
      onClick={() => onToggle(menuKey)}
      className={`flex items-center gap-2 px-3 py-2 text-[12px] font-medium uppercase tracking-[0.18em] transition-opacity xl:px-4 ${
        open ? "opacity-100" : "opacity-80 hover:opacity-100"
      }`}
    >
      {label}
      <span
        aria-hidden
        className={`size-[5px] bg-current transition-transform duration-300 ${
          open ? "rotate-45" : ""
        }`}
      />
    </button>
  );
}

function ServicesPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className={`${GRID} gap-y-8 py-10`}>
      <div className="col-span-4 sm:col-span-6 lg:col-span-3">
        <Kicker>Services</Kicker>
        <p className="mt-5 max-w-[26ch] text-[22px] leading-[1.15] tracking-[-0.02em] text-ink">
          Eight disciplines, run as one growth system.
        </p>
        <Link
          href="/services"
          onClick={onNavigate}
          className="group mt-6 inline-flex items-center gap-2 border-b border-brand pb-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink"
        >
          All services
          <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <ul className="col-span-4 grid grid-cols-1 sm:col-span-6 sm:grid-cols-2 lg:col-span-6 lg:gap-x-8">
        {SERVICES.map((s) => (
          <li key={s.slug} className="border-t border-ink/10">
            <Link
              href={s.href}
              onClick={onNavigate}
              className="group grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-2 py-3.5"
            >
              <Meta className="pt-1 text-muted transition-colors group-hover:text-brand">
                {s.index}
              </Meta>
              <span>
                <span className="block text-[15px] text-ink transition-colors group-hover:text-brand">
                  {s.name}
                </span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">
                  {s.tagline}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={AUDIT_HREF}
        onClick={onNavigate}
        className="surface-red grain group relative col-span-4 flex min-h-[220px] flex-col justify-between overflow-hidden p-6 text-paper sm:col-span-6 lg:col-span-3"
      >
        <Meta className="relative z-[2] text-blush">(Free) · ~1 business day</Meta>
        <span className="relative z-[2]">
          <span className="block text-[26px] leading-[1.05] tracking-[-0.02em]">
            The Growth Audit
          </span>
          <span className="mt-2 block text-[13px] leading-relaxed text-paper/80">
            A strategist&apos;s read on your brand, site, and AI visibility.
          </span>
          <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em]">
            Request it
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </span>
      </Link>
    </div>
  );
}

function CompanyPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className={`${GRID} gap-y-8 py-10`}>
      <div className="col-span-4 sm:col-span-6 lg:col-span-3">
        <Kicker>Company</Kicker>
        <p className="mt-5 max-w-[26ch] text-[22px] leading-[1.15] tracking-[-0.02em] text-ink">
          A senior team, accountable for the whole system.
        </p>
      </div>

      <ul className="col-span-4 grid grid-cols-1 sm:col-span-6 sm:grid-cols-2 lg:col-span-6 lg:gap-x-8">
        {COMPANY.map((item, i) => (
          <li key={item.href} className="border-t border-ink/10">
            <Link
              href={item.href}
              onClick={onNavigate}
              className="group grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-2 py-3.5"
            >
              <Meta className="pt-1 text-muted transition-colors group-hover:text-brand">
                {String(i + 1).padStart(2, "0")}
              </Meta>
              <span>
                <span className="block text-[15px] text-ink transition-colors group-hover:text-brand">
                  {item.name}
                </span>
                <span className="mt-0.5 block text-[12.5px] text-muted">
                  {item.desc}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="surface-oxblood grain relative col-span-4 flex min-h-[220px] flex-col justify-between overflow-hidden p-6 text-paper sm:col-span-6 lg:col-span-3">
        <Meta className="relative z-[2] text-paper/55">(Northeon)</Meta>
        <p className="relative z-[2] text-[15px] leading-relaxed text-paper/85">
          Plurel is Northeon&apos;s creative and growth division: brand, web,
          AI search, and the martech underneath, built as one system.
        </p>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const overlayRoute = OVERLAY_ROUTES.has(pathname);

  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = (key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(key);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMenu(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const toggleMenu = (key: MenuKey) =>
    setMenu((current) => (current === key ? null : key));
  const closeAll = () => {
    setMenu(null);
    setMobileOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The full-screen mobile index owns the viewport while open
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const solid = !overlayRoute || scrolled || menu !== null;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid
            ? "border-b border-ink/10 bg-paper/92 text-ink backdrop-blur-md"
            : "border-b border-paper/15 bg-transparent text-paper"
        }`}
        onMouseLeave={scheduleClose}
      >
        <div className={`${CONTAINER} flex items-center justify-between gap-6 ${BAR_HEIGHT}`}>
          <Link href="/" onClick={closeAll} className="shrink-0" aria-label="Plurel home">
            <Logo className="h-[22px] w-auto lg:h-[24px]" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center lg:flex">
            <MenuTrigger
              label="Services"
              menuKey="services"
              open={menu === "services"}
              onOpen={openMenu}
              onToggle={toggleMenu}
            />
            <NavLink href="/work" onNavigate={closeAll}>
              Work
            </NavLink>
            <NavLink href="/methodology" onNavigate={closeAll}>
              Method
            </NavLink>
            <MenuTrigger
              label="Company"
              menuKey="company"
              open={menu === "company"}
              onOpen={openMenu}
              onToggle={toggleMenu}
            />
            <NavLink href="/blog" onNavigate={closeAll}>
              Journal
            </NavLink>
          </nav>

          <div className="flex items-center gap-5">
            <Meta className="hidden opacity-70 xl:block">
              <CityClock />
            </Meta>
            <Link
              href={AUDIT_HREF}
              onClick={closeAll}
              className={`group hidden h-11 items-center gap-3 border px-5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 sm:inline-flex ${
                solid
                  ? "border-ink/25 hover:border-brand hover:bg-brand hover:text-paper"
                  : "border-paper/40 hover:border-paper hover:bg-paper hover:text-ink"
              }`}
            >
              Growth audit
              <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              className={`inline-flex size-11 items-center justify-center border transition-colors lg:hidden ${
                solid ? "border-ink/25" : "border-paper/40"
              }`}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

        {/* Desktop menu panel */}
        {menu && (
          <div
            id={`menu-${menu}`}
            className="mega-in hidden border-t border-ink/10 bg-paper text-ink lg:block"
            onMouseEnter={cancelClose}
          >
            <div className={CONTAINER}>
              {menu === "services" ? (
                <ServicesPanel onNavigate={closeAll} />
              ) : (
                <CompanyPanel onNavigate={closeAll} />
              )}
            </div>
          </div>
        )}
      </header>

      {/* Scrim behind an open desktop menu */}
      {menu && (
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          onMouseEnter={() => setMenu(null)}
          onClick={() => setMenu(null)}
          className="scrim-in fixed inset-0 z-40 hidden cursor-default bg-ink/30 backdrop-blur-[2px] lg:block"
        />
      )}

      {/* Mobile: full-screen red index */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="surface-red grain scrim-in fixed inset-0 z-[60] flex flex-col overflow-y-auto text-paper lg:hidden"
        >
          <div className={`${CONTAINER} relative z-[2] flex shrink-0 items-center justify-between ${BAR_HEIGHT}`}>
            <Link href="/" onClick={closeAll} aria-label="Plurel home">
              <Logo className="h-[22px] w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="inline-flex size-11 items-center justify-center border border-paper/40"
            >
              <Close className="size-5" />
            </button>
          </div>

          <nav
            aria-label="Mobile"
            className={`${CONTAINER} relative z-[2] flex-1 border-t border-paper/20 pt-4`}
          >
            <ul>
              {MOBILE_NAV.map((item, i) => (
                <li key={item.href} className="border-b border-paper/20">
                  <Link
                    href={item.href}
                    onClick={closeAll}
                    className="flex items-baseline gap-4 py-3"
                  >
                    <Meta className="w-8 text-blush">
                      {String(i + 1).padStart(2, "0")}
                    </Meta>
                    <span className="text-[clamp(2rem,9vw,3rem)] leading-none tracking-[-0.03em]">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={`${CONTAINER} relative z-[2] shrink-0 space-y-5 py-8`}>
            <Link
              href={AUDIT_HREF}
              onClick={closeAll}
              className="flex h-14 items-center justify-between bg-paper px-6 text-[12px] font-medium uppercase tracking-[0.18em] text-ink"
            >
              Book a growth audit
              <ArrowUpRight className="size-4" />
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-3 text-blush">
              <Meta>
                <CityClock />
              </Meta>
              <Meta>{CONTACT_EMAIL}</Meta>
            </div>
          </div>
        </div>
      )}

      {/* Pages without a cinematic hero start below the bar */}
      {!overlayRoute && <div aria-hidden className={BAR_HEIGHT} />}
    </>
  );
}
