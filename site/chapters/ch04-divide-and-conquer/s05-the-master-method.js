/* =============================================================================
 * 第 4 章 4.5 —— 第 s05 关：4.5 The master method for solving recurrences
 *
 * 原文锚点：印刷页 101–106（pdf_index 122–127）
 *
 * 本文件由 tools/05_new_level.py 生成骨架：
 *   「原文引述」「伪代码逐行」「书后习题」三处已从 data/blocks 逐字填入，
 *   并且每一条都已通过 tools/04 的溯源判据 —— **请勿改写 en**，
 *   要删就整条删。其余教学内容已人工补全。
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
    { label: '4.3 代入法', url: '#/ch04/s03' },
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
        code: String.raw`/* master_method_check.c -- 4.5 节的数值实验：用数值验证主方法三种情况。
 *
 * 书中对应（第 4 版）：
 *   p.101-102  主方法描述 T(n) = aT(n/b) + f(n)（递归式 4.16）
 *   p.103      主定理（Theorem 4.1）三种情况
 *   p.104      例：9T(n/3)+n（情况 1）、T(2n/3)+1（情况 2）、3T(n/4)+n lg n（情况 3）
 *   p.105      归并排序 2T(n/2)+Θ(n)（情况 2）、矩阵乘法 8T(n/2)+Θ(1)（情况 1）、
 *              Strassen 7T(n/2)+Θ(n²)（情况 1）
 *
 * 取 a=2, b=2（即归并排序的形状），分母函数分别取三种情况，逐层求和：
 *   情况 1  f(n)=1   叶子主导   ->  T(n) = Θ(n)
 *   情况 2  f(n)=n   每层平摊   ->  T(n) = Θ(n lg n)
 *   情况 3  f(n)=n²  根主导     ->  T(n) = Θ(n²)
 *
 * 与 4.4 节递归树的对应：分母在叶子处被吞（情况 1）、逐层平摊（情况 2）、
 * 根处压倒（情况 3）。C 程序把三种结局都算成具体的数。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -O0 -o master_method_check master_method_check.c
 */
#include <assert.h>
#include <math.h>
#include <stdio.h>

/* 情况 k 的总代价：递归树的逐层求和。
 * a=b=2 时树高 floor(lg n)，第 d 层有 2^d 个结点、每个代价 f(n / 2^d)。
 * 递归到底层 n=1 时叶子代价 T(1)=1。 */
static long total_cost(long n, int kase)
{
    if (n <= 1) {
        return 1;
    }
    long here;
    switch (kase) {
    case 1:  here = 1;         break;   /* f(n) = Theta(1)  */
    case 2:  here = n;         break;   /* f(n) = Theta(n)  */
    case 3:  here = n * n;     break;   /* f(n) = Theta(n^2)*/
    default: here = 0;         break;
    }
    return here + total_cost(n / 2, kase) + total_cost(n - n / 2, kase);
}

