/* np.c -- 34 章：NP 完全性（SAT 暴力 / 验证 vs 求解 / 团与覆盖的互补 / 3SAT→CLIQUE 归约）。
 * part 1  2^n 枚举：16 变量的 3-CNF，种下可满足赋值 → 暴力找到它，打印尝试次数；
 * part 2  验证 O(n+m) vs 求解 O(2^n·m)：同一个公式的两条路；
 * part 3  团/独立集/顶点覆盖的互补关系（n=12 随机图，全部暴力）；
 * part 4  3-SAT → CLIQUE 归约：构造图上找大小 m 的团 ⟺ 公式可满足（一真一假两个实例）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o np np.c */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define NV 16
#define NC 91                     /* 3-CNF 子句数（每变量 ~6 条，保证超定但可满足） */

typedef unsigned long long ull;
static unsigned long long st = 3409172026ULL;
static int rnd(void) { st = st * 6364136223846793005ULL + 1442695040888963407ULL; return (int)((st >> 33) & 0x7fffffff); }

static int lit[NC][3];            /* 子句的文字（1..NV 正，负数取反） */

/* 子句在赋值 x（bit i = 变量 i+1）下是否满足 */
static int sat_clause(const int *cl, ull x)
{
    for (int j = 0; j < 3; j++) {
        int v = cl[j], var = (v < 0 ? -v : v) - 1, want = v > 0;
        if (((x >> var) & 1) == (ull)want) { return 1; }
    }
    return 0;
}

static int sat_all(const int cls[][3], int m, ull x)
{
    for (int c = 0; c < m; c++) { if (!sat_clause(cls[c], x)) { return 0; } }
    return 1;
}

static int adj[12][12];           /* 无向图（0/1） */

/* 暴力求最大团（n ≤ 12：2^n 枚举点集） */
static int max_clique(const int g[][12], int n)
{
    int best = 0;
    for (ull mask = 0; mask < (1ULL << n); mask++) {
        int size = 0, ok = 1;
        int vs[12];
        for (int i = 0; i < n; i++) { if ((mask >> i) & 1) { vs[size++] = i; } }
        for (int i = 0; ok && i < size; i++) {
            for (int j = i + 1; j < size; j++) { if (!g[vs[i]][vs[j]]) { ok = 0; break; } }
        }
        if (ok && size > best) { best = size; }
    }
    return best;
}

/* 暴力求最大独立集 */
static int max_indep(const int g[][12], int n)
{
    int best = 0;
    for (ull mask = 0; mask < (1ULL << n); mask++) {
        int size = 0, ok = 1;
        int vs[12];
        for (int i = 0; i < n; i++) { if ((mask >> i) & 1) { vs[size++] = i; } }
        for (int i = 0; ok && i < size; i++) {
            for (int j = i + 1; j < size; j++) { if (g[vs[i]][vs[j]]) { ok = 0; break; } }
        }
        if (ok && size > best) { best = size; }
    }
    return best;
}

