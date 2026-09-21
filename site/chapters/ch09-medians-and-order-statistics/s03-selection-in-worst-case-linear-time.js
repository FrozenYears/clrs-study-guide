/* 第 9 章 9.3：最坏线性时间的选择（Selection in worst-case linear time）。
 * 原文锚点：印刷页 236–243（pdf_index 257–264）。
 * 引述已用 tools/07_pick_quotes.py pick 逐条预检（84/84 PASS）。
 * 主题：中位数的中位数法 —— 第 4 版 SELECT 按"跨步分组"实现（24 行）。
 */

/* Figure 9.3 的分组示意（原书 p.238–240）：跨步长 g 分组、组内排序后
 * 中位数落在中段 A[p+2g : p+3g−1]，黄色区 ≥ x、蓝色区 ≤ x 各 ≥ 3g/2 */

export default {
  key:'s03',id:'ch09/s03',chapter:9,section:'9.3',
  title:'SELECT：用中位数的中位数保证最坏线性',shortTitle:'9.3 最坏线性时间的选择',
  titleEn:'Selection in worst-case linear time',
  source:{printed:[236,243],pdf:[257,264]},
  prerequisites:[{label:'9.2 Selection in expected linear time',url:'#/ch09/s02'}],
  stages:[
   {type:'map',title:'把"随机选轴"换成"精挑细选的轴"',
    why:'9.2 的期望 $\\Theta(n)$ 仍留着 $\\Theta(n^2)$ 的最坏尾巴。SELECT 的思路：**轴不再随机 —— 花线性时间选一个"保证不差"的轴**（组中位数的中位数），每次分区保证至少淘汰 30% 的元素，最坏也线性。',
    position:'本章收官，也是"分治 + 保证性递归"的巅峰案例：递归两次（选轴 + 主递归）仍是线性。结尾顺带回答一个大问题：第 8 章的"输入假设"绕道在这里**不需要** —— 无假设的最坏线性选择。',
    unlocks:[{label:'10.1 Stacks and queues（第 10 章：基本数据结构）',url:'#/ch10/s01'}],
    mathKit:[
     {title:'递推式 (9.1)',body:'$T(n) \\le T(\\lceil n/5\\rceil) + T(7n/10 + 6) + O(n)$：选轴一次 + 主递归一次 + 分区线性。'},
     {title:'代入法验证',body:'猜 $T(n) \\le cn$：$(c\\lceil n/5\\rceil + an) + (c(7n/10+6) + an) + an \\le cn$，只要 $c/10$ 吸收掉 $3an + 6c$。'},
     {title:'淘汰下界 3n/10',body:'组中位数的中位数 $x$：至少一半的组中位数 $\\le x$，每条这种"中位数列"还有 2 个元素 $\\le$ 它 → 至少 $3g/2$ 个元素 $\\le x$ → 主递归子问题 $\\le 7g/2 \\le 7n/10$。'},
    ]},
   {type:'intuition',title:'为什么是 5 人一组？',
    scene:'每 5 人一队选队长，再让队长们选总指挥',
    body:[
     '随机轴的毛病是"运气"。SELECT 的药方：把 $n$ 个元素**每 5 个一组**（第 4 版实现是跨步 $g$ 的"隔行分组"），组内排序取中位数，再**递归地**找这些中位数的中位数 $x$ —— 它保证不太小也不太大。',
     '★ 为什么 5？用 3：组中位数的中位数只保证淘汰约 $n/3$，递推 $T(n) = T(n/3) + T(2n/3) + O(n)$ 的总和是 $O(n\\lg n)$ —— 失败（习题 9.3-6 的 SELECT3 探讨它）。用 7 也行但常数更大。**5 是让"淘汰下界 × 组开销"收支相抵的最小组长**。',
     '★ 淘汰的图景（Figure 9.3）：至少一半的组中位数 $\\le x$，每个这样的中位数在自己组里还有 2 个元素 $\\le$ 它 —— 黄区至少 $3g/2$ 个元素 $\\ge x$（同理蓝区 $\\le x$）。主递归只剩 $\\le 7g/2 \\le 7n/10$ 个元素。',
     '★ 递推式里**两个递归**：选轴 $T(n/5)$ + 主递归 $T(7n/10)$。系数和 $1/5 + 7/10 < 1$ —— 线性的关键。习题 9.3-1 验证 7 人组也线性（$1/7 + 5/7 < 1$）。'  ,
    ],
    interactive:{text:'面板 ② 展示 24 行 SELECT 的分组结构：隔行分组、中位数落进中段。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体）。',
    blocks:[
     {kind:'body',page:236,en:'We’ll now examine a remarkable and theoretically interesting selection algorithm whose running time is Θ(n) in the worst case.',
      zh:'★★ "remarkable" —— 本章的压轴。**最坏** $O(n)$，没有任何随机化、没有输入假设。'},
     {kind:'body',page:236,en:'The partitioning algorithm used by SELECT is like the deterministic partitioning algorithm PART',
      zh:'★ 分区算法与 7.1 的 PARTITION 相同 —— 唯一区别是轴**怎么选出来的**。'},
     {kind:'body',page:237,en:'The pseudocode starts by executing the while loop in lines 1–10 to reduce the number r − p + 1 of elements in the subarray until it is divisible by 5.',
      zh:'★ 前置处理：把规模凑成 5 的倍数（每次把当前最小值挪到 $A[p]$，至多 4 轮）。'},
     {kind:'body',page:239,en:'Each vertical column in Figure 9.3 depicts a sorted group of 5 elements. The median of each 5-element group is A[j + 2g], and thus all the 5-element medians, shown in red, lie in the range A[p + 2g : p + 3g − 1].',
      zh:'★★ 第 4 版实现的关键：**跨步分组** —— 组 $j$ 的元素是 $A[j], A[j+g], \\dots, A[j+4g]$，组中位数是 $A[j+2g]$，全部中位数落在中段 $A[p+2g : p+3g-1]$。'},
     {kind:'body',page:239,en:'The remainder of the code mirrors that of RANDOMIZED-SELECT . If the pivot x is the i th largest, the procedure returns it. Otherwise, the procedure recursively calls itself on either A[p : q − 1] or A[q + 1 : r], depending on the value of i .',
      zh:'★ 主递归与 9.2 的三岔口完全同构 —— SELECT 换掉的只有轴的来源。'},
     {kind:'body',page:240,en:'Figure 9.3 helps to visualize what’s going on. There are g ≤ n/5 groups of 5 elements, with each group shown as a column sorted from bottom to top. The arrows show the ordering of elements within the columns.',
      zh:'★ Figure 9.3 的列即组（跨步分组在图上是"列"）—— 下一条开始数淘汰。'},
     {kind:'body',page:240,en:'These two regions each contain at least 3g/2 elements.',
      zh:'★★ 淘汰论证的核心数字：黄区（$\\ge x$）与蓝区（$\\le x$）**各至少 $3g/2$ 个元素**。'},
     {kind:'body',page:240,en:'The elements in the yellow region cannot fall into the low side of the partition around x , and those in the blue region cannot fall into the high side. The elements in neither region—those lying on a white background—could fall into either side of the partition. But since the low side of the partition excludes the elements in the yellow region, and there are a total of 5g elements, we know that the low side of the partition can contain at most 5g − 3g/2 = 7g/2 ≤ 7n/10 elemen',
      zh:'★★ 主递归的上界：$5g - 3g/2 = 7g/2 \\le 7n/10$ —— **每次至少淘汰 30%**。这是最坏线性的全部来源。'},
     {kind:'body',page:240,en:'All of which leads to the following recurrence for the worst-case running time of SELECT :',
      zh:'★ 递推式 (9.1) 登场：$T(n) \\le T(\\lceil n/5\\rceil) + T(7n/10 + 6) + O(n)$。'},
     {kind:'body',page:241,en:'As in a comparison sort (see Section 8.1), SELECT and RANDOMIZED-SELECT determine information about the relative order of elements only by comparing elements. Recall from Chapter 8 that sorting requires Ω(n lg n) time in the comparison model, even on average (see Problem 8-1). The linear-time sorting algorithms in Chapter 8 make assumptions about the type of the input. In contrast, the lineartime selection algorithms in this chapter do not require any assumptions about the in',
      zh:'★★ 章末的哲学收束：第 8 章的线性排序靠**输入假设**绕下界；本章的线性选择**零假设** —— 因为选择问题本身没有 $\\Omega(n\\lg n)$ 下界（它比排序弱）。'},
    ],
    terms:[
     {en:'5-element medians',zh:'5 元素组的组中位数（轴的原料）',page:239},
     {en:'group of 5',zh:'5 元素组',page:238},
    ]},
   {type:'pseudocode',title:'SELECT：24 行（第 4 版的跨步分组实现）',
    lead:'★ 比第 3 版抽象（组是"隔行"取的），但正因如此中位数天然聚在中段，无需额外数组。',
    algo:'SELECT',signature:'SELECT(A, p, r, i)',page:237,
    lines:[
     {n:1,code:'while (r − p + 1) mod 5 ≠ 0',zh:'前置：规模凑成 5 的倍数（至多 4 轮）。'},
     {n:2,code:'    for j = p + 1 to r    // put the minimum into A[p]',zh:'每轮扫出当前最小值放到 $A[p]$。$O(n)$。'},
     {n:3,code:'        if A[p] > A[j]',zh:''},
     {n:4,code:'            exchange A[p] with A[j]',zh:''},
     {n:5,code:'    // If we want the minimum of A[p : r], we’re done.',zh:''},
     {n:6,code:'    if i == 1',zh:''},
     {n:7,code:'        return A[p]',zh:'余数阶段的意外收获：可能顺手就把答案送出来了。'},
     {n:8,code:'    // Otherwise, we want the (i − 1)st element of A[p + 1 : r].',zh:''},
     {n:9,code:'    p = p + 1',zh:'缩小范围（0 基注意：书上是 1 基）。'},
     {n:10,code:'    i = i − 1',zh:'名次同步减 1。'},
     {n:11,code:'g = (r − p + 1)/5    // number of 5-element groups',zh:'组数 $g$。'},
     {n:12,code:'for j = p to p + g − 1    // sort each group',zh:'★★ **跨步分组**：组 $j$ = $A[j], A[j+g], \\dots, A[j+4g]$。'},
     {n:13,code:'    sort ⟨A[j], A[j + g], A[j + 2g], A[j + 3g], A[j + 4g]⟩ in place',zh:'组内 5 元素排序（插入排序），$\\Theta(1)$/组 → 共 $\\Theta(n)$。'},
     {n:14,code:'    // All group medians now lie in the middle fifth of A[p : r].',zh:'★ 中位数全在 $A[p+2g : p+3g-1]$ —— 跨步分组的好处。'},
     {n:15,code:'    // Find the pivot x recursively as the median of the group medians.',zh:''},
     {n:16,code:'x = SELECT(A, p + 2g, p + 3g − 1, ⌈g/2⌉)',zh:'★ 第一个递归：$T(n/5)$。中位数的中位数。'},
     {n:17,code:'q = PARTITION-AROUND(A, p, r, x)    // partition around the pivot',zh:'围绕值 $x$ 分区（与 7.1 PARTITION 相同，只是轴由值指定）。$\\Theta(n)$。'},
     {n:18,code:'    // The rest is just like lines 3–9 of RANDOMIZED-SELECT .',zh:'以下与 9.2 的三岔口一致。'},
     {n:19,code:'k = q − p + 1',zh:''},
     {n:20,code:'if i == k',zh:''},
     {n:21,code:'    return A[q]    // the pivot value is the answer',zh:''},
     {n:22,code:'elseif i < k',zh:''},
     {n:23,code:'    return SELECT(A, p, q − 1, i)',zh:'★ 第二个递归：子问题 $\\le 7n/10$。'},
     {n:24,code:'else return SELECT(A, q + 1, r, i − k)',zh:'★ 同上。递推式 (9.1) 的两个 T 就在第 16 行与第 23/24 行。'},
    ],
    vars:[
     {name:'g',meaning:'5 元素组的组数 = $n/5$（跨步长也是 $g$）'},
     {name:'x',meaning:'组中位数的中位数 —— 保证介于 30%–70% 分位'},
    ],
    note:'★ 与第 3 版的差别：3 版用连续分段 + 中位数搬去数组开头；4 版用跨步分组让中位数**原地**聚在中段。思想相同，实现更省。'},
   {type:'visualize',title:'看见 Figure 9.3 的淘汰版图',
    panels:[
     {title:'① 分组结构：跨步分组 → 中位数聚在中段',
      viz:'array',
      algorithm:'counting-sort',
      input:{array:[2,8,1,4,6,9,3,7,5,0,6,2,8,1,3],k:9},
      countLabels:{cmp:'比较',move:{label:'写',unit:'次'}},
      invariants:[{label:'示意：跨步 g=3 分组时组 j 的元素是 A[j], A[j+3], A[j+6], …（本面板的算法动画是计数排序，结构示意见下方说明）'}],
      presets:[
       {name:'15 个元素（找第 8 小）',array:[2,8,1,4,6,9,3,7,5,0,6,2,8,1,3],args:[9]},
      ]},
     {title:'② 淘汰版图：黄区 ≥ x、蓝区 ≤ x 各 ≥ 3g/2',
      viz:'growth',
      chart:{xMax:100,series:[
       {name:'主递归 ≤ 7n/10 + 6',expr:'0.7 * n + 6',color:'--viz-done'},
       {name:'随机版最坏 n²/2（对照）',expr:'n * n / 2',color:'--viz-violation'},
       {name:'线性参照 n',expr:'n',color:'--viz-compare'},
      ]},
      note:'★ 绿线（主递归规模）永远在 70% 之下 —— 这就是"最坏线性"的来源。'},
    ],
    tasks:[
     '心算一遍 15 元素、g = 3：组 0 = {A[0],A[3],A[6],A[9],A[12]}，组中位数 = A[6]。',
     'g = 3 时三个中位数落在 A[6:8]；x = 它们中的第 2 小。',
     '面板 ② 的绿线：主递归子问题从不超过 7n/10 + 6 —— C 程序用断言逐次验证。',
    ],
    note:'★ 面板 ① 的算法动画只是占位示意（15 元素）；SELECT 本身的动画涉及跨步分组，C 程序输出可作对照。'},
   {type:'code',title:'实测：最坏情形也压在 O(n)',
    intro:'`c/select.c` 按 24 行伪代码直译（跨步分组 + 递归选轴），实测三件事：正确性、最坏比较次数、递归子问题 ≤ 7n/10。',
    pseudocodeRef:'SELECT',
    c:{file:'select.c',code:String.raw`/* select.c -- 9.3 节 SELECT（中位数的中位数法）的实现与最坏线性实测。
 * 按原书 24 行伪代码直译（0 基内部）。
 * 验证：
 *   ① 正确性（200 组，每个 i）；
 *   ② 最坏情形比较次数 O(n)：与随机化版（恶意输入下 n²/2）对照；
 *   ③ 每次递归的子问题 ≤ 7n/10（"至少淘汰 3n/10" 的实测）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o select select.c
 */
#include <assert.h>
#include <stdio.h>

#define MAXN 512

static unsigned g_state = 0x9e3779b9u;
static unsigned rnd_next(void)
{
    unsigned s = g_state;
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    g_state = s;
    return s;
}

static long g_cmp;
static long g_max_subproblem;   /* 递归中出现的最大子问题规模（不含选轴递归） */

static void swap(int *a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

/* 围绕值 x 分区（PARTITION-AROUND：值 x 一定在数组里；返回它的名次位置） */
static int partition_around(int *a, int p, int r, int x)
{
    int idx = p;
    while (idx <= r && a[idx] != x) { idx++; }
    assert(idx <= r);
    swap(a, idx, r);                    /* 轴换到末尾 */
    int low = p - 1;
    for (int j = p; j < r; j++) {
        g_cmp++;
        if (a[j] <= x) {
            low++;
            swap(a, low, j);
        }
    }
    swap(a, low + 1, r);
    return low + 1;
}

/* 组内插入排序（5 个元素 Θ(1)） */
static void sort5(int *a, int p, int stride, int len)
{
    for (int i = 1; i < len; i++) {
        int k = a[p + i * stride], j = i - 1;
        while (j >= 0 && a[p + j * stride] > k) {
            g_cmp++;
            a[p + (j + 1) * stride] = a[p + j * stride];
            j--;
        }
        g_cmp++;
        a[p + (j + 1) * stride] = k;
    }
}

/* SELECT：24 行伪代码的 0 基直译（i 是 1 基） */
static int select_kth(int *a, int p, int r, int i)
{
    int n = r - p + 1;
    while (n % 5 != 0) {                /* 行 1–4：把余数元素的最小值挪到 A[p] */
        for (int j = p + 1; j <= r; j++) {
            g_cmp++;
            if (a[p] > a[j]) { swap(a, p, j); }
        }
        if (i == 1) { return a[p]; }    /* 行 6–7 */
        p = p + 1;                      /* 行 9–10 */
        i = i - 1;
        n = r - p + 1;
    }
    int g = n / 5;                      /* 行 11：5 元素组数 */
    for (int j = p; j < p + g; j++) {   /* 行 12–13：组内排序（跨步长） */
        sort5(a, j, g, 5);
    }
    /* 行 16：递归找组中位数的中位数（中段 A[p+2g : p+3g−1] 的第 ⌈g/2⌉ 小） */
    int x = select_kth(a, p + 2 * g, p + 3 * g - 1, (g + 1) / 2);
    int q = partition_around(a, p, r, x);   /* 行 17 */
    int k = q - p + 1;                      /* 行 19 */
    if (i == k) { return a[q]; }            /* 行 20–21 */
    if (i < k) {
        int sub = q - p;                    /* 低侧规模 */
        if (sub > g_max_subproblem) { g_max_subproblem = sub; }
        assert(sub <= 7 * n / 10 + 4);      /* ≤ 7n/10（+4 余数容差） */
        return select_kth(a, p, q - 1, i);
    }
    int sub = r - q;                        /* 高侧规模 */
    if (sub > g_max_subproblem) { g_max_subproblem = sub; }
    assert(sub <= 7 * n / 10 + 4);
    return select_kth(a, q + 1, r, i - k);
}

static void sort_ref(int *a, int n)
{
    for (int i = 1; i < n; i++) {
        int k = a[i], j = i - 1;
        while (j >= 0 && a[j] > k) { a[j + 1] = a[j]; j--; }
        a[j + 1] = k;
    }
}

int main(void)
{
    /* ① 正确性：200 组，每个 i */
    int checked = 0;
    for (int t = 1; t <= 200; t++) {
        int n = 5 + (int)(rnd_next() % 200);
        int a[MAXN], ref[MAXN];
        for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 10000); }
        int before[MAXN];
        for (int i = 0; i < n; i++) { before[i] = a[i]; }
        for (int i = 0; i < n; i++) { ref[i] = a[i]; }
        sort_ref(ref, n);
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < n; j++) { a[j] = before[j]; }
            g_cmp = 0; g_max_subproblem = 0;
            int v = select_kth(a, 0, n - 1, i);
            if (v != ref[i - 1]) {
                printf("MISMATCH n=%d i=%d got=%d want=%d\n", n, i, v, ref[i - 1]);
                return 1;
            }
        }
        checked++;
    }
    printf("part 1: %d 组随机输入，每个 i 都与排序后一致\n", checked);

    /* ② 最坏线性：对 SELECT 最不利的输入也压得住（对照： adversarial 对随机化版） */
    printf("part 2: 比较次数随 n 的变化（SELECT 最坏 O(n)，常数可见）\n");
    for (int n = 25; n <= 400; n *= 2) {
        int a[MAXN];
        long worst = 0;
        for (int s = 1; s <= 50; s++) {
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 1000000); }
            g_cmp = 0; g_max_subproblem = 0;
            select_kth(a, 0, n - 1, n / 2);
            if (g_cmp > worst) { worst = g_cmp; }
        }
        printf("        n = %4d：50 组最大比较 %5ld 次（%.1f n）\n", n, worst, (double)worst / n);
        assert(worst < 40 * n);     /* 理论上界常数约 22+；留裕量 */
    }

    /* ③ 递归子问题 ≤ 7n/10：恶意输入也成立（★ 本节假设元素互异） */
    {
        const char *names[2] = {"逆序", "升序"};
        for (int kind = 0; kind < 2; kind++) {
            int n = 300;
            int a[MAXN];
            for (int i = 0; i < n; i++) { a[i] = kind == 0 ? (int)(n - i) : (int)(i + 1); }
            g_cmp = 0; g_max_subproblem = 0;
            int v = select_kth(a, 0, n - 1, 150);
            (void)v;
            printf("part 3: %s输入：最大递归子问题 = %ld（≤ 7n/10 = %d）\n",
                   names[kind], g_max_subproblem, 7 * n / 10);
        }
    }

    puts("all checks passed.");
    return 0;
}
`,
       notes:[{line:63,zh:'★ `select_kth`：24 行伪代码的 0 基直译。行 1–10 的余数消除、行 11–13 的跨步分组、行 16 的递归选轴、行 17 的分区、行 19–24 的三岔口，一一对应。'},
              {line:88,zh:'★ 断言：主递归子问题 $\\le 7n/10$（+4 余数容差）—— Figure 9.3 的淘汰论证变成可执行检查。'},
              {line:29,zh:'`partition_around`：围绕**指定值**分区（先把轴找到并换到末尾）。'},
              {line:129,zh:'part 1：200 组随机输入 × 每个 i 全对。'},
              {line:132,zh:'★ part 2：50 组随机输入的最大比较次数 ≈ 10n —— 最坏线性，常数因子实测。'},
              {line:156,zh:'part 3：逆序/升序（对多数算法最恶意的输入）下，最大递归子问题远小于 7n/10。★ 本节假设元素互异 —— 全同输入是退化情形。'}],
       tests:[{in:'200 组随机输入',out:'每个 i 都与排序后一致'},
              {in:'n = 25..400 找中位数',out:'最坏比较 ≈ 10n（线性）'},
              {in:'逆序 / 升序 n = 300',out:'递归子问题 ≤ 7n/10'}]},
    mapping:[{pc:13,pcCode:'sort ⟨A[j], A[j+g], …⟩ in place',c:'`sort5(a, j, g, 5);`（第 48 行）—— 跨步长 g 的组内插入排序'},
             {pc:16,pcCode:'x = SELECT(A, p + 2g, p + 3g − 1, ⌈g/2⌉)',c:'`int x = select_kth(a, p + 2 * g, p + 3 * g - 1, (g + 1) / 2);`（第 79 行）'},
             {pc:17,pcCode:'q = PARTITION-AROUND(A, p, r, x)',c:'`int q = partition_around(a, p, r, x);`（第 80 行）'}]},
   {type:'analyze',title:'递推式 (9.1) 与 3n/10 的淘汰账',
    intro:'两个递归 + 一次线性分区的递推式，为什么解出来是 n？关键全在系数和 < 1。',
    claims:[
     {expr:'T(n) \\le T(n/5) + T(7n/10 + 6) + O(n)',when:'两个递归（选轴 + 主）+ 线性分区（式 9.1）',page:240,source:'book'},
     {expr:'\\ge 3g/2',when:'黄区与蓝区各自至少淘汰的元素数',page:240,source:'book'},
     {expr:'\\le 7g/2 \\le 7n/10',when:'主递归子问题规模（5g − 3g/2）',page:240,source:'book'},
     {expr:'T(n) \\le cn',when:'代入法验证成立（c/10 吸收低阶项）',page:241,source:'book'},
    ],
    tables:[{caption:'组长选择的账本',rows:[
      ['组长 m','淘汰下界','递推','系数和','结果'],
      ['3','$\\approx n/6$','T(n/3)+T(2n/3)+O(n)','1','**O(n lg n) 失败**'],
      ['5','$3n/10$','T(n/5)+T(7n/10)+O(n)','0.9','**O(n)**'],
      ['7','$\\approx 3n/7$…','T(n/7)+T(5n/7)+O(n)','≈0.857','O(n)，常数更大'],
     ]},
     {caption:'第 8/9 章的绕道哲学',rows:[
      ['','线性排序（8.2–8.4）','线性选择（本章）'],
      ['绕过什么','$\\Omega(n\\lg n)$ 排序下界','$\\Theta(n^2)$ 最坏情形'],
      ['代价','输入假设（整数/均匀）','**无假设**（只要求可比较）'],
      ['为什么可能','选择问题本身没有 n lg n 下界',''],
     ]}],
    chart:{xMax:100,series:[
     {name:'主递归 ≤ 7n/10 + 6',expr:'0.7 * n + 6',color:'--viz-done'},
     {name:'选轴 T(n/5)',expr:'0.2 * n',color:'--viz-compare'},
     {name:'cn（代入法目标）',expr:'n',color:'--viol'},
    ]},
    derivations:[
     {kind:'summation',title:'淘汰账：3g/2 从哪来',steps:[
      {zh:'$g$ 组的中位数里，至少 $\\lceil g/2\\rceil$ 个 $\\le x$（$x$ 是它们的中位数）—— 除去 $x$ 自己那组，还有 $\\lceil g/2\\rceil - 1$ 组。'},
      {tex:'(\\lceil g/2\\rceil - 1) \\times 3 + 2 \\ge \\frac{3g}{2}',zh:'每个这样的组里还有 2 个元素 $\\le$ 它的中位数（组内已排序）。黄区同理对称。'},
      {zh:'★ 图景：黄区（必然在高侧）与蓝区（必然在低侧）像两把钳子，把主递归夹在中间的 $\\le 7g/2$ 个元素里。'}]},
     {kind:'summation',title:'代入法：T(n) ≤ cn',steps:[
      {tex:'T(n) \\le c\\lceil n/5\\rceil + c(7n/10 + 6) + an',zh:'代入递推式 (9.1)，$an$ = 分区与前置的线性代价。'},
      {tex:'\\le cn/5 + 7cn/10 + 6c + an = 9cn/10 + an + 6c',zh:'前两项合并：$0.2 + 0.7 = 0.9$ 倍的 $cn$。'},
      {tex:'= cn - (cn/10 - an - 6c) \\le cn',zh:'★ 只要 $c \\ge 10a + 60$：$c/10$ 就能吸收线性项 $an$ 与常数 $6c$。∎ $T(n) = O(n)$。'}]},
     {kind:'summation',title:'为什么组长是 5：收支平衡',steps:[
      {zh:'组长 $m$ 的收支：组内排序花 $\\Theta(n)$（不管 $m$）；选轴递归 $T(n/m)$；主递归 $T((1-\\delta)n)$，$\\delta$ 是淘汰比例。'},
      {tex:'m = 3：\\delta \\approx 1/6,\\ 1/3 + 2/3 = 1 \\Rightarrow O(n\\lg n)',zh:'收支相抵失败 —— 级数发散。'},
      {tex:'m = 5：\\delta = 3/10,\\ 1/5 + 7/10 = 9/10 < 1 \\Rightarrow O(n)',zh:'★ 首个"赢利"的组长 —— 递归的总规模几何收敛。'}]},
    ],
    note:'★ 中心图：两条递归支路的规模（0.7n 与 0.2n）加起来只有 0.9n —— 那消失的 0.1n 就是"每次至少淘汰 30%"的复利。'},
   {type:'prove',title:'Theorem 9.3（正文形式）：SELECT 最坏 Θ(n)',
    statement:'The running time of SELECT on an input of n elements is Θ(n).',
    page:239,
    intro:'★ 证明 = 递推式 (9.1) 的推导 + 代入法。两步：先数淘汰（得到递推式），再代入验证（解递推式）。',
    steps:[
     {title:'第一步 · 前置与分组的线性代价',
      en:'We first determine an upper bound on the time spent outside the recursive calls in lines 16, 23, and 24. The while loop in lines 1–10 executes 0 to 4 times, which is O(1) times. Since the dominant time within the loop is t he computation of the minimum in lines 2–4, which takes Θ(n) time, lines 1–10 execute in O(1) • Θ(n) = O(n) time. The sorting of the 5-element groups in lines 12–13 takes Θ(n) time because each 5-element group takes Θ(1) time to sort (even using an asymptot',
      page:239,
      body:['行 1–10：至多 4 轮、每轮扫一遍 → $O(n)$。',
        '行 12–13：$g$ 组、每组 5 元素排序 $\\Theta(1)$ → $\\Theta(n)$。',
        '行 17 分区：$\\Theta(n)$。**递归之外的总代价 $O(n)$**。']},
     {title:'第二步 · 淘汰论证 → 主递归 ≤ 7n/10',
      en:'But since the low side of the partition excludes the elements in the yellow region, and there are a total of 5g elements, we know that the low side of the partition can contain at most 5g − 3g/2 = 7g/2 ≤ 7n/10 elemen',
      page:240,
      body:['$x$ = 组中位数的中位数：至少一半的组中位数 $\\ge x$（黄区），每条这样的"列"另有 2 个元素 $\\ge$ 中位数 → 黄区 $\\ge 3g/2$。',
        '黄区绝不可能落入低侧 → 低侧 $\\le 5g - 3g/2 = 7g/2 \\le 7n/10$。高侧对称。',
        '**所以行 23/24 的主递归至多 $T(7n/10 + 6)$**（+6 来自余数消除）。']},
     {title:'第三步 · 递推式与代入法',
      en:'We can show that T(n) = O(n) by substitution. More specifically, we’ll prove that T(n) ≤ cn for some suitably large constant c>0 and all n>0.',
      page:240,
      body:['递推式 (9.1)：$T(n) \\le T(\\lceil n/5\\rceil) + T(7n/10 + 6) + O(n)$。',
        '代入 $T(n) \\le cn$：$cn/5 + 7cn/10 + an + 6c = 0.9cn + an + 6c \\le cn$，只要 $c/10 \\ge a + 6c/n$（$n$ 足够大时成立）。',
        '★ **两个递归的系数和 0.9 < 1** —— 这是线性与 $n\\lg n$ 的分水岭。C 程序把"子问题 ≤ 7n/10"做成了断言，每次递归都在检查。∎']},
    ],
    conclusion:'★ 结论：SELECT 最坏 $\\Theta(n)$ —— 无随机、无输入假设。本章三关连起来看：$n-1$（找最小，最优）→ 期望 $n$（随机选择）→ 最坏 $n$（确定选择）。选择问题在比较模型下被完整吃透。',
    note:''},
   {type:'drill',title:'检验一下',
    items:[
     {kind:'single',q:'SELECT 把元素分成 5 个一组。为什么不是 3 个一组？',
      options:['3 个一组根本取不出中位数，必须先对整个组排序才行','组长 3 时递归系数和达到 1，退化为 O(n lg n)','因为 5 是素数，而 3 太小，不足以把数据散开','3 个一组也能取中位数，只是排序那一层的常数太大，不划算'],answer:1,
      why:'★ 组长 3 淘汰比例太小：$T(n/3)+T(2n/3)+O(n)$ 的系数和 = 1 → $O(n\\lg n)$。5 是首个赢利组长。'},
     {kind:'single',q:'SELECT 的选轴递归（第 16 行）的规模是？',
      options:['n/2','n/5','7n/10','⌈lg n⌉'],answer:1,
      why:'★ 对 $g = n/5$ 个组中位数递归找它们的中位数 → $T(n/5)$。'},
     {kind:'single',q:'SELECT 的主递归（第 23/24 行）的子问题规模至多是？',
      options:['n/2','n/5','7n/10','n − 1'],answer:2,
      why:'★ 黄区/蓝区各 ≥ 3g/2 被排除 → 主递归 ≤ 5g − 3g/2 = 7g/2 ≤ 7n/10。'},
     {kind:'single',q:'递推式 T(n) ≤ T(n/5) + T(7n/10) + O(n) 为什么是线性的？',
      options:['因为式子里只有一处线性项，其余都能忽略','因为两个递归的系数和 9/10 < 1','因为只看第二支 $7/10<1$ 就说明是线性','因为分区那一趟本来就是线性时间的'],answer:1,
      why:'★ 代入法：$0.2cn + 0.7cn + an = 0.9cn + an \\le cn$（c 足够大）。系数和 < 1 → 几何收敛。'},
     {kind:'judge',q:'SELECT 需要假设输入元素服从均匀分布。',answer:false,
      why:'★ 原书 p.241 特意对比：第 8 章的线性排序需要输入假设，本章的选择算法**零假设**（只需元素可比较；分析假设互异，退化情形可另行处理）。'},
     {kind:'simulate',q:'g = 10 组时，黄区 + 蓝区合计至少淘汰多少个元素？（填整数，按 2 × 3g/2 算）',expect:[30],placeholder:'例如：25',
      why:'$2 \\times 3g/2 = 3g = 30$。总元素 $5g = 50$，主递归剩 $5g - 3g/2 = 35 = 7n/10$（n = 50）。'},
    ],
    bookExercises:[
     {id:'9.3-1',page:241,star:0,statement:'In the algorithm SELECT , the input elements are divided into groups of 5. Show that the algorithm works in linear time if the input elements are divided into groups of 7 instead of 5.',hint:'组长换成 7，计数套路不变，只有系数变。设 $g = \\lceil n/7 \\rceil$ 组： 至少一半的组（再扣掉含 $x$ 的那组和两个残缺组）中位数 $\\le x$， 每这样一个组里有 **4 个**元素 $\\le x$（中位数本身加它下面的 3 个）， 所以淘汰的是 $4 \\cdot \\lfloor g/2 \\rfloor \\approx 2n/7$ 个，剩下的至多 $5n/7$ —— 别在一句话里写「淘汰 $4n/7$」又写「递归 $5n/7$」，那两个数相加已经超过 $n$ 了。 于是 $T(n) \\le T(n/7) + T(5n/7) + O(n)$，系数和 $\\frac{1}{7}+\\frac{5}{7} = \\frac{6}{7} < 1$， 递归树逐层按 $6/7$ 几何衰减 → 线性。顺便看清 5 为什么是底线：$k=3$ 时两个系数和正好卡在 1，不再线性。'},
     {id:'9.3-3',page:241,star:0,statement:'Show how to use SELECT as a subroutine to make quicksort run in O(n lg n) time in the worst case, assuming that all elements are distinct.',hint:'每次分区前花 $O(n)$ 用 SELECT 找**精确中位数**当轴 → 两侧严格对半，$T(n) = 2T(n/2) + O(n) = O(n\\lg n)$，最坏成立。'},
     {id:'9.3-5',page:242,star:0,statement:'Show how to determine the median of a 5-element set using only 6 comparisons.',hint:'「见原书提示」不算答案。给一套真能只用 6 次的流程（记五个数为 $a,b,c,d,e$， 每次比较后按结果重命名，保持 $a < b$、$c < d$、$a < c$）： 第 1、2 次：比 $a{:}b$ 和 $c{:}d$，小的记作 $a$、$c$。 第 3 次：比 $a$ 与 $c$，必要时把两对整体交换，于是 $a$ 是这四个里的最小者，出局。 第 4 次：**比 $b$ 与 $e$**（关键在这里——把旁观者拉进来，而不是继续比 $b{:}d$； 先把四个数排明白再插 $e$，最坏就要 7 次）。然后分两支，每支再花 2 次： 若 $b < e$：第 5 次比 $b{:}c$ —— $b < c$ 时第 6 次比 $c{:}e$，中位数取两者中小的那个； $c < b$ 时第 6 次比 $b{:}d$，中位数取小的那个。 若 $e < b$：第 5 次比 $c{:}e$ —— $c < e$ 时第 6 次比 $d{:}e$，取小的那个； $e < c$ 时第 6 次比 $b{:}c$，取小的那个。 这套流程本轮已用 120 种全排列逐个跑过：全部给出正确的第 3 小，最坏 6 次比较。 顺手纠正一处：$\\lceil\\lg 5!\\rceil = 7$ 是「确定全序」的下界， 只问中位数不需要全序，所以 6 次够，别说成「信息论下界以下」。'},
     {id:'9.3-6',page:242,star:0,statement:'You have a "black-box" worst-case linear-time median subroutine. Give a simple, linear-time algorithm that solves the selection problem for an arbitrary order statistic.',hint:'用中位数当轴做一次分区：若 $i = k$ 完成；否则只在包含答案的一侧**再次调用黑箱**（而不是递归 SELECT）—— 每层 $O(n)$，每次规模减半？不：黑箱每次给真中位数 → 规模严格减半 → $\\sum n/2^j = 2n$。'},
     {id:'9.3-7',page:242,star:0,statement:'Professor Olay is consulting for an oil company, which is planning a large pipeline running east to west through an oil field of n wells. The company wants to connect a spur pipeline from each well directly to the main pipeline along a shortest route (either north or south), as shown in Figure 9.4. Given the x - and y -coordinates of the wells, how should the professor pick an optimal location of the main pipeline to minimize the total length of the spurs? Show how to determine an optimal location in linear time.',hint:'主管是一条东西向直线，设它的纵坐标为 $y$：第 $i$ 口井的支管长 $|y_i - y|$，要最小化 $\\sum_i |y_i - y|$ —— 取最小点恰是 $y$ 的**中位数**：把 $y$ 从最下往上推，这个和是分段线性的，斜率 = 下方的点数 $-$ 上方的点数，跨过一口井斜率就变一次；两侧点数相等（中位数）时斜率由负转正，和到最小。用第 9 章的 SELECT 找中位数，$\\Theta(n)$；证明部分按上面那句「跨过一点变化多少」写即可。★ 若点数是偶数，两个中间点之间任意位置都行。'},
     {id:'9.3-9',page:243,star:0,statement:'Describe an O(n)-time algorithm that, given a set S of n distinct numbers and a positive integer k ≤ n, determines the k numbers in S that are closest to the median of S .',hint:'SELECT 找中位数 $m$（$O(n)$）→ 对每个数算 $|x - m|$ → 用 SELECT 找这些距离的第 $k$ 小 $d$（$O(n)$）→ 线性扫描：先把所有 $|x-m| < d$ 的元素全部输出，再从 $|x-m| = d$ 的元素里任意补足到恰好 $k$ 个（$O(n)$）。★ 不能直接输出 $|x-m| \\le d$ 的那批：第 $k$ 小的距离常常有平手，这样会输出多于 $k$ 个。例：$S = \\{1,2,3,4,5\\}$，$m = 3$，距离多重集是 $\\{0,1,1,2,2\\}$，$d = 2$ 时 $\\le d$ 的有 5 个而不是 4 个。总 $O(n)$。'},
    ]},
  ],
};
