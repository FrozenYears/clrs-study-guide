/* =============================================================================
 * 第 C 章 C.4 —— 第 s04 关：C.4 The geometric and binomial distributions
 *
 * 原文锚点：印刷页 1196–1202（pdf_index 1217–1223）
 * ========================================================================== */

export default {
  key: 's04',
  id: 'chC/s04',
  chapter: 'C',
  section: 'C.4',
  title: '几何与二项分布',
  shortTitle: 'C.4 几何与二项分布',
  titleEn: 'The geometric and binomial distributions',
  source: { printed: [1196, 1202], pdf: [1217, 1223] },
  sourceNote: '本关对应原书 C.4 节（印刷页 1196–1202）。',
  prerequisites: [
    { label: 'C.3 Discrete random variables', url: '#/chC/s03' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '先看清这一关的位置',
      why: '把"伯努利试验"（只有成败两种结果）串起来，就得到两个最常碰到的分布：几何分布（等到第一次成功要多久）与二项分布（n 次里成功几次）。',
      position: '附录 C 的第四节。前置是 C.1–C.3；往后是 C.5 二项分布的尾部。',
      unlocks: [
        { label: 'C.5 The tails of the binomial distribution', url: '#/chC/s05' },
      ],
      mathKit: [
        { title: '伯努利试验', body: '单次只有成功(p)/失败(q=1−p)两种结果；多次独立同分布即 Bernoulli trials。' },
        { title: '几何分布', body: '等到首次成功所需试验数 X：P(X=k)=q^{k−1}p，E[X]=1/p，Var=q/p²。' },
        { title: '二项分布', body: 'n 次中成功次数 X∼B(n,p)：P(X=k)=C(n,k)p^k q^{n−k}，E[X]=np，Var=npq。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '一直掷骰子，等到第一个"6"要掷几次',
      scene: '你不停地掷一枚公平骰子，想知道"第一次掷出 6"平均要掷多少次。',
      body: [
        '每次掷出 6 的概率是 p=1/6，没掷出的概率是 q=5/6。第一次成功发生在第 k 次的概率是 q^{k−1}·p——这就是几何分布。',
        '它的期望是 1/p = 6：平均要掷 6 次才等到第一个 6。直观上"每 6 次才出一个 6"，所以等待次数约 6。',
        '★ C 程序 part 4 用 p=1/6 的几何分布模拟 20 万次，平均等待 ≈6（实测约 5.998）；同时模拟 B(10,0.5) 的 pmf，逐格对照理论并算出 E≈5、V≈2.5。',
      ],
      interactive: { text: '想一想：几何分布是"无记忆"的——已经掷了 10 次没出 6，下一次出 6 的概率仍是 1/6，不因为"欠了"而变大。' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，含语料抽取伪影（如 fX ≥ t g 即 {X≥t}、X 0 即 X₀）。',
      blocks: [
        { kind: 'body', page: 1196,
          en: 'Let X be a nonnegative random variable, and suppose that E [X ] is well defined.',
          zh: '★ 这是 C.4 习题里马尔可夫不等式的前提：非负随机变量且期望存在。' },
        { kind: 'body', page: 1196,
          en: 'Let S be a sample space, and let X and X 0 be random variables such that X(s) ≥ X 0 (s) for all s 2 S . Prove that for any real constant t , Pr fX ≥ t g ≥ Pr fX 0 ≥ t g :',
          zh: '★ 习题：若对所有 s 有 X(s)≥X₀(s)，则 P(X≥t)≥P(X₀≥t)（随机变量被"压低"，越界概率只会变小）。' },
        { kind: 'body', page: 1196,
          en: 'Which is larger: the expectation of the square of a random variable, or the square of its expectation?',
          zh: '★ 习题：E[X²] 与 (E[X])² 谁大？由 Var[X]≥0 知 E[X²] ≥ (E[X])²。' },
        { kind: 'body', page: 1196,
          en: 'Show that for any random variable X that takes on only the values 0 and 1, we have',
          zh: '★ 习题：只取 0/1 的随机变量就是指示变量，其方差 = p(1−p)。' },
        { kind: 'body', page: 1196,
          en: 'A Bernoulli trial is an experiment with only two possible outcomes: success, which occurs with probability p, and failure, which occurs with probability q = 1 − p. A coin flip serves as an example where, depending on your point of view, heads equates to success and tails to failure . When we speak of Bernoulli trials collectively, we mean that the trials are mutually independent and, unless we specifically say otherwise, that each has the same probability p for success. Two important distributions arise from Bernoulli trials : the geometric distribution and the binomial distribution.',
          zh: '★ 伯努利试验定义（成败二结果、独立同分布 p）；由此诞生几何分布与二项分布。' },
        { kind: 'body', page: 1196,
          en: 'Consider a sequence of Bernoulli trials, each with a probability p of success and a probability q = 1 − p of failure. How many trials occur before a success? Define the random variable X to be the number of trials needed to obtain a success. Then',
          zh: '★ 几何分布问题：首次成功所需试验数 X 的分布。' },
      ],
      terms: [
        { en: 'Bernoulli trial', zh: '伯努利试验', page: 1196 },
        { en: 'geometric distribution', zh: '几何分布', page: 1197 },
        { en: 'binomial distribution', zh: '二项分布', page: 1198 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    {
      type: 'pseudocode',
      title: '本节在原书里没有伪代码框',
      algo: null,
      signature: '',
      page: 1196,
      lines: [],
      vars: [],
      note: '★ 附录 C 用定义、定理与证明讲计数与概率，没有伪代码；实现对照见下一阶段 C 程序。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '看着几何与二项分布的形状',
      panels: [
        { title: 'B(10, 0.5) 的概率质量函数（钟形）',
          viz: 'growth',
          chart: { xMax: 10, series: [
            { name: 'P(X=k) = C(10,k)/1024', expr: '(function(k){var c=1;for(var i=0;i<k;i++)c=c*(10-i)/(i+1);return c/1024;})(n)', color: '--viz-active' },
          ] },
          note: '★ 峰在 k=5（C(10,5)/1024≈0.246）；对称钟形，E=5、V=2.5。' },
        { title: '二项均值 E=np 与方差 V=npq（p=0.5）随 n 增长',
          viz: 'growth',
          chart: { xMax: 20, series: [
            { name: 'E = 0.5 n', expr: '0.5 * n', color: '--viz-done' },
            { name: 'V = 0.25 n', expr: '0.25 * n', color: '--viz-compare' },
          ] },
          note: '★ 均值、方差都随 n 线性增长（独立试验，方差不放大成 n²）。' },
      ],
      tasks: ['对照 C 程序 part 4：B(10,0.5) 每格 pmf 与理论差 <0.01，E≈5、V≈2.5。'],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从书到 C：用模拟逼近几何与二项矩',
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
          { line: 150, zh: '★ part 4 入口：几何分布 p=1/6 模拟 20 万次 + 二项 B(10,0.5) 模拟 20 万次。' },
          { line: 161, zh: '★★ 几何平均等待≈6（实测约 5.998），断言 (5.5,6.5)。' },
          { line: 182, zh: '★ 打印 B(10,0.5) 每格 pmf 对照理论，并断言 E≈5、V≈2.5。' },
        ],
        tests: [
          { in: '几何 p=1/6 平均等待', out: '≈5.998（理论 1/p=6）' },
          { in: 'B(10,0.5) E / V', out: '≈5.000 / ≈2.498' },
        ],
        mapping: [],
      },
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '几何与二项分布的关键公式',
      intro: '这一节给出两个分布的 pmf、期望与方差。下面把最关键的三条列出来，并标出原书页码。',
      claims: [
        { expr: '\\Pr(X=k)=q^{k-1}p,\\ \\mathrm{E}[X]=\\frac{1}{p}', when: '几何分布 pmf 与期望', page: 1197, source: 'book' },
        { expr: '\\Pr(X=k)=\\binom{n}{k}p^k q^{n-k}', when: '二项分布 pmf（C.4 式）', page: 1198, source: 'book' },
        { expr: '\\mathrm{E}[X]=np,\\ \\mathrm{Var}[X]=npq', when: '二项均值与方差', page: 1199, source: 'book' },
      ],
      tables: [],
      chart: null,
      derivations: [],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: '为什么二项分布 B(n,p) 的期望是 np',
      statement: '对 X∼B(n,p)（n 次独立伯努利试验中的成功次数），有 E[X] = np，Var[X] = npq（q=1−p）。',
      page: 1199,
      intro: '★ 用 C.3 的指示变量线性性一行即得：把"第 i 次成功"写成指示变量，无需任何二项分布求和技巧。',
      steps: [
        { title: '第一步 · 拆成指示变量之和',
          en: 'How many successes occur during n Bernoulli trials, where a success occurs with probability p and a failure with probability q = 1 − p? Define the random variable X to be the number of successes in n trials.',
          page: 1199,
          body: ['令 X_i 为"第 i 次试验成功"的指示变量：成功取 1，失败取 0。',
            '则总成功次数 X = X_1 + X_2 + … + X_n。',
            '★ 每个 X_i 是伯努利(p)，E[X_i]=p，且这里只是代数拆分。'] },
        { title: '第二步 · 期望线性性',
          en: 'Linearity of expectation produces the same result with substantially less algebra.',
          page: 1199,
          body: ['由 C.3 的线性性 E[X] = Σ E[X_i] = n·p。',
            '无需把二项分布 pmf 求和，也不用假设各次相关与否（线性性无条件）。',
            '★ 这正是第 5 章随机化分析里反复使用的"指示变量 + 线性"套路。'] },
        { title: '第三步 · 方差',
          en: 'Since X i takes on only the values 0 and 1, we have X 2 i = X i , which implies E [X 2 i ] = E [X i ] = p.',
          page: 1199,
          body: ['因为 n 次伯努利试验相互独立，方差才可加：Var[X]=ΣVar[X_i]=n·p(1−p)=npq。',
            '注意：期望线性永远成立，但方差可加需要独立性（否则还要加协方差项）。',
            '★ part 4 模拟 B(10,0.5) 给出 V≈2.498，与 npq=2.5 吻合。'] },
      ],
      conclusion: '★ 结论：二项期望 np 来自指示变量的线性性（无条件），方差 npq 还需独立性才能直接相加。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: '公平骰子，第一次掷出 6 的平均等待次数是？',
          options: ['3', '6', '1/6', '36'], answer: 1,
          why: '★ 几何分布 p=1/6，E=1/p=6。' },
        { kind: 'single', q: 'B(10, 0.5) 的期望与方差分别是？',
          options: ['5, 2.5', '10, 5', '5, 5', '2.5, 5'], answer: 0,
          why: '★ E=np=5，V=npq=2.5。' },
        { kind: 'judge', q: '几何分布是无记忆的：已失败 k 次后，下一次成功的概率仍是 p。', answer: true,
          why: '★ 每次试验独立，过去不影响未来。' },
        { kind: 'single', q: '掷 10 次公平硬币，恰好 5 次正面的近似概率是？',
          options: ['约 0.246', '约 0.5', '约 0.1', '约 0.01'], answer: 0,
          why: '★ C(10,5)/2^10 = 252/1024 ≈ 0.246。' },
        { kind: 'judge', q: '二项分布 B(n,p) 的方差在 p=0.5 时达到最大（固定 n）。', answer: true,
          why: '★ V=np(1−p) 关于 p 是开口向下的二次函数，p=0.5 取最大 n/4。' },
        { kind: 'simulate', q: 'C 程序 part 4 模拟 B(10,0.5) 得到的方差约等于多少（保留两位小数）？',
          expect: [2.5], placeholder: '例如：2.00',
          why: '★ 实测 V≈2.498，理论 npq=2.5。' },
      ],
      bookExercises: [],
    },
  ],
};
