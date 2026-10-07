/*
  Fluted glass, as pure data: the shader and the flute profiles. No DOM, so
  the profile math can be tested on its own (GlassBand draws with it).

  Nine flutes, one per cell of the Plurel mark. Each is a shallow lens over
  the film: it shows the scene just behind it, flipped and a little
  squeezed, with a crisp highlight and a faint colour split at its edges.
  The film is the hero film when it exists (drawn small, so it arrives
  soft), otherwise a stand-in drawn in the palette. The cursor pours light
  into the scene behind the glass, tinted by its direction of travel.
*/

export type GlassProfile = "rise" | "arc";

const smooth = (p: number) => p * p * (3 - 2 * p);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * The finished shape of flute i (0..n-1), as a share of the drop below the
 * rest line. "rise": a staircase climbing left to right (the hero). "arc":
 * a symmetric curve, deepest at the center flute (the closing edge).
 */
function fluteShape(i: number, n: number, profile: GlassProfile): number {
  if (profile === "rise") return (i + 1) / n;
  const a = Math.pow(1 - Math.abs((i + 0.5) / n - 0.5) * 2, 1.1);
  return 0.12 + 0.88 * a;
}

/**
 * Height of flute i (0..n-1) as a fraction of the band, for scroll progress
 * p (0..1): every flute starts on the rest line and drops into the
 * profile's shape as the visitor scrolls on.
 */
export function fluteHeight(i: number, n: number, p: number, profile: GlassProfile, rest: number): number {
  return rest + (1 - rest) * fluteShape(i, n, profile) * smooth(clamp01(p));
}

/** Most cursor splats the shader reads at once (uniform arrays are sized to it) */
export const MAX_SPLATS = 16;

/*
  Cursor colour, by direction of travel, as a hue in [0, 1) around the
  circle: right is signal red, up warm paper, left a cool fog, down blush.
  Shared by the shader (palette) and tests.
*/
export const SPLAT_STOPS = [
  [0.91, 0.34, 0.31],
  [1.0, 0.93, 0.86],
  [0.62, 0.72, 0.84],
  [0.95, 0.79, 0.75],
] as const;

export const GLASS_VERT = `attribute vec2 a; varying vec2 v; void main(){ v = a * 0.5 + 0.5; gl_Position = vec4(a, 0.0, 1.0); }`;

const stop = (k: number) => `vec3(${SPLAT_STOPS[k].map((x) => x.toFixed(2)).join(", ")})`;

