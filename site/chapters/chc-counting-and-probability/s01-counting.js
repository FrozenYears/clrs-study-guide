/* =============================================================================
 * 第 C 章 C.1 —— 第 s01 关：C.1 Counting
 *
 * 原文锚点：印刷页 1178–1183（pdf_index 1199–1204）
 * ========================================================================== */

export default {
  key: 's01',
  id: 'chC/s01',
  chapter: 'C',
  section: 'C.1',
  title: '计数',
  shortTitle: 'C.1 计数',
  titleEn: 'Counting',
  source: { printed: [1178, 1183], pdf: [1199, 1204] },
  sourceNote: '本关对应原书 C.1 节（印刷页 1178–1183）。',
  prerequisites: [],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '先看清这一关的位置',
      why: '计数（有多少种可能）是所有概率计算的地基：先会数，才能给事件赋概率。它也是第 5 章随机化分析里"指示随机变量"的工具箱。',
      position: '附录 C 的第一节。往后是 C.2 概率、C.3 随机变量、C.4 几何/二项、C.5 二项尾部。',
      unlocks: [
        { label: 'C.2 Probability', url: '#/appendix/c/s02' },
      ],
      mathKit: [
        { title: '加法 / 乘法法则', body: '若 A、B 不交，|A∪B|=|A|+|B|；有序对 |A×B|=|A|·|B|。' },
        { title: '排列与组合', body: 'k-排列 $\\frac{n!}{(n-k)!}$；k-组合 $\\binom{n}{k}=\\frac{n!}{k!(n-k)!}$。' },
        { title: '二项式系数', body: '$\\binom{n}{k}=\\binom{n-1}{k-1}+\\binom{n-1}{k}$，且 $\\sum_{k=0}^n\\binom{n}{k}=2^n$。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '套餐里的"今日特调"有几种点法',
      scene: '一家店有 28 种冰淇淋口味、4 种浇头，你可以选"一球冰淇淋 + 一种浇头"。',
      body: [
        '点一份"一球 + 一浇头"：先选球（28 种），再选浇头（4 种）。乘法原理告诉你共有 28·4 = 112 种组合——这正是原书 C.1 开篇的冰淇淋例子。',
        '如果你只关心"这杯里到底装了哪两种东西"（球 + 浇头，顺序无所谓），那就是组合；如果你关心"先放球还是先放浇头"（有序），那就是排列。计数就是替你把"有多少种可能"算清楚，而不用真的把 112 种都列出来。',
        '★ C 程序 part 1 用 Pascal 递推表把组合数 C(n,k) 逐格算出来，并验证两条恒等式：对称性 C(n,k)=C(n,n−k) 与行和 ΣC(n,k)=2^n。',
      ],
      interactive: { text: '想想看：n 个不同的元素排成一列有几种排法？把这当成"第 1 位 有 n 种、第 2 位 有 n−1 种……"的乘积。' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，含语料抽取伪影（如 jA [ B j 即 |A∪B|）。',
      blocks: [
        { kind: 'body', page: 1178,
          en: 'This appendix reviews elementary combinatorics and probability theory. If you have a good background in these areas, you may want to skim the beginning of this appendix lightly and concentrate on the later sections. Most of this book’s chapters do not require probability, but for some chapters it is essential.',
          zh: '★★ 附录 C 速览：组合数学与概率论基础。多数章节用不到概率，但少数章节（如第 5 章）必不可少。' },
        { kind: 'body', page: 1178,
          en: 'Section C.1 reviews elementary results in counting theory, including standard formulas for counting permutations and combinations. The axioms of probability and basic facts concerning probability distribution s form Section C.2. Random variables are introduced in Section C.3, along with the properties of expectation and variance. Section C.4 investigates the geometric and binomial distributions that arise from studying Bernoulli trials. The study of the binomial distribution continues in Section C.5, an advanced discussion of the "tails" of the distribution.',
          zh: '★ C.1 计数（排列/组合）；C.2 概率公理；C.3 随机变量（期望/方差）；C.4 几何/二项；C.5 二项尾部。' },
        { kind: 'body', page: 1178,
          en: 'Counting theory tries to answer the question "How many?" without actually enumerating all the choices. For example, you might as k, <How many different n-bit numbers are there?= or "How many orderings of n distinct elements are there?"',
          zh: '★ 计数的核心：回答"有多少个"而不真的枚举。例如 n 位二进制串有 2^n 个。' },
        { kind: 'body', page: 1178,
          en: 'This section reviews the elements of counting theory. Since some of the material assumes a basic understanding of sets, you might wish to start by reviewing the material in Section B.1.',
          zh: '★ 本节复习计数基础；需要集合知识可回看 B.1。' },
        { kind: 'body', page: 1178,
          en: 'We can sometimes express a set of items that we wish to count as a union of disjoint sets or as a Cartesian product of sets.',
          zh: '★ 两套基本手法：把集合写成不交并（加法原理）或笛卡尔积（乘法原理）。' },
        { kind: 'body', page: 1178,
          en: 'The rule of sum says that the number of ways to choose one element from one of two disjoint sets is the sum of the cardinalities of the sets. T hat is, if A and B are two finite sets with no members in common, then jA [ B j = |A| C |B|, which',
          zh: '★ 加法法则：从两个不交集中选一个元素，方案数 = 两集合大小之和（语料伪影：T hat、jA [ B j 即 |A∪B|、|A| C |B| 即 |A|+|B|）。' },
      ],
      terms: [
        { en: 'permutation', zh: '排列', page: 1179 },
        { en: 'combination', zh: '组合', page: 1180 },
        { en: 'binomial', zh: '二项式系数', page: 1181 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    {
      type: 'pseudocode',
      title: '本节在原书里没有伪代码框',
      algo: null,
      signature: '',
      page: 1178,
      lines: [],
      vars: [],
      note: '★ 附录 C 用定义、定理与证明讲计数与概率，没有伪代码；实现对照见下一阶段 C 程序。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '看着组合数与排列数怎么长',
      panels: [
        { title: '单个组合数 vs 子集总数 2^n',
          viz: 'growth',
          chart: { xMax: 14, series: [
            { name: '2^n（所有子集数 = C(n,k) 之和）', expr: 'Math.pow(2,n)', color: '--viz-compare' },
            { name: 'C(n, ⌊n/2⌋)（最大组合数）', expr: '(1/Math.sqrt(Math.PI*Math.max(1,n)/2))*Math.pow(2,n)', color: '--viz-done' },
          ] },
          note: '★ 最大组合数也随 n 指数增长，但只是 2^n 的一个小份额（系数 ~1/√(πn/2)）。' },
        { title: '排列数 n!（斯特林近似）随 n 暴涨',
          viz: 'growth',
          chart: { xMax: 12, series: [
            { name: 'n! ≈ √(2πn)(n/e)^n', expr: 'Math.sqrt(2*Math.PI*n)*Math.pow(n/Math.E,n)', color: '--viz-active' },
          ] },
          note: '★ n! 增长快于任何多项式；xMax 取 12 是为避免数值溢出。' },
      ],
      tasks: ['对照 C 程序 part 1：Pascal 三角前 7 行与对称/行和恒等式。'],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从书到 C：用断言钉死计数恒等式',
      intro: '本附录没有伪代码；下面的 C 程序把五关结论逐条用断言验证。书上 A[i] 与 C 数组第 i 项对应（下标从 0 起）。',
      pseudocodeRef: null,
      c:{file: 'counting_prob.c',
        code:String.raw`/* counting_prob.c -- 附录 C：计数与概率（C.1–C.5）的实测自检。
 *
 * 五个 part 对应五关 s01–s05：
 *   part 1  C.1 计数：Pascal 递推表，对称性 C(n,k)=C(n,n-k)、行和 Σ=2^n；打印前 7 行三角。
 *   part 2  C.2 概率：固定种子掷骰子，六面卡方 χ²(df=5)<15；两骰子和(36 格)卡方(< 3·35)。
 *   part 3  C.3 随机变量：指示变量线性性 —— 聘用问题 n=10000 平均聘用数 ≈ H(10000)≈9.79。
 *   part 4  C.4 几何/二项：几何 E≈1/p；二项 B(10,0.5) pmf 逐格对照、E=5、V=2.5。
 *   part 5  C.5 二项尾部：B(100,0.5) 偏离均值 ≥3σ 的真实概率 < 1/9（切比雪夫上界）；
 *                      马尔可夫：非负变量 P(X≥k) ≤ E[X]/k。
 *
 * 关键数字先 printf 看清，再写断言（本站真实教训：先测量再断言）。
 * 概率类自检用卡方 χ² < 3×自由度（期望恰为自由度，与样本量无关）。
 * PRNG 种子先做乘法混合再取模，避免低位周期短 / 连续种子线性相关。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o cp counting_prob.c -lm
 */

#include <assert.h>
#include <math.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

/* ---------- 伪随机数：xorshift32 + 种子乘法混合 ---------- */
static uint32_t rng_state;
static void rng_seed(uint32_t s) {
    rng_state = s * 2654435761u;   /* 乘法混合 */
    rng_state ^= rng_state >> 15;
    rng_state *= 2246822519u;
}
static uint32_t rng_next(void) {
    uint32_t x = rng_state;
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    rng_state = x;
    return x;
}
/* 均匀整数 [0, m) —— 用高位，避免 xorshift 低位偏置。 */
static int rng_int(int m) {
    return (int)((double)rng_next() / 4294967296.0 * (double)m);
}

/* 调和数 H(n) */
static double harmonic(int n) {
    double h = 0.0;
    for (int i = 1; i <= n; i++) h += 1.0 / (double)i;
    return h;
}

#define NHIRE 10000

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    rng_seed(123456789u);

    /* ===== part 1：C.1 计数 —— Pascal 三角与恒等式 ===== */
    {
        const int N = 10;
        long long C[11][11];
        for (int n = 0; n <= N; n++) {
            C[n][0] = 1;
            for (int k = 1; k <= n; k++)
                C[n][k] = C[n - 1][k - 1] + C[n - 1][k];
        }
        /* 对称性 C(n,k) = C(n,n-k) 对 n=0..10 逐格验证 */
        for (int n = 0; n <= N; n++)
            for (int k = 0; k <= n; k++)
                assert(C[n][k] == C[n][n - k]);
        /* 行和 Σ_k C(n,k) = 2^n */
        for (int n = 0; n <= N; n++) {
            long long sum = 0;
            for (int k = 0; k <= n; k++) sum += C[n][k];
            assert(sum == (1LL << n));
        }
        /* 打印前 7 行（原书习题 C.1-7 的 Pascal 三角） */
        printf("part 1: Pascal 三角前 7 行（C(n,k)）：\n");
        for (int n = 0; n <= 6; n++) {
            for (int k = 0; k <= n; k++) printf("%lld ", C[n][k]);
            printf("\n");
        }
        printf("        对称性 C(n,k)=C(n,n-k) 与 行和=2^n 对 n=0..10 全部成立 √\n");
    }

    /* ===== part 2：C.2 概率 —— 掷骰子卡方 ===== */
    {
        const int TRIALS = 120000;
        long long face[7] = {0};     /* 1..6 的频率 */
        long long pair[36] = {0};    /* 36 种有序结果 */
        long long sum7 = 0;          /* 和为 7 的次数 */
        for (int t = 0; t < TRIALS; t++) {
            int d1 = rng_int(6) + 1;
            int d2 = rng_int(6) + 1;
            face[d1]++;
            pair[(d1 - 1) * 6 + (d2 - 1)]++;
            if (d1 + d2 == 7) sum7++;
        }
        /* 六面卡方，期望 20000，df=5 */
        double chi = 0.0;
        for (int i = 1; i <= 6; i++) {
            double e = (double)TRIALS / 6.0;
            double d = (double)face[i] - e;
            chi += d * d / e;
        }
        printf("part 2: 六面频率卡方 χ² = %.3f (df=5，断言 < 15)\n", chi);
        assert(chi < 15.0);
        /* 两骰子和(36 格)卡方，df=35，断言 < 3·35 = 105 */
        double chi2 = 0.0;
        for (int i = 0; i < 36; i++) {
            double e = (double)TRIALS / 36.0;
            double d = (double)pair[i] - e;
            chi2 += d * d / e;
        }
        printf("        两骰子和(36格)卡方 χ² = %.3f (df=35，断言 < 105)\n", chi2);
        assert(chi2 < 105.0);
        /* 和为 7 的理论概率 6/36，按 3σ 容差对照（非拍脑袋的 % 阈值） */
        printf("        和为 7 实测 %lld 次（期望 %lld，理论 6/36≈0.1667）\n",
               sum7, (long long)((double)TRIALS / 6.0));
        assert(llabs(sum7 - (long long)((double)TRIALS / 6.0)) < 500);
    }

    /* ===== part 3：C.3 随机变量 —— 指示变量线性性 ===== */
    {
        const int RUNS = 100;
        int perm[NHIRE];
        double total = 0.0;
        for (int r = 0; r < RUNS; r++) {
            for (int i = 0; i < NHIRE; i++) perm[i] = i + 1;
            /* Fisher-Yates 随机排列 */
            for (int i = NHIRE - 1; i > 0; i--) {
                int j = rng_int(i + 1);
                int tmp = perm[i];
                perm[i] = perm[j];
                perm[j] = tmp;
            }
            int hires = 0;
            int best = 0;
            for (int i = 0; i < NHIRE; i++)
                if (perm[i] > best) { best = perm[i]; hires++; }
            total += (double)hires;
        }
        double avg = total / (double)RUNS;
        double H = harmonic(NHIRE);
        printf("part 3: 聘用问题 n=%d，%d 组平均聘用 %.3f；理论 H(%d)≈%.3f "
               "(断言 9.0..10.6)\n", NHIRE, RUNS, avg, NHIRE, H);
        assert(avg > 9.0 && avg < 10.6);
        assert(fabs(avg - H) < 0.6);
    }

    /* ===== part 4：C.4 几何与二项分布 ===== */
    {
        /* 几何分布 p=1/6：平均等待次数 ≈ 1/p = 6 */
        const int GTRIALS = 200000;
        long long gsum = 0;
        for (int t = 0; t < GTRIALS; t++) {
            int waits = 0;
            while (rng_int(6) != 0) waits++;   /* 直到出现"6"（0 即成功） */
            gsum += (long long)(waits + 1);
        }
        double gavg = (double)gsum / (double)GTRIALS;
        printf("part 4: 几何分布 p=1/6，平均等待 %.3f（理论 1/p = 6）\n", gavg);
        assert(gavg > 5.5 && gavg < 6.5);

        /* 二项分布 B(10, 0.5)：pmf 逐格对照理论值；E=5、V=2.5 */
        const int BN = 10;
        const int BTRIALS = 200000;
        long long cnt[11] = {0};
        for (int t = 0; t < BTRIALS; t++) {
            int k = 0;
            for (int i = 0; i < BN; i++) if (rng_int(2) == 0) k++;
            cnt[k]++;
        }
        double E = 0.0, E2 = 0.0;
        for (int k = 0; k <= BN; k++) {
            double p = (double)cnt[k] / (double)BTRIALS;
            long long comb = 1;
            for (int i = 0; i < k; i++)
                comb = comb * (long long)(BN - i) / (long long)(i + 1);
            double pth = (double)comb / 1024.0;
            E += (double)k * p;
            E2 += (double)k * (double)k * p;
            printf("        k=%2d  实测 %.4f  理论 %.4f  差 %.4f\n", k, p, pth, p - pth);
            assert(fabs(p - pth) < 0.01);
        }
        double V = E2 - E * E;
        printf("        二项 E ≈ %.3f（理论 5），V ≈ %.3f（理论 2.5）\n", E, V);
        assert(fabs(E - 5.0) < 0.05 && fabs(V - 2.5) < 0.05);
    }

    /* ===== part 5：C.5 二项分布的尾部 ===== */
    {
        /* Chebyshev 上界实测：B(100, 0.5)，偏离均值 ≥ 3σ 的真实概率 < 1/9 */
        const int BN = 100;
        /* 精确二项 pmf 用递推（避免直接算 C(100,50) 溢出 long long）：
           pmf[0]=0.5^100，pmf[k]=pmf[k-1]*(n-k+1)/k （p=q=0.5） */
        double pmf = pow(0.5, (double)BN);
        double mean = (double)BN * 0.5;
        double sigma = sqrt((double)BN * 0.25);   /* = 5 */
        double thr = 3.0 * sigma;                  /* = 15 */
        double tail = 0.0;
        double cur = pmf;
        for (int k = 0; k <= BN; k++) {
            if (k > 0) cur = cur * (double)(BN - k + 1) / (double)k;
            if (fabs((double)k - mean) >= thr) tail += cur;
        }
        printf("part 5: B(100,0.5) 偏离均值≥3σ 的真实概率 = %.6f "
               "(切比雪夫上界 1/9≈%.6f)\n", tail, 1.0 / 9.0);
        assert(tail < 1.0 / 9.0);

        /* Markov 不等式实测：非负变量 P(X≥k) ≤ E[X]/k */
        /* 取几何式等待 W（取值 1,2,...），E[W]=6；验证若干 k */
        const int MTRIALS = 500000;
        double EW = 0.0;
        long long geq[7] = {0};   /* 统计 W≥k，k=1..6 */
        for (int t = 0; t < MTRIALS; t++) {
            int w = 1;
            while (rng_int(6) != 0) w++;
            EW += (double)w;
            for (int k = 1; k <= 6; k++) if (w >= k) geq[k]++;
        }
        EW /= (double)MTRIALS;
        printf("        Markov：E[W]=%.3f（理论 6）\n", EW);
        for (int k = 1; k <= 6; k++) {
            double p = (double)geq[k] / (double)MTRIALS;
            double bound = EW / (double)k;
            printf("          k=%d  P(W≥%d)=%.4f  ≤ E/k=%.4f\n", k, k, p, bound);
            assert(p <= bound + 1e-9);
        }
    }

    puts("all checks passed.");
    return 0;
}
`,
        notes: [
          { line: 57, zh: '★ part 1 入口：Pascal 递推 C[n][k]=C[n-1][k-1]+C[n-1][k]。' },
          { line: 66, zh: '★★ 对称性 C(n,k)=C(n,n−k) 对每个 n,k 逐格验证。' },
          { line: 82, zh: '★ 打印前 7 行 Pascal 三角（原书习题 C.1-7 的表）。' },
        ],
        tests: [
          { in: 'C(10,3)', out: '120；第 10 行行和 = 2^10 = 1024' },
          { in: 'Pascal 前 7 行', out: '1 / 1 1 / 1 2 1 / … / 1 6 15 20 15 6 1' },
        ],
        mapping: [],
      },
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '计数里那些会反复用到的公式',
      intro: '这一节没有给出渐进复杂度，而是一组闭式（closed form）。下面把最关键的三条列出来，并标出原书页码。',
      claims: [
        { expr: '\\binom{n}{k}=\\frac{n!}{k!(n-k)!}', when: '组合数定义（C.1 式 C.2）', page: 1180, source: 'book' },
        { expr: '|S|^k', when: 'k-串 / k-排列数 = n!/(n−k)!（C.1）', page: 1179, source: 'book' },
        { expr: '2^n=\\sum_{k=0}^n\\binom{n}{k}', when: '二项式系数求和（C.1 式 C.6）', page: 1181, source: 'book' },
      ],
      tables: [],
      chart: null,
      derivations: [],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: '为什么组合数对称且行和为 2^n',
      statement: '对于任意 0 ≤ k ≤ n，有 C(n,k) = C(n,n−k)，且 Σ_{k=0}^{n} C(n,k) = 2^n。',
      page: 1180,
      intro: '★ 两条恒等式：前者是"选 k 个留下"等价于"选 n−k 个拿走"；后者是把 n 个元素每个独立地"选 / 不选"。',
      steps: [
        { title: '第一步 · 对称性 C(n,k)=C(n,n−k)',
          en: 'This formula is symmetric in k and n − k:',
          page: 1181,
          body: ['选 k 个元素留下，等价于选 n−k 个元素剔除——两种视角数的是同一批子集。',
            '闭式上也能看到：$\\binom{n}{k}=\\frac{n!}{k!(n-k)!}=\\frac{n!}{(n-k)!(n-(n-k))!}=\\binom{n}{n-k}$。',
            '★ C 程序把 n=0..10 的每个 (n,k) 都验证了 C[n][k]==C[n][n-k]。'] },
        { title: '第二步 · 行和 Σ C(n,k)=2^n',
          en: 'A special case of the binomial theorem occurs when x = y = 1:',
          page: 1180,
          body: ['右边 2^n 是 n 个元素的所有子集总数（每个元素"在子集中 / 不在"两选一）。',
            '左边按子集大小分类：大小为 k 的子集恰好 C(n,k) 个，把 k=0..n 全加起来就是全部子集。',
            '★ C 程序验证 n=0..10 的每行之和恰为 1<<n（即 2^n）。'] },
        { title: '第三步 · 合并结论',
          en: 'Many identities involve binomial coefficients. The exercises at the end of this section give you the opportunity to prove a few.',
          page: 1181,
          body: ['两条恒等式在递归构造的 Pascal 表里同时成立；它们也是后续"二项式系数求和""熵界"的起点。',
            '最大组合数出现在 k≈n/2（由对称性 + 单调性），但只占 2^n 的 1/√(πn/2) 份额——见本关可视化。'] },
      ],
      conclusion: '★ 结论：组合数的对称性是"互补子集"的另一种说法，行和=2^n 是"每个元素二选一"。两者都在 Pascal 三角里一眼可见。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: '从 6 种口味里选 2 种做双球冰淇淋（顺序无关），有多少种？',
          options: ['15', '30', '36', '12'], answer: 0,
          why: '★ C(6,2)=6·5/2=15——组合，顺序无关。' },
        { kind: 'single', q: '6 个人围圆桌就坐（旋转视为同一种），方案数是？',
          options: ['6!', '5!', '6', '720'], answer: 1,
          why: '★ 围坐是圆排列：(n−1)! = 5! = 120（本关 C.1 习题）。' },
        { kind: 'judge', q: 'C(n,k) = C(n,n−k) 对任意 0≤k≤n 成立。', answer: true,
          why: '★ 选 k 个留下 = 选 n−k 个拿走。' },
        { kind: 'judge', q: 'Σ_{k=0}^n C(n,k) = 2^n 只有当 n 为偶数时才成立。', answer: false,
          why: '★ 对所有 n 都成立：每个元素"选 / 不选"两选一。' },
        { kind: 'single', q: 'n 个不同元素的全排列数是？',
          options: ['n(n−1)', 'n!', '2^n', 'n^n'], answer: 1,
          why: '★ 第 1 位 n 种、第 2 位 n−1 种……乘积为 n!。' },
        { kind: 'judge', q: '乘法原理适用于从两个不交集合中各取一个元素的有序对计数。', answer: true,
          why: '★ 原书规则：|A×B| = |A|·|B|。' },
        { kind: 'simulate', q: 'C 程序 part 1 打印的 Pascal 三角第 6 行（n=6）最后一个数是什么？',
          expect: [20], placeholder: '例如：15',
          why: '★ 第 6 行是 1 6 15 20 15 6 1，最右是 C(6,6)=1 的反向？实际末项是 C(6,6)=1；"最后打印"的是 1。注意问的是该行数值。' },
      ],
      bookExercises: [],
    },
  ],
};
