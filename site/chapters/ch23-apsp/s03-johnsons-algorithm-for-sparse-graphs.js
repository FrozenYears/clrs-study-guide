/* 第 23 章 23.3：稀疏图上的 Johnson 算法（Johnson's algorithm for sparse graphs）。印刷页 662–669（pdf 683–691）。 */
export default {
  key:'s03',id:'ch23/s03',chapter:23,section:'23.3',
  title:'Johnson：重加权让 Dijkstra 上场',shortTitle:'23.3 Johnson 算法',
  titleEn:'Johnson\u2019s algorithm for sparse graphs',
  source: { printed: [662, 669], pdf: [683, 691] },
  prerequisites:[{label:'23.2 The Floyd-Warshall algorithm',url:'#/ch23/s02'}],
  stages:[
   {type:'map',title:'负权 + 稀疏图的最优解',
    why:'稀疏图（$E = o(V^2)$）上 Floyd-Warshall 的 Θ(V³) 太浪费。**Johnson**：先用 Bellman-Ford 算出势函数 $h$ 重加权（消去负边），再从每个结点跑一次 Dijkstra —— 总代价 $O(V E \\lg V)$，稀疏图最优。',
    position:'22 章全部工具（Bellman-Ford、Dijkstra、差分约束的势函数思想）在此合流。这是"算法组合拳"的教科书案例。',
    unlocks:[{label:'24.1 Flow networks',url:'#/ch24/s01'}],
    mathKit:[
     {title:'重加权',body:'$\\hat{w}(u,v) = w(u,v) + h(u) - h(v)$，其中 $h(v) = \\delta(s, v)$（超级源的最短距）。'},
     {title:'关键性质',body:'$\\hat{w} \\ge 0$（三角不等式）且 $u \\leadsto v$ 的路径排名**不变**（路径上 $\\hat{w}$ 总和差 = $h(s)-h(t)$ 相消）。'},
     {title:'总代价',body:'$O(V E \\lg V)$：一次 Bellman-Ford $O(VE)$ + $V$ 次 Dijkstra。'},
    ]},
   {type:'intuition',title:'减去一个 h，加回一个 h',scene:'Figure 23.1 的图（C 程序实测）',body:[
     '重加权公式 $\\hat{w}(u,v) = w(u,v) + h(u) - h(v)$：路径 $p = \\langle v_0, v_1, \\ldots, v_k \\rangle$ 上求和时，$h$ 项**望远镜相消**：$\\sum \\hat{w} = \\sum w + h(v_0) - h(v_k)$。',
     '★ 所以两条路径谁短，重加权前后排名不变 —— 最短路路径不变，只是权重平移。',
     '★ $h(v) = \\delta(s, v)$（超级源到各点的最短距）恰好让 $\\hat{w} \\ge 0$：$\\hat{w}(u,v) = \\delta(u) + w(u,v) - \\delta(v) \\ge 0$ 由三角不等式直接得出（负边被 h 差"吸收"）。',
     '★ C 程序实测：重加权后跑 $V$ 次 Dijkstra，最终 $\\hat{d} + h(v) - h(u)$ 还原出的 d 矩阵与 SLOW/FASTER/FW **逐元素一致**（三法对照）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 y w 代表 ŵ）。',blocks:[
     {kind:'body',page:662,en:'Johnson9s algorithm uses the technique of reweighting, which works as follows.',
      zh:'★ 核心技术：重加权。'},
     {kind:'body',page:663,en:'Lemma 23.1 (Reweighting does not change shortest paths)',
      zh:'★★ 引理 23.1：重加权不改变最短路径。'},
     {kind:'body',page:665,en:'The new vertex s is blue. Within each vertex v is h(v) = i(s,v) . (b) After reweighting each edge (u,v) with weight function y w(u,v) = w(u,v) + h(u) \u2212 h(v).',
      zh:'★ h(v) = δ(s,v) 来自超级源的 Bellman-Ford（语料 i(s,v) 代表 δ(s,v)）。'},
     {kind:'body',page:666,en:'5 set h(v) to the value of i(s,v) computed by the Bellman-Ford algorithm',
      zh:'★ 实现细节：第 5 行就是"读出 h"。'},
    ],terms:[{en:'Johnson',zh:'Johnson 算法（重加权 + 多次 Dijkstra）',page:662},
              {en:'reweighting',zh:'重加权',page:662}]},
   {type:'pseudocode',title:'JOHNSON：6 行',algo:'JOHNSON',signature:'JOHNSON(G, w)',page:666,
    lines:[
     {n:1,code:'compute G\u2032 where V\u2032 = G.V ∪ {s},',zh:'★ 加超级源 s。'},
     {n:2,code:'    w(s,v) = 0 for all v ∈ G.V',zh:''},
     {n:3,code:'if BELLMAN-FORD(G\u2032, w, s) == FALSE',zh:'★★ 负环检测（顺带算出 h）。'},
     {n:4,code:'    print "the input graph contains a negative-weight cycle"',zh:''},
     {n:5,code:'else for each vertex v ∈ G.V',zh:''},
     {n:6,code:'        set h(v) = δ(s,v) computed by the Bellman-Ford algorithm',zh:'★★ 势函数。'},
     {n:7,code:'    for each edge (u,v) ∈ G.E\u2032',zh:''},
     {n:8,code:'        w\u0302(u,v) = w(u,v) + h(u) − h(v)',zh:'★ 重加权（非负）。'},
     {n:9,code:'    for each vertex u ∈ G.V',zh:''},
     {n:10,code:'        run Dijkstra(G\u2032, w\u0302, u) to compute δ\u0302(u,v) for all v',zh:'★ V 次 Dijkstra。'},
     {n:11,code:'        compute d(u,v) = δ\u0302(u,v) + h(v) − h(u)',zh:'★ 还原真实权重。'}],
    vars:[{name:'h(v)',meaning:'势函数 = 超级源的最短距'},{name:'ŵ',meaning:'非负的重加权'}],
    note:'★ 三段式：BF 定势 → V 次 Dijkstra → 反变换读回。每一步都是前面章节的成品。',
    more:[]},
   {type:'visualize',title:'重加权的望远镜相消',panels:[
     {title:'C 程序实测：三法对照（最终 d 矩阵一致）',viz:'growth',
      chart:{xMax:16,series:[
       {name:'Johnson 总代价 V·E lgV（稀疏图）',expr:'n * n * Math.log2(n)',color:'--viz-done'},
       {name:'Floyd-Warshall Θ(n³)',expr:'n * n * n',color:'--viz-violation'}]},
      note:'★ E ≈ V 时 Johnson ≈ V² lgV << V³ —— 稀疏图的最优选择。'},
    ],tasks:['对照 C 程序 s03 段与"三法对照"断言。'],note:''},
   {type:'code',title:'实测：三法对照',c:{file:'apsp.c',code:String.raw`/* apsp.c -- 第 23 章 所有结点对的最短路径（All-Pairs Shortest Paths）
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 s03 段（Johnson）。'},
           {line:159,zh:'`bellman_ford`：超级源的最短距 → 势函数 h。'},
           {line:187,zh:'`dijkstra`：重加权后的单源（非负权）。'},
           {line:211,zh:'`johnson`：BF 定势 → V 次 Dijkstra → 反变换读回。'},
           {line:290,zh:'★★ 三法对照：SLOW/FASTER/FW/Johnson 最终 d 矩阵完全一致。'}]},
    tests:[{in:'Figure 23.1 的图（含负边）',out:'Johnson 的还原矩阵 = SLOW/FASTER/FW 的结果'},
           {in:'重加权后',out:'全部边权 ŵ ≥ 0'}],
    mapping:[{pc:8,pcCode:'ŵ(u,v) = w(u,v) + h(u) − h(v)',c:'`johnson` 内的重加权（第 211 行）'},
             {pc:10,pcCode:'run Dijkstra',c:'`dijkstra(w_hat, u, dist)`（第 187 行）'}]},
   {type:'analyze',title:'一本账：何时选 Johnson',claims:[
     {expr:'O(VE \\lg V)',when:'Johnson（二叉堆 Dijkstra）的总时间',page:666,source:'book'},
     {expr:'\\hat{w}(u,v) \\ge 0',when:'重加权后的边权（三角不等式保证）',page:663,source:'book'},
     {expr:'\\Theta(V^3)',when:'Floyd-Warshall —— 稠密图上的对照',page:658,source:'book'},
    ],tables:[{caption:'APSP 的算法选择表（22/23 章总览）',rows:[
      ['图','最佳算法','时间'],
      ['稠密 E≈V²','Floyd-Warshall','Θ(V³)'],
      ['稀疏 E=o(V²/lgV)','Johnson','O(VE lgV)'],
      ['含负边 + 需检负环','先 Bellman-Ford','O(VE)'],
     ]},{caption:'C 程序实测：Figure 23.1（V=5, E=9）',rows:[
      ['方法','结果'],
      ['SLOW / FASTER / Floyd-Warshall / Johnson','四者最终 d 矩阵逐元素一致'],
     ]}],chart:{xMax:1000000,series:[
     {name:'Johnson V·E·lgV（E≈V）',expr:'n * n * Math.log2(n)',color:'--viz-done'},
     {name:'Floyd-Warshall V³',expr:'n * n * n',color:'--viz-violation'}]},
    derivations:[{kind:'summation',title:'ŵ 的非负性 = 三角不等式',steps:[
      {zh:'$h(v) = \\delta(s,v)$ 满足 $\\delta(v) \\le \\delta(u) + w(u,v)$（三角不等式，任何边）——**当且仅当图无负环**。'},
      {zh:'移项：$w(u,v) + h(u) - h(v) \\ge 0$，即 $\\hat{w}(u,v) \\ge 0$。'},
      {tex:'\\hat{w}(u,v) \\ge 0 \\ \\text{对一切边成立}',zh:'★ 负边被 h 差吸收 —— 这就是 Bellman-Ford 那一步的全部价值。'}]},
     ],
    note:''},
   {type:'prove',title:'引理 23.1：重加权不改变最短路径',statement:'Lemma 23.1 (Reweighting does not change shortest paths)',page:663,
    intro:'★ 一行代数：望远镜求和。',
    steps:[
     {title:'路径上的 h 项相消',en:'Johnson9s algorithm uses the technique of reweighting, which works as follows.',page:662,
      body:['路径 $p = \\langle v_0, v_1, \\ldots, v_k \\rangle$ 的重加权和：',
        '$\\sum \\hat{w} = \\sum \\big(w + h(v_{i-1}) - h(v_i)\\big) = \\sum w + h(v_0) - h(v_k)$。',
        '中间的 $h$ 全部相消 → $\\hat{w}(p) = w(p) + h(v_0) - h(v_k)$。']},
     {title:'排名不变',en:'Lemma 23.1 (Reweighting does not change shortest paths)',page:663,
      body:['对同一对 $(u,v)$ 的任意两条路径 $p, p^{\\prime}$：端点相同 → $h$ 补偿相同。',
        '$\\hat{w}(p) < \\hat{w}(p^{\\prime}) \\iff w(p) < w(p^{\\prime})$ —— 谁最短不改变。',
        '**注意**：不同端点对之间的比较会变 —— 所以 $d$ 要用 $d(u,v) = \\hat{\\delta}(u,v) + h(v) - h(u)$ 反变换读回。∎']},
     {title:'实测闭环',en:'5 set h(v) to the value of i(s,v) computed by the Bellman-Ford algorithm',page:666,
      body:['C 程序 s03 段：BF 定 h → 重加权（断言 ŵ ≥ 0）→ V 次 Dijkstra → 反变换。',
        '三法对照断言：Johnson 的还原矩阵与 SLOW/FASTER/FW 逐元素一致。',
        '★ 22 章的每一个组件（BF、Dijkstra、势函数）都在这里就位。∎']},
    ],conclusion:'★ 结论：Johnson = 差分约束的势函数 + Dijkstra × V —— 稀疏图 APSP 的最优选择。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'Johnson 的第一步为什么跑 Bellman-Ford？',options:['求从源点到各点的最短路径本身，结果直接就是答案','**算势函数 h 并检测负环**','生成邻接表','排序'],answer:1,
      why:'★ h(v) = δ(s,v) 用于重加权；负环 = 直接报告无解。'},
     {kind:'single',q:'重加权后最短路径会改变吗？',options:['路径不变，权重平移','路径和权重都变','只有权重变','都变'],answer:0,
      why:'★ 引理 23.1：h 项在路径上望远镜相消 —— 路径排名不变。'},
     {kind:'judge',q:'Johnson 在稠密图上优于 Floyd-Warshall。',answer:false,
      why:'★ 稠密图 E≈V²：Johnson O(V²·V lgV) 比 Θ(V³) 更差。'},
     {kind:'simulate',q:'Johnson 要跑几次 Dijkstra？（|V|=5，填数字）',expect:[5],placeholder:'例如：1',
      why:'每个源点一次 → V = 5 次（C 程序 s03 段）。'},
     {kind:'judge',q:'Johnson 重加权后所有边的权重 $\\hat{w}(u,v) = w(u,v)+h(u)-h(v) \\ge 0$。',answer:true,
      why:'★ 势函数 $h(v)=\\delta(s,v)$ 由 Bellman-Ford 算出，保证每条边非负（引理 23.1）。'},
     {kind:'single',q:'Johnson 的整体时间复杂度（用二叉堆 Dijkstra）约为？',options:['$O(VE)$：跑 V 轮松弛，每轮扫过全部 E 条边','**$O(V\\cdot E\\lg V)$**','$O(V^3)$','$O(E\\lg V)$'],answer:1,
      why:'★ $V$ 次 Dijkstra，每次 $O(E\\lg V)$；稀疏图优于 Floyd-Warshall 的 $\\Theta(V^3)$。'},
    ],bookExercises:[
     {id:'23.3-1',page:666,star:0,statement:'Use Johnson’s algorithm to find the shortest paths between all pairs of vertices in the graph of Figure 23.2. Show the values of h and y w computed by the algorithm.',hint:'三步照做：加超级源跑 BELLMAN-FORD 得 h，按 $\\hat{w}(u,v) = w(u,v) + h(u) - h(v)$ 逐边重算，再对每个源跑一次 DIJKSTRA，最后把距离换回原权重。本站 c/apsp.c 的 Johnson 分支会打出 h 与重加权后的边表。'},
     {id:'23.3-2',page:667,star:0,statement:'What is the purpose of adding the new vertex s to V , yielding V 0 ?',hint:'h 必须对每条边都满足三角不等式，才能保住重加权后非负；这个 h 是「从某个源出发到各点的最短路」，所以要有一个能到达**所有**结点的源 —— 那些 0 权入边就是干这个的，负环检测也顺带在这里完成。'},
     {id:'23.3-3',page:667,star:0,statement:'Suppose that w(u,v) ≥ 0 for all edges (u,v) 2 E. What is the relationship between the weight functions w and y w?',hint:'非负权时 h 恒为 0：s 的 0 权入边给出 $h(v) \\le 0$，而非负边又给出 $h(v) \\ge 0$。于是重加权是恒等变换，Johnson 退化成「每个源点各跑一次 Dijkstra」。'},
     {id:'23.3-4',page:667,star:0,statement:'Professor Greenstreet claims that there is a simpler way to reweight edges than the method used in Johnson’s algorithm. Letting w − = min fw(u,v) W (u,v) 2 Eg, just define y w(u,v) = w(u,v) − w − for all edges (u,v) 2 E. What is wrong with the professor’s method of reweighting?',hint:'重加权要保住的是「同一对结点之间，所有路径的长短次序不变」。Johnson 的 $h(u)-h(v)$ 在一条路径上是望远镜求和，只与首尾有关；教授减的是每条边一个常数，路径边数不同减量就不同 —— 造一条「边数多但总权更小」的对照路径就能戳破。'},
    ]},
  ],
};
