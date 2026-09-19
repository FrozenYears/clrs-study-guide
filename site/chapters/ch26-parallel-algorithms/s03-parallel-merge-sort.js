/* 第 26 章 26.3：并行归并排序（Parallel merge sort）。印刷页 775–791（pdf 796–812）。 */
export default {
  key:'s03',id:'ch26/s03',chapter:26,section:'26.3',
  title:'并行归并：二分分割点换 lg²n 的 span',shortTitle:'26.3 并行归并排序',
  titleEn:'Parallel merge sort',
  source:{printed:[775,791],pdf:[796,812]},
  prerequisites:[{label:'26.2 Parallel matrix multiplication',url:'#/ch26/s02'}],
  stages:[
   {type:'map',title:'把"归并"这一步也并行化',
    why:'P-MERGE-SORT 的两个递归调用可并行（span 只有 $\\lg n$ 层），但瓶颈在 MERGE 本身：串行归并是 $\\Theta(n)$ span → 总并行度只剩 $\\Theta(\\lg n)$。**P-MERGE** 用"二分找分割点"把归并的 span 降到 $\\Theta(\\lg^2 n)$。',
    position:'本章收官。它是"work/span 取舍"的经典案例：并行归并的 work 仍是 $\\Theta(n)$，但常数更大（多了二分搜索）—— 换来并行度从 $\\lg n$ 跃升到 $n/\\lg^2 n$。',
    unlocks:[{label:'27.1 Waiting for an elevator',url:'#/ch27/s01'}],
    mathKit:[
     {title:'P-MERGE-SORT',body:'`spawn` 两个递归调用 + `sync`：work $\\Theta(n\\lg n)$、span $2\\lg n$ 层的递归 + P-MERGE 的 span。'},
     {title:'P-MERGE',body:'取较大段的中位 $x$，在另一段二分找分割点 → 把问题劈成两半递归。'},
     {title:'结局',body:'P-MERGE 的 work $\\Theta(n)$、span $\\Theta(\\lg^2 n)$ → P-MERGE-SORT 并行度 $\\Theta(n/\\lg^3 n)$。'},
    ]},
   {type:'intuition',title:'二分分割点：把归并变成"两次二分"',scene:'C 程序 Part 3（n = 1024）',body:[
     '串行归并一个一个比；**P-MERGE** 每次取"较大段"的中位 $x$，在另一段二分出 $x$ 应插入的位置 —— 于是 $x$ 的最终位置也确定了，问题劈成两半。',
     '★ C 程序实测（n = 1024）：串行 MERGE 比较 1023 次；P-MERGE 二分比较 1271 次 —— **同为 $\\Theta(n)$ 量级**，但 P-MERGE 的关键路径只有 $\\Theta(\\lg^2 n)$。',
     '★ 两者元素搬动都是 **1024 = n** 次（部分有序输入下串行归并的比较数恰好 n−1）—— work 相同，span 迥异。',
     '★ 与 26.2 的对照：那里是"work 相同、递归让 span 变大（变差）"；这里是"work 相近、并行化让 span 变小（变好）"。判定标准始终是 **work/span**。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 √1 代表下标变量 ℓ₁、T 1 代表 T∞）。',blocks:[
     {kind:'body',page:776,en:'MERGE-SORT, its work is T 1 (n) = \u0398(n lg n). The two recursive calls in lines 5 and 7 run in parallel, and so its span is given by the recurrence',
      zh:'★ P-MERGE-SORT 的 work 与串行相同；span 由两个并行递归决定。'},
     {kind:'body',page:777,en:'(if any) are at least x . Intuitively, the subarray A[p 2 : r 2 ] would still be sorted if x were inserted between A[q 2 \u22121] and A[q 2 ] (although the algorithm doesn\u2019t do that).',
      zh:'★ 分割点的直觉：把 $x$ 插在 $A[q_2-1]$ 与 $A[q_2]$ 之间仍保持有序。'},
     {kind:'body',page:780,en:'Because this recurrence falls under case 2 of the master theorem with k = 1, its solution is T 1 (n) = \u0398(lg 2 n).',
      zh:'★★ P-MERGE-AUX 的 span $\\Theta(\\lg^2 n)$（主定理 case 2）。'},
     {kind:'body',page:781,en:'\u0398(lg 2 n) span overall for P-MERGE . The parallel for loop contains \u0398(n) work, matching the asymptotic work of P-MERGE-AUX and yielding \u0398(n) work overall for P-MERGE .',
      zh:'★★ P-MERGE：span $\\Theta(\\lg^2 n)$、work $\\Theta(n)$。'},
     {kind:'body',page:782,en:'MERGE procedure, is only \u0398(lg n). For P-MERGE-SORT, the parallelism is T 1 (n)/T 1 (n) = \u0398(n lg n)=\u0398(lg 3 n)',
      zh:'★★ 对照：用串行 MERGE 的 P-NAIVE-MERGE-SORT 并行度只有 $\\Theta(\\lg n)$；P-MERGE-SORT 是 $\\Theta(n/\\lg^3 n)$。'},
    ],terms:[{en:'P-MERGE',zh:'并行归并（二分分割点）',page:779},
              {en:'P-MERGE-SORT',zh:'并行归并排序',page:775}]},
   {type:'pseudocode',title:'P-MERGE-SORT：8 行',algo:'P-MERGE-SORT',signature:'P-MERGE-SORT(A, p, r)',page:775,
    lines:[
     {n:1,code:'if p ≥ r    // zero or one element?',zh:''},
     {n:2,code:'    return',zh:''},
     {n:3,code:'q = (p + r)/2    // midpoint of A[p : r]',zh:''},
     {n:4,code:'spawn P-MERGE-SORT(A, p, q)',zh:'★ 左半可并行。'},
     {n:5,code:'spawn P-MERGE-SORT(A, q + 1, r)',zh:'★ 右半可并行。'},
     {n:6,code:'sync    // wait for spawns',zh:'★ 汇合后再归并。'},
     {n:7,code:'P-MERGE(A, p, q, r)',zh:'★★ 用并行归并（而不是串行 MERGE）。'},
     {n:8,code:'（返回 A[p..r] 已排序）',zh:''}],
    vars:[{name:'p, q, r',meaning:'子数组边界'}],
    note:'★ 只有把第 7 行换成 P-MERGE，并行度才从 $\\Theta(\\lg n)$ 升到 $\\Theta(n/\\lg^3 n)$。',
    more:[{algo:'FIND-SPLIT-POINT',subtitle:'FIND-SPLIT-POINT(A, p, r, x) —— 二分找插入位置（p.778，8 行）',signature:'FIND-SPLIT-POINT(A, p, r, x)',page:778,
      lines:[{n:1,code:'low = p    // low end of search range',zh:''},
        {n:2,code:'high = r + 1    // high end of search range',zh:''},
        {n:3,code:'while low < high    // more than one element?',zh:''},
        {n:4,code:'    mid = (low + high)/2',zh:''},
        {n:5,code:'    if x ≤ A[mid]    // is answer q ≤ mid?',zh:''},
        {n:6,code:'        high = mid',zh:''},
        {n:7,code:'    else low = mid + 1',zh:''},
        {n:8,code:'return low',zh:'★ 返回 x 应插入的位置。'}],
      vars:[{name:'x',meaning:'中位值'}],
      note:'★ 每次 $\\lg n$ 比较 —— C 程序 part 3 的 1271 次比较就是这些二分的总和。'}]},
   {type:'visualize',title:'比较次数与 span',panels:[
     {title:'C 程序 Part 3：串行 vs 并行归并（n = 1024）',viz:'growth',
      chart:{xMax:1400,series:[
       {name:'串行 MERGE 比较 1023',expr:'1023',color:'--viz-compare'},
       {name:'P-MERGE 二分比较 1271',expr:'1271',color:'--viz-done'},
       {name:'共同搬动 1024',expr:'1024',color:'--viz-violation'}]},
      note:'★ 比较次数同量级（都是 Θ(n)）—— P-MERGE 的收益全在 span：$\\Theta(n) \\to \\Theta(\\lg^2 n)$。'},
    ],tasks:['对照 C 程序 part 3 的统计与输出一致性断言。'],note:''},
   {type:'code',title:'实测：1023 vs 1271，搬动都是 1024',c:{file:'parallel.c',code:String.raw`/* parallel.c -- 26 章：并行算法的 work/span 分析（用计数模拟，不依赖真实多线程）。
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 3（归并）。'},
           {line:54,zh:'`merge_serial`：串行归并 + 比较计数。'},
           {line:67,zh:'`find_split_point`：二分找分割点（FIND-SPLIT-POINT 的直译）。'},
           {line:78,zh:'`p_merge_aux`：P-MERGE-AUX —— 在较大段取中位、二分定位后递归。'},
           {line:130,zh:'★★ part 3：串行 1023 次比较 / P-MERGE 1271 次；搬动都是 1024。'}]},
    tests:[{in:'n = 1024（两段已排序）',out:'串行比较 1023、P-MERGE 比较 1271、搬动都是 1024'},
           {in:'输出一致性',out:'两者搬动次数相同且均为 n —— work 同为 Θ(n)'}],
    mapping:[{pc:5,pcCode:'if x ≤ A[mid]',c:'`if (x <= A[mid]) { hi = mid; } else { lo = mid + 1; }`（第 72 行）'},
             {pc:7,pcCode:'P-MERGE(A, p, q, r)',c:'`p_merge_aux(A, 0, n / 2 - 1, n / 2, n - 1, out2, 0);`（第 151 行）'}]},
   {type:'analyze',title:'一本账：三种归并的并行度',claims:[
     {expr:'\\Theta(n)',when:'P-MERGE 的 work',page:781,source:'book'},
     {expr:'\\Theta(\\lg^2 n)',when:'P-MERGE 的 span',page:781,source:'book'},
     {expr:'\\Theta(n/\\lg^3 n)',when:'P-MERGE-SORT 的并行度（$\\Theta(n\\lg n)/\\Theta(\\lg^3 n)$）',page:782,source:'book'},
    ],tables:[{caption:'C 程序 Part 3 实测（n = 1024）',rows:[
      ['量','串行 MERGE','P-MERGE'],
      ['比较次数','1023','1271（二分）'],
      ['元素搬动','1024','1024'],
      ['span','Θ(n)','Θ(lg² n)'],
     ]},{caption:'三种排序写法',rows:[
      ['写法','work','span','并行度'],
      ['串行 MERGE-SORT','$\\Theta(n\\lg n)$','$\\Theta(n)$','$\\Theta(\\lg n)$'],
      ['P-NAIVE-MERGE-SORT（并行递归 + 串行归并）','$\\Theta(n\\lg n)$','$\\Theta(\\lg^2 n)$','$\\Theta(\\lg n)$'],
      ['**P-MERGE-SORT**','$\\Theta(n\\lg n)$','$\\Theta(\\lg^3 n)$','$\\Theta(n/\\lg^3 n)$'],
     ]}],chart:{xMax:1024,series:[
     {name:'P-MERGE 的 span ≈ lg²n',expr:'Math.log2(n) * Math.log2(n) / 4',color:'--viz-done'},
     {name:'串行归并的 span ≈ n',expr:'n',color:'--viz-violation'}]},
    derivations:[{kind:'summation',title:'P-MERGE-AUX 的两个递推',steps:[
      {zh:'**span**：每次把问题劈成 ≤ 3n/4 的两半（较大段取中位保证平衡），每层付 $\\Theta(\\lg n)$ 二分 → $T_\\infty(n) = T_\\infty(3n/4) + \\Theta(\\lg n) = \\Theta(\\lg^2 n)$。'},
      {zh:'**work**：$T_1(n) = T_1(\\alpha n) + T_1((1-\\alpha)n) + \\Theta(\\lg n)$，$\\alpha \\in [1/4, 3/4]$ —— 原书 p.781 用代入法证明 $T_1(n) = \\Theta(n)$。'},
      {tex:'T_1 = \\Theta(n),\\quad T_\\infty = \\Theta(\\lg^2 n)',zh:'★ C 程序 part 3 的 1271 次比较（work 线性）与"只有 lg² 层递归"的构造相符。∎'}]},
     ],
    note:''},
   {type:'prove',title:'P-MERGE 的正确性与平衡性',statement:'(if any) are at least x . Intuitively, the subarray A[p 2 : r 2 ] would still be sorted if x were inserted between A[q 2 \u22121] and A[q 2 ] (although the algorithm doesn\u2019t do that).',page:777,
    intro:'★ 正确性靠"分割点定位"，平衡性靠"总在较大段取中位"。',
    steps:[
     {title:'分割点的正确性',en:'(if any) are at least x . Intuitively, the subarray A[p 2 : r 2 ] would still be sorted if x were inserted between A[q 2 \u22121] and A[q 2 ] (although the algorithm doesn\u2019t do that).',page:777,
      body:['设第一段已排序、$x = A[q_1]$ 是中位；$q_2$ = FIND-SPLIT-POINT 给出的位置。',
        '则 $x$ 在归并输出中的最终位置 = $(q_1 - p_1) + (q_2 - p_2)$ —— 前面正好是两段中比 $x$ 小的那些元素。',
        '于是可把问题劈成"$x$ 之前的元素"与"$x$ 之后的元素"两个独立子问题（各自仍是两段有序的归并）。∎']},
     {title:'平衡性 ⇒ span',en:'Because this recurrence falls under case 2 of the master theorem with k = 1, its solution is T 1 (n) = \u0398(lg 2 n).',page:780,
      body:['算法保证**总在较大段取中位**：较小的那段至多占一半，故递归后单边规模 ≤ 3n/4。',
        '每层付 $\\Theta(\\lg n)$（一次二分），层数 $\\Theta(\\lg n)$ → span $\\Theta(\\lg^2 n)$。',
        '★ C 程序 part 3 的实测：P-MERGE 的比较次数 1271 虽比串行 1023 多，但对应的是"更浅的关键路径"。∎']},
     {title:'与并行度结论的连接',en:'MERGE procedure, is only \u0398(lg n). For P-MERGE-SORT, the parallelism is T 1 (n)/T 1 (n) = \u0398(n lg n)=\u0398(lg 3 n)',page:782,
      body:['P-MERGE-SORT：work $\\Theta(n\\lg n)$、span $\\Theta(\\lg^2 n)$（归并）+ $\\Theta(\\lg n)$（递归）→ 总 span $\\Theta(\\lg^3 n)$。',
        '并行度 $= \\Theta(n/\\lg^3 n)$ —— 比"并行递归 + 串行归并"的 $\\Theta(\\lg n)$ 高出多项式级别。',
        '★ 这就是把"瓶颈步骤（归并）"也并行化的价值。∎']},
    ],conclusion:'★ 结论：P-MERGE 用"中位 + 二分"把归并的关键路径从 $\\Theta(n)$ 压到 $\\Theta(\\lg^2 n)$；work 不变。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'P-MERGE 每次在哪个段取中位？',options:['较小的段','**较大的段**','随机段','第一段'],answer:1,
      why:'★ 保证递归后规模 ≤ 3n/4（平衡）—— 这是 span $\\lg^2 n$ 的前提。'},
     {kind:'single',q:'P-MERGE 的 work 与 span 分别是？',options:['$\\Theta(n\\lg n)$ / $\\Theta(\\lg n)$','**$\\Theta(n)$ / $\\Theta(\\lg^2 n)$**','$\\Theta(n^2)$ / $\\Theta(\\lg n)$','$\\Theta(n)$ / $\\Theta(n)$'],answer:1,
      why:'★ 二分搜索把 span 从 $\\Theta(n)$ 降到 $\\Theta(\\lg^2 n)$，work 仍线性。'},
     {kind:'judge',q:'用串行 MERGE 的 P-NAIVE-MERGE-SORT 并行度只有 Θ(lg n)。',answer:true,
      why:'★ 瓶颈在串行归并的 $\\Theta(n)$ span（原书 p.782）。'},
     {kind:'simulate',q:'C 程序 part 3 中 P-MERGE 的二分比较次数是多少？（填数字）',expect:[1271],placeholder:'例如：1000',
      why:'1271 次（串行为 1023 次；搬动都是 n = 1024）。'},
     {kind:'simulate',q:'C 程序里 n=1024 时串行归并的比较次数是多少？',expect:[1023],placeholder:'例如：1024',why:'★ code 段实测：串行归并只需 $n-1 = 1023$ 次比较。'},
     {kind:'judge',q:'P-MERGE 的 work 仍是 $\\Theta(n)$，只是常数更大（多出二分搜索的比较）。',answer:true,why:'★ n=1024 时比较次数由 1023 涨到 1271，搬动次数两者都是 1024 —— 这就是换来小 span 的代价。'},
     {kind:'single',q:'P-MERGE-SORT 的并行度是多少？',options:['$\\Theta(\\lg n)$','**$\\Theta(n/\\lg^3 n)$**','$\\Theta(n)$','$\\Theta(\\lg^2 n)$'],answer:1,why:'★ analyze 第三条：$\\Theta(n\\lg n) / \\Theta(\\lg^3 n)$，比串行归并版的 $\\Theta(\\lg n)$ 高出好几个量级。'},
    ],bookExercises:[
     {id:'26.3-1',page:782,star:0,statement:'Explain how to coarsen the base case of P-MERGE .',hint:'分区步骤可并行（每个元素独立比较），但"找中位的中位"需要递归 —— span 递推类似 P-MERGE，最终给出 work $\\Theta(n)$、span $\\Theta(\\lg^2 n)$ 的实现。'},
     {id:'26.3-2',page:782,star:0,statement:'Instead of finding a median element in the larger subarray, as P-MERGE does, sup- pose that the merge procedure finds a median of all the elements in the two sorted subarrays using the result of Exercise 9.3-10. Give pseudocode for an efficient parallel merging procedure that uses this median-finding procedure. Analyze your algorithm.',hint:'提示指向"多趟扫描 + 辅助数组"：先把分区计数并行算出（各元素独立判定落区），再前缀和定位写入 —— 这就是并行 partition 的标准做法。'},
     {id:'26.3-3',page:782,star:0,statement:'Give an efficient parallel algorithm for partitioning an array around a pivot, as is done by the PARTITION procedure on page 184. You need not partition the array in place. Make your algorithm as parallel as possible. Analyze your algorithm. (Hint: You might need an auxiliary array and might need to make more than one pass over the input elements.)',hint:'递归派生版：span $\\Theta(\\lg n)$、work $\\Theta(n)$；grain-size 版：span = $\\Theta(n/\\text{grain-size} + \\lg\\text{grain-size})$，取 $\\text{grain-size} = \\Theta(\\lg n)$ 附近最优。'},
    ]},
  ],
};
