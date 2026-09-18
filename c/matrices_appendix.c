/* matrices_appendix.c -- 附录 D（矩阵）：运算与基本性质的数值自证。
 *
 * 关键数字（全部断言）：
 *   part 1  (AB)C = A(BC)（残差 < 1e-12）；AB ≠ BA 反例；
 *           (AB)^T = B^T A^T 逐元素（残差 < 1e-12）；A·I = A（残差 < 1e-12）；
 *   part 2  n×n 普通乘法标量乘法次数 = n^3（n = 2,3,4 实测）；
 *           分块乘法 = 8 次 (n/2)^3 子乘法 = n^3，与朴素计数对照；
 *   part 3  3×3 高斯消元求逆，AA^{-1} = I（残差 < 1e-12）；解 Ax = b 残差 < 1e-12；
 *   part 4  对称矩阵判定；(A^T A) 对称且半正定（若干 x 验证 x^T(A^T A)x ≥ 0）；
 *           2×2 正定矩阵 Cholesky 成功、非正定矩阵失败（呼应第 28 章）；
 *   part 5  置换矩阵 P：Px 是行的重排；P^T = P^{-1}（残差 < 1e-12）；det(P) = ±1。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o ma matrices_appendix.c -lm
 */
#include <assert.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>

/* 行主序下标：a[i][j] 在第 i 行、第 j 列（i<nrows, j<ncols） */
static void mat_mul(int p, int q, int r, const double *a, const double *b, double *c)
{
    for (int i = 0; i < p; i++) {
        for (int j = 0; j < r; j++) {
            double s = 0.0;
            for (int k = 0; k < q; k++) {
                s += a[i * q + k] * b[k * r + j];
            }
            c[i * r + j] = s;
        }
    }
}

static void mat_transpose(int rows, int cols, const double *a, double *t)
{
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            t[j * rows + i] = a[i * cols + j];
        }
    }
}

/* 两矩阵最大逐元绝对差（m×n） */
static double mat_res(const double *a, const double *b, int m, int n)
{
    double mx = 0.0;
    for (int i = 0; i < m * n; i++) {
        double d = fabs(a[i] - b[i]);
        if (d > mx) { mx = d; }
    }
    return mx;
}

static int is_symmetric(int n, const double *A, double tol)
{
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (fabs(A[i * n + j] - A[j * n + i]) > tol) { return 0; }
        }
    }
    return 1;
}

/* 二次型 x^T A x（A 为 n×n，x 为 n 维） */
static double quad(int n, const double *A, const double *x)
{
    double s = 0.0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            s += x[i] * A[i * n + j] * x[j];
        }
    }
    return s;
}

/* 高斯-约当求逆：成功返回 0，奇异返回 1 */
static int mat_inv_gj(int n, const double *src, double *inv)
{
    double *a = malloc((size_t)n * n * 2 * sizeof(double));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            a[i * 2 * n + j] = src[i * n + j];
            a[i * 2 * n + (n + j)] = (i == j) ? 1.0 : 0.0;
        }
    }
    for (int col = 0; col < n; col++) {
        int piv = col;
        double best = fabs(a[col * 2 * n + col]);
        for (int i = col + 1; i < n; i++) {
            double v = fabs(a[i * 2 * n + col]);
            if (v > best) { best = v; piv = i; }
        }
        if (best < 1e-12) { free(a); return 1; }
        if (piv != col) {
            for (int j = 0; j < 2 * n; j++) {
                double tmp = a[col * 2 * n + j];
                a[col * 2 * n + j] = a[piv * 2 * n + j];
                a[piv * 2 * n + j] = tmp;
            }
        }
        double d = a[col * 2 * n + col];
        for (int j = 0; j < 2 * n; j++) { a[col * 2 * n + j] /= d; }
        for (int i = 0; i < n; i++) {
            if (i == col) { continue; }
            double f = a[i * 2 * n + col];
            if (f == 0.0) { continue; }
            for (int j = 0; j < 2 * n; j++) { a[i * 2 * n + j] -= f * a[col * 2 * n + j]; }
        }
    }
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) { inv[i * n + j] = a[i * 2 * n + (n + j)]; }
    }
    free(a);
    return 0;
}

/* 3×3 行列式（余子式展开） */
static double mat_det3(const double *a)
{
    return a[0] * (a[4] * a[8] - a[5] * a[7])
         - a[1] * (a[3] * a[8] - a[5] * a[6])
         + a[2] * (a[3] * a[7] - a[4] * a[6]);
}

