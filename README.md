# Plurel

The marketing website for **Plurel** — Northeon's creative division. Plurel
turns outdated business presence into premium digital brand experiences:
website design, AEO/SEO, brand identity, content marketing, paid ads, PR &
reputation, and creative direction.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (CSS-first theme in `src/app/globals.css`)
- Fonts via `next/font/google`: **Inter** (UI/body) and **Fraunces** (serif accents)

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

Brand colors are exposed as Tailwind tokens (e.g. `bg-canvas`, `text-ink`,
`text-brand`, `border-line`). See `AGENTS.md` for the full palette and
conventions.

## Status

The home **hero section** is built and matches the approved design. The
remaining pages (About, Services, Our Work, Contact, Blog) are not built yet.
