import Link from "next/link";
import { Reveal } from "@/components/reveal";
import {
  Accent,
  ChapterHead,
  CONTAINER,
  CtaLink,
  GRID,
  Meta,
} from "@/components/system";
import { MARK_CELLS } from "@/lib/mark";
import { CATEGORIES, POSTS, type Post, type PostBlock, type PostCategory } from "@/lib/posts";

/*
  (06) Journal as a report series: a masthead (nameplate + deck) with a
  key to the five series, a red report plate for the latest field note,
  and the further notes with small paper-tint covers.

  Every cover glyph is the Plurel mark itself (MARK_CELLS, 2:1:4:1:2 on a
  10-unit square) with a topic's cells lit. On hover or keyboard focus a
  plate replays its glyph: the lit cells drop to dim and step back on in
  reading order, 30ms apart. The replay layer only exists under
  motion-safe; reduced motion keeps the lit glyph still.
*/

/** 0 dim, 1 on, 2 hot, per mark cell in reading order */
type CellState = 0 | 1 | 2;

const GLYPHS: Record<PostCategory, readonly CellState[]> = {
  // One answer chosen: the center
  "AI Search": [0, 0, 0, 0, 2, 0, 0, 0, 0],
  // The whole mark: a system
  "Brand Systems": [1, 1, 1, 1, 1, 1, 1, 1, 1],
  // A rising diagonal
  "Growth Strategy": [0, 0, 2, 0, 1, 0, 1, 0, 0],
  // Stacked layers
  Martech: [0, 0, 0, 1, 1, 1, 2, 2, 2],
  // Corners around a lit center
  Reputation: [1, 0, 1, 0, 2, 0, 1, 0, 1],
};

const GLYPH_TONE = {
  paper: { dim: "bg-ink/10", on: "bg-ink", hot: "bg-brand" },
  red: { dim: "bg-ember", on: "bg-ink", hot: "bg-paper" },
} as const;

/* The replay: the resting lit layer steps aside and a second lit layer
   enters from transparent (@starting-style), each after its own delay */
const REST_LAYER =
  "motion-safe:group-hover/note:hidden motion-safe:group-has-[:focus-visible]/note:hidden";
const PLAY_LAYER =
  "hidden transition-opacity duration-150 ease-out starting:opacity-0 motion-safe:group-hover/note:block motion-safe:group-has-[:focus-visible]/note:block";

function Glyph({
  category,
  tone = "paper",
  play = false,
  className = "",
}: {
  category: PostCategory;
  tone?: keyof typeof GLYPH_TONE;
  /** Replay the glyph when the surrounding `group/note` is hovered or focused */
  play?: boolean;
  className?: string;
}) {
  const cells = GLYPHS[category];
  const t = GLYPH_TONE[tone];
  return (
    <span aria-hidden className={`relative block aspect-square shrink-0 ${className}`}>
      {MARK_CELLS.map(([x, y, w, h], i) => {
        const state = cells[i];
        const lit = state === 2 ? t.hot : t.on;
        const step = cells.slice(0, i).filter(Boolean).length;
        return (
          <span
            key={i}
            className={`absolute ${t.dim}`}
            style={{ left: `${x * 10}%`, top: `${y * 10}%`, width: `${w * 10}%`, height: `${h * 10}%` }}
          >
            {state !== 0 && (
              <span className={`absolute inset-0 ${lit} ${play ? REST_LAYER : ""}`} />
            )}
            {state !== 0 && play && (
              <span
                className={`absolute inset-0 ${lit} ${PLAY_LAYER}`}
                style={{ transitionDelay: `${step * 30}ms` }}
              />
            )}
          </span>
        );
      })}
    </span>
  );
}

const serial = (i: number) => `N° ${String(i + 1).padStart(2, "0")}`;

/** The article's own line for the plate: the first two sentences of its pull quote */
function pullLine(post: Post): string | undefined {
  const quote = post.content.find(
    (block): block is Extract<PostBlock, { type: "quote" }> => block.type === "quote",
  );
  if (!quote) return undefined;
  const sentences = quote.text.match(/[^.!?]+[.!?]+/g) ?? [quote.text];
  return sentences.slice(0, 2).join("").trim();
}

