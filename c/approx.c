/* approx.c -- 35 章：近似算法（顶点覆盖 / 集合覆盖 / TSP / 子集和）。
 * part 1  APPROX-VERTEX-COVER vs 暴力最优：20 组随机图（n=10），比值全 ≤ 2；
 * part 2  GREEDY-SET-COVER vs 暴力最优：比值 ≤ H(12) ≈ 3.103；
 * part 3  TSP：8 个平面点（三角不等式成立），MST 预序遍历 vs 暴力最优，比值 ≤ 2；
 * part 4  子集和：精确 DP vs TRIM 近似（δ = 1/(2n)），c* ≤ c ≤ 2c*。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o approx approx.c -lm */
#include <assert.h>
#include <math.h>
#include <stdio.h>
#include <string.h>

static unsigned long long st = 3509172026ULL;
static int rnd(void) { st = st * 6364136223846793005ULL + 1442695040888963407ULL; return (int)((st >> 33) & 0x7fffffff); }

/* ---- part 1：顶点覆盖 ---- */
static int g[10][10];

/* 暴力最小顶点覆盖（n ≤ 10） */
static int vc_exact(int n)
{
    for (int k = 0; k <= n; k++) {
        for (int mask = 0; mask < (1 << n); mask++) {
            if (__builtin_popcount(mask) != k) { continue; }
            int ok = 1;
            for (int i = 0; ok && i < n; i++) {
                for (int j = i + 1; j < n; j++) {
                    if (g[i][j] && !((mask >> i) & 1) && !((mask >> j) & 1)) { ok = 0; break; }
                }
            }
            if (ok) { return k; }
        }
    }
    return n;
}

/* APPROX-VERTEX-COVER 的 7 行：不断取边，两端加入覆盖并删掉相关边 */
static int vc_approx(int n)
{
    int cover = 0, used[10][10] = {{0}};
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (g[i][j] && !used[i][j]) {
                cover += 2;                       /* (i, j) 的两端入覆盖 */
                for (int k = 0; k < n; k++) { used[i][k] = used[k][i] = 1; used[j][k] = used[k][j] = 1; }
            }
        }
    }
    return cover;
}

/* ---- part 3：TSP（平面点，距离 = 欧几里得） ---- */
static double px[8], py[8];
static double dist(int i, int j) { double dx = px[i] - px[j], dy = py[i] - py[j]; return sqrt(dx * dx + dy * dy); }

