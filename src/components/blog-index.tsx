"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { PostCover } from "@/components/post-cover";
import { CATEGORIES, type Post, type PostCategory } from "@/lib/posts";

type Filter = "All" | PostCategory;

export function BlogIndex({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<Filter>("All");

  const filtered =
    filter === "All" ? posts : posts.filter((post) => post.category === filter);
  const featured = filter === "All" ? filtered[0] : null;
  const rest = featured ? filtered.slice(1) : filtered;

  return (
    <div>
      {/* Category filter */}
      <div
        role="group"
        aria-label="Filter articles by category"
        className="flex flex-wrap gap-2"
      >
        {(["All", ...CATEGORIES] as Filter[]).map((category) => {
          const active = filter === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${
                active
                  ? "border-brand bg-brand text-paper"
                  : "border-line text-ink/80 hover:border-brand hover:text-brand"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Featured (All view only) */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group mt-10 grid grid-cols-1 gap-x-12 gap-y-6 border-t border-line pt-10 lg:grid-cols-2 lg:items-center"
        >
          <span
            aria-hidden
            className="block overflow-hidden rounded-2xl border border-line"
          >
            <span className="block aspect-[16/10] transition-transform duration-500 group-hover:scale-[1.02]">
              <PostCover kind={featured.cover} />
            </span>
          </span>
          <span>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em]">
              <span className="text-brand">{featured.category}</span>
              <span className="text-muted">
                {" "}
                &middot; {featured.date} &middot; {featured.readTime}
              </span>
            </span>
            <span className="mt-3 block max-w-[24ch] font-serif text-[clamp(1.6rem,3vw,2.4rem)] leading-snug text-ink transition-colors duration-300 group-hover:text-brand">
              {featured.title}
            </span>
            <span className="mt-4 block max-w-[54ch] text-[15px] leading-relaxed text-ink/70">
              {featured.excerpt}
            </span>
            <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors duration-300 group-hover:text-brand">
              Read article
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </span>
        </Link>
      )}

      {/* Grid */}
      <ul
        className={`mt-10 grid grid-cols-1 gap-x-8 gap-y-12 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3 ${
          featured ? "" : ""
        }`}
      >
        {rest.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
              <span
                aria-hidden
                className="block overflow-hidden rounded-2xl border border-line"
              >
                <span className="block aspect-[16/10] transition-transform duration-500 group-hover:scale-[1.03]">
                  <PostCover kind={post.cover} />
                </span>
              </span>
              <span className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em]">
                <span className="text-brand">{post.category}</span>
                <span className="text-muted">
                  {" "}
                  &middot; {post.date} &middot; {post.readTime}
                </span>
              </span>
              <span className="mt-2 block max-w-[26ch] font-serif text-xl leading-snug text-ink transition-colors duration-300 group-hover:text-brand">
                {post.title}
              </span>
              <span className="mt-5 flex flex-1 items-end justify-between gap-4 pt-1">
                <span className="text-[13px] text-muted">Read article</span>
                <span className="inline-flex size-9 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-paper">
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-10 border-t border-line pt-10 text-[15px] text-muted">
          No articles in this category yet.
        </p>
      )}
    </div>
  );
}
