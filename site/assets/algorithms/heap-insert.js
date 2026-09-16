// heap-insert.js — 6.5 的 MAX-HEAP-INSERT 教学帧（原书 p.176 的 8 行）。
//
// 书中的伪代码（已按 p176 渲染页核对）：
//   1 if A.heap-size == n
//   2     error "heap overflow"
//   3 A.heap-size = A.heap-size + 1
//   4 k = x.key
//   5 x.key = −∞
//   6 A[A.heap-size] = x
//   7 map x to index heap-size in the array
//   8 MAX-HEAP-INCREASE-KEY(A, x, k)
//
// 用法：heapInsert(A, key, capacity)
//   A        —— 当前的堆（帧里的 array 会随插入长一位）
//   key      —— 要插入的键
//   capacity —— 数组容量 n（第 1 行用来判溢出），默认 = A.length + 1
//
// ★ 为什么要先把新元素的键设成 −∞（第 5 行）再调 INCREASE-KEY（第 8 行）？
//   因为 INCREASE-KEY 第 1 行要求「新键不小于旧键」。设成 −∞ 就恒满足这个前提，
//   于是插入可以直接复用「变大后往上浮」的那段逻辑，不必另写一份。
//   （−∞ 在动画里用 −1 显示，因为本书的 key 取非负整数。）
// ★ 第 7 行的「把 x 映射到下标 heap-size」在本书只用 key 的设定下被跳过。

const NEG_INF_DISPLAY = -1;

export function* heapInsert(A, key = 0, capacity = null) {
  const a = A.slice();
  const n = Number.isInteger(capacity) ? capacity : a.length + 1;
  let heapSize = a.length;
  const counts = { cmp: 0, move: 0 };

  const frame = (line, extra = {}) => ({
    line,
    array: a.slice(),
    heapSize,
    pointers: extra.pointers || {},
    highlight: extra.highlight || {},
    note: extra.note || '',
    counts: { ...counts },
    invariantHolds: extra.invariantHolds !== undefined ? extra.invariantHolds : true,
    done: false,
  });

  yield frame(1, {
    note: `if A.heap-size == n：当前堆有 ${heapSize} 个元素，数组容量 n = ${n}。`,
  });

  if (heapSize >= n) {
    yield frame(2, {
      highlight: { violation: [] },
      note: `A.heap-size = ${heapSize} 已经等于容量 n = ${n}：报错 "heap overflow"。`
        + `堆是「用数组装的近似完全二叉树」，数组满了就没有位置再放新结点。`,
      invariantHolds: false,
    });
    yield {
      line: 2, array: a.slice(), heapSize, pointers: {}, highlight: {},
      counts: { ...counts }, note: '过程在第 2 行报错退出。', invariantHolds: false, done: true,
    };
    return;
  }

  heapSize = heapSize + 1;
  yield frame(3, {
    highlight: { active: [heapSize] },
    note: `A.heap-size = ${heapSize}：先把计数器加 1 —— 堆的范围向右扩一格（对应树上多出一个叶子）。`,
  });

  yield frame(4, {
    highlight: { active: [heapSize] },
    note: `k = x.key：先把要插入的键 ${key} 存起来 —— 因为第 5 行会把它临时抹掉。`,
  });

  a.push(NEG_INF_DISPLAY);
  yield frame(5, {
    pointers: { i: heapSize },
    highlight: { move: [heapSize] },
    note: `x.key = −∞：新元素的键先设成负无穷（动画里显示为 ${NEG_INF_DISPLAY}）。`
      + `这样第 8 行调用 INCREASE-KEY 时「新键 ≥ 旧键」的前提必然成立。`,
  });

  yield frame(6, {
    pointers: { i: heapSize },
    highlight: { active: [heapSize] },
    note: `A[A.heap-size] = x：把新对象放到数组最后一位（下标 ${heapSize}）。`
      + `此刻它不是合法的堆元素 —— 它比父小得多，但别忘了最大堆只要求「父 ≥ 子」，`
      + `所以真正的问题不在它身上，而在第 8 行要把它抬到正确位置。`,
  });

  yield frame(7, {
    pointers: { i: heapSize },
    highlight: { active: [heapSize] },
    note: `map x to index ${heapSize}：记下「对象 x 在数组的第 ${heapSize} 位」。`
      + `本书只用 key，不需要维护映射，这一步跳过了。`,
  });

  yield frame(8, {
    pointers: { i: heapSize },
    highlight: { active: [heapSize] },
    note: `MAX-HEAP-INCREASE-KEY(A, x, ${key})：把新元素的键从 −∞ 一路抬到 ${key}，`
      + `它会在上升的路上与父逐个交换，直到不再比父大为止。`,
  });

  // 上浮（帧记在第 8 行上）
  let cur = heapSize;
  for (;;) {
    if (cur <= 1) break;
    const parent = Math.floor(cur / 2);
    counts.cmp++;
    if (!(a[parent - 1] < key)) break;
    counts.move++;
    a[cur - 1] = a[parent - 1];
    yield frame(8, {
      pointers: { i: parent },
      highlight: { move: [cur, parent] },
      note: `上浮中：A[${parent}] = ${a[parent - 1]} 比 ${key} 小，让它下移到 ${cur}。`,
    });
    cur = parent;
  }
  a[cur - 1] = key;
  counts.move++;

  yield {
    line: 8,
    array: a.slice(),
    heapSize,
    pointers: { i: cur },
    highlight: { result: [cur] },
    counts: { ...counts },
    note: `插入完成：${key} 落在下标 ${cur}。整个 MAX-HEAP-INSERT 是 O(lg n)`
      + `（浮动的路径长度不超过树高），共比较 ${counts.cmp} 次、写 ${counts.move} 次。`,
    invariantHolds: true,
    done: true,
  };
}
