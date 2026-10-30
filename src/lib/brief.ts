/*
  The shapes the engagement and discipline briefs share (components/page.tsx
  sets them): the measures a page answers to, and the published numbers
  that make its case.
*/

/** A measure a page answers to, read in the Ledger */
export type Measure = { name: string; what: string; when: string };

/** A published number, quoted within its source's own scope */
export type Stat = { figure: string; text: string; source: string; url: string };
