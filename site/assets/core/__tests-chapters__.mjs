/* =============================================================================
 * __tests-chapters__.mjs — 「按章懒加载」的行为自检
 *
 * 跑法：cd site && node assets/core/__tests-chapters__.mjs
 *
 * 为什么值得一条常驻测试：懒加载是**性能**收益，肉眼看不出来 —— 一旦有人把
 * chapters.js 改回「静态 import 每一章」，页面照常能开，只是首页又悄悄拉下
 * 全书 191 个关卡模块、约 5.2 MB。没有任何报错、没有任何样式异常，只能靠
 * 测试把它钉住。
 *
 * 怎么做：Node 里没法给 import() 打补丁，所以把 chapters.js 的源码读出来、
 * 把 `import(` 换成假记账器再写到临时文件里求值（用完即删）。这样「下载了
 * 哪些模块」就成了可数的数字。
 * ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const CHAPTERS = path.join(HERE, '..', 'chapters.js');
const TEMP = path.join(HERE, '..', '_tmp_lazy_probe.mjs');

const downloaded = [];
globalThis.__lazyProbeImport = async (spec) => {
  downloaded.push(String(spec));
  return { default: { ch: 'FAKE', levels: [] } };
};

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra ? '  -> ' + extra : '')); }
}

const src = fs.readFileSync(CHAPTERS, 'utf8');
fs.writeFileSync(TEMP, src.replace(/import\(/g, 'globalThis.__lazyProbeImport('), 'utf8');
let mod;
try {
  mod = await import(url.pathToFileURL(TEMP).href + '?t=' + Date.now());
} finally {
  try { fs.unlinkSync(TEMP); } catch (_) {}
}

/* ---------- 1 清单层：同步、零下载 ---------- */
console.log('\n[1] 清单层（首页 / 目录只读它）');
ok('列出全部章', mod.listChapterKeys().length === 39, String(mod.listChapterKeys().length));
ok('按章号取清单条目', (mod.chapterOf('ch02') || {}).ch === 2);
ok('取清单条目不触发任何下载', downloaded.length === 0, downloaded.join(','));
ok('清单里带了每一关的标题与阶段类型', (() => {
  const lv = (mod.chapterOf('02').levels || [])[0];
  return lv && lv.shortTitle && Array.isArray(lv.stages) && lv.stages.length > 0;
})());
ok('章号混写（2 / ch02 / 02）都归一化到同一章', (() => {
  const s = new Set();
  ['2', 'ch02', '02'].forEach((k) => { const c = mod.chapterOf(k); if (c) s.add(c.ch); });
  return s.size === 1 && s.has(2);
})());
ok('未知章返回 null', mod.chapterOf('chZZ') === null);

/* ---------- 2 内容层：一关只下一章 ---------- */
console.log('\n[2] 打开一关：只下载那一章');
downloaded.length = 0;
await mod.loadChapter('ch02');
ok('恰好下载 1 个模块', downloaded.length === 1, downloaded.join(','));
ok('下的是 ch02 的 chapter.js', /ch02-getting-started\/chapter\.js$/.test(downloaded[0] || ''), downloaded[0]);

/* ---------- 3 缓存 ---------- */
console.log('\n[3] 重复加载走缓存');
downloaded.length = 0;
await mod.loadChapter('2');
await mod.loadChapter('ch02');
ok('再加载同一章不产生新下载', downloaded.length === 0, downloaded.join(','));
ok('loadedChapter 能同步取回已加载的章', !!mod.loadedChapter('ch02'));
ok('未加载过的章 loadedChapter 返回 null（不顺手去下）', mod.loadedChapter('ch07') === null);

/* ---------- 4 聚合页 ---------- */
console.log('\n[4] 聚合页：每章各下一次');
downloaded.length = 0;
const mods = await mod.loadChapters(mod.listChapterKeys());
ok('全部章都拿到了', mods.size === 39, String(mods.size));
// 第 2/3 步已经加载过 ch02 并缓存，所以这里只会新下载其余 38 章。
ok('下载数 == 还没缓存过的章数', downloaded.length === 38, String(downloaded.length));
ok('已缓存的 ch02 没有重复下载', !downloaded.some((u) => /ch02-/.test(u)));
downloaded.length = 0;
await mod.loadChapters(mod.listChapterKeys());
ok('再扫一遍不产生任何下载', downloaded.length === 0, String(downloaded.length));

const tail = '\n==== 结果：' + pass + ' passed, ' + fail + ' failed ====\n';
console.log(tail);
process.exit(fail ? 1 : 0);
