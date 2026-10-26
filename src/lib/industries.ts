/*
  The four kinds of business Plurel works for, named at a high level
  (AGENTS.md). The homepage's Who it's for table reads key, name, decide
  and number; /industries reads the rest: who they are, the number in
  full, how each layer of the system is tuned, and one sample engagement,
  labelled as a sample wherever it shows. The samples are illustrative:
  no client, person, quote or result in them is real.
*/

export type Industry = {
  key: string;
  name: string;
  /** Where their buyers decide, in a few words (the homepage table) */
  decide: string;
  /** The number we answer for, in a few words (the homepage table) */
  number: string;
  /** Who they are */
  who: string;
  /** The number, said in full */
  numberLong: string;
  /** The surfaces their buyers pass through, in order, before the number */
  path: readonly string[];
  /** What each layer does for them, top to bottom */
  tuning: readonly [string, string, string, string];
  sample: { found: string; ran: string };
};

export const SAMPLE_LABEL = "Sample engagement, illustrative, not a client";

export const INDUSTRIES: readonly Industry[] = [
  {
    key: "consumer",
    name: "Consumer brands",
    decide: "Feeds, creators and reviews",
    number: "Orders",
    who: "Brands that sell to people directly and through retail, where a feed, a creator or a review usually makes the decision.",
    numberLong: "First orders from new customers, at a margin you can repeat.",
    path: ["A feed", "A creator", "Reviews", "Your site or a store"],
    tuning: [
      "One idea the product can prove, said the same way in every format.",
      "One shoot, cut into ads, creator briefs and product pages.",
      "Creators and paid social run as one plan, with press quotes working inside the ads.",
      "New-customer orders and their margin, in one weekly view.",
    ],
    sample: {
      found: "Three suppliers making three versions of the brand. Creators got a product and no brief, the ads chased cheap clicks, and the press never reached the ads.",
      ran: "One story and one shoot first, then creators and paid run as one plan, with the press quotes inside the ads.",
    },
  },
  {
    key: "products",
    name: "Physical products",
    decide: "Shelves, marketplaces and reviews",
    number: "Sell-through",
    who: "Products sold through retailers and marketplaces, where the shelf and the listing do most of the selling.",
    numberLong: "Sell-through: units that leave the shelf or the listing, not units shipped to it.",
    path: ["A marketplace search", "The listing", "Reviews", "The shelf"],
    tuning: [
      "The reason to pick it up, sharp enough to win at the shelf.",
      "Packaging, listings and product pages written from the same brief.",
      "Marketplace search, reviews and retail media before brand reach.",
      "Sell-through by retailer and by listing, read against spend.",
    ],
    sample: {
      found: "Strong reviews nobody could find, listings written by three different teams, and retail media bought separately from everything else.",
      ran: "One set of claims for every listing, the best reviews brought forward, and retail media moved to the products already selling.",
    },
  },
  {
    key: "b2b",
    name: "B2B technology",
    decide: "AI answers, search and peers",
    number: "Demos with buyers who fit",
    who: "Software and technology sold to businesses, where a committee decides, and asks an assistant before it asks you.",
    numberLong: "Demo requests from companies that fit, accepted by the people who sell.",
    path: ["An AI answer", "Search", "Peers", "Your site"],
    tuning: [
      "One position for the whole buying committee, written for the person who signs.",
      "The site and the sales material rebuilt from one brief, with research worth citing.",
      "Search and AI answers first, the founders’ own voices next, and paid search kept to the terms that convert.",
      "One count of demos that fit, agreed with the people who sell and kept in the CRM.",
    ],
    sample: {
      found: "Five suppliers, five reports, and a demo count nobody trusted. The site spoke to engineers while the buyer was a finance lead, and AI assistants named two competitors first.",
      ran: "One position for the committee, the site rebuilt for the person who signs, and search and AI answers first.",
    },
  },
  {
    key: "tech",
    name: "Consumer technology",
    decide: "Stores, creators and AI answers",
    number: "Users who stay",
    who: "Apps, devices and services people choose for themselves, in app stores, on creators’ channels and in AI answers.",
    numberLong: "Users who stay: people still active after their first month, not installs.",
    path: ["A creator", "An AI answer", "The app store", "The first week"],
    tuning: [
      "The one thing it does better, in the words users use when they recommend it.",
      "Store pages, onboarding and creator kits cut from one story.",
      "App store search, creators and AI answers, with paid behind what already converts.",
      "Retained users by source, so spend follows the people who stay.",
    ],
    sample: {
      found: "Installs bought cheaply from audiences that left within a week, a store page that said something the ads didn’t, and no way to tell which creators brought users who stayed.",
      ran: "Store pages rewritten from one brief, creators chosen by the users they keep, and paid moved to installs that last.",
    },
  },
];
