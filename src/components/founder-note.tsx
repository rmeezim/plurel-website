import { Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";

/** A short, signed note — the human handshake before the offer */
export function FounderNote() {
  return (
    <section aria-labelledby="founder-heading" className="border-t border-line">
      <div className="mx-auto w-full max-w-[880px] px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
        <Reveal>
          <p
            id="founder-heading"
            className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted"
          >
            <Spark className="size-3.5 text-brand" aria-hidden />
            A note from the founder
          </p>
          <blockquote className="mt-7 font-serif text-[clamp(1.35rem,2.6vw,1.9rem)] leading-[1.45] text-ink/90">
            &ldquo;Most businesses don&rsquo;t have a visibility problem
            &mdash; they have a system problem. Great work, invisible in
            search. Real results, told to no one. We built Plurel to close
            that gap: one team accountable for how you&rsquo;re found,
            trusted, chosen, and remembered. If that&rsquo;s the partner
            you&rsquo;ve been missing, the audit below is the fastest way for
            us both to find out.&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center justify-between gap-6 border-t border-line pt-6">
            <div className="flex items-center gap-4">
              {/* Placeholder headshot — swap for a real portrait */}
              <span
                aria-hidden
                className="size-12 shrink-0 rounded-full ring-1 ring-line"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 35%, #d8c7b0 0 30%, #b79f86 31% 60%, #8f8981 61%)",
                }}
              />
              <div>
                <p className="text-[15px] font-medium text-ink">
                  Rameez Imran
                </p>
                <p className="text-[13px] text-muted">
                  Founder &mdash; Plurel, a Northeon division
                </p>
              </div>
            </div>
            <span
              aria-hidden
              className="hidden font-serif text-4xl italic tracking-tight text-ink/70 sm:block"
            >
              Rameez
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
