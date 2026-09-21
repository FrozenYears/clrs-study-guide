/* =============================================================================
 * __tests-highlight__.mjs — 代码语法高亮的自检
 *
 * 最重要的两条契约（都在保护既有体系）：
 *   ① 输出的可见文本必须与输入**逐字符相同** —— 关卡里的 C 代码要与 c/*.c
 *      逐字节一致（规则 8），高亮不能改变一个字符；用户复制粘贴也不能带标记。
 *   ② 不能抛异常，且任何输入都不能被「吃掉」（注释/字符串未闭合时也要原样输出）。
 * 跑法：cd site && node assets/core/__tests-highlight__.mjs
 * ========================================================================== */

// ---- 极简 DOM 桩：只需要 createElement / createTextNode ----
function mkNode(text) {
  return { nodeType: 3, textContent: text };
}
global.document = {
  createTextNode: (t) => mkNode(t),
  createElement: () => {
    const el = { nodeType: 1, className: '', textContent: '' };
    return el;
  },
};

const { highlight, supports } = await import('./highlight.js');
const fs = await import('node:fs');
const path = await import('node:path');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS', name); }
  else { fail++; console.log('  FAIL', name, extra === undefined ? '' : String(extra).slice(0, 200)); }
}
const textOf = (nodes) => nodes.map((n) => n.textContent).join('');

console.log('\n[1] 逐字符保真：把全站真实代码喂进去');
{
  const files = [];
  const cdir = path.join(process.cwd(), '..', 'c');
  for (const f of fs.readdirSync(cdir)) if (f.endsWith('.c')) files.push(path.join(cdir, f));
  ok('找到 C 程序文件', files.length > 80, files.length);
  let broken = null, n = 0;
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    n++;
    const out = textOf(highlight(src, 'c'));
    if (out !== src) { broken = [path.basename(f), src.length, out.length]; break; }
  }
  ok(`${n} 个 C 程序全部逐字符相同`, !broken, broken);
}
{
  // 关卡里内嵌的 JS（引擎代码）也走同一条路
  const dirs = path.join(process.cwd(), 'assets', 'algorithms');
  const js = fs.readdirSync(dirs).filter((f) => f.endsWith('.js'));
  let broken = null;
  for (const f of js) {
    const src = fs.readFileSync(path.join(dirs, f), 'utf8');
    if (textOf(highlight(src, 'js')) !== src) { broken = f; break; }
  }
  ok(`${js.length} 个算法生成器 JS 逐字符相同`, !broken, broken);
}

console.log('\n[2] 边界输入：未闭合、嵌套、特殊字符');
{
  const cases = [
    ['未闭合块注释', 'int x; /* 没有结束'],
    ['未闭合字符串', 'printf("abc'],
    ['字符串里有 //', 'char *s = "http://x";'],
    ['注释里有引号', '/* don\'t "quote" me */ int a;'],
    ['连续星号', 'int **pp;  /* * */ '],
    ['预处理续行', '#define A(x) \\\n  ((x)+1)'],
    ['中文注释', '// 中文注释\nint 主;'],
    ['空串', ''],
    ['只有换行', '\n\n\n'],
    ['数字各种写法', '0x1f 3.14e-2 100ULL 07 .5'],
  ];
  let bad = [];
  for (const [name, src] of cases) {
    if (textOf(highlight(src, 'c')) !== src) bad.push(name);
  }
  ok('全部边界输入逐字符保真', bad.length === 0, bad);
}

console.log('\n[3] 确实识别出了东西（防止「全当普通文本」的假通过）');
{
  const src = '#include <stdio.h>\n/* 注释 */\nint main(void) { printf("hi\\n"); return 0; }';
  const cls = highlight(src, 'c').filter((n) => n.className).map((n) => n.className);
  ok('有 pre', cls.includes('tok-pre'), cls);
  ok('有 comment', cls.includes('tok-comment'), cls);
  ok('有 keyword', cls.includes('tok-kw'), cls);
  ok('有 string', cls.includes('tok-str'), cls);
  ok('有 number', cls.includes('tok-num'), cls);
  ok('有 function call', cls.includes('tok-fn'), cls);
}

