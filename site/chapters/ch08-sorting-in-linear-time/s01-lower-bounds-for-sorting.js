/* 第 8 章 8.1：排序算法的下界（Lower bounds for sorting）。
 * 原文锚点：印刷页 205–208（pdf_index 226–229）。
 * 引述已用 tools/07_pick_quotes.py pick 逐条预检（19/19 PASS）。
 * 本关是纯理论关（无新实现）：决策树模型 + Theorem 8.1。
 */

/* Figure 8.1：三元素插入排序的决策树（原书 p.206）。
 * 内部结点标 i:j 表示比较 a_i ≤ a_j；左走 = 成立，右走 = a_i > a_j。
 * 高亮路径（⟨6,8,5⟩）：1:2 左 → 2:3 右 → 1:3 右 → 叶 ⟨3,1,2⟩。
 */
const nd = (label, children) => ({ label, children });
const lf = (label) => ({ label, children: [] });

const TREE81 = [
  { root: nd('1:2', [
      nd('2:3', [
        lf('⟨1,2,3⟩'),
        nd('1:3', [lf('⟨1,3,2⟩'), lf('⟨3,1,2⟩')]),
      ]),
      nd('2:3', [
        lf('⟨2,3,1⟩'),
        nd('1:3', [lf('⟨2,1,3⟩'), lf('⟨3,2,1⟩')]),
      ]),
    ]) },
];
const NOTES81 = [
  '根结点 1:2：第一次比较 a₁ ≤ a₂？左 = 成立，右 = a₁ > a₂。',
  '左子树（a₁ ≤ a₂）：比较 2:3。a₂ ≤ a₃ 直接得 ⟨1,2,3⟩；a₂ > a₃ 还要再比 1:3。',
  '★ 高亮路径对应输入 ⟨6,8,5⟩：6 ≤ 8（左）→ 8 > 5（右）→ 6 > 5（右）→ 叶 ⟨3,1,2⟩，即 a₃ ≤ a₁ ≤ a₂。',
  '★ 3 个元素有 3! = 6 种排列，6 个叶子一个不能少；树高 3 = ⌈lg 6⌉。',
];

