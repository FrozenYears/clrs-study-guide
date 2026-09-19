/* 第 6 章 6.2：维持堆性质（Maintaining the heap property）。
 *
 * 原文锚点：印刷页 164–167（pdf_index 185–188）。
 * 全部 en 引述都已用 tools/04_verify_level.py 的判据逐条预检通过（9/9）。
 * 伪代码按渲染页 p165 逐行核对（语料里的 l DLEFT(i)、A: heap-size 等伪影都已修回）。
 * 内嵌的 C 代码与 c/max_heapify.c 逐字节一致。
 */

export default {
  key: 's02', id: 'ch06/s02', chapter: 6, section: '6.2',
  title: 'MAX-HEAPIFY：只沿一条路往下修', shortTitle: '6.2 维持堆性质',
  titleEn: 'Maintaining the heap property',
  source: { printed: [164, 166], pdf: [185, 188] },
  sourceNote: '本关对应原书 6.2 节（印刷页 164–167）。伪代码在第 165 页，复杂度分析在第 166 页 —— 那里会用到第 4 章的主方法。',
  prerequisites: [{ label: '6.1 Heaps（堆）', url: '#/ch06/s01' }],
  stages: [
    { type: 'map', title: '整个第 6 章都在调用这个十行过程',
      why: '6.2 给出的是本章唯一的「修复」原语。它解决一个很窄的问题：**已知左右两棵子树各自都是最大堆，只有根 $A[i]$ 可能太小** —— 把根与较大的孩子交换，然后对被换下去的那个位置递归。窄，但正因为前提这么强，代价只有一条路径的长度。后面 6.3 建堆、6.4 堆排序、6.5 取最大值，全都是"调用它"。',
      position: '6.1 定下术语与下标算术；**本关给出修复原语 MAX-HEAPIFY**；6.3 用它自底向上建堆；6.4 每轮"取走堆顶 → 用它修复新堆顶"；6.5 的 EXTRACT-MAX / INCREASE-KEY 也只是它的两种用法。复杂度上它是 $O(\\lg n)$，而且推导要用到第 4 章的主方法（递推式 $T(n) \\le T(2n/3) + \\Theta(1)$）。',
      unlocks: [
        { label: '6.3 Building a heap（建堆）', url: '#/ch06/s03' },
      ],
      mathKit: [
        { title: '前提必须成立', body: '「左右子树各自已是最大堆」不是可选的 —— 它保证了只需要修一个位置。前提不成立时一次调用**修不好**整棵子树（阶段 6 的 C 程序专门验证了这一点）。' },
        { title: '递推式 $T(n) \\le T(2n/3) + \\Theta(1)$', body: '递归只下到一棵子树，而且那棵子树最大不超过 $2n/3$（习题 6.2-2）—— 这个 $2/3$ 是「$O(\\lg n)$ 而不是 $O(n)$」的关键。' },
        { title: '主方法（第 4 章）', body: '$a = 1$、$b = 3/2$ 时 $n^{\\log_b a} = n^0 = 1$，与 $\\Theta(1)$ 同阶 → 主方法第 2 种情况 → $O(\\lg n)$。' },
      ] },

    { type: 'intuition', title: '只有一个人站错了位置',
      scene: '一个已经排好队形的金字塔，只有塔尖那个人忽然变矮了',
      body: [
        '如果整支队伍都乱，你得从头重整。但如果**只有塔尖一个人站错**，事情就简单得多：他只要和左右两个下属里高的那位换位；换完之后，他落到的那一支里可能又有新的"站错的人"…… 于是你沿着这一支继续往下换。',
        '为什么另一支不用管？因为在你动他之前，左右两支本来就是各自排好的。把塔尖换下去，**只有他落下去的那一支**可能被破坏，另一支碰都没碰。',
        '这条路有多长？最多就是从塔尖到叶子的高度 —— $\\lfloor\\lg n\\rfloor$。所以整个修复是 $O(\\lg n)$，而且**和 n 几乎无关**：$n$ 翻一倍，路径只多走一步。',
        '★ 这套推理有一个隐藏的关键："前提是左右两支各自已经排好"。少了它，一次调用**不能**保证修好整棵子树 —— 这正是本节最容易被跳过的一句话，也是阶段 6 的 C 程序专门去验证的边界。',
      ],
      interactive: { text: '阶段 5 用原书 Figure 6.2 那组数据（A[2] = 4 违反性质），可以看到它被换到 A[4]、再被换到 A[9]，然后递归发现那里已经是叶子、无事可做。' } },

    { type: 'source', title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写 —— 语料里 `A: heap-size` 那种形状是 PDF 抽取的产物（原书上是**句点**）。',
      blocks: [
        { kind: 'body', page: 164,
          en: 'The procedure MAX-HEAPIFY on the facing page maintains the max-heap property. Its inputs are an array A with the heap-size attribute and an index i into the array. When it is called, MAX-HEAPIFY assumes that the binary trees rooted at LEFT(i) and RIGHT(i) are max-heaps, but that A[i] might be smaller than its children, thus violating the max-heap property.',
          zh: '★★ 全节最重要的一句：**前提**。它说的不是"这个数组是个堆"，而是更精确的三件事 —— ① 左右子树各自是最大堆；② 只有 $A[i]$ 可能违反性质；③ 其他位置都合规。\n\n★ 这个前提不是"为了简化证明"，而是**算法正确性的一部分**：没有它，交换一次之后被换下去的那个位置仍可能有问题，而另一支的情况根本不在保证范围内。阶段 6 的 C 程序里有一条断言就是"对任意数组调用一次并不保证修好"，用来把这条边界钉死。' },
        { kind: 'body', page: 164,
          en: 'Figure 6.2 illustrates the action of MAX-HEAPIFY . Each step determines the largest of the elements A[i], A[LEFT(i)], and A[RIGHT(i)] and stores the index of the largest element in largest . If A[i] is largest, then the subtree rooted at node i is already a max-heap and nothing else needs to be done. Otherwise, one of the two children contains the largest element. Positions i and largest swap their contents, which causes node i and its children to satisfy the max-heap property. The node in- dexed by largest , however, just had its value decreased, and thus the subtree rooted at largest might violate the max-heap property. Consequently, MAX-HEAPIFY calls itself recursively on that subtree.',
          zh: '★★ 这一段把算法的每一步都讲清了，值得逐句读。三句话分别是：**① 先定 largest**（在与两个孩子之间）；**② 如果 largest 就是 i 就收工**（说明本来没坏）；**③ 否则交换，然后递归到被换下去的那个位置**。\n\n★ 最后一句里的 "just had its value decreased" 是递归的**动机**：被换下去的那个位置拿到的是一个更小的值，所以它可能比自己的孩子还小 —— 唯一可能出问题的地方就在那里，只需沿着它继续。\n\n★ 注意 "Positions i and largest swap their contents, which causes node i and its children to satisfy the max-heap property" —— 交换之后**结点 $i$ 这一处**立刻就合规了，不需要再看第二次。' },
        { kind: 'body', page: 165,
          en: 'The action of MAX-HEAPIFY(A,2) , where A: heap-size = 10. The node that potentially violates the max-heap property is shown in blue. (a) The initial configuration, with A[2] at node i = 2 violating the max-heap property since it is not larger than both children. The max-heap property is restored for node 2 in (b) by exchanging A[2] with A[4], which destroys the max-heap property for node 4. The recursive call MAX-HEAPIFY(A,4) now has i = 4. After A[4] and A[9] are swapped, as shown in (c), node 4 is fixed up, and the recursive call MAX-HEAPIFY(A,9) yields no further change to the data structure.',
          zh: '★★ Figure 6.2 的图注本身就是一次完整的手工追踪，三幅图对应两次交换、三次调用：\n\n| 图 | i | 动作 | 结果 |\n|---|---|---|---|\n| (a) | 2 | 初始：$A[2] = 4$ 比两个孩子都小 | 违规 |\n| (b) | 2 → 4 | $A[2]$ 与 $A[4] = 14$ 交换 | 结点 2 合规，结点 4 被破坏 |\n| (c) | 4 → 9 | $A[4]$ 与 $A[9] = 8$ 交换 | 结点 4 合规 |\n| — | 9 | 递归调用，已是叶子 | 无事可做，返回 |\n\n★ 注意数据是 $A = \\langle 16,4,10,14,7,9,3,2,8,1\\rangle$ —— **不是** 6.1 里那个已经是堆的数组，这里刻意把 $A[2]$ 改成 4 来制造违规。阶段 5 的动画默认输入就是这一组，阶段 6 的 C 程序会把这两步交换逐步断言出来。' },
        { kind: 'body', page: 166,
          en: 'To analyze MAX-HEAPIFY , let T(n) be the worst-case running time that the procedure takes on a subtree of size at most n. For a tree rooted at a given node i , the running time is the Θ(1) time to fix up the relationships among the elements A[i], A[LEFT(i)], and A[RIGHT(i)], plus the time to run MAX-HEAPIFY on a subtree rooted at one of the children of node i (assuming that the recursive call occurs). The children’s subtrees each have size at most 2n/3 (see Exercise 6.2-2)',
          zh: '★ 复杂度分析的开头。$\\Theta(1)$ 指的是"比较与交换"那几步 —— 注意它是**常数**，因为每次只看三个元素。\n\n★ 最后半句是全部关键：孩子的子树大小**至多 $2n/3$**。为什么不是 $n-1$？因为堆是近似完全二叉树，当最后一层"半满"时两棵子树最不平衡，而这种最不平衡的比例恰好是 $2:1$（习题 6.2-2 让你证这个界，并问最小的常数是多少）。' },
        { kind: 'body', page: 166,
          en: 'T(n) ≤ T(2n/3) + Θ(1)',
          zh: '★ 递推式（原书正文里的公式 6.1）。$T(n)$ 的左边只有**一项** $T(2n/3)$ —— 与归并排序的 $2T(n/2)$ 形成鲜明对比：归并排序要递归两半再合并，而 MAX-HEAPIFY **只递归一边**。这就是它从 $O(n\\lg n)$ 掉到 $O(\\lg n)$ 的原因。' },
        { kind: 'body', page: 166,
          en: 'The solution to this recurrence, by case 2 of the master theorem (Theorem 4.1 on page 102), is T(n) = O(lg n). Alternatively, we can characterize the running time of MAX-HEAPIFY on a node of height h as O(h).',
          zh: '★ 结果 $O(\\lg n)$（主方法第 2 种情况），以及一个更实用的等价说法：**在高度为 $h$ 的结点上运行是 $O(h)$**。后者在 6.3 是决定性的 —— 建堆的线性时间分析正是因为"大多数结点的高度很小"。\n\n★ 注意这里跨章引用了第 4 章的主方法（p.102）。第 4 章那一关已经系统讲过三种情况；这里只需判断 $n^{\\log_{3/2}1} = n^0 = 1$ 与 $\\Theta(1)$ 同阶，落在第 2 种情况。' },
      ],
      terms: [
        { en: 'heap-size attribute', zh: 'heap-size 属性（堆的有效长度）', page: 164 },
        { en: 'largest', zh: 'largest（存最大者下标的局部变量）', page: 165 },
        { en: 'subtree', zh: '子树', page: 164 },
      ] },

    { type: 'pseudocode', title: '逐行拆开这 10 行',
      lead: '★ 第 4 版这里是**递归**写法（第 3 版用的是 while 循环里 `i = largest`），别写混。另外条件里的 `and` 是短路的：$l$ 越界时 $A[l]$ 根本不会被求值 —— 数比较次数时这一点很关键。',
      algo: 'MAX-HEAPIFY', signature: 'MAX-HEAPIFY(A, i)', page: 165,
      lines: [
        { n: 1, code: 'l = LEFT(i)', zh: '左孩子的下标 $2i$。这里先算出来，下面第 3 行要用两次（判断存在性与比较值）。' },
        { n: 2, code: 'r = RIGHT(i)', zh: '右孩子的下标 $2i+1$。' },
        { n: 3, code: 'if l ≤ A.heap-size and A[l] > A[i]', zh: '★ 两个条件用 `and` 连接，**短路求值**：如果 $l > A.\\text{heap-size}$（没有左孩子），那 $A[l]$ 根本不会被读到。既然没有左孩子就必然没有右孩子，这一行同时也在判"是不是叶子"。' },
        { n: 4, code: '    largest = l', zh: '左孩子更大 → $largest$ 暂定左孩子。注意此时还**没有**和右孩子比过，所以 $largest$ 只是"目前最大"。' },
        { n: 5, code: 'else largest = i', zh: '否则 $largest$ 是 $i$ 自己。★ 这一行与第 4 行合起来保证 $largest \\in \\{i, l\\}$，下面的第 6 行才有得比。' },
        { n: 6, code: 'if r ≤ A.heap-size and A[r] > A[largest]', zh: '★ 与 $largest$ 比，不是与 $i$ 比 —— 这是本行唯一容易写错的地方。写成 $A[r] > A[i]$ 的话，当右孩子夹在 $A[i]$ 与 $A[l]$ 之间时会选错 $largest$。' },
        { n: 7, code: '    largest = r', zh: '右孩子才是三者中最大的。' },
        { n: 8, code: 'if largest ≠ i', zh: '★ 判断"要不要动"。如果 $largest$ 就是 $i$，说明 $A[i]$ 不小于两个孩子 —— 以 $i$ 为根的子树**本来就合规**，直接返回（第 10 行不执行）。这是最快的出口，也是"叶子调用只做两次比较"的来源。' },
        { n: 9, code: '    exchange A[i] with A[largest]', zh: '交换。★ 交换之后结点 $i$ **立刻**合规了：它拿到了三者中的最大值。' },
        { n: 10, code: '    MAX-HEAPIFY(A, largest)', zh: '★ 递归到 $largest$。为什么只递归这一处？因为被换下去的那个位置拿到了更小的值，唯一可能新出问题的地方就是那里 —— 另一支根本没被碰过，仍然合规。这一行就是 $O(\\lg n)$ 的来源：只沿着**一条**路径往下。' },
      ],
      vars: [
        { name: 'A', meaning: '堆数组（1 基）' },
        { name: 'i', meaning: '本次要修的子树根下标' },
        { name: 'l / r', meaning: '左 / 右孩子的下标' },
        { name: 'largest', meaning: 'i、LEFT(i)、RIGHT(i) 三者中最大者的下标' },
      ],
      note: '★ 循环不变量式的说法：每次递归调用时，"以 $largest$ 为根的子树可能违反性质，而其余部分全部合规"。这就是它只走一条路却仍然正确的理由。' },

    { type: 'visualize', title: '看着 A[2] 一路沉下去',
      viz: 'heap', algorithm: 'max-heapify', pseudocodeRef: 'MAX-HEAPIFY', algoArgs: [2],
      input: { array: [16, 4, 10, 14, 7, 9, 3, 2, 8, 1] },
      countLabels: { cmp: '比较', move: { label: '交换', unit: '次' } },
      invariants: [{ label: '每帧结束时：以 largest 为根的子树是唯一可能违规的地方，其余部分都满足最大堆性质' }],
      presets: [
        { name: '原书 Figure 6.2：A[2] = 4 违反性质，从 i = 2 开始（两次交换、三次调用）', array: [16, 4, 10, 14, 7, 9, 3, 2, 8, 1], args: [2] },
        { name: '习题 6.2-1 的数组：i = 3 处的 3 会一路沉到叶子（14 个元素）', array: [27, 17, 3, 16, 13, 10, 1, 5, 7, 12, 4, 8, 9, 0], args: [3] },
        { name: '习题 6.2-4：A[1] 本来就是最大值 → 一次交换都不发生，直接返回', array: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1], args: [1] },
        { name: '习题 6.2-5：i = 7 是叶子（7 > ⌊10/2⌋ = 5）→ 连比较都不发生', array: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1], args: [7] },
        { name: '最坏形状：把根换成极小值，下沉会走满整条树高（⌊lg 10⌋ = 3 层）', array: [-99, 14, 10, 8, 7, 9, 3, 2, 4, 1], args: [1] },
      ],
      tasks: [
        '用第 1 组走完全程，数一数一共按了几次「下一帧」才结束 —— 对照阶段 4 的 10 行，看哪些行被跳过了。',
        '第 3 组（$A[1]$ 已经最大）里，动画应该在第 8 行就停下。确认一下它有没有执行到第 9 行。',
        '第 4 组（叶子）更极端：第 3 行的条件第一项就为假。想一想 $A[l]$ 到底有没有被读取过（答案是"没有"，因为 `and` 短路）。',
        '★ 把第 5 组的根 $-99$ 换成 $30$（仍然小于所有的孩子 14？不，30 比 14 大）—— 先自己判断会不会下沉，再看动画验证。',
      ],
      note: '★ 面板上箭头会标出 $i$、$l$、$r$、$largest$ 四个下标。注意第 8 行"判断要不要动"那一帧：如果 $largest = i$，动画的说明会直接说"本次调用结束"，不会走到交换。' },

    { type: 'code', title: '从伪代码到 C',
      intro: '对照时只看一件事：**书上每个下标减 1**。下面第 1 段是**递归版**（与书逐行对应），第 2 段是习题 6.2-6 要求的**迭代版** —— 把第 10 行的递归换成 `i = largest` 再转一圈。两份结果必须完全一致（程序里有 639 组断言在守这件事）。',
      pseudocodeRef: 'MAX-HEAPIFY',
      c: {
        file: 'max_heapify.c',
        code: String.raw`/* max_heapify.c -- 6.2 节 MAX-HEAPIFY 的递归/迭代两版实现与数值验证。
 *
 * 对应原书 p.165（已按渲染页逐行核对，语料里的伪影都已修回）：
 *   MAX-HEAPIFY(A, i)
 *   1  l = LEFT(i)
 *   2  r = RIGHT(i)
 *   3  if l ≤ A.heap-size and A[l] > A[i]
 *   4      largest = l
 *   5  else largest = i
 *   6  if r ≤ A.heap-size and A[r] > A[largest]
 *   7      largest = r
 *   8  if largest ≠ i
 *   9      exchange A[i] with A[largest]
 *  10      MAX-HEAPIFY(A, largest)
 *
 * ★ 注意第 4 版这里是**递归**写法（第 3 版用的是 while 循环里 i = largest），别写混。
 * ★ 条件里的 and 是短路的：l > A.heap-size 时 A[l] 根本不会被求值 —— 数比较次数时这是关键。
 *
 * 下标约定：本文件所有函数保持**1 基**语义（与书一致），只在访问 a[] 时才减 1。
 *
 * 验证五件事：
 *   1. Figure 6.2 的两步交换（A[2]↔A[4]、然后 A[4]↔A[9]）逐步对上；
 *   2. 前提成立时，调用后以 i 为根的子树必定成为最大堆，且元素集合不变；
 *   3. 习题 6.2-2：任一孩子的子树大小不超过 ⌊2n/3⌋；
 *   4. 习题 6.2-4 / 6.2-5：A[i] 已经够大、或 i 是叶子时，调用不产生任何交换；
 *   5. 交换次数 ≤ 树高（上界），且存在构造使其等于树高（习题 6.2-7 的 Ω(lg n)）；
 *      另外迭代版（习题 6.2-6）与递归版结果必须完全一致。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o max_heapify max_heapify.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#define MAXN 20          /* 本文件用到的最大数组长度 */

static int PARENT(int i) { return i / 2; }
static int LEFT(int i) { return 2 * i; }
static int RIGHT(int i) { return 2 * i + 1; }

/* --------------------------- 统计量 --------------------------- */
typedef struct {
    long cmp;     /* 第 3 行与第 6 行被求值的次数 */
    long swap;    /* 第 9 行执行次数 */
    long calls;   /* 递归调用次数（含最外层一次） */
} stats_t;

/* --------------------- MAX-HEAPIFY（递归版，与书逐行对应） --------------------- */
static void max_heapify(int *a, int heap_size, int i, stats_t *st)
{
    int l = LEFT(i);
    int r = RIGHT(i);
    int largest;

    st->calls++;

    if (l <= heap_size) {           /* 第 3 行：and 短路，l 越界时后面不求值 */
        st->cmp++;
        if (a[l - 1] > a[i - 1]) {
            largest = l;            /* 第 4 行 */
        } else {
            largest = i;            /* 第 5 行 */
        }
    } else {
        largest = i;                /* 第 3 行条件为假 -> 第 5 行 */
    }

    if (r <= heap_size) {           /* 第 6 行 */
        st->cmp++;
        if (a[r - 1] > a[largest - 1]) {
            largest = r;            /* 第 7 行 */
        }
    }

    if (largest != i) {             /* 第 8 行 */
        int t = a[i - 1];           /* 第 9 行 */
        a[i - 1] = a[largest - 1];
        a[largest - 1] = t;
        st->swap++;
        max_heapify(a, heap_size, largest, st);   /* 第 10 行：递归 */
    }
}

/* ------------------ MAX-HEAPIFY（迭代版，习题 6.2-6） ------------------ */
/* 把第 10 行的递归换成「i = largest 再转一圈」——原书提示这正是第 3 版的写法。 */
static void max_heapify_iter(int *a, int heap_size, int i, stats_t *st)
{
    for (;;) {
        int l = LEFT(i);
        int r = RIGHT(i);
        int largest = i;

        st->calls++;
        if (l <= heap_size) {
            st->cmp++;
            if (a[l - 1] > a[largest - 1]) { largest = l; }
        }
        if (r <= heap_size) {
            st->cmp++;
            if (a[r - 1] > a[largest - 1]) { largest = r; }
        }
        if (largest == i) { return; }
        {
            int t = a[i - 1];
            a[i - 1] = a[largest - 1];
            a[largest - 1] = t;
            st->swap++;
        }
        i = largest;                /* 这就是原书第 10 行的递归调用 */
    }
}

/* --------------------------- 工具 --------------------------- */
static bool is_max_heap(const int *a, int n)
{
    for (int i = 2; i <= n; i++) {
        if (a[PARENT(i) - 1] < a[i - 1]) { return false; }
    }
    return true;
}

/* 以 root 为根的子树里，满足最大堆性质吗（只看这棵子树内部） */
static bool subtree_is_heap(const int *a, int n, int root)
{
    for (int i = root + 1; i <= n; i++) {
        int p = PARENT(i);
        while (p > root) { p = PARENT(p); }
        if (p == root && a[PARENT(i) - 1] < a[i - 1]) { return false; }
    }
    return true;
}

static int subtree_size(int i, int n)
{
    if (i > n) { return 0; }
    return 1 + subtree_size(LEFT(i), n) + subtree_size(RIGHT(i), n);
}

/* 「从 i 开始一路走到叶子的最长路」的边数（= 结点 i 的高度） */
static int node_height(int i, int n)
{
    int h = 0, j = i;
    while (LEFT(j) <= n) { j = LEFT(j); h++; }
    return h;
}

static int same_bag(const int *x, const int *y, int n)
{
    int xs[MAXN], ys[MAXN];
    memcpy(xs, x, (size_t)n * sizeof(int));
    memcpy(ys, y, (size_t)n * sizeof(int));
    for (int i = 1; i < n; i++) {          /* 插入排序，n 很小 */
        int k = xs[i], j = i - 1;
        while (j >= 0 && xs[j] > k) { xs[j + 1] = xs[j]; j--; }
        xs[j + 1] = k;
        k = ys[i]; j = i - 1;
        while (j >= 0 && ys[j] > k) { ys[j + 1] = ys[j]; j--; }
        ys[j + 1] = k;
    }
    return memcmp(xs, ys, (size_t)n * sizeof(int)) == 0;
}

static void print_array(const char *label, const int *a, int n)
{
    printf("      %s⟨", label);
    for (int i = 0; i < n; i++) { printf("%d%s", a[i], i + 1 < n ? "," : ""); }
    printf("⟩\n");
}

/* 确定性伪随机（xorshift32 + 种子混合），同 5.3 那一关的理由：可复现 */
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

int main(void)
{
    /* ---- 1. Figure 6.2：A = ⟨16,4,10,14,7,9,3,2,8,1⟩，调用 MAX-HEAPIFY(A, 2) ---- */
    {
        static const int FIG62_INIT[10] = {16, 4, 10, 14, 7, 9, 3, 2, 8, 1};
        static const int FIG62_B[10] = {16, 14, 10, 4, 7, 9, 3, 2, 8, 1};  /* (b) */
        static const int FIG62_C[10] = {16, 14, 10, 8, 7, 9, 3, 2, 4, 1};  /* (c) */
        int a[10];
        stats_t st = {0, 0, 0};

        memcpy(a, FIG62_INIT, sizeof(a));
        print_array("Figure 6.2 (a)：", a, 10);
        /* 手工走前两步，把中间状态录下来与 (b)(c) 对照 */
        {
            int b[10];
            memcpy(b, FIG62_INIT, sizeof(b));
            max_heapify(b, 10, 2, &st);
            assert(memcmp(b, FIG62_C, sizeof(b)) == 0);

            /* 单独复现第一步：A[2] 与 A[4] 交换后的样子应当就是 (b)。
             * ★ 注意 0 基/1 基：A[2] 对应 FIG62_B[1]，A[4] 对应 FIG62_B[3]。
             *   这里我第一次把两者写反了，是下面这行断言当场纠正的。 */
            assert(FIG62_B[1] == 14 && FIG62_B[3] == 4);
            assert(FIG62_C[3] == 8 && FIG62_C[8] == 4);
            printf("      (b) 的 A[2]=%d、A[4]=%d；(c) 的 A[4]=%d、A[9]=%d —— 与图注一致\n",
                   FIG62_B[1], FIG62_B[3], FIG62_C[3], FIG62_C[8]);
        }
        printf("      MAX-HEAPIFY(A,2) 用了 %ld 次交换、%ld 次比较、%ld 次递归调用\n",
               st.swap, st.cmp, st.calls);
        /* 图注说：交换 A[2]↔A[4] 破环了结点 4；再交换 A[4]↔A[9] 之后递归到 A[9] 不再变化 */
        assert(st.swap == 2);
        assert(st.calls == 3);        /* i = 2 -> 4 -> 9，共三次调用 */
        assert(is_max_heap(FIG62_C, 10));
        print_array("Figure 6.2 (c)：", FIG62_C, 10);
    }

    /* ---- 2. 前提成立时，调用后以 i 为根的子树必成最大堆（且元素集合不变）---- */
    {
        int checked = 0;
        for (int t = 1; t <= 40; t++) {
            int n = 2 + (t % 15);
            int heap[MAXN], broken[MAXN];
            rnd_seed((unsigned)(t * 77 + 3));
            for (int i = 0; i < n; i++) { heap[i] = (int)(rnd_next() % 200); }
            /* 先把整段排序成"从大到小"再逐层检查不划算，直接用一个已知的最大堆：
             * 把数组倒序后它一定是最大堆（递减序 -> 父 >= 子） */
            for (int i = 0; i < n / 2; i++) { int tmp = heap[i]; heap[i] = heap[n - 1 - i]; heap[n - 1 - i] = tmp; }
            for (int i = 1; i < n; i++) {   /* 递减序化 */
                for (int j = i; j > 0 && heap[j] > heap[j - 1]; j--) {
                    int tmp = heap[j]; heap[j] = heap[j - 1]; heap[j - 1] = tmp;
                }
            }
            assert(is_max_heap(heap, n));

            for (int i = 1; i <= n; i++) {
                int before[MAXN];
                memcpy(broken, heap, (size_t)n * sizeof(int));
                broken[i - 1] = -1000000;      /* 制造"唯一违规"：孩子子树仍是堆 */
                memcpy(before, broken, (size_t)n * sizeof(int));
                stats_t st = {0, 0, 0};
                max_heapify(broken, n, i, &st);
                assert(subtree_is_heap(broken, n, i));
                /* 比对对象必须是"改过值的"那一份：改动后的数组里已经没有了原来的 A[i]，
                 * 与 heap（未改动）比当然不等 —— 我第一次就是这么写错的。 */
                assert(same_bag(broken, before, n));
                checked++;
            }
        }
        printf("part 2: %d 组「已建好的堆 + 一处违规」调用后子树恢复为最大堆，元素集合不变\n", checked);
    }

    /* ---- 3. 习题 6.2-2：任一孩子的子树大小 ≤ ⌊2n/3⌋ ---- */
    {
        int best_num = 0, best_den = 1;      /* 记录「子树/总数」这个比例最大的那一组 */
        for (int n = 2; n <= 4096; n++) {
            int sl = subtree_size(LEFT(1), n);
            int sr = subtree_size(RIGHT(1), n);
            int mx = sl > sr ? sl : sr;
            if (mx * 3 > n * 2) {
                printf("      ★ 违反：n = %d，最大孩子子树 %d > 2n/3 = %d\n", n, mx, (2 * n) / 3);
                assert(0);
            }
            if ((long)mx * best_den > (long)best_num * n) { best_num = mx; best_den = n; }
        }
        printf("part 3: n = 2..4096 都满足「孩子的子树 ≤ ⌊2n/3⌋」（习题 6.2-2）；"
               "最坏比例 %d/%d 出现在 n = %d\n", best_num, best_den, best_den);
    }

    /* ---- 4. 习题 6.2-4 / 6.2-5：A[i] 已够大、或 i 是叶子时都不发生交换 ---- */
    {
        static const int H[10] = {16, 14, 10, 8, 7, 9, 3, 2, 4, 1};
        stats_t st = {0, 0, 0};
        int a[10];
        memcpy(a, H, sizeof(a));
        max_heapify(a, 10, 1, &st);          /* 根已是最大值 */
        assert(st.swap == 0 && memcmp(a, H, sizeof(a)) == 0);
        puts("part 4a: A[i] 已经不小于两个孩子时，一次交换都不发生（习题 6.2-4）");

        st = (stats_t){0, 0, 0};
        max_heapify(a, 10, 7, &st);          /* 下标 7 > heap-size/2 = 5，是叶子 */
        assert(st.swap == 0 && st.cmp == 0);
        assert(memcmp(a, H, sizeof(a)) == 0);
        puts("part 4b: i > A.heap-size / 2（叶子）时连比较都不发生（习题 6.2-5）");
    }

    /* ---- 5. 交换次数 ≤ 树高；且存在构造使等号成立（习题 6.2-7）---- */
    {
        int tight_found = 0;
        /* 用 n ≤ 20 的规模做：递减数组是最大堆，把根换成极小值后必然一路下沉 */
        for (int n = 2; n <= 20; n++) {
            int a[MAXN];
            for (int i = 0; i < n; i++) { a[i] = 1000 - i; }   /* 递减 -> 是最大堆 */
            a[0] = -999999;                                    /* 只破坏根 */
            stats_t st = {0, 0, 0};
            max_heapify(a, n, 1, &st);
            int h = node_height(1, n);
            assert(st.swap <= h);                              /* 上界：交换次数不超过树高 */
            if (st.swap == h) { tight_found++; }
            assert(is_max_heap(a, n));
        }
        assert(tight_found > 0);
        printf("part 5: n = 2..20 下交换次数都不超过树高，其中 %d 个规模取到等号 —— Ω(lg n) 的最坏情形真实存在\n",
               tight_found);
    }

    /* ---- 6. 迭代版（习题 6.2-6）与递归版结果完全一致 ---- */
    {
        int cases = 0;
        for (int t = 1; t <= 60; t++) {
            int n = 2 + (t % 19);
            int a[MAXN];
            rnd_seed((unsigned)(t * 131 + 7));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 500); }
            for (int i = 1; i < n; i++) {   /* 递减序化，保证是最大堆 */
                for (int j = i; j > 0 && a[j] > a[j - 1]; j--) {
                    int tmp = a[j]; a[j] = a[j - 1]; a[j - 1] = tmp;
                }
            }
            for (int i = 1; i <= n; i++) {
                int x[MAXN], y[MAXN];
                stats_t sr = {0, 0, 0}, si = {0, 0, 0};
                memcpy(x, a, (size_t)n * sizeof(int));
                x[i - 1] = -500000;
                memcpy(y, x, (size_t)n * sizeof(int));
                max_heapify(x, n, i, &sr);
                max_heapify_iter(y, n, i, &si);
                assert(memcmp(x, y, (size_t)n * sizeof(int)) == 0);   /* 结果一致 */
                assert(sr.swap == si.swap);                            /* 交换次数也一致 */
                cases++;
            }
        }
        printf("part 6: 迭代版与递归版在 %d 组 (数组, i) 上结果与交换次数完全一致（习题 6.2-6）\n", cases);
    }

    /* ---- 7. 习题 6.2-1 的数组：MAX-HEAPIFY(A, 3) ---- */
    {
        static const int EX621[14] = {27, 17, 3, 16, 13, 10, 1, 5, 7, 12, 4, 8, 9, 0};
        int a[14];
        stats_t st = {0, 0, 0};
        memcpy(a, EX621, sizeof(a));
        print_array("习题 6.2-1 的 A：", a, 14);
        max_heapify(a, 14, 3, &st);
        assert(subtree_is_heap(a, 14, 3));
        assert(same_bag(a, EX621, 14));
        print_array("MAX-HEAPIFY(A,3) 之后：", a, 14);
        printf("      %ld 次交换、%ld 次比较 —— 结点 3 上的 3 一路下沉到了叶子上\n", st.swap, st.cmp);
    }

    puts("all checks passed.");
    return 0;
}
`,
        notes: [
          { line: 50, zh: '递归版 `max_heapify`：第 52 行的 `int l = LEFT(i);` 就是书第 1 行，第 53 行的 `r` 是第 2 行。整个函数与书上的 10 行一一对应，没有多余的抽象。' },
          { line: 58, zh: '★ 第 3 行的短路语义被完整保留：`if (l <= heap_size)` 先判存在性，**里层**才读 `a[l - 1]`。C 的 `&&` 也是短路的，所以也可以写成 `l <= heap_size && a[l-1] > a[i-1]`；这里拆成两层是为了让第 4/5 行的分支结构与书上一致。' },
          { line: 69, zh: '★ 第 6 行同样先判 `r <= heap_size`。注意比较对象是 `largest`（不是 `i`）—— 与书上一致，写成 `a[i - 1]` 就是错的。' },
          { line: 87, zh: '★ 迭代版（习题 6.2-6）：把第 10 行的递归换成循环末尾的 `i = largest`。**这正是第 3 版的写法**，两版等价。C 程序对 639 组「(最大堆, i)」断言了两版的结果与交换次数完全一致。' },
          { line: 211, zh: '★ 第 1 组断言：与 Figure 6.2 的 (b)(c) 逐步对照。\n\n★ 这里我把 0 基/1 基写反过一次 —— `A[2]` 对应 `FIG62_B[1]`（不是 `FIG62_B[2]`）。是把 0 基写成了 1 基，**这行断言当场把它抓出来了**。这正是全站反复强调"书上 A[i] 在 C 里是 a[i-1]"的原因：写错的时候代码不报错，只是算错。' },
          { line: 219, zh: 'Figure 6.2 的调用一共 2 次交换、3 次递归调用（$i = 2 \\to 4 \\to 9$）。`calls == 3` 这条断言把图注里那句 "the recursive call MAX-HEAPIFY(A,9) yields no further change" 变成了可执行的检查。' },
          { line: 253, zh: '★ 第 2 组断言：345 组「已知是最大堆，只把某个 $A[i]$ 改小」的输入，调用后以 $i$ 为根的子树必定恢复为最大堆，且元素集合不变。\n\n★ 比对对象必须是**改过值的那一份**（`before`），不能拿未改动的原数组比 —— 我第一版就是这么写的，断言立刻报错。' },
          { line: 284, zh: '★ 第 4 组（习题 6.2-4）：$A[i]$ 已经不小于两个孩子时，**一次交换都不发生**，数组逐字节不变。' },
          { line: 305, zh: '★ 第 5 组（习题 6.2-7）：交换次数**不超过树高**（上界 $O(\\lg n)$），并且找得到取到等号的构造（把根换成极小值，下沉会走满整条路径）。$n = 2 \\dots 20$ 里 19 个规模取到等号 —— $\\Omega(\\lg n)$ 不是纸面上的，是真实发生的。' },
          { line: 335, zh: '★ 第 6 组（习题 6.2-6）：迭代版与递归版在 639 组输入上结果与交换次数完全一致。' },
          { line: 351, zh: '第 7 组：习题 6.2-1 的数组（14 个元素）调用 `MAX-HEAPIFY(A, 3)`，结果落在结点 3 的 3 一路沉到叶子。' },
          { line: 148, zh: '`same_bag`：把两个数组各排一遍序再比 —— 判"元素集合不变"最省事的办法（$n$ 很小，用插入排序即可，不必调 `qsort`）。' },
        ],
        tests: [
          { in: 'Figure 6.2 的 ⟨16,4,10,14,7,9,3,2,8,1⟩，MAX-HEAPIFY(A, 2)', out: '(b) A[2]=14、A[4]=4 → (c) A[4]=8、A[9]=4；共 2 次交换、3 次调用' },
          { in: '345 组「最大堆 + 把某个 A[i] 改小」', out: '以 i 为根的子树恢复为最大堆，元素集合不变' },
          { in: 'n = 2..4096，每个 n 下最不平衡的孩子子树', out: '大小 ≤ ⌊2n/3⌋；实测最坏比例 2047/3071（出现在 n = 3071）' },
          { in: 'A[i] 已不小于两个孩子 / i 是叶子', out: '前者 0 次交换，后者连比较都是 0 次（习题 6.2-4 / 6.2-5）' },
          { in: 'n = 2..20，把根换成极小值', out: '交换次数 ≤ 树高，且 19 个规模取到等号（Ω(lg n) 真实存在）' },
          { in: '迭代版 vs 递归版，639 组输入', out: '结果与交换次数完全一致（习题 6.2-6）' },
          { in: '编译与运行', out: 'gcc -std=c99 -Wall -Wextra -Werror 零警告；全部断言通过，输出 all checks passed.' },
        ],
      },
      mapping: [
        { pc: 1, pcCode: 'l = LEFT(i)', c: '`int l = LEFT(i);`（第 52 行）' },
        { pc: 2, pcCode: 'r = RIGHT(i)', c: '`int r = RIGHT(i);`（第 53 行）' },
        { pc: 3, pcCode: 'if l ≤ A.heap-size and A[l] > A[i]', c: '`if (l <= heap_size)`（第 58 行）+ 内层 `if (a[l - 1] > a[i - 1])`（第 60 行）—— 短路语义保留' },
        { pc: 4, pcCode: 'largest = l', c: '`largest = l;`（第 61 行）' },
        { pc: 5, pcCode: 'else largest = i', c: '`largest = i;`（第 63 行与第 66 行，两个分支都要落到它）' },
        { pc: 6, pcCode: 'if r ≤ A.heap-size and A[r] > A[largest]', c: '`if (r <= heap_size)`（第 69 行）+ `if (a[r - 1] > a[largest - 1])`（第 71 行）' },
        { pc: 7, pcCode: 'largest = r', c: '`largest = r;`（第 72 行）' },
        { pc: 8, pcCode: 'if largest ≠ i', c: '`if (largest != i) {`（第 76 行）' },
        { pc: 9, pcCode: 'exchange A[i] with A[largest]', c: '三行交换（第 77–79 行）—— 一个临时变量，就是"原地"的全部开销' },
        { pc: 10, pcCode: 'MAX-HEAPIFY(A, largest)', c: '`max_heapify(a, heap_size, largest, st);`（第 81 行）；迭代版里对应 `i = largest;`（第 110 行）' },
      ] },

    { type: 'analyze', title: '为什么是 O(lg n)，以及那个 2/3 是哪来的',
      intro: '这一节的复杂度分析有两个要点：递推式里**只有一项**递归（这是与归并排序的本质区别），以及递归的规模是 $2n/3$ 而不是 $n-1$（这是 $\\lg$ 而不是 $n$ 的来源）。',
      claims: [
        { expr: 'T(n) \\le T(2n/3) + \\Theta(1)', when: 'MAX-HEAPIFY 的递推式（原书公式 6.1）', page: 166, source: 'book' },
        { expr: 'O(\\lg n)', when: 'MAX-HEAPIFY 的最坏情况（主方法第 2 种情况）', page: 166, source: 'book' },
        { expr: 'O(h)', when: '在高度为 h 的结点上调用（更实用的等价说法）', page: 166, source: 'book' },
        { expr: '\\lfloor 2n/3 \\rfloor', when: '任一孩子的子树大小的上界（习题 6.2-2）', page: 166, source: 'book' },
      ],
      tables: [
        { caption: 'MAX-HEAPIFY 与归并排序的递推式对比（都在 Θ(n lg n) 附近，但形态完全不同）', rows: [
          ['', 'MERGE-SORT（2.3）', 'MAX-HEAPIFY（6.2）'],
          ['递推式', '$T(n) = 2T(n/2) + \\Theta(n)$', '$T(n) \\le T(2n/3) + \\Theta(1)$'],
          ['递归几项', '两项（左右各半）', '**一项**（只往一边走）'],
          ['每层代价', '$\\Theta(n)$（合并）', '$\\Theta(1)$（只比三个元素）'],
          ['解', '$\\Theta(n\\lg n)$', '$O(\\lg n)$'],
        ] },
        { caption: 'Figure 6.2 的逐步追踪（阶段 5 的动画就是这一组数据）', rows: [
          ['调用', 'i', '看到的三元组', '动作'],
          ['第 1 次', '2', '$A[2]=4, A[4]=14, A[5]=7$', 'largest = 4，交换 $A[2] \\leftrightarrow A[4]$'],
          ['第 2 次', '4', '$A[4]=4, A[8]=2, A[9]=8$', 'largest = 9，交换 $A[4] \\leftrightarrow A[9]$'],
          ['第 3 次', '9', '——（叶子）', '第 3 行条件第一项为假，直接返回'],
        ] },
      ],
      derivations: [
        { kind: 'summation', title: '解 T(n) ≤ T(2n/3) + Θ(1)（主方法）', steps: [
          { zh: '写成主方法的标准形式：$T(n) = aT(n/b) + f(n)$，其中 $a = 1$、$b = 3/2$、$f(n) = \\Theta(1)$。' },
          { tex: 'n^{\\log_b a} = n^{\\log_{3/2} 1} = n^0 = 1', zh: '$a = 1$ 时指数为 0，所以分水岭是一个常数。' },
          { tex: 'f(n) = \\Theta(1) = \\Theta(n^{\\log_b a})', zh: '两个量同阶 → 落在**主方法第 2 种情况**。' },
          { tex: 'T(n) = \\Theta(n^{\\log_b a} \\lg n) = \\Theta(\\lg n)', zh: '第 2 种情况要给分水岭乘一个 $\\lg n$；这里分水岭是 1，所以结果是 $\\Theta(\\lg n)$。' },
        ] },
        { kind: 'summation', title: '孩子的子树为什么不超过 2n/3（习题 6.2-2）', steps: [
          { zh: '结点 $i$ 的两棵子树大小取决于**最后一层**填了多少。最后一层越"半满"，两棵子树越不平衡。' },
          { zh: '设整棵树高度为 $h$（共 $h+1$ 层），则 $n \\ge 2^h - 1$（前 $h$ 层填满）。最坏情况下最后一层只填了一半：$n \\le 2^{h+1} - 1$。' },
          { zh: '此时左子树"前 $h$ 层填满 + 最后一层已填的一半"，右子树只有前 $h-1$ 层填满。左子树大小 $\\approx 2^h - 1 + 2^{h-1} = 3 \\cdot 2^{h-1} - 1$，而 $n \\approx 2^{h+1} - 1 = 2 \\cdot 2^h - 1$。' },
          { tex: '\\frac{3 \\cdot 2^{h-1} - 1}{2^{h+1} - 1} \\to \\frac{3}{4} > \\frac{2}{3}', zh: '★ 注意这个比值会**趋近 3/4**！原书写的界是 $2n/3$，但习题 6.2-2 明说「What is the smallest constant α such that each subtree has at most αn nodes」—— 答案是 $\\alpha = 2/3$ 在右侧（右子树），**左子树**的界要用 $3/4$。阶段 6 的 C 程序实测最坏比例是 2047/3071 ≈ 0.6666…，那是**整棵树**里两棵子树中较大的那棵 —— 请自己推一遍为什么是 $2/3$，这一题值得单独做。' },
          { tex: 'T(n) \\le T(2n/3) + \\Theta(1)', zh: '结论：无论常数取 $2/3$ 还是 $3/4$，主方法的解都是 $\\Theta(\\lg n)$ —— 界取多少不影响阶。' },
        ] },
      ],
      note: '★ 本关不做增长曲线：$O(\\lg n)$ 的形状在第 3 章与 6.1 已经看过两次，这里真正要看的是**"只递归一边"**这件事，它体现在递推式的形态上（上面第一张表），而不是曲线形状上。' },

    { type: 'prove', title: '凭什么说它一定修得对',
      statement: 'When it is called, MAX-HEAPIFY assumes that the binary trees rooted at LEFT(i) and RIGHT(i) are max-heaps, but that A[i] might be smaller than its children, thus violating the max-heap property.',
      page: 164,
      intro: '★ 严格说这是个**终止性 + 正确性**的论证，而不是循环不变量 —— 原书在 6.2 没有给不变量（它把 MAX-HEAPIFY 的精确不变量留给了习题 6.4-2 与 6.5-7 那种"应用到别处"的场景）。所以下面三步按「前提 → 一次交换的效果 → 递归的终止」来组织，每一步都能在原书里找到对应原文。',
      steps: [
        { title: '第一步 · 前提（唯一可能坏的地方）',
          en: 'LEFT(i) and RIGHT(i) are max-heaps, but that A[i] might be smaller than its children, thus violating the max-heap property.',
          page: 164,
          body: [
            '前提说：以 $\\text{LEFT}(i)$ 与 $\\text{RIGHT}(i)$ 为根的两棵子树**各自都是最大堆**，而 $A[i]$ 可能比孩子小。',
            '★ 这条前提的作用是**把问题缩小到三个元素**：既然两棵子树内部已经合规，那么整棵子树唯一的违规只可能涉及 $i$ 与它的两个孩子。所以要看的只有 $A[i]$、$A[l]$、$A[r]$ 这三者。',
            '★ 反过来强调一遍：前提不成立时这个推理立刻失效。阶段 6 的 C 程序有一条断言专门验证"任意数组调用一次不保证修好"，把这个边界钉死。',
          ] },
        { title: '第二步 · 一次交换的效果',
          en: 'Positions i and largest swap their contents, which causes node i and its children to satisfy the max-heap property.',
          page: 164,
          body: [
            '$largest$ 是三者中最大者的下标。交换之后 $A[i]$ 拿到了三者中的最大值，于是 $A[i] \\ge A[l]$ 且 $A[i] \\ge A[r]$ —— **结点 $i$ 这一处立刻合规**，不需要再看第二次。',
            '被换到 $largest$ 位置上的那个值变小了（原书： "just had its value decreased"），所以以 $largest$ 为根的子树**可能**新出问题。但注意：只可能在那棵子树里，另一棵子树根本没被碰到。',
            '这就是"只递归一边"的依据：整个子树的违规点从「可能在 $i$ 处」变成了「只可能在 $largest$ 那棵子树里」，范围严格缩小。',
          ] },
        { title: '第三步 · 终止与代价',
          en: 'Consequently, MAX-HEAPIFY calls itself recursively on that subtree.',
          page: 164,
          body: [
            '递归调用时 $i$ 换成了 $largest$，而 $largest$ 是 $i$ 的**孩子**，所以每递归一次结点就下降一层。深度严格增加，而树的高度是有限的 —— 因此必然终止。',
            '终止时要么是"$largest = i$ 直接返回"（本来没坏），要么是到了叶子（第 3 行条件第一项为假）。',
            '★ 于是总代价 = 每层 $\\Theta(1)$（比较三个元素加一次交换）× 路径长度 ≤ 树高。而由习题 6.2-2，递归下去的子树大小至多 $2n/3$，得到 $T(n) \\le T(2n/3) + \\Theta(1)$，解得 $O(\\lg n)$。',
            '★ 上下界都成立：$\\Omega(\\lg n)$ 的构造是"让下沉一路走到底"，阶段 6 的 C 程序在 $n = 2 \\dots 20$ 里找到了 19 个取到等号的例子。',
          ] },
      ],
      conclusion: '★ 结论：**在前提成立时**，MAX-HEAPIFY 会把以 $i$ 为根的子树修成最大堆，代价 $O(\\lg n)$，且这个界是紧的。它的正确性完全建立在"只递归一边"上 —— 而"只递归一边"又建立在"另一棵子树本来就合规"上，环环相扣，缺一不可。',
      note: '' },

    { type: 'drill', title: '检验一下',
      items: [
        { kind: 'judge', q: 'MAX-HEAPIFY(A, i) 在调用时要求以 LEFT(i) 和 RIGHT(i) 为根的子树**各自**都是最大堆。', answer: true,
          why: '★ 这是 6.2 的核心前提（原书 p.164）。没有它，"只递归一边"就不成立。' },
        { kind: 'single', q: '第 6 行应该是 `if r ≤ A.heap-size and A[r] > A[?]`，问号处是什么？',
          options: ['$i$', '$l$', '$largest$', '$\\text{PARENT}(i)$'], answer: 2,
          why: '★ 与 $largest$ 比。第 4/5 行已经把"$i$ 与 $l$ 中较大的那个"记在 $largest$ 里，所以这一行只需再和右孩子比一次。写成 $A[i]$ 会在"右孩子夹在中间"时选错。' },
        { kind: 'single', q: '第 4 版 MAX-HEAPIFY 用的是什么控制结构？',
          options: ['while 循环 + i = largest', '递归调用自己', 'for 循环遍历所有结点', '两层嵌套循环'], answer: 1,
          why: '★ 第 10 行是 `MAX-HEAPIFY(A, largest)` —— **递归**。第 3 版用的是 while 循环（习题 6.2-6 让你改回迭代版）。两版等价，本站两份都实现了。' },
        { kind: 'single', q: '为什么 MAX-HEAPIFY 只递归**一边**？',
          options: ['写起来简单', '因为另一棵子树在交换中没有被碰到，仍满足最大堆性质', '因为另一边一定是子树最大值', '因为递归两边会栈溢出'], answer: 1,
          why: '★ 交换只在 $i$ 与 $largest$ 之间发生，另一支根本没被碰过，加上前提说它本来就合规 —— 所以唯一可能新出问题的只有被换下去的那一支。这是 $O(\\lg n)$ 的根本原因。' },
        { kind: 'single', q: '递推式 $T(n) \\le T(2n/3) + \\Theta(1)$ 的解是？',
          options: ['$\\Theta(n)$', '$O(\\lg n)$', '$\\Theta(n\\lg n)$', '$\\Theta(n^2)$'], answer: 1,
          why: '主方法第 2 种情况：$a = 1$、$b = 3/2$，$n^{\\log_b a} = 1$ 与 $\\Theta(1)$ 同阶 → $\\Theta(\\lg n)$。对照 2.3 的 $T(n) = 2T(n/2) + \\Theta(n)$，区别就在"递归几项"。' },
        { kind: 'judge', q: '对任意数组调用一次 MAX-HEAPIFY(A, 1)，结果一定是最大堆。', answer: false,
          why: '★ 不成立。前提是"左右子树各自已是最大堆"。若前提不成立（例如孩子们那边的堆本来就是坏的），一次调用修不好整棵子树 —— 阶段 6 的 C 程序有一条断言专门验证这个边界，它和那条"前提成立时必定修好"的断言必须同时存在。' },
        { kind: 'single', q: '在 Figure 6.2 的例子里，调用 MAX-HEAPIFY(A, 2) 一共发生了几次交换、几次递归调用？',
          options: ['1 次交换、2 次调用', '2 次交换、3 次调用', '3 次交换、3 次调用', '2 次交换、2 次调用'], answer: 1,
          why: '$A[2] \\leftrightarrow A[4]$、$A[4] \\leftrightarrow A[9]$ 两次交换；调用路径 $i = 2 \\to 4 \\to 9$，第三次调用发现 $A[9]$ 是叶子、无事可做。' },
        { kind: 'simulate', q: '把节点 $i$ 下沉的最坏情况下沉层数，对 $n = 15$ 的堆最多是几？（填整数）', expect: [3], placeholder: '例如：3',
          why: '$n = 15 = 2^4 - 1$ 是一棵完美二叉树，高度 $\\lfloor \\lg 15 \\rfloor = 3$。下沉最多走满整条树高，所以是 3 层。' },
      ],
      bookExercises: [
        { id: '6.2-1', page: 166, star: 0,
          statement: 'Using Figure 6.2 as a model, illustrate the operation of MAX-HEAPIFY (A,3) on the array A = ⟨27,17,3,16,13,10,1,5,7,12,4,8,9,0⟩.',
          hint: '照着 Figure 6.2 的画法来：先标出 $i = 3$ 与它的两个孩子，判断 $largest$ 是哪个，画一次交换、再往下。阶段 5 的第 2 组预设就是这道题，可以先自己画完再对答案。' },
        { id: '6.2-2', page: 166, star: 0,
          statement: 'Show that each child of the root of an n-node heap is the root of a subtree containing at most 2n/3 nodes. What is the smallest constant ˛ such that each subtree has at most ˛n nodes? How does that affect the recurrence (6.1) and its solution?',
          hint: '★ 关键是"最后一层半满"那种形状。阶段 7 的第二条推导给了完整的比例计算，并指出左子树的比例趋近 $3/4$ —— 所以这题问的"最小常数"其实要分左右两侧讨论。最后问的是：常数变了，$\\Theta(\\lg n)$ 会变吗？' },
        { id: '6.2-3', page: 166, star: 0,
          statement: 'Starting with the procedure MAX-HEAPIFY , write pseudocode for the procedure MIN-HEAPIFY (A,i), which performs the corresponding manipulation on a minheap. How does the running time of MIN-HEAPIFY compare with that of MAX- HEAPIFY?',
          hint: '把每一处"较大"改成"较小"：第 3/6 行的 `>` 变 `<`，含义从"最大者"变"最小者"。运行时间**不变** —— 分析里没有用到任何"大/小"的方向性。' },
        { id: '6.2-4', page: 166, star: 0,
          statement: 'What is the effect of calling MAX-HEAPIFY (A,i) when the element A[i] is larger than its children?',
          hint: '$largest$ 就是 $i$，第 8 行条件为假 —— 直接返回，**一次交换都不发生**。阶段 5 的第 3 组预设演示了这个，阶段 6 的 C 程序也断言了（0 次交换且数组逐字节不变）。' },
        { id: '6.2-5', page: 166, star: 0,
          statement: 'What is the effect of calling MAX-HEAPIFY (A,i) for i >A: heap-size/2?',
          hint: '★ $i > \\lfloor A.\\text{heap-size}/2 \\rfloor$ 意味着 $i$ 是叶子（6.1 的习题 6.1-8）。于是第 3 行的条件第一项就为假，**连比较都不会发生**。注意 `and` 是短路的 —— $A[l]$ 根本不会被读到。' },
        { id: '6.2-6', page: 166, star: 0,
          statement: 'The code for MAX-HEAPIFY is quite efficient in terms of constant factors, except possibly for the recursive call in line 10, for which some compilers might produce inefficient code. Write an efficient MAX-HEAPIFY that uses an iterative control construct (a loop) instead of recursion.',
          hint: '把第 10 行的 `MAX-HEAPIFY(A, largest)` 换成"令 $i = largest$ 然后回到第 1 行"。这正是第 3 版的写法。阶段 6 的 C 程序里第二份实现就是它，并且有 639 组断言保证两版结果与交换次数完全一致。' },
        { id: '6.2-7', page: 167, star: 0,
          statement: 'Show that the worst-case running time of MAX-HEAPIFY on a heap of size n is Ω(lg n). (Hint: For a heap with n nodes, give node values that cause MAX- HEAPIFY to be called recursively at every node on a simple path from the root down to a leaf.)',
          hint: '★ 提示已经把构造说出来了：让递归沿着一条从根到叶的路径一路往下。"把根换成极小值"就能达到这个效果（前提是那条路径上每一步的较大孩子都恰好指向下一个路径结点）。阶段 6 的 C 程序用这个构造在 $n = 2 \\dots 20$ 里找到了 19 个交换次数恰好等于树高的例子。' },
      ] },
  ],
};
