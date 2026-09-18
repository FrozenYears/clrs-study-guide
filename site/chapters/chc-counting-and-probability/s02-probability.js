/* =============================================================================
 * 第 C 章 C.2 —— 第 s02 关：C.2 Probability
 *
 * 原文锚点：印刷页 1184–1190（pdf_index 1205–1211）
 * ========================================================================== */

export default {
  key: 's02',
  id: 'chC/s02',
  chapter: 'C',
  section: 'C.2',
  title: '概率',
  shortTitle: 'C.2 概率',
  titleEn: 'Probability',
  source: { printed: [1184, 1190], pdf: [1205, 1211] },
  sourceNote: '本关对应原书 C.2 节（印刷页 1184–1190）。',
  prerequisites: [
    { label: 'C.1 Counting', url: '#/chC/s01' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '先看清这一关的位置',
      why: '计数告诉你"有多少种可能"，概率则给每种可能赋一个权重。它是 C.3 随机变量、第 5 章随机化算法的语言基础。',
      position: '附录 C 的第二节。前置是 C.1 计数；往后接 C.3 离散随机变量、C.4 几何/二项、C.5 二项尾部。',
      unlocks: [
        { label: 'C.3 Discrete random variables', url: '#/chC/s03' },
      ],
      mathKit: [
        { title: '样本空间与事件', body: '样本空间 S 是所有基本结果的集合；事件 A 是 S 的子集，概率 P(A)∈[0,1]，P(S)=1。' },
        { title: '加法公理', body: '若 A、B 互斥（不交），则 $\\Pr(A\\cup B)=\\Pr(A)+\\Pr(B)$。' },
        { title: '条件概率与独立', body: '$\\Pr(A\\mid B)=\\Pr(A\\cap B)/\\Pr(B)$；独立时 $\\Pr(A\\cap B)=\\Pr(A)\\Pr(B)$。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '连续掷硬币，总有一次会出正面',
      scene: '你反复掷一枚公平硬币，想知道"前 n 次全是反面"这件事会不会越来越不可能。',
      body: [
        '每掷一次，出现反面的概率是 1/2；前两次都反面的概率是 (1/2)²，前三次是 (1/2)³……每多掷一次，这个"一直没出正面"的概率就再减半。',
        '于是"前 n 次全反面"的概率 = (1/2)^n，它随着 n 增大迅速塌向 0；反过来，"前 n 次里至少出现一次正面"的概率 = 1 − (1/2)^n，迅速逼近于 1。',
        '★ C 程序 part 2 用固定种子掷 12 万次骰子，分别用六面频率的卡方 χ²（df=5）和两骰子和 36 格的卡方（df=35）检验"均匀分布"假设，并统计和为 7 的次数。',
      ],
      interactive: { text: '想一想：若每次成功概率只有 p=0.1，重复多少次后"至少成功一次"的概率才超过 0.5？答案是 n≈7（1−0.9^7≈0.52）。' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，含语料抽取伪影（如 fH; Tg 即 {H,T}、A \\ B 即 A∖B）。',
      blocks: [
        { kind: 'body', page: 1184,
          en: 'Provide both an algebraic proof and an argument based on a method for choosing j + k items out of n. Give an example in which equality does not hold.',
          zh: '★ 这是 C.2 习题：要求用代数与组合两种办法证明一条恒等式，并举例说明等号何时不成立。' },
        { kind: 'body', page: 1184,
          en: 'Use induction on all integers k such that 0 ≤ k ≤ n/2 to prove inequality (C.7), and use equation (C.3) to extend it to all integers k such that 0 ≤ k ≤ n.',
          zh: '★ 习题：先对 0≤k≤n/2 归纳证不等式 (C.7)，再借 (C.3) 推广到全部 k。' },
        { kind: 'body', page: 1184,
          en: 'By differentiating the entropy function H(Ω), show that it achieves its maximum value at Ω = 1/2. What is H(1/2)?',
          zh: '★ 习题：对熵函数 H(Ω) 求导，说明其在 Ω=1/2 取最大值，并求 H(1/2)。' },
        { kind: 'body', page: 1184,
          en: 'Probability is an essential tool for the design and analysis of probabilistic and randomized algorithms. This section reviews basic probability theory.',
          zh: '★ 概率是用好随机化算法的必备工具；本节复习基础概率论。' },
        { kind: 'body', page: 1185,
          en: 'We define probability in terms of a sample space S , which is a set whose elements are called outcomes or elementary events. Think of each outcome as a possible result of an experiment. For the experiment of flipping two distinguishable coins, with each individual flip resulting in a head (H) or a tail ( T), you can view the sample space S as consisting of the set of all possible 2-strings over fH; Tg:',
          zh: '★ 样本空间 S：所有基本结果（elementary events）的集合。两枚可区分硬币的样本空间是 {HH,HT,TH,TT}（语料伪影 fH; Tg 即 {H,T}）。' },
        { kind: 'body', page: 1185,
          en: 'An event is a subset 1 of the sample space S . For example, in the experiment of flipping two coins, the event of obtaining one head and one tail is fHT; THg. The event S is called the certain event, and the event ; is called the null event. We say that two events A and B are mutually exclusive if A \\ B = ,. An outcome s also defines the event fs g, which we sometimes write as just s . By definition, all outcomes are mutually exclusive.',
          zh: '★ 事件是 S 的子集（语料伪影：subset 1、fHT; THg 即 {HT,TH}、; 即 ∅、A \\ B = , 即 A∩B=∅）。必然事件=S，空事件=∅，互斥即交集为空。' },
      ],
      terms: [
        { en: 'sample space', zh: '样本空间', page: 1185 },
        { en: 'event', zh: '事件', page: 1185 },
        { en: 'probability', zh: '概率', page: 1184 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    {
      type: 'pseudocode',
      title: '本节在原书里没有伪代码框',
      algo: null,
      signature: '',
      page: 1184,
      lines: [],
      vars: [],
      note: '★ 附录 C 用定义、定理与证明讲计数与概率，没有伪代码；实现对照见下一阶段 C 程序。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '看着"重复试验"让稀有事件变必然',
      panels: [
        { title: '前 n 次全为反面（一次成功都没有）的概率',
          viz: 'growth',
          chart: { xMax: 10, series: [
            { name: 'P(前 n 次全反面) = (1/2)^n', expr: 'Math.pow(0.5, n)', color: '--viz-active' },
          ] },
          note: '★ 指数衰减：每多掷一次就再减半，n 稍大就几乎为 0。' },
        { title: '前 n 次里至少出现一次正面的概率',
          viz: 'growth',
          chart: { xMax: 10, series: [
            { name: 'P(至少一次正面) = 1 − (1/2)^n', expr: '1 - Math.pow(0.5, n)', color: '--viz-done' },
          ] },
          note: '★ 与之互补，迅速逼近于 1：重复试验让"至少一次成功"几乎确定。' },
      ],
      tasks: ['对照 C 程序 part 2：六面/两骰子的卡方 χ² 都在阈值内，说明骰子近似均匀。'],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从书到 C：用卡方检验"骰子是否均匀"',
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
          { line: 85, zh: '★ part 2 入口：固定种子掷 12 万次两枚骰子，累计面频与和频。' },
          { line: 98, zh: '★★ 六面频率卡方 χ²（df=5），断言 < 15（实测约 12.288）。' },
          { line: 114, zh: '★ 两骰子和 36 格卡方 χ²（df=35），断言 < 105（实测约 48.623）。' },
          { line: 117, zh: '★ 和为 7 的实测次数对照理论 6/36，容差 500。' },
        ],
        tests: [
          { in: '六面卡方 χ² (df=5)', out: '≈12.288，< 15' },
          { in: '两骰子和 36 格卡方 (df=35)', out: '≈48.623，< 105' },
        ],
        mapping: [],
      },
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '概率论里那些会反复用到的公理',
      intro: '这一节没有给出渐进复杂度，而是概率的三条公理与基本事实。下面把最关键的三条列出来，并标出原书页码。',
      claims: [
        { expr: '\\Pr(A)\\ge 0,\\ \\Pr(S)=1', when: '概率公理（非负、归一）', page: 1184, source: 'book' },
        { expr: '\\Pr(A\\cup B)=\\Pr(A)+\\Pr(B)', when: 'A、B 互斥时的加法公理', page: 1185, source: 'book' },
        { expr: '\\Pr(A\\mid B)=\\frac{\\Pr(A\\cap B)}{\\Pr(B)}', when: '条件概率定义', page: 1186, source: 'book' },
      ],
      tables: [],
      chart: null,
      derivations: [],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: '为什么互斥事件的并的概率等于概率之和',
      statement: '若事件 A、B 互斥（A∩B=∅），则 P(A∪B) = P(A) + P(B)；对任意有限个两两互斥事件，概率具有可加性。',
      page: 1185,
      intro: '★ 这是概率公理之一：互斥意味着两事件没有共同的基本结果，于是它们"占的份额"直接相加。',
      steps: [
        { title: '第一步 · 从样本空间的划分看',
          en: 'An event is a subset 1 of the sample space S .',
          page: 1185,
          body: ['样本空间 S 被所有基本结果（outcomes）不交地铺满，每个结果恰好属于一个事件。',
            'A∪B 所包含的基本结果数 = |A| + |B|（因为 A∩B=∅，没有重复计数）。',
            '★ 在离散等可能情形下，P(A∪B) = (|A|+|B|)/|S| = P(A)+P(B)。'] },
        { title: '第二步 · 概率测度的可加性',
          en: 'A probability distribution Pr fg on a sample space S is a mapping from events of S to real numbers satisfying the following probability axioms:',
          page: 1185,
          body: ['概率被定义为样本空间上的测度，公理直接规定了对有限个两两不交事件的可加性。',
            '因此不依赖"等可能"假设；只要 A∩B=∅，无论分布如何都有 P(A∪B)=P(A)+P(B)。',
            '★ 这是后续全概率公式、条件概率一切推导的起点。'] },
        { title: '第三步 · 推广与边界',
          en: 'Most of the probability distributions we see in this book are over finite or countable sample spaces, and we generally consider all subsets of a sample space to be events.',
          page: 1185,
          body: ['若 A、B 不互斥，则 P(A∪B) = P(A)+P(B)−P(A∩B) ≤ P(A)+P(B)（并集界 / union bound）。',
            '互斥情形正是交集项为零的特例，所以可加性可被并集界统一涵盖。',
            '★ 原书 C.2 用这条公理推出条件概率与独立性，是随机化分析的语言底座。'] },
      ],
      conclusion: '★ 结论：互斥使得"份额"无重叠，故并的概率等于概率之和；非互斥时则要用并集界减去重叠部分。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: '掷两枚公平硬币，样本空间有多少个基本结果？',
          options: ['2', '3', '4', '6'], answer: 2,
          why: '★ 每枚 2 种，乘法原理 2×2=4：{HH,HT,TH,TT}。' },
        { kind: 'judge', q: '事件"恰好一正一反"在掷两枚硬币时包含 {HT, TH} 两个基本结果。', answer: true,
          why: '★ 一正一反可由 HT 或 TH 实现，共 2 个结果，概率 2/4=1/2。' },
        { kind: 'judge', q: '若 A、B 互斥，则 P(A∪B) = P(A) + P(B)。', answer: true,
          why: '★ 互斥即 A∩B=∅，概率可加。' },
        { kind: 'single', q: '前 3 次掷公平硬币全是反面的概率是？',
          options: ['1/8', '1/4', '1/2', '3/8'], answer: 0,
          why: '★ (1/2)^3 = 1/8。' },
        { kind: 'judge', q: '两枚可区分硬币的样本空间与两枚不可区分硬币的样本空间在概率计算上必须不同。', answer: false,
          why: '★ 是否"可区分"只影响如何枚举；只要正确赋概率，物理结果相同。原书用可区分硬币得到 4 个等可能结果。' },
        { kind: 'simulate', q: 'C 程序 part 2 里六面频率卡方 χ² 的断言阈值是多少（df=5）？',
          expect: [15], placeholder: '例如：10',
          why: '★ 断言 < 15；实测约 12.288，落在上界 3×df 之内。' },
      ],
      bookExercises: [],
    },
  ],
};
