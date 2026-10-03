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
- Fonts via `next/font/google`: Inter (`--font-sans`, everything),
  Instrument Serif italic (`--font-serif`, one accent phrase per headline),
  Geist Mono (`--font-mono`, Swiss metadata)

## Design language: Cinematic Red x Swiss Systems

Read `docs/design-system.md` before building any page. In short: red is
the environment (red-graded hero film, flat red chapters, oxblood footer),
surfaces are flat color with no gradients or drawn grid lines, structure
is Swiss (a strict 12-column grid that is felt, not drawn, numbered
chapters, mono metadata), and the layout follows the Northeon family
shared with the sister divisions. Primitives live in `src/components/system.tsx`; the
homepage (`src/components/home/`) is the reference build. The hero film
brief and Higgsfield prompts are in `docs/hero-video.md`.

## Brand tokens (defined in `globals.css` `@theme`)

| Token      | Hex       | Usage                                                        |
| ---------- | --------- | ------------------------------------------------------------ |
| `brand`    | `#bf3a36` | Plurel red: red chapters, primary actions, markers on paper  |
| `ember`    | `#8e2824` | Deep red: hover on red, gradient floors                      |
| `oxblood`  | `#2a0d0b` | Cinematic shadow: hero base, dark chapters, footer           |
| `blush`    | `#f2c9bf` | Rose: secondary text and dimmed lines on red and dark        |
| `signal`   | `#e8564e` | Bright red: markers, rules, indexes on dark                  |
| `paper`    | `#fbfaf6` | Light chapters; text on red and dark                         |
| `ink`      | `#110f0a` | Type on paper                                                |
| `charcoal` | `#20201e` | Dark panels                                                  |
| `line`     | `#d8d2c8` | Hairlines on paper                                           |
| `muted`    | `#736d66` | Secondary text, metadata, captions                           |

Legacy tokens (`canvas`, `clay`, `rust`) remain only for interior pages
that haven't moved to the new system. Use the generated utilities
(`bg-brand`, `bg-oxblood`, `text-ink`, `border-line`, etc.) rather than
hardcoded hex values.

## Positioning (long-term)

Plurel is evolving into Northeon's global AI/tech division for martech,
marketing, and growth transformations. Where natural, copy should frame
engagements as "growth transformations" and treat AI-era visibility (AEO),
martech, and growth systems as core to the method — confident and premium,
never buzzwordy.

## Conventions

- Reusable UI lives in `src/components/`. Keep server components by default;
  add `"use client"` only when interactivity is required (e.g. the header menu).
- Keep animations light and tasteful, all gated behind
  `prefers-reduced-motion` in `globals.css`. The hero load sequence is the
  one orchestrated load moment and the services fold (`services-fold.tsx`)
  is the one scroll-scrubbed moment; elsewhere use `Reveal`. No heavy 3D yet.
- The hero film autoplays muted, pauses off screen, and always has a
  pause control. Never ship auto-moving media without one.
- Design for mobile first; the layout must hold up from 360px to wide desktop.
