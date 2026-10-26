/*
  Unit tests for lib/plot.ts, the clock plotted type is drawn by.
  Run: npx -y tsx --test src/lib/plot.test.ts
*/
import assert from "node:assert/strict";
import { test } from "node:test";
import { PACE, plotEnd, schedule, segments } from "./plot";

test("a word takes its characters, a space one character", () => {
  // "Journal." is 8 characters at 30ms, after a 160ms start
  assert.equal(plotEnd(["Journal."], PACE.hero, 160), 160 + 8 * 30);
  // two words: 3 + 1 (the space) + 4 characters
  assert.equal(plotEnd(["Get there"], 10), 3 * 10 + 10 + 5 * 10);
});

test("a new line waits for the pen's return, an accent for its lift", () => {
  const hero = ["Made to be", ["seen.", { text: "Everywhere.", accent: true }]] as const;
  // line one 300, return 60, "seen." 150, lift 120, space 30, "Everywhere." 330
  assert.equal(plotEnd(hero, PACE.hero, 160), 160 + 300 + 60 + 150 + 120 + 30 + 330);
});

test("each word starts where the last ended", () => {
  const { timed } = schedule([segments("One number.")], 10, 0);
  const [one, number] = timed[0][0].words;
  assert.deepEqual([one.t, one.d, number.t, number.d], [0, 30, 40, 70]);
});

test("blank segments and stray spaces are dropped", () => {
  assert.deepEqual(segments(["  Four layers. ", "", { text: " " }]), [{ text: "Four layers." }]);
});
