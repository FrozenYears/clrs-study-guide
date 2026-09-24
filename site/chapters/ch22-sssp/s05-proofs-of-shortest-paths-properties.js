/* 第 22 章 22.5：最短路径性质的证明（Proofs of shortest-paths properties）。印刷页 631–639（pdf 652–657）。 */
export default {
  key:'s05',id:'ch22/s05',chapter:22,section:'22.5',
  title:'性质证明：把欠下的账一次结清',shortTitle:'22.5 性质证明',
  titleEn:'Proofs of shortest-paths properties',
  source:{printed:[631,639],pdf:[652,657]},
  prerequisites:[{label:'22.4 Difference constraints',url:'#/ch22/s04'}],
  stages:[
   {type:'map',title:'四个性质的严格证明',
    why:'前四关反复引用的"上界性质""收敛性质"在这里补齐严格证明。它们是 Bellman-Ford/Dijkstra 正确性的公共地基 —— 前面欠的账一次结清。',
    position:'本章收官。四个性质层层递进：最优子结构 → 上界 → 收敛 → 图论引理 → 前驱子图。全部围绕松弛操作展开。',
    unlocks:[{label:'23.1 Shortest paths and matrix multiplication',url:'#/ch23/s01'}],
    mathKit:[
     {title:'引理 22.11',body:'子路径性质：最短路的子路径也是最短路（三角不等式的推论）。'},
     {title:'引理 22.12',body:'**松弛立即生效**：RELAX 后 $v.d \\le u.d + w(u,v)$ 恒成立。'},
     {title:'上界性质',body:'$v.d \\ge \\delta(s,v)$ 恒成立（对一切 $v$、一切时刻）。'},
    ]},
   {type:'intuition',title:'一条链四颗钉',scene:'上界 → 收敛 → 图论 → 前驱子图',body:[
     '★ **上界性质**（22.12/22.13）：$v.d$ 从初始化起只会变小，且永不低于 $\\delta(s,v)$ —— 归纳：初始化正确 + RELAX 保持。',
     '★ **收敛性质**（22.15）：若某时刻 $d[s..v]$ 链上 $d[u] = \\delta(s,u)$，松弛 $(u,v)$ 后 $d[v] = \\delta(s,v)$ —— "正确值一锤定音"。',
     '★ **图论引理**（22.16/22.17）：在正确时刻按正确顺序松弛路径上的边（路径松弛引理），路径终点必正确。',
     '★ **前驱子图性质**（22.19）：无负环时 $G_\\pi$ 是最短路径树 —— 把 π 指针画出来就是一棵树。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文。',blocks:[
     {kind:'body',page:634,en:'Proof By the upper-bound property, we always have 1 = i(s,v) \u2264 v: d, and thus v: d = 1 = i(s,v) .',
      zh:'★ 收敛性质的证明：上界性质 + 前提条件夹出等号。'},
     {kind:'body',page:635,en:'Proof By the upper-bound property, if u: d = i(s,u) at some point prior to relaxing edge (u,v) , then this equation holds thereafter. In particular, after edge (u,v) is relaxed, we have v: d \u2264 u: d + w(u,v) (by Lemma 22.13)',
      zh:'★ 松弛引理（22.14）：松弛后 $v.d \\le u.d + w(u,v)$。'},
     {kind:'body',page:635,en:'The upper-bound property gives v: d \u2265 i(s,v) , from which we conclude that v: d = i(s,v) , and this equation is maintained thereafter.',
      zh:'★ 上界封底：$v.d \\ge \\delta$ 与松弛给出的 $\\le$ 夹出等号。'},
     {kind:'body',page:636,en:'Why? Each vertex on c has a non-NIL predecessor, and so each vertex on c was assigned a finite shortest-path estimate when it was assigned its non-NIL \u03a9 value. By the upper-bound property, each vertex on cycle c has a finite shortest-path weight, which means that it is reachable from s .',
      zh:'★ 前驱子图性质的辅助论证：π 非 NIL 的结点必从 s 可达。'},
    ],terms:[{en:'upper-bound property',zh:'上界性质（v.d ≥ δ 恒成立）',page:634},
              {en:'path relaxation',zh:'路径松弛引理',page:635}]},
   {type:'pseudocode',title:'RELAX 与它的性质',algo:'RELAX',signature:'RELAX(u, v, w) 及四性质（本站整理）',page:634,
    lines:[
     {n:1,code:'IF v.d > u.d + w(u,v)',zh:''},
     {n:2,code:'    v.d = u.d + w(u,v)',zh:'★ 只在更优时更新。'},
     {n:3,code:'    v.π = u',zh:''},
     {n:4,code:'性质 1（松弛立即生效）',zh:'RELAX 后 v.d ≤ u.d + w 恒成立（引理 22.13）。'},
     {n:5,code:'性质 2（上界）',zh:'v.d ≥ δ(s,v) 恒成立（初始化 + 归纳）。'},
     {n:6,code:'性质 3（收敛）',zh:'d[u]=δ 时松弛 (u,v) → v.d = δ 立即成立。'},
     {n:7,code:'性质 4（路径松弛）',zh:'按序松弛路径上的边 → 终点 d 正确。'}],
    vars:[{name:'δ(s,v)',meaning:'s 到 v 的真最短路径权重'}],
    note:'★ 全部最短路算法的正确性 = "证明我的松弛序列覆盖了路径松弛引理要求的序列"。',
    more:[]},
   {type:'visualize',title:'四个性质的逻辑链',panels:[
     {title:'性质之间的依赖关系（从地基到屋顶）',viz:'growth',
      chart:{xMax:10,series:[
       {name:'上界性质（地基）',expr:'1',color:'--viz-done'},
       {name:'收敛性质（依赖上界）',expr:'2',color:'--viz-compare'},
       {name:'图论引理（依赖收敛）',expr:'3',color:'--viz-violation'},
       {name:'前驱子图性质（屋顶）',expr:'4',color:'--viz-done'}]},
      note:'★ 逐层递进：每一层的证明引用下一层。'},
    ],tasks:['对照原书 p.634–636 的四段证明。'],note:''},
   {type:'code',title:'实测：上界与收敛',c:{file:'sssp.c',code:String.raw`/* sssp.c -- 22 章：单源最短路径（Bellman-Ford / DAG-SSSP / Dijkstra）。
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
    notes:[{line:1,zh:'★ 五关共用本文件；本关注释聚焦"松弛的不变量"。'},
           {line:30,zh:'`relax`：每次只在更优时更新 —— 这正是"松弛立即生效"的实现。'},
           {line:134,zh:'★ part 4 的交叉验证（Dijkstra vs Bellman-Ford）隐含验证了上界与收敛性质。'}]},
    tests:[{in:'relax 之后',out:'v.d ≤ u.d + w 恒成立（引理 22.13）'},
           {in:'Bellman-Ford/Dijkstra 交叉验证',out:'两者 d 逐点一致 → 上界与收敛同时成立'}],
    mapping:[{pc:1,pcCode:'IF v.d > u.d + w(u,v)',c:'`if (d[u] != INF && d[u] + w < d[v])`（第 32 行）'}]},
   {type:'analyze',title:'一本账：四性质的清单',claims:[
     {expr:'v.d \\ge \\delta(s,v)',when:'上界性质：任何时刻恒成立',page:634,source:'book'},
     {expr:'d[u] = \\delta(s,u) \\Rightarrow \\text{松弛后 } d[v] = \\delta(s,v)',when:'收敛性质（沿边）',page:635,source:'book'},
     {expr:'(v_0,\\ldots,v_k) \\text{ 按序松弛} \\Rightarrow d[v_k] = \\delta(s,v_k)',when:'路径松弛引理',page:635,source:'book'},
    ],tables:[{caption:'四性质的证明工具',rows:[
      ['性质','工具','对应算法'],
      ['上界','初始化正确 + RELAX 保持','一切算法'],
      ['收敛','上界 + 松弛不等式','Dijkstra（每次 EXTRACT-MIN 后）'],
      ['路径松弛','按序松弛 + 收敛','Bellman-Ford 的 V−1 轮'],
      ['前驱子图','π 指针 + 无负环','Bellman-Ford 返回 TRUE 后'],
     ]},{caption:'路径松弛引理如何"包装"各算法',rows:[
      ['算法','松弛序列','为什么覆盖路径'],
      ['Bellman-Ford','V−1 轮全边','路径 ≤ V−1 条边'],
      ['DAG-SSSP','拓扑序逐点','路径按拓扑序'],
      ['Dijkstra','d 递增提取','非负权 + 收敛'],
     ]}],chart:{xMax:64,series:[
     {name:'路径松弛：一条路径的边数',expr:'Math.log2(n)',color:'--viz-done'},
     {name:'Bellman-Ford 全轮：V·E',expr:'n * n',color:'--viz-violation'}]},
    derivations:[{kind:'summation',title:'上界性质的归纳证明',steps:[
      {zh:'**初始化**：$d[s] = 0 = \\delta(s,s)$；其余 $d = \\infty \\ge \\delta$。✓'},
      {zh:'**RELAX 保持**：更新前 $d[u] \\ge \\delta(s,u)$，更新后 $d[v] = d[u] + w \\ge \\delta(s,u) + w(u,v) \\ge \\delta(s,v)$（三角不等式）。✓'},
      {tex:'v.d \\ge \\delta(s,v) \\ \\text{不变式}',zh:'★ 这是"任何算法都不会给出过小的 d"的根本保证。∎'}]},
     ],
    note:''},
   {type:'prove',title:'路径松弛引理与前驱子图',statement:'Why? Each vertex on c has a non-NIL predecessor, and so each vertex on c was assigned a finite shortest-path estimate when it was assigned its non-NIL \u03a9 value.',page:636,
    intro:'★ 收官两证明：路径松弛引理（22.17）与前驱子图性质（22.19）。',
    steps:[
     {title:'路径松弛引理',en:'The upper-bound property gives v: d \u2265 i(s,v) , from which we conclude that v: d = i(s,v) , and this equation is maintained thereafter.',page:635,
      body:['若路径 $(v_0=s, \\ldots, v_k)$ 在**任意**算法中**按序**松弛，则 $d[v_k] = \\delta(s,v_k)$ 终将成立。',
        '归纳：$d[v_0] = 0$ 正确；松弛 $(v_{i-1}, v_i)$ 时（$d[v_{i-1}]$ 已正确且不再变）由收敛性质 $d[v_i]$ 变为正确。',
        '★ 各算法的正确性 = "证明它的松弛序列包含路径松弛"：Bellman-Ford 用轮数，DAG-SSSP 用拓扑序，Dijkstra 用非负性。∎']},
     {title:'前驱子图性质',en:'Proof By the upper-bound property, if u: d = i(s,u) at some point prior to relaxing edge (u,v) , then this equation holds thereafter. In particular, after edge (u,v) is relaxed, we have v: d \u2264 u: d + w(u,v) (by Lemma 22.13)',page:635,
      body:['无负环且全部结点可达时，$G_\\pi$（π 指针构成的图）是一棵以 s 为根的**最短路径树**。',
        '核心引理（22.18）：INITIALIZE 后的任何时刻，$G_\\pi$ 或者是一棵树，或者……（原书分三种情形归纳：π 更新只发生在 RELAX 中，且保持树性）。',
        'π 链上若有环，必是负环 —— 与"返回 TRUE"矛盾 → 无环 → 树。∎']},
     {title:'负环检测的推论',en:'Why? Each vertex on c has a non-NIL predecessor, and so each vertex on c was assigned a finite shortest-path estimate when it was assigned its non-NIL \u03a9 value.',page:636,
      body:['若检查轮发现可松弛的边，沿 π 指针回溯会得到一个环；该环上每个结点都有有限 $d$ → 都从 s 可达。',
        '由上界性质与环不等式相加，推出这个环是负环 —— 这就是 Bellman-Ford 返回 FALSE 的语义。',
        '★ C 程序 part 2 的负环检出正是这条推论的实测。∎']},
    ],conclusion:'★ 结论：四性质是全部最短路算法的公共地基 —— 22 章闭环。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'上界性质断言什么？',options:['v.d 只增不减：上界性质讲的就是它一路单调往上走','$v.d \\ge \\delta(s,v)$ 恒成立','v.d 最终为 0','π 永不变'],answer:1,
      why:'★ 初始化正确 + RELAX 保持三角不等式。'},
     {kind:'single',q:'路径松弛引理的条件是？',options:['按任意顺序松弛路径上的边','**按路径顺序松弛路径上的边**','松弛全部边 V−1 次','只松弛叶结点'],answer:1,
      why:'★ 顺序是关键：前驱的 d 正确后松弛才有用。'},
     {kind:'judge',q:'前驱子图 G_π 在无负环时是棵最短路径树。',answer:true,
      why:'★ 性质 22.19 —— π 指针的树性由 RELAX 的更新规则保持。'},
     {kind:'single',q:'松弛后 $v.d \le u.d + w$ 恒成立，这条性质叫？',options:['上界性质','收敛性质','**松弛立即生效**','路径松弛性质'],answer:2,
      why:'引理 22.13（松弛立即生效）—— 上界性质的伴生不变量。'},
     {kind:'judge',q:'上界性质（v.d ≥ δ(s,v)）在松弛过程的任意时刻都成立。',answer:true,why:'★ 初始化正确 + RELAX 保持三角不等式（引理 22.12 / 22.13）。'},
     {kind:'single',q:'收敛性质（22.15）：一旦 d[u] = δ(s,u)，松弛边 (u,v) 后会立即得到？',options:['d[v] = ∞：松弛会把尚未确定的邻居重新置回','**d[v] = δ(s,v)**','d[v] 不变','d[u] = 0'],answer:1,why:'★ 收敛性质：正确值一锤定音（d[v] ≤ d[u] + w 与上界性质夹出等号）。'},
    ],bookExercises:[
     {id:'22.5-1',page:638,star:0,statement:'Give two shortest-paths trees for the directed graph of Figure 22.2 on page 609 other than the two shown.',hint:'同一组 d 值往往对应多组 $\\pi$ 选法。在图上找两条等权但走法不同的最短路，各自决定一组前驱，就能拼出两棵新的最短路径树（结点的父边可以整体换一支）。'},
     {id:'22.5-2',page:638,star:0,statement:'Give an example of a weighted, directed graph G = (V,E) with weight function w W E ! R and source vertex s such that G satisfies the following property: For every edge (u,v) 2 E, there is a shortest-paths tree rooted at s that contains (u,v) and another shortest-paths tree rooted at s that does not contain (u,v) .',hint:'题干要的是「每条边都在**某棵**最短路径树里，又不在**所有**里」，所以图必须让某些顶点有**两条等长的最后一步**。判据先用起来：边 $(u,v)$ 属于某棵 SPT $\\iff$ $d(s,u) + w(u,v) = d(s,v)$（紧边）；若 $v$ 有两个不同的紧前驱 $u_1, u_2$，那么选 $u_1$ 的那棵树就不含 $(u_2, v)$。最小例子骨架：$s \\to a \\to t$ 与 $s \\to b \\to t$ 两条等长链（再给 $b \\to a$ 之类造第二条紧边），逐条边验一遍「有一棵树含它」+「有一棵树不含它」。★ 记得说清那两棵树怎么来的：松弛顺序不同 ⟹ 前驱子图不同，这正是本节「前驱子图是**某棵**树」的意思。'},
     {id:'22.5-3',page:639,star:0,statement:'Modify the proof of Lemma 22.10 to handle cases in which shortest-path weights are 1 or −1.',hint:'引理 22.10 是三角不等式 $\\delta(s,v) \\le \\delta(s,u) + w(u,v)$。原来「取 p 为 s 到 v 的最短路径」在 $\\delta = \\infty$ 或 $-\\infty$ 时说不通：分情况改写 —— 路径集合为空时不等式按约定自动成立，负环可达时两边都取 $-\\infty$。'},
     {id:'22.5-4',page:639,star:0,statement:'Let G = (V,E) be a weighted, directed graph with source vertex s , and let G be initialized by INITIALIZE-SINGLE-SOURCE (G,s) . Prove that if a sequence of relaxation steps sets s:Ω to a non-NIL value, then G contains a negative-weight cycle.',hint:'s 的 d 初值是 0，只会因松弛而变小；它被赋上 $\\pi$ 说明有一条指向 s 的边被成功松弛。沿 $\\pi$ 从 s 往回走，结点有限却永不到头，于是必然回到 s —— 把这一圈上的不等式相加，左端全消，剩下环的总权为负。'},
     {id:'22.5-5',page:639,star:0,statement:'Let G = (V,E) be a weighted, directed graph with no negative-weight edges. Let s 2 V be the source vertex, and suppose that v:Ω is allowed to be the predecessor of v on any shortest path to v from source s if v 2 V − fs g is reachable from s , and NIL otherwise. Give an example of such a graph G and an assignment of Ω values that produces a cycle in G − . (By Lemma 22.16, such an assignment cannot be produced by a sequence of relaxation steps.)',hint:'只有零权边能办到：让 u 落在 v 的某条最短路上、v 也落在 u 的某条最短路上（两点之间来回各一条 0 权边最省），此时各自任选前驱就拼出一个环 —— 而它不可能来自松弛序列（引理 22.16）。'},
    ]},
  ],
};
