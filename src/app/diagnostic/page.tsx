import Link from "next/link";
import { RadarArt } from "@/components/artifacts/page-art";
import { DiagnosticForm } from "@/components/diagnostic-form";
import { ChapterHead, PageHead, Room } from "@/components/page";
import { faqJsonLd, QuestionList, type QA } from "@/components/questions";
import { Reveal } from "@/components/reveal";
import { CtaLink, GRID } from "@/components/system";
import { pageMetadata } from "@/lib/metadata";
import { CONTACT_EMAIL } from "@/lib/nav";
import { DIAGNOSTIC_PARTS, SAMPLE_DIAGNOSTIC, SAMPLE_HREF, SAMPLE_TOTAL } from "@/lib/proof";

export const metadata = pageMetadata({
  title: "The Diagnostic — Plurel",
  description:
    "The Plurel Distribution Diagnostic: a strategist scores six parts of your distribution and sends back a prioritized read within a business day. Free, and yours to keep.",
  path: "/diagnostic/",
});

/*
  /diagnostic: the way in, and where every "Request a diagnostic" lands.
  What it is (the six parts, the same for every company, beside a radar
  of them with the sample's read drawn on it), what comes back
  (the read, as the sample shows it, in the page's red room), how it runs
  (four steps on a hairline), the request itself, and its questions.
*/

/** The six parts by their short names, with the sample's scores, for the radar */
const SHORT: Record<string, string> = {
  "Market and category": "Market",
  "Narrative and positioning": "Narrative",
  "Website and touchpoints": "Website",
  "Assets and content": "Assets",
  "Distribution across channels": "Distribution",
  Measurement: "Measurement",
};
const RADAR = SAMPLE_DIAGNOSTIC.parts.map((p) => ({ short: SHORT[p.part] ?? p.part, score: p.score }));

const COMES_BACK = [
  { head: "Six scores", line: "Each part out of 10, with the finding behind the number." },
  { head: "The read", line: "Where you win, where you leak, and the first thing to fix." },
  { head: "What runs first", line: "The first quarter, layer by layer: what starts in month one and what waits." },
  { head: "What we would measure", line: "The one number, defined for each of your buyers, and what we read beside it." },
];

const STEPS = [
  { head: "You request it", line: "Two minutes: what you sell, what you came for, and where to look." },
  {
    head: "We read your distribution",
    line: "Your site, search and AI answers, ads, press and reviews, and anything you choose to share.",
  },
  { head: "The read comes back", line: "Within a business day, written by the strategist who ran it." },
  {
    head: "We walk you through it",
    line: "On a call, if you want one. If there is work to do, it starts as a sprint or a partnership.",
  },
];

const QUESTIONS: readonly QA[] = [
  {
    q: "Why is it free?",
    a: "Because it is the fastest way for both of us to see whether there is real work to do together. It takes a strategist about a day, and it tells us more than any first call would.",
  },
  {
    q: "What do you need from us?",
    a: "Your website and two minutes on the form. Everything else we read from what is public: your site, search and AI answers, ads, press and reviews. If you can share numbers, the read gets sharper.",
  },
  {
    q: "Who reads it?",
    a: "A senior strategist, the kind who would run the work. Not an analyst, and not a tool's export.",
  },
  {
    q: "What happens after?",
    a: "Nothing, unless you want it to. If there is work to do, it starts as a sprint of four to eight weeks or runs as a monthly partnership, and the read becomes the plan.",
  },
  {
    q: "Is it confidential?",
    a: "Yes. What you share stays with the team that reads it, and we never publish anything about you without your permission.",
  },
];

