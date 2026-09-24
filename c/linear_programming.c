/* linear_programming.c -- 29 章：线性规划（单纯形法 / 建模 / 对偶）。
 *
 * 全篇的做法是「不信任算法，只信任证书」：
 *   part 1  标准形单纯形法解原书 (29.37)-(29.41) 的 LP：最优值 30.75、x = (8.25, 0, 1.5)、
 *           对偶最优 y = (0, 0.625, 0.4375)；原书 p.868 的乘子 (1,1,0) 给出松上界 54；
 *           再用对偶可行性 + 两边目标值相等**证明**它最优（强对偶证书）；
 *   part 2  弱对偶扫描：随机可行 (x,y) 里，cᵀx − bᵀy 的最大值 ≤ 0；
 *   part 3  互补松弛：最优处 y_i·松弛_i = 0 且 x_j·对偶松弛_j = 0；
 *   part 4  最大流的 LP（29.25–29.28）→ 23，与原书 Figure 24.1 的答案一致；
 *           同时**暴力枚举全部 16 个割**得最小割容量 23（最大流 = 最小割）；
 *   part 5  二分图匹配的 LP 松弛 → 3 且为整数；三角形 K3 的同一松弛 → 1.5
 *           （非整）—— 说明"松弛恰好是整的"是二分图的性质，不是 LP 的性质。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o lp linear_programming.c -lm
 */
#include <assert.h>
#include <math.h>
#include <stdio.h>
#include <string.h>

#define MAXR 24                        /* 约束行数上限（z 行另占一行） */
#define MAXV 12                        /* 结构变量数上限 */
#define MAXC (MAXV + MAXR + 1)         /* 结构 + 松弛 + 右端 */
#define EPS 1e-9

typedef struct {
    int m, n;                          /* 约束数、结构变量数 */
    double T[MAXR][MAXC];
    int basis[MAXR];
} lp_t;

static int g_trace = 0;                 /* 1 = 打印每次转轴（part 1 用来展示顶点路径） */

/* ---------- 标准形装载：max cᵀx s.t. Ax ≤ b, x ≥ 0（要求 b ≥ 0） ---------- */
static void lp_load(lp_t *lp, int m, int n, const double *A, const double *b, const double *c)
{
    assert(m + 1 <= MAXR && n <= MAXV && n + m + 1 <= MAXC);
    lp->m = m;
    lp->n = n;
    int W = n + m + 1;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < W; j++) { lp->T[i][j] = 0.0; }
        for (int j = 0; j < n; j++) { lp->T[i][j] = A[i * n + j]; }
        lp->T[i][n + i] = 1.0;                  /* 松弛变量：Ax + s = b */
        lp->T[i][W - 1] = b[i];
        lp->basis[i] = n + i;
    }
    for (int j = 0; j < W; j++) { lp->T[m][j] = 0.0; }
    for (int j = 0; j < n; j++) { lp->T[m][j] = -c[j]; }   /* z − cᵀx = 0 */
}

/* ---------- 单纯形法（Bland 规则：保证不循环） ----------
 * 返回 1 = 求得最优；0 = 无界（判定列没有任何正系数） */