/** (06) The journal as a report series */
export function JournalChapter() {
  const [lead, ...further] = POSTS.slice(0, 4);
  const pull = pullLine(lead);

  return (
    <section aria-labelledby="journal-heading" className="bg-paper py-24 text-ink lg:py-36">
      <div className={CONTAINER}>
        <ChapterHead index="06" label="Journal" meta="Notes on staying visible" />

        {/* Masthead: nameplate and deck, with the series key */}
        <div className={`${GRID} mt-12 items-end gap-y-10 lg:mt-16`}>
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-8">
            <h2 id="journal-heading" className="type-display">
              <span className="block text-[clamp(3.5rem,17vw,7.5rem)] leading-[0.95] lg:text-[min(10.6vw,9.5rem)]">
                Field notes
              </span>{" "}
              <span className="mt-3 block text-[clamp(1.5rem,1.1rem+2.4vw,2.75rem)] leading-[1.08] lg:mt-3.5">
                on AI search, brand, and <Accent className="text-muted">growth</Accent>.
              </span>
            </h2>
          </Reveal>

          <Reveal
            delay={0.1}
            className="col-span-4 sm:col-span-6 lg:col-span-3 lg:col-start-10 lg:pb-1"
          >
            <Meta as="p" className="border-b border-ink/15 pb-2.5 text-muted">
              <span id="journal-series">The series</span>
            </Meta>
            <ul
              aria-labelledby="journal-series"
              className="grid grid-cols-2 gap-x-5 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-1"
            >
              {CATEGORIES.map((category) => (
                <li
                  key={category}
                  className="flex items-center gap-3.5 border-b border-ink/8 py-[7px]"
                >
                  <Glyph category={category} className="size-5" />
                  <span className="text-[14px] font-medium leading-[1.5]">{category}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className={`${GRID} mt-14 gap-y-16 lg:mt-18`}>
          {/* The lead: a red report plate for the latest field note */}
          <Reveal className="col-span-4 flex flex-col sm:col-span-6 lg:col-span-7">
            <article className="flex flex-1 flex-col">
              <div className="group/note relative -mx-5 grid aspect-[4/5] grid-rows-[auto_1fr_auto] bg-brand p-5 text-paper sm:mx-0 sm:aspect-[16/9] sm:px-7 sm:pb-7 sm:pt-6 lg:aspect-[677/440] lg:px-8 lg:pb-8 lg:pt-7">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-paper/30 pb-4">
                  <Meta>
                    Field note {serial(0)} <span aria-hidden className="sm:mx-1.5">·</span>{" "}
                    {lead.category}
                  </Meta>
                  <Meta className="shrink-0">{lead.date}</Meta>
                </div>

                <div className="pt-6 sm:pt-8 lg:pt-10">
                  <h3 className="type-display max-w-[13em] text-[clamp(1.875rem,1.2rem+2.1vw,2.75rem)] leading-[1.02]">
                    <Link
                      href={`/blog/${lead.slug}`}
                      className="after:absolute after:inset-0 focus-visible:outline-hidden focus-visible:after:outline-2 focus-visible:after:-outline-offset-8 focus-visible:after:outline-paper"
                    >
                      {lead.title}
                    </Link>
                  </h3>
                  {pull && (
                    <p className="mt-4 max-w-[24em] -indent-[0.42em] text-[clamp(1.0625rem,0.95rem+0.4vw,1.25rem)] leading-[1.35] lg:mt-5.5">
                      &ldquo;{pull}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-end justify-between gap-6 pt-6">
                  <Meta>
                    Plurel Journal <span aria-hidden className="sm:mx-1.5">·</span>{" "}
                    {lead.readTime}
                  </Meta>
                  <Glyph
                    category={lead.category}
                    tone="red"
                    play
                    className="size-[72px] lg:size-[clamp(5.5rem,8.75vw,7rem)]"
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between gap-7 pt-7">
                <p className="max-w-[34em] text-[clamp(1rem,0.95rem+0.2vw,1.0625rem)] leading-[1.55] text-muted">
                  {lead.excerpt}
                </p>
                <CtaLink href={`/blog/${lead.slug}`} className="w-full sm:w-[17rem]">
                  Read the essay<span className="sr-only">: {lead.title}</span>
                </CtaLink>
              </div>
            </article>
          </Reveal>

          {/* Further field notes, each under a small mark cover */}
          <Reveal
            delay={0.1}
            className="col-span-4 flex flex-col sm:col-span-6 lg:col-span-5 lg:col-start-8"
          >
            <h3>
              <Meta className="block border-b border-ink pb-3 text-muted">Further field notes</Meta>
            </h3>
            <ol className="flex-1">
              {further.map((post, i) => (
                <li key={post.slug} className="group/note border-b border-ink/15">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="grid grid-cols-[88px_minmax(0,1fr)] gap-x-5 py-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:grid-cols-[152px_minmax(0,1fr)] sm:gap-x-6 sm:py-6 lg:grid-cols-[clamp(7.5rem,11.9vw,9.5rem)_minmax(0,1fr)]"
                  >
                    <span
                      aria-hidden
                      className="relative flex aspect-square self-start items-end justify-end bg-ink/5 p-2 sm:aspect-[152/118] sm:p-3"
                    >
                      <Meta className="absolute left-2.5 top-2 text-muted">{serial(i + 1)}</Meta>
                      <Glyph category={post.category} play className="size-10 sm:size-[60px]" />
                    </span>
                    <div className="pt-px">
                      <Meta className="flex flex-wrap gap-x-3.5 text-muted">
                        <span className="text-ink">{post.category}</span>
                        <span>{post.date}</span>
                      </Meta>
                      <h4 className="mt-2.5 text-[clamp(1rem,0.85rem+0.5vw,1.1875rem)] font-medium leading-[1.25] tracking-[-0.01em] transition-colors duration-300 group-hover/note:text-brand">
                        {post.title}
                      </h4>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
            <CtaLink href="/blog" variant="outline" className="mt-7 w-full">
              All entries
            </CtaLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
