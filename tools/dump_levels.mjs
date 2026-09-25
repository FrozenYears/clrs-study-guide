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
// 位置参数第 1 个是 _levels.json 的落点；--check 是开关，不会被当成路径。
const OUT = (process.argv[2] && !process.argv[2].startsWith('--'))
  ? process.argv[2]
  : path.join(ROOT, 'tools', '_levels.json');
const MANIFEST_OUT = path.join(ROOT, 'site', 'assets', 'data', 'manifest.js');

/** JSON.stringify 的键名/短字符串要包成 JS 字符串字面量。 */
function jsStr(s) {
  return JSON.stringify(String(s));
}

const chapters = [];
const problems = [];
/** 与 chapters 同时收集：只留「首页画目录 / 聚合页做全量扫描」需要的字段，
 *  不含 stages 正文。写成 site/assets/data/manifest.js，是站点延迟加载章节的唯一入口。 */
const manifest = [];

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
  manifest.push({
    ch: ch.ch,
    chSpan: ch.chSpan || null,
    slug,
    title: ch.title,
    titleZh: ch.titleZh,
    source: ch.source || null,
    levels: (ch.levels || []).map((l) => ({
      key: l.key,
      id: l.id,
      section: l.section,
      title: l.title,
      // shortTitle 里已含节号（'2.1 插入排序'），页面直接显示，不再拼一次。
      shortTitle: l.shortTitle || null,
      titleEn: l.titleEn || null,
      source: l.source || null,
      sourceNote: l.sourceNote || null,
      prerequisites: l.prerequisites || [],
      // 只留阶段类型名（'map' / 'intuition' / …）：聚合页要按类型找段，
      // 但阶段正文（lines / items / claims）只有真正打开那一关时才需要。
      stages: (l.stages || []).map((s) => s.type),
    })),
  });

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

/* ---------------- 章节清单（站点延迟加载的入口） ----------------
 * 为什么必须生成、不能手写：手写一份「章号 -> 展示名 / 关卡标题」的清单，
 *   就等于把 chapters/ 下的内容抄了第二遍；加一关忘改一处，首页的关卡数、
 *   目录的节标题就会各说各话。这份清单与 _levels.json 同源，同一次运行产出。
 * 生成物是**版本库里的** JS 模块（零构建 + 可能 file:// 打开，运行时 fetch 会被拦）。
 */
const manifestJs =
  "/* =============================================================================\n" +
  " * data/manifest.js —— 全书章节清单（由 tools/dump_levels.mjs 生成，不要手改）\n" +
  " *\n" +
  " * 站点的「按章懒加载」全靠这份清单：首页画目录、聚合页（术语表 / 复杂度 /\n" +
  " *   伪代码 / 算法选择器）做全量扫描，都只需要标题、节号、页码与阶段类型；\n" +
  " *   阶段正文（原文引述、伪代码行、题目）几百 KB，只有真正打开那一关时才\n" +
  " *   动态 import 对应的 chapter.js。\n" +
  " *\n" +
  " * 每个条目里的 slug 就是 site/chapters/<slug>/chapter.js 的目录名；\n" +
  " *   拼 import 说明符的地方只有 assets/chapters.js 一处（不要在这里存路径）。\n" +
  " * 重新生成：node tools/dump_levels.mjs\n" +
  " * ========================================================================== */\n" +
  "\nexport const MANIFEST = {\n" +
  manifest
    .map((m) =>
      "  " + jsStr(String(m.ch)) + ": " + JSON.stringify(m, null, 4)
        .split("\n").map((line, i) => (i === 0 ? line : "  " + line)).join("\n") + ",")
    .join("\n") +
  "\n};\n" +
  "\n/** 按章号取清单条目；没有返回 null（路由归一化在 assets/chapters.js 里做）。 */\n" +
  "export function manifestOf(ch) {\n" +
  "  return Object.prototype.hasOwnProperty.call(MANIFEST, String(ch)) ? MANIFEST[String(ch)] : null;\n" +
  "}\n" +
  "\nexport default { MANIFEST, manifestOf };\n";

if (process.argv.includes("--check")) {
  const cur = fs.existsSync(MANIFEST_OUT) ? fs.readFileSync(MANIFEST_OUT, "utf8") : null;
  if (cur !== manifestJs) {
    console.error("章节清单与 chapters/ 不一致：请跑 node tools/dump_levels.mjs 重新生成");
    process.exit(1);
  }
  console.log(`章节清单已是最新：${path.relative(ROOT, MANIFEST_OUT)}`);
} else {
  fs.mkdirSync(path.dirname(MANIFEST_OUT), { recursive: true });
  fs.writeFileSync(MANIFEST_OUT, manifestJs, "utf8");
  console.log(`章节清单 ${manifest.length} 章 -> ${path.relative(ROOT, MANIFEST_OUT)}`);
}
if (problems.length) {
  console.log('加载期问题：');
  for (const p of problems) console.log('  ' + p);
}
