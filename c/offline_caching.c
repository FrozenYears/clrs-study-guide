/* offline_caching.c -- 15.4: 离线缓存（Offline caching）。
 *
 * 三件事：
 *   part 1–3：在手造序列 1,2,3,1,2,3（k = 2）上对比 FFU / LRU / FIFO / LIFO。
 *   part 4   ：用暴力最优（对缓存配置做精确 DP）验证 FFU 就是 OPT。
 *   part 5   ：随机序列大批量对照 —— FFU 恒等于 OPT；LRU / FIFO 不超过 k 倍。
 *
 * 关键数字：k = 2、序列 1,2,3,1,2,3 时 FFU 缺失 4 次，LRU 与 FIFO 各 6 次。
 * 术语：FFU = furthest-in-future，即原书 Theorem 15.5 的贪心策略（换出下次访问最远的块）。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define KMAX 3        /* 测试用的最大缓存容量 */
#define NB 8          /* 块的种类数上限 */
#define NN 32         /* 请求序列长度上限 */

/* ---------------- 手造序列上的四种策略 ---------------- */
static int in_cache(const int *c, int sz, int x)
{
    for (int i = 0; i < sz; i++) { if (c[i] == x) { return i; } }
    return -1;
}

/* FFU：缺失且满时换出「下次访问最远（或永不再访问）」的块 —— 原书 Theorem 15.5 的贪心。 */
static int furthest_in_future(const int *seq, int n, int k)
{
    int cache[KMAX];
    int sz = 0, misses = 0;
    for (int i = 0; i < n; i++) {
        if (in_cache(cache, sz, seq[i]) >= 0) { continue; }
        misses++;
        if (sz < k) { cache[sz++] = seq[i]; continue; }
        int evict = 0, furthest = -2;
        for (int j = 0; j < sz; j++) {
            int next = n;                 /* n 表示"永不再出现"（最远） */
            for (int t = i + 1; t < n; t++) { if (seq[t] == cache[j]) { next = t; break; } }
            if (next > furthest) { furthest = next; evict = j; }
        }
        cache[evict] = seq[i];
    }
    return misses;
}

/* LRU：换出最久未使用（数组头 = 最久未用）。 */
static int lru(const int *seq, int n, int k)
{
    int cache[KMAX];
    int sz = 0, misses = 0;
    for (int i = 0; i < n; i++) {
        int pos = in_cache(cache, sz, seq[i]);
        if (pos >= 0) {
            int v = cache[pos];
            for (int j = pos; j < sz - 1; j++) { cache[j] = cache[j + 1]; }
            cache[sz - 1] = v;
        }
        else {
            misses++;
            if (sz < k) { cache[sz++] = seq[i]; }
            else {
                for (int j = 0; j < k - 1; j++) { cache[j] = cache[j + 1]; }
                cache[k - 1] = seq[i];
            }
        }
    }
    return misses;
}

/* FIFO：换出最早进入（数组头 = 最早进入）；命中不改变顺序。 */
static int fifo(const int *seq, int n, int k)
{
    int cache[KMAX];
    int sz = 0, misses = 0;
    for (int i = 0; i < n; i++) {
        if (in_cache(cache, sz, seq[i]) >= 0) { continue; }
        misses++;
        if (sz < k) { cache[sz++] = seq[i]; }
        else {
            for (int j = 0; j < k - 1; j++) { cache[j] = cache[j + 1]; }
            cache[k - 1] = seq[i];
        }
    }
    return misses;
}

/* LIFO：换出最近进入（数组尾 = 最近进入）；命中不改变顺序。 */
static int lifo(const int *seq, int n, int k)
{
    int cache[KMAX];
    int sz = 0, misses = 0;
    for (int i = 0; i < n; i++) {
        if (in_cache(cache, sz, seq[i]) >= 0) { continue; }
        misses++;
        if (sz < k) { cache[sz++] = seq[i]; }
        else { cache[k - 1] = seq[i]; }      /* 直接覆盖最近进入的那个 */
    }
    return misses;
}

/* ---------------- 暴力最优：对「缓存配置」做精确 DP ---------------- */

/* opt[i][mask] = 从第 i 个请求开始、缓存内容恰为 mask 时的最小缺失数（-1 表示未算） */
static int opt_memo[NN + 1][1 << NB];
static const int *opt_seq;
static int opt_n, opt_k;

static int opt_dp(int i, int mask)
{
    if (i == opt_n) { return 0; }
    if (opt_memo[i][mask] >= 0) { return opt_memo[i][mask]; }
    int x = opt_seq[i];
    int bit = 1 << x;
    int best;
    if (mask & bit) { best = opt_dp(i + 1, mask); }         /* 命中 */
    else {
        int cnt = 0;
        for (int b = 0; b < NB; b++) { if (mask & (1 << b)) { cnt++; } }
        if (cnt < opt_k) { best = 1 + opt_dp(i + 1, mask | bit); }
        else {
            best = opt_n + 1;
            for (int b = 0; b < NB; b++) {
                if (!(mask & (1 << b))) { continue; }
                int cand = 1 + opt_dp(i + 1, (mask & ~(1 << b)) | bit);
                if (cand < best) { best = cand; }
            }
        }
    }
    opt_memo[i][mask] = best;
    return best;
}

