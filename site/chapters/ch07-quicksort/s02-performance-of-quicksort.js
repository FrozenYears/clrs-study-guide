/* 第 7 章 7.2：快速排序的性能（Performance of quicksort）。
 * 原文锚点：印刷页 187–190（pdf_index 208–211）。
 */

/* Figure 7.4 的递归树（9:1 分裂，原书 p.189） */
const N='n', A9='(9/10)n', A1='(1/10)n', B2='(9/10)²n', C2='(9/10)(1/10)n', D2='(1/10)²n';
const nd=(l,k,c)=>({label:l,children:k,cost:c||null});
const lf=(l)=>({label:l,cost:null});

const TREE74=[
 {root:nd(N,[],'n')},
 {root:nd(N,[nd(A9,[],'9n/10'),nd(A1,[],'n/10')],'n')},
 {root:nd(N,[nd(A9,[nd(B2,[],'(9/10)²n'),nd(C2,[],'(9/10)(1/10)n')],'9n/10'),nd(A1,[nd(C2,[],'(9/10)(1/10)n'),nd(D2,[],'(1/10)²n')],'n/10')],'n')},
 {root:nd(N,[nd(A9,[nd(B2,[lf('…'),lf('…')],'(9/10)³n'),nd(C2,[lf('…'),lf('…')],'(9/10)²(1/10)n')],'9n/10'),nd(A1,[nd(C2,[lf('…'),lf('…')],'(9/10)²(1/10)n'),nd(D2,[lf('…'),lf('…')],'(1/10)³n')],'n/10')],'n')},
];
const NOTES74=[
 '(a) 根结点：规模 n，分区代价 n（原书把 Θ(n) 简写成 n）。',
 '(b) 9:1 分裂：左枝 9n/10、右枝 n/10。**这一层的总代价还是 n**。',
 '(c) 再展开一层：四个结点，这层总代价仍是 n。左枝比右枝深得多。',
 '(d) 原书画到第三层。关键：从根到最深叶子要 log₁₀₍₉₎n = Θ(lg n) 层，每层代价 n → 总代价 O(n lg n)。',
];

