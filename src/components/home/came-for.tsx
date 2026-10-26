import { Reveal } from "@/components/reveal";
import { CONTAINER, CtaLink, GRID } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import { WantSelector, type Want } from "@/components/home/want-selector";
import { AUDIT_HREF } from "@/lib/nav";
import { PACKAGES } from "@/lib/packages";
import { STAGES } from "@/lib/services-type";

/*
  What you came for, on red, third on the page: the four things a company
  comes to Plurel for, in its own words (go viral, press, a place in its
  buyers' minds, revenue), and the point that they are one system. The
  four words are the headline and the controls at once (want-selector.tsx):
  pick one and the panel under them, a step deeper in ember, reads out
  what each layer of the Plurel System does for it. The layers are the
  ones the services chapter goes on to build, so this is the System's
  first sighting. Each want is also a package, and its panel links to the
  package's page. While the chapter is on screen the four take turns on
  their own, so a visitor sees that each can be chosen (want-selector.tsx).
  "Go viral" is said once, with the line that keeps it honest; the
  questions say it again.

  The chapter's heading is for screen readers; the four words carry it on
  screen. Server component around the client selector.
*/

/* The four wants are the four packages (lib/packages.ts): the panel reads
   each one's want, stance and layer lines, and links to its page */
const WANTS: readonly Want[] = PACKAGES.map((p) => ({
  key: p.key,
  term: p.term,
  want: p.want,
  stance: p.stance,
  layers: p.layers,
  href: p.href,
}));

export function CameForChapter() {
  return (
    <section aria-labelledby="came-for-heading" className="bg-brand text-paper">
      <div className={`${CONTAINER} py-24 lg:py-36`}>
        <h2 id="came-for-heading" className="sr-only">
          What you came for
        </h2>
        <WantSelector wants={WANTS} layerNames={STAGES.map((st) => st.name)} labelledBy="came-for-heading">
          <Reveal className={`${GRID} mt-6 lg:mt-8`}>
            <p className="col-span-4 max-w-[46ch] text-[16px] leading-[1.55] sm:col-span-5 lg:col-span-5 lg:text-[17px]">
              Pick the one you came for. Each runs through the same four layers, so the other
              three come with it.
            </p>
          </Reveal>
        </WantSelector>

        <div className={`${GRID} mt-14 gap-y-8 sm:mt-16 lg:mt-20 lg:items-end`}>
          <TypeReveal
            as="p"
            variant="title"
            className="type-title col-span-4 text-[clamp(1.375rem,1rem+1.5vw,2.375rem)] leading-[1.1] sm:col-span-6 lg:col-span-7"
            lines={["Each supplier sells you one of these.", "We build the system that delivers all four."]}
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
