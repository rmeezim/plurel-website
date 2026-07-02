import Link from "next/link";
import { ArrowUpRight, Spark } from "@/components/icons";

const FEATURED = {
  category: "AI Search",
  date: "Jun 12, 2026",
  title: "AEO is the new SEO: how to get chosen by AI assistants",
  excerpt:
    "Customers increasingly ask an assistant instead of a search bar. Here's how to become the answer it gives — and what that changes about content, structure, and proof.",
  readTime: "6 min read",
};

const POSTS = [
  {
    category: "Brand Systems",
    date: "May 28, 2026",
    title: "Your brand isn't a logo — it's an operating system",
    readTime: "5 min read",
    thumb: "brand",
  },
  {
    category: "Growth Strategy",
    date: "May 9, 2026",
    title: "The presence audit: 12 signals customers judge before they call",
    readTime: "8 min read",
    thumb: "growth",
  },
  {
    category: "Martech",
    date: "Apr 22, 2026",
    title: "The minimum viable martech stack for a premium brand",
    readTime: "7 min read",
    thumb: "martech",
  },
  {
    category: "Reputation",
    date: "Apr 3, 2026",
    title: "Reputation compounds: turning press and proof into a moat",
    readTime: "6 min read",
    thumb: "reputation",
  },
] as const;

type Thumb = (typeof POSTS)[number]["thumb"];

function CategoryChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink">
      <Spark className="size-2.5 text-brand" aria-hidden />
      {label}
    </span>
  );
}

/** Small category-themed cover for the compact article rows */
function PostThumb({ kind }: { kind: Thumb }) {
  switch (kind) {
    case "brand":
      return (
        <span className="grid h-full w-full grid-cols-2 gap-1 bg-ink p-1.5">
          <span className="flex items-center justify-center rounded-[5px] bg-brand">
            <Spark className="size-3.5 text-paper" />
          </span>
          <span className="flex items-center justify-center rounded-[5px] bg-paper font-serif text-[11px] leading-none text-ink">
            Aa
          </span>
          <span className="flex items-center justify-center gap-1 rounded-[5px] bg-charcoal">
            <span className="size-1.5 rounded-full bg-clay" />
            <span className="size-1.5 rounded-full bg-paper" />
          </span>
          <span className="rounded-[5px] bg-clay" />
        </span>
      );
    case "growth":
      return (
        <span className="flex h-full w-full items-end gap-1 border border-line bg-paper p-2">
          <span className="h-[30%] flex-1 rounded-t-sm bg-line" />
          <span className="h-[48%] flex-1 rounded-t-sm bg-line" />
          <span className="h-[68%] flex-1 rounded-t-sm bg-clay" />
          <span className="h-full flex-1 rounded-t-sm bg-brand" />
        </span>
      );
    case "martech":
      return (
        <span className="flex h-full w-full flex-col justify-center gap-1.5 bg-charcoal p-2.5">
          <span className="h-2 w-full rounded-full bg-paper/20" />
          <span className="ml-1 h-2 w-[85%] rounded-full bg-clay" />
          <span className="ml-2 h-2 w-[70%] rounded-full bg-brand" />
        </span>
      );
    case "reputation":
      return (
        <span className="block h-full w-full bg-rust p-1">
          <svg viewBox="0 0 64 64" className="h-full w-full">
            <g stroke="#fbfaf6" strokeOpacity="0.4" strokeWidth="1">
              <line x1="32" y1="34" x2="12" y2="14" />
              <line x1="32" y1="34" x2="52" y2="12" />
              <line x1="32" y1="34" x2="54" y2="48" />
              <line x1="32" y1="34" x2="12" y2="50" />
            </g>
            <g fill="#fbfaf6" fillOpacity="0.75">
              <circle cx="12" cy="14" r="2.5" />
              <circle cx="52" cy="12" r="2.5" />
              <circle cx="54" cy="48" r="2.5" />
              <circle cx="12" cy="50" r="2.5" />
            </g>
            <circle cx="32" cy="34" r="5" fill="#110f0a" />
            <circle cx="32" cy="34" r="1.8" fill="#fbfaf6" />
          </svg>
        </span>
      );
  }
}

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

        <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-2">
          {/* Featured article */}
          <Link href="/blog" className="group flex flex-col">
            <span className="relative block overflow-hidden rounded-2xl">
              {/* AI Search cover — query pill, answer lines, rising visibility */}
              <span className="flex aspect-[16/10] flex-col bg-charcoal p-6 pt-16 transition-transform duration-500 group-hover:scale-[1.02]">
                <span className="flex h-10 w-3/4 items-center gap-2.5 rounded-full bg-paper/10 px-4">
                  <span className="size-3 rounded-full border border-paper/50" />
                  <span className="h-1.5 w-28 rounded-full bg-paper/25" />
                </span>
                <span className="mt-4 space-y-2">
                  <span className="block h-1.5 w-1/2 rounded-full bg-paper/20" />
                  <span className="block h-1.5 w-2/5 rounded-full bg-paper/15" />
                </span>
                <span className="mt-auto flex h-1/3 items-end gap-2 self-end w-2/5">
                  {["34%", "52%", "72%", "100%"].map((h, i) => (
                    <span
                      key={h}
                      style={{ height: h }}
                      className={`flex-1 rounded-t-md ${i === 3 ? "bg-brand" : "bg-paper/20"}`}
                    />
                  ))}
                </span>
              </span>
              <span className="absolute left-4 top-4">
                <CategoryChip label={FEATURED.category} />
              </span>
            </span>
            <span className="mt-5 text-[12px] text-muted">
              {FEATURED.date} &middot; {FEATURED.readTime}
            </span>
            <h3 className="mt-2 max-w-[26ch] font-serif text-2xl leading-snug text-ink transition-colors duration-300 group-hover:text-brand sm:text-[28px]">
              {FEATURED.title}
            </h3>
            <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-ink/70">
              {FEATURED.excerpt}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors duration-300 group-hover:text-brand">
              Read article
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </Link>

          {/* Compact index — top-aligned with the featured cover */}
          <ul className="divide-y divide-line lg:self-start">
            {POSTS.map((post, index) => (
              <li key={post.title}>
                <Link
                  href="/blog"
                  className={`group grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-x-5 pb-5 ${
                    index === 0 ? "pt-0" : "pt-5"
                  }`}
                >
                  <span className="block size-[72px] overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-[1.04]">
                    <PostThumb kind={post.thumb} />
                  </span>
                  <span>
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink/70 transition-colors duration-300 group-hover:border-brand group-hover:text-brand">
                        {post.category}
                      </span>
                      <span className="text-[12px] text-muted">
                        {post.date} &middot; {post.readTime}
                      </span>
                    </span>
                    <span className="mt-2 block max-w-[34ch] font-serif text-lg leading-snug text-ink transition-colors duration-300 group-hover:text-brand">
                      {post.title}
                    </span>
                  </span>
                  <span className="inline-flex size-9 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-paper">
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
