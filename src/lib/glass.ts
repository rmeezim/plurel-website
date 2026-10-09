/*
  Fluted glass, as pure data: the shader, the flute profiles and the cursor
  light. No DOM, so the math can be tested on its own (GlassBand draws
  with it).

  Nine flutes, one per cell of the Plurel mark. Each is a solid rod of
  cool, clear glass: it shows a wide, shifted slice of the film behind it,
  rounds off into dark seams, and catches a crisp, cool specular line
  inside its left edge, a fainter rim on its right, a soft sheen down its
  lit shoulder and a split fringe at both rims (warm outside, cyan-steel
  inside). The cool belongs to the glass, not to the film: every rod
  tints what it shows toward steel at its top and down its lit
  shoulder, deepest where the film behind is dark and gone over its
  bright lights, so the cool falls in patches. Both profiles (the hero's
  rise and the closing arc) are the same glass. The tint
  keeps the film's light and shade (and its warm highlights), so any
  film, the red-graded one included, reads as red film through cool
  glass.
  The film is the hero film when it exists (drawn small, so it arrives
  soft), otherwise a stand-in drawn in the palette. The cursor brings warm
  light into the scene behind the glass, tinted by its direction of
  travel, and every rod bends its own slice of it. In the light's bright
  pool the glass's cool gives way and the scene turns warm; around it the
  glass stays cool, and the halo's glow comes through it dimmed where it
  shows its steel and held warm (its red always above its blue), so the
  light is never a cool one and never wipes the cool away around it.
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

/* ------------------------------------------------------------------ */
/* Cursor light                                                        */
/* ------------------------------------------------------------------ */

/** Most splats of light the shader reads at once (its uniform array is sized to it) */
export const MAX_SPLATS = 32;

/**
 * Light colour by direction of travel, as a hue in [0, 1) around the
 * circle, warm brand tones only: right is signal red, up a warm white,
 * left blush, down a light coral (brand red lifted, so it still shows on
 * the red film). The shader brings every stop to a common brightness, so
 * no direction reads weaker. Shared by the shader (palette) and tests.
 */
export const SPLAT_STOPS = [
  [0.91, 0.34, 0.31],
  [0.98, 0.91, 0.87],
  [0.95, 0.79, 0.75],
  [0.94, 0.52, 0.46],
] as const;

export const SPLAT = {
  /** Seconds the light lives where it was laid, and under reduced motion */
  life: 1.5,
  lifeStill: 0.6,
  /** Pixels of pointer travel between the trail's points */
  gap: 34,
  /** Soft radius of the light in pixels; it holds its size while it fades */
  radius: 46,
  /** Points that may be laid at once before the ration applies */
  burst: 4,
} as const;

/** A point of the trail: band-space position (0..1), hue (-1 starts a stroke), age in seconds */
export type TrailPoint = { x: number; y: number; hue: number; age: number };

/**
 * The cursor's trail of light: a soft ribbon along the pointer's path,
 * laid as points that stay where they are and fade in place. The last point
 * rides with the pointer, so the light never lags it. Points are rationed
 * so the shader's array never fills while one still shows: a fast sweep
 * lays them further apart instead of dropping the oldest mid-fade. The
 * ration refills on the same clock the points age by (trailAge), so a slow
 * or stalled frame rate cannot let points outlive their budget.
 */
export type Trail = {
  points: TrailPoint[];
  life: number;
  /** Last fixed point, in pixels; null between strokes */
  from: { x: number; y: number } | null;
  /** Whether the last point is still riding with the pointer */
  open: boolean;
  tokens: number;
};

export function createTrail(life: number): Trail {
  return { points: [], life, from: null, open: false, tokens: SPLAT.burst };
}

/** The pointer is at (x, y) pixels over a w x h band */
export function trailTo(tr: Trail, x: number, y: number, w: number, h: number) {
  if (!tr.from) {
    if (tr.tokens < 1) return;
    tr.tokens -= 1;
    tr.points.push({ x: x / w, y: y / h, hue: -1, age: 0 });
    tr.from = { x, y };
    tr.open = false;
  } else {
    const dx = x - tr.from.x;
    const dy = y - tr.from.y;
    if (!dx && !dy) return;
    if (!tr.open) {
      tr.points.push({ x: 0, y: 0, hue: 0, age: 0 });
      tr.open = true;
    }
    const head = tr.points[tr.points.length - 1];
    head.x = x / w;
    head.y = y / h;
    head.hue = (((Math.atan2(-dy, dx) / (2 * Math.PI)) % 1) + 1) % 1;
    head.age = 0;
    if (Math.hypot(dx, dy) >= SPLAT.gap && tr.tokens >= 1) {
      tr.tokens -= 1;
      tr.open = false;
      tr.from = { x, y };
    }
  }
  while (tr.points.length > MAX_SPLATS) tr.points.shift();
}

