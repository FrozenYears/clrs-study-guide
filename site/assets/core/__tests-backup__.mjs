/* =============================================================================
 * __tests-backup__.mjs — 学习数据备份（导出 / 导入 / 清空）的行为自检
 *
 * 跑法：cd site && node assets/core/__tests-backup__.mjs
 *
 * 为什么值得一条常驻测试：本机存档是用户几百小时的学习记录，而备份是它唯一的
 * 逃生口。这段逻辑里最容易悄悄坏掉的不是「导出能不能下载」，而是**合入口径** ——
 * 阶段取并集、测验分取较高、错题次数相加、设置默认不被覆盖。任何一条反了，
 * 用户不会看到报错，只会发现「导入之后少了几关」或「分数被旧备份退回去了」。
 *
 * 跑法里的坑：store.js 依赖 localStorage 与 document，Node 里都没有 ——
 * 这里补两个最小替身，不引任何依赖。
 * ========================================================================== */

/* ---------- 最小替身：localStorage / document ---------- */
const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
  clear: () => mem.clear(),
};
globalThis.document = { documentElement: { setAttribute() {}, removeAttribute() {} } };

const store = await import('./store.js');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra ? '  -> ' + extra : '')); }
}

function seed() {
  store.clearAll({ settings: false });
  store.markStage('2', 's01', 'map', true);
  store.markStage('2', 's01', 'intuition', true);
  store.setQuiz('2', 's01', 0.5);
  store.addWrong({ id: '2/s01/q1', ch: '2', sec: 's01', kind: 'judge', q: 'Q1', answer: true, picked: false });
  store.recordReview('2/s01/q1', false, 1000);
  store.markProblem('2', '2-1', true);
  store.setThemePref('dark');
}

/* ---------- 1 导出 ---------- */
console.log('\n[1] 导出：结构完整、可 JSON 往返');
seed();
ok('阶段 / 错题 / 复习 / 自评都记下了',
   store.getStageSet('2', 's01').size === 2 && store.getWrong().length === 1
   && Object.keys(store.getReviewAll()).length === 1 && store.isProblemDone('2', '2-1'));
const doc = store.exportState(1_700_000_000_000);
ok('带格式标识', doc.format === store.BACKUP_FORMAT, String(doc.format));
ok('导出时间可注入（便于确定性测试）', doc.exportedAt === new Date(1_700_000_000_000).toISOString(), doc.exportedAt);
ok('六个字段都在', ['progress', 'wrong', 'review', 'problems', 'settings', 'v'].every((k) => k in doc.state), Object.keys(doc.state).join(','));
const text = store.exportJSON(1_700_000_000_000);
ok('导出文本能被 JSON.parse 回来', JSON.parse(text).state.wrong.length === 1);
ok('导出的多行 JSON 是人可读的（不是一行压到底）', text.split('\n').length > 10, String(text.split('\n').length));

/* ---------- 2 格式校验 ---------- */
console.log('\n[2] 格式校验：坏输入要明确报错，且不写坏存档');
const notJson = store.validateBackup('{ 这不是 json');
ok('非法 JSON：ok=false 且有解释', !notJson.ok && notJson.errors[0].includes('JSON'), JSON.stringify(notJson.errors));
const wrongFormat = store.validateBackup({ format: 'other-app', state: { progress: {} } });
ok('别的应用的导出被 format 拦下', !wrongFormat.ok && wrongFormat.errors.some((e) => e.includes('format')), JSON.stringify(wrongFormat.errors));
const badTypes = store.validateBackup({ format: store.BACKUP_FORMAT, state: { progress: [], wrong: {} } });
ok('字段类型不对被拦（progress 应是对象、wrong 应是数组）', !badTypes.ok && badTypes.errors.length === 2, JSON.stringify(badTypes.errors));
ok('既无 format 也无本站字段：不像本站存档', !store.validateBackup({ foo: 1 }).ok);
ok('自己导出的必须校验通过', store.validateBackup(text).ok);
const importBad = store.importState('{ 这不是 json');
ok('导入坏文件失败，且**存档没被动过**', !importBad.ok && store.getWrong().length === 1, JSON.stringify(importBad.errors));

/* ---------- 3 清空 ---------- */
console.log('\n[3] 清空：只清学习数据，保留主题偏好');
store.clearAll({ settings: false });
ok('进度 / 错题 / 复习 / 自评全清',
   Object.keys(store.getState().progress).length === 0 && store.getWrong().length === 0
   && Object.keys(store.getReviewAll()).length === 0 && !store.isProblemDone('2', '2-1'));
