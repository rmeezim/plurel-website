import { Reveal } from "@/components/reveal";

/*
  The first ninety days as a plan on a ruler of thirteen weeks: each
  phase a bar from its first week to its last, its weeks and what ships
  under it, so the overlaps (the next phase starting while the last one
  finishes) are plain. The Diagnostic's week is the one lit.
*/

const range = (when: string): [number, number] => {
  const m = when.match(/(\d+)(?:\D+(\d+))?/);
  const a = m ? +m[1] : 1;
  return [a, m && m[2] ? +m[2] : a];
};

export function PhaseTrack({ items, weeks = 13, label }: { items: readonly { when: string; what: string }[]; weeks?: number; label: string }) {
  const pct = (w: number) => `${((w - 1) / weeks) * 100}%`;
  return (
    <Reveal className="mt-12 lg:mt-16">
      <div role="group" aria-label={label}>
        <div aria-hidden className="relative h-6 border-b border-paper/15">
          {Array.from({ length: weeks }, (_, i) => (
            <span
              key={i}
              className={`absolute bottom-0 h-full border-l border-paper/15 pl-1.5 font-mono text-[13px] leading-none text-fog ${i % 3 && i !== weeks - 1 ? "max-sm:text-transparent" : ""}`}
              style={{ left: pct(i + 1) }}
            >
              {i + 1}
            </span>
          ))}
        </div>
        <ol>
          {items.map((it, i) => {
            const [a, b] = range(it.when);
            return (
              <li key={it.when} className="relative border-b border-paper/10 py-5 lg:py-6">
                <div aria-hidden className="relative h-2.5">
                  <span
                    className={`absolute inset-y-0 ${i === 0 ? "bg-signal" : "bg-paper/80"}`}
                    style={{ left: pct(a), width: `calc(${((b - a + 1) / weeks) * 100}% - 3px)` }}
                  />
                </div>
                <div className="mt-3 lg:ml-[var(--x)] lg:max-w-[calc(100%-var(--x))]" style={{ ["--x" as string]: pct(a) }}>
                  <p className="font-mono text-[13px] leading-none text-fog">{it.when}</p>
                  <p className="mt-2 max-w-[44ch] text-[17px] leading-[1.45] text-paper">{it.what}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Reveal>
  );
}
