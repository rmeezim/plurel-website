# Plurel — design system: Cinematic Red x Swiss Systems

Plurel is Northeon's brand, demand and distribution company. The site
reads like a proprietary consulting or technology firm, not an agency:
the Northeon family layout (square-marker kickers, sharp blocks for
actions, diagonal arrows) with three things of its own:

- **Cinematic Red, set in graphite.** Red is the environment, not an
  accent: whole chapters are flat red, and the hero's film is graded red
  behind fluted glass. Graphite is the dark tone (hero, work, the AI
  layer), and the footer is paper.
- **Swiss Systems.** Structure is strict but never drawn. A 12-column grid
  sets every edge, chapters are numbered, figures are captioned, metadata
  is set in mono, and the logo's own 3x3 grid is the source of all of it.
- **Frontier type.** One wide grotesk (Mona Sans) for everything, with a
  mono for the instrumentation. No serif, no italics on the homepage.

**Flat, not lit.** Every surface is one flat color. No gradients, no
glows, no vignettes, no grain, no drawn column lines. The color, the type
and the alignment do the work.

This document is the contract for every page. The homepage
(`src/app/page.tsx`, `src/components/home/`) is the reference build.
Interior pages still use the previous system (see the legacy docs) until
they are rebuilt on this one.

---

## Logo

`src/components/logo.tsx`, traced from the master artwork.

- `<Logo />` is the lockup; `variant="upper"` ("Plurel", default) or
  `"lower"` ("plurel"). `<LogoMark />` is the grid on its own.
- `MARK_CELLS` (`src/lib/mark.ts`) exports the geometry; the services fold
  animates exactly these cells and hands off to `LogoMark` at rest.
- The mark is exact geometry on a 10-unit square: 2-unit corners and
  edges, a 4-unit center, 1-unit gutters. It paints in `currentColor`.
- `animated` staggers the nine cells in (flagship moments only).
- Header: 22 to 24px tall. Footer: brand red on paper.

## Color

| Token | Hex | Role |
| --- | --- | --- |
| `brand` | `#bf3a36` | Plurel red: red chapters, primary actions, markers on paper |
| `ember` | `#8e2824` | Deep red: hover on red, the floor of red gradients |
| `graphite` | `#141517` | The dark tone: hero, work chapter, the AI layer band |
| `fog` | `#b9bcc2` | Secondary text and the toned accent on graphite |
| `oxblood` | `#2a0d0b` | Legacy dark tone; interior pages only until they move over |
| `blush` | `#f2c9bf` | Rose: secondary text and the dimmed headline line on red and dark |
| `signal` | `#e8564e` | Bright red: markers, rules, and indexes on dark |
| `paper` | `#fbfaf6` | Light chapters; text on red and dark |
| `ink` | `#110f0a` | Type on paper |
| `charcoal` | `#20201e` | Dark panels |
| `line` | `#d8d2c8` | Hairlines on paper (most hairlines use `ink/10` to `ink/15`) |
| `muted` | `#736d66` | Secondary text and metadata on paper (4.9:1, AA) |

Legacy tokens `canvas`, `clay`, `rust` remain for interior pages until
they move over. Don't use them in new work.

### Surfaces

Three tones, and every chapter is exactly one of them:

| Tone | Class | Text | Use |
| --- | --- | --- | --- |
| paper | `bg-paper` | ink | Reading chapters: manifesto, services, results, journal, FAQ, closing, footer |
| red | `bg-brand` | paper | The manifesto's findings band, the services fold, method |
| dark | `bg-graphite` | paper, fog | Hero, work, the method's AI layer |

All three are flat fills. Alternate tones so no two red or dark chapters
touch, and keep at least one red room on every page. The one exception is
the services fold, where the manifesto's red room continues into (02) and
folds into the mark: one room, not two red chapters.

## Type

Fonts load in `src/app/layout.tsx` through `next/font/google`.

| Role | Face | Recipe |
| --- | --- | --- |
| Display (h1, h2, h3, big numbers) | Mona Sans, 110% width, 430 | `type-display` plus a size; `leading-[0.98]` to `leading-none` |
| Accent | Mona Sans 300 | `<Accent>`: same face, lighter, toned by color (`text-fog`, `text-muted`, `text-brand`, `text-blush`) |
| Body | Mona Sans 400 | 15 to 20px, `leading-[1.5]` to `[1.55]`, 34 to 68ch |
| Kicker | Mona Sans 500 caps | `<Kicker>`: square marker, 11px, tracked |
| Meta | JetBrains Mono caps | `<Meta>`: indexes, figure captions, counts, clocks |

- `type-display` (in `globals.css`) sets the face, `font-stretch: 110%`,
  weight 430, `-0.018em` tracking and balanced wrapping. Headlines are
  never bold.
- One `<Accent>` per headline, on the phrase that carries the claim
  ("*one system*", "*Everywhere.*", "*visible*"). It is never italic.