console.log('\n[4] 语言支持与兜底');
{
  ok("支持 'c'", supports('c'));
  ok("支持 'js'", supports('js'));
  ok("支持 'pseudo'", supports('pseudo'));
  ok('未知语言按 C 处理且不报错', textOf(highlight('int x;', 'brainfuck')) === 'int x;');
  ok('null 输入返回空', highlight(null).length === 0 || textOf(highlight(null)) === '');
}

/* ---------------------------- 伪代码（第 4 段） ---------------------------- */

const toks = (src, lang) =>
  highlight(src, lang).map((n) => [n.className || null, n.textContent]);
const coloredOf = (src, cls, text) =>
  toks(src, 'pseudo').some(([c, t]) => c === cls && t === text);
// 这个词有没有落到任何一个着色片段里（注释整段也算着色片段，所以只用于无注释的行）
const coloredAny = (src, w) => {
  const re = new RegExp('(^|[^A-Za-z0-9])' + w + '([^A-Za-z0-9]|$)');
  return toks(src, 'pseudo').some(([c, t]) => !!c && re.test(t));
};

console.log('\n[5] 伪代码：着色规则本身');
{
  ok('行首 for 是关键字', coloredOf('for i = 2 to n', 'tok-kw', 'for'));
  ok('缩进行的首词也算行首', coloredOf('    for j = 1 to n', 'tok-kw', 'for'));
  ok('行中的 else / return 也认',
    coloredOf('else return EUCLID(b, a mod b)', 'tok-kw', 'else')
    && coloredOf('else return EUCLID(b, a mod b)', 'tok-kw', 'return'));
  ok('NIL / TRUE / FALSE 是常量关键字', coloredOf('while x ≠ NIL', 'tok-kw', 'NIL'));
  ok('mod 运算符着色', coloredOf('return EUCLID(b, a mod b)', 'tok-kw', 'mod'));
  ok('to / and 一律不着色：伪代码记号与英文介词连词同形，词法分不开',
    !coloredAny('for i = 2 to n', 'to')
    && !coloredAny('while j > 0 and A[j] > key', 'and'));
  ok('散文句首的大写 For / If 不着色',
    !coloredAny('5. For each node, all simple paths from the node to descendant leaves contain the same number of black nodes.', 'For')
    && !coloredAny('4. If a node is red, then both its children are black.', 'If'));
  ok('散文行中间的小写 for / if 也不着色（关键字只认行首）',
    !coloredAny('    find an edge (u,v) that is safe for A', 'for')
    && !coloredAny('3. Show that if you make the greedy choice, only one subproblem remains.', 'if'));
  ok('then 不着色（全站 1193 行里它只出现在注释与散文里）',
    !coloredAny('4. If a node is red, then both its children are black.', 'then'));
  ok('MAX-HEAPIFY 这类带连字符的调用名整体成 tok-fn',
    coloredOf('    MAX-HEAPIFY(A, i, n)', 'tok-fn', 'MAX-HEAPIFY'));
  ok('函数名与括号之间有空格时不算调用（"find an edge (u,v)" 是散文）',
    !coloredAny('    find an edge (u,v) that is safe for A', 'edge'));
  ok('// 注释整行成一个 token',
    toks('    // Insert A[i] into the sorted subarray A[1 : i − 1].', 'pseudo')
      .filter(([c]) => c === 'tok-comment').length === 1);
  ok('抽取语料的 "/ /" 注释记号也当注释（原书伪代码注释在语料里就是这么写的）',
    toks('best = 0 / / candidate 0 is a least-qualified dummy candidate', 'pseudo')
      .some(([c, t]) => c === 'tok-comment' && t.startsWith('/ /')),
    toks('best = 0 / / candidate 0 is a least-qualified dummy candidate', 'pseudo'));
  ok('注释里的引号不会被劈成字符串',
    toks('else    // same as lines 3–15, but with "right" and "left" exchanged', 'pseudo')
      .every(([c]) => c !== 'tok-str'));
  ok('字符串（print "occurs with shift"）成 tok-str',
    coloredOf('            print "occurs with shift" s', 'tok-str', '"occurs with shift"'));
  ok('数字不吃句号："1. 先取两个大素数" 里的点是普通文本',
    coloredOf('    1. 先取两个大素数 p, q', 'tok-num', '1')
    && !toks('    1. 先取两个大素数 p, q', 'pseudo').some(([c, t]) => c && t.endsWith('.')),
    toks('    1. 先取两个大素数 p, q', 'pseudo'));
  ok('区间写法 P[1..m] 不会把 1.. 当成一个数字',
    !toks('        if P[1..m] == T[s+1..s+m]', 'pseudo').some(([c, t]) => c && t.includes('..')),
    toks('        if P[1..m] == T[s+1..s+m]', 'pseudo'));
  ok('减号不会被粘进词干：n-1 里的 1 仍是数字，n-1 不是 token',
    coloredOf('    for j = n-1 downto 0:', 'tok-num', '1')
    && !toks('    for j = n-1 downto 0:', 'pseudo').some(([c, t]) => c && t === 'n-1'),
    toks('    for j = n-1 downto 0:', 'pseudo'));
  ok('heap-size 是词干但不是函数调用（后面跟的是方括号）',
    coloredOf('    while heap-size[H] > 0', 'tok-kw', 'while')
    && !toks('    while heap-size[H] > 0', 'pseudo').some(([, t]) => t === 'heap-size'),
    toks('    while heap-size[H] > 0', 'pseudo'));
  ok('中文混排的伪代码行不炸',
    textOf(highlight('    若无正系数：return 无界', 'pseudo')) === '    若无正系数：return 无界'
    && coloredOf('    若无正系数：return 无界', 'tok-kw', 'return'));
  ok('C 与 JS 的既有着色不受伪代码改动影响',
    toks('#include <stdio.h>\nint main(void){return 0;}', 'c').some(([c]) => c === 'tok-pre')
    && coloredOf('for i = 2 to n', 'tok-kw', 'for')
    && toks('const x = f(1);', 'js').some(([c]) => c === 'tok-kw')
    && toks('const x = f(1);', 'js').some(([c]) => c === 'tok-fn'));
}

