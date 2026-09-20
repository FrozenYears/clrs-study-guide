// heap-extract-max.js — 6.5 的 MAX-HEAP-EXTRACT-MAX 教学帧（原书 p.175 的 5 行）。
//
// 书中的伪代码（已按 p175 渲染页核对）：
//   1 max = MAX-HEAP-MAXIMUM(A)
//   2 A[1] = A[A.heap-size]
//   3 A.heap-size = A.heap-size − 1
//   4 MAX-HEAPIFY(A, 1)
//   5 return max
//
// 输入必须是一个最大堆。行号只用这 5 行，第 4 行内部的下沉动作写在每帧说明里。
// ★ MAX-HEAP-MAXIMUM 本身在 Θ(1)：根就是最大值；但「取走根」会破坏堆性质，所以要第 4 行修。
//
// 用法：heapExtractMax(A, heapSize)
//   A         —— 整个数组（堆外可能还留着以前被摘出去的元素）
//   heapSize  —— A.heap-size，默认 = A.length。习题 6.5-1 的写法
//                ⟨15,13,9,5,12,8,7,4,0; 6,2,1⟩ 就是「数组 12 格、堆区只有前 9 格」，
//                不传这个参数就只能把 12 格全当堆区，跑出来的是另一种情形。

export function* heapExtractMax(A, heapSizeIn = null) {
  const a = A.slice();
  const n = a.length;
  let heapSize = Number.isInteger(heapSizeIn) ? Math.max(0, Math.min(heapSizeIn, n)) : n;
  const counts = { cmp: 0, move: 0, extract: 0 };

  const frame = (line, extra = {}) => ({
    line,
    array: a.slice(),
    heapSize,
    pointers: extra.pointers || {},
    highlight: extra.highlight || {},
    note: extra.note || '',
    counts: { ...counts },
    invariantHolds: true,
    done: false,
  });

  if (heapSize < 1) {
    yield {
      line: 1, array: a.slice(), heapSize, pointers: {}, highlight: { violation: [] },
      counts: { ...counts },
      note: `A.heap-size = ${heapSize} < 1：MAX-HEAP-MAXIMUM 会报错 "heap underflow"`
        + `（堆区里没有元素可取，哪怕数组后面还躺着摘出去的老元素）。`,
      invariantHolds: false, done: true,
    };
    return;
  }

  yield frame(1, {
    pointers: { i: 1 },
    highlight: { active: [1] },
    note: `MAX-HEAP-MAXIMUM(A)：最大堆的根 A[1] = ${a[0]} 就是集合里的最大键，Θ(1) 取到。`
      + (heapSize < n ? `（数组共 ${n} 格，但 A.heap-size = ${heapSize}：只有前 ${heapSize} 格是堆，`
        + `后面的 ${n - heapSize} 格是早已摘出堆的老元素，本操作完全不看它们。）` : ''),
  });

  const maxVal = a[0];
  counts.move++;
  // ★ 书上是 `A[1] = A[A.heap-size]`（用最后一个元素覆盖根），被取走的根就此从数组里消失。
  //   为了让读者**看得见**被取走的那个最大值，动画改成「交换 A[1] 与 A[A.heap-size]」：
  //   对堆的内容 A[1 : heap-size] 来说两种做法完全等价（原来在 A[heap-size] 的元素同样
  //   被搬到根上，原来在 A[1] 的元素同样不再出现在堆里），差别只在于交换之后
  //   被摘出堆外的那一格保存的是最大值而不是一个重复元素。
  const last = a[heapSize - 1];
  a[heapSize - 1] = maxVal;
  a[0] = last;
  yield frame(2, {
    pointers: { i: 1 },
    highlight: { move: [1, heapSize] },
    note: `A[1] = A[A.heap-size]：把最后一个元素 ${last} 搬到根上，最大值 ${maxVal} 被换到第 ${heapSize} 位`
      + `（书上是直接覆盖，这里改成交换，好让你看见被取走的到底是谁；对堆的内容两种做法等价）。`,
  });

  heapSize = heapSize - 1;
  counts.extract++;
  yield frame(3, {
    highlight: { done: Array.from({ length: n - heapSize }, (_, k) => heapSize + 1 + k) },
    note: `A.heap-size = ${heapSize}：第 ${heapSize + 1} 位被摘出堆外（虚线格子），它保存着刚取走的最大值 ${maxVal}。`
      + `这一步只是把计数器减 1，**没有搬运任何数据** —— 摘出去的元素立刻变成「数组里的普通元素」，`
      + `不再受堆性质约束。`,
  });

  yield frame(4, {
    pointers: { i: 1 },
    highlight: { active: [1], done: Array.from({ length: n - heapSize }, (_, k) => heapSize + 1 + k) },
    note: `MAX-HEAPIFY(A, 1)：根上的 ${last} 多半比孩子小 —— 但左右孩子各自仍是最大堆，`
      + `所以沿一条路径下沉即可。`,
  });

  // 下沉（帧记在第 4 行上）
  let cur = 1;
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
    if (largest === cur) break;
    counts.move++;
    const tmp = a[cur - 1];
    a[cur - 1] = a[largest - 1];
    a[largest - 1] = tmp;
    yield frame(4, {
      pointers: { i: cur },
      highlight: { move: [cur, largest], done: Array.from({ length: n - heapSize }, (_, k) => heapSize + 1 + k) },
      note: `下沉中：交换 A[${cur}] 与 A[${largest}]。`,
    });
    cur = largest;
  }

  yield frame(4, {
    highlight: { done: Array.from({ length: n - heapSize }, (_, k) => heapSize + 1 + k) },
    note: `修好了：A[1 : ${heapSize}] 重新是最大堆，新的最大键是堆顶 A[1] = ${a[0]}。`,
  });

  yield {
    line: 5,
    array: a.slice(),
    heapSize,
    pointers: {},
    highlight: { result: [heapSize + 1] },
    counts: { ...counts },
    note: `return max = ${maxVal}。总共 ${counts.cmp} 次比较、${counts.move} 次写，`
      + `加上 MAX-HEAPIFY 的 O(lg n) —— 整个操作是 O(lg n)。`,
    invariantHolds: true,
    done: true,
  };
}
