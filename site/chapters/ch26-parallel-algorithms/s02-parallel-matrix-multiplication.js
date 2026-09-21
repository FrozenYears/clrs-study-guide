/* 第 26 章 26.2：并行矩阵乘法（Parallel matrix multiplication）。印刷页 770–774（pdf 791–795）。 */
export default {
  key:'s02',id:'ch26/s02',chapter:26,section:'26.2',
  title:'并行矩阵乘法：同一问题的三种并行度',shortTitle:'26.2 并行矩阵乘法',
  titleEn:'Parallel matrix multiplication',
  source:{printed:[770,774],pdf:[791,795]},
  prerequisites:[{label:'26.1 The basics of fork-join parallelism',url:'#/ch26/s01'}],
  stages:[
   {type:'map',title:'递归 spawn 比 parallel for 更"值钱"吗',
    why:'矩阵乘法 $n^3$ 的工作量极其适合并行。本关比较三种写法：**并行转置**（$\\Theta(n^2)$ work）、**双层 parallel for**（span $\\Theta(\\lg n)$）、**递归 spawn**（span $\\Theta(\\lg^2 n)$）—— 看 work 与 span 如何共同决定并行度。',
    position:'26.1 分析语言的第一场实战；下一关的归并排序会遇到"work 与 span 都变大"的取舍。',
    unlocks:[{label:'26.3 Parallel merge sort',url:'#/ch26/s03'}],
    mathKit:[
     {title:'P-MATRIX-MULTIPLY',body:'两个 `parallel for` + 内层串行 $k$：work $\\Theta(n^3)$、span $\\Theta(\\lg n)$。'},
     {title:'递归版',body:'8 次 spawn 分块相乘 + 两次 `parallel for` 累加：work $\\Theta(n^3)$、span $M_\\infty(n) = M_\\infty(n/2) + \\Theta(\\lg n) = \\Theta(\\lg^2 n)$。'},
     {title:'并行度',body:'$T_1/T_\\infty$：循环版 $\\Theta(n^3/\\lg n)$，递归版 $\\Theta(n^3/\\lg^2 n)$（略小，因为 work 相同而 span 更大）。'},
    ]},
   {type:'intuition',title:'循环版反而更"并行"',scene:'C 程序 Part 2',body:[
     '直觉上"递归 spawn 有更多可并行分支"应该更快，但 work/span 分析给出相反结论：**递归版的 span 更大**（$\\lg^2 n$ vs $\\lg n$），而 work 相同 → 并行度反而更小。',
     '★ C 程序 part 2 实测（$n = 64$）：循环版 span 12 → 并行度 ≈ 21845；递归版 span 43 → 并行度 ≈ 6096。差 3.6 倍。',
     '★ 但递归版并非无用：它更贴近缓存友好的分块实现，且**分块（blocking）**能显著降低常数 —— work/span 描述渐近，工程还要看常数。',
     '★ 结论：并行度的比较要在 **work 相同**的前提下做；改写法前先算 span 的递推。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 P-MATRIX-MULTIPLY 与公式里的空格）。',blocks:[
     {kind:'body',page:771,en:'The first algorithm we\u2019ll study is P-MATRIX-MULTIPLY, which simply parallelizes the two outer loops in the procedure MATRIX-MULTIPLY on page 81.',
      zh:'★ 循环版：只把两层外循环并行化。'},
     {kind:'body',page:773,en:'D \u0398(n 3 ) by case 1 of the master theorem (Theorem 4.1). Not surprisingly, the work of this parallel algorithm is asymptotically the same as the running time of the procedure',
      zh:'★ 递归版的 work 仍是 $\\Theta(n^3)$（主定理 case 1）。'},
     {kind:'body',page:773,en:'Since this recurrence falls under case 2 of the master theorem with k = 1, the solution is M 1 (n) = \u0398(lg 2 n).',
      zh:'★★ 递归版 span：$M_\\infty(n) = \\Theta(\\lg^2 n)$（主定理 case 2，$k=1$）。'},
     {kind:'body',page:773,en:'\u0398(n 3 = lg 2 n), which is huge. (Problem 26-2 asks you to simplify this parallel algorithm at the expense of just a little less parallelism.)',
      zh:'★ 递归版并行度 $\\Theta(n^3/\\lg^2 n)$ —— 已经"巨大"，但比循环版略小。'},
     {kind:'body',page:770,en:'\u0398(n 2 = lg n) parallelism while maintaining \u0398(n 2 ) work.',
      zh:'★ 并行转置：$\\Theta(n^2/\\lg n)$ 并行度、work 不变。'},
    ],terms:[{en:'parallelism',zh:'并行度 T₁/T∞',page:773},
              {en:'P-MATRIX-MULTIPLY',zh:'并行矩阵乘法（循环版）',page:771}]},
   {type:'pseudocode',title:'P-MATRIX-MULTIPLY：4 行',algo:'P-MATRIX-MULTIPLY',signature:'P-MATRIX-MULTIPLY(A, B, C)',page:771,
    lines:[
     {n:1,code:'parallel for i = 1 to n    // compute entries in each of n rows',zh:'★ 行可并行。'},
     {n:2,code:'    parallel for j = 1 to n    // compute n entries in row i',zh:'★ 列也可并行。'},
     {n:3,code:'        for k = 1 to n',zh:'★ 内层串行：点积。'},
     {n:4,code:'            c_ij = c_ij + a_ik · b_kj',zh:'work = n³ 次乘加。'}],
    vars:[{name:'A, B, C',meaning:'$n \\times n$ 矩阵'}],
    note:'★ 两个并行循环各贡献 $\\lg n$ 的 span（并行循环 = 二分递归派生）→ span $\\Theta(\\lg n)$。',
    more:[{algo:'P-TRANSPOSE',subtitle:'P-TRANSPOSE：并行转置（p.770，3 行）',signature:'P-TRANSPOSE(A)',page:770,
      lines:[{n:1,code:'parallel for j = 2 to n',zh:''},
        {n:2,code:'    parallel for i = 1 to j − 1',zh:''},
        {n:3,code:'        exchange a_ij with a_ji',zh:'★ 交换一对元素，无依赖。'}],
      vars:[{name:'A',meaning:'待转置矩阵'}],
      note:'★ 并行度 $\\Theta(n^2/\\lg n)$：work 不变（$\\Theta(n^2)$），span 只有两层循环的 $\\Theta(\\lg n)$。'}]},
   {type:'visualize',title:'两种写法的并行度',panels:[
     {title:'C 程序 Part 2：循环版 vs 递归版（n = 64）',viz:'growth',
      chart:{xMax:25000,series:[
       {name:'循环版并行度 ≈ 21845（span 12）',expr:'21845',color:'--viz-done'},
       {name:'递归版并行度 ≈ 6096（span 43）',expr:'6096',color:'--viz-violation'}]},
      note:'★ work 相同（n³ = 262144），差别全在 span —— 递归链让关键路径变长。'},
    ],tasks:['对照 C 程序 part 2 对 n=16/64/256 的三组数字。'],note:''},
   {type:'code',title:'实测：span 12 vs 43',c:{file:'parallel.c',code:String.raw`/* parallel.c -- 26 章：并行算法的 work/span 分析（用计数模拟，不依赖真实多线程）。
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 2（矩阵乘法）。'},
           {line:34,zh:'`mat_work`：$n^3$（与写法无关）。'},
           {line:36,zh:'`mat_span_rec`：递归版 span 递推 $M_\\infty(n) = M_\\infty(n/2) + 2\\lg n$。'},
           {line:44,zh:'`mat_span_loop`：循环版 span = 两层并行循环 = $2\\lg n$。'},
           {line:100,zh:'★★ part 2：n=64 时循环版 span 12、递归版 43（并行度差 3.6 倍）。'}]},
    tests:[{in:'n = 64 循环版',out:'work 262144、span 12、并行度 ≈ 21845'},
           {in:'n = 64 递归版',out:'work 262144、span 43、并行度 ≈ 6096'}],
    mapping:[{pc:1,pcCode:'parallel for i = 1 to n',c:'`mat_span_loop` 中的第一层 $\\lg n$（第 48 行）'}]},
   {type:'analyze',title:'一本账：work 相同，比 span',claims:[
     {expr:'\\Theta(n^3)',when:'两种写法的 work 都是（乘加次数不变）',page:773,source:'book'},
     {expr:'\\Theta(\\lg n)',when:'循环版 P-MATRIX-MULTIPLY 的 span',page:771,source:'book'},
     {expr:'\\Theta(\\lg^2 n)',when:'递归版 P-MATRIX-MULTIPLY-RECURSIVE 的 span',page:773,source:'book'},
    ],tables:[{caption:'C 程序 Part 2 实测（work 都是 n³）',rows:[
      ['n','work','循环版 span','递归版 span','并行度比'],
      ['16','4096','8','21','512 : 195'],
      ['64','262144','12','43','21845 : 6096'],
      ['256','16777216','16','73','1048576 : 229825'],
     ]},{caption:'三种并行矩阵操作',rows:[
      ['操作','work','span','并行度'],
      ['P-TRANSPOSE','$\\Theta(n^2)$','$\\Theta(\\lg n)$','$\\Theta(n^2/\\lg n)$'],
      ['P-MATRIX-MULTIPLY','$\\Theta(n^3)$','$\\Theta(\\lg n)$','$\\Theta(n^3/\\lg n)$'],
      ['P-MATRIX-MULTIPLY-RECURSIVE','$\\Theta(n^3)$','$\\Theta(\\lg^2 n)$','$\\Theta(n^3/\\lg^2 n)$'],
     ]}],chart:{xMax:256,series:[
     {name:'循环版并行度 ∝ n³/lg n',expr:'n * n * n / Math.log2(n) / 8',color:'--viz-done'},
     {name:'递归版并行度 ∝ n³/lg² n',expr:'n * n * n / (Math.log2(n) * Math.log2(n)) / 4',color:'--viz-violation'}]},
    derivations:[{kind:'summation',title:'递归版 span 的主定理',steps:[
      {zh:'递归式：$M_\\infty(n) = M_\\infty(n/2) + \\Theta(\\lg n)$（8 次 spawn 并行 → 取 max；两次 `parallel for` 各 $\\lg n$ 串行相加）。'},
      {zh:'这是主定理 case 2 的形状（$a = 1$、$b = 2$、$f(n) = \\lg n = \\Theta(n^{\\lg_b a}\\lg^1 n)$），$k = 1$。'},
      {tex:'M_\\infty(n) = \\Theta(\\lg^2 n)',zh:'★ C 程序 part 2 的 21/43/73 正是这条渐近线的离散实例。∎'}]},
     ],
    note:''},
   {type:'prove',title:'work 不变、span 变长：为什么递归版"更差"',statement:'D \u0398(n 3 ) by case 1 of the master theorem (Theorem 4.1). Not surprisingly, the work of this parallel algorithm is asymptotically the same as the running time of the procedure',page:773,
    intro:'★ 本关的结论有点反直觉，值得单独论证：并行度 = work/span，所以"span 变大"就是"并行度变小"。',
    steps:[
     {title:'work 相同',en:'The first algorithm we\u2019ll study is P-MATRIX-MULTIPLY, which simply parallelizes the two outer loops in the procedure MATRIX-MULTIPLY on page 81.',page:771,
      body:['两种写法都做 $n^3$ 次乘加（递归版把 8 个子块乘法相加，总量不变）。',
        '所以 $T_1 = \\Theta(n^3)$ 对两者都成立 —— 比较并行度只需比较 span。']},
     {title:'span 的比较',en:'Since this recurrence falls under case 2 of the master theorem with k = 1, the solution is M 1 (n) = \u0398(lg 2 n).',page:773,
      body:['循环版：两层 `parallel for` 各 $\\Theta(\\lg n)$ → span $\\Theta(\\lg n)$。',
        '递归版：每层递归额外付 $\\Theta(\\lg n)$，共 $\\lg n$ 层 → span $\\Theta(\\lg^2 n)$。',
        '所以递归版并行度小一个 $\\lg n$ 因子 —— C 程序实测 6096 vs 21845（n=64）与之吻合。∎']},
     {title:'那为什么还要递归版？',en:'\u0398(n 3 = lg 2 n), which is huge. (Problem 26-2 asks you to simplify this parallel algorithm at the expense of just a little less parallelism.)',page:773,
      body:['原书明说递归版并行度"huge"，且**习题 26-2 让你简化它以换取略小的并行度** —— 说明递归分块在工程上有价值（缓存局部性、常数因子）。',
        '★ 结论：work/span 决定渐近并行度；具体选择还要看常数与内存层次。∎']},
    ],conclusion:'★ 结论：并行度 = work/span；同 work 时比 span —— 递归分块换来缓存友好，代价是关键路径变长。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'P-MATRIX-MULTIPLY（循环版）的 span 是？',options:['$\\Theta(1)$','**$\\Theta(\\lg n)$**','$\\Theta(\\lg^2 n)$','$\\Theta(n)$'],answer:1,
      why:'★ 两层并行循环各 $\\lg n$。'},
     {kind:'single',q:'递归版与循环版的 work 关系是？',options:['递归版更小：递归能把相同的乘法合并掉','**两者都是 Θ(n³)**','循环版更小：三重循环的乘加次数少一些','无法比较'],answer:1,
      why:'★ 乘加总次数不变。'},
     {kind:'judge',q:'递归版的并行度比循环版大。',answer:false,
      why:'★ 递归版 span 更大 → 并行度更小（C 程序实测 6096 vs 21845）。'},
     {kind:'simulate',q:'C 程序里 n=64 时循环版的 span 是多少？（填数字）',expect:[12],placeholder:'例如：8',
      why:'12 = 2·lg 64（两层并行循环）。'},
     {kind:'simulate',q:'C 程序里 n=64 时递归版的 span 是多少？（填数字）',expect:[43],placeholder:'例如：20',why:'★ code 段实测：递归版 span 43，循环版只有 12 —— 递归多付了一个 $\\lg$ 因子。'},
     {kind:'simulate',q:'C 程序里 n=64 时循环版的并行度约为多少（取整）？',expect:[21845],placeholder:'例如：10000',why:'★ 262144 / 12 ≈ 21845 —— work 相同而 span 小 3 倍多，并行度就高出 3 倍多。'},
     {kind:'single',q:'两种写法的 work 相同，为什么递归版的 span 反而更大？',options:['因为递归版 work 更大','**因为递归版在外层 parallel for 里又套了一层递归，多出一个 $\\lg n$ 因子**','因为函数调用本身要花时间：每一次递归调用都要压栈，返回时再弹栈，这部分开销串行地累在 span 上','因为递归版用了不同的算法'],answer:1,why:'★ analyze 第二、三条的对照：多一层对数因子，span 由 12 变成 43。'},
    ],bookExercises:[
     {id:'26.2-1',page:774,star:0,statement:'Draw the trace for computing P-MATRIX-MULTIPLY on 2 × 2 matrices, labeling how the vertices in your diagram correspond to strands in the execution of the algorithm. Assuming that each strand executes in un it time, analyze the work, span, and parallelism of this computation.',hint:'把每个 (i,j) 的内层求和看成一条 strand（两条乘加指令连着走），外层两层 parallel for 负责扇出与汇合。2x2 就是 4 条 strand 加上 spawn/sync 的边：工作数所有 strand 的长度之和，跨度找最长的那条依赖链，两者相除即并行度。'},
     {id:'26.2-2',page:774,star:0,statement:'Repeat Exercise 26.2-1 for P-MATRIX-MULTIPLY-RECURSIVE .',hint:'跨度递推里那一层不是 $\\Theta(1)$：原书式 (26.6) 是 $M_\\infty(n) = M_\\infty(n/2) + \\Theta(\\lg n)$，解出来 $\\Theta(\\lg^2 n)$，不是 $\\Theta(\\lg n)$。 两个 $\\Theta(\\lg n)$ 来自两处双重 parallel for：把 $D$ 清零的那一段，和末尾把四个子块结果相加的那一段 （每段都是 $\\lg n$ 层、每层 $O(1)$）。本关的 C 程序 `mat_span_rec(n/2) + 2*lg` 就是这个式子的直译。 小细节：$n = 2$ 时递归只有一层，实测会明显低于曲线外推值 —— 拿 $\\lg^2 n$ 去拟合小 $n$ 要看清起点。'},
     {id:'26.2-3',page:774,star:0,statement:'Give pseudocode for a parallel algorithm that multiplies two n × n matrices with work Θ(n 3 ) but span only Θ(lg n). Analyze your algorithm.',hint:'跨度要压到对数级，就不能让内层串行累加：对每个 (i,j) 先并行算出 n 个部分积，再用一棵二叉归约树把它们加起来。归约树有 $2n-1$ 个结点，所以每项仍是 $\\Theta(n)$ 工作、跨度 $\\Theta(\\lg n)$，外层 (i,j) 整个并行展开。'},
    ]},
  ],
};