- `figures` sets lining, proportional numerals for stats.
- Parentheticals and figure captions are Meta: `(01)`, `Fig. 02 · …`.
- Instrument Serif (`--font-serif`) remains loaded only for interior
  pages that haven't moved over.

## Grid

`src/components/system.tsx`

- `CONTAINER`: `max-w-[1440px]`, 20 / 32 / 48px side padding.
- `GRID`: 4 columns (base), 6 (sm), 12 (lg), with 20 / 24 / 32px gutters.
- The grid is never drawn as lines. It shows through alignment, the
  single hairline under each chapter's running head, and the mono
  indexes. The one exception is the column ticks: `ChapterHead` puts a
  6px mark on its hairline at every column edge (4 / 6 / 12 by
  breakpoint), like registration marks on a print.
- Lay every chapter's content on `GRID` spans so edges line up from one
  chapter to the next. Common spans at lg: headline 7 or 8, aside 3 or 4
  starting at column 9 or 10, four-up items 3 each.

## Chapter anatomy

```
<ChapterHead index="02" label="Services" meta="Eight disciplines · One system" />
(02)   ■ SERVICES                                 EIGHT DISCIPLINES · ONE SYSTEM
───────────────────────────────────────────────────────────────────────────────
Headline with one accent (lg:col-span-7/8)        Aside + TextLink (lg:col-span-3/4)

Content on GRID
```

- Padding: `py-24 lg:py-36`; closing chapters `py-28 lg:py-40`.
- Chapters on a page are numbered in order. The hero and the closing
  invitation are not numbered.
- Full-bleed index rows put the hairline on the `li`
  and the content in `CONTAINER` inside the link, so the rule runs edge
  to edge and the hover flood fills the full width.

## Actions

- `<CtaLink>`: the one primary action per view. Sharp block, sentence
  case, diagonal arrow. `solid` (red) on paper and dark, `paper` on red.
- `<TextLink>`: secondary. Sentence case on an underline, straight arrow.
- Header CTA is outlined: "Get in touch". The hero's primary action is
  "Request a diagnostic"; the closing chapter still offers the Growth
  Audit as the primary door and the strategy call as the secondary one.

## Motion

Everything sits inside `prefers-reduced-motion: no-preference` in
`globals.css`, so reduced-motion visitors get the finished page.

- **Hero load (flagship only):** headline lines rise out of their masks
  (`line-rise`, 140ms apart), then copy, actions, and the glass fade up
  (`fade-up`).
- **Scroll:** `Reveal`, staggering siblings 0.08s. The services fold is
  the one scroll-scrubbed chapter. The two glass bands (below) follow
  scroll too, but only as a height profile; nothing else is driven by
  scroll position.
- **Hover:** a pointer pours light into the glass (below); contents rows
  take a red top rule; arrows nudge diagonally.
- **Ambient:** the film behind the glass (no control, by the owner's
  call: it loops while on screen and stops in hidden tabs) and the
  selected-clients marquee (paused on hover). Nothing else moves on its
  own; both sit still for reduced motion.

## Fluted glass

`src/components/glass-band.tsx` (client), with the shader and the height
math in `src/lib/glass.ts`. Nine vertical flutes, one per cell of the
mark, each a cylinder lens over the hero film: the scene just behind it,
flipped, magnified at the centre and squeezed toward the edges, bowed
vertically, with a crisp lit edge, a faint warm/cool fringe and a lit
bottom edge. It reads as glass because the film has lines and points of
light for the flutes to bend. The film is drawn into a 192px canvas
before it reaches the shader, so it arrives soft. Until the Higgsfield
film exists, a stand-in studio (red key light, cool fill, a window,
bokeh, people crossing) is drawn in the shader.

- **Profiles.** `rise` (the hero): a low rest line that steps into a
  staircase as the visitor scrolls away. `arc` (the bottom edge of the
  closing chapter): a short fringe that drops into a symmetric arc,
  deepest at the center flute, as the footer comes up.
- **Hover: poured light** (after Athena). A mouse or pen (never touch)
  leaves a splat every ~34px of travel, tinted by its direction: right
  signal red, up warm paper, left cool fog, down blush. Splats drift on
  with the pointer's momentum, spread and fade over 1.8s, and are sampled
  through the same lens as the film, so each flute bends them into its
  own liquid shape. Up to 16 at once (`MAX_SPLATS`).
- **Rules.** No caption, no pause control. It draws only while on screen,
  at most 1.5x DPR, and the film stops in hidden tabs. Reduced motion or
  data saver get a still frame (the poster when there is one) and a
  short-lived glow. Without WebGL it falls back to flat brand and ember
  bars.

## The home hero

Graphite, statement left, one line of copy and the primary action right,
then the glass, then the exhibit:

- **Kicker:** "Distribution, engineered · A Northeon company".
- **Statement:** "Made to be / seen. *Everywhere.*", the accent in fog.
  Copy: "High-caliber clients now find firms through distribution, not
  chance. Plurel builds your narrative, makes the content and runs it
  across the channels your buyers trust." Action: "Request a diagnostic".
