/* indicator_random_variables.c -- 5.2 节指示器随机变量的数值验证。 */
#include <assert.h>
#include <math.h>
#include <stdio.h>

static double harmonic_sum(int n)
{
    double total = 0.0;
    for (int i = 1; i <= n; i++) {
        total += 1.0 / (double)i;
    }
    return total;
}

static double expected_heads(int n)
{
    return (double)n / 2.0;
}

static void close_to(double actual, double expected)
{
    assert(fabs(actual - expected) < 1e-9);
}

int main(void)
{
    close_to(harmonic_sum(1), 1.0);
    close_to(harmonic_sum(2), 1.5);
    close_to(harmonic_sum(5), 2.283333333333333);
    close_to(expected_heads(10), 5.0);
    close_to(harmonic_sum(10), 2.928968253968254);
    printf("H_10 = %.12f\n", harmonic_sum(10));
    printf("E[heads in 10 flips] = %.1f\n", expected_heads(10));
    puts("indicator random variables checks passed.");
    return 0;
}
