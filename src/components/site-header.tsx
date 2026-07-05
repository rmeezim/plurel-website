"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Close, Menu, Spark } from "@/components/icons";

type MenuKey = "services" | "company";

/* ---- Service glyphs (minimal line marks) ---------------------------- */

type ServiceKind =
  | "web"
  | "brand"
  | "search"
  | "content"
  | "ads"
  | "pr"
  | "creative"
  | "consulting";

function ServiceGlyph({ kind }: { kind: ServiceKind }) {
  const p = {
    className: "size-5",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (kind) {
    case "web":
      return (
        <svg {...p}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 9h18" />
          <circle cx="6" cy="7" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "brand":
      return (
        <svg {...p}>
          <circle cx="9.5" cy="12.5" r="5" />
          <rect x="11" y="6" width="9" height="9" rx="1.5" />
        </svg>
      );
    case "search":
      return (
        <svg {...p}>
          <circle cx="10" cy="10" r="6" />
          <path d="M14.5 14.5 19 19" />
          <path d="M10 8v4M8 10h4" strokeWidth="1.1" />
        </svg>
      );
    case "content":
      return (
        <svg {...p}>
          <path d="M7 3h7l4 4v14H7z" />
          <path d="M14 3v4h4" />
          <path d="M10 12h5M10 15h5M10 18h3" strokeWidth="1.1" />
        </svg>
      );
    case "ads":
      return (
        <svg {...p}>
          <path d="M4 5h16l-6 7v5l-4 2v-7z" />
        </svg>
      );
    case "pr":
      return (
        <svg {...p}>
          <path d="M4 10v4l10 4V6z" />
          <path d="M14 8.5a3.5 3.5 0 0 1 0 7" />
        </svg>
      );
    case "creative":
      return (
        <svg {...p}>
          <path d="M8 4H5a1 1 0 0 0-1 1v3" />
          <path d="M16 4h3a1 1 0 0 1 1 1v3" />
          <path d="M20 16v3a1 1 0 0 1-1 1h-3" />
          <path d="M8 20H5a1 1 0 0 1-1-1v-3" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case "consulting":
      return (
        <svg {...p}>
          <path d="M5 5h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-8l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
        </svg>
      );
  }
}

const SERVICES: { name: string; kind: ServiceKind }[] = [
  { name: "Website Design", kind: "web" },
  { name: "Brand Identity", kind: "brand" },
  { name: "AI Search & SEO", kind: "search" },
  { name: "Content Marketing", kind: "content" },
  { name: "Paid Ads", kind: "ads" },
  { name: "PR & Reputation", kind: "pr" },
  { name: "Creative Direction", kind: "creative" },
  { name: "Consulting", kind: "consulting" },
];

function MethodologyGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden
    >
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="4" cy="12" r="1.7" />
      <circle cx="9.3" cy="12" r="1.7" />
      <circle cx="14.6" cy="12" r="1.7" />
      <circle cx="20" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function StudioGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 4H5a1 1 0 0 0-1 1v3" />
      <path d="M16 4h3a1 1 0 0 1 1 1v3" />
      <path d="M20 16v3a1 1 0 0 1-1 1h-3" />
      <path d="M8 20H5a1 1 0 0 1-1-1v-3" />
      <path d="M12 8.5v7M8.5 12h7" strokeWidth="1.2" />
    </svg>
  );
}

function CareersGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="8.5" r="3.2" />
      <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function BlogGlyph() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-[17px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
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
      className="size-[17px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 5.5h12a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-6l-3.5 3v-3H4a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 4 5.5Z" />
    </svg>
  );
}

/* ---- Schematic visuals — the site's own diagram language ------------ */

function AboutVisual() {
  const sats: [number, number][] = [
    [42, 32],
    [156, 26],
    [172, 92],
    [32, 98],
    [106, 16],
  ];
  return (
    <svg
      viewBox="0 0 200 130"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <g stroke="#d8d2c8" strokeWidth="1.1">
        {sats.map(([x, y], i) => (
          <line key={i} x1="100" y1="64" x2={x} y2={y} />
        ))}
      </g>
      {sats.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="3"
          fill="#110f0a"
          fillOpacity="0.4"
          className="diagram-blink"
          style={{ animationDelay: `${i * 0.45}s` }}
        />
      ))}
      <circle cx="100" cy="64" r="7.5" fill="#bf3a36" />
      <circle cx="100" cy="64" r="2.5" fill="#fbfaf6" />
    </svg>
  );
}

