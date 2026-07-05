"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Close, Menu, Spark } from "@/components/icons";

type MenuKey = "services" | "company";

const SERVICES = [
  { number: "01", name: "Website Design", desc: "Sites that turn attention into inquiries." },
  { number: "02", name: "Brand Identity", desc: "Systems that make you instantly recognisable." },
  { number: "03", name: "AI Search & SEO", desc: "Be the answer when buyers and AI search." },
  { number: "04", name: "Content Marketing", desc: "Editorial that keeps you visible and credible." },
  { number: "05", name: "Paid Ads", desc: "Campaigns tuned for return, not just reach." },
  { number: "06", name: "PR & Reputation", desc: "Proof and press that build trust early." },
  { number: "07", name: "Creative Direction", desc: "One visual voice across every touchpoint." },
  { number: "08", name: "Consulting", desc: "Senior eyes on brand, positioning, and roadmap." },
] as const;

const COMPANY_FEATURES = [
  {
    number: "01",
    name: "About",
    desc: "Our story, team, and the standard we hold.",
    href: "/about",
  },
  {
    number: "02",
    name: "Case Studies",
    desc: "Selected transformations, with the numbers behind them.",
    href: "/work",
  },
  {
    number: "03",
    name: "Methodology",
    desc: "The four-phase operating model we run.",
    href: "/#method",
  },
] as const;

/* Small editorial line glyphs for the rail rows */
function BlogGlyph() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      aria-hidden
    >
      <rect x="3.5" y="3" width="13" height="14" rx="2" />
      <line x1="6.5" y1="7" x2="13.5" y2="7" />
      <line x1="6.5" y1="10" x2="13.5" y2="10" />
      <line x1="6.5" y1="13" x2="11" y2="13" />
    </svg>
  );
}

function ContactGlyph() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 5.5h12a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-6l-3.5 3v-3H4a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 4 5.5Z" />
    </svg>
  );
}

const COMPANY_MORE = [
  {
    name: "Blog",
    desc: "Notes on staying visible.",
    href: "/blog",
    glyph: <BlogGlyph />,
  },
  {
    name: "Contact",
    desc: "Start a conversation.",
    href: "/contact",
    glyph: <ContactGlyph />,
  },
] as const;

function Chevron({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`size-3 transition-transform duration-200 ${active ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  );
}

function MenuTrigger({
  label,
  menuKey,
  active,
  onOpen,
  onToggle,
}: {
  label: string;
  menuKey: MenuKey;
  active: boolean;
  onOpen: (key: MenuKey) => void;
  onToggle: (key: MenuKey) => void;
}) {
  return (
    <button
      type="button"
      aria-haspopup="true"
      aria-expanded={active}
      onMouseEnter={() => onOpen(menuKey)}
      onFocus={() => onOpen(menuKey)}
      onClick={() => onToggle(menuKey)}
      className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition-colors ${
        active ? "bg-line/70 text-ink" : "text-ink/75 hover:text-ink"
      }`}
    >
      {label}
      <Chevron active={active} />
    </button>
  );
}

function ServicesPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="p-6 sm:p-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          What we do
        </p>
        <ul className="mt-3 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
          {SERVICES.map((service, i) => (
            <li
              key={service.name}
              className={i < 6 ? "border-b border-line" : ""}
            >
              <Link
                href="/services"
                onClick={onNavigate}
                className="group flex items-center gap-4 py-3"
              >
                <span className="text-[11px] font-semibold tabular-nums text-muted transition-colors group-hover:text-brand">
                  {service.number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium tracking-[-0.01em] text-ink transition-colors group-hover:text-brand">
                    {service.name}
                  </span>
                  <span className="block truncate text-[12px] text-muted">
                    {service.desc}
                  </span>
                </span>
                <ArrowUpRight className="size-4 -translate-x-1 text-brand opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Rail */}
      <div className="border-t border-line bg-canvas p-6 sm:p-8 lg:border-l lg:border-t-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          Built as a system
        </p>
        <Link
          href="/#growth-system"
          onClick={onNavigate}
          className="group mt-4 block rounded-xl border border-line bg-paper p-5 transition-colors hover:border-brand/40"
        >
          <svg viewBox="0 0 44 24" className="h-6 w-11" fill="none" aria-hidden>
            <line x1="4" y1="12" x2="40" y2="12" stroke="#d8d2c8" strokeWidth="1.25" />
            <circle cx="8" cy="12" r="2.5" fill="#8f8981" />
            <circle cx="22" cy="12" r="2.5" fill="#8f8981" />
            <circle cx="36" cy="12" r="3" fill="#bf3a36" />
          </svg>
          <p className="mt-4 text-[15px] font-medium tracking-[-0.01em] text-ink transition-colors group-hover:text-brand">
            The Growth System
          </p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
            How every service connects into one compounding engine.
          </p>
        </Link>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <Link
            href="/services"
            onClick={onNavigate}
            className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-ink transition-colors hover:text-brand"
          >
            All services
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function CompanyPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="p-6 sm:p-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          The company
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {COMPANY_FEATURES.map((feature) => (
            <Link
              key={feature.name}
              href={feature.href}
              onClick={onNavigate}
              className="group flex min-h-[168px] flex-col justify-between rounded-xl border border-line bg-canvas p-5 transition-colors hover:border-brand/40 hover:bg-paper"
            >
              <div className="flex items-start justify-between">
                <span className="font-serif text-[26px] italic leading-none text-brand/70">
                  {feature.number}
                </span>
                <ArrowUpRight className="size-4 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
              </div>
              <div>
                <p className="text-[15px] font-medium tracking-[-0.01em] text-ink transition-colors group-hover:text-brand">
                  {feature.name}
                </p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
                  {feature.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Rail */}
      <div className="border-t border-line bg-canvas p-6 sm:p-8 lg:border-l lg:border-t-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          More from Plurel
        </p>
        <div className="mt-2 space-y-0.5">
          {COMPANY_MORE.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className="group -mx-3 flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-paper"
            >
              <span className="mt-0.5 text-muted transition-colors group-hover:text-brand">
                {item.glyph}
              </span>
              <span>
                <span className="flex items-center gap-1.5 text-[14px] font-medium text-ink transition-colors group-hover:text-brand">
                  {item.name}
                  <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="block text-[12px] leading-snug text-muted">
                  {item.desc}
                </span>
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-[12.5px] leading-relaxed text-muted">
            Not sure where to start?
          </p>
          <Link
            href="/contact"
            onClick={onNavigate}
            className="group mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand"
          >
            Book a Growth Audit
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerH, setHeaderH] = useState(64);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = (key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(key);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMenu(null), 130);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const toggleMenu = (key: MenuKey) =>
    setMenu((current) => (current === key ? null : key));

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) setHeaderH(headerRef.current.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur-md"
    >
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-4 py-4">
          {/* Brand */}
          <div className="flex items-center gap-3 lg:flex-1">
            <Link
              href="/"
              className="text-xl font-extrabold tracking-tight text-ink"
            >
              PLUREL
            </Link>
            <span className="hidden items-center gap-2 border-l border-line pl-3 sm:flex">
              <Spark className="size-3 text-brand" />
              <span className="text-sm text-muted">A Northeon division</span>
            </span>
          </div>

          {/* Primary nav — mega triggers */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            onMouseLeave={scheduleClose}
          >
            <MenuTrigger
              label="Services"
              menuKey="services"
              active={menu === "services"}
              onOpen={openMenu}
              onToggle={toggleMenu}
            />
            <MenuTrigger
              label="Company"
              menuKey="company"
              active={menu === "company"}
              onOpen={openMenu}
              onToggle={toggleMenu}
            />
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 lg:flex-1">
            <Link
              href="/contact"
              className="hidden items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-[#a8302c] sm:inline-flex"
            >
              Book Growth Audit
              <ArrowUpRight className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-line text-ink transition-colors hover:bg-line/50 lg:hidden"
            >
              {mobileOpen ? (
                <Close className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mega panel */}
        {menu && (
          <div
            className="absolute inset-x-0 top-full z-40 hidden pt-2 lg:block"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="mega-in origin-top overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_30px_60px_-30px_rgba(17,15,10,0.5)]">
              {menu === "services" ? (
                <ServicesPanel onNavigate={() => setMenu(null)} />
              ) : (
                <CompanyPanel onNavigate={() => setMenu(null)} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Scrim — dims the page while a mega menu is open */}
      {menu && (
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          onMouseEnter={() => setMenu(null)}
          onClick={() => setMenu(null)}
          style={{ top: headerH }}
          className="scrim-in fixed inset-x-0 bottom-0 z-30 hidden cursor-default bg-ink/20 backdrop-blur-[1px] lg:block"
        />
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-line bg-canvas lg:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col px-5 py-4 sm:px-8">
            <Link
              href="/services"
              onClick={() => setMobileOpen(false)}
              className="border-b border-line/70 py-3 text-lg text-ink"
            >
              Services
            </Link>
            <p className="pb-1.5 pt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Company
            </p>
            {[
              { name: "About", href: "/about" },
              { name: "Case Studies", href: "/work" },
              { name: "Methodology", href: "/#method" },
              { name: "Blog", href: "/blog" },
              { name: "Contact", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-line/70 py-3 text-lg text-ink"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-medium text-paper"
            >
              Book Growth Audit
              <ArrowUpRight className="size-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
