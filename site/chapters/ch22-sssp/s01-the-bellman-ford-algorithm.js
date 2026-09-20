/* 第 22 章 22.1：Bellman-Ford 算法（The Bellman-Ford algorithm）。印刷页 612–615（pdf 633–636）。 */
export default {
  key:'s01',id:'ch22/s01',chapter:22,section:'22.1',
  title:'Bellman-Ford：负权边的救星',shortTitle:'22.1 Bellman-Ford',
  titleEn:'The Bellman-Ford algorithm',
  source:{printed:[612,615],pdf:[633,636]},
  prerequisites:[{label:'21.2 The algorithms of Kruskal and Prim',url:'#/ch21/s02'}],
  stages:[
   {type:'map',title:'最短路径问题的开场',
    why:'最短路问题：给定带权有向图与源点 s，求 s 到每个点的最短路径。Dijkstra 不能处理负权边 —— **Bellman-Ford** 可以，还能**检测负环**。',
    position:'图算法第三章开篇。核心原子操作是 RELAX（松弛）—— 全章所有算法共享它。本关的"V−1 轮全边松弛"是最朴素却最通用的策略。',
    unlocks:[{label:'22.2 Single-source shortest paths in DAGs',url:'#/ch22/s02'}],
    mathKit:[
     {title:'松弛 RELAX',body:'若 $d[u] + w(u,v) < d[v]$ 则 $d[v] = d[u] + w(u,v)$，$v.\\pi = u$。'},
     {title:'Bellman-Ford',body:'对所有边做 $|V|-1$ 轮松弛，再检查一轮：仍可松弛 → **存在从 s 可达的负权环**。'},
     {title:'复杂度',body:'$O(VE)$ —— $|V|-1$ 轮 × 全边扫描。'},
    ]},
   {type:'intuition',title:'V−1 轮之后为什么就够了',scene:'Figure 22.1 的图（C 程序 Part 1）',body:[
     '最短路径至多含 $|V|-1$ 条边（无环路径）。第 $i$ 轮全边松弛后，所有"至多 $i$ 条边"的最短路都已算对 —— 归纳可得 $|V|-1$ 轮覆盖一切。',
     '★ C 程序实测：Figure 22.1 的图上松弛成功仅 **7 次**（远小于 $(V-1)\\times|E| = 40$ 次上限），最终 $d = \\{0, 2, 4, 7, -2\\}$ —— 与原书 p.613 一致。',
     '★ **负环检测**：第 $|V|$ 轮仍能松弛 ⟺ 存在从 s 可达的负权环 ⟺ 最短路径无定义。C 程序 part 2 加一条 z→t(−4) 构造负环，算法当场报警。',
     '★ d 值可为负：z = −2 —— "最短路"是权重和最小，不是边数最少。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 O(V 2 C VE) 代表 O(V·E)）。',blocks:[
     {kind:'body',page:613,en:'The d and \u03a9 values in part (e) are the final values. The Bellman-Ford algorithm returns TRUE in this example.',
      zh:'★ Figure 22.1 的运行结果：返回 TRUE（无负环）。'},
     {kind:'body',page:613,en:'To prove the correctness of the Bellman-Ford algorithm, we start by showing that if there are no negative-weight cycles, the algorithm computes correct shortest-path weights for all vertices reachable from the source.',
      zh:'★ 正确性证明的顺序：先证"无负环时算得对"，再证"检测负环"。'},
     {kind:'body',page:614,en:'Let G = (V,E) be a weighted, directed graph with source vertex s and weight function w W E ! R. Then, for each vertex v 2 V , there is a path from s to v if and only if BELLMAN-FORD terminates with v: d < 1 when it is run on G.',
      zh:'★ 引理：s 可达 v ⟺ 结束时 v.d < ∞。'},
     {kind:'body',page:614,en:'Theorem 22.4 (Correctness of the Bellman-Ford algorithm)',
      zh:'★★ 定理 22.4：Bellman-Ford 的正确性。'},
     {kind:'body',page:615,en:'Now, suppose that graph G contains a negative-weight cycle reachable from the source s . Let this cycle be c = \u27e8v 0 ,v 1 ,\u2026,v k\u27e9, where v 0 = v k , in which case we have k X i D1 w(v i \u22121 ,v i )<0: (22.1)',
      zh:'★★ 负环的数学刻画（式 22.1：环上权重和 < 0）。'},
    ],terms:[{en:'Bellman-Ford',zh:'Bellman-Ford 算法',page:612},
              {en:'RELAX',zh:'松弛操作',page:612}]},
   {type:'pseudocode',title:'BELLMAN-FORD：8 行',algo:'BELLMAN-FORD',signature:'BELLMAN-FORD(G, w, s)',page:613,
    lines:[
     {n:1,code:'INITIALIZE-SINGLE-SOURCE(G, s)',zh:'d 全 ∞、d[s] = 0、π 全 NIL。'},
     {n:2,code:'for i = 1 to |G.V| − 1',zh:'★★ V−1 轮全边松弛。'},
     {n:3,code:'    for each edge (u,v) ∈ G.E',zh:''},
     {n:4,code:'        RELAX(u, v, w)',zh:''},
     {n:5,code:'for each edge (u,v) ∈ G.E',zh:'★ 检查轮：还有可松弛的？'},
     {n:6,code:'    if v.d > u.d + w(u,v)',zh:''},
     {n:7,code:'        return FALSE',zh:'★★ 有从 s 可达的负环。'},
     {n:8,code:'return TRUE',zh:''}],
    vars:[{name:'d[v]',meaning:'s 到 v 的最短路径估计'},{name:'v.π',meaning:'前驱（重建路径用）'}],
    note:'★ 第 5–7 行的检查轮是"负环探测器"：理论上第 V−1 轮后不应再有改进。',
    more:[]},
   {type:'visualize',title:'松弛次数与负环',panels:[
     {title:'C 程序 Part 1/2 的实测',viz:'growth',
      chart:{xMax:45,series:[
       {name:'松弛成功 7 次（远低于上限 40）',expr:'7',color:'--viz-done'},
       {name:'理论上限 (V−1)·E = 40',expr:'40',color:'--viz-compare'}]},
      note:'★ Figure 22.1 的图上第 4 轮已收敛 —— 大多数轮次"无事可做"。'},
     {title:'负环检测（C 程序 part 2：加入 z→t 权 −4）',viz:'growth',
      chart:{xMax:10,series:[
       {name:'正常图：检测通过',expr:'1',color:'--viz-done'},
       {name:'负环图：第 V 轮仍可松弛',expr:'0',color:'--viz-violation'}]},
      note:'★ z→t(−4) 与 z→s→t 组成负环（−4+2+6 < 0）—— 最短路径失去意义，算法正确报告。'},
    ],tasks:['对照 C 程序 part 1 的 d 值与原书 p.613。'],note:''},
   {type:'code',title:'实测：d = {0,2,4,7,−2} 与负环',c:{file:'sssp.c',code:String.raw`/* sssp.c -- 22 章：单源最短路径（Bellman-Ford / DAG-SSSP / Dijkstra）。
 * 图 G1 = 原书 Figure 22.1 的图（s,t,x,y,z，含负边）：
 *   s->t 6, s->y 7, t->x 5, t->y 8, t->z -4, x->t -2, y->x -3, y->z 9, z->s 2, z->x 7
 * 关键数字：Bellman-Ford 从 s 出发 d = {0,2,4,7,-2}（原书 p.613 的答案）。
 * 图 G2 = Figure 22.9 的图（非负权）：s->t 10, s->y 5, t->y 2, t->z 1,
 *   y->t 3, y->x 9, y->z 2, z->x 6, x->z 4 —— Dijkstra d = {0,8,9,5,7}（原书 p.661）。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define V 5
#define INF 1000000

static const char *name[V] = {"s", "t", "x", "y", "z"};

/* ---------- 通用结构 ---------- */
typedef struct { int u, v, w; } edge_t;

static edge_t es[V * V];
static int en;
static int adj[V][V];               /* 邻接矩阵（Dijkstra/DAG 用） */

static void add_edge(int u, int v, int w)
{
    es[en].u = u; es[en].v = v; es[en].w = w; en++;
    adj[u][v] = w;
}

/* ---------- 松弛（全书共用的原子操作） ---------- */
static int relax(int *d, int u, int v, int w)
{
    if (d[u] != INF && d[u] + w < d[v]) {
        d[v] = d[u] + w;
        return 1;                     /* 发生了更新 */
    }
    return 0;
}

/* ---------- Bellman-Ford（8 行直译）。返回 1 = 无负环 ---------- */
static long relax_count;

static int bellman_ford(int s, int *d, int *pred)
{
    for (int i = 0; i < V; i++) { d[i] = INF; pred[i] = -1; }
    d[s] = 0;
    for (int i = 1; i <= V - 1; i++) {                  /* 行 2–4：V−1 轮 */
        for (int j = 0; j < en; j++) {
            if (relax(d, es[j].u, es[j].v, es[j].w)) {
                relax_count++;
                pred[es[j].v] = es[j].u;
            }
        }
    }
    for (int j = 0; j < en; j++) {                      /* 行 5–7：检查负环 */
        if (d[es[j].u] != INF && d[es[j].u] + es[j].w < d[es[j].v]) { return 0; }
    }
    return 1;
}

/* ---------- 拓扑序（DAG-SSSP 用；简单 DFS） ---------- */
static int topo[V], topo_n;
static int visited[V];

static void dfs_topo(int u, int adjm[V][V])
{
    visited[u] = 1;
    for (int v = 0; v < V; v++) {
        if (adjm[u][v] != INF && adjm[u][v] != 0 && !visited[v]) { dfs_topo(v, adjm); }
    }
    topo[--topo_n] = u;
}

/* ---------- DAG-SSSP（5 行直译） ---------- */
static void dag_sssp(int adjm[V][V], int s, int *d)
{
    for (int i = 0; i < V; i++) { d[i] = INF; }
    d[s] = 0;
    for (int t = 0; t < V; t++) {                       /* 行 2：按拓扑序 */
        int u = topo[t];
        if (d[u] == INF) { continue; }
        for (int v = 0; v < V; v++) {
            if (adjm[u][v] != INF && adjm[u][v] != 0) { relax(d, u, v, adjm[u][v]); }
        }
    }
}

/* ---------- Dijkstra（12 行直译；数组版优先队列） ---------- */
static void dijkstra(int s, int *d)
{
    static int done[V];
    memset(done, 0, sizeof(done));
    for (int i = 0; i < V; i++) { d[i] = INF; }
    d[s] = 0;
    for (int count = 0; count < V; count++) {           /* 行 5：EXTRACT-MIN */
        int u = -1;
        for (int i = 0; i < V; i++) {
            if (!done[i] && (u < 0 || d[i] < d[u])) { u = i; }
        }
        done[u] = 1;
        for (int v = 0; v < V; v++) {                   /* 行 7–9：松弛邻边 */
            if (adj[u][v] != INF && adj[u][v] != 0 && !done[v]) { relax(d, u, v, adj[u][v]); }
        }
    }
}

static void print_d(const int *d)
{
    printf("        ");
    for (int i = 0; i < V; i++) { printf("%s=%d%s", name[i], d[i], i + 1 < V ? " " : "\n"); }
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* G1：Figure 22.1 的图（含负边） */
    add_edge(0, 1, 6); add_edge(0, 3, 7); add_edge(1, 2, 5); add_edge(1, 3, 8);
    add_edge(1, 4, -4); add_edge(2, 1, -2); add_edge(3, 2, -3); add_edge(3, 4, 9);
    add_edge(4, 0, 2); add_edge(4, 2, 7);

    /* part 1：Bellman-Ford */
    {
        int d[V], pred[V];
        int ok = bellman_ford(0, d, pred);
        printf("part 1: Bellman-Ford（G1，含负边，源 s）无负环：%s\n", ok ? "是" : "否");
        print_d(d);
        printf("        期望（原书 p.613）：s=0 t=2 x=4 y=7 z=-2\n");
        assert(ok);
        assert(d[0] == 0 && d[1] == 2 && d[2] == 4 && d[3] == 7 && d[4] == -2);
        printf("        松弛成功次数 = %ld（V−1 = %d 轮内完成）\n", relax_count, V - 1);
    }

    /* part 2：负环检测 —— 加一条边 z->t 权 -4 形成负环 */
    {
        int save_u = es[en].u;
        add_edge(4, 1, -4);
        int d[V], pred[V];
        int ok = bellman_ford(0, d, pred);
        printf("part 2: 加入边 z->t(权 -4) 后：负环检测 = %s\n", ok ? "未检出（错误）" : "检出负环 ✓");
        assert(ok == 0);
        en--; (void)save_u;                     /* 撤销，恢复 G1 */
    }

    /* part 3：DAG-SSSP（Figure 22.8 的 DAG，源 r；0=r 1=s 2=t 3=x 4=y 5=z 太多，
     * 直接用 G1 的拓扑结构演示——G1 无环吗？有环，所以这里换成课本 DAG） */
    {
        /* Figure 22.8 的 DAG：r,s,t,x,y,z -> 5 个顶点用 G1 的 s,t,x,y,z 槽位：
         * r->s 5, r->t 3, s->t 2, s->x 6, t->x 7, t->y 4, x->y -1, x->z 1, y->z -2 */
        static int dag[V][V];
        for (int i = 0; i < V; i++) { for (int j = 0; j < V; j++) { dag[i][j] = INF; } }
        dag[0][1] = 5; dag[0][2] = 3; dag[1][2] = 2; dag[1][3] = 6;
        dag[2][3] = 7; dag[2][4] = 4; dag[3][4] = -1; dag[4][0] = INF;
        /* 修正为课本 DAG：x->z 1, y->z -2 用节点 z（下标 4）……为避免混乱，改用：
         * r=0 s=1 t=2 x=3 y=4 z 不含（5 结点只到 y）。边：r->s 5, r->t 3, s->t 2,
         * s->x 6, t->x 7, t->y 4, x->y -1 */
        memset(dag, 0, sizeof(dag));
        for (int i = 0; i < V; i++) { for (int j = 0; j < V; j++) { dag[i][j] = INF; } }
        dag[0][1] = 5; dag[0][2] = 3; dag[1][2] = 2; dag[1][3] = 6;
        dag[2][3] = 7; dag[2][4] = 4; dag[3][4] = -1;
        topo_n = V;
        memset(visited, 0, sizeof(visited));
        dfs_topo(0, dag);
        int d[V];
        dag_sssp(dag, 0, d);
        printf("part 3: DAG-SSSP（Figure 22.8 的 DAG，源 r）r=0 s=5 t=3 x=10 y=7：\n");
        printf("        r=%d s=%d t=%d x=%d y=%d\n", d[0], d[1], d[2], d[3], d[4]);
        printf("        期望（按边权逐点松弛）：r=0 s=5 t=3 x=10 y=7\n");
        assert(d[0] == 0 && d[1] == 5 && d[2] == 3 && d[3] == 10 && d[4] == 7);
        /* 交叉验证：同一 DAG 上 Bellman-Ford 结果一致 */
        int d2[V], pred[V];
        en = 0;
        memset(adj, 0, sizeof(adj));
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dag[i][j] != INF) { add_edge(i, j, dag[i][j]); }
            }
        }
        (void)bellman_ford(0, d2, pred);
        for (int i = 0; i < V; i++) { assert(d[i] == d2[i]); }
        printf("        交叉验证：Bellman-Ford 在同一 DAG 上给出完全相同的 d ✓\n");
    }

    /* part 4：Dijkstra（G2 = Figure 22.9 的图，非负权） */
    {
        en = 0;
        memset(adj, 0, sizeof(adj));
        add_edge(0, 1, 10); add_edge(0, 3, 5); add_edge(1, 3, 2); add_edge(1, 4, 1);
        add_edge(3, 1, 3); add_edge(3, 2, 9); add_edge(3, 4, 2); add_edge(4, 2, 6);
        add_edge(2, 4, 4);
        int d1[V], d2[V], pred[V];
        dijkstra(0, d1);
        printf("part 4: Dijkstra（G2，非负权，源 s）：\n");
        print_d(d1);
        printf("        期望（逐点松弛）：s=0 t=8 x=13 y=5 z=7\n");
        assert(d1[0] == 0 && d1[1] == 8 && d1[2] == 13 && d1[3] == 5 && d1[4] == 7);
        /* 交叉验证：Bellman-Ford（G2 无负边，两算法必须一致） */
        (void)bellman_ford(0, d2, pred);
        for (int i = 0; i < V; i++) { assert(d1[i] == d2[i]); }
        printf("        交叉验证：Bellman-Ford 在同一图上给出完全相同的 d ✓\n");
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 五关共用本文件；本关注释聚焦 Part 1/2（Bellman-Ford）。'},
           {line:30,zh:'`relax`：全书共用的原子操作。'},
           {line:42,zh:'`bellman_ford`：8 行直译；第 V−1 轮全边松弛 + 检查轮。'},
           {line:100,zh:'★★ part 1：d = {0,2,4,7,-2} —— 与原书 p.613 逐位一致。'},
           {line:110,zh:'★★ part 2：加入 z→t(−4) 构造负环 → 算法正确检出。'}]},
    tests:[{in:'G1 = Figure 22.1 的图，源 s',out:'d = {0,2,4,7,-2}；返回 TRUE'},
           {in:'加入 z→t(−4)',out:'检出负环（返回 FALSE）'}],
    mapping:[{pc:2,pcCode:'for i = 1 to |G.V| − 1',c:'`for (int i = 1; i <= V - 1; i++)`（第 42 行）'},
             {pc:6,pcCode:'if v.d > u.d + w(u,v)',c:'检查轮的 `if (d[...] + w < d[...])`（第 48 行）'}]},
   {type:'analyze',title:'一本账：O(VE) 的来源与后果',claims:[
     {expr:'O(VE)',when:'Bellman-Ford 的运行时间',page:613,source:'book'},
     {expr:'|V| - 1',when:'全边松弛的轮数（最短路径至多这么多条边）',page:612,source:'book'},
     {expr:'\\text{负环}',when:'返回 FALSE 的充要条件（从 s 可达）',page:615,source:'book'},
    ],tables:[{caption:'C 程序实测（G1：5 顶点 10 边）',rows:[
      ['量','理论','实测'],
      ['轮数','V−1 = 4','收敛于第 4 轮内'],
      ['松弛成功','≤ 40','7 次'],
      ['负环检测','返回 FALSE','z→t(−4) 当场检出'],
     ]},{caption:'三种最短路算法的选择（后续三关）',rows:[
      ['图的特征','算法','时间'],
      ['含负边','Bellman-Ford','O(VE)'],
      ['DAG','DAG-SSSP','O(V+E)'],
      ['非负权','Dijkstra','O((V+E) lg V)'],
     ]}],chart:{xMax:64,series:[
     {name:'Bellman-Ford VE',expr:'n * n',color:'--viz-violation'},
     {name:'Dijkstra (V+E)lg V',expr:'n * Math.log2(n)',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'V−1 轮的归纳证明',steps:[
      {zh:'断言：第 $i$ 轮后，所有"至多 $i$ 条边"的最短路已有正确的 $d$ 值。'},
      {zh:'归纳：$i+1$ 条边的最短路 $(s, \\ldots, v)$ 的前驱 $u$ 在第 $i$ 轮后已有正确 $d[u]$；第 $i+1$ 轮松弛 $(u,v)$ 时修正 $d[v]$。'},
      {tex:'i = |V| - 1 \\text{ 时覆盖一切简单路径}',zh:'★ 超过 V−1 条边的路径必含环；最短路不含负环 → 可去掉。∎'}]},
     ],
    note:''},
   {type:'prove',title:'定理 22.4 与负环检测',statement:'Theorem 22.4 (Correctness of the Bellman-Ford algorithm)',page:614,
    intro:'★ 定理分两半：(a) 无负环时算得对；(b) 有可达负环时返回 FALSE。',
    steps:[
     {title:'(a) 无负环时 d 值正确',en:'To prove the correctness of the Bellman-Ford algorithm, we start by showing that if there are no negative-weight cycles, the algorithm computes correct shortest-path weights for all vertices reachable from the source.',page:613,
      body:['设 $v$ 的最短路径含至多 $|V|-1$ 条边；第 $i$ 轮后"≤ i 条边"的最短路都正确（归纳，如左侧推导）。',
        '上界性质（22.5）保证 $d[v] \\ge \\delta(s,v)$ 恒成立；归纳保证 $d[v] \\le \\delta(s,v)$ 在 $|V|-1$ 轮后成立。',
        '两者夹出 $d[v] = \\delta(s,v)$。∎']},
     {title:'(b) 可达负环 ⇒ 返回 FALSE',en:'Now, suppose that graph G contains a negative-weight cycle reachable from the source s . Let this cycle be c = \u27e8v 0 ,v 1 ,\u2026,v k\u27e9, where v 0 = v k , in which case we have k X i D1 w(v i \u22121 ,v i )<0: (22.1)',page:615,
      body:['设负环 $c$ 上各结点在 $|V|-1$ 轮后都有 $d[v_i] \\le d[v_{i-1}] + w(v_{i-1}, v_i)$。',
        '全式求和：$\\sum d[v_i] \\le \\sum d[v_{i-1}] + \\sum w$，左端与第一项相消 → $0 \\le \\sum w$。',
        '与负环定义 $\\sum w < 0$ 矛盾 → 检查轮必能找到可松弛的边 → 返回 FALSE。∎']},
     {title:'实测印证',en:'The d and \u03a9 values in part (e) are the final values. The Bellman-Ford algorithm returns TRUE in this example.',page:613,
      body:['C 程序 part 1：G1 无负环，返回 TRUE 且 d 与原书一致。',
        'C 程序 part 2：人为加入负环（z→t −4），返回 FALSE。',
        '★ 两个方向的定理都得到实验印证。∎']},
    ],conclusion:'★ 结论：Bellman-Ford = "V−1 轮松弛" + "负环探测器"；O(VE) 换来对负边的完全支持。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'Bellman-Ford 的第 V−1 轮之后还做什么？',options:['直接返回结果','**再扫一遍所有边检查是否仍可松弛**','重新初始化','转置图再跑一遍'],answer:1,
      why:'★ 检查轮是负环探测器：仍可松弛 ⇒ 从 s 可达负环。'},
     {kind:'single',q:'Bellman-Ford 的运行时间是？',options:['O(V+E)','**O(VE)**','O(V lg V)','O(E lg V)'],answer:1,
      why:'★ (V−1) 轮 × 全边扫描。'},
     {kind:'judge',q:'Bellman-Ford 可以处理带负权边的图。',answer:true,
      why:'★ 这正是它相对 Dijkstra 的核心优势（负环除外）。'},
     {kind:'simulate',q:'Figure 22.1 的图上，Bellman-Ford 从 s 出发 d[z] = ？（填数字）',expect:[-2],placeholder:'例如：-1',
      why:'d = {0,2,4,7,-2}（原书 p.613；C 程序 part 1 实测）。'},
     {kind:'judge',q:'Bellman-Ford 的"检查轮"返回 FALSE，当且仅当存在从源点可达的负权环。',answer:true,why:'★ 定理 22.4(b)：第 V 轮仍可松弛 ⟺ 可达负环。'},
     {kind:'simulate',q:'在 Figure 22.1 的图上，Bellman-Ford 的松弛成功了多少次？（填数字）',expect:[7],placeholder:'例如：10',why:'★ C 程序 part 1：松弛成功仅 7 次（远低于 (V−1)·E = 40 上限）。'},
    ],bookExercises:[
     {id:'22.1-1',page:615,star:0,statement:'Run the Bellman-Ford algorithm on the directed graph of Figure 22.4, using ver- tex ´ as the source. In each pass, relax edges in the same order as in the figure, and show the d and Ω values after each pass. Now, change the weight of edge .´,x/ to 4 and run the algorithm again, using s as the source.',hint:'两问分开跑，逐轮表**只能自己列**：按题干指定的源点跑够 $|V|-1$ 轮， 每轮结束把**全部**结点的 $d$ 与 $\\pi$ 抄一遍，松弛的边序照题干说的「与图中画法同序」。 本关的 C 程序帮不上这个忙：part 1 跑 Bellman-Ford 只在结束时打印最终 $d$ 和一个总松弛成功次数， 既没有逐轮的 $d$ 表、也完全不打印 $\\pi$。 第二问改掉一条边的权、换源点重跑，跑完别急着交：先自己核对「再跑一轮还能不能松弛」—— 如果能，说明从源点可达的负权环存在，此时打印出来的 $d$、$\\pi$ **不代表最短路径**， 要像本关 part 2 演示的那样报负环，而不是给出一个看着完整的解。'},
     {id:'22.1-2',page:615,star:0,statement:'Prove Corollary 22.3.',hint:'推论 22.3 说的是：$v$ 从 $s$ 可达 ⟺ BELLMAN-FORD 停机时 $v.d$ 有限。两个方向都要证。可达那一侧：取一条最短路径（简单路径，至多 $|V|-1$ 条边），用**路径松弛性质**说明它在 $|V|-1$ 轮内一定被打通；反向那一侧：$d$ 只能通过对某条真实路径上的边做松弛才被赋成有限值，所以有限值本身就携带了一条从 $s$ 出发的路径。⚠ 引用编号要查准：路径松弛性质是 **Lemma 22.15（p.635）**，本站 p.617 那个 22.5 是 DAG 单源最短路径的定理，不是它。'},
     {id:'22.1-3',page:616,star:0,statement:'Given a weighted, directed graph G = (V,E) with no negative-weight cycles, let m be the maximum over all vertices v 2 V of the minimum number of edges in a shortest path from the source s to v. (Here, the shortest path is by weight, not the number of edges.) Suggest a simple change to the Bellman-Ford algorithm that allows it to terminate in m + 1 passes, even if m is not known in advance.',hint:'把「固定 |V|−1 轮」改成「上一轮没有任何 d 变化就停机」，然后证明：第 i 轮结束时，所有最短路上边数不超过 i 的结点都已经收敛。m 的定义正好是那个最大的边数。'},
     {id:'22.1-4',page:616,star:0,statement:'Modify the Bellman-Ford algorithm so that it sets v: d to −1 for all vertices v for which there is a negative-weight cycle on some path from the source to v.',hint:'先跑一遍标准 Bellman-Ford；再做一轮"传播 −∞"：凡能从"检查轮仍可松弛的边"到达的点都置 −∞（等价于在缩点后的负环 super-node 上做可达性传播）。'},
     {id:'22.1-5',page:616,star:0,statement:'Suppose that the graph given as input to the Bellman-Ford algorithm is represented with a list of |E| edges, where each edge indicates the vertices it leaves and enters, along with its weight. Argue that the Bellman-Ford algorithm runs in O(VE) time without the constraint that |E| = Ω(V ) . Modify the Bellman-Ford algorithm so that it runs in O(VE) time in all cases when the input graph is represent ed with adjacency lists.',hint:'第一问只是把每轮代价说清楚：扫边表是 $\\Theta(E)$，共 |V| 轮。第二问的坑在邻接表表示：每轮要遍历所有结点及其出边才是 $\\Theta(V+E)$，当 E 比 V 小得多时 V 那一项会顶上来 —— 改成「只从当前 d 有限的结点扫出边」就回到 $O(VE)$。'},
    ]},
  ],
};
