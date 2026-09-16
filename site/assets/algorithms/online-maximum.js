// online-maximum.js — 5.4.4 在线招聘问题（原书 p.150 的 ONLINE-MAXIMUM 教学帧）。
//
// 输入：n 位候选人的分数，按面试顺序排列（分数越高越好）。
// algoArgs 传第 2 个参数 k：先在「观察期」面试前 k 位，记下其中最高分，
// 之后遇到第一个比它高的就当场雇用（在线决策：不能回头，不能对比已淘汰的人）。
//
// 书中的伪代码（8 行）逐行对应本文件里的 yield 行号：
//   1 best-score = −1
//   2 for i = 1 to k
//   3     if score(i) > best-score
//   4         best-score = score(i)
//   5 for i = k + 1 to n
//   6     if score(i) > best-score
//   7         return i
//   8 return n

export function* onlineMaximum(ranks, k) {
  const arr = ranks.slice();
  const n = arr.length;
  const observe = Math.max(0, Math.min(Number.isInteger(k) ? k : Math.floor(n / Math.E), n));
  const counts = { interviews: 0, cmp: 0, best: -1 };
  let bestScore = -1;
  let bestIndex = 0;   // 观察期内的最高分位置（1 基，0 表示还没有）

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

  yield frame(1, {
    note: `best-score = −1：它是虚拟的下界，保证第 1 位候选人一定被记进观察期最高分。`
      + `观察期长度 k = ${observe}。`,
  });

  // ---- 观察期：只记录最高分，不做任何决定 ----
  for (let i = 0; i < observe; i++) {
    const pos = i + 1;
    counts.interviews = pos;
    yield frame(2, {
      pointers: { i: pos },
      highlight: {
        visited: Array.from({ length: pos }, (_, t) => t + 1),
        active: [pos],
        result: bestIndex ? [bestIndex] : [],
      },
      note: `观察期第 ${pos} 位，分数 ${arr[i]}。`,
    });

    counts.cmp++;
    const better = arr[i] > bestScore;
    yield frame(3, {
      pointers: { i: pos },
      highlight: {
        visited: Array.from({ length: pos }, (_, t) => t + 1),
        active: [pos],
        compare: bestIndex ? [bestIndex, pos] : [pos],
      },
      note: better
        ? `分数 ${arr[i]} 高于当前最高分 ${bestScore === -1 ? '（虚拟 −1）' : bestScore}。`
        : `分数 ${arr[i]} 不超过当前最高分 ${bestScore}，观察期记录不变。`,
    });

    if (better) {
      bestScore = arr[i];
      bestIndex = pos;
      counts.best = bestScore;
      yield frame(4, {
        pointers: { i: pos },
        highlight: {
          visited: Array.from({ length: pos }, (_, t) => t + 1),
          active: [pos],
        },
        note: `best-score = ${bestScore}：观察期最高分来自第 ${pos} 位。`,
      });
    }
  }

  // ---- 决策期：遇到第一个超过观察期最高分的人，当场雇用 ----
  for (let i = observe; i < n; i++) {
    const pos = i + 1;
    counts.interviews = pos;
    yield frame(5, {
      pointers: { i: pos },
      highlight: {
        visited: Array.from({ length: observe }, (_, t) => t + 1),
        active: [pos],
        result: bestIndex ? [bestIndex] : [],
      },
      note: `决策期第 ${pos} 位，分数 ${arr[i]}。`,
    });

    counts.cmp++;
    const better = arr[i] > bestScore;
    yield frame(6, {
      pointers: { i: pos },
      highlight: {
        visited: Array.from({ length: observe }, (_, t) => t + 1),
        active: [pos],
        compare: bestIndex ? [bestIndex, pos] : [pos],
      },
      note: better
        ? `分数 ${arr[i]} 高于观察期最高分 ${bestScore} —— 立即雇用。`
        : `分数 ${arr[i]} 不超过 ${bestScore}，继续面试下一位。`,
    });

    if (better) {
      const globalBest = Math.max(...arr);
      const isGlobalBest = arr[i] === globalBest && arr.indexOf(globalBest) === i;
      yield {
        line: 7,
        array: arr.slice(),
        pointers: { i: pos },
        highlight: { result: [pos], violation: isGlobalBest ? [] : [pos] },
        counts: { ...counts },
        note: isGlobalBest
          ? `return ${pos}：恰好雇到了全局最优秀的候选人（分数 ${arr[i]}）。`
          : `return ${pos}：雇用了他，但真正的全局最高分是 ${globalBest}，出现在第 `
            + `${arr.indexOf(globalBest) + 1} 位 —— 在线策略这次没抓住。`,
        invariantHolds: true,
        done: true,
      };
      return;
    }
  }

  // 决策期没人超过观察期最高分：line 8 返回最后一位
  const globalBest = Math.max(...arr);
  const globalPos = arr.indexOf(globalBest) + 1;
  yield {
    line: 8,
    array: arr.slice(),
    pointers: { i: n },
    highlight: {
      active: n ? [n] : [],
      violation: globalPos === n ? [] : [n],
    },
    counts: { ...counts },
    note: `没人超过观察期最高分 ${bestScore}，return n：雇用最后一位（分数 ${arr[n - 1]}）。`
      + (globalPos === n ? ' 碰巧，最后一位就是全局最高分。' : ` 真正的最高分在第 ${globalPos} 位，错过了。`),
    invariantHolds: true,
    done: true,
  };
}
