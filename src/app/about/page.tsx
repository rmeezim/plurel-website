import { ChapterHead, Closing, Room } from "@/components/page";
import { Part, ServiceHead, Steps } from "@/components/service";
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
  /about: the firm. It opens on its drawing (ten suppliers and ten
  numbers, or one team and one) and four facts set large; then why it
  exists, in three steps; the rules every engagement runs on (the page's first red room), how it
  is built, and how it hires (by introduction: no invented openings, no
  invented people; the People chapter on the homepage waits for real
  names). Closes in the red room.
*/

const WHY = [
  {
    title: "Marketing, bought in pieces",
    text: "A brand studio, a web agency, a search consultant, a paid team, a PR firm: each good at its piece, none owning the whole, each reporting the number that flatters its work.",
  },
  {
    title: "Buyers see it all at once",
    text: "They see the ad, read the review, ask an assistant and land on the site, and judge you on all of it together. When the pieces disagree, they notice.",
  },
  {
    title: "So we built one system",
    text: "One brief, one team, answerable for one number agreed on day one. We call it distribution engineering: hard to miss for the people you sell to, measured by what they do next.",
  },
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
      <ServiceHead
        lines={["A distribution", "engineering firm."]}
        line="Ten suppliers, or one team."
        standfirst={<p>Growing companies buy their marketing from ten suppliers and get ten reports. We build and run it as one system, with one team, and answer for one number.</p>}
        sig="about"
        facts={[
          { value: "1", label: "senior team for each company we work with" },
          { value: "0", label: "account managers between you and the work" },
          { value: "Yours", label: "every file, account and piece of data we make" },
          { value: "1", label: "number we answer for, agreed on day one" },
        ]}
      >
        <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
        <CtaLink href="/contact" variant="outline-light" arrow="right">
          Get in touch
        </CtaLink>
      </ServiceHead>

      <Part id="why-heading" title="Why Plurel exists" lead="Three things, in the order we saw them.">
        <Steps items={WHY} />
      </Part>

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
          <dl className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {BUILT.map((b) => (
              <div key={b.term} className="flex flex-col border-t border-paper/20 pb-8 pt-5">
                <dt className="text-[13px] text-fog">{b.term}</dt>
                <dd className="type-title mt-3 max-w-[30ch] text-[20px] leading-[1.3]">{b.value}</dd>
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
