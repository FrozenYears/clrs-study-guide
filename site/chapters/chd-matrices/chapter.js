/* =============================================================================
 * 第 D 章 Matrices（矩阵）—— 关卡清单
 *
 * 本文件由 tools/05_new_level.py 生成。新增关卡时：import 进来，
 * 再加进下面的 levels 数组。
 * ========================================================================== */

import s01 from './s01-matrices-and-matrix-operations.js';
import s02 from './s02-basic-matrix-properties.js';

export default {
  ch: 'D',
  chSpan: '第 D 章 · Matrices（矩阵）',
  slug: 'chd-matrices',
  title: 'Matrices',
  titleZh: '矩阵',
  // ★ 第 32 轮复审收紧：原先 1214–1290 是从 structure.json 的章末 pdf_end（1312 = 全书末页）
  //   反推的，把 Bibliography（1227 起）和 Index 都算进了附录 D。附录 D 真正止于 1226。
  source: { printed: [1214, 1226], pdf: [1235, 1247] },
  levels: [s01, s02],   // 只登记已建好的关卡
};
