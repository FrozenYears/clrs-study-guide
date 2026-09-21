/* 第 20 章 20.4：拓扑排序（Topological sort）。印刷页 612–615（pdf 633–636）。 */
export default {
  key:'s04',id:'ch20/s04',chapter:20,section:'20.4',
  title:'拓扑排序：DFS 的第一次应用',shortTitle:'20.4 拓扑排序',
  titleEn:'Topological sort',
  source:{printed:[573,575],pdf:[594,596]},
  prerequisites:[{label:'20.3 Depth-first search',url:'#/ch20/s03'}],
  stages:[
   {type:'map',title:'给 DAG 排一个"先来后到"',
    why:'DAG（有向无环图）表达事件间的**先后约束**（穿衣顺序、编译依赖、课程先修）。拓扑排序给顶点排一个线性序，使每条边 u→v 都有 u 在 v 前。算法惊人地简单：**按完成时间逆序**输出即可。',
    position:'20.3 DFS 的第一个应用；证明依赖 20.3 的括号化定理（后裔区间嵌套）。20.5 的 SCC 还要再用一次"按完成时间排序"。',
    unlocks:[{label:'20.5 Strongly connected components',url:'#/ch20/s05'}],
    mathKit:[
     {title:'定义',body:'DAG 的拓扑序是 $G$ 中所有顶点的线性序，使 $G$ 含边 $(u,v)$ 则序中 $u$ 先于 $v$。'},
     {title:'算法',body:'TOPOLOGICAL-SORT = DFS(G) + 把结点按**完成时间递减**插到链表前部。'},
     {title:'代价',body:'$\\Theta(V + E)$ —— 就是一次 DFS 外加 $O(V)$ 的链表操作。'},
    ]},
   {type:'intuition',title:'完成得晚的排在最前',scene:'穿衣顺序（Figure 20.7）',body:[
     '对 DAG 跑 DFS，结点**完成时间越晚，越该排在拓扑序前面** —— 直觉：完成得晚，说明它依赖的东西都已处理完。',
     '★ C 程序 Part 4：对教学 DAG 实测拓扑序 1,3,5,2,4,6，并逐边验证"每条 u→v 都有 u 在前"。',
     '★ 无环性的判据（引理 20.4）：**G 无环 ⟺ DFS 不产生后向边**。C 程序 part 4 先断言"边分类中 back = 0"再输出排序 —— 证明与工程互证。',
     '⚠ 若图有环，拓扑序不存在 —— DFS 会挖出后向边，恰好暴露那个环。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文。',blocks:[
     {kind:'body',page:573,en:'Many applications use directed acyclic graphs to in dicate precedences among events. Figure 20.7 gives an example that arises when Professor Bumstead gets dressed in the morning.',
      zh:'★ 应用背景：事件的先后约束（穿衣顺序，语料 in dicate 是断词伪影）。'},
     {kind:'body',page:573,en:'To prove the correctness of this remarkably simple and efficient algorithm, we start with the following key lemma characterizing directed acyclic graphs.',
      zh:'★ 正确性证明从刻画 DAG 的关键引理开始。'},
     {kind:'body',page:573,en:'A directed graph G is acyclic if and only if a depth-first search of G yields no back edges.',
      zh:'★★ **引理 20.4**：G 无环 ⟺ DFS 无后向边。'},
     {kind:'body',page:574,en:'Proof ): Suppose that a depth-first search produces a back edge (u,v) . Then vertex v is an ancestor of vertex u in the depth-first forest. Thus, G contains a path from v to u, and the back edge (u,v) completes a cycle.',
      zh:'★★ 引理的 ⇒ 方向：后向边 (u,v) 补全 v→u 的树路径，构成环。'},
     {kind:'body',page:574,en:'TOPOLOGICAL-SORT produces a topological sort of the directed acyclic graph provided as its input.',
      zh:'★ 定理 20.5：算法正确（对输入 DAG 产出拓扑序）。'},
    ],terms:[{en:'topological sort',zh:'拓扑排序',page:574},
              {en:'directed acyclic graph',zh:'有向无环图（DAG）',page:573}]},
   {type:'pseudocode',title:'TOPOLOGICAL-SORT：3 行',algo:'TOPOLOGICAL-SORT',signature:'TOPOLOGICAL-SORT(G)',page:575,
    lines:[
     {n:1,code:'call DFS(G) to compute finish times',zh:'★ 第 1 步：算完成时间。'},
     {n:2,code:'as each vertex is finished, insert it onto the front of a linked list',zh:'★★ 完成即头插。'},
     {n:3,code:'return the linked list of vertices',zh:'链表顺序 = 拓扑序。'}],
    vars:[{name:'finish time',meaning:'结点变黑的时刻'}],
    note:'★ 全部逻辑就一句：按完成时间**逆序**排列。正确性证明（定理 20.5）走 20.3 的白灰黑路径引理。',
    more:[]},
   {type:'visualize',title:'拓扑序与无环判定',panels:[
     {title:'C 程序 Part 4：教学 DAG 的实测',viz:'growth',
      chart:{xMax:10,series:[
       {name:'后向边数 = 0（先证无环）',expr:'0',color:'--viz-done'},
       {name:'非法序（若乱排）：至少一条边逆序',expr:'1',color:'--viz-violation'}]},
      note:'★ 实测拓扑序 1,3,5,2,4,6；算法逐边断言"u 先于 v"。'},
    ],tasks:['对照 C 程序 Part 4：边分类 back = 0，拓扑序逐边合法。'],note:''},
   {type:'code',title:'实测：0 条后向边 + 合法序',c:{file:'graph_basics.c',code:String.raw`/* graph_basics.c -- CLRS Chapter 20 Elementary Graph Algorithms.
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
    notes:[{line:1,zh:'★ 五关共用本文件；本关注释聚焦 Part 4（拓扑排序）。'},
           {line:335,zh:'★★ Part 4：先断言 back = 0（引理 20.4），再输出拓扑序 1 3 5 2 4 6。'},
           {line:339,zh:'★ 逐边断言 u 在 v 之前 —— 拓扑序的定义式检查。'},
           {line:121,zh:'`dfs`：边分类在 DFS 里顺带完成（tree/back/forward/cross）。'}]},
    tests:[{in:'教学 DAG（6 顶点）',out:'back = 0；拓扑序 1 3 5 2 4 6'},
           {in:'逐边检查',out:'每条 u→v 都有 u 在 v 前'}],
    mapping:[{pc:2,pcCode:'完成即头插',c:'拓扑序按 f 值递减排序（C 程序 Part 4 的排序段）'}]},
   {type:'analyze',title:'一本账：无环 ⟺ 无后向边',claims:[
     {expr:'\\Theta(V + E)',when:'拓扑排序的运行时间（一次 DFS）',page:575,source:'book'},
     {expr:'\\text{no back edges}',when:'G 无环 ⟺ DFS 无后向边（引理 20.4）',page:573,source:'book'},
     {expr:'1',when:'DAG 中每个结点 u→v 满足 f[u] > f[v]（白路径引理推论）',page:574,source:'book'},
    ],tables:[{caption:'C 程序 Part 3/4 的实测关联',rows:[
      ['图','后向边数','拓扑序'],
      ['有向图 G（Figure 20.2）','2 条 back','不存在（有环）'],
      ['教学 DAG','0 条 back','1 3 5 2 4 6'],
     ]},{caption:'引理 20.4 的两个方向',rows:[
      ['方向','论证'],
      ['有后向边 ⇒ 有环','后向边 (u,v)：v 是 u 的祖先，v→u 的树路径 + (u,v) = 环'],
      ['有环 ⇒ 有后向边','环上最早发现的结点是其余结点的祖先；沿环走必产生指向它的后向边'],
     ]}],chart:{xMax:16,series:[
     {name:'DFS 一次的代价 V+E',expr:'n + n',color:'--viz-done'},
     {name:'反复删零入度点（Kahn）：也是 V+E 但更繁琐',expr:'n + n',color:'--viz-compare'}]},
    derivations:[{kind:'summation',title:'定理 20.5 的证明骨架',steps:[
      {zh:'考察任意边 $(u,v)$：DFS 中 $v$ 被发现时，$u$ 的状态有三种可能（白/灰/黑）。'},
      {zh:'灰 → $v$ 是 $u$ 的后裔 → $f[u] > f[v]$（括号化定理）；白 → 同理经白路径；黑 → $v$ 早已完成 → 也是 $f[u] > f[v]$。'},
      {tex:'(u,v) \\in E \\;\\Longrightarrow\\; f[u] > f[v]',zh:'★ 所以按 f 递减排序必然 u 在 v 前 —— 拓扑序成立。∎'}]},
     ],
    note:''},
   {type:'prove',title:'引理 20.4：有环必有后向边',statement:'A directed graph G is acyclic if and only if a depth-first search of G yields no back edges.',page:573,
    intro:'★ 两个方向：⇒ 用括号化定理；⇐ 用环上"最早发现的结点"。',
    steps:[
     {title:'⇒ 有后向边则必有环',en:'Proof ): Suppose that a depth-first search produces a back edge (u,v) . Then vertex v is an ancestor of vertex u in the depth-first forest. Thus, G contains a path from v to u, and the back edge (u,v) completes a cycle.',page:574,
      body:['后向边 $(u,v)$：$v$ 是 $u$ 在 DFS 森林中的祖先。',
        '于是 $G$ 含路径 $v \\leadsto u$（树路径），加上边 $(u,v)$ 恰好构成一个**环**。',
        '所以"无环图"不可能产生后向边。∎']},
     {title:'⇐ 有环则必有后向边',en:'TOPOLOGICAL-SORT produces a topological sort of the directed acyclic graph provided as its input.',page:574,
      body:['设 $G$ 有环 $c$，取 $c$ 上**最早被发现**的结点 $u$。',
        '环上其余结点在 $u$ 发现时都是白色，且从 $u$ 出发沿环能到达它们 —— 由白色路径引理，它们都是 $u$ 的**后裔**。',
        '环上"最后回到 $u$"的那条边 $(v,u)$：$u$ 是 $v$ 的祖先 → 该边是**后向边**。∎']},
     {title:'实测互证',en:'Many applications use directed acyclic graphs to in dicate precedences among events.',page:573,
      body:['C 程序 Part 3：教学 DAG 的边分类 back = 0 → 无环 → 拓扑序存在（part 4 输出它）。',
        'C 程序 Part 3 的有向图 G：back = 2 → 有环 → 拓扑序不存在。',
        '★ 两个方向都得到实测印证。∎']},
    ],conclusion:'★ 结论：无环性可以"顺带"从 DFS 的边分类里读出来 —— 这是 DFS 强表达力的第一个展示。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'拓扑排序算法的核心动作是？',options:['反复删除入度 0 的点（唯一方法）','**DFS 按完成时间逆序输出**','对边排序','广度优先搜索'],answer:1,
      why:'★ TOPOLOGICAL-SORT 就 3 行（p.615）；反复删零入度点是等价替代。'},
     {kind:'single',q:'引理 20.4 说什么？',options:['DAG 一定有唯一拓扑序','**G 无环 ⟺ DFS 无后向边**','DFS 总是 O(V)','后向边指向非祖先'],answer:1,
      why:'★ 它把"无环判定"免费并入了 DFS。'},
     {kind:'judge',q:'拓扑序对带环的有向图也可能存在。',answer:false,
      why:'★ 有环则环上的结点互相"先于"，线性序不可能满足 —— 拓扑序存在 ⟺ 无环。'},
     {kind:'simulate',q:'C 程序的教学 DAG 有几条后向边？（填数字）',expect:[0],placeholder:'例如：1',
      why:'back = 0 —— 先判无环再输出拓扑序（C 程序 part 4）。'},
     {kind:'single',q:'拓扑排序的运行时间是？',options:['O(V²)','**Θ(V + E)**','O(V lg V)','O(E lg V)'],answer:1,why:'★ 一次 DFS + O(V) 链表操作（p.575）。'},
     {kind:'judge',q:'本关 C 程序对教学 DAG 实测输出的拓扑序是 1, 3, 5, 2, 4, 6。',answer:true,why:'★ C 程序 part 4 实测拓扑序 1 3 5 2 4 6，并逐边验证 u 在 v 前。'},
    ],bookExercises:[
     {id:'20.4-1',page:575,star:0,statement:'Show the ordering of vertices produced by TOPOLOGICAL-SORT when it is run on the dag of Figure 20.8. Assume that the for loop of lines 5–7 of the DFS procedure considers the vertices in alphabetical order, and assume that each adjacency list is ordered alphabetically.',hint:'TOPOLOGICAL-SORT 只做一件事：跑 DFS，把结点按**完成时刻** $v.f$ 从大到小排。所以手工模拟要记的不是「谁先被访问」，而是每个结点的 $d$ 与 $f$：外层顶点表按字母序取下一个白色结点起 DFS，内层邻接表也按字母序。★ 两件事顺手自查：一是每个结点 $d$ 与 $f$ 各一次、时间号 1 到 $2|V|$；二是最后的序列只要验证「每条边 $(u,v)$ 都满足 $u$ 在 $v$ 前」就是合法拓扑序。注意本关阶段 5/6 用的是另一张 6 个顶点的图（Figure 20.2），它的时刻表与本题无关，只能照它的**方法**做。'},
     {id:'20.4-2',page:575,star:0,statement:'Give a linear-time algorithm that, given a directed acyclic graph G = (V,E) and two vertices a,b 2 V , returns the number of simple paths from a to b in G. For example, the directed acyclic graph of Figure 20.8 contains exactly four simple paths from vertex p to vertex v: ⟨p,o,v⟩, ⟨p,o,r,y,v⟩, ⟨p,o,s,r,y,v⟩, and ⟨p,s,r,y,v⟩. Your algorithm needs only to count the simple paths, not list them.',hint:'先把图裁到「从 a 可达且能到 b」的结点（正向、反向各一次遍历），再按拓扑序递推：令 c(u) 为 u 到 b 的简单路径数，c(b) 取 1，c(u) 等于所有后继 c(v) 之和。DAG 保证每条路径只被数一次，每个结点与每条边各访问一次。'},
     {id:'20.4-3',page:575,star:0,statement:'Give an algorithm that determines whether an undirected graph G = (V,E) con- tains a simple cycle. Your algorithm should run in O(V) time, independent of |E|.',hint:'题眼在「时间与 E 无关」。无环的无向图（森林）边数至多 V−1，所以一边读边计数：读到第 V 条就已经可以断定有环并停机；如果没读到那么多，边数本身就是 O(V)，这时跑一次 DFS 找后向边（记得跳过来自父结点的那一条）仍是 O(V)。'},
     {id:'20.4-4',page:575,star:0,statement:'Prove or disprove: If a directed graph G contains cycles, then the vertex ordering produced by TOPOLOGICAL-SORT (G) minimizes the number of "bad" edges that are inconsistent with the ordering produced.',hint:'这是「证明或举反例」：先注意含环时 TOPOLOGICAL-SORT 根本没有合法输出，题面说的顺序其实是 DFS 完成时间倒排出来的那个。三到四个结点、带一个环加一条外挂边，最容易枚举出「坏边更少」的另一个排列。'},
     {id:'20.4-5',page:576,star:0,statement:'Another way to topologically sort a directed acyclic graph G = (V,E) is to re- peatedly find a vertex of in-degree 0, output it, and remove it and all of its outgo- ing edges from the graph. Explain how to implement this idea so that it runs in time O(V + E). What happens to this algorithm if G has cycles?',hint:'留在余集里的不是「处在环里或通向环」，而是「**处在环里或从环出发可达**」 —— 方向要摆正。 Kahn 一遍遍删的是入度 0 的结点，所以能被删掉的都是「没有环在背后撑着」的点。 反例一眼看穿：$a \\leftrightarrow b$ 成环，另有 $c \\to a$ 与 $a \\to d$。 $c$ 入度 0，第一轮就被输出 —— 它明明「通向环」却不在余集里； $d$ 的入邻 $a$ 永远不被删除，所以 $d$ 留下 —— 它是**被环通向**的那个。 不变量是：余集中每个点都还有一条来自余集内部的入边，顺着这条边走下去必然落进某个环， 即每个余集中的点都可从某环到达。'},
    ]},
  ],
};
