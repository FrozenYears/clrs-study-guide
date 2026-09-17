/* matrix_ops.c -- 28 章：矩阵运算（LUP 分解 / 求逆 / 对称正定与最小二乘）。
 * 关键数字（全部用残差断言，不靠"看起来对"）：
 *   part 1  解 Ax = b：残差 max|Ax − b| < 1e-12；并验证 PA = LU；
 *   part 2  求逆：max|A·A⁻¹ − I| < 1e-9（$O(n^3)$ 的三次分解 + 回代）；
 *   part 2b 分治法求逆（Schur 补，28.2 定理 28.2）：与 LUP 求逆逐元素一致；
 *   part 3  Cholesky：max|L·Lᵀ − A| < 1e-12；最小二乘：Aᵀ(Ax − b) ≈ 0；
 *   part 3c 原书 p.843 的五个数据点：F(x) = 1.200 − 0.757x + 0.214x²。 */
#include <assert.h>
#include <math.h>
#include <stdio.h>
#include <string.h>

#define N 3
#define N4 4
#define EPS 1e-9

static double A[N4][N4], LU[N4][N4], P[N4][N4], b[N4], x[N4];

static void identity(double M[N4][N4], int n)
{
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) { M[i][j] = (i == j) ? 1.0 : 0.0; }
    }
}

/* LUP-DECOMPOSITION（18 行直译）：原地分解，返回置换 P 与落位后的 LU */
static int lup_decomposition(double M[N4][N4], int n, double Pm[N4][N4])
{
    identity(Pm, n);
    for (int i = 0; i < n; i++) {          /* 行 1–2：初始化置换 */
        for (int j = 0; j < n; j++) { /* 每个元素检查是否为 0（原书假设非零） */ }
    }
    for (int k = 0; k < n; k++) {          /* 行 3–4 */
        double p = 0.0;
        int kk = k;
        for (int i = k; i < n; i++) {      /* 行 5–6：选主元 */
            if (fabs(M[i][k]) > p) { p = fabs(M[i][k]); kk = i; }
        }
        if (p < EPS) { return 0; }         /* 行 7–8：奇异 */
        for (int j = 0; j < n; j++) {      /* 行 9–11：交换 k 与 kk 行 */
            double t = M[k][j]; M[k][j] = M[kk][j]; M[kk][j] = t;
            t = Pm[k][j]; Pm[k][j] = Pm[kk][j]; Pm[kk][j] = t;
        }
        for (int i = k + 1; i < n; i++) {  /* 行 12–17：消元 */
            M[i][k] /= M[k][k];
            for (int j = k + 1; j < n; j++) {
                M[i][j] -= M[i][k] * M[k][j];
            }
        }
    }
    return 1;
}

/* LUP-SOLVE（5 行直译）：已知 LU 与 P 求解 */
static void lup_solve(const double M[N4][N4], const double Pm[N4][N4], const double *bb, int n, double *xx)
{
    double yy[N4];
    for (int i = 0; i < n; i++) {          /* 行 1–3：前代（用 P·b） */
        double sum = 0.0;
        for (int j = 0; j < i; j++) { sum += M[i][j] * yy[j]; }
        double pbi = 0.0;
        for (int j = 0; j < n; j++) { pbi += Pm[i][j] * bb[j]; }
        yy[i] = pbi - sum;
    }
    for (int i = n - 1; i >= 0; i--) {     /* 行 4–5：回代 */
        double sum = 0.0;
        for (int j = i + 1; j < n; j++) { sum += M[i][j] * xx[j]; }
        xx[i] = (yy[i] - sum) / M[i][i];
    }
}

/* ---------------- 28.2：分治法求逆（Schur 补） ---------------- */

static long g_mac;                        /* 标量乘加次数 —— 用来量 T(n) 的递推 */

