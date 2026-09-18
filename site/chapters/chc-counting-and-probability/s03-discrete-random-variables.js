/* =============================================================================
 * 第 C 章 C.3 —— 第 s03 关：C.3 Discrete random variables
 *
 * 原文锚点：印刷页 1191–1195（pdf_index 1212–1216）
 * ========================================================================== */

export default {
  key: 's03',
  id: 'chC/s03',
  chapter: 'C',
  section: 'C.3',
  title: '离散随机变量',
  shortTitle: 'C.3 离散随机变量',
  titleEn: 'Discrete random variables',
  source: { printed: [1191, 1195], pdf: [1212, 1216] },
  sourceNote: '本关对应原书 C.3 节（印刷页 1191–1195）。',
  prerequisites: [
    { label: 'C.2 Probability', url: '#/chC/s02' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '先看清这一关的位置',
      why: '把"事件"升级成"随机变量"——给每个结果赋一个实数，于是期望、方差、指示变量都能谈。它是 C.4 分布、第 5 章随机化分析的工具箱。',
      position: '附录 C 的第三节。前置是 C.1 计数、C.2 概率；往后接 C.4 几何/二项、C.5 二项尾部。',
      unlocks: [
        { label: 'C.4 The geometric and binomial distributions', url: '#/chC/s04' },
      ],
      mathKit: [
        { title: '期望', body: '离散随机变量 $\\mathrm{E}[X]=\\sum_x x\\,\\Pr(X=x)$；线性性 $\\mathrm{E}[aX+b]=\\mathrm{aE}[X]+b$。' },
        { title: '方差', body: '$\\mathrm{Var}[X]=\\mathrm{E}[(X-\\mathrm{E}[X])^2]=\\mathrm{E}[X^2]-\\mathrm{E}[X]^2$。' },
        { title: '指示随机变量', body: '事件 A 的指示变量 $I_A$ 取 1（A 发生）或 0；$\\mathrm{E}[I_A]=\\Pr(A)$，且期望线性，无需独立。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '面试流水线：平均会雇几个人',
      scene: '公司逐个面试 n=10000 名应聘者，只要当场遇到"迄今最强"的就发 offer，问平均会发多少份 offer。',
      body: [
        '把"第 i 个人被雇用"写成一个指示变量 X_i：当且仅当他是前 i 人里最强的，X_i=1。第 i 人是前 i 人里最强的概率是 1/i，所以 E[X_i]=1/i。',
        '总雇用人数是 Σ X_i，期望就是 Σ 1/i —— 这正是调和数 H(n)，n=10000 时约 9.79。关键是：这里一步都没假设各人是否独立，因为期望天生线性。',
        '★ C 程序 part 3 对 n=10000 做 100 组随机排列的聘用模拟，平均雇用数落在 9.0–10.6 区间，呼应理论 H(10000)≈9.79。',
      ],
      interactive: { text: '想一想：即便面试顺序是随机的，期望雇用数也只是 O(ln n)——1 万人也只雇约 10 个，是不是比直觉少很多？' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，含语料抽取伪影（如 fs 2 S W 即 {s∈S | …}、won’t 即 won’t 的弯引号）。',
      blocks: [
        { kind: 'body', page: 1191,
          en: 'C.3 Discrete random variables 1191 them will pass the course and the other two will fail. Carmine asks Professor Gore privately which of Jeff and Tim will fail, arguing that since he already knows at least one of them will fail, the professor won’t be revealing any information about',
          zh: '★ 这是 C.3 开篇的"隐私悖论"习题引子：已知三人中至少两人挂科，再告知其中一人挂科，是否泄露了第三人信息？' },
        { kind: 'body', page: 1191,
          en: 'Carmine’s outcome. In a breach of privacy law, Professor Gore tells Carmine that Jeff will fail. Carmine feels somewhat relieved now, figuring that either he or Tim will pass, so that his probability of passing is no w 1/2. Is Carmine correct, or is his chance of passing still 1/3? Explain.',
          zh: '★ 续：Carmine 听说 Jeff 挂了，以为自己过关概率变成 1/2；其实仍是 1/3（条件概率陷阱）。' },
        { kind: 'body', page: 1191,
          en: 'A (discrete) random variable X is a function from a finite or countably infinite sample space S to the real numbers. It associates a real number with each possible outcome of an experiment, which allows us to work with the probability distribution induced on the resulting set of numbers. Ran dom variables can also be defined for uncountably infinite sample spaces, but they raise technical issues that are unnecessary to address for our purposes. Therefore we’ll assume that random variables are discrete.',
          zh: '★ 定义：随机变量 X 是把样本空间 S 映到实数的函数；本书只考虑离散情形（避免连续情形技术细节）。' },
        { kind: 'body', page: 1191,
          en: 'For a random variable X and a real number x , we define the event X = x to be fs 2 S W X(s) = x g, and thus',
          zh: '★ 事件 {X=x} 定义为 {s∈S | X(s)=x}（语料伪影 fs 2 S W … g 即 {s∈S | … }）。' },
        { kind: 'body', page: 1191,
          en: 'The function f(x) = Pr fX = x g is the probability density function of the random variable X . From the probability axioms, Pr fX = x g ≥ 0 and P x Pr fX = x g = 1.',
          zh: '★ 概率质量函数（pmf）f(x)=Pr(X=x)；由公理知 f(x)≥0 且 Σ_x f(x)=1。' },
        { kind: 'body', page: 1191,
          en: 'As an example, consider the experiment of rolling a pair of ordinary, 6-sided dice. There are 36 possible outcomes in the sample space. Assume that the probability distribution is uniform, so that each outcome s 2 S is equally likely:',
          zh: '★ 例：两枚六面骰子，36 个等可能结果，引入分布后就能谈"点数和""最大值"等随机变量。' },
      ],
      terms: [
        { en: 'random variable', zh: '随机变量', page: 1191 },
        { en: 'expectation', zh: '期望', page: 1192 },
        { en: 'variance', zh: '方差', page: 1193 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    {
      type: 'pseudocode',
      title: '本节在原书里没有伪代码框',
      algo: null,
      signature: '',
      page: 1191,
      lines: [],
      vars: [],
      note: '★ 附录 C 用定义、定理与证明讲计数与概率，没有伪代码；实现对照见下一阶段 C 程序。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '看着随机变量怎么分布、期望怎么长',
      panels: [
        { title: '两枚骰子点数和的 pmf（三角分布）',
          viz: 'growth',
          chart: { xMax: 12, series: [
            { name: 'P(和=n) = min(n−1,13−n)/36', expr: 'Math.max(0, Math.min(n - 1, 13 - n)) / 36', color: '--viz-active' },
          ] },
          note: '★ 峰在 n=7（6/36）；左右对称递减，是最经典的离散三角分布。' },
        { title: '聘用问题期望雇用数 ≈ H(n)（调和数）',
          viz: 'growth',
          chart: { xMax: 12, series: [
            { name: 'E[雇用数] ≈ ln n + γ', expr: 'Math.log(Math.max(1, n)) + 0.5772156649', color: '--viz-done' },
          ] },
          note: '★ 期望随 n 仅对数增长：n=10000 时 ≈9.79，与 part 3 模拟吻合。' },
      ],
      tasks: ['对照 C 程序 part 3：n=10000 的 100 组平均雇用数落在 9.0–10.6，呼应 H(10000)。'],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从书到 C：用指示变量线性性验证聘用期望',
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
          { line: 122, zh: '★ part 3 入口：对 n=10000 做 100 组 Fisher-Yates 随机排列的聘用模拟。' },
          { line: 144, zh: '★★ 打印平均雇用数与理论调和数 H(10000)≈9.788，断言 avg∈(9.0,10.6)。' },
        ],
        tests: [
          { in: '聘用 n=10000，100 组平均', out: '≈9.550；理论 H≈9.788' },
          { in: 'H(10000)', out: '≈9.788' },
        ],
        mapping: [],
      },
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '随机变量里那些会反复用到的公式',
      intro: '这一节没有给出渐进复杂度，而是期望、方差与线性性的基本事实。下面把最关键的三条列出来，并标出原书页码。',
      claims: [
        { expr: '\\mathrm{E}[aX+b]=a\\,\\mathrm{E}[X]+b', when: '期望的线性（缩放与平移）', page: 1192, source: 'book' },
        { expr: '\\mathrm{E}[X+Y]=\\mathrm{E}[X]+\\mathrm{E}[Y]', when: '期望可加（无需独立）', page: 1192, source: 'book' },
        { expr: '\\mathrm{Var}[X]=\\mathrm{E}[X^2]-\\mathrm{E}[X]^2', when: '方差的便捷算法', page: 1193, source: 'book' },
      ],
      tables: [],
      chart: null,
      derivations: [],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: '为什么期望具有线性性（无需独立）',
      statement: '对任意离散随机变量 X、Y 与常数 a、b，有 E[aX+b+Y] = a·E[X] + b + E[Y]；该结论不要求 X、Y 独立。',
      page: 1192,
      intro: '★ 期望线性性是全书最有用的技巧之一（尤其配指示变量）。关键：线性性只依赖"对联合分布求和"，与独立性无关。',
      steps: [
        { title: '第一步 · 从定义写出双重求和',
          en: 'The expected value (or, synonymously, expectation or mean) of a discrete random variable X is E [X ] =',
          page: 1192,
          body: ['按定义 E[X+Y] = Σ_{所有结果 s} (X(s)+Y(s))·P(s)。',
            '把求和拆成 Σ X(s)P(s) + Σ Y(s)P(s) = E[X] + E[Y]。',
            '★ 这里只是代数拆项，完全没有用到 X、Y 是否独立。'] },
        { title: '第二步 · 加上缩放与平移',
          en: 'Linearity of expectation says that the expectation of the sum of two random variables is the sum of their expectations, that is, E [X + Y ] = E [X ] + E [Y ] ; (C.24)',
          page: 1192,
          body: ['E[aX+b] = Σ (aX(s)+b)P(s) = aΣX(s)P(s) + bΣP(s) = aE[X] + b。',
            '与第一步合并即得 E[aX+b+Y] = aE[X]+b+E[Y]。',
            '★ 常数 b 的期望就是 b 本身（因为 ΣP(s)=1）。'] },
        { title: '第三步 · 指示变量的威力',
          en: 'Linearity of expectation applies to a broad range of situations, holding even when X and Y are not independent.',
          page: 1193,
          body: ['把复杂事件写成指示变量 I_A（发生=1，否则=0），则 E[I_A]=P(A) 且 E[ΣI_A]=ΣP(A)。',
            '聘用问题即 Σ_i E[X_i] = Σ_i 1/i = H(n)，无需分析"各人之是否最强"之间的复杂依赖。',
            '★ 这正是 part 3 模拟的理论依据：期望线性让 O(ln n) 的结论一行就得。'] },
      ],
      conclusion: '★ 结论：期望线性性是无条件成立的代数恒等式；配合指示变量，可在不碰联合分布的情况下求出复杂随机量的期望。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: '两枚公平骰子点数和为 7 的概率是？',
          options: ['1/6', '1/12', '5/36', '1/36'], answer: 0,
          why: '★ 36 种等可能结果中有 6 种和为 7，故 6/36=1/6。' },
        { kind: 'judge', q: '随机变量只是把样本空间里的每个结果映射到一个实数。', answer: true,
          why: '★ 原书定义：random variable 是 S→R 的函数。' },
        { kind: 'judge', q: '要算 E[X+Y]，必须先确认 X、Y 相互独立。', answer: false,
          why: '★ 期望线性性无条件成立，与独立性无关。' },
        { kind: 'single', q: '事件 A 的指示变量 I_A 的期望等于？',
          options: ['Pr(A)', '1−Pr(A)', '0', 'Var(A)'], answer: 0,
          why: '★ E[I_A]=1·Pr(A)+0·Pr(A^c)=Pr(A)。' },
        { kind: 'judge', q: '聘用问题中，第 i 个面试者被雇用的概率恰为 1/i，故期望雇用总数为 H(n)。', answer: true,
          why: '★ 第 i 人是前 i 人里最强的概率为 1/i，求和得调和数 H(n)≈ln n。' },
        { kind: 'simulate', q: 'C 程序 part 3 对 n=10000 跑 100 组，打印的理论调和数 H(10000) 约等于多少（保留两位小数）？',
          expect: [9.79], placeholder: '例如：9.50',
          why: '★ H(10000)≈9.788；模拟平均约 9.550 落在断言区间 (9.0,10.6)。' },
      ],
      bookExercises: [],
    },
  ],
};
