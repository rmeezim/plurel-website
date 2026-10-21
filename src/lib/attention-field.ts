import type { ChannelKey } from "@/lib/channels";

/*
  The attention section (components/home/attention-field.tsx): one buyer's
  week, told in the eight moments she meets the sample brand Halden, each
  on a different surface, each with the same story. Maya, her house and
  her week are as made up as the brand; the page says so in plain view.

  The week runs from Monday 9 to Monday 16 March 2026, so the dates in the
  tiles (lib/channels.ts) agree with it.
*/

/** Nominal size of a tile, in CSS px: the size its recording is laid out at */
export type TileSize = { w: number; h: number };

export type Moment = {
  /** The tile (components/home/channel-tiles.tsx) */
  key: ChannelKey;
  /** The day as the page sets it, and in full for screen readers */
  day: string;
  dayName: string;
  /** Its place in the week strip: 0 to 6 Monday to Sunday, 7 the Monday after */
  d: number;
  time: string;
  /** Machine-readable date and time, for <time> */
  iso: string;
  /** One plain sentence: where she is and what she meets */
  line: string;
  /** What the tile shows, for screen readers (the tile itself is decoration) */
  alt: string;
  /** The tile's nominal size from 40rem up, and on phones (sized so its text reads) */
  size: TileSize;
  narrow: TileSize;
  /** Its width from 40rem up, in CSS px (never wider than its column) */
  show: number;
  /** Its share of the width on phones */
  phone?: number;
};

export const WEEK: readonly Moment[] = [
  {
    key: "search",
    day: "Mon",
    dayName: "Monday",
    d: 0,
    time: "09:12",
    iso: "2026-03-09T09:12",
    line: "At her desk between meetings, she finally types the question.",
    alt: "A search results page for “quietest heat pump for a terraced house”. Halden’s Q7 page is the top result, with the Hearth & Grid review under it.",
    size: { w: 560, h: 315 },
    narrow: { w: 300, h: 380 },
    show: 720,
  },
  {
    key: "reel",
    day: "Mon",
    dayName: "Monday",
    d: 0,
    time: "12:40",
    iso: "2026-03-09T12:40",
    line: "At lunch, a reel stops her thumb: a heat pump running flat out, and nothing to hear.",
    alt: "A vertical video from Halden: a phone held up to a heat pump’s fan, captioned “Listen... nothing.”",
    size: { w: 225, h: 400 },
    narrow: { w: 225, h: 400 },
    show: 292,
    phone: 0.74,
  },
  {
    key: "answer",
    day: "Tue",
    dayName: "Tuesday",
    d: 1,
    time: "21:05",
    iso: "2026-03-10T21:05",
    line: "On the sofa, she asks an assistant the same question, and it names Halden first.",
    alt: "An AI assistant’s answer to “What’s the quietest heat pump for a terraced house?”: the Halden Q7, 32 dB at three metres, with haldenheat.com and Hearth & Grid as its sources.",
    size: { w: 320, h: 400 },
    narrow: { w: 320, h: 400 },
    show: 416,
  },
  {
    key: "ooh",
    day: "Thu",
    dayName: "Thursday",
    d: 3,
    time: "18:10",
    iso: "2026-03-12T18:10",
    line: "Walking home past the station, she reads it six metres wide: Heat, without the noise.",
    alt: "A billboard on a street at dusk: “Heat, without the noise.” Halden Q7, 32 dB.",
    size: { w: 560, h: 240 },
    narrow: { w: 320, h: 200 },
    show: 770,
  },
  {
    key: "press",
    day: "Sat",
    dayName: "Saturday",
    d: 5,
    time: "09:30",
    iso: "2026-03-14T09:30",
    line: "Over coffee, she reads the review she skipped on Monday: 32 dB in a Leeds terrace.",
    alt: "A Hearth & Grid review, “The heat pump you can’t hear”: the Q7 measured 32 dB in a Leeds terrace.",
    size: { w: 320, h: 400 },
    narrow: { w: 300, h: 375 },
    show: 416,
  },
  {
    key: "creator",
    day: "Sun",
    dayName: "Sunday",
    d: 6,
    time: "20:45",
    iso: "2026-03-15T20:45",
    line: "Nora, whose retrofit she follows, puts a meter next to hers: 32 dB.",
    alt: "A post by Nora Pike, @nora.retrofits: a sound meter reading 32 dB beside her heat pump, and the comments under it.",
    size: { w: 320, h: 400 },
    narrow: { w: 320, h: 400 },
    show: 416,
  },
  {
    key: "film",
    day: "Sun",
    dayName: "Sunday",
    d: 6,
    time: "21:30",
    iso: "2026-03-15T21:30",
    line: "Before her show starts, thirty seconds of Halden, ending on the line from the station.",
    alt: "Halden’s thirty-second film, playing before her show: a woman at a window with a mug, subtitled “Heat, without the noise.”",
    size: { w: 480, h: 270 },
    narrow: { w: 320, h: 240 },
    show: 640,
  },
  {
    key: "book",
    day: "Mon",
    dayName: "Monday",
    d: 7,
    time: "08:02",
    iso: "2026-03-16T08:02",
    line: "Before work, she books a home survey for Thursday.",
    alt: "An email from Halden, “Your home survey is booked”: Thursday 19 March, 10:00 to 11:00, with Priya, a Halden surveyor, and what to expect.",
    size: { w: 320, h: 400 },
    narrow: { w: 320, h: 400 },
    show: 416,
  },
];

/** The week strip: Monday to Sunday, then the Monday she books */
export const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S", "M"] as const;

/**
 * The moment that owns the reading line (a y in the viewport): the one
 * whose box holds it, or, in the space between two, the nearer one. So the
 * story turns over halfway across each gap, as the next tile arrives.
 */
export function momentAt(boxes: readonly { top: number; bottom: number }[], line: number): number {
  let best = 0;
  let near = Infinity;
  boxes.forEach((b, i) => {
    const d = line < b.top ? b.top - line : line > b.bottom ? line - b.bottom : 0;
    if (d < near) {
      near = d;
      best = i;
    }
  });
  return best;
}
