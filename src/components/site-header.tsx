"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Close, Menu, Spark } from "@/components/icons";

const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
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

        {/* Primary nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink/75 transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 lg:flex-1">
          <Link
            href="/contact"
            className="hidden items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-[#a8302c] sm:inline-flex"
          >
            Book Strategy Call
            <ArrowUpRight className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-10 items-center justify-center rounded-lg border border-line text-ink transition-colors hover:bg-line/50 lg:hidden"
          >
            {open ? <Close className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-line bg-canvas lg:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col px-5 py-3 sm:px-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-line/70 py-3 text-lg text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-medium text-paper"
            >
              Book Strategy Call
              <ArrowUpRight className="size-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
