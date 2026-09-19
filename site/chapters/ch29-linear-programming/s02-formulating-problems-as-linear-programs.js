/* 第 29 章 29.2：把问题写成线性规划（Formulating problems as linear programs）。
 * 印刷页 860–866（pdf 881–887）。 */
export default {
  key:'s02',id:'ch29/s02',chapter:29,section:'29.2',
  title:'一种语言，五种问题：线性规划当建模工具',shortTitle:'29.2 把问题写成线性规划',
  titleEn:'Formulating problems as linear programs',
  source:{printed:[860,866],pdf:[881,887]},
  prerequisites:[{label:'29.1 线性规划的表述',url:'#/ch29/s01'}],
  stages:[
   {type:'map',title:'最短路、最大流、最小费用流、匹配都是 LP',
    why:'本节是"建模"的一节：把图论问题翻译成 $\\max c^{T}x$ s.t. $Ax \\le b$。其中**最大流**的写法最漂亮 —— 目标函数就是流出源点的净流量，容量约束写成 $f_{uv} \\le c_{uv}$，守恒写成每个中间顶点进出相等。写完就能用任何 LP 求解器直接跑。',
    position:'承接 29.1 的形式化，为 29.3 的对偶做铺垫：本节末的"最小费用流"正是"每个问题都能写成一个 LP"这一思想的极端例子。',
    unlocks:[{label:'29.3 对偶',url:'#/ch29/s03'}],
    mathKit:[
     {title:'最短路 LP',body:'变量 $d_v$（$|V|$ 个）；约束 $d_v \\le d_u + w(u,v)$（每条边）与 $d_s = 0$；目标 $\\max d_t$。'},
     {title:'最大流 LP',body:'变量 $f_{uv}$（每条边）；约束 $0 \\le f_{uv} \\le c_{uv}$ 与中间顶点守恒；目标 $\\max \\sum_v f_{sv} - \\sum_v f_{vs}$。'},
     {title:'匹配 LP 松弛',body:'变量 $x_e \\ge 0$；约束每个顶点至多被一条选中边覆盖；目标 $\\max \\sum_e x_e$。二分图时最优解自动是整数。'},
    ]},
   {type:'intuition',title:'把 24 章的答案用 LP 再算一遍',scene:'C 程序 Part 4–5',body:[
     '★ C 程序 part 4 把原书 Figure 24.1 的网络（6 顶点 9 边）写成线性规划：9 条容量约束 + 4 个中间顶点各两条守恒约束（守恒是等式，用一对反向不等式实现）。单纯形法给出最优值 **23** —— 与原书 p.673 的最大流答案一致。',
     '★★ 更彻底的是第二意见：程序**暴力枚举全部 16 个割**（源点必在 $S$、汇点必不在），最小割容量也是 23，取到最小值的割是 $S = \\{s, v_1, v_2, v_4\\}$。于是"最大流 = 最小割"在这个例子上被独立验证，而不是引用定理。',
     '★ part 5 把匹配写成 LP 松弛：6 条边、7 条度约束，最优值 **3** 且每个 $x_e$ 都恰好取 0 或 1 —— 松弛自动整数。',
     '★★ 对照实验揭穿了"自动整数"的假象：同一条式子用在**三角形 $K_3$** 上（3 条边、3 条度约束），LP 最优值是 **1.5**（每条边取 0.5），而整数匹配最多 1。所以整性来自"图是二分图"（系数矩阵全幺模），不是线性规划本身的性质。',
     '⚠ 多商品流（习题 29.2-7）：把流按商品拆成 $f_{uv}^{i}$，约束变成每对源汇的守恒 —— 规模翻倍，而原书 p.865 指出它**只**有多项式时间的线性规划算法可用（组合算法长期没有被找到）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 |V| 2 代表 |V|²、C 代表 +、2 代表 ∈）。',blocks:[
     {kind:'body',page:861,en:'We can formulate the single-source shortest-paths problem as a linear program.',
      zh:'★★ 最短路可以写成线性规划 —— 本节的主题句。'},
     {kind:'body',page:861,en:'You might be surprised that this linear program max imizes an objective function when it is supposed to compute shortest paths. Mini mizing the objective function would be a mistake, because',
      zh:'★★ 为什么目标函数是**最大化**而不是最小化：全部权重非负时，令所有 $d_v = 0$ 就能把"最小化"平凡地打到 0。'},
     {kind:'body',page:861,en:'one for each vertex v 2 V . It also has |E| + 1 constraints: one for each edge, plus the additional constraint that the source vertex’s shortest-path weight always has the value 0.',
      zh:'★★ 规模：$|V|$ 个变量，$|E| + 1$ 条约束（每条边一条，外加 $d_s = 0$）。'},
     {kind:'body',page:862,en:'variables, corresponding to the flow between each pair of vertices, and it has 2 |V| 2 C |V| − 2 constraints.',
      zh:'★ 多商品流写法的规模：$|V|^{2}$ 个变量、$2|V|^{2} + |V| - 2$ 条约束（注意语料把加号抽成了 C）。'},
     {kind:'body',page:863,en:'This problem is known as the minimum-cost-flow problem.',
      zh:'★★ 最小费用流：在满足流守恒与容量的前提下让 $\\sum a(u,v) \\cdot f_{uv}$ 最小。'},
     {kind:'body',page:865,en:'The only known polynomial-time algorithm for this problem expresses it as a linear program and then solves it with a polynomial-time linear-programming algorithm.',
      zh:'★★ 多商品流只有"写成 LP 再解"这一条多项式时间路线 —— 建模本身就是算法。'},
     {kind:'body',page:862,en:'The real power of linear programming comes from the ability to solve new problems. Recall the problem faced by the politician in the beginning of this chapter.',
      zh:'★ 线性规划的威力在"能解新问题"：一张统一的式子代替一堆专用算法。'},
    ],terms:[{en:'minimum-cost-flow problem',zh:'最小费用流问题',page:863},
              {en:'linear program',zh:'线性规划',page:861},
              {en:'maximize',zh:'最大化（目标函数方向）',page:861}]},
   {type:'pseudocode',title:'本站整理：三种建模模板',algo:'MAX-FLOW-LP',signature:'MAX-FLOW-LP(G, s, t, c)',
    page:862,
    lines:[
     {n:1,code:'MAX-FLOW-LP(G, s, t, c)',zh:''},
     {n:2,code:'   变量：每条边一个 f_uv ≥ 0',zh:'★ 变量就是"决策"，这里是每条边运多少。'},
     {n:3,code:'   容量：对每条边 f_uv ≤ c_uv',zh:'★ 每行只含一个变量 —— 单纯形法最容易处理的一类行。'},
     {n:4,code:'   守恒：对每个 v ≠ s,t：Σ_u f_uv − Σ_u f_vu = 0',zh:'★★ 等式用一对反向不等式实现（C 程序 part 4 的 8 行）。'},
     {n:5,code:'   目标：max Σ_v f_sv − Σ_v f_vs',zh:'★ 流出源点的净流量。'},
     {n:6,code:'   解 LP → 得到最大流；对偶解 → 给出最小割',zh:'★★ 这是 29.3 的对偶视角，也是原书 p.866 提到的最大流最小割定理。'}],
    vars:[{name:'f_uv',meaning:'边 $(u,v)$ 上的流量'},
          {name:'c_uv',meaning:'边 $(u,v)$ 的容量'}],
    note:'★ 原书 29.2 以式 (29.25)–(29.28) 的形式给出最大流 LP，没有伪代码框；本段是本站按那几行的结构整理的，与 C 程序 part 4 的建表代码一一对应。',
    more:[{algo:'SHORTEST-PATH-LP',subtitle:'SHORTEST-PATH-LP(G, w, s, t) —— 最短路（原书 p.861）',signature:'SHORTEST-PATH-LP(G, w, s, t)',page:861,
      lines:[{n:1,code:'   变量：每个顶点一个 d_v（自由符号）',zh:'★ 与流的写法不同：$d_v$ 可以是负数，所以要用两半表示。'},
        {n:2,code:'   约束：对每条边 (u,v)：d_v ≤ d_u + w(u,v)',zh:'★★ 这就是三角不等式 —— 松弛操作的"静态版"。'},
        {n:3,code:'   约束：d_s = 0',zh:'★ 源点距离固定为 0（用 d_s ≤ 0 与 −d_s ≤ 0 两条实现）。'},
        {n:4,code:'   目标：max d_t',zh:'★ C 程序 part 5 的同款思路；Bellman-Ford 实际就是在解它的对偶（差分约束，原书 22.4）。'}],
      vars:[{name:'d_v',meaning:'从 $s$ 到 $v$ 的最短路径权'}],
      note:'★ 目标取最大化：每条边约束只给出**上界**，最大化 $d_t$ 就是把这些上界逼到最紧 —— 恰好等于真实最短路。'}]},
   {type:'visualize',title:'建模的代价：规模的差异',panels:[
     {title:'两种写法的规模增长',viz:'growth',
      chart:{xMax:32,series:[
       {name:'最短路：V 个变量',expr:'n',color:'--viz-done'},
       {name:'多商品流：2V²+V−2 条约束',expr:'2 * n * n + n - 2',color:'--viz-violation'},
       {name:'边数上界 V²/2（稠密图）',expr:'n * n / 2',color:'--viz-compare'}]},
      note:'★ 原书 p.862 的数：多商品流用 $|V|^{2}$ 个变量与 $2|V|^{2}+|V|-2$ 条约束 —— 建模不是免费的，写法的规模直接决定能不能跑。'},
    ],tasks:['对照 C 程序 part 4 的 9 + 8 条约束、part 5 的 6 + 7 条约束，数一数每个问题"变成了多大的 LP"。'],note:''},
   {type:'code',title:'实测：最大流 LP = 23，枚举割也是 23',c:{file:'linear_programming.c',code:String.raw`/* linear_programming.c -- 29 章：线性规划（单纯形法 / 建模 / 对偶）。
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 4（最大流 LP）与 part 5（匹配 LP 松弛）。'},
           {line:111,zh:'`primal_infeas` / `dual_infeas`：两个可行性判据，用来验收而不是"看着像"。'},
           {line:269,zh:'★★ part 4：9 条容量行 + 4 个中间顶点各两条守恒行，共 17 行 9 变量。'},
           {line:289,zh:'★★ 结果：$|f| = 23$（原书 Figure 24.1 的答案），逐个验证容量与守恒全部满足。'},
           {line:308,zh:'★★ 暴力枚举 16 个割得最小割容量 23 与割集 $\\{s, v_1, v_2, v_4\\}$ —— 不引用定理的独立验证。'},
           {line:350,zh:'★ part 5：二分图匹配的 LP 松弛最优值 3，且 6 个 $x_e$ 全为 0/1。'},
           {line:376,zh:'★★ 同一个式子在三角形 $K_3$ 上给出 1.5 —— 整性来自二分图（全幺模），不是 LP 的性质。'}]},
    tests:[{in:'最大流 LP（Figure 24.1）',out:'|f| = 23；最小割 23（枚举 16 个割）'},
           {in:'二分图匹配 LP 松弛',out:'3，且解是 0/1'},
           {in:'三角形 K3 的同一松弛',out:'1.5（非整）'}],
    mapping:[{pc:4,pcCode:'守恒：Σ_u f_uv − Σ_u f_vu = 0',c:'`if (ev[e] == v) { A[rows * NE + e] += 1.0; }`（第 261 行）'},
             {pc:5,pcCode:'目标：max Σ_v f_sv − Σ_v f_vs',c:'`c[e] = (eu[e] == 0) ? 1.0 : ((ev[e] == 0) ? -1.0 : 0.0);`（第 271 行）'}]},
   {type:'analyze',title:'一本账：一个问题，一种写法',claims:[
     {expr:'|V| + |E| + 1',when:'最短路 LP 的规模（$|V|$ 变量、$|E|+1$ 约束）',page:861,source:'book'},
     {expr:'O(|V|^2)',when:'多商品流写法的变量与约束规模（$2|V|^{2}+|V|-2$ 条约束）',page:862,source:'book'},
     {expr:'\\sum a(u,v)\\,f_{uv}',when:'最小费用流的目标函数（边权乘流量求和）',page:863,source:'book'},
     {expr:'\\text{多项式时间}',when:'多商品流目前只有"解 LP"这条多项式路线',page:865,source:'book'},
    ],tables:[{caption:'C 程序的两种建模与结果',rows:[
      ['问题','变量 / 约束','LP 最优值','独立验证'],
      ['最大流（Fig. 24.1）','9 / 17','23','枚举全部 16 个割：最小割也是 23'],
      ['二分图匹配','6 / 7','3（全 0/1）','与 24–25 章的最大匹配 3 一致'],
      ['三角形 K3 匹配','3 / 3','1.5（非整）','整数匹配最多 1 → 整性靠二分图'],
     ]},{caption:'四种问题的 LP 写法要点',rows:[
      ['问题','变量','核心约束','目标'],
      ['最短路','$d_v$（free）','$d_v \\le d_u + w(u,v)$，$d_s = 0$','$\\max d_t$'],
      ['最大流','$f_{uv} \\ge 0$','$f_{uv} \\le c_{uv}$，中间点守恒','$\\max$ 源点净流出'],
      ['最小费用流','$f_{uv} \\ge 0$','容量 + 守恒','$\\min \\sum a f$'],
      ['匹配（松弛）','$x_e \\ge 0$','每点度数 $\\le 1$','$\\max \\sum x_e$'],
     ]}],chart:{xMax:32,series:[
     {name:'n（最短路变量数）',expr:'n',color:'--viz-done'},
     {name:'2n²+n−2（多商品流约束数）',expr:'2 * n * n + n - 2',color:'--viz-violation'}]},
    derivations:[{kind:'line',title:'为什么最大流的 LP 最优值就是最大流',steps:[
      {zh:'任一满足容量与守恒的 $f$ 都对应一个真实可行的流（构造性：把这些值当成每条边的流量即可）→ LP 的可行域 $\\supseteq$ 全部可行流。'},
      {zh:'反过来任一流都满足这些线性约束 → 可行域 $\\subseteq$ 全部可行流。两个方向合起来：**可行域完全相同**。'},
      {zh:'目标函数 $\\sum_v f_{sv} - \\sum_v f_{vs}$ 在守恒约束下等于 $|f|$ → 最大化它就等于求最大流。'},
      {tex:'\\max\\ \\text{(源点净流出)} = |f^{*}| = 23',zh:'★★ C 程序 part 4 用单纯形法算得 23，与原书 Figure 24.1 的最大流一致；再用枚举割验证最小割同为 23 —— 这就是原书 p.866 说的"第 24 章的最大流最小割定理是（强）对偶的一个实例"。∎'}]},
     ],
    note:''},
   {type:'prove',title:'最短路 LP 的正确性：上界逼到最紧',statement:'You might be surprised that this linear program max imizes an objective function when it is supposed to compute shortest paths. Mini mizing the objective function would be a mistake, because',
    page:861,
    intro:'★ 要证两件事：任何可行解给出的 $d_t$ 都**不超过**真实最短路；而真实最短路本身是可行解。合起来 $\\max d_t$ 就等于最短路。',
    steps:[
     {title:'① 可行解不会超过最短路',en:'one for each vertex v 2 V . It also has |E| + 1 constraints: one for each edge, plus the additional constraint that the source vertex’s shortest-path weight always has the value 0.',
      page:861,
      body:['设 $s = v_0 \\to v_1 \\to \\dots \\to v_k = t$ 是任意一条从 $s$ 到 $t$ 的路径。',
        '把路径上每条边的约束 $d_{v_i} \\le d_{v_{i-1}} + w(v_{i-1}, v_i)$ 相加，中间项相消。',
        '得 $d_t \\le d_s + \\sum_i w(v_{i-1}, v_i) = 0 + $ 该路径的权 → $d_t$ 不超过**任何**路径，特别是不超过最短路。']},
     {title:'② 最短路本身可行',en:'We can formulate the single-source shortest-paths problem as a linear program.',
      page:861,
      body:['取 $d_v = \\delta(s,v)$（真实最短路径权）。对每条边 $(u,v)$，三角不等式 $\\delta(s,v) \\le \\delta(s,u) + w(u,v)$ 恰好就是约束。',
        '$\\delta(s,s) = 0$ 满足 $d_s = 0$（非负权时）。于是它可行，并且目标值 $= \\delta(s,t)$。',
        '★ 两个方向夹起来：$\\max d_t = \\delta(s,t)$。这也是"约束给出上界、最大化把它们逼紧"这句话的严格版本。']},
     {title:'③ 为什么在 29.2 里只写成模型',en:'The only known polynomial-time algorithm for this problem expresses it as a linear program and then solves it with a polynomial-time linear-programming algorithm.',
      page:865,
      body:['对最短路这种"有组合算法"的问题，直接跑 Dijkstra / Bellman-Ford 更快（$O(E \\lg V)$ 对一般 LP 求解器是碾压）。',
        'LP 写法的价值在**没有专门算法**的问题上 —— 多商品流就是原书举的例子。',
        '★ 反过来说：差分约束系统（原书 22.4）的存在告诉我们这个 LP 的对偶里藏着 Bellman-Ford。∎']},
    ],conclusion:'★ 结论：一个问题的 LP 写法要能"双向翻译" —— 任何可行解都对应原问题的候选解，任何原问题的解都可行。C 程序 part 4 对最大流的可行域做的正是这种双向检查（逐条验证容量与守恒）。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'最大流的 LP 里，中间顶点的守恒写成了什么？',options:['不等式 $f \\le c$','**一对反向不等式（等价于等式）**','目标函数','松弛变量的非负性'],answer:1,
      why:'★ 单纯形法只吃 $\\le$ 型约束，所以 $= 0$ 要写成两个 $\\le 0$；C 程序 part 4 的 8 行就是这么来的。'},
     {kind:'single',q:'最短路 LP 的目标为什么是 $\\max d_t$？',options:['因为距离要最大','**约束只给上界，最大化把上界逼到最紧**','为了让单纯形收敛','因为权重非负'],answer:1,
      why:'★ 原书 p.861 特别提醒：反过来最小化在非负权时会被平凡地打到 0。'},
     {kind:'judge',q:'C 程序 part 5 里二分图匹配的 LP 松弛给出了整数解。',answer:true,
      why:'★ 6 条边的 $x_e$ 全是 0/1 —— 但这是二分图的性质（系数矩阵全幺模）。'},
     {kind:'judge',q:'同一条匹配松弛用在三角形 $K_3$ 上也给出整数解。',answer:false,
      why:'★ 给出 1.5（每条边 0.5），整数匹配最多 1 —— 这就是对照实验的意义。'},
     {kind:'simulate',q:'C 程序 part 4 的最大流 LP 最优值是多少？（填整数）',expect:[23],placeholder:'例如：20',
      why:'23 —— 与原书 Figure 24.1 的答案一致，且暴力枚举 16 个割得最小割同为 23。'},
     {kind:'simulate',q:'C 程序 part 5 里二分图匹配的 LP 松弛最优值是多少？（填整数）',expect:[3],placeholder:'例如：2',why:'★ code 段实测 3，而且解本身是 0/1 —— 松弛恰好紧。'},
     {kind:'simulate',q:'同一个匹配松弛用在三角形 $K_3$ 上的最优值是多少（填一位小数）？',expect:[1.5],placeholder:'例如：1.0',why:'★ code 段实测 1.5（非整）—— 所以匹配的 LP 松弛只对二分图紧，这正是 24.3 归约能成立的关键。'},
     {kind:'single',q:'多商品流写法的约束条数是多少？',options:['$|E| + 1$','**$2|V|^{2} + |V| - 2$**','$|V| + |E| + 1$','$|V|^{2}$'],answer:1,why:'★ analyze 第二条：变量与约束规模随商品数放大，所以目前只有「直接解 LP」这条多项式路线。'},
    ],bookExercises:[
     {id:'29.2-1',page:865,star:0,statement:'Write out explicitly the linear program corresponding to finding the shortest path from vertex s to vertex x in Figure 22.2(a) on page 609.',hint:'照 C 程序 part 4 的建表法：每条边一个约束行 $d_v \\le d_u + w$，$d_s = 0$ 用两条反向不等式；决策变量取 $d_v$ 的自由部分。'},
     {id:'29.2-3',page:865,star:0,statement:'Write out explicitly the linear program corresponding to finding the maximum flow in Figure 24.1(a).',hint:'把 C 程序 part 4 的 9 条容量行按图抄出来（16,13,12,4,14,9,20,7,4），守恒行四个中间顶点各两条 —— 解出来应该是 23。'},
     {id:'29.2-5',page:865,star:0,statement:'Write a linear program that, given a bipartite graph G = (V,E), solves the maxi- mum-bipartite-matching problem.',hint:'就是 C 程序 part 5：变量 $x_e \\ge 0$，两侧顶点各一条度约束 $\\sum_e x_e \\le 1$，目标 $\\max \\sum_e x_e$；再补一问：为什么这里不会出现 K3 那样的分数解？'},
    ]},
  ],
};
