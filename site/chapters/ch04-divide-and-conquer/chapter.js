/* =============================================================================
 * 第 4 章 Divide-and-Conquer（分治法）—— 关卡清单
 *
 * 本文件由 tools/05_new_level.py 生成。新增关卡时：import 进来，
 * 再加进下面的 levels 数组。
 * ========================================================================== */

import s01 from './s01-multiplying-square-matrices.js';
import s02 from './s02-strassen-matrix-multiplication.js';
import s03 from './s03-the-substitution-method.js';
import s04 from './s04-the-recursion-tree.js';
import s05 from './s05-the-master-method.js';
// s06 还没建：建好后把下面这行打开 ——
// import s06 from './s06-<slug>.js';
// s07 还没建：建好后把下面这行打开 ——
// import s07 from './s07-<slug>.js';

export default {
  ch: 4,
  chSpan: '第 4 章 · Divide-and-Conquer（分治法）',
  slug: 'ch04-divide-and-conquer',
  title: 'Divide-and-Conquer',
  titleZh: '分治法',
  source: { printed: [76, 125], pdf: [97, 146] },
  levels: [s01, s02, s03, s04, s05],   // 只登记已建好的关卡
};
