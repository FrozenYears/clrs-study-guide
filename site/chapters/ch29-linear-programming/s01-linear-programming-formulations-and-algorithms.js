/* 第 29 章 29.1：线性规划的表述与算法（Linear programming formulations and algorithms）。
 * 印刷页 850–859（pdf 871–880）。 */
export default {
  key:'s01',id:'ch29/s01',chapter:29,section:'29.1',
  title:'标准形、松弛形与转轴：沿顶点走',shortTitle:'29.1 线性规划的表述',
  titleEn:'Linear programming formulations and algorithms',
  source:{printed:[850,859],pdf:[871,880]},
  prerequisites:[{label:'28.3 对称正定与最小二乘',url:'#/ch28/s03'}],
  stages:[
   {type:'map',title:'把问题写成 max cᵀx 满足 Ax ≤ b',
    why:'**标准形**：求 $x \\in \\mathbb{R}^{n}$ 使 $c^{T}x$ 最大，满足 $Ax \\le b$ 与 $x \\ge 0$。加上**松弛变量** $s$ 得到**松弛形** $[A \\mid I]\\begin{bmatrix} x \\\\ s \\end{bmatrix} = b$；令 $n$ 个非基变量为 0 得到一个**基本解**，可行的那一个对应可行区域的一个**顶点**。单纯形法每次转轴就是沿一条棱走到相邻顶点。',
    position:'第 VIII 部分最后一章。它是"优化"这条线的收口：前面几章的问题（最短路、最大流、匹配、指派）都能写成线性规划，而 29.3 的对偶又反过来解释了最大流最小割定理。',
    unlocks:[{label:'29.2 把问题写成线性规划',url:'#/ch29/s02'}],
    mathKit:[
     {title:'标准形',body:'$\\max\\ c^{T}x$，$Ax \\le b$，$x \\ge 0$（$A$ 是 $m \\times n$ 矩阵，$b$ 是 $m$ 维，$c$ 是 $n$ 维）。'},
     {title:'松弛形',body:'每个约束加一个松弛变量：$Ax + s = b$，$s \\ge 0$；基变量与非基变量的划分给出基本解。'},
     {title:'三种结局',body:'有最优解 / **无界**（可行区域无界且目标值可任意大）/ **不可行**（无解）。'},
     {title:'转轴（pivot）',body:'进基变量取最小检验数（Bland 规则），离基变量用**最小比值检验** —— 后者保证右端项非负，从而保持可行性。'},
    ]},
   {type:'intuition',title:'三次转轴：27 → 28 → 30.75',scene:'C 程序 Part 1',body:[
     'C 程序 part 1 解的就是原书 (29.37)–(29.41) 那个例子（$\\max 3x_1 + x_2 + 4x_3$，三条资源约束）。打开轨迹开关后，程序打印出**每一次转轴后的目标值**：$27 \\to 28 \\to 30.75$ —— 这三次跳到相邻顶点的过程就是三次**转轴**：第一次把 $x_1$ 换进基得到 $x = (9,0,0)$（目标 27），第二次把 $x_2$ 换进基得到 $x = (8,4,0)$（目标 28 —— 正好是原书在 p.868 用来演示"乘子上界"的那个点），第三次把 $x_3$ 换进基得到真正的最优 $x = (8.25, 0, 1.5)$（目标 30.75）。',
     '★ 为什么不能"直接解"？可行区域是多面体，最优值一定在**某个顶点**上取到 —— 但顶点的个数是指数级的（$n$ 维超立方体有 $2^{n}$ 个顶点），所以只能**沿棱走**，不枚举。C 程序的转轴次数是 3，而问题的顶点集合小得可以穷举；换成 $n = 60$ 就完全不同了。',
     '★★ 更重要的工程习惯：程序**不相信单纯形法**。它解完之后立刻构造一张最优性证书：$x$ 原始可行（$Ax \\le b$，$x \\ge 0$）、$y$ 对偶可行（$A^{T}y \\ge c$，$y \\ge 0$）、且 $c^{T}x = b^{T}y$。由弱对偶这两条同时成立就**证明**了最优性（原书推论 29.2）。程序打印的对偶解是 $y = (0, 0.625, 0.4375)$，两边目标值都是 30.75。',
     '★ 顺带验证原书 p.868 的直观上界：乘子 $y = (1,1,0)$（把前两条约束相加）确实对偶可行，给出上界 $b^{T}y = 54$ —— 有效但比 30.75 松。',
     '⚠ 单纯形法的最坏情况是指数时间（Klee–Minty 立方体），但它在实践中极快，而且原书 p.858 指出**一般线性规划问题有多项式时间算法**（椭球法 / 内点法）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 c |x| 代表 cⱼxⱼ、a i|x| 代表 aᵢⱼxⱼ）。',blocks:[
     {kind:'body',page:853,en:'Linear programs take a particular form, which we will examine in this section.',
      zh:'★ 本节先给出线性规划的规范形式。'},
     {kind:'body',page:854,en:'We call this representation the standard form for a linear program, and we adopt the convention that A, b, and c always have the dimensions given above.',
      zh:'★★ 标准形的定义（原书式 29.14–29.16）。C 程序的 `lp_load` 就是按这个形状装载的。'},
     {kind:'body',page:854,en:'In line (29.14), c T x is the inner product of two n-vectors. In inequality (29.15), Ax is the m-vector that is the product of an m × n matrix and an n-vector, and in in- equality (29.16), x ≥ 0 means that each entry of the vector x must be nonnegative.',
      zh:'★ 记号说明：$c^{T}x$ 是内积，$Ax$ 是矩阵乘向量，$x \\ge 0$ 指**逐分量**非负。'},
     {kind:'body',page:854,en:'If a linear program has some feasible solutions but does not have a finite optimal objective value, then the feasible region is unbounded and so is the linear program.',
      zh:'★★ 无界的定义：有可行解但目标值没有有限上界。'},
     {kind:'body',page:854,en:'Exercise 29.1-5 asks you to show that a linear program can have a finite optimal objective value even if the feasible region is unbounded.',
      zh:'★ 反过来不成立：可行区域无界时仍可能有有限最优值（见 29.1-5）。'},
     {kind:'body',page:858,en:'In contrast, a general linear-programming problem can be solved in polynomial time.',
      zh:'★★ 与整数规划的对照：一般线性规划有多项式时间算法，而整数线性规划是 NP 难的（原书 29-3）。'},
    ],terms:[{en:'standard form',zh:'标准形',page:854},
              {en:'feasible solution',zh:'可行解',page:854},
              {en:'simplex algorithm',zh:'单纯形法',page:855}]},
   {type:'pseudocode',title:'本站整理：表格式单纯形法（原书 29.1 以图与文字给出）',algo:'SIMPLEX',signature:'SIMPLEX(A, b, c)',
    page:855,
    lines:[
     {n:1,code:'SIMPLEX(A, b, c)              // max cᵀx s.t. Ax ≤ b, x ≥ 0',zh:''},
     {n:2,code:'    装载松弛形：表 = [A | I | b]',zh:'★★ 加松弛变量后是等式：$m$ 个基变量一开始就是全部的松弛变量。'},
     {n:3,code:'    基解 = 令所有非基变量为 0',zh:'★ 第一个基本解就是原点（$b \\ge 0$ 保证它可行）。'},
     {n:4,code:'    while 存在检验数 < 0:',zh:'★ 检验数行 = $-c^{T}$ 经转轴变换后的结果。'},
     {n:5,code:'        选进基列 j（Bland 规则：最小下标）',zh:'★★ 取下标最小者 —— 这条简单规则排除了循环（退化时的死循环）。'},
     {n:6,code:'        最小比值检验选离基行 i',zh:'★★ 在所有正系数行里取 $b_i / a_{ij}$ 最小者，保证右端项仍非负。'},
     {n:7,code:'        若无正系数：return 无界',zh:'★ 目标值可以任意大。'},
     {n:8,code:'        转轴：用第 i 行消去第 j 列',zh:'★ 高斯消元，让第 $j$ 列变成单位向量。'},
     {n:9,code:'    return 目标值 = 表右下角',zh:'★ 同时把松弛列的检验数读出来就是**对偶解** $y$。'}],
    vars:[{name:'检验数',meaning:'该列的 $c_j$ 减对偶乘子的贡献；$-c^{T}$ 行里为负就可改进'},
          {name:'基解',meaning:'令非基变量为 0 得到的解，恰好对应可行区域的一个顶点'}],
    note:'★ 原书 29.1 用 Figure 29.2、Figure 29.3 与整页表格来讲单纯形法的过程，没有给出独立的伪代码框；本段是本站按表格法的描述整理的，与 C 程序 `lp_solve` 一一对应。',
    more:[{algo:'PIVOT',subtitle:'PIVOT(表, 进基列 j, 离基行 i) —— 单次转轴',signature:'PIVOT(表, j, i)',page:855,
      lines:[{n:1,code:'p = 表[i][j]',zh:'★ 主元。'},
        {n:2,code:'表[i][:] = 表[i][:] / p',zh:'★ 归一化：第 $j$ 列在第 $i$ 行变成 1。'},
        {n:3,code:'for 每一行 i2 ≠ i:',zh:''},
        {n:4,code:'    表[i2][:] = 表[i2][:] − 表[i2][j] · 表[i][:]',zh:'★★ 让第 $j$ 列在其它行变成 0 —— 与 LUP 消元是同一套动作（28.1）。'},
        {n:5,code:'基变量[i] = j',zh:''}],
      vars:[{name:'主元',meaning:'$a_{ij}$，必须为正（最小比值检验保证）'}],
      note:'★ C 程序的 `lp_solve` 每次转轴打印"x_j 进基"与当前目标值，part 1 因此能看到 $27 \\to 28 \\to 30.75$ 的顶点路径。'}]},
   {type:'visualize',title:'为什么不枚举顶点',panels:[
     {title:'顶点数 vs 转轴次数',viz:'growth',
      chart:{xMax:20,series:[
       {name:'n 维超立方体的顶点数 2^n',expr:'Math.pow(2, n)',color:'--viz-violation'},
       {name:'单纯形法的转轴次数（本章例子上是 3）',expr:'3',color:'--viz-done'},
       {name:'判定的工作量 n³（每步消元）',expr:'n * n * n',color:'--viz-compare'}]},
      note:'★ 曲线分开的地方就是单纯形法的价值：顶点数指数增长，而转轴次数在实践中接近线性 —— 但**最坏情况**仍是指数（Klee–Minty 例子）。'},
    ],tasks:['对照 C 程序 part 1 打印的三行转轴轨迹（目标值 27、28、30.75）。'],note:''},
   {type:'code',title:'实测：转轴轨迹 + 最优性证书 + 原书的 54 上界',c:{file:'linear_programming.c',code:String.raw`/* linear_programming.c -- 29 章：线性规划（单纯形法 / 建模 / 对偶）。
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
        printf("        对偶（29.42)-(29.44) 的最优解 y = (%.6f, %.6f, %.6f)，bᵀy = %.6f\n",
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
`,
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 1（单纯形法与最优性证书）。'},
           {line:35,zh:'`lp_load`：按标准形装载单纯形表（结构变量 + 松弛变量 + 右端列）。'},
           {line:54,zh:'`lp_solve`：Bland 规则选进基列、最小比值检验选离基行；转轴即一次高斯消元。'},
           {line:166,zh:'★★ part 1：原书 (29.37)–(29.41) 的最优值 30.75，$x = (8.25, 0, 1.5)$，三次转轴。'},
           {line:178,zh:'★★ 最优性证书：$x$ 原始越界 0、$y$ 对偶越界 0、$|z - b^{T}y| = 0$ —— 弱对偶 + 相等就证明了最优。'},
           {line:188,zh:'★ 原书 p.868 的乘子 $y = (1,1,0)$ 给出上界 54（对偶可行但比 30.75 松）。'}]},
    tests:[{in:'原书 (29.37)–(29.41) 的 LP',out:'z = 30.75；x = (8.25, 0, 1.5)；3 次转轴'},
           {in:'最优性证书（原始可行 + 对偶可行 + 目标值相等）',out:'$|z - b^{T}y| = 0$'},
           {in:'原书 p.868 的乘子上界',out:'$y = (1,1,0)$ → $b^{T}y = 54$'}],
    mapping:[{pc:5,pcCode:'选进基列 j（最小下标）',c:'`if (lp->T[m][j] < -EPS) { pc = j; break; }`（第 62 行）'},
             {pc:6,pcCode:'最小比值检验选离基行 i',c:'`double r = lp->T[i][W - 1] / a;`（第 70 行）'},
             {pc:8,pcCode:'转轴：用第 i 行消去第 j 列',c:'`for (int j = 0; j < W; j++) { lp->T[pr][j] /= p; }`（第 79 行）'}]},
   {type:'analyze',title:'一本账：三种结局与三条代价',claims:[
     {expr:'\\Theta(\\text{多项式})',when:'一般线性规划可有多项式时间算法（椭球法 / 内点法）',page:858,source:'book'},
     {expr:'x \\ge 0',when:'标准形里的非负约束（逐分量）',page:854,source:'book'},
     {expr:'\\text{顶点}',when:'最优值一定在可行区域的顶点上取得（若存在有限最优值）',page:855,source:'book'},
     {expr:'\\text{NP-hard}',when:'把 x 限制为整数后问题变成 NP 难（原书 29-3）',page:858,source:'book'},
    ],tables:[{caption:'C 程序 Part 1 的转轴轨迹（原书例子）',rows:[
      ['转轴','进基','当前目标值'],
      ['初始化','（原点处非基变量全为 0）','0'],
      ['1','$x_1$','27'],
      ['2','$x_2$','28'],
      ['3','$x_3$','54 以下的最优 30.75'],
     ]},{caption:'标准形与松弛形',rows:[
      ['','标准形','松弛形'],
      ['约束','$Ax \\le b$','$[A \\mid I]\\,z = b$'],
      ['变量','$x \\ge 0$','$z = (x, s) \\ge 0$'],
      ['初始基本解','不存在（原点不一定可行）','令 $x = 0$ 得 $s = b \\ge 0$ ✓'],
      ['本章用法','讲清问题','单纯形法在它上面转轴'],
     ]}],chart:{xMax:20,series:[
     {name:'2^n（顶点数）',expr:'Math.pow(2, n)',color:'--viz-violation'},
     {name:'3（转轴次数）',expr:'3',color:'--viz-done'}]},
    derivations:[{kind:'line',title:'为什么最优值在顶点上：把内点挪到边界',steps:[
      {zh:'设 $x$ 是最优解且落在可行区域内部。取任意方向 $d$，则 $x + td$ 对足够小的 $t$ 仍可行。'},
      {zh:'若 $c^{T}d > 0$ 就沿 $d$ 走得更远（矛盾），若 $c^{T}d < 0$ 就沿 $-d$ 走（矛盾）→ 只能 $c^{T}d = 0$ 对一切 $d$ 成立，即目标在整块区域上恒定。'},
      {zh:'既然恒定，沿着该方向一直走到某个约束变紧为止，我们到达一个**边界**点，目标值不变。'},
      {tex:'\\text{最优值} = \\max_{x \\in \\text{顶点}} c^{T}x',zh:'★★ 反复"走到边界"即得顶点 —— 于是只需检查顶点（基本可行解）。单纯形法就是从顶点走到相邻顶点，C 程序 part 1 的三次转轴正是走过 (9,0,0) → (8,4,0) → (8.25,0,1.5)。∎'}]},
     ],
    note:''},
   {type:'prove',title:'标准形与松弛形的等价',statement:'We call this representation the standard form for a linear program, and we adopt the convention that A, b, and c always have the dimensions given above.',
    page:854,
    intro:'★ "加松弛变量"没有任何魔法：它只是把 $n$ 个不等式换成 $n$ 个非负的新变量加等式。',
    steps:[
     {title:'① 不等式 → 等式',en:'In line (29.14), c T x is the inner product of two n-vectors. In inequality (29.15), Ax is the m-vector that is the product of an m × n matrix and an n-vector, and in in- equality (29.16), x ≥ 0 means that each entry of the vector x must be nonnegative.',
      page:854,
      body:['对第 $i$ 个约束 $\\sum_j a_{ij}x_j \\le b_i$，引入 $s_i \\ge 0$ 使 $\\sum_j a_{ij}x_j + s_i = b_i$。',
        '两者等价：$s_i$ 恰好是"这条约束还剩多少余量"。',
        '★ C 程序 `lp_load` 第 42 行就写 $T[i][n+i] = 1$ —— 每行一个专属的松弛变量。']},
     {title:'② 基变量与基本解',en:'We call this representation the standard form for a linear program, and we adopt the convention that A, b, and c always have the dimensions given above.',
      page:854,
      body:['松弛形有 $m$ 个等式、$n + m$ 个非负变量 → 取任意 $m$ 个变量作**基**，其余为**非基**（置 0）就唯一解出一组基本解。',
        '初始基取全部松弛变量，解即 $s = b$、$x = 0$（这也是 $b \\ge 0$ 这条约定的用处所在）。',
        '★ 基本解可行 ⟺ 它对应可行区域的一个顶点。']},
     {title:'③ 转轴 = 换基',en:'In contrast, a general linear-programming problem can be solved in polynomial time.',
      page:858,
      body:['一次转轴只做一件事：把一个非基变量换进基、把一个基变量换出去。',
        '几何上就是沿一条棱走到相邻顶点，目标值**单调不减**（进基列检验数为负才换）。',
        '★ 只要选列规则与比值规则固定（如 Bland 规则），就不会循环 —— C 程序因此能在有限的转轴步数内终止。∎']},
    ],conclusion:'★ 结论：标准形（问题）→ 松弛形（等式）→ 基本可行解（顶点）→ 转轴（走到相邻顶点），这条链就是单纯形法的全部。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'标准形里的松弛变量 $s_i$ 表示什么？',options:['目标值的余量','**第 $i$ 条约束的余量**','对偶乘子','变量的上界'],answer:1,
      why:'★ $\\sum_j a_{ij}x_j + s_i = b_i$，所以 $s_i = b_i - \\sum_j a_{ij}x_j \\ge 0$。'},
     {kind:'single',q:'最小比值检验的作用是什么？',options:['让目标值涨得最快','**保持右端项非负（可行性）**','减少转轴次数','避免选到零主元'],answer:1,
      why:'★ 进基列选的是"涨得快"，比值检验选的是"不走出可行区域"。'},
     {kind:'judge',q:'若线性规划有可行解但目标值无有限上界，则称它无界。',answer:true,
      why:'★ 原书 p.854 的定义。'},
     {kind:'judge',q:'可行区域无界一定意味着线性规划无界。',answer:false,
      why:'★ 原书 p.854 紧接着指出：可以无界但最优值有限（习题 29.1-5）。'},
     {kind:'simulate',q:'C 程序 part 1 里最优值是多少？（填数值，如 30.75）',expect:[30.75],placeholder:'例如：28',
      why:'30.75 —— 原书 (29.37)–(29.41) 的 LP 的最优值，且由对偶证书证明。'},
     {kind:'simulate',q:'C 程序 part 1 的单纯形法一共转轴了几次？',expect:[3],placeholder:'例如：5',why:'★ code 段实测 3 次转轴 —— 每次转轴 = 沿一条棱走到相邻顶点。'},
     {kind:'single',q:'若线性规划有有限最优值，它在可行区域的什么位置取得？',options:['可行区域内部','**可行区域的某个顶点上**','任意约束交点','原点'],answer:1,why:'★ analyze 第三条：所以单纯形法只需在顶点间游走，而不必扫遍整个可行区域。'},
     {kind:'judge',q:'把变量限制为整数后，问题不再是多项式时间可解的（原书 29-3）。',answer:true,why:'★ analyze 第四条：整数规划是 NP 难的 —— 这正是「先做 LP 松弛」这套做法的价值来源。'},
    ],bookExercises:[
     {id:'29.1-1',page:858,star:0,statement:'Consider the linear program minimize −2x 1 + 3x 2 subject to x 1 + x 2 = 7 x 1 − 2x 2 ≤ 4 x 1 ≥ 0 : Give three feasible solutions to this linear program. What is the objective value of each one?',hint:'题干只问两件事：**给三个可行解**，以及**每个的目标值** —— 化标准形是 29.1-6、29.1-7 的事，别抢答。 约束是 $x_1 + x_2 = 7$、$x_1 - 2x_2 \\le 4$、$x_1 \\ge 0$，目标 $-2x_1 + 3x_2$。 在等式线 $x_2 = 7 - x_1$ 上任取三点，再核不等式： $(6,1)$：$6-2 = 4 \\le 4$ ✓（正好压在边界上），目标 $-12+3 = -9$； $(4,3)$：$4-6 = -2 \\le 4$ ✓，目标 $-8+9 = 1$； $(1,6)$：$1-12 = -11 \\le 4$ ✓，目标 $-2+18 = 16$。 三个都满足 $x_1 \\ge 0$。 写完自己回代一遍三条约束，别只算目标值。'},
     {id:'29.1-3',page:858,star:0,statement:'Show that the following linear program is infeasible: maximize 3x 1 − 2x 2 subject to x 1 + x 2 ≤ 2 −2x 1 − 2x 2 ≤ −10 x 1 ,x 2 ≥ 0 :',hint:'两条主约束直接对撞：第二条 $-2x_1 - 2x_2 \\le -10$ 两边乘 $-1$（不等号翻向）得 $2x_1 + 2x_2 \\ge 10$，即 $x_1 + x_2 \\ge 5$，而第一条要求 $x_1 + x_2 \\le 2$。写成「不可行证书」的标准形式：取非负乘子 $y_1 = 1$、$y_2 = 1/2$ 与两条约束相乘再相加，左边 $(x_1 + x_2) + (-x_1 - x_2) = 0$，右边 $2 + (-5) = -3$，得到 $0 \\le -3$。★ 顺手交代一句：这条推导没用到 $x_1, x_2 \\ge 0$，矛盾来自两条主约束本身；对偶一侧看，这就是「对偶有可行解 ⟹ 原始无可行解」的那个方向的实例。'},
     {id:'29.1-5',page:859,star:0,statement:'Give an example of a linear program for which the feasible region is not bounded, but the optimal objective value is finite.',hint:'让可行区域沿目标函数的**等值线**方向无界延展：例如 $\\max x_1$ s.t. $x_2 \\ge 0$ 且 $x_1 \\le 5$，区域无界但最优值分明是 5。'},
    ]},
  ],
};
