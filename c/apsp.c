/* apsp.c -- 第 23 章 所有结点对的最短路径（All-Pairs Shortest Paths）
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
