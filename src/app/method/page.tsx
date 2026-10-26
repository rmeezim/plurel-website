import { ChapterHead, PageHead, Room } from "@/components/page";
import { Reveal } from "@/components/reveal";
import { CtaLink, GRID } from "@/components/system";
import { PHASES } from "@/lib/home";
import { pageMetadata } from "@/lib/metadata";
import { AUDIT_HREF } from "@/lib/nav";

export const metadata = pageMetadata({
  title: "Method: how an engagement runs — Plurel",
  description:
    "How a Plurel engagement runs: the Diagnostic, then four phases (Diagnose, Design, Deploy, Compound) with one senior team, a weekly, monthly and quarterly rhythm, and two ways to work: a sprint or the partnership.",
  path: "/method/",
});

/*
  /method: how an engagement runs, the page the homepage's Method chapter
  points to. The four phases on a time chart (weeks 1 to 12, then monthly),
  each with what happens and what it delivers; the rhythm, in the page's
  first red room; the team; where AI helps and where a person decides;
  and the two ways to work, in the red room the page closes on. The
  phases' names, taglines, deliverables and AI lines are the homepage's
  (lib/home.ts); the rest is said here.
*/

/** Each phase on the chart: the weeks it spans (13 is "then monthly"), and what happens in it */
const DETAIL: Record<string, { from: number; to: number; when: string; what: string }> = {
  Diagnose: {
    from: 1,
    to: 1,
    when: "Week 1",
    what: "The Diagnostic, then a deeper read once we start: your numbers, your buyers and your suppliers. We agree the one number before anything else.",
  },
  Design: {
    from: 2,
    to: 6,
    when: "Weeks 2 to 6",
    what: "We rebuild the story first, as the Core Brief, then what carries it: identity, site and the asset library, in the order the read sets.",
  },
  Deploy: {
    from: 4,
    to: 12,
    when: "Weeks 4 to 12",
    what: "The system goes live surface by surface: the site, the channels and the tracking, with launch press where it helps. Something ships every week.",
  },
  Compound: {
    from: 9,
    to: 13,
    when: "From month 3, monthly",
    what: "The partnership: content, paid and search run continuously, the Ledger is read with you every month, and every quarter the brief and the plan are reset.",
  },
};

const WEEKS = 13;

const RHYTHM = [
  { head: "Every week", line: "Something ships: a page, a cut, a campaign or a fix, with a short note on what and why." },
  { head: "Every month", line: "We read the Ledger with you: the one number, the signals that moved it, and where the budget goes next." },
  { head: "Every quarter", line: "The reset: what the Ledger learned goes back into the Core Brief and the Surface Plan." },
];

const TEAM = [
  { role: "Strategy lead", line: "Owns the Core Brief, the plan and the number. Your first call, from the Diagnostic on." },
  { role: "Creative director", line: "Owns the ideas and the bar, and reviews everything that ships." },
  { role: "Design", line: "Identity, the site, and every format in between." },
  { role: "Film and content", line: "Shoots, edits and writes, and runs the creators." },
  { role: "Web engineering", line: "Builds the site and keeps it fast, accessible and readable by machines." },
  { role: "Distribution", line: "Search, AI answers, paid and press, run as one plan." },
  { role: "Measurement", line: "The Ledger, the wiring behind it, and the monthly read." },
];

const WAYS = [
  {
    head: "A sprint",
    line: "Four to eight weeks for one focused outcome: a rebrand, a new site, a launch. A fixed scope and a fixed price, starting in the low five figures.",
  },
  {
    head: "The partnership",
    line: "The whole system, run monthly by one team on every relevant channel, with the Ledger read together every month. Priced on the work, never per channel.",
  },
];

