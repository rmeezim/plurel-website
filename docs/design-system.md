# Plurel — design system: Cinematic Red x Swiss Systems

Plurel is a distribution engineering firm. The site reads like a
proprietary systems partner (the way Legora reads to law firms), never an
agency: authoritative, with a defense-grade precision and a little
creativity. Its layout (square-marker kickers, sharp blocks for actions,
diagonal arrows) carries three things of its own. On the site Plurel stands
alone: no Northeon, Kelwin or group.

- **Cinematic Red, set in graphite.** Red is the environment, not an
  accent: whole chapters are flat red, and the hero's film is graded red
  behind fluted glass. Graphite is the dark tone (hero, work, the AI
  layer), and the footer is paper.
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
| paper | `bg-paper` | ink | Reading chapters: Why now, Accountability, FAQ, journal, footer; the sample Diagnostic sheet |
| red | `bg-brand` | paper | Method, Who it's for, closing |
| dark | `bg-graphite` | paper, fog | Hero and What Plurel is, Why Plurel (services and the Plurel System), proof, the method's AI layer |

All three are flat fills. Alternate tones so every chapter change is a
clear cut (the homepage runs graphite hero and statement, paper Why now,
graphite Why Plurel, red Method, paper Accountability, red Who it's for,
graphite proof, paper FAQ and journal, red closing), no two red chapters
touch, and every page keeps at least one red room. The statement is the
hero's second beat, so it shares the hero's graphite.

## Type

Fonts load in `src/app/layout.tsx` through `next/font/google`.

| Role | Face | Recipe |
| --- | --- | --- |
| Display (headlines, names, big numbers) | Geist 470 | `type-display` plus a size; `leading-[0.98]` to `leading-none` |
| Title (sentences and smaller titles in the display face) | Geist 430 | `type-title` plus a size: sub-lines, questions, station and service names, figures |
| Accent | Geist, the headline's weight | `<Accent>`: the same face and weight, set back by tone (`text-fog`, `text-muted`, `text-brand`, `text-blush`) |
| Body | Geist 400 | 15 to 20px, `leading-[1.5]` to `[1.6]`, 34 to 68ch |
| Kicker | Geist 500, sentence case | `<Kicker>`: square marker, 14px (15px from sm), untracked |
| Meta | JetBrains Mono caps | `<Meta>`: indexes, figure captions, counts, clocks |

- The voice is a modern San Francisco technology company's: precise,
  compact and tight, never wide, light or airy. Geist (Vercel's open
  face, on Google Fonts) gives that neutrality; set a touch lighter than
  its default display weight so it reads assured rather than loud. The
  first cut, Mona Sans stretched to 110%, read friendly: round, open
  letters.
- `type-display` (in `globals.css`) sets Geist at 470 and `-0.038em`
  tracking with balanced wrapping, so a headline sets as one solid shape.
  The two largest heads (the hero and the closing) tighten to `-0.044em`
  through `--display-tracking`. Firm, never bold.
- `type-title` is the same face a step down (430, `-0.018em`) for
  sentences and smaller titles set in it, so a page of display lines
  keeps a hierarchy instead of reading as a wall of weight. The services
  chapter's house face (`HOUSE` in `lib/services-type.ts`) is this one,
  since the names land on the band links. Its eight voices are Mona Sans,
  loaded in that chapter only for its width axis; each changes into Geist
  late in its set (`HOUSE_FLIP`), within 4% of normal width, where the
  change hides in the motion.
- `<Accent>` ends a headline only in the hero ("Everywhere.") and the
  closing, set back by tone alone, never by a lighter weight: a thin
  phrase reads editorial. Every other headline is one tone. Never italic.
- The statement (What Plurel is) is reading type at display size: 410,
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
`globals.css`, so reduced-motion visitors get the finished page, and
without JS every chapter renders finished.

- **Headings arrive** through one vocabulary, `TypeReveal`
  (`components/type-reveal.tsx`, which documents the timings), all rising
  on a long expo-out, cubic-bezier(0.16, 1, 0.3, 1), none bouncing,
  blurring or scaling. Hero: the h1's words rise out of their masks from
  first paint (65ms apart), the light "Everywhere." last; the kicker,
  copy, action and glass are timed to it in `hero.tsx`. Display (chapter
  h2s): words in one wave, 32ms apart. Title (h3s and display-set lines):
  words rise 0.4em with opacity. Chars (names such as "Halden" or the
  business types): letters one by one. Kicker: the square scales in, then
  the label slides in. A heading below the fold plays once as it comes up
  the screen; one already on screen stays still. Each carries its words
  once as visually hidden plain text and hides the moving boxes from
  assistive tech, so it reads as one sentence. Under forced colors the
  heads set as plain, finished type (the backplate behind each line would
  otherwise cover the descenders of the line above).
- **Blocks:** `Reveal` (fade-up), staggering siblings 0.08s.
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

- **Kicker:** "Distribution, engineered".
- **Statement:** "Made to be / seen. *Everywhere.*", the accent in fog.
  Copy: "Great work no longer sells itself. Distribution does. Plurel
  engineers yours as one system, so the right customers find you and
  growth compounds." Action: "Request a diagnostic".
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

## Why now

