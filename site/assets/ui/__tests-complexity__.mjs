/* =============================================================================
 * __tests-complexity__.mjs — 复杂度对照表聚合逻辑的自检
 *
 * 跑法：cd site && node assets/ui/__tests-complexity__.mjs
 *
 * 钉三件（都有真实边界）：
 *   ① 章序：正文按章号数值排（2 在 13 之前），附录排在全部正文之后；
 *   ② 分组：按章归并，且组内保持关卡注册顺序（即书里的顺序，不另排序）；
 *   ③ 全站取数：每条结论都带公式、节号与印刷页 —— 缺页码会让「出处」一栏空掉，
 *      等于把 R2 的可溯源要求放空了。
 * 不钉「共 566 条」这类数字：那是内容量，每校订一处就变。
 * ========================================================================== */

const { collectClaims, groupClaims } = await import('./complexity-view.js');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra ? '  -> ' + extra : '')); }
}

/* ---------- 1 分组顺序 ---------- */
console.log('\n[1] 章序：正文按数值、附录收尾');
const fake = [
  { ch: '13', chLabel: '第 13 章', sec: 's01', section: '13.1', expr: 'O(1)', when: 'a' },
  { ch: '2', chLabel: '第 2 章', sec: 's01', section: '2.1', expr: 'O(n)', when: 'b' },
  { ch: 'A', chLabel: '附录 A', sec: 's01', section: 'A.1', expr: 'O(n^2)', when: 'c' },
  { ch: '2', chLabel: '第 2 章', sec: 's03', section: '2.3', expr: 'O(n lg n)', when: 'd' },
];
const groups = groupClaims(fake);
ok('正文按数值排（2 在 13 之前）', groups[0].key === '2' && groups[1].key === '13', groups.map((g) => g.key).join(','));
ok('附录排在全部正文之后', groups[2].key === 'A', groups.map((g) => g.key).join(','));
ok('同一章合并成一组', groups[0].items.length === 2, '得到 ' + groups[0].items.length + ' 条');
ok('组内保持输入顺序（书里的顺序）', groups[0].items[0].when === 'b' && groups[0].items[1].when === 'd',
   groups[0].items.map((i) => i.when).join(','));
ok('章标题跟着分组走', groups[0].chLabel === '第 2 章', groups[0].chLabel);

/* ---------- 2 两位章号不被字典序误导 ---------- */
console.log('\n[2] 章号补零：21 与 3 同时出现时仍按数值排');
const two = groupClaims([
  { ch: '21', chLabel: '第 21 章', sec: 's01', section: '21.1', expr: 'x', when: 'w' },
  { ch: '3', chLabel: '第 3 章', sec: 's01', section: '3.1', expr: 'y', when: 'w' },
]);
ok('3 在 21 之前', two[0].key === '3' && two[1].key === '21', two.map((g) => g.key).join(','));

/* ---------- 3 全站取数 ---------- */
console.log('\n[3] 全站取数：可溯源字段齐全');
const all = await collectClaims();
ok('取到结论（不是空数组）', all.length > 0, '得到 ' + all.length + ' 条');
const missingExpr = all.filter((c) => !c.expr);
ok('每条都有公式', missingExpr.length === 0, missingExpr.length + ' 条缺公式');
const missingPage = all.filter((c) => c.page == null);
ok('每条都有印刷页（R2 可溯源）', missingPage.length === 0,
   missingPage.length + ' 条缺页码，例如 ' + JSON.stringify(missingPage.slice(0, 3).map((c) => c.section)));
const missingSec = all.filter((c) => !c.sec || !c.section);
ok('每条都能定位到关（节号 + key）', missingSec.length === 0, missingSec.length + ' 条缺节号');
const chaptersWithClaims = new Set(all.map((c) => String(c.ch)));
ok('覆盖的章数等于注册表章数（全书每章都有结论）',
   chaptersWithClaims.size === (await import('../chapters.js')).chapterCount(),
   chaptersWithClaims.size + ' 章有结论');
const inst = all.filter((c) => c.source === 'instructor');
ok('「本站补充」标记被保留下来（不能混成原书结论）', inst.length > 0 && inst.every((c) => c.source === 'instructor'),
   inst.length + ' 条');
ok('原书结论标 source=book', all.filter((c) => c.source === 'book').length > 0);

const tail = '\n==== 结果：' + pass + ' passed, ' + fail + ' failed ====\n';
console.log(tail);
process.exit(fail ? 1 : 0);
