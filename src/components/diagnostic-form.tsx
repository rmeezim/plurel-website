"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowUpRight } from "@/components/icons";
import { CONTACT_EMAIL } from "@/lib/nav";

/*
  The Diagnostic's request form, and the plain contact form, in the dark
  room: square fields on a hairline, sentence-case labels, choices as
  square chips (real radios and checkboxes underneath). There is no
  backend on a static site, so a sent form opens the visitor's email app
  with the request written out, addressed to us, and says so plainly.
*/

const FIELD =
  "block h-12 w-full border border-paper/25 bg-paper/[0.04] px-4 text-[16px] text-paper outline-none transition-colors placeholder:text-fog/70 hover:border-paper/45 focus:border-paper";
const LABEL = "mb-2 block text-[14px] font-medium text-fog";
const CHIP =
  "inline-flex h-10 cursor-pointer items-center border border-paper/25 px-3.5 text-[15px] transition-colors hover:border-paper/60 peer-checked:border-paper peer-checked:bg-paper peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-paper";

function Field({ label, children, optional = false }: { label: string; children: ReactNode; optional?: boolean }) {
  return (
    <label className="block">
      <span className={LABEL}>
        {label}
        {optional && <span className="font-normal"> (optional)</span>}
      </span>
      {children}
    </label>
  );
}

function Chips({
  legend,
  name,
  options,
  type,
}: {
  legend: string;
  name: string;
  options: readonly string[];
  type: "radio" | "checkbox";
}) {
  return (
    <fieldset>
      <legend className={LABEL}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="relative">
            <input type={type} name={name} value={o} className="peer sr-only" />
            <span className={CHIP}>{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const SUBMIT =
  "group inline-flex h-11 items-stretch bg-brand text-[15px] font-medium leading-none tracking-[-0.005em] text-paper transition-colors hover:bg-ember focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper";

function Submit({ children }: { children: ReactNode }) {
  return (
    <button type="submit" className={SUBMIT}>
      <span className="flex items-center px-[18px]">{children}</span>
      <span aria-hidden className="grid aspect-square place-items-center bg-ember">
        <ArrowUpRight className="size-3.5 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

function openMail(subject: string, lines: string[]) {
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

function Sent({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="border-t-2 border-paper pt-6">
      <p className="type-title text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] leading-[1.1]">Your email app has it.</p>
      <p className="mt-4 max-w-[52ch] text-[16px] leading-[1.55] text-fog">{children}</p>
    </div>
  );
}

const KINDS = ["Consumer brand", "Physical product", "B2B technology", "Consumer technology", "Something else"] as const;
const WANTS = ["Reach", "Reputation", "Mindshare", "Revenue"] as const;

export function DiagnosticForm() {
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    openMail(`Diagnostic request: ${get("company") || get("name")}`, [
      `Name: ${get("name")}`,
      `Email: ${get("email")}`,
      `Company: ${get("company")}`,
      `Website: ${get("website") || "-"}`,
      `What we sell: ${get("kind") || "-"}`,
      `What we came for: ${data.getAll("want").join(", ") || "-"}`,
      `The number we run on: ${get("number") || "-"}`,
      "",
      get("note"),
    ]);
    setSent(true);
  }

  if (sent) {
    return (
      <Sent>
        We&apos;ve written your request into an email to {CONTACT_EMAIL}; send it and a strategist
        replies within a business day. If nothing opened, write to us there directly.
      </Sent>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
      <Field label="Your name">
        <input name="name" required autoComplete="name" className={FIELD} />
      </Field>
      <Field label="Work email">
        <input name="email" type="email" required autoComplete="email" className={FIELD} />
      </Field>
      <Field label="Company">
        <input name="company" required autoComplete="organization" className={FIELD} />
      </Field>
      <Field label="Website" optional>
        <input name="website" type="url" inputMode="url" placeholder="https://" className={FIELD} />
      </Field>
      <div className="sm:col-span-2">
        <Chips legend="What you sell" name="kind" options={KINDS} type="radio" />
      </div>
      <div className="sm:col-span-2">
        <Chips legend="What you came for" name="want" options={WANTS} type="checkbox" />
      </div>
      <div className="sm:col-span-2">
        <Field label="The number your business runs on" optional>
          <input name="number" placeholder="Orders, installs, demos, stockists" className={FIELD} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Anything we should know" optional>
          <textarea
            name="note"
            rows={4}
            className={`${FIELD} h-auto resize-y py-3 leading-[1.5]`}
          />
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 sm:col-span-2">
        <Submit>Send the request</Submit>
        <p className="max-w-[44ch] text-[14px] leading-[1.5] text-fog">
          It opens your email app with the request written out. Nothing is stored here.
        </p>
      </div>
    </form>
  );
}

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    openMail(`From ${get("name")}${get("company") ? `, ${get("company")}` : ""}`, [
      `Name: ${get("name")}`,
      `Email: ${get("email")}`,
      `Company: ${get("company") || "-"}`,
      "",
      get("message"),
    ]);
    setSent(true);
  }

  if (sent) {
    return (
      <Sent>
        We&apos;ve written your message into an email to {CONTACT_EMAIL}; send it and we reply
        within a business day.
      </Sent>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
      <Field label="Your name">
        <input name="name" required autoComplete="name" className={FIELD} />
      </Field>
      <Field label="Email">
        <input name="email" type="email" required autoComplete="email" className={FIELD} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Company" optional>
          <input name="company" autoComplete="organization" className={FIELD} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Message">
          <textarea
            name="message"
            required
            rows={5}
            className={`${FIELD} h-auto resize-y py-3 leading-[1.5]`}
          />
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 sm:col-span-2">
        <Submit>Send</Submit>
        <p className="max-w-[44ch] text-[14px] leading-[1.5] text-fog">
          It opens your email app with the message written out.
        </p>
      </div>
    </form>
  );
}
