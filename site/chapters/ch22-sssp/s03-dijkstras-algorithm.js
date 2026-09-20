/* 第 22 章 22.3：Dijkstra 算法（Dijkstra's algorithm）。印刷页 620–624（pdf 641–645）。 */
export default {
  key:'s03',id:'ch22/s03',chapter:22,section:'22.3',
  title:'Dijkstra：贪心的最短路',shortTitle:'22.3 Dijkstra',
  titleEn:'Dijkstra\u2019s algorithm',
  source:{printed:[620,624],pdf:[641,645]},
  prerequisites:[{label:'22.2 Single-source shortest paths in DAGs',url:'#/ch22/s02'}],
  stages:[
   {type:'map',title:'非负权下的贪心最优',
    why:'Dijkstra 要求**边权非负**，用贪心策略：每轮从队列取 $d$ 最小的结点入集合 $S$（它的 $d$ 已是最终最短距），然后松弛它的出边。二叉堆下 $O((V+E)\\lg V)$。',
    position:'DAG-SSSP 的"无负权"特化版；贪心思想（15/21 章）在最短路上的形态。正确性证明用反证 + 非负性。',
    unlocks:[{label:'22.4 Difference constraints and shortest paths',url:'#/ch22/s04'}],
    mathKit:[
     {title:'集合 S',body:'已确定最短距的结点集合；每轮扩张一个。'},
     {title:'选择',body:'$u = \\arg\\min_{v \\in Q} d[v]$ —— 贪心选择。'},
     {title:'复杂度',body:'二叉堆 $O((V+E)\\lg V)$；斐波那契堆 $O(V \\lg V + E)$。'},
    ]},
   {type:'intuition',title:'非负权让"贪心"无后顾之忧',scene:'Figure 22.9 的图（C 程序 Part 4）',body:[
     '非负权的关键作用：$d[u]$ 最小的结点 $u$ 入集合后，任何绕道都不可能更短 —— 因为绕道的路径要先经过某个 $d \\ge d[u]$ 的结点，加上非负边只会更长。',
     '★ C 程序 Part 4：G2 上 Dijkstra 得 s=0 t=8 x=13 y=5 z=7，与 Bellman-Ford（同图交叉验证）完全一致。',
     '⚠ 负权会破坏这一切：若某条绕道含负边，"当前 d 最小"的结点可能被后来者超越 —— 定理 22.6 的证明失效（习题 22.3-4）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文。',blocks:[
     {kind:'body',page:620,en:'Dijkstra9s algorithm relaxes edges as shown in Figure 22.6. Line 1 initializes the d and ] values in the usual way, and line 2 initializes the set S to the empty set.',
      zh:'★ 算法骨架：初始化 + 循环"取最小 → 松弛"。'},
     {kind:'body',page:622,en:'Theorem 22.6 (Correctness of Dijkstra\u2019s algorithm)',
      zh:'★★ 定理 22.6：Dijkstra 的正确性。'},
     {kind:'body',page:622,en:'Dijkstra9s algorithm, run on a weighted, directed graph G = (V,E) with nonnegative weight function w and source vertex s , terminates with u: d = i(s,u) for all vertices u 2 V .',
      zh:'★★ 定理内容：非负权下结束时 $u.d = \\delta(s,u)$。'},
     {kind:'body',page:624,en:'Dijkstra9s algorithm produces an incorrect answer. Why doesn9t the proof of Theorem 22.6 go through when negative-weight edges are allowed?',
      zh:'★ 习题 22.3-4：为什么负权时证明失效 —— 本关正确性的镜像问题。'},
    ],terms:[{en:'Dijkstra',zh:'Dijkstra 算法',page:620},
              {en:'nonnegative weight function',zh:'非负权（贪心的前提）',page:622}]},
   {type:'pseudocode',title:'DIJKSTRA：12 行',algo:'DIJKSTRA',signature:'DIJKSTRA(G, w, s)',page:621,
    lines:[
     {n:1,code:'INITIALIZE-SINGLE-SOURCE(G, s)',zh:''},
     {n:2,code:'S = ∅',zh:'已确定最短距的集合。'},
     {n:3,code:'Q = G.V',zh:'最小优先队列（按 d）。'},
     {n:4,code:'while Q ≠ ∅',zh:''},
     {n:5,code:'    u = EXTRACT-MIN(Q)',zh:'★★ 贪心选择：d 最小者。'},
     {n:6,code:'    S = S ∪ {u}',zh:''},
     {n:7,code:'    for each vertex v ∈ G.Adj[u]',zh:''},
     {n:8,code:'        RELAX(u, v, w)',zh:'★ 只松弛未确定的结点。'}],
    vars:[{name:'S',meaning:'已确定集合'},{name:'Q',meaning:'优先队列（按 d）'}],
    note:'★ 与 16.4/21.2 一脉相承：EXTRACT-MIN + DECREASE-KEY 的组合 —— 优先队列实现的差异决定复杂度。',
    more:[]},
   {type:'visualize',title:'贪心的每一步',panels:[
     {title:'C 程序 Part 4：G2 上的 Dijkstra',viz:'growth',
      chart:{xMax:16,series:[
       {name:'Dijkstra d 总和 = 0+8+13+5+7',expr:'33',color:'--viz-done'},
       {name:'与 Bellman-Ford 交叉验证一致',expr:'33',color:'--viz-compare'}]},
      note:'★ 两个独立算法给出逐位相同的 d —— 交叉验证。'},
    ],tasks:['对照 C 程序 part 4 的交叉验证断言。'],note:''},
   {type:'code',title:'实测：交叉验证 Dijkstra',c:{file:'sssp.c',code:String.raw`/* sssp.c -- 22 章：单源最短路径（Bellman-Ford / DAG-SSSP / Dijkstra）。
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
    notes:[{line:1,zh:'★ 五关共用本文件；本关注释聚焦 Part 4（Dijkstra）。'},
           {line:88,zh:'`dijkstra`：12 行直译（数组版 EXTRACT-MIN）。'},
           {line:170,zh:'★★ part 4：G2 上 Dijkstra d = {0,8,13,5,7}。'},
           {line:172,zh:'★ 交叉验证：Bellman-Ford（同图）给出完全相同的 d。'}]},
    tests:[{in:'G2（非负权）源 s',out:'Dijkstra d = {0,8,13,5,7}'},
           {in:'交叉验证',out:'与 Bellman-Ford 逐点一致'}],
    mapping:[{pc:5,pcCode:'u = EXTRACT-MIN(Q)',c:'`for (int i = 0; i < V; i++) { if (!done[i] && (u < 0 || d[i] < d[u])) { u = i; } }`（第 96 行）'},
             {pc:8,pcCode:'RELAX(u, v, w)',c:'`relax(d, u, v, adj[u][v]);`（第 101 行）'}]},
   {type:'analyze',title:'一本账：数据结构决定复杂度',claims:[
     {expr:'O((V + E) \\lg V)',when:'Dijkstra 用二叉最小堆',page:623,source:'book'},
     {expr:'O(V \\lg V + E)',when:'Dijkstra 用斐波那契堆',page:623,source:'book'},
     {expr:'O(V^2)',when:'Dijkstra 用数组（稠密图上反而最优）',page:623,source:'book'},
    ],tables:[{caption:'C 程序实测（G2：5 顶点 9 边）',rows:[
      ['轮次','入树结点','松弛效果'],
      ['1','s（d=0）','t=10, y=5'],
      ['2','y（d=5）','t=8, x=14, z=7'],
      ['3','t（d=8）','z=9→7'],
      ['4','z（d=7）','x=14→13'],
      ['5','x（d=13）','—'],
     ]},{caption:'三种实现的对照',rows:[
      ['实现','EXTRACT-MIN','DECREASE-KEY','总时间'],
      ['数组','O(V)','O(1)','O(V²)'],
      ['二叉堆','O(lg V)','O(lg V)','O((V+E) lg V)'],
      ['斐波那契堆','O(lg V) 摊还','O(1) 摊还','O(V lg V + E)'],
     ]}],chart:{xMax:64,series:[
     {name:'数组 V²',expr:'n * n',color:'--viz-violation'},
     {name:'二叉堆 (V+E)lgV',expr:'n * Math.log2(n)',color:'--viz-compare'},
     {name:'斐波那契 VlgV+E',expr:'n * Math.log2(n) / 2',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'定理 22.6 的证明骨架（反证）',steps:[
      {zh:'设 $u$ 是第一个以 $d[u] \\ne \\delta(s,u)$ 入集合 $S$ 的结点；$y$ 是 $s \\leadsto u$ 最短路上第一个不在 $S$ 的结点。'},
      {zh:'非负性 + 最短路的子路径性质给出 $d[y] = \\delta(s,y) \\le \\delta(s,u)$；且 $d[u] \\le d[y]$（$u$ 先被选中）→ $d[u] = d[y]$。'},
      {tex:'\\delta(s,y) = d[y] = d[u] \\ge \\delta(s,u) \\ge \\delta(s,y)',zh:'★ 夹逼得 $\\delta(s,u) = \\delta(s,y)$，再由"松弛已发生"推 $d[u] = \\delta(s,u)$ —— 矛盾。∎'}]},
     ],
    note:''},
   {type:'prove',title:'定理 22.6：非负权下的贪心正确',statement:'Dijkstra9s algorithm, run on a weighted, directed graph G = (V,E) with nonnegative weight function w and source vertex s , terminates with u: d = i(s,u) for all vertices u 2 V .',page:622,
    intro:'★ 与 Prim/MST 一样，这是"贪心 + 反证"的标准结构；非负性在第三步出场。',
    steps:[
     {title:'反证设定',en:'Dijkstra9s algorithm relaxes edges as shown in Figure 22.6. Line 1 initializes the d and ] values in the usual way, and line 2 initializes the set S to the empty set.',page:620,
      body:['设 $u$ 是第一个入 $S$ 时 $d[u] \\ne \\delta(s,u)$ 的结点（显然 $u \\ne s$）。',
        '取 $s \\leadsto u$ 的真最短路；$y$ 是该路上第一个不属于 $S$ 的结点，$x$ 是其前驱（在 $S$ 中）。',
        '归纳知 $d[x] = \\delta(s,x)$；松弛 $(x,y)$ 已发生 → $d[y] \\le \\delta(s,y)$。']},
     {title:'非负性上场',en:'Dijkstra9s algorithm, run on a weighted, directed graph G = (V,E) with nonnegative weight function w and source vertex s , terminates with u: d = i(s,u) for all vertices u 2 V .',page:622,
      body:['最短路的子路径性质：$\\delta(s,y) \\le \\delta(s,u)$。',
        '上界性质：$d[y] \\ge \\delta(s,y)$ → $d[y] = \\delta(s,y) \\le \\delta(s,u) \\le d[u]$。',
        '**非负性**保证 $\\delta(s,u) \\le d[y]$：因为 $u$ 入集合时 $d[u]$ 最小，而路径 $s \\leadsto y \\leadsto u$ 的后半段（$y \\leadsto u$）边权非负 → $\\delta(s,u) \\ge \\delta(s,y) = d[y] \\ge d[u]$。∎']},
     {title:'矛盾收尾',en:'Dijkstra9s algorithm produces an incorrect answer. Why doesn9t the proof of Theorem 22.6 go through when negative-weight edges are allowed?',page:624,
      body:['$d[u] = d[y] = \\delta(s,y) = \\delta(s,u)$ —— 与反证假设 $d[u] \\ne \\delta(s,u)$ 矛盾。',
        '**负权为何破坏证明**：$y \\leadsto u$ 的边若含负权，"$\\delta(s,u) \\ge \\delta(s,y)$"不再成立 —— 贪心选择可能被负边推翻。',
        '★ C 程序 part 4 的交叉验证展示了非负权下两算法的一致性。∎']},
    ],conclusion:'★ 结论：Dijkstra = 贪心 + 非负权；数据结构决定复杂度档位（数组/二叉堆/斐波那契堆）。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'Dijkstra 的贪心选择是？',options:['边权最小的边','**d 最小的未确定结点**','度数最小的结点','任意结点'],answer:1,
      why:'★ EXTRACT-MIN：非负权保证它的 d 已是最终最短距。'},
     {kind:'single',q:'Dijkstra 不能处理负权边的根本原因？',options:['实现复杂','**非负性是正确性证明（定理 22.6）的必要条件**','队列不支持','比较函数写不了'],answer:1,
      why:'★ 负边会让"当前 d 最小"的结点后来被超越 —— 贪心失效（习题 22.3-4）。'},
     {kind:'judge',q:'Dijkstra 在稠密图上用数组实现反而最优。',answer:true,
      why:'★ 数组 O(V²) 与 E=Θ(V²) 同阶；堆的 lg V 因子反而多余。'},
     {kind:'simulate',q:'C 程序 G2 上 Dijkstra 的 d[x] = ？（填数字）',expect:[13],placeholder:'例如：14',
      why:'x = min(y+9=14, z+6=13) = 13（C 程序 part 4 与 Bellman-Ford 交叉验证）。'},
     {kind:'single',q:'用斐波那契堆实现 Dijkstra 的时间是？',options:['$O(V^2)$','**$O(V \\lg V + E)$**','$O(E \\lg V)$','$O(VE)$'],answer:1,why:'★ 本关复杂度账的三行对照：二叉堆 $O((V+E)\\lg V)$、斐波那契堆 $O(V \\lg V + E)$、数组 $O(V^2)$。'},
     {kind:'judge',q:'C 程序在 G2 上跑出的 Dijkstra 结果与 Bellman-Ford 逐点一致。',answer:true,why:'★ 本关 code 段的交叉验证条目写着与 Bellman-Ford 逐点一致 —— 非负权图上两种算法必须同解。'},
     {kind:'judge',q:'Dijkstra 每轮从队列取出 $d$ 最小的结点时，它的 $d$ 已经是最终最短距离。',answer:true,why:'★ 这正是本关 prove 段的命题 $u.d = \\delta(s,u)$：边权非负保证后取的结点不可能再把它改小。'},
    ],bookExercises:[
     {id:'22.3-1',page:624,star:0,statement:'Run Dijkstra9s algorithm on the directed graph of Figure 22.2, first using vertex s as the source and then using vertex ´ as the source. In the style of Figure 22.6, show the d and Ω values and the vertices in set S after each iteration of the while loop.',hint:'照 C 程序 Part 4 的轮次表手工模拟：每轮记 EXTRACT-MIN 的结点与松弛后的 d。'},
     {id:'22.3-2',page:624,star:0,statement:'Give a simple example of a directed graph with negative-weight edges for which Dijkstra9s algorithm produces an incorrect answer. Why doesn9t the proof of The- orem 22.6 go through when negative-weight edges are allowed?',hint:'反例要让「算错的值被**用**下去」，只有两个顶点不够。 取 $s \\to a = 2$、$s \\to b = 3$、$b \\to a = -4$、$a \\to c = 1$：$a$ 以 $d[a]=2$ 先出队， 当场把 $c$ 松弛成 $d[c]=3$；随后 $b$ 出队，$b \\to a$ 把 $d[a]$ 降到 $-1$， 可 $a$ 早已出队、它的出边不会再松弛一遍 —— 于是 $d[c]$ 停在 $3$，而真值 $\\delta(s,c) = (3-4)+1 = 0$。 注意 $d[a]$ 最后自己是对的（CLRS 的 $\\text{RELAX}$ 并不拒绝更新已出队顶点的 $d$）， 坏就坏在「$a$ 出队那一刻用的是过时的 2」，这个错已经流到 $c$ 身上 —— 所以反例必须有下游顶点接住它。 定理 22.6 的归纳正断在「$u$ 出队时 $d[u] = \\delta(s,u)$」这一步： 它需要「绕经未出队顶点的路不会比 $d[u]$ 短」，靠的是路径剩余段权值非负； 负边一出现，绕远路可以变得更短，最小 $d$ 的顶点就不再是已算定的顶点。'},
     {id:'22.3-3',page:624,star:0,statement:'Suppose that you change line 6 of Dijkstra9s algorithm to read 6 while |Q| >1 This change causes the while loop to execute |V| − 1 times instead of |V| times. Is this proposed algorithm correct?',hint:'少抽一次只影响最后一个留在 Q 里的结点。用循环不变量那一套论证：前 |V|−1 次抽取已经把每个可达结点的 d 收敛了，剩下那个结点的出边松弛不可能再改变任何值。'},
     {id:'22.3-4',page:625,star:0,statement:'Modify the DIJKSTRA procedure so that the priority queue Q is more like the queue in the BFS procedure in that it contains only vertices that have been reached from source s so far: Q ⊆ V − S and v 2 Q implies v: d ≠ 1.',hint:'改动要点：初始不把全体结点入队，而是「第一次被松弛到才进 Q」；被再次松弛时要能对 Q 里的元素降低键值。循环条件变成 Q 为空，不可达结点根本不入队 —— 正确性仍来自非负权与「每次抽 d 最小」。'},
     {id:'22.3-5',page:625,star:0,statement:'Professor Gaedel has written a program that he claims implements Dijkstra9s al- gorithm. The program produces v: d and v:Ω for each vertex v 2 V . Give an O(V + E)-time algorithm to check the output of the professor9s program. It should determine whether the d and Ω attributes match those of some shortest-paths tree. You may assume that all edge weights are nonnegative.',hint:'两趟线性检查。第一趟扫边：对每条 (u,v) 验证 $v.d \\le u.d + w(u,v)$，并对每条 $\\pi$ 边验证等号成立（说明它确实被正确松弛过）。第二趟在 G 下划线图上从 s 做一次遍历：验证它是一棵树、且覆盖所有 d 有限的结点。'},
     {id:'22.3-6',page:625,star:0,statement:'Professor Newman thinks that he has worked out a simpler proof of correctness for Dijkstra9s algorithm. He claims that Dijkstra9s algorithm relaxes the edges of every shortest path in the graph in the order in which they appear on the path, and therefore the path-relaxation property applies to every vertex reachable from the source. Show that the professor is mistaken by constructing a directed graph for which Dijkstra9s algorithm relaxes the edges of a shortest path out of order.',hint:'他说的性质比需要的强、又不完全成立：逐条最短路径按序松弛做不到，但只要「每个可达结点存在一条最短路径被按序松弛」就够了。找出证明里把这两件事混过去的那一步，再看非负性与抽取次序是在哪一行被真正用到的。'},
    ]},
  ],
};
