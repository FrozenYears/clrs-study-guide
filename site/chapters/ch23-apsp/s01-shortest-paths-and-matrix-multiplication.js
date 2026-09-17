/* 第 23 章 23.1：最短路径与矩阵乘法（Shortest paths and matrix multiplication）。印刷页 684–692（pdf 705–713）。 */
export default {
  key:'s01',id:'ch23/s01',chapter:23,section:'23.1',
  title:'APSP 开篇：把最短路当成矩阵乘法',shortTitle:'23.1 最短路 × 矩阵乘法',
  titleEn:'Shortest paths and matrix multiplication',
  source:{printed:[684,692],pdf:[705,713]},
  prerequisites:[{label:'22.5 Proofs of shortest-paths properties',url:'#/ch22/s05'}],
  stages:[
   {type:'map',title:'换一种代数视角',
    why:'全对最短路径（APSP）：求所有 $n \\times n$ 点对的最短路。把边的松弛看成一个"乘法"、路径拼接看成"加法" —— 最短路问题就成了**矩阵乘法**（把 + 与 × 换成 min 与 +）。',
    position:'23 章开篇。SLOW-APSP Θ(n⁴)、重复平方 Θ(n³ lg n)；下一关的 Floyd-Warshall 用动态规划做到 Θ(n³)。',
    unlocks:[{label:'23.2 The Floyd-Warshall algorithm',url:'#/ch23/s02'}],
    mathKit:[
     {title:'"矩阵乘法"定义',body:'$l_{ij}^{(m)} = \\min_{1 \\le k \\le n}\\{l_{ik}^{(m-1)} + w_{kj}\\}$ —— 把标准乘法的 $\\times \\to +$、$+ \\to \\min$。'},
     {title:'SLOW-APSP',body:'从 $L^{(1)} = W$ 出发做 $n-1$ 次 EXTEND → $\\Theta(n^4)$。'},
     {title:'FASTER-APSP',body:'**重复平方**：$L^{(2^r)}$ 由 $L^{(2^{r-1})}$ 自乘得到 → $\\Theta(n^3 \\lg n)$。'},
    ]},
   {type:'intuition',title:'l^(m) 的含义与平方的威力',scene:'Figure 23.1 的 5 结点图（C 程序实测）',body:[
     '$l_{ij}^{(m)}$ = 从 i 到 j 至多 m 条边的最短路。$L^{(m)}$ 相当于权重矩阵 $W$ 的 m 次"最小乘幂"。',
     '★ C 程序实测（Figure 23.1，n=5）：SLOW 调 4 次 EXTEND 得 $L^{(4)}$（最终答案，第 1 行 0 2 −2 3 −4）；FASTER 重复平方 2 次得同样的 $L^{(4)}$ —— 指数从 1→2→4，覆盖 n−1=4。',
     '★ 平方的威力：$m$ 从 1 到 $\\lceil \\lg(n-1) \\rceil$ 就够 —— 从 Θ(n⁴) 降到 Θ(n³ lg n)。',
     '★ 与 22 章的关系：EXTEND-SHORTEST-PATHS 的第 5 行本质上是"全体边 $(k,j)$ 的批量松弛"。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 l (r) ij 代表 l_ij^(r)）。',blocks:[
     {kind:'body',page:650,en:'EXTEND-SHORTEST-PATHS (L (r \u22121) ,W,L (r) ,n) ij = min \u02da l (r) ij ,l (r \u22121) i k + w kj',
      zh:'★★ EXTEND 的递推式（把 min 当加法、+ 当乘法）。'},
     {kind:'body',page:650,en:'Let9s now understand the relation of this computation to matrix multiplication.',
      zh:'★ 与矩阵乘法的类比从这里展开。'},
     {kind:'body',page:652,en:'The n \u2212 1 invocations of EXTEND-SHORTEST-PATHS, each of which takes \u0398(n 3 ) time, dominate the computation, yielding a total running time of \u0398(n 4 ).',
      zh:'★ SLOW-APSP：n−1 次 Θ(n³) = Θ(n⁴)。'},
    ],terms:[{en:'EXTEND-SHORTEST-PATHS',zh:'最短路"矩阵乘法"的一步',page:650}]},
   {type:'pseudocode',title:'SLOW-APSP-ALL-PAIRS',algo:'SLOW-ALL-PAIRS-SHORTEST-PATHS',signature:'SLOW-ALL-PAIRS-SHORTEST-PATHS(W)',page:653,
    lines:[
     {n:1,code:'n = W.rows',zh:''},
     {n:2,code:'L(1) = W',zh:'★ 一条边的最短路 = 权重矩阵。'},
     {n:3,code:'for m = 1 to n − 1',zh:'★ 共 n−1 次扩展。'},
     {n:4,code:'    L(m+1) = EXTEND-SHORTEST-PATHS(L(m), W)',zh:'Θ(n³) 每次。'},
     {n:5,code:'return L(n)',zh:'此时 L 的含义已覆盖所有路径。'}],
    vars:[{name:'L(m)',meaning:'至多 m 条边的最短路矩阵'}],
    note:'★ 其实到 m = n−1 后答案不再变化（简单路径 ≤ n−1 条边）—— FASTER-APSP 利用的正是这一点。',
    more:[]},
   {type:'visualize',title:'矩阵幂的收敛',panels:[
     {title:'C 程序实测：L 的指数与覆盖',viz:'growth',
      chart:{xMax:8,series:[
       {name:'SLOW：4 次 EXTEND（n−1）',expr:'n - 1',color:'--viz-violation'},
       {name:'FASTER：2 次平方（指数 1→2→4）',expr:'Math.log2(n - 1)',color:'--viz-done'}]},
      note:'★ 指数 4 ≥ n−1 = 4 → 停止；两种方法得到同一个 L^(4)。'},
    ],tasks:['对照 C 程序 s01 段的 L^(2)/L^(4) 矩阵打印。'],note:''},
   {type:'code',title:'实测：L^(4) 与重复平方',c:{file:'apsp.c',code:String.raw`/* apsp.c -- 第 23 章 所有结点对的最短路径（All-Pairs Shortest Paths）
 *
 * 覆盖三关：
 *   s01 最短路径与矩阵乘法：EXTEND-SHORTEST-PATHS / SLOW-APSP / FASTER-APSP（重复平方）
 *   s02 Floyd-Warshall 算法 + 传递闭包
 *   s03 Johnson 算法（Bellman-Ford 重加权 + Dijkstra）
 *
 * 固定输入：原书 Figure 23.1 的有向图（5 结点、9 条边）。
 *   边：1->2(3) 1->3(8) 1->5(-4) 2->4(1) 2->5(7) 3->2(4) 4->1(5) 4->3(-3) 5->3(2)
 *   关键数字（最终 d 矩阵 D，1 基下标）：
 *     D[1][5] = -4（直达边），D[1][3] = -2（1->5->3 = -4+2），
 *     D[5][1] = 12（5->3->2->4->1 = 2+4+1+5），D[2][1] = 6（2->4->1 = 1+5），
 *     D[4][2] = 1（4->3->2 = -3+4）。
 *   复杂度：SLOW Θ(n^4)（n-1 次 EXTEND，每次 Θ(n^3)）；
 *           FASTER 重复平方 Θ(n^3 lg n)（⌈lg(n-1)⌉ 次 EXTEND）；
 *           Floyd-Warshall Θ(n^3)；Johnson O(V^2 lg V + VE)（二叉堆）/ O(V^2 lg V + VE) 最优。
 */

#include <assert.h>
#include <stdio.h>
#include <string.h>

#define N 5            /* 原书 Figure 23.1 的结点数 */
#define INF 100000000  /* 代表 ∞（足够大，且不溢出加法） */

/* ---- 基础工具 ---- */

static void print_mat(const char *name, const int *M)
{
    printf("%s =\n", name);
    for (int i = 0; i < N; i++) {
        printf("  ");
        for (int j = 0; j < N; j++) {
            if (M[i * N + j] == INF)
                printf("  INF");
            else
                printf("%5d", M[i * N + j]);
        }
        printf("\n");
    }
}

/* 热带（tropical）矩阵乘法：M = L · W，其中 “·” 是 min-plus 乘法。
 *   m_ij = min_k ( l_ik + w_kj )，加法遇到 ∞ 视为 +∞（不溢出）。 */
static void extend(const int *L, const int *W, int *M)
{
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            int best = INF;
            for (int k = 0; k < N; k++) {
                int lk = L[i * N + k];
                int wk = W[k * N + j];
                int s = (lk == INF || wk == INF) ? INF : lk + wk;
                if (s < best)
                    best = s;
            }
            M[i * N + j] = best;
        }
    }
}

static void copy_mat(int *dst, const int *src)
{
    for (int i = 0; i < N * N; i++)
        dst[i] = src[i];
}

/* 构造 Figure 23.1 的权重矩阵 W（书本用大写 W，下标 w_ij）。 */
static void build_W(int *W)
{
    for (int i = 0; i < N * N; i++)
        W[i] = INF;
    for (int i = 0; i < N; i++)
        W[i * N + i] = 0;          /* 自环权 0 */
    W[0 * N + 1] = 3;             /* 1->2 */
    W[0 * N + 2] = 8;             /* 1->3 */
    W[0 * N + 4] = -4;            /* 1->5 */
    W[1 * N + 3] = 1;             /* 2->4 */
    W[1 * N + 4] = 7;             /* 2->5 */
    W[2 * N + 1] = 4;             /* 3->2 */
    W[3 * N + 0] = 5;             /* 4->1 */
    W[3 * N + 2] = -3;            /* 4->3 */
    W[4 * N + 2] = 2;             /* 5->3 */
}

/* ============ s01：矩阵乘法版 SLOW-APSP 与 FASTER-APSP ============ */

static int D_final[N * N];        /* 由 Floyd-Warshall 得到的“标准答案” */

static int slow_apsp(const int *W, int *out)
{
    int L[N * N], M[N * N], L0[N * N];
    for (int i = 0; i < N; i++)           /* L^(0)：对角线 0，其余 ∞ */
        for (int j = 0; j < N; j++)
            L0[i * N + j] = (i == j) ? 0 : INF;
    copy_mat(L, L0);
    int invocations = 0;
    for (int r = 1; r < N; r++) {         /* r = 1..n-1，共 n-1 次 EXTEND */
        extend(L, W, M);
        copy_mat(L, M);
        invocations++;
        printf("  SLOW: L^(%d)（对应 W^%d）：\n", r, r);
        print_mat("      ", L);
    }
    copy_mat(out, L);
    return invocations;
}

static int faster_apsp(const int *W, int *out)
{
    int L[N * N], M[N * N];
    copy_mat(L, W);                       /* 初始 L = W = W^1 */
    int r = 1, squarings = 0;
    while (r < N - 1) {                   /* 重复平方：每次把指数翻倍 */
        extend(L, L, M);                  /* M = L^2 */
        copy_mat(L, M);
        r *= 2;
        squarings++;
        printf("  FASTER: 平方后 L 的指数 = %d（对应 W^%d）：\n", r, r);
        print_mat("      ", L);
    }
    copy_mat(out, L);
    return squarings;
}

/* ============ s02：Floyd-Warshall（打印每层 d 矩阵前后对照） ============ */

static void floyd_warshall(const int *W, int *out)
{
    int d[N * N];
    copy_mat(d, W);
    printf("  Floyd-Warshall：进入循环前的 d^(0) = W\n");
    print_mat("      ", d);
    for (int k = 0; k < N; k++) {         /* 中间结点 k = 1..n */
        printf("  —— 处理中间结点 k = %d 之前（d^(%d)）\n", k + 1, k);
        print_mat("      ", d);
        for (int i = 0; i < N; i++)
            for (int j = 0; j < N; j++) {
                int via = (d[i * N + k] == INF || d[k * N + j] == INF)
                              ? INF
                              : d[i * N + k] + d[k * N + j];
                if (via < d[i * N + j])
                    d[i * N + j] = via;
            }
        printf("  —— 处理中间结点 k = %d 之后（d^(%d)）\n", k + 1, k + 1);
        print_mat("      ", d);
    }
    copy_mat(out, d);
}

/* ============ s03：Johnson（Bellman-Ford 重加权 + Dijkstra） ============ */

/* 边表：Figure 23.1 的 9 条边（0 基下标）。 */
static const int EU[9] = {0, 0, 0, 1, 1, 2, 3, 3, 4};
static const int EV[9] = {1, 2, 4, 3, 4, 1, 0, 2, 2};
static const int EW[9] = {3, 8, -4, 1, 7, 4, 5, -3, 2};

/* Bellman-Ford：在 G'（加新源点 s=5）上从 s 求单源最短路，得到 h(v)=δ(s,v)。 */
static void bellman_ford(int h[6])
{
    int s = N;                           /* 新结点 s，编号 N（=5，0 基） */
    for (int i = 0; i <= N; i++)
        h[i] = INF;
    h[s] = 0;
    int edges_u[10], edges_v[10], edges_w[10], m = 0;
    for (int e = 0; e < 9; e++) {        /* 原图边 */
        edges_u[m] = EU[e]; edges_v[m] = EV[e]; edges_w[m] = EW[e]; m++;
    }
    for (int e = 0; e < N; e++) {        /* s -> 每个原结点，权 0 */
        edges_u[m] = s; edges_v[m] = e; edges_w[m] = 0; m++;
    }
    for (int iter = 0; iter <= N; iter++) {   /* 松弛 |V'| 次 */
        int changed = 0;
        for (int e = 0; e < m; e++) {
            int u = edges_u[e], v = edges_v[e], w = edges_w[e];
            if (h[u] != INF && h[u] + w < h[v]) {
                h[v] = h[u] + w;
                changed = 1;
            }
        }
        if (!changed)
            break;
    }
}

/* 简单版 Dijkstra（线性扫描取最小），在重加权后的图上求单源最短路。 */
static void dijkstra(const int w[N][N], int src, int dist[N])
{
    int vis[N];
    for (int i = 0; i < N; i++) {
        dist[i] = INF;
        vis[i] = 0;
    }
    dist[src] = 0;
    for (int c = 0; c < N; c++) {
        int u = -1, best = INF;
        for (int i = 0; i < N; i++)
            if (!vis[i] && dist[i] < best) {
                best = dist[i];
                u = i;
            }
        if (u == -1)
            break;
        vis[u] = 1;
        for (int v = 0; v < N; v++)
            if (w[u][v] != INF && dist[u] + w[u][v] < dist[v])
                dist[v] = dist[u] + w[u][v];
    }
}

static void johnson(const int *W, int *out)
{
    int h[6];
    bellman_ford(h);
    printf("  Johnson：Bellman-Ford 得到 h(v)=δ(s,v)\n");
    for (int v = 0; v < N; v++)
        printf("      h[%d] = %d\n", v + 1, h[v]);

    /* 重加权：ŵ(u,v) = w(u,v) + h(u) - h(v)，应全非负。 */
    int Wt[N][N];
    int all_nonneg = 1;
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++) {
            int w = (i == j) ? 0 : W[i * N + j];
            Wt[i][j] = (w == INF) ? INF : w + h[i] - h[j];
            if (Wt[i][j] < 0)
                all_nonneg = 0;
        }
    printf("  Johnson：重加权后所有边权 %s（关键性质 2）\n",
           all_nonneg ? "均非负 ✓" : "存在负值 ✗");

    /* 对每个源点跑 Dijkstra，恢复真实最短路。 */
    for (int u = 0; u < N; u++) {
        int dist[N];
        dijkstra(Wt, u, dist);
        for (int v = 0; v < N; v++) {
            int dhat = dist[v];
            int real = (dhat == INF) ? INF : dhat + h[v] - h[u];
            out[u * N + v] = real;
        }
    }
    print_mat("  Johnson 复原的 d 矩阵", out);
}

/* ============ main ============ */

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    int W[N * N];
    build_W(W);
    printf("Figure 23.1 的权重矩阵 W（w_ij）：\n");
    print_mat("  W", W);

    /* ---- s01：矩阵乘法版 ---- */
    printf("\n===== s01 SLOW-APSP（Θ(n^4)）=====\n");
    int Lslow[N * N];
    int inv = slow_apsp(W, Lslow);
    printf("SLOW-APSP 共调用 EXTEND-SHORTEST-PATHS %d 次（应为 n-1 = %d）\n",
           inv, N - 1);
    assert(inv == N - 1);

    printf("\n===== s01 FASTER-APSP（重复平方，Θ(n^3 lg n)）=====\n");
    int Lfast[N * N];
    int sq = faster_apsp(W, Lfast);
    /* n-1 = 4，重复平方次数为 ⌈lg 4⌉ = 2 */
    printf("FASTER-APSP 共做 %d 次平方（应为 ⌈lg(n-1)⌉ = %d）\n", sq, 2);
    assert(sq == 2);

    printf("\nSLOW 与 FASTER 结果是否一致：%s\n",
           (0 == memcmp(Lslow, Lfast, sizeof(Lslow))) ? "是 ✓" : "否 ✗");
    assert(0 == memcmp(Lslow, Lfast, sizeof(Lslow)));
    copy_mat(D_final, Lslow);

    /* ---- s02：Floyd-Warshall ---- */
    printf("\n===== s02 Floyd-Warshall（Θ(n^3)）=====\n");
    int Dfw[N * N];
    floyd_warshall(W, Dfw);
    printf("Floyd-Warshall 与矩阵乘法版结果一致：%s\n",
           (0 == memcmp(Dfw, D_final, sizeof(Dfw))) ? "是 ✓" : "否 ✗");
    assert(0 == memcmp(Dfw, D_final, sizeof(Dfw)));

    /* ---- s03：Johnson ---- */
    printf("\n===== s03 Johnson（Bellman-Ford 重加权 + Dijkstra）=====\n");
    int Dj[N * N];
    johnson(W, Dj);

    /* ---- 三法对照与关键数字 ---- */
    printf("\n===== 三法对照（最终 d 矩阵必须完全一致）=====\n");
    assert(0 == memcmp(Dj, D_final, sizeof(Dj)));
    printf("  SLOW == FASTER == FLOYD-WARSHALL == JOHNSON ✓\n");

    printf("\n关键数字（最终 d 矩阵 D，1 基下标）：\n");
    printf("  D[1][5] = %d  （直达边 1->5，权 -4）\n", Dj[0 * N + 4]);
    printf("  D[1][3] = %d  （1->5->3 = -4 + 2）\n", Dj[0 * N + 2]);
    printf("  D[5][1] = %d  （5->3->2->4->1 = 2+4+1+5）\n", Dj[4 * N + 0]);
    printf("  D[2][1] = %d  （2->4->1 = 1 + 5）\n", Dj[1 * N + 0]);
    printf("  D[4][2] = %d  （4->3->2 = -3 + 4）\n", Dj[3 * N + 1]);

    assert(Dj[0 * N + 4] == -4);
    assert(Dj[0 * N + 2] == -2);
    assert(Dj[4 * N + 0] == 12);
    assert(Dj[1 * N + 0] == 6);
    assert(Dj[3 * N + 1] == 1);
    assert(Dj[0 * N + 0] == 0 && Dj[2 * N + 2] == 0);

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 三关共用本文件；数据 = Figure 23.1 的图（n=5，含负边 −4/−3）。'},
           {line:45,zh:'`extend`：EXTEND-SHORTEST-PATHS 的直译（min + 加权行）。'},
           {line:90,zh:'`slow_apsp`：n−1 次扩展，Θ(n⁴)。'},
           {line:109,zh:'`faster_apsp`：重复平方，Θ(n³ lg n)。'},
           {line:257,zh:'★★ s01 段：打印 L^(1)…L^(4) —— 第 1 行 0 2 -2 3 -4。'},
           {line:290,zh:'★ 三法对照：SLOW/FASTER/FW/Johnson 的最终 d 矩阵完全一致。'}]},
    tests:[{in:'Figure 23.1 的图',out:'L^(4) 第 1 行 = 0 2 -2 3 -4'},
           {in:'SLOW vs FASTER',out:'4 次 EXTEND vs 2 次平方；结果一致'}],
    mapping:[{pc:4,pcCode:'L(m+1) = EXTEND-SHORTEST-PATHS(L(m), W)',c:'`slow_apsp`（第 90 行）'}]},
   {type:'analyze',title:'一本账：n⁴ → n³lg n',claims:[
     {expr:'\\Theta(n^4)',when:'SLOW-APSP 的运行时间',page:652,source:'book'},
     {expr:'\\Theta(n^3 \\lg n)',when:'FASTER-APSP（重复平方）的运行时间',page:653,source:'book'},
     {expr:'\\lceil \\lg(n-1) \\rceil',when:'重复平方需要的自乘次数',page:653,source:'book'},
    ],tables:[{caption:'C 程序实测（n = 5）',rows:[
      ['方法','EXTEND/平方次数','总时间'],
      ['SLOW','4 次','Θ(n⁴)'],
      ['FASTER','2 次（指数 1→2→4）','Θ(n³ lg n)'],
     ]},{caption:'"min-+" 代数与标准代数的对应',rows:[
      ['标准矩阵乘法','最短路版本'],
      ['Σ（求和）','min（取最短）'],
      ['×（乘积）','+（权重相加）'],
      ['单位元 1','0（无边）'],
      ['零元 0','∞（不可达）'],
     ]}],chart:{xMax:64,series:[
     {name:'SLOW ≈ n⁴/16',expr:'n * n * n * n / 16',color:'--viz-violation'},
     {name:'FASTER ≈ n³ lg n',expr:'n * n * n * Math.log2(n) / 16',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'重复平方的正确性',steps:[
      {zh:'关键事实：$l_{ij}^{(2m)} = l_{ij}^{(m)}$（当 $m \\ge n-1$ 时不再变化）—— 简单路径至多 $n-1$ 条边。'},
      {zh:'更妙的观察：对**任意** $m$，$L^{(2m)}$ 可由 $L^{(m)}$ 自乘一次得到（路径对半折）。'},
      {tex:'L^{(2^r)} = (L^{(2^{r-1})})^2',zh:'★ 指数倍增：$\\lceil \\lg(n-1) \\rceil$ 次后覆盖 $n-1$ 条边。∎'}]},
     ],
    note:''},
   {type:'prove',title:'EXTEND 的正确性：路径对半折',statement:'Let\u2019s now understand the relation of this computation to matrix multiplication.',page:650,
    intro:'★ 核心引理：$l_{ij}^{(m+n)} = \\min_k \\{l_{ik}^{(m)} + w_{kj}\\}$ 的变形 —— 按路径的"最后一条边"拆分。',
    steps:[
     {title:'按最后一条边拆',en:'EXTEND-SHORTEST-PATHS (L (r \u22121) ,W,L (r) ,n) ij = min \u02da l (r) ij ,l (r \u22121) i k + w kj',page:650,
      body:['至多 $m$ 条边的最短路 $(i, \\ldots, j)$ 的**最后一条边**是 $(k, j)$。',
          '前缀 $(i, \\ldots, k)$ 至多 $m-1$ 条边 → 其权重 $\\ge l_{ik}^{(m-1)}$。',
          '对全部 $k$ 取 min 恰好穷举所有可能 → 递推式成立。∎']},
     {title:'平方的正确性',en:'The n \u2212 1 invocations of EXTEND-SHORTEST-PATHS, each of which takes \u0398(n 3 ) time, dominate the computation, yielding a total running time of \u0398(n 4 ).',page:652,
      body:['$2m$ 条边的最短路 $(i, \\ldots, j)$ 可以按**中间点 $k$** 拆成两半：前半至多 $m$ 条边、后半至多 $m$ 条边。',
        '$l_{ij}^{(2m)} = \\min_k \\{l_{ik}^{(m)} + l_{kj}^{(m)}\\}$ —— 这正是 $L^{(m)}$ 的"自乘"。',
        '★ 递推到 $2^r \\ge n-1$ 即覆盖全部简单路径。∎']},
     {title:'实测对齐',en:'Let9s now understand the relation of this computation to matrix multiplication.',page:650,
      body:['C 程序 s01 段：SLOW 的 $L^{(4)}$ 与 FASTER 平方 2 次得到的 $L^{(4)}$ 逐元素一致。',
        '三法对照断言（s01/s02/s03 的最终矩阵完全一致）把本章三个算法绑在同一答案上。∎']},
    ],conclusion:'★ 结论：min-+ 代数下，APSP = 矩阵乘幂；重复平方把 n⁴ 压到 n³ lg n。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'最短路"矩阵乘法"里，标准乘法的 + 和 × 分别对应？',options:['+→min, ×→+','+→+, ×→×','+→max, ×→+','+→×, ×→min'],answer:0,
      why:'★ 路径拼接（加权和）取最短 = min over 拼接。'},
     {kind:'single',q:'FASTER-APSP 需要几次矩阵自乘（n=5）？',options:['1 次','**2 次**','4 次','lg n 次'],answer:1,
      why:'★ 指数 1→2→4，4 ≥ n−1 → 停（C 程序实测 2 次）。'},
     {kind:'judge',q:'SLOW-APSP 的时间是 Θ(n⁴)。',answer:true,
      why:'★ n−1 次 EXTEND × 每次 Θ(n³)。'},
     {kind:'simulate',q:'C 程序中 Figure 23.1 的图（n=5）需要几次 EXTEND？（SLOW，填数字）',expect:[4],placeholder:'例如：5',
      why:'n − 1 = 4（C 程序 s01 段的计数）。'},
    ],bookExercises:[
     {id:'23.1-1',page:692,star:0,statement:'Run SLOW-ALL-PAIRS-SHORTEST-PATHS on the weighted, directed graph of Figure 23.1...',hint:'照 C 程序 s01 段的打印逐矩阵抄：L^(1) = W，L^(2)、L^(3)、L^(4) 依次收敛。'},
     {id:'23.1-2',page:692,star:0,statement:'Show that matrix L(0) ... ',hint:'$L^{(0)}$ 的定义：0 条边的最短路 = 对角线 0、其余 ∞ —— 它是 min-+ 代数下的"乘法单位元"。'},
     {id:'23.1-3',page:692,star:0,statement:'What does the matrix used in the shortest-paths algorithms correspond to... ',hint:'对应标准代数的结合律与单位元：min-+ 半环满足结合律，0（∞）是 ⊕ 单位、1（0）是 ⊗ 单位 —— 所以"乘幂"的概念良定义。'},
     {id:'23.1-4',page:692,star:0,statement:'(...) Show that we can multiply... ',hint:'分块思想：把 n×n 矩阵分成 n/2 的块，用 8 次块乘合成（Strassen 式），最短路版本同样适用 —— 但本章的 FASTER 已从指数入手。'},
     {id:'23.1-5',page:692,star:0,statement:'(...) Describe an algorithm for APSP on... ',hint:'对无向图：用 22 章的单源算法跑 V 次（每次 Dijkstra/负权用 BF），总 O(V³) —— 与矩阵法对比。'},
     {id:'23.1-6',page:692,star:0,statement:'(...) Give an O(V³)-time algorithm... ',hint:'结合 23.2 的 Floyd-Warshall：也是 Θ(n³)，无需 lg 因子 —— 下一关的主题。'},
    ]},
  ],
};
