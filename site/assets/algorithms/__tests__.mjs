// __tests__.mjs — 算法驱动断言测试（node 直接跑：node __tests__.mjs）
// 校验：排序正确性、插入排序最坏比较次数、归并排序比较次数落界。

import { insertionSort } from './insertion-sort.js';
import { mergeSort } from './merge-sort.js';
import { merge } from './merge.js';
import { strassenDemo } from './strassen-demo.js';
import { matrixMultiplyDemo } from './matrix-multiply-demo.js';
import { hireAssistant } from './hire-assistant.js';
import { birthdayCollisions } from './birthday-collisions.js';
import { ballsBins } from './balls-bins.js';
import { streaks } from './streaks.js';
import { onlineMaximum } from './online-maximum.js';
import { heapIndexDemo } from './heap-index-demo.js';
import { maxHeapify } from './max-heapify.js';
import { buildMaxHeap } from './build-max-heap.js';
import { heapsort } from './heapsort.js';
import { heapExtractMax } from './heap-extract-max.js';
import { heapIncreaseKey } from './heap-increase-key.js';
import { heapInsert } from './heap-insert.js';
import { randomlyPermute } from './randomly-permute.js';

let passed = 0, failed = 0;
function ok(cond, msg) {
  if (cond) { passed++; console.log('  PASS ' + msg); }
  else { failed++; console.log('  FAIL ' + msg); }
}
function run(gen) {
  let last = null, frames = 0;
  for (const f of gen) { last = f; frames++; }
  return { result: last.array, counts: last.counts, frames };
}
const sorted = (a) => [...a].sort((x, y) => x - y);

// 聚合上界：最坏情况 ≤ n⌈lg n⌉ − n + 1
const ub = (n) => (n <= 1 ? 0 : n * Math.ceil(Math.log2(n)) - n + 1);

// 确定性随机数组（LCG）
function lcg(seed, n) {
  let s = seed >>> 0; const out = [];
  for (let i = 0; i < n; i++) { s = (1103515245 * s + 12345) >>> 0; out.push(s % 100); }
  return out;
}

const cases = [
  [], [1], [1, 2, 3], [3, 2, 1],
  [5, 2, 4, 6, 1, 3],            // 原书 Figure 2.2
  [2, 2, 1, 1, 3, 3],            // 含重复
  [12, 3, 7, 9, 14, 6, 11, 2],   // 原书 Figure 2.4
  lcg(1, 7), lcg(7, 9), lcg(42, 12), lcg(99, 16),
];

console.log('\n[1] 排序正确性');
for (const a of cases) {
  const ins = run(insertionSort(a));
  const mg = run(mergeSort(a));
  ok(JSON.stringify(ins.result) === JSON.stringify(sorted(a)), `insertionSort([${a}]) -> 有序`);
  ok(JSON.stringify(mg.result) === JSON.stringify(sorted(a)), `mergeSort([${a}]) -> 有序`);
}

console.log('\n[2] 插入排序：触发搬移的比较次数（最坏情况 = n(n−1)/2）');
for (const n of [1, 2, 3, 4, 5, 6, 7, 8]) {
  const rev = Array.from({ length: n }, (_, i) => n - i);
  const r = run(insertionSort(rev));
  const expect = n * (n - 1) / 2;
  ok(r.counts.cmp === expect, `逆序 n=${n}: cmp=${r.counts.cmp}（期望 ${expect}）`);
}
// 重点：n=6 必须等于 15
{
  const r = run(insertionSort([6, 5, 4, 3, 2, 1]));
  ok(r.counts.cmp === 15, `逆序 n=6 cmp=${r.counts.cmp}（n(n-1)/2 = 15）`);
}

// ★ 关键忠实度断言：书中 2.2 的 tᵢ 是「第 5 行被求值的次数」，
//   含每轮最后一次为假的那次判断，因此 Σtᵢ 比上面的 cmp 多 (n−1)。
//   书给的结论：tᵢ ≤ i，最坏情况 Σ_{i=2..n} i = n(n+1)/2 − 1。
console.log('\n[2b] 第 5 行求值次数 Σtᵢ（书中 2.2 的定义，含失败判断）');
for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 12, 20]) {
  const rev = Array.from({ length: n }, (_, i) => n - i);
  const r = run(insertionSort(rev));
  const expect = n <= 1 ? 0 : n * (n + 1) / 2 - 1;
  ok(r.counts.line5 === expect,
    `逆序 n=${n}: Σtᵢ=${r.counts.line5}（书给 n(n+1)/2−1 = ${expect}）`);
}
// 恒等式：line5 − cmp === n − 1（每轮恰有一次失败判断）
{
  let allOk = true;
  for (const a of cases) {
    const r = run(insertionSort(a));
    if (r.counts.line5 - r.counts.cmp !== Math.max(0, a.length - 1)) allOk = false;
  }
  ok(allOk, '恒等式：Σtᵢ − cmp === n − 1（每轮恰有一次失败判断）');
}
// 原书 Figure 2.2 的数组：t₂..t₆ = 2,2,1,5,4 → Σtᵢ = 14
{
  const r = run(insertionSort([5, 2, 4, 6, 1, 3]));
  ok(r.counts.line5 === 14, `Figure 2.2: Σtᵢ=${r.counts.line5}（逐轮 2+2+1+5+4 = 14）`);
}

