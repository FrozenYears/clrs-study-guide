/* =============================================================================
 * chapters.js — 章节清单（同步）与章节内容（按章动态加载）
 *
 * 为什么拆成两层：
 *   原先这里把 39 个 chapter.js 全部静态 import，而每个 chapter.js 又 import
 *   它下面全部关卡文件 —— 打开首页就要把全书 191 个关卡模块、约 5.2 MB JS
 *   全部下载执行，哪怕只想看第 2 章。现在分两层：
 *     · 清单层（data/manifest.js，由 tools/dump_levels.mjs 生成）给出章号、展示名、
 *       每关的节号/标题/页码/阶段类型，约 180 KB，首页与聚合页只读它；
 *     · 内容层（chapters/<slug>/chapter.js）从几十 KB 到几百 KB，只有真正打开
 *       那一章（或复习模式要判那一关的题）时才 import()。
 *   import() 说明符必须静态可见，所以路径模式写死在下面一处；清单里只存 slug。
 *
 * 新增一章：写好 chapters/<slug>/chapter.js 后跑 node tools/dump_levels.mjs
 *   重新生成清单，站点侧其余文件都不用改。
 * ========================================================================== */

import { MANIFEST } from './data/manifest.js';

/** 章号归一化：路由给的是 'ch02' / '02' / 'a'，清单键是 '2' / 'A'。 */
function normKey(ch) {
  if (ch == null) return null;
  const s = String(ch).replace(/^ch/i, '');
  if (Object.prototype.hasOwnProperty.call(MANIFEST, s)) return s;
  const n = parseInt(s, 10);
  if (Number.isFinite(n) && Object.prototype.hasOwnProperty.call(MANIFEST, String(n))) return String(n);
  const up = s.toUpperCase();
  return Object.prototype.hasOwnProperty.call(MANIFEST, up) ? up : null;
}

/** 清单里的全部章号，顺序同 chapters/ 目录名（ch01…ch35、cha…chd）。 */
export function listChapterKeys() {
  return Object.keys(MANIFEST);
}

export function chapterCount() {
  return Object.keys(MANIFEST).length;
}

/** 章号在清单里的规范写法（'ch02' -> '2'）；不在清单里返回 null。 */
export function chapterKey(ch) {
  return normKey(ch);
}

/**
 * 按章号取清单条目（同步）：ch / chSpan / title / titleZh / levels[] / source。
 * 关卡条目里有 key / section / shortTitle / source / stages（**只有类型名**）。
 * 需要阶段正文（原文、伪代码、题目）时用 loadChapter。
 */
export function chapterOf(ch) {
  const k = normKey(ch);
  return k ? MANIFEST[k] : null;
}

/**
 * 章的展示名：正文用清单里的 chSpan（'第 2 章 · Getting Started（起步）'），
 * 附录用 '附录 A'；清单里没有时降级成 '第 N 章'。
 * 目录条目、面包屑、待建占位、术语表、复杂度表都要显示它 —— 收在这里一份，
 * 免得每个页面各拼一遍，附录与正文章号的写法迟早走样。
 */
export function chapterLabel(ch) {
  const m = chapterOf(ch);
  if (m && m.chSpan) return m.chSpan;
  const s = String(ch);
  return /^\d+$/.test(s) ? '第 ' + s + ' 章' : '附录 ' + s.toUpperCase();
}

/* ============================ 内容层 ============================ */

const _promises = new Map(); // slug -> Promise<chapter>
const _loaded = new Map();   // slug -> chapter（已加载完的，供同步查询）

/** 动态 import 的说明符是字面量前缀 —— 路径模式只此一处。 */
function importChapter(slug) {
  return import('../chapters/' + slug + '/chapter.js');
}

/**
 * 加载一章的完整内容（含全部关卡与九段正文）。同一章只加载一次，失败不缓存。
 * @returns {Promise<object|null>} chapter 模块的 default 导出；章号不存在返回 null
 */
export function loadChapter(ch) {
  const m = chapterOf(ch);
  if (!m) return Promise.resolve(null);
  if (_promises.has(m.slug)) return _promises.get(m.slug);
  const p = importChapter(m.slug)
    .then((mod) => {
      const chapter = mod.default;
      _loaded.set(m.slug, chapter);
      return chapter;
    })
    .catch((e) => {
      _promises.delete(m.slug);
      throw e;
    });
  _promises.set(m.slug, p);
  return p;
}

/** 已经加载完的章（同步）。没加载过返回 null —— 调用方必须先 await loadChapter。 */
export function loadedChapter(ch) {
  const m = chapterOf(ch);
  return m ? (_loaded.get(m.slug) || null) : null;
}

/**
 * 等若干章加载完并等齐（聚合页与复习模式一次要扫全书）。
 * @param {Iterable<string>} keys 章号，可混写 'ch02' / '2' / 'A'
 * @returns {Promise<Map<string, object>>} 规范章号 -> chapter（顺序同 listChapterKeys）
 */
export async function loadChapters(keys) {
  const wanted = new Set();
  for (const k of keys) {
    const n = normKey(k);
    if (n) wanted.add(n);
  }
  const out = new Map();
  await Promise.all([...wanted].map(async (k) => { out.set(k, await loadChapter(k)); }));
  return out;
}

export default {
  listChapterKeys,
  chapterCount,
  chapterKey,
  chapterOf,
  chapterLabel,
  loadChapter,
  loadedChapter,
  loadChapters,
};
