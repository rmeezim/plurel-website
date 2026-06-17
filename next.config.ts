import type { NextConfig } from "next";

// The site is served from https://<owner>.github.io/plurel-website/ on GitHub
// Pages, so we need a basePath + static export. This is gated behind the
// GITHUB_PAGES env var (set only in the Pages workflow) so local `dev`/`build`
// stay completely normal.
const repo = "plurel-website";
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = isGithubPages
  ? {
      output: "export",
      trailingSlash: true,
      images: { unoptimized: true },
      basePath: `/${repo}`,
    }
  : {};

export default nextConfig;
