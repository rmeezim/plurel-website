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
- `MARK_CELLS` (`src/lib/mark.ts`) exports the geometry (the logo and the
  journal cover glyphs draw it). The mark is a signature, not a prop: no
  section splits it, opens it into cards or assembles it as a hub.
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
| paper | `bg-paper` | ink | Reading chapters: clients, manifesto, results, journal, FAQ, footer |
| red | `bg-brand` | paper | Method, closing |
| dark | `bg-graphite` | paper, fog | Hero, Attention Field, services, work, the method's AI layer |

All three are flat fills. Alternate tones so every chapter change is a
clear cut (the homepage runs paper manifesto, graphite services, red
method, graphite work), no two red chapters touch, and every page keeps at
least one red room.

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
  "Request a diagnostic"; the closing chapter offers the Diagnostic
  ("Request your diagnostic") and the strategy call as the secondary door.

## Motion

Everything sits inside `prefers-reduced-motion: no-preference` in
`globals.css`, so reduced-motion visitors get the finished page.

- **Hero load (flagship only):** headline lines rise out of their masks
  (`line-rise`, 140ms apart), then copy, actions, and the glass fade up
  (`fade-up`).
- **Scroll:** `Reveal`, staggering siblings 0.08s. Two chapters are
  pinned and scrubbed: the Attention Field (under the hero, long) and
  services' typographic system (brief). The manifesto's braid is scrubbed
  without pinning, and
  the two glass bands follow scroll as a height profile; nothing else is
  driven by scroll position.
- **Hover:** a pointer pours light into the glass (below) and pushes the
  Attention Field's dots aside (its markers can be dragged); contents rows
  take a red top rule; arrows nudge diagonally.
- **Ambient:** the film behind the glass, the Attention Field's drift and
  its channel tiles while they show (no controls, by the owner's call:
  they run only while on screen and stop in hidden tabs), and the
  selected-clients marquee (paused on
  hover). Nothing else moves on its own; all of them sit still for
  reduced motion.

## Fluted glass

`src/components/glass-band.tsx` (client), with the shader and the height
math in `src/lib/glass.ts`. Nine vertical flutes, one per cell of the
mark, each a solid glass rod over the hero film: it shows a wide, shifted
slice of the scene behind it (never flipped, never bowed), rounds off into
dark seams, and catches a crisp specular line just inside its left edge, a
fainter rim on its right, a warm fringe right at both and a lit bottom
lip. That rounded left and right edge is the 3D feel to protect; nothing
in it wobbles. The glass itself is cool: it takes a little red out of what
it passes (`CAST`), gives the dark of the room a slate, grey-blue cast
(`SLATE`, `SKY`), and its catch lines, sheen and rims are a cool white
(`FROST`) with a faint cyan fringe beside the warm one, so the band reads
as red film behind cool architectural glass rather than all red. It reads
as glass because the film has lines and points of light for the rods to
bend. The film is drawn into a 192px canvas before it reaches the shader,
so it arrives soft. Until the Higgsfield film exists, a stand-in studio
(red key light, ember wash, cool daylight from the upper left, a lit
doorway, a slatted window, a few large out-of-focus lights, a beam, people
crossing) is drawn in the shader.

- **Profiles.** `rise` (the hero): a rest line a little over half the
  band (0.56) that steps into a staircase as the visitor scrolls away.
  `arc` (the bottom edge of the closing chapter): a short fringe that
  drops into a symmetric arc, deepest at the center flute, as the footer
  comes up.
- **Hover: light behind the glass.** A mouse or pen (never touch) lays a
  soft ribbon of light along its path in the scene behind the rods,
  tinted by direction of travel, warm tones only: right signal red, up
  warm white, left blush, down light coral, all lifted to one brightness.
  Never blue or cool: the cool of the glass gives way only in the
  light's core, and the glow's blue is clamped below its red, so a sweep
  warms the rods without wiping the glass back to all red. The ribbon
  stays where it was laid (no drift, no
  ripple) and fades evenly over 1.5s; every rod bends its own slice of it.
  Up to 32 points at once (`MAX_SPLATS`), rationed so a fast sweep spaces
  them out rather than dropping visible ones.
