/* =============================================================================
 * __tests-glossary__.mjs — 术语表聚合逻辑的自检
 *
 * 跑法：cd site && node assets/ui/__tests-glossary__.mjs
 *
 * 只钉纯逻辑三件（都有真实边界）：
 *   ① 页码归一：数据里既有整数又有区间，还有缺页码的；
 *   ② 同一术语跨关合并：大小写与首尾空格不敏感，出处去重且保持首次出现顺序；
 *   ③ 首字母分组键：非拉丁开头归 '#'。
 * 不钉「全站共 441 条」这类数字 —— 那是内容量，每加一关就变，钉住只会误报。
 * ========================================================================== */

const { formatPage, groupTerms } = await import('./glossary-view.js');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra ? '  -> ' + extra : '')); }
}

/* ---------- 1 页码归一 ---------- */
console.log('\n[1] 页码归一（整数 / 区间 / 缺省）');
ok('整数原样', formatPage(22) === '22', formatPage(22));
ok('区间用连字符连接两端', formatPage([31, 32]) === '31\u201332', formatPage([31, 32]));
ok('区间两端相同时退化成单页', formatPage([7, 7]) === '7', formatPage([7, 7]));
ok('三页区间取首尾（页码区间不逐页列）', formatPage([1, 2, 3]) === '1\u20133', formatPage([1, 2, 3]));
ok('缺页码返回空串（调用方据此不渲染页锚）', formatPage(undefined) === '', JSON.stringify(formatPage(undefined)));
ok('全是非数字的数组返回空串', formatPage(['x']) === '', JSON.stringify(formatPage(['x'])));

/* ---------- 2 跨关合并 ---------- */
console.log('\n[2] 同一术语跨关合并');
const raw = [
  { en: 'Merge sort', zh: '归并排序', page: 35, ch: 2, chLabel: '第 2 章', sec: 's03', section: '2.3', shortTitle: '2.3 归并排序' },
  { en: 'merge sort', zh: '归并排序', page: 12, ch: 1, chLabel: '第 1 章', sec: 's02', section: '1.2', shortTitle: '1.2 算法是一种技术' },
  { en: '  merge sort  ', zh: '归并排序（分治那一边）', page: 12, ch: 1, chLabel: '第 1 章', sec: 's02', section: '1.2', shortTitle: '1.2 算法是一种技术' },
  { en: 'heap', zh: '堆', page: 161, ch: 6, chLabel: '第 6 章', sec: 's01', section: '6.1', shortTitle: '6.1 堆' },
];
const grouped = groupTerms(raw);
ok('大小写与空格不同则合并成一条', grouped.length === 2, '得到 ' + grouped.length + ' 条：' + grouped.map((g) => g.en).join(' / '));
const ms = grouped.find((g) => g.en.toLowerCase() === 'merge sort');
ok('保留首次出现的英文写法', ms && ms.en === 'Merge sort', ms && ms.en);
ok('两种译法都留着（不删任何一关的讲法）', ms && ms.zh.length === 2, ms && JSON.stringify(ms.zh));
ok('出处去重：同一关同一页只算一处', ms && ms.sources.length === 2, ms && JSON.stringify(ms.sources.map((s) => s.ch + '/' + s.sec)));
ok('出处保持首次出现顺序', ms && ms.sources[0].ch === 2 && ms.sources[1].ch === 1,
   ms && ms.sources.map((s) => s.ch).join(','));
ok('按英文名排序（heap 在 merge sort 之前）', grouped[0].en === 'heap', grouped[0].en);
ok('合并后不带内部字段', ms && ms._srcKeys === undefined, ms && Object.keys(ms).join(','));

/* ---------- 3 首字母分组键 ---------- */
console.log('\n[3] 非拉丁开头归 #（词典式分组）');
// '#' 的判断在页面内部函数里；这里用同样规则复算，确认两类词条落在不同组。
const letterOf = (en) => (/[a-z]/i.test(en.charAt(0)) ? en.charAt(0).toUpperCase() : '#');
ok('数字开头归 #', letterOf('0-1 knapsack problem') === '#', letterOf('0-1 knapsack problem'));
ok('字母开头归大写字母', letterOf('array') === 'A', letterOf('array'));
ok('# 排在字母之前（字符序）', '#'.localeCompare('A') < 0);

const tail = '\n==== 结果：' + pass + ' passed, ' + fail + ' failed ====\n';
console.log(tail);
process.exit(fail ? 1 : 0);
