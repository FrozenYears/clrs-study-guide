/* =============================================================================
 * 第 1 章 The Role of Algorithms in Computing（算法在计算中的作用）—— 关卡清单
 *
 * 本章只有两节，都是「全书语言」的定基调关：1.1 定义算法 / 实例 / 正确性，
 * 1.2 论证算法是一种技术。第 2 章才开始教第一个真正的算法。
 * 本文件由 tools/05_new_level.py 生成骨架，人工收口：新增关卡时 import 进来，
 * 再加进下面的 levels 数组。
 * ========================================================================== */

import s01 from './s01-algorithms.js';
import s02 from './s02-algorithms-as-a-technology.js';

export default {
  ch: 1,
  chSpan: '第 1 章 · The Role of Algorithms in Computing（算法在计算中的作用）',
  slug: 'ch01-the-role-of-algorithms',
  title: 'The Role of Algorithms in Computing',
  titleZh: '算法在计算中的作用',
  source: { printed: [5, 16], pdf: [26, 37] },
  levels: [s01, s02],   // 只登记已建好的关卡
};