- **Rules.** No caption, no pause control. It draws only while on screen,
  at most 1.5x DPR, and the film stops in hidden tabs. Reduced motion or
  data saver get a still frame (the poster when there is one) and no
  light trail. Without WebGL it falls back to flat brand and ember bars.

## The home hero

Graphite, statement left, one line of copy and the primary action right,
then the glass:

- **Kicker:** "Distribution, engineered · A Northeon company".
- **Statement:** "Made to be / seen. *Everywhere.*", the accent in fog.
  Copy: "Great work no longer sells itself. Distribution does. Plurel
  engineers yours as one system, so the right clients find you and growth
  compounds." Action: "Request a diagnostic".
- **Glass:** the `rise` band, set well below the actions, uncaptioned,
  resting a little over half its height on first load.

## The Attention Field

`home/attention-field.tsx` (markup, client) with the canvas engine in
`lib/attention-field.ts`, the stage layout in
`home/attention-field.module.css`, and the channel tiles in
`home/channel-tiles.tsx` (data in `lib/channels.ts`). The section right
after the hero (`#distribution`, graphite): how Plurel distributes, told
in thousands of points of attention on one canvas, pinned and scrubbed by
scroll. No chrome round it: no running head, no stage tabs, no indices.
The five stage headings carry it, and the one action, "See the method",
arrives only with the final readout (focusing it early jumps straight to
that stage, so keyboards still reach it).

1. **Noise.** "Attention is everywhere." Fog dots drifting in nine loose
   pools, one per surface, each with its marker and name. The mesh answers
   a fine pointer (a soft lens pushes the nearest dots aside and lifts
   them), and, unannounced, a marker can be picked up and dragged: its
   pool follows on a spring, shouldering neighbours aside, and stays where
   it is dropped until the story gathers it. Scrolling back restores the
   layout. Mouse and pen only for the lens; a drag only when it starts on
   a marker, so page scrolling is never taken.
2. **Story.** "One story, cut for every surface." The dots settle into one
   master frame, a dot screen reading Halden's line "Heat, without the
   noise.", and a red blade cuts it along the mosaic's gutters into seven
   live tiles, each a recording of a real surface carrying the same story:
   an AI answer streaming with citations, a search results page, a reel, a
   film, a press review, a creator's post, a 48-sheet out of home. Halden
   (quiet heat pumps, sold to homeowners and developers) is a sample
   brief, and a quiet line under the mosaic says so. Phones show four:
   the answer, a footage row (the reel beside the film, or the billboard
   on short phones) and the search, with text sized to read.
3. **Lanes.** "Be where it gathers." Each tile shrinks in place and slides
   to the head of its lane, top lane first, and its lane pours from it:
   Owned (Search, Social, Video), Earned (AI answers, Press, UGC), Paid
   (Creators, Paid media, Events).
4. **System.** "Run it as one system." The lanes bend into one funnel;
   the dots that pass through turn signal red.
5. **Demand.** "Qualified demand." The red stream rises to one bright
   point; the readout is an index (1.0x to 3.2x vs. baseline,
   illustrative), so it reads for B2B and B2C alike. Never "inquiries" or
   "pipeline" here.

Tiles are DOM, not canvas (crisp type), placed by the engine with
transforms; each plays only while it is on screen in the Story stage, and
holds a designed still frame otherwise. Each is also a slot for real
footage: drop `public/video/channels/<key>.mp4` (keys: answer, search,
reel, film, press, creator, ooh; optional `<key>.jpg` poster) and
`lib/clips.ts` picks it up at build time, muted and looped, with
`preload="none"`.

Rules: pinned only with JS, motion allowed and a viewport at least 360px
wide and 560px tall; otherwise a designed static version (the tiles as one
mosaic of still frames, then the five stages as a list beside one still
frame of the system, then the link). Nothing that contains the sticky
stage may clip (`overflow: hidden/clip` breaks it). The loop runs only
while the section is on screen and the tab visible; no pause control (the
owner's call, as with the glass). When the mode flips (a phone rotates, a
window gets short, reduced motion toggles), the engine keeps the reader's
place: inside the field they land at its start, below it they stay on the
same chapter.

