import { Reveal } from "@/components/reveal";
import { Signature } from "@/components/signatures";
import { CONTAINER, GRID, H2 } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";

/*
  Why Plurel exists, in one drawing: a buyer's way from a need to your
  door, the surfaces they pass on it, and how much of the choice is made
  before they arrive, where most marketing only starts. It draws once as
  it comes into view (signatures.tsx: wide from lg, time running down the
  page on a phone) and stays still: no pin, nothing to pause. Three short
  lines under it hand over to the thesis in the services chapter.
*/

const BEATS = [
  { head: "Across many surfaces", line: "They ask an assistant, search, watch creators, read the reviews and ask a friend, long before they reach you." },
  { head: "Each with its own supplier", line: "An agency for search, another for ads, a firm for press: each sees one surface, and nobody sees the whole." },
  { head: "One system for all of them", line: "Plurel reads every surface into one Ledger and moves them together, toward the one number you run on." },
];

export function ShiftChapter() {
  return (
    <section id="shift" aria-labelledby="shift-heading" className="border-t border-paper/10 bg-graphite text-paper">
      <div className={`${CONTAINER} py-24 lg:py-32`}>
        <div className={`${GRID} gap-y-6 lg:items-end`}>
          <TypeReveal id="shift-heading" className={`${H2} col-span-4 sm:col-span-6 lg:col-span-7`} lines={["Buyers decide", "before they arrive."]} />
          <Reveal className="col-span-4 sm:col-span-5 lg:col-span-4 lg:col-start-9 lg:pb-1">
            <p className="max-w-[40ch] text-[16px] leading-[1.55] text-fog">
              Before anyone reaches your site or your store, they have asked an assistant, searched, watched creators and read the reviews. Most of the choice is made
              there.
            </p>
          </Reveal>
        </div>
        <div className="mt-14 lg:mt-20">
          <Signature k="shift-wide" className="hidden lg:block" />
          <Signature k="shift-narrow" className="mx-auto max-w-[30rem] lg:hidden" />
        </div>
        <Reveal>
          <ol className="mt-14 grid gap-x-8 gap-y-8 border-t border-paper/15 pt-8 sm:grid-cols-3 lg:mt-20">
            {BEATS.map((b, i) => (
              <li key={b.head}>
                <p className={`text-[18px] font-medium leading-[1.3] ${i === 2 ? "text-signal" : "text-paper"}`}>{b.head}</p>
                <p className="mt-2 max-w-[36ch] text-[15px] leading-[1.55] text-fog">{b.line}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
