/* 第 14 章 14.3：动态规划的两大要素（Elements of dynamic programming）。印刷页 382–393（pdf 403–414）。 */
export default {
  key:'s03',id:'ch14/s03',chapter:14,section:'14.3',
  title:'DP 的两大要素：最优子结构与重叠子问题',shortTitle:'14.3 DP 的两大要素',
  titleEn:'Elements of dynamic programming',
  source:{printed:[382,393],pdf:[403,414]},
  prerequisites:[{label:'14.2 Matrix-chain multiplication',url:'#/ch14/s02'}],
  stages:[
   {type:'map',title:'什么时候才该用动态规划',
    why:'前两关你已经**用了**两次 DP，但还没有判据。本关给出两个必须同时成立的条件：**最优子结构**（问题的最优解由子问题的最优解构成）与**重叠子问题**（同一个子问题被反复求解）。',
    position:'14.1/14.2 是"怎么做"，14.3 是"凭什么能做"。它同时给出**反例**：无权重最长简单路径看起来也满足最优子结构，实际上不满足 —— 因为子问题**不独立**。',
    unlocks:[{label:'14.4 Longest common subsequence',url:'#/ch14/s04'}],
    mathKit:[
     {title:'最优子结构',body:'问题的最优解**包含**其子问题的最优解。'},
     {title:'重叠子问题',body:'递归过程会**反复**求解同一批子问题；备忘后真正求解的子问题只有多项式个。'},
     {title:'子问题图',body:'顶点 = 子问题，边 = 依赖。DP 沿**逆拓扑序**（自底向上）填表，即按子问题图的后序遍历。'},
    ]},
   {type:'intuition',title:'同一个子问题被算了多少遍',scene:'钢条切割 n = 10',body:[
     '朴素递归 `CUT-ROD(10)` 会把 `CUT-ROD(0)` 反复算上千次 —— 实测**总调用 1024 次**，而真正不同的子问题只有 $n+1 = 11$ 个。',
     '★ **重叠子问题**就在这里：子问题空间小（$\\Theta(n)$ 个），但递归树大（$2^n$ 个结点）。差别全在重复。',
     '★ 加一张备忘表后，同一问题只需 **56 次**调用 —— 剩下的 45 次是查表命中，常数级代价。',
     '★ 反过来，**MERGE-SORT** 的子问题互不重叠（排序 $n/2$ 的两个半区没有公共子问题），所以备忘对它**没有帮助** —— 这正是习题 14.3-2 要你解释的现象。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 √i 代表 $p_i$、"a s well" 是原书的断行伪影）。',blocks:[
     {kind:'body',page:382,en:'The first step in solving an optimization problem by dynamic programming is to characterize the structure of an optimal solution. Recall that a problem exhibits optimal substructure if an optimal solution to the problem contains within it optimal solutions to subproblems.',
      zh:'★★ **要素一：最优子结构** —— 最优解里装着子问题的最优解。'},
     {kind:'body',page:382,en:'In this section, we\u2019ll examine the two key ingredients that an optimization problem must have in order for dynamic programming to apply: optimal sub- structure and overlapping subproblems.',
      zh:'★★ 本关的纲领句：两个关键要素 —— 最优子结构 + 重叠子问题。'},
     {kind:'body',page:387,en:'The second ingredient that an optimization problem must have for dynamic programming to apply is that the space of subproblems must be "small" in the sense that a recursive algorithm for the problem solves t he same subproblems over and over, rather than always generating new subproblems.',
      zh:'★★ **要素二："小"的子问题空间** —— 递归会反复解同一批子问题（注意 "t he" 是原书的断词伪影）。'},
     {kind:'body',page:385,en:'You might be tempted to assume that the problem of finding an unweighted longest simple path exhibits optimal substructure a s well.',
      zh:'★ 引出反例：最长简单路径**看起来**也满足最优子结构。'},
     {kind:'body',page:386,en:'This example shows that for longest simple paths, not only does the problem lack optimal substructure, but you cannot necessarily assemble a "legal" solution to the problem from solutions to subproblems.',
      zh:'★★ 反例的结论：子问题的解拼不出一个**合法**的全局解。'},
     {kind:'body',page:386,en:'What do we mean by subproblems being independent? We mean that the solution to one subproblem does not affect the solution to another subproblem of the same problem.',
      zh:'★★ **子问题独立**的定义 —— 一个子问题的解不能影响另一个。'},
    ],terms:[{en:'optimal substructure',zh:'最优子结构',page:382},
              {en:'overlapping subproblems',zh:'重叠子问题',page:382},
              {en:'memoization',zh:'备忘（记忆化）',page:382}]},
   {type:'pseudocode',title:'RECURSIVE-MATRIX-CHAIN：朴素递归 10 行',algo:'RECURSIVE-MATRIX-CHAIN',signature:'RECURSIVE-MATRIX-CHAIN(p, i, j)',page:389,
    lines:[
     {n:1,code:'if i == j',zh:'长度 1 的链：不需要乘法。'},
     {n:2,code:'    return 0',zh:''},
     {n:3,code:'m[i,j] = ∞',zh:''},
     {n:4,code:'for k = i to j − 1',zh:'★ 枚举劈开点。'},
     {n:5,code:'    q = RECURSIVE-MATRIX-CHAIN(p, i, k)',zh:''},
     {n:6,code:'         + RECURSIVE-MATRIX-CHAIN(p, k + 1, j)',zh:'★ 同一批子问题被反复递归。'},
     {n:7,code:'         + p_{i−1} p_k p_j',zh:''},
     {n:8,code:'    if q < m[i,j]',zh:''},
     {n:9,code:'        m[i,j] = q',zh:''},
     {n:10,code:'return m[i,j]',zh:''}],
    vars:[{name:'p',meaning:'维数序列 $\\langle p_0,p_1,\\dots,p_n\\rangle$'},{name:'m[i,j]',meaning:'局部变量式的最优代价（**不是**表）'}],
    note:'★ 注意 `m[i,j]` 在这里只是**本次调用**的局部最优值 —— 所以下一次调用还得从头再算一遍。',
    more:[{algo:'MEMOIZED-MATRIX-CHAIN',subtitle:'MEMOIZED-MATRIX-CHAIN(p, n) —— 5 行建表 + 一次查表（p.391）',signature:'MEMOIZED-MATRIX-CHAIN(p, n)',page:391,
      lines:[{n:1,code:'let m[1 : n, 1 : n] be a new table',zh:'★ 全局的备忘表。'},
        {n:2,code:'for i = 1 to n',zh:''},{n:3,code:'    for j = i to n',zh:''},
        {n:4,code:'        m[i,j] = ∞',zh:'★★ 用 $\\infty$ 表示"还没算过"（这是查表命中的判据）。'},
        {n:5,code:'return LOOKUP-CHAIN(m, p, 1, n)',zh:''}],
      vars:[{name:'m',meaning:'备忘表'}],note:''},
      {algo:'LOOKUP-CHAIN',subtitle:'LOOKUP-CHAIN(m, p, i, j) —— 9 行递归 + 查表（p.391）',signature:'LOOKUP-CHAIN(m, p, i, j)',page:391,
      lines:[{n:1,code:'if m[i,j] < ∞',zh:'★ 命中备忘直接返回。'},{n:2,code:'    return m[i,j]',zh:''},
        {n:3,code:'if i == j',zh:''},{n:4,code:'    m[i,j] = 0',zh:''},
        {n:5,code:'else for k = i to j − 1',zh:''},
        {n:6,code:'         q = LOOKUP-CHAIN(m, p, i, k) + LOOKUP-CHAIN(m, p, k + 1, j) + p_{i−1} p_k p_j',zh:''},
        {n:7,code:'         if q < m[i,j]',zh:''},{n:8,code:'             m[i,j] = q',zh:''},
        {n:9,code:'return m[i,j]',zh:'★ 每个 $(i,j)$ 只会真正计算一次。'}],
      vars:[{name:'m',meaning:'备忘表'}],note:'★ 与 RECURSIVE-MATRIX-CHAIN 逐行同构 —— 只多了第 1–2 行的查表。'}]},
   {type:'visualize',title:'调用次数：指数与多项式的距离',panels:[
     {title:'朴素递归的调用次数 $2^n$（C 程序实测）',viz:'growth',
      chart:{xMax:16,series:[
       {name:'朴素递归 ≈ 2^n',expr:'Math.pow(2, n) / 64',color:'--viz-violation'},
       {name:'备忘 ≈ n²/2',expr:'n * n / 2',color:'--viz-done'}]},
      note:'★ n = 10 时是 1024 : 56；n = 14 时是 16384 : 105 —— 差距随 n 指数拉开。',
      },
    ],tasks:['对照 C 程序 part 1–part 2 的实测数字。'],note:''},
   {type:'code',title:'实测：1024 次 vs 56 次',c:{file:'dp_elements.c',code:String.raw`/* dp_elements.c -- 14.3: DP 的两大要素（最优子结构 + 重叠子问题）。
 * 实验：同一问题用「朴素递归」与「带备忘」两种写法，对比实际调用次数。
 * 关键数字：钢条切割 n=10 时朴素 1024 次 vs 备忘 56 次（同一答案 30）。
 * 矩阵链 n=4 时 RECURSIVE-MATRIX-CHAIN 27 次 vs MEMOIZED 21 次。 */
#include <assert.h>
#include <stdio.h>

#define NMAX 24
#define INF 1000000000

static long calls;                 /* 调用计数器 */

/* ---------- 14.1 的钢条切割：朴素递归 ---------- */
static int price[NMAX + 1] = {0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30};

static int cut_rod_naive(const int *p, int n)
{
    calls++;                                   /* 行 1–2 之外的调用计一次 */
    if (n == 0) { return 0; }                  /* 行 2–3 */
    int q = -INF;
    for (int i = 1; i <= n; i++) {             /* 行 4–5 */
        int t = p[i] + cut_rod_naive(p, n - i); /* 行 6 */
        if (t > q) { q = t; }                  /* 行 7 */
    }
    return q;                                  /* 行 8 */
}

/* ---------- 14.1 的钢条切割：自上而下 + 备忘 ---------- */
static int memo[NMAX + 1];

static int cut_rod_memo_aux(const int *p, int n)
{
    calls++;
    if (memo[n] >= 0) { return memo[n]; }
    int q = (n == 0) ? 0 : -INF;
    for (int i = 1; i <= n; i++) {
        int t = p[i] + cut_rod_memo_aux(p, n - i);
        if (t > q) { q = t; }
    }
    memo[n] = q;
    return q;
}

static int cut_rod_memo(const int *p, int n)
{
    for (int i = 0; i <= n; i++) { memo[i] = -1; }
    return cut_rod_memo_aux(p, n);
}

/* ---------- 14.3 的矩阵链：RECURSIVE / MEMOIZED-MATRIX-CHAIN ---------- */
static int mc_m[NMAX][NMAX];

static int recursive_matrix_chain(const int *p, int i, int j)
{
    calls++;
    if (i == j) { return 0; }                  /* 行 2–3：长度 1 的链 */
    int q = INF;
    for (int k = i; k < j; k++) {              /* 行 5–6 */
        int t = recursive_matrix_chain(p, i, k)
              + recursive_matrix_chain(p, k + 1, j)
              + p[i - 1] * p[k] * p[j];
        if (t < q) { q = t; }
    }
    return q;
}

static int lookup_chain(const int *p, int i, int j)
{
    calls++;
    if (mc_m[i][j] < INF) { return mc_m[i][j]; }
    if (i == j) { mc_m[i][j] = 0; }
    else {
        int q = INF;
        for (int k = i; k < j; k++) {
            int t = lookup_chain(p, i, k) + lookup_chain(p, k + 1, j)
                  + p[i - 1] * p[k] * p[j];
            if (t < q) { q = t; }
        }
        mc_m[i][j] = q;
    }
    return mc_m[i][j];
}

static int memoized_matrix_chain(const int *p, int n)
{
    for (int i = 1; i <= n; i++) {
        for (int j = i; j <= n; j++) { mc_m[i][j] = INF; }
    }
    return lookup_chain(p, 1, n);
}

/* ---------- 14.3 的反例：无权重最长简单路径（Figure 14.6 的有向 4 圈）---------- */
/* 顶点 0=q, 1=r, 2=s, 3=t；边 q->s->t->r->q */
static const int lsp_adj[4][1] = {{2}, {0}, {3}, {1}};
static int lsp_best;

static void lsp_dfs(int u, int goal, int visited[4], int depth)
{
    if (u == goal) {                      /* 抵达终点即停：再加点就重复 goal 了 */
        if (depth > lsp_best) { lsp_best = depth; }
        return;
    }
    for (int e = 0; e < 1; e++) {         /* 每点出度 1 */
        int w = lsp_adj[u][e];
        if (!visited[w]) {
            visited[w] = 1;
            lsp_dfs(w, goal, visited, depth + 1);
            visited[w] = 0;
        }
    }
}

static int longest_simple_path(int u, int goal)
{
    int visited[4] = {0, 0, 0, 0};
    visited[u] = 1;
    lsp_best = -1;
    lsp_dfs(u, goal, visited, 0);
    return lsp_best;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* part 1：重叠子问题的代价 —— 钢条切割 n=10 */
    calls = 0;
    int a = cut_rod_naive(price, 10);
    long naive10 = calls;
    calls = 0;
    int b = cut_rod_memo(price, 10);
    long memo10 = calls;
    printf("part 1: CUT-ROD(10) 朴素递归 %ld 次调用；MEMOIZED %ld 次调用；答案同为 %d\n",
           naive10, memo10, a);
    assert(a == b && a == 30);
    assert(naive10 == 1024);   /* 2^10 */
    assert(memo10 == 56);      /* 1 + 10 + 45 */

    /* part 2：指数 vs 线性 —— 调用次数增长的实测 */
    printf("part 2: 朴素递归调用次数 c(n) = 2^n：\n");
    for (int n = 4; n <= 14; n += 5) {
        calls = 0;
        (void)cut_rod_naive(price, n);
        long c = calls;
        long pow2 = 1;
        for (int k = 0; k < n; k++) { pow2 *= 2; }
        printf("        n=%2d -> %6ld 次（2^%d = %ld）\n", n, c, n, pow2);
        assert(c == pow2);
    }
    printf("        n=14 时已是 16384 次；n=30 需要约 10 亿次 —— 这就是「重叠子问题」的代价。\n");

    /* part 3：子问题图的规模 —— 备忘后真正被算的子问题只有 n+1 个 */
    {
        int distinct = 0;
        for (int i = 0; i <= 10; i++) { if (memo[i] >= 0 || i == 0) { distinct++; } }
        printf("part 3: 备忘后真正求解的子问题只有 n+1 = %d 个（其余 %ld 次全是查表命中）\n",
               distinct, memo10 - (long)distinct);
        assert(distinct == 11);
    }

    /* part 4：矩阵链 —— 同一个递归式，加不加备忘差多少 */
    {
        int p6[7] = {30, 35, 15, 5, 10, 20, 25};
        int p4[5] = {30, 35, 15, 5, 10};
        calls = 0;
        int r4 = recursive_matrix_chain(p4, 1, 4);
        long rc4 = calls;
        calls = 0;
        int m4 = memoized_matrix_chain(p4, 4);
        long mc4 = calls;
        printf("part 4: n=4 时 RECURSIVE-MATRIX-CHAIN %ld 次调用 vs MEMOIZED %ld 次；答案同为 %d\n",
               rc4, mc4, r4);
        assert(r4 == m4);
        assert(rc4 == 27);
        printf("part 4: 而 n=6（原书 p.375 的链）备忘录版本仍然只算 n(n+1)/2 = 21 个子问题\n");
        calls = 0;
        int m6 = memoized_matrix_chain(p6, 6);
        printf("        MEMOIZED-MATRIX-CHAIN(6) = %ld 次调用，代价 %d\n", calls, m6);
        assert(m6 == 15125);
    }

    /* part 5：最优子结构的反例 —— 无权重最长简单路径（原书 Figure 14.6） */
    printf("part 5: 无权重最长简单路径不满足最优子结构（Figure 14.6 的有向 4 圈）：\n");
    {
        printf("        边集 q->s->t->r->q（4 个顶点、4 条边）\n");
        int qt = longest_simple_path(0, 3);
        int qr = longest_simple_path(0, 1);
        int rt = longest_simple_path(1, 3);
        printf("        q->t 的最长简单路径 = %d 条边；q->r = %d 条边；r->t = %d 条边\n", qt, qr, rt);
        printf("        两个子问题的「最优解」拼起来需要 %d 条边，而 4 个顶点上任何简单\n",
               qr + rt);
        printf("        路径最多 3 条边 —— 拼接得到的 q-s-t-r-q-s-t 重复了顶点，非法。\n");
        assert(qt == 2 && qr == 3 && rt == 3);
        printf("        结论：两个子问题不独立（一条路径用掉的顶点会毁掉另一条）——DP 不适用。\n");
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 文件开头写明两个实验的关键数字。'},
           {line:16,zh:'`cut_rod_naive`：递归树有 $2^n$ 个结点 —— 这是 14.1 的写法。'},
           {line:31,zh:'`cut_rod_memo_aux`：只多一张备忘表，调用次数从 $2^n$ 降到 $\\Theta(n^2)$。'},
           {line:53,zh:'`recursive_matrix_chain`：14.3 的朴素递归版。'},
           {line:67,zh:'`lookup_chain`：第 1 行查表、第 2 行返回 —— 对应 LOOKUP-CHAIN。'},
           {line:133,zh:'★★ part 1：CUT-ROD(10) 朴素 1024 次 vs 备忘 56 次，答案同为 30。'},
           {line:171,zh:'★ part 4：n = 4 时 27 次 vs 21 次；n = 6 的备忘录版本代价仍是 15125。'},
           {line:183,zh:'★★ part 5：最长简单路径反例 —— $q \\to r$ 与 $r \\to t$ 各自 3 条边，拼起来要 6 条边，而 4 个顶点上最多 3 条边。'}]},
    tests:[{in:'钢条切割 n = 10',out:'朴素 1024 次 / 备忘 56 次，答案 30'},
           {in:'矩阵链 n = 4',out:'朴素 27 次 / 备忘 21 次'},
           {in:'最长简单路径（Figure 14.6）',out:'$q\\to t$ = 2 条边，但两个子问题各要 3 条边'}],
    mapping:[{pc:1,pcCode:'if i == j',c:'`if (i == j) { return 0; }`（第 56 行）'},
             {pc:6,pcCode:'q = LOOKUP-CHAIN(m, p, i, k) + …',c:'`int t = lookup_chain(p, i, k) + lookup_chain(p, k + 1, j)`（第 75 行）'}]},
   {type:'analyze',title:'一本账：两大要素各自的代价',claims:[
     {expr:'2^n',when:'朴素递归的调用次数（钢条切割 $n = 10$ 时 1024 次）',page:386,source:'book'},
     {expr:'\\Theta(n^2)',when:'备忘后真正求解的矩阵链子问题数（$n(n+1)/2$）',page:392,source:'book'},
     {expr:'\\Theta(n^3)',when:'MEMOIZED-MATRIX-CHAIN 的总时间（与自底向上同阶）',page:392,source:'book'},
    ],tables:[{caption:'朴素递归 / 备忘 / 自底向上 三者对照',rows:[
      ['','朴素递归','备忘（自上而下）','自底向上'],
      ['方向','—','从大问题往下','从小问题往上'],
      ['是否查表','否','是','不需要（顺序保证就绪）'],
      ['钢条切割 n=10','1024 次调用','56 次调用','$\\Theta(n^2)$'],
      ['矩阵链 n=6','27 次调用（n=4）','71 次调用','$\\Theta(n^3)$'],
      ['适用条件','—','子问题重叠','子问题重叠 + 有天然的规模序'],
     ]}],chart:{xMax:16,series:[
     {name:'真正不同的子问题数 n(n+1)/2',expr:'n * (n + 1) / 2',color:'--viz-done'},
     {name:'朴素递归的调用次数',expr:'Math.pow(2, n) / 64',color:'--viz-violation'}]},
    derivations:[{kind:'summation',title:'为什么备忘后是 Θ(n²)',steps:[
      {zh:'矩阵链的子问题是区间 $(i,j)$，共 $n(n+1)/2$ 个。'},
      {zh:'每个子问题被**真正计算**一次，代价 $O(n)$（枚举劈开点）。'},
      {tex:'\\Theta(n^2) \\text{ 个子问题} \\Rightarrow \\Theta(n^3) \\text{ 时间}',zh:'★ C 程序实测：$n = 4$ 时备忘版 21 次调用 = 恰好 $n(n+1)/2 = 10$ 个子问题的常数倍。'}]},
     ],
    note:''},
   {type:'prove',title:'为什么最长简单路径不能用 DP',statement:'What do we mean by subproblems being independent? We mean that the solution to one subproblem does not affect the solution to another subproblem of the same problem.',page:386,
    intro:'★ 本关的正确性论证分两半：**正面**说明 LCS/矩阵链为什么满足要素，**反面**说明最长简单路径为什么不满足。',
    steps:[
     {title:'要素一：最优子结构的提炼（正面）',en:'The first step in solving an optimization problem by dynamic programming is to characterize the structure of an optimal solution.',page:382,
      body:['书中给的**四步套路**（p.383）：① 刻画解的结构（做出选择）；② 递归定义最优解的值；③ 自底向上算最优值；④ 由算出的信息重建最优解。',
        '**断言**：矩阵链的最优括号化里，左段 $A_i\\cdots A_k$ 与右段 $A_{k+1}\\cdots A_j$ 必定各自最优 —— 否则把较差的一段替换掉会得到更小的总价，与"最优"矛盾。',
        '这一步的**关键前提**是「子问题独立」：左段用什么括号，不影响右段能省多少。∎']},
     {title:'要素二：重叠子问题（正面）',en:'The second ingredient that an optimization problem must have for dynamic programming to apply is that the space of subproblems must be "small" in the sense that a recursive algorithm for the problem solves t he same subproblems over and over, rather than always generating new subproblems.',page:387,
      body:['矩阵链的朴素递归把同一个 $m[i,j]$ 算了一遍又一遍 —— C 程序 part 4 实测 $n = 4$ 时 27 次调用只为 10 个子问题。',
        '**备忘（memoization）**：把算好的值存进表，下次先查表。每个子问题只算一次 → $\\Theta(n^3)$（与自底向上同阶）。',
        '★ 反例：MERGE-SORT 的两个半区**没有**公共子问题，备忘无从命中（习题 14.3-2）。']},
     {title:'反面：子问题不独立（最长简单路径）',en:'This example shows that for longest simple paths, not only does the problem lack optimal substructure, but you cannot necessarily assemble a "legal" solution to the problem from solutions to subproblems.',page:386,
      body:['图（Figure 14.6）：$q \\to s \\to t \\to r \\to q$ 的有向 4 圈。',
        '从 $q$ 到 $t$ 的最长简单路径是 $q \\to s \\to t$（2 条边）。若按"最优子结构"拆成 $q \\to r$ 与 $r \\to t$ 两个子问题：前者最优解是 $q\\to s\\to t\\to r$（3 条边），后者最优解是 $r\\to q\\to s\\to t$（3 条边）。',
        '★ 拼起来得到 $q\\to s\\to t\\to r\\to q\\to s\\to t$ —— **重复了顶点，不是简单路径**。C 程序 part 5 把这三个数字都算出来了：2、3、3。',
        '**根因**：一条路径用掉了顶点，另一条就不能再用了 —— 子问题**互相影响**，不独立。最短路径则相反（两个子问题共享的最多只有一个顶点，可以安全拼接）。∎']},
    ],conclusion:'★ 结论：判据是「最优子结构 **且** 子问题独立 **且** 子问题重叠」。缺任何一个都要重新考虑解法。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'动态规划成立的**两个**要素是？',options:['最优子结构 + 分治','最优子结构 + 重叠子问题','贪心选择 + 无后效性','多项式时间 + 线性空间'],answer:1,
      why:'★ 原书 p.382 的纲领：optimal substructure + overlapping subproblems。'},
     {kind:'single',q:'为什么备忘能让矩阵链的朴素递归从指数降到多项式？',options:['因为递归树变浅了','因为每个子问题只被**真正计算**一次','因为减少了枚举的劈开点数','因为用了更小的数据类型'],answer:1,
      why:'★ 备忘把"重复计算"变成"查表"：$\\Theta(n^2)$ 个子问题各算一次。'},
     {kind:'judge',q:'备忘（memoization）能加速 MERGE-SORT。',answer:false,
      why:'★ MERGE-SORT 的子问题互不重叠，没有可命中的表项 —— 习题 14.3-2 的答案。'},
     {kind:'judge',q:'无权重最长简单路径满足最优子结构。',answer:false,
      why:'★ Figure 14.6 的反例：两个子问题不独立，拼不出合法解。'},
     {kind:'simulate',q:'钢条切割 $n = 10$ 时，朴素递归的调用次数是多少？（填数字）',expect:[1024],placeholder:'例如：500',
      why:'$c(n) = 2^n$，$2^{10} = 1024$。C 程序 part 1 实测吻合。'},
     {kind:'simulate',q:'同一问题加备忘后只需多少次调用？（填数字）',expect:[56],placeholder:'例如：100',
      why:'$1 + 10 + 45 = 56$：根一次、根发起 10 次、其余 45 次为查表命中。'},
    ],bookExercises:[
     {id:'14.3-1',page:392,star:0,statement:'Which is a more efficient way to determine the optimal number of multiplications in a matrix-chain multiplication problem: enumerating all the ways of parenthesiz- ing the product and computing the number of multiplications for each, or running RECURSIVE-MATRIX-CHAIN? Justify your answer.',hint:'比较的两个对象要认对：题干问的是**枚举所有括号化**与 **RECURSIVE-MATRIX-CHAIN** （p.389 那个自顶向下、不做备忘的递归），不是自底向上的 MATRIX-CHAIN-ORDER。 两个都是指数级，但差一个底数： 枚举要处理 Catalan 数 $C_{n-1} = \\Omega(4^n / n^{3/2})$ 种括号化，每种还要花 $\\Theta(n)$ 算乘法数； 而递归版满足式 (14.8) $T(n) \\ge 2\\sum_{i=1}^{n-1} T(i) + (n-1)$， 把它与 $T(n-1)$ 相减得 $T(n) \\ge 3T(n-1) - (n-1)$，解出 $T(n) = \\Omega(3^n)$、上界也是 $O(3^n)$。 $3^n$ 对 $4^n / n^{3/2}$：**递归版渐近更快**，因为它把重复出现的子问题各自算的代价合并到同一棵递归树里， 而枚举对每个括号化都从头算一遍。 论证时把两个和式都写出来比，别只说「都是指数所以差不多」。'},
     {id:'14.3-2',page:393,star:0,statement:'Draw the recursion tree for the MERGE-SORT procedure from Section 2.3.1 on an array of 16 elements. Explain why memoization fails to speed up a good divide- and-conquer algorithm such as MERGE-SORT.',hint:'画出 $n = 16$ 的递归树：16 → 8/8 → 4/4/4/4 → … 每一层的**区间都不相同**，所以查表永远不会命中 —— 备忘不能省掉任何一次子问题求解。'},
     {id:'14.3-3',page:393,star:0,statement:'Consider the antithetical variant of the matrix-chain multiplication problem where the goal is to parenthesize the sequence of matrices so as to maximize, rather than minimize, the number of scalar multiplications. Does this problem exhibit optimal substructure?',hint:'把 $\\min$ 换成 $\\max$：递推式结构不变，最优子结构照旧成立（把"替换成更优″"把"更差″），所以同样可以 $\\Theta(n^3)$ 求解。'},
     {id:'14.3-4',page:393,star:0,statement:'As stated, in dynamic programming, you first solve the subproblems and then choose which of them to use in an optimal solution to the problem. Professor Capulet claims that she does not always need to solve all the subproblems in or- der to find an optimal solution. She suggests that she can find an optimal solution to the matrix-chain multiplication problem by always choosing the matrix A k at which to split the subproduct A i A i + 1 • • • A j (by selecting k to minimize the quan- tity √i −1 √k √j ) before solving the subproblems. Find an instance of the matrix- chain multiplication problem for which this greedy approach yields a suboptimal solution.',hint:'教授的主张是"边走边挑子问题"（自顶向下只算子问题图里可达的部分）。这在**需要哪些子问题无法预先判定**时确实可行（备忘递归就是这样做的），但必须先定义"挑"的规则；否则无法保证正确性。'},
     {id:'14.3-5',page:393,star:0,statement:'Suppose that the rod-cutting problem of Section 14.1 also had a limit l i on the number of pieces of length i allowed to be produced, for i = 1,2,…,n . Show that the optimal-substructure property described in Section 14.1 no longer holds.',hint:'反例构造思路：最优解里长度为 $i$ 的段数已经达到上限 $l_i$，于是"把最优解的一段拿出来单独最优切割"这一步失效 —— 修改后的最优子结构要写成带**剩余配额**的状态。'},
    ]},
  ],
};
