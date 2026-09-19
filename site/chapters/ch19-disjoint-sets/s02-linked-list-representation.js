/* 第 19 章 19.2：不相交集合的链表表示（Linked-list representation）。印刷页 521–524（pdf 542–545）。 */
export default {
  key:'s02',id:'ch19/s02',chapter:19,section:'19.2',
  title:'链表表示与加权合并',shortTitle:'19.2 链表表示',
  titleEn:'Linked-list representation of disjoint sets',
  source: { printed: [523, 526], pdf: [544, 548] },
  prerequisites:[{label:'19.1 Disjoint-set operations',url:'#/ch19/s01'}],
  stages:[
   {type:'map',title:'最直观的表示与它的代价',
    why:'每个集合一条**单向链表**：头是代表元，每结点带一个指向头部的指针（FIND-SET 变 O(1)）。但朴素 UNION 最坏 Θ(n) —— 19.2 的核心是**加权合并启发式**把它压到 O(m + n lg n)。',
    position:'从"能做"到"做得快"的第一步。19.3 的森林表示会用**两个**启发式做得更好。',
    unlocks:[{label:'19.3 Disjoint-set forests',url:'#/ch19/s03'}],
    mathKit:[
     {title:'朴素 UNION',body:'把 y 链逐个改指到 x 链头：最坏 Θ(n)（Figure 19.2 的最坏序列）。'},
     {title:'加权合并',body:'**短链并入长链**：代价 ≤ lg(合并后大小)。'},
     {title:'总账',body:'m 个操作、n 个 MAKE-SET：$O(m + n \\lg n)$ —— lg 项来自"每个对象最多被搬 lg n 次"。'},
    ]},
   {type:'intuition',title:'Figure 19.2 的最坏序列',scene:'n = 2048（C 程序 Part A）',body:[
     '构造：MAKE-SET 1..n，然后 UNION(1,2)、UNION(2,3)、……每次把刚建好的长链当 y 传进去 —— 朴素 UNION 每次都把长链逐个改指，总指针更新 **n(n−1)/2**（C 程序 Part A 实测 2 096 128）。',
     '★ **加权合并**：UNION(x,y) 时比较两条链的长度，把**短的**挂到**长的**后面。每个对象从创建起最多被搬 lg n 次（每次它所在链至少翻倍）→ 总指针更新 ≤ n lg n。',
     '★ C 程序 Part B：n=1024 时总更新 3512，远小于上界 10240。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文。',blocks:[
     {kind:'body',page:525,en:'With this simple weighted-union heuristic, a single UNION operation can still take',
      zh:'★ 加权合并后单次 UNION 仍可能 Θ(n)（后半句接 Ω(n) time）—— 但总账被压住。'},
     {kind:'body',page:525,en:'Using the linked-list representation of disjoint sets and the weighted-union heuristic, a sequence of m MAKE-SET, UNION , and FIND-SET operations, n of which are MAKE-SET operations, takes O(m + n lg n) time.',
      zh:'★★ 本关的定理：O(m + n lg n)。'},
    ],terms:[{en:'weighted-union heuristic',zh:'加权合并启发式',page:525}]},
   {type:'pseudocode',title:'加权 UNION 的账',algo:'WEIGHTED-UNION',signature:'加权合并启发式（原书 p.525，本站整理）',page:525,
    lines:[
     {n:1,code:'UNION(x, y):',zh:''},
     {n:2,code:'    if |list(FIND-SET(x))| >= |list(FIND-SET(y))|',zh:'★ 长链做底。'},
     {n:3,code:'        把 y 链逐结点改指到 x 的代表元，接在 x 链尾',zh:'代价 = |y 链|。'},
     {n:4,code:'    else 对称地把 x 链挂到 y 链',zh:''},
     {n:5,code:'每次 UNION 的指针更新 <= lg(合并后链长)',zh:'★★ 因为短链的每个成员所在链长至少翻倍。'}],
    vars:[{name:'|list|',meaning:'链长（需在链头额外存长度）'}],
    note:'★ FIND-SET 仍是 O(1)：每结点直接带指向代表元的指针。',
    more:[]},
   {type:'visualize',title:'两种 UNION 的天壤之别',panels:[
     {title:'朴素 vs 加权（C 程序 Part A/B 实测）',viz:'growth',
      chart:{xMax:2100,series:[
       {name:'朴素：n(n-1)/2 ≈ 2×10⁶',expr:'n * n / 2',color:'--viz-violation'},
       {name:'加权：n lg n 上界 ≈ 10240',expr:'n * Math.log2(n)',color:'--viz-done'}]},
      note:'★ 同样的操作序列，差 200 倍 —— 一个启发式的力量。'},
    ],tasks:['对照 C 程序 Part A（2096128 = n(n-1)/2）与 Part B（3512）。'],note:''},
   {type:'code',title:'实测：2096128 vs 3512',c:{file:'disjoint_set.c',code:String.raw`/* disjoint_set.c -- 第 19 章 Data Structures for Disjoint Sets。
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
    notes:[{line:1,zh:'★ 四关共用本文件；本关注释聚焦链表两种 UNION。'},
           {line:51,zh:'`ll_naive_union`：朴素链表 UNION —— 逐结点改指。'},
           {line:91,zh:'`llw_union`：加权合并 —— 短链并入长链。'},
           {line:204,zh:'★★ Part A：最坏序列总更新 = n(n-1)/2 = 2096128（Θ(n²)）。'},
           {line:234,zh:'★★ Part B：加权合并总更新 3512 < n·lg n 上界 10240。'}]},
    tests:[{in:'朴素链表最坏序列（n=2048）',out:'指针更新 2096128 = n(n-1)/2'},
           {in:'加权合并（n=1024）',out:'总更新 3512 < n·lg n = 10240'},
           {in:'FIND-SET',out:'O(1) 返回代表元'}],
    mapping:[{pc:2,pcCode:'长链做底',c:'`if (len_a >= len_b)`（第 91 行附近的加权判断）'},
             {pc:3,pcCode:'逐结点改指',c:'`ll_naive_union`（第 51 行）'}]},
   {type:'analyze',title:'一本账：n lg n 从哪来',claims:[
     {expr:'\\Theta(n)',when:'朴素 UNION 的最坏代价（Figure 19.2 序列）',page:525,source:'book'},
     {expr:'\\lg n',when:'加权合并下单个对象至多被搬的次数',page:525,source:'book'},
     {expr:'O(m + n\\lg n)',when:'m 个操作（n 个 MAKE-SET）的总代价',page:525,source:'book'},
    ],tables:[{caption:'C 程序实测对照',rows:[
      ['','朴素（Part A）','加权（Part B）'],
      ['n','2048','1024'],
      ['总指针更新','2096128','3512'],
      ['摊还/操作','≈ 511.9','≈ 3.4'],
      ['随 n 增长','Θ(n)','Θ(lg n)'],
     ]}],chart:{xMax:32,series:[
     {name:'朴素：每对象被搬 Θ(n) 次',expr:'n',color:'--viz-violation'},
     {name:'加权：每对象被搬 ≤ lg n 次',expr:'Math.log2(n)',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'每个对象最多搬 lg n 次',steps:[
      {zh:'对象第一次被搬，是因为它所在的**短链**并入长链：链长至少翻倍。'},
      {zh:'从链长 1 出发，翻倍 lg n 次就达到 n —— 之后它永远在长链一侧，不再被搬。'},
      {tex:'\\sum_{\\text{对象}} \\lg n = n\\lg n',zh:'★ C 程序 Part B 的 3512 < 10240 正是这个上界的实例。'}]},
     ],
    note:''},
   {type:'prove',title:'加权合并的上界',statement:'Using the linked-list representation of disjoint sets and the weighted-union heuristic, a sequence of m MAKE-SET, UNION , and FIND-SET operations, n of which are MAKE-SET operations, takes O(m + n lg n) time.',page:525,
    intro:'★ 证明的钥匙是"按对象记账"：把指针更新摊到被搬的对象头上。',
    steps:[
     {title:'FIND-SET 与 MAKE-SET 的代价',en:'With this linked-list representation, both MAKE-SET and FIND-SET require only O(1) time.',page:523,
      body:['MAKE-SET 建单结点链：$O(1)$；FIND-SET 沿对象自带指针：$O(1)$。',
        '$n$ 个 MAKE-SET 与$m-n$ 个这类操作合计 $O(m)$。剩余代价全在 UNION 的指针更新上。']},
     {title:'指针更新的总量',en:'Each time x ’s pointer is updated, x must have started in the smaller set. The first time x ’s pointer is updated, therefore, the resulting set must have at least 2 members. Similarly, the next time x ’s pointer is updated, the resulting set must have had at least 4 members.',page:526,
      body:['加权合并总是搬**短链**：被搬对象的链长至少翻倍。',
        '每个对象的第 $k$ 次被搬意味着它所在链长 ≥ $2^k$ → 单个对象至多被搬 $\\lfloor \\lg n \\rfloor$ 次。',
        '总指针更新 $\\le n \\lg n$；加 $O(m)$ 的其余代价 → $O(m + n \\lg n)$。∎']},
     {title:'单次 UNION 仍可能 Θ(n)',en:'With this simple weighted-union heuristic, a single UNION operation can still take Ω(n) time if both sets have Ω(n) members.',page:525,
      body:['如果两条链**等长**（都约 n/2），无论怎么并都要搬 n/2 个对象 → 单次 UNION 仍 Ω(n)。',
        '★ 摊还的意义在于总账 —— C 程序 Part B 显示 1024 次操作平均只搬 3.4 次。∎']},
    ],conclusion:'★ 结论：加权合并用"按大小选择"把 Θ(n²) 压到 O(n lg n)；森林表示（19.3）用两个启发式再压一层。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'加权合并启发式的规则是？',options:['随机选择方向','**短链并入长链**','长链并入短链','按键值大小'],answer:1,
      why:'★ 保证被搬对象的链长至少翻倍。'},
     {kind:'single',q:'加权合并下，单个对象至多被搬几次？',options:['1 次','lg n 次','n 次','α(n) 次'],answer:1,
      why:'★ 每搬一次链长至少翻倍 → ≤ lg n 次。'},
     {kind:'judge',q:'加权合并后，单次 UNION 的最坏代价也变成了 O(lg n)。',answer:false,
      why:'★ 两条等长链合并仍要搬一半 —— 单次最坏 Ω(n)；改善的是总账。'},
     {kind:'simulate',q:'朴素链表最坏序列（n=2048）的指针更新总数？（填数字）',expect:[2096128],placeholder:'例如：1048576',
      why:'n(n-1)/2 = 2048×2047/2 = 2096128（C 程序 Part A）。'},
     {kind:'judge',q:'即使采用加权合并，单次 UNION 的最坏代价仍可能达到 Θ(n)。',answer:true,why:'★ 两条等长链合并仍要搬一半 → 单次最坏 Ω(n)；改善的是总账（p.525）。'},
     {kind:'simulate',q:'加权合并链表（n=1024）的总指针更新实测是多少？（填数字）',expect:[3512],placeholder:'例如：5000',why:'★ C 程序 Part B：总更新 3512，远小于上界 n·lg n = 10240。'},
    ],bookExercises:[
     {id:'19.2-1',page:526,star:0,statement:'Write pseudocode for MAKE-SET, FIND-SET, and UNION using the linked-list representation and the weighted-union heuristic. Make sure to specify the attributes that you assume for set objects and list objects.',hint:'环形链表：尾指头后，两链 O(1) 接环；代价被推到 FIND-SET（沿环找代表元）。这是"把代价从一个操作搬到另一个操作"的例子 —— 但搬得不对称，会破坏总账。'},
    ]},
  ],
};