console.log('\n[3] 归并排序比较次数落界（书中 2.3：每次合并 at least n/2, at most n−1）');
// 聚合上界：最坏情况 ≤ n⌈lg n⌉ − n + 1，故每个实例 cmp 都 ≤ 它（已验证）。
for (const a of cases) {
  const r = run(mergeSort(a));
  const n = a.length;
  const hi = ub(n);
  ok(r.counts.cmp <= hi, `mergeSort([${n} 元]): cmp=${r.counts.cmp} ≤ 上界 ${hi}`);
}
// 逐次合并的界：min(nL,nR) ≤ 该次比较数 ≤ nL+nR−1（书给平衡时 ≥ n/2, ≤ n−1）。
{
  let allIn = true, checked = 0;
  for (let t = 0; t < 400; t++) {
    const nL = 1 + (t * 7) % 6, nR = 1 + (t * 5) % 7;
    const n = nL + nR;
    const a = new Array(n);
    // 构造已排序的左/右两段（值交叉以保证产生各种比较模式）
    for (let i = 0; i < nL; i++) a[i] = (i + 1) * 2;
    for (let j = 0; j < nR; j++) a[nL + j] = (j + 1) * 2 - 1;
    const c = { cmp: 0, move: 0 };
    for (const _ of merge(a, 1, nL, n, c)) void _;
    checked++;
    if (!(c.cmp >= Math.min(nL, nR) && c.cmp <= nL + nR - 1)) allIn = false;
  }
  ok(allIn, `400 组合并的比较次数均落在 [min(nL,nR), nL+nR−1]（共校验 ${checked} 组）`);
}
// 两个原书示例的实测值
{
  const f22 = run(insertionSort([5, 2, 4, 6, 1, 3]));
  const f24 = run(mergeSort([12, 3, 7, 9, 14, 6, 11, 2]));
  console.log(`    Figure 2.2 插入排序 cmp=${f22.counts.cmp}, move=${f22.counts.move}`);
  console.log(`    Figure 2.4 归并排序 cmp=${f24.counts.cmp}, move=${f24.counts.move}`);
}

console.log('\n[4] MERGE 单独测试（原书 Figure 2.3：L=[2,4,6,7], R=[1,2,3,5]）');
{
  const A = [2, 4, 6, 7, 1, 2, 3, 5];
  const c = { cmp: 0, move: 0 };
  for (const _ of merge(A, 1, 4, 8, c)) void _;
  ok(JSON.stringify(A) === JSON.stringify([1, 2, 2, 3, 4, 5, 6, 7]), `merge(A,1,4,8) -> [${A}]`);
  // 每次把值写回 A（第 14/16/21/25 行）都要计一次 move；两段共 nL+nR 个元素，
  // 每个恰好写回一次，故 move 必须精确等于 r−p+1 = 8。
  ok(c.move === 8, `merge(A,1,4,8) 写回次数 move=${c.move}（期望 8 = r−p+1）`);
  ok(c.cmp <= 7, `merge(A,1,4,8) 比较次数 cmp=${c.cmp} ≤ nL+nR−1 = 7`);
}
// 每个元素恰好写回一次 —— 用穷举交叉段验证
{
  let allExact = true, checked = 0;
  for (let t = 0; t < 200; t++) {
    const nL = 1 + (t * 7) % 6, nR = 1 + (t * 5) % 7;
    const n = nL + nR;
    const a = new Array(n);
    for (let i = 0; i < nL; i++) a[i] = (i + 1) * 2;
    for (let j = 0; j < nR; j++) a[nL + j] = (j + 1) * 2 - 1;
    const c = { cmp: 0, move: 0 };
    for (const _ of merge(a, 1, nL, n, c)) void _;
    checked++;
    if (c.move !== n) allExact = false;
  }
  ok(allExact, `200 组合并的写回次数均恰好等于区间长度 r−p+1（共校验 ${checked} 组）`);
}

