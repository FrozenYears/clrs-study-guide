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
  ok('未知语言按 C 处理且不报错', textOf(highlight('int x;', 'brainfuck')) === 'int x;');
  ok('null 输入返回空', highlight(null).length === 0 || textOf(highlight(null)) === '');
}

console.log(`\n==== 结果：${pass} passed, ${fail} failed ====`);
if (fail) process.exit(1);
