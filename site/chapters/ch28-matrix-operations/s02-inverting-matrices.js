/* 第 28 章 28.2：矩阵求逆（Inverting matrices）。印刷页 834–838（pdf 855–859）。 */
export default {
  key:'s02',id:'ch28/s02',chapter:28,section:'28.2',
  title:'求逆不比乘法难：两条互相归约的定理',shortTitle:'28.2 矩阵求逆',
  titleEn:'Inverting matrices',
  source:{printed:[834,838],pdf:[855,859]},
  prerequisites:[{label:'28.1 LUP 分解',url:'#/ch28/s01'}],
  stages:[
   {type:'map',title:'两条"归约"定理把两者绑死',
    why:'本节证明矩阵**求逆**与矩阵**乘法**难度相同：给了 $O(I(n))$ 的求逆算法就能在 $O(I(n))$ 内做乘法（定理 28.1）；给了 $O(M(n))$ 的乘法算法就能在 $O(M(n))$ 内求逆（定理 28.2）。于是 $\\text{求逆} = \\Theta(\\text{乘法})$。',
    position:'第 VIII 部分第 2 节。它是"算法归约"思想在线性代数里的标准范例：不问"求逆的界是多少"，而问"求逆与谁同阶"。',
    unlocks:[{label:'28.3 对称正定与最小二乘',url:'#/ch28/s03'}],
    mathKit:[
     {title:'定理 28.1（乘法不比求逆难）',body:'若求逆可在 $I(n)$ 时间完成、且 $I(n) = \\Omega(n^2)$ 满足正则条件 $I(3n) = O(I(n))$，则两个 $n \\times n$ 矩阵可在 $O(I(n))$ 时间内相乘。'},
     {title:'定理 28.2（求逆不比乘法难）',body:'若乘法可在 $M(n)$ 时间完成、$M(n) = \\Omega(n^2)$ 且满足两条正则条件，则任何实非奇异 $n \\times n$ 矩阵的逆可在 $O(M(n))$ 时间内算出。'},
     {title:'正则条件',body:'$M(2n) = O(M(n))$（倍增不破坏阶）与 $4M(n/2) < 2M(n)$（分治的常数不反超）。$M(n) = \\Theta(n^c \\lg^d n)$ 天然满足。'},
    ]},
   {type:'intuition',title:'"构造一个更大的矩阵，把乘法塞进求逆里"',scene:'C 程序 Part 2b',body:[
     '定理 28.1 的技巧：要算 $AB$，就构造分块矩阵 $\\mathcal{A} = \\begin{bmatrix} I & A \\\\ B & 0 \\end{bmatrix}$。它的逆的**右上块**恰是 $-AB$ —— 于是"做一次 $3n \\times 3n$ 的求逆"就完成了乘法。',
     '定理 28.2 的路线反过来：对**对称正定**矩阵，逆可以按 $2 \\times 2$ 分块递归求（两个规模 $n/2$ 的求逆 + 常数次矩阵乘法），Schur 补 $S = D - CB^{-1}C^{T}$ 是递归的第二个子问题；一般非奇异矩阵则用 $A^{-1} = (A^{T}A)^{-1}A^{T}$ 归约到对称正定情形。',
     '★ C 程序 Part 2b：对 $4 \\times 4$ 矩阵用 Schur 补递归求逆，$\\max|AA^{-1} - I| = 6.38\\text{e-}15$；并与 28.1 的 LUP 逐列求逆**逐元素比对**，最大差 $5.55\\text{e-}15$ —— 两条完全不同的路线得到同一个矩阵。',
     '★ 更关键的是**代价的实测**：递归的标量乘加次数 $T(2) = 7$、$T(4) = 70$，恰好满足 $T(n) = 2T(n/2) + 7(n/2)^3$（$2 \\times 7 + 7 \\times 8 = 70$）—— 那个 $7$ 就是每层分解里的七次 $n/2$ 阶矩阵乘法。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 A T 代表 Aᵀ、M(n/2) < 2M(n) 的点号）。',blocks:[
     {kind:'theorem',page:834,en:'Theorem 28.1 (Multiplication is no harder than inversion)',
      zh:'★★ 方向一：乘法不比求逆难。'},
     {kind:'body',page:834,en:'nonsingular n × n matrix, then two n × n matrices can be multiplied in O(I(n)) time. We prove these results as two separate theorems.',
      zh:'★★ 两个方向分成两条独立的定理来证。'},
     {kind:'body',page:834,en:'Note that I(n) satisfies the regularity condition whenever I(n) = Θ(n c lg d n) for any constants c>0 and d ≥ 0.',
      zh:'★ 正则条件对 $\\Theta(n^c \\lg^d n)$ 自动成立 —— 所以 Strassen 那类代价都能套用。'},
     {kind:'theorem',page:835,en:'Theorem 28.2 (Inversion is no harder than multiplication)',
      zh:'★★ 方向二：求逆不比乘法难。'},
     {kind:'body',page:835,en:'The proof that matrix inversion is no harder than matrix multiplication relies on some properties of symmetric positive-definite matrices proved in Section 28.3.',
      zh:'★★ 这个证明要借用 28.3 的对称正定性质 —— 两节的依赖关系。'},
     {kind:'body',page:835,en:'Then the inverse of any real nonsingular n × n matrix can be computed in O(M(n)) time.',
      zh:'★★ 结论：一般实非奇异矩阵的逆也在 $O(M(n))$ 内。'},
     {kind:'body',page:836,en:'the second regularity condition in the statement of the theorem, which implies that 4M(n/2) < 2M(n) .',
      zh:'★★ 递推里 $4M(n/2) < 2M(n)$ 正是让主定理**情况 3** 成立的那一步。'},
    ],terms:[{en:'symmetric positive-definite',zh:'对称正定',page:835},
              {en:'Schur complement',zh:'Schur 补 S = D − CB⁻¹Cᵀ',page:835},
              {en:'regularity condition',zh:'正则条件',page:834}]},
   {type:'pseudocode',title:'本站整理：分治求逆（原书 28.3 用文字描述）',algo:'SPD-INVERSE',signature:'SPD-INVERSE(A)',
    page:835,
    lines:[
     {n:1,code:'SPD-INVERSE(A)                  // A 对称正定',zh:''},
     {n:2,code:'    if n == 1: return [ 1 / a_11 ]',zh:'★ 基例：$1 \\times 1$ 直接取倒数。'},
     {n:3,code:'    分块 A = [[B, Cᵀ], [C, D]]     // 每块 n/2 × n/2',zh:'★ 只对**对称正定**成立的分块（右上块是左下块的转置）。'},
     {n:4,code:'    B⁻¹ = SPD-INVERSE(B)          // 递归 1',zh:'★ 由引理 28.4：$B$ 仍是正定的。'},
     {n:5,code:'    S = D − C · B⁻¹ · Cᵀ           // Schur 补',zh:'★★ 由引理 28.5：$S$ 也正定，所以还能递归。'},
     {n:6,code:'    S⁻¹ = SPD-INVERSE(S)          // 递归 2',zh:'★★ 两个子问题，规模都是 $n/2$。'},
     {n:7,code:'    返回 [[B⁻¹+B⁻¹CᵀS⁻¹CB⁻¹, −B⁻¹CᵀS⁻¹],',zh:'★ 四个块拼回 $A^{-1}$。'},
     {n:8,code:'          [−S⁻¹CB⁻¹,          S⁻¹]]',zh:''}],
    vars:[{name:'S',meaning:'Schur 补 $D - CB^{-1}C^{T}$'},
          {name:'B',meaning:'$A$ 的左上 $n/2$ 块（对称正定）'}],
    note:'★ 原书 28.2 只在正文里用文字＋公式给出这一算法（没有伪代码框），本段是本站按其构造整理的；每层恰好 7 次 $n/2$ 阶乘法 —— 与 C 程序数出来的 $T(4) = 2 \\cdot 7 + 7 \\cdot 8 = 70$ 对应。',
    more:[{algo:'MATRIX-INVERSE',subtitle:'MATRIX-INVERSE(A) —— 一般非奇异矩阵（定理 28.2 的归约）',signature:'MATRIX-INVERSE(A)',page:837,
      lines:[{n:1,code:'G = Aᵀ · A                       // 对称正定',zh:'★★ 这一步是关键：$A^{T}A$ 一定对称正定，于是能用上面的递归。'},
        {n:2,code:'G⁻¹ = SPD-INVERSE(G)',zh:''},
        {n:3,code:'return G⁻¹ · Aᵀ                  // 因为 A⁻¹ = (AᵀA)⁻¹Aᵀ',zh:'★ 三次 $O(M(n))$：两次乘法 + 一次求逆。'},
        {n:4,code:'// n 不是 2 的幂时：补零到 n+k 再截取（原书 p.837）',zh:'★ 指数必须是 2 的幂，否则分块不齐。'}],
      vars:[{name:'G',meaning:'$A^{T}A$，对称正定'}],
      note:'★ C 程序 part 2b 就是这个形状：`gemm(At, A2, 4, G)` → `spd_inverse(G, 4, Gi)` → `gemm(Gi, At, 4, inv2)`。'}]},
   {type:'visualize',title:'代价结构：常数与阶',panels:[
     {title:'分治求逆 vs 经典三次分解',viz:'growth',
      chart:{xMax:64,series:[
       {name:'n³（LUP 分解的量级）',expr:'n * n * n',color:'--viz-compare'},
       {name:'n^lg7 ≈ n^2.807（Strassen 归约后的求逆）',expr:'Math.pow(n, 2.807)',color:'--viz-done'},
       {name:'1.4·n^2.807（分治的常数 7/5）',expr:'1.4 * Math.pow(n, 2.807)',color:'--viz-result'}]},
      note:'★ 指数 $2.807 < 3$ 才是归约的价值；常数 $7/5$ 只是平移曲线，不改变渐进阶 —— 这正是"正则条件"要保证的事。'},
    ],tasks:['对照 C 程序 part 2b 打印的 $T(2) = 7$、$T(4) = 70$，核对递推 $T(n) = 2T(n/2) + 7(n/2)^3$。'],note:''},
   {type:'code',title:'实测：Schur 补递归与 LUP 求逆互相印证',c:{file:'matrix_ops.c',code:String.raw`/* matrix_ops.c -- 28 章：矩阵运算（LUP 分解 / 求逆 / 对称正定与最小二乘）。
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 2b（分治求逆）。'},
           {line:91,zh:'`spd_inverse`：对称正定的分块递归 —— 两个递归调用（`spd_inverse(B, h, Bi)` 与 `spd_inverse(S, h, Si)`）加七次 `gemm`。'},
           {line:264,zh:'★★ part 2b：$\\max|AA^{-1} - I| = 6.38\\text{e-}15$；递归乘加次数 $T(2) = 7$、$T(4) = 70$，与递推吻合。'},
           {line:290,zh:'★ 与 LUP 逐列求逆的结果逐元素比对（最大差 $5.55\\text{e-}15$）—— 两条独立路线互为验证。'}]},
    tests:[{in:'$4 \\times 4$ 实矩阵，经 $A^{T}A$ 归约',out:'max|A·A⁻¹ − I| = 6.38e-15；与 LUP 求逆差 5.55e-15'},
           {in:'递归的标量乘加计数',out:'T(2) = 7，T(4) = 70 = 2·7 + 7·8'}],
    mapping:[{pc:4,pcCode:'B⁻¹ = SPD-INVERSE(B)',c:'`spd_inverse(B, h, Bi);`（第 107 行）'},
             {pc:5,pcCode:'S = D − C·B⁻¹·Cᵀ',c:'`gemm(T, Ct, h, S);`（第 109 行）'},
             {pc:7,pcCode:'拼回四个块',c:'`Mi[i][j] = Bi[i][j] + T[i][j];`（第 119 行）'}]},
   {type:'analyze',title:'一本账：归约与递推',claims:[
     {expr:'O(I(n))',when:'定理 28.1：有了求逆就能做乘法（$I(n) = \\Omega(n^2)$ + 正则条件）',page:834,source:'book'},
     {expr:'O(M(n))',when:'定理 28.2：有了乘法就能求逆',page:835,source:'book'},
     {expr:'T(n) = 2T(n/2) + \\Theta(M(n))',when:'分治求逆的递推（每层两个子问题 + 常数次乘法）',page:836,source:'book'},
     {expr:'\\Theta(n^2)',when:'构造 $\\mathcal{A}$（定理 28.1 的证明里）与算 $A^{T}A$ 的代价',page:834,source:'book'},
    ],tables:[{caption:'C 程序 Part 2b 的实测',rows:[
      ['检查项','结果'],
      ['分治求逆残差 max|A·A⁻¹−I|','6.38e-15'],
      ['递归乘加次数 T(2)','7'],
      ['递归乘加次数 T(4)','70 = 2·7 + 7·8'],
      ['与 LUP 求逆的最大差','5.55e-15'],
     ]},{caption:'三种求逆路线的对照',rows:[
      ['路线','时间','备注'],
      ['逐列 LUP（28.1）','$\\Theta(n^3)$','每列解一次，常数小、实现简单'],
      ['**Schur 补分治**','$T(n) = 2T(n/2) + \\Theta(M(n))$','本关主角；$M(n) = n^{\\lg 7}$ 时得 $O(n^{\\lg 7})$'],
      ['Gauss-Jordan','$\\Theta(n^3)$','左右同时消元，常数更大'],
     ]}],chart:{xMax:64,series:[
     {name:'n³（经典）',expr:'n * n * n',color:'--viz-violation'},
     {name:'1.4·n^2.807（分治 + Strassen 乘法）',expr:'1.4 * Math.pow(n, 2.807)',color:'--viz-done'}]},
    derivations:[{kind:'line',title:'递推怎么解：主定理情况 3',steps:[
      {zh:'设 $M(n) = \\Theta(n^{\\lg 7})$ 且写入 Strassen 的 $n^{\\lg 7}$：每层额外代价 $7(n/2)^{\\lg 7} = n^{\\lg 7}$。'},
      {zh:'于是 $T(n) = 2T(n/2) + n^{\\lg 7}$。比较 $2$ 与 $2^{\\lg 7} = 7$：$2 < 7$ → 主定理情况 3。'},
      {tex:'T(n) = \\Theta(n^{\\lg 7}) = O(M(n))',zh:'★ 结论：求逆与乘法**同阶**。C 程序 part 2b 在 $n = 4$ 上的实测（70 = 2·7 + 7·8）正是这个递推的一次落地。∎'}]},
     ],
    note:''},
   {type:'prove',title:'定理 28.2 的构造',statement:'Then the inverse of any real nonsingular n × n matrix can be computed in O(M(n)) time.',
    page:835,
    intro:'★ 证明只用三样东西：Schur 补的四个分块公式、引理 28.3–28.5（正定性在递归中保持）、以及正则条件。',
    steps:[
     {title:'① 对称正定：分块递归',en:'The proof that matrix inversion is no harder than matrix multiplication relies on some properties of symmetric positive-definite matrices proved in Section 28.3.',
      page:835,
      body:['把 $A$ 分成四个 $n/2$ 阶块，逆写成四个块（原书式 (28.14)）：左上 $B^{-1} + B^{-1}C^{T}S^{-1}CB^{-1}$、右上 $-B^{-1}C^{T}S^{-1}$、左下 $-S^{-1}CB^{-1}$、右下 $S^{-1}$。',
        '其中 $S = D - CB^{-1}C^{T}$ 是 **Schur 补**。',
        '★ C 程序的 `spd_inverse` 就是这四行赋值，且把 $S$ 的计算压成两次 `gemm`。']},
     {title:'② 递归合法：正定性不丢',en:'The proof that matrix inversion is no harder than matrix multiplication relies on some properties of symmetric positive-definite matrices proved in Section 28.3.',
      page:835,
      body:['引理 28.4：对称正定矩阵的每个前导子矩阵仍对称正定 → $B^{-1}$ 存在。',
        '引理 28.5（Schur 补引理）：$S$ 也对称正定 → $S^{-1}$ 存在，递归可继续。',
        '★ 这两条把"两个子问题都合法"钉死 —— 也是本关必须依赖 28.3 的原因。']},
     {title:'③ 每层 7 次乘法 → 递推',en:'the second regularity condition in the statement of the theorem, which implies that 4M(n/2) < 2M(n) .',
      page:836,
      body:['每层做 7 次 $n/2$ 阶矩阵乘法：$CB^{-1}$、$(\\cdot)C^{T}$、$B^{-1}C^{T}$、$S^{-1}C$、$(\\cdot)B^{-1}$、$(\\cdot)(\\cdot)$、$(\\cdot)S^{-1}$。',
        '于是 $T(n) = 2T(n/2) + \\Theta(M(n))$。由正则条件 $4M(n/2) < 2M(n)$ 与 $M(n) = \\Omega(n^2)$，满足主定理情况 3 → $O(M(n))$。',
        '★ 数出来的 7 与公式里的 7 一一对应：C 程序打印的 $T(2) = 7$ 就是单层的七次乘法。']},
     {title:'④ 去掉"对称正定"这条假设',en:'Therefore, to compute A −1 , first multiply A T by A to obtain A T A, then invert the symmetric positive-definite matrix A T A using the above divide-and-conquer algorithm',
      page:837,
      body:['对一般非奇异 $A$：先算 $G = A^{T}A$（对称正定，$\\Theta(n^2)$，被 $M(n) = \\Omega(n^2)$ 吸收）。',
        '再递归求 $G^{-1}$，最后乘 $A^{T}$：共三次 $O(M(n))$ 的操作 → 仍是 $O(M(n))$。',
        '★ C 程序 part 2b 的顺序就是 `gemm(At, A2, 4, G)` → `spd_inverse(G, 4, Gi)` → `gemm(Gi, At, 4, inv2)`。',
        '★ $n$ 不是 2 的幂时补零到 $n + k$（原书 p.837）—— 正则条件保证这种"补齐"不改变阶。∎']},
    ],conclusion:'★ 结论：$\\text{求逆} = \\Theta(\\text{乘法})$ —— 两条定理合起来把两者的阶锁在一起。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'定理 28.1 里构造的 $\\mathcal{A} = \\begin{bmatrix} I & A \\\\ B & 0 \\end{bmatrix}$，它的逆的哪个块给出 $AB$？',options:['左上块','**右上块（取负）**','右下块','左下块'],answer:1,
      why:'★ 右上块是 $-AB$；一次 $3n$ 阶求逆换一次乘法。'},
     {kind:'single',q:'分治求逆每层做几次 $n/2$ 阶矩阵乘法？',options:['4 次','5 次','**7 次**','8 次'],answer:2,
      why:'★ C 程序数出来的 $T(2) = 7$ 就是这七次；$T(4) = 2 \\times 7 + 7 \\times 8 = 70$。'},
     {kind:'judge',q:'递推 $T(n) = 2T(n/2) + \\Theta(M(n))$ 在 $M(n) = \\Omega(n^2)$ 下用主定理的**情况 3** 得 $O(M(n))$。',answer:true,
      why:'★ 原书 p.836 明说这一步用到 $4M(n/2) < 2M(n)$ 这条正则条件。'},
     {kind:'single',q:'一般非奇异矩阵怎么归约到对称正定情形？',options:['$A^{T}A$','$A + A^{T}$','$A A^{T}A$','直接分块即可'],answer:0,
      why:'★ $A^{-1} = (A^{T}A)^{-1}A^{T}$，而 $A^{T}A$ 对称正定。'},
     {kind:'simulate',q:'C 程序 part 2b 里 $4 \\times 4$ 分治求逆的递归乘加次数是多少？（填整数）',expect:[70],placeholder:'例如：84',
      why:'70 = 2·7 + 7·8，与递推 $T(n) = 2T(n/2) + 7(n/2)^3$ 一致。'},
     {kind:'single',q:'定理 28.2 说：给定 $O(M(n))$ 的乘法算法，求逆能在多久内完成？',options:['$O(M(n) \\lg n)$','**$O(M(n))$**','$O(M(n)\\, n)$','$O(n^3)$'],answer:1,why:'★ prove 段的命题就是这个结论；与定理 28.1 合起来才有「求逆 = $\\Theta$(乘法)」。'},
     {kind:'simulate',q:'C 程序里分治求逆在 $n=2$ 时的递归乘加次数 $T(2)$ 是多少？',expect:[7],placeholder:'例如：8',why:'★ code 段实测 $T(2) = 7$，于是 $T(4) = 2 \\cdot 7 + 7 \\cdot 8 = 70$。'},
     {kind:'judge',q:'分治求逆与 LUP 求逆在 $4 \\times 4$ 矩阵上的结果差约 $5.55 \\times 10^{-15}$，说明两条路数值上一致。',answer:true,why:'★ code 段实测：各自残差 6.38e-15、两者之差 5.55e-15 —— 都在浮点误差量级，不是算法差异。'},
    ],bookExercises:[
     {id:'28.2-1',page:837,star:0,statement:'28.2-1 Let M(n) be the time to multiply two n × n matrices, and let S(n) denote the time required to square an n × n matrix. Show that multiplying and squaring matrices have essentially the same difficulty: an M(n)-time matrix-multiplication al-',hint:'把 S(n) 的平方算法代入 M(n) 的递归（或反过来）—— 与本节"互相归约"的思路相同：两边各给对方一条上界。'},
     {id:'28.2-2',page:838,star:0,statement:'28.2-2 Let M(n) be the time to multiply two n × n matrices. Show that an M(n)-time',hint:'用 $M(n)$ 时间的乘法构造块矩阵乘法（分块递归），再反推乘法的下界形状 —— 与定理 28.1/28.2 的写法一致。'},
     {id:'28.2-4',page:838,star:0,statement:'28.2-4 Does the matrix-inversion algorithm based on Theorem 28.2 work when matrix elements are drawn from the field of integers modulo 2? Explain.',hint:'想想"对称正定"在 $\\mathbb{Z}_2$ 里意味着什么：$-1 = 1$，正定无从定义，引理 28.3–28.5 的前提就塌了 —— 这正是 C 程序在实数域上验证它的原因。'},
    ]},
  ],
};
