import { CircledX, Spark } from "@/components/icons";

/**
 * Quiet trust strip under the hero — client names set as typographic
 * wordmarks (placeholder brands from the case studies; swap for real
 * client marks as contracts land).
 */
export function PartnersStrip() {
  return (
    <section aria-label="Selected clients" className="border-t border-line">
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-x-10 gap-y-5 px-5 py-8 sm:px-8 lg:px-12">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
          In good company
        </p>
        <span className="flex items-center gap-1.5 text-[15px] font-semibold uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink">
          <CircledX className="size-4" aria-hidden />
          Aurem
        </span>
        <span className="text-[14px] font-medium uppercase tracking-[0.24em] text-muted transition-colors hover:text-ink">
          Fence&nbsp;Labs
        </span>
        <span className="font-serif text-[17px] tracking-[0.02em] text-muted transition-colors hover:text-ink">
          Northgate Legal
        </span>
        <span className="font-serif text-[17px] italic text-muted transition-colors hover:text-ink">
          Mara Atelier
        </span>
        <span className="hidden text-[15px] font-medium tracking-[0.06em] text-muted transition-colors hover:text-ink md:block">
          Halden&nbsp;&amp;&nbsp;Co
        </span>
        <span className="hidden items-center gap-1.5 text-[15px] font-semibold tracking-[0.1em] text-muted transition-colors hover:text-ink md:flex">
          Verra
          <Spark className="size-3 text-brand" aria-hidden />
        </span>
      </div>
    </section>
  );
}
