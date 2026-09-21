/* =============================================================================
 * 第 4 章 4.7 —— Akra–Bazzi：不等比例递归的积分解。原文锚点：印刷页 115–125。
 * ========================================================================== */

export default {
  key: 's07',
  id: 'ch04/s07',
  chapter: 4,
  section: '4.7',
  title: 'Akra–Bazzi：不等比例递归的积分解',
  shortTitle: '4.7 Akra–Bazzi 递归',
  titleEn: 'Akra-Bazzi recurrences',
  source: { printed: [115, 125], pdf: [136, 146] },
  sourceNote: '本关对应原书 4.7 节（印刷页 115–125）。',
  prerequisites: [
    { label: '4.6 连续主定理', url: '#/ch04/s06' },
  ],
  stages: [
    {
      type: 'map',
      title: '当子问题大小不再相等',
      why: '主方法要求每个子问题都缩小同一个比例；真实算法常出现 n/5 与 7n/10 这样的不等比例分支。Akra–Bazzi 用一个平衡指数 p 和一条积分公式处理这类递归。',
      position: '本关承接 4.5 的主方法与 4.6 的连续证明：先处理 floors/ceilings 的扰动，再定义 polynomial-growth condition，最后求解 Akra–Bazzi 递归。',
      mathKit: [
        { title: '不等比例分支', body: '$T(n)=f(n)+\\sum_{i=1}^{k}a_iT(n/b_i)$，每个 $b_i$ 可以不同。' },
        { title: '平衡指数 p', body: '解唯一的 $p$：$\\sum_i a_i/b_i^p=1$。它替代主方法中的 $\\log_b a$。' },
        { title: '积分项', body: '结论为 $T(n)=\\Theta(n^p(1+\\int_1^n f(x)/x^{p+1}dx))$；积分衡量各层驱动成本的累积。' },
      ],
    },
    {
      type: 'intuition',
      title: '先找平衡点，再算累计成本',
      scene: '一项工作被拆给不同大小的团队：先找团队总产能刚好守恒的指数，再把每轮新增工作累加',
      body: [
        '当所有孩子都按同一比例缩小时，主方法只需一个 $a,b$。如果孩子大小不同，就不能用单一的树高；Akra–Bazzi 先找 p，使各分支按 $n^p$ 缩放后恰好守恒。',
        '找到 p 后，$n^p$ 是“叶子规模”的基准；驱动函数 f(x) 经过 $x^{p+1}$ 加权并积分，得到从小规模到 n 的累计贡献。',
        '本节示例 $T(n)=T(n/5)+T(7n/10)+n$ 的 p 约为 0.83978。因为 p<1，积分 $\\int_1^n x^{-p}dx$ 产生 $n^{1-p}$，最终整体为 $\\Theta(n)$。',
      ],
      interactive: { text: '阶段 5 用三条曲线显示不同分支比例；阶段 7 的计算器则让你调节 p，观察平衡方程两侧如何相等。' },
    },
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '原文先说明 floors/ceilings 的技术边界，再给出 Akra–Bazzi 形式、平衡指数和积分解。',
      blocks: [
        { kind: 'body', page: 115, en: 'This section provides an overview of two advanced topics related to divide-andconquer recurrences. The first deals with technicalities arising from the use of floors and ceilings, and the second discusses the Akra-Bazzi method, which in- volves a little calculus, for solving complicated divide-and-conquer recurrences.', zh: '本节有两个主题：取整扰动何时可以忽略，以及用一点微积分解决更复杂的分治递归。' },
        { kind: 'body', page: 115, en: 'In particular, we’ll look at the class of algorithmic divide-and-conquer recurrences originally studied by M. Akra and L. Bazzi [13]. These Akra-Bazzi recurrences take the form', zh: 'Akra–Bazzi 递归允许每个分支拥有不同的缩小比例，是主方法的严格推广。' },
        { kind: 'body', page: 115, en: 'T(n) = f(n) C k X i D1 a i T(n/b i ); (4.22) where k is a positive integer; all the constants a 1 ,a 2 ,…,a k 2 R are strictly positive; all the constants b 1 ,b 2 ,…,b k 2 R are strictly greater than 1; and the driving function f(n) is defined on sufficiently large nonnegative reals and is itself non- negative.', zh: '式 (4.22) 规定 $a_i>0$、$b_i>1$，并要求驱动函数在足够大的非负实数上有定义且非负。' },
        { kind: 'body', page: 115, en: 'Akra-Bazzi recurrences generalize the class of recurrences addressed by the master theorem. Whereas master recurrences characterize the running times of divide-and-conquer algorithms that break a problem into equal-sized subproblems', zh: '主方法处理等大小子问题；Akra–Bazzi 放宽这一点，代价是需要求根和积分。' },
        { kind: 'body', page: 116, en: 'A function f(n) defined on all sufficiently large positive reals satisfies the polynomial-growth condition if there exists a constant y n>0 such that the following holds: for every constant Ω ≥ 1, there exists a constant d > 1', zh: 'polynomial-growth condition 约束 f(Θ(n)) 的变化不能快得失控，从而允许处理取整和较小扰动。' },
        { kind: 'body', page: 117, en: 'The Akra-Bazzi method, not surprisingly, was developed to solve Akra-Bazzi re- currences (4.22), which by dint of Theorem 4.5, applies in the presence of floors and ceilings or even larger perturbations, as just discussed. The method involves first determining the unique real number p such that P k i D1 a i =b p i = 1.', zh: '算法第一步是求唯一实数 p，使 $\\sum_i a_i/b_i^p=1$；Theorem 4.5 让它能承受取整或更大的受控扰动。' },
      ],
      terms: [
        { en: 'polynomial-growth condition', zh: '多项式增长条件：限制 f 在常数倍输入上的变化幅度', page: 116 },
        { en: 'Akra-Bazzi method', zh: 'Akra–Bazzi 方法：用平衡指数与积分求解不等比例递归', page: 117 },
        { en: 'driving function', zh: '驱动函数：递归每个节点的非递归成本', page: 115 },
        { en: 'regularity condition', zh: '正则性条件：保证取整/扰动不改变渐进解的附加条件', page: 116 },
      ],
    },
    {
      type: 'pseudocode',
      title: 'Akra–Bazzi 求解路线（教学整理）',
      algo: 'AKRA-BAZZI-SOLVE',
      signature: 'solve T(n) = f(n) + Σ aᵢ T(n/bᵢ)',
      page: 117,
      lines: [
        { n: 1, code: 'verify polynomial-growth condition for f', zh: '确认 f 适合忽略 floors/ceilings，或显式保留扰动。' },
        { n: 2, code: 'find p such that Σ aᵢ / bᵢᵖ = 1', zh: '求平衡指数 p；左侧随 p 严格下降，因此解唯一。' },
        { n: 3, code: 'evaluate I(n) = ∫₁ⁿ f(x) / xᵖ⁺¹ dx', zh: '计算驱动函数的加权积分；必要时只需估计其渐进阶。' },
        { n: 4, code: 'return Θ(nᵖ · (1 + I(n)))', zh: '把叶子尺度 nᵖ 与积分累积相乘，得到总运行时间。' },
      ],
      vars: [
        { name: 'aᵢ, bᵢ', meaning: '第 i 个子问题的权重与缩小分母' },
        { name: 'p', meaning: '满足 Σ aᵢ/bᵢᵖ=1 的平衡指数' },
        { name: 'f(n)', meaning: '驱动函数，定义在足够大的非负实数上' },
        { name: 'I(n)', meaning: '积分 ∫₁ⁿ f(x)/xᵖ⁺¹ dx' },
      ],
      note: '原书没有把 Akra–Bazzi 写成程序伪代码；本表是对 p.117 的数学步骤整理。',
    },
    {
      type: 'visualize',
      title: '不等比例分支与平衡指数',
      viz: 'growth',
      chart: { xMax: 64, series: [
        { name: 'n/5 分支', expr: 'n / 5', color: '--viz-done' },
        { name: '7n/10 分支', expr: '7 * n / 10', color: '--viz-compare' },
        { name: '驱动 f(n)=n', expr: 'n', color: '--viz-active' },
      ] },
      note: '示例递归有两个不同大小的子问题：n/5 与 7n/10。图只展示规模关系；平衡方程与积分解在阶段 7 展开。',
      invariants: [{ label: '平衡方程 Σ aᵢ/bᵢᵖ = 1 决定 p，而不是任选一个 log_b a' }],
      tasks: [
        '观察 7n/10 比 n/5 大多少，说明为什么单一 b 不够。',
        '在阶段 4 找出 p 的方程；为什么左侧随 p 增大而下降？',
        '比较 f(n)=n 与 nᵖ：p<1 时，积分为什么仍会把答案推到 Θ(n)？',
      ],
    },
    {
      type: 'code',
      title: '用 C 数值求 p 并估计积分',
      intro: '这段程序针对原书示例 (4.24)：a₁=a₂=1、b₁=5、b₂=10/7、f(n)=n。二分法求 p 只是数值演示，最终 Θ(n) 结论仍来自原书的积分推导。',
      pseudocodeRef: 'AKRA-BAZZI-SOLVE',
      c: { file: 'akra_bazzi_demo.c', code: String.raw`/* akra_bazzi_demo.c -- 4.7 节：数值演示 Akra-Bazzi 示例。 */
#include <assert.h>
#include <math.h>
#include <stdio.h>

static double balance(double p)
{
    return pow(1.0 / 5.0, p) + pow(7.0 / 10.0, p);
}

static double solve_p(void)
{
    double lo = 0.0;
    double hi = 2.0;
    for (int i = 0; i < 80; i++) {
        const double mid = (lo + hi) / 2.0;
        if (balance(mid) > 1.0) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    return (lo + hi) / 2.0;
}

static double integral_linear_drive(double n, double p)
{
    /* f(x)=x, so ∫ x/x^(p+1) dx = ∫ x^(-p) dx. */
    return (pow(n, 1.0 - p) - 1.0) / (1.0 - p);
}

int main(void)
{
    const double p = solve_p();
    assert(p > 0.83 && p < 0.85);
    assert(balance(p) > 0.999999 && balance(p) < 1.000001);

    for (int n = 10; n <= 1000; n *= 10) {
        const double total = pow(n, p) * (1.0 + integral_linear_drive(n, p));
        printf("n=%d  p=%.5f  AB estimate=%.3f  estimate/n=%.3f\n",
               n, p, total, total / n);
    }
    puts("Akra-Bazzi numerical checks passed.");
    return 0;
}
`, },
      mapping: [
        { pc: 1, pcCode: 'verify polynomial-growth condition', c: '示例固定 f(n)=n；原书说明多项式增长条件保证扰动可忽略' },
        { pc: 2, pcCode: 'find p such that Σ aᵢ / bᵢᵖ = 1', c: 'solve_p() 用二分法求 balance(p)=1' },
        { pc: 3, pcCode: 'evaluate I(n) = ∫₁ⁿ f(x)/xᵖ⁺¹ dx', c: 'integral_linear_drive() 使用 f(x)=x 的原函数' },
        { pc: 4, pcCode: 'return Θ(nᵖ · (1 + I(n)))', c: 'total = n^p * (1 + integral)' },
      ],
    },
    {
      type: 'analyze',
      title: 'p 替代 log_b a，积分决定剩余增长',
      intro: 'Akra–Bazzi 的形状与主方法相似，但“叶子基准”来自平衡方程，内部成本通过积分进入。',
      claims: [
        { expr: 'T(n)=f(n)+\\sum_{i=1}^{k}a_iT(n/b_i)', when: 'Akra–Bazzi 递归的一般形式', page: 115, source: 'book' },
        { expr: '\\sum_{i=1}^{k}a_i/b_i^p=1', when: '唯一平衡指数 p 的定义', page: 117, source: 'book' },
        { expr: 'T(n)=\\Theta(n^p(1+\\int_1^n f(x)/x^{p+1}dx))', when: 'Akra–Bazzi 积分解', page: 117, source: 'book' },
        { expr: 'T(n)=\\Theta(n)', when: '示例 T(n)=T(n/5)+T(7n/10)+n', page: 118, source: 'book' },
        { expr: 'T_0(n)=\\Theta(T(n))', when: '满足 polynomial-growth 时，取整递归与连续递归同阶', page: 117, source: 'book' },
      ],
      tables: [{ caption: '主方法与 Akra–Bazzi 的对照', rows: [
        ['项目', '主方法', 'Akra–Bazzi'],
        ['子问题', '相同缩小比例 n/b', '可有不同 n/bᵢ'],
        ['平衡量', '$\\log_b a$', '$p$ 满足 $\\sum a_i/b_i^p=1$'],
        ['驱动成本', '三种情况直接查表', '$\\int_1^n f(x)/x^{p+1}dx$'],
      ] }],
      chart: { xMax: 32, series: [
        { name: 'n^p（p≈0.84）', expr: 'Math.pow(n, 0.83978)', color: '--viz-idle' },
        { name: 'Akra–Bazzi 示例 Θ(n)', expr: 'n', color: '--viz-done' },
      ] },
      derivations: [
        { kind: 'substitution', title: '示例为什么得到 Θ(n)', steps: [
          { tex: '(1/5)^0+(7/10)^0=2>1,\\quad (1/5)^1+(7/10)^1=0.9<1', zh: '左侧随 p 增大而下降，所以唯一 p 落在 0 与 1 之间；数值求解约为 0.83978。' },
          { tex: '\\int_1^n x^{-p}dx=\\frac{n^{1-p}-1}{1-p}', zh: 'f(x)=x 时，被积函数是 x^{-p}；因 p<1，积分主项为 n^{1-p}。' },
          { tex: 'n^p(1+n^{1-p})=\\Theta(n)', zh: '外面的 n^p 与积分的 n^{1-p} 相乘，得到 n。' },
        ] },
      ],
      note: '近似 p 只用于数值展示；渐进结论依靠 p∈(0,1) 和积分的符号推导，不依赖小数的最后几位。',
    },
    {
      type: 'prove',
      title: '为什么取整不会破坏“好递归”',
      statement: 'Then we have T 0 (n) = Θ(T(n)) .',
      page: 117,
      intro: '原书 Theorem 4.5 不展开完整证明，但给出关键条件：polynomial-growth 让 floors/ceilings 成为受控的小扰动。这里按“条件—扰动—结论”核对逻辑。',
      steps: [
        { title: '第一步 · 明确连续与离散两个递归', en: 'Let T(n) be a function defined on the nonnegative reals that satisfies recurrence (4.22), where f(n) satisfies the polynomial-growth condition. Let T 0 (n) be another function defined on the natural numbers also satisfying recurrence (4.22), except that each T(n/b i ) is replaced either with T. ⌈n/b i ⌉/ or with T.⌊n/b i ⌋/.', page: 116, body: ['T 在实数上，T′ 在自然数上；二者只有子问题参数是否取整这一处不同。'] },
        { title: '第二步 · polynomial-growth 控制扰动', en: 'Floors and ceilings represent a minor perturbation to the arguments in the recursion. By inequality (3.2) on page 64, they perturb an argument by at most 1.', page: 117, body: ['floor/ceiling 至多改变参数 1；多项式增长条件把这种常数级相对变化限制在常数因子内。'] },
        { title: '第三步 · 得到同阶解', en: 'Then we have T 0 (n) = Θ(T(n)) .', page: 117, body: ['所以离散实现的取整版本与连续模型具有相同的渐进阶；这正是把 Akra–Bazzi 用于算法运行时间所需的桥梁。'] },
      ],
      conclusion: 'Akra–Bazzi 不是“无条件忽略取整”：必须先检查 polynomial-growth condition；满足条件时，Theorem 4.5 才允许把离散与连续解视为同阶。',
    },
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: 'Akra–Bazzi 相比主方法最关键的扩展是什么？', options: ['允许权重 $a_i$ 取负数，从而覆盖有相减的递推', '允许不同子问题使用不同的缩小比例', '完全不需要驱动函数 $g(n)$，没有这一项', '只适用于整数 n'], answer: 1, why: '式 (4.22) 中每个 bᵢ 可以不同，主方法的等比例限制被放宽（p.115）。' },
        { kind: 'judge', q: '平衡指数 p 满足 Σ aᵢ/bᵢᵖ=1。', answer: true, why: '这是 Akra–Bazzi 方法的第一步（p.117）。' },
        { kind: 'single', q: '示例 T(n)=T(n/5)+T(7n/10)+n 中，为什么 p 在 0 与 1 之间？', options: ['因为 $p$ 在定理里就被定为 $1/2$，是预先给定的常数，不是算出来的', 'p=0 时和为 2，p=1 时和为 0.9，且左侧随 p 下降', '因为 n 总是整数', '因为积分不存在'], answer: 1, why: '书中用端点代入夹住 p，再利用单调性（p.117–118）。' },
        { kind: 'single', q: '当 f(x)=x 且 0<p<1 时，积分项的主阶是什么？', options: ['$n^p$', '$n^{1-p}$', '$\\lg n$', '$1/n$'], answer: 1, why: '∫x^{-p}dx=(n^{1-p}−1)/(1−p)，且 1−p>0（p.118）。' },
        { kind: 'judge', q: '只要 f(Θ(n))=Θ(f(n))，就一定可以忽略 Akra–Bazzi 递归中的 floors 和 ceilings。', answer: false, why: '书中特别指出 polynomial-growth condition 比这个直觉说法更强；需要满足正式条件（p.116）。' },
        { kind: 'simulate', q: '示例在 p=0 时平衡方程左侧是多少？', expect: [2], placeholder: '例如：2', why: '(1/5)^0+(7/10)^0=1+1=2。' },
        { kind: 'single', q: 'Theorem 4.5 的结论是什么？', options: ['T′(n)=O(T(n))', 'T′(n)=Θ(T(n))', 'T′(n)=T(n)+1', 'T′(n) 不可定义'], answer: 1, why: '满足 polynomial-growth 时，取整递归与连续递归同阶（p.116–117）。' },
      ],
      bookExercises: [
        { id: '4.7-2', page: 118, star: 0, statement: 'Show that f(n) = n 2 satisfies the polynomial-growth condition but that f(n) = 2 n does not.', hint: '定义（原书 p.116）要的是：存在 $n_0$，使得对每个常数 $\\alpha \\ge 1$ 都能找到 $d > 1$，对所有 $1 \\le \\beta \\le \\alpha$、$n \\ge n_0$ 有 $f(n)/d \\le f(\\beta n) \\le d f(n)$。$f(n) = n^2$：任给 $\\alpha$，取 $d = \\alpha^2$，则 $\\beta^2 n^2 \\le \\alpha^2 n^2 = d f(n)$，且 $f(n)/d = n^2/\\alpha^2 \\le \\beta^2 n^2$（因为 $\\beta \\ge 1$）—— 两侧都夹住。$f(n) = 2^n$：取 $\\beta = 2$（$\\alpha \\ge 2$ 就必须允许它），$f(2n)/f(n) = 2^n$ 随 $n$ 无界，任何固定 $d$ 迟早被顶穿，所以不存在这样的 $d$。★ 一句话：常数倍自变量对幂函数只是常数倍，对指数函数是指数倍。' },
        { id: '4.7-3', page: 118, star: 0, statement: 'Let f(n) be a function that satisfies the polynomial-growth condition. Prove that f(n) is asymptotically positive, that is, there exists a constant n 0 ≥ 0 such that f(n) ≥ 0 for all n ≥ n 0 .', hint: '别看定义长，把那个「对每个常数 $\\alpha \\ge 1$」取成最小的 $1$：这时 $\\beta$ 只能是 $1$，双侧界退成 $f(n)/d \\le f(n) \\le d f(n)$（对一切 $n \\ge n_0$，某个 $d > 1$）。取左半边移项：$f(n)(1/d - 1) \\le 0$。而 $d > 1$ 使 $1/d - 1$ 是**负**数，两边同除这个负数要把不等号翻向，于是 $f(n) \\ge 0$ 对一切 $n \\ge n_0$ 成立 —— 这正是渐近为正。★ 原书 p.116 那句「The definition also implies that $f(n)$ is asymptotically positive」说的就是这一步。' },
        { id: '4.7-5', page: 119, star: 0, statement: 'Use the Akra-Bazzi method to solve the following recurrences. a. T(n) = T(n/2) + T(n/3) + T(n/6) + n lg n. b. T(n) = 3T(n/3) + 8T(n/4) + n 2 = lg n. c. T(n) = .2/3/T(n/3) C .1/3/T(2n/3) C lg n. d. T(n) = .1/3/T(n/3) + 1/n. e. T(n) = 3T(n/3) + 3T(2n/3) + n 2 .', hint: '每条先解 $p$：$\\sum a_i b_i^{-p}=1$，再套 $T(n)=\\Theta\\!\\big(n^p(1+\\int_1^n g(u)/u^{p+1}\\,du)\\big)$。(a) $2^{-p}+3^{-p}+6^{-p}=1$ 的解是 $p=1$（代进去 $1/2+1/3+1/6=1$），配上 $g=n\\lg n$ 得 $\\Theta(n\\lg^2 n)$。(b) $3\\cdot3^{-p}+8\\cdot4^{-p}=1$：$p=1$ 时左边 3、$p=2$ 时 $5/6$，所以 $p\\in(1,2)$，老实解出来再积分。(c)(d) 的 $a_i$ 是分数，注意 $g$ 可正可负时结论只给 $\\Theta$ 的一边。(e) 与 (b) **不同形**：这里两个 $b_i$ 是 $3$ 与 $3/2$，$3\\cdot 3^{-p}+3(3/2)^{-p}=1$ 在 $p=3$ 时恰好成立（$1/9+8/9=1$），配上 $g=n^2$ 只需再算那个积分，得 $\\Theta(n^3)$。' },
        { id: '4-1', page: 119, star: 0, statement: 'Recurrence examples Give asymptotically tight upper and lower bounds for T(n) in each of the following algorithmic recurrences. Justify your answers. a. T(n) = 2T(n/2) + n 3 . b. T(n) = T(8n/11) + n. c. T(n) = 16T(n/4) + n 2 . d. T(n) = 4T(n/2) + n 2 lg n. e. T(n) = 8T(n/3) + n 2 . f. T(n) = 7T(n/2) + n 2 lg n. g. T(n) = 2T(n/4) + √n. h. T(n) = T(n − 2) + n 2 .', hint: '八条先分诊：a/c/d/e/f/g 是 $aT(n/b) + f(n)$ 的等比例形，主方法直接判；b、h 不等比例，用递归树或 Akra–Bazzi。本轮逐条核过的结论：a. $\\Theta(n^3)$（情况 3，$2(n/2)^3 = n^3/4$ 满足正则条件）；b. $\\Theta(n)$（每层规模乘 $8/11$，等比级数收敛到首项倍数）；c. $\\Theta(n^2 \\lg n)$（情况 2，$16(n/4)^2 = n^2$ 恰好平衡）；d. $\\Theta(n^2 \\lg^2 n)$（第 $i$ 层合计 $n^2(\\lg n - i)$，对 $i = 0..\\lg n$ 求和是等差）；e. $\\Theta(n^2)$（情况 3，$n^{\\log_3 8} = n^{1.893}$ 比 $n^2$ 低）；f. $\\Theta(n^{\\lg 7})$（情况 1，$\\lg 7 = 2.807$ 压得住 $n^2 \\lg n$）；g. $\\Theta(\\sqrt{n} \\lg n)$（情况 2，$2(n/4)^{1/2} = n^{1/2}$）；h. $\\Theta(n^3)$（$\\sum_i (n-2i)^2$）。★ 每条都要写「为什么这一档适用」，光给阶这题不给分。' },
        { id: '4-2', page: 120, star: 0, statement: 'Parameter-passing costs Throughout this book, we assume that parameter pass ing during procedure calls takes constant time, even if an N -element array is being passed. This assumption is valid in most systems because a pointer to the array is passed, not the array itself. This problem examines the implications of three parameter-passing strategies: 1. Arrays are passed by pointer. Time = Θ(1). 2. Arrays are passed by copying. Time = Θ(N) , where N is the size of the array. 3. Arrays are passed by copying only the subrange that might be accessed by the called procedure. Time = Θ(n) if the subarray contains n elements. Consider the following three algorithms: a. The recursive binary-search algorithm for finding a number in a sorted array (see Exercise 2.3-6). b. The MERGE-SORT procedure from Section 2.3.1. c. The MATRIX-MULTIPLY-RECURSIVE procedure from Section 4.1. Give nine recurrences T a1 (N,n),T a2 (N,n),…,T c3 (N,n) for the worst-case run- ning times of each of the three algorithms above when arrays and matrices are passed using each of the three parameter-passing strategies above. Solve your re- currences, giving tight asymptotic bounds.', hint: '三种策略的差别只在「每次调用多花多少」，把它并进非递归项即可（$N$ 是整个数组规模，本层子问题规模记 $n$）：a 二分查找：指针 $T(N) = T(N/2) + \\Theta(1) = \\Theta(\\lg N)$；整段复制 $T(N) = T(N/2) + \\Theta(N) = \\Theta(N)$；只拷将访问的那段 $T(N) = T(N/2) + \\Theta(N/2) = \\Theta(N)$ —— 后两种都从 $\\lg N$ 掉到 $\\Theta(N)$。b 归并排序：三种都是 $\\Theta(N \\lg N)$。整段复制每层多付 $\\Theta(N)$，与合并同阶，不改变结果。c 递归矩阵乘法：指针 $T(N) = 8T(N/2) + \\Theta(N^2) = \\Theta(N^3)$；整块复制时每次调用多拷固定几份 $N/2 \\times N/2$ 子块，仍是 $\\Theta(N^2)$，解出来还是 $\\Theta(N^3)$（只是常数变大）；只拷访问到的子块同此。★ 结论要说明白：被复制策略改变渐进阶的只有二分查找。' },
        { id: '4-3', page: 120, star: 0, statement: 'Solving recurrences with a change of variables Sometimes, a little algebraic manipulation can make an unknown recurrence simi- lar to one you have seen before. Let’s solve the recurrence T(n) = 2T ãp n ä C Θ(lg n) (4.25) by using the change-of-variables method. a. Define m = lg n and S(m) = T(2 m ). Rewrite recurrence (4.25) in terms of m and S(m). b. Solve your recurrence for S(m). c. Use your solution for S(m) to conclude that T(n) = Θ(lg n lg lg n). d. Sketch the recursion tree for recurrence (4.25), and use it to explain intuitively why the solution is T(n) = Θ(lg n lg lg n). Solve the following recurrences by changing variables: e. T(n) = 2T. √n/ C Θ(1). f. T(n) = 3T. 3 √n/ C Θ(n).', hint: '照题干 (a)–(c) 的路子：令 $m = \\lg n$、$S(m) = T(2^m)$，则 $\\sqrt{n} = 2^{m/2}$，$S(m) = 2S(m/2) + \\Theta(m)$，主方法情况 2 给 $S(m) = \\Theta(m \\lg m)$，换回去就是 (c) 的 $\\Theta(\\lg n \\lg \\lg n)$。照同一招做 (e)(f)：(e) $S(m) = 2S(m/2) + \\Theta(1) = \\Theta(m)$，故 $T(n) = \\Theta(\\lg n)$；(f) 令 $m = \\lg n$ 后 $S(m) = 3S(m/3) + \\Theta(2^m)$，情况 3 给 $\\Theta(2^m) = \\Theta(n)$。★ 换元的通用动作：根号（规模的除法）变成对 $m$ 的除法，$\\Theta(n)$ 变成 $\\Theta(2^m)$。' },
        { id: '4-4', page: 121, star: 0, statement: 'More recurrence examples Give asymptotically tight upper and lower bounds for T(n) in each of the following recurrences. Justify your answers. a. T(n) = 5T(n/3) + n lg n. b. T(n) = 3T(n/3) + n= lg n. c. T(n) = 8T(n/2) + n 3 √n. d. T(n) = 2T(n/2 − 2) + n/2. e. T(n) = 2T(n/2) + n= lg n. f. T(n) = T(n/2) + T(n/4) + T(n/8) + n. g. T(n) = T(n − 1) + 1/n. h. T(n) = T(n − 1) C lg n. i. T(n) = T(n − 2) + 1= lg n. j. T(n) = p nT. √n/ C n.', hint: '先分诊再动手。(a)(c) 主方法直接判；(b) 的 $n/\\lg n$ 与 $n^{\\log_3 3}=n$ 只差一个对数因子，落不进情况 1/2/3 的任何一档（情况 2 要 $\\lg^k n$ 且 $k\\ge 0$），得展开求和；(e) 同理。$(d)(g)(h)(i)$ 是 $T(n-c)$ 型，写成求和即可 —— (d) 记得 $n/2-2$ 仍属 Akra–Bazzi 允许的扰动。(f)(j) 看每层合计是常数还是几何级数。每条都要给**上下界**，别只写 $O$。' },
        { id: '4-5', page: 121, star: 0, statement: 'Fibonacci numbers This problem develops properties of the Fibonacci numbers, which are defined by recurrence (3.31) on page 69. We’ll explore the technique of generating func- tions to solve the Fibonacci recurrence. Define the generating function (or formal power series) F as F .´/ = 1 X i D0 F i ´ i D 0 C ´ C ´ 2 + 2´ 3 + 3´ 4 + 5´ 5 + 8´ 6 + 13´ 7 + 21´ 8 + • • • ; where F i is the i th Fibonacci number. a. Show that F .´/ = ´ C ´F .´/ C ´ 2 F .´/. b. Show that F .´/ = ´ 1 − ´ − ´ 2 D ´ .1 − Ω´/.1 − y Ω´/ D 1 p [ 1 1 − ]´ − 1 1 − y Ω´ ] ; where Ω is the golden ratio, and y Ω is its conjugate (see page 69). c. Show that F .´/ = 1 X i D0 1 p (Ω i − y Ω i )´ i : You may use without proof the generating-function version of equation (A(7) on page 1142, P 1 kD0 x k = 1=.1 − x). Because this equation involves a generating function, x is a formal variable, not a real-valued variable, so that you don’t have to worry about convergence of the summation or about the requirement in equation (A.7) that |x| <1, which doesn’t make sense here. d. Use part (c) to prove that F i = Ω i = p 5 for i >0, rounded to the nearest integer. (Hint: Observe that ˇ ˇ y Ω ˇ ˇ <1 .) e. …', hint: '生成函数这条路是纯代数。(a) 把 $F(x)=\\sum_{i\\ge0}F_ix^i$ 按 $F_i=F_{i-1}+F_{i-2}$ 代入，两条移位级数合回去就是 $x+xF(x)+x^2F(x)$。(b) 由 (a) 解出 $F(x)=x/(1-x-x^2)$，把分母因式分解成 $(1-\\phi x)(1-\\hat\\phi x)$ 再做部分分式。(c) 拿书后给的 $\\sum_{k\\ge0}x^k=1/(1-x)$ 逐项展开 (b) 的结果，对齐 $x^i$ 的系数。(d) 由 (c) 的系数读出 $F_i=\\phi^i/\\sqrt5$ 再取整。' },
        { id: '4-6', page: 122, star: 0, statement: 'Chip testing Professor Diogenes has n supposedly identical integrated-circuit chips that in prin- ciple are capable of testing each other. The professor’s test jig accommodates two chips at a time. When the jig is loaded, each chip tests the other and reports whether it is good or bad. A good chip always reports accurately whether the other chip is good or bad, but the professor cannot trust the answer of a bad chip. Thus, the four possible outcomes of a test are as follows: Chip A says Chip B says Conclusion B is good A is good both are good, or both are bad B is good A is bad at least one is bad B is bad A is good at least one is bad B is bad A is bad at least one is bad a. Show that if at least n/2 chips are bad, the professor cannot necessarily deter- mine which chips are good using any strategy based on this kind of pairwise test. Assume that the bad chips can conspire to fool the professor.', hint: '(a) 要证的是「坏芯片能共谋骗过**任何**策略」，所以别去设计算法：给坏芯片一个统一的撒谎规则 —— 永远报告对方是好的。于是「两坏互测」与「两好互测」的输出一模一样，任何只看测试结果的策略都无法区分这两种世界，而它们的正确答案相反。坏芯片数 $\\ge n/2$ 正是让这个对称保持不破的条件。' },
        { id: '4-7', page: 123, star: 0, statement: 'Monge arrays An m × n array A of real numbers is a Monge array if for all i , j , k, and l such that 1 ≤ i <k ≤ m and 1 ≤ j <l ≤ n, we have A[i; j ] + A[k; l] ≤ A[i; l] + A[k; j ] : In other words, whenever we pick two rows and two columns of a Monge array and consider the four elements at the intersections of the rows and the columns, the sum of the upper-left and lower-right elements is less than or equal to the sum of the lower-left and upper-right elements. For example, the following array is Monge: 10 17 13 28 23 17 22 16 29 23 24 28 22 34 24 11 13 6 17 7 45 44 32 37 23 36 33 19 21 6 75 66 51 53 34 a. Prove that an array is Monge if and only if for all i = 1,2,…,m − 1 and j = 1,2,…,n − 1, we have A[i; j ] + A[i + 1,j + 1] ≤ A[i,j + 1] + A[i + 1; j ] : (Hint: For the "if" part, use induction separately on rows and columns.) b. The following array is not Monge. Change one element in order to make it Monge. (Hint: Use part (a).) 37 23 22 32 21 6 7 10 53 34 30 31 32 13 9 6 43 21 15 8 c. Let f(i) be the index of the column containing the leftmost minimum element of row i . Prove that f(1) ≤ f(2) ≤ • • • ≤ f(m) for any m × n Monge array. d. …', hint: '(a) 反向（局部 $2 \\times 2$ ⟹ 整体）就按提示做两次归纳：先固定 $i,k$ 对列区间 $[j,l]$ 归纳，再把两列合并成一段段相邻列相加；相邻项要能对上，别写成跨列。(b) 先用 (a) 扫 16 个 $2 \\times 2$ 小方格：本轮实算，题给数组只有一处违例（第 1–2 行、第 2–3 列：$23 + 7 > 22 + 6$）。再枚举「改一格」的全部可能（本轮扫过值域 $-50..200$）：可行的只有把 $A[1,3]$ 改成 24 至 29 之间的数，或把 $A[2,3]$ 改成 2 至 5 之间的数。(c) 反证：若 $f(i) > f(i+1)$，用 $i$ 行、$i+1$ 行和这两列写出的 $2 \\times 2$ 不等式会跟「各自最左最小」矛盾。(d) 已知偶数行的最左最小列，第 $i$（奇）行的答案只会落在 $f(i-1)$ 与 $f(i+1)$ 之间（含端点），于是各行扫的列数加起来望远镜成 $\\sum (f(i+1) - f(i-1) + 1) = O(m + n)$。(e) $T(m,n) = T(m/2, n) + O(m + n)$，逐层展开得 $O(m + n \\lg m)$。' },
      ],
    },
  ],
};
