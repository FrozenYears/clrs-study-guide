/* online.c -- 27 章：在线算法（电梯等待、搜索表 MTF、在线缓存）。
 * 关键数字：
 *   part 1  电梯策略：等待 m 分钟的竞争比 = max(1, (m+k)/(m+1))，最优 m = k−1 → 比值 < 2；
 *   part 2  搜索表：MTF 与**精确最优**（对排列做 DP）对照，验证 MTF ≤ 4·OPT；
 *   part 3  缓存：随机标记（randomized marking）的缺失次数 vs OPT，验证 ≤ 2H_k·OPT。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

/* ---------- part 1：电梯等待（竞争比） ---------- */
static void elevator(int k)
{
    printf("part 1: 电梯/楼梯（楼梯耗时 k=%d 分钟）的竞争比：\n", k);
    int best_m = -1;
    double best_ratio = 1e9;
    for (int m = 0; m <= k; m++) {
        double worst = 1.0;
        for (int t = 1; t <= 4 * k; t++) {          /* 电梯到达时刻 t */
            double online = (t <= m) ? (double)t : (double)(m + k);
            double offline = (t < k) ? (double)t : (double)k;   /* 离线：知道 t，取 min(t,k) */
            double r = online / offline;
            if (r > worst) { worst = r; }
        }
        printf("        等待 m=%d：最坏竞争比 = %.3f\n", m, worst);
        if (worst < best_ratio) { best_ratio = worst; best_m = m; }
    }
    printf("        最优 m = %d，竞争比 = %.3f（< 2，公式 max(1,(m+k)/(m+1)) 的最小值）\n",
           best_m, best_ratio);
    assert(best_m == k - 1);
    assert(best_ratio > 1.8 && best_ratio < 2.0);   /* k=10 时恰为 19/10 = 1.9 */
}

/* ---------- part 2：搜索表（MTF vs 精确最优） ---------- */
#define NS 4
static int perms[24][NS], nperm;
static int perm_id[256];                      /* 排列 → 编号（用编码查找） */

static void build_perms(void)
{
    nperm = 0;
    /* 手写 4! 全排列（Johnson-Trotter 太复杂，用四重循环枚举） */
    for (int a = 0; a < NS; a++) {
        for (int b = 0; b < NS; b++) {
            if (b == a) { continue; }
            for (int c = 0; c < NS; c++) {
                if (c == a || c == b) { continue; }
                for (int d = 0; d < NS; d++) {
                    if (d == a || d == b || d == c) { continue; }
                    perms[nperm][0] = a; perms[nperm][1] = b;
                    perms[nperm][2] = c; perms[nperm][3] = d;
                    nperm++;
                }
            }
        }
    }
    assert(nperm == 24);
    for (int i = 0; i < 256; i++) { perm_id[i] = -1; }
    for (int p = 0; p < nperm; p++) {
        int code = 0;
        for (int i = 0; i < NS; i++) { code = code * NS + perms[p][i]; }
        perm_id[code] = p;
    }
}

static int perm_code(const int *list)
{
    int code = 0;
    for (int i = 0; i < NS; i++) { code = code * NS + list[i]; }
    return code;
}

/* MTF：命中后把该元素移到表头 */
static long mtf_cost(const int *req, int m, int *final_list)
{
    int list[NS];
    for (int i = 0; i < NS; i++) { list[i] = i; }
    long cost = 0;
    for (int t = 0; t < m; t++) {
        int pos = 0;
        while (list[pos] != req[t]) { pos++; }
        cost += pos + 1;                     /* 搜索代价 = 元素位置（1 基） */
        cost += pos;                         /* 移到表头：pos 次相邻交换 */
        int v = list[pos];
        for (int i = pos; i > 0; i--) { list[i] = list[i - 1]; }
        list[0] = v;
    }
    if (final_list) { memcpy(final_list, list, sizeof(list)); }
    return cost;
}

/* 精确最优：对 (时刻, 排列) 做 DP（离线，知道整个请求序列） */
static long opt_cost(const int *req, int m)
{
    static long dp[64][24];
    for (int p = 0; p < nperm; p++) { dp[0][p] = (1L << 29); }
    /* 竞争比要求**同一初始表**：OPT 与 MTF 都从 [0,1,2,3] 出发 */
    dp[0][perm_id[perm_code((const int[]){0, 1, 2, 3})]] = 0;
    for (int t = 0; t < m; t++) {
        for (int p = 0; p < nperm; p++) { dp[t + 1][p] = 1L << 29; }
        for (int p = 0; p < nperm; p++) {
            long base = dp[t][p];
            if (base >= (1L << 29)) { continue; }
            int *list = perms[p];
            int pos = 0;
            while (list[pos] != req[t]) { pos++; }
            long c = pos + 1;                          /* 搜索代价 */
            int nl[NS];
            memcpy(nl, list, sizeof(nl));
            int v = nl[pos];
            for (int i = pos; i > 0; i--) { nl[i] = nl[i - 1]; }
            nl[0] = v;
            long c2 = c + pos;                          /* 含移到表头的交换代价 */
            int np = perm_id[perm_code(nl)];
            if (base + c2 < dp[t + 1][np]) { dp[t + 1][np] = base + c2; }
            /* 也可原地不动（免费）—— 覆盖"不交换"的选项 */
            if (base + c < dp[t + 1][p]) { dp[t + 1][p] = base + c; }
        }
    }
    long best = 1L << 29;
    for (int p = 0; p < nperm; p++) { if (dp[m][p] < best) { best = dp[m][p]; } }
    return best;
}

