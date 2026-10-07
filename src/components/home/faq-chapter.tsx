import { Fragment, type ReactNode } from "react";
import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import {
  Accent,
  ChapterHead,
  CONTAINER,
  GRID,
  Meta,
} from "@/components/system";
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

/** Mono index type at sizes other than Meta's 11px: same face, case and tracking */
const MONO = "font-mono font-normal uppercase leading-snug tracking-[0.03em]";

/** Answer hairlines: the same rule weight as the running head */
const RULE = "border-ink/15";

/*
  The ledger's four topics. Questions are matched by their text in FAQS
  and keep the FAQS order inside a topic. A question that no topic lists
  joins CATCH_ALL, so everything in the JSON-LD stays visible on the page.
  The Growth Audit lifts its parenthetical list of dimensions out of the
  answer and sets it as a numbered index.
*/
const TOPICS = [
  {
    title: "The model",
    questions: [
      "How is this different from a full-service agency?",
      "Do we need every channel?",
    ],
  },
  {
    title: "Engagement & commercials",
    questions: [
      "What does a typical engagement look like?",
      "What does it cost?",
      "How quickly will we see results?",
    ],
  },
  {
    title: "Fit & team",
    questions: [
      "Do you work with companies like ours?",
      "We already have an in-house team or agency. Where do you fit?",
      "Who actually does the work?",
    ],
  },
  {
    title: "The Growth Audit",
    questions: ["What exactly is the Growth Audit, and why is it free?"],
    dimensions: true,
  },
];
const CATCH_ALL = 2;

const pad = (n: number) => String(n).padStart(2, "0");

const LEDGER = (() => {
  const listed = new Set(TOPICS.flatMap((topic) => topic.questions));
  let n = 0;
  return TOPICS.map((topic, i) => ({
    title: topic.title,
    dimensions: topic.dimensions ?? false,
    items: FAQS.filter(
      (item) =>
        topic.questions.includes(item.q) ||
        (i === CATCH_ALL && !listed.has(item.q)),
    ).map((item) => ({ ...item, n: ++n })),
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
const ANSWER_CELL = "mt-3 sm:pl-[38px] lg:col-span-5 lg:mt-0 lg:pl-0 xl:col-span-6";

function Answer({ text }: { text: string }) {
  const [lead, rest] = splitLead(text);
  return (
    <>
      <strong className="font-medium text-ink">{settle(lead, !rest)}</strong>
      {rest && <> {settle(rest)}</>}
    </>
  );
}

/** (07) Straight answers, as a grouped ledger: topic, question, answer */
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
        <ChapterHead index="07" label="Questions" meta="Asked before every engagement" />

        <header className={`${GRID} mt-10 gap-y-6 lg:items-end`}>
          <h2
            id="faq-heading"
            className="type-display col-span-4 text-[clamp(3.25rem,6.875vw,5.5rem)] leading-none sm:col-span-6 lg:col-span-8"
          >
            Straight <Accent className="text-muted">answers</Accent>.
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

        <div className="mt-10 border-b border-ink">
          {/* Column heads: desktop only; below lg each row reads top to bottom */}
          <div aria-hidden className="hidden border-t border-ink py-[11px] text-muted lg:block">
            <div className={GRID}>
              <Meta className="lg:col-span-2">Topic</Meta>
              <Meta className="lg:col-span-5 xl:col-span-4">Question</Meta>
              <Meta className="lg:col-span-5 xl:col-span-6">Answer</Meta>
            </div>
          </div>

          {LEDGER.map((group, g) => {
            const first = group.items[0].n;
            const last = group.items[group.items.length - 1].n;
            return (
              <Reveal
                key={group.title}
                delay={g * 0.08}
                className={`${GRID} border-t border-ink lg:items-baseline`}
              >
                <div className="col-span-4 flex items-baseline gap-x-4 pt-5 sm:col-span-6 lg:col-span-2 lg:block lg:pt-0 xl:pr-2">
                  <span aria-hidden className={`${MONO} block shrink-0 whitespace-nowrap text-[12px] text-brand`}>
                    {first === last ? pad(first) : `${pad(first)}–${pad(last)}`}
                  </span>
                  <h3 className="type-display text-[20px] leading-[1.1] lg:mt-2 lg:text-[17px] xl:text-[22px]">
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
                        <h4 className="type-display flex items-baseline text-[22px] leading-[1.14] lg:col-span-5 lg:pr-2 xl:col-span-4 xl:text-[24px]">
                          <span aria-hidden className={`${MONO} w-[38px] shrink-0 text-[13px] text-brand`}>
                            {pad(item.n)}
                          </span>
                          <span className="min-w-0">{settle(item.q)}</span>
                        </h4>

                        {lifted.dimensions.length > 0 ? (
                          <div className={ANSWER_CELL}>
                            <p className={ANSWER}>
                              <Answer text={lifted.text} />
                            </p>
                            <ol className="mt-3.5 grid sm:grid-cols-2 sm:gap-x-8">
                              {lifted.dimensions.map((dimension, d) => (
                                <li
                                  key={dimension}
                                  className={`${MONO} whitespace-nowrap border-t ${RULE} py-2 text-[12px] text-ink`}
                                >
                                  <span aria-hidden className="mr-2.5 text-brand">
                                    {pad(d + 1)}
                                  </span>
                                  {dimension}
                                </li>
                              ))}
                            </ol>
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
