/* 第 29 章 29.3：对偶（Duality）。印刷页 866–875（pdf 887–896）。 */
export default {
  key:'s03',id:'ch29/s03',chapter:29,section:'29.3',
  title:'对偶：给最优性发一张证书',shortTitle:'29.3 对偶',
  titleEn:'Duality',
  source:{printed:[866,875],pdf:[887,896]},
  prerequisites:[{label:'29.2 把问题写成线性规划',url:'#/ch29/s02'}],
  stages:[
   {type:'map',title:'一个原始问题，一个对偶问题，两个最优值相等',
    why:'给定标准形（最大化），它的**对偶**是：把 $\\max$ 换成 $\\min$、把右端项与目标系数互换、把 $\\le$ 换成 $\\ge$、每条约束对应一个非负变量 $y_i$。**弱对偶**说任何可行对都有 $c^{T}x \\le b^{T}y$；**强对偶**（定理 29.4）说两边的最优值相等；**互补松弛**进一步说明哪些约束在最优处必须取等号。',
    position:'本章的收口。它把 24 章的最大流最小割定理解释成对偶等式，也给出"我怎么知道这是最优解"的通用答案 —— 一张证书。',
    unlocks:[],
    mathKit:[
     {title:'对偶的机械构造',body:'原始 $\\max c^{T}x$ s.t. $Ax \\le b, x \\ge 0$ → 对偶 $\\min b^{T}y$ s.t. $A^{T}y \\ge c, y \\ge 0$。'},
     {title:'弱对偶（引理 29.1）',body:'任何原始可行 $x$ 与对偶可行 $y$ 满足 $c^{T}x \\le b^{T}y$。'},
     {title:'推论 29.2',body:'若某对 $(x, y)$ 的目标值**相等**，则两者都是最优解 —— 这就是最优性证书。'},
     {title:'Farkas 引理（引理 29.3）',body:'两个互斥条件必有其二：要么 $Ax \\le 0, c^{T}x > 0$ 有解，要么 $A^{T}y = c, y \\ge 0$ 有解。它是强对偶证明的支点。'},
    ]},
   {type:'intuition',title:'三个实测：弱对偶、强对偶、互补松弛',scene:'C 程序 Part 1–3',body:[
     '★ **弱对偶是扫描出来的**：C 程序 part 2 随机生成 40 万组向量，保留那些"原始可行"或"对偶可行"的样本（约 2.6 万对可比样本），对每一对断言 $c^{T}x \\le b^{T}y$，并打印 $c^{T}x - b^{T}y$ 的**最大值** $= -8.48 \\le 0$。没有一对反向 —— 这正是"原始上界"的直观含义。',
     '★★ **强对偶是证书**：part 1 求出的 $x = (8.25, 0, 1.5)$ 与 $y = (0, 0.625, 0.4375)$ 分别越界 0、0，且两边目标值都是 30.75（差 $0$）。由推论 29.2，这**证明**了两者同时最优 —— 不需要相信单纯形法的终止判断。',
     '★★ **互补松弛是逐项验证的**：part 3 打印每个 $y_i \\cdot$（原始第 $i$ 行松弛）与每个 $x_j \\cdot$（对偶第 $j$ 行松弛），六个数全是 0（最大绝对值 $1.8\\text{e-}15$）。',
     '★ 数字本身就讲故事：第 1 行的松弛是 17.25 而 $y_1 = 0$；第 2、3 行松弛为 0 而 $y_2, y_3 > 0$；第 2 列 $x_2 = 0$ 而对偶第 2 行松弛是 0.6875。**"紧的约束配上正的乘子，松的约束乘子为 0"** —— 这就是互补松弛的内容。',
     '★★ 原书 p.868 的乘子 $y = (1,1,0)$（把前两条约束相加）也是对偶可行的，给出上界 54 —— 有效但松。C 程序把这个对比也算了出来，说明"对偶可行 ⟹ 有效上界，对偶最优 ⟹ 紧上界"。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 (29.31)3(29.33) 代表 (29.31)–(29.33)、N x 代表 x̂）。',blocks:[
     {kind:'body',page:866,en:'Duality enables us to prove that a solution is indeed optimal. We saw an example of duality in Chapter 24 with Theorem 24.6, the max-flow min-cut theorem.',
      zh:'★★ 对偶的用途：**证明**一个解确实最优；24 章的最大流最小割定理就是它的一个实例。'},
     {kind:'body',page:866,en:'Given a linear program in standard form in which the objective is to maximize, let’s see how to formulate a dual linear program in which the objective is to minimize and whose optimal value is identical to that of the original linear program.',
      zh:'★★ 对偶的定义方式：最大化 ↔ 最小化，而最优值相同。'},
     {kind:'body',page:866,en:'When referring to dual linear programs, we call the original linear program the primal.',
      zh:'★ 术语：原来的那个叫**原始问题（primal）**。'},
     {kind:'body',page:867,en:'Although forming the dual can be considered a mechanical operation, there is an intuitive explanation. Consider the primal maximization problem (29.37)3(29.41).',
      zh:'★ 机械变换之外还有直观解释（下文用乘子 $y$ 讲）。'},
     {kind:'body',page:868,en:'Now, as long as this constraint has coefficients of x 1 , x 2 , and x 3 that are at least their objective-function coefficients, it is a valid upper bound.',
      zh:'★★ 直观：只要乘子组合出来的约束在**每个变量上都不弱于**目标函数，就得到目标值的一个有效上界。'},
     {kind:'body',page:868,en:'In general, for any nonnegative multipliers y 1 , y 2 , and y 3 , you can generate a constraint y 1 (x 1 + x 2 + 3x 3 ) + y 2 .2x 1 + 2x 2 + 5x 3 /Cy 3 .4x 1 + x 2 + 2x 3 / ≤ 30y 1 + 24y 2 + 36y 3 from the primal constraints or, by distributing and regrouping, (y 1 + 2y 2 + 4y 3 )x 1 C(y 1 + 2y 2 + y 3 )x 2 C(3y 1 + 5y 2 + 2y 3 )x 3 ≤ 30y 1 + 24y 2 + 36y 3 :',
      zh:'★★ 把三条约束按 $y \\ge 0$ 加权相加，右边就是 $b^{T}y$，左边是 $A^{T}y$ 的各个分量。'},
     {kind:'body',page:870,en:'Given the primal linear program in (29.31)3(29.33) and its corresponding dual in (29.34)3(29.36), if both are feasible and bounded, then for optimal solutions x − and y − , we have c T x − = b T y − .',
      zh:'★★ 定理 29.4（强对偶）：两边都有界可行时，最优值相等。'},
     {kind:'body',page:869,en:'then N x and N y are optimal solutions to the primal and dual linear programs, respectively.',
      zh:'★★ 推论 29.2：目标值相等即可断定两者最优 —— C 程序的最优性证书就是这条推论。'},
    ],terms:[{en:'dual linear program',zh:'对偶线性规划',page:866},
              {en:'primal',zh:'原始问题',page:866},
              {en:'weak duality',zh:'弱对偶',page:868}]},
   {type:'pseudocode',title:'本站整理：对偶的机械构造与最优性证书',algo:'TAKE-DUAL',signature:'TAKE-DUAL(A, b, c)',
    page:866,
    lines:[
     {n:1,code:'TAKE-DUAL(A, b, c)          // 原始：max cᵀx, Ax ≤ b, x ≥ 0',zh:''},
     {n:2,code:'    max  →  min',zh:'★ 目标方向翻转。'},
     {n:3,code:'    c 与 b 互换角色',zh:'★ 原始的目标系数成了对偶的右端项，反之亦然。'},
     {n:4,code:'    A → Aᵀ（行变成列）',zh:'★★ 每条原始约束对应对偶的一个变量 $y_i$；每个原始变量对应对偶的一条约束。'},
     {n:5,code:'    ≤ → ≥，并加 y ≥ 0',zh:'★ 约束方向翻转，对偶变量非负。'},
     {n:6,code:'    return min bᵀy, Aᵀy ≥ c, y ≥ 0',zh:'★ 原书式 (29.34)–(29.36)。'}],
    vars:[{name:'y',meaning:'对偶变量，读作"第 $i$ 种资源的影子价格"'}],
    note:'★ 原书 29.3 用式 (29.34)–(29.36) 与整页文字讲对偶构造，没有伪代码框；本段是本站按那几行整理的。C 程序里没有显式构造对偶矩阵 —— 它直接**读出**最优单纯形表里松弛列的检验数当作 $y$。',
    more:[{algo:'VERIFY-OPTIMAL',subtitle:'VERIFY-OPTIMAL(x, y, A, b, c) —— 用证书而不是信任',signature:'VERIFY-OPTIMAL(x, y, A, b, c)',page:869,
      lines:[{n:1,code:'检查 x ≥ 0 且 Ax ≤ b        // 原始可行',zh:'★ C 程序的 `primal_infeas` 返回最大越界量。'},
        {n:2,code:'检查 y ≥ 0 且 Aᵀy ≥ c        // 对偶可行',zh:'★ `dual_infeas` 同理。'},
        {n:3,code:'if cᵀx == bᵀy: return 两者都最优   // 推论 29.2',zh:'★★ 这一步用到了弱对偶：不可能再有更好的解。'},
        {n:4,code:'else: return 还差 cᵀx 到 bᵀy 的这段间隙',zh:'★ 间隙大于 0 时说明至少有一个不是最优。'}],
      vars:[{name:'间隙',meaning:'$b^{T}y - c^{T}x \\ge 0$，最优时恰好为 0'}],
      note:'★ 这是本关最实用的一段：**任何**声称最优的解都可以被这样检验，不必复现求解器的内部过程。C 程序 part 1 打印的"原始越界 0 / 对偶越界 0 / |z − bᵀy| = 0"就是它的输出。'}]},
   {type:'visualize',title:'原始与对偶：同一组数字的两侧',panels:[
     {title:'一个 LP 的对偶对（原书 p.867 的例子）',viz:'tree',
      trees:[{root:{"label": "LP 对偶对", "cost": "同一组数据的两个方向", "children": [{"label": "原始 (29.37)-(29.41)", "cost": "max", "children": [{"label": "3x1+x2+4x3 最大", "cost": "目标"}, {"label": "3 条 ≤ 资源约束", "cost": "30 / 24 / 36"}, {"label": "x = (8.25, 0, 1.5)", "cost": "最优解"}, {"label": "z = 30.75", "cost": "最优值"}]}, {"label": "对偶 (29.42)-(29.44)", "cost": "min", "children": [{"label": "30y1+24y2+36y3 最小", "cost": "目标"}, {"label": "3 条 ≥ 约束", "cost": "Aᵀy ≥ c"}, {"label": "y = (0, 0.625, 0.4375)", "cost": "最优解"}, {"label": "bᵀy = 30.75", "cost": "最优值"}]}]}}],
      treeNotes:['★ 左边是原书式 (29.37)–(29.41)，右边是它的对偶 (29.42)–(29.44)。',
        '两边的最优值都是 30.75 —— 这不是巧合，而是定理 29.4（强对偶）。',
        '★ 原书 p.868 加的乘子 $y = (1,1,0)$ 落在右图的可行域里，给出上界 54（对偶可行但不最优）。'],
      },
    ],tasks:['对照 C 程序 part 1 打印的 $x$、$y$ 与两边的目标值，再看 part 3 的互补松弛六行。'],note:''},
   {type:'code',title:'实测：弱对偶扫描、强对偶证书、互补松弛',c:{file:'linear_programming.c',code:String.raw`/* linear_programming.c -- 29 章：线性规划（单纯形法 / 建模 / 对偶）。
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 1–3（对偶与最优性）。'},
           {line:111,zh:'`primal_infeas` / `dual_infeas`：两侧可行性的量化判据（返回最大越界量）。'},
           {line:166,zh:'★ part 1：对偶最优 $y = (0, 0.625, 0.4375)$ 是直接从最优单纯形表的松弛列读出的。'},
           {line:178,zh:'★★ part 1 的证书：两个越界都为 0 且 $|z - b^{T}y| = 0$ → 由推论 29.2 判定两者最优。'},
           {line:216,zh:'★★ part 2：40 万组随机向量里筛出约 2.6 万对可比样本，$c^{T}x - b^{T}y$ 的最大值为 $-8.48 \\le 0$。'},
           {line:238,zh:'★★ part 3：互补松弛的六个数（$y_i \\cdot$ 松弛、$x_j \\cdot$ 对偶松弛）全为 0，最大 $1.8\\text{e-}15$。'}]},
    tests:[{in:'弱对偶扫描（约 2.6 万对可行样本）',out:'max(cᵀx − bᵀy) = −8.48 ≤ 0'},
           {in:'强对偶证书',out:'|z − bᵀy| = 0（z = bᵀy = 30.75）'},
           {in:'互补松弛',out:'六个乘积全为 0（最大 1.8e-15）'},
           {in:'原书 p.868 的乘子上界',out:'y = (1,1,0) → 54（对偶可行，不紧）'}],
    mapping:[{pc:1,pcCode:'检查 x ≥ 0 且 Ax ≤ b',c:'`static double primal_infeas(int m, int n, const double *A`（第 111 行）'},
             {pc:3,pcCode:'if cᵀx == bᵀy: 两者都最优',c:'`assert(px <= 1e-9 && dy <= 1e-9 && fabs(z - w) < 1e-7);`（第 182 行）'}]},
   {type:'analyze',title:'一本账：从弱对偶到强对偶',claims:[
     {expr:'c^{T}x \\le b^{T}y',when:'弱对偶：任何原始可行 $x$ 与对偶可行 $y$',page:868,source:'book'},
     {expr:'c^{T}x = b^{T}y',when:'强对偶（定理 29.4）：两边都有界可行时最优值相等',page:870,source:'book'},
     {expr:'y_i \\cdot \\text{松弛}_i = 0',when:'互补松弛：紧约束配正乘子，松约束配零乘子',page:874,source:'book'},
     {expr:'\\text{最大流} = \\text{最小割}',when:'第 24 章定理 24.6 就是对偶等式的一个实例',page:866,source:'book'},
    ],tables:[{caption:'C 程序 Part 1–3 的对偶数字（原书 (29.37)–(29.44) 的例子）',rows:[
      ['项','值'],
      ['原始最优 x','(8.25, 0, 1.5)'],
      ['原始最优值 $z$','30.75'],
      ['对偶最优 y','(0, 0.625, 0.4375)'],
      ['对偶最优值 $b^{T}y$','30.75'],
      ['原书 p.868 的乘子','(1,1,0) → 上界 54（有效但不紧）'],
      ['弱对偶扫描的最大间隙','−8.48（≤ 0）'],
      ['互补松弛的最大乘积','1.8e-15'],
     ]},{caption:'互补松弛：逐项看',rows:[
      ['约束/变量','松弛量','乘子','乘积'],
      ['原始第 1 行','17.25','$y_1 = 0$','0'],
      ['原始第 2 行','0','$y_2 = 0.625$','0'],
      ['原始第 3 行','0','$y_3 = 0.4375$','0'],
      ['变量 $x_1$','0','$x_1 = 8.25$','0'],
      ['变量 $x_2$','0.6875','$x_2 = 0$','0'],
      ['变量 $x_3$','0','$x_3 = 1.5$','0'],
     ]}],chart:{xMax:8,series:[
     {name:'54（对偶可行但不紧的上界）',expr:'54',color:'--viz-violation'},
     {name:'30.75（原始 = 对偶的最优值）',expr:'30.75',color:'--viz-done'}]},
    derivations:[{kind:'line',title:'弱对偶一行就证完',steps:[
      {zh:'设 $x$ 原始可行（$Ax \\le b$，$x \\ge 0$），$y$ 对偶可行（$A^{T}y \\ge c$，$y \\ge 0$）。'},
      {zh:'由 $A^{T}y \\ge c$ 两边左乘 $x^{T} \\ge 0$：$x^{T}A^{T}y \\ge x^{T}c$，即 $y^{T}Ax \\ge c^{T}x$。'},
      {zh:'由 $Ax \\le b$ 两边左乘 $y^{T} \\ge 0$：$y^{T}Ax \\le y^{T}b = b^{T}y$。'},
      {tex:'c^{T}x \\le y^{T}Ax \\le b^{T}y',zh:'★★ 中间那项把两边串起来 —— 两处非负性是唯一用到的假设。C 程序 part 2 的 2.6 万对样本就是对这条链的反复抽查。∎'}]},
     ],
    note:''},
   {type:'prove',title:'强对偶与 Farkas 引理',statement:'Given the primal linear program in (29.31)3(29.33) and its corresponding dual in (29.34)3(29.36), if both are feasible and bounded, then for optimal solutions x − and y − , we have c T x − = b T y − .',
    page:870,
    intro:'★ 强对偶的证明不走"构造最优解"，而是反证 + Farkas 引理：假设原始上界 $\\Omega$ 严格小于对偶最优值，造出一个"增广原始问题"，它必然不可行 —— 用 Farkas 引理把这个不可行性翻译成对偶侧的矛盾。',
    steps:[
     {title:'① 目标：让间隙变成 0',en:'then N x and N y are optimal solutions to the primal and dual linear programs, respectively.',
      page:869,
      body:['弱对偶给出 $c^{T}x \\le b^{T}y$，间隙 $b^{T}y - c^{T}x \\ge 0$ 恒成立。强对偶断言：两边都可行有界时这个间隙**在最优处为 0**。',
        '★ 推论 29.2 是它的"反之"：只要间隙是 0，这对解就最优 —— 实践中我们就是这样验收的（C 程序 part 1）。',
        'C 程序的实测间隙：$30.75 - 30.75 = 0$（打印为 $0.00\\text{e+}00$）。']},
     {title:'② 反证：若间隙恒 > 0 会怎样',en:'Given the primal linear program in (29.31)3(29.33) and its corresponding dual in (29.34)3(29.36), if both are feasible and bounded, then for optimal solutions x − and y − , we have c T x − = b T y − .',
      page:870,
      body:['设对偶最优值为 $\\Omega$。反设原始的最优值严格小于 $\\Omega$：对一切可行 $x$ 都有 $c^{T}x < \\Omega$。',
        '把这组严格不等式连同 $x \\ge 0$ 一起看，就是"增广原始问题"无解（不可行）。',
        '★ 于是问题变成：**从一个不可行性推出矛盾**。']},
     {title:'③ Farkas 引理：不可行性的证书',en:'Now, as long as this constraint has coefficients of x 1 , x 2 , and x 3 that are at least their objective-function coefficients, it is a valid upper bound.',
      page:868,
      body:['Farkas 引理（引理 29.3）：以下两个条件恰有一个成立 —— ① 存在 $x$ 使 $Ax \\le 0$ 且 $c^{T}x > 0$；② 存在 $y \\ge 0$ 使 $A^{T}y = c$。',
        '几何解读：① 说"目标方向在可行锥里有正分量"，② 说"目标方向能用约束法向量非负地拼出来"。两者不可能同时成立，也不可能同时不成立。',
        '★ 把增广原始问题的不可行性代入引理的条件 1（不成立），就得到条件 2：存在一组非负乘子 $w$ 满足 $w^{T}M = 0$ 与 $w^{T}g < 0$。']},
     {title:'④ 用乘子 w 与对偶最优性冲突',en:'Given a linear program in standard form in which the objective is to maximize, let’s see how to formulate a dual linear program in which the objective is to minimize and whose optimal value is identical to that of the original linear program.',
      page:866,
      body:['把 $w$ 拆成两部分，那两个式子分别给出"$\\Omega$ 不是对偶最优值"的不同反例，逐一与 $\\Omega$ 的定义矛盾。',
        '于是反设不成立 → 原始最优值不低于 $\\Omega$；结合弱对偶 $\\le \\Omega$，只能是相等。',
        '★ 至此定理 29.4 成立：$c^{T}x^{*} = b^{T}y^{*} = \\Omega$。∎']},
    ],conclusion:'★ 结论：对偶不是"另一个问题"，而是同一组数据的另一面；它给最优性提供可检验的证书（推论 29.2），并把最大流最小割这类结论统一在同一框架下。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'弱对偶说的是哪条不等式？',options:['$c^{T}x \\ge b^{T}y$','**$c^{T}x \\le b^{T}y$**','$c^{T}x = b^{T}y$','$x \\le y$'],answer:1,
      why:'★ 原始的任何可行解给出的都是"下界方向"，对偶的可行解给出上界 —— 中间夹着的就是最优值。'},
     {kind:'single',q:'拿到一对可行 $x$ 与 $y$，怎样立刻判定它们最优？',options:['跑一遍单纯形法','**两边目标值相等**','检查 $x = y$','检查约束数'],answer:1,
      why:'★ 推论 29.2：目标值相等即可，因为弱对偶挡住了任何更好的解 —— 这就是 C 程序的证书。'},
     {kind:'judge',q:'互补松弛在最优处要求"松弛为 0 的约束，其乘子必须为正"。',answer:false,
      why:'★ 只要求**乘积为 0**：紧约束的乘子可以为零（退化情形），松约束的乘子必须为零。C 程序 part 3 第 1 行正是"松弛 17.25、乘子 0"。'},
     {kind:'judge',q:'最大流最小割定理可以看成线性规划对偶的一个实例。',answer:true,
      why:'★ 原书 p.866 明确这么说（第 24 章定理 24.6）。'},
     {kind:'simulate',q:'C 程序 part 2 里 $c^{T}x - b^{T}y$ 的最大值是多少？（填负数，保留两位小数）',expect:[-8.48,-8.5],placeholder:'例如：-0.50',
      why:'−8.48 —— 最大值仍然 ≤ 0，弱对偶在 2.6 万对随机可行样本上没有一次被违反。'},
    ],bookExercises:[
     {id:'29.3-1',page:872,star:0,statement:'29.3-1 Formulate the dual of the linear program given in lines (29.6)3(29.10) on page 852.',hint:'照本关的 TAKE-DUAL 三步：$\max \\to \\min$、$c$ 与 $b$ 互换、$A \\to A^{T}$ 且 $\\le \\to \\ge$。写成对偶后可以用 C 程序设计成两个 LP 分别求解，比较两边最优值。'},
     {id:'29.3-5',page:872,star:0,statement:'29.3-5 Show that the dual of the dual of a linear program is the primal linear program.',hint:'对 $(A, b, c)$ 的原始做两次机械变换：第一次得 $(A^{T}, c, b)$ 的对偶，第二次再变换一次就回到 $\\max c^{T}x$ s.t. $Ax \\le b$ —— 注意两次变换都保持 $\\ge 0$ 与非负约束的对应关系。'},
     {id:'29.3-6',page:872,star:0,statement:'29.3-6 Which result from Chapter 24 can be interpreted as weak duality for the maximumflow problem?',hint:'最大流的对偶是"最小割"：对偶变量 $y_i$ 取值 0/1 表示顶点在 $S$ 还是 $T$，对偶约束 $y_v \\le y_u$ 保证每条从 $s$ 到 $t$ 的路径都被"切"到 —— 这正是 C 程序 part 4 枚举 16 个割时算的东西。'},
    ]},
  ],
};
