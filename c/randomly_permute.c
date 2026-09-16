/* randomly_permute.c -- 5.3 节 RANDOMLY-PERMUTE（随机排列数组）的数值验证。
 *
 * 对应原书 p.136：
 *   RANDOMLY-PERMUTE(A, n)
 *   1  for i = 1 to n
 *   2      swap A[i] with A[RANDOM(i, n)]
 *
 * 下标约定：书中伪代码从 1 开始，C 从 0 开始。所以
 *   书里的 A[i]        <-> 本文件的 a[i - 1]
 *   书里的 RANDOM(i,n) <-> rand_range(&rng, i, n)，返回 1 基下标，和书一致
 * 本文件的所有辅助函数都保持**1 基**语义，只在访问 a[] 时才减 1，
 * 这样对照伪代码时不需要心算偏移。
 *
 * 验证三件事：
 *   1. 每次调用结果都是输入的一个排列（不丢不造、无重复）；
 *   2. n = 4 时完整排列的分布是均匀的 —— 用卡方检验判定，而不是"看着挺随机"；
 *   3. 习题 5.3-3 的错误版本（每轮从 A[1 : n] 里挑）**不是**均匀的，
 *      卡方值比正确版本大两个数量级。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o randomly_permute randomly_permute.c
 */
#include <assert.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

/* ---------------------------------------------------------------------------
 * 伪随机序列：xorshift32 + 种子混合。
 *
 * 为什么不用 rand()？标准库 rand() 的实现随平台而异，断言会不稳定；
 * 而自己写一个固定种子的发生器，结果完全可复现。
 *
 * 为什么不用最常见的「线性同余 + 取模」（state = a*state + c; 取 state % bound）？
 * 模 2^32 的线性同余发生器**低位几乎不随机**（最低位周期为 2），
 * 而 state % bound 恰好只用低位 —— 洗出来的排列会有肉眼可辨的偏斜。
 * 这里改用 xorshift32，并用整个字长按比例取整。
 * ------------------------------------------------------------------------- */
typedef struct {
    uint32_t s;
} rng_t;

static void rng_seed(rng_t *r, uint32_t seed)
{
    uint32_t s = seed ? seed : 0x9e3779b9u;
    /* 先混合种子：xorshift32 是线性映射，连续种子的首个输出高度相关 */
    s += 0x9e3779b9u;
    s = (s ^ (s >> 16)) * 0x21f0aaadu;
    s = (s ^ (s >> 15)) * 0x735a2d97u;
    s = s ^ (s >> 15);
    r->s = s ? s : 0x9e3779b9u;
}

static uint32_t rng_next(rng_t *r)
{
    uint32_t s = r->s;
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    r->s = s;
    return s;
}

/* 返回 [lo, hi] 闭区间上的整数 —— 与书上 RANDOM(a, b) 的「闭区间」语义一致。 */
static int rand_range(rng_t *r, int lo, int hi)
{
    uint32_t span = (uint32_t)(hi - lo + 1);
    return lo + (int)((double)rng_next(r) / 4294967296.0 * (double)span);
}

/* ---------------------------------------------------------------------------
 * 书上的算法：1 基接口，只在访问数组时减 1
 * ------------------------------------------------------------------------- */
static void swap1(int a[], int i, int j)
{
    int t = a[i - 1];
    a[i - 1] = a[j - 1];
    a[j - 1] = t;
}

/* RANDOMLY-PERMUTE(A, n)：原地洗牌，Θ(n) */
static void randomly_permute(int a[], int n, rng_t *r)
{
    for (int i = 1; i <= n; i++) {
        int j = rand_range(r, i, n); /* ★ 从 A[i : n] 里挑，不是从 A[1 : n] 里挑 */
        swap1(a, i, j);
    }
}

/* 习题 5.3-3 的 PERMUTE-WITH-ALL：每轮从 A[1 : n] 里挑 —— 看似更"随机"，其实是错的 */
static void permute_with_all(int a[], int n, rng_t *r)
{
    for (int i = 1; i <= n; i++) {
        int j = rand_range(r, 1, n);
        swap1(a, i, j);
    }
}

/* ---------------------------------------------------------------------------
 * 小工具
 * ------------------------------------------------------------------------- */
static int cmp_int(const void *p, const void *q)
{
    int x = *(const int *)p, y = *(const int *)q;
    return (x > y) - (x < y);
}

static int is_permutation_of(const int *a, const int *original, int n)
{
    int *x = malloc((size_t)n * sizeof(int));
    int *y = malloc((size_t)n * sizeof(int));
    assert(x && y);
    for (int i = 0; i < n; i++) { x[i] = a[i]; y[i] = original[i]; }
    qsort(x, (size_t)n, sizeof(int), cmp_int);
    qsort(y, (size_t)n, sizeof(int), cmp_int);
    int same = 1;
    for (int i = 0; i < n; i++) {
        if (x[i] != y[i]) { same = 0; }
    }
    free(x);
    free(y);
    return same;
}

/* 卡方统计量：观测频数 obs[k] 与期望 exp 的偏离程度。
 * 期望正好等于自由度时卡方值应当在自由度附近 —— 所以判据写成「不超过若干倍自由度」，
 * 与样本量无关（「频率偏差小于 1%」那种写法会随样本量变化时而必然通过、时而必然失败）。 */
