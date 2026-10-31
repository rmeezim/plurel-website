<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Plurel — project standards

Plurel is a distribution engineering firm: marketing and distribution,
rebuilt as one system. It sells four engagements (Reach, Reputation,
Mindshare, Revenue) built from ten disciplines, each also hired on its
own: Fractional CMO, Branding, Website Design, Content Marketing, Video &
Photo, UGC & Creators, AI Search & SEO, Paid Media, PR & Reputation, and
Analytics & Martech. On the site Plurel stands alone: never mention
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
not AI-generated) is in `docs/hero-video.md`, and the photographs the
interior pages are waiting for (real, never stock or generated) are
listed in `docs/photography.md`.

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
them; Plurel builds the system that delivers all four. They are also how
Plurel sells: four engagements (Reach, Reputation, Mindshare, Revenue;
`lib/engagements.ts`, pages at `/services/<engagement>`), each running on
all four layers and built from the ten disciplines, which are also hired
one by one (the Services menu shows both, as Engagements and
Disciplines). Plurel works for every kind of growing company: consumer
brands, physical products, B2B technology and consumer technology (name
the kinds of business at that high level), and the copy
reads for all of them (prefer customers, buyers and the people a company
sells to; never default to B2B-only words such as pipeline, leads, clients
or sales team, nor to B2C-only ones). The outcome is one number, agreed on
day one in the Diagnostic: the one the business runs on (orders, installs,
demos, stockists, sell-through). Never headline "qualified demand" (it reads
as agency vocabulary), and never "inquiries" or "pipeline" alone. No cited
statistics on the homepage. Interior pages may cite published numbers
(the red case band, `CaseBand` in `components/service.tsx`), each checked against its
source, quoted within that source's scope (country, sample, year), and
shown with its publisher, title, year and link in plain view. Engagements
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
- Interior pages are built from `components/page.tsx`: a head, then
  chapters as `Room`s opening on a `ChapterHead` (or `Part`s,
  `components/service.tsx`), and most end on a red `Closing`. Every page
  that sells or explains opens on `ServiceHead`: the h1 plotted on load,
  its line, standfirst and actions beside the page's own drawing, then
  four facts set large (the engagements and disciplines, /services,
  /method, /industries, /about, /diagnostic); the rest (contact, the
  journal, the legal pages) on `PageHead`, the h1 with its standfirst
  and actions on columns 9 to 12. No eyebrow on either. Every page keeps at least one red room, and no two red
  rooms touch. Content data lives in `src/lib/`, not in the page. Every
  "Request a diagnostic" uses `AUDIT_HREF` (the Diagnostic's request
  form). A new page joins `sitemap.ts` and `docs/sitemap.md`.
- Engagement and discipline pages carry every point as something the
  eye takes in first, with a sentence or two beside it, never paragraphs
  (`components/service.tsx`): `ServiceHead` (the h1, its line, the
  standfirst and actions beside the page's own signature drawing, then
  four facts set large); the red `CaseBand` (the case in one line and
  the published numbers set large); then graphite `Part`s, each an h2
  with one line beside it and one visual: numbered `Steps` (Reach's
  rules as a `Ladder`), the four layers as a `LayerFlow`, what ships as
  a `ShipCalendar` of a quarter's thirteen weeks, a discipline's
  `DeliverableGrid`, the measures as a `MeasureRail` into the one
  number, `SitsFlow` (what it runs on, what it is, what it feeds), the
  first ninety days; questions; the red `Closing`.
- Each of those pages opens on its own drawing (`signatures.tsx`): the
  page's idea drawn as lines, nodes and a few labels on a field that
  scales with its column (Reach's one idea fanned into cuts, Mindshare's
  brands changing rank, Branding's specimen, the Method's loop, About's
  ten suppliers against one team, the Diagnostic's sample read), so no
  two pages open alike. The homepage's shift is drawn the same way. It is a diagram of
  the idea, never a mock screen or a chart of results, with a caption in
  plain words; it draws once after the h1 (hidden until it starts, so it
  never flashes in finished), is simply drawn without JS or under
  reduced motion, keeps labels HTML at 13px and up, and moves labels
  that would crowd a phone into a numbered key.
- Every engagement and discipline page makes its case with one figure
  (`components/figures/`, its rules in `kit.tsx`): one point, stated as
  its title; direct labels where they fit, numbered marks with notes
  under the chart where words would crowd the lines, and a key where a
  phone has no room to name the lines at their ends; one signal-red
  series, everything else paper at lower opacity; Geist with tabular
  figures and no mono, labels 14px, ticks and notes 13px. It draws once
  as it enters, has at most one two-way toggle, and fits the reading
  column (a chart is about 250 to 340px tall). Each is a labelled
  illustration ("not a client's results" in plain view) except Website
  Design's, which measures the page itself in the reader's browser;
  never fake results shown as real, never a mock screen or a console.
- Interior pages may also carry a plate (`components/artifacts/`; the
  Method's rhythm and team, each industry's path): the system itself drawn as lines,
  nodes and a few labels (a mechanism, a path, a chart of a principle),
  never a mock screen or a fake dashboard. `Plate` draws it once as it enters,
  through the pen; a plate that loops keeps one quiet motion (pulses
  along its lines, a sweep, a ping) only while on screen, never under
  reduced motion, always with a Pause control. Labels are HTML at 13px
  and up; where they would crowd a phone, the plate gets a phone layout
  or a legend. Its readout says in words what it shows.
- Keep animations light and tasteful, all gated behind
  `prefers-reduced-motion` in `globals.css`. Motion comes from instruments,
  not slideshows: type is plotted (a steady left-to-right sweep,
  `type-reveal.tsx`), lines are drawn at a steady rate, and states light
  by opacity alone. Nothing rises, slides, blurs or bounces into place,
  and what arrives together in a chapter is drawn one after another by
  its pen (`lib/pen.ts`). A page's own head (the hero, or an interior
  page's `PageHead`) is plotted on load, the page's one orchestrated load
  moment; every other head once as it enters. One chapter is pinned and
  scroll-scrubbed: services' typographic system, ending on the Plurel
  System's layers (`home/services-type.tsx`). The shift before it
  (`home/shift.tsx`: buyers decide before they arrive) is a drawing that
  draws once as it enters and stays still: no pin, nothing to pause.
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
  control (the plates that loop have one); a drawing that draws once and
  stays still needs none.
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