export default function DiagnosticPage() {
  return (
    <main data-room="dark" className="bg-graphite text-paper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd(QUESTIONS) }} />

      <PageHead
        lines={["The Diagnostic."]}
        standfirst="A strategist scores six parts of your distribution and sends back a prioritized read within a business day. It’s free, and yours to keep."
      >
        <CtaLink href="#request" arrow="right">
          Request yours
        </CtaLink>
        <CtaLink href={SAMPLE_HREF} variant="outline-light" arrow="right">
          See a sample
        </CtaLink>
      </PageHead>

      <Room labelledBy="parts-heading" className="pt-0 lg:pt-4">
        <ChapterHead
          id="parts-heading"
          lines={["Six parts, scored out of 10."]}
          aside="The same six for every company, so a score means the same thing wherever you sit."
        />
        <div className={`${GRID} mt-14 gap-y-10 lg:mt-20 lg:items-start`}>
          <div className="col-span-4 sm:col-span-6 lg:col-span-5">
            <RadarArt parts={RADAR} sample={SAMPLE_DIAGNOSTIC.client} />
            <p className="mt-4 max-w-[44ch] text-[14px] leading-[1.5] text-fog">
              {SAMPLE_DIAGNOSTIC.note} Its read scored {SAMPLE_TOTAL} of 60.{" "}
              <Link href={SAMPLE_HREF} className="text-paper underline decoration-signal underline-offset-4 hover:text-signal">
                See it in full
              </Link>
            </p>
          </div>
          <Reveal className="col-span-4 border-b border-paper/15 sm:col-span-6 lg:col-span-6 lg:col-start-7">
            <ol>
              {DIAGNOSTIC_PARTS.map((p) => (
                <li key={p.part} className="border-t border-paper/15 py-5 lg:py-6">
                  <h3 className="type-title text-[clamp(1.25rem,1.05rem+0.7vw,1.5rem)] leading-[1.15]">{p.part}</h3>
                  <p className="mt-2 max-w-[52ch] text-[16px] leading-[1.55] text-fog">{p.look}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Room>

      <Room labelledBy="back-heading" tone="red">
        <ChapterHead
          id="back-heading"
          tone="red"
          lines={["What comes back."]}
          aside="A written read from a strategist, not a dashboard export. You keep it, whatever you decide."
        />
        <Reveal className={`${GRID} mt-14 gap-y-10 lg:mt-20`}>
          {COMES_BACK.map((c) => (
            <div key={c.head} className="col-span-4 border-t-2 border-paper pt-5 sm:col-span-3 lg:col-span-3">
              <h3 className="text-[17px] font-medium">{c.head}</h3>
              <p className="mt-2.5 max-w-[32ch] text-[16px] leading-[1.5]">{c.line}</p>
            </div>
          ))}
        </Reveal>
        <Reveal className="mt-12 lg:mt-16">
          <CtaLink href={SAMPLE_HREF} variant="outline-light" arrow="right">
            See a full sample
          </CtaLink>
        </Reveal>
      </Room>

      <Room labelledBy="steps-heading">
        <ChapterHead id="steps-heading" lines={["How it runs."]} />
        <Reveal className="mt-14 lg:mt-20">
          <ol className={`${GRID} gap-y-0`}>
            {STEPS.map((st, i) => (
              <li
                key={st.head}
                className="relative col-span-4 border-l border-paper/20 pb-10 pl-7 last:pb-0 sm:col-span-6 lg:col-span-3 lg:border-l-0 lg:border-t lg:pb-0 lg:pl-0 lg:pt-8"
              >
                <span
                  aria-hidden
                  className={`absolute -left-[4px] top-1.5 size-[7px] lg:-top-[4px] lg:left-0 ${i === STEPS.length - 1 ? "bg-signal" : "bg-paper"}`}
                />
                <h3 className="type-title text-[20px] leading-[1.2] lg:text-[22px]">{st.head}</h3>
                <p className="mt-2.5 max-w-[32ch] text-[15px] leading-[1.5] text-fog lg:text-[16px]">{st.line}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Room>

      <Room labelledBy="request-heading" id="request" className="border-t border-paper/10">
        <ChapterHead
          id="request-heading"
          lines={["Request yours."]}
          aside={
            <>
              A strategist replies within a business day. Prefer to write?{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-paper underline decoration-signal underline-offset-4 hover:text-signal"
              >
                {CONTACT_EMAIL}
              </a>
            </>
          }
        />
        <Reveal className={`${GRID} mt-12 lg:mt-16`}>
          <div className="col-span-4 sm:col-span-6 lg:col-span-8">
            <DiagnosticForm />
          </div>
        </Reveal>
      </Room>

      <Room labelledBy="diagnostic-questions" className="border-t border-paper/10">
        <ChapterHead id="diagnostic-questions" lines={["About the Diagnostic."]} />
        <QuestionList items={QUESTIONS} className="mt-12 lg:mt-16" />
      </Room>
    </main>
  );
}
