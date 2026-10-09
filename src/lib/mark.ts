/**
 * The Plurel mark's cells as [x, y, w, h] on its 10-unit square: four 2x2
 * corners, four 2x4 / 4x2 edges, one 4x4 center, 1-unit gutters. Row-major
 * order, so index 4 is the center. The logo draws these exactly.
 */
export const MARK_CELLS: readonly (readonly [number, number, number, number])[] = [
  [0, 0, 2, 2],
  [3, 0, 4, 2],
  [8, 0, 2, 2],
  [0, 3, 2, 4],
  [3, 3, 4, 4],
  [8, 3, 2, 4],
  [0, 8, 2, 2],
  [3, 8, 4, 2],
  [8, 8, 2, 2],
];
