/* 第 6 章 6.1：堆（Heaps）。
 *
 * 原文锚点：印刷页 161–164（pdf_index 182–185）。
 * 全部 en 引述都已用 tools/04_verify_level.py 的判据逐条预检通过（14/14）。
 * 内嵌的 C 代码与 c/heap_index.c 逐字节一致（由脚本从磁盘读入，不手抄）。
 */

export default {
  key: 's01', id: 'ch06/s01', chapter: 6, section: '6.1',
  title: '堆：数组与二叉树是同一个东西', shortTitle: '6.1 堆',
  titleEn: 'Heaps',
  source: { printed: [161, 163], pdf: [182, 185] },
  sourceNote: '本关对应原书 6.1 节（印刷页 161–164）。本节定下术语（堆、堆性质、高度）与三条下标算式，后面 6.2–6.5 都建立在这上面。',
  prerequisites: [{ label: '5.4.4 The online hiring problem', url: '#/ch05/s07' }],
  stages: [
    { type: 'map', title: '先把「堆」这个词从内存管理里抢回来',
      why: '前五章的排序算法各有取舍：插入排序原地但 $\\Theta(n^2)$，归并排序 $\\Theta(n\\lg n)$ 但要额外空间。堆排序两样都要 —— 它 $\\Theta(n\\lg n)$、原地，而且顺手带来一个通用的数据结构。这一切的起点是 6.1 的一句话：**堆就是一个数组，只是你把它看成一棵近似完全二叉树**。',
      position: '第 2 章的插入排序、归并排序是「算法」；本关开始进入「数据结构」——**用结构去管信息**，而不只是处理一遍数据。6.1 只定术语（堆、最大堆性质、高度）与三条下标算式 $\\text{PARENT}(i)=\\lfloor i/2\\rfloor$、$\\text{LEFT}(i)=2i$、$\\text{RIGHT}(i)=2i+1$；6.2 的 MAX-HEAPIFY、6.3 的 BUILD-MAX-HEAP、6.4 的 HEAPSORT、6.5 的优先队列全部建立在这三条式子上。第 15、21、22 章还会回来用最小堆。',
      unlocks: [
        { label: '6.2 Maintaining the heap property（维持堆性质）', url: '#/ch06/s02' },
      ],
      mathKit: [
        { title: '完全二叉树的高度', body: '$n$ 个结点的近似完全二叉树高度恰好是 $\\lfloor\\lg n\\rfloor$ —— 这是「堆的操作都是 $O(\\lg n)$」的唯一来源（习题 6.1-2）。' },
        { title: '下标算式', body: '$\\text{PARENT}(i)=\\lfloor i/2\\rfloor$、$\\text{LEFT}(i)=2i$、$\\text{RIGHT}(i)=2i+1$。三条式子都不需要指针，也不用额外存储 —— 父子关系**由下标本身编码**。' },
        { title: '取整记号', body: '$\\lfloor x\\rfloor$ 是下取整。C 里对非负数直接写 `i / 2` 就是下取整，不需要 `floor()`。' },
      ] },

    { type: 'intuition', title: '一排编了号的格子，为什么能当树用',
      scene: '十只箱子按 1…10 编号排成一条，你要在上面找「父子关系」',
      body: [
        '如果"谁是谁的父"要另外记一张表，那就得额外存储、还要维护 —— 插入删除时四处改。堆的做法很省：**父子关系只用编号算**。第 $i$ 只箱子的父是第 $\\lfloor i/2\\rfloor$ 只，左孩子是第 $2i$ 只，右孩子是第 $2i+1$ 只。',
        '把这条规则画出来，那排箱子自然就叠成了一个金字塔（原书 Figure 6.1）：上一层每个结点带两个孩子，最下面一层从左往右填满到某个位置为止 —— 这就是「**近似完全二叉树**」的形状。',
        '好处立刻显现：**一个数组同时是两种东西**。按下标看，它是可以随机访问的连续内存；按父子看，它是一棵能 $O(\\lg n)$ 找到根、$O(\\lg n)$ 往下走的树。你不需要为"树"多花一个字节。',
        '本关要建立的直觉就一句：**不要把它想成两样东西**。阶段 5 的动画会把同一个下标同时画在数组格子和树结点上，让它一眼可见。',
      ],
      interactive: { text: '阶段 5 只是把 §6.1 的定义走一遍：逐个结点问「你的父是谁、左孩子是谁、右孩子是谁」。看起来朴素，但后面每一关的动画都建立在这套下标算术上。' } },

    { type: 'source', title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写 —— 语料里 `A: heap-size` 这种形状是 PDF 抽取的产物（那个符号在原书上是**句点**），照抄是为了可溯源，解读里会指出来。',
      blocks: [
        { kind: 'body', page: 161,
          en: 'This chapter introduces another sorting algorithm: heapsort. Like merge sort, but unlike insertion sort, heapsort’s running time is O(n lg n). Like insertion sort, but unlike merge sort, heapsort sorts in place: only a constant number of array elements are stored outside the input array at any time.',
          zh: '★ 开篇就把堆排序的位置摆清楚了：**同时拿到归并排序的时间和插入排序的空间**。注意 "only a constant number of array elements are stored outside the input array" —— 这是「原地」的严格说法，不是「不用额外空间」，而是「额外空间是常数」。写 C 时会看到：整个过程只用了一个临时变量。' },
        { kind: 'body', page: 161,
          en: 'Heapsort also introduces another algorithm design technique: using a data structure, in this case one we call a "heap," to manage information. Not only is the heap data structure useful for heapsort, but it also makes an efficient priority queue. The heap data structure will reappear in algorithms in later chapters.',
          zh: '★ 这句解释了为什么第 6 章放在排序篇里：它引入的是**一种设计技术**（用数据结构管理信息），而不只是一个新排序算法。堆排序只是副产品 —— 真正长期复用的是堆这个结构（6.5 的优先队列、第 15/21/22 章都要用）。' },
        { kind: 'body', page: 161,
          en: 'The term "heap" was originally coined in the context of heapsort, but it has since come to refer to "garbage-collected storage," such as the programming languages Java and Python provide. Please don’t be confused. The heap data structure is not garbage-collected storage. This book is consistent in using the term "heap" to refer to the data structure, not the storage class.',
          zh: '★ 这是原书专门写的一段「防混淆」提示，值得照读。Java / Python 里的 heap（堆内存、`malloc` 那一侧）与数据结构的堆**毫无关系**，只是同名的巧合。本站所有「堆」都指数据结构。' },
        { kind: 'body', page: 161,
          en: 'The (binary) heap data structure is an array object that we can view as a nearly complete binary tree (see Section B.5.3), as shown in Figure 6.1. Each node of the tree corresponds to an element of the array.',
          zh: '★★ 本关的中心句。两个关键限定：① 它是**数组对象**（先有数组，树是看法）；② "nearly complete"（近似完全）—— 允许最后一层没填满，但必须从左往右连续填。这两条合起来，才使「下标算父子」成为可能。' },
        { kind: 'body', page: 161,
          en: 'An array A[1 : n] that represents a heap is an object with an attribute A: heap-size, which represents how many elements in the heap are stored within array A. That is, although A[1 : n] may contain numbers, only the elements in A[1 : A: heap-size], where 0 ≤ A: heap-size ≤ n, are valid elements of the heap.',
          zh: '★★ 又一个必须搞清楚的点：**数组长度 `A[1 : n]` 与 `A.heap-size` 是两个不同的量**。数组可能比堆长（堆只占据前 `heap-size` 个位置），也可以比堆短（容量已满）。这一区分在 6.4 里是**关键**：HEAPSORT 就是把已经排好的最大值"摘出堆外"，靠降低 `A.heap-size` 来实现，数组长度 `n` 自始至终不变。\n\n★ 关于记号：本书正文排的是 `A.heap-size`（属性访问用**句点**）。语料把它抽成了 `A: heap-size` —— 那个符号在渲染页上确认过是句点，不是冒号。站内引述照抄语料，你在阅读时心里替换成 `A.heap-size` 即可。' },
        { kind: 'body', page: 161,
          en: 'A max-heap viewed as (a) a binary tree and (b) an array. The number within the circle at each node in the tree is the value stored at that node. The number above a node is the corresponding index in the array.',
          zh: '★ 这是 Figure 6.1 的图注，读它才知道图上哪层信息是什么：「圆圈**里面**是值，结点**上方**的数字是数组下标」。本站阶段 5 的动画刻意采用同一套画法 —— 数组格子与树结点画同一个下标，这样两边能互相印证。' },
        { kind: 'body', page: 162,
          en: 'On most computers, the LEFT procedure can compute 2i in one instruction by simply shifting the binary representation of i left by one bit position. Similarly, the RIGHT procedure can quickly compute 2i + 1 by shifting the binary representation of i left by one bit position and then adding 1.',
          zh: '★ 一句工程注记：这三条算式不只是数学上简洁，在机器上**各只要一两条指令**（左移/右移）。这就是原书后面说 "Good implementations of heapsort often implement these procedures as macros or inline procedures" 的原因 —— 阶段 6 的 C 程序就把它们写成函数（也可写成宏），调用开销可以忽略。' },
        { kind: 'body', page: 162,
          en: 'There are two kinds of binary heaps: max-heaps and min-heaps. … In a max-heap, the max-heap property is that for every node i other than the root, A[PARENT(i)] ≥ A[i]; that is, the value of a node is at most the value o f its parent. Thus, the largest element in a max-heap is stored at the root, and the subtree rooted at a node contains values no larger than that contained at the node itself.',
          zh: '★★ 最大堆性质的**定义**，以及它唯一重要的两个推论（原书自己写出来的）：**最大值在根上**、以及**子树的根是那棵子树的最大值**。第二个推论比第一个更常用 —— 6.2 的 MAX-HEAPIFY 之所以能"只沿一条路径往下修"，就是因为它假定左右两棵子树各自已经是最大堆了。\n\n★ 注意定义里 "for every node i **other than the root**"：根没有父，所以不受约束。' },
        { kind: 'body', page: 163,
          en: 'Viewing a heap as a tree, we define the height of a node in a heap to be the number of edges on the longest simple downward path from the node to a leaf, and we define the height of the heap to be the height of its root. Since a heap of n elements is based on a complete binary tree, its height is Θ(lg n) (see Exercise 6.1-2).',
          zh: '★ 高度的定义要数**边**（不是结点数）。这条区分很容易答错：只有根一个结点时高度是 0，不是 1。\n\n★ "its height is $\\Theta(\\lg n)$" 是后面所有复杂度结论的**唯一来源**：每个基本操作最坏情况下沿一条从根到叶的路径走，路径长度就是高度，所以是 $O(\\lg n)$。' },
        { kind: 'body', page: 163,
          en: 'As we’ll see, the basic operations on heaps run in time at most proportional to the height of the tree and thus take O(lg n) time.',
          zh: '★ 把上一条的推论说完：**堆的所有基本操作都是 $O(\\lg n)$**，因为它们都是"沿一条路径上下走"。唯一的例外是 6.3 的建堆 —— 它表面上做了 $n$ 次 $O(\\lg n)$ 的调用，但仔细数下来是 $O(n)$（原书 p169 那套按高度分层的求和）。' },
      ],
      terms: [
        { en: 'binary heap', zh: '（二叉）堆', page: 161 },
        { en: 'nearly complete binary tree', zh: '近似完全二叉树', page: 161 },
        { en: 'max-heap property', zh: '最大堆性质', page: 162 },
        { en: 'height of a node', zh: '结点的高度（到叶子最长向下的边数）', page: 163 },
      ] },

    { type: 'pseudocode', title: '三条式子，和一份教学整理',
      lead: '原书这三条只写成三个一行的过程（下面第 1 段）。第 2 段是本站为了配合动画写的**教学整理**，不是原书原文 —— 它把"逐结点检查父子关系"写成一个循环，动画的行号就是照它来的。',
      algo: 'HEAP-INDEX', signature: 'HEAP-INDEX(A, n)', page: 162,
      lines: [
        { n: 1, code: 'for i = 1 to n', zh: '从根开始，给每个结点算一遍它的父与两个孩子。' },
        { n: 2, code: '    PARENT(i) = ⌊i/2⌋', zh: '★ 父的下标是 $\\lfloor i/2\\rfloor$。$i = 1$ 时算出来是 0 —— 这就是"根没有父"在算术上的表现（下标从 1 开始，0 不存在）。' },
        { n: 3, code: '    LEFT(i) = 2i', zh: '左孩是 $2i$。注意这个式子**不需要知道 n**：如果 $2i > n$，那就说明这个孩子不存在（结点是叶子）。' },
        { n: 4, code: '    RIGHT(i) = 2i + 1', zh: '右孩是 $2i+1$。左右孩子下标相邻，所以"左孩不存在"必然意味着"右孩也不存在"。' },
      ],
      vars: [
        { name: 'i', meaning: '结点在数组里的下标（1 基）' },
        { name: 'n', meaning: '堆里的元素个数，也是数组长度' },
      ],
      note: '★ 本站把这三条合成了一个循环来演示（便于逐步看），但**原书上它们是三个各自独立的一行过程** —— 见下面第 1 段。',
      more: [
        { algo: 'PARENT', subtitle: 'PARENT(i) —— 原书 p.162 原文（一行）', signature: 'PARENT(i)', page: 162,
          lines: [{ n: 1, code: 'return ⌊i/2⌋', zh: '就是上取整那条式子的原样。C 里对非负数写 `i / 2` 即可。' }],
          vars: [{ name: 'i', meaning: '结点下标（1 基）' }] },
        { algo: 'LEFT', subtitle: 'LEFT(i) —— 原书 p.162 原文（一行）', signature: 'LEFT(i)', page: 162,
          lines: [{ n: 1, code: 'return 2i', zh: '左孩子的下标。' }],
          vars: [{ name: 'i', meaning: '结点下标（1 基）' }] },
        { algo: 'RIGHT', subtitle: 'RIGHT(i) —— 原书 p.162 原文（一行）', signature: 'RIGHT(i)', page: 162,
          lines: [{ n: 1, code: 'return 2i + 1', zh: '右孩子的下标。' }],
          vars: [{ name: 'i', meaning: '结点下标（1 基）' }] },
      ] },

    { type: 'visualize', title: '同一个下标，同时画在数组格子和树结点上',
      viz: 'heap', algorithm: 'heap-index-demo', pseudocodeRef: 'HEAP-INDEX',
      input: { array: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1] },
      countLabels: { visited: { label: '当前结点', unit: '号' }, leaves: { label: '叶子结点', unit: '个' } },
      invariants: [{ label: '每个结点的父是 ⌊i/2⌋、左孩子是 2i、右孩子是 2i+1 —— 父子关系完全由下标决定' }],
      presets: [
        { name: '原书 Figure 6.1 的大顶堆 ⟨16,14,10,8,7,9,3,2,4,1⟩（n = 10，最后一层未填满）', array: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1] },
        { name: '只有根（n = 1）：连一条边都没有，高度 0', array: [42] },
        { name: 'n = 7：刚好填满三层（2³ − 1），每个内部结点都有两个孩子', array: [7, 6, 5, 4, 3, 2, 1] },
        { name: 'n = 9：最后一层只填了 2 个（下标 8、9），能看清"从左往右填"', array: [9, 8, 7, 6, 5, 4, 3, 2, 1] },
      ],
      tasks: [
        '先只盯着**数组那一排**数一遍 n，再看树的最后一层：为什么图中下标 8、9、10 之后就没有结点了？',
        '在 n = 10 那组里找到下标 4（值是 8）。它的父是几？两个孩子是几？到树上看这三个位置对不对得上。',
        '看看叶子是怎么判定的：动画走到叶子时，说明 $2i$ 已经超过了 n。那 n = 10 时第一个叶子是哪个下标？（答：$\\lfloor 10/2\\rfloor + 1 = 6$）',
        '换到 n = 1 那一组，确认「只有根时高度是 0」—— 高度数的是**边数**，不是结点数。',
      ],
      note: '★ 面板上的虚线格子代表「下标超出了 A.heap-size」——本关 n 就是 heap-size，所以没有虚线格；到 6.4 你会看到它们出现（已经排好的元素被摘出堆外）。' },

    { type: 'code', title: '从伪代码到 C',
      intro: '对照时只看一件事：**书上每个下标减 1**。这份 C 刻意把 `PARENT` / `LEFT` / `RIGHT` 写成 **1 基**语义（与书逐字一致），只在访问 `a[]` 时才减 1 —— 于是「书上的 `A[PARENT(i)]`」在代码里就是 `a[PARENT(i) - 1]`，对应关系一眼可见。',
      pseudocodeRef: 'HEAP-INDEX',
      c: {
        file: 'heap_index.c',
        code: String.raw`/* heap_index.c -- 6.1 节「堆」的下标算术与堆性质验证。
 *
 * 对应原书 p.161-163：
 *   PARENT(i)  return ⌊i/2⌋      LEFT(i)  return 2i      RIGHT(i)  return 2i + 1
 *   max-heap property: 对根以外的每个结点 i，A[PARENT(i)] ≥ A[i]
 *
 * 下标约定：书中伪代码从 1 开始，C 从 0 开始。本文件的 PARENT / LEFT / RIGHT
 * 全部保持**1 基**语义（与书逐字一致），只在访问 a[] 时才减 1 —— 于是
 * 「书里的 A[i]」在代码里就是 a[i - 1]，对应关系一眼可见。
 *
 * 验证四件事（都能自己算出来，不靠"看着像"）：
 *   1. 叶子恰好是下标 ⌊n/2⌋+1 … n 的那些结点（习题 6.1-8）；
 *   2. n 个结点的堆高度恰好是 ⌊lg n⌋（习题 6.1-2）；
 *   3. 最大堆里，任一子树的根都是该子树的最大值（习题 6.1-3）；
 *   4. 习题 6.1-7 给的数组到底是不是最大堆 —— 让程序回答，不靠肉眼。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o heap_index heap_index.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>

/* ---------------------------------------------------------------------------
 * 书上的三个一行过程（1 基，与 p.162 逐字一致）
 * ------------------------------------------------------------------------- */
static int PARENT(int i) { return i / 2; }        /* ⌊i/2⌋：C 的整数除法对非负数即下取整 */
static int LEFT(int i) { return 2 * i; }
static int RIGHT(int i) { return 2 * i + 1; }

/* 结点 i 的高度：从 i 出发向下到某个叶子的最长简单路径上的边数。
 * 一棵以 i 为根的完全子树的高度可以直接从下标算出：⌊lg(i 到 n 的层数)⌋。 */
static int node_height(int i, int n)
{
    int h = 0;
    int j = i;
    while (LEFT(j) <= n) {   /* 还有孩子就还能往下走 */
        j = LEFT(j);
        h++;
    }
    return h;
}

/* 堆高度 = 根的高度（p.163 的定义） */
static int heap_height(int n) { return n <= 0 ? -1 : node_height(1, n); }

/* 最大堆性质：对根以外的每个结点 i，A[PARENT(i)] ≥ A[i] */
static bool is_max_heap(const int *a, int n)
{
    for (int i = 2; i <= n; i++) {
        if (a[PARENT(i) - 1] < a[i - 1]) { return false; }
    }
    return true;
}

/* 最小堆性质：对根以外的每个结点 i，A[PARENT(i)] ≤ A[i] */
static bool is_min_heap(const int *a, int n)
{
    for (int i = 2; i <= n; i++) {
        if (a[PARENT(i) - 1] > a[i - 1]) { return false; }
    }
    return true;
}

/* 以 root 为根的子树里的最大值（用来验证「子树的根就是子树最大值」） */
static int subtree_max(const int *a, int n, int root)
{
    int best = a[root - 1];
    for (int i = root; i <= n; i++) {
        /* i 在 root 的子树里 <=> 从 i 一路取 PARENT 能走到 root */
        int j = i;
        while (j > root) { j = PARENT(j); }
        if (j == root && a[i - 1] > best) { best = a[i - 1]; }
    }
    return best;
}

static void print_array(const char *label, const int *a, int n)
{
    printf("      %s⟨", label);
    for (int i = 0; i < n; i++) { printf("%d%s", a[i], i + 1 < n ? "," : ""); }
    printf("⟩\n");
}

int main(void)
{
    /* 原书 Figure 6.1 的堆（p.162，数组形式） */
    static const int FIG61[10] = {16, 14, 10, 8, 7, 9, 3, 2, 4, 1};

    /* ---- 0. 三条式子之间的恒等式（顺手把 RIGHT 也走一遍）---- */
    for (int i = 1; i <= 4096; i++) {
        assert(PARENT(LEFT(i)) == i);                 /* 左孩子的父就是自己 */
        assert(PARENT(RIGHT(i)) == i);                /* 右孩子的父也是自己 */
        assert(RIGHT(i) == LEFT(i) + 1);              /* 左右孩子下标相邻 */
        if (i > 1) {
            assert(LEFT(PARENT(i)) == i || RIGHT(PARENT(i)) == i); /* 每个结点都是父的某个孩子 */
        }
    }
    puts("part 0: PARENT/LEFT/RIGHT 四条恒等式在 i = 1..4096 上成立");

    /* ---- 1. 叶子就是下标 ⌊n/2⌋+1 … n（习题 6.1-8）---- */
    for (int n = 1; n <= 64; n++) {
        int expected_first_leaf = n / 2 + 1;
        for (int i = 1; i <= n; i++) {
            bool is_leaf = LEFT(i) > n;               /* 没有左孩子 <=> 是叶子 */
            bool should_be_leaf = (i >= expected_first_leaf);
            assert(is_leaf == should_be_leaf);
        }
    }
    puts("part 1: n = 1..64 都满足「叶子恰好是下标 ⌊n/2⌋+1 … n」（习题 6.1-8）");

    /* ---- 2. n 个结点的堆高度 = ⌊lg n⌋（习题 6.1-2）---- */
    for (int n = 1; n <= 1024; n++) {
        int lg = 0, p = 1;
        while (p * 2 <= n) { p *= 2; lg++; }          /* lg = ⌊log2 n⌋ */
        assert(heap_height(n) == lg);
    }
    printf("part 2: n = 1..1024 都满足「堆高度 = ⌊lg n⌋」（习题 6.1-2）；n = 10 时高度 = %d\n",
           heap_height(10));

    /* ---- 3. 最大堆里任取一棵子树，其根都是该子树的最大值（习题 6.1-3）---- */
    assert(is_max_heap(FIG61, 10));
    for (int root = 1; root <= 10; root++) {
        assert(subtree_max(FIG61, 10, root) == FIG61[root - 1]);
    }
    puts("part 3: Figure 6.1 的堆里，10 棵子树的根都是各自子树的最大值（习题 6.1-3）");

    /* ---- 4. 习题 6.1-7：⟨33,19,20,15,13,10,2,13,16,12⟩ 是不是最大堆？---- */
    {
        static const int EX617[10] = {33, 19, 20, 15, 13, 10, 2, 13, 16, 12};
        print_array("习题 6.1-7 的数组 ", EX617, 10);
        int violations = 0;
        for (int i = 2; i <= 10; i++) {
            if (EX617[PARENT(i) - 1] < EX617[i - 1]) {
                violations++;
                printf("      ★ 违规：A[%d] = %d < A[%d] = %d\n",
                       PARENT(i), EX617[PARENT(i) - 1], i, EX617[i - 1]);
            }
        }
        printf("      -> %s（共 %d 处违规）\n", violations ? "不是最大堆" : "是最大堆", violations);
        assert(violations == 1);
        assert(!is_max_heap(EX617, 10));
        /* ★ 唯一那处违规是 (父 4, 子 9)：A[4] = 15 < A[9] = 16。
         *   注意别想当然 —— 前 8 个位置看着"很像个堆"，而 [8] = 13、[9] = 16
         *   这一对**不是**父子关系（PARENT(9) = 4）。这正是这道小题的坑：
         *   判断堆性质必须按下标算父子，不能靠眼看相邻位置。 */
        assert(PARENT(9) == 4);
        assert(EX617[PARENT(9) - 1] == 15 && EX617[8] == 16);
        assert(EX617[7] == 13);
    }

    /* ---- 5. 两个容易反着答的判断题（习题 6.1-4 / 6.1-6）---- */
    {
        /* 6.1-6：排好序的数组是**最小**堆（不是最大堆） */
        static const int ASC[7] = {1, 2, 3, 4, 5, 6, 7};
        static const int DESC[7] = {7, 6, 5, 4, 3, 2, 1};
        assert(is_min_heap(ASC, 7));
        assert(!is_max_heap(ASC, 7));
        assert(is_max_heap(DESC, 7));
        assert(!is_min_heap(DESC, 7));
        puts("part 5: 递增数组是最小堆（不是最大堆）、递减数组是最大堆 —— 习题 6.1-6");

        /* 6.1-4：最大堆里最小元素只可能在叶子（下标 ⌊n/2⌋+1 … n），因为非叶子都有孩子 */
        int min_val = FIG61[0], min_pos = 1;
        for (int i = 2; i <= 10; i++) {
            if (FIG61[i - 1] < min_val) { min_val = FIG61[i - 1]; min_pos = i; }
        }
        assert(min_pos >= 10 / 2 + 1);                /* 落在叶子区间里 */
        printf("      Figure 6.1 的最小值 %d 在下标 %d（叶子区间从 %d 开始）—— 习题 6.1-4\n",
               min_val, min_pos, 10 / 2 + 1);
    }

    puts("all checks passed.");
    return 0;
}
`,
        notes: [
          { line: 26, zh: '`PARENT(i) { return i / 2; }`：C 的整数除法对**非负数**天然就是下取整，所以不用 `floor()`。如果 $i$ 可能是负数就必须改写 —— 这是整数除法最常见的坑。' },
          { line: 27, zh: '`LEFT(i)` 与书第 3 行逐字一致。它**不需要知道 n** —— 孩子是否存在由调用方用 `<= n` 判断。' },
          { line: 28, zh: '`RIGHT(i)` 同理。三个函数保持 1 基签名，是这份代码可读性的关键。' },
          { line: 47, zh: '★ `is_max_heap`：直接照定义实现 —— 对根以外的每个 $i$ 检查 `a[PARENT(i)-1] >= a[i-1]`。**注意是父与子比，不是相邻位置比**：这是习题 6.1-7 的坑（见下面第 140 行那条注释）。' },
          { line: 44, zh: '`heap_height`：堆高度按定义是**根的高度**，数的是边数。' },
          { line: 106, zh: '★ 第 1 组断言：用「没有左孩子 $\\Leftrightarrow$ 是叶子」判定叶子集合，再与 $\\lfloor n/2\\rfloor+1 \\dots n$ 比 —— 两种算法必须给同一答案（习题 6.1-8）。' },
          { line: 115, zh: '★ 第 2 组断言：程序自己移位算出 $\\lfloor\\lg n\\rfloor$，再与遍历求得的高度比对，$n = 1 \\dots 1024$ 全过（习题 6.1-2）。这条断言就是「堆的操作都是 $O(\\lg n)$」的算术依据。' },
          { line: 123, zh: '★ 第 3 组断言：对 Figure 6.1 的堆逐棵子树检查「子树的根 = 子树最大值」（习题 6.1-3）。' },
          { line: 140, zh: '★★ 第 4 组：习题 6.1-7 的数组 ⟨33,19,20,15,13,10,2,13,16,12⟩ 到底是不是最大堆？程序给出答案：**不是**，唯一一处违规是 $A[4] = 15 < A[9] = 16$。\n\n★ 这里有个真实的坑：前 8 个位置"看着很像个堆"，而 $A[8] = 13$、$A[9] = 16$ 这一对**不是父子**（$\\text{PARENT}(9) = 4$）。判断堆性质只能按下标算父子，肉眼扫相邻位置一定会错 —— 我第一版注释就写错了这对下标，是这条断言纠正的。' },
          { line: 156, zh: '第 5 组：习题 6.1-6 —— 递增数组是**最小**堆（不是最大堆）。程序把两个方向都断言了，避免"想当然"。' },
          { line: 167, zh: '习题 6.1-4：最大堆里最小值只可能在叶子上（非叶子都有孩子，孩子不大于它……等等，是**不小于**吗？自己推一遍：父 ≥ 子，所以一个"有孩子的结点"不可能是最小值）。程序实际找出最小值并断言它落在叶子区间。' },
        ],
        tests: [
          { in: 'i = 1..4096，检查 PARENT/LEFT/RIGHT 的恒等式', out: 'PARENT(LEFT(i)) = PARENT(RIGHT(i)) = i，且 RIGHT(i) = LEFT(i)+1' },
          { in: 'n = 1..64，两种方法求叶子集合', out: '「没有左孩子」与「下标 ≥ ⌊n/2⌋+1」给出同一答案（习题 6.1-8）' },
          { in: 'n = 1..1024，两种方法求堆高度', out: '遍历求得的高度 = ⌊lg n⌋，全部相等（习题 6.1-2）' },
          { in: 'Figure 6.1 的堆，逐棵子树求最大值', out: '每棵子树的根都等于该子树最大值（习题 6.1-3）' },
          { in: '⟨33,19,20,15,13,10,2,13,16,12⟩', out: '不是最大堆；唯一违规 A[4] = 15 < A[9] = 16（习题 6.1-7）' },
          { in: '编译与运行', out: 'gcc -std=c99 -Wall -Wextra -Werror 零警告；全部断言通过，输出 all checks passed.' },
        ],
      },
      mapping: [
        { pc: 1, pcCode: 'for i = 1 to n', c: '教学整理的循环（第 98 行的 `for (int i = 1; i <= n; i++)`），原书没有这个循环 —— 原书是三个独立的一行过程。' },
        { pc: 2, pcCode: 'PARENT(i) = ⌊i/2⌋', c: '`static int PARENT(int i) { return i / 2; }`（第 26 行）' },
        { pc: 3, pcCode: 'LEFT(i) = 2i', c: '`static int LEFT(int i) { return 2 * i; }`（第 27 行）' },
        { pc: 4, pcCode: 'RIGHT(i) = 2i + 1', c: '`static int RIGHT(int i) { return 2 * i + 1; }`（第 28 行）' },
        { pc: 2, pcCode: 'A[PARENT(i)]（书里 1 基）', c: '`a[PARENT(i) - 1]` —— 见第 47 行的 `is_max_heap`，唯一需要减 1 的地方。' },
      ] },

    { type: 'analyze', title: '这一节给出的全部复杂度结论',
      intro: '6.1 本身不算复杂度，它只是把后面要用到的结论先列出来（原书 p.163 的四个圆点）。这一阶段把它们整理成一张表 —— 每条都能在第 6 章里找到出处，不用记，知道去哪查就行。',
      claims: [
        { expr: '\\Theta(\\lg n)', when: 'n 个结点的堆的高度（习题 6.1-2）', page: 163, source: 'book' },
        { expr: 'O(\\lg n)', when: 'MAX-HEAPIFY：维持堆性质（6.2）', page: 163, source: 'book' },
        { expr: 'O(n)', when: 'BUILD-MAX-HEAP：从无序数组建堆（6.3，线性！）', page: 163, source: 'book' },
        { expr: 'O(n \\lg n)', when: 'HEAPSORT：原地排序（6.4）', page: 163, source: 'book' },
        { expr: 'O(\\lg n)', when: 'MAX-HEAP-INSERT / EXTRACT-MAX / INCREASE-KEY / MAXIMUM（6.5，另有映射开销）', page: 163, source: 'book', preview: true },
      ],
      tables: [
        { caption: '三条下标算式（本节全部内容的算术基础）', rows: [
          ['关系', '算式', '什么时候用'],
          ['父', '$\\text{PARENT}(i) = \\lfloor i/2 \\rfloor$', '往根走（下沉后回溯、上浮）'],
          ['左孩子', '$\\text{LEFT}(i) = 2i$', '往下走（比较父子）'],
          ['右孩子', '$\\text{RIGHT}(i) = 2i + 1$', '往下走'],
          ['是否叶子', '$\\text{LEFT}(i) > n$', '建堆时跳过叶子（6.3）'],
        ] },
        { caption: '数组长度 n 与 A.heap-size 的区别（6.4 的关键）', rows: [
          ['', 'A[1 : n]（数组）', 'A.heap-size（堆）'],
          ['含义', '已分配的存储', '当前算作堆元素的前缀长度'],
          ['会变吗', '不会（排序过程中固定）', '会（HEAPSORT 每轮减 1）'],
          ['6.1 里', '长度 = n', '= n，两值相同'],
        ] },
      ],
      chart: { xMax: 1024, series: [
        { name: '堆高度 ⌊lg n⌋（可用序号）', expr: 'Math.floor(Math.log2(n))', color: '--viz-done' },
        { name: 'n（作对照）', expr: 'n', color: '--viz-idle' },
      ] },
      derivations: [
        { kind: 'summation', title: '为什么高度恰好是 ⌊lg n⌋（习题 6.1-2）', steps: [
          { zh: '把近似完全二叉树的结点从上到下、从左到右编号。前 $h$ 层（第 0 层到第 $h-1$ 层）是**填满**的，一共 $2^h - 1$ 个结点。' },
          { tex: 'n \\ge 2^h - 1 \\quad\\Longrightarrow\\quad h \\le \\lg(n+1)', zh: '高度为 $h$ 需要的结点数下界。' },
          { tex: 'n \\le 2^{h+1} - 1 \\quad\\Longrightarrow\\quad h \\ge \\lg(n+1) - 1', zh: '结点数上界（最多填满第 $h$ 层）。' },
          { tex: 'h = \\lfloor \\lg n \\rfloor', zh: '两条不等式夹出来的整数解。阶段 6 的 C 程序对 $n = 1 \\dots 1024$ 逐个验证了这个等式。' },
        ] },
        { kind: 'summation', title: '为什么「叶子是 ⌊n/2⌋+1 … n」也是对的（习题 6.1-8）', steps: [
          { zh: '$i$ 没有左孩子 $\\Leftrightarrow$ $2i > n$ $\\Leftrightarrow$ $i > n/2$ $\\Leftrightarrow$ $i \\ge \\lfloor n/2 \\rfloor + 1$（整数）。' },
          { tex: '\\text{叶子} = \\{ \\lfloor n/2 \\rfloor + 1, \\dots, n \\}', zh: '这个结论在 6.3 直接决定了建堆的循环从 $\\lfloor n/2 \\rfloor$ **倒着**走到 1（叶子不用处理）。' },
          { zh: '★ 两种判定「$2i > n$」与「$i \\ge \\lfloor n/2 \\rfloor + 1$」必须给出同一答案 —— 阶段 6 的 C 程序对 $n = 1 \\dots 64$ 逐个结点断言了这一点。' },
        ] },
      ],
      note: '★ 中心图用对数/线性两条曲线对照：堆高度随 $n$ **翻倍只涨 1**，这正是「堆的所有基本操作都是 $O(\\lg n)$」的直观形态；表里的 $O(n)$ 建堆是个例外，要用另一套分层求和（6.3）。' },

    { type: 'prove', title: '凭什么说最大值一定在根上',
      statement: 'In a max-heap, the max-heap property is that for every node i other than the root, A[PARENT(i)] ≥ A[i]; that is, the value of a node is at most the value of its parent. Thus, the largest element in a max-heap is stored at the root, and the subtree rooted at a node contains values no larger than that contained at the node itself.',
      page: 162,
      intro: '★ 下面要证的命题就写在原书 p.162 里（上面这段是原文，`A: heap-size` 那类语料伪影已按渲染页修回 `A[PARENT(i)]` 的正常拼写）。它不是一个需要"证明"的定理，而是**定义的两个直接推论** —— 正因为直接，后面的算法才敢这么用。三步分别对应：把定义展开、沿路径传递、得到两个推论。',
      steps: [
        { title: '第一步 · 定义（把话翻译成不等式）',
          en: 'In both kinds, the values in the nodes satisfy a heap property, the specifics of which depend on the kind of heap.',
          page: 162,
          body: [
            '最大堆要求：对**根以外**的每个结点 $i$，都有 $A[\\text{PARENT}(i)] \\ge A[i]$。注意限定词 "other than the root" —— 根没有父，不参与约束。',
            '这是一条**局部**约束（只谈一个结点与它的父），不是全局性质。所有推论都要从这一条局部约束"传递"出来。',
          ] },
        { title: '第二步 · 沿路径传递',
          en: 'that is, the value of a node is at most the value o f its parent.',
          page: 162,
          body: [
            '取任意结点 $i$ 与根 $r$。从 $i$ 出发不断取父，得到一条 $i = v_0, v_1, \\dots, v_k = r$ 的路径（$v_{j+1} = \\text{PARENT}(v_j)$）。',
            '逐段用定义：$A[v_0] \\le A[v_1] \\le \\dots \\le A[v_k]$。不等号的传递性直接给出 $A[i] \\le A[r]$。',
            '★ 这里用到的关键是**定义对每个非根结点都成立**，所以路径上任一段都可以用。有限的路径一定终止在根上（$\\text{PARENT}(1) = 0$ 越界，这正是"根没有父"的算术表现）。',
          ] },
        { title: '第三步 · 两个推论',
          en: 'Thus, the largest element in a max-heap is stored at the root, and the subtree rooted at a node contains values no larger than that contained at the node itself.',
          page: 162,
          body: [
            '**推论 1（最大值在根）**：对每个 $i$ 都有 $A[i] \\le A[r]$，所以 $A[r]$ 是全体最大值。这就是 6.4 的 HEAPSORT 每次都能"取走堆顶当当前最大值"的依据。',
            '**推论 2（子树的根是子树最大值）**：把第二步的论证限制在一棵子树里 —— 从子树内任一结点往上走，只会经过该子树内的结点（因为父链不可能先出去再回来）。于是子树里的每个值都 $\\le$ 子树根的值。',
            '★ 推论 2 是 6.2 的 MAX-HEAPIFY 能成立的前提：它假定左右两棵子树**各自已经是最大堆**，于是"要修的就只有根这一处"。原书在 p.164 说的正是这句：$\\text{LEFT}(i)$ 与 $\\text{RIGHT}(i)$ 是最大堆，但 $A[i]$ 可能比孩子小。',
          ] },
      ],
      conclusion: '★ 得到的结论：**最大值在根**（HEAPSORT 的出口）与**子树的根是子树最大值**（MAX-HEAPIFY 的前提）。注意这两条都是从"局部约束"推出来的——堆的全部威力就来自这条只谈父子的局部不等式。',
      note: '' },

    { type: 'drill', title: '检验一下',
      items: [
        { kind: 'single', q: '在堆的数组表示里，下标 $i$ 的结点的父是哪个下标？',
          options: ['$\\lfloor i/2 \\rfloor$', '$2i$', '$2i+1$', '$i-1$'], answer: 0,
          why: '$\\text{PARENT}(i) = \\lfloor i/2 \\rfloor$。注意 $2i$ 与 $2i+1$ 是**孩子**，方向正好相反 —— 这是最常见的记反。' },
        { kind: 'single', q: '怎样只用下标判断下标 $i$ 的结点是不是叶子？',
          options: ['$i > n/2$', '$\\text{LEFT}(i) > n$', '$\\text{RIGHT}(i) > n$', '$i = n$'], answer: 1,
          why: '★ 没有左孩子就必然没有右孩子（左右下标相邻），所以用 $\\text{LEFT}(i) > n$ 判定。选项 1 在**整数下标**下与它等价（$i \\ge \\lfloor n/2\\rfloor+1$），但写成 $i > n/2$ 在浮点或奇偶边界上容易出错，不推荐。' },
        { kind: 'judge', q: '一个只有根结点的堆，高度是 1。', answer: false,
          why: '高度数的是**边数**，不是结点数。只有根时没有边，高度是 0。（原书 p.163：the number of edges on the longest simple downward path from the node to a leaf）' },
        { kind: 'single', q: '堆的数组长度 $n$ 与 $A.\\text{heap-size}$ 的关系是？',
          options: ['永远相等', 'heap-size 不超过数组长度', 'heap-size 不小于数组长度', '两者无关'], answer: 1,
          why: '$A.\\text{heap-size}$ 表示"前多少个位置算作堆元素"，所以 $0 \\le A.\\text{heap-size} \\le n$。6.4 的 HEAPSORT 就是靠逐步减少 heap-size 来把已排好的元素"摘出堆外"。' },
        { kind: 'single', q: '对 $n = 10$ 的堆，第一个叶子是哪个下标？',
          options: ['5', '6', '10', '11'], answer: 1,
          why: '$\\lfloor n/2 \\rfloor + 1 = 5 + 1 = 6$。所以 6.3 建堆时要处理的内部结点是下标 1…5。' },
        { kind: 'judge', q: '习题 6.1-7 的数组 ⟨33,19,20,15,13,10,2,13,16,12⟩ 是最大堆。', answer: false,
          why: '★ 不是。唯一一处违规是 $A[4] = 15 < A[9] = 16$。坑在于 $A[8] = 13$ 与 $A[9] = 16$ 看起来像"父子"，其实 $\\text{PARENT}(9) = 4$，这一对没有父子关系。判断堆性质必须按下标算父子。' },
        { kind: 'single', q: '把数组排成递增序（$1,2,3,\\dots$），它是哪种堆？',
          options: ['最大堆', '最小堆', '两种都是', '两种都不是'], answer: 1,
          why: '递增序里父恒小于等于子，满足最小堆性质（习题 6.1-6）。递减序才是最大堆。' },
        { kind: 'simulate', q: '$n = 7$ 的堆有几层（根算第 1 层）？', expect: [3], placeholder: '例如：3',
          why: '$n = 7 = 2^3 - 1$ 刚好填满三层。也可用高度公式 $\\lfloor \\lg 7 \\rfloor = 2$，高度是**边数**，层数 = 高度 + 1 = 3。' },
      ],
      bookExercises: [
        { id: '6.1-1', page: 163, star: 0,
          statement: 'What are the minimum and maximum numbers of elements in a heap of height h?',
          hint: '高度 $h$ 的数的是边数，所以一共 $h+1$ 层。最少：最后一层只放 1 个（$2^h$ 个结点）；最多：最后一层填满（$2^{h+1}-1$ 个结点）。' },
        { id: '6.1-2', page: 163, star: 0,
          statement: 'Show that an n-element heap has height blg nc.',
          hint: '★ 夹逼要有两条**够紧**的不等式：高 $h$ 的近似完全二叉树，前 $h$ 层（深度 $0 \\dots h-1$）填满共 $2^h-1$ 个， 第 $h$ 层**至少还有 1 个**，所以 $n \\ge 2^h$ —— 别写成 $n \\ge 2^h - 1$，那只能给出 $h \\le \\lg(n+1)$， 在 $n = 2^k - 1$（整层填满）处夹不出唯一整数。上侧用 $n \\le 2^{h+1}-1 < 2^{h+1}$ 得 $h > \\lg n - 1$。 两条合起来，落在 $(\\lg n - 1, \\lg n]$ 里的整数只有一个：$h = \\lfloor \\lg n \\rfloor$。 阶段 6 的 C 程序对 $n = 1 \\dots 1024$ 逐个验证了这个等式。' },
        { id: '6.1-3', page: 164, star: 0,
          statement: 'Show that in any subtree of a max-heap, the root of the subtree contains the largest value occurring anywhere in that subtree.',
          hint: '★ 阶段 8 的第三步就是它。关键观察：子树里任一结点的父链**不会走出这棵子树**，所以沿父链用不等式传递即可。' },
        { id: '6.1-4', page: 164, star: 0,
          statement: 'Where in a max-heap might the smallest element reside, assuming that all elements are distinct?',
          hint: '只可能在**叶子**上：任何一个非叶子都有孩子，而父 ≥ 子，所以它不可能是最小值。用下标说就是 $\\lfloor n/2 \\rfloor + 1 \\dots n$。想验证的话，阶段 6 的 C 程序会把最小值找出来并断言它落在叶子区间。' },
        { id: '6.1-5', page: 164, star: 0,
          statement: 'At which levels in a max-heap might the kth largest element reside, for 2 ≤ k ≤ ⌊n/2⌋, assuming that all elements are distinct?',
          hint: '根（第 1 层）已经被最大值占了，所以第 $k$ 大的元素只可能落在第 $2$ 层及以下 —— 但"能落在多深"取决于 $k$：越大的元素越靠上。可以从 $k = 2,3$ 开始画几个小例子找规律。' },
        { id: '6.1-6', page: 164, star: 0,
          statement: 'Is an array that is in sorted order a min-heap?',
          hint: '递增序：父恒 ≤ 子，满足最小堆性质 → 是。递减序则满足最大堆性质。阶段 6 的 C 程序把这两个方向都断言了（当初写注释时差点想当然答错）。' },
        { id: '6.1-7', page: 164, star: 0,
          statement: 'Is the array with values ⟨33,19,20,15,13,10,2,13,16,12⟩ a max-heap?',
          hint: '★★ 不是。请**按下标**逐个算父子，不要扫相邻位置：违规的是 $A[4]$ 与 $A[9]$（$\\text{PARENT}(9) = 4$，$15 < 16$）。$A[8] = 13$、$A[9] = 16$ 那一对毫无关系。' },
        { id: '6.1-8', page: 164, star: 0,
          statement: 'Show that, with the array representation for storing an n-element heap, the leaves are the nodes indexed ⌊y bn/2⌋ + 1; ⌊n/2⌋ + 2,…,n .',
          hint: '从「$i$ 是叶子 $\\Leftrightarrow 2i > n$」出发做一次整数变换。这条结论在 6.3 直接决定建堆的循环从 $\\lfloor n/2 \\rfloor$ 倒着走。' },
      ] },
  ],
};
