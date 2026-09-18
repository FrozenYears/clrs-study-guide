/* 第 21 章 21.1：生成一棵最小生成树（Growing a minimum spanning tree）。印刷页 624–630（pdf 645–651）。 */
export default {
  key:'s01',id:'ch21/s01',chapter:21,section:'21.1',
  title:'通用 MST：安全边的循环不变量',shortTitle:'21.1 生成最小生成树',
  titleEn:'Growing a minimum spanning tree',
  source:{printed:[586,588],pdf:[607,609]},
  prerequisites:[{label:'20.5 Strongly connected components',url:'#/ch20/s05'}],
  stages:[
   {type:'map',title:'贪心策略的正规军',
    why:'MST 问题：给连通无向带权图，找权重和最小的生成树。本章两个算法（Kruskal/Prim）是同一**贪心框架**的两个实例：GENERIC-MST 一次加一条"安全边"。',
    position:'图算法第二章。它把 19 章的并查集派上用场（Kruskal 判环），也是贪心思想（15 章）在图上的回归。',
    unlocks:[{label:'21.2 The algorithms of Kruskal and Prim',url:'#/ch21/s02'}],
    mathKit:[
     {title:'循环不变量',body:'每次迭代前，$A$ 是**某个** MST 的子集。'},
     {title:'安全边',body:'$(u,v)$ 是安全边 $\\iff$ $A \\cup \\{(u,v)\\}$ 仍是某 MST 的子集。'},
     {title:'切割性质',body:'切割 $(S, V-S)$ 尊重 $A$ 时，横跨切割的**轻边**是安全边。'},
    ]},
   {type:'intuition',title:'为什么轻边一定安全',scene:'切割 (S, V−S) 尊重 A',body:[
     '切割：把顶点分成两半。切割**尊重** A：A 中没有边横跨切口。横跨切割的边里权重最小的叫**轻边**。',
     '★ 定理 21.1 的证明是交换论证：设最优树 T 不含轻边 (u,v)。把 (u,v) 加进 T 会形成环，环必跨切口 → 环上另有一条**更重**的横跨边 (x,y) ∈ T。用 (u,v) 换掉 (x,y)：$w(T^{\\prime}) = w(T) - w(x,y) + w(u,v) \\le w(T)$。',
     '★ 所以"存在含轻边的 MST" —— 轻边安全，贪心每步无损。',
     '★ 两个算法的区别只在**怎么找安全边**：Kruskal 全局按权重排队（用并查集判环），Prim 从源头向外生长（用优先队列挑轻边）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 f(u,v) g 代表 {u,v}）。',blocks:[
     {kind:'body',page:586,en:'This greedy strategy is captured by the procedure GENERIC-MST on the facing page, which grows the minimum spanning tree one edge at a time. The generic method manages a set A of edges, maintaining the following loop invariant:',
      zh:'★ 通用框架：一次加一条边 + 循环不变量。'},
     {kind:'body',page:586,en:'Prior to each iteration, A is a subset of some minimum spanning tree.',
      zh:'★★ 不变量：A 是某 MST 的子集。'},
     {kind:'body',page:587,en:'Each step determines an edge (u,v) that the procedure can add to A without violating this invariant, in the sense that A [ f(u,v) g is also a subset of a minimum spanning tree. We call such an edge a safe edge for A, since it can be added safely to A while maintaining the invariant.',
      zh:'★★ **安全边**的定义：加入后不破坏不变量。'},
     {kind:'body',page:587,en:'Termination: All edges added to A belong to a minimum spanning tree, and the loop must terminate by the time it has considered all edges. Therefore, the set A returned in line 5 must be a minimum spanning tree.',
      zh:'★★ 循环不变量的终止情形：由保持性，A 里每条边都属于某棵最小生成树；而循环最多把每条边各考虑一遍就会停 —— 所以第 5 行返回的 A 正是一棵最小生成树。'},
     {kind:'body',page:588,en:'We first need some definitions. A cut (S,V \u2212 S) of an undirected graph G =',
      zh:'★ 切割的定义（后半句接 (V, E)）。'},
     {kind:'body',page:588,en:'But T is a minimum spanning tree, so that w(T) \u2264 w(T 0 ), and thus, T 0 must be a minimum spanning tree as well.',
      zh:'★ 交换论证的收尾：T0 也是 MST → 轻边安全。'},
    ],terms:[{en:'safe edge',zh:'安全边',page:587},
              {en:'light edge',zh:'横跨切割的轻边',page:588},
              {en:'cut',zh:'切割 (S, V−S)',page:588}]},
   {type:'pseudocode',title:'GENERIC-MST：5 行',algo:'GENERIC-MST',signature:'GENERIC-MST(G, w)',page:587,
    lines:[
     {n:1,code:'A = ∅',zh:''},
     {n:2,code:'while A is not a spanning tree',zh:'★ 未成树就继续。'},
     {n:3,code:'    find an edge (u,v) that is safe for A',zh:'★★ 找安全边 —— 两个算法的差异全在这里。'},
     {n:4,code:'    A = A ∪ {(u,v)}',zh:''},
     {n:5,code:'return A',zh:''}],
    vars:[{name:'A',meaning:'已选边集（始终是某 MST 的子集）'}],
    note:'★ "while A is not a spanning tree" 在语料中即 while A is not a spanning tree；|A| < |V|−1 时继续。',
    more:[]},
   {type:'visualize',title:'安全边的交换论证',panels:[
     {title:'交换前后：权重不增（定理 21.1）',viz:'growth',
      chart:{xMax:16,series:[
       {name:'w(T)（原最优树）',expr:'37',color:'--viz-compare'},
       {name:'w(T′) = w(T) − w(x,y) + w(u,v) ≤ w(T)',expr:'37',color:'--viz-done'},
       {name:'换成更重的边会怎样（反事实）',expr:'45',color:'--viz-violation'}]},
      note:'★ 用 Figure 21.1 的 MST 总权重 37 做锚：任何"不用轻边"的选择都不会更优。'},
    ],tasks:['对照 c/mst_kruskal_prim.c：Kruskal 与 Prim 各自选出总权重 37 的树。'],note:''},
   {type:'code',title:'实测：两种贪心都到 37',c:{file:'mst_kruskal_prim.c',code:String.raw`/* mst_kruskal_prim.c -- 21.2: Kruskal 与 Prim。
 * 数据：原书 Figure 21.1 的图（顶点 a..i，13 条加权无向边）。
 * 关键数字：MST 总权重 = 37（原书答案）；Kruskal 与 Prim 选出的边集权重一致。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define V 9
#define E 14

static const char *name[V] = {"a", "b", "c", "d", "e", "f", "g", "h", "i"};

/* Figure 21.1 的边（u, v, w） */
static const int eu[E] = {0, 0, 1, 1, 2, 2, 2, 3, 3, 4, 5, 6, 6, 7};
static const int ev[E] = {1, 7, 2, 7, 3, 5, 8, 4, 5, 5, 6, 7, 8, 8};
static const int ew[E] = {4, 8, 8, 11, 7, 4, 2, 9, 14, 10, 2, 1, 6, 7};

/* ---------- 并查集（Kruskal 用，19 章的森林实现） ---------- */
static int dsu_p[V], dsu_rank[V];

static void dsu_make(void)
{
    for (int i = 0; i < V; i++) { dsu_p[i] = i; dsu_rank[i] = 0; }
}

static int dsu_find(int x)
{
    while (dsu_p[x] != x) { x = dsu_p[x]; }
    return x;
}

static int dsu_link(int x, int y)          /* 返回 1 表示发生了合并 */
{
    if (dsu_rank[x] > dsu_rank[y]) { dsu_p[y] = x; return 1; }
    dsu_p[x] = y;
    if (dsu_rank[x] == dsu_rank[y]) { dsu_rank[y]++; }
    return 1;
}

/* ---------- Kruskal ---------- */
static int in_mst_kruskal[E];

static void kruskal(void)
{
    int order[E];
    for (int i = 0; i < E; i++) { order[i] = i; }
    /* 按权重插入排序（稳定、无 qsort 依赖） */
    for (int i = 1; i < E; i++) {
        int e = order[i], j = i - 1;
        while (j >= 0 && ew[order[j]] > ew[e]) { order[j + 1] = order[j]; j--; }
        order[j + 1] = e;
    }
    dsu_make();
    printf("part 1: Kruskal 按权重依次考察（跳过成环的边）：\n");
    for (int i = 0; i < E; i++) {
        int e = order[i];
        int ru = dsu_find(eu[e]), rv = dsu_find(ev[e]);
        if (ru != rv) {
            dsu_link(ru, rv);
            in_mst_kruskal[e] = 1;
            printf("        取 (%s,%s) 权 %d\n", name[eu[e]], name[ev[e]], ew[e]);
        }
    }
}

/* ---------- Prim（数组版"优先队列"：每轮线性找最小） ---------- */
static int in_mst_prim[V];
static int key[V];                          /* 连接到树的最小权 */
static int pred[V];

static void prim(int s)
{
    for (int i = 0; i < V; i++) { key[i] = 1000000; pred[i] = -1; in_mst_prim[i] = 0; }
    key[s] = 0;
    printf("part 2: Prim 从 %s 出发，逐点入树：\n", name[s]);
    for (int count = 0; count < V; count++) {
        int u = -1;
        for (int i = 0; i < V; i++) {
            if (!in_mst_prim[i] && (u < 0 || key[i] < key[u])) { u = i; }
        }
        in_mst_prim[u] = 1;
        if (pred[u] >= 0) {
            printf("        取 (%s,%s) 权 %d\n", name[pred[u]], name[u], key[u]);
        }
        for (int e = 0; e < E; e++) {       /* 松弛 u 的所有邻边 */
            int v = -1;
            if (eu[e] == u) { v = ev[e]; }
            if (ev[e] == u) { v = eu[e]; }
            if (v >= 0 && !in_mst_prim[v] && ew[e] < key[v]) {
                key[v] = ew[e]; pred[v] = u;
            }
        }
    }
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    kruskal();
    long total_k = 0;
    for (int e = 0; e < E; e++) { if (in_mst_kruskal[e]) { total_k += ew[e]; } }
    printf("        Kruskal 的 MST 总权重 = %ld（原书答案 37）\n", total_k);
    assert(total_k == 37);
    int cnt_k = 0;
    for (int e = 0; e < E; e++) { cnt_k += in_mst_kruskal[e]; }
    assert(cnt_k == V - 1);                 /* 树恰有 V-1 条边 */

    prim(0);
    long total_p = 0;
    for (int i = 0; i < V; i++) {
        assert(pred[i] >= 0 || i == 0);
        if (pred[i] >= 0) { total_p += key[i]; }
    }
    printf("        Prim 的 MST 总权重 = %ld\n", total_p);
    assert(total_p == 37);

    printf("part 3: 两种算法的总权重一致（37 = 37）—— MST 的总权重唯一，\n");
    printf("        边集在权重并列时可能不同；本例两者都给出最优树。\n");
    assert(total_k == total_p);

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 21.2 的程序提前入场 —— 本关用它核对"总权重唯一"。'},
           {line:60,zh:'★★ part 1：Kruskal 按权重排队 + 并查集判环，总权重 37。'},
           {line:80,zh:'★★ part 2：Prim 从 a 出发向外生长，总权重同为 37。'},
           {line:90,zh:'★ part 3：MST 的总权重唯一；边集在并列权重下可能不同。'}]},
    tests:[{in:'Figure 21.1 的图（9 顶点 14 边）',out:'Kruskal MST 权重 37'},
           {in:'Prim 从 a 出发',out:'MST 权重同为 37'},
           {in:'边数',out:'V − 1 = 8 条'}],
    mapping:[{pc:3,pcCode:'find an edge that is safe for A',c:'Kruskal 的判环：`int ru = dsu_find(eu[e]), rv = dsu_find(ev[e]);`（第 57 行）'}]},
   {type:'analyze',title:'一本账：两个约束条件',claims:[
     {expr:'|A| = |V| - 1',when:'终止时 A 恰为生成树（V−1 条边）',page:587,source:'book'},
     {expr:'w(u,v) \\le w(x,y)',when:'轻边条件：横跨切割的最小权',page:588,source:'book'},
     {expr:'w(T^\\prime) = w(T) - w(x,y) + w(u,v)',when:'交换论证的算式',page:588,source:'book'},
    ],tables:[{caption:'C 程序：Figure 21.1 的 MST',rows:[
      ['算法','选边顺序','总权重'],
      ['Kruskal','(g,h)1 (c,i)2 (f,g)2 (a,b)4 (c,f)4 (c,d)7 (a,h)8 (d,e)9','37'],
      ['Prim（自 a）','(a,b)4 (b,c)8 (c,i)2 (c,f)4 (f,g)2 (g,h)1 (c,d)7 (d,e)9','37'],
     ]},{caption:'两个性质的分工',rows:[
      ['性质','内容','作用'],
      ['切割性质','尊重 A 的切割的轻边是安全边','给"找安全边"提供判定'],
      ['循环性质','若 (u,v) 是环上最重边则不在任何 MST','反证工具（习题）'],
     ]}],chart:{xMax:16,series:[
     {name:'生成树边数 V−1 = 8',expr:'8',color:'--viz-done'},
     {name:'全图边数 E = 14',expr:'14',color:'--viz-compare'}]},
    derivations:[{kind:'summation',title:'交换论证的完整链条',steps:[
      {zh:'设 $T$ 为 MST 且 $(u,v) \\notin T$（轻边横跨切割 $(S, V-S)$，$A$ 尊重切割）。'},
      {zh:'$(u,v)$ 连接两侧 → $T$ 中必有边 $(x,y)$ 也横跨该切割且在 $u \\leadsto v$ 的树路径上。'},
      {zh:'把 $(x,y)$ 换成 $(u,v)$：$T^{\\prime} = T - \\{(x,y)\\} + \\{(u,v)\\}$ 仍是生成树，且 $w(T^{\\prime}) \\le w(T)$。'},
      {tex:'w(T^\\prime) \\le w(T) \\;\\Longrightarrow\\; T^\\prime \\text{ 也是 MST}',zh:'★ 所以存在含 $(u,v)$ 的 MST —— $(u,v)$ 对 $A$ 是安全的（$(u,v)$ 加入时 $A$ 仍尊重要求）。∎'}]},
     ],
    note:''},
   {type:'prove',title:'定理 21.1：轻边是安全边',statement:'But T is a minimum spanning tree, so that w(T) \u2264 w(T 0 ), and thus, T 0 must be a minimum spanning tree as well.',page:588,
    intro:'★ 前提三条：切割 (S, V−S) 尊重 A；(u, v) 是横跨切割的轻边；(u, v) ∉ A。',
    steps:[
     {title:'构造 T′',en:'We first need some definitions. A cut (S,V \u2212 S) of an undirected graph G =',page:588,
      body:['在 $T$ 中加入 $(u,v)$（$u \\in S$、$v \\in V-S$）→ 形成唯一环；环上必有另一条横跨切口的边 $(x,y) \\ne (u,v)$（因为树路径从一侧到另一侧）。',
        '删去 $(x,y)$：得到生成树 $T^{\\prime}$。']},
     {title:'权重比较',en:'We next show that T 0 is a minimum spanning tree. Since (u,v) is a light edge crossing (S,V \u2212 S) and (x,y) also crosses this cut, w(u,v) \u2264 w(x,y) . Therefore, w(T 0 ) = w(T) \u2212 w(x,y) + w(u,v)',page:588,
      body:['$(u,v)$ 是横跨切割的轻边 → $w(u,v) \\le w(x,y)$。',
        '$w(T^{\\prime}) = w(T) - w(x,y) + w(u,v) \\le w(T)$。']},
     {title:'结论：A 的扩张合法性',en:'Prior to each iteration, A is a subset of some minimum spanning tree.',page:586,
      body:['$T^{\\prime}$ 是含 $A \\cup \\{(u,v)\\}$ 的 MST（$A$ 尊重切割 → $A$ 的边都在 $T$ 内且不横跨切口）。',
        '所以 $(u,v)$ 对 $A$ 是**安全边** —— GENERIC-MST 的每一步都成立，终止时 $A$ 就是 MST。∎']},
    ],conclusion:'★ 结论：切割性质把"全局最优"降解为"局部找轻边" —— Kruskal 与 Prim 只是找轻边的两种方式。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'GENERIC-MST 的循环不变量是？',options:['A 是唯一的 MST','**A 是某个 MST 的子集**','A 的边按权重有序','A 中无环'],answer:1,
      why:'★ "某个"二字是关键：MST 不唯一，不变量只要存在性。'},
     {kind:'single',q:'切割性质的完整前提是？',options:['切割任意','**切割尊重 A，且 (u,v) 是横跨切割的轻边**','(u,v) 是全图最轻边','u、v 都是叶'],answer:1,
      why:'★ 尊重 A 是必要前提，否则轻边可能与 A 成环。'},
     {kind:'judge',q:'MST 的边集是唯一的。',answer:false,
      why:'★ 权重并列时可能有多个 MST；唯一的是**总权重**（C 程序 part 3：两种算法 37 = 37，选边不同）。'},
     {kind:'simulate',q:'Figure 21.1 的图的 MST 总权重是多少？（填数字）',expect:[37],placeholder:'例如：40',
      why:'37（原书答案；C 程序两种算法实测一致）。'},
    ],bookExercises:[
     {id:'21.1-1',page:588,star:0,statement:'Show that the shortest edge from u to v is always... ',hint:'按 GENERIC-MST 跑 Figure 21.1：每步画切割、找轻边 —— 即 21.2 两种算法的手工版。'},
     {id:'21.1-2',page:588,star:0,statement:'Prove that if (u,v) is a light edge... ',hint:'注意"轻边"是相对切割的：同一条边对不同切割的"轻"不同；跨越多个切割时逐一切割验证，或构造反例说明"对某切割轻"≠"在所有 MST 中"。'},
     {id:'21.1-3',page:588,star:0,statement:'Give a simple example of a graph such that the set of edges... ',hint:'找一条"非最重却不在任何 MST"的边：让它在与**更轻的边**构成环的位置 —— 循环性质（若环上最重则排除）不足以排除它，需要组合论证。'},
     {id:'21.1-4',page:588,star:0,statement:'Give a simple example of a graph such that the set of edges that are... ',hint:'循环性质的逆否命题只排除"环上最重"；构造并列权重的环 —— 最重的几条边中有的可能在某个 MST 里。'},
     {id:'21.1-5',page:588,star:0,statement:'Show that if e belongs to some minimum spanning tree of G, then... ',hint:'收缩/切割构造：把 e 两侧的点集做成切割，e 是该切割的轻边（否则换掉 e 得到更小的树，矛盾）—— 即"e 在某个 MST 中 ⟺ e 对某个切割是轻边"。'},
    ]},
  ],
};
