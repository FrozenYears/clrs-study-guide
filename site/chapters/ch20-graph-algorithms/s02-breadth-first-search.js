/* 第 20 章 20.2：广度优先搜索（Breadth-first search）。印刷页 554–563。 */
export default {
  key: 's02', id: 'ch20/s02', chapter: 20, section: '20.2',
  title: '广度优先搜索：分层与最短路', shortTitle: '20.2 广度优先搜索',
  titleEn: 'Breadth-first search',
  source: { printed: [554, 562], pdf: [575, 584] },
  prerequisites: [{ label: '20.1 图的表示', url: '#/ch20/s01' }],
  stages: [
    { type: 'map', title: 'BFS 解决什么',
      why: '给定一个起点 s，怎么系统性地「走遍」从 s 能到达的所有顶点？BFS 用一条 FIFO 队列，像水波一样一层层向外扩散，并且顺手算出了从 s 到每个可达顶点的「最少边数」（无权最短路）。',
      position: '20.3 的 DFS 是它的「兄弟」：DFS 往深处钻，BFS 往宽处铺。后面拓扑排序与强连通分量都建立在 DFS 之上，而 BFS 是理解「距离」与「层」的基石。',
      unlocks: [{ label: '20.3 深度优先搜索', url: '#/ch20/s03' }],
      mathKit: [
        { title: '最短路径距离', body: '$\\delta(s,v)$ = 从 s 到 v 的最少边数；不可达时记为 $\\infty$。BFS 结束时 $v.d = \\delta(s,v)$。' },
        { title: '队列不变量', body: '任意时刻队列里的顶点，其 $d$ 值要么全相等，要么恰好是 $k$ 和 $k+1$ 两档。' },
      ] },
    { type: 'intuition', title: '向池塘里扔一颗石子', scene: '平静水面上，石子落点就是起点 s。',
      body: [
        '涟漪一圈圈向外推：先碰到离 s 一步的邻居（距离 1），再碰到离 s 两步的（距离 2）……这就是 BFS 的「按层扩散」。',
        '为了不重复、不漏掉，BFS 给每个顶点涂色：白=还没发现，灰=已在队列里（在波前），黑=已经处理完它的所有邻居（落在波后）。',
        'C 程序 Part 2 用原书 Figure 20.2 的图、从顶点 1 起 BFS：得到 d = [0,1,∞,1,2,∞]（不可达的顶点标 ∞），并据此还原出一棵广度优先树。',
      ], interactive: { text: '' } },
    { type: 'source', title: '书上是怎么说的',
      blocks: [
        { kind: 'body', page: 554, en: 'Given a graph G = (V,E) and a distinguished source vertex s , breadth-first search systematically explores the edges of G to "discover" every vertex that is reachable from s . It computes the distance from s to each reachable vertex, where the distance to a vertex v equals the smallest number of edges needed to go from s to v. Breadth-first search also produces a "breadth-first tree" with root s that contains all reachable vertices.',
          zh: '★★ BFS 从起点 s 系统性地探索边，算出到每个可达顶点的距离（最少边数），并产出一棵以 s 为根的广度优先树。' },
        { kind: 'body', page: 554, en: 'Breadth-first search is so named because it expands the frontier between discovered and undiscovered vertices uniformly across the breadth of the frontier. You can think of it as discovering vertices in waves emanating from the source vertex.',
          zh: '★★ 名字来源：它在波前的「宽度」上均匀扩张，像从源点发出的一圈圈波。' },
        { kind: 'body', page: 554, en: 'That is, starting from s , the algorithm first discovers all neighbors of s , which have distance 1. Then it discovers all vertices with distance 2, then all vertices with distance 3, and so on, until it has discovered every vertex reachable from s .',
          zh: '★★ 先发现 s 的所有距离-1 邻居，再距离 2、距离 3……直到所有可达顶点。' },
        { kind: 'body', page: 554, en: 'To keep track of progress, breadth-first search colors each vertex white, gray, or black. All vertices start out white, and vertices not reachable from the source vertex s stay white the entire time. A vertex that is reachable from s is discovered the first time it is encountered during the search, at which time it becomes gray, in- dicating that is now on the frontier of the search: the boundary between discovered and undiscovered vertices.',
          zh: '★★ 白=未发现；灰=在波前（已入队）；黑=邻居已全扫描（波后）。不可达顶点全程白。' },
        { kind: 'body', page: 555, en: 'Breadth-first search constructs a breadth-first tree, initially containing only its root, which is the source vertex s . Whenever the search discovers a white vertex v in the course of scanning the adjacency list of a gray vertex u, the vertex v and the edge (u,v) are added to the tree. We say that u is the predecessor or parent of v in the breadth-first tree.',
          zh: '★★ 发现白顶点 v 时，把边 (u,v) 收进树，称 u 是 v 在广度优先树里的「前驱 / 父」。' },
        { kind: 'body', page: 558, en: 'The operations of enqueuing and dequeuing take O(1) time, and so the total time devoted to queue operations is O(V) . Because the procedure scans the adjacency list of each vertex only when the vertex is dequeued, it scans each adjacency list at most once. Since the sum of the lengths of all |V| adjacency lists is Θ(E), the total time spent in scanning adjacency lists is O(V + E). The overhead for initialization is O(V) , and thus the total running time of the BFS procedure is O(V + E).',
          zh: '★★ 入队/出队 O(1)；每个邻接表最多扫一次，合计 Θ(E)；加上初始化 O(V)，总运行时间 O(V + E)。' },
        { kind: 'theorem', page: 560, en: 'Suppose that BFS is run on G from a given source vertex s 2 V . Then, during its execution, BFS discovers every vertex v 2 V that is reachable from the source s , and upon termination, v: d = i(s,v) for all v 2 V . Moreover, for any vertex v ≠ s that is reachable from s , one of the shortest paths from s to v is a shortest path from s to v:Ω followed by the edge (v:Ω; v) .',
          zh: '★★ 定理 20.5：BFS 发现所有可达顶点，且终止时 v.d = δ(s,v)；最短路径可由前驱链拼出。' },
      ],
      terms: [
        { en: 'breadth-first search', zh: '广度优先搜索（BFS）', page: 554 },
        { en: 'breadth-first tree', zh: '广度优先树', page: 555 },
        { en: 'predecessor', zh: '前驱 / 父结点 v.π', page: 555 },
      ] },
    { type: 'pseudocode', title: 'BFS：11 行', algo: 'BFS', signature: 'BFS(G, s)', page: 555,
      lines: [
        { n: 1, code: 'for each vertex u ∈ G.V − {s}', zh: '除 s 外每个顶点……' },
        { n: 2, code: '    u.color = WHITE', zh: '★ 初始全白。' },
        { n: 3, code: '    u.d = ∞', zh: '距离先设为无穷。' },
        { n: 4, code: '    u.π = NIL', zh: '前驱为空。' },
        { n: 5, code: 's.color = GRAY', zh: '★ s 先变灰并入队。' },
        { n: 6, code: 's.d = 0', zh: 's 到自己的距离是 0。' },
        { n: 7, code: 's.π = NIL', zh: '' },
        { n: 8, code: 'Q = ∅', zh: 'FIFO 队列。' },
        { n: 9, code: 'ENQUEUE(Q, s)', zh: '' },
        { n: 10, code: 'while Q ≠ ∅', zh: '★ 队列空 = 波前消失 = 结束。' },
        { n: 11, code: '    u = DEQUEUE(Q)', zh: '取队头灰顶点。' },
        { n: 12, code: '    for each vertex v ∈ G.Adj[u]', zh: '★★ 扫描 u 的邻居。' },
        { n: 13, code: '        if v.color == WHITE', zh: '★ 白顶点 = 刚被发现。' },
        { n: 14, code: '            v.color = GRAY', zh: '' },
        { n: 15, code: '            v.d = u.d + 1', zh: '★★ 距离 +1。' },
        { n: 16, code: '            v.π = u', zh: '★ 记下前驱。' },
        { n: 17, code: '            ENQUEUE(Q, v)', zh: '' },
        { n: 18, code: '    u.color = BLACK', zh: '★ u 的邻居扫完，变黑。' },
      ],
      vars: [
        { name: 'u.d', meaning: '从 s 到 u 的最短距离（边数）' },
        { name: 'u.π', meaning: '广度优先树里 u 的父结点' },
      ],
      note: '★★ BFS 运行时间 Θ(V + E)：每条邻接表至多扫一次。树的形状取决于邻接表顺序，但 d 值不受影响。',
      more: [] },
    { type: 'visualize', title: '看见 BFS 树与分层',
      panels: [
        { title: '① 从顶点 1 起 BFS 得到的广度优先树（C 程序 Part 2）', viz: 'tree', vizMode: 'tree',
          trees: [{ root: { label: '1 (d=0)', children: [
            { label: '2 (d=1)', children: [{ label: '5 (d=2)' }] },
            { label: '4 (d=1)', children: [{ label: '—' }] },
          ] } }],
          treeNotes: ['★ 根 1 是起点；它的邻居 2、4 距离 1；2 的邻居 5 距离 2。',
            '顶点 3、6 从 1 不可达，不在树里（d = ∞）。',
            '树边 = 前驱关系：2.π=1, 4.π=1, 5.π=2。'] },
        { title: '② 运行时间 Θ(V+E)', viz: 'growth',
          chart: { xMax: 64, series: [
            { name: 'BFS Θ(V+E)', expr: 'x', color: '--viz-done' },
            { name: '邻接矩阵下 Θ(V²)', expr: 'x * x', color: '--viz-violation' },
          ] },
          note: '★ 稀疏图上 BFS 线性于边数；若用邻接矩阵枚举邻居则退化成 Θ(V²)。' },
      ],
      tasks: ['对照原书 Figure 20.3：灰顶点在队列里，黑顶点在波后，蓝边是树边。'] },
    { type: 'code', title: 'C 实现：BFS 打印层次与最短路',
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
          { line: 67, zh: '★ bfs()：白/灰/黑三色 + d[] + pred[]，用数组当 FIFO 队列。' },
          { line: 245, zh: '★★ Part 2：从顶点 1 起 BFS，打印 d[]、可达数、树边数、各层顶点数。' },
          { line: 250, zh: '★★ 断言 d[1]=0, d[2]=1, d[4]=1, d[5]=2，顶点 3、6 不可达（d=∞）。' },
        ] },
      tests: [{ in: '从顶点 1 起 BFS（Figure 20.2）', out: 'd=[0,1,∞,1,2,∞]；可达 4 个，树边 3 条，层 0/1/2 各 1/2/1 个' }],
      mapping: [
        { pc: 11, pcCode: 'u = DEQUEUE(Q)', c: '`int u = q[h++];`（第 79 行）' },
        { pc: 15, pcCode: 'v.d = u.d + 1', c: '`d[v] = d[u] + 1;`（第 84 行）' },
      ] },
    { type: 'analyze', title: '为什么是 Θ(V+E) 且给出最短路',
      claims: [
        { expr: '\\Theta(V + E)', when: 'BFS 的运行时间（邻接表表示）', page: 558, source: 'book' },
        { expr: 'v.d = \\delta(s,v)', when: 'BFS 终止时，每个可达顶点 v 的 d 恰为最短路径距离', page: 560, source: 'book' },
        { expr: 'O(V + E)', when: '从 s 可达的顶点数（≤ 全部 V）', page: 558, source: 'instructor' },
        { expr: '\\text{不变}', when: '队列里顶点的 d 要么全相等，要么恰为 k 与 k+1 两档', page: 559, source: 'book' },
      ],
      tables: [{ caption: 'BFS 关键不变量与结论（原书 p.559–560）', rows: [
        ['事实', '内容', '出处'],
        ['引理 20.1', '任意边 (u,v)：δ(s,v) ≤ δ(s,u) + 1', 'p.558'],
        ['引理 20.2', '全程 v.d ≥ δ(s,v)', 'p.559'],
        ['引理 20.3/20.4', '队列 d 值单调、相邻', 'p.559–560'],
        ['定理 20.5', '终止时 v.d = δ(s,v)', 'p.560'],
      ] }],
      chart: { xMax: 64, series: [
        { name: 'BFS Θ(V+E)', expr: 'x', color: '--viz-done' },
        { name: '矩阵代价 Θ(V²)', expr: 'x * x', color: '--viz-violation' },
      ] },
      derivations: [{ kind: 'summation', title: '运行时间 Θ(V+E) 怎么来的', steps: [
        { zh: '初始化：每个顶点涂色、置 ∞、置 NIL，共 $O(V)$。' },
        { zh: '每个顶点至多入队、出队各一次，队列操作 $O(1)$，合计 $O(V)$。' },
        { zh: '每个邻接表只在对应顶点出队时被扫一次；所有表长之和 $\\Theta(E)$，故扫描 $O(E)$。' },
        { tex: 'T_{\\text{BFS}} = O(V) + O(V) + O(E) = \\Theta(V + E)', zh: '★★ 线性于邻接表规模。' },
      ] }],
      note: '' },
    { type: 'prove', title: '定理 20.5：BFS 给出最短路径距离',
      kind: 'shortest-path-correctness',
      statement: 'Suppose that BFS is run on G from a given source vertex s ∈ V . Then, during its execution, BFS discovers every vertex v ∈ V that is reachable from the source s , and upon termination, v.d = δ(s,v) for all v ∈ V .',
      page: 560,
      steps: [
        { title: '上界：v.d ≥ δ(s,v)', en: 'Let G = (V,E) be a directed or undirected graph, and suppose that BFS is run on G from a given source vertex s 2 V . Then, for each vertex v 2 V , the value v: d computed by BFS satisfies v: d ≥ i(s,v) at all times, including at termination.', body: ['归纳基础：入队 s 后 s.d=0=δ(s,s)，其余 v.d=∞≥δ(s,v)。', '归纳步：白顶点 v 由灰顶点 u 发现时，v.d = u.d+1 ≥ δ(s,u)+1 ≥ δ(s,v)（引理 20.1）。', 'v 之后不再入队，d 不变，故全程成立。'] },
        { title: '反证：v.d 不能大于 δ(s,v)', en: 'Proof Assume for the purpose of contradiction that some vertex receives a d value not equal to its shortest-path distance.', body: ['设 v 是「d 不等于最短路距离」里 δ(s,v) 最小者，则 v.d > δ(s,v)。', 'v 必可达（否则 δ=∞≥v.d，矛盾）。取最短路倒数第二顶点 u，有 δ(s,u)+1=δ(s,v) < v.d。', '由 u.d=δ(s,u)，分 v 白/灰/黑三种情况都推出 v.d ≤ u.d+1 = δ(s,v)，与假设矛盾。'] },
        { title: '结论', en: 'Thus we conclude that v: d = i(s,v) for all v 2 V .', body: ['故对所有可达 v 有 v.d=δ(s,v)；不可达者 d=∞ 也一致。', '前驱链 v.π→…→s 拼出的就是一条最短路径（边数为 δ(s,v)）。'] },
      ],
      conclusion: '★ 结论：BFS 不仅跑得线性快，还顺手把无权图最短路与广度优先树一并算了出来。' },
    { type: 'drill', title: '检验一下',
      items: [
        { kind: 'single', q: '在邻接表表示的图上，BFS 的运行时间是？', options: ['Θ(V)', 'Θ(V+E)', 'Θ(V²)', 'Θ(E lg V)'], answer: 1, why: '★★ 每个邻接表至多扫一次，合计 Θ(V+E)（原书 p.558）。' },
        { kind: 'single', q: '从 s 起 BFS 结束时，可达顶点 v 的 v.d 等于？', options: ['v 的入度', 'δ(s,v) 最短路距离', '图的直径', '∞'], answer: 1, why: '★★ 定理 20.5：v.d = δ(s,v)。' },
        { kind: 'judge', q: 'BFS 广度优先树的形状与邻接表里邻居的访问顺序无关，但算出的 d 值会因顺序而不同。', answer: false, why: '★★ 原书 p.556：树可能变，但 d 值不变。' },
        { kind: 'judge', q: 'BFS 用一个 FIFO 队列，保证按距离分层扩散。', answer: true, why: '★★ 队列里顶点的 d 至多差 1，正是「按层」的体现。' },
        { kind: 'simulate', q: '原书 Figure 20.2 从顶点 1 起 BFS，顶点 5（0 基 index 4）的 d 是多少？填数字', expect: [2], placeholder: '例如：1', why: '★★ 1→2→5 两条边，d=2（C 程序 Part 2 实测）。' },
        { kind: 'simulate', q: '同一张图从顶点 1 起 BFS，顶点 3、6 的 d 是多少（不可达记 -1）？填两个数', expect: [-1, -1], placeholder: '例如：0 0', why: '★★ 顶点 3、6 从 1 不可达，d=∞（C 程序记 -1）。' },
      ],
      bookExercises: [
        { id: '20.2-3', page: 562, star: 0, statement: 'Show that using a single bit to store each vertex color suffices by arguing that the BFS procedure produces the same result if line 18 is removed. Then show how to obviate the need for vertex colors altogether.', hint: '矩阵下每个顶点的邻居要扫整行 O(V)，总 Θ(V²)。要回到 Θ(V+E) 只能对每个「还白着的」顶点另开邻接表，或预先由矩阵建出邻接表。' },
        { id: '20.2-5', page: 563, star: 0, statement: 'Argue that in a breadth-first search, the value u: d assigned to a vertex u is inde- pendent of the order in which the vertices appear i n each adjacency list. Using Figure 20.3 as an example, show that the breadth-first tree computed by BFS can depend on the ordering within adjacency lists.', hint: '距离只取决于「第几层被发现」，与同层内邻居的先后无关——靠引理 20.3/20.4 的队列单调性。' },
      ] },
  ],
};
