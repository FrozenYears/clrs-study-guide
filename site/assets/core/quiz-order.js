/* =============================================================================
 * core/quiz-order.js — 单选题选项的「确定性乱序」
 *
 * 为什么需要它：关卡数据里 478 道单选题有 353 道的正确项写在下标 1（永远选第二个
 * 就能得 74% 的分），另有大量正确项是唯一最长项。逐个去改数据要动 answer 下标、
 * 要重跑全部检查，还会被新题重新犯同样的毛病 —— 所以把「顺序」这件事交给渲染器：
 * 同一道题每次都按同一个顺序摆（可复现，页面检查与「重做」都不会跳变），
 * 但不同题的起点不一样，蒙「B」和蒙「最后一个」都不再有效。
 *
 * 数据层不动：options / answer / **加粗标记** 全按原样写，判分仍然比对原始下标。
 * ========================================================================== */

/** 字符串 -> 32 位无符号整数（FNV-1a）。只要稳定，不要求 cryptographic。 */
export function hash32(s) {
  let x = 2166136261;
  for (let i = 0; i < s.length; i++) {
    x ^= s.charCodeAt(i);
    x = Math.imul(x, 16777619);
  }
  return x >>> 0;
}

/** mulberry32：给种子就能复现的小随机数发生器。 */
function prng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 返回展示顺序：第 k 个显示出来的选项，是原始下标 order[k]。
 * key 用题目自身的稳定指纹（题干文本），所以同一道题永远同一顺序。
 */
export function optionOrder(key, n) {
  const idx = [];
  for (let i = 0; i < n; i++) idx.push(i);
  if (n < 2) return idx;
  const rand = prng(hash32(String(key == null ? "" : key)));
  for (let i = n - 1; i > 0; i--) {           // Fisher-Yates
    const j = Math.floor(rand() * (i + 1));
    const t = idx[i];
    idx[i] = idx[j];
    idx[j] = t;
  }
  return idx;
}

/** 正确项在乱序后落在第几个（-1 表示 answer 越界，交给上层兜底）。 */
export function displayIndexOf(order, answer) {
  return order.indexOf(answer);
}

export default { hash32, optionOrder, displayIndexOf };
