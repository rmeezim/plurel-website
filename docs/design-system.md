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
  sets every edge and the logo's own 3x3 grid is the source of it. The
  structure is felt, not labelled: no chapter numbers, running heads,
  rulers or figure captions; mono is kept for data (dates, units, scores,
  tags, the four Method phases).
- **Frontier type.** One wide grotesk (Mona Sans) for everything, with a
  mono for the instrumentation. No serif and no italics in the site's own
  voice; only the drawn documents (the week's channel tiles, the
  supplier reports) and services' first beat borrow other voices, on
  purpose.

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
| paper | `bg-paper` | ink | Reading chapters: the attention section's week, FAQ, journal, footer; the sample Diagnostic and the manifesto's one-number sheet |
| red | `bg-brand` | paper | The manifesto (Why Plurel), Method, closing |
| dark | `bg-graphite` | paper, fog | Hero, services, proof, the method's AI layer |

All three are flat fills. Alternate tones so every chapter change is a
clear cut (the homepage runs graphite hero, paper week, red manifesto,
graphite services, red method, graphite proof, paper FAQ and journal, red
closing), no two red chapters touch, and every page keeps at least one
red room.

## Type

Fonts load in `src/app/layout.tsx` through `next/font/google`.

| Role | Face | Recipe |
| --- | --- | --- |
| Display (h1, h2, h3, big numbers) | Mona Sans, 110% width, 430 | `type-display` plus a size; `leading-[0.98]` to `leading-none` |
| Accent | Mona Sans 300 | `<Accent>`: same face, lighter, toned by color (`text-fog`, `text-muted`, `text-brand`, `text-blush`) |
| Body | Mona Sans 400 | 15 to 20px, `leading-[1.5]` to `[1.55]`, 34 to 68ch |
| Kicker | Mona Sans 500, sentence case | `<Kicker>`: square marker, 14px (15px from sm), untracked |
| Meta | JetBrains Mono caps | `<Meta>`: indexes, figure captions, counts, clocks |

- `type-display` (in `globals.css`) sets the face, `font-stretch: 110%`,
  weight 430, `-0.018em` tracking and balanced wrapping. Headlines are
  never bold.
- `<Accent>` (the light weight) ends a headline only in the hero
  ("*Everywhere.*") and the closing. Every other headline is one weight:
  a device on every headline reads as a formula. It is never italic.
- `figures` sets lining, proportional numerals for stats.
- Meta (mono, 11px caps) is for data only: dates, read times, units,
  scores, tags, the Method phase numbers. About fifteen on the whole
  homepage, outside the drawn documents. Never a label that only
  announces what comes next.
- Navigation, labels and small actions are sentence case at 13px and up
  (header nav 15px, header CTA 14px, clock 13px, footer column heads
  14px). Tracked uppercase micro-type reads as a template; it stays out
  of the site's own chrome.
