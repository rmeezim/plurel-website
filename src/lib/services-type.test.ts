/*
  Unit tests for the pure parts of lib/services-type.ts.
  Run: npx -y tsx --test src/lib/services-type.test.ts
*/
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  compose,
  decompose,
  DESK,
  drainTimes,
  END,
  FACE_STEPS,
  faceAt,
  flightAt,
  HOUSE,
  lockWindow,
  PHONE,
  PLATE,
  plateMatrix,
  rowTimes,
  SERVICE_STAGE,
  setOrder,
  sizeAt,
  stackGeometry,
  STAGES,
  T,
  textSize,
  TONE,
  toneAt,
  toOklab,
  type Mat,
  type StageKey,
} from "./services-type";

const SLUGS = [
  "website-design",
  "brand-identity",
  "aeo-seo",
  "content-marketing",
  "paid-ads",
  "pr-reputation",
  "creative-direction",
  "martech-consulting",
];
const NAMES = [
  "Website Design",
  "Brand Identity",
  "AI Search & SEO",
  "Content Marketing",
  "Paid Ads",
  "PR & Reputation",
  "Creative Direction",
  "Martech & Consulting",
];
const stages = SLUGS.map((s) => SERVICE_STAGE[s] as StageKey);
const order = setOrder(stages);

test("every supplier ends exactly on the house style", () => {
  for (const table of [DESK, PHONE]) {
    assert.equal(table.length, 8);
    for (const sp of table) {
      const f = faceAt(sp, 1);
      assert.equal(f.mono, false, `${sp.who}: family`);
      assert.equal(f.wght, HOUSE.wght, `${sp.who}: weight`);
      assert.equal(f.wdth, HOUSE.wdth, `${sp.who}: width`);
      assert.equal(f.tr, HOUSE.tr, `${sp.who}: tracking`);
      assert.deepEqual([...f.rgb], [...HOUSE.rgb], `${sp.who}: colour`);
      assert.equal(f.cs, "none", `${sp.who}: case`);
      assert.equal(f.sk, 0, `${sp.who}: slant`);
      // and the size is the row's own size, unquantized
      assert.equal(sizeAt(sp.size, 30, 50.4, 1, 1), 50.4);
    }
  }
});

test("the mono supplier reaches the house width, never stuck at 100", () => {
  for (const table of [DESK, PHONE]) {
    const sp = table.find((s) => s.mono)!;
    assert.equal(faceAt(sp, 0.3).mono, true);
    assert.equal(faceAt(sp, 0.5).mono, false);
    assert.ok(faceAt(sp, 0.5).wdth > 100);
    assert.ok(faceAt(sp, 0.9).wdth >= 108.5);
  }
});

test("axes are quantized while setting", () => {
  for (const sp of DESK) {
    for (let t = 0; t < 1; t += 0.037) {
      const f = faceAt(sp, t);
      assert.equal(f.wght % 10, 0);
      assert.equal(f.wdth, Math.round(f.wdth));
    }
  }
  // laid-out sizes step by half pixels from the house size, landing on it
  const s = textSize(sizeAt(92, 56, 50.4, 1, 0.3), 50.4);
  assert.equal((s - 50.4) * 2, Math.round((s - 50.4) * 2));
  assert.equal(textSize(sizeAt(92, 56, 50.4, 1, 0.98), 50.4), 50.4);
});

test("the last face steps are exactly the house style", () => {
  // render() steps the face in FACE_STEPS: the step before the hand-off
  // already lays the name out exactly as the row's own text
  const tq = Math.round(0.98 * FACE_STEPS) / FACE_STEPS;
  for (const sp of [...DESK, ...PHONE]) {
    const f = faceAt(sp, tq);
    assert.deepEqual({ ...f, rgb: [...f.rgb] }, { ...HOUSE, rgb: [...HOUSE.rgb] }, sp.who);
  }
});

