import { Plus } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import {
  Accent,
  ChapterHead,
  CONTAINER,
  GRID,
} from "@/components/system";
import { FAQS } from "@/lib/home";
import { CONTACT_EMAIL } from "@/lib/nav";

/** FAQPage structured data, built from the same source as the list */
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

/** (07) Straight answers, as native disclosure rows */
export function FaqChapter() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative bg-paper text-ink"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <div className={`${CONTAINER} relative py-24 lg:py-36`}>
        <ChapterHead index="07" label="Questions" meta="Asked before every engagement" />

        <div className={`${GRID} mt-14 gap-y-12 lg:mt-20`}>
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-4">
            <h2
              id="faq-heading"
              className="text-[clamp(2.25rem,4.4vw,4.25rem)] font-normal leading-[0.98] tracking-[-0.04em]"
            >
              Straight <Accent>answers</Accent>.
            </h2>
            <p className="mt-6 max-w-[32ch] text-[16px] leading-relaxed text-ink/70">
              Something we didn&apos;t cover? Write to us and a strategist will
              reply within a business day.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-5 inline-block border-b border-brand pb-1 text-[17px] text-ink transition-colors hover:text-brand"
            >
              {CONTACT_EMAIL}
            </a>
          </Reveal>

          <div className="col-span-4 border-b border-ink/15 sm:col-span-6 lg:col-span-7 lg:col-start-6">
            {FAQS.map((item) => (
              <details key={item.q} className="group border-t border-ink/15">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-[19px] leading-snug tracking-[-0.01em] transition-colors hover:text-brand lg:text-[21px] [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <Plus className="mt-1 size-5 shrink-0 text-brand transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="max-w-[62ch] pb-8 text-[16px] leading-relaxed text-ink/70">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
