// __tests__.mjs — 算法驱动断言测试（node 直接跑：node __tests__.mjs）
// 校验：排序正确性、插入排序最坏比较次数、归并排序比较次数落界。

import { insertionSort } from './insertion-sort.js';
import { mergeSort } from './merge-sort.js';
import { merge } from './merge.js';
import { strassenDemo } from './strassen-demo.js';
import { matrixMultiplyDemo } from './matrix-multiply-demo.js';
import { hireAssistant } from './hire-assistant.js';

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

console.log(`\n==== 结果：${passed} passed, ${failed} failed ====`);
process.exit(failed === 0 ? 0 : 1);
