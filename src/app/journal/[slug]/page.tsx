import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "@/components/icons";
import { Closing } from "@/components/page";
import { Reveal } from "@/components/reveal";
import { CONTAINER, CtaLink, GRID } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import { pageMetadata } from "@/lib/metadata";
import { AUDIT_HREF } from "@/lib/nav";
import { plotEnd } from "@/lib/plot";
import { getPost, getRelatedPosts, POSTS, type PostBlock } from "@/lib/posts";

/*
  An essay (app/journal/[slug]), set for reading in the graphite room: the
  title plotted on load, its category, length and line beside it, then a
  single column at a reading measure (paper at 18px, 1.7), quotes set
  large on a signal rule, lists on small squares. Then two more essays
  and the closing.
*/

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: `${post.title} — Plurel Journal`,
    description: post.excerpt,
    path: `/journal/${post.slug}/`,
    type: "article",
  });
}

function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="type-title mt-14 text-[clamp(1.5rem,1.25rem+0.9vw,2rem)] leading-[1.15]">{block.text}</h2>;
    case "p":
      return <p className="mt-6 text-[18px] leading-[1.7] text-paper/90">{block.text}</p>;
    case "quote":
      return (
        <blockquote className="type-title my-12 border-l-2 border-signal pl-6 text-[clamp(1.5rem,1.2rem+1vw,2.125rem)] leading-[1.2] sm:pl-8">
          {block.text}
        </blockquote>
      );
    case "list":
      return (
        <ul className="mt-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3.5 text-[18px] leading-[1.6] text-paper/90">
              <span aria-hidden className="mt-[11px] size-[6px] shrink-0 bg-signal" />
              {item}
            </li>
          ))}
        </ul>
      );
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = getRelatedPosts(slug);
  // the title is plotted a little faster than a page head (it is longer);
  // its line and length light as the pen lifts
  const PACE = 14;
  const lit = plotEnd([post.title], PACE, 160) + 100;

  return (
    <main data-room="dark" className="bg-graphite text-paper">
      <article aria-labelledby="article-heading">
        <div className={`${CONTAINER} pb-16 pt-32 sm:pt-36 lg:pb-20 lg:pt-44`}>
          <div className={`${GRID} gap-y-8 lg:items-end`}>
            <div className="col-span-4 sm:col-span-6 lg:col-span-8">
              <TypeReveal
                as="h1"
                id="article-heading"
                onLoad
                delay={160}
                pace={PACE}
                className="type-display text-[clamp(2.25rem,1.5rem+2.8vw,4.25rem)] leading-[1.02]"
                lines={[post.title]}
              />
            </div>
            <div
              className="fade-in col-span-4 sm:col-span-5 lg:col-span-4 lg:col-start-9 lg:pb-1.5"
              style={{ animationDelay: `${Math.round(lit)}ms` }}
            >
              <p className="max-w-[40ch] text-[17px] leading-[1.55] text-fog">{post.excerpt}</p>
              <p className="mt-4 text-[14px] text-fog">
                {post.category}, {post.readTime}
              </p>
            </div>
          </div>
        </div>

        <div className={`${CONTAINER} pb-24 lg:pb-32`}>
          <div className={`${GRID} border-t border-paper/15 pt-4`}>
            <div className="col-span-4 sm:col-span-6 lg:col-span-7 lg:col-start-4">
              <div className="max-w-[68ch]">
                {post.content.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>

      <section aria-labelledby="more-heading" className="border-t border-paper/10">
        <div className={`${CONTAINER} py-20 lg:py-28`}>
          <h2 id="more-heading" className="type-title text-[clamp(1.5rem,1.2rem+1vw,2.125rem)] leading-[1.12]">
            Keep reading
          </h2>
          <Reveal className="mt-8 border-b border-paper/15">
            <ul>
              {related.map((item) => (
                <li key={item.slug} className="border-t border-paper/15">
                  <Link href={`/journal/${item.slug}`} className={`group ${GRID} gap-y-2 py-6`}>
                    <p className="col-span-4 text-[14px] text-fog sm:col-span-6 lg:col-span-3">{item.category}</p>
                    <p className="type-title col-span-4 text-[clamp(1.25rem,1.1rem+0.6vw,1.625rem)] leading-[1.2] transition-colors group-hover:text-signal sm:col-span-6 lg:col-span-7 lg:col-start-4">
                      {item.title}
                    </p>
                    <span aria-hidden className="hidden justify-self-end lg:col-span-2 lg:block">
                      <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="mt-8">
            <Link href="/journal" className="text-[15px] font-medium underline decoration-signal underline-offset-4 hover:text-signal">
              All essays
            </Link>
          </Reveal>
        </div>
      </section>

      <Closing lines={["Find out where", "you stand."]}>
        <CtaLink href={AUDIT_HREF} variant="paper">
          Request a diagnostic
        </CtaLink>
      </Closing>
    </main>
  );
}
