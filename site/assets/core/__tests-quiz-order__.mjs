/* =============================================================================
 * __tests-quiz-order__.mjs — 单选题选项乱序的自检
 *
 * 跑法：cd site && node assets/core/__tests-quiz-order__.mjs
 *
 * 钉住三件事：
 *   ① 它是个置换：不重不漏，长度不变 —— 少一个选项、多一个选项都是事故。
 *   ② 它确定性：同一道题（题干文本相同）每次跑出来的顺序一模一样，
 *      这样「重做」不会跳变，页面检查也能复现。
 *   ③ 拿全站真实题库量一遍：正确项的展示位置不再挤在同一格。
 *      数据里 478 道单选题有 353 道的正确项写在下标 1（74%）——
 *      不洗牌的话「永远选第二个」就能得 74% 的分。
 * ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '..', '..');

const { optionOrder, displayIndexOf, hash32 } = await import('./quiz-order.js');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS', name); }
  else { fail++; console.log('  FAIL', name, extra === undefined ? '' : String(extra).slice(0, 200)); }
}

console.log('\n[1] 置换与确定性');
{
  for (const n of [0, 1, 2, 3, 4, 5, 9]) {
    const o = optionOrder('测试题干 ' + n, n);
    ok(`${n} 个选项：长度不变`, o.length === n);
    ok(`${n} 个选项：不重不漏`, new Set(o).size === n && o.every((x) => x >= 0 && x < n), o);
  }
  const a = optionOrder('同一道题', 4);
  const b = optionOrder('同一道题', 4);
  ok('同一题干两次结果相同（可复现）', JSON.stringify(a) === JSON.stringify(b), [a, b]);
  ok('题干不同则顺序不同（至少不全同）',
     JSON.stringify(a) !== JSON.stringify(optionOrder('另一道题', 4)), a);
  ok('小于 2 个选项时保持原序', JSON.stringify(optionOrder('x', 1)) === '[0]');
  const seen = new Set();
  for (let i = 0; i < 50; i++) seen.add(optionOrder('题号 ' + i, 4).join(','));
  ok('50 道题里出现多种摆法', seen.size > 8, seen.size);
  ok('hash32 稳定且为非负整数', hash32('abc') === hash32('abc') && hash32('abc') >= 0);
}

console.log('\n[2] 正确项下标的换算');
{
  const o = optionOrder('举例', 4);
  for (const ans of [0, 1, 2, 3]) {
    const pos = displayIndexOf(o, ans);
    ok(`answer=${ans} 能在乱序里找到`, pos >= 0 && o[pos] === ans, [o, pos]);
  }
  ok('answer 越界时返回 -1（交给渲染层兜底）', displayIndexOf(o, 9) === -1);
}

console.log('\n[3] 全站真实题库：正确项不再挤在同一格');
{
  const levelsPath = path.join(SITE, '..', 'tools', '_levels.json');
  ok('找到 tools/_levels.json（先跑 node tools/dump_levels.mjs）', fs.existsSync(levelsPath));
  const data = JSON.parse(fs.readFileSync(levelsPath, 'utf8'));
  const hist = [];
  let total = 0, skipped = 0;
  const orders = new Set();
  for (const ch of data.chapters) {
    for (const lv of ch.levels) {
      for (const st of lv.stages) {
        if (st.type !== 'drill') continue;
        for (const it of (st.items || [])) {
          if (it.kind !== 'single') continue;
          const n = (it.options || []).length;
          if (n < 2 || !Number.isInteger(it.answer) || it.answer < 0 || it.answer >= n) {
            skipped++;
            continue;
          }
          const o = optionOrder(it.q, n);
          orders.add(o.join(','));
          const pos = displayIndexOf(o, it.answer);
          hist[pos] = (hist[pos] || 0) + 1;
          total++;
        }
      }
    }
  }
  console.log('  单选题', total, '道，题内选项数分布导致的空位：', hist.join(' / '));
  ok('题目数对得上（不是只扫了半个站）', total > 400, total);
  ok('越界 / 缺选项的题极少', skipped <= 5, skipped);
  const maxShare = Math.max(...hist) / total;
  ok('乱序后任一位置的正确项占比 ≤ 45%', maxShare <= 0.45, maxShare.toFixed(3));
  ok('每个位置都有题落在上面（不是把偏置挪到别处）',
     hist.filter((x) => x > 0).length >= 3, hist);
  const same = new Map();
  for (const k of orders) same.set(k.split(',').length, (same.get(k.split(',').length) || 0) + 1);
  ok('四选项的题用掉了多种摆法', (same.get(4) || 0) > 10, same.get(4));
}

console.log(`\n==== 结果：${pass} passed, ${fail} failed ====`);
if (fail) process.exit(1);
