import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import {
  Accent,
  ChapterHead,
  CONTAINER,
  GRID,
  GridGuides,
  Meta,
  TextLink,
} from "@/components/system";
import { POSTS } from "@/lib/posts";

/** (06) The journal as a dated index */
export function JournalChapter() {
  const posts = POSTS.slice(0, 4);
  return (
    <section
      aria-labelledby="journal-heading"
      className="relative bg-paper text-ink"
    >
      <GridGuides tone="paper" />
      <div className={`${CONTAINER} relative pt-24 lg:pt-36`}>
        <ChapterHead index="06" label="Journal" meta="Notes on staying visible" />
        <div className={`${GRID} mt-14 gap-y-10 lg:mt-20`}>
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-8">
            <h2
              id="journal-heading"
              className="text-[clamp(2.25rem,5vw,5rem)] font-normal leading-[0.98] tracking-[-0.04em]"
            >
              Field notes on AI search, brand, and <Accent>growth</Accent>.
            </h2>
          </Reveal>
          <Reveal
            delay={0.1}
            className="col-span-4 self-end sm:col-span-4 lg:col-span-3 lg:col-start-10"
          >
            <TextLink href="/blog">All entries</TextLink>
          </Reveal>
        </div>
      </div>

      <ul className="relative mt-16 border-b border-ink/15 lg:mt-24">
        {posts.map((post) => (
          <li key={post.slug} className="border-t border-ink/15">
            <Link href={`/blog/${post.slug}`} className="group block">
              <span className={`${CONTAINER} block`}>
                <span className={`${GRID} items-baseline gap-y-2 py-6 lg:py-8`}>
                  <Meta className="col-span-2 text-muted lg:col-span-2">{post.date}</Meta>
                  <Meta className="col-span-2 text-brand sm:col-span-4 lg:col-span-2">
                    {post.category}
                  </Meta>
                  <span className="col-span-4 text-[clamp(1.25rem,2.2vw,1.875rem)] leading-[1.15] tracking-[-0.02em] transition-colors group-hover:text-brand sm:col-span-5 lg:col-span-6">
                    {post.title}
                  </span>
                  <span className="hidden items-center justify-end gap-4 sm:col-span-1 sm:flex lg:col-span-2">
                    <Meta className="hidden text-muted lg:inline">{post.readTime}</Meta>
                    <ArrowUpRight className="size-5 text-ink/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
