/*
  The channel tiles (components/home/channel-tiles.tsx): one sample
  brand's one story, as the eight screens one buyer sees it on in a week
  (the attention section, components/home/attention-field.tsx), each drawn
  as a screen recording that plays while it is on screen.

  The brand is Halden, a maker of very quiet heat pumps for homeowners
  and building developers. Everything here is invented: no real brand,
  publication, person, address or product appears in a tile. The dates
  line up with the week the section tells (Monday 9 to Monday 16 March
  2026): the review the search finds is three days old, the survey is
  booked within the week the search result promises.
*/

export type ChannelKey = "search" | "reel" | "answer" | "ooh" | "press" | "creator" | "film" | "book";

export type Channel = {
  key: ChannelKey;
  /** The format, as a reader would name it */
  name: string;
  /** Default nominal size in CSS px: the size the recording is laid out at before it is scaled to its box */
  w: number;
  h: number;
  /** Length of the recording's loop, in seconds (the tile's CSS keyframes are written against it) */
  loop: number;
  /** Where in the loop the recording starts, so a tile is never blank before it first plays */
  start: number;
  /**
   * What real footage replaces when public/video/channels/<key>.mp4 exists:
   * "scene" swaps the picture and keeps the product UI drawn over it,
   * "screen" swaps the whole tile (the clip is the screen recording)
   */
  clip: "scene" | "screen";
};

/**
 * In the order the buyer meets them. Every loop has its own length, so no
 * two recordings restart together, and each starts (CHANNELS start, also
 * the frame it holds before it first plays) at its most telling moment.
 */
export const CHANNELS: readonly Channel[] = [
  { key: "search", name: "Search result", w: 480, h: 270, loop: 13.7, start: 0.9, clip: "screen" },
  { key: "reel", name: "Reel", w: 225, h: 400, loop: 10, start: 1.2, clip: "scene" },
  { key: "answer", name: "AI answer", w: 320, h: 400, loop: 11.3, start: 6.2, clip: "screen" },
  { key: "ooh", name: "Billboard", w: 600, h: 200, loop: 16, start: 0, clip: "screen" },
  { key: "press", name: "Press feature", w: 320, h: 400, loop: 14.9, start: 0.6, clip: "screen" },
  { key: "creator", name: "Creator post", w: 320, h: 400, loop: 12.9, start: 2.6, clip: "scene" },
  { key: "film", name: "Brand film", w: 480, h: 270, loop: 12.4, start: 2.2, clip: "scene" },
  { key: "book", name: "Booking email", w: 320, h: 400, loop: 13.1, start: 3.4, clip: "screen" },
];

export const CHANNEL = Object.fromEntries(CHANNELS.map((c) => [c.key, c])) as Record<ChannelKey, Channel>;

/** Real footage for a tile, found at build time by lib/clips.ts */
export type ChannelClip = { src: string; poster?: string };
export type ChannelClips = Partial<Record<ChannelKey, ChannelClip>>;

/* ---------- the story ---------- */

const HALDEN = {
  name: "Halden",
  line: "Heat, without the noise.",
  product: "Q7",
  site: "haldenheat.com",
};

/**
 * AI answer. In `answer`, **bold** marks emphasis and [n] a citation chip
 * pointing at sources[n - 1].
 */
export const ANSWER = {
  question: "What's the quietest heat pump for a terraced house?",
  status: { busy: "Searching the web", done: "Searched 14 sources" },
  answer:
    "For a terraced house, with the outdoor unit a few metres from your neighbours, the quietest option in independent tests is the **Halden Q7** [1]. It measured **32 dB** at three metres, quieter than a library, and runs lower still at night [2].",
  sources: [
    { n: 1, site: "haldenheat.com", mark: "H" },
    { n: 2, site: "Hearth & Grid", mark: "HG" },
  ],
  input: "Ask a follow-up",
};

export const SEARCH = {
  query: "quietest heat pump for a terraced house",
  suggest: [
    "quietest heat pump for a terraced house",
    "quietest heat pump uk 2026",
    "quietest air source heat pump for small gardens",
  ],
  tabs: ["All", "News", "Images", "Videos", "Shopping", "Forums"],
  stats: "About 2,140,000 results (0.38 seconds)",
  results: [
    {
      site: "Halden",
      url: "https://haldenheat.com › q7",
      mark: "H",
      title: "Halden Q7: the quiet heat pump for terraced homes",
      text: "Tested at 32 dB at 3 m, quieter than a library. Fits a 1 m side return and works with the radiators you have. Book a free home survey.",
      links: [
        { title: "Book a home survey", text: "Free, in person, within a week." },
        { title: "For developers", text: "Specs, BIM files, volume pricing." },
      ],
    },
    {
      site: "Hearth & Grid",
      url: "https://hearthandgrid.com › reviews",
      mark: "HG",
      title: "The heat pump you can't hear: Halden's Q7 at 32 dB",
      text: "3 days ago · We stood next to it in a Leeds terrace and still asked if it was on. Here is how it measured, and what it costs to run.",
    },
    {
      site: "Retrofit Forum",
      url: "https://retrofitforum.org › noise",
      mark: "RF",
      title: "Heat pump noise and neighbours: what the rules say",
      text: "Permitted development needs 42 dB or less at the nearest neighbour's window. Most terraces are tight, so the quietest units matter.",
    },
  ],
};