export default function MethodPage() {
  return (
    <main data-room="dark" className="bg-graphite text-paper">
      <PageHead
        lines={["How an engagement", "runs."]}
        standfirst="It starts with the Diagnostic, runs as four phases with one senior team, and settles into a monthly rhythm read against one number."
      >
        <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
        <CtaLink href="/services" variant="outline-light" arrow="right">
          The Plurel System
        </CtaLink>
      </PageHead>

      <Room labelledBy="phases-heading" className="pt-0 lg:pt-4">
        <ChapterHead
          id="phases-heading"
          lines={["Four phases, one team."]}
          aside="Most engagements run all four as one monthly partnership. A focused sprint takes four to eight weeks."
        />

        {/* The time axis, once, over the four (lg) */}
        <div aria-hidden className={`${GRID} mt-16 hidden lg:grid`}>
          <div className="col-span-4" />
          <div className="col-span-8 grid grid-cols-[repeat(13,minmax(0,1fr))] text-[13px] text-fog">
            <span className="col-span-12 border-l border-paper/20 pl-2">Weeks 1 to 12</span>
            <span className="border-l border-paper/20 pl-2">Then</span>
          </div>
        </div>

        <ol className="mt-10 border-b border-paper/15 lg:mt-4">
          {PHASES.map((ph) => {
            const t = DETAIL[ph.name];
            return (
              <li key={ph.name} className={`${GRID} gap-y-6 border-t border-paper/15 py-10 lg:py-12`}>
                <div className="col-span-4 sm:col-span-6 lg:col-span-4">
                  <h3 className="type-display text-[clamp(2.25rem,1.4rem+2.6vw,3.5rem)] leading-[0.95]">{ph.name}</h3>
                  <p className="mt-3 text-[15px] text-fog">{t.when}</p>
                </div>
                <Reveal className="col-span-4 sm:col-span-6 lg:col-span-8">
                  {/* its span on the chart */}
                  <div
                    aria-hidden
                    className="grid h-2.5 grid-cols-[repeat(13,minmax(0,1fr))] gap-px bg-transparent"
                  >
                    {Array.from({ length: WEEKS }, (_, w) => {
                      const on = w + 1 >= t.from && w + 1 <= t.to;
                      return <span key={w} className={on ? "bg-paper" : "bg-paper/10"} />;
                    })}
                  </div>
                  <div className={`${GRID} mt-7 gap-y-6 lg:grid-cols-8`}>
                    <div className="col-span-4 sm:col-span-6 lg:col-span-4">
                      <p className="type-title text-[20px] leading-[1.25] lg:text-[22px]">{ph.tagline}</p>
                      <p className="mt-3 max-w-[48ch] text-[16px] leading-[1.6] text-fog">{t.what}</p>
                    </div>
                    <ul aria-label={`${ph.name} delivers`} className="col-span-4 border-b border-paper/15 sm:col-span-6 lg:col-span-4">
                      {ph.outputs.map((o) => (
                        <li key={o} className="border-t border-paper/15 py-2.5 text-[15px] leading-[1.4]">
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Room>

      <Room labelledBy="rhythm-heading" tone="red">
        <ChapterHead
          id="rhythm-heading"
          tone="red"
          lines={["The rhythm."]}
          aside="The same cadence in every engagement, so you always know what happens next."
        />
        <Reveal className={`${GRID} mt-14 gap-y-10 lg:mt-20`}>
          {RHYTHM.map((r) => (
            <div key={r.head} className="col-span-4 border-t-2 border-paper pt-5 sm:col-span-6 lg:col-span-4">
              <h3 className="type-title text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-[1.1]">{r.head}</h3>
              <p className="mt-3 max-w-[38ch] text-[16px] leading-[1.55]">{r.line}</p>
            </div>
          ))}
        </Reveal>
      </Room>

      <Room labelledBy="team-heading">
        <ChapterHead
          id="team-heading"
          lines={["One senior team."]}
          aside="The people who run your Diagnostic run the work, with no account managers between you and the people making it."
        />
        <Reveal className="mt-12 border-b border-paper/15 lg:mt-16">
          <ul>
            {TEAM.map((m) => (
              <li key={m.role} className={`${GRID} gap-y-1.5 border-t border-paper/15 py-5`}>
                <h3 className="type-title col-span-4 text-[20px] leading-[1.25] sm:col-span-2 lg:col-span-4 lg:text-[22px]">
                  {m.role}
                </h3>
                <p className="col-span-4 max-w-[56ch] text-[16px] leading-[1.55] text-fog sm:col-span-4 lg:col-span-7 lg:col-start-6">
                  {m.line}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Room>

      <Room labelledBy="ai-heading" className="border-t border-paper/10">
        <ChapterHead
          id="ai-heading"
          lines={["Where AI helps,", "and where a person decides."]}
          aside="Machines take the volume. People make the calls, and answer for them."
        />
        <Reveal className="mt-12 border-b border-paper/15 lg:mt-16">
          <ul>
            {PHASES.map((ph) => (
              <li key={ph.name} className={`${GRID} gap-y-1.5 border-t border-paper/15 py-5`}>
                <p className="col-span-4 text-[15px] font-medium text-fog sm:col-span-2 lg:col-span-4">{ph.name}</p>
                <p className="type-title col-span-4 text-[19px] leading-[1.35] sm:col-span-4 lg:col-span-7 lg:col-start-6 lg:text-[21px]">
                  {ph.ai}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Room>

      <Room labelledBy="ways-heading" tone="red">
        <ChapterHead id="ways-heading" tone="red" lines={["Two ways to work."]} />
        <Reveal className={`${GRID} mt-14 gap-y-10 lg:mt-20`}>
          {WAYS.map((w) => (
            <div key={w.head} className="col-span-4 border-t-2 border-paper pt-5 sm:col-span-6 lg:col-span-6">
              <h3 className="type-display text-[clamp(2rem,1.5rem+1.8vw,3rem)] leading-none">{w.head}</h3>
              <p className="mt-4 max-w-[46ch] text-[17px] leading-[1.55]">{w.line}</p>
            </div>
          ))}
        </Reveal>
        <Reveal className="mt-14 flex flex-wrap gap-2 lg:mt-16">
          <CtaLink href={AUDIT_HREF} variant="paper">
            Request a diagnostic
          </CtaLink>
          <CtaLink href="/industries" variant="outline-light" arrow="right">
            Who we work with
          </CtaLink>
        </Reveal>
      </Room>
    </main>
  );
}
