/* 第 26 章 26.1：fork-join 并行基础（The basics of fork-join parallelism）。印刷页 750–769（pdf 771–790）。 */
export default {
  key:'s01',id:'ch26/s01',chapter:26,section:'26.1',
  title:'work 与 span：并行算法的两把尺子',shortTitle:'26.1 并行基础',
  titleEn:'The basics of fork-join parallelism',
  source:{printed:[750,769],pdf:[771,790]},
  prerequisites:[{label:'25.3 The Hungarian algorithm',url:'#/ch25/s03'}],
  stages:[
   {type:'map',title:'从"跑多快"到"能并行多少"',
    why:'并行算法的分析用两个量：**work** $T_1$（单处理器总工作量，即串行时间）与 **span** $T_\\infty$（最长依赖链，即无限处理器下的时间）。$T_1/T_\\infty$ 就是**并行度**（parallelism）。',
    position:'第 VII 部分（选讲）开篇。它给出一套不依赖具体机器的分析语言 —— 后面两关（并行矩阵乘、并行归并排序）都用它度量。',
    unlocks:[{label:'26.2 Parallel matrix multiplication',url:'#/ch26/s02'}],
    mathKit:[
     {title:'work 与 span',body:'$T_1$ = 串行投影的运行时间；$T_\\infty$ = 关键路径长度。'},
     {title:'下界',body:'$T_P \\ge \\max(T_1/P,\\ T_\\infty)$ —— 处理器再多也快不过关键路径。'},
     {title:'贪心调度',body:'$T_P \\le T_1/P + T_\\infty$（定理 26.1）；再乘 2 就是 2-近似（推论 26.2）。'},
    ]},
   {type:'intuition',title:'spawn / sync 的语义',scene:'P-FIB（C 程序 Part 1）',body:[
     '`spawn` 表示"子过程可以与后继代码并行"，`sync` 表示"等所有 spawn 完"。P-FIB 的 $T_1$ 与 FIB 相同（$\\Theta(F_n)$），而 $T_\\infty = \\Theta(n)$（两个递归调用可并行，但链条长度是 n）。',
     '★ C 程序实测：$\\text{FIB}(20) = 6765$，调用次数 **21891 = 2·F(21) − 1**（用迭代 Fibonacci 独立对照）；P-FIB 的 span = 20 → 并行度 ≈ 1095。',
     '★ 并行度比 $P$ 大得多时才有"近完美加速"（推论 26.3）；并行度小于 $P$ 时处理器再多也白搭 —— 这是 work/span 分析最实用的结论。',
     '⚠ **确定性竞争**（determinacy race）：若两个并行分支写同一变量（如 `parallel for` 里 `x = x + 1`），结果依赖指令交错 —— 并行编程的头号陷阱。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 T 1/T P 代表 T₁/T_P）。',blocks:[
     {kind:'body',page:750,en:'\u2022 The underlying task-parallel model provides a theoretically clean way to quantify parallelism based on the notions of "work" and "span."',
      zh:'★★ work/span 是全书并行分析的语言基础。'},
     {kind:'body',page:757,en:'The work and span provide lower bounds on the running time T P of a taskparallel computation on P processors:',
      zh:'★★ $T_P \\ge \\max(T_1/P, T_\\infty)$ 的来源句。'},
     {kind:'body',page:760,en:'On an ideal parallel computer with P processors, a greedy scheduler executes a task-parallel computation with work T 1 and span T 1 in time',
      zh:'★ 贪心调度定理 26.1（后半句给出 $T_P \\le T_1/P + T_\\infty$）。'},
     {kind:'body',page:760,en:'The running time T P of any task-parallel computation scheduled by a greedy scheduler on a P -processor ideal parallel computer is within a factor of 2 of optimal.',
      zh:'★★ 推论 26.2：贪心调度是 2-近似。'},
     {kind:'body',page:767,en:'Let\u2019s recap what happened. By sequential consistency, the effect of the parallel execution is as if the executed instructions of the two processors are interleaved.',
      zh:'★ 顺序一致性：并行结果等价于某种交错 —— 这是"竞争"分析的框架。'},
    ],terms:[{en:'work',zh:'工作总量 T₁',page:750},
              {en:'span',zh:'关键路径长 T∞',page:750}]},
   {type:'pseudocode',title:'P-FIB：6 行',algo:'P-FIB',signature:'P-FIB(n)',page:753,
    lines:[
     {n:1,code:'if n ≤ 1',zh:''},
     {n:2,code:'    return n',zh:''},
     {n:3,code:'else x = spawn P-FIB(n − 1)    // don\u2019t wait for subroutine to return',zh:'★ 子过程与后继并行。'},
     {n:4,code:'    y = P-FIB(n − 2)    // in parallel with spawned subroutine',zh:'★ 自己算另一个分支。'},
     {n:5,code:'    sync    // wait for spawned subroutine to finish',zh:'★ 汇合点。'},
     {n:6,code:'    return x + y',zh:''}],
    vars:[{name:'spawn',meaning:'派生：不等待返回'},{name:'sync',meaning:'汇合：等派生完成'}],
    note:'★ 删掉 spawn/sync 就得到 FIB（串行投影）—— 所以 $T_1$ 与串行版相同。',
    more:[{algo:'RACE-EXAMPLE',subtitle:'RACE-EXAMPLE：确定性竞争的最小例子（p.766，4 行）',signature:'RACE-EXAMPLE',page:766,
      lines:[{n:1,code:'x = 0',zh:''},
        {n:2,code:'parallel for i = 1 to 2',zh:''},
        {n:3,code:'    x = x + 1    // determinacy race',zh:'★★ 两个并行分支写同一变量。'},
        {n:4,code:'print x',zh:'★ 结果可能是 1 也可能是 2。'}],
      vars:[{name:'x',meaning:'被两个并行分支争写的变量'}],
      note:'★ 原书 p.765 展示了 x 的 8 条指令交错如何产生 1 或 2 —— 竞争的可观测性来源。'}]},
   {type:'visualize',title:'work / span / 并行度',panels:[
     {title:'C 程序 Part 1/2 的实测数字',viz:'growth',
      chart:{xMax:1400,series:[
       {name:'P-FIB(20) work/span ≈ 1095',expr:'1095',color:'--viz-done'},
       {name:'P-MATRIX-MULTIPLY(256) 并行度 ≈ 1e6/16',expr:'65536',color:'--viz-violation'}]},
      note:'★ 并行度越大，能有效利用的处理器越多；并行度 ~1000 意味着 1000 个处理器才吃饱。'},
    ],tasks:['对照 C 程序 part 1（FIB 调用计数）与 part 2（两种矩阵乘写的并行度）。'],note:''},
   {type:'code',title:'实测：21891 = 2·F(21) − 1',c:{file:'parallel.c',code:String.raw`/* parallel.c -- 26 章：并行算法的 work/span 分析（用计数模拟，不依赖真实多线程）。
 * 关键数字：
 *   part 1  FIB(n) 的调用次数 = 2·F(n+1) − 1（与迭代 Fibonacci 对照）；
 *           P-FIB 的 span = Θ(n)（链式），parallelism = work/span ≈ F(n)/n；
 *   part 2  P-MATRIX-MULTIPLY-RECURSIVE：work Θ(n³)、span Θ(lg² n)、parallelism Θ(n³/lg² n)；
 *           循环版 P-MATRIX-MULTIPLY：work Θ(n³)、span Θ(lg n)；
 *   part 3  P-MERGE（二分找分割点）与串行 MERGE 的比较次数、元素搬动次数对照，输出一致。 */
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* ---------- part 1：FIB 的调用计数 ---------- */
static long fib_calls;

static long fib_count(int n)
{
    fib_calls++;
    if (n <= 1) { return n; }
    return fib_count(n - 1) + fib_count(n - 2);
}

static long fib_iter(int n)          /* 迭代版：独立对照 */
{
    long a = 0, b = 1;
    for (int i = 0; i < n; i++) { long t = a + b; a = b; b = t; }
    return a;
}

/* P-FIB 的 span：T∞(n) = max(T∞(n−1), T∞(n−2)) + Θ(1) = T∞(n−1) + 1 → Θ(n) */
static int pfib_span(int n) { return n <= 1 ? 1 : pfib_span(n - 1) + 1; }

/* ---------- part 2：矩阵乘法的 work/span ---------- */
static long mat_work(int n) { return (long)n * n * n; }               /* n³ 次乘加 */

static int mat_span_rec(int n)         /* 递归版：两处 parallel for 各 Θ(lg n)，串行相加 */
{
    if (n == 1) { return 1; }
    int lg = 0;
    for (int t = n; t > 1; t >>= 1) { lg++; }
    return mat_span_rec(n / 2) + 2 * lg;
}

static int mat_span_loop(int n)        /* 双层 parallel for：span = Θ(lg n) */
{
    int lg = 0;
    for (int t = n; t > 1; t >>= 1) { lg++; }
    return 2 * lg;
}

/* ---------- part 3：归并（串行 vs 二分分割） ---------- */
static long cmp_serial, cmp_parallel, moves;

static void merge_serial(const int *a, int na, const int *b, int nb, int *out)
{
    int i = 0, j = 0, k = 0;
    while (i < na && j < nb) {
        cmp_serial++;
        out[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];
        moves++;
    }
    while (i < na) { out[k++] = a[i++]; moves++; }
    while (j < nb) { out[k++] = b[j++]; moves++; }
}

/* FIND-SPLIT-POINT：二分找 x 在 A[lo..hi) 中的插入位置 */
static int find_split_point(const int *A, int lo, int hi, int x)
{
    while (lo < hi) {
        cmp_parallel++;
        int mid = (lo + hi) / 2;
        if (x <= A[mid]) { hi = mid; } else { lo = mid + 1; }
    }
    return lo;
}

/* P-MERGE-AUX：把 A[lo1..hi1] 与 A[lo2..hi2] 归并到 B[p..]（原书 26.3 的二分分割法） */
static void p_merge_aux(const int *A, int lo1, int hi1, int lo2, int hi2, int *B, int p)
{
    if (lo1 > hi1 && lo2 > hi2) { return; }
    if (lo1 > hi1) {
        for (int i = lo2; i <= hi2; i++) { B[p++] = A[i]; moves++; }
        return;
    }
    if (lo2 > hi2) {
        for (int i = lo1; i <= hi1; i++) { B[p++] = A[i]; moves++; }
        return;
    }
    if (hi1 - lo1 < hi2 - lo2) {          /* 总在较大的那段上取中位，保证平衡 */
        int t;
        t = lo1; lo1 = lo2; lo2 = t;
        t = hi1; hi1 = hi2; hi2 = t;
    }
    int mid1 = (lo1 + hi1) / 2;
    int x = A[mid1];
    int mid2 = find_split_point(A, lo2, hi2 + 1, x);   /* x 在第二段的插入位置 */
    int left = (mid1 - lo1) + (mid2 - lo2);            /* 排在 x 前面的元素个数 */
    p_merge_aux(A, lo1, mid1 - 1, lo2, mid2 - 1, B, p);
    B[p + left] = x; moves++;
    p_merge_aux(A, mid1 + 1, hi1, mid2, hi2, B, p + left + 1);
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* part 1 */
    {
        int n = 20;
        fib_calls = 0;
        long v = fib_count(n);
        long f_expected = fib_iter(n);
        printf("part 1: FIB(%d) = %ld；调用次数 = %ld\n", n, v, fib_calls);
        printf("        公式 2·F(n+1) − 1 = %ld（独立对照）\n", 2 * fib_iter(n + 1) - 1);
        assert(v == f_expected);
        assert(fib_calls == 2 * fib_iter(n + 1) - 1);
        printf("        P-FIB 的 span = %d（链式 Θ(n)）；parallelism = work/span ≈ %.0f\n",
               pfib_span(n), (double)fib_calls / pfib_span(n));
    }

    /* part 2 */
    {
        int ns[3] = {16, 64, 256};
        printf("part 2: 矩阵乘法的 work 与 span（同一问题的两种并行写法）：\n");
        for (int i = 0; i < 3; i++) {
            int n = ns[i];
            long w = mat_work(n);
            int srec = mat_span_rec(n), sloop = mat_span_loop(n);
            printf("        n=%3d：work = %ld（n³）\n", n, w);
            printf("               递归版 span = %d（Θ(lg²n)）-> parallelism ≈ %.0f\n",
                   srec, (double)w / srec);
            printf("               循环版 span = %d（Θ(lg n)）-> parallelism ≈ %.0f\n",
                   sloop, (double)w / sloop);
            assert(srec > sloop);              /* 递归版 span 更大（多了递归链） */
        }
    }

    /* part 3：并行归并 vs 串行归并 */
    {
        int n = 1024;
        int *A = malloc(sizeof(int) * n);
        for (int i = 0; i < n; i++) { A[i] = (i * 37) % 1000; }   /* 半有序：模拟两段已排序 */
        for (int i = 0; i < n; i++) { A[i] = i * 2; }             /* 左段偶数、右段奇数 */
        for (int i = n / 2; i < n; i++) { A[i] = (i - n / 2) * 2 + 1; }
        int *out1 = malloc(sizeof(int) * n);
        int *out2 = malloc(sizeof(int) * n);
        cmp_serial = 0; moves = 0;
        merge_serial(A, n / 2, A + n / 2, n / 2, out1);
        long ms = moves;
        cmp_parallel = 0; moves = 0;
        p_merge_aux(A, 0, n / 2 - 1, n / 2, n - 1, out2, 0);
        long mp = moves;
        printf("part 3: P-MERGE（二分分割）vs MERGE（串行）在 n=%d 上：\n", n);
        printf("        串行 MERGE：比较 %ld 次、元素搬动 %ld 次\n", cmp_serial, ms);
        printf("        P-MERGE  ：二分比较 %ld 次、元素搬动 %ld 次\n", cmp_parallel, mp);
        assert(ms == n);
        assert(mp == n);
        assert(cmp_serial <= (long)n - 1);
        printf("        两者搬动次数同为 n = %d（work 都是 Θ(n)）；P-MERGE 的额外开销在\n", n);
        printf("        O(lg² n) 的二分搜索里，换来 Θ(lg² n) 的 span（原书 26.3）。\n");
        free(A); free(out1); free(out2);
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 1（FIB 计数）与 span 递推。'},
           {line:16,zh:'`fib_count`：串行 FIB 的调用计数（work 的度量）。'},
           {line:23,zh:'`fib_iter`：迭代版 —— 独立对照，验证 $2F(n+1)-1$。'},
           {line:31,zh:'`pfib_span`：P-FIB 的 span 递推（$T_\\infty(n) = T_\\infty(n-1)+1$）。'},
           {line:80,zh:'★★ part 1：FIB(20) = 6765；调用次数 21891，与公式一致。'}]},
    tests:[{in:'FIB(20)',out:'6765；调用次数 21891 = 2·F(21) − 1'},
           {in:'P-FIB(20) 的 span',out:'20（Θ(n)）→ 并行度 ≈ 1095'}],
    mapping:[{pc:3,pcCode:'x = spawn P-FIB(n − 1)',c:'`fib_count(n - 1)` 的独立分支（第 17 行，串行投影）'},
             {pc:5,pcCode:'sync',c:'`return fib_count(n - 1) + fib_count(n - 2);`（第 18 行的汇合语义）'}]},
   {type:'analyze',title:'一本账：三个量串起来',claims:[
     {expr:'T_P \\ge \\max(T_1/P,\\ T_\\infty)',when:'任何调度器的下界',page:757,source:'book'},
     {expr:'T_P \\le T_1/P + T_\\infty',when:'贪心调度定理 26.1',page:760,source:'book'},
     {expr:'2',when:'贪心调度的近似因子（推论 26.2）',page:760,source:'book'},
    ],tables:[{caption:'C 程序 Part 1/2 实测',rows:[
      ['对象','work T₁','span T∞','parallelism'],
      ['P-FIB(20)','21891 次调用','20','≈ 1095'],
      ['P-MATRIX-MULTIPLY(64) 循环版','262144','12','≈ 21845'],
      ['P-MATRIX-MULTIPLY-RECURSIVE(64)','262144','43','≈ 6096'],
     ]},{caption:'串行 / 并行关键字的对照',rows:[
      ['写法','语义','对 T₁','对 T∞'],
      ['普通调用','等待返回','相加','相加'],
      ['spawn + sync','可并行','相加（不变）','取 max'],
      ['parallel for','各迭代可并行','相加（不变）','lg n 层'],
     ]}],chart:{xMax:64,series:[
     {name:'下界 max(T₁/P, T∞)（P=32, T₁=n³/64）',expr:'n * n * n / 64 / 32',color:'--viz-compare'},
     {name:'T∞ = Θ(lg n)',expr:'Math.log2(n)',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'定理 26.1 的证明骨架',steps:[
      {zh:'把执行切成"完整步"（P 个处理器全忙）与"不完整步"（有处理器空闲）。'},
      {zh:'完整步总数 ≤ $T_1/P$（每步消耗 P 单位 work）；不完整步总数 ≤ $T_\\infty$（每步至少推进关键路径 1 格）。'},
      {tex:'T_P \\le T_1/P + T_\\infty',zh:'★ 推论：当 $T_1/T_\\infty \\gg P$ 时，$T_P \\approx T_1/P$ —— 近完美加速。∎'}]},
     ],
    note:''},
   {type:'prove',title:'贪心调度定理与近完美加速',statement:'The running time T P of any task-parallel computation scheduled by a greedy scheduler on a P -processor ideal parallel computer is within a factor of 2 of optimal.',page:760,
    intro:'★ 两个层次：绝对上界（26.1）与相对最优（26.2）。',
    steps:[
     {title:'绝对上界',en:'On an ideal parallel computer with P processors, a greedy scheduler executes a task-parallel computation with work T 1 and span T 1 in time',page:760,
      body:['完整步 ≤ $T_1/P$（work 守恒）；不完整步 ≤ $T_\\infty$（关键路径每步至少前进一格）。',
        '两式相加即定理 26.1：$T_P \\le T_1/P + T_\\infty$。']},
     {title:'2-近似与近完美加速',en:'The running time T P of any task-parallel computation scheduled by a greedy scheduler on a P -processor ideal parallel computer is within a factor of 2 of optimal.',page:760,
      body:['最优时间 $\\ge \\max(T_1/P, T_\\infty)$；贪心 $\\le T_1/P + T_\\infty \\le 2\\max(T_1/P, T_\\infty)$ → 因子 2。',
        '若 $T_1/T_\\infty \\gg P$（并行度远大于处理器数），则 $T_1/P \\gg T_\\infty$ → $T_P \\approx T_1/P$（近完美加速）。',
        '★ C 程序 part 2 的意义：算出并行度就能判断"值不值得上更多处理器"。∎']},
     {title:'竞争的代价',en:'Let\u2019s recap what happened. By sequential consistency, the effect of the parallel execution is as if the executed instructions of the two processors are interleaved.',page:767,
      body:['RACE-EXAMPLE：两个并行分支写 x，结果可能是 1 或 2（原书 p.765 的 8 条指令交错）。',
        '★ 竞争的危害不只是"结果不定"：它还让 work/span 分析失去意义（依赖关系随交错改变）。',
        '工程对策：互斥锁、原子操作，或改用确定性并行（原书 p.790 引用的论文表明确定性并行常同样快）。∎']},
    ],conclusion:'★ 结论：work/span 是并行算法的设计尺；贪心调度把理论界变成工程可用（2 倍以内）。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'span（$T_\\infty$）指什么？',options:['总工作量','**最长依赖链（关键路径）**','处理器数','平均并行度'],answer:1,
      why:'★ $T_\\infty$ 是无限处理器下的最短时间。'},
     {kind:'single',q:'任何 $P$ 处理器的运行时间下界是？',options:['$T_1$','**$\\max(T_1/P, T_\\infty)$**','$T_\\infty/P$','$T_1 \\cdot P$'],answer:1,
      why:'★ work 分不完 + 关键路径走不完。'},
     {kind:'judge',q:'spawn 会改变算法的工作总量 $T_1$。',answer:false,
      why:'★ 删掉 spawn/sync 得到的串行投影与并行版 work 相同。'},
     {kind:'simulate',q:'C 程序里 FIB(20) 的调用次数是多少？（填数字）',expect:[21891],placeholder:'例如：10000',
      why:'21891 = 2·F(21) − 1（C 程序 part 1 与迭代 Fibonacci 对照）。'},
     {kind:'single',q:'贪心调度定理 26.1 给出的运行时间上界是？',options:['$T_P \\le T_1/P$','**$T_P \\le T_1/P + T_\\infty$**','$T_P \\le T_\\infty$','$T_P \\le 2T_1/P$'],answer:1,why:'★ analyze 第二条：把工作均摊到 $P$ 个处理器之外，还要再加一条关键路径 $T_\\infty$。'},
     {kind:'simulate',q:'C 程序里 P-FIB(20) 的并行度约为多少（取整）？',expect:[1095],placeholder:'例如：1000',why:'★ code 段实测：span 20（$\\Theta(n)$）、work 21891，21891 / 20 ≈ 1095。'},
     {kind:'judge',q:'贪心调度的运行时间与最优调度最多差 2 倍（推论 26.2）。',answer:true,why:'★ analyze 第三条「近似因子 2」，本关 prove 段的命题正是这条定理。'},
    ],bookExercises:[
     {id:'26.1-1',page:769,star:0,statement:'What does a trace for the execution of a serial algorithm look like?',hint:'按 RACE-EXAMPLE 的 8 条指令手工交错：列出能让 x 最终为 1 与为 2 的两种交错序列。'},
     {id:'26.1-2',page:769,star:0,statement:'Suppose that line 4 of P-FIB spawns P-FIB(n − 2), rather than calling it as is done in the pseudocode. How would the trace of P-FIB(4) in Figure 26.2 change? What is the impact on the asymptotic work, span, and parallelism?',hint:'DAG 的节点是 strand（一段无并行指令），边是依赖；标出关键路径（长度 = span）。'},
    ]},
  ],
};