console.log('\n[5] Strassen 教学帧顺序（原书 4.2 的四步）');
{
  const frames = [...strassenDemo()];
  const sFrames = frames.filter((frame) => frame.phase === 's');
  const pFrames = frames.filter((frame) => frame.phase === 'p');
  ok(frames.length === 20, `共 ${frames.length} 帧（分块 + 10 个 S + 7 个 P + 合并 + 完成）`);
  ok(sFrames.length === 10 && sFrames.every((frame, index) => frame.index === index),
    'S1…S10 按原书顺序各出现一次');
  ok(pFrames.length === 7 && pFrames.every((frame, index) => frame.index === index),
    'P1…P7 按原书顺序各出现一次');
  ok(frames[0].line === 1 && sFrames.every((frame) => frame.line === 2) &&
    pFrames.every((frame) => frame.line === 3) && frames[18].line === 4,
  '教学步骤行号依次为 1、2、3、4');
  ok(frames.at(-1).done === true && frames.at(-1).phase === 'done', '最后一帧明确结束');
}

console.log('\n[6] MATRIX-MULTIPLY 教学帧（原书 4.1 的三重循环）');
{
  const frames = [...matrixMultiplyDemo([1, 2, 3, 4, 5, 6, 7, 8])];
  const last = frames.at(-1);
  const cells = frames.filter((frame) => frame.phase === 'complete-cell');
  ok(cells.length === 4, `四个 cᵢⱼ 各有一个完成帧（${cells.length} 个）`);
  ok(cells.map((frame) => frame.partial).join(',') === '19,22,43,50',
    '2×2 示例的四个结果依次为 19、22、43、50');
  ok(frames.filter((frame) => frame.phase === 'accumulate').length === 8,
    '2×2 示例恰有 8 次标量乘加');
  ok(last.phase === 'done' && last.c.flat().join(',') === '19,22,43,50',
    '最后一帧明确结束且 C = A · B');
}

console.log('\n[7] HIRE-ASSISTANT 教学帧（原书 5.1 的当前最佳策略）');
{
  const increasing = [...hireAssistant([1, 2, 3, 4])].at(-1);
  const decreasing = [...hireAssistant([4, 3, 2, 1])].at(-1);
  const mixed = [...hireAssistant([3, 1, 4, 2, 5])].at(-1);
  ok(increasing.counts.interview === 4 && increasing.counts.hire === 4,
    '严格递增：面试 4 次、招聘 4 次（最坏情况）');
  ok(decreasing.counts.interview === 4 && decreasing.counts.hire === 1,
    '严格递减：面试 4 次、只招聘首位候选人');
  ok(mixed.pointers.best === 5 && mixed.counts.hire === 3,
    '混合序列：最终候选人是资格最高的第 5 位，招聘 3 次');
}

