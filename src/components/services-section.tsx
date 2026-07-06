import Link from "next/link";
import { ArrowUpRight, Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ServicesShowcase } from "@/components/services-showcase";

const SERVICES = [
  {
    number: "01",
    name: "Website Design",
    description: "Fast, considered sites that turn attention into inquiries.",
    module: "web",
  },
  {
    number: "02",
    name: "Brand Identity",
    description: "Identity systems that make you instantly recognisable.",
    module: "identity",
  },
  {
    number: "03",
    name: "AI Search & SEO",
    description:
      "Be the answer when customers — and their AI assistants — search.",
    module: "search",
  },
  {
    number: "04",
    name: "Content Marketing",
    description: "Editorial systems that keep you visible and credible.",
    module: "content",
  },
  {
    number: "05",
    name: "Paid Ads",
    description: "Campaigns tuned for return, not just reach.",
    module: "ads",
  },
  {
    number: "06",
    name: "PR & Reputation",
    description: "Press and proof that build trust before the first call.",
    module: "pr",
  },
  {
    number: "07",
    name: "Creative Direction",
    description: "One consistent visual voice across every touchpoint.",
    module: "creative",
  },
  {
    number: "08",
    name: "Consulting",
    description: "Senior eyes on your positioning, brand, and roadmap.",
    module: "consulting",
  },
] as const;

type Module = (typeof SERVICES)[number]["module"];

/**
 * Living schematic for each service — blueprint linework in the same visual
 * language as the operating-model stage: thin line strokes, ink nodes, and
 * constant motion (travelling brand pulses, flowing dashes, a scanning beam,
 * breathing nodes). Purely decorative (aria-hidden upstream); all motion
 * classes no-op under reduced motion.
 */
