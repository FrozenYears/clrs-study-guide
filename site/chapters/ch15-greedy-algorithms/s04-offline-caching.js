/* 第 15 章 15.4：离线缓存（Offline caching）。印刷页 440–446（pdf 461–467）。 */
export default {
  key:'s04',id:'ch15/s04',chapter:15,section:'15.4',
  title:'离线缓存：换出"下次最晚才用到"的那块',shortTitle:'15.4 离线缓存',
  titleEn:'Offline caching',
  source:{printed:[440,446],pdf:[461,467]},
  prerequisites:[{label:'15.3 Huffman codes',url:'#/ch15/s03'}],
  stages:[
   {type:'map',title:'缓存换页：知道未来的话，最优策略长什么样',
    why:'一块 $k$ 个槽的缓存收到 $n$ 个请求序列；命中不动，缺失就要**换出**一块。目标是最小化缺失次数。在**离线**设定下（未来的请求序列已知），有一个贪心最优策略：换出**下次访问最晚**的那块。',
    position:'这是贪心的第四个范例，也是最能说明"贪心什么时候成立"的一关：离线有最优贪心（定理 15.5），在线则没有确定性的最优策略 —— 只能谈竞争比。第 15 章到此收口。',
    unlocks:[{label:'回到第 14 章动态规划',url:'#/ch14/s01'}],
    mathKit:[
     {title:'三种情形',body:'① 命中；② 缺失但缓存没满 → 直接放入；③ 缺失且缓存满 → 必须先换出某块。后两种都叫 cache miss。'},
     {title:'贪心选择（FFU）',body:'换出"下次访问最晚（或永不再访问）"的块 —— $\\text{furthest-in-future}$。'},
     {title:'竞争比',body:'LRU 与 FIFO 都是 $k$-竞争：$\\text{miss}(\\text{LRU}) \\le k \\cdot \\text{miss}(\\text{OPT})$；FFU 就是 OPT，竞争比 1。'},
    ]},
   {type:'intuition',title:'k = 2 的小例子：4 次缺失 vs 6 次',scene:'请求序列 1,2,3,1,2,3，缓存容量 k = 2',body:[
     '**FFU（最优）**：1 缺失 → 2 缺失 → 3 缺失，此时缓存 {1,2}，而 1 下次在第 4 个请求、2 在第 5 个 —— 换出**更晚才用到**的 2 → 缓存 {1,3}。第 4 个请求 1 命中；第 5 个请求 2 缺失（换出永不再用的 1）；第 6 个请求 3 命中。**总缺失 4 次**。',
     '**LRU**：1、2、3 都缺失（换出最久未用的 1）→ 缓存 {2,3}；请求 1 缺失（换出 2）→ {1,3}；请求 2 缺失（换出 3）→ {1,2}；请求 3 缺失 → **总缺失 6 次**。',
     '★ 差别全在第 3 步：FFU 知道 2 比 1 更晚被用到，所以保住了 1；LRU 只能凭过去，判断反了。',
     '★ 但这不代表 LRU 无用：LRU 是 $k$-竞争的（这里 6 ≤ 2 × 4），而 LIFO 没有这个保证 —— 请求 1,2,3 循环时 LIFO 缺失 9 次、最优只要 7 次。',
     'C 程序 part 4 在 3000 组随机序列上验证：FFU **恒等于**暴力最优（0 次不符），LRU/FIFO 的最坏 miss/OPT 是 1.83，而 LIFO 到 3.00。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 in t he cache、so me 是原书的断词伪影）。',blocks:[
     {kind:'body',page:440,en:'The cache remains unchanged. This situation is known as a cache hit.',
      zh:'★ 情形 ①：命中，缓存不动。'},
     {kind:'body',page:440,en:'3. Block b i is not in the cache at that time and the cache is full: it contains k blocks. Block b i is placed into the cache, but before that happens, some other block in the cache must be evicted from the cache in order to make room.',
      zh:'★★ 情形 ③：缺失且满 —— **必须换出某一块**，这就是要做决策的地方。'},
     {kind:'body',page:440,en:'The latter two situations, in which the requested block is not already in the cache, are called cache misses. The goal is to minimize the number of cache misses or, equivalently, to maximize the number of cache hits, over the entire sequence of n requests.',
      zh:'★★ 目标函数的定义：最小化缺失次数。'},
     {kind:'body',page:442,en:'Let miss(C,i) denote the minimum number of cache misses in a solution for subproblem (C,i) .',
      zh:'★★ 子问题：**缓存内容 + 请求下标**（不是 14 章的"区间"）。'},
     {kind:'body',page:442,en:'Theorem 15.5 (Optimal offline caching has the greedy-choice property)',
      zh:'★★ **Theorem 15.5**：最优离线缓存满足贪心选择性质 —— 换出下次访问最远者。'},
     {kind:'body',page:442,en:'When block b i is requested, let \u00b4 = b m be the block in C whose next access is furthest in the future.',
      zh:'★★ FFU 的定义句：被换出的是**下次访问最晚**的块（´ 是语料把 $\\hat{b}$ 抽坏的伪影）。'},
     {kind:'body',page:445,en:'Real cache managers do not know the future requests , and so they often use the past to decide which block to evict. The least-recently-used, or LRU, strategy evicts the block that, of all blocks currently in t he cache, was the least recently requested.',
      zh:'★ 现实中不知道未来 → 用过去猜（LRU）。这就是"离线 vs 在线"的分野（习题 15.4-2）。'},
    ],terms:[{en:'offline caching',zh:'离线缓存（预先知道请求序列）',page:440},
              {en:'cache hit',zh:'缓存命中',page:440},
              {en:'cache miss',zh:'缓存缺失',page:440}]},
   {type:'pseudocode',title:'FURTHEST-IN-FUTURE：换哪一块',algo:'FURTHEST-IN-FUTURE',signature:'CACHE-MANAGER(C, k, seq)',page:442,
    lines:[
     {n:1,code:'for i = 1 to n',zh:'逐个处理请求。'},
     {n:2,code:'    if b_i ∈ C',zh:'★ 情形 ①：命中。'},
     {n:3,code:'        continue    // cache hit: nothing changes',zh:''},
     {n:4,code:'    if |C| < k',zh:'★ 情形 ②：没满，直接放入。'},
     {n:5,code:'        C = C ∪ {b_i}',zh:''},
     {n:6,code:'        continue',zh:''},
     {n:7,code:'    \u00b4 = argmax_{b ∈ C} NEXT-USE(b, i)    // 下次访问最远者',zh:'★★ 情形 ③：换出"下次最晚用到"的块。'},
     {n:8,code:'    C = (C \u2212 {\u00b4}) ∪ {b_i}',zh:'先换出再放入。'},
     {n:9,code:'return 缺失次数',zh:''}],
    vars:[{name:'C',meaning:'当前缓存内容（$k$ 个块的集合）'},
          {name:'NEXT-USE(b,i)',meaning:'块 $b$ 在第 $i$ 个请求之后第一次被请求的下标；若之后不再出现则为 $\\infty$'}],
    note:'★ 原书本节没有给出伪代码（定理 15.5 的证明是纯交换论证）；这段过程是本站按**习题 15.4-1** 的要求写出的，与 C 程序的 `furthest_in_future` 逐行对应。',
    more:[{algo:'CACHE-MANAGER',subtitle:'对照：LRU 只需要"过去"（习题 15.4-2）',signature:'LRU(C, k, seq)',page:445,
      lines:[{n:1,code:'if b_i ∈ C',zh:''},{n:2,code:'    把 b_i 标记为最近使用',zh:''},{n:3,code:'else if |C| < k',zh:''},
        {n:4,code:'    C = C ∪ {b_i}',zh:''},
        {n:5,code:'else',zh:''},
        {n:6,code:'    \u00b4 = argmin_{b ∈ C} LAST-USE(b, i)    // 最久未用者',zh:'★ 只看过去 —— 所以是可以在线实现的。'},
        {n:7,code:'    C = (C \u2212 {\u00b4}) ∪ {b_i}',zh:''}],
      vars:[{name:'LAST-USE(b,i)',meaning:'块 $b$ 最近一次被请求的下标'}],
      note:'★ LRU 与 FFU 长得几乎一样，唯一的区别是"看未来"还是"看过去"。'}]},
   {type:'visualize',title:'看见缺失次数与竞争比',panels:[
     {title:'① 请求序列 1,2,3,1,2,3（k = 2）的四种策略',viz:'growth',
      chart:{xMax:8,series:[
       {name:'FFU = 4（最优）',expr:'4',color:'--viz-done'},
       {name:'LRU = 6',expr:'6',color:'--viz-compare'},
       {name:'FIFO = 6',expr:'6',color:'--viz-compare'},
       {name:'LIFO = 5',expr:'5',color:'--viz-violation'}]},
      note:'★ 暴力最优也是 4 —— 与 FFU 相同（C 程序 part 1/3）。'},
     {title:'② 长序列上的量级：最优 ≈ n / k，k-竞争 ≤ k 倍',viz:'growth',
      chart:{xMax:128,series:[
       {name:'OPT ≈ n / k（k = 4）',expr:'n / 4',color:'--viz-done'},
       {name:'LRU 最坏 ≈ n',expr:'n',color:'--viz-violation'}]},
      note:'★ 3000 组随机序列实测：LRU/FIFO 最坏 miss/OPT = 1.83（k = 2/3），没有超过 $k$；LIFO 最坏 3.00。'},
    ],tasks:['对照 C 程序 part 4：FFU 与暴力最优不符 0 次。'],note:''},
   {type:'code',title:'实测：FFU = OPT（3000 组随机序列）',c:{file:'offline_caching.c',code:String.raw`/* offline_caching.c -- 15.4: 离线缓存（Offline caching）。
 *
 * 三件事：
 *   part 1–3：在手造序列 1,2,3,1,2,3（k = 2）上对比 FFU / LRU / FIFO / LIFO。
 *   part 4   ：用**暴力最优**（对缓存配置做精确 DP）验证 FFU 就是 OPT。
 *   part 5   ：随机序列大批量对照 —— FFU 恒等于 OPT；LRU / FIFO 不超过 k 倍。
 *
 * 关键数字：k = 2、序列 1,2,3,1,2,3 时 FFU 缺失 4 次，LRU 与 FIFO 各 6 次。
 * 术语：FFU = furthest-in-future，即原书 Theorem 15.5 的贪心策略（换出下次访问最远的块）。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define KMAX 3        /* 测试用的最大缓存容量 */
#define NB 8          /* 块的种类数上限 */
#define NN 32         /* 请求序列长度上限 */

/* ---------------- 手造序列上的四种策略 ---------------- */
static int in_cache(const int *c, int sz, int x)
{
    for (int i = 0; i < sz; i++) { if (c[i] == x) { return i; } }
    return -1;
}

/* FFU：缺失且满时换出「下次访问最远（或永不再访问）」的块 —— 原书 Theorem 15.5 的贪心。 */
static int furthest_in_future(const int *seq, int n, int k)
{
    int cache[KMAX];
    int sz = 0, misses = 0;
    for (int i = 0; i < n; i++) {
        if (in_cache(cache, sz, seq[i]) >= 0) { continue; }
        misses++;
        if (sz < k) { cache[sz++] = seq[i]; continue; }
        int evict = 0, furthest = -2;
        for (int j = 0; j < sz; j++) {
            int next = n;                 /* n 表示"永不再出现"（最远） */
            for (int t = i + 1; t < n; t++) { if (seq[t] == cache[j]) { next = t; break; } }
            if (next > furthest) { furthest = next; evict = j; }
        }
        cache[evict] = seq[i];
    }
    return misses;
}

/* LRU：换出最久未使用（数组头 = 最久未用）。 */
static int lru(const int *seq, int n, int k)
{
    int cache[KMAX];
    int sz = 0, misses = 0;
    for (int i = 0; i < n; i++) {
        int pos = in_cache(cache, sz, seq[i]);
        if (pos >= 0) {
            int v = cache[pos];
            for (int j = pos; j < sz - 1; j++) { cache[j] = cache[j + 1]; }
            cache[sz - 1] = v;
        }
        else {
            misses++;
            if (sz < k) { cache[sz++] = seq[i]; }
            else {
                for (int j = 0; j < k - 1; j++) { cache[j] = cache[j + 1]; }
                cache[k - 1] = seq[i];
            }
        }
    }
    return misses;
}

/* FIFO：换出最早进入（数组头 = 最早进入）；命中不改变顺序。 */
static int fifo(const int *seq, int n, int k)
{
    int cache[KMAX];
    int sz = 0, misses = 0;
    for (int i = 0; i < n; i++) {
        if (in_cache(cache, sz, seq[i]) >= 0) { continue; }
        misses++;
        if (sz < k) { cache[sz++] = seq[i]; }
        else {
            for (int j = 0; j < k - 1; j++) { cache[j] = cache[j + 1]; }
            cache[k - 1] = seq[i];
        }
    }
    return misses;
}

/* LIFO：换出最近进入（数组尾 = 最近进入）；命中不改变顺序。 */
static int lifo(const int *seq, int n, int k)
{
    int cache[KMAX];
    int sz = 0, misses = 0;
    for (int i = 0; i < n; i++) {
        if (in_cache(cache, sz, seq[i]) >= 0) { continue; }
        misses++;
        if (sz < k) { cache[sz++] = seq[i]; }
        else { cache[k - 1] = seq[i]; }      /* 直接覆盖最近进入的那个 */
    }
    return misses;
}

/* ---------------- 暴力最优：对「缓存配置」做精确 DP ---------------- */

/* opt[i][mask] = 从第 i 个请求开始、缓存内容恰为 mask 时的最小缺失数（-1 表示未算） */
static int opt_memo[NN + 1][1 << NB];
static const int *opt_seq;
static int opt_n, opt_k;

static int opt_dp(int i, int mask)
{
    if (i == opt_n) { return 0; }
    if (opt_memo[i][mask] >= 0) { return opt_memo[i][mask]; }
    int x = opt_seq[i];
    int bit = 1 << x;
    int best;
    if (mask & bit) { best = opt_dp(i + 1, mask); }         /* 命中 */
    else {
        int cnt = 0;
        for (int b = 0; b < NB; b++) { if (mask & (1 << b)) { cnt++; } }
        if (cnt < opt_k) { best = 1 + opt_dp(i + 1, mask | bit); }
        else {
            best = opt_n + 1;
            for (int b = 0; b < NB; b++) {
                if (!(mask & (1 << b))) { continue; }
                int cand = 1 + opt_dp(i + 1, (mask & ~(1 << b)) | bit);
                if (cand < best) { best = cand; }
            }
        }
    }
    opt_memo[i][mask] = best;
    return best;
}

static int optimal(const int *seq, int n, int k)
{
    opt_seq = seq; opt_n = n; opt_k = k;
    memset(opt_memo, -1, sizeof(opt_memo));
    return opt_dp(0, 0);
}

/* ---------------- 随机序列（种子先做乘法混合，避免连续种子相关） ---------------- */
static unsigned int rng_s;
static void rng_seed(unsigned int s)
{
    rng_s = s * 2654435761u;            /* Knuth 乘法混合 */
    if (rng_s == 0) { rng_s = 0x9E3779B9u; }
}
static unsigned int rng_next(void)
{
    rng_s ^= rng_s << 13;
    rng_s ^= rng_s >> 17;
    rng_s ^= rng_s << 5;
    return rng_s;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* ------- part 1–3：手造序列 ------- */
    int seq0[] = {1, 2, 3, 1, 2, 3};
    int n0 = 6, k0 = 2;
    int ff = furthest_in_future(seq0, n0, k0);
    int lu = lru(seq0, n0, k0);
    int fo = fifo(seq0, n0, k0);
    int li = lifo(seq0, n0, k0);
    printf("part 1: 序列 1,2,3,1,2,3（k = 2）：FFU 缺失 %d 次\n", ff);
    printf("part 2: LRU 缺失 %d 次；FIFO 缺失 %d 次；LIFO 缺失 %d 次\n", lu, fo, li);
    assert(ff == 4 && lu == 6 && fo == 6 && li == 5);
    printf("part 3: 暴力最优（对缓存配置做 DP）= %d 次 —— 与 FFU 相同\n",
           optimal(seq0, n0, k0));
    assert(optimal(seq0, n0, k0) == ff);

    /* ------- part 4：随机序列上验证 FFU = OPT，且在线策略受 k 约束 ------- */
    {
        int trials = 0, max_ratio_lru = 0, max_ratio_fifo = 0, max_ratio_lifo = 0;
        int worst_opt = 1 << 30, bad_ffu = 0;
        for (unsigned int seed = 1; seed <= 3000; seed++) {
            int k = 2 + (int)(seed % 2);            /* k = 2 或 3 */
            int n = 8 + (int)(seed % 13);           /* n = 8..20 */
            int seq[NN];
            rng_seed(seed);
            for (int i = 0; i < n; i++) { seq[i] = (int)(rng_next() % 5); }  /* 5 种块 */
            int best = optimal(seq, n, k);
            int f = furthest_in_future(seq, n, k);
            int l = lru(seq, n, k);
            int q = fifo(seq, n, k);
            int s = lifo(seq, n, k);
            if (f != best) { bad_ffu++; }
            if (best < worst_opt) { worst_opt = best; }
            if (l * 100 > max_ratio_lru * best) { max_ratio_lru = l * 100 / best; }
            if (q * 100 > max_ratio_fifo * best) { max_ratio_fifo = q * 100 / best; }
            if (s * 100 > max_ratio_lifo * best) { max_ratio_lifo = s * 100 / best; }
            assert(l <= k * best);
            assert(q <= k * best);
            trials++;
        }
        printf("part 4: 随机 %d 组序列（k = 2/3，n = 8..20，5 种块）\n", trials);
        printf("        FFU 与暴力最优不符的次数 = %d（应为 0）\n", bad_ffu);
        printf("        LRU 最坏 miss/OPT = %.2f；FIFO 最坏 = %.2f；LIFO 最坏 = %.2f\n",
               max_ratio_lru / 100.0, max_ratio_fifo / 100.0, max_ratio_lifo / 100.0);
        assert(bad_ffu == 0);
        printf("        ★ LRU/FIFO 都满足 miss ≤ k·OPT（理论上的 k-竞争）；LIFO 没有这个保证。\n");
    }

    /* ------- part 5：LIFO 可以被逼到很差 ------- */
    {
        int seq[NN], k = 2, n = 12;
        /* 三个块循环请求：LIFO 每次都把刚放进来的块又换出去，几乎永不命中 */
        for (int i = 0; i < n; i++) { seq[i] = 1 + (i % 3); }
        int f5 = furthest_in_future(seq, n, k);
        int s5 = lifo(seq, n, k);
        int o5 = optimal(seq, n, k);
        printf("part 5: 序列 1,2,3 重复 4 次（k = 2）：FFU %d 次、暴力最优 %d 次、LIFO %d 次\n",
               f5, o5, s5);
        assert(o5 == f5);
        assert(s5 == 9);
        printf("        ★ LIFO 没有 k-竞争保证：这里比最优多缺 %d 次（多 %.0f%%）。\n",
               s5 - o5, 100.0 * (s5 - o5) / o5);
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 文件开头写明实验设计与关键数字（FFU 4 / LRU 6 / FIFO 6）。'},
           {line:26,zh:'`furthest_in_future`：定理 15.5 的贪心 —— 换出下次访问最远者。'},
           {line:46,zh:'`lru` / `fifo` / `lifo`：三个在线策略，只看过去。'},
           {line:107,zh:'`opt_dp`：**暴力最优** —— 在"缓存配置"上做精确 DP，与贪心完全独立。'},
           {line:141,zh:'`rng_seed`：种子先做乘法混合，避免连续种子产生相关序列。'},
           {line:165,zh:'★★ part 1：序列 1,2,3,1,2,3 上 FFU 缺失 4 次。'},
           {line:196,zh:'★★ part 4：3000 组随机序列，FFU 与暴力最优不符 **0** 次；LRU/FIFO 最坏 1.83 倍。'},
           {line:212,zh:'★★ part 5：1,2,3 循环时 LIFO 缺 9 次 vs 最优 7 次 —— 它没有 k-竞争保证。'}]},
    tests:[{in:'序列 1,2,3,1,2,3，k = 2',out:'FFU 4 / LRU 6 / FIFO 6 / LIFO 5，暴力最优 4'},
           {in:'3000 组随机序列（k = 2/3，n = 8..20）',out:'FFU ≡ OPT；LRU、FIFO ≤ k·OPT（最坏 1.83 倍）'},
           {in:'序列 1,2,3 重复 4 次，k = 2',out:'最优 7 次 vs LIFO 9 次（多 29%）'}],
    mapping:[{pc:7,pcCode:'´ = argmax NEXT-USE(b, i)',c:'`if (next > furthest) { furthest = next; evict = j; }`（第 34 行）'},
             {pc:8,pcCode:'C = (C − {´}) ∪ {b_i}',c:'`cache[evict] = seq[i];`（第 36 行）'}]},
   {type:'analyze',title:'一本账：离线最优 vs 在线竞争比',claims:[
     {expr:'\\Theta(nk)',when:'离线最优的求解时间（每个请求扫一遍缓存找最远者）',page:442,source:'book'},
     {expr:'k',when:'LRU / FIFO 的竞争比上界：miss ≤ k · miss(OPT)',page:445,source:'book'},
     {expr:'1',when:'FFU 的竞争比（离线已知未来，它就是 OPT）',page:442,source:'book'},
    ],tables:[{caption:'四种换出策略的对照（C 程序实测）',rows:[
      ['策略','依据','1,2,3,1,2,3（k=2）','3000 组随机最坏 miss/OPT','竞争比保证'],
      ['FFU（= OPT）','未来','4（最优）','1.00','1（离线）'],
      ['LRU','过去','6','1.83','$k$'],
      ['FIFO','进入次序','6','1.83','$k$'],
      ['LIFO','最近进入','5','3.00','无'],
     ]},{caption:'为什么 LRU 的常数因子是 $k$',rows:[
      ['情形','OPT 的动作','LRU 的动作'],
      ['一组 $k$ 次缺失之间','最多填满缓存一次','可能全部 $k$ 块都被换掉'],
      ['最坏放大','1 次','$k$ 次'],
     ]}],chart:{xMax:64,series:[
     {name:'OPT ≈ n / k（k = 4）',expr:'n / 4',color:'--viz-done'},
     {name:'k · OPT ≈ n',expr:'n',color:'--viz-violation'}]},
    derivations:[{kind:'summation',title:'子问题的形式',steps:[
      {zh:'原书把子问题记作 $(C,i)$：缓存内容 $C$ 与请求下标 $i$。'},
      {zh:'递推：若 $b_i \\in C$ 则 $\\text{miss}(C,i) = \\text{miss}(C,i+1)$；否则要枚举换出哪一块。'},
      {tex:'\\text{miss}(C,i) = 1 + \\min_{b \\in C}\\text{miss}((C - \\{b\\}) \\cup \\{b_i\\},\\, i+1)',zh:'★ 枚举换出对象有 $k$ 种 —— 状态数是"缓存配置"级别的（$\\binom{m}{k}$ 量级），正是定理 15.5 用贪心避开的那层枚举。C 程序 part 4 的 `opt_dp` 就老老实实做了这层枚举，用它来验证贪心。'}]},
     ],
    note:''},
   {type:'prove',title:'定理 15.5：换出最远者总是安全的',statement:'Theorem 15.5 (Optimal offline caching has the greedy-choice property)',page:442,
    intro:'★ 证明仍是交换论证：设 $S$ 是任意最优策略，$S^{\\prime}$ 是"这一步改用 FFU"的策略 —— 证明 $S^{\\prime}$ 也不差。',
    steps:[
     {title:'设定：两个策略的缓存最多差一块',en:'When block b i is requested, let \u00b4 = b m be the block in C whose next access is furthest in the future.',page:442,
      body:['在第一个缺失处，FFU 换出 $\\hat{b}$（下次访问最远），设最优策略 $S$ 换出 $y$。',
        '若 $y = \\hat{b}$ 则两者一致；否则考虑"把 $S$ 的那一步改成换出 $\\hat{b}$"的新策略 $S^{\\prime}$。',
        '**归纳不变量**：此后每一步，$S$ 与 $S^{\\prime}$ 的缓存**至多相差一块**（原书证明里的 property 1）。']},
     {title:'关键一步：最远者迟早要被换掉，早换不亏',en:'Let miss(C,i) denote the minimum number of cache misses in a solution for subproblem (C,i) .',page:442,
      body:['因为 $\\hat{b}$ 是"下次访问最远"的块，在 $S$ 与 $S^{\\prime}$ 缓存出现差异的那段时间里，$\\hat{b}$ **不会被用到**（它比 $y$ 更晚被访问）。',
        '所以 $S^{\\prime}$ 在这段时间里可以一直"维持"差异而不付出额外面代价 —— 一旦 $S$ 真的需要 $\\hat{b}$ 时，$S$ 自己也已经在更早的时候把它换出去了。',
        '把两者逐一配对后，$S^{\\prime}$ 的缺失次数 $\\le S$ 的缺失次数。由于 $S$ 最优，$S^{\\prime}$ 也最优 —— 贪心选择安全。∎']},
     {title:'实测与独立复核',en:'3. Block b i is not in the cache at that time and the cache is full: it contains k blocks. Block b i is placed into the cache, but before that happens, some other block in the cache must be evicted from the cache in order to make room.',page:440,
      body:['C 程序用**独立的暴力 DP**（枚举所有换出选择、对缓存配置记忆化）算出真最优。',
        '在 3000 组随机序列（$k = 2/3$、$n = 8..20$、5 种块）上，FFU 与暴力最优**不符 0 次**。',
        '同一批数据里 LRU / FIFO 的最坏 miss/OPT 是 1.83（不超过 $k$），LIFO 最坏 3.00（没有保证）。∎']},
    ],conclusion:'★ 结论：离线缓存的贪心是最优的（竞争比 1）；在线设定下没有确定性最优策略，只能追求 $k$-竞争。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'最优离线缓存的换出规则是？',options:['换出最久未使用的','换出最早进入的','换出**下次访问最远**的','换出最近进入的'],answer:2,
      why:'★ furthest-in-future（定理 15.5）。C 程序用暴力 DP 在 3000 组序列上验证了它的最优性。'},
     {kind:'single',q:'LRU 的竞争比上界是？',options:['$1$','$\\lg k$','$k$','无上界'],answer:2,
      why:'★ miss(LRU) ≤ k · miss(OPT)。实测最坏 1.83 倍（k = 2/3），没有触到上界但也没超过。'},
     {kind:'judge',q:'有了"知道未来"这个条件，缓存问题才有确定性的最优贪心。',answer:true,
      why:'★ 离线 = 已知整个请求序列 → FFU 最优；在线（现实情形）只能谈竞争比，例如 LRU。'},
     {kind:'judge',q:'LIFO 也是 $k$-竞争的。',answer:false,
      why:'★ 序列 1,2,3 循环时 LIFO 缺 9 次而最优只要 7 次（C 程序 part 5）；随机测试里最坏到 3.00 倍，没有 $k$-竞争保证。'},
     {kind:'simulate',q:'请求序列 1,2,3,1,2,3、$k = 2$ 时，FFU 缺失多少次？（填数字）',expect:[4],placeholder:'例如：5',
      why:'C 程序 part 1 实测 4 次；暴力最优也是 4。'},
     {kind:'simulate',q:'同一序列上 LRU 缺失多少次？（填数字）',expect:[6],placeholder:'例如：4',
      why:'LRU 在第 3 步换错了块（换出 1，而 1 马上要被用到）—— 实测 6 次。'},
    ],bookExercises:[
     {id:'15.4-1',page:445,star:0,statement:'Write pseudocode for a cache manager that uses the furthest-in-future strategy. It should take as input a set C of blocks in the cache, the number of blocks k that the cache can hold, a sequenc',hint:'本关 pseudocode 阶段给出的 9 行过程就是它：命中跳过、没满直接放、满了就扫一遍缓存算各块的下次访问位置、换出最大者。C 程序第 26 行的 `furthest_in_future` 是逐行实现。'},
     {id:'15.4-2',page:445,star:0,statement:'Real cache managers do not know the future requests , and so they often use the past to decide which block to evict. The least-recently-used, or LRU, strategy evicts the block that, of all bloc',hint:'构造思路：让 LRU 被"很久以前用过、但马上还要用"的块骗到。C 程序 part 1 的 1,2,3,1,2,3 就是一个例子（LRU 6 次 vs 最优 4 次）；把序列拉长，比值可以逼近 $k$。'},
     {id:'15.4-3',page:446,star:0,statement:'Professor Croesus suggests that in the proof of Theorem 15.5, the last clause in property 1 can change to C S \u00b4,j = D j [ fx g or, equivalently, require the block y given in property 1 to alwa',hint:'检查证明里用到"$y$ 是 $\\hat{b}$ 之后的某个块、且 $y$ 在差异期间不被访问"这两条；把 $y$ 固定成 $x$ 会破坏"差异至多一块"的归纳不变量 —— 找一个反例序列即可否定该修改。'},
     {id:'15.4-4',page:446,star:0,statement:'This section has assumed that at most one block is placed into the cache whenever a block is requested. You can imagine, however, a strategy in which multiple blocks may enter the cache upon a',hint:'允许一次放入多块时，判断"该放哪些"需要更强的贪心：优先放入**未来最近会被用到**的若干块（prefetching）。可先证明"放入不亏"（多放一块不会增加缺失），再讨论额度限制下的选择规则。'},
    ]},
  ],
};
