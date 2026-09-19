/* =============================================================================
 * 第 2 章 · 2.3 设计算法：分治法与归并排序（Designing algorithms）
 *
 * 原文锚点：印刷页 34–46（pdf_index 55–67）
 * 含 2.3.1 The divide-and-conquer method（印刷页 34–38）
 *    2.3.2 Analyzing divide-and-conquer algorithms（印刷页 39–44）
 *
 * 忠实度约定（沿用 2.1 的写法）：
 *   - 所有 en 字段是**原书英文原文**。
 *   - 所有 zh 字段是本站的中文讲解，以 data-kind="note" 呈现。
 *   - 原书第 4 版的排版约定，本关**严格照抄**：
 *       · 子数组用 A[p : q]（冒号），不是 A[p : q]
 *       · 伪代码用 = 表示赋值（第 4 版已不再用 ←）
 *       · 注释用 //
 *       · 序列用 ⟨12, 3, 7, 9⟩
 *   - 原书把 MERGE 的正确性证明留作习题 2.3-3，本关阶段 7 给出的三步证明
 *     属**本站补充**，已在正文里明确标注。
 * ========================================================================== */

/* C 实现（与 c/merge_sort.c 完全一致，可直接编译运行） */
const C_IMPL = String.raw`/*
 * merge_sort.c — 归并排序（CLRS 第 4 版 MERGE-SORT / MERGE 的 C 实现）
 *
 * 书中下标从 1 开始；本实现从 0 开始。对应关系（以 MERGE(A, p, q, r) 为例，
 * p/q/r 均以 1 基传入）：
 *   书中 A[p : q]            ↔ 本文件 a[p-1 .. q-1]
 *   书中 A[q+1 : r]          ↔ 本文件 a[q .. r-1]
 *   书中 L[0 : nL-1] / R[..] ↔ 本文件 L[0 .. nL-1] / R[..]（与原书 L/R 同为 0 基）
 *   书第 13 行 if L[i] <= R[j]  ↔  同样
 * 第 4 版 MERGE 不使用 ∞ 哨兵，而是 "复制 + 剩余复制循环"（第 20–27 行）。
 * 顶层入口：sort_into(a, n) 在整段 a[0 .. n-1] 上排序。
 */
#include <stdio.h>
#include <assert.h>
#include <stdlib.h>

static void merge(int a[], int p, int q, int r)
{
    int nL = q - p + 1;                 /* 书第 1 行 */
    int nR = r - q;                     /* 书第 2 行 */
    int *L = malloc((size_t)nL * sizeof(int));
    int *R = malloc((size_t)nR * sizeof(int));
    for (int i = 0; i < nL; i++) L[i] = a[p - 1 + i];   /* 书第 4–5 行 */
    for (int j = 0; j < nR; j++) R[j] = a[q + j];       /* 书第 6–7 行 */
    int i = 0, j = 0, k = p;                            /* 书第 8–10 行 */
    while (i < nL && j < nR) {                          /* 书第 12 行 */
        if (L[i] <= R[j]) { a[k - 1] = L[i]; i++; }     /* 书第 13–15 行 */
        else { a[k - 1] = R[j]; j++; }                  /* 书第 16–17 行 */
        k++;                                            /* 书第 18 行 */
    }
    while (i < nL) { a[k - 1] = L[i]; i++; k++; }        /* 书第 20–23 行 */
    while (j < nR) { a[k - 1] = R[j]; j++; k++; }        /* 书第 24–27 行 */
    free(L);
    free(R);
}

static void merge_sort(int a[], int p, int r)
{
    if (p >= r) return;                 /* 书第 1–2 行 */
    int q = (p + r) / 2;                /* 书第 3 行：1 基下 q = floor((p + r) / 2) */
    merge_sort(a, p, q);                /* 书第 4 行 */
    merge_sort(a, q + 1, r);            /* 书第 5 行 */
    merge(a, p, q, r);                  /* 书第 7 行 */
}

static void sort_into(int a[], int n)
{
    if (n > 0) merge_sort(a, 1, n);     /* 1 基闭区间 [1, n] */
}

static void check(const char *name, int a[], int n, const int expected[])
{
    sort_into(a, n);
    for (int i = 0; i < n; i++) assert(a[i] == expected[i]);
    printf("ok: %s\n", name);
}

int main(void)
{
    int a1[] = {5, 2, 4, 6, 1, 3};
    int e1[] = {1, 2, 3, 4, 5, 6};
    check("fig2.2", a1, 6, e1);

    int a2[] = {6, 5, 4, 3, 2, 1};
    int e2[] = {1, 2, 3, 4, 5, 6};
    check("reverse6", a2, 6, e2);

    int a3[] = {12, 3, 7, 9, 14, 6, 11, 2};
    int e3[] = {2, 3, 6, 7, 9, 11, 12, 14};
    check("fig2.4", a3, 8, e3);

    int a4[] = {2, 4, 6, 7, 1, 2, 3, 5};   /* 原书 Figure 2.3 的 L+R 合并 */
    int e4[] = {1, 2, 2, 3, 4, 5, 6, 7};
    check("fig2.3-merge", a4, 8, e4);

    int a5[] = {42};
    int e5[] = {42};
    check("single", a5, 1, e5);

    int a6[1] = {7};
    check("empty", a6, 0, a6);

    printf("ALL MERGE-SORT TESTS PASSED\n");
    return 0;
}`;

/* 驱动动画的那份实现（默认折叠，不干扰主线） */
const ENGINE_EXCERPT = String.raw`export function* mergeSort(A, lo = 1, hi = null) {
  if (hi === null) hi = A.length;
  const counts = { cmp: 0, move: 0 };
  const a = A.slice();
  yield* mergeSortRec(a, lo, hi, counts);
  yield { line: null, done: true, array: a.slice(), counts };
}

function* mergeSortRec(a, p, r, counts) {
  if (p >= r) {                       // 第 1 行：if p >= r then return
    yield frame(1, { pointers: { p, r }, note: A[p] 单元素，已有序 });
    return;
  }
  const q = Math.floor((p + r) / 2);  // 第 3 行：q = floor((p + r) / 2)
  yield frame(3, { pointers: { p, q, r } });
  yield* mergeSortRec(a, p, q, counts);        // 第 4 行
  yield* mergeSortRec(a, q + 1, r, counts);    // 第 5 行
  yield* merge(a, p, q, r, counts);            // 第 7 行：调用 MERGE
}`;

/* ---------------------------------------------------------------------------
 * 原书 Figure 2.4 的「分—合」递归树。
 *
 * 数组固定为 A = ⟨12, 3, 7, 9, 14, 6, 11, 2⟩（1 基下标 1..8）。
 * 每个节点：label = 该子数组此刻的值，cost = 子数组记号，note = 原书图上的
 * 斜体调用序号（自初始调用 MERGE-SORT(A, 1, 8) 之后的第几次调用）。
 * 序号与每层的数组状态都逐格照抄自印刷页 40 的 Figure 2.4。
 * ------------------------------------------------------------------------- */
const F24_LEAVES = ['12', '3', '7', '9', '14', '6', '11', '2'];

function f24Leaf(i, order) {
  return { id: 'L' + i, label: F24_LEAVES[i], cost: 'A[' + (i + 1) + ':' + (i + 1) + ']', note: '#' + order };
}

/** 第 0 层：整段；逐层展开；第 4..6 帧是「合并」回去的过程。 */
const FIG24_FRAMES = [
  // 帧 0：还没分
  { root: { id: 'r', label: '12 3 7 9 14 6 11 2', cost: 'A[1:8]', note: 'p=1 q=4 r=8' }, path: [] },
  // 帧 1：divide → 两半
  { root: { id: 'r', label: '12 3 7 9 14 6 11 2', cost: 'A[1:8]', children: [
      { id: 'a', label: '12 3 7 9', cost: 'A[1:4]', note: '#1' },
      { id: 'b', label: '14 6 11 2', cost: 'A[5:8]', note: '#11' },
    ] }, path: [] },
  // 帧 2：divide → 四段
  { root: { id: 'r', label: '12 3 7 9 14 6 11 2', cost: 'A[1:8]', children: [
      { id: 'a', label: '12 3 7 9', cost: 'A[1:4]', children: [
        { id: 'a1', label: '12 3', cost: 'A[1:2]', note: '#2' },
        { id: 'a2', label: '7 9', cost: 'A[3:4]', note: '#6' },
      ] },
      { id: 'b', label: '14 6 11 2', cost: 'A[5:8]', children: [
        { id: 'b1', label: '14 6', cost: 'A[5:6]', note: '#12' },
        { id: 'b2', label: '11 2', cost: 'A[7:8]', note: '#16' },
      ] },
    ] }, path: [] },
  // 帧 3：divide 到底 —— 8 个单元素（base case）
  { root: { id: 'r', label: '12 3 7 9 14 6 11 2', cost: 'A[1:8]', children: [
      { id: 'a', label: '12 3 7 9', cost: 'A[1:4]', children: [
        { id: 'a1', label: '12 3', cost: 'A[1:2]', children: [f24Leaf(0, 3), f24Leaf(1, 4)] },
        { id: 'a2', label: '7 9', cost: 'A[3:4]', children: [f24Leaf(2, 7), f24Leaf(3, 8)] },
      ] },
      { id: 'b', label: '14 6 11 2', cost: 'A[5:8]', children: [
        { id: 'b1', label: '14 6', cost: 'A[5:6]', children: [f24Leaf(4, 13), f24Leaf(5, 14)] },
        { id: 'b2', label: '11 2', cost: 'A[7:8]', children: [f24Leaf(6, 17), f24Leaf(7, 18)] },
      ] },
    ] }, path: [] },
  // 帧 4：merge 第一轮 —— 两两合成有序对
  { root: { id: 'r', label: '12 3 7 9 14 6 11 2', cost: 'A[1:8]', children: [
      { id: 'a', label: '12 3 7 9', cost: 'A[1:4]', children: [
        { id: 'a1', label: '3 12', cost: 'A[1:2]', note: 'MERGE #5' },
        { id: 'a2', label: '7 9', cost: 'A[3:4]', note: 'MERGE #9' },
      ] },
      { id: 'b', label: '14 6 11 2', cost: 'A[5:8]', children: [
        { id: 'b1', label: '6 14', cost: 'A[5:6]', note: 'MERGE #15' },
        { id: 'b2', label: '2 11', cost: 'A[7:8]', note: 'MERGE #19' },
      ] },
    ] }, path: [] },
  // 帧 5：merge 第二轮
  { root: { id: 'r', label: '12 3 7 9 14 6 11 2', cost: 'A[1:8]', children: [
      { id: 'a', label: '3 7 9 12', cost: 'A[1:4]', note: 'MERGE #10' },
      { id: 'b', label: '2 6 11 14', cost: 'A[5:8]', note: 'MERGE #20' },
    ] }, path: [] },
  // 帧 6：最后一合
  { root: { id: 'r', label: '2 3 6 7 9 11 12 14', cost: 'A[1:8]', note: 'MERGE #21' }, path: [] },
];

