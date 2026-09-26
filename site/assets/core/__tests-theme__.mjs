/* =============================================================================
 * __tests-theme__.mjs — 明暗两套主题令牌的自检
 *
 * 跑法：cd site && node assets/core/__tests-theme__.mjs
 *
 * 为什么需要这条：主题有**三条**生效路径，而它们各自独立声明变量：
 *   ① 明色      —— :root（无 data-theme 属性时的默认）
 *   ② 强制暗色  —— [data-theme="dark"]
 *   ③ 跟随系统  —— @media (prefers-color-scheme: dark) 下那条 :root:not([data-theme])
 *
 * ①②是显式块，③是媒体查询块。过去踩过的坑：往 ② 加了 6 个 --tok-* 语法高亮色，
 * 却漏了 ③。结果是**默认（自动）主题下代码框几乎看不见字**：代码框底色由 ③ 换成
 * 了深色 #27272c，而 token 颜色仍是明色那套（--tok-kw #1d4e79 等），
 * 实测对比度只有 1.71:1 —— 深底深字，看起来「代码框是空的」，
 * 而且点标签页也「像没反应」（内容其实在，只是看不见）。
 *
 * 头号陷阱：默认主题是 ③ 而不是 ②。开发时把主题切到「暗色」看效果，走的是 ②，
 * 完全正常；放着不管（自动）才是大多数读者的状态，走的恰恰是漏掉的那条。
 * 无头浏览器默认 prefers-color-scheme: light，所以截图/冒烟也全都测不到。
 *
 * 因此这里钉两条**结构性**不变量（不是钉具体色值 —— 改配色不该让测试红）：
 *   A. ② 与 ③ 声明的变量集合必须**完全一致**（双向）。少一个就是某个主题下
 *      某个组件会继承到另一套主题的颜色。
 *   B. ②/③ 里出现的变量，必须在某个 :root 块里有明色基准值。否则明色下
 *      该变量未定义，组件会 fallback 到继承色或透明。
 * ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const CSS_PATH = path.resolve(HERE, '..', 'theme.css');
const CSS = fs.readFileSync(CSS_PATH, 'utf8');
const LINES = CSS.split('\n');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra === undefined ? '' : '  -> ' + String(extra).slice(0, 300))); }
}

/** 取以 pred 命中的行为起点、花括号配平到闭合的那一段。 */
function blockFrom(pred) {
  const at = LINES.findIndex(pred);
  if (at < 0) return null;
  let depth = 0;
  for (let i = at; i < LINES.length; i++) {
    depth += (LINES[i].match(/{/g) || []).length;
    depth -= (LINES[i].match(/}/g) || []).length;
    if (i > at && depth === 0) return { at, end: i, text: LINES.slice(at, i + 1).join('\n') };
  }
  return null;
}

/** 一段 CSS 里声明的自定义属性名。 */
function declaredVars(text) {
  return new Set([...text.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
}

/** 所有 :root 块声明的变量并集（明色基准值就住在这里）。 */
function rootVars() {
  const out = new Set();
  for (let i = 0; i < LINES.length; i++) {
    if (!/^:root\b/.test(LINES[i])) continue;
    let depth = 0;
    for (let j = i; j < LINES.length; j++) {
      depth += (LINES[j].match(/{/g) || []).length;
      depth -= (LINES[j].match(/}/g) || []).length;
      declaredVars(LINES[j]).forEach((v) => out.add(v));
      if (j > i && depth === 0) break;
    }
  }
  return out;
}

console.log('\n[1] 三个主题块都在');
const explicit = blockFrom((l) => l.startsWith('[data-theme="dark"]'));
const media = blockFrom((l) => l.includes('@media (prefers-color-scheme: dark)'));
ok('[data-theme="dark"] 块存在', !!explicit, explicit ? `行 ${explicit.at + 1}-${explicit.end + 1}` : '未找到');
ok('@media (prefers-color-scheme: dark) 块存在', !!media, media ? `行 ${media.at + 1}-${media.end + 1}` : '未找到');
ok(':root 明色基准存在', rootVars().size > 0, `${rootVars().size} 个变量`);

if (!explicit || !media) {
  console.log(`\n==== 结果：${pass} passed, ${fail} failed ====`);
  process.exit(1);
}

console.log('\n[2] 强制暗色 与 跟随系统暗色 的变量集合必须一致');
{
  const E = declaredVars(explicit.text);
  const M = declaredVars(media.text);
  const onlyExplicit = [...E].filter((v) => !M.has(v)).sort();
  const onlyMedia = [...M].filter((v) => !E.has(v)).sort();
  console.log(`  强制暗色 ${E.size} 个 / 跟随系统 ${M.size} 个`);
  ok('两块的变量集合完全一致（双向）', onlyExplicit.length === 0 && onlyMedia.length === 0,
     `只在强制块里: ${onlyExplicit.join(', ') || '无'} | 只在媒体块里: ${onlyMedia.join(', ') || '无'}`);
  // 语法高亮是踩过坑的那一族，单独点名，失败时一眼看出是哪类漏了
  const tokE = [...E].filter((v) => v.startsWith('--tok-')).sort();
  const tokM = [...M].filter((v) => v.startsWith('--tok-')).sort();
  ok('--tok-* 在跟随系统块里一个不少',
     tokE.length > 0 && tokE.length === tokM.length && tokE.every((v) => tokM.includes(v)),
     `强制块 ${tokE.length} 个 / 媒体块 ${tokM.length} 个`);
}

console.log('\n[3] 暗色变量必须在 :root 有明色基准');
{
  const R = rootVars();
  const E = declaredVars(explicit.text);
  const M = declaredVars(media.text);
  const missing = [...new Set([...E, ...M])].filter((v) => !R.has(v)).sort();
  ok('暗色块里没有「明色下未定义」的变量', missing.length === 0, missing.join(', '));
}

console.log('\n[4] 跟随系统的媒体查询必须排除显式选择');
{
  // 若少了 :not([data-theme=…])，读者手动选「明色」时会被系统偏好覆盖。
  const sel = LINES[media.at + 1] || '';
  ok('排除 [data-theme="light"]（手动选明色不被系统覆盖）', sel.includes('data-theme="light"'), sel.trim());
  ok('排除 [data-theme="dark"]（避免与强制块重复声明）', sel.includes('data-theme="dark"'), sel.trim());
}

console.log(`\n==== 结果：${pass} passed, ${fail} failed ====`);
if (fail) process.exit(1);
