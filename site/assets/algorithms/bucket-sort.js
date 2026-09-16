// bucket-sort.js — 8.4 的 BUCKET-SORT 教学帧（原书 p.216，Figure 8.4 数据已按渲染页核实）。
//
// 值域 [0,1) 的桶排序：n 个等宽桶，桶号 = ⌊n·A[i]⌋。
// 帧分三个阶段：输入 → 逐个分配（note 报桶号）→ 连接后的最终输出。

export function* bucketSort(A) {
  const n = A.length;
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

  yield frame(1, A, `输入 ${n} 个 [0,1) 上的数。BUCKET-SORT：${n} 个等宽桶，桶号 = ⌊${n}·A[i]⌋。`, { phase: '输入' });

  // ---- 分配（第 4–5 行）----
  const buckets = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    const bi = Math.floor(n * A[i]);
    buckets[bi].push(A[i]);
    counts.move++;
    yield frame(5, A,
      `第 5 行：A[${i + 1}] = ${A[i]} → 桶 ${bi}（⌊${n} × ${A[i]}⌋）。★ 每次分配 O(1)。`,
      { phase: '分配', highlight: { active: [i + 1] } });
  }

  // ---- 桶内插入排序（第 6–7 行）----
  for (let b = 0; b < n; b++) {
    if (buckets[b].length > 1) {
      const arr = buckets[b];
      for (let i = 1; i < arr.length; i++) {
        const k = arr[i]; let j = i - 1;
        while (j >= 0 && arr[j] > k) { arr[j + 1] = arr[j]; j--; counts.cmp++; }
        counts.cmp++;
        arr[j + 1] = k;
      }
    }
  }
  yield frame(7, A,
    `第 6–7 行：桶内插入排序完成。各桶元素数 = [${buckets.map((b) => b.length).join(', ')}]。` +
    `★ Σ n_i² = ${buckets.reduce((s, b) => s + b.length * b.length, 0)} —— 均匀分布下这个和是 O(n)。`,
    { phase: '桶内排序' });

  // ---- 连接（第 8 行）----
  const out = [];
  for (let b = 0; b < n; b++) { out.push(...buckets[b]); counts.move += buckets[b].length; }

  yield {
    line: 8,
    array: out.slice(),
    pointers: {},
    highlight: { done: out.map((_, i) => i + 1) },
    counts: { ...counts },
    note: `连接后输出：[${out.join(', ')}]。★ 均匀分布下期望 O(n)；最坏（全进一个桶）Θ(n²)。`,
    invariantHolds: true,
    done: true,
    phase: '完成',
  };
}