const FIG24_NOTES = [
  '初始调用 MERGE-SORT(A, 1, 8)：先算中点 q = ⌊(1+8)/2⌋ = 4，把 A[1:8] 分成 A[1:4] 与 A[5:8]。',
  '对两半递归：先分左半（原书图上的 #1），再分右半（#11）。注意左右是**先后**做的，不是同时。',
  '再分：A[1:4] 分成 A[1:2]（#2）与 A[3:4]（#6）；A[5:8] 分成 A[5:6]（#12）与 A[7:8]（#16）。',
  '分到底 —— 8 段各 1 个元素（#3、#4、#7、#8、#13、#14、#17、#18）。此时 p = r，命中第 1–2 行的 base case，直接返回。',
  '开始合并：相邻两段各自有序，MERGE 把它们并成一段。左半 #5 与 #9，右半 #15 与 #19。',
  '再合一层：#10 把 A[1:2]、A[3:4] 并成 A[1:4]；#20 把 A[5:6]、A[7:8] 并成 A[5:8]。',
  '最后一合：#21 把 A[1:4] 与 A[5:8] 并成整个有序数组。全书 21 次调用到此结束。',
];

/* ---------------------------------------------------------------------------
 * 原书 Figure 2.5 的**代价递归树**（2.3.2 节）。四帧依次对应图中的 (a)~(d)。
 * cost 是该层分摊到每个节点的代价，note 是这一层的层代价。
 * ------------------------------------------------------------------------- */
const FIG25_FRAMES = [
  // (a) 只有 T(n)
  { root: { id: 'r', label: 'T(n)', cost: 'c₂n', state: 'active' }, path: [] },
  // (b) 展开一层
  { root: { id: 'r', label: 'T(n)', cost: 'c₂n', children: [
      { id: 'a', label: 'T(n/2)', cost: 'c₂n/2' },
      { id: 'b', label: 'T(n/2)', cost: 'c₂n/2' },
    ] }, path: [] },
  // (c) 再展开一层
  { root: { id: 'r', label: 'T(n)', cost: 'c₂n', children: [
      { id: 'a', label: 'T(n/2)', cost: 'c₂n/2', children: [
        { id: 'a1', label: 'T(n/4)', cost: 'c₂n/4' },
        { id: 'a2', label: 'T(n/4)', cost: 'c₂n/4' },
      ] },
      { id: 'b', label: 'T(n/2)', cost: 'c₂n/2', children: [
        { id: 'b1', label: 'T(n/4)', cost: 'c₂n/4' },
        { id: 'b2', label: 'T(n/4)', cost: 'c₂n/4' },
      ] },
    ] }, path: [] },
  // (d) 完全展开到叶子
  { root: { id: 'r', label: 'T(n)', cost: 'c₂n', note: '总代价 c₂n', children: [
      { id: 'a', label: 'T(n/2)', cost: 'c₂n/2', note: 'c₂n', children: [
        { id: 'a1', label: 'T(n/4)', cost: 'c₂n/4', children: [
          { id: 'a1a', label: '⋮', cost: '' },
          { id: 'a1b', label: '⋮', cost: '' },
        ] },
        { id: 'a2', label: 'T(n/4)', cost: 'c₂n/4', children: [
          { id: 'a2a', label: '⋮', cost: '' },
          { id: 'a2b', label: '⋮', cost: '' },
        ] },
      ] },
      { id: 'b', label: 'T(n/2)', cost: 'c₂n/2', note: 'c₂n', children: [
        { id: 'b1', label: 'T(n/4)', cost: 'c₂n/4', children: [
          { id: 'b1a', label: '⋮', cost: '' },
          { id: 'b1b', label: '⋮', cost: '' },
        ] },
        { id: 'b2', label: 'T(n/4)', cost: 'c₂n/4', children: [
          { id: 'b2a', label: '⋮', cost: '' },
          { id: 'b2b', label: '⋮', cost: '' },
        ] },
      ] },
    ] }, path: [] },
];

const FIG25_NOTES = [
  '(a) 起点：T(n) 就是“在 n 个数上跑归并排序的最坏时间”，本身还是个未知函数。',
  '(b) 按递归式展开一层：T(n) = 2T(n/2) + c₂n。根下面的开销 c₂n 是“分”和“合”的代价，两个子树是那两个 T(n/2)。',
  '(c) 再展开一层：两个 T(n/2) 各自变成 2T(n/4) + c₂n/2，于是第二层每个节点的代价是 c₂n/2。',
  '(d) 一直展开到规模为 1（代价 c₁），共 lg n + 1 层。每层加起来都是 c₂n，叶子层是 c₁n，总计 c₂n lg n + c₁ n = Θ(n lg n)。',
];

