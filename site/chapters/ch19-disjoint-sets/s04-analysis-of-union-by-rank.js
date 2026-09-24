/* 第 19 章 19.4：按秩合并与路径压缩的分析（Analysis of union by rank with path compression）。印刷页 531–548（pdf 552–570）。 */
export default {
  key:'s04',id:'ch19/s04',chapter:19,section:'19.4',
  title:'O(m·α(n))：阿克曼反函数登场',shortTitle:'19.4 摊还分析 α(n)',
  titleEn:'Analysis of union by rank with path compression',
  source: { printed: [531, 548], pdf: [552, 570] },
  prerequisites:[{label:'19.3 Disjoint-set forests',url:'#/ch19/s03'}],
  stages:[
   {type:'map',title:'全书最难的分析，最有名的反函数',
    why:'按秩合并 + 路径压缩的精确摊还分析（Tarjan）给出 **O(m·α(n))**：α(n) 是阿克曼函数 A_k(n) 的反函数 —— 增长慢到对宇宙内一切 n 都 ≤ 4。',
    position:'本章也是全书的分析顶点：16 章的势能法在这里被推到极限（结点按 rank 分层，逐层记账）。',
    unlocks:[{label:'21.2 The algorithms of Kruskal and Prim',url:'#/ch21/s02'}],
    mathKit:[
     {title:'阿克曼函数',body:'$A_0(j) = j+1$；$A_k(j) = A_{k-1}^{(j+1)}(j)$（$k \\ge 1$）：$A_1(1)=3, A_2(1)=7, A_3(1)=2047, A_4(1)=A_3^{(2)}(1)=A_3(A_3(1)) > 10^{80}$。'},
     {title:'反函数',body:'$\\alpha(n) = \\min\\{k : A_k(1) \\ge n\\}$（式 19.2）。'},
     {title:'主定理',body:'$m$ 个操作至多 $O(m\\,\\alpha(n))$；且 $\\alpha(n) \\le 4$ 对一切实践 $n$ 成立。'},
    ]},
   {type:'intuition',title:'A_k(1) 的台阶',scene:'C 程序 Part D',body:[
     '阿克曼函数按 k 分层爆炸：$A_0(1)=2$、$A_1(1)=3$、$A_2(1)=7$、$A_3(1)=2047$、$A_4(1)$ 天文数字。',
     '★ α(n) = "跨过 n 需要几层台阶"：$n \\le 2 \\to \\alpha=0$；$n=3 \\to 1$；$4 \\le n \\le 7 \\to 2$；$8 \\le n \\le 2047 \\to 3$；$2048 \\le n \\le A_4(1) \\to 4$ —— 而 $A_4(1)$ 远大于宇宙原子数，所以实践里 $\\alpha(n) \\le 4$。',
     '★ 所以 **O(m·α(n)) 实际上就是 O(m)** —— 理论上不是常数，实践上是。',
     '★ 分析的骨架（原书 §19.4）：结点按 rank 分层 —— 第 0 层（rank 0）、叶子层、α(n) 个"分组"层；每层的摊还代价分别记账，非叶子层合计 O((m+n)·α(n))。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 ˛.n/ 代表 α(n)）。',blocks:[
     {kind:'body',page:531,en:'A very quickly growing function and its very slowly growing inverse',
      zh:'★ 一对孪生：爆炸增长的阿克曼函数与蜗牛爬的反函数。'},
     {kind:'body',page:533,en:'We define the inverse of the function A k (n), for integer n \u2265 0, by \u02db.n/ = min fk W A k .1/ \u2265 ng : (19.2)',
      zh:'★★ 反函数定义 (19.2)：α(n) = min{k : A_k(1) ≥ n}（˛.n/ 是语料伪影）。'},
     {kind:'body',page:533,en:'(greater than A 4 .1/, a huge number) that \u02db.n/ > 4 , and so \u02db.n/ \u2264 4 for all practical purposes.',
      zh:'★★ α(n) ≤ 4 对一切实践 n 成立 —— O(m·α(n)) 就是 O(m)。'},
    ],terms:[{en:'path compression',zh:'路径压缩',page:533}]},
   {type:'pseudocode',title:'A_k(1) 的台阶表',algo:'ACKERMAN-LEVELS',signature:'阿克曼函数的分层（原书 p.532，本站整理）',page:532,
    lines:[
     {n:1,code:'A_0(j) = j + 1',zh:'最底层：加一。'},
     {n:2,code:'A_1(j) = 2j + 1',zh:'线性（原书引理 19.2）。'},
     {n:3,code:'A_2(j) = 2^(j+1)·(j+1) − 1',zh:'指数（原书引理 19.3）。'},
     {n:4,code:'A_3(1) = A_2(A_2(1)) = A_2(7) = 2047',zh:'再叠一层迭代。'},
     {n:5,code:'A_4(1) = A_3(A_3(1)) = A_3(2047) > 10^80',zh:'远超可观测宇宙的原子数。'},
     {n:6,code:'A_k(1) = A_{k-1}^{(2)}(1)  （k >= 2）',zh:'★ 每上一层 = 对下层做迭代。'}],
    vars:[{name:'A_k^{(j)}',meaning:'函数 A_k 迭代 j 次'}],
    note:'★ C 程序 Part D：alpha(n) 的计算与 A_k(1) 的台阶 —— n=2047 时 α=3，再往上要跨 A_4(1) 才 α=4。',
    more:[]},
   {type:'visualize',title:'台阶与 α(n)',panels:[
     {title:'A_k(1) 的爆炸（对数纵轴意义下）',viz:'growth',
      chart:{xMax:10,series:[
       {name:'α(n)：0,1,2,3 的台阶',expr:'n <= 2 ? 0 : (n === 3 ? 1 : (n <= 7 ? 2 : 3))',color:'--viz-done'},
       {name:'lg n（对照）',expr:'Math.log2(n)',color:'--viz-compare'},
       {name:'n（阿克曼本尊方向）',expr:'n',color:'--viz-violation'}]},
      note:'★ α(n) 的增长比 lg n 慢得多 —— "慢"到宇宙范围内是常数。'},
    ],tasks:['对照 C 程序 Part D 的台阶数字。'],note:''},
   {type:'code',title:'实测：α(n) 的台阶',c:{file:'disjoint_set.c',code:String.raw`/* disjoint_set.c -- 第 19 章 Data Structures for Disjoint Sets。
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
    notes:[{line:1,zh:'★ 四关共用本文件。'},
           {line:185,zh:'`alpha`：按式 (19.2) 逐层计算 A_k(1)。'},
           {line:317,zh:'★★ Part D：打印 A_0(1)=2、A_1(1)=3、A_2(1)=7、A_3(1)=2047 的台阶。'},
           {line:291,zh:'★ Part C：森林在温和序列上的实测（41999）。'}]},
    tests:[{in:'alpha(n)',out:'A_0(1)=2、A_1(1)=3、A_2(1)=7、A_3(1)=2047'},
           {in:'α(n) 的上界',out:'≤ 4 对一切实践 n'},
           {in:'森林总代价',out:'O(m·α(n)) —— 实践即 O(m)'}],
    mapping:[{pc:1,pcCode:'A_0(j) = j + 1',c:'`alpha` 函数中的逐层计算（第 185 行）'}]},
   {type:'analyze',title:'一本账：分层的记账',claims:[
     {expr:'\\alpha(n) \\le 4',when:'对一切可实践的 n',page:533,source:'book'},
     {expr:'O(m\\,\\alpha(n))',when:'按秩合并 + 路径压缩下 m 个操作的总代价',page:533,source:'book'},
     {expr:'A_3(1) = 2047',when:'α(n) = 3 的最大 n（升到 4 从 n = 2048 开始）',page:533,source:'book'},
    ],tables:[{caption:'C 程序 Part D 的台阶',rows:[
      ['k','A_k(1)','含义'],
      ['0','2','+1'],
      ['1','3','+2'],
      ['2','7','线性翻倍量级'],
      ['3','2047','指数'],
      ['4','> 10^80（远超宇宙原子数）','α(n) = 4 的上界'],
     ]},{caption:'本章三关的最终答案',rows:[
      ['表示','总代价'],
      ['朴素链表','Θ(m + n²)'],
      ['加权链表','O(m + n lg n)'],
      ['森林 + 两启发式','**O(m α(n))**'],
     ]}],chart:{xMax:2500,series:[
     {name:'α(n) 台阶：n=7→2, n=2047→3',expr:'2 + n / 1000',color:'--viz-done'},
     {name:'lg n（对照）',expr:'Math.log2(n)',color:'--viz-compare'}]},
    derivations:[{kind:'summation',title:'分层记账的直觉（完整证明见原书 §19.4）',steps:[
      {zh:'按 rank 把结点分层：rank 0 的叶子、rank ≥ 1 的"内部"、再按 $A_k$ 分组。'},
      {zh:'每层单独记账：低层结点被压缩"捞上来"的次数受层尺寸限制；高层结点总量极少。'},
      {tex:'\\sum_{\\text{各层}} O(m) = O(m\\,\\alpha(n))',zh:'★ 逐层代价相加后，层数正是 α(n) —— 这就是反函数出现的根本原因。'}]},
     ],
    note:''},
   {type:'prove',title:'为什么 α(n) ≤ 4',statement:'We define the inverse of the function A k (n), for integer n \u2265 0, by \u02db.n/ = min fk W A k .1/ \u2265 ng : (19.2)',page:533,
    intro:'★ 这一步只需数字事实：A_3(1) = 2047、A_4(1) 天文数字。',
    steps:[
     {title:'A_k(1) 的数值',en:'A very quickly growing function and its very slowly growing inverse',page:531,
      body:['$A_0(1) = 2$；$A_1(1) = 3$；$A_2(1) = 7$；$A_3(1) = 2047$；$A_4(1) = A_3^{(2)}(1) = A_3(A_3(1)) = A_3(2047) > 10^{80}$。',
        'C 程序 Part D 逐层打印了这些台阶。']},
     {title:'跨过 α = 4 的门槛',en:'(greater than A 4 .1/, a huge number) that \u02db.n/ > 4 , and so \u02db.n/ \u2264 4 for all practical purposes.',page:533,
      body:['α(n) > 4 需要 $n > A_4(1)$ —— 一个远超可观测宇宙原子数的整数。',
        '所以在一切真实输入下 $\\alpha(n) \\le 4$，$O(m\\,\\alpha(n))$ 就是 $O(m)$。',
        '★ 工程结论：并查集在实用中是**常数时间**的数据结构 —— 尽管它的精确分析横跨十几页。∎']},
    ],conclusion:'★ 结论：O(m·α(n)) 是"渐近意义上未解决、实践意义上已解决"的著名范例。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'α(n) 的定义是？',options:['lg lg n','$\\min\\{k : A_k(1) \\ge n\\}$','n 取两次对数，即 $\\lg \\lg n$，与阿克曼函数无关','阿克曼函数本身'],answer:1,
      why:'★ 式 (19.2)。'},
     {kind:'single',q:'按秩合并 + 路径压缩的总代价是？',options:['O(m lg n)','O(m+n²)','**O(m·α(n))**','Θ(m)'],answer:2,
      why:'★ 主定理；α(n) ≤ 4 对实践 n 成立，故实际就是 O(m)。'},
     {kind:'judge',q:'A_3(1) = 2047。',answer:true,
      why:'★ C 程序 Part D 打印的台阶：2、3、7、2047。'},
     {kind:'simulate',q:'α(n) 从 3 升到 4 的门槛是 A_4(1)，它比 2047 大多少个量级？（填数字）',expect:[3],placeholder:'例如：2',
      why:'A_4(1) = A_3(A_3(A_3(1)))，即对 2047 做三层指数迭代 —— 远超 3 个量级。'},
     {kind:'judge',q:'阿克曼台阶上 A_2(1) = 7。',answer:true,why:'★ C 程序 Part D 楼梯：A_0=2、A_1=3、A_2=7、A_3=2047（原书 p.532）。'},
     {kind:'simulate',q:'阿克曼台阶上 A_1(1) 等于多少？（填数字）',expect:[3],placeholder:'例如：2',why:'★ A_1(1) = 3（C 程序 Part D / 原书 p.532）。'},
    ],bookExercises:[
     {id:'19.4-1',page:540,star:0,statement:'Prove Lemma 19.4.',hint:'先把引理 19.4 的原话抄下来（p533：$x$ 的 rank 不超过 $x.p$ 的 rank，非根时严格；rank 初值为 0，成为非根后不再变）。证明只需盯每次 LINK 的两个角色：被挂上去的那根从此冻结，留下当根的那根 rank 只增不减 —— 引理里的不等式与「至多变化一次」都是从这一次赋值读出来的。'},
     {id:'19.4-2',page:540,star:0,statement:'Prove that every node has rank at most ⌊lg n⌋.',hint:'对 rank 归纳：rank 为 $k$ 的结点，它的子树里至少要有 $2^k$ 个结点（因为 rank 只在两根同秩 LINK 时才 $+1$，那一次的子树是两棵 rank $k-1$ 的子树拼的）。子树不超过 $n$ 个结点，于是 $2^k\\le n$。'},
     {id:'19.4-3',page:540,star:0,statement:'In light of Exercise 19.4-2, how many bits are necessary to store x: rank for each node x ?',hint:'上一题给了 rank 不超过 $\\lfloor\\lg n\\rfloor$，所以「值域里有多少个不同的数」决定位数：$\\lg(\\lfloor\\lg n\\rfloor + 1)$ 位。把这一步的换算写出来，再顺手说一句为什么这比「存一个结点下标」便宜得多。'},
    ]},
  ],
};
