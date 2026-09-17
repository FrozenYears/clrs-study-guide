/* optimal_bst.c -- 14.5: 最优二叉搜索树 OPTIMAL-BST + CONSTRUCT-OPTIMAL-BST。
 * 例：原书 p.401 的键分布（n = 5）
 *     p = 0.15 0.10 0.05 0.10 0.20
 *     q = 0.05 0.10 0.05 0.05 0.05 0.10
 * 关键数字：最小期望搜索代价 e[1,5] = 2.75；根 root[1,5] = k2（Figure 14.10(b)）。 */
#include <assert.h>
#include <math.h>
#include <stdio.h>

#define N 5
#define EPS 1e-9

static double e[N + 2][N + 1];      /* e[i,j]：最优子树的期望搜索代价 */
static double w[N + 2][N + 1];      /* w[i,j]：子树中所有概率之和 */
static int root[N + 1][N + 1];      /* root[i,j]：最优子树的根 */

/* OPTIMAL-BST（15 行直译） */
static void optimal_bst(const double *p, const double *q, int n)
{
    for (int i = 1; i <= n + 1; i++) {              /* 行 2：base cases */
        e[i][i - 1] = q[i - 1];                     /* 行 3：equation (14.14) */
        w[i][i - 1] = q[i - 1];                     /* 行 4 */
    }
    for (int l = 1; l <= n; l++) {                  /* 行 5：子树规模 l */
        for (int i = 1; i <= n - l + 1; i++) {      /* 行 6 */
            int j = i + l - 1;                      /* 行 7 */
            e[i][j] = 1e18;                         /* 行 8：初始化为 ∞ */
            w[i][j] = w[i][j - 1] + p[j - 1] + q[j];/* 行 9：equation (14.15) */
            for (int r = i; r <= j; r++) {          /* 行 10：试遍所有根 r */
                double t = e[i][r - 1] + e[r + 1][j] + w[i][j];   /* 行 11 */
                if (t < e[i][j]) {                  /* 行 12 */
                    e[i][j] = t;                    /* 行 13 */
                    root[i][j] = r;                 /* 行 14 */
                }
            }
        }
    }
}

/* 习题 14.5-1：CONSTRUCT-OPTIMAL-BST(root, n) 输出树的结构 */
static void construct_optimal_bst(int i, int j, int depth, const char *side)
{
    printf("        %*s%s", depth * 2, "", side);
    if (i > j) {
        printf("d%d\n", i - 1);
        return;
    }
    int r = root[i][j];
    if (i == 1 && j == N) { printf("k%d  <- 根\n", r); }
    else { printf("k%d\n", r); }
    construct_optimal_bst(i, r - 1, depth + 1, "left  ");
    construct_optimal_bst(r + 1, j, depth + 1, "right ");
}

/* 直接按定义算某棵树的期望搜索代价，用来复核 Figure 14.9/14.10 的数字：
 * E[T] = Σ (depth(k_i) + 1) p_i + Σ (depth(d_i) + 1) q_i */
static double expected_cost(const double *kd, const double *dd,
                            const double *p, const double *q, int n)
{
    double s = 0.0;
    for (int i = 1; i <= n; i++) { s += (kd[i - 1] + 1) * p[i - 1]; }
    for (int i = 0; i <= n; i++) { s += (dd[i] + 1) * q[i]; }
    return s;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* 原书 Figure 14.9 的键分布 */
    double p[N] = {0.15, 0.10, 0.05, 0.10, 0.20};
    double q[N + 1] = {0.05, 0.10, 0.05, 0.05, 0.05, 0.10};

    optimal_bst(p, q, N);

    printf("part 1: 最优期望搜索代价 e[1,%d] = %.2f\n", N, e[1][N]);
    assert(fabs(e[1][N] - 2.75) < EPS);
    printf("part 2: 最优根 root[1,%d] = k%d\n", N, root[1][N]);
    assert(root[1][N] == 2);
    printf("part 3: 总概率 w[1,%d] = %.2f（所有 p 与 q 之和，应为 1.00）\n", N, w[1][N]);
    assert(fabs(w[1][N] - 1.0) < EPS);

    printf("part 4: Figure 14.10(b) 的树结构（由 CONSTRUCT-OPTIMAL-BST 还原，习题 14.5-1）：\n");
    construct_optimal_bst(1, N, 0, "");

    /* 逐行复核 Figure 14.9(a)/(b)：手工两棵树的期望代价 */
    printf("part 5: 复核原书 p.400/401 的两棵树（用 depth 表直接把定义式加起来）：\n");
    {
        /* 树 (a)：根 k2；k2 左 k1；k2 右 k4；k4 左 k3、右 k5
         *         depth：k1=1 k2=0 k3=2 k4=1 k5=2；d0=2 d1=2 d2=3 d3=3 d4=3 d5=3 */
        double da_node[N] = {1, 0, 2, 1, 2};
        double da_dummy[N + 1] = {2, 2, 3, 3, 3, 3};
        /* 树 (b)：根 k2；k2 左 k1；k2 右 k5；k5 左 k4；k4 左 k3
         *         depth：k1=1 k2=0 k3=3 k4=2 k5=1；d0=2 d1=2 d2=4 d3=4 d4=3 d5=2 */
        double db_node[N] = {1, 0, 3, 2, 1};
        double db_dummy[N + 1] = {2, 2, 4, 4, 3, 2};
        double a = expected_cost(da_node, da_dummy, p, q, N);
        double b = expected_cost(db_node, db_dummy, p, q, N);
        printf("        树 (a) 的期望搜索代价 = %.2f\n", a);
        printf("        树 (b) 的期望搜索代价 = %.2f  <- 由 OPTIMAL-BST 独立算出 %.2f\n",
               b, e[1][N]);
        assert(fabs(a - 2.80) < EPS);
        assert(fabs(b - 2.75) < EPS);
        assert(fabs(b - e[1][N]) < EPS);
    }

    /* 复杂度：Θ(n³) 与习题 14.5-3 的 Θ(n²) */
    printf("part 6: 子问题数 = %d = n(n+1)/2，每个 O(n) 试根 -> Θ(n^3)；\n", N * (N + 1) / 2);
    printf("        n=5 时试根总次数 = ");
    {
        int total = 0;
        for (int l = 1; l <= N; l++) {
            for (int i = 1; i <= N - l + 1; i++) { total += l; }
        }
        printf("%d 次（= 上表每个区间长度之和）\n", total);
        assert(total == 35);
    }
    printf("        习题 14.5-3：若在第 9 行直接按 (14.12) 现算 w(i,j)，\n");
    printf("        每次都要求一个 O(n) 的和 -> 总时间退化成 Θ(n^4)。\n");

    puts("all checks passed.");
    return 0;
}
