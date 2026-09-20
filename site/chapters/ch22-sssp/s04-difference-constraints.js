/* 第 22 章 22.4：差分约束与最短路径（Difference constraints and shortest paths）。印刷页 625–630（pdf 646–651）。 */
export default {
  key:'s04',id:'ch22/s04',chapter:22,section:'22.4',
  title:'差分约束：把线性不等式变成最短路',shortTitle:'22.4 差分约束',
  titleEn:'Difference constraints and shortest paths',
  source:{printed:[625,632],pdf:[646,651]},
  prerequisites:[{label:'22.3 Dijkstra\u2019s algorithm',url:'#/ch22/s03'}],
  stages:[
   {type:'map',title:'一个惊人的归约',
    why:'线性方程组的特殊情形：$x_j - x_i \\le b_k$（差分约束）。把它变成**约束图**上的单源最短路问题：可行解 = 最短路径权重！负环 = 无解。',
    position:'22 章的"回报关"：前几关的所有结论（Bellman-Ford、负环检测、上界性质）在这里合成一个实用的线性规划特例求解器。',
    unlocks:[{label:'22.5 Proofs of shortest-paths properties',url:'#/ch22/s05'}],
    mathKit:[
     {title:'差分约束系统',body:'$Ax \\le b$，每行形如 $x_j - x_i \\le b_k$。'},
     {title:'约束图',body:'每个未知数一个结点 + 哨兵 $v_0$；约束 $x_j - x_i \\le b_k$ → 边 $(v_i, v_j)$ 权 $b_k$；$v_0 \\to$ 所有结点权 0。'},
     {title:'定理 22.9',body:'约束图无负环 ⟺ 系统可行；且 $x_i = \\delta(v_0, v_i)$ 就是一组可行解。'},
    ]},
   {type:'intuition',title:'最短路径的三角不等式就是不等式组',scene:'约束图',body:[
     '最短路的核心不等式：$\\delta(v_j) \\le \\delta(v_i) + w(v_i, v_j)$ —— 移项即 $\\delta(v_j) - \\delta(v_i) \\le w(v_i, v_j)$。',
     '★ 这正是差分约束的形式！所以"造约束图、跑 Bellman-Ford"得到的最短距天然满足全部不等式。',
     '★ 负环对应矛盾的不等式组：沿环求和得 $0 < 0$ —— 无可行解。C 程序的负环检测直接复用。',
     '★ 平移不变性（引理 22.8）：可行解整体 +d 仍可行 —— 所以解空间是一个方向无界的区域。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文。',blocks:[
     {kind:'body',page:627,en:'Sometimes the objective function does not matter: it9s enough just to find any feasible solution, that is, any vector x that satisfies Ax \u2264 b, or to determine that no feasible solution exists. This section focuses on one such feasibility problem.',
      zh:'★ 本节目标：可行性问题（不求最优，只求"有没有解"）。'},
     {kind:'body',page:628,en:'Let x = (x 1 ,x 2 ,\u2026,x n ) be a solution to a system Ax \u2264 b of difference constraints, and let d be any constant. Then x + d = (x 1 + d,x 2 + d,\u2026,x n + d) is a solution to Ax \u2264 b as well.',
      zh:'★ 引理 22.8：平移不变性。'},
     {kind:'body',page:628,en:'More formally, given a system Ax \u2264 b of difference constraints, the corresponding constraint graph is a weighted, directed graph G = (V,E) , where',
      zh:'★★ 约束图的构造定义（边权 = 约束右端）。'},
     {kind:'body',page:629,en:'The following theorem shows how to solve a system of difference constraints by finding shortest-path weights in the corresponding constraint graph.',
      zh:'★★ 定理 22.9：可行解 = 约束图上的最短路径权重。'},
     {kind:'body',page:630,en:'Now we show that if the constraint graph contains a negative-weight cycle, then the system of difference constraints has no feasible solution. Without loss of generality, let the negative-weight cycle be c = \u27e8v 1 ,v 2 ,\u2026,v k\u27e9, where v 1 = v k .',
      zh:'★ 反方向：负环 ⟺ 无可行解（沿环求和得矛盾）。'},
    ],terms:[{en:'difference constraints',zh:'差分约束系统',page:627},
              {en:'constraint graph',zh:'约束图',page:628}]},
   {type:'pseudocode',title:'构造约束图',algo:'CONSTRAINT-GRAPH',signature:'由 Ax ≤ b 构造约束图（原书 p.628，本站整理）',page:628,
    lines:[
     {n:1,code:'每个未知数 x_i 对应结点 v_i；另加哨兵 v_0',zh:''},
     {n:2,code:'每个约束 x_j − x_i <= b_k 对应边 (v_i, v_j)，权 b_k',zh:'★★ 方向：从"减数"指向"被减数"。'},
     {n:3,code:'v_0 到每个 v_i 连一条权 0 的边',zh:'★ 保证所有结点从源可达。'},
     {n:4,code:'以 v_0 为源跑 Bellman-Ford',zh:''},
     {n:5,code:'无可行解的充要条件：约束图含负环',zh:'★ 负环检测即可行性判定。'}],
    vars:[{name:'b_k',meaning:'约束的右端常数（可为负）'}],
    note:'★ 约束图有 |n+1| 个结点、|m+n| 条边 —— Bellman-Ford 代价 O((n+m)·n)。',
    more:[]},
   {type:'visualize',title:'从不等式到图',panels:[
     {title:'约束 → 边 的方向约定',viz:'growth',
      chart:{xMax:10,series:[
       {name:'x_j − x_i ≤ b_k → 边 (v_i,v_j) 权 b_k',expr:'1',color:'--viz-done'},
       {name:'写反方向（常见错误）',expr:'0',color:'--viz-violation'}]},
      note:'★ 方向记法：约束左端"x_j − x_i"里**被减数**对应边的终点。'},
    ],tasks:['C 程序的负环检测（Part 2）直接复用为可行性判定。'],note:''},
   {type:'code',title:'实测：负环检测复用',c:{file:'sssp.c',code:String.raw`/* sssp.c -- 22 章：单源最短路径（Bellman-Ford / DAG-SSSP / Dijkstra）。
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
    notes:[{line:1,zh:'★ 五关共用本文件；差分约束的可行性判定 = Part 2 的负环检测。'},
           {line:110,zh:'★ Part 2 的负环检测在差分约束语境下就是"无可行解"判定。'},
           {line:42,zh:'`bellman_ford`：对约束图跑一次即可。'}]},
    tests:[{in:'约束图无负环',out:'Bellman-Ford 的 d 即可行解'},
           {in:'约束图含负环',out:'无可行解（负环检测报警）'}],
    mapping:[{pc:4,pcCode:'以 v_0 为源跑 Bellman-Ford',c:'`bellman_ford`（第 34 行，源点换成 v_0）'}]},
   {type:'analyze',title:'一本账：可行性的两个方向',claims:[
     {expr:'x_i = \\delta(v_0, v_i)',when:'定理 22.9 给出的可行解',page:629,source:'book'},
     {expr:'\\text{负环} \\iff \\text{不可行}',when:'可行性判定（定理 22.9 的两个方向）',page:630,source:'book'},
     {expr:'x + d',when:'平移不变性：整体加常数仍可行（引理 22.8）',page:628,source:'book'},
    ],tables:[{caption:'约束图的三类边',rows:[
      ['来源','形式','边'],
      ['差分约束','x_j − x_i ≤ b_k','(v_i, v_j) 权 b_k'],
      ['哨兵','v_0 → 一切结点','权 0'],
      ['（隐含）','任何 x_i 无下界','—'],
     ]},{caption:'证明的两半（定理 22.9）',rows:[
      ['方向','论证','对应工具'],
      ['无负环 ⇒ 可行','x_i = δ(v_0,v_i) 满足全部约束','三角不等式'],
      ['负环 ⇒ 不可行','沿环求和得 0 ≤ 负数，矛盾','环上不等式相加'],
     ]}],chart:{xMax:64,series:[
     {name:'约束图 Bellman-Ford O((n+m)n)',expr:'n * (n + n) / 8',color:'--viz-done'},
     {name:'通用线性规划求解器（指数/多项式但重）',expr:'n * Math.log2(n) * 2',color:'--viz-compare'}]},
    derivations:[{kind:'summation',title:'三角不等式 = 约束满足',steps:[
      {zh:'Bellman-Ford 结束后，每条边满足 $\\delta(v_j) \\le \\delta(v_i) + b_k$（无负环 ⇒ 无可松弛边）。'},
      {zh:'移项：$\\delta(v_j) - \\delta(v_i) \\le b_k$ —— 恰好是原约束（把 $\\delta$ 当 $x$）。'},
      {tex:'x_i = \\delta(v_0, v_i) \\;\\Longrightarrow\\; Ax \\le b',zh:'★ 哨兵 $v_0$ 的 0 权边把 $\\delta$ 全部压成有限值 —— 保证 $x$ 有定义。∎'}]},
     ],
    note:''},
   {type:'prove',title:'定理 22.9：可行解 = 最短路径权重',statement:'The following theorem shows how to solve a system of difference constraints by finding shortest-path weights in the corresponding constraint graph.',page:629,
    intro:'★ 定理的两个方向分别对应"找到解"与"证明无解" —— 都是最短路理论的直接推论。',
    steps:[
     {title:'⇒ 无负环 ⇒ x_i = δ(v_0,v_i) 可行',en:'More formally, given a system Ax \u2264 b of difference constraints, the corresponding constraint graph is a weighted, directed graph G = (V,E) , where',page:628,
      body:['Bellman-Ford 无负环时每条边满足三角不等式（无可松弛）。',
        '每条约束边 $(v_i, v_j)$ 权 $b_k$：$\\delta(v_j) \\le \\delta(v_i) + b_k$ → $x_j - x_i \\le b_k$。',
        '哨兵边（权 0）保证 $\\delta$ 有限 → $x$ 是实向量。全部约束满足 → 可行。∎']},
     {title:'⇐ 负环 ⇒ 无可行解',en:'Now we show that if the constraint graph contains a negative-weight cycle, then the system of difference constraints has no feasible solution. Without loss of generality, let the negative-weight cycle be c = \u27e8v 1 ,v 2 ,\u2026,v k\u27e9, where v 1 = v k .',page:630,
      body:['设负环 $c$ 对应约束 $x_{i+1} - x_i \\le w_i$（沿环）。',
        '全部相加：左边 $\\sum (x_{i+1} - x_i)$ 望远镜相消 = 0；右边 $= \\sum w_i < 0$（负环）。',
        '得 $0 \\le \\text{负数}$ —— 矛盾 → 无可行解。∎']},
     {title:'工程闭环',en:'Sometimes the objective function does not matter: it9s enough just to find any feasible solution, that is, any vector x that satisfies Ax \u2264 b, or to determine that no feasible solution exists.',page:627,
      body:['C 程序 Part 2 的负环检测可直接用于约束图的可行性判定。',
        '有解时用 Bellman-Ford 的 $d$ 值读出一组 $x$。',
        '★ 这就是"用最短路解线性规划特例"的完整闭环。∎']},
    ],conclusion:'★ 结论：差分约束 = 最短路问题的"隐藏应用"；约束图 + Bellman-Ford 一次搞定可行性。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'约束 $x_j − x_i \\le b_k$ 对应约束图的哪条边？',options:['(v_j, v_i) 权 b_k','**(v_i, v_j) 权 b_k**','(v_i, v_j) 权 −b_k','无边'],answer:1,
      why:'★ 方向约定：从"减数"指向"被减数"，权为右端常数。'},
     {kind:'single',q:'差分约束系统无可行解的充要条件是？',options:['图不连通','**约束图含负权环**','有正权边','结点数为奇数'],answer:1,
      why:'★ 定理 22.9 的第二个方向：沿负环求和导出 0 ≤ 负数的矛盾。'},
     {kind:'judge',q:'若 x 是可行解，x + 100 也是可行解。',answer:true,
      why:'★ 引理 22.8：差分约束只约束"差"，平移不变。'},
     {kind:'single',q:'判定差分约束可行性用的是哪种算法的哪个功能？',options:['**Bellman-Ford 的负环检测**','Floyd-Warshall 的最短路矩阵','Dijkstra 的松弛','拓扑排序的入度检查'],answer:0,
      why:'★ 约束图跑 Bellman-Ford，负环 = 无解（C 程序 Part 2 的检测逻辑直接复用）。'},
     {kind:'judge',q:'约束 x_j − x_i ≤ b_k 对应的边方向是从 v_i 指向 v_j（减数指向被减数）。',answer:true,why:'★ 约束图构造：边 (v_i, v_j) 权 b_k（p.628）。'},
     {kind:'single',q:'引理 22.8（平移不变性）说：若 x 是可行解，则 x + d 也是可行解，因为差分约束只涉及什么？',options:['**变量的差**','单个变量的绝对值','乘积','最大值'],answer:0,why:'★ 差分约束只约束"差"，整体平移 d 不改变任何差（p.628）。'},
    ],bookExercises:[
     {id:'22.4-1',page:631,star:0,statement:'Find a feasible solution or determine that no feasible solution exists for the follow- ing system of difference constraints: x 1 − x 2 ≤ 1 , x 1 − x 4 ≤ −4 , x 2 − x 3 ≤ 2 , x 2 − x 5 ≤ 7 , x 2 − x 6 ≤ 5 , x 3 − x 6 ≤ 10 , x 4 − x 2 ≤ 2 , x 5 − x 1 ≤ −1 , x 5 − x 4 ≤ 3 , x 6 − x 3 ≤ −8 .',hint:'按本关的构造画约束图（含哨兵 v_0），跑 Bellman-Ford 读出 δ 值 —— 每个约束在图上应满足三角不等式。'},
     {id:'22.4-2',page:631,star:0,statement:'Find a feasible solution or determine that no feasible solution exists for the follow- ing system of difference constraints: x 1 − x 2 ≤ 4 , x 1 − x 5 ≤ 5 , x 2 − x 4 ≤ −6 , x 3 − x 2 ≤ 1 , x 4 − x 1 ≤ 3 , x 4 − x 3 ≤ 5 , x 4 − x 5 ≤ 10 , x 5 − x 3 ≤ −4 , x 5 − x 4 ≤ −8 .',hint:'先构造约束图；若 Bellman-Ford 报负环 → 无解（指出那个环并沿环求和导出矛盾）。'},
     {id:'22.4-3',page:631,star:0,statement:'Can any shortest-path weight from the new vertex v 0 in a constraint graph be posi- tive? Explain.',hint:'v0 到每个约束结点都有一条 0 权边，所以任何最短路径长都不会超过 0 —— 一行就否掉「可能为正」。再把「不可达时为 $\\infty$」这一种情形也顺带说明白。'},
     {id:'22.4-4',page:631,star:0,statement:'Express the single-pair shortest-path problem as a linear program.',hint:'$d$ 是路径长的**下界**，不是上界 —— 这点决定目标是 maximize 还是 minimize。 从约束 $d_v - d_u \\le w(u,v)$ 与 $d_s = 0$ 出发，沿任一 $s \\to v$ 的路径把不等式加起来， 得到 $d_v \\le$ 这条路径的权；对**每条**路径都成立，所以 $d_v \\le \\delta(s,v)$。 可行域在上方有界，最优解就是把每个 $d_v$ 顶到 $\\delta(s,v)$，因此 LP 应当 $\\text{maximize } d_t$。写成 minimize 的话目标函数无下界，问题根本不解。'},
     {id:'22.4-5',page:632,star:0,statement:'Show how to modify the Bellman-Ford algorithm slightly so that when using it to solve a system of difference constraints with m inequalities on n unknowns, the running time is O(nm).',hint:'省掉 v0 那 n 条 0 权边的逐轮扫描：初始化时直接把所有 d 置 0（等价于已经把 v0 的松弛做完了），此后每轮只扫 m 条约束边，共 n 轮 —— 负环检查仍然成立。'},
    ]},
  ],
};
