/* online_hiring.c -- 5.4.4 在线招聘问题（原书 p.150–152）的数值验证。
 *
 * 书中约定（原书 p.150 的 ONLINE-MAXIMUM(k, n)）：
 *   - 下标从 1 开始：best-score = −∞ 是虚拟下界（渲染原页核实为 −∞）；
 *     前 k 位只观察（observe），之后遇到第一个分数严格高于 best-score 的
 *     候选人就当场雇用，返回其序号 i；若决策期无人超过 best-score，
 *     则返回 n（雇用最后一位）。
 *   - 本程序里数组下标从 0 开始，因此第 i 位（书里 1 基）对应 ranks[i-1]。
 *     函数 online_maximum 返回的是「1 基序号」：雇到第 pos 位（1 基），
 *     与书的 return i 一致；返回 n 表示雇用最后一位（书里的兜底 return n）。
 *
 * 验证内容：
 *   1) 对 n = 8 直接枚举全部 8! = 40320 种排列，求每个 k = 1..8 的精确成功率，
 *      并核对书中公式 Pr{S} = (k/n)·Σ_{i=k}^{n-1} 1/i；
 *   2) 断言 k = round(n/e) 时成功率 ≥ 1/e（这是书中给出的下界），偏离时下降；
 *   3) 对更大的 n = 100 做蒙特卡洛，确认成功率峰值出现在 k ≈ n/e 附近，且 ≈ 1/e。
 */

#include <assert.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>

/* 书中 ONLINE-MAXIMUM(k, n) 的 0 基实现。
 * ranks: 按面试顺序排列的分数；n：候选人数；k：观察期长度（1 基，与书一致）。
 * 返回：被雇用者的序号（1 基）；若雇用最后一位则返回 n。 */
static int online_maximum(const int *ranks, int n, int k) {
    int best_score = INT_MIN;   /* 书中的 best-score = −∞；C 里用 INT_MIN 充当 −∞ */
    int i;
    /* 观察期：面试前 k 位，只记录最高分，不做任何决定 */
    for (i = 1; i <= k; i++) {
        if (ranks[i - 1] > best_score) {
            best_score = ranks[i - 1];
        }
    }
    /* 决策期：遇到第一个超过 best-score 的就雇用 */
    for (i = k + 1; i <= n; i++) {
        if (ranks[i - 1] > best_score) {
            return i;       /* 书的 return i */
        }
    }
    return n;               /* 书的兜底 return n（雇用最后一位） */
}

/* 判断第 pos 位（1 基）是否恰好是全局最高分 */
static int is_global_best(const int *ranks, int n, int pos) {
    int g = ranks[0];
    int i;
    for (i = 1; i < n; i++) {
        if (ranks[i] > g) g = ranks[i];
    }
    return ranks[pos - 1] == g;
}

/* 枚举全排列（Heap 算法），统计 k 在全部排列下命中全局最高分的次数。 */
static void enumerate(int *arr, int n, int k, int start, long *count) {
    int i, t;
    if (start == n) {
        int hired = online_maximum(arr, n, k);
        if (is_global_best(arr, n, hired)) (*count)++;
        return;
    }
    for (i = start; i < n; i++) {
        t = arr[start]; arr[start] = arr[i]; arr[i] = t;
        enumerate(arr, n, k, start + 1, count);
        t = arr[start]; arr[start] = arr[i]; arr[i] = t;
    }
}

/* 蒙特卡洛：对给定 n 与 k，随机生成 n! 的随机排列（Fisher–Yates），
 * 返回命中全局最高分的频率。trials 次试验。 */
static double montecarlo(int n, int k, long trials) {
    int *arr = malloc((size_t)n * sizeof(int));
    long hits = 0;
    long t;
    for (t = 0; t < trials; t++) {
        int i;
        for (i = 0; i < n; i++) arr[i] = i + 1;   /* 1..n 的一个排列 */
        for (i = n - 1; i > 0; i--) {
            int j = (int)(rand() / (RAND_MAX + 1.0) * (i + 1));
            int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        }
        if (is_global_best(arr, n, online_maximum(arr, n, k))) hits++;
    }
    free(arr);
    return (double)hits / (double)trials;
}

/* 书中公式：Pr{S} = (k/n)·Σ_{i=k}^{n-1} 1/i（k < n 时成立；k = n 时退化返回 0）。 */
static double book_prob(int n, int k) {
    if (k >= n) return 0.0;
    double s = 0.0;
    int i;
    for (i = k; i <= n - 1; i++) s += 1.0 / (double)i;
    return (double)k / (double)n * s;
}

/* 不依赖 libm 的绝对值（避免链接 -lm 时仍满足 -Werror）。 */
static double dabs(double x) {
    return x < 0.0 ? -x : x;
}

/* 1/e（自然常数倒数），原书给出的最优成功率下界。不用 M_E 宏，
 * 以免 -std=c99 下未定义、又要链接 -lm。 */
static const double INV_E = 1.0 / 2.71828182845904523536;

int main(void) {
    /* ---------- 1) n = 8 精确枚举 ---------- */
    const int n = 8;
    int arr[8];
    long total = 1;
    int i;
    for (i = 2; i <= n; i++) total *= i;   /* 8! = 40320 */

    printf("n = %d，全部 %ld 种排列的精确成功率：\n", n, total);
    printf("  k    成功率      书中公式\n");

    double p[9];   /* p[1..8] */
    for (int k = 1; k <= n; k++) {
        long cnt = 0;
        for (i = 0; i < n; i++) arr[i] = i + 1;
        enumerate(arr, n, k, 0, &cnt);
        p[k] = (double)cnt / (double)total;
        double bp = book_prob(n, k);
        printf("  %d   %.6f    %.6f\n", k, p[k], bp);
        if (k < n) {
            /* 书中公式对 k < n 给出精确值，必须与枚举一致 */
            assert(dabs(p[k] - bp) < 1e-9);
        }
    }

    /* k = round(n/e) 是使下界最大的观察期长度 */
    int kopt = (int)(0.5 + (double)n * INV_E);   /* round(8/e) = 3 */
    assert(p[kopt] >= INV_E);              /* 成功率至少 1/e */
    assert(p[1] <= p[kopt]);                   /* 观察期过短 → 下降 */
    assert(p[2] <= p[kopt]);
    assert(p[7] <= p[kopt]);                   /* 观察期过长 → 下降 */
    assert(p[8] <= p[kopt]);

    /* ---------- 2) 蒙特卡洛：n = 100，峰值在 k ≈ n/e ---------- */
    srand(12345);
    {
        int N = 100;
        int ks[3] = {20, 37, 50};
        double pm[3];
        for (int t = 0; t < 3; t++) {
            pm[t] = montecarlo(N, ks[t], 100000L);
            printf("n=%d, k=%d, 蒙特卡洛成功率 ≈ %.4f (1/e ≈ %.4f)\n",
                   N, ks[t], pm[t], INV_E);
        }
        assert(pm[1] >= INV_E - 0.03);     /* k≈n/e 附近成功率贴近 1/e */
        assert(pm[1] >= pm[0] - 0.02);         /* 偏离最优 k 成功率下降 */
        assert(pm[1] >= pm[2] - 0.02);
    }

    printf("online_hiring checks passed.\n");
    return 0;
}
