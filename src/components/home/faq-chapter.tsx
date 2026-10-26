import { ArrowUpRight } from "@/components/icons";
import { faqJsonLd, QuestionList } from "@/components/questions";
import { CONTAINER, GRID, H2 } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import { FAQS } from "@/lib/home";
import { CONTACT_EMAIL } from "@/lib/nav";

/*
  Questions, on graphite: "Straight answers." and the way to ask more,
  then the shared question list (components/questions.tsx) and its
  FAQPage data.
*/

/** The homepage's questions */
export function FaqChapter() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-graphite text-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: faqJsonLd(FAQS),
        }}
      />
      <div className={`${CONTAINER} py-24 lg:py-36`}>
        <header className={`${GRID} gap-y-6 lg:items-end`}>
          <TypeReveal
            id="faq-heading"
            className={`${H2} col-span-4 sm:col-span-6 lg:col-span-8`}
            lines={["Straight answers."]}
          />
          <div className="col-span-4 lg:col-span-4 lg:col-start-9 lg:pb-1.5 xl:col-span-3 xl:col-start-10">
            <p className="max-w-[40ch] text-[15px] leading-[1.55] text-fog">
              Something we didn&apos;t cover? Write to us and a strategist will
              reply within a business day.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group relative mt-3 inline-flex items-center gap-2 border-b border-signal pb-1 text-[16px] font-medium text-paper transition-colors duration-300 after:absolute after:inset-x-0 after:-inset-y-2 hover:text-signal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
            >
              {CONTACT_EMAIL}
              <ArrowUpRight
                aria-hidden
                className="size-3.5 text-signal transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </header>

        <QuestionList items={FAQS} className="mt-12 lg:mt-16" />
      </div>
    </section>
  );
}
