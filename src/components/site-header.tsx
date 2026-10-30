"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CityClock } from "@/components/city-clock";
import { ArrowRight, ArrowUpRight, Close, Menu } from "@/components/icons";
import { Logo } from "@/components/logo";
import { CONTAINER, GRID } from "@/components/system";
import { AUDIT_HREF, CONTACT_EMAIL, MOBILE_NAV, ENGAGEMENTS, PRIMARY, SERVICES } from "@/lib/nav";

type MenuKey = "services";

/*
  The header is a slim bar that becomes a floating glass pill. At the top
  of every page it spans the width, transparent with paper type over the
  page's dark opening (every page opens in the graphite room). Once the
  page scrolls it squeezes into a narrower, shorter, square-cornered pill
  of frosted glass with a lit edge, like the hero's flutes, whose tint
  follows whatever sits behind it (dark glass and paper type over
  graphite or red, light glass and ink over paper). Services opens a dark
  panel under it: the four engagements, the ten disciplines and the
  Diagnostic; the other links go straight to their pages. Mobile opens a
  full-screen red index.
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
      className="px-3 py-2 text-[15px] tracking-[-0.005em] opacity-80 transition-opacity hover:opacity-100 xl:px-3.5"
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
  onToggle: (key: MenuKey, viaKeyboard: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      // the panel exists only while open
      aria-controls={open ? `menu-${menuKey}` : undefined}
      // hover opens for a mouse only: a tap opens on its click
      onPointerEnter={(e) => e.pointerType === "mouse" && onOpen(menuKey)}
      onClick={(e) => onToggle(menuKey, e.detail === 0)}
      className={`flex items-center gap-2 px-3 py-2 text-[15px] tracking-[-0.005em] transition-opacity xl:px-3.5 ${
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
      {/* The engagements: what a company comes for, each run on all four layers */}
      <div className="col-span-4 sm:col-span-6 lg:col-span-5">
        <p className="text-[13px] font-medium text-fog">Engagements</p>
        <ul className="mt-2.5 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
          {ENGAGEMENTS.map((p) => (
            <li key={p.key} className="border-t border-paper/10">
              <Link href={p.href} onClick={onNavigate} className="group block py-3">
                <span className="block text-[22px] leading-[1.1] tracking-[-0.02em] text-paper transition-colors group-hover:text-signal">
                  {p.term}
                </span>
                <span className="mt-1 block text-[13px] leading-snug text-fog">{p.want}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/services"
          onClick={onNavigate}
          className="group mt-5 inline-flex items-center gap-2 border-b border-signal pb-1.5 text-[14px] font-medium tracking-[-0.005em] text-paper"
        >
          All engagements and disciplines
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* The disciplines, each also hired on its own */}
      <div className="col-span-4 sm:col-span-6 lg:col-span-4">
        <p className="text-[13px] font-medium text-fog">Disciplines</p>
        <ul className="mt-2.5 grid grid-cols-2 gap-x-6">
          {SERVICES.map((svc) => (
            <li key={svc.slug} className="border-t border-paper/10">
              <Link
                href={svc.href}
                onClick={onNavigate}
                className="block py-2.5 text-[15px] leading-[1.25] text-paper transition-colors hover:text-signal"
              >
                {svc.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={AUDIT_HREF}
        onClick={onNavigate}
        className="group relative col-span-4 flex min-h-[220px] flex-col justify-between overflow-hidden bg-brand p-6 text-paper sm:col-span-6 lg:col-span-3"
      >
        <span className="relative text-[13px]">Free, back within a business day</span>
        <span className="relative">
          <span className="block text-[26px] leading-[1.05] tracking-[-0.02em]">The Diagnostic</span>
          <span className="mt-2 block text-[13px] leading-relaxed">
            A strategist&apos;s read on where your distribution breaks.
          </span>
          <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium tracking-[-0.005em]">
            Request it
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </span>
      </Link>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [behind, setBehind] = useState<Tone>("dark");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // The panel a hovering mouse opened: the click that usually follows the
  // hover keeps it open rather than toggling it shut
  const hoverOpened = useRef<MenuKey | null>(null);
  const openMenu = (key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    hoverOpened.current = key;
    setMenu(key);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMenu(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  // Opened from the keyboard, the panel takes focus (it renders after the
  // whole bar, so Tab alone would visit five unrelated stops first)
  const kbMenu = useRef<MenuKey | null>(null);
  const toggleMenu = (key: MenuKey, viaKeyboard = false) => {
    // read from the ref, not state: a quick click can land before the
    // hover's open has rendered
    const hovered = hoverOpened.current === key;
    hoverOpened.current = null;
    if (hovered && !viaKeyboard) return;
    kbMenu.current = viaKeyboard && menu !== key ? key : null;
    setMenu((current) => (current === key ? null : key));
  };
  // a closed panel forgets the hover that opened it, so a later tap toggles
  useEffect(() => {
    if (!menu) hoverOpened.current = null;
  }, [menu]);
  useEffect(() => {
    if (!menu || kbMenu.current !== menu) return;
    kbMenu.current = null;
    document.querySelector<HTMLElement>(`#menu-${menu} a[href]`)?.focus();
  }, [menu]);
  const closeAll = () => {
    setMenu(null);
    setMobileOpen(false);
  };

  // Scroll state every frame; the tone of whatever sits behind the bar is
  // hit-tested at most every 120ms, plus once when scrolling settles
  useEffect(() => {
    let raf = 0;
    let lastTone = 0;
    let settle: ReturnType<typeof setTimeout> | undefined;
    const tone = () => {
      lastTone = performance.now();
      const bar = barRef.current;
      if (!bar) return;
      const r = bar.getBoundingClientRect();
      // Light glass if any part of the bar sits over a light surface (a
      // 3 x 3 sample, edges included, so a chapter boundary passing behind
      // it counts), so its type never ends up thin on paper
      const tones = [r.top + 2, r.top + r.height / 2, r.bottom - 2].flatMap((y) =>
        [0.2, 0.5, 0.8].map((f) => toneAt(r.left + r.width * f, y, headerRef.current)),
      );
      setBehind(tones.includes("light") ? "light" : "dark");
    };
    const probe = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
      if (performance.now() - lastTone > 120) tone();
      clearTimeout(settle);
      settle = setTimeout(tone, 140);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(probe);
    };
    probe();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Leaving an open panel from inside returns focus to its trigger
        const panel = document.activeElement?.closest<HTMLElement>("[id^='menu-']");
        if (panel) document.querySelector<HTMLElement>(`[aria-controls="${panel.id}"]`)?.focus();
        setMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The full-screen mobile index owns the viewport and the keyboard while
  // open: focus moves to Close, Tab cycles inside, the page behind is inert,
  // and closing hands focus back to the Open menu button
  const openBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (!mobileOpen) {
      if (wasOpen.current) openBtn.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const behind = [document.getElementById("main"), document.querySelector("body > footer")];
    behind.forEach((el) => el?.setAttribute("inert", ""));
    closeBtn.current?.focus();
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !dialog.current) return;
      const stops = Array.from(dialog.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      if (!stops.length) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onTab);
    // The index is hidden from lg up: a window widened past it closes it,
    // so the page never stays inert behind a menu nobody can see
    const wide = window.matchMedia("(min-width: 64rem)");
    const onWide = () => wide.matches && setMobileOpen(false);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onTab);
      wide.removeEventListener("change", onWide);
      behind.forEach((el) => el?.removeAttribute("inert"));
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const pill = scrolled;
  // Paper type over dark glass, ink over light; an open menu is dark
  const tone: Tone = menu ? "dark" : pill ? behind : "dark";
  const surface = pill
    ? tone === "dark"
      ? "glass-dark border-paper/15 bg-graphite/55 text-paper"
      : "glass-light border-ink/10 bg-paper/70 text-ink"
    : menu
      ? "border-paper/10 bg-charcoal text-paper"
      : "border-paper/15 bg-transparent text-paper";
  const shape = pill
    ? "mt-2.5 h-12 w-[calc(100%-1.5rem)] max-w-[1080px] rounded-[2px] border backdrop-blur-xl backdrop-saturate-150"
    : `mt-0 ${BAR_HEIGHT} w-full max-w-[100vw] rounded-none border-b`;

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 [html:not([data-js])_&]:absolute"
        onMouseLeave={scheduleClose}
        onBlur={(e) => {
          // Tabbing out of the header closes an open panel, so focus never
          // sits behind it
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMenu(null);
        }}
      >
        <div
          ref={barRef}
          className={`mx-auto transition-[width,max-width,height,margin,border-radius,background-color,border-color,color] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none ${shape} ${surface}`}
        >
          <div
            className={`mx-auto flex h-full max-w-[1440px] items-center justify-between gap-6 transition-[padding] duration-500 motion-reduce:transition-none ${
              pill ? "px-3 sm:px-4 lg:px-5" : "px-5 sm:px-8 lg:px-12"
            }`}
          >
            <Link href="/" onClick={closeAll} className="shrink-0" aria-label="Plurel home">
              <Logo className={`w-auto transition-[height] duration-500 motion-reduce:transition-none ${pill ? "h-[19px]" : "h-[20px] lg:h-[22px]"}`} />
            </Link>

            <nav aria-label="Primary" className="hidden items-center lg:flex">
              <MenuTrigger
                label="Services"
                menuKey="services"
                open={menu === "services"}
                onOpen={openMenu}
                onToggle={toggleMenu}
              />
              {PRIMARY.map((item) => (
                <NavLink key={item.href} href={item.href} onNavigate={closeAll}>
                  {item.name}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <span className="hidden text-[13px] opacity-70 xl:block">
                <CityClock visitor />
              </span>
              <Link
                href={AUDIT_HREF}
                onClick={closeAll}
                className={`group hidden items-center gap-2.5 border text-[14px] font-medium tracking-[-0.005em] transition-[height,padding,background-color,border-color,color] duration-300 motion-reduce:transition-none sm:inline-flex ${
                  pill ? "h-8 rounded-[1px] px-3.5" : "h-10 px-4"
                } ${
                  // its own colour, not the bar's: inherited, its transition
                  // would restart on every frame of the bar's and lag behind
                  tone === "light"
                    ? "border-ink/25 text-ink hover:border-brand hover:bg-brand hover:text-paper"
                    : "border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink"
                }`}
              >
                Request a diagnostic
                <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <button
                ref={openBtn}
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-expanded={mobileOpen}
                aria-controls={mobileOpen ? "mobile-menu" : undefined}
                aria-label="Open menu"
                className={`inline-flex items-center justify-center border transition-[width,height,border-color] duration-300 motion-reduce:transition-none lg:hidden [html:not([data-js])_&]:hidden ${
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
            className={`mega-in mx-auto hidden bg-charcoal text-paper lg:block ${
              pill
                ? "mt-2 w-[calc(100%-1.5rem)] max-w-[1080px] rounded-[2px] border border-paper/10 px-6"
                : "border-b border-paper/10"
            }`}
            onMouseEnter={cancelClose}
          >
            <div className={pill ? "" : CONTAINER}>
              <ServicesPanel onNavigate={closeAll} />
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
          ref={dialog}
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
              ref={closeBtn}
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
              {MOBILE_NAV.map((item) => (
                <li key={item.href} className="border-b border-paper/20">
                  <Link href={item.href} onClick={closeAll} className="flex items-baseline py-3">
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
              className="flex h-14 items-center justify-between bg-paper px-6 text-[16px] font-medium tracking-[-0.005em] text-ink"
            >
              Request a diagnostic
              <ArrowUpRight className="size-4" />
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-3 text-paper">
              <span className="text-[14px]">
                <CityClock visitor />
              </span>
              <span className="text-[14px]">{CONTACT_EMAIL}</span>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
