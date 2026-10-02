import { CONTAINER, GRID, Meta } from "@/components/system";
import { CLIENTS } from "@/lib/home";

/** Proof the moment the film ends: who already works this way */
export function ClientsStrip() {
  return (
    <section aria-label="Selected clients" className="border-b border-ink/10 bg-paper">
      <div className={`${CONTAINER} py-8 lg:py-10`}>
        <div className={`${GRID} gap-y-5`}>
          <Meta className="col-span-4 text-muted sm:col-span-6 lg:col-span-12">
            (Selected clients)
          </Meta>
          {CLIENTS.map((name) => (
            <p
              key={name}
              className="col-span-2 text-[18px] tracking-[-0.01em] text-ink/55 lg:text-[20px]"
            >
              {name}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
