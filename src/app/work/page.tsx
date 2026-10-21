import { Reveal } from "@/components/reveal";
import { CONTAINER, CtaLink, GRID, Kicker, TextLink } from "@/components/system";
import { pageMetadata } from "@/lib/metadata";
import { AUDIT_HREF, CONTACT_EMAIL } from "@/lib/nav";
import { PROOF_HREF } from "@/lib/proof";

export const metadata = pageMetadata({
  title: "Work — Plurel",
  description:
    "Sample engagements: how the work runs for a B2B software company, a consumer brand and a professional services firm, from the Diagnostic to qualified demand. Illustrative, not client results.",
  path: "/work/",
});

/*
  /work, until real cases can be published.

  Every case this page used to show was invented, so it now shows sample
  engagements instead, labelled as samples in plain view on the page and
  on each one: the companies are described, never named, and there are no
  people, quotes or result numbers. Each sample runs the way an
  engagement runs: what the Diagnostic found, what each stage of the chain
  did (Narrative, Create, Distribute, Measure), and what would count as
  qualified demand for that buyer. Real cases replace these one by one,
  with permission, in the same order plus one qualified-demand number
  with its client, cause and period.

  Set in the homepage system: paper, the 12-column grid, square corners,
  no chapter numbers, rulers or running heads; the closing room is red.
*/

type Stage = "Narrative" | "Create" | "Distribute" | "Measure";

type Sample = {
  slug: string;
  title: string;
  context: string;
  found: string;
  ran: Record<Stage, string>;
  qualified: string;
};

const STAGES: Stage[] = ["Narrative", "Create", "Distribute", "Measure"];

const SAMPLES: Sample[] = [
  {
    slug: "b2b-software",
    title: "A B2B software company with five agencies",
    context:
      "Series B, around 150 people. Paid, search, brand and web, PR and content each sit with a different supplier.",
    found:
      "Five suppliers, five reports, and a demand number the sales team doesn’t accept. The site speaks to engineers while the buyer is a finance lead, and AI assistants name two competitors before it.",
    ran: {
      Narrative: "One position for the buying committee, written for the finance lead who signs.",
      Create: "The site and the sales deck rebuilt from the same brief, with one research piece a quarter.",
      Distribute:
        "Search and AI answers first, LinkedIn for the founders’ own voices, paid search kept to the terms that convert.",
      Measure:
        "One count of qualified demand agreed with sales and handed into the CRM.",
    },
    qualified: "A demo request from a company in the target segment, accepted by sales.",
  },
  {
    slug: "consumer-brand",
    title: "A consumer brand selling direct",
    context:
      "Sells online and through a few retailers. An ads agency, a UGC platform and a PR freelancer each brief their own creative.",
    found:
      "Three suppliers making three versions of the brand. Creators get a product and no brief, the ads chase cheap clicks, and the press coverage never reaches the ads.",
    ran: {
      Narrative: "One idea the product can prove, written once for every format.",
      Create: "One shoot, cut into ads, creator briefs and product pages.",
      Distribute: "Paid social and creators run as one plan, with the press quotes working inside the ads.",
      Measure: "New-customer orders and their margin, in one weekly view.",
    },
    qualified: "A first order from a new customer, at a margin the brand can repeat.",
  },
  {
    slug: "professional-services",
    title: "A professional services firm that lives on referrals",
    context:
      "A partnership with a strong name in its region and a website that reads like a brochure.",
    found:
      "Referrals bring the work, so nobody owns the website. Prospects who search the firm’s specialisms, or ask an AI assistant, find other firms.",
    ran: {
      Narrative: "Positioning for each practice, in the words clients use when they search.",
      Create: "Practice pages built to be quoted, and one partner-written article a month.",
      Distribute: "Search and AI answers, plus the trade press where the partners already speak.",
      Measure: "New-matter requests by practice, so partners see which work brings in more.",
    },
    qualified: "A new-matter request in a practice the firm wants to grow.",
  },
];

const SAMPLE_LABEL = "Sample engagement · illustrative, not a client result";

