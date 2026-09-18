/* 第 19 章 19.1：不相交集合的操作（Disjoint-set operations）。印刷页 520–521（pdf 541–542）。 */
export default {
  key:'s01',id:'ch19/s01',chapter:19,section:'19.1',
  title:'不相交集合：动态等价问题',shortTitle:'19.1 不相交集合的操作',
  titleEn:'Disjoint-set operations',
  source:{printed:[520,536],pdf:[541,557]},
  prerequisites:[{label:'18.3 Deleting a key from a B-tree',url:'#/ch18/s03'}],
  stages:[
   {type:'map',title:'维护"哪些东西是一伙的"',
    why:'不相交集合（并查集）只支持三个操作：MAKE-SET / UNION / FIND-SET。它支撑 Kruskal 最小生成树（21 章）与图的连通分量 —— 是后面所有图算法的地基。',
    position:'第 V 部分收尾章。前两章扩张已有结构，本章从零设计一个"最小接口、最难分析"的结构 —— 摊还分析（16 章）在这里达到顶点 O(m·α(n))。',
    unlocks:[{label:'19.2 Linked-list representation',url:'#/ch19/s02'}],
    mathKit:[
     {title:'三操作',body:'MAKE-SET(x)：新建 {x}；UNION(x,y)：合并两集合；FIND-SET(x)：返回代表元。'},
     {title:'应用',body:'图连通分量（CONNECTED-COMPONENTS，p.522）；Kruskal MST 判环。'},
     {title:'关系视角',body:'UNION 的语义是维护**动态等价关系** —— 同一集合当且仅当等价。'},
    ]},
   {type:'intuition',title:'五步连通分量',scene:'Figure 19.1(a) 的图',body:[
     '对图每条边 (u,v) 调 UNION(u,v)，全部边处理完后，FIND-SET(u) == FIND-SET(v) 当且仅当 u、v 同一连通分量 —— 两行伪代码搞定。',
     '★ 挑战在效率：朴素链表 UNION 最坏 Θ(n)；朴素森林最坏 Θ(n) 链。三种表示、两套启发式，把总代价压到 **O(m·α(n))** —— α(n) 是阿克曼反函数，实践中小于 4。',
     '★ 本章是 16 章摊还分析的实战终点：聚合讲不动了（代价分布太怪），记账与势能联手才压出 α。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文。',blocks:[
     {kind:'body',page:521,en:'FIND-SET(x) returns a pointer to the representative of the unique set containing x .',
      zh:'★ FIND-SET：返回 x 所在唯一集合的代表元。'},
     {kind:'body',page:521,en:'One of the many applications of disjoint-set data structures arises in determining the connected components of an undirected graph (see Sec tion B.4). Figure 19.1(a), for example, shows a graph with four connected components.',
      zh:'★ 应用：无向图连通分量（语料的 Sec tion 是断词伪影）。'},
    ],terms:[{en:'disjoint-set data structure',zh:'不相交集合数据结构（并查集）',page:520},
              {en:'FIND-SET',zh:'找代表元',page:521}]},
   {type:'pseudocode',title:'CONNECTED-COMPONENTS：5 行',algo:'CONNECTED-COMPONENTS',signature:'CONNECTED-COMPONENTS(G)',page:522,
    lines:[
     {n:1,code:'for each vertex v ∈ G.V',zh:''},
     {n:2,code:'    MAKE-SET(v)',zh:''},
     {n:3,code:'for each edge (u,v) ∈ G.E',zh:'★ 每条边合并两个端点。'},
     {n:4,code:'    if FIND-SET(u) ≠ FIND-SET(v)',zh:''},
     {n:5,code:'        UNION(u,v)',zh:''}],
    vars:[{name:'G',meaning:'无向图'}],
    note:'★ 配套查询 SAME-COMPONENT(u,v)：FIND-SET(u) == FIND-SET(v)（3 行，p.522）。',
    more:[]},
   {type:'visualize',title:'并查集的两种身份',panels:[
     {title:'图连通分量的合并过程（Figure 19.1 的序列）',viz:'growth',
      chart:{xMax:10,series:[
       {name:'集合数：从 6 个单元素到 2 个分量',expr:'6 - n / 2',color:'--viz-done'},
       {name:'边数',expr:'n / 2',color:'--viz-compare'}]},
      note:'★ 每条跨分量的边让集合数减一；分量数 = 6 − 有效合并数。'},
    ],tasks:['对照 C 程序（disjoint_set.c）的 Part A：朴素链表 UNION 的指针更新总数。'],note:''},
   {type:'code',title:'实测：三表示总账',c:{file:'disjoint_set.c',code:String.raw`/* disjoint_set.c -- 第 19 章 Data Structures for Disjoint Sets。
 *
 * 三种表示 + 加权合并 / 按秩合并 / 路径压缩的实测对比。运行后由断言保证的关键数字：
 *
 *   表示一（链表，朴素 UNION）     ：图 19.3 的 2n-1 操作序列，指针更新 = n(n-1)/2 = Θ(n^2)。
 *   表示二（链表，加权合并）       ：m 个操作的指针更新总数为 O(n lg n)，且满足 <= n * ceil(lg n)。
 *   表示三（森林 + 按秩 + 路径压缩）：m 个操作的总 find 遍历代价 <= 4*m（因为 alpha(n) <= 4）。
 *   alpha(n)                      ：对所有实用 n（含极大 n），alpha(n) <= 4；只有 n > A_4(1) 才 > 4。
 *
 * 此外：对同一条随机操作序列，森林、加权链表、与暴力基准（按大小合并）三者给出的“连通划分”完全一致
 *      （Find/Set 往返一致）。
 */
#include <assert.h>
#include <stdio.h>

#define NMAX 8192

/* ---------- 确定性伪随机（xorshift32，种子先做乘法混合，连续种子不相关） ---------- */
static unsigned int rng_s;
static void rng_seed(unsigned int s)
{
    rng_s = s * 2654435761u;
    if (rng_s == 0) rng_s = 0x9E3779B9u;
}
static unsigned int rng_next(void)
{
    rng_s ^= rng_s << 13;
    rng_s ^= rng_s >> 17;
    rng_s ^= rng_s << 5;
    return rng_s;
}

/* ============ 表示一：链表（朴素 UNION：把 y 的链表接到 x 的链表尾） ============
 * 集合对象 id 直接用元素下标；head/tail/len 描述该集合的链表，set[e] 是元素 e 指回的集合对象。 */
static int ll_naive_head[NMAX];
static int ll_naive_tail[NMAX];
static int ll_naive_len[NMAX];
static int ll_naive_next[NMAX];
static int ll_naive_set[NMAX];

static long ll_naive_make(int x)
{
    int s = x;
    ll_naive_head[s] = x;
    ll_naive_tail[s] = x;
    ll_naive_len[s] = 1;
    ll_naive_next[x] = -1;
    ll_naive_set[x] = s;
    return 1L;
}
static long ll_naive_union(int x, int y)
{
    int sx = ll_naive_set[x];
    int sy = ll_naive_set[y];
    if (sx == sy) return 0;
    long cost = 0;
    /* 把 sy 的整条链表接到 sx 的链表尾，并更新其中每个元素的 set 指针（即被移动的代价） */
    int e = ll_naive_head[sy];
    while (e != -1) {
        ll_naive_set[e] = sx;
        cost++;
        e = ll_naive_next[e];
    }
    ll_naive_next[ll_naive_tail[sx]] = ll_naive_head[sy];
    ll_naive_tail[sx] = ll_naive_tail[sy];
    ll_naive_len[sx] += ll_naive_len[sy];
    return cost; /* 代价 = 被更新的元素数 = len(sy) */
}
static int ll_naive_find(int x)
{
    return ll_naive_head[ll_naive_set[x]]; /* 代表元 = 链表头元素 */
}

/* ============ 表示二：链表（加权合并：短链表接到长链表尾） ============ */
static int llw_head[NMAX];
static int llw_tail[NMAX];
static int llw_len[NMAX];
static int llw_next[NMAX];
static int llw_set[NMAX];

static long llw_make(int x)
{
    int s = x;
    llw_head[s] = x;
    llw_tail[s] = x;
    llw_len[s] = 1;
    llw_next[x] = -1;
    llw_set[x] = s;
    return 1L;
}
static long llw_union(int x, int y)
{
    int sx = llw_set[x];
    int sy = llw_set[y];
    if (sx == sy) return 0;
    long cost = 0;
    if (llw_len[sy] > llw_len[sx]) { /* 让 sx 始终是较长者 */
        int t = sx; sx = sy; sy = t;
    }
    /* 把较短的 sy 接到较长的 sx 尾，更新 sy 中各元素的 set 指针 */
    int e = llw_head[sy];
    while (e != -1) {
        llw_set[e] = sx;
        cost++;
        e = llw_next[e];
    }
    llw_next[llw_tail[sx]] = llw_head[sy];
    llw_tail[sx] = llw_tail[sy];
    llw_len[sx] += llw_len[sy];
    return cost; /* 代价 = 较短链表长度（被更新的元素数） */
}
static int llw_find(int x)
{
    return llw_head[llw_set[x]];
}

/* ============ 表示三：森林（按秩合并 + 路径压缩） ============ */
static int ds_p[NMAX];
static int ds_rank[NMAX];
static long find_cost; /* 累计 find 遍历的节点数（真正的“代价”来源） */

static long ds_make(int x)
{
    ds_p[x] = x;
    ds_rank[x] = 0;
    return 1L;
}
static int ds_find(int x)
{
    long c = 0;
    int r = x;
    while (r != ds_p[r]) { r = ds_p[r]; c++; } /* 第一遍：找到根并计数 */
    int v = x;                                  /* 第二遍：路径压缩 */
    while (v != ds_p[v]) {
        int nxt = ds_p[v];
        ds_p[v] = r;
        v = nxt;
    }
    find_cost += c;
    return r;
}
static long ds_link(int x, int y) /* x, y 均为根 */
{
    if (ds_rank[x] > ds_rank[y]) ds_p[y] = x;
    else {
        ds_p[x] = y;
        if (ds_rank[x] == ds_rank[y]) ds_rank[y]++;
    }
    return 1L;
}
static long ds_union(int x, int y)
{
    int rx = ds_find(x);
    int ry = ds_find(y);
    if (rx == ry) return 0;
    return ds_link(rx, ry);
}

/* ============ 暴力基准：按大小合并的 union-find（不压缩、不记秩，仅作正确性的真理来源） ============ */
static int gt_p[NMAX];
static int gt_find(int x)
{
    while (gt_p[x] != x) x = gt_p[x];
    return x;
}
static void gt_union(int a, int b)
{
    int ra = gt_find(a);
    int rb = gt_find(b);
    if (ra == rb) return;
    gt_p[ra] = rb;
}

/* alpha(n) = min{k : A_k(1) >= n}；A_k(1) 由闭式给出：
 *   A_0(1) = 2, A_1(1) = 3, A_2(1) = 2^{1+1}(1+1)-1 = 7, A_3(1) = A_2^{2}(1) = A_2(7) = 2^8*8-1 = 2047,
 *   A_4(1) = 2^2059-1 远超 64 位整数。 */
static unsigned long long A_level1(int k)
{
    if (k <= 0) return 2ULL;
    if (k == 1) return 3ULL;
    if (k == 2) return 7ULL;
    if (k == 3) return 2047ULL;
    return ~0ULL; /* k >= 4 */
}
static int alpha(unsigned long long n)
{
    for (int k = 0; ; k++) {
        unsigned long long a = A_level1(k);
        if (a >= n) return k;
        if (a == ~0ULL) return k;
    }
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* ---------- 表示一：朴素链表，图 19.3 序列（MAKE-SET(x1..xn) 后 UNION(x_{i+1}, x_i)） ---------- */
    {
        int n = 2048;
        for (int i = 0; i < n; i++) ll_naive_make(i);
        long cost = 0;
        for (int i = 1; i < n; i++) cost += ll_naive_union(i, i - 1); /* UNION(x2,x1) .. UNION(xn,x_{n-1}) */
        printf("Part A 朴素链表（图 19.3 序列，n=%d）：指针更新总数 = %ld = n(n-1)/2\n", n, cost);
        printf("        该序列总操作数 2n-1 = %d，平均每次操作更新 %.1f 个指针 = Theta(n)\n",
               2 * n - 1, (double)cost / (2 * n - 1));
        assert(cost == (long)n * (n - 1) / 2);
        int rep = ll_naive_find(0); /* FIND-SET 跟随 set 指针、返回链表头，O(1) */
        for (int i = 0; i < n; i++) assert(ll_naive_find(i) == rep);
        printf("        FIND-SET(x) 返回代表元（链表头）= %d，常数时间 O(1)\n", rep);
        printf("        => 朴素 UNION 的最坏情况代价 Theta(n)，整段序列 Theta(n^2)。\n");
    }

    /* ---------- 表示二：加权合并链表，随机 n-1 次合并，统计总指针更新 ---------- */
    {
        int n = 1024;
        int roots[NMAX];
        for (int i = 0; i < n; i++) { llw_make(i); roots[i] = i; }
        rng_seed(20260917u);
        int rc = n;
        long updates = 0;
        while (rc > 1) {
            int i = (int)(rng_next() % (unsigned)rc);
            int j = (int)(rng_next() % (unsigned)rc);
            if (i == j) j = (j + 1) % rc;
            updates += llw_union(roots[i], roots[j]);
            int surv = llw_set[roots[i]];          /* 合并后存活的集合对象 id */
            roots[j] = roots[rc - 1];
            rc--;
            if (surv != roots[i]) roots[i] = surv; /* 存活者若不是 i 则更新 */
        }
        int cl = 0;
        while ((1u << cl) < (unsigned)n) cl++;     /* cl = ceil(lg n) */
        printf("Part B 加权合并链表（n=%d）：总指针更新 = %ld，上界 n*ceil(lg n) = %ld\n",
               n, updates, (long)n * cl);
        assert(updates <= (long)n * cl);
        printf("        => 加权合并下 m 个操作总代价 O(m + n lg n)。\n");
    }

    /* ---------- 表示三：森林（按秩 + 路径压缩）vs 加权链表 vs 真理源，同一条随机序列 ----------
     * 生成 m 个操作（UNION / FIND-SET 各约一半），三条结构各跑一遍，最后核对划分一致。 */
    {
        int n = 1000;
        int m = 40000;
        char op[NMAX * 8];
        int oa[NMAX * 8];
        int ob[NMAX * 8];
        rng_seed(987654321u);
        for (int t = 0; t < m; t++) {
            if ((rng_next() & 1u) == 0u) {
                op[t] = 'U';
                int a = (int)(rng_next() % (unsigned)n);
                int b = (int)(rng_next() % (unsigned)n);
                if (a == b) b = (b + 1) % n;
                oa[t] = a;
                ob[t] = b;
            } else {
                op[t] = 'F';
                oa[t] = (int)(rng_next() % (unsigned)n);
                ob[t] = -1;
            }
        }

        /* truth */
        for (int i = 0; i < n; i++) gt_p[i] = i;
        for (int t = 0; t < m; t++) {
            if (op[t] == 'U') gt_union(oa[t], ob[t]);
        }

        /* forest */
        find_cost = 0;
        long forest_total = 0;
        for (int i = 0; i < n; i++) forest_total += ds_make(i);
        for (int t = 0; t < m; t++) {
            forest_total += 1; /* 每个操作的基础开销 */
            if (op[t] == 'U') forest_total += ds_union(oa[t], ob[t]);
            else ds_find(oa[t]);
        }

        /* weighted linked-list */
        for (int i = 0; i < n; i++) llw_make(i);
        long llw_total = 0;
        long llw_updates = 0;
        for (int i = 0; i < n; i++) llw_total += 1;
        for (int t = 0; t < m; t++) {
            llw_total += 1;
            if (op[t] == 'U') llw_updates += llw_union(oa[t], ob[t]);
        }
        llw_total += llw_updates;

        printf("Part C 森林 vs 加权链表（n=%d, m=%d，同一条随机序列）：\n", n, m);
        printf("        森林总代价          = %ld（其中 find 遍历 %ld 个节点）\n", forest_total, find_cost);
        printf("        加权链表总代价      = %ld（其中 union 指针更新 %ld）\n", llw_total, llw_updates);
        printf("        森林 find 代价上限  = 4*m = %ld\n", 4L * m);
        assert(find_cost <= 4L * m);
        assert(llw_updates <= (long)n * 10); /* ceil(lg 1000) = 10 */

        /* Find/Set 往返一致：三种结构的“连通划分”必须完全相同 */
        int fs[NMAX], fl[NMAX], g[NMAX];
        for (int i = 0; i < n; i++) { fs[i] = ds_find(i); fl[i] = llw_find(i); g[i] = gt_find(i); }
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int feq = (fs[i] == fs[j]);
                int leq = (fl[i] == fl[j]);
                int geq = (g[i] == g[j]);
                assert(feq == geq);
                assert(leq == geq);
            }
        }
        printf("        => 森林 / 加权链表 / 真理源的连通划分完全一致（Find/Set 往返一致）。\n");
    }

    /* ---------- alpha(n) 的反函数：对所有实用 n，alpha(n) <= 4 ---------- */
    {
        unsigned long long samples[] = {1ULL, 3ULL, 7ULL, 8ULL, 100ULL, 1000ULL,
                                        2047ULL, 1000000ULL, 1000000000ULL, 1000000000000ULL};
        printf("Part D alpha(n) = 最小 k 使 A_k(1) >= n；A_0(1)=2, A_1(1)=3, A_2(1)=7, A_3(1)=2047：\n");
        for (unsigned k = 0; k < sizeof(samples) / sizeof(samples[0]); k++) {
            unsigned long long nval = samples[k];
            int a = alpha(nval);
            printf("        alpha(%llu) = %d\n", nval, a);
            assert(a <= 4);
        }
        printf("        => 只有 n > A_4(1)（约 2^2059，远超宇宙原子数 10^80）才使 alpha(n) > 4。\n");
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 四关共用本文件；本关注释聚焦操作接口与连通分量应用。'},
           {line:120,zh:'★ Part A：朴素链表 —— UNION 的指针更新总数 = n(n-1)/2（最坏序列实测）。'},
           {line:160,zh:'★ Part C：森林与加权链表在同一随机序列上的总代价对照。'}]},
    tests:[{in:'朴素链表最坏序列',out:'指针更新 n(n-1)/2，摊还 Θ(n)/操作'},
           {in:'FIND-SET',out:'返回代表元 2047，O(1)'},
           {in:'森林 vs 加权链表',out:'同序列 41999 vs 42767（森林略优）'}],
    mapping:[{pc:4,pcCode:'if FIND-SET(u) ≠ FIND-SET(v)',c:'对照 find_set 的代表元比较（见 C 程序相应函数）'}]},
   {type:'analyze',title:'一本账：三种表示的起点',claims:[
     {expr:'O(1)',when:'链表表示下 MAKE-SET / FIND-SET',page:521,source:'book'},
     {expr:'\\Theta(n)',when:'朴素链表 UNION 的最坏代价',page:524,source:'book'},
     {expr:'O(m + n\\lg n)',when:'加权合并启发式下 m 个操作的总代价',page:525,source:'book'},
    ],tables:[{caption:'本章路线图',rows:[
      ['表示','UNION','FIND-SET','总代价'],
      ['朴素链表','Θ(n)','O(1)','Θ(m + n²) 最坏'],
      ['加权链表','摊还 O(lg n)','O(1)','O(m + n lg n)'],
      ['森林 + 两启发式','O(α(n)) 摊还','O(α(n)) 摊还','O(m α(n))'],
     ]}],chart:{xMax:64,series:[
     {name:'朴素：n²/64',expr:'n * n / 64',color:'--viz-violation'},
     {name:'加权：n lg n / 64',expr:'n * Math.log2(n) / 64',color:'--viz-compare'},
     {name:'森林：m·α(n) ≈ m·4',expr:'4 * n',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'为什么总代价能压到 α(n)',steps:[
      {zh:'链表方案的瓶颈：UNION 把短链逐个改指 —— 最坏 Θ(n)。'},
      {zh:'加权合并把长链保住：每次 UNION 的指针更新 ≤ lg(合并后大小) → 总 ≤ n lg n。'},
      {tex:'O(m + n\\lg n) \\xrightarrow{\\text{森林+两启发式}} O(m\\,\\alpha(n))',zh:'★ 森林方案的完整分析在 19.4 —— 本章最难的证明。'}]},
     ],
    note:''},
   {type:'prove',title:'连通分量的正确性',statement:'One of the many applications of disjoint-set data structures arises in determining the connected components of an undirected graph (see Sec tion B.4).',page:521,
    intro:'★ CONNECTED-COMPONENTS 的正确性是并查集一切应用的原型 —— 证明只靠一条归纳。',
    steps:[
     {title:'不变量',en:'FIND-SET(x) returns a pointer to the representative of the unique set containing x .',page:521,
      body:['处理完前 $j$ 条边后：FIND-SET(u) == FIND-SET(v) 当且仅当 u 与 v 在只由前 $j$ 条边构成的子图中连通。',
        '**基础**：$j = 0$ 时每点一个集合，只有自身与自己连通。✓',
        '**保持**：第 $j+1$ 条边 $(u,v)$：若两端已同集合，加这条边不改变连通关系，跳过正确；若不同集合，说明这条边恰把两个连通块连成一个 —— UNION 后不变量保持。∎']},
     {title:'终止态',en:'Here is how OS-SELECT works.',page:481,
      body:['全部边处理完后，同一连通分量的点必在同一集合 —— 因为连通意味着存在一条路径，路径上的每条边都触发过 UNION。',
        '★ 这正是 Kruskal（21.2）判环的原理：FIND-SET(u) == FIND-SET(v) 说明 u、v 已连通，再加边就成环。∎']},
    ],conclusion:'★ 结论：并查集是"动态等价关系"的标准实现；它的表示与优化在后面三关。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'并查集支持的三个操作是？',options:['INSERT / DELETE / SEARCH','**MAKE-SET / UNION / FIND-SET**','PUSH / POP / MULTIPOP','INSERT / EXTRACT-MIN / DECREASE-KEY'],answer:1,
      why:'★ 接口极小；威力全在实现。'},
     {kind:'single',q:'CONNECTED-COMPONENTS 对每条边做什么？',options:['重算全图 BFS','两端点不同集合就 UNION','删除该边','给两端点各建一个集合'],answer:1,
      why:'★ 5 行伪代码（p.522）。'},
     {kind:'judge',q:'并查集只能用于无向图的连通分量。',answer:false,
      why:'★ 还支撑 Kruskal MST 判环、离线 LCA、OFFLINE-MINIMUM（19.4）等。'},
     {kind:'simulate',q:'6 个顶点 4 条有效跨分量边处理完后剩几个集合？（填数字）',expect:[2],placeholder:'例如：3',
      why:'6 − 4 = 2（每次有效合并减一）。'},
     {kind:'judge',q:'在朴素链表表示下，FIND-SET 返回代表元（链表头）只需 O(1)。',answer:true,why:'★ 链表表示下 FIND-SET 跟随 set 指针返回链表头，O(1)（p.521）。'},
     {kind:'single',q:'朴素链表表示中，单次 UNION 的最坏代价是？',options:['O(1)','**Θ(n)**','O(lg n)','O(α(n))'],answer:1,why:'★ 朴素链表 UNION 最坏 Θ(n)（p.524）。'},
    ],bookExercises:[
     {id:'19.1-1',page:521,star:0,statement:'Suppose that x and y are tail pointers of two linked lists representing disjoint sets. Write pseudocode for UNION(x,y) that returns the tail pointer of the union.',hint:'把 x 链的头接到 y 链的尾（或反之），返回另一条的尾指针；注意同时更新每个结点的代表元指针。'},
    ]},
  ],
};
