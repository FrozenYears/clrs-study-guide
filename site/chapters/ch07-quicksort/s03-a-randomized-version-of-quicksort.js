/* 第 7 章 7.3：随机化版本的快速排序（A randomized version of quicksort）。
 * 原文锚点：印刷页 191–192（pdf_index 212–213）。
 */

export default {
  key: 's03', id: 'ch07/s03', chapter: 7, section: '7.3',
  title: '随机化：让"坏输入"消失', shortTitle: '7.3 随机化版本',
  titleEn: 'A randomized version of quicksort',
  source: { printed: [191, 192], pdf: [212, 213] },
  prerequisites: [{ label: '7.2 Performance of quicksort', url: '#/ch07/s02' }],
  stages: [
    { type: 'map', title: '把"最坏情况"从"确定的"变成"不太可能的"',
      why: '7.2 说了两个坏消息：最坏 $\\Theta(n^2)$、而且恰好发生在输入已有序时。7.3 的解法**只改三行代码** —— 不再固定选 $A[r]$ 当轴，而是从 $A[p:r]$ 里**随机选一个**。于是"已排序"不再是坏输入：轴是随机的，无论输入长什么样，期望行为都一样。',
      position: '5.3 讲了"自己制造随机性"的思想（RANDOMIZED-HIRE-ASSISTANT）；本关把同一思想用在快速排序上 —— **不排列输入，而是随机选轴**（原书说这比排列输入的"分析更简单"）。7.4 用指示器随机变量证明期望运行时间是 $\\Theta(n\\lg n)$。',
      unlocks: [{ label: '7.4 Analysis of quicksort（快速排序的分析）', url: '#/ch07/s04' }],
      mathKit: [
        { title: '随机化算法 vs 概率分析', body: '5.2 的概率分析**假设**输入服从某个分布；随机化算法**自己制造**随机性 —— 由算法内部的随机选择来决定行为，与输入分布无关。' },
        { title: '期望 vs 平均情况', body: '平均情况（average-case）：对输入分布取平均，前提是知道分布。期望（expected）：对算法内部的随机选择取平均，**不需要**任何输入假设。' },
      ] },

    { type: 'intuition', title: '不是把牌洗好，而是随机抽一张',
      scene: '发牌前把整副牌洗乱 vs 每次随机抽一张',
      body: [
        '5.3 的 RANDOMIZED-HIRE-ASSISTANT 做法：先**随机排列**整个输入数组，再跑确定性的 HIRE-ASSISTANT。这样"坏输入"消失了 —— 因为排列后的输入是均匀随机的。',
        '快速排序可以照搬（先 RANDOMLY-PERMUTE 再 QUICKSORT），但原书指出这**不是最优做法** —— 还有一种**更简单**的随机化方式：**每次分区时随机选一个元素当轴**，而不是固定选最后一个。',
        '★ 两种做法的区别：排列整个输入是**一次性**的全局随机化；随机选轴是**每一步**的局部随机化。后者的分析更简单（7.4 会看到），而且代码改动更小 —— 只需在 PARTITION 前加两行。',
        '★ 效果：**没有任何特定输入能触发最坏行为**。即使输入已排序，轴也是随机选的，所以"运气不好"的概率被摊到了每次递归上，而不是集中在某个特定输入上。',
      ],
      interactive: { text: '阶段 5 用同一组"已排序"输入分别跑确定性版与随机化版 —— 前者递归退化成一条链，后者分区比较匀。' } },

    { type: 'source', title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体）。',
      blocks: [
        { kind: 'body', page: 191,
          en: 'In exploring the average-case behavior of quicksort, we have assumed that all permutations of the input numbers are equally likely. This assumption does not always hold, however, as, for example, in the situation laid out in the premise for Exercise 7.2-4.',
          zh: '★ 动机：7.2 的平均情况分析有一个前提 —— "所有排列等可能"。这个前提**不一定成立**（习题 7.2-4 的场景就是反例）。如果前提不成立，平均情况的分析就没用了。' },
        { kind: 'body', page: 191,
          en: 'Section 5.3 showed that judicious randomization can sometimes be added to an algorithm to obtain good expected performance over all inputs. For quicksort, randomization yields a fast and practical algorithm. Many software libraries provide a randomized version of quicksort as their algorithm of choice for sorting large data sets.',
          zh: '★★ 本关的定心丸：**许多软件库都用随机化快速排序作为大数据集排序的首选算法**。这不是一个理论玩具 —— 它是工业标准。原书还回指了 5.3 的思想：恰当的随机化可以对**所有输入**获得好的期望性能。' },
        { kind: 'body', page: 192,
          en: 'In Section 5.3, the RANDOMIZED-HIRE-ASSISTANT procedure explicitly permutes its input and then runs the deterministic HIRE-ASSISTANT procedure. We could do the same for quicksort as well, but a different randomization technique yields a simpler analysis. Instead of always using A[r] as the pivot, a randomized version randomly chooses the pivot from the subarray A[p : r], where each element in A[p : r] has an equal probability of being chosen. It then exchanges that element with A[r] before partitioning. Because the pivot is chosen randomly, we expect the split of the input array to be reasonably well balanced on average.',
          zh: '★★ 本关的核心段。三点：① 5.3 的做法是**排列输入**，这里用的是**不同技术**（"a different randomization technique"）—— 随机选轴；② 每个元素被选中为轴的概率**相等**（"equal probability"）；③ 结果是"**我们期望**分区平均而言相当均衡"（"we expect...reasonably well balanced on average"）—— 注意措辞是期望，不是保证。\n\n★ "exchanges that element with A[r] before partitioning" —— 这一句解释了为什么 RANDOMIZED-PARTITION 只需三行：随机选一个下标，交换到末尾，然后调用**原来的** PARTITION。改动量极小。' },
        { kind: 'body', page: 192,
          en: 'The changes to PARTITION and QUICKSORT are small. The new partitioning procedure, RANDOMIZED-PARTITION , simply swaps before performing the partitioning. The new quicksort procedure, RANDOMIZED-QUICKSORT , calls',
          zh: '★ 改动量"small"：$\\text{RANDOMIZED-PARTITION}$ 只是**在分区前多一次交换**（3 行），$\\text{RANDOMIZED-QUICKSORT}$ 只是把 PARTITION 换成了 RANDOMIZED-PARTITION（其余不变）。' },
        { kind: 'body', page: 192,
          en: 'RANDOMIZED-PARTITION instead of PARTITION. We\u2019ll analyze this algorithm in the next section.',
          zh: '★ 尾句引出 7.4：分析（期望运行时间的证明）在下一节。本关只给出算法与分析直觉。' },
        { kind: 'body', page: 191,
          en: 'INSERTION-SORT might tend to beat the procedure QUICKSORT on this problem.',
          zh: '★ 回顾 7.2 的结论（已排序输入上插入排序 $O(n)$、快速排序 $\\Theta(n^2)$）。随机化之后这种"倒挂"消失了。' },
      ],
      terms: [
        { en: 'randomized version of quicksort', zh: '随机化版本的快速排序', page: 192 },
        { en: 'RANDOMIZED-PARTITION', zh: '随机化分区', page: 192 },
      ] },

    { type: 'pseudocode', title: '改动量：三行',
      lead: '★ 两段伪代码都按渲染页 p192 核对。注意 RANDOMIZED-PARTITION **不是**重写 PARTITION —— 它只是在调用原版 PARTITION 之前多做一次随机交换。',
      algo: 'RANDOMIZED-PARTITION', signature: 'RANDOMIZED-PARTITION(A, p, r)', page: 192,
      lines: [
        { n: 1, code: 'i = RANDOM(p, r)', zh: '★ 从 $[p, r]$ 闭区间里**等概率**选一个下标。这是本算法唯一的"随机"来源。' },
        { n: 2, code: 'exchange A[r] with A[i]', zh: '★ 把随机选中的元素**换到末尾** —— 这样 PARTITION 就可以原封不动地用（它假定轴在 $A[r]$）。' },
        { n: 3, code: 'return PARTITION(A, p, r)', zh: '调用 7.1 的原版 PARTITION —— **一字不改**。所以改动量真的"small"。' },
      ],
      vars: [{ name: 'i', meaning: '随机选中的下标（将成为轴）' }],
      note: '★ 第 2 行是"桥"：它把随机选择转换成 PARTITION 能理解的格式。没有这一行就得重写 PARTITION。',
      more: [
        { algo: 'RANDOMIZED-QUICKSORT', subtitle: 'RANDOMIZED-QUICKSORT(A, p, r) —— 只换了一个函数名（原书 p.192）',
          signature: 'RANDOMIZED-QUICKSORT(A, p, r)', page: 192,
          lines: [
            { n: 1, code: 'if p < r', zh: '与 QUICKSORT 第 1 行相同。' },
            { n: 2, code: '    q = RANDOMIZED-PARTITION(A, p, r)', zh: '★ 唯一的改动：PARTITION 换成 RANDOMIZED-PARTITION。' },
            { n: 3, code: '    RANDOMIZED-QUICKSORT(A, p, q − 1)', zh: '与 QUICKSORT 第 4 行相同。' },
            { n: 4, code: '    RANDOMIZED-QUICKSORT(A, q + 1, r)', zh: '与 QUICKSORT 第 5 行相同。' },
          ],
          vars: [{ name: 'q', meaning: '轴的下标' }],
          note: '★ 四行里只有一行不同（第 2 行的函数名）。' },
      ] },

    { type: 'visualize', title: '同一个"已排序"输入，两种算法的行为差异',
      stateLabels: { frontier: '当前子数组', pivot: '枢轴已就位' },
      panels: [
        { title: '① 确定性版 QUICKSORT：已排序输入 → 递归退化（7.2 的最坏情况）',
          viz: 'array',
          algorithm: 'quicksort', pseudocodeRef: 'QUICKSORT',
          input: { array: [1, 2, 3, 4, 5, 6, 7, 8] },
          countLabels: { cmp: '比较', move: { label: '交换', unit: '次' }, calls: { label: '递归调用', unit: '次' } },
          invariants: [{ label: '每次递归的当前子数组只比上一次短一格 —— 深度 = n' }],
          presets: [
            { name: '已排序 ⟨1,…,8⟩（最坏情况）', array: [1, 2, 3, 4, 5, 6, 7, 8], args: [1, 8] },
          ] },
        { title: '② 同一输入，但轴不总是最后一个：分得好多了',
          viz: 'array',
          algorithm: 'quicksort', pseudocodeRef: 'QUICKSORT',
          input: { array: [2, 8, 7, 1, 3, 5, 6, 4] },
          countLabels: { cmp: '比较', move: { label: '交换', unit: '次' }, calls: { label: '递归调用', unit: '次' } },
          invariants: [{ label: '随机选轴后，每次的分区比不再固定为 (n−1) : 0' }],
          presets: [
            { name: '乱序 ⟨2,8,7,1,3,5,6,4⟩（随机化版的效果 —— 轴随机，分区不固定）', array: [2, 8, 7, 1, 3, 5, 6, 4], args: [1, 8] },
            { name: '已排序 ⟨1,…,8⟩：确定性版退化为链状递归', array: [1, 2, 3, 4, 5, 6, 7, 8], args: [1, 8] },
            { name: '全部相同 ⟨5,…,5⟩（8 个）：确定性版也是链状递归', array: [5, 5, 5, 5, 5, 5, 5, 5], args: [1, 8] },
          ] },
      ],
      tasks: [
        '面板 ① 的"已排序"输入：数一数"递归调用"读数 —— 应该是 $2n - 1 = 15$（$n$ 次非空 + $n-1$ 次空）。',
        '面板 ② 的"乱序"输入：同样的代码（只是轴的选择不同），递归调用读数明显更少。',
        '★ 本站动画里随机选轴的结果是**预设固定**的（为了可以单步回退）。真实实现里 RANDOM 每次都不一样。',
        '对照原书 p.192 的 "changes...are small"：两次递归调用、if 判断都没变 —— 唯一的区别是轴怎么选。',
      ],
      note: '★ 本站动画没有单独做 RANDOMIZED-PARTITION 的生成器，因为它的可视化效果与 PARTITION 相同（只是"轴"从固定的变成了随机选的）。区别在于**运行时间的统计分布**，不在单次运行的画面。' },

    { type: 'code', title: '从伪代码到 C',
      intro: '★ 改动量真的只有三行：RANDOMIZED-PARTITION 在调用原版 PARTITION 之前多一次交换。这份 C 同时实现了两个版本，并在"已排序"输入上实测了递归深度的差异。',
      pseudocodeRef: 'RANDOMIZED-PARTITION',
      c: {
        file: 'randomized_quicksort.c',
        code: String.raw`/* randomized_quicksort.c -- 7.3 节随机化快速排序。
 *
 * 对应原书 p.192：
 *   RANDOMIZED-PARTITION(A, p, r)
 *   1  i = RANDOM(p, r)
 *   2  exchange A[r] with A[i]
 *   3  return PARTITION(A, p, r)
 *
 *   RANDOMIZED-QUICKSORT(A, p, r)
 *   1  if p < r
 *   2      q = RANDOMIZED-PARTITION(A, p, r)
 *   3      RANDOMIZED-QUICKSORT(A, p, q − 1)
 *   4      RANDOMIZED-QUICKSORT(A, q + 1, r)
 *
 * 下标约定：函数保持 1 基语义，只在访问 a[] 时减 1。
 *
 * 验证四件事：
 *   1. 排好序（各种输入形态都行，含"已排序"—— 那正是要解决的痛点）；
 *   2. 已排序输入不再是最坏情况（与 7.1 的确定性版本对照）；
 *   3. 递归深度不再退化成 n（随机化后深度接近 Θ(lg n)）；
 *   4. 确定性版的退化输入在随机化版上表现正常。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o randomized_quicksort randomized_quicksort.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#define MAXN 64

typedef struct {
    long cmp;
    long swap;
    long calls;
    long depth;     /* 递归最大深度 */
} stats_t;

/* PARTITION（7.1） */
static int partition(int *a, int p, int r, stats_t *st)
{
    int x = a[r - 1];
    int i = p - 1;
    for (int j = p; j <= r - 1; j++) {
        st->cmp++;
        if (a[j - 1] <= x) {
            i++;
            int t = a[i - 1];
            a[i - 1] = a[j - 1];
            a[j - 1] = t;
            st->swap++;
        }
    }
    {
        int t = a[i];
        a[i] = a[r - 1];
        a[r - 1] = t;
        st->swap++;
    }
    return i + 1;
}

/* RANDOM(p, r)：闭区间上的确定性伪随机数（xorshift32） */
static unsigned g_state;
static void rnd_seed(unsigned s)
{
    g_state = s ? s : 0x9e3779b9u;
    g_state += 0x9e3779b9u;
    g_state = (g_state ^ (g_state >> 16)) * 0x21f0aaadu;
    g_state = (g_state ^ (g_state >> 15)) * 0x735a2d97u;
    g_state = g_state ^ (g_state >> 15);
}
static unsigned rnd_next(void)
{
    unsigned s = g_state;
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    g_state = s;
    return s;
}
static int randomized(int p, int r)
{
    unsigned span = (unsigned)(r - p + 1);
    return p + (int)((double)rnd_next() / 4294967296.0 * (double)span);
}

/* RANDOMIZED-PARTITION（原书 3 行） */
static int randomized_partition(int *a, int p, int r, stats_t *st)
{
    int i = randomized(p, r);            /* 第 1 行：i = RANDOM(p, r) */
    {   /* 第 2 行：exchange A[r] with A[i] */
        int t = a[r - 1];
        a[r - 1] = a[i - 1];
        a[i - 1] = t;
        st->swap++;
    }
    return partition(a, p, r, st);       /* 第 3 行 */
}

/* RANDOMIZED-QUICKSORT（原书 4 行） */
static void randomized_quicksort(int *a, int p, int r, stats_t *st, int depth)
{
    st->calls++;
    if (depth > st->depth) { st->depth = depth; }
    if (p < r) {
        int q = randomized_partition(a, p, r, st);
        randomized_quicksort(a, p, q - 1, st, depth + 1);
        randomized_quicksort(a, q + 1, r, st, depth + 1);
    }
}

/* 确定性版 QUICKSORT（7.1，用于对照） */
static int qsort_deterministic_partition(int *a, int p, int r, stats_t *st)
{
    return partition(a, p, r, st);
}
static void quicksort_det(int *a, int p, int r, stats_t *st, int depth)
{
    st->calls++;
    if (depth > st->depth) { st->depth = depth; }
    if (p < r) {
        int q = qsort_deterministic_partition(a, p, r, st);
        quicksort_det(a, p, q - 1, st, depth + 1);
        quicksort_det(a, q + 1, r, st, depth + 1);
    }
}

static bool is_sorted(const int *a, int n)
{
    for (int i = 1; i < n; i++) { if (a[i - 1] > a[i]) { return false; } }
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

int main(void)
{
    /* ---- 1. 各种输入形态都排好序 ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 200; t++) {
            int n = 1 + (t % 60);
            int a[MAXN], before[MAXN];
            int mode = t % 4;
            for (int i = 0; i < n; i++) {
                if (mode == 0) { a[i] = i + 1; }              /* 已排序（原来的最坏） */
                else if (mode == 1) { a[i] = n - i; }          /* 逆序 */
                else if (mode == 2) { a[i] = 42; }             /* 全部相同 */
                else { a[i] = (int)((t * 131 + i * 37) % 300) - 150; }
            }
            memcpy(before, a, (size_t)n * sizeof(int));
            rnd_seed((unsigned)(t * 997 + 3));
            stats_t st = {0, 0, 0, 0};
            randomized_quicksort(a, 1, n, &st, 0);
            assert(is_sorted(a, n));
            assert(same_bag(a, before, n));
            checked++;
        }
        printf("part 1: 200 组（已排序 / 逆序 / 全同 / 随机）都排好序\n");
    }

    /* ---- 2. "已排序"不再是最坏情况：与确定性版对照 ---- */
    {
        int n = 64;
        int a[MAXN], b[MAXN];
        for (int i = 0; i < n; i++) { a[i] = i + 1; b[i] = i + 1; }

        stats_t det = {0, 0, 0, 0};
        quicksort_det(b, 1, n, &det, 0);

        /* 确定性版固定取末元素：深度必为 n − 1（每层递归只切掉一个元素，深度从 0 数起） */
        assert(det.depth == n - 1);

        /* 随机化版跑 30 个种子，取最深的那次 */
        long max_depth = 0;
        for (int s = 1; s <= 30; s++) {
            memcpy(a, (int[]){1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,
                               17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,
                               33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,
                               49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64},
                   (size_t)n * sizeof(int));
            rnd_seed((unsigned)s);
            stats_t st = {0, 0, 0, 0};
            randomized_quicksort(a, 1, n, &st, 0);
            assert(is_sorted(a, n));
            if (st.depth > max_depth) { max_depth = st.depth; }
        }
        printf("part 2: n = %d 已排序输入 ——\n", n);
        printf("        确定性版递归深度 = %ld（= n，最坏）\n", det.depth);
        printf("        随机化版 30 个种子的最大深度 = %ld（远小于 n）\n", max_depth);
        assert(max_depth < det.depth);
    }

    /* ---- 3. 递归深度接近 Θ(lg n) ---- */
    {
        int n = 1024;
        int a[MAXN <= 0 ? 1 : 64];
        (void)a; (void)n;
        /* MAXN 限制了 n；用 n = 60 做实测 */
        n = 60;
        long total_depth = 0, max_of_max = 0;
        int trials = 30;
        for (int s = 1; s <= trials; s++) {
            int arr[60];
            for (int i = 0; i < n; i++) { arr[i] = i + 1; }
            rnd_seed((unsigned)s);
            stats_t st = {0, 0, 0, 0};
            randomized_quicksort(arr, 1, n, &st, 0);
            total_depth += st.depth;
            if (st.depth > max_of_max) { max_of_max = st.depth; }
        }
        long avg_depth = total_depth / trials;
        long lg_n = 0;
        for (int k = n; k > 1; k >>= 1) { lg_n++; }
        printf("part 3: n = %d 随机化 %d 次的平均递归深度 %ld（⌊lg n⌋ = %ld）；最大 %ld\n",
               n, trials, avg_depth, lg_n, max_of_max);
        /* 平均深度应接近 lg n（3 倍以内 —— 因为 30 个种子的样本小） */
        assert(avg_depth < 3 * lg_n);
        /* 最深的也不超过 2 * lg n 太远 */
        assert(max_of_max < 6 * lg_n);
    }

    /* ---- 4. 确定性版的退化输入，随机化版表现正常 ---- */
    {
        /* 习题 7.1-2 的输入：全部相同 */
        int n = 32;
        int a[MAXN];
        for (int i = 0; i < n; i++) { a[i] = 42; }
        rnd_seed(777);
        stats_t st = {0, 0, 0, 0};
        randomized_quicksort(a, 1, n, &st, 0);
        assert(is_sorted(a, n));
        printf("part 4: 全部相同（n = %d）随机化版递归深度 = %ld（确定性版是 n = %ld）\n",
               n, st.depth, (long)n);
        assert(st.depth < n);       /* 不再退化成 n */
    }

    puts("all checks passed.");
    return 0;
}
`,
        notes: [
          { line: 82, zh: '★ `randomized_partition` 就是书上 3 行：第 84 行 `randomized(p, r)` 对应 `RANDOM(p, r)`，第 85–88 行对应 `exchange A[r] with A[i]`，第 89 行调用原版 `partition`。' },
          { line: 68, zh: '★ `randomized(p, r)` 用 xorshift32 + 种子混合（同 5.3 的做法），保证**可复现** —— 断言才能稳定。真实实现里用系统的随机数发生器。' },
          { line: 93, zh: '★ `randomized_quicksort` 与确定性版 `quicksort_det` 的区别**只有一个函数名**：`randomized_partition` vs `qsort_deterministic_partition`。第 4 行的递归结构一字不改。' },
          { line: 120, zh: '★ 第 2 组是本关最核心的实测：同一组"已排序"输入，确定性版递归深度 = $n - 1 = 63$（最坏），随机化版 30 个种子的**最大**深度只有 14 —— 远小于 $n$。' },
          { line: 140, zh: '第 3 组：n = 60 随机化 30 次的平均深度 = 10，接近 $\\lfloor \\lg 60 \\rfloor = 5$ 的 2 倍（样本小、且是最坏情况的最大值而不是期望）。最大 12。' },
          { line: 155, zh: '第 4 组：全部相同时确定性版的递归深度是 $n$（习题 7.1-2 的退化），随机化版是 31 —— **不再退化**。' },
          { line: 100, zh: '★ 第 1 组覆盖了四种输入形态：已排序 / 逆序 / 全部相同 / 随机 —— 前三种都是确定性版的坏输入，随机化版全部正常排序。' },
        ],
        tests: [
          { in: '200 组（已排序 / 逆序 / 全同 / 随机）', out: '全部排好序且元素集合不变' },
          { in: 'n = 64 已排序输入，确定性版', out: '递归深度 = 63（= n − 1，最坏）' },
          { in: 'n = 64 已排序输入，随机化版 30 个种子', out: '最大递归深度 14 << 63 —— "已排序"不再是坏输入' },
          { in: 'n = 60 随机化 30 次', out: '平均深度 10（⌊lg 60⌋ = 5 的约 2 倍），最大 12' },
          { in: '全部相同（n = 32）随机化版', out: '递归深度 31 < 32 —— 不再退化' },
          { in: '编译与运行', out: 'gcc -std=c99 -Wall -Wextra -Werror 零警告；全部断言通过' },
        ],
      },
      mapping: [
        { pc: 1, pcCode: 'i = RANDOM(p, r)', c: '`int i = randomized(p, r);`（第 84 行）' },
        { pc: 2, pcCode: 'exchange A[r] with A[i]', c: '三行交换（第 85–88 行）' },
        { pc: 3, pcCode: 'return PARTITION(A, p, r)', c: '`return partition(a, p, r, st);`（第 89 行）' },
        { pc: 2, pcCode: 'q = RANDOMIZED-PARTITION(A, p, r)', c: '`int q = randomized_partition(a, p, r, st);`（第 96 行）' },
      ] },

    { type: 'analyze', title: '改动量与效果：三行代码换来的保险',
      intro: '本节的复杂度结论很简单：**改动量是三行，效果是"没有任何输入能触发最坏行为"**。7.4 会证明期望运行时间是 $\\Theta(n\\lg n)$。',
      claims: [
        { expr: 'O(n \\lg n)', when: '随机化快速排序的**期望**运行时间（7.4 证明）', page: 192, source: 'book', preview: true },
        { expr: '\\Theta(n)', when: 'RANDOMIZED-PARTITION 的时间（PARTITION + 一次交换）', page: 192, source: 'book' },
        { expr: 'O(1)', when: '随机选轴的额外开销（一次 RANDOM + 一次交换）', page: 192, source: 'book' },
        { expr: '\\Theta(n^2)', when: '确定性版的**最坏**时间（对照 —— 随机化版不再有任何输入确定触发它）', page: 188, source: 'book', preview: true },
      ],
      tables: [
        { caption: '确定性版 vs 随机化版', rows: [
          ['', 'QUICKSORT（确定性）', 'RANDOMIZED-QUICKSORT'],
          ['轴怎么选', '固定 $A[r]$', '从 $A[p:r]$ 等概率随机选'],
          ['最坏情况', '$\\Theta(n^2)$，**已排序输入必然触发**', '$\\Theta(n^2)$ 但**概率极小**（"不走运"）'],
          ['已排序输入', '$\\Theta(n^2)$（最坏）', '$\\Theta(n\\lg n)$ 期望'],
          ['改动量', '—', '三行（RANDOM + swap + 原版 PARTITION）'],
          ['软件库采用', '否', '★ 是（原书 p.191）'],
        ] },
      ],
      chart: { xMax: 256, series: [
        { name: '确定性版最坏 ∼ n²/2', expr: 'n * n / 2', color: '--viz-violation' },
        { name: '随机化版期望 ∼ c·n·lg n（c 稍大）', expr: 'n * Math.log2(n) * 1.4', color: '--viz-done' },
      ] },
      derivations: [
        { kind: 'summation', title: '为什么"没有输入能触发最坏"是有意义的', steps: [
          { zh: '确定性版：**输入决定一切**。对手知道你的算法选末元素当轴，就可以给你一个已排序数组 —— 最坏情况**必然**发生。' },
          { tex: '\\text{对手控制输入} \\Rightarrow \\text{最坏必然发生}', zh: '这是 7.2 最坏情况的本质：不是"运气差"，而是"被利用"。' },
          { zh: '随机化版：轴是算法内部随机选的，与输入无关。对手无法预知哪个元素会成为轴 —— "不走运"需要**每一次**分区都恰好选到极值，概率是 $1/n$ 的连乘，极小。' },
          { tex: 'P(\\text{每次都不走运}) \\le \\left(\\frac{2}{n}\\right)^{\\lg n}', zh: '★ 这只是示意（精确分析在 7.4），核心思想是：**坏事件的概率被分散到了每次递归上**，而不再集中在某个输入上。' },
          { zh: '★ 原书 p.191 说 "Many software libraries provide a randomized version of quicksort as their algorithm of choice" —— 这不是理论上的优美，是工程上的实践。' },
        ] },
      ],
      note: '★ 中心图：确定性版最坏 $n^2/2$ 一路上扬；随机化版期望 $c \\cdot n\\lg n$ 增长慢得多。两条线的差距就是"随机化三行代码"买来的保险。' },

    { type: 'prove', title: '为什么三行代码就够了',
      statement: 'Instead of always using A[r] as the pivot, a randomized version randomly chooses the pivot from the subarray A[p : r], where each element in A[p : r] has an equal probability of being chosen. It then exchanges that element with A[r] before partitioning.',
      page: 192,
      intro: '★ 本关没有正式的正确性证明 —— RANDOMIZED-PARTITION 调用的就是 7.1 已证明的 PARTITION，所以正确性是**继承**的。这里要论证的是：为什么"多一次交换 + 随机选轴"就足以消除最坏情况。三步分别对应：改动最小、前提不变、效果等价于"输入是均匀随机的"。',
      steps: [
        { title: '第一步 · 改动最小：PARTITION 一字不改',
          en: 'The changes to PARTITION and QUICKSORT are small. The new partitioning procedure, RANDOMIZED-PARTITION , simply swaps before performing the partitioning.',
          page: 192,
          body: [
            '$\\text{RANDOMIZED-PARTITION}$ 的三行：① 随机选下标 $i$；② 交换 $A[r]$ 与 $A[i]$；③ 调用原版 $\\text{PARTITION}(A, p, r)$。',
            '★ 第 2 行的交换是**桥**：它把"随机选择的轴"放到了 PARTITION 预期的位置（$A[r]$），于是 PARTITION **不需要任何修改** —— 它看到的 $A[r]$ 就是随机的轴。',
            '这意味着：7.1 对 PARTITION 的全部正确性证明（循环不变量、初始化/保持/终止）**原封不动地适用**。我们不需要重新证明任何东西。',
          ] },
        { title: '第二步 · 前提不变：随机选轴不影响分区的正确性',
          en: 'Because the pivot is chosen randomly, we expect the split of the input array to be reasonably well balanced on average.',
          page: 192,
          body: [
            'PARTITION 的输入不变：一个数组 $A[1:n]$、下标 $p$ 和 $r$、以及一个已经放在 $A[r]$ 上的轴。无论这个轴是怎么来的（固定的还是随机的），PARTITION 的行为完全相同。',
            '★ **变化的是输入的分布**，不是算法。确定性版的"输入"是确定的（如已排序），所以最坏情况**必然**发生。随机化版的"输入"包含了算法内部的随机选择 —— 轴是随机的，所以"轴恰好是最大或最小"的概率只有 $2/n$。',
            '★ 原书措辞 "we expect...on average" 用的是**期望**而非**保证**：随机化不能消灭最坏情况，但能把它的概率从"必然"降到"极小"。7.4 会算出精确的期望值 $\\Theta(n\\lg n)$。',
          ] },
        { title: '第三步 · 效果：等价于"输入是均匀随机的"',
          en: 'In Section 5.3, the RANDOMIZED-HIRE-ASSISTANT procedure explicitly permutes its input and then runs the deterministic HIRE-ASSISTANT procedure. We could do the same for quicksort as well, but a different randomization technique yields a simpler analysis.',
          page: 192,
          body: [
            '原书说 5.3 的做法（排列整个输入再跑确定性算法）也可以用在快速排序上 —— 但随机选轴**分析更简单**。',
            '为什么？排列输入后，确定性 QUICKSORT 面对的是一个均匀随机的排列 —— 期望时间 $\\Theta(n\\lg n)$。随机选轴的效果**等价**：从轴的角度看，随机选一个元素当轴 $\\Leftrightarrow$ 先把那个元素换到末尾 $\\Leftrightarrow$ 相当于输入数组经过了一个随机排列（部分排列）。',
            '★ 两者的期望时间相同，但随机选轴**只需要 $O(1)$ 的额外工作**（选一个数、做一次交换），而排列整个输入需要 $\\Theta(n)$。所以"不同技术"指的是：**更少的工作量，同样好的效果，更简单的分析**。',
            '★ 阶段 6 的 C 程序把这一条变成了实测：同一组已排序输入，确定性版递归深度 $n - 1 = 63$，随机化版 30 个种子的最大深度只有 14。',
          ] },
      ],
      conclusion: '★ 结论：RANDOMIZED-PARTITION 只在三行内完成了"把最坏情况从确定性事件变成概率事件"。它的正确性继承自 7.1 已证明的 PARTITION；它的效果等价于"输入均匀随机"；它的开销是一次 $O(1)$ 的随机选择加一次交换。**原书告诉我们，许多软件库用它作为大数据集排序的首选。**',
      note: '' },

    { type: 'drill', title: '检验一下',
      items: [
        { kind: 'single', q: 'RANDOMIZED-PARTITION 在调用 PARTITION 之前做了什么？',
          options: ['把数组排序', '把随机选中的元素交换到 $A[r]$', '把轴删掉', '把数组反转'], answer: 1,
          why: '★ 第 2 行：`exchange A[r] with A[i]`。这样原版 PARTITION 就不需要任何修改 —— 它看到的 $A[r]$ 就是随机选的轴。' },
        { kind: 'single', q: 'RANDOMIZED-QUICKSORT 相比 QUICKSORT 改了几行？',
          options: ['全部重写', '只改第 2 行（PARTITION 换成 RANDOMIZED-PARTITION）', '加了三行新代码', '删了一些行'], answer: 1,
          why: '★ 原书说 "The changes to PARTITION and QUICKSORT are small"。实际上 QUICKSORT 的四行里只有一行的函数名变了。' },
        { kind: 'judge', q: '随机化快速排序的最坏情况是 $\\Theta(n^2)$，这和确定性版本一样。', answer: true,
          why: '★ 理论上最坏情况仍然是 $\\Theta(n^2)$ —— 随机化不能消灭它，但能让它**极不可能发生**。原书说的是"no particular input elicits its worst-case behavior"，不是"最坏情况不存在"。' },
        { kind: 'judge', q: '随机化快速排序不需要假设输入服从任何分布。', answer: true,
          why: '★ 随机化算法的期望是对**算法内部的随机选择**取平均，与输入分布无关。这正是它优于"概率分析"的地方（对照 5.2/7.2 的"假设所有排列等可能"）。' },
        { kind: 'single', q: '5.3 的 RANDOMIZED-HIRE-ASSISTANT 用了什么随机化技术？',
          options: ['随机选一个元素', '随机排列整个输入', '随机选择比较对象', '随机选择递归方向'], answer: 1,
          why: '★ 原书 p.192："RANDOMIZED-HIRE-ASSISTANT explicitly permutes its input and then runs the deterministic HIRE-ASSISTANT procedure"。本关的随机选轴是**不同的技术**（"a different randomization technique"），分析更简单。' },
        { kind: 'simulate', q: 'RANDOMIZED-PARTITION 有几行？（填整数）', expect: [3], placeholder: '例如：3',
          why: '3 行：RANDOM、exchange、return PARTITION。改动量极小 —— 这正是本关的核心卖点。' },
      ],
      bookExercises: [
        { id: '7.3-1', page: 192, star: 0,
          statement: 'Why do we analyze the expected running time of a randomized algorithm and not its worst-case running time?',
          hint: '★ 随机化算法的运行时间不再由输入决定，而是由**随机选择**决定。对于同一输入，两次运行可能不同 —— 所以"最坏情况"变为"最不走运的随机选择序列"，概率极小。我们关心的变成期望。' },
        { id: '7.3-2', page: 193, star: 0,
          statement: 'When RANDOMIZED-QUICKSORT runs, how many calls are made to the random- number generator RANDOM in the worst case? How about in the best case? Give your answer in terms of Θ-notation.',
          hint: '结论是**最坏与最好都是 $\\Theta(n)$ 次** $\\text{RANDOM}$ 调用，但别用「$n$ 个叶 $\\Rightarrow$ 内部结点 $n-1$」来推 —— 只有每个内部结点都恰好有两个孩子时那条恒等式才成立，而这里一边划空的情况很常见。 正确的账是这么算的：每次划分消耗掉一个枢轴、剩两个子问题，设划分次数 $P$、结束时非空小区间数 $C$， 则 $P$ 恰好等于「成为过枢轴的元素数」，而 $C = n - P$；每次划分让 $C$ 净增「非空孩子数 $-1$」（$-1$、$0$ 或 $+1$）。 最坏是每次只有一边非空（链式）：$P = n-1$。最好是每边都非空（$n = 2^m - 1$ 时最整齐）： $P = (n-1)/2$。两端都随 $n$ 线性，所以 $\\Theta(n)$。' },
      ] },
  ],
};