`home/why-now.tsx`, on paper. The claim, "Buyers decide before they
arrive.", with a two-sentence standfirst beside it. Then the argument is
drawn, not told: a route of six small stations on one hairline (AI
answers, search, creators, reviews, stores, word of mouth; each a name in
`type-title` and one short line), under a bracket, "Where the choice gets
made". The line ends at a red node: "You, your site or store", noted in
red as "Where most marketing starts". From lg the route runs across a
seven-column grid; below it, a rail down the left whose stretches run
node to node. The line draws, the stations land in order. It closes
under a brand-red rule, in the title face: "We engineer the ones your
buyers use, as one system." Contours behind, with the page's one survey
readout. No statistics, no sources, no sample people, and only one
display-size line in the chapter: the six used to be set large, which
made it read as a wall.

## Why Plurel: from a menu to the Plurel System

The services chapter carries the thesis, on graphite, between the paper
Why now and the red Method. Markup in `home/services-chapter.tsx`, the
motion in `home/services-type.tsx` (client) with the engine in
`lib/services-type.ts` and the pin and clone rules in
`home/services-type.module.css`. Its head: the kicker "Why Plurel", the
h2 "Your marketing shouldn't be ten companies. / It should be one
system." (TypeReveal) and the side line. Then the figure, the contents
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
   one scale and one rhythm; then each layer's names leave the menu, the
   rows close ranks, and the layer's band rises from the one below,
   foundation first. On desktop the names fly into their band's service
   links; below lg they fold away. The narrator hands over to the title,
   "The Plurel System".

What stays is the Plurel System, drawn the way an architect draws a
building in section: four full-width flat bands, foundation at the foot,
Narrative on brand red and the three layers above in graphite tones that
lift as they rise. Each band carries its name (h4, display face), the
instrument it builds and its one line (Narrative: The Core Brief; Create:
The Asset System; Distribute: The Surface Plan; Measure: The Ledger),
what it feeds (the layer above; the Ledger feeds back into Narrative and
Distribute every quarter) and its services as links. A hairline loop
runs through the bands: a signal-red spine up through a node on each
layer and a dashed return from the Ledger, labelled "Read monthly. Reset
quarterly." from 1280px. Pointing at or focusing a band lifts it a tone
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

`home/accountability.tsx`, on paper. "Ten suppliers report ten numbers.
We answer for one." Then two strips of very large type that slide across
the full width in opposite directions as the reader scrolls (no pin; each
lines up on the grid as it crosses the middle of the screen): "What
suppliers report", ten supplier metrics in muted ink (reach,
impressions, followers, click-through, views, sessions, mentions,
articles, organic traffic, PageSpeed: generic examples, not claims), and
"What we answer for", the numbers businesses run on (orders, installs,
demos, stockists, bookings, sign-ups, renewals) in full ink with brand-red
square separators. Under reduced motion or without JS both stand still
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
answers, search and peers; demos with buyers who fit), consumer apps (app
stores, feeds and friends; installs that stay). From lg the two column
heads sit once over the table; below it each row carries small labels.
Labels in paper (blush fails AA at small sizes on red). Contours behind,
another seed.

## Method

`home/method-chapter.tsx`, on red. The four phases as a time chart, in
few words: each phase is a name, a tagline and what it delivers; the full
method, in prose, lives on /methodology. Under the chart, "Where AI
helps, and where a person decides" is one line per phase in one shape:
what the machine does, then what a person decides.

## Questions

`home/faq-chapter.tsx`, on paper. "Straight answers.", then the questions
as a quiet list, one line each, whose answers open on demand (native
`<details>`: no JS needed, keyboard and assistive tech included, and
search engines read every answer, as they do the FAQPage data). The first
sentence of an answer is the takeaway, in ink.

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
  view (the Proof chapter's sample Diagnostic for Halden; the sample
  engagements on /work). The accountability strip's supplier metrics are
  generic examples of what suppliers report, not claims.
- No props or invented scenes stand in for an idea (no sample buyers,
  mock screens or mock reports), and no cited statistics on the homepage.
- The Proof chapter (`home/proof-chapter.tsx`, data in `lib/proof.ts`) shows
  what Plurel delivers first: an excerpt of a Diagnostic, run on Halden, a
  sample company (six parts scored, where you win, where you leak, what
  to fix first, what runs first, what we would measure). Real cases join
  it when they can be published: each opens with what the Diagnostic
  found and reports the one number with its client, cause and period.
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
- Footer (`site-footer.tsx`): paper, brand-red lockup, Swiss link
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
| Why now | The shift: buyers decide before they arrive, in places the company doesn't control |
| Why Plurel | The thesis, shown: ten suppliers' voices become one system, the Plurel System's four layers and its loop, each layer with its instrument and services |
| Method | How it runs: the Diagnostic, then the four phases as one monthly partnership |
| Accountability | What we answer for: ten suppliers report ten numbers, we answer for one, agreed on day one |
| Who it's for | Fit: consumer brands, physical products, B2B technology and consumer apps, the same system with a different number |
| Proof | What a Diagnostic finds (a labelled sample until real cases can be published) |
| People | Who does the work (shown once real people are listed) |
| FAQ | The real objections, biggest first: is this a full-service agency? every channel? what about our current agencies? cost |
| Journal | What we're learning (later: the teardown series) |
| Closing | The Diagnostic as the door in ("Request your diagnostic"), with an email as the second way in |

Write "every relevant channel", never "every channel". The outcome is
"one number, agreed on day one" (orders, installs, demos, stockists);
never headline "qualified demand", and never "inquiries" or "pipeline"
alone. Copy reads for consumer brands, physical products, B2B technology
and consumer apps alike. Use the concrete noun where you can: team,
brief, number, report. Keep AI search, martech and measurement inside the method rather
than as slogans, and keep the voice plain: no triplet lists, no "Not X.
Y.", no consultancy words.
