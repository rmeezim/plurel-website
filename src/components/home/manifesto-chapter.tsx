import { BraidStrip } from "@/components/home/braid-strip";
import { Reveal } from "@/components/reveal";
import { ChapterHead, CONTAINER, GRID, H2, TextLink } from "@/components/system";
import { AUDIT_HREF } from "@/lib/nav";

/*
  Why Plurel: the problem, told through measurement. One paper chapter,
  statement then figure. The chapter's one label sits in the margin
  (columns 1 to 3) beside the statement on the content column (4 to 12);
  the braid keeps the same axes, then takes the full width: ten
  suppliers, each reporting its own number, ending as one strand and one
  number. One quiet link under it offers the Diagnostic where the
  problem peaks. Generous paper below lets the chapter close before
  Services cuts to graphite.
*/
export function ManifestoChapter() {
  return (
    <section aria-labelledby="manifesto-heading" className="bg-paper text-ink">
      <div className={`${CONTAINER} pb-28 pt-24 sm:pb-32 sm:pt-28 lg:pb-40 lg:pt-36`}>
        <div className={`${GRID} lg:items-start lg:gap-y-11`}>
          <ChapterHead
            label="Why Plurel"
            className="col-span-4 sm:col-span-6 lg:col-span-3 lg:row-start-1 lg:pt-4"
          />

          <Reveal className="col-span-4 mt-7 sm:col-span-6 lg:col-span-9 lg:col-start-4 lg:row-start-1 lg:mt-0">
            <h2
              id="manifesto-heading"
              className={`${H2} text-ink`}
            >
              <span className="block">
                Your marketing shouldn&rsquo;t be ten companies.
              </span>{" "}
              <span className="block">It should be one system.</span>
            </h2>
          </Reveal>

          <Reveal
            delay={0.08}
            className="col-span-4 mt-8 sm:col-span-5 lg:col-span-6 lg:col-start-4 lg:row-start-2 lg:mt-0"
          >
            <p className="text-[17px] leading-[1.55] text-ink/75 lg:text-[20px]">
              Brand, website, search, content, social, paid and press usually sit
              with different suppliers. Each is good at its part. The budget
              follows whoever reports loudest, and qualified demand belongs to
              no one.
            </p>
          </Reveal>
        </div>

        {/* The braid: ten suppliers, ten numbers, then one team and one number */}
        <BraidStrip />

        {/* The one action at the peak of the problem */}
        <div className={`${GRID} mt-14 sm:mt-16 lg:mt-20`}>
          <Reveal className="col-span-4 flex flex-wrap items-baseline gap-x-7 gap-y-2 sm:col-span-6 lg:col-span-9 lg:col-start-4">
            <p className="text-[17px] leading-[1.5] text-ink/75 lg:text-[18px]">
              Find where your suppliers disagree.
            </p>
            <TextLink href={AUDIT_HREF}>Request a diagnostic</TextLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
