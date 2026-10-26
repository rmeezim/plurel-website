import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { GRID } from "@/components/system";

/*
  Questions: a quiet list, on the homepage (home/faq-chapter.tsx) and on
  the pages that answer their own (the Diagnostic, each discipline). Each
  question is one line that opens; its answer waits until asked. Native
  <details>, so a question opens without JS, from the keyboard and for
  assistive tech, and search engines read every answer (as does the
  FAQPage data a page carries, faqJsonLd). The first sentence of an answer
  is the takeaway, set in full paper.
*/

export type QA = { q: string; a: string };

/** FAQPage structured data, built from the same source as the list */
export function faqJsonLd(items: readonly QA[]) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }).replace(/</g, "\\u003c");
}

/** Hairlines between questions, and the list's own top and bottom rules */
const RULE = "border-paper/15";
const RULE_STRONG = "border-paper/60";

/** First sentence (the takeaway, in full paper) and the rest of the answer */
function splitLead(text: string): [string, string] {
  const match = text.match(/^(.+?[.?!])\s+([\s\S]+)$/);
  return match ? [match[1], match[2]] : [text, ""];
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

/** A list of questions, each opening onto its answer */
export function QuestionList({ items, className = "" }: { items: readonly QA[]; className?: string }) {
  return (
    <Reveal className={`border-b ${RULE_STRONG} ${className}`}>
      {items.map((item, i) => (
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
                <Answer text={item.a} />
              </p>
            </div>
          </div>
        </details>
      ))}
    </Reveal>
  );
}