static int lp_solve(lp_t *lp, double *x, double *y, long *iters)
{
    int m = lp->m, n = lp->n, W = n + m + 1;
    long cap = 200000;
    *iters = 0;
    for (;;) {
        int pc = -1;
        for (int j = 0; j < n + m; j++) {          /* Bland：取最小下标的负检验数 */
            if (lp->T[m][j] < -EPS) { pc = j; break; }
        }
        if (pc < 0) { break; }                     /* 全部检验数 ≥ 0 → 最优 */
        int pr = -1;
        double best = 0.0;
        for (int i = 0; i < m; i++) {              /* 最小比值检验 */
            double a = lp->T[i][pc];
            if (a <= EPS) { continue; }
            double r = lp->T[i][W - 1] / a;
            if (pr < 0 || r < best - 1e-12 ||
                (r < best + 1e-12 && lp->basis[i] < lp->basis[pr])) {
                best = r;
                pr = i;
            }
        }
        if (pr < 0) { return 0; }                  /* 无界 */
        double p = lp->T[pr][pc];                  /* 转轴 */
        for (int j = 0; j < W; j++) { lp->T[pr][j] /= p; }
        for (int i = 0; i <= m; i++) {
            if (i == pr) { continue; }
            double f = lp->T[i][pc];
            if (fabs(f) > 1e-14) {
                for (int j = 0; j < W; j++) { lp->T[i][j] -= f * lp->T[pr][j]; }
            }
        }
        if (g_trace) {
            printf("        转轴 %ld：x%d 进基，离基松弛变量；当前目标值 = %.6f\n",
                   *iters + 1, pc + 1, lp->T[m][W - 1]);
        }
        lp->basis[pr] = pc;
        (*iters)++;
        if (*iters > cap) { return -1; }
    }
    for (int j = 0; j < n; j++) { x[j] = 0.0; }
    for (int i = 0; i < m; i++) {
        if (lp->basis[i] < n) { x[lp->basis[i]] = lp->T[i][W - 1]; }
    }
    for (int i = 0; i < m; i++) { y[i] = lp->T[m][n + i]; }   /* 松弛列的检验数 = 对偶解 */
    return 1;
}

static double obj_of(int n, const double *c, const double *x)
{
    double z = 0.0;
    for (int j = 0; j < n; j++) { z += c[j] * x[j]; }
    return z;
}

/* 原始可行：x ≥ 0 且 Ax ≤ b（返回最大越界量，≤ 0 表示可行） */
static double primal_infeas(int m, int n, const double *A, const double *b, const double *x)
{
    double worst = 0.0;
    for (int j = 0; j < n; j++) { if (-x[j] > worst) { worst = -x[j]; } }
    for (int i = 0; i < m; i++) {
        double s = 0.0;
        for (int j = 0; j < n; j++) { s += A[i * n + j] * x[j]; }
        if (s - b[i] > worst) { worst = s - b[i]; }
    }
    return worst;
}

/* 对偶可行：y ≥ 0 且 Aᵀy ≥ c（返回最大越界量） */
static double dual_infeas(int m, int n, const double *A, const double *c, const double *y)
{
    double worst = 0.0;
    for (int i = 0; i < m; i++) { if (-y[i] > worst) { worst = -y[i]; } }
    for (int j = 0; j < n; j++) {
        double s = 0.0;
        for (int i = 0; i < m; i++) { s += A[i * n + j] * y[i]; }
        if (c[j] - s > worst) { worst = c[j] - s; }
    }
    return worst;
}

