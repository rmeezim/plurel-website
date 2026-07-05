import { Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";

const FAQS = [
  {
    q: "What does a typical engagement look like?",
    a: "Every engagement runs our four-phase operating model — Diagnose, Design, Deploy, Compound. Focused sprints (a rebrand, a website, an AI-search push) run four to eight weeks. Full growth transformations typically run a quarter, then move into an always-on program that compounds quarter over quarter.",
  },
  {
    q: "What does it cost?",
    a: "Focused sprints start in the low five figures; full transformations are scoped after the Growth Audit, so you are pricing a defined system — not open-ended hours. Every scope states what it should return, and quarterly reviews hold the work to it.",
  },
  {
    q: "How quickly will we see results?",
    a: "Perception shifts the day the new presence ships. Pipeline signals — inquiry quality, search and AI visibility, conversion — typically move within the first quarter. Programs are reviewed against your targets every quarter: what compounds gets scaled, what doesn't gets cut.",
  },
  {
    q: "Do you work with companies like ours?",
    a: "Our best fit is founder-led B2B, professional services, and premium consumer brands that win on trust. Stage matters less than ambition: if presence is holding your growth back and you want a system rather than a facelift, we should talk.",
  },
  {
    q: "We already have an in-house team or agency. Where do you fit?",
    a: "Usually as the systems layer. We diagnose and design the growth system, then either run defined lanes end-to-end (AI search, content engine, reputation) or integrate with your existing team as the accountable partner for outcomes.",
  },
  {
    q: "What exactly is the Growth Audit — and why is it free?",
    a: "A strategist reviews six dimensions of your presence — brand clarity, website conversion, AI search visibility, content authority, campaign readiness, and your martech foundation — and returns a prioritized read within about a business day. It's free because it's the fastest way for both of us to know whether there's a real engagement.",
  },
  {
    q: "Who actually does the work?",
    a: "A senior Plurel team, drawing on Northeon's global delivery network — strategy, design, engineering, and martech under one roof. The people who scope your system are the people who build it.",
  },
] as const;

/** FAQPage structured data, built from the same source of truth */
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-t border-line bg-paper"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-x-16">
          {/* Left: framing */}
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              <Spark className="size-3.5 text-brand" aria-hidden />
              Before you book
            </p>
            <h2
              id="faq-heading"
              className="mt-5 max-w-[14ch] font-sans text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
            >
              Questions, <em className="font-serif italic">answered</em>.
            </h2>
            <p className="mt-6 max-w-[40ch] text-[15px] leading-relaxed text-ink/80">
              The things most teams want to know before they talk to us. If
              yours isn&rsquo;t here, ask it on the call &mdash; it&rsquo;s
              what the first thirty minutes are for.
            </p>
          </Reveal>

          {/* Right: the questions */}
          <Reveal delay={0.1}>
            <div className="divide-y divide-line border-y border-line">
              {FAQS.map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                    <span className="text-[16px] font-medium tracking-[-0.01em] text-ink transition-colors group-hover:text-brand sm:text-[17px]">
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-brand transition-all duration-300 group-open:rotate-45 group-open:border-brand"
                    >
                      <svg
                        viewBox="0 0 12 12"
                        className="size-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      >
                        <path d="M6 1.5 V10.5 M1.5 6 H10.5" />
                      </svg>
                    </span>
                  </summary>
                  <p className="max-w-[62ch] pb-6 text-[15px] leading-relaxed text-ink/75">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
