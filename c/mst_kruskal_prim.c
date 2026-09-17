/* mst_kruskal_prim.c -- 21.2: Kruskal 与 Prim。
 * 数据：原书 Figure 21.1 的图（顶点 a..i，13 条加权无向边）。
 * 关键数字：MST 总权重 = 37（原书答案）；Kruskal 与 Prim 选出的边集权重一致。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define V 9
#define E 14

static const char *name[V] = {"a", "b", "c", "d", "e", "f", "g", "h", "i"};

/* Figure 21.1 的边（u, v, w） */
static const int eu[E] = {0, 0, 1, 1, 2, 2, 2, 3, 3, 4, 5, 6, 6, 7};
static const int ev[E] = {1, 7, 2, 7, 3, 5, 8, 4, 5, 5, 6, 7, 8, 8};
static const int ew[E] = {4, 8, 8, 11, 7, 4, 2, 9, 14, 10, 2, 1, 6, 7};

/* ---------- 并查集（Kruskal 用，19 章的森林实现） ---------- */
static int dsu_p[V], dsu_rank[V];

static void dsu_make(void)
{
    for (int i = 0; i < V; i++) { dsu_p[i] = i; dsu_rank[i] = 0; }
}

static int dsu_find(int x)
{
    while (dsu_p[x] != x) { x = dsu_p[x]; }
    return x;
}

static int dsu_link(int x, int y)          /* 返回 1 表示发生了合并 */
{
    if (dsu_rank[x] > dsu_rank[y]) { dsu_p[y] = x; return 1; }
    dsu_p[x] = y;
    if (dsu_rank[x] == dsu_rank[y]) { dsu_rank[y]++; }
    return 1;
}

/* ---------- Kruskal ---------- */
static int in_mst_kruskal[E];

static void kruskal(void)
{
    int order[E];
    for (int i = 0; i < E; i++) { order[i] = i; }
    /* 按权重插入排序（稳定、无 qsort 依赖） */
    for (int i = 1; i < E; i++) {
        int e = order[i], j = i - 1;
        while (j >= 0 && ew[order[j]] > ew[e]) { order[j + 1] = order[j]; j--; }
        order[j + 1] = e;
    }
    dsu_make();
    printf("part 1: Kruskal 按权重依次考察（跳过成环的边）：\n");
    for (int i = 0; i < E; i++) {
        int e = order[i];
        int ru = dsu_find(eu[e]), rv = dsu_find(ev[e]);
        if (ru != rv) {
            dsu_link(ru, rv);
            in_mst_kruskal[e] = 1;
            printf("        取 (%s,%s) 权 %d\n", name[eu[e]], name[ev[e]], ew[e]);
        }
    }
}

/* ---------- Prim（数组版"优先队列"：每轮线性找最小） ---------- */
static int in_mst_prim[V];
static int key[V];                          /* 连接到树的最小权 */
static int pred[V];

static void prim(int s)
{
    for (int i = 0; i < V; i++) { key[i] = 1000000; pred[i] = -1; in_mst_prim[i] = 0; }
    key[s] = 0;
    printf("part 2: Prim 从 %s 出发，逐点入树：\n", name[s]);
    for (int count = 0; count < V; count++) {
        int u = -1;
        for (int i = 0; i < V; i++) {
            if (!in_mst_prim[i] && (u < 0 || key[i] < key[u])) { u = i; }
        }
        in_mst_prim[u] = 1;
        if (pred[u] >= 0) {
            printf("        取 (%s,%s) 权 %d\n", name[pred[u]], name[u], key[u]);
        }
        for (int e = 0; e < E; e++) {       /* 松弛 u 的所有邻边 */
            int v = -1;
            if (eu[e] == u) { v = ev[e]; }
            if (ev[e] == u) { v = eu[e]; }
            if (v >= 0 && !in_mst_prim[v] && ew[e] < key[v]) {
                key[v] = ew[e]; pred[v] = u;
            }
        }
    }
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    kruskal();
    long total_k = 0;
    for (int e = 0; e < E; e++) { if (in_mst_kruskal[e]) { total_k += ew[e]; } }
    printf("        Kruskal 的 MST 总权重 = %ld（原书答案 37）\n", total_k);
    assert(total_k == 37);
    int cnt_k = 0;
    for (int e = 0; e < E; e++) { cnt_k += in_mst_kruskal[e]; }
    assert(cnt_k == V - 1);                 /* 树恰有 V-1 条边 */

    prim(0);
    long total_p = 0;
    for (int i = 0; i < V; i++) {
        assert(pred[i] >= 0 || i == 0);
        if (pred[i] >= 0) { total_p += key[i]; }
    }
    printf("        Prim 的 MST 总权重 = %ld\n", total_p);
    assert(total_p == 37);

    printf("part 3: 两种算法的总权重一致（37 = 37）—— MST 的总权重唯一，\n");
    printf("        边集在权重并列时可能不同；本例两者都给出最优树。\n");
    assert(total_k == total_p);

    puts("all checks passed.");
    return 0;
}
