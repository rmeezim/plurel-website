import type { ReactNode } from "react";
import { FilmCanvas } from "@/components/hero-motion";

/*
  The distribution wall: one story, cut for every surface it ships to.
  Seven prints hang on the red wall, bottom-aligned like a contact sheet,
  and drift slowly left. Film frames mirror the hero film live; the rest
  are the surfaces a Plurel brand earns: a search result, an AI answer,
  a press feature. Every size is in `--u` units (globals.css: .wall), so
  the whole wall scales as one piece from phone to desktop. Type inside a
  frame is in em, off the frame's own font-size.
*/

type FrameProps = {
  index: string;
  caption: string;
  channel: string;
  w: number;
  h: number;
  className?: string;
  children: ReactNode;
};

function Frame({ index, caption, channel, w, h, className = "", children }: FrameProps) {
  return (
    <figure className="m-0 shrink-0" style={{ width: `calc(var(--u) * ${w})` }}>
      <div
        className={`relative overflow-hidden shadow-[0_18px_40px_-24px_rgba(42,13,11,0.6)] ${className}`}
        style={{ height: `calc(var(--u) * ${h})`, fontSize: "calc(var(--u) * 14)" }}
      >
        {children}
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.06em] text-blush/85 lg:text-[11px]">
        <span className="truncate">
          ({index}) {caption}
        </span>
        <span className="shrink-0 text-paper/60">{channel}</span>
      </figcaption>
    </figure>
  );
}

/**
 * A film print: a flat color still until the Higgsfield film exists, then
 * the live film cropped around `focus`, with film grain on the film only.
 * `still` is a background utility.
 */
function Media({
  film,
  focus,
  still,
}: {
  film: boolean;
  focus: { x: number; y: number };
  still: string;
}) {
  return (
    <>
      <div aria-hidden className={`absolute inset-0 ${still}`} />
      {film && (
        <>
          <FilmCanvas focus={focus} />
          <span aria-hidden className="grain pointer-events-none absolute inset-0 z-0" />
        </>
      )}
    </>
  );
}

function Avatar() {
  return (
    <span
      aria-hidden
      className="inline-block size-[1.9em] shrink-0 rounded-full bg-brand ring-[0.15em] ring-paper/90"
    />
  );
}

function Reel({ film }: { film: boolean }) {
  return (
    <Frame index="01" caption="Reel · 9:16" channel="Social" w={200} h={356} className="bg-oxblood text-paper">
      <Media film={film} focus={{ x: 0.5, y: 0.35 }} still="bg-ember" />
      {film && <div className="absolute inset-0 bg-ink/25" />}
      <div className="absolute inset-x-[0.8em] top-[0.8em] flex gap-[0.3em]">
        <span className="h-[2px] flex-1 bg-paper" />
        <span className="relative h-[2px] flex-1 bg-paper/35">
          <span className="absolute inset-y-0 left-0 w-[55%] bg-paper" />
        </span>
        <span className="h-[2px] flex-1 bg-paper/35" />
      </div>
      <div className="absolute inset-x-[0.8em] top-[1.6em] flex items-center gap-[0.5em]">
        <Avatar />
        <span className="text-[0.85em] font-medium">yourbrand</span>
        <span className="text-[0.75em] text-paper/70">· Follow</span>
      </div>
      <div className="absolute inset-x-[0.9em] bottom-[0.9em]">
        <p className="font-serif text-[1.55em] italic leading-[1.05]">Made to be seen.</p>
        <p className="mt-[0.5em] flex gap-[1em] font-mono text-[0.7em] text-paper/80">
          <span>♥ 12.4k</span>
          <span>↗ 2.1k</span>
        </p>
      </div>
    </Frame>
  );
}

function Search() {
  return (
    <Frame index="02" caption="Search" channel="Rank #1" w={320} h={204} className="bg-paper text-ink">
      <div className="flex h-full flex-col p-[1.1em]">
        <div className="flex items-center gap-[0.6em] border border-ink/15 px-[0.8em] py-[0.5em] text-[0.8em] text-ink/70">
          <svg viewBox="0 0 16 16" className="size-[1em] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <circle cx="7" cy="7" r="4.5" />
            <path d="m10.5 10.5 3.5 3.5" />
          </svg>
          brand studio for premium b2b
        </div>
        <div className="mt-[1.1em] flex items-center gap-[0.5em] text-[0.72em] text-muted">
          <span aria-hidden className="size-[1.3em] bg-brand" />
          yourbrand.com › work
        </div>
        <p className="mt-[0.35em] text-[1.12em] leading-tight text-brand">
          Your Brand · The one buyers choose
        </p>
        <p className="mt-[0.35em] text-[0.76em] leading-snug text-ink/60">
          A rebuilt brand, site and search presence. Premium on sight, easy to find.
        </p>
        <p className="mt-auto text-[0.72em] text-ink/70">
          <span className="text-brand">★★★★★</span> 4.9 · 212 reviews
        </p>
      </div>
    </Frame>
  );
}

function Film({ film }: { film: boolean }) {
  return (
    <Frame index="03" caption="Brand film · 16:9" channel="Web" w={480} h={270} className="bg-oxblood text-paper">
      <Media film={film} focus={{ x: 0.5, y: 0.5 }} still="bg-oxblood" />
      {!film && (
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 inline-flex size-[3.4em] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-paper/50 pl-[0.2em] text-[1em] text-paper/80"
        >
          ▶
        </span>
      )}
      {film && <div className="absolute inset-x-0 bottom-0 h-[30%] bg-ink/45" />}
      <span className="absolute left-[1em] top-[0.9em] font-mono text-[0.72em] uppercase tracking-[0.06em] text-paper/80">
        ● Brand film
      </span>
      <div className="absolute inset-x-[1em] bottom-[0.9em]">
        <div className="relative h-[2px] bg-paper/30">
          <span className="absolute inset-y-0 left-0 w-[42%] bg-signal" />
        </div>
        <div className="mt-[0.6em] flex justify-between font-mono text-[0.72em] text-paper/80">
          <span>00:12 / 00:30</span>
          <span>4K</span>
        </div>
      </div>
    </Frame>
  );
}