static double tour_len(const int *t, int n)
{
    double s = 0.0;
    for (int i = 0; i < n; i++) { s += dist(t[i], t[(i + 1) % n]); }
    return s;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* ===== part 1：顶点覆盖 2-近似 ===== */
    {
        double worst = 0.0;
        for (int trial = 0; trial < 20; trial++) {
            memset(g, 0, sizeof(g));
            for (int i = 0; i < 10; i++) {
                for (int j = i + 1; j < 10; j++) { g[i][j] = g[j][i] = (rnd() % 100 < 40); }
            }
            int opt = vc_exact(10), app = vc_approx(10);
            double ratio = (double)app / (double)opt;
            if (ratio > worst) { worst = ratio; }
            assert(ratio <= 2.0 + 1e-9);      /* 定理 35.1 */
        }
        printf("part 1: 20 组随机图（n = 10）顶点覆盖：最坏比值 = %.3f ≤ 2（定理 35.1）✓\n", worst);
    }

    /* ===== part 2：贪心集合覆盖 ===== */
    {
        /* 全集 X = {0..11}，12 个集合（每个约 5 个元素，带重叠） */
        int sets[12] = {0};
        for (int s = 0; s < 12; s++) {
            for (int e = 0; e < 12; e++) { if (rnd() % 100 < 42) { sets[s] |= 1 << e; } }
            if (!sets[s]) { sets[s] = 1 << s % 12; }
        }
        int full = (1 << 12) - 1;
        /* 贪心：每轮选"新覆盖元素数最多"的集合 */
        int covered = 0, greedy = 0;
        while (covered != full) {
            int best = -1, bestNew = -1;
            for (int s = 0; s < 12; s++) {
                int nw = __builtin_popcount(sets[s] & ~covered);
                if (nw > bestNew) { bestNew = nw; best = s; }
            }
            covered |= sets[best];
            greedy++;
        }
        /* 暴力最优（12 个集合：4096 个子集） */
        int opt = 12;
        for (int mask = 0; mask < (1 << 12); mask++) {
            int u = 0, cnt = 0;
            for (int s = 0; s < 12; s++) { if ((mask >> s) & 1) { u |= sets[s]; cnt++; } }
            if (u == full && cnt < opt) { opt = cnt; }
        }
        double hn = 1.0;
        for (int i = 2; i <= 12; i++) { hn += 1.0 / i; }   /* H_12 ≈ 3.103 */
        double ratio = (double)greedy / (double)opt;
        printf("part 2: 集合覆盖：贪心 %d vs 最优 %d，比值 = %.3f ≤ H(12) = %.3f（定理 35.4）✓\n",
               greedy, opt, ratio, hn);
        assert(ratio <= hn + 1e-9);
    }

    /* ===== part 3：TSP 的 2-近似 ===== */
    {
        for (int i = 0; i < 8; i++) { px[i] = rnd() % 100; py[i] = rnd() % 100; }
        /* Prim 建 MST */
        int in[8] = {0};
        double key[8];
        for (int i = 0; i < 8; i++) { key[i] = 1e30; }
        key[0] = 0.0;
        int parent[8] = {-1};
        for (int it = 0; it < 8; it++) {
            int u = -1;
            for (int v = 0; v < 8; v++) { if (!in[v] && (u < 0 || key[v] < key[u])) { u = v; } }
            in[u] = 1;
            for (int v = 0; v < 8; v++) {
                if (!in[v] && dist(u, v) < key[v]) { key[v] = dist(u, v); parent[v] = u; }
            }
        }
        /* 预序遍历（DFS） */
        int order[8], oi = 0, stack[16], sp = 0, visited[8] = {0};
        stack[sp++] = 0;
        int childIdx[8] = {0};
        while (sp > 0) {
            int u = stack[sp - 1];
            if (!visited[u]) { visited[u] = 1; order[oi++] = u; }
            int advanced = 0;
            for (int v = childIdx[u]; v < 8; v++) {
                childIdx[u] = v + 1;
                if (parent[v] == u) { stack[sp++] = v; advanced = 1; break; }
            }
            if (!advanced) { sp--; }
        }
        double approx = tour_len(order, 8);
        /* 暴力最优（固定起点 0，7! 排列） */
        double opt = 1e30;
        int p7[7];
        for (int i = 0; i < 7; i++) { p7[i] = i + 1; }
        int fact = 5040;
        for (int f = 0; f < fact; f++) {
            int t[8] = {0};
            for (int i = 0; i < 7; i++) { t[i + 1] = p7[i]; }
            double L = tour_len(t, 8);
            if (L < opt) { opt = L; }
            /* 下一个排列 */
            int i = 6;
            while (i > 0 && p7[i - 1] >= p7[i]) { i--; }
            if (i == 0) { break; }
            int j = 6;
            while (p7[j] <= p7[i - 1]) { j--; }
            int tmp2 = p7[i - 1]; p7[i - 1] = p7[j]; p7[j] = tmp2;
            for (int a = i, b = 6; a < b; a++, b--) { tmp2 = p7[a]; p7[a] = p7[b]; p7[b] = tmp2; }
        }
        double ratio = approx / opt;
        printf("part 3: TSP（8 个平面点）：MST 预序 %.2f vs 最优 %.2f，比值 = %.3f ≤ 2 ✓\n",
               approx, opt, ratio);
        assert(ratio <= 2.0 + 1e-9);
    }

    /* ===== part 4：子集和的近似方案 ===== */
    {
        double worst = 0.0;
        for (int trial = 0; trial < 20; trial++) {
            int items[14], t = 0;
            for (int i = 0; i < 14; i++) { items[i] = 1 + rnd() % 90; t += items[i]; }
            t = t / 2;
            /* 精确 DP（bitset 风格） */
            unsigned char dp[1401];
            memset(dp, 0, sizeof(dp));
            dp[0] = 1;
            for (int i = 0; i < 14; i++) {
                for (int s = 1400; s >= items[i]; s--) { if (dp[s - items[i]]) { dp[s] = 1; } }
            }
            int opt = 0;
            for (int s = t; s >= 0; s--) { if (dp[s]) { opt = s; break; } }
            /* 近似：EXACT-SUBSET-SUM 的列表 + TRIM（δ = 1/(2n)），按原书裁剪 */
            int L[5000], ln = 1;
            L[0] = 0;
            double delta = 1.0 / (2.0 * 14);
            for (int i = 0; i < 14; i++) {
                int base = ln;
                for (int j = 0; j < base; j++) {
                    int v = L[j] + items[i];
                    if (v <= t) { L[ln++] = v; }
                }
                /* 插入排序 + TRIM：相邻差 > (1 + δ) 才保留 */
                for (int a = 1; a < ln; a++) {
                    int cur = L[a], b = a - 1;
                    while (b >= 0 && L[b] > cur) { L[b + 1] = L[b]; b--; }
                    L[b + 1] = cur;
                }
                int w2 = 1;
                for (int a = 1; a < ln; a++) {
                    if ((double)L[a] > (double)L[w2 - 1] * (1.0 + delta)) { L[w2++] = L[a]; }
                }
                ln = w2;
            }
            int best = 0;
            for (int a = 0; a < ln; a++) { if (L[a] <= t && L[a] > best) { best = L[a]; } }
            double ratio = (double)best / (double)opt;
            if (ratio > worst) { worst = ratio; }
            assert(best <= opt && (double)best >= (double)opt * 0.7 - 1e-9);
        }
        printf("part 4: 子集和（14 物品 × 20 组）：TRIM 近似的最坏比值 = %.3f ∈ [0.7, 1]（c* ≤ c ≤ 2c*）✓\n", worst);
    }

    puts("all checks passed.");
    return 0;
}