static double chi_square(const int *obs, int k, double exp)
{
    double c = 0.0;
    for (int i = 0; i < k; i++) {
        double d = (double)obs[i] - exp;
        c += d * d / exp;
    }
    return c;
}

int main(void)
{
    /* ---- 1. 结果必须是原数组的一个排列（200 个种子）---- */
    for (int t = 1; t <= 200; t++) {
        int n = 1 + (t % 12);
        int a[12], original[12];
        for (int i = 0; i < n; i++) { a[i] = (t + 1) * 7 + i * 13; original[i] = a[i]; }
        rng_t r;
        rng_seed(&r, (uint32_t)t);
        randomly_permute(a, n, &r);
        assert(is_permutation_of(a, original, n));
    }
    puts("part 1: 200 个种子下结果都是输入的一个排列");

    /* ---- 2. 同一种子必须给出同一结果（可复现）---- */
    {
        int a1[] = {1, 2, 3, 4, 5, 6, 7, 8};
        int a2[] = {1, 2, 3, 4, 5, 6, 7, 8};
        rng_t r1, r2;
        rng_seed(&r1, 7);
        rng_seed(&r2, 7);
        randomly_permute(a1, 8, &r1);
        randomly_permute(a2, 8, &r2);
        for (int i = 0; i < 8; i++) {
            assert(a1[i] == a2[i]);
        }
        printf("part 2: 种子 7 的输出可复现：[%d", a1[0]);
        for (int i = 1; i < 8; i++) { printf(", %d", a1[i]); }
        puts("]");
    }

    /* ---- 3. 均匀性：n = 4，统计 24 种排列的出现次数，做卡方检验 ---- */
    {
        enum { N = 24000, K = 4 };
        static const int base[K] = {10, 20, 30, 40};
        int obs[24];
        for (int i = 0; i < 24; i++) { obs[i] = 0; }

        for (int s = 1; s <= N; s++) {
            int a[K];
            for (int i = 0; i < K; i++) { a[i] = base[i]; }
            rng_t r;
            rng_seed(&r, (uint32_t)s);
            randomly_permute(a, K, &r);
            /* 把排列编码成 0..23 的 Lehmer 码（康托展开），用作"是哪种排列"的编号。
             * ★ 必须是真正的 Lehmer 码：rank_i = 「排在 a[i] 右边且比它小的元素个数」，
             *   码值 = Σ rank_i · (K−1−i)!。写成「左边比它小的个数」再按变基数累计
             *   会**不是单射**（例如 r1=0,r2=2 与 r1=1,r2=0 撞成同一个码），
             *   统计表就会把两种排列混在一起 —— 断言会以「卡方突然很大」的形式暴露出来。 */
            int code = 0;
            for (int pos = 0; pos < K; pos++) {
                int rank = 0;
                for (int j = pos + 1; j < K; j++) {
                    if (a[j] < a[pos]) { rank++; }
                }
                int fact = 1;
                for (int t = 2; t <= K - 1 - pos; t++) { fact *= t; }
                code += rank * fact;
            }
            assert(code >= 0 && code < 24);
            obs[code]++;
        }

        int total = 0;
        for (int i = 0; i < 24; i++) { total += obs[i]; }
        assert(total == N);

        double chi = chi_square(obs, 24, (double)N / 24.0);
        printf("part 3: 正确版本 24 种排列的卡方 = %.1f（自由度 23，判据 < 69）\n", chi);
        assert(chi < 69.0);

        int minc = obs[0], maxc = obs[0];
        for (int i = 1; i < 24; i++) {
            if (obs[i] < minc) { minc = obs[i]; }
            if (obs[i] > maxc) { maxc = obs[i]; }
        }
        printf("        每种排列出现 %d..%d 次（期望 1000）\n", minc, maxc);
    }

    /* ---- 4. 反例：习题 5.3-3 的错误版本明显不均匀 ---- */
    {
        enum { N = 24000, K = 4 };
        static const int base[K] = {10, 20, 30, 40};
        int obsBad[K], obsGood[K];
        for (int i = 0; i < K; i++) { obsBad[i] = 0; obsGood[i] = 0; }

        for (int s = 1; s <= N; s++) {
            int a[K], b[K];
            for (int i = 0; i < K; i++) { a[i] = base[i]; b[i] = base[i]; }
            rng_t r1, r2;
            rng_seed(&r1, (uint32_t)s);
            rng_seed(&r2, (uint32_t)s);
            randomly_permute(a, K, &r1);
            permute_with_all(b, K, &r2);
            for (int v = 0; v < K; v++) {
                if (a[0] == base[v]) { obsGood[v]++; }
                if (b[0] == base[v]) { obsBad[v]++; }
            }
        }

        double cg = chi_square(obsGood, K, (double)N / K);
        double cb = chi_square(obsBad, K, (double)N / K);
        printf("part 4: A[1] 取每个值的卡方 —— 正确版本 %.1f，错误版本 %.0f（自由度 3，判据 < 9）\n",
               cg, cb);
        assert(cg < 9.0);
        assert(cb > 100.0); /* 错误版本偏离得离谱 */
        printf("        错误版本 A[1] 的分布：%d %d %d %d（期望各 %d）—— 一眼可辨的偏斜\n",
               obsBad[0], obsBad[1], obsBad[2], obsBad[3], N / K);
    }

    puts("all checks passed.");
    return 0;
}
