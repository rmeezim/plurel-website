import type { Metadata } from "next";
import { Spark } from "@/components/icons";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact — Plurel",
  description:
    "Book a strategy call or request a growth audit. Tell us where your presence is today — we'll map what it could be doing for you.",
};

const NEXT_STEPS = [
  {
    number: "01",
    title: "We reply within one business day",
    detail: "A first read on your presence — from a person, not a pipeline.",
  },
  {
    number: "02",
    title: "A 30-minute strategy call",
    detail: "Where you stand across brand, web, search, and reputation.",
  },
  {
    number: "03",
    title: "Your growth audit & roadmap",
    detail: "What to fix first, what it costs, and what it should return.",
  },
] as const;

export default function ContactPage() {
  return (
    <main>
      {/* Page hero */}
      <section aria-labelledby="contact-heading">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-10 pt-12 sm:px-8 lg:px-12 lg:pb-14 lg:pt-20">
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            <Spark className="size-3.5 text-brand" aria-hidden />
            Contact
          </p>
          <h1
            id="contact-heading"
            className="mt-5 max-w-[18ch] font-sans text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-[1.02] tracking-[-0.02em] text-ink"
          >
            Your before-and-after starts{" "}
            <em className="font-serif italic">here</em>.
          </h1>
          <p className="mt-6 max-w-[54ch] text-[15px] leading-relaxed text-ink/80 sm:text-base">
            Book a 30-minute strategy call or request a growth audit &mdash;
            either way, you&rsquo;ll leave with a sharper read on your brand,
            your visibility, and your next move.
          </p>
        </div>
      </section>

      {/* Form + contact rail */}
      <section aria-label="Contact form and details" className="border-t border-line">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-x-16">
            <ContactForm />

            {/* Right rail */}
            <aside className="space-y-10 lg:pt-2">
              {/* Direct lines */}
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                  Talk to us
                </p>
                <ul className="mt-4 divide-y divide-line border-y border-line">
                  <li>
                    <a
                      href="mailto:hello@plurel.com"
                      className="group flex items-baseline justify-between gap-4 py-4"
                    >
                      <span className="text-[13px] text-muted">Email</span>
                      <span className="text-[15px] text-ink transition-colors group-hover:text-brand">
                        hello@plurel.com
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+15550123456"
                      className="group flex items-baseline justify-between gap-4 py-4"
                    >
                      <span className="text-[13px] text-muted">Phone</span>
                      <span className="text-[15px] text-ink transition-colors group-hover:text-brand">
                        +1 (555) 012-3456
                      </span>
                    </a>
                  </li>
                  <li className="flex items-baseline justify-between gap-4 py-4">
                    <span className="text-[13px] text-muted">Office</span>
                    <address className="text-right text-[15px] not-italic leading-relaxed text-ink">
                      12 Harbor Lane, Suite 400
                      <br />
                      New York, NY
                    </address>
                  </li>
                  <li className="flex items-baseline justify-between gap-4 py-4">
                    <span className="text-[13px] text-muted">Hours</span>
                    <span className="text-[15px] text-ink">
                      Mon&ndash;Fri, 9:00&ndash;18:00 ET
                    </span>
                  </li>
                </ul>
              </div>

              {/* What happens next */}
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                  What happens next
                </p>
                <ol className="mt-4 space-y-5">
                  {NEXT_STEPS.map((step) => (
                    <li key={step.number} className="flex gap-4">
                      <span className="text-sm tabular-nums leading-6 text-brand">
                        {step.number}
                      </span>
                      <span>
                        <span className="block text-[15px] font-medium leading-6 text-ink">
                          {step.title}
                        </span>
                        <span className="mt-1 block text-[13px] leading-relaxed text-muted">
                          {step.detail}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Northeon note */}
              <div className="rounded-2xl bg-charcoal p-6 text-paper">
                <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
                  <Spark className="size-3 text-brand" aria-hidden />
                  A Northeon division
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-paper/75">
                  Plurel engagements draw on Northeon&rsquo;s global delivery
                  network &mdash; senior strategy, design, and martech under
                  one roof.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