console.log('\n[8] 第 5 章 5.4 的四个概率实验生成器');
{
  // ---- 8a 生日悖论：命中对数、比较次数、输入不被改动 ----
  const bdays = [5, 12, 5, 200, 7, 12];
  const bFrames = [...birthdayCollisions(bdays)];
  const bLast = bFrames.at(-1);
  ok(bLast.done === true, '生日悖论：最后一帧明确结束');
  ok(bLast.counts.collisions === 2, `生日悖论：6 人里命中 ${bLast.counts.collisions} 对（期望 2 对）`);
  // 比较次数 = Σ(i−1) = C(6,2) = 15，正好等于「对数」
  ok(bLast.counts.cmp === 15, `生日悖论：比较次数 ${bLast.counts.cmp} = C(6,2) = 15`);
  ok(JSON.stringify(bLast.array) === JSON.stringify(bdays), '生日悖论：输入数组未被改动');
  // 无重复时必须报 0 对
  {
    const none = [...birthdayCollisions([1, 2, 3, 4, 5])].at(-1);
    ok(none.counts.collisions === 0 && none.counts.cmp === 10,
      '生日悖论：5 个互不相同 -> 0 对、10 次比较');
  }

  // ---- 8b 球与箱：装载量守恒、命中空箱次数、最高箱 ----
  const throws = [1, 2, 1, 3, 3, 1];
  const bbLast = [...ballsBins(throws, 3)].at(-1);
  ok(bbLast.done === true, '球与箱：最后一帧明确结束');
  ok(JSON.stringify(bbLast.array) === JSON.stringify([3, 1, 2]),
    `球与箱：3 个箱子的装载量 = [${bbLast.array}]（期望 [3,1,2]）`);
  ok(bbLast.counts.throws === 6, `球与箱：投掷次数 ${bbLast.counts.throws} = 输入长度 6`);
  ok(bbLast.counts.hits === 3, `球与箱：命中空箱 ${bbLast.counts.hits} 次（3 个箱子各首次命中一次）`);
  ok(bbLast.counts.maxLoad === 3, `球与箱：最高箱装载 ${bbLast.counts.maxLoad}（期望 3）`);
  // 守恒：所有箱子的球数之和 = 投掷数
  {
    let allOk = true;
    for (let t = 0; t < 50; t++) {
      const b = 2 + (t % 5);
      const seq = lcg(t + 1, 12 + (t % 7)).map((v) => (v % b) + 1);
      const last = [...ballsBins(seq, b)].at(-1);
      const sum = last.array.reduce((x, y) => x + y, 0);
      if (sum !== seq.length) allOk = false;
    }
    ok(allOk, '球与箱：50 组随机输入的装载量之和都等于投掷数（守恒）');
  }

  // ---- 8c 连续正面：最长连续段 ----
  const flips = [1, 1, 0, 1, 1, 1, 0, 1];
  const sLast = [...streaks(flips)].at(-1);
  ok(sLast.done === true, '连续正面：最后一帧明确结束');
  ok(sLast.counts.best === 3, `连续正面：最长连续 ${sLast.counts.best} 次（期望 3）`);
  ok(sLast.counts.flips === 8, `连续正面：抛掷次数 ${sLast.counts.flips} = 输入长度 8`);
  // 与暴力法逐例比对
  {
    const brute = (a) => {
      let best = 0, cur = 0;
      for (const v of a) { cur = v === 1 ? cur + 1 : 0; if (cur > best) best = cur; }
      return best;
    };
    let allOk = true;
    for (let t = 0; t < 60; t++) {
      const a = lcg(t + 7, 6 + (t % 30)).map((v) => v % 2);
      if ([...streaks(a)].at(-1).counts.best !== brute(a)) allOk = false;
    }
    ok(allOk, '连续正面：60 组随机串与暴力法结果一致');
  }

  // ---- 8d 在线招聘：与暴力策略逐例比对（全排列 × 全部 k）----
  {
    const bruteOnline = (ranks, k) => {
      const n = ranks.length;
      const observe = Math.max(0, Math.min(k, n));
      let best = -1;
      for (let i = 0; i < observe; i++) best = Math.max(best, ranks[i]);
      for (let i = observe; i < n; i++) if (ranks[i] > best) return i + 1;
      return n;
    };
    const perms = (a) => (a.length <= 1 ? [a] : a.flatMap(
      (v, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [v, ...p])));
    let allOk = true, checked = 0;
    for (const p of perms([1, 2, 3, 4, 5])) {
      for (let k = 0; k <= 5; k++) {
        const last = [...onlineMaximum(p, k)].at(-1);
        checked++;
        if (last.line !== 7 && last.line !== 8) allOk = false;
        const got = last.pointers.i;
        if (got !== bruteOnline(p, k)) allOk = false;
        // 面试次数必须恰好等于「雇到那一位」的位置
        if (last.counts.interviews !== got) allOk = false;
      }
    }
    ok(allOk, `在线招聘：5!×6 = ${checked} 种情形与暴力策略完全一致`);
    // 经典结论：k = n/e 时约 1/e 的概率雇到最佳（用 4 万次枚举近似）
    {
      const perms4 = perms([1, 2, 3, 4, 5, 6]);
      const k = Math.round(6 / Math.E);
      let hit = 0;
      for (const p of perms4) {
        const last = [...onlineMaximum(p, k)].at(-1);
        if (p[last.pointers.i - 1] === 6) hit++;
      }
      const ratio = hit / perms4.length;
      ok(ratio > 0.3 && ratio < 0.5,
        `在线招聘：n=6、k=round(n/e)=${k} 时雇到最佳的比例 ${ratio.toFixed(3)}，落在 1/e ≈ 0.368 附近`);
    }
  }
}

