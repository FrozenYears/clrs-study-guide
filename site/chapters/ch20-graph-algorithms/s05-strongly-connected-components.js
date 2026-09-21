/* 第 20 章 20.5：强连通分量（Strongly connected components）。印刷页 615–620（pdf 636–641）。 */
export default {
  key:'s05',id:'ch20/s05',chapter:20,section:'20.5',
  title:'强连通分量：两次 DFS 定乾坤',shortTitle:'20.5 强连通分量',
  titleEn:'Strongly connected components',
  source:{printed:[576,581],pdf:[597,599]},
  prerequisites:[{label:'20.4 Topological sort',url:'#/ch20/s04'}],
  stages:[
   {type:'map',title:'互相可达的"抱团"',
    why:'强连通分量（SCC）：极大顶点集，内部任意两点互相可达。**两次 DFS** 即可线性时间求出全部 SCC —— 用转置图 $G^T$ 与第一次 DFS 的完成时间排序。',
    position:'20 章收尾，也是 DFS 三连应用的终点（拓扑排序 → 边分类 → SCC）。19 章的并查集不适用这里（SCC 不是等价关系的并查维护，需要全局信息）。',
    unlocks:[{label:'21.1 Growing a minimum spanning tree',url:'#/ch21/s01'}],
    mathKit:[
     {title:'强连通',body:'$u \\rightsquigarrow v$ 且 $v \\rightsquigarrow u$（互相可达）—— 是等价关系。'},
     {title:'转置图',body:'$G^T = (V, E^T)$：每条边反向；$G$ 与 $G^T$ 的 SCC **完全相同**。'},
     {title:'算法',body:'① DFS(G) 记完成时间 → ② $G^T$ 上按**完成时间递减**再 DFS → 每棵树一个 SCC。'},
    ]},
   {type:'intuition',title:'为什么第二次 DFS 要按完成时间递减',scene:'Figure 20.9 的图（C 程序 Part 5）',body:[
     '直觉：第一次 DFS 里**完成得最晚**的结点，一定属于一个"上游"SCC（它能到很多地方，别的 SCC 到不了它）。在 $G^T$ 里方向反转 —— 上游 SCC 变下游 —— 从它出发的第二遍 DFS 恰好只能扫到**它自己的分量**。',
     '★ C 程序 Part 5：完成时间递减序 3,6,1,2,5,4 → 第二次 DFS 找出 **4 个 SCC**：{1}、{2,4,5}、{3}、{6}（原书 Figure 20.9 的答案）。',
     '★ 分量图 $G^{SCC}$ 是 **DAG**（引理 20.6）—— 这就是第二次 DFS 按"递减完成时间"访问的合法性来源。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 v 2 C 代表 v ∈ C）。',blocks:[
     {kind:'body',page:576,en:'Recall from Appendix B that a strongly connected component of a directed graph G = (V,E) is a maximal set of vertices C \u2286 V such that for every pair of vertices u,v 2 C , both u \u2192 v and v \u2192 u, that is, vertices u and v are reachable from each other.',
      zh:'★ SCC 的定义：极大互相可达集。'},
     {kind:'body',page:576,en:'The linear-time (i.e., \u0398(V + E)-time) procedure STRONGLY-CONNECTED-COMPONENTS on the next page computes the strongly connected components of a directed graph G = (V,E) using two depth-first searches, one on G and one on G T .',
      zh:'★★ 线性时间 + 两次 DFS —— 全算法的骨架。'},
     {kind:'body',page:577,en:'The following lemma gives the key property that the component graph is acyclic.',
      zh:'★★ 关键引理：分量图 $G^{SCC}$ 无环。'},
     {kind:'body',page:577,en:'We\u2019ll see that the algorithm uses this property to visit the vertices of the component graph in topologically sorted order, by considering vertices in the second depthfirst search in decreasing order of the finish times that were computed in the first depth-first search.',
      zh:'★★ 算法如何"借"这个性质：第二次 DFS 按第一次的完成时间递减访问 —— 分量图被按拓扑序处理。'},
    ],terms:[{en:'strongly connected component',zh:'强连通分量（SCC）',page:576},
              {en:'reachable from each other',zh:'互相可达（强连通的定义）',page:576}]},
   {type:'pseudocode',title:'STRONGLY-CONNECTED-COMPONENTS：4 行',algo:'STRONGLY-CONNECTED-COMPONENTS',signature:'STRONGLY-CONNECTED-COMPONENTS(G)',page:577,
    lines:[
     {n:1,code:'call DFS(G) to compute finish times u.f',zh:'★ 第一遍：原图。'},
     {n:2,code:'compute G T',zh:'转置：所有边反向。'},
     {n:3,code:'call DFS(G T ), but consider vertices in order of decreasing u.f',zh:'★★ 第二遍：按 f 递减。'},
     {n:4,code:'output the vertices of each tree in the depth-first forest of step 3 as a separate strongly connected component',zh:'每棵树 = 一个 SCC。'}],
    vars:[{name:'G^T',meaning:'边全部反向的图'}],
    note:'★ 4 行算法两次线性扫描 —— 总代价 Θ(V + E)。',
    more:[]},
   {type:'visualize',title:'看见四个 SCC',panels:[
     {title:'C 程序 Part 5：分量结果（原书 Figure 20.9）',viz:'tree',vizMode:'tree',
      trees:[{root:{"label": "SCC × 4", "cost": "分量图 G^SCC（无环）", "children": [{"label": "{1}", "cost": "单点分量"}, {"label": "{3}", "cost": "单点分量"}, {"label": "{2,4,5}", "cost": "三点互达"}, {"label": "{6}", "cost": "单点分量"}]}}],
      treeNotes:['★ 第一次 DFS 的完成时间递减序：3, 6, 1, 2, 5, 4（C 程序 Part 5 实测）。',
        '第二次 DFS（在 G^T 上按此序）挖出 4 个 SCC：{1}、{3}、{2,4,5}、{6}。',
        '分量图 G^SCC 无环 —— 分量之间只能"单向依赖"。'],
     },
     {title:'代价：两次 DFS + 一次转置',viz:'growth',
      chart:{xMax:64,series:[
       {name:'Θ(V + E)（两次 DFS）',expr:'2 * (n + n)',color:'--viz-done'},
       {name:'朴素做法：每对结点互达性检查 V·(V+E)',expr:'n * (n + n)',color:'--viz-violation'}]},
      note:'★ 线性 vs 立方 —— 两次 DFS 的算法把问题从不可行变可行。'},
    ],tasks:['对照 C 程序 Part 5：完成序 3 6 1 2 5 4；SCC 数 = 4。'],note:''},
   {type:'code',title:'实测：4 个分量',c:{file:'graph_basics.c',code:String.raw`/* graph_basics.c -- CLRS Chapter 20 Elementary Graph Algorithms.
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
    notes:[{line:1,zh:'★ 五关共用本文件；本关注释聚焦 Part 5（SCC）。'},
           {line:374,zh:'★★ Part 5：完成时间递减序 3 6 1 2 5 4；SCC 数 = 4；分量 {1},{2,4,5},{3},{6}。'},
           {line:159,zh:'`dfs_components_order`：在给定访问序下跑 DFS（用于第二次 DFS）。'},
           {line:149,zh:'`dfs_comp_visit`：给每个结点标分量号。'}]},
    tests:[{in:'Figure 20.9 的有向图',out:'完成序 3 6 1 2 5 4；SCC = {1},{2,4,5},{3},{6}'},
           {in:'分量图',out:'4 个分量结点、无环'}],
    mapping:[{pc:3,pcCode:'按 f 递减访问 G^T',c:'`dfs_components_order`（第 159 行，按递减完成序）'},
             {pc:4,pcCode:'输出每棵树',c:'`dfs_comp_visit`（第 149 行，标分量号）'}]},
   {type:'analyze',title:'一本账：算法的三块积木',claims:[
     {expr:'\\Theta(V + E)',when:'STRONGLY-CONNECTED-COMPONENTS 的运行时间',page:576,source:'book'},
     {expr:'G^{SCC} \\text{ 无环}',when:'引理 20.6：分量图无环',page:577,source:'book'},
     {expr:'2',when:'DFS 的次数（一次 G、一次 G^T）',page:576,source:'book'},
    ],tables:[{caption:'C 程序 Part 5 的实测账',rows:[
      ['步骤','结果'],
      ['DFS(G) 的完成序','3, 6, 1, 2, 5, 4（递减访问）'],
      ['G^T 上的第二遍 DFS','挖出 4 棵树'],
      ['SCC','{1}、{2,4,5}、{3}、{6}'],
     ]},{caption:'为什么转置图不改变 SCC',rows:[
      ['','原图 G','转置图 G^T'],
      ['u→v 可达','是','v→u 可达（边反向+路径反向）'],
      ['互相可达','是','**是（定义对称）**'],
      ['SCC 划分','—','**完全相同**'],
     ]}],chart:{xMax:64,series:[
     {name:'两次 DFS：2(V+E)',expr:'2 * (n + n)',color:'--viz-done'},
     {name:'逐对可达性检查 V(V+E)',expr:'n * (n + n)',color:'--viz-violation'}]},
    derivations:[{kind:'summation',title:'"按完成时间递减"如何对准分量',steps:[
      {zh:'引理（原书 p.618）：设 $C$、$C^{\\prime}$ 是两个 SCC，若存在边 $C \\to C^{\\prime}$（分量图意义），则 $C$ 中**最晚完成**的 $u$ 满足 $f[u] > $ $C^{\\prime}$ 中一切结点的 $f$。'},
      {zh:'于是在 $G^T$ 上按 $f$ 递减访问时：$C^{\\prime}$ 中的结点全比 $C$ 的"晚完成"，但 $G^T$ 的边方向反了 —— 从 $C$ 出发的第二遍 DFS **到不了** $C^{\\prime}$。'},
      {tex:'G^{SCC} \\text{ 无环} \\Rightarrow \\text{按拓扑序逐块收割}',zh:'★ 每棵树恰好是一个 SCC。∎'}]},
     ],
    note:''},
   {type:'prove',title:'引理 20.6：分量图无环',statement:'The following lemma gives the key property that the component graph is acyclic.',page:577,
    intro:'★ 没有"分量图无环"，第二次 DFS 的顺序就没有意义 —— 这是整个算法的支点。',
    steps:[
     {title:'反证：若分量图有环',en:'Recall from Appendix B that a strongly connected component of a directed graph G = (V,E) is a maximal set of vertices C \u2286 V such that for every pair of vertices u,v 2 C , both u \u2192 v and v \u2192 u, that is, vertices u and v are reachable from each other.',page:576,
      body:['设 $G^{SCC}$ 有环 $C_1 \\to C_2 \\to \\cdots \\to C_k \\to C_1$（$k \\ge 2$）。',
        '取 $C_1$ 中任一结点 $u$、$C_2$ 中任一结点 $v$：边 $C_1 \\to C_2$ 给出 $u \\leadsto v$；环的其余段给出 $v \\leadsto u$。',
        '于是 $u, v$ 互相可达 → 它们属于**同一个** SCC —— 与 $C_1 \\ne C_2$ 矛盾。∎']},
     {title:'由无环性读出算法逻辑',en:'We\u2019ll see that the algorithm uses this property to visit the vertices of the component graph in topologically sorted order, by considering vertices in the second depthfirst search in decreasing order of the finish times that were computed in the first depth-first search.',page:577,
      body:['$G^{SCC}$ 无环 → 它有拓扑序。',
        '第一次 DFS 的完成时间递减序，恰好是**分量图拓扑序**的体现（完成得晚的分量在分量图的前面）。',
        '第二次 DFS 按这个序访问 → 每次从"分量图最前端"的分量进入，DFS 在 $G^T$ 里**无法跨出**该分量 → 收割整棵树 = 一个 SCC。∎']},
     {title:'实测闭环',en:'The linear-time (i.e., \u0398(V + E)-time) procedure STRONGLY-CONNECTED-COMPONENTS on the next page computes the strongly connected components of a directed graph G = (V,E) using two depth-first searches, one on G and one on G T .',page:576,
      body:['C 程序 Part 5：完成序 3,6,1,2,5,4；第二次 DFS 得 4 个 SCC（{1},{2,4,5},{3},{6}）。',
        '分量图 4 结点无环；总代价 Θ(V+E) 两次 DFS。∎']},
    ],conclusion:'★ 结论：SCC 算法 = 拓扑排序思想（20.4）+ 转置图 + 两次 DFS 的组合拳。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'STRONGLY-CONNECTED-COMPONENTS 共用几次 DFS？',options:['1 次','**2 次（G 与 G^T 各一次）**','3 次：遍历、转置、在转置图上跑，各算一次','每个 SCC 一次'],answer:1,
      why:'★ 两次线性扫描：第一次算完成时间，第二次在 G^T 上按 f 递减访问。'},
     {kind:'single',q:'第二次 DFS 为什么按完成时间递减访问？',options:['随意','**使各 SCC 按分量图拓扑序被逐块收割**','为了省内存：按完成时间递减就不用另外存一张分量图','红黑树要求'],answer:1,
      why:'★ 分量图无环（引理 20.6）；递减完成序对准其拓扑序。'},
     {kind:'judge',q:'G 与 G^T 的 SCC 划分相同。',answer:true,
      why:'★ 互相可达的定义关于边方向对称。'},
     {kind:'simulate',q:'C 程序在 Figure 20.9 的图上找到几个 SCC？（填数字）',expect:[4],placeholder:'例如：3',
      why:'{1}、{2,4,5}、{3}、{6} —— 4 个（C 程序 part 5）。'},
     {kind:'judge',q:'强连通分量图 G^{SCC} 是无环的（引理 20.6）。',answer:true,why:'★ 若分量图有环，则环上两点互相可达 → 属同一 SCC，矛盾。'},
     {kind:'single',q:'STRONGLY-CONNECTED-COMPONENTS 的运行时间是？',options:['O(V²)','**Θ(V + E)**','O(VE)','O(E lg V)'],answer:1,why:'★ 两次线性 DFS（一次 G、一次 G^T），p.576。'},
    ],bookExercises:[
     {id:'20.5-1',page:580,star:0,statement:'How can the number of strongly connected components of a graph change if a new edge is added?',hint:'只会不变或变少。两端同分量 → 不变；否则在分量图（DAG）上看：新边把从 comp(u) 到 comp(v) 可达的那一整片分量并成一个。极端例子是加一条边让整图变成一个强连通分量。'},
     {id:'20.5-2',page:580,star:0,statement:'Show how the procedure STRONGLY-CONNECTED-COMPONENTS works on the graph of Figure 20.6. Specifically, show the finish times computed in line 1 and the forest produced in line 3. Assume that the loop of lines 5–7 of DFS considers vertices in alphabetical order and that the adjacency lists are in alphabetical order.',hint:'本题要在 **Figure 20.6** 上跑 STRONGLY-CONNECTED-COMPONENTS，两样东西要交： 第一行（在 $G$ 上跑 DFS）每个结点的**完成时间**，第三行（在 $G^{T}$ 上跑 DFS）产出的**深度优先森林**。 按题面两条字母序约定死板执行：外层结点按字母序、每条邻接表也按字母序。 顺序是：先在 $G$ 上跑一遍 DFS 记下各点 $f$ → 把顶点按 $f$ **递减**排 → 在 $G^{T}$ 上按这个次序逐点起 DFS， 每棵深度优先树就是一个强连通分量。 省事的办法：本站收了 20.3-2，它用的正是同一张 Figure 20.6（同样两条字母序约定）， 那一题算出的 $d$、$f$ 表在这里可以直接复用 —— 但 $G^{T}$ 那一遍必须重跑，别把 $G$ 的树边当答案。'},
     {id:'20.5-3',page:580,star:0,statement:'Professor Bacon rewrites the algorithm for strongly connected components to use the original (instead of the transpose) graph in the second depth-first search and scan the vertices in order of increasing finish times. Does this modified algorithm always produce correct results?',hint:'举反例：构造两个分量之间只有一条边的小图，第二次 DFS 用原图、按完成时间递增访问时，起点会顺着出边「溢出」到别的分量里去。对照标准算法为什么必须用 G 的转置且按完成时间**递减**：第二次只能沿入边走，才走不出自己所在的分量。'},
     {id:'20.5-4',page:581,star:0,statement:'Prove that for any directed graph G, the transpose of the component graph of G T is the same as the component graph of G. That is, ..G T / SCC / TDGSCC .',hint:'第一步先说明 G 与 G 的转置有**完全相同**的强连通分量（互相可达不依赖方向）。于是两边的分量图结点是同一批，只剩一条边的方向要证：(C1,C2) 属于 G 的分量图 ⟺ (C2,C1) 属于 G 转置的分量图，把边的定义展开一行即可。'},
     {id:'20.5-5',page:581,star:0,statement:'Give an O(V + E)-time algorithm to compute the component graph of a directed graph G = (V,E) . Make sure that there is at most one edge between two vertices in the component graph your algorithm produces.',hint:'先跑一遍 SCC 算法拿到每个结点的分量编号；再扫一次边表，只保留两端编号不同的有序对。去重最省事的办法是把这些对按字典序排序后压缩，或用哈希集合边插边判 —— 两种都在 O(V+E) 内（排序那版要说明用的是基数/桶排序）。'},
     {id:'20.5-6',page:581,star:0,statement:'Give an O(V + E)-time algorithm that, given a directed graph G = (V,E), con- structs another graph G 0 = (V,E 0 ) such that G and G 0 have the same strongly connected components, G 0 has the same component graph as G, and jE 0 j is as small as possible.',hint:'下界分两块数：分量图里的每条边都必须在 E 撇里留下一条代表边，否则分量图就变了；而一个有 k 个结点的强连通分量至少要 k 条边（每个结点出入度都不为零）。构造照这两句话给：分量之间一条边、分量内部把 k 个结点串成一个环。'},
    ]},
  ],
};
