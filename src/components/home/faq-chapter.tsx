import type { ReactNode } from "react";
import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ChapterHead, CONTAINER, GRID, H2 } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
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

/** Hairlines between questions, and the list's own top and bottom rules */
const RULE = "border-paper/15";
const RULE_STRONG = "border-paper/60";

/*
  Questions: a quiet list. Each question is one line that opens; its
  answer waits until asked. Native <details>, so a question opens without
  JS, from the keyboard and for assistive tech, and search engines read
  every answer (as does the FAQPage data above). The first sentence of an
  answer is the takeaway, set in full paper. The Diagnostic's answer lifts its
  parenthetical list of the six parts out and sets it as a list.
*/

/** First sentence (the takeaway, in full paper) and the rest of the answer */
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
 * no line ends on a lone word. `before` leads the text (a space after the
 * lead sentence).
 *
 * Plain words run together as one string with their spaces in it: a
 * space left as a text node of its own sits between React's text markers,
 * where Chrome's accessibility tree drops it and the words run together
 * ("Howisthisdifferent..."). One that falls between two kept spans gets a
 * span of its own.
 */
function settle(text: string, keepTail = true, before = ""): ReactNode {
  const words = text.split(" ");
  let k = 0;
  if (keepTail) {
    k = 1;
    while (k < words.length && (k < 2 || words.slice(-k).join(" ").length < 10)) k++;
  }
  const head = words.slice(0, words.length - k);
  const parts: ReactNode[] = [];
  let run = before;
  const keep = (key: string, kept: string) => {
    if (run.trim()) parts.push(run);
    else if (run) parts.push(<span key={`${key}-gap`}>{run}</span>);
    run = "";
    parts.push(
      <span key={key} className="whitespace-nowrap">
        {kept}
      </span>,
    );
  };
  head.forEach((word, i) => {
    if (word.includes("-")) keep(`w${i}`, word);
    else run += word;
    if (i < head.length - 1 || k > 0) run += " ";
  });
  if (k > 0) keep("tail", words.slice(-k).join(" "));
  else if (run) parts.push(run);
  return <>{parts}</>;
}

const ANSWER = "max-w-[64ch] text-[16px] leading-[1.6] text-paper/65";

function Answer({ text }: { text: string }) {
  const [lead, rest] = splitLead(text);
  return (
    <>
      <strong className="font-medium text-paper">{settle(lead, !rest)}</strong>
      {rest && settle(rest, true, " ")}
    </>
  );
}

/** Questions: a list of questions, each opening onto its answer */
export function FaqChapter() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-graphite text-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(FAQ_JSON_LD).replace(/</g, "\\u003c"),
        }}
      />
      <div className={`${CONTAINER} py-24 lg:py-36`}>
        <ChapterHead label="Questions" tone="dark" />

        <header className={`${GRID} mt-8 gap-y-6 lg:mt-10 lg:items-end`}>
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

        <Reveal className={`mt-12 border-b ${RULE_STRONG} lg:mt-16`}>
          {FAQS.map((item, i) => {
            const lifted = liftDimensions(item.a);
            return (
              <details
                key={item.q}
                className={`group border-t ${i === 0 ? RULE_STRONG : RULE}`}
              >
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-5 transition-colors duration-300 hover:text-signal group-open:text-signal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal lg:py-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="type-title max-w-[60ch] text-[20px] leading-[1.2] lg:text-[24px]">
                    {settle(item.q)}
                  </h3>
                  {/* plus, and minus once open */}
                  <span aria-hidden className="relative size-3.5 shrink-0 text-signal">
                    <span className="absolute inset-x-0 top-[6px] h-[2px] bg-current" />
                    <span className="absolute inset-y-0 left-[6px] w-[2px] bg-current transition-transform duration-300 group-open:scale-y-0 motion-reduce:transition-none" />
                  </span>
                </summary>
                <div className={`${GRID} pb-7 motion-safe:group-open:animate-[faq-open_0.45s_cubic-bezier(0.22,0.61,0.36,1)] lg:pb-9`}>
                  <div className="col-span-4 sm:col-span-6 lg:col-span-8">
                    <p className={ANSWER}>
                      <Answer text={lifted.text} />
                    </p>
                    {lifted.dimensions.length > 0 && (
                      <ul
                        aria-label="The six parts"
                        className="mt-4 grid max-w-[64ch] sm:grid-cols-2 sm:gap-x-8"
                      >
                        {lifted.dimensions.map((dimension) => (
                          <li
                            key={dimension}
                            className={`flex items-baseline gap-2.5 border-t ${RULE} py-2 text-[14px] leading-[1.35] text-paper`}
                          >
                            <span aria-hidden className="size-[5px] shrink-0 -translate-y-0.5 bg-signal" />
                            {dimension}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </details>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
