/* 第 24 章 24.2：Ford-Fulkerson 方法（The Ford-Fulkerson method）。印刷页 676–704（pdf 697–725）。 */
export default {
  key:'s02',id:'ch24/s02',chapter:24,section:'24.2',
  title:'增广路与最小割定理',shortTitle:'24.2 Ford-Fulkerson',
  titleEn:'The Ford-Fulkerson method',
  source:{printed:[676,693],pdf:[697,714]},
  prerequisites:[{label:'24.1 Flow networks',url:'#/ch24/s01'}],
  stages:[
   {type:'map',title:'核心思想：残量 + 增广',
    why:'Ford-Fulkerson 方法：不断在**残量网络**里找 $s \\to t$ 的**增广路**，沿瓶颈值推流 —— 直到没有增广路，此时流最大。它被称为 **method**（方法）而非 algorithm，因为"怎么找增广路"留给了实现（BFS → Edmonds-Karp）。',
    position:'本章的心脏。三个定理：增广引理（24.2）、割的上界（推论 24.5）、**最大流最小割定理**（定理 24.6）—— 后者把"算法正确性"和"对偶最优"绑在一起。',
    unlocks:[{label:'24.3 Maximum bipartite matching',url:'#/ch24/s03'}],
    mathKit:[
     {title:'残量容量',body:'$c_f(u,v) = c(u,v) - f(u,v)$（正向）；若 $(v,u) \\in E$ 则为 $f(v,u)$（可"退流"）。'},
     {title:'增广',body:'沿路 $p$ 推 $c_f(p) = \\min_{(u,v) \\in p} c_f(u,v)$，得到 $|f|$ 增加同样多的新流。'},
     {title:'最大流最小割',body:'$|f| = c(S,T)$ 对某割成立 ⟺ $f$ 最大 ⟺ 残量网络无增广路。'},
    ]},
   {type:'intuition',title:'反悔机制：残量网络的反向边',scene:'Figure 24.1 的网络（C 程序）',body:[
     '残量网络同时记录"还能推多少"（正向 $c-f$）与"还能退多少"（反向 $f$）。**反向边就是反悔键** —— 早期推错的流可以后来撤销。',
     '★ C 程序实测：Edmonds-Karp 用 3 条增广路达成 23：先 s→v1→v3→t（瓶颈 12），再 s→v2→v4→t（瓶颈 4），最后 s→v2→v4→v3→t（瓶颈 7，中间用了反向边调整 v3 的流量）。',
     '★ 最小割：残量网络中从 $s$ 可达的集合 $S = \\{s, v_1, v_2, v_4\\}$，割容量 12 + 7 + 4 = **23** —— 与最大流值相等（定理 24.6 的实例）。',
     '★ Edmonds-Karp（每次 BFS 找最短增广路）保证多项式：至多 $O(VE)$ 次增广 → $O(VE^2)$。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 2 代表 ∈、f 0 代表 f′）。',blocks:[
     {kind:'body',page:677,en:'Given a flow network G = (V; E) and a flow f , the residual network of G induced by f is G f = (V; E f ), where',
      zh:'★★ 残量网络的定义：边集由残量 > 0 的对组成。'},
     {kind:'body',page:677,en:'In a flow network, (u; v) 2 E implies (v; u) \u2026 E, and so exactly one case in equation (24.2) applies to each ordered pair of vertices.',
      zh:'★ 对称性约定带来的好处：残量公式每对顶点只有一种情形。'},
     {kind:'body',page:684,en:'The value of any flow f in a flow network G is bounded from above by the capacity of any cut of G.',
      zh:'★★ 推论 24.5：任何流 ≤ 任何割 —— 上界。'},
     {kind:'body',page:685,en:'If f is a flow in a flow network G = (V,E) with source s and sink t , then the following conditions are equivalent:',
      zh:'★★ 定理 24.6 的开头（三条等价条件随后列出）。'},
     {kind:'body',page:689,en:'If the Edmonds-Karp algorithm is run on a flow network G = (V,E) with source s and sink t , then the total number of flow augmentations performed by the algorithm is O(VE) .',
      zh:'★★ Edmonds-Karp：增广次数 O(VE)。'},
     {kind:'body',page:691,en:'Because each iteration of FORD-FULKERSON takes O(E) time when it uses breadth-first search to find the augmenting path, the total running time of the Edmonds-Karp algorithm is O(VE 2 ).',
      zh:'★ 总时间 O(VE²)。'},
    ],terms:[{en:'residual network',zh:'残量网络 G_f',page:677},
              {en:'augmenting path',zh:'增广路径',page:678}]},
   {type:'pseudocode',title:'FORD-FULKERSON：9 行',algo:'FORD-FULKERSON',signature:'FORD-FULKERSON(G, s, t)',page:686,
    lines:[
     {n:1,code:'for each edge (u,v) ∈ G.E',zh:''},
     {n:2,code:'    (u,v).f = 0',zh:'★ 从零流开始。'},
     {n:3,code:'while there exists a path p from s to t in the residual network G_f',zh:'★★ 找增广路。'},
     {n:4,code:'    c_f(p) = min{c_f(u,v) : (u,v) is in p}',zh:'★ 瓶颈值。'},
     {n:5,code:'    for each edge (u,v) in p',zh:''},
     {n:6,code:'        if (u,v) ∈ G.E',zh:''},
     {n:7,code:'            (u,v).f = (u,v).f + c_f(p)',zh:'正向推流。'},
     {n:8,code:'        else (v,u).f = (v,u).f − c_f(p)',zh:'★★ 反向边：退流（反悔）。'},
     {n:9,code:'return f',zh:''}],
    vars:[{name:'c_f(p)',meaning:'增广路上的瓶颈残量'}],
    note:'★ 第 6–8 行是"反悔"的实现：若增广路走的是反向边，就把原方向的流**减掉**。',
    more:[{algo:'FORD-FULKERSON-METHOD',subtitle:'FORD-FULKERSON-METHOD(G, s, t) —— 4 行（p.676）的方法级描述',signature:'FORD-FULKERSON-METHOD(G, s, t)',page:676,
      lines:[{n:1,code:'initialize flow f to 0',zh:''},
        {n:2,code:'while there exists an augmenting path p in the residual network G_f',zh:''},
        {n:3,code:'    augment flow f along p',zh:''},
        {n:4,code:'return f',zh:''}],
      vars:[{name:'p',meaning:'增广路径'}],
      note:'★ 4 行只说了"做什么"，没规定"怎么找路" —— 这正是它叫 method 的原因。'}]},
   {type:'visualize',title:'三条增广路与最小割',panels:[
     {title:'C 程序 Part 1/2：23 = 23',viz:'growth',
      chart:{xMax:32,series:[
       {name:'最大流 |f| = 23',expr:'23',color:'--viz-done'},
       {name:'最小割容量 = 23',expr:'23',color:'--viz-compare'},
       {name:'源总容量上界 29',expr:'29',color:'--viz-violation'}]},
      note:'★ 割 {s,v1,v2,v4} 的边：v1→v3(12) + v4→v3(7) + v4→t(4) = 23。'},
    ],tasks:['对照 C 程序 part 1 的三条增广路与 part 2 的割边清单。'],note:''},
   {type:'code',title:'实测：增广 3 次、割 23',c:{file:'max_flow.c',code:String.raw`/* max_flow.c -- 24 章：最大流（Ford-Fulkerson / Edmonds-Karp）+ 二分图匹配。
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 1/2（增广与割）。'},
           {line:24,zh:'`bfs_path`：BFS 找最短增广路（Edmonds-Karp）。'},
           {line:53,zh:'`edmonds_karp`：沿瓶颈推流，反向边记账（斜对称）。'},
           {line:70,zh:'★★ part 1：3 条增广路（12/4/7）→ |f| = 23。'},
           {line:82,zh:'★★ part 2：残量可达集 {s,v1,v2,v4}；割容量 23 = |f|。'}]},
    tests:[{in:'增广路 1',out:'s → v1 → v3 → t，瓶颈 12'},
           {in:'增广路 2',out:'s → v2 → v4 → t，瓶颈 4'},
           {in:'增广路 3',out:'s → v2 → v4 → v3 → t，瓶颈 7（含反向调整）'},
           {in:'最小割',out:'v1→v3(12) + v4→v3(7) + v4→t(4) = 23'}],
    mapping:[{pc:4,pcCode:'c_f(p) = min{c_f(u,v) : (u,v) is in p}',c:'`int aug = BIG; ... if (residual(u, v) < aug) { aug = residual(u, v); }`（第 62–65 行）'},
             {pc:8,pcCode:'else (v,u).f = (v,u).f − c_f(p)',c:'`flow[v][u] -= aug;`（第 64 行）'}]},
   {type:'analyze',title:'一本账：定理 24.6 的三条等价',claims:[
     {expr:'f \\text{ 最大}',when:'条件 1：流取到最大值',page:685,source:'book'},
     {expr:'G_f \\text{ 无增广路}',when:'条件 2：残量网络里没有 s→t 路径',page:685,source:'book'},
     {expr:'|f| = c(S,T)',when:'条件 3：存在割使等号成立',page:685,source:'book'},
    ],tables:[{caption:'C 程序实测的三个数',rows:[
      ['量','值','意义'],
      ['|f|','23','最大流'],
      ['增广次数','3','Edmonds-Karp 的实际次数（界为 O(VE)=54）'],
      ['c(S,T)','23','最小割容量'],
     ]},{caption:'FORD-FULKERSON 与 Edmonds-Karp',rows:[
      ['','FF（任意找路）','Edmonds-Karp（BFS）'],
      ['增广次数','可能指数（整数容量下与 C 有关）','O(VE)'],
      ['每次代价','O(E)','O(E)'],
      ['总时间','与容量值相关','O(VE²)'],
     ]}],chart:{xMax:60,series:[
     {name:'Edmonds-Karp 上界 VE = 54 次增广',expr:'n * 9',color:'--viz-compare'},
     {name:'实测 3 次',expr:'3',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'推论 24.5 与定理 24.6 的骨架',steps:[
      {zh:'引理 24.4：任一割 $(S,T)$ 上的**净流** $f(S,T) = |f|$（把守恒式在 $S$ 上求和，内部项相消）。'},
      {zh:'容量约束给 $f(S,T) \\le c(S,T)$ → 推论 24.5：$|f| \\le c(S,T)$（任何流 ≤ 任何割）。'},
      {tex:'|f| \\le c(S,T) \\ \\Rightarrow\\ |f| = c(S,T) \\text{ 时必为最大流}',zh:'★ C 程序 part 2 实测 23 = 23 正是这个等号的实例。∎'}]},
     ],
    note:''},
   {type:'prove',title:'最大流最小割定理（24.6）',statement:'If f is a flow in a flow network G = (V,E) with source s and sink t , then the following conditions are equivalent:',page:685,
    intro:'★ 三条等价的证明走一个环：1 ⇒ 2 ⇒ 3 ⇒ 1。',
    steps:[
     {title:'1 ⇒ 2',en:'The value of any flow f in a flow network G is bounded from above by the capacity of any cut of G.',page:684,
      body:['若 $f$ 已最大且残量网络还有增广路 $p$，沿 $p$ 增广会得到 $|f| + c_f(p) > |f|$ 的流（引理 24.2）—— 与最大性矛盾。',
        '所以最大流的残量网络无增广路。∎']},
     {title:'2 ⇒ 3',en:'If f is a flow in a flow network G = (V,E) with source s and sink t , then the following conditions are equivalent:',page:685,
      body:['设 $G_f$ 无增广路，定义 $S = \\{v : s \\leadsto v \\text{ 在 } G_f \\text{ 中可达}\\}$，$T = V - S$。',
        '对任意 $u \\in S, v \\in T$：必有 $f(u,v) = c(u,v)$（否则残量正向边存在，v 也可达）；且 $f(v,u) = 0$（否则残量反向边存在，同理）。',
        '于是割的净流 = 割容量 → $|f| = c(S,T)$。★ C 程序 part 2 的 S 与割边清单正是这个构造。∎']},
     {title:'3 ⇒ 1',en:'The value of any flow f in a flow network G is bounded from above by the capacity of any cut of G.',page:684,
      body:['由推论 24.5，对**任何**流与任何割都有 $|f| \\le c(S,T)$。',
        '若某个 $f$ 满足 $|f| = c(S,T)$，它已触到上界 → 必为最大流。∎']},
    ],conclusion:'★ 结论：最大流 = 最小割（对偶），且两者都由"残量网络无增广路"刻画 —— 算法的停机条件就是最优性证明。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'残量网络中的反向边代表什么？',options:['额外容量','**可以退掉已推的流（反悔）**','边的方向','割','容量'],answer:1,
      why:'★ $c_f(v,u) = f(u,v)$ —— 把已推的流"还给"网络。'},
     {kind:'single',q:'最大流最小割定理的三条等价条件是哪三条？',options:['最大 / 无增广路 / 某割取等','最大 / 唯一 / 无环','整数 / 最大 / 割','最小 / 无环 / 连通'],answer:0,
      why:'★ 定理 24.6：$f$ 最大 ⟺ 残量网络无增广路 ⟺ $|f| = c(S,T)$。'},
     {kind:'judge',q:'Edmonds-Karp 的增广次数与容量数值有关。',answer:false,
      why:'★ BFS 选最短增广路后，次数被证明为 O(VE)，**与容量无关** —— 这正是它优于一般 FF 之处。'},
     {kind:'simulate',q:'C 程序里 Edmonds-Karp 实际增广了几次？（填数字）',expect:[3],placeholder:'例如：5',
      why:'3 次（瓶颈 12、4、7），|f| = 23。'},
    ],bookExercises:[
     {id:'24.2-1',page:692,star:0,statement:'Prove that the summations in equation (24.5) can be extended to sum over all vertices V...',hint:'补上零项：$f(u,v)=0$ 当 $(u,v) \\notin E$；以及 $f^\\prime$ 在各点上的守恒式 —— 逐项验证扩展后不改变值。'},
     {id:'24.2-2',page:692,star:0,statement:'Show how to convert the problem of finding a flow f that obeys these additional constraints into the problem of finding a maximum flow...',hint:'点容量 $l(v) \\le f_{in}(v) \\le c(v)$：把每个点拆成 $v_{in} \\to v_{out}$ 带该容量，原入边接 $v_{in}$、出边接 $v_{out}$ —— 结点容量变边容量。'},
     {id:'24.2-3',page:692,star:0,statement:'Let f be a flow in G with |f| ≥ 0 in which one of the edges (v,s) entering the source has f(v,s) = 1...',hint:'构造 $f^\\prime$：在 $s$ 处把这条"入流"沿某个 $s \\to \\cdots \\to v$ 的路径抵消（沿残量边推 1 单位），并用 BFS 找该路径 —— O(E)。'},
     {id:'24.2-4',page:692,star:0,statement:'Show that, if all capacities are integers, then an integer-valued maximum flow exists...',hint:'整数容量下每次增广 $\ge 1$（瓶颈为整数），从零流出发逐步加整数 → 结束时的流是整数；再用引理 24.9 的"整数流对应整数匹配"。'},
    ]},
  ],
};
