/* 第 20 章 20.3：深度优先搜索（Depth-first search）。印刷页 563–572。 */
export default {
  key: 's03', id: 'ch20/s03', chapter: 20, section: '20.3',
  title: '深度优先搜索：时间戳与边分类', shortTitle: '20.3 深度优先搜索',
  titleEn: 'Depth-first search',
  source: { printed: [563, 572], pdf: [584, 593] },
  prerequisites: [{ label: '20.2 广度优先搜索', url: '#/ch20/s02' }],
  stages: [
    { type: 'map', title: 'DFS 解决什么',
      why: 'BFS 往宽处铺，DFS 往深处钻：沿着一条路走到头，走不动了再「回溯」换一条。它给每个顶点盖下「发现时间 u.d」和「完成时间 u.f」两个时间戳，并由此引出括号化定理、边分类这套理解图结构的利器。',
      position: 'DFS 是本章后半段的主引擎——20.4 拓扑排序、20.5 强连通分量都是「在 DFS 上做文章」。它的时间戳与边分类是后面所有证明的支点。',
      unlocks: [{ label: '20.4 拓扑排序', url: '#/ch20/s04' }],
      mathKit: [
        { title: '时间戳区间', body: '每个顶点 $v$ 有区间 $[v.d, v.f] \\subseteq [1, 2|V|]$；区间的嵌套关系 = 树里的祖先/后代关系。' },
        { title: '四种边', body: '树边 / 后向边（指向祖先，含自环）/ 前向边（指向非树后代）/ 横向边（其余）。' },
      ] },
    { type: 'intuition', title: '走迷宫只带一支粉笔', scene: '你走进一座迷宫，每条岔路都走到底，撞墙就原路返回。',
      body: [
        'DFS 就像只带粉笔的迷宫客：进一个房间就记下「进入时间」，沿一条没走过的通道一直走到死胡同，再沿原路退回上一个还能走的房间。',
        '每个房间（顶点）因此得到两个时间：第一次踏进来（u.d）和彻底走完它的所有通道离开（u.f）。',
        'C 程序 Part 3 在 Figure 20.2 的图上跑 DFS，得到 d = [1,2,9,4,3,10]、f = [8,7,12,5,6,11]，并把 8 条边分成 树边 4 / 后向边 2 / 前向边 1 / 横向边 1。',
      ], interactive: { text: '' } },
    { type: 'source', title: '书上是怎么说的',
      blocks: [
        { kind: 'body', page: 564, en: 'The procedure DFS on the facing page records when i t discovers vertex u in the attribute u: d and when it finishes vertex u in the attribute u: f . These timestamps are integers between 1 and 2 |V|, since there is one discovery event and one finishing event for each of the |V| vertices. For every vertex u, u: d <u: f : (20.4)',
          zh: '★★ 每个顶点有发现时间 u.d 与完成时间 u.f，取值 1..2|V|，且 u.d < u.f。' },
        { kind: 'body', page: 566, en: 'What is the running time of DFS? The loops on lines 1–3 and lines 5–7 of DFS take Θ(V) time, exclusive of the time to execute the calls to DFS-VISIT . As we did for breadth-first search, we use aggregate analysis. The procedure DFS-VISIT is called exactly once for each vertex v 2 V , since the vertex u on which DFS-VISIT is invoked must be white and the first thing DFS-VISIT does is paint vertex u gray.',
          zh: '★★ DFS 运行时间 Θ(V + E)：DFS-VISIT 每个顶点恰调用一次，内层总代价 Θ(E)。' },
        { kind: 'theorem', page: 567, en: 'In any depth-first search of a (directed or undirected) graph G = (V,E) , for any two vertices u and v, exactly one of the following three conditions holds: • the intervals [u: d,u: f ] and [v: d,v: f ] are entirely disjoint, and neither u nor v is a descendant of the other in the depth-first forest, • the interval [u: d,u: f ] is contained entirely within the interval [v: d,v: f ], and u is a descendant of v in a depth-first tree, or • the interval [v: d,v: f ] is contained entirely within the interval [u: d,u: f ], and v is a descendant of u in a depth-first tree.',
          zh: '★★ 定理 20.7（括号化）：任意两顶点的时间区间要么不交，要么一个完整套在另一个里（对应后代关系）。' },
        { kind: 'body', page: 569, en: 'The depth-first forest G − produced by a depth-first search on graph G can contain four types of edges: 1. Tree edges are edges in the depth-first forest G − . Edge (u,v) is a tree edge if v was first discovered by exploring edge (u,v) . 2. Back edges are those edges (u,v) connecting a vertex u to an ancestor v in a depth-first tree. We consider self-loops, which may occur in directed graphs, to be back edges. 3. Forward edges are those nontree edges (u,v) connecting a vertex u to a proper descendant v in a depth-first tree. 4. Cross edges are all other edges.',
          zh: '★★ 深度优先森林含四类边：树边 / 后向边（含自环）/ 前向边 / 横向边。' },
        { kind: 'theorem', page: 570, en: 'In a depth-first search of an undirected graph G, every edge of G is either a tree edge or a back edge.',
          zh: '★★ 定理 20.10：无向图的 DFS 里每条边非树即后向边——没有前向边与横向边。' },
      ],
      terms: [
        { en: 'depth-first search', zh: '深度优先搜索（DFS）', page: 564 },
        { en: 'depth-first forest', zh: '深度优先森林', page: 564 },
        { en: 'back edge', zh: '后向边（指向祖先，含自环）', page: 569 },
      ] },
    { type: 'pseudocode', title: 'DFS + DFS-VISIT', algo: 'DFS', signature: 'DFS(G)', page: 565,
      lines: [
        { n: 1, code: 'for each vertex u ∈ G.V', zh: '逐个顶点。' },
        { n: 2, code: '    u.color = WHITE', zh: '★ 初始全白。' },
        { n: 3, code: '    u.π = NIL', zh: '' },
        { n: 4, code: 'time = 0', zh: '全局时间戳。' },
        { n: 5, code: 'for each vertex u ∈ G.V', zh: '★ 白顶点才作为新根发起。' },
        { n: 6, code: '    if u.color == WHITE', zh: '' },
        { n: 7, code: '        DFS-VISIT(G, u)', zh: '★ 从 u 长出一棵树。' },
      ],
      vars: [
        { name: 'u.d / u.f', meaning: '顶点 u 的发现 / 完成时间' },
        { name: 'u.π', meaning: 'DFS 森林里 u 的父结点' },
      ],
      note: '★★ 单次 DFS 可能产出「森林」（多个根），因为图不一定从一点全连通。',
      more: [{ algo: 'DFS-VISIT', subtitle: 'DFS-VISIT(G, u)：递归深挖一条路', signature: 'DFS-VISIT(G, u)', page: 565,
        lines: [
          { n: 1, code: 'time = time + 1', zh: '★ 进入即盖发现时间。' },
          { n: 2, code: 'u.d = time', zh: 'u.d = 当前时间。' },
          { n: 3, code: 'u.color = GRAY', zh: '变灰。' },
          { n: 4, code: 'for each vertex v ∈ G.Adj[u]', zh: '★★ 探索每条边 (u,v)。' },
          { n: 5, code: '    if v.color == WHITE', zh: '白顶点 = 新发现。' },
          { n: 6, code: '        v.π = u', zh: '记下父。' },
          { n: 7, code: '        DFS-VISIT(G, v)', zh: '★ 递归下钻。' },
          { n: 8, code: 'time = time + 1', zh: '' },
          { n: 9, code: 'u.f = time', zh: '★ 离开即盖完成时间。' },
          { n: 10, code: 'u.color = BLACK', zh: '变黑。' },
        ],
        vars: [{ name: 'time', meaning: '全局单调时间戳计数器' }],
        note: '★★ 递归调用栈的「深度」正好等于当前灰色顶点的链长——这是后向边判定（见到灰顶点）的依据。' }] },
    { type: 'visualize', title: '看见 DFS 森林与时间戳',
      panels: [
        { title: '① 在 Figure 20.2 上 DFS 得到的两棵树（C 程序 Part 3）', viz: 'tree', vizMode: 'tree',
          trees: [
            { root: { label: '1 [1,8]', children: [
              { label: '2 [2,7]', children: [
                { label: '5 [3,6]', children: [{ label: '4 [4,5]' }] },
              ] },
            ] } },
            { root: { label: '3 [9,12]', children: [{ label: '6 [10,11]' }] } },
          ],
          treeNotes: ['★ 树 1 根为顶点 1（d=1,f=8），链 1→2→5→4 是 DFS 下钻路径。',
            '★ 树 2 根为顶点 3（d=9,f=12），边 3→6 是另一条 DFS-VISIT。',
            '★ 区间 [4,5]⊂[3,6]⊂[2,7]⊂[1,8] 完整嵌套 = 后代关系（定理 20.7）。'] },
        { title: '② 四类边的数量（C 程序 Part 3 实测）', viz: 'growth',
          chart: { xMax: 8, series: [
            { name: '树边 4', expr: '4', color: '--viz-done' },
            { name: '后向边 2', expr: '2', color: '--viz-violation' },
            { name: '前向边 1', expr: '1', color: '--viz-compare' },
            { name: '横向边 1', expr: '1', color: '--viz-mark' },
          ] },
          note: '★ 共 8 条边全部分类；后向边含自环 6→6，证明该图含环。' },
      ],
      tasks: ['对照原书 Figure 20.4：边上标 T/B/F/C，顶点内是 d/f。'] },
    { type: 'code', title: 'C 实现：DFS 时间戳与边分类',
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
          { line: 99, zh: '★ dfs_visit()：递归；进入盖 u.d、离开盖 u.f，按 v 颜色分四类边。' },
          { line: 121, zh: '★ dfs()：对每个白顶点发起一次 DFS-VISIT，跑完填 d[]/f[]。' },
          { line: 285, zh: '★★ Part 3：打印 d、f，断言 8 条边的分类（树4/后向2/前向1/横向1）。' },
          { line: 289, zh: '★★ 断言 d=[1,2,9,4,3,10]、f=[8,7,12,5,6,11]。' },
        ] },
      tests: [{ in: '在 Figure 20.2 上 DFS', out: 'd=[1,2,9,4,3,10], f=[8,7,12,5,6,11]；树4/后向2/前向1/横向1' }],
      mapping: [
        { pc: 1, pcCode: 'time = time + 1', c: '`gt++;`（第 100 行）' },
        { pc: 2, pcCode: 'u.d = time', c: '`gd[u] = gt;`（第 101 行）' },
        { pc: 4, pcCode: 'for each vertex v ∈ G.Adj[u]', c: '`for (int i = 0; i < gcur->deg[u]; i++)`（第 104 行）' },
      ] },
    { type: 'analyze', title: '为什么 Θ(V+E) 且时间戳有意义',
      claims: [
        { expr: '\\Theta(V + E)', when: 'DFS 的运行时间', page: 566, source: 'book' },
        { expr: 'u.d, u.f \\in [1, 2|V|]', when: '每个顶点的时间戳范围', page: 564, source: 'book' },
        { expr: '4', when: '有向图 DFS 森林里可能出现的边类型数', page: 569, source: 'book' },
        { expr: '2', when: '无向图 DFS 只出现「树边 + 后向边」两类', page: 570, source: 'book' },
      ],
      tables: [{ caption: '边分类判定（边 (u,v) 第一次被探索时看 v 的颜色）', rows: [
        ['v 的颜色', '边类型', '含义'],
        ['WHITE', '树边', 'v 由此次发现'],
        ['GRAY', '后向边', 'v 是 u 的祖先（含自环）'],
        ['BLACK', '前向/横向', 'u.d < v.d 为前向，否则横向'],
      ] }],
      chart: { xMax: 64, series: [
        { name: 'DFS Θ(V+E)', expr: 'x', color: '--viz-done' },
        { name: 'naive Θ(V²)', expr: 'x * x', color: '--viz-violation' },
      ] },
      derivations: [{ kind: 'summation', title: '运行时间 Θ(V+E)', steps: [
        { zh: 'DFS 外层两个循环各扫一遍顶点，初值 $O(V)$。' },
        { zh: 'DFS-VISIT 对每个顶点恰调用一次（白顶点才被调，且一调就变灰）。' },
        { tex: '\\sum_{v\\in V}|Adj[v]| = \\Theta(E)', zh: '故第 4–7 行总代价 $\\Theta(E)$。' },
        { tex: 'T_{\\text{DFS}} = \\Theta(V) + \\Theta(E) = \\Theta(V + E)', zh: '★★ 与 BFS 同阶。' },
      ] }],
      note: '' },
    { type: 'prove', title: '定理 20.7：括号化结构',
      kind: 'parenthesis-theorem',
      statement: 'In any depth-first search of a (directed or undirected) graph G = (V,E) , for any two vertices u and v, exactly one of the following three conditions holds: the intervals [u.d,u.f] and [v.d,v.f] are entirely disjoint; or [u.d,u.f] is contained entirely within [v.d,v.f] and u is a descendant of v; or [v.d,v.f] is contained entirely within [u.d,u.f] and v is a descendant of u.',
      page: 567,
      steps: [
        { title: '情况一：区间不交', en: 'The first subcase occurs when v: d <u: f , so that v was discovered while u was still gray, which implies that v is a descendant of u.', body: ['若 $u.d < v.d < u.f$，则 $v$ 在 $u$ 还灰时被发现，必是 $u$ 的后代，区间 $[v.d,v.f] \\subset [u.d,u.f]$。', '若 $u.f < v.d$，则 $u.d < u.f < v.d < v.f$，两区间不交，互不后代。'] },
        { title: '情况二：完整嵌套', en: 'In this case, therefore, the interval [v: d,v: f ] is entirely contained within the interval [u: d,u: f ].', body: ['嵌套关系恰等于深度优先树里的祖先/后代关系：后代的区间一定完整套在祖先区间内。'] },
        { title: '互斥且穷尽', en: 'exactly one of the following three conditions holds', body: ['三种情况按「谁先被发现、区间是否重叠」划分，两两互斥且覆盖所有可能对，故恰好一种成立。'] },
      ],
      conclusion: '★ 结论：把每个顶点按 d/f 画成括号，得到的表达式一定合法嵌套——这正是「后代 ⊆ 区间」的几何直观。' },
    { type: 'drill', title: '检验一下',
      items: [
        { kind: 'single', q: '在邻接表表示的图上，DFS 的运行时间是？', options: ['Θ(V)', 'Θ(V+E)', 'Θ(V²)', 'Θ(E lg V)'], answer: 1, why: '★★ DFS-VISIT 每顶点一次，内层合计 Θ(E)（原书 p.566）。' },
        { kind: 'single', q: 'DFS 给每个顶点的时间戳 u.d、u.f 落在哪个范围？', options: ['[0, |V|]', '[1, 2|V|]', '[1, |V|²]', '[−∞, ∞]'], answer: 1, why: '★★ 每个顶点一次发现 + 一次完成，共 2|V| 个事件（原书 p.564）。' },
        { kind: 'judge', q: '无向图的 DFS 里可能出现前向边和横向边。', answer: false, why: '★★ 定理 20.10：无向图每条边非树即后向边，没有前向/横向边。' },
        { kind: 'judge', q: '若一条边 (u,v) 第一次被探索时 v 是灰色，则它是后向边（指向祖先）。', answer: true, why: '★★ 灰色顶点恰是当前 DFS-VISIT 递归栈里的祖先链。' },
        { kind: 'simulate', q: '原书 Figure 20.2 上 DFS，顶点 4（0 基 index 3，书顶点 4）的完成时间 f 是多少？填数字', expect: [5], placeholder: '例如：6', why: '★★ Part 3 实测 f[3]=5（区间 [4,5]）。' },
        { kind: 'single', q: '同一 DFS 中，边 6→6（自环）被分类成哪种边？', options: ['树边', '**后向边**', '前向边', '横向边'], answer: 1, why: '★★ 自环视为后向边（C 程序 Part 3 实测）。' },
      ],
      bookExercises: [
        { id: '20.3-2', page: 571, star: 0, statement: 'Show how depth-first search works on the graph of Figure 20.6. Assume that the for loop of lines 5–7 of the DFS procedure considers the vertices in alphabetical order, and assume that each adjacency list is order ed alphabetically. Show the discovery and finish times for each vertex, and show the classification of each edge.', hint: '按题面两条字母序约定死板地跑：外层结点按字母序、每条邻接表也按字母序。每个结点记下 d 与 f，再拿区间关系给每条边定性 —— 树边是「首次发现」，后向边指向还灰着的祖先，前向边与横边分别对应区间真包含与完全错开。' },
        { id: '20.3-5', page: 571, star: 0, statement: 'Show that in a directed graph, edge (u,v) is a. a tree edge or forward edge if and only if u: d <v: d <v: f <u: f , b. a back edge if and only if v: d ≤ u: d <u: f ≤ v: f , and c. a cross edge if and only if v: d <v: f <u: d <u: f .', hint: '六个方向都要证，工具只有两件：括号化定理（u 是 v 的祖先 ⟺ v 的区间被 u 真包含）与「有向边 (u,v) 满足 u.d < v.d」。a 就是祖先判据本身；b 反过来用包含关系；c 用「区间不重叠且 v 先结束」。' },
      ] },
  ],
};
