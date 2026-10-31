import { Reveal } from "@/components/reveal";
import { Signature } from "@/components/signatures";
import { CONTAINER, CtaLink, GRID, H2 } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import { ENGAGEMENTS } from "@/lib/engagements";
import { AUDIT_HREF } from "@/lib/nav";

/*
  What you came for: the four engagements, after the thesis and what
  Plurel answers for, so the offer arrives once its reason has been made.
  Each is its name, what a company comes for in its own words, the
  drawing its page opens on (signatures.tsx), and a way in; then one
  line for anyone not sure which they need: the Diagnostic says.
*/

export function EngagementsChapter() {
  return (
    <section id="engagements" aria-labelledby="engagements-heading" className="border-t border-paper/10 bg-graphite text-paper">
      <div className={`${CONTAINER} py-24 lg:py-32`}>
        <div className={`${GRID} gap-y-6 lg:items-end`}>
          <TypeReveal id="engagements-heading" className={`${H2} col-span-4 sm:col-span-6 lg:col-span-7`} lines={["What you came for."]} />
          <Reveal className="col-span-4 sm:col-span-5 lg:col-span-4 lg:col-start-9 lg:pb-1">
            <p className="max-w-[40ch] text-[16px] leading-[1.55] text-fog">
              Four engagements, each named for what a company comes for, and each run on all four layers of one system, by one team, against one number.
            </p>
          </Reveal>
        </div>
        <ul className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:mt-20 lg:gap-y-20">
          {ENGAGEMENTS.map((e) => (
            <li key={e.key} className="flex flex-col border-t border-paper/20 pt-6">
              <h3 className="type-display text-[clamp(2.25rem,1.8rem+1.6vw,3.25rem)] leading-none">{e.term}</h3>
              <p className="type-title mt-3 text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-[1.3] text-fog">{e.want}</p>
              <div className="mt-8 max-w-[34rem]">
                <Signature k={e.key} />
              </div>
              <div className="mt-6">
                <CtaLink href={e.href} variant="outline-light" arrow="right">
                  {`See ${e.term}`}
                </CtaLink>
              </div>
            </li>
          ))}
        </ul>
        <Reveal>
          <div className="mt-16 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-t border-paper/15 pt-8 lg:mt-20">
            <p className="type-title text-[clamp(1.25rem,1.1rem+0.6vw,1.625rem)] leading-[1.3]">Not sure which you need? The Diagnostic says.</p>
            <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
