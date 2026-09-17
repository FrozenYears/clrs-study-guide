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
import ch11 from '../chapters/ch11-hash-tables/chapter.js';
import ch12 from '../chapters/ch12-binary-search-trees/chapter.js';
import ch13 from '../chapters/ch13-red-black-trees/chapter.js';
import ch14 from '../chapters/ch14-dynamic-programming/chapter.js';
import ch15 from '../chapters/ch15-greedy-algorithms/chapter.js';
import ch16 from '../chapters/ch16-amortized-analysis/chapter.js';
import ch17 from '../chapters/ch17-augmenting-data-structures/chapter.js';
import ch18 from '../chapters/ch18-b-trees/chapter.js';
import ch19 from '../chapters/ch19-disjoint-sets/chapter.js';
import ch20 from '../chapters/ch20-graph-algorithms/chapter.js';
import ch21 from '../chapters/ch21-mst/chapter.js';
import ch22 from '../chapters/ch22-sssp/chapter.js';
import ch23 from '../chapters/ch23-apsp/chapter.js';
import ch24 from '../chapters/ch24-maximum-flow/chapter.js';
import ch25 from '../chapters/ch25-matchings/chapter.js';
import ch26 from '../chapters/ch26-parallel-algorithms/chapter.js';
import ch27 from '../chapters/ch27-online-algorithms/chapter.js';
import ch28 from '../chapters/ch28-matrix-operations/chapter.js';
import ch29 from '../chapters/ch29-linear-programming/chapter.js';
import ch30 from '../chapters/ch30-polynomials-and-the-fft/chapter.js';
import ch31 from '../chapters/ch31-number-theoretic-algorithms/chapter.js';
import ch32 from '../chapters/ch32-string-matching/chapter.js';

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
  ['11', ch11],
  ['12', ch12],
  ['13', ch13],
  ['14', ch14],
  ['15', ch15],
  ['16', ch16],
  ['17', ch17],
  ['18', ch18],
  ['19', ch19],
  ['20', ch20],
  ['21', ch21],
  ['22', ch22],
  ['23', ch23],
  ['24', ch24],
  ['25', ch25],
  ['26', ch26],
  ['27', ch27],
  ['28', ch28],
  ['29', ch29],
  ['30', ch30],
  ['31', ch31],
  ['32', ch32],
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
