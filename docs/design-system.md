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
  behind fluted glass. Graphite is the room every page lives in, footer
  included, and the red chapters punctuate it. Paper is type and the odd
  action, never a chapter: a light chapter read as a template.
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
(`src/app/page.tsx`, `src/components/home/`) is the reference build, and
the interior pages are built from the same parts (`components/page.tsx`;
see "Interior pages" below, and `docs/sitemap.md` for what each page
does).

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
| `blush` | `#f2c9bf` | Rose: secondary text and the dimmed headline line on red and dark |
| `signal` | `#e8564e` | Bright red: markers, rules, indexes and small red type on dark (5.1:1 on graphite) |
| `paper` | `#fbfaf6` | Light chapters; text on red and dark |
| `ink` | `#110f0a` | Type on paper |
| `charcoal` | `#20201e` | Dark panels |
| `line` | `#d8d2c8` | Hairlines on paper (most hairlines use `ink/10` to `ink/15`) |
| `muted` | `#736d66` | Secondary text and metadata on paper (4.9:1, AA) |

The legacy tones (`oxblood`, `canvas`, `clay`, `rust`) are retired.

### Surfaces

Three tones, and every chapter is exactly one of them:

| Tone | Class | Text | Use |
| --- | --- | --- | --- |
| dark | `bg-graphite` | paper, fog | The room every page lives in: on the homepage the hero and What Plurel is, the engine, Why Plurel (services and the Plurel System), Accountability, proof, questions and the footer; every interior page's head and most of its chapters |
| red | `bg-brand` | paper | What you came for, Method, Who it's for, closing; at least one chapter on every interior page, usually its closing |
| paper | `bg-paper` | ink | Never a chapter: only actions on red (the paper CtaLink) |

All three are flat fills. The homepage is dark, punctuated by red:
graphite hero and statement, red What you came for, graphite engine and
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
  it plots, a drawn figure while it draws (a plate), and a block
  that only lights waits without holding it. The pen waits only for
  strokes still on screen, and never longer than 2.4s, so a quick scroll
  never stacks up delays; chapters never wait on each other.
- **Lines are drawn** at a steady rate (linear): the rule under What
  you came for's chosen word, the plates' lines, the
  Method staircase (one bar after another, from lg), the sample
  Diagnostic's bars (all at once, like an instrument reading out).
- **States light:** `Reveal` blocks, nodes and markers switch on by
  opacity alone and never travel; the hero's copy, action and glass light in turn
  as its head is drawn (timed in `hero.tsx`). An interior page's head
  (`PageHead`) is plotted on load at the hero's pace, and its standfirst
  and actions light once the pen lifts, timed from the head's length
  (`plotEnd`, `lib/plot.ts`).
