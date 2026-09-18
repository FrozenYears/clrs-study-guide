/* =============================================================================
 * 第 C 章 Counting and Probability（计数与概率）—— 关卡清单
 *
 * 本文件由 tools/05_new_level.py 生成。新增关卡时：import 进来，
 * 再加进下面的 levels 数组。
 * ========================================================================== */

import s01 from './s01-counting.js';
import s02 from './s02-probability.js';
import s03 from './s03-discrete-random-variables.js';
import s04 from './s04-geometric-and-binomial-distributions.js';
import s05 from './s05-tails-of-the-binomial-distribution.js';

export default {
  ch: 'C',
  chSpan: '第 C 章 · Counting and Probability（计数与概率）',
  slug: 'chc-counting-and-probability',
  title: 'Counting and Probability',
  titleZh: '计数与概率',
  source: { printed: [1178, 1213], pdf: [1199, 1234] },
  levels: [s01, s02, s03, s04, s05],   // 只登记已建好的关卡
};
