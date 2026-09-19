/* 第 20 章 20.1：图的表示（Representations of graphs）。印刷页 549–553。 */
export default {
  key: 's01', id: 'ch20/s01', chapter: 20, section: '20.1',
  title: '图的表示：邻接表与邻接矩阵', shortTitle: '20.1 图的表示',
  titleEn: 'Representations of graphs',
  source: { printed: [549, 553], pdf: [570, 574] },
  prerequisites: [],
  stages: [
    { type: 'map', title: '为什么先学「怎么存图」',
      why: '图和树不同：一个顶点可能连出任意多条边。怎么把一张图塞进内存，直接决定了后面所有算法（BFS、DFS、拓扑排序、强连通分量）能跑多快。这一关给出两种最基础的存储方式，并比较它们的空间与查边代价。',
      position: '本章总入口：20.2 的 BFS、20.3 的 DFS、20.4 的拓扑排序、20.5 的强连通分量，全部建立在「图已被表示好」的前提上。绝大多数算法假设输入是邻接表。',
      unlocks: [{ label: '20.2 广度优先搜索', url: '#/ch20/s02' }],
      mathKit: [
        { title: '空间上界', body: '邻接表 $\\Theta(V + E)$；邻接矩阵 $\\Theta(V^2)$。稀疏图（$E \\ll V^2$）下前者省得多。' },
        { title: '查边代价', body: '矩阵 $O(1)$ 直接看 $A[u][v]$；邻接表最坏要扫整条 $Adj[u]$，最坏 $O(V)$。' },
      ] },
    { type: 'intuition', title: '两种「通讯录」', scene: '你有一本通讯录，要记下所有人以及他们认识谁。',
      body: [
        '第一种记法：每个人占一页，页里只写「我认识的人」的名字列表。整本通讯录的厚度 = 人数 + 所有「认识关系」的总数。这就是**邻接表（adjacency list）**。',
        '第二种记法：画一张 $V \\times V$ 的大表，第 $u$ 行第 $v$ 列打勾表示 $u$ 认识 $v$。整张表永远有 $V^2$ 格，跟「实际认识关系」多不多无关。这就是**邻接矩阵（adjacency matrix）**。',
        '哪种好？如果大多数人不认识大多数人（稀疏图），第一种省纸；如果你想随时问「A 认识 B 吗」并得到秒答，第二种直接查格子就行。原书 Figure 20.1（无向）、Figure 20.2（有向）把同一张图用两种方式各画了一遍。',
      ], interactive: { text: '' } },
    { type: 'source', title: '书上是怎么说的', lead: '原书英文原文（含语料排版形式，如 2 表示 ∈、Θ(V 2 ) 表示 V²）。',
      blocks: [
        { kind: 'body', page: 549, en: 'Section 20.1 discusses the two most common computational representations of graphs: as adjacency lists and as adjacency matrices. Section 20.2 presents a simple graph-searching algorithm called breadth-first search and shows how to create a breadth-first tree. Section 20.3 presents depth-first search and proves some standard results about the order in which depth-first search visits vertices. Section 20.4 provides our first real application of depth-first search: topologically sorting a directed acyclic graph. A second application of depth-first search, finding the strongly connected components of a directed graph, is the topic of Section 20.5.',
          zh: '★★ 全章地图：20.1 两种表示；20.2 BFS 与广度优先树；20.3 DFS；20.4 拓扑排序；20.5 强连通分量。' },
        { kind: 'body', page: 550, en: 'The adjacency-list representation of a graph G = (V,E) consists of an array Adj of |V| lists, one for each vertex in V . For each u 2 V , the adjacency list Adj[u] contains all the vertices v such that there is an edge (u,v) 2 E. That is, Adj[u] consists of all the vertices adjacent to u in G.',
          zh: '★★ 邻接表：一个长度为 |V| 的数组 Adj，每个 Adj[u] 是 u 的所有邻居列表。' },
        { kind: 'body', page: 550, en: 'If G is a directed graph, the sum of the lengths of all the adjacency lists is |E|, since an edge of the form (u,v) is represented by having v appear in Adj[u]. If G is an undirected graph, the sum of the lengths of all the adjacency lists is 2 |E|, since if (u,v) is an undirected edge, then u appears in v’s adjacency list and vice versa.',
          zh: '★★ 有向图所有邻接表长度之和 = |E|；无向图 = 2|E|（每条边在两端各出现一次）。' },
        { kind: 'body', page: 551, en: 'For both directed and undirected graphs, the adjacency-list representation has the desirable property that the amount of memory it requires is Θ(V + E). Finding each edge in the graph also takes Θ(V + E) time, rather than just Θ(E), since each of the |V| adjacency lists must be examined.',
          zh: '★★ 邻接表空间 $\\Theta(V + E)$；枚举所有边也要 $\\Theta(V + E)$（还得扫每条空表）。' },
        { kind: 'body', page: 551, en: 'The adjacency-matrix representation of a graph G = (V,E) assumes that the vertices are numbered 1,2,…; |V| in some arbitrary manner. Then the adjacencymatrix representation of a graph G consists of a |V| × |V| matrix A = (a ij ) such that a ij =',
          zh: '★★ 邻接矩阵：把顶点任意编号为 1..|V|，用一个 |V|×|V| 矩阵 A 表示，A[u][v] 表示边 (u,v)。' },
        { kind: 'body', page: 551, en: 'The adjacency matrix of a graph requires Θ(V 2 ) memory, independent of the number of edges in the graph. Because finding each edge in the graph requires examining the entire adjacency matrix, doing so takes Θ(V 2 ) time.',
          zh: '★★ 邻接矩阵空间 $\\Theta(V^2)$，与边数无关；枚举所有边也要 $\\Theta(V^2)$。' },
        { kind: 'body', page: 551, en: 'A potential disadvantage of the adjacency-list representation is that it provides no quicker way to determine whether a given edge (u,v) is present in the graph than to search for v in the adjacency list Adj[u]. An adjacency-matrix representation of the graph remedies this disadvantage, but at the cost of using asymptotically more memory.',
          zh: '★★ 邻接表的缺点：判断边 (u,v) 是否存在只能扫 Adj[u]；矩阵弥补了这点，但更费内存。' },
      ],
      terms: [
        { en: 'adjacency-list representation', zh: '邻接表', page: 550 },
        { en: 'adjacency-matrix representation', zh: '邻接矩阵', page: 551 },
        { en: 'transpose', zh: '图转置 G^T（所有边反向）', page: 553 },
      ] },
    { type: 'pseudocode', title: '遍历邻接表：以算出度为例', algo: 'COMPUTE-OUT-DEGREES', signature: 'COMPUTE-OUT-DEGREES(G)', page: 552,
      lines: [
        { n: 1, code: 'for each vertex u ∈ G.V', zh: '逐个顶点。' },
        { n: 2, code: '    u.out-deg = 0', zh: '先把出度清零。' },
        { n: 3, code: '    for each vertex v ∈ G.Adj[u]', zh: '★★ 顺着 u 的邻接表走。' },
        { n: 4, code: '        u.out-deg = u.out-deg + 1', zh: '每遇到一个邻居，出度加 1。' },
      ],
      vars: [{ name: 'u.out-deg', meaning: '顶点 u 的出度（从 u 出发的边数）' }],
      note: '★★ 出度 = 扫一遍 Adj[u] 即可，总代价 Θ(V + E)。入度则要扫「所有」邻接表（Θ(V + E)），或在矩阵里扫一列（Θ(V)）。见习题 20.1-1。',
      more: [] },
    { type: 'visualize', title: '看见两种表示的空间',
      panels: [
        { title: '① 邻接表把图存成「V 个列表」', viz: 'tree', vizMode: 'tree',
          trees: [{ root: { label: 'G.Adj', children: [
            { label: '1', children: [{ label: '2' }, { label: '4' }] },
            { label: '2', children: [{ label: '5' }] },
            { label: '3', children: [{ label: '5' }, { label: '6' }] },
            { label: '4', children: [{ label: '2' }] },
            { label: '5', children: [{ label: '4' }] },
            { label: '6', children: [{ label: '6' }] },
          ] } }],
          treeNotes: ['★ 这是原书 Figure 20.2 有向图（6 顶点、8 边）的邻接表视图。',
            '每个顶点是一棵子树，它的孩子是它的所有出边邻居。',
            '所有「孩子」总数 = |E| = 8；加上 V = 6 个根，总空间 Θ(V + E)。'] },
        { title: '② 空间：邻接表 Θ(V+E) vs 邻接矩阵 Θ(V²)', viz: 'growth',
          chart: { xMax: 64, series: [
            { name: '邻接表 Θ(V+E)，取 V=8', expr: '8 + x', color: '--viz-done' },
            { name: '邻接矩阵 Θ(V²)=64', expr: '64', color: '--viz-violation' },
          ] },
          note: '★ E 越大，矩阵这层「天花板」越离谱；稀疏图上邻接表省一个数量级。' },
      ],
      tasks: ['对照原书 Figure 20.2(c)：矩阵 6×6=36 格，真正为 1 的只有 8 格。'] },
    { type: 'code', title: 'C 实现：两种表示 + 转置',
      c: { file: 'graph_basics.c', code: String.raw`/* graph_basics.c -- CLRS Chapter 20 Elementary Graph Algorithms.
 *
 * Fixed input graph = Figure 20.2 directed graph G (6 vertices, 8 edges).
 * The book labels vertices 1..6; here we use 0-based indices 0..5, so that
 * book vertex k corresponds to C index k-1 (page note explains the mapping).
 *
 *   book edges:  1->2, 1->4, 2->5, 3->5, 3->6, 4->2, 5->4, 6->6 (self-loop)
 *   0-based   :  0->1, 0->3, 1->4, 2->4, 2->5, 3->1, 4->3, 5->5
 *
 * Also a separate DAG (Section 20.4 topological sort) is used for TOPOLOGICAL-SORT.
 *
 * The program exercises five topics, prints the key numbers, and asserts them.
 * Build: gcc -std=c99 -Wall -Wextra -Werror -o graph_basics graph_basics.c
 */
#include <assert.h>
#include <stdio.h>

#define INF 1000000
#define WHITE 0
#define GRAY 1
#define BLACK 2
#define TREE 0
#define BACK 1
#define FORWARD 2
#define CROSS 3

#define N 6 /* vertices in Figure 20.2 graph G */
#define M 6 /* vertices in the DAG for topological sort */
#define MAXV 8

/* A graph with adjacency lists, an adjacency matrix, and an edge-id matrix. */
typedef struct {
    int n;
    int deg[MAXV];
    int list[MAXV][MAXV];
    int mat[MAXV][MAXV];
    int eid[MAXV][MAXV]; /* id of original edge (u,v), -1 if none */
} G;

/* ---------- Figure 20.2 graph G and its transpose ---------- */
static G Gg;
static G Gt;

/* ---------- DAG for topological sort (Section 20.4) ---------- */
static G Gd;

/* ---------- DFS / BFS working state ---------- */
static int gcolor[MAXV];
static int gd[MAXV], gf[MAXV];
static int gt;
static G *gcur;
static int *gcls;

static const char *cls_name(int c) {
    switch (c) {
        case TREE: return "tree";
        case BACK: return "back";
        case FORWARD: return "forward";
        case CROSS: return "cross";
        default: return "?";
    }
}

/* ----------------------------------------------------------------
 * BFS on a graph (Section 20.2). 0-based source s.
 * ---------------------------------------------------------------- */
static void bfs(G *g, int s, int *d, int *pred) {
    int color[MAXV];
    int q[MAXV];
    int h = 0, t = 0;
    for (int u = 0; u < g->n; u++) {
        color[u] = WHITE;
        d[u] = INF;
        pred[u] = -1;
    }
    color[s] = GRAY;
    d[s] = 0;
    pred[s] = -1;
    q[t++] = s;
    while (h < t) {
        int u = q[h++];
        for (int i = 0; i < g->deg[u]; i++) {
            int v = g->list[u][i];
            if (color[v] == WHITE) {
                color[v] = GRAY;
                d[v] = d[u] + 1;
                pred[v] = u;
                q[t++] = v;
            }
        }
        color[u] = BLACK;
    }
}

/* ----------------------------------------------------------------
 * DFS on a graph (Section 20.3). Classifies each edge and records
 * discovery/finish times.
 * ---------------------------------------------------------------- */
static void dfs_visit(int u) {
    gt++;
    gd[u] = gt;
    gcolor[u] = GRAY;
    for (int i = 0; i < gcur->deg[u]; i++) {
        int v = gcur->list[u][i];
        int e = gcur->eid[u][v];
        if (gcolor[v] == WHITE) {
            if (e >= 0) gcls[e] = TREE;
            dfs_visit(v);
        } else if (gcolor[v] == GRAY) {
            if (e >= 0) gcls[e] = BACK;
        } else {
            if (e >= 0) gcls[e] = (gd[u] < gd[v]) ? FORWARD : CROSS;
        }
    }
    gt++;
    gf[u] = gt;
    gcolor[u] = BLACK;
}

/* Run a full DFS; fills d/f per vertex and cls per original edge. */
static int dfs(G *g, int *d, int *f, int *cls, int nedge) {
    gcur = g;
    gcls = cls;
    gt = 0;
    for (int e = 0; e < nedge; e++) cls[e] = -1;
    for (int u = 0; u < g->n; u++) {
        gcolor[u] = WHITE;
        gd[u] = 0;
        gf[u] = 0;
    }
    for (int i = 0; i < g->n; i++) {
        if (gcolor[i] == WHITE) dfs_visit(i);
    }
    for (int u = 0; u < g->n; u++) {
        d[u] = gd[u];
        f[u] = gf[u];
    }
    int nb = 0;
    for (int e = 0; e < nedge; e++)
        if (cls[e] == BACK) nb++;
    return nb;
}

/* ----------------------------------------------------------------
 * Kosaraju's algorithm (Section 20.5): two DFS passes.
 * ---------------------------------------------------------------- */
static int comp[MAXV];

static void dfs_comp_visit(int u, int cid) {
    comp[u] = cid;
    gcolor[u] = GRAY;
    for (int i = 0; i < gcur->deg[u]; i++) {
        int v = gcur->list[u][i];
        if (gcolor[v] == WHITE) dfs_comp_visit(v, cid);
    }
    gcolor[u] = BLACK;
}

static int dfs_components_order(G *g, int *order, int orderlen) {
    gcur = g;
    for (int u = 0; u < g->n; u++) gcolor[u] = WHITE;
    int cid = 0;
    for (int k = 0; k < orderlen; k++) {
        int s = order[k];
        if (gcolor[s] == WHITE) {
            cid++;
            dfs_comp_visit(s, cid);
        }
    }
    return cid;
}

/* ----------------------------------------------------------------
 * Builders
 * ---------------------------------------------------------------- */
static void init_graph(G *g, int n) {
    g->n = n;
    for (int u = 0; u < n; u++) {
        g->deg[u] = 0;
        for (int v = 0; v < n; v++) {
            g->list[u][v] = 0;
            g->mat[u][v] = 0;
            g->eid[u][v] = -1;
        }
    }
}

static void add_edge(G *g, int u, int v, int id) {
    g->list[u][g->deg[u]++] = v;
    g->mat[u][v] = 1;
    g->eid[u][v] = id;
}

static void build_G(void) {
    init_graph(&Gg, N);
    init_graph(&Gt, N);
    /* book edges 1->2,1->4,2->5,3->5,3->6,4->2,5->4,6->6 (self-loop) */
    int u[] = {0, 0, 1, 2, 2, 3, 4, 5};
    int v[] = {1, 3, 4, 4, 5, 1, 3, 5};
    for (int e = 0; e < 8; e++) {
        add_edge(&Gg, u[e], v[e], e);
        add_edge(&Gt, v[e], u[e], e); /* transpose */
    }
}

static void build_DAG(void) {
    init_graph(&Gd, M);
    /* a clean DAG (acyclic): 0->1,0->2,1->3,2->3,2->4,3->5,4->5 */
    int u[] = {0, 0, 1, 2, 2, 3, 4};
    int v[] = {1, 2, 3, 3, 4, 5, 5};
    for (int e = 0; e < 7; e++) add_edge(&Gd, u[e], v[e], e);
}

/* ----------------------------------------------------------------
 * main: exercises all five topics and prints/asserts key numbers.
 * ---------------------------------------------------------------- */
int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    build_G();
    build_DAG();

    /* ===== Part 1: adjacency-list vs adjacency-matrix (Section 20.1) ===== */
    {
        int edge_count = 0;
        for (int u = 0; u < N; u++) edge_count += Gg.deg[u];
        printf("Part 1 (representations): V=%d, |E|=%d (sum of list lengths)\n", N, edge_count);
        printf("         adjacency matrix is %dx%d = %d entries (vs |E|=%d)\n",
               N, N, N * N, edge_count);
        /* matrix must reflect exactly the 8 directed edges */
        int mcount = 0;
        for (int u = 0; u < N; u++)
            for (int v = 0; v < N; v++) mcount += Gg.mat[u][v];
        printf("         matrix has %d ones; list has %d edges (must match)\n", mcount, edge_count);
        assert(edge_count == 8);
        assert(mcount == 8);
        /* directed graph: matrix is NOT symmetric (e.g. 0->1 present, 1->0 absent) */
        assert(Gg.mat[0][1] == 1);
        assert(Gg.mat[1][0] == 0);
        /* self-loop at book vertex 6 (index 5) */
        assert(Gg.mat[5][5] == 1);
        printf("         space: list Theta(V+E)=Theta(%d+%d), matrix Theta(V^2)=Theta(%d)\n",
               N, edge_count, N * N);
    }

    /* ===== Part 2: BFS levels and shortest-path distances (Section 20.2) ===== */
    {
        int d[MAXV], pred[MAXV];
        int s = 0; /* book vertex 1 */
        bfs(&Gg, s, d, pred);
        printf("Part 2 (BFS from book vertex 1):\n");
        printf("         d =");
        for (int u = 0; u < N; u++)
            printf(" %d", d[u] == INF ? -1 : d[u]);
        printf("   (book: d[1]=0,d[2]=1,d[4]=1,d[5]=2; 3 and 6 unreachable -> -1)\n");
        assert(d[0] == 0);
        assert(d[1] == 1); /* book vertex 2 */
        assert(d[3] == 1); /* book vertex 4 */
        assert(d[4] == 2); /* book vertex 5 */
        assert(d[2] == INF);
        assert(d[5] == INF);
        /* predecessors (BFS tree edges) */
        assert(pred[1] == 0);
        assert(pred[3] == 0);
        assert(pred[4] == 1);
        /* count reachable vertices and tree edges */
        int reach = 0, tree = 0;
        for (int u = 0; u < N; u++)
            if (d[u] != INF) reach++;
        for (int u = 0; u < N; u++)
            if (pred[u] != -1) tree++;
        printf("         reachable=%d (book vertices 1,2,4,5), BFS-tree edges=%d\n", reach, tree);
        assert(reach == 4);
        assert(tree == 3);
        /* levels: 0:{1}, 1:{2,4}, 2:{5} */
        int lvl0 = 0, lvl1 = 0, lvl2 = 0;
        for (int u = 0; u < N; u++) {
            if (d[u] == 0) lvl0++;
            else if (d[u] == 1) lvl1++;
            else if (d[u] == 2) lvl2++;
        }
        printf("         level 0 has %d, level 1 has %d, level 2 has %d vertices\n", lvl0, lvl1, lvl2);
        assert(lvl0 == 1 && lvl1 == 2 && lvl2 == 1);
    }

    /* ===== Part 3: DFS discovery/finish times and edge classification (20.3) ===== */
    {
        int d[MAXV], f[MAXV], cls[8];
        int nb = dfs(&Gg, d, f, cls, 8);
        printf("Part 3 (DFS on G):\n");
        printf("         d =");
        for (int u = 0; u < N; u++) printf(" %d", d[u]);
        printf("\n         f =");
        for (int u = 0; u < N; u++) printf(" %d", f[u]);
        printf("\n");
        /* expected: v0 d1 f8, v1 d2 f7, v2 d9 f12, v3 d4 f5, v4 d3 f6, v5 d10 f11 */
        int exp_d[] = {1, 2, 9, 4, 3, 10};
        int exp_f[] = {8, 7, 12, 5, 6, 11};
        for (int u = 0; u < N; u++) {
            assert(d[u] == exp_d[u]);
            assert(f[u] == exp_f[u]);
        }
        /* exactly 2|V| timestamp events, all distinct in [1,2V]; max f == 2V */
        int maxf = 0;
        for (int u = 0; u < N; u++)
            if (f[u] > maxf) maxf = f[u];
        assert(maxf == 2 * N);
        printf("         timestamps span [1, %d] (== 2|V|)\n", 2 * N);
        /* edge classification (original edge ids e0..e7):
           e0 0->1 tree, e1 0->3 forward, e2 1->4 tree, e3 2->4 cross,
           e4 2->5 tree, e5 3->1 back, e6 4->3 tree, e7 5->5 back */
        int exp_cls[] = {TREE, FORWARD, TREE, CROSS, TREE, BACK, TREE, BACK};
        int ntree = 0, nback = 0, nfw = 0, ncross = 0;
        for (int e = 0; e < 8; e++) {
            assert(cls[e] == exp_cls[e]);
            if (cls[e] == TREE) ntree++;
            else if (cls[e] == BACK) nback++;
            else if (cls[e] == FORWARD) nfw++;
            else ncross++;
            printf("         edge %d (%d->%d): %s\n", e,
                   e == 7 ? 5 : (int[]){0, 0, 1, 2, 2, 3, 4, 5}[e],
                   e == 7 ? 5 : (int[]){1, 3, 4, 4, 5, 1, 3, 5}[e],
                   cls_name(cls[e]));
        }
        printf("         counts: tree=%d back=%d forward=%d cross=%d\n",
               ntree, nback, nfw, ncross);
        assert(ntree == 4 && nback == 2 && nfw == 1 && ncross == 1);
        /* G has a cycle, so DFS yields at least one back edge */
        assert(nb >= 1);
    }

    /* ===== Part 4: topological sort on the DAG (Section 20.4) ===== */
    {
        int d[MAXV], f[MAXV], cls[8];
        int nb = dfs(&Gd, d, f, cls, 7);
        printf("Part 4 (topological sort on DAG):\n");
        printf("         DAG has %d back edges (must be 0 -> acyclic)\n", nb);
        assert(nb == 0); /* Lemma 20.11: acyclic iff no back edges */
        /* topo order = vertices in decreasing order of finish time */
        int order[M];
        for (int u = 0; u < M; u++) order[u] = u;
        for (int i = 0; i < M; i++)
            for (int j = i + 1; j < M; j++)
                if (f[order[i]] < f[order[j]]) {
                    int tmp = order[i];
                    order[i] = order[j];
                    order[j] = tmp;
                }
        printf("         topo order (book 1..):");
        for (int k = 0; k < M; k++) printf(" %d", order[k] + 1);
        printf("\n");
        /* verify: every edge u->v appears before v in the order */
        int pos[M];
        for (int k = 0; k < M; k++) pos[order[k]] = k;
        int u[] = {0, 0, 1, 2, 2, 3, 4};
        int v[] = {1, 2, 3, 3, 4, 5, 5};
        for (int e = 0; e < 7; e++) assert(pos[u[e]] < pos[v[e]]);
        printf("         every edge u->v has u before v (valid topological sort)\n");
    }

    /* ===== Part 5: strongly connected components via Kosaraju (Section 20.5) ===== */
    {
        int d[MAXV], f[MAXV], cls[8];
        dfs(&Gg, d, f, cls, 8); /* first pass on G */
        /* order vertices by decreasing finish time */
        int order[N];
        for (int u = 0; u < N; u++) order[u] = u;
        for (int i = 0; i < N; i++)
            for (int j = i + 1; j < N; j++)
                if (f[order[i]] < f[order[j]]) {
                    int tmp = order[i];
                    order[i] = order[j];
                    order[j] = tmp;
                }
        printf("Part 5 (SCC, Kosaraju):\n");
        printf("         decreasing finish-time order (book 1..):");
        for (int k = 0; k < N; k++) printf(" %d", order[k] + 1);
        printf("\n");
        int ncomp = dfs_components_order(&Gt, order, N); /* second pass on G^T */
        printf("         number of SCCs = %d\n", ncomp);
        assert(ncomp == 4);
        /* {book 2,4,5} = {index 1,3,4} form one SCC; 1,3,6 each separate */
        assert(comp[1] == comp[3]);
        assert(comp[3] == comp[4]);
        assert(comp[0] != comp[1]); /* book vertex 1 isolated */
        assert(comp[2] != comp[1]); /* book vertex 3 isolated */
        assert(comp[5] != comp[1]); /* book vertex 6 (self-loop) isolated */
        printf("         SCCs: {1}, {2,4,5}, {3}, {6}\n");
    }

    puts("all checks passed.");
    return 0;
}
`,
        notes: [
          { line: 1, zh: '★ 文件开头写明：固定输入是原书 Figure 20.2 有向图，0 基索引。' },
          { line: 176, zh: 'init_graph / add_edge：把边写进邻接表 list 与邻接矩阵 mat，并记录边号 eid。' },
          { line: 194, zh: 'build_G：按原书 Figure 20.2 建图（0 基）；同时建好转置 G^T。' },
          { line: 222, zh: '★★ Part 1：打印 V=6、|E|=8，并断言矩阵 1 的个数 = 列表长度之和 = 8。' },
          { line: 232, zh: '★★ 断言有向图矩阵不对称（mat[0][1]=1 但 mat[1][0]=0），且自环 mat[5][5]=1。' },
        ] },
      tests: [{ in: 'G = Figure 20.2 有向图', out: 'V=6, |E|=8；矩阵 36 格中恰 8 个 1' }],
      mapping: [
        { pc: 3, pcCode: 'for each vertex v ∈ G.Adj[u]', c: '`for (int i = 0; i < g->deg[u]; i++)`（第 74 行）' },
      ] },
    { type: 'analyze', title: '一张表定胜负',
      claims: [
        { expr: '\\Theta(V + E)', when: '邻接表的空间占用（有向/无向都成立）', page: 551, source: 'book' },
        { expr: '\\Theta(V^2)', when: '邻接矩阵的空间占用，与边数无关', page: 551, source: 'book' },
        { expr: '\\Theta(V^2)', when: '邻接矩阵枚举所有边的代价', page: 551, source: 'book' },
        { expr: 'O(V + E)', when: '在邻接表上求每个顶点的出度（扫一遍它的列表）', page: 552, source: 'instructor' },
      ],
      tables: [{ caption: '两种表示对照（V=6, E=8 时）', rows: [
        ['操作', '邻接表', '邻接矩阵'],
        ['空间', 'Θ(V+E)=Θ(14)', 'Θ(V²)=36 格'],
        ['查边 (u,v)', '扫 Adj[u]，最坏 O(V)', 'O(1) 看 A[u][v]'],
        ['枚举所有边', 'Θ(V+E)', 'Θ(V²)'],
      ] }],
      chart: { xMax: 64, series: [
        { name: '邻接表 Θ(V+E)，V=8', expr: '8 + x', color: '--viz-done' },
        { name: '邻接矩阵 Θ(V²)=64', expr: '64', color: '--viz-violation' },
      ] },
      derivations: [{ kind: 'space', title: '为什么邻接表是 Θ(V+E)', steps: [
        { zh: '数组 Adj 有 |V| 个表头，固定占 $\\Theta(V)$。' },
        { zh: '有向图：每条边 $(u,v)$ 恰好作为 $v$ 出现在 $Adj[u]$ 里一次，所以所有表身长度之和 $= |E|$。' },
        { zh: '无向图每条边在两个端点各出现一次，长度之和 $= 2|E|$，仍是 $\\Theta(E)$。合并得 $\\Theta(V+E)$。' },
      ] }],
      note: '' },
    { type: 'prove', title: '邻接表的空间确实是 Θ(V+E)',
      kind: 'space-bound',
      statement: 'For both directed and undirected graphs, the adjacency-list representation has the desirable property that the amount of memory it requires is Θ(V + E).',
      page: 551,
      steps: [
        { title: '上界 Θ(V+E)', en: 'The adjacency-list representation of a graph G = (V,E) consists of an array Adj of |V| lists, one for each vertex in V .', body: ['数组 Adj 本身有 |V| 个表头，占 $\\Theta(V)$。', '每个表身单元对应一条「从某顶点出发的边」；有向图下每条边恰好贡献一个单元，故表身总单元数 $= |E|$。合计 $O(V+E)$。'] },
        { title: '下界 Ω(V+E)', en: 'If G is a directed graph, the sum of the lengths of all the adjacency lists is |E|, since an edge of the form (u,v) is represented by having v appear in Adj[u].', body: ['任何表示都至少要存下 |V| 个顶点与 |E| 条边，所以空间 $\\Omega(V+E)$。', '合并上下界得 $\\Theta(V+E)$。'] },
        { title: '矩阵的对照', en: 'The adjacency matrix of a graph requires Θ(V 2 ) memory, independent of the number of edges in the graph.', body: ['矩阵无论图多稀疏都是 $|V|\\times|V|$ 格，即 $\\Theta(V^2)$，与 $|E|$ 无关——这就是它在稀疏图上的浪费。'] },
      ], conclusion: '★ 结论：稀疏图（$|E| \\ll V^2$）几乎总是选邻接表；只有需要 $O(1)$ 查边或图本身稠密时才用矩阵。' },
    { type: 'drill', title: '检验一下',
      items: [
        { kind: 'single', q: '一个有向图用邻接表存储，所有邻接表的长度之和等于多少？', options: ['|V|', '|E|', '2|E|', 'V+E'], answer: 1, why: '★★ 有向图每条边 (u,v) 只以 v 出现在 Adj[u] 一次，总和恰为 |E|。' },
        { kind: 'single', q: '用邻接矩阵判断「边 (u,v) 是否存在」的代价是？', options: ['O(1)', 'O(V)', 'O(E)', 'O(V+E)'], answer: 0, why: '★★ 直接看 A[u][v] 这一格，O(1)。' },
        { kind: 'judge', q: '邻接表的空间复杂度是 Θ(V+E)，与边数有关。', answer: true, why: '★★ 原书 p.551：内存需求是 Θ(V+E)。' },
        { kind: 'judge', q: '无向图的邻接矩阵一定是对称矩阵（A = Aᵀ）。', answer: true, why: '★★ 无向边 (u,v) 与 (v,u) 是同一回事，矩阵关于主对角线对称。' },
        { kind: 'simulate', q: '原书 Figure 20.2 有向图（6 顶点 8 边）的邻接矩阵有几格？填数字', expect: [36], placeholder: '例如：25', why: '★★ 矩阵固定 6×6 = 36 格，与边数无关。' },
        { kind: 'simulate', q: '在上面这张邻接表里，求顶点 1 的出度要扫几个邻居？填数字', expect: [2], placeholder: '例如：3', why: '★★ 顶点 1（0 基 index 0）的邻接表是 [2,4]，长度 2。' },
      ],
      bookExercises: [
        { id: '20.1-1', page: 552, star: 0, statement: 'Given an adjacency-list representation of a directed graph, how long does it take to compute the out-degree of every vertex? How long does it take to compute the in-degrees?', hint: '出度：扫一遍每个顶点的列表，Θ(V+E)。入度：邻接表下要扫「所有」列表累计，也是 Θ(V+E)；若用邻接矩阵则扫每一列 Θ(V)。' },
        { id: '20.1-3', page: 553, star: 0, statement: 'The transpose of a directed graph G = (V,E) is the graph G T = (V,E T ), where E T = f(v,u) 2 V × V W (u,v) 2 Eg. That is, G T is G with all its edges reversed. Describe efficient algorithms for computing G T from G, for both the adjacency- list and adjacency-matrix representations of G. Analyze the running times of your algorithms.', hint: '转置 = 所有边反向。邻接表：建新表，每条 (u,v) 变成 (v,u) 插入新 Adj[v]，Θ(V+E)；矩阵：A^T[u][v]=A[v][u]，Θ(V²)。C 程序 build_G 同时建好了 G^T。' },
      ] },
  ],
};
