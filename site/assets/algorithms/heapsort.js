// heapsort.js — 6.4 的 HEAPSORT 教学帧（原书 p.170 的 5 行）。
//
// 书中的伪代码（已按 p170 渲染页核对）：
//   1 BUILD-MAX-HEAP(A, n)
//   2 for i = n downto 2
//   3     exchange A[1] with A[i]
//   4     A.heap-size = A.heap-size − 1
//   5     MAX-HEAPIFY(A, 1)
//
// ★ 行号只用这 5 行。第 5 行内部的下沉动作不另占行号（每个动画面板只挂一张伪代码表），
//   下沉到哪一步写在每帧说明里；需要看 MAX-HEAPIFY 的 10 行细节，去 6.2 那一关。
// ★ 第 1 行建堆同样只产两帧（建堆前 / 建堆后），细节在 6.3 那一关。

export function* heapsort(A) {
  const a = A.slice();
  const n = a.length;
  let heapSize = n;
  const counts = { cmp: 0, move: 0, extract: 0 };

  const frame = (line, extra = {}) => ({
    line,
    array: a.slice(),
    heapSize,
    pointers: extra.pointers || {},
    highlight: extra.highlight || {},
    note: extra.note || '',
    counts: { cmp: counts.cmp, move: counts.move, extract: counts.extract },
    invariantHolds: true,
    done: false,
  });

  if (n === 0) {
    yield {
      line: null, array: [], heapSize: 0, pointers: {}, highlight: {},
      counts: { ...counts }, note: '（空数组）', invariantHolds: true, done: true,
    };
    return;
  }

  /** 在 heapSize 范围内从 root 下沉，faultLine 用来把帧记到调用它的那一行上。 */
  function* sift(root, faultLine) {
    let cur = root;
    for (;;) {
      const l = 2 * cur;
      const r = l + 1;
      let largest = cur;
      if (l <= heapSize) {
        counts.cmp++;
        if (a[l - 1] > a[largest - 1]) largest = l;
      }
      if (r <= heapSize) {
        counts.cmp++;
        if (a[r - 1] > a[largest - 1]) largest = r;
      }
      if (largest === cur) return;
      counts.move++;
      const tmp = a[cur - 1];
      a[cur - 1] = a[largest - 1];
      a[largest - 1] = tmp;
      yield frame(faultLine, {
        pointers: { i: cur },
        highlight: { move: [cur, largest], done: doneSuffix() },
        note: `下沉中：交换 A[${cur}] 与 A[${largest}]（${tmp} 落下去）。`,
      });
      cur = largest;
    }
  }

  /** 已经排好的后缀 A[heapSize+1 : n] —— 这些位置是最终答案，不该再动。 */
  function doneSuffix() {
    return Array.from({ length: n - heapSize }, (_, k) => heapSize + 1 + k);
  }

  // ---- 行 1：建堆（细节在 6.3；这里只给前后两帧）----
  yield frame(1, {
    note: `BUILD-MAX-HEAP(A, ${n})：先把整段数组变成最大堆。`,
  });

  // 就地建堆（与 build-max-heap.js 同一套逻辑，但不产帧）
  for (let i = Math.floor(n / 2); i >= 1; i--) {
    let cur = i;
    for (;;) {
      const l = 2 * cur;
      const r = l + 1;
      let largest = cur;
      if (l <= n && a[l - 1] > a[largest - 1]) largest = l;
      if (r <= n && a[r - 1] > a[largest - 1]) largest = r;
      if (largest === cur) break;
      const tmp = a[cur - 1];
      a[cur - 1] = a[largest - 1];
      a[largest - 1] = tmp;
      cur = largest;
    }
  }

  yield frame(1, {
    highlight: { done: Array.from({ length: n }, (_, k) => k + 1) },
    note: `建堆完成：A[1] = ${a[0]} 是最大值，但它应该待在数组最后 —— 下一步就把它送过去。`,
  });

  // ---- 行 2–5：反复「取走堆顶、缩小堆、修复堆」----
  for (let i = n; i >= 2; i--) {
    yield frame(2, {
      pointers: { i },
      highlight: { active: [1], ...(doneSuffix().length ? { done: doneSuffix() } : {}) },
      note: `i = ${i}：当前堆的范围是 A[1 : ${heapSize}]，堆顶 A[1] = ${a[0]} 是这一轮的（也是剩下的）最大值。`,
    });

    counts.move++;
    const tmp = a[0];
    a[0] = a[i - 1];
    a[i - 1] = tmp;
    yield frame(3, {
      pointers: { i },
      highlight: { move: [1, i] },
      note: `exchange A[1] with A[${i}]：最大值 ${tmp} 放到第 ${i} 位 —— 这就是它的最终位置。`,
    });

    heapSize = heapSize - 1;
    counts.extract++;
    yield frame(4, {
      pointers: { i },
      highlight: { done: doneSuffix() },
      note: `A.heap-size = ${heapSize}：把第 ${i} 位「摘出堆外」（格子变成虚线）。`
        + `已经摘出的是下标 ${heapSize + 1}..${n}，它们是数组里最大的 ${counts.extract} 个元素，位置已定。`,
    });

    yield frame(5, {
      pointers: { i: 1 },
      highlight: { active: [1], done: doneSuffix() },
      note: `MAX-HEAPIFY(A, 1)：新堆顶 A[1] = ${a[0]} 可能比孩子小，要从根往下修。`
        + `注意左右孩子仍然是合法的大顶堆，所以只需沿一条路径下沉。`,
    });

    yield* sift(1, 5);

    yield frame(5, {
      pointers: { i: 1 },
      highlight: { done: doneSuffix() },
      note: `A[1 : ${heapSize}] 重新成为最大堆。`,
    });
  }

  yield {
    line: null,
    array: a.slice(),
    heapSize: 0,
    pointers: {},
    highlight: { done: Array.from({ length: n }, (_, k) => k + 1) },
    counts: { ...counts },
    note: `排序完成：[${a.join(', ')}]。共 ${counts.extract} 次「取堆顶」，`
      + `${counts.cmp} 次比较、${counts.move} 次交换。`,
    invariantHolds: true,
    done: true,
  };
}