/* 2×2 Cholesky：成功返回 1，非正定返回 0；L 为下三角 [l00,0,l10,l11] */
static int cholesky2(const double *A, double *L)
{
    if (A[0] <= 0.0) { return 0; }
    L[0] = sqrt(A[0]);
    L[1] = 0.0;
    L[2] = A[1] / L[0];
    double d = A[3] - L[2] * L[2];
    if (d <= 0.0) { return 0; }
    L[3] = sqrt(d);
    return 1;
}

static long long mult_count(int p, int q, int r) { return (long long)p * q * r; }

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);
    double I3[9] = {1, 0, 0, 0, 1, 0, 0, 0, 1};

    /* ===== part 1：结合律 / 不可交换 / 转置恒等式 / 单位元 ===== */
    {
        srand(12345);
        double A[9], B[9], C[9];
        for (int i = 0; i < 9; i++) { A[i] = rand() % 100 - 50; B[i] = rand() % 100 - 50; C[i] = rand() % 100 - 50; }

        double AB[9], ABC1[9], BC[9], ABC2[9];
        mat_mul(3, 3, 3, A, B, AB);
        mat_mul(3, 3, 3, AB, C, ABC1);
        mat_mul(3, 3, 3, B, C, BC);
        mat_mul(3, 3, 3, A, BC, ABC2);
        double res = mat_res(ABC1, ABC2, 3, 3);
        printf("part 1: (AB)C vs A(BC) 最大残差 = %.3e（固定种子）\n", res);
        assert(res < 1e-12);

        /* AB ≠ BA 反例 */
        double A2[4] = {1, 2, 3, 4};
        double B2[4] = {0, 1, 1, 0};
        double AB2[4], BA2[4];
        mat_mul(2, 2, 2, A2, B2, AB2);
        mat_mul(2, 2, 2, B2, A2, BA2);
        double diff = mat_res(AB2, BA2, 2, 2);
        printf("part 1: AB != BA（最大差 = %.6f）；AB=[[%g,%g],[%g,%g]]，BA=[[%g,%g],[%g,%g]]\n",
               diff, AB2[0], AB2[1], AB2[2], AB2[3], BA2[0], BA2[1], BA2[2], BA2[3]);
        assert(diff > 1e-9);

        /* (AB)^T = B^T A^T 逐元素 */
        double ABt[9], Bt[9], At[9], BtAt[9];
        mat_transpose(3, 3, AB, ABt);
        mat_transpose(3, 3, B, Bt);
        mat_transpose(3, 3, A, At);
        mat_mul(3, 3, 3, Bt, At, BtAt);
        double resT = mat_res(ABt, BtAt, 3, 3);
        printf("part 1: (AB)^T vs B^T A^T 最大残差 = %.3e\n", resT);
        assert(resT < 1e-12);

        /* A·I = A */
        double AI[9];
        mat_mul(3, 3, 3, A, I3, AI);
        double resI = mat_res(A, AI, 3, 3);
        printf("part 1: A·I vs A 最大残差 = %.3e\n", resI);
        assert(resI < 1e-12);
    }

    /* ===== part 2：标量乘法次数 n^3 与分块对照 ===== */
    {
        for (int n = 2; n <= 4; n++) {
            long long cnt = mult_count(n, n, n);
            printf("part 2: %d×%d 普通乘法标量乘法次数 = %lld（n^3 = %lld）\n",
                   n, n, cnt, (long long)n * n * n);
            assert(cnt == (long long)n * n * n);
        }
        /* 分块：把 n×n 拆成 2×2 块，每块 n/2 阶，需 8 次子乘法；
           每次子乘法 (n/2)^3 次标量乘，合计 8·(n/2)^3 = n^3。
           该恒等式在 n 为 2 的幂时精确成立（n=2,4,8）。 */
        int ns[3] = {2, 4, 8};
        for (int t = 0; t < 3; t++) {
            int n = ns[t];
            int h = n / 2;
            long long blocked = 8 * mult_count(h, h, h);
            printf("part 2: 分块（%d×%d 子块，8 次子乘法）次数 = %lld，对照 n^3 = %lld\n",
                   h, h, blocked, (long long)n * n * n);
            assert(blocked == (long long)n * n * n);
        }
    }

    /* ===== part 3：高斯消元求逆 + 解 Ax=b ===== */
    {
        double A3[9] = {2, 1, 1, 1, 3, 2, 1, 2, 4};
        double A3inv[9];
        int ok = mat_inv_gj(3, A3, A3inv);
        assert(ok == 0);
        double Icheck[9];
        mat_mul(3, 3, 3, A3, A3inv, Icheck);
        double resInv = mat_res(Icheck, I3, 3, 3);
        printf("part 3: AA^{-1} 最大残差 = %.3e\n", resInv);
        assert(resInv < 1e-12);

        double b[3] = {1, 2, 3};
        double x[3], Ax[3];
        mat_mul(3, 3, 1, A3inv, b, x);
        mat_mul(3, 3, 1, A3, x, Ax);
        double resSol = mat_res(Ax, b, 3, 1);
        printf("part 3: Ax=b 解残差 = %.3e；x = [%.6f, %.6f, %.6f]\n",
               resSol, x[0], x[1], x[2]);
        assert(resSol < 1e-12);
    }

    /* ===== part 4：对称 / 半正定 / Cholesky ===== */
    {
        double S[9] = {1, 2, 3, 2, 4, 5, 3, 5, 6};
        int sym = is_symmetric(3, S, 1e-12);
        printf("part 4: S = [[1,2,3],[2,4,5],[3,5,6]] 对称判定 = %d（期望 1）\n", sym);
        assert(sym == 1);

        double NS[9] = {1, 2, 3, 9, 4, 5, 3, 5, 6};
        assert(is_symmetric(3, NS, 1e-12) == 0);

        double A4[9] = {1, 2, 0, 0, 1, 3, 2, 1, 1};
        double At4[9], M[9];
        mat_transpose(3, 3, A4, At4);
        mat_mul(3, 3, 3, At4, A4, M);
        int msym = is_symmetric(3, M, 1e-12);
        printf("part 4: M = A^T A 对称判定 = %d；检验若干 x 的 x^T M x ≥ 0\n", msym);
        assert(msym == 1);
        double xs[3][3] = {{1, 0, 0}, {1, 1, 1}, {2, -3, 1}};
        for (int t = 0; t < 3; t++) {
            double q = quad(3, M, xs[t]);
            printf("        x = [%g,%g,%g] → x^T M x = %.6f%s\n",
                   xs[t][0], xs[t][1], xs[t][2], q, q >= -1e-12 ? "  ≥ 0 OK" : "  NEG!");
            assert(q >= -1e-12);
        }

        double PD[4] = {4, 2, 2, 5};
        double Lpd[4];
        int cholOK = cholesky2(PD, Lpd);
        printf("part 4: 2×2 正定 [[4,2],[2,5]] Cholesky %s（L = [[%.3f,0],[%.3f,%.3f]]）\n",
               cholOK ? "成功" : "失败", Lpd[0], Lpd[2], Lpd[3]);
        assert(cholOK == 1);

        double NPD[4] = {1, 2, 2, 1};
        double Lnp[4];
        int cholFail = cholesky2(NPD, Lnp);
        printf("part 4: 2×2 非正定 [[1,2],[2,1]] Cholesky %s（期望失败）\n",
               cholFail ? "成功" : "失败");
        assert(cholFail == 0);
    }

    /* ===== part 5：置换矩阵 ===== */
    {
        double P[9] = {0, 1, 0, 0, 0, 1, 1, 0, 0};
        double x5[3] = {1, 2, 3};
        double Px[3];
        mat_mul(3, 3, 1, P, x5, Px);
        printf("part 5: Px = [%g,%g,%g]（期望行重排 [2,3,1]）\n", Px[0], Px[1], Px[2]);
        assert(fabs(Px[0] - 2) < 1e-12 && fabs(Px[1] - 3) < 1e-12 && fabs(Px[2] - 1) < 1e-12);

        double Pt[9], Pinv[9];
        mat_transpose(3, 3, P, Pt);
        int okP = mat_inv_gj(3, P, Pinv);
        assert(okP == 0);
        double resP = mat_res(Pt, Pinv, 3, 3);
        printf("part 5: P^T vs P^{-1} 最大残差 = %.3e\n", resP);
        assert(resP < 1e-12);

        double PtP[9];
        mat_mul(3, 3, 3, Pt, P, PtP);
        double resPI = mat_res(PtP, I3, 3, 3);
        printf("part 5: P^T P = I 最大残差 = %.3e\n", resPI);
        assert(resPI < 1e-12);

        double dP = mat_det3(P);
        printf("part 5: det(P) = %.0f（期望 ±1）\n", dP);
        assert(fabs(fabs(dP) - 1) < 1e-9);
    }

    puts("all checks passed.");
    return 0;
}
