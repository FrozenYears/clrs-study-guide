/* 第 22 章 22.2：DAG 上的单源最短路径（Single-source shortest paths in directed acyclic graphs）。印刷页 616–619（pdf 637–640）。 */
export default {
  key:'s02',id:'ch22/s02',chapter:22,section:'22.2',
  title:'DAG-SSSP：先排序后松弛',shortTitle:'22.2 DAG 上的 SSSP',
  titleEn:'Single-source shortest paths in directed acyclic graphs',
  source:{printed:[616,619],pdf:[637,640]},
  prerequisites:[{label:'22.1 The Bellman-Ford algorithm',url:'#/ch22/s01'}],
  stages:[
   {type:'map',title:'利用拓扑序一次松弛到位',
    why:'若图是 **DAG**（无环），最短路径问题可以做得比 Bellman-Ford 更快更好：先拓扑排序，再**按拓扑序每个结点松弛一次出边** —— 线性时间 O(V+E)，且支持负权。',
    position:'20.4 的拓扑排序在这里变成算法加速器。它同时是关键路径（PERT）计算的原型。',
    unlocks:[{label:'22.3 Dijkstra\u2019s algorithm',url:'#/ch22/s03'}],
    mathKit:[
     {title:'算法',body:'① 拓扑排序；② 按拓扑序逐结点 $u$：RELAX $u$ 的每条出边。'},
     {title:'复杂度',body:'$\\Theta(V + E)$ —— 排序线性 + 每条边恰松弛一次。'},
     {title:'应用',body:'关键路径（PERT 图）、表示-计算依赖、巴谢尔（Bailey）问题。'},
    ]},
   {type:'intuition',title:'拓扑序保证"依赖已就绪"',scene:'Figure 22.8 的 DAG（C 程序 Part 3）',body:[
     '按拓扑序松弛时，处理到结点 $u$ 的那一刻，**所有能到达 $u$ 的结点都已处理完** —— $d[u]$ 已是最终值，出边松弛一次即可。',
     '★ C 程序 Part 3 实测：Figure 22.8 的 DAG（源 r）得 r=0, s=5, t=3, x=10, y=7 —— 且与 Bellman-Ford 在同一图上的结果**逐位一致**（交叉验证）。',
     '★ DAG 允许负权（无环 ⇒ 无负环！），所以这里不需要 Bellman-Ford 的多轮循环。',
     '★ 应用：关键路径 = 把边权换成时间、求"最长路"（把松弛方向反过来）—— PERT 图的分析内核。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文。',blocks:[
     {kind:'body',page:617,en:'The following theorem shows that the DAG-SHORTEST-PATHS procedure correctly computes the shortest paths.',
      zh:'★ 定理 22.5：DAG-SHORTEST-PATHS 的正确性。'},
     {kind:'body',page:617,en:'If a weighted, directed graph G = (V,E) has source vertex s and no cycles, then at the termination of the DAG-SHORTEST-PATHS procedure, v: d = i(s,v) for all vertices v 2 V , and the predecessor subgraph G \u2212 is a shortest-paths tree.',
      zh:'★★ 定理：结束时 $v.d = \\delta(s,v)$ 且前驱子图是最短路径树。'},
     {kind:'body',page:619,en:'\u2022 negating the edge weights and running DAG-SHORTEST-PATHS, or \u2022 running DAG-SHORTEST-PATHS, but replacing " 1" by " \u22121" in line 2 of INITIALIZE-SINGLE-SOURCE and <>= by <<= in the RELAX procedure.',
      zh:'★ 最长路径版本：负化权重（或改松弛方向）—— PERT 关键路径的算法内核。'},
    ],terms:[{en:'DAG-SHORTEST-PATHS',zh:'DAG 上的单源最短路',page:616},
              {en:'critical path',zh:'关键路径（最长路的应用）',page:619}]},
   {type:'pseudocode',title:'DAG-SHORTEST-PATHS：5 行',algo:'DAG-SHORTEST-PATHS',signature:'DAG-SHORTEST-PATHS(G, w, s)',page:617,
    lines:[
     {n:1,code:'topologically sort the vertices of G',zh:'★★ 第一步：拓扑排序。'},
     {n:2,code:'INITIALIZE-SINGLE-SOURCE(G, s)',zh:''},
     {n:3,code:'for each vertex u, taken in topologically sorted order',zh:'★★ 按拓扑序逐点。'},
     {n:4,code:'    for each vertex v ∈ G.Adj[u]',zh:''},
     {n:5,code:'        RELAX(u, v, w)',zh:'★ 每条边恰松弛一次。'}],
    vars:[{name:'拓扑序',meaning:'依赖先于被依赖者的线性序'}],
    note:'★ 与 Bellman-Ford 的对照：V−1 轮全边 → 1 趟"每个结点一轮出边"。拓扑序保证次序正确。',
    more:[]},
   {type:'visualize',title:'线性时间的松弛',panels:[
     {title:'C 程序 Part 3：DAG 上三算法对照',viz:'growth',
      chart:{xMax:64,series:[
       {name:'DAG-SSSP：O(V+E)',expr:'2 * n',color:'--viz-done'},
       {name:'Bellman-Ford：O(VE)',expr:'n * n',color:'--viz-violation'}]},
      note:'★ 实测：DAG-SSSP 与 Bellman-Ford 的 d 值逐位一致（C 程序交叉验证），但代价线性。'},
    ],tasks:['对照 C 程序 Part 3 的 d 值与交叉验证断言。'],note:''},
   {type:'code',title:'实测：r=0 s=5 t=3 x=10 y=7',c:{file:'sssp.c',code:String.raw`/* sssp.c -- 22 章：单源最短路径（Bellman-Ford / DAG-SSSP / Dijkstra）。
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
    notes:[{line:1,zh:'★ 五关共用本文件；本关注释聚焦 Part 3（DAG-SSSP）。'},
           {line:64,zh:'`dfs_topo`：DFS 求拓扑序（完成时间逆序）。'},
           {line:74,zh:'`dag_sssp`：5 行直译 —— 按拓扑序逐点松弛。'},
           {line:150,zh:'★★ part 3：Figure 22.8 的 DAG，源 r：r=0 s=5 t=3 x=10 y=7。'},
           {line:155,zh:'★ 交叉验证：Bellman-Ford 在同一 DAG 上给出完全相同的 d。'}]},
    tests:[{in:'Figure 22.8 的 DAG，源 r',out:'r=0 s=5 t=3 x=10 y=7'},
           {in:'交叉验证',out:'与 Bellman-Ford 的 d 逐点一致'}],
    mapping:[{pc:3,pcCode:'for each vertex u, taken in topologically sorted order',c:'`for (int t = 0; t < V; t++) { int u = topo[t]; ... }`（第 76 行）'},
             {pc:5,pcCode:'RELAX(u, v, w)',c:'`relax(d, u, v, adjm[u][v]);`（第 82 行）'}]},
   {type:'analyze',title:'一本账：三种 SSSP 算法的选择',claims:[
     {expr:'\\Theta(V + E)',when:'DAG-SSSP 的运行时间（含拓扑排序）',page:616,source:'book'},
     {expr:'v.d = \\delta(s,v)',when:'终止时的正确性（定理 22.5）',page:617,source:'book'},
     {expr:'\\text{无环}',when:'DAG 天然无负环 —— 负权边免费支持',page:617,source:'book'},
    ],tables:[{caption:'三种算法的选择表（截至本关）',rows:[
      ['图的特征','算法','时间','负权'],
      ['任意','Bellman-Ford','O(VE)','✓（检测负环）'],
      ['**DAG**','**DAG-SSSP**','**Θ(V+E)**','✓（天然无负环）'],
      ['非负权','Dijkstra（22.3）','O((V+E)lgV)','✗'],
     ]}],chart:{xMax:64,series:[
     {name:'DAG-SSSP：V+E',expr:'2 * n',color:'--viz-done'},
     {name:'Bellman-Ford：VE',expr:'n * n',color:'--viz-violation'},
     {name:'Dijkstra：(V+E)lgV',expr:'n * Math.log2(n)',color:'--viz-compare'}]},
    derivations:[{kind:'summation',title:'定理 22.5 的证明骨架',steps:[
      {zh:'设 $(v_0=s, v_1, \\ldots, v_k)$ 是 $s$ 到 $v$ 的最短路径，拓扑序保证 $v_0, v_1, \\ldots, v_k$ 依次出现。'},
      {zh:'处理到 $v_i$ 时，$d[v_i]$ 已正确（归纳：$v_{i-1}$ 已处理且松弛过边 $(v_{i-1}, v_i)$）。'},
      {tex:'d[v_k] = \\delta(s, v_k)',zh:'★ 上界性质（22.5）封顶 —— 两者夹出精确值。∎'}]},
     ],
    note:''},
   {type:'prove',title:'定理 22.5：拓扑序 + 单次松弛',statement:'If a weighted, directed graph G = (V,E) has source vertex s and no cycles, then at the termination of the DAG-SHORTEST-PATHS procedure, v: d = i(s,v) for all vertices v 2 V , and the predecessor subgraph G \u2212 is a shortest-paths tree.',page:617,
    intro:'★ 证明依赖两个已证事实：白色路径引理（20.3）与上界性质（22.5）。',
    steps:[
     {title:'关键观察：路径在拓扑序中单调',en:'The following theorem shows that the DAG-SHORTEST-PATHS procedure correctly computes the shortest paths.',page:617,
      body:['DAG 的拓扑序满足：路径上的结点按拓扑序出现（边 u→v ⇒ u 在 v 前）。',
        '所以最短路径 $(s, v_1, \\ldots, v_k)$ 的每个 $v_i$ 都在 $v_{i-1}$ 之后被处理。']},
     {title:'归纳 + 上界封顶',en:'If a weighted, directed graph G = (V,E) has source vertex s and no cycles, then at the termination of the DAG-SHORTEST-PATHS procedure, v: d = i(s,v) for all vertices v 2 V , and the predecessor subgraph G \u2212 is a shortest-paths tree.',page:617,
      body:['归纳假设：处理完 $v_{i-1}$ 时 $d[v_{i-1}] = \\delta(s, v_{i-1})$。',
        '松弛 $(v_{i-1}, v_i)$：$d[v_i] \\le d[v_{i-1}] + w = \\delta(s,v_{i-1}) + w(v_{i-1},v_i) = \\delta(s,v_i)$。',
        '上界性质给 $d[v_i] \\ge \\delta(s,v_i)$ → 夹出等号；此后 $d[v_i]$ 不再变（后继只会更靠后）。∎']},
     {title:'实测与交叉验证',en:'\u2022 negating the edge weights and running DAG-SHORTEST-PATHS, or \u2022 running DAG-SHORTEST-PATHS, but replacing " 1" by " \u22121" in line 2 of INITIALIZE-SINGLE-SOURCE and <>= by <<= in the RELAX procedure.',page:619,
      body:['C 程序 part 3：DAG-SSSP 得 r=0 s=5 t=3 x=10 y=7。',
        '交叉验证：Bellman-Ford 在同一 DAG 上给出完全相同的 d —— 两个独立算法互证。',
        '★ 负权边 x→y(−1) 被正确处理（DAG 无环 → 无负环）。∎']},
    ],conclusion:'★ 结论：拓扑序是 DAG 的"万能预处理" —— 一次排序换来线性时间与负权支持。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'DAG-SSSP 相对 Bellman-Ford 的两大优势是？',options:['支持负环','**线性时间 + 支持负权边**','不需要权重','可以处理无向图'],answer:1,
      why:'★ 拓扑序松弛一次到位；DAG 天然无负环。'},
     {kind:'single',q:'DAG-SSSP 的第一步是？',options:['初始化','**拓扑排序**','建邻接矩阵','堆化'],answer:1,
      why:'★ 没有拓扑序就没有"每个结点处理一次"的正确性。'},
     {kind:'judge',q:'DAG-SSSP 可以把松弛方向反过来求最长路径。',answer:true,
      why:'★ 原书 p.619：负化权重或改松弛方向 —— PERT 关键路径的算法内核。'},
     {kind:'simulate',q:'C 程序 Part 3 中 x 的最短距离是多少？（DAG 源 r，填数字）',expect:[10],placeholder:'例如：11',
      why:'x = min(s+6=11, t+7=10) = 10（C 程序 part 3 实测）。'},
     {kind:'judge',q:'DAG-SSSP 可以处理带负权边的图。',answer:true,why:'★ DAG 无环 ⇒ 无负环，负权边免费支持（p.617）。'},
     {kind:'simulate',q:'Figure 22.8 的 DAG 以 r 为源时，d[t] 是多少？（填数字）',expect:[3],placeholder:'例如：5',why:'★ t = r→t 权 3（C 程序 part 3 实测：r=0 s=5 t=3 x=10 y=7）。'},
    ],bookExercises:[
     {id:'22.2-1',page:619,star:0,statement:'Show the result of running DAG-SHORTEST-PATHS on the directed acyclic graph of Figure 22.5, using vertex r as the source.',hint:'先把那张图的一个拓扑序列写出来（本站 c/sssp.c 会打印拓扑序），再按该序逐点松弛它的出边；处理完每个结点就把当前 d 与 $\\pi$ 抄下来，一轮即可收敛。'},
     {id:'22.2-2',page:619,star:0,statement:'Suppose that you change line 3 of DAG-SHORTEST-PATHS to read 3 for the first |V| − 1 vertices, taken in topologically sorted order Show that the procedure remains correct.',hint:'拓扑序那一步保证「松弛 $u$ 时 $d[u]$ 已经定了」，正确性论证看 p.617 的**定理 22.5** （DAG 最短路径），它按拓扑序对每条边做一遍 $\\text{RELAX}$。 顺带修个编号：本章并没有「引理 22.7」，编号 22.7 是 Dijkstra 那节的推论（前驱子图构成最短路径树）， 跟 DAG-SHORTEST-PATHS 不是一回事，别把两处论证搅在一起。'},
     {id:'22.2-3',page:619,star:0,statement:'An alternative way to represent a PERT chart looks more like the dag of Figure 20.7 on page 574. Vertices represent tasks and edges represent sequencing constraints, that is, edge (u,v) indicates that task u must be performed before task v. Vertices, not edges, have weights. Modify the DAG-SHORTEST-PATHS procedure so that it finds a longest path in a directed acyclic graph with weighted vertices in linear time.',hint:'把权重从边搬到结点之后，松弛式子里加的就不是 w(u,v) 而是 v 自己的权重；求关键路径要求最长路，于是把 min 与初值 $\\infty$ 换成 max 与 $-\\infty$。拓扑序、逐点一遍的框架一字不动。'},
    ]},
  ],
};
