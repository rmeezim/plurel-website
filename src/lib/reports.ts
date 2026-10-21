/*
  The manifesto's table (components/home/supplier-reports.tsx): the ten
  reports a company like Halden gets every month, one from each
  supplier, each proud of its own number and none of them about
  qualified demand. Then Plurel's one sheet, with one line on it.

  Everything here is a sample. Halden is the site's sample brand (quiet
  heat pumps for homeowners and housebuilders), never a client, and the
  figures are illustrative; the chapter says so in plain view. Suppliers
  are named by role only: no company names, no logos.

  Each report is drawn at a fixed size in design pixels and placed by
  hand on one of three artboards, scaled to the container: phones show
  six of the ten, tablets and desktops all ten. Positions are fixed per
  breakpoint (no randomness at render); z is the stacking order, and the
  deal-in lays the pile bottom card first.
*/

export type ReportKey =
  | "seo"
  | "ads"
  | "social"
  | "analytics"
  | "pr"
  | "creator"
  | "site"
  | "content"
  | "brand"
  | "video";

/** A place on an artboard: top-left corner (design px), rotation (deg), stacking order */
export type Spot = { x: number; y: number; r: number; z: number };

export type Report = {
  key: ReportKey;
  /** The supplier, by role */
  role: string;
  /** The document's own title */
  title: string;
  /** The number it leads with, as a screen reader should hear it */
  metric: string;
  /** Plurel's question, written in its margin in red pen */
  note: string;
  /** Drawn size, design px */
  w: number;
  h: number;
  /** Desktop (lg) and tablet (sm) spots; phone only for the six shown there */
  lg: Spot;
  sm: Spot;
  phone?: Spot;
};

export const REPORT_MONTH = "September";

/** Artboards, design px: the table is drawn at this size and scaled to the container */
export const ARTBOARD = {
  phone: { w: 560, h: 830 },
  sm: { w: 960, h: 900 },
  lg: { w: 1344, h: 660 },
} as const;

/*
  The order is the tab order: the desktop pile read left to right (by
  each report's centre), which on phones reads down the left column,
  then down the right.
*/
export const REPORTS: readonly Report[] = [
  {
    key: "pr",
    role: "PR firm",
    title: "Coverage report",
    metric: "38 mentions, up",
    note: "Did any of them call?",
    w: 242,
    h: 324,
    lg: { x: 58, y: 286, r: -3, z: 1 },
    sm: { x: 22, y: 318, r: -2.5, z: 4 },
  },
  {
    key: "seo",
    role: "SEO agency",
    title: "Monthly SEO report",
    metric: "organic traffic up 12%",
    note: "From whom?",
    w: 236,
    h: 334,
    lg: { x: 466, y: 4, r: -3, z: 2 },
    sm: { x: 16, y: 14, r: -3, z: 1 },
    phone: { x: 8, y: 10, r: -3.5, z: 1 },
  },
  {
    key: "creator",
    role: "Creator agency",
    title: "Campaign recap",
    metric: "total reach 2.4 million, up",
    note: "Reached, or moved?",
    w: 306,
    h: 172,
    lg: { x: 236, y: 448, r: 2.5, z: 4 },
    sm: { x: 26, y: 612, r: 3, z: 9 },
    phone: { x: 14, y: 352, r: -2.5, z: 3 },
  },
  {
    key: "content",
    role: "Writers",
    title: "Content tracker",
    metric: "24 articles published, up",
    note: "Read by whom?",
    w: 364,
    h: 154,
    lg: { x: 452, y: 414, r: -1.5, z: 6 },
    sm: { x: 292, y: 700, r: -1.5, z: 10 },
  },
  {
    key: "site",
    role: "Web team",
    title: "Site health",
    metric: "performance score 96, up from 89",
    note: "Fast, to where?",
    w: 200,
    h: 244,
    lg: { x: 714, y: 246, r: -5, z: 7 },
    sm: { x: 258, y: 262, r: -5, z: 6 },
    phone: { x: 40, y: 560, r: 3, z: 5 },
  },
  {
    key: "ads",
    role: "Ads agency",
    title: "Paid media performance",
    metric: "click-through rate 2.1%, up 0.3 points",
    note: "Clicked. Then what?",
    w: 318,
    h: 204,
    lg: { x: 686, y: 34, r: 2.5, z: 3 },
    sm: { x: 232, y: 40, r: 2.5, z: 2 },
    phone: { x: 228, y: 58, r: 3, z: 2 },
  },
  {
    key: "brand",
    role: "Brand studio",
    title: "Brand audit",
    metric: "94% of assets on-brand, up",
    note: "Consistent, and chosen?",
    w: 236,
    h: 326,
    lg: { x: 944, y: 316, r: -2, z: 5 },
    sm: { x: 694, y: 362, r: -2.5, z: 8 },
  },
  {
    key: "social",
    role: "Social team",
    title: "Social snapshot",
    metric: "followers up 8%",
    note: "Are they buyers?",
    w: 220,
    h: 220,
    lg: { x: 962, y: 148, r: -4, z: 4 },
    sm: { x: 496, y: 236, r: 4, z: 7 },
    phone: { x: 320, y: 292, r: -3.5, z: 4 },
  },
  {
    key: "video",
    role: "Video studio",
    title: "Channel analytics",
    metric: "1.4 million views, up 32%",
    note: "And after the view?",
    w: 284,
    h: 196,
    lg: { x: 1052, y: 456, r: -3.5, z: 8 },
    sm: { x: 632, y: 690, r: -3.5, z: 11 },
    phone: { x: 256, y: 526, r: 4, z: 6 },
  },
  {
    key: "analytics",
    role: "Analytics partner",
    title: "Monthly analytics report",
    metric: "84 thousand sessions, up 9%",
    note: "Which ones mattered?",
    w: 258,
    h: 348,
    lg: { x: 1078, y: 18, r: 2.5, z: 1 },
    sm: { x: 688, y: 22, r: 3, z: 3 },
  },
];

/** Plurel's sheet: one team, one line item */
export const ONE_NUMBER = {
  title: "Monthly report",
  client: "Halden",
  item: "Qualified demand",
  /** Illustrative, and marked as a sample beside it */
  value: "146",
  definition:
    "The enquiries that can actually become customers. For Halden, that means booked home surveys and spec requests for a named site.",
  sample: "Sample figure. Halden is a sample brand, not a client.",
  /** The pile runs to 22 pages a report; this is the whole of it */
  page: "Page 1 of 1",
} as const;
