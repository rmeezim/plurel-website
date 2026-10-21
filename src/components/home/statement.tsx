import { CONTAINER } from "@/components/system";

/* What Plurel is: placeholder until the sections build lands */
export function StatementChapter() {
  return (
    <section aria-label="What Plurel is" className="bg-graphite text-paper">
      <div className={`${CONTAINER} py-32`}>
        <p className="max-w-[24ch] text-[clamp(2.1rem,1rem+3.4vw,4.6rem)] leading-[1.04] tracking-[-0.03em]">
          Plurel is a distribution engineering firm.
        </p>
      </div>
    </section>
  );
}