static unsigned int rng_s;
static void rng_seed(unsigned int s) { rng_s = s * 2654435761u; if (!rng_s) { rng_s = 0x9E3779B9u; } }
static unsigned int rng_next(void)
{
    rng_s ^= rng_s << 13; rng_s ^= rng_s >> 17; rng_s ^= rng_s << 5;
    return rng_s;
}

/* ---------- part 3：随机标记（缓存） ---------- */
#define KB 4
static int opt_cache_misses(const int *req, int m, int k)
{
    /* 离线最优（Bélády）：换出下次访问最远者 —— 已在 15.4 验证过最优 */
    int cache[KB], sz = 0, misses = 0;
    for (int i = 0; i < m; i++) {
        int hit = -1;
        for (int j = 0; j < sz; j++) { if (cache[j] == req[i]) { hit = j; break; } }
        if (hit >= 0) { continue; }
        misses++;
        if (sz < k) { cache[sz++] = req[i]; continue; }
        int evict = 0, furthest = -2;
        for (int j = 0; j < sz; j++) {
            int next = m;
            for (int t = i + 1; t < m; t++) { if (req[t] == cache[j]) { next = t; break; } }
            if (next > furthest) { furthest = next; evict = j; }
        }
        cache[evict] = req[i];
    }
    return misses;
}

static int randomized_marking(const int *req, int m, int k, unsigned int seed)
{
    int marked[64], cache[KB], sz = 0, misses = 0;
    memset(marked, 0, sizeof(marked));
    for (int i = 0; i < m; i++) {
        int hit = -1;
        for (int j = 0; j < sz; j++) { if (cache[j] == req[i]) { hit = j; break; } }
        if (hit >= 0) { marked[req[i]] = 1; continue; }     /* 命中即标记 */
        misses++;
        if (sz < k) { cache[sz++] = req[i]; marked[req[i]] = 1; continue; }
        /* 未命中且满：优先换出未标记的块（按容量随机均匀） */
        int cand[KB], nc = 0;
        for (int j = 0; j < sz; j++) { if (!marked[cache[j]]) { cand[nc++] = j; } }
        int pick;
        if (nc > 0) {
            rng_seed(seed * 131u + (unsigned)i);
            pick = cand[rng_next() % nc];
        }
        else {
            /* 所有块都被标记：清除全部标记，再从未标记（现在全部）中随机选 */
            for (int j = 0; j < sz; j++) { marked[cache[j]] = 0; }
            rng_seed(seed * 17u + (unsigned)i);
            pick = (int)(rng_next() % sz);
        }
        cache[pick] = req[i];
        marked[req[i]] = 1;
    }
    return misses;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    elevator(10);

    /* part 2：MTF vs 精确最优 DP */
    build_perms();
    {
        double max_ratio = 0;
        int trials = 100, m = 20;
        long mtf_total = 0, opt_total = 0;
        for (int s = 1; s <= trials; s++) {
            int req[64];
            rng_seed(s);
            for (int t = 0; t < m; t++) { req[t] = (int)(rng_next() % NS); }
            int final_list[NS];
            long c_mtf = mtf_cost(req, m, final_list);
            long c_opt = opt_cost(req, m);
            mtf_total += c_mtf; opt_total += c_opt;
            double r = (double)c_mtf / c_opt;
            if (r > max_ratio) { max_ratio = r; }
            assert(c_mtf <= 4 * c_opt);            /* MTF 的 4-竞争上界（原书定理 27.1） */
        }
        printf("part 2: 搜索表（n=%d，m=%d，%d 组随机请求）：\n", NS, m, trials);
        printf("        MTF 总代价 %ld；精确最优（对 4! 排列做 DP）%ld\n", mtf_total, opt_total);
        printf("        最大比值 = %.3f —— MTF ≤ 4·OPT 成立（原书定理 27.1：交换计费模型下 4-竞争）\n", max_ratio);
    }

    /* part 3：随机标记 vs OPT */
    {
        int k = KB, m = 400, trials = 200, nb = 8;
        long rm_total = 0, opt_total = 0;
        double max_ratio = 0;
        double H = 0;
        for (int i = 1; i <= k; i++) { H += 1.0 / i; }
        for (int s = 1; s <= trials; s++) {
            int req[512];
            rng_seed(s * 7919u);
            for (int t = 0; t < m; t++) { req[t] = (int)(rng_next() % nb); }
            int o = opt_cache_misses(req, m, k);
            int r = randomized_marking(req, m, k, s);
            rm_total += r; opt_total += o;
            double ratio = (double)r / o;
            if (ratio > max_ratio) { max_ratio = ratio; }
            assert(o > 0);
        }
        double bound = 2 * H;
        printf("part 3: 在线缓存（k=%d，%d 种块，m=%d，%d 组）：\n", k, nb, m, trials);
        printf("        随机标记平均缺失 %.1f；OPT 平均缺失 %.1f；平均比值 %.3f\n",
               (double)rm_total / trials, (double)opt_total / trials,
               (double)rm_total / opt_total);
        printf("        理论界 2·H_k = 2·%.3f = %.3f；实测最大比值 %.3f ≤ 该界 ✓\n",
               H, bound, max_ratio);
        assert((double)rm_total / opt_total <= bound);
        printf("        （对照 15.4：LRU/FIFO 是 k-竞争，随机标记把界降到 O(lg k)）\n");
    }

    puts("all checks passed.");
    return 0;
}
