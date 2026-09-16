/* =============================================================================
 * 第 6 章 Heapsort（堆排序）—— 关卡清单
 *
 * 本文件由 tools/05_new_level.py 生成。新增关卡时：import 进来，
 * 再加进下面的 levels 数组。
 * ========================================================================== */

import s01 from './s01-heaps.js';
import s02 from './s02-maintaining-the-heap-property.js';
import s03 from './s03-building-a-heap.js';
// s04 还没建：建好后把下面这行打开 ——
// import s04 from './s04-the-heapsort-algorithm.js';
// s05 还没建：建好后把下面这行打开 ——
// import s05 from './s05-priority-queues.js';

export default {
  ch: 6,
  chSpan: '第 6 章 · Heapsort（堆排序）',
  slug: 'ch06-heapsort',
  title: 'Heapsort',
  titleZh: '堆排序',
  source: { printed: [161, 180], pdf: [182, 201] },
  levels: [s01, s02, s03],
};