- Times and counts that people read (the week's day and time, the
  manifesto's 146) use the face's lining, proportional figures: its
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
<ChapterHead label="Services" />
■ Services
Headline, one weight (lg:col-span-7/8)            Aside + TextLink (lg:col-span-3/4)

Content on GRID
```

- One quiet label per chapter at most (`ChapterHead`, a `Kicker` with its
  square), or none where the headline carries it. No numbers, no running
  head, no ruler, no second kicker.
- Padding: `py-24 lg:py-36`; closing chapters `py-28 lg:py-40`.
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
- **Scroll:** `Reveal`, staggering siblings 0.08s. One chapter is pinned
  and scrubbed: services' typographic system, which ends on its layered
  stack. Everything else rides native scroll: the week's narrator is
  sticky and turns its day and time over as each tile reaches the middle
  of the screen, the manifesto's reports are dealt onto the table once as
  it scrolls in, and the two glass bands follow scroll as a height
  profile. Nothing else is driven by scroll position.
- **Hover:** a pointer pours light into the glass (below); a supplier
  report straightens, lifts and takes its red-pen question; a services
  layer lifts its plate, and a plate lights its row; contents rows take a
  red top rule; arrows nudge diagonally.
- **Ambient:** the film behind the glass and the week's channel tiles
  while they show (no controls, by the owner's call: they run only while
  on screen, and stop in hidden tabs and behind the open mobile menu). The
  selected-clients marquee (`clients-strip.tsx`, paused on hover) returns
  only once real client names exist. Nothing else moves on its own; all
  of them sit still for reduced motion.

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

- **Kicker:** "Distribution, engineered · A Northeon company".
- **Statement:** "Made to be / seen. *Everywhere.*", the accent in fog.
  Copy: "Great work no longer sells itself. Distribution does. Plurel
  engineers yours as one system, so the right clients find you and growth
  compounds." Action: "Request a diagnostic".
- **Glass:** the `rise` band, set well below the actions, uncaptioned,
  resting a little over half its height on first load.

## The attention section: one buyer's week

`home/attention-field.tsx` (server markup), with the sticky narrator in
`home/attention-week.tsx` (client), the moments in `lib/attention-field.ts`
(`WEEK`), the layout in `home/attention-field.module.css`, and the
channel tiles in `home/channel-tiles.tsx` (data in `lib/channels.ts`).
The section right after the hero (`#distribution`, paper, a clean cut
from the graphite hero) tells "Attention is everywhere" as a human story
rather than a diagram: no particles, lanes, funnels or curves.

- **Opening.** One quiet label ("How distribution works"), the h2
  "Attention is everywhere." on the shared scale, and a standfirst beside
  it that introduces the week and says in plain view that it is a
  sample: Maya owns a terraced house in Leeds and a boiler that sounds
  like a jet; Halden, the heat pump brand she keeps meeting, is one we
  made up.
- **The week.** Eight moments, Monday 9 to Monday 16 March: a search at
  her desk, a reel at lunch, an AI answer on the sofa, the billboard by
  the station, the weekend review, a creator she follows with a meter
  next to hers, the brand film before her show, and the booking email.
  Each is one large tile (a drawn screen recording, the same story every
  time) with its day and time and one plain sentence. From lg on a screen
  at least 560px tall (with JS), a sticky narrator on columns 1 to 4
  tells whichever moment holds the middle of the screen: a week strip
  (a letter a day, a square per moment: ink once passed, red for now,
  faint to come, and "Sample week" beside it), the day and time set at
  72 to 96px in the display face, turning over like a clock, and the
  sentence. Everywhere else, and without JS, each moment's own text sits
  above or beside its tile.
- **The close.** "Seven times, in seven places, the same story. Then she
  booked." at headline scale, then "For a developer buying fifty units,
  the week looks different. The story doesn't." and the outline "See the
  method" button. It doesn't name the number: the manifesto, next, does.

Tiles are DOM (crisp type) and decoration (aria-hidden; each moment's
sr-only line says what it shows). Each plays only while on screen (a
sliver is enough), never behind the open mobile menu or in a hidden tab,
and holds a designed still frame for reduced motion, data saver and no
JS. Each is also a slot for real footage: drop
`public/video/channels/<key>.mp4` (keys: search, reel, answer, ooh,
press, creator, film, book; optional `<key>.jpg` poster) and
`lib/clips.ts` picks it up at build time, muted and looped, with
`preload="none"`. Nothing that contains the sticky narrator may clip
(`overflow: hidden/clip` breaks it).

## Why Plurel: ten reports on a red table

`home/manifesto-chapter.tsx` (server markup and the one-number sheet),
the table in `home/supplier-reports.tsx` (client) and
`home/supplier-reports.module.css`, data in `lib/reports.ts`. The
manifesto is a red chapter: the thesis, then the evidence on the desk.

- **Thesis.** "Your marketing shouldn't be ten companies. It should be
  one system." set larger than the shared H2 (it is the site's thesis),
  with the standfirst beside it.