static int optimal(const int *seq, int n, int k)
{
    opt_seq = seq; opt_n = n; opt_k = k;
    memset(opt_memo, -1, sizeof(opt_memo));
    return opt_dp(0, 0);
}

/* ---------------- 随机序列（种子先做乘法混合，避免连续种子相关） ---------------- */
static unsigned int rng_s;
static void rng_seed(unsigned int s)
{
    rng_s = s * 2654435761u;            /* Knuth 乘法混合 */
    if (rng_s == 0) { rng_s = 0x9E3779B9u; }
}
static unsigned int rng_next(void)
{
    rng_s ^= rng_s << 13;
    rng_s ^= rng_s >> 17;
    rng_s ^= rng_s << 5;
    return rng_s;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* ------- part 1–3：手造序列 ------- */
    int seq0[] = {1, 2, 3, 1, 2, 3};
    int n0 = 6, k0 = 2;
    int ff = furthest_in_future(seq0, n0, k0);
    int lu = lru(seq0, n0, k0);
    int fo = fifo(seq0, n0, k0);
    int li = lifo(seq0, n0, k0);
    printf("part 1: 序列 1,2,3,1,2,3（k = 2）：FFU 缺失 %d 次\n", ff);
    printf("part 2: LRU 缺失 %d 次；FIFO 缺失 %d 次；LIFO 缺失 %d 次\n", lu, fo, li);
    assert(ff == 4 && lu == 6 && fo == 6 && li == 5);
    printf("part 3: 暴力最优（对缓存配置做 DP）= %d 次 —— 与 FFU 相同\n",
           optimal(seq0, n0, k0));
    assert(optimal(seq0, n0, k0) == ff);

    /* ------- part 4：随机序列上验证 FFU = OPT，且在线策略受 k 约束 ------- */
    {
        int trials = 0, max_ratio_lru = 0, max_ratio_fifo = 0, max_ratio_lifo = 0;
        int worst_opt = 1 << 30, bad_ffu = 0;
        for (unsigned int seed = 1; seed <= 3000; seed++) {
            int k = 2 + (int)(seed % 2);            /* k = 2 或 3 */
            int n = 8 + (int)(seed % 13);           /* n = 8..20 */
            int seq[NN];
            rng_seed(seed);
            for (int i = 0; i < n; i++) { seq[i] = (int)(rng_next() % 5); }  /* 5 种块 */
            int best = optimal(seq, n, k);
            int f = furthest_in_future(seq, n, k);
            int l = lru(seq, n, k);
            int q = fifo(seq, n, k);
            int s = lifo(seq, n, k);
            if (f != best) { bad_ffu++; }
            if (best < worst_opt) { worst_opt = best; }
            if (l * 100 > max_ratio_lru * best) { max_ratio_lru = l * 100 / best; }
            if (q * 100 > max_ratio_fifo * best) { max_ratio_fifo = q * 100 / best; }
            if (s * 100 > max_ratio_lifo * best) { max_ratio_lifo = s * 100 / best; }
            assert(l <= k * best);
            assert(q <= k * best);
            trials++;
        }
        printf("part 4: 随机 %d 组序列（k = 2/3，n = 8..20，5 种块）\n", trials);
        printf("        FFU 与暴力最优不符的次数 = %d（应为 0）\n", bad_ffu);
        printf("        LRU 最坏 miss/OPT = %.2f；FIFO 最坏 = %.2f；LIFO 最坏 = %.2f\n",
               max_ratio_lru / 100.0, max_ratio_fifo / 100.0, max_ratio_lifo / 100.0);
        assert(bad_ffu == 0);
        printf("        ★ LRU/FIFO 都满足 miss ≤ k·OPT（理论上的 k-竞争）；LIFO 没有这个保证。\n");
    }

    /* ------- part 5：LIFO 可以被逼到很差 ------- */
    {
        int seq[NN], k = 2, n = 12;
        /* 三个块循环请求：LIFO 每次都把刚放进来的块又换出去，几乎永不命中 */
        for (int i = 0; i < n; i++) { seq[i] = 1 + (i % 3); }
        int f5 = furthest_in_future(seq, n, k);
        int s5 = lifo(seq, n, k);
        int o5 = optimal(seq, n, k);
        printf("part 5: 序列 1,2,3 重复 4 次（k = 2）：FFU %d 次、暴力最优 %d 次、LIFO %d 次\n",
               f5, o5, s5);
        assert(o5 == f5);
        assert(s5 == 9);
        printf("        ★ LIFO 没有 k-竞争保证：这里比最优多缺 %d 次（多 %.0f%%）。\n",
               s5 - o5, 100.0 * (s5 - o5) / o5);
    }

    puts("all checks passed.");
    return 0;
}
