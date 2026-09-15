/* =============================================================================
 * 第 4 章 4.5 —— 第 s05 关：4.5 The master method for solving recurrences
 *
 * 原文锚点：印刷页 101–106（pdf_index 122–127）
 *
 * 本文件由 tools/05_new_level.py 生成骨架：
 *   「原文引述」「伪代码逐行」「书后习题」三处已从 data/blocks 逐字填入，
 *   并且每一条都已通过 tools/04 的溯源判据 —— **请勿改写 en**，
 *   要删就整条删。其余 `【TODO …】` 处需人工填写。
 *
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's05',
  id: 'ch04/s05',
  chapter: 4,
  section: '4.5',
  title: '主方法：三种情况查表',
  shortTitle: '4.5 主方法',
  titleEn: 'The master method for solving recurrences',
  source: { printed: [101, 106], pdf: [122, 127] },
  sourceNote: '本关对应原书 4.5 节（印刷页 101–106）。',
  prerequisites: [
    { label: '4.4 The recursion-tree method for solving recurrences', url: '#/ch04/s04' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '主方法：把递归树的直觉编成查表公式',
      why: '4.4 节教你画递归树来猜渐进界，但每次都要画、要算、还要代入法验证——能不能查表？主方法说：**能**。只要递归式长成 $T(n) = aT(n/b) + f(n)$ 的标准形状，算出分水岭 $n^{\\log_b a}$、与 $f(n)$ 比一下、查三种情况——答案直接写出来。归并排序、矩阵乘法、Strassen 全部一秒出结果。',
      position: '前置：3.1 的记号、4.3 的代入法（验证工具）、4.4 的递归树（直觉基础）。本关把递归树法的直觉编成三种情况；4.6 证明主定理；4.7 推广到 Akra-Bazzi。★ 第 4 章到此你将拥有完整的三件套：猜（4.4）→ 验（4.3）→ 查（4.5）。',
      unlocks: [
        { label: '4.6 Proof of the continuous master theorem', url: '#/ch04/s06' },
        // 想预告后面章节也能这么写（闸门会以 WARN 提示该章尚未构建，属正常）：
        // { label: '第 4 章 分治法', url: '#/ch04/s01' },
      ],
      mathKit: [
        { title: '分水岭函数', body: '$n^{\\log_b a}$。由 $a$（子问题数）与 $b$（缩小倍数）决定——**与 $f(n)$ 无关**。它是递归树里「叶子那一层的总代价」。' },
        { title: '驱动函数', body: '$f(n)$。合并（combine）+ 划分（divide）的代价——递归树上「除叶子外所有结点的代价」。' },
        { title: '多项式分离', body: '情况 1 与情况 3 要求 $f(n)$ 与 $n^{\\log_b a}$ 差**至少 $n^\\epsilon$ 倍**——不是随便差一点就行，必须差一个多项式因子。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '叶子与根，谁说了算',
      scene: '公司年会预算：基层员工每人 100 元，中层管理每人 10000 元——总预算由谁主导',
      body: [
        '递归树的每一层都有代价。**叶子那一层**的总代价由 $a^{\\log_b n} = n^{\\log_b a}$ 个叶子的 $\\Theta(1)$ 决定；**内部各层**的代价由驱动函数 $f(n)$ 决定。总代价由两者中**更贵的那个**主导——这不是巧合，而是主方法三种情况的全部直觉。',
        '情况 1：叶子贵——$f(n)$ 增长远慢于 $n^{\\log_b a}$，叶子说了算。情况 2：势均力敌——每层代价差不多，$\\lg n$ 层加起来就多乘一个 $\\lg n$。情况 3：根贵——$f(n)$ 增长远快于 $n^{\\log_b a}$，根说了算。',
        '★ 判断的关键是**多项式分离**：$f(n)$ 与 $n^{\\log_b a}$ 必须差至少 $n^\\epsilon$ 倍。差得不够就落进「间隙」，主方法不覆盖——书上 p.105 专门给了 $T(n) = 2T(n/2) + n/\\lg n$ 这个反例。',
      ],
      interactive: { text: '阶段 5 的 growth 图把三种情况的驱动函数画在同一坐标系里，分水岭 $n$ 用另一条线标出——哪条线压过哪条，一目了然。' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    // 下面的 en 与 page 逐字取自 data/blocks/part-i-foundations__ch04.json，每条都已通过溯源判据。
    // 请勿改写 en；每条补上 zh（中文解读）即可。
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 101,
          en: 'strategy altogether is to use more-powerful mathematics, typically in the form of the master method in the next section (which unfortunately doesn’t apply to recurrence (4.14)) or the Akra-Bazzi method (which does, but requires calculus). Even if you use a powerful method, a recursion tree can improve your intuition for what’s going on beneath the heavy math.',
          zh: '4.4 节的递归树法不是万能的——书上 $T(n) = T(n/3) + T(2n/3) + \Theta(n)$ 这个歪树的例子主方法就**不覆盖**（因为 $a \ne b^k$）。但递归树仍然有价值：帮你理解「重数学底下在发生什么」。★ 主方法的适用范围是**标准形状** $T(n) = aT(n/b) + f(n)$。' },
        { kind: 'body', page: 101,
          en: 'The master method provides a "cookbook" method for solving algorithmic recurrences of the form',
          zh: '★ "cookbook"（菜谱）是书上的原话——不是比喻，是定位：主方法的用法就是**查表**。代价是你要背三个条件，好处是「solve many master recurrences quite easily」。' },
        { kind: 'body', page: 101,
          en: 'T(n) = aT(n/b) + f(n); (4.16) where a>0 and b>1 are constants. We call f(n) a driving function, and we call a recurrence of this general form a master recurrence. To use the master method, you need to memorize three cases, but then you’ll be able to solve many master recurrences quite easily.',
          zh: '★ 主递归式的四个角色：$a$ = 子问题**个数**，$b$ = 缩小**倍数**，$T(n/b)$ = 每个子问题的代价，$f(n)$ = **驱动函数**（divide + combine 的总代价）。$a > 0$、$b > 1$ 是必要条件（$b \le 1$ 意味着子问题不缩小，递归不终止）。' },
        { kind: 'body', page: 102,
          en: 'A master recurrence describes the running time of a divide-and-conquer algorithm that divides a problem of size n into a subproblems, each of size n/b < n .',
          zh: '主递归式描述的就是**分治算法**的运行时间。$a$ 个子问题 = 分治把问题拆成 $a$ 块，每块规模 $n/b$。★ 2.3 节的归并排序就是 $a=2, b=2$；矩阵乘法是 $a=8, b=2$。' },
        { kind: 'body', page: 102,
          en: 'The algorithm solves the a subproblems recursively, each in T(n/b) time. The driving function f(n) encompasses the cost of dividing the problem before the re- cursion, as well as the cost of combining the results of the recursive solutions to subproblems. For example, the recurrence arising from Strassen’s algorithm is a master recurrence with a = 7, b = 2, and driving function f(n) = Θ(n 2 ).',
          zh: 'Strassen 矩阵乘法（p.87）：$a=7, b=2, f(n) = \Theta(n^2)$——把 $n \times n$ 矩阵乘法拆成 **7** 个 $n/2 \times n/2$ 的子矩阵乘法（而不是暴力的 8 个）。★ 少一次递归调用，分水岭从 $n^3$ 降到 $n^{\lg 7} \approx n^{2.81}$——这就是分治的威力。' },
        { kind: 'body', page: 102,
          en: 'As we have mentioned, in solving a recurrence that describes the running time of an algorithm, one technicality that we’d often prefer to ignore is the requirement that the input size n be an integer. For example, we saw that the running time of merge sort can be described by recurrence (2.3), T(n) = 2T(n/2) + Θ(n), on page 41. But if n is an odd number, we really don’t have two problems of exactly half the size. Rather, to ensure that the problem sizes are integers, we round one subproblem ⌈own to size bn/2c and th⌉ other up to size ⌈n/2⌉, so the true recurrence is T(n) = T. ⌈n/2⌉ + T. ⌊n/2⌋/ C Θ(n). But this floors-and-ceilings recurrence is longer to write and messier to deal with than recurrence (2.3), which is defined on the reals. We’d rather not worry about floors and ceilings, if we don’t have to, especially since the two recurrences have the same Θ(n lg n) solution.',
          zh: '★ **下取整与上取整可以安全忽略**——书上说得很明确：不管参数怎么取整，渐进界不变。这在技术上由 4.6 节证明。对新手的意义：写递归式时不要被 $\lfloor n/2 \rfloor$ 吓到，直接写 $n/2$ 就行。' },
      ],
      terms: [
        { en: 'master recurrence', zh: '主递归式 $T(n) = aT(n/b) + f(n)$', page: 101 },
        { en: 'driving function', zh: '驱动函数 $f(n)$：divide + combine 的总代价', page: 101 },
        { en: 'watershed function', zh: '分水岭函数 $n^{\\log_b a}$：叶子层的总代价', page: 103 },
        { en: 'regularity condition', zh: '正则条件 $af(n/b) \\le cf(n)$，情况 3 要求', page: 103 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    // lines 的 n / code 逐字取自 data/blocks，行号即原书行号。
    // 点行展开中文：给需要解释的行补 zh 字段（不补则该行不可点）。
    {
      type: 'pseudocode',
      title: '主定理的三种情况',
      algo: 'MASTER-THEOREM',
      signature: 'T(n) = aT(n/b) + f(n),  a ≥ 1, b > 1',
      page: 103,
      lines: [
        { n: 1, code: 'if f(n) = O(n^(log_b a - ε))', zh: '情况 1：驱动函数**多项式级慢于**分水岭 → 叶子主导，T(n) = Θ(n^(log_b a))。ε > 0。' },
        { n: 2, code: 'if f(n) = Θ(n^(log_b a) · lg^k n)', zh: '情况 2：驱动函数与分水岭**同阶** → 每层平摊，T(n) = Θ(n^(log_b a) · lg^(k+1) n)。k ≥ 0。' },
        { n: 3, code: 'if f(n) = Ω(n^(log_b a + ε)) and a·f(n/b) ≤ c·f(n)', zh: '情况 3：驱动函数**多项式级快于**分水岭，且满足正则条件 → 根主导，T(n) = Θ(f(n))。c < 1。' },
      ],
      vars: [
        { name: 'a', meaning: '子问题个数（递归树的分支因子）' },
        { name: 'b', meaning: '缩小倍数（子问题规模 n/b）' },
        { name: 'n^(log_b a)', meaning: '分水岭函数 = 叶子层总代价' },
        { name: 'f(n)', meaning: '驱动函数 = 每层内部结点的总代价' },
      ],
      note: '★ 三种情况的直觉：叶子与根**谁说了算**。情况 1 叶子贵；情况 2 势均力敌；情况 3 根贵。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '三条驱动函数 vs 分水岭',
      viz: 'growth',
      chart: {
        xMax: 64,
        series: [
          { name: '分水岭 n', expr: 'n', color: '--viz-mark' },
          { name: '情况 1: √n', expr: 'Math.sqrt(n)', color: '--viz-done' },
          { name: '情况 2: n', expr: 'n', color: '--viz-compare', dash: '8 4' },
          { name: '情况 3: n²', expr: 'n * n', color: '--viz-violation' },
        ],
      },
      note:
        '取 $a = 2, b = 2$，分水岭函数 $n^{\\log_2 2} = n$。' +
        '★ $\\sqrt n$（情况 1）多项式级慢于 $n$ → **叶子主导**。' +
        '$n$（情况 2）与分水岭同阶 → **逐层平摊**。' +
        '$n^2$（情况 3）多项式级快于 $n$ → **根主导**。',
      tasks: [
        '把 $a$ 改成 8、$b$ 改成 2（矩阵乘法）：分水岭变成 $n^3$。$f(n) = \\Theta(1)$ 属于哪种情况？',
        '把 $a$ 改成 7（Strassen）：分水岭 $n^{\\lg 7} \\approx n^{2.81}$。$f(n) = n^2$ 还是情况 1 吗？',
        '找一个落进间隙的 $f(n)$：它慢于 $n$ 但不是多项式级慢。（提示：试 $n/\\lg n$。）',
      ],
      invariants: [],
      presets: [],
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从伪代码到 C',
      intro: '对照时只看一件事：**书上每个下标减 1**。书上 `A[i]`，C 里就是 `a[i-1]`。',
      pseudocodeRef: 'MASTER-THEOREM',
      c: {
        file: 'master_method_check.c',
        code: "/* master_method_check.c -- 4.5 \u8282\u7684\u6570\u503c\u5b9e\u9a8c\uff1a\u7528\u6570\u503c\u9a8c\u8bc1\u4e3b\u65b9\u6cd5\u4e09\u79cd\u60c5\u51b5\u3002\n *\n * \u4e66\u4e2d\u5bf9\u5e94\uff08\u7b2c 4 \u7248\uff09\uff1a\n *   p.101-102  \u4e3b\u65b9\u6cd5\u63cf\u8ff0 T(n) = aT(n/b) + f(n)\uff08\u9012\u5f52\u5f0f 4.16\uff09\n *   p.103      \u4e3b\u5b9a\u7406\uff08Theorem 4.1\uff09\u4e09\u79cd\u60c5\u51b5\n *   p.104      \u4f8b\uff1a9T(n/3)+n\uff08\u60c5\u51b5 1\uff09\u3001T(2n/3)+1\uff08\u60c5\u51b5 2\uff09\u30013T(n/4)+n lg n\uff08\u60c5\u51b5 3\uff09\n *   p.105      \u5f52\u5e76\u6392\u5e8f 2T(n/2)+\u0398(n)\uff08\u60c5\u51b5 2\uff09\u3001\u77e9\u9635\u4e58\u6cd5 8T(n/2)+\u0398(1)\uff08\u60c5\u51b5 1\uff09\u3001\n *              Strassen 7T(n/2)+\u0398(n\u00b2)\uff08\u60c5\u51b5 1\uff09\n *\n * \u53d6 a=2, b=2\uff08\u5373\u5f52\u5e76\u6392\u5e8f\u7684\u5f62\u72b6\uff09\uff0c\u5206\u6bcd\u51fd\u6570\u5206\u522b\u53d6\u4e09\u79cd\u60c5\u51b5\uff0c\u9010\u5c42\u6c42\u548c\uff1a\n *   \u60c5\u51b5 1  f(n)=1   \u53f6\u5b50\u4e3b\u5bfc   ->  T(n) = \u0398(n)\n *   \u60c5\u51b5 2  f(n)=n   \u6bcf\u5c42\u5e73\u644a   ->  T(n) = \u0398(n lg n)\n *   \u60c5\u51b5 3  f(n)=n\u00b2  \u6839\u4e3b\u5bfc     ->  T(n) = \u0398(n\u00b2)\n *\n * \u4e0e 4.4 \u8282\u9012\u5f52\u6811\u7684\u5bf9\u5e94\uff1a\u5206\u6bcd\u5728\u53f6\u5b50\u5904\u88ab\u541e\uff08\u60c5\u51b5 1\uff09\u3001\u9010\u5c42\u5e73\u644a\uff08\u60c5\u51b5 2\uff09\u3001\n * \u6839\u5904\u538b\u5012\uff08\u60c5\u51b5 3\uff09\u3002C \u7a0b\u5e8f\u628a\u4e09\u79cd\u7ed3\u5c40\u90fd\u7b97\u6210\u5177\u4f53\u7684\u6570\u3002\n *\n * \u7f16\u8bd1\uff1agcc -std=c99 -Wall -Wextra -Werror -O0 -o master_method_check master_method_check.c\n */\n#include <assert.h>\n#include <math.h>\n#include <stdio.h>\n\n/* \u60c5\u51b5 k \u7684\u603b\u4ee3\u4ef7\uff1a\u9012\u5f52\u6811\u7684\u9010\u5c42\u6c42\u548c\u3002\n * a=b=2 \u65f6\u6811\u9ad8 floor(lg n)\uff0c\u7b2c d \u5c42\u6709 2^d \u4e2a\u7ed3\u70b9\u3001\u6bcf\u4e2a\u4ee3\u4ef7 f(n / 2^d)\u3002\n * \u9012\u5f52\u5230\u5e95\u5c42 n=1 \u65f6\u53f6\u5b50\u4ee3\u4ef7 T(1)=1\u3002 */\nstatic long total_cost(long n, int kase)\n{\n    if (n <= 1) {\n        return 1;\n    }\n    long here;\n    switch (kase) {\n    case 1:  here = 1;         break;   /* f(n) = Theta(1)  */\n    case 2:  here = n;         break;   /* f(n) = Theta(n)  */\n    case 3:  here = n * n;     break;   /* f(n) = Theta(n^2)*/\n    default: here = 0;         break;\n    }\n    return here + total_cost(n / 2, kase) + total_cost(n - n / 2, kase);\n}\n\nint main(void)\n{\n    const long n = 1024;   /* 2^10\uff0c\u6811\u9ad8 10 */\n    double lg_n = log2((double)n);\n    printf(\"master recurrence: T(n) = 2T(n/2) + f(n),  n = %ld = 2^10\\n\\n\", n);\n\n    /* ---- \u60c5\u51b5 1\uff1af(n) = \u0398(1)\uff0c\u53f6\u5b50\u4e3b\u5bfc ---- */\n    long t1 = total_cost(n, 1);\n    printf(\"case 1:  f(n) = Theta(1)\\n\");\n    printf(\"  total = %ld,  n = %ld,  total/n = %.4f  ->  Theta(n)\\n\\n\",\n           t1, n, (double)t1 / (double)n);\n    assert(t1 == n * 2 - 1);  /* \u6ee1\u4e8c\u53c9\u6811\u7ed3\u70b9\u603b\u6570 = 2n - 1 */\n    assert(t1 / n == 2 || t1 / n == 1);  /* \u6e10\u8fd1 O(n) \u4e14 Omega(n) */\n\n    /* ---- \u60c5\u51b5 2\uff1af(n) = \u0398(n)\uff0c\u9010\u5c42\u5e73\u644a ---- */\n    long t2 = total_cost(n, 2);\n    printf(\"case 2:  f(n) = Theta(n)\\n\");\n    printf(\"  total = %ld,  n lg n = %.0f,  total/(n lg n) = %.4f  ->  Theta(n lg n)\\n\\n\",\n           t2, n * lg_n, (double)t2 / (double)(n * lg_n));\n    assert(t2 > n && t2 < 3L * n * (long)lg_n);\n\n    /* ---- \u60c5\u51b5 3\uff1af(n) = \u0398(n\u00b2)\uff0c\u6839\u4e3b\u5bfc ---- */\n    long t3 = total_cost(n, 3);\n    printf(\"case 3:  f(n) = Theta(n^2)\\n\");\n    printf(\"  total = %ld,  n^2 = %ld,  total/n^2 = %.4f  ->  Theta(n^2)\\n\\n\",\n           t3, n * n, (double)t3 / ((double)n * n));\n    assert(t3 > (long)(0.9 * n * n) && t3 < (long)(4.0 * n * n));\n\n    /* ---- \u4e0e\u4e66\u4e0a\u4f8b\u5b50\u7684\u5bf9\u5e94\uff08p.104-105\uff09----\n     * \u5f52\u5e76\u6392\u5e8f  2T(n/2)+\u0398(n)   -> \u60c5\u51b5 2 -> \u0398(n lg n)    (p.104)\n     * \u77e9\u9635\u4e58\u6cd5  8T(n/2)+\u0398(1)   -> \u60c5\u51b5 1 -> \u0398(n^3)       (p.105)\n     * Strassen  7T(n/2)+\u0398(n\u00b2)  -> \u60c5\u51b5 1 -> \u0398(n^lg7)     (p.105)\n     * \uff08a,b \u4e0d\u540c\u6240\u4ee5\u672c\u7a0b\u5e8f\u53d6 a=b=2 \u7edf\u4e00\u6f14\u793a\uff1b\u4e09\u79cd\u7ed3\u5c40\u7684\u5f62\u72b6\u4e00\u81f4\u3002\uff09 */\n    printf(\"book examples (p.104-105):\\n\");\n    printf(\"  merge sort   2T(n/2)+Theta(n)   case 2  -> Theta(n lg n)\\n\");\n    printf(\"  matrix mult  8T(n/2)+Theta(1)   case 1  -> Theta(n^3)\\n\");\n    printf(\"  Strassen     7T(n/2)+Theta(n^2) case 1  -> Theta(n^lg7)\\n\");\n\n    printf(\"\\nall checks passed.\\n\");\n    return 0;\n}\n",
      },
      mapping: [],     // 【TODO 伪代码行 ↔ C 行的对应表：{ line: 1, c: 'for (int i = 1; …)' }】
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '书上六个例子的查表实录',
      intro: '书上 p.104–105 连给了六个例子，把它们全列出来——每个只看一行：算分水岭、比大小、写结论。',
      claims: [
        // 【TODO 每条复杂度断言都要给 page 出处；自己推导的写 source: 'instructor'】
        // 引用本关范围之外的页码（如本节结论在第 4 章）必须加 preview: true。
        // { expr: '\\Theta(n \\lg n)', when: '最坏情况', page: [101], source: 'book' },
      ],
      tables: [
        { caption: '书上六个例子的查表实录', rows: [
          ['递归式', 'a:b', '分水岭', 'f(n)', '情况', '结论'],
          ['9T(n/3)+n', '9:3', 'n²', 'n', '1', 'Θ(n²)'],
          ['T(2n/3)+1', '1:3/2', '1', '1', '2', 'Θ(lg n)'],
          ['3T(n/4)+n lg n', '3:4', 'n^0.79', 'n lg n', '3', 'Θ(n lg n)'],
          ['2T(n/2)+Θ(n)', '2:2', 'n', 'n', '2(k=0)', 'Θ(n lg n)'],
          ['8T(n/2)+Θ(1)', '8:2', 'n³', 'Θ(1)', '1', 'Θ(n³)'],
          ['7T(n/2)+Θ(n²)', '7:2', 'n^2.81', 'n²', '1', 'Θ(n^2.81)'],
        ]},
        { caption: '主方法不覆盖的间隙（p.105）', rows: [
          ['情况 1–2 间隙', 'f(n) = o(n^(log_b a)) 但非多项式级慢', true],
          ['情况 2–3 间隙', 'f(n) = ω(n^(log_b a)) 但非多项式级快', true],
          ['正则条件失败', 'a·f(n/b) > c·f(n)', true],
        ]},
      ],
      chart: { xMax: 64, series: [
        { name: 'n²', expr: 'n * n', color: '--viz-active' },
        { name: 'n lg n', expr: 'n * Math.log2(n)', color: '--viz-compare' },
        { name: 'n', expr: 'n', color: '--viz-idle' },
      ] },
      derivations: [
        { kind: 'summation', title: '情况 2 为什么多乘一个 lg n',
          steps: [
            { tex: '\\text{每层合计} = \\Theta(n^{\\log_b a})', zh: '每层合计与分水岭同阶，不衰减。' },
            { tex: '\\sum_{i=0}^{\\log_b n} \\Theta(n^{\\log_b a}) = \\Theta(n^{\\log_b a} \\cdot \\lg n)', zh: '共 lg n + 1 层——多乘一个 lg n。' },
          ] },
      ],
      note: '★ 情况 2 的 k 是 lg 的幂次：k=0 是归并排序，k=1 多乘一个 lg。'
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    // statement / en 也要逐字取自原书（去 data/blocks 里找，别凭记忆写）。
    {
      type: 'prove',
      title: '凭什么说它一定对',
      statement: 'If there exists a constant ε>0 such that f(n) = Ω(n^(log_b a+ε)), and if f(n) additionally satisfies the regularity condition af(n/b) ≤ cf(n) for some constant c<1, then T(n) = Θ(f(n)).',
      page: 101,
      intro: '情况 3 有两个条件：① f(n) 多项式级快于分水岭；② 正则条件 af(n/b) ≤ cf(n)。★ 为什么需要正则条件：它保证递归树上父结点的代价比所有孩子加起来还大——这样根才主导。',
      steps: [
        {
          title: '第一步 · 初始化（Initialization）',
          en: '【TODO 原书这一段的原文（逐字）】',
          page: 101,
          body: ['【TODO 中文展开与补白】'],
        },
        {
          title: '第二步 · 保持（Maintenance）',
          en: '【TODO 原书这一段的原文（逐字）】',
          page: 102,
          body: ['【TODO 中文展开与补白】'],
        },
        {
          title: '第三步 · 终止（Termination）',
          en: '【TODO 原书这一段的原文（逐字）】',
          page: 103,
          body: ['【TODO 中文展开与补白】'],
        },
      ],
      conclusion: '★ 递归树给猜测、代入法盖章——两件工具是一套流程的两半。4.5 的主方法把这套流程编成查表公式。',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    // items 三种题型：judge（判断，answer 是 true/false）、
    //   single（单选，answer 是正确选项下标）、simulate（动手模拟，steps + answer）
    {
      type: 'drill',
      title: '检验一下',
      items: [
        // 【TODO 6–8 道。题目要能一眼看出是本节的内容，但答案必须能从原文/动画推出来】
      ],
      bookExercises: [
        { id: '4.5-1', page: 106, star: 0,
          statement: 'Use the master method to give tight asymptotic bounds for the following recurrences. a. T(n) = 2T(n/4) + 1.',
          hint: '$a=2, b=4$：分水岭 $n^{\\log_4 2} = n^{0.5}$。$f(n) = 1$ 远慢于 $n^{0.5}$ → 情况 1。' },
        { id: '4.5-2', page: 106, star: 0,
          statement: 'Professor Caesar wants to develop a matrix-multiplication algorithm that is asymptotically faster than Strassen’s algorithm. His algorithm will use the divide-andconquer method, dividing each matrix into n/4 × n/4 submatrices, and the divide and combine steps together will take Θ(n 2 ) time. Suppose that the professor’s algorithm creates a recursive subproblems of size n/4. What is the largest integer value of a for which his algorithm could possibly run asymptotically faster than',
          hint: '子问题规模是 $\\sqrt n$ 而不是 $n/b$——不是主递归式的形式。★ 试试变量替换 $m = \\lg n$。' },
        { id: '4.5-3', page: 106, star: 0,
          statement: 'Use the master method to show that the solution to the binary-search recurrence',
          hint: '变量替换 $m = \\lg n$。注意 $T(2^m) = T(2^{m/2}) + 1$ 即 $S(m) = S(m/2) + 1$——这就变成主递归式了。' },
        { id: '4.5-4', page: 106, star: 0,
          statement: 'Consider the function f(n) = lg n. Argue that although f(n/2) < f(n) , the regularity condition af(n/b) ≤ cf.n/ with a = 1 and b = 2 does not hold for any constant c <1. Argue further that for any Ω >0, the condition in case 3 that f(n) = Ω.n log b aC• / does not hold.',
          hint: '4.4 节例 2 的推广：每层合计仍是 $cn$（不重叠切分），树高由**最重的路径**决定。' },
        { id: '4.5-5', page: 107, star: 0,
          statement: 'Show that for suitable constants a, b, and Ω , the function f(n) = 2 dlg ne satisfies all the conditions in case 3 of the master theorem except the regularity condition.',
          hint: '比值 $f(n)/n = 1/\\lg n$ → 0，但 $\\lg n$ 的增长慢于任何 $n^\\epsilon$。也就是说：不存在 $\\epsilon > 0$ 使 $1/\\lg n = O(n^{-\\epsilon})$。' },
      ],
    },
  ],
};
