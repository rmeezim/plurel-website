"use client";

import { useState } from "react";
import { ArrowUpRight, Spark } from "@/components/icons";

const SERVICES = [
  "Website Design",
  "Brand Identity",
  "AI Search & SEO",
  "Content Marketing",
  "Paid Ads",
  "PR & Reputation",
  "Creative Direction",
  "Consulting",
] as const;

const BUDGETS = [
  "Under $5k",
  "$5k – $15k",
  "$15k – $50k",
  "$50k+",
  "Not sure yet",
] as const;

const INPUT_CLASSES =
  "w-full rounded-lg border border-line bg-paper px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-brand";

const LABEL_CLASSES =
  "mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted";

/**
 * Static-export-friendly inquiry form: validates client-side, then opens the
 * visitor's email app with the inquiry pre-filled (no backend required).
 * Swap the mailto handoff for a real form endpoint when one exists.
 */
export function ContactForm() {
  const [services, setServices] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  function toggleService(service: string) {
    setServices((current) =>
      current.includes(service)
        ? current.filter((s) => s !== service)
        : [...current, service],
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Company: ${data.get("company") || "—"}`,
      `Website: ${data.get("website") || "—"}`,
      `Interested in: ${services.length ? services.join(", ") : "—"}`,
      `Budget: ${data.get("budget") || "—"}`,
      "",
      `${data.get("message")}`,
    ];
    const subject = encodeURIComponent(
      `Growth audit request — ${data.get("name")}`,
    );
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:hello@plurel.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="self-start rounded-2xl border border-line bg-paper p-8 sm:p-10">
        <Spark className="size-5 text-brand" aria-hidden />
        <h3 className="mt-5 font-sans text-2xl font-normal tracking-[-0.01em] text-ink">
          Your inquiry is drafted.
        </h3>
        <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-ink/75">
          We&rsquo;ve opened your email app with everything filled in &mdash;
          hit send and we&rsquo;ll reply within one business day. If nothing
          opened, email us directly at{" "}
          <a
            href="mailto:hello@plurel.com"
            className="border-b border-brand/40 text-brand"
          >
            hello@plurel.com
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-muted transition-colors hover:text-brand"
        >
          &larr; Back to the form
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-paper p-6 sm:p-8 lg:p-10"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={LABEL_CLASSES}>
            Name *
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your full name"
            className={INPUT_CLASSES}
          />
        </div>
        <div>
          <label htmlFor="email" className={LABEL_CLASSES}>
            Work email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={INPUT_CLASSES}
          />
        </div>
        <div>
          <label htmlFor="company" className={LABEL_CLASSES}>
            Company
          </label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            placeholder="Company name"
            className={INPUT_CLASSES}
          />
        </div>
        <div>
          <label htmlFor="website" className={LABEL_CLASSES}>
            Current website
          </label>
          <input
            id="website"
            name="website"
            type="url"
            placeholder="https://"
            className={INPUT_CLASSES}
          />
        </div>
      </div>

      <fieldset className="mt-8">
        <legend className={LABEL_CLASSES}>What do you need?</legend>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((service) => {
            const active = services.includes(service);
            return (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service)}
                aria-pressed={active}
                className={`rounded-full border px-3.5 py-2 text-[13px] transition-colors ${
                  active
                    ? "border-brand bg-brand text-paper"
                    : "border-line bg-paper text-ink/80 hover:border-brand hover:text-brand"
                }`}
              >
                {service}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8">
        <label htmlFor="budget" className={LABEL_CLASSES}>
          Budget range
        </label>
        <select
          id="budget"
          name="budget"
          defaultValue=""
          className={`${INPUT_CLASSES} appearance-none`}
        >
          <option value="" disabled>
            Select a range
          </option>
          {BUDGETS.map((budget) => (
            <option key={budget} value={budget}>
              {budget}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8">
        <label htmlFor="message" className={LABEL_CLASSES}>
          Tell us where you are *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="What does your presence look like today, and what should it be doing for you?"
          className={`${INPUT_CLASSES} resize-y`}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <p className="max-w-[38ch] text-[13px] leading-relaxed text-muted">
          We reply within one business day &mdash; with a first read, not a
          form letter.
        </p>
        <button
          type="submit"
          className="group inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-[#a8302c]"
        >
          Request Growth Audit
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </div>
    </form>
  );
}
