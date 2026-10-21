import { CONTAINER, H2, Kicker } from "@/components/system";

/* Who it's for: placeholder until the sections build lands */
export function WhoItsForChapter() {
  return (
    <section aria-labelledby="who-heading" className="bg-brand text-paper">
      <div className={`${CONTAINER} py-32`}>
        <Kicker tone="red">Who it&rsquo;s for</Kicker>
        <h2 id="who-heading" className={`${H2} mt-7`}>
          Different buyers. One system.
        </h2>
      </div>
    </section>
  );
}
