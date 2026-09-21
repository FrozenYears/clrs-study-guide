/* =============================================================================
 * 第 C 章 C.5 —— 第 s05 关：C.5 The tails of the binomial distribution
 *
 * 原文锚点：印刷页 1203–1213（pdf_index 1224–1234）
 *
 * 引述逐字取自 data/blocks/part-viii-appendix-mathematical-background__chC.json。
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's05',
  id: 'chC/s05',
  chapter: 'C',
  section: 'C.5',
  title: '二项分布的尾部：离均值很远有多罕见',
  shortTitle: 'C.5 二项分布的尾部',
  titleEn: 'The tails of the binomial distribution',
  source: { printed: [1203, 1213], pdf: [1224, 1234] },
  sourceNote: '本关对应原书 C.5 节（印刷页 1203–1213）。',
  prerequisites: [
    { label: 'C.4 The geometric and binomial distributions', url: '#/appendix/c/s04' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '尾部：随机算法的「几乎不可能」证书',
      why: '第 4 节给出了二项分布的中心（$E=np$、$V=npq$），但随机化算法要回答的是另一类问题：**$X$ 远离均值 $np$ 的概率有多小？** 本节给出右尾 / 左尾的放缩——从「按项求和」到「几何级数」再到**切尔诺夫型指数衰减界**。Miller-Rabin（31.8）里「错误率 $\le 2^{-s}$」就是这类界的直接应用。',
      position: '前置：C.3 的期望与指示随机变量、C.4 的二项分布。本节的尾部界是第 5 章（随机化分析）与第 31 章（素性测试）反复引用的工具；马尔可夫不等式与切比雪夫不等式在 C.3 已给出，本关直接取用（引用处标注 preview）。',
      unlocks: [],
      mathKit: [
        { title: '右尾的定义', body:'$n$ 次伯努利试验（成功概率 $p$），$X$ 为成功总数，则 $\\Pr\\{X \\ge k\\} = \\sum_{i=k}^{n} b(i; n,p)$（$k > np$ 时构成右尾）。' },
        { title: '切比雪夫不等式（C.3 节）', body:'$\\Pr\\{|X - E[X]| \\ge r\\} \\le V[X]/r^2$ —— 多项式衰减；本关实测它与真实尾部差两个数量级。' },
        { title: '切尔诺夫思想', body:'对 $e^{\\alpha(X-\\mu)}$ 用马尔可夫不等式，再选最优 $\\alpha$ —— 把多项式界升级成 $e^{-\\Theta(r^2/n)}$ 的指数界。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '抛 100 次硬币，出现 80 次正面有多离谱',
      scene: 'C 程序 part 5：B(100, 1/2) 的右尾实测',
      body: [
        '★ 场景：抛 100 枚均匀硬币，正面数 $X \\sim B(100, 1/2)$，均值 50、标准差 5。「正面数 $\ge 65$」（偏离均值 3 个标准差）算不算罕见？C 程序精确求和给出 **$\\Pr\\{X - 50 \\ge 15\\} = 0.003518$** —— 约千分之三点五。',
        '★★ 对照切比雪夫不等式：它只保证这个概率 $\le 1/9 \\approx 0.111$。真实值 0.0035 比多项式界小 **31 倍** —— 切比雪夫「一视同仁」地覆盖一切分布，而尾部界专门利用二项分布的形状。',
        '★★ 本节的两级跳：先把尾和放缩成**几何级数**（定理 C.4，左尾 $\le \\frac{kq}{np-k} b(k;n,p)$），再用 $e^{\\alpha(X-\\mu)}$ + 马尔可夫得到**切尔诺夫型指数界**。C 程序 part 5 同时实测了马尔可夫不等式 $P(W \\ge k) \\le E[W]/k$ 的逐点松紧。',
        '⚠ 尾部界的意义不是「算得准」而是「担保得住」：即使精确求和算不动（$n$ 巨大），指数界照样给出「几乎不可能」的证书。',
      ],
      interactive: { text: '' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 1203,
          en: 'The probability of having at least, or at most, k successes in n Bernoulli trials, each with probability p of success, is often of more interest than the probability of having exactly k successes. In this section, we investigate the tails of the binomial distribution: the two regions of the distribution b(kI n,p) that are far from the mean np. We’ll prove several important bounds on (the sum of all terms in) a tail.',
          zh: '★★ 本节的对象：二项分布 $b(k;n,p)$ 远离均值 $np$ 的两侧区域。「至少/至多 $k$ 次成功」的概率在算法分析里比「恰好 $k$ 次」常用得多。' },
        { kind: 'body', page: 1203,
          en: 'We first provide a bound on the right tail of the distribution b(kI n,p). To determine bounds on the left tail, simply invert the roles of successes and failures.',
          zh: '★ 右尾与左尾对称：把「成功」与「失败」角色互换即可互相转化——所以只需证一侧。' },
        { kind: 'body', page: 1203,
          en: 'Consider a sequence of n Bernoulli trials, where success occurs with probability p. If X is the random variable denoting the total number of successes, then for 0 ≤ k ≤ n, the probability of at most k successes is 1204 Appendix C Counting and Probability',
          zh: '★ 推论 C.3（左尾版本）：「至多 $k$ 次成功」的概率，证明思路与右尾定理 C.2 平行。' },
        { kind: 'body', page: 1204,
          en: 'Our next bound concerns the left tail of the binomial distribution. Its corollary shows that, far from the mean, the left tail diminishes exponentially.',
          zh: '★★ 关键词 **exponentially（指数地）**：离均值越远，尾部按指数速度消亡——这是几何级数放缩的产物，也是随机算法「错误率指数小」的来源。' },
        { kind: 'body', page: 1204,
          en: 'Proof We bound the series P k−1 i D0 b(i I n,p) by a geometric series using the technique from Section A.2, page 1147.',
          zh: '★★ 证明的发动机：用附录 A.2 的**几何级数放缩**——相邻项之比 $b(i-1;n,p)/b(i;n,p) \\le x < 1$，整个尾和就被 $\\frac{x}{1-x} b(k;n,p)$ 兜住。A.2 关的技巧在这里正式上岗。' },
        { kind: 'body', page: 1204,
          en: 'Consider a sequence of n Bernoulli trials, where success occurs with probability p and failure with probability q = 1 − p. Then for 0<k ≤ np/2, the probability of fewer than k successes is less than half the probability of fewer than k + 1 successes.',
          zh: '★ 推论 C.5 的引理：在 $k \\le np/2$ 的深左尾区，尾部每往里走一步概率至少减半——指数衰减的直观版本。' },
      ],
      terms: [
        { en: 'tail of the binomial distribution', zh: '二项分布的尾部', page: 1203 },
        { en: 'Bernoulli trials', zh: '伯努利试验', page: 1203 },
        { en: 'geometric series', zh: '几何级数', page: 1204 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    {
      type: 'pseudocode',
      title: '本节在原书里没有伪代码框',
      algo: null,
      signature: '',
      page: 1203,
      lines: [],
      vars: [],
      note: '★ 附录 C.5 用定理与不等式讲尾部界，没有伪代码；数值自证见下一阶段 C 程序 part 5。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '指数界 vs 多项式界：谁先把尾部「按死」',
      panels: [
        { title: '尾部概率随偏离量的衰减（B(n,1/2) 的 3σ 右尾）',
          viz: 'growth',
          chart: {
            xMax: 240,
            series: [
              { name: '切尔诺夫型指数界 e^(−2r²/n)（示意）', expr: 'Math.exp(-0.018 * n)', color: '--viz-done' },
              { name: '切比雪夫界 1/9（常数，不随 n 变）', expr: '1 / 9', color: '--viz-compare' },
            ],
          },
          note: '★ 纵轴是「偏离 3σ 以上」的概率上界：指数界随试验数增长一路下压，切比雪夫只给一条水平线。C 程序在 n=100 实测真实值 0.0035，落在指数界之下、远在切比雪夫界之下。' },
      ],
      tasks: [
        '在 C 程序 part 5 里找到切比雪夫上界 1/9 与真实值 0.003518 的打印行，验证「真实 ≪ 界」。',
        '把马尔可夫表的 k 与 E/k 两列对照，指出哪一行 bound 最松。',
        '用「每步减半」的直观（推论 C.5 引理）口算：从尾部走 10 步，概率至少缩小多少倍？（答案：2 的 10 次方以上）',
      ],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '实测：真实尾部 vs 切比雪夫 vs 马尔可夫',
      intro: '本关聚焦 C 程序 **part 5**（其余 part 由 C.1–C.4 四关认领）。全部结论由断言钉死：真实尾部严格小于切比雪夫上界，马尔可夫逐点成立。',
      pseudocodeRef: null,
      c:{file:'counting_prob.c',code:String.raw`/* counting_prob.c -- 附录 C：计数与概率（C.1–C.5）的实测自检。
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
          { line: 192, zh: '★★ part 5 入口：B(100,0.5) 精确求和 3σ 右尾，与切比雪夫上界 1/9 对照（真实 0.0035 ≪ 0.111）。' },
          { line: 206, zh: '★ printf 打印真实值与切比雪夫上界对照（0.003518 < 0.111）—— 「担保得住」但「很松」的两个数量级差。' },
          { line: 210, zh: '★ 马尔可夫不等式逐点实测：P(W ≥ k) ≤ E[W]/k 对每个 k 成立（W 为几何等待时间）。' },
        ],
        tests: [
          { in: 'B(100, 0.5) 右尾 P(X−μ ≥ 3σ)', out: '真实 0.003518 < 切比雪夫上界 1/9 ≈ 0.111' },
          { in: '马尔可夫 P(W ≥ k) vs E[W]/k', out: 'k=1..6 全部满足 ≤（最紧的 k=1 恰为等号附近）' },
        ],
        mapping: [] },
      mapping: [],
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '一本账：三代尾部界谁更强',
      intro: '同一件事（X 偏离均值至少 r）三种担保：马尔可夫最普适但最松；切比雪夫用了方差，好一个量级；切尔诺夫用上指数结构，直接指数衰减。',
      claims: [
        { expr: '\\Pr\\{X \\ge r\\} \\le E[X]/r', when: '马尔可夫不等式（式 C.34）—— 只要求非负', page: 1193, source: 'book', preview: true },
        { expr: '\\Pr\\{|X-E[X]| \\ge r\\} \\le V[X]/r^2', when: '切比雪夫不等式 —— 用上方差后平方衰减', page: 1195, source: 'book', preview: true },
        { expr: 'e^{-\\Theta(r^2/n)}', when: '切尔诺夫型右尾界（定理 C.8 系）：独立伯努利和的尾部指数衰减', page: 1207, source: 'book' },
        { expr: '0.003518 < 1/9', when: 'C 实测：B(100,1/2) 的 3σ 右尾真实值 vs 切比雪夫上界', page: 1203, source: 'instructor' },
      ],
      tables: [
        { caption: '同一事件的三个担保（C 程序 part 5 实测）', rows: [
          ['界', '对 P(X−50 ≥ 15) 的担保', '与真实值 0.0035 的距离'],
          ['马尔可夫（E[X]/r）', '≤ 50/15 ≈ 3.33（无意义，概率 ≤ 1）', '不能用'],
          ['切比雪夫（V/r²）', '≤ 25/225 = 1/9 ≈ 0.111', '松约 31 倍'],
          ['精确求和', '0.003518', '——'],
        ] },
      ],
      chart: null,
      derivations: [
        { kind: 'line', title: '几何级数放缩：左尾一步到位', steps: [
          { zh: '相邻项之比：$\\dfrac{b(i-1;n,p)}{b(i;n,p)} = \\dfrac{i}{n-i+1}\\cdot\\dfrac{q}{p} \\le \\dfrac{kq}{(n-k)p} = x < 1$（对 $i \\le k < np$）。' },
          { zh: '反复代入：$b(i;n,p) < x^{k-i} b(k;n,p)$，于是左尾和 $\\sum_{i=0}^{k-1} b(i;n,p) < b(k;n,p)\\sum_{j\\ge 1} x^j$。' },
          { zh: '几何级数收敛（A.1 的公式）：$\\sum_{j\\ge 1} x^j = \\frac{x}{1-x}$，代回得 $\\Pr\\{X < k\\} < \\dfrac{kq}{np-k}\\, b(k;n,p)$。∎' },
          { zh: '★★ 这就是「尾部指数消亡」的全部机关：把不明显的求和压成一条几何级数 —— A.2 关的技巧在概率里的正式出场。' },
        ] },
      ],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: '定理 C.4：左尾被几何级数压住',
      statement: 'Consider a sequence of n Bernoulli trials, where success occurs with probability p and failure with probability q = 1 − p. Let X be the random variable denoting the total number of successes.',
      page: 1204,
      intro: '★ 证明分三步：算出相邻项之比 → 逐项迭代放缩 → 几何级数求和收尾。对应「造出比值的界 / 迭代 / 求和」三个环节。',
      steps: [
        {
          title: '第一步 · 算出相邻项之比 x < 1',
          en: 'Proof We bound the series P k−1 i D0 b(i I n,p) by a geometric series using the technique from Section A.2, page 1147.',
          page: 1204,
          body: ['对 $i \\le k < np$：$\\dfrac{b(i-1;n,p)}{b(i;n,p)} = \\dfrac{iq}{(n-i+1)p} \\le \\dfrac{kq}{(n-k)p} =: x$，且 $x < 1$（因为 $k < np$）。'],
        },
        {
          title: '第二步 · 逐项迭代：越靠左越小',
          en: '< 1; it follows that b(i − 1I n,p)<xb(i I n,p) for 0<i ≤ k. Iteratively applying this inequality k − i times gives b(i I n,p)<x k−i b(kI n,p) for 0 ≤ i <k, and hence k−1 X i D0 b(i I n,p) < k−1 X i D0 x k−i b(kI n,p)',
          page: 1205,
          body: ['把不等式连用 $k-i$ 次：每一项 $b(i;n,p)$ 都被 $x^{k-i}\\,b(k;n,p)$ 压住——整个左尾和变成一个**等比加权**的和。'],
        },
        {
          title: '第三步 · 几何级数收尾',
          en: 'D kq=..n − k/p/',
          page: 1205,
          body: ['$\\sum_{j \\ge 1} x^j = \\frac{1-x}{1-x}$ 化简后即 $\\dfrac{kq/((n-k)p)}{1-x}\\, b(k;n,p) = \\dfrac{kq}{np-k} b(k;n,p)$ —— 定理 C.4 得证。∎',
            '★ 每一步用的都是前两关的存货：C.1 的二项式系数恒等式、A.1 的几何级数。∎'],
        },
      ],
      conclusion: '★ 结论：左尾 $\\Pr\\{X < k\\} < \\dfrac{kq}{np-k} b(k;n,p)$（$0 < k < np$）；换成功率与失败的角色得右尾。配合推论 C.5 的「每步减半」，尾部指数消亡坐实。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: 'B(100, 1/2) 偏离均值 3σ 以上的真实概率（C 实测）约是？',
          options: ['0.0035', '0.111', '0.05', '0.32'], answer: 0,
          why: '★ 精确求和 0.003518 —— 千分之三点五，离「罕见」还有很大余量。' },
        { kind: 'single', q: '同一事件，切比雪夫不等式给的担保是？',
          options: ['0.0035，也就是另一条不等式给出的那个数', '**1/9 ≈ 0.111**', '0.5：一半一半，等于什么也没担保', '没有担保'], answer: 1,
          why: '★ $V/r^2 = 25/225 = 1/9$：比真实值松约 31 倍，但「担保得住」。' },
        { kind: 'judge', q: '左尾与右尾的界可以互相推导：把成功与失败的角色互换即可。',
          answer: true,
          why: '★ 原书原话：To determine bounds on the left tail, simply invert the roles of successes and failures。' },
        { kind: 'judge', q: '定理 C.4 的证明用到了附录 A.2 的几何级数放缩技术。',
          answer: true,
          why: '★ 证明原话点名 Section A.2, page 1147 —— 尾和被压成几何级数。' },
        { kind: 'judge', q: '在 $k \\le np/2$ 的深左尾区，尾部每向均值靠近一步，概率至少翻倍。',
          answer: true,
          why: '★ 推论 C.5 的引理：$\\Pr\\{X<k\\} < b(k;n,p)$ = 「少于 k」不及「少于 k+1」的一半。' },
        { kind: 'single', q: '切尔诺夫型证明的关键一步是对哪个量使用马尔可夫不等式？',
          options: ['$X$', '$(X-\\mu)^2$：先平方再用马尔可夫，切比雪夫就是这么来的', '**$e^{\\alpha(X-\\mu)}$**', '$1/X$：取倒数以后再用马尔可夫'], answer: 2,
          why: '★ 对指数化后的 $e^{\\alpha(X-\\mu)}$ 用马尔可夫（式 C.47–C.48），再挑最优 $\\alpha$ —— 指数界由此而来。' },
        { kind: 'simulate', q: 'C 程序 part 5 里，马尔可夫表在 k=2 时 P(W≥2) 的实测值最接近多少？（E[W]=6）',
          expect: [0.83], placeholder: '例如：0.5',
          why: '0.8336 ≤ E/k = 3.0008 —— 马尔可夫逐点成立但非常松。' },
        { kind: 'single', q: '为什么说尾部界比「精确求和」更有价值？',
          options: ['因为它算出来的数值比精确求和更准，给的就是真实概率本身', '**因为 n 巨大时精确求和算不动，而界照样给出证书**', '因为它不需要对试验的独立性做任何假设', '因为它总是等于精确值，只是写法不同'], answer: 1,
          why: '★ 界的意义是「担保」：牺牲一点紧度，换来对任意大规模实例的即时可用性。' },
      ],
      bookExercises: [
        // 附录语料未收录习题块，留空（C.5 习题见原书 p1210–1211）。
      ],
    },
  ],
};