- **The table.** The ten reports a company gets in a month, one per
  supplier, each a small document in the house style its sender would
  use (an SEO PDF cover, an ads dashboard, a social snapshot, a monthly
  analytics page, a PR coverage report with clippings, a creator recap,
  a content tracker spreadsheet, a site health gauge, a brand audit, a
  video analytics card), each proud of its own September number and
  none of them about qualified demand. Suppliers are named by role only:
  no company names, no logos. Placed by hand on fixed artboards per
  breakpoint (phones show six of the ten), slightly rotated,
  overlapping, as a still life across the container. The h3 "Every
  supplier reports its own number. Nobody owns the outcome." sits in
  the table's quiet top-left corner from lg, with one plain line under
  it: sample reports for Halden, illustrative figures, pick one up.
- **Pick one up.** Hover (mouse and pen), focus or a tap straightens a
  report, lifts it to the top of the pile, and a red pen circles its
  number and writes Plurel's question beside it ("Clicked. Then what?",
  "From whom?", "Did any of them call?"...). A tap, click, Enter or
  Space holds it; Escape, a press elsewhere or focus leaving the pile
  puts it back. The pile is a list of ten buttons, each named by its
  supplier, title and number and described by its question.
- **The resolution.** "One team. One number." beside one clean Plurel
  sheet, upright and apart from the pile: a single line item, "Qualified
  demand 146", defined in plain words (the enquiries that can actually
  become customers; for Halden, booked home surveys and spec requests
  for a named site) and marked as a sample figure. Then "Find where
  your suppliers disagree." and "Request a diagnostic".

Motion: a table that starts below the fold is dealt onto the desk once as
it scrolls in, bottom card first; no pin, no scrub, no canvas. Reduced
motion gets the same table and notes without movement; without JS, CSS
alone lifts a report on hover and focus. Paper type on red: body copy in
paper (5.2:1), blush only at display sizes.

## Services: from a menu to a layered system

Services sits on graphite, a hard cut from the red manifesto before it
and the red Method after it. Markup in `home/services-chapter.tsx`, the
motion in `home/services-type.tsx` (client) with the engine in
`lib/services-type.ts` and the pin and clone rules in
`home/services-type.module.css`. The figure is the contents list itself, so
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
   chain (Narrative, Create, Distribute, Measure, each lit as its layer
   locks), the names take one face, one scale and one rhythm, then drain
   into the system layer by layer, foundation first: each layer a plate
   of glass, in the hero glass's material set flat (a cool slate tint,
   frost 1px edges, paper type, no shadow, no glow), settling onto an
   isometric stack (CSS 3D on real DOM). Below lg the menu folds away
   under the stack.

What stays is the system, in the spirit of Legora's layered OS: on the
left the four layers as a quiet list, each its name and one line
(Narrative: what you stand for and how it sounds, before anything is
made; Create: the site every buyer meets, and the content that earns
attention; Distribute: putting the story where attention gathers;
Measure: one set of numbers across every layer, counted as qualified
demand). A layer opens (one at a time; the foundation open by default on
desktop, all closed below lg) to show its services as links with their
taglines. On the right, the stack: pointing at or focusing a layer lifts
its plate and edges it in signal red; pointing at a plate lights its
row, and a click on it opens the layer. The list is the one control (the
chain is no longer a toggle).

Rules:
- The layer list (native `<details>`, the eight service links grouped
  in four layers) is server-rendered and is what assistive tech, no-JS,
  reduced motion, forced colours and screens too short to pin (phones
  under 650px tall, 640px from lg, and any screen whose finished frame
  would not fit) get, with the narrator saying what it shows: "Eight
  kinds of work, in four layers." Eight aria-hidden clones carry the
  motion; the plates are aria-hidden too.
- Pinned for 150svh of travel on desktop and 131svh on phones (the first
  two beats keep the 110svh and 96svh they were drawn for; the rest is
  the stacking), moved only by the visitor's scroll; transforms and
  opacity only, measured after fonts load and on resize, which keeps the
  reader's place. Colours morph in OKLab, so no red passes through pink.
  `#services` lands on the chapter.
