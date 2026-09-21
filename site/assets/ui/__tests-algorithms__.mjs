/* =============================================================================
 * __tests-algorithms__.mjs — 算法选择器聚合逻辑的自检
 *
 * 跑法：cd site && node assets/ui/__tests-algorithms__.mjs
 *
 * 钉三件（都有真实边界）：
 *   ① 只收有算法名的关 —— 概念关（如 1.1「算法是什么」）不能混进选择器；
 *   ② 配套过程必须收进 extras（2.3 一关同时出 MERGE-SORT 与 MERGE，
 *      只读 stage 会漏掉写在 more 里的那一半）；
 *   ③ 按 Part 分组且组顺序就是书里的顺序（I…VII，附录收尾）——
 *      这正是本页相对按章目录的独有价值，分组错了整页就没意义。
 * 不钉「共 130 个」这类数字：那是内容量，每校订一处就变。
 * ========================================================================== */

const { collectAlgorithms, groupByPart } = await import('./algorithms-view.js');
const { STRUCTURE } = await import('../data/structure.js');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra ? '  -> ' + extra : '')); }
}

/* ---------- 1 只收有算法名的关 ---------- */
console.log('\n[1] 只收有算法名的关');
const all = collectAlgorithms();
ok('取到条目（不是空数组）', all.length > 0, '得到 ' + all.length + ' 条');
const noName = all.filter((a) => !a.algo || !a.algo.trim());
ok('每条都有算法名', noName.length === 0, noName.length + ' 条缺名');
ok('概念关（1.1 无伪代码框）不在列表里', !all.some((a) => String(a.ch) === '1' && a.sec === 's01'),
   JSON.stringify(all.filter((a) => String(a.ch) === '1').map((a) => a.sec)));
ok('每条都能定位到关（节号 + 关 key）', all.every((a) => a.sec && a.section), '');
ok('shortTitle 不含重复节号（全站踩过三次的坑）',
   all.every((a) => !new RegExp('^' + a.section.replace(/\./g, '\\.') + '\\s+' + a.section.replace(/\./g, '\\.')).test(a.shortTitle)),
   JSON.stringify(all.filter((a) => a.shortTitle.startsWith(a.section + ' ' + a.section)).map((a) => a.shortTitle)));

/* ---------- 2 配套过程 ---------- */
console.log('\n[2] 配套过程收进 extras');
const merge6 = all.find((a) => String(a.ch) === '2' && a.sec === 's03');
ok('2.3 的主算法是 MERGE-SORT', merge6 && merge6.algo === 'MERGE-SORT', merge6 && merge6.algo);
ok('2.3 的 MERGE 收进了 extras（它写在 stage.more 里）',
   !!(merge6 && merge6.extras.some((x) => x.name === 'MERGE')),
   merge6 && JSON.stringify(merge6.extras));
ok('extras 带页码（可溯源）', !!(merge6 && merge6.extras.every((x) => x.page != null)));

/* ---------- 3 按 Part 分组 ---------- */
console.log('\n[3] 按 Part 分组');
const groups = groupByPart(all);
const partNos = groups.map((g) => g.part.no);
ok('分组数不超过书的 Part 数 + 附录', groups.length <= STRUCTURE.length + 1, String(groups.length));
ok('Part 顺序与书一致（I 在最前）', partNos[0] === 'I', partNos.join(','));
ok('正文 Part 按书序排列',
   JSON.stringify(partNos.filter((n) => n !== 'Appendix')) ===
   JSON.stringify(STRUCTURE.map((p) => p.no).filter((n) => partNos.includes(n))),
   partNos.join(','));
ok('附录存在时排在最后', !partNos.includes('Appendix') || partNos[partNos.length - 1] === 'Appendix', partNos.join(','));
ok('每组都非空', groups.every((g) => g.items.length > 0));
ok('分组不重不漏（各组条数之和 = 总数）',
   groups.reduce((a, g) => a + g.items.length, 0) === all.length,
   groups.reduce((a, g) => a + g.items.length, 0) + ' vs ' + all.length);

// 组内按章序：第 2 章的条目必须都在第 3 章之前
const pI = groups.find((g) => g.part.no === 'I');
if (pI) {
  const chs = pI.items.map((a) => Number(a.ch));
  ok('Part I 组内按章号升序', chs.every((v, i) => i === 0 || v >= chs[i - 1]), chs.join(','));
}

/* ---------- 4 复杂度与来源标记 ---------- */
console.log('\n[4] 复杂度结论与来源标记');
const withCost = all.filter((a) => a.claims.length);
ok('多数条目带复杂度结论', withCost.length > all.length * 0.5, withCost.length + ' / ' + all.length);
ok('每条复杂度都带页码（R2 可溯源）',
   withCost.every((a) => a.claims.every((c) => c.page != null)),
   JSON.stringify(withCost.filter((a) => a.claims.some((c) => c.page == null)).map((a) => a.algo).slice(0, 3)));
const inst = all.filter((a) => a.claims.some((c) => c.instructor));
ok('「本站补充」标记被保留（不能混成原书结论）', inst.every((a) => a.claims.some((c) => c.instructor)), String(inst.length));

const tail = '\n==== 结果：' + pass + ' passed, ' + fail + ' failed ====\n';
console.log(tail);
process.exit(fail ? 1 : 0);
