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
import ch4 from '../chapters/ch04-divide-and-conquer/chapter.js';
import ch5 from '../chapters/ch05-probabilistic-analysis-and-randomized/chapter.js';
import ch6 from '../chapters/ch06-heapsort/chapter.js';
import ch7 from '../chapters/ch07-quicksort/chapter.js';
import ch8 from '../chapters/ch08-sorting-in-linear-time/chapter.js';
import ch9 from '../chapters/ch09-medians-and-order-statistics/chapter.js';
import ch10 from '../chapters/ch10-elementary-data-structures/chapter.js';

const CHAPTERS = new Map([
  ['2', ch02],
  ['3', ch3],
  ['4', ch4],
  ['5', ch5],
  ['6', ch6],
  ['7', ch7],
  ['8', ch8],
  ['9', ch9],
  ['10', ch10],
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