/** The pointer left the glass: its next move starts a new stroke */
export function trailBreak(tr: Trail) {
  // The riding point stays where it is: it is paid for now (a debt, if need be)
  if (tr.open) tr.tokens -= 1;
  tr.from = null;
  tr.open = false;
}

/**
 * Ages the trail by dt seconds and refills the ration by the same dt; a
 * point goes once the stretch after it has faded too
 */
export function trailAge(tr: Trail, dt: number) {
  // A point lives its life plus, at most, its successor's: with the riding
  // point that is burst + rate x life + 2, which this rate keeps to MAX_SPLATS
  tr.tokens = Math.min(SPLAT.burst, tr.tokens + dt * ((MAX_SPLATS - SPLAT.burst - 2) / tr.life));
  for (const p of tr.points) p.age += dt;
  const pts = tr.points;
  while (pts.length && pts[0].age >= tr.life && (pts.length < 2 || pts[1].age >= tr.life || pts[1].hue < 0)) pts.shift();
  // Nothing left alight: the next stroke starts like a fresh trail
  if (!pts.length) tr.tokens = SPLAT.burst;
}

/** Weight of a point of light at a given age: a calm, even fade to nothing */
export const fadeWeight = (age: number, life: number) => 1 - clamp01(age / life);

/** Packs the trail for the shader as (x, y, hue, weight); returns the count */
export function packTrail(tr: Trail, out: Float32Array) {
  const n = Math.min(tr.points.length, MAX_SPLATS);
  for (let k = 0; k < n; k++) {
    const p = tr.points[k];
    out[k * 4] = p.x;
    out[k * 4 + 1] = p.y;
    out[k * 4 + 2] = p.hue;
    out[k * 4 + 3] = fadeWeight(p.age, tr.life);
  }
  return n;
}

/* ------------------------------------------------------------------ */
/* Shader                                                              */
/* ------------------------------------------------------------------ */

export const GLASS_VERT = `attribute vec2 a; varying vec2 v; void main(){ v = a * 0.5 + 0.5; gl_Position = vec4(a, 0.0, 1.0); }`;

const stop = (k: number) => `vec3(${SPLAT_STOPS[k].map((x) => x.toFixed(3)).join(", ")})`;

