// insertion-sort.js — 插入排序驱动（JS 生成器，一份代码两种用途）
//
// 对应原书 INSERTION-SORT(A, n)，8 行伪代码（pdf_index 40 / printed 19，已核对原文）。
//  1 for i = 2 to n
//  2     key = A[i]
//  3     // Insert A[i] into the sorted subarray A[1 .. i − 1].   （注释，非可执行）
//  4     j = i − 1
//  5     while j > 0 and A[j] > key
//  6         A[j + 1] = A[j]
//  7         j = j − 1
//  8     A[j + 1] = key
//
// 帧契约（开发规范 4.3）：每次 yield 是一帧。下标全部 1 基（与书一致）。
//   - pointers.i / pointers.j / pointers.key：书中变量位置（1 基）
//   - highlight.active / compare / move / sortedPrefix：高亮集合
//   - counts.line5：★ 书中 2.2 的 Σtᵢ ——「第 5 行被求值的次数」，
//       包含每轮最后一次为假的那次判断（这点极易被数错，见下面 while 的写法）
//   - counts.cmp：条件为真、因而触发搬移的比较次数（= line5 − (n−1)）
//   - counts.move：第 6 / 8 行搬移次数
//
// 注：第 4 版 MERGE 不使用 ∞ 哨兵；但插入排序本身无哨兵，故此处无相关处理。

export function* insertionSort(A) {
  const a = A.slice();                 // 0 基工作副本（不动原数组）
  const n = a.length;
  const counts = { cmp: 0, move: 0, line5: 0 };

  const frame = (line, extra = {}) => ({
    line,
    array: a.slice(),
    pointers: extra.pointers || {},
    highlight: extra.highlight || {},
    note: extra.note || '',
    counts: { cmp: counts.cmp, move: counts.move, line5: counts.line5 },
    invariantHolds: extra.invariantHolds !== undefined ? extra.invariantHolds : true,
    done: false,
  });

  if (n <= 1) {
    yield frame(null, {
      note: n === 0 ? '空数组，已有序' : '单元素天然有序',
      highlight: { sortedPrefix: n },
    });
    yield { line: null, done: true, array: a.slice(), counts: { cmp: 0, move: 0, line5: 0 } };
    return;
  }

  // 第 1 行：for i = 2 to n（循环不变量初始化：A[1] 已排序）
  yield frame(1, { highlight: { sortedPrefix: 1 }, note: '循环不变量：A[1] 已排序（单元素）' });

  for (let bi = 2; bi <= n; bi++) {        // bi = 书中 i（1 基）
    const key = a[bi - 1];
    let bj = bi - 1;                        // bj = 书中 j（1 基）
    // 第 2 行：key = A[i]
    yield frame(2, { pointers: { i: bi, key: bi }, highlight: { active: [bi] }, note: `key = A[${bi}] = ${key}` });
    // 第 4 行：j = i − 1
    yield frame(4, { pointers: { i: bi, j: bj, key: bi }, highlight: { active: [bi] }, note: `j = i − 1 = ${bj}` });
    // 第 5 行：while j > 0 and A[j] > key
    // ★ 忠于书中 2.2 的 tᵢ 定义：tᵢ = 「第 5 行被求值的次数」，含最后一次为假的那次。
    //   所以这里把条件显式拆成两步，先计数再判断，而不是写成 while (…)。
    //   （若写成 while (cond)，最后一次失败判断就落在循环外，会少数 n−1 次。）
    for (;;) {
      counts.line5++;
      if (!(bj > 0 && a[bj - 1] > key)) break;
      counts.cmp++;
      yield frame(5, {
        pointers: { i: bi, j: bj, key: bi },
        highlight: { compare: [bj, bi] },
        note: `比较 A[${bj}]=${a[bj - 1]} 与 key=${key}：A[${bj}] > key`,
      });
      // 第 6 行：A[j + 1] = A[j]（0 基：a[bj] = a[bj − 1]）
      a[bj] = a[bj - 1];
      counts.move++;
      yield frame(6, {
        pointers: { i: bi, j: bj, key: bi },
        highlight: { move: [bj + 1] },
        note: `A[${bj + 1}] = A[${bj}]（右移一格）`,
      });
      // 第 7 行：j = j − 1
      bj--;
      yield frame(7, { pointers: { i: bi, j: bj, key: bi }, highlight: { active: [bi] }, note: `j = j − 1 = ${bj}` });
    }
    // 第 8 行：A[j + 1] = key（0 基：a[bj] = key）
    a[bj] = key;
    counts.move++;
    yield frame(8, {
      pointers: { i: bi, key: bj + 1 },
      highlight: { active: [bj + 1], sortedPrefix: bi },
      note: `A[${bj + 1}] = key，${bi >= n ? '整段' : 'A[1..' + bi + ']'} 已排序`,
    });
  }
  yield { line: null, done: true, array: a.slice(), counts: { cmp: counts.cmp, move: counts.move, line5: counts.line5 } };
}