- **Glass:** the `rise` band, set well below the actions, uncaptioned.
- **Exhibit:** "Fig. 01", one story distributed to seven surfaces grouped
  as owned, earned and paid. A scaled drawing at lg, a grouped list below.

## The services fold

The homepage's one scroll-scrubbed moment (`services-fold.tsx`, markup in
`home/services-chapter.tsx`, timeline in `lib/fold.ts`). As the visitor
leaves the red manifesto, the red continues into (02) Services:

1. **Room.** One flat red screen reading "*Your brand.*"
2. **Plan.** Paper gutters cut it into nine panels at the mark's 2:4:2
   proportions, landing exactly on GRID columns (lg 1-3 | 4-9 | 10-12,
   base 1 | 2-3 | 4). The eight disciplines label themselves clockwise
   around "Your brand", the same order as the rows below.
3. **Mark.** The panels fold into the exact Plurel mark beside the
   headline; the (02) running head fades in and its column ticks register
   on the edges the panels just used. At rest the mark is a pointer index:
   hovering a cell floods it ink and names the discipline; a click opens it.

Rules:
- It moves only with the visitor's own scroll and stops when they stop.
  Native scroll only: no wheel or touch handlers, no snap, no smoothing.
- The gate (`FOLD_QUERY` in `lib/fold.ts`, mirrored in `globals.css`):
  motion only with no reduced-motion preference, no forced colors, with JS,
  at least 22.5rem wide, and at least 35rem tall on phones (40rem from the
  sm breakpoint up), which is where the resolved frame measurably fits. Everything else, and a failed fit
  check, gets the finished static figure: the mark with indexes 01-08
  around "Your brand", captioned "Fig. 02". A failed fit is retried on
  resize; if the pin switches off mid-fold, the visitor lands on the
  static chapter.
- While the fold is live, anchor jumps and focus scrolls are instant
  (`scroll-behavior: auto`): a smooth scroll would play the fold on its
  own, faster than any hand.
- The pinned track is sized in CSS from `html[data-js]` (set by the inline
  script in `layout.tsx` before first paint), so there is no layout shift
  and deep links land correctly. `#services` points at the resolved frame.
- Sticky breaks silently if `main`, `#main`, `body` or the section ever
  gets `overflow: hidden/clip` or a transform. Never wrap anything inside
  the stage in `Reveal`.
- The hot path reads only `scrollY` and writes cached transform/opacity
  strings; all layout reads happen in `measure()`.

## Imagery

- The hero film is generated in Higgsfield; see `docs/hero-video.md`.
- Case studies (`work-chapter.tsx`) are typeset, not photographed: one
  engagement as a graphite exhibit (the client's words, From / Built /
  To, the result as the loudest number), then a ledger of every
  engagement on the same columns. Real stills join the exhibit when they
  exist.
- Photography direction for stills matches the film: people at work,
  crimson light against graphite shadow, warm skin tones, shallow depth of field,
  grain, nothing staged at the camera.

## Header and footer

- Header (`site-header.tsx`): fixed and slim (56px, 64px at lg). At the
  top of the page it spans the width: transparent with paper type over a
  cinematic hero, a paper bar elsewhere. After 24px of scroll it squeezes
  into a floating pill (48px tall, 12px corners, at most 1080px wide) of
  frosted glass with a lit top edge, whose tint follows what sits behind
  it: dark glass with paper type over graphite or red, light glass with
  ink over paper (sampled under the bar each frame). The clock beside
  the CTA shows the visitor's own time zone, labelled with its city.
  Routes with a cinematic hero are listed in `OVERLAY_ROUTES`
  (`src/lib/nav.ts`); other routes get a spacer so content starts below
  the bar. Desktop menus open a Swiss panel (a card under the pill);
  mobile opens a full-screen red index.
- Footer (`site-footer.tsx`): paper, brand-red lockup, Swiss link
  columns, the Northeon line (Plurel beside its sister, Kelwin), live
  studio clock (New York). The closing chapter's `arc` glass sits right above it.

## Positioning in the homepage

Plurel sells integration, not a menu of services. Every chapter carries
one step of that argument:

| Chapter | Job |
| --- | --- |
| Hero | The promise: one story, on every surface |
| (01) Manifesto | The problem: "Your marketing shouldn't be ten companies." Each supplier reports its own number |
| (02) Services | The answer: every relevant channel, run as one system (Narrative → Create → Distribute → Measure) |
| (03) Method | Diagnose where the system breaks, then design, deploy, compound |
| (04)-(06) Work, results, journal | Proof, measured as one system |
| (07) FAQ | The real objections: every channel? how is this not full-service? |
| Closing | The diagnostic as the door in |

Write "every relevant channel", never "every channel". Frame engagements as
growth transformations; keep AI search, martech and measurement inside the
method rather than as slogans.