test("colour never passes through pink", () => {
  // the reds turn paper on the step their case flips, with nothing between
  for (const c of ["brand", "signal"] as const) {
    for (let t = 0; t <= 1.0001; t += 0.01) {
      const rgb = [...toneAt(c, t)];
      assert.ok(String(rgb) === String(TONE[c]) || String(rgb) === String(HOUSE.rgb), `${c} at ${t.toFixed(2)}: ${rgb}`);
    }
    const sp = DESK.find((s) => s.c === c)!;
    assert.equal(faceAt(sp, 0.45).cs, "upper");
    assert.deepEqual([...faceAt(sp, 0.45).rgb], [...TONE[c]]);
    assert.equal(faceAt(sp, 0.5).cs, "none");
    assert.deepEqual([...faceAt(sp, 0.5).rgb], [...HOUSE.rgb]);
  }
  // the quiet tones move in OKLab: their hue never swings, lightness only rises
  for (const c of ["fog", "blush"] as const) {
    let lastL = -1;
    for (let t = 0; t <= 1.0001; t += 0.05) {
      const [L, a, b] = toOklab(toneAt(c, t));
      assert.ok(L >= lastL - 1e-3, `${c} lightness at ${t.toFixed(2)}`);
      assert.ok(Math.hypot(a, b) < 0.05, `${c} chroma at ${t.toFixed(2)}`);
      lastL = L;
    }
    assert.deepEqual([...toneAt(c, 1)], [...HOUSE.rgb]);
  }
});

test("the quiet voices keep their floors", () => {
  for (const table of [DESK, PHONE]) {
    for (const who of ["brand studio", "consultants"]) {
      const sp = table.find((s) => s.who === who)!;
      assert.ok((sp.min ?? 0) >= (table === DESK || who === "consultants" ? 20 : 16), who);
    }
  }
});

test("the first two beats keep the timing they were drawn for", () => {
  // the pin grew by 40svh on desktop (110 -> 150) for the stacking: the
  // timeline is in units of the old pin, so every beat before it is untouched
  assert.equal(END, 150 / 110);
  assert.deepEqual(T.rule, { at: 0.155, step: 0.016, len: 0.14 });
  assert.deepEqual(T.gy, { at: 0.165, step: 0.007, len: 0.13 });
  assert.deepEqual(T.gx, { at: 0.29, step: 0.007, len: 0.11 });
  assert.deepEqual(T.chain, { at: 0.35, len: 0.1 });
  assert.deepEqual(T.face, { at: 0.485, step: 0.07, inner: 0.012, len: 0.1 });
  assert.deepEqual([...T.cap], [0.35, 0.53]);
});

test("names are set in chain order, stage by stage, then drain layer by layer", () => {
  assert.deepEqual(order, [[1, 6], [0, 3], [2, 4, 5], [7]]);
  const times = rowTimes(order);
  for (let s = 1; s < order.length; s++) {
    const prev = Math.max(...order[s - 1].map((i) => times[i].face));
    const next = Math.min(...order[s].map((i) => times[i].face));
    assert.ok(next > prev, `${STAGES[s].name} starts after ${STAGES[s - 1].name}`);
  }
  // every name is set before the first layer leaves
  const lastSet = Math.max(...times.map((t) => t.face + T.face.len));
  const drains = drainTimes(order);
  assert.ok(Math.min(...drains.map((d) => d.leave)) > lastSet + 0.03, "the set menu holds a moment");
  // foundation first, each layer locking after the one below it, its names
  // landing together as it locks
  for (let s = 0; s < order.length; s++) {
    const rows = order[s].map((i) => drains[i]);
    assert.ok(rows.every((d) => d.layer === s && d.land === lockWindow(s)[1] && d.leave < d.land));
    if (s > 0) assert.ok(lockWindow(s)[1] > lockWindow(s - 1)[1]);
  }
  // all of it, and the list's rise, before the figure takes the pointer, and
  // the pin rests a while after
  assert.ok(Math.max(...drains.map((d) => d.land)) <= T.list.at + T.list.len);
  assert.ok(T.list.at + 3 * T.list.step + T.list.len <= T.settled);
  assert.ok(T.chainOut.at + T.chainOut.len <= T.settled);
  assert.ok(END - T.settled >= 0.08, "a rest at the end of the pin");
});

