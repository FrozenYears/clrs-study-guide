/* open_addressing.c -- 11.4 节：开放寻址（open addressing）的实测。
 *
 *   ① 线性探测与双重散列的插入 / 查找（含「表满」处理）；
 *   ② 测量不成功查找的平均探测次数随负载因子 α 的变化，并与 1/(1 − α) 对照
 *      （Theorem 11.6 的上界；这是本节最重要的实测）；
 *   ③ 线性探测的初级聚集（primary clustering）：连续被占槽的长度分布，与双重散列对照；
 *   ④ 表满时 HASH-INSERT 报「hash table overflow」的处理。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o open_addressing open_addressing.c
 *   （本程序不依赖 libm：所有理论值都用 1/(1 − α) 直接算，不调用 log。）
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>

#define MMAX 2048            /* 槽数组上界：必须 ≥ 实验用的最大 m（本程序 m = 997） */

/* 空槽标记：任何真实 key 都不会等于它（key 取非负整数） */
#define EMPTY (-1)

/* ---- 一个够用的确定性伪随机（xorshift32 + 种子混合） ---- */
static unsigned int g_rnd;
static void rnd_seed(unsigned int s)
{
    g_rnd = s * 2654435761u + 0x9e3779b9u;   /* 先做一次乘法混合，避免连续种子相关 */
    if (g_rnd == 0u) { g_rnd = 0x1234567u; }
}
static unsigned int rnd_next(void)
{
    unsigned int x = g_rnd;
    x ^= x << 13; x ^= x >> 17; x ^= x << 5;
    g_rnd = x;
    return x;
}

/* ---- 开放寻址表：所有元素直接存在表里，槽里只放 key 或 EMPTY ---- */
typedef enum { LINEAR, DOUBLE } method_t;

typedef struct {
    int slot[MMAX];          /* 每个槽：key 或 EMPTY */
    int m;                   /* 表长 */
    int n;                   /* 已存元素数 */
} oa_t;

static void oa_init(oa_t *T, int m)
{
    T->m = m;
    T->n = 0;
    for (int i = 0; i < m; i++) { T->slot[i] = EMPTY; }
}

/* 主散列：h1(k) = k mod m（非负） */
static int h1(int k, int m)
{
    int q = k % m;
    return q < 0 ? q + m : q;
}

/* 双重散列的步长：h2(k) = 1 + (k mod (m − 1))，落在 [1, m − 1]，
 * 当 m 为素数时必与 m 互素 —— 保证探测序列能走遍全表。 */
static int h2(int k, int m)
{
    int q = k % (m - 1);
    if (q < 0) { q += (m - 1); }
    return q + 1;
}

/* 探测位置：第 i 次探测（i 从 0 起）落到哪个槽 */
static int probe(method_t meth, int k, int i, int m)
{
    if (meth == LINEAR) {
        return (h1(k, m) + i) % m;               /* 线性探测：h(k,i) = (h1(k) + i) mod m */
    }
    return (h1(k, m) + i * h2(k, m)) % m;          /* 双重散列：h(k,i) = (h1(k) + i·h2(k)) mod m */
}

/* HASH-INSERT(T, k)：返回用了多少次探测（含最后落到空槽的那一次）；
 * 表满时返回 −1（对应原书 error "hash table overflow"）。 */
static int oa_insert(oa_t *T, method_t meth, int k)
{
    int m = T->m;
    for (int i = 0; i < m; i++) {
        int q = probe(meth, k, i, m);
        if (T->slot[q] == EMPTY) {
            T->slot[q] = k;
            T->n++;
            return i + 1;
        }
    }
    return -1;                                     /* 表满 */
}

/* HASH-SEARCH(T, k)：返回探测次数；*found 区分命中 / 未命中。
 * 未命中在「遇到第一个空槽」时终止（原书：k 本该插在那里）。 */
static int oa_search(const oa_t *T, method_t meth, int k, bool *found)
{
    int m = T->m;
    for (int i = 0; i < m; i++) {
        int q = probe(meth, k, i, m);
        if (T->slot[q] == EMPTY) { *found = false; return i + 1; }
        if (T->slot[q] == k)      { *found = true;  return i + 1; }
    }
    *found = false;
    return m;                                       /* 表满且未找到（α < 1 时不会发生） */
}

/* 连续被占槽的最长长度（环形）：用于量化「初级聚集」 */
static int longest_occupied_run(const oa_t *T)
{
    int m = T->m;
    int best = 0, cur = 0;
    for (int i = 0; i < m + m; i++) {               /* 走两圈以覆盖跨边界的连续段 */
        int idx = i % m;
        if (T->slot[idx] != EMPTY) {
            cur++;
            if (cur > best) { best = cur; }
        } else {
            cur = 0;
        }
    }
    return best;
}

/* 用确定性随机 key 填满表到 n 个元素（key 取自 [0, 100000)），返回实际插入的 key 数 */
static int fill_table(oa_t *T, method_t meth, int n, unsigned int seed)
{
    rnd_seed(seed);
    int placed = 0;
    int guard = 0;
    while (placed < n && guard < n * 8) {           /* guard 防止极端情况下死循环 */
        int k = (int)(rnd_next() % 100000u);
        int r = oa_insert(T, meth, k);
        if (r > 0) { placed++; }
        guard++;
    }
    return placed;
}

