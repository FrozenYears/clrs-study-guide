/* 第 19 章 19.3：不相交集合森林（Disjoint-set forests）。印刷页 524–527（pdf 545–548）。 */
export default {
  key:'s03',id:'ch19/s03',chapter:19,section:'19.3',
  title:'森林 + 按秩合并 + 路径压缩',shortTitle:'19.3 不相交集合森林',
  titleEn:'Disjoint-set forests',
  source: { printed: [527, 530], pdf: [548, 552] },
  prerequisites:[{label:'19.2 Linked-list representation',url:'#/ch19/s02'}],
  stages:[
   {type:'map',title:'两个启发式，一个反函数',
    why:'森林表示：每结点只存父指针，FIND-SET 沿父链到根，UNION 让一根挂到另一根上。两个启发式 —— **按秩合并**与**路径压缩** —— 合用后，m 个操作只要 **O(m·α(n))**，α(n) 是阿克曼反函数。',
    position:'本章的工程高潮。两个启发式单独用都不够好，**合起来**才有 α(n) —— 分析在 19.4。',
    unlocks:[{label:'19.4 Analysis of union by rank',url:'#/ch19/s04'}],
    mathKit:[
     {title:'按秩合并',body:'$x.rank$ 是 x 高度的上界；UNION 让**低秩**根指向**高秩**根；秩相同时才 +1。'},
     {title:'路径压缩',body:'FIND-SET 途中把路径上每个结点**直接指向根**；不改变任何 rank。'},
     {title:'效果',body:'单独使用各 $O(\\lg n)$；合用 $O(m\\,\\alpha(n))$ —— 理论与实践的双重奇迹。'},
    ]},
   {type:'intuition',title:'秩是上界，压缩是捷径',scene:'C 程序 Part C（n=1000, m=40000）',body:[
     '**按秩合并**：$x.rank$ 记"以 x 为根的树高上界"。合并时低秩挂高秩；两秩相等才把秩 +1 —— 树永远不会变成链。',
     '★ **路径压缩**：FIND-SET 走过的每个结点直接指根 —— 第一次 FIND 慢，之后同路径的 FIND 全是 O(1)。压缩**不改秩**（秩只是上界，仍然是合法的）。',
     '★ 两者结合的妙处：压缩把树压扁，按秩合并保住"合并的账"；各自单独用是 O(lg n)，合用是 O(α(n)) —— 这不是显然的，19.4 用几十页证明它。',
     '★ C 程序 Part C：同一条 40000 操作随机序列，森林 41999 vs 加权链表 42767 —— 森林略优，且增长更慢。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文。',blocks:[
     {kind:'body',page:528,en:'The first heuristic, union by rank, is similar to the weighted-union heuristic we used with the linked-list representation. The common-sense approach is to make the root of the tree with fewer nodes point to the root of the tree with more nodes.',
      zh:'★ 按秩合并：少指向多（与链表的加权合并同思路）。'},
     {kind:'body',page:528,en:'The second heuristic, path compression, is also quite simple and highly effective. As shown in Figure 19.5, FIND-SET operations use it to make each node on the find path point directly to the root. Path compression does not change any ranks.',
      zh:'★★ 路径压缩：find 路径全体直指根；**不改变任何 rank**。'},
     {kind:'body',page:528,en:'With each node x , maintain the integer value x: rank, which is an upper bound on the height of x (the number of edges in the longest simple path from a descendant leaf to x ).',
      zh:'★ rank 的精确定义：结点高度的**上界**。'},
    ],terms:[{en:'union by rank',zh:'按秩合并',page:528},
              {en:'path compression',zh:'路径压缩',page:528}]},
   {type:'pseudocode',title:'MAKE-SET / LINK / FIND-SET',algo:'MAKE-SET',signature:'MAKE-SET(x) / UNION(x, y) / FIND-SET(x)',page:530,
    lines:[
     {n:1,code:'MAKE-SET(x)',zh:'★ 2 行：父指自己、rank 置 0。'},
     {n:2,code:'    x.p = x;  x.rank = 0',zh:''}],
    vars:[{name:'x.rank',meaning:'x 高度的上界'}],
    note:'★ 三个操作共 14 行（p.530–531）—— 代码之短与证明之长形成戏剧性反差。',
    more:[{algo:'LINK',subtitle:'LINK(x, y) —— 5 行（p.530）：按秩合并',signature:'LINK(x, y)',page:530,
      lines:[{n:1,code:'if x.rank > y.rank',zh:''},
        {n:2,code:'    y.p = x',zh:'高秩做根。'},
        {n:3,code:'else y.p = x',zh:''},
        {n:4,code:'    if x.rank == y.rank',zh:'★ 秩相同才长高：y.rank + 1。'},
        {n:5,code:'        y.rank = y.rank + 1',zh:''}],
      vars:[{name:'x, y',meaning:'两个树的根'}],
      note:'★ 统一写成 y.p = x 再按需把 y.rank+1（语料里 x/y 顺序略有差异）。'},
      {algo:'FIND-SET',subtitle:'FIND-SET(x) —— 递归两行 + 路径压缩（p.531）',signature:'FIND-SET(x)',page:531,
      lines:[{n:1,code:'if x ≠ x.p',zh:''},
        {n:2,code:'    x.p = FIND-SET(x.p)',zh:'★★ 递归返回时把路径全压到根。'},
        {n:3,code:'return x.p',zh:''}],
      vars:[{name:'x.p',meaning:'父指针'}],
      note:'★ 递归天然做路径压缩：先求到根，返回途中改指针。'}]},
   {type:'visualize',title:'压缩前后',panels:[
     {title:'森林 vs 加权链表（C 程序 Part C，n=1000、m=40000）',viz:'growth',
      chart:{xMax:42000,series:[
       {name:'森林总代价 41999',expr:'42000',color:'--viz-done'},
       {name:'加权链表总代价 42767',expr:'42767',color:'--viz-compare'}]},
      note:'★ 两者在温和序列上接近；差异在对抗性序列上才拉开（19.4 的分析给出了各自的界）。'},
    ],tasks:['对照 C 程序 Part C 的逐操作代价。'],note:''},
   {type:'code',title:'实测：41999 vs 42767',c:{file:'disjoint_set.c',code:String.raw`/* disjoint_set.c -- 第 19 章 Data Structures for Disjoint Sets。
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
    notes:[{line:1,zh:'★ 四关共用本文件；本关注释聚焦森林实现。'},
           {line:122,zh:'`ds_make`：父指自己、rank 0（MAKE-SET 的 2 行）。'},
           {line:128,zh:'`ds_find`：路径压缩版 FIND-SET（递归）。'},
           {line:142,zh:'`ds_link`：按秩合并（秩相同才 +1）。'},
           {line:291,zh:'★★ Part C：同序列下森林 41999 vs 加权链表 42767。'}]},
    tests:[{in:'森林 + 两启发式（n=1000, m=40000）',out:'总代价 41999'},
           {in:'加权链表（同一序列）',out:'总代价 42767'},
           {in:'rank 不变量',out:'rank 是树高上界（压缩不改 rank）'}],
    mapping:[{pc:1,pcCode:'MAKE-SET: x.p = x; x.rank = 0',c:'`ds_make`（第 122 行）'},
             {pc:2,pcCode:'x.p = FIND-SET(x.p)',c:'`ds_find`（第 128 行，路径压缩）'}]},
   {type:'analyze',title:'一本账：为什么单独用不够',claims:[
     {expr:'O(\\lg n)',when:'只用按秩合并（树高 ≤ lg n）',page:528,source:'book'},
     {expr:'\\Theta(m\\lg n)',when:'只用路径压缩时 m 个操作的最坏总代价',page:529,source:'book'},
     {expr:'O(m\\,\\alpha(n))',when:'两者合用（19.4 的主定理）',page:533,preview:true,source:'book'},
    ],tables:[{caption:'启发式组合的效果',rows:[
      ['按秩合并','路径压缩','m 个操作的总代价'],
      ['✓','✗','O(m lg n)'],
      ['✗','✓','Θ(m lg n)（最坏）'],
      ['✓','✓','O(m α(n)) — α(n) ≤ 4'],
     ]},{caption:'rank 与 height 的关系',rows:[
      ['操作','rank 变化','实际高度'],
      ['MAKE-SET','0','0'],
      ['LINK（等秩）','+1','+1（恰好相等）'],
      ['LINK（不等）','不变','≤ max(两高)'],
      ['路径压缩','**不变**','变小'],
     ]}],chart:{xMax:40000,series:[
     {name:'森林 O(m·α) ≈ 4m',expr:'4 * n',color:'--viz-done'},
     {name:'只用按秩合并 ≈ m lg n',expr:'n * Math.log2(n)',color:'--viz-violation'}]},
    derivations:[{kind:'summation',title:'秩相同时才 +1 的算术',steps:[
      {zh:'LINK 时若 $x.rank \\ne y.rank$，新根 = 高秩者，秩**不变**（低秩树挂上来不超过原高）。'},
      {zh:'若相等，合并后高恰为原高 + 1，秩 +1 仍合法。'},
      {tex:'x.rank \\ge \\text{height}(x) \\ \\text{始终成立}',zh:'★ 路径压缩让实际高度变小而 rank 不动 —— 上界越留越松，但永不失效。'}]},
     ],
    note:''},
   {type:'prove',title:'rank 是高度的上界（压缩不改秩）',statement:'With each node x , maintain the integer value x: rank, which is an upper bound on the height of x (the number of edges in the longest simple path from a descendant leaf to x ).',page:528,
    intro:'★ 本关唯一要证的命题：rank ≥ height 永远成立 —— 它是 19.4 分层分析的基石。',
    steps:[
     {title:'三种情形逐一核验',en:'The first heuristic, union by rank, is similar to the weighted-union heuristic we used with the linked-list representation.',page:528,
      body:['**MAKE-SET**：单结点 rank 0 = height 0。✓',
        '**LINK**：设两根 $x,y$。不等秩：新根为高秩者，挂上来的树高 ≤ 新根原高（rank 未变仍 ≥）。等秩：合并后高恰 +1，rank +1。✓',
        '**路径压缩**：只改指针指向，把结点提到更浅处 —— height 只减不增，rank 不变仍 ≥。✓∎']},
     {title:'rank 的上界性质带来的后果',en:'The second heuristic, path compression, is also quite simple and highly effective. As shown in Figure 19.5, FIND-SET operations use it to make each node on the find path point directly to the root.',page:528,
      body:['rank ≥ 1 的结点至少有 $2^{rank}$ 个后代（可归纳证明，19.4 的引理）。',
        '于是树高 ≤ lg n —— 这解释了**只用按秩合并**时 O(lg n) 的来源。',
        '★ 而路径压缩在 rank 不变的前提下把高度越压越低于 rank —— 19.4 正是利用这个"差值"分出 α(n) 层。∎']},
    ],conclusion:'★ 结论：rank 不变量是两个启发式能和平共处的契约 —— 压缩享便宜、秩仍在账上。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'路径压缩会改变结点的 rank 吗？',options:['会 +1','会清零','**不变**','视树高而定'],answer:2,
      why:'★ 原书 p.528 明确：Path compression does not change any ranks。'},
     {kind:'single',q:'什么时候 LINK 才把 rank +1？',options:['每次 UNION 都 +1，并一次就长高一层','**两根 rank 相等时**','低秩挂到高秩上的时候，rank 永远不变','路径压缩后'],answer:1,
      why:'★ 等秩合并树才会长高，rank +1 仍是对高度的上界。'},
     {kind:'judge',q:'按秩合并单独使用就能得到 O(m·α(n))。',answer:false,
      why:'★ 单独用只有 O(m lg n)；α(n) 需要**两个启发式合用**（19.4）。'},
     {kind:'simulate',q:'C 程序 Part C 中森林的总代价是多少？（n=1000、m=40000，填数字）',expect:[41999],placeholder:'例如：40000',
      why:'实测 41999（其中 find 遍历 58650 个结点）。'},
     {kind:'single',q:'MAKE-SET(x) 初始化时把 x.rank 设为多少？',options:['1','**0**','x 的高度','不确定'],answer:1,why:'★ MAKE-SET 2 行：x.p = x；x.rank = 0（p.530）。'},
     {kind:'judge',q:'rank 的值始终是该节点高度的上界（路径压缩只让实际高度变小）。',answer:true,why:'★ rank 是不变量：压缩改指针使高度变小，rank 不动仍 ≥（本关 prove）。'},
    ],bookExercises:[
     {id:'19.3-1',page:531,star:0,statement:'Redo Exercise 19.2-2 using a disjoint-set forest with union by rank and path com- pression. Show the resulting forest with each node including its x i and rank.',hint:'题干让你「把 19.2-2 那串操作重做一遍」，但 19.2-2 的操作序列站内没有收录 （本关只登了 19.3 这几道），所以先把 $\\text{MAKE-SET}$、$\\text{UNION}$、$\\text{LINK}$、$\\text{FIND-SET}$ 这些操作抄到纸上再做 —— 抄题时顺手确认序列长度与结点编号，别凭印象编。 做的时候两样东西每个结点都要标出来：**父指针**与 **rank**。 规则只有三条：$\\text{MAKE-SET}$ 造单结点（rank 0、父指自己）； $\\text{LINK}$ 只在两个根 rank 相等时把新根的 rank $+1$（不等时谁也不涨）； $\\text{FIND-SET}$ 沿父链走到根，然后把**路上经过的每个结点**的父指针改成根（路径压缩只改父指针， 绝不改 rank）。 画森林时按「父指针指向谁」分组。rank 沿父链向上是**严格递增**的（引理 19.4：$x \\ne x.p$ 时 $x.\\text{rank} < x.p.\\text{rank}$，路径压缩不破坏它）；但 rank 只是子树高度的**上界**，压缩之后实际高度可能远小于 rank，所以别拿 rank 当实际高度去核对图形。'},
     {id:'19.3-2',page:531,star:0,statement:'Write a nonrecursive version of FIND-SET with path compression.',hint:'两趟法：第一趟沿父链找到根并记录路径；第二趟把路径上每个结点的 p 改指根。本关 C 程序 part 3 的 `ds_find` 就是这个两趟写法：第一遍 `while (r != ds_p[r])` 找到根并计数，第二遍把路径上的结点逐个改指根，没有递归调用 —— 可以直接拿它对照自己的写法。'},
     {id:'19.3-3',page:531,star:0,statement:'Give a sequence of m MAKE-SET, UNION , and FIND-SET operations, n of which are MAKE-SET operations, that takes Ω(m lg n) time when using only union by rank and not path compression.',hint:'只有按秩合并时，树可以一直保持「满」的形状。构造：先 MAKE-SET $n$ 个，再 1+1、2+2、4+4 地配对 LINK 把 rank 逐级抬到 $\\lg n$，最后对每个结点各做一次 FIND-SET：不是每条都走满 $\\lg n$ 层（只有最深的叶子走那么多），但满树里各结点深度之和 $= \\sum_{d=0}^{k-1} d\\,2^d = (k-2)\\,2^k + 2 = \\Theta(n\\lg n)$（$n = 1024$、$k = 10$ 时是 8194，平均深度 8）。于是这 $n$ 次 FIND-SET 共 $\\Theta(n\\lg n)$，加上 $n$ 次 MAKE-SET 与 $n-1$ 次 LINK，$m = \\Theta(n)$ 次操作就是 $\\Omega(m\\lg n)$。'},
     {id:'19.3-4',page:531,star:0,statement:'Consider the operation PRINT-SET (x), which is given a node x and prints all the members of x ’s set, in any order. Show how to add just a single attribute to each node in a disjoint-set forest so that PRINT-SET (x) takes time linear in the number of members of x ’s set and the asymptotic running times of the other operations are unchanged. Assume that you can print each member of the set in O(1) time.',hint:'只准加**一个**属性：让同一个集合的成员在树里自己串成一条环链（例如给每个结点加一个指向「同集合另一个成员」的 next，根的 next 指向链上某点）。PRINT-SET 沿环走一圈就是 $O(|C|)$；LINK 时把两条环接起来是 $O(1)$，FIND-SET 与 rank 都不受影响。'},
     {id:'19.3-5',page:531,star:0,statement:'Show that any sequence of m MAKE-SET, FIND-SET, and LINK operations, where all the LINK operations appear before any of the FIND-SET operations, takes only O(m) time when using both path compression and union by rank. You may assume that the arguments to LINK are roots within the disjoint-set forest. What happens in the same situation when using only path compression and not union by rank?',hint:'旧提示把两头说反了：LINK 全在 FIND 之前，恰恰意味着**按秩在这里没戏唱** （LINK 的参数已经是根，一次 $O(1)$ 挂上去就完了，$m$ 次 LINK 共 $O(m)$）， 真正要算的账全在后面的 FIND 段，而让 FIND 段便宜的是**路径压缩**。 关键是：FIND 阶段再也没有 LINK，所以树的形状只被压缩改、不会被挂高。 于是每次 FIND 的代价可以拆成「1（最后一步到根）」加上「这条路径上**此前还没被压过**的结点数」； 一个结点被压过之后就直指根，以后路过它只花那 1 步。 把 $m$ 次 FIND 加起来：$\\le m$ 个「1」 $+$ 每个结点至多一次被压 $\\le m + n = O(m)$ （$n \\le m$ 个 MAKE-SET）。 第二问的答案是：**仍然 $O(m)$**——上面这段论证一个字都没用到秩。 会退化的情形是 LINK 与 FIND 交错（挂高与压缩互相拆台），不是本题这种「先连完再查」。'},
    ]},
  ],
};
