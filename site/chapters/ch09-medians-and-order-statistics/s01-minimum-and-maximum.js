/* 第 9 章 9.1：最小值与最大值（Minimum and maximum）。
 * 原文锚点：印刷页 227–230（pdf_index 248–251）。
 * 引述已用 tools/07_pick_quotes.py pick 逐条预检（14/14 PASS）。
 * 主题：锦标赛论证的下界 n−1；成对处理把 min+max 压到 3⌊n/2⌋。
 */

export default {
  key:'s01',id:'ch09/s01',chapter:9,section:'9.1',
  title:'最小与最大：从 n−1 到 3⌊n/2⌋',shortTitle:'9.1 最小值与最大值',
  titleEn:'Minimum and maximum',
  source:{printed:[227,230],pdf:[248,251]},
  prerequisites:[{label:'8.4 Bucket sort',url:'#/ch08/s04'}],
  stages:[
   {type:'map',title:'顺序统计量的第一课：比较次数能省到什么程度',
    why:'第 $i$ 顺序统计量 = 排序后第 $i$ 小的元素。本章问：**不排序**能否直接拿到它？本关从最简单的两个（最小与最大）开始：找最小值 $n-1$ 次比较是**最优的**；同时找最小和最大，常数因子还能从 $2n$ 压到 $\\lfloor 3n/2\\rfloor$。',
    position:'8.1 是"排序"的下界（$\\Omega(n\\lg n)$），本关是"选择"问题的第一个下界（找最小 $\\ge n-1$）。证明武器变了：锦标赛论证。9.2/9.3 将处理一般的第 $i$ 小。',
    unlocks:[{label:'9.2 Selection in expected linear time',url:'#/ch09/s02'}],
    mathKit:[
     {title:'锦标赛论证',body:'每次比较 = 一场淘汰赛，败者**永久出局**。要确定最小值，除冠军外的每个元素都得输过至少一场 → 至少 $n-1$ 场。'},
     {title:'成对处理的账',body:'每 2 个元素：对内 1 次 + 败者对 min 1 次 + 胜者对 max 1 次 = **3 次/2 元素**。独立找是 4 次/2 元素。'},
     {title:'奇偶的账尾',body:'奇数：首元素直接当初始 min/max，共 $3\\lfloor n/2\\rfloor$。偶数：先比 1 次定初始值，共 $1 + 3(n-2)/2 = 3n/2 - 2$。'},
    ]},
   {type:'intuition',title:'淘汰赛：输过一次就别再比了',
    scene:'网球锦标赛：冠军不打满 n−1 场以外的比赛',
    body:[
     '找最小值的算法就是一场淘汰赛：每次比较淘汰一个（大的出局），$n$ 个人打到只剩 1 个，恰好 $n-1$ 场。**为什么不能更少？** 因为任何"不是最小"的元素都必须至少输过一次，否则它还可能是最小 —— 下界 $n-1$ 就这么朴素。',
     '★ 同时找 min 和 max 的朴素做法是各办一场锦标赛：$2n-2$ 次。**改进的关键是"配对"**：先让两个元素比一场（败者只可能争 min、胜者只可能争 max），这一场的信息被复用了两次 —— 于是每 2 个元素只要 3 次比较。',
     '★ 这是全书第一次出现"**省常数因子**也算贡献"的分析（之前都是 $\\Theta$ 层面）。对渐近记号，$2n$ 与 $1.5n$ 都是 $\\Theta(n)$；但比较次数是真实代价（尤其比较很贵的时候，比如加密数据的比较）。',
     '★ 为什么标题里的下界是 $\\lceil 3n/2\\rceil - 2$ 而正文说 $3\\lfloor n/2\\rfloor$？习题 9.1-2 让你证明这个更紧的版本（$n$ 偶时两者相等：$3n/2 - 2$；$n$ 奇时 $3(n-1)/2 = \\lceil 3n/2\\rceil - 2$）。',
    ],
    interactive:{text:'阶段 5 的 C 程序实测三种方法：n = 10 时 9 / 18 / 13 次。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体）。',
    blocks:[
     {kind:'body',page:228,en:'How many comparisons are necessary to determine the minimum of a set of n elements? To obtain an upper bound of n − 1 comparisons, just examine each element of the set in turn and keep track of the smallest element seen so far.',
      zh:'★ 上界：扫一遍记当前最小 —— $n-1$ 次比较。这就是 MINIMUM 的 5 行。'},
     {kind:'body',page:228,en:'Is this algorithm for minimum the best we can do? Yes, because it turns out that there’s a lower bound of n − 1 comparisons for the problem of determining the minimum.',
      zh:'★★ **n−1 是最优的** —— 上界贴住下界。回答"还能不能更快"需要下界论证，这是本关的主角。'},
     {kind:'body',page:228,en:'Think of any algorithm that determines the minimum as a tournament among the elements. Each comparison is a match in t he tournament in which the smaller of the two elements wins. Since every element except the winner must lose at least one match, we can conclude that n − 1 comparisons are necessary to determine the minimum. Hence the algorithm MINIMUM is optimal with respect to the number of comparisons performed.',
      zh:'★★ **锦标赛论证**：除冠军外每个元素必须至少输一场 → $\\ge n-1$ 场。三句话一个下界 —— 本章所有"不可能更快"的论证都长这个样子。'},
     {kind:'body',page:228,en:'Some applications need to find both the minimum and the maximum of a set of n elements. For example, a graphics program may need to scale a set of (x,y) data to fit onto a rectangular display screen or other graphical output device.',
      zh:'★ 应用动机：图形程序缩放坐标范围。真实需求，不是玩具问题。'},
     {kind:'body',page:228,en:'Of course, we can determine both the minimum and the maximum of n elements using Θ(n) comparisons. We simply find the minimum and maximum in- dependently, using n − 1 comparisons for each, for a total of 2n − 2 = Θ(n) comparisons.',
      zh:'★ 朴素方案：两场锦标赛，$2n-2$ 次。渐近最优，但常数是 2 —— 下面要抠的就是这个 2。'},
     {kind:'body',page:229,en:'Although 2n − 2 comparisons is asymptotically optimal, it is possible to improve the leading constant. We can find both the minimum and the maximum using at most 3 ⌊n/2⌋ comparisons. The trick is to maintain both the minimum and maximum elements seen thus far. Rather than processing each element of the input by comparing it against the current minimum and maximum, at a cost of 2 comparisons per element, process elements in pairs. Compa re pairs of elements from the input first with each other, and then compare the smaller with the current minimum and the larger to the current maximum, at a cost of 3 comparisons for every',
      zh:'★★ **成对技巧**：对内先比 1 次，败者对 min、胜者对 max —— 每 2 个元素 3 次比较，比朴素法每 2 个 4 次省 1 次。★ 这是"信息复用"的最小案例：那 1 次对内比较的结果被 min 和 max 两个搜索同时利用。'},
     {kind:'body',page:229,en:'How you set up initial values for the current minimum and maximum depends on whether n is odd or even. If n is odd, set both the minimum and maximum to the value of the first element, and then process the rest of the elements in pairs.',
      zh:'★ 奇数情况：首元素免费当初始值，剩下 $n-1$ 个（偶数个）配对 → $3(n-1)/2$ 次。'},
     {kind:'body',page:229,en:'If n is even, perform 1 comparison on the first 2 elements to determine the initial values of the minimum and maximum, and then process the rest of the elements in pairs as in the case for odd n.',
      zh:'★ 偶数情况：首对先比 1 次，剩 $n-2$ 个配对 → $1 + 3(n-2)/2 = 3n/2 - 2$ 次。'},
     {kind:'body',page:229,en:'Let’s count the total number of comparisons. If n is odd, then 3 ⌊n/2⌋ comparisons occur. If n is even, 1 initial comparison occurs, followed by another 3.n − 2/=2 comparisons, for a total of 3n/2 − 2. Thus, in either case, the total number of comparisons is at most 3 ⌊n/2⌋.',
      zh:'★★ 账目收尾：奇 $3\\lfloor n/2\\rfloor$、偶 $3n/2 - 2$，统一写成**至多 $3\\lfloor n/2\\rfloor$**。比 $2n-2$ 节省约 25%。'},
    ],
    terms:[
     {en:'order statistic',zh:'顺序统计量（第 i 小的元素）',page:227},
     {en:'tournament',zh:'锦标赛（下界论证模型）',page:228},
    ]},
   {type:'pseudocode',title:'MINIMUM：5 行最优算法',
    lead:'★ 全书最短的算法之一。它的"最优"不是显然的 —— 靠锦标赛下界撑腰。',
    algo:'MINIMUM',signature:'MINIMUM(A, n)',page:228,
    lines:[
     {n:1,code:'min = A[1]',zh:'当前最小 = 首元素。'},
     {n:2,code:'for i = 2 to n',zh:'逐个检查。'},
     {n:3,code:'    if min > A[i]',zh:'★ 每轮恰好 **1 次**比较 —— 这就是锦标赛的一场。'},
     {n:4,code:'        min = A[i]',zh:'新冠军登基。'},
     {n:5,code:'return min',zh:'共 $n-1$ 场比赛。**不可能更少**（锦标赛下界）。'},
    ],
    vars:[
     {name:'min',meaning:'到目前为止见过的最小元素（现任冠军）'},
    ],
    note:'★ 找最大值同样 $n-1$ 次（比赛里"小的赢"换成"大的赢"即可）。本关没有单独给 MAXIMUM 伪代码 —— 原书也只有一句话。'},
   {type:'visualize',title:'看见"配对省下的那 1 次比较"',
    stateLabels:{frontier:'对内败者→min / 胜者→max',result:'已归档'},
    panels:[
     {title:'① 朴素法 vs 成对法：每 2 个元素 4 次 vs 3 次',
      viz:'array',
      algorithm:'min-max',
      input:{array:[3,41,52,26,38,57,9,49]},
      countLabels:{cmp:{label:'比较',unit:'次'},move:{label:'写入',unit:'次'}},
      invariants:[{label:'配对后：对内 1 次定胜负，败者只对 min、胜者只对 max'}],
      presets:[
       {name:'成对法（★ 8 元素 11 次）',array:[3,41,52,26,38,57,9,49]},
       {name:'更多元素',array:[7,2,9,4,3,8,6,5,1,10]},
      ]},
     {title:'② 比较次数随 n 的增长（常数因子可见）',
      viz:'growth',
      chart:{xMax:64,series:[
       {name:'独立找：2n − 2',expr:'2 * n - 2',color:'--viz-compare'},
       {name:'成对法：≈ 3n/2',expr:'1.5 * n',color:'--viz-done'},
       {name:'只找 min：n − 1',expr:'n - 1',color:'--viz-frontier'},
      ]},
      note:'★ 三条线同阶（都是 $\\Theta(n)$），但常数差可见 —— 本关的"优化"就活在这两条线的间距里。'},
    ],
    tasks:[
     '面板 ① 数一数 8 个元素的比较次数：成对法 = 1 + 3×3 = 10？注意最后一对的处理。',
     '面板 ① 对比：朴素法对同一输入是 14 次 —— 每对省 1 次，4 对省 4 次。',
     '面板 ② n = 10：三条线分别是 18、15、9 —— C 程序实测是 18 与 13（偶数 $3n/2-2$），比 15 还紧。',
    ],
    note:'★ 面板 ① 是成对法的逐步动画（新引擎 min-max）；面板 ② 是常数因子的图形化。'},
   {type:'code',title:'实测：三种方法逐次对账',
    intro:'`c/min_max.c` 把书上的每个数字都变成断言：MINIMUM 恰好 $n-1$、独立找 $2n-2$、成对法 $\\le 3\\lfloor n/2\\rfloor$，200 组随机输入逐一验证。',
    pseudocodeRef:'MINIMUM',
    c:{file:'min_max.c',code:String.raw`/* min_max.c -- 9.1 节：最小值与最大值的比较次数实测。
 * 验证三个断言：
 *   ① MINIMUM 恰好用 n − 1 次比较（且这是下界）；
 *   ② 分别找 min 和 max 用 2n − 2 次；
 *   ③ 成对处理法最多 3⌊n/2⌋ 次（奇数 3⌊n/2⌋，偶数 3n/2 − 2）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o min_max min_max.c
 */
#include <assert.h>
#include <stdio.h>

#define MAXN 256

static unsigned g_state = 0x9e3779b9u;
static unsigned rnd_next(void)
{
    unsigned s = g_state;
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    g_state = s;
    return s;
}

/* ① 独立找最小值：恰好 n − 1 次比较 */
static long g_cmp;

static int find_min(const int *a, int n)
{
    int min = a[0];
    for (int i = 1; i < n; i++) {
        g_cmp++;                        /* 比较 min > A[i] */
        if (min > a[i]) { min = a[i]; }
    }
    return min;
}

/* ② 独立找 min 和 max：2n − 2 次 */
static void find_min_max_naive(const int *a, int n, int *mn, int *mx)
{
    int min = a[0], max = a[0];
    for (int i = 1; i < n; i++) {
        g_cmp++; if (min > a[i]) { min = a[i]; }
        g_cmp++; if (max < a[i]) { max = a[i]; }
    }
    *mn = min; *mx = max;
}

/* ③ 成对处理法：≤ 3⌊n/2⌋ 次（伪代码没有给——书上是文字描述，这里照文字实现） */
static void find_min_max_paired(const int *a, int n, int *mn, int *mx)
{
    int min, max, i = 1;
    if (n % 2 == 1) {
        min = max = a[0];               /* 奇数：第一个元素同时当两者 */
    } else {
        g_cmp++;                        /* 偶数：先比 1 次 */
        if (a[0] < a[1]) { min = a[0]; max = a[1]; }
        else             { min = a[1]; max = a[0]; }
        i = 2;
    }
    for (; i + 1 < n; i += 2) {
        int lo, hi;
        g_cmp++;                        /* 对内比较 1 次 */
        if (a[i] < a[i + 1]) { lo = a[i]; hi = a[i + 1]; }
        else                 { lo = a[i + 1]; hi = a[i]; }
        g_cmp++; if (lo < min) { min = lo; }
        g_cmp++; if (hi > max) { max = hi; }
    }
    *mn = min; *mx = max;
}

int main(void)
{
    int checked = 0;
    long cmp_naive_max = 0, cmp_paired_max = 0;
    for (int t = 1; t <= 200; t++) {
        int n = 2 + (int)(rnd_next() % 120);
        int a[MAXN];
        for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 1000); }

        /* ① MINIMUM 恰好 n − 1 次 */
        g_cmp = 0;
        int mn1 = find_min(a, n);
        assert(g_cmp == n - 1);

        /* ② 分别找 = 2n − 2 */
        g_cmp = 0;
        int mn2, mx2;
        find_min_max_naive(a, n, &mn2, &mx2);
        assert(g_cmp == 2 * n - 2);
        if (g_cmp > cmp_naive_max) { cmp_naive_max = g_cmp; }

        /* ③ 成对法 ≤ 3⌊n/2⌋ */
        g_cmp = 0;
        int mn3, mx3;
        find_min_max_paired(a, n, &mn3, &mx3);
        int bound = 3 * (n / 2);
        assert(g_cmp <= bound);
        if (g_cmp > cmp_paired_max) { cmp_paired_max = g_cmp; }

        /* 结果一致 */
        assert(mn1 == mn2 && mn2 == mn3);
        assert(mx2 == mx3);
        checked++;
    }
    printf("part 1: %d 组输入\n", checked);
    printf("part 2: MINIMUM 恰好 n−1 次比较（每次都验证）\n");
    printf("part 3: 独立找 min+max = 2n−2（最大实测 %ld 次）\n", cmp_naive_max);
    printf("part 4: 成对法 ≤ 3⌊n/2⌋（最大实测 %ld 次）—— 节省约 25%%\n", cmp_paired_max);

    /* 对照表：n = 10 时三种方法的比较次数 */
    {
        int a[10] = {3, 41, 52, 26, 38, 57, 9, 49, 4, 12};
        g_cmp = 0; find_min(a, 10);
        long c1 = g_cmp;
        g_cmp = 0; int mn, mx; find_min_max_naive(a, 10, &mn, &mx);
        long c2 = g_cmp;
        g_cmp = 0; find_min_max_paired(a, 10, &mn, &mx);
        long c3 = g_cmp;
        printf("part 5: n = 10 对照：找 min %ld 次 | 独立找两者 %ld 次 | 成对法 %ld 次（偶数 = 3n/2−2 = 13 ≤ 3⌊n/2⌋ = 15）\n",
               c1, c2, c3);
        assert(c1 == 9 && c2 == 18 && c3 == 13);
    }

    puts("all checks passed.");
    return 0;
}
`,
       notes:[{line:25,zh:'`find_min`：MINIMUM 的直译 —— 每轮恰好 1 次比较，循环结束正好 $n-1$ 次（断言逐组验证）。'},
              {line:36,zh:'`find_min_max_naive`：两场独立的锦标赛，$2n-2$ 次。'},
              {line:47,zh:'★ `find_min_max_paired`：成对法。奇偶两个入口（书上的文字描述），对内 1 次 + 败者对 min 1 次 + 胜者对 max 1 次。'},
              {line:103,zh:'part 1–4：200 组随机输入，三种方法的结果一致、次数逐条对上书上的公式。'},
              {line:117,zh:'★ part 5：n = 10 的对照表 9 / 18 / 13 —— 13 = $3n/2 - 2$（偶数），比 $3\\lfloor n/2\\rfloor = 15$ 还紧。'}],
       tests:[{in:'200 组随机输入',out:'MINIMUM 恰好 n−1；独立 2n−2；成对 ≤ 3⌊n/2⌋'},
              {in:'n = 10',out:'9 / 18 / 13 次'}]},
    mapping:[{pc:3,pcCode:'if min > A[i]',c:'`g_cmp++; if (min > a[i])`（第 28 行）—— 计数器就是"锦标赛记分牌"'}]},
   {type:'analyze',title:'三本账：n−1、2n−2、3⌊n/2⌋',
    intro:'本关全部分析压成两张表：下界为什么成立、成对法怎么省。',
    claims:[
     {expr:'n - 1',when:'找最小值的比较次数 —— 上界且是下界 → 最优',page:228,source:'book'},
     {expr:'2n - 2',when:'独立找 min 和 max',page:228,source:'book'},
     {expr:'3 \\lfloor n/2 \\rfloor',when:'成对法找 min 和 max（上界）',page:229,source:'book'},
     {expr:'\\lceil 3n/2 \\rceil - 2',when:'成对法的最坏比较下界（习题 9.1-2 的答案）',page:229,source:'book'},
    ],
    tables:[{caption:'n 的奇偶与账尾',rows:[
      ['','初始','配对部分','总计'],
      ['n 奇','首元素免费','$3(n-1)/2$','$3\\lfloor n/2\\rfloor$'],
      ['n 偶','首对比 1 次','$3(n-2)/2$','$3n/2 - 2$'],
     ]},
     {caption:'每 2 个元素的代价',rows:[
      ['','朴素法','成对法'],
      ['对内比较','0','1'],
      ['对 min','2（各比一次）','1（只有败者）'],
      ['对 max','2','1（只有胜者）'],
      ['合计/2 元素','4','**3**'],
     ]}],
    chart:{xMax:64,series:[
     {name:'独立找：2n − 2',expr:'2 * n - 2',color:'--viz-compare'},
     {name:'成对法：3n/2 − 2',expr:'1.5 * n - 2',color:'--viz-done'},
    ]},
    derivations:[
     {kind:'summation',title:'锦标赛下界：n − 1 是地板',steps:[
      {zh:'把任何找最小值的算法看成锦标赛：每次比较产生一个败者。'},
      {tex:'\\text{非最小值的元素} \\Rightarrow \\text{至少输过一场}',zh:'否则它从未输过，无法排除它是最小的可能。'},
      {tex:'n - 1 \\text{个败者} \\Rightarrow \\ge n - 1 \\text{场}',zh:'★ 每场恰好产生 1 个（新）败者。MINIMUM 的 $n-1$ 贴住它 —— **最优**。'}]},
     {kind:'summation',title:'成对法：那 1 次对内比较被复用两次',steps:[
      {zh:'朴素法里每个元素要分别面对 min 和 max 各一次 —— 但元素之间的相对关系是免费的：'},
      {tex:'\\text{对内 } 1 \\Rightarrow \\text{败者进 min 赛道、胜者进 max 赛道}',zh:'败者永远不可能是 max、胜者永远不可能是 min —— 各省 1 次。'},
      {tex:'\\frac{3(n-1)}{2} \\text{ 或 } 1 + \\frac{3(n-2)}{2} \\le 3\\lfloor n/2 \\rfloor',zh:'★ 习题 9.1-2 证明 $\\lceil 3n/2\\rceil - 2$ 同时也是**下界** —— 成对法是最优的。'}]},
    ],
    note:'★ 中心图：绿线（$3n/2$）与蓝线（$2n$）的间距就是"复用一次比较"的全部价值 —— 25%。'},
   {type:'prove',title:'锦标赛论证：为什么 n − 1 不能再少',
    statement:'Since every element except the winner must lose at least one match, we can conclude that n − 1 comparisons are necessary to determine the minimum. Hence the algorithm MINIMUM is optimal with respect to the number of comparisons performed.',
    page:228,
    intro:'★ 这是全书第一个"信息不够就必须比"的论证。三步：把算法看比赛、数败者、收账。',
    steps:[
     {title:'第一步 · 任何算法都是一场锦标赛',
      en:'Think of any algorithm that determines the minimum as a tournament among the elements. Each comparison is a match in t he tournament in which the smaller of the two elements wins.',page:228,
      body:['比较是算法获得元素间信息的**唯一**手段（这里不假设值域特殊）。',
        '每次比较 = 一场比赛，败者得到一条"它不是最小"的证据。']},
     {title:'第二步 · 没输过的人不能排除',
      en:'Since every element except the winner must lose at least one match, we can conclude that n − 1 comparisons are necessary to determine the minimum.',page:228,
      body:['若某元素从未输过，算法输出别人是最小时，这个"没输过"的元素与输出矛盾 —— 它可能是最小的。',
        '所以**除最终输出外，其余 $n-1$ 个元素都至少输一场**。',
        '每场比赛恰好产生一个败者 → 至少 $n-1$ 场。∎']},
     {title:'第三步 · MINIMUM 贴住下界',
      en:'Hence the algorithm MINIMUM is optimal with respect to the number of comparisons performed.',
      body:['MINIMUM 每轮恰好 1 次、共 $n-1$ 次 = 下界。',
        '★ 上界 = 下界 = $n-1$：这个问题在比较模型下被**完全解决**。',
        '★ 同样的论证稍加改造（胜败两个方向 + 配对复用），习题 9.1-2 证明成对法的 $\\lceil 3n/2\\rceil - 2$ 也是下界。这个" adversary 论证"的雏形将在 8.1（决策树）之后继续长成第 9 章的脊梁。']},
    ],
    conclusion:'★ 结论：$n-1$ 是找最小值的精确比较复杂度 —— 最优算法已到手。同时找两个？成对法把常数从 2 压到 1.5，且习题 9.1-2 说明这也压到了底。下一节：任意的第 $i$ 小。',
    note:''},
   {type:'drill',title:'检验一下',
    items:[
     {kind:'single',q:'找 n 个元素的最小值，最少需要几次比较？',
      options:['n','n − 1','⌈lg n⌉','n/2'],answer:1,
      why:'★ 锦标赛论证：除冠军外每人至少输一场 → $\\ge n-1$；MINIMUM 用 $n-1$ 达到。'},
     {kind:'single',q:'同时找 min 和 max，朴素独立法用多少次比较？',
      options:['n − 1','n','2n − 2','2n'],answer:2,
      why:'★ 两场锦标赛各 $n-1$ 场，合计 $2n-2$。'},
     {kind:'single',q:'成对法每 2 个元素用几次比较？',
      options:['2','3','4','5'],answer:1,
      why:'★ 对内 1 次 + 败者对 min 1 次 + 胜者对 max 1 次 = 3 次（朴素法同段要 4 次）。'},
     {kind:'single',q:'n 为偶数时，成对法的比较总次数是？',
      options:['3n/2','3n/2 − 2','3n/2 − 1','3⌊n/2⌋ − 2'],answer:1,
      why:'★ 首对 1 次定初始值 + $3(n-2)/2$ = $3n/2 - 2$。n 为奇数时是 $3(n-1)/2 = 3\\lfloor n/2\\rfloor$。'},
     {kind:'judge',q:'找最小值可以用 ⌈lg n⌉ 次比较完成。',answer:false,
      why:'★ 锦标赛论证排除了它：每场比赛只产生一个败者，$n-1$ 个元素必须各输一场。$\\lceil\\lg n\\rceil$ 是**猜数字**的账，不是淘汰赛的账。'},
     {kind:'simulate',q:'n = 12（偶数）时成对法的比较次数？（填整数）',expect:[16],placeholder:'例如：15',
      why:'$3n/2 - 2 = 18 - 2 = 16$：首对 1 次 + 剩下 10 个元素配 5 对 × 3 次 = 16。'},
    ],
    bookExercises:[
     {id:'9.1-1',page:229,star:0,statement:'Show that the second smallest of n elements can be found with n C dlg ne − 2 comparisons in the worst case. (Hint: Also find the smallest element.)',hint:'锦标赛找最小（$n-1$ 场）时，记录每场败者：次小值只可能输给过最小值的那 $\\lceil\\lg n\\rceil$ 个元素里（最小值打过 $\\lceil\\lg n\\rceil$ 场）。再在这几个里打 $\\lceil\\lg n\\rceil - 1$ 场。合计 $n + \\lceil\\lg n\\rceil - 2$。'},
     {id:'9.1-2',page:229,star:0,statement:'Given n>2 distinct numbers, you want to find a number that is neither the minimum nor the maximum. What is the smallest number o f comparisons that you need to perform?',hint:'3 次：任取三个数 $a,b,c$，比 $a:b$、胜者比 $c$、败者比 $c$ —— 三场比赛的中间名次就是"非最小非最大"。2 次不够（三个数两次比较连全序都可能定不了）。'},
     {id:'9.1-3',page:229,star:0,statement:'A racetrack can run races with five horses at a time to determine their relative speeds. For 25 horses, it takes six races to determine the fastest horse, assuming transitivity (see page 1159). What’s the minimum number of races it takes to determine the fastest three horses out of 25?',hint:'5 场分组赛 + 1 场冠军赛。前三名只可能在：冠军所在组的前二、冠军赛的二三名所在组的第一 —— 共 5 匹争 2 席，再赛 1 场。答案 **7 场**。'},
    ]},
  ],
};
