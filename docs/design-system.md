# Plurel — design system: Cinematic Red x Swiss Systems

Plurel is a distribution engineering firm. The site reads like a
proprietary systems partner (the way Legora reads to law firms), never an
agency: authoritative, with a defense-grade precision and a little
creativity. Its layout (headlines that name their chapters with no label
over them, sharp blocks for actions, diagonal arrows) carries three
things of its own. On the site Plurel stands
alone: no Northeon, Kelwin or group.

- **Cinematic Red, set in graphite.** Red is the environment, not an
  accent: whole chapters are flat red, and the hero's film is graded red
  behind fluted glass. Graphite is the room the homepage lives in,
  footer included, and the red chapters punctuate it. Paper is kept for
  interior pages until they move over: on the homepage a light chapter
  read as a template.
- **Swiss Systems.** Structure is strict but never drawn. A 12-column grid
  sets every edge and the logo's own 3x3 grid is the source of it. The
  structure is felt, not labelled: no chapter numbers, running heads,
  rulers or figure captions; mono is kept for data (dates, units, scores,
  tags, the four Method phases).
- **Frontier type.** One precise grotesk (Geist) for everything, with a
  mono for the instrumentation. No serif and no italics in the site's own
  voice; only services' first beat borrows other voices (Mona Sans's
  widths), on purpose.

**Flat, not lit.** Every surface is one flat color. No gradients, no
glows, no vignettes, no grain, no drawn column lines. The color, the type
and the alignment do the work. The one exception is the faint art (see
below): at most one field per chapter, felt more than seen.

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
- `animated` staggers the nine cells in; nothing uses it (the mark never
  assembles).
- Header: 22 to 24px tall. Footer: brand red on graphite.

## Color

| Token | Hex | Role |
| --- | --- | --- |
| `brand` | `#bf3a36` | Plurel red: red chapters, primary actions, red fills; markers on paper |
| `ember` | `#8e2824` | Deep red: hover on red, the floor of red gradients |
| `graphite` | `#141517` | The dark tone: hero, work chapter, the AI layer band |
| `fog` | `#b9bcc2` | Secondary text and the toned accent on graphite |
| `oxblood` | `#2a0d0b` | Legacy dark tone; interior pages only until they move over |
| `blush` | `#f2c9bf` | Rose: secondary text and the dimmed headline line on red and dark |
| `signal` | `#e8564e` | Bright red: markers, rules, indexes and small red type on dark (5.1:1 on graphite) |
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
| dark | `bg-graphite` | paper, fog | The homepage's room: hero and What Plurel is, Why now, Why Plurel (services and the Plurel System), Accountability, proof, questions, footer; the sample Diagnostic page |
| red | `bg-brand` | paper | What you came for, Method, Who it's for, closing |
| paper | `bg-paper` | ink | Interior pages until they move over; never a homepage chapter |