- **Scroll:** two chapters are pinned. In the engine the scroll carries
  the words (each beat's line lights word by word) while the field moves
  to that beat on its own clock; services' typographic system is
  scrubbed by the scroll and ends on the Plurel System. The services head
  sits between them, so the reader is never handed from one pin straight
  into the next. Scroll-linked without pinning:
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
with what it does for that want, then a link to the want's package page
("The Reach package"). It is the System's first sighting; the services
chapter goes on to build it. It closes on "Each supplier sells you one of
these. We build the system that delivers all four." with "Start with the
Diagnostic".

Rules:
- ARIA tabs (arrows, Home, End; the panel takes focus). The panels share
  one grid cell, so the box keeps the tallest one's height and nothing
  below moves when the choice changes. Without JS all four panels show,
  one after another.
- Motion: the four words are plotted once as the chapter arrives (the
  shared window-over-text sweep, 24ms a character), then the chosen
  word's rule is drawn; a new choice draws its rule at once and lights
  its panel's lines one after another, by opacity alone.
- The tour: so a visitor sees each word can be chosen, the four take
  turns while the selector is in the middle of the screen. The chosen
  word's rule is the clock, drawn over 6.5s on a faint track; when it is
  full the next word is chosen. It holds while a pointer rests on the
  words or the panel, while focus is in the panel, off screen, and on
  Pause (a small outlined control beside the standfirst, Play to resume).
  The visitor's first choice ends it for good. No tour under reduced
  motion or without JS.
- "Go viral" appears here once, with the line that keeps it honest, and
  once in the questions.

## The engine: how the market moves

`home/engine.tsx` (client), with every buyer's place in every beat laid
out in `lib/engine.ts` and the pin in `home/engine.module.css`. It takes
Why now's place and keeps its claim as the chapter's h2: "Buyers decide
before they arrive." The field beside it is the market, drawn as about
560 buyers (small squares), in five beats. While the chapter is pinned
the scroll carries the words: it picks the beat, and lights the beat's
line word by word, its second line following once the first is lit. The
field is not scrubbed. It moves to the beat on its own clock, one move
after another at a steady pace (under two seconds a beat, twice as fast
when the reader has scrolled ahead), and while on screen it keeps a
quiet motion of its own: the market drifts, and squares travel the
lines into the Ledger. A Pause control holds it.

1. **The market, as it is.** Buyers clustered around the brand that
   comes to mind first (three named only as Brand A, B and C, and You,
   the smallest, in signal red).
2. **Spread across surfaces.** The same buyers sort into eight columns,
   one per surface where they decide (AI answers, search, creators,
   reviews, stores, word of mouth, social, press).
3. **One system reads all of it.** The Plurel System's four layers
   arrive under the columns, and every surface streams down into the
   Ledger, squares travelling the lines (the ingestion).
4. **Then it acts on all of it.** Red lines run back up from Distribute
   to every surface, and buyers who were someone else's turn red.
5. **Everything answers to one number.** Your buyers drop into the
   Ledger as one block; the rest step back. The columns, the layers and
   the streams stay as a graph: point at a surface or a layer, or tab to
   it, to light what it feeds.

Two readouts under the words count what the field shows (surfaces read,
and the share choosing you first), set in the display face with tabular
figures, never mono; a note says in plain view that the field is an
illustration and its numbers a drawing's. On a phone the pinned copy
keeps to its lines, so the readouts and the note step aside and the
field carries a short note of its own beside Pause. Static (no JS,
reduced motion, a screen under 600px tall) it is the last beat,
unpinned, every beat's words in order. It pins for about 360svh of
travel.

## Why Plurel: from a menu to the Plurel System

The services chapter carries the thesis, on graphite, between the engine
and the red Method. Markup in `home/services-chapter.tsx`, the
motion in `home/services-type.tsx` (client) with the engine in
`lib/services-type.ts` and the pin and clone rules in
`home/services-type.module.css`. Its head is the standard chapter head
(`ChapterHead`, left-aligned on columns 1-8): the h2 "Your marketing
shouldn't be ten companies. / It should be one system.", with the side
line as its aside on columns 9-12, so it reads like every other chapter
before the figure takes over. Then the figure, the contents
list itself, so the chapter's artifact makes the argument (integration,
not a menu) in the one place that has to show a menu:

1. **Ten voices.** "Ten disciplines, ten voices." The ten names arrive
   set the way ten different suppliers would set them: mono caps, tracked
   thin caps, condensed lowercase, a slanted light cut, a thin wide cut, a
   tilted bold lowercase, a rotated black, a huge red extended black, a
   vertical name, light condensed caps. Mismatched, but
   composed; the house face pushed to its extremes, no other fonts. They
   already stand in the menu's order, top to bottom, each near its row.
2. **Still a menu.** "Lined up, it's still a menu." They drop onto the
   rows of the list, still in their own voices. The list runs in the
   System's order (Narrative, Create, Distribute, Measure: the site's
   order for the services everywhere), never mixed.
3. **One system.** "Set as one, it's a system." Stage by stage along the
   chain, top to bottom, the names take one face, one scale and one
   rhythm; then the set menu settles onto the floor, and layer by layer,
   Narrative first, the names at the top of the menu leave it and the
   layer's band comes down from the foot of the one above to take them.
   Nothing is picked out of the middle of the list. On desktop the names
   fly into their band's service links; below lg they fold away. The
   narrator hands over to the title, "The Plurel System".

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
- The System (the ten discipline links grouped in four layers) is
  server-rendered and is what assistive tech, no-JS, reduced motion,
  forced colors and screens too short to pin get. Ten aria-hidden
  clones carry the motion.
