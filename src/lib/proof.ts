/*
  The Proof chapter (components/home/proof-chapter.tsx).

  There are no client cases to show yet, so the chapter shows the work
  itself: an excerpt of a Plurel Distribution Diagnostic, run on Halden,
  the sample brand of the attention section's week and its channel tiles
  (lib/channels.ts). Halden is invented and is labelled as a sample
  wherever it appears. Nothing here is a client, a person, a quote or a
  result.

  When real cases exist, with permission, they join this chapter in the
  same order the work runs: what the Diagnostic found, which stages ran,
  and one qualified-demand number with its client, cause and period.
*/

/** The chapter's anchor, so /work and other pages can point at the sample */
export const PROOF_ID = "proof";

export const PROOF_HREF = `/#${PROOF_ID}`;

export type PartScore = {
  /** One of the Diagnostic's six parts, named as the FAQ names them */
  part: string;
  /** Out of 10 */
  score: number;
  finding: string;
};

export type ChainStage = {
  stage: "Narrative" | "Create" | "Distribute" | "Measure";
  /** The months of the first quarter it runs in, 1 to 3 */
  months: readonly number[];
  line: string;
};

export const SAMPLE_DIAGNOSTIC = {
  label: "Sample Diagnostic",
  note: "Halden is a sample brief, not a client.",
  product: "Plurel Distribution Diagnostic",
  client: "Halden",
  about: "Quiet heat pumps for homeowners and housebuilders.",
  facts: [
    { term: "Buyers", value: "Homeowners (B2C) and housebuilders (B2B)" },
    { term: "Market", value: "United Kingdom" },
  ],

  parts: [
    {
      part: "Market and category",
      score: 8,
      finding:
        "Noise is the objection that stops heat pumps in terraced streets, and no rival brand speaks to it. The opening is Halden’s to take.",
    },
    {
      part: "Narrative and positioning",
      score: 5,
      finding:
        "The homeowner promise is clear: you won’t hear it. Developers get a spec sheet and nothing about fewer noise complaints at handover, which is what they buy.",
    },
    {
      part: "Website and touchpoints",
      score: 4,
      finding:
        "Both buyers land on the same page. The survey form asks eleven questions before it asks for a postcode, and the developer page sits three clicks deep.",
    },
    {
      part: "Assets and content",
      score: 6,
      finding:
        "Strong raw material, from independent noise tests to installer footage. Almost none of it is cut for search or for the AI answers buyers now ask.",
    },
    {
      part: "Distribution across channels",
      score: 3,
      finding:
        "Most of the budget runs as paid social to homeowners. Developers, who buy by the street, hear from Halden at one trade show a year.",
    },
    {
      part: "Measurement",
      score: 2,
      finding:
        "Each supplier reports its own number. Nobody can say which spend produced last quarter’s survey bookings, and developer requests aren’t counted at all.",
    },
  ] satisfies readonly PartScore[],

  read: [
    {
      head: "Where you win",
      text: "The product answers the objection. The Q7 measured 32 dB at three metres, 10 dB under what the rules allow at a neighbour’s window, and no rival brand talks about noise at all.",
    },
    {
      head: "Where you leak",
      text: "Developers. A housebuilder who could fit the Q7 to a whole street lands on a homeowner page and a survey form, with no way to ask for specs or volume pricing.",
    },
    {
      head: "What to fix first",
      text: "Give developers their own front door, with specs and volume pricing. Then count qualified demand from both buyers in one report, before another pound goes into paid social.",
    },
  ],

  chain: [
    {
      stage: "Narrative",
      months: [1],
      line: "One story for both buyers. For developers, quiet means fewer complaints at handover.",
    },
    {
      stage: "Create",
      months: [2, 3],
      line: "The noise tests, cut into a developer spec pack and a survey page that asks for a postcode first.",
    },
    {
      stage: "Distribute",
      months: [2, 3],
      line: "Search and AI answers for homeowners. Trade press and site visits for developers.",
    },
    {
      stage: "Measure",
      months: [1, 2, 3],
      line: "Both buyers counted in one report, wired before any new spend.",
    },
  ] satisfies readonly ChainStage[],

  /** Qualified demand, defined for each buyer */
  measure: [
    {
      buyer: "Homeowners",
      definition: "A booked home survey at an address where the Q7 fits.",
    },
    {
      buyer: "Housebuilders",
      definition: "A request for specs or pricing, tied to a named site.",
    },
  ],
  measureNote:
    "One number, split by buyer and reported monthly. Reach and clicks are tracked as causes of it.",
} as const;

/** The six scores summed, out of 60 */
export const SAMPLE_TOTAL = SAMPLE_DIAGNOSTIC.parts.reduce((sum, p) => sum + p.score, 0);
