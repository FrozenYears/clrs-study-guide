/* max_flow.c -- 24 章：最大流（Ford-Fulkerson / Edmonds-Karp）+ 二分图匹配。
 * 网络 = 原书 Figure 24.1 的 6 顶点图：
 *   s->v1 16, s->v2 13, v1->v3 12, v2->v1 4, v2->v4 14, v3->v2 9,
 *   v3->t 20, v4->v3 7, v4->t 4
 * 关键数字：最大流 |f| = 23（原书 p.673 的答案）；最小割容量同为 23。
 * 二分图：自建小例（|L|=4、|R|=3、6 条边），最大匹配 = 3。
 * 注意：原书 Figure 24.8 的图是 |L|=5、|R|=4（见习题 24.3-1 的 1–5 / 6–9 编号），
 *       本程序只用了一个更小的示意例。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define NV 6                          /* s=0, v1=1, v2=2, v3=3, v4=4, t=5 */
#define NAME (const char *[]){"s", "v1", "v2", "v3", "v4", "t"}
#define BIG 100000

static int cap[NV][NV];               /* 容量（0 表示无边） */
static int flow[NV][NV];              /* 流 */
static int parent[NV];
static long aug_count, bfs_count;

/* 残量（含反向边） */
static int residual(int u, int v) { return cap[u][v] - flow[u][v]; }

/* BFS 找增广路径（Edmonds-Karp：每次沿最短增广路） */
static int bfs_path(int s, int t)
{
    int visited[NV];
    int queue[NV], head = 0, tail = 0;
    memset(visited, 0, sizeof(visited));
    bfs_count++;
    visited[s] = 1; parent[s] = -1;
    queue[tail++] = s;
    while (head < tail) {
        int u = queue[head++];
        for (int v = 0; v < NV; v++) {
            if (!visited[v] && residual(u, v) > 0) {
                visited[v] = 1; parent[v] = u;
                if (v == t) { return 1; }
                queue[tail++] = v;
            }
        }
    }
    return 0;
}

static void print_path(int t)
{
    int path[NV], n = 0, v = t;
    while (v != -1) { path[n++] = v; v = parent[v]; }
    printf("        ");
    for (int i = n - 1; i >= 0; i--) { printf("%s%s", NAME[path[i]], i ? " -> " : "\n"); }
}

static int edmonds_karp(int s, int t)
{
    while (bfs_path(s, t)) {
        int aug = BIG;
        for (int v = t; v != s; v = parent[v]) {
            int u = parent[v];
            if (residual(u, v) < aug) { aug = residual(u, v); }
        }
        for (int v = t; v != s; v = parent[v]) {
            int u = parent[v];
            flow[u][v] += aug;
            flow[v][u] -= aug;         /* 反向边记账（斜对称） */
        }
        aug_count++;
        printf("  第 %ld 条增广路（瓶颈 %d）：\n", aug_count, aug);
        print_path(t);
    }
    int value = 0;
    for (int v = 0; v < NV; v++) { value += flow[s][v]; }
    return value;
}

static void build_figure_24_1(void)
{
    memset(cap, 0, sizeof(cap));
    memset(flow, 0, sizeof(flow));
    cap[0][1] = 16; cap[0][2] = 13;
    cap[1][3] = 12; cap[2][1] = 4; cap[2][4] = 14;
    cap[3][2] = 9;  cap[3][5] = 20; cap[4][3] = 7; cap[4][5] = 4;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* part 1：Edmonds-Karp 求最大流 */
    build_figure_24_1();
    printf("part 1: 在 Figure 24.1 的网络（6 顶点 9 边）上跑 Edmonds-Karp：\n");
    int value = edmonds_karp(0, 5);
    printf("        最大流 |f| = %d（原书答案 23）；增广 %ld 次，BFS %ld 次\n",
           value, aug_count, bfs_count);
    assert(value == 23);

    /* part 2：最小割 —— 残量网络中从 s 可达的点集定义 S，割容量 = 最大流 */
    {
        int visited[NV], queue[NV], head = 0, tail = 0;
        memset(visited, 0, sizeof(visited));
        visited[0] = 1; queue[tail++] = 0;
        while (head < tail) {
            int u = queue[head++];
            for (int v = 0; v < NV; v++) {
                if (!visited[v] && residual(u, v) > 0) { visited[v] = 1; queue[tail++] = v; }
            }
        }
        printf("part 2: 残量网络可达集 S = {");
        for (int v = 0; v < NV; v++) { if (visited[v]) { printf("%s ", NAME[v]); } }
        printf("}\n");
        int cut = 0;
        printf("        割 (S, V−S) 的边：");
        for (int u = 0; u < NV; u++) {
            for (int v = 0; v < NV; v++) {
                if (visited[u] && !visited[v] && cap[u][v] > 0) {
                    printf("%s->%s(%d) ", NAME[u], NAME[v], cap[u][v]);
                    cut += cap[u][v];
                }
            }
        }
        printf("\n        割容量 = %d = 最大流值 —— 最大流最小割定理成立 ✓\n", cut);
        assert(cut == value);
    }

    /* part 3：二分图最大匹配（自建小例：|L|=4、|R|=3、6 条边） */
    {
        /* 网络：s=0, u1..u4=1..4, v1..v3=5..7, t=8 */
        #define MV 9
        int mc[MV][MV], mf[MV][MV];
        memset(mc, 0, sizeof(mc));
        memset(mf, 0, sizeof(mf));
        for (int u = 1; u <= 4; u++) { mc[0][u] = 1; }          /* s -> L */
        for (int v = 5; v <= 7; v++) { mc[v][8] = 1; }          /* R -> t */
        /* 边集：u1-v1, u1-v2, u2-v1, u3-v3, u4-v2, u4-v3 */
        mc[1][5] = 1; mc[1][6] = 1; mc[2][5] = 1; mc[3][7] = 1; mc[4][6] = 1; mc[4][7] = 1;
        /* Edmonds-Karp on this network（就地用局部数组） */
        int p[MV];
        int aug = 0;
        while (1) {
            int vis[MV], q[MV], h = 0, tl = 0;
            memset(vis, 0, sizeof(vis));
            vis[0] = 1; p[0] = -1; q[tl++] = 0;
            while (h < tl) {
                int u = q[h++];
                for (int v = 0; v < MV; v++) {
                    if (!vis[v] && mc[u][v] - mf[u][v] > 0) { vis[v] = 1; p[v] = u; q[tl++] = v; }
                }
            }
            if (!vis[8]) { break; }
            for (int v = 8; v != 0; v = p[v]) { int u = p[v]; mf[u][v] += 1; mf[v][u] -= 1; }
            aug++;
        }
        printf("part 3: 二分图匹配网络（|L|=4, |R|=3, 6 条边）上的最大流 = %d\n", aug);
        printf("        匹配对：");
        for (int u = 1; u <= 4; u++) {
            for (int v = 5; v <= 7; v++) {
                if (mf[u][v] > 0) { printf("(u%d, v%d) ", u, v - 4); }
            }
        }
        printf("\n        每个左点至多匹配一次、右点亦然 —— 流的容量约束自动保证匹配合法性 ✓\n");
        assert(aug == 3);                 /* 右点只有 3 个 -> 最多 3 对 */
    }

    puts("all checks passed.");
    return 0;
}
