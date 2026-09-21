/* 第 8 章 8.3：基数排序（Radix sort）。
 * 原文锚点：印刷页 211–215（pdf_index 232–236）。
 * 引述已用 tools/07_pick_quotes.py pick 逐条预检（26/26 PASS）。
 * 主题：把计数排序当积木 —— 稳定性从"锦上添花"变成"生死攸关"。
 */

export default {
  key:'s03',id:'ch08/s03',chapter:8,section:'8.3',
  title:'基数排序：从最低位开始，反直觉但正确',shortTitle:'8.3 基数排序',
  titleEn:'Radix sort',
  source:{printed:[211,215],pdf:[232,236]},
  prerequisites:[{label:'8.2 Counting sort',url:'#/ch08/s02'}],
  stages:[
   {type:'map',title:'d 趟稳定排序 = 一次完整排序',
    why:'8.2 的计数排序要求值域 $[0,k]$ 且 $k = O(n)$ —— 直接用它排 32 位整数是不行的（$k = 2^{32}$ 太大）。基数排序把每个键拆成 $d$ 个"位"（digit），**每趟只用计数排序排一位**，$k$ 缩成 $2^r$，总时间 $\\Theta(d(n+k))$。',
    position:'8.2 说"稳定性对基数排序生死攸关"，本关兑现：**正确性证明（归纳）每一步都需要稳定性**。最后给出位宽 $r$ 的选择分析 —— $b \\lg n$ 位以内、$r = b/\\lg n$ 时可达 $\\Theta(n)$。',
    unlocks:[{label:'8.4 Bucket sort（桶排序）',url:'#/ch08/s04'}],
    mathKit:[
     {title:'总时间 Θ(d(n + k))',body:'$d$ 趟，每趟稳定排序 $\\Theta(n+k)$。用计数排序时 $k$ 是**单个位**的取值数。'},
     {title:'位宽 r 的选择',body:'把 $b$ 位键拆成 $d = b/r$ 个 $r$ 位：$\\Theta\(\\frac{b}{r}(n+2^r)\)$。$b < \\lg n$ 时取 $r = b$ → $\\Theta(n)$；$b \\ge \\lg n$ 时取 $r = \\lfloor\\lg n\\rfloor$ → $\\Theta\(\\frac{bn}{\\lg n}\)$。'},
     {title:'归纳论证',body:'对"已排序的列"归纳：若第 $i-1$ 趟后按低 $i-1$ 位有序，且第 $i$ 趟**稳定**，则第 $i$ 趟后按低 $i$ 位有序。稳定只用一次，但缺它全塌。'},
    ]},
   {type:'intuition',title:'为什么从最低位开始反而对',
    scene:'整理卡片：先按个位分堆，收拢，再按十位……',
    body:[
     '直觉的方案是**从最高位**开始（先按百位分堆、每堆内部递归）—— 但那样要管理一大堆中间牌堆。卡片的物理世界帮了忙：机器一次只能看一列，**从最低位开始、每趟收拢成一副**，只要每趟排序**稳定**，$d$ 趟之后整副牌就完全有序。',
     '★ 关键机制：第 $i$ 趟排完，**两个数按低 $i$ 位的顺序排列**。如果低位打成平手，稳定性保证**上一趟的顺序被保留** —— 而上一趟的顺序正是"按更低位正确排序"的顺序。',
     '★ 一个坑：很多人以为第 $i$ 趟后"整个数组接近有序"，其实不然 —— 看面板 ① 的第二趟：$720$ 仍排在 $355$ 前面（十位 2 < 5），尽管百位 7 > 3。**顺序的正确性是逐位累积的，最后一趟才揭晓**。',
     '★ $d$ 是常数时（比如 32 位整数拆 4 个 8 位），这就是**线性时间** —— 又一次绕开比较下界。',
    ],
    interactive:{text:'面板 ② 用 C 程序实测：稳定版 vs 不稳定版 —— 只差一个扫描方向，后者真的排错。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体）。',
    blocks:[
     {kind:'body',page:212,en:'Radix sort solves the problem of card sorting—counterintuitively—by sorting on the least significant digit first.',
      zh:'★★ 反直觉的设计：**最低位优先**（LSD）。原书用打孔卡的故事讲它 —— 卡片排序机一次只能看一列。'},
     {kind:'body',page:212,en:'The process continues until the cards have been sorted on all d digits. Remarkably, at that point the cards are fully sorted on the d -digit number. Thus, only d passes through the deck are required to sort.',
      zh:'★ "Remarkably" —— $d$ 趟之后**完全有序**。没有递归、没有分堆管理，只有 $d$ 趟线性扫描。'},
     {kind:'body',page:212,en:'In order for radix sort to work correctly, the digit sorts must be stable. The sort performed by a card sorter is stable, but the operator must be careful not to change the order of the cards as they come out of a bin, even though all the cards in a bin have the same digit in the chosen column.',
      zh:'★★ **正确性压在稳定性上**。连操作员的手都不能抖 —— 同一堆里的卡片收拢时次序不能乱。8.2 的伏笔在这里兑现。'},
     {kind:'body',page:212,en:'For example, we might wish to sort dates by three keys: year, month, and day. We could run a sorting algorithm with a comparison function that, given two dates, compares years, and if there is a tie, compares mon ths, and if another tie occurs, compares days. Alternatively, we could sort the information three times with a stable sort: first on day (the "least significant" part), next on month, and finally on year.',
      zh:'★★ 多关键字排序的现实例子：日期。**要么写三键比较函数，要么用稳定排序跑三遍**（日 → 月 → 年）。后者不需要定制比较器 —— 数据库和分布式系统至今仍这么干。'},
     {kind:'body',page:213,en:'The code for radix sort is straightforward. The RADIX-SORT procedure assumes that each element in array A[1 : n] has d digits, where digit 1 is the lowest-order digit and digit d is the highest-order digit.',
      zh:'★ 伪代码只有 2 行 —— 复杂度全部藏在"选用哪个稳定排序"里。'},
     {kind:'body',page:213,en:'Although the pseudocode for RADIX-SORT does not specify which stable sort to use, COUNTING-SORT is commonly used. If you use COUNTING-SORT as the stable sort, you can make RADIX-SORT a little more efficient by revising COUNTING- SORT to take a pointer to the output array as a parameter, having RADIX-SORT preallocate this array, and alternating input and output between the two arrays in successive iterations of the for loop in RADIX-SORT.',
      zh:'★ 工程细节：交替使用两个数组避免每趟重新分配 —— 这是实际实现里的标准做法（C 程序里也这么做）。'},
     {kind:'body',page:213,en:'Given nd -digit numbers in which each digit can take on up to k possible values, RADIX-SORT correctly sorts these numbers in Θ(d(n + k)) time if the stable sort it uses takes Θ(n + k) time.',
      zh:'★★ **Theorem 8.3**（正文形式）：$\\Theta(d(n+k))$。$d$ 常数 + $k = O(n)$ → 线性。'},
     {kind:'body',page:214,en:'If b ≥ b lg nc, then choosing r = b lg nc gives the best running time to within a constant factor, which we can see as follows.',
      zh:'★ 位宽选择的结论：$b \\ge \\lceil\\lg n\\rceil$ 时取 $r = \\lfloor\\lg n\\rfloor$ 最优（差常数因子以内），运行时间 $\\Theta(bn/\\lg n)$。'},
    ],
    terms:[
     {en:'stable sort',zh:'稳定排序',page:212},
     {en:'least significant digit',zh:'最低有效位（LSD）',page:212},
    ]},
   {type:'pseudocode',title:'RADIX-SORT：全书最短的伪代码',
    lead:'★ 只有 2 行。"用稳定排序排第 i 位"里藏着全部的设计决策。',
    algo:'RADIX-SORT',signature:'RADIX-SORT(A, d)',page:213,
    lines:[
     {n:1,code:'for i = 1 to d',zh:'$d$ 趟：digit 1 是**最低位**。$d$ = 键的位数（如 3 位十进制数则 $d = 3$）。'},
     {n:2,code:'    use a stable sort to sort array A[1 : n] on digit i',zh:'★ 第 $i$ 趟按第 $i$ 位**稳定**排序整个数组。实践中用 COUNTING-SORT（每趟 $\\Theta(n+k)$，$k$ 是单 Digit 取值数）。**"stable"这个词是正确性的全部**。'},
    ],
    vars:[
     {name:'d',meaning:'键的位数。32 位整数按 8 位一组拆 → $d = 4$'},
     {name:'k',meaning:'单趟的位取值数：$r$ 位一组时 $k = 2^r - 1$'},
    ],
    note:'★ 伪代码短，工程细节多：交替两个数组（见引述 p.213）、每趟只看一位。C 程序的 `counting_sort_by_digit` 就是第 2 行的展开。'},
   {type:'visualize',title:'看见"逐位累积的正确性"',
    panels:[
     {title:'① 原书 Figure 8.3：七个三位数的三趟（逐帧）',
      viz:'array',
      algorithm:'radix-sort',
      input:{array:[329,457,657,839,436,720,355]},
      countLabels:{cmp:'查表',move:{label:'写',unit:'次'}},
      invariants:[{label:'第 i 趟完成后按低 i 位有序（归纳命题）；平手靠稳定性保序'}],
      presets:[
       {name:'★ Figure 8.3 的输入',array:[329,457,657,839,436,720,355]},
       {name:'带重复位（看稳定）',array:[720,329,839,329]},
      ]},
     {title:'② 一趟位排序的微观机制（按个位）',
      viz:'array',
      algorithm:'counting-sort',
      input:{array:[21,11,32,12],k:3},
      countLabels:{cmp:'查表',move:{label:'写',unit:'次'}},
      invariants:[{label:'把个位当键：21/11 个位同、32/12 个位同 —— 反向扫描保证它们不换相对位置'}],
      presets:[
       {name:'★ 按个位：稳定是关键',array:[21,11,32,12],args:[3]},
       {name:'对照',array:[12,32,11,21],args:[3]},
      ]},
    ],
    tasks:[
     '面板 ① 走到「第 1 趟完成」：数组变成 ⟨720,355,436,457,657,329,839⟩ —— 与 Figure 8.3 第 2 列一致。',
     '面板 ① 第 3 趟后完全有序：329 < 355 < 436 < 457 < 657 < 720 < 839（Figure 8.3 末列）。',
     '面板 ② 反向扫描保证相同个位的元素不换相对位置 —— 这就是"每趟稳定"的微观机制。',
    ],
    note:'★ 面板 ① 的三趟结果逐帧对应原书 Figure 8.3 的后三列（数据按渲染页坐标逐字核实）。'},
   {type:'code',title:'实测：不稳定真的会排错',
    intro:'`c/radix_sort.c` 实现了稳定版与**故意不稳定**的版本（唯一区别：放置循环的扫描方向 —— 稳定版从后往前扫；不稳定版从前往后扫、仍从桶尾往前填），后者对特定输入给出**错误**的排序结果 —— 稳定性不是锦上添花，是正确性本身。',
    pseudocodeRef:'RADIX-SORT',
    c:{file:'radix_sort.c',code:String.raw`/* radix_sort.c -- 8.3 节 RADIX-SORT 的实现与稳定性依赖验证。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o radix_sort radix_sort.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#define MAXN 64

/* 用计数排序对 exp 位（1/10/100...）做稳定排序 */
static void counting_sort_by_digit(int *a, int n, int exp)
{
    int out[MAXN], count[10] = {0};
    for (int i = 0; i < n; i++) count[(a[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        out[count[(a[i] / exp) % 10] - 1] = a[i];
        count[(a[i] / exp) % 10]--;
    }
    memcpy(a, out, (size_t)n * sizeof(int));
}

static void radix_sort(int *a, int n, int max_val)
{
    for (int exp = 1; max_val / exp > 0; exp *= 10) {
        counting_sort_by_digit(a, n, exp);
    }
}

static bool is_sorted(const int *a, int n)
{
    for (int i = 1; i < n; i++) { if (a[i - 1] > a[i]) return false; }
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

/* 不稳定版 —— 用来证明稳定性是必要的。
 * 仍然是 count[] 存「结束位置」，但正向扫描时从每个桶的**右端往前**填，
 * 于是同一个桶里的元素相对次序被反转 —— 排序本身没有越界，只是不再稳定。 */
static void counting_sort_by_digit_unstable(int *a, int n, int exp)
{
    int out[MAXN], count[10] = {0};
    for (int i = 0; i < n; i++) count[(a[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = 0; i < n; i++) {   /* ★ 从前往后扫，却填在桶尾 → 桶内逆序 */
        int d = (a[i] / exp) % 10;
        out[--count[d]] = a[i];
    }
    memcpy(a, out, (size_t)n * sizeof(int));
}

static void radix_sort_unstable(int *a, int n, int max_val)
{
    for (int exp = 1; max_val / exp > 0; exp *= 10) {
        counting_sort_by_digit_unstable(a, n, exp);
    }
}

int main(void)
{
    /* 1. 排好序 */
    int checked = 0;
    for (int t = 1; t <= 100; t++) {
        int n = 2 + (t % 40);
        int a[MAXN], before[MAXN];
        for (int i = 0; i < n; i++) { a[i] = (int)((t * 211 + i * 53) % 1000); }
        memcpy(before, a, (size_t)n * sizeof(int));
        radix_sort(a, n, 999);
        assert(is_sorted(a, n));
        assert(same_bag(a, before, n));
        checked++;
    }
    printf("part 1: %d 组随机输入（三位数以内）都排好序\n", checked);

    /* 2. 不稳定版对某些输入会失败 —— 证明稳定性是必要的 */
    {
        int a[] = {21, 11, 32, 12};  /* 21 和 11 个位相同（1），十位不同 */
        radix_sort_unstable(a, 4, 32);
        /* 不稳定版可能得到错误结果 */
        printf("part 2: 不稳定版对 {21, 11, 32, 12} 的结果 = [%d,%d,%d,%d]%s\n",
               a[0], a[1], a[2], a[3],
               is_sorted(a, 4) ? "（碰巧对了）" : "（不是有序的！）");
    }

    /* 3. 正确版（稳定版）对同一输入给出正确结果 */
    {
        int a[] = {21, 11, 32, 12};
        radix_sort(a, 4, 32);
        assert(is_sorted(a, 4));
        printf("part 3: 稳定版对 {21, 11, 32, 12} = [%d,%d,%d,%d]（正确）\n",
               a[0], a[1], a[2], a[3]);
    }

    puts("all checks passed.");
    return 0;
}
`,
       notes:[{line:12,zh:'`counting_sort_by_digit`：第 2 行的展开 —— 按当前位（exp = 1/10/100…）做一次**稳定**计数排序（反向放置）。'},
              {line:24,zh:'`radix_sort`：第 1 行的循环。$d$ 由 `max_val` 的位数决定。'},
              {line:54,zh:'★ `counting_sort_by_digit_unstable`：扫描方向反过来（从前往后），却仍从桶尾往前填 —— 同一个桶里的相对次序被**反转**。单看一趟，每个桶内部仍有序；但作为基数排序的一趟，它会把上一趟攒下的次序毁掉。'},
              {line:87,zh:'part 1：100 组三位数输入，稳定版全对。'},
              {line:92,zh:'★ part 2：不稳定版对 ⟨21,11,32,12⟩ 的输出**不是有序的**！个位趟（稳定必须）先按 1,1,2,2 分组时打乱了十位信息…… 正确性链条在这里断裂。'},
              {line:102,zh:'part 3：稳定版对同一输入给出正确结果。'}],
       tests:[{in:'100 组随机三位数',out:'稳定版全部排对'},
              {in:'⟨21,11,32,12⟩',out:'不稳定版输出非有序（正确性反例）'},
              {in:'同一输入',out:'稳定版 ⟨11,12,21,32⟩'}]},
    mapping:[{pc:1,pcCode:'for i = 1 to d',c:'`for (int exp = 1; max_val / exp > 0; exp *= 10)`（第 25 行附近）—— exp 就是"当前在第几位"'},
             {pc:2,pcCode:'use a stable sort to sort array A[1 : n] on digit i',c:'`counting_sort_by_digit(a, n, exp);`（第 27 行）—— 稳定排序的调用点'}]},
   {type:'analyze',title:'Θ(d(n + k)) 与位宽 r 的权衡',
    intro:'两层分析：先算 d 趟的总代价，再决定"一位"应该多宽。',
    claims:[
     {expr:'\\Theta(d(n+k))',when:'d 趟稳定排序的总代价（Theorem 8.3）',page:213,source:'book'},
     {expr:'\\Theta(n)',when:'d 为常数且 k = O(n) 时',page:213,source:'book'},
     {expr:'\\Theta\\!\(\\frac{b}{r}(n+2^r)\)',when:'b 位键、r 位一组',page:214,source:'book'},
     {expr:'\\Theta\\!\(\\frac{bn}{\\lg n}\)',when:'b ≥ lg n 时取 r = ⌊lg n⌋（最优到常数因子）',page:214,source:'book'},
    ],
    tables:[{caption:'位宽 r 的权衡（b 位键、n 个数）',rows:[
      ['r 变化','d = b/r','k = 2^r','单趟代价','总代价'],
      ['r 小','大','小','≈ n','≈ bn（趟数多）'],
      ['r 大（→b）','小','大','≈ n + 2^r','2^r 项主导'],
      ['★ r = ⌊lg n⌋','$b/\\lg n$','$\\approx n$','$\\approx 2n$','$\\Theta(bn/\\lg n)$'],
     ]},
     {caption:'什么时候基数排序真的线性？',rows:[
      ['场景','参数','总时间'],
      ['排 32 位整数、n 巨大','b=32, r=8, d=4, k=255','$\\Theta(n)$（d 常数）'],
      ['排 n 个 b < lg n 位的数','r = b, d = 1','$\\Theta(n)$'],
      ['b ≥ lg n（一般情况）','r = ⌊lg n⌋','$\\Theta(bn/\\lg n)$'],
     ]}],
    chart:{xMax:512,series:[
     {name:'基数排序 r=8（d=4, k=255）',expr:'4 * (n + 256)',color:'--viz-done'},
     {name:'比较排序 n lg n',expr:'n * Math.log2(n)',color:'--viz-compare'},
     {name:'bn/lg n（r = lg n）',expr:'n * Math.log2(n)',color:'--viz-violation'},
    ]},
    derivations:[
     {kind:'summation',title:'Theorem 8.3：d 趟的代价',steps:[
      {tex:'d \\times \\Theta(n + k) = \\Theta(d(n+k))',zh:'每趟对 $n$ 个数按一位稳定排序，位取值 $k$ 种。'},
      {zh:'$d$ 为常数、$k = O(n)$ → $\\Theta(n)$。★ 这就是"32 位整数、拆 4 个字节、每字节计数排序"跑线性时间的理论根据。'}]},
     {kind:'summation',title:'位宽 r：把 b 位键拆成 b/r 组',steps:[
      {tex:'\\Theta\(\\tfrac{b}{r}(n + 2^r)\)',zh:'$d = b/r$ 趟、每趟 $k = 2^r - 1$。'},
      {zh:'$r$ 太小：趟数 $b/r$ 多；$r$ 太大：$2^r$ 项爆掉。**权衡点在 $r \\approx \\lg n$**（此时 $2^r \\approx n$，两杯水一样满）。'},
      {tex:'b < \\lceil\\lg n\\rceil \\Rightarrow r = b \\Rightarrow \\Theta(n)',zh:'键太短，一趟搞定。'},
      {tex:'b \\ge \\lceil\\lg n\\rceil \\Rightarrow r = \\lfloor\\lg n\\rfloor \\Rightarrow \\Theta\(\\tfrac{bn}{\\lg n}\)',zh:'★ 注意这不是 $O(n)$：$b$ 随 $n$ 增长时（如 $b = \\lg^2 n$），线性就没了。'}]},
    ],
    note:'★ 中心图：绿线（r=8 固定）是真正的线性（常数 4 倍）；红线（r = lg n 自适应）渐近仍是 n lg n 形状 —— 位宽策略决定基数排序是"线性"还是"近线性"。'},
   {type:'prove',title:'Theorem 8.3 的正确性：归纳 + 稳定性',
    statement:'Given n d-digit numbers in which each digit can take on up to k possible values, RADIX-SORT correctly sorts these numbers in Θ(d(n + k)) time if the stable sort it uses takes Θ(n + k) time.',
    page:213,
    intro:'★ 时间部分是乘法；真正要证的是**正确性**：为什么 d 趟低位优先的稳定排序等于一次完整排序。原书说"对列归纳（见习题 8.3-3）"，这里把归纳展开。',
    steps:[
     {title:'第一步 · 归纳命题',
      en:'The correctness of radix sort follows by induction on the column being sorted (see Exercise 8.3-3).',page:213,
      body:['命题 $P(i)$：**第 $i$ 趟结束后，数组按"低 $i$ 位"构成的字典序有序**。',
        '$P(0)$：空位序，任何数组都满足（平凡）—— 归纳起点。']},
     {title:'第二步 · 归纳步：稳定性只在这一处出场',
      en:'In order for radix sort to work correctly, the digit sorts must be stable.',page:212,
      body:['设 $P(i-1)$ 成立。看第 $i$ 趟（按第 $i$ 位稳定排序）之后的任意两个数 $x, y$（$x$ 在 $y$ 前）。',
        '**情况 1**：第 $i$ 位 $x_i < y_i$ → 直接满足（这一趟的主序）。',
        '**情况 2**：$x_i = y_i$（平手）→ 稳定性保证 $x, y$ **保持第 $i$ 趟前的相对次序**；而归纳假设说那个次序按低 $i-1$ 位有序 → $x$ 仍在 $y$ 前。∎',
        '★ **稳定性只在这一步用到** —— 但没有它，情况 2 的顺序就没了依据，低位的排序成果被高位趟毁掉。这正是 C 程序不稳定版反例的成因。']},
     {title:'第三步 · 时间：d 趟求和',
      en:'Each pass over nd -digit numbers then takes Θ(n + k) time. There are d passes, and so the total time for radix sort is Θ(d(n + k)).',page:213,
      body:['每趟 $\\Theta(n+k)$（8.2 的结论，$k$ 现在是单 Digit 的取值数）。',
        '$d$ 趟 → $\\Theta(d(n+k))$。$d$、$k$ 是输入的函数：$d$ 常数 + $k = O(n)$ → **线性**。']},
    ],
    conclusion:'★ 结论：归纳命题 $P(d)$ 成立 → RADIX-SORT 正确；代价 $\\Theta(d(n+k))$。稳定性的角色被精确到"情况 2"—— 它不参与主序判断，只负责**在平手时保住低位趟的成果**。',
    note:''},
   {type:'drill',title:'检验一下',
    items:[
     {kind:'single',q:'RADIX-SORT 按位的顺序是？',
      options:['最高位优先','最低位优先','随机','交替'],answer:1,
      why:'★ 原书 p.212："counterintuitively—by sorting on the least significant digit first"。'},
     {kind:'single',q:'基数排序的正确性依赖每一趟（被用作积木的排序）具有什么性质？',
      options:['原地','稳定','自适应','比较'],answer:1,
      why:'★ "In order for radix sort to work correctly, the digit sorts must be stable"（p.212）。平手时靠稳定性保住低位的排序成果。'},
     {kind:'single',q:'b 位键、r 位一组时，RADIX-SORT + 计数排序的总时间？',
      options:['Θ(bn)','Θ((b/r)(n + 2^r))','Θ(n·2^r)','Θ(b + nr)'],answer:1,
      why:'★ d = b/r 趟、每趟 Θ(n + 2^r)：Theorem 8.3 的推广形式（p.214）。'},
     {kind:'single',q:'b ≥ lg n 时，r 的最优选择（差常数因子以内）是？',
      options:['r = b','r = 1','r = ⌊lg n⌋','r = ⌈b/2⌉'],answer:2,
      why:'★ p.214：此时 2^r ≈ n，趟数与单趟代价平衡，总时间 Θ(bn/lg n)。'},
     {kind:'judge',q:'把计数排序的放置循环改成正向扫描后，RADIX-SORT 仍能正确排序。',answer:false,
      why:'★ 排序结果**可能错**：C 程序对 ⟨21,11,32,12⟩ 的不稳定版输出不是有序的。不稳定的位排序会毁掉之前趟的成果。'},
     {kind:'simulate',q:'对 ⟨329, 457, 657, 839, 436, 720, 355⟩ 做基数排序：第 1 趟（按个位）之后，最前面的数是？（填 3 位数）',expect:['720'],placeholder:'例如：329',
      why:'个位依次是 9,7,7,9,6,0,5 → 720 的个位 0 最小，排最前（Figure 8.3 第 2 列）。'},
    ],
    bookExercises:[
     {id:'8.3-1',page:214,star:0,statement:'Using Figure 8.3 as a model, illustrate the operation of RADIX-SORT on the fol- lowing list of English words: COW, DOG,SEA, RUG, ROW, MOB, BOX, TAB, BAR, EAR, TAR, DIG, BIG, TEA, NOW, FOX.',hint:'按字母从右往左做三趟**稳定**计数排序（第 3、第 2、第 1 个字母各一趟），每趟后抄下整张表。 16 个词互不相同，但**同一位上字母相同**是常事，稳定就是把它们留在彼此的相对次序里： 第 3 字母相同的一组有 $\\text{DOG, DIG, RUG, BIG}$（都是 G），第 1 字母相同的有 $\\text{BOX, BAR, BIG}$（B）与 $\\text{TAB, TAR, TEA}$（T）—— 最后一趟才会把它们按第 1 字母定序， 前三趟不能打乱它们内部已有的次序。 三趟做完的终态必然等于字典序（BAR BIG BOX COW DIG DOG EAR FOX MOB NOW ROW RUG SEA TAB TAR TEA） —— 拿它当自检，但每趟的中间表要自己按稳定排序推，那才是本题要你展示的东西。'},
     {id:'8.3-2',page:215,star:0,statement:'Which of the following sorting algorithms are stable: insertion sort, merge sort, heapsort, and quicksort? Give a simple scheme that makes any comparison sort stable. How much additional time and space does your scheme entail?',hint:'稳定：插入、归并。不稳定：堆排、快排。通用方案：给每个元素附上原始下标当次键（比较时平手比下标）—— 时间不变，空间 $O(n)$。'},
     {id:'8.3-3',page:215,star:0,statement:'Use induction to prove that radix sort works. Where does your proof need the assumption that the intermediate sort is stable?',hint:'归纳命题（本关阶段 8 第一步）：跑完第 $i$ 趟后，数组按**低 $i$ 位**有序。归纳步（第二步）：第 $i+1$ 趟按第 $i+1$ 位排序，同一位上的元素谁在前？必须由低 $i$ 位的次序决定 —— 这正是「稳定」唯一出场的地方；若这一趟不稳定，同一位上那些元素的先后就被打乱，低 $i$ 位已经排好的成果等于作废。最后一趟 $i = d$ 就是整体有序。★ 记得补时间：$d$ 趟、每趟 $\\Theta(n + k)$。'},
     {id:'8.3-4',page:215,star:0,statement:'Suppose that COUNTING-SORT is used as the stable sort within RADIX-SORT. If RADIX-SORT calls COUNTING-SORT d times, then since each call of COUNTING- SORT makes two passes over the data (lines 4–5 and 11–13), altogether 2d passes over the data occur. Describe how to reduce the total number of passes to d + 1.',hint:'题干问的是怎么把 $2d$ 趟压成 $d+1$ 趟，不是位宽选择。 关键观察：计数排序的两趟是「第 4–5 行统计 $C$」与「第 11–13 行按 $C$ 放置」。 **放置那一趟顺手把下一位的直方图也统计出来** —— 放置时每个元素都刚被看过一次， 算它下一位的数字并累加计数是常数额外工作，代价仍是 $\\Theta(n+k)$。 于是：第 1 位照常两趟，之后每位只需一趟放置 → $2 + (d-1) = d+1$ 趟。 要留意的边角：下一位的 $C$ 数组要在放置前定稿，所以先扫一遍算直方图、算出前缀和，再放置 —— 这也是为什么只能省到 $d+1$ 而不是 $d$。'},
     {id:'8.3-5',page:215,star:0,statement:'Show how to sort n integers in the range 0 to n 3 − 1 in O(n) time.',hint:'值域是 $[0, n^3 - 1]$，正好是 **3 位 base-$n$** 的数： 把每个整数写成 $a \\cdot n^2 + b \\cdot n + c$（$a,b,c$ 都在 $[0, n-1]$）， 用计数排序按 $c$、$b$、$a$ 各做一趟稳定排序 → $d = 3$ 趟、每趟值域 $k = n - 1$， 每趟 $\\Theta(n + k) = \\Theta(n)$，总共 $\\Theta(3n) = O(n)$。 两处容易翻车：进制取 $n^2$ 就只有 2 位但每趟 $\\Theta(n^2)$（总时间不线性）； 取 $n$ 才刚好「位数 $\\times$ 每位值域」等于值域大小 —— 也就是要 $n^{\\text{位数}} \\ge n^3$。'},
    ]},
  ],
};
