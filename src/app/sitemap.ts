import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/contact/`, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${SITE_URL}/methodology/`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/careers/`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    { url: `${SITE_URL}/blog/`, changeFrequency: "weekly", priority: 0.8 },
    ...POSTS.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
