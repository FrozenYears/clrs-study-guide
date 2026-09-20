/* 第 24 章 24.1：流网络（Flow networks）。印刷页 671–676（pdf 692–697）。 */
export default {
  key:'s01',id:'ch24/s01',chapter:24,section:'24.1',
  title:'流网络：容量、流与守恒',shortTitle:'24.1 流网络',
  titleEn:'Flow networks',
  source:{printed:[671,676],pdf:[692,697]},
  prerequisites:[{label:'23.3 Johnson\u2019s algorithm for sparse graphs',url:'#/ch23/s03'}],
  stages:[
   {type:'map',title:'把"运输"变成数学',
    why:'流网络 $G=(V,E)$ 有源 $s$、汇 $t$、容量 $c(u,v)$。**流** $f$ 要满足容量约束（不过载）与流守恒（中间点进出相等），目标是最大化流量 $|f|$。',
    position:'第 VI 部分收尾章。它把图的建模能力推到极致：卡车调度、管道输送、任务分配、二分图匹配都归约为最大流。',
    unlocks:[{label:'24.2 The Ford-Fulkerson method',url:'#/ch24/s02'}],
    mathKit:[
     {title:'容量约束',body:'$0 \\le f(u,v) \\le c(u,v)$ —— 非负且不超容量。'},
     {title:'流守恒',body:'对 $u \\notin \\{s,t\\}$：$\\sum_v f(v,u) = \\sum_v f(u,v)$，即"流入 = 流出"。'},
     {title:'流的价值',body:'$|f| = \\sum_v f(s,v) - \\sum_v f(v,s)$（源点的净流出）。'},
    ]},
   {type:'intuition',title:'"流进等于流出"为什么重要',scene:'Figure 24.1 的卡车调度网络',body:[
     '网络：$s \\to v_1(16)$、$s \\to v_2(13)$、$v_1 \\to v_3(12)$、$v_2 \\to v_1(4)$、$v_2 \\to v_4(14)$、$v_3 \\to v_2(9)$、$v_3 \\to t(20)$、$v_4 \\to v_3(7)$、$v_4 \\to t(4)$。',
     '★ 流守恒说的是"中间站不囤货"：进入 $v_1$ 的卡车必从 $v_1$ 出去。没有这条约束，最大化就退化成"把每条边灌满"的平凡问题。',
     '★ 对称性约定：若 $(u,v) \\in E$ 则 $(v,u) \\notin E$，于是每条有向边只有一个方向的容量 —— 反方向的"抵消"用负流表示（$f(v,u) = -f(u,v)$）。',
     '★ C 程序实测：该网络的最大流 $|f| = 23$（原书 p.673 答案），只用了 3 条增广路。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 2 代表 ∈）。',blocks:[
     {kind:'body',page:671,en:'This section gives a graph-theoretic definition of flow networks, discusses their properties, and defines the maximum-flow problem precisely. It also introduces some helpful notation.',
      zh:'★ 本节路线图：定义 → 性质 → 最大流问题。'},
     {kind:'body',page:672,en:'The flow from one vertex to another must be nonnegative and must not exceed the given capacity.',
      zh:'★★ 容量约束的语意（$0 \\le f \\le c$）。'},
     {kind:'body',page:672,en:'The total flow into a vertex other than the source or sink must equal the total flow out of that vertex—informally, "flow in equals flow out."',
      zh:'★★ 流守恒：中间点"流入 = 流出"。'},
     {kind:'body',page:672,en:'Capacity constraint: For all u,v 2 V , we require',
      zh:'★ 容量约束的正式表述（公式随后）。'},
    ],terms:[{en:'flow network',zh:'流网络',page:671},
              {en:'flow conservation',zh:'流守恒',page:672}]},
   {type:'pseudocode',title:'最大流的定义清单',algo:'MAX-FLOW-DEF',signature:'流、容量与价值的定义（原书 p.671–672，本站整理）',page:671,
    lines:[
     {n:1,code:'容量: c(u,v) >= 0；若 (u,v) ∉ E 则 c(u,v) = 0',zh:''},
     {n:2,code:'对称性: (u,v) ∈ E 蕴含 (v,u) ∉ E',zh:'★ 反方向的流用负值表示（斜对称 f(v,u) = −f(u,v)）。'},
     {n:3,code:'容量约束: 0 <= f(u,v) <= c(u,v)',zh:''},
     {n:4,code:'流守恒: 对 u ≠ s,t，Σ f(v,u) = Σ f(u,v)',zh:'★★ 中间点不囤积。'},
     {n:5,code:'流的价值: |f| = Σ f(s,v) − Σ f(v,s)',zh:'★ 源点的净输出。'},
     {n:6,code:'最大流问题: 求 |f| 最大的流 f',zh:''}],
    vars:[{name:'f',meaning:'流（定义在 V×V 上的实函数）'},{name:'c',meaning:'容量'}],
    note:'★ 注意：$f$ 定义在整个 $V \\times V$ 上（无边的位置取 0），这让"流入/流出"的求和可以统一遍历 $V$。',
    more:[]},
   {type:'visualize',title:'网络与它的最大流',panels:[
     {title:'C 程序 Part 1：三条增广路达成 23',viz:'growth',
      chart:{xMax:6,series:[
       {name:'最大流 23 = 割容量 23',expr:'23',color:'--viz-done'},
       {name:'上界 Σc(s,·) = 16+13 = 29',expr:'29',color:'--viz-compare'}]},
      note:'★ 源点总容量 29 只是上界 —— 真正的瓶颈在中游：[v1→v3] 12 + [v4→v3] 7 + [v4→t] 4 = 23。'},
    ],tasks:['对照 C 程序 part 1 的三条增广路与 part 2 的最小割。'],note:''},
   {type:'code',title:'实测：|f| = 23',c:{file:'max_flow.c',code:String.raw`/* max_flow.c -- 24 章：最大流（Ford-Fulkerson / Edmonds-Karp）+ 二分图匹配。
 * 网络 = 原书 Figure 24.1 的 6 顶点图：
 *   s->v1 16, s->v2 13, v1->v3 12, v2->v1 4, v2->v4 14, v3->v2 9,
 *   v3->t 20, v4->v3 7, v4->t 4
 * 关键数字：最大流 |f| = 23（原书 p.673 的答案）；最小割容量同为 23。
 * 二分图：图 24.8 的 L={u1..u4}、R={v1..v3}，最大匹配 = 3。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define NV 6                          /* s=0, v1=1, v2=2, v3=3, v4=4, t=5 */
#define NAME (const char *[]){"s", "v1", "v2", "v3", "v4", "t"}
#define BIG 100000

static int cap[NV][NV];               /* 容量（0 表示无边） */
static int flow[NV][NV];              /* 流 */
static int parent[NV];
static long aug_count, bfs_count;

/* 残量（含反向边） */
static int residual(int u, int v) { return cap[u][v] - flow[u][v]; }

/* BFS 找增广路径（Edmonds-Karp：每次沿最短增广路） */
static int bfs_path(int s, int t)
{
    int visited[NV];
    int queue[NV], head = 0, tail = 0;
    memset(visited, 0, sizeof(visited));
    bfs_count++;
    visited[s] = 1; parent[s] = -1;
    queue[tail++] = s;
    while (head < tail) {
        int u = queue[head++];
        for (int v = 0; v < NV; v++) {
            if (!visited[v] && residual(u, v) > 0) {
                visited[v] = 1; parent[v] = u;
                if (v == t) { return 1; }
                queue[tail++] = v;
            }
        }
    }
    return 0;
}

static void print_path(int t)
{
    int path[NV], n = 0, v = t;
    while (v != -1) { path[n++] = v; v = parent[v]; }
    printf("        ");
    for (int i = n - 1; i >= 0; i--) { printf("%s%s", NAME[path[i]], i ? " -> " : "\n"); }
}

static int edmonds_karp(int s, int t)
{
    while (bfs_path(s, t)) {
        int aug = BIG;
        for (int v = t; v != s; v = parent[v]) {
            int u = parent[v];
            if (residual(u, v) < aug) { aug = residual(u, v); }
        }
        for (int v = t; v != s; v = parent[v]) {
            int u = parent[v];
            flow[u][v] += aug;
            flow[v][u] -= aug;         /* 反向边记账（斜对称） */
        }
        aug_count++;
        printf("  第 %ld 条增广路（瓶颈 %d）：\n", aug_count, aug);
        print_path(t);
    }
    int value = 0;
    for (int v = 0; v < NV; v++) { value += flow[s][v]; }
    return value;
}

static void build_figure_24_1(void)
{
    memset(cap, 0, sizeof(cap));
    memset(flow, 0, sizeof(flow));
    cap[0][1] = 16; cap[0][2] = 13;
    cap[1][3] = 12; cap[2][1] = 4; cap[2][4] = 14;
    cap[3][2] = 9;  cap[3][5] = 20; cap[4][3] = 7; cap[4][5] = 4;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* part 1：Edmonds-Karp 求最大流 */
    build_figure_24_1();
    printf("part 1: 在 Figure 24.1 的网络（6 顶点 9 边）上跑 Edmonds-Karp：\n");
    int value = edmonds_karp(0, 5);
    printf("        最大流 |f| = %d（原书答案 23）；增广 %ld 次，BFS %ld 次\n",
           value, aug_count, bfs_count);
    assert(value == 23);

    /* part 2：最小割 —— 残量网络中从 s 可达的点集定义 S，割容量 = 最大流 */
    {
        int visited[NV], queue[NV], head = 0, tail = 0;
        memset(visited, 0, sizeof(visited));
        visited[0] = 1; queue[tail++] = 0;
        while (head < tail) {
            int u = queue[head++];
            for (int v = 0; v < NV; v++) {
                if (!visited[v] && residual(u, v) > 0) { visited[v] = 1; queue[tail++] = v; }
            }
        }
        printf("part 2: 残量网络可达集 S = {");
        for (int v = 0; v < NV; v++) { if (visited[v]) { printf("%s ", NAME[v]); } }
        printf("}\n");
        int cut = 0;
        printf("        割 (S, V−S) 的边：");
        for (int u = 0; u < NV; u++) {
            for (int v = 0; v < NV; v++) {
                if (visited[u] && !visited[v] && cap[u][v] > 0) {
                    printf("%s->%s(%d) ", NAME[u], NAME[v], cap[u][v]);
                    cut += cap[u][v];
                }
            }
        }
        printf("\n        割容量 = %d = 最大流值 —— 最大流最小割定理成立 ✓\n", cut);
        assert(cut == value);
    }

    /* part 3：二分图最大匹配（Figure 24.8 的图，用流网络求解） */
    {
        /* 网络：s=0, u1..u4=1..4, v1..v3=5..7, t=8 */
        #define MV 9
        int mc[MV][MV], mf[MV][MV];
        memset(mc, 0, sizeof(mc));
        memset(mf, 0, sizeof(mf));
        for (int u = 1; u <= 4; u++) { mc[0][u] = 1; }          /* s -> L */
        for (int v = 5; v <= 7; v++) { mc[v][8] = 1; }          /* R -> t */
        /* 边集：u1-v1, u1-v2, u2-v1, u3-v3, u4-v2, u4-v3 */
        mc[1][5] = 1; mc[1][6] = 1; mc[2][5] = 1; mc[3][7] = 1; mc[4][6] = 1; mc[4][7] = 1;
        /* Edmonds-Karp on this network（就地用局部数组） */
        int p[MV];
        int aug = 0;
        while (1) {
            int vis[MV], q[MV], h = 0, tl = 0;
            memset(vis, 0, sizeof(vis));
            vis[0] = 1; p[0] = -1; q[tl++] = 0;
            while (h < tl) {
                int u = q[h++];
                for (int v = 0; v < MV; v++) {
                    if (!vis[v] && mc[u][v] - mf[u][v] > 0) { vis[v] = 1; p[v] = u; q[tl++] = v; }
                }
            }
            if (!vis[8]) { break; }
            for (int v = 8; v != 0; v = p[v]) { int u = p[v]; mf[u][v] += 1; mf[v][u] -= 1; }
            aug++;
        }
        printf("part 3: 二分图匹配网络（|L|=4, |R|=3, 6 条边）上的最大流 = %d\n", aug);
        printf("        匹配对：");
        for (int u = 1; u <= 4; u++) {
            for (int v = 5; v <= 7; v++) {
                if (mf[u][v] > 0) { printf("(u%d, v%d) ", u, v - 4); }
            }
        }
        printf("\n        每个左点至多匹配一次、右点亦然 —— 流的容量约束自动保证匹配合法性 ✓\n");
        assert(aug == 3);                 /* 右点只有 3 个 -> 最多 3 对 */
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 三关共用本文件；数据 = Figure 24.1 的 6 顶点网络。'},
           {line:21,zh:'★ `residual`：残量 = 容量 − 流（含反向边）。'},
           {line:45,zh:'★ 增广路径的打印（用于核对原书 Figure 24.2 的过程）。'},
           {line:70,zh:'★★ part 1：最大流 23（增广 3 次、BFS 4 次）。'},
           {line:82,zh:'★★ part 2：最小割 {s,v1,v2,v4} 的容量 = 23 = 最大流。'}]},
    tests:[{in:'Figure 24.1 的网络',out:'|f| = 23（原书答案）'},
           {in:'最小割',out:'割容量 23；S = {s,v1,v2,v4}'}],
    mapping:[{pc:3,pcCode:'0 <= f(u,v) <= c(u,v)',c:'`static int residual(int u, int v) { return cap[u][v] - flow[u][v]; }`（第 21 行）'}]},
   {type:'analyze',title:'一本账：两条约束的分工',claims:[
     {expr:'0 \\le f(u,v) \\le c(u,v)',when:'容量约束（对流的下界与上界）',page:672,source:'book'},
     {expr:'\\sum_v f(v,u) = \\sum_v f(u,v)',when:'流守恒（对 u ∉ {s,t}）',page:672,source:'book'},
     {expr:'|f| = 23',when:'Figure 24.1 网络的最大流（C 程序实测）',page:672,source:'book'},
    ],tables:[{caption:'Figure 24.1 网络的容量表',rows:[
      ['边','容量','说明'],
      ['s→v1 / s→v2','16 / 13','源的两条边（上界 29）'],
      ['v1→v3 / v2→v1','12 / 4','中游'],
      ['v2→v4 / v3→v2','14 / 9','中游'],
      ['v3→t / v4→t','20 / 4','汇的两条边'],
      ['v4→v3','7','中游'],
     ]},{caption:'建模能力一览（本章后续）',rows:[
      ['现实问题','流的解释'],
      ['卡车/管道运输','货物/液体'],
      ['二分图匹配','每条边单位容量'],
      ['边有流量上限且结点也有上限','拆点'],
     ]}],chart:{xMax:32,series:[
     {name:'源总容量 29（上界）',expr:'29',color:'--viz-compare'},
     {name:'实际最大流 23',expr:'23',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'为什么 $|f|$ 只数源点',steps:[
      {zh:'对 $u \\notin \\{s,t\\}$ 的守恒式求和，中间点的贡献两两相消（每个内部流既算进也算出）。'},
      {zh:'剩下的只有 $s$ 与 $t$ 的项；又因 $t$ 的守恒（把 $t$ 也纳入求和）$\\sum_v f(v,t) - \\sum_v f(t,v) = |f|$。'},
      {tex:'|f| = \\sum_v f(s,v) - \\sum_v f(v,s)',zh:'★ 源点的净流出就是整张网络的流量 —— C 程序末尾的 `value` 正是这么算的。'}]},
     ],
    note:''},
   {type:'prove',title:'流的构造：从"每条边灌满"到"守恒"',statement:'The total flow into a vertex other than the source or sink must equal the total flow out of that vertex—informally, "flow in equals flow out."',page:672,
    intro:'★ 本关先立规矩：什么样的 $f$ 才配叫"流"。',
    steps:[
     {title:'零流与平凡构造',en:'This section gives a graph-theoretic definition of flow networks, discusses their properties, and defines the maximum-flow problem precisely. It also introduces some helpful notation.',page:671,
      body:['$f \\equiv 0$ 必然是合法流（容量约束与守恒都成立）—— 保证解集非空。',
        '把某条 $s \\to t$ 路径上每条边都灌满，其余为 0，也是合法流（中间点进 = 出）。',
        '这说明"合法流"的集合对**逐边相加**封闭（守恒与容量约束都是线性的）—— 为下一关的增广法奠基。∎']},
     {title:'守恒的等价写法',en:'The flow from one vertex to another must be nonnegative and must not exceed the given capacity.',page:672,
      body:['$\\sum_v f(v,u) = \\sum_v f(u,v)$ 对所有 $u \\notin \\{s,t\\}$。',
        '若允许 $(v,u)$ 与 $(u,v)$ 同时存在，两条反向流可以互相抵消而不改变外部行为 —— 这就是"对称性约定"的来源。',
        '★ 约定 $(u,v) \\in E \\Rightarrow (v,u) \\notin E$ 后，"抵消"用负值 $f(v,u) = -f(u,v)$ 表示，记号统一。∎']},
    ],conclusion:'★ 结论：容量约束 + 流守恒 = 流的定义；目标是最大化 $|f|$。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'流守恒要求什么？',options:['每条边流的和等于容量','**中间点流入 = 流出**','源点流出为 0','所有边流相等'],answer:1,
      why:'★ 对 $u \\notin \\{s,t\\}$：Σf(v,u) = Σf(u,v)。'},
     {kind:'single',q:'$|f|$（流的价值）怎么算？',options:['所有边流之和','**源点净流出 Σf(s,v) − Σf(v,s)**','汇点入流的一半','容量之和'],answer:1,
      why:'★ 由守恒求和可知它也等于汇点净流入。'},
     {kind:'judge',q:'流的定义要求 $f(u,v) \\ge 0$ 且 $f(u,v) \\le c(u,v)$。',answer:true,
      why:'★ 容量约束的两半；负流只用于表示反向抵消。'},
     {kind:'simulate',q:'C 程序中 Figure 24.1 网络的最大流是多少？（填数字）',expect:[23],placeholder:'例如：29',
      why:'23（原书答案；C 程序 part 1 实测，最小割容量同为 23）。'},
     {kind:'single',q:'一个流网络必须指定哪些要素？',options:['只需顶点和边','**源 $s$、汇 $t$ 与容量函数 $c$**','只需容量函数','源、汇、容量与每条边的费用'],answer:1,why:'★ 本关 map 的定义：流网络是一张**有源 $s$、有汇 $t$、每条边带非负容量 $c(u,v)$** 的有向图 —— 费用不在定义里。'},
     {kind:'single',q:'C 程序里 Figure 24.1 网络的最小割容量是？',options:['**23**','29','17','46'],answer:0,why:'★ 本关 code 段的实测：割容量 23，$S = \\{s, v_1, v_2, v_4\\}$ —— 与最大流值相等，正是最小割定理。'},
     {kind:'simulate',q:'C 程序里最小割的 $S$ 侧共包含几个顶点（含源 $s$）？',expect:[4],placeholder:'例如：3',why:'★ 实测 $S = \\{s, v_1, v_2, v_4\\}$，恰好 4 个顶点。'},
    ],bookExercises:[
     {id:'24.1-1',page:675,star:0,statement:'Show that splitting an edge in a flow network yields an equivalent network. More formally, suppose that flow network G contains edge (u; v), and define a new flow network G 0 by creating a new vertex x and replacing (u; v) by new edges (u; x) and (x; v) with c(u; x) = c(x; v) = c(u; v). Show that a maximum flow in G 0 has the same value as a maximum flow in G.',hint:'两个方向各给一个映射：G 里的流搬到 G 撇时，让经过新顶点 x 的两条边取原来那条边的流量；反方向把 (u,x)、(x,v) 的流压回 (u,v)。守恒在 x 处自动成立（一进一出），容量由 $c(u,x)=c(x,v)=c(u,v)$ 卡住 —— 最后说明值的定义没变。'},
     {id:'24.1-2',page:675,star:0,statement:'Extend the flow properties and definitions to the multiple-source, multiple-sink problem. Show that any flow in a multiple-source, multiple-sink flow network corresponds to a flow of identical value in the single-source, single-sink network obtained by adding a supersource and a supersink, and vice versa.',hint:'超级源到各源点、各汇点到超级汇的边，容量只能给 $\\infty$（或一个不小于任何可行流的足够大数）。 **给 0 直接把问题堵死**：超源的出边容量为 0，则 $|f| \\equiv 0$， 「两值相等」的等价关系当场不成立，「超源出边流量 = 各源点产出」这句话也没了意义。 其余要点：多源多汇版只是把 $\\sum$ 产出与 $\\sum$ 消耗对起来，容量约束照旧。'},
     {id:'24.1-3',page:675,star:0,statement:'Suppose that a flow network G = (V; E) violates the assumption that the network contains a path s → v → t for all vertices v 2 V . Let u be a vertex for which there is no path s → u → t . Show that there must exist a maximum flow f in G such that f (u; v) = f (v; u) = 0 for all vertices v 2 V .',hint:'不存在 s 到 u 再到 t 的路径，意味着 u 要么从 s 不可达、要么到不了 t。取一个最大流，把「经过 u 的那部分流」沿守恒一路推走：它要么能连成一条 s 到 t 的路径（与假设矛盾），要么本来就是 0。更省事的说法是把 u 的出入边容量置 0 后重跑最大流，值不变，于是存在一个让 u 上流量全 0 的最大流。'},
    ]},
  ],
};
