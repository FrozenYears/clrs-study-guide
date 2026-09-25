/* =============================================================================
 * __tests-pseudocode__.mjs — 伪代码速查聚合逻辑的自检
 *
 * 跑法：cd site && node assets/ui/__tests-pseudocode__.mjs
 *
 * 钉三件（都踩过或会踩）：
 *   ① stage.more 必须一起收 —— 2.3 的 MERGE 有 27 行，只读 stage 会让速查表少一半内容
 *      （第 39 轮实测：60 关是一关两段以上）；
 *   ② 没有 lines 的段不收 —— 原书本来就没有伪代码框的关（如 1.1）不该在速查表里占位；
 *   ③ 显示名有三级回退（algo → signature → 节号），不能出现空名字。
 * 不钉「共 207 段」这类数字：那是内容量，每校订一处就变。
 * ========================================================================== */

const { collectListings, groupListings, listingName } = await import('./pseudocode-view.js');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra ? '  -> ' + extra : '')); }
}

/* ---------- 1 分组顺序（与目录一致） ---------- */
console.log('\n[1] 章序：正文按数值、附录收尾');
const fake = [
  { ch: '13', chLabel: '第 13 章', sec: 's01', section: '13.1' },
  { ch: '2', chLabel: '第 2 章', sec: 's01', section: '2.1' },
  { ch: 'C', chLabel: '附录 C', sec: 's01', section: 'C.1' },
  { ch: '2', chLabel: '第 2 章', sec: 's03', section: '2.3' },
];
const groups = groupListings(fake);
ok('正文按数值排（2 在 13 之前）', groups[0].key === '2' && groups[1].key === '13', groups.map((g) => g.key).join(','));
ok('附录排在全部正文之后', groups[2].key === 'C', groups.map((g) => g.key).join(','));
ok('同章合并成一组', groups[0].items.length === 2, String(groups[0].items.length));
ok('组内保持输入顺序（书里的顺序）', groups[0].items[0].section === '2.1' && groups[0].items[1].section === '2.3',
   groups[0].items.map((i) => i.section).join(','));

/* ---------- 2 显示名三级回退 ---------- */
console.log('\n[2] 显示名回退链');
ok('有 algo 用 algo', listingName({ algo: 'HEAPSORT', signature: 'HEAPSORT(A, n)', section: '6.4' }) === 'HEAPSORT');
ok('无 algo 用 signature', listingName({ algo: '', signature: 'EXPECTED-HIRES(n)', section: '5.2' }) === 'EXPECTED-HIRES(n)');
ok('两样都没有退回节号', listingName({ algo: '', signature: '', section: '1.1' }) === '1.1 伪代码');

/* ---------- 3 全站取数 ---------- */
console.log('\n[3] 全站取数');
const all = await collectListings();
ok('取到伪代码段（不是空数组）', all.length > 0, String(all.length));
const noLines = all.filter((x) => !(x.lines > 0));
ok('每段都有行数（无 lines 的段不收）', noLines.length === 0, noLines.length + ' 段行数为 0');
const noName = all.filter((x) => !listingName(x));
ok('每段都有显示名', noName.length === 0, noName.length + ' 段无名');
const noPage = all.filter((x) => x.page == null);
ok('每段都有印刷页（R1 可溯源）', noPage.length === 0, noPage.length + ' 段缺页码');
const noSec = all.filter((x) => !x.sec || !x.section);
ok('每段都能定位到关', noSec.length === 0, noSec.length + ' 段缺节号');

/* ---------- 4 stage.more 确实被收 ---------- */
console.log('\n[4] stage.more 里的辅助过程也要收');
const byLevel = new Map();
for (const it of all) {
  const k = it.ch + '/' + it.sec;
  byLevel.set(k, (byLevel.get(k) || 0) + 1);
}
const multi = [...byLevel.entries()].filter(([, v]) => v > 1);
ok('存在一节多段的关（说明 more 被读到了）', multi.length > 0, multi.length + ' 关');
const merge = all.find((x) => x.signature === 'MERGE(A, p, q, r)');
ok('2.3 的 MERGE 在列表里（它写在 more 里）', !!merge, merge ? merge.section : '未找到');
ok('MERGE 挂在 2.3 这一关下', merge && merge.section === '2.3' && merge.ch === 2,
   merge ? merge.ch + '/' + merge.sec : 'n/a');

const tail = '\n==== 结果：' + pass + ' passed, ' + fail + ' failed ====\n';
console.log(tail);
process.exit(fail ? 1 : 0);
