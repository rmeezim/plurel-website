<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Plurel — project standards

Plurel is a distribution engineering firm: marketing and distribution,
rebuilt as one system. Services: Website Design, Brand Identity, AI Search &
SEO, Content Marketing, Paid Ads, PR & Reputation, Creative Direction, and
Martech & Consulting. On the site Plurel stands alone: never mention
Northeon, Kelwin, a sister division or a parent group (the owner will bring
the divisions together later and say so).

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first config in `src/app/globals.css` via `@theme`)
- Fonts via `next/font/google`: Geist (`--font-sans`, everything:
  `type-display` sets headlines tight and near regular weight at 390, the
  largest type lighter through `--display-weight` (hero and closing 360,
  the accountability strips 340), `type-title` the display face a step
  down for sentences and smaller titles (400), `<Accent>` sets a phrase
  back by tone, never by a lighter weight), JetBrains Mono (`--font-mono`,
  Swiss metadata). The voice is a modern San Francisco technology
  company's: precise and quiet, never wide, bold or airy. Mona Sans loads
  only in the services chapter, for its supplier voices' widths.

## Design language: Cinematic Red x Swiss Systems

Read `docs/design-system.md` before building any page. In short: red is
the environment (flat red chapters, a red-graded film behind cool fluted glass),
graphite is the room every page lives in, footer included (paper is type
and the odd action, never a chapter: a light chapter read as a template),
surfaces are flat color
with no gradients or drawn grid lines (a chapter may carry one faint art
field: the contour map or the mark watermark, `art.tsx`), structure
is Swiss (a strict 12-column grid that is felt, not drawn; no eyebrow
labels over headlines, no chapter numbers or rulers; mono only for
data), and the look is authoritative, with a defense-grade precision and a
little creativity. Primitives live in `src/components/system.tsx`; the
homepage (`src/components/home/`) is the reference build, and the interior
pages share its parts through `src/components/page.tsx` (PageHead,
ChapterHead, Room, Closing). The site map, what each page does and what
was removed is in `docs/sitemap.md`. The hero film brief (real footage,
not AI-generated) is in `docs/hero-video.md`.

## Brand tokens (defined in `globals.css` `@theme`)

| Token      | Hex       | Usage                                                        |
| ---------- | --------- | ------------------------------------------------------------ |
| `brand`    | `#bf3a36` | Plurel red: red chapters, primary actions, markers on paper  |
| `ember`    | `#8e2824` | Deep red: hover on red, gradient floors                      |
| `graphite` | `#141517` | The dark tone: hero, work, dark bands                        |
| `fog`      | `#b9bcc2` | Secondary text and accents on graphite                       |
| `blush`    | `#f2c9bf` | Rose: secondary text and dimmed lines on red and dark        |
| `signal`   | `#e8564e` | Bright red: markers, rules, indexes on dark                  |
| `paper`    | `#fbfaf6` | Text on red and dark; the paper action on red                |
| `ink`      | `#110f0a` | Type on paper                                                |
| `charcoal` | `#20201e` | Dark panels                                                  |
| `line`     | `#d8d2c8` | Hairlines on paper                                           |
| `muted`    | `#736d66` | Secondary text, metadata, captions                           |

The legacy tones (`oxblood`, `canvas`, `clay`, `rust`) are retired. Use
the generated utilities
(`bg-brand`, `bg-graphite`, `text-ink`, `border-line`, etc.) rather than
hardcoded hex values.

## Positioning

Plurel sells integration, not a menu of services: one narrative, one
creative engine, one set of numbers and one accountable team across every
relevant channel (never "every channel"). The category it names is
distribution engineering. The thesis: "Your marketing shouldn't be ten
companies." What a company comes for is named in its own
words on the homepage (What you came for): reach (going viral is luck;
reach is a system), reputation, mindshare and revenue, each delivered
by the same four layers of the Plurel System. Each supplier sells one of
them; Plurel builds the system that delivers all four. Plurel works for every kind of growing company: consumer
brands, physical products, B2B technology and consumer technology (name
the kinds of business at that high level), and the copy
reads for all of them (prefer customers, buyers and the people a company
sells to; never default to B2B-only words such as pipeline, leads, clients
or sales team, nor to B2C-only ones). The outcome is one number, agreed on
day one in the Diagnostic: the one the business runs on (orders, installs,
demos, stockists, sell-through). Never headline "qualified demand" (it reads
as agency vocabulary), and never "inquiries" or "pipeline" alone. No cited
statistics on the homepage. Engagements
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
- Every page builds its metadata with `pageMetadata` (`src/lib/metadata.ts`):
  its own title, description, canonical path (with the trailing slash) and
  social card. Next merges metadata shallowly, so a page that set only a
  title would inherit the homepage's canonical and card.
- Interior pages are built from `components/page.tsx`: `PageHead` (the h1
  plotted on load, standfirst and actions on columns 9 to 12, no eyebrow),
  then chapters as `Room`s opening on a `ChapterHead`, and most end on a
  red `Closing`. Every page keeps at least one red room, and no two red
  rooms touch. Content data lives in `src/lib/`, not in the page. Every
  "Request a diagnostic" uses `AUDIT_HREF` (the Diagnostic's request
  form). A new page joins `sitemap.ts` and `docs/sitemap.md`.
- Keep animations light and tasteful, all gated behind
  `prefers-reduced-motion` in `globals.css`. Motion comes from instruments,
  not slideshows: type is plotted (a steady left-to-right sweep,
  `type-reveal.tsx`), lines are drawn at a steady rate, and states light
  by opacity alone. Nothing rises, slides, blurs or bounces into place,
  and what arrives together in a chapter is drawn one after another by
  its pen (`lib/pen.ts`). A page's own head (the hero, or an interior
  page's `PageHead`) is plotted on load, the page's one orchestrated load
  moment; every other head once as it enters. Services'
  typographic system, ending on the Plurel System's layers
  (`home/services-type.tsx`), is the one pinned, scroll-scrubbed chapter.
  Scroll-linked without pinning: the statement's lit words, the
  accountability strips and the faint art's drift. The fluted glass
  (`glass-band.tsx`) is the one WebGL surface; blocks light through
  `Reveal`. No heavy 3D.
- Keep chrome sparse: no eyebrow labels over headlines (the headline
  names the chapter; a small label over it reads as a template), no
  sprinkle of tiny mono labels, no tracked uppercase micro-type for
  navigation or labels (sentence case, 13px and up), no placeholder boxes, and the Plurel mark is a signature, never a
  prop that splits, opens or assembles (a faint, static watermark of it is
  fine). No props or invented scenes standing in for an idea (sample
  buyers, mock screens, mock reports): speak from a point of view, show
  the system itself, and let fewer, larger words carry each chapter.
- The film behind the glass loops muted with no control (the owner's
  call); it stops off screen and in hidden tabs, and reduced motion or data
  saver get a still frame. Any other auto-moving media needs a pause
  control.
- Never invent proof: no client, person, quote, logo or result is shown as
  real unless it is; samples are labelled as samples in plain view. The
  sample Diagnostic shows in one screen in the homepage's Proof and in
  full on /diagnostic/sample; the sample engagements on /industries are
  each headed "Sample engagement, illustrative, not a client".
- Actions are compact and square, never a big slab or a rounded pill:
  `CtaLink` is a sentence-case label beside a square arrow cell, 40px
  tall (44px in the closing), one filled action per view with an
  outlined secondary beside it.
- Design for mobile first; the layout must hold up from 360px to wide desktop.