All three are flat fills. The homepage is dark, punctuated by red:
graphite hero and statement, red What you came for, graphite Why now and
Why Plurel, red Method, graphite Accountability, red Who it's for,
graphite proof and questions, red closing, graphite footer. The Journal
is not a homepage chapter; it stays one click away in the nav and the
footer. Graphite chapters that meet part by their
headline and their room alone, never a rule or a tint; no two red chapters
touch, and every page keeps at least one red room. On graphite, small red
type and markers are `signal` (5.1:1), secondary text `fog`, hairlines
paper at 15 to 25%; brand red stays for fills and actions. A panel on
graphite (the sample Diagnostic's sheet) is a step up, `bg-paper/[0.04]`,
still one flat color.

## Type

Fonts load in `src/app/layout.tsx` through `next/font/google`.

| Role | Face | Recipe |
| --- | --- | --- |
| Display (headlines, names, big numbers) | Geist 390; 360 for the hero and closing, 340 for the strips | `type-display` plus a size; `leading-[0.98]` to `leading-none` |
| Title (sentences and smaller titles in the display face) | Geist 400 | `type-title` plus a size: sub-lines, questions, station and service names, figures |
| Accent | Geist, the headline's weight | `<Accent>`: the same face and weight, set back by tone (`text-fog`, `text-muted`, `text-brand`, `text-blush`) |
| Body | Geist 400 | 15 to 20px, `leading-[1.5]` to `[1.6]`, 34 to 68ch |
| Meta | JetBrains Mono caps | `<Meta>`: indexes, figure captions, counts, clocks |

- The voice is a modern San Francisco technology company's: precise,
  compact and tight, quiet rather than loud, never wide or airy. Geist
  (Vercel's open face, on Google Fonts) gives that neutrality, set near
  its regular weight. Light type on a dark room reads heavier than it
  measures, so the weights sit lower than they would on paper. The first
  cut, Mona Sans stretched to 110%, read friendly: round, open letters.
- `type-display` (in `globals.css`) sets Geist at 390 and `-0.038em`
  tracking with balanced wrapping, so a headline sets as one clean shape.
  The largest type steps lighter through `--display-weight`: the hero and
  the closing 360 (tightened to `-0.044em` through `--display-tracking`),
  the accountability strips 340. Never bold.
- `type-title` is the same face a step down in size and a touch firmer
  (400, `-0.018em`), as smaller type needs to be, for sentences and
  smaller titles set in it, so a page of display lines keeps a hierarchy
  instead of reading as a wall of weight. The services
  chapter's house face (`HOUSE` in `lib/services-type.ts`) is this one,
  since the names land on the band links. Its eight voices are Mona Sans,
  loaded in that chapter only for its width axis; each changes into Geist
  late in its set (`HOUSE_FLIP`), within 4% of normal width, where the
  change hides in the motion.
- `<Accent>` ends a headline only in the hero ("Everywhere.") and the
  closing, set back by tone alone, never by a lighter weight: a thin
  phrase reads editorial. Every other headline is one tone. Never italic.
- The statement (What Plurel is) is reading type at display size: 380,
  `-0.034em`.
- `figures` sets lining, proportional numerals for stats.
- Meta (mono, 11px caps) is for data only: dates, read times, units,
  scores, tags, the Method phase numbers. About fifteen on the whole
  homepage, outside the drawn documents. Never a label that only
  announces what comes next.
- Navigation, labels and small actions are sentence case at 13px and up
  (header nav 15px, header CTA 14px, clock 13px, footer column heads
  14px). Tracked uppercase micro-type reads as a template; it stays out
  of the site's own chrome.
- Figures that people read (the accountability strips, the Diagnostic's
  scores) use the face's lining, proportional figures: its
  tabular set has a footed 1 and a slashed zero, which read as code.
- Instrument Serif (`--font-serif`) remains loaded only for interior
  pages that haven't moved over.

## Grid

`src/components/system.tsx`

- `CONTAINER`: `max-w-[1440px]`, 20 / 32 / 48px side padding.
- `GRID`: 4 columns (base), 6 (sm), 12 (lg), with 20 / 24 / 32px gutters.
- The grid is never drawn: no column lines, no tick rulers. It shows
  through alignment alone.
- Lay every chapter's content on `GRID` spans so edges line up from one
  chapter to the next. Common spans at lg: headline 7 or 8, aside 3 or 4
  starting at column 9 or 10, four-up items 3 each.

## Chapter anatomy

```
Headline, one weight (lg:col-span-7/8)            Aside + TextLink (lg:col-span-3/4)

Content on GRID
```

- No eyebrow labels: the headline names the chapter. A small label over
  a headline ("Why now", "Method") read as a template and as AI-made, so
  there are none, on the homepage or the pages that follow it. No
  numbers, no running head, no ruler. A chapter whose headline is a
  figure (What you came for, What Plurel is) keeps a visually hidden h2
  for the outline. A sample keeps its label in plain view, as text on the
  sheet, never as an eyebrow.
- Padding: `py-24 lg:py-36`; closing chapters `py-28 lg:py-40`.
- Full-bleed index rows put the hairline on the `li`
  and the content in `CONTAINER` inside the link, so the rule runs edge
  to edge and the hover flood fills the full width.

## Actions

- `<CtaLink>`: a compact, square control, never a big slab: the label in
  sentence case (14px medium, 15px at `size="lg"`) beside a square cell
  for the arrow, 40px tall (44px at `lg`, kept for the closing). A filled
  action is two tones, like a key and its port: `solid` is brand with an
  ember cell (ember on hover), `paper` is paper with a blush cell (the
  filled action on red). The secondary beside it draws the same split as
  a hairline: `outline-light` on graphite and red, `outline` on paper.
  The arrow is diagonal for the Diagnostic and other steps out, straight
  (`arrow="right"`) for a page on the site. One filled action per view;
  pairs sit 8px apart and wrap on phones.
- `<TextLink>`: a quieter door inside a chapter's aside. Sentence case on
  an underline, straight arrow.
- Header CTA is outlined: "Get in touch". The hero pairs "Request a
  diagnostic" with "See a sample" (the full sample Diagnostic); Proof
  pairs it with "See the full sample"; the closing offers "Request a
  diagnostic" and "See a sample" at `lg`, then the email.

## Motion

Everything sits inside `prefers-reduced-motion: no-preference` in
`globals.css`, so reduced-motion visitors get the finished page, and
without JS every chapter renders finished.

The vocabulary is taken from instruments, not slideshows: **type is
plotted, lines are drawn, states light.** Nothing rises, slides, blurs,
scales or bounces into place; that stagger-and-fade-up is what made the
page read as a template.

- **Type is plotted** (`TypeReveal`, `components/type-reveal.tsx`, which
  documents the paces). A head is drawn left to right in reading order by
  a hard-edged sweep at one steady pace: each word is uncovered at a
  constant rate, the pen crosses each space in one character's time, a
  new line waits a short return and the hero's "Everywhere." a short
  lift. A long line takes longer than a short one; the speed never
  changes. Paces, in ms a character: the hero and the closing's name 30,
  What you came for's four words 24, chapter heads and names set large
  18, smaller heads 11. Transforms only (each word a window sliding over its own
  text, which slides back by as much), so the compositor draws it even
  while the page is busy hydrating. A head below the fold is plotted once
  as it comes up the screen; one already on screen stays still. Each
  carries its words once as visually hidden plain text, so it reads as
  one sentence. Under forced colors heads set as plain, finished type
  (the backplate behind each line would otherwise cover the descenders of
  the line above).
- **One pen per chapter** (`lib/pen.ts`). What arrives together is drawn
  one after another in reading order, never all at once: a head, then
  the copy beside it. A head holds its chapter's pen while
  it plots, a drawn figure while it draws (Why now's route), and a block
  that only lights waits without holding it. The pen waits only for
  strokes still on screen, and never longer than 2.4s, so a quick scroll
  never stacks up delays; chapters never wait on each other.
- **Lines are drawn** at a steady rate (linear): the rule under What
  you came for's chosen word, Why now's route and its closing rule, the
  Method staircase (one bar after another, from lg), the sample
  Diagnostic's bars (all at once, like an instrument reading out).
- **States light:** `Reveal` blocks, nodes and markers switch on by
  opacity alone and never travel; Why now's stations light the moment the
  route reaches them, and the hero's copy, action and glass light in turn
  after its head (timed in `hero.tsx`). Interior headlines (`Cascade`)
  are plotted at the hero's pace.
- **Scroll:** one chapter is pinned and scrubbed: services' typographic
  system, which ends on the Plurel System. Scroll-linked without pinning:
  the statement's words light as the reader reaches them, the
  accountability strips slide in opposite directions, and the faint art
  drifts a few dozen pixels against the page (a CSS scroll-driven
  animation). The two glass bands follow scroll as a height profile.
- **Hover:** a pointer pours light into the glass (below); a system layer
  lifts in tone and its services brighten; contents rows take a red top
  rule; arrows nudge diagonally.
- **Ambient:** only the film behind the glass (no control, by the owner's
  call: it runs only while on screen and stops in hidden tabs). The
  selected-clients marquee (`clients-strip.tsx`, paused on hover) returns
  only once real client names exist. Nothing else moves on its own.

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
so it arrives soft. Until real footage exists, a stand-in studio
(red key light, ember wash, cool daylight from the upper left, a lit
doorway, a slatted window, a few large out-of-focus lights, a beam, people
crossing) is drawn in the shader.

- **Profiles.** `rise` (the hero): a rest line a little over half the
  band (0.56) that steps into a staircase as the visitor scrolls away.
  `arc` (the bottom edge of the closing chapter): a short fringe that
  drops into a symmetric arc, deepest at the center flute, as the footer
  comes up. Both profiles are the same glass: the arc gets the hero's cool
  body, frost edges and scene detail (it samples the room a little lower,
  so its short rods still show the door and the window).
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

- **No label** over the headline: it opens the page on its own.
- **Statement:** "Made to be / seen. *Everywhere.*", the accent in fog.
  Copy: "Great work no longer sells itself. Distribution does. Plurel
  engineers yours, from reach to revenue, as one system, so growth
  compounds." Actions: "Request a diagnostic", and "See a sample" beside
  it, outlined.
- **Glass:** the `rise` band, set well below the actions, uncaptioned,
  resting a little over half its height on first load.

## What Plurel is

`home/statement.tsx`. The hero's second beat, in its graphite room, with
no label: one statement set large, "Plurel is a distribution engineering
firm. We build and run the system that makes a growing company
impossible to miss for the people it sells to, and we answer for the
growth it brings." Its words light as the reader reaches them
(scroll-linked, only while on screen; lit from the start under reduced
motion or without JS; unlit words stay above AA for large text). Under
it, four facts on a hairline, set like a fact sheet: built for, how it
runs, answers for, starts with. The mark watermark sits behind the
statement, cropped at the right. A visually hidden h2 keeps the outline.

## What you came for

`home/came-for.tsx` (server) with `home/want-selector.tsx` (client) and
`came-for.module.css`, on red, third on the page. The four things a
company comes for, Reach, Reputation, Mindshare and Revenue, are the
chapter's headline and its controls at once: a tab list in display type
(340, one line from lg), the chosen word in paper on a drawn paper rule,
the others in blush. "Pick the one you came for. Each runs through the
same four layers, so the other three come with it." Under them a panel a
step deeper, in ember, reads out the choice: the want in the visitor's
words ("Be seen, and sometimes go viral."), Plurel's line on it in
blush ("A viral moment is luck. Reach is a system that gives luck more
chances."), and the four layers of the Plurel System on a spine, each
with what it does for that want. It is the System's first sighting; the
services chapter goes on to build it. It closes on "Each supplier sells
you one of these. We build the system that delivers all four." with
"Start with the Diagnostic".

Rules:
- ARIA tabs (arrows, Home, End; the panel takes focus). The panels share
  one grid cell, so the box keeps the tallest one's height and nothing
  below moves when the choice changes. Without JS all four panels show,
  one after another.
- Motion: the four words are plotted once as the chapter arrives (the
  shared window-over-text sweep, 24ms a character), then the chosen
  word's rule is drawn; a new choice draws its rule at once and lights
  its panel's lines one after another, by opacity alone.
- "Go viral" appears here once, with the line that keeps it honest, and
  once in the questions.

## Why now

`home/why-now.tsx`, on graphite. The claim, "Buyers decide before they
arrive.", with a two-sentence standfirst beside it. Then the argument is
drawn, not told: a route of six small stations on one hairline (AI
answers, search, creators, reviews, stores, word of mouth; each a name in
`type-title` and one short line), under a bracket, "Where the choice gets
made". The line ends at a red node: "You, your site or store", noted in
red as "Where most marketing starts". From lg the route runs across a
seven-column grid; below it, a rail down the left whose stretches run
node to node. The line is drawn at one steady rate and each station
lights the moment it arrives, like a signal travelling the route. It
closes under a signal-red rule, drawn first, in the title face: "We
engineer the ones your buyers use, as one system." Contours behind, with
the page's one survey
readout. No statistics, no sources, no sample people, and only one
display-size line in the chapter: the six used to be set large, which
made it read as a wall.

## Why Plurel: from a menu to the Plurel System

The services chapter carries the thesis, on graphite, between Why now
and the red Method. Markup in `home/services-chapter.tsx`, the
motion in `home/services-type.tsx` (client) with the engine in
`lib/services-type.ts` and the pin and clone rules in
`home/services-type.module.css`. Its head: the h2 "Your marketing
shouldn't be ten companies. / It should be one system." (TypeReveal),
with the side line beside its first line. Then the figure, the contents
list itself, so the chapter's artifact makes the argument (integration,
not a menu) in the one place that has to show a menu:

1. **Eight voices.** "Eight disciplines, eight voices." The eight names
   arrive set the way eight different suppliers would set them: condensed
   lowercase, tracked thin caps, a rotated italic, a huge red extended
   black, a vertical name, a light display cut, mono caps. Mismatched, but
   composed; the house face pushed to its extremes, no other fonts.
2. **Still a menu.** "Lined up, it's still a menu." They drop onto the
   rows of the list, still in their own voices.
3. **One system.** "Set as one, it's a system." Stage by stage along the
   chain (Narrative, Create, Distribute, Measure), the names take one face,
   one scale and one rhythm; then the set menu settles onto the floor,
   each layer's names leave it, the rows close ranks toward the floor,
   and the layer's band comes down from the foot of the one above,
   Narrative first. On desktop the names fly into their band's service
   links; below lg they fold away. The narrator hands over to the title,
   "The Plurel System".

What stays is the Plurel System, read top to bottom like everything
else on the page: four full-width flat bands, Narrative first, each a
graphite tone a step deeper than the one above it (no red band: a red
floor broke the room's pattern and made the stack read upward). Each band
carries its name (h4, display face), the instrument it builds and its one
line (Narrative: The Core Brief; Create: The Asset System; Distribute:
The Surface Plan; Measure: The Ledger), what it feeds (the layer below;
the Ledger feeds back into Narrative and Distribute every quarter) and
its services as links. A hairline loop runs through the bands: a
signal-red spine down through a node on each layer, an arrowhead where
it crosses into the next, and a dashed return from the Ledger back up,
labelled "Read monthly. Reset quarterly." from 1280px. Pointing at or focusing a band lifts it a tone
(never a shadow) and brightens its services.

Rules:
- The System (the eight service links grouped in four layers) is
  server-rendered and is what assistive tech, no-JS, reduced motion,
  forced colors and screens too short to pin get. Eight aria-hidden
  clones carry the motion.
- It pins on desktop from 1280x720 and at 768x1024 and 390x844 or larger;
  1024x768, 375x667 and 360x640 get the static System. Below lg the
  pinned bands show name and services only, and what each layer builds
  follows the pin in plain text.
- Pinned for about 145svh of travel on desktop and 127svh on phones,
  moved only by the visitor's scroll; transforms and opacity only,
  measured after fonts load and on resize, which keeps the reader's place.
  Colors morph in OKLab, so no red passes through pink. `#services` lands
  on the chapter.
- The pure parts are unit tested:
  `npx -y tsx --test src/lib/services-type.test.ts`.

## Accountability

`home/accountability.tsx`, on graphite. "Ten suppliers report ten numbers.
We answer for one." Then two strips of very large type that slide across
the full width in opposite directions as the reader scrolls (no pin; each
lines up on the grid as it crosses the middle of the screen): "What
suppliers report", ten supplier metrics, dimmed (reach,
impressions, followers, click-through, views, sessions, mentions,
articles, organic traffic, PageSpeed: generic examples, not claims), and
"What we answer for", the numbers businesses run on (orders, installs,
demos, stockists, bookings, sign-ups, renewals) in full paper with
signal-red square separators. The strips are the largest type on the page
and the lightest (340). Under reduced motion or without JS both stand still
and wrap. Then the commitment (the one number is agreed in the
Diagnostic, before any work starts) and a three-line spec: agreed, read,
reset.

## Who it's for

`home/who-its-for.tsx`, on red. "Different buyers. One system." The four
layers stay the same; what changes is where buyers decide and the number
Plurel answers for. One table, read across, a few words a cell: the
business (display face), where its buyers decide, and the number:
consumer brands (feeds, creators and reviews; orders), physical products
(shelves, marketplaces and reviews; sell-through), B2B technology (AI
answers, search and peers; demos with buyers who fit), consumer
technology (stores, creators and AI answers; users who stay). The kinds
of business stay high-level: consumer technology covers apps, AI products
and devices alike. From lg the two column heads sit once over the table;
below it each row carries small labels. The table lights as one object,
then the pen writes the four names down it.
Labels in paper (blush fails AA at small sizes on red). Contours behind,
another seed.

## Method

`home/method-chapter.tsx`, on red. The four phases as a time chart, in
few words: each phase is a name, a tagline and what it delivers (a ruled
list from sm; on a phone one run-on line split by small squares, each
item kept whole); the full method, in prose, lives on /methodology. Under the chart, "Where AI
helps, and where a person decides" is one line per phase in one shape:
what the machine does, then what a person decides.

## Questions

`home/faq-chapter.tsx`, on graphite. "Straight answers.", then the questions
as a quiet list, one line each, whose answers open on demand (native
`<details>`: no JS needed, keyboard and assistive tech included, and
search engines read every answer, as they do the FAQPage data). The first
sentence of an answer is the takeaway, in full paper. "Can you make us go
viral?" comes second and answers honestly: no one can promise one, and
the system turns a spike into the number you run on. The Diagnostic is
answered by the closing chapter and the sample, not by a question.

## Faint art

`components/art.tsx` (`ArtField`), the one exception to flat surfaces: at
most one field per chapter, felt more than seen, aria-hidden, behind the
type. Two motifs:

- **Contours:** a surveyed terrain (summits, gullies, saddles; sixteen
  contours at interval 4, every fifth heavier), generated once by
  `scripts/art/contours.mjs` into `public/art/contours-<seed>.svg` (six
  seeds, 28 to 60KB each) and painted through a CSS mask in the tone's
  token color: ink about 7% on paper, paper about 9% on graphite, ember
  on red (darker lines only raise the contrast of paper type). `focus`
  places the summit; `annotate` adds one quiet readout ("Field 03 ·
  Contour interval 4", the generator's real interval) with registration
  crosshairs, on Why now only, hidden on phones.
- **The mark:** the logo's exact cells, outlined and filled with fine
  vertical lines that echo the hero's nine flutes, huge and cropped at the
  chapter's edge, as if engraved. Never filled, split, opened or
  assembled.

Both drift slowly against the page (`drift`, default on) and sit still
under reduced motion and without JS. Never inside the pinned services
chapter.

## Imagery and proof

- Footage is shot, not generated: the hero film takes real footage of
  real work when it exists (see `docs/hero-video.md`); until then the
  drawn stand-in stays. No AI-generated video or stills of people, work or
  products.
- Proof is never invented. No client, person, quote, logo or result is
  shown as real unless it is. Samples are labelled as samples in plain
  view (the sample Diagnostic for Halden, in Proof and on
  /sample-diagnostic; the sample engagements on /work). The accountability strip's supplier metrics are
  generic examples of what suppliers report, not claims.
- No props or invented scenes stand in for an idea (no sample buyers,
  mock screens or mock reports), and no cited statistics on the homepage.
- The Proof chapter (`home/proof-chapter.tsx`, data in `lib/proof.ts`) shows
  what Plurel delivers first, in one screen: an excerpt of a Diagnostic,
  run on Halden, a sample company (the company and its total, six parts
  scored with drawn bars, and the read in three short lines: where you
  win, where you leak, what to fix first). The full sample, findings, the
  first quarter's plan and what we would measure included, is a page of
  its own, `/sample-diagnostic` (`components/diagnostic-sheet.tsx`, set
  in the graphite room, the header floating over it as over the hero).
  Real cases join Proof when they can be published: each opens with what
  the Diagnostic found and reports the one number with its client, cause
  and period.
- People (`home/people-chapter.tsx`, `lib/people.ts`) renders only once
  real people are listed: faces, first names, one line each.
- Photography direction for stills matches the film: people at work,
  crimson light against graphite shadow, warm skin tones, shallow depth of
  field, nothing staged at the camera.

## Header and footer

- Header (`site-header.tsx`): fixed and slim (56px, 64px at lg). At the
  top of the page it spans the width: transparent with paper type over a
  dark opening (the homepage's hero, the sample Diagnostic;
  `OVERLAY_ROUTES` in `lib/nav.ts`), a paper bar elsewhere. After 24px of scroll it squeezes
  into a floating pill (48px tall, 2px corners, at most 1080px wide) of
  frosted glass with a lit top edge, whose tint follows what sits behind
  it: dark glass with paper type over graphite or red, light glass with
  ink over paper (sampled under the bar while scrolling, at nine points
  edge to edge, so the glass turns light whenever any of it overlaps
  paper and its type never thins out over a chapter boundary). The clock beside
  the CTA shows the visitor's own time zone, labelled with its city.
  Nav, menus and the CTA are sentence case (15px nav, 14px CTA, 13px
  clock), never tracked capitals.
  Routes with a cinematic hero are listed in `OVERLAY_ROUTES`
  (`src/lib/nav.ts`); other routes get a spacer so content starts below
  the bar. Desktop menus open a Swiss panel (a card under the pill): on
  hover for a mouse (the click that follows keeps it open), on the first
  tap for touch, and on Enter, which moves focus into the panel. Mobile
  opens a full-screen red index, which closes itself if the window widens
  past lg.
- Footer (`site-footer.tsx`): graphite, brand-red lockup, Swiss link
  columns, one identity line ("Plurel is a distribution engineering firm:
  one team for every relevant channel, answerable for one number."), live
  studio clock (New York). The closing chapter's `arc` glass sits right above it.

## Positioning in the homepage

Plurel sells integration, not a menu of services. Every chapter carries
one step of that argument, and says it once:

| Chapter | Job |
| --- | --- |
| Hero | The promise: made to be seen, everywhere; great work no longer sells itself, distribution does |
| What Plurel is | Identity: a distribution engineering firm, the system it builds and runs, and the facts a buyer checks first |
| What you came for | The wants, in the visitor's words: reach (and, honestly, going viral), reputation, mindshare and revenue; pick one and the same four layers deliver it, so each supplier sells one of them and Plurel builds the system that delivers all four |
| Why now | The shift: buyers decide before they arrive, in places the company doesn't control |
| Why Plurel | The thesis, shown: ten suppliers' voices become one system, the Plurel System's four layers and its loop, each layer with its instrument and services |
| Method | How it runs: the Diagnostic, then the four phases as one monthly partnership |
| Accountability | What we answer for: ten suppliers report ten numbers, we answer for one, agreed on day one |
| Who it's for | Fit: consumer brands, physical products, B2B technology and consumer technology, the same system with a different number |
| Proof | What a Diagnostic finds, in one screen (a labelled sample until real cases can be published; the full sample on /sample-diagnostic) |
| People | Who does the work (shown once real people are listed) |
| FAQ | The real objections, biggest first: is this a full-service agency? can you make us go viral? every channel? what about our current agencies? cost |
| Closing | The Diagnostic as the door in ("Request a diagnostic", with "See a sample" beside it), what follows it, and an email as the other way in |

Write "every relevant channel", never "every channel". The outcome is
"one number, agreed on day one" (orders, installs, demos, stockists);
never headline "qualified demand", and never "inquiries" or "pipeline"
alone. Copy reads for consumer brands, physical products, B2B technology
and consumer technology alike. Use the concrete noun where you can: team,
brief, number, report. Keep AI search, martech and measurement inside the method rather
than as slogans, and keep the voice plain: no triplet lists, no "Not X.
Y.", no consultancy words.
