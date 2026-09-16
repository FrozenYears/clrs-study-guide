// randomly-permute.js — 5.3 的 RANDOMLY-PERMUTE 教学帧（原书 p.136 的 2 行）。
//
// 书中的伪代码（已按 p136 渲染页核对）：
//   1 for i = 1 to n
//   2     swap A[i] with A[RANDOM(i, n)]
//
// ★ 关于「随机」：真实的 RANDOM(i, n) 每次都不一样，但本站的动画必须**可以单步、
//   可以回退**，所以这里的「随机」用固定种子的线性同余发生器产生 —— 同一个 seed
//   永远给出同一串选择。关卡里要明确说明这一点：动画演示的是**过程**，
//   而「均匀性」是阶段 7/8 用数学证明、用 C 程序做统计检验来验证的。
// ★ 关键细节（也是初学者最容易写错的地方）：第 i 轮是从 A[i : n] 里挑，
//   不是从 A[1 : n] 里挑。从 A[1 : n] 里挑会产生偏斜的分布（原书习题 5.3-3）。

/**
 * 确定性伪随机序列（xorshift32 + 种子混合）。
 *
 * ★ 为什么不用最常见的「线性同余 + 取模」（`s = (a*s+c) % 2^32; s % bound`）？
 *   模 2^32 的线性同余发生器**低位几乎不随机**（最低位周期为 2），而 `s % bound`
 *   恰好只用到低位。实测：n=4 时某值落在某位置的频率偏离 1/4 达 17%，洗出来的牌
 *   明显不均匀 —— 单元测试里的卡方检验就是这么抓出来的。
 * ★ 为什么种子要先「打散」？xorshift32 是 GF(2) 上的线性映射，所以**连续种子**
 *   （1,2,3…）的第一个输出只差一个固定的异或模式，彼此高度相关。测试用连续种子
 *   采样时，这种相关性又会污染统计量（实测偏差 9%）。先用一轮乘法混合把种子打散，
 *   连续种子就互不相关了。
 *
 * 换成纯随机实现时把 makeRandom 换成 Math.random 即可，帧数会变，但过程不变。
 */
function makeRandom(seed) {
  let s = (seed >>> 0) || 0x9e3779b9;
  // 种子混合（splitmix32 的两步乘法），让相邻种子互不相关
  s = (s + 0x9e3779b9) >>> 0;
  s = Math.imul(s ^ (s >>> 16), 0x21f0aaad) >>> 0;
  s = Math.imul(s ^ (s >>> 15), 0x735a2d97) >>> 0;
  s = (s ^ (s >>> 15)) >>> 0;
  if (s === 0) s = 0x9e3779b9;
  return function next(bound) {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return Math.floor((s / 4294967296) * bound); // 0 .. bound-1，用整个字长（高位更可靠）
  };
}

export function* randomlyPermute(A, seed = 1) {
  const a = A.slice();
  const n = a.length;
  const rand = makeRandom(seed);
  const counts = { move: 0 };

  const frame = (line, extra = {}) => ({
    line,
    array: a.slice(),
    pointers: extra.pointers || {},
    highlight: extra.highlight || {},
    note: extra.note || '',
    counts: { ...counts },
    invariantHolds: extra.invariantHolds !== undefined ? extra.invariantHolds : true,
    done: false,
  });

  const sortedPrefix = (i) => (i > 1 ? { sortedPrefix: i - 1 } : {});

  if (n === 0) {
    yield {
      line: null, array: [], pointers: {}, highlight: {},
      counts: { ...counts }, note: '（空数组）', invariantHolds: true, done: true,
    };
    return;
  }

  yield frame(1, {
    note: `开始洗牌：n = ${n}。本轮动画用固定种子 ${seed} 的伪随机序列`
      + `（固定种子才能逐步回退；真实实现里 RANDOM 每次都不一样）。`,
  });

  for (let i = 1; i <= n; i++) {
    yield frame(1, {
      pointers: { i },
      highlight: { active: [i], ...sortedPrefix(i) },
      note: i === 1
        ? `i = 1：从 A[1 : ${n}] 这 ${n} 个位置里挑一个，与 A[1] 交换。`
        : `i = ${i}：A[1 : ${i - 1}] 已经定下来了，**之后再也不动**；`
          + `本轮从 A[${i} : ${n}] 这 ${n - i + 1} 个位置里挑一个。`,
    });

    const bound = n - i + 1;
    const j = i + rand(bound);
    if (j !== i) {
      const tmp = a[i - 1];
      a[i - 1] = a[j - 1];
      a[j - 1] = tmp;
      counts.move++;
    }
    yield frame(2, {
      pointers: { i },
      highlight: j === i
        ? { active: [i], ...sortedPrefix(i + 1) }
        : { move: [i, j], ...sortedPrefix(i + 1) },
      note: j === i
        ? `RANDOM(${i}, ${n}) 抽到 ${j}，就是它自己 —— 交换等于没动。`
        : `RANDOM(${i}, ${n}) 抽到 ${j}：交换 A[${i}] 与 A[${j}]，`
          + `现在 A[${i}] = ${a[i - 1]} 定下来了。`,
    });
  }

  yield {
    line: null,
    array: a.slice(),
    pointers: {},
    highlight: { sortedPrefix: n },
    counts: { ...counts },
    note: `洗牌完成：${a.join(', ')}。总共 ${counts.move} 次有效交换（最多 n = ${n} 次）—— `
      + `整个过程是 Θ(n)，而且只在原数组上换位置，额外空间是 O(1)。`,
    invariantHolds: true,
    done: true,
  };
}
