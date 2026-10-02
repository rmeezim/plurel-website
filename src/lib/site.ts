/**
 * Canonical site origin for absolute URLs (metadata, JSON-LD, sitemap).
 * The GitHub Pages preview lives under a project subpath; the production
 * domain takes over when the site moves to plurel.com.
 */
export const SITE_URL =
  process.env.GITHUB_PAGES === "true"
    ? "https://rmeezim.github.io/plurel-website"
    : "https://plurel.com";

/**
 * Path prefix for raw files in /public (video, posters). next/link and
 * next/image add the GitHub Pages basePath themselves; plain <video> and
 * <a href> to a file do not, so they go through `asset()`.
 */
export const BASE_PATH = process.env.GITHUB_PAGES === "true" ? "/plurel-website" : "";

export function asset(path: string) {
  return `${BASE_PATH}${path}`;
}

/** Where Plurel works from; drives the live clocks in the header and footer */
export const STUDIO_CITY = { name: "New York", timeZone: "America/New_York" };
