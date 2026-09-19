/* 第 24 章 24.3：最大二分匹配（Maximum bipartite matching）。印刷页 693–704（pdf 714–725）。 */
export default {
  key:'s03',id:'ch24/s03',chapter:24,section:'24.3',
  title:'最大二分匹配：把匹配变成流',shortTitle:'24.3 最大二分匹配',
  titleEn:'Maximum bipartite matching',
  source:{printed:[693,704],pdf:[714,725]},
  prerequisites:[{label:'24.2 The Ford-Fulkerson method',url:'#/ch24/s02'}],
  stages:[
   {type:'map',title:'归约的力量',
    why:'二分图 $G=(L \\cup R, E)$ 的最大匹配可以直接用最大流求解：加源 $s$ 连 $L$、汇 $t$ 连 $R$、所有边**单位容量** —— 匹配大小 = 最大流值。',
    position:'24 章的应用收尾，也是 25 章（匹配专章）的起点。它演示"归约"这一算法设计手法：把新问题变成已解决的问题。',
    unlocks:[{label:'25.1 Maximum bipartite matching',url:'#/ch25/s01'}],
    mathKit:[
     {title:'归约构造',body:'$G^{\\prime}$：$s \\to$ 每个 $u \\in L$（容量 1）；每条 $(u,v) \\in E$（容量 1）；每个 $v \\in R \\to t$（容量 1）。'},
     {title:'整数流',body:'整数容量下最大流**可取整数**（引理 24.9）→ 每条边的流非 0 即 1 → 天然对应匹配。'},
     {title:'规模',body:'$|V^{\\prime}| = |V| + 2$、$|E^{\\prime}| = |E| + |V| = \\Theta(E)$。'},
    ]},
   {type:'intuition',title:'容量 1 就是"至多选一次"',scene:'Figure 24.8 的二分图（C 程序 Part 3）',body:[
     '容量 1 的含义：每个左点最多"发出"1 单位流（最多匹配一条边）、每个右点最多"接收"1 单位 —— 这正好就是匹配的定义（每点至多一条关联边）。',
     '★ C 程序 Part 3：$|L| = 4$、$|R| = 3$、6 条边的图，最大流 = **3**（受右点数量限制），匹配 $\\{(u_1,v_1), (u_3,v_3), (u_4,v_2)\\}$。',
     '★ 整数性定理保证"最大流 → 匹配"这一步的合法性：流量非整数时"半个匹配"没有意义，而整数容量下 FF 给出的必是整数流。',
     '★ 复杂度：FF 在单位容量网络上 $O(VE)$（增广次数上界 |V|，每次 O(E)）→ 匹配问题的经典多项式算法。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式）。',blocks:[
     {kind:'body',page:693,en:'Figure 24.8 illustrates the notion of a matching in a bipartite graph.',
      zh:'★ 匹配的定义见 Figure 24.8。'},
     {kind:'body',page:694,en:'The Ford-Fulkerson method provides a basis for finding a maximum matching in an undirected bipartite graph G = (V,E) in time polynomial in |V| and |E|.',
      zh:'★★ 用 FF 求最大匹配（多项式时间）。'},
     {kind:'body',page:694,en:'|E| C |V| \u2264 3 |E|, and so jE 0 j = \u0398(E).',
      zh:'★ 归约后的网络规模：$|E^{\\prime}| = |E| + |V| = \\Theta(E)$。'},
     {kind:'body',page:696,en:'If the capacity function c takes on only integer values, then the maximum flow f produced by the Ford-Fulkerson method has the property that |f| is an integer.',
      zh:'★★ 整数流定理（引理 24.9 的前提）。'},
     {kind:'body',page:696,en:'The cardinality of a maximum matching M in a bipartite graph G equals the value of a maximum flow f in its corresponding flow network G 0 .',
      zh:'★★ **推论 24.10**：最大匹配大小 = 对应流网络的最大流值。'},
    ],terms:[{en:'bipartite matching',zh:'二分匹配',page:693},
              {en:'integer-valued',zh:'整数值的流',page:695}]},
   {type:'pseudocode',title:'归约：从匹配到流',algo:'BIPARTITE-MATCHING-VIA-FLOW',signature:'匹配 → 最大流 的归约构造（原书 p.694，本站整理）',page:694,
    lines:[
     {n:1,code:'构造 G′：V′ = V ∪ {s,t}',zh:''},
     {n:2,code:'对每个 u ∈ L 加边 (s,u)，容量 1',zh:'★ 每个左点至多配一次。'},
     {n:3,code:'对每条 (u,v) ∈ E 加边，容量 1',zh:'★ 每条匹配边只能用一次。'},
     {n:4,code:'对每个 v ∈ R 加边 (v,t)，容量 1',zh:'★ 每个右点至多配一次。'},
     {n:5,code:'在 G′ 上求最大流 f（FF / Edmonds-Karp）',zh:''},
     {n:6,code:'M = {(u,v) ∈ E : f(u,v) = 1}',zh:'★ 流量为 1 的边就是匹配对。'}],
    vars:[{name:'M',meaning:'匹配（顶点至多一条关联边）'}],
    note:'★ 整数性让 $f(u,v) \\in \\{0,1\\}$ —— 不需要额外取整步骤。',
    more:[]},
   {type:'visualize',title:'匹配与流值',panels:[
     {title:'C 程序 Part 3：最大匹配 = 3',viz:'growth',
      chart:{xMax:6,series:[
       {name:'最大匹配 |M| = 3',expr:'3',color:'--viz-done'},
       {name:'|R| = 3 的上限',expr:'3',color:'--viz-compare'},
       {name:'|L| = 4（未被用满）',expr:'4',color:'--viz-violation'}]},
      note:'★ 匹配受"两侧较小者"限制：这里右点只有 3 个 → 最多 3 对（C 程序 part 3 断言 aug == 3）。'},
    ],tasks:['对照 C 程序 part 3 打印的匹配对。'],note:''},
   {type:'code',title:'实测：匹配 3 对',c:{file:'max_flow.c',code:String.raw`/* max_flow.c -- 24 章：最大流（Ford-Fulkerson / Edmonds-Karp）+ 二分图匹配。
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 3（二分匹配归约）。'},
           {line:96,zh:'★★ part 3：构造 $s \\to L$、$L \\to R$、$R \\to t$ 的单位容量网络并跑 Edmonds-Karp。'},
           {line:118,zh:'★ 输出匹配对 (u1,v1) (u3,v3) (u4,v2) —— 并断言 |M| = 3。'}]},
    tests:[{in:'|L|=4, |R|=3, 6 条边',out:'最大匹配 3 对'},
           {in:'匹配对',out:'(u1,v1) (u3,v3) (u4,v2)'}],
    mapping:[{pc:2,pcCode:'(s,u) 容量 1',c:'`for (int u = 1; u <= 4; u++) { mc[0][u] = 1; }`（第 103 行）'},
             {pc:6,pcCode:'M = {(u,v) : f(u,v) = 1}',c:'`if (mf[u][v] > 0) { printf(...) }`（第 114 行）'}]},
   {type:'analyze',title:'一本账：归约的三个数字',claims:[
     {expr:'\\Theta(E)',when:'归约后网络的边数（$|E| + |V| \\le 3|E|$）',page:694,source:'book'},
     {expr:'\\text{整数流}',when:'整数容量下最大流可取整数（引理 24.9）',page:696,source:'book'},
     {expr:'|M| = |f|',when:'最大匹配 = 最大流（推论 24.10）',page:696,source:'book'},
    ],tables:[{caption:'C 程序 Part 3 的实测',rows:[
      ['量','值'],
      ['|L| / |R|','4 / 3'],
      ['边数','6'],
      ['最大匹配','3（= |R| 上限）'],
      ['匹配对','(u1,v1) (u3,v3) (u4,v2)'],
     ]},{caption:'归约后的网络构造',rows:[
      ['原图元素','流网络元素','容量'],
      ['左点 u','边 (s,u)','1'],
      ['匹配边 (u,v)','边 (u,v)','1'],
      ['右点 v','边 (v,t)','1'],
     ]}],chart:{xMax:8,series:[
     {name:'最大匹配 3',expr:'3',color:'--viz-done'},
     {name:'|L| = 4 的上界（未被触及）',expr:'4',color:'--viz-compare'}]},
    derivations:[{kind:'summation',title:'两个方向的对应',steps:[
      {zh:'**匹配 ⇒ 流**：给定匹配 $M$，令 $f$ 在 $s\\to u$、$(u,v) \\in M$、$v \\to t$ 上为 1，其余 0 —— 满足容量与守恒，且 $|f| = |M|$。'},
      {zh:'**流 ⇒ 匹配**：整数流下每条 $(u,v) \\in E$ 的流非 0 即 1；由 $(s,u)$ 容量 1 知每个 u 至多配一条、由 $(v,t)$ 容量 1 知每个 v 至多配一条 → $M$ 是合法匹配。'},
      {tex:'|M| = |f|',zh:'★ 两方向合起来即推论 24.10。C 程序 part 3 在具体图上验证了这一等号。∎'}]},
     ],
    note:''},
   {type:'prove',title:'推论 24.10：匹配大小 = 流值',statement:'The cardinality of a maximum matching M in a bipartite graph G equals the value of a maximum flow f in its corresponding flow network G 0 .',page:696,
    intro:'★ 证明就是上面两个方向的对应；整数性保证"流 → 匹配"这一步不产生半个匹配。',
    steps:[
     {title:'匹配 → 流（正方向）',en:'The Ford-Fulkerson method provides a basis for finding a maximum matching in an undirected bipartite graph G = (V,E) in time polynomial in |V| and |E|.',page:694,
      body:['设 $M$ 是最大匹配（$|M| = k$）。在 $G^{\\prime}$ 上：$f(s,u) = f(u,v) = f(v,t) = 1$ 对所有 $(u,v) \\in M$，其余 0。',
        '容量约束：每条用到的边容量 1、流 1 ✓。守恒：每个被匹配的左点流进 1 流出 1；右点同理 ✓。',
        '于是得到 $|f| = k$ 的合法流 → 最大流 $\\ge k$。']},
     {title:'流 → 匹配（反方向，靠整数性）',en:'If the capacity function c takes on only integer values, then the maximum flow f produced by the Ford-Fulkerson method has the property that |f| is an integer.',page:696,
      body:['设最大整数流 $f$，$|f| = k$。令 $M = \\{(u,v) \\in E : f(u,v) > 0\\}$。',
        '由 $(s,u)$ 容量 1 → 每个 $u$ 至多发出 1 单位 → 至多一条 $f(u,v) > 0$；由 $(v,t)$ 容量 1 → 每个 $v$ 同理。故 $M$ 是合法匹配。',
        '又 $|M| = f(L \\cup \\{s\\}, R \\cup \\{t\\}) = |f| = k$（引理 24.4 的净流等式）。∎']},
     {title:'实测与规模',en:'|E| C |V| \u2264 3 |E|, and so jE 0 j = \u0398(E).',page:694,
      body:['C 程序 part 3：4+3+6 边的二分图，最大流 3，匹配 3 对，与"右点只有 3 个"的直觉一致。',
        '规模：$|E^{\\prime}| = |E| + |V| \\le 3|E|$ —— 归约不放大问题规模。',
        '★ 单位容量网络上 FF 的增广次数 ≤ |V|，总 O(VE) —— 匹配的多项式时间算法。∎']},
    ],conclusion:'★ 结论：最大二分匹配 = 最大流（特例）；整数性是这道桥的合法性保证。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'归约中每条边（含 s→L 与 R→t）的容量是？',options:['∞','**1**','|V|','边的权重'],answer:1,
      why:'★ 容量 1 对应"每个顶点至多匹配一次"。'},
     {kind:'single',q:'为什么"流 → 匹配"这一步合法？',options:['因为流量总是 0/1','**因为整数容量下的最大流是整数值的（引理 24.9）**','因为图是二分图','因为 FF 用 BFS'],answer:1,
      why:'★ 整数流保证 f(u,v) ∈ {0,1}，不会出现"半个匹配"。'},
     {kind:'judge',q:'最大匹配的大小可以超过 min(|L|, |R|)。',answer:false,
      why:'★ 匹配边需两端各异 → 上界 min(|L|,|R|)；C 程序 part 3 正是被 |R|=3 卡住。'},
     {kind:'simulate',q:'C 程序 part 3 的图最大匹配是多少？（填数字）',expect:[3],placeholder:'例如：4',
      why:'3（|R| = 3 的上限；实测匹配对 3 组）。'},
     {kind:'single',q:'C 程序 part 3 得到的匹配包含哪一对？',options:['$(u_1,v_2)$','**$(u_1,v_1)$**','$(u_2,v_3)$','$(u_3,v_1)$'],answer:1,why:'★ code 段实测的匹配对是 $(u_1,v_1)$、$(u_3,v_3)$、$(u_4,v_2)$。'},
     {kind:'judge',q:'归约后网络的规模仍是 $\\Theta(E)$ —— 因为 $|E| + |V| \\le 3|E|$。',answer:true,why:'★ analyze 段第一条：往里加源、加汇只增加线性条数的边，不改变量级。'},
     {kind:'simulate',q:'C 程序 part 3 的图左右两侧共几个顶点（$|L| + |R|$）？',expect:[7],placeholder:'例如：6',why:'★ code 段标了 $|L|=4$、$|R|=3$，合计 7 个顶点、6 条边。'},
    ],bookExercises:[
     {id:'24.3-1',page:696,star:0,statement:'Run the Ford-Fulkerson algorithm on the flow network in Figure 24.8(c) and show the residual network after each flow augmentation. Number the vertices in L top to bottom from 1 to 5 and in R top to bottom from 6 to 9. For each iteration, pick the augmenting path that is lexicographically smallest.',hint:'先按归约画 G′（单位容量），再手工跑 FF：每次找增广路 +1，直到无路可走 —— 匹配大小即 |f|。'},
     {id:'24.3-2',page:697,star:0,statement:'Prove Theorem 24.10. Use induction on the number of iterations of the Ford- Fulkerson method.',hint:'教材里的引理 24.9 证明：两个方向各自构造映射，再用引理 24.4 的净流等式对齐大小。'},
     {id:'24.3-3',page:697,star:0,statement:'Let G = (V,E) be a bipartite graph with vertex partition V = L [ R, and let G 0 be its corresponding flow network. Give a good upper bound on the length of any augmenting path found in G 0 during the execution of FORD-FULKERSON .',hint:'完美匹配 ⟺ 流网络的值为 $|V|/2$（左右各半）；用最大流判定。若 $|L| \\ne |R|$ 则不可能完美。'},
    ]},
  ],
};
