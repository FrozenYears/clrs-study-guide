// heap-increase-key.js — 6.5 的 MAX-HEAP-INCREASE-KEY 教学帧（原书 p.176 的 7 行）。
//
// 书中的伪代码（已按 p176 渲染页核对）：
//   1 if k < x.key
//   2     error "new key is smaller than current key"
//   3 x.key = k
//   4 find the index i in array A where object x occurs
//   5 while i > 1 and A[PARENT(i)].key < A[i].key
//   6     exchange A[i] with A[PARENT(i)], updating the information that maps
//         priority queue objects to array indices
//   7     i = PARENT(i)
//
// ★ 与 MAX-HEAPIFY 的方向相反：MAX-HEAPIFY 让元素**往下**沉以修复「比孩子小」，
//   INCREASE-KEY 让元素**往上**浮以修复「比父大」—— 正好对应 6.1 说的
//   「键变大只会违反与父的关系，键变小只会违反与孩子的关系」。
// ★ 本书只用 key（不存卫星数据），所以第 4 行（在数组里找出对象 x 的下标）与第 6 行末尾的
//   「映射维护」在伪代码里保留、在我们的动画里被跳过 —— 关卡里要明确说明这一点。

export function* heapIncreaseKey(A, i = 1, k = null) {
  const a = A.slice();
  const n = a.length;
  let heapSize = n;
  const counts = { cmp: 0, move: 0 };
  let idx = Math.min(Math.max(1, i), Math.max(1, n));
  const target = k == null ? a[idx - 1] + 1 : k;

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

  if (n === 0) {
    yield {
      line: 1, array: [], heapSize: 0, pointers: {}, highlight: {},
      counts: { ...counts }, note: '（空堆）', invariantHolds: false, done: true,
    };
    return;
  }

  const old = a[idx - 1];
  yield frame(1, {
    pointers: { i: idx },
    highlight: { active: [idx] },
    note: `if k < x.key：新的键 ${target} 与 A[${idx}] 原来的键 ${old} 比较。`,
  });

  if (target < old) {
    yield frame(2, {
      pointers: { i: idx },
      highlight: { violation: [idx] },
      note: `k = ${target} < x.key = ${old}：报错 "new key is smaller than current key"。`
        + `要把键变小，得用 MAX-HEAPIFY（往下沉），不是这个过程。`,
      invariantHolds: false,
    });
    yield {
      line: 2, array: a.slice(), heapSize, pointers: { i: idx }, highlight: { violation: [idx] },
      counts: { ...counts }, note: `过程在第 2 行报错退出，堆没有被改动。`,
      invariantHolds: false, done: true,
    };
    return;
  }

  a[idx - 1] = target;
  counts.move++;
  yield frame(3, {
    pointers: { i: idx },
    highlight: { move: [idx] },
    note: `x.key = k：把 A[${idx}] 的键从 ${old} 直接改成 ${target}。`
      + `此时 A[${idx}] 可能比它的父大 —— 这正是下面要修的唯一一种违规。`,
  });

  yield frame(4, {
    pointers: { i: idx },
    highlight: { active: [idx] },
    note: `第 4 行「在数组 A 中找出对象 x 所在的下标 i」：本书只用 key，动画里直接给定 i = ${idx}。`,
  });

  let cur = idx;
  for (;;) {
    if (cur <= 1) {
      yield frame(5, {
        pointers: { i: cur },
        highlight: { active: [cur] },
        note: `i = ${cur}，i > 1 为假：已经到根了，循环结束。`,
      });
      break;
    }
    const parent = Math.floor(cur / 2);
    counts.cmp++;
    const parentKey = a[parent - 1];
    const needUp = parentKey < a[cur - 1];
    yield frame(5, {
      pointers: { i: cur, parent },
      highlight: { compare: [cur, parent] },
      note: `A[PARENT(${cur})].key = A[${parent}] = ${parentKey} 与 A[${cur}] = ${a[cur - 1]} 比较：`
        + (needUp ? `父更小，违反最大堆性质，要交换。` : `父不小于它，循环结束。`),
    });
    if (!needUp) break;

    counts.move++;
    const tmp = a[cur - 1];
    a[cur - 1] = a[parent - 1];
    a[parent - 1] = tmp;
    yield frame(6, {
      pointers: { i: parent },
      highlight: { move: [cur, parent] },
      note: `exchange A[${cur}] with A[${parent}]：${tmp} 浮上去，${a[cur - 1]} 沉下来。`
        + `（伪代码里后半句「更新对象到下标映射」在本书只用 key 的设定下无需执行。）`,
    });

    const childPos = cur;
    cur = parent;
    yield frame(7, {
      pointers: { i: cur },
      highlight: { active: [cur] },
      note: `i = PARENT(${childPos}) = ${cur}：继续往上看。`,
    });
  }

  yield {
    line: null,
    array: a.slice(),
    heapSize,
    pointers: {},
    highlight: { result: [cur] },
    counts: { ...counts },
    note: `过程结束：键 ${target} 被安置在下标 ${cur}。`
      + `从叶子到根最多走 O(lg n) 步，所以整个过程 O(lg n)，共比较 ${counts.cmp} 次、写 ${counts.move} 次。`,
    invariantHolds: true,
    done: true,
  };
}
