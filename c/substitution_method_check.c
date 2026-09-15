/* substitution_method_check.c -- 4.3 节的数值检验：代入法不是“代个式子”，而是带常数的归纳。
 *
 * 原书对应（第 4 版）：
 *   p.90–91  T(n) = 2T(floor(n/2)) + Theta(n)，猜测并验证 O(n lg n)
 *   p.92–93  T(n) = 2T(n/2) + Theta(1)，需要加强为 cn - d
 *   p.93–94  归纳假设中不能把 O(...) 当成可自由变化的常数
 *
 * 本程序用具体的上界常数代替 Theta 项：第一部分取 +n，第二部分取 +1。
 * 它不代替数学证明，而是让“每次代入后还剩多少余量”成为可检查的数。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -O0 -o substitution_method_check substitution_method_check.c
 */
#include <assert.h>
#include <stdio.h>

/* p.90 的模型：T(n) = 2T(floor(n/2)) + n，取 T(1) = 1。 */
static long merge_like_cost(long n)
{
    if (n <= 1) {
        return 1;
    }
    return 2 * merge_like_cost(n / 2) + n;
}

/* p.92 的模型：S(n) = 2S(n/2) + 1，n 取 2 的幂，S(1) = 1。 */
static long constant_work_cost(long n)
{
    if (n <= 1) {
        return 1;
    }
    return 2 * constant_work_cost(n / 2) + 1;
}

static long log2_power_of_two(long n)
{
    long exponent = 0;
    while (n > 1) {
        assert(n % 2 == 0);
        n /= 2;
        exponent++;
    }
    return exponent;
}

int main(void)
{
    puts("substitution method: concrete constants in an inductive hypothesis\n");

    puts("T(n) = 2T(floor(n/2)) + n");
    puts("  n          T(n)       n lg n     T(n)/(n lg n)");
    for (long n = 2; n <= 1024; n *= 2) {
        long value = merge_like_cost(n);
        long bound = 2 * n * log2_power_of_two(n);
        printf("  %-10ld %-10ld %-10ld %.4f\n", n, value, bound,
               (double)value / (double)(n * log2_power_of_two(n)));
        assert(value <= bound); /* 取 c = 2，验证 T(n) <= c n lg n。 */
    }

    puts("\nS(n) = 2S(n/2) + 1");
    puts("  n          S(n)       2n - 1");
    for (long n = 1; n <= 1024; n *= 2) {
        long value = constant_work_cost(n);
        long strengthened_bound = 2 * n - 1;
        printf("  %-10ld %-10ld %-10ld\n", n, value, strengthened_bound);
        assert(value == strengthened_bound);
    }

    puts("\nThe -1 is the lower-order slack: two recursive calls preserve it twice.");
    puts("all checks passed.");
    return 0;
}
