// counting-sort.js — 8.2 的 COUNTING-SORT 教学帧（原书 p.209，已按渲染页核对）。
//
// 输入：A[0..n-1] 的值域为 [0, k] 的非负整数。
// 三个阶段：① 计数 ② 前缀和 ③ 反向放置（保证稳定性）。
//
// 帧里的 `array` 交替展示三个数组：A（输入）、C（计数/前缀和）、B（输出）。
// 用 `phase` 字段区分当前阶段（附加字段，不影响 array 引擎的渲染）。

export function* countingSort(A, k) {
  const n = A.length;
  const kk = k != null ? k : Math.max(...A, 0);
  const C = new Array(kk + 1).fill(0);
  const B = new Array(n).fill(0);
  const counts = { cmp: 0, move: 0 };

  const frame = (line, arr, note, extra = {}) => ({
    line,
    array: arr.slice(),
    pointers: extra.pointers || {},
    highlight: extra.highlight || {},
    note,
    counts: { ...counts },
    phase: extra.phase,
    invariantHolds: true,
    done: false,
  });

  // ---- 阶段 ①：计数（第 4–5 行）----
  yield frame(1, A, `输入 A[1 : ${n}]，值域 [0, ${kk}]。三阶段：① 计数 ② 前缀和 ③ 反向放置。`);
  for (let j = 0; j < n; j++) {
    C[A[j]]++;
    counts.move++;
    yield frame(4, A, `第 4–5 行：C[${A[j]}] 加 1 → C[${A[j]}] = ${C[A[j]]}。`,
      { highlight: { active: [j + 1] }, phase: '计数' });
  }

  // ---- 阶段 ②：前缀和（第 7–8 行）----
  yield frame(7, C, `C 数组（计数完成）：C[i] = 值 i 出现的次数。`);
  for (let i = 1; i <= kk; i++) {
    C[i] += C[i - 1];
    yield frame(8, C, `第 7–8 行：C[${i}] = ${C[i]}（前缀和：≤ ${i} 的元素个数）。`,
      { highlight: { active: [i + 1] }, phase: '前缀和' });
  }

  // ---- 阶段 ③：反向放置（第 10–12 行）----
  yield frame(10, C, `阶段 ③：从 A 的**末尾**往前扫描，把每个元素放到 B 的正确位置。` +
    `★ 反向扫描保证了**稳定性**（相同值保持原来的相对次序）。`);
  for (let j = n - 1; j >= 0; j--) {
    B[C[A[j]] - 1] = A[j];
    C[A[j]]--;
    counts.cmp++; // 反向扫描中做了一次"判断放哪"的比较
    counts.move++;
    yield frame(11, B, `第 10–12 行：A[${j + 1}] = ${A[j]} → B[${C[A[j]] + 1}]。` +
      `C[${A[j]}] 减 1 → ${C[A[j]]}。`,
      { highlight: { move: [j + 1], result: [C[A[j]] + 1] }, phase: '放置' });
  }

  yield {
    line: 13,
    array: B.slice(),
    pointers: {},
    highlight: { done: B.map((_, i) => i + 1) },
    counts: { ...counts },
    note: `排序完成：[${B.join(', ')}]。总共 ${counts.move} 次写操作、${counts.cmp} 次"比较"。` +
      `★ 全程没有用到比较排序的"<"操作 —— 它用的是数组下标索引。这就是 8.1 的 Ω(n lg n) 下界不适用于它的原因。`,
    invariantHolds: true,
    done: true,
  };
}
