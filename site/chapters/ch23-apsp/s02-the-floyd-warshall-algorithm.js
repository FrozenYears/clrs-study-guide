/* 第 23 章 23.2：Floyd-Warshall 算法（The Floyd-Warshall algorithm）。印刷页 693–700（pdf 714–721）。 */
export default {
  key:'s02',id:'ch23/s02',chapter:23,section:'23.2',
  title:'Floyd-Warshall：按"允许的中间点"DP',shortTitle:'23.2 Floyd-Warshall',
  titleEn:'The Floyd-Warshall algorithm',
  source: { printed: [655, 661], pdf: [676, 683] },
  prerequisites:[{label:'23.1 Shortest paths and matrix multiplication',url:'#/ch23/s01'}],
  stages:[
   {type:'map',title:'换一个 DP 维度：允许的中间点集合',
    why:'Floyd-Warshall 的状态是 $d_{ij}^{(k)}$ = "只允许以 $\\{1..k\\}$ 为中间点时 $i \\to j$ 的最短路"。递推：$k$ 要么不在路上（$d^{(k-1)}$），要么经过一次（$d_{ik}^{(k-1)} + d_{kj}^{(k-1)}$）。三重循环 Θ(n³)、原地更新。',
    position:'23.1 的矩阵视角（按边数）换成"按中间点集合"的 DP 视角 —— 同样 Θ(n³) 级但常数更小、无 lg 因子。它也能求传递闭包。',
    unlocks:[{label:'23.3 Johnson\u2019s algorithm for sparse graphs',url:'#/ch23/s03'}],
    mathKit:[
     {title:'递推式',body:'$d_{ij}^{(k)} = \\min(d_{ij}^{(k-1)},\\ d_{ik}^{(k-1)} + d_{kj}^{(k-1)})$。'},
     {title:'复杂度',body:'三重循环 → $\\Theta(n^3)$ 时间；原地更新 → $\\Theta(n^2)$ 空间。'},
     {title:'负权',body:'允许负权边；**负环检测**：算法结束后 $d_{ii} < 0$ 的对角元。'},
    ]},
   {type:'intuition',title:'k 只"经过一次"',scene:'Figure 23.1 的图（C 程序实测）',body:[
     '递推的两种情形：最短路要么不经过 $k$（沿用 $d^{(k-1)}$），要么经过 $k$ **恰好一次**（拆成 $i \\to k$ 与 $k \\to j$ 两段，各自只允许 $\u2009\\{1..k-1\\}$ 中间点）。',
     '★ 经过两次 $k$ 不可能更短 —— 负环除外。这就是递推式的完备性。',
     '★ 原地更新（直接写 $d_{ij}$）依然正确：$d_{ik}^{(k)} = d_{ik}^{(k-1)}$（对角线与 k 行/列不变）。',
     '★ C 程序实测：Figure 23.1 上 Floyd-Warshall 的最终矩阵与 SLOW/FASTER/Johnson **逐元素一致** —— 三法对照断言。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 √2 代表路径 p²）。',blocks:[
     {kind:'body',page:656,en:'\u221a2 : all intermediate vertices in f1,2,\u2026,k \u2212 1g \u221a1 : all intermediate vertices in f1,2,\u2026,k \u2212 1g',
      zh:'★ 分解图示：路径 p 拆成 p¹（i→k）与 p²（k→j），中间点集合相同。'},
     {kind:'body',page:656,en:'\u2022 If k is an intermediate vertex of path p, then decompose p into i',
      zh:'★ 情形一：k 是中间点 → 拆成两段。'},
     {kind:'body',page:656,en:'Therefore \u221a1 is a shortest path from i to k with all intermediate vertices in the set f1,2,\u2026,k \u2212 1g. Likewise, \u221a2 is a shortest path from vertex k to vertex j with all intermediate vertices in the set f1,2,\u2026,k \u2212 1g.',
      zh:'★ 两段子路径各自都是"新限制下"的最短路 —— 最优子结构。'},
     {kind:'body',page:657,en:'Because for any path, all intermediate vertices belong to the set f1,2,\u2026,n g, the matrix = (n) = \u00e3 d (n) ij \u00e4 gives the final answer: d (n) ij = i(i,j) for all i,j 2 V .',
      zh:'★ 终态：$D^{(n)}$ 就是答案（语料的 i(i,j) 代表 δ(i,j)）。'},
    ],terms:[{en:'Floyd-Warshall',zh:'Floyd-Warshall 算法',page:657},
              {en:'intermediate vertex',zh:'中间顶点',page:656}]},
   {type:'pseudocode',title:'FLOYD-WARSHALL：3 行',algo:'FLOYD-WARSHALL',signature:'FLOYD-WARSHALL(W)',page:657,
    lines:[
     {n:1,code:'D(0) = W',zh:'★ k = 0：不允许任何中间点 = 直接边。'},
     {n:2,code:'for k = 1 to n',zh:'★★ 逐个"开放"中间点 k。'},
     {n:3,code:'    for i = 1 to n',zh:''},
     {n:4,code:'        for j = 1 to n',zh:''},
     {n:5,code:'            d_ij^(k) = min(d_ij^(k-1), d_ik^(k-1) + d_kj^(k-1))',zh:'★★ 原地更新。'}],
    vars:[{name:'d_ij^(k)',meaning:'只允许 {1..k} 为中间点时 i→j 的最短路'}],
    note:'★ 三重循环 3 行 —— 与它 1976 年之前的"矩阵法 Θ(n³ lg n)"相比，这个 DP 是教科书级的简化。',
    more:[]},
   {type:'visualize',title:'每一层 k 开放一个中转站',panels:[
     {title:'C 程序实测：最终 d 矩阵（Figure 23.1 的图）',viz:'growth',
      chart:{xMax:16,series:[
       {name:'Floyd-Warshall Θ(n³)',expr:'n * n * n',color:'--viz-done'},
       {name:'FASTER Θ(n³ lg n)',expr:'n * n * n * Math.log2(n)',color:'--viz-compare'}]},
      note:'★ 同为 Θ(n³) 量级但 Floyd 无 lg 因子；且负权边（−4/−3）直接支持。'},
    ],tasks:['对照 C 程序 s02 段：每层 k 的 d 矩阵前后对照。'],note:''},
   {type:'code',title:'实测：三法同答案',c:{file:'apsp.c',code:String.raw`/* apsp.c -- 第 23 章 所有结点对的最短路径（All-Pairs Shortest Paths）
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 s02 段（Floyd-Warshall）。'},
           {line:128,zh:'`floyd_warshall`：三重循环原地更新。'},
           {line:277,zh:'★★ s02 段：打印每层 k 的 d 矩阵前后对照。'},
           {line:290,zh:'★ 三法对照：SLOW/FASTER/FW/Johnson 最终矩阵完全一致。'}]},
    tests:[{in:'Figure 23.1 的图',out:'Floyd-Warshall 最终矩阵 = SLOW/FASTER 的 L^(4)'},
           {in:'负环检测',out:'对角元 d_ii < 0 则有负环'}],
    mapping:[{pc:5,pcCode:'d_ij^(k) = min(d_ij^(k-1), d_ik^(k-1) + d_kj^(k-1))',c:'`int via = ...; if (via < d[...]) d[...] = via;`（第 139 行）'}]},
   {type:'analyze',title:'一本账：Θ(n³) 与传递闭包',claims:[
     {expr:'\\Theta(n^3)',when:'Floyd-Warshall 的运行时间',page:658,source:'book'},
     {expr:'d_{ii} < 0',when:'负环检测（对角元为负）',page:658,source:'book'},
     {expr:'\\Theta(n^3)',when:'传递闭包（布尔版 Floyd-Warshall）',page:660,source:'book'},
    ],tables:[{caption:'C 程序实测：Figure 23.1 的最终 d 矩阵',rows:[
      ['','1','2','3','4','5'],
      ['1','0','2','−2','3','−4'],
      ['2','6','0','−2','1','2'],
      ['3','10','4','0','5','6'],
      ['4','5','1','−3','0','1'],
      ['5','12','6','2','7','0'],
     ]},{caption:'23.1 vs 23.2 的视角切换',rows:[
      ['','矩阵法（23.1）','Floyd-Warshall（23.2）'],
      ['DP 状态','至多 m 条边','允许中间点 {1..k}'],
      ['递推','L 自乘','min(不经过 k, 经过 k)'],
      ['时间','Θ(n³ lg n)','Θ(n³)'],
      ['空间','Θ(n²)','Θ(n²)（原地）'],
     ]}],chart:{xMax:64,series:[
     {name:'Floyd-Warshall n³',expr:'n * n * n',color:'--viz-done'},
     {name:'逐对 Dijkstra(二叉堆) V·E lgV',expr:'n * n * Math.log2(n)',color:'--viz-compare'}]},
    derivations:[{kind:'summation',title:'递推式的完备性',steps:[
      {zh:'**情形一**：$p$ 不经过 $k$ → $p$ 本身就是"只允许 $\u2009\\{1..k-1\\}$"的最短路 → $d_{ij}^{(k-1)}$。'},
      {zh:'**情形二**：$p$ 经过 $k$（至多一次，无负环）→ 拆成 $i \\leadsto k \\leadsto j$，两段的中间点都落在 $\u2009\\{1..k-1\\}$ → 权和 $= d_{ik}^{(k-1)} + d_{kj}^{(k-1)}$。'},
      {tex:'d_{ij}^{(k)} = \\min\\left(d_{ij}^{(k-1)},\\ d_{ik}^{(k-1)} + d_{kj}^{(k-1)}\\right)',zh:'★ 两种情形取 min —— 没有第三种可能。∎'}]},
     ],
    note:''},
   {type:'prove',title:'递推式的正确性：按中间点 k 分解',statement:'\u2022 If k is an intermediate vertex of path p, then decompose p into i',page:656,
    intro:'★ 最优子结构的两分支论证 —— 与 23.1 的"按最后一条边"形成方法论对照。',
    steps:[
     {title:'情形一：k 不是中间点',en:'\u221a2 : all intermediate vertices in f1,2,\u2026,k \u2212 1g \u221a1 : all intermediate vertices in f1,2,\u2026,k \u2212 1g',page:656,
      body:['$p$ 的中间点全部在 $\u2009\\{1..k-1\\}$ 中。',
        '由 $d_{ij}^{(k-1)}$ 的定义，$p$ 的权重就是 $d_{ij}^{(k-1)}$ —— 这个候选已包含在 min 里。✓']},
     {title:'情形二：k 是中间点',en:'Therefore \u221a1 is a shortest path from i to k with all intermediate vertices in the set f1,2,\u2026,k \u2212 1g. Likewise, \u221a2 is a shortest path from vertex k to vertex j with all intermediate vertices in the set f1,2,\u2026,k \u2212 1g.',page:656,
      body:['分解 $p = p^1 + p^2$（$i \\leadsto k$ 与 $k \\leadsto j$）。',
        '**断言**：$p^1$ 是"只允许 $\u2009\\{1..k-1\\}$"时 $i \\leadsto k$ 的最短路 —— 若有更短者，替换后 $p$ 更短，矛盾。$p^2$ 同理。',
        '所以权重 $= d_{ik}^{(k-1)} + d_{kj}^{(k-1)}$ —— 第二个候选。∎']},
     {title:'实测：三法同答案',en:'Because for any path, all intermediate vertices belong to the set f1,2,\u2026,n g, the matrix = (n) = \u00e3 d (n) ij \u00e4 gives the final answer: d (n) ij = i(i,j) for all i,j 2 V .',page:657,
      body:['C 程序的"三法对照"断言：SLOW / FASTER / Floyd-Warshall（再加 Johnson）在 Figure 23.1 上给出**完全相同**的最终矩阵。',
        '★ 方法论对照：23.1 按边数、23.2 按中间点集合 —— 两种 DP 切入同一个问题。∎']},
    ],conclusion:'★ 结论：Floyd-Warshall = Θ(n³) + 原地更新 + 天然负权支持；对角元 < 0 即负环。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'Floyd-Warshall 的 DP 状态 d_ij^(k) 的含义是？',options:['经过 k 条边的最短路','**只允许 {1..k} 为中间点的最短路**','经过 k 次的最短路','第 k 行的最短路'],answer:1,
      why:'★ 与矩阵法的"边数"维度不同 —— 这是两章方法论的分野。'},
     {kind:'single',q:'Floyd-Warshall 的时间与空间是？',options:['Θ(n³) / Θ(n²)','Θ(n⁴) / Θ(n³)','Θ(n³ lg n) / Θ(n²)','Θ(n²) / Θ(n)'],answer:0,
      why:'★ 三重循环；原地更新只需一张表。'},
     {kind:'judge',q:'Floyd-Warshall 支持负权边。',answer:true,
      why:'★ DAG 才有"无负环"保证？不 —— FW 对任意图都能跑，负环由对角元暴露（d_ii < 0）。'},
     {kind:'simulate',q:'C 程序的 Floyd-Warshall 是几重循环？（填数字）',expect:[3],placeholder:'例如：2',
      why:'k、i、j 三重循环 → Θ(n³)。'},
     {kind:'judge',q:'Floyd-Warshall 用对角元 $d_{ii}^{(n)} < 0$ 检测负权环。',answer:true,
      why:'★ 若某顶点到自身的最短路为负，说明存在从它出发又回到它的负权环。'},
     {kind:'single',q:'外层循环跑到第 $k$ 轮时，$d_{ij}^{(k)}$ 允许的中间点集合是？',options:['$\{1..k-1\}$','**$\{1..k\}$**','仅 $\{k\}$','空集'],answer:1,
      why:'★ 维度 k 表示允许使用前 k 个顶点作中间点，是与边数维度法的根本区别。'},
    ],bookExercises:[
     {id:'23.2-1',page:661,star:0,statement:'Run the Floyd-Warshall algorithm on the weighted, directed graph of Figure 23.2. Show the matrix = (k) that results for each iteration of the outer loop.',hint:'每轮 $k$ 只有「经过 $k$ 更短」的那些格子会变：$d^{(k)}[i,j] = \\min(d^{(k-1)}[i,j],\\ d^{(k-1)}[i,k] + d^{(k-1)}[k,j])$。手算姿势：把第 $k$ 列与第 $k$ 行抄在纸边上当「参考行列表」，逐格比大小，改动的格子旁边标上新中间点 $k$。★ 三条自查：① $d^{(k)}$ 对 $k$ 单调不增（只会变短或不动）；② 无负环时第 $k$ 行第 $k$ 列在自己那轮不会被改短（$d[k,k] = 0$）；③ 要交的 $n$ 张矩阵是 $D^{(1)}..D^{(n)}$，$D^{(0)}$ 就是题给权矩阵，别漏也别只交最后一张。'},
     {id:'23.2-2',page:661,star:0,statement:'Show how to compute the transitive closure using the technique of Section 23.1.',hint:'把权矩阵换成布尔矩阵：有边（或 i = j）记真，然后用 23.1 的倍增矩阵乘，只把 min 换成 OR、加换成 AND。$\\lg n$ 轮之后 t 就是传递闭包。'},
     {id:'23.2-3',page:661,star:0,statement:'Modify the FLOYD-WARSHALL procedure to compute the … (k) matrices according to equations (23.7) and (23.8). Prove rigorously that for all i 2 V , the predecessor subgraph G −,i is a shortest-paths tree with root i . ( Hint: To show that G −,i is acyclic, first show that Ω (k) ij = l implies d (k) ij ≥ d (k) i l + w lj , according to the definition of Ω (k) ij . Then adapt the proof of Lemma 22.16.)',hint:'$\\pi^{(k)}$ 的递推与 d 同步写：被 k 改短就取 $\\pi^{(k-1)}_{kj}$，否则原样保留。证树按题面提示两步走：先由定义证「沿 $\\pi$ 走一步 d 严格变小」，环因此不可能；再归纳说明从 i 出发沿 $\\pi$ 能抵达所有 d 有限的结点。'},
     {id:'23.2-4',page:661,star:0,statement:'As it appears on page 657, the Floyd-Warshall algorithm requires Θ(n 3 ) space, since it creates d (k) ij for i,j,k = 1,2,…,n . Show that the procedure FLOYD- WARSHALL 0 , which simply drops all the superscripts, is correct, and thus only Θ(n 2 ) space is required. FLOYD-WARSHALL 0 (W,n) 1 = D W 2 for k = 1 to n 3 for i = 1 to n 4 for j = 1 to n 5 d ij = min fd ij ,d i k + d kj g 6 return =',hint:'省掉下标就是就地更新。要害是：第 k 轮里 $d_{kk} = 0$ 且带 k 的那两个条目在本轮不会被改短（经过 k 再回到 k 不会更省），所以随后读到的仍是「本轮该用的旧值」。把这句话写成一行证明，$\\Theta(n^2)$ 空间就成立。'},
     {id:'23.2-5',page:661,star:0,statement:'Consider the following change to how equation (23.8) handles equality: Ω (k) ij = ( Ω (k−1) kj if d (k−1) ij ≥ d (k−1) i k + d (k−1) kj (k is an intermediate vertex) ; Ω (k−1) ij if d (k−1) ij <d (k−1) i k + d (k−1) kj (k is not an intermediate vertex) : Is this alternative definition of the predecessor matrix … correct?',hint:'等号那一支决定「这条前驱记谁的链」。造一个两结点之间有两条等长最短路的小图，按题面改法跑一遍，检查 $\\pi$ 链能否从每个终点一路走回源点（会断在一处不自洽的地方）。'},
    ]},
  ],
};
