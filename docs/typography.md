# Plurel — typographic system

One system, site-wide. Two families, each with a fixed job. This was
audited across every component and page; the rules below are the contract
every new page must follow.

## Families

- **Inter (`font-sans`, `--font-sans`)** — the default voice. Every heading,
  every display line, every statement, every label, all body copy.
- **Fraunces (`font-serif`, `--font-serif`)** — a *restricted* editorial
  voice, used only in the specific roles listed under "Serif is allowed
  only for" below. It is **never** used for a section heading, hero
  headline, or display tagline.

## Headings & display — always sans

All titles use the same recipe, scaled by level:

```
font-sans font-normal tracking-[-0.02em]   (large display / hero / statement)
font-sans font-normal tracking-[-0.01em]   (smaller headings, names)
```

- Weight is `font-normal` (400) at display scale — never bold. The size and
  tight negative tracking carry the authority, not weight.
- Size is set with `text-[clamp(min,vw,max)]` and a tight `leading-`.
- Reference: `hero.tsx` h1 —
  `font-sans text-[clamp(2.25rem,6.4vw,7.5rem)] font-normal leading-[0.95] tracking-[-0.02em]`.

### Accents inside a heading

Emphasis is **same-font italic**, never a font switch:

```jsx
Performance, <em className="italic text-clay">instrumented</em>.
```

- Optional tint: `text-clay`, `text-brand`, or `text-rust`.
- A serif-italic word inside a sans heading is the single most common
  "AI-generated site" tell. Do not do it. Italic ≠ serif.

### Kickers / labels

```
text-[10–11px] font-semibold uppercase tracking-[0.16em–0.22em]
```

Section kickers, spec lines, HUD chips, "you leave with" labels, etc.

## Serif is allowed only for

Fraunces appears in exactly these roles (21 instances, audited). If a new
element isn't one of these, it's sans.

| Role | Where |
| --- | --- |
| Card display line | Hero mockup cards ("Strategic by design", "Clarity Builds Confidence") |
| Product/device specimen | Work-section mockups ("Counsel, clarified.", etc.), the "Aa" type specimens (hero, services SVG, journal, post-cover) |
| Article / post title | Journal cards, blog index, blog post `<h1>` and related-post titles |
| Pull quote / blockquote | Proof-section testimonial, blog post blockquotes |
| Founder signature | `founder-note.tsx` — "Rameez", italic |
| Partner-name wordmark | Partners strip — two partners set in serif for texture (Northgate Legal, Mara Atelier) |

Everything else — including the methodology page's hero claim, conviction
line, phase intents, operating-law names, and the week-5 bridge line — is
sans.

## Density & pacing

Text-heavy is a failure mode. Pages alternate **organs** (ledgers,
consoles, chapters — information) with **rests** (statement sections,
visuals — breathing room), and the type floors below keep the organs
legible:

- **Statement sections** (`statement-section.tsx`): a tall surface, one
  line under ~8 words at display scale, at most a kicker + micro note.
  Place one between any two dense organs; every page gets at least one
  rest between hero and CTA.
- **Budget the motifs**: at most one ledger and one console per page.
  A second list of anything becomes a statement, a trio, or gets cut.
- **Ledger rows**: names at `clamp(1.5rem…2rem)`+; the explanation is one
  clause (≈10 words), `14px` minimum — or absent.
- **Type floors**: micro-labels ≥10px, detail/annotation text ≥13px,
  ledger rules ≥14px, body 15–16px.
- **Intros**: 1–2 sentences. If a paragraph explains what the next
  section already shows, delete it.

## Rationale

The serif is a *voice*, not a *decoration*. It reads as human/editorial
precisely because it is rare and reserved for moments where a person or an
artifact is "speaking" (a quote, a signature, a piece of published work).
Spending it on ordinary headings dilutes it and makes the system look
templated. Headings earn their authority from scale and restraint, in one
consistent family.
