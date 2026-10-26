import { Reveal } from "@/components/reveal";
import { CONTAINER, CtaLink, GRID } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import { WantSelector, type Want } from "@/components/home/want-selector";
import { AUDIT_HREF } from "@/lib/nav";
import { STAGES } from "@/lib/services-type";

/*
  What you came for, on red, third on the page: the four things a company
  comes to Plurel for, in its own words (go viral, press, a place in its
  buyers' minds, revenue), and the point that they are one system. The
  four words are the headline and the controls at once (want-selector.tsx):
  pick one and the panel under them, a step deeper in ember, reads out
  what each layer of the Plurel System does for it. The layers are the
  ones the services chapter goes on to build, so this is the System's
  first sighting. "Go viral" is said once, with the line that keeps it
  honest; the questions say it again.

  The chapter's heading is for screen readers; the four words carry it on
  screen. Server component around the client selector.
*/

const WANTS: readonly Want[] = [
  {
    key: "reach",
    term: "Reach",
    want: "Be seen, and sometimes go viral.",
    stance: "A viral moment is luck. Reach is a system that gives luck more chances.",
    layers: [
      "One idea short enough to travel, and true enough to survive the comments.",
      "Cut for creators and short-form: many versions of one story, made to be shared.",
      "Paid behind whatever is already moving, with search and AI answers ready for the people it reaches.",
      "Reach counted as a cause: we follow a spike into searches and into the one number.",
    ],
  },
  {
    key: "reputation",
    term: "Reputation",
    want: "Be talked about, and believed.",
    stance: "Press works when it says what everything else already says.",
    layers: [
      "The story a reporter can repeat in a sentence and a founder can tell on stage.",
      "Proof people can check, from original research to reviews worth reading.",
      "Press and podcasts, timed with the campaigns that make them findable.",
      "Mentions read as a cause: what they do to searches and to the one number.",
    ],
  },
  {
    key: "mindshare",
    term: "Mindshare",
    want: "Be the one they think of first.",
    stance: "People remember what they meet the same way, many times.",
    layers: [
      "One position, said the same way everywhere you show up.",
      "A look and a voice consistent enough to recognize in half a second.",
      "Present wherever the choice gets made, including the answers AI gives.",
      "Branded search and direct visits, read as the memory working.",
    ],
  },
  {
    key: "revenue",
    term: "Revenue",
    want: "Be chosen when they’re ready.",
    stance: "The first three are wasted if the last step leaks.",
    layers: [
      "The reasons to buy, in the words your buyers use.",
      "A site and a path to purchase built to convert, from first visit to checkout.",
      "Spend moved to whatever turns into orders, installs, demos or stockists.",
      "One number, agreed on day one, read every month.",
    ],
  },
];

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
