/* disjoint_set.c -- 第 19 章 Data Structures for Disjoint Sets。
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
 *   A_4(1) = A_3(2047) 远大于 A_2(2047) = 2^2059-1，远超 64 位整数。 */
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
        printf("        => 只有 n > A_4(1)（远大于 2^2059，远超宇宙原子数 10^80）才使 alpha(n) > 4。\n");
    }

    puts("all checks passed.");
    return 0;
}
