/* continuous_master_theorem.c -- 4.6 节：连续主定理的求和账本。 */
#include <assert.h>
#include <stdio.h>

static int log2_power_of_two(int value)
{
    int exponent = 0;
    while (value > 1) {
        value /= 2;
        exponent++;
    }
    return exponent;
}

/* kind 1/2/3 分别模拟低于、等于、高于水位函数 n^2 的驱动成本。 */
static long long level_sum(int n, int kind)
{
    long long total = 0;
    long long branches = 1;
    int size = n;
    while (size >= 1) {
        long long cost;
        if (kind == 1) {
            cost = size;
        } else if (kind == 2) {
            cost = (long long)size * size * log2_power_of_two(size);
        } else {
            cost = (long long)size * size * size;
        }
        total += branches * cost;
        branches *= 4;
        size /= 2;
    }
    return total;
}

int main(void)
{
    for (int n = 2; n <= 64; n *= 2) {
        const long long watershed = (long long)n * n;
        const long long case1 = level_sum(n, 1);
        const long long case2 = level_sum(n, 2);
        const long long case3 = level_sum(n, 3);

        assert(case1 <= 2 * watershed);
        assert(case2 >= watershed);
        assert(case3 >= (long long)n * n * n);
        printf("n=%d  case1=%lld  case2=%lld  case3=%lld\n",
               n, case1, case2, case3);
    }
    puts("continuous master theorem summation checks passed.");
    return 0;
}
