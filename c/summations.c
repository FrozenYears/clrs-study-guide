/* summations.c -- 附录 A：求和公式（A.1）与定界技术（A.2）的 C 实测。
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
