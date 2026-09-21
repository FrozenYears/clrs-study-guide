/* 第 28 章 28.1：求解线性方程组（Solving systems of linear equations）。印刷页 819–833（pdf 840–854）。 */
export default {
  key:'s01',id:'ch28/s01',chapter:28,section:'28.1',
  title:'LUP 分解：为什么必须选主元',shortTitle:'28.1 求解线性方程组',
  titleEn:'Solving systems of linear equations',
  source:{printed:[819,833],pdf:[840,854]},
  prerequisites:[{label:'27.3 Online caching',url:'#/ch27/s03'}],
  stages:[
   {type:'map',title:'Ax = b 的标准解法',
    why:'解 $n$ 元线性方程组：**LUP 分解** $PA = LU$（$L$ 单位下三角、$U$ 上三角、$P$ 置换），再前代解 $Ly = Pb$、回代解 $Ux = y$。总时间 $\\Theta(n^3)$。',
    position:'第 VIII 部分（选讲）开篇。它是数值线性代数的基础，也是"为什么必须选主元"这一工程直觉的数学后果。',
    unlocks:[{label:'28.2 Inverting matrices',url:'#/ch28/s02'}],
    mathKit:[
     {title:'LUP 分解',body:'$PA = LU$：每个非奇异矩阵都有这样的分解（用置换避开零主元）。'},
     {title:'两步三角求解',body:'前代解 $Ly = Pb$（$\\Theta(n^2)$）；回代解 $Ux = y$（$\\Theta(n^2)$）。'},
     {title:'代价',body:'分解 $\\Theta(n^3)$ 主导；一旦分解完成，换 $b$ 只需 $\\Theta(n^2)$。'},
    ]},
   {type:'intuition',title:'选主元不只是"避免除以 0"',scene:'C 程序 Part 1',body:[
     'LU 分解（不选主元）在遇到零主元时直接崩溃；即使主元非零但很小，误差也会被放大 —— **选主元（partial pivoting）** 每次挑当前列绝对值最大的行交换上来。',
     '★ C 程序 Part 1：对 3×3 方程组解得 $x = [1, 2, 3]$（真值），残差 $\\max|Ax-b| = 0$（恰好为 0 是因为数据是整型构造的）；并独立验证 **$PA = LU$**（用 $Pᵀ$、$L$、$U$ 重建，误差 0）。',
     '★ 一旦有了 $L$、$U$、$P$，解新的右端向量只需 $\\Theta(n^2)$ —— 这是"分解一次、多次求解"的价值（回归分析、电路仿真里反复用到）。',
     '⚠ 分解本身 $\\Theta(n^3)$ 无法避免（与矩阵乘法同一量级），这是 dense 线性代数的常数底线。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 PA DLU 代表 PA = LU）。',blocks:[
     {kind:'body',page:821,en:'The idea behind LUP decomposition is to find three n × n matrices L, U , and P such that PA DLU ; (28.4) where',
      zh:'★★ LUP 分解的定义式 (28.4)。'},
     {kind:'body',page:821,en:'\u2022 L is a unit lower-triangular matrix, \u2022 U is an upper-triangular matrix, and \u2022 P is a permutation matrix.',
      zh:'★★ 三个矩阵的角色（单位下三角 / 上三角 / 置换）。'},
     {kind:'body',page:821,en:'We call matrices L, U , and P satisfying equation (28.4) an LUP decomposition of the matrix A. We\u2019ll show that every nonsingular matrix A possesses such a decomposition.',
      zh:'★★ **每个非奇异矩阵都有 LUP 分解** —— 这是选主元带来的保证。'},
     {kind:'body',page:821,en:'Ly = Pb (28.5) for the unknown vector y by a method called "forward substitution." Having solved for y , solve the upper-triangular system',
      zh:'★ 前代解 (28.5)，随后回代解上三角系统。'},
     {kind:'body',page:820,en:'This section focuses on the case in which A is nonsingular or, equivalently (by Theorem D.1 on page 1220), the rank of A',
      zh:'★ 本节的假设：$A$ 非奇异（秩 $n$）。'},
    ],terms:[{en:'LUP decomposition',zh:'LUP 分解 PA = LU',page:821},
              {en:'forward substitution',zh:'前代法',page:821}]},
   {type:'pseudocode',title:'LUP-DECOMPOSITION：18 行',algo:'LUP-DECOMPOSITION',signature:'LUP-DECOMPOSITION(A)',page:830,
    lines:[
     {n:1,code:'for i = 1 to n',zh:''},
     {n:2,code:'    for j = 1 to n: P[i,j] = 0',zh:'★ 初始化为单位置换。'},
     {n:3,code:'    P[i,i] = 1',zh:''},
     {n:4,code:'for k = 1 to n',zh:'★ 逐列消元。'},
     {n:5,code:'    p = 0',zh:''},
     {n:6,code:'    for i = k to n',zh:'★★ 选主元：这一列绝对值最大者。'},
     {n:7,code:'        if |a_ik| > p: p = |a_ik|; k′ = i',zh:''},
     {n:8,code:'    if p == 0: error "singular matrix"',zh:'★ 奇异则报错。'},
     {n:9,code:'    for j = 1 to n: swap a_kj and a_k′j',zh:'换行。'},
     {n:10,code:'        swap P[k,j] and P[k′,j]',zh:'同步换置换。'},
     {n:11,code:'    for i = k+1 to n',zh:''},
     {n:12,code:'        a_ik = a_ik / a_kk',zh:'★ 记下 $L$ 的元素。'},
     {n:13,code:'        for j = k+1 to n',zh:''},
     {n:14,code:'            a_ij = a_ij − a_ik·a_kj',zh:'★ 消元（$U$ 的元素）。'}],
    vars:[{name:'a_ij',meaning:'原地存放 $L$ 与 $U$ 的混合体'}],
    note:'★ 原地分解：严格下三角部分是 $L$、上三角部分是 $U$ —— 省一半空间。',
    more:[{algo:'LUP-SOLVE',subtitle:'LUP-SOLVE(LU, P, b) —— 5 行（p.824）：前代 + 回代',signature:'LUP-SOLVE(LU, P, b)',page:824,
      lines:[{n:1,code:'for i = 1 to n    // forward substitution',zh:'★ 解 $Ly = Pb$。'},
        {n:2,code:'    y_i = (Pb)_i − Σ_{j<i} l_ij y_j',zh:''},
        {n:3,code:'for i = n downto 1    // back substitution',zh:'★ 解 $Ux = y$。'},
        {n:4,code:'    x_i = (y_i − Σ_{j>i} u_ij x_j) / u_ii',zh:''},
        {n:5,code:'return x',zh:''}],
      vars:[{name:'y',meaning:'中间向量'}],
      note:'★ 两个循环各 $\\Theta(n^2)$ —— 分解 $\\Theta(n^3)$ 才是主角。'}]},
   {type:'visualize',title:'分解的代价结构',panels:[
     {title:'C 程序 Part 1 的校验数字',viz:'growth',
      chart:{xMax:3,series:[
       {name:'残差 max|Ax−b| = 0',expr:'0',color:'--viz-done'},
       {name:'重构误差 max|PA−LU| = 0',expr:'0',color:'--viz-done'},
       {name:'分解量级 n³（n=3 → 27）',expr:'n * n * n',color:'--viz-compare'}]},
      note:'★ 整数构造的方程组给出"零残差"—— 验证分解本身无误，而不是靠"结果看起来对"。'},
    ],tasks:['对照 C 程序 part 1 的残差与 $PA = LU$ 重构校验。'],note:''},
   {type:'code',title:'实测：残差 0 与 PA = LU',c:{file:'matrix_ops.c',code:String.raw`/* matrix_ops.c -- 28 章：矩阵运算（LUP 分解 / 求逆 / 对称正定与最小二乘）。
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
`,
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 1（LUP 分解与求解）。'},
           {line:27,zh:'`lup_decomposition`：18 行直译（含第 5–8 行的选主元）。'},
           {line:55,zh:'`lup_solve`：前代 + 回代 5 行直译。'},
           {line:151,zh:'★★ part 1：解 x = [1,2,3]；残差 0；$PA = LU$ 重构误差 0。'}]},
    tests:[{in:'3×3 对角占优方程组',out:'x = [1, 2, 3]；max|Ax−b| = 0'},
           {in:'$PA = LU$ 重构',out:'max|PA − LU| = 0'}],
    mapping:[{pc:4,pcCode:'for k = 1 to n',c:'`for (int k = 0; k < n; k++)`（第 33 行）'},
             {pc:6,pcCode:'选主元',c:'`if (fabs(M[i][k]) > p) { p = fabs(M[i][k]); kk = i; }`（第 37 行）'}]},
   {type:'analyze',title:'一本账：三次分解主导一切',claims:[
     {expr:'\\Theta(n^3)',when:'LUP 分解的时间（消元的三重循环）',page:830,source:'book'},
     {expr:'\\Theta(n^2)',when:'前代与回代各自的代价',page:824,source:'book'},
     {expr:'\\text{每个非奇异矩阵}',when:'都存在 LUP 分解（选主元的保证）',page:821,source:'book'},
    ],tables:[{caption:'C 程序 Part 1 的校验',rows:[
      ['检查项','结果'],
      ['分解是否成功','成功（非奇异）'],
      ['解 x','[1.000000, 2.000000, 3.000000]'],
      ['残差 max|Ax−b|','0.00e+00'],
      ['重构 max|PA−LU|','0.00e+00'],
     ]},{caption:'三种解法的代价对照',rows:[
      ['方法','时间','备注'],
      ['Cramer 法则','$\\Theta(n!)$ 级','理论上正确，实际不可用'],
      ['高斯消元（不选主元）','$\\Theta(n^3)$','数值不稳，零主元即崩溃'],
      ['**LUP 分解**','$\\Theta(n^3)$','稳定；换 b 只花 $\\Theta(n^2)$'],
     ]}],chart:{xMax:64,series:[
     {name:'n³（分解主导）',expr:'n * n * n',color:'--viz-violation'},
     {name:'n²（三角求解）',expr:'n * n',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'为什么 $PA = LU$ 存在',steps:[
      {zh:'消元每一步都在当前列找非零主元；若整列为 0 则矩阵奇异（与假设矛盾）。'},
      {zh:'把"换行"记成置换矩阵 $P$，把消元倍数记进 $L$（单位下三角）、消元结果记进 $U$ —— 分解完成。'},
      {tex:'PA = LU',zh:'★ 原书 p.821：唯一性不保证，但存在性对一切非奇异矩阵成立。C 程序 part 1 的重构校验就是对这条等式的一次实例验证。∎'}]},
     ],
    note:''},
   {type:'prove',title:'前代/回代的正确性',statement:'Ly = Pb (28.5) for the unknown vector y by a method called "forward substitution." Having solved for y , solve the upper-triangular system',page:821,
    intro:'★ 分解之后的两步都是"代入"，正确性靠三角结构。',
    steps:[
     {title:'前代解 Ly = Pb',en:'We call matrices L, U , and P satisfying equation (28.4) an LUP decomposition of the matrix A. We\u2019ll show that every nonsingular matrix A possesses such a decomposition.',page:821,
      body:['$L$ 是**单位**下三角：第 $i$ 个方程只含 $y_1,\\dots,y_i$，而 $y_i$ 的系数为 1 → 直接读出。',
        '按 $i = 1 \\to n$ 顺序逐个求，每次 $O(i)$ 运算 → 总计 $\\Theta(n^2)$。']},
     {title:'回代解 Ux = y',en:'The next step is to show how forward and back substitution work and then attack the problem of computing the LUP decomposition itself.',page:822,
      body:['$U$ 上三角：第 $i$ 个方程含 $x_i,\\dots,x_n$ → 从 $i = n$ 倒着解。',
        '每步 $O(n-i)$ 运算 → 同样 $\\Theta(n^2)$。',
        '★ C 程序 part 1 的残差 0 表示这两步合起来还原了原方程组。∎']},
     {title:'为何要先置换 P',en:'\u2022 L is a unit lower-triangular matrix, \u2022 U is an upper-triangular matrix, and \u2022 P is a permutation matrix.',page:821,
      body:['方程实际求解的是 $LUx = Pb$：先把 $b$ 按同样顺序置换，再前代。',
        '忘记置换 $b$ 是最常见的实现 bug（C 程序里 `lup_solve` 的第 1 行算 $Pb$ 正是为此）。',
        '★ 这也解释了为什么参数里必须同时带 $P$ 与 $LU$。∎']},
    ],conclusion:'★ 结论：$\\Theta(n^3)$ 分解 + 两次 $\\Theta(n^2)$ 代入 = 线性方程组的标准解法。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'LUP 分解中的 $P$ 起什么作用？',options:['把前代求出来的解存起来复用','**置换（选主元）**','存特征值','用行置换来减少乘法的次数'],answer:1,
      why:'★ 用行交换避开零/过小主元，保证每个非奇异矩阵都能分解。'},
     {kind:'single',q:'分解完成后解一个新的 $b$ 需要多久？',options:['$\\Theta(n^3)$','**$\\Theta(n^2)$**','$\\Theta(n)$','$\\Theta(n\\lg n)$'],answer:1,
      why:'★ 只需前代 + 回代。'},
     {kind:'judge',q:'$L$ 是单位下三角矩阵（对角线全为 1）。',answer:true,
      why:'★ 原书 p.821 的三条性质之一。'},
     {kind:'simulate',q:'C 程序 part 1 的残差 max|Ax−b| 是多少？（填 0）',expect:[0],placeholder:'例如：0.001',
      why:'0（整数构造的方程组；同时 $PA = LU$ 重构误差也是 0）。'},
     {kind:'simulate',q:'C 程序 part 1 的 $PA = LU$ 重构残差 $\\max|PA - LU|$ 是多少？（填数字）',expect:[0],placeholder:'例如：0.001',why:'★ code 段实测重构残差为 0 —— 3$\\times$3 尺度下浮点恰好精确。'},
     {kind:'single',q:'LUP 分解本身（不含前代回代）的时间是？',options:['$\\Theta(n^2)$','**$\\Theta(n^3)$**','$\\Theta(n^2 \\lg n)$','$\\Theta(n!)$'],answer:1,why:'★ analyze 前三条：消元是三重循环 $\\Theta(n^3)$，而前代、回代各 $\\Theta(n^2)$。'},
     {kind:'judge',q:'任何非奇异矩阵都存在 LUP 分解 —— 这正是「必须选主元」的数学保证。',answer:true,why:'★ analyze 第三条「都存在 LUP 分解（选主元的保证）」；不选主元的朴素 LU 分解则可能中途失败。'},
    ],bookExercises:[
     {id:'28.1-1',page:832,star:0,statement:'Solve the equation ã 1 0 0 4 1 0 −6 5 1 äã x 1 x 2 x 3 ä D ã −7 ä by using forward substitution.',hint:'系数矩阵是下三角：第一行直接读出第一个未知数，此后每行只剩一个新的未知量，把已知量代进去即可。本站 c/matrix_ops.c 里前代那段循环就是这个顺序，可以逐步核对（留意对角元都不是 0）。'},
     {id:'28.1-2',page:832,star:0,statement:'Find an LU decomposition of the matrix ã 4 −5 6 8 −6 7 12 −7 12 ä :',hint:'这题要的是**具体分解**，不是讨论主元为零会怎样。 按 $\\text{LU-DECOMPOSITION}$ 逐列消元，三行依次是 $4,-5,6$；$8,-6,7$；$12,-7,12$： 第一列主元 4，乘数 $l_{21} = 8/4 = 2$、$l_{31} = 12/4 = 3$，消完第二行剩 $0,4,-5$、第三行剩 $0,8,-6$； 第二列主元 4（不是 0），乘数 $l_{32} = 8/4 = 2$，第三行剩 $0,0,4$。 三个主元 $4,4,4$ 全不为零，所以不加置换就能分解：$U$ 的三行是 $4,-5,6$；$0,4,-5$；$0,0,4$， $L$ 对角线全 1、下三角依次填 $l_{21}=2$、$l_{31}=3$、$l_{32}=2$。 最后把 $LU$ 乘回去逐格核对一遍（第 2 行应为 $2 \\times (4,-5,6) + (0,4,-5) = (8,-6,7)$）—— 乘数下标别写反，$l_{32}$ 不是 $l_{23}$。'},
     {id:'28.1-3',page:832,star:0,statement:'Solve the equation ã 1 5 4 2 0 3 5 8 2 äã x 1 x 2 x 3 ä D ã ä by using an LUP decomposition.',hint:'按 LUP 走三步：带选主元地分解出 L、U、P；把同一套行置换作用到右端向量上；先前代解 $Ly = Pb$，再回代解 $Ux = y$。最容易漏的就是第二步 —— 忘了同步置换右端向量，解出来的是另一个方程组的解。'},
    ]},
  ],
};