- It pins on desktop from 1280x720 (1366x768 included) and on phones
  from 360x740; 1024x768, 375x667 and 360x640 get the static System. Ten
  rows share the pinned screen, so the names, their rows and the bands'
  padding scale with the visible height. Below lg the
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
item kept whole); the full method lives on /method. Under the chart, "Where AI
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
  places the summit. No readout or label rides on it: a survey caption
  ("Field 03") read as a stray label, so the field is art alone.
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
  /diagnostic/sample; the sample engagements on /industries, each headed
  "Sample engagement, illustrative, not a client"). The accountability strip's supplier metrics are
  generic examples of what suppliers report, not claims.
- No props or invented scenes stand in for an idea (no sample buyers,
  mock screens or mock reports), and no cited statistics on the homepage.
- The Proof chapter (`home/proof-chapter.tsx`, data in `lib/proof.ts`) shows
  what Plurel delivers first, in one screen: an excerpt of a Diagnostic,
  run on Halden, a sample company (the company and its total, six parts
  scored with drawn bars, and the read in three short lines: where you
  win, where you leak, what to fix first). The full sample, findings, the
  first quarter's plan and what we would measure included, is a page of
  its own, `/diagnostic/sample` (`components/diagnostic-sheet.tsx`, set
  in the graphite room).
  Real cases join Proof when they can be published: each opens with what
  the Diagnostic found and reports the one number with its client, cause
  and period.
- People (`home/people-chapter.tsx`, `lib/people.ts`) renders only once
  real people are listed: faces, first names, one line each.
- Photography direction for stills matches the film: people at work,
  crimson light against graphite shadow, warm skin tones, shallow depth of
  field, nothing staged at the camera.

## Interior pages

Every page after the homepage takes one of its claims further, and is
built from the same parts (`components/page.tsx`), so the site reads as
one firm rather than a set of templates. What each page does is in
`docs/sitemap.md`.

```
PageHead   h1, plotted on load (cols 1-8)       Standfirst, actions (cols 9-12)
Room       ChapterHead: h2 (cols 1-8)           Aside (cols 9-12)
           content on GRID: ruled lists, columns on a 2px rule, a chart
...        graphite rooms, at least one red, no two reds touching
Closing    red: one line (cols 1-8)             paper action + outlined one
```

- The page head is the page's one orchestrated moment: the h1 is
  plotted on load at the hero's pace, and its standfirst and actions
  light as the pen lifts, timed from the head's own length
  (`plotEnd`, `lib/plot.ts`). Every other head is plotted once as it
  enters.
- Chapters sit in graphite. Unlike the homepage, an interior page can
  run several graphite chapters in a row, so two of them may part by a
  hairline (`border-paper/10`), never a tint. The page's red room carries
  what the page is surest of: the rules on About, what comes back on the
  Diagnostic, where a discipline sits in the System.
- Lists are ruled (hairline above each row, one below the last), never
  carded. Small squares mark items (`bg-signal` on graphite, paper on
  red); the current item is marked by a filled node and a heavier rule,
  never by color alone.
- Forms (`components/diagnostic-form.tsx`) use square fields on a
  hairline, sentence-case labels and choices as square chips over real
  radios and checkboxes. The site is static, so a sent form opens the
  visitor's email app with the message written out, and says so.
