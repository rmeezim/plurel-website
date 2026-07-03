import type { Metadata } from "next";
import { Cascade } from "@/components/cascade";
import { Spark } from "@/components/icons";
import { BlogIndex } from "@/components/blog-index";
import { POSTS } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Journal — Plurel",
  description:
    "Notes on staying visible: AI search, brand systems, growth strategy, martech, and reputation — Plurel's point of view on the visible layer of growth.",
};

export default function BlogPage() {
  return (
    <main>
      {/* Page hero */}
      <section aria-labelledby="journal-heading">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-10 pt-12 sm:px-8 lg:px-12 lg:pb-12 lg:pt-20">
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            <Spark className="size-3.5 text-brand" aria-hidden />
            The Journal
          </p>
          <h1
            id="journal-heading"
            className="mt-5 max-w-[16ch] font-sans text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-[1.02] tracking-[-0.02em] text-ink"
          >
            <Cascade text="Notes on staying" base={0.08} step={0.045} />{" "}
            <em className="font-serif italic">
              <Cascade text="visible." base={0.08} step={0.045} offset={3} />
            </em>
          </h1>
          <p className="mt-6 max-w-[54ch] text-[15px] leading-relaxed text-ink/80 sm:text-base">
            A point of view on the visible layer of growth &mdash; AI search,
            brand systems, growth strategy, martech, and reputation. Written
            from client work, not theory.
          </p>
        </div>
      </section>

      {/* Filterable index */}
      <section aria-label="All articles" className="border-t border-line">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          <BlogIndex posts={POSTS} />
        </div>
      </section>
    </main>
  );
}