/* 线性同余 PRNG（高位取模，避免低位周期） */
static unsigned long rng_state = 2026091788UL;
static double rnd01(void)
{
    rng_state = rng_state * 6364136223846793005UL + 1442695040888963407UL;
    return (double)((rng_state >> 11) & 0x1FFFFF) / (double)0x200000;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* ================= part 1：一个小 LP 的最优证书 ================= */
    {
        const int m = 3, n = 3;
        const double A[9] = {1, 1, 3,
                             2, 2, 5,
                             4, 1, 2};
        const double b[3] = {30, 24, 36};
        const double c[3] = {3, 1, 4};
        lp_t lp;
        double x[MAXV], y[MAXR];
        long it = 0;
        lp_load(&lp, m, n, A, b, c);
        g_trace = 1;
        assert(lp_solve(&lp, x, y, &it) == 1);
        g_trace = 0;
        double z = obj_of(n, c, x);
        double w = 0.0;
        for (int i = 0; i < m; i++) { w += b[i] * y[i]; }
        printf("part 1: 原书 (29.37)-(29.41) 的 LP：max 3x1+x2+4x3 -> 最优值 z = %.6f\n", z);
        printf("        x = (%.6f, %.6f, %.6f)，迭代 %ld 次转轴\n", x[0], x[1], x[2], it);
        printf("        对偶（29.42)-(29.46) 的最优解 y = (%.6f, %.6f, %.6f)，bᵀy = %.6f\n",
               y[0], y[1], y[2], w);
        assert(fabs(z - 30.75) < 1e-7);
        assert(fabs(x[0] - 8.25) < 1e-7 && fabs(x[1]) < 1e-7 && fabs(x[2] - 1.5) < 1e-7);
        assert(fabs(y[1] - 0.625) < 1e-7 && fabs(y[2] - 0.4375) < 1e-7);

        /* 最优性是**证书**证明的，不是靠相信单纯形法：
         * x 原始可行 + y 对偶可行 + 两个目标值相等 ⟹ 由弱对偶两边都取得最优。 */
        double px = primal_infeas(m, n, A, b, x);
        double dy = dual_infeas(m, n, A, c, y);
        printf("        证书：原始越界 %.2e，对偶越界 %.2e，|z − bᵀy| = %.2e\n", px, dy, fabs(z - w));
        assert(px <= 1e-9 && dy <= 1e-9 && fabs(z - w) < 1e-7);
        printf("        => 弱对偶 + 两边相等 = 强对偶成立，最优值确为 %.2f ✓\n", z);

        /* 原书 p.868 的直观上界：把 (29.38) 与 (29.39) 相加得到 3x1+3x2+8x3 ≤ 54，
         * 对应乘子 y = (1,1,0)。它是**对偶可行**的，于是给出原始的一个有效上界 54
         * —— 比真正的最优值 30.75 松，这正说明"可行乘子给出界，最优乘子给出紧界"。 */
        const double ybook[3] = {1.0, 1.0, 0.0};
        double vbook = 0.0;
        for (int i = 0; i < m; i++) { vbook += b[i] * ybook[i]; }
        printf("        原书 p.868 的乘子 y = (1,1,0)：对偶越界 %.2e，bᵀy = %.6f\n",
               dual_infeas(m, n, A, c, ybook), vbook);
        assert(dual_infeas(m, n, A, c, ybook) <= 1e-12 && fabs(vbook - 54.0) < 1e-9);
        assert(vbook > z + 1e-9);                        /* 有效但不紧 */
    }

    /* ================= part 2：弱对偶扫描 cᵀx ≤ bᵀy ================= */
    {
        const int m = 3, n = 3;
        const double A[9] = {1, 1, 3, 2, 2, 5, 4, 1, 2};
        const double b[3] = {30, 24, 36};
        const double c[3] = {3, 1, 4};
        long n_ok = 0, n_pair = 0;
        double max_gap = -1e30;
        for (long t = 0; t < 400000; t++) {
            double x[MAXV], y[MAXR];
            for (int j = 0; j < n; j++) { x[j] = rnd01() * 12.0; }
            for (int i = 0; i < m; i++) { y[i] = rnd01() * 4.0; }
            if (primal_infeas(m, n, A, b, x) > 0.0) { continue; }
            if (dual_infeas(m, n, A, c, y) > 0.0) { continue; }
            n_ok++;
            double gap = obj_of(n, c, x);
            double w = 0.0;
            for (int i = 0; i < m; i++) { w += b[i] * y[i]; }
            if (gap - w > max_gap) { max_gap = gap - w; }
            n_pair++;
            assert(gap <= w + 1e-9);                          /* 弱对偶：绝不允许反向 */
        }
        printf("part 2: 随机抽样 %ld 组（原始可行 %ld 个）检验弱对偶：\n", 400000L, n_ok);
        printf("        cᵀx − bᵀy 的最大值 = %.6f ≤ 0（共 %ld 对可比样本）✓\n", max_gap, n_pair);
        assert(n_pair > 1000 && max_gap <= 1e-9);
    }

    /* ================= part 3：互补松弛 ================= */
    {
        const int m = 3, n = 3;
        const double A[9] = {1, 1, 3, 2, 2, 5, 4, 1, 2};
        const double b[3] = {30, 24, 36};
        const double c[3] = {3, 1, 4};
        lp_t lp;
        double x[MAXV], y[MAXR];
        long it = 0;
        lp_load(&lp, m, n, A, b, c);
        assert(lp_solve(&lp, x, y, &it) == 1);
        double worst = 0.0;
        for (int i = 0; i < m; i++) {                        /* y_i · 原始第 i 行松弛 = 0 */
            double s = b[i];
            for (int j = 0; j < n; j++) { s -= A[i * n + j] * x[j]; }
            double prod = y[i] * s;
            if (fabs(prod) > worst) { worst = fabs(prod); }
            printf("part 3: 第 %d 行：y_%d = %.6f，松弛 = %.6f，乘积 = %.2e\n",
                   i + 1, i + 1, y[i], s, prod);
        }
        for (int j = 0; j < n; j++) {                        /* x_j · 对偶第 j 行松弛 = 0 */
            double s = -c[j];
            for (int i = 0; i < m; i++) { s += A[i * n + j] * y[i]; }
            double prod = x[j] * s;
            if (fabs(prod) > worst) { worst = fabs(prod); }
            printf("        第 %d 列：x_%d = %.6f，对偶松弛 = %.6f，乘积 = %.2e\n",
                   j + 1, j + 1, x[j], s, prod);
        }
        printf("        最大乘积 = %.2e —— 互补松弛在最优处成立 ✓\n", worst);
        assert(worst < 1e-7);
    }

    /* ================= part 4：最大流的 LP 与最小割 ================= */
    {
        /* 原书 Figure 24.1：s=0, v1=1, v2=2, v3=3, v4=4, t=5；9 条边 */
        const int eu[9] = {0, 0, 1, 2, 2, 3, 3, 4, 4};
        const int ev[9] = {1, 2, 3, 1, 4, 2, 5, 3, 5};
        const double capf[9] = {16, 13, 12, 4, 14, 9, 20, 7, 4};
        const int NE = 9;
        /* 约束行：9 条容量行 + 4 个中间顶点各两条守恒行（in ≤ out 与 out ≤ in） */
        double A[18 * NE], b[18], c[NE];
        int rows = 0;
        for (int i = 0; i < 18 * NE; i++) { A[i] = 0.0; }
        for (int e = 0; e < NE; e++) {                       /* f_uv ≤ c_uv */
            A[rows * NE + e] = 1.0;
            b[rows] = capf[e];
            rows++;
        }
        for (int v = 1; v <= 4; v++) {                       /* 守恒：流入 ≤ 流出 与 流出 ≤ 流入 */
            for (int e = 0; e < NE; e++) {
                if (ev[e] == v) { A[rows * NE + e] += 1.0; }
                if (eu[e] == v) { A[rows * NE + e] -= 1.0; }
            }
            b[rows] = 0.0;
            rows++;
            for (int e = 0; e < NE; e++) { A[rows * NE + e] = -A[(rows - 1) * NE + e]; }
            b[rows] = 0.0;
            rows++;
        }
        for (int e = 0; e < NE; e++) {                       /* 目标：出 s 的流 − 入 s 的流 */
            c[e] = (eu[e] == 0) ? 1.0 : ((ev[e] == 0) ? -1.0 : 0.0);
        }
        lp_t lp;
        double f[MAXV], y[MAXR];
        long it = 0;
        lp_load(&lp, rows, NE, A, b, c);
        assert(lp_solve(&lp, f, y, &it) == 1);
        double value = obj_of(NE, c, f);
        printf("part 4: 最大流的线性规划（9 条容量约束 + 8 条守恒约束）：\n");
        printf("        最优值 |f| = %.6f（原书 Figure 24.1 的答案 23）\n", value);
        assert(fabs(value - 23.0) < 1e-7);
        for (int e = 0; e < NE; e++) {
            assert(f[e] >= -1e-9 && f[e] <= capf[e] + 1e-9);  /* 容量约束紧 */
        }
        for (int v = 1; v <= 4; v++) {                       /* 守恒（LP 里是两向不等式） */
            double net = 0.0;
            for (int e = 0; e < NE; e++) {
                if (ev[e] == v) { net += f[e]; }
                if (eu[e] == v) { net -= f[e]; }
            }
            assert(fabs(net) < 1e-7);
        }
        printf("        逐个验证：容量约束与 4 个顶点的守恒全部满足 ✓\n");

        /* 暴力枚举全部割（s 必在 S，t 必不在）—— 独立的第二意见 */
        int best_mask = 0;
        double best_cut = 1e30;
        for (int mask = 0; mask < 16; mask++) {
            int inS[6] = {0};
            inS[0] = 1;
            for (int k = 0; k < 4; k++) { inS[k + 1] = (mask >> k) & 1; }
            double cut = 0.0;
            for (int e = 0; e < NE; e++) {
                if (inS[eu[e]] && !inS[ev[e]]) { cut += capf[e]; }
            }
            if (cut < best_cut) { best_cut = cut; best_mask = mask; }
        }
        printf("        暴力枚举 16 个割：最小割容量 = %.6f，S = {s", best_cut);
        for (int k = 0; k < 4; k++) {
            if ((best_mask >> k) & 1) { printf(", v%d", k + 1); }
        }
        printf("} ✓\n");
        assert(fabs(best_cut - 23.0) < 1e-9);
        assert(fabs(best_cut - value) < 1e-9);               /* 最大流 = 最小割 */
    }

    /* ================= part 5：匹配的 LP 松弛：二分图整、三角形不整 ================= */
    {
        /* 二分图（4×3，与 24/25 章同构）：u1-v1, u1-v2, u2-v1, u3-v2, u3-v3, u4-v3 */
        const int eu[6] = {0, 0, 1, 2, 2, 3};
        const int ev[6] = {0, 1, 0, 1, 2, 2};
        const int NE = 6;
        double A[7 * 6], b[7], c[6];
        for (int i = 0; i < 7 * 6; i++) { A[i] = 0.0; }
        for (int e = 0; e < NE; e++) {
            A[eu[e] * NE + e] = 1.0;          /* L 侧每个顶点至多一条 */
            b[eu[e]] = 1.0;
        }
        for (int e = 0; e < NE; e++) {
            A[(4 + ev[e]) * NE + e] = 1.0;    /* R 侧每个顶点至多一条 */
            b[4 + ev[e]] = 1.0;
        }
        for (int e = 0; e < NE; e++) { c[e] = 1.0; }
        lp_t lp;
        double x[MAXV], y[MAXR];
        long it = 0;
        lp_load(&lp, 7, NE, A, b, c);
        assert(lp_solve(&lp, x, y, &it) == 1);
        double value = obj_of(NE, c, x);
        printf("part 5: 二分图匹配的 LP 松弛（6 条边、7 条度约束）：\n");
        printf("        最优值 = %.6f（最大匹配 3），x =", value);
        int all_int = 1;
        for (int e = 0; e < NE; e++) {
            printf(" %.0f", x[e]);
            if (fabs(x[e] - floor(x[e] + 0.5)) > 1e-7) { all_int = 0; }
        }
        printf("\n");
        assert(fabs(value - 3.0) < 1e-7 && all_int == 1);
        printf("        每个 x_e 都是 0/1 —— 松弛恰好是整的 ✓\n");

        /* 三角形 K3：同样的松弛给出 1.5 —— 说明整性来自二分图，不是 LP */
        const int tu[3] = {0, 1, 2};
        const int tv[3] = {1, 2, 0};
        double A2[3 * 3], b2[3], c2[3];
        for (int i = 0; i < 9; i++) { A2[i] = 0.0; }
        for (int e = 0; e < 3; e++) {
            A2[tu[e] * 3 + e] = 1.0;
            A2[tv[e] * 3 + e] = 1.0;
            b2[tu[e]] = 1.0;
            c2[e] = 1.0;
        }
        b2[1] = 1.0;
        b2[2] = 1.0;
        lp_t lp2;
        double x2[MAXV], y2[MAXR];
        lp_load(&lp2, 3, 3, A2, b2, c2);
        assert(lp_solve(&lp2, x2, y2, &it) == 1);
        double value2 = obj_of(3, c2, x2);
        printf("        同一条式子在三角形 K3 上（3 条边、3 条度约束）：\n");
        printf("        LP 最优值 = %.6f（每条边取 0.5），而整数匹配最多 1 ✓\n", value2);
        assert(fabs(value2 - 1.5) < 1e-7);
    }

    puts("all checks passed.");
    return 0;
}
