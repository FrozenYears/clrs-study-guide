// min-max.js — 9.1 的成对法找 min/max 教学帧（原书 p.229 文字描述的直译）。
//
// 帧：输入 → 逐对处理（对内 1 次 + 败者对 min + 胜者对 max）→ 完成。
// 帧数组显示输入；min/max 用 pointers 标注在数组两端之外（引擎用命名指针）。

export function* minMax(A) {
  const n = A.length;
  const counts = { cmp: 0, move: 0 };

  const frame = (line, note, extra = {}) => ({
    line,
    array: A.slice(),
    pointers: extra.pointers || {},
    highlight: extra.highlight || {},
    note,
    counts: { ...counts },
    phase: extra.phase,
    invariantHolds: true,
    done: false,
  });

  let mn, mx;
  let i = 1;                       // 0 基内部
  if (n % 2 === 1) {
    mn = mx = A[0];
    yield frame(0, `奇数 n = ${n}：首元素 ${A[0]} 免费当初始 min 和 max。`, { phase: '初始化' });
  } else {
    counts.cmp++;
    if (A[0] < A[1]) { mn = A[0]; mx = A[1]; } else { mn = A[1]; mx = A[0]; }
    i = 2;
    yield frame(0, `偶数 n = ${n}：首对比较 1 次 → min = ${mn}、max = ${mx}。`, { phase: '初始化' });
  }

  for (; i + 1 < n; i += 2) {
    counts.cmp++;
    const lo = A[i] < A[i + 1] ? A[i] : A[i + 1];
    const hi = A[i] < A[i + 1] ? A[i + 1] : A[i];
    yield frame(0, `对内比较：${A[i]} vs ${A[i + 1]} → 败者 ${lo} 进 min 赛道、胜者 ${hi} 进 max 赛道。`,
      { phase: '对内比较', highlight: { active: [i + 1, i + 2] } });
    counts.cmp++;
    if (lo < mn) { mn = lo; }
    yield frame(0, `败者 ${lo} 对当前 min（第 2 次比较）。`,
      { phase: '对 min' });
    counts.cmp++;
    if (hi > mx) { mx = hi; }
    yield frame(0, `胜者 ${hi} 对当前 max（第 3 次比较）。★ 本对共 3 次 —— 朴素法要 4 次。`,
      { phase: '对 max', highlight: { active: [i + 1, i + 2] } });
  }

  yield {
    line: 0,
    array: A.slice(),
    pointers: {},
    highlight: { done: A.map((_, k) => k + 1) },
    counts: { ...counts },
    note: `完成：min = ${mn}、max = ${mx}。共 ${counts.cmp} 次比较（n = ${n}，` +
      (n % 2 === 1 ? `奇数 3⌊n/2⌋ = ${3 * ((n - 1) / 2)}` : `偶数 3n/2−2 = ${1 + 3 * (n - 2) / 2}`) +
      `）。★ 每对省下的 1 次比较 = 对内赛果被 min/max 双重复用。`,
    invariantHolds: true,
    done: true,
    phase: '完成',
  };
}
