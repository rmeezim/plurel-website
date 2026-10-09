import { CONTAINER, Meta } from "@/components/system";
import { CLIENTS } from "@/lib/home";
import { PauseOffscreen } from "@/components/home/pause-offscreen";

/*
  Proof the moment the film ends: who already works this way, as a slow
  marquee. The rail holds the list twice, so translating by -50% lands on
  the copy and loops without a seam; the copy is hidden from assistive
  tech. Hover pauses it; with reduced motion it simply sits still, and the
  edges fade so names never cut off hard.
*/
export function ClientsStrip() {
  const names = [...CLIENTS, ...CLIENTS];
  return (
    <section aria-label="Selected clients" className="border-b border-ink/10 bg-paper">
      <div className={`${CONTAINER} flex flex-col gap-5 py-8 lg:flex-row lg:items-center lg:gap-10 lg:py-9`}>
        <Meta as="p" className="shrink-0 text-muted">
          (Selected clients)
        </Meta>
        <div className="clients-rail relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <ul data-pause-offscreen="" className="clients-track flex w-max">
            {names.map((name, i) => (
              <li
                key={`${name}-${i}`}
                aria-hidden={i >= CLIENTS.length || undefined}
                className="flex items-center whitespace-nowrap pr-12 text-[18px] tracking-[-0.01em] text-ink/70 lg:pr-16 lg:text-[20px]"
              >
                <i aria-hidden className="mr-12 block size-[5px] bg-ink/25 lg:mr-16" />
                {name}
              </li>
            ))}
          </ul>
          <PauseOffscreen />
        </div>
      </div>
    </section>
  );
}
