/* =============================================================================
 * __tests-review__.mjs — 复习模式排队逻辑的自检
 *
 * 跑法：cd site && node assets/core/__tests-review__.mjs
 *
 * 钉四件（都有真实边界，且都能在 Node 里确定性地跑）：
 *   ① 题 id 解析：形态不对不能抛错（存档可能被手改过），返回 null；
 *   ② 题 id → 关卡数据：阶段号实算、题号越界与未知章都必须返回 null；
 *   ③ 排队顺序：逾期越久越先，同逾期看档位；limit 生效；解不出的记录被跳过；
 *   ④ 间隔阶梯单调递增，且档位上限与阶梯长度一致（否则 due 会算到 undefined）。
 * 不钉具体间隔数值：那是产品决定，改它不该让测试红。
 *
 * ★ 按章懒加载之后新增一层的自检：resolveLocation 只读清单（同步、零下载）
 *   就能定出阶段号与出处 —— 复习首页问「几道题到期」时靠的就是它。
 *   这层一旦退化（比如有人又改回去遍历全部章节），打开复习首页就会把全书
 *   191 个关卡文件都拉下来，而页面看上去完全正常：只能靠测试钉住。
 * ========================================================================== */

const { parseId, resolveLocation, resolveQuestion, buildQueue, sessionStats } =
  await import('./review-queue.js');
const { REVIEW_INTERVALS, REVIEW_MAX_BOX } = await import('./store.js');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra ? '  -> ' + extra : '')); }
}

/* ---------- 1 题 id 解析 ---------- */
console.log('\n[1] 题 id 解析');
ok('正常形态', JSON.stringify(parseId('ch02/s01/q3')) === JSON.stringify({ ch: 'ch02', sec: 's01', n: 3 }), JSON.stringify(parseId('ch02/s01/q3')));
ok('附录章号（大写字母）', parseId('A/s01/q1')?.ch === 'A');
ok('题号 0 不合法', parseId('ch02/s01/q0') === null);
ok('缺题号段不合法', parseId('ch02/s01') === null);
ok('空值不抛错', parseId(null) === null && parseId(undefined) === null && parseId('') === null);
ok('乱码不抛错', parseId('hello world') === null);

/* ---------- 2 只读清单定位（同步、零下载） ---------- */
console.log('\n[2] 只读清单定位（复习首页数「几道题到期」走这条路）');
const loc = resolveLocation('ch02/s01/q1');
ok('清单里能定位到章与关', !!(loc && loc.chapter && loc.level), JSON.stringify(loc && { ch: loc.chapter.ch, sec: loc.level.key }));
ok('阶段号来自清单里的阶段类型（drill 是第 9 段）', loc && loc.stageNo === 9, loc && String(loc.stageNo));
ok('路由写法 ch02 与清单键 2 视为同一章', loc && loc.chapter.ch === 2, loc && String(loc.chapter.ch));
ok('未知章返回 null', resolveLocation('chZZ/s01/q1') === null);
ok('未知关返回 null', resolveLocation('ch02/s99/q1') === null);
ok('乱码不抛错', resolveLocation('nonsense') === null);

/* ---------- 3 题 id -> 关卡数据（要按需加载该章） ---------- */
console.log('\n[3] 题 id 定位到关卡数据');
const q1 = await resolveQuestion('ch02/s01/q1');
ok('能定位到真实关卡', !!q1, '得到 ' + JSON.stringify(q1 && Object.keys(q1)));
ok('带出 1 基阶段号（drill 实际在第几段）', q1 && q1.stageNo === 9, q1 && String(q1.stageNo));
ok('带出 0 基题下标', q1 && q1.index === 0, q1 && String(q1.index));
ok('带出题干对象', q1 && !!q1.item && typeof q1.item.kind === 'string', q1 && JSON.stringify(q1.item && q1.item.kind));
ok('levelLabel 已含节号，不再重复拼（避免“2.1 2.1”）', q1 && /^2\.1 /.test(q1.levelLabel) && !/2\.1\s+2\.1/.test(q1.levelLabel), q1 && q1.levelLabel);
ok('题号越界返回 null', (await resolveQuestion('ch02/s01/q999')) === null);
ok('不存在的关返回 null', (await resolveQuestion('ch02/s99/q1')) === null);
ok('不存在的章返回 null', (await resolveQuestion('chZZ/s01/q1')) === null);