export const GLASS_FRAG = `
precision highp float;
varying vec2 v;
uniform vec2 uRes;
uniform float uT, uP, uN, uRest, uAspect, uArc, uUseVideo, uSpN;
uniform vec3 uDark, uRed, uEmber, uBlush, uPaper;
uniform sampler2D uVideo;
uniform vec2 uVideoScale, uVideoOffset;
uniform vec4 uSp[${MAX_SPLATS}];
uniform vec4 uSpHue[${MAX_SPLATS / 4}];

vec3 blob(vec3 col, vec2 p, vec2 c, float r, vec3 k, float s) {
  vec2 d = p - c; d.x *= uAspect;
  return mix(col, k, s * exp(-dot(d, d) / (r * r)));
}
// The stand-in film: a graphite studio lit red, a cool fill from the left,
// a soft window, bokeh and people crossing. Its lines and points of light
// are what let the eye read the flutes as glass.
vec3 standIn(vec2 p, float t) {
  vec3 col = mix(uDark * 1.7, uEmber * 0.6, smoothstep(0.0, 1.0, p.y));
  col = blob(col, p, vec2(0.3 + 0.2 * sin(t * 0.07), 0.58 + 0.1 * cos(t * 0.09)), 0.42, uRed, 0.88);
  col = blob(col, p, vec2(0.8 + 0.08 * cos(t * 0.05 + 1.0), 0.32 + 0.08 * sin(t * 0.11)), 0.3, uRed * 1.12, 0.62);
  col = blob(col, p, vec2(0.04, 0.22), 0.36, vec3(0.4, 0.44, 0.52), 0.42);
  col = blob(col, p, vec2(0.5 + 0.3 * sin(t * 0.06 + 0.6), 0.9), 0.2, uBlush, 0.45);
  float beam = smoothstep(0.14, 0.0, abs((p.x - 0.56) - (p.y - 0.5) * 0.65 + 0.05 * sin(t * 0.1)));
  col += uBlush * 0.14 * beam;
  float wx = smoothstep(0.66, 0.7, p.x) * smoothstep(0.95, 0.91, p.x);
  float wy = smoothstep(0.05, 0.1, p.y) * smoothstep(0.6, 0.5, p.y);
  float slats = 0.86 + 0.14 * smoothstep(0.25, 0.75, abs(fract(p.y * 8.0 + t * 0.01) - 0.5) * 2.0);
  col = mix(col, mix(uBlush, uPaper, 0.6), wx * wy * slats * 0.46);
  for (int k = 0; k < 9; k++) {
    float fk = float(k);
    vec2 c = vec2(fract(0.13 + fk * 0.371 + t * 0.003 * (1.0 + fk * 0.15)), 0.12 + 0.72 * fract(fk * 0.618 + 0.2));
    float r = 0.018 + 0.022 * fract(fk * 0.77);
    vec2 d = p - c; d.x *= uAspect;
    float disc = smoothstep(r, r * 0.55, length(d));
    col += mix(uBlush, uPaper, fract(fk * 0.5)) * disc * (0.22 + 0.14 * sin(t * 0.5 + fk));
  }
  float fx = fract(t * 0.031) * 1.7 - 0.35;
  float body = smoothstep(0.075, 0.0, abs((p.x - fx) * uAspect * 0.55)) * smoothstep(0.18, 0.42, p.y);
  float head = smoothstep(0.05, 0.0, length(vec2((p.x - fx) * uAspect * 0.55, p.y - 0.3)));
  return mix(col, uDark * 0.55, clamp(body + head, 0.0, 1.0) * 0.6);
}
vec3 film(vec2 p, float t) {
  if (uUseVideo > 0.5) {
    vec2 q = clamp(p * uVideoScale + uVideoOffset, 0.0, 1.0);
    return texture2D(uVideo, q).rgb * 0.95;
  }
  return standIn(p, t);
}
float height(float i, float n, float p) {
  float shape = (i + 1.0) / n;
  if (uArc > 0.5) shape = 0.12 + 0.88 * pow(1.0 - abs((i + 0.5) / n - 0.5) * 2.0, 1.1);
  float e = clamp(p, 0.0, 1.0); e = e * e * (3.0 - 2.0 * e);
  return uRest + (1.0 - uRest) * shape * e;
}
vec3 palette(float h) {
  float x = fract(h) * 4.0;
  vec3 a = ${stop(0)}, b = ${stop(1)}, c = ${stop(2)}, d = ${stop(3)};
  if (x < 1.0) return mix(a, b, x);
  if (x < 2.0) return mix(b, c, x - 1.0);
  if (x < 3.0) return mix(c, d, x - 2.0);
  return mix(d, a, x - 3.0);
}
float hueOf(int k) {
  vec4 q = uSpHue[0];
  for (int j = 1; j < ${MAX_SPLATS / 4}; j++) if (j == k / 4) q = uSpHue[j];
  int m = k - 4 * (k / 4);
  return m == 0 ? q.x : m == 1 ? q.y : m == 2 ? q.z : q.w;
}
// The light the cursor pours into the scene behind the glass: each splat
// is stretched along its direction of travel and tinted by it; a slow
// ripple keeps the edges liquid.
vec4 pour(vec2 q) {
  q += 0.03 * vec2(sin(q.y * 17.0 + uT * 1.9 + q.x * 6.0), sin(q.x * 13.0 - uT * 1.4 + q.y * 4.0));
  vec3 acc = vec3(0.0);
  float sum = 0.0;
  for (int k = 0; k < ${MAX_SPLATS}; k++) {
    if (float(k) >= uSpN) break;
    vec4 s = uSp[k];
    float hue = hueOf(k);
    float a = hue * 6.2831853;
    vec2 dir = vec2(cos(a), -sin(a));
    vec2 d = q - s.xy; d.x *= uAspect;
    vec2 r = vec2(dot(d, dir) * 0.6, dot(d, vec2(-dir.y, dir.x)));
    float f = s.w * exp(-dot(r, r) / (s.z * s.z));
    acc += f * palette(hue);
    sum += f;
  }
  return vec4(acc / max(sum, 1e-4), 1.0 - exp(-sum * 1.3));
}
void main() {
  vec2 uv = vec2(v.x, 1.0 - v.y);
  float n = uN;
  float i = floor(uv.x * n);
  float u = fract(uv.x * n);
  float h = height(i, n, uP);
  if (uv.y > h) { gl_FragColor = vec4(0.0); return; }
  // Reeded glass: each flute is a cylinder lens that shows the scene just
  // behind it flipped, magnified at its centre and squeezed toward its
  // edges, bowed vertically, with a faint colour split at the edges.
  float lens = u - 0.5;
  float bend = lens * 0.6 + lens * lens * lens * 3.2;
  vec2 q = vec2((i + 0.5) / n - bend / n + 0.012 * sin(i * 1.7 + 0.3),
                uv.y + 0.035 * (lens * lens * 4.0 - 0.33) + 0.01 * sin(i * 2.3));
  float ca = pow(abs(lens) * 2.0, 4.0) * 0.006;
  vec3 c;
  c.r = film(q + vec2(ca, 0.0), uT).r;
  c.g = film(q, uT).g;
  c.b = film(q - vec2(ca, 0.0), uT).b;
  if (uSpN > 0.5) {
    // Poured light keeps the glass's own light and shade underneath it
    vec4 g = pour(q);
    float lum = dot(c, vec3(0.2126, 0.7152, 0.0722));
    c = mix(c, g.rgb * (0.62 + 0.75 * lum), g.a * 0.78) + g.rgb * g.a * 0.12;
  }
  // The glass body: barely shaded, faintly cool, with one soft sheen
  c *= 0.92 + 0.1 * sin(u * 3.14159);
  c = mix(c, c * vec3(0.96, 0.985, 1.02), 0.5);
  c += vec3(1.0, 0.97, 0.94) * 0.06 * exp(-pow((u - 0.3) / 0.09, 2.0));
  // Edges: a crisp highlight with a warm fringe on the leading edge, a
  // cool fringe and a fine shadow on the trailing one
  float px = n / uRes.x;
  float lead = smoothstep(2.2 * px, 0.0, u);
  float tail = smoothstep(1.0 - 1.8 * px, 1.0, u);
  c = mix(c, vec3(1.0, 0.97, 0.94), lead * 0.34);
  c.r += 0.09 * smoothstep(5.0 * px, 2.5 * px, u) * smoothstep(1.2 * px, 2.5 * px, u);
  c.gb += 0.035 * smoothstep(1.0 - 6.0 * px, 1.0 - 3.0 * px, u) * (1.0 - tail);
  c *= 1.0 - tail * 0.45;
  // The bottom edge catches the light
  float py = 1.0 / uRes.y;
  c = mix(c, vec3(1.0, 0.97, 0.94), 0.3 * smoothstep(h - 2.0 * py, h - 0.5 * py, uv.y));
  gl_FragColor = vec4(c, 1.0);
}`;
