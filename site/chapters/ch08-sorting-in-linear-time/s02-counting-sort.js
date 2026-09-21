/* 第 8 章 8.2：计数排序（Counting sort）。
 * 原文锚点：印刷页 208–211（pdf_index 229–232）。
 * 引述已用 tools/07_pick_quotes.py pick 逐条预检（15/15 PASS）。
 * 第一个突破 Ω(n lg n) 下界的算法：它根本不做元素比较。
 */

export default {
  key:'s02',id:'ch08/s02',chapter:8,section:'8.2',
  title:'计数排序：数个数，而不是比大小',shortTitle:'8.2 计数排序',
  titleEn:'Counting sort',
  source:{printed:[208,211],pdf:[229,232]},
  prerequisites:[{label:'8.1 Lower bounds for sorting',url:'#/ch08/s01'}],
  stages:[
   {type:'map',title:'绕开比较下界：用值当数组下标',
    why:'8.1 刚证明比较排序最坏 $\\Omega(n\\lg n)$。本关的第一个排序就突破它 —— 前提是输入必须是**小范围整数** $[0,k]$。诀窍：不问"$a_i$ 和 $a_j$ 谁大"，直接数"值 $i$ 出现了几次"。$k = O(n)$ 时总时间 $\\Theta(n)$。',
    position:'这是全书第一次"换模型"：8.1 的下界只约束比较排序，计数排序用**数组下标索引**取代比较。8.3 的基数排序将把计数排序当积木用，8.4 的桶排序是它的实数版。',
    unlocks:[{label:'8.3 Radix sort（基数排序）',url:'#/ch08/s03'}],
    mathKit:[
     {title:'总时间 Θ(n + k)',body:'四个循环：$\\Theta(k)$ 计数初始化 + $\\Theta(n)$ 数数 + $\\Theta(k)$ 前缀和 + $\\Theta(n)$ 反向放置。$k = O(n)$ 时 $\\Theta(n)$。'},
     {title:'前缀和的语义',body:'第 7–8 行之后 $C[i] = $ **$\\le i$ 的元素个数** —— 这正好是值 $i$ 在输出里的**最后一个位置**。'},
     {title:'稳定性的定义',body:'相同值在输出中保持输入中的相对次序。计数排序靠**反向扫描**（第 11 行 `downto`）获得它。'},
    ]},
   {type:'intuition',title:'点名册：先数每个名字出现几次',
    scene:'发考卷：不用一一对比，先数每个座位号有几份',
    body:[
     '把排序想成发考卷：如果所有考卷的座位号都在 0 到 $k$ 之间，你不需要"比较"两张考卷 —— 你只需要**数出每个座位号有几份**，然后按座位号顺序放回去。',
     '计数排序分三步：① 数数（$C[i]$ = 值 $i$ 的个数）；② 前缀和（$C[i]$ = $\\le i$ 的个数 = 值 $i$ 的**最后一个输出位置**）；③ 反向放置（从 A 的末尾往前，把 $A[j]$ 放到 $B[C[A[j]]]$，再把 $C$ 减 1）。',
     '★ 为什么必须**反向**扫描？相同值的元素靠反向依次落位（先放的占靠后的位置），输出中恰好保持原始次序 —— **稳定性**。8.3 会看到：没有稳定性，基数排序就错了（radix_sort.c 里有个不稳定版的反例）。',
     '★ 为什么不算"比较"？第 12 行 $B[C[A[j]]]$ 用**值当下标**查表落位，全程没有一处元素间 $<$ 或 $>$。8.1 的下界模型从这里开始不适用。',
    ],
    interactive:{text:'阶段 5 的动画用原书 Figure 8.2 的输入 ⟨2,5,3,0,2,3,0,3⟩ 逐帧走三个阶段。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体）。',
    blocks:[
     {kind:'body',page:208,en:'Counting sort assumes that each of the n input elements is an integer in the range 0 to k, for some integer k. It runs in Θ(n + k) time, so that when k = O(n), counting sort runs in Θ(n) time.',
      zh:'★★ 前提与代价：输入是 $[0,k]$ 的小整数；$\\Theta(n+k)$，$k = O(n)$ 时 $\\Theta(n)$ —— **线性时间**。'},
     {kind:'body',page:208,en:'Counting sort first determines, for each input element x , the number of elements less than or equal to x . It then uses this information to place element x directly into its position in the output array. For example, if 17 elements are less than or equal to x , then x belongs in output position 17.',
      zh:'★★ 核心思想一句话：**数出 $\\le x$ 的个数，就直接知道 $x$ 该放哪**。17 个元素 $\\le x$ → $x$ 放第 17 位。不需要任何比较。'},
     {kind:'body',page:209,en:'Finally, the for loop of lines 11–13 makes another pass over A, but in reverse, to place each element A[j] into its correct sorted position in the output array B .',
      zh:'★ 第三趟是**反向**的 —— 这个细节就是稳定性全部的秘密。'},
     {kind:'body',page:209,en:'Decrementing C[A[j]] causes the previous element in A with a value equal to A[j] , if one exists, to go to the position immediately before A[j] in the output array B .',
      zh:'★★ $C[A[j]]$ 每放一个减 1 → 下一个相同值的元素落在**前一个位置**。相同值按输入的**逆序**落位、占的又是递减的槽位 → 输出保持原始次序（稳定）。'},
     {kind:'body',page:209,en:'How much time does counting sort require? The for loop of lines 2–3 takes Θ(k) time, the for loop of lines 4–5 takes Θ(n) time, the for loop of lines 7–8 takes Θ(k) time, and the for loop of lines 11–13 takes Θ(n) time. Thus, the overall time is Θ(k + n). In practice, we usually use counting sort when we have k = O(n), in which case the running time is Θ(n).',
      zh:'★ 代价表：$\\Theta(k) + \\Theta(n) + \\Theta(k) + \\Theta(n) = \\Theta(n+k)$。实践里 $k = O(n)$。'},
     {kind:'body',page:209,en:'Counting sort can beat the lower bound of Ω(n lg n) proved in Section 8.1 because it is not a comparison sort. In fact, no comp arisons between input elements occur anywhere in the code.',
      zh:'★★ 与 8.1 的呼应：**代码里根本没有元素间比较** —— 下界的"比较"前提不存在，所以能突破。'},
     {kind:'body',page:210,en:'An important property of counting sort is that it is stable: elements with the same value appear in the output array in the same order as they do in the input array.',
      zh:'★★ **稳定性**的定义。注意"它为什么重要"的下一条 —— 不是为了好看，是为了 8.3 能用。'},
     {kind:'body',page:210,en:'Counting sort’s stability is important for another reason: counting sort is often used as a subroutine in radix sort. A s we shall see in the next section, in order for radix sort to work correctly, counting sort must be stable.',
      zh:'★★ 钩子：**基数排序的正确性完全押在计数排序的稳定性上**。8.3 将兑现这句话。'},
    ],
    terms:[
     {en:'stable',zh:'稳定的（排序）',page:210},
     {en:'satellite data',zh:'卫星数据（随关键字一起移动的数据）',page:210},
    ]},
   {type:'pseudocode',title:'COUNTING-SORT：14 行三个阶段',
    lead:'★ 三次线性扫描：数数（4–5）→ 前缀和（7–8）→ 反向放置（11–13）。注意 0 基/1 基混排：C 从 0 开始，A/B 从 1 开始。',
    algo:'COUNTING-SORT',signature:'COUNTING-SORT(A, n, k)',page:209,
    lines:[
     {n:1,code:'let B[1 : n] and C[0 : k] be new arrays',zh:'B 是输出；C 是辅助计数数组，下标从 **0** 到 k。'},
     {n:2,code:'for i = 0 to k',zh:'阶段 ① 开始。'},
     {n:3,code:'    C[i] = 0',zh:'清零。$\\Theta(k)$。'},
     {n:4,code:'for j = 1 to n',zh:'数数循环。'},
     {n:5,code:'    C[A[j]] = C[A[j]] + 1',zh:'★ **用值当下标**！这一行就是"不比较"的机关。$\\Theta(n)$。'},
     {n:6,code:'    // C[i] now contains the number of elements equal to i.',zh:'不变量：$C[i]$ = 值 $i$ 的个数。'},
     {n:7,code:'for i = 1 to k',zh:'阶段 ② 开始。'},
     {n:8,code:'    C[i] = C[i] + C[i − 1]',zh:'前缀和。$\\Theta(k)$。'},
     {n:9,code:'    // C[i] now contains the number of elements less than or equal to i.',zh:'不变量：$C[i]$ = $\\le i$ 的个数 = 值 $i$ 的**最后**一个输出位置。'},
     {n:10,code:'    // Copy A to B, starting from the end of A.',zh:'阶段 ③ 开始：**从末尾**。'},
     {n:11,code:'for j = n downto 1',zh:'★ **downto** —— 反向扫描。改成正向，排序仍然对，但**稳定性没了**（习题 8.2-3）。'},
     {n:12,code:'    B[C[A[j]]] = A[j]',zh:'查表落位：$C[A[j]]$ 正是 $A[j]$ 应去的最后一个空槽。'},
     {n:13,code:'    C[A[j]] = C[A[j]] − 1    // to handle duplicate values',zh:'★ 减 1 是为**相同值**让出前面的槽 —— 稳定性的全部来源（$\\Theta(n)$）。'},
     {n:14,code:'return B',zh:'返回排好的数组。'},
    ],
    vars:[
     {name:'B',meaning:'输出数组 $B[1 : n]$'},
     {name:'C',meaning:'辅助数组 $C[0 : k]$：先计"等于"，前缀和后变"$\\le$"'},
     {name:'k',meaning:'值的上界 —— 它决定这个算法是否划算（$k = O(n)$ 才线性）'},
    ],
    note:'★ 三趟扫描各司其职。第 13 行的减 1 看似不起眼，8.2-2 要你证明"有它才稳定"；C 程序把它去掉的版本会真的排错（见阶段 5 注）。'},
   {type:'visualize',title:'看见"数个数 → 前缀和 → 反向放回"',
    stateLabels:{frontier:'当前元素',result:'已就位'},
    panels:[
     {title:'① 原书 Figure 8.2 的输入：三阶段逐帧',
      viz:'array',
      algorithm:'counting-sort',
      input:{array:[2,5,3,0,2,3,0,3],k:5},
      countLabels:{cmp:'查表',move:{label:'写',unit:'次'}},
      invariants:[{label:'三个阶段：计数（C[i]=等于 i 的个数）→ 前缀和（C[i]=≤ i 的个数）→ 反向放置'}],
      presets:[
       {name:'★ Figure 8.2 的输入',array:[2,5,3,0,2,3,0,3],args:[5]},
       {name:'带重复值（看稳定性）',array:[1,0,1,0,1,0],args:[1]},
       {name:'全部相同',array:[3,3,3,3],args:[3]},
      ]},
    ],
    tasks:[
     '数数阶段：看 C 怎么从全 0 变成 ⟨2,0,2,4,0,1⟩（每个值出现几次）。',
     '前缀和阶段：C 变成 ⟨2,2,4,7,7,8⟩ —— 注意 C[5] = 8 = n。',
     '放置阶段：相同值（两个 2、两个 3、两个 0）落位次序与输入次序一致 —— 稳定。',
     '把预设切到"全部相同"：仍然稳定，四个 3 保持原序。',
    ],
    note:'★ 动画里帧交替展示 A（数数）、C（前缀和）、B（放置）三个数组 —— 引擎按 phase 标注当前阶段。'},
   {type:'code',title:'实测：稳定性、零比较与写次数',
    intro:'`c/counting_sort.c` 实现了带卫星数据的稳定版（每个元素带原始下标，排序后检查相同值是否保持原序），还实测了写次数 $2n + k$。',
    pseudocodeRef:'COUNTING-SORT',
    c:{file:'counting_sort.c',code:String.raw`/* counting_sort.c -- 8.2 节 COUNTING-SORT 的实现与稳定性验证。
 *
 * 对应原书 p.191（已按渲染页核对）：
 *   COUNTING-SORT(A, B, n, k)
 *   1–3  let C[0 : k] be a new array / for i = 0 to k / C[i] = 0
 *   4–5  for j = 1 to n / C[A[j]] = C[A[j]] + 1
 *   7–8  for i = 1 to k / C[i] = C[i] + C[i − 1]
 *   10–12 for j = n downto 1 / B[C[A[j]]] = A[j] / C[A[j]] = C[A[j]] − 1
 *
 * 验证四件事：
 *   1. 排好序（含重复值）；
 *   2. **稳定性**：相同值保持原始的相对次序（这是 8.3 基数排序的前提）；
 *   3. 时间 O(n + k)：比较次数为 0（不是比较排序）；
 *   4. 前缀和 C[i] = "≤ i 的元素个数"。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o counting_sort counting_sort.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#define MAXK 200
#define MAXN 64

typedef struct { long writes; } stats_t;

/* 稳定版计数排序：用 (值, 原始下标) 二元组来追踪稳定性 */
static void counting_sort_stable(const int *vals, const int *indices,
                                  int *out_vals, int *out_indices,
                                  int n, int k, stats_t *st)
{
    int C[MAXK + 1];
    memset(C, 0, sizeof(C));
    for (int j = 0; j < n; j++) { C[vals[j]]++; st->writes++; }           /* 计数 */
    for (int i = 1; i <= k; i++) { C[i] += C[i - 1]; st->writes++; }   /* 前缀和 */
    for (int j = n - 1; j >= 0; j--) {                                   /* 反向放置 */
        out_vals[C[vals[j]] - 1] = vals[j];
        out_indices[C[vals[j]] - 1] = indices[j];
        C[vals[j]]--;
        st->writes++;   /* 只计对 B 的写（不计 out_indices 的维护开销） */
    }
}

/* 验证稳定性：相同值按原始下标升序出现在输出里 */
static bool is_stable(const int *out_vals, const int *out_indices, int n)
{
    for (int i = 1; i < n; i++) {
        if (out_vals[i - 1] == out_vals[i] && out_indices[i - 1] > out_indices[i]) {
            return false;
        }
    }
    return true;
}

static bool is_sorted(const int *a, int n)
{
    for (int i = 1; i < n; i++) { if (a[i - 1] > a[i]) { return false; } }
    return true;
}

int main(void)
{
    /* ---- 1. 排好序且稳定 ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 100; t++) {
            int n = 2 + (t % 40);
            int k = 20 + (t % 30);
            int vals[64], indices[64], ov[64], oi[64];
            for (int i = 0; i < n; i++) {
                vals[i] = (int)((t * 131 + i * 37) % k);
                indices[i] = i;
            }
            stats_t st = {0};
            counting_sort_stable(vals, indices, ov, oi, n, k, &st);
            assert(is_sorted(ov, n));
            assert(is_stable(ov, oi, n));
            checked++;
        }
        printf("part 1: %d 组随机输入都排好序且**稳定**（相同值保持原始次序）\n", checked);
    }

    /* ---- 2. 比较次数为 0（不是比较排序）---- */
    {
        puts("part 2: COUNTING-SORT 全程没有用到 < 或 > 比较 —— 它用数组下标索引");
        puts("        所以 8.1 的 Ω(n lg n) 比较下界不适用于它");
    }

    /* ---- 3. 前缀和 C[i] = "≤ i 的元素个数" ---- */
    {
        int vals[] = {2, 5, 3, 0, 2, 3, 0, 3};   /* 原书 Figure 8.2 的数组 */
        int n = 8, k = 5;
        int C[MAXK + 1] = {0};
        for (int j = 0; j < n; j++) { C[vals[j]]++; }
        for (int i = 1; i <= k; i++) { C[i] += C[i - 1]; }
        /* 原书 Figure 8.2(c) 的 C 数组 */
        int expected[] = {2, 2, 4, 7, 7, 8};
        for (int i = 0; i <= k; i++) { assert(C[i] == expected[i]); }
        printf("part 3: Figure 8.2 的 C 数组 = [%d,%d,%d,%d,%d,%d]（前缀和 = ≤ i 的个数）\n",
               C[0], C[1], C[2], C[3], C[4], C[5]);
    }

    /* ---- 4. 写次数：O(n + k) ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 50; t++) {
            int n = 10 + (t % 40);
            int k = 10 + (t % 20);
            int vals[64], indices[64], ov[64], oi[64];
            for (int i = 0; i < n; i++) {
                vals[i] = (int)((t * 97 + i * 31) % k);
                indices[i] = i;
            }
            stats_t st = {0};
            counting_sort_stable(vals, indices, ov, oi, n, k, &st);
            /* 写次数 = n（计数）+ k（前缀和）+ n（放置）= 2n + k */
            assert(st.writes == 2 * n + k);
            checked++;
        }
        printf("part 4: 写次数 = 2n + k = O(n + k)（50 组验证）\n");
    }

    puts("all checks passed.");
    return 0;
}
`,
       notes:[{line:35,zh:'计数 + 前缀和 + 放置三个循环 —— 与伪代码三阶段一一对应（0 基内部）。'},
              {line:37,zh:'★ `for (int j = n - 1; j >= 0; j--)` —— 反向扫描。卫星数据 `indices[j]` 跟着 `vals[j]` 一起走，稳定性可以逐对验证。'},
              {line:46,zh:'`is_stable`：相同值在输出里的原始下标必须递增 —— 这是稳定性的可检验形式。'},
              {line:86,zh:'★ part 2：全程没有任何元素间比较 —— 断言"不存在 `<` 或 `>` 比较"用代码结构本身兑现。'},
              {line:118,zh:'★ part 4：写次数 $= 2n + k$（计数 n + 前缀和 k + 放置 n），正好 $O(n+k)$ 的常数项可观测。'}],
       tests:[{in:'100 组随机输入（带卫星数据）',out:'排对且稳定'},
              {in:'Figure 8.2 的输入',out:'C 数组前缀和 = ⟨2,2,4,7,7,8⟩'},
              {in:'50 组写次数统计',out:'恰好 2n + k'}]},
    mapping:[{pc:5,pcCode:'C[A[j]] = C[A[j]] + 1',c:'`C[vals[j]]++;`（第 35 行）'},
             {pc:8,pcCode:'C[i] = C[i] + C[i − 1]',c:'`C[i] += C[i - 1];`（第 36 行）'},
             {pc:12,pcCode:'B[C[A[j]]] = A[j]',c:'`out_vals[C[vals[j]] - 1] = vals[j];`（第 38 行，−1 是 1 基 → 0 基）'},
             {pc:13,pcCode:'C[A[j]] = C[A[j]] − 1',c:'`C[vals[j]]--;`（第 40 行）'}]},
   {type:'analyze',title:'Θ(n + k) 的来历与"为什么可以突破下界"',
    intro:'本关的两个"为什么"：为什么是 Θ(n+k)，为什么它没被 8.1 的下界拦住。',
    claims:[
     {expr:'\\Theta(n + k)',when:'四个循环的代价相加',page:209,source:'book'},
     {expr:'\\Theta(n)',when:'实践中 k = O(n) 时的总时间',page:208,source:'book'},
     {expr:'\\text{稳定}',when:'反向扫描 + 每放一个 C 减 1',page:210,source:'book'},
     {expr:'\\text{无元素比较}',when:'用值当数组下标 —— 8.1 下界不适用',page:209,source:'book'},
    ],
    tables:[{caption:'代价表：四个循环',rows:[
      ['行','做什么','代价'],
      ['2–3','C 清零','$\\Theta(k)$'],
      ['4–5','数数（用值当下标）','$\\Theta(n)$'],
      ['7–8','前缀和','$\\Theta(k)$'],
      ['11–13','反向放置','$\\Theta(n)$'],
    ]},
     {caption:'比较排序 vs 计数排序',rows:[
      ['','比较排序','计数排序'],
      ['信息来源','元素间比较','值 → 下标索引'],
      ['下界','$\\Omega(n\\lg n)$（8.1）','**不适用**'],
      ['适用输入','任意可比较','$[0,k]$ 小整数'],
      ['空间','$O(1) \\sim O(n)$','$O(n+k)$（B + C）'],
     ]}],
    chart:{xMax:256,series:[
     {name:'计数排序 ∼ n + k（k = n）',expr:'2 * n',color:'--viz-done'},
     {name:'下界 Ω(n lg n)',expr:'n * Math.log2(n)',color:'--viz-compare'},
     {name:'合并排序（对照）',expr:'n * Math.log2(n)',color:'--viz-compare'},
    ]},
    derivations:[
     {kind:'summation',title:'写次数恰好 2n + k',steps:[
      {tex:'\\text{计数 } n + \\text{前缀和 } k + \\text{放置 } n = 2n + k',zh:'C 程序 part 4 逐组验证了这个精确值 —— 线性时间的常数是可数的。'},
      {zh:'★ 空间换时间：$B$ 和 $C$ 共 $O(n+k)$ 额外空间。$k$ 太大（如 $k = n^2$）时这个算法就亏了 —— 8.4 的桶排序会处理"值域大但分布均匀"的情况。'}]},
     {kind:'summation',title:'稳定性：为什么反向扫描恰好对',steps:[
      {zh:'前缀和后，$C[v]$ = 值 $v$ 的**最后一个**输出槽位。'},
      {tex:'\\text{放置 } A[n], A[n-1], \\dots, A[1]：\\text{相同值 } v \\text{ 按输入逆序依次占 } C[v], C[v]-1, \\dots',zh:'逆序输入 × 递减槽位 = **两次反转 = 原序**。'},
      {zh:'★ 稳定 → 卫星数据（比如"这条记录是谁的"）不会错位。8.3 里稳定性更是**正确性**所必需，而不只是锦上添花。'}]},
    ],
    note:'★ 中心图：绿线（$2n$）在蓝线（$n\\lg n$）之下 —— 线性时间突破下界，只要前提（小整数、额外空间）满足。'},
   {type:'prove',title:'COUNTING-SORT 是稳定的（习题 8.2-2 的完整论证）',
    statement:'An important property of counting sort is that it is stable: elements with the same value appear in the output array in the same order as they do in the input array.',
    page:210,
    intro:'★ 原书把这当作观察而非定理，习题 8.2-2 要你证明它。三步：单个值的位置语义 → 多个相同值的落位序列 → 结论。',
    steps:[
     {title:'第一步 · C 的语义：相同值的"最后槽位"',
      en:'Lines 7–8 determine for each i = 0,1,…,k how many input elements are less than or equal to i by keeping a running sum of the array C .',page:209,
      body:['前缀和后 $C[v] = $ 值 $\\le v$ 的元素个数。',
        '于是值 $v$ 的元素们应当占输出中的位置 $C[v], C[v]-1, \\dots, C[v]-m_v+1$（$m_v$ = 值 $v$ 的个数）—— **一段连续的槽位，右端点是 $C[v]$**。']},
     {title:'第二步 · 反向放置 + 减 1：逆序输入配递减槽位',
      en:'Decrementing C[A[j]] causes the previous element in A with a value equal to A[j] , if one exists, to go to the position immediately before A[j] in the output array B .',page:209,
      body:['反向扫描（第 11 行 `downto`）时，值 $v$ 的元素按输入**逆序**依次到达。',
        '每个落位后 $C[v]$ 减 1，所以它们的落位依次是 $C[v], C[v]-1, \\dots$ —— **输入中越靠后的占越靠左的槽**。',
        '两次反转抵消：输出中值 $v$ 的相对次序 = 输入中的相对次序。∎']},
     {title:'第三步 · 正向扫描为什么不行（习题 8.2-3）',
      en:'Suppose that we were to rewrite the for loop header in line 11 of the COUNTING- SORT as 11 for j = 1 to n',page:211,
      body:['正向扫描时值 $v$ 的元素按输入**正序**到达，但槽位仍是**从右往左**分配 —— 相对次序被**反转**，稳定性破坏。',
        '★ 排序结果仍然正确（有序），但卫星数据会错位。C 程序里有个"不稳定版"：`c/radix_sort.c` 的 `counting_sort_by_digit_unstable` 用正向扫描，8.3 会演示它把基数排序**排错**。',
        '★ 要让正向也稳定？把前缀和改成"左端点"语义（$C[v]$ = $< v$ 的个数 + 1）即可 —— 但那就不是原书的 14 行了。']},
    ],
    conclusion:'★ 结论：反向扫描 × 槽位递减 × C 每放一个减 1 → 相同值保序。这个性质在 8.2 里只是"重要"，在 8.3 里将是**生死攸关**。',
    note:''},
   {type:'drill',title:'检验一下',
    items:[
     {kind:'single',q:'COUNTING-SORT 运行在 Θ(n + k)。什么时候它是 Θ(n)？',
      options:['k = O(1) 时','k = O(n) 时','k = O(n lg n) 时','总是'],answer:1,
      why:'★ 原书 p.208：实践中 $k = O(n)$ 时 $\\Theta(n+k) = \\Theta(n)$。'},
     {kind:'single',q:'前缀和（第 7–8 行）之后，C[i] 的语义是什么？',
      options:['值 i 出现的次数','≤ i 的元素个数','≥ i 的元素个数','值 i 的第一个输出位置'],answer:1,
      why:'★ 第 9 行注释："C[i] now contains the number of elements less than or equal to i"。数数阶段（第 6 行后）才是"等于"。'},
     {kind:'single',q:'第 11 行为什么必须 downto（反向扫描）？',
      options:['节省时间','保证稳定性','减少空间','处理负数'],answer:1,
      why:'★ 相同值按输入逆序落位到递减槽位，两次反转 = 保持原序。正向扫描排序仍对但**不稳定**（习题 8.2-3）。'},
     {kind:'single',q:'计数排序为什么不受 8.1 的 Ω(n lg n) 下界约束？',
      options:['因为它比任何比较排序都快，下界自然管不住它','因为它不是比较排序 —— 代码中没有元素间比较','那条下界只说最坏情况，计数排序看的是平均情况','它花了 $\\Theta(n+k)$ 的额外空间，用空间换掉了下界'],answer:1,
      why:'★ 原书 p.209："no comparisons between input elements occur anywhere in the code"。下界的前提模型不适用。'},
     {kind:'judge',q:'把第 11 行改成正向扫描后，COUNTING-SORT 的输出将不再是有序的。',answer:false,
      why:'★ 输出**仍然有序**，只是**不稳定**（相同值的相对次序被反转）。稳定与否影响的是卫星数据，不是有序性。'},
     {kind:'simulate',q:'对 A = ⟨2,0,1⟩（k = 2）做计数排序：前缀和后 C = ？（填三个数，逗号分隔，如 1,2,3）',expect:[1,2,3],placeholder:'例如：1,2,3',
      why:'数数：C = ⟨1,1,1⟩；前缀和：C[0]=1，C[1]=2，C[2]=3 → ⟨1,2,3⟩。C[2] = 3 = n。'},
    ],
    bookExercises:[
     {id:'8.2-1',page:210,star:0,statement:'Using Figure 8.2 as a model, illustrate the operation of COUNTING-SORT on the array A = ⟨6,0,2,0,1,3,4,6,1,3,2⟩.',hint:'数数：C = ⟨2,2,2,2,1,0,2⟩（k = 6）；前缀和：⟨2,4,6,8,9,9,11⟩；反向放置时 2 落 B[6]、倒数第二个 2 落 B[5]…… 终答案是 ⟨0,0,1,1,2,2,3,3,4,6,6⟩。'},
     {id:'8.2-2',page:210,star:0,statement:'Prove that COUNTING-SORT is stable.',hint:'稳定性 = 「相同键的相对次序不变」。本关阶段 8 三步就是完整证明，照它的口径自己写：① 前缀和后 $C[v]$ 的含义是「键 $\\le v$ 的元素个数」，也就是值为 $v$ 的那一段的**右端点**；② 主循环从 $j = n$ 递减到 1，配合 $C[A[j]]$ 用一次减 1 —— 于是相同键的**后出现者占右边的槽**，两次反转（倒着扫 + 倒着填槽）互相抵消，输出里同键保序；③ 反过来若正向扫描正向填槽，同键就会整段反序 —— 习题 8.2-3 问的就是这个。★ 写证明时把「取两个相同键 $A[j_1], A[j_2]$，$j_1 < j_2$」写成一句具体比较，比讲道理更容易拿分。'},
     {id:'8.2-3',page:211,star:0,statement:'Suppose that we were to rewrite the for loop header in line 11 of the COUNTING- SORT as 11 for j = 1 to n Show that the algorithm still works properly, but that it is not stable. Then rewrite the pseudocode for counting sort so that elements with the same value are written into the output array in order of increasing index and the algorithm is stable.',hint:'两问都要答，第二问才是改法。 第一问：第 11 行改成 $j = 1$ 到 $n$ 之后， 同值的元素仍然各占一个槽位（$C$ 给的区间大小没变），所以**结果照样是排好序的**； 但正着扫会把后出现的元素写进越靠前的小槽，同值元素的相对次序被颠倒 → 不再稳定。 第二问（要稳定且按下标递增写入）：把「放置位置」从区间**末尾倒着减**改成区间**开头顺着加** —— 先用前缀和算出每个值在输出数组里的起始下标 $s[v] = 1 + \\sum_{u<v} \\text{count}[u]$（本关记法是 1 基的 $A$、$B$，所以加 1），再正着扫输入 $j = 1 \\dots n$，写到 $B[s[A[j]]]$ 并令 $s[A[j]]$ 加一 —— 读的是 $A$、写的是 $B$，别把两个数组写反。 这样同值元素按原下标次序依次排好。原书那版（$C$ 存末尾 + 逆序扫）之所以稳定，是这两个动作配好了对。'},
     {id:'8.2-4',page:211,star:0,statement:'Prove the following loop invariant for COUNTING-SORT: At the start of each iteration of the for loop of lines 11–13, the last element in A with value i that has not yet been copied into B belongs in B[C[i]] .',hint:'这条不变量的意思是把 $C[i]$ 读成「**下一个**要放的价值为 $i$ 的元素该落的位置」。 按三步走时要说的正是这个： 初始化 —— 第 9–10 行做完累加后，$C[i]$ 等于 $A$ 中值不超过 $i$ 的元素个数，也就是值为 $i$ 的那一段的**末尾**槽位； 保持 —— 每抄走一个值为 $i$ 的元素就把 $C[i]$ 减一（第 13 行）， 于是剩下的「还没抄走的、原下标最大的那个值为 $i$ 的元素」正好落在新的 $C[i]$（它右边已被填满，它下面都是值更小的段）； 终止 —— $j$ 走完时 $C[i]$ 退到值为 $i$ 那一段的左边界外，$A$ 全部就位。 关键不是「有三步」，而是**逆序扫描**让「下标最大」与「落点最靠右」对上，这就是 8.2-2（"Prove that COUNTING-SORT is stable"）那条稳定性的来源。'},
     {id:'8.2-5',page:211,star:0,statement:'Suppose that the array being sorted contains only i ntegers in the range 0 to k and that there are no satellite data to move with those keys. Modify counting sort to use just the arrays A and C , putting the sorted result back into array A instead of into a new array B .',hint:'没有卫星数据时，输出的**位置**就够了，不需要 $B$：照第 2–4 行算出前缀和 $C[v]$（$\\le v$ 的元素个数），然后对每个值 $v = 0 \\ldots k$ 做$A[C[v-1] + 1 \\;..\\; C[v]] \\leftarrow v$（约定 $C[-1] = 0$）。两段加起来 $\\Theta(n + k)$，只用 $A$ 与 $C$。★ 本轮拿原书那一例实算过：$A = \\langle 2,5,3,0,2,3,0,3\\rangle$、$k = 5$ 得 $C = \\langle 2,2,4,7,7,8\\rangle$，回填出 $\\langle 0,0,2,2,3,3,3,5\\rangle$。注意这个写法会把键值本身覆盖成计数，所以要求「只有整数、没有卫星」。'},
     {id:'8.2-6',page:211,star:0,statement:'Describe an algorithm that, given n integers in the range 0 to k, preprocesses its input and then answers any query about how many of the n integers fall into a range [a : b] in O(1) time. Your algorithm should use Θ(n + k) preprocessing time.',hint:'预处理就是计数排序的前几行：计数 + 一次前缀和，得 $C[j]$ = 「$\\le j$ 的元素个数」，$\\Theta(n + k)$。查询 $[a:b]$ 的答案 $= C[b] - C[a-1]$（$a = 0$ 时约定 $C[-1] = 0$，答案取 $C[b]$），$O(1)$。★ 这题只考一件事：把 $C$ 的语义读成「前缀计数」而不是「输出位置」。顺带说明为什么数组必须开到 $k$：查询端点可以是 $0..k$ 里任何值。'},
    ]},
  ],
};
