/* matrix_chain.c -- 14.2: 矩阵链乘法 MATRIX-CHAIN-ORDER + PRINT-OPTIMAL-PARENS。
 * 例：dimensions = 30,35,15,5,10,20,25（原书 p.375 的例子，6 个矩阵）
 * 关键数字：最优代价 m[1,6] = 15125；暴力括号化 3 个矩阵时 2 种方案代价 7875 : 15750。 */
#include <assert.h>
#include <stdio.h>

#define NMAX 8
#define INF 1000000000

static int m[NMAX][NMAX];      /* 最优代价 */
static int s[NMAX][NMAX];      /* 最优切分点 */

/* MATRIX-CHAIN-ORDER（13 行直译） */
static void matrix_chain_order(const int *p, int n)
{
    for (int i = 1; i <= n; i++) { m[i][i] = 0; }          /* 行 2–3：长度 1 */
    for (int l = 2; l <= n; l++) {                          /* 行 4：链长 l */
        for (int i = 1; i <= n - l + 1; i++) {              /* 行 5 */
            int j = i + l - 1;                              /* 行 6 */
            m[i][j] = INF;                                  /* 行 7 */
            for (int k = i; k <= j - 1; k++) {              /* 行 8 */
                int q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];   /* 行 9 */
                if (q < m[i][j]) {                          /* 行 10 */
                    m[i][j] = q; s[i][j] = k;               /* 行 11–12 */
                }
            }
        }
    }
}

/* PRINT-OPTIMAL-PARENS（6 行直译） */
static void print_parens(const char *name, int i, int j)
{
    if (i == j) { printf("%s%d", name, i); }
    else {
        printf("(");
        print_parens(name, i, s[i][j]);
        print_parens(name, s[i][j] + 1, j);
        printf(")");
    }
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* 原书 p.375 的例子：<30,35,15,5,10,20,25>，n = 6 */
    int p[7] = {30, 35, 15, 5, 10, 20, 25};
    int n = 6;
    matrix_chain_order(p, n);

    printf("part 1: 最优代价 m[1,6] = %d（原书 p.378 的答案）\n", m[1][6]);
    assert(m[1][6] == 15125);
    printf("part 2: 最优括号化方案 = ");
    print_parens("A", 1, n);
    printf("（原书 Figure 14.5：((A1(A2A3))((A4A5)A6))）\n");

    /* 3 个矩阵的两种方案对照（原书 p.375 的戏剧性对比） */
    {
        int q[4] = {10, 100, 5, 50};
        matrix_chain_order(q, 3);
        int cost_good = q[0] * q[1] * q[2] + q[0] * q[2] * q[3];      /* (A1A2)A3 */
        int cost_bad  = q[1] * q[2] * q[3] + q[0] * q[1] * q[3];      /* A1(A2A3) */
        printf("part 3: <10,100,5,50>：((A1A2)A3) = %d 次乘法 vs (A1(A2A3)) = %d 次 —— 差 %.0f 倍\n",
               cost_good, cost_bad, (double)cost_bad / cost_good);
        assert(m[1][3] == (cost_good < cost_bad ? cost_good : cost_bad));
    }

    /* 子问题数量：Θ(n²) 个 m[i,j] */
    {
        int cnt = 0;
        for (int i = 1; i <= n; i++) { for (int j = i; j <= n; j++) { cnt++; } }
        printf("part 4: 子问题（m[i,j]）共 %d = n(n+1)/2 个，每个 O(n) → 总时间 Θ(n³)\n", cnt);
        assert(cnt == 21);
    }

    /* 填表过程（Figure 14.3 的对角线顺序） */
    printf("part 5: m[i,j] 表（行 i、列 j，仅上三角）：\n");
    for (int i = 1; i <= n; i++) {
        printf("        ");
        for (int j = 1; j <= n; j++) {
            if (j < i) { printf("     - "); }
            else { printf("%6d ", m[i][j]); }
        }
        printf("\n");
    }

    puts("all checks passed.");
    return 0;
}
