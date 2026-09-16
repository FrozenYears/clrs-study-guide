/* =============================================================================
 * 第 5 章 Probabilistic Analysis and Randomized Algorithms（概率分析与随机化算法）—— 关卡清单
 *
 * 本文件由 tools/05_new_level.py 生成。新增关卡时：import 进来，
 * 再加进下面的 levels 数组。
 *
 * ★ 本章的 5.4 节被拆成了四关（s04–s07）。原书 5.4 一节的正文有 38.5K 字符，
 *   是全书最长的一节（第二长的 2.3 只有 25K），而且它由四个彼此独立的例子组成
 *   （生日悖论 / 球与箱 / 连续正面 / 在线招聘）。九段式的「一伪代码、一动画、
 *   一 C 程序」套在一个含四个主题的巨节上会失焦，所以按原书自己的 5.4.1–5.4.4
 *   小节号拆开，每关一个主题、5–8K 字符，落在本站其余关卡的正常体量区间里。
 * ========================================================================== */

import s01 from './s01-hiring-problem.js';
import s02 from './s02-indicator-random-variables.js';
import s03 from './s03-randomized-algorithms.js';
import s04 from './s04-the-birthday-paradox.js';
import s05 from './s05-balls-and-bins.js';
import s06 from './s06-streaks.js';
import s07 from './s07-the-online-hiring-problem.js';

export default {
  ch: 5,
  chSpan: '第 5 章 · Probabilistic Analysis and Randomized Algorithms（概率分析与随机化算法）',
  slug: 'ch05-probabilistic-analysis-and-randomized',
  title: 'Probabilistic Analysis and Randomized Algorithms',
  titleZh: '概率分析与随机化算法',
  source: { printed: [126, 160], pdf: [147, 181] },
  levels: [s01, s02, s03, s04, s05, s06, s07],
};