/* 暴力求最小顶点覆盖 */
static int min_vc(const int g[][12], int n)
{
    for (int k = 0; k <= n; k++) {
        for (ull mask = 0; mask < (1ULL << n); mask++) {
            if ((int)__builtin_popcountll(mask) != k) { continue; }
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

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* ===== part 1：暴力 SAT（2^n 枚举）===== */
    {
        /* 先种一个可满足赋值，再按它生成子句（保证可满足） */
        ull planted = (ull)rnd() & 0xFFFF;
        for (int c = 0; c < NC; c++) {
            int var[3], neg[3];
            var[0] = 1 + rnd() % NV;
            neg[0] = !((planted >> (var[0] - 1)) & 1);   /* 第一个文字按 planted 定符号：子句必被满足 */
            for (int j = 1; j < 3; j++) {
                var[j] = 1 + rnd() % NV;
                neg[j] = rnd() % 2;
            }
            for (int j = 0; j < 3; j++) { lit[c][j] = neg[j] ? -var[j] : var[j]; }
        }
        /* 若公式被 planted 意外绕开，直接塞一个满足它的子句 */
        if (!sat_all(lit, NC, planted)) {
            lit[0][0] = 1; lit[0][1] = -1; lit[0][2] = 2;   /* 兜底再检查 */
            if (!sat_all(lit, NC, planted)) {
                /* 造一个必然由 planted 满足的子句：任取变量，按 planted 定符号 */
                for (int j = 0; j < 3; j++) {
                    lit[0][j] = (int)(((planted >> j) & 1) ? (j + 1) : -(j + 1));
                }
                assert(sat_all(lit, NC, planted));
            }
        }
        ull found = 0; int tries = 0;
        for (ull x = 0; x < (1ULL << NV); x++) {
            tries++;
            if (sat_all(lit, NC, x)) { found = x; break; }
        }
        printf("part 1: 暴力 SAT（n = %d 变量，%d 子句）：\n", NV, NC);
        printf("        尝试 %d / %llu 个赋值后找到满足赋值 ✓\n", tries, 1ULL << NV);
        assert(found != 0 || sat_all(lit, NC, 0));
        assert(sat_all(lit, NC, found));
        printf("        验证该赋值满足全部 %d 条子句 ✓\n", NC);

        /* ===== part 2：验证 vs 求解 ===== */
        long verify_ops = NC * 3;                        /* 每子句 3 个文字 */
        ull total_space = (1ULL << NV);
        printf("part 2: 验证一张证书：%ld 次文字检查；求解：最坏 %llu × %d 次\n",
               verify_ops, total_space, NC);
        assert(verify_ops < 1000 && total_space > 60000);
        printf("        差了 5 个数量级 —— NP 的定义就在这条缝里 ✓\n");
    }

    /* ===== part 3：团 / 独立集 / 顶点覆盖的互补 ===== */
    {
        memset(adj, 0, sizeof(adj));
        for (int i = 0; i < 12; i++) {
            for (int j = i + 1; j < 12; j++) { adj[i][j] = adj[j][i] = (rnd() % 100 < 45); }
        }
        int w = max_clique(adj, 12);
        int g[12][12];
        for (int i = 0; i < 12; i++) {
            for (int j = 0; j < 12; j++) { g[i][j] = (i == j) ? 0 : 1 - adj[i][j]; }
        }
        int a = max_indep(adj, 12), ai = max_indep(g, 12), vc = min_vc(adj, 12);
        printf("part 3: n = 12 随机图：ω(G) = %d，α(G) = %d，α(Ḡ) = %d，最小覆盖 = %d\n", w, a, ai, vc);
        assert(w == ai);                    /* ω(G) = α(Ḡ) */
        assert(vc == 12 - a);               /* VC = n − α */
        printf("        ω(G) = α(Ḡ) 与 VC = n − α 两条互补关系全部成立 ✓\n");
    }

    /* ===== part 4：3-SAT → CLIQUE 归约 ===== */
    {
        /* 公式：(v1 ∨ ¬v2 ∨ v3) ∧ (¬v1 ∨ v2 ∨ ¬v3) ∧ (v2 ∨ v3 ∨ ¬v1) */
        int F[3][3] = {{1, -2, 3}, {-1, 2, -3}, {2, 3, -1}};
        int g[12][12] = {{0}};
        for (int c = 0; c < 3; c++) {
            for (int j = 0; j < 3; j++) {
                for (int c2 = c + 1; c2 < 3; c2++) {
                    for (int j2 = 0; j2 < 3; j2++) {
                        int v1 = F[c][j], v2 = F[c2][j2];
                        if (v1 != -v2) { g[c * 3 + j][c2 * 3 + j2] = g[c2 * 3 + j2][c * 3 + j] = 1; }
                    }
                }
            }
        }
        int w = max_clique(g, 9);
        /* 公式可满足（v1=1, v2=1, v3=1 不行；试 v1=0: 子句2 需 v2 或 v3… 手算：v2=1,v3=1,v1=0 满足三条） */
        printf("part 4: 3-SAT → CLIQUE：可满足公式（3 子句）→ 归约图的最大团 = %d（= 子句数）✓\n", w);
        assert(w == 3);
        /* 不可满足实例：(v1) 与 (not v1) —— 两条 3-CNF 子句锁死 */
        int F2[2][3] = {{1, 1, 1}, {-1, -1, -1}};
        static int g2[12][12];
        memset(g2, 0, sizeof(g2));
        for (int c = 0; c < 2; c++) {
            for (int j = 0; j < 3; j++) {
                for (int c2 = c + 1; c2 < 2; c2++) {
                    for (int j2 = 0; j2 < 3; j2++) {
                        int v1 = F2[c][j], v2 = F2[c2][j2];
                        if (v1 != -v2) { g2[c * 3 + j][c2 * 3 + j2] = g2[c2 * 3 + j2][c * 3 + j] = 1; }
                    }
                }
            }
        }
        int w2 = max_clique(g2, 6);
        printf("        不可满足公式（v1 与 not v1 锁死）-> 归约图的最大团 = %d < 2\n", w2);
        assert(w2 < 2);
    }

    puts("all checks passed.");
    return 0;
}
