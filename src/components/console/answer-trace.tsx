"use client";

import { Fragment, useRef, useState } from "react";
import { Console, useSim } from "@/components/console/console";
import { Chip, Controls, Figure } from "@/components/console/parts";

/*
  AI Search & SEO: an answer, traced. A buyer asks an assistant; it fans
  the question out into searches, reads the sources it finds, and writes
  an answer that cites some of them. Today the brand is missing from the
  sources it reads, so it is missing from the answer; after the work
  (pages written to be quoted, reviews where reviewers look) the same
  question reads its pages and names it. Choose a question and a moment;
  point at a source or a sentence to see what cites what. Simulated
  answers with placeholder brands: no assistant was queried.
*/

type Src = { kind: string; title: string; rel: number; yours?: boolean };
type Sentence = { text: string; cites: number[] };
type Run = { searches: string[]; sources: Src[]; answer: Sentence[] };
type Q = { q: string; today: Run; after: Run };

const QUESTIONS: Q[] = [
  {
    q: "What’s a good running shoe for flat feet?",
    today: {
      searches: ["best stability running shoes flat feet", "running shoes overpronation review", "podiatrist recommended running shoes"],
      sources: [
        { kind: "Review site", title: "Best stability shoes, tested over 300 miles", rel: 0.92 },
        { kind: "Forum thread", title: "Flat feet runners: what finally worked?", rel: 0.81 },
        { kind: "Brand A", title: "Guide 17: stability running shoe", rel: 0.74 },
        { kind: "Video transcript", title: "A podiatrist reviews five stability shoes", rel: 0.7 },
        { kind: "Encyclopedia", title: "Overpronation", rel: 0.55 },
        { kind: "Your site", title: "Arc, product page", rel: 0.31, yours: true },
      ],
      answer: [
        { text: "For flat feet, most reviewers point to stability shoes with a firm midsole.", cites: [1] },
        { text: "Brand A’s Guide line is the most recommended, and Brand B is a common pick for wider feet.", cites: [1, 4, 2] },
        { text: "Look for a structured heel, and try them late in the day when feet are largest.", cites: [5] },
      ],
    },
    after: {
      searches: ["best stability running shoes flat feet", "running shoes overpronation review", "stability shoes measured heel drop"],
      sources: [
        { kind: "Review site", title: "Best stability shoes, tested over 300 miles", rel: 0.92 },
        { kind: "Your site", title: "Stability shoes compared, with measured arch heights", rel: 0.88, yours: true },
        { kind: "Forum thread", title: "Flat feet runners: what finally worked?", rel: 0.81 },
        { kind: "Your site", title: "Which of our shoes suit flat feet?", rel: 0.79, yours: true },
        { kind: "Video transcript", title: "A podiatrist reviews five stability shoes", rel: 0.7 },
        { kind: "Brand A", title: "Guide 17: stability running shoe", rel: 0.66 },
      ],
      answer: [
        { text: "For flat feet, most reviewers point to stability shoes with a firm midsole.", cites: [1] },
        { text: "Brand A’s Guide line is widely recommended, and [Your brand]’s Arc is a frequent pick for its measured arch support and wide fit.", cites: [1, 5, 2, 4] },
        { text: "Look for a structured heel, and try them late in the day when feet are largest.", cites: [3] },
      ],
    },
  },
  {
    q: "Which project tool suits a ten-person design studio?",
    today: {
      searches: ["project management tool small design studio", "best tool client approvals agency", "project tool time tracking studio"],
      sources: [
        { kind: "Comparison site", title: "Twelve project tools for creative teams", rel: 0.9 },
        { kind: "Review site", title: "Brand D reviews: studios and agencies", rel: 0.83 },
        { kind: "Forum thread", title: "What does your studio use for projects?", rel: 0.77 },
        { kind: "Trade press", title: "How studios run work without a producer", rel: 0.61 },
        { kind: "Your site", title: "Home page", rel: 0.28, yours: true },
      ],
      answer: [
        { text: "Small studios often choose Brand C for its simple boards, or Brand D if they want time tracking built in.", cites: [1, 3, 2] },
        { text: "Most offer free trials, so test with a live project before committing.", cites: [4] },
      ],
    },
    after: {
      searches: ["project management tool small design studio", "best tool client approvals agency", "studio project tool pricing per seat"],
      sources: [
        { kind: "Comparison site", title: "Twelve project tools for creative teams", rel: 0.9 },
        { kind: "Review site", title: "Studio tools, reviewed by the people who use them", rel: 0.86 },
        { kind: "Your site", title: "Client sign-off, explained with a real project", rel: 0.84, yours: true },
        { kind: "Forum thread", title: "What does your studio use for projects?", rel: 0.77 },
        { kind: "Your site", title: "Pricing for teams of 5 to 20", rel: 0.72, yours: true },
        { kind: "Trade press", title: "How studios run work without a producer", rel: 0.61 },
      ],
      answer: [
        { text: "Small studios often choose Brand C for its simple boards, or Brand D for built-in time tracking.", cites: [1, 4] },
        { text: "[Your brand] is singled out by reviewers for client sign-off and pricing made for studios of this size.", cites: [2, 3, 5] },
        { text: "Test any of them with a live project before committing.", cites: [6] },
      ],
    },
  },
  {
    q: "Where can I buy organic coffee beans in bulk?",
    today: {
      searches: ["buy organic coffee beans bulk", "wholesale organic coffee 5kg", "best coffee subscription organic"],
      sources: [
        { kind: "Marketplace", title: "Organic coffee beans, wholesale listings", rel: 0.88 },
        { kind: "Review site", title: "The best coffee subscriptions, ranked", rel: 0.8 },
        { kind: "Brand E", title: "Organic subscription plans", rel: 0.74 },
        { kind: "Forum thread", title: "Buying beans in bulk without losing freshness", rel: 0.69 },
        { kind: "Your site", title: "Shop, all coffee", rel: 0.33, yours: true },
      ],
      answer: [
        { text: "Specialty roasters and wholesale marketplaces both sell organic beans in bulk.", cites: [1, 4] },
        { text: "Brand E is a common pick for subscriptions, and local roasters often discount larger bags.", cites: [3, 2] },
      ],
    },
    after: {
      searches: ["buy organic coffee beans bulk", "wholesale organic coffee 5kg roast date", "best coffee subscription organic"],
      sources: [
        { kind: "Marketplace", title: "Organic coffee beans, wholesale listings", rel: 0.88 },
        { kind: "Your site", title: "Bulk organic beans, 1 to 5 kg, roast date on every bag", rel: 0.86, yours: true },
        { kind: "Review site", title: "The best coffee subscriptions, ranked", rel: 0.8 },
        { kind: "Your site", title: "How long do whole beans stay fresh?", rel: 0.75, yours: true },
        { kind: "Brand E", title: "Organic subscription plans", rel: 0.66 },
      ],
      answer: [
        { text: "Specialty roasters and wholesale marketplaces both sell organic beans in bulk.", cites: [1] },
        { text: "[Your brand] ships certified organic beans in 1 to 5 kg bags, with the roast date on every bag.", cites: [2, 4] },
        { text: "Brand E is a common pick for subscriptions.", cites: [5, 3] },
      ],
    },
  },
];

