import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { Fingerprint, UseMatrix } from "@/components/interior/fingerprint";
import { ChapterHead, Closing, Room } from "@/components/page";
import { LayerFlow, Part, ServiceHead } from "@/components/service";
import { CtaLink, GRID } from "@/components/system";
import { DISCIPLINES } from "@/lib/disciplines";
import { pageMetadata } from "@/lib/metadata";
import { AUDIT_HREF } from "@/lib/nav";
import { ENGAGEMENTS } from "@/lib/engagements";
import { STAGES, type StageKey } from "@/lib/services-type";

export const metadata = pageMetadata({
  title: "Engagements and disciplines — Plurel",
  description:
    "Four engagements, by what you came for (reach, reputation, mindshare, revenue), each run on the same system: four layers, ten disciplines you can also hire on their own, one team and one number.",
  path: "/services/",
});

/*
  /services: what Plurel sells, the page the homepage and the menu point
  to. It opens on its drawing (four engagements, each through all four
  layers, into one number) and four facts set large; then the four
  engagements, each with its print (the disciplines it puts to work,
  layer by layer), its want and Plurel's line on it; every discipline
  against every engagement, as one matrix; and the system underneath as
  one line with four stops, each layer's disciplines as links. The page
  closes in the red room.
*/

/** What each layer is, in one sentence */
const WHAT: Record<StageKey, string> = {
  narrative: "The one story every asset, ad and answer is cut from, in the words your buyers use.",
  create: "Everything the story turns into, cut for the surface it runs on: the site, content, film, creator kits and ads.",
  distribute: "Which surface gets which cut, in what order and on what budget, from AI answers and search to press and stores.",
  measure: "The one number, the signals that moved it, and where the budget goes next, read with you every month.",
};

export default function ServicesPage() {
  return (
    <main data-room="dark" className="bg-graphite text-paper">
      <ServiceHead
        lines={["Four engagements.", "One system."]}
        line="Pick what you came for."
        standfirst={<p>Each engagement runs on the same four layers, is built from the disciplines below, and answers to one number agreed on day one.</p>}
        sig="services"
        facts={[
          { value: "4", label: "engagements, named for what you came for" },
          { value: "10", label: "disciplines, each also hired on its own" },
          { value: "4", label: "layers of one system, run by one team" },
          { value: "1", label: "number, agreed on day one" },
        ]}
      >
        <CtaLink href={AUDIT_HREF}>Request a diagnostic</CtaLink>
        <CtaLink href="/method" variant="outline-light" arrow="right">
          How an engagement runs
        </CtaLink>
      </ServiceHead>

      <Part id="engagements-heading" title="The four engagements" lead="Each runs on all four layers; what changes is which disciplines it puts to work, lit in its print.">
        <ul className={`${GRID} gap-y-12`}>
          {ENGAGEMENTS.map((p) => (
            <li key={p.key} className="group relative col-span-4 border-t border-paper/20 pt-6 sm:col-span-3 lg:col-span-3">
              <Fingerprint uses={p.uses} label={`${p.term} puts ${Object.values(p.uses).flat().length} of the ten disciplines to work, across all four layers`} />
              <h3 className="type-display mt-6 text-[clamp(2rem,1.6rem+1.6vw,2.75rem)] leading-none">
                <Link href={p.href} className="transition-colors after:absolute after:inset-0 group-hover:text-signal">
                  {p.term}
                </Link>
              </h3>
              <p className="type-title mt-3 text-[19px] leading-[1.3]">{p.want}</p>
              <p className="mt-3 max-w-[36ch] text-[15px] leading-[1.5] text-fog">{p.stance}</p>
              <p className="mt-5 flex items-center gap-2 text-[15px] font-medium">
                See {p.term}
                <ArrowUpRight aria-hidden className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </p>
            </li>
          ))}
        </ul>
      </Part>

      <Room labelledBy="matrix-heading" className="border-t border-paper/10">
        <ChapterHead
          id="matrix-heading"
          lines={["What each one", "is built from."]}
          aside="Every engagement runs on all four layers; what changes is which disciplines it puts to work. Each discipline can also be hired on its own."
        />
        <UseMatrix engagements={ENGAGEMENTS} />
      </Room>

      <Part id="system-heading" title="One system underneath" lead="The same four layers run every engagement, each built from disciplines you can also hire on their own.">
        <LayerFlow
          items={STAGES.map((st) => ({
            name: st.name,
            builds: st.builds.replace(/^The /, "the "),
            text: WHAT[st.key],
            links: DISCIPLINES.filter((x) => x.layer === st.key).map((x) => ({ name: x.name, href: x.href })),
          }))}
          loop="What the Ledger reads goes back into Narrative and Distribute every quarter."
        />
      </Part>

      <Closing lines={["Four engagements.", "One number."]}>
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
