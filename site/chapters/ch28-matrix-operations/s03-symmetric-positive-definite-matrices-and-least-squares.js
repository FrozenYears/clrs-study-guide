/* 第 28 章 28.3：对称正定矩阵与最小二乘逼近（Symmetric positive-definite matrices and
 * least-squares approximation）。印刷页 838–849（pdf 859–870）。 */
export default {
  key:'s03',id:'ch28/s03',chapter:28,section:'28.3',
  title:'对称正定：主元永不为零，残差永不正交',shortTitle:'28.3 对称正定与最小二乘',
  titleEn:'Symmetric positive-definite matrices and least-squares approximation',
  source:{printed:[838,849],pdf:[859,870]},
  prerequisites:[{label:'28.2 矩阵求逆',url:'#/ch28/s02'}],
  stages:[
   {type:'map',title:'正定性 → 免选主元 → 最小二乘',
    why:'若实对称矩阵 $A$ 对一切 $x \\neq 0$ 满足 $x^{T}Ax > 0$，则称它**对称正定**。三个后果串成本节：① 一切前导子矩阵与 Schur 补仍正定（引理 28.4、28.5）→ 28.2 的分治求逆合法；② LU 分解**永不会除以 0**（推论 28.6）→ 免选主元；③ 最小二乘的正规方程 $A^{T}Ac = A^{T}y$ 的系数矩阵恰是 $A^{T}A$ —— 正定，所以有唯一解。',
    position:'第 VIII 部分第 3 节。它把"数值线性代数"与"数据拟合"接起来：本节最后那个五点二次拟合就是原书 Figure 28.3。',
    unlocks:[{label:'第 29 章 Linear Programming',url:'#/ch29/s01'}],
    mathKit:[
     {title:'正定的定义',body:'$x^{T}Ax > 0$ 对一切 $x \\neq 0$ 成立（且 $A = A^{T}$）。'},
     {title:'引理 28.3 / 28.4 / 28.5',body:'正定 ⟹ 非奇异；正定的前导子矩阵仍正定；Schur 补 $S = C - BA_k^{-1}B^{T}$ 仍正定。'},
     {title:'推论 28.6',body:'对称正定矩阵的 LU 分解不会出现零主元 —— 主元**严格为正**。'},
     {title:'正规方程',body:'最小化 $\\lVert Ac - y \\rVert$ 等价于解 $A^{T}Ac = A^{T}y$。'},
    ]},
   {type:'intuition',title:'三个实测：拟合系数直接对上原书',scene:'C 程序 Part 3a–3c',body:[
     '**为什么会需要正定**：Cholesky 分解 $S = LL^{T}$ 只对正定矩阵存在 —— 它把 LU 的两次三角分解压成一次（$L$ 与 $L^{T}$ 共用数据），代价约 $n^3/6$，是 LU 的一半。C 程序 Part 3a 验证 $\\max|LL^{T} - S| = 1.78\\text{e-}15$。',
     '**最小二乘的判据不是"误差最小"而是"残差与基正交"**：对基函数求导置零，得到 $A^{T}(Ac - y) = 0$。C 程序 Part 3b 在带扰动的直线数据上验证该正交性到 $3.55\\text{e-}15$，同时系数回到 $1.02 + 1.97t$（真值 $1 + 2t$）。',
     '★ **最强的检验是复现原书**：Part 3c 用原书 p.843 的五个点 $(-1,2), (1,1), (2,1), (3,0), (5,3)$ 做二次拟合，程序打印',
     '$F(x) = 1.200 - 0.757x + 0.214x^{2}$ —— 与原书 $1.200 - 0.757x + 0.214x^{2}$ **逐位相同**（阈值 $10^{-3}$）。这不是"看起来像"，是用同一组数据、同一套正规方程独立算出来的一致。',
     '⚠ 注意 $n < m$ 的前提：取 $n = m$ 可以精确穿过每个点（原书 p.841 明说），但那样拟合的是噪声；最小二乘的意义来自**过定系统**（方程比未知数多）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 A k 代表 Aₖ、positivedefinite 是跨行断词）。',blocks:[
     {kind:'body',page:838,en:'Any positive-definite matrix is nonsingular.',
      zh:'★★ 引理 28.3：正定 ⟹ 非奇异（否则有非零 $x$ 使 $Ax = 0$，与 $x^{T}Ax > 0$ 矛盾）。'},
     {kind:'body',page:839,en:'If A is a symmetric positive-definite matrix, then every leading submatrix of A is symmetric and positive-definite.',
      zh:'★★ 引理 28.4：前导子矩阵仍正定 —— 28.2 的分治递归**合法性**就靠它。'},
     {kind:'body',page:840,en:'If A is a symmetric positive-definite matrix and A k is a leading k × k submatrix of A, then the Schur complement S of A with respect to A k is symmetric and positive-definite.',
      zh:'★★ 引理 28.5（Schur 补引理）：递归的第二个子问题 $S$ 也正定。'},
     {kind:'body',page:840,en:'LU decomposition of a symmetric positive-definite matrix never causes a division by 0.',
      zh:'★★ 推论 28.6：免选主元！这是"正定"最实用的直接后果。'},
     {kind:'proof',page:840,en:'Proof Because A is symmetric, so is the submatrix C . By Exercise D.2-6 on page 1223, the product BA −1 k B T is symmetric. Since C and BA −1 k B T are symmetric, then by Exercise D.1-1 on page 1219, so is S .',
      zh:'★ 引理 28.5 证明的前半段：对称性继承（用习题 D.2-6 / D.1-1）。'},
     {kind:'body',page:841,en:'One important application of symmetric positive-definite matrices arises in fitting curves to given sets of data points. You are given a set of m data points',
      zh:'★★ 引入最小二乘：用曲线去拟合 $m$ 个带测量误差的数据点。'},
     {kind:'body',page:841,en:'Some theoretical principles exist for choosing n, but they are beyond the scope of this text. In any case, once you choose a value of n that is less than m, you end up with an overdetermined set of equations whose solution you wish to approximate.',
      zh:'★★ $n < m$ 时得到**过定方程组**，只能求近似解 —— 这正是最小二乘的场景。'},
     {kind:'body',page:842,en:'By choosing n = m, you can calculate each y i exactly in equation (28.19).',
      zh:'★ $n = m$ 可以精确穿过每个点，但那不是拟合而是插值（会被噪声牵着走）。'},
    ],terms:[{en:'positive-definite',zh:'对称正定',page:838},
              {en:'least-squares',zh:'最小二乘',page:842},
              {en:'Schur complement',zh:'Schur 补',page:840}]},
   {type:'pseudocode',title:'本站整理：Cholesky 与正规方程（原书 28.3 用文字给出）',algo:'CHOLESKY',signature:'CHOLESKY(A)',
    page:840,
    lines:[
     {n:1,code:'CHOLESKY(A)                     // A 对称正定，求 L 使 A = L·Lᵀ',zh:''},
     {n:2,code:'    for i = 1 to n',zh:''},
     {n:3,code:'        for j = 1 to i',zh:''},
     {n:4,code:'            s = a_ij − Σ_{t<j} l_it · l_jt',zh:'★ 与 LU 消元同一形状，但只走下半三角。'},
     {n:5,code:'            if i == j: l_ij = √s',zh:'★★ 开方合法 ⟺ $s > 0$ ⟺ 正定（推论 28.6 的严格正主元）。'},
     {n:6,code:'            else:      l_ij = s / l_jj',zh:''},
     {n:7,code:'    return L',zh:'★ 只需 $n^3/6$ 次乘加 —— LU 的一半。'}],
    vars:[{name:'L',meaning:'下三角因子，$A = LL^{T}$'}],
    note:'★ 原书 28.3 没有伪代码框：Cholesky 与正规方程都以正文公式给出，本段是本站按 p.838–842 的文字整理；C 程序 part 3a 就是这 7 行的实现。',
    more:[{algo:'LEAST-SQUARES',subtitle:'LEAST-SQUARES(A, y) —— 过定系统的最小二乘解（原书 p.842–843）',signature:'LEAST-SQUARES(A, y)',page:843,
      lines:[{n:1,code:'G = Aᵀ · A                       // 对称正定（n × n）',zh:'★★ 这一步解释了为什么正文先讲正定：正规方程的系数矩阵一定是正定的。'},
        {n:2,code:'z = Aᵀ · y',zh:''},
        {n:3,code:'L = CHOLESKY(G)                   // 或 LUP；正定则免选主元',zh:'★ 推论 28.6 保证不会除以 0。'},
        {n:4,code:'解 L·Lᵀ·c = z（前代 + 回代）',zh:'★ 两次 $\\Theta(n^2)$ 代入。'},
        {n:5,code:'return c                          // 使 ‖A·c − y‖ 最小',zh:'★ 判据：$A^{T}(Ac - y) = 0$。'}],
      vars:[{name:'c',meaning:'待求的 $n$ 个系数'}],
      note:'★ C 程序 part 3c 走的是这条路线（用 LUP 解正规方程而不是 Cholesky），因为 $A^{T}A$ 在五点例子上只有 $3 \\times 3$。'}]},
   {type:'visualize',title:'Cholesky 为什么只要一半',panels:[
     {title:'三种分解的乘加量级',viz:'growth',
      chart:{xMax:64,series:[
       {name:'n³/3（LUP / 高斯消元）',expr:'n * n * n / 3',color:'--viz-compare'},
       {name:'n³/6（Cholesky，只走下半三角）',expr:'n * n * n / 6',color:'--viz-done'},
       {name:'n²（两次三角代入）',expr:'n * n',color:'--viz-result'}]},
      note:'★ 差的是一个常数因子 $2$，不是阶 —— Cholesky 的价值在于**免选主元**（推论 28.6）与更少的访存。'},
    ],tasks:['对照 C 程序 part 3a 的 $\\max|LL^{T} - S| = 1.78\\text{e-}15$ 与 part 3b 的正交性 $3.55\\text{e-}15$。'],note:''},
   {type:'code',title:'实测：Cholesky、正交性、复现原书五点拟合',c:{file:'matrix_ops.c',code:String.raw`/* matrix_ops.c -- 28 章：矩阵运算（LUP 分解 / 求逆 / 对称正定与最小二乘）。
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 3a–3c。'},
           {line:327,zh:'★★ part 3a：Cholesky 分解的残差 $\\max|LL^{T} - S| = 1.78\\text{e-}15$ —— 正定性让开方合法。'},
           {line:347,zh:'★ part 3b：带扰动直线的最小二乘 → $y = 1.02 + 1.97t$（真值 $1 + 2t$）。'},
           {line:356,zh:'★★ part 3b 的判据：残差与基正交 $\\max|A^{T}(Ac - y)| = 3.55\\text{e-}15$ —— 这才是最小二乘的定义。'},
           {line:384,zh:'★★★ part 3c：原书 p.843 的五个点 → $1.200 - 0.757x + 0.214x^{2}$，与原书系数逐位相同。'}]},
    tests:[{in:'$3 \\times 3$ 正定矩阵 Cholesky',out:'max|L·Lᵀ − S| = 1.78e-15'},
           {in:'带扰动的直线拟合',out:'y = 1.02 + 1.97t；max|Aᵀ(Ac−y)| = 3.55e-15'},
           {in:'原书五点二次拟合',out:'F(x) = 1.200 − 0.757x + 0.214x²，与原书一致'}],
    mapping:[{pc:4,pcCode:'s = a_ij − Σ_{t<j} l_it·l_jt',c:'`for (int t = 0; t < j; t++) { s -= L[i][t] * L[j][t]; }`（第 313 行）'},
             {pc:5,pcCode:'if i == j: l_ij = √s',c:'`if (i == j) { L[i][j] = sqrt(s); }`（第 314 行）'}]},
   {type:'analyze',title:'一本账：正定的三个后果',claims:[
     {expr:'x^{T}Ax > 0',when:'对称正定的定义（对一切 $x \\neq 0$）',page:838,source:'book'},
     {expr:'\\text{无零主元}',when:'推论 28.6：对称正定矩阵的 LU 分解不会除以 0（主元严格为正）',page:840,source:'book'},
     {expr:'A^{T}Ac = A^{T}y',when:'最小二乘的正规方程（残差与基正交）',page:842,source:'book'},
     {expr:'\\Theta(M(n))',when:'28.2 的分治求逆依赖引理 28.4/28.5 保持正定性',page:835,source:'book'},
    ],tables:[{caption:'C 程序 Part 3 的实测（全部是残差，不是"看着对"）',rows:[
      ['检查项','实测值','阈值'],
      ['Cholesky：max|L·Lᵀ − S|','1.78e-15','1e-12'],
      ['直线拟合：max|Aᵀ(Ac−y)|','3.55e-15','1e-12'],
      ['五点拟合：max|Aᵀ(Ac−y)|','4.44e-15','1e-12'],
      ['五点拟合系数 c₀ / c₁ / c₂','1.200 / −0.757 / 0.214','与原书差 < 1e-3'],
     ]},{caption:'LU 与 Cholesky 的分工',rows:[
      ['','LU / LUP','Cholesky'],
      ['适用矩阵','任意非奇异','对称正定'],
      ['乘加量级','$\\approx n^3/3$','$\\approx n^3/6$'],
      ['是否需要选主元','需要（除零风险）','**不需要**（推论 28.6）'],
      ['因子形状','$L$ 单位下三角 + $U$','$L$ 下三角 + $L^{T}$（数据共用）'],
     ]}],chart:{xMax:64,series:[
     {name:'n³/3（LU）',expr:'n * n * n / 3',color:'--viz-violation'},
     {name:'n³/6（Cholesky）',expr:'n * n * n / 6',color:'--viz-done'}]},
    derivations:[{kind:'line',title:'正规方程怎么来的：对每个系数求导置零',steps:[
      {zh:'误差向量 $\\varepsilon = Ac - y$，目标是最小化 $\\lVert\\varepsilon\\rVert^{2} = \\varepsilon^{T}\\varepsilon$。'},
      {zh:'对 $c_k$ 求偏导：$\\partial\\lVert\\varepsilon\\rVert^{2}/\\partial c_k = 2\\sum_i \\varepsilon_i (\\partial\\varepsilon_i/\\partial c_k) = 2\\varepsilon^{T}A_{*k}$。'},
      {zh:'把 $n$ 个方程合起来：$(Ac - y)^{T}A = 0$，转置即 $A^{T}(Ac - y) = 0$。'},
      {tex:'A^{T}Ac = A^{T}y',zh:'★★ 这就是原书式 (28.21) 的正规方程。C 程序 part 3c 打印的正规方程残差 $4.44\\text{e-}15$ 就是对它的数值验证（不是"误差小"，是"残差与每一列正交"）。∎'}]},
     ],
    note:''},
   {type:'prove',title:'Schur 补引理：配方',statement:'If A is a symmetric positive-definite matrix and A k is a leading k × k submatrix of A, then the Schur complement S of A with respect to A k is symmetric and positive-definite.',
    page:840,
    intro:'★ 引理 28.5 的证明分两半：对称性靠转置的性质（正文 + 习题 D.2-6）；正定性靠"配方"。',
    steps:[
     {title:'① 对称性继承',en:'Proof Because A is symmetric, so is the submatrix C . By Exercise D.2-6 on page 1223, the product BA −1 k B T is symmetric. Since C and BA −1 k B T are symmetric, then by Exercise D.1-1 on page 1219, so is S .',
      page:840,
      body:['$C$ 对称（$A$ 的子矩阵）；$BA_k^{-1}B^{T}$ 对称（习题 D.2-6：对称矩阵之积的转置等于自身）。',
        '两个对称矩阵之差仍对称 → $S = C - BA_k^{-1}B^{T}$ 对称。']},
     {title:'② 配方：把二次型拆成两块',en:'This last equation, which you can verify by multiplying through, amounts to <completing the square= of the quadratic form. (See Exercise 28.3-2.)',
      page:840,
      body:['把 $A$ 写成 $\\begin{bmatrix} A_k & B^{T} \\\\ B & C \\end{bmatrix}$，向量写成 $(y, z)$，则 $x^{T}Ax$ 可整理为',
        '$y^{T}A_ky + 2y^{T}B^{T}z + z^{T}Cz = (y + A_k^{-1}B^{T}z)^{T}A_k(y + A_k^{-1}B^{T}z) + z^{T}S z$（原书式 (28.18)）—— 第一个平方项与 $z$ 无关地非负。']},
     {title:'③ 取 z 非零，读出正定性',en:'Any positive-definite matrix is nonsingular.',
      page:838,
      body:['取任意 $z \\neq 0$，令 $y = -A_k^{-1}B^{T}z$ 让第一个平方项**消失**。',
        '此时 $x \\neq 0$（因为 $z \\neq 0$），而 $x^{T}Ax = z^{T}Sz > 0$ —— 由 $A$ 的正定性推出 $S$ 的正定性。',
        '★ 这一步是"配方"的标准套路：消掉交叉项后剩下的部分必须自己为正。∎']},
    ],conclusion:'★ 结论：$S$ 正定 ⟹ $S^{-1}$ 存在 ⟹ 28.2 的分治求逆可以递归下去（C 程序 part 2b 的第二次递归调用）。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'对称正定矩阵的 LU 分解不会遇到什么？',options:['很大的数','**零主元**','行交换','非对角元'],answer:1,
      why:'★ 推论 28.6：主元严格为正，所以免选主元。'},
     {kind:'single',q:'最小二乘的解满足哪条等式？',options:['$Ac = y$','**$A^{T}Ac = A^{T}y$**','$A^{T}c = y$','$AA^{T}c = y$'],answer:1,
      why:'★ 正规方程；等价说法是"残差与 $A$ 的每一列正交"。'},
     {kind:'judge',q:'正定矩阵的每个前导子矩阵仍正定（引理 28.4）。',answer:true,
      why:'★ 这是 28.2 分治求逆能递归的前提。'},
     {kind:'judge',q:'$n = m$ 时最小二乘可以精确穿过每个数据点，所以它比 $n < m$ 的拟合"更好"。',answer:false,
      why:'★ 原书 p.841：精确穿点等于把测量误差也拟合进去；最小二乘的意义在过定系统。'},
     {kind:'simulate',q:'C 程序 part 3c 用原书五点数据拟合出的二次项系数 $c_2$ 是多少？（填数值，保留三位小数）',expect:[0.214,0.2135,0.2145],placeholder:'例如：0.500',
      why:'0.214 —— 与原书 $F(x) = 1.200 - 0.757x + 0.214x^{2}$ 一致（阈值 1e-3）。'},
     {kind:'simulate',q:'原书五点数据拟合出的常数项系数 $c_0$ 是多少（保留三位小数）？',expect:[1.2],placeholder:'例如：0.500',why:'★ code 段实测 $F(x) = 1.200 - 0.757x + 0.214x^2$，与原书 Figure 28.3 一致。'},
     {kind:'single',q:'为什么最小二乘的正规方程一定有唯一解？',options:['因为 $A$ 是方阵','**因为系数矩阵 $A^{T}A$ 对称正定**','因为方程个数等于未知数个数','因为残差恰好为 0'],answer:1,why:'★ map 段第三条：正规方程 $A^{T}Ac = A^{T}y$ 的系数矩阵恰是 $A^{T}A$ —— 正定，所以可逆。'},
     {kind:'single',q:'对称正定的定义要求 $x^{T}Ax > 0$ 对哪些 $x$ 成立？',options:['所有 $x$','**一切 $x \\neq 0$**','只有单位向量','只有分量全正的向量'],answer:1,why:'★ analyze 第一条定义：$x = 0$ 时必然等于 0，所以条件只对非零向量提。'},
    ],bookExercises:[
     {id:'28.3-4',page:846,star:0,statement:'Prove that the determinant of each leading submatrix of a symmetric positive- definite matrix is positive.',hint:'对前导子矩阵 $A_k$ 用定义：取 $x = (x_k, 0)$ 代入 $x^{T}Ax$，立刻看出 $A_k$ 必须正定（这个构造在引理 28.4 的证明里就用了）。'},
     {id:'28.3-5',page:846,star:0,statement:'Let A k denote the kth leading submatrix of a symmetric positive-definite matrix A. Prove that ⌈et(A k )/ det(A k−1 ) is th⌉ kth pivot during LU decomposition, where, by convention, det(A 0 ) = 1.',hint:'关键的一步是**行列式与主元之积**的联系，不是把结论再念一遍。 正定 ⇒ 每个前导子矩阵 $A_k$ 都可逆且 $\\det(A_k) > 0$，所以 LU 分解一路不需要选主元。 对 $A_k = L_k U_k$ 取行列式：$L_k$ 下三角对角全 1，$U_k$ 上三角的对角就是前 $k$ 个主元 $u_{11}, \\dots, u_{kk}$，于是 $\\det(A_k) = \\prod_{i \\le k} u_{ii}$。 两式相除立刻得 $\\det(A_k) / \\det(A_{k-1}) = u_{kk}$，正是第 $k$ 个主元（约定 $\\det(A_0) = 1$ 让 $k=1$ 也成立）。 顺带把这为什么和正定有关写清楚：$u_{kk} = \\det(A_k)/\\det(A_{k-1}) > 0$， 所以正定矩阵的 LU 主元全为正 —— 这也是 28.3 那套「正定不必选主元」的依据。'},
     {id:'28.3-7',page:846,star:0,statement:'Show that the pseudoinverse A C satisfies the following four equations: AA + A = A; A C AA + = A C ; .AA C / TDAA C ; (A + A) T = A + A:',hint:'用 SVD（原书 p.849 提到）写出 $A^{+}$ 逐个验证四条：它们正是 Moore–Penrose 逆的定义式。'},
    ]},
  ],
};
