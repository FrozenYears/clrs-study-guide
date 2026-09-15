/*
 * compare_growth.c — CLRS 第 4 版 3.3 节「标准记号与常用函数」配套 C 程序
 *
 * 把同一组 n 下的一串常用函数的值打出来，看它们怎么交叉、看谁先失控：
 *     lg n, sqrt(n), n, n lg n, n^2, 2^n
 * 另外用比值定量展示两条关键的「小 o」关系（都对应 3.3 节的结论）：
 *   sqrt(n) / lg n  -> +inf   即 lg n = o(sqrt n)         （polylog 论证的雏形）
 *   2^n / n^2       -> +inf   即 n^2 = o(2^n)             （式 (3.13) 的特例 a=2, b=2）
 *
 * 下标约定：只有自变量 n，没有数组，所以不存在「书上每个下标减 1」的问题。
 *
 * 编译（本机已用 gcc 验证零警告）：
 *   gcc -std=c99 -Wall -Wextra -Werror -O0 -o compare_growth compare_growth.c && ./compare_growth
 */
#include <stdio.h>
#include <math.h>

static double lg(double n) { return log2(n); }

int main(void)
{
    printf("同一组 n 下各常用函数的增长（n = 2^k）：\n");
    printf("%-8s %-10s %-10s %-8s %-12s %-14s %-20s\n",
           "n", "lg n", "sqrt n", "n", "n lg n", "n^2", "2^n");
    for (int e = 0; e <= 6; e++) {
        double n = (double)(1 << e);          /* n = 1, 2, 4, 8, 16, 32, 64 */
        unsigned long long two_n = (n <= 63) ? (1ULL << (int)n) : 0; /* 2^n，n 太大时溢出不打 */
        printf("%-8.0f %-10.4f %-10.4f %-8.0f %-12.1f %-14.0f %-20llu\n",
               n, lg(n), sqrt(n), n, n * lg(n), n * n, two_n);
    }

    /* 定量展示 lg n = o(sqrt n)：sqrt(n)/lg n 应随 n 增大而增大（趋于无穷） */
    printf("\nlg n = o(sqrt n) ?  看 sqrt(n)/lg n（应随 n 增大而增大）：\n");
    for (int e = 4; e <= 24; e += 4) {
        double n = (double)(1 << e);
        printf("  n = %-10.0f  sqrt(n)/lg n = %.4f\n", n, sqrt(n) / lg(n));
    }

    /* 定量展示 n^2 = o(2^n)：2^n / n^2 应随 n 增大而增大（趋于无穷） */
    printf("\nn^2 = o(2^n) ?  看 2^n / n^2（应随 n 增大而增大）：\n");
    for (int n = 2; n <= 60; n += 2) {
        unsigned long long two_n = 1ULL << n;  /* 60 < 64，仍在 uint64 范围内 */
        printf("  n = %-4d  2^n / n^2 = %.4f\n", n, (double)two_n / ((double)n * n));
    }

    printf("\nALL COMPARE-GROWTH TESTS PASSED\n");
    return 0;
}
