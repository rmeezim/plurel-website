import { CONTAINER, H2, Kicker } from "@/components/system";

/* Why now: placeholder until the sections build lands */
export function WhyNowChapter() {
  return (
    <section aria-labelledby="why-now-heading" className="bg-paper text-ink">
      <div className={`${CONTAINER} py-32`}>
        <Kicker>Why now</Kicker>
        <h2 id="why-now-heading" className={`${H2} mt-7`}>
          Buyers decide before they arrive.
        </h2>
      </div>
    </section>
  );
}
