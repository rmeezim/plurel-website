/**
 * Canonical site origin for absolute URLs (metadata, JSON-LD, sitemap).
 * The GitHub Pages preview lives under a project subpath; the production
 * domain takes over when the site moves to plurel.com.
 */
export const SITE_URL =
  process.env.GITHUB_PAGES === "true"
    ? "https://rmeezim.github.io/plurel-website"
    : "https://plurel.com";
