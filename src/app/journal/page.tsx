import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { Closing, PageHead } from "@/components/page";
import { Reveal } from "@/components/reveal";
import { CONTAINER, CtaLink, GRID } from "@/components/system";
import { pageMetadata } from "@/lib/metadata";
import { AUDIT_HREF } from "@/lib/nav";
import { POSTS } from "@/lib/posts";

export const metadata = pageMetadata({
  title: "Journal — Plurel",
  description:
    "Plurel's journal: short essays on AI search, brand, martech and reputation, each with checks you can run on your own business.",
  path: "/journal/",
});

/*
  /journal: the essays, set as type alone (no cover art: mock screens
  stand in for nothing). The newest leads, larger; the rest follow on
  hairlines, each its category, title, line and length. Closes in the red
  room on the Diagnostic.
*/

export default function JournalPage() {
  const [lead, ...rest] = POSTS;
  return (
    <main data-room="dark" className="bg-graphite text-paper">
      <PageHead
        lines={["Journal."]}
        standfirst="Short essays on AI search, brand, martech and reputation, each with checks you can run on your own business."
      />

      <section aria-label="The essays">
        <div className={`${CONTAINER} pb-24 lg:pb-32`}>
          <Reveal>
            <Link href={`/journal/${lead.slug}`} className={`group ${GRID} gap-y-5 border-t-2 border-paper pt-8 lg:pt-10`}>
              <p className="col-span-4 text-[14px] text-fog sm:col-span-6 lg:col-span-3">
                {lead.category}
                <span className="block">{lead.readTime}</span>
              </p>
              <div className="col-span-4 sm:col-span-6 lg:col-span-8 lg:col-start-5">
                <h2 className="type-display text-[clamp(2.25rem,1.5rem+2.8vw,4rem)] leading-[1.02] transition-colors group-hover:text-signal">
                  {lead.title}
                </h2>
                <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.6] text-fog">{lead.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 border-b border-signal pb-1 text-[15px] font-medium">
                  Read it
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>

          <Reveal className="mt-16 border-b border-paper/15 lg:mt-24">
            <ul>
              {rest.map((post) => (
                <li key={post.slug} className="border-t border-paper/15">
                  <Link href={`/journal/${post.slug}`} className={`group ${GRID} gap-y-3 py-7 lg:py-9`}>
                    <p className="col-span-4 text-[14px] text-fog sm:col-span-6 lg:col-span-3">
                      {post.category}
                      <span className="block">{post.readTime}</span>
                    </p>
                    <div className="col-span-4 sm:col-span-6 lg:col-span-7 lg:col-start-5">
                      <h2 className="type-title text-[clamp(1.5rem,1.2rem+1vw,2.125rem)] leading-[1.12] transition-colors group-hover:text-signal">
                        {post.title}
                      </h2>
                      <p className="mt-3 max-w-[60ch] text-[16px] leading-[1.55] text-fog">{post.excerpt}</p>
                    </div>
                    <span aria-hidden className="col-span-4 hidden justify-self-end sm:col-span-6 lg:col-span-1 lg:block">
                      <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <Closing lines={["Run the checks", "on your own business."]}>
        <CtaLink href={AUDIT_HREF} variant="paper">
          Request a diagnostic
        </CtaLink>
        <CtaLink href="/services" variant="outline-light" arrow="right">
          The Plurel System
        </CtaLink>
      </Closing>
    </main>
  );
}
