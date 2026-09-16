// streaks.js — 5.4.3 连续正面的教学帧。
//
// 输入：n 次抛硬币的结果，1 = 正面（H），0 = 反面（T），按抛掷顺序排列。
// 序列一次给全（像拿到一张数据表），动画负责演示「怎么边走边记最长连续」。
//
// 教学伪代码 LONGEST-STREAK：
//   1 best = 0
//   2 cur = 0
//   3 for i = 1 to n
//   4     if flip(i) = H
//   5         cur = cur + 1
//   6     else cur = 0
//   7     if cur > best
//   8         best = cur
//   9 return best

export function* streaks(flips) {
  const arr = flips.slice();
  const counts = { flips: 0, cur: 0, best: 0 };
  let runStart = -1; // 当前连续正面段的起点（0 基），-1 表示当前不是正面
  let bestStart = 0;
  let bestLen = 0;

  const frame = (line, extra = {}) => ({
    line,
    array: arr.slice(),
    pointers: extra.pointers || {},
    highlight: extra.highlight || {},
    note: extra.note || '',
    counts: { ...counts },
    invariantHolds: true,
    done: false,
  });

  yield frame(1, { note: 'best = 0：还没有见过任何一次正面。' });

  for (let i = 0; i < arr.length; i++) {
    const pos = i + 1;
    const head = arr[i] === 1;
    counts.flips = pos;

    if (head) {
      if (counts.cur === 0) runStart = i;
      counts.cur++;
    } else {
      counts.cur = 0;
      runStart = -1;
    }

    const visited = Array.from({ length: pos }, (_, k) => k + 1);
    const bestRun = bestLen
      ? Array.from({ length: bestLen }, (_, k) => bestStart + k + 1)
      : [];

    if (head) {
      yield frame(5, {
        pointers: { i: pos },
        highlight: { visited, active: [pos], result: bestRun },
        note: `第 ${pos} 次是正面，当前连续 ${counts.cur} 次。`,
      });
    } else {
      yield frame(6, {
        pointers: { i: pos },
        highlight: { visited, active: [pos], result: bestRun },
        note: `第 ${pos} 次是反面，当前连续次数清零。`,
      });
    }

    if (counts.cur > counts.best) {
      counts.best = counts.cur;
      bestLen = counts.cur;
      bestStart = runStart;
      yield frame(8, {
        pointers: { i: pos },
        highlight: {
          visited,
          result: Array.from({ length: bestLen }, (_, k) => bestStart + k + 1),
        },
        note: `刷新纪录：最长连续正面变成 ${counts.best} 次。`,
      });
    }
  }

  yield {
    line: 9,
    array: arr.slice(),
    pointers: {},
    highlight: {
      result: bestLen
        ? Array.from({ length: bestLen }, (_, k) => bestStart + k + 1)
        : [],
    },
    counts: { ...counts },
    note: `抛了 ${counts.flips} 次，最长连续正面是 ${counts.best} 次。`
      + `理论期望是 Θ(lg n)：n = ${counts.flips} 时量级约 ${Math.log2(Math.max(2, counts.flips)).toFixed(1)}。`,
    invariantHolds: true,
    done: true,
  };
}
