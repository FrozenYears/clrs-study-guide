/* =============================================================================
 * 第 A 章 A.1 —— 第 s01 关：A.1 Summation formulas and properties
 *
 * 原文锚点：印刷页 1140–1144（pdf_index 1161–1165）
 *
 * 引述 en 全部逐字取自 corpus_appendix.txt（已用闸门工具预检通过）。
 * 闸门对英文引述没有相似度阈值，差一个字符都会被拒 —— 所以一律照抄语料。
 *
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's01',
  id: 'chA/s01',
  chapter: 'A',
  section: 'A.1',
  title: '求和公式与性质',
  shortTitle: 'A.1 求和公式与性质',
  titleEn: 'Summation formulas and properties',
  source: { printed: [1140, 1144], pdf: [1161, 1165] },
  sourceNote: '本关对应原书 A.1 节（印刷页 1140–1144）。',
  prerequisites: [],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '先看清这一关的位置',
      why: '算法里但凡有 `while` / `for` 循环，运行时间就能写成「每轮耗时」的和。插入排序第 i 轮最坏耗时 $\\Theta(i)$，全部加起来得到 $\\Theta(n^2)$ 的上界 —— 这就是**为什么要会操纵与定界求和**。A.1 先把常用的求和公式列清楚，A.2 再教你怎么给算不出的和定界。',
      position: '求和是全书渐进分析的地基：第 2 章插入排序、第 4 章分治递推、第 9 章平摊分析都反复用到 $\\sum k$、$\\sum k^2$、调和数 $H_n$。先把它练熟，后面每一章都省力。',
      unlocks: [
        { label: 'A.2 定和式的界', url: '#/appendix/a/s02' },
      ],
      mathKit: [
        { title: '线性性 (A.1)', body: '$\\sum (c\\cdot a_k + b_k) = c\\sum a_k + \\sum b_k$；对含渐进记号与无穷收敛级数同样成立。' },
        { title: '算术级数 (A.2)', body: '$\\sum_{k=1}^{n} k = n(n+1)/2 = \\Theta(n^2)$。' },
        { title: '几何级数 (A.6)', body: '$\\sum_{k=0}^{n} x^k = (x^{n+1}-1)/(x-1)$（$x\\ne1$）；无穷时 $\\sum_{k=0}^{\\infty}x^k = 1/(1-x)$（$|x|<1$）。' },
        { title: '调和级数 (A.9)', body: '$H_n = \\sum_{k=1}^{n} 1/k = \\ln n + O(1) = \\Theta(\\lg n)$。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '一个楼梯，和一把尺子',
      scene: 'C 程序 part 1 / part 2',
      body: [
        '★★ 想象一座 n 级楼梯：第 1 级 1 块砖、第 2 级 2 块、……、第 n 级 n 块。问一共有多少块砖？高斯的办法是「首尾配对」：第 1 级配第 n 级得 $n+1$，第 2 级配第 n−1 级也得 $n+1$，一共 $n/2$ 对，所以总数 $n(n+1)/2$。',
        '★ 换成「每块砖宽度翻一倍」的楼梯（第 k 级宽 $2^{k-1}$），前 n 级总宽就是几何级数 $\\sum_{k=0}^{n-1}2^k = 2^n-1$ —— 它比任何多项式楼梯都长得快得多，这就是「指数爆炸」。',
        '★ 再换成「第 k 级宽 $1/k$」的楼梯，前 n 级总宽 $H_n = 1 + 1/2 + \\dots + 1/n$。它只随 $\\lg n$ 缓慢增长：n 翻 1000 倍，总宽才涨约 10。part 3 会实测这个反直觉的事实。',
        '⚠ A.1 不证明公式（证明留给 A.2），它先把公式摆出来让你认得；A.2 再教你怎么给「算不出闭式」的和定上下界。',
      ],
      interactive: { text: '' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写；语料里的排版伪影（如 $\\Theta$ 写成 Θ、等号写成 D、加号写成 C）也原样保留。',
      blocks: [
        { kind: 'body', page: 1140,
          en: 'When an algorithm contains an iterative control construct such as a while or for loop, you can express its running time as the sum of the times spent on each execution of the body of the loop. For example, Section 2.2 argued that the i th iteration of insertion sort took time proportional to i in the worst case. Adding up the time spent on each iteration produced the summation (or series) P n i D2 i . Evaluating this summation resulted in a bound of Θ(n 2 ) on the worst-case running time of the algorithm. This example illustrates why you should know how to manipulate and bound summations.',
          zh: '★★ 全书为什么需要求和：循环的运行时间就是「每轮耗时」的和；插入排序由此得到 $\\Theta(n^2)$ 上界。' },
        { kind: 'body', page: 1140,
          en: 'Section A.1 lists several basic formulas involving summations. Section A.2 offers useful techniques for bounding summations. The formulas in Section A.1 appear without proof, though proofs for some of the m appear in Section A.2 to illustrate the methods of that section. You can find most of the other proofs in any calculus text.',
          zh: '★ A.1 列公式、A.2 教定界；A.1 的公式大多不在此证明，部分证明放在 A.2 演示方法。' },
        { kind: 'body', page: 1140,
          en: 'Given a sequence a 1 ,a 2 ,…,a n of numbers, where n is a nonnegative integer, the finite sum a 1 + a 2 + • • • + a n can be expressed as P n kD1 a k . If n = 0, the value of the summation is defined to be 0. The value of a finite series is always well defined, and the order in which its terms are added does not matter.',
          zh: '★ 有限和的记号 $\\sum_{k=1}^{n} a_k$：$n=0$ 时定义为 0；有限和可任意调换顺序。' },
        { kind: 'body', page: 1140,
          en: 'Given an infinite sequence a 1 ,a 2 ,… of numbers, we can write their infinite sum a 1 + a 2 + • • • as P 1 kD1 a k , which means lim n!1',
          zh: '★ 无穷级数 $\\sum_{k=1}^{\\infty} a_k = \\lim_{n\\to\\infty}\\sum_{k=1}^{n}a_k$；极限不存在就发散，否则收敛。' },
        { kind: 'body', page: 1140,
          en: 'P n kD1 a k . If the limit does not exist, the series diverges, and otherwise, it converges. The terms of a convergent series cannot always be added in any order. You can, however, rearrange the terms of an absolutely convergent series, that is, a series P 1 kD1 a k for which the series P 1 kD1 ja k j also converges.',
          zh: '★ 收敛级数一般不能任意换序；但**绝对收敛**级数可以重排（即 $\\sum|a_k|$ 也收敛的）。' },
        { kind: 'body', page: 1141,
          en: 'For any real number c and any finite sequences a 1 ,a 2 ,…,a n and b 1 ,b 2 ,…,b n , n X kD1',
          zh: '★ 线性性（A.1）的起点：$\\sum(c a_k + b_k)$ 可拆成 $c\\sum a_k + \\sum b_k$（下面那行就是完整公式）。' },
        { kind: 'body', page: 1142,
          en: 'For real x ≠ 1, the summation n X kD0 x k = 1 + x + x 2 + • • • + x n is a geometric series and has the value n X kD0 x k = x n + 1 − 1 x − 1 : (A.6)',
          zh: '★★ 几何级数闭式（A.6）：$\\sum_{k=0}^{n}x^k = (x^{n+1}-1)/(x-1)$；$|x|<1$ 时无穷和收敛到 $1/(1-x)$。' },
        { kind: 'body', page: 1142,
          en: 'D ln n + O(1): (A.9)',
          zh: '★★ 调和数（A.9）：$H_n = \\ln n + O(1)$ —— 它增长得像对数，而不是线性。' },
        { kind: 'body', page: 1143,
          en: '(a k − a k−1 ) = a n − a 0 ; (A.12) since each of the terms a 1 ,a 2 ,…,a n−1 is added in exactly once and subtracted out exactly once. We say that the sum telescopes. Similarly, n−1 X kD0 (a k − a k + 1 ) = a 0 − a n :',
          zh: '★★ 望远镜（A.12）：$\\sum_{k=1}^{n}(a_k-a_{k-1}) = a_n-a_0$，中间项正负相消；A.2 的分裂与调和界都靠它。' },
      ],
      terms: [
        { en: 'arithmetic series', zh: '算术级数', page: 1141 },
        { en: 'geometric series', zh: '几何级数', page: 1142 },
        { en: 'harmonic number', zh: '调和数 H_n', page: 1142 },
        { en: 'telescopes', zh: '望远镜（逐项相消）', page: 1143 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    {
      type: 'pseudocode',
      title: '本节在原书里没有伪代码框',
      algo: null,
      signature: '',
      page: 1140,
      lines: [],
      vars: [],
      note: '★ 附录 A 用公式与不等式讲求和，没有算法伪代码框；本关的实现对照见下一阶段 C 程序（算术级数与平方和的循环 vs 公式、几何级数闭式、调和数实测）。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '看着它们怎么长',
      panels: [
        {
          title: '线性项、算术和、平方和的差距',
          viz: 'growth',
          chart: {
            xMax: 12,
            series: [
              { name: 'k（单项）', expr: 'n', color: '--viz-result' },
              { name: 'Σk = n(n+1)/2', expr: 'n*(n+1)/2', color: '--viz-compare' },
              { name: 'Σk² = n(n+1)(2n+1)/6', expr: 'n*(n+1)*(2*n+1)/6', color: '--viz-done' },
              { name: 'Σ 2^k − 1（几何）', expr: 'Math.pow(2,n)-1', color: '--viz-active' },
            ],
          },
          note: '★ 多项式求和（线性项、一次和、二次和）之间只差常数阶；但几何级数 $\\sum 2^k$ 到第 12 项就冲到 4095，把前面全压成地平线 —— 这就是「指数碾压多项式」。',
        },
      ],
      tasks: ['对照 C 程序 part 1：Σk(100)=5050、Σk²(100)=338350，看曲线在 n=100 处的纵坐标。', '把 xMax 想成 n，体会为什么调和数 $H_n$ 只长到 $\\lg n$ 却慢得反常。'],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从公式到 C',
      intro: 'A.1 没有伪代码；这一段把三条核心公式（算术级数、平方和、几何级数、调和数）用 C 循环与闭式对照，断言两者一致。',
      pseudocodeRef: null,
      c:{file:'summations.c',code:String.raw`/* summations.c -- 附录 A：求和公式（A.1）与定界技术（A.2）的 C 实测。
 *
 * 关键数字（全部由断言确认）：
 *   part 1  算术级数 Σk (n=100)：循环 5050，公式 n(n+1)/2 = 5050；
 *           平方和 Σk² (n=100)：循环 338350，公式 n(n+1)(2n+1)/6 = 338350。
 *   part 2  几何级数 Σx^k (x=0.5,n=10)：1.9990234375；Σx^k (x=2,n=10)=2047；
 *           Σ (1/2)^k (k=0..10) = 2 − 2^-10 = 1.9990234375。
 *   part 3  调和数 H_1000 ≈ 7.48547；H_n − (ln n + γ) ≈ 0.0005（γ≈0.57721566）；
 *           H_1000 介于 0.5·lg 1000 与 lg 1000 之间 —— 数值支撑 H_n = Θ(lg n)。
 *   part 4  分裂下界：Σ_{k=1}^{100} k·lg k ≥ (100/2)·lg(100/2)·(100/2) ≈ 14109.6。
 *   part 5  望远镜：Σ_{k=1}^{100}(1/k − 1/(k+1)) = 1 − 1/101 ≈ 0.990099。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o sum_a.exe summations.c   （必要时结尾加 -lm）
 */

