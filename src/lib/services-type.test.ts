/*
  Unit tests for the pure parts of lib/services-type.ts.
  Run: npx -y tsx --test src/lib/services-type.test.ts
*/
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  bandWindow,
  closeAt,
  DESK,
  drainTimes,
  dropAt,
  END,
  FACE_STEPS,
  faceAt,
  FEEDS_BACK,
  flightAt,
  flightX,
  HOUSE,
  HOUSE_FLIP,
  lockWindow,
  loopPath,
  PHONE,
  rowTimes,
  SERVICE_STAGE,
  setOrder,
  sinkAt,
  sizeAt,
  STAGES,
  SYSTEM,
  T,
  textSize,
  textWindow,
  TONE,
  toneAt,
  toOklab,
  type LoopPart,
  type StageKey,
} from "./services-type";
import { LAYERS, SERVICES } from "./nav";

// the menu's rows, as the site sets them
const stages = SERVICES.map((s) => SERVICE_STAGE[s.slug] as StageKey);
const order = setOrder(stages);

test("every supplier ends exactly on the house style", () => {
  for (const table of [DESK, PHONE]) {
    assert.equal(table.length, SERVICES.length);
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

test("the mono supplier eases from 100 onto the house width after its flip", () => {
  const lo = Math.min(100, HOUSE.wdth);
  const hi = Math.max(100, HOUSE.wdth);
  for (const table of [DESK, PHONE]) {
    const sp = table.find((s) => s.mono)!;
    assert.equal(faceAt(sp, 0.3).mono, true);
    assert.equal(faceAt(sp, 0.5).mono, false);
    const w5 = faceAt(sp, 0.5).wdth;
    assert.ok(lo <= w5 && w5 <= hi, `between 100 and the house width: ${w5}`);
    assert.ok(Math.abs(faceAt(sp, 0.9).wdth - HOUSE.wdth) <= (hi - lo) * 0.15 + 1e-9);
  }
});

test("every voice changes into the house family late, near normal width, and ends in it", () => {
  for (const table of [DESK, PHONE]) {
    for (const sp of table) {
      assert.equal(faceAt(sp, 0.5).house, false, `${sp.who} at 0.5`);
      assert.equal(faceAt(sp, HOUSE_FLIP).house, true, `${sp.who} at the flip`);
      assert.equal(faceAt(sp, 1).house, true, `${sp.who} at 1`);
      assert.ok(Math.abs(faceAt(sp, HOUSE_FLIP).wdth - 100) <= 4, `${sp.who}: ${faceAt(sp, HOUSE_FLIP).wdth}`);
    }
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
  // the timeline is in units of the first beats' pin (110svh desktop, 96svh
  // phones); the pin runs on to END for the bands and the loop, never longer
  // than 150svh / 110svh
  assert.ok(END <= 150 / 110 + 1e-12);
  assert.deepEqual(T.rule, { at: 0.155, step: 0.016, len: 0.14 });
  assert.deepEqual(T.gy, { at: 0.165, step: 0.007, len: 0.13 });
  assert.deepEqual(T.gx, { at: 0.29, step: 0.007, len: 0.11 });
  assert.deepEqual(T.chain, { at: 0.35, len: 0.1 });
  assert.deepEqual(T.face, { at: 0.485, step: 0.07, inner: 0.012, len: 0.1 });
  assert.deepEqual([...T.cap], [0.35, 0.53]);
});

test("the menu runs in the System's order, so each layer leaves from its top", () => {
  // every layer's rows are one run, in the bands' order: when a layer
  // drains, its names are the menu's top rows and nothing closes ranks
  assert.deepEqual(order, [[0, 1], [2, 3, 4, 5], [6, 7, 8], [9]]);
  assert.deepEqual(order.flat(), SERVICES.map((_, i) => i));
  const drains = drainTimes(order);
  for (let i = 0; i < SERVICES.length; i++) {
    for (let j = i + 1; j < SERVICES.length; j++) assert.ok(drains[j].layer >= drains[i].layer, `${SERVICES[j].name} after ${SERVICES[i].name}`);
  }
});

test("names are set in chain order, then drain into the bands, Narrative first", () => {
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
  for (let s = 0; s < order.length; s++) {
    // a layer's names leave together and land as its band locks
    const rows = order[s].map((i) => drains[i]);
    assert.ok(rows.every((d) => d.layer === s && d.land === lockWindow(s)[1] && d.leave < d.land));
    // its band comes down after its names have left, and its text lights as it locks
    const [b0, b1] = bandWindow(s);
    const [t0, t1] = textWindow(s);
    assert.ok(b0 > lockWindow(s)[0] && b1 === lockWindow(s)[1] && t0 >= b0 && t1 === b1);
    assert.equal(dropAt(b0, s), 0);
    assert.equal(dropAt(b1, s), 1);
    // top to bottom: each band starts coming down after the one above it
    if (s > 0) assert.ok(bandWindow(s)[0] > bandWindow(s - 1)[0] && lockWindow(s)[1] > lockWindow(s - 1)[1]);
  }
  // then the head hands over, the loop is drawn, the figure settles, and the pin rests a while
  const lastLock = lockWindow(order.length - 1)[1];
  assert.ok(T.loop.at >= lastLock && T.title >= lastLock && T.line.at >= lastLock);
  assert.ok(T.loop.at + T.loop.len <= T.settled);
  assert.ok(T.line.at + T.line.len <= T.settled && T.chainOut.at + T.chainOut.len <= T.settled);
  assert.ok(END - T.settled >= 0.05, "a rest at the end of the pin");
});

/*
  The choreography on a pinned screen: rows of pitch P from the menu's
  top, four equal bands of height B stacked from the top of an area A
  tall (the menu's top to the floor), the visible floor G above its foot.
  The set menu settles onto the visible floor; while a layer drains, the
  rows above its names close ranks toward the floor and its band comes
  down from the foot of the one above; at no point may a band coming
  down cover a row still on the menu.
*/
function menuClear(P: number, B: number, A: number, G: number, desk: boolean) {
  const drains = drainTimes(order);
  const N = SERVICES.length;
  const sinkBy = Math.max(0, A - G - N * P);
  let worst = Infinity;
  for (let p = T.sink.at; p <= END; p += 0.0005) {
    // the foot of the stack come down so far
    let foot = 0;
    for (let s = 0; s < STAGES.length; s++) {
      const e = dropAt(p, s);
      if (e > 0) foot = Math.max(foot, s * B + e * B);
    }
    // the highest row still on the menu (its layer has not left yet)
    let top = Infinity;
    for (let i = 0; i < N; i++) {
      if (p >= drains[i].leave) continue;
      let down = sinkAt(p) * sinkBy;
      for (let j = i + 1; j < N; j++) if (drains[j].layer < drains[i].layer) down += closeAt(p, drains[j].leave, desk) * P;
      top = Math.min(top, i * P + down);
    }
    if (top < Infinity && foot > 0) worst = Math.min(worst, top - foot);
  }
  return worst;
}

test("a band coming down never covers a row still on the menu", () => {
  // 1440x900 and 1366x768 (desktop, names fly); 390x844 and 768x1024 (they fold)
  assert.ok(menuClear(62, 176.75, 707, 20, true) >= 0, "1440x900");
  assert.ok(menuClear(53.4, 149.5, 598, 20, true) >= 0, "1366x768");
  assert.ok(menuClear(55.7, 159, 636, 16, false) >= 0, "390x844");
  assert.ok(menuClear(74.4, 204.75, 819, 16, false) >= 0, "768x1024");
});

test("the set menu settles onto the floor after the last name is set and before the first band comes down", () => {
  const lastSet = Math.max(...rowTimes(order).map((t) => t.face + T.face.len));
  assert.ok(T.sink.at > lastSet, "set first");
  assert.ok(T.sink.at + T.sink.len <= bandWindow(0)[0], "settled before Narrative comes down");
  assert.equal(sinkAt(T.sink.at), 0);
  assert.equal(sinkAt(T.sink.at + T.sink.len), 1);
});

test("a flight starts flat on its row and lands exactly in its band", () => {
  const start = flightAt(0, 392, 270, 980, 610, 0.4);
  assert.deepEqual(start, { x: 392, y: 270, s: 1 });
  assert.deepEqual(flightAt(1, 392, 270, 980, 610, 0.4), { x: 980, y: 610, s: 0.4 });
  // just before landing it is already all but there
  const near = flightAt(0.999, 392, 270, 980, 610, 0.4);
  assert.ok(Math.abs(near.x - 980) < 1 && Math.abs(near.y - 610) < 2 && Math.abs(near.s - 0.4) < 0.01);
  // out of the menu first: the corner has gone most of the way right
  // before it has come halfway down, and it comes down to the link's size
  const mid = flightAt(0.5, 0, 0, 100, 100, 0.4);
  assert.ok(mid.x > 80 && mid.y < 30, `mid-flight at ${mid.x.toFixed(1)}, ${mid.y.toFixed(1)}`);
  assert.ok(mid.s < 1 && mid.s > 0.4);
  for (let t = 0; t < 1; t += 0.05) assert.ok(flightX(t + 0.05) >= flightX(t));
});

test("the loop runs down the spine, Narrative first, then back up the return", () => {
  // the parts each band draws, as the markup has them (lengths in px)
  const parts: LoopPart[] = [];
  STAGES.forEach((L, s) => {
    if (s > 0) parts.push({ s, kind: "in", len: 120 });
    parts.push({ s, kind: "node", len: 7 });
    if (s < STAGES.length - 1) {
      parts.push({ s, kind: "out", len: 50 });
      parts.push({ s, kind: "arrow", len: 8 });
    }
    parts.push({ s, kind: "ret", len: s === 0 ? 50 : s === STAGES.length - 1 ? 120 : 170 });
    if (FEEDS_BACK.includes(L.key)) parts.push({ s, kind: "tap", len: 20, at: s === 0 ? 50 : 50 });
  });
  parts.push({ s: STAGES.length - 1, kind: "stub", len: 20 });
  parts.push({ s: 1, kind: "note", len: 0 });
  const { spans, total } = loopPath(parts);
  const at = (s: number, kind: LoopPart["kind"]) => spans.find((x) => x.s === s && x.kind === kind)!;
  // the spine: each band's way in, its node, its way out, in order, Narrative first
  let d = -1;
  for (let s = 0; s < STAGES.length; s++) {
    if (s > 0) {
      assert.ok(at(s, "in").d0 >= d, `${STAGES[s].name} in`);
      d = at(s, "in").d1;
    }
    assert.ok(at(s, "node").d0 >= d - 1e-9, `${STAGES[s].name} node`);
    if (s < STAGES.length - 1) {
      d = at(s, "out").d1;
      // the arrowhead pops as the spine crosses into the band below
      assert.ok(at(s, "arrow").d0 < d && at(s, "arrow").d1 > d);
    }
  }
  // then the Ledger's stub, and the return from the last band back up to Narrative
  const last = STAGES.length - 1;
  assert.ok(at(last, "stub").d0 >= d);
  let r = at(last, "stub").d1;
  for (let s = last; s >= 0; s--) {
    assert.ok(Math.abs(at(s, "ret").d0 - r) < 1e-9, `${STAGES[s].name} return`);
    r = at(s, "ret").d1;
  }
  // the taps draw as the return passes their nodes, inside their band's return
  for (const k of FEEDS_BACK) {
    const s = STAGES.findIndex((x) => x.key === k);
    assert.ok(at(s, "tap").d0 >= at(s, "ret").d0 && at(s, "tap").d0 <= at(s, "ret").d1, k);
  }
  // and the note last
  const note = spans.find((x) => x.kind === "note")!;
  assert.ok(note.d0 >= Math.max(...spans.filter((x) => x.kind !== "note").map((x) => x.d1)) - 1e-9);
  assert.equal(total, note.d1);
});

test("the nav's layers match the System's, so the menu groups the disciplines as the bands do", () => {
  assert.deepEqual(
    LAYERS.map((l) => l.key),
    STAGES.map((s) => s.key),
  );
  for (const svc of SERVICES) assert.equal(svc.layer, SERVICE_STAGE[svc.slug], svc.name);
});

test("the System's copy: each layer builds one named thing and feeds the next", () => {
  assert.deepEqual(
    STAGES.map((s) => s.key),
    ["narrative", "create", "distribute", "measure"],
  );
  STAGES.forEach((L, s) => {
    assert.ok(/^The [A-Z]/.test(L.builds), L.name);
    if (s < STAGES.length - 1) assert.equal(L.feeds, `Feeds ${STAGES[s + 1].name}`);
  });
  const top = STAGES[STAGES.length - 1];
  for (const k of FEEDS_BACK) assert.ok(top.feeds.includes(STAGES.find((x) => x.key === k)!.name), k);
  assert.equal(SYSTEM.note, "Read monthly. Reset quarterly.");
  // plain words: no dashes, no agency vocabulary, no B2B-only nouns
  for (const t of [SYSTEM.title, SYSTEM.line, ...STAGES.flatMap((s) => [s.builds, s.line, s.feeds])]) {
    assert.ok(!/[–—]/.test(t), t);
    assert.ok(!/qualified demand|inquir|pipeline|\bleads?\b|every channel/i.test(t), t);
  }
});