export const GLASS_FRAG = `
precision highp float;
varying vec2 v;
uniform vec2 uRes;
uniform float uT, uP, uN, uRest, uAspect, uArc, uUseVideo, uSpN, uSpR;
uniform vec3 uDark, uRed, uEmber, uBlush, uPaper;
uniform sampler2D uVideo;
uniform vec2 uVideoScale, uVideoOffset;
uniform vec4 uSp[${MAX_SPLATS}];

const vec3 WARM = vec3(1.0, 0.96, 0.92);
const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);
// The glass's own cool: the grey-blue cast of thick glass (what it lets
// through, in shadows and mids), the steel it tints the film toward (SKY x
// the film's luminance, plus a little SLATE; green above red, so it reads
// steel, not lilac; KMIN over bright film, KMAX over dark) and the cool
// white of its catches
const vec3 CAST = vec3(0.93, 0.975, 1.0);
const vec3 SKY = vec3(0.6, 0.96, 1.24);
const vec3 SLATE = vec3(0.03, 0.045, 0.07);
const float KMIN = 0.26, KMAX = 0.92;
const vec3 FROST = vec3(0.86, 0.93, 1.0);
// What the cursor's light turns the scene it falls on: a dusty rose
const vec3 ROSE = vec3(1.26, 0.91, 0.84);

vec3 blob(vec3 col, vec2 p, vec2 c, float r, vec3 k, float s) {
  vec2 d = p - c; d.x *= uAspect;
  return mix(col, k, s * exp(-dot(d, d) / (r * r)));
}
// A soft, out-of-focus light, stretched wide so the rods' squeeze leaves
// it round
vec3 bokeh(vec3 col, vec2 p, vec2 c, float r, vec3 k) {
  vec2 d = p - c; d.x *= uAspect * 0.45;
  return col + k * 0.2 * smoothstep(r, 0.0, length(d));
}
// The stand-in film: a graphite room lit red, pale daylight from high on
// the left, a red practical near the ceiling, an ember wash, a blush floor
// light, a lit doorway on the left and a slatted two-pane window on the
// right (both drifting slowly), two soft out-of-focus lights, a beam and
// people crossing. Its lines and lights are what let the eye read the
// flutes as glass (each rod shows the door's jambs or the window's mullion
// in a different place); the cool is left to the glass, so it lands
// patchily: deep over the room's shadows, faint under its lights.
vec3 standIn(vec2 p, float t) {
  vec3 night = vec3(0.1, 0.07, 0.078);
  vec3 col = mix(night, mix(uEmber, uRed, 0.5) * 0.8, 0.2 + 0.7 * p.y);
  vec2 dl = vec2((p.x - 0.08) / 0.4, (p.y - 0.02) / 0.3);
  col = mix(col, vec3(0.36, 0.37, 0.4), 0.42 * exp(-dot(dl, dl)));
  col = blob(col, p, vec2(0.22 + 0.16 * sin(t * 0.13), 0.55 + 0.22 * cos(t * 0.11)), 0.34, uRed, 0.95);
  // The red practical high up: some rods' tops stay warm
  vec2 dr = vec2((p.x - 0.38 - 0.1 * sin(t * 0.05 + 0.5)) / 0.12, (p.y - 0.06) / 0.3);
  col = mix(col, uRed * 0.92, 0.75 * exp(-dot(dr, dr)));
  col = blob(col, p, vec2(0.72 + 0.16 * cos(t * 0.09 + 1.3), 0.34 + 0.14 * sin(t * 0.17)), 0.27, uEmber * 1.12, 0.85);
  col = blob(col, p, vec2(0.92 + 0.05 * sin(t * 0.11 + 2.0), 0.62 + 0.12 * cos(t * 0.13)), 0.24, mix(uEmber, uRed, 0.6), 0.75);
  col = blob(col, p, vec2(0.48 + 0.32 * sin(t * 0.07 + 0.6), 0.82 + 0.06 * sin(t * 0.21)), 0.20, uBlush, 0.56);
  float beam = smoothstep(0.2, 0.0, abs((p.x - 0.5) - (p.y - 0.5) * 0.6 + 0.05 * sin(t * 0.1)));
  col += uBlush * 0.08 * beam * smoothstep(0.05, 0.4, p.y);
  // The window: hard-edged slats and a mullion every rod repeats and bends;
  // it sits high, so the room's red and shadow show around it (wpx: the
  // room as the camera drifts)
  float wpx = p.x - 0.03 * sin(t * 0.05);
  float wx = smoothstep(0.69, 0.73, wpx) * smoothstep(0.9, 0.86, wpx);
  float wy = smoothstep(0.1, 0.15, p.y) * smoothstep(0.47, 0.41, p.y);
  wx *= 1.0 - 0.75 * smoothstep(0.008, 0.003, abs(wpx - 0.795));
  float slats = 0.86 + 0.14 * smoothstep(0.25, 0.75, abs(fract(p.y * 8.0 + t * 0.01) - 0.5) * 2.0);
  col = mix(col, mix(uBlush, uPaper, 0.1), wx * wy * slats * 0.4);
  // A doorway in the left third, a lit room beyond it: a dim warm-neutral
  // opening with a brighter jamb down each side, so the rods under the
  // headline each show an upright, and the lintel, in a different place
  float dx0 = wpx - 0.15, dx1 = 0.31 - wpx;
  float door = smoothstep(-0.014, 0.014, dx0) * smoothstep(-0.014, 0.014, dx1) * smoothstep(0.16, 0.21, p.y);
  float jamb = exp(-pow(dx0 / 0.009, 2.0)) + exp(-pow(dx1 / 0.009, 2.0));
  col += vec3(0.95, 0.86, 0.8) * ((0.06 + 0.05 * p.y) * door + 0.15 * jamb * smoothstep(0.16, 0.22, p.y));
  // Out of focus lights: one held beside the doorway, one drifting across
  // the room
  col = bokeh(col, p, vec2(0.345 + 0.02 * sin(t * 0.03), 0.4), 0.042, uBlush);
  col = bokeh(col, p, vec2(fract(0.58 + t * 0.0052), 0.659), 0.038, mix(uBlush, uPaper, 0.5));
  float fx = fract(t * 0.031) * 1.7 - 0.35;
  float body = smoothstep(0.075, 0.0, abs((p.x - fx) * uAspect * 0.55)) * smoothstep(0.18, 0.42, p.y);
  float head = smoothstep(0.05, 0.0, length(vec2((p.x - fx) * uAspect * 0.55, p.y - 0.3)));
  return mix(col, night * 0.5, clamp(body + head, 0.0, 1.0) * 0.6);
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
// The cursor's light in the scene behind the glass: a soft ribbon along
// the pointer's path, tinted by its direction, fading toward its tail.
// Every stop is lifted to one brightness, so red on the red film still
// shows; the ribbon is wider than tall in the scene, so the rods' squeeze
// leaves a pool of light, not a hairline, whichever way the cursor moves.
// Returns the light's colour and its strength (halo included); core is the
// peak of the bright pool alone, without the halo's long tail
vec4 light(vec2 q, out float core) {
  vec3 acc = vec3(0.0);
  float sum = 0.0, top = 0.0;
  core = 0.0;
  vec4 a = uSp[0];
  for (int k = 1; k < ${MAX_SPLATS}; k++) {
    if (float(k) >= uSpN) break;
    vec4 b = uSp[k];
    if (b.z >= 0.0) {
      vec2 pa = q - a.xy, ba = b.xy - a.xy;
      pa.x *= uAspect * 0.55; ba.x *= uAspect * 0.55;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-8), 0.0, 1.0);
      vec2 d = pa - ba * h;
      float e = dot(d, d) / (uSpR * uSpR);
      float wt = mix(a.w, b.w, h);
      float f = wt * (0.72 * exp(-e) + 0.28 * exp(-e * 0.2));
      vec3 k = palette(b.z);
      k *= clamp(0.62 / max(dot(k, LUMA), 1e-3), 1.0, 2.2);
      acc += f * k;
      sum += f;
      top = max(top, f);
      core = max(core, wt * exp(-e));
    }
    a = b;
  }
  return vec4(acc / max(sum, 1e-4), top);
}
void main() {
  vec2 uv = vec2(v.x, 1.0 - v.y);
  float n = uN;
  float i = floor(uv.x * n);
  float u = fract(uv.x * n);
  float h = height(i, n, uP);
  if (uv.y > h) { gl_FragColor = vec4(0.0); return; }
  float y = uv.y / h;
  // Each rod shows a wide slice of the film, shifted rod by rod; right at
  // its rims red bends a little further out (the warm fringe; the cool one
  // inside is drawn with the edges)
  float lens = u - 0.5;
  vec2 q = vec2((i + 0.5) / n + lens * 2.3 / n + 0.05 * sin(i * 1.37 + 0.4),
                uv.y * 0.9 + 0.05 + 0.08 * uArc + 0.035 * sin(i * 2.13));
  vec3 c = film(q, uT);
  float ca = pow(abs(lens) * 2.0, 6.0) * 0.012;
  if (ca > 0.0004) c.r = max(c.r, film(q + vec2(sign(lens) * ca, 0.0), uT).r);
  // What the glass lets through carries its grey-blue cast
  c *= mix(CAST, vec3(1.0), smoothstep(0.5, 0.8, dot(c, LUMA)));
  // Light behind the glass: it warms the scene the rod bends where its pool
  // falls (red film keeps its red, only warmer; anything cooler turns rose)
  // and brightens it, out to the edge of its halo (the glow, added below)
  float lit = 0.0, core = 0.0, warm = 0.0;
  vec3 glow = vec3(0.0);
  if (uSpN > 0.5) {
    vec4 g = light(q, core);
    lit = g.a;
    warm = smoothstep(0.0, 0.22, lit);
    vec3 tint = mix(vec3(1.0), c / max(max(c.r, max(c.g, c.b)), 1e-3), 0.4);
    tint.gb = min(tint.gb, vec2(tint.r));
    glow = g.rgb * tint * lit * 0.7;
    vec3 rose = dot(c, LUMA) * ROSE;
    vec3 warmed = c * vec3(1.12, 0.94, 0.86);
    float keep = smoothstep(-0.02, 0.02, (warmed.r - warmed.b) - (rose.r - rose.b));
    c = mix(c, mix(rose, warmed, keep), 0.85 * smoothstep(0.0, 0.3, core));
  }
  // The glass's own cool, tied to the rod, not to the film: a slate sky
  // toward its top and down its lit shoulder, deepest where the film
  // behind is dark, none over the film's bright lights. The hero and the
  // closing arc share this one material; only their profiles differ. The film
  // goes through grey before it takes the steel, so red never passes
  // through violet on the way. A tint, never a veil: the film's light and
  // shade survive and the seams stay deep. It gives way only in the
  // cursor's bright pool (core), not under the halo's long tail, so the
  // glass around the light stays cool. The shoulder dims down each rod and
  // varies rod to rod, a reflected sky rather than a printed stripe
  float cool = 1.0 - smoothstep(0.06, 0.4, core);
  float lum = dot(c, LUMA);
  float dark = 1.0 - smoothstep(0.04, 0.3, lum);
  float sky = pow(smoothstep(0.58, 0.0, y), 1.3);
  sky *= 0.82 + 0.18 * sin(i * 2.4 + 1.1);
  float shoulder = exp(-pow((u - 0.2) / 0.11, 2.0)) * (0.35 + 0.65 * (1.0 - y));
  shoulder *= (0.8 + 0.2 * sin(i * 1.7 + 0.6));
  float zone = cool * max(sky * (0.55 + 0.45 * dark), shoulder);
  float w = zone * mix(KMIN, KMAX, dark) * (1.0 - smoothstep(0.3, 0.7, lum));
  c = mix(c, vec3(lum), min(1.0, 1.5 * w));
  c = mix(c, lum * SKY + SLATE, w);
  // The cursor's glow comes through the glass: where the glass shows its
  // steel, the glow shows that much less, and it is warm only. In its pool
  // it keeps its colour; toward its halo's edge its green and blue are held
  // under its red, so a faint glow over the steel turns it neutral, never
  // a brighter blue
  glow = mix(glow, vec3(glow.r, min(glow.g, 0.7 * glow.r), min(glow.b, 0.5 * glow.r)), cool) * (1.0 - max(w, 0.85 * zone));
  c = 1.0 - (1.0 - c) * (1.0 - glow);
  // The rod: rounded shading, dark seams, a crisp catch-light inside the
  // left edge in a soft halo (cool; warm where the cursor's light is
  // behind it), a fainter rim on the right
  float px = n / uRes.x;
  c *= 0.86 + 0.18 * sin(u * 3.14159);
  c *= mix(0.6, 1.0, smoothstep(0.0, 0.035, u) * smoothstep(1.0, 0.965, u));
  vec3 hi = mix(FROST, WARM, smoothstep(0.0, 0.08, lit));
  float spec = smoothstep(1.3 * px, 0.2 * px, abs(u - 0.045));
  float halo = smoothstep(0.032, 0.0, abs(u - 0.047));
  c += hi * (0.24 * spec + 0.12 * halo) * (1.0 + 1.0 * lit);
  c += hi * 0.06 * smoothstep(1.2 * px, 0.0, abs(u - 0.962));
  // Dispersion: a cool (cyan-steel) fringe just inside each catch, beside
  // the warm one outside it
  float fringe = smoothstep(1.6 * px, 0.0, abs(u - 0.062)) + smoothstep(1.6 * px, 0.0, abs(u - 0.946));
  c += vec3(0.0, 0.05, 0.075) * fringe * cool;
  // A soft, cool sheen down the lit shoulder, brighter toward the top
  float sheen = exp(-pow((u - 0.17) / 0.075, 2.0)) * (1.0 - 0.6 * y);
  c += FROST * 0.06 * sheen * cool;
  c *= 1.0 + 0.16 * exp(-pow((u - 0.3) / 0.09, 2.0)) * (1.0 - 0.6 * y);
  // The bottom edge: a slight darkening, then a fine lit lip
  float py = 1.0 / uRes.y;
  c *= 1.0 - 0.2 * smoothstep(h - 0.012, h, uv.y);
  c += mix(FROST, WARM, max(0.5, warm)) * 0.1 * smoothstep(h - 2.0 * py, h - 0.5 * py, uv.y);
  // Where the cursor's light is, the brightest it gets is warm white
  gl_FragColor = vec4(min(c, mix(vec3(1.0), WARM, smoothstep(0.0, 0.05, lit))), 1.0);
}`;
