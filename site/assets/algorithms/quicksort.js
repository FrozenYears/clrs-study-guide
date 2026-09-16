// quicksort.js — 7.1 的 QUICKSORT 教学帧（原书 p.183 的 5 行，已按渲染页核对）。
//
//   1  if p < r
//   2      // Partition the subarray around the pivot, which ends up in A[q].
//   3      q = PARTITION(A, p, r)
//   4      QUICKSORT(A, p, q − 1)    // recursively sort the low side
//   5      QUICKSORT(A, q + 1, r)    // recursively sort the high side
//
// ★ 行号只用这 5 行。第 3 行内部 PARTITION 的 8 行**不在这里展开** ——
//   需要看那 8 行就换一块面板（`pseudocodeRef: 'PARTITION'` + partition 生成器）。
//   原因见 6.3 的同类说明：一块面板只能挂一张伪代码表，混用行号会点亮错误的行。
//
// 整段数组的视图里怎么区分「当前在排哪一段」：
//   当前子数组 A[p : r] → frontier（标签覆写为「当前子数组」）
//   已就位的枢轴 A[q]    → pivot（标签「枢轴」）
//   其余                → idle
// 子数组之外的元素此刻还没轮到，用 idle 表示「不参与本轮」，比涂成灰色更准确。

export function* quicksort(A, p = 1, r = null) {
  const a = A.slice();
  const n = a.length;
  const counts = { cmp: 0, swap: 0, calls: 0 };

  const frame = (line, extra = {}) => ({
    line,
    array: a.slice(),
    pointers: extra.pointers || {},
    highlight: extra.highlight || {},
    note: extra.note || '',
    counts: { ...counts },
    invariantHolds: true,
    done: false,
  });

  /** 在子数组 A[p : r] 上就地把轴归位，返回 q（1 基）。与 partition.js 同一套逻辑。 */
  function partitionInPlace(lo, hi) {
    const x = a[hi - 1];
    let i = lo - 1;
    for (let j = lo; j <= hi - 1; j++) {
      counts.cmp++;
      if (a[j - 1] <= x) {
        i++;
        const t = a[i - 1];
        a[i - 1] = a[j - 1];
        a[j - 1] = t;
        counts.swap++;
      }
    }
    counts.swap++;
    const t = a[i];
    a[i] = a[hi - 1];
    a[hi - 1] = t;
    return i + 1;
  }

  function* sort(lo, hi, depth) {
    counts.calls++;
    if (lo >= hi) {
      yield frame(1, {
        pointers: {},
        highlight: { frontier: [lo] },
        note: `QUICKSORT(A, ${lo}, ${hi})：p ≥ r，子数组不足两个元素 —— **直接返回**（递归的出口）。`,
      });
      return;
    }

    yield frame(1, {
      highlight: { frontier: rangeOf(lo, hi) },
      note: `QUICKSORT(A, ${lo}, ${hi})：p < r，要排序这一段（长度为 ${hi - lo + 1}）。`,
    });

    const q = partitionInPlace(lo, hi);
    yield frame(3, {
      pointers: { q },
      highlight: { frontier: rangeOf(lo, hi), pivot: [q] },
      note: `q = PARTITION(A, ${lo}, ${hi}) = ${q}：轴落在 ${q}。` +
        `左段 A[${lo} : ${q - 1}] 全部 ≤ A[${q}]，右段 A[${q + 1} : ${hi}] 全部 > A[${q}] —— ` +
        `**A[${q}] 已经在最终位置上了**，后面不需要再动它。`,
    });

    yield frame(4, {
      pointers: { q },
      highlight: { frontier: rangeOf(lo, q - 1), pivot: [q] },
      note: q - 1 >= lo
        ? `递归排左段 A[${lo} : ${q - 1}]（长度 ${q - lo}）。`
        : `左段 A[${lo} : ${q - 1}] 是空的（q = ${lo}，说明轴就是这一段里最小的）—— 递归调用立刻返回。`,
    });
    yield* sort(lo, q - 1, depth + 1);

    yield frame(5, {
      pointers: { q },
      highlight: { frontier: rangeOf(q + 1, hi), pivot: [q] },
      note: q + 1 <= hi
        ? `递归排右段 A[${q + 1} : ${hi}]（长度 ${hi - q}）。`
        : `右段 A[${q + 1} : ${hi}] 是空的（q = ${hi}）—— 递归调用立刻返回。`,
    });
    yield* sort(q + 1, hi, depth + 1);
  }

  function rangeOf(lo, hi) {
    const out = [];
    for (let k = lo; k <= hi; k++) out.push(k);
    return out;
  }

  if (n === 0) {
    yield {
      line: null, array: [], pointers: {}, highlight: {},
      counts: { ...counts }, note: '（空数组）', invariantHolds: true, done: true,
    };
    return;
  }

  const lo = Math.max(1, Math.min(p, n));
  const hi = r == null ? n : Math.max(lo, Math.min(r, n));
  yield* sort(lo, hi, 0);

  let sortedRun = true;
  for (let k = 1; k < n; k++) { if (a[k - 1] > a[k]) { sortedRun = false; } }
  yield {
    line: null,
    array: a.slice(),
    pointers: {},
    highlight: { result: rangeOf(1, n) },
    counts: { ...counts },
    note: `排序完成：[${a.join(', ')}]。共 ${counts.calls} 次 QUICKSORT 调用、` +
      `${counts.cmp} 次比较、${counts.swap} 次交换。` +
      `★ 注意整棵树里**没有任何一步是"合并"** —— 这就是 Divide 之后 "Combine by doing nothing" 的含义。`,
    invariantHolds: sortedRun,
    done: true,
  };
}
