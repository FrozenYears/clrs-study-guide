/* balls_and_bins.c -- 5.4.2 球与箱（balls and bins）的数值自证。
 *
 * 书中约定下标从 1 开始（箱子编号为 1, 2, …, b），C 数组下标从 0 开始，
 * 因此本程序里 bin 变量取 0..b-1，对应书中的第 bin+1 号箱。
 *
 * 用固定种子的线性同余发生器（LCG）产生确定性伪随机序列：
 *     state = state * 6364136223846793005 + 1442695040888963407   (模 2^64)
 * 不依赖标准库的 rand()，保证结果可复现。
 *
 * 蒙特卡洛验证三件事（见原书 p143-144）：
 *   1) 给定箱子里的球数 ~ 二项分布 b(k; n, 1/b)，期望为 n/b；
 *   2) 指定箱子首次被命中所需投掷数的期望 ≈ b（几何分布，参数 1/b）；
 *   3) 每个箱子都至少落进一个球所需投掷数的期望 ≈ b·H_b ≈ b(ln b + γ)
 *      —— 这就是优惠券收集者问题（coupon collector's problem），即 b ln b + O(b)。
 *
 * 断言一律用区间（经验均值落在理论值的 ±10% 内），不要求精确相等。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o balls_and_bins balls_and_bins.c
 */

#include <assert.h>
#include <math.h>
#include <stdio.h>
#include <stdint.h>

#define MAX_B 4096          /* 本程序支持的最大箱子数（栈上固定缓冲，避免变长数组）*/
#define SEED  0x12345678ULL /* 固定种子，保证每次运行结果一致 */

/* ---- 确定性伪随机数（64 位线性同余发生器）---- */
static uint64_t lcg_state = SEED;

static void lcg_seed(uint64_t s)
{
    lcg_state = s;
}

static uint64_t lcg_next(void)
{
    lcg_state = lcg_state * 6364136223846793005ULL + 1442695040888963407ULL;
    return lcg_state;
}

/* 返回 [0, b) 中的均匀整数；取高 32 位以减少低位的线性同余偏差。 */
static int lcg_bin(int b)
{
    uint64_t r = lcg_next() >> 32;
    return (int)(r % (uint64_t)b);
}

/* 第 n 个调和数 H_n = sum_{i=1..n} 1/i。 */
static double harmonic(int n)
{
    double s = 0.0;
    for (int i = 1; i <= n; i++)
        s += 1.0 / (double)i;
    return s;
}

/* 蒙特卡洛：在 b 个箱子里各投 n 个球，统计「落入 0 号箱」的球数，
 * 返回其经验均值。理论期望为 n/b。 */
static double mean_in_given_bin(int b, int n, long trials)
{
    double total = 0.0;
    for (long t = 0; t < trials; t++) {
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (lcg_bin(b) == 0)
                count++;
        }
        total += (double)count;
    }
    return total / (double)trials;
}

/* 一次模拟：把球随机投进 b 个箱子，直到指定的 0 号箱首次被命中。
 * 返回投掷次数（几何分布，期望 b）。 */
static long toss_until_first_hit(int b)
{
    long tosses = 0;
    for (;;) {
        int bin = lcg_bin(b);
        tosses++;
        if (bin == 0)
            return tosses;
    }
}

/* 蒙特卡洛：指定箱首次被命中所需投掷数的经验均值。理论期望为 b。 */
static double mean_first_hit(int b, long trials)
{
    double total = 0.0;
    for (long t = 0; t < trials; t++)
        total += (double)toss_until_first_hit(b);
    return total / (double)trials;
}

/* 蒙特卡洛：把球随机投进 b 个箱子，直到每个箱子至少落进一个球，
 * 返回所需投掷数的经验均值。理论期望为 b·H_b（优惠券收集者问题）。 */
static double mean_all_hit(int b, long trials)
{
    assert(b >= 1 && b <= MAX_B);
    double total = 0.0;
    for (long t = 0; t < trials; t++) {
        int hit_count[MAX_B];
        for (int i = 0; i < b; i++)
            hit_count[i] = 0;
        int hits = 0;
        long tosses = 0;
        while (hits < b) {
            int bin = lcg_bin(b);
            tosses++;
            if (hit_count[bin] == 0)
                hits++;
            hit_count[bin]++;
        }
        total += (double)tosses;
    }
    return total / (double)trials;
}

int main(void)
{
    const double TOL = 0.10;   /* 经验均值与理论值的允许相对偏差 ±10% */

    /* 1) 给定箱子球数的期望 ≈ n/b（二项分布 b(k; n, 1/b) 的均值）*/
    lcg_seed(SEED);
    {
        int b = 20, n = 200;
        double expect = (double)n / (double)b;
        double mean = mean_in_given_bin(b, n, 50000);
        printf("given bin : b=%-4d n=%-4d  E=n/b=%.3f  empirical=%.3f\n",
               b, n, expect, mean);
        assert(fabs(mean - expect) <= TOL * expect);
    }

    /* 2) 指定箱首次命中期望 ≈ b（几何分布）*/
    lcg_seed(SEED);
    {
        int bvals[3] = {50, 200, 1000};
        for (int k = 0; k < 3; k++) {
            int b = bvals[k];
            double mean = mean_first_hit(b, 30000);
            printf("first hit : b=%-4d  E=b=%.1f  empirical=%.2f\n", b, (double)b, mean);
            assert(fabs(mean - (double)b) <= TOL * (double)b);
        }
    }

    /* 3) 集齐 b 箱期望 ≈ b·H_b（优惠券收集者问题，b ln b + O(b)）*/
    lcg_seed(SEED);
    {
        int bvals[3] = {20, 100, 500};
        for (int k = 0; k < 3; k++) {
            int b = bvals[k];
            double expect = (double)b * harmonic(b);
            double mean = mean_all_hit(b, 30000);
            printf("all hit   : b=%-4d  E=b*H_b=%.2f  empirical=%.2f\n", b, expect, mean);
            assert(fabs(mean - expect) <= TOL * expect);
        }
    }

    puts("balls and bins checks passed.");
    return 0;
}
