/*
  Faint branded art behind a chapter (placeholder, to be drawn): `kind`
  picks the motif, `tone` the surface it sits on. It fills its positioned
  parent, is decoration only, and never takes the pointer.
*/

export type ArtKind = "contours" | "mark";
export type ArtTone = "paper" | "dark" | "red";

export function ArtField({
  kind,
  seed = 1,
  tone,
  className = "",
}: {
  kind: ArtKind;
  seed?: number;
  tone: ArtTone;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      data-art={kind}
      data-seed={seed}
      data-tone={tone}
      className={`pointer-events-none absolute inset-0 -z-10 ${className}`}
    />
  );
}
