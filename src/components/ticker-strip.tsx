import { Spark } from "@/components/icons";

/*
 * Outlined-text ticker — graphic scale and motion with nothing new to
 * read. A slow marquee of display-scale outlined words with Spark marks
 * between them; one word runs solid brand. Use as a section divider, at
 * most once per page. Counts as a rest in the pacing system.
 */
export function TickerStrip({
  items,
  filledIndex = 2,
  dark = false,
}: {
  items: string[];
  /** Which word renders solid (brand) instead of outlined */
  filledIndex?: number;
  dark?: boolean;
}) {
  const outline = dark ? "text-outline-paper" : "text-outline-ink";
  const Run = () => (
    <span className="flex w-max items-center">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center">
          <span
            className={`whitespace-nowrap px-7 font-sans text-[clamp(3rem,7vw,6rem)] font-medium uppercase leading-none tracking-[-0.02em] sm:px-10 ${
              i === filledIndex ? "text-brand" : outline
            }`}
          >
            {item}
          </span>
          <Spark
            className={`size-6 shrink-0 sm:size-8 ${
              dark ? "text-paper/25" : "text-ink/20"
            }`}
          />
        </span>
      ))}
    </span>
  );

  return (
    <section
      aria-label={items.join(", ")}
      className={`overflow-hidden border-y py-9 sm:py-12 ${
        dark ? "border-paper/15" : "border-line"
      }`}
    >
      <span className="sr-only">{items.join(" — ")}</span>
      <div aria-hidden className="marquee-mask flex w-max">
        <div
          className="animate-marquee flex w-max"
          style={{ animationDuration: "38s" }}
        >
          <Run />
          <Run />
        </div>
      </div>
    </section>
  );
}
