import { Reveal } from "@/components/reveal";
import {
  Accent,
  CONTAINER,
  CtaLink,
  GRID,
  Kicker,
  Meta,
  TextLink,
} from "@/components/system";
import { NEXT_STEPS } from "@/lib/home";
import { AUDIT_HREF } from "@/lib/nav";

/** The last red room before the footer: one invitation, two doors */
export function ClosingChapter() {
  return (
    <section
      aria-labelledby="closing-heading"
      className="bg-brand text-paper"
    >
      <div className={`${CONTAINER} py-28 lg:py-40`}>
        <Kicker tone="red">Start a growth transformation</Kicker>
        <Reveal>
          <h2
            id="closing-heading"
            className="mt-10 max-w-[14ch] text-[clamp(3rem,8.6vw,8.75rem)] font-normal leading-[0.9] tracking-[-0.05em]"
          >
            Make your business the <Accent>obvious</Accent> choice.
          </h2>
        </Reveal>

        <div className={`${GRID} mt-14 gap-y-10 lg:mt-20`}>
          <p className="col-span-4 max-w-[44ch] text-[17px] leading-relaxed text-paper/85 sm:col-span-5 lg:col-span-5 lg:text-[19px]">
            Book a growth audit or a 30-minute strategy call. You&apos;ll leave
            with a sharper read on where you stand and what to fix first.
          </p>
          <div className="col-span-4 flex flex-wrap items-center gap-x-10 gap-y-6 self-end sm:col-span-6 lg:col-span-6 lg:col-start-7 lg:justify-end">
            <CtaLink href={AUDIT_HREF} variant="paper">
              Book a growth audit
            </CtaLink>
            <TextLink href="/contact" tone="red">
              Or a strategy call
            </TextLink>
          </div>
        </div>

        <ol className={`${GRID} mt-20 gap-y-8 border-t border-paper/30 pt-6 lg:mt-28`}>
          {NEXT_STEPS.map((step, i) => (
            <li key={step.title} className="col-span-4 sm:col-span-2 lg:col-span-4">
              <Meta className="text-blush">({String(i + 1).padStart(2, "0")})</Meta>
              <p className="mt-3 text-[17px] tracking-[-0.01em]">{step.title}</p>
              <p className="mt-1 text-[14px] text-paper/70">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
