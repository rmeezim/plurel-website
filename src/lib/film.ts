import fs from "node:fs";
import path from "node:path";
import { asset } from "@/lib/site";

/*
  The Higgsfield film (see docs/hero-video.md), picked up from public/video
  at build time. Until the files exist this returns null and the glass
  shows its stand-in film, so the page is finished either way.
*/

export type FilmSource = { src: string; type: string; media?: string };
export type Film = { sources: FilmSource[]; poster?: string } | null;

const VIDEO_DIR = path.join(process.cwd(), "public", "video");
const FILES = {
  mp4: "plurel-hero.mp4",
  webm: "plurel-hero.webm",
  mobile: "plurel-hero-mobile.mp4",
  poster: "plurel-hero-poster.jpg",
};

export function heroFilm(): Film {
  const has = (file: string) => fs.existsSync(path.join(VIDEO_DIR, file));
  const sources: FilmSource[] = [];
  if (has(FILES.mobile)) sources.push({ src: asset(`/video/${FILES.mobile}`), type: "video/mp4", media: "(max-width: 767px)" });
  if (has(FILES.webm)) sources.push({ src: asset(`/video/${FILES.webm}`), type: "video/webm" });
  if (has(FILES.mp4)) sources.push({ src: asset(`/video/${FILES.mp4}`), type: "video/mp4" });
  if (!sources.length) return null;
  return { sources, poster: has(FILES.poster) ? asset(`/video/${FILES.poster}`) : undefined };
}