ok('主题偏好保留（清了也还要用）', store.getThemePref() === 'dark', store.getThemePref());
ok('已落盘（不是只改内存）', JSON.parse(localStorage.getItem('clrs:state')).wrong.length === 0);

/* ---------- 4 合并导入 ---------- */
console.log('\n[4] 合并导入：不丢现有数据，也不被旧备份退回');
store.clearAll({ settings: false });
store.setThemePref('dark');
store.markStage('2', 's01', 'source', true);   // 本机新做的
store.setQuiz('2', 's01', 0.9);                // 本机更高的分
store.markStage('2', 's02', 'map', true);      // 备份里没有的关
store.addWrong({ id: '2/s02/q1', ch: '2', sec: 's02', kind: 'judge', q: 'Q2', answer: false, picked: true });
const merged = store.importState(text, { mode: 'merge' });
ok('导入成功', merged.ok, JSON.stringify(merged.errors));
ok('阶段取并集（本机 source + 备份 map/intuition）', store.getStageSet('2', 's01').size === 3, [...store.getStageSet('2', 's01')].join(','));
ok('测验分取较高的那次（0.9 不被 0.5 退回去）', store.getQuiz('2', 's01') === 0.9, String(store.getQuiz('2', 's01')));
ok('本机独有的关没被冲掉', store.getStageSet('2', 's02').size === 1);
ok('错题合并后两条都在', store.getWrong().length === 2, store.getWrong().map((w) => w.id).join(','));
ok('复习台账并进来', !!store.getReview('2/s01/q1'));
ok('章末自评并进来', store.isProblemDone('2', '2-1'));
ok('设置默认不被备份覆盖', store.getThemePref() === 'dark', store.getThemePref());

/* ---------- 5 替换导入 ---------- */
console.log('\n[5] 替换导入：整份采用备份，可选连设置一起换');
const replaced = store.importState(text, { mode: 'replace', overwriteSettings: true });
ok('替换成功', replaced.ok, JSON.stringify(replaced.errors));
ok('只剩备份里的进度（本机独有的 2.2 被替换掉）', Object.keys(store.getState().progress).length === 1, Object.keys(store.getState().progress).join(','));
ok('阶段就是备份里的两段', store.getStageSet('2', 's01').size === 2, [...store.getStageSet('2', 's01')].join(','));
ok('测验分回到备份值', store.getQuiz('2', 's01') === 0.5, String(store.getQuiz('2', 's01')));
ok('错题回到备份的 1 条', store.getWrong().length === 1, String(store.getWrong().length));

/* ---------- 6 错题次数累加 ---------- */
console.log('\n[6] 同一道错题：次数相加，内容取最近的那条');
store.clearAll({ settings: false });
store.addWrong({ id: '3/s01/q1', ch: '3', sec: 's01', kind: 'judge', q: 'X', times: 2, at: 10 });
// ★ addWrong 的口径：新登记的一条 times 一律从 1 起算 ——「次数」是本机这道题
//   错过几次，不是调用方随便填的数字。所以这里是 1（本机）+ 3（备份）= 4。
ok('新登记的错题 times 从 1 起算（传入的 times 被忽略）', store.getWrong()[0].times === 1, String(store.getWrong()[0].times));
store.importState(JSON.stringify({
  format: store.BACKUP_FORMAT,
  state: { wrong: [{ id: '3/s01/q1', ch: '3', sec: 's01', kind: 'judge', q: 'X', times: 3, at: 20 }] },
}), { mode: 'merge' });
const w = store.getWrong()[0];
ok('合并时次数相加（本机 1 + 备份 3 = 4）', w.times === 4, String(w.times));
ok('内容取时间较晚的那条', w.at === 20, String(w.at));

/* ---------- 7 最小备份 ---------- */
console.log('\n[7] 缺字段的最小备份也能导入（不该炸）');
ok('只有 wrong 的最小备份可导入', store.importState(JSON.stringify({ format: store.BACKUP_FORMAT, state: { wrong: [] } })).ok);
ok('空对象导入被拦', !store.importState('{}').ok);

const tail = '\n==== 结果：' + pass + ' passed, ' + fail + ' failed ====\n';
console.log(tail);
process.exit(fail ? 1 : 0);
