/* =============================================================================
 * 第 7 章 Quicksort（快速排序）—— 关卡清单
 *
 * 本文件由 tools/05_new_level.py 生成。新增关卡时：import 进来，
 * 再加进下面的 levels 数组。
 * ========================================================================== */

import s01 from './s01-description-of-quicksort.js';
import s02 from './s02-performance-of-quicksort.js';
import s03 from './s03-a-randomized-version-of-quicksort.js';
// s04 还没建：建好后把下面这行打开 ——
// import s04 from './s04-analysis-of-quicksort.js';

export default {
  ch: 7,
  chSpan: '第 7 章 · Quicksort（快速排序）',
  slug: 'ch07-quicksort',
  title: 'Quicksort',
  titleZh: '快速排序',
  source: { printed: [182, 204], pdf: [203, 225] },
  levels: [s01, s02, s03],
};
