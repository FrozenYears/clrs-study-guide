/* birthday_paradox.c -- 5.4.1 生日悖论的蒙特卡洛验证。
 *
 * 书中伪代码下标从 1 开始（b[1], b[2], …, b[k]），C 数组从 0 开始
 * （b[0], b[1], …, b[k-1]）。因此伪代码的 b[i] 对应 C 的 b[i-1]，
 * 下面的 count_collisions 用 0 基循环逐对比较，等价于 BIRTHDAY-PAIRS。
 *
 * 验证内容：
 *   1) 精确相撞概率 P(k) = 1 - ∏_{i=0}^{k-1}(1 - i/n)；k=23 时 ≥ 1/2。
 *   2) 指示器期望 E[X] = C(k,2)/n；k=28, n=365 时 ≥ 1。
 *   3) 蒙特卡洛经验概率落在精确值附近（区间断言，不钉死近似值）。
 *   4) 近似公式 1 - e^{-k(k-1)/(2n)} 与精确值之差在容差内。
 */

#include <assert.h>
#include <math.h>
#include <stdio.h>

static double exact_collision_prob(int k, int n)
{
    double p_distinct = 1.0;
    for (int i = 0; i < k; i++) {
        p_distinct *= (double)(n - i) / (double)n;
    }
    return 1.0 - p_distinct;
}

static double approx_collision_prob(int k, int n)
{
    double exponent = -(double)k * (double)(k - 1) / (2.0 * (double)n);
    return 1.0 - exp(exponent);
}

static double expected_pairs(int k, int n)
{
    return (double)k * (double)(k - 1) / (2.0 * (double)n);
}

/* 简单线性同余发生器，避免依赖平台随机实现。 */
static unsigned long rng_state = 123456789UL;
static int next_day(int n)
{
    rng_state = rng_state * 6364136223846793005UL + 1442695040888963407UL;
    return (int)(rng_state % (unsigned long)n) + 1; /* 落在 1..n */
}

static double empirical_collision_prob(int k, int n, int trials)
{
    int hits = 0;
    for (int t = 0; t < trials; t++) {
        int seen[366] = {0}; /* 标记 1..365 是否出现过 */
        int collided = 0;
        for (int i = 0; i < k && !collided; i++) {
            int day = next_day(n);
            if (seen[day]) {
                collided = 1;
            } else {
                seen[day] = 1;
            }
        }
        hits += collided;
    }
    return (double)hits / (double)trials;
}

/* 对应教学伪代码 BIRTHDAY-PAIRS：统计一组确定性生日里的相撞对数。 */
static int count_collisions(const int *b, int k)
{
    int X = 0;
    for (int i = 1; i < k; i++) {      /* 书中视角的第 i+1 个人 b[i] */
        for (int j = 0; j < i; j++) {  /* 与前面 b[0..i-1] 比较 */
            if (b[i] == b[j]) {
                X++;
            }
        }
    }
    return X;
}

static void close_to(double actual, double expected, double tol)
{
    assert(fabs(actual - expected) <= tol);
}

int main(void)
{
    const int n = 365;

    /* 1) 精确概率：k=23 时确实 ≥ 1/2（由模型直接推出，非近似）。 */
    double p23 = exact_collision_prob(23, n);
    assert(p23 >= 0.5);
    assert(p23 <= 0.51);

    /* 2) 指示器期望：k=28 时 E[X] = 28*27/(2*365) ≈ 1.0356 ≥ 1。 */
    double e28 = expected_pairs(28, n);
    assert(e28 >= 1.0);
    assert(e28 <= 1.1);

    /* 3) 蒙特卡洛经验概率落在精确值附近（不钉死，用区间）。 */
    int trials = 200000;
    double emp23 = empirical_collision_prob(23, n, trials);
    close_to(emp23, p23, 0.03);

    /* 4) 近似公式与精确值之差在容差内（它只是近似，不要求相等）。 */
    double approx23 = approx_collision_prob(23, n);
    close_to(approx23, p23, 0.02);

    /* 5) 确定性计数与伪代码一致：[1,1,1] 三人间有 C(3,2)=3 对相撞。 */
    int trip[3] = {1, 1, 1};
    assert(count_collisions(trip, 3) == 3);

    /* 6) 23 人确定性序列（与可视化预设一致）：第 23 人撞上第 5 人的生日。 */
    int room23[23] = {101, 222, 34, 56, 77, 12, 300, 88, 145, 200,
                      33, 67, 190, 250, 41, 99, 180, 5, 265, 130,
                      18, 310, 77};
    assert(count_collisions(room23, 23) == 1);

    printf("P(collision | k=23, n=365)   = %.4f\n", p23);
    printf("approx 1 - e^{-k(k-1)/(2n)}  = %.4f\n", approx23);
    printf("E[pairs | k=28, n=365]       = %.4f\n", e28);
    printf("empirical (trials=%d)        = %.4f\n", trials, emp23);
    puts("birthday paradox checks passed.");
    return 0;
}
