import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import {
  Accent,
  ChapterHead,
  CONTAINER,
  CtaLink,
  GRID,
  Meta,
  TextLink,
} from "@/components/system";
import { CASES, VOICES } from "@/lib/home";

/*
  (04) Selected work: exhibit and ledger.

  One engagement is told in full as an exhibit: the client's own words,
  the From / Built / To evidence, and the result as the loudest number.
  Below it, a ledger lists every engagement on the same columns, so the
  exhibit reads as one entry of a longer record. Graphite room: paper for
  primary type, fog for secondary type and hairlines, signal for the small
  markers, and Plurel red on one surface only, the exhibit's CTA.
*/

type Case = (typeof CASES)[number];

const pad = (n: number) => String(n).padStart(2, "0");

/** Each case has an anchored article on /work, keyed by its slug */
const caseHref = (c: Case) => `/work#${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

const PAIRS = [
  ["From", "before"],
  ["Built", "built"],
  ["To", "after"],
] as const;

/* Hairlines on graphite, from the structural rules to the row dividers */
const RULE_STRONG = "border-fog/40";
const RULE = "border-fog/25";
const RULE_ROW = "border-fog/20";

/* The exhibit is the first case, with its client's own words */
const EXHIBIT = 0;
const FEATURED = CASES[EXHIBIT];
const VOICE = VOICES.find((v) => v.role.endsWith(`, ${FEATURED.name}`));

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper";

/** Separator dot for mono runs, spaced wider than a word gap */
function Dot() {
  return (
    <span aria-hidden className="px-1">
      ·
    </span>
  );
}

function Exhibit() {
  const c = FEATURED;
  return (
    <Reveal className="mt-12 lg:mt-14">
      <article>
        <div className={`${GRID} gap-y-2 border-t ${RULE_STRONG} pt-3.5`}>
          <Meta as="p" className="col-span-2 row-start-1 text-[12px] text-signal">
            Exhibit {pad(EXHIBIT + 1)}
          </Meta>
          <h3 className="col-span-4 row-start-2 sm:col-span-6 lg:col-span-7 lg:col-start-3 lg:row-start-1">
            <Meta className="block text-[12px] text-fog">
              {c.name} <Dot /> {c.services} <Dot /> {c.year}
            </Meta>
          </h3>
          <Meta
            as="p"
            className="col-span-2 col-start-3 row-start-1 text-right text-[12px] text-fog sm:col-span-2 sm:col-start-5 lg:col-span-3 lg:col-start-10"
          >
            Case {pad(EXHIBIT + 1)} of {pad(CASES.length)}
          </Meta>
        </div>

        <div className={`${GRID} mt-8 lg:mt-10 lg:gap-y-11`}>
          {/* The figure column's left rule, drawn across both rows */}
          <span
            aria-hidden
            className={`hidden border-l ${RULE} lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:block`}
          />

          {VOICE && (
            <div className="col-span-4 sm:col-span-5 lg:col-span-8 lg:row-start-1 lg:grid lg:grid-cols-8 lg:gap-x-8 lg:self-start">
              <blockquote className="lg:col-span-6 lg:col-start-3 lg:row-start-1">
                <p className="type-display relative text-[clamp(1.875rem,3.44vw,2.75rem)] leading-[1.04] [text-box:trim-both_cap_alphabetic]">
                  <span aria-hidden className="text-signal lg:absolute lg:right-full lg:mr-2.5">
                    &ldquo;
                  </span>
                  {VOICE.quote}
                  <span aria-hidden>&rdquo;</span>
                </p>
              </blockquote>
              {/* Sits on the quote's last baseline */}
              <p className="mt-6 flex flex-col gap-2.5 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:self-end">
                <span className="text-[16px] font-medium">{VOICE.name}</span>
                <Meta className="text-[12px] text-fog [text-box:trim-end_cap_alphabetic]">
                  {VOICE.role}
                </Meta>
              </p>
            </div>
          )}

          <div
            className={`col-span-4 mt-12 border-t ${RULE} pt-8 sm:col-span-6 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:mt-0 lg:border-t-0 lg:pt-0 lg:pl-8`}
          >
            <p className="type-display figures whitespace-nowrap text-[clamp(4.5rem,8.125vw,6.5rem)] leading-[0.82] [text-box:trim-both_cap_alphabetic]">
              {c.metric}
            </p>
            <p className="mt-4.5 text-[16px] text-fog">{c.metricLabel}</p>
          </div>

          <dl className="col-span-4 mt-8 grid gap-y-2 sm:col-span-6 sm:mt-10 sm:grid-cols-3 sm:gap-x-6 lg:col-span-6 lg:col-start-3 lg:row-start-2 lg:mt-0 lg:gap-x-8 lg:self-end">
            {PAIRS.map(([term, key]) => {
              const to = term === "To";
              return (
                <div
                  key={term}
                  className={`grid grid-cols-[44px_minmax(0,1fr)] items-baseline gap-x-3 sm:block sm:border-t ${RULE} sm:pt-3`}
                >
                  <Meta as="dt" className={`text-[12px] ${to ? "text-signal" : "text-fog"}`}>
                    {term}
                  </Meta>
                  <dd
                    className={`text-[14px] leading-[1.45] sm:mt-2 sm:text-balance ${to ? "text-paper" : "text-fog"}`}
                  >
                    {c[key]}
                  </dd>
                </div>
              );
            })}
          </dl>

          <div className="col-span-4 mt-8 sm:col-span-3 sm:mt-10 lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:mt-0 lg:self-end lg:pl-8">
            <CtaLink href={caseHref(c)} className={`w-full ${FOCUS_RING}`}>
              Read the {c.name} case
            </CtaLink>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function LedgerRow({ c, i }: { c: Case; i: number }) {
  const quiet = i === EXHIBIT;
  return (
    <li className={`border-b ${RULE_ROW}`}>
      <Reveal className={`${GRID} group relative ${quiet ? "py-5" : "py-6"} lg:pt-5 lg:pb-5.5`}>
        {/* The index hangs in its own column from sm up; on phones it leads the client line */}
        <Meta
          as="p"
          className="hidden self-baseline text-[12px] text-signal sm:col-span-1 sm:block lg:col-span-2"
        >
          {pad(i + 1)}
        </Meta>

        <div className="col-span-4 self-baseline sm:col-span-3 sm:col-start-2 lg:col-span-3 lg:col-start-3">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <Meta className="text-[12px] text-signal sm:hidden">{pad(i + 1)}</Meta>
            <h3
              className={`type-display text-[clamp(1.5rem,2.1875vw,1.75rem)] leading-none transition-colors duration-300 lg:whitespace-nowrap ${
                quiet
                  ? "text-paper/52 group-hover:text-paper/80"
                  : "text-paper/85 group-hover:text-paper"
              }`}
            >
              <Link
                href={caseHref(c)}
                aria-label={`${c.name}: ${c.metric} ${c.metricLabel.toLowerCase()}`}
                className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-paper"
              >
                {c.name}
              </Link>
            </h3>
            {quiet && (
              <Meta className="text-[12px] text-fog lg:hidden">
                <Dot /> Shown above
              </Meta>
            )}
          </div>
          <Meta
            as="p"
            className={`mt-2.5 text-[12px] ${quiet ? "hidden text-paper/52 lg:block" : "text-fog"}`}
          >
            {c.services}{" "}
            <span className="whitespace-nowrap">
              <Dot /> {c.year}
            </span>
          </Meta>
        </div>

        <div
          className={`col-span-4 mt-5 sm:col-span-2 sm:col-start-5 sm:row-start-1 sm:mt-0 sm:text-right lg:col-span-3 lg:col-start-10 ${quiet ? "hidden lg:block" : ""}`}
        >
          <p
            className={`type-display figures whitespace-nowrap text-[clamp(2.75rem,4.375vw,3.5rem)] leading-[0.84] ${quiet ? "text-paper/52" : ""}`}
          >
            {c.metric}
          </p>
          <Meta
            as="p"
            className={`mt-3 inline-flex items-center gap-2.5 text-[12px] transition-colors duration-300 ${
              quiet ? "text-paper/52 group-hover:text-fog" : "text-fog group-hover:text-paper"
            }`}
          >
            {c.metricLabel}
            <ArrowUpRight
              aria-hidden
              strokeWidth={2}
              className="size-3.5 shrink-0 text-fog transition-[color,transform] duration-300 group-hover:text-signal motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
            />
          </Meta>
        </div>

        {quiet ? (
          <Meta
            as="p"
            className="hidden text-[12px] text-fog lg:col-span-4 lg:col-start-6 lg:row-start-1 lg:block lg:pt-2"
          >
            Shown above <Dot /> Exhibit {pad(EXHIBIT + 1)}
          </Meta>
        ) : (
          <dl className="col-span-4 mt-4 grid gap-y-1.5 sm:col-span-5 sm:col-start-2 sm:mt-5 lg:col-span-4 lg:col-start-6 lg:row-start-1 lg:mt-0 lg:pt-1">
            {PAIRS.map(([term, key]) => {
              const to = term === "To";
              return (
                <div
                  key={term}
                  className="grid grid-cols-[44px_minmax(0,1fr)] items-baseline gap-x-3"
                >
                  <Meta as="dt" className={`text-[12px] ${to ? "text-signal" : "text-fog"}`}>
                    {term}
                  </Meta>
                  <dd className={`text-[14px] leading-[1.45] ${to ? "text-paper" : "text-fog"}`}>
                    {c[key]}
                  </dd>
                </div>
              );
            })}
          </dl>
        )}
      </Reveal>
    </li>
  );
}

function Ledger() {
  return (
    <div className="mt-16">
      <div
        aria-hidden
        className={`hidden border-b ${RULE_STRONG} pb-3 lg:grid lg:grid-cols-12 lg:gap-x-8`}
      >
        <Meta as="p" className="col-span-2 text-[12px] text-paper/50">
          No.
        </Meta>
        <Meta as="p" className="col-span-3 text-[12px] text-fog">
          Client
        </Meta>
        <Meta as="p" className="col-span-4 text-[12px] text-fog">
          From <Dot /> Built <Dot /> To
        </Meta>
        <Meta as="p" className="col-span-3 text-right text-[12px] text-fog">
          Result
        </Meta>
      </div>
      <ol className={`border-t ${RULE_STRONG} lg:border-t-0`}>
        {CASES.map((c, i) => (
          <LedgerRow key={c.name} c={c} i={i} />
        ))}
      </ol>
    </div>
  );
}

/** (04) Selected work: one exhibit told in full, then the ledger of every engagement */
export function WorkChapter() {
  return (
    <section id="work" aria-labelledby="work-heading" className="relative bg-graphite text-paper">
      <div className={`${CONTAINER} py-24 lg:py-36`}>
        <ChapterHead
          index="04"
          label="Selected work"
          meta="Transformations, with the numbers"
          tone="dark"
        />

        <div className={`${GRID} mt-14 gap-y-6 lg:items-end`}>
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-8">
            <h2
              id="work-heading"
              className="type-display text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.02]"
            >
              Recent <Accent className="text-fog">transformations</Accent>.
            </h2>
          </Reveal>
          <Reveal
            delay={0.1}
            className="col-span-4 sm:col-span-4 lg:col-span-3 lg:col-start-10 lg:pb-1"
          >
            <p className="max-w-[34ch] text-[15px] leading-normal text-balance text-fog">
              Every scope states what it should return. Quarterly reviews hold the work to it.
            </p>
            <TextLink href="/work" tone="dark" className={`mt-5 ${FOCUS_RING}`}>
              All case studies
            </TextLink>
          </Reveal>
        </div>

        <Exhibit />
        <Ledger />
      </div>
    </section>
  );
}
