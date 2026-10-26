import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/posts";
import { PACKAGES, SERVICES } from "@/lib/nav";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

type Entry = MetadataRoute.Sitemap[number];
const page = (path: string, changeFrequency: Entry["changeFrequency"], priority: number): Entry => ({
  url: `${SITE_URL}${path}`,
  changeFrequency,
  priority,
});

/* The site in the order it tells its story: the packages and services,
   how it runs, who it is for, the way in, the firm, the journal, then the
   fine print. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    page("/", "weekly", 1),
    page("/services/", "monthly", 0.9),
    ...PACKAGES.map((p) => page(`/services/${p.key}/`, "monthly", 0.8)),
    ...SERVICES.map((s) => page(`/services/${s.slug}/`, "monthly", 0.7)),
    page("/method/", "monthly", 0.8),
    page("/industries/", "monthly", 0.8),
    page("/diagnostic/", "monthly", 0.9),
    page("/diagnostic/sample/", "monthly", 0.7),
    page("/about/", "monthly", 0.7),
    page("/contact/", "yearly", 0.6),
    page("/journal/", "weekly", 0.7),
    ...POSTS.map((post) => page(`/journal/${post.slug}/`, "monthly", 0.6)),
    page("/privacy/", "yearly", 0.2),
    page("/terms/", "yearly", 0.2),
  ];
}
