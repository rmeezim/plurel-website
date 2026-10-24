import type { CSSProperties } from "react";
import { Reveal } from "@/components/reveal";
import { CONTAINER, CtaLink, GRID, Kicker } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import { AUDIT_HREF } from "@/lib/nav";
import s from "./came-for.module.css";

/*
  What you came for, on red, third on the page: the four things a company
  comes to Plurel for, in its own words (go viral, reach, press, a place
  in its buyers' minds, revenue), set as a worked sum rather than a menu.
  Reach times reputation times mindshare equals revenue: each one is
  bought from a different supplier, and they multiply, so a gap in any
  one empties the result. "Go viral" is said once, with the line that
  keeps it honest; the FAQ says it again.

  The sum is the chapter's headline, so the label stays visual and the
  heading is for screen readers. Layout and motion are in
  came-for.module.css. Server component: the terms are plotted by
  TypeReveal, the rules and operators drawn in CSS off its state.
*/

type Op = "times" | "equals";

const TERMS: readonly { op?: Op; term: string; want: string; how: string }[] = [
  {
    term: "Reach",
    want: "Be seen, and sometimes go viral.",
    how: "A viral moment is luck. Reach is a system: creators, short-form, paid and search, cut from one story.",
  },
  {
    op: "times",
    term: "Reputation",
    want: "Be talked about, and believed.",
    how: "Press and reviews that tell the story your ads tell, in your founder’s voice.",
  },
  {
    op: "times",
    term: "Mindshare",
    want: "Be the one they think of first.",
    how: "The same story in every place they look, including the answers AI gives them.",
  },
  {
    op: "equals",
    term: "Revenue",
    want: "Be chosen when they’re ready.",
    how: "A site and a path that turn the first three into the one number we answer for: orders, installs, demos or stockists.",
  },
];

/* The pen on each row, in ms: the rule, each of the operator's two
   strokes, then the term at the hero's pace */
const RULE = 360;
const STROKE = 140;
const PACE = 30;

function timing(op: Op | undefined, term: string) {
  const start = RULE + (op ? 2 * STROKE : 0);
  return { start, done: start + term.length * PACE };
}

const SPOKEN: Record<Op, string> = { times: "times", equals: "equals" };

export function CameForChapter() {
  return (
    <section aria-labelledby="came-for-heading" className="bg-brand text-paper">
      <div className={`${CONTAINER} py-24 lg:py-36`}>
        <h2 id="came-for-heading" className="sr-only">
          What you came for
        </h2>
        <div className={`${GRID} gap-y-7`}>
          <div aria-hidden className="col-span-4 sm:col-span-6 lg:col-span-8">
            <Kicker tone="red">What you came for</Kicker>
          </div>
          <Reveal className="col-span-4 sm:col-span-5 lg:col-span-4 lg:col-start-9">
            <p className="max-w-[42ch] text-[16px] leading-[1.55] lg:text-[17px]">
              Most companies buy each of these from a different supplier. They multiply:
              a viral moment nobody trusts sells little, and a reputation nobody sees
              sells nothing.
            </p>
          </Reveal>
        </div>

        <ol className={`${s.sum} mt-14 sm:mt-16 lg:mt-24`}>
          {TERMS.map((t) => {
            const { start, done } = timing(t.op, t.term);
            const result = t.op === "equals";
            return (
              <li
                key={t.term}
                className={`${s.row} grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline gap-x-2 pt-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:pt-6 lg:grid-cols-12 lg:gap-x-8 lg:pt-7 ${
                  result ? "pb-12 sm:pb-14 lg:pb-14" : "pb-8 sm:pb-9 lg:pb-9"
                }`}
                style={
                  {
                    "--rule": `${RULE}ms`,
                    "--stroke": `${STROKE}ms`,
                    "--done": `${done}ms`,
                  } as CSSProperties
                }
              >
                <span aria-hidden className={result ? s.total : s.rule} />
                <span className={`${s.op} col-start-1 row-start-1`}>
                  {t.op && (
                    <>
                      <span aria-hidden className={`${s.glyph} ${s[t.op]}`}>
                        <span className={s.stroke} />
                        <span className={s.stroke} />
                      </span>
                      <span className="sr-only">{SPOKEN[t.op]}</span>
                    </>
                  )}
                </span>
                <TypeReveal
                  as="h3"
                  pace={PACE}
                  delay={start}
                  className={`${s.term} type-display col-start-2 row-start-1 lg:col-span-7`}
                  lines={[t.term]}
                />
                <div
                  className={`${s.notes} col-start-2 mt-4 sm:mt-5 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:mt-0`}
                >
                  <p className={s.want}>{t.want}</p>
                  <p className={s.how}>{t.how}</p>
                </div>
                {result && <span aria-hidden className={s.bottom} />}
              </li>
            );
          })}
        </ol>

        <div className={`${GRID} mt-12 gap-y-8 sm:mt-14 lg:mt-16 lg:items-end`}>
          <TypeReveal
            as="p"
            variant="title"
            delay={RULE}
            className="type-title col-span-4 text-[clamp(1.375rem,1rem+1.5vw,2.375rem)] leading-[1.1] sm:col-span-6 lg:col-span-6 lg:col-start-2"
            lines={["Each supplier moves one term.", "We engineer the whole equation."]}
          />
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-4 lg:col-start-9">
            <CtaLink href={AUDIT_HREF} variant="paper">
              Start with the Diagnostic
            </CtaLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
