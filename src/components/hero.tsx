import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { HeroMedia, type HeroSource } from "@/components/hero-media";
import {
  Accent,
  CONTAINER,
  CtaLink,
  GRID,
  GridGuides,
  Kicker,
  Meta,
  TextLink,
} from "@/components/system";
import { AUDIT_HREF } from "@/lib/nav";
import { asset } from "@/lib/site";

/*
  Home hero: Cinematic Red x Swiss Systems, in the Northeon family layout.

  A looping film fills the frame, graded red; the Swiss grid draws in over
  it; the headline rises line by line. The film is picked up from
  public/video at build time (see docs/hero-video.md). Until it exists,
  the hero plays a drifting-light red scene, so the page is finished
  either way.
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

/** Stand-in scene: warm light drifting through a red room */
function FallbackScene() {
  return (
    <div aria-hidden className="hero-scene absolute inset-0 z-0 overflow-hidden">
      <div className="hero-scene-light scene-drift-a absolute left-[38%] top-[-10%] h-[110%] w-[70%]" />
      <div className="hero-scene-light scene-drift-b absolute -left-[15%] top-[35%] h-[90%] w-[55%] opacity-50" />
      <div className="hero-scene-sweep scene-sweep absolute inset-y-0 -left-1/4 w-[150%]" />
    </div>
  );
}

const INDEX = [
  { label: "Brand identity", href: "/services/brand-identity" },
  { label: "Websites", href: "/services/website-design" },
  { label: "AI search & SEO", href: "/services/aeo-seo" },
  { label: "Content & PR", href: "/services/content-marketing" },
  { label: "Growth systems", href: "/services/martech-consulting" },
];

const INDEX_VISIBILITY = [
  "block",
  "block",
  "hidden sm:block",
  "hidden lg:block",
  "hidden lg:block",
];

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
    <span className="-mb-[0.1em] block overflow-hidden pb-[0.1em] pr-[0.08em]">
      <span
        className={`line-rise ${className}`}
        style={{ animationDelay: `${delay}ms` }}
      >
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  const film = heroFilm();

  return (
    <section
      aria-labelledby="hero-heading"
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-oxblood text-paper"
    >
      <FallbackScene />
      {film && <HeroMedia sources={film.sources} poster={film.poster} />}

      {/* Grade and legibility: red multiply over the film, then shade
          toward the copy column and the floor */}
      {film && (
        <div aria-hidden className="absolute inset-0 z-[1] bg-brand opacity-45 mix-blend-multiply" />
      )}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] bg-gradient-to-r from-oxblood/90 via-oxblood/50 to-transparent lg:via-oxblood/35"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-[1] h-1/2 bg-gradient-to-t from-oxblood/85 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-[1] h-40 bg-gradient-to-b from-black/35 to-transparent"
      />
      <GridGuides tone="dark" animated className="z-[1]" />

      {/* Copy */}
      <div
        className={`${CONTAINER} relative z-[2] flex flex-1 flex-col justify-end pb-8 pt-32 sm:pb-10 lg:pb-10 lg:pt-36`}
      >
        <div className={`${GRID} gap-y-10`}>
          <div className="col-span-4 sm:col-span-6 lg:col-span-9">
            <div className="fade-up" style={{ animationDelay: "60ms" }}>
              <Kicker tone="red">Creative &amp; growth partner</Kicker>
            </div>

            <h1
              id="hero-heading"
              className="mt-8 text-[clamp(3rem,7.4vw,7.5rem)] font-normal leading-[0.92] tracking-[-0.045em] lg:mt-10"
            >
              <Line delay={150}>We build the</Line>
              <Line delay={270}>
                <Accent>visible</Accent> layer
              </Line>
              <Line delay={390} className="text-blush/75">
                of growth.
              </Line>
            </h1>

            <span
              aria-hidden
              className="rule-draw mt-8 block h-[2px] w-14 bg-signal lg:mt-9"
              style={{ animationDelay: "650ms" }}
            />

            <p
              className="fade-up mt-7 max-w-[52ch] text-[17px] leading-relaxed text-paper/80 lg:text-[19px]"
              style={{ animationDelay: "700ms" }}
            >
              Plurel is Northeon&apos;s creative and growth division. We design
              the brand, website, and AI-search presence that make you easy to
              find, trust, and choose, then wire the growth system underneath.
            </p>

            <div
              className="fade-up mt-9 flex flex-wrap items-center gap-x-10 gap-y-6"
              style={{ animationDelay: "820ms" }}
            >
              <CtaLink href={AUDIT_HREF}>Book a growth audit</CtaLink>
              <TextLink href="/work" tone="dark">
                See the work
              </TextLink>
            </div>
          </div>

          <div
            className="fade-up hidden self-end lg:col-span-3 lg:block"
            style={{ animationDelay: "980ms" }}
          >
            <Kicker tone="dark">The growth audit</Kicker>
            <p className="mt-4 max-w-[30ch] text-[15px] leading-relaxed text-paper/70">
              Six dimensions. About one business day. A prioritized read on
              your presence, from a strategist.
            </p>
          </div>
        </div>

        {/* Swiss index of the disciplines */}
        <nav
          aria-label="Disciplines"
          className={`${GRID} fade-up mt-12 border-t border-paper/20 pt-4 lg:mt-14`}
          style={{ animationDelay: "1100ms" }}
        >
          {INDEX.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group col-span-2 ${INDEX_VISIBILITY[i]}`}
            >
              <Meta className="text-blush/70 transition-colors group-hover:text-paper">
                ({String(i + 1).padStart(2, "0")})
              </Meta>
              <span className="mt-1 block text-[14px] text-paper/85 transition-colors group-hover:text-paper">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
