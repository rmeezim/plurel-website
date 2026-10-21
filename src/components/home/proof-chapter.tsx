import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { CONTAINER, CtaLink, GRID, H2, Kicker, Meta } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import { AUDIT_HREF } from "@/lib/nav";
import { PROOF_ID, SAMPLE_DIAGNOSTIC as D, SAMPLE_TOTAL } from "@/lib/proof";

/*
  Proof: what a Diagnostic hands back, shown as an excerpt of one.

  There are no client cases yet, so the chapter shows the deliverable
  itself: a sample Diagnostic for Halden, a sample company the intro
  introduces as one, labelled as a sample in its top bar too. It is set
  as a sheet of paper on the graphite room, laid out like the printed
  report: section heads hang in the first three columns, the content
  runs on the other nine through subgrid. Mono only for the three month
  heads of the plan; scores are figures in the display face, with "out
  of 10" said once in the section head. Brand red marks the two weakest
  scores and the first fix.

  Server component. Motion: the headline on TypeReveal, the sheet's
  title (the company's name) letter by letter, Reveal for the rest, and
  the score bars and the plan's month cells drawing in once their block
  is revealed (gated by prefers-reduced-motion; no-JS and reduced motion
  get finished type and bars).
*/

const WEAK = 3;

/* Hairlines on the sheet */
const RULE = "border-ink/12";
const RULE_STRONG = "border-ink/25";

/* A bar draws left to right once its block's Reveal comes in. Collapsed
   only while armed; finished for no-JS, reduced motion and anything
   already on screen. */
const DRAW =
  "origin-left motion-safe:[.reveal-armed_&]:scale-x-0 " +
  "motion-safe:[.reveal-in_&]:transition-transform motion-safe:[.reveal-in_&]:duration-700 " +
  "motion-safe:[.reveal-in_&]:ease-[cubic-bezier(0.22,0.61,0.36,1)]";

/* A section of the sheet: its head hangs in columns 1-3 from lg, and the
   body runs on the other nine columns through subgrid */
function SheetSection({
  head,
  id,
  children,
  className = "",
}: {
  head: string;
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-labelledby={id}
      className={`${GRID} border-t ${RULE_STRONG} pt-5 ${className}`}
    >
      <h4
        id={id}
        className="col-span-4 text-[15px] font-medium leading-snug sm:col-span-6 lg:col-span-3"
      >
        {head}
      </h4>
      <div className="col-span-4 mt-6 sm:col-span-6 lg:col-span-9 lg:mt-0 lg:grid lg:grid-cols-subgrid">
        {children}
      </div>
    </section>
  );
}

function Score({ score, delay }: { score: number; delay: number }) {
  const weak = score <= WEAK;
  return (
    <div
      className="flex items-center gap-4"
      aria-label={`${score} out of 10`}
      role="img"
    >
      <p aria-hidden className="flex w-10 shrink-0 items-baseline">
        <span
          className={`type-title figures text-[28px] leading-none ${weak ? "text-brand" : ""}`}
        >
          {score}
        </span>
      </p>
      <span aria-hidden className="relative h-[6px] flex-1 bg-ink/8">
        <span
          className={`absolute inset-y-0 left-0 ${weak ? "bg-brand" : "bg-ink"} ${DRAW}`}
          style={{
            width: `${score * 10}%`,
            transitionDelay: `${200 + delay * 90}ms`,
          }}
        />
      </span>
    </div>
  );
}

function Parts() {
  return (
    <ol className="lg:col-span-9 lg:grid lg:grid-cols-subgrid">
      {D.parts.map((p, i) => (
        <li
          key={p.part}
          className={`grid grid-cols-4 items-baseline gap-x-5 border-t ${RULE} py-5 first:border-t-0 first:pt-0 sm:grid-cols-6 sm:gap-x-6 lg:col-span-9 lg:grid-cols-subgrid lg:gap-x-8 lg:py-6`}
        >
          <h5 className="col-span-2 text-[16px] font-medium leading-tight sm:col-span-3 lg:col-span-3">
            {p.part}
          </h5>
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Score score={p.score} delay={i} />
          </div>
          <p className="col-span-4 mt-3.5 max-w-[56ch] text-[15px] leading-[1.5] text-ink/75 sm:col-span-6 lg:col-span-4 lg:mt-0">
            {p.finding}
          </p>
        </li>
      ))}
    </ol>
  );
}

