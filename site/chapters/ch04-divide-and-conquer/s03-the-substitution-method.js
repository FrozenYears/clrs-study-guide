/* =============================================================================
 * 第 4 章 4.3 —— 代入法：先猜后证（The substitution method）
 * 原文锚点：印刷页 90–94（pdf_index 111–115）。英文引述均可追溯至原书语料。
 * ========================================================================== */

export default {
  key: 's03',
  id: 'ch04/s03',
  chapter: 4,
  section: '4.3',
  title: '代入法：先猜后证',
  shortTitle: '4.3 代入法',
  titleEn: 'The substitution method for solving recurrences',
  source: { printed: [90, 94], pdf: [111, 115] },
  sourceNote: '本关对应原书 4.3 节（印刷页 90–94）。',
  prerequisites: [
    { label: '4.2 Strassen 矩阵乘法', url: '#/ch04/s02' },
    { label: '3.2 渐进记号的形式化定义', url: '#/ch03/s02' },
    { label: '2.3 归并排序', url: '#/ch02/s03' },
  ],
  stages: [
    {
      type: 'map',
      title: '代入法：把猜测变成证明',
      why: '递归式不会自动给出渐进界。代入法要求你**先提出带常数的猜测，再用数学归纳法证明它**。它是本章最通用的工具，也是 4.4 递归树给出猜测后用来“盖章”的工具。',
      position: '前置是 3.2 的 $O/\\Omega/\\Theta$ 定义和 2.3 的归并排序递归式。本关解决“怎样证”，4.4 解决“怎样猜”，4.5 则把一类标准递归式压缩成查表规则。★ 猜测、验证、快捷判断分别承担不同工作。',
      unlocks: [
        { label: '4.4 递归树法', url: '#/ch04/s04' },
        { label: '4.5 主方法', url: '#/ch04/s05' },
      ],
      mathKit: [
        { title: '强归纳', body: '证明规模 $n$ 时，通常假设所有 $n_0\\le m<n$ 都成立；这样才覆盖 $\\lfloor n/2\\rfloor$ 等递归调用。' },
        { title: '显式常数', body: '归纳假设应写成 $T(n)\\le cn\\lg n$，而不是 $T(n)=O(n\\lg n)$。★ 同一个 $c$ 必须贯穿整份证明。' },
        { title: '低阶余量', body: '若 $cn$ 差一个常数，试试 $cn-d$。多个递归调用会各留下一个 $d$，用来吸收 $\\Theta(1)$。' },
      ],
    },
    {
      type: 'intuition',
      title: '审核一份“总预算不超标”的承诺',
      scene: '你要给一个不断拆分的项目做预算：先报总额度，再证明每个子项目的账都不会超出它',
      body: [
        '把 $T(n)\\le cn\\lg n$ 看成预算承诺。规模 $n$ 的项目拆成两个约 $n/2$ 的子项目，你必须把子项目的预算代回去，再检查本层新增的账目还能不能装进总额度。',
        '$c$ 不是每一层临时申请的经费，而是证明开始时一次选定的常数。如果代入后得到 $cn+\\Theta(n)$，它虽然是 $O(n)$，却比原本的 $cn$ 大，不能宣布成功。',
        '对 $T(n)=2T(n/2)+\\Theta(1)$，猜 $cn$ 会刚好差一项常数；加强为 $cn-d$ 后，两个子项目会留下 $2d$，恰好能支付本层成本。',
      ],
      interactive: { text: '阶段 5 对比 $n$、$n\\lg n$、$n^2$ 三个候选界。阶段 6 固定常数后逐个规模核对不等式，并展示 $cn-d$ 留出的余量。' },
    },
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '英文原文是证明规则；中文解读标出代入法最容易跳过的逻辑条件。',
      blocks: [
        { kind: 'body', page: 90, en: 'Now that you have seen how recurrences characterize the running times of divideand-conquer algorithms, let’s learn how to solve them. We start in this section with the substitution method, which is the most general of the four methods in this chapter. The substitution method comprises two steps:', zh: '本节先给定位：代入法是四种方法里**最通用**的一种。它不替你猜答案，但能把已有猜测变成严格证明。' },
        { kind: 'body', page: 90, en: '1. Guess the form of the solution using symbolic constants.', zh: '★ 不是猜 $O(n\\lg n)$ 标签，而是猜 $T(n)\\le cn\\lg n$ 这条可代数运算的不等式。' },
        { kind: 'body', page: 90, en: '2. Use mathematical induction to show that the solution works, and find the constants.', zh: '第二步不是代入一个样例；$c$ 与 $n_0$ 要由归纳推导中的约束决定。' },
        { kind: 'body', page: 90, en: 'To apply the inductive hypothesis, you substitute the guessed solution for the function on smaller values—hence the name "substitution method." This method is powerful, but you must guess the form of the answer. Although generating a good guess might seem difficult, a little practice can quickly improve your intuition.', zh: '名字的由来很直接：把小规模已成立的猜测代进递归式。★ 4.4 的递归树正是用来帮助猜测的。' },
        { kind: 'body', page: 90, en: 'You can use the substitution method to establish either an upper or a lower bound on a recurrence. It’s usually best not to try to do both at the same time. That is, rather than trying to prove a Θ-bound directly, first prove an O-bound, and then prove an Ω-bound. Together, they give you a Θ-bound (Theorem 3.1 on page 56).', zh: '★ 不要一上来证明 $\\Theta$。先固定方向；独立的上界与下界证明合起来才是紧界。' },
        { kind: 'body', page: 92, en: 'The problem frequently turns out to be that the inductive assumption is not strong enough. The trick to resolving this problem is to revise your guess by subtracting a lower-order term when you hit such a snag. The math then often goes through.', zh: '推不动时未必该把上界放大。若递归有多个分支，减去低阶项会在每个分支各留下余量，反而更容易闭合归纳。' },
      ],
      terms: [
        { en: 'substitution method', zh: '代入法：把小规模的归纳假设代回递归式', page: 90 },
        { en: 'inductive hypothesis', zh: '归纳假设：对所有较小规模暂时假定成立的不等式', page: 90 },
        { en: 'base cases', zh: '基例：归纳开始时必须单独验证的有限个规模', page: 91 },
        { en: 'lower-order term', zh: '低阶项：相对主项增长更慢、可用来制造余量的项', page: 92 },
      ],
    },
    {
      type: 'pseudocode',
      title: '一张代入证明清单',
      algo: 'SUBSTITUTION-PROOF',
      signature: '证明 T(n) ≤ g(n)，其中 n ≥ n₀',
      page: 90,
      lines: [
        { n: 1, code: 'guess T(n) ≤ g(n) with explicit constants', zh: '先猜带常数的不等式，例如 $T(n)\\le cn\\lg n$；不要把 $O(\\cdot)$ 塞进归纳假设。' },
        { n: 2, code: 'assume T(m) ≤ g(m) for every n₀ ≤ m < n', zh: '强归纳覆盖 $\\lfloor n/2\\rfloor$ 等任意较小规模。' },
        { n: 3, code: 'substitute g(smaller inputs) into the recurrence', zh: '把递归调用逐项替换成猜测右侧；这一步给方法命名。' },
        { n: 4, code: 'choose constants so the result is at most g(n)', zh: '剩余项必须真的被猜测吸收；这里决定 $c$、$d$ 与 $n_0$。' },
        { n: 5, code: 'verify every base case in the chosen range', zh: '归纳步只管足够大的 n；基例仍要用同一组常数逐一核对。' },
        { n: 6, code: 'repeat separately for an upper or lower bound', zh: '上界与下界分开做；二者均成立才可宣布 $\\Theta$ 界。' },
      ],
      vars: [
        { name: 'g(n)', meaning: '猜测的显式上界或下界，例如 c·n·lg n' },
        { name: 'c', meaning: '主系数，用来吸收递归式中的隐藏常数' },
        { name: 'd', meaning: '加强假设时减去的低阶余量，例如 cn − d' },
        { name: 'n₀', meaning: '从此规模开始应用归纳步的阈值' },
      ],
      note: '这是一张证明清单，不是原书的算法伪代码；它把 p.90 的“猜测 + 数学归纳”拆成六个可检查动作。',
    },
    {
      type: 'visualize',
      title: '候选界不是都一样好',
      viz: 'growth',
      chart: { xMax: 64, series: [
        { name: 'n（太低）', expr: 'n', color: '--viz-idle' },
        { name: 'n lg n（正确猜测）', expr: 'n * Math.log2(n)', color: '--viz-done' },
        { name: 'n²（成立但过松）', expr: 'n * n', color: '--viz-compare' },
      ] },
      note: '对 $T(n)=2T(\\lfloor n/2\\rfloor)+\\Theta(n)$，书上先证明 $O(n\\lg n)$。图不能替代证明，却能看出差别：$n$ 没有余量容纳本层线性代价；$n^2$ 浪费信息；$n\\lg n$ 正好留下可吸收成本的 $cn$。',
      invariants: [{ label: '代入后，猜测右侧必须仍能覆盖“子问题代价 + 本层代价”' }],
      tasks: ['比较 n 与 n lg n：两个 n/2 子问题为什么会留出一个 n？', 'n² 虽可能成为上界，为什么不是最终的紧界？', '对 T(n)=2T(n/2)+1，为什么 cn-d 比 cn 更强？'],
      presets: [],
    },
    {
      type: 'code',
      title: '用具体常数检查两种归纳形状',
      intro: '程序不代替数学证明，而是固定隐藏常数后检查代入不等式是否有余量。第一部分验证 $T(n)\\le2n\\lg n$；第二部分展示被加强的 $2n-1$。',
      pseudocodeRef: 'SUBSTITUTION-PROOF',
      c: { file: 'substitution_method_check.c', code: String.raw`/* substitution_method_check.c -- 4.3 节的数值检验：代入法不是“代个式子”，而是带常数的归纳。
 *
 * 原书对应（第 4 版）：
 *   p.90–91  T(n) = 2T(floor(n/2)) + Theta(n)，猜测并验证 O(n lg n)
 *   p.92–93  T(n) = 2T(n/2) + Theta(1)，需要加强为 cn - d
 *   p.93–94  归纳假设中不能把 O(...) 当成可自由变化的常数
 *
 * 本程序用具体的上界常数代替 Theta 项：第一部分取 +n，第二部分取 +1。
 * 它不代替数学证明，而是让“每次代入后还剩多少余量”成为可检查的数。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -O0 -o substitution_method_check substitution_method_check.c
 */
#include <assert.h>
#include <stdio.h>

/* p.90 的模型：T(n) = 2T(floor(n/2)) + n，取 T(1) = 1。 */
static long merge_like_cost(long n)
{
    if (n <= 1) {
        return 1;
    }
    return 2 * merge_like_cost(n / 2) + n;
}

/* p.92 的模型：S(n) = 2S(n/2) + 1，n 取 2 的幂，S(1) = 1。 */
static long constant_work_cost(long n)
{
    if (n <= 1) {
        return 1;
    }
    return 2 * constant_work_cost(n / 2) + 1;
}

static long log2_power_of_two(long n)
{
    long exponent = 0;
    while (n > 1) {
        assert(n % 2 == 0);
        n /= 2;
        exponent++;
    }
    return exponent;
}

int main(void)
{
    puts("substitution method: concrete constants in an inductive hypothesis\n");

    puts("T(n) = 2T(floor(n/2)) + n");
    puts("  n          T(n)       n lg n     T(n)/(n lg n)");
    for (long n = 2; n <= 1024; n *= 2) {
        long value = merge_like_cost(n);
        long bound = 2 * n * log2_power_of_two(n);
        printf("  %-10ld %-10ld %-10ld %.4f\n", n, value, bound,
               (double)value / (double)(n * log2_power_of_two(n)));
        assert(value <= bound); /* 取 c = 2，验证 T(n) <= c n lg n。 */
    }

    puts("\nS(n) = 2S(n/2) + 1");
    puts("  n          S(n)       2n - 1");
    for (long n = 1; n <= 1024; n *= 2) {
        long value = constant_work_cost(n);
        long strengthened_bound = 2 * n - 1;
        printf("  %-10ld %-10ld %-10ld\n", n, value, strengthened_bound);
        assert(value == strengthened_bound);
    }

    puts("\nThe -1 is the lower-order slack: two recursive calls preserve it twice.");
    puts("all checks passed.");
    return 0;
}
` },
      mapping: [
        { line: 1, c: 'bound = 2 · n · log₂n：把猜测写成可检查的不等式。' },
        { line: 2, c: 'merge_like_cost(n / 2) 模型化所有较小规模的归纳假设。' },
        { line: 3, c: 'return 把两个子问题上界代回 T(n)=2T(⌊n/2⌋)+n。' },
        { line: 4, c: 'assert(value <= bound) 检查代入后仍被 2n lg n 覆盖。' },
        { line: 5, c: 'n=1 是基例，使用同一组固定常数。' },
        { line: 6, c: 'strengthened_bound = 2n − 1 展示 cn − d 的加强假设。' },
      ],
    },
    {
      type: 'analyze',
      title: '证明的成败在余量，而不是算式外形',
      intro: '代入法的结论来自归纳不等式能否闭合。以下并排放置正确结论、常见失败和修复方式。',
      claims: [
        { expr: 'T(n) = 2T(\\lfloor n/2 \\rfloor) + \\Theta(n) \\in O(n\\lg n)', when: '显式假设 T(n) ≤ cn lg n 后可完成上界归纳', page: [90, 91], source: 'book' },
        { expr: 'T(n) = 2T(n/2) + \\Theta(1) \\in O(n)', when: 'cn 没余量；加强为 cn − d 后归纳闭合', page: [92, 93], source: 'book' },
        { expr: 'O(n) + \\Theta(n) \\ne O(n) \\text{ as an inductive step}', when: '隐藏常数会变大，不能据此推出固定的 T(n) ≤ cn', page: [93, 94], source: 'book' },
        { expr: 'O(\\cdot) + \\Omega(\\cdot) = \\Theta(\\cdot)', when: '上界与下界分别证明后才能组合成紧界', page: 90, source: 'book' },
      ],
      tables: [
        { caption: '同一递归式的三种猜测', rows: [
          ['猜测', '代入后发生什么', '评价'],
          ['$T(n) ≤ cn$', '$cn+Θ(n)$，超过 cn', '错误：线性本身没有余量'],
          ['$T(n) ≤ cn lg n$', '$cn lg n-cn+Θ(n)≤cn lg n$', '正确：−cn 吸收本层代价'],
          ['$T(n) ≤ cn²$', '可做成上界，但远高于正确量级', '过松：没有说明真实成本结构'],
        ] },
        { caption: '减去低阶项怎样造余量', rows: [
          ['弱假设', '$2·c(n/2)+Θ(1)=cn+Θ(1)$', '无法推出 ≤ cn'],
          ['加强假设', '$2(cn/2-d)+Θ(1)=cn-2d+Θ(1)$', '选 d 足够大后 ≤ cn-d'],
          ['关键', '−d 被每个递归调用各带一次', '递归分支数决定余量'],
        ] },
      ],
      chart: { xMax: 64, series: [
        { name: 'n', expr: 'n', color: '--viz-idle' },
        { name: 'n lg n', expr: 'n * Math.log2(n)', color: '--viz-done' },
        { name: 'n²', expr: 'n * n', color: '--viz-compare' },
      ] },
      derivations: [
        { kind: 'substitution', title: '归并排序形状：为什么恰好多出一个 n', steps: [
          { tex: 'T(n) \\le 2c(n/2)\\lg(n/2)+\\Theta(n)', zh: '对两个规模约 n/2 的子问题使用强归纳假设。' },
          { tex: '= cn\\lg n-cn+\\Theta(n)', zh: '$\\lg(n/2)=\\lg n-1$，两个子问题共同留下 cn。' },
          { tex: '\\le cn\\lg n', zh: '选足够大的 c，让 cn 吸收 Θ(n) 的隐藏常数。' },
        ] },
        { kind: 'substitution', title: '常数工作：为什么 cn − d 更强', steps: [
          { tex: 'T(n) \\le 2(cn/2-d)+\\Theta(1)', zh: '每个递归调用留下 d。' },
          { tex: '= cn-2d+\\Theta(1) \\le cn-d', zh: '只要 d 大于 Θ(1) 的上界常数，仍剩一个 d。' },
        ] },
      ],
      note: '★ 渐进记号描述最终结论，不能替代归纳命题。证明中每次比较都必须面对同一组显式常数。',
    },
    {
      type: 'prove',
      title: '一份 O(n lg n) 上界怎样闭合',
      statement: 'We’ll adopt the inductive hypothesis that T(n) ≤ cn lg n for all n ≥ n 0 , where we’ll choose the specific constants c > 0 and n 0 > 0 later, after we see what constraints they need to obey.',
      page: 90,
      intro: '证明的是 p.90 递归式 (4.11) 的上界。跟住同一对常数 $c,n_0$ 怎样贯穿归纳步和基例。',
      steps: [
        { title: '第一步 · 写出可代入的强归纳假设', en: 'Assume by induction that this bound holds for all numbers at least as big as n 0 and less than n.', page: 91, body: ['假设范围是所有 $n_0\\le m<n$，因此当 $n\\ge2n_0$ 时，$\\lfloor n/2\\rfloor$ 落在范围内。★ 用 $O(n\\lg n)$ 会丢掉 c，无法判断余量。'] },
        { title: '第二步 · 代入后留下一个 cn', en: '≤ cn lg n; where the last step holds if we constrain the constants n 0 and c to be sufficiently large that for n ≥ 2n 0 , the quantity cn dominates the anonymous function hidden by the Θ(n) term.', page: 91, body: ['核心是 $2c(n/2)\\lg(n/2)=cn\\lg n-cn$。选择足够大的 c 与阈值后，−cn 正好吸收本层线性项。'] },
        { title: '第三步 · 用同一组常数封住基例', en: 'Thus, we have T(n) ≤ cn lg n for all n ≥ 2, which implies that the solution to recurrence (4.11) is T(n) = O(n lg n).', page: 91, body: ['书上先处理有限个基例，再给出结论。★ 这只证得上界；紧界仍需独立的下界证明。'] },
      ],
      conclusion: '闭环是：猜带常数的命题 → 对所有较小规模代入 → 用余量吞掉本层成本 → 用同一组常数检查基例。常数一旦中途变掉，证明就断了。',
    },
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: '代入法的归纳假设最合适的写法是？', options: ['$T(n)=O(n\\lg n)$', '$T(n)\\le cn\\lg n$，其中 c 是固定常数', '$T(n)\\approx n\\lg n$', '只检查 n=2、4、8 的样例'], answer: 1, why: '必须显式写出并固定常数，才知道代入后是否仍不超过原右边（p.90、p.94）。' },
        { kind: 'judge', q: '要证明 Θ 界，最好在一套归纳中同时证明 O 和 Ω。', answer: false, why: '错。书上建议分别证明 O 界和 Ω 界；二者合起来才给出 Θ 界（p.90）。' },
        { kind: 'single', q: '把 $T(n)\\le cn\\lg n$ 代入 $T(n)=2T(n/2)+\\Theta(n)$ 后，哪个项留下余量？', options: ['$+cn$', '$-cn$', '$+\\Theta(n)$', '没有余量'], answer: 1, why: '$\\lg(n/2)=\\lg n-1$，所以子问题项合为 $cn\\lg n-cn$；−cn 吸收本层成本（p.91）。' },
        { kind: 'judge', q: '若代入结果为 $cn+\\Theta(n)$，仍可推出 $T(n)\\le cn$，因为两边都是 O(n)。', answer: false, why: '错。隐藏常数会变大，无法推出同一个固定 c 的归纳命题（p.93–94）。' },
        { kind: 'single', q: '加强上界为 $cn-d$ 的直接作用是什么？', options: ['让递归树更高', '每个递归调用留下 d，合起来吸收常数项', '把 Θ(1) 变成 0', '避免处理基例'], answer: 1, why: '两个调用各留下 d，代入后为 $cn-2d+\\Theta(1)$；选 d 足够大即可回到 $cn-d$（p.92–93）。' },
        { kind: 'single', q: '强归纳为何假设所有 $n_0\\le m<n$ 都成立？', options: ['让 c 每步可变', '递归调用可能是 $\\lfloor n/2\\rfloor$ 等任意较小规模', '只验证 n−1 更慢', '省去基例'], answer: 1, why: '递归式调用不止一个、也不一定相邻的较小规模；全部较小 m 的假设才能覆盖它们。' },
        { kind: 'simulate', q: '若 n=16，$2c(n/2)\\lg(n/2)$ 与 $cn\\lg n$ 相差多少个 c·n？填系数。', expect: [1], placeholder: '例如：1', why: '$2c(n/2)\\lg(n/2)=cn(\\lg n-1)=cn\\lg n-cn$。' },
      ],
      bookExercises: [
        { id: '4.3-1', page: 94, star: 0, statement: 'Use the substitution method to show that each of the following recurrences defined on the reals has the asymptotic solution specified: a. T(n) = T(n − 1) + n has solution T(n) = O(n 2 ). b. T(n) = T(n/2) + Θ(1) has solution T(n) = O(lg n). c. T(n) = 2T(n/2) + n has solution T(n) = Θ(n lg n). d. T(n) = 2T(n/2 + 17) + n has solution T(n) = O(n lg n). e. T(n) = 2T(n/3) + Θ(n) has solution T(n) = Θ(n). f. T(n) = 4T(n/2) + Θ(n) has solution T(n) = Θ(n 2 ).', hint: '六条各有各的坑，逐条给假设形式。(a) 设 $T(n)\\le cn^2$，代回得 $c(n-1)^2+n=cn^2-(2c-1)n+c$，要它 $\\le cn^2$ 就得 $(2c-1)n\\ge c$。只写「$c\\ge 1/2$」推不动：$c = 1/2$ 时左边恒为 0。最省事是取 $c\\ge 1$、$n_0 = 1$（此时 $(2c-1)n\\ge n\\ge c$）。(b) 用 $\\lg(n/2)=\\lg n-1$。(c) 上下界要分别证，两套常数。(d) 先证「$n$ 足够大时 $n/2+17\\le(1-\\epsilon)n$」这类引理，或把假设写成 $cn\\lg(n-k)$。(e) 两侧各设一个常数，注意 $\\Theta(n)$ 项要合并。(f) 上界只设 $cn^2$ 会推不动，得把低阶项写进假设（$cn^2-dn$）。' },
        { id: '4.3-2', page: 95, star: 0, statement: 'The solution to the recurrence T(n) = 4T(n/2) + n turns out to be T(n) = Θ(n 2 ). Show that a substitution proof with the assumption T(n) ≤ cn 2 fails. Then show how to subtract a lower-order term to make a substitution proof work.', hint: '第一步先把「失败」写出来，这是题干点名要的：设 $T(n) \\le cn^2$，代回得 $4c(n/2)^2 + n = cn^2 + n$，那个多出来的 $+n$ 永远收不掉，归纳假设推不回自己。第二步减一项：设 $T(n) \\le cn^2 - bn$（$b>0$ 待定），代回得 $4(c n^2/4 - bn/2) + n = cn^2 - 2bn + n \\le cn^2 - bn$ 当且仅当 $bn \\ge n$，即 $b \\ge 1$。第三步补基例：取 $b = 1$、$c$ 大到盖住 $T(1)$（要 $c - 1 \\ge T(1)$），并且对 $n$ 小于某个常数的情形单独检查。★ 结论：$\\Theta(n^2)$ 的上界成立；下界同理用 $T(n) \\ge cn^2 + bn$ 或直接丢掉 $+n$ 得到。' },
        { id: '4.3-3', page: 95, star: 0, statement: 'The recurrence T(n) = 2T(n − 1) + 1 has the solution T(n) = O(2 n ). Show that a substitution proof fails with the assumption T(n) ≤ c2 n , where c>0 is constant. Then show how to subtract a lower-order term to make a substitution proof work.', hint: '先照 $T(n) \\le c 2^n$ 推一次：$2c2^{n-1} + 1 = c2^n + 1$，每层多出的 $+1$ 没有东西去消化，归纳失败 —— 这半句题干也要。再减一项：设 $T(n) \\le c2^n - d$，代回得 $2(c2^{n-1} - d) + 1 = c2^n - 2d + 1 \\le c2^n - d$ 当且仅当 $d \\ge 1$。取 $d = 1$，再让 $c$ 大到盖住基例（$T(1) \\le 2c - 1$）。★ 一句话记法：$-d$ 在两个递归孩子那里被**翻倍**成 $-2d$，多出来的那个 $d$ 正好吃掉每层的 $+1$。' },
      ],
    },
  ],
};
