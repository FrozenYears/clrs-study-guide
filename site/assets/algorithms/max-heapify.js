// max-heapify.js — 6.2 的 MAX-HEAPIFY 教学帧（原书 p.165 的 10 行，递归版本）。
//
// 书中的伪代码（已按 p165 渲染页逐行核对）：
//   1 l = LEFT(i)
//   2 r = RIGHT(i)
//   3 if l ≤ A.heap-size and A[l] > A[i]
//   4     largest = l
//   5 else largest = i
//   6 if r ≤ A.heap-size and A[r] > A[largest]
//   7     largest = r
//   8 if largest ≠ i
//   9     exchange A[i] with A[largest]
//  10     MAX-HEAPIFY(A, largest)
//
// ★ 第 4 版这里是**递归**写法（第 3 版是 while 循环里 i = largest），别写混。
// ★ 条件里的 `and` 是短路的：l > A.heap-size 时 A[l] 根本不会被求值 —— 这一点在数比较次数时是关键。

export function* maxHeapify(A, i = 1, heapSize = null) {
  const a = A.slice();
  const hs = Number.isInteger(heapSize) ? Math.min(heapSize, a.length) : a.length;
  const counts = { cmp: 0, move: 0 };

  const frame = (line, extra = {}) => ({
    line,
    array: a.slice(),
    heapSize: hs,
    pointers: extra.pointers || {},
    highlight: extra.highlight || {},
    note: extra.note || '',
    counts: { cmp: counts.cmp, move: counts.move },
    invariantHolds: extra.invariantHolds !== undefined ? extra.invariantHolds : true,
    done: false,
  });

  // 一条「已完成的下沉路径」高亮用：把最深已确定的主人标出来
  const doneSet = [];

  function* sift(node, depth) {
    const l = 2 * node;
    const r = 2 * node + 1;
    const hasL = l <= hs;
    const hasR = r <= hs;

    yield frame(1, {
      pointers: { i: node, ...(hasL ? { l } : {}) },
      highlight: { active: [node], ...(doneSet.length ? { done: doneSet.slice() } : {}) },
      note: `MAX-HEAPIFY(A, ${node})：LEFT(${node}) = ${l}${hasL ? `（值 ${a[l - 1]}）` : `，超过 A.heap-size = ${hs}`}。`,
    });
    yield frame(2, {
      pointers: { i: node, ...(hasL ? { l } : {}), ...(hasR ? { r } : {}) },
      highlight: { active: [node] },
      note: `RIGHT(${node}) = ${r}${hasR ? `（值 ${a[r - 1]}）` : `，超过 A.heap-size = ${hs}`}。`,
    });

    // ---- 行 3–5：先在 i 与左孩子之间定 largest ----
    let largest = node;
    if (hasL) {
      counts.cmp++;
      const bigger = a[l - 1] > a[node - 1];
      yield frame(3, {
        pointers: { i: node, l },
        highlight: { compare: [node, l], active: [node] },
        note: `A[${l}] = ${a[l - 1]} 与 A[${node}] = ${a[node - 1]} 比较：`
          + (bigger ? `左孩子更大，largest = ${l}。` : `左孩子不大于当前结点，largest 仍为 ${node}。`),
      });
      if (bigger) {
        largest = l;
        yield frame(4, {
          pointers: { i: node, l, largest },
          highlight: { active: [l], compare: [node] },
          note: `largest = ${l}：目前 A[${l}] 是三者中最大的。`,
        });
      } else {
        yield frame(5, {
          pointers: { i: node, largest: node },
          highlight: { active: [node] },
          note: `largest = ${node}：A[${node}] 不小于左孩子，暂时不动。`,
        });
      }
    } else {
      // 没有左孩子 → 也没有右孩子，它是叶子
      yield frame(3, {
        pointers: { i: node },
        highlight: { active: [node] },
        note: `l = ${l} > A.heap-size = ${hs}：结点 ${node} 是叶子，条件第一项就为假，`
          + `A[${l}] 根本不会被求值。这个结点已经是 1 元素的最大堆。`,
      });
      yield frame(5, {
        pointers: { i: node },
        highlight: { active: [node] },
        note: `largest = ${node}：叶子结点无需下沉。`,
      });
      return;
    }

    // ---- 行 6–7：再和右孩子比 ----
    if (hasR) {
      counts.cmp++;
      const bigger = a[r - 1] > a[largest - 1];
      yield frame(6, {
        pointers: { i: node, r, largest },
        highlight: { compare: [largest, r], active: [node] },
        note: `A[${r}] = ${a[r - 1]} 与 A[${largest}] = ${a[largest - 1]} 比较：`
          + (bigger ? `右孩子更大，largest = ${r}。` : `右孩子不更大，largest 保持 ${largest}。`),
      });
      if (bigger) {
        largest = r;
        yield frame(7, {
          pointers: { i: node, r, largest },
          highlight: { active: [r] },
          note: `largest = ${r}：A[${r}] = ${a[r - 1]} 是 i、LEFT(i)、RIGHT(i) 三者中最大的。`,
        });
      }
    } else {
      yield frame(6, {
        pointers: { i: node, largest },
        highlight: { active: [node] },
        note: `r = ${r} > A.heap-size = ${hs}：没有右孩子，largest 保持 ${largest}。`,
      });
    }

    // ---- 行 8–10 ----
    if (largest === node) {
      yield frame(8, {
        pointers: { i: node },
        highlight: { active: [node] },
        note: `largest = i = ${node}：以 ${node} 为根的子树已经满足最大堆性质，本次调用结束。`,
      });
      doneSet.push(node);
      return;
    }

    yield frame(8, {
      pointers: { i: node, largest },
      highlight: { active: [node], compare: [largest] },
      note: `largest = ${largest} ≠ i = ${node}：以 ${node} 为根的子树违反了最大堆性质，必须交换。`,
    });

    counts.move++;
    const tmp = a[node - 1];
    a[node - 1] = a[largest - 1];
    a[largest - 1] = tmp;
    yield frame(9, {
      pointers: { i: node, largest },
      highlight: { move: [node, largest] },
      note: `exchange A[${node}] with A[${largest}]：`
        + `${tmp} 下沉到 ${largest}，${a[node - 1]} 升到 ${node}。`,
    });

    doneSet.push(node);
    yield frame(10, {
      pointers: { i: largest },
      highlight: { active: [largest], done: doneSet.slice() },
      note: `递归调用 MAX-HEAPIFY(A, ${largest})：被换下去的元素可能在新位置继续违反最大堆性质`
        + `（这是递归版本与 while 版本等价的原因）。`,
    });
    yield* sift(largest, depth + 1);
  }

  if (a.length === 0) {
    yield {
      line: null, array: [], heapSize: 0, pointers: {}, highlight: {},
      counts: { ...counts }, note: '（空堆）', invariantHolds: true, done: true,
    };
    return;
  }

  yield* sift(i, 0);

  yield {
    line: null,
    array: a.slice(),
    heapSize: hs,
    pointers: {},
    highlight: { done: doneSet.slice() },
    counts: { ...counts },
    note: `调用结束：以 ${i} 为根的子树现在满足最大堆性质。`
      + `本次共比较 ${counts.cmp} 次、交换 ${counts.move} 次。`,
    invariantHolds: true,
    done: true,
  };
}
