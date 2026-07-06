import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cascade } from "@/components/cascade";
import { ArrowUpRight, Spark } from "@/components/icons";
import { PostCover } from "@/components/post-cover";
import { getPost, getRelatedPosts, POSTS, type PostBlock } from "@/lib/posts";

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return { title: "Article — Plurel Journal" };
  return {
    title: `${post.title} — Plurel Journal`,
    description: post.excerpt,
  };
}

function ArticleBlock({ block }: { block: PostBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-12 text-2xl font-medium tracking-[-0.01em] text-ink">
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p className="mt-6 text-[17px] leading-[1.75] text-ink/80">
          {block.text}
        </p>
      );
    case "quote":
      return (
        <blockquote className="my-10 border-l-2 border-brand pl-6 font-serif text-2xl italic leading-snug text-ink sm:pl-8">
          {block.text}
        </blockquote>
      );
    case "list":
      return (
        <ul className="mt-6 space-y-3">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-[17px] leading-relaxed text-ink/80"
            >
              <span
                aria-hidden
                className="mt-[11px] size-1.5 shrink-0 rounded-full bg-brand"
              />
              {item}
            </li>
          ))}
        </ul>
      );
  }
}

export default async function ArticlePage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = getRelatedPosts(slug);

  return (
    <main>
      {/* Article header */}
      <article>
        <div className="mx-auto w-full max-w-[1440px] px-5 pt-10 sm:px-8 lg:px-12 lg:pt-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted transition-colors hover:text-brand"
          >
            &larr; All articles
          </Link>

          <header className="mt-8 max-w-[860px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em]">
              <span className="text-brand">{post.category}</span>
              <span className="text-muted">
                {" "}
                &middot; {post.date} &middot; {post.readTime}
              </span>
            </p>
            <h1 className="mt-4 font-serif text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.12] text-ink">
              <Cascade text={post.title} base={0.08} step={0.03} />
            </h1>
            <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-ink/70">
              {post.excerpt}
            </p>
            <div className="mt-7 flex items-center gap-3 border-t border-line pt-6">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-charcoal">
                <Spark className="size-4 text-brand" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-medium text-ink">
                  Plurel Strategy Team
                </span>
                <span className="block text-[13px] text-muted">
                  The Journal
                </span>
              </span>
            </div>
          </header>

          {/* Cover band */}
          <div
            aria-hidden
            className="mt-10 overflow-hidden rounded-2xl border border-line"
          >
            <div className="aspect-[16/10] sm:aspect-[21/9]">
              <PostCover kind={post.cover} />
            </div>
          </div>

          {/* Body */}
          <div className="mx-auto max-w-[720px] pb-4 pt-6 sm:pt-10">
            {post.content.map((block, index) => (
              <ArticleBlock key={index} block={block} />
            ))}

            {/* End matter */}
            <div className="mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-line pt-6">
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                <Spark className="size-3 text-brand" aria-hidden />
                {post.category} &middot; Plurel Journal
              </p>
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-brand"
              >
                All articles
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related reading */}
      <section aria-label="Related articles" className="border-t border-line">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <h2 className="font-sans text-2xl font-normal tracking-[-0.01em] text-ink sm:text-3xl">
              Keep <em className="italic">reading</em>.
            </h2>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/blog/${item.slug}`}
                  className="group grid grid-cols-[96px_minmax(0,1fr)] items-center gap-x-5"
                >
                  <span
                    aria-hidden
                    className="block overflow-hidden rounded-xl border border-line"
                  >
                    <span className="block aspect-square transition-transform duration-300 group-hover:scale-[1.04]">
                      <PostCover kind={item.cover} />
                    </span>
                  </span>
                  <span>
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em]">
                      <span className="text-brand">{item.category}</span>
                      <span className="text-muted"> &middot; {item.readTime}</span>
                    </span>
                    <span className="mt-1.5 block max-w-[30ch] font-serif text-lg leading-snug text-ink transition-colors duration-300 group-hover:text-brand">
                      {item.title}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Put it to work */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 rounded-2xl bg-charcoal p-7 text-paper sm:p-9">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
                <Spark className="size-3 text-brand" aria-hidden />
                Put it to work
              </p>
              <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-paper/85">
                Wondering what this looks like for your business? A growth
                audit answers it with your numbers, not ours.
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-[#a8302c]"
            >
              Book Growth Audit
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