- Samples are labelled where they stand ("Sample engagement,
  illustrative, not a client"), in signal, above the sample itself.
- Published numbers (the red `CaseBand`, `components/service.tsx`) make a
  page's case: the figure set large in the display face, what it measured,
  and its source (publisher, title, year) linked under it. Each is
  checked against its source and quoted within the source's own scope.
  Never on the homepage.
- Measures are what a page answers to, set as a `MeasureRail`: each
  measure, what it is and how often it is read, on one line that runs
  into the one number. They are definitions, never results.

## Service pages: the engagements and disciplines

Fourteen pages share one set of parts (`components/service.tsx`), but
each opens on its own drawing, and every part carries its point as
something seen before it is read: big numbers, numbered steps, a flow, a
calendar, a rail. Words sit beside the visual, a sentence or two at a
time; nothing is a paragraph in a column of paragraphs.

```
ServiceHead   the h1 (plotted on load), its line, the standfirst and
              actions on columns 1 to 6; the page's signature on 7 to 12;
              then four facts, each a value set large over what it is
CaseBand      the red room: the case in one line (display face), why it
              matters in two sentences, the published numbers set large
Part          a graphite chapter: an h2, one line on columns 9 to 12,
              then one visual
```

- The visuals: `Steps` (numbered, the numeral in signal); Reach's rules
  as a `Ladder` of rising steps; the four layers as a `LayerFlow`, one
  line with four stops and the loop back from the Ledger; what ships as a
  `ShipCalendar` (a square for each delivery across a quarter's thirteen
  weeks, a line for daily work, an outline for work timed to a push); a
  discipline's `DeliverableGrid`; the measures as a `MeasureRail` into
  the one number; `SitsFlow` (runs on, the discipline, feeds) with its
  engagements and neighbours as links; the first ninety days on a ruler.
- An engagement reads: head, case, how it works (its figure, then steps
  or the ladder), four layers, what ships, how it's measured, the first
  ninety days, questions, the other three, closing. A discipline reads:
  head, case, how it works (its figure), what you get, how it's
  measured, where it sits, questions, closing. The case band and the
  closing are the red rooms, never touching.

### Signatures: each page's own drawing

`components/signatures.tsx` draws one per page from a list of marks
(lines that draw at a steady rate, nodes and labels that light by
opacity) on a 600 by 450 field that scales with its column. Each is the
page's idea as a diagram: Reach's idea fanned into cuts with the one
that takes off; Reputation's places converging on one answer;
Mindshare's brands changing rank; Revenue's path and what leaves at each
step; the CMO as one owner at the centre; Branding's specimen (type,
colour, grid, voice) in Plurel's own system; Website Design's page in
three zones; Content's recording cut into a month; Video's one take and
its four crops; UGC's ten hooks; AI Search's sources feeding one answer;
Paid's budget moving week by week; PR's story spreading in rings; and
Analytics' sources counted once in the Ledger.

- A diagram of the idea, never a mock screen, a fake interface or a
  chart of results; a caption says what it shows. Brand names in them
  are placeholders (Brand A, B, C).
- One signal-red thread, everything else paper at a lower tone; labels
  are HTML at 13px and up; where a phone would crowd them, they move into
  a numbered key under the drawing.
- It draws once, after the h1 is plotted. With JS it waits hidden
  (`[data-sig]` in `globals.css`) until it starts, so it never shows
  finished and then redraws; without JS and under reduced motion it is
  simply drawn.

## Figures: one point each

Each brief makes its case with one figure (`components/figures/`, the
rules and parts in `kit.tsx`, chosen by `Instrument`). A figure is an
editorial chart, not a console or a dashboard: it says one thing, and a
reader gets it without being taught.

```
Figure    title: the point, in one sentence (the display face, 20 to 24px)
          sub: what is drawn (15px, fog)
          control: at most one two-way toggle, beside the title
          body: the chart, in the reading column (about 250 to 340px tall)
          caption: what the numbers are, in plain view (13px)
```

- One signal-red series carries the point; everything else is paper at
  a lower opacity. Square markers, hairline gridlines at a few round
  values, no boxes around the plot.
- Type is Geist with tabular figures, never mono: labels 14px, ticks and
  notes 13px, sentence case. Labels sit directly on what they name,
  placed where the lines are not; where words would crowd the lines
  (the CMO's decisions, PR's moments on a phone) the points take
  numbered square marks (`NumberMark`) and the words go in `Notes` under
  the chart; where a phone has no room to name the lines at their ends,
  a `Key` does.
- It draws once as it enters, at a steady rate (`useDraw`), and redraws
  when its toggle changes; under reduced motion it is simply drawn. A
  figure never loops.
