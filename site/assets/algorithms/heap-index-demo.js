// heap-index-demo.js — 6.1 的教学帧：把「下标算术」和「树的形状」对上号。
//
// 6.1 节没有伪代码块（PARENT / LEFT / RIGHT 是写在正文里的三条式子），
// 所以关卡里给的是一份**教学整理**伪代码，行号就是下面这 4 行：
//   1 for i = 1 to n
//   2     PARENT(i) = ⌊i/2⌋
//   3     LEFT(i) = 2i
//   4     RIGHT(i) = 2i + 1
//
// 逐结点走一遍：每个 i 产三帧（父、左孩子、右孩子），让读者看到
// 「树上的父子关系」与「数组里的 /2 与 *2」是同一件事。

export function* heapIndexDemo(A) {
  const a = A.slice();
  const n = a.length;
  const counts = { visited: 0, leaves: 0 };
  const isLeaf = (i) => 2 * i > n;
  for (let i = 1; i <= n; i++) if (isLeaf(i)) counts.leaves++;

  const frame = (line, extra = {}) => ({
    line,
    array: a.slice(),
    heapSize: n,
    pointers: extra.pointers || {},
    highlight: extra.highlight || {},
    note: extra.note || '',
    counts: { ...counts },
    invariantHolds: true,
    done: false,
  });

  yield frame(1, {
    note: `n = ${n}：数组有 ${n} 个元素，树有 ${n} 个结点，其中叶子 ${counts.leaves} 个。`,
  });

  for (let i = 1; i <= n; i++) {
    counts.visited = i;
    const p = Math.floor(i / 2);
    const l = 2 * i;
    const r = 2 * i + 1;

    // 行 2：父结点
    yield frame(2, {
      pointers: { i },
      highlight: p >= 1 ? { active: [i], visited: [p] } : { active: [i] },
      note: p >= 1
        ? `PARENT(${i}) = ⌊${i}/2⌋ = ${p}：结点 ${i} 的父是 ${p}，值 ${a[p - 1]}。`
        : `PARENT(1) = ⌊1/2⌋ = 0：根结点没有父。`,
    });

    // 行 3：左孩子
    if (l <= n) {
      yield frame(3, {
        pointers: { i, l },
        highlight: { active: [i], compare: [l] },
        note: `LEFT(${i}) = 2·${i} = ${l}：值 ${a[l - 1]}。`,
      });
    } else {
      yield frame(3, {
        pointers: { i },
        highlight: { active: [i], violation: [] },
        note: `LEFT(${i}) = ${l} > n = ${n}：结点 ${i} 没有左孩子，它是叶子。`,
      });
    }

    // 行 4：右孩子
    if (r <= n) {
      yield frame(4, {
        pointers: { i, r },
        highlight: { active: [i], compare: [r] },
        note: `RIGHT(${i}) = 2·${i} + 1 = ${r}：值 ${a[r - 1]}。`,
      });
    } else {
      yield frame(4, {
        pointers: { i },
        highlight: { active: [i] },
        note: `RIGHT(${i}) = ${r} > n = ${n}：结点 ${i} 没有右孩子。`,
      });
    }
  }

  yield {
    line: null,
    array: a.slice(),
    heapSize: n,
    pointers: {},
    highlight: { done: Array.from({ length: n }, (_, k) => k + 1) },
    counts: { ...counts },
    note: `走完了：叶子是下标 ⌊n/2⌋ + 1 = ${Math.floor(n / 2) + 1} 到 ${n} 的结点，`
      + `其余 ${Math.floor(n / 2)} 个是内部结点 —— 6.3 建堆时正好从第 ⌊n/2⌋ 个开始往回走。`,
    invariantHolds: true,
    done: true,
  };
}
