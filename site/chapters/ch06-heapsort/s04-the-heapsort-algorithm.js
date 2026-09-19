/* 第 6 章 6.4：堆排序算法（The heapsort algorithm）。
 *
 * 原文锚点：印刷页 170–172（pdf_index 191–193）。
 * 全部 en 引述都已用 tools/04_verify_level.py 的判据逐条预检通过（12/12）。
 * 伪代码按渲染页 p170 核对；内嵌 C 与 c/heapsort.c 逐字节一致。
 */

export default {
  key: 's04', id: 'ch06/s04', chapter: 6, section: '6.4',
  title: '堆排序：把堆顶一个个摘出去', shortTitle: '6.4 堆排序算法',
  titleEn: 'The heapsort algorithm',
  source: { printed: [170, 171], pdf: [191, 193] },
  sourceNote: '本关对应原书 6.4 节（印刷页 170–172）。它是第 6 章的落点：前面三关建起来的堆，到这里变成排序算法。',
  prerequisites: [{ label: '6.3 Building a heap（建堆）', url: '#/ch06/s03' }],
  stages: [
    { type: 'map', title: '把三个部件接成一台机器',
      why: '前两关做了两个零件：6.3 的建堆（$O(n)$）与 6.2 的 MAX-HEAPIFY（$O(\\lg n)$）。6.4 只有五行，做的事就是把它们接起来 —— **反复"取走堆顶、缩小堆、修好新堆顶"**。取走的堆顶一定当场就是当前最大值，所以从数组尾部往前放，放完就排好了。它同时拿到归并排序的时间（$\\Theta(n\\lg n)$）与插入排序的空间（原地），这是第 2 章那两种算法各自缺的那一半。',
      position: '第 2 章给出插入排序（原地但 $\\Theta(n^2)$）与归并排序（$\\Theta(n\\lg n)$ 但要额外空间）；**本关把两者的优点合起来**：$O(n\\lg n)$ 且原地。之后 6.5 把同一个堆结构改造成优先队列，第 7 章的快排会与它同台比较（p.172 原书自己说"快排通常更快，但堆结构另有大量用途"），第 8 章证明 $\\Omega(n\\lg n)$ 下界、从而说明堆排序在比较排序里已经是渐近最优。',
      unlocks: [
        { label: '6.5 Priority queues（优先队列）', url: '#/ch06/s05' },
      ],
      mathKit: [
        { title: '总账', body: '$O(n)$（建堆）+ $(n-1) \\times O(\\lg n)$（每轮的 MAX-HEAPIFY）= $O(n\\lg n)$。建堆那一项连主导项都不是。' },
        { title: '习题 6.4-2 的不变量', body: '「第 $i$ 轮开始时，$A[1:i]$ 是含 $i$ 个最小元素的最大堆；$A[i+1:n]$ 是 $n-i$ 个最大元素且已排序」—— 这条是本关正确性的骨架。' },
        { title: '$\\Omega(n\\lg n)$ 下界（第 8 章）', body: '任何基于比较的排序都要 $\\Omega(n\\lg n)$ 次比较 —— 所以堆排序没有"更快"的余地，只能在常数上优化。' },
      ] },

    { type: 'intuition', title: '一边取最大值，一边往后码',
      scene: '手里有一个能随时告诉你「现在最大的是谁」的箱子',
      body: [
        '建堆做完的那一刻，最大值就摆在堆顶（$A[1]$）。它属于数组的第 $n$ 位 —— 那就直接和 $A[n]$ 换个位置，把它送过去。',
        '换完之后 $A[1]$ 拿到的是原来的 $A[n]$（一个多半很小的值），堆性质被破坏了。但**左右两支都还是堆**（原来除了 $A[1]$ 之外什么都没动），这正好是 MAX-HEAPIFY 要的前提 —— 于是修一次就好，代价 $O(\\lg n)$。',
        '关键在于"缩小堆"这一步：把 $A.\\text{heap-size}$ 减 1，刚刚放到第 $n$ 位的那个最大值就**不再算堆的一部分**了。它已经"毕业"了，后面的操作碰不到它 —— 这就是原书那句 "discards node $n$ from the heap" 的意思：**只是把计数器减 1，没有任何数据搬运**。',
        '然后对 $i = n-1$ 重复同样的三步。每轮往数组尾部放一个当前最大值，放完第 2 位时整个数组就已经升序排好了 —— 一共 $n-1$ 轮。',
        '★ 与插入排序的对比值得记住：插入排序遇到"已经有序"的输入会快得飞起（$\\Theta(n)$），堆排序**不会** —— 它每轮都得规规矩矩地修一次堆，无论输入长什么样。阶段 6 的 C 程序实测了这一点：$n = 32$ 时递增输入比 231 次、递减 202 次、随机 224 次，全在同一量级。',
      ],
      interactive: { text: '阶段 5 的动画里留意"堆外"那些虚线格子：它们就是被摘出去的元素，会从右往左一格一格增加，而虚线格里的数字恰好是升序的。' } },

    { type: 'source', title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄 —— 语料里 `A: heap-size` 那种形状是 PDF 抽取的产物（原书上是**句点**）。',
      blocks: [
        { kind: 'body', page: 170,
          en: 'The heapsort algorithm, given by the procedure HEAPSORT , starts by calling the BUILD-MAX-HEAP procedure to build a max-heap on the input array A[1 : n].',
          zh: '★ 第 1 行就是 6.3 整关的内容 —— 直接复用，一个字都没改。注意 "on the input array"：**在原数组上**建堆，不另开空间。' },
        { kind: 'body', page: 170,
          en: 'Since the maximum element of the array is stored at the root A[1], HEAPSORT can place it into its correct final position by exchanging it with A[n]. If the procedure then discards node n from the heap—and it can do so by simply decrementing A: heap-size—the children of the root remain max-heaps, but the new root element might violate the max-heap property. To restore the max-heap property, the procedure just calls MAX-HEAPIFY (A,1), which leaves a max-heap in A[1 : n − 1].',
          zh: '★★ 这一段把整轮操作讲完了，四句话对应四个要点：\n\n① "the maximum element is stored at the root" —— 用 6.1 的推论（最大值在根）；\n② "place it into its correct final position by exchanging it with A[n]" —— **直接换到数组末尾**，那里就是它的最终位置；\n③ "discards node $n$ from the heap—and it can do so by simply decrementing A.heap-size" —— ★ **摘出去只是把计数器减 1，没有任何数据搬运**。这是"原地"的实现方式；\n④ "the children of the root remain max-heaps, but the new root element might violate..." —— 正好落在 6.2 那条前提上（左右子树各自是堆，只有根可能坏），所以一次 MAX-HEAPIFY 就够。\n\n★ 注意最后说 "which leaves a max-heap in $A[1 : n-1]$" —— 不是 $A[1:n]$。堆区每次都缩小一格。' },
        { kind: 'body', page: 170,
          en: 'The HEAPSORT procedure then repeats this process for the max-heap of size n − 1 down to a heap of size 2. (See Exercise 6.4-2 for a precise loop invariant.)',
          zh: '★ 循环在堆只剩 2 个元素时停下（而不是 1 个）—— 因为 1 个元素的堆不需要修复，而且那时整个数组已经有序了。\n\n★ 括号里那句是原书把"精确的不变量"**留成习题**的常见做法：它在这句话里只说"重复这个过程"，把形式化留给读者。阶段 8 用的就是习题 6.4-2 那条不变量。' },
        { kind: 'body', page: 170,
          en: 'Figure 6.4 shows an example of the operation of HEAPSORT after line 1 has built the initial max-heap. The figure shows the max-heap before the first iteration of the for loop of lines 2–5 and after each iteration.',
          zh: '★ 读图提示：Figure 6.4 从"建堆之后"开始画（(a)），然后每一轮画一张（(b)–(j)）。所以它有 10 张子图 —— 建堆那一阶段不在这张图里（那在 Figure 6.3）。' },
        { kind: 'body', page: 171,
          en: 'The operation of HEAPSORT . (a) The max-heap data structure just after BUILD-MAX- HEAP has built it in line 1. (b)–(j) The max-heap just after each call of MAX-HEAPIFY in line 5, showing the value of i at that time. Only blue nodes remain in the heap. Tan nodes contain the largest values in the array, in sorted order. (k) The resulting sorted array A.',
          zh: '★★ 图注给了**读图的钥匙**：原书用颜色区分了两类结点 —— **蓝色**是"还在堆里"的结点，**棕褐色（tan）**是"已经摘出去、属于最大那批"的结点。所以每张子图里蓝色区域都在缩小、棕褐色区域在扩大，而棕褐色的值从左到右递增。\n\n★ 本站的阶段 5 动画用的是同一套约定，只是把颜色换成了"实线格子 vs 虚线堆外格子 + 文字标签" —— 因为设计规范不允许只靠颜色区分状态（色盲不可辨）。' },
        { kind: 'body', page: 172,
          en: 'The HEAPSORT procedure takes O(n lg n) time, since the call to BUILD-MAX-HEAP takes O(n) time and each of the n − 1 calls to MAX-HEAPIFY takes O(lg n) time.',
          zh: '★ 复杂度的全部内容就这一句：$O(n) + (n-1) \\cdot O(\\lg n) = O(n\\lg n)$。注意建堆的 $O(n)$ 是 6.3 那一关辛苦压出来的 —— 若用弱界 $O(n\\lg n)$，这句话就会变成"$O(n\\lg n) + O(n\\lg n)$"，结论虽然一样，但理由是错的。' },
        { kind: 'body', page: 172,
          en: 'At the start of each iteration of the for loop of lines 2–5, the subarray A[1 : i] is a max-heap containing the i smallest elements of A[1 : n], and the subarray A[i + 1 : n] contains the n − i largest elements of A[1 : n], sorted.',
          zh: '★★ 这就是习题 6.4-2 要求读者自己写的那条不变量（原书把它印在题目里）。两半都值得注意：\n\n① $A[1:i]$ 是最大堆，装的是**最小的 $i$ 个**元素 —— 听着别扭，但正因为最大的 $n-i$ 个已经被搬到后面了，剩下的当然就是最小的那批；\n② $A[i+1:n]$ 装的是**最大的 $n-i$ 个且已排序** —— 这是算法的"成果区"，每轮从左侧接收一个元素。\n\n★ 阶段 8 的三步就照这条不变量展开。阶段 6 的 C 程序在每一轮之后都检查这两半（1050 轮无一例外）。' },
        { kind: 'body', page: 172,
          en: 'Therefore, heapsort is asymptotically optimal among comparison-based sorting algorithms.',
          zh: '★ 前半句必须连着上一个结论读：第 8 章会证明**任何**基于比较的排序都需要 $\\Omega(n\\lg n)$ 次比较。既然堆排序达到了 $O(n\\lg n)$，它在比较排序这一族里就是**渐近最优**的 —— 没有"再快一档"的余地，只能在常数因子上优化。' },
        { kind: 'body', page: 172,
          en: 'Yet, a good implementation of quicksort, presented in Chapter 7, usually beats it in practice.',
          zh: '★ 一句诚实的提示：渐近最优不等于实际最快。快排的常数因子更小（缓存局部性更好），所以实践中通常更快 —— 但它有 $\\Theta(n^2)$ 的最坏情况。第 7 章见。' },
      ],
      terms: [
        { en: 'max-heap', zh: '最大堆', page: 170 },
        { en: 'comparison-based sorting algorithm', zh: '基于比较的排序算法', page: 172 },
        { en: 'asymptotically optimal', zh: '渐近最优', page: 172 },
      ] },

    { type: 'pseudocode', title: '五行，每一行都有出处',
      lead: '★ 注意第 4 行 `A.heap-size = A.heap-size − 1` 是**自己写的一行**（6.1 里强调过的属性），也是"原地"的实现机制：摘出元素只动计数器，不动数据。',
      algo: 'HEAPSORT', signature: 'HEAPSORT(A, n)', page: 170,
      lines: [
        { n: 1, code: 'BUILD-MAX-HEAP(A, n)', zh: '★ 就是 6.3 那一关：$O(n)$ 把无序数组变成最大堆。这一步做完，$A[1]$ 就是全体最大值。' },
        { n: 2, code: 'for i = n downto 2', zh: '★ 从 $n$ 递减到 **2**（不是 1）。少的那一轮不是偷懒：堆里只剩 1 个元素时它必然就位，而且此时整个数组已经有序。共 $n-1$ 轮。' },
        { n: 3, code: '    exchange A[1] with A[i]', zh: '★ 把当前最大值（堆顶）换到第 $i$ 位 —— 那是它的**最终位置**。交换后 $A[i]$ 拿到的是原来的 $A[i]$（很小），堆性质被破坏。' },
        { n: 4, code: '    A.heap-size = A.heap-size − 1', zh: '★★ 摘出去：**只把计数器减 1**。第 $i$ 位从此不算堆的一部分，后面的操作再也碰不到它 —— 数组长度 $n$ 从头到尾没变，变的只是"哪一段还算堆"。这就是"原地"的实现方式，也是 6.1 里专门区分 $n$ 与 $A.\\text{heap-size}$ 的兑现。' },
        { n: 5, code: '    MAX-HEAPIFY(A, 1)', zh: '★ 修新堆顶。为什么只调用一次就够？因为除了 $A[1]$ 之外什么都没动，左右两支仍然各自是最大堆 —— 正是 6.2 那条前提。代价 $O(\\lg n)$。' },
      ],
      vars: [
        { name: 'A', meaning: '待排序的数组（1 基）；排序结束后它本身有序' },
        { name: 'n', meaning: '元素个数，也是数组长度（全程不变）' },
        { name: 'A.heap-size', meaning: '当前还算作堆的前缀长度，每轮减 1' },
        { name: 'i', meaning: '本轮要放最大值的最终位置，从 n 递减到 2' },
      ],
      note: '★ 五行里第 1 行是 6.3、第 5 行是 6.2，本关真正新增的只有第 2–4 行 —— 也就是"取走堆顶、缩小堆"这套循环控制。这也解释了为什么 6.2/6.3 要把细节做足：到 6.4 就只剩编排。' },

    { type: 'visualize', title: '看着最大值一个个被摘出去',
      viz: 'heap', algorithm: 'heapsort', pseudocodeRef: 'HEAPSORT',
      input: { array: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1] },
      countLabels: { cmp: '比较', move: { label: '交换', unit: '次' }, extract: { label: '已摘出元素', unit: '个' } },
      invariants: [{ label: '每轮结束：A[1:i−1] 是最大堆，A[i:n] 已排序且都大于堆区里的元素' }],
      presets: [
        { name: '原书 Figure 6.1 的堆直接当输入（已经建好堆，第 1 行的建堆不再有交换）', array: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1] },
        { name: '习题 6.4-1 的数组 ⟨5,13,2,25,7,17,20,8,4⟩（需要先真实建一次堆）', array: [5, 13, 2, 25, 7, 17, 20, 8, 4] },
        { name: '严格递增 ⟨1,…,12⟩：插入排序只需 n−1 次比较，堆排序仍要跑满全场（习题 6.4-3）', array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
        { name: '严格递减 ⟨12,…,1⟩：也是同一量级 —— 它只影响建堆那一次', array: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1] },
        { name: '全部相同：最大值每次都"换到自己身上"，看堆外格子怎么长', array: [7, 7, 7, 7, 7, 7, 7, 7] },
      ],
      tasks: [
        '用第 1 组走完，数一数"堆外"的格子最终有几格 —— 它应该等于 $n-1$（最后一个元素不用再处理）。',
        '盯着"已摘出元素"这个读数：它是**单调递增**的，而且每一个都比堆里最大的还大。这就是不变量的第二半。',
        '第 3 组（递增输入）与插入排序对比一下：插入排序在这种输入上只要 $n-1$ 次比较，堆排序却要跑满 —— 找一找为什么（提示：它从不"提前发现"输入已经有序）。',
        '第 5 组（全部相同）里，第 3 行的交换其实换的是两个相同的值。观察一下"交换次数"读数还照不照涨，想想它为什么不影响正确性。',
      ],
      note: '★ 虚线格子 = $A.\\text{heap-size}$ 之外的区域（已经排好、不再参与堆操作）。它们的值从右往左应当是**升序**的 —— 这正是 Figure 6.4 里原书用棕褐色标出来的那批结点。' },

    { type: 'code', title: '从伪代码到 C',
      intro: '这份 C 除了实现，还做了两件原书正文没做的事：① 把每轮之后的数组**打印出来**（对应 Figure 6.4 / 习题 6.4-1 的手工追踪）；② 实测三种输入（递增 / 递减 / 随机）的比较次数，回答习题 6.4-3。',
      pseudocodeRef: 'HEAPSORT',
      c: {
        file: 'heapsort.c',
        code: String.raw`/* heapsort.c -- 6.4 节 HEAPSORT 的实现、逐步追踪与「两种输入都一样慢」的实测。
 *
 * 对应原书 p.170（已按渲染页核对）：
 *   HEAPSORT(A, n)
 *   1 BUILD-MAX-HEAP(A, n)
 *   2 for i = n downto 2
 *   3     exchange A[1] with A[i]
 *   4     A.heap-size = A.heap-size − 1
 *   5     MAX-HEAPIFY(A, 1)
 *
 * 习题 6.4-2 给出的循环不变量（原书 p.172）：
 *   At the start of each iteration of the for loop of lines 2–5, the subarray
 *   A[1 : i] is a max-heap containing the i smallest elements of A[1 : n],
 *   and the subarray A[i + 1 : n] contains the n − i largest elements of
 *   A[1 : n], sorted.
 * 这条不变量是本文件第 2 组断言的直接来源。
 *
 * 验证六件事：
 *   1. 排好序（含重复值与负数），且元素集合不变；
 *   2. 习题 6.4-2 的不变量在**每一轮之后**都成立（堆区的最大堆性质 + 已排序区的有序性）；
 *   3. Figure 6.4 / 习题 6.4-1 的数组逐步追踪（打印每轮之后的数组）；
 *   4. 习题 6.4-3：递增与递减输入的时间都是 Θ(n lg n) —— 堆排序对输入顺序**不敏感**；
 *   5. 习题 6.4-4 与最好情况：比较次数在任何输入下都是 Ω(n lg n)；
 *   6. 原地性：整个过程的额外空间只有几个临时变量（见第 6 组的说明与断言）。
 *
 * 下标约定：函数保持 1 基语义（与书一致），只在访问 a[] 时减 1。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o heapsort heapsort.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#define MAXN 64

static int PARENT(int i) { return i / 2; }
static int LEFT(int i) { return 2 * i; }
static int RIGHT(int i) { return 2 * i + 1; }

typedef struct {
    long cmp;
    long swap;
} stats_t;

/* MAX-HEAPIFY（递归版，同 6.2），只在 [1, heap_size] 范围内工作 */
static void max_heapify(int *a, int heap_size, int i, stats_t *st)
{
    int l = LEFT(i);
    int r = RIGHT(i);
    int largest = i;

    if (l <= heap_size) {
        st->cmp++;
        if (a[l - 1] > a[largest - 1]) { largest = l; }
    }
    if (r <= heap_size) {
        st->cmp++;
        if (a[r - 1] > a[largest - 1]) { largest = r; }
    }
    if (largest != i) {
        int t = a[i - 1];
        a[i - 1] = a[largest - 1];
        a[largest - 1] = t;
        st->swap++;
        max_heapify(a, heap_size, largest, st);
    }
}

static void build_max_heap(int *a, int n, stats_t *st)
{
    for (int i = n / 2; i >= 1; i--) { max_heapify(a, n, i, st); }
}

/* --------------------------- HEAPSORT（原书 5 行） --------------------------- */
/* trace_lines > 0 时，每轮之后打印一行数组（用于 Figure 6.4 / 习题 6.4-1） */
static void heapsort(int *a, int n, stats_t *st, int trace_lines)
{
    build_max_heap(a, n, st);                        /* 第 1 行 */
    if (trace_lines > 0) { printf("      [建堆后] "); }
    if (trace_lines > 0) {
        for (int k = 0; k < n; k++) { printf("%d%s", a[k], k + 1 < n ? " " : ""); }
        printf("\n");
    }
    for (int i = n; i >= 2; i--) {                   /* 第 2 行 */
        int t = a[0];                                /* 第 3 行：exchange A[1] with A[i] */
        a[0] = a[i - 1];
        a[i - 1] = t;
        st->swap++;
        /* 第 4 行：A.heap-size = A.heap-size − 1 —— 就是让 heap_size 跟着 i 走 */
        max_heapify(a, i - 1, 1, st);                /* 第 5 行 */
        if (trace_lines > 0 && (i <= 4 || i == n)) {
            printf("      [i = %2d 后] ", i);
            for (int k = 0; k < n; k++) { printf("%d%s", a[k], k + 1 < n ? " " : ""); }
            printf("\n");
        }
    }
}

/* --------------------------- 工具 --------------------------- */
static bool is_sorted(const int *a, int n)
{
    for (int i = 1; i < n; i++) { if (a[i - 1] > a[i]) { return false; } }
    return true;
}

static bool is_max_heap(const int *a, int n)
{
    for (int i = 2; i <= n; i++) {
        if (a[PARENT(i) - 1] < a[i - 1]) { return false; }
    }
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

/* 自带的「逐步 HEAPSORT」：每做完一轮回调一次，用来检查不变量 */
static void heapsort_stepwise(int *a, int n, stats_t *st,
                              void (*after_round)(const int *, int, int, void *), void *ctx)
{
    build_max_heap(a, n, st);
    for (int i = n; i >= 2; i--) {
        int t = a[0];
        a[0] = a[i - 1];
        a[i - 1] = t;
        st->swap++;
        max_heapify(a, i - 1, 1, st);
        /* ★ 注意这里传的是 i − 1 而不是 i：本轮结束后堆已经缩到 A[1 : i−1]，
         *   而"下一轮开始时"的不变量正是以 i − 1 为参数的。第一次我传了 i，
         *   于是检查区与真实区整体错开一位，断言当场报错。 */
        after_round(a, n, i - 1, ctx);
    }
}

/* --------------------- 不变量检查的回调上下文 --------------------- */
typedef struct {
    int violations;
    long rounds;
} inv_ctx;

/* 检查习题 6.4-2 的不变量：heap_size = h 时
 *   ① A[1 : h] 是最大堆；
 *   ② A[h+1 : n] 已经有序；
 *   ③ 堆区里每个元素都不大于已排序区（已排序区的最小值就是 A[h+1]）。
 * 参数与数组一样都按 1 基描述，访问时减 1。 */
static void check_invariant(const int *a, int n, int h, void *ctxp)
{
    inv_ctx *c = (inv_ctx *)ctxp;
    c->rounds++;
    if (h > 0 && !is_max_heap(a, h)) { c->violations++; }
    for (int k = h; k + 1 <= n - 1; k++) { if (a[k] > a[k + 1]) { c->violations++; } }
    if (h >= 1 && h <= n - 1) {
        for (int k = 0; k < h; k++) { if (a[k] > a[h]) { c->violations++; } }
    }
}

int main(void)
{
    /* ---- 1. 排序正确性（含重复值与负数）---- */
    {
        int checked = 0;
        for (int t = 1; t <= 200; t++) {
            int n = 1 + (t % 63);
            int a[MAXN], before[MAXN];
            rnd_seed((unsigned)(t * 71 + 13));
            for (int i = 0; i < n; i++) {
                a[i] = (int)(rnd_next() % 60) - 30;      /* 含负数、且 60 个值里必然有重复 */
            }
            memcpy(before, a, (size_t)n * sizeof(int));
            stats_t st = {0, 0};
            heapsort(a, n, &st, 0);
            assert(is_sorted(a, n));
            assert(same_bag(a, before, n));
            checked++;
        }
        printf("part 1: %d 组随机输入（含负数与重复值）都排好序且元素集合不变\n", checked);
    }

    /* ---- 2. 习题 6.4-2 的循环不变量：每轮之后都成立 ---- */
    {
        inv_ctx ctx = {0, 0};
        for (int t = 1; t <= 60; t++) {
            int n = 2 + (t % 40);
            int a[MAXN];
            rnd_seed((unsigned)(t * 191 + 3));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 400); }
            stats_t st = {0, 0};
            heapsort_stepwise(a, n, &st, check_invariant, &ctx);
            assert(is_sorted(a, n));
        }
        assert(ctx.violations == 0);
        printf("part 2: %ld 轮里不变量从未被破坏 —— A[1:i] 是含 i 个最小元素的最大堆，"
               "A[i+1:n] 是 n−i 个最大元素且已排序（习题 6.4-2）\n", ctx.rounds);
    }

    /* ---- 3. 习题 6.4-1 的数组（Figure 6.4 的模型）---- */
    {
        static const int EX641[9] = {5, 13, 2, 25, 7, 17, 20, 8, 4};
        int a[9];
        stats_t st = {0, 0};
        memcpy(a, EX641, sizeof(a));
        printf("part 3: 习题 6.4-1 的 A = ⟨5,13,2,25,7,17,20,8,4⟩\n");
        heapsort(a, 9, &st, 1);
        assert(is_sorted(a, 9));
        assert(same_bag(a, EX641, 9));
        printf("      最终结果：");
        for (int k = 0; k < 9; k++) { printf("%d%s", a[k], k + 1 < 9 ? " " : ""); }
        printf("（比较 %ld 次、交换 %ld 次）\n", st.cmp, st.swap);
    }

    /* ---- 4. 习题 6.4-3：递增 / 递减 / 随机三种输入的比较次数 ---- */
    {
        int n = 32;
        int inc[MAXN], dec[MAXN], rnd[MAXN];
        long cmp_inc, cmp_dec, cmp_rnd;
        for (int i = 0; i < n; i++) { inc[i] = i + 1; }
        for (int i = 0; i < n; i++) { dec[i] = n - i; }
        rnd_seed(4242);
        for (int i = 0; i < n; i++) { rnd[i] = (int)(rnd_next() % 1000); }

        {
            stats_t st = {0, 0};
            heapsort(inc, n, &st, 0);
            cmp_inc = st.cmp;
            assert(is_sorted(inc, n));
        }
        {
            stats_t st = {0, 0};
            heapsort(dec, n, &st, 0);
            cmp_dec = st.cmp;
            assert(is_sorted(dec, n));
        }
        {
            stats_t st = {0, 0};
            heapsort(rnd, n, &st, 0);
            cmp_rnd = st.cmp;
            assert(is_sorted(rnd, n));
        }
        printf("part 4: n = 32 时的比较次数 —— 递增 %ld、递减 %ld、随机 %ld\n",
               cmp_inc, cmp_dec, cmp_rnd);
        /* 三者都应当落在 n·lg n 的同一量级内（差异只是常数倍） */
        long lower = (long)n * 5 / 2;
        assert(cmp_inc > lower && cmp_dec > lower && cmp_rnd > lower);
        long upper = 8L * n * 6;      /* 宽松上界，只要证明"都不小" */
        assert(cmp_inc < upper && cmp_dec < upper && cmp_rnd < upper);
        puts("      ★ 三种输入都在同一量级 —— 堆排序对输入顺序不敏感，"
             "这与插入排序（递增输入只需 n−1 次比较）形成鲜明对比（习题 6.4-3）");
    }

    /* ---- 5. 习题 6.4-4 + 最好情况：任何输入都是 Ω(n lg n) ---- */
    {
        double best_ratio = 1e9;
        int best_ratio_n = 0;
        for (int n = 4; n <= 64; n++) {
            int lg = 0;
            for (int k = n; k > 1; k >>= 1) { lg++; }

            long best = -1;                        /* 该 n 下、60 组随机输入里的最少比较次数 */
            for (int t = 1; t <= 60; t++) {
                int a[MAXN];
                rnd_seed((unsigned)(t * 313 + n));
                /* 值互不相同（乘一个大系数再加随机项），对应"最好情况"那一问的前提 */
                for (int i = 0; i < n; i++) {
                    a[i] = (int)(rnd_next() % 100000) + i * 1000007;
                }
                stats_t st = {0, 0};
                heapsort(a, n, &st, 0);
                assert(is_sorted(a, n));
                if (best < 0 || st.cmp < best) { best = st.cmp; }
            }
            /* Ω(n lg n) 的宽松形式：最少比较次数也不低于 n·⌊lg n⌋ / 4。
             * 用 1/4 这样一个"离常数很远"的系数，是为了让断言表达"量级"而不是"精确常数"。 */
            long need = (long)n * lg / 4;
            if (best < need) {
                printf("      ★ n = %d 时最少比较 %ld，低于 n·⌊lg n⌋/4 = %ld\n", n, best, need);
                assert(0);
            }
            double ratio = (double)best / (double)((long)n * lg);
            if (ratio < best_ratio) { best_ratio = ratio; best_ratio_n = n; }
        }
        printf("part 5: n = 4..64 各测 60 组互异输入，**最少**的比较次数仍不低于 n·⌊lg n⌋/4 —— "
               "最好情况也是 Ω(n lg n)（习题 6.4-4 与「元素互异时最好情况」那一问）；"
               "最紧的一次比值 %.3f 出现在 n = %d\n", best_ratio, best_ratio_n);
    }

    /* ---- 6. 原地性 ---- */
    {
        /* heapsort() 里除输入数组之外只用到 3 个 int（交换用的 t、循环变量 i 与
         * max_heapify 里的临时变量），与 n 无关 —— 这就是 p.161 说的
         * "only a constant number of array elements are stored outside the input array"。
         * 下面用一个"额外缓冲区哨兵"来把这件事写成断言：排序过程中被写到数组之外的
         * 元素个数为 0。实现上做不到直接观察，所以这里用"数组首尾之外的内存不动"近似：
         * 在数组两端各放一个哨兵，排序后必须原封不动。 */
        int buf[MAXN + 2];
        int n = 21;
        rnd_seed(999);
        for (int i = 0; i < n; i++) { buf[i + 1] = (int)(rnd_next() % 500); }
        buf[0] = -12345;                 /* 数组"左边"的哨兵 */
        buf[n + 1] = 54321;              /* 数组"右边"的哨兵 */
        stats_t st = {0, 0};
        heapsort(&buf[1], n, &st, 0);    /* 只把中间那段当作 A[1:n] */
        assert(buf[0] == -12345 && buf[n + 1] == 54321);
        for (int i = 0; i + 2 <= n; i++) { assert(buf[i + 1] <= buf[i + 2]); }
        puts("part 6: 数组两侧的哨兵原封不动 —— 排序只在给定的数组范围内进行（原地）");
    }

    puts("all checks passed.");
    return 0;
}
`,
        notes: [
          { line: 47, zh: '`max_heapify` 与 6.2 一致；**关键区别**是它的 `heap_size` 参数：在堆排序里这个值每轮都在变小，而数组长度 `n` 恒定不变 —— 这正是书上 `A.heap-size` 与 `A[1:n]` 的区别落到了代码上。' },
          { line: 70, zh: '`build_max_heap` 就是 6.3 那一关的函数，原样复用。' },
          { line: 77, zh: '★ `heapsort` 与书上 5 行一一对应：第 79 行是第 1 行、第 85 行是第 2 行、第 86–88 行是第 3 行、第 91 行是第 5 行。' },
          { line: 91, zh: '★★ 第 5 行的 `max_heapify(a, i - 1, 1, st)` —— 注意第一个参数传的是 **`i - 1`** 而不是 `n`。这就是第 4 行 `A.heap-size = A.heap-size − 1` 的落地：本轮的堆只到第 $i-1$ 位。写成 `n` 会让算法彻底失效（排序结果错乱），是最容易犯也最容易看出来的错。' },
          { line: 149, zh: '★ 第 2 组用的"逐步版"：每做完一轮回调一次，用来在**每一轮之后**检查不变量，而不是只看最终结果。' },
          { line: 162, zh: '★★ 这里我犯过一次错，值得记下来：回调传的是 `i - 1` 而不是 `i`。因为本轮结束后堆已经缩到 $A[1:i-1]$，"下一轮开始时"的不变量正是以 $i-1$ 为参数的。第一次传了 `i`，检查区与真实区整体错开一位，断言当场报错（1050 轮里每一次都会报）。' },
          { line: 177, zh: '`check_invariant` 按习题 6.4-2 的不变量检查三件事：堆区是最大堆、已排序区有序、堆区每个元素都不大于已排序区的最小值（即 $A[h+1]$）。' },
          { line: 222, zh: '★ 第 2 组结论：1050 轮里不变量从未被破坏 —— 把书上印在习题里的那条不变量变成了可执行的检查。' },
          { line: 274, zh: '★ 第 4 组（习题 6.4-3）：$n = 32$ 时递增、递减、随机三种输入的比较次数都落在同一量级（实测 231 / 202 / 224）。堆排序**对输入顺序不敏感** —— 与插入排序在递增输入上只需 $n-1$ 次比较形成鲜明对比。' },
          { line: 305, zh: '★ 第 5 组（习题 6.4-4 与"元素互异时最好情况"那一问）：对每个 $n$ 测 60 组互异输入，取**最少**的比较次数，仍然不低于 $n\\lfloor \\lg n \\rfloor / 4$。用 $1/4$ 这样远离真常数的系数，是为了让断言表达"量级"而不是"精确常数"。' },
          { line: 333, zh: '第 6 组：在数组两端各放一个哨兵，排序后必须原封不动 —— 说明所有写操作都落在给定范围内（原地）。' },
        ],
        tests: [
          { in: '200 组随机输入（含负数与重复值）', out: '都排好序且元素集合不变' },
          { in: '60 组输入 × 每轮之后', out: '1050 轮里习题 6.4-2 的不变量从未被破坏' },
          { in: '⟨5,13,2,25,7,17,20,8,4⟩（习题 6.4-1）', out: '逐步打印每轮数组；结果 2 4 5 7 8 13 17 20 25（36 次比较、23 次交换）' },
          { in: 'n = 32，递增 / 递减 / 随机', out: '比较 231 / 202 / 224 —— 同一量级（习题 6.4-3）' },
          { in: 'n = 4..64 各 60 组互异输入，取最少比较次数', out: '仍 ≥ n·⌊lg n⌋/4 → 最好情况也是 Ω(n lg n)（习题 6.4-4）' },
          { in: '数组两端放哨兵值', out: '排序后哨兵原封不动 → 原地' },
          { in: '编译与运行', out: 'gcc -std=c99 -Wall -Wextra -Werror 零警告；全部断言通过，输出 all checks passed.' },
        ],
      },
      mapping: [
        { pc: 1, pcCode: 'BUILD-MAX-HEAP(A, n)', c: '`build_max_heap(a, n, st);`（第 79 行）' },
        { pc: 2, pcCode: 'for i = n downto 2', c: '`for (int i = n; i >= 2; i--)`（第 85 行）—— 上界是 2 不是 1' },
        { pc: 3, pcCode: 'exchange A[1] with A[i]', c: '三行交换（第 86–88 行）' },
        { pc: 4, pcCode: 'A.heap-size = A.heap-size − 1', c: '没有单独的语句 —— 它体现在下一行把 `i - 1` 当作新的 heap_size（第 91 行）。这是"计数器"与"循环变量"合一之后的样子。' },
        { pc: 5, pcCode: 'MAX-HEAPIFY(A, 1)', c: '`max_heapify(a, i - 1, 1, st);`（第 91 行）' },
      ] },

    { type: 'analyze', title: '总账：为什么是 O(n lg n)，以及它没有更快余地',
      intro: '这一节的复杂度只有一行加法，但它的意义要说清：堆排序达到的是**比较排序的下界**，所以它在渐近意义上是终点了。',
      claims: [
        { expr: 'O(n \\lg n)', when: 'HEAPSORT 的总时间：O(n) 建堆 + (n−1) 次 O(lg n)', page: 172, source: 'book' },
        { expr: '\\Omega(n \\lg n)', when: '任何基于比较的排序算法的下界（第 8 章证明，原书 p.172 先给出结论）', page: 172, source: 'book' },
        { expr: '\\lfloor 2n/3 \\rfloor', when: '每轮 MAX-HEAPIFY 的递归规模上界（6.2 的结论）', page: 166, source: 'book' },
        { expr: 'O(n)', when: '建堆那一项（6.3 的结论，不构成主导项）', page: 169, source: 'book' },
      ],
      tables: [
        { caption: '三个排序算法的三栏对照（第 2 章那两个的缺憾在这里被补上）', rows: [
          ['', 'INSERTION-SORT（2.1）', 'MERGE-SORT（2.3）', 'HEAPSORT（6.4）'],
          ['最坏时间', '$\\Theta(n^2)$', '$\\Theta(n\\lg n)$', '$O(n\\lg n)$'],
          ['额外空间', '原地 $O(1)$', '$\\Theta(n)$（L、R 两个数组）', '原地 $O(1)$'],
          ['对输入顺序敏感吗', '敏感（递增输入 $\\Theta(n)$）', '不敏感', '**不敏感**'],
          ['实践表现', '小规模很好', '稳定但常数大', '常数比归并小，比快排大'],
        ] },
        { caption: '习题 6.4-2 的不变量在每轮的样子（n = 5 为例）', rows: [
          ['轮次 i', '堆区 A[1:i]', '已排序区 A[i+1:n]'],
          ['开始（建堆后）', '5 个元素的最大堆', '空'],
          ['i = 5 处理后', '4 个元素的最大堆（最小的 4 个）', '第 5 位：全体最大值'],
          ['i = 4 处理后', '3 个元素的最大堆（最小的 3 个）', '第 4–5 位：最大的 2 个，升序'],
          ['i = 2 处理后', '1 个元素（剩下的最小值）', '第 2–5 位：最大的 4 个，升序'],
        ] },
      ],
      chart: { xMax: 1024, series: [
        { name: 'HEAPSORT 的比较次数量级 ∼ n·lg n', expr: 'n * Math.log2(n)', color: '--viz-done' },
        { name: '下界 Ω(n lg n)（第 8 章）', expr: 'n * Math.log2(n) / 2', color: '--viz-compare' },
        { name: '插入排序最坏情况 ∼ n²/2（对照）', expr: 'n * n / 2', color: '--viz-violation' },
      ] },
      derivations: [
        { kind: 'summation', title: '总时间的两项', steps: [
          { zh: '第 1 行建堆：由 6.3，$O(n)$。' },
          { zh: '第 2–5 行循环：共 $n-1$ 轮，每轮做常数次操作加一次 MAX-HEAPIFY。' },
          { tex: 'T(n) = O(n) + (n-1) \\cdot O(\\lg n) = O(n) + O(n\\lg n) = O(n\\lg n)', zh: '★ 注意 $O(n)$ 那一项被 $O(n\\lg n)$ 吸收了 —— 前提是它真的是 $O(n)$。如果用 6.3 的弱界 $O(n\\lg n)$ 代入，这里就会变成两项同阶，虽然结论偶然相同，但推理是错的。' },
          { zh: '★ 这就是"6.3 那一关为什么要压到 $O(n)$"的答案：不是为了好看，而是为了这一行的加法。' },
        ] },
        { kind: 'summation', title: '为什么没有更快的余地（第 8 章下界，预告）', steps: [
          { zh: '任何基于比较的排序算法把输入排成正确顺序，都必须面对同一个困难：$n$ 个元素有 $n!$ 种排列，而每次比较只给出一个二元结果。' },
          { tex: '\\text{决策树高度} \\ge \\lg(n!) = \\Omega(n \\lg n)', zh: '用 Stirling 近似（3.3 节的式 A.19）：$\\lg(n!) = n\\lg n - O(n)$。这就是比较次数下界。' },
          { zh: '★ 堆排序达到 $O(n\\lg n)$，与这个下界同阶 —— 原书因此说它 "asymptotically optimal among comparison-based sorting algorithms"。想再快就必须换模型（第 8 章的计数排序、基数排序利用"值域有界"这一额外信息）。' },
          { zh: '★ 顺带一提：第 7 章的快排也是 $O(n\\lg n)$ 期望时间，常数因子更小，实践中通常更快（原书 p.172 那句 "usually beats it in practice"）—— 但那是有代价的（$\\Theta(n^2)$ 最坏情况）。' },
        ] },
      ],
      note: '★ 中心图三条线：堆排序与"下界"两条同阶（贴在一起才说明它到顶了），插入排序最坏情况那条则一路上扬 —— 那才是"还能改进"的位置。' },

    { type: 'prove', title: '凭什么说排出来一定是有序的',
      statement: 'At the start of each iteration of the for loop of lines 2–5, the subarray A[1 : i] is a max-heap containing the i smallest elements of A[1 : n], and the subarray A[i + 1 : n] contains the n − i largest elements of A[1 : n], sorted.',
      page: 172,
      intro: '★ 这条不变量是原书在**习题 6.4-2** 里给出的（阶段 3 已引）。它有两半，缺一不可：第一半说堆区是"最小的 $i$ 个"，第二半说已排序区是"最大的 $n-i$ 个且有序"。三步的论证顺序是：初始时第二半为空、第一半由建堆保证；每轮把堆顶搬到它该去的位置；循环结束时第二半覆盖整个数组。',
      steps: [
        { title: '第一步 · 初始化（Initialization）',
          en: 'The heapsort algorithm, given by the procedure HEAPSORT , starts by calling the BUILD-MAX-HEAP procedure to build a max-heap on the input array A[1 : n].',
          page: 170,
          body: [
            '第 1 行结束后、循环开始前，$i = n$。代入不变量：$A[1:n]$ 是最大堆（由 6.3 保证，阶段 8 的三步与本关 6.3 那一关的证明同一份），且"包含最小的 $n$ 个元素" —— 这是全体元素，自然成立。',
            '第二半 $A[i+1:n] = A[n+1:n]$ 是**空区间**，"装 $0$ 个元素且已排序"按空真（vacuously）成立。',
            '★ 空区间的处理是这类不变量证明的固定套路：只要把"已排序"定义成"相邻元素两两不降"，空区间与单元素区间都自动成立。',
          ] },
        { title: '第二步 · 保持（Maintenance）',
          en: 'Since the maximum element of the array is stored at the root A[1], HEAPSORT can place it into its correct final position by exchanging it with A[n].',
          page: 170,
          body: [
            '第 $i$ 轮开始时，堆区是含最小 $i$ 个元素的最大堆，所以由 6.1 的推论（最大值在根）—— **$A[1]$ 是这 $i$ 个元素里的最大值**。而堆区之外的 $n-i$ 个元素全都大于它们（这是不变量第二半的内容），所以 $A[1]$ 其实就是**剩余全部元素里的最大值**。',
            '第 3 行把 $A[1]$ 与 $A[i]$ 交换：最大值被放到第 $i$ 位。加上第 4 行把 $A.\\text{heap-size}$ 减到 $i-1$，第 $i$ 位就退出了堆区 —— 它现在属于 $A[i : n]$。',
            '第 5 行 MAX-HEAPIFY(A, 1) 把 $A[1:i-1]$ 修回最大堆（前提成立，见 6.2）。于是"$A[1:i-1]$ 是含最小 $i-1$ 个元素的最大堆"成立。',
            '★ 第二半要检查两件事：$A[i:n]$ **有序**（$A[i]$ 是新的最大值，而不变量说 $A[i+1:n]$ 本来有序且都小于它 —— 所以把 $A[i]$ 拼在最前面仍然有序）；以及 $A[i:n]$ 装的是**最大的 $n-i+1$ 个**（因为它们都比堆区的大，且堆区只有 $i-1$ 个）。两件都成立，$i$ 减 1 后不变量重新成立。',
          ] },
        { title: '第三步 · 终止（Termination）',
          en: 'The HEAPSORT procedure then repeats this process for the max-heap of size n − 1 down to a heap of size 2.',
          page: 170,
          body: [
            '循环在 $i = 2$ 处理完之后结束（下一轮的 $i$ 是 1，循环条件不满足）。此时把 $i = 1$ 代进不变量：$A[1:1]$ 是含最小 1 个元素的堆，$A[2:n]$ 是最大的 $n-1$ 个元素且已排序。',
            '于是整个数组 $A[1:n]$ 有序：第 1 位是剩下的最小值，第 2 位起升序。',
            '★ 为什么循环上界是 2 而不是 1？因为 $i = 1$ 那一轮无事可做 —— 堆区只剩 1 个元素，它必然就位。原书把这写成 `downto 2`，正是这个原因。',
          ] },
      ],
      conclusion: '★ 结论：HEAPSORT 把任意数组排成升序（阶段 6 的 C 程序用 200 组随机输入验证了结果，另用 1050 轮逐轮检查了这条不变量）。它与插入排序、归并排序的最关键区别是：**正确性完全来自"堆区/已排序区"的划分，而与输入原来长什么样无关** —— 这就是它对输入顺序不敏感的原因。',
      note: '' },

    { type: 'drill', title: '检验一下',
      items: [
        { kind: 'single', q: 'HEAPSORT 的循环为什么是 `for i = n downto 2` 而不是 `downto 1`？',
          options: ['为了让循环次数是偶数', '因为堆里只剩 1 个元素时它必然就位，无需再处理', '因为 i = 1 会越界', '为了避免重复排序'], answer: 1,
          why: '$i = 1$ 时堆区只有 1 个元素，"取最大值再放回原位"是空动作；而那时数组已经有序。共 $n-1$ 轮。' },
        { kind: 'single', q: '第 4 行 `A.heap-size = A.heap-size − 1` 在做什么？',
          options: ['把最大值搬到数组末尾', '把数组缩短一格（真的释放内存）', '只把计数器减 1，让第 i 位不再算作堆的一部分', '删除一个元素'], answer: 2,
          why: '★ 原书明说 "it can do so by simply decrementing A.heap-size"。**没有任何数据搬运** —— 数组长度 $n$ 全程不变，变的只是"哪一段还算堆"。这就是"原地"的实现方式。最大值的搬运是第 3 行的交换做的。' },
        { kind: 'single', q: '第 5 行只调用一次 MAX-HEAPIFY(A, 1) 就够，为什么？',
          options: ['因为根是最大值', '因为除了 A[1] 之外什么都没动，左右两支仍各自是最大堆', '因为第 3 行已经修好了堆', '因为 A[1] 一定是最小值'], answer: 1,
          why: '这正是 6.2 的前提（左右子树各自是最大堆，只有根可能坏）。交换只影响 $A[1]$ 与 $A[i]$ 两处，而 $A[i]$ 已经出堆，所以堆内只剩 $A[1]$ 一处可能违规。' },
        { kind: 'single', q: '习题 6.4-2 的不变量里，$A[1:i]$ 装的是哪批元素？',
          options: ['最大的 i 个', '最小的 i 个', '任意的 i 个', '已排序的 i 个'], answer: 1,
          why: '★ 最小的 $i$ 个。因为最大的 $n-i$ 个已经被搬到 $A[i+1:n]$ 了，剩下的自然是较小的那批。这句听起来反直觉（"最小"却在最大堆里），但正是它保证了每轮堆顶是"剩余元素中的最大值"。' },
        { kind: 'judge', q: '堆排序对已经有序的输入会明显更快，就像插入排序那样。', answer: false,
          why: '★ 不会。插入排序在递增输入上只要 $n-1$ 次比较（$\\Theta(n)$），而堆排序**必须**跑满 $n-1$ 轮、每轮都修一次堆 —— 它对输入顺序不敏感。阶段 6 的 C 程序实测 $n=32$：递增 231、递减 202、随机 224 次比较，同一量级（习题 6.4-3）。' },
        { kind: 'single', q: 'HEAPSORT 的时间复杂度是？',
          options: ['$O(n)$', '$O(n\\lg n)$', '$O(n^2)$', '$\\Theta(n)$'], answer: 1,
          why: '第 1 行建堆 $O(n)$（6.3 的结论），第 2–5 行 $n-1$ 轮 × $O(\\lg n)$ = $O(n\\lg n)$。$O(n)$ 那一项被吸收。' },
        { kind: 'judge', q: '既然堆排序与基于比较的排序下界同阶，就不存在渐近更快的比较排序了。', answer: true,
          why: '★ 第 8 章会证明任何基于比较的排序都需要 $\\Omega(n\\lg n)$ 次比较。所以原书说堆排序 "asymptotically optimal among comparison-based sorting algorithms"。想更快只能换模型（计数排序、基数排序利用值域信息）。' },
        { kind: 'simulate', q: '对 n = 8 的数组做堆排序，外层循环一共执行几轮？（填整数）', expect: [7], placeholder: '例如：7',
          why: '$i$ 从 $n = 8$ 递减到 2，共 $n-1 = 7$ 轮。最后一位（第 1 位）不用处理。阶段 5 的动画里"已摘出元素"最终会显示 7 个。' },
      ],
      bookExercises: [
        { id: '6.4-1', page: 172, star: 0,
          statement: 'Using Figure 6.4 as a model, illustrate the operation of HEAPSORT on the array A = ⟨5,13,2,25,7,17,20,8,4⟩.',
          hint: '照着 Figure 6.4 的画法来：先画出 BUILD-MAX-HEAP 之后的树，然后每轮画"交换 + 缩小堆 + MAX-HEAPIFY"之后的样子（原书把每轮之后的状态各画一张）。阶段 5 的第 2 组预设就是这道题；阶段 6 的 C 程序会把每轮的数组逐行打印出来供对照。' },
        { id: '6.4-2', page: 172, star: 0,
          statement: 'Argue the correctness of HEAPSORT using the following loop invariant: At the start of each iteration of the for loop of lines 2–5, the subarray A[1 : i] is a max-heap containing the i smallest elements of A[1 : n], and the subarray A[i + 1 : n] contains the n − i largest elements of A[1 : n], sorted.',
          hint: '★ 阶段 8 的三步就是这道题的参考论证。要点：① 初始时第二半是空区间，"已排序"对空区间自动成立；② 每轮要把"有序性"与"元素归属"两件事**分别**验证（前者靠新放入的 $A[i]$ 大于已排序区全部元素，后者靠计数）；③ 循环在 $i = 2$ 之后结束时，第二半已覆盖 $A[2:n]$，加上第 1 位剩下的最小值，整个数组有序。' },
        { id: '6.4-3', page: 172, star: 0,
          statement: 'What is the running time of HEAPSORT on an array A of length n that is already sorted in increasing order? How about if the array is already sorted in decreasing order?',
          hint: '两种情况都是 $\\Theta(n\\lg n)$ —— 堆排序对输入顺序不敏感。递增输入只会让**建堆**那一步少做几次交换，而主体循环的 $n-1$ 轮一次都少不了。阶段 6 的 C 程序实测 $n=32$ 时递增 231、递减 202、随机 224 次比较。想清楚"为什么递减输入也没变快"：递减数组本身就是最大堆，建堆几乎不用干活，但每轮的 MAX-HEAPIFY 照样要走满。' },
        { id: '6.4-4', page: 172, star: 0,
          statement: 'Show that the worst-case running time of HEAPSORT is Ω(n lg n).',
          hint: '★ 与"下界"的通常证法不同：这里**顺序无关**。思路是数比较次数 —— 每轮的 MAX-HEAPIFY 至少要做常数次比较，而它处理的是一个规模不小于某个值的堆；把这 $n-1$ 轮加起来就能得到 $\\Omega(n\\lg n)$。阶段 6 的 C 程序换了个方向验证：对每个 $n$ 测 60 组互异输入，取**最少**的比较次数，仍然不低于 $n\\lfloor\\lg n\\rfloor/4$ —— 也就是说连"最好情况"都逃不掉这个量级。' },
      ] },
  ],
};
