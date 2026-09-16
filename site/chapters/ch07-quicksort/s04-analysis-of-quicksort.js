/* 第 7 章 7.4：快速排序的分析（Analysis of quicksort）。
 * 原文锚点：印刷页 193–201（pdf_index 214–222）。
 * 引述已用 tools/07_pick_quotes.py pick 逐条预检（43/43 PASS）。
 * 本关是纯分析关（无新实现），复用 7.1 的 C 代码。
 */

export default {
  key:'s04',id:'ch07/s04',chapter:7,section:'7.4',
  title:'快速排序的分析：期望 O(n lg n)',shortTitle:'7.4 快速排序的分析',
  titleEn:'Analysis of quicksort',
  source:{printed:[193,201],pdf:[214,222]},
  prerequisites:[{label:'7.3 A randomized version of quicksort',url:'#/ch07/s03'}],
  stages:[
   {type:'map',title:'用指示器随机变量算出期望 O(n lg n)',
    why:'7.2 的直觉是"均衡→快、不均衡→慢"，但没有给出**精确**的期望运行时间。7.4 用 5.2 的指示器随机变量完成了这件事：证明随机化快速排序的期望运行时间是 $O(n\\lg n)$ —— 而且只假设元素互异。',
    position:'7.2 给了三个递推式的直觉；**本关把它们变成严格的证明**。最坏情况用代入法（4.3 的技术）；期望运行时间用 5.2 的指示器随机变量 + 线性期望。第 8 章将证明 $\\Omega(n\\lg n)$ 下界，从而说明随机化快速排序在比较排序里是渐近最优的。',
    unlocks:[{label:'8.1 Lower bounds for sorting（排序下界）',url:'#/ch08/s01'}],
    mathKit:[
     {title:'代入法（4.3）',body:'猜 $T(n) \\le cn^2$，代入验证。用于最坏情况的上界证明。'},
     {title:'指示器随机变量（5.2）',body:'$X_{ij} = I\\{z_i \\text{ 与 } z_j \\text{ 被比较}\\}$；$E[X_{ij}] = \\Pr\\{z_i \\text{ 与 } z_j \\text{ 被比较}\\}$。线性期望不要求独立。'},
     {title:'调和数 H(n)',body:'$H(n) = \\sum_{k=1}^n 1/k = \\ln n + O(1)$。它在期望分析的求和中出现。'},
    ]},
   {type:'intuition',title:'不用算递推式，数比较次数就够了',
    scene:'与其画一棵复杂的递归树，不如数"谁和谁被比较过"',
    body:[
     '7.2 用递归树给了直觉，但**精确**的期望分析需要另一种工具。原书的方法出奇地简单：**不追踪递归树，直接数比较次数**。',
     '关键观察：快速排序的运行时间由 PARTITION 主导，而 PARTITION 的运行时间正比于它做的**元素比较**次数。设 $X$ 为全部比较次数，则 $T(n) = O(n + X)$。',
     '然后关键一步：**哪两个元素会被比较？** 原书给出一个漂亮的刻画 —— $z_i$ 与 $z_j$ 被比较，**当且仅当** $z_i$ 或 $z_j$ 是 $Z_{ij} = \\{z_i, z_{i+1}, \\dots, z_j\\}$ 中**第一个**被选为轴的元素。',
     '★ 这个刻画为什么够用？因为随机选轴是等概率的：$Z_{ij}$ 中任何一个元素被第一个选中的概率都是 $1/(j-i+1)$，于是 $z_i$ 或 $z_j$ 被第一个选中的概率是 $2/(j-i+1)$。剩下的就是把这个求和。',
    ],
    interactive:{text:'阶段 7 的图表把最坏 $n^2$ 与期望 $n\\lg n$ 放在一起 —— 差距就是一个 $n$ 因子。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体）。',
    blocks:[
     {kind:'body',page:194,en:'We have already seen the intuition behind why the expected running time of RANDOMIZED-QUICKSORT is O(n lg n): if, in each level of recursion, the split induced by RANDOMIZED-PARTITION puts any constant fraction of the elements on one side of the partition, then the recursion tree has depth Θ(lg n) and O(n) work is performed at each level. Even if we add a few new levels with the most unbalanced split possible between these levels, the total time remains O(n lg n).',
      zh:'★ 回顾 7.2 的直觉（"加上几层最不均衡的分裂，总时间仍是 $O(n\\lg n)$"），然后说"我们可以**精确地**分析"—— 从直觉到严格证明的过渡。'},
     {kind:'body',page:195,en:'One call to PARTITION takes O(1) time plus an amount of time that is proportional to the number of iterations of the for loop in lines 3\u20136. Each iteration of this for loop performs one comparison in line 4, comparing the pivot element to another element of the array A. Therefore, the total time spent in the for loop across all executions is proportional to X . Since there are at most n calls to PARTITION and the time spent outside the for loop is O(1) for each call, the total time spent in PARTITION outside of the for loop is O(n).',
      zh:'★★ 这一段把"运行时间"归约到"比较次数 $X$"。★ 逻辑链：① PARTITION 每次 $O(1)$ + 正比于 for 循环迭代次数；② 每次迭代恰好一次元素比较；③ 所以总时间 $\\propto X$。加上至多 $n$ 次 PARTITION 调用的 $O(n)$ 常数项 → $T(n) = O(n + X)$。'},
     {kind:'body',page:195,en:'Our goal for analyzing RANDOMIZED-QUICKSORT , therefore, is to compute the expected value E [X] of the random variable X denoting the total number of comparisons performed in all calls to PARTITION . To do so, we must understand when the quicksort algorithm compares two elements of the array and when it does not.',
      zh:'★ 分析目标从"求 $T(n)$"变成了"求 $E[X]$"。这个归约是整个分析的核心设计决策 —— 它把一个复杂的递归结构（递归树）变成了一个可以逐对分析的计数问题。'},
     {kind:'body',page:195,en:'During the execution of RANDOMIZED-QUICKSORT on an array of n distinct elements \u00b4 1 <\u00b4 2 < \u2022 \u2022 \u2022 <\u00b4 n , an element \u00b4 i is compared with an element \u00b4 j , where i <j , if and only if one of them is chosen as a pivot before any other element in the set Z ij . Moreover, no two elements are ever compared twice.',
      zh:'★★ **本分析的灵魂**：Lemma 7.2 的陈述。$z_i$ 与 $z_j$ 被比较 $\\Leftrightarrow$ $z_i$ 或 $z_j$ 是 $Z_{ij}$ 中**第一个**被选为轴的。\n\n★ "no two elements are ever compared twice" —— 这也是为什么比较次数可以被精确计数：每对最多比较一次。'},
     {kind:'body',page:196,en:'Consider an execution of the procedure RANDOMIZED-QUICKSORT on an array of n distinct elements \u00b4 1 <\u00b4 2 < \u2022 \u2022 \u2022 <\u00b4 n . Given two arbitrary elements \u00b4 i and \u00b4 j where i "j , the probability that they are compared is 2".j \u2212 i + 1/.',
      zh:'★★ **Theorem 7.3**：$z_i$ 与 $z_j$ 被比较的概率 = $\\frac{2}{j-i+1}$。\n\n★ 为什么是 2？因为 $Z_{ij}$ 中有 $j - i + 1$ 个元素，每个被第一个选为轴的概率都是 $\\frac{1}{j-i+1}$，而 $z_i$ 或 $z_j$ 中的**任何一个**被选中都会导致它们被比较 —— 所以概率是 $\\frac{2}{j-i+1}$。\n\n★ 当 $j = i + 1$（相邻元素）时概率是 $\\frac{2}{2} = 1$ —— 相邻元素**总是**被比较。当 $j - i + 1 = n$（最小与最大）时概率是 $\\frac{2}{n}$ —— 极值对很少被比较。'},
     {kind:'body',page:198,en:'This bound and Lemma 7.1 allow us to conclude that the expected running time of RANDOMIZED-QUICKSORT is O(n lg n) (assuming that the element values are distinct).',
      zh:'★★ 最终结论：期望运行时间 $O(n\\lg n)$。\n\n★ 注意假设："assuming that the element values are distinct"。习题 7-2 让你放宽这个假设。'},
    ],
    terms:[
     {en:'indicator random variable',zh:'指示器随机变量',page:197},
     {en:'substitution method',zh:'代入法',page:193},
    ]},
   {type:'pseudocode',title:'分析对象：PARTITION 的第 4 行',
    lead:'★ 本关分析的是**第 4 行的元素比较次数** —— 这是快速排序运行时间的主导项。',
    algo:'PARTITION',signature:'PARTITION(A, p, r)',page:184,
    lines:[
     {n:1,code:'x = A[r]',zh:'轴。'},
     {n:2,code:'i = p − 1',zh:'低侧最高下标。'},
     {n:3,code:'for j = p to r − 1',zh:'扫描。'},
     {n:4,code:'    if A[j] ≤ x',zh:'★★ **这里的元素比较**就是被计数的对象。每次迭代恰好一次。'},
     {n:5,code:'        i = i + 1',zh:''},
     {n:6,code:'        exchange A[i] with A[j]',zh:''},
     {n:7,code:'exchange A[i + 1] with A[r]',zh:''},
     {n:8,code:'return i + 1',zh:''},
    ],
    vars:[{name:'X',meaning:'全部元素比较的总次数 —— 本关要求 E[X]'}],
    note:'★ 快速排序的全部运行时间可以用 $X$（总比较次数）来刻画。'},
   {type:'visualize',title:'最坏 n² 与期望 n lg n 的差距',
    stateLabels:{frontier:'当前子数组',pivot:'枢轴已就位'},
    panels:[
     {title:'① 确定性版：已排序输入退化为链（最坏 Θ(n²)）',
      viz:'array',
      algorithm:'quicksort',pseudocodeRef:'QUICKSORT',
      input:{array:[1,2,3,4,5,6,7,8]},
      countLabels:{cmp:'比较',move:{label:'交换',unit:'次'},calls:{label:'递归调用',unit:'次'}},
      invariants:[{label:'最坏情况：每次分区都是 (n−1) : 0'}],
      presets:[
       {name:'已排序：最坏',array:[1,2,3,4,5,6,7,8],args:[1,8]},
       {name:'随机：期望 O(n lg n)',array:[2,8,7,1,3,5,6,4],args:[1,8]},
      ]},
     {title:'② 比较次数的增长：n lg n vs n²',
      viz:'growth',
      chart:{xMax:128,series:[
       {name:'最坏 ∼ n²/2',expr:'n * n / 2',color:'--viz-violation'},
       {name:'期望 ∼ 2n·ln n ≈ 1.39 n·lg n',expr:'2 * n * Math.log(n)',color:'--viz-done'},
       {name:'下界 Ω(n lg n)',expr:'n * Math.log2(n)',color:'--viz-compare'},
      ]},
      note:'★ 虚线（下界）与实线（期望）在同一阶 —— 随机化快速排序在比较排序里是渐近最优的。'},
    ],
    tasks:[
     '面板 ① 的"已排序"输入：看"比较"读数 —— 应该是 $n(n-1)/2 = 28$（每次分区 $n-1$ 次、共 $n-1$ 次）。',
     '面板 ① 的"随机"输入：比较次数明显更少 —— 这就是期望 $O(n\\lg n)$ 的直观体现。',
     '面板 ② 看两条曲线：$n^2$ 与 $n\\lg n$ 的差距就是"最坏"与"期望"之间差一个 $n$ 因子。',
    ],
    note:''},
   {type:'code',title:'实测：快速排序的比较次数',
    intro:'7.1 的 C 实现（`c/quicksort.c`）已经统计了比较次数。这里用它实测最坏与期望的差异。',
    pseudocodeRef:'PARTITION',
    c:{file:'quicksort.c',code:String.raw`/* quicksort.c -- 7.1 节 QUICKSORT 与 PARTITION 的实现、不变量与实测。
 *
 * 对应原书 p.183-184（已按渲染页逐行核对，缩进按书补齐）：
 *   QUICKSORT(A, p, r)
 *   1  if p < r
 *   2      // Partition the subarray around the pivot, which ends up in A[q].
 *   3      q = PARTITION(A, p, r)
 *   4      QUICKSORT(A, p, q − 1)     // recursively sort the low side
 *   5      QUICKSORT(A, q + 1, r)     // recursively sort the high side
 *
 *   PARTITION(A, p, r)
 *   1  x = A[r]                       // the pivot
 *   2  i = p − 1                      // highest index into the low side
 *   3  for j = p to r − 1             // process each element other than the pivot
 *   4      if A[j] ≤ x                // does this element belong on the low side?
 *   5          i = i + 1              // index of a new slot in the low side
 *   6          exchange A[i] with A[j]     // put this element there
 *   7  exchange A[i + 1] with A[r]    // pivot goes just to the right of the low side
 *   8  return i + 1                   // new index of the pivot
 *
 * ★ 原书 p.184 给出了 PARTITION 的**循环不变量**（三条：低侧 ≤ x、高侧 > x、A[r] = x）
 *   以及完整的初始化/保持/终止论证 —— 本文件把它变成每一轮都可执行的检查。
 *
 * 验证六件事：
 *   1. PARTITION 之后：A[q] 是轴、左侧全部 ≤ 轴、右侧全部 > 轴，元素集合不变；
 *   2. 习题 7.1-3：PARTITION 在 n 个元素上恰好做 r − p 次比较 = Θ(n)；
 *   3. PARTITION 的循环不变量在**每一轮之后**都成立（原书 p.184 的三条）；
 *   4. 习题 7.1-2：全部元素相同时 q 返回 r —— 这正是最坏情况的成因；
 *   5. QUICKSORT 排好序（含重复与负数），且习题 7.1-1 的数组可逐步追踪；
 *   6. 习题 7.1-4：改成降序排序只需把第 4 行的 ≤ 反成 ≥（两种方向都实现并对照）。
 *
 * 下标约定：函数保持 1 基语义（与书一致），只在访问 a[] 时减 1。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o quicksort quicksort.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#define MAXN 32

typedef struct {
    long cmp;      /* 第 4 行被求值的次数（PARTITION）/ 递归调用里的比较次数 */
    long swap;     /* 第 6 行与第 7 行的交换次数 */
    long calls;    /* QUICKSORT 被调用的次数（含立即返回的空调用） */
} stats_t;

/* ---------------------- PARTITION（原书 8 行） ---------------------- */
static int partition(int *a, int p, int r, stats_t *st)
{
    int x = a[r - 1];                    /* 第 1 行：x = A[r]（轴） */
    int i = p - 1;                       /* 第 2 行：i = p − 1 */
    for (int j = p; j <= r - 1; j++) {   /* 第 3 行 */
        st->cmp++;
        if (a[j - 1] <= x) {             /* 第 4 行 */
            i++;                         /* 第 5 行 */
            int t = a[i - 1];            /* 第 6 行：exchange A[i] with A[j] */
            a[i - 1] = a[j - 1];
            a[j - 1] = t;
            st->swap++;
        }
    }
    {   /* 第 7 行：exchange A[i + 1] with A[r] */
        int t = a[i];
        a[i] = a[r - 1];
        a[r - 1] = t;
        st->swap++;
    }
    return i + 1;                        /* 第 8 行：return i + 1 */
}

/* 习题 7.1-4：把第 4 行的 ≤ 反成 ≥，就得到降序排序用的分区 */
static int partition_desc(int *a, int p, int r, stats_t *st)
{
    int x = a[r - 1];
    int i = p - 1;
    for (int j = p; j <= r - 1; j++) {
        st->cmp++;
        if (a[j - 1] >= x) {
            i++;
            int t = a[i - 1];
            a[i - 1] = a[j - 1];
            a[j - 1] = t;
            st->swap++;
        }
    }
    {
        int t = a[i];
        a[i] = a[r - 1];
        a[r - 1] = t;
        st->swap++;
    }
    return i + 1;
}

/* ---------------------- QUICKSORT（原书 5 行） ---------------------- */
static void quicksort(int *a, int p, int r, stats_t *st)
{
    st->calls++;
    if (p < r) {                                  /* 第 1 行 */
        int q = partition(a, p, r, st);           /* 第 3 行 */
        quicksort(a, p, q - 1, st);               /* 第 4 行：low side */
        quicksort(a, q + 1, r, st);               /* 第 5 行：high side */
    }
}

/* 习题 7.1-4：降序版（只有第 3 行换了分区函数） */
static void quicksort_desc(int *a, int p, int r, stats_t *st)
{
    st->calls++;
    if (p < r) {
        int q = partition_desc(a, p, r, st);
        quicksort_desc(a, p, q - 1, st);
        quicksort_desc(a, q + 1, r, st);
    }
}

/* --------------------------- 工具 --------------------------- */
static bool is_sorted(const int *a, int n)
{
    for (int i = 1; i < n; i++) { if (a[i - 1] > a[i]) { return false; } }
    return true;
}

static bool is_sorted_desc(const int *a, int n)
{
    for (int i = 1; i < n; i++) { if (a[i - 1] < a[i]) { return false; } }
    return true;
}

static int same_bag(const int *x, const int *y, int n)
{
    int xs[MAXN], ys[MAXN];
    memcpy(xs, x, (size_t)n * sizeof(int));
    memcpy(ys, y, (size_t)n * sizeof(int));
    for (int i = 1; i < n; i++) {
        int k = xs[i], j = i - 1;
        while (j >= 0 && xs[j] > k) { xs[j + 1] = xs[j]; j--; }
        xs[j + 1] = k;
        k = ys[i]; j = i - 1;
        while (j >= 0 && ys[j] > k) { ys[j + 1] = ys[j]; j--; }
        ys[j + 1] = k;
    }
    return memcmp(xs, ys, (size_t)n * sizeof(int)) == 0;
}

static void print_array(const char *label, const int *a, int n)
{
    printf("      %s⟨", label);
    for (int i = 0; i < n; i++) { printf("%d%s", a[i], i + 1 < n ? "," : ""); }
    printf("⟩\n");
}

static unsigned g_state;
static void rnd_seed(unsigned s)
{
    g_state = s ? s : 0x9e3779b9u;
    g_state += 0x9e3779b9u;
    g_state = (g_state ^ (g_state >> 16)) * 0x21f0aaadu;
    g_state = (g_state ^ (g_state >> 15)) * 0x735a2d97u;
    g_state = g_state ^ (g_state >> 15);
}
static unsigned rnd_next(void)
{
    unsigned s = g_state;
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    g_state = s;
    return s;
}

/* 习题 7.1-1 的逐步追踪：每次交换后打印一行 */
static void trace_partition(const int *src, int n)
{
    int a[MAXN];
    memcpy(a, src, (size_t)n * sizeof(int));
    int p = 1, r = n;
    int x = a[r - 1];
    int i = p - 1;
    print_array("习题 7.1-1 初始：", a, n);
    for (int j = p; j <= r - 1; j++) {
        if (a[j - 1] <= x) {
            i++;
            int t = a[i - 1];
            a[i - 1] = a[j - 1];
            a[j - 1] = t;
            printf("      A[%d] ≤ 轴：交换后 ", j);
            print_array("", a, n);
        }
    }
    {
        int t = a[i];
        a[i] = a[r - 1];
        a[r - 1] = t;
        printf("      轴归位后 ");
        print_array("", a, n);
    }
}

int main(void)
{
    /* ---- 1. PARTITION 的结论（p.184 的不变量在循环结束时的形态）---- */
    {
        int checked = 0;
        for (int t = 1; t <= 200; t++) {
            int n = 1 + (t % 28);
            int a[MAXN], before[MAXN];
            rnd_seed((unsigned)(t * 401 + 9));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 300); }
            memcpy(before, a, (size_t)n * sizeof(int));
            stats_t st = {0, 0, 0};
            int q = partition(a, 1, n, &st);
            assert(q >= 1 && q <= n);
            assert(a[q - 1] == before[n - 1]);          /* A[q] 是轴 */
            for (int k = 1; k <= q - 1; k++) { assert(a[k - 1] <= a[q - 1]); }
            for (int k = q + 1; k <= n; k++) { assert(a[k - 1] > a[q - 1]); }
            assert(same_bag(a, before, n));
            checked++;
        }
        printf("part 1: 200 组输入分区后都满足「A[q] 是轴、左侧 ≤ 轴、右侧 > 轴」，元素集合不变\n");
    }

    /* ---- 2. 习题 7.1-3：比较次数恰好是 r − p，即 Θ(n) ---- */
    {
        int all_ok = 1;
        for (int n = 1; n <= 28; n++) {
            int a[MAXN];
            rnd_seed((unsigned)(n * 77 + 1));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 100); }
            stats_t st = {0, 0, 0};
            (void)partition(a, 1, n, &st);
            /* r − p = n − 1；PARTITION 在第 4 行上恰好做 n − 1 次比较 */
            if (st.cmp != n - 1) { all_ok = 0; }
        }
        assert(all_ok);
        puts("part 2: n = 1..28 的比较次数都恰好等于 r − p = n − 1（习题 7.1-3 的 Θ(n)）");
    }

    /* ---- 3. 循环不变量：每一轮之后都成立（原书 p.184 的三条）---- */
    {
        long rounds = 0;
        for (int t = 1; t <= 60; t++) {
            int n = 2 + (t % 28);
            int a[MAXN];
            rnd_seed((unsigned)(t * 233 + 7));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 200); }
            int x = a[n - 1];
            /* 下面这一段用 **0 基** 下标模拟书上第 3–6 行（书是 1 基）：
             *   书的 i = p − 1 = 0（1 基）→ 0 基是 −1（"区间外"）
             *   书的 j 从 p 到 r − 1 → 0 基从 0 到 n − 2
             * 写错过一次（把 i 初始化成 0、j 从 1 开始），断言当场报 a[n−1] != x。 */
            int i = -1;
            for (int j = 0; j <= n - 2; j++) {
                if (a[j] <= x) {
                    i++;
                    int t2 = a[i]; a[i] = a[j]; a[j] = t2;
                }
                /* 不变量（按 1 基）：① A[1..i+1] 全部 ≤ x；② A[i+2..j+1] 全部 > x；
                 * ③ A[n] = x。换算成 0 基就是下面三行。 */
                for (int k = 0; k <= i; k++) { assert(a[k] <= x); }
                for (int k = i + 1; k <= j; k++) { assert(a[k] > x); }
                assert(a[n - 1] == x);
                rounds++;
            }
        }
        printf("part 3: %ld 轮里循环不变量（①低侧 ≤ x ②高侧 > x ③A[r] = x）从未被破坏\n", rounds);
    }

    /* ---- 4. 习题 7.1-2：全部相同时 q = r ---- */
    {
        for (int n = 1; n <= 20; n++) {
            int a[MAXN];
            for (int i = 0; i < n; i++) { a[i] = 42; }
            stats_t st = {0, 0, 0};
            int q = partition(a, 1, n, &st);
            assert(q == n);
        }
        puts("part 4: 全部元素相同时 q = r（习题 7.1-2）—— 每次分区都是 0 : (n−1)，最坏情况的成因");
    }

    /* ---- 5. 习题 7.1-1 的逐步追踪 ---- */
    {
        static const int EX711[12] = {13, 19, 9, 5, 12, 8, 7, 4, 21, 2, 6, 11};
        int a[MAXN];
        memcpy(a, EX711, sizeof(EX711));
        trace_partition(EX711, 12);
        stats_t st = {0, 0, 0};
        int q = partition(a, 1, 12, &st);
        assert(a[q - 1] == 11);
        assert(same_bag(a, EX711, 12));
        printf("      轴 11 落在下标 %d；共 %ld 次比较、%ld 次交换\n", q, st.cmp, st.swap);
    }

    /* ---- 6. QUICKSORT：排序正确性 + 调用次数随输入形态变化 ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 120; t++) {
            int n = 1 + (t % 30);
            int a[MAXN], before[MAXN];
            rnd_seed((unsigned)(t * 613 + 17));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 200) - 100; }
            memcpy(before, a, (size_t)n * sizeof(int));
            stats_t st = {0, 0, 0};
            quicksort(a, 1, n, &st);
            assert(is_sorted(a, n));
            assert(same_bag(a, before, n));
            checked++;
        }
        printf("part 6a: %d 组随机输入（含负数）都排好序且元素集合不变\n", checked);

        /* 习题 7.1-4：降序版 */
        {
            int a[MAXN];
            rnd_seed(4242);
            for (int i = 0; i < 20; i++) { a[i] = (int)(rnd_next() % 100); }
            stats_t st = {0, 0, 0};
            quicksort_desc(a, 1, 20, &st);
            assert(is_sorted_desc(a, 20));
            puts("part 6b: 把第 4 行的 ≤ 反成 ≥（习题 7.1-4）→ 排成降序，结构一字不改");
        }

        /* 最坏 vs 一般：递增输入 + 固定取末元素当轴 → 每层只切掉一个元素 */
        {
            int n = 24;
            int asc[MAXN], rnd[MAXN];
            for (int i = 0; i < n; i++) { asc[i] = i + 1; }
            stats_t s1 = {0, 0, 0};
            quicksort(asc, 1, n, &s1);
            assert(is_sorted(asc, n));
            assert(s1.calls == 2 * n - 1);      /* 非空 n 次 + 空 n−1 次 = 2n − 1 */

            rnd_seed(31337);
            for (int i = 0; i < n; i++) { rnd[i] = (int)(rnd_next() % 1000); }
            stats_t s2 = {0, 0, 0};
            quicksort(rnd, 1, n, &s2);
            assert(is_sorted(rnd, n));
            printf("part 6c: n = %d 时递增输入调用 %ld 次（最坏形态：每层只切掉一个元素），"
                   "随机输入调用 %ld 次\n", n, s1.calls, s2.calls);
            assert(s1.calls > s2.calls);         /* 最坏形态的调用次数明显更多 */
        }
    }

    puts("all checks passed.");
    return 0;
}
`,
       notes:[{line:58,zh:'★ 第 4 行的 `a[j - 1] <= x` —— **每一次执行都是一次元素比较**。全部比较次数就是这一行的执行总数，即本关的 $X$。'},
              {line:214,zh:'PARTITION 的正确性断言 —— 分析的前提是分区是正确的。'},
              {line:330,zh:'n = 24 时递增输入（最坏）调用 47 次 vs 随机 29 次 —— 更本质的差别在比较次数。'}],
       tests:[{in:'n = 28 的递增输入',out:'比较 378 次 = n(n−1)/2（最坏情况）'},
              {in:'n = 28 的随机输入',out:'比较次数接近 2n·ln n ≈ 1.39 n·lg n（期望）'}]},
    mapping:[{pc:4,pcCode:'if A[j] ≤ x',c:'`if (a[j - 1] <= x)`（第 58 行）—— 每次执行就是一次元素比较'}]},
   {type:'analyze',title:'从 X 到 O(n lg n)：完整的推导链',
    intro:'本关的推导有四步，每步都用到了前面章节的工具。这条链是第 7 章的高峰 —— 它把 5.2 的指示器随机变量、2.3 的递归树、4.3 的代入法全部串了起来。',
    claims:[
     {expr:'T(n) = O(n + X)',when:'运行时间由比较次数 X 主导（Lemma 7.1 的推论）',page:195,source:'book'},
     {expr:'2/(j-i+1)',when:'z_i 与 z_j 被比较的概率（Theorem 7.3）',page:196,source:'book'},
     {expr:'O(n \\lg n)',when:'RANDOMIZED-QUICKSORT 的期望运行时间',page:198,source:'book'},
     {expr:'\\Theta(n^2)',when:'最坏运行时间（代入法证明 O(n²)，7.2 给了 Ω(n²) 的实例）',page:194,source:'book'},
    ],
    tables:[{caption:'推导链：四步',rows:[
      ['步','做什么','工具'],
      ['①','把运行时间归约到比较次数 $X$','$T(n) = O(n + X)$'],
      ['②','刻画"哪些对会被比较"','Lemma 7.2（$Z_{ij}$ 中第一个被选为轴）'],
      ['③','算单对的比较概率','Theorem 7.3：$2/(j-i+1)$'],
      ['④','求和','指示器随机变量 + 线性期望 + 调和数'],
    ]},
     {caption:'调和数的出现',rows:[
      ['对','概率','贡献'],
      ['$j = i+1$（相邻）','$2/2 = 1$','总被比较'],
      ['$j = i+2$','$2/3$',''],
      ['$j = i+k$','$2/(k+1)$',''],
      ['求和','$\\sum \\frac{2}{j-i+1} = O(\\lg n)$','每对元素的期望贡献'],
     ]}],
    chart:{xMax:256,series:[
     {name:'最坏 ∼ n²/2',expr:'n * n / 2',color:'--viz-violation'},
     {name:'期望 ∼ 2n·ln n',expr:'2 * n * Math.log(n)',color:'--viz-done'},
     {name:'下界 Ω(n lg n)（第 8 章）',expr:'n * Math.log2(n)',color:'--viz-compare'},
    ]},
    derivations:[
     {kind:'summation',title:'Step ①：T(n) = O(n + X)',steps:[
      {zh:'PARTITION 每次 $O(1)$ + 正比于 for 循环迭代次数。每次迭代恰好一次元素比较。'},
      {tex:'T(n) = O(n) + O(X)',zh:'$O(n)$ 来自至多 $n$ 次 PARTITION 调用的非循环部分；$O(X)$ 来自比较。'}]},
     {kind:'summation',title:'Step ②：Lemma 7.2 —— 谁和谁被比较',steps:[
      {zh:'把元素按**排序后**的位置编号：$z_1 < z_2 < \\dots < z_n$。设 $Z_{ij} = \\{z_i, z_{i+1}, \\dots, z_j\\}$。'},
      {tex:'z_i \\text{ 与 } z_j \\text{ 被比较} \\iff \\text{第一个从 } Z_{ij} \\text{ 中被选为轴的是 } z_i \\text{ 或 } z_j',zh:'★ 原书用一个 1..10 的例子说明：第一次选轴 7 之后，$\\{1..6\\}$ 与 $\\{8,9,10\\}$ 之间的任何元素对**永不再比较**。'}]},
     {kind:'summation',title:'Step ③：Theorem 7.3 —— 概率 2/(j−i+1)',steps:[
      {zh:'$Z_{ij}$ 有 $j-i+1$ 个元素，每个被第一个选为轴的概率都是 $1/(j-i+1)$（均匀随机）。'},
      {tex:'\\Pr\\{z_i \\text{ 与 } z_j \\text{ 被比较}\\} = \\Pr\\{z_i \\text{ 或 } z_j \\text{ 第一个被选}\\} = \\frac{2}{j-i+1}',zh:'★ 两个事件互斥（只能有一个"第一个"），所以概率相加：$\\frac{1}{j-i+1} + \\frac{1}{j-i+1} = \\frac{2}{j-i+1}$。'}]},
     {kind:'summation',title:'Step ④：求和得到 O(n lg n)',steps:[
      {tex:'E[X] = \\sum_{i=1}^{n-1}\\sum_{j=i+1}^{n} \\frac{2}{j-i+1}',zh:'指示器随机变量 + 线性期望（不需要独立）。'},
      {tex:'= \\sum_{i=1}^{n-1}\\sum_{k=1}^{n-i} \\frac{2}{k+1}',zh:'换元 $k = j - i$。'},
      {tex:'< \\sum_{i=1}^{n-1}\\sum_{k=1}^{n} \\frac{2}{k} = O(n \\lg n)',zh:'★ 内层求和是调和数 $H(n) = \\ln n + O(1)$（附录 A 式 A.9），外层是 $n$ 项 → $O(n\\lg n)$。'},
      {zh:'★ 对照 5.2 的 $E[X] = H_n \\approx \\ln n$：那里只有 $n$ 个指示器，这里有 $n^2/2$ 个 —— 多了一个 $n$ 因子，所以是 $n\\lg n$ 而不是 $\\lg n$。'},
      {tex:'T(n) = O(n + X) = O(n + n\\lg n) = O(n\\lg n)',zh:'结论：RANDOMIZED-QUICKSORT 的期望运行时间是 $O(n\\lg n)$（假设元素互异）。'}]},
    ],
    note:'★ 中心图：最坏 $n^2/2$（红线）一路上扬；期望 $2n\\ln n$（绿线）增长慢得多；下界 $\\Omega(n\\lg n)$（蓝线）与期望在同一阶 —— 随机化快速排序已经到了比较排序的极限。'},
   {type:'prove',title:'Theorem 7.3：为什么概率恰好是 2/(j−i+1)',
    statement:'During the execution of RANDOMIZED-QUICKSORT on an array of n distinct elements \u00b4 1 <\u00b4 2 < \u2022 \u2022 \u2022 <\u00b4 n , an element \u00b4 i is compared with an element \u00b4 j , where i <j , if and only if one of them is chosen as a pivot before any other element in the set Z ij . Moreover, no two elements are ever compared twice.',
    page:195,
    intro:'★ 这是原书的 **Lemma 7.2**（"谁和谁被比较"的刻画）—— 它是整个期望分析的基石。三步分别对应：三种情况的排除、"当且仅当"的两个方向、以及"不比较两次"。',
    steps:[
     {title:'第一步 · 排除：中间的轴会把两边隔开',
      en:'Proof Let\u2019s look at the first time that an element x 2 Z ij is chosen as a pivot during the execution of the algorithm. There are three cases to consider. If x is neither \u00b4 i nor \u00b4 j 4that is, \u00b4 i <x <\u00b4 j 4then \u00b4 i and \u00b4 j are not compared at any subsequent time, because they fall into different sides of the partition around x.',page:195,
      body:['$Z_{ij}$ 中第一个被选为轴的元素 $x$ 有三种可能：',
        '**$x \\ne z_i$ 且 $x \\ne z_j$**（即 $z_i < x < z_j$）：$x$ 把 $Z_{ij}$ 分成两侧，$z_i$ 落入低侧、$z_j$ 落入高侧 → 它们**永不再被比较**（它们在不同的递归子问题里）。',
        '★ 这就是"轴的隔离效应"：一个轴一经选定，就把自己两侧的元素**永久隔开**了。']},
     {title:'第二步 · 比较发生：轴是端点之一',
      en:'If x = \u00b4 i , then PARTITION compares \u00b4 i with every other item in Z ij . Similarly, if x = \u00b4 j , then PARTITION compares \u00b4 j with every other item in Z ij . Thus, \u00b4 i and \u00b4 j are compared if and only if the first element to be chosen as a pivot from Z ij is either \u00b4 i or \u00b4 j . In the latter two cases, where one of \u00b4 i and \u00b4 j is chosen as a pivot, since the pivot is removed from future comparisons, it is never compared again with the other element.',page:195,
      body:['**$x = z_i$**：PARTITION 会把 $z_i$ 与 $Z_{ij}$ 中的**每个**其他元素比较一次（因为 $z_i$ 是轴，第 4 行会拿它与所有未看元素比较）。特别地，$z_j$ 也被比较了。',
        '**$x = z_j$**：同理。',
        '★ 于是 "$z_i$ 与 $z_j$ 被比较" $\\Leftrightarrow$ "$z_i$ 或 $z_j$ 是 $Z_{ij}$ 中第一个被选为轴的" —— 两个方向都证明了。',
        '★ "no two elements are ever compared twice"：因为轴一旦被选出就从后续递归中消失，所以每一对最多被比较一次 —— 这使得 $X$ 可以用不重复的指示器求和表示。']},
     {title:'第三步 · 概率计算',
      en:'Consider an execution of the procedure RANDOMIZED-QUICKSORT on an array of n distinct elements \u00b4 1 <\u00b4 2 < \u2022 \u2022 \u2022 <\u00b4 n . Given two arbitrary elements \u00b4 i and \u00b4 j where i "j , the probability that they are compared is 2".j \u2212 i + 1/.',page:196,
      body:['$Z_{ij}$ 有 $j - i + 1$ 个元素，每个被第一个选为轴的概率都是 $\\frac{1}{j-i+1}$（因为轴是均匀随机选的）。',
        '$z_i$ 或 $z_j$ 被第一个选中的概率 = 两个互斥事件的概率之和 = $\\frac{2}{j-i+1}$。',
        '★ 这就是 **Theorem 7.3**。把它代入 Step ④ 的求和（用指示器随机变量 + 线性期望），就得到 $E[X] = O(n\\lg n)$。']},
    ],
    conclusion:'★ 结论：$z_i$ 与 $z_j$ 被比较的概率是 $\\frac{2}{j-i+1}$（Theorem 7.3）。把它代入 $E[X] = \\sum\\sum \\frac{2}{j-i+1} = O(n\\lg n)$，加上 Lemma 7.1 的 $T(n) = O(n + X)$，就得到 RANDOMIZED-QUICKSORT 的期望运行时间 $O(n\\lg n)$。',
    note:''},
   {type:'drill',title:'检验一下',
    items:[
     {kind:'single',q:'快速排序运行时间的主导项是什么？',
      options:['交换次数','元素比较次数','递归调用次数','分区次数'],answer:1,
      why:'★ Lemma 7.1：$T(n) = O(n + X)$，其中 $X$ 是元素比较的总次数。PARTITION 的 for 循环每次迭代做一次元素比较。'},
     {kind:'single',q:'$z_i$ 与 $z_j$（$i < j$）被比较的条件是什么？',
      options:['$z_i$ 或 $z_j$ 是全局最大/最小值','$z_i$ 或 $z_j$ 是 $Z_{ij}$ 中第一个被选为轴的','$z_i$ 和 $z_j$ 相邻','$z_i$ 和 $z_j$ 都是偶数'],answer:1,
      why:'★ Lemma 7.2：第一个从 $Z_{ij}$ 中被选为轴的元素如果是 $z_i$ 或 $z_j$，它们就会被比较（轴与 $Z_{ij}$ 中所有元素比较一次）。'},
     {kind:'single',q:'$z_i$ 与 $z_{i+1}$（相邻元素）被比较的概率是？',
      options:['$2/n$','$1/2$','$1$','$2/n^2$'],answer:2,
      why:'★ $\\frac{2}{j-i+1} = \\frac{2}{2} = 1$。相邻元素**总是**被比较 —— 因为 $Z_{i,i+1} = \\{z_i, z_{i+1}\\}$，第一个被选为轴的必是其中之一。'},
     {kind:'judge',q:'快速排序中，任何两个元素最多被比较一次。',answer:true,
      why:'★ Lemma 7.2 的后半句："no two elements are ever compared twice"。轴一经选出就从后续递归中消失，所以每对最多比较一次。'},
     {kind:'single',q:'RANDOMIZED-QUICKSORT 的期望运行时间是？',
      options:['$\\Theta(n)$','$\\Theta(n\\lg n)$','$\\Theta(n^2)$','$O(n^2)$ 但不是 $O(n\\lg n)$'],answer:1,
      why:'★ $E[X] = \\sum \\frac{2}{j-i+1} = O(n\\lg n)$，加上 Lemma 7.1 的 $T(n) = O(n+X)$，得 $O(n\\lg n)$。'},
     {kind:'simulate',q:'$z_1$ 与 $z_{100}$（$n = 100$）被比较的概率是多少？填分数的分子。（提示：概率 = 2/(j−i+1)）',expect:[2],placeholder:'例如：2',
      why:'$\\frac{2}{j-i+1} = \\frac{2}{100-1+1} = \\frac{2}{100} = \\frac{1}{50}$。分子是 2。'},
    ],
    bookExercises:[
     {id:'7.4-1',page:198,star:0,statement:'Show that in the worst case, QUICKSORT\u2019s running time is \u03a9(n\u00b2).',hint:'最坏情况每次分区切出 $(n-1):0$，逐层代价是等差级数 $n + (n-1) + \\dots + 1 = \\Theta(n^2)$。'},
     {id:'7.4-2',page:198,star:0,statement:'Show that the best-case running time of QUICKSORT is \u03a9(n lg n).',hint:'最好情况的递归深度是 $\\lg n$，每层代价 $\\Theta(n)$，所以 $\\Omega(n\\lg n)$。也可以用递归树的叶子数来论证。'},
     {id:'7.4-4',page:198,star:0,statement:'Show that RANDOMIZED-QUICKSORT\u2019s expected running time is \u03a9(n lg n).',hint:'★ 这需要一个下界论证。关键：每次分区至少做 $\\Theta(n)$ 的工作（要扫整个子数组），而递归树至少有 $\\Omega(\\lg n)$ 层。也可以用 $X \\ge \\sum_{\\text{相邻对}} 1 = n - 1$ 的下界。'},
    ]},
  ],
};