// the run: searches, then sources read one by one, then the answer written word by word
const T_SEARCH = 0.6;
const T_READ = 2.2;
const T_WRITE = 4.4;
const WPS = 9;

export function AnswerTraceConsole() {
  const frame = useRef<HTMLElement>(null);
  const [qi, setQi] = useState(0);
  const [after, setAfter] = useState(false);
  const run = after ? QUESTIONS[qi].after : QUESTIONS[qi].today;
  const words = run.answer.reduce((n, s) => n + s.text.split(" ").length, 0);
  const END = T_WRITE + words / WPS + 0.6;
  const sim = useSim(frame, { end: END, rate: 1, by: 1, hz: 30 });
  const [hot, setHot] = useState<{ src?: number; sent?: number } | null>(null);
  const t = sim.t;

  const choose = (q: number, a: boolean) => {
    setQi(q);
    setAfter(a);
    setHot(null);
    sim.reset();
  };

  const searchesShown = Math.min(run.searches.length, Math.floor((t - T_SEARCH) / 0.45) + 1);
  const readN = Math.max(0, Math.min(run.sources.length, Math.floor((t - T_READ) / 0.32) + 1));
  const written = Math.max(0, Math.floor((t - T_WRITE) * WPS));
  const lengths = run.answer.map((s) => s.text.split(" ").length);
  const before = lengths.map((_, i) => lengths.slice(0, i).reduce((a, n) => a + n, 0));
  const shown = run.answer.map((s, i) => {
    const w = s.text.split(" ");
    const n = Math.max(0, Math.min(w.length, written - before[i]));
    return { ...s, part: w.slice(0, n).join(" "), done: n === w.length };
  });
  const cited = new Set(shown.filter((s) => s.done).flatMap((s) => s.cites));
  const done = t >= END - 0.6;
  const named = shown.some((s) => s.part.includes("[Your brand]"));
  const yoursRead = run.sources.slice(0, readN).filter((s) => s.yours).length;
  const yoursCited = run.sources.filter((s, i) => s.yours && cited.has(i + 1)).length;

  const hl = (src: number) => (hot?.src === src ? "on" : hot?.sent != null && run.answer[hot.sent].cites.includes(src) ? "on" : hot ? "off" : "");

  return (
    <Console
      sim={sim}
      frameRef={frame}
      title="Answer trace"
      clock={`${t.toFixed(1).padStart(4, "0")} s`}
      label="A simulated AI answer, traced: the question, the searches the assistant runs, the sources it reads with their relevance, and the answer it writes with citations. Today the brand is missing; after the work its pages are read and it is named."
      stepLabel="Step one second"
      readout={
        done
          ? named
            ? `Named in the answer, with ${yoursCited} of its own pages cited. Nothing about the product changed: the assistant found pages written to be quoted, and reviews where reviewers look.`
            : `Not named. The assistant read ${yoursRead ? "one of its pages, too thin to cite," : "none of its pages"} and wrote the answer from what others say.`
          : t < T_READ
            ? "The assistant turns the question into searches."
            : t < T_WRITE
              ? "It reads what the searches return, most relevant first."
              : "It writes the answer, citing what it read."
      }
      note="Simulated answers with placeholder brands, not a client’s results: no assistant was queried. Which questions to trace, and on which assistants, is set in the Diagnostic."
    >
      <Controls>
        <div role="group" aria-label="The question" className="flex flex-wrap gap-1.5">
          {QUESTIONS.map((q, i) => (
            <Chip key={q.q} on={qi === i} onClick={() => choose(i, after)}>
              {["Running shoes", "Studio software", "Coffee in bulk"][i]}
            </Chip>
          ))}
        </div>
        <div role="group" aria-label="When" className="flex gap-1.5 sm:ml-auto">
          <Chip on={!after} onClick={() => choose(qi, false)}>
            Today
          </Chip>
          <Chip on={after} onClick={() => choose(qi, true)}>
            After the work
          </Chip>
        </div>
      </Controls>

      <div className="grid lg:grid-cols-12">
        <div className="border-b border-paper/12 px-3 py-4 sm:px-4 lg:col-span-3 lg:border-b-0 lg:border-r">
          <p className="text-[13px] text-fog">The question</p>
          <p className="type-title mt-2 text-[20px] leading-[1.25]">{QUESTIONS[qi].q}</p>
          <p className="mt-5 text-[13px] text-fog">Searches it runs</p>
          <ol className="mt-2 space-y-1.5 font-mono text-[13px] leading-[1.35]">
            {run.searches.map((s, i) => (
              <li key={s} className={`transition-opacity duration-300 ${i < searchesShown ? "text-paper" : "opacity-0"}`}>
                <span className="text-fog">›</span> {s}
              </li>
            ))}
          </ol>
        </div>

        <div className="border-b border-paper/12 px-3 py-4 sm:px-4 lg:col-span-4 lg:border-b-0 lg:border-r">
          <p className="flex justify-between text-[13px] text-fog">
            <span>Sources it reads</span>
            <span>Relevance</span>
          </p>
          <ol className="mt-2">
            {run.sources.map((s, i) => {
              const n = i + 1;
              const read = i < readN;
              const state = hl(n);
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    onPointerEnter={() => setHot({ src: n })}
                    onPointerLeave={() => setHot(null)}
                    onFocus={() => setHot({ src: n })}
                    onBlur={() => setHot(null)}
                    className={`grid w-full grid-cols-[22px_1fr_56px] items-start gap-x-2 border-b border-paper/10 py-2 text-left transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-paper ${
                      !read ? "invisible" : state === "off" ? "opacity-35" : ""
                    }`}
                  >
                    <span className={`font-mono text-[13px] leading-[1.35] ${cited.has(n) ? (s.yours ? "text-signal" : "text-paper") : "text-fog"}`}>[{n}]</span>
                    <span className="min-w-0">
                      <span className={`block text-[13px] leading-[1.3] ${s.yours ? "text-signal" : "text-fog"}`}>{s.kind}</span>
                      <span className="block text-[14px] leading-[1.35] text-paper">{s.title}</span>
                    </span>
                    <span className="mt-1 flex flex-col items-end gap-1">
                      <span className="font-mono text-[13px] leading-none tabular-nums text-fog">{s.rel.toFixed(2)}</span>
                      <span aria-hidden className="h-[3px] w-full bg-paper/10">
                        <span className={`block h-full ${s.yours ? "bg-signal" : "bg-paper/70"}`} style={{ width: `${s.rel * 100}%` }} />
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="px-3 py-4 sm:px-4 lg:col-span-5">
          <p className="text-[13px] text-fog">The answer it writes</p>
          <div className="mt-2 min-h-[176px] text-[17px] leading-[1.55] lg:text-[18px]">
            {shown.map((s, i) =>
              s.part ? (
                <Fragment key={i}>
                  <span
                    onPointerEnter={() => s.done && setHot({ sent: i })}
                    onPointerLeave={() => setHot(null)}
                    className={`transition-opacity duration-300 ${hot && hot.sent !== i && !(hot.src != null && s.cites.includes(hot.src)) ? "opacity-35" : ""}`}
                  >
                    {renderBrand(s.part)}
                    {s.done && (
                      <span className="ml-1 align-super font-mono text-[12px] text-fog">
                        {s.cites.map((c) => `[${c}]`).join("")}
                      </span>
                    )}
                  </span>{" "}
                </Fragment>
              ) : null,
            )}
            {sim.running && t >= T_WRITE && !done && <span aria-hidden className="inline-block h-[1em] w-[7px] translate-y-[2px] bg-paper/70" />}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-x-4 border-t border-paper/12 pt-3">
            <Figure label="Named" value={done || named ? (named ? "Yes" : "No") : "…"} tone={named ? "signal" : "paper"} />
            <Figure label="Your pages read" value={`${yoursRead}`} />
            <Figure label="Your pages cited" value={`${yoursCited}`} tone={yoursCited ? "signal" : "paper"} />
          </div>
        </div>
      </div>
    </Console>
  );
}

function renderBrand(text: string) {
  const parts = text.split("[Your brand]");
  return parts.map((p, i) => (
    <Fragment key={i}>
      {i > 0 && <span className="text-signal underline decoration-1 underline-offset-[5px]">Your brand</span>}
      {p}
    </Fragment>
  ));
}
