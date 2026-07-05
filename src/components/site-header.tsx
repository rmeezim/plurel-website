"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Close, Menu, Spark } from "@/components/icons";

type MenuKey = "services" | "company";

/* High-tech blueprint texture for the dark visual previews */
const gridBg: React.CSSProperties = {
  backgroundColor: "#17150f",
  backgroundImage:
    "linear-gradient(rgba(251,250,246,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(251,250,246,0.045) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

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
    strokeWidth: 1.5,
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

/* ---- Animated visual previews (swap for real imagery later) --------- */

function ScanLine() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-10 -skew-x-12 bg-gradient-to-r from-transparent via-brand/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    >
      <span className="mega-scan block h-full w-full bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
    </span>
  );
}

function AboutVisual() {
  const sats = [
    [40, 30],
    [158, 26],
    [172, 92],
    [30, 100],
    [104, 18],
  ];
  return (
    <div className="relative h-full w-full overflow-hidden" style={gridBg}>
      <svg
        viewBox="0 0 200 130"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <g stroke="#fbfaf6" strokeOpacity="0.22" strokeWidth="1">
          {sats.map(([x, y], i) => (
            <line key={i} x1="100" y1="62" x2={x} y2={y} />
          ))}
        </g>
        {sats.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="3"
            fill="#fbfaf6"
            fillOpacity="0.55"
            className="diagram-blink"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
        <circle cx="100" cy="62" r="7" fill="#bf3a36" />
        <circle cx="100" cy="62" r="2.5" fill="#fbfaf6" />
      </svg>
      <ScanLine />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
    </div>
  );
}

function CaseVisual() {
  const bars = ["30%", "46%", "62%", "80%", "100%"];
  return (
    <div
      className="relative flex h-full w-full flex-col justify-end overflow-hidden p-4"
      style={gridBg}
    >
      <div className="absolute inset-x-4 top-3 flex items-center justify-between">
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-paper/40">
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
              i === 4 ? "bg-brand" : "bg-paper/20"
            }`}
          />
        ))}
      </div>
      <ScanLine />
    </div>
  );
}

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
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="M12 8.2v7.6M8.2 12h7.6" strokeWidth="1.2" />
      <path d="M9.6 9.6l4.8 4.8M14.4 9.6l-4.8 4.8" strokeWidth="1" strokeOpacity="0.55" />
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

function GrowthVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden" style={gridBg}>
      <svg
        viewBox="0 0 240 96"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <line
          x1="16"
          y1="48"
          x2="224"
          y2="48"
          stroke="#fbfaf6"
          strokeOpacity="0.15"
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
          />
        ))}
      </svg>
      <ScanLine />
    </div>
  );
}

/* ---- Cards ---------------------------------------------------------- */

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
      className="group flex flex-col overflow-hidden rounded-xl border border-paper/10 bg-white/[0.02] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:bg-white/[0.05] hover:shadow-[0_18px_44px_-18px_rgba(191,58,54,0.4)]"
    >
      <div className="h-[112px] w-full">{visual}</div>
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <div>
          <p className="text-[14px] font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-brand">
            {title}
          </p>
          <p className="mt-0.5 text-[11.5px] leading-snug text-paper/45">
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
      className="group flex items-start gap-3 rounded-xl border border-paper/10 bg-white/[0.02] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:bg-white/[0.05] hover:shadow-[0_16px_40px_-18px_rgba(191,58,54,0.4)]"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-paper/70 transition-colors group-hover:bg-brand/15 group-hover:text-brand">
        {glyph}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 text-[13px] font-medium text-paper transition-colors group-hover:text-brand">
          {title}
          <ArrowUpRight className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
        <span className="mt-0.5 block text-[11px] leading-snug text-paper/45">
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
      className="group flex items-center gap-3 rounded-lg border border-transparent p-2.5 transition-colors hover:border-paper/10 hover:bg-white/[0.03]"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-paper/70 transition-colors group-hover:bg-brand/15 group-hover:text-brand">
        {glyph}
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-medium text-paper transition-colors group-hover:text-brand">
          {title}
        </span>
        <span className="block truncate text-[11px] text-paper/45">{desc}</span>
      </span>
    </Link>
  );
}

function BlogGlyph() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
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
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 5.5h12a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-6l-3.5 3v-3H4a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 4 5.5Z" />
    </svg>
  );
}

/* ---- Panels --------------------------------------------------------- */

function CompanyPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_264px]">
      <div className="p-4 sm:p-5">
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

      <div className="border-t border-paper/10 bg-black/20 p-4 sm:p-5 lg:border-l lg:border-t-0">
        <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/40">
          More
        </p>
        <div className="mt-2 space-y-1">
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
        <Link
          href="/contact"
          onClick={onNavigate}
          className="group mt-3 flex items-center justify-between gap-2 rounded-xl bg-brand px-4 py-3 text-paper transition-colors hover:bg-[#a8302c]"
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
  );
}

function ServicesPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_264px]">
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {SERVICES.map((service) => (
            <Link
              key={service.name}
              href="/services"
              onClick={onNavigate}
              className="group flex flex-col gap-3 rounded-xl border border-paper/10 bg-white/[0.02] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:bg-white/[0.05] hover:shadow-[0_16px_40px_-18px_rgba(191,58,54,0.4)]"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-white/[0.05] text-paper/70 transition-colors group-hover:bg-brand/15 group-hover:text-brand">
                <ServiceGlyph kind={service.kind} />
              </span>
              <span className="text-[12.5px] font-medium leading-tight text-paper transition-colors group-hover:text-brand">
                {service.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-paper/10 bg-black/20 p-4 sm:p-5 lg:border-l lg:border-t-0">
        <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/40">
          Built as a system
        </p>
        <Link
          href="/#growth-system"
          onClick={onNavigate}
          className="group mt-2 block overflow-hidden rounded-xl border border-paper/10 bg-white/[0.02] transition-all duration-300 hover:border-brand/50 hover:bg-white/[0.05] hover:shadow-[0_16px_40px_-18px_rgba(191,58,54,0.4)]"
        >
          <div className="h-[76px] w-full">
            <GrowthVisual />
          </div>
          <div className="px-4 py-3">
            <p className="text-[13px] font-medium text-paper transition-colors group-hover:text-brand">
              The Growth System
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-paper/45">
              How every service compounds into one engine.
            </p>
          </div>
        </Link>
        <Link
          href="/services"
          onClick={onNavigate}
          className="group mt-3 flex items-center gap-1.5 px-1 text-[12px] font-medium text-paper/70 transition-colors hover:text-brand"
        >
          All services
          <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
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

        {/* Mega panel — dark, visual */}
        {menu && (
          <div
            className="absolute inset-x-0 top-full z-40 hidden pt-2 lg:block"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="mega-in origin-top overflow-hidden rounded-2xl border border-paper/10 bg-ink text-paper shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
              {menu === "services" ? (
                <ServicesPanel onNavigate={() => setMenu(null)} />
              ) : (
                <CompanyPanel onNavigate={() => setMenu(null)} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Scrim */}
      {menu && (
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          onMouseEnter={() => setMenu(null)}
          onClick={() => setMenu(null)}
          style={{ top: headerH }}
          className="scrim-in fixed inset-x-0 bottom-0 z-30 hidden cursor-default bg-ink/40 backdrop-blur-[2px] lg:block"
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
        </div>
      )}
    </header>
  );
}
