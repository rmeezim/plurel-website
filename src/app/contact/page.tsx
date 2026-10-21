import { Cascade } from "@/components/cascade";
import { Spark } from "@/components/icons";
import { ContactForm } from "@/components/contact-form";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact | Plurel",
  description:
    "Request a diagnostic. Tell us where your distribution stands today and a strategist will send back a scored read within a business day.",
  path: "/contact/",
});

const NEXT_STEPS = [
  {
    number: "01",
    title: "Your Diagnostic, within a business day",
    detail: "Six parts scored by a strategist, and the first fix named.",
  },
  {
    number: "02",
    title: "A 30-minute call",
    detail: "We walk you through the read and answer your questions.",
  },
  {
    number: "03",
    title: "A scope, if there is one",
    detail: "What to fix first, what it costs and what it should return.",
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
            <Cascade text="Your before-and-after starts" base={0.08} step={0.045} />{" "}
            <em className="italic">
              <Cascade text="here." base={0.08} step={0.045} offset={4} />
            </em>
          </h1>
          <p className="fade-up mt-6 max-w-[54ch] text-[15px] leading-relaxed text-ink/80 sm:text-base [animation-delay:250ms]">
            Request a diagnostic and a strategist will send you a scored read
            of your distribution within a business day. If you&rsquo;d rather
            talk first, say so in the form.
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
                  <li className="flex items-baseline justify-between gap-4 py-4">
                    <span className="text-[13px] text-muted">Base</span>
                    <span className="text-[15px] text-ink">
                      New York &middot; Remote
                    </span>
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
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