test("a matrix decomposes into the plate's turn and foreshortening", () => {
  const m = plateMatrix();
  const d = decompose(m);
  assert.ok(Math.abs(d.s - 1) < 1e-9);
  assert.ok(Math.abs(d.phi - (PLATE.phi * Math.PI) / 180) < 1e-9);
  assert.ok(Math.abs(d.k - PLATE.k) < 1e-9);
  const c = compose(1.7, -0.4, 0.6, 12, -3);
  const e = decompose(c);
  const back = compose(e.s, e.phi, e.k, c[4], c[5]);
  c.forEach((v, i) => assert.ok(Math.abs(v - back[i]) < 1e-9));
});

test("a flight starts flat on its row and lands exactly on its plate", () => {
  const to: Mat = [0.42, -0.12, 0.24, 0.21, 980, 610];
  const start = flightAt(0, 392, 270, to);
  [1, 0, 0, 1, 392, 270].forEach((v, i) => assert.ok(Math.abs(start[i] - v) < 1e-12, `start ${i}: ${start[i]}`));
  assert.deepEqual([...flightAt(1, 392, 270, to)], [...to]);
  // just before landing it is already all but there
  const near = flightAt(0.999, 392, 270, to);
  near.forEach((v, i) => assert.ok(Math.abs(v - to[i]) < 0.02 * Math.max(1, Math.abs(to[i])), `component ${i}`));
  // out of the menu first: the corner has gone most of the way right
  // before it has come halfway down
  const mid = flightAt(0.5, 0, 0, [1, 0, 0, 1, 100, 100]);
  assert.ok(mid[4] > 80 && mid[5] < 30, `mid-flight at ${mid[4].toFixed(1)}, ${mid[5].toFixed(1)}`);
});

test("the stack: four plates, foundation at the bottom, names on the strip nobody covers", () => {
  const geo = stackGeometry(
    STAGES.map((s) => ({ key: s.key, names: stages.flatMap((k, i) => (k === s.key ? [{ i, text: NAMES[i] }] : [])) })),
  );
  assert.equal(geo.plates.length, 4);
  assert.deepEqual(
    geo.plates.map((p) => p.key),
    STAGES.map((s) => s.key),
  );
  // the foundation is drawn first and sits lowest; each plate the same gap above the last
  for (let i = 1; i < 4; i++) {
    const dy = geo.plates[i - 1].face[0][1] - geo.plates[i].face[0][1];
    assert.ok(Math.abs(dy - PLATE.gap) < 0.02, `gap ${i}: ${dy}`);
  }
  // everything inside the viewBox, the lift included
  for (const p of geo.plates) {
    for (const [x, y] of [...p.face, ...p.sideL, ...p.sideR, ...p.lip]) {
      assert.ok(x >= 0 && x <= geo.w && y - PLATE.lift >= 0 && y <= geo.h, `${p.key} ${x},${y}`);
    }
  }
  // every service on its layer's plate, once
  const all = geo.plates.flatMap((p) => p.names.map((n) => n.i)).sort();
  assert.deepEqual(all, [0, 1, 2, 3, 4, 5, 6, 7]);
  // each name's baseline lies on its plate, in the front strip the plate
  // above never covers (depth gap cos(phi) / k from the front edge), with
  // room for the capitals above it
  const [a, b, c, d] = plateMatrix();
  const det = a * d - b * c;
  const strip = (PLATE.gap * Math.cos((PLATE.phi * Math.PI) / 180)) / PLATE.k;
  for (const p of geo.plates) {
    const [ox, oy] = p.face[0];
    for (const n of p.names) {
      const x = n.m[4] - ox;
      const y = n.m[5] - oy;
      const u = (d * x - c * y) / det;
      const v = (-b * x + a * y) / det;
      assert.ok(u >= PLATE.pad - 0.5 && u <= PLATE.W, `${n.text}: u ${u}`);
      assert.ok(v <= PLATE.D && v - 0.75 * 28 >= PLATE.D - strip, `${n.text}: v ${v}`);
    }
  }
});

test("the layer lines are plain: one line each, no dashes", () => {
  for (const s of STAGES) {
    assert.ok(s.line.length <= 80, s.name);
    assert.ok(!/[–—]/.test(s.line), s.name);
    assert.ok(!/inquir|pipeline/i.test(s.line), s.name);
  }
});
