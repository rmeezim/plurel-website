import type { CSSProperties, ReactNode } from "react";
import { GlassBand } from "@/components/glass-band";
import { Accent, CONTAINER, CtaLink, GRID, Meta } from "@/components/system";
import { heroFilm } from "@/lib/film";
import { AUDIT_HREF } from "@/lib/nav";

/*
  Home hero: the statement, a band of glass over the film, and the
  distribution exhibit (one story, seven surfaces, owned / earned / paid).

  The glass (GlassBand) hangs well clear of the statement and steps into a
  rising staircase as the visitor scrolls on. Below it, the exhibit draws
  the distribution literally: the brand feeds seven surfaces, grouped by
  the three kinds of media. On large screens it is laid out on a 1184-unit
  drawing scaled to the container (--u is one unit), so every wire lands
  on its port; below lg it becomes a plain grouped list.
*/

type Surface = { n: string; name: string; format?: string; on?: boolean };
const MEDIA: { name: string; count: string; line: string; on?: boolean; surfaces: Surface[] }[] = [
  {
    name: "Owned",
    count: "03",
    line: "Look like the choice before you say a word.",
    surfaces: [
      { n: "01", name: "Reel", format: "9:16" },
      { n: "02", name: "Search" },
      { n: "03", name: "Brand film", format: "16:9" },
    ],
  },
  {
    name: "Earned",
    count: "02",
    line: "What the world says when you’re not in the room.",
    on: true,
    surfaces: [
      { n: "04", name: "AI answer", format: "Cited", on: true },
      { n: "06", name: "Press" },
    ],
  },
  {
    name: "Paid",
    count: "02",
    line: "Buy attention a system can hold.",
    surfaces: [
      { n: "05", name: "Feed", format: "1:1" },
      { n: "07", name: "Out of home", format: "48-sheet" },
    ],
  },
];

/** Staggered line reveal: each line rises out of its own mask */
function Line({ children, delay, className = "" }: { children: ReactNode; delay: number; className?: string }) {
  return (
    <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em] pr-[0.1em]">
      <span className={`line-rise ${className}`} style={{ animationDelay: `${delay}ms` }}>
        {children}
      </span>
    </span>
  );
}

const u = (n: number) => `calc(var(--u) * ${n})`;
const fs = (n: number, min = 12) => `max(${min}px, calc(var(--u) * ${n}))`;

function SourceMark({ size }: { size: number }) {
  // The Plurel mark at 2:4:2 with 1-unit gutters, drawn in cells
  return (
    <span
      aria-hidden
      className="grid shrink-0"
      style={{
        gridTemplateColumns: `${size}px ${size * 2}px ${size}px`,
        gridTemplateRows: `${size}px ${size * 2}px ${size}px`,
        gap: `${Math.max(2, Math.round(size * 0.6))}px`,
      }}
    >
      {Array.from({ length: 9 }, (_, i) => (
        <i key={i} className="block bg-paper" />
      ))}
    </span>
  );
}