function Answer() {
  return (
    <Frame index="04" caption="AI answer" channel="Cited" w={300} h={250} className="bg-ink text-paper">
      <div className="flex h-full flex-col p-[1.1em]">
        <p className="font-mono text-[0.72em] uppercase tracking-[0.06em] text-signal">✦ AI answer</p>
        <p className="mt-[0.9em] text-[0.82em] leading-snug text-paper/55">
          Who should we hire for a premium rebrand?
        </p>
        <p className="mt-[0.6em] text-[0.98em] leading-snug text-paper/90">
          The most cited choice is <span className="text-paper underline decoration-signal decoration-[0.12em] underline-offset-[0.2em]">Your Brand</span>, known
          for considered work and measurable growth.
        </p>
        <div className="mt-auto flex flex-wrap gap-[0.4em] font-mono text-[0.66em] text-paper/70">
          <span className="border border-paper/20 px-[0.6em] py-[0.25em]">1 yourbrand.com</span>
          <span className="border border-paper/20 px-[0.6em] py-[0.25em]">2 Reviews</span>
          <span className="border border-paper/20 px-[0.6em] py-[0.25em]">3 Press</span>
        </div>
      </div>
    </Frame>
  );
}

function Feed({ film }: { film: boolean }) {
  return (
    <Frame index="05" caption="Feed · 1:1" channel="Paid" w={260} h={304} className="bg-paper text-ink">
      <div className="flex h-[3.2em] items-center gap-[0.55em] px-[0.9em]">
        <Avatar />
        <span className="text-[0.85em] font-medium">yourbrand</span>
        <span className="text-[0.72em] text-muted">Sponsored</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 top-[3.2em] overflow-hidden">
        <Media film={film} focus={{ x: 0.62, y: 0.45 }} still="bg-blush" />
        {!film && (
          <p className="absolute left-[0.8em] top-[0.6em] font-serif text-[2.6em] italic leading-[0.95] text-brand">
            Seen,
            <br />
            again.
          </p>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-paper/92 px-[0.9em] py-[0.6em] text-[0.78em]">
          <span>See the work</span>
          <span aria-hidden>→</span>
        </div>
      </div>
    </Frame>
  );
}

function Press() {
  return (
    <Frame index="06" caption="Press" channel="Earned" w={250} h={324} className="bg-paper text-ink">
      <div className="flex h-full flex-col p-[1.1em]">
        <p className="border-b-2 border-ink pb-[0.35em] text-center font-serif text-[1.35em] uppercase tracking-[0.12em]">
          The Industry
        </p>
        <p className="mt-[0.8em] font-mono text-[0.66em] uppercase tracking-[0.06em] text-brand">Feature</p>
        <p className="mt-[0.3em] font-serif text-[1.5em] leading-[1.02]">
          Why everyone is suddenly talking about Your Brand
        </p>
        <p className="mt-[0.6em] font-mono text-[0.62em] uppercase tracking-[0.06em] text-muted">
          6 min read
        </p>
        <div aria-hidden className="mt-auto grid grid-cols-2 gap-x-[0.8em] gap-y-[0.45em]">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className={`h-[0.32em] bg-ink/12 ${i % 5 === 4 ? "w-2/3" : ""}`} />
          ))}
        </div>
      </div>
    </Frame>
  );
}

function Billboard({ film }: { film: boolean }) {
  return (
    <Frame index="07" caption="Out of home · 48-sheet" channel="OOH" w={480} h={160} className="bg-oxblood text-paper">
      <div className="absolute inset-y-0 right-0 w-[48%] overflow-hidden">
        <Media film={film} focus={{ x: 0.5, y: 0.3 }} still="bg-ink" />
      </div>
      <div className="absolute inset-y-0 left-0 flex w-[52%] flex-col justify-between bg-brand p-[1em]">
        <span className="font-mono text-[0.62em] uppercase tracking-[0.06em] text-blush">yourbrand.com</span>
        <p className="text-[2.1em] leading-[0.92] tracking-[-0.04em]">
          Your brand,
          <br />
          <span className="font-serif italic">here.</span>
        </p>
      </div>
    </Frame>
  );
}

/** One set of the seven surfaces; rendered twice for a seamless drift */
function Set({ film, hidden = false }: { film: boolean; hidden?: boolean }) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className="flex items-end gap-5 pl-5 sm:gap-8 sm:pl-8 lg:gap-12 lg:pl-12"
    >
      <Reel film={film} />
      <Search />
      <Film film={film} />
      <Answer />
      <Feed film={film} />
      <Press />
      <Billboard film={film} />
    </div>
  );
}

export function DistributionWall({ film }: { film: boolean }) {
  return (
    <div
      role="img"
      aria-label="One brand story shown across seven surfaces: a social reel, a search result, a brand film, an AI answer, a sponsored feed post, a press feature, and a billboard."
      className="wall fade-up relative w-full overflow-hidden"
      style={{ animationDelay: "700ms" }}
    >
      <div className="wall-drift flex w-max">
        <Set film={film} />
        <Set film={film} hidden />
      </div>
    </div>
  );
}
