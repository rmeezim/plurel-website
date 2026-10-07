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
  The header is a slim bar that becomes a floating glass pill. At the top
  of the page it spans the width: transparent with paper type over a
  cinematic hero, a paper bar everywhere else. Once the page scrolls it
  squeezes into a narrower, shorter, square-cornered pill of frosted glass
  with a lit edge,
  like the hero's flutes, whose tint follows whatever sits behind it (dark
  glass and paper type over graphite or red, light glass and ink over
  paper).
  Desktop menus open a Swiss panel under it; mobile opens a full-screen
  red index.
*/

const BAR_HEIGHT = "h-14 lg:h-16";

type Tone = "dark" | "light";

/** How opaque an element really is, its ancestors' opacity included */
function shownOpacity(el: Element): number {
  let o = 1;
  for (let e: Element | null = el; e && o > 0.05; e = e.parentElement) {
    const cs = getComputedStyle(e);
    if (cs.visibility === "hidden") return 0;
    o *= Number(cs.opacity);
  }
  return o;
}

/** Whether the first visible, opaque surface under a point is dark or light */
function toneAt(x: number, y: number, skip: Element | null): Tone {
  for (const el of document.elementsFromPoint(x, y)) {
    if (skip?.contains(el)) continue;
    const bg = getComputedStyle(el).backgroundColor;
    const nums = bg.match(/[\d.]+/g)?.map(Number) ?? [];
    let lum: number;
    let alpha: number;
    if (bg.startsWith("rgb")) {
      const [r, g, b, a = 1] = nums;
      lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      alpha = a;
    } else if (bg.startsWith("color(srgb")) {
      const [r, g, b, a = 1] = nums;
      lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      alpha = a;
    } else if (bg.startsWith("okl")) {
      lum = nums[0] > 1 ? nums[0] / 100 : nums[0];
      alpha = nums.length > 3 ? nums[3] : 1;
    } else continue;
    if (alpha < 0.5 || shownOpacity(el) < 0.5) continue;
    return lum < 0.5 ? "dark" : "light";
  }
  return "light";
}

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
          Eight disciplines, run as one system.
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
        className="group relative col-span-4 bg-brand flex min-h-[220px] flex-col justify-between overflow-hidden p-6 text-paper sm:col-span-6 lg:col-span-3"
      >
        <Meta className="relative text-blush">(Free) · ~1 business day</Meta>
        <span className="relative">
          <span className="block text-[26px] leading-[1.05] tracking-[-0.02em]">
            The Distribution Diagnostic
          </span>
          <span className="mt-2 block text-[13px] leading-relaxed text-paper/80">
            A strategist&apos;s read on where your marketing system breaks.
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

      <div className="relative col-span-4 bg-graphite flex min-h-[220px] flex-col justify-between overflow-hidden p-6 text-paper sm:col-span-6 lg:col-span-3">
        <Meta className="relative text-fog">(Northeon)</Meta>
        <p className="relative text-[15px] leading-relaxed text-paper/85">
          Plurel is Northeon&apos;s distribution engineering company: every
          relevant channel, run as one system. Its sister, Kelwin, turns that
          demand into revenue.
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
  const [behind, setBehind] = useState<Tone>("dark");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

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

  // Scroll state, and the tone of whatever sits behind the bar's centre,
  // sampled at most once a frame
  useEffect(() => {
    let raf = 0;
    const probe = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
      const bar = barRef.current;
      if (!bar) return;
      const r = bar.getBoundingClientRect();
      setBehind(toneAt(r.left + r.width / 2, r.top + r.height / 2, headerRef.current));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(probe);
    };
    probe();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

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

  const pill = scrolled;
  // Paper type over dark glass, ink over light; an open menu reads as paper
  const tone: Tone = menu ? "light" : pill ? behind : overlayRoute ? "dark" : "light";
  const surface = pill
    ? tone === "dark"
      ? "glass-dark border-paper/15 bg-graphite/55 text-paper"
      : "glass-light border-ink/10 bg-paper/70 text-ink"
    : menu || !overlayRoute
      ? "border-ink/10 bg-paper text-ink"
      : "border-paper/15 bg-transparent text-paper";
  const shape = pill
    ? "mt-2.5 h-12 w-[calc(100%-1.5rem)] max-w-[1080px] rounded-[2px] border backdrop-blur-xl backdrop-saturate-150"
    : `mt-0 ${BAR_HEIGHT} w-full max-w-[100vw] rounded-none border-b`;

  return (
    <>
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50" onMouseLeave={scheduleClose}>
        <div
          ref={barRef}
          className={`mx-auto transition-[width,max-width,height,margin,border-radius,background-color,border-color,color] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${shape} ${surface}`}
        >
          <div
            className={`mx-auto flex h-full max-w-[1440px] items-center justify-between gap-6 transition-[padding] duration-500 ${
              pill ? "px-3 sm:px-4 lg:px-5" : "px-5 sm:px-8 lg:px-12"
            }`}
          >
            <Link href="/" onClick={closeAll} className="shrink-0" aria-label="Plurel home">
              <Logo className={`w-auto transition-[height] duration-500 ${pill ? "h-[19px]" : "h-[20px] lg:h-[22px]"}`} />
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

            <div className="flex items-center gap-4">
              <Meta className="hidden opacity-70 xl:block">
                <CityClock visitor />
              </Meta>
              <Link
                href={AUDIT_HREF}
                onClick={closeAll}
                className={`group hidden items-center gap-3 border text-[11px] font-medium uppercase tracking-[0.18em] transition-[height,padding,background-color,border-color,color] duration-300 sm:inline-flex ${
                  pill ? "h-8 rounded-[1px] px-3.5" : "h-10 px-4"
                } ${
                  tone === "light"
                    ? "border-ink/25 hover:border-brand hover:bg-brand hover:text-paper"
                    : "border-paper/40 hover:border-paper hover:bg-paper hover:text-ink"
                }`}
              >
                Get in touch
                <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label="Open menu"
                className={`inline-flex items-center justify-center border transition-[width,height,border-color] duration-300 lg:hidden ${
                  pill ? "size-9 rounded-[1px]" : "size-10"
                } ${tone === "light" ? "border-ink/25" : "border-paper/40"}`}
              >
                <Menu className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop menu panel: full width under the bar, a card under the pill */}
        {menu && (
          <div
            id={`menu-${menu}`}
            className={`mega-in mx-auto hidden bg-paper text-ink lg:block ${
              pill
                ? "mt-2 w-[calc(100%-1.5rem)] max-w-[1080px] rounded-[2px] border border-ink/10 px-6"
                : "border-b border-ink/10"
            }`}
            onMouseEnter={cancelClose}
          >
            <div className={pill ? "" : CONTAINER}>
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
          className="scrim-in fixed inset-0 bg-brand z-[60] flex flex-col overflow-y-auto text-paper lg:hidden"
        >
          <div className={`${CONTAINER} relative flex shrink-0 items-center justify-between ${BAR_HEIGHT}`}>
            <Link href="/" onClick={closeAll} aria-label="Plurel home">
              <Logo className="h-[22px] w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="inline-flex size-10 items-center justify-center border border-paper/40"
            >
              <Close className="size-5" />
            </button>
          </div>

          <nav
            aria-label="Mobile"
            className={`${CONTAINER} relative flex-1 border-t border-paper/20 pt-4`}
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

          <div className={`${CONTAINER} relative shrink-0 space-y-5 py-8`}>
            <Link
              href={AUDIT_HREF}
              onClick={closeAll}
              className="flex h-14 items-center justify-between bg-paper px-6 text-[12px] font-medium uppercase tracking-[0.18em] text-ink"
            >
              Get in touch
              <ArrowUpRight className="size-4" />
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-3 text-blush">
              <Meta>
                <CityClock visitor />
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