const second = await resolveQuestion('ch02/s01/q2');
ok('不同题号指向不同题', second && q1 && second.item.q !== q1.item.q);

// 存档里的 id 是章节模块自己的章号（'2'、'A'），不是 URL 形态（'ch02'）——
// 两种写法都必须能查到，否则「能点开的链接」与「存下来的记录」会各认一半。
const native = await resolveQuestion('2/s01/q1');
ok('存档形态（2/s01/q1）也能定位', !!native, JSON.stringify(native && native.levelLabel));
ok('两种写法指向同一道题', native && q1 && native.item.q === q1.item.q);
ok('附录存档形态（A/s01/q1）能定位', !!(await resolveQuestion('A/s01/q1')));

/* ---------- 4 排队顺序 ---------- */
console.log('\n[4] 排队顺序（逾期优先，再看档位）');
const NOW = 1_800_000_000_000;
const mk = (id, box, overdueMin) => ({ id, box, due: NOW - overdueMin * 60000 });
const queue = await buildQueue([
  mk('ch02/s01/q1', 1, 5),     // 逾期 5 分钟
  mk('ch02/s01/q2', 5, 60),    // 逾期 60 分钟（最久）
  mk('ch02/s01/q3', 1, 60),    // 同样 60 分钟，档位更低
  mk('chZZ/s99/q9', 1, 999),   // 定位不到，应被跳过
], NOW);
ok('解不出的记录被跳过', queue.length === 3, '得到 ' + queue.length);
ok('逾期最久的排最前', queue[0].id === 'ch02/s01/q3' || queue[0].id === 'ch02/s01/q2', queue.map((r) => r.id).join(','));
ok('同为逾期 60 分钟时低档位先问', queue[0].id === 'ch02/s01/q3' && queue[1].id === 'ch02/s01/q2',
   queue.map((r) => r.id + ':box' + r.box).join(','));
ok('逾期最短的排最后', queue[2].id === 'ch02/s01/q1', queue[2].id);
ok('overdue 是正数毫秒', queue.every((r) => r.overdue >= 0), JSON.stringify(queue.map((r) => r.overdue)));
ok('limit 生效', (await buildQueue([mk('ch02/s01/q1', 1, 5), mk('ch02/s01/q2', 1, 60)], NOW, 1)).length === 1);
ok('limit 为 0/负数时不截断', (await buildQueue([mk('ch02/s01/q1', 1, 5)], NOW, 0)).length === 1);
ok('空 / 非法记录不抛错', (await buildQueue(null, NOW)).length === 0 && (await buildQueue([null, {}, { id: 'x' }], NOW)).length === 0);

/* ---------- 5 间隔阶梯 ---------- */
console.log('\n[5] 间隔阶梯');
ok('阶梯非空', REVIEW_INTERVALS.length > 0, String(REVIEW_INTERVALS.length));
ok('严格递增（越记越久）', REVIEW_INTERVALS.every((v, i) => i === 0 || v > REVIEW_INTERVALS[i - 1]), JSON.stringify(REVIEW_INTERVALS));
ok('全为正数', REVIEW_INTERVALS.every((v) => v > 0));
ok('档位上限等于阶梯长度（否则 due 会算到 undefined）', REVIEW_MAX_BOX === REVIEW_INTERVALS.length,
   REVIEW_MAX_BOX + ' vs ' + REVIEW_INTERVALS.length);

/* ---------- 6 会话统计 ---------- */
console.log('\n[6] 会话统计');
const stats = sessionStats(queue);
ok('总数正确', stats.total === 3, String(stats.total));
ok('低档题（档 <= 2）计数正确', stats.weak === 2, String(stats.weak));
ok('空队列不报错', sessionStats([]).total === 0 && sessionStats(null).total === 0);

const tail = '\n==== 结果：' + pass + ' passed, ' + fail + ' failed ====\n';
console.log(tail);
process.exit(fail ? 1 : 0);
