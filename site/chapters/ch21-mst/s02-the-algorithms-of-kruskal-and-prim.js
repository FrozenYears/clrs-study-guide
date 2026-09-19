/* 第 21 章 21.2：Kruskal 与 Prim 算法（The algorithms of Kruskal and Prim）。印刷页 630–638（pdf 651–659）。 */
export default {
  key:'s02',id:'ch21/s02',chapter:21,section:'21.2',
  title:'Kruskal 与 Prim：找安全边的两条路',shortTitle:'21.2 Kruskal 与 Prim',
  titleEn:'The algorithms of Kruskal and Prim',
  source: { printed: [591, 603], pdf: [612, 625] },
  prerequisites:[{label:'21.1 Growing a minimum spanning tree',url:'#/ch21/s01'}],
  stages:[
   {type:'map',title:'同一目标，两种找安全边的方式',
    why:'Kruskal：**全局按权重排序**，用并查集判环（森林长成林）。Prim：**从源点向外生长**，用优先队列挑横跨切割的轻边（始终一棵树）。两者都落在 21.1 的框架里。',
    position:'19 章并查集的第一个重量级应用（Kruskal 判环）；15 章贪心思想的图论兑现。复杂度的差异全部来自"找安全边"的数据结构。',
    unlocks:[{label:'22.1 The Bellman-Ford algorithm',url:'#/ch22/s01'}],
    mathKit:[
     {title:'Kruskal',body:'边按权重升序考察，$O(E \\lg E) = O(E \\lg V)$（含排序 + 并查集 $O(E\\,\\alpha(V))$）。'},
     {title:'Prim（二叉堆）',body:'$O(E \\lg V)$；斐波那契堆 $O(E + V \\lg V)$。'},
     {title:'共同点',body:'每步加入的都是横跨"切口（树 | 其余）"的轻边 —— 定理 21.1 保证安全。'},
    ]},
   {type:'intuition',title:'一个排队，一个生长',scene:'Figure 21.1 的图（C 程序实测）',body:[
     '**Kruskal**：把 14 条边按权重升序排队：(g,h)1 → (c,i)2 → (f,g)2 → (a,b)4 → (c,f)4 → …。每条边只要两端不在同一集合（并查集判环）就取 —— 森林逐渐合并成一棵树。',
     '★ **Prim**：从 a 出发只维护**一棵树**：每轮挑"树到树外"的最轻边 —— (a,b)4 → (b,c)8 → (c,i)2 → (c,f)4 → (f,g)2 → (g,h)1 → (c,d)7 → (d,e)9。',
     '★ 两种顺序完全不同，但总权重同为 **37** —— MST 总权重唯一，边集在并列权重下可以不同。',
     '★ 数据结构决定复杂度：Kruskal 的排序 O(E lg E)；Prim 的优先队列二叉堆 O(E lg V)、斐波那契堆 O(E + V lg V)。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 Kruskal9s 代表 Kruskal′s）。',blocks:[
     {kind:'body',page:592,en:'Kruskal9s algorithm finds a safe edge to add to the growing forest by finding, of all the edges that connect any two trees in the forest, an edge (u,v) with the lowest weight.',
      zh:'★ Kruskal 找安全边的方式：连接森林中任意两棵树的边里取最轻。'},
     {kind:'body',page:593,en:'To combine trees, Kruskal9s algorithm calls the UNION procedure.',
      zh:'★ 并查集 UNION 负责合并两棵树（19 章落地）。'},
     {kind:'body',page:594,en:'|E| \u2265 |V| \u2212 1, and so the disjoint-set operations take O(E\u02db.V)/ time. Moreover, since \u02db.|V|/ = O(lg V) = O(lg E), the total running time of Kruskal9s algorithm',
      zh:'★ 并查集操作 O(E α(V))；总时间推到 O(E lg V)（α(V) = O(lg V)）。'},
     {kind:'body',page:594,en:'is O(E lg E). Observing that |E| < |V| 2 , we have lg |E| = O(lg V) , and so we can restate the running time of Kruskal9s algorithm as O(E lg V) .',
      zh:'★ |E| < V² → lg E = O(lg V)。'},
     {kind:'body',page:597,en:'The running time of Prim9s algorithm depends on the specific implementation of the min-priority queue Q. You can implement Q with a binary min-heap (see',
      zh:'★ Prim 的时间取决于优先队列实现（后半句接二叉堆/斐波那契堆的复杂度）。'},
    ],terms:[{en:'Kruskal',zh:'Kruskal 算法（全局排队 + 并查集）',page:592},
              {en:'Prim',zh:'Prim 算法（单树生长 + 优先队列）',page:596}]},
   {type:'pseudocode',title:'MST-KRUSKAL：10 行',algo:'MST-KRUSKAL',signature:'MST-KRUSKAL(G, w)',page:594,
    lines:[
     {n:1,code:'A = ∅',zh:''},
     {n:2,code:'for each vertex v ∈ G.V',zh:''},
     {n:3,code:'    MAKE-SET(v)',zh:'★ 每个顶点一个集合。'},
     {n:4,code:'sort the edges of G.E into nondecreasing order by weight w',zh:'★★ 排序是主要代价之一。'},
     {n:5,code:'for each edge (u,v) ∈ G.E, taken in nondecreasing order by weight',zh:''},
     {n:6,code:'    if FIND-SET(u) ≠ FIND-SET(v)',zh:'★★ 不在同一集合 = 不成环。'},
     {n:7,code:'        A = A ∪ {(u,v)}',zh:''},
     {n:8,code:'        UNION(u,v)',zh:'★★ 合并两棵树。'},
     {n:9,code:'return A',zh:''}],
    vars:[{name:'A',meaning:'MST 边集'},{name:'FIND-SET',meaning:'19 章的并查集'}],
    note:'★ 正确性：按权重考察时，(u,v) 是横跨"森林各树之间"的轻边（对切割"u 的树 | 其余"）—— 由切割性质安全。',
    more:[{algo:'MST-PRIM',subtitle:'MST-PRIM(G, w, r) —— 14 行（p.596）：单树生长',signature:'MST-PRIM(G, w, r)',page:596,
      lines:[{n:1,code:'for each u ∈ G.V',zh:''},
        {n:2,code:'    key[u] = ∞;  u.π = NIL',zh:'key[u] = 连回树的最轻边权。'},
        {n:3,code:'key[r] = 0',zh:''},
        {n:4,code:'Q = G.V',zh:'最小优先队列（按 key）。'},
        {n:5,code:'while Q ≠ ∅',zh:''},
        {n:6,code:'    u = EXTRACT-MIN(Q)',zh:'★ 树外 key 最小者入树。'},
        {n:7,code:'    for each v ∈ G.Adj[u]',zh:''},
        {n:8,code:'        if v ∈ Q and w(u,v) < key[v]',zh:'★★ 松弛：更轻的连树边。'},
        {n:9,code:'            v.π = u;  key[v] = w(u,v)',zh:'隐含 DECREASE-KEY。'}],
      vars:[{name:'key[v]',meaning:'v 连到树的最小边权'},{name:'v.π',meaning:'树上父结点'}],
      note:'★ 每次选出的 (π[v], v) 就是横跨"树 | Q"切口的轻边 —— 安全性由切割性质。'}]},
   {type:'visualize',title:'两种顺序，同一权重',panels:[
     {title:'C 程序实测：两种算法的选边顺序',viz:'growth',
      chart:{xMax:16,series:[
       {name:'Kruskal 总权重 37',expr:'37',color:'--viz-done'},
       {name:'Prim 总权重 37',expr:'37',color:'--viz-compare'},
       {name:'次优生成树（反事实）',expr:'39',color:'--viz-violation'}]},
      note:'★ Kruskal 前四条：(g,h)1 (c,i)2 (f,g)2 (a,b)4；Prim 前四条：(a,b)4 (b,c)8 (c,i)2 (c,f)4 —— 顺序迥异，总价相同。'},
    ],tasks:['对照 C 程序 part 1/2 的逐边输出。'],note:''},
   {type:'code',title:'实测：37 与 37',c:{file:'mst_kruskal_prim.c',code:String.raw`/* mst_kruskal_prim.c -- 21.2: Kruskal 与 Prim。
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
    notes:[{line:1,zh:'★ 数据：Figure 21.1 的图（a..i，14 边）。'},
           {line:60,zh:'★★ part 1：Kruskal —— 排序 + 并查集判环，8 条边总权重 37。'},
           {line:80,zh:'★★ part 2：Prim（数组版优先队列）—— 同样 37。'},
           {line:90,zh:'★ part 3：断言 total_k == total_p == 37；边数 = V−1 = 8。'},
           {line:32,zh:'`dsu_link`：按秩合并（19.3 的 LINK 直译）。'}]},
    tests:[{in:'Kruskal（Figure 21.1）',out:'(g,h)1 (c,i)2 (f,g)2 (a,b)4 (c,f)4 (c,d)7 (a,h)8 (d,e)9 → 37'},
           {in:'Prim 从 a',out:'(a,b)4 (b,c)8 (c,i)2 (c,f)4 (f,g)2 (g,h)1 (c,d)7 (d,e)9 → 37'},
           {in:'边数',out:'两算法各 V−1 = 8 条'}],
    mapping:[{pc:6,pcCode:'if FIND-SET(u) ≠ FIND-SET(v)',c:'`if (ru != rv)`（第 58 行）'},
             {pc:6,pcCode:'u = EXTRACT-MIN(Q)',c:'`for (int i = 0; i < V; i++) { if (!in_mst_prim[i] && (u < 0 || key[i] < key[u])) { u = i; } }`（第 84 行）'}]},
   {type:'analyze',title:'一本账：复杂度对照',claims:[
     {expr:'O(E \\lg V)',when:'Kruskal（排序 + 并查集）与 Prim（二叉堆）',page:594,source:'book'},
     {expr:'O(E + V \\lg V)',when:'Prim 用斐波那契堆',page:597,source:'book'},
     {expr:'O(E \\alpha(V))',when:'Kruskal 中并查集操作的总代价',page:594,source:'book'},
    ],tables:[{caption:'两个算法的全景对照（C 程序实测）',rows:[
      ['','Kruskal','Prim'],
      ['视角','边排序 + 判环（森林合并）','单树生长（每轮挑轻边）'],
      ['核心数据结构','排序 + 并查集','最小优先队列'],
      ['二叉堆','—','O(E lg V)'],
      ['斐波那契堆','—','O(E + V lg V)'],
      ['本程序实现','排序插入 + 简单 DSU','数组线性找最小 O(V²)'],
      ['Figure 21.1 结果','37','37'],
     ]},{caption:'稠密图与稀疏图的选择',rows:[
      ['图','更优算法','理由'],
      ['稠密（E ≈ V²）','Prim + 斐波那契堆','O(E + V lg V) ≈ O(V²)'],
      ['稀疏（E ≈ V）','两者皆 O(V lg V)','Kruskal 排序开销小、实现简单'],
     ]}],chart:{xMax:1000000,series:[
     {name:'Kruskal ≈ E lg V',expr:'n * Math.log2(n)',color:'--viz-done'},
     {name:'Prim(斐波那契) ≈ E + V lg V',expr:'n + Math.log2(n) * n / 8',color:'--viz-compare'}]},
    derivations:[{kind:'summation',title:'Kruskal 时间的推算链',steps:[
      {zh:'排序 $O(E \\lg E)$；$|E| < |V|^2 \\Rightarrow \\lg E = O(\\lg V)$。'},
      {zh:'并查集操作至多 $2E$ 次，共 $O(E\\,\\alpha(V))$，而 $\\alpha(V) = O(\\lg V)$。'},
      {tex:'O(E \\lg E) + O(E\\,\\alpha(V)) = O(E \\lg V)',zh:'★ 原书 p.594 的两步推算；C 程序 part 1 的排序用插入排序（教学版），真实实现用 O(E lg E) 通用排序。'}]},
     ],
    note:''},
   {type:'prove',title:'两个算法的正确性都归到切割性质',statement:'Kruskal9s algorithm finds a safe edge to add to the growing forest by finding, of all the edges that connect any two trees in the forest, an edge (u,v) with the lowest weight.',page:592,
    intro:'★ 21.1 的定理 21.1 是总开关；两个算法各自提供"切割 + 轻边"。',
    steps:[
     {title:'Kruskal 的安全边',en:'To combine trees, Kruskal9s algorithm calls the UNION procedure.',page:593,
      body:['考察边 $(u,v)$ 时，设 $u$ 所在树为 $C_1$、$v$ 所在树为 $C_2$（并查集判出不同集合）。',
        '取切割 $(C_1, V - C_1)$：它尊重当前的 $A$（$A$ 的边都在各树内部）。$(u,v)$ 是横跨该切割的**最轻**边（排序保证更轻的横跨边早已考察并被接受或成环跳过）。',
        '→ $(u,v)$ 是轻边 → 定理 21.1 → 安全。∎']},
     {title:'Prim 的安全边',en:'The running time of Prim9s algorithm depends on the specific implementation of the min-priority queue Q.',page:597,
      body:['每轮 EXTRACT-MIN 取出的 $u$：切割 =（已入树 | 队列 Q）。',
        '$key[u]$ 是横跨该切割的最小权 → $(u.\\pi, u)$ 是轻边 → 安全（定理 21.1）。',
        '★ 松弛（第 8–9 行）维持 key 的定义：Q 中每个结点的 key 始终是它连回树的**最轻**边权。∎']},
     {title:'终止与总账',en:'is O(E lg E). Observing that |E| < |V| 2 , we have lg |E| = O(lg V) , and so we can restate the running time of Kruskal9s algorithm as O(E lg V) .',page:594,
      body:['两算法都恰好加入 $V-1$ 条边（C 程序断言 cnt == 8）。',
        '每条边安全 → 不变量保持 → 终止时 $A$ 是 MST。',
        '★ 两种"找轻边"的方式给出权重相同的树（37）：MST 总权重唯一。∎']},
    ],conclusion:'★ 结论：Kruskal/Prim = 定理 21.1 + 各自的数据结构；复杂度差异完全来自"找轻边"的方式。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'Kruskal 判"成环"用什么数据结构？',options:['邻接矩阵','**并查集（不相交集合）**','优先队列','栈'],answer:1,
      why:'★ FIND-SET(u) == FIND-SET(v) 说明 u、v 已连通，再加边即成环（19 章的应用）。'},
     {kind:'single',q:'Prim 的 key[v] 存什么？',options:['v 到源点的距离','**v 连回当前树的最轻边权**','v 的度数','子树大小'],answer:1,
      why:'★ 每轮 EXTRACT-MIN 选出的就是横跨切口的轻边。'},
     {kind:'judge',q:'Kruskal 运行过程中维护的始终是一棵树。',answer:false,
      why:'★ Kruskal 维护森林（多棵树逐步合并）；Prim 才是单树生长。'},
     {kind:'judge',q:'Prim 用斐波那契堆可达到 O(E + V lg V)。',answer:true,
      why:'★ 原书 p.597：优先队列实现决定 Prim 的时间。'},
     {kind:'simulate',q:'Figure 21.1 的 MST 总权重是多少？（填数字）',expect:[37],placeholder:'例如：36',
      why:'37（原书答案；C 程序两算法实测一致）。'},
     {kind:'simulate',q:'MST 有多少条边？（9 个顶点，填数字）',expect:[8],placeholder:'例如：9',
      why:'V − 1 = 8（C 程序断言 cnt_k == 8）。'},
    ],bookExercises:[
     {id:'21.2-1',page:598,star:0,statement:'Kruskal and Prim both run on the graph of Figure 21.1... ',hint:'照 C 程序的输出顺序手工画：Kruskal 按权重队列；Prim 从 a 生长并标 key 值。'},
     {id:'21.2-2',page:598,star:0,statement:'Suppose that all edge weights in a graph are integers in the range from 1 to |V|. How fast can you make Kruskal9s algorithm run? What if the edge weights are integers in the range from 1 to W for some constant W ?',hint:'权重范围小 → 计数排序 O(V + E) 完成排序，Kruskal 降到 O(E α(V))；W 为常数同理。'},
     {id:'21.2-3',page:598,star:0,statement:'Show that Prim9s algorithm run... ',hint:'给每条边随机加一个微小扰动打破并列 → MST 唯一（用"权重向量字典序"重排）；再论证扰动后的 MST 就是原权重的某个 MST，随机化保证每次运行等价于任意选一种并列处理。'},
     {id:'21.2-4',page:598,star:0,statement:'Argue that if all edges in G have distinct weights... ',hint:'唯一 MST：假设两棵不同的 MST，取两者并集中互异的轻边做交换论证 —— 它必然更轻/更重产生矛盾。这也解释了"并列权重是 MST 不唯一的唯一原因"。'},
    ]},
  ],
};
