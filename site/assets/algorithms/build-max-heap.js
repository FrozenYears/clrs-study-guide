// build-max-heap.js — 6.3 的 BUILD-MAX-HEAP 教学帧（原书 p.167 的 3 行）。
//
// 书中的伪代码（已按 p167 渲染页核对）：
//   1 A.heap-size = n
//   2 for i = ⌊n/2⌋ downto 1
//   3     MAX-HEAPIFY(A, i)
//
// ★ 行号只用这 3 行。第 3 行内部会下沉好几层，那些动作**不另占行号** ——
//   本关的动画面板按「正在执行第 3 行」高亮，具体下沉到哪一步写在每帧说明里。
//   （每个面板只能挂一张伪代码表：实测 stages.js 的 pseudocodeRef 是按面板取的，
//   若在这里混用 MAX-HEAPIFY 的行号，会把 BUILD-MAX-HEAP 第 2/3 行点错。）
//
// ★ 为什么要从 ⌊n/2⌋ 往回走：叶子（下标 > ⌊n/2⌋）本来就是 1 元素的最大堆，
//   无需处理；从最后一个内部结点倒着走，能保证调用时它的两棵子树已经是最大堆。

export function* buildMaxHeap(A) {
  const a = A.slice();
  const n = a.length;
  const counts = { cmp: 0, move: 0, calls: 0 };

  const frame = (line, extra = {}) => ({
    line,
    array: a.slice(),
    heapSize: n,
    pointers: extra.pointers || {},
    highlight: extra.highlight || {},
    note: extra.note || '',
    counts: { cmp: counts.cmp, move: counts.move, calls: counts.calls },
    invariantHolds: extra.invariantHolds !== undefined ? extra.invariantHolds : true,
    done: false,
  });

  if (n === 0) {
    yield {
      line: null, array: [], heapSize: 0, pointers: {}, highlight: {},
      counts: { ...counts }, note: '（空数组）', invariantHolds: true, done: true,
    };
    return;
  }

  yield frame(1, {
    note: `A.heap-size = n = ${n}：先把整段数组都算进堆里（所以这一帧还没有「堆外」的格子）。`,
  });

  const start = Math.floor(n / 2);
  yield frame(2, {
    highlight: {
      active: [],
      done: Array.from({ length: n - start }, (_, k) => start + 1 + k),
    },
    note: `从 i = ⌊n/2⌋ = ${start} 倒着走到 1。下标 ${start + 1}..${n} 已经是叶子，`
      + `每个叶子自己就是合法的 1 元素最大堆（高亮的格子）—— 这是循环不变量的初始状态。`,
  });

  /** 对 node 做一次下沉（MAX-HEAPIFY 的内部逻辑），所有帧都算在 BUILD-MAX-HEAP 第 3 行上。 */
  function* sift(node) {
    let cur = node;
    const path = [];
    for (;;) {
      const l = 2 * cur;
      const r = l + 1;
      let largest = cur;
      if (l <= n) {
        counts.cmp++;
        if (a[l - 1] > a[largest - 1]) largest = l;
      }
      if (r <= n) {
        counts.cmp++;
        if (a[r - 1] > a[largest - 1]) largest = r;
      }
      if (largest === cur) {
        path.push(cur);
        return path;
      }
      counts.move++;
      const tmp = a[cur - 1];
      a[cur - 1] = a[largest - 1];
      a[largest - 1] = tmp;
      yield frame(3, {
        pointers: { i: node },
        highlight: { move: [cur, largest] },
        note: `MAX-HEAPIFY(A, ${node}) 正在下沉：交换 A[${cur}] 与 A[${largest}]`
          + `（${tmp} 下去了，${a[cur - 1]} 上来）。`,
      });
      cur = largest;
    }
  }

  for (let i = start; i >= 1; i--) {
    counts.calls++;
    yield frame(2, {
      pointers: { i },
      highlight: {
        active: [i],
        done: Array.from({ length: n - i }, (_, k) => i + 1 + k),
      },
      note: `i = ${i}：准备对结点 ${i} 调用 MAX-HEAPIFY。`
        + `此时下标 ${i + 1}..${n} 每个结点都已经是某棵最大堆的根（高亮部分）。`,
    });

    const path = yield* sift(i);

    yield frame(3, {
      pointers: { i },
      highlight: {
        done: Array.from({ length: n - i + 1 }, (_, k) => i + k),
      },
      note: `MAX-HEAPIFY(A, ${i}) 返回：以 ${i} 为根的子树成了最大堆`
        + (path.length > 1 ? `（走了 ${path.length - 1} 层下沉：${path.join(' → ')}）。` : '（本来就没违反性质）。'),
    });
  }

  yield {
    line: null,
    array: a.slice(),
    heapSize: n,
    pointers: {},
    highlight: { done: Array.from({ length: n }, (_, k) => k + 1) },
    counts: { ...counts },
    note: `建堆完成：整个数组现在是一个最大堆，根 A[1] = ${a[0]} 是全体最大值。`
      + `共 ${counts.calls} 次 MAX-HEAPIFY、${counts.cmp} 次比较、${counts.move} 次交换。`,
    invariantHolds: true,
    done: true,
  };
}