export default {
  key: 's03',
  id: 'ch02/s03',
  chapter: 2,
  section: '2.3',
  title: '分治法与归并排序',
  shortTitle: '2.3 归并排序',
  titleEn: 'Designing algorithms',
  source: { printed: [34, 46], pdf: [55, 67] },
  prerequisites: [
    { label: '2.1 插入排序', url: '#/ch02/s01' },
    { label: '2.2 分析算法（本关下面要反复用到 Θ 与 T(n)）', url: '#/ch02/s02' },
  ],
  sourceNote:
    '本关对应原书 2.3 节（印刷页 34–46）。它为 2.1 的插入排序找到了一个最坏情况更快的对手：' +
    '归并排序的 Θ(n lg n) 对抗插入排序的 Θ(n²)。2.3.2 节第一次出现**递归式**，' +
    '完整的求解方法（主定理）在第 4 章，本关只做“递归树”式的直观推导。',

  stages: [
    /* ================= 阶段 0 · 位置感 ================= */
    {
      type: 'map',
      title: '这一关要解决什么问题',
      why:
        '2.1 的插入排序最坏情况是 $\\Theta(n^2)$。当 $n$ 变大，$n^2$ 会迅速吃光一切 —— ' +
        '书上在 2.2 节末尾说过，插入排序只适合**小规模**数据。' +
        '这一关要换一种**设计思路**（分治法），造出一个最坏情况为 $\\Theta(n \\lg n)$ 的排序算法。' +
        '因为 $\\lg n$ 比任何线性函数增长得都慢，这是一个划算的交换：' +
        '**用掉一个因子 $n$，换回一个因子 $\\lg n$**。',
      position:
        '这是第 2 章最后一节，也是全书第一次出现「递归算法」与「递归式」。' +
        '它同时是**分治法**的样板：第 4 章会把这套方法系统化，第 3 章会把 $\\lg n$ 这种记号讲清楚。' +
        '后面第 7 章快速排序、第 8 章堆排序都建立在同一套分析框架上。' +
        '你需要的前置只有 2.1（会读伪代码、知道循环不变量）—— 递归本身不需要新语法，' +
        '就是「函数调用自己」。',
      unlocks: [
        { label: '第 3 章 函数的增长（Θ / O / Ω 正式定义）', url: '#/ch03/s01' },
        { label: '第 4 章 分治策略（递归式与主定理）', url: '#/ch04/s01' },
        { label: '原书习题 2.3-1 ~ 2.3-8', url: '#/ch02/s03/s09' },
      ],
      mathKit: [
        {
          title: '递归式（recurrence）—— 本关唯一的新概念',
          body:
            '递归式是「用**小规模**问题的运行时间，描述**大规模**问题的运行时间」的等式。' +
            '例如 $T(n) = 2T(n/2) + cn$ 读作：规模为 $n$ 的时间，' +
            '等于两个规模为 $n/2$ 的时间，再加上一层 $cn$ 的开销。' +
            '它不是循环，也不需要在脑子里模拟 —— 把它想成一棵**树**就好：' +
            '每个节点是一次递归调用，$cn$ 是这一层的工作量。本关阶段 6 会把整棵树画出来。',
        },
        {
          title: '$\\lg n$ 是什么',
          body:
            '书上的 $\\lg n$ 就是 $\\log_2 n$。书上脚注 17 明确说：' +
            '“底数在这里并不重要，但作为计算机科学家，我们喜欢以 2 为底的对数。”' +
            '原因是分治每次都把规模劈成两半 —— “劈几次才能劈到 1”，这个次数就是 $\\log_2 n$。' +
            '$n = 8$ 时 $\\lg 8 = 3$；$n = 1024$ 时 $\\lg n = 10$。' +
            '这就是为什么 $\\Theta(n \\lg n)$ 会远胜 $\\Theta(n^2)$：$n$ 翻一倍，$\\lg n$ 只多 1。',
        },
      ],
    },

    /* ================= 阶段 1 · 直觉入口 ================= */
    {
      type: 'intuition',
      title: '两叠牌，怎么合成一叠',
      scene: '把两叠各自有序的牌，并成一叠有序的牌',
      body: [
        '原书在这里换了一个类比。前面整理一手牌是**插入**，这一次是**合并**：' +
          '桌上有两叠牌，都**正面朝上**，每一叠自己已经排好了，最小的一张在最上面。' +
          '你要把它们并成一叠**正面朝下**的输出堆。',
        '做法只有一句话：**看两叠的顶上那两张，把小的那张拿走，翻过来扣到输出堆上**。' +
          '拿走的动作会露出下面的新牌，于是重复。某一边空了以后，' +
          '直接把另一叠整个翻过来扣上去就行 —— 它已经是有序的。',
        '为什么这样就对了？因为两叠各自有序，所以**两叠的顶牌分别是各自剩下的最小值**。' +
          '两张顶牌里更小的那张，一定是“所有还没归位的最小者” —— 把最小的先放下去，结果当然有序。' +
          '这个“每一步都取全局最小”的想法，就是 MERGE 的全部内容。',
        '书里还算了它的时间：如果两叠各有 $n/2$ 张，那么基本的比较步数**至少 $n/2$ 次、至多 $n$ 次**' +
          '（最多其实是 $n + 1$，因为 $n+1$ 步之后一定有一叠空了）。每次基本步只比两张顶牌，是常数时间，' +
          '所以合并的总时间**大致正比于 $n$**，也就是 $\\Theta(n)$。',
        '下面阶段 4 的第（1）块面板就是这段动作的动画版：' +
          '左边是 A 的整个区间，指针 k 指着“下一个要填的位置”，你会看到它从左边一路推到右边。',
      ],
      interactive: {
        kind: 'note',
        text:
          '动手之前先想一个问题：两叠各 $n/2$ 张，**最坏**情况要比较几次？' +
          '答案是 $n - 1$ 次（每比较一次就落位一张，最后一张不用再比）。' +
          '阶段 4 第（1）块面板的计数器会把这个数字实时显示出来，你可以用上面那组数据自己验证。',
      },
    },

    /* ================= 阶段 2 · 原文精读 ================= */
    {
      type: 'source',
      title: '书上是怎么说的',
      lead:
        '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。' +
        '原文一律照抄。注意第 4 版的排版约定已与第 3 版不同：' +
        '子数组写 $A[p : q]$（冒号）、伪代码用 $=$ 表示赋值。',
      blocks: [
        {
          kind: 'remark',
          page: 34,
          en:
            'You can choose from a wide range of algorithm design techniques. Insertion sort ' +
            'uses the incremental method: for each element A[i], insert it into its proper ' +
            'place in the subarray A[1 : i], having already sorted the subarray A[1 : i − 1].\n' +
            'This section examines another design method, known as “divide-and-conquer,” which ' +
            'we explore in more detail in Chapter 4. We’ll use divide-and-conquer to design a ' +
            'sorting algorithm whose worst-case running time is much less than that of ' +
            'insertion sort.',
          zh:
            '★ 这一句把 2.1 和 2.3 的关系说清楚了：插入排序用的是 **incremental（增量）法** —— ' +
            '一次处理一个元素，把它塞进已经排好的前缀里。' +
            '还有一种思路叫 **divide-and-conquer（分治）**，这一节就用它造出一个最坏情况快得多的排序算法。' +
            '注意原文的措辞是 worst-case running time is **much less than** that of insertion sort —— ' +
            '不是“常数因子小一点”，而是**渐进阶都不同**。',
        },
        {
          kind: 'definition',
          page: 34,
          en:
            'Many useful algorithms are recursive in structure: to solve a given problem, they ' +
            'recurse (call themselves) one or more times to handle closely related ' +
            'subproblems. These algorithms typically follow the divide-and-conquer method: ' +
            'they break the problem into several subproblems that are similar to the original ' +
            'problem but smaller in size, solve the subproblems recursively, and then combine ' +
            'these solutions to create a solution to the original problem.',
          zh:
            '这是**递归算法**的定义，也是分治法的定义。请把三件事分开记：' +
            '① 把问题**拆**成若干个“长得一样但更小”的子问题；' +
            '② **递归地**解决这些子问题；' +
            '③ 把子问题的解**合**起来，得到原问题的解。' +
            '注意“similar to the original problem”这半句 —— 子问题必须与原来**同型**，' +
            '否则没法用同一个小过程递归调用。这也是分治法能否成立的关键。',
        },
        {
          kind: 'definition',
          page: [34, 35],
          en:
            'In the divide-and-conquer method, if the problem is small enough—the base case—you ' +
            'just solve it directly without recursing. Otherwise—the recursive case—you perform ' +
            'three characteristic steps:\n' +
            'Divide the problem into one or more subproblems that are smaller instances of the ' +
            'same problem.\n' +
            'Conquer the subproblems by solving them recursively.\n' +
            'Combine the subproblem solutions to form a solution to the original problem.',
          zh:
            '**Divide / Conquer / Combine** 三步，这是分治法的模板，请背下来：' +
            '拆、解、合。' +
            '还有一条极其重要的细节：递归不能无限进行，必须有一个**base case**（最小情形）' +
            '直接求解、不再递归。对归并排序来说，base case 就是子数组只剩 1 个元素。' +
            '写任何递归程序时，“先写 base case”都是最稳的习惯 —— 忘了它就是无限递归。',
        },
        {
          kind: 'remark',
          page: 35,
          en:
            'The recursion bottoms out—it reaches the base case—when the subarray A[p : r] to be ' +
            'sorted has just 1 element, that is, when p equals r. As we noted in the ' +
            'initialization argument for INSERTION-SORT’s loop invariant, a subarray comprising ' +
            'just a single element is always sorted.',
          zh:
            'base case 为什么可以“直接求解”？因为**只有一个元素的子数组天然有序**。' +
            '注意书上顺手把这一点接到了 2.1 的循环不变量上 —— ' +
            '当时证 Initialization 时说过同一句话。这种前后呼应正是这本书的读法：' +
            '它不是一本词典，前面用过的事实后面会反复调用。',
        },
        {
          kind: 'remark',
          page: 35,
          en:
            'The key operation of the merge sort algorithm occurs in the “combine” step, which ' +
            'merges two adjacent, sorted subarrays.',
          zh:
            '★ 一句话点出重点：**归并排序的关键在“合”，不在“分”**。' +
            '“拆成两半”谁都会写，真正需要动脑的是怎么把两个有序段并成一个有序段。' +
            '所以这一关读伪代码时，MERGE（27 行）比 MERGE-SORT（7 行）更重要。',
        },
        {
          kind: 'remark',
          page: 35,
          en:
            'To understand how the MERGE procedure works, let’s return to our card-playing ' +
            'motif. Suppose that you have two piles of cards face up on a table. Each pile is ' +
            'sorted, with the smallest-value cards on top. You wish to merge the two piles into ' +
            'a single sorted output pile, which is to be face down on the table. The basic step ' +
            'consists of choosing the smaller of the two cards on top of the face-up piles, ' +
            'removing it from its pile—which exposes a new top card—and placing this card face ' +
            'down onto the output pile. Repeat this step until one input pile is empty, at which ' +
            'time you can just take the remaining input pile and flip over the entire pile, ' +
            'placing it face down onto the output pile.',
          zh:
            '这就是阶段 1 那段类比的原话。逐句对照：' +
            '“face up（正面朝上）”是为了能看见顶牌；' +
            '“which exposes a new top card（露出新的顶牌）”说明为什么拿走后能继续比；' +
            '“until one input pile is empty（直到一边空）”之后“直接把剩下那叠整个翻过来” —— ' +
            '这正是伪代码第 20–23、24–27 行那两个**剩余复制循环**的来历。' +
            '第 4 版的 MERGE 不用 $\\infty$ 哨兵，就是靠这两个循环收尾。',
        },
        {
          kind: 'remark',
          page: 35,
          en:
            'With each basic step taking constant time and the total number of basic steps being ' +
            'between n/2 and n, we can say that merging takes time roughly proportional to n. ' +
            'That is, merging takes Θ(n) time.',
          zh:
            '注意书上给的是 **at least $n/2$ and at most $n$**（脚注里补充：最多其实是 $n+1$，' +
            '因为 $n+1$ 次基本步之后必然有一叠空了）。' +
            '下界 $n/2$ 的理由值得读一遍原文：' +
            '“in whichever pile was emptied, every card was found to be smaller than some card ' +
            'from the other pile” —— 被清空的那一叠里，每张牌都曾被判定小于另一叠的某张牌。' +
            '上下界只差常数倍，所以合并是 $\\Theta(n)$。',
        },
        {
          kind: 'figure-caption',
          page: 37,
          en:
            'Figure 2.3 The operation of the while loop in lines 8–18 in the call ' +
            'MERGE(A, 9, 12, 16), when the subarray A[9 : 16] contains the values ' +
            '⟨2, 4, 6, 7, 1, 2, 3, 5⟩. After allocating and copying into the arrays L and R, the ' +
            'array L contains ⟨2, 4, 6, 7⟩, and the array R contains ⟨1, 2, 3, 5⟩. Tan positions ' +
            'in A contain their final values, and tan positions in L and R contain values that ' +
            'have yet to be copied back into A. Taken together, the tan positions always ' +
            'comprise the values originally in A[9 : 16].',
          zh:
            '这张图是阶段 4 第（1）块面板的原型。三个要点：' +
            '① 调用的是 MERGE(A, **9, 12, 16**) —— 注意 p、q、r 不是 1、4、8，' +
            '书故意用不在开头的下标，好让你相信 $p \\ne 1$ 时算法照样对；' +
            '② L 与 R 是**另开的临时数组**，下标从 0 开始（书上脚注 12 特别说明：' +
            'MERGE 是全书少见的同时使用 1 基（A）与 0 基（L、R）的过程）；' +
            '③ 图里 A 的“褐色位置”加上 L、R 的“褐色位置”，合起来**始终是原来 A[9:16] 的那些值** —— ' +
            '这就是“没丢也没多”的不变量直觉。',
        },
        {
          kind: 'remark',
          page: 38,
          en:
            'To see that the MERGE procedure runs in Θ(n) time, where n = r − p + 1, observe ' +
            'that each of lines 1–3 and 8–10 takes constant time, and the for loops of lines ' +
            '4–7 take Θ(n_L + n_R) = Θ(n) time. To account for the three while loops of lines ' +
            '12–18, 20–23, and 24–27, observe that each iteration of these loops copies exactly ' +
            'one value from L or R back into A and that every value is copied back into A ' +
            'exactly once. Therefore, these three loops together make a total of n iterations.',
          zh:
            '★ 这段是 MERGE 为 $\\Theta(n)$ 的完整论证，也是**数循环次数**的范本。' +
            '关键那句是：“every value is copied back into A exactly once” —— ' +
            '三个 while 循环**加起来**恰好执行 $n$ 次，而不是每个各 $n$ 次。' +
            '所以总时间是 $\\Theta(n)$。这个“每个元素恰好写回一次”的事实，' +
            '本站把它做成了自动化断言（见阶段 5 的“自测用例”）。',
        },
        {
          kind: 'figure-caption',
          page: 40,
          en:
            'Figure 2.4 The operation of merge sort on the array A with length 8 that initially ' +
            'contains the sequence ⟨12, 3, 7, 9, 14, 6, 11, 2⟩. The indices p, q, and r into ' +
            'each subarray appear above their values. Numbers in italics indicate the order in ' +
            'which the MERGE-SORT and MERGE procedures are called following the initial call of ' +
            'MERGE-SORT(A, 1, 8).',
          zh:
            '这是整关最重要的一张图。读法：**从上往下是 divide，从下往上是 merge**。' +
            '图中每个小方块是一段子数组，上面的 $p\\ q\\ r$ 是这一段的边界下标；' +
            '斜体数字是“第几次调用”（初始调用 $\\text{MERGE-SORT}(A, 1, 8)$ 不算，' +
            '从下一次算起，所以最后一共编号到 **21**）。' +
            '留意中间那层：8 个单元素合成 4 个有序对（#5、#9、#15、#19），' +
            '再合成 2 个有序四元组（#10、#20），最后 #21 合成整个有序数组。' +
            '阶段 4 第（2）块面板就是把这张图按层展开给你看。',
        },
        {
          kind: 'theorem',
          page: [38, 41],
          en:
            'A recurrence for the running time of a divide-and-conquer algorithm falls out from ' +
            'the three steps of the basic method. …\n' +
            'The divide step simply computes an index q that partitions A[p : r] into two ' +
            'adjacent subarrays: A[p : q], containing ⌈n/2⌉ elements, and A[q + 1 : r], ' +
            'containing ⌊n/2⌋ elements. …\n' +
            'T(n) = 2T(n/2) + Θ(n)',
          zh:
            '★ 这就是归并排序的递归式 **(2.3)**，本关的核心结论。' +
            '请注意它是怎么“掉出来”的（原文 falls out）：**照着 Divide / Conquer / Combine 三步逐条对应**。' +
            '这是分治法分析的固定套路 —— 以后遇到任何分治算法，都先问这三个问题：' +
            '拆要多久（$D(n)$）？有几份子问题、每份多大（$a$、$n/b$）？合要多久（$C(n)$）？' +
            '书上说忽略 $\\lfloor \\cdot \\rfloor$ 与 $\\lceil \\cdot \\rceil$，' +
            '因为“对大的 $n$ 而言，它与除以 2 的效果相比微不足道”，' +
            '而且第 4 章会说明这种简化**不影响解的渐进阶**。',
        },
        {
          kind: 'theorem',
          page: 41,
          en:
            'Chapter 4 presents the “master theorem,” which shows that T(n) = Θ(n lg n). ' +
            '17\n' +
            'Compared with insertion sort, whose worst-case running time is Θ(n²), merge sort ' +
            'trades away a factor of n for a factor of lg n. Because the logarithm function ' +
            'grows more slowly than any linear function, that’s a good trade. For large enough ' +
            'inputs, merge sort, with its Θ(n lg n) worst-case running time, outperforms ' +
            'insertion sort, whose worst-case running time is Θ(n²).',
          zh:
            '结论：$T(n) = \\Theta(n \\lg n)$。书上把证明推给了第 4 章的**主定理**，' +
            '但紧接着给了那个著名的说法：“**用掉一个因子 $n$，换回一个因子 $\\lg n$**”' +
            '（trades away a factor of n for a factor of lg n）。' +
            '这一句值得多读两遍：插入排序的 $n^2$ 与归并排序的 $n \\lg n$，' +
            '在 $n$ 很大时差得极远 —— 而且**只在 $n$ 足够大时**才成立，' +
            '这正是阶段 8 习题 2-1 要你去抠的细节。',
        },
        {
          kind: 'remark',
          page: [42, 44],
          en:
            'The total number of levels of the recursion tree in Figure 2.5 is lg n + 1, where n ' +
            'is the number of leaves, corresponding to the input size. …\n' +
            'To compute the total cost represented by the recurrence (2.4), simply add up the ' +
            'costs of all the levels. The recursion tree has lg n + 1 levels. The levels above ' +
            'the leaves each cost c₂n, and the leaf level costs c₁n, for a total cost of ' +
            'c₂n lg n + c₁n = Θ(n lg n).',
          zh:
            '这是**不用主定理**也能看懂的推导路线：把递归式画成树，' +
            '① 算清每层的代价（都是 $c_2 n$，因为“翻倍”与“减半”正好抵消）；' +
            '② 数清有多少层（$\\lg n + 1$）；' +
            '③ 相乘相加，得到 $c_2 n \\lg n + c_1 n$。' +
            '阶段 6 会把这三步完整走一遍，并把 Figure 2.5 画出来。',
        },
      ],
      terms: [
        { en: 'divide-and-conquer', zh: '分治法（拆—解—合）', page: 34 },
        { en: 'incremental method', zh: '增量法（插入排序的设计思路）', page: 34 },
        { en: 'base case / recursive case', zh: '最小情形 / 递归情形', page: [34, 35] },
        { en: 'merge sort', zh: '归并排序', page: 35 },
        { en: 'MERGE(A, p, q, r)', zh: '合并过程：把 A[p:q] 与 A[q+1:r] 并成有序的 A[p:r]', page: 36 },
        { en: 'recurrence (recurrence equation)', zh: '递归式', page: 39 },
        { en: 'T(n)', zh: '规模为 n 时（最坏情况）的运行时间', page: 39 },
        { en: 'recursion tree', zh: '递归树（把递归式画成树来算总代价）', page: 42 },
        { en: 'lg n', zh: '以 2 为底的对数 log₂ n', page: 41 },
        { en: 'master theorem', zh: '主定理（第 4 章，用于解递归式）', page: 41 },
      ],
    },

    /* ================= 阶段 3 · 伪代码骨架 ================= */
    {
      type: 'pseudocode',
      title: '读全 34 行：先看整体，再看关键的那一步',
      algo: 'MERGE-SORT',
      signature: 'MERGE-SORT(A, p, r)',
      subtitle: 'MERGE-SORT(A, p, r) —— 只有 7 行',
      page: 39,
      lead:
        '归并排序其实是**两个过程**：`MERGE-SORT` 负责“分”与调度，`MERGE` 负责“合”。' +
        '先读短的这 7 行 —— 它几乎是 Divide / Conquer / Combine 三步的逐字翻译。',
      hint: '点任意一行，看它到底在做什么。',
      lines: [
        { n: 1, code: 'if p ≥ r', zh: '★ base case。p ≥ r 表示这段区间里“0 个或 1 个元素”。为什么写 ≥ 而不是 = ？因为初始调用 MERGE-SORT(A, 1, n) 已保证 p ≤ r，递归时算出 q ≥ p，只会产生 p = r 的情形。书上习题 2.3-2 让你亲自论证这一点。' },
        { n: 2, code: '    return', zh: '直接返回。不需要做任何事 —— 单个元素的子数组天然有序。这就是 Divide / Conquer / Combine 里“解”的最小情形。' },
        { n: 3, code: '    q = ⌊(p + r)/2⌋', zh: '这是 Divide 步骤的全部内容：算中点。用下取整保证 A[p:q] 有 ⌈n/2⌉ 个元素、A[q+1:r] 有 ⌊n/2⌋ 个 —— 左半可能比右半多 1 个（n 为奇数时）。' },
        { n: 4, code: '    MERGE-SORT(A, p, q)', zh: 'Conquer（左）：递归排序左半。注意这里**不是循环**，是函数调用自己。程序会一路钻到最底层，再一层层返回。' },
        { n: 5, code: '    MERGE-SORT(A, q + 1, r)', zh: 'Conquer（右）：递归排序右半。左右是**先后**执行的，不是并行 —— 这一点在数运行时间时很关键（见阶段 6 的递归树）。' },
        { n: 6, code: '// Merge A[p : q] and A[q + 1 : r] into A[p : r].', zh: '注释行。注意它和第 7 行的关系：第 7 行做的是一个**原地**操作 —— 结果直接写回 A[p:r]，不返回新数组。' },
        { n: 7, code: 'MERGE(A, p, q, r)', zh: '★ Combine 步骤：调用关键的合并过程。到这里，A[p:q] 与 A[q+1:r] 各自已经有序，MERGE 负责把它们并成有序的 A[p:r]。下一张表就是它的 27 行。' },
      ],
      vars: [
        { name: 'A', meaning: '待排序的数组，`A[1 : n]`（书上从 1 开始编号）' },
        { name: 'p, r', meaning: '当前子数组的左右边界，闭区间 `A[p : r]`' },
        { name: 'q', meaning: '中点，`q = ⌊(p + r)/2⌋`；把 `A[p : r]` 分成 `A[p : q]` 与 `A[q + 1 : r]`' },
        { name: 'n', meaning: '本段的元素个数，`n = r − p + 1`（书上在讲 MERGE 的复杂度时用这个记号）' },
      ],
      note:
        '★ 请把第 3 行和第 7 行读成一句话：' +
        '**“在第 3 行算出中点，是为了在第 7 行知道该合并哪两段。”** ' +
        '很多人第一次读递归会卡在“函数调用自己，那到底什么时候算完？” —— ' +
        '答案是**先到底再往上**：第 4 行会让程序一路钻到单元素，' +
        '然后每一层返回时顺路执行第 5、7 行。阶段 4 第（2）块面板会把这棵调用树逐层展开。',

      // 配套的第二段伪代码（原书 p.36）—— 用 stage.more 追加
      more: [
        {
          algo: 'MERGE',
          signature: 'MERGE(A, p, q, r)',
          subtitle: 'MERGE(A, p, q, r) —— 关键的那一步，27 行',
          page: 36,
          hint: '点任意一行，看它到底在做什么。',
          lines: [
            { n: 1, code: 'n_L = q − p + 1', zh: '左段 A[p : q] 的长度。' },
            { n: 2, code: 'n_R = r − q', zh: '右段 A[q + 1 : r] 的长度。注意**不是** r − q + 1 —— 右段从 q + 1 起，个数是 r − (q+1) + 1 = r − q。' },
            { n: 3, code: 'let L[0 : n_L − 1] and R[0 : n_R − 1] be new arrays', zh: '★ 开两块临时空间。注意 L、R 是 **0 基**（从 0 开始），而 A 是 1 基 —— 书上脚注 12 明说这是全书少见的混用，并解释这么写能让习题 2.3-3 的不变量更简单。' },
            { n: 4, code: 'for i = 0 to n_L − 1', zh: '把左段搬进 L。' },
            { n: 5, code: '    L[i] = A[p + i]', zh: '对应关系：L 的第 i 个 = A 的第 p + i 个。因为 i 从 0 起、A 从 p 起，所以偏移是 p + i。' },
            { n: 6, code: 'for j = 0 to n_R − 1', zh: '把右段搬进 R。' },
            { n: 7, code: '    R[j] = A[q + j + 1]', zh: '对应关系：R 的第 j 个 = A 的第 q + j + 1 个。这里的“+ 1”就是“右段从 q+1 开始”那一位。' },
            { n: 8, code: 'i = 0', zh: 'i 指向 L 中**尚未归位的最小元素**。' },
            { n: 9, code: 'j = 0', zh: 'j 指向 R 中**尚未归位的最小元素**。' },
            { n: 10, code: 'k = p', zh: '★ k 指向 A 中**下一个要填的位置**。所以写回时用的是 A[k]，而 k 从 p 起 —— 这就是“原地合并”的入口。' },
            { n: 11, code: '// As long as each of the arrays L and R contains an unmerged element, copy the smallest unmerged element back into A[p : r].', zh: '注释行，把接下来那个 while 的意图一句话说清：只要两边都还有没归位的元素，就继续取最小者。' },
            { n: 12, code: 'while i < n_L and j < n_R', zh: '★ 主循环。两个条件都要求“还没走完”。注意这是 and，一旦某一边走完就退出，剩下的交给后面两个循环 —— 这正是“某一边空了就把另一叠整个翻过来”那句类比的代码化。' },
            { n: 13, code: '    if L[i] ≤ R[j]', zh: '★ 核心比较。取更小的那个。用 ≤ 而不是 < 是有意的：相等时优先取左边，这保证了**稳定性**（相同值的相对顺序不变）。' },
            { n: 14, code: '        A[k] = L[i]', zh: '把 L 的当前最小者放到 A 的 k 位。' },
            { n: 15, code: '        i = i + 1', zh: 'i 前进：L 里曝光了下一个更大的元素。' },
            { n: 16, code: '    else A[k] = R[j]', zh: '否则取 R 的当前最小者。（书上把 else 与上一行的赋值写在同一行，缩进表示它属于 else 分支。）' },
            { n: 17, code: '        j = j + 1', zh: 'j 前进。' },
            { n: 18, code: '    k = k + 1', zh: '★ 无论走哪个分支，k 都要前进一格。注意它的缩进：它在 if 之外、while 之内 —— 缩进看错，算法就错了。' },
            { n: 19, code: '// Having gone through one of L and R entirely, copy the remainder of the other to the end of A[p : r].', zh: '注释行：某一边已经整个走完，把另一边剩下的直接抄到 A 的尾部。' },
            { n: 20, code: 'while i < n_L', zh: '如果 L 还有剩（说明 R 先走完了）。' },
            { n: 21, code: '    A[k] = L[i]', zh: '直接抄，不需要比较 —— 剩下的这些一定是两段中最大的那几个。' },
            { n: 22, code: '    i = i + 1', zh: '——' },
            { n: 23, code: '    k = k + 1', zh: '——' },
            { n: 24, code: 'while j < n_R', zh: '如果 R 还有剩。注意书上的细节：Figure 2.3 那个例子里 R 先走完，所以**这个循环执行了 0 次**。' },
            { n: 25, code: '    A[k] = R[j]', zh: '直接抄。' },
            { n: 26, code: '    j = j + 1', zh: '——' },
            { n: 27, code: '    k = k + 1', zh: '——' },
          ],
          vars: [
            { name: 'n_L, n_R', meaning: '左段、右段的长度：`n_L = q − p + 1`，`n_R = r − q`' },
            { name: 'L, R', meaning: '临时数组（**0 基**），分别存放 `A[p : q]` 与 `A[q + 1 : r]` 的副本' },
            { name: 'i, j', meaning: '分别指向 L、R 中尚未归位的最小元素（0 基）' },
            { name: 'k', meaning: 'A 中下一个要填的位置（**1 基**，初值 p）' },
          ],
          note:
            '★ 三条读这段代码的要点：' +
            '① **三个 while 循环加起来**恰好执行 $n = r - p + 1$ 次，' +
            '因为“every value is copied back into A exactly once”（原书 p.38）；' +
            '② 第 14 / 16 行**没有**做“把元素搬走”的动作 —— 它是**覆盖** A[k]，' +
            '而原来的值早已在第 5 / 7 行复制进 L、R 了，所以不会丢数据；' +
            '③ 第 20–27 行那两个循环**其中一个必然执行 0 次**，' +
            '这就是第 4 版 MERGE 不再需要 $\\infty$ 哨兵的原因。',
        },
      ],
    },

    /* ================= 阶段 4 · 动手看见 ================= */
    {
      type: 'visualize',
      title: '看着它一步步跑',
      lead:
        '下面有**两块**面板，对应原书的两张图，请分别看：' +
        '第（1）块是 MERGE 本身（原书 Figure 2.3 的动作），第（2）块是整个归并排序的分与合（原书 Figure 2.4）。' +
        '两块都可以单步、回退、调速。',
      panels: [
        /* ---- (1) MERGE：Figure 2.3 ---- */
        {
          title: 'MERGE 合并这一步（对应原书 Figure 2.3）',
          viz: 'array',
          algorithm: 'merge',
          algoArgs: [1, 4, 8],
          vizMode: 'bars',
          pseudocodeRef: 'MERGE',
          input: { array: [2, 4, 6, 7, 1, 2, 3, 5] },
          invariants: [{
            label: 'A[p : k−1] 已装好 L、R 中最小的 k−p 个元素且有序',
          }],
          presets: [
            { name: '原书 Figure 2.3：L=⟨2,4,6,7⟩ R=⟨1,2,3,5⟩（前后两段各 4 个）', array: [2, 4, 6, 7, 1, 2, 3, 5] },
            { name: '右边先走完：R 的最小值更大', array: [1, 2, 3, 4, 5, 6, 7, 8] },
            { name: '左边先走完：L 的最小值更大', array: [5, 6, 7, 8, 1, 2, 3, 4] },
            { name: '含重复值：相等时优先取左边（稳定的关键）', array: [2, 2, 4, 6, 2, 3, 5, 7] },
          ],
          tasks: [
            '选第 1 组数据，一路单步走完 MERGE 的 27 行，数一数第 13 行一共比较了几次。',
            '看指针 k 是怎么从 p 一路推到 r + 1 的 —— 这就是“原地合并”的样子。',
            '换成第 2 组（右边先走完），观察第 20–23 行那个循环接管了剩下的工作；' +
              '再换第 3 组（左边先走完），这次换成第 24–27 行。',
            '注意：面板上的箭头只画 A 的下标（p、q、r、k）。i、j 是 L、R 的下标，' +
              '画不到 A 上 —— 它们的值在下面的每一帧说明里给出。',
          ],
        },

        /* ---- (2) Figure 2.4 的分—合递归树 ---- */
        {
          title: '整个归并排序的分与合（对应原书 Figure 2.4）',
          viz: 'tree',
          vizMode: 'tree',
          trees: FIG24_FRAMES,
          treeNotes: FIG24_NOTES,
          invariants: [{
            label: '每一层都在合并“相邻且各自有序”的两段',
          }],
          tasks: [
            '数一数：从上往下（divide）一共分了几层才到单元素？',
            '把斜体序号连起来读一遍 —— 它们是原书 Figure 2.4 标注的**调用顺序**。' +
              '注意左半整棵树做完之后，才轮到右半。',
            '想一想：图中的斜体序号一共到几？这个数字与原书图注说的“初始调用之后”是什么关系？',
          ],
        },
      ],
      tail:
        '★ 两块面板对着原书两张图看。' +
        'Figure 2.3 给你的信息是“**合并**怎么做”；' +
        'Figure 2.4 给你的信息是“**递归**展开长什么样”。' +
        '阶段 6 要算的那棵树（Figure 2.5）和这里的 Figure 2.4 长得像，' +
        '但节点上标的不再是数组，而是**代价** —— 这是本关最容易混淆的一处，' +
        '到阶段 6 我们会把两者的区别讲清楚。',
    },

    /* ================= 阶段 5 · 双轨实现 ================= */
    {
      type: 'code',
      title: '从伪代码到 C',
      intro:
        '这一关的 C 代码比 2.1 稍长，但转换规则还是同一条：**书上每个下标减 1**。' +
        '另有两条要特别留意：' +
        '① 书中 $L[0 : n_L - 1]$、$R[0 : n_R - 1]$ **本来就是 0 基**，所以在 C 里**不要**再减 1；' +
        '② 书中是闭区间 $A[p : q]$，C 里对应 `a[p-1]` 到 `a[q-1]`，' +
        '而 $A[q+1 : r]$ 对应 `a[q]` 到 `a[r-1]`。',
      pseudocodeRef: 'MERGE-SORT',
      c: {
        file: 'merge_sort.c',
        code: C_IMPL,
        notes: [
          { line: 20, zh: '`int nL = q - p + 1` 与书第 1 行逐字一致 —— 这里的 p、q、r 都是**1 基**，本函数故意保持 1 基签名，只在访问 `a[ : .]` 时才减 1。这样伪代码与 C 的对应关系一眼可见。' },
          { line: 23, zh: '`a[p - 1 + i]`：书第 5 行是 `L[i] = A[p + i]`。A 是 1 基、L 是 0 基，转换时只对 A 那侧减 1，所以写成 `a[p - 1 + i]`。' },
          { line: 24, zh: '`a[q + j]`：书第 7 行是 `R[j] = A[q + j + 1]`。把 A 的下标减 1 之后，`q + j + 1 - 1 = q + j` —— 那个“+ 1”在 C 里被“- 1”抵消掉了。这一处最容易写错，请自己推一遍。' },
          { line: 26, zh: '书第 13 行的 `if L[i] ≤ R[j]`，C 里是 `L[i] <= R[j]`。（如果只是分别取两段里的较小者，先取出哪个都不影响正确性；写成 `<=` 才与书上一致。）' },
          { line: 27, zh: '★ `a[k - 1] = L[i]`：书第 14 行是 `A[k] = L[i]`。k 是 1 基，所以访问时减 1。注意这里**没有**移动任何元素，只是覆盖 —— 原来的值早就搬进 L/R 了。' },
          { line: 39, zh: '★ `if (p >= r) return;` 与书第 1–2 行完全一致。注意**不要**顺手改成 `if (p == r)` —— 虽然这里两者等价（习题 2.3-2 就是让你证这一点），但保持与书上一致最稳。' },
          { line: 40, zh: '`int q = (p + r) / 2;` 对应书第 3 行的 `q = ⌊(p + r)/2⌋`。C 的整数除法对**非负数**天然就是下取整，所以直接用 `/` 即可；如果 p 可能为负，就必须改用 `floor` 之类的写法。' },
        ],
        tests: [
          { in: '[12, 3, 7, 9, 14, 6, 11, 2]', out: '[2, 3, 6, 7, 9, 11, 12, 14]（原书 Figure 2.4）' },
          { in: '[2, 4, 6, 7, 1, 2, 3, 5]', out: '[1, 2, 2, 3, 4, 5, 6, 7]（原书 Figure 2.3 的 L+R，含重复值）' },
          { in: '[5, 2, 4, 6, 1, 3]', out: '[1, 2, 3, 4, 5, 6]（原书 Figure 2.2 的数组）' },
          { in: '[6, 5, 4, 3, 2, 1]', out: '[1, 2, 3, 4, 5, 6]（完全逆序）' },
          { in: '[42]', out: '[42]（单元素 —— 直接命中 base case）' },
          { in: 'n = 0', out: '空数组，sort_into 直接返回' },
          { in: '每个元素恰好写回一次', out: '三个 while 循环合计执行 r − p + 1 次（原书 p.38 的论证，本站用断言验证）' },
        ],
      },
      mapping: [
        { pc: 1, pcCode: 'if p ≥ r', c: 'if (p >= r)' },
        { pc: 2, pcCode: 'return', c: 'return;' },
        { pc: 3, pcCode: 'q = ⌊(p + r)/2⌋', c: 'int q = (p + r) / 2;' },
        { pc: 4, pcCode: 'MERGE-SORT(A, p, q)', c: 'merge_sort(a, p, q);' },
        { pc: 5, pcCode: 'MERGE-SORT(A, q + 1, r)', c: 'merge_sort(a, q + 1, r);' },
        { pc: 7, pcCode: 'MERGE(A, p, q, r)', c: 'merge(a, p, q, r);' },
        { pc: 'MERGE 1', pcCode: 'n_L = q − p + 1', c: 'int nL = q - p + 1;' },
        { pc: 'MERGE 2', pcCode: 'n_R = r − q', c: 'int nR = r - q;' },
        { pc: 'MERGE 5', pcCode: 'L[i] = A[p + i]', c: 'L[i] = a[p - 1 + i];' },
        { pc: 'MERGE 7', pcCode: 'R[j] = A[q + j + 1]', c: 'R[j] = a[q + j];' },
        { pc: 'MERGE 13', pcCode: 'if L[i] ≤ R[j]', c: 'if (L[i] <= R[j])' },
        { pc: 'MERGE 14', pcCode: 'A[k] = L[i]', c: 'a[k - 1] = L[i];' },
        { pc: 'MERGE 18', pcCode: 'k = k + 1', c: 'k++;' },
        { pc: 'MERGE 20–23', pcCode: 'while i < n_L', c: 'while (i < nL) { a[k-1] = L[i]; i++; k++; }' },
        { pc: 'MERGE 24–27', pcCode: 'while j < n_R', c: 'while (j < nR) { a[k-1] = R[j]; j++; k++; }' },
      ],
      engine: {
        lang: 'js',
        code: ENGINE_EXCERPT,
        note:
          '这份 JS 生成器就是面板里动画的数据源。它与 C 版本的区别只有一处：' +
          '为了画图，它每一步 `yield` 一次，把当前数组与指针状态交出去。' +
          '`counts.cmp` / `counts.move` 就是面板上那两个计数器。',
      },
    },

    /* ================= 阶段 6 · 复杂度 ================= */
    {
      type: 'analyze',
      title: '递归式与递归树：为什么是 Θ(n lg n)',
      intro:
        '这一节做两件事：先把归并排序的运行时间写成**递归式**，' +
        '再用一棵**递归树**把它解出来。' +
        '书上说完整的解法在第 4 章（主定理），但这里给出的推导你完全能跟上 —— ' +
        '它只需要加法和数层数。',
      claims: [
        {
          expr: 'T(n) = 2T(n/2) + \\Theta(n)',
          when: '归并排序的运行时间递归式（原书式 (2.3)）',
          page: 41,
          source: 'book',
        },
        {
          expr: 'T(n) = \\Theta(n \\lg n)',
          when: '递归式 (2.3) 的解 —— 原书用第 4 章的主定理给出',
          page: 41,
          source: 'book',
        },
        {
          expr: 'c_2 n \\lg n + c_1 n',
          when: '把每层代价加起来得到的精确表达式，主项为 c₂n lg n',
          page: [43, 44],
          source: 'book',
        },
        {
          expr: 'n - 1',
          when: '合并两段总长为 n 的已排序数据，最坏需要这么多次比较',
          page: 35,
          source: 'book',
        },
      ],
      tables: [
        {
          caption: '逐项对应 Divide / Conquer / Combine（原书 p.41 的原文结构）',
          rows: [
            ['Divide（算中点）', 'D(n) = Θ(1) —— 一次除法，常数时间', true],
            ['Conquer（两个子问题）', '2T(n/2) —— 两份，每份规模 n/2', true],
            ['Combine（MERGE）', 'C(n) = Θ(n) —— 合并两段总长 n 的数据', true],
            ['合起来', 'T(n) = D(n) + 2T(n/2) + C(n) = 2T(n/2) + Θ(n)', true],
          ],
        },
        {
          caption: '递归树每层的代价（原书 Figure 2.5(d) 的读法）',
          rows: [
            ['第 0 层（1 个节点）', 'c₂n', true],
            ['第 1 层（2 个节点）', 'c₂(n/2) + c₂(n/2) = c₂n', true],
            ['第 2 层（4 个节点）', 'c₂(n/4) × 4 = c₂n', true],
            ['第 i 层（2ⁱ 个节点）', 'c₂(n/2ⁱ) × 2ⁱ = c₂n —— **每层都一样**', true],
            ['叶子层（n 个节点）', 'c₁ × n = c₁n', true],
            ['总层数', 'lg n + 1', true],
            ['总代价', 'c₂n · lg n + c₁n = Θ(n lg n)', true],
          ],
        },
        {
          caption: '两个排序算法的对比（前三条出自原书 p.41；最后一行是本站补充的数值代入）',
          rows: [
            ['插入排序 最坏情况', 'Θ(n²)', true],
            ['归并排序 最坏情况', 'Θ(n lg n)', true],
            ['交换了什么', '“trades away a factor of n for a factor of lg n”', true],
            ['n = 1024 时', 'n² ≈ 10⁶，n lg n ≈ 10⁴ —— 差两个数量级（本站代入计算）', true],
          ],
        },
        {
          caption: '本关出现的两张“树”，别混淆（本站整理的对照）',
          rows: [
            ['Figure 2.4（阶段 4）', '节点上放的是**数组**，看递归的调用顺序与分合过程', true],
            ['Figure 2.5（本阶段）', '节点上放的是**代价**，看每层花多少钱、一共多少层', true],
            ['共同点', '形状一样（都是每次二分的二叉树），都用来建立“递归”的直觉', true],
          ],
        },
      ],
      chart: {
        xMax: 64,
        series: [
          { name: '插入排序 ≈ n²', color: '--viz-compare', expr: 'n * n' },
          { name: '归并排序 ≈ n·lg n', color: '--viz-done', expr: 'n * Math.log2(n)' },
          { name: '线性参照 n', color: '--viz-idle', expr: 'n' },
        ],
      },
      derivations: [
        {
          title: '第一步 · 为什么要写出递归式',
          steps: [
            {
              zh: '归并排序是**递归**的，所以不能像 2.1 那样一行行数 tᵢ —— ' +
                  '因为它的运行时间里有“自己的运行时间”这个未知量。' +
                  '递归式就是用来处理这种自我引用：' +
                  '把 $T(n)$ 写成 $T$ 在更小规模上的表达式，解出来就得到了 $T(n)$。',
            },
            {
              zh: '原书 p.39 给了通用的模板：' +
                  '如果一次划分产生 $a$ 个规模为 $n/b$ 的子问题，' +
                  '划分耗时 $D(n)$、合并耗时 $C(n)$，那么',
              tex: 'T(n) = \\begin{cases} \\Theta(1) & \\text{if } n < n_0, \\\\ D(n) + aT(n/b) + C(n) & \\text{otherwise.} \\end{cases}',
            },
            {
              zh: '归并排序里 $a = b = 2$，$D(n) = \\Theta(1)$，$C(n) = \\Theta(n)$，' +
                  '代进去就得到式 (2.3)：$T(n) = 2T(n/2) + \\Theta(n)$。' +
                  '书上也提醒：**其他分治算法里 $a \\ne b$ 是常见的**，' +
                  '所以模板里保留 $a$、$b$ 两个参数。',
            },
          ],
        },
        {
          title: '第二步 · 把递归式画成一棵树（Figure 2.5）',
          steps: [
            {
              zh: '为了看清结构，书上做两个简化（都在 p.42 说明）：' +
                  '① 假设 $n$ 是 2 的整数次幂；② 隐式的 base case 是 $n = 1$。' +
                  '于是式 (2.3) 变成式 (2.4)：',
              tex: 'T(n) = \\begin{cases} c_1 & \\text{if } n = 1, \\\\ 2T(n/2) + c_2 n & \\text{if } n > 1. \\end{cases}',
            },
            {
              zh: '把 $T(n)$ 画成一个节点：它的代价 $c_2n$ 写在节点旁边，' +
                  '两个子节点就是那两个 $T(n/2)$。' +
                  '继续展开每个节点，直到规模降到 1（代价 $c_1$）。',
            },
            {
              zh: '★ 关键的一步 —— **逐层相加**：' +
                  '第 $i$ 层有 $2^i$ 个节点，每个节点的代价是 $c_2(n/2^i)$，' +
                  '所以第 $i$ 层的层代价是 $2^i \\cdot c_2(n/2^i) = c_2 n$。' +
                  '**每一层都是 $c_2n$** —— 书上原话是“doubling and halving cancel each other out”' +
                  '（翻倍与减半互相抵消）。',
            },
            {
              tex: '\\underbrace{c_2 n + c_2 n + \\cdots + c_2 n}_{\\lg n \\text{ 层}} + \\underbrace{c_1 n}_{\\text{叶子层}} = c_2 n \\lg n + c_1 n = \\Theta(n \\lg n)',
              zh: '叶子层有 $n$ 个节点、每个代价 $c_1$，所以是 $c_1n$。' +
                  '合起来：$c_2 n \\lg n + c_1 n$，主项是 $c_2 n \\lg n$，即 $\\Theta(n \\lg n)$。',
            },
          ],
        },
        {
          title: '第三步 · 为什么层数是 lg n + 1',
          steps: [
            {
              zh: '书上的论证是**归纳法**（p.42–44）。base case：$n = 1$ 时树只有 1 层，' +
                  '而 $\\lg 1 + 1 = 0 + 1 = 1$，公式成立。',
            },
            {
              zh: '归纳假设：有 $2^i$ 个叶子的递归树有 $\\lg 2^i + 1 = i + 1$ 层。' +
                  '那么 $n = 2^{i+1}$ 个叶子时，比 $2^i$ 的情形多一层，' +
                  '所以总层数是 $(i+1) + 1 = \\lg 2^{i+1} + 1$。归纳完成。',
            },
            {
              zh: '★ 直觉版：每往下走一层，规模就减半；' +
                  '“从 $n$ 减半到 1 要走几步”这个问题的答案就是 $\\lg n$。' +
                  '再加上最上面的那一层，所以是 $\\lg n + 1$ 层。' +
                  '这也顺便解释了阶段 0 那句“为什么 $\\lg n$ 会出现在分治算法里”。',
            },
          ],
        },
      ],
      note:
        '★ 三点说明。' +
        '第一，式 (2.3) 到 $\\Theta(n\\lg n)$ 的**正式**解法是第 4 章的主定理，' +
        '本节给你的是书上 p.42–44 那条“不用主定理”的直观路线，两者结论一致。' +
        '第二，带“本站补充”标记的那一行（$n = 1024$ 的数值对比）是我加进来的，' +
        '原文里没有这组数字，但它只是代入计算，不引入任何新论断。' +
        '第三，请特别留意**两张树的区别**：阶段 4 的 Figure 2.4 节点上是数组，' +
        '本阶段的 Figure 2.5 节点上是代价 —— 形状一样，用途完全不同。' +
        '后面第 4 章会把“递归树”正式确立为解递归式的通用工具。',
      // 递归树（原书 Figure 2.5）—— 复用可视化面板
      viz: 'tree',
      vizMode: 'tree',
      trees: FIG25_FRAMES,
      treeNotes: FIG25_NOTES,
      pseudocodeRef: 'MERGE-SORT',
      figureTitle: '原书 Figure 2.5：代价递归树的四步构造（点“下一帧”逐层展开）',
      invariants: [{ label: '每一层的层代价都恰好是 c₂n' }],
    },

    /* ================= 阶段 7 · 正确性 ================= */
    {
      type: 'prove',
      title: '凭什么说 MERGE 一定对',
      statement:
        'At the start of each iteration of the while loop of lines 12–18, the subarray ' +
        'A[p : k − 1] contains the k − p smallest elements of L[0 : n_L − 1] and ' +
        'R[0 : n_R − 1], in sorted order. Moreover, L[i] and R[j] are the smallest elements ' +
        'of their arrays that have not been copied back into A.',
      page: 36,
      intro:
        '★ 先说明一件事：**上面这条不变量是本站给出的参考形式，不是原书正文的原文。**' +
        '原书在 2.3 节正文里没有证明 MERGE 的正确性 —— 它把这个任务留成了**习题 2.3-3**：' +
        '“State a loop invariant for the while loop of lines 12–18 of the MERGE procedure. ' +
        'Show how to use it, along with the while loops of lines 20–23 and 24–27, to prove ' +
        'that the MERGE procedure is correct.”' +
        '所以下面三步是**参考答案**，请先自己想，卡住了再展开对照。' +
        '三步的结构与 2.1 完全一样：初始化 / 保持 / 终止。',
      steps: [
        {
          title: '第一步 · 初始化（Initialization）',
          en: 'It is true prior to the first iteration of the loop.',
          page: 20,
          body: [
            '第一次进入第 12 行的 while 循环之前，第 8–10 行刚把三个指针安置好：' +
              '$i = 0$、$j = 0$、$k = p$。',
            '先看不变量后半句：$L[i] = L[0]$ 与 $R[j] = R[0]$ 各自是 L、R 中**尚未归位**的最小元素。' +
              '为什么？因为 L、R 各自已经有序（第 4–7 行是把 A 上已经分别排好序的两段**原样复制**过来的），' +
              '而 0 号位就是最小者的位置。',
            '再看前半句：$k = p$ 时 $A[p : k-1] = A[p : p-1]$ 是一个**空区间**。' +
              '“含有最小的 $k - p = 0$ 个元素”对空集自然成立（空集里没有元素，也就没有不满足排序的元素）。' +
              '★ 这就是 2.1 里学过的技巧：**退化情形要单独说清楚它为什么成立**，' +
              '空数组是最常见的退化情形。',
          ],
        },
        {
          title: '第二步 · 保持（Maintenance）',
          en: 'If it is true before an iteration of the loop, it remains true before the next iteration.',
          page: 20,
          body: [
            '设进入本轮时不变量成立。分两种情况。',
            '**情况一：$L[i] \\le R[j]$（第 13 行取真，走第 14–15 行）。**' +
              '因为 $L[i]$ 是 L 中最小的未归位者、$R[j]$ 是 R 中最小的未归位者，' +
              '所以 $L[i] \\le R[j]$ 说明 $L[i]$ 比 R 里剩下的**每一个**都小；' +
              '而它又是 L 里最小的，所以 $L[i]$ 是**两段中所有未归位元素里的最小值**。' +
              '把它写进 $A[k]$ 之后，$A[p : k]$ 里就是原先 $A[p:k-1]$ 的那些（它们是更小的 $k-p$ 个）' +
              '加上这个“下一个最小值” —— 一共 $k+1-p$ 个，而且仍然有序。' +
              '随后 $i$ 加 1，$L[i]$ 变成 L 中新的最小未归位者，后半句依然成立。',
            '**情况二：$L[i] > R[j]$（走第 16–17 行）。**' +
              '完全对称：$R[j]$ 成为两段中的最小值。',
            '两种情况下第 18 行都会做 $k = k + 1$ —— ' +
              '这正是上面那句“$A[p:k]$ 是新的前缀”的来历。' +
              '于是本轮结束时，不变量对下一轮依然成立。',
            '★ 提醒一处细节：$L[i] \\le R[j]$ 用的是 $\\le$ 而不是 $<$。' +
              '这保证了相等时优先取**左段**的元素，从而 MErGE 是**稳定**的' +
              '（相同关键字在结果里保持原有的相对次序）。这个性质后面章节做多关键字排序时会用到。',
          ],
        },
        {
          title: '第三步 · 终止（Termination）',
          en: 'the invariant—usually along with the reason that the loop terminated—gives ' +
              'us a useful property that helps show that the algorithm is correct.',
          page: 20,
          body: [
            '$i$、$j$ 各只增不减，且分别以 $n_L$、$n_R$ 为上界，所以第 12 行的 while 必然会停。' +
              '它停下来的那一刻，$i = n_L$ 或 $j = n_R$ 至少有一个成立。',
            '把不变量代到停机那一刻：$A[p : k-1]$ 里装的是 L、R 中最小的 $k-p$ 个元素，' +
              '而且有序。此时**全部候选元素的总数**是 $n = n_L + n_R$，' +
              '而已归位的是 $k - p$ 个，所以还剩 $n - (k-p)$ 个没归位 —— ' +
              '它们全部在**还有剩的那一段**里。',
            '接下来第 20–23 行或第 24–27 行（原书 p.38 明确指出**其中一个必然执行 0 次**）' +
              '把剩下的直接抄到 $A$ 的尾部。因为它们都比已经归位的那些大，' +
              '所以整体仍然有序。三个循环加起来恰好写回 $n$ 个元素，' +
              '结束时 $k = r + 1$，即 $A[p : r]$ 已整体有序。',
            '**MERGE 正确。** 补充一句更完整的说法：' +
              '第 4–7 行把 $A[p : r]$ 的内容原封不动分装进 L、R，' +
              '第 12–27 行再把 L、R 的内容逐一写回 $A[p : r]$ —— ' +
              '**进去的和出来的是同一批元素**，只是顺序变了。' +
              '这一点（“没多也没少”）是不变量前半句在帮你盯着的。',
          ],
        },
      ],
      conclusion:
        'MERGE 证完了。归并排序整体的正确性靠**归纳**接上：' +
        'base case 是单元素子数组天然有序（第 1–2 行）；' +
        '归纳步是“两段各自有序 $\\Rightarrow$ MERGE 之后整体有序”（正是上面证过的）。' +
        '★ 原书把 MERGE 的不变量留作习题 2.3-3，把二分查找留作 2.3-6，' +
        '都在阶段 8 的“原书习题”里，建议先自己写一遍再回来看这三步 —— ' +
        '自己写出来的不变量往往与参考版本措辞不同但等价，那说明你真的懂了。',
    },

    /* ================= 阶段 8 · 闯关测验 ================= */
    {
      type: 'drill',
      title: '检验一下',
      items: [
        {
          kind: 'judge',
          q: '归并排序的递归式是 $T(n) = 2T(n/2) + \\Theta(n)$，其中 $\\Theta(n)$ 这一项来自 MERGE。',
          answer: true,
          why:
            '对。三个阶段各自的代价是：Divide $D(n) = \\Theta(1)$、Conquer $2T(n/2)$、' +
            'Combine $C(n) = \\Theta(n)$。合并 $D(n) + C(n) = \\Theta(1) + \\Theta(n) = \\Theta(n)$，' +
            '所以递归式写成 $T(n) = 2T(n/2) + \\Theta(n)$。' +
            '注意“算中点”是常数时间，它被 $\\Theta(n)$ 吸收了 —— 但**不能**因此说 Divide 不存在。',
        },
        {
          kind: 'single',
          q: '在原书 Figure 2.3 的调用 MERGE(A, 9, 12, 16) 里，$n_L$ 与 $n_R$ 分别是多少？',
          options: ['4 和 4', '4 和 3', '3 和 4', '4 和 5'],
          answer: 0,
          why:
            '$n_L = q - p + 1 = 12 - 9 + 1 = 4$，$n_R = r - q = 16 - 12 = 4$。' +
            '最常错的是 $n_R$ 写成 $r - q + 1 = 5$ —— 右段从 $q+1 = 13$ 起，到 16 止，' +
            '$16 - 13 + 1 = 4$，也就是 $r - q$。这一处下标差 1 是伪代码里最容易翻车的地方。',
        },
        {
          kind: 'single',
          q: '递归树 Figure 2.5(d) 里，为什么每一层的层代价都等于 $c_2 n$？',
          options: [
            '因为每一层的节点数都一样',
            '因为节点数翻倍与每节点代价减半正好抵消',
            '因为 $c_2$ 是常数，可以提出来',
            '因为叶子层的代价被平摊到了上面每一层',
          ],
          answer: 1,
          why:
            '第 $i$ 层有 $2^i$ 个节点，每个的代价是 $c_2 n / 2^i$，相乘得 $2^i \\cdot c_2 n / 2^i = c_2 n$。' +
            '书上原话是“doubling and halving cancel each other out”。' +
            '这也解释了为什么总代价是“层数 × 每层代价 + 叶子层”，如此干净。',
        },
        {
          kind: 'judge',
          q: '第 4 版的 MERGE 使用了 $\\infty$ 哨兵来简化边界判断。',
          answer: false,
          why:
            '陷阱题。**第 4 版不再用哨兵** —— 它把 $A[p:q]$、$A[q+1:r]$ 复制进 L、R（第 4–7 行），' +
            '主循环（12–18 行）做完之后，用两个**剩余复制循环**（20–23、24–27 行）把没走完的那一段直接抄回去。' +
            '旧版（第 3 版）才在 L、R 末尾各放一个 $\\infty$。' +
            '若你手边有别的版本资料，读 MERGE 时务必先确认它用的是哪一种 —— 两版的伪代码行数都不一样。',
        },
        {
          kind: 'single',
          q: '在 A = ⟨2, 4, 6, 7, 1, 2, 3, 5⟩ 上执行 MERGE(A, 1, 4, 8)，第 13 行的比较一共发生几次？',
          options: ['4 次', '5 次', '6 次', '7 次'],
          answer: 2,
          why:
            'L = ⟨2, 4, 6, 7⟩，R = ⟨1, 2, 3, 5⟩，逐次比较是：' +
            '① L[0]=2 与 R[0]=1 → 取 R（j 变 1）；' +
            '② L[0]=2 与 R[1]=2 → 取 L（i 变 1）；' +
            '③ L[1]=4 与 R[1]=2 → 取 R（j 变 2）；' +
            '④ L[1]=4 与 R[2]=3 → 取 R（j 变 3）；' +
            '⑤ L[1]=4 与 R[3]=5 → 取 L（i 变 2）；' +
            '⑥ L[2]=6 与 R[3]=5 → 取 R（j 变 4 = n_R）。' +
            '第 ⑥ 次之后 j = n_R，主循环条件 `j < n_R` 不再成立，循环退出。' +
            '所以恰好 **6 次**比较，L 里剩下的 6、7 由第 20–23 行直接抄回（不再比较）。' +
            '★ 这类题最容易凭感觉少算或多算一次，建议回阶段 4 第（1）块面板单步走完，' +
            '计数器给出的数字就是 **6**。上界 $n-1 = 7$ 只是一个界，不是本例的实际值。',
        },
        {
          kind: 'simulate',
          q: '在 A = ⟨2, 4, 6, 7, 1, 2, 3, 5⟩ 上执行 MERGE(A, 1, 4, 8)，最终 A 是什么？（用空格分隔）',
          expect: [1, 2, 2, 3, 4, 5, 6, 7],
          placeholder: '例如：1 2 2 3 4 5 6 7',
          why:
            '两段合并的结果就是全体有序。注意这里**有重复值**（两个 2）：' +
            '第 13 行用 $\\le$ 使得相等时先取左段，所以结果里第一个 2 来自 L、第二个 2 来自 R，' +
            '与原来的相对次序一致 —— 这就是“稳定”的含义。' +
            '可以用阶段 4 第（1）块面板的第 1 组数据验证。',
        },
        {
          kind: 'simulate',
          q: '在 A = ⟨12, 3, 7, 9, 14, 6, 11, 2⟩ 上跑完整趟 MERGE-SORT(A, 1, 8)，结果是什么？（用空格分隔）',
          expect: [2, 3, 6, 7, 9, 11, 12, 14],
          placeholder: '例如：2 3 6 7 9 11 12 14',
          why:
            '这就是原书 Figure 2.4 的最后一行。若你算的是别的结果，' +
            '回阶段 4 第（2）块面板一帧帧检查 —— 常见错误是把 $q = \\lfloor (p+r)/2 \\rfloor$ ' +
            '算成了上取整，导致两段长度分配反了（那样结果仍会有序，' +
            '但调用顺序与书上 Figure 2.4 的编号就对不上了）。',
        },
        {
          kind: 'single',
          q: '当 $n$ 是 8 的整数倍时，说 $\\Theta(n \\lg n)$ 比 $\\Theta(n^2)$ “好”，最准确的依据是？',
          options: [
            '在 $n$ 较小时 $n \\lg n < n^2$ 总成立',
            '$n$ 足够大时 $n \\lg n$ 的增长被 $n^2$ 在渐进意义上压倒',
            '归并排序的常数因子更小',
            '归并排序是原地排序，所以更快',
          ],
          answer: 1,
          why:
            '渐进记号只描述**增长量级**，只有在 $n$ 足够大时才保证成立 —— ' +
            '这正是书上那句“For large enough inputs”的分量所在。' +
            '另外两项的错处：常数因子恰恰是插入排序常常**更小**（第 2 章习题 2-1 就是利用这一点）；' +
            '而归并排序**不是**原地排序 —— MERGE 需要 $\\Theta(n)$ 的额外空间做 L、R。',
        },
      ],
      bookExercises: [
        {
          id: '2.3-1',
          page: 44,
          star: 1,
          statement:
            'Using Figure 2.4 as a model, illustrate the operation of merge sort on an array ' +
            'initially containing the sequence ⟨3, 41, 52, 26, 38, 57, 9, 49⟩.',
          hint:
            '照 Figure 2.4 的样子自己画：先算 $q = \\lfloor (1+8)/2 \\rfloor = 4$，' +
            '分成 ⟨3,41,52,26⟩ 与 ⟨38,57,9,49⟩，再各自二分，直到单元素，然后从下往上合并。' +
            '画完可以用阶段 4 第（2）块面板的思路自查：每一层的分组是否都是“相邻两两合并”。' +
            '注意这组数据里没有重复值，但 26 < 38 < 41，合并时容易顺手写错顺序。',
        },
        {
          id: '2.3-2',
          page: 44,
          star: 2,
          statement:
            'The test in line 1 of the MERGE-SORT procedure reads "if p ≥ r " rather than <if p ≠ r .= If MERGE-SORT is called with p>r , then the subarray A[p : r] is empty. Argue that as long as the initial call of MERGE-SORT(A,1,n) has n ≥ 1, the test "if p ≠ r " suffices to ensure that no recursive call has p>r .',
          hint:
            '思路是**归纳**。先看初始调用：$p = 1 \\le n = r$，所以一开始不会有 $p > r$。' +
            '再看递归步：若当前 $p \\le r$，则 $q = \\lfloor (p+r)/2 \\rfloor$ 满足 $p \\le q \\le r$，' +
            '于是两个子调用分别是 $(p, q)$ 和 $(q+1, r)$ —— 证明它们都满足“左端 ≤ 右端”。' +
            '关键是要论证 $q \\ge p$ 且 $q + 1 \\le r$（当 $p < r$ 时）。' +
            '想清楚为什么 $r = p + 1$ 这种最紧的情形恰好是边界。',
        },
        {
          id: '2.3-3',
          page: 44,
          star: 4,
          statement:
            'State a loop invariant for the while loop of lines 12–18 of the MERGE procedure. ' +
            'Show how to use it, along with the while loops of lines 20–23 and 24–27, to prove ' +
            'that the MERGE procedure is correct.',
          hint:
            '★ 这就是阶段 7 那道题。**请先自己写**，写完再回去对照。' +
            '写不变量时抓住两件事：' +
            '① $A[p : k-1]$ 里装的是哪些元素（提示：L 与 R 中最小的那 $k-p$ 个）；' +
            '② 它们是有序的。' +
            '然后别忘了补一句关于 $L[i]$、$R[j]$ 的说明 —— 不然“保持”那一步没法证。' +
            '最后处理终止时，要分别讨论“$i$ 先到 $n_L$”和“$j$ 先到 $n_R$”两种情形，' +
            '并说明为什么剩下那段可以直接抄而不用比较。',
        },
        {
          id: '2.3-4',
          page: 44,
          star: 3,
          statement:
            'Use mathematical induction to show that when n ≥ 2 is an exact power of 2, the solution of the recurrence T(n) = ( 2 if n = 2; 2T(n/2) + n if n>2 is T(n) = n lg n.',
          hint:
            '归纳假设：对所有 $2 \\le m < n$（$m$ 是 2 的幂）都有 $T(m) = m\\lg m$。' +
            '归纳步：$T(n) = 2T(n/2) + n = 2 \\cdot \\frac{n}{2}\\lg\\frac{n}{2} + n$，' +
            '然后把 $\\lg(n/2) = \\lg n - \\lg 2 = \\lg n - 1$ 代进去化简。' +
            'base case 是 $n = 2$：直接代公式得 $2\\lg 2 = 2$，与题给值一致。' +
            '注意为什么要求 $n$ 是 2 的整数次幂 —— 这样 $n/2$ 也落在归纳假设的适用范围里。',
        },
        {
          id: '2.3-5',
          page: 44,
          star: 3,
          statement:
            'You can also think of insertion sort as a recursive algorithm. In order to sort ' +
            'A[1 : n], recursively sort the subarray A[1 : n − 1] and then insert A[n] into the ' +
            'sorted subarray A[1 : n − 1]. Write pseudocode for this recursive version of ' +
            'insertion sort. Give a recurrence for its worst-case running time.',
          hint:
            '伪代码几乎就是把 2.1 的 INSERTION-SORT 反过来写：base case 是 $n \\le 1$（直接返回），' +
            '否则先递归排序 $A[1 : n-1]$，再把 $A[n]$ 插到 $A[1 : n-1]$ 里的正确位置。' +
            '递归式要问三个问题：几份子问题？各多大？插入要多久（提示：最坏情况 $\\Theta(n)$）。' +
            '★ 写完递归式后请自己判断：这个递归式的解是 $\\Theta(n \\lg n)$ 还是 $\\Theta(n^2)$？' +
            '为什么“改成递归写法”**并没有**让插入排序变快？想清楚这一点的收获比写出代码更大。',
        },
        {
          id: '2.3-7',
          page: 45,
          star: 4,
          statement:
            'The while loop of lines 5–7 of the INSERTION-SORT procedure in Section 2.1 uses a ' +
            'linear search to scan (backward) through the sorted subarray A[1 : j − 1]. What if ' +
            'insertion sort used a binary search (see Exercise 2.3-6) instead of a linear search? ' +
            'Would that improve the overall worst-case running time of insertion sort to ' +
            'Θ(n lg n)?',
          hint:
            '答案是否定的，理由很值得体会。二分查找只把**查找位置**的代价从 $\\Theta(j)$ 降到 $\\Theta(\\lg j)$，' +
            '但插入排序的真正开销在**搬移元素** —— 找到位置之后，仍然要把那一整段往后挪一格，' +
            '这一步还是 $\\Theta(j)$。所以总的最坏情况仍然是 $\\Theta(n^2)$。' +
            '★ 这道题的教训：**优化错的地方不会有收益**。' +
            '要拿这道题的收益，得换成不需要搬数据的数据结构（第 6 章讲堆、第 13 章讲红黑树）。',
        },
        {
          id: '2-1',
          page: 45,
          star: 4,
          statement:
            'Insertion sort on small arrays in merge sort Although merge sort runs in Θ(n lg n) worst-case time and insertion sort runs in Θ(n 2 ) worst-case time, the constant factors in insertion sort can make it faster in practice for small problem sizes on many machine s. Thus it makes sense to coarsen the leaves of the recursion by using insertion sort within merge sort when subproblems become sufficiently small. Consider a modification to merge sort in which n/k sublists of length k are sorted using insertion sort and then merged using the standard merging mechanism, where k is a value to be determined. a. Show that insertion sort can sort the n/k sublists, each of length k, in Θ(nk) worst-case time. b. Show how to merge the sublists in Θ(n lg(n/k)) worst-case time. c. Given that the modified algorithm runs in Θ(nk + n lg(n/k)) worst-case time, what is the largest value of k as a function of n for which the modified algorithm has the same running time as standard merge sort, in terms of Θ-notation? d. How should you choose k in practice?',
          hint:
            '这是一道“渐进阶 vs 常数因子”的实战题，也是真实工程里最常见的混合策略。' +
            '(a) 每个长度为 $k$ 的子表用插入排序是 $\\Theta(k^2)$，共 $n/k$ 个，相乘即得。' +
            '(b) 把 $n/k$ 段有序子表用标准归并合成一段 —— 层数是 $\\lg(n/k)$，每层 $\\Theta(n)$。' +
            '(c) 令 $\\Theta(nk + n\\lg(n/k))$ 与标准归并的 $\\Theta(n\\lg n)$ 相等，解出 $k$ 的量级。' +
            '(d) 这一问没有唯一答案：它取决于真实的常数因子与机器，' +
            '**这正是为什么渐进分析不能替你做完所有工程决定**。',
        },
        {
          id: '2-2',
          page: 46,
          star: 4,
          statement:
            'Correctness of bubblesort Bubblesort is a popular, but inefficient, sorting algorithm. It works by repeatedly swapping adjacent elements that are out of order. T he procedure BUBBLESORT sorts array A[1 : n]. BUBBLESORT (A,n) 1 for i = 1 to n − 1 2 for j = n downto i + 1 3 if A[j]<A[j − 1] 4 exchange A[j] with A[j − 1] a. Let A 0 denote the array A after BUBBLESORT (A,n) is executed. To prove that BUBBLESORT is correct, you need to prove that it terminates and that A 0 [1] ≤ A 0 [2] ≤ • • • ≤ A 0 [n]: (2.5) In order to show that BUBBLESORT actually sorts, what else do you need to prove? The next two parts prove inequality (2.5). b. State precisely a loop invariant for the for loop in lines 2–4, and prove that this loop invariant holds. Your proof should use the structure of the loop-invariant proof presented in this chapter. c. Using the termination condition of the loop invariant proved in part (b), state a loop invariant for the for loop in lines 1–4 that allows you to prove inequal- ity (2.5). Your proof should use the structure of the loop-invariant proof pre- sented in this chapter. d. What is the worst-case running time of BUBBLESORT ? …',
          hint:
            '一道把“循环不变量”练到底的好题 —— 注意要证**两层**循环各自的不变量。' +
            '(a) 不等式 (2.5) 只说了“有序”，但排序的定义还要求“同一批元素”（permutation）。' +
            '★ 别漏了这一条，它正是 2.1 里那个不变量的前半句。' +
            '(b) 内层循环（第 2–4 行）的不变量可以写成：' +
            '“进入第 $j$ 轮时，$A[j]$ 是 $A[1 : j]$ 中的最小值”。' +
            '(c) 外层循环（第 1–3 行）的不变量接着用：' +
            '“进入第 $i$ 轮时，$A[1 : i-1]$ 已含全局最小的 $i-1$ 个元素且有序”。' +
            '(d) 两层都是 $\\Theta(n)$ 量级，所以总计 $\\Theta(n^2)$ —— 与插入排序同阶。',
        },
      ],
    },
  ],
};