int main(void)
{
    const long n = 1024;   /* 2^10，树高 10 */
    double lg_n = log2((double)n);
    printf("master recurrence: T(n) = 2T(n/2) + f(n),  n = %ld = 2^10\n\n", n);

    /* ---- 情况 1：f(n) = Θ(1)，叶子主导 ---- */
    long t1 = total_cost(n, 1);
    printf("case 1:  f(n) = Theta(1)\n");
    printf("  total = %ld,  n = %ld,  total/n = %.4f  ->  Theta(n)\n\n",
           t1, n, (double)t1 / (double)n);
    assert(t1 == n * 2 - 1);  /* 满二叉树结点总数 = 2n - 1 */
    assert(t1 / n == 2 || t1 / n == 1);  /* 渐近 O(n) 且 Omega(n) */

    /* ---- 情况 2：f(n) = Θ(n)，逐层平摊 ---- */
    long t2 = total_cost(n, 2);
    printf("case 2:  f(n) = Theta(n)\n");
    printf("  total = %ld,  n lg n = %.0f,  total/(n lg n) = %.4f  ->  Theta(n lg n)\n\n",
           t2, n * lg_n, (double)t2 / (double)(n * lg_n));
    assert(t2 > n && t2 < 3L * n * (long)lg_n);

    /* ---- 情况 3：f(n) = Θ(n²)，根主导 ---- */
    long t3 = total_cost(n, 3);
    printf("case 3:  f(n) = Theta(n^2)\n");
    printf("  total = %ld,  n^2 = %ld,  total/n^2 = %.4f  ->  Theta(n^2)\n\n",
           t3, n * n, (double)t3 / ((double)n * n));
    assert(t3 > (long)(0.9 * n * n) && t3 < (long)(4.0 * n * n));

    /* ---- 与书上例子的对应（p.104-105）----
     * 归并排序  2T(n/2)+Θ(n)   -> 情况 2 -> Θ(n lg n)    (p.104)
     * 矩阵乘法  8T(n/2)+Θ(1)   -> 情况 1 -> Θ(n^3)       (p.105)
     * Strassen  7T(n/2)+Θ(n²)  -> 情况 1 -> Θ(n^lg7)     (p.105)
     * （a,b 不同所以本程序取 a=b=2 统一演示；三种结局的形状一致。） */
    printf("book examples (p.104-105):\n");
    printf("  merge sort   2T(n/2)+Theta(n)   case 2  -> Theta(n lg n)\n");
    printf("  matrix mult  8T(n/2)+Theta(1)   case 1  -> Theta(n^3)\n");
    printf("  Strassen     7T(n/2)+Theta(n^2) case 1  -> Theta(n^lg7)\n");

    printf("\nall checks passed.\n");
    return 0;
}
`,
      },
      mapping: [
        { line: 1, c: 'total_cost(n, 1)：令 f(n) = 1，递归树逐层累加，数值观察叶子主导的 Θ(n)。' },
        { line: 2, c: 'total_cost(n, 2)：令 f(n) = n，两个 n/2 子问题合起来仍为 n，逐层平摊得到 Θ(n lg n)。' },
        { line: 3, c: 'total_cost(n, 3)：令 f(n) = n²，根层最大，断言总成本仍与 n² 同阶。' },
      ],
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '书上六个例子的查表实录',
      intro: '书上 p.104–105 连给了六个例子，把它们全列出来——每个只看一行：算分水岭、比大小、写结论。',
      claims: [
        { expr: 'f(n) = O(n^{\\log_b a - \\epsilon}) \\Rightarrow T(n) = \\Theta(n^{\\log_b a})', when: '情况 1：分水岭多项式级快于驱动函数，叶子总代价主导', page: 103, source: 'book' },
        { expr: 'f(n) = \\Theta(n^{\\log_b a} \\lg^k n) \\Rightarrow T(n) = \\Theta(n^{\\log_b a} \\lg^{k+1} n)', when: '情况 2：每层代价近似相同，共有 Θ(lg n) 层', page: 103, source: 'book' },
        { expr: 'f(n) = \\Omega(n^{\\log_b a + \\epsilon}) \\Rightarrow T(n) = \\Theta(f(n))', when: '情况 3：还必须满足正则条件，根总代价主导', page: [103, 104], source: 'book' },
        { expr: '8T(n/2) + \\Theta(1) = \\Theta(n^3)', when: '简单递归矩阵乘法：分水岭 n³ 多项式级快于常数项', page: 105, source: 'book' },
        { expr: '7T(n/2) + \\Theta(n^2) = \\Theta(n^{\\lg 7})', when: 'Strassen：n^(lg 7) 约为 n^2.807355，情况 1', page: 105, source: 'book' },
        { expr: '2T(n/2) + n/\\lg n', when: '驱动函数只比 n 对数级慢，落在情况 1 与 2 的间隙；不能套主方法', page: 105, source: 'book' },
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
      title: '三种情况的判定证据',
      statement: 'Before applying the master theorem to some examples, let’s spend a few moments to understand broadly what it says.',
      page: 103,
      intro: '主方法不是看到 $aT(n/b)+f(n)$ 就能机械代入。每一种结论都要先核对增长比较；情况 3 还多了一条正则条件。下面三段原文对应三张判定卡，正是阶段 7 每一行结论的依据。',
      steps: [
        {
          title: '情况 1 · 叶子为何主导',
          en: 'In case 1, not only must the watershed function grow asymptotically faster than the driving function, it must grow polynomially faster.',
          page: 103,
          body: [
            '只说「$f(n)$ 比分水岭小」不够。必须存在常数 $\\epsilon > 0$，使 $f(n)$ 至少差一个 $n^\\epsilon$ 因子。这样递归树从根到叶的层代价至少几何增长，叶子才会压过所有内部结点。',
            '★ 这正好解释了 $8T(n/2)+\\Theta(1)$：分水岭是 $n^3$，常数项足足慢三个多项式阶，因此结论是 $\\Theta(n^3)$。',
          ],
        },
        {
          title: '情况 2 · 为什么会多出一个 lg n',
          en: 'In case 2, the watershed and driving functions grow at nearly the same asymptotic rate.',
          page: 103,
          body: [
            '这里的“nearly”有精确定义：$f(n)=\\Theta(n^{\\log_b a}\\lg^k n)$，其中 $k\\ge0$。每层成本都近似同阶，而树高是 $\\Theta(\\lg n)$，于是总和比单层多一个 $\\lg n$。',
            '★ 归并排序 $2T(n/2)+\\Theta(n)$ 是 $k=0$：单层是 $\\Theta(n)$，总共 $\\Theta(\\lg n)$ 层，所以得到 $\\Theta(n\\lg n)$。',
          ],
        },
        {
          title: '情况 3 · 根为何主导',
          en: 'Case 3 mirrors case 1. Not only must the driving function grow asymptotically faster than the watershed function, it must grow polynomially faster.',
          page: 103,
          body: [
            '方向反过来：$f(n)$ 要至少快 $n^\\epsilon$ 倍。但还不能漏看正则条件 $af(n/b)\\le cf(n)$（$c<1$）：它保证所有孩子的总代价比父结点小固定比例，层代价才能向下几何衰减。',
            '★ $3T(n/4)+n\\lg n$ 属于此例。虽然 $n\\lg n$ 只比 $n^{\\log_4 3}$ 高一点，看似微弱，但差距仍包含正的多项式因子，且正则条件成立。',
          ],
        },
      ],
      conclusion: '★ 先算分水岭，再核对多项式分离；只有情况 3 再核对正则条件。任何一步不满足，就不能硬套主方法，应该回到 4.3 的代入法或 4.4 的递归树。',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    // items 三种题型：judge（判断，answer 是 true/false）、
    //   single（单选，answer 是正确选项下标）、simulate（动手模拟，steps + answer）
    {
      type: 'drill',
      title: '检验一下',
      items: [
        {
          kind: 'single',
          q: '对递归式 $8T(n/2)+\\Theta(1)$，分水岭函数 $n^{\\log_b a}$ 是什么？',
          options: ['$n$', '$n^2$', '$n^3$', '$n^8$'],
          answer: 2,
          why: '$a=8, b=2$，所以 $\\log_2 8=3$，分水岭是 $n^3$（p.105）。常数驱动函数多项式级慢，因此属于情况 1。',
        },
        {
          kind: 'single',
          q: '归并排序的递归式 $2T(n/2)+\\Theta(n)$ 属于主方法的哪一种情况？',
          options: ['情况 1：叶子主导', '情况 2：每层平摊', '情况 3：根主导', '三种都不适用'],
          answer: 1,
          why: '$a=b=2$ 时分水岭是 $n$，驱动函数也是 $\\Theta(n)$，即情况 2（p.104）。所以结果多一个 $\\lg n$，为 $\\Theta(n\\lg n)$。',
        },
        {
          kind: 'judge',
          q: '只要 $f(n)$ 比分水岭增长得快，情况 3 一定可以使用。',
          answer: false,
          why: '错。除多项式级快外，情况 3 还要求正则条件 $af(n/b)\\le cf(n)$，其中 $c<1$。否则根不一定主导（p.103–104）。',
        },
        {
          kind: 'single',
          q: 'Strassen 的递归式 $7T(n/2)+\\Theta(n^2)$ 的正确结论是？',
          options: ['$\\Theta(n^2)$', '$\\Theta(n^3)$', '$\\Theta(n^{\\lg 7})$', '$\\Theta(n^2\\lg n)$'],
          answer: 2,
          why: '分水岭是 $n^{\\lg 7}$，而 $\\lg 7=2.807355\\ldots$；$n^2$ 多项式级慢于它，故情况 1 给出 $\\Theta(n^{\\lg 7})$（p.105）。',
        },
        {
          kind: 'judge',
          q: '$T(n)=2T(n/2)+n/\\lg n$ 可以直接套情况 1，因为 $n/\\lg n=o(n)$。',
          answer: false,
          why: '错。它只比 $n$ 对数级慢，不是多项式级慢；书上把它列为情况 1 与情况 2 之间的间隙（p.105）。',
        },
        {
          kind: 'single',
          q: '使用主方法时，最可靠的第一步是什么？',
          options: ['先猜最终复杂度', '先算 $n^{\\log_b a}$，再把 f(n) 与它比较', '先验证正则条件', '先把 n 代成 1024'],
          answer: 1,
          why: '书上把 $n^{\\log_b a}$ 称为 watershed function（分水岭函数）。三种情况全都从比较 $f(n)$ 与它开始（p.103）。',
        },
        {
          kind: 'simulate',
          q: '对 $8T(n/2)+\\Theta(1)$，请填入分水岭函数的 n 的指数。',
          expect: [3],
          placeholder: '例如：3',
          why: '$\\log_2 8=3$，因此分水岭为 $n^3$（p.105）。',
        },
      ],
      bookExercises: [
        { id: '4.5-1', page: 106, star: 0,
          statement: 'Use the master method to give tight asymptotic bounds for the following recur- rences. a. T(n) = 2T(n/4) + 1. b. T(n) = 2T(n/4) + √n. c. T(n) = 2T(n/4) + √n lg 2 n. d. T(n) = 2T(n/4) + n. e. T(n) = 2T(n/4) + n 2 .',
          hint: '$a=2,\\ b=4$，分水岭是 $n^{\\log_4 2} = \\sqrt n$。五小问只需把各自的 $f(n)$ 与 $\\sqrt n$ 比：(a) $f=1$ 多项式地更慢 → 情况 1，$\\Theta(\\sqrt n)$；(b) $f=\\sqrt n$ 恰好同阶 → 情况 2（$k=0$），$\\Theta(\\sqrt n\\lg n)$；(c) $f=\\sqrt n\\lg^2 n$ 落在情况 2 带 $\\lg^k n$ 的那一档（$k=2$）→ $\\Theta(\\sqrt n\\lg^3 n)$；(d)(e) 的 $f$ 多项式地更快且满足正则条件 → 情况 3，界就是 $\\Theta(f(n))$。' },
        { id: '4.5-2', page: 106, star: 0,
          statement: 'Professor Caesar wants to develop a matrix-multiplication algorithm that is asymp- totically faster than Strassen’s algorithm. His algorithm will use the divide-and- conquer method, dividing each matrix into n/4 × n/4 submatrices, and the divide and combine steps together will take Θ(n 2 ) time. Suppose that the professor’s al- gorithm creates a recursive subproblems of size n/4. What is the largest integer value of a for which his algorithm could possibly run asymptotically faster than Strassen’s?',
          hint: '先写成标准形 $T(n) = aT(n/4) + \\Theta(n^2)$，分水岭是 $n^{\\log_4 a}$。$a<16$ 时驱动函数 $n^2$ 多项式地更大，落到**情况 3**，解是 $\\Theta(n^2)$；$a = 16$ 是**情况 2**（$\\log_4 a = 2$、$k = 0$），解是 $\\Theta(n^2\\lg n)$；两者都已快过 Strassen 的 $n^{\\lg 7}$。$a>16$ 时反过来，递归项更大 → **情况 1**，解变成 $\\Theta(n^{\\log_4 a})$，要它仍快于 $n^{\\lg 7}$ 就得 $\\log_4 a<\\lg 7$。把右边换成以 4 为底：$\\lg 7=\\log_4 49$。' },
        { id: '4.5-3', page: 106, star: 0,
          statement: 'Use the master method to show that the solution to the binary-search recurrence T(n) = T(n/2) + Θ(1) is T(n) = Θ(lg n). (See Exercise 2.3-6 for a description of binary search.)',
          hint: '别换元 —— 这题要的就是主方法直接命中：$a=1,\\ b=2$，于是 $n^{\\log_b a}=n^0=1$，而 $f(n)=\\Theta(1)$ 与它同阶，正是情况 2（$k=0$），结论 $\\Theta(n^{\\log_b a}\\lg n)=\\Theta(\\lg n)$。' },
        { id: '4.5-4', page: 106, star: 0,
          statement: 'Consider the function f(n) = lg n. Argue that although f(n/2) < f(n) , the regularity condition af(n/b) ≤ cf.n/ with a = 1 and b = 2 does not hold for any constant c <1. Argue further that for any Ω >0, the condition in case 3 that f(n) = Ω.n log b aC• / does not hold.',
          hint: '两问分开做。正则条件要 $f(n/2)\\le cf(n)$，即 $\\lg(n/2)=\\lg n-1\\le c\\lg n$，移项得 $(1-c)\\lg n\\le 1$ —— 任何固定的 $c<1$ 在大 $n$ 处都不成立。第二问：$a=1,\\ b=2$ 时 $n^{\\log_b a}=1$，情况 3 要 $\\lg n=\\Omega(n^{\\epsilon})$，而对任何 $\\epsilon>0$ 都有 $\\lg n/n^{\\epsilon}\\to 0$。' },
        { id: '4.5-5', page: 107, star: 0,
          statement: 'Show that for suitable constants a, b, and Ω , the function f(n) = 2 dlg ne satisfies all the conditions in case 3 of the master theorem except the regularity condition.',
          hint: '这题要证「除正则条件外全部满足」，所以把情况 3 的前提逐条对着 $f(n)=2^{\\lceil\\lg n\\rceil}$ 验。先记下它两条性质：恒为 2 的整数次幂，且 $n\\le f(n)<2n$，于是 $f(n)/n$ 在 $[1,2)$ 之间摆动、不收敛。正则条件要求 $af(n/b)\\le cf(n)$ 对**所有足够大的 $n$** 一致成立，正是这个摆动把它打破的 —— 分别取「$n$ 恰为 2 的幂」与「$n$ 刚过 2 的幂」这两列值去算比值。' },
      ],
    },
  ],
};
