# Plurel — site map and page briefs

The site tells one story: your marketing shouldn't be ten companies.
The homepage makes the whole argument. Each interior page takes one claim
from it and goes deeper, in the order a buyer asks:

1. What is the system? `/services`, then one page per discipline.
2. How does it run? `/method`
3. Is it for us? `/industries`
4. How do we start? `/diagnostic`, with a full sample at `/diagnostic/sample`
5. Who is behind it? `/about`
6. What do they think? `/journal`
7. How do we reach them? `/contact`

Every "Request a diagnostic" action lands on the Diagnostic's request form
(`AUDIT_HREF`, `/diagnostic#request`). Links that name the Diagnostic
itself go to the page (`DIAGNOSTIC_HREF`).

## The anatomy every interior page shares

All of it lives in `src/components/page.tsx`, so the pages read as one
site rather than ten templates.

- **One graphite room** (`main[data-room="dark"]`), under the floating
  header. No paper pages.
- **PageHead.** The h1 is plotted on load, the page's one orchestrated
  moment. The standfirst and the actions light after it, on columns
  9 to 12. There is no eyebrow over the headline.
- **Chapters.** A chapter is a `Room` (graphite or red) opening on a
  `ChapterHead`: an h2 plotted as it enters, with an optional aside on
  columns 9 to 12. Lists sit on hairlines. Mono is used only for data.
- **At least one red room per page, and no two red rooms touch.** Most
  pages close in a red `Closing`: one line, a paper action and an outlined
  one. The Diagnostic page ends on its request form and questions instead.
- **Metadata** from `pageMetadata`, with the page's own canonical path
  (trailing slash). There is JSON-LD where a schema.org type fits (FAQ,
  Service).
- **Data stays out of the pages**: `lib/nav.ts` (navigation and
  services), `lib/disciplines.ts`, `lib/industries.ts`, `lib/proof.ts`
  (the Diagnostic's parts and the sample) and `lib/posts.ts`.

## Pages

### `/` Home

The full argument (see `docs/design-system.md`, "The homepage's story").
It is the reference build.

### `/services` The Plurel System

The four layers from top to bottom (Narrative, Create, Distribute,
Measure), shown as the homepage's graphite bands at the same tones. Each
band gives what the layer builds, what it holds, the disciplines in it,
its cadence, and what it feeds. Closes on "Four layers. One number."

### `/services/[slug]` One discipline (eight pages)

From `lib/disciplines.ts`. The order is:

1. The name and the lead, with the layer it belongs to.
2. The job, in a line and two paragraphs.
3. What you get: the deliverables.
4. Where it sits: a red room with the System's four layers, this one
   marked, and links to the others.
5. How we read it: the signals.
6. Questions, with FAQ JSON-LD.
7. Closing.

There is also Service JSON-LD. No borrowed statistics.

### `/method` How an engagement runs

The four phases (Diagnose, Design, Deploy, Compound) on a 13-week chart,
with their outputs. Then:

- The rhythm (red): weekly, monthly and quarterly.
- One senior team: seven roles.
- Where AI helps, and where a person decides.
- Two ways to work (red): a sprint, or the partnership.

### `/industries` Who we work with

The symptom first: the signs heard in a first call. Then the four kinds of
business (consumer brands, physical products, B2B technology, consumer
technology). For each:

- who they are;
- where their buyers decide;
- the number we answer for;
- how each layer is tuned;
- one sample engagement, labelled in plain view as illustrative and not a
  client.

The homepage's Who it's for table reads the same data.

### `/diagnostic` The Diagnostic

The way in. In order:

1. The six parts it scores.
2. What comes back (red).
3. How it runs, in four steps.
4. The request form (`#request`). There is no backend, so it opens the
   visitor's email app with the request written out.
5. Its questions.

### `/diagnostic/sample` A Diagnostic, in full

The sample read for Halden (a sample brief, not a client), as
`DiagnosticSheet`. The homepage's Proof shows it in one screen.

### `/about` The firm

In order:

1. Why Plurel exists.
2. What we hold to (red): six rules.
3. Small, and senior: how the firm is built.
4. Working here: hiring by introduction. There are no invented openings
   or people.

### `/journal` and `/journal/[slug]` Journal

Essays set as type. There are no covers (mock screens stand in for
nothing) and no filter. The newest essay leads.

Each essay is a single reading column. It ends with two more essays and
the closing.

### `/contact` Get in touch

The message form beside the other ways in: new business (the Diagnostic),
the one inbox, press and working here, each with its subject written for
the visitor.

### `/privacy`, `/terms` and the 404

- **Legal.** Each section sits on a hairline, and the page closes on a red
  "Questions about this document?" band.
- **The 404.** It sends a visitor home or to the request form, and lists
  the site's index.

## Removed in round 13, and why

They were placeholders, and each one either promised what the firm can't
show yet or repeated another page.

- **`/work`** showed case studies. With no published clients, it could
  only show samples. The sample engagements now sit on `/industries`,
  labelled, and the sample Diagnostic has its own page.
- **`/studio`** repeated `/about`. "How work gets made" is now `/method`.
- **`/careers`** had no openings to list. Hiring by introduction is now a
  chapter of `/about`.
- **`/methodology`** became `/method`.
- **`/blog`** became `/journal`, the name the site already uses.
- **`/sample-diagnostic`** moved to `/diagnostic/sample`, under the page it
  belongs to.

Old URLs land on the 404, which links to every page. When the site moves
to its own domain, redirect `/blog/*` to `/journal/*` and `/methodology`
to `/method` at the host.

## Later, when it is real

- Case studies return as real, named engagements: a counted list inside
  the homepage's Proof and a page per case. Never as samples dressed as
  clients.
- The People chapter on the homepage and a team block on `/about`, once
  there are real names.
- A recurring teardown series in the journal (approved).
- Pricing as integrated monthly tiers, never per-channel items
  (approved).
- Article JSON-LD and per-essay social images for the journal.
