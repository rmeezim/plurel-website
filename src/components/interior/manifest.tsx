import { Reveal } from "@/components/reveal";

/*
  What a page's work produces, set as a manifest: each thing that ships,
  how often, and the layer of the System that makes it (an engagement);
  or, for a discipline, the things themselves, two or three across.
*/

export type ManifestItem = { item: string; when?: string; layer?: string };

export function Manifest({ items, label }: { items: readonly ManifestItem[]; label: string }) {
  const table = items.some((i) => i.when);
  if (!table)
    return (
      <Reveal className="mt-12 lg:mt-16">
        <ul aria-label={label} className="grid border-t border-paper/15 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <li
              key={it.item}
              className="flex min-h-[132px] flex-col justify-between gap-6 border-b border-paper/15 py-5 sm:odd:pr-6 sm:even:border-l sm:even:pl-6 lg:min-h-[160px] lg:border-l lg:px-6 lg:odd:pr-6 lg:[&:nth-child(3n+1)]:border-l-0 lg:[&:nth-child(3n+1)]:pl-0"
            >
              <span aria-hidden className={`size-[7px] ${i === 0 ? "bg-signal" : "bg-paper/80"}`} />
              <span className="type-title max-w-[26ch] text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] leading-[1.3]">{it.item}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    );
  return (
    <Reveal className="mt-12 lg:mt-16">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{label}</caption>
        <thead>
          <tr className="border-b border-paper/15 text-[13px] text-fog">
            <th scope="col" className="pb-3 font-normal">What ships</th>
            <th scope="col" className="hidden pb-3 font-normal sm:table-cell">How often</th>
            <th scope="col" className="hidden pb-3 font-normal lg:table-cell">Made in</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.item} className="group border-b border-paper/10 align-baseline transition-colors hover:bg-paper/[0.03]">
              <th scope="row" className="py-4 pr-6 font-normal lg:py-5">
                <span className="type-title block text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] leading-[1.3]">{it.item}</span>
                <span className="mt-1.5 block text-[14px] text-fog sm:hidden">
                  {it.when}
                  {it.layer ? ` · ${it.layer}` : ""}
                </span>
              </th>
              <td className="hidden py-4 pr-6 font-mono text-[13px] text-paper sm:table-cell lg:py-5">{it.when}</td>
              <td className="hidden py-4 text-[15px] lg:table-cell lg:py-5">
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden className="size-[6px] bg-paper/50 transition-colors group-hover:bg-signal" />
                  {it.layer}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Reveal>
  );
}
