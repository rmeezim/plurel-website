/*
  Unit tests for the pure parts of lib/services-type.ts.
  Run: npx -y tsx --test src/lib/services-type.test.ts
*/
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DESK,
  FACE_STEPS,
  faceAt,
  HOUSE,
  PHONE,
  rowTimes,
  SERVICE_STAGE,
  setOrder,
  sizeAt,
  STAGES,
  T,
  textSize,
  TONE,
  toneAt,
  toOklab,
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

test("names are set in chain order, stage by stage", () => {
  const stages = SLUGS.map((s) => SERVICE_STAGE[s] as StageKey);
  const order = setOrder(stages);
  assert.deepEqual(order, [[1, 6], [0, 3], [2, 4, 5], [7]]);
  const times = rowTimes(order);
  for (let s = 1; s < order.length; s++) {
    const prev = Math.max(...order[s - 1].map((i) => times[i].face));
    const next = Math.min(...order[s].map((i) => times[i].face));
    assert.ok(next > prev, `${STAGES[s].name} starts after ${STAGES[s - 1].name}`);
  }
  // everything is set and revealed before the rows take the pointer
  for (const t of times) {
    assert.ok(t.face + T.face.len <= T.settled);
    assert.ok(t.meta + T.meta.len <= T.settled);
  }
});