#include <assert.h>
#include <stdio.h>
#include <math.h>

/* 以 2 为底的对数（避开 log2 的可移植性问题）。 */
static double lg(double x) { return log(x) / log(2.0); }

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* ===== part 1：A.1 算术级数 Σk 与平方和 Σk² ===== */
    {
        const int n = 100;
        long long sum_k = 0, sum_k2 = 0;
        for (int k = 1; k <= n; k++) {
            sum_k  += k;
            sum_k2 += (long long)k * k;
        }
        long long f_k  = (long long)n * (n + 1) / 2;
        long long f_k2 = (long long)n * (n + 1) * (2 * n + 1) / 6;
        printf("part 1: Σk(1..100)        循环=%lld, 公式 n(n+1)/2=%lld\n", sum_k, f_k);
        printf("        Σk²(1..100)        循环=%lld, 公式 n(n+1)(2n+1)/6=%lld\n", sum_k2, f_k2);
        assert(sum_k == f_k);
        assert(sum_k2 == f_k2);
    }

    /* ===== part 2：A.1 几何级数 Σx^k 与 Σ 1/2^k ===== */
    {
        const int n = 10;
        /* x = 0.5 */
        double s_half = 0.0, p = 1.0;
        for (int k = 0; k <= n; k++) { s_half += p; p *= 0.5; }
        double f_half = (pow(0.5, n + 1) - 1.0) / (0.5 - 1.0);
        printf("part 2: Σ(0.5)^k (k=0..10) 循环=%g, 闭式=%g\n", s_half, f_half);
        assert(fabs(s_half - f_half) < 1e-9);

        /* x = 2 */
        long long s_two = 0, p2 = 1;
        for (int k = 0; k <= n; k++) { s_two += p2; p2 *= 2; }
        long long f_two = (long long)(pow(2.0, n + 1) - 1.0) / (2.0 - 1.0);
        printf("        Σ2^k (k=0..10)      循环=%lld, 闭式=%lld\n", s_two, f_two);
        assert(s_two == f_two);

        /* Σ (1/2)^k (k=0..n) = 2 − 2^-n */
        double s_inv = 0.0;
        for (int k = 0; k <= n; k++) s_inv += 1.0 / (1LL << k);
        double f_inv = 2.0 - pow(2.0, -n);
        printf("        Σ 1/2^k (k=0..10)   循环=%g, 闭式 2−2^-n=%g\n", s_inv, f_inv);
        assert(fabs(s_inv - f_inv) < 1e-9);
    }

    /* ===== part 3：A.1 调和级数 H_n 与 ln n + γ ===== */
    {
        const int n = 1000;
        double H = 0.0;
        for (int k = 1; k <= n; k++) H += 1.0 / k;
        const double gamma = 0.5772156649015329;
        double ln_n = log((double)n);
        double approx = ln_n + gamma;
        double diff = H - approx;
        double lg_n = lg((double)n);
        printf("part 3: H_%d = %g\n", n, H);
        printf("        ln(%d)=%g, ln(%d)+γ=%g, 差=%g\n", n, ln_n, n, approx, diff);
        printf("        lg(%d)=%g, H_%d/lg(%d)=%g (Θ(lg n) 的数值支撑)\n",
               n, lg_n, n, n, H / lg_n);
        assert(fabs(diff) < 0.01);
        assert(H >= 0.5 * lg_n && H <= lg_n);   /* H_n = Θ(lg n) 的上下界常数 */
    }

    /* ===== part 4：A.2 分裂求和下界 Σ k·lg k ≥ (n/2)·lg(n/2)·(n/2) ===== */
    {
        const int n = 100;                 /* 偶数，便于直接套用 A.2 的分裂 */
        double total = 0.0;
        for (int k = 1; k <= n; k++) total += (double)k * lg((double)k);
        double bound = (double)(n / 2) * lg((double)(n / 2)) * (double)(n / 2);
        printf("part 4: Σ k·lg k (k=1..%d)=%g\n", n, total);
        printf("        分裂下界 (n/2)·lg(n/2)·(n/2)=%g\n", bound);
        assert(total >= bound - 1e-6);
        assert(total > 0.0);
    }

    /* ===== part 5：A.2 望远镜级数 Σ(1/k − 1/(k+1)) = 1 − 1/(n+1) ===== */
    {
        const int n = 100;
        double s = 0.0;
        for (int k = 1; k <= n; k++) s += 1.0 / k - 1.0 / (k + 1);
        double f = 1.0 - 1.0 / (n + 1);
        printf("part 5: Σ(1/k − 1/(k+1)) (k=1..%d)=%g, 闭式 1−1/(n+1)=%g\n", n, s, f);
        assert(fabs(s - f) < 1e-12);
    }

    puts("all checks passed.");
    return 0;
}
`,
        notes: [
          { line: 37, zh: '★★ 循环累加 Σk 与公式 n(n+1)/2 对照：n=100 都得 5050。' },
          { line: 38, zh: '★★ 平方和 Σk² 循环 338350，公式 n(n+1)(2n+1)/6 同值。' },
          { line: 50, zh: '★★ 几何级数 x=0.5：循环与闭式 (x^{n+1}−1)/(x−1) 都得 1.9990234375。' },
          { line: 57, zh: '★★ 几何级数 x=2：Σ2^k = 2^{n+1}−1 = 2047。' },
          { line: 64, zh: '★★ Σ1/2^k = 2 − 2^{−n}：循环与闭式一致。' },
          { line: 78, zh: '★★ 调和数 H_1000 ≈ 7.485；与 ln n + γ 的差约 0.0005。' },
          { line: 83, zh: '★★ H_n 介于 0.5·lg n 与 lg n 之间 —— 数值支撑 H_n = Θ(lg n)。' },
        ],
        tests: [
          { in: 'Σk (n=100)', out: '5050（循环与公式一致）' },
          { in: 'Σ(0.5)^k (n=10)', out: '1.9990234375' },
          { in: 'H_1000', out: '≈ 7.485，与 ln n+γ 差约 0.0005' },
        ],
        mapping: [
          { pc: 1, pcCode: 'Σ_{k=1}^{n} k 循环累加', c: '`long long f_k = (long long)n * (n + 1) / 2;`（第 35 行）' },
          { pc: 2, pcCode: '几何级数闭式', c: '`double f_half = (pow(0.5, n + 1) - 1.0) / (0.5 - 1.0);`（第 49 行）' },
          { pc: 3, pcCode: '调和数 H_n', c: '`for (int k = 1; k <= n; k++) H += 1.0 / k;`（第 72 行）' },
        ],
      },
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '一本账：哪些和是哪个阶',
      intro: '把 A.1 的公式按「闭式 / 渐进阶」整理成一张账；带 ★ 的阶由闭式立得，带 ※ 的由（A.9）推出（本站推导）。',
      claims: [
        { expr: 'n(n+1)/2', when: '算术级数 $\\sum_{k=1}^{n} k$', page: [1141], source: 'book' },
        { expr: '\\Theta(n^2)', when: '算术级数的增长阶（A.2）', page: [1141], source: 'book' },
        { expr: '(x^{n+1}-1)/(x-1)', when: '几何级数 $\\sum_{k=0}^{n} x^k$（$x\\ne1$，A.6）', page: [1142], source: 'book' },
        { expr: '\\ln n + O(1)', when: '调和数 $H_n$（A.9）', page: [1142], source: 'book' },
        { expr: '\\Theta(\\lg n)', when: '$H_n$ 的增长阶（由 A.9 推出）', page: [1142], source: 'instructor' },
      ],
      tables: [
        { caption: 'A.1 常用求和公式速查', rows: [
          ['和式', '闭式 / 渐进阶', '出处'],
          ['$\\sum_{k=1}^{n} k$', '$n(n+1)/2 = \\Theta(n^2)$', '(A.2)'],
          ['$\\sum_{k=1}^{n} k^2$', '$n(n+1)(2n+1)/6 = \\Theta(n^3)$', '(A.4)'],
          ['$\\sum_{k=0}^{n} x^k$', '$(x^{n+1}-1)/(x-1)$（$x\\ne1$）', '(A.6)'],
          ['$H_n=\\sum_{k=1}^{n} 1/k$', '$\\ln n + O(1) = \\Theta(\\lg n)$', '(A.9)'],
        ] },
      ],
      chart: {
        series: [
          { name: 'Σk = n(n+1)/2', expr: 'n*(n+1)/2', color: '--viz-compare' },
          { name: 'Σk² = n(n+1)(2n+1)/6', expr: 'n*(n+1)*(2*n+1)/6', color: '--viz-done' },
        ],
        xMax: 30,
      },
      derivations: [
        { kind: 'summation', title: '算术级数 Σk 怎么来的（A.2 的证明在 A.2）', steps: [
          { tex: 'S = 1 + 2 + \\dots + n', zh: '★★ 把和正着写一遍。' },
          { tex: 'S = n + (n-1) + \\dots + 1', zh: '★ 再把和倒着写一遍，两式每一项相加都等于 $n+1$。' },
          { tex: '2S = n(n+1) \\quad\\Rightarrow\\quad S = n(n+1)/2', zh: '★★ 一共 n 对，所以 $2S = n(n+1)$，得到闭式；它是 $\\Theta(n^2)$。' },
        ] },
      ],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: '凭什么说它一定对：算术级数公式',
      statement: 'The summation n X kD1 k = 1 + 2 + • • • + n; is an arithmetic series and has the value n X kD1 k = n(n + 1) D Θ(n 2 ): (A.2)',
      page: 1141,
      intro: '★ 原书把（A.2）的证明放在 A.2 用**数学归纳法**演示。下面三步按「基础 / 保持 / 终止」组织：基础验 n=1，保持证 n→n+1，终止得到对所有 n 成立。',
      steps: [
        {
          title: '第一步 · 初始化（Initialization，n=1）',
          en: 'For n = 1, we have that n(n + 1)/2 = 1 • 2/2 = 1, which equals P 1 kD1 k.',
          page: 1145,
          body: ['★★ 基础情形：左边公式给 $1\\cdot2/2 = 1$，右边 $\\sum_{k=1}^{1} k = 1$，两边相等，成立。'] },
        {
          title: '第二步 · 保持（Maintenance，归纳步）',
          en: 'With the inductive assumption that it holds for n, we prove that it holds for n + 1. We have n + 1 X kD1 k = n X kD1 k C (n + 1)',
          page: 1145,
          body: ['★ 假设对 n 成立（即 $\\sum_{k=1}^{n}k = n(n+1)/2$），则',
            '$$\\sum_{k=1}^{n+1}k = \\sum_{k=1}^{n}k + (n+1) = \\frac{n(n+1)}{2} + (n+1).$$'] },
        {
          title: '第三步 · 终止（Termination，化简）',
          en: 'D n(n + 1) C (n + 1) D n 2 + n + 2n + 2 D (n + 1).n + 2/',
          page: 1145,
          body: ['★★ 把上一步提出 $(n+1)$：$\\frac{n(n+1)}{2} + (n+1) = (n+1)\\frac{n+2}{2} = \\frac{(n+1)(n+2)}{2}$，',
            '这正是把公式里的 $n$ 换成 $n+1$ 的结果 —— 归纳完成，故（A.2）对所有 $n\\ge1$ 成立。∎'] },
      ],
      conclusion: '★ 结论：算术级数 $\\sum_{k=1}^{n}k = n(n+1)/2$ 经归纳法严格成立；它是全书的「阶」基准，后面分治与平摊分析反复引用。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: '$\\sum_{k=1}^{100} k$ 的值是多少？', options: ['4950', '5050', '5150', '10000'], answer: 1,
          why: '★ 公式 $n(n+1)/2 = 100\\cdot101/2 = 5050$；C 程序 part 1 循环也算出 5050。' },
        { kind: 'judge', q: '调和数 $H_n = \\Theta(n)$（随 n 线性增长）。', answer: false,
          why: '★ 由（A.9）$H_n = \\ln n + O(1) = \\Theta(\\lg n)$，只随对数缓慢增长。' },
        { kind: 'judge', q: '几何级数 $\\sum_{k=0}^{n} 2^k$ 的闭式是 $2^{n+1}-1$。', answer: true,
          why: '★ （A.6）代入 $x=2$：$\\sum_{k=0}^{n}2^k = (2^{n+1}-1)/(2-1) = 2^{n+1}-1$；C 程序 part 2 得 2047（n=10）。' },
        { kind: 'single', q: '线性性 $\\sum (c\\cdot a_k)$ 等于什么？', options: ['$c\\cdot\\sum a_k$', '$\\sum a_k / c$', '$(\\sum a_k)^c$', '$c + \\sum a_k$'], answer: 0,
          why: '★ 线性性（A.1）：$\\sum(c a_k)=c\\sum a_k$；这是「提取常数因子」。' },
        { kind: 'simulate', q: 'C 程序 part 1：n=100 时 $\\sum_{k=1}^{100} k^2$ 的循环累加值是多少？（提示：公式 $n(n+1)(2n+1)/6$）', expect: [338350], placeholder: '例如：338350',
          why: '★ $100\\cdot101\\cdot201/6 = 338350$；程序里循环与公式同值才通过断言。' },
        { kind: 'judge', q: '无穷几何级数 $\\sum_{k=0}^{\\infty}(1/2)^k$ 收敛到 2。', answer: true,
          why: '★ （A.7）$|x|<1$ 时和为 $1/(1-x) = 1/(1-1/2) = 2$；C 程序 part 2 的有限和已逼近 1.99902。' },
        { kind: 'single', q: '$\\sum_{k=1}^{n} k$ 的渐近阶是？', options: ['$\\Theta(n)$', '$\\Theta(n^2)$', '$\\Theta(n\\lg n)$', '$\\Theta(n^3)$'], answer: 1,
          why: '★ （A.2）闭式 $n(n+1)/2 = \\Theta(n^2)$。' },
      ],
      bookExercises: [],
    },
  ],
};
