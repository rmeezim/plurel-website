import { CONTAINER, H2, Kicker } from "@/components/system";

/* Accountability: placeholder until the sections build lands */
export function AccountabilityChapter() {
  return (
    <section aria-labelledby="accountability-heading" className="bg-paper text-ink">
      <div className={`${CONTAINER} py-32`}>
        <Kicker>Accountability</Kicker>
        <h2 id="accountability-heading" className={`${H2} mt-7`}>
          Ten suppliers report ten numbers. We answer for one.
        </h2>
      </div>
    </section>
  );
}
