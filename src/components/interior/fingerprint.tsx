import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { LAYERS, SERVICES } from "@/lib/nav";
import type { LayerKey } from "@/lib/nav";

/*
  What an engagement is built from, drawn as data. The print: the four
  layers left to right, a square for each discipline in the layer, lit
  where the engagement puts it to work (on /services, at the head of each
  engagement). The matrix: every discipline against every engagement, the
  same squares, so the whole catalog reads in one look.
*/

export function Fingerprint({ uses, label }: { uses: Record<LayerKey, readonly string[]>; label: string }) {
  return (
    <div role="img" aria-label={label} className="flex items-end gap-3">
      {LAYERS.map((L) => (
        <div key={L.key} className="flex flex-col-reverse gap-[3px]">
          {SERVICES.filter((s) => s.layer === L.key).map((s) => (
            <span key={s.slug} className={`block size-[9px] ${uses[L.key].includes(s.slug) ? "bg-paper" : "border border-paper/30"}`} />
          ))}
          <span className="mb-1 block h-px w-[9px] bg-paper/40" />
        </div>
      ))}
    </div>
  );
}

export function UseMatrix({
  engagements,
}: {
  engagements: readonly { key: string; term: string; href: string; uses: Record<LayerKey, readonly string[]> }[];
}) {
  return (
    <Reveal className="mt-12 overflow-x-auto lg:mt-16">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <caption className="sr-only">Which disciplines each engagement is built from</caption>
        <thead>
          <tr className="border-b border-paper/15">
            <th scope="col" className="pb-3 text-[13px] font-normal text-fog">
              Discipline
            </th>
            <th scope="col" className="pb-3 text-[13px] font-normal text-fog">
              Layer
            </th>
            {engagements.map((e) => (
              <th key={e.key} scope="col" className="w-[13%] pb-3 text-center text-[15px] font-medium">
                {e.term}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&:hover>tr:not(:hover)]:opacity-50">
          {SERVICES.map((s) => (
            <tr key={s.slug} className="border-b border-paper/10 transition-opacity duration-300">
              <th scope="row" className="py-3 pr-4 font-normal">
                <Link href={s.href} className="text-[16px] transition-colors hover:text-signal">
                  {s.name}
                </Link>
              </th>
              <td className="py-3 pr-4 text-[14px] text-fog">{LAYERS.find((L) => L.key === s.layer)!.name}</td>
              {engagements.map((e) => {
                const on = e.uses[s.layer].includes(s.slug);
                return (
                  <td key={e.key} className="py-3 text-center">
                    <span aria-hidden className={`inline-block size-[9px] align-middle ${on ? "bg-signal" : "border border-paper/25"}`} />
                    <span className="sr-only">{on ? `In ${e.term}` : `Not in ${e.term}`}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Reveal>
  );
}
