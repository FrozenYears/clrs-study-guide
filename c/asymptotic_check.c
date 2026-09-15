/* asymptotic_check.c -- 3.1 节的数值实验：把「渐进记号」算给你看。
 *
 * 书中对应（第 4 版）：
 *   p.50  例子 f(n) = 7n^3 + 100n^2 - 20n + 6，它是 O(n^3)；
 *   p.52  插入排序任何输入的运行时间是 O(n^2)；
 *   p.52  图 3.1 的构造给出最坏情况 Omega(n^2)，于是最坏情况是 Theta(n^2)。
 *
 * 与书中公式的对应：
 *   part 1  直接算 f(n)/n^3：低阶项 100n^2 - 20n + 6 随 n 增大被淹没，比值 -> 7。
 *           这就是「扔掉低阶项和系数」的数值含义。
 *   part 2  验证上界：对区间内每个 n 都检查 f(n) <= 12 n^3（书上说存在常数 c 与
 *           n_0 使一切 n >= n_0 成立，这里把 c 与 n_0 都真的找出来）。
 *   part 3  插入排序最坏情况（逆序输入）的内层循环次数是 n(n-1)/2，
 *           比值 steps/n^2 -> 1/2，这就是最坏情况 Theta(n^2) 的数值版本。
 *
 * 书中伪代码下标从 1 开始，本实现从 0 开始，对应关系 A[i-1] <-> 书中的 A[i]。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -O0 -o asymptotic_check asymptotic_check.c
 */
#include <assert.h>
#include <stdio.h>

/* 原书 p.50 例子的多项式：f(n) = 7n^3 + 100n^2 - 20n + 6 */
static double f(long n)
{
    return 7.0 * n * n * n + 100.0 * n * n - 20.0 * n + 6.0;
}

/* 插入排序在最坏情况（逆序输入）下的内层循环执行次数。
 * 书上 p.52 的推导：外层跑 n-1 次，第 i 轮内层至多 i-1 次，
 * 总计 sum_{i=2..n} (i-1) = n(n-1)/2 —— 也就是 2.2 节求和式的封闭形式。 */
static long worst_case_steps(long n)
{
    return n * (n - 1) / 2;
}

int main(void)
{
    /* ---- part 1: 低阶项被淹没，f(n)/n^3 -> 7 ---- */
    printf("part 1: f(n) = 7n^3 + 100n^2 - 20n + 6,  f(n)/n^3 -> 7\n");
    printf("  %-10s %-14s %-12s\n", "n", "f(n)", "f(n)/n^3");
    for (long n = 1; n <= 4096; n *= 2) {
        printf("  %-10ld %-14.0f %-12.4f\n", n, f(n), f(n) / ((double)n * n * n));
    }

    /* ---- part 2: 上界真的存在——c = 12, n_0 = 20 ----
     * 对 [20, 64] 的每个 n 断言 f(n) <= 12 n^3；只要有一个不成立程序就停。 */
    for (long n = 20; n <= 64; n++) {
        assert(f(n) <= 12.0 * n * n * n);
    }
    printf("\npart 2: f(n) <= 12 n^3 for every n in [20, 64]  ->  f(n) is O(n^3)\n");

    /* ---- part 3: 插入排序最坏情况 steps/n^2 -> 1/2 ---- */
    printf("\npart 3: insertion sort worst case,  steps/n^2 -> 1/2\n");
    printf("  %-10s %-14s %-12s\n", "n", "steps", "steps/n^2");
    for (long n = 100; n <= 800; n *= 2) {
        long steps = worst_case_steps(n);
        printf("  %-10ld %-14ld %-12.4f\n", n, steps, (double)steps / ((double)n * n));
    }
    assert(worst_case_steps(100) == 4950);
    assert(worst_case_steps(6) == 15);

    printf("\nall checks passed.\n");
    return 0;
}
