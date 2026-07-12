import { Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";

/*
 * Shared armature for legal documents — the ledger treatment applied to
 * prose: numbered ruled sections, readable type, no legalese walls.
 */
export function LegalPage({
  kicker,
  title,
  updated,
  sections,
}: {
  kicker: string;
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <main>
      <section aria-labelledby="legal-heading">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-10 pt-12 sm:px-8 lg:px-12 lg:pb-12 lg:pt-20">
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                <Spark className="size-3.5 text-brand" aria-hidden />
                {kicker}
              </p>
              <h1
                id="legal-heading"
                className="mt-5 max-w-[16ch] font-sans text-[clamp(2.25rem,5vw,4.25rem)] font-normal leading-[1.02] tracking-[-0.02em] text-ink"
              >
                {title}
              </h1>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              Last updated &mdash; {updated}
            </p>
          </div>
        </div>
      </section>

      <section aria-label={`${title} sections`} className="border-t border-line bg-paper">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="border-b border-line">
            <ol>
              {sections.map((section, i) => (
                <li
                  key={section.heading}
                  className="grid grid-cols-1 gap-x-10 border-t border-line py-8 sm:grid-cols-[3.5rem_240px_minmax(0,1fr)] sm:py-10"
                >
                  <span className="text-[11px] font-semibold tabular-nums tracking-[0.08em] text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-2 max-w-[18ch] text-[17px] font-medium leading-snug tracking-[-0.01em] text-ink sm:mt-0">
                    {section.heading}
                  </h2>
                  <div className="mt-3 max-w-[68ch] space-y-4 sm:mt-0">
                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 32)}
                        className="text-[14.5px] leading-relaxed text-ink/75"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <Reveal className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
            <p className="text-[13px] leading-relaxed text-muted">
              Questions about this document &mdash; write to us any time.
            </p>
            <a
              href="mailto:hello@plurel.com"
              className="text-[13px] font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:text-brand"
            >
              hello@plurel.com
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