/** lg and up: the exhibit as a scaled drawing */
function ExhibitDrawing() {
  return (
    <div className="hidden @container lg:block">
      <div className="relative" style={{ "--u": "calc(100cqw / 1184)" } as CSSProperties}>
        {/* Column heads */}
        <div className="relative text-fog" style={{ height: u(24), marginTop: u(26) }}>
          <p className="absolute flex justify-between" style={{ left: 0, width: u(272), fontSize: fs(13) }}>
            <span>Source</span>
          </p>
          <p className="absolute flex items-baseline justify-between" style={{ left: u(405.33), width: u(373.33), fontSize: fs(13) }}>
            <span>Surfaces</span>
            <Meta className="text-fog/80">07</Meta>
          </p>
          <p className="absolute flex items-baseline justify-between" style={{ left: u(912), width: u(272), fontSize: fs(13) }}>
            <span>Media</span>
            <Meta className="text-fog/80">03</Meta>
          </p>
        </div>

        <div className="relative" style={{ height: u(300), marginTop: u(14) }}>
          <svg viewBox="0 0 1184 300" aria-hidden className="absolute inset-0 block h-full w-full">
            <g fill="none" className="stroke-fog/35" strokeWidth="1">
              <path d="M338 18V266" />
              <path d="M338 18H399M338 54H399M338 90H399M338 178H399M338 230H399M338 266H399" />
              <path d="M785 18H845M785 54H845M785 90H845M845 18V90M845 54H906" />
              <path d="M785 178H845M845 160V178" />
              <path d="M785 230H845M785 266H845M845 230V266M845 248H906" />
            </g>
            <g fill="none" className="stroke-signal" strokeWidth="1.5">
              <path d="M272 142H399" />
              <path d="M785 142H845V160H906" />
            </g>
            <g className="fill-graphite stroke-fog/60" strokeWidth="1">
              {[15, 51, 87, 175, 227, 263].map((y) => (
                <rect key={`l${y}`} x="399" y={y} width="6" height="6" />
              ))}
              {[15, 51, 87, 175, 227, 263].map((y) => (
                <rect key={`r${y}`} x="779" y={y} width="6" height="6" />
              ))}
              <rect x="906" y="51" width="6" height="6" />
              <rect x="906" y="245" width="6" height="6" />
              <rect x="842" y="51" width="7" height="7" />
              <rect x="842" y="245" width="7" height="7" />
            </g>
            <g className="fill-signal">
              <rect x="399" y="139" width="6" height="6" />
              <rect x="779" y="139" width="6" height="6" />
              <rect x="906" y="157" width="6" height="6" />
              <rect x="335" y="139" width="7" height="7" />
              <rect x="842" y="157" width="7" height="7" />
            </g>
          </svg>

          {/* Source */}
          <div
            className="absolute flex flex-col justify-between bg-brand text-paper"
            style={{ left: 0, top: u(58), width: u(272), height: u(168), padding: `${u(16)} ${u(16)} ${u(14)}` }}
          >
            <p className="flex items-start justify-between font-medium" style={{ fontSize: fs(13) }}>
              <span>One story</span>
              <SourceMark size={5} />
            </p>
            <p className="type-display" style={{ fontSize: fs(34, 22) }}>
              Your brand.
            </p>
          </div>

          {/* Surfaces, grouped by media */}
          <div className="absolute" style={{ left: u(405.33), top: 0, width: u(373.33) }}>
            {MEDIA.map((m, g) => (
              <ol key={m.name} style={{ marginTop: g ? u(16) : 0 }}>
                {m.surfaces.map((s) => {
                  return (
                    <li
                      key={s.n}
                      className="grid items-center border-b border-paper/13"
                      style={{ height: u(36), gridTemplateColumns: `${u(36)} 1fr auto`, paddingLeft: u(12), paddingRight: u(16) }}
                    >
                      <Meta className={s.on ? "text-signal" : "text-fog"}>{s.n}</Meta>
                      <span className={`whitespace-nowrap ${s.on ? "text-paper" : "text-paper/88"}`} style={{ fontSize: fs(15) }}>
                        {s.name}
                      </span>
                      <Meta className={s.on ? "text-signal" : "text-fog"}>{s.format ?? ""}</Meta>
                    </li>
                  );
                })}
              </ol>
            ))}
          </div>

          {/* Media */}
          {MEDIA.map((m, i) => (
            <div key={m.name} className="absolute" style={{ left: u(912), top: u([42, 148, 236][i]), width: u(272), paddingLeft: u(14) }}>
              <p className="flex items-center justify-between" style={{ height: u(24) }}>
                <span
                  className={`inline-flex items-center font-medium ${m.on ? "text-paper" : "text-paper/88"}`}
                  style={{ fontSize: fs(18, 14), gap: u(9) }}
                >
                  {m.on && <i aria-hidden className="block size-[7px] bg-signal" />}
                  {m.name}
                </span>
                <Meta className={m.on ? "text-signal" : "text-fog"}>{m.count}</Meta>
              </p>
              <p className="mt-1 max-w-[30ch] leading-[1.4] text-fog" style={{ fontSize: fs(13) }}>
                {m.line}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Below lg: the exhibit as a grouped list */
function ExhibitList() {
  return (
    <div className="mt-6 lg:hidden">
      <div className="flex min-h-36 flex-col justify-between bg-brand p-4 text-paper">
        <p className="flex items-start justify-between text-[13px] font-medium">
          <span>One story</span>
          <SourceMark size={5} />
        </p>
        <p className="type-display mt-6 text-[28px] leading-none">Your brand.</p>
      </div>
      <div className="mt-2 grid gap-y-8 border-l border-fog/35 pl-4 pt-6 sm:grid-cols-3 sm:gap-x-6">
        {MEDIA.map((m) => (
          <div key={m.name}>
            <p className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-2 text-[17px] font-medium ${m.on ? "text-paper" : "text-paper/88"}`}>
                {m.on && <i aria-hidden className="block size-[7px] bg-signal" />}
                {m.name}
              </span>
              <Meta className={m.on ? "text-signal" : "text-fog"}>{m.count}</Meta>
            </p>
            <p className="mt-1 text-[14px] leading-snug text-fog">{m.line}</p>
            <ol className="mt-3">
              {m.surfaces.map((s) => (
                <li key={s.n} className="grid min-h-10 grid-cols-[2.25rem_1fr_auto] items-center border-b border-paper/13">
                  <Meta className={s.on ? "text-signal" : "text-fog"}>{s.n}</Meta>
                  <span className={`text-[15px] ${s.on ? "text-paper" : "text-paper/88"}`}>{s.name}</span>
                  <Meta className={s.on ? "text-signal" : "text-fog"}>{s.format ?? ""}</Meta>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const film = heroFilm();

  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden bg-graphite text-paper">
      {/* Statement, with the action bottom-aligned on cols 10-12 */}
      <div className={`${CONTAINER} pt-32 sm:pt-36 lg:pt-40`}>
        <div className={`${GRID} gap-y-9 lg:items-end`}>
          <div className="col-span-4 sm:col-span-6 lg:col-span-8">
            <p className="fade-up flex items-center gap-2.5 text-[13px] font-medium" style={{ animationDelay: "60ms" }}>
              <i aria-hidden className="block size-[7px] bg-signal" />
              Brand, demand and distribution <span className="text-fog">· A Northeon company</span>
            </p>
            <h1 id="hero-heading" className="type-display mt-6 text-[clamp(2.75rem,6.4vw,6.25rem)] leading-[0.98]">
              <Line delay={150}>Made to be</Line>
              <Line delay={290}>
                seen. <Accent className="text-fog">Everywhere.</Accent>
              </Line>
            </h1>
          </div>
          <div
            className="fade-up col-span-4 flex flex-col items-start gap-6 sm:col-span-5 lg:col-span-4 lg:col-start-9 lg:pb-2"
            style={{ animationDelay: "520ms" }}
          >
            <p className="max-w-[34ch] text-[17px] leading-[1.5] text-fog lg:text-[19px]">
              One story, cut for every surface: owned, earned and paid.
            </p>
            <CtaLink href={AUDIT_HREF} className="w-full sm:w-auto">
              Book a growth audit
            </CtaLink>
          </div>
        </div>
      </div>

      {/* Glass over the film: full bleed, well clear of the statement */}
      <GlassBand
        film={film}
        profile="rise"
        rest={0.42}
        progress="page"
        end={0.16}
        caption={<Meta>Fig. 00 · One film, nine panes</Meta>}
        foot="rest"
        className="fade-up mt-20 h-[clamp(300px,54svh,560px)] sm:mt-24 lg:mt-28"
      />

      {/* The distribution exhibit */}
      <div className={`${CONTAINER} pb-20 pt-14 lg:pb-28 lg:pt-16`}>
        <div className="flex items-baseline gap-4 border-b border-paper/30 pb-3.5">
          <Meta className="text-signal">Fig. 01</Meta>
          <p className="text-[14px] font-medium">One story · seven surfaces · owned, earned, paid</p>
        </div>
        <ExhibitDrawing />
        <ExhibitList />
      </div>
    </section>
  );
}
