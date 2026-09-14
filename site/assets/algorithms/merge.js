// merge.js — MERGE(A, p, q, r) 原书第 4 版（无 ∞ 哨兵，27 行）
//
// 已核对原文（pdf_index 57 / printed 36）。第 4 版用「复制 + 剩余复制循环」而非哨兵：
//  1 n_L = q − p + 1                                            // length of A[p .. q]
//  2 n_R = r − q                                                // length of A[q + 1 .. r]
//  3 let L[0 .. n_L − 1] and R[0 .. n_R − 1] be new arrays
//  4 for i = 0 to n_L − 1          // copy A[p .. q] into L[0 .. n_L − 1]
//  5     L[i] = A[p + i]
//  6 for j = 0 to n_R − 1          // copy A[q + 1 .. r] into R[0 .. n_R − 1]
//  7     R[j] = A[q + j + 1]
//  8 i = 0                          // i indexes smallest remaining in L
//  9 j = 0                          // j indexes smallest remaining in R
// 10 k = p                          // k indexes location in A to fill
// 11 // comment
// 12 while i < n_L and j < n_R
// 13     if L[i] ≤ R[j]
// 14         A[k] = L[i]
// 15         i = i + 1
// 16     else A[k] = R[j]
// 17         j = j + 1
// 18     k = k + 1
// 19 // comment
// 20 while i < n_L
// 21     A[k] = L[i]
// 22     i = i + 1
// 23     k = k + 1
// 24 while j < n_R
// 25     A[k] = R[j]
// 26     j = j + 1
// 27     k = k + 1
//
// 帧下标全部 1 基（与书一致）。counts.cmp 在第 13 行 `L[i] ≤ R[j]` 处 +1；
// counts.move 在每次把值写回 A 时 +1（第 14/16/21/25 行）。
// 注意：4 版 MERGE 不用 ∞ 哨兵，故无 Infinity；若后续章节的 3 版材料需要哨兵，另行实现。
//
// 关于 pointers：只放 **A 的下标**（p / q / r / k）。i 与 j 是临时数组 L、R 的下标，
// 它们不是 A 的位置 —— 画到 A 上会指向无意义的格子，所以只写进 note 供阅读。
// 原因见 2.3 关卡阶段 4 的面板说明：可视化引擎画的是 A，不是 L/R。

export function* merge(A, p, q, r, counts) {
  counts = counts || { cmp: 0, move: 0 };
  const nL = q - p + 1;
  const nR = r - q;
  const L = new Array(nL);
  const R = new Array(nR);
  const a = A;                       // 0 基工作副本（与调用方共享引用）

  for (let i = 0; i < nL; i++) L[i] = a[p - 1 + i];
  for (let j = 0; j < nR; j++) R[j] = a[q + j];

  const frame = (line, extra = {}) => ({
    line,
    array: a.slice(),
    pointers: extra.pointers || {},
    highlight: extra.highlight || {},
    note: extra.note || '',
    counts: { cmp: counts.cmp, move: counts.move },
    invariantHolds: true,
    done: false,
  });

  const seg = [];
  for (let x = p; x <= r; x++) seg.push(x);
  yield frame(4, {
    pointers: { p, q, r },
    highlight: { frontier: seg },
    note: `复制 A[${p}:${q}]→L，A[${q + 1}:${r}]→R（第 4–7 行）`,
  });

  let i = 0, j = 0, k = p;           // k 1 基
  while (i < nL && j < nR) {
    counts.cmp++;
    const takeLeft = L[i] <= R[j];
    yield frame(13, {
      pointers: { k, p, q, r },
      highlight: { compare: [k] },
      note: `比较 L[${i + 1}]=${L[i]} 与 R[${j + 1}]=${R[j]}：取 ${takeLeft ? 'L' : 'R'}`,
    });
    if (takeLeft) {
      a[k - 1] = L[i]; counts.move++; i++;
      yield frame(14, { pointers: { k, p, q, r }, highlight: { move: [k] }, note: `A[${k}] = L[${i}]` });
    } else {
      a[k - 1] = R[j]; counts.move++; j++;
      yield frame(16, { pointers: { k, p, q, r }, highlight: { move: [k] }, note: `A[${k}] = R[${j}]` });
    }
    k++;
    yield frame(18, { pointers: { k, p, q, r }, highlight: {}, note: `k = k + 1 = ${k}` });
  }
  while (i < nL) {
    a[k - 1] = L[i]; i++; k++; counts.move++;
    yield frame(21, { pointers: { k, p, q, r }, highlight: { move: [k - 1] }, note: `L 还有剩，直接抄回：A[${k - 1}] = L[${i}]` });
  }
  while (j < nR) {
    a[k - 1] = R[j]; j++; k++; counts.move++;
    yield frame(25, { pointers: { k, p, q, r }, highlight: { move: [k - 1] }, note: `R 还有剩，直接抄回：A[${k - 1}] = R[${j}]` });
  }
  yield frame(null, { pointers: { p, q, r }, note: `A[${p}:${r}] 已合并有序`, highlight: {} });
}
