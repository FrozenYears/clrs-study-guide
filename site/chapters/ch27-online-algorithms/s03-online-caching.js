/* 第 27 章 27.3：在线缓存（Online caching）。印刷页 802–819（pdf 823–840）。 */
export default {
  key:'s03',id:'ch27/s03',chapter:27,section:'27.3',
  title:'在线缓存：从 k-竞争到 O(lg k)',shortTitle:'27.3 在线缓存',
  titleEn:'Online caching',
  source:{printed:[802,819],pdf:[823,840]},
  prerequisites:[{label:'27.2 Maintaining a search list',url:'#/ch27/s02'}],
  stages:[
   {type:'map',title:'不知道未来时怎么换页',
    why:'15.4 的 FFU（换出下次最远者）需要**知道未来**；现实中不成立。本关比较在线策略：FIFO / LIFO / LRU / LFU，以及**随机标记**（randomized marking）—— 后者把竞争比从 $k$ 降到 $2H_k = O(\\lg k)$。',
    position:'本章收官，也是 15.4（离线缓存）的对偶：同一个问题，知道的未来从"全部"变成"没有"。',
    unlocks:[{label:'28.1 Solving systems of linear equations',url:'#/ch28/s01'}],
    mathKit:[
     {title:'四种经典策略',body:'FIFO（最早进）、LIFO（最晚进）、LRU（最久未用）、LFU（最少使用）。'},
     {title:'竞争比对照',body:'LRU / FIFO 是 $k$-竞争；LIFO 没有界；随机标记 $2H_k$-竞争（$H_k = \\sum 1/i$）。'},
     {title:'随机标记',body:'每块有一个标记位：命中即标记；缺失时优先换出**未标记**的块（随机选），全标记则清空重来。'},
    ]},
   {type:'intuition',title:'标记位就是"最近被碰过"的记号',scene:'C 程序 Part 3（k=4、8 种块、200 组）',body:[
     '随机标记的机制：命中 → 置标记；缺失且满 → 在**未标记**的块里随机换一个；若全被标记 → 全清后重新开始。',
     '★ 直觉：被标记 = "近期被访问过"，因此更可能再被访问 —— 先牺牲未标记的。随机化把"对手构造最坏序列"的能力打掉一半。',
     '★ C 程序 Part 3 实测：$k=4$，随机标记平均缺失 202.0、OPT 平均 117.9，平均比值 **1.713**、最大 **1.925**，都小于理论界 $2H_k = 4.167$。',
     '★ 与 15.4 的对照：LRU/FIFO 的界是 $k$（本例 $k=4$）；随机标记把界压到 $O(\\lg k)$ —— 随机化真心值钱。',
     '⚠ LIFO 没有竞争比保证（15.4 已实测它可被逼到 3 倍）—— "看起来合理的策略"未必有界。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 la st 是断词）。',blocks:[
     {kind:'body',page:802,en:'You can find the terminology used to describe the caching problem in Section 15.4, which you might wish to review before proceedin',
      zh:'★ 术语沿用 15.4（离线缓存）—— 本节只换"是否知道未来"。'},
     {kind:'body',page:803,en:'There are many online caching policies to determine which block to evict, in- cluding the following:',
      zh:'★ 策略清单的开头（四种策略随后列出）。'},
     {kind:'body',page:803,en:'\u2022 First-in, first-out (FIFO): evict the block that has been in the cache the longest time.',
      zh:'★ FIFO：换出在缓存里待得最久的。'},
     {kind:'body',page:803,en:'\u2022 Last-in, first-out (LIFO): evict the block that has been in the cache the shortest time.',
      zh:'★ LIFO：换出刚进来的（15.4 实测它可被逼没）。'},
     {kind:'body',page:803,en:'\u2022 Least Recently Used (LRU): evict the block whose la st use is furthest in the past.',
      zh:'★ LRU：换出最久未被使用的。'},
     {kind:'body',page:803,en:'\u2022 Least Frequently Used (LFU): evict the block that has been accessed the fewest times, breaking ties by choosing the block that h',
      zh:'★ LFU：换出访问次数最少的（并列时按下一条件打破）。'},
    ],terms:[{en:'randomized marking',zh:'随机标记（2H_k-竞争）',page:808},
              {en:'evict',zh:'换出',page:803}]},
   {type:'pseudocode',title:'RANDOMIZED-MARKING：9 行',algo:'RANDOMIZED-MARKING',signature:'RANDOMIZED-MARKING(C, k)',page:808,
    lines:[
     {n:1,code:'命中 b_i',zh:''},
     {n:2,code:'    标记 b_i',zh:'★ 命中即留痕。'},
     {n:3,code:'缺失且未满',zh:''},
     {n:4,code:'    放入 b_i 并标记',zh:''},
     {n:5,code:'缺失且满',zh:'★★ 需要换出。'},
     {n:6,code:'    若存在未标记的块',zh:''},
     {n:7,code:'        在未标记块中**均匀随机**选一个换出',zh:'★★ 随机化打掉对手的构造能力。'},
     {n:8,code:'    否则（全被标记）',zh:''},
     {n:9,code:'        清空所有标记，再随机换出一个',zh:'★ 开始新一轮"标记周期"。'}],
    vars:[{name:'标记位',meaning:'每块一位：本轮是否被访问过'}],
    note:'★ 竞争比 $2H_k$（$H_k = \\ln k + O(1)$）—— 这是"随机化"在在线算法里的第一次胜出。',
    more:[]},
   {type:'visualize',title:'实测比值与理论界',panels:[
     {title:'C 程序 Part 3：实测 ≤ 2H_k',viz:'growth',
      chart:{xMax:5,series:[
       {name:'随机标记平均比值 1.713',expr:'1.713',color:'--viz-done'},
       {name:'实测最大比值 1.925',expr:'1.925',color:'--viz-compare'},
       {name:'理论界 2H₄ = 4.167',expr:'4.167',color:'--viz-violation'}]},
      note:'★ 平均与最坏都远低于界 —— 界是保守的，但它是唯一可依赖的保证。'},
    ],tasks:['对照 C 程序 part 3 的平均缺失与最大比值。'],note:''},
   {type:'code',title:'实测：1.713 与 1.925',c:{file:'online.c',code:String.raw`/* online.c -- 27 章：在线算法（电梯等待、搜索表 MTF、在线缓存）。
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 3（在线缓存）。'},
           {line:134,zh:'`opt_cache_misses`：FFU（离线最优，15.4 已独立验证过最优性）。'},
           {line:155,zh:'`randomized_marking`：命中标记 / 缺失优先换未标记块 / 全标记则清空。'},
           {line:225,zh:'★★ part 3：k=4 时平均比值 1.713、最大 1.925 ≤ 2H₄ = 4.167。'}]},
    tests:[{in:'k=4、8 种块、m=400、200 组',out:'随机标记平均缺失 202.0 vs OPT 117.9；平均比值 1.713'},
           {in:'最大单例比值',out:'1.925 ≤ 2H₄ = 4.167（断言）'}],
    mapping:[{pc:7,pcCode:'在未标记块中均匀随机选一个换出',c:'`pick = cand[rng_next() % nc];`（第 171 行）'}]},
   {type:'analyze',title:'一本账：四种策略的界',claims:[
     {expr:'k',when:'LRU / FIFO 的竞争比（15.4 实测最坏 1.83 倍）',page:803,source:'book'},
     {expr:'2H_k',when:'随机标记的竞争比（$H_k = \\ln k + O(1)$）',page:808,source:'book'},
     {expr:'O(\\lg k)',when:'$2H_k$ 的量级 —— 比 $k$ 好得多',page:808,source:'book'},
    ],tables:[{caption:'在线缓存策略汇总（15.4 + 27.3）',rows:[
      ['策略','依据','竞争比'],
      ['FFU（离线）','未来','1（最优）'],
      ['LRU','过去（最久未用）','$k$'],
      ['FIFO','进入次序','$k$'],
      ['LFU','访问频次','无一般界（可被构造反例）'],
      ['LIFO','最近进入','无界（15.4 实测 3.00）'],
      ['**随机标记**','标记位 + 随机','**$2H_k$**'],
     ]},{caption:'C 程序 Part 3 实测（k=4）',rows:[
      ['量','值'],
      ['随机标记平均缺失','202.0'],
      ['OPT 平均缺失','117.9'],
      ['平均比值','1.713'],
      ['实测最大比值','1.925'],
      ['理论界 2H₄','4.167'],
     ]}],chart:{xMax:8,series:[
     {name:'k = 4 的界（LRU/FIFO）',expr:'4',color:'--viz-violation'},
     {name:'2H₄ = 4.167（随机标记）',expr:'4.167',color:'--viz-compare'},
     {name:'实测平均 1.713',expr:'1.713',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'$2H_k$ 的来源直觉',steps:[
      {zh:'把请求序列按"标记周期"切段：每段内每个块至多被标记一次，段长 ≥ 该段的请求数。'},
      {zh:'段内最优算法（OPT）至少缺失若干次（需要把未标记块换进来）；随机标记每段的期望缺失 ≤ $2 \\times$ 段的"新块数"。'},
      {tex:'\\frac{E[\\text{miss}(RM)]}{\\text{miss}(OPT)} \\le 2H_k',zh:'★ $H_k = \\sum_{i=1}^{k} 1/i \\approx \\ln k$：随机化的收益是指数级的。∎'}]},
     ],
    note:''},
   {type:'prove',title:'随机标记的 2H_k 界（证明骨架）',statement:'There are many online caching policies to determine which block to evict, in- cluding the following:',page:803,
    intro:'★ 原书给出完整的势能/分块证明；这里给出可核查的骨架与实测印证。',
    steps:[
     {title:'在线策略的两种失败模式',en:'\u2022 Least Recently Used (LRU): evict the block whose la st use is furthest in the past.',page:803,
      body:['**确定性策略的弱点**：对手知道你的规则，可以构造"每次都换走马上要用的块"的序列 → 竞争比 $k$（LRU/FIFO）。',
        '**LIFO 更糟**：连 $k$ 的界都没有（15.4 实测 3.00 倍，且可任意放大）。',
        '★ LIFO 与 LFU 都是"看起来合理但无界"的例子 —— 在线算法的界必须证明，不能凭直觉。']},
     {title:'随机化如何取胜',en:'You can find the terminology used to describe the caching problem in Section 15.4, which you might wish to review before proceedin',page:802,
      body:['随机标记在"未标记块"里**均匀随机**换出 → 对手无法预知哪个块会被换掉。',
        '把请求按标记周期分段：每段内 OPT 至少要把一些"段内新出现的块"换进来；随机标记每段的期望缺失不超过 $2H_k$ 倍。',
        '★ 关键量 $H_k = 1 + 1/2 + \\cdots + 1/k \\approx \\ln k$ 出现在"随机选择第 $i$ 个块"的期望代价里。']},
     {title:'实测印证',en:'\u2022 First-in, first-out (FIFO): evict the block that has been in the cache the longest time.',page:803,
      body:['C 程序 part 3：$k=4$、8 种块、400 请求 × 200 组随机序列。',
        '实测平均比值 1.713、最大 1.925，均 ≤ $2H_4 = 4.167$（断言把这条写进程序）。',
        '★ 对照 LRU/FIFO 的 $k=4$ → 随机标记在**同一 k** 下把界从 4 压到 4.167 的渐近形式 $O(\\lg k)$（k 越大优势越明显）。∎']},
    ],conclusion:'★ 结论：随机化 + 标记位 = $2H_k$ 竞争比；这是在线缓存理论的核心成果，也是随机化算法威力的第一个例子。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'LRU 与 FIFO 的竞争比是多少？',options:['1','**$k$**','$2H_k$','无界'],answer:1,
      why:'★ 15.4 已实测（k=2/3 时最坏 1.83 倍）；与随机标记的 $O(\\lg k)$ 对比明显。'},
     {kind:'single',q:'随机标记的竞争比是？',options:['$k$','$\\lg k$','**$2H_k$（≈ 2 ln k）**','无界'],answer:2,
      why:'★ 原书 p.808 的结论。'},
     {kind:'judge',q:'LIFO 也是一个 k-竞争的策略。',answer:false,
      why:'★ LIFO 无界（15.4 part 5 实测最坏 3.00 倍，且可构造任意差）。'},
     {kind:'simulate',q:'C 程序 part 3 中最大单例比值是多少？（填三位小数）',expect:[1.925],placeholder:'例如：2.5',
      why:'1.925 ≤ 2H₄ = 4.167（200 组实测）。'},
     {kind:'simulate',q:'k=4 时 $2H_4$ 的值是多少（填三位小数）？',expect:[4.167],placeholder:'例如：2.000',why:'★ code 段的断言就写成 1.925 ≤ 2H₄ = 4.167，$H_4 = 1 + 1/2 + 1/3 + 1/4$。'},
     {kind:'simulate',q:'随机标记相对 OPT 的平均缺失比是多少（填三位小数）？',expect:[1.713],placeholder:'例如：1.000',why:'★ code 段实测：平均比值 1.713 —— 比理论上界 4.167 小得多，但仍是 $>1$ 的代价。'},
     {kind:'single',q:'15.4 的 FFU（Belady）为什么不能直接用在这个在线场景里？',options:['因为它太慢','**因为它要求知道未来的访问序列**','因为它不是 $k$-竞争的','因为它只支持固定块大小'],answer:1,why:'★ map 段点明：FFU 换出「下次最远者」，而在线算法恰恰没有未来 —— 本关所有策略都是它的替代品。'},
    ],bookExercises:[
     {id:'27.3-1',page:814,star:0,statement:'For the cache sequence (27.10), show the contents of the cache after each request and count the number of cache misses. How many misses does each epoch incur?',hint:'照那个请求序列逐个模拟标记式算法：命中就把该块的「未用过」标记清掉，一旦所有块都被标过就开新一轮（epoch）并重置标记。把每一步的缓存内容列成表，缺失数按 epoch 分组自己数出来 —— 别凭记忆给结论。'},
     {id:'27.3-2',page:814,star:0,statement:'Show that LFU has a competitive ratio of Θ(n/k) for the online caching problem with n requests and a cache of size k.',hint:'给对手一套固定打法：先用 k 个各只出现过一次的块填满缓存，再不断引入「只出现一次的新块」并穿插高频块。LFU 每次踢掉的都是刚进来的低频块，而 OPT 每轮只需一次缺失。把两段代价之比写成 n 与 k 的函数，上下界都要给。'},
    ]},
  ],
};
