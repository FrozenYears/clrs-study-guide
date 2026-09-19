/* =============================================================================
 * 第 D 章 D.2 —— 第 s02 关：D.2 Basic matrix properties
 *
 * 原文锚点：印刷页 1219–1226（pdf_index 1240–1247）
 *
 * ★ 第 32 轮复审收紧：原先写 1219–1290，是从 structure.json 的章末 pdf_end 反推的，
 *   而那个 end 一直顶到全书最后一页（1227 起是 Bibliography，1290 已是 Index）。
 *   本关实际引用的最页是 1223，锚点按 D.2 真实末尾收回到 1226。
 *
 * 引述已从 data/blocks 逐字填入并通过溯源判据，请勿改写 en。
 * 本附录无伪代码，pseudocode 阶段已删除；visualize 改为 panels 形态。
 * ========================================================================== */

export default {
  key: 's02',
  id:'chD/s02',
  chapter: 'D',
  section: 'D.2',
  title: '矩阵的基本性质',
  shortTitle: 'D.2 矩阵的基本性质',
  titleEn: 'Basic matrix properties',
  source: { printed: [1219, 1226], pdf: [1240, 1247] },
  sourceNote: '本关对应原书 D.2 节（印刷页 1219–1226）。',
  prerequisites: [
    { label: 'D.1 Matrices and matrix operations', url: '#/appendix/d/s01' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '为什么还要学矩阵的性质',
      why: '会乘矩阵只是第一步。真正解方程、判正定、做置换，要靠「逆、秩、对称、正定、置换矩阵」这些性质。第 28 章高斯消元、第 28.3 节 Cholesky、第 33.3 节最小二乘都直接建立在 D.2 之上。',
      position: 'D.1 的延续。前置是 D.1（s01）；本关是附录 D 的最后一关。',
      unlocks: [],
      mathKit: [
        { title: '逆', body: '$AB=BA=I$ 时 $B=A^{-1}$；存在则唯一。' },
        { title: '列满秩', body: '$A$ 列满秩 ⇔ $Ax=0$ 只有零解 ⇔ $A^T A$ 正定。' },
        { title: '正定', body: '$x^T A x>0$（所有非零 $x$）⇒ 对称且可逆；可 Cholesky 分解。' },
        { title: '置换矩阵', body: '每行每列恰一个 1；$P^T=P^{-1}$，$\\det P=\\pm1$。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '解方程，就是找一个「反向」的矩阵',
      scene: 'C 程序 Part 3–5',
      body: [
        '★★ 解 $Ax=b$ 相当于找一个矩阵 $A^{-1}$ 把 $b$ 变回 $x$。C 程序 part 3 用 3×3 高斯消元求出 $A^{-1}$，验证 $AA^{-1}=I$ 残差仅 2.2e-16，解 $Ax=b$ 残差 8.9e-16。',
        '★ 「满秩」像一根根互不重叠的绳子：只有零向量能被同时拉直成 0。$A$ 列满秩时，对任意非零 $x$ 都有 $Ax\\neq0$，于是 $x^T(A^T A)x=\\|Ax\\|^2>0$ —— 这就是正定。C 程序 part 4 对三个不同 $x$ 都算出 $x^T M x\\ge0$。',
        '★ 置换矩阵像「洗牌」：$Px$ 把向量元素重排；洗牌的逆操作恰好是它自己的转置。C 程序 part 5 验证 $P^T=P^{-1}$、$\\det P=1$。',
      ],
      interactive: { text: '' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 1219,
          en: 'D.2 Basic matrix properties 1219 x T y = n X i D1 x i y i is a scalar number (actually a 1 × 1 matrix) called the inner product of x and y .',
          zh: '★★ 内积 $x^T y=\\sum_i x_i y_i$ 是一个标量（实为 $1×1$ 矩阵）。' },
        { kind: 'body', page: 1219,
          en: 'We also use the notation ⟨x,y⟩ to denote x T y . The inner-product operator is commutative: ⟨x,y⟩ = ⟨y,x⟩. The matrix xy T is an n × n matrix Z called the outer product of x and y , where ´ ij = x i y j . The (euclidean) norm kx k of an n-vector x is defined by kx k = (x 2',
          zh: '★ 内积可交换；外积 $xy^T$ 是 $n×n$ 矩阵（第 $(i,j)$ 元为 $x_i y_j$）；范数 $\\|x\\|$ 即欧氏长度。' },
        { kind: 'body', page: 1219,
          en: 'Thus, the norm of x is its length in n-dimensional euclidean space. A useful fact, which follows from the equality ã',
          zh: '★ 范数就是 $n$ 维欧氏空间里的长度。' },
        { kind: 'body', page: 1219,
          en: '2 + • • • + x 2 n ) 1/2 is that for any real number a and n-vector x , kax k = |a| kx k : (D.3)',
          zh: '★ 齐次性：$\\|ax\\|=|a|\\,\\|x\\|$（公式 D.3）。' },
        { kind: 'body', page: 1219,
          en: 'Show that if A and B are symmetric n × n matrices, then so are A + B and A − B .',
          zh: '★ 习题：对称矩阵之和、差仍对称（$A^T=A,\\ B^T=B$ ⇒ $(A\\pm B)^T=A^T\\pm B^T=A\\pm B$）。' },
        { kind: 'body', page: 1219,
          en: 'Prove that if P is an n × n permutation matrix and A is an n × n matrix, then the matrix product PA is A with its rows permuted, and the matrix product AP is A with its columns permuted. Prove that the product o f two permutation matrices is a permutation matrix.',
          zh: '★ 置换矩阵性质：$PA$ 重排 $A$ 的行、$AP$ 重排 $A$ 的列；两个置换矩阵之积仍是置换矩阵。' },
        { kind: 'body', page: 1219,
          en: 'We now define some basic properties pertaining to matrices: inverses, linear dependence and independence, rank, and determinants. We also define the class of positive-definite matrices.',
          zh: '★★ 本节定义：逆、线性相关/无关、秩、行列式，以及正定矩阵类。' },
        { kind: 'body', page: 1220,
          en: 'If a matrix has an inverse, it is called invertible, or nonsingular. Matrix inverses, when they exist, are unique.',
          zh: '★ 可逆（非奇异）矩阵的逆若存在则唯一（习题 D.2-1 要证）。' },
        { kind: 'body', page: 1220,
          en: 'A square n × n matrix has full rank if its rank is n. An m × n matrix has full column rank if its rank is n. The following theorem gives a fundamental property of ranks.',
          zh: '★ 满秩：方阵秩为 $n$；$m×n$ 矩阵列满秩即秩为 $n$。' },
        { kind: 'body', page: 1222,
          en: 'For any matrix A with full column rank, the matrix A T A is positive-definite.',
          zh: '★★ 定理 D.6：$A$ 列满秩 ⇒ $A^T A$ 正定（本关证明）。' },
        { kind: 'body', page: 1223,
          en: 'Prove that if P is a permutation matrix, then P is invertible, its inverse is P T , and P T is a permutation matrix.',
          zh: '★ 置换矩阵可逆，且 $P^{-1}=P^T$（$P^T$ 也是置换矩阵）。' },
      ],
      terms: [
        { en: 'invertible', zh: '可逆（非奇异）', page: 1220 },
        { en: 'full column rank', zh: '列满秩', page: 1220 },
        { en: 'positive-definite', zh: '正定', page: 1222 },
        { en: 'permutation matrix', zh: '置换矩阵（正式定义在 D.1，p1217）', page: 1219 },
      ],
    },

    // ——— 阶段 4 伪代码（本节原书无伪代码框；按闸门要求保留空段）———
    {
      type: 'pseudocode',
      title: '本节在原书里没有伪代码框',
      algo: null,
      signature: '',
      page: 1219,
      lines: [],
      vars: [],
      note: '★ 附录 D.2 用定理与证明讲矩阵性质，没有伪代码；实现对照见下一阶段 C 程序。',
    },

    // ——— 阶段 4 动手看见（panels 形态）———————————————————————————
    {
      type: 'visualize',
      title: '求逆与判正定，代价同样是 Θ(n³)',
      panels: [
        { title: '高斯消元求逆的标量运算次数 vs 朴素直觉',
          viz: 'growth',
          chart: { xMax: 16, series: [
            { name: 'n³（Gauss-Jordan 求逆）', expr: 'n*n*n', color: '--viz-compare' },
            { name: 'n²（误以为只解一个元）', expr: 'n*n', color: '--viz-done' },
          ] },
          note: '★ 高斯消元求逆需把 $I$ 一起消成 $A^{-1}$，代价约 $2n^3$ 次运算，量级仍是 $\\Theta(n^3)$。C 程序 part 3 用 3×3 实测 $AA^{-1}=I$ 残差 2.2e-16。正定矩阵还能用 Cholesky 分解（约 $n^3/3$ 次）更快求逆，呼应第 28 章。' },
      ],
      tasks: ['对照 C 程序 part 3：3×3 高斯消元求逆后 $AA^{-1}=I$ 残差仅 2.2e-16。'],
      note: '',
    },

    // ——— 阶段 5 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从性质到 C',
      intro: '书上 $A[i]$ 在 C 里是 `a[i]`（行主序、0 基）。整文件覆盖附录 D 全部数值自证：s02 用 part 3–5。',
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
          { line: 220, zh: '★★ 3×3 高斯消元求逆：$AA^{-1}=I$ 残差 2.2e-16。' },
          { line: 230, zh: '★ 解 $Ax=b$：$A^{-1}b$ 代回残差 8.9e-16。' },
          { line: 237, zh: '★ 对称矩阵判定（S 对称 = 1，非对称矩阵 = 0）。' },
          { line: 248, zh: '★★ $M=A^T A$ 对称；三个 $x$ 的 $x^T M x$ 分别为 5/41/20，全 ≥ 0。' },
          { line: 260, zh: '★ 2×2 正定 [[4,2],[2,5]] Cholesky 成功（L=[[2,0],[1,2]]）。' },
          { line: 267, zh: '★ 2×2 非正定 [[1,2],[2,1]] Cholesky 失败（呼应第 28 章）。' },
          { line: 279, zh: '★ 置换矩阵 $Px$ 是行的重排（[1,2,3]→[2,3,1]）。' },
          { line: 284, zh: '★★ $P^T=P^{-1}$，且 $P^T P=I$（残差 0）。' },
          { line: 296, zh: '★ $\\det P = 1 = \\pm1$。' },
        ],
        tests: [
          { in: 'part 3：AA^{-1}', out: '最大残差 2.2e-16' },
          { in: 'part 4：2×2 正定 Cholesky', out: '成功（L=[[2,0],[1,2]]）' },
          { in: 'part 5：det(P)', out: '1（= ±1）' },
        ],
        mapping: [] },
    },

    // ——— 阶段 6 性质清单 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '几条一眼能认出的性质',
      intro: '这一关把「逆、秩、对称、正定、置换」各归一条，全部能在原书 D.2 找到出处。',
      claims: [
        { expr: 'x^T A x > 0', when: '正定矩阵定义（对所有非零向量 x）', page: [1222], source: 'book' },
        { expr: 'x^T(A^T A)x > 0', when: 'A 列满秩 ⇒ A^T A 正定（定理 D.6）', page: [1222], source: 'book' },
        { expr: 'P^{-1} = P^T', when: '置换矩阵的逆等于其转置', page: [1223], source: 'book' },
      ],
      tables: [],
      chart: null,
      derivations: [],
      note: '★ 正定矩阵的二次型是一个「碗」：$x$ 离原点越远值越大，故只有一个极小点 —— 这是第 29 章最小二乘、第 33.3 节半正定的几何来源。',
    },

    // ——— 阶段 7 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: '凭什么说 A^T A 一定正定',
      statement: 'For any matrix A with full column rank, the matrix A^T A is positive-definite.',
      page: 1222,
      intro: '★ 用反证法：先把二次型化成 $\|Ax\\|^2$，再借「列满秩 ⇒ 只有零解」推出矛盾。C 程序 part 4 对三个 $x$ 都验证了 $x^T M x\\ge0$。',
      steps: [
        {
          title: '第一步 · 把二次型写成一个平方',
          en: 'Proof We must show that x T (A T A)x > 0 for any nonzero vector x . For any vector x , x T (A T A)x = .Ax/ T .Ax/ (by Exercise D.1-2)',
          page: 1222,
          body: ['要证对所有非零 $x$ 有 $x^T(A^T A)x>0$。由转置恒等式 $(AB)^T=B^T A^T$（D.1），', '$(A^T A)^T=A^T(A^T)^T=A^T A$，故 $A^T A$ 对称；且 $x^T(A^T A)x=(Ax)^T(Ax)=\\|Ax\\|^2$。'] },
        {
          title: '第二步 · 平方就是各元平方和',
          en: 'The value kAx k 2 is just the sum of the squares of the elements of t he vector Ax .',
          page: 1222,
          body: ['$\\|Ax\\|^2$ 就是向量 $Ax$ 各分量的平方和，因此恒有 $\\|Ax\\|^2\\ge0$。', '问题只在：会不会恰好等于 0（即正「半」定而非正定）？下一步排除。'] },
        {
          title: '第三步 · 反证排除等于 0',
          en: 'Therefore, kAx k 2 ≥ 0. We’ll show by contradiction that kAx k 2 >0 . Suppose that kAx k 2 = 0. Then, every element of Ax is 0, which is to say Ax = 0. Since A has full column rank, Theorem D.2 says that x = 0, which contradicts the requirement that x is nonzero. Hence, A T A is positive-definite.',
          page: 1222,
          body: ['若 $\|Ax\\|^2=0$，则 $Ax=0$。但 $A$ 列满秩 ⇒ 只有零解 $x=0$，与「$x$ 非零」矛盾。', '故对所有非零 $x$ 都有 $\|Ax\\|^2>0$，即 $x^T(A^T A)x>0$ —— $A^T A$ 正定。∎'] },
      ],
      conclusion: '★ 结论：列满秩矩阵的 $A^T A$ 必正定。这正是最小二乘正规方程 $A^T A\\hat x=A^T b$ 可解、且能 Cholesky 分解的依据（第 28 章）。',
    },

    // ——— 阶段 8 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'judge', q: '矩阵的逆若存在则唯一。', answer: true,
          why: '★ 原书 D.2：Matrix inverses, when they exist, are unique（p1220）。' },
        { kind: 'single', q: 'A 列满秩时，关于 $A^T A$ 下列说法正确的是？', options: ['一定奇异', '一定正定', '一定不对称', '一定为零矩阵'], answer: 1,
          why: '★ 定理 D.6：$A$ 列满秩 ⇒ $A^T A$ 正定（本关证明，C 程序 part 4 验证 ≥0）。' },
        { kind: 'judge', q: '$A^T A$ 总是对称矩阵。', answer: true,
          why: '★ $(A^T A)^T=A^T A$；且 $(AB)^T=B^T A^T$ 保证它成立。' },
        { kind: 'single', q: '置换矩阵 $P$ 满足？', options: ['$P^{-1}=P^T$', '$P^{-1}=-P$', '$P^T P=0$', '$\\det P=2$'], answer: 0,
          why: '★ 原书：置换矩阵可逆且 $P^{-1}=P^T$，$\\det P=\\pm1$（C 程序 part 5：$\\det P=1$）。' },
        { kind: 'judge', q: '对称矩阵之和 $A+B$ 仍对称。', answer: true,
          why: '★ 习题原文（p1219）：若 $A,B$ 对称，则 $A\\pm B$ 对称。' },
        { kind: 'simulate', q: 'C 程序 part 5 中 $P=\\begin{smallmatrix}0&1&0\\\\0&0&1\\\\1&0&0\\end{smallmatrix}$、$x=(1,2,3)^T$，$Px$ 是什么（按行重排）？', expect: [2, 3, 1], placeholder: '例如：1,2,3',
          why: 'Px 把 $x$ 的元素按 $P$ 的行重排 → (2,3,1)；C 程序实测 $Px=[2,3,1]$。' },
        { kind: 'judge', q: '正定矩阵必可逆（因其二次型对所有非零 $x$ 严格大于 0）。', answer: true,
          why: '★ 正定 ⇒ 无非零零空间 ⇒ 满秩 ⇒ 可逆。' },
      ],
      bookExercises: [],
    },
  ],
};
