// partition.js — 7.1 的 PARTITION 教学帧（原书 p.184 的 8 行，已按渲染页核对）。
//
//   1  x = A[r]                     // the pivot
//   2  i = p − 1                    // highest index into the low side
//   3  for j = p to r − 1           // process each element other than the pivot
//   4      if A[j] ≤ x              // does this element belong on the low side?
//   5          i = i + 1            // index of a new slot in the low side
//   6          exchange A[i] with A[j]   // put this element there
//   7  exchange A[i + 1] with A[r]  // pivot goes just to the right of the low side
//   8  return i + 1                 // new index of the pivot
//
// ★ 四个区（原书 Figure 7.2）：A[p : i] 是低侧（≤ x）、A[i+1 : j−1] 是高侧（> x）、
//   A[j : r−1] 还没看过、A[r] = x 是轴。本站的颜色映射不照抄书上的 tan/蓝/白/黄
//   （设计规范要求状态不能只靠颜色区分），而是用设计令牌 + **文字标签**：
//     低侧 → result（青）标签「≤ x」      高侧 → done（蓝）标签「> x」
//     轴   → pivot（蓝）标签「轴」        当前位置 → compare（琥珀）标签「当前」
//   标签由关卡用 stage.stateLabels 覆写（引擎默认标签是通用语义，这里不适用）。
//
// 用法：partition(A, p, r)   —— p、r 是**1 基**下标（与书一致），默认整段数组。

/** 闭区间 [from, to] 的下标列表（1 基）；from > to 时为空 */
function span(from, to) {
  const out = [];
  for (let k = from; k <= to; k++) out.push(k);
  return out;
}

export function* partition(A, p = 1, r = null) {
  const a = A.slice();
  const n = a.length;
  const lo = Math.max(1, Math.min(p, n));
  const hi = r == null ? n : Math.max(lo, Math.min(r, n));
  const x = a[hi - 1];
  let i = lo - 1;
  const counts = { cmp: 0, swap: 0 };

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

  /** 四区高亮：低侧 / 高侧 / 轴，外加「当前看到的那个」 */
  const regions = (cur) => ({
    result: span(lo, i),        // 低侧：A[p : i] ≤ x
    done: span(i + 1, cur - 1), // 高侧：A[i+1 : j−1] > x
    pivot: [hi],                // 轴：A[r] = x（位置不变）
  });

  yield frame(1, {
    pointers: {},
    highlight: { pivot: [hi] },
    note: `x = A[${hi}] = ${x}：**轴选定为最后一个元素**。这一步决定了后面所有比较的对象。`,
  });

  yield frame(2, {
    pointers: { i, j: lo, p: lo, r: hi },
    highlight: { pivot: [hi] },
    note: `i = p − 1 = ${i}：低侧为空（"最高下标"指向区间外，这是"空集"的常见写法）。`,
  });

  for (let j = lo; j <= hi - 1; j++) {
    yield frame(3, {
      pointers: { i, j, p: lo, r: hi },
      highlight: { ...regions(j), compare: [j] },
      note: `j = ${j}：把 A[${j}] = ${a[j - 1]} 与轴 x = ${x} 比较。低侧 A[${lo} : ${i}]，高侧 A[${i + 1} : ${j - 1}]。`,
    });

    counts.cmp++;
    const goesLow = a[j - 1] <= x;
    yield frame(4, {
      pointers: { i, j, p: lo, r: hi },
      highlight: { ...regions(j), compare: [j] },
      note: goesLow
        ? `A[${j}] = ${a[j - 1]} ≤ x = ${x}：它属于**低侧**。`
        : `A[${j}] = ${a[j - 1]} > x = ${x}：它属于高侧，本轮只把 j 右移一格，别的什么都不做。`,
    });

    if (goesLow) {
      i++;
      yield frame(5, {
        pointers: { i, j, p: lo, r: hi },
        highlight: { ...regions(j), compare: [j] },
        note: `i = i + 1 = ${i}：低侧要接纳一个新位置。`,
      });

      const old = a[i - 1];
      a[i - 1] = a[j - 1];
      a[j - 1] = old;
      counts.swap++;
      yield frame(6, {
        pointers: { i, j, p: lo, r: hi },
        highlight: { ...regions(j + 1), move: [i, j] },
        note: `exchange A[${i}] with A[${j}]：${old} 被挤到 ${j} 位（它本来就 > x，去高侧正好）。` +
          `注意 i ≤ j 恒成立，所以交换后低侧仍然只含 ≤ x 的元素。`,
      });
    }
  }

  counts.swap++;
  const oldPivot = a[i];
  a[i] = a[hi - 1];
  a[hi - 1] = oldPivot;

  yield frame(7, {
    pointers: { i, r: hi },
    highlight: { ...regions(hi), move: [i + 1, hi] },
    note: `循环结束（j 走到 r = ${hi}，未看区间已空）。exchange A[${i + 1}] with A[${hi}]：` +
      `轴 ${x} 落到下标 ${i + 1} —— 低侧与高侧正中间，那是它的最终位置。`,
  });

  const q = i + 1;
  yield {
    line: 8,
    array: a.slice(),
    pointers: { q },
    highlight: {
      result: span(lo, q - 1),
      done: span(q + 1, hi),
      pivot: [q],
    },
    counts: { ...counts },
    note: `return ${q}：轴落在下标 ${q}。它左边的都 ≤ ${x}，右边的都 > ${x} —— ` +
      `分区完成，这个位置从此不会再被移动。共 ${counts.cmp} 次比较、${counts.swap} 次交换。`,
    invariantHolds: true,
    done: true,
  };
}
