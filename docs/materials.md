# Plurel — materials & visual objects

The third layer of the design system, after typography and motion. Flat
hex fields read as plain; the site's surfaces are **materials** (grained
gradients with ambient drift) and its imagery slots are **plates**
(composed brand objects) until real photography exists. New pages
compose from this kit — they do not invent one-off art.

## Materials (`globals.css`)

Four house gradients, used as full surface backgrounds:

| Class | Palette | Use |
| --- | --- | --- |
| `.material-daylight` | canvas → clay | Light feature surfaces |
| `.material-warmth` | clay → rust | Warm image stand-ins ("the room") |
| `.material-backstage` | warm ink → charcoal | Dark statements, covers |
| `.material-heat` | brand → rust | Brand statements, campaign art |

- **`.grain`** — tiled film-grain (`feTurbulence` data URI) as an
  `::after` overlay, `soft-light` at 0.07. Parent must be `relative`
  (or already positioned). Every composed surface carries it: plates,
  statements, case visuals, the methodology cover.
- **`.material-drift`** — oversizes the gradient and drifts its position
  over 16s. Pair with any `.material-*`. Gated behind reduced motion.

## Visual plates (`visual-plate.tsx`)

Section-scale art that carries layout the way photography would. Kinds:

- `identity` — backstage material, serif "Aa" specimen, palette dots
- `room` — warmth material with window-light wash (the studio stand-in)
- `campaign` — heat material, circled Spark, serif display line (`line` prop)
- `device` — warmth material with a drawn product silhouette
- `schematic` — paper panel with a drawn, living system diagram
  (bus, nodes, travelling pulse, blinking indicators)

Size via `className` (`aspect-[4/5]`, `aspect-[21/8] w-full`, …); caption
via `label`. All plates are `aria-hidden` decoration. **Rule: every
text-heavy section gets one visual object** — a plate beside the text, a
wide plate under the hero, or a drawn schematic. When real photography
arrives it replaces plates in the same slots, same sizes.

## Ticker (`ticker-strip.tsx`)

Display-scale outlined words on a slow marquee with Spark separators;
one word runs solid brand (`filledIndex`). Outlined text uses
`.text-outline-ink` / `.text-outline-paper` — a graphic device reserved
for tickers and ghost words, never headings or body. At most one ticker
per page; it counts as a rest in the pacing system.

## Statements

`StatementSection` surfaces are materials now (`ink`/`charcoal` →
backstage, `brand` → heat, `clay` → warmth), all with grain and drift —
statements are objects, not colored rectangles.

## Rules

1. No flat hex on a composed surface — material + grain, always.
2. One visual object minimum per text-heavy section.
3. Outlined type is a graphic, not typography.
4. Plates are placeholders with dignity: designed to be *replaced* by
   photography in place, so build slots at real-image aspect ratios.