console.log('\n[9] 第 6 章堆生成器');
{
  const isSorted = (a) => a.every((v, i) => i === 0 || a[i - 1] <= v);
  const sameBag = (x, y) => JSON.stringify([...x].sort((p, q) => p - q)) === JSON.stringify([...y].sort((p, q) => p - q));

  /** 最大堆性质：A[1 : heapSize] 里每个非根结点都不大于它的父。 */
  const isMaxHeap = (a, heapSize = a.length) => {
    for (let i = 2; i <= heapSize; i++) if (a[Math.floor(i / 2) - 1] < a[i - 1]) return false;
    return true;
  };

  /** 以 root 为根的子树内是否满足最大堆性质（6.2 只保证这一棵子树）。 */
  const subtreeOk = (a, root, heapSize = a.length) => {
    for (let i = root; i <= heapSize; i++) {
      const l = 2 * i, r = l + 1;
      if (l <= heapSize && a[i - 1] < a[l - 1]) return false;
      if (r <= heapSize && a[i - 1] < a[r - 1]) return false;
    }
    return true;
  };

  // ---- 9a 下标演示：帧数、叶子数、父/子关系 ----
  {
    const A = [16, 14, 10, 8, 7, 9, 3, 2, 4, 1]; // 原书 Figure 6.1 的堆
    const frames = [...heapIndexDemo(A)];
    ok(frames.length === 2 + 3 * A.length,
      `下标演示：n=10 产 ${frames.length} 帧（期望 2 + 3n = 32：首帧 + 每结点三帧 + 收尾帧）`);
    ok(frames.at(-1).done === true, '下标演示：最后一帧明确结束');
    ok(frames.at(-1).counts.leaves === 5, `下标演示：叶子 ${frames.at(-1).counts.leaves} 个（n=10 时下标 6..10）`);
    // 第 2 帧应是 i=1 的 PARENT 帧，说明根没有父
    ok(frames[1].line === 2 && /PARENT\(1\)/.test(frames[1].note), '下标演示：i=1 的第一帧讲 PARENT(1)=0');
  }

  // ---- 9b MAX-HEAPIFY ----
  // ★ 书里的前提必须照抄：MAX-HEAPIFY(A, i) 只保证「当 LEFT(i) 与 RIGHT(i) 各自已经是
  //   最大堆时」，以 i 为根的子树被修成最大堆。对**任意**数组调用一次并不保证整棵子树
  //   都合规（孩子那边的堆可能本来就是坏的）—— 所以这里的用例先把数组建成最大堆，
  //   再把 A[i] 改小制造一处违规，与 Figure 6.2 的情形完全一致。
  {
    let allOk = true, checked = 0;
    for (let t = 0; t < 30; t++) {
      const raw = lcg(t + 3, 2 + (t % 12)).map((v) => (v % 90) + 1);
      const heap = [...buildMaxHeap(raw)].at(-1).array;
      for (let i = 1; i <= heap.length; i++) {
        const broken = heap.slice();
        // 把 A[i] 改到比全体都小 —— 制造唯一的违规点（孩子各自仍是最大堆）
        broken[i - 1] = Math.min(...heap) - 1000;
        const last = [...maxHeapify(broken, i)].at(-1);
        checked++;
        if (!subtreeOk(last.array, i)) allOk = false;
        if (!sameBag(last.array, broken)) allOk = false;
      }
    }
    ok(allOk, `MAX-HEAPIFY：${checked} 组「已建好的堆 + 一处违规」调用后子树恢复为最大堆，且元素集合不变`);
    // 任意输入：即使修不好整棵子树，也绝不能丢元素或改值
    {
      let bagOk = true;
      for (let t = 0; t < 40; t++) {
        const a = lcg(t + 7, 1 + (t % 10)).map((v) => (v % 55) + 1);
        const last = [...maxHeapify(a, 1)].at(-1);
        if (!sameBag(last.array, a)) bagOk = false;
      }
      ok(bagOk, 'MAX-HEAPIFY：40 组随机输入下元素集合始终不变（只搬动、不丢不造）');
    }
    // 原书 Figure 6.2：A[2] = 4 违反性质，修正后 A[2] = 14
    {
      const f62 = [16, 4, 10, 14, 7, 9, 3, 2, 8, 1];
      const last = [...maxHeapify(f62, 2)].at(-1);
      ok(last.array[1] === 14 && isMaxHeap(last.array),
        `Figure 6.2：MAX-HEAPIFY(A,2) 之后 A[2] = ${last.array[1]}（期望 14），全数组成为最大堆`);
    }
    // 叶子结点：一次比较都不该发生
    {
      const a = [16, 14, 10, 8, 7, 9, 3];
      const last = [...maxHeapify(a, 7)].at(-1);
      // 叶子调用会产生 1 帧(行1) + 1 帧(行2) + 行3 叶子帧 + 行5 帧 + 最后收尾
      ok(last.counts.cmp === 0, `MAX-HEAPIFY(A, 7)（下标 7 是叶子）比较 0 次，实测 ${last.counts.cmp}`);
    }
    // 路径长度：MAX-HEAPIFY 的交换次数不超过树高 ⌊lg n⌋
    {
      let bound = true;
      for (let t = 0; t < 60; t++) {
        const a = lcg(t + 11, 1 + (t % 16)).map((v) => v % 100);
        const last = [...maxHeapify(a, 1)].at(-1);
        const h = a.length <= 1 ? 0 : Math.floor(Math.log2(a.length));
        if (last.counts.move > h) bound = false;
      }
      ok(bound, 'MAX-HEAPIFY：60 组输入的交换次数都不超过树高 ⌊lg n⌋ —— 这正是 O(lg n) 的来源');
    }
  }

  // ---- 9c BUILD-MAX-HEAP：结果必须是合法的最大堆 ----
  {
    let allOk = true, checked = 0;
    for (let t = 0; t < 60; t++) {
      const a = lcg(t + 5, (t % 20) + 1).map((v) => v % 80);
      const last = [...buildMaxHeap(a)].at(-1);
      checked++;
      if (!isMaxHeap(last.array)) allOk = false;
      if (!sameBag(last.array, a)) allOk = false;
    }
    ok(allOk, `BUILD-MAX-HEAP：${checked} 组输入的结果都是合法最大堆且元素集合不变`);
    ok([...buildMaxHeap([])].at(-1).done === true, 'BUILD-MAX-HEAP：空数组直接结束');
    // Figure 6.1 的数组本来就是最大堆，建堆后不应发生任何交换
    {
      const last = [...buildMaxHeap([16, 14, 10, 8, 7, 9, 3, 2, 4, 1])].at(-1);
      ok(last.counts.move === 0, `已经是最大堆的输入：建堆交换 ${last.counts.move} 次（期望 0）`);
    }
  }

  // ---- 9d HEAPSORT：排好序 + 是原数组的重排 ----
  {
    let allOk = true, checked = 0;
    for (let t = 0; t < 60; t++) {
      const a = lcg(t + 13, (t % 18) + 1).map((v) => (v % 60) - 20); // 含负数
      const last = [...heapsort(a)].at(-1);
      checked++;
      if (!isSorted(last.array)) allOk = false;
      if (!sameBag(last.array, a)) allOk = false;
    }
    ok(allOk, `HEAPSORT：${checked} 组输入（含负数）结果都有序且元素集合不变`);
    // 与插入排序/归并排序对照
    let agree = true;
    for (const a of cases) {
      const h = [...heapsort(a)].at(-1).array;
      if (JSON.stringify(h) !== JSON.stringify(sorted(a))) agree = false;
    }
    ok(agree, 'HEAPSORT：与 Array.sort 在全部标准用例上结果一致');
    // 逆序输入下也不该少于 O(n lg n)：粗略下界用 n·lg n / 4
    {
      const n = 32;
      const rev = Array.from({ length: n }, (_, i) => n - i);
      const last = [...heapsort(rev)].at(-1);
      ok(last.counts.cmp >= (n * Math.log2(n)) / 4,
        `HEAPSORT：n=32 逆序输入比较 ${last.counts.cmp} 次，不低于 n lg n / 4 = ${((n * Math.log2(n)) / 4).toFixed(0)}`);
    }
  }

  // ---- 9e EXTRACT-MAX：取出最大值，剩下的仍是最大堆 ----
  {
    let allOk = true, checked = 0;
    for (let t = 0; t < 40; t++) {
      const raw = lcg(t + 17, 1 + (t % 15)).map((v) => v % 70);
      const heap = [...buildMaxHeap(raw)].at(-1).array;
      const last = [...heapExtractMax(heap)].at(-1);
      checked++;
      const expectedMax = Math.max(...heap);
      // 最后一帧：返回的 max 应该出现在堆外区域的末尾
      if (last.array[last.array.length - 1] !== expectedMax) allOk = false;
      if (!isMaxHeap(last.array, heap.length - 1)) allOk = false;
    }
    ok(allOk, `EXTRACT-MAX：${checked} 组都取出了最大值，且剩下的 A[1 : heap-size] 仍是最大堆`);
    ok([...heapExtractMax([])].at(-1).invariantHolds === false,
      'EXTRACT-MAX：空堆时报 heap underflow（invariantHolds = false）');
  }

  // ---- 9f INCREASE-KEY：变大之后仍是最大堆；变小必须报错 ----
  {
    let allOk = true, checked = 0;
    for (let t = 0; t < 40; t++) {
      const raw = lcg(t + 19, 2 + (t % 14)).map((v) => v % 50);
      const heap = [...buildMaxHeap(raw)].at(-1).array;
      const i = 1 + (t % heap.length);
      const bigger = heap[i - 1] + 5;
      const last = [...heapIncreaseKey(heap, i, bigger)].at(-1);
      checked++;
      if (!isMaxHeap(last.array)) allOk = false;
      if (last.array.indexOf(bigger) < 0) allOk = false;
    }
    ok(allOk, `INCREASE-KEY：${checked} 组把某个键调大后，结果仍是合法最大堆`);
    // 键变小：必须在第 2 行报错、不改动数组
    {
      const heap = [...buildMaxHeap([16, 14, 10, 8, 7, 9, 3, 2, 4, 1])].at(-1).array;
      const last = [...heapIncreaseKey(heap, 5, 0)].at(-1);
      ok(last.line === 2 && last.invariantHolds === false && JSON.stringify(last.array) === JSON.stringify(heap),
        'INCREASE-KEY：新键更小时在第 2 行报错，数组原样不动');
    }
    // 路径上浮：交换次数不超过树高
    {
      let bound = true;
      for (let t = 0; t < 40; t++) {
        const raw = lcg(t + 23, 4 + (t % 12)).map((v) => v % 40);
        const heap = [...buildMaxHeap(raw)].at(-1).array;
        const last = [...heapIncreaseKey(heap, heap.length, 9999)].at(-1);
        const h = Math.floor(Math.log2(heap.length));
        if (last.counts.move > h + 1) bound = false;
      }
      ok(bound, 'INCREASE-KEY：40 组「把最后一个键抬到最大」的交换次数不超过树高 + 1');
    }
  }

  // ---- 9g INSERT：插入后元素多一个，且仍是最大堆 ----
  {
    let allOk = true, checked = 0;
    for (let t = 0; t < 40; t++) {
      const raw = lcg(t + 29, 1 + (t % 14)).map((v) => v % 45);
      const heap = [...buildMaxHeap(raw)].at(-1).array;
      const key = (t * 7) % 60;
      const last = [...heapInsert(heap, key, heap.length + 1)].at(-1);
      checked++;
      if (last.array.length !== heap.length + 1) allOk = false;
      if (!isMaxHeap(last.array)) allOk = false;
      if (last.array.indexOf(key) < 0) allOk = false;
      if (!sameBag(last.array, [...heap, key])) allOk = false;
    }
    ok(allOk, `INSERT：${checked} 组插入后长度 +1、仍是合法最大堆、元素集合正确`);
    // 溢出：容量已满必须在第 2 行报错
    {
      const heap = [...buildMaxHeap([16, 14, 10, 8, 7])].at(-1).array;
      const last = [...heapInsert(heap, 5, heap.length)].at(-1);
      ok(last.line === 2 && last.invariantHolds === false, 'INSERT：容量已满时报 heap overflow');
    }
    // 与原书 BUILD-MAX-HEAP′（习题 6-1）等价：逐个插入也能建出最小最大堆（可能不同但合法）
    {
      let allOk = true;
      for (let t = 0; t < 30; t++) {
        const raw = lcg(t + 31, 1 + (t % 12)).map((v) => v % 40);
        let heap = [];
        for (const v of raw) heap = [...heapInsert(heap, v, raw.length)].at(-1).array;
        if (!isMaxHeap(heap) || !sameBag(heap, raw)) allOk = false;
      }
      ok(allOk, 'INSERT：反复插入 30 组数据都建出合法的最大堆（习题 6-1 的 BUILD-MAX-HEAP′）');
    }
  }
}

