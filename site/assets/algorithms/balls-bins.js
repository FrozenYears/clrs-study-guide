// balls-bins.js — 5.4.2 球与箱的教学帧。
//
// 输入：每次投掷落入的箱子编号（1..b），按投掷顺序排列。
// 注意：这一关的画面**不是输入数组本身**，而是由输入推出来的「每个箱子里的球数」。
// 输入只决定「第 t 个球进了哪个箱子」，帧里的 array 是当时的装载量分布 B[1 : b]。
//
// 教学伪代码 BALLS-AND-BINS：
//   1 for j = 1 to b:  B[j] = 0
//   2 hits = 0
//   3 for t = 1 to n
//   4     r = 第 t 个球落入的箱子
//   5     B[r] = B[r] + 1
//   6     if B[r] = 1
//   7         hits = hits + 1
//   8 return B

export function* ballsBins(choices, bins) {
  const seq = choices.slice();
  const b = bins || Math.max(1, ...seq, 1);
  const load = new Array(b).fill(0);
  const counts = { throws: 0, hits: 0, maxLoad: 0 };

  const frame = (line, extra = {}) => ({
    line,
    array: load.slice(),
    pointers: extra.pointers || {},
    highlight: extra.highlight || {},
    note: extra.note || '',
    counts: { ...counts },
    invariantHolds: true,
    done: false,
  });

  yield frame(1, { note: `${b} 个箱子全部清空，每个箱子里的球数都是 0。` });

  for (let t = 0; t < seq.length; t++) {
    const toss = t + 1;
    const r = seq[t];
    if (!(r >= 1 && r <= b)) {
      yield frame(4, {
        note: `第 ${toss} 次投掷的箱子编号 ${r} 超出 1..${b}，请检查预设输入。`,
        invariantHolds: false,
      });
      continue;
    }
    counts.throws = toss;

    // 指针留空：球的序号 t 不是某一列的下标，标上去反而会误导（列是箱子编号）。
    yield frame(4, {
      highlight: { active: [r] },
      note: `第 ${toss} 个球落进第 ${r} 号箱。`,
    });

    load[r - 1]++;
    const isFirstHit = load[r - 1] === 1;
    if (isFirstHit) counts.hits++;
    const isNewMax = load[r - 1] > counts.maxLoad;
    if (isNewMax) counts.maxLoad = load[r - 1];

    yield frame(5, {
      highlight: {
        active: isNewMax ? [r] : [],
        result: isFirstHit ? [r] : [],
      },
      note: `第 ${r} 号箱现在有 ${load[r - 1]} 个球。`,
    });

    if (isFirstHit) {
      yield frame(6, {
        highlight: { result: [r] },
        note: `第 ${r} 号箱原来是空的 —— 这是第 ${counts.hits} 次「命中空箱」。`,
      });
    }
  }

  const full = load.filter((v) => v > 0).length;
  yield {
    line: 8,
    array: load.slice(),
    pointers: {},
    highlight: load.map((v, i) => (v === counts.maxLoad ? i + 1 : 0)).filter(Boolean),
    counts: { ...counts },
    note: `${counts.throws} 个球投完：命中最高的箱子装了 ${counts.maxLoad} 个；`
      + `${b} 个箱子里有 ${full} 个非空。`,
    invariantHolds: true,
    done: true,
  };
}