export const REEL = {
  handle: "halden",
  /** Spoken captions, one group on screen at a time; `at` in seconds into the loop */
  captions: [
    [{ w: "This", at: 0.5 }, { w: "is", at: 0.78 }, { w: "it,", at: 0.98 }],
    [{ w: "running", at: 1.75 }, { w: "flat", at: 2.15 }, { w: "out.", at: 2.45 }],
    [{ w: "Listen...", at: 4.3 }, { w: "nothing.", at: 6.3 }],
  ],
  /** Captions clear before the loop cuts back */
  captionsEnd: 9.5,
  text: "Running flat out at 2am. Can you hear it?",
  tag: "#quietheat",
  audio: "Original audio · halden",
  likes: 48210,
  comments: 1204,
  shares: 3118,
};

export const FILM = {
  title: "Halden · Heat, without the noise.",
  /** Clip length and where the loop starts and ends in it, seconds */
  length: 30,
  from: 9,
  subtitles: [
    { text: "Is it even on?", from: 1.4, to: 4.2 },
    { text: "Heat, without the noise.", from: 6, to: 10.8 },
  ],
};

export const PRESS = {
  masthead: "Hearth & Grid",
  nav: ["Energy", "Retrofit", "Reviews", "Homes"],
  kicker: "Reviews · Heat pumps",
  headline: "The heat pump you can't hear",
  standfirst: "Halden's Q7 measured 32 dB in a Leeds terrace. We stood next to it and still asked if it was on.",
  byline: "Amira Hassan",
  date: "6 March 2026 · 6 min read",
  caption: "The Q7 on test in Headingley, Leeds.",
  body: [
    "Terraced streets are the hardest place to fit a heat pump. The outdoor unit sits a few metres from a neighbour's bedroom window, and the rules allow 42 dB there, no more.",
    "Halden built the Q7 for exactly that garden. On our meter it read 32 dB at three metres while heating the whole house, and it dropped to 29 dB in night mode.",
  ],
  quote: "The loudest thing in the garden was the birds.",
  quoteBy: "Owen Price, homeowner",
  more: [
    "Developers are paying attention too. Two housebuilders in Yorkshire now specify the Q7 as standard for new terraces, citing fewer noise complaints at handover.",
    "It is not the cheapest unit we tested, but it was the only one we forgot was running.",
  ],
  related: ["Ten retrofits, one winter: what the bills said", "Do heat pumps work in old stone houses?"],
};

export const CREATOR = {
  name: "Nora Pike",
  handle: "@nora.retrofits",
  age: "2h",
  hook: "I measured it: 32 dB.",
  text: "Quieter than my fridge. Full retrofit diary on my page.",
  tags: "#heatpump #retrofit",
  likes: 2481,
  /** Comments already there, then the ones that pop in during the loop (`at` in seconds) */
  comments: 183,
  thread: [
    { who: "dev.okafor", text: "Quieter than my dishwasher, honestly", at: 0 },
    { who: "halden", text: "Thanks for testing it properly, Nora.", at: 2.2 },
    { who: "ellie_builds", text: "Which model is this?", at: 4.6 },
    { who: "nora.retrofits", text: "The Q7, the 7 kW one.", at: 6.8 },
  ],
  /** The meter in the shot reads around this */
  db: 32.1,
};

export const OOH = {
  line: HALDEN.line,
  note: "Q7 · 32 dB",
};

/**
 * The booking email, on her phone on Monday morning: it arrives at the top
 * of her inbox, she opens it, reads what to expect and adds it to her
 * calendar. The address and the surveyor are as made up as the brand.
 */
export const BOOKING = {
  inbox: "Inbox",
  from: "Halden",
  email: "hello@haldenheat.com",
  at: "08:02",
  subject: "Your home survey is booked",
  preview: "See you on Thursday, Maya. Priya will be with you at 10:00.",
  /** The rest of her inbox, under the new email */
  rows: [
    { from: "Mum", subject: "That boiler", preview: "Did you ring anyone about it yet? x", at: "Sun" },
    { from: "Hearth & Grid", subject: "The weekend read", preview: "The heat pump you can't hear, and five more reviews", at: "Sat" },
    { from: "Northside Cycling Club", subject: "Saturday ride", preview: "Route, start time and the coffee stop", at: "Fri" },
  ],
  hello: "See you on Thursday, Maya.",
  date: "Thursday 19 March",
  time: "10:00 to 11:00",
  address: "14 Alder Terrace, Leeds LS6",
  surveyor: "Priya",
  role: "Your Halden surveyor",
  action: "Add to calendar",
  expectTitle: "What to expect",
  expect:
    "Priya will look at where the outdoor unit can go and check your radiators. She measures the noise at your neighbour's window too. It takes about an hour, and it's free.",
  change: "Need a different time? Just reply to this email.",
  toast: "Added to Calendar",
};
