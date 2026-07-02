import Link from "next/link";
import { ArrowUpRight, Spark } from "@/components/icons";

const POSTS = [
  {
    category: "AI & Search",
    date: "Jun 12, 2026",
    title: "AEO is the new SEO: how to get chosen by AI assistants",
    excerpt:
      "Customers increasingly ask an assistant instead of a search bar. Here's how to become the answer it gives.",
    readTime: "6 min read",
  },
  {
    category: "Web Design",
    date: "May 28, 2026",
    title: "Your website isn't a brochure — it's your best salesperson",
    excerpt:
      "The difference between a site that describes you and one that converts for you, in five decisions.",
    readTime: "4 min read",
  },
  {
    category: "Brand",
    date: "May 9, 2026",
    title: "The presence audit: 12 signals customers judge before they call",
    excerpt:
      "What prospects actually check in the first ninety seconds — and how to pass every test.",
    readTime: "8 min read",
  },
] as const;

export function JournalSection() {
  return (
    <section
      id="journal"
      aria-labelledby="journal-heading"
      className="border-t border-line"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              <Spark className="size-3.5 text-brand" aria-hidden />
              Journal
            </p>
            <h2
              id="journal-heading"
              className="mt-5 font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
            >
              Notes on staying{" "}
              <em className="font-serif italic">visible</em>.
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-brand"
          >
            All articles
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Posts */}
        <ul className="mt-12 grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-8">
          {POSTS.map((post) => (
            <li key={post.title} className="border-t border-line">
              <Link href="/blog" className="group flex h-full flex-col pt-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em]">
                  <span className="text-brand">{post.category}</span>
                  <span className="text-muted"> &middot; {post.date}</span>
                </p>
                <h3 className="mt-4 max-w-[24ch] font-serif text-[22px] leading-snug text-ink transition-colors duration-300 group-hover:text-brand sm:text-2xl">
                  {post.title}
                </h3>
                <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-ink/70">
                  {post.excerpt}
                </p>
                <span className="mt-6 flex items-center justify-between pt-2 md:mt-auto">
                  <span className="text-[13px] text-muted">{post.readTime}</span>
                  <span className="inline-flex size-9 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-paper">
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