function Read() {
  return (
    <ul className="grid gap-y-8 sm:gap-y-10 lg:col-span-9 lg:grid-cols-subgrid">
      {D.read.map((r, i) => {
        const first = i === D.read.length - 1;
        return (
          <li
            key={r.head}
            className={`border-t-2 pt-4 lg:col-span-3 ${first ? "border-brand" : "border-ink"}`}
          >
            <h5 className={`text-[15px] font-medium ${first ? "text-brand" : ""}`}>
              {r.head}
            </h5>
            <p className="mt-3 max-w-[52ch] text-[17px] leading-[1.45] text-pretty">
              {r.text}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

const MONTHS = [1, 2, 3] as const;

function monthSpan(months: readonly number[]) {
  const a = months[0];
  const b = months[months.length - 1];
  return a === b ? `Month ${a}` : `Months ${a}–${b}`;
}

function Plan() {
  return (
    <div className="lg:col-span-9 lg:grid lg:grid-cols-subgrid">
      {/* Month heads over the three month columns (lg) */}
      <div
        aria-hidden
        className="hidden lg:col-span-9 lg:grid lg:grid-cols-subgrid lg:pb-3"
      >
        <span className="lg:col-span-2" />
        {MONTHS.map((m) => (
          <Meta key={m} className="text-muted">
            Month {m}
          </Meta>
        ))}
      </div>
      <ol className="lg:col-span-9 lg:grid lg:grid-cols-subgrid">
        {D.chain.map((s, i) => (
          <li
            key={s.stage}
            className={`grid grid-cols-4 items-baseline gap-x-5 border-t ${RULE} py-5 first:border-t-0 first:pt-0 sm:grid-cols-6 sm:gap-x-6 lg:col-span-9 lg:grid-cols-subgrid lg:gap-x-8 lg:py-5 lg:first:border-t lg:first:pt-5`}
          >
            <h5 className="col-span-2 text-[16px] font-medium sm:col-span-3 lg:col-span-2">
              {s.stage}
            </h5>
            <p className="col-span-2 self-baseline text-right text-[14px] text-muted sm:col-span-3 lg:hidden">
              {monthSpan(s.months)}
            </p>
            {/* Three month cells: one per column at lg */}
            <div
              aria-hidden
              className="col-span-4 mt-3 grid grid-cols-3 gap-x-1 sm:col-span-6 lg:col-span-3 lg:mt-0 lg:grid-cols-subgrid lg:gap-x-0 lg:self-center"
            >
              {MONTHS.map((m) => {
                const on = s.months.includes(m);
                return (
                  <span key={m} className="relative h-[10px] bg-ink/8 lg:mr-px">
                    {on && (
                      <span
                        className={`absolute inset-0 bg-ink ${DRAW}`}
                        style={{
                          transitionDelay: `${200 + (i * 3 + m) * 60}ms`,
                        }}
                      />
                    )}
                  </span>
                );
              })}
            </div>
            <p className="col-span-4 mt-3.5 max-w-[52ch] text-[15px] leading-[1.5] text-ink/75 sm:col-span-6 lg:col-span-4 lg:mt-0">
              <span className="sr-only">{monthSpan(s.months)}: </span>
              {s.line}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Measure() {
  return (
    <div className="lg:col-span-9 lg:grid lg:grid-cols-subgrid">
      <dl className="grid gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:col-span-8 lg:grid-cols-subgrid lg:gap-x-8">
        {D.measure.map((m) => (
          <div key={m.buyer} className="lg:col-span-4">
            <dt className="text-[15px] font-medium">
              {m.buyer}
            </dt>
            <dd className="type-title mt-3 max-w-[24ch] text-[clamp(1.375rem,2vw,1.625rem)] leading-[1.15]">
              {m.definition}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 max-w-[60ch] text-[15px] leading-[1.5] text-ink/75 lg:col-span-8 lg:mt-10">
        {D.measureNote}
      </p>
    </div>
  );
}

/** Proof: a sample Diagnostic, set as a sheet of the real report */
export function ProofChapter() {
  return (
    <section
      id={PROOF_ID}
      aria-labelledby="proof-heading"
      className="bg-graphite text-paper"
    >
      <div className={`${CONTAINER} py-24 lg:py-36`}>
        <div className={`${GRID} gap-y-8 lg:items-end`}>
          <div className="col-span-4 sm:col-span-6 lg:col-span-8">
            <Kicker tone="dark">Proof</Kicker>
            <TypeReveal
              id="proof-heading"
              className={`${H2} mt-8 lg:mt-10`}
              lines={["What a Diagnostic finds."]}
            />
          </div>
          <Reveal
            delay={0.1}
            className="col-span-4 sm:col-span-4 lg:col-span-3 lg:col-start-10 lg:pb-1"
          >
            <p className="max-w-[40ch] text-[16px] leading-[1.55] text-fog">
              Before you send us anything, see what comes back. This is an
              excerpt of a Diagnostic run on Halden, a sample company that
              sells quiet heat pumps to homeowners and housebuilders.
            </p>
          </Reveal>
        </div>

        <article
          aria-labelledby="proof-doc-title"
          className="mt-14 bg-paper px-5 pt-5 pb-10 text-ink sm:px-8 sm:pt-6 sm:pb-12 lg:mt-20 lg:px-12 lg:pt-7 lg:pb-16"
        >
          <Reveal>
            {/* Top bar: the sample label, in plain view */}
            <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2.5">
              <Kicker tone="paper">
                {D.label}
              </Kicker>
              <p className="text-[14px] font-medium text-brand">{D.note}</p>
            </div>

            {/* Title block */}
            <header
              className={`${GRID} mt-12 gap-y-10 sm:mt-16 lg:mt-20 lg:items-end`}
            >
              <div className="col-span-4 sm:col-span-6 lg:col-span-8">
                <p className="text-[15px] text-muted">{D.product}</p>
                <TypeReveal
                  as="h3"
                  id="proof-doc-title"
                  variant="chars"
                  delay={120}
                  className="type-display mt-3 text-[clamp(3.25rem,7vw,6rem)] leading-[0.9]"
                  lines={[D.client]}
                />
                <p className="mt-5 text-[17px] leading-snug text-ink/75">
                  {D.about}
                </p>
              </div>
              <dl className="col-span-4 text-[14px] sm:col-span-6 lg:col-span-4 lg:col-start-9">
                {D.facts.map((f) => (
                  <div
                    key={f.term}
                    className={`grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 border-t ${RULE} py-2.5`}
                  >
                    <dt className="text-muted">{f.term}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
                <div
                  className={`grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-x-4 border-y ${RULE} py-2.5`}
                >
                  <dt className="text-muted">Overall</dt>
                  <dd className="flex items-baseline gap-2">
                    <span className="type-title figures text-[22px] leading-none">
                      {SAMPLE_TOTAL}
                    </span>
                    <span className="text-[14px] text-muted">out of 60</span>
                  </dd>
                </div>
              </dl>
            </header>
          </Reveal>

          <div className="mt-14 space-y-14 sm:mt-16 sm:space-y-16 lg:mt-20 lg:space-y-20">
            <Reveal>
              <SheetSection head="Six parts, scored out of 10" id="proof-parts">
                <Parts />
              </SheetSection>
            </Reveal>
            <Reveal>
              <SheetSection head="The read" id="proof-read">
                <Read />
              </SheetSection>
            </Reveal>
            <Reveal>
              <SheetSection head="What runs first" id="proof-plan">
                <Plan />
              </SheetSection>
            </Reveal>
            <Reveal>
              <SheetSection head="What we would measure" id="proof-measure">
                <Measure />
              </SheetSection>
            </Reveal>
          </div>
        </article>

        <Reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 lg:mt-12">
          <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
          <p className="text-[15px] text-fog">
            Yours is free, and back within a business day.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
