# Plurel — motion system

One vocabulary, site-wide. Every animation on the site comes from this
fixed set; new pages compose these — they do not invent new keyframes.
Everything lives in `globals.css` inside the
`prefers-reduced-motion: no-preference` block, so reduced-motion visitors
always get the finished, static page.

## Page load (every page, identical)

1. **h1 — `Cascade`** (`src/components/cascade.tsx`): word-by-word
   rise-and-sharpen (`word-in`: blur 4px → 0, translateY 4px → 0).
   House timing: `base={0.08} step={0.045}`. Multi-segment headlines pass
   `offset` (words rendered so far) so the cascade continues, never
   restarts. Used on: home hero, blog, contact, methodology, careers.
2. **Intro paragraph — `fade-up [animation-delay:250ms]`**: rises in as
   the cascade lands.
3. Everything else above the fold renders plainly. The homepage hero may
   additionally use `fade-up` on hero furniture (side labels, slider) —
   flagship only.

## Scroll entrances

- **`Reveal`** (`src/components/reveal.tsx`): the only scroll-entrance
  mechanism. Arms after hydration, below-fold only; rise 24px + fade over
  0.75s. Stagger siblings with `delay` (0.08–0.2s steps). `sweep` variant
  arrives from the lower-left — use sparingly.

## Ambient / continuous (schematics only)

Reserved for drawn diagrams and consoles, never for text or cards:

- `method-pulse` — travelling comet on a `pathLength={100}` SVG path.
  Override length/speed inline (`strokeDasharray: "4 100"`,
  `animationDuration`).
- `diagram-flow` — drifting dashes along a line.
- `diagram-blink` — soft opacity pulse on indicator dots. Stagger with
  negative `animationDelay`s so panels never blink in sync.
- `diagram-scan`, `marquee`, `growth-*` fills — scroll-driven or looping
  motion inside a specific instrument.

## Interaction

- Links/rows: `transition-colors duration-300`, arrows move with
  `group-hover:-translate-y-0.5 group-hover:translate-x-0.5`.
- Cards: color/border transitions only — no scale-ups beyond the
  showcase covers' `group-hover:scale-[1.02]`.
- Popovers/readouts: `glass-in` (rise + settle, 0.35s).
- Menus: `mega-in` / `scrim-in` (0.2s).

## Scroll-driven state (interactive sections)

rAF-throttled scroll handlers driving fills, ignition, and focus
(growth ledger, method stage, HUD). Rules: one handler per component,
`requestAnimationFrame` gate, bail out entirely under reduced motion,
SSR renders the finished state.

## Principles

- Motion explains structure (what connects to what, where you are);
  it never decorates.
- One entrance per element, ever — nothing re-animates.
- Reduced motion = the complete page, no theatre, nothing missing.
