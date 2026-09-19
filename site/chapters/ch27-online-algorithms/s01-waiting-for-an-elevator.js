/* 第 27 章 27.1：等待电梯（Waiting for an elevator）。印刷页 792–795（pdf 813–816）。 */
export default {
  key:'s01',id:'ch27/s01',chapter:27,section:'27.1',
  title:'在线算法：没有未来的竞争比',shortTitle:'27.1 等待电梯',
  titleEn:'Waiting for an elevator',
  source:{printed:[792,795],pdf:[813,816]},
  prerequisites:[{label:'26.3 Parallel merge sort',url:'#/ch26/s03'}],
  stages:[
   {type:'map',title:'在线算法与竞争比',
    why:'在线算法**不知道未来输入**就必须立刻决策。评价标准不是"最优"而是**竞争比** $c$：$\\text{cost}(ALG) \\le c \\cdot \\text{cost}(OPT) + O(1)$（OPT 知道全部未来）。$c$ 越接近 1 越好。',
    position:'第 VII 部分（选讲）的算法设计新范式：放弃"最优"，追求"有界的遗憾"。本关用等待电梯这个日常例子把定义讲透。',
    unlocks:[{label:'27.2 Maintaining a search list',url:'#/ch27/s02'}],
    mathKit:[
     {title:'竞争比',body:'若对一切输入序列都有 $\\text{cost}(A) \\le c\\cdot\\text{cost}(OPT)$，称 $A$ 是 $c$-竞争的。'},
     {title:'下界',body:'$c \\ge 1$；$c = 1$ 意味着在线算法与"先知"一样好。'},
     {title:'本关策略',body:'等 $m$ 分钟；电梯来了就乘（代价 $t$），否则走楼梯（代价 $m + k$）——最优 $m = k-1$ 时竞争比 $< 2$。'},
    ]},
   {type:'intuition',title:'等 9 分钟还是直接走楼梯',scene:'楼梯耗时 k = 10 分钟（C 程序 Part 1）',body:[
     '三种极端策略：**永远走楼梯**（$c = k$，对 k=10 即 10）、**永远等**（$c$ 无界 —— 电梯可能永远不来）、**等 $m$ 分钟后走**。',
     '★ 竞争比公式：若电梯在 $t$ 分钟到达，在线代价 $= t$（当 $t \\le m$）或 $m + k$（当 $t > m$）；离线代价 $= \\min(t, k)$。最坏比值 $= \\max(1, (m+k)/(m+1))$，在 $m = k-1$ 取最小。',
     '★ C 程序实测（k=10）：枚举 $m = 0..10$，最优是 $m = 9$，竞争比 **1.900**（= 19/10 < 2）—— 与"在线算法可以做到 2 倍以内"的结论吻合。',
     '★ 注意"永远等"的竞争比是**无界**的：这是在线算法分析的典型现象 —— 平衡"最坏情况"与"常见情况"要靠策略参数。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 ent 是断词残片）。',blocks:[
     {kind:'body',page:792,en:'ent approach. Instead of assuming anything about the future input, we employ a conservative strategy of limiting how poor a soluti',
      zh:'★★ 在线算法的思路：不假设未来，改为"限制最坏情况有多差"（后半句接 might be）。'},
     {kind:'body',page:793,en:'If an online algorithm has a competitive ratio of c , we say that it is c -competitive.',
      zh:'★★ $c$-竞争的定义。'},
     {kind:'body',page:793,en:'The competitive ratio is always at least 1, so that we want an online algorithm with a competitive ratio as close to 1 as possible',
      zh:'★ 竞争比下界为 1 —— 越接近 1 越好。'},
     {kind:'body',page:793,en:'( m + 1 if m ≤ k \u2212 1; k if m ≥ k: (27.1)',
      zh:'★ 式 (27.1)：本关成本函数的分段形式。'},
    ],terms:[{en:'competitive ratio',zh:'竞争比',page:793},
              {en:'online algorithm',zh:'在线算法',page:792}]},
   {type:'pseudocode',title:'WAIT-THEN-WALK：等待 m 分钟',algo:'WAIT-THEN-WALK',signature:'WAIT-THEN-WALK(m, k)',page:793,
    lines:[
     {n:1,code:'等待电梯，至多等 m 分钟',zh:'★ m 是策略参数。'},
     {n:2,code:'if 电梯在 t <= m 分钟内到达',zh:'★ 乘电梯走人。'},
     {n:3,code:'    cost = t',zh:'代价 = 等待时间。'},
     {n:4,code:'else 走楼梯',zh:'★ 放弃等待。'},
     {n:5,code:'    cost = m + k',zh:'已等 m 分钟 + 楼梯 k 分钟。'},
     {n:6,code:'离线 OPT（知道 t 的未来）: cost = min(t, k)',zh:'★ 这就是比较基准。'}],
    vars:[{name:'m',meaning:'等待上限（策略参数）'},{name:'k',meaning:'走楼梯的耗时'}],
    note:'★ 竞争比 = $\\max_{t}\\ \\text{online}(t)/\\text{offline}(t)$；C 程序把 $t$ 枚举到 $4k$ 求最坏值。',
    more:[]},
   {type:'visualize',title:'竞争比随 m 的变化',panels:[
     {title:'C 程序 Part 1：k=10 时枚举 m',viz:'growth',
      chart:{xMax:12,series:[
       {name:'最优 1.9（m=9=k−1）',expr:'1.9',color:'--viz-done'},
       {name:'永远走楼梯 m=0：10',expr:'10',color:'--viz-violation'},
       {name:'理论天花板 2',expr:'2',color:'--viz-compare'}]},
      note:'★ 从 m=0 的 10 一路降到 m=9 的 1.9 —— 参数选择把"最坏遗憾"压到 2 倍以内。'},
    ],tasks:['对照 C 程序 part 1 的 11 行枚举输出。'],note:''},
   {type:'code',title:'实测：最优 m = 9、竞争比 1.9',c:{file:'online.c',code:String.raw`/* online.c -- 27 章：在线算法（电梯等待、搜索表 MTF、在线缓存）。
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 1（电梯）。'},
           {line:11,zh:'`elevator`：枚举 m、对每个 m 取最坏 t 的比值。'},
           {line:20,zh:'★ 在线代价 vs 离线代价（$\\min(t,k)$）的比值计算。'},
           {line:30,zh:'★★ part 1：最优 m = k−1 = 9，竞争比 1.900。'}]},
    tests:[{in:'k = 10，枚举 m = 0..10',out:'最优 m = 9，竞争比 1.900'},
           {in:'极端策略对照',out:'m=0（永远走楼梯）比值 10；m≥k 时对"电梯永不来"无界'}],
    mapping:[{pc:6,pcCode:'cost = min(t, k)',c:'`double offline = (t < k) ? (double)t : (double)k;`（第 20 行）'}]},
   {type:'analyze',title:'一本账：三种策略的竞争比',claims:[
     {expr:'c \\ge 1',when:'竞争比的下界（在线不可能比先知更好）',page:793,source:'book'},
     {expr:'\\max(1, (m+k)/(m+1))',when:'"等 m 分钟"策略的最坏竞争比',page:793,source:'book'},
     {expr:'1.9',when:'k=10、m=9 时的实测竞争比（C 程序 part 1）',page:793,source:'book'},
    ],tables:[{caption:'C 程序 Part 1 的枚举（k=10）',rows:[
      ['策略','最坏竞争比'],
      ['m=0（永远走楼梯）','10.000'],
      ['m=4','2.800'],
      ['m=8','2.000'],
      ['**m=9（最优）**','**1.900**'],
      ['m=10','2.000'],
     ]},{caption:'在线 vs 离线（本章的共同框架）',rows:[
      ['要素','在线算法','离线算法（OPT/FORESEE）'],
      ['未来知识','无','全知'],
      ['目标','竞争比尽量小','真正最优'],
      ['本关实现','等 m 分钟后走','$\\min(t,k)$'],
     ]}],chart:{xMax:12,series:[
     {name:'(m+k)/(m+1)（k=10）',expr:'(n + 10) / (n + 1)',color:'--viz-done'},
     {name:'1（理想）',expr:'1',color:'--viz-compare'}]},
    derivations:[{kind:'summation',title:'最坏比值的推导',steps:[
      {zh:'$t \\le m$ 时在线代价 $= t$、离线 $= t$（因为 $t \\le m \\le k$）→ 比值 1。'},
      {zh:'$t > m$ 时在线 $= m + k$；离线 $= \\min(t,k)$。当 $t \\ge k$ 时比值 $= (m+k)/k$；当 $m < t < k$ 时比值 $= (m+k)/t$，在 $t = m+1$ 取最大。'},
      {tex:'c(m) = \\max\\left(1,\\ \\frac{m+k}{m+1}\\right)',zh:'★ 递减函数 → 取最大允许的 $m = k-1$（原书式 27.1 的边界），C 程序实测 1.9。∎'}]},
     ],
    note:''},
   {type:'prove',title:'竞争比下界与最优参数',statement:'The competitive ratio is always at least 1, so that we want an online algorithm with a competitive ratio as close to 1 as possible',page:793,
    intro:'★ 两个结论：下界为 1（平凡但重要），以及"等 k−1 分钟"是这一族策略里的最优。',
    steps:[
     {title:'下界 1',en:'If an online algorithm has a competitive ratio of c , we say that it is c -competitive.',page:793,
      body:['对任何输入序列，离线最优都不比任何算法差（它知道全部未来并可选最优）。',
        '所以 $\\text{cost}(ALG) \\ge \\text{cost}(OPT)$ 恒成立 → 竞争比 $c \\ge 1$。∎']},
     {title:'最优 m 的选取',en:'( m + 1 if m ≤ k \u2212 1; k if m ≥ k: (27.1)',page:793,
      body:['最坏比值 $c(m) = \\max(1, (m+k)/(m+1))$ 关于 $m$ 递减（分子 +1、分母 +1，比值下降）。',
        '但 $m$ 不能超过 $k$（此时"等待浪费"超过直接走楼梯）→ 最优 $m = k-1$。',
        '$$c(k-1) = \\frac{2k-1}{k} = 2 - \\frac{1}{k} < 2$$ ★ C 程序对 k=10 得 1.9，正是 $2 - 0.1$。∎']},
     {title:'永远等的灾难',en:'ent approach. Instead of assuming anything about the future input, we employ a conservative strategy of limiting how poor a soluti',page:792,
      body:['若电梯永不到达（$t = \\infty$），"永远等"的代价无界，而离线只需 $k$ → 竞争比无界。',
        '★ 这是在线算法的典型教训：**没有上限的等待是灾难**；参数 $m$ 提供的就是"退出开关"。∎']},
    ],conclusion:'★ 结论：竞争比是在线算法唯一可依赖的定量指标；"等 k−1 分钟"给出 < 2 的保证。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'$c$-竞争的含义是？',options:['最坏情况时间 ≤ c','**成本 ≤ c · 离线最优成本**','平均成本 ≤ c','空间 ≤ c','处理器数 ≤ c'],answer:1,
      why:'★ 与离线最优（知道未来）的比值。'},
     {kind:'single',q:'"等 m 分钟后走楼梯"策略的最优 m 是？',options:['0','k/2','**k−1**','k'],answer:2,
      why:'★ $c(m)=(m+k)/(m+1)$ 递减，最大可行的 $m=k-1$ 给出 $2-1/k$。'},
     {kind:'judge',q:'竞争比可以小于 1。',answer:false,
      why:'★ 离线最优是所有算法下界 → $c \\ge 1$。'},
     {kind:'simulate',q:'C 程序 k=10 时最优竞争比是多少？（填两位小数）',expect:[1.9],placeholder:'例如：2.0',
      why:'1.900 = 19/10（m = 9）。'},
     {kind:'simulate',q:'用「永远走楼梯」（m=0）在 k=10 时的竞争比是多少？（填数字）',expect:[10],placeholder:'例如：2',why:'★ code 段实测：m=0 时比值 10 —— 楼梯固定耗 10 分钟，而电梯最优情况只需 1 分钟。'},
     {kind:'single',q:'「等 m 分钟」策略的最坏竞争比公式是？',options:['$(m+k)/(m+1)$','**$\\max(1,\\ (m+k)/(m+1))$**','$k/m$','$m/(m+k)$'],answer:1,why:'★ analyze 第二条：外层取 $\\max$ 是因为竞争比不可能小于 1（prove 段的命题）。'},
     {kind:'judge',q:'竞争比 $c \\ge 1$ 恒成立，因为在线算法不可能比知道全部未来的先知更省。',answer:true,why:'★ analyze 第一条与 prove 段的命题：所以我们只求 $c$ 尽量接近 1，而不是等于 1。'},
    ],bookExercises:[
     {id:'27.1-1',page:795,star:0,statement:'Suppose that when hedging your bets, you wait for p minutes, instead of for k minutes, before taking the stairs. What is the comp etitive ratio as a function of p and k? How should you choose p to minimize the competitive ratio?',hint:'滑雪租赁：每次租 $1$ 或一次买 $r$；策略"租 $r$ 次后买"给出竞争比 2（与电梯问题同型：都是"等多久就放弃"）。'},
    ]},
  ],
};
