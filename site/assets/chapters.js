/* =============================================================================
 * chapters.js — 章节模块注册表（章节外壳 Agent 拥有）
 *
 * 为什么不用 fetch 读 structure.json：
 *   本站是零构建静态站，可能以 file:// 打开；file:// 下 fetch 会被 CORS 拦掉。
 *   所以章节清单走静态 import（ES Module 在 http(s) 下正常，file:// 下需本地
 *   起静态服务，见 docs/README-运行方式.md）。
 *
 * 新增一章：把 chapter.js 加进来即可，不用动其他任何文件。
 * ========================================================================== */

import ch02 from '../chapters/ch02-getting-started/chapter.js';
import ch3 from '../chapters/ch03-characterizing-running-times/chapter.js';

const CHAPTERS = new Map([
  ['2', ch02],
  ['3', ch3],
]);

/**
 * 按章号取章节模块。
 * 注意：路由解析出来的是带前导零的字符串（'02'、'1'、'a'），
 * 而注册表的键是规范化后的形式（'2'、'1'、'A'），所以这里要做归一化匹配。
 */
export function getChapter(ch) {
  if (ch == null) return null;
  const s = String(ch);
  if (CHAPTERS.has(s)) return CHAPTERS.get(s);
  const n = parseInt(s, 10);
  if (Number.isFinite(n) && CHAPTERS.has(String(n))) return CHAPTERS.get(String(n));
  const up = s.toUpperCase();
  if (CHAPTERS.has(up)) return CHAPTERS.get(up);
  return null;
}

export function listChapterKeys() {
  return [...CHAPTERS.keys()];
}

export function chapterCount() {
  return CHAPTERS.size;
}
