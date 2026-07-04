import { Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";

const REVIEWS = [
  {
    name: "Brand clarity",
    question:
      "Is the company immediately understandable and differentiated?",
  },
  {
    name: "Website conversion",
    question: "Does the site turn attention into qualified action?",
  },
  {
    name: "AI search visibility",
    question:
      "Can buyers and AI assistants easily understand and surface the company?",
  },
  {
    name: "Content authority",
    question: "Is the brand publishing enough useful proof and perspective?",
  },
  {
    name: "Campaign readiness",
    question: "Are paid channels supported by strong offers and landing pages?",
  },
  {
    name: "MarTech foundation",
    question: "Are CRM, tracking, automation, and reporting connected?",
  },
] as const;

/** A reviewed-checklist mark in the brand accent */
function CheckMark() {
  return (
    <svg viewBox="0 0 22 22" className="size-5 shrink-0" aria-hidden>
      <circle
        cx="11"
        cy="11"
        r="10"
        fill="none"
        stroke="#bf3a36"
        strokeOpacity="0.35"
        strokeWidth="1.25"
      />
      <path
        d="M6.5 11.5 L9.5 14.5 L15.5 7.5"
        fill="none"
        stroke="#bf3a36"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GrowthAuditSection() {
  return (
    <section
      id="growth-audit"
      aria-labelledby="growth-audit-heading"
      className="border-t border-line"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-line bg-paper">
            {/* Document header bar */}
            <div className="flex items-center justify-between border-b border-line px-6 py-4 sm:px-10">
              <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                <Spark className="size-3.5 text-brand" aria-hidden />
                Growth Audit &mdash; preview
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                6 dimensions
              </span>
            </div>

            <div className="grid grid-cols-1 gap-x-14 gap-y-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-center lg:p-12">
              {/* Left — what it is */}
              <div>
                <h2
                  id="growth-audit-heading"
                  className="font-sans text-[clamp(1.75rem,3.4vw,2.75rem)] font-normal leading-[1.08] tracking-[-0.02em] text-ink"
                >
                  Your Growth Audit{" "}
                  <em className="font-serif italic">reviews</em>
                </h2>
                <p className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-ink/75">
                  A clear read on where your presence stands today &mdash;
                  brand, web, search, content, campaigns, and the martech
                  underneath. You&rsquo;ll get it back with the fixes that
                  matter first.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                  <span className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-brand" />
                    No cost
                  </span>
                  <span aria-hidden className="text-line">
                    /
                  </span>
                  <span>~1 business day</span>
                  <span aria-hidden className="text-line">
                    /
                  </span>
                  <span>From a strategist</span>
                </div>
              </div>

              {/* Right — the review checklist */}
              <ul className="divide-y divide-line border-y border-line">
                {REVIEWS.map((item) => (
                  <li key={item.name} className="flex gap-4 py-4">
                    <span className="mt-0.5">
                      <CheckMark />
                    </span>
                    <div>
                      <p className="text-[15px] font-medium tracking-[-0.01em] text-ink">
                        {item.name}
                      </p>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
                        {item.question}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