/* C = A·B（都只用到左上 n×n，便于在 4×4 的壳里搬 n/2 的分块） */
static void gemm(const double a[N4][N4], const double b[N4][N4], int n, double c[N4][N4])
{
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            double s = 0.0;
            for (int t = 0; t < n; t++) { s += a[i][t] * b[t][j]; }
            c[i][j] = s;
        }
    }
    g_mac += (long)n * n * n;
}

/* A 对称正定：分块 [[B, Cᵀ], [C, D]]，用 Schur 补 S = D − C·B⁻¹·Cᵀ 递归求逆。
 * 递推 T(n) = 2·T(n/2) + 7·(n/2)³ —— 常数 7 就是下面 7 次 gemm。 */
static void spd_inverse(const double M[N4][N4], int n, double Mi[N4][N4])
{
    for (int i = 0; i < n; i++) { for (int j = 0; j < n; j++) { Mi[i][j] = 0.0; } }
    if (n == 1) { Mi[0][0] = 1.0 / M[0][0]; return; }
    int h = n / 2;
    double B[N4][N4], Ct[N4][N4], C[N4][N4], D[N4][N4];
    double Bi[N4][N4], S[N4][N4], Si[N4][N4];
    double X[N4][N4], Y[N4][N4], Z[N4][N4], T[N4][N4];
    for (int i = 0; i < h; i++) {
        for (int j = 0; j < h; j++) {
            B[i][j]  = M[i][j];
            Ct[i][j] = M[i][j + h];
            C[i][j]  = M[i + h][j];
            D[i][j]  = M[i + h][j + h];
        }
    }
    spd_inverse(B, h, Bi);                 /* 递归 1：B 的逆 */
    gemm(C, Bi, h, T);                     /* 1 */
    gemm(T, Ct, h, S);                     /* 2：S ← C·B⁻¹·Cᵀ */
    for (int i = 0; i < h; i++) {
        for (int j = 0; j < h; j++) { S[i][j] = D[i][j] - S[i][j]; }
    }
    spd_inverse(S, h, Si);                 /* 递归 2：Schur 补的逆 */
    gemm(Bi, Ct, h, X);                    /* 3：X = B⁻¹·Cᵀ */
    gemm(Si, C, h, Y);                     /* 4：Y = S⁻¹·C */
    gemm(Y, Bi, h, Z);                     /* 5：Z = S⁻¹·C·B⁻¹ */
    gemm(X, Z, h, T);                      /* 6：B⁻¹CᵀS⁻¹CB⁻¹ */
    for (int i = 0; i < h; i++) {
        for (int j = 0; j < h; j++) { Mi[i][j] = Bi[i][j] + T[i][j]; }
    }
    gemm(X, Si, h, T);                     /* 7：B⁻¹CᵀS⁻¹ */
    for (int i = 0; i < h; i++) {
        for (int j = 0; j < h; j++) {
            Mi[i][j + h]     = -T[i][j];
            Mi[i + h][j]     = -Z[i][j];
            Mi[i + h][j + h] = Si[i][j];
        }
    }
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* 待解方程组：A 取一个对角占优矩阵，b 任取（解已知为 [1,2,3] 可用 A·[1,2,3]） */
    {
        double true_x[N4] = {1.0, 2.0, 3.0};
        double A0[N4][N4] = {
            {4, -2, 1, 0},
            {-2, 4, -2, 0},
            {1, -2, 4, 0},
            {0, 0, 0, 1},
        };
        memcpy(A, A0, sizeof(A));
        for (int i = 0; i < N; i++) {
            b[i] = 0.0;
            for (int j = 0; j < N; j++) { b[i] += A[i][j] * true_x[j]; }
        }
        memcpy(LU, A, sizeof(A));
        int ok = lup_decomposition(LU, N, P);
        printf("part 1: LUP 分解%s（非奇异）\n", ok ? "成功" : "失败");
        assert(ok == 1);
        lup_solve(LU, P, b, N, x);
        printf("        解 x = [%.6f, %.6f, %.6f]（真值 [1, 2, 3]）\n", x[0], x[1], x[2]);
        double resid = 0.0;
        for (int i = 0; i < N; i++) {
            double s = 0.0;
            for (int j = 0; j < N; j++) { s += A0[i][j] * x[j]; }
            double d = fabs(s - b[i]);
            if (d > resid) { resid = d; }
        }
        printf("        残差 max|Ax − b| = %.2e（阈值 1e-12）\n", resid);
        assert(resid < 1e-12);
        for (int i = 0; i < N; i++) { assert(fabs(x[i] - true_x[i]) < 1e-9); }

        /* 验证 PA = LU（用 Pᵀ·L·U 重建） */
        double PA[N4][N4], LUprod[N4][N4];
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {
                double s = 0.0;
                for (int t = 0; t < N; t++) { s += P[t][i] * A0[t][j]; }   /* (PᵀA)_ij */
                PA[i][j] = s;
            }
        }
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {
                double s = 0.0;
                for (int t = 0; t < N; t++) {
                    double l = (t < i) ? LU[i][t] : ((t == i) ? 1.0 : 0.0);
                    double u = (t <= j) ? LU[t][j] : 0.0;
                    s += l * u;
                }
                LUprod[i][j] = s;
            }
        }
        double dmax = 0.0;
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {
                double d = fabs(PA[i][j] - LUprod[i][j]);
                if (d > dmax) { dmax = d; }
            }
        }
        printf("        重构校验 max|PA − LU| = %.2e —— 分解正确 ✓\n", dmax);
        assert(dmax < 1e-12);
    }

    /* part 2：求逆（对每个单位向量解一次） */
    {
        double A1[N4][N4] = {
            {4, 7, 2, 0},
            {3, 6, 1, 0},
            {2, 5, 3, 0},
            {0, 0, 0, 2},
        };
        double M[N4][N4], Pm[N4][N4], inv[N4][N4];
        memcpy(M, A1, sizeof(M));
        int ok = lup_decomposition(M, N, Pm);
        assert(ok == 1);
        for (int col = 0; col < N; col++) {
            double e[N4] = {0, 0, 0, 0};
            e[col] = 1.0;
            double sol[N4];
            lup_solve(M, Pm, e, N, sol);
            for (int i = 0; i < N; i++) { inv[i][col] = sol[i]; }
        }
        double err = 0.0;
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {
                double s = 0.0;
                for (int t = 0; t < N; t++) { s += A1[i][t] * inv[t][j]; }
                double want = (i == j) ? 1.0 : 0.0;
                double d = fabs(s - want);
                if (d > err) { err = d; }
            }
        }
        printf("part 2: 用 LUP 求逆：max|A·A⁻¹ − I| = %.2e（阈值 1e-9）\n", err);
        printf("        逆矩阵第一行 = [%.4f, %.4f, %.4f]\n", inv[0][0], inv[0][1], inv[0][2]);
        assert(err < 1e-9);
    }

    /* part 2b：分治法求逆（定理 28.2 的构造：A = (AᵀA)⁻¹Aᵀ） */
    {
        double A2[N4][N4] = {
            {4, 7, 2, 1},
            {3, 6, 1, 5},
            {2, 5, 3, 2},
            {1, 2, 4, 6},
        };
        double At[N4][N4], G[N4][N4], Gi[N4][N4], inv2[N4][N4], T[N4][N4];
        for (int i = 0; i < 4; i++) {          /* At = Aᵀ */
            for (int j = 0; j < 4; j++) { At[i][j] = A2[j][i]; }
        }
        gemm(At, A2, 4, G);                    /* G = AᵀA 对称正定 */
        g_mac = 0;
        spd_inverse(G, 4, Gi);                 /* 递归求 G⁻¹ */
        long mac_spd = g_mac;
        gemm(Gi, At, 4, inv2);                 /* A⁻¹ = (AᵀA)⁻¹·Aᵀ */
        double err2 = 0.0;
        for (int i = 0; i < 4; i++) {
            for (int j = 0; j < 4; j++) {
                double s = 0.0;
                for (int tt = 0; tt < 4; tt++) { s += A2[i][tt] * inv2[tt][j]; }
                double want = (i == j) ? 1.0 : 0.0;
                double d = fabs(s - want);
                if (d > err2) { err2 = d; }
            }
        }
        /* 再量一个 n = 2 的实例，用来核对递推 T(4) = 2·T(2) + 7·2³ */
        double G2[N4][N4] = {{2, 1, 0, 0}, {1, 3, 0, 0}, {0, 0, 1, 0}, {0, 0, 0, 1}};
        double G2i[N4][N4];
        g_mac = 0;
        spd_inverse(G2, 2, G2i);
        long mac2 = g_mac;
        printf("part 2b: 分治法求逆（Schur 补）：max|A·A⁻¹ − I| = %.2e（阈值 1e-9）\n", err2);
        printf("        递归的乘加次数：T(2) = %ld，T(4) = %ld\n", mac2, mac_spd);
        printf("        与递推 T(n) = 2T(n/2) + 7(n/2)^3 吻合：2·%ld + 7·8 = %ld ✓\n",
               mac2, 2 * mac2 + 56);
        assert(err2 < 1e-9);
        assert(mac2 == 7);
        assert(mac_spd == 2 * mac2 + 56);

        /* 与 LUP 逐列求逆的结果比对（两条完全不同的路线） */
        double M2[N4][N4], P2[N4][N4], invlup[N4][N4];
        memcpy(M2, A2, sizeof(M2));
        assert(lup_decomposition(M2, 4, P2) == 1);
        for (int col = 0; col < 4; col++) {
            double e[N4] = {0, 0, 0, 0};
            e[col] = 1.0;
            double sol[N4];
            lup_solve(M2, P2, e, 4, sol);
            for (int i = 0; i < 4; i++) { invlup[i][col] = sol[i]; }
        }
        double dmax2 = 0.0;
        for (int i = 0; i < 4; i++) {
            for (int j = 0; j < 4; j++) {
                double d = fabs(invlup[i][j] - inv2[i][j]);
                if (d > dmax2) { dmax2 = d; }
            }
        }
        printf("        与 LUP 求逆逐元素比对 max 差 = %.2e —— 两条路线一致 ✓\n", dmax2);
        assert(dmax2 < 1e-9);
        (void)T;
    }

    /* part 3：对称正定（Cholesky）与最小二乘 */
    {
        /* SPD 矩阵：A = BᵀB + I（保证正定） */
        double B[3][3] = {{1, 2, 0}, {0, 1, 3}, {2, 0, 1}};
        double S[3][3];
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                double s = (i == j) ? 1.0 : 0.0;
                for (int t = 0; t < 3; t++) { s += B[t][i] * B[t][j]; }
                S[i][j] = s;
            }
        }
        /* Cholesky: S = L·Lᵀ */
        double L[3][3];
        memset(L, 0, sizeof(L));
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j <= i; j++) {
                double s = S[i][j];
                for (int t = 0; t < j; t++) { s -= L[i][t] * L[j][t]; }
                if (i == j) { L[i][j] = sqrt(s); }
                else { L[i][j] = s / L[j][j]; }
            }
        }
        double err = 0.0;
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                double s = 0.0;
                for (int t = 0; t < 3; t++) { s += L[i][t] * L[j][t]; }
                double d = fabs(s - S[i][j]);
                if (d > err) { err = d; }
            }
        }
        printf("part 3a: Cholesky：max|L·Lᵀ − S| = %.2e（阈值 1e-12）\n", err);
        assert(err < 1e-12);

        /* 最小二乘：用正规方程 (AᵀA)x = Aᵀb 拟合过定系统 */
        double Am[4][2] = {{1, 0}, {1, 1}, {1, 2}, {1, 3}};   /* 拟合 y = c0 + c1·t */
        double bv[4] = {1.0, 2.9, 5.2, 6.8};
        double AtA[2][2], Atb[2] = {0, 0};
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                double s = 0.0;
                for (int t = 0; t < 4; t++) { s += Am[t][i] * Am[t][j]; }
                AtA[i][j] = s;
            }
        }
        for (int i = 0; i < 2; i++) {
            for (int t = 0; t < 4; t++) { Atb[i] += Am[t][i] * bv[t]; }
        }
        double det = AtA[0][0] * AtA[1][1] - AtA[0][1] * AtA[1][0];
        double c0 = (Atb[0] * AtA[1][1] - AtA[0][1] * Atb[1]) / det;
        double c1 = (AtA[0][0] * Atb[1] - Atb[0] * AtA[1][0]) / det;
        printf("part 3b: 最小二乘拟合 y = %.6f + %.6f·t（真值 1 + 2t，数据加了扰动）\n", c0, c1);
        /* 残差正交性：Aᵀ(Ax − b) ≈ 0 */
        double orth[2] = {0, 0};
        for (int i = 0; i < 2; i++) {
            for (int t = 0; t < 4; t++) {
                double pred = c0 * Am[t][0] + c1 * Am[t][1];
                orth[i] += Am[t][i] * (pred - bv[t]);
            }
        }
        printf("        正交性 max|Aᵀ(Ax − b)| = %.2e（阈值 1e-12）—— 最小二乘的条件 ✓\n",
               fmax(fabs(orth[0]), fabs(orth[1])));
        assert(fabs(orth[0]) < 1e-12 && fabs(orth[1]) < 1e-12);
        assert(fabs(c1 - 2.0) < 0.1);
    }

    /* part 3c：原书 p.843 的五个数据点做二次最小二乘拟合 */
    {
        double xs[5] = {-1.0, 1.0, 2.0, 3.0, 5.0};
        double ys[5] = { 2.0, 1.0, 1.0, 0.0, 3.0};
        double AtA[3][3], Atb[3] = {0, 0, 0}, c[3];
        memset(AtA, 0, sizeof(AtA));
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                double s = 0.0;
                for (int t2 = 0; t2 < 5; t2++) {
                    s += pow(xs[t2], i) * pow(xs[t2], j);   /* 基函数 1, x, x² */
                }
                AtA[i][j] = s;
            }
            for (int t2 = 0; t2 < 5; t2++) { Atb[i] += pow(xs[t2], i) * ys[t2]; }
        }
        double M3[N4][N4], P3[N4][N4];
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) { M3[i][j] = AtA[i][j]; }
        }
        assert(lup_decomposition(M3, 3, P3) == 1);          /* AᵀA 正定，主元全非零 */
        lup_solve(M3, P3, Atb, 3, c);
        printf("part 3c: 五点二次拟合 F(x) = %.3f %+.3fx %+.3fx²（原书 1.200 − 0.757x + 0.214x²）\n",
               c[0], c[1], c[2]);
        assert(fabs(c[0] - 1.200) < 1e-3 && fabs(c[1] + 0.757) < 1e-3 && fabs(c[2] - 0.214) < 1e-3);
        double orth3[3] = {0, 0, 0};
        for (int i = 0; i < 3; i++) {
            for (int t2 = 0; t2 < 5; t2++) {
                double pred = c[0] + c[1] * xs[t2] + c[2] * xs[t2] * xs[t2];
                orth3[i] += pow(xs[t2], i) * (pred - ys[t2]);
            }
        }
        printf("        正规方程残差 max|Aᵀ(Ac − y)| = %.2e —— 残差与基正交 ✓\n",
               fmax(fabs(orth3[0]), fmax(fabs(orth3[1]), fabs(orth3[2]))));
        assert(fabs(orth3[0]) < 1e-12 && fabs(orth3[1]) < 1e-12 && fabs(orth3[2]) < 1e-12);
    }

    puts("all checks passed.");
    return 0;
}