function ServiceModule({ kind }: { kind: Module }) {
  switch (kind) {
    case "web":
      // Page blueprint — pulse traces the frame, flow feeds the side cards
      return (
        <svg viewBox="0 0 240 140" className="h-full w-full">
          <rect x="16" y="14" width="140" height="112" rx="7" fill="none" stroke="#d8d2c8" strokeWidth="1.25" />
          <rect x="16" y="14" width="140" height="112" rx="7" fill="none" stroke="#bf3a36" strokeWidth="1.25" pathLength={100} className="method-pulse" />
          <line x1="16" y1="34" x2="156" y2="34" stroke="#d8d2c8" strokeWidth="1" />
          <circle cx="26" cy="24" r="2" fill="#110f0a" opacity="0.25" />
          <circle cx="34" cy="24" r="2" fill="#110f0a" opacity="0.25" />
          <rect x="30" y="50" width="66" height="7" rx="3.5" fill="#110f0a" opacity="0.5" />
          <rect x="30" y="64" width="44" height="5" rx="2.5" fill="#110f0a" opacity="0.18" />
          <rect x="30" y="94" width="36" height="13" rx="4" fill="#bf3a36" className="diagram-blink" />
          <path d="M156 70 H172 V49 H186 M172 70 V93 H186" fill="none" stroke="#c7b49d" strokeWidth="1.1" className="diagram-flow" />
          <rect x="186" y="38" width="38" height="22" rx="4" fill="none" stroke="#d8d2c8" strokeWidth="1.25" />
          <rect x="186" y="82" width="38" height="22" rx="4" fill="none" stroke="#d8d2c8" strokeWidth="1.25" />
        </svg>
      );
    case "identity":
      // Identity nucleus radiating to mark, type, and palette
      return (
        <svg viewBox="0 0 240 140" className="h-full w-full">
          <line x1="78" y1="70" x2="152" y2="30" stroke="#d8d2c8" strokeWidth="1.25" />
          <line x1="78" y1="70" x2="152" y2="70" stroke="#d8d2c8" strokeWidth="1.25" />
          <line x1="78" y1="70" x2="152" y2="110" stroke="#d8d2c8" strokeWidth="1.25" />
          <line x1="78" y1="70" x2="152" y2="30" stroke="#bf3a36" strokeWidth="1.25" pathLength={100} className="method-pulse" style={{ animationDelay: "-0.4s" }} />
          <line x1="78" y1="70" x2="152" y2="70" stroke="#bf3a36" strokeWidth="1.25" pathLength={100} className="method-pulse" style={{ animationDelay: "-1.5s" }} />
          <line x1="78" y1="70" x2="152" y2="110" stroke="#bf3a36" strokeWidth="1.25" pathLength={100} className="method-pulse" style={{ animationDelay: "-2.6s" }} />
          <circle cx="78" cy="70" r="11" fill="none" stroke="#bf3a36" strokeWidth="1.25" />
          <circle cx="78" cy="70" r="4.5" fill="#bf3a36" className="diagram-blink" />
          <rect x="152" y="18" width="24" height="24" rx="5" fill="none" stroke="#110f0a" strokeOpacity="0.45" strokeWidth="1.25" />
          <text x="158" y="77" fontSize="16" fill="#110f0a" fillOpacity="0.75" className="font-serif italic">
            Aa
          </text>
          <circle cx="158" cy="110" r="4.5" fill="#bf3a36" />
          <circle cx="170" cy="110" r="4.5" fill="#c7b49d" />
          <circle cx="182" cy="110" r="4.5" fill="#110f0a" opacity="0.8" />
        </svg>
      );
    case "search":
      // Answer ranking — a beam scans the results, the query feeds rank #1
      return (
        <svg viewBox="0 0 240 140" className="h-full w-full">
          <rect x="18" y="16" width="130" height="18" rx="9" fill="none" stroke="#d8d2c8" strokeWidth="1.25" />
          <circle cx="30" cy="25" r="4" fill="none" stroke="#8f8981" strokeWidth="1.25" />
          <rect x="42" y="23" width="52" height="4" rx="2" fill="#110f0a" opacity="0.15" />
          <path d="M34 34 V56" fill="none" stroke="#bf3a36" strokeWidth="1.25" pathLength={100} className="method-pulse" />
          <rect x="18" y="56" width="150" height="10" rx="5" fill="#bf3a36" opacity="0.85" />
          <text x="178" y="65" fontSize="10" fill="#bf3a36" className="diagram-blink">
            #1
          </text>
          <rect x="18" y="74" width="118" height="10" rx="5" fill="#110f0a" opacity="0.1" />
          <rect x="18" y="92" width="96" height="10" rx="5" fill="#110f0a" opacity="0.08" />
          <rect x="18" y="110" width="70" height="10" rx="5" fill="#110f0a" opacity="0.06" />
          <line x1="18" y1="50" x2="18" y2="124" stroke="#bf3a36" strokeOpacity="0.4" strokeWidth="1.5" className="diagram-scan" />
        </svg>
      );
    case "content":
      // Editorial conveyor — drafts flow through publish to distribution
      return (
        <svg viewBox="0 0 240 140" className="h-full w-full">
          <line x1="16" y1="92" x2="222" y2="92" stroke="#d8d2c8" strokeWidth="1.25" />
          <line x1="16" y1="92" x2="222" y2="92" stroke="#c7b49d" strokeWidth="1.25" className="diagram-flow" />
          <path d="M218 87 L226 92 L218 97" fill="none" stroke="#8f8981" strokeWidth="1.25" />
          <line x1="56" y1="74" x2="56" y2="88" stroke="#d8d2c8" strokeWidth="1" />
          <line x1="120" y1="70" x2="120" y2="87" stroke="#d8d2c8" strokeWidth="1" />
          <line x1="184" y1="74" x2="184" y2="88" stroke="#d8d2c8" strokeWidth="1" />
          <rect x="48" y="52" width="16" height="21" rx="2.5" fill="none" stroke="#110f0a" strokeOpacity="0.35" strokeWidth="1.1" />
          <rect x="112" y="48" width="16" height="21" rx="2.5" fill="none" stroke="#bf3a36" strokeWidth="1.1" />
          <rect x="176" y="52" width="16" height="21" rx="2.5" fill="none" stroke="#110f0a" strokeOpacity="0.35" strokeWidth="1.1" />
          <circle cx="56" cy="92" r="4" fill="#fbfaf6" stroke="#8f8981" strokeWidth="1.25" />
          <circle cx="120" cy="92" r="5" fill="#bf3a36" className="diagram-blink" />
          <circle cx="184" cy="92" r="4" fill="#fbfaf6" stroke="#8f8981" strokeWidth="1.25" />
        </svg>
      );
    case "ads":
      // Channels converge into return — pulses in, compounding out
      return (
        <svg viewBox="0 0 240 140" className="h-full w-full">
          <path d="M18 28 C78 28 112 62 156 67" fill="none" stroke="#d8d2c8" strokeWidth="1.25" />
          <path d="M18 70 H156" fill="none" stroke="#d8d2c8" strokeWidth="1.25" />
          <path d="M18 112 C78 112 112 78 156 73" fill="none" stroke="#d8d2c8" strokeWidth="1.25" />
          <path d="M18 28 C78 28 112 62 156 67" fill="none" stroke="#bf3a36" strokeWidth="1.25" pathLength={100} className="method-pulse" style={{ animationDelay: "-0.3s" }} />
          <path d="M18 70 H156" fill="none" stroke="#bf3a36" strokeWidth="1.25" pathLength={100} className="method-pulse" style={{ animationDelay: "-1.4s" }} />
          <path d="M18 112 C78 112 112 78 156 73" fill="none" stroke="#bf3a36" strokeWidth="1.25" pathLength={100} className="method-pulse" style={{ animationDelay: "-2.2s" }} />
          <circle cx="166" cy="70" r="8" fill="#bf3a36" className="diagram-blink" />
          <line x1="176" y1="70" x2="222" y2="70" stroke="#c7b49d" strokeWidth="1.25" className="diagram-flow" />
          <path d="M216 65 L224 70 L216 75" fill="none" stroke="#bf3a36" strokeWidth="1.25" />
        </svg>
      );
    case "pr":
      // Reputation constellation — coverage pulses out from the brand
      return (
        <svg viewBox="0 0 240 140" className="h-full w-full">
          <line x1="120" y1="72" x2="44" y2="26" stroke="#d8d2c8" strokeWidth="1.25" />
          <line x1="120" y1="72" x2="186" y2="20" stroke="#d8d2c8" strokeWidth="1.25" />
          <line x1="120" y1="72" x2="208" y2="96" stroke="#d8d2c8" strokeWidth="1.25" />
          <line x1="120" y1="72" x2="62" y2="116" stroke="#d8d2c8" strokeWidth="1.25" />
          <line x1="120" y1="72" x2="44" y2="26" stroke="#bf3a36" strokeWidth="1.25" pathLength={100} className="method-pulse" style={{ animationDelay: "-0.6s" }} />
          <line x1="120" y1="72" x2="186" y2="20" stroke="#bf3a36" strokeWidth="1.25" pathLength={100} className="method-pulse" style={{ animationDelay: "-1.7s" }} />
          <line x1="120" y1="72" x2="208" y2="96" stroke="#bf3a36" strokeWidth="1.25" pathLength={100} className="method-pulse" style={{ animationDelay: "-2.8s" }} />
          <circle cx="44" cy="26" r="3.5" fill="#110f0a" opacity="0.45" />
          <circle cx="186" cy="20" r="4.5" fill="#bf3a36" className="diagram-blink" />
          <circle cx="208" cy="96" r="3.5" fill="#110f0a" opacity="0.45" />
          <circle cx="62" cy="116" r="3.5" fill="#110f0a" opacity="0.45" />
          <circle cx="120" cy="72" r="8" fill="#110f0a" />
          <circle cx="120" cy="72" r="2.5" fill="#fbfaf6" />
        </svg>
      );
    case "creative":
      // Direction plate — crop marks, grid circle, pulse tracing the frame
      return (
        <svg viewBox="0 0 240 140" className="h-full w-full">
          <path d="M18 28 V16 H30" fill="none" stroke="#110f0a" strokeOpacity="0.4" strokeWidth="1.25" />
          <path d="M210 16 H222 V28" fill="none" stroke="#110f0a" strokeOpacity="0.4" strokeWidth="1.25" />
          <path d="M222 112 V124 H210" fill="none" stroke="#110f0a" strokeOpacity="0.4" strokeWidth="1.25" />
          <path d="M30 124 H18 V112" fill="none" stroke="#110f0a" strokeOpacity="0.4" strokeWidth="1.25" />
          <rect x="58" y="32" width="124" height="76" fill="none" stroke="#d8d2c8" strokeWidth="1.25" />
          <rect x="58" y="32" width="124" height="76" fill="none" stroke="#bf3a36" strokeWidth="1.25" pathLength={100} className="method-pulse" style={{ animationDelay: "-1s" }} />
          <line x1="58" y1="108" x2="182" y2="32" stroke="#110f0a" opacity="0.15" strokeWidth="1" />
          <circle cx="120" cy="70" r="23" fill="none" stroke="#c7b49d" strokeWidth="1.25" />
          <circle cx="120" cy="70" r="3" fill="#bf3a36" className="diagram-blink" />
        </svg>
      );
    case "consulting":
      // Engagement roadmap — the "now" line crawls across the plan
      return (
        <svg viewBox="0 0 240 140" className="h-full w-full">
          <rect x="24" y="34" width="104" height="6" rx="3" fill="#110f0a" opacity="0.12" />
          <rect x="52" y="62" width="128" height="6" rx="3" fill="#c7b49d" opacity="0.75" />
          <rect x="84" y="90" width="72" height="6" rx="3" fill="#bf3a36" opacity="0.85" />
          <line x1="150" y1="22" x2="150" y2="112" stroke="#bf3a36" strokeOpacity="0.45" strokeWidth="1.1" className="diagram-flow" />
          <circle cx="150" cy="93" r="5.5" fill="none" stroke="#bf3a36" strokeWidth="1.25" className="diagram-blink" />
          <line x1="24" y1="118" x2="216" y2="118" stroke="#d8d2c8" strokeWidth="1.25" />
        </svg>
      );
  }
}

