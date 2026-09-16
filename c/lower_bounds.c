/* lower_bounds.c -- 8.1 节决策树下界 Ω(n lg n) 的数值验证。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o lower_bounds lower_bounds.c -lm
 */
#include <assert.h>
#include <math.h>
#include <stdio.h>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

/* lg(n!) 逐项计算 */
static double lg_factorial_exact(int n)
{
    double s = 0;
    for (int k = 2; k <= n; k++) s += log2((double)k);
    return s;
}

/* lg(n!) 的 Stirling 近似：n lg n − n lg e + 0.5 lg(2πn) */
static double lg_factorial_stirling(int n)
{
    return n * log2((double)n) - n / log(2.0) + 0.5 * log2(2.0 * M_PI * (double)n);
}

int main(void)
{
    /* 1. Stirling 近似与逐项计算的偏差 < 1（n = 2..1000） */
    for (int n = 2; n <= 1000; n++) {
        assert(fabs(lg_factorial_exact(n) - lg_factorial_stirling(n)) < 1.0);
    }
    printf("part 1: n = 2..1000 的 lg(n!) Stirling 近似偏差全部 < 1\n");

    /* 2. lg(n!) = Θ(n lg n)：比值随 n 增大趋近 1 */
    printf("part 2: lg(n!) / (n lg n) 随 n 的变化：\n");
    double prev = 0;
    for (int n = 10; n <= 100000; n *= 10) {
        double ratio = lg_factorial_exact(n) / ((double)n * log2((double)n));
        printf("        n = %6d：ratio = %.4f\n", n, ratio);
        /* 单调趋近 1（从下方）；lg(n!)/(n lg n) = 1 − lg e/lg n + O(lg n/n)，
         * 收敛较慢：n = 10^4 时 ≈ 0.89，n = 10^5 时 ≈ 0.91 */
        if (prev > 0) { assert(ratio > prev); }
        if (n >= 100000) { assert(ratio > 0.9 && ratio < 1.0); }
        prev = ratio;
    }

    /* 3. 决策树叶子数：n! 个叶子的高度 h 满足 2^h ≥ n!，即 h ≥ lg(n!) */
    for (int n = 2; n <= 20; n++) {
        double h_min = lg_factorial_exact(n);
        /* 最坏情况比较次数 = ⌈lg(n!)⌉，必须 ≥ lg n（否则连前几个元素都分不开） */
        assert(ceil(h_min) >= log2((double)n));
    }
    printf("part 3: 决策树最低高度 ≥ lg(n!) = Θ(n lg n)（Theorem 8.1 的下界）\n");

    /* 4. 具体例子：n = 8 时 lg(8!) = 15.3，⌈⌉ = 16 —— 8! = 40320 个排列 */
    {
        double h = lg_factorial_exact(8);
        printf("part 4: n = 8：lg(8!) = %.2f，⌈⌉ = %d（8! = 40320 个叶子）\n",
               h, (int)ceil(h));
        assert(h > 15.0 && h < 16.0);
    }

    puts("all checks passed.");
    return 0;
}
