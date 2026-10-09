import fs from "node:fs";
import path from "node:path";
import { CHANNELS, type ChannelClips } from "@/lib/channels";
import { asset } from "@/lib/site";

/*
  Real footage for the channel tiles, picked up from public/video/channels
  at build time (server only, like lib/film.ts): <key>.mp4 and an optional
  <key>.jpg poster for each key in CHANNELS. A tile with a clip plays it,
  muted and looped, over its drawn recording; a tile without one keeps the
  drawing, so the page is finished either way. A clip is fetched only once
  its tile plays (preload none: never under reduced motion, data saver or
  the static still), so a still frame shows the poster when there is one
  and the drawing under it when there is not.
*/

const DIR = path.join(process.cwd(), "public", "video", "channels");

export function channelClips(): ChannelClips {
  const has = (file: string) => fs.existsSync(path.join(DIR, file));
  const clips: ChannelClips = {};
  for (const { key } of CHANNELS) {
    if (!has(`${key}.mp4`)) continue;
    clips[key] = has(`${key}.jpg`)
      ? { src: asset(`/video/channels/${key}.mp4`), poster: asset(`/video/channels/${key}.jpg`) }
      : { src: asset(`/video/channels/${key}.mp4`) };
  }
  return clips;
}