- The pure parts are unit tested:
  `npx -y tsx --test src/lib/services-type.test.ts`.

## Imagery and proof

- Footage is shot, not generated: the hero film and the channel tiles take
  real footage of real work when it exists (see `docs/hero-video.md`);
  until then the drawn stand-ins stay. No AI-generated video or stills.
- Proof is never invented. No client, person, quote, logo or result is
  shown as real unless it is. Samples are labelled as samples in plain
  view (the week's Maya and Halden; the supplier reports and their
  figures; the Proof chapter's sample Diagnostic; the sample engagements
  on /work).
- The Proof chapter (`home/proof-chapter.tsx`, data in `lib/proof.ts`) shows
  what Plurel delivers first: an excerpt of a Diagnostic, run on the
  Halden sample brief (six parts scored, where you win, where you leak,
  what to fix first, what runs first, what counts as qualified demand).
  Real cases join it when they can be published: each opens with what
  the Diagnostic found and reports one qualified-demand number with its
  client, cause and period.
- People (`home/people-chapter.tsx`, `lib/people.ts`) renders only once
  real people are listed: faces, first names, one line each.
- Photography direction for stills matches the film: people at work,
  crimson light against graphite shadow, warm skin tones, shallow depth of
  field, nothing staged at the camera.

## Header and footer

- Header (`site-header.tsx`): fixed and slim (56px, 64px at lg). At the
  top of the page it spans the width: transparent with paper type over a
  cinematic hero, a paper bar elsewhere. After 24px of scroll it squeezes
  into a floating pill (48px tall, 2px corners, at most 1080px wide) of
  frosted glass with a lit top edge, whose tint follows what sits behind
  it: dark glass with paper type over graphite or red, light glass with
  ink over paper (sampled under the bar each frame). The clock beside
  the CTA shows the visitor's own time zone, labelled with its city.
  Nav, menus and the CTA are sentence case (15px nav, 14px CTA, 13px
  clock), never tracked capitals.
  Routes with a cinematic hero are listed in `OVERLAY_ROUTES`
  (`src/lib/nav.ts`); other routes get a spacer so content starts below
  the bar. Desktop menus open a Swiss panel (a card under the pill);
  mobile opens a full-screen red index.
- Footer (`site-footer.tsx`): paper, brand-red lockup, Swiss link
  columns, the Northeon line (Plurel beside its sister, Kelwin), live
  studio clock (New York). The closing chapter's `arc` glass sits right above it.

## Positioning in the homepage

Plurel sells integration, not a menu of services. Every chapter carries
one step of that argument, and says it once:

| Chapter | Job |
| --- | --- |
| Hero | The promise: made to be seen, everywhere; great work no longer sells itself, distribution does |
| Attention section | Distribute: attention is everywhere; one buyer's week, seven places, the same story, then she books (and a B2B buyer's week holds the same story) |
| Manifesto (Why Plurel) | Measure: ten suppliers, ten reports, ten numbers, nobody owns the outcome; one team, one number: qualified demand |
| Services | Structure: eight kinds of work as one system in four layers (Narrative, Create, Distribute, Measure), foundation first; the budget follows the bottleneck |
| Method | How it starts: the Diagnostic, then the four phases as one monthly partnership |
| Proof | What a Diagnostic finds (a labelled sample until real cases can be published) |
| People | Who does the work (shown once real people are listed) |
| FAQ | The real objections, biggest first: is this a full-service agency? every channel? what about our current agencies? cost |
| Journal | What we're learning (later: the teardown series) |
| Closing | The Diagnostic as the door in ("Request your diagnostic"), with an email as the second way in |

Write "every relevant channel", never "every channel", and "qualified
demand", never "inquiries" or "pipeline" alone. Say "one system" once (the
Services narrator); elsewhere use the concrete noun: team, brief, number,
report. Keep AI search, martech and measurement inside the method rather
than as slogans, and keep the voice plain: no triplet lists, no "Not X.
Y.", no consultancy words.
