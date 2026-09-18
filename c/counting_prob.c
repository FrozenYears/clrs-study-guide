/* counting_prob.c -- 附录 C：计数与概率（C.1–C.5）的实测自检。
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
