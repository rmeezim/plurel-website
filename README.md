# Plurel

The marketing website for **Plurel**, a distribution engineering firm.
Plurel builds and runs the system that makes a growing company impossible to
miss: website design, brand identity, AI search and SEO, content marketing,
paid ads, PR and reputation, creative direction, and martech, run by one team.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (CSS-first theme in `src/app/globals.css`)
- Fonts via `next/font/google`: **Inter** (everything), **Instrument Serif** (italic accents), **Geist Mono** (metadata)

## Getting started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Project structure

```
src/
  app/
    layout.tsx     # root layout: fonts, metadata
    page.tsx       # home page (currently renders the hero)
    globals.css    # Tailwind import + brand design tokens (@theme)
  components/
    site-header.tsx  # top navigation (responsive, with mobile menu)
    hero.tsx         # home hero section
    icons.tsx        # inline SVG icon set
```

## Design system

Cinematic Red x Swiss Systems. Brand colors are exposed as Tailwind tokens
(e.g. `bg-brand`, `bg-oxblood`, `text-ink`, `border-line`). See
`docs/design-system.md` for the full system and `docs/hero-video.md` for
the hero film brief and Higgsfield prompts.

## Status

The home **hero section** is built and matches the approved design. The
remaining pages (About, Services, Our Work, Contact, Blog) are not built yet.
