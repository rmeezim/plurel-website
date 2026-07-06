# Plurel — sitemap & page briefs

The homepage carries the full conversion arc. Every other page exists to
deepen one of its claims — proof (`/work`), capability (`/services`),
credibility (`/about`, `/studio`), method (`/methodology`) — or to catch a
visitor at a different entry point (blog posts, the growth-audit landing
page). Every page ends in the same two doors: book a strategy call, or
request the growth audit.

Conventions that apply to every page: editorial layout on the brand
canvas, mobile-first from 360px, section kickers with the Spark mark,
JSON-LD where a schema.org type fits, canonical + OG metadata, and one
primary CTA per page (the audit or the call — never both competing).

---

## Live

### `/` — Home ✅

The arc: Hero → Partners → Manifesto → Services → Growth System → Work →
Performance → Method → Proof → Compare → Journal → FAQ → Founder note →
Audit preview → CTA. Finalize before building outward.

### `/blog` — Journal index ✅

Exists. Later: topic tags (AEO, brand, growth systems), a featured essay
slot, and per-post OG images.

### `/blog/[slug]` — Posts ✅

Exists (6 posts). Later: `Article` JSON-LD, author block linking to
`/about`, related-posts footer, inline audit CTA mid-article.

### `/contact` — Contact ✅

Exists. Later: real contact details (email, phone, address are
placeholders), a scheduling embed for the strategy call, and a short
"what happens next" strip mirroring the CTA band's three steps.

---

## To build (in this order)

### 1. `/work` — Case studies index

Proof powers every other page; build it first.

- Hero: kicker + headline framing transformations, not deliverables
- Featured case study — full-width editorial card with outcome stat
- Case grid using the Problem → System built → Outcome framing from home
- Outcomes band: aggregate numbers (projects, avg. lift, retention)
- Sector/service filter (phase 2 — static grid first)
- CTA: "Your business could be next" → audit

### 2. `/work/[slug]` — Case study detail

The sales asset. One per engagement, template-driven.

- Hero: client, sector, scope chips, hero visual
- The situation (before) → The system built (schematic language, which
  growth-system layers were deployed) → The outcome (metrics cards)
- Visual gallery (clay-framed mockups)
- Client quote
- Prev/next case navigation + CTA

### 3. `/services` — Services index

- Hero: one team, one system positioning
- The eight services, each with outcome line + deliverable chips:
  Website Design · AEO/SEO · Brand Identity · Content Marketing ·
  Paid Ads · PR & Reputation · Creative Direction · Martech & Consulting
- How services connect — compact growth-system cross-link
- Engagement models: Project / Retainer / Growth transformation
- Proof strip (pull 2–3 cases) + services FAQ + CTA

### 4. `/growth-audit` — Audit landing page

The lead magnet deserves its own destination (and an ad-traffic URL that
isn't the homepage).

- Hero: what the audit is, no-cost, ~1 business day, from a strategist
- The six dimensions (reuse audit-preview section, expanded)
- What you receive: sample audit artifact visual
- How it works: request → review → 30-min walkthrough
- Trust: quote + logos + FAQ ("is this a sales call?")
- Form: name, company site, email

### 5. `/about` — The company

The entity page — what AI assistants will cite when asked "what is
Plurel". Keep it factual and quotable.

- Story: why Plurel exists (extends the founder note)
- The Northeon relationship — division structure, plainly stated
- Operating beliefs (manifesto, expanded to ~5 principles)
- Standards: what every engagement includes
- Founder/leadership block, team as it grows
- Links: studio, careers, methodology + CTA

### 6. `/studio` — The craft

About = the company; Studio = the practice. How work gets made.

- Design philosophy: editorial, systems over pieces, AI-era readiness
- The stack: design, build, martech tools (logo strip)
- Craft principles with living-schematic artifacts
- Studio photography when it exists (placeholder brand surfaces until)
- Selected artifacts gallery + careers cross-link

### 7. `/careers` — Careers

- How we work: small senior team, systems culture
- What we look for (craft, ownership, range)
- Open roles list (email applications initially; empty state: "no open
  roles — introduce yourself anyway")
- Hiring process: 3 steps, honest timelines

### 8. `/methodology` — The operating model

Currently the `/#method` anchor; becomes its own page when depth exists.

- The four phases (Diagnose → Design → Deploy → Compound) with
  deliverables, cadence, and rituals per phase
- Measurement philosophy (extends the Performance band)
- Methodology FAQ — high AEO value ("how does Plurel work")
- Nav's Methodology link switches from `/#method` to this page

### 9. Utility

- `/privacy`, `/terms` — legal stubs, plain editorial type
- Custom 404 — on-brand not-found with routes back to work/services/contact
- Per-page OG images (shared template, per-page titles) — phase 2

---

## Notes

- `/services/[slug]` (one landing page per service) is deliberately
  deferred to phase 2: each is an AEO asset targeting intent queries
  ("AEO agency", "brand identity for B2B"), but only worth building once
  `/services` and 2–3 case studies exist to link to.
- Nav is already wired for most of this: Company menu → About, Case
  Studies, Methodology, Studio, Careers, Blog, Contact. Services menu →
  service anchors. Build order above unblocks those links fastest.
- `sitemap.ts` and `robots.ts` must gain each route as it ships.
