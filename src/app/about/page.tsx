import { Readout } from "@/components/artifacts/kit";
import { SuppliersArt } from "@/components/artifacts/page-art";
import { ChapterHead, Closing, PageHead, Room } from "@/components/page";
import { Reveal } from "@/components/reveal";
import { CtaLink, GRID, TextLink } from "@/components/system";
import { pageMetadata } from "@/lib/metadata";
import { AUDIT_HREF, CONTACT_EMAIL } from "@/lib/nav";

export const metadata = pageMetadata({
  title: "About Plurel — a distribution engineering firm",
  description:
    "Why Plurel exists, the rules every engagement runs on, and how the firm is built: one small senior team for each company, answerable for one number. And how we hire.",
  path: "/about/",
});

/*
  /about: the firm. Why it exists (the problem, the idea, the practice,
  then ten suppliers drawn into one number, artifacts/page-art.tsx),
  the rules every engagement runs on (the page's first red room), how it
  is built, and how it hires (by introduction: no invented openings, no
  invented people; the People chapter on the homepage waits for real
  names). Closes in the red room.
*/

const WHY = [
  "Growing companies end up buying their marketing in pieces: a brand studio, a web agency, a search consultant, a paid team, a PR firm, a creator platform. Each is good at its piece. None owns the whole, and each reports the number that flatters its own work.",
  "Buyers never meet those pieces separately. They see the ad, read the review, ask an assistant and land on the site, and they judge you on all of it at once. When the pieces disagree, buyers notice.",
  "So we built a firm that runs the pieces as one system, from one brief, with one team, answerable for one number agreed on day one. We call it distribution engineering: making a company impossible to miss for the people it sells to, and measuring it by what they do next.",
];

const RULES = [
  { name: "Ground truth first", line: "Nothing is designed until the read is agreed." },
  { name: "Nothing ships alone", line: "Every asset is cut from the brief and connected to the rest of the work." },
  { name: "Something ships every week", line: "Progress you can see, with a short note on what changed and why." },
  { name: "Built for machines too", line: "Every page is written for people, and readable by the assistants that answer them." },
  { name: "Measure what matters", line: "One number, agreed on day one, with every other signal read as a cause of it." },
  { name: "Keep what works", line: "What earns its place gets more, and what doesn’t gets cut, every quarter." },
];

const BUILT = [
  { term: "Team", value: "One senior team for each company we work with, the same people from the Diagnostic on." },
  { term: "Layers", value: "None between you and the people doing the work." },
  { term: "Your suppliers", value: "We work alongside your team and the suppliers you keep, or run the work end to end." },
  { term: "Ownership", value: "Everything we make is yours: the files, the accounts and the data." },
  { term: "Where", value: "New York, and remote." },
];

export default function AboutPage() {
  return (
    <main data-room="dark" className="bg-graphite text-paper">
      <PageHead
        lines={["A distribution", "engineering firm."]}
        standfirst="Plurel exists because growing companies buy their marketing from ten suppliers and get ten reports. We build and run it as one system, with one team, and answer for one number."
      >
        <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
        <CtaLink href="/contact" variant="outline-light" arrow="right">
          Get in touch
        </CtaLink>
      </PageHead>

      <Room labelledBy="why-heading" className="pt-0 lg:pt-4">
        <div className={`${GRID} gap-y-10 border-t border-paper/15 pt-10 lg:pt-14`}>
          <h2 id="why-heading" className="type-display col-span-4 text-[clamp(2rem,1.4rem+2.4vw,3.5rem)] leading-[1.02] sm:col-span-6 lg:col-span-4">
            Why Plurel exists.
          </h2>
          <Reveal className="col-span-4 space-y-6 sm:col-span-6 lg:col-span-7 lg:col-start-6">
            {WHY.map((para) => (
              <p key={para.slice(0, 24)} className="max-w-[60ch] text-[18px] leading-[1.6] lg:text-[19px]">
                {para}
              </p>
            ))}
          </Reveal>
        </div>
        <div className="mt-16 lg:mt-24">
          <SuppliersArt
            caption={
              <Readout
                items={[
                  "Each supplier reports the number that flatters its own work.",
                  "None of those is the number you run on.",
                  "We run the pieces as one team, answerable for one number.",
                ]}
              />
            }
          />
        </div>
      </Room>

      <Room labelledBy="rules-heading" tone="red">
        <ChapterHead
          id="rules-heading"
          tone="red"
          lines={["What we hold to."]}
          aside="Six rules every engagement runs on, whatever the size."
        />
        <Reveal className={`${GRID} mt-14 gap-y-10 lg:mt-20`}>
          {RULES.map((r) => (
            <div key={r.name} className="col-span-4 border-t-2 border-paper pt-5 sm:col-span-3 lg:col-span-4">
              <h3 className="type-title text-[clamp(1.375rem,1.15rem+0.8vw,1.75rem)] leading-[1.15]">{r.name}</h3>
              <p className="mt-3 max-w-[36ch] text-[16px] leading-[1.55]">{r.line}</p>
            </div>
          ))}
        </Reveal>
      </Room>

      <Room labelledBy="built-heading">
        <ChapterHead
          id="built-heading"
          lines={["Small, and senior."]}
          aside="Built so the people who read your Diagnostic are the people who do the work."
        />
        <Reveal className="mt-12 lg:mt-16">
          <dl className="border-b border-paper/15">
            {BUILT.map((b) => (
              <div key={b.term} className={`${GRID} gap-y-1.5 border-t border-paper/15 py-5`}>
                <dt className="col-span-4 text-[15px] font-medium text-fog sm:col-span-2 lg:col-span-4">{b.term}</dt>
                <dd className="type-title col-span-4 text-[19px] leading-[1.35] sm:col-span-4 lg:col-span-7 lg:col-start-6 lg:text-[22px]">
                  {b.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Room>

      <Room labelledBy="hiring-heading" className="border-t border-paper/10">
        <ChapterHead id="hiring-heading" lines={["Working here."]} />
        <Reveal className={`${GRID} mt-10 lg:mt-14`}>
          <div className="col-span-4 sm:col-span-6 lg:col-span-7">
            <p className="max-w-[58ch] text-[18px] leading-[1.6]">
              We hire by introduction, for craft and for judgment. We look for people who are
              excellent at one discipline and curious about the rest: strategists, creative
              directors, designers, film-makers, writers, web engineers, and people who know
              search, paid, press or measurement well.
            </p>
            <p className="mt-5 max-w-[58ch] text-[18px] leading-[1.6] text-fog">
              If that sounds like you, write to us with the work you&apos;re proudest of.
            </p>
            <TextLink href={`mailto:${CONTACT_EMAIL}?subject=Working%20at%20Plurel`} tone="dark" className="mt-6">
              {CONTACT_EMAIL}
            </TextLink>
          </div>
        </Reveal>
      </Room>

      <Closing lines={["Start with", "the Diagnostic."]}>
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
