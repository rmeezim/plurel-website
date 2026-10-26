import Link from "next/link";
import { ContactForm } from "@/components/diagnostic-form";
import { Closing, PageHead, Room } from "@/components/page";
import { Reveal } from "@/components/reveal";
import { CtaLink, GRID } from "@/components/system";
import { pageMetadata } from "@/lib/metadata";
import { AUDIT_HREF, CONTACT_EMAIL } from "@/lib/nav";
import { SAMPLE_HREF } from "@/lib/proof";

export const metadata = pageMetadata({
  title: "Contact — Plurel",
  description:
    "Write to Plurel about press, partnerships, working here or anything else, and a person replies within a business day. For a read of your distribution, request a diagnostic.",
  path: "/contact/",
});

/*
  /contact: the plain way to write to us. The message form on columns
  1-7, and beside it the ways in, each a line on a hairline (new
  business points to the Diagnostic, the rest are one inbox with the
  subject written for you), and where we are. Closes in the red room on
  the Diagnostic.
*/

const LINK = "underline decoration-signal underline-offset-4 transition-colors hover:text-signal";

const mail = (subject: string) => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;

const WAYS = [
  {
    term: "New business",
    value: (
      <Link href={AUDIT_HREF} className={LINK}>
        Request a diagnostic
      </Link>
    ),
  },
  {
    term: "Everything else",
    value: (
      <a href={`mailto:${CONTACT_EMAIL}`} className={LINK}>
        {CONTACT_EMAIL}
      </a>
    ),
  },
  {
    term: "Press",
    value: (
      <a href={mail("Press")} className={LINK}>
        Write about a story
      </a>
    ),
  },
  {
    term: "Working here",
    value: (
      <a href={mail("Working at Plurel")} className={LINK}>
        Send the work you’re proudest of
      </a>
    ),
  },
  { term: "Where", value: "New York, and remote." },
];

export default function ContactPage() {
  return (
    <main data-room="dark" className="bg-graphite text-paper">
      <PageHead
        lines={["Get in touch."]}
        standfirst="Press, partnerships, working here or anything else: write to us and a person replies within a business day."
      />

      <Room labelledBy="write-heading" className="pt-0 lg:pt-4">
        <div className={`${GRID} gap-y-16 border-t border-paper/15 pt-10 lg:pt-14`}>
          <div className="col-span-4 sm:col-span-6 lg:col-span-7">
            <h2 id="write-heading" className="type-title text-[clamp(1.5rem,1.2rem+1vw,2.125rem)] leading-[1.12]">
              Write to us
            </h2>
            <Reveal className="mt-8 lg:mt-10">
              <ContactForm />
            </Reveal>
          </div>

          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-4 lg:col-start-9">
            <h2 className="type-title text-[clamp(1.5rem,1.2rem+1vw,2.125rem)] leading-[1.12]">Other ways in</h2>
            <dl className="mt-8 border-b border-paper/15 lg:mt-10">
              {WAYS.map((w) => (
                <div key={w.term} className="border-t border-paper/15 py-4">
                  <dt className="text-[14px] font-medium text-fog">{w.term}</dt>
                  <dd className="mt-1 text-[17px] leading-[1.4]">{w.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Room>

      <Closing lines={["The fastest way in", "is the Diagnostic."]}>
        <CtaLink href={AUDIT_HREF} variant="paper">
          Request a diagnostic
        </CtaLink>
        <CtaLink href={SAMPLE_HREF} variant="outline-light" arrow="right">
          See a sample
        </CtaLink>
      </Closing>
    </main>
  );
}
