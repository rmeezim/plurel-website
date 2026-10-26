import { PageHead } from "@/components/page";
import { Reveal } from "@/components/reveal";
import { CONTAINER, GRID, TextLink } from "@/components/system";
import { CONTACT_EMAIL } from "@/lib/nav";

/*
  The legal documents (privacy, terms) in the site's system: the page
  head, then each section on a hairline, its heading on columns 1-4 and
  its prose on 6-12 at a reading measure, then the way to ask about it,
  in the red room every page ends on. Plain words, no walls of legalese.
*/
export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <main data-room="dark" className="bg-graphite text-paper">
      <PageHead lines={[title]} standfirst={`Last updated ${updated}.`} id="legal-heading" />

      <section aria-label={`${title}, in full`}>
        <div className={`${CONTAINER} pb-24 lg:pb-32`}>
          <ol className="border-b border-paper/15">
            {sections.map((section) => (
              <li key={section.heading} className={`${GRID} gap-y-4 border-t border-paper/15 py-8 lg:py-10`}>
                <h2 className="type-title col-span-4 text-[20px] leading-[1.25] sm:col-span-6 lg:col-span-4 lg:text-[22px]">
                  {section.heading}
                </h2>
                <div className="col-span-4 max-w-[64ch] space-y-4 sm:col-span-6 lg:col-span-7 lg:col-start-6">
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)} className="text-[16px] leading-[1.65] text-fog">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="legal-questions" className="bg-brand text-paper">
        <div className={`${CONTAINER} py-16 lg:py-20`}>
          <Reveal className={`${GRID} gap-y-6 lg:items-end`}>
            <h2
              id="legal-questions"
              className="type-title col-span-4 text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] leading-[1.1] sm:col-span-6 lg:col-span-7"
            >
              Questions about this document? Write to us any time.
            </h2>
            <div className="col-span-4 sm:col-span-6 lg:col-span-4 lg:col-start-9">
              <TextLink href={`mailto:${CONTACT_EMAIL}`} tone="red">
                {CONTACT_EMAIL}
              </TextLink>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
