/* =============================================================================
 * 第 4 章 4.6 —— 连续主定理：从递归树到积分界。原文锚点：印刷页 107–114。
 * ========================================================================== */

export default {
  key: 's06',
  id: 'ch04/s06',
  chapter: 4,
  section: '4.6',
  title: '连续主定理：从递归树到积分界',
  shortTitle: '4.6 连续主定理',
  titleEn: 'Proof of the continuous master theorem',
  source: { printed: [107, 114], pdf: [128, 135] },
  sourceNote: '本关对应原书 4.6 节（印刷页 107–114）。',
  prerequisites: [
    { label: '4.5 主方法：三种情况查表', url: '#/ch04/s05' },
  ],
  stages: [
    {
      type: 'map',
      title: '把“查表”拆成一条证明链',
      why: '4.5 给出主方法的三种结论，但没有展开为什么这些结论成立。本节在连续实数域上绕开 floor/ceiling，把递归树、求和估计和主定理串成一条可检查的证明链。',
      position: '前置是 4.5 的主方法；本关先证明简化递归的 Lemma 4.2，再用 Lemma 4.3 估计三种求和，最后恢复任意阈值 $n_0$ 的 Theorem 4.4。4.7 将继续处理更一般的 Akra–Bazzi 递归。',
      unlocks: [{ label: '4.7 Akra–Bazzi 递归', url: '#/ch04/s07' }],
      mathKit: [
        { title: '连续递归', body: '把 $n$ 看作足够大的正实数，递归式写成 $T(n)=aT(n/b)+f(n)$，暂时不处理取整。' },
        { title: '水位函数', body: '$n^{\\log_b a}$ 是递归树叶子总数的量级，也就是内部成本与叶子成本比较时的分水岭。' },
        { title: '几何级数', body: '当每层成本按固定比例增加或减少时，求和由一端主导；每层同阶时，层数带来额外的 $\\lg n$。' },
      ],
    },
    {
      type: 'intuition',
      title: '先把每层账目列出来，再看谁主导',
      scene: '把一项不断拆分的工程画成楼层预算：每层有若干小组，每个小组承担当前规模的工作',
      body: [
        '根节点的规模是 $n$，下一层有 $a$ 个规模 $n/b$ 的节点，第 $j$ 层有 $a^j$ 个节点，每个节点的驱动成本是 $f(n/b^j)$。所以这一层的总账是 $a^j f(n/b^j)$。',
        '当规模降到 1 以下，节点变成基例。叶子数量约为 $a^{\\log_b n}=n^{\\log_b a}$，这是“水位函数”；内部节点的总和则是 $g(n)=\\sum_j a^j f(n/b^j)$。',
        '连续主定理的三种情况，其实就是这本账在楼层之间的分布：成本向叶子增长、每层近似相等，或成本向根增长。',
      ],
      interactive: { text: '阶段 5 选择三条驱动函数曲线：根到叶子分别呈几何增长、近似持平或几何下降；把它们与三种主方法情况对照。' },
    },
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '本节的原文先说明证明范围，再依次引入两个引理和连续主定理。中文解读只补充证明链中每一步的作用。',
      blocks: [
        { kind: 'body', page: 107, en: 'Proving the master theorem (Theorem 4.1) in its full generality, especially dealing with the knotty technical issue of floors and ceilings, is beyond the scope of this book. This section, however, states and proves a variant of the master theorem, called the continuous master theorem 1 in which the master recurrence (4.17) is defined over sufficiently large positive real numbers. The proof of this version, uncomplicated by floors and ceilings, contains the main ideas needed to understand how master recurrences behave. Section 4.7 discusses floors and ceilings in divideand-conquer recurrences at greater length, presenting sufficient conditions for them not to affect the asymptotic solutions.', zh: '这里证明的是连续版本：$n$ 取足够大的正实数，因此可以暂时把取整技术问题拿开，专注于递归树和渐进估计。' },
        { kind: 'body', page: 107, en: 'Of course, since you need not understand the proof of the master theorem in order to apply the master method, you may choose to skip this section. But if you wish to study more-advanced algorithms beyond the scope of this textbook, you may appreciate a better understanding of the underlying mathematics, which the proof of the continuous master theorem provides.', zh: '应用主方法不要求读完证明；但理解这条证明链，有助于把“查表”迁移到更复杂的递归。' },
        { kind: 'body', page: 107, en: 'Although we usually assume that recurrences are algorithmic and don’t require an explicit statement of a base case, we must be much more careful for proofs that justify the practice. The lemmas and theorem in this section explicitly state the base cases, because the inductive proofs require mathematical grounding. It is common in the world of mathematics to be extraordinarily careful proving theorems that justify acting more casually in practice.', zh: '证明必须显式写出基例；工程分析里常省略的边界，在这里是递归论证的地基。' },
        { kind: 'body', page: 107, en: 'The proof of the continuous master theorem involves two lemmas. Lemma 4.2 uses a slightly simplified master recurrence with a threshold constant of n 0 = 1, rather than the more general n 0 >0 threshold constant implied by the unstated base case. The lemma employs a recursion tree to reduce the solution of the simplified master recurrence to that of evaluating a summation. Lemma 4.3 then provides asymptotic bounds for the summation, mirroring the three cases of the master theorem. Finally, the continuous master theorem itself (Theorem 4.4) gives asymptotic bounds for master recurrences, while generalizing to an arbitrary threshold constant n 0 >0 as implied by the unstated base case.', zh: '证明结构就是“Lemma 4.2 得到求和 → Lemma 4.3 估计求和 → Theorem 4.4 把阈值从 1 恢复到任意 $n_0$”。' },
        { kind: 'lemma', page: 108, en: 'Let a > 0 and b > 1 be constants, and let f(n) be a function defined over real numbers n ≥ 1. Then the recurrence', zh: 'Lemma 4.2 先固定 $n_0=1$，把递归树的叶子成本与内部节点成本分开。' },
        { kind: 'body', page: 108, en: 'We are now in a position to derive equation (4.18) by summing the costs of the nodes at each depth in the tree, as shown in the figure. The first term in the equation is the total costs of the leaves.', zh: '每一层内部节点的成本是 $a^j f(n/b^j)$；所有层相加，就得到式 (4.18) 的求和部分，另加叶子成本。' },
      ],
      terms: [
        { en: 'continuous master theorem', zh: '连续主定理：在正实数域上证明主方法三种情况的版本', page: 107 },
        { en: 'driving function', zh: '驱动函数 $f(n)$：每个递归节点在划分与合并阶段承担的成本', page: 112 },
        { en: 'watershed function', zh: '水位函数 $n^{\\log_b a}$：叶子数量的渐进量级', page: 108 },
        { en: 'regularity condition', zh: '正则性条件：情况 3 中限制递归缩小后成本下降速度的条件', page: 112 },
      ],
    },
    {
      type: 'pseudocode',
      title: '证明路线（教学整理，非原书伪代码）',
      algo: 'CONTINUOUS-MASTER-PROOF',
      signature: '从 T(n)=aT(n/b)+f(n) 推出三种渐进界',
      page: 107,
      lines: [
        { n: 1, code: 'set n₀ = 1 and state the base case for 0 < n < 1', zh: '先让简化递归有明确的终止区域；这是 Lemma 4.2 的起点。' },
        { n: 2, code: 'count aʲ nodes of size n / bʲ at depth j', zh: '第 j 层有 aʲ 个节点，每个节点的驱动成本为 f(n/bʲ)。' },
        { n: 3, code: 'sum internal costs: g(n) = Σ aʲ f(n / bʲ)', zh: '把所有内部层的成本相加，得到式 (4.19) 的 g(n)。' },
        { n: 4, code: 'apply Lemma 4.3 to cases 1, 2, and 3', zh: '根据 f(n) 与 n^{log_b a} 的关系，分别估计 g(n)。' },
        { n: 5, code: 'rescale n to n₀ n and recover the general threshold', zh: '令 T′(n)=T(n₀n)、f′(n)=f(n₀n)，把 Lemma 4.2 的阈值 1 还原为任意 n₀。' },
      ],
      vars: [
        { name: 'a, b', meaning: '常数：每层分支数 a 与规模缩小倍数 b' },
        { name: 'f(n)', meaning: '驱动函数，表示一个递归节点的非递归成本' },
        { name: 'g(n)', meaning: '内部节点总成本 Σ aʲf(n/bʲ)' },
        { name: 'n₀', meaning: '一般递归的基例阈值；简化引理先取 n₀=1' },
      ],
      note: '这是一张阅读证明的路线图，不是原书列出的程序；原书的正式结论在 Lemma 4.2、Lemma 4.3 和 Theorem 4.4 中。',
    },
    {
      type: 'visualize',
      title: '看见三种每层成本分布',
      viz: 'growth',
      chart: { xMax: 64, series: [
        { name: '情况 1：向叶子增长', expr: 'n * n', color: '--viz-compare' },
        { name: '情况 2：临界层', expr: 'n * n * Math.log2(n)', color: '--viz-done' },
        { name: '情况 3：向根增长', expr: 'n * n * n', color: '--viz-active' },
      ] },
      note: '图中把水位函数取成 n²：情况 1 的驱动函数低于它，情况 2 多一个 lg n，情况 3 高于它。曲线展示增长关系，不替代 Lemma 4.3 的证明。',
      invariants: [{ label: '每种情况都先比较 f(n) 与 n^{log_b a}，再决定总和由哪一端主导' }],
      tasks: [
        '把 n=16 代入三条曲线，观察哪一条只多一个对数因子。',
        '回到阶段 4，指出 g(n) 在三种情况下分别由根、所有层、叶子哪一端主导。',
        '解释为什么情况 3 还需要正则性条件，而不是只写一个 Ω 界。',
      ],
    },
    {
      type: 'code',
      title: '用 C 核对求和账本',
      intro: '这段 C 不是原书算法，而是把 Lemma 4.2/4.3 的层成本求和固定成 a=4、b=2 的可执行例子：水位函数为 n²，三种驱动函数分别为 n、n²lg n、n³。',
      pseudocodeRef: 'CONTINUOUS-MASTER-PROOF',
      c: { file: 'continuous_master_theorem.c', code: String.raw`/* continuous_master_theorem.c -- 4.6 节：连续主定理的求和账本。 */
#include <assert.h>
#include <stdio.h>

static int log2_power_of_two(int value)
{
    int exponent = 0;
    while (value > 1) {
        value /= 2;
        exponent++;
    }
    return exponent;
}

/* kind 1/2/3 分别模拟低于、等于、高于水位函数 n^2 的驱动成本。 */
static long long level_sum(int n, int kind)
{
    long long total = 0;
    long long branches = 1;
    int size = n;
    while (size >= 1) {
        long long cost;
        if (kind == 1) {
            cost = size;
        } else if (kind == 2) {
            cost = (long long)size * size * log2_power_of_two(size);
        } else {
            cost = (long long)size * size * size;
        }
        total += branches * cost;
        branches *= 4;
        size /= 2;
    }
    return total;
}

int main(void)
{
    for (int n = 2; n <= 64; n *= 2) {
        const long long watershed = (long long)n * n;
        const long long case1 = level_sum(n, 1);
        const long long case2 = level_sum(n, 2);
        const long long case3 = level_sum(n, 3);

        assert(case1 <= 2 * watershed);
        assert(case2 >= watershed);
        assert(case3 >= (long long)n * n * n);
        printf("n=%d  case1=%lld  case2=%lld  case3=%lld\n",
               n, case1, case2, case3);
    }
    puts("continuous master theorem summation checks passed.");
    return 0;
}
`, },
      mapping: [
        { pc: 1, pcCode: 'set n₀ = 1 and state the base case', c: 'while (size >= 1) 逐层遍历，size<1 时停止' },
        { pc: 2, pcCode: 'count aʲ nodes at depth j', c: 'branches *= 4 对应 a=4 的节点数' },
        { pc: 3, pcCode: 'sum internal costs', c: 'total += branches * cost' },
        { pc: 4, pcCode: 'apply Lemma 4.3', c: '三个 assert 分别检查低于、临界、高于水位的方向' },
        { pc: 5, pcCode: 'rescale to n₀', c: '本例固定 n₀=1；一般阈值由 T′(n)=T(n₀n) 变换处理' },
      ],
    },
    {
      type: 'analyze',
      title: '求和的三种主导方式',
      intro: '连续主定理把主方法的比较写成对 g(n) 的估计；叶子贡献统一是 $\\Theta(n^{\\log_b a})$，差别集中在内部节点求和。',
      claims: [
        { expr: 'g(n)=\\sum_{j=0}^{\\lfloor\\log_b n\\rfloor}a^j f(n/b^j)', when: '内部节点总成本', page: 108, source: 'book' },
        { expr: 'T(n)=\\Theta(n^{\\log_b a})', when: '情况 1：驱动函数多项式地低于水位函数', page: 112, source: 'book' },
        { expr: 'T(n)=\\Theta(n^{\\log_b a}\\lg^{k+1}n)', when: '情况 2：f(n)=Θ(n^{log_b a} lg^k n)', page: 114, source: 'book' },
        { expr: 'T(n)=\\Theta(f(n))', when: '情况 3：驱动函数高于水位且满足正则性条件', page: 114, source: 'book' },
        { expr: 'n^{\\log_b a}', when: '叶子总数的水位函数', page: 108, source: 'book' },
      ],
      tables: [{ caption: 'Lemma 4.3 / Theorem 4.4 的对应关系', rows: [
        ['情况', '驱动函数 f(n)', '总成本'],
        ['1', '$O(n^{\\log_b a-\\epsilon})$', '$\\Theta(n^{\\log_b a})$'],
        ['2', '$\\Theta(n^{\\log_b a}\\lg^k n)$', '$\\Theta(n^{\\log_b a}\\lg^{k+1} n)$'],
        ['3', '$\\Omega(n^{\\log_b a+\\epsilon})$ + 正则性', '$\\Theta(f(n))$'],
      ] }],
      chart: { xMax: 32, series: [
        { name: '水位 n²', expr: 'n * n', color: '--viz-idle' },
        { name: '临界 n²lg n', expr: 'n * n * Math.log2(n)', color: '--viz-done' },
      ] },
      derivations: [
        { kind: 'summation', title: '从递归树得到式 (4.18)', steps: [
          { tex: 'T(n)=\\Theta(n^{\\log_b a})+\\sum_{j=0}^{\\lfloor\\log_b n\\rfloor}a^j f(n/b^j)', zh: '第一项是叶子总成本，第二项是所有内部层成本。' },
          { tex: 'g(n)=\\sum_{j=0}^{\\lfloor\\log_b n\\rfloor}a^j f(n/b^j)', zh: 'Lemma 4.3 只需估计这个内部节点总和。' },
        ] },
        { kind: 'substitution', title: '为什么临界情况多一个 lg n', steps: [
          { tex: 'f(n)=\\Theta(n^{\\log_b a}\\lg^k n)', zh: '每层成本的主尺度相同，只剩下对数因子随层数变化。' },
          { tex: 'g(n)=\\Theta(n^{\\log_b a}\\lg^{k+1}n)', zh: '约 lg n 层累加，额外增加一个对数因子。' },
        ] },
      ],
      note: '情况 3 的正则性条件 $af(n/b)\\le cf(n)$（$c<1$）保证层成本向叶子方向确实几何下降；没有它，单独的 Ω 条件不足以封住上界。',
    },
    {
      type: 'prove',
      title: '从简化递归恢复连续主定理',
      statement: 'The proof of the continuous master theorem involves two lemmas.',
      page: 107,
      intro: '下面三步对应证明的结构：先用递归树建立求和表达式，再用三种估计封住 g(n)，最后通过尺度变换处理任意基例阈值 n₀。',
      steps: [
        { title: '第一步 · 固定基例并展开递归树', en: 'Proof Consider the recursion tree in Figure 4.3. Let’s look first at its inter- nal nodes. The root of the tree has cost f(n) , and it has a children, each with cost f(n/b) . (It is convenient to think of a as being an integer, especially when visualizing the recursion tree, but the mathematics does not require it.) Each of these children has a children, making a 2 nodes at depth 2, and each of the a children has cost f(n/b 2 ). In general, there are a j nodes at depth j , and each node has cost f(n/b j ).', page: 108, body: ['第 j 层的节点数是 $a^j$，节点规模是 $n/b^j$；这一步只建立“每层有多少账”的恒等关系。'] },
        { title: '第二步 · 把每层成本相加', en: 'We are now in a position to derive equation (4.18) by summing the costs of the nodes at each depth in the tree, as shown in the figure. The first term in the equation is the total costs of the leaves.', page: 108, body: ['叶子数量给出 $\\Theta(n^{\\log_b a})$，内部节点给出 $g(n)$；Lemma 4.3 正好负责估计后者。'] },
        { title: '第三步 · 应用三种界并恢复 n₀', en: 'For case 3, observe that f(n) appears in the definition (4.19) of g(n) (when j = 0) and that all terms of g(n) are positive. Therefore, we must have g(n) = Ω(f (n)) , and it only remains to prove that g(n) = O(f(n)) .', page: 112, body: ['情况 1、2、3 分别由 Lemma 4.3 给出；Theorem 4.4 再令 $T′(n)=T(n₀n)$，把阈值 1 的结论搬回原递归。'] },
      ],
      conclusion: '连续主定理的证明没有改变主方法的三种答案，而是解释答案从哪里来：叶子项加上内部层求和，再由尺度变换处理真实基例。',
    },
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: 'Lemma 4.2 为什么先把基例阈值设为 n₀=1？', options: ['为了让 a 和 b 变成 1', '为了先在连续递归中得到干净的递归树与求和式', '因为所有算法都只能处理 n=1', '为了跳过叶子成本'], answer: 1, why: '先固定阈值 1 可直接展开递归树；Theorem 4.4 最后再用尺度变换恢复一般 n₀（p.107–113）。' },
        { kind: 'judge', q: '第 j 层内部节点的总成本是 aʲf(n/bʲ)。', answer: true, why: '第 j 层有 aʲ 个节点，每个节点的驱动成本为 f(n/bʲ)（p.108）。' },
        { kind: 'single', q: '水位函数 n^{log_b a} 在证明中首先代表什么？', options: ['根节点的驱动成本', '叶子数量的渐进量级', '正则性条件的常数', '递归的最大深度'], answer: 1, why: '递归树约有 a^{log_b n}=n^{log_b a} 个叶子（p.108）。' },
        { kind: 'single', q: '情况 2 比情况 1 多出的一个 lg n 来自哪里？', options: ['每个节点多一次乘法', '递归树高度约为 lg_b n，临界层成本需要跨层相加', '基例从 1 改成 n₀', 'a 变成了 a+1'], answer: 1, why: '临界时各层在同一主尺度上，约 lg n 层相加（p.109–114）。' },
        { kind: 'judge', q: '情况 3 只需要 f(n)=Ω(n^{log_b a+ε})，不需要正则性条件。', answer: false, why: '连续主定理还要求 af(n/b)≤cf(n)，且 c<1；这保证内部层向下几何下降（p.112、114）。' },
        { kind: 'simulate', q: '取 a=4、b=2、n=16、f(x)=x，按 g(n)=Σ4ʲf(16/2ʲ) 计算内部节点总成本。', expect: [496], placeholder: '例如：496', why: '四层加上叶前一层的账为 16·(1+2+4+8+16)=496。' },
        { kind: 'single', q: 'Theorem 4.4 用 T′(n)=T(n₀n) 的目的是什么？', options: ['改变渐进阶', '把任意阈值 n₀ 缩放为 Lemma 4.2 使用的阈值 1', '删除驱动函数', '把实数递归变成整数递归'], answer: 1, why: '尺度变换让简化引理可用，再把常数 n₀ 吸收到渐进记号中（p.113–114）。' },
      ],
      bookExercises: [
        { id: '4.6-1', page: 114, star: 0, statement: 'Show that P blog b nc j D0 (log b n − j) k = Ω(log k + 1 b n).', hint: '把求和倒序或令 r=⌊log_b n⌋−j，把它化成 1^k+2^k+… 的下界；只需取最后若干项即可。' },
      ],
    },
  ],
};
