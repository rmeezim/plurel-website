/*
  Fluted glass, as pure data: the shader and the flute profiles. No DOM, so
  the profile math can be tested on its own (GlassBand draws with it).

  Nine flutes, one per cell of the Plurel mark. Each is a cylinder lens: it
  shows a magnified, shifted slice of the film behind it, darkens at its
  seams, and catches a thin highlight and a faint chromatic fringe at its
  edges. The film is the hero film when it exists (drawn small, so it
  arrives soft), otherwise a stand-in drawn in the palette.
*/

export type GlassProfile = "rise" | "retract";

const smooth = (p: number) => p * p * (3 - 2 * p);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Height of flute i (0..n-1) as a fraction of the band, for scroll progress
 * p (0..1). "rise": a rest line that steps into a rising staircase as the
 * visitor scrolls on (the hero). "retract": the staircase the hero ended
 * on, lifting back to a short fringe as the visitor scrolls on (the
 * closing edge, so the page ends where it began).
 */
export function fluteHeight(i: number, n: number, p: number, profile: GlassProfile, rest: number): number {
  const step = (i + 1) / n;
  const stair = rest + (1 - rest) * step;
  const e = smooth(clamp01(p));
  return profile === "rise" ? rest + (stair - rest) * e : stair + (rest - stair) * e;
}

/** Hover reach: the flute under the pointer, a little of its neighbours */
export function hoverWeight(i: number, hover: number, amount: number): number {
  if (hover < 0) return 0;
  const d = Math.abs(i - hover);
  return amount * (d < 0.5 ? 1 : d < 1.5 ? 0.22 : 0);
}

export const GLASS_VERT = `attribute vec2 a; varying vec2 v; void main(){ v = a * 0.5 + 0.5; gl_Position = vec4(a, 0.0, 1.0); }`;

export const GLASS_FRAG = `
precision highp float;
varying vec2 v;
uniform vec2 uRes;
uniform float uT, uP, uN, uRest, uAspect, uHover, uHoverK, uRetract, uUseVideo;
uniform vec3 uDark, uRed, uEmber, uBlush, uPaper;
uniform sampler2D uVideo;
uniform vec2 uVideoScale, uVideoOffset;

vec3 blob(vec3 col, vec2 p, vec2 c, float r, vec3 k, float s) {
  vec2 d = p - c; d.x *= uAspect;
  return mix(col, k, s * exp(-dot(d, d) / (r * r)));
}
vec3 standIn(vec2 p, float t) {
  vec3 col = mix(uDark, uRed * 0.62 + uDark * 0.38, 0.25 + 0.55 * p.y);
  col = blob(col, p, vec2(0.22 + 0.16 * sin(t * 0.13), 0.55 + 0.22 * cos(t * 0.11)), 0.30, uRed, 0.95);
  col = blob(col, p, vec2(0.68 + 0.20 * cos(t * 0.09 + 1.3), 0.40 + 0.18 * sin(t * 0.17)), 0.26, uEmber, 0.85);
  col = blob(col, p, vec2(0.48 + 0.32 * sin(t * 0.07 + 0.6), 0.82 + 0.06 * sin(t * 0.21)), 0.20, uBlush, 0.55);
  col = blob(col, p, vec2(0.86 + 0.08 * sin(t * 0.19), 0.24 + 0.10 * cos(t * 0.15)), 0.15, uPaper, 0.55);
  float fx = fract(t * 0.031) * 1.7 - 0.35;
  float body = smoothstep(0.075, 0.0, abs((p.x - fx) * uAspect * 0.55)) * smoothstep(0.18, 0.42, p.y);
  float head = smoothstep(0.05, 0.0, length(vec2((p.x - fx) * uAspect * 0.55, p.y - 0.30)));
  return mix(col, uDark * 0.55, clamp(body + head, 0.0, 1.0) * 0.6);
}
vec3 film(vec2 p, float t) {
  if (uUseVideo > 0.5) {
    vec2 q = clamp(p * uVideoScale + uVideoOffset, 0.0, 1.0);
    return texture2D(uVideo, q).rgb * 0.92;
  }
  return standIn(p, t);
}
float height(float i, float n, float p) {
  float stair = uRest + (1.0 - uRest) * ((i + 1.0) / n);
  float e = clamp(p, 0.0, 1.0); e = e * e * (3.0 - 2.0 * e);
  return uRetract > 0.5 ? mix(stair, uRest, e) : mix(uRest, stair, e);
}
void main() {
  vec2 uv = vec2(v.x, 1.0 - v.y);
  float n = uN;
  float i = floor(uv.x * n);
  float u = fract(uv.x * n);
  float d = abs(i - uHover);
  float k = uHover < 0.0 ? 0.0 : uHoverK * (d < 0.5 ? 1.0 : (d < 1.5 ? 0.22 : 0.0));
  float h = min(1.0, height(i, n, uP) + 0.07 * k);
  if (uv.y > h) { gl_FragColor = vec4(0.0); return; }
  float lens = u - 0.5;
  float mag = mix(2.3, 1.2, k);
  float sx = (i + 0.5) / n + lens * (1.0 / n) * mag + 0.05 * sin(i * 1.37 + 0.4) * (1.0 - 0.6 * k);
  float sy = uv.y * 0.9 + 0.05 + 0.035 * sin(i * 2.13);
  float ca = pow(abs(lens) * 2.0, 3.0) * 0.012 * (1.0 - 0.5 * k);
  vec3 c;
  c.r = film(vec2(sx + ca, sy), uT).r;
  c.g = film(vec2(sx, sy), uT).g;
  c.b = film(vec2(sx - ca, sy), uT).b;
  c *= 0.86 + 0.18 * sin(u * 3.14159);
  c *= mix(mix(0.62, 0.8, k), 1.0, smoothstep(0.0, 0.035, u) * smoothstep(1.0, 0.965, u));
  c += vec3(1.0, 0.96, 0.92) * (0.16 + 0.12 * k) * smoothstep(0.03, 0.0, abs(u - 0.045));
  c += vec3(0.25, 0.55, 0.65) * 0.05 * smoothstep(0.05, 0.0, abs(u - 0.96));
  c *= 1.0 + 0.16 * k;
  float px = 1.0 / uRes.y;
  c = mix(c, uPaper, k * smoothstep(h - 2.0 * px, h - px, uv.y));
  c *= 1.0 - 0.22 * smoothstep(h - 0.012, h, uv.y) * (1.0 - k);
  gl_FragColor = vec4(c, 1.0);
}`;
