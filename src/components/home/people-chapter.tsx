import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { CONTAINER, GRID } from "@/components/system";
import { PEOPLE, type Person } from "@/lib/people";

/*
  People: the faces behind "one accountable team". It renders nothing
  until real people are added to PEOPLE (src/lib/people.ts); nobody is
  invented to fill it.

  A calm paper room after Proof: a short head, then one column per person
  on the grid (two on phones, three on tablets, four on desktop), each a
  portrait when one exists, a first name, the role and one line. Where a
  portrait is missing the slot keeps its shape with the initial, so a row
  with mixed photos still lines up. No motion beyond Reveal.
*/

const firstName = (name: string) => name.trim().split(/\s+/)[0];

function Portrait({ person }: { person: Person }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-ink/6">
      {person.photo ? (
        <Image
          src={person.photo}
          alt={person.name}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="type-display absolute bottom-4 left-4 text-[clamp(2.5rem,5vw,4rem)] leading-none text-ink/25"
        >
          {firstName(person.name).charAt(0)}
        </span>
      )}
    </div>
  );
}

/** People: renders only when real people are supplied */
export function PeopleChapter() {
  if (PEOPLE.length === 0) return null;
  return (
    <section
      id="people"
      aria-labelledby="people-heading"
      className="border-b border-ink/10 bg-paper text-ink"
    >
      <div className={`${CONTAINER} py-24 lg:py-32`}>
        <Reveal>
          <h2
            id="people-heading"
            className="type-display text-[clamp(2.25rem,4vw,3.25rem)] leading-none"
          >
            You’ll work with
          </h2>
        </Reveal>

        <ul className={`${GRID} mt-14 gap-y-12 lg:mt-18`}>
          {PEOPLE.map((p, i) => (
            <li key={p.name} className="col-span-2 sm:col-span-2 lg:col-span-3">
              <Reveal delay={(i % 4) * 0.06}>
                <Portrait person={p} />
                <h3 className="mt-5 text-[18px] font-medium leading-tight">
                  {firstName(p.name)}
                </h3>
                <p className="mt-1 text-[14px] text-muted">{p.role}</p>
                <p className="mt-3 max-w-[36ch] text-[15px] leading-[1.5] text-ink/75">
                  {p.line}
                </p>
                {p.email && (
                  <a
                    href={`mailto:${p.email}`}
                    className="mt-1 inline-block py-2 text-[14px] font-medium underline decoration-brand underline-offset-4 [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
                  >
                    {p.email}
                  </a>
                )}
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
