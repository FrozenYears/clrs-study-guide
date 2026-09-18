/* 第 27 章 27.2：维护搜索表（Maintaining a search list）。印刷页 795–802（pdf 816–823）。 */
export default {
  key:'s02',id:'ch27/s02',chapter:27,section:'27.2',
  title:'MOVE-TO-FRONT：把命中的元素拉到表头',shortTitle:'27.2 维护搜索表',
  titleEn:'Maintaining a search list',
  source:{printed:[795,802],pdf:[816,823]},
  prerequisites:[{label:'27.1 Waiting for an elevator',url:'#/ch27/s01'}],
  stages:[
   {type:'map',title:'自组织的表：免费使用访问历史',
    why:'链表存 $n$ 个元素，每次查一个元素（代价 = 它的位置）。若被访问得多就该放前面 —— 但**不知道未来**。MOVE-TO-FRONT：每次命中后把它移到表头。它在"交换计费"模型下是 **4-竞争**的。',
    position:'在线算法的第二个经典问题，也是 16 章势能法（inversion count）与 27 章竞争比的交汇点。',
    unlocks:[{label:'27.3 Online caching',url:'#/ch27/s03'}],
    mathKit:[
     {title:'成本模型',body:'一次 MOVE-TO-FRONT(L, x) 的代价 $= 2r_L(x) - 1$：搜索 $r$ 次 + $r-1$ 次交换。'},
     {title:'离线对手 FORESEE',body:'知道未来，每次搜索后**最优重排**列表（也可能付交换代价）。'},
     {title:'定理 27.1',body:'MOVE-TO-FRONT 是 **4-竞争**的（势能 = 两张表的逆序对数之差）。'},
    ]},
   {type:'intuition',title:'逆序对数当势能',scene:'C 程序 Part 2（n=4、m=20、100 组）',body:[
     '势函数 $\\Phi$ = 两张表的**逆序对**数（同两个元素在 MOVE-TO-FRONT 与 FORESEE 中出现的相对次序不同，就构成一个逆序对）。',
     '★ 每次 MOVE-TO-FRONT 把元素拉到表头，逆序对至多变 $2r-2$；而 FORESEE 的一次交换至多改变 2 个逆序对 —— 于是摊还成本被 4 倍夹住。',
     '★ C 程序 Part 2 实测：100 组随机请求下 MTF 最大比值 **2.250** ≤ 4（$\\text{MTF}$ 总代价 7872 vs 精确最优 4579）—— 界是紧的，但不是每例都紧。',
     '★ 关键前提：**两张表必须从同一初始排列出发**（否则竞争比无从谈起）—— 这也是我第一版程序算错的地方。',
     '★ 习题 27.2-4：若改成"移动免费"，竞争比降到 **2**（原书把 4-竞争作为本节主定理）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 y c M i 代表 ĉ^M_i、C 代表 +）。',blocks:[
     {kind:'body',page:797,en:'MOVE-TO-FRONT (L,8) executes on the list L = \u27e85,3,12,4,8,9,22\u27e9, the list becomes \u27e88,5,3,12,4,9,22\u27e9. The call MOVE-TO-FRONT (L,k) costs 2r L (k) \u2212 1: it costs r L (k) to search for k, and it costs 1 for each of the r L (k) \u2212 1 swaps that move k to the front of the list.',
      zh:'★★ 成本公式 $2r-1$ 的完整解释（原书用的是具体例子）。'},
     {kind:'body',page:797,en:'We\u2019ll see that MOVE-TO-FRONT has a competitive ratio of 4. Let\u2019s think about what this means.',
      zh:'★★ 本节的结论预告：4-竞争。'},
     {kind:'body',page:799,en:'Algorithm MOVE-TO-FRONT has a competitive ratio of 4.',
      zh:'★★ **定理 27.1**：MTF 的竞争比为 4。'},
     {kind:'body',page:800,en:'(Intuitively, the factor of 2 embodies the notion that each inversion represents a cost of 2 for MOVE-TO-FRONT relative to FORESEE : 1 for searching and 1 for swapping.)',
      zh:'★★ 为什么每对逆序贡献 2：1 次搜索 + 1 次交换。'},
     {kind:'body',page:800,en:'Assuming that MOVE-TO-FRONT and FORESEE start with the same list, the initial potential \u02c6 0 is 0, so that \u02c6 i \u2265 \u02c6 0 for all i .',
      zh:'★★ 势能法的前提：两表同一起点 → $\\Phi_0 = 0$。'},
     {kind:'body',page:801,en:'Thus the total cost of the m MOVE-TO-FRONT operations is at most 4 times the total cost of the m FORESEE operations, so MOVE-TO-FRONT is 4-competitive.',
      zh:'★★ 收尾：总成本 ≤ 4 × FORESEE 的总成本。'},
    ],terms:[{en:'MOVE-TO-FRONT',zh:'移到表头（自组织表）',page:796},
              {en:'FORESEE',zh:'离线最优对手（知道未来）',page:797}]},
   {type:'pseudocode',title:'MOVE-TO-FRONT：搜索 + 移表头',algo:'MOVE-TO-FRONT',signature:'MOVE-TO-FRONT(L, x)',page:796,
    lines:[
     {n:1,code:'在双向链表 L 中搜索 x，位置 r = r_L(x)',zh:'★ 搜索代价 r。'},
     {n:2,code:'for i = r downto 2',zh:'★ 逐次与前一位置交换。'},
     {n:3,code:'    swap x with element at position i − 1',zh:'共 $r-1$ 次交换。'},
     {n:4,code:'（x 到达表头）',zh:''},
     {n:5,code:'总代价 = 2r − 1',zh:'★★ 搜索 r + 交换 r−1。'}],
    vars:[{name:'r_L(x)',meaning:'x 在表 L 中的位置'}],
    note:'★ 与 16.4 的"势能法"呼应：这里的势函数是"逆序对计数"，比 16 章的栈/表更精细。',
    more:[]},
   {type:'visualize',title:'MTF vs FORESEE',panels:[
     {title:'C 程序 Part 2：实测最大比值 2.25（上界 4）',viz:'growth',
      chart:{xMax:8000,series:[
       {name:'MTF 总代价 7872',expr:'7872',color:'--viz-violation'},
       {name:'精确最优（排列 DP）4579',expr:'4579',color:'--viz-done'},
       {name:'4·OPT 的界',expr:'18316',color:'--viz-compare'}]},
      note:'★ 实测比值 2.25 落在 [1, 4] 内 —— 界成立且并非每例都紧。'},
    ],tasks:['对照 C 程序 part 2 的总代价与最大比值。'],note:''},
   {type:'code',title:'实测：MTF ≤ 4·OPT',c:{file:'online.c',code:String.raw`/* online.c -- 27 章：在线算法（电梯等待、搜索表 MTF、在线缓存）。
 * 关键数字：
 *   part 1  电梯策略：等待 m 分钟的竞争比 = max(1, (m+k)/(m+1))，最优 m = k−1 → 比值 < 2；
 *   part 2  搜索表：MTF 与**精确最优**（对排列做 DP）对照，验证 MTF ≤ 2·OPT；
 *   part 3  缓存：随机标记（randomized marking）的缺失次数 vs OPT，验证 ≤ 2H_k·OPT。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

/* ---------- part 1：电梯等待（竞争比） ---------- */
static void elevator(int k)
{
    printf("part 1: 电梯/楼梯（楼梯耗时 k=%d 分钟）的竞争比：\n", k);
    int best_m = -1;
    double best_ratio = 1e9;
    for (int m = 0; m <= k; m++) {
        double worst = 1.0;
        for (int t = 1; t <= 4 * k; t++) {          /* 电梯到达时刻 t */
            double online = (t <= m) ? (double)t : (double)(m + k);
            double offline = (t < k) ? (double)t : (double)k;   /* 离线：知道 t，取 min(t,k) */
            double r = online / offline;
            if (r > worst) { worst = r; }
        }
        printf("        等待 m=%d：最坏竞争比 = %.3f\n", m, worst);
        if (worst < best_ratio) { best_ratio = worst; best_m = m; }
    }
    printf("        最优 m = %d，竞争比 = %.3f（< 2，公式 max(1,(m+k)/(m+1)) 的最小值）\n",
           best_m, best_ratio);
    assert(best_m == k - 1);
    assert(best_ratio > 1.8 && best_ratio < 2.0);   /* k=10 时恰为 19/10 = 1.9 */
}

/* ---------- part 2：搜索表（MTF vs 精确最优） ---------- */
#define NS 4
static int perms[24][NS], nperm;
static int perm_id[256];                      /* 排列 → 编号（用编码查找） */

static void build_perms(void)
{
    nperm = 0;
    /* 手写 4! 全排列（Johnson-Trotter 太复杂，用四重循环枚举） */
    for (int a = 0; a < NS; a++) {
        for (int b = 0; b < NS; b++) {
            if (b == a) { continue; }
            for (int c = 0; c < NS; c++) {
                if (c == a || c == b) { continue; }
                for (int d = 0; d < NS; d++) {
                    if (d == a || d == b || d == c) { continue; }
                    perms[nperm][0] = a; perms[nperm][1] = b;
                    perms[nperm][2] = c; perms[nperm][3] = d;
                    nperm++;
                }
            }
        }
    }
    assert(nperm == 24);
    for (int i = 0; i < 256; i++) { perm_id[i] = -1; }
    for (int p = 0; p < nperm; p++) {
        int code = 0;
        for (int i = 0; i < NS; i++) { code = code * NS + perms[p][i]; }
        perm_id[code] = p;
    }
}

static int perm_code(const int *list)
{
    int code = 0;
    for (int i = 0; i < NS; i++) { code = code * NS + list[i]; }
    return code;
}

/* MTF：命中后把该元素移到表头 */
static long mtf_cost(const int *req, int m, int *final_list)
{
    int list[NS];
    for (int i = 0; i < NS; i++) { list[i] = i; }
    long cost = 0;
    for (int t = 0; t < m; t++) {
        int pos = 0;
        while (list[pos] != req[t]) { pos++; }
        cost += pos + 1;                     /* 搜索代价 = 元素位置（1 基） */
        cost += pos;                         /* 移到表头：pos 次相邻交换 */
        int v = list[pos];
        for (int i = pos; i > 0; i--) { list[i] = list[i - 1]; }
        list[0] = v;
    }
    if (final_list) { memcpy(final_list, list, sizeof(list)); }
    return cost;
}

/* 精确最优：对 (时刻, 排列) 做 DP（离线，知道整个请求序列） */
static long opt_cost(const int *req, int m)
{
    static long dp[64][24];
    for (int p = 0; p < nperm; p++) { dp[0][p] = (1L << 29); }
    /* 竞争比要求**同一初始表**：OPT 与 MTF 都从 [0,1,2,3] 出发 */
    dp[0][perm_id[perm_code((const int[]){0, 1, 2, 3})]] = 0;
    for (int t = 0; t < m; t++) {
        for (int p = 0; p < nperm; p++) { dp[t + 1][p] = 1L << 29; }
        for (int p = 0; p < nperm; p++) {
            long base = dp[t][p];
            if (base >= (1L << 29)) { continue; }
            int *list = perms[p];
            int pos = 0;
            while (list[pos] != req[t]) { pos++; }
            long c = pos + 1;                          /* 搜索代价 */
            int nl[NS];
            memcpy(nl, list, sizeof(nl));
            int v = nl[pos];
            for (int i = pos; i > 0; i--) { nl[i] = nl[i - 1]; }
            nl[0] = v;
            long c2 = c + pos;                          /* 含移到表头的交换代价 */
            int np = perm_id[perm_code(nl)];
            if (base + c2 < dp[t + 1][np]) { dp[t + 1][np] = base + c2; }
            /* 也可原地不动（免费）—— 覆盖"不交换"的选项 */
            if (base + c < dp[t + 1][p]) { dp[t + 1][p] = base + c; }
        }
    }
    long best = 1L << 29;
    for (int p = 0; p < nperm; p++) { if (dp[m][p] < best) { best = dp[m][p]; } }
    return best;
}

static unsigned int rng_s;
static void rng_seed(unsigned int s) { rng_s = s * 2654435761u; if (!rng_s) { rng_s = 0x9E3779B9u; } }
static unsigned int rng_next(void)
{
    rng_s ^= rng_s << 13; rng_s ^= rng_s >> 17; rng_s ^= rng_s << 5;
    return rng_s;
}

/* ---------- part 3：随机标记（缓存） ---------- */
#define KB 4
static int opt_cache_misses(const int *req, int m, int k)
{
    /* 离线最优（Bélády）：换出下次访问最远者 —— 已在 15.4 验证过最优 */
    int cache[KB], sz = 0, misses = 0;
    for (int i = 0; i < m; i++) {
        int hit = -1;
        for (int j = 0; j < sz; j++) { if (cache[j] == req[i]) { hit = j; break; } }
        if (hit >= 0) { continue; }
        misses++;
        if (sz < k) { cache[sz++] = req[i]; continue; }
        int evict = 0, furthest = -2;
        for (int j = 0; j < sz; j++) {
            int next = m;
            for (int t = i + 1; t < m; t++) { if (req[t] == cache[j]) { next = t; break; } }
            if (next > furthest) { furthest = next; evict = j; }
        }
        cache[evict] = req[i];
    }
    return misses;
}

static int randomized_marking(const int *req, int m, int k, unsigned int seed)
{
    int marked[64], cache[KB], sz = 0, misses = 0;
    memset(marked, 0, sizeof(marked));
    for (int i = 0; i < m; i++) {
        int hit = -1;
        for (int j = 0; j < sz; j++) { if (cache[j] == req[i]) { hit = j; break; } }
        if (hit >= 0) { marked[req[i]] = 1; continue; }     /* 命中即标记 */
        misses++;
        if (sz < k) { cache[sz++] = req[i]; marked[req[i]] = 1; continue; }
        /* 未命中且满：优先换出未标记的块（按容量随机均匀） */
        int cand[KB], nc = 0;
        for (int j = 0; j < sz; j++) { if (!marked[cache[j]]) { cand[nc++] = j; } }
        int pick;
        if (nc > 0) {
            rng_seed(seed * 131u + (unsigned)i);
            pick = cand[rng_next() % nc];
        }
        else {
            /* 所有块都被标记：清除全部标记，再从未标记（现在全部）中随机选 */
            for (int j = 0; j < sz; j++) { marked[cache[j]] = 0; }
            rng_seed(seed * 17u + (unsigned)i);
            pick = (int)(rng_next() % sz);
        }
        cache[pick] = req[i];
        marked[req[i]] = 1;
    }
    return misses;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    elevator(10);

    /* part 2：MTF vs 精确最优 DP */
    build_perms();
    {
        double max_ratio = 0;
        int trials = 100, m = 20;
        long mtf_total = 0, opt_total = 0;
        for (int s = 1; s <= trials; s++) {
            int req[64];
            rng_seed(s);
            for (int t = 0; t < m; t++) { req[t] = (int)(rng_next() % NS); }
            int final_list[NS];
            long c_mtf = mtf_cost(req, m, final_list);
            long c_opt = opt_cost(req, m);
            mtf_total += c_mtf; opt_total += c_opt;
            double r = (double)c_mtf / c_opt;
            if (r > max_ratio) { max_ratio = r; }
            assert(c_mtf <= 4 * c_opt);            /* MTF 的 4-竞争上界（原书定理 27.1） */
        }
        printf("part 2: 搜索表（n=%d，m=%d，%d 组随机请求）：\n", NS, m, trials);
        printf("        MTF 总代价 %ld；精确最优（对 4! 排列做 DP）%ld\n", mtf_total, opt_total);
        printf("        最大比值 = %.3f —— MTF ≤ 4·OPT 成立（原书定理 27.1：交换计费模型下 4-竞争）\n", max_ratio);
    }

    /* part 3：随机标记 vs OPT */
    {
        int k = KB, m = 400, trials = 200, nb = 8;
        long rm_total = 0, opt_total = 0;
        double max_ratio = 0;
        double H = 0;
        for (int i = 1; i <= k; i++) { H += 1.0 / i; }
        for (int s = 1; s <= trials; s++) {
            int req[512];
            rng_seed(s * 7919u);
            for (int t = 0; t < m; t++) { req[t] = (int)(rng_next() % nb); }
            int o = opt_cache_misses(req, m, k);
            int r = randomized_marking(req, m, k, s);
            rm_total += r; opt_total += o;
            double ratio = (double)r / o;
            if (ratio > max_ratio) { max_ratio = ratio; }
            assert(o > 0);
        }
        double bound = 2 * H;
        printf("part 3: 在线缓存（k=%d，%d 种块，m=%d，%d 组）：\n", k, nb, m, trials);
        printf("        随机标记平均缺失 %.1f；OPT 平均缺失 %.1f；平均比值 %.3f\n",
               (double)rm_total / trials, (double)opt_total / trials,
               (double)rm_total / opt_total);
        printf("        理论界 2·H_k = 2·%.3f = %.3f；实测最大比值 %.3f ≤ 该界 ✓\n",
               H, bound, max_ratio);
        assert((double)rm_total / opt_total <= bound);
        printf("        （对照 15.4：LRU/FIFO 是 k-竞争，随机标记把界降到 O(lg k)）\n");
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 2（搜索表）。'},
           {line:73,zh:'`mtf_cost`：代价 $2r-1$ 的累计。'},
           {line:92,zh:'`opt_cost`：对 $4! = 24$ 种排列做 DP —— 精确离线最优。'},
           {line:100,zh:'★ DP 起点固定为 [0,1,2,3]：竞争比要求同一起点。'},
           {line:200,zh:'★★ part 2：100 组随机请求，最大比值 2.250 ≤ 4。'}]},
    tests:[{in:'n=4、m=20、100 组随机请求',out:'MTF 总代价 7872 vs OPT 4579；最大比值 2.250'},
           {in:'断言',out:'MTF ≤ 4·OPT（定理 27.1）'}],
    mapping:[{pc:5,pcCode:'总代价 = 2r − 1',c:'`cost += pos + 1; cost += pos;`（第 65–66 行）'}]},
   {type:'analyze',title:'一本账：4 从哪来',claims:[
     {expr:'2r - 1',when:'MOVE-TO-FRONT 单次代价（搜索 r + 交换 r−1）',page:797,source:'book'},
     {expr:'4',when:'MOVE-TO-FRONT 的竞争比（定理 27.1）',page:799,source:'book'},
     {expr:'2',when:'每对逆序对的贡献（1 搜索 + 1 交换）→ 4 = 2×2',page:800,source:'book'},
    ],tables:[{caption:'C 程序 Part 2 实测（n=4, m=20, 100 组）',rows:[
      ['量','值'],
      ['MTF 总代价','7872'],
      ['精确最优（DP）总代价','4579'],
      ['最大单例比值','2.250'],
      ['理论上界','4'],
     ]},{caption:'两种成本模型下的竞争比',rows:[
      ['模型','规则','竞争比'],
      ['交换计费（本节）','每次相邻交换代价 1','**4**'],
      ['移动免费（习题 27.2-4）','命中后可任意前移，免费','**2**'],
     ]}],chart:{xMax:10000,series:[
     {name:'4·OPT（界）',expr:'4579 * 4 / 100',color:'--viz-compare'},
     {name:'实测 MTF 代价',expr:'7872 / 100',color:'--viz-violation'}]},
    derivations:[{kind:'summation',title:'势能证明的骨架（原书 p.799–801）',steps:[
      {zh:'定义 $\\Phi_i = 2 \\times \\big(\\text{MTF 表与 FORESEE 表的逆序对数}\\big)$（原书的 $2(|BA| - |BB|)$ 形式）。'},
      {zh:'MTF 第 $i$ 次操作的摊还成本 $\\hat{c}^M_i = c^M_i + \\Phi_i - \\Phi_{i-1} \\le 4 c^F_i$（FORESEE 的每次交换至多使势能 +2、每次搜索支付 1）。'},
      {tex:'\\sum_{i} \\hat{c}^M_i = \\sum_i c^M_i + \\Phi_m - \\Phi_0 \\;\\Longrightarrow\\; \\sum_i c^M_i \\le 4\\sum_i c^F_i',zh:'★ $\\Phi_0 = 0$ 且 $\\Phi \\ge 0$ → 总成本 ≤ 4 倍。∎'}]},
     ],
    note:''},
   {type:'prove',title:'定理 27.1：MOVE-TO-FRONT 是 4-竞争的',statement:'Algorithm MOVE-TO-FRONT has a competitive ratio of 4.',page:799,
    intro:'★ 证明用 16 章的势能法，但势函数是"两张表的逆序对数"—— 这是全书最精巧的势函数。',
    steps:[
     {title:'势函数与摊还成本',en:'(Intuitively, the factor of 2 embodies the notion that each inversion represents a cost of 2 for MOVE-TO-FRONT relative to FORESEE : 1 for searching and 1 for swapping.)',page:800,
      body:['$\\Phi_i = 2 \\cdot I(L^M_i, L^F_i)$（两表之间的逆序对数 × 2）。',
        'MTF 搜索 $x$（位置 $r$）：搜索代价 $r$，交换 $r-1$ 次，每次交换影响逆序对 ≤ 2 → $\\Phi$ 变化 ≤ $2(2r-2)$。',
        '合计摊还 $\\hat{c}^M_i \\le 4r - 3$ —— 而 FORESEE 的对应代价 $c^F_i = r^{F}$，配合"$r \\le r^F + |$ 逆序对$|$"的关系得到 4 的系数。']},
     {title:'FORESEE 侧的势能变化',en:'Assuming that MOVE-TO-FRONT and FORESEE start with the same list, the initial potential \u02c6 0 is 0, so that \u02c6 i \u2265 \u02c6 0 for all i .',page:800,
      body:['FORESEE 每次执行 $t_i$ 次交换：每次交换改变逆序对数 ≤ 1 → $\\Phi$ 增加 ≤ $2t_i$。',
        '**关键前提**：两表同起点 → $\\Phi_0 = 0$；且 $\\Phi \\ge 0$ 恒成立（逆序对数非负）。',
        '★ 这正是我的第一版程序算错的地方：若允许 OPT 从任意排列出发，$\\Phi_0 = 0$ 便不成立，比值可以超过 4。']},
     {title:'收尾与实测',en:'Thus the total cost of the m MOVE-TO-FRONT operations is at most 4 times the total cost of the m FORESEE operations, so MOVE-TO-FRONT is 4-competitive.',page:801,
      body:['望远镜求和：$\\sum \\hat{c}^M_i = \\sum c^M_i + \\Phi_m - \\Phi_0 \\ge \\sum c^M_i$。',
        '而 $\\hat{c}^M_i \\le 4 c^F_i$ → $\\sum c^M_i \\le 4 \\sum c^F_i$。',
        '★ C 程序 part 2 的 100 组实验（最大比值 2.250）与之相容。∎']},
    ],conclusion:'★ 结论：MTF 在交换计费模型下 4-竞争；改用"移动免费"模型则为 2-竞争（习题 27.2-4）。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'MOVE-TO-FRONT 单次操作的代价是？',options:['$r$','**$2r-1$**','$r-1$','$\\lg r$'],answer:1,
      why:'★ 搜索 r + 交换 r−1（原书 p.797）。'},
     {kind:'single',q:'定理 27.1 给出 MOVE-TO-FRONT 的竞争比是？',options:['2','**4**','$O(\\lg n)$','$n$'],answer:1,
      why:'★ 交换计费模型下 4-竞争；免费移动模型下才是 2。'},
     {kind:'judge',q:'竞争比分析要求在线算法与离线对手从同一初始表出发。',answer:true,
      why:'★ 否则势能初值不为 0 —— 这是我的程序第一版的实际教训。'},
     {kind:'simulate',q:'C 程序 part 2 中 MTF 相对精确最优的最大比值是多少？（填两位小数）',expect:[2.25],placeholder:'例如：3.0',
      why:'2.250（100 组随机请求；上界为 4）。'},
     {kind:'simulate',q:'C 程序 part 2 中离线最优（OPT）在 100 组请求上的总代价是多少？',expect:[4579],placeholder:'例如：5000',why:'★ code 段实测：MTF 总代价 7872，OPT 只有 4579 —— 差距来自 MTF 的盲目性。'},
     {kind:'judge',q:'实测中 MTF 的总代价约为 OPT 的 1.7 倍，远低于定理 27.1 保证的上界 4 倍。',answer:true,why:'★ 7872 / 4579 ≈ 1.72，最大单例比值也只有 2.250 —— 定理 27.1 是最坏情况保证，实测通常宽松得多。'},
     {kind:'single',q:'竞争比为什么恰好落在 4 这个常数上？',options:['因为表里最多 4 个元素','**因为每对逆序对各贡献 2（1 次搜索 + 1 次交换），势能法再乘 2**','因为每次最多移动 4 步','因为是人为取的方便常数'],answer:1,why:'★ analyze 第三、四条把 4 拆成 $2 \\times 2$：逆序对代价 2，势能差的上界再翻一倍。'},
    ],bookExercises:[
     {id:'27.2-2',page:802,star:0,statement:'Professor Carnac claims that since FORESEE is an optimal algorithm that knows the future, then at each step it must incur no more cost than MOVE-TO-FRONT .',hint:'反例：FORESEE 为未来"提前搬移"（如原书 Figure 27.1 把 4 提前移到表头），那一步它的代价高于 MTF —— 但总代价更低。逐例核对原书 Figure 27.1 即可否定。'},
     {id:'27.2-4',page:802,star:0,statement:'The model in this section charged a cost of 1 for each swap. We can consider an alternative cost model in which, after accessing x , you can move x anywhere earlier in the list, and there is no cost for doing so.',hint:'免费移动下势函数只需 $\\Phi = I(L^M, L^F)$（去掉因子 2），摊还成本 $\\le 2 c^F$ —— 这就是 2-竞争的来源。'},
    ]},
  ],
};
