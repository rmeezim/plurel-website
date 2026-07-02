<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Plurel — project standards

Plurel is Northeon's creative division. The site turns outdated business
presence into premium digital brand experiences. Services: Website Design,
AEO/SEO, Brand Identity, Content Marketing, Paid Ads, PR & Reputation,
Creative Direction, and consulting.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first config in `src/app/globals.css` via `@theme`)
- Fonts via `next/font/google`: Inter (`--font-sans`), Fraunces (`--font-serif`)

## Brand tokens (defined in `globals.css` `@theme`)

| Token            | Hex       | Usage                                                    |
| ---------------- | --------- | -------------------------------------------------------- |
| `canvas`         | `#ece8df` | Main website background                                  |
| `paper`          | `#fbfaf6` | Clean sections, cards, contrast on dark                  |
| `ink`            | `#110f0a` | Main typography, dark cards, premium black               |
| `charcoal`       | `#20201e` | Dark cards, footer, showcase panels                      |
| `brand`          | `#bf3a36` | CTAs, icons, highlights, selected states, campaign cards |
| `rust`           | `#a65a45` | Photo overlays, hover states, secondary badges           |
| `line`           | `#d8d2c8` | Dividers, subtle backgrounds, card borders               |
| `muted`          | `#8f8981` | Secondary text, metadata, labels, captions               |
| `clay`           | `#c7b49d` | Image backgrounds, mockups, soft premium surfaces        |

Use the generated utilities (`bg-canvas`, `text-ink`, `border-line`,
`text-brand`, etc.) rather than hardcoded hex values.

## Positioning (long-term)

Plurel is evolving into Northeon's global AI/tech division for martech,
marketing, and growth transformations. Where natural, copy should frame
engagements as "growth transformations" and treat AI-era visibility (AEO),
martech, and growth systems as core to the method — confident and premium,
never buzzwordy.

## Conventions

- Reusable UI lives in `src/components/`. Keep server components by default;
  add `"use client"` only when interactivity is required (e.g. the header menu).
- Keep animations light and tasteful (`.fade-up` in `globals.css`, gated behind
  `prefers-reduced-motion`). No heavy 3D yet.
- Design for mobile first; the layout must hold up from 360px to wide desktop.
