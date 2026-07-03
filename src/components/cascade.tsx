/**
 * Word-by-word text reveal — the same rise-and-sharpen treatment as the
 * operating-model detail cards, extracted so headlines can use it. Splits the
 * text into word spans with staggered `word-in` delays. Pure CSS: safe in
 * server components, and under reduced motion the words simply render
 * (the animation classes only exist inside the no-preference media block).
 *
 * For headlines built from several styled segments, pass the running word
 * `offset` so later segments continue the cascade instead of restarting it.
 */
export function Cascade({
  text,
  base = 0,
  step = 0.035,
  offset = 0,
}: {
  text: string;
  /** Seconds before the first word of the whole headline starts */
  base?: number;
  /** Seconds between one word and the next */
  step?: number;
  /** Number of words rendered by earlier segments of the same headline */
  offset?: number;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((word, i) => (
        <span key={i}>
          {i > 0 && " "}
          <span
            className="word-in"
            style={{
              animationDelay: `${Math.round((base + (offset + i) * step) * 1000)}ms`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </>
  );
}