console.log('\n[10] RANDOMLY-PERMUTE（原书 5.3）：既是合法排列，也是均匀随机的');
{
  // 与生成器内部同一套 PRNG，用来在测试里实现「错误版本的洗牌」做对照
  const makeRand = (seed) => {
    let s = (seed >>> 0) || 0x9e3779b9;
    s = (s + 0x9e3779b9) >>> 0;
    s = Math.imul(s ^ (s >>> 16), 0x21f0aaad) >>> 0;
    s = Math.imul(s ^ (s >>> 15), 0x735a2d97) >>> 0;
    s = (s ^ (s >>> 15)) >>> 0;
    if (s === 0) s = 0x9e3779b9;
    return (bound) => {
      s ^= s << 13; s >>>= 0;
      s ^= s >>> 17;
      s ^= s << 5; s >>>= 0;
      return Math.floor((s / 4294967296) * bound);
    };
  };
  /** 习题 5.3-3 的 PERMUTE-WITH-ALL：第 i 轮从 A[1 : n] 里挑，而不是从 A[i : n] 里挑。 */
  const biasedPermute = (arr, seed) => {
    const a = arr.slice();
    const rnd = makeRand(seed);
    for (let i = 1; i <= a.length; i++) {
      const j = 1 + rnd(a.length);
      const t = a[i - 1]; a[i - 1] = a[j - 1]; a[j - 1] = t;
    }
    return a;
  };
  const shuffle = (arr, seed) => [...randomlyPermute(arr, seed)].at(-1).array;

  // ---- 10a 是合法排列：长度、元素集合、互异性 ----
  {
    let allOk = true, checked = 0;
    for (let t = 0; t < 200; t++) {
      // 用互不相同的值，这样「互异性」才是有意义的断言
      const len = 1 + (t % 12);
      const a = Array.from({ length: len }, (_, i) => (t + 1) * 7 + i * 13);
      const out = shuffle(a, t + 1);
      checked++;
      if (out.length !== a.length) allOk = false;
      if (JSON.stringify([...out].sort((x, y) => x - y)) !== JSON.stringify([...a].sort((x, y) => x - y))) allOk = false;
      if (new Set(out).size !== a.length) allOk = false; // 无重复
    }
    ok(allOk, `洗牌：${checked} 组（值互不相同）结果都是原数组的一个排列`);
  }

  // ---- 10b 确定性：同种子同结果；不同种子会给出不同结果 ----
  {
    const a = [1, 2, 3, 4, 5, 6, 7, 8];
    const r1 = shuffle(a, 7).join(',');
    const r2 = shuffle(a, 7).join(',');
    ok(r1 === r2, `洗牌：同一种子（7）两次结果一致 —— ${r1}`);
    const seen = new Set();
    for (let s = 1; s <= 50; s++) seen.add(shuffle(a, s).join(','));
    ok(seen.size >= 20, `洗牌：50 个种子产生 ${seen.size} 种不同排列（说明真的在动，不是恒等）`);
  }

  // ---- 10c 均匀性：用卡方检验，而不是拍一个「偏差小于 x%」的阈值 ----
  // 阈值必须与样本量挂钩：「频率偏差 < 1%」这种写法在 N 小的时候必然通过、在 N 大的
  // 时候必然失败（因为抽样噪声本身就大于 1%）。卡方统计量的期望恰好等于自由度，
  // 所以「χ² 不超过 3 倍自由度」是一个与 N 无关的合理判据。
  {
    const N = 24000;
    const n = 4;
    const base = [10, 20, 30, 40];

    // (1) 16 个「位置×值」格子，每个的期望都是 N/n = 6000，自由度 15
    const pos = Array.from({ length: n }, () => new Map());
    // (2) 24 种完整排列，每种期望 N/24 = 1000，自由度 23
    const perms = new Map();
    for (let s = 1; s <= N; s++) {
      const out = shuffle(base, s);
      out.forEach((v, idx) => pos[idx].set(v, (pos[idx].get(v) || 0) + 1));
      const key = out.join('|');
      perms.set(key, (perms.get(key) || 0) + 1);
    }
    const exp = N / n;
    let chi2pos = 0;
    for (let idx = 0; idx < n; idx++) {
      for (const v of base) {
        const d = (pos[idx].get(v) || 0) - exp;
        chi2pos += (d * d) / exp;
      }
    }
    ok(chi2pos < 3 * (n * n - 1),
      `洗牌均匀性（位置×值）：χ² = ${chi2pos.toFixed(1)}，自由度 15，判据 < 45`);

    const exp2 = N / 24;
    let chi2perm = 0;
    for (const cnt of perms.values()) {
      const d = cnt - exp2;
      chi2perm += (d * d) / exp2;
    }
    ok(perms.size === 24 && chi2perm < 3 * 23,
      `洗牌均匀性（完整排列）：24 种排列全部出现，χ² = ${chi2perm.toFixed(1)}，自由度 23，判据 < 69`);
  }

  // ---- 10d 反例：从 A[1 : n] 里挑的版本**不是**均匀的（原书习题 5.3-3）----
  // 把「为什么必须从 A[i : n] 里挑」变成可执行的证据，而不是一句「书上说这样不对」。
  {
    const N = 24000;
    const n = 4;
    const base = [10, 20, 30, 40];
    const cntP = new Map();
    const cntB = new Map();
    for (let s = 1; s <= N; s++) {
      const a = shuffle(base, s)[0];
      const b = biasedPermute(base, s)[0];
      cntP.set(a, (cntP.get(a) || 0) + 1);
      cntB.set(b, (cntB.get(b) || 0) + 1);
    }
    const chi2 = (cnt) => {
      const e = N / n;
      let c = 0;
      for (const v of base) { const d = (cnt.get(v) || 0) - e; c += (d * d) / e; }
      return c;
    };
    const cp = chi2(cntP);
    const cb = chi2(cntB);
    ok(cb > 20 * cp && cb > 3 * (n - 1),
      `偏斜版本（习题 5.3-3）：A[1] 的 χ² = ${cb.toFixed(0)}，而正确版本只有 ${cp.toFixed(1)}`
      + `（自由度 3，判据 < 9）—— 差了两个数量级，这就是「必须从 A[i : n] 里挑」的原因`);
  }

  // ---- 10e 交换次数：最多 n 次（它本身就是 Θ(n) 的）----
  {
    const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let bound = true, nz = 0;
    for (let s = 1; s <= 200; s++) {
      const last = [...randomlyPermute(a, s)].at(-1);
      if (last.counts.move > a.length) bound = false;
      if (last.counts.move > 0) nz++;
    }
    ok(bound, '洗牌：200 个种子下有效交换次数都不超过 n（原地、Θ(n)）');
    ok(nz > 190, `洗牌：${nz}/200 个种子确实发生了交换（不是空转）`);
  }
}

console.log(`\n==== 结果：${passed} passed, ${failed} failed ====`);
process.exit(failed === 0 ? 0 : 1);
