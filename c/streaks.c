/* streaks.c -- 5.4.3 连续正面（Streaks）的蒙特卡洛数值验证。
 *
 * 书中约定：教学伪代码 LONGEST-STREAK 的下标从 1 开始，
 * 即 flip(i) 表示「第 i 次抛掷」；C 数组下标从 0 开始。
 * 因此 flips[0] 对应书中的 flip(1)，遍历 i = 0 .. n-1，
 * 对应关系为 flips[i] <-> flip(i+1)。
 *
 * 本程序不依赖标准库的 rand()，而是自带一个 64 位线性同余发生器（LCG），
 * 这样结果可复现，也不会因平台实现不同而产生差异。
 */

#include <assert.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>

/* ---- 自带的 64 位 LCG 伪随机数发生器 ---- */
static unsigned long long g_state = 88172645463325252ULL;

static void lcg_seed(unsigned long long seed)
{
    g_state = seed ? seed : 88172645463325252ULL;
}

/* 返回 [0, 2^64) 上的均匀整数 */
static unsigned long long lcg_next(void)
{
    g_state = g_state * 6364136223846793005ULL + 1442695040888963407ULL;
    return g_state;
}

/* 生成一次公平抛硬币：返回 1（正面 H）或 0（反面 T） */
static int flip_once(void)
{
    return (int)(lcg_next() >> 63);
}

/* ---- 与伪代码 LONGEST-STREAK 对应的 C 实现 ----
 * 输入 flips[0..n-1]，1 = 正面（H），0 = 反面（T）。
 * 返回最长连续正面的长度。
 * 伪代码行号与本站阶段 4 一一对应：
 *   1 best = 0            -> int best = 0;
 *   2 cur = 0             -> int cur = 0;
 *   3 for i = 1 to n      -> for (int i = 0; i < n; i++)
 *   4 if flip(i) = H      -> if (flips[i] == 1)
 *   5 cur = cur + 1       -> cur = cur + 1;
 *   6 else cur = 0        -> cur = 0;
 *   7 if cur > best       -> if (cur > best)
 *   8 best = cur          -> best = cur;
 *   9 return best         -> return best;
 */
static int longest_streak(const int *flips, int n)
{
    int best = 0;
    int cur = 0;
    for (int i = 0; i < n; i++) {
        if (flips[i] == 1) {
            cur = cur + 1;
        } else {
            cur = 0;
        }
        if (cur > best) {
            best = cur;
        }
    }
    return best;
}

/* 用 LCG 生成 n 次抛掷，写入调用方已分配的 flips 数组 */
static void generate_flips(int *flips, int n)
{
    for (int i = 0; i < n; i++) {
        flips[i] = flip_once();
    }
}

/* 蒙特卡洛：做 trials 次试验，返回最长连续正面的经验均值 */
static double monte_carlo_mean(int n, long trials)
{
    double sum = 0.0;
    int *flips = NULL;
    if (n > 0) {
        flips = (int *)malloc((size_t)n * sizeof(int));
    }
    for (long t = 0; t < trials; t++) {
        generate_flips(flips, n);
        sum += (double)longest_streak(flips, n);
    }
    if (flips != NULL) {
        free(flips);
    }
    return sum / (double)trials;
}

/* 断言：经验均值落在 log2(n) 附近的合理区间（即 Θ(lg n) 的数值体现）。
 * 已知 E[最长连续正面] ≈ lg n − 2/3，下面给一个宽松但非平凡的界。 */
static void check_growth(int n, long trials)
{
    double mean = monte_carlo_mean(n, trials);
    double lg = log2((double)n);
    assert(mean > lg - 2.5);
    assert(mean < lg + 0.8);
    printf("  n = %5d  lg n = %6.2f  经验均值 = %6.3f  (差 %+.3f)\n",
           n, lg, mean, mean - lg);
}

int main(void)
{
    const int ns[] = {16, 32, 64, 128, 256, 512, 1024, 2048, 4096};
    const int m = (int)(sizeof(ns) / sizeof(ns[0]));
    const long trials = 100000L;

    lcg_seed(123456789ULL);

    printf("5.4.3 Streaks —— 最长连续正面的期望 ≈ lg n（蒙特卡洛验证）\n");
    printf("每组试验次数 = %ld\n\n", trials);
    printf("%-8s %-10s %-12s %s\n", "n", "lg n", "经验均值", "与 lg n 之差");

    for (int i = 0; i < m; i++) {
        check_growth(ns[i], trials);
    }

    /* 验证「n 翻倍，最长段只增加约 1」：比较相邻两组的经验均值 */
    printf("\n翻倍检查（相邻 n 的均值差应接近 1）：\n");
    for (int i = 1; i < m; i++) {
        double a = monte_carlo_mean(ns[i - 1], trials);
        double b = monte_carlo_mean(ns[i], trials);
        printf("  n=%d -> n=%d : 均值 %+.3f -> %+.3f （差 %+.3f）\n",
               ns[i - 1], ns[i], a, b, b - a);
        assert(b - a > 0.4 && b - a < 1.6);
    }

    /* 验证「n 不同但 ⌊lg n⌋ 相同，经验均值接近」：
     * n=1000 与 n=1500 的 ⌊lg n⌋ 都是 9，期望应相近。 */
    printf("\n同 ⌊lg n⌋ 检查（n=1000 与 n=1500）：\n");
    {
        double m1 = monte_carlo_mean(1000, trials);
        double m2 = monte_carlo_mean(1500, trials);
        printf("  n=1000 均值 %.3f, n=1500 均值 %.3f（差 %.3f）\n", m1, m2, m1 - m2);
        assert(fabs(m1 - m2) < 1.0);
    }

    printf("\nstreaks.c 全部检查通过。\n");
    return 0;
}