function CaseVisual() {
  const bars = ["32%", "48%", "64%", "82%", "100%"];
  return (
    <div className="relative flex h-full w-full flex-col justify-end p-4">
      <div className="absolute inset-x-4 top-3 flex items-baseline justify-between">
        <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-muted">
          Aurem
        </span>
        <span className="text-[13px] font-medium text-brand">+212%</span>
      </div>
      <div className="flex h-[52px] items-end gap-1.5">
        {bars.map((h, i) => (
          <span
            key={h}
            style={{ height: h }}
            className={`flex-1 origin-bottom rounded-t-[3px] transition-transform duration-500 group-hover:scale-y-105 ${
              i === 4 ? "bg-brand" : "bg-ink/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function GrowthVisual() {
  return (
    <svg
      viewBox="0 0 240 96"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <line
        x1="16"
        y1="48"
        x2="224"
        y2="48"
        stroke="#d8d2c8"
        strokeWidth="1.25"
      />
      <line
        x1="16"
        y1="48"
        x2="224"
        y2="48"
        stroke="#bf3a36"
        strokeWidth="1.25"
        pathLength={100}
        className="method-pulse"
      />
      {[16, 58, 100, 142, 184, 224].map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy="48"
          r={i === 5 ? 4.5 : 3}
          fill={i === 5 ? "#bf3a36" : "#8f8981"}
          fillOpacity={i === 5 ? 1 : 0.55}
        />
      ))}
    </svg>
  );
}

/* ---- Card primitives ------------------------------------------------ */

function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 px-1 pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
      <Spark className="size-3 text-brand" aria-hidden />
      {children}
    </p>
  );
}

function FeatureCard({
  title,
  desc,
  href,
  visual,
  onNavigate,
}: {
  title: string;
  desc: string;
  href: string;
  visual: ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-paper transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_24px_44px_-26px_rgba(17,15,10,0.5)]"
    >
      <div className="h-[112px] w-full overflow-hidden border-b border-line bg-canvas">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
          {visual}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <div>
          <p className="text-[14px] font-medium tracking-[-0.01em] text-ink transition-colors group-hover:text-brand">
            {title}
          </p>
          <p className="mt-0.5 text-[11.5px] leading-snug text-muted">
            {desc}
          </p>
        </div>
        <ArrowUpRight className="size-4 shrink-0 -translate-x-1 text-brand opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
      </div>
    </Link>
  );
}

function CompactCard({
  title,
  desc,
  href,
  glyph,
  onNavigate,
}: {
  title: string;
  desc: string;
  href: string;
  glyph: ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group flex items-start gap-3 rounded-xl border border-line bg-canvas p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-paper hover:shadow-[0_18px_36px_-24px_rgba(17,15,10,0.45)]"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-muted transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-paper">
        {glyph}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 text-[13px] font-medium text-ink transition-colors group-hover:text-brand">
          {title}
          <ArrowUpRight className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
        <span className="mt-0.5 block text-[11px] leading-snug text-muted">
          {desc}
        </span>
      </span>
    </Link>
  );
}

function RailRow({
  title,
  desc,
  href,
  glyph,
  onNavigate,
}: {
  title: string;
  desc: string;
  href: string;
  glyph: ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group -mx-1 flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-paper"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-paper">
        {glyph}
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-medium text-ink transition-colors group-hover:text-brand">
          {title}
        </span>
        <span className="block truncate text-[11px] text-muted">{desc}</span>
      </span>
    </Link>
  );
}

/* ---- Panels --------------------------------------------------------- */

function CompanyPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_272px]">
      <div className="p-4 sm:p-5">
        <Kicker>The company</Kicker>
        <div className="grid grid-cols-2 gap-3">
          <FeatureCard
            title="About"
            desc="Our story, team, and standard."
            href="/about"
            visual={<AboutVisual />}
            onNavigate={onNavigate}
          />
          <FeatureCard
            title="Case Studies"
            desc="Transformations, with the numbers."
            href="/work"
            visual={<CaseVisual />}
            onNavigate={onNavigate}
          />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <CompactCard
            title="Methodology"
            desc="The four-phase operating model."
            href="/#method"
            glyph={<MethodologyGlyph />}
            onNavigate={onNavigate}
          />
          <CompactCard
            title="Studio"
            desc="Our creative team and craft."
            href="/studio"
            glyph={<StudioGlyph />}
            onNavigate={onNavigate}
          />
          <CompactCard
            title="Careers"
            desc="Build with us — open roles."
            href="/careers"
            glyph={<CareersGlyph />}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      <div className="border-t border-line bg-canvas p-4 sm:p-5 lg:border-l lg:border-t-0">
        <Kicker>More from Plurel</Kicker>
        <div className="space-y-1">
          <RailRow
            title="Blog"
            desc="Notes on staying visible."
            href="/blog"
            glyph={<BlogGlyph />}
            onNavigate={onNavigate}
          />
          <RailRow
            title="Contact"
            desc="Start a conversation."
            href="/contact"
            glyph={<ContactGlyph />}
            onNavigate={onNavigate}
          />
        </div>
        <div className="mt-3 border-t border-line pt-4">
          <Link
            href="/contact"
            onClick={onNavigate}
            className="group flex items-center justify-between gap-2 rounded-xl bg-brand px-4 py-3 text-paper transition-colors hover:bg-[#a8302c]"
          >
            <span>
              <span className="block text-[13px] font-medium">
                Book a Growth Audit
              </span>
              <span className="block text-[11px] text-paper/70">
                A read on where you stand.
              </span>
            </span>
            <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ServicesPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_272px]">
      <div className="p-4 sm:p-5">
        <Kicker>What we do</Kicker>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {SERVICES.map((service, i) => (
            <Link
              key={service.name}
              href="/services"
              onClick={onNavigate}
              className="group flex flex-col gap-3 rounded-xl border border-line bg-canvas p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-paper hover:shadow-[0_18px_36px_-24px_rgba(17,15,10,0.45)]"
            >
              <span className="flex items-start justify-between">
                <span className="flex size-9 items-center justify-center rounded-full border border-line bg-paper text-muted transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-paper">
                  <ServiceGlyph kind={service.kind} />
                </span>
                <span className="pt-0.5 text-[10px] font-semibold tabular-nums tracking-[0.14em] text-muted/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="text-[12.5px] font-medium leading-tight tracking-[-0.01em] text-ink transition-colors group-hover:text-brand">
                {service.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-line bg-canvas p-4 sm:p-5 lg:border-l lg:border-t-0">
        <Kicker>Built as a system</Kicker>
        <Link
          href="/#growth-system"
          onClick={onNavigate}
          className="group block overflow-hidden rounded-xl border border-line bg-paper transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_18px_36px_-24px_rgba(17,15,10,0.45)]"
        >
          <div className="h-[76px] w-full overflow-hidden border-b border-line bg-canvas">
            <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
              <GrowthVisual />
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="text-[13px] font-medium text-ink transition-colors group-hover:text-brand">
              The Growth System
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted">
              How every service compounds into one engine.
            </p>
          </div>
        </Link>
        <div className="mt-3 border-t border-line pt-3.5">
          <Link
            href="/services"
            onClick={onNavigate}
            className="group inline-flex items-center gap-1.5 px-1 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-brand"
          >
            All services
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---- Trigger + header ---------------------------------------------- */

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

export function SiteHeader() {
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 pt-4">
      <div className="relative z-40 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Floating paper bar — one consistent object, no scroll morph */}
        <div className="relative rounded-2xl border border-line bg-paper/90 px-4 shadow-[0_18px_40px_-26px_rgba(17,15,10,0.4)] backdrop-blur-md sm:px-5">
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Brand */}
            <div className="flex min-w-0 items-center gap-3 lg:flex-1">
              <Link
                href="/"
                className="shrink-0 text-xl font-extrabold tracking-tight text-ink"
              >
                PLUREL
              </Link>
              <span className="hidden items-center gap-2 whitespace-nowrap border-l border-line pl-3 sm:flex">
                <Spark className="size-3 shrink-0 text-brand" />
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

          {/* Mobile menu — expands the bar into a card */}
          {mobileOpen && (
            <nav className="flex flex-col border-t border-line pb-5 pt-2 lg:hidden">
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
                { name: "Studio", href: "/studio" },
                { name: "Careers", href: "/careers" },
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
          )}
        </div>

        {/* Mega panel */}
        {menu && (
          <div
            className="absolute inset-x-0 top-full z-40 hidden pt-2 lg:block"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="mega-in origin-top overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_36px_72px_-32px_rgba(17,15,10,0.45)]">
              {menu === "services" ? (
                <ServicesPanel onNavigate={() => setMenu(null)} />
              ) : (
                <CompanyPanel onNavigate={() => setMenu(null)} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Scrim — covers the whole viewport so the page dims evenly behind
          the floating bar and the panel alike */}
      {menu && (
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          onMouseEnter={() => setMenu(null)}
          onClick={() => setMenu(null)}
          className="scrim-in fixed inset-0 z-30 hidden cursor-default bg-ink/15 backdrop-blur-[2px] lg:block"
        />
      )}
    </header>
  );
}
