# Plurel — design system: Cinematic Red x Swiss Systems

Plurel is one of Northeon's specialized divisions. The site shares the
Northeon family layout with its sister divisions (Inter headlines at
regular weight, square-marker kickers in tracked caps, sharp blocks for
actions, diagonal arrows) and adds two things of its own:

- **Cinematic Red.** Red is the environment, not an accent. The hero is a
  red room with a red-graded film; whole chapters are flat red; the footer
  is oxblood. This is what makes the site feel alive, human, and inviting.
- **Swiss Systems.** Structure is strict but never drawn. A 12-column grid
  sets every edge, chapters are numbered, metadata is set in mono, and
  the logo's own 3x3 grid is the source of all of it.

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
- The mark is exact geometry on a 10-unit square: 2-unit corners and
  edges, a 4-unit center, 1-unit gutters. It paints in `currentColor`.
- `animated` staggers the nine cells in (flagship moments only).
- Header: 22 to 24px tall. Footer: full container width, in brand red
  on oxblood.

## Color

| Token | Hex | Role |
| --- | --- | --- |
| `brand` | `#bf3a36` | Plurel red: red chapters, primary actions, markers on paper |
| `ember` | `#8e2824` | Deep red: hover on red, the floor of red gradients |
| `oxblood` | `#2a0d0b` | Cinematic shadow: hero base, work chapter, footer |
| `blush` | `#f2c9bf` | Rose: secondary text and the dimmed headline line on red and dark |
| `signal` | `#e8564e` | Bright red: markers, rules, and indexes on dark |
| `paper` | `#fbfaf6` | Light chapters; text on red and dark |
| `ink` | `#110f0a` | Type on paper |
| `charcoal` | `#20201e` | Dark panels |
| `line` | `#d8d2c8` | Hairlines on paper (most hairlines use `ink/10` to `ink/15`) |
| `muted` | `#8f8981` | Secondary text and metadata on paper |

Legacy tokens `canvas`, `clay`, `rust` remain for interior pages until
they move over. Don't use them in new work.

### Surfaces

Three tones, and every chapter is exactly one of them:

| Tone | Class | Text | Use |
| --- | --- | --- | --- |
| paper | `bg-paper` | ink | Reading chapters: services, method, results, journal, FAQ |
| red | `bg-brand` | paper, blush | Hero, thesis, the closing invitation |
| dark | `bg-oxblood` | paper, signal | Work, footer |

All three are flat fills. Alternate tones so no two red or dark chapters
touch, and keep at least one red room on every page.

## Type

| Role | Face | Recipe |
| --- | --- | --- |
| Display (h1) | Inter 400 | `text-[clamp(3rem,min(8vw,13.5svh),7.25rem)] leading-[0.9] tracking-[-0.05em]` |
| Chapter (h2) | Inter 400 | `text-[clamp(2.25rem,5vw,5rem)] leading-[0.98] tracking-[-0.04em]` |
| Big numbers | Inter 300 | `font-light leading-[0.85] tracking-[-0.05em]` |
| Body | Inter 400 | 15 to 19px, `leading-relaxed`, 40 to 52ch |
| Accent | Instrument Serif italic | `<Accent>` inside a headline, one phrase only |
| Kicker | Inter 500 caps | `<Kicker>`: square marker, 11px, `tracking-[0.2em]` |
| Meta | Geist Mono caps | `<Meta>`: indexes, counts, clocks, parentheticals |

- Headlines are never bold. Size and tight tracking carry them.
- One `<Accent>` per headline, on the word that carries the feeling
  ("*visible* layer", "*presence* problem", "*obvious* choice").
- In the home hero the second line is the serif accent in `text-blush`.
- Parentheticals are Meta: `(01)`, `(Selected clients)`, `(Services)`.

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
- Full-bleed index rows (services, journal) put the hairline on the `li`
  and the content in `CONTAINER` inside the link, so the rule runs edge
  to edge and the hover flood fills the full width.

## Actions

- `<CtaLink>`: the one primary action per view. Sharp block, tracked caps,
  diagonal arrow. `solid` (red) on paper and dark, `paper` on red.
- `<TextLink>`: secondary. Tracked caps on an underline, straight arrow.
- Header CTA is outlined. Every page offers the Growth Audit as the
  primary door and the strategy call as the secondary one.

## Motion

Everything sits inside `prefers-reduced-motion: no-preference` in
`globals.css`, so reduced-motion visitors get the finished page.

- **Hero load (flagship only):** headline lines rise out of their masks
  (`line-rise`, 140ms apart), then copy, actions, and the distribution
  wall fade up (`fade-up`).
- **Scroll:** `Reveal` only; stagger siblings 0.08s.
- **Hover:** service rows flood red from the floor (`scale-y`, 500ms);
  case posters brighten slightly; arrows nudge diagonally.
- **Ambient:** the hero film and the distribution wall's drift
  (`wall-drift`, 120s per loop, pauses on hover). One control pauses
  both. Nothing else moves on its own.

## The home hero: red room and distribution wall

Plurel is the creative and distribution division, so its hero shows the
work traveling rather than a single photograph. That is also what sets
it apart from the sister divisions' heroes.

- **Statement:** "Made to be seen. *Everywhere.*" Two lines, the second in
  the serif accent and blush. Copy and both actions sit to the right.
- **The room:** flat `bg-brand`. When the film exists it plays behind
  everything, blurred and graded back to the same red. Until then the
  film prints on the wall show flat color stills. Film grain appears on
  the film only (the room and the film prints), never on flat surfaces.
- **The wall** (`hero-wall.tsx`): seven prints bottom-aligned like a
  contact sheet, each captioned in Meta with its index, format, and
  channel. Reel (Social), Search (Rank #1), Brand film (Web), AI answer
  (Cited), Feed (Paid), Press (Earned), Out of home (OOH). The subject on
  every surface is "Your Brand": the promise is what Plurel does for the
  visitor's brand. Sizes are in `--u` (scales with width, and with height
  on desktop), type inside a print is in em.
- **One film, many crops** (`hero-motion.tsx`): a single `<video>` plays
  behind the room; `FilmCanvas` frames mirror it live, cropped around a
  focal point, only while on screen.
- **Running foot:** "One story · seven surfaces · owned, earned, paid" and
  the one pause control.

## Imagery

- The hero film is generated in Higgsfield; see `docs/hero-video.md`.
- Case studies are flat color posters (`work-chapter.tsx`): one field of
  red, ink, blush or ember, the client set large with an accent line,
  the result as the loudest number. Real stills go in the same frame
  when they exist.
- Photography direction for stills matches the film: people at work,
  crimson and oxblood light, warm skin tones, shallow depth of field,
  grain, nothing staged at the camera.

## Header and footer

- Header (`site-header.tsx`): fixed. Over a cinematic hero it is
  transparent with paper type and a hairline; everywhere else, and after
  24px of scroll, it is a paper bar. Routes with a cinematic hero are
  listed in `OVERLAY_ROUTES` (`src/lib/nav.ts`); other routes get a
  spacer so content starts below the bar. Desktop menus open a full-width
  Swiss panel; mobile opens a full-screen red index.
- Footer (`site-footer.tsx`): oxblood, one invitation, Swiss link columns,
  full-width lockup, live studio clock.
