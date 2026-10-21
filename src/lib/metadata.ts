import type { Metadata } from "next";

/** The homepage's metadata, which the root layout also uses as its defaults */
export const HOME = {
  title: "Plurel — Distribution engineering for growth-stage companies",
  description:
    "Plurel is a distribution engineering firm. One team runs narrative, brand, website, AI search and SEO, content and creators, paid, PR and measurement as one system, for consumer brands, physical products, B2B technology and apps.",
  social:
    "Your marketing shouldn't be ten companies. At Plurel, one team works from the same brief on every relevant channel and answers for one number, agreed on day one.",
};

/** The social card every page shares (public/og.png) */
const CARD = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Plurel: distribution engineering for growth-stage companies",
};

/**
 * A page's metadata: its title and description, its own canonical URL and
 * its own social card. Next merges metadata shallowly, so a page that set
 * only a title would inherit the homepage's canonical and card; every page
 * builds its metadata here instead. `path` ends in a slash, as the static
 * export serves it (the homepage is "/").
 */
export function pageMetadata({
  title,
  description,
  path,
  social = description,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  /** The card's line, when it should differ from the description */
  social?: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: "Plurel",
      title,
      description: social,
      url: path,
      images: [CARD],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: social,
      images: [CARD.url],
    },
  };
}
