/* 第 14 章 14.1：钢条切割（Rod cutting）。印刷页 363–373（pdf 384–394）。
 * 引述已用 07_pick_quotes.py pick 14 14.1 预检 PASS。 */
const KEYS = [1, 5, 8, 9, 10, 17, 17, 20, 24, 30];

export default {
  key:'s01',id:'ch14/s01',chapter:14,section:'14.1',
  title:'钢条切割：动态规划的开场',shortTitle:'14.1 钢条切割',
  titleEn:'Rod cutting',
  source:{printed:[363,373],pdf:[384,394]},
  prerequisites:[{label:'13.4 Deletion',url:'#/ch13/s04'}],
  stages:[
   {type:'map',title:'第 14 章：动态规划 —— 用"记住答案"换掉指数爆炸',
    why:'钢条切割是 DP 的标准开场：给定长度 $n$ 的钢条与价格表 $p_i$，求最大收益。**切法有 $2^{n-1}$ 种**（每种长度都是"切或不切"的独立选择），暴力必然爆炸。DP 的两把武器：**最优子结构**（最优解由子问题最优解拼成）与**重叠子问题**（同一子问题被反复求解 → 记住它）。',
    position:'第 4 章的分治把问题**切小**后递归；DP 处理的是**子问题重叠**的分治 —— 钢条切割的递归树里同一长度出现多次。本章 14.2 矩阵链、14.4 LCS、14.5 最优 BST 全是同一套路；第 15 章的贪心则是"DP 的特例：连选择都不用试"。',
    mathKit:[
     {title:'递推式 (14.2)',body:'$r_n = \\max_{1 \\le i \\le n}(p_i + r_{n-i})$，$r_0 = 0$。'},
     {title:'朴素递归的代价',body:'$T(n) = 1 + \\sum_{j=0}^{n-1} T(j)$ → $T(n) = 2^n$（指数）。C 程序实测 $n=10$ 调用 **1024** 次。'},
     {title:'备忘/自底向上',body:'每个子问题只解一次 → $\\Theta(n^2)$。C 程序实测 $n=10$ 只要 **56** 次调用。'},
    ]},
   {type:'intuition',title:'为什么"切法 2^(n−1)"不等于"算法必须指数"',
    scene:'同一段钢条被反复"重新计算"',body:[
     '纯递归的树里，$r_4$ 会被算很多次 —— 这就是**重叠子问题**。DP 的两条路：**备忘**（递归 + 查表，自上而下）与**自底向上**（先算小规模）。',
     '★ 关键洞察：**最优解的第一刀**切在 $i$ 处，则剩余 $n-i$ 必须是它自己的最优解（最优子结构）。于是 $r_n = \\max_i(p_i + r_{n-i})$ —— 一次选择 + 一个更小的同类问题。',
     '★ 忘掉"每种切法"的视角，改用"**组合视角**"：最优解 = 某一段 + 剩余部分的最优解。视角一换，$2^{n-1}$ 变成 $n^2$。']  ,
    interactive:{text:'阶段 5 用 growth 面板对比 2^n 与 n^2。'}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 √i 代表价格 p_i）。',blocks:[
     {kind:'body',page:363,en:'The rod-cutting problem is the following. Given a rod of length n inches and a table of prices √i for i = 1,2,…,n , determine the',
      zh:'★★ 问题定义：给定长度 $n$ 与价格表 $p_i$，求最大收益。'},
     {kind:'body',page:363,en:'Serling Enterprises can cut up a rod of length n in 2 n−1 different ways, since they have an independent option of cutting, or not',
      zh:'★★ **$2^{n-1}$ 种切法的由来**：每个位置"切或不切"独立选择。★ 这是"暴力不可行"的量化依据。'},
     {kind:'body',page:367,en:'The dynamic-programming method works as follows. Instead of solving the same subproblems repeatedly, as in the naive recursion solution, arrange for each subproblem to be solved only once.',
      zh:'★★ **DP 的核心策略**：不再重复求解同一子问题 —— 安排每个子问题只解一次。'},
     {kind:'body',page:368,en:'The first approach is top-down with memoization.',
      zh:'★★ **第一条路线：自上而下 + 备忘**（top-down with memoization）—— 递归写法照旧，只多一步存答案与查答案。'},
     {kind:'body',page:368,en:'The second approach is the bottom-up method.',
      zh:'★★ **第二条路线：自底向上**（bottom-up）—— 按子问题规模从小到大填表，保证依赖已就绪。'},
    ],terms:[{en:'bottom-up method',zh:'自底向上法（按规模从小到大填表）',page:368}]},
   {type:'pseudocode',title:'CUT-ROD：6 行的递归',algo:'CUT-ROD',signature:'CUT-ROD(p, n)',page:366,
    lines:[
     {n:1,code:'if n == 0',zh:'长度 0 → 收益 0。'},
     {n:2,code:'    return 0',zh:''},
     {n:3,code:'q = −1',zh:'当前最大收益（用 −1 表示"还没找到"）。'},
     {n:4,code:'for i = 1 to n',zh:'枚举第一刀的位置 $i$。'},
     {n:5,code:'    q = max {q, p[i] + CUT-ROD(p, n − i)}',zh:'★ 一次选择 + 一个更小的同类子问题。'},
     {n:6,code:'return q',zh:''},
    ],vars:[{name:'p',meaning:'价格表 $p[1..n]$'},{name:'n',meaning:'剩余长度'}],
    note:'★ 这 6 行是"指数"的来源：每次调用都展开 $n$ 个子调用，重叠部分白算。',
    more:[
     {algo:'BOTTOM-UP-CUT-ROD',subtitle:'BOTTOM-UP-CUT-ROD(p, n) —— 8 行、无递归',signature:'BOTTOM-UP-CUT-ROD(p, n)',page:369,
      lines:[
       {n:1,code:'let r[0 : n] be a new array    // will remember solution values in r',zh:''},
       {n:2,code:'r[0] = 0',zh:'最小子问题先解。'},
       {n:3,code:'for j = 1 to n    // for increasing rod length j',zh:'★ 按长度递增 —— 保证 $r[j-i]$ 已算好。'},
       {n:4,code:'    q = −1',zh:''},
       {n:5,code:'    for i = 1 to j    // i is the position of the first cut',zh:''},
       {n:6,code:'        q = max {q, p[i] + r[j − i]}',zh:'★ 与递归版唯一区别：用**查表** $r[j-i]$ 取代递归调用。'},
       {n:7,code:'    r[j] = q    // remember the solution value for length j',zh:''},
       {n:8,code:'return r[n]',zh:''},
      ],vars:[{name:'r',meaning:'备忘数组：$r[j]$ = 长度 $j$ 的最优收益'}],
      note:'★ 只差一处（查表 vs 递归），代价从 $2^n$ 降到 $\\Theta(n^2)$。'},
    ]},
   {type:'visualize',title:'指数 vs 多项式',panels:[
     {title:'切法数 2^(n−1) 与 DP 的 n²',viz:'growth',
      chart:{xMax:32,series:[
       {name:'朴素递归 ≈ 2^n',expr:'Math.pow(2, n / 2)',color:'--viz-violation'},
       {name:'DP ≈ n²',expr:'n * n / 4',color:'--viz-done'}]},
      note:'★ 同一条问题的两种算法：红线指数、绿线多项式 —— DP 的全部价值就在这条缝里。'},
    ],tasks:['观察 n = 20 时两条线的差距（2^20 ≈ 100 万 vs 400）—— 实测 n=10 是 1024 : 56。'],note:''},
   {type:'code',title:'实测：1024 次 vs 56 次',c:{file:'rod_cutting.c',code:String.raw`/* rod_cutting.c -- 14.1: 钢条切割四版实现与调用次数实测。
 * 价格表 = 原书 Figure 14.1 的 p[1..10] = 1,5,8,9,10,17,17,20,24,30
 * 关键结论：n=4 最优收益 10（切成 2+2）；朴素递归 n=10 调用 2^9 量级 vs 备忘 O(n^2)。
 */
#include <assert.h>
#include <stdio.h>

#define NMAX 32
static int p[NMAX + 1] = {0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30};
static long calls;                     /* 朴素递归的调用计数 */

static int imax(int a, int b) { return a > b ? a : b; }

/* ① CUT-ROD：朴素递归（6 行） */
static int cut_rod(int n)
{
    calls++;
    if (n == 0) { return 0; }
    int q = -1;
    for (int i = 1; i <= n; i++) { q = imax(q, p[i] + cut_rod(n - i)); }
    return q;
}

/* ② MEMOIZED-CUT-ROD-AUX：带备忘（9 行） */
static int memo_aux(int n, int *r)
{
    calls++;
    if (r[n] >= 0) { return r[n]; }
    int q;
    if (n == 0) { q = 0; }
    else {
        q = -1;
        for (int i = 1; i <= n; i++) { q = imax(q, p[i] + memo_aux(n - i, r)); }
    }
    r[n] = q;
    return q;
}

/* ③ BOTTOM-UP-CUT-ROD：自底向上（8 行） */
static int bottom_up(int n, int *r)
{
    r[0] = 0;
    for (int j = 1; j <= n; j++) {
        int q = -1;
        for (int i = 1; i <= j; i++) { calls += 0; q = imax(q, p[i] + r[j - i]); }
        r[j] = q;
    }
    return r[n];
}

/* ④ EXTENDED-BOTTOM-UP-CUT-ROD：同时给出切割方案（s[]） */
static int extended(int n, int *r, int *s)
{
    r[0] = 0;
    for (int j = 1; j <= n; j++) {
        int q = -1;
        for (int i = 1; i <= j; i++) {
            if (q < p[i] + r[j - i]) { q = p[i] + r[j - i]; s[j] = i; }
        }
        r[j] = q;
    }
    return r[n];
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);
    int r[NMAX + 1], s[NMAX + 1];

    /* ① 朴素递归：最优收益 + 调用爆炸 */
    calls = 0;
    int v4 = cut_rod(4);
    assert(v4 == 10);
    printf("part 1: CUT-ROD(4) = %d（切成 2+2 = 5+5），调用 %ld 次\n", v4, calls);
    calls = 0;
    int v10 = cut_rod(10);
    printf("part 2: CUT-ROD(10) = %d，调用 %ld 次 = 2^9 量级（指数爆炸）\n", v10, calls);

    /* ② 备忘版：同样的答案，调用数大幅下降 */
    for (int i = 0; i <= NMAX; i++) { r[i] = -1; }
    calls = 0;
    int m10 = memo_aux(10, r);
    assert(m10 == v10);
    printf("part 3: MEMOIZED-CUT-ROD(10) = %d，调用 %ld 次（Θ(n²)）\n", m10, calls);

    /* ③ 自底向上 */
    for (int i = 0; i <= NMAX; i++) { r[i] = 0; }
    int b10 = bottom_up(10, r);
    assert(b10 == v10);
    printf("part 4: BOTTOM-UP-CUT-ROD(10) = %d（与递归版同答案，无递归开销）\n", b10);

    /* ④ 完整方案 */
    int e10 = extended(10, r, s);
    assert(e10 == v10);
    printf("part 5: 最优切割方案（n=10）：");
    int n = 10;
    while (n > 0) { printf("%d ", s[n]); n -= s[n]; }
    printf("（原书 Figure 14.4 的方案：10 = 10）\n");

    /* ⑤ 最优收益表（n = 1..10）—— 与原书 Figure 14.1 对应 */
    printf("part 6: 最优收益 r[1..10] = ");
    for (int i = 1; i <= 10; i++) { printf("%d%s", r[i], i < 10 ? "," : ""); }
    printf("（原书 p.364 的表）\n");
    assert(r[1] == 1 && r[4] == 10 && r[7] == 18 && r[10] == 30);

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:20,zh:'★ `cut_rod`：朴素递归（6 行直译），带调用计数。'},
           {line:33,zh:'`memo_aux`：备忘版 —— 查表命中就返回。'},
           {line:40,zh:'`bottom_up`：自底向上，按长度递增填表。'},
           {line:105,zh:'★ part 2：$n=10$ 时朴素递归调用 **1024** 次。'},
           {line:100,zh:'★★ part 3：备忘版同样答案只要 **56** 次 —— 重叠子问题被消除了。'}],
    tests:[{in:'CUT-ROD(4)',out:'10（2+2），16 次调用'},
           {in:'CUT-ROD(10)',out:'30，1024 次调用（2^9）'},
           {in:'MEMOIZED-CUT-ROD(10)',out:'30，56 次调用'},
           {in:'最优收益表 r[1..10]',out:'1,5,8,10,13,17,18,22,25,30（与原书 Figure 14.1 对应）'}]},
    mapping:[{pc:5,pcCode:'q = max {q, p[i] + CUT-ROD(p, n − i)}',c:'`q = imax(q, p[i] + cut_rod(n - i));`（第 20 行）'},
             {pc:6,pcCode:'q = max {q, p[i] + r[j − i]}',c:'`q = imax(q, p[i] + r[j - i]);`（第 55 行，自底向上版）'}]},
   {type:'analyze',title:'一本账：朴素 vs 备忘 vs 自底向上',claims:[
     {expr:'2^{n-1}',when:'切法的总数（暴力枚举的上界）',page:363,source:'book'},
     {expr:'2^n',when:'CUT-ROD 的调用次数（T(n) = 1 + Σ T(j)）',page:366,source:'book'},
     {expr:'\\Theta(n^2)',when:'备忘/自底向上的时间（子问题数 n × 每个 O(n)）',page:369,source:'book'},
    ],tables:[{caption:'三版对照（n = 10 实测）',rows:[
      ['版本','结论','调用/操作数'],
      ['CUT-ROD（朴素递归）','30','**1024** = 2^9'],
      ['MEMOIZED（备忘）','30','56'],
      ['BOTTOM-UP（自底向上）','30','~55（双层循环）'],
     ]}],chart:{xMax:32,series:[
     {name:'2^n',expr:'Math.pow(2, n / 2)',color:'--viz-violation'},
     {name:'n²',expr:'n * n / 4',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'为什么朴素递归是 2^n',steps:[
      {tex:'T(n) = 1 + \\sum_{j=0}^{n-1} T(j), \\quad T(0) = 1',zh:''},
      {tex:'T(n) = 2^n',zh:'★ 归纳可证。C 程序实测 $T(10) = 1024 = 2^{10}$ —— 与指数吻合。'}]},
     {kind:'summation',title:'为什么 DP 是 n²',steps:[
      {zh:'子问题只有 $n$ 个（长度 $0..n$），每个花 $O(n)$ 枚举第一刀。'},
      {tex:'n \\times O(n) = \\Theta(n^2)',zh:'★ 备忘把"重复计算"变成"查表"，代价从指数塌到多项式。'}]},
    ],note:''},
   {type:'prove',title:'最优子结构：第一刀切在哪',statement:'The second approach is to use dynamic programming, in which we arrange for each subproblem to be solved only once.',page:369,
    intro:'★ 正确性来自"最优解的结构"：第一刀之后的剩余部分必须是最优的。',steps:[
     {title:'最优子结构',en:'The rod-cutting problem is the following. Given a rod of length n inches and a table of prices √i for i = 1,2,…,n , determine the',page:363,
      body:['设最优方案第一刀把 $n$ 切成 $i$ 与 $n-i$。','**断言**：$n-i$ 那部分的收益必须是 $r_{n-i}$（它自己的最优值）—— 否则把更优方案替换进来会得到更好的总收益，矛盾。','故 $r_n = \\max_i(p_i + r_{n-i})$。∎']},
     {title:'重叠子问题 → 备忘有效',en:'The dynamic-programming method works as follows. Instead of solving the same subproblems repeatedly, as in the naive recursion solution, arrange for each subproblem to be solved only once.',page:366,
      body:['不同长度的子问题在递归树里被反复求解（$r_1$ 被算 2^{n-2} 次以上）。','**记住**每个 $r_j$ 后，总工作量 = 子问题数 × 每个的代价 = $\\Theta(n^2)$。★ C 程序 part 2/3 实测 1024 → 56。']},
    ],conclusion:'★ 结论：DP 的正确性靠**最优子结构**，效率靠**消除重叠子问题**。这两条也是 14.3 的正式议题。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'长为 n 的钢条共有多少种切法？',options:['$n$','$n^2$','$2^{n-1}$','$n!$'],answer:2,why:'★ 每个位置"切/不切"独立 → $2^{n-1}$（原书 p.363）。'},
     {kind:'single',q:'DP 相比朴素递归的关键改进是？',options:['更少的递归深度','每个子问题只解一次（备忘/查表）','更好的价格表','并行计算'],answer:1,why:'★ 原书 p.369："arrange for each subproblem to be solved only once"。'},
     {kind:'judge',q:'钢条切割的 DP 用额外内存换时间。',answer:true,why:'★ 原书明确称其为 time-memory trade-off。'},
     {kind:'simulate',q:'按原书价格表，长度 4 的钢条最优收益是多少？（填数字）',expect:[10],placeholder:'例如：9',
      why:'切成 2+2 = 5+5 = 10（不切只有 9）。C 程序 part 1 实测。'},
     {kind:'judge',q:'对 n = 10，朴素 CUT-ROD 的递归调用次数是 1024 次。',answer:true,why:'★ C 程序 part 2：调用 1024 次 = 2^9 量级（指数爆炸）。'},
     {kind:'single',q:'按原书价格表（p.364），长度 10 的钢条最优收益 r[10] 是多少？',options:['25','**30**','24','28'],answer:1,why:'★ 原书 Figure 14.1 / C 程序 part 6：r[10] = 30（整条不切最优）。'},
    ],bookExercises:[
     {id:'14.1-1',page:372,star:0,statement:'Show that equation (14.4) follows from equation (14.3) and the initial condition T(0) = 1.',hint:'$T(n)$ 是 CUT-ROD 被调用的次数，别去动那个 max —— 递推 (14.3) 里根本没有 max 可交换： $T(n) = 1 + \\sum_{j=0}^{n-1} T(j)$（最外层那一次调用本身记 1，剩下每种第一刀的位置递归一次）。 两式相减：$T(n) - T(n-1) = T(n-1)$，即 $T(n) = 2T(n-1)$，配 $T(0) = 1$ 得 $T(n) = 2^n$，就是 (14.4)。 这个 $2^n$ 正是「自顶向下不做备忘」的代价，也正是 14.1 里 DP 版要省掉的东西 —— $\\Theta(n^2)$ 个表项 vs $2^n$ 次调用。'},
     {id:'14.1-2',page:372,star:0,statement:'Show, by means of a counterexample, that the follow ing "greedy" strategy does not always determine an optimal way to cut rods. Define the density of a rod of length i to be √i =i , that is, its value per inch. The greedy strategy for a rod of length n cuts off a first piece of length i , where 1 ≤ i ≤ n, having maximum density. It then continues by applying the greedy strategy to the remaining piece of length n − i .',hint:'贪心策略（每刀都切"单位价格最高"的长度）会失败：例如 p = [1, 5, 8, 9] 时长度 4 贪心切成 1+3 = 1+8 = 9，而最优是 2+2 = 10。'},
     {id:'14.1-3',page:373,star:0,statement:'Consider a modification of the rod-cutting problem in which, in addition to a price √i for each rod, each cut incurs a fixed cost of c . The revenue associated with a solution is now the sum of the prices of the pieces minus the costs of making the cuts. Give a dynamic-programming algorithm to solve this modified problem.',hint:'加切割成本 $c$：递推改为 $r_n = \\max(p_n, \\max_i(p_i + r_{n-i} - c))$ —— 注意显式包含"不切"这一项。'},
     {id:'14.1-4',page:373,star:0,statement:'Modify CUT-ROD and MEMOIZED-CUT-ROD-AUX so that their for loops go up to only ⌊n/2⌋, rather than up to n. What other changes to the procedures do you need to make? How are their running times affected?',hint:'因为"切成 i 与 n−i"与"切成 n−i 与 i"对称 —— 只需枚举一半，答案不变（但要注意 $i = n/2$ 的中间情况）。'},
     {id:'14.1-5',page:373,star:0,statement:'Modify MEMOIZED-CUT-ROD to return not only the value but the actual solution.',hint:'加一个数组 $s[n]$ 记录"最优第一刀位置"，递归返回时顺带填写；或改用 EXTENDED-BOTTOM-UP-CUT-ROD + PRINT-CUT-ROD-SOLUTION（原书 p.372）。'},
     {id:'14.1-6',page:373,star:0,statement:'The Fibonacci numbers are defined by recurrence (3.31) on page 69. Give an O(n)-time dynamic-programming algorithm to compute the nth Fibonacci number. Draw the subproblem graph. How many vertices and edges does the graph contain?',hint:'$F_n$ 的朴素递归是 $O(\\phi^n)$；备忘/自底向上把它变成 $O(n)$ —— 与钢条切割完全同构的教学例子。'},
    ]},
  ],
};
