// merge-sort.js — MERGE-SORT(A, p, r) 原书 7 行（pdf_index 60 / printed 39，已核对印刷页图）
//
//  1 if p ≥ r                          // zero or one element?
//  2     return
//  3 q = ⌊(p + r)/2⌋                   // midpoint of A[p : r]
//  4 MERGE-SORT(A, p, q)               // recursively sort A[p : q]
//  5 MERGE-SORT(A, q + 1, r)           // recursively sort A[q + 1 : r]
//  6 // Merge A[p : q] and A[q + 1 : r] into A[p : r].
//  7 MERGE(A, p, q, r)
//
// 第 4 版的排版约定（与第 3 版不同，本站严格照抄）：子数组写 A[p : q]（冒号）；
// 伪代码用 = 表示赋值；注释用 //。
//
// 「一条代码两种用途」：本生成器既可在 node 中断言测试（跑完得排序结果），
// 也可由 stepper 把每一帧映射成动画。divide 阶段 yield 帧显示 p/q/r 子树，
// combine 阶段 yield* merge(...) 的帧。counts 在整棵递归中累加（cmp / move）。
//
// 顶层入口 mergeSort(A)：在整段 A[1..n] 上排序；数组内部按 0 基处理，帧下标 1 基。

import { merge } from './merge.js';

export function* mergeSort(A, lo = 1, hi = null) {
  if (hi === null) hi = A.length;
  const counts = { cmp: 0, move: 0 };
  const a = A.slice();
  yield* mergeSortRec(a, lo, hi, counts);
  yield { line: null, done: true, array: a.slice(), counts: { cmp: counts.cmp, move: counts.move } };
}

function* mergeSortRec(a, p, r, counts) {
  // 第 1 行：if p ≥ r then return
  if (p >= r) {
    yield {
      line: 1, array: a.slice(), pointers: { p, r }, highlight: {},
      note: p > r ? `空区间 A[${p}:${r}]` : `A[${p}] 单元素，已有序`,
      counts: { cmp: counts.cmp, move: counts.move }, invariantHolds: true, done: false,
    };
    return;
  }
  // 第 3 行：q = ⌊(p + r) / 2⌋
  const q = Math.floor((p + r) / 2);
  yield {
    line: 3, array: a.slice(), pointers: { p, q, r }, highlight: { pivot: [q] },
    note: `q = ⌊(p+r)/2⌋ = ${q}：划分 A[${p}:${q}] 与 A[${q + 1}:${r}]`,
    counts: { cmp: counts.cmp, move: counts.move }, invariantHolds: true, done: false,
  };
  // 第 4 行：MERGE-SORT(A, p, q)
  yield { line: 4, array: a.slice(), pointers: { p, q, r }, highlight: {}, note: `递归排序左半 A[${p}:${q}]`, counts: { cmp: counts.cmp, move: counts.move }, invariantHolds: true, done: false };
  yield* mergeSortRec(a, p, q, counts);
  // 第 5 行：MERGE-SORT(A, q + 1, r)
  yield { line: 5, array: a.slice(), pointers: { p, q, r }, highlight: {}, note: `递归排序右半 A[${q + 1}:${r}]`, counts: { cmp: counts.cmp, move: counts.move }, invariantHolds: true, done: false };
  yield* mergeSortRec(a, q + 1, r, counts);
  // 第 7 行：MERGE(A, p, q, r)
  yield { line: 7, array: a.slice(), pointers: { p, q, r }, highlight: {}, note: `合并 A[${p}:${q}] 与 A[${q + 1}:${r}]`, counts: { cmp: counts.cmp, move: counts.move }, invariantHolds: true, done: false };
  yield* merge(a, p, q, r, counts);
}
