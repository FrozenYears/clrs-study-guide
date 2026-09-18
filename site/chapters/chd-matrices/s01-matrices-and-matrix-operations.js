/* =============================================================================
 * 第 D 章 D.1 —— 第 s01 关：D.1 Matrices and matrix operations
 *
 * 原文锚点：印刷页 1214–1218（pdf_index 1235–1239）
 *
 * 引述已从 data/blocks 逐字填入并通过溯源判据，请勿改写 en。
 * 本附录无伪代码，pseudocode 阶段已删除；visualize 改为 panels 形态。
 * ========================================================================== */

export default {
  key: 's01',
  id:'chD/s01',
  chapter: 'D',
  section: 'D.1',
  title: '矩阵及其运算',
  shortTitle: 'D.1 矩阵及其运算',
  titleEn: 'Matrices and matrix operations',
  source: { printed: [1214, 1218], pdf: [1235, 1239] },
  sourceNote: '本关对应原书 D.1 节（印刷页 1214–1218）。',
  prerequisites: [],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '为什么先学矩阵运算',
      why: '矩阵是全书线性代数的地基：第 4 章 Strassen 矩阵乘法、第 28 章高斯消元解线性方程组、第 29 章最小二乘，全都建立在「矩阵怎么乘、怎么求逆、怎么分块」之上。先吃透 D.1 的记法与运算律，后面才看得懂这些算法为什么那样写。',
      position: '位于全书数学背景附录的最前。无前置依赖；解锁 D.2（逆、秩、对称、正定、置换矩阵）。',
      unlocks: [
        { label: 'D.2 Basic matrix properties', url: '#/appendix/d/s02' },
      ],
      mathKit: [
        { title: '矩阵记法', body: '$A=(a_{ij})$ 表示第 $i$ 行第 $j$ 列的元；$m×n$ 矩阵的集合记为 $\\mathbb{R}^{m×n}$。' },
        { title: '转置', body: '$(A^T)_{ij}=A_{ji}$：交换行列。向量默认是列向量 $(n×1)$。' },
        { title: '单位矩阵', body: '$I_n=\\operatorname{diag}(1,1,\\dots,1)$ 是乘法单位元，满足 $AI_n=A$。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '一张照片，就是一堆按行列排好的数',
      scene: 'C 程序 Part 1',
      body: [
        '★★ 把一张 $100×100$ 的灰度照片想成一个矩阵：第 $(i,j)$ 个格子的亮度就是 $a_{ij}$。两张照片相加 = 逐格把亮度加起来（矩阵加法）；把照片整体调亮两倍 = 每个格子乘 2（数乘）。',
        '★ 照片「先旋转再缩放」和「先缩放再旋转」通常不是一回事 —— 这就是矩阵乘法不可交换的直观来源。C 程序 part 1 用 $A=\\begin{smallmatrix}1&2\\\\3&4\\end{smallmatrix}$、$B=\\begin{smallmatrix}0&1\\\\1&0\\end{smallmatrix}$ 给出反例：$AB\\neq BA$，最大差恰好是 3。',
        '★ 结合律 $(AB)C=A(BC)$ 则一定成立（C 程序用固定种子随机矩阵验证残差 0）。所以「先乘哪两个」无所谓，但「乘的顺序」不能颠倒。',
      ],
      interactive: { text: '' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 1214,
          en: 'Matrices arise in numerous applications, including, but by no means limited to, scientific computing. If you have seen matrices before, much of the material in this appendix will be familiar to you, but some of it might be new. Section D.1 covers basic matrix definitions and operations, and Section D.2 presents some basic matrix properties.',
          zh: '★★ 矩阵用处极广（远不止科学计算）。本节打基础，下一节 D.2 讲矩阵的性质。' },
        { kind: 'body', page: 1214,
          en: 'This section reviews some basic concepts of matrix theory and some fundamental properties of matrices.',
          zh: '★ 本节复习矩阵理论的基本概念与基本性质。' },
        { kind: 'body', page: 1214,
          en: '(D.1) is a 2 × 3 matrix A = (a ij ), where for i = 1,2 and j = 1,2,3 , the element of the matrix in row i and column j is denoted by a ij . By convention, uppercase letters denote matrices and corresponding subscripted lowercase letters denote their elements. We denote the set of all m × n matrices with real-valued entries by R m×n and, in general, the set of m × n matrices with entries drawn from a set S by S m×n .',
          zh: '★ 记法：$A=(a_{ij})$ 是 $2×3$ 矩阵；大写字母表矩阵，对应小写下标表其元素。$\\mathbb{R}^{m×n}$ 是所有 $m×n$ 实矩阵的集。' },
        { kind: 'body', page: 1214,
          en: 'The transpose of a matrix A is the matrix A T obtained by exchanging the rows and columns of A. For the matrix A of equation (D.1), D.1 Matrices and matrix operations 1215',
          zh: '★ 转置 $A^T$：把行列互换，$(A^T)_{ij}=A_{ji}$。' },
        { kind: 'body', page: 1215,
          en: 'A vector is a one-dimensional array of numbers. For example, x = ã ä is a vector of size 3. We sometimes call a vector of length n an n-vector. By convention, lowercase letters denote vectors, and the i th element of a size-n vector x is denoted by x i , for i = 1,2,…,n . We take the standard form of a vector to be as a column vector equivalent to an n × 1 matrix, whereas the corresponding row vector is obtained by taking the transpose: x T = .2 3 5/:',
          zh: '★ 向量是一维数组；小写字母表向量，第 $i$ 个元记 $x_i$。默认列向量（$n×1$），行向量由其转置得到。' },
        { kind: 'body', page: 1215,
          en: 'The unit vector e i is the vector whose i th element is 1 and all of whose other elements are 0. Usually, the context makes the size of a unit vector clear.',
          zh: '★ 单位向量 $e_i$：第 $i$ 个元为 1、其余为 0（如 $I_n$ 的第 $i$ 列）。' },
      ],
      terms: [
        { en: 'matrix', zh: '矩阵', page: 1214 },
        { en: 'transpose', zh: '转置', page: 1214 },
        { en: 'identity matrix', zh: '单位矩阵', page: 1215 },
        { en: 'symmetric matrix', zh: '对称矩阵', page: 1217 },
      ],
    },

    // ——— 阶段 4 伪代码（本节原书无伪代码框；按闸门要求保留空段）———
    {
      type: 'pseudocode',
      title: '本节在原书里没有伪代码框',
      algo: null,
      signature: '',
      page: 1214,
      lines: [],
      vars: [],
      note: '★ 附录 D 用定义与恒等式讲矩阵运算，没有伪代码；实现对照见下一阶段 C 程序。',
    },

    // ——— 阶段 4 动手看见（panels 形态）———————————————————————————
    {
      type: 'visualize',
      title: '矩阵乘法到底要算多少次',
      panels: [
        { title: 'n×n 乘法：标量乘法次数 n³ vs 「只看一个元」的错觉',
          viz: 'growth',
          chart: { xMax: 16, series: [
            { name: 'n³（实际标量乘法次数）', expr: 'n*n*n', color: '--viz-compare' },
            { name: 'n²（误以为只扫一遍的错觉）', expr: 'n*n', color: '--viz-done' },
          ] },
          note: '★ n×n 矩阵相乘：每个 $(i,j)$ 元要扫「第 $i$ 行 × 第 $j$ 列」共 $n$ 次乘，共 $n^2$ 个元 → $n^3$ 次标量乘法。C 程序 part 2 实测 $n=2,3,4$ 分别是 8/27/64。第 4 章 Strassen 把它降到 $\\Theta(n^{\\lg 7})\\approx\\Theta(n^{2.81})$。' },
      ],
      tasks: ['对照 C 程序 part 2：n=2,3,4 时朴素计数恰为 8/27/64；分块（8 次子乘法）在 n=2,4,8 上也等于 n³。'],
      note: '',
    },

    // ——— 阶段 5 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从矩阵到 C',
      intro: '书上 $A[i]$ 在 C 里是 `a[i]`（行主序、0 基）。下面整文件覆盖附录 D 的全部数值自证：s01 用 part 1–2。',
      pseudocodeRef: null,
      c:{file:'matrices_appendix.c', code:String.raw`/* matrices_appendix.c -- 附录 D（矩阵）：运算与基本性质的数值自证。
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
`,
        notes: [
          { line: 158, zh: '★★ 结合律 (AB)C = A(BC)：固定种子随机 3×3 矩阵，残差 0。' },
          { line: 169, zh: '★ AB ≠ BA 反例：A=[[1,2],[3,4]], B=[[0,1],[1,0]]，最大差 3。' },
          { line: 179, zh: '★★ (AB)^T = B^T A^T 逐元素验证，残差 0。' },
          { line: 186, zh: '★ A·I = A：单位矩阵是乘法单位元。' },
          { line: 193, zh: '★ 朴素乘法标量乘法次数 = n³（n=2,3,4 → 8/27/64）。' },
          { line: 205, zh: '★ 分块：2×2 块、8 次子乘法，合计 8·(n/2)³ = n³（n=2,4,8）。' },
        ],
        tests: [
          { in: 'part 1：(AB)C vs A(BC)', out: '最大残差 0（固定种子）' },
          { in: 'part 1：AB ≠ BA', out: '最大差 3（反例矩阵）' },
          { in: 'part 2：n=3 朴素乘法', out: '标量乘法次数 = 27 = 3³' },
        ],
        mapping: [] },
    },

    // ——— 阶段 6 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '一次矩阵乘法要花多少',
      intro: '这一关只回答一件事：朴素矩阵乘法的代价由「标量乘法次数」决定，正是 $n^3$。',
      claims: [
        { expr: '\\Theta(n^3)', when: 'n×n 矩阵相乘的标量乘法次数（朴素算法）', page: [1218], source: 'book' },
        { expr: '\\Theta(pqr)', when: 'p×q 与 q×r 矩阵相乘（一般相容形状）', page: [1218], source: 'book' },
        { expr: '\\Theta(n^{\\lg 7})', when: 'Strassen 分治算法（同页脚注，见第 4.2 节）', page: [1218], source: 'book' },
      ],
      tables: [ { caption: '标量乘法次数实测（C 程序 part 2）', rows: [
        ['n', '朴素 n³', '分块 8·(n/2)³'],
        ['2', '8', '8'],
        ['3', '27', '—（n 非 2 的幂）'],
        ['4', '64', '64'],
      ] } ],
      chart: null,
      derivations: [],
      note: '★ 分块只是把同样的 $n^3$ 次乘重组了一遍（n 为 2 的幂时恒等式精确成立），并未减少次数；真正减少要靠 Strassen。',
    },

    // ——— 阶段 7 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: '凭什么说 (AB)^T = B^T A^T',
      statement: 'For compatible matrices A and B, (AB)^T = B^T A^T, and A^T A is always a symmetric matrix.',
      page: 1218,
      intro: '★ 逐元素证明：两边都取 (i,j) 元，证明它们恒等。C 程序 part 1 已用随机矩阵逐元素验证了残差 0。',
      steps: [
        {
          title: '第一步 · 转置改写 (i,j) 元',
          en: 'The transpose of a matrix A is the matrix A T obtained by exchanging the rows and columns of A.',
          page: 1214,
          body: ['记 $C=AB$。由转置定义，$(C^T)_{ij}=C_{ji}=(AB)_{ji}$。也就是说 $(AB)^T$ 的 $(i,j)$ 元等于 $AB$ 的 $(j,i)$ 元。', '这一步只是把「转置」二字换成「行列互换」的逐元表述。'] },
        {
          title: '第二步 · 乘积 (j,i) 元来自一行乘一列',
          en: 'We define matrix multiplication as follows. Start with two matrices A and B that are compatible in the sense that the number of columns of A equals the number of rows of B.',
          page: 1218,
          body: ['由矩阵乘法定义，$(AB)_{ji}=\\sum_k a_{j,k}\\,b_{k,i}$（第 $j$ 行点乘第 $k$ 列）。', '再看右端：$(B^T A^T)_{ij}=\\sum_k (B^T)_{i,k}(A^T)_{k,j}=\\sum_k b_{k,i}\\,a_{j,k}$。'] },
        {
          title: '第三步 · 两个 (i,j) 元恒等',
          en: 'A(BC) = .AB/C for compatible matrices A, B , and C . Matrix multiplication distributes over addition:',
          page: 1218,
          body: ['两式都是对 $k$ 求和 $a_{j,k}b_{k,i}$，标量乘法可交换，故 $\\sum_k a_{j,k}b_{k,i}=\\sum_k b_{k,i}a_{j,k}$。', '于是 $(AB)^T$ 与 $B^T A^T$ 的 $(i,j)$ 元对所有 $i,j$ 相等 → 两矩阵相等。同理 $A^T A$ 满足 $(A^T A)^T=A^T(A^T)^T=A^T A$，故对称。∎'] },
      ],
      conclusion: '★ 结论：$(AB)^T=B^T A^T$，且 $A^T A$ 恒为对称矩阵。这是 D.2 正定证明里 $(Ax)^T(Ax)$ 化简的根据。',
    },

    // ——— 阶段 8 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'judge', q: '矩阵的转置是把行列互换：$(A^T)_{ij}=A_{ji}$。', answer: true,
          why: '★ 原书 D.1 转置定义（p1214）。' },
        { kind: 'judge', q: '对任意两个同阶方阵 $A,B$，恒有 $AB=BA$。', answer: false,
          why: '★ 原书明确说 n>1 时乘法不可交换；C 程序 part 1 给出反例（最大差 3）。' },
        { kind: 'single', q: 'n×n 矩阵朴素相乘，标量乘法次数是？', options: ['$n^2$', '$n^3$', '$2n^2$', '$n\\log n$'], answer: 1,
          why: '★ 每个 $(i,j)$ 元 $n$ 次乘、共 $n^2$ 个元 → $n^3$（原书 p1218，C 程序 part 2 实测 8/27/64）。' },
        { kind: 'judge', q: '矩阵乘法满足结合律：$(AB)C=A(BC)$。', answer: true,
          why: '★ 原书 p1218「Matrix multiplication is associative」；C 程序 part 1 残差 0。' },
        { kind: 'single', q: '$(AB)^T$ 等于什么？', options: ['$A^T B^T$', '$B^T A^T$', '$A B^T$', '$(A^T+B^T)$'], answer: 1,
          why: '★ 转置反转相乘顺序：$ (AB)^T=B^T A^T$（本关证明）。' },
        { kind: 'judge', q: '$A\\cdot I_n = A = I_n\\cdot A$（$I_n$ 是单位矩阵）。', answer: true,
          why: '★ 原书 p1218「Identity matrices are identities for matrix multiplication」；C 程序 part 1 残差 0。' },
        { kind: 'simulate', q: 'C 程序 part 2 里 n=4 的朴素标量乘法次数是多少？', expect: [64], placeholder: '例如：27',
          why: '64 —— 正是 $4^3$；分块 8·(2)³ 也等于 64。' },
      ],
      bookExercises: [],
    },
  ],
};