/** Sticky-column intro — server-rendered, passed into the client showcase */
function Intro() {
  return (
    <Reveal>
      <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        <Spark className="size-3.5 text-brand" aria-hidden />
        What we do
      </p>
      <h2
        id="services-heading"
        className="mt-5 font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
      >
        Services that make you the{" "}
        <em className="italic">obvious</em> choice.
      </h2>
      <p className="mt-6 max-w-[42ch] text-[15px] leading-relaxed text-ink/80">
        Plurel modernizes how your business looks, communicates, and attracts
        customers &mdash; one partner for the entire visible layer of your
        brand.
      </p>
      <Link
        href="/services"
        className="group mt-8 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-brand"
      >
        All services
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </Reveal>
  );
}

/** Plain numbered index — the below-lg / fallback presentation */
function StaticRows() {
  return (
    <ul>
      {SERVICES.map((service, index) => (
        <li key={service.number} className="border-t border-line last:border-b">
          <Reveal sweep delay={Math.min(index * 0.08, 0.4)}>
            <Link
              href="/services"
              className="group grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-x-4 py-6 transition-colors duration-300 hover:bg-paper/60 sm:gap-x-6 sm:py-5"
            >
              <span className="text-sm tabular-nums text-muted transition-colors duration-300 group-hover:text-brand">
                {service.number}
              </span>
              <span>
                <span className="block text-2xl font-normal tracking-[-0.01em] text-ink transition-colors duration-300 group-hover:text-brand sm:text-3xl">
                  {service.name}
                </span>
                <span className="mt-1.5 hidden text-[15px] leading-relaxed text-ink/70 sm:block">
                  {service.description}
                </span>
              </span>
              <span className="inline-flex size-10 items-center justify-center self-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-paper">
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="overflow-x-clip border-t border-line"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <ServicesShowcase
          intro={<Intro />}
          services={SERVICES.map(({ number, name, description }) => ({
            number,
            name,
            description,
          }))}
          modules={SERVICES.map((service) => (
            <ServiceModule key={service.number} kind={service.module} />
          ))}
          fallback={<StaticRows />}
        />
      </div>
    </section>
  );
}
