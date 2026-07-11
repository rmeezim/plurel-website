import { Spark } from "@/components/icons";

/*
 * Visual plates — the design system's stand-in for photography. Composed
 * brand surfaces (materials + grain + house marks + drawn schematics) that
 * carry a section visually the way an image would, at any size. Every
 * plate is decorative (aria-hidden); pass sizing via className
 * (aspect-*, h-*). When real photography exists it drops into the same
 * slots.
 */

type Kind = "identity" | "room" | "campaign" | "schematic" | "device";

function PlateLabel({
  text,
  tone,
}: {
  text: string;
  tone: "paper" | "ink";
}) {
  return (
    <span
      className={`absolute bottom-5 left-6 z-10 text-[10px] font-semibold uppercase tracking-[0.2em] ${
        tone === "paper" ? "text-paper/55" : "text-ink/55"
      }`}
    >
      {text}
    </span>
  );
}

export function VisualPlate({
  kind,
  label,
  line,
  className = "",
}: {
  kind: Kind;
  /** Micro caption, bottom-left */
  label?: string;
  /** Display line for kinds that carry one (campaign) */
  line?: string;
  className?: string;
}) {
  const frame = `relative overflow-hidden rounded-2xl border border-line ${className}`;

  switch (kind) {
    case "identity":
      return (
        <div aria-hidden className={`${frame} material-backstage material-drift grain`}>
          <Spark className="absolute -right-14 -top-20 size-[260px] rotate-12 text-paper/[0.07]" />
          <p className="absolute left-6 top-6 font-serif text-4xl leading-none text-paper">
            Aa
          </p>
          <span className="absolute left-6 top-24 flex gap-1.5">
            <span className="size-3 rounded-full bg-brand" />
            <span className="size-3 rounded-full bg-clay" />
            <span className="size-3 rounded-full border border-paper/40" />
          </span>
          {label && <PlateLabel text={label} tone="paper" />}
        </div>
      );

    case "room":
      return (
        <div aria-hidden className={`${frame} material-warmth material-drift grain`}>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(112deg, rgba(251,250,246,0.5) 0%, rgba(251,250,246,0.12) 38%, rgba(251,250,246,0) 60%), linear-gradient(to top, rgba(17,15,10,0.2), rgba(17,15,10,0) 46%)",
            }}
          />
          <Spark className="absolute -right-12 -top-16 size-[240px] rotate-12 text-ink/[0.05]" />
          {label && <PlateLabel text={label} tone="ink" />}
        </div>
      );

    case "campaign":
      return (
        <div aria-hidden className={`${frame} material-heat material-drift grain`}>
          <span className="absolute left-6 top-6 inline-flex size-10 items-center justify-center rounded-full border border-paper/40">
            <Spark className="size-5 text-paper" />
          </span>
          <p className="absolute bottom-14 left-6 max-w-[12ch] font-serif text-3xl leading-[1.05] text-paper sm:text-4xl">
            {line ?? "Made to be kept."}
          </p>
          {label && <PlateLabel text={label} tone="paper" />}
        </div>
      );

    case "device":
      return (
        <div aria-hidden className={`${frame} material-warmth material-drift grain`}>
          <div className="absolute bottom-12 left-1/2 h-[52%] w-[22%] min-w-14 -translate-x-1/2 rounded-[12px] bg-ink/85">
            <span className="absolute -top-3.5 left-1/2 h-3.5 w-6 -translate-x-1/2 rounded-sm bg-ink" />
            <span className="absolute inset-x-2 top-[38%] h-[24%] rounded-[3px] bg-paper/15" />
          </div>
          {label && <PlateLabel text={label} tone="ink" />}
        </div>
      );

    case "schematic":
      return (
        <div aria-hidden className={`${frame} grain bg-paper`}>
          <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-line px-5 py-3 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-muted">
            <span>{label ?? "System schematic"}</span>
            <span className="flex items-center gap-1.5">
              <Spark className="size-3 text-brand" />
              SYS&middot;09
            </span>
          </div>
          <svg
            className="absolute inset-x-0 bottom-0 top-11 h-auto w-full"
            viewBox="0 0 400 260"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Bus */}
            <line x1="60" y1="40" x2="60" y2="220" stroke="#d8d2c8" strokeWidth="1.25" />
            {/* Nodes */}
            <circle cx="60" cy="64" r="5" fill="#bf3a36" />
            <circle cx="60" cy="130" r="5" fill="#110f0a" fillOpacity="0.8" />
            <circle cx="60" cy="196" r="5" fill="none" stroke="#8f8981" strokeWidth="1.5" />
            {/* Elbows to readouts */}
            <path d="M60 64 H 150 Q 162 64 162 76 V 96" stroke="#d8d2c8" strokeWidth="1.25" />
            <path
              d="M60 64 H 150 Q 162 64 162 76 V 96"
              stroke="#bf3a36"
              strokeWidth="1.5"
              strokeLinecap="round"
              pathLength={100}
              className="method-pulse"
              style={{ strokeDasharray: "8 100", animationDuration: "4.5s" }}
            />
            <path d="M60 130 H 230 Q 242 130 242 142 V 162" stroke="#d8d2c8" strokeWidth="1.25" strokeDasharray="3 7" className="diagram-flow" />
            {/* Readout frames */}
            <rect x="126" y="96" width="72" height="44" rx="6" fill="#ece8df" stroke="#d8d2c8" />
            <rect x="206" y="162" width="110" height="52" rx="6" fill="none" stroke="#8f8981" strokeOpacity="0.5" strokeDasharray="4 6" />
            {/* Readout ticks */}
            <line x1="138" y1="112" x2="186" y2="112" stroke="#8f8981" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="138" y1="124" x2="170" y2="124" stroke="#bf3a36" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="220" y1="180" x2="300" y2="180" stroke="#8f8981" strokeOpacity="0.6" strokeWidth="1.25" strokeLinecap="round" />
            <line x1="220" y1="194" x2="272" y2="194" stroke="#8f8981" strokeOpacity="0.6" strokeWidth="1.25" strokeLinecap="round" />
            {/* Blinking indicators */}
            <circle cx="330" cy="64" r="3.5" fill="#bf3a36" className="diagram-blink" />
            <circle cx="348" cy="64" r="3.5" fill="#c7b49d" className="diagram-blink" style={{ animationDelay: "-1.2s" }} />
          </svg>
        </div>
      );
  }
}
