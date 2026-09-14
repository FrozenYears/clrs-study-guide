/* =============================================================================
 * dump_levels.mjs — 把全部关卡数据导成 JSON，供 04_verify_level.py 做合规检查。
 *
 * 为什么用 Node 而不是正则解析关卡文件：
 *   关卡文件是 ES Module，里面有 `+` 字符串拼接、String.raw 模板、常量引用。
 *   正则解析必然出错（本项目已经因此吃过亏）。这里直接用真正的模块加载器，
 *   拿到的就是站点运行时看到的同一份数据。
 *
 * 用法：node tools/dump_levels.mjs [输出路径]
 *   默认写 tools/_levels.json（下划线前缀，已在 .gitignore 中）
 * ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const CH_DIR = path.join(ROOT, 'site', 'chapters');
const OUT = process.argv[2] || path.join(ROOT, 'tools', '_levels.json');

const chapters = [];
const problems = [];

const dirs = fs
  .readdirSync(CH_DIR)
  .filter((d) => fs.statSync(path.join(CH_DIR, d)).isDirectory())
  .sort();

/** 关卡文件里的 `【TODO …】` 计数。骨架生成器（05_new_level.py）留下的待办标记，
 *  由检查器单独汇总——它既不是 ERROR 也不是 WARN，而是一张待办清单。
 *  关卡文件与关卡的对应关系走命名约定：<dir>/<key>-<slug>.js。 */
function todosIn(dir, key) {
  let file = null;
  try {
    file = fs.readdirSync(dir).find((f) => f.startsWith(key + '-') && f.endsWith('.js'));
  } catch (e) {
    return { file: null, todos: 0 };
  }
  if (!file) return { file: null, todos: 0 };
  const src = fs.readFileSync(path.join(dir, file), 'utf8');
  return { file, todos: (src.match(/【TODO/g) || []).length };
}

for (const slug of dirs) {
  const dir = path.join(CH_DIR, slug);
  const cf = path.join(dir, 'chapter.js');
  if (!fs.existsSync(cf)) {
    problems.push(`${slug}: 缺少 chapter.js`);
    continue;
  }
  let mod;
  try {
    mod = await import(url.pathToFileURL(cf).href);
  } catch (e) {
    problems.push(`${slug}/chapter.js 加载失败：${e.message}`);
    continue;
  }
  const ch = mod.default;
  if (!ch) {
    problems.push(`${slug}/chapter.js 没有 default 导出`);
    continue;
  }
  chapters.push({
    slug,
    ch: ch.ch,
    title: ch.title,
    titleZh: ch.titleZh,
    source: ch.source || null,
    levels: (ch.levels || []).map((l) => ({
      key: l.key,
      id: l.id,
      chapter: l.chapter,
      section: l.section,
      title: l.title,
      shortTitle: l.shortTitle,
      titleEn: l.titleEn,
      source: l.source || null,
      sourceNote: l.sourceNote || null,
      prerequisites: l.prerequisites || [],
      stages: l.stages || [],
      ...todosIn(dir, l.key),
    })),
  });
}

fs.writeFileSync(OUT, JSON.stringify({ chapters, problems }, null, 1), 'utf8');
const nLevels = chapters.reduce((a, c) => a + c.levels.length, 0);
console.log(`导出 ${chapters.length} 章 / ${nLevels} 关 -> ${path.relative(ROOT, OUT)}`);
if (problems.length) {
  console.log('加载期问题：');
  for (const p of problems) console.log('  ' + p);
}
