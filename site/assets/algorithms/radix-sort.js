// radix-sort.js — 8.3 的 RADIX-SORT 教学帧（原书 p.213，Figure 8.3 数据已按渲染页核实）。
//
// 十进制位版：对每个数按"个位 → 十位 → 百位 …"逐位做一次**稳定**计数排序（基 10，k = 9）。
// 放置过程中帧显示输出数组的当前状态；phase 标注当前趟（"第 1 趟·个位" 等）。

export function* radixSort(A) {
  const n = A.length;
  const maxVal = Math.max(...A, 0);
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

  const digitName = (exp) => (exp === 1 ? '个位' : exp === 10 ? '十位' : exp === 100 ? '百位' : `10^${exp} 位`);
  const passNo = (exp) => (exp === 1 ? 1 : exp === 10 ? 2 : exp === 100 ? 3 : 0);

  yield frame(1, A, `输入 ${n} 个不超过 ${maxVal} 的整数。RADIX-SORT：按位从低到高，每趟稳定排序。`);

  for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
    const phase = `第 ${passNo(exp)} 趟·${digitName(exp)}`;
    const digit = (v) => Math.floor(v / exp) % 10;

    // ---- 稳定计数排序（按当前位）----
    const C = new Array(10).fill(0);
    for (let j = 0; j < n; j++) { C[digit(A[j])]++; counts.move++; }
    for (let i = 1; i < 10; i++) { C[i] += C[i - 1]; }

    const out = new Array(n).fill(null);
    const filled = new Array(n).fill(false);
    for (let j = n - 1; j >= 0; j--) {
      out[C[digit(A[j])] - 1] = A[j];
      filled[C[digit(A[j])] - 1] = true;
      C[digit(A[j])]--;
      counts.cmp++; // 查表落位（不涉及元素间比较）
      counts.move++;
      yield frame(2, out.slice(),
        `按${digitName(exp)}稳定排序中 —— A[${j + 1}] = ${A[j]}（${digitName(exp)} = ${digit(A[j])}）落位。` +
        `★ 反向扫描 = 稳定：相同位值的相对次序不变。`,
        { phase, highlight: { active: [j + 1] } });
    }

    // 写回 A，进入下一趟
    for (let j = 0; j < n; j++) { A[j] = out[j]; }
    yield frame(2, A,
      `第 ${passNo(exp)} 趟完成：按${digitName(exp)}稳定排序后的数组。` +
      `★ 此时通常**还不是**全序 —— 低位趟的成果要靠后续趟的稳定性保住。`, { phase });
  }

  yield {
    line: 2,
    array: A.slice(),
    pointers: {},
    highlight: { done: A.map((_, i) => i + 1) },
    counts: { ...counts },
    note: `排序完成：[${A.join(', ')}]。★ d 趟低位优先的**稳定**排序 = 一次完整排序（归纳 + 稳定性）。`,
    invariantHolds: true,
    done: true,
  };
}