console.log('\n[6] 伪代码：全站关卡数据逐字符保真');
{
  // 直接从关卡模块拿真实伪代码行（不用 tools/_levels.json：它是一次性产物，可能不存在）
  const url = await import('node:url');
  const chRoot = path.join(process.cwd(), 'chapters');
  const dirs = fs.readdirSync(chRoot).filter((d) => {
    try { return fs.statSync(path.join(chRoot, d)).isDirectory(); } catch (e) { return false; }
  });
  let lines = 0, files = 0, broken = null;
  const collect = (o, sink) => {
    if (Array.isArray(o)) return o.forEach((v) => collect(v, sink));
    if (!o || typeof o !== 'object') return;
    if (typeof o.code === 'string' && o.n !== undefined) sink.push(o.code);
    Object.values(o).forEach((v) => collect(v, sink));
  };
  for (const d of dirs) {
    const cf = path.join(chRoot, d, 'chapter.js');
    if (!fs.existsSync(cf)) continue;
    let mod;
    try {
      mod = await import(url.pathToFileURL(cf).href);
    } catch (e) {
      broken = ['import 失败 ' + d, e.message];
      break;
    }
    files++;
    const sink = [];
    (mod.default?.levels || []).forEach((lv) => collect(lv.stages, sink));
    for (const src of sink) {
      lines++;
      if (textOf(highlight(src, 'pseudo')) !== src) { broken = [d, src]; break; }
    }
    if (broken) break;
  }
  ok('找到关卡模块', files >= 30, files);
  ok(`${lines} 行伪代码（含动画面板里复用的那些）全部逐字符相同`, !broken, broken);
}

console.log(`\n==== 结果：${pass} passed, ${fail} failed ====`);
if (fail) process.exit(1);

