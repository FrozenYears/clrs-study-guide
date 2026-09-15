/*
 * growth_stats.c — CLRS 第 4 版 3.2 节「渐进记号的形式定义」配套 C 程序
 *
 * 对应原书 3.1 节（印刷页 50–51）给出的例子多项式：
 *     f(n) = 7 n^3 + 100 n^2 - 20 n + 6
 * 我们用真实数字验证两件事：
 *   1) 当 n 变大时，f(n) 由最高阶项 7 n^3 主导（比值 f(n)/(7 n^3) → 1）；
 *   2) 按 3.2 节 Θ 的形式定义，f(n) = Θ(n^3)：
 *      存在 c1, c2 > 0 与 n0，使对所有 n >= n0 都有 c1 n^3 <= f(n) <= c2 n^3。
 *
 * 本文件只有一个自变量 n，没有数组，所以不存在「书上每个下标减 1」的问题。
 * 函数头注释写清与书中公式的对应关系（p.50 的例子、3.2 的 Θ 定义）。
 *
 * 编译（本机已用 gcc 验证零警告）：
 *   gcc -std=c99 -Wall -Wextra -Werror -O0 -o growth_stats growth_stats.c && ./growth_stats
 */
#include <stdio.h>
#include <assert.h>

/* 原书 3.1 节例子的多项式：f(n) = 7 n^3 + 100 n^2 - 20 n + 6 */
static long long f(long long n)
{
    return 7LL * n * n * n + 100LL * n * n - 20LL * n + 6LL;
}

/* 最高阶项 7 n^3 —— 书上 p.50 说「它的最高阶项是 7 n^3」 */
static long long leading(long long n)
{
    return 7LL * n * n * n;
}

int main(void)
{
    printf("f(n) = 7 n^3 + 100 n^2 - 20 n + 6  主导项验证\n");
    printf("%-6s %-22s %-18s %-12s %-12s\n",
           "n", "f(n)", "7 n^3 (leading)", "f/(7n^3)", "低阶/(7n^3)");
    for (long long n = 1; n <= 1024; n *= 2) {
        long long fn = f(n);
        long long lead = leading(n);
        double ratio = (double)fn / (double)lead;          /* 应趋于 1 */
        double lower = (double)(fn - lead) / (double)lead; /* 低阶项占比，应趋于 0 */
        printf("%-6lld %-22lld %-18lld %-12.6f %-12.6f\n", n, fn, lead, ratio, lower);
    }

    /* 用 Θ 的形式定义（3.2 节）直接证明 f(n) = Θ(n^3)。
     * 取 c1 = 6, c2 = 8, n0 = 100：
     *   6 n^3 <= 7 n^3 + 100 n^2 - 20 n + 6 <= 8 n^3   对所有 n >= 100
     * 上界：需 100 n^2 - 20 n + 6 <= n^3，即 n^3 - 100 n^2 + 20 n - 6 >= 0。
     *       在 n = 100 时：1e6 - 1e6 + 2000 - 6 = 1994 > 0，且左侧随 n 单调增。
     * 下界：需 7 n^3 + 100 n^2 - 20 n + 6 >= 6 n^3，即 n^3 + 100 n^2 - 20 n + 6 >= 0，
     *       对所有 n >= 1 显然成立。
     */
    const long long c1 = 6, c2 = 8, n0 = 100;
    printf("\nTheta(n^3) 形式定义验证（取 c1=%lld, c2=%lld, n0=%lld）：\n", c1, c2, n0);
    printf("%-8s %-22s %-18s %-18s %s\n", "n", "c1 n^3", "f(n)", "c2 n^3", "6n^3<=f<=8n^3");
    for (long long n = n0; n <= 100000; n += 997) {
        long long fn = f(n);
        assert(c1 * n * n * n <= fn);
        assert(fn <= c2 * n * n * n);
        if (n <= 1000 || n == 100000) {
            printf("%-8lld %-22lld %-18lld %-18lld %s\n",
                   n, c1 * n * n * n, fn, c2 * n * n * n, "yes");
        }
    }
    printf("ALL GROWTH-STATS TESTS PASSED\n");
    return 0;
}
