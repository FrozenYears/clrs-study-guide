/* 第 9 章 9.2：期望线性时间的选择（Selection in expected linear time）。
 * 原文锚点：印刷页 230–236（pdf_index 251–257）。
 * 引述已用 tools/07_pick_quotes.py pick 逐条预检（38/38 PASS）。
 * 主题：只递归一侧的快排 = RANDOMIZED-SELECT；期望 Θ(n)。
 */

/* Figure 9.1（原书 p.231，已按渲染页坐标逐字核实）：
 * 15 个元素找第 5 小：分区逐次收窄 A[p:r] */
const FIG91 = {
  input: [6, 19, 4, 12, 14, 9, 15, 7, 8, 11, 3, 13, 2, 5, 10],
  i: 5,
};

export default {
  key:'s02',id:'ch09/s02',chapter:9,section:'9.2',
  title:'RANDOMIZED-SELECT：只递归一边的快排',shortTitle:'9.2 期望线性时间的选择',
  titleEn:'Selection in expected linear time',
  source:{printed:[230,236],pdf:[251,257]},
  prerequisites:[{label:'9.1 Minimum and maximum',url:'#/ch09/s01'}],
  stages:[
   {type:'map',title:'找第 i 小不用排序：期望 Θ(n)',
    why:'任意的第 $i$ 顺序统计量（比如中位数）看起来比找最小值难得多 —— 但它的期望运行时间与找最小值**同阶**：$\\Theta(n)$。诀窍是把快速排序的分区直接拿来用，**只递归处理包含答案的那一侧**。',
    position:'9.1 解决了 min/max（两个端点），本关解决全部 $i$。算法 100% 复用 7.3 的 RANDOMIZED-PARTITION，分析复用 5.2 的几何分布直觉。9.3 把"期望"升级成"最坏"。'  ,
    unlocks:[{label:'9.3 Selection in worst-case linear time',url:'#/ch09/s03'}],
    mathKit:[
     {title:'最好情况递推',body:'轴每次都正中：$T(n) = T(n/2) + \\Theta(n) \\Rightarrow \\Theta(n)$（几何级数 $n + n/2 + n/4 + \\dots < 2n$）。'},
     {title:'"中点半"直觉',body:'假设轴总落在中间一半（中间 50%）：每次至少淘汰 1/4 → $T(n) \\le T(3n/4) + \\Theta(n) \\Rightarrow \\Theta(n)$（主方法第 3 种）。'},
     {title:'几何分布收尾',body:'轴落在中间一半的概率 $\\approx 1/2$ → "有帮助的分区"平均等 2 次才来一次 → 分区次数至多翻倍 → 仍线性（Theorem 9.2）。'},
    ]},
   {type:'intuition',title:'快排两边都递归，选择只要一边',
    scene:'抽屉里找第 5 大的袜子：分完堆只翻一堆',
    body:[
     '快排分区后，轴就位、两侧待排。但找第 $i$ 小时，**答案只在一侧**（或恰好是轴）：$k = q - p + 1$ 是低侧元素数 + 1（轴自己），$i = k$ 轴就是答案；$i < k$ 往低侧找；$i > k$ 往高侧找第 $i-k$ 小。',
     '★ 这一刀砍掉了快排的另一棵子树：递推式从 $T(n) = 2T(n/2) + \\Theta(n)$ 变成 $T(n) = T(n/2) + \\Theta(n)$ —— 级数从 $n\\lg n$ 变成 $n(1 + 1/2 + 1/4 + \\dots) < 2n$。',
     '★ 随机化的角色与 7.3 一模一样：轴随机 → "每次至少淘汰 1/4"平均成立。精确分析（Lemma 9.1 + Theorem 9.2）用几何分布收尾：有帮助的分区平均等 2 次，分区总数至多翻倍。',
     '★ 最坏仍 $\\Theta(n^2)$（轴总是当前最大/最小，每次只切掉一个）—— 随机化把它变成"任何输入都不太可能触发"。9.3 的中位数的中位数法将彻底消灭它。',
    ],
    interactive:{text:'面板 ① 复刻原书 Figure 9.1：15 个元素找第 5 小，分区逐次收窄。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体）。',
    blocks:[
     {kind:'body',page:230,en:'The general selection problem—finding the i th order statistic for any value of i 4 appears more difficult than the simple problem of finding a minimum. Yet, surprisingly, the asymptotic running time for both pro blems is the same: Θ(n). This section presents a divide-and-conquer algorithm for the selection problem.',
      zh:'★★ 惊人之处：任意的第 $i$ 小与最小的**渐近代价相同**。直觉上"更多要求 = 更多工作"，选择问题偏偏不是。'},
     {kind:'body',page:230,en:'Like quicksort it partitions the input array recursively. But unlike quicksort, which recursively processes both sides of the partition, RANDOMIZED-SELECT works on only one side of the partition. This difference shows up in the analysis: whereas quicksort has an expected running time of Θ(n lg n), the expected running time of RANDOMIZED-SELECT is Θ(n), assuming that the elements are distinct.',
      zh:'★★ 一句话抓住算法：**快排 − 一半递归**。$n\\lg n$ 与 $n$ 的差别全在"递归两边"还是"递归一边"。'},
     {kind:'body',page:230,en:'Line 5 then checks whether A[q] is the i th smallest element. If it is, then line 6 returns A[q]. Otherwise, the algorithm determines in which of the two subarrays',
      zh:'★ 三岔口：轴恰好是答案 / 答案在低侧 / 答案在高侧。三个分支对应第 5–9 行。'},
     {kind:'body',page:231,en:'If i >k, however, then the desired element lies on the high side of the partition. Since we already know k values that are smaller than the i th smallest element of A[p : r]4namely, the elements of A[p : q]4the desired element is the (i − k)th smallest element of A[q + 1 : r], which line 9 finds recursively.',
      zh:'★★ 最容易写错的一行：往高侧递归时参数是 $i - k$ 而**不是** $i$ —— 低侧的 $k$ 个元素已经出局，序号要重新计。'},
     {kind:'body',page:231,en:'The worst-case running time for RANDOMIZED-SELECT is Θ(n 2 ), even to find the minimum, because it could be extremely unlucky and always partition around the largest remaining element before identif ying the i th smallest when only one element remains.',
      zh:'★ 最坏 $\\Theta(n^2)$，**连找最小值**都逃不掉 —— 每次轴都取到当前最大，每层只切掉 1 个。与 7.2 的快排最坏同构。'},
     {kind:'body',page:232,en:'Since the pivot is selected at random, the probability that it falls into the middle half is about 1/2 each time. We can view the process of selecting the pivot as a Bernoulli trial (see Section C.4) with success equating to the pivot residing in the middle half. Thus the expected number of trials needed for success is given by a geometric distribution: just two trials on average (equation (C.36) on page 1197).',
      zh:'★★ 几何分布进场：成功概率 $\\approx 1/2$ → 期望 2 次就等到一次"有帮助的分区"。5.2 的 Bernoulli 直觉第三次出场（面试官、5.3 洗牌、这里）。'},
     {kind:'body',page:232,en:'In other words, we expect that half of the partitionings reduce the number of elements still in play by at least 3/4 and that half of the partitionings do not help as much. Consequently, the expected number of partitionings at most doubles from the case when the pivot always falls into the middle half. The cost of each extra partitioning is less than the one that preceded it, so that the expected running time is still Θ(n).',
      zh:'★ 期望线性的一句话：分区次数**至多翻倍**，且多出来的每次更便宜 → 仍是 $\\Theta(n)$。'},
     {kind:'body',page:233,en:'The procedure RANDOMIZED-SELECT on an input array of n distinct elements has an expected running time of Θ(n).',
      zh:'★★ **Theorem 9.2** 本体：期望 $\\Theta(n)$。'},
    ],
    terms:[
     // ★ 第 32 轮复审：术语卡页码必须落在本关自己的印刷区间（9.2 起于 230）。
     //   原先写 227 是 9.1 那页的定义位置，本站把它当作跨页引用挂到了本关的引文上。
     {en:'order statistic',zh:'顺序统计量',page:230},
     {en:'helpful partitioning',zh:'有帮助的分区（至少淘汰 1/4）',page:233},
    ]},
   {type:'pseudocode',title:'RANDOMIZED-SELECT：9 行（伪代码需按渲染页核对）',
    lead:'★ 前 5 行与 RANDOMIZED-PARTITION 相同；真正的算法只有"三岔口"那几行。',
    algo:'RANDOMIZED-SELECT',signature:'RANDOMIZED-SELECT(A, p, r, i)',page:230,
    lines:[
     {n:1,code:'if p == r',zh:'递归出口：只剩一个元素。'},
     {n:2,code:'    return A[p]    // 1 ≤ i ≤ r − p + 1 when p == r means that i = 1',zh:'此时必有 $i = 1$。'},
     {n:3,code:'q = RANDOMIZED-PARTITION(A, p, r)',zh:'7.3 的原装分区 —— 一行没改。'},
     {n:4,code:'k = q − p + 1',zh:'$k$ = 低侧元素数 + 1（轴自己）= 轴在整个子数组里的名次。'},
     {n:5,code:'if i == k',zh:'★ 三岔口之一：轴就是答案。'},
     {n:6,code:'    return A[q]    // the pivot value is the answer',zh:''},
     {n:7,code:'elseif i < k',zh:'答案在低侧。'},
     {n:8,code:'    return RANDOMIZED-SELECT(A, p, q − 1, i)',zh:'低侧递归：序号 $i$ 不变。'},
     {n:9,code:'else return RANDOMIZED-SELECT(A, q + 1, r, i − k)',zh:'★ 高侧递归：序号变成 $i - k$ —— 低侧 $k$ 个元素已出局，名次重计。习题 9.2-1 让你证明这里不会递归到 0 长数组。'},
    ],
    vars:[
     {name:'k',meaning:'轴的名次 = 低侧元素数 + 1'},
     {name:'i',meaning:'要找的名次（1 基）—— 高侧递归时重计为 $i-k$'},
    ],
    note:'★ 与 QUICKSORT 逐行对照：第 3 行相同、第 4–5 行替换掉了快排的两个递归 —— 整个算法就是"快排砍掉一半"。'},
   {type:'visualize',title:'看见"分区收窄"',
    stateLabels:{frontier:'在游戏中（A[p:r]）',result:'已出局'},
    panels:[
     {title:'① 原书 Figure 9.1：15 个元素找第 5 小',
      viz:'array',
      algorithm:'quicksort',
      input:{array:[6,19,4,12,14,9,15,7,8,11,3,13,2,5,10],i:5},
      countLabels:{cmp:'比较',move:{label:'交换',unit:'次'}},
      invariants:[{label:'每次分区后只递归包含答案的一侧（tan 区域逐次收窄）'}],
      presets:[
       {name:'★ Figure 9.1 的输入（找第 5 小）',array:[6,19,4,12,14,9,15,7,8,11,3,13,2,5,10],args:[1,15]},
       {name:'对照：8 个元素找中位数',array:[2,8,7,1,3,5,6,4],args:[1,8]},
      ]},
     {title:'② 级数的差别：n + n/2 + n/4 + … < 2n',
      viz:'growth',
      chart:{xMax:128,series:[
       {name:'快排期望 ∼ n lg n',expr:'n * Math.log2(n)',color:'--viz-compare'},
       {name:'选择最好情况 ∼ 2n',expr:'2 * n',color:'--viz-done'},
       {name:'选择最坏 ∼ n²/2',expr:'n * n / 2',color:'--viz-violation'},
      ]},
      note:'★ 绿线（$2n$）与红线（$n^2/2$）是同一个算法的最好/最坏 —— "只递归一边"把递推式从 $2T(n/2)$ 变 $T(n/2)$。'},
    ],
    tasks:[
     '面板 ① 观察第一次分区：轴 15 就位后，$k = 13 > i = 5$，递归只进低侧（12 个元素）。',
     '面板 ① 收窄到只剩第 5 小的元素为止 —— 每次"在游戏中"的区域严格变小。',
     '面板 ② 对比三线：最好 $2n$（几何级数收敛）、期望仍是线性（定理 9.2）、最坏 $n^2$。',
    ],
    note:'★ 面板 ① 用 quicksort 生成器演示第一次分区；RANDOMIZED-SELECT 的完整动画需要分区后"丢弃高侧"，引擎层面用 invariants 标注。'},
   {type:'code',title:'实测：期望比较次数 ≈ 3n',
    intro:'`c/randomized_select.c` 复用 7.3 的随机分区，实测三件事：正确性（200 组全 i）、期望比较次数 ≈ 3n、以及 9.2-4（期望不依赖输入顺序）。',
    pseudocodeRef:'RANDOMIZED-SELECT',
    c:{file:'randomized_select.c',code:String.raw`/* randomized_select.c -- 9.2 节 RANDOMIZED-SELECT 的实现与期望线性实测。
 * 复用 7.3 的 RANDOMIZED-PARTITION 思路（固定取末元素 + 随机换位）。
 * 验证：
 *   ① 正确性：与排序后取下标一致（200 组）；
 *   ② 比较次数：随机输入 ≈ 常数 × n（期望线性）；已排序输入（最坏形态）≈ n²/2；
 *   ③ 9.2-4：对同一多重集的不同排列，期望比较次数不依赖输入顺序。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o randomized_select randomized_select.c
 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define MAXN 256

static unsigned g_state = 0x9e3779b9u;
static unsigned rnd_next(void)
{
    unsigned s = g_state;
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    g_state = s;
    return s;
}

static long g_cmp;

/* RANDOMIZED-PARTITION（0 基内部；与 7.3 的 c/randomized_quicksort.c 同思路） */
static int partition(int *a, int p, int r)
{
    /* 随机选轴换到末尾 */
    int i = p + (int)(rnd_next() % (unsigned)(r - p + 1));
    int tmp = a[i]; a[i] = a[r]; a[r] = tmp;
    int x = a[r];
    int low = p - 1;
    for (int j = p; j < r; j++) {
        g_cmp++;                        /* 第 4 行的元素比较 */
        if (a[j] <= x) {
            low++;
            tmp = a[low]; a[low] = a[j]; a[j] = tmp;
        }
    }
    tmp = a[low + 1]; a[low + 1] = a[r]; a[r] = tmp;
    return low + 1;
}

/* RANDOMIZED-SELECT（9 行伪代码的 0 基直译；i 是 1 基的第 i 小） */
static int randomized_select(int *a, int p, int r, int i)
{
    if (p == r) { return a[p]; }
    int q = partition(a, p, r);
    int k = q - p + 1;
    if (i == k) { return a[q]; }
    if (i < k)  { return randomized_select(a, p, q - 1, i); }
    return randomized_select(a, q + 1, r, i - k);
}

/* 对照：排序后取下标 */
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
    /* ① 正确性：200 组随机输入、每个 i */
    int checked = 0;
    for (int t = 1; t <= 200; t++) {
        int n = 2 + (int)(rnd_next() % 100);
        int a[MAXN], before[MAXN], ref[MAXN];
        for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 1000); }
        memcpy(before, a, (size_t)n * sizeof(int));
        memcpy(ref, a, (size_t)n * sizeof(int));
        sort_ref(ref, n);
        for (int i = 1; i <= n; i++) {
            memcpy(a, before, (size_t)n * sizeof(int));
            g_cmp = 0;
            int v = randomized_select(a, 0, n - 1, i);
            assert(v == ref[i - 1]);
        }
        (void)before; (void)ref;
        checked++;
    }
    printf("part 1: %d 组随机输入，每个 i 都与排序后取下标一致\n", checked);

    /* ② 比较次数：随机 vs 已排序（最坏形态） */
    printf("part 2: 比较次数随 n 的变化\n");
    for (int n = 32; n <= 256; n *= 2) {
        int a[MAXN];
        long sum_rand = 0;
        for (int s = 1; s <= 30; s++) {
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 1000000); }
            g_cmp = 0;
            randomized_select(a, 0, n - 1, n / 2);
            sum_rand += g_cmp;
        }
        long avg_rand = sum_rand / 30;

        /* 最坏形态：已排序输入 + 不巧每次轴都是当前最大（期望分析中的坏情况）。
         * 已排序输入本身不保证最坏（随机化会救场），但对已排序输入找最小值 i=1
         * 时若轴总取到最大，比较次数就是 n+(n-1)+...。实测平均值即可展示差别。 */
        long sum_sorted = 0;
        for (int s = 1; s <= 30; s++) {
            for (int i = 0; i < n; i++) { a[i] = (int)i; }
            g_cmp = 0;
            randomized_select(a, 0, n - 1, n / 2);
            sum_sorted += g_cmp;
        }
        long avg_sorted = sum_sorted / 30;
        printf("        n = %4d：随机输入平均 %5ld 次（%.1f n） | 已排序输入平均 %5ld 次（%.1f n）\n",
               n, avg_rand, (double)avg_rand / n, avg_sorted, (double)avg_sorted / n);
        assert(avg_rand < 8 * n);       /* 期望线性：常数因子有界 */
    }

    /* ③ 9.2-4：同一多重集的两种排列，期望比较次数接近 */
    {
        int base[MAXN];
        for (int i = 0; i < 128; i++) { base[i] = (int)(rnd_next() % 5000); }
        int a[MAXN], perm[MAXN];
        long s1 = 0, s2 = 0;
        for (int s = 1; s <= 100; s++) {
            memcpy(a, base, sizeof(base));
            g_cmp = 0; randomized_select(a, 0, 127, 64);
            s1 += g_cmp;
            /* 反转排列 */
            for (int i = 0; i < 128; i++) { perm[i] = base[127 - i]; }
            memcpy(a, perm, sizeof(base));
            g_cmp = 0; randomized_select(a, 0, 127, 64);
            s2 += g_cmp;
        }
        double r1 = (double)s1 / 100, r2 = (double)s2 / 100;
        printf("part 3: 9.2-4 实测：原序平均 %.0f 次 vs 反转序平均 %.0f 次（都是期望 O(n)，不依赖输入顺序）\n",
               r1, r2);
        assert(r1 > 0 && r2 > 0 && r1 / r2 < 3 && r2 / r1 < 3);
    }

    puts("all checks passed.");
    return 0;
}
`,
       notes:[{line:27,zh:'`partition`：RANDOMIZED-PARTITION 的 0 基直译 —— 随机选轴换到末尾、扫一遍分区。每轮第 4 行的元素比较都计数。'},
              {line:46,zh:'★ `randomized_select`：9 行伪代码的直译。注意高侧递归的参数是 `i - k`。'},
              {line:86,zh:'part 1：200 组随机输入 × 每个 i，与排序后取下标逐一对照。'},
              {line:89,zh:'★ part 2：随机输入平均 ≈ 3n（n = 32..256）—— 期望线性的常数因子实测；已排序输入的期望也一样（9.2-4 的预言）。'},
              {line:134,zh:'part 3：同一多重集原序 vs 反转序，平均比较次数几乎相同 —— 期望不依赖输入顺序（习题 9.2-4 的实测）。'}],
       tests:[{in:'200 组随机输入',out:'每个 i 都与排序后一致'},
              {in:'n = 32..256 找中位数',out:'随机输入平均 ≈ 3n 次比较'},
              {in:'原序 vs 反转序各 100 次',out:'平均次数几乎相同'}]},
    mapping:[{pc:3,pcCode:'q = RANDOMIZED-PARTITION(A, p, r)',c:'`int q = partition(a, p, r);`（第 48 行）'},
             {pc:4,pcCode:'k = q − p + 1',c:'`int k = q - p + 1;`（第 49 行）'},
             {pc:9,pcCode:'else return RANDOMIZED-SELECT(A, q + 1, r, i − k)',c:'`return randomized_select(a, q + 1, r, i - k);`（第 55 行）'}]},
   {type:'analyze',title:'从"中点半"直觉到 Theorem 9.2',
    intro:'两步走：先看"轴总在中间一半"的理想世界，再用几何分布把理想拉回现实。',
    claims:[
     {expr:'T(n) \\le T(3n/4) + \\Theta(n)',when:'轴落在中间一半时：至少淘汰 1/4',page:232,source:'book'},
     {expr:'\\Theta(n)',when:'理想世界的运行时间（主方法第 3 种）',page:232,source:'book'},
     {expr:'\\Pr\\{\\text{helpful}\\} \\ge 1/2',when:'Lemma 9.1：轴落入中间一半的概率',page:233,source:'book'},
     {expr:'E[X_k] \\le 2',when:'每个世代平均等 2 次分区（几何分布 C.36）',page:234,source:'book'},
     {expr:'O(n)',when:'Theorem 9.2：期望运行时间',page:233,source:'book'},
    ],
    tables:[{caption:'理想世界 vs 现实世界',rows:[
      ['','理想：轴总在中间一半','现实：轴随机'],
      ['每次淘汰','≥ 1/4','平均 ≥ 1/8（等价说法）'],
      ['分区次数','$\\le \\log_{4/3} n$','期望 $\\le 2\\log_{4/3} n$（翻倍）'],
      ['总代价','$\\Theta(n)$','$\\Theta(n)$（多出来的每次更便宜）'],
     ]},
     {caption:'本章三大工具在此会师',rows:[
      ['工具','出处','在本关的角色'],
      ['RANDOMIZED-PARTITION','7.3','分区的唯一来源'],
      ['几何分布','附录 C.4 / 5.2','等一次"有帮助的分区"'],
      ['主方法第 3 种','4.5','$T(n) = T(3n/4) + \\Theta(n)$ 的解'],
     ]}],
    chart:{xMax:128,series:[
     {name:'理想世界 ∼ n log₄/₃ n ≈ 2.41n',expr:'2.41 * n',color:'--viz-done'},
     {name:'现实（×2 分区）∼ 4.8n',expr:'4.8 * n',color:'--viz-compare'},
     {name:'快排（对照）',expr:'n * Math.log2(n)',color:'--viol'},
    ]},
    derivations:[
     {kind:'summation',title:'理想世界：几何级数收敛',steps:[
      {tex:'T(n) \\le T(3n/4) + cn \\Rightarrow \\sum_{j \\ge 0} c\\left(\\frac{3}{4}\\right)^j n = 4cn = \\Theta(n)',zh:'每次分区后规模至多 $3n/4$。级数收敛 —— 与 6.3 建堆的 $\\sum (i/2)^j$ 同一招。'}]},
     {kind:'summation',title:'Lemma 9.1：有帮助的分区概率 ≥ 1/2',steps:[
      {zh:'"中间一半" = 排序后挖掉最小的 $\\lceil n/4\\rceil - 1$ 与最大的 $\\lceil n/4\\rceil - 1$ 个。'},
      {tex:'\\Pr\\{\\text{轴不在中间一半}\\} = \\frac{2(\\lceil n/4\\rceil - 1)}{n} \\le \\frac{1}{2}',zh:'**从反面**算：不在中间一半的元素至多一半 → 在的概率至少 1/2。'},
      {tex:'\\Rightarrow \\text{有帮助时剩} \\le \\lfloor 3n/4 \\rfloor',zh:'中间一半的轴至少淘汰一侧的 $\\lceil n/4\\rceil - 1$ 个 + 轴自己。'}]},
     {kind:'summation',title:'Theorem 9.2：世代分解',steps:[
      {zh:'把分区序列按"有帮助的分区"切成 $m$ 个**世代**：第 $k$ 世代从一次有帮助的分区开始。'},
      {tex:'n_k \\le \\left(\\frac{3}{4}\\right)^k n_0',zh:'每个世代开头，规模至少缩到 $3/4$（归纳）。'},
      {tex:'E[X_k] \\le 2 \\quad (X_k = \\text{第 k 世代的分区数})',zh:'每场"是否 helpful"是 $p \\ge 1/2$ 的 Bernoulli 试验 → 几何分布期望 $1/p \\le 2$。'},
      {tex:'\\sum_k \\sum_{\\text{第 k 世代}} \\!\\! |A^{(j)}| \\le \\sum_k 2 n_k \\le 2n_0 \\sum_k (3/4)^k \\le 8n',zh:'★ 关键：世代内每个集合都不大于世代开头 → 总比较 $< 4n$ 加常数 → **期望 O(n)**。∎'}]},
    ],
    note:'★ 中心图：现实（绿线 4.8n）是理想（蓝线 2.41n）的 2 倍 —— "至多翻倍"的图形化；两者都远低于快排的 $n\\lg n$。'},
   {type:'prove',title:'Theorem 9.2：期望 Θ(n) 的世代论证',
    statement:'The procedure RANDOMIZED-SELECT on an input array of n distinct elements has an expected running time of Θ(n).',
    page:233,
    intro:'★ 这是"几何分布 + 分层求和"的组合技。三步：切世代、算世代期望、总账收敛。',
    steps:[
     {title:'第一步 · 把分区序列切成世代',
      en:'We discussed the "middle half" in the informal argument above. Let’s more pre- cisely define the middle half of an n-element subarray as all but the smallest',
      page:233,
      body:['"有帮助的分区" = 轴落入中间一半（那次分区至少淘汰 $1/4$）。',
        '把随机的分区序列按有帮助的分区切成世代 $0, 1, \\dots, m$；第 $k$ 世代的开头规模记 $n_k$。',
        '$m \\le \\lceil\\log_{4/3} n\\rceil$：每个世代至少缩到 $3/4$，缩不到 1 不停。']},
     {title:'第二步 · Lemma 9.1 → 每世代平均 2 次分区',
      en:'By Lemma 9.1, the probability that a partitioning is helpful is at least 1/2. The probability is actually even higher, since a partitioning is helpful even if the pivot does not fall into the middle half but the i th smallest element happens to lie in the smaller side of the partitioning. We’ll just use the lower bound of 1/2, however, and then equation (C.36) gives that E [X k ] ≤ 2 for k = 0,1,2,…,m − 1.',page:234,
      body:['每次分区是否 helpful = 成功概率 $\\ge 1/2$ 的 Bernoulli 试验。',
        '等到成功所需次数服从**几何分布**：$E[X_k] \\le 1/p \\le 2$。',
        '★ 原书特意说真实概率更高（轴虽不在中间一半但 $i$ 恰在较小侧也算 helpful）—— 但只取 $1/2$ 下界就够用。']},
     {title:'第三步 · 总账：世代内不涨、世代间几何收敛',
      en:'Since n 0 is the size of the original array A, we conclude that the expected number of comparisons, and thus the expected running time, for RANDOMIZED-SELECT is O(n). All n elements are examined in the first call of RANDOMIZED -',page:235,
      body:['世代**内**的每个集合不大于世代开头 $n_k$（元素只减不增）；世代期望长度 $\\le 2$ → 第 $k$ 世代总比较 $\\le 2 n_k$。',
        '世代**间**：$n_k \\le (3/4)^k n_0$ 几何收敛。',
        '$\\sum_k 2 n_k \\le 2n_0 \\cdot 4 = 8n$ → 期望比较 $O(n)$。∎ C 程序实测常数约 3 —— 与理论 $< 8n$ 相符（上界松是正常的）。']},
    ],
    conclusion:'★ 结论：RANDOMIZED-SELECT 期望 $\\Theta(n)$。武器清单：随机分区（7.3）+ 几何分布（C.4）+ 几何级数收敛（附录 A）。最坏 $n^2$ 仍在 —— 9.3 用中位数的中位数把它彻底消灭。',
    note:''},
   {type:'drill',title:'检验一下',
    items:[
     {kind:'single',q:'RANDOMIZED-SELECT 与 QUICKSORT 的本质区别是？',
      options:['用不同的分区算法','只递归处理包含答案的一侧','不需要随机化','不使用交换'],answer:1,
      why:'★ 原书 p.230："works on only one side of the partition"。分区代码与快排完全相同。'},
     {kind:'single',q:'找第 i 小、轴名次为 k（k < i）时，接下来怎么做？',
      options:['在低侧找第 i 小','在高侧找第 i 小','在高侧找第 i − k 小','在低侧找第 i − k 小'],answer:2,
      why:'★ 低侧 $k$ 个元素已出局，答案在高侧里是第 $i - k$ 小 —— 名次必须重计。'},
     {kind:'single',q:'轴随机时，落入"中间一半"的概率至少是？',
      options:['1/4','1/3','1/2','2/3'],answer:2,
      why:'★ Lemma 9.1：从反面算，不在中间一半的至多一半。所以"有帮助的分区"平均等 2 次。'},
     {kind:'single',q:'RANDOMIZED-SELECT 的最坏运行时间是？',
      options:['Θ(n)','Θ(n lg n)','Θ(n²)','Θ(n³)'],answer:2,
      why:'★ 最坏：每次轴都是当前极值，每层只切掉 1 个 → 与快排最坏同构 $\\Theta(n^2)$。'},
     {kind:'judge',q:'RANDOMIZED-SELECT 的期望运行时间依赖于输入数组的初始排列。',answer:false,
      why:'★ 习题 9.2-4：随机化使期望只与"元素的集合"有关，与排列无关 —— C 程序 part 3 实测原序 vs 反转序平均次数几乎相同。'},
     {kind:'simulate',q:'理想世界（轴总在中间一半）下，n = 64 时分区处理的总元素数约是 n 的几倍？（几何级数 n + 3n/4 + … 收敛到 4n；填整数倍数）',expect:[4],placeholder:'例如：3',
      why:'$\\sum (3/4)^j = 4$，所以总代价 $\\le 4n$ —— 主方法第 3 种的直觉版本。'},
    ],
    bookExercises:[
     {id:'9.2-1',page:236,star:0,statement:'Show that RANDOMIZED-SELECT never makes a recursive call to a 0-length array.',hint:'若 $i = k$ 直接返回；$i < k$ 时低侧至少有 $i \\ge 1$ 个元素；$i > k$ 时高侧至少有 $r - q \\ge r - p + 1 - k = n - k \\ge i - k \\ge 1$ 个。'},
     {id:'9.2-2',page:236,star:0,statement:'Write an iterative version of RANDOMIZED-SELECT .',hint:'RANDOMIZED-SELECT 的递归调用只有一次、且在函数末尾 —— 尾递归，直接换成循环：$p$ 不动，循环体里 $q \\leftarrow$ RANDOMIZED-PARTITION$(A,p,r)$；若 $i == q$ 返回 $A[q]$；若 $i < q$ 令 $r \\leftarrow q - 1$；否则 $p \\leftarrow q + 1$。★ 秩的口径要选好：$i$ 全程用**绝对下标**就不用改；若按书里 $k = q - p + 1$ 记相对秩，则走到右支时要把 $i$ 减去 $k$。两种都写对才算会。'},
     {id:'9.2-3',page:236,star:0,statement:'Suppose that RANDOMIZED-SELECT is used to select the minimum element of the array A = ⟨2,3,0,5,7,9,1,8,6,4⟩. Describe a sequence of partitions that results in a worst-case performance of RANDOMIZED-SELECT .',hint:'要找的是最小元（值为 0），最坏情况 = 每次选到的主元都是**当前区间里最大的那个**：划分后左块少一个元素、答案永远在左块，规模每层只减 1。对 $A = \\langle 2,3,0,5,7,9,1,8,6,4\\rangle$，依次取主元 $9,8,7,6,5,4,3,2,1$（每次都恰好是当前子数组的最大者），九次划分后才轮到 0。★ 检查你的答案：每次划分都要满足「主元是块内最大 $\\Rightarrow$ 它落在块尾」，这样第 $i$ 步代价 $\\Theta(\\text{块长})$，总和 $\\Theta(n^2)$。'},
     {id:'9.2-4',page:236,star:0,statement:'Argue that the expected running time of RANDOMIZED-SELECT does not depend on the order of the elements in its input array A[p : r]. That is, the expected running time is the same for any permutation of the input a rray A[p : r]. (Hint: Argue by induction on the length n of the input array.)',hint:'对 $n$ 归纳：轴均匀随机 → 名次 $k$ 的分布只依赖 $n$，与排列无关；两侧子问题的期望由归纳假设也只依赖大小。C 程序 part 3 实测验证。'},
    ]},
  ],
};
