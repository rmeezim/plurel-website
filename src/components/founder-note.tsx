import { Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";

/**
 * A signed conviction — the human handshake before the offer.
 * Editorial armature: the headline and the founder's words run across the
 * top band; the person (portrait + signature) and the place (studio panel)
 * ground them on the bottom band.
 */
export function FounderNote() {
  return (
    <section
      aria-labelledby="founder-heading"
      className="border-t border-line"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-20">
          {/* Title — top left */}
          <Reveal className="lg:col-span-4">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              <Spark className="size-3.5 text-brand" aria-hidden />
              From the founder
            </p>
            <h2
              id="founder-heading"
              className="mt-5 font-sans text-[clamp(2.2rem,4.6vw,3.5rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
            >
              Our <em className="italic">conviction</em>
            </h2>
          </Reveal>

          {/* The note — the founder's words in two columns, top right */}
          <Reveal
            delay={0.12}
            className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:col-span-7 lg:col-start-6"
          >
            <div className="space-y-6 text-[15px] leading-[1.75] text-ink/85">
              <p>
                I started Plurel after watching the same story repeat across
                good businesses: excellent work, invisible at the exact moment
                a buyer decides who makes the shortlist. Great case studies
                buried on page four. Real results told to no one.
              </p>
              <p>
                The cause is rarely effort &mdash; it&rsquo;s structure.
                Presence gets built in pieces: a website from one vendor,
                content from another, ads from a third, and nobody accountable
                for how it all performs together. Pieces don&rsquo;t compound.
                Systems do.
              </p>
            </div>
            <div className="space-y-6 text-[15px] leading-[1.75] text-ink/85">
              <p>
                So we built the partner we kept wishing existed: one team that
                owns how you&rsquo;re found, trusted, chosen, and remembered
                &mdash; from brand and website through AI search, content, and
                campaigns, down to the martech underneath.
              </p>
              <p>
                Buying decisions now begin inside AI answers as often as
                search results, and we build for that reality from day one. If
                that&rsquo;s the partner you&rsquo;ve been missing, the audit
                below is the fastest way for us both to find out.
              </p>
            </div>
          </Reveal>

          {/* The person — bottom left, baseline shared with the studio panel */}
          <Reveal delay={0.1} className="lg:col-span-3 lg:self-end">
            <figure>
              {/* Placeholder portrait — swap for a real photograph */}
              <div
                aria-hidden
                className="aspect-[4/5] w-44 rounded-lg ring-1 ring-line sm:w-48"
                style={{
                  backgroundImage:
                    "linear-gradient(to top, rgba(17,15,10,0.22), transparent 45%), radial-gradient(ellipse 90% 70% at 50% 30%, #d8c7b0 0%, #b79f86 52%, #8f8981 100%)",
                }}
              />
              <figcaption className="mt-5">
                <p className="text-[15px] font-medium text-ink">
                  Rameez Imran
                </p>
                <p className="mt-0.5 text-[13px] text-muted">
                  Founder &mdash; Plurel, a Northeon division
                </p>
              </figcaption>
              <span
                aria-hidden
                className="mt-4 inline-block -rotate-2 font-serif text-[2.6rem] italic leading-none tracking-tight text-ink/70"
              >
                Rameez
              </span>
            </figure>
          </Reveal>

          {/* The place — wide studio panel, bottom right. A composed brand
              surface for now; swap for a wide photograph of the studio. */}
          <Reveal delay={0.2} className="lg:col-span-8 lg:col-start-5">
            <div
              aria-hidden
              className="relative aspect-[16/9] overflow-hidden rounded-xl border border-line bg-clay sm:aspect-[21/9]"
            >
              {/* Morning light across a clay wall */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(112deg, rgba(251,250,246,0.55) 0%, rgba(251,250,246,0.14) 36%, rgba(251,250,246,0) 58%), linear-gradient(to top, rgba(17,15,10,0.18), rgba(17,15,10,0) 44%)",
                }}
              />
              <Spark className="absolute -right-16 -top-28 size-[340px] rotate-12 text-ink/[0.05]" />
              <span className="absolute bottom-5 left-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/55">
                Plurel &mdash; a Northeon division
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
