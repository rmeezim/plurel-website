import { DiagnosticSheet } from "@/components/diagnostic-sheet";
import { Reveal } from "@/components/reveal";
import { CONTAINER, CtaLink, GRID } from "@/components/system";
import { TypeReveal } from "@/components/type-reveal";
import { pageMetadata } from "@/lib/metadata";
import { AUDIT_HREF } from "@/lib/nav";

export const metadata = pageMetadata({
  title: "Sample Diagnostic — Plurel",
  description:
    "A sample Plurel Distribution Diagnostic in full: six parts of a company's distribution scored, the read, what runs first and what we would measure. Halden is a sample company, not a client.",
  path: "/sample-diagnostic/",
});

/*
  /sample-diagnostic: the whole sample report the homepage's Proof chapter
  summarises (components/diagnostic-sheet.tsx). It is set in the
  homepage's graphite room, so the header floats over it as it does over
  the hero (OVERLAY_ROUTES). Halden is a sample company, said in the
  standfirst and again in the sheet's top bar.

  Motion: the headline plotted on load, the rest lit as it enters.
*/

export default function SampleDiagnosticPage() {
  return (
    <main data-room="dark" className="bg-graphite text-paper">
      <div className={`${CONTAINER} pt-32 pb-24 sm:pt-36 lg:pt-40 lg:pb-36`}>
        <div className={`${GRID} gap-y-8 lg:items-end`}>
          <div className="col-span-4 sm:col-span-6 lg:col-span-8">
            <TypeReveal
              as="h1"
              onLoad
              delay={160}
              className="type-display text-[clamp(2.75rem,1.4rem+5vw,5.75rem)] leading-[0.98] [--display-weight:360]"
              lines={["A Diagnostic,", "in full."]}
            />
          </div>
          <p
            className="fade-in col-span-4 max-w-[40ch] text-[16px] leading-[1.55] text-fog sm:col-span-5 lg:col-span-4 lg:col-start-9 lg:pb-1"
            style={{ animationDelay: "700ms" }}
          >
            Every part of a Diagnostic, as it comes back within a business day. This one
            is run on Halden, a sample company that sells quiet heat pumps to homeowners
            and housebuilders.
          </p>
        </div>

        <DiagnosticSheet className="mt-14 lg:mt-20" />

        <Reveal className={`${GRID} mt-16 gap-y-8 lg:mt-24 lg:items-end`}>
          <p className="type-title col-span-4 max-w-[24ch] text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] leading-[1.12] sm:col-span-6 lg:col-span-7">
            Yours is free, and back within a business day.
          </p>
          <div className="col-span-4 flex flex-wrap gap-2 sm:col-span-6 lg:col-span-5 lg:col-start-8 lg:justify-end">
            <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
            <CtaLink href="/methodology" variant="outline-light" arrow="right">
              The full method
            </CtaLink>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
