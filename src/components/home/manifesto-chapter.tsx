import { SupplierReports } from "@/components/home/supplier-reports";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { ChapterHead, CONTAINER, GRID, Meta, TextLink } from "@/components/system";
import { AUDIT_HREF } from "@/lib/nav";
import { ONE_NUMBER as N, REPORT_MONTH } from "@/lib/reports";

/*
  Why Plurel, in a red room: the thesis, then the evidence on the desk.

  The thesis is the site's: its h2 is set larger than the shared H2, with
  the standfirst beside it from xl (under it, offset right, below that).
  Then the table (SupplierReports): the ten reports a company gets in a
  month, one per supplier, each proud of its own number, laid across the
  full width as a still life. The h3 sits in the table's quiet top-left
  corner from lg (sized with the table, so the corner always fits it),
  and above the pile below lg. One plain line says the reports are
  samples, and invites the reader to pick one up.

  Then the resolution, apart from the pile: one clean Plurel sheet,
  upright, one page with a single line item, qualified demand, defined in
  plain words and marked as a sample. Its heading and the one action
  frame it from lg; below lg they stack under it in reading order.

  Paper type on red: body copy stays paper (5.2:1), blush only for
  display sizes (3.6:1, large text).
*/

/** Plurel's sheet: one page, one line item */
function Sheet() {
  return (
    <article
      aria-labelledby="one-number-title"
      className="bg-paper px-6 pb-6 pt-6 text-ink sm:px-10 sm:pb-8 sm:pt-8 lg:px-12 lg:pb-9 lg:pt-10"
    >
      <div className="flex items-center justify-between gap-6">
        <Logo className="h-[17px] w-auto text-brand lg:h-[19px]" />
        <Meta className="text-muted">{REPORT_MONTH}</Meta>
      </div>
      <p id="one-number-title" className="mt-14 text-[15px] text-muted sm:mt-20">
        {N.title} · {N.client}
      </p>
      <dl className="mt-3 flex items-baseline justify-between gap-x-6 border-b border-ink/15 pb-6">
        <dt className="type-display text-[clamp(1.375rem,1rem+1.25vw,2rem)] leading-none">
          {N.item}
        </dt>
        <dd className="type-display figures text-[clamp(4.5rem,2.75rem+6.5vw,8.5rem)] leading-[0.78]">
          {N.value}
        </dd>
      </dl>
      <p className="mt-5 max-w-[46ch] text-[16px] leading-[1.5] text-ink/75 sm:mt-6 lg:text-[17px]">
        {N.definition}
      </p>
      <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 sm:mt-14">
        <p className="text-[14px] font-medium text-brand">{N.sample}</p>
        <Meta as="p" className="text-muted">
          {N.page}
        </Meta>
      </div>
    </article>
  );
}

export function ManifestoChapter() {
  return (
    <section
      aria-labelledby="manifesto-heading"
      className="overflow-x-clip bg-brand text-paper"
    >
      <div className={`${CONTAINER} pb-28 pt-24 sm:pb-32 sm:pt-28 lg:pb-40 lg:pt-36`}>
        {/* The thesis */}
        <ChapterHead label="Why Plurel" tone="red" />
        {/* The standfirst sits under the thesis, offset right, until xl,
            then beside it on the thesis's last line */}
        <div className={`${GRID} mt-8 gap-y-8 lg:mt-10 xl:items-end`}>
          {/* Sized to its own column from sm (the longest line, "Your
              marketing shouldn't", is 11.7em), so it always sets as three
              lines; phones wrap it to five */}
          <Reveal className="@container col-span-4 sm:col-span-6 lg:col-span-12 xl:col-span-9">
            <h2
              id="manifesto-heading"
              className="type-display text-[clamp(2.5rem,1.35rem+4.3vw,5.5rem)] leading-[0.95] sm:text-[min(5.5rem,8.3cqw)]"
            >
              <span className="block">Your marketing shouldn&rsquo;t be ten companies.</span>{" "}
              <span className="block">It should be one system.</span>
            </h2>
          </Reveal>
          <Reveal
            delay={0.08}
            className="col-span-4 sm:col-span-4 sm:col-start-3 lg:col-span-5 lg:col-start-8 xl:col-span-3 xl:col-start-10 xl:pb-2"
          >
            <p className="max-w-[38ch] text-[17px] leading-[1.55] lg:text-[18px]">
              Brand, website, search, content, social, paid and press usually sit
              with different suppliers. Each is good at its part. The budget
              follows whoever reports loudest, and qualified demand belongs to no
              one.
            </p>
          </Reveal>
        </div>

        {/* The table: ten reports, one per supplier */}
        <div className="@container relative mt-20 sm:mt-24 lg:mt-28">
          <div className="lg:absolute lg:left-0 lg:top-0 lg:z-10 lg:w-[31cqw]">
            <h3
              id="reports-heading"
              className="type-display text-[clamp(1.75rem,1.1rem+2.6vw,2.5rem)] leading-[1.02] lg:text-[2.75cqw]"
            >
              <span className="block">Every supplier reports its own number.</span>{" "}
              <span className="block text-blush">Nobody owns the outcome.</span>
            </h3>
            <p className="mt-5 max-w-[34ch] text-[15px] leading-[1.45] lg:mt-[1.6cqw] lg:text-[max(14px,1.1cqw)]">
              Sample reports for Halden, our sample brand, with illustrative
              figures. Pick one up.
            </p>
            <p className="sr-only sm:hidden">Six of the ten reports are shown on small screens.</p>
          </div>
          <SupplierReports labelledBy="reports-heading" className="mt-10 sm:mt-12 lg:mt-0" />
        </div>

        {/* One team, one number: the heading and the action frame the sheet
            from lg (heading on top, action at its foot); below lg they
            stack in reading order */}
        <div className={`${GRID} mt-20 gap-y-10 sm:mt-24 lg:mt-32 lg:grid-rows-[auto_1fr]`}>
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-5 lg:row-start-1">
            <h3 className="type-display text-[clamp(2.25rem,1.3rem+3.4vw,4.25rem)] leading-[0.98]">
              <span className="block">One team.</span> <span className="block">One number.</span>
            </h3>
          </Reveal>
          <Reveal className="col-span-4 sm:col-span-6 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
            <Sheet />
          </Reveal>
          <Reveal
            delay={0.08}
            className="col-span-4 sm:col-span-6 lg:col-span-5 lg:row-start-2 lg:self-end"
          >
            <p className="text-[18px] leading-[1.45] lg:text-[20px]">
              Find where your suppliers disagree.
            </p>
            <TextLink href={AUDIT_HREF} tone="red" className="mt-3">
              Request a diagnostic
            </TextLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