export default {
  key:'s01',id:'ch08/s01',chapter:8,section:'8.1',
  title:'排序的下界：比较排序的极限在哪里',shortTitle:'8.1 排序算法的下界',
  titleEn:'Lower bounds for sorting',
  source:{printed:[205,208],pdf:[226,229]},
  prerequisites:[{label:'7.4 Analysis of quicksort',url:'#/ch07/s04'}],
  stages:[
   {type:'map',title:'比较排序的极限：Ω(n lg n) 是天花板',
    why:'前面各章的全部排序算法（归并、堆、快排）都只靠**比较元素**获得顺序信息。本关证明：任何这类算法最坏情况都要做 $\\Omega(n\\lg n)$ 次比较 —— 归并排序和堆排序已经**渐近最优**，比较排序的改进空间只剩常数因子。',
    position:'第 2–7 章给的都是上界；本关第一次给**下界**。8.2–8.4 的三种线性时间排序之所以能突破这个下界，是因为它们**根本不做元素比较**（用下标索引、逐位、桶）—— 下界的适用前提被绕开了。',
    unlocks:[{label:'8.2 Counting sort（计数排序）',url:'#/ch08/s02'}],
    mathKit:[
     {title:'决策树模型',body:'一次比较排序的执行 = 从根到叶的一条路径。$n$ 个元素的 $n!$ 种排列都必须是可达叶子，所以 $n! \\le 2^h$，$h \\ge \\lg n!$。'},
     {title:'Stirling 近似',body:'$\\lg n! = n\\lg n - n\\lg e + \\Theta(\\lg n) = \\Theta(n\\lg n)$。本关 C 程序数值验证了这个近似的精度。'},
     {title:'信息论直觉',body:'每次比较最多得到 1 bit 信息（≤ 或 >），而区分 $n!$ 种排列需要 $\\lg n!$ bit。比较次数不可能少于信息量。'},
    ]},
   {type:'intuition',title:'把一次排序看成二十个问题',
    scene:'猜数字游戏：每次提问最多排除一半可能',
    body:[
     '比较排序每做一次比较，只有两种结果（$\\le$ 或 $>$）—— 相当于问一个**是非题**。要区分 $n!$ 种可能的输入排列，是非题至少要问 $\\lg n!$ 个。',
     '把这件事画出来就是**决策树**：内部结点是一次比较 $i:j$，左子树 = $a_i \\le a_j$，右子树 = $a_i > a_j$；叶子是最终确定的排列。**一次具体执行 = 从根到某叶的一条路径**。',
     '★ 树必须够"宽"：$n!$ 种排列都要出现在叶子上（可达），否则总有输入排不了。$n!$ 个叶子的二叉树高度至少 $\\lg n!$。',
     '★ $\\lg n! = \\Theta(n\\lg n)$（Stirling）。这就是 Theorem 8.1：任何比较排序最坏情况 $\\Omega(n\\lg n)$ 次比较。归并、堆排的 $O(n\\lg n)$ 正好贴住它 —— **渐近最优**。',
    ],
    interactive:{text:'阶段 5 的面板 ① 画了 3 个元素插入排序的完整决策树（原书 Figure 8.1）—— 数一数叶子是不是恰好 6 个。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体）。',
    blocks:[
     {kind:'body',page:205,en:'These algorithms share an interesting property: the sorted order they determine is based only on comparisons between the input elements. We call such sorting algorithms comparison sorts. All the sorting algorithms introduced thus far are comparison sorts.',
      zh:'★★ 关键定义：**比较排序**（comparison sort）—— 排序依据只来自元素间的比较。第 2–7 章的全部算法都在此列。'},
     {kind:'body',page:205,en:'In Section 8.1, we’ll prove that any comparison sort must make Ω(n lg n) comparisons in the worst case to sort n elements. Thus, merge sort and heapsort are asymptotically optimal, and no comparison sort exists that is faster by more than a constant factor.',
      zh:'★★ 本关的目标一句话说完：比较排序最坏 $\\Omega(n\\lg n)$ → **归并/堆排渐近最优**，改进空间只剩常数因子。'},
     {kind:'body',page:205,en:'Sections 8.2, 8.3, and 8.4 examine three sorting algorithms—counting sort, radix sort, and bucket sort—that run in linear time on certain types of inputs. Of course, these algorithms use operations other than comparisons to determine the sorted order. Consequently, the Ω(n lg n) lower bound does not apply to them.',
      zh:'★★ 线性时间为什么可能？因为**下界的适用前提（只做比较）被绕开了**。8.2 用数组下标、8.3 逐位、8.4 用桶 —— 它们不做元素比较。'},
     {kind:'body',page:206,en:'We can view comparison sorts abstractly in terms of decision trees. A decision tree is a full binary tree (each node is either a leaf or has both children) that represents the comparisons between elements that are performed by a particular sorting algorithm operating on an input of a given size. Co ntrol, data movement, and all other aspects of the algorithm are ignored.',
      zh:'★ 决策树模型：**只保留比较，其余全部忽略**（控制流、数据移动都不算）。这个抽象让下界证明只依赖"比较能提供多少信息"。'},
     {kind:'body',page:206,en:'Because any correct sorting algorithm must be able to produce each permutation of its input, each of the n! permutations on n elements must appear as at least one of the leaves of the decision tree for a comparison sort to be correct.',
      zh:'★★ 下界的核心论据：**正确性要求 $n!$ 种排列都出现在叶子上**。少一种排列，就有一类输入没法应对。'},
     {kind:'body',page:207,en:'The length of the longest simple path from the root of a decision tree to any of its reachable leaves represents the worst-case number of comparisons that the corresponding sorting algorithm performs. Consequently, the worst-case number of comparisons for a given comparison sort algorithm equals the height of its decision tree.',
      zh:'★ 树高 = 最坏比较次数。**最坏情况分析变成了一个纯组合问题：这棵树至少要多高？**'},
     {kind:'body',page:207,en:'Any comparison sort algorithm requires Ω(n lg n) comparisons in the worst case.',
      zh:'★★ **Theorem 8.1** 本体。这是全书最重要的下界。'},
     {kind:'body',page:207,en:'Heapsort and merge sort are asymptotically optimal comparison sorts.',
      zh:'★★ **Corollary**：堆排序与归并排序是渐近最优的比较排序。$O(n\\lg n)$ 上界贴住了 $\\Omega(n\\lg n)$ 下界。'},
    ],
    terms:[
     {en:'comparison sort',zh:'比较排序',page:205},
     {en:'decision tree',zh:'决策树',page:206},
    ]},
   {type:'pseudocode',title:'决策树的例子来自它：INSERTION-SORT（回顾）',
    lead:'★ Figure 8.1 的决策树就是这 8 行代码在 n = 3 时的完整行为。本关不实现新东西，放它是为了让决策树看得着。',
    algo:'INSERTION-SORT',signature:'INSERTION-SORT(A, n)',page:18,
    lines:[
     {n:1,code:'for i = 2 to n',zh:'逐张插牌。'},
     {n:2,code:'    key = A[i]',zh:'取出当前牌。'},
     {n:3,code:'    // Insert A[i] into the sorted subarray A[1 : i − 1].',zh:'注释。'},
     {n:4,code:'    j = i − 1',zh:'从左段最右开始。'},
     {n:5,code:'    while j > 0 and A[j] > key',zh:'★ **这里是一次元素比较**。n = 3 时整棵决策树由第 5 行的比较构成：内部结点 1:2 / 2:3 / 1:3 全部来自它。'},
     {n:6,code:'        A[j + 1] = A[j]',zh:'右移。决策树模型**忽略**这一步（"data movement … ignored"）。'},
     {n:7,code:'        j = j − 1',zh:'左移指针。同样被忽略。'},
     {n:8,code:'    A[j + 1] = key',zh:'落位。同样被忽略。'},
    ],
    vars:[{name:'h',meaning:'决策树高度 = 最坏情况下第 5 行比较的执行次数'}],
    note:'★ 决策树只数比较：插入排序最坏比较次数 = $\\Theta(n^2)$，对应它那棵特别歪的决策树；归并排序的树更接近满，高度 $\\lg n!$。'},
   {type:'visualize',title:'看见"叶子必须装下 n! 种排列"',
    panels:[
     {title:'① 三元素插入排序的决策树（原书 Figure 8.1）',
      viz:'tree',vizMode:'tree',
      trees:TREE81,treeNotes:NOTES81},
     {title:'② 树高下界：lg n! 与 ⌈lg n!⌉ 随 n 增长',
      viz:'growth',
      chart:{xMax:64,series:[
       {name:'lg n!（Stirling）',expr:'n * Math.log2(n) - n / Math.LN2',color:'--viz-done'},
       {name:'n lg n / 2',expr:'n * Math.log2(n) / 2',color:'--viz-compare'},
       {name:'n（线性，作对照）',expr:'n',color:'--viz-violation'},
      ]},
      note:'★ $\\lg n!$ 与 $n\\lg n$ 只差一个常数因子（1 对 1），与线性 $n$ 差一个 $\\lg n$ 因子 —— 下界是实打实的。'},
    ],
    tasks:[
     '面板 ① 数叶子：3! = 6 个排列，一个不少。',
     '面板 ① 走一遍高亮路径 ⟨6,8,5⟩：左、右、右 → 叶 ⟨3,1,2⟩。',
     '面板 ② 对 n = 8：$\\lg 8! \\approx 15.3$，所以任何比较排序最坏至少要 **16** 次比较（8.1-1 也要用到这个思路）。',
    ],
    note:'★ 树高 $h$ 与叶子数 $l$：二叉树高度 $h$ 最多 $2^h$ 个叶子 → $n! \\le 2^h$ → $h \\ge \\lg n!$。'},
   {type:'code',title:'实测：lg(n!) = Θ(n lg n) 的数值验证',
    intro:'本关没有新算法，但下界的每一步都可以数值验证。`c/lower_bounds.c` 验证 Stirling 近似的精度与比值的收敛。',
    pseudocodeRef:'INSERTION-SORT',
    c:{file:'lower_bounds.c',code:String.raw`/* lower_bounds.c -- 8.1 节决策树下界 Ω(n lg n) 的数值验证。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o lower_bounds lower_bounds.c -lm
 */
#include <assert.h>
#include <math.h>
#include <stdio.h>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

/* lg(n!) 逐项计算 */
static double lg_factorial_exact(int n)
{
    double s = 0;
    for (int k = 2; k <= n; k++) s += log2((double)k);
    return s;
}

/* lg(n!) 的 Stirling 近似：n lg n − n lg e + 0.5 lg(2πn) */
static double lg_factorial_stirling(int n)
{
    return n * log2((double)n) - n / log(2.0) + 0.5 * log2(2.0 * M_PI * (double)n);
}

int main(void)
{
    /* 1. Stirling 近似与逐项计算的偏差 < 1（n = 2..1000） */
    for (int n = 2; n <= 1000; n++) {
        assert(fabs(lg_factorial_exact(n) - lg_factorial_stirling(n)) < 1.0);
    }
    printf("part 1: n = 2..1000 的 lg(n!) Stirling 近似偏差全部 < 1\n");

    /* 2. lg(n!) = Θ(n lg n)：比值随 n 增大趋近 1 */
    printf("part 2: lg(n!) / (n lg n) 随 n 的变化：\n");
    double prev = 0;
    for (int n = 10; n <= 100000; n *= 10) {
        double ratio = lg_factorial_exact(n) / ((double)n * log2((double)n));
        printf("        n = %6d：ratio = %.4f\n", n, ratio);
        /* 单调趋近 1（从下方）；lg(n!)/(n lg n) = 1 − lg e/lg n + O(lg n/n)，
         * 收敛较慢：n = 10^4 时 ≈ 0.89，n = 10^5 时 ≈ 0.91 */
        if (prev > 0) { assert(ratio > prev); }
        if (n >= 100000) { assert(ratio > 0.9 && ratio < 1.0); }
        prev = ratio;
    }

    /* 3. 决策树叶子数：n! 个叶子的高度 h 满足 2^h ≥ n!，即 h ≥ lg(n!) */
    for (int n = 2; n <= 20; n++) {
        double h_min = lg_factorial_exact(n);
        /* 最坏情况比较次数 = ⌈lg(n!)⌉，必须 ≥ lg n（否则连前几个元素都分不开） */
        assert(ceil(h_min) >= log2((double)n));
    }
    printf("part 3: 决策树最低高度 ≥ lg(n!) = Θ(n lg n)（Theorem 8.1 的下界）\n");

    /* 4. 具体例子：n = 8 时 lg(8!) = 15.3，⌈⌉ = 16 —— 8! = 40320 个排列 */
    {
        double h = lg_factorial_exact(8);
        printf("part 4: n = 8：lg(8!) = %.2f，⌈⌉ = %d（8! = 40320 个叶子）\n",
               h, (int)ceil(h));
        assert(h > 15.0 && h < 16.0);
    }

    puts("all checks passed.");
    return 0;
}
`,
       notes:[{line:11,zh:'`lg_factorial_exact`：逐项计算 $\\lg n! = \\sum_{k=2}^n \\lg k$ —— 这是"精确"参照。'},
              {line:18,zh:'`lg_factorial_stirling`：$n\\lg n - n\\lg e + \\frac12\\lg(2\\pi n)$ —— 只用前三项。'},
              {line:38,zh:'★ part 1：n = 2..1000 三项近似的偏差全部 < 1 —— `$\\lg n! = n\\lg n - n\\lg e + \\Theta(\\lg n)$` 的"$\\Theta(\\lg n)$ 振幅"确实很小。'},
              {line:46,zh:'★ part 2：$\\lg n!/(n\\lg n)$ 单调趋近 1（n = 10⁵ 时 0.913）—— 收敛慢但方向明确，这就是 $\\Theta(n\\lg n)$。'},
              {line:55,zh:'part 3：决策树高度下界逐点成立。'}],
       tests:[{in:'n = 2..1000',out:'Stirling 三项近似偏差 < 1'},
              {in:'n = 10..100000',out:'lg(n!)/(n lg n) 单调上升趋于 1'},
              {in:'n = 8',out:'lg(8!) = 15.30，⌈⌉ = 16 次比较'}]},
    mapping:[{pc:5,pcCode:'while j > 0 and A[j] > key',c:'决策树内部结点就来自这一行（2.1 的 C 实现在第 2 章）'}]},
   {type:'analyze',title:'Theorem 8.1 的推导链：三行不等式',
    intro:'整个证明只有三行，每行都是前面用过的工具。这是全书"性价比"最高的定理之一。',
    claims:[
     {expr:'n! \\le l',when:'正确性：n! 种排列都是可达叶子（l = 可达叶子数）',page:207,source:'book'},
     {expr:'l \\le 2^h',when:'二叉树组合：高度 h 的二叉树最多 2^h 个叶子',page:207,source:'book'},
     {expr:'h \\ge \\lg n! = \\Theta(n\\lg n)',when:'取对数 + Stirling',page:207,source:'book'},
     {expr:'O(n \\lg n)',when:'堆排序与归并排序的最坏上界 → 与下界同阶 → 渐近最优',page:207,source:'book'},
    ],
    tables:[{caption:'比较排序 vs 线性时间排序',rows:[
      ['','比较排序（2–7 章）','8.2–8.4 的线性排序'],
      ['顺序信息来源','元素间的比较','下标索引 / 逐位 / 桶'],
      ['最坏运行时间','$\\Omega(n\\lg n)$ 下界','特定输入上 $O(n+k)$ 等'],
      ['下界适用？','**适用**','**不适用**（不做比较）'],
    ]},
     {caption:'三个算法在决策树模型下的成绩单',rows:[
      ['算法','最坏比较次数','决策树形状'],
      ['插入排序','$\\Theta(n^2)$','又歪又深（Figure 8.1 的放大版）'],
      ['快排（最坏）','$\\Theta(n^2)$','每次只切出一个空侧 → 链'],
      ['归并 / 堆排','$\\Theta(n\\lg n)$','接近满二叉树 → 高度 $\\lceil\\lg n!\\rceil$'],
     ]}],
    chart:{xMax:64,series:[
     {name:'lg n!',expr:'n * Math.log2(n) - n / Math.LN2',color:'--viz-done'},
     {name:'n lg n（上界形状）',expr:'n * Math.log2(n)',color:'--viz-compare'},
     {name:'n²/2（歪树的代价）',expr:'n * n / 2',color:'--viz-violation'},
    ]},
    derivations:[
     {kind:'summation',title:'Theorem 8.1 的三行证明',steps:[
      {tex:'n! \\le l \\le 2^h',zh:'正确性给左半（$n!$ 种排列都是叶子），二叉树组合给右半。'},
      {tex:'h \\ge \\lg(n!)',zh:'两边取对数（lg 单调递增）。'},
      {tex:'\\lg n! = \\Theta(n\\lg n)',zh:'Stirling 近似（C 程序数值验证过）：$\\lg n! = n\\lg n - n\\lg e + \\Theta(\\lg n)$。'}]},
     {kind:'summation',title:'为什么"比较相等"类测试帮不上忙',steps:[
      {zh:'书里先做了两个无害化假设：① 元素互异（下界对相等情况更成立）；② 只用 $a_i \\le a_j$ 形式的比较。'},
      {tex:'a_i = a_j \\Rightarrow \\text{三路分支？}',zh:'即使允许三路比较（<, =, >），每次分支最多 3 叉，$h \\ge \\log_3 n!$ —— 仍差个常数因子，$\\Theta(n\\lg n)$ 不变。'}]},
    ],
    note:'★ 中心图：红线（歪树 $n^2/2$）与绿线（$\\lg n!$）的差距就是"会不会组织比较"的差距；绿线与蓝线（$n\\lg n$）永远只差常数 —— 这就是"渐近最优"的图形含义。'},
   {type:'prove',title:'Theorem 8.1：任何比较排序最坏 Ω(n lg n)',
    statement:'Any comparison sort algorithm requires Ω(n lg n) comparisons in the worst case.',
    page:207,
    intro:'★ 原书证明一气呵成，这里拆成三步。注意它证的是"比较次数"这个下界，运行时间下界随之而来。',
    steps:[
     {title:'第一步 · 决策树的高度就是最坏比较次数',
      en:'The length of the longest simple path from the root of a decision tree to any of its reachable leaves represents the worst-case number of comparisons that the corresponding sorting algorithm performs. Consequently, the worst-case number of comparisons for a given comparison sort algorithm equals the height of its decision tree.',page:207,
      body:['决策树完整刻画了一个比较排序在规模 $n$ 的**所有可能执行**：一次执行 = 从根到叶的一条路径。',
        '最坏情况 = 最长路径 = **树高 $h$**。于是"证最坏比较次数下界"变成"证所有合法决策树的高度下界"。']},
     {title:'第二步 · 叶子数约束：n! ≤ l ≤ 2^h',
      en:'Proof From the preceding discussion, it suffices to determine the height of a decision tree in which each permutation appears as a reachable leaf. Consider a decision tree of height h with l reachable leaves corresponding to a comparison sort on n elements. Because each of the n! permutations of the input appears as one or more leaves, we have n! ≤ l . Since a binary tree of height h has no more than 2 h leaves, we have n! ≤ l ≤ 2 h ; which, by taking logarithms, implies h ≥ lg.n!/ (since the lg function is monotonically increasing)',page:207,
      body:['**左边**：正确性 → $n!$ 种排列每种至少一个可达叶子 → $n! \\le l$。',
        '**右边**：高度 $h$ 的（满）二叉树最多 $2^h$ 个叶子 → $l \\le 2^h$。',
        '合并取对数：$h \\ge \\lg n!$。★ 注意是"高度**至少**"—— 没有任何一棵合法决策树能更矮。']},
     {title:'第三步 · Stirling 收尾',
      en:'Heapsort and merge sort are asymptotically optimal comparison sorts.',
      body:['$\\lg n! = n\\lg n - n\\lg e + \\Theta(\\lg n) = \\Theta(n\\lg n)$（Stirling 近似；本关 C 程序验证了其精度）。',
        '所以 $h = \\Omega(n\\lg n)$：**任何**比较排序最坏要做 $\\Omega(n\\lg n)$ 次比较。',
        '**Corollary**：堆排序与归并排序的最坏 $O(n\\lg n)$ 上界贴住了下界 → **渐近最优**。快排不在此列（最坏 $n^2$），但 7.4 证明了它的**期望** $O(n\\lg n)$。']},
    ],
    conclusion:'★ 结论：$n! \\le l \\le 2^h \\Rightarrow h \\ge \\lg n! = \\Theta(n\\lg n)$。比较排序的天花板就是 $\\Theta(n\\lg n)$，归并与堆排已经贴住它。想更快？换模型 —— 8.2 开始不做比较。',
    note:''},
   {type:'drill',title:'检验一下',
    items:[
     {kind:'single',q:'比较排序的决策树中，一次执行对应什么？',
      options:['整棵树','从根到某个叶子的路径','从根到最深叶子的路径','所有叶子'],answer:1,
      why:'★ 一次具体执行 = 沿着实际发生的比较走出的**一条根到叶路径**。最长的那条才对应最坏情况。'},
     {kind:'single',q:'决策树的高度对应算法的什么量？',
      options:['平均比较次数','最好情况比较次数','最坏情况比较次数','空间使用'],answer:2,
      why:'★ 树高 = 最长根叶路径 = 最坏情况比较次数（原书 p.207）。'},
     {kind:'single',q:'为什么决策树必须至少有 n! 个（可达）叶子？',
      options:['因为决策树必须是一棵满二叉树，叶子只能出现在最底层','因为 n! 种输入排列都必须能被正确排序','因为每次比较产生 n! 种结果','因为叶子代表数组元素'],answer:1,
      why:'★ 正确性要求：$n!$ 种排列中的任何一种都可能作为输入，都必须对应某个可达叶子。'},
     {kind:'single',q:'n = 8 时，任何比较排序最坏情况至少要做多少次比较？（⌈lg 8!⌉）',
      options:['8','12','16','64'],answer:2,
      why:'★ $\\lg 8! = \\lg 40320 \\approx 15.30$，取上整 = **16**。本关 C 程序 part 4 验证了这个数。'},
     {kind:'judge',q:'Ω(n lg n) 下界对计数排序同样成立。',answer:false,
      why:'★ 原书 p.205 明确说：计数/基数/桶排序"使用比较以外的操作确定顺序"，**下界对它们不适用**。这正是它们能线性时间的根本原因。'},
     {kind:'simulate',q:'3 个元素的决策树（Figure 8.1）至少要几个叶子？填整数。',expect:[6],placeholder:'例如：6',
      why:'3! = 6 种排列，每种都要一个可达叶子。'},
    ],
    bookExercises:[
     {id:'8.1-1',page:208,star:0,statement:'What is the smallest possible depth of a leaf in a decision tree for a comparison sort?',hint:'答案是 $n-1$，但理由不是「每个元素都得参与一次比较」—— 一次比较能同时覆盖两个元素， 那条只能推出 $\\lceil n/2 \\rceil$。正确的前提是**连通**：叶子处的比较结果要能确定唯一的全序， 把「$a$ 与 $b$ 比过」看成边，这张图必须连通（两不连通的分支之间没有任何比较，就无法定序）， 而连通图至少 $n-1$ 条边。$n-1$ 也够用：**存在**一条深度 $n-1$ 的叶 —— 沿「$a_1<a_2<a_3<\\cdots<a_n$」这条分支，依次比较 $a_1:a_2, a_2:a_3, \\dots, a_{n-1}:a_n$ 就够了（这条路径上的结果确实唯一确定了全序）。★ 这只证「存在一条」；不等于说随便 $n-1$ 次比较都能排序（$n=3$ 时 $a_1<a_2$ 且 $a_2>a_3$ 就定不了序）。'},
     {id:'8.1-2',page:208,star:0,statement:'Obtain asymptotically tight bounds on lg.n!/ without using Stirling’s approximation. Instead, evaluate the summation P n kD1 lg k using techniques from Section A.2.',hint:'上界：$\\lg k \\le \\lg n$，和 $\\le n\\lg n$。下界：只取后半 $k \\ge \\lceil n/2\\rceil$ 的项，每项 $\\ge \\lg(n/2)$，和 $\\ge (n/2)\\lg(n/2) = \\Omega(n\\lg n)$。'},
     {id:'8.1-3',page:208,star:0,statement:'Show that there is no comparison sort whose running time is linear for at least half of the n! inputs of length n. What about a fraction of 1/n of the inputs of length n? What about a fraction 1/2 n ?',hint:'三问都要答，第三问才是这道题的锋芒。 决策树高度 $O(n)$ 时叶子至多 $2^{cn}$ 个， 而「线性时间搞定的输入」必须是不同的叶子，所以要 线性处理的输入数 $\\le 2^{cn}$。 一半：$n!/2 \\gg 2^{cn}$，不行； $1/n$：$n!/n$ 仍然远超，不行； $1/2^n$：需要 $n!/2^n$ 个叶子，取对数得 $\\lg(n!/2^n) = n\\lg n - \\Theta(n)$， 比任何 $cn$ 都大（$\\lg n$ 无界），所以**也不行**。 三问是同一个机关：需要的叶子数只要还是 $2^{\\Theta(n\\lg n)}$ 量级，常数底数的 $2^{cn}$ 就装不下。'},
     {id:'8.1-4',page:208,star:0,statement:'You are given an n-element input sequence, and you know in advance that it is partly sorted in the following sense. Each element initially in position i such that i mod 4 = 0 is either already in its correct position, or it is one place away from its correct position. For example, you know that after sorting, the element initially in position 12 belongs in position 11, 12, or 13. You have no advance information about the other elements, in positions i where i mod 4 ≠ 0. Show that an Ω(n lg n) lower bound on comparison-based sorting still holds in this case.',hint:'每 4 个元素中有 3 个（i mod 4 ≠ 0 的那些）完全没有任何先验信息。把这 $3n/4$ 个"自由"元素挑出来：它们自己的相对顺序仍有 $(3n/4)!$ 种可能 → 决策树叶子仍需 $(3n/4)!$ 个 → 高度 $\\Omega(n\\lg n)$。'},
    ]},
  ],
};
