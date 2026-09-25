/* =============================================================================
 * 第 A 章 A.2 —— 第 s02 关：A.2 Bounding summations
 *
 * 原文锚点：印刷页 1145–1152（pdf_index 1166–1173）
 *
 * 引述 en 全部逐字取自 corpus_appendix.txt（已用检查工具预检通过）。
 * 检查对英文引述没有相似度阈值，差一个字符都会被拒 —— 所以一律照抄语料。
 *
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's02',
  id: 'chA/s02',
  chapter: 'A',
  section: 'A.2',
  title: '定和式的界',
  shortTitle: 'A.2 定和式的界',
  titleEn: 'Bounding summations',
  source: { printed: [1145, 1152], pdf: [1166, 1173] },
  sourceNote: '本关对应原书 A.2 节（印刷页 1145–1152）。',
  prerequisites: [
    { label: 'A.1 求和公式与性质', url: '#/appendix/a/s01' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '先看清这一关的位置',
      why: 'A.1 把「能算出闭式」的和列清楚了；但算法分析里大量和**没有**简单闭式——比如 $\\sum k\\lg k$、$\\sum 3^k$。A.2 教四招：归纳法、逐项取最大、用几何级数界、分裂求和、积分近似，目标是给出**渐进上下界**。',
      position: '定界是渐进分析的日常工具：第 4 章主定理的递推、第 9 章平摊分析的势能、第 6 章堆的级数都依赖这里的技术。A.1 给你公式，A.2 给你「算不出时怎么夹」。',
      unlocks: [],
      mathKit: [
        { title: '逐项取最大 (A.15)', body: '若每项 $a_k\\le a_{\\max}$，则 $\\sum_{k=1}^{n}a_k\\le n\\cdot a_{\\max}$；弱但常够用。' },
        { title: '几何级数界 (A.16)', body: '若比值 $a_{k+1}/a_k\\le r<1$ **恒成立**，则 $\\sum_{k=0}^{n}a_k\\le a_0/(1-r)$。' },
        { title: '分裂求和', body: '把和按下标分段或丢掉前若干项（每项与 n 无关时）：$\\sum_{k=0}^{n}a_k = \\Theta(1)+\\sum_{k=k_0}^{n}a_k$。' },
        { title: '积分近似 (A.18)/(A.19)', body: '对单调 $f$：$\\int_{m-1}^{n}f\\le\\sum_{k=m}^{n}f(k)\\le\\int_{m}^{n+1}f$；证 $H_n=\\Theta(\\lg n)$ 的关键。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '夹三明治',
      scene: 'C 程序 part 4 / part 5',
      body: [
        '★★ 想知道一摞书有多高，又懒得一本本量？取「最薄那本 × 本数」当下界、「最厚那本 × 本数」当上界——这就是**逐项取最大**（A.15）。它很弱，但经常够用。',
        '★ 书堆里如果每本都比前一本薄一个固定比例（比如总厚度的 2/3），那整堆就被一个几何级数包住（A.16）——再也不会爆炸。',
        '★ 真正的杀手锏是**分裂求和**：把书堆从中间劈开，丢掉前面一截常数本，只仔细估计后面一截。算术和 $\\sum k$ 用这招能从「每项取 1 的下界 n」一下子升级成紧的 $\\Omega(n^2)$；part 4 用同样的思路给 $\\sum k\\lg k$ 定下界。',
        '⚠ 陷阱（原书第 6 段）：调和级数相邻项比值 $k/(k+1)<1$，但**不存在恒定**的 $r<1$，所以它**不能**被几何级数界住——这正是「比值<1」和「比值≤常数 r<1」的天壤之别。',
      ],
      interactive: { text: '' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄；语料伪影（D=等号、C=加号、(AB)/C 式断字）原样保留。',
      blocks: [
        { kind: 'body', page: 1145,
          en: 'Prove that P n kD1 p k lg k = Θ(n 3/2 lg 1/2 n). (Hint: Show the asymptotic upper and lower bounds separately.)',
          zh: '★ A.2 的开场习题：证 $\\sum\\sqrt{k}\\lg k = \\Theta(n^{3/2}\\lg^{1/2} n)$；上下界分开证（分裂 + 积分是套路）。' },
        { kind: 'body', page: 1145,
          en: 'Show that P n kD1 1=.2k − 1) = ln. √n/ C O(1) by manipulating the harmonic series.',
          zh: '★ 习题：通过操作调和级数证 $\\sum 1/(2k-1)$ 与 $\\ln\\sqrt{n}$ 只差常数（即 $\\Theta(\\lg n)$）。' },
        { kind: 'body', page: 1145,
          en: 'You can choose from several techniques to bound the summations that describe the running times of algorithms. Here are some of the most frequently used methods.',
          zh: '★ A.2 的总纲：定界算法运行时间和式有几种常用技术，下面逐一演示。' },
        { kind: 'body', page: 1145,
          en: 'The most basic way to evaluate a series is to use m athematical induction. As an example, let’s prove that the arithmetic series P n kD1 k evaluates to n(n + 1)/2. For n = 1, we have that n(n + 1)/2 = 1 • 2/2 = 1, which equals P 1 kD1 k. With the inductive assumption that it holds for n, we prove that it holds for n + 1. We have n + 1 X kD1 k = n X kD1 k C (n + 1)',
          zh: '★★ 归纳法：连（A.2）这样的闭式都能用归纳证；更常见的是用它直接证**上界/下界**。' },
        { kind: 'body', page: 1145,
          en: 'You don’t always need to guess the exact value of a summation in order to use mathematical induction. Instead, you can use induction to prove an upper or lower',
          zh: '★ 用归纳法定界时，不必先猜出精确值——直接猜一个界（如 $O(3^n)$）去归纳即可。' },
        { kind: 'body', page: 1146,
          en: '1146 Appendix A Summations bound on a summation. As an example, let’s prove the asymptotic upper bound P n kD0 3 k = O(3 n ). More specifically, we’ll prove that P n kD0 3 k ≤ c3 n for some constant c . For the initial condition n = 0, we have P 0 kD0 3 k = 1 ≤ c • 1 as long as c ≥ 1. Assuming that the bound holds for n, we prove that it holds for n + 1.',
          zh: '★★ 归纳定界的范本：$\\sum_{k=0}^{n}3^k = O(3^n)$，取常数 $c\\ge1$（基础）并归纳（保持）。' },
        { kind: 'body', page: 1147,
          en: '1 − r : (A.16)',
          zh: '★ 几何级数界（A.16）：$\\sum_{k=0}^{n}a_k\\le a_0/(1-r)$，前提是相邻项比值恒 $\\le r<1$。' },
        { kind: 'body', page: 1148,
          en: 'One way to obtain bounds on a difficult summation is to express the series as the sum of two or more series by partitioning the range of the index and then to bound each of the resulting series. For example, let’s find a lower bound on the arithmetic series P n kD1 k, which we have already seen has an upper bound of n 2 . You might attempt to bound each term in the summation by the smallest term, but since that term is 1, you would get a lower bound of n for the summation—far off from the upper bound of n 2 .',
          zh: '★★ 分裂求和：把和按下标劈成几段分别定界。算术和若每项取「最小项 1」只得到下界 n，离上界 $n^2$ 差太远——劈开后半段才能得到紧的 $\\Omega(n^2)$。' },
        { kind: 'body', page: 1148,
          en: 'For a summation arising from the analysis of an algorithm, you can sometimes split the summation and ignore a constant number of the initial terms. Generally, this technique applies when each term a k in a summation P n kD0 a k is independent of n. Then for any constant k 0 >0 , you can write n X kD0 a k = k 0 −1 X kD0 a k C n X kDk 0 a k D Θ(1) C n X kDk 0 a k ; since the initial terms of the summation are all constant and there are a constant number of them.',
          zh: '★★ 当每项与 n 无关，可丢掉前 $k_0$ 项（共常数个、总值 $\\Theta(1)$）：$\\sum_{k=0}^{n}a_k = \\Theta(1)+\\sum_{k=k_0}^{n}a_k$；part 4 即用此给 $\\sum k\\lg k$ 定下界。' },
      ],
      terms: [
        { en: 'mathematical induction', zh: '数学归纳法', page: 1145 },
        { en: 'bounding the terms', zh: '逐项定界', page: 1146 },
        { en: 'splitting summations', zh: '分裂求和', page: 1148 },
        { en: 'approximation by integrals', zh: '积分近似', page: 1150 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    {
      type: 'pseudocode',
      title: '本节在原书里没有伪代码框',
      algo: null,
      signature: '',
      page: 1145,
      lines: [],
      vars: [],
      note: '★ 附录 A 用公式与不等式讲求和，没有算法伪代码框；本关的实现对照见下一阶段 C 程序（分裂下界、望远镜级数）。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '把和夹在中间',
      panels: [
        {
          title: '算术和的上界 / 下界夹逼',
          viz: 'growth',
          chart: {
            xMax: 12,
            series: [
              { name: '实际 Σk = n(n+1)/2', expr: 'n*(n+1)/2', color: '--viz-done' },
              { name: '上界 n²', expr: 'n*n', color: '--viz-mark' },
              { name: '分裂下界 n²/4', expr: '(n/2)*(n/2)', color: '--viz-compare' },
            ],
          },
          note: '★ 实际曲线恰好落在 $n^2/4$（分裂下界）与 $n^2$（逐项取最大上界）之间——分裂法把「每项取 1 的下界 n」升级成紧的 $\\Omega(n^2)$，与上界 $O(n^2)$ 夹出 $\\Theta(n^2)$。',
        },
      ],
      tasks: ['对照 C 程序 part 4：把 n=100 代入，看实际 $\\sum k\\lg k$ 远大于分裂下界 $(n/2)\\cdot\\lg(n/2)\\cdot(n/2)$。', '把 xMax 调大，确认 $n^2/4$ 与 $n^2$ 始终是实际曲线的上下包络。'],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从定界到 C',
      intro: 'A.2 没有伪代码；这一段用 C 实测两招：分裂求和下界（part 4）与望远镜级数（part 5）。两个断言都先 printf 出真实数字、再写不等式。',
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
          { line: 92, zh: '★★ 分裂下界对照：$\\sum_{k=1}^{100} k\\cdot\\lg k$ 与 $(n/2)\\cdot\\lg(n/2)\\cdot(n/2)\\approx14109.6$。' },
          { line: 93, zh: '★★ 实际 $\\sum k\\lg k$ 远大于分裂下界，说明 $\\sum k\\lg k = \\Omega(n^2\\lg n)$（A.2 开场习题的套路）。' },
          { line: 104, zh: '★★ 望远镜级数 $\\sum_{k=1}^{100}(1/k-1/(k+1))$ 与闭式 $1-1/(n+1)\\approx0.990099$ 一致。' },
          { line: 105, zh: '★★ 断言 $|循环-闭式|<1e-12$，逐项相消精确成立。' },
        ],
        tests: [
          { in: '分裂下界 (n=100)', out: '≈14109.6，实际 Σk·lg k 更大' },
          { in: '望远镜 (n=100)', out: '1 − 1/101 ≈ 0.990099' },
        ],
        mapping: [
          { pc: 1, pcCode: '分裂求和下界', c: '`double bound = (double)(n / 2) * lg((double)(n / 2)) * (double)(n / 2);`（第 91 行）' },
          { pc: 2, pcCode: '望远镜闭式', c: '`double f = 1.0 - 1.0 / (n + 1);`（第 103 行）' },
        ],
      },
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '一本账：四种定界技术各管什么',
      intro: '把 A.2 的四招按「能给什么界」整理；带 ★ 的有原书明示出处，带 ※ 的是本站对 part 4/5 实测的归因。',
      claims: [
        { expr: 'O(3^n)', when: '几何和 $\\sum_{k=0}^{n}3^k$ 的归纳上界（A.2 示例）', page: [1146], source: 'book' },
        { expr: '\\Omega(n^2)', when: '算术和的分裂下界（A.2）', page: [1148], source: 'book' },
        { expr: '\\Omega(n^2\\lg n)', when: '$\\sum_{k=1}^{n}k\\lg k$ 的分裂下界（part 4 实测）', page: [1148], source: 'instructor' },
        { expr: '\\Theta(\\lg n)', when: '$H_n$ 的分裂下界（A.2 习题 A.2-1 思路）', page: [1152], source: 'book' },
      ],
      tables: [
        { caption: 'A.2 定界技术对照', rows: [
          ['技术', '给的界', '前提 / 陷阱'],
          ['归纳法', '$O$/$\\Omega$ 直接证', '别让 big-O 里的常数随 n 变（原书反例）'],
          ['逐项取最大 (A.15)', '$n\\cdot a_{\\max}$', '弱；比值趋于 1 时失效'],
          ['几何级数界 (A.16)', '$\\le a_0/(1-r)$', '需比值恒 $\\le r<1$（调和级数不满足）'],
          ['分裂求和', '丢常数项后分别估', '每项须与 n 无关'],
          ['积分近似 (A.18)/(A.19)', '单调 $f$ 的上下界', '递增 / 递减公式互换'],
        ] },
      ],
      chart: {
        series: [
          { name: 'Σk = n(n+1)/2', expr: 'n*(n+1)/2', color: '--viz-done' },
          { name: '上界 n²', expr: 'n*n', color: '--viz-mark' },
        ],
        xMax: 20,
      },
      derivations: [
        { kind: 'summation', title: '分裂求和给出算术和的 Ω(n²) 下界', steps: [
          { tex: '\\sum_{k=1}^{n} k = \\sum_{k=1}^{n/2} k + \\sum_{k=n/2+1}^{n} k', zh: '★★ 把和从中间劈成两半（设 n 为偶数）。' },
          { tex: '\\ge 0 + \\sum_{k=n/2+1}^{n} (n/2)', zh: '★ 下半段直接丢弃，上半段每一项都 $\\ge n/2$。' },
          { tex: '= (n/2)\\cdot(n/2) = \\Omega(n^2)', zh: '★★ 上半段共 $n/2$ 项，得到 $\\Omega(n^2)$；与已知上界 $O(n^2)$ 夹出紧界。' },
        ] },
      ],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: '凭什么说它一定对：Σ3^k = O(3^n) 的归纳证明',
      statement: 'As an example, let’s prove the asymptotic upper bound P n kD0 3 k = O(3 n ). More specifically, we’ll prove that P n kD0 3 k ≤ c3 n for some constant c .',
      page: 1146,
      intro: '★ 原书 A.2 用这条示范「用归纳法证渐进上界」。三步按「基础 / 保持 / 终止」组织：基础验 n=0，保持把 n 的和拆成 n−1 的和加一项，终止得到 $c\\ge3/2$ 即可。',
      steps: [
        {
          title: '第一步 · 初始化（Initialization，n=0）',
          en: 'For the initial condition n = 0, we have P 0 kD0 3 k = 1 ≤ c • 1 as long as c ≥ 1.',
          page: 1146,
          body: ['★★ 基础：$n=0$ 时和只有一项 $3^0=1$，只要常数 $c\\ge1$ 就有 $1\\le c\\cdot1$，成立。'] },
        {
          title: '第二步 · 保持（Maintenance，归纳步）',
          en: 'We have n + 1 X kD0 3 k = n X kD0 3 k + 3 n + 1 ≤ c3 n + 3 n + 1 (by the inductive hypothesis)',
          page: 1146,
          body: ['★ 假设对 n 成立（$\\sum_{k=0}^{n}3^k\\le c3^n$），则',
            '$$\\sum_{k=0}^{n+1}3^k = \\sum_{k=0}^{n}3^k + 3^{n+1} \\le c3^n + 3^{n+1}.$$',
            '再放缩：$c3^n + 3^{n+1} = c3^n + 3\\cdot3^n = (c+3)3^n$，要它 $\\le c3^{n+1}=3c\\cdot3^n$ 需 $c+3\\le3c$，即 $c\\ge3/2$。'] },
        {
          title: '第三步 · 终止（Termination，取常数）',
          en: '≤ c3 n + 1 as long as .1/3 + 1/c/ ≤ 1 or, equivalently, c ≥ 3/2. Thus, P n kD0 3 k = O(3 n ), as we wished to show.',
          page: 1146,
          body: ['★★ 取 $c=3/2$（同时满足基础 $c\\ge1$ 与保持 $c\\ge3/2$），归纳对所有 $n\\ge0$ 成立，',
            '故 $\\sum_{k=0}^{n}3^k = O(3^n)$——big-O 里的常数 $c$ 必须**与 n 无关**，这是原书特意提醒的坑。∎'] },
      ],
      conclusion: '★ 结论：用归纳法证渐进界时，要显式盯住 big-O 里的常数是否随 n 变化；本例 $c=3/2$ 恒定，故（A.2 的示例）严格成立。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'judge', q: '用归纳法证 $\\sum_{k=0}^{n}3^k=O(3^n)$ 时，归纳基础 n=0 要求常数 $c\\ge1$。', answer: true,
          why: '★ 基础情形和为 1，需 $1\\le c\\cdot1$，即 $c\\ge1$。' },
        { kind: 'single', q: '分裂求和（splitting）技术通常用来得到求和的什么？', options: ['精确闭式', '渐近上下界', '常数倍加速', '排序'], answer: 1,
          why: '★ 分裂是按下标分段或丢常数项后分别估计，目标是渐进界而非精确值。' },
        { kind: 'judge', q: '把每一项都替换成最大项来定上界，对调和级数这种「相邻项比值趋于 1」的求和很有效。', answer: false,
          why: '★ 原书第 6 段：调和级数正是反例——比值 $k/(k+1)<1$ 但不存在恒定 $r<1$，不能被几何级数界住。' },
        { kind: 'single', q: '$\\sum_{k=0}^{n}3^k$ 的 $O(3^n)$ 界中，使归纳成立的最小常数 $c$ 约为？', options: ['1', '3/2', '2', '3'], answer: 1,
          why: '★ 保持步要求 $c\\ge3/2$，与基础 $c\\ge1$ 合并得 $c\\ge3/2$；取 $c=3/2$ 即够。' },
        { kind: 'simulate', q: 'C 程序 part 5：把 n=100 代入望远镜闭式 $1 - 1/(n+1)$，分母是多少？', expect: [101], placeholder: '例如：101',
          why: '★ $1 - 1/(100+1) = 1 - 1/101$，分母是 101。' },
        { kind: 'judge', q: '积分近似（A.18）只适用于单调递增函数。', answer: false,
          why: '★ 原书还有递减版本（A.19）：对单调递减 $f$，上下界公式互换。' },
      ],
      bookExercises: [],
    },
  ],
};