function SampleArticle({ s }: { s: Sample }) {
  return (
    <article
      id={s.slug}
      aria-labelledby={`${s.slug}-title`}
      className="scroll-mt-24 border-t border-ink/20 pt-6 pb-20 sm:pb-24 lg:pb-28"
    >
      <Reveal>
        <p className="text-[14px] font-medium text-brand">{SAMPLE_LABEL}</p>
        <div className={`${GRID} mt-8 gap-y-5 lg:mt-10 lg:items-end`}>
          <h2
            id={`${s.slug}-title`}
            className="type-display col-span-4 text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] sm:col-span-6 lg:col-span-7"
          >
            {s.title}
          </h2>
          <p className="col-span-4 max-w-[44ch] text-[16px] leading-[1.55] text-muted sm:col-span-5 lg:col-span-4 lg:col-start-9 lg:pb-1">
            {s.context}
          </p>
        </div>
      </Reveal>

      <Reveal className={`${GRID} mt-12 gap-y-10 lg:mt-16`}>
        <div className="col-span-4 sm:col-span-6 lg:col-span-6">
          <h3 className="text-[15px] font-medium">What the Diagnostic found</h3>
          <p className="mt-3 max-w-[48ch] text-[19px] leading-[1.45] text-pretty">{s.found}</p>
        </div>
        <div className="col-span-4 sm:col-span-6 lg:col-span-5 lg:col-start-8">
          <h3 className="text-[15px] font-medium">What would count as qualified demand</h3>
          <p className="type-title mt-3 max-w-[26ch] text-[clamp(1.375rem,2vw,1.625rem)] leading-[1.15]">
            {s.qualified}
          </p>
        </div>
      </Reveal>

      <Reveal className="mt-12 lg:mt-16">
        <h3 className="text-[15px] font-medium">What each stage did</h3>
        <ol className={`${GRID} mt-5 gap-y-8`}>
          {STAGES.map((stage) => (
            <li key={stage} className="col-span-4 border-t-2 border-ink pt-4 sm:col-span-3 lg:col-span-3">
              <h4 className="text-[16px] font-medium">{stage}</h4>
              <p className="mt-2.5 max-w-[40ch] text-[15px] leading-[1.5] text-ink/75">
                {s.ran[stage]}
              </p>
            </li>
          ))}
        </ol>
      </Reveal>
    </article>
  );
}

export default function WorkPage() {
  return (
    <main className="bg-paper text-ink">
      <section aria-labelledby="work-heading">
        <div className={`${CONTAINER} pt-16 pb-20 sm:pt-20 lg:pt-28 lg:pb-28`}>
          <div className={`${GRID} gap-y-8 lg:items-end`}>
            <Reveal className="col-span-4 sm:col-span-6 lg:col-span-7">
              <Kicker>Work</Kicker>
              <h1
                id="work-heading"
                className="type-display mt-8 text-[clamp(2.75rem,6vw,5.25rem)] leading-[0.98] lg:mt-10"
              >
                How an engagement runs.
              </h1>
            </Reveal>
            <Reveal
              delay={0.1}
              className="col-span-4 sm:col-span-5 lg:col-span-4 lg:col-start-9 lg:pb-2"
            >
              <p className="max-w-[44ch] text-[16px] leading-[1.55]">
                Client cases will appear here with names, numbers and permission. Until then,
                these are sample engagements: the shape the work takes for three kinds of
                company. They are illustrative, and none of them is a client.
              </p>
              <TextLink href={PROOF_HREF} className="mt-4">
                See a sample Diagnostic
              </TextLink>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-label="Sample engagements">
        <div className={CONTAINER}>
          {SAMPLES.map((s) => (
            <SampleArticle key={s.slug} s={s} />
          ))}
        </div>
      </section>

      <section aria-labelledby="work-cta-heading" className="bg-brand text-paper">
        <div className={`${CONTAINER} py-24 lg:py-32`}>
          <div className={`${GRID} gap-y-8 lg:items-end`}>
            <Reveal className="col-span-4 sm:col-span-6 lg:col-span-7">
              <h2
                id="work-cta-heading"
                className="type-display text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.02]"
              >
                Every engagement starts with the Diagnostic.
              </h2>
            </Reveal>
            <Reveal
              delay={0.1}
              className="col-span-4 sm:col-span-5 lg:col-span-4 lg:col-start-9 lg:pb-1"
            >
              <p className="max-w-[40ch] text-[16px] leading-[1.55]">
                Six parts of your distribution scored, and the first fix named, within a
                business day. It’s free, and yours to keep.
              </p>
            </Reveal>
          </div>
          <Reveal className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5 lg:mt-16">
            <CtaLink href={AUDIT_HREF} variant="paper">
              Request your diagnostic
            </CtaLink>
            <TextLink href={`mailto:${CONTACT_EMAIL}`} tone="red">
              Or write to {CONTACT_EMAIL}
            </TextLink>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
