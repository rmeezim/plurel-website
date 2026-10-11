import { Fragment, type ReactNode } from "react";
import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ChapterHead, CONTAINER, GRID, H2 } from "@/components/system";
import { FAQS } from "@/lib/home";
import { CONTACT_EMAIL } from "@/lib/nav";

/** FAQPage structured data, built from the same source as the ledger */
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

/** Hairlines between answers */
const RULE = "border-ink/15";

/*
  The ledger's four topics, in FAQS order. Questions are matched by their
  text in FAQS and keep the FAQS order inside a topic. A question that no
  topic lists joins CATCH_ALL, so everything in the JSON-LD stays visible
  on the page. The Diagnostic lifts its parenthetical list of the six
  parts out of the answer and sets it as a list.
*/
const TOPICS = [
  {
    title: "The model",
    questions: [
      "How is this different from a full-service agency?",
      "Do we need every channel?",
      "We already have an in-house team or agency. Where do you fit?",
    ],
  },
  {
    title: "Cost",
    questions: ["What does it cost?"],
  },
  {
    title: "Fit & team",
    questions: ["Do you work with companies like ours?", "Who actually does the work?"],
  },
  {
    title: "The Diagnostic",
    questions: ["What exactly is the Diagnostic, and why is it free?"],
    dimensions: true,
  },
];
const CATCH_ALL = 2;

const LEDGER = (() => {
  const listed = new Set(TOPICS.flatMap((topic) => topic.questions));
  return TOPICS.map((topic, i) => ({
    title: topic.title,
    dimensions: topic.dimensions ?? false,
    items: FAQS.filter(
      (item) =>
        topic.questions.includes(item.q) ||
        (i === CATCH_ALL && !listed.has(item.q)),
    ),
  })).filter((group) => group.items.length > 0);
})();

/** First sentence (the takeaway, set in ink) and the rest of the answer */
function splitLead(text: string): [string, string] {
  const match = text.match(/^(.+?[.?!])\s+([\s\S]+)$/);
  return match ? [match[1], match[2]] : [text, ""];
}

/** "(market and category, …, and measurement)" -> the answer without it, plus the list */
function liftDimensions(text: string): { text: string; dimensions: string[] } {
  const match = text.match(/\s*\(([^)]+)\)/);
  if (!match) return { text, dimensions: [] };
  const dimensions = match[1]
    .split(/,\s*/)
    .map((d) => d.replace(/^(?:and\s+)?(?:your\s+)?/, ""))
    .map((d) => d.charAt(0).toUpperCase() + d.slice(1));
  return { text: text.replace(match[0], ""), dimensions };
}

/**
 * Typesetting without changing a character: hyphenated compounds never
 * break, and (with keepTail) the last ten-odd characters stay together so
 * no line ends on a lone word.
 */
function settle(text: string, keepTail = true): ReactNode {
  const words = text.split(" ");
  let k = 0;
  if (keepTail) {
    k = 1;
    while (k < words.length && (k < 2 || words.slice(-k).join(" ").length < 10)) k++;
  }
  const head = words.slice(0, words.length - k);
  return (
    <>
      {head.map((word, i) => (
        <Fragment key={i}>
          {word.includes("-") ? <span className="whitespace-nowrap">{word}</span> : word}
          {i < head.length - 1 || k > 0 ? " " : ""}
        </Fragment>
      ))}
      {k > 0 && <span className="whitespace-nowrap">{words.slice(-k).join(" ")}</span>}
    </>
  );
}

const ANSWER = "max-w-[68ch] text-[15px] leading-[1.55] text-ink/65";
const ANSWER_CELL = "mt-3 lg:col-span-5 lg:mt-0 xl:col-span-6";

function Answer({ text }: { text: string }) {
  const [lead, rest] = splitLead(text);
  return (
    <>
      <strong className="font-medium text-ink">{settle(lead, !rest)}</strong>
      {rest && <> {settle(rest)}</>}
    </>
  );
}

/** Questions: a grouped ledger of topic, question, answer */
export function FaqChapter() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-paper text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(FAQ_JSON_LD).replace(/</g, "\\u003c"),
        }}
      />
      <div className={`${CONTAINER} py-24 lg:py-36`}>
        <ChapterHead label="Questions" />

        <header className={`${GRID} mt-8 gap-y-6 lg:mt-10 lg:items-end`}>
          <h2
            id="faq-heading"
            className={`${H2} col-span-4 sm:col-span-6 lg:col-span-8`}
          >
            Straight answers.
          </h2>
          <div className="col-span-4 lg:col-span-4 lg:col-start-9 lg:pb-1.5 xl:col-span-3 xl:col-start-10">
            <p className="max-w-[40ch] text-[15px] leading-[1.55] text-ink/70">
              Something we didn&apos;t cover? Write to us and a strategist will
              reply within a business day.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group relative mt-3 inline-flex items-center gap-2 border-b border-brand pb-1 text-[16px] font-medium text-ink transition-colors duration-300 after:absolute after:inset-x-0 after:-inset-y-2 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              {CONTACT_EMAIL}
              <ArrowUpRight
                aria-hidden
                className="size-3.5 text-brand transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </header>

        <div className="mt-12 border-b border-ink lg:mt-16">
          {LEDGER.map((group, g) => {
            return (
              <Reveal
                key={group.title}
                delay={g * 0.08}
                className={`${GRID} border-t border-ink lg:items-baseline`}
              >
                <div className="col-span-4 pt-5 sm:col-span-6 lg:col-span-2 lg:pt-0 xl:pr-2">
                  <h3 className="type-display text-[20px] leading-[1.1] text-brand lg:text-[17px] xl:text-[20px]">
                    {group.title}
                  </h3>
                </div>

                <div className="col-span-4 sm:col-span-6 lg:col-span-10">
                  {group.items.map((item) => {
                    const lifted = group.dimensions
                      ? liftDimensions(item.a)
                      : { text: item.a, dimensions: [] };
                    return (
                      <div
                        key={item.q}
                        className={`border-t ${RULE} pb-5 pt-4 first:border-t-0 lg:grid lg:grid-cols-10 lg:items-baseline lg:gap-x-8 lg:pb-[18px]`}
                      >
                        <h4 className="type-display text-[22px] leading-[1.14] lg:col-span-5 lg:pr-2 xl:col-span-4 xl:text-[24px]">
                          {settle(item.q)}
                        </h4>

                        {lifted.dimensions.length > 0 ? (
                          <div className={ANSWER_CELL}>
                            <p className={ANSWER}>
                              <Answer text={lifted.text} />
                            </p>
                            <ul
                              aria-label="The six parts"
                              className="mt-3.5 grid max-w-[68ch] sm:grid-cols-2 sm:gap-x-8"
                            >
                              {lifted.dimensions.map((dimension) => (
                                <li
                                  key={dimension}
                                  className={`flex items-baseline gap-2.5 border-t ${RULE} py-2 text-[14px] leading-[1.35] text-ink`}
                                >
                                  <span aria-hidden className="size-[5px] shrink-0 -translate-y-0.5 bg-brand" />
                                  {dimension}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p className={`${ANSWER} ${ANSWER_CELL}`}>
                            <Answer text={lifted.text} />
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