## The manifesto braid

(01) is one paper chapter: the statement, then its figure. Fig. 01, "Who
owns the number" (`home/braid-strip.tsx`, engine in `lib/braid.ts`), is
the chapter's centrepiece, not an appendix: its caption sits in the
margin, its lead "Every supplier reports its own number. *Nobody owns the
outcome.*" (an h3) on the content column, and the canvas takes the full
width below. Scrubbed by scroll as it passes, never pinned: ten tangled
ink hairline strands, each a supplier with the number it reports (six on
phones, which the caption says), straighten into lanes, then funnel into
one strand that turns brand red where it joins and plaits to "One system.
One number." (HTML, brand red, beside the end). As it forms, the ten
metrics delete themselves and the names glide to the spine (ten numbers
become one). No logo hub: the colour change is the junction. It moves only
with the visitor's scroll and rests otherwise; reduced motion shows the
finished braid, and without JS a static drawing of the end state names
the suppliers in the margin. Generous paper closes the chapter before
(02) cuts to graphite.

## Services: one typographic system

(02) Services sits on graphite, a hard cut from the paper manifesto and
from the red Method after it. Markup in `home/services-chapter.tsx`, the
motion in `home/services-type.tsx` (client) with the engine in
`lib/services-type.ts` and the pin and clone rules in
`home/services-type.module.css`. Fig. 02 is the contents list itself, so
the chapter's artifact makes Plurel's argument (integration, not a menu)
in the one place that has to show a menu:

1. **Eight voices.** "Eight disciplines, eight voices." The eight names
   arrive set the way eight different suppliers would set them: condensed
   lowercase, tracked thin caps, a rotated italic, a huge red extended
   black, a vertical name, a light display cut, mono caps. Mismatched, but
   composed; the house face pushed to its extremes, no other fonts.
2. **Still a menu.** "Lined up, it's still a menu." They drop onto the
   rows of the list, still in their own voices.
3. **One system.** "Set as one, it's a system." Stage by stage along the
   chain (Narrative, Create, Distribute, Measure, each lit as its rows
   set), the names take one face, one scale and one rhythm, and the stage
   tags and lines arrive, until the figure is simply the list.

Rules:
- The real list is server-rendered and is what assistive tech, no-JS,
  reduced motion, forced colours and screens too short to pin (phones
  under 650px tall, 640px from lg; 360x640 keeps the list) get. Eight
  aria-hidden clones carry the motion; each row hands back to the real
  text, pixel for pixel, the moment its name is set.
- Pinned briefly (at most 110svh of travel on desktop, 96svh on phones)
  and moved only by the visitor's scroll; transforms and opacity only,
  measured after fonts load and on resize, which keeps the reader's place.
  Colours morph in OKLab, so no red passes through pink.
- The four chain stages are toggles at every width (`aria-pressed`): one
  holds its rows and steps the others back (all text stays above 4.5:1), a
  second press or Escape clears. `#services` lands on the chapter.
- The pure parts are unit tested:
  `npx -y tsx --test src/lib/services-type.test.ts`.

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
  into a floating pill (48px tall, 2px corners, at most 1080px wide) of
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
| Hero | The promise: made to be seen, everywhere; distribution as how the right clients find you |
| Attention Field | The mechanism: attention everywhere, one story, nine lanes, one system, qualified demand |
| (01) Manifesto | The problem: "Your marketing shouldn't be ten companies." Each supplier reports its own number; the braid shows ten becoming one |
| (02) Services | The answer: every relevant channel, run as one system (Narrative → Create → Distribute → Measure); eight voices set as one |
| (03) Method | Diagnose where the system breaks, then design, deploy, compound |
| (04)-(06) Work, results, journal | Proof, measured as one system |
| (07) FAQ | The real objections: every channel? how is this not full-service? |
| Closing | The Diagnostic as the door in ("Request your diagnostic") |

Write "every relevant channel", never "every channel". Frame engagements as
growth transformations; keep AI search, martech and measurement inside the
method rather than as slogans.