- Every figure is a labelled illustration ("not a client's results"),
  except Website Design's, which measures the page itself in the
  reader's browser and says so. Mindshare's draws a published pattern
  (Les Binet, IPA, 2020) and cites it.
- Measured from 360px up: nothing past the column, nothing under 13px,
  no label over a line.

## Plates: the drawn instruments

The company pages carry plates (`components/artifacts/`),
so a page is read through a drawing as well as its words. A plate draws
the system itself: a mechanism (where buyers come from and what the site
does with them), a path (the surfaces a buyer passes through), or a
principle (luck against a system, memory fading and holding). Never a
mock screen, a fake dashboard or invented data; a sample drawn on one is
labelled as a sample (the Diagnostic's radar).

```
Plate      frame: a hairline and 3% paper on graphite, ember on red
           Stage: the drawing at its own aspect ratio
             Svg: lines (pl-stroke), nodes (pl-lit), pulses (pl-pulse)
             Label: HTML type in the drawing's coordinates, 13px and up
           figcaption: the readout (Readout), beside it from lg or under it
```

- The vocabulary is the site's: lines drawn at a steady rate, nodes and
  labels lit by opacity, each on its own clock (`--t`, `--d`), through
  the pen, so a plate draws as it enters and what follows waits for it.
- Hairlines in paper at 15 to 60%, the line that matters in paper or
  signal, the outcome as a signal square. One accent per drawing.
- A plate that loops keeps one quiet motion once drawn (pulses along its
  lines, the rhythm's sweep, the echo's ping), only while on screen,
  never under reduced motion, always with a Pause control at its corner.
  The rest draw once and hold.
- Phones: labels never scale with the drawing. Where they would crowd,
  the plate has a phone layout (Revenue, the industry paths and the
  suppliers run top to bottom) or hides its in-drawing labels for a
  legend (Reach and Mindshare).
- The drawings: the company pages' (`page-art.tsx`:
  Method's rhythm and team, the industries' paths, About's suppliers, the
  Diagnostic's radar). The journal's covers (`cover.tsx`) are survey
  plates: each essay's own patch of the contour terrain, turned per
  essay, with a mark at its summit.

## Header and footer

- Header (`site-header.tsx`): fixed and slim (56px, 64px at lg). At the
  top of every page it spans the width, transparent with paper type over
  the page's dark opening (every page opens in graphite, its head padded
  clear of the bar). After 24px of scroll it squeezes
  into a floating pill (48px tall, 2px corners, at most 1080px wide) of
  frosted glass with a lit top edge, whose tint follows what sits behind
  it: dark glass with paper type over graphite or red, light glass with
  ink over paper (sampled under the bar while scrolling, at nine points
  edge to edge, so the glass turns light whenever any of it overlaps
  paper and its type never thins out over a chapter boundary). The clock beside
  the CTA shows the visitor's own time zone, labelled with its city.
  Nav, menus and the CTA are sentence case (15px nav, 14px CTA, 13px
  clock), never tracked capitals.
  The primary nav is Services, Method, Industries, About and Journal
  (`PRIMARY` in `lib/nav.ts`); every "Request a diagnostic" goes to the
  Diagnostic's request form (`AUDIT_HREF`). Services opens a dark panel
  (a card under the pill) with the four packages (each with its want),
  the eight individual services and the Diagnostic as a red card: on hover for a mouse
  (the click that follows keeps it open), on the first tap for touch, and
  on Enter, which moves focus into the panel. Mobile opens a full-screen
  red index, which closes itself if the window widens past lg.
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
| The engine | The shift: buyers decide before they arrive, across many surfaces, and one system reads and moves all of them |
| Why Plurel | The thesis, shown: ten suppliers' voices become one system, the Plurel System's four layers and its loop, each layer with its instrument and services |
| Method | How it runs: the Diagnostic, then the four phases as one monthly partnership |
| Accountability | What we answer for: ten suppliers report ten numbers, we answer for one, agreed on day one |
| Who it's for | Fit: consumer brands, physical products, B2B technology and consumer technology, the same system with a different number |
| Proof | What a Diagnostic finds, in one screen (a labelled sample until real cases can be published; the full sample on /diagnostic/sample) |
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
