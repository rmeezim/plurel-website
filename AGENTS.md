<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Plurel — project standards

Plurel is Northeon's distribution engineering company: marketing and
distribution, rebuilt as one system. Services: Website Design, Brand
Identity, AI Search & SEO, Content Marketing, Paid Ads, PR & Reputation,
Creative Direction, and Martech & Consulting. Its sister division Kelwin
(RevOps and go-to-market) turns that demand into revenue.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first config in `src/app/globals.css` via `@theme`)
- Fonts via `next/font/google`: Mona Sans (`--font-sans`, everything; the
  `type-display` utility sets the wide display cut, `<Accent>` the light
  weight), JetBrains Mono (`--font-mono`, Swiss metadata). Instrument Serif
  (`--font-serif`) is kept only for interior pages not yet moved over.

## Design language: Cinematic Red x Swiss Systems

Read `docs/design-system.md` before building any page. In short: red is
the environment (flat red chapters, a red-graded film behind fluted glass),
graphite is the dark tone, the footer is paper, surfaces are flat color
with no gradients or drawn grid lines, structure
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
| `graphite` | `#141517` | The dark tone: hero, work, dark bands                        |
| `fog`      | `#b9bcc2` | Secondary text and accents on graphite                       |
| `oxblood`  | `#2a0d0b` | Legacy dark tone, interior pages only                        |
| `blush`    | `#f2c9bf` | Rose: secondary text and dimmed lines on red and dark        |
| `signal`   | `#e8564e` | Bright red: markers, rules, indexes on dark                  |
| `paper`    | `#fbfaf6` | Light chapters; text on red and dark                         |
| `ink`      | `#110f0a` | Type on paper                                                |
| `charcoal` | `#20201e` | Dark panels                                                  |
| `line`     | `#d8d2c8` | Hairlines on paper                                           |
| `muted`    | `#736d66` | Secondary text, metadata, captions                           |

Legacy tokens (`canvas`, `clay`, `rust`) remain only for interior pages
that haven't moved to the new system. Use the generated utilities
(`bg-brand`, `bg-graphite`, `text-ink`, `border-line`, etc.) rather than
hardcoded hex values.

## Positioning

Plurel sells integration, not a menu of services: one narrative, one
creative engine, one set of numbers and one accountable team across every
relevant channel (never "every channel"). The category it names is
distribution engineering. The thesis: "Your marketing shouldn't be ten
companies." The best fit is growth-stage companies, B2B and B2C, whose
marketing has fragmented across suppliers; the outcome is qualified demand
(never "inquiries" or "pipeline" alone, so it reads for both). Engagements
start with the Diagnostic (the Plurel Distribution Diagnostic: six parts
scored and a prioritized read within a business day; the action is
"Request a diagnostic") and run as an integrated monthly partnership.
Approved for later: a recurring teardown series in the journal, and
pricing the system as integrated monthly tiers, never per-channel items. Frame them as growth transformations, and treat AI-era
visibility (AEO), martech and measurement as part of the method:
confident and premium, never buzzwordy. `docs/design-system.md` maps the
argument onto the homepage chapters.

## Conventions

- Reusable UI lives in `src/components/`. Keep server components by default;
  add `"use client"` only when interactivity is required (e.g. the header menu).
- Keep animations light and tasteful, all gated behind
  `prefers-reduced-motion` in `globals.css`. The hero load sequence is the
  one orchestrated load moment; the Attention Field (`home/attention-field.tsx`)
  and the services fold (`services-fold.tsx`) are the two pinned,
  scroll-scrubbed chapters, and the manifesto's braid strip is scrubbed
  without pinning. The fluted glass (`glass-band.tsx`)
  is the one WebGL surface; elsewhere use `Reveal`. No heavy 3D.
- The film behind the glass loops muted with no control (the owner's
  call); it stops off screen and in hidden tabs, and reduced motion or
  data saver get a still frame. The clients marquee pauses on hover and
  sits still for reduced motion. Any other auto-moving media needs a
  pause control.
- Design for mobile first; the layout must hold up from 360px to wide desktop.