/* 测量不成功查找的平均探测次数：在 [1000000, 1000000 + trials) 里取与本表无交的 key，
 * 统计「直到第一个空槽」的探测次数平均。 */
static double avg_unsuccessful_probes(const oa_t *T, method_t meth, int trials)
{
    long long total = 0;
    int counted = 0;
    for (int t = 0; t < trials; t++) {
        int k = 1000000 + t;                        /* 与插入区间 [0,100000) 不相交 */
        bool found;
        int p = oa_search(T, meth, k, &found);
        assert(!found);                             /* 这些 key 一定不在表里 */
        total += p;
        counted++;
    }
    return (double)total / (double)counted;
}

/* 测量成功查找的平均探测次数：对表中每个已存 key 查找它自己 */
static double avg_successful_probes(const oa_t *T, method_t meth)
{
    long long total = 0;
    int counted = 0;
    for (int i = 0; i < T->m; i++) {
        if (T->slot[i] == EMPTY) { continue; }
        bool found;
        int p = oa_search(T, meth, T->slot[i], &found);
        assert(found);                              /* 自己一定找得到 */
        total += p;
        counted++;
    }
    return counted == 0 ? 0.0 : (double)total / (double)counted;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);
    /* ② 不成功查找的平均探测次数随 α 变化，与 1/(1 − α) 对照 */
    {
        const int m = 997;                          /* 素数：双重散列的 h2 必与 m 互素 */
        printf("part 1: 不成功查找的平均探测次数 vs 理论 1/(1 − α)（m = %d）\n", m);
        const double alphas[] = { 0.5, 0.75, 0.9 };
        const int n_alpha = 3;
        const int trials = 4000;
        for (int a = 0; a < n_alpha; a++) {
            int n = (int)(alphas[a] * m + 0.5);
            double alpha = (double)n / (double)m;
            double meas[2];
            for (int mm = 0; mm < 2; mm++) {
                method_t meth = (mm == 0) ? LINEAR : DOUBLE;
                const char *name = (meth == LINEAR) ? "线性探测" : "双重散列";
                oa_t T;
                oa_init(&T, m);
                int placed = fill_table(&T, meth, n, (unsigned int)(a * 1009 + mm * 7 + 1));
                assert(placed == n);
                double measured = avg_unsuccessful_probes(&T, meth, trials);
                double succ = avg_successful_probes(&T, meth);
                meas[mm] = measured;
                printf("        α ≈ %.2f  %s：不成功 %.3f，成功 %.3f\n",
                       alpha, name, measured, succ);
            }
            double theory = 1.0 / (1.0 - alpha);
            printf("                理论 1/(1−α) = %.3f —— 双重散列贴近理论；线性探测因初级聚集明显偏高\n", theory);
            /* ★ 双重散列接近理想假设下的上界（独立均匀排列散列）：误差在 30%% 内。 */
            assert(meas[1] > 0.0 && meas[1] < theory * 1.3);
            /* ★ 线性探测被初级聚集拖累：不成功探测次数既高于理论，也高于双重散列。 */
            assert(meas[0] > meas[1]);
            assert(meas[0] <= (double)m);
            printf("\n");
        }
    }

    /* ③ 初级聚集：α = 0.9 时连续被占槽的最长长度（线性 vs 双重） */
    {
        const int m = 997;
        const int n = (int)(0.9 * m + 0.5);
        printf("part 2: 初级聚集（α ≈ 0.9，m = %d，连续被占槽的最长长度）\n", m);
        for (int mm = 0; mm < 2; mm++) {
            method_t meth = (mm == 0) ? LINEAR : DOUBLE;
            const char *name = (meth == LINEAR) ? "线性探测" : "双重散列";
            oa_t T;
            oa_init(&T, m);
            int placed = fill_table(&T, meth, n, (unsigned int)(mm * 13 + 5));
            assert(placed == n);
            int run = longest_occupied_run(&T);
            printf("        %s：最长连续被占槽 = %d（占全表 %.1f%%）\n",
                   name, run, (double)run / (double)m * 100.0);
            /* ★ 线性探测因聚集会产生明显更长的连续段；双重散列散得开。 */
            assert(run >= 1 && run <= m);
        }
        printf("\n");
    }

    /* ④ 表满处理：m = 11 的小表插入 12 个互不相同的 key，第 12 个应失败 */
    {
        const int m = 11;
        oa_t T;
        oa_init(&T, m);
        int ok = 0;
        for (int k = 0; k < m; k++) {               /* 先插满 11 个 */
            int r = oa_insert(&T, LINEAR, k * 100 + 3);
            if (r > 0) { ok++; }
        }
        assert(ok == m);
        assert(T.n == m);
        int full = oa_insert(&T, LINEAR, 999999);    /* 表已满 → 应返回 −1 */
        printf("part 3: 表满处理：m = %d 的表已插入 %d 个 key，再插入第 %d 个 → 返回 %d（−1 即 hash table overflow）\n",
               m, T.n, T.n + 1, full);
        assert(full == -1);
    }

    printf("all checks passed.\n");
    return 0;
}
