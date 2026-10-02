import fs from "node:fs";
import path from "node:path";
import { HeroMotion, MotionControl, type HeroSource } from "@/components/hero-motion";
import { DistributionWall } from "@/components/hero-wall";
import {
  Accent,
  CONTAINER,
  CtaLink,
  GRID,
  Kicker,
  Meta,
  TextLink,
} from "@/components/system";
import { AUDIT_HREF } from "@/lib/nav";
import { asset } from "@/lib/site";

/*
  Home hero: the red room and the distribution wall.

  Plurel is the creative and distribution division, so the hero shows
  the work traveling: one story, cut for seven surfaces, hanging on a
  flat red wall and drifting past. The hero film plays behind
  everything, softened and graded red, and the film frames on the wall
  mirror it live. The film is picked up from public/video at build time
  (see docs/hero-video.md); until it exists, the film frames show flat
  color stills, so the page is finished either way.
*/

const VIDEO_DIR = path.join(process.cwd(), "public", "video");

const FILES = {
  mp4: "plurel-hero.mp4",
  webm: "plurel-hero.webm",
  mobile: "plurel-hero-mobile.mp4",
  poster: "plurel-hero-poster.jpg",
};

function heroFilm(): { sources: HeroSource[]; poster?: string } | null {
  const has = (file: string) => fs.existsSync(path.join(VIDEO_DIR, file));
  const sources: HeroSource[] = [];
  if (has(FILES.mobile)) {
    sources.push({
      src: asset(`/video/${FILES.mobile}`),
      type: "video/mp4",
      media: "(max-width: 767px)",
    });
  }
  if (has(FILES.webm)) {
    sources.push({ src: asset(`/video/${FILES.webm}`), type: "video/webm" });
  }
  if (has(FILES.mp4)) {
    sources.push({ src: asset(`/video/${FILES.mp4}`), type: "video/mp4" });
  }
  if (!sources.length) return null;
  return {
    sources,
    poster: has(FILES.poster) ? asset(`/video/${FILES.poster}`) : undefined,
  };
}

/** Staggered line reveal: each line rises out of its own mask */
function Line({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em] pr-[0.1em]">
      <span className={`line-rise ${className}`} style={{ animationDelay: `${delay}ms` }}>
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  const film = heroFilm();

  return (
    <HeroMotion
      sources={film?.sources ?? null}
      poster={film?.poster}
      labelledBy="hero-heading"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-brand text-paper"
    >
      {/* The room is flat Plurel red. When the film exists it plays
          behind everything, softened and graded back to the same red. */}
      {film && (
        <>
          <div aria-hidden className="absolute inset-0 z-[2] bg-brand opacity-60 mix-blend-multiply" />
          {/* Film grain lives on the film only, so it reads as shot */}
          <div aria-hidden className="grain pointer-events-none absolute inset-0 z-[2]" />
        </>
      )}

      {/* Statement */}
      <div className={`${CONTAINER} relative z-[4] pt-28 sm:pt-32`}>
        <div className={`${GRID} gap-y-8`}>
          <div className="col-span-4 sm:col-span-6 lg:col-span-8">
            <div className="fade-up" style={{ animationDelay: "60ms" }}>
              <Kicker tone="red">Creative · Content · Distribution</Kicker>
            </div>
            <h1
              id="hero-heading"
              className="mt-7 text-[clamp(3rem,min(8vw,13.5svh),7.25rem)] font-normal leading-[0.9] tracking-[-0.05em] lg:mt-8"
            >
              <Line delay={150}>Made to be seen.</Line>
              <Line delay={290} className="text-blush">
                <Accent>Everywhere.</Accent>
              </Line>
            </h1>
          </div>

          <div
            className="fade-up col-span-4 self-end sm:col-span-5 lg:col-span-4 lg:pb-3"
            style={{ animationDelay: "560ms" }}
          >
            <p className="max-w-[40ch] text-[15px] leading-relaxed text-paper/90 sm:text-[16px] lg:text-[17px]">
              Plurel makes the brand, the film, and the content, then puts it
              in front of the right people: in search, in AI answers, in
              feeds, and in the press. One story, every surface.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-5">
              <CtaLink href={AUDIT_HREF} variant="paper">
                Book a growth audit
              </CtaLink>
              <TextLink href="/work" tone="red">
                See the work
              </TextLink>
            </div>
          </div>
        </div>
      </div>

      {/* The wall, full bleed */}
      <div className="relative z-[4] mt-10 flex flex-1 flex-col justify-end lg:mt-12">
        <DistributionWall film={!!film} />
      </div>

      {/* Running foot */}
      <div className={`${CONTAINER} relative z-[4] pb-5 pt-4`}>
        <div
          className="fade-up flex items-center justify-between gap-6 border-t border-paper/25 pt-4"
          style={{ animationDelay: "900ms" }}
        >
          <Meta className="text-blush">
            One story <span aria-hidden>·</span> seven surfaces{" "}
            <span className="hidden sm:inline">
              <span aria-hidden>·</span> owned, earned, paid
            </span>
          </Meta>
          <MotionControl />
        </div>
      </div>
    </HeroMotion>
  );
}
