import { DiagnosticSheet } from "@/components/diagnostic-sheet";
import { Closing, PageHead } from "@/components/page";
import { CONTAINER, CtaLink } from "@/components/system";
import { pageMetadata } from "@/lib/metadata";
import { AUDIT_HREF } from "@/lib/nav";

export const metadata = pageMetadata({
  title: "Sample Diagnostic — Plurel",
  description:
    "A sample Plurel Distribution Diagnostic in full: six parts of a company's distribution scored, the read, what runs first and what we would measure. Halden is a sample company, not a client.",
  path: "/diagnostic/sample/",
});

/*
  /diagnostic/sample: the whole sample report the homepage's Proof chapter
  summarises (components/diagnostic-sheet.tsx), under the Diagnostic it
  shows. Halden is a sample company, said in the standfirst and again in
  the sheet's top bar. It closes in the red room on the request.
*/

export default function SampleDiagnosticPage() {
  return (
    <main data-room="dark" className="bg-graphite text-paper">
      <PageHead
        lines={["A Diagnostic,", "in full."]}
        standfirst="Every part of a Diagnostic, as it comes back within a business day. This one is run on Halden, a sample company that sells quiet heat pumps to homeowners and housebuilders."
      />
      <div className={`${CONTAINER} pb-24 lg:pb-32`}>
        <DiagnosticSheet />
      </div>
      <Closing lines={["Yours is free, and back", "within a business day."]}>
        <CtaLink href={AUDIT_HREF} variant="paper">
          Request a diagnostic
        </CtaLink>
        <CtaLink href="/method" variant="outline-light" arrow="right">
          How an engagement runs
        </CtaLink>
      </Closing>
    </main>
  );
}