export default {
  key:'s02',id:'ch07/s02',chapter:7,section:'7.2',
  title:'快排的性能：分得匀不匀，差一个 n 倍',shortTitle:'7.2 快速排序的性能',
  titleEn:'Performance of quicksort',
  source:{printed:[187,190],pdf:[208,211]},
  prerequisites:[{label:'7.1 Description of quicksort',url:'#/ch07/s01'}],
  stages:[
   {type:'map',title:'同一个算法，最好最差差一个 n 倍',
    why:'快速排序只有一份代码，却有两个天差地别的运行时间：分区均衡时 Θ(n lg n)，每次切出 n−1 : 0 时 Θ(n²)。决定因素只有一个：每次分区切得多匀。',
    position:'7.1 给出算法；本关给出三个递推式与其解。7.3 用随机化把最坏变成"不太可能"，7.4 算出期望 Θ(n lg n)。',
    unlocks:[{label:'7.3 A randomized version of quicksort',url:'#/ch07/s03'}],
    mathKit:[
     {title:'三种递推式',body:'最坏 $T(n)=T(n-1)+\\Theta(n) \\Rightarrow \\Theta(n^2)$；最好 $T(n)=2T(n/2)+\\Theta(n) \\Rightarrow \\Theta(n\\lg n)$；9:1 $T(n)=T(9n/10)+T(n/10)+\\Theta(n) \\Rightarrow \\Theta(n\\lg n)$。'},
     {title:'递归栈也是空间',body:'额外空间 = 递归最大深度：最坏 $\\Theta(n)$，最好 $\\Theta(\\lg n)$。"原地"指不开辅助数组，不是"额外空间是常数"。'},
     {title:'等差 vs 几何',body:'最坏情况逐层求和得到**等差级数**（发散到 $\\Theta(n^2)$）；6.3 建堆得到**几何级数**（收敛到 $O(n)$）。同样是分层求和，级数类型决定一切。'},
    ]},
   {type:'intuition',title:'同一个代码，两种命运',
    scene:'同一个司机走同一条路：畅通就走直线，堵车就绕远',
    body:[
     '快速排序的时间 = $n \\times$ **递归深度**（每层总代价都是 $\\Theta(n)$，分区把数组扫了一遍）。',
     '最好：正中切开，深度 $\\lg n$ → $n\\lg n$。最坏：$n-1:0$，深度 $n$ → $n^2$。',
     '★ 反直觉：**9:1 的分裂看似很不均衡，其实完全够好**——深度 $\\log_{10/9} n = \\Theta(\\lg n)$，每层代价 $n$。**任何常数比例**的分裂都是 $O(n\\lg n)$。',
     '★ 还要纠正一个印象：快速排序"原地"指**不开辅助数组**，但**递归栈**最坏要 $\\Theta(n)$。',
    ],
    interactive:{text:'阶段 5 面板 ② 切到"已排序"输入：每次递归的子数组只比上一次短一格 —— 递归退化成一条链。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体）。',
    blocks:[
     {kind:'body',page:187,en:'The running time of quicksort depends on how balanced each partitioning is, which in turn depends on which elements are used as pivot s. If the two sides of a partition are about the same size—the partitioning is balanced—then the algorithm runs asymptotically as fast as merge sort. If the partitioning is unbalanced, however, it can run asymptotically as slowly as insertion sort.',
      zh:'★★ 主题句：**均衡 → 归并排序的速度；不均衡 → 插入排序的速度**。决定因素是"选哪些元素当轴"。'},
     {kind:'body',page:187,en:'But first, let\u2019s briefly look at the maximum amount of memory that quicksort re- quires. Although quicksort sorts in place according to the definition on page 158, the amount of memory it uses\u2014aside from the array being sorted\u2014is not constant.',
      zh:'★★ 纠正一个误解："原地"不等于"额外空间是常数"。**递归栈**是另一回事。'},
     {kind:'body',page:187,en:'Since each recursive call requires a constant amount of space on the runtime stack, outside of the array being sorted, quicksort requires space proportional to the maximum depth of the recursion. As we\u2019ll see now, that could be as bad as Θ(n) in the worst case.',
      zh:'★ 额外空间 = 递归最大深度，最坏 Θ(n)。'},
     {kind:'body',page:187,en:'The worst-case behavior for quicksort occurs when the partitioning produces one subproblem with n − 1 elements and one with 0 elements. (See Section 7.4.1.)',
      zh:'★ 最坏情况的形态：每次切出 $n-1:0$。'},
     {kind:'body',page:188,en:'Thus, if the partitioning is maximally unbalanced at every recursive level of the algorithm, the running time is Θ(n 2 ). The worst-case running time of quicksort is therefore no better than that of insertion sort. Mo reover, the Θ(n 2 ) running time occurs when the input array is already completely sorted\u2014a situation in which insertion sort runs in O(n) time.',
      zh:'★★ 最扎心的一句：**最坏情况恰好发生在输入已完全有序时** —— 而那种输入对插入排序只要 $O(n)$。同一份输入，简单算法反而快 $n$ 倍。这就是 7.3 随机化的动机。'},
     {kind:'body',page:188,en:'By case 2 of the master theorem (Theorem 4.1 on page 102), this recurrence has the solution T(n) = Θ(n lg n). Thus, if the partitioning is equally balanced at every level of the recursion, an asymptotically faster algorithm results.',
      zh:'★ 最好情况 $\\Theta(n\\lg n)$（主方法第 2 种情况）。这个递推式与 2.3 归并排序的完全一样。'},
     {kind:'body',page:189,en:'The recursion terminates at depth log 10/9 n = Θ(lg n). Thus, with a 9-to-1 proportional split at every level of recursion, which intuitively seems highly unbalanced, quicksort runs in O(n lg n) time\u2014asymptotically the same as if the split were right down the middle. Indeed, even a 99-to-1 split yields an O(n lg n) running time. In fact, any split of constant proportionality yields a recursion tree of depth Θ(lg n), where the cost at each level is O(n). The running time is therefore',
      zh:'★★ 普适结论：**任何常数比例**的分裂（9:1、99:1）都给出 $O(n\\lg n)$ —— 比例只影响常数。$\\log_{10/9} n \\approx 6.58\\lg n$，常数涨了但阶不变。'},
     {kind:'body',page:187,en:'The worst-case behavior for quicksort occurs when the partitioning produces one subproblem with n − 1 elements and one with 0 elements.',
      zh:'最坏情况的形态。'},
    ],
    terms:[
     {en:'balanced partitioning',zh:'均衡的分区',page:187},
     {en:'recursion tree',zh:'递归树',page:189},
    ]},
   {type:'pseudocode',title:'分析对象：7.1 的两段代码（回顾）',
    lead:'★ 本关不做新实现。把伪代码放在这里是为了读分析时能对照着看。',
    algo:'QUICKSORT',signature:'QUICKSORT(A, p, r)',page:183,
    lines:[
     {n:1,code:'if p < r',zh:'递归出口。'},
     {n:2,code:'    // Partition the subarray around the pivot, which ends up in A[q].',zh:'注释。'},
     {n:3,code:'    q = PARTITION(A, p, r)',zh:'★ 全部代价都在这一行。**切得多匀**决定递归树形状与总时间。'},
     {n:4,code:'    QUICKSORT(A, p, q − 1)    // recursively sort the low side',zh:'低侧递归。'},
     {n:5,code:'    QUICKSORT(A, q + 1, r)    // recursively sort the high side',zh:'高侧递归。'},
    ],
    vars:[{name:'q',meaning:'轴的下标 —— 决定两段的大小比'}],
    note:'★ 三个递推式的差别全部来自第 3 行"切出什么比例"。'},
   {type:'visualize',title:'看见"每层代价都是 n"与"深度决定一切"',
    stateLabels:{frontier:'当前子数组',pivot:'枢轴已就位'},
    panels:[
     {title:'① 9:1 分裂的递归树（原书 Figure 7.4）',
      viz:'tree',vizMode:'tree',
      trees:TREE74,treeNotes:NOTES74},
     {title:'② 已排序输入：递归退化成一条链（最坏情况）',
      viz:'array',
      algorithm:'quicksort',pseudocodeRef:'QUICKSORT',
      input:{array:[1,2,3,4,5,6,7,8]},
      countLabels:{cmp:'比较',move:{label:'交换',unit:'次'},calls:{label:'递归调用',unit:'次'}},
      invariants:[{label:'每次递归的当前子数组只比上一次短一格 —— 深度变成 n'}],
      presets:[
       {name:'★ 已排序：最坏情况',array:[1,2,3,4,5,6,7,8],args:[1,8]},
       {name:'乱序（对照）',array:[2,8,7,1,3,5,6,4],args:[1,8]},
       {name:'全部相同：同样退化',array:[5,5,5,5,5,5,5,5],args:[1,8]},
      ]},
    ],
    tasks:[
     '面板 ① 逐层看：每层结点加起来是不是约等于 n？',
     '面板 ① 最深的那条枝每次乘 9/10 —— 要乘多少次才小于 1？',
     '面板 ② 切到"已排序"：当前子数组每轮只短一格 —— 递归深度变成 n。',
    ],
    note:'★ 面板 ① 是示意（真实 9:1 树约 42 层）。关键信息是"每层代价 n"+"深度 Θ(lg n)"。'},
   {type:'code',title:'实测：三种输入形态的调用次数',
    intro:'7.1 的 C 实现可以直接拿来测。这里量测递归调用次数（"递归深度"的可观测代理）。',
    pseudocodeRef:'QUICKSORT',
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
       notes:[{line:98,zh:'`quicksort` 与书上 5 行一一对应（7.1 已实现）。本关**没有改它**。'},
              {line:50,zh:'`partition` 每被调用一次就扫一遍当前子数组，所以"每层总代价" = 该层各结点的子数组长度之和。'},
              {line:330,zh:'★ 第 6c 组：n = 24 时递增输入调用 47 次（= 2n−1），随机输入只调用 29 次。调用次数是"递归深度"的可观测代理。'}],
       tests:[{in:'120 组随机输入',out:'QUICKSORT 排好序且元素集合不变'},
              {in:'n = 24，递增 vs 随机',out:'调用 47 次（= 2n−1）vs 29 次'}]},
    mapping:[{pc:1,pcCode:'if p < r',c:'`if (p < r) {`（第 100 行）'},
             {pc:3,pcCode:'q = PARTITION(A, p, r)',c:'`int q = partition(a, p, r, st);`（第 102 行）'}]},
   {type:'analyze',title:'三个递推式，三种命运',
    intro:'本节全部分析可以压成一张表：递推式由分区形态决定，解由递归树每层代价 × 深度给出。',
    claims:[
     {expr:'\\Theta(n^2)',when:'最坏情况：每次分区都是 (n−1) : 0',page:188,source:'book'},
     {expr:'\\Theta(n \\lg n)',when:'最好情况：尽量对半',page:188,source:'book'},
     {expr:'O(n \\lg n)',when:'9:1 分裂（任何常数比例都一样）',page:189,source:'book'},
     {expr:'\\Theta(n)',when:'递归栈的最大深度（最坏情况）',page:187,source:'book'},
    ],
    tables:[{caption:'三种分区形态对照',rows:[
      ['','最坏：(n−1):0','9:1','最好：n/2:n/2'],
      ['递推式','$T(n)=T(n-1)+\\Theta(n)$','$T(n)=T(9n/10)+T(n/10)+\\Theta(n)$','$T(n)=2T(n/2)+\\Theta(n)$'],
      ['递归深度','$n$','$\\Theta(\\lg n)$','$\\lg n$'],
      ['每层代价','$n,n-1,\\dots,1$（等差）','$n$','$n$'],
      ['总时间','$\\Theta(n^2)$','$O(n\\lg n)$','$\\Theta(n\\lg n)$'],
    ]},
     {caption:'额外空间：被误解的"原地"',rows:[
      ['','被排序的数组之外','来源'],
      ['最好情况','$\\Theta(\\lg n)$','递归栈深度'],
      ['最坏情况','$\\Theta(n)$','递归栈深度'],
      ['"原地"的含义','不开**辅助数组**','p.158 的定义'],
     ]}],
    chart:{xMax:128,series:[
     {name:'最坏 ∼ n²/2',expr:'n * n / 2',color:'--viz-violation'},
     {name:'最好 ∼ n·lg n',expr:'n * Math.log2(n)',color:'--viz-done'},
     {name:'9:1 ∼ n·log₁₀₍₉₎n',expr:'n * Math.log(n) / Math.log(10 / 9)',color:'--viz-compare'},
    ]},
    derivations:[
     {kind:'summation',title:'最坏情况：等差级数给出 Θ(n²)',steps:[
      {zh:'每次分区切出 $(n-1):0$，逐层代价：'},
      {tex:'cn + c(n-1) + \\dots + c = c \\cdot \\frac{n(n+1)}{2} = \\Theta(n^2)',zh:'等差级数（A.3）。对照 6.3 的几何级数。'},
      {zh:'★ 也可用代入法（4.3 那一关的技术）。'}]},
     {kind:'summation',title:'9:1 分裂为什么还是 O(n lg n)',steps:[
      {zh:'最深路径每次乘 $9/10$。'},
      {tex:'\\log_{10/9} n = \\frac{\\lg n}{\\lg(10/9)} \\approx 6.58 \\lg n = \\Theta(\\lg n)',zh:'常数涨了但阶不变。'},
      {tex:'T(n) \\le \\sum_{h=0}^{\\Theta(\\lg n)} n = \\Theta(n \\lg n)',zh:'每层 n、共 Θ(lg n) 层。'},
      {zh:'★ 面板 ① 的树就是这条递归的前四层。'}]},
     {kind:'summation',title:'「原地」≠「额外空间是常数」',steps:[
      {tex:'\\text{额外空间} = \\Theta(\\text{递归最大深度})',zh:'每次递归调用占常数栈空间。'},
      {tex:'T_{\\text{space}} = \\begin{cases}\\Theta(\\lg n) & \\text{最好}\\\\\\Theta(n) & \\text{最坏}\\end{cases}',zh:'★ 工程上很重要：栈深过大会**栈溢出**。'}]},
    ],
    note:'★ 中心图：最坏 $n^2/2$ 一路上扬；最好与 9:1 两条几乎贴在一起 —— 这就是"只要按常数比例分裂就够好"的图形化表达。'},
   {type:'prove',title:'最坏情况的下界：从递推式到 Θ(n²)',
    statement:'The worst-case behavior for quicksort occurs when the partitioning produces one subproblem with n − 1 elements and one with 0 elements.',
    page:187,
    intro:'★ 本关的"证明"证明的不是正确性，而是一个下界。原书用逐层求和，这里整理成三步。',
    steps:[
     {title:'第一步 · 递推式',en:'Let us assume that this unbalanced partitioning arises in each recursive call. The partitioning costs Θ(n) time. Since the recursive call on an array of size 0 just returns without doing anything, T(0) = Θ(1), and the recurrence for the running time is T(n) = T(n − 1) + T(0) + Θ(n)',page:187,
      body:['分区代价 $\\Theta(n)$（7.1 已证）；$T(0) = \\Theta(1)$。于是 $T(n) = T(n-1) + \\Theta(n)$。','★ 只有**一项**递归 —— 递归树退化成一条链。']},
     {title:'第二步 · 逐层展开',en:'By summing the costs incurred at each level of the recursion, we obtain an arithmetic series (equation (A.3) on page 1141), which evaluates to Θ(n 2 ).',page:188,
      body:['$T(n) = cn + c(n-1) + \\dots + c$。各层代价构成**等差数列**。','★ 对照 6.3：那里是**几何**数列（收敛）。两种分层求和的差异全在级数类型上。']},
     {title:'第三步 · 求和',en:'Thus, if the partitioning is maximally unbalanced at every recursive level of the algorithm, the running time is Θ(n 2 ). The worst-case running time of quicksort is therefore no better than that of insertion sort.',page:188,
      body:['$c \\cdot \\frac{n(n+1)}{2} = \\Theta(n^2)$。','★ 原书补了 "no better than that of insertion sort"。更扎心的是下一条：最坏情况恰好发生在输入已完全有序时。']},
    ],
    conclusion:'★ 结论：若每次分区都切出 $(n-1):0$，快速排序是 $\\Theta(n^2)$，额外空间也是 $\\Theta(n)$。这个最坏情况在输入已有序时出现。7.3 的随机化版本做的就是摆脱它。',
    note:''},
   {type:'drill',title:'检验一下',
    items:[
     {kind:'single',q:'快速排序最坏情况的分区形态是？',options:['$n/2:n/2$','$9:1$','$(n-1):0$','$n:n$'],answer:2,why:'每次切出 $(n-1):0$，递推式退化为 $T(n)=T(n-1)+\\Theta(n)$。'},
     {kind:'single',q:'最坏情况发生在输入处于什么状态时？',options:['全部相同','已经完全有序','随机乱序','逆序'],answer:1,why:'★ 原书 p.188："occurs when the input array is already completely sorted"—— 此时插入排序只要 $O(n)$。'},
     {kind:'single',q:'9:1 的分裂给出的运行时间是？',options:['$\\Theta(n^2)$','$O(n\\lg n)$','$\\Theta(n)$','$O(n^2)$'],answer:1,why:'深度 $\\log_{10/9}n=\\Theta(\\lg n)$、每层代价 $n$。'},
     {kind:'judge',q:'快速排序是原地排序，所以它使用的额外空间是常数。',answer:false,why:'★ 原书 p.187 专门纠正：额外空间 = 递归栈的最大深度，最坏 $\\Theta(n)$。'},
     {kind:'single',q:'解最坏情况的递推式时，逐层求和得到的是哪一类级数？',options:['几何级数','等差级数，和为 Θ(n²)','调和级数','无法求和'],answer:1,why:'等差级数（A.3），和为 $\\Theta(n^2)$。'},
     {kind:'simulate',q:'对 n = 1024 的已排序输入做快速排序，递归深度约是几？（填整数）',expect:[1024],placeholder:'例如：1024',
      why:'每层只切掉一个元素，所以递归深度就是 $n = 1024$。'},
    ],
    bookExercises:[
     {id:'7.2-1',page:191,star:0,statement:'Use the substitution method to prove that the recurrence T(n) = T(n − 1) + Θ(n) has the solution T(n) = Θ(n 2 ), as claimed at the beginning of Section 7.2.',hint:'上界：猜 $T(n)\\le cn^2$。下界类似。'},
     {id:'7.2-2',page:191,star:0,statement:'What is the running time of QUICKSORT when all elements of array A have the same value?',hint:'全部相同时每次分区都是 $(n-1):0$，所以 $\\Theta(n^2)$。'},
     {id:'7.2-4',page:191,star:0,statement:'Banks often record transactions on an account in or der of the times of the trans- actions, but many people like to receive their bank statements with checks listed in order by check number. People usually write checks in order by check num- ber, and merchants usually cash them with reasonable dispatch. The problem of converting time-of-transaction ordering to check-number ordering is therefore the problem of sorting almost-sorted input. Explain persuasively why the procedure INSERTION-SORT might tend to beat the procedure QUICKSORT on this problem.',hint:'「几乎有序」这件事只有插入排序吃得到：它的代价随逆序对数走，近有序输入下接近 $\\Theta(n)$；而 PARTITION 只认枢轴的秩，输入越有序对它没有任何好处。再补一句：真实账单里检查号与时间序「大致同向」，正是逆序对很少的形式化。'},
     {id:'7.2-6',page:191,star:0,statement:'Consider an array with distinct elements and for which all permutations of the ele- ments are equally likely. Argue that for any constant 0<˛ ≤ 1/2, the probability is approximately 1 − 2˛ that PARTITION produces a split at least as balanced as 1 − ˛ to ˛.',hint:'落在 $[\\alpha n,(1-\\alpha)n]$ 秩区间里的比例是 $1-2\\alpha$。'},
    ]},
  ],
};
