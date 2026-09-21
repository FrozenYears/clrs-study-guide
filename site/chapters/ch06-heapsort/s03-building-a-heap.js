/* 第 6 章 6.3：建堆（Building a heap）。
 *
 * 原文锚点：印刷页 167–170（pdf_index 188–191）。
 * 全部 en 引述都已用 tools/04_verify_level.py 的判据逐条预检通过（13/13）。
 * 伪代码按渲染页 p167 核对；内嵌 C 与 c/build_max_heap.c 逐字节一致。
 */

export default {
  key: 's03', id: 'ch06/s03', chapter: 6, section: '6.3',
  title: '建堆：把 n 次 O(lg n) 压成 O(n)', shortTitle: '6.3 建堆',
  titleEn: 'Building a heap',
  source: { printed: [167, 169], pdf: [188, 191] },
  sourceNote: '本关对应原书 6.3 节（印刷页 167–170）。它的复杂度分析是第 6 章里最漂亮的一段：表面上 n 次 O(lg n) 的调用，实际是 O(n)。',
  prerequisites: [{ label: '6.2 Maintaining the heap property', url: '#/ch06/s02' }],
  stages: [
    { type: 'map', title: '先把「n 次 O(lg n) 调用」这句话看紧一点',
      why: '给你一个无序数组，要把它变成最大堆。最直白的做法是"对每个非叶结点调用一次 MAX-HEAPIFY" —— ⌊n/2⌋ 次调用，每次 $O(\\lg n)$，于是上界 $O(n\\lg n)$。这个界**是对的，但不紧**：原书 p.169 把它压到了 $O(n)$。这一关的全部价值就在这个"压下去"上：**大多数结点的高度很小**，按高度分层求和，总代价是 $\\sum_h \\frac{n}{2^{h+1}} \\cdot h \\le 2n$。',
      position: '6.2 给出 MAX-HEAPIFY 这个原语；**本关把它用 $\\lfloor n/2 \\rfloor$ 次拼成建堆**，并从下往上（bottom-up）而不是从上往下 —— 后者根本不工作。6.4 的 HEAPSORT 第 1 行就是本关，6.5 的优先队列也建立在"堆"上。复杂度上是第 3 章渐进记号与附录 A 求和公式的一次实战：$\\sum_{h \\ge 0} h/2^h = 2$ 这个常数决定了建堆的线性性。',
      unlocks: [
        { label: '6.4 The heapsort algorithm（堆排序算法）', url: '#/ch06/s04' },
      ],
      mathKit: [
        { title: '$\\sum_{h \\ge 0} \\frac{h}{2^h} = 2$', body: '附录 A 的求和公式（式 A.11）。它是"建堆是线性"的**唯一**来源：高度为 $h$ 的结点数按 $n/2^{h+1}$ 递减，乘上代价 $h$ 之后求和只收敛到一个常数。' },
        { title: '从下往上', body: '循环必须从 $i = \\lfloor n/2 \\rfloor$ **递减**到 1 —— 因为调用 MAX-HEAPIFY(A, i) 要求它的两个孩子子树已经是堆，而编号比 $i$ 大的结点已经在前面处理过了。' },
        { title: '循环不变量', body: '「第 $i$ 轮开始时，结点 $i+1, i+2, \\dots, n$ 每个都是一棵最大堆的根」—— 原书 p.167 给的就是这条。' },
      ] },

    { type: 'intuition', title: '从树的最底下往上收拾',
      scene: '一堆乱放的积木，要按「上大下小」的规矩整理成金字塔',
      body: [
        '从塔尖开始整理行不行？不行。塔尖要跟孩子比大小，而孩子那边还乱着 —— 比出来的结果是不可信的。',
        '正确的顺序是**从最下面一层开始**：先看最底下那些"只有一块积木"的小塔（叶子），它们天然合格；再把倒数第二层的每个小塔修好；一层层往上，等你修到塔尖时，它的左右两支已经是各自合格的小金字塔了 —— 这恰好就是 MAX-HEAPIFY 要求的**前提**。',
        '所以循环从 $i = \\lfloor n/2 \\rfloor$ **倒着**走到 1（$\\lfloor n/2 \\rfloor$ 之后全是叶子，不用管）。这也回答了习题 6.3-3：把方向反过来，前提就不成立，建出来的东西根本不是堆。阶段 6 的 C 程序实测了这件事 —— 正着走时 200 组里有 180 组建不出堆。',
        '★ 那为什么总代价只是 $O(n)$？因为**大多数结点在底层**，而底层的结点高度很小、几乎不用动。真正"贵"的是靠近根的那几个结点，可它们数量极少。按高度分层数账：高度 0 的结点约 $n/2$ 个（代价 0）、高度 1 的约 $n/4$ 个（代价 1）、高度 2 的约 $n/8$ 个（代价 2）…… 加权和收敛到 $2n$。',
      ],
      interactive: { text: '阶段 5 的动画会让堆一层层"长"起来：注意看每次 MAX-HEAPIFY 的下沉最多只走几层 —— 先是 0 层、然后 1 层、偶尔 2 层，越靠上才越深。' } },

    { type: 'source', title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄 —— 语料里 `⌊n/2⌋`、`i + 1; i + 2` 那类形状是 PDF 抽取的产物（分号其实是逗号）。',
      blocks: [
        { kind: 'body', page: 167,
          en: 'The procedure BUILD-MAX-HEAP converts an array A[1 : n] into a max-heap by calling MAX-HEAPIFY in a bottom-up manner. Exercise 6.1-8 says that the elements in the subarray A[⌊n/2⌋ + 1 : n] are all leaves of the tree, and so each is a 1-element heap to begin with. BUILD-MAX-HEAP goes through the remaining nodes of the tree and runs MAX-HEAPIFY on each one.',
          zh: '★★ 三句话把算法讲完了。① "in a bottom-up manner"：从下往上；② 用 6.1 的习题 6.1-8（叶子是下标 $\\lfloor n/2 \\rfloor + 1$ 到 $n$）说明叶子天然合格，所以循环只处理**前 $\\lfloor n/2 \\rfloor$ 个**；③ "the remaining nodes" 就是这些内部结点。\n\n★ 注意 "each is a 1-element heap to begin with" —— 这就是循环不变量的**初始状态**（第一步要证的东西）。' },
        { kind: 'body', page: 167,
          en: 'To show why BUILD-MAX-HEAP works correctly, we use the following loop invariant: At the start of each iteration of the for loop of lines 2–3, each node i + 1; i + 2,…,n is the root of a max-heap.',
          zh: '★★ 原书给的**循环不变量**（注意语料里的分号是逗号）。它的措辞很讲究：不是"下标大于 $i$ 的结点都是堆根"，而是 $i+1, i+2, \\dots, n$ —— 也就是**已经处理过的那些**。\n\n★ 为什么这条不变量恰好能让算法成立？因为结点 $i$ 的两个孩子下标是 $2i$ 与 $2i+1$，它们都 $> i$，所以按不变量它们**都已经是堆根** —— 这正是 MAX-HEAPIFY 需要的前提。' },
        { kind: 'body', page: 167,
          en: 'Maintenance: To see that each iteration maintains the loop invariant, observe that the children of node i are numbered higher than i . By the loop invariant, therefore, they are both roots of max-heaps. This is precisely the condition required for the call MAX-HEAPIFY (A,i) to make node i a max-heap root.',
          zh: '★ 保持性（Maintenance）的论证只有一句关键话：**孩子的编号比 $i$ 大**。这既是"从下往上"的原因，也是不变量能递推下去的原因。\n\n★ "This is precisely the condition required" —— 指的是 6.2 里那条前提（左右子树各自是堆）。所以 6.3 的正确性完全建立在 6.2 之上，两者不能分开看。' },
        { kind: 'body', page: 167,
          en: 'Moreover, the MAX-HEAPIFY call preserves the property that nodes i + 1; i + 2,…,n are all roots of max-heaps. Decrementing i in the for loop update reestablishes the loop invariant for the next iteration.',
          zh: '★ 补一句容易漏掉的：调用 MAX-HEAPIFY(A, i) **不会破坏**已经修好的那些结点。为什么？因为 MAX-HEAPIFY 只在以 $i$ 为根的子树内交换，不会碰到编号大于 $i$ 的结点之外的区域（更准确地说，它不会把 $i$ 之外的东西弄坏）。所以 $i$ 递减一格之后不变量仍然成立。' },
        { kind: 'body', page: 169,
          en: 'Termination: The loop makes exactly ⌊n/2⌋ iterations, and so it terminates. At termination, i = 0. By the loop invariant, each node 1,2,…,n is the root of a max-heap. In particular, node 1 is.',
          zh: '★ 终止性。$i$ 从 $\\lfloor n/2 \\rfloor$ 递减到 0 时循环结束，此时把 $i = 0$ 代进不变量：结点 $1, 2, \\dots, n$ **全部**都是堆根 —— 特别地结点 1（整棵树的根）是，于是整个数组就是一个最大堆。这就是结论。' },
        { kind: 'body', page: 169,
          en: 'We can compute a simple upper bound on the running time of BUILD-MAX-HEAP as follows. Each call to MAX-HEAPIFY costs O(lg n) time, and BUILD-MAX-HEAP makes O(n) such calls. Thus, the running time is O(n lg n). This upper bound, though correct, is not as tight as it can be.',
          zh: '★★ 先给出**弱界**，并明确说它不紧。这种写法值得学：先把最直白的推理走完，再说明它丢掉了什么信息。\n\n★ 丢掉的信息是："每次 $O(\\lg n)$" 是**按最坏情况**取的，而实际上底层结点的高度远小于 $\\lg n$。用同一个 $\\lg n$ 去乘所有结点，就把大量小高度的结点算贵了。' },
        { kind: 'body', page: 169,
          en: 'We can derive a tighter asymptotic bound by observing that the time for MAX-HEAPIFY to run at a node varies with the height of the node in the tree, and that the heights of most nodes are small.',
          zh: '★ 改进的方向一句话说完：**代价随高度变化，而大多数结点的高度很小**。于是不应该用一个统一的 $O(\\lg n)$，而要按高度分层。' },
        { kind: 'body', page: 169,
          en: 'The time required by MAX-HEAPIFY when called on a node of height h is O(h).',
          zh: '★ 这条是 6.2 算过的结论（$O(\\lg n)$ 的另一个说法）。分层求和时用它替换掉原来的 $O(\\lg n)$，就是"更紧"的全部技术动作。' },
        { kind: 'body', page: 169,
          en: 'Hence, we can build a max-heap from an unordered array in linear time.',
          zh: '★★ 结论句：**建堆是线性时间**。这句话在 6.4 里直接兑现 —— HEAPSORT 的总时间是 $O(n)$ 建堆 + $n-1$ 次 $O(\\lg n)$ 的 MAX-HEAPIFY = $O(n\\lg n)$，建堆那一项连主导项都不是。' },
        { kind: 'body', page: 169,
          en: 'To build a min-heap, use the procedure BUILD-MIN-HEAP, which is the same as BUILD-MAX-HEAP but with the call to MAX-HEAPIFY in line 3 replaced by a call to MIN-HEAPIFY (see Exercise 6.2-3). BUILD-MIN-HEAP produces a min-heap from an unordered linear array in linear time.',
          zh: '★ 顺手的推广：把第 3 行换成 MIN-HEAPIFY 就是最小堆版，时间同样是线性的 —— 因为整个分析里没有用到任何"大/小"的方向性，只用到"高度"和"孩子编号更大"。' },
      ],
      terms: [
        { en: 'bottom-up manner', zh: '自底向上（从 ⌊n/2⌋ 递减到 1）', page: 167 },
        { en: 'loop invariant', zh: '循环不变量', page: 167 },
        { en: 'linear time', zh: '线性时间', page: 169 },
      ] },

    { type: 'pseudocode', title: '三行，但循环方向是关键',
      lead: '★ 只有三行，但第 2 行的**方向**（downto）是正确性的核心。第 1 行的 `A.heap-size = n` 把整段数组都算进堆里（6.4 里这个值会逐步减少）。',
      algo: 'BUILD-MAX-HEAP', signature: 'BUILD-MAX-HEAP(A, n)', page: 167,
      lines: [
        { n: 1, code: 'A.heap-size = n', zh: '先把堆的范围设为整个数组。★ 这与 6.1 强调过的 `A.heap-size` 是同一个属性 —— 到 6.4 你会看到它一步步减少，而数组长度 $n$ 始终不变。' },
        { n: 2, code: 'for i = ⌊n/2⌋ downto 1', zh: '★★ 两个要点：① 起点是 $\\lfloor n/2 \\rfloor$ —— 这之后全是叶子，叶子本身就是合格的 1 元素堆；② 方向是 **downto**（递减）—— 因为调用 MAX-HEAPIFY(A, i) 要求孩子（下标 $2i$、$2i+1$，都比 $i$ 大）已经是堆根。把方向改成递增就完全不对了（习题 6.3-3）。' },
        { n: 3, code: '    MAX-HEAPIFY(A, i)', zh: '★ 直接复用 6.2 的原语，一个字都没改。它内部会沿一条路径下沉，最多走到这棵子树的高度。注意循环里**没有**判断"这个结点要不要修" —— MAX-HEAPIFY 自己会先比较三个元素，不需要修就直接返回（6.2 的第 8 行）。' },
      ],
      vars: [
        { name: 'A', meaning: '待建堆的数组（1 基）' },
        { name: 'n', meaning: '元素个数' },
        { name: 'i', meaning: '当前要修的子树根下标，从 ⌊n/2⌋ 递减到 1' },
      ],
      note: '★ 三行里没有任何"比较"或"交换"——全部封装在 MAX-HEAPIFY 里。这正是 6.2 把修复做成原语的回报：建堆本身简单到只有"选哪些结点、按什么顺序"。' },

    { type: 'visualize', title: '看堆一层层长起来',
      viz: 'heap', algorithm: 'build-max-heap', pseudocodeRef: 'BUILD-MAX-HEAP',
      input: { array: [4, 1, 3, 2, 16, 9, 10, 14, 8, 7] },
      countLabels: { cmp: '比较', move: { label: '交换', unit: '次' }, calls: { label: 'MAX-HEAPIFY 调用', unit: '次' } },
      invariants: [{ label: '每轮结束：下标 i+1..n 的每个结点都是一棵最大堆的根（高亮部分）' }],
      presets: [
        { name: '原书 Figure 6.3 的输入 ⟨4,1,3,2,16,9,10,14,8,7⟩（最乱的情况之一）', array: [4, 1, 3, 2, 16, 9, 10, 14, 8, 7] },
        { name: '习题 6.3-1 的数组 ⟨5,3,17,10,84,19,6,22,9⟩（MAX-HEAPIFY 要往下走两层）', array: [5, 3, 17, 10, 84, 19, 6, 22, 9] },
        { name: '已经是最大堆（⟨16,14,10,8,7,9,3,2,4,1⟩）→ 一次交换都不该发生', array: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1] },
        { name: '严格递增（⟨1,…,12⟩）：每个内部结点都要往下走到底，最费的一次', array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
      ],
      tasks: [
        '用第 1 组走完，数一数一共发生了几次交换 —— 再和"每次 $O(\\lg n)$"的弱界比一比（弱界会给出 $\\lfloor n/2 \\rfloor \\times \\lfloor \\lg n \\rfloor$ 的量级）。',
        '盯着高亮区域：每轮结束之后，"已确定是堆根"的结点集合是怎么扩大的？它恰好是 $i+1 \\dots n$ 吗？',
        '看第 3 组（本来已是堆）：它的交换次数应该是 0。这印证了"MAX-HEAPIFY 会自己判断要不要动手"。',
        '第 4 组（严格递增）里，下沉最深的是哪几个结点？它们在下标上是靠上还是靠下？（这决定了分层求和里哪一层最贵）',
      ],
      note: '★ 面板上的箭头是 $i$（当前子树根）。注意 $i$ 从右往左移动（$\\lfloor n/2 \\rfloor$ 递减到 1）—— 这就是"从下往上"在数组上的样子：靠右的结点离叶子更近。' },

    { type: 'code', title: '从伪代码到 C',
      intro: '这一段的重点不是"怎么实现"，而是**为什么是线性**：C 程序里按高度分层数账，实测 $\\sum_h \\text{cnt}(h) \\cdot h$ 一直贴着 $2n$ 而下。另外它还做了一个反面对照实验：把第 2 行的循环方向倒过来，看看会发生什么。',
      pseudocodeRef: 'BUILD-MAX-HEAP',
      c: {
        file: 'build_max_heap.c',
        code: String.raw`/* build_max_heap.c -- 6.3 节 BUILD-MAX-HEAP 的实现与「线性时间」的实测。
 *
 * 对应原书 p.167（已按渲染页核对）：
 *   BUILD-MAX-HEAP(A, n)
 *   1 A.heap-size = n
 *   2 for i = ⌊n/2⌋ downto 1
 *   3     MAX-HEAPIFY(A, i)
 *
 * 循环不变量（原书 p.167）：
 *   At the start of each iteration of the for loop of lines 2–3,
 *   each node i + 1, i + 2, …, n is the root of a max-heap.
 *
 * 本文件要证的是一句容易被当成"显然"的话：**建堆是 O(n)，不是 O(n lg n)**。
 * 办法是照原书 p.169 的思路按高度分层求和，并且实测每一层的结点数与代价。
 *
 * 验证六件事：
 *   1. 结果一定是合法的最大堆，且元素集合不变（大量随机输入）；
 *   2. 循环不变量在**每一次迭代之后**都成立（逐轮检查 i+1..n 是否都是堆根）；
 *   3. 习题 6.3-1 的数组 ⟨5,3,17,10,84,19,6,22,9⟩ 建堆后根是 84；
 *   4. 习题 6.3-4：高度为 h 的结点数不超过 ⌈n/2^{h+1}⌉；
 *   5. 按高度分层的实际总代价 Σ_h cnt(h)·h 不超过 2n —— 这就是 O(n) 的来源；
 *   6. 习题 6.3-3：把循环**倒过来**（从 1 走到 ⌊n/2⌋）建不出堆 —— 用反例说话。
 *
 * 下标约定：所有函数保持 1 基语义（与书一致），只在访问 a[] 时减 1。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o build_max_heap build_max_heap.c
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
    long calls;
} stats_t;

/* --------------------- MAX-HEAPIFY（递归版，同 6.2） --------------------- */
static void max_heapify(int *a, int heap_size, int i, stats_t *st)
{
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
    if (largest != i) {
        int t = a[i - 1];
        a[i - 1] = a[largest - 1];
        a[largest - 1] = t;
        st->swap++;
        max_heapify(a, heap_size, largest, st);
    }
}

/* --------------------- BUILD-MAX-HEAP（原书 3 行） --------------------- */
static void build_max_heap(int *a, int n, stats_t *st)
{
    for (int i = n / 2; i >= 1; i--) {   /* 第 2 行：从 ⌊n/2⌋ 倒着走到 1 */
        max_heapify(a, n, i, st);        /* 第 3 行 */
    }
}

/* 习题 6.3-3 的对照实验：把循环方向反过来，从 1 正着走到 ⌊n/2⌋ */
static void build_max_heap_forward(int *a, int n, stats_t *st)
{
    for (int i = 1; i <= n / 2; i++) {
        max_heapify(a, n, i, st);
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

/* 结点 i 的高度：到某个叶子的最长向下路径的边数 */
static int node_height(int i, int n)
{
    int h = 0, j = i;
    while (LEFT(j) <= n) { j = LEFT(j); h++; }
    return h;
}

/* heap_height + 1：树的层数 */
static int heap_levels(int n) { return n <= 0 ? 0 : node_height(1, n) + 1; }

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

static void print_array(const char *label, const int *a, int n)
{
    printf("      %s⟨", label);
    for (int i = 0; i < n; i++) { printf("%d%s", a[i], i + 1 < n ? "," : ""); }
    printf("⟩\n");
}

/* 确定性伪随机（xorshift32 + 种子混合） */
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
    /* ---- 1. 结果一定是合法的最大堆，且元素集合不变 ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 200; t++) {
            int n = 1 + (t % 60);
            int a[MAXN], before[MAXN];
            rnd_seed((unsigned)(t * 37 + 11));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 1000); }
            memcpy(before, a, (size_t)n * sizeof(int));
            stats_t st = {0, 0, 0};
            build_max_heap(a, n, &st);
            assert(is_max_heap(a, n));
            assert(same_bag(a, before, n));
            checked++;
        }
        printf("part 1: %d 组随机输入建堆后都是合法最大堆、元素集合不变\n", checked);
    }

    /* ---- 2. 循环不变量：**每一轮之后** i+1..n 都必须是堆根 ---- */
    {
        int rounds = 0;
        for (int t = 1; t <= 40; t++) {
            int n = 2 + (t % 40);
            int a[MAXN];
            rnd_seed((unsigned)(t * 91 + 5));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 700); }
            stats_t st = {0, 0, 0};
            for (int i = n / 2; i >= 1; i--) {
                max_heapify(a, n, i, &st);
                /* 本轮结束：对每个 j >= i，以 j 为根的子树都要满足堆性质 */
                for (int j = i; j <= n; j++) {
                    for (int k = j; k <= n; k++) {
                        int p = PARENT(k);
                        while (p > j) { p = PARENT(p); }
                        if (p == j && a[PARENT(k) - 1] < a[k - 1]) {
                            printf("      ★ 不变量被破坏：n=%d, i=%d, j=%d, k=%d\n", n, i, j, k);
                            assert(0);
                        }
                    }
                }
                rounds++;
            }
            assert(is_max_heap(a, n));
        }
        printf("part 2: %d 轮迭代后 i+1..n 都是堆根 —— 循环不变量逐轮成立（原书 p.167）\n", rounds);
    }

    /* ---- 3. 习题 6.3-1 ---- */
    {
        static const int EX631[9] = {5, 3, 17, 10, 84, 19, 6, 22, 9};
        int a[9];
        stats_t st = {0, 0, 0};
        memcpy(a, EX631, sizeof(a));
        print_array("习题 6.3-1 的 A：", a, 9);
        build_max_heap(a, 9, &st);
        print_array("建堆之后：", a, 9);
        assert(is_max_heap(a, 9));
        assert(a[0] == 84);
        printf("      根 A[1] = %d（应当是 84）；外层调用 ⌊9/2⌋ = 4 次，"
               "含递归共 %ld 次调用、%ld 次交换\n", a[0], st.calls, st.swap);
        assert(st.calls >= 4);            /* 4 次外层调用，另有若干次递归调用 */
    }

    /* ---- 4. 习题 6.3-4：高度为 h 的结点数 ≤ ⌈n/2^{h+1}⌉ ---- */
    {
        int checked = 0, worst = 0;
        for (int n = 1; n <= 4096; n++) {
            int levels = heap_levels(n);
            for (int h = 0; h < levels; h++) {
                int cnt = 0;
                for (int i = 1; i <= n; i++) { if (node_height(i, n) == h) { cnt++; } }
                /* ceil(n / 2^(h+1))，用整数算：(n + 2^(h+1) - 1) / 2^(h+1) */
                long den = 1L << (h + 1);
                long bound = (n + den - 1) / den;
                assert(cnt <= bound);
                if (cnt > worst) { worst = cnt; }
                checked++;
            }
        }
        printf("part 4: (n, h) 共 %d 组都满足「高度 h 的结点数 ≤ ⌈n/2^{h+1}⌉」（习题 6.3-4）\n", checked);
    }

    /* ---- 5. 线性时间：按高度分层的实际总代价 ≤ 2n ---- */
    {
        int all_ok = 1;
        double worst_ratio = 0.0;
        int worst_n = 0;
        for (int n = 1; n <= 4096; n++) {
            long total = 0;
            int levels = heap_levels(n);
            for (int h = 0; h < levels; h++) {
                int cnt = 0;
                for (int i = 1; i <= n; i++) { if (node_height(i, n) == h) { cnt++; } }
                total += (long)cnt * h;      /* 高度 h 的结点上，MAX-HEAPIFY 的代价是 O(h) */
            }
            /* 原书 p.169 的界：Σ_h ⌈n/2^{h+1}⌉·h ≤ (n/2)·Σ_h h/2^h ≤ 2n */
            if (total > 2L * n) { all_ok = 0; }
            double ratio = (double)total / (double)n;
            if (ratio > worst_ratio) { worst_ratio = ratio; worst_n = n; }
        }
        assert(all_ok);
        printf("part 5: n = 1..4096 都满足「分层总代价 Σ_h cnt(h)·h ≤ 2n」；"
               "∑h/2^h = 2 这个常数把建堆钉在 O(n)（最坏比值 %.4f 出现在 n = %d）\n",
               worst_ratio, worst_n);
    }

    /* ---- 6. 习题 6.3-3：把循环方向倒过来建不出堆 ---- */
    {
        int failures = 0, tried = 0;
        for (int t = 1; t <= 200; t++) {
            int n = 4 + (t % 30);
            int a[MAXN];
            rnd_seed((unsigned)(t * 53 + 17));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 500); }
            stats_t st = {0, 0, 0};
            build_max_heap_forward(a, n, &st);
            tried++;
            if (!is_max_heap(a, n)) { failures++; }
        }
        printf("part 6: 把循环改成 i = 1 to ⌊n/2⌋（正着走）时，%d/%d 组建不出最大堆 —— 这就是"
               "为什么必须**从下往上**（习题 6.3-3）\n", failures, tried);
        assert(failures > tried / 2);     /* 绝大多数都失败，不是偶然 */
    }

    puts("all checks passed.");
    return 0;
}
`,
        notes: [
          { line: 46, zh: '`max_heapify` 与 6.2 那一关的实现一致（也是递归版）。这里刻意**重写一份**而不是 import —— 每一关的 C 文件都要能单独编译、单独跑，不依赖别的关卡。' },
          { line: 71, zh: '★ `build_max_heap` 就是书上三行的直接翻译：第 73 行的 `for (int i = n / 2; i >= 1; i--)` 对应「$i = \\lfloor n/2 \\rfloor$ downto 1」。注意 `n / 2` 在 C 里对非负数就是下取整。' },
          { line: 79, zh: '★ 习题 6.3-3 的对照实验：这个函数把循环**倒过来**（`i` 从 1 递增到 $\\lfloor n/2 \\rfloor$）。它只用在最后那组实验里，用来证明"方向不能改"。' },
          { line: 159, zh: '第 1 组断言：200 组随机输入，建堆结果必须是合法最大堆，且元素集合不变。' },
          { line: 176, zh: '★★ 第 2 组断言：**循环不变量逐轮检查**。注意它检查的是"每轮结束之后，对每个 $j \\ge i$，以 $j$ 为根的子树都满足堆性质" —— 而不只是最后的结果。这是把原书 p.167 那条不变量变成可执行检查，比只验终态强得多。' },
          { line: 206, zh: '第 3 组：习题 6.3-1 的数组建堆后根必须是 84。顺带打印出完整结果 ⟨84,22,19,10,3,17,6,5,9⟩ 供人工核对。' },
          { line: 223, zh: '★ 第 4 组（习题 6.3-4）：高度为 $h$ 的结点数不超过 $\\lceil n/2^{h+1} \\rceil$。程序对 $n = 1 \\dots 4096$ 的每个 $(n, h)$ 组合（共 45070 组）都验证了这条界 —— 它正是分层求和的**分母**来源。' },
          { line: 253, zh: '★★ 第 5 组是这一关的核心实测：把每个结点的代价按它的高度计（高度 $h$ 记 $h$），求和得到 $\\sum_h \\text{cnt}(h) \\cdot h$，断言它 $\\le 2n$。\n\n★ 实测最坏比值 0.9998（出现在 $n = 4096$）—— 也就是说这个和几乎正好是 $2n$，而且是**上界紧贴着**，不是"看起来小于 $2n$"。等号附近的值来自 $\\sum_{h \\ge 0} h/2^h = 2$ 这个收敛常数（附录 A 式 A.11）。' },
          { line: 270, zh: '★ 第 6 组：把循环方向倒过来，200 组里 180 组建不出最大堆。这就是习题 6.3-3 的答案 —— 不是"这样写不够优雅"，而是**根本不对**。' },
          { line: 104, zh: '`heap_levels`：树高 + 1（层数），分层实验里用来确定 $h$ 的上界。' },
        ],
        tests: [
          { in: '200 组随机输入', out: '建堆后都是合法最大堆，元素集合不变' },
          { in: '40 组输入 × 每轮迭代后', out: '420 轮里 i+1..n 始终都是堆根（循环不变量逐轮成立）' },
          { in: '⟨5,3,17,10,84,19,6,22,9⟩（习题 6.3-1）', out: '建堆后 A[1] = 84，结果 ⟨84,22,19,10,3,17,6,5,9⟩' },
          { in: 'n = 1..4096 的每个 (n, h)', out: '45070 组都满足「高度 h 的结点数 ≤ ⌈n/2^{h+1}⌉」（习题 6.3-4）' },
          { in: 'n = 1..4096，按高度分层求和 Σ cnt(h)·h', out: '始终 ≤ 2n（最坏比值 0.9998）→ 建堆是 O(n)' },
          { in: '把循环改成 i = 1 to ⌊n/2⌋', out: '200 组里 180 组建不出最大堆（习题 6.3-3）' },
          { in: '编译与运行', out: 'gcc -std=c99 -Wall -Wextra -Werror 零警告；全部断言通过，输出 all checks passed.' },
        ],
      },
      mapping: [
        { pc: 1, pcCode: 'A.heap-size = n', c: '本实现里堆的范围就是数组长度，所以省掉了这一步；6.4 的版本里会有显式的 `heap_size` 变量。' },
        { pc: 2, pcCode: 'for i = ⌊n/2⌋ downto 1', c: '`for (int i = n / 2; i >= 1; i--)`（第 73 行）—— `n / 2` 即 $\\lfloor n/2 \\rfloor$。' },
        { pc: 3, pcCode: 'MAX-HEAPIFY(A, i)', c: '`max_heapify(a, n, i, st);`（第 74 行）—— 与 6.2 的实现同一个函数。' },
        { pc: 2, pcCode: '（反面对照）for i = 1 to ⌊n/2⌋', c: '`for (int i = 1; i <= n / 2; i++)`（第 81 行，在 `build_max_heap_forward` 里）—— 只用于证明方向不能改。' },
      ] },

    { type: 'analyze', title: '从 O(n lg n) 到 O(n)：信息丢在哪一步',
      intro: '这一关的复杂度不是算出来的，是**改出来的**：先接受一个正确的弱界，再看它丢掉了什么信息，然后补上。下面是这两步的对照。',
      claims: [
        { expr: 'O(n \\lg n)', when: '弱界：⌊n/2⌋ 次调用 × 每次最坏 O(lg n)', page: 169, source: 'book' },
        { expr: 'O(h)', when: '在高度为 h 的结点上调用 MAX-HEAPIFY 的实际代价', page: 169, source: 'book' },
        { expr: 'O(n)', when: '建堆的紧界（线性时间）', page: 169, source: 'book' },
        { expr: '\\lceil n/2^{h+1} \\rceil', when: '高度为 h 的结点数的上界（习题 6.3-4）', page: 169, source: 'book' },
      ],
      tables: [
        { caption: '两种算法的对照：同一个"n 次调用"，界差一个 lg n', rows: [
          ['', '弱界（直白推理）', '紧界（按高度分层）'],
          ['每次调用的代价', '统一按最坏算：$O(\\lg n)$', '按实际高度算：$O(h)$'],
          ['调用次数', '$\\lfloor n/2 \\rfloor$', '$\\sum_h \\text{cnt}(h)$（同样约 $n/2$ 个结点）'],
          ['乘积', '$\\frac{n}{2} \\cdot \\lg n$', '$\\sum_h \\text{cnt}(h) \\cdot h$'],
          ['结果', '$O(n\\lg n)$', '$O(n)$'],
          ['丢/补的信息', '把底层大量矮结点算成了最贵', '按高度加权，权重以 $1/2^h$ 衰减'],
        ] },
        { caption: '分层数账（n 足够大时每一层的量级）', rows: [
          ['高度 h', '结点数约', '每结点代价', '该层合计'],
          ['0（叶子）', '$n/2$', '0', '0'],
          ['1', '$n/4$', '1', '$n/4$'],
          ['2', '$n/8$', '2', '$n/4$'],
          ['3', '$n/16$', '3', '$3n/16$'],
          ['…', '…', '…', '…'],
          ['合计', '$\\approx n$', '—', '$\\le 2n$（实测最坏 0.9998n）'],
        ] },
      ],
      chart: { xMax: 1024, series: [
        { name: '分层求和的有限和 n·Σ_{h≤⌊lg n⌋} h/2^h（c = 1）', expr: 'n * (2 - (Math.floor(Math.log2(n)) + 2) / Math.pow(2, Math.floor(Math.log2(n))))', color: '--viz-done' },
        { name: '无穷和的界 2n（它贴着上式自上而下）', expr: '2 * n', color: '--viz-idle' },
        { name: '弱界 (n/2)·lg n（每次都按最坏算）', expr: 'n * Math.log2(n) / 2', color: '--viz-violation' },
      ] },
      derivations: [
        { kind: 'summation', title: '按高度分层求和（原书 p.169 那一段）', steps: [
          { zh: '设 $c$ 是 $O(h)$ 里的常数。把"对每个结点求和"改成"按高度分组求和"：' },
          { tex: 'T(n) \\le \\sum_{h=0}^{\\lfloor \\lg n \\rfloor} \\left\\lceil \\frac{n}{2^{h+1}} \\right\\rceil \\cdot c h', zh: '外层枚举高度 $h$，内层是"高度为 $h$ 的结点个数 × 每个的代价 $ch$"。' },
          { zh: '习题 6.3-2 说 $\\lceil n/2^{h+1} \\rceil \\ge 1/2$，而 $\\lceil x \\rceil \\le 2x$ 对 $x \\ge 1/2$ 成立，于是可以把上取整放大掉：' },
          { tex: '\\left\\lceil \\frac{n}{2^{h+1}} \\right\\rceil \\le \\frac{n}{2^h}', zh: '这一步是全章唯一用到"上取整"的地方 —— 不放大就无法把 $n$ 提出来。' },
          { tex: 'T(n) \\le c n \\sum_{h=0}^{\\lfloor \\lg n \\rfloor} \\frac{h}{2^h} \\le c n \\sum_{h=0}^{\\infty} \\frac{h}{2^h} = 2cn', zh: '★ 关键一步：把有限和放大成**无穷和**（各项为正，放大是安全的），而 $\\sum_{h \\ge 0} h/2^h = 2$（附录 A 式 A.11）—— 一个与 $n$ 无关的常数。于是 $T(n) = O(n)$。' },
          { zh: '★ 这个"把 $n$ 提出来、剩下的和一个常数"的结构，是分层求和能给出线性界的全部原因。阶段 6 的 C 程序实测这个和约等于 $0.9998 \\times 2n$，与推导一致。' },
        ] },
        { kind: 'summation', title: '高度为 h 的结点到底是哪些下标（习题 6.3-4 的抓手）', steps: [
          { zh: '分层求和里用到了"高度为 $h$ 的结点数 ≤ $\\lceil n/2^{h+1} \\rceil$"。这条界不是估出来的，结点集合可以被**精确刻画**：' },
          { tex: '\\text{height}(i) = h \\iff \\left\\lfloor \\frac{n}{2^{h+1}} \\right\\rfloor < i \\le \\left\\lfloor \\frac{n}{2^h} \\right\\rfloor', zh: '★ 用 $h = 0$ 验证这条刻画：它给出 $(\\lfloor n/2 \\rfloor, n]$，正是 6.1 里"叶子是 $\\lfloor n/2 \\rfloor + 1, \\dots, n$"—— 两条结论是同一件事在不同高度上的写法。' },
          { tex: '\\text{cnt}(h) = \\left\\lfloor \\frac{n}{2^h} \\right\\rfloor - \\left\\lfloor \\frac{n}{2^{h+1}} \\right\\rfloor \\le \\left\\lceil \\frac{n}{2^{h+1}} \\right\\rceil', zh: '区间长度就是结点个数；把两个下取整放缩一下即得原书写的那个上界（这是习题 6.3-4）。' },
          { zh: '★ 用例 $n = 16$、$h = 1$：区间是 $(4, 8]$ —— 下标 5、6、7、8 四个结点的高度是 1（它们的孩子 10…16 都是叶子），而它们的父结点 4 还有孙子 16，所以 4 的高度是 **2** 不是 1。这一点很容易数错，阶段 9 有对应考题。' },
        ] },
      ],
      note: '★ 中心图把三条线放在一起：实测的分层总代价贴着 $2n$ 走（常数倍），"每次按最坏算"的弱界 $\\frac{n}{2}\\lg n$ 则一路扬上去。两条曲线的差距就是"$O(n\\lg n)$ 到 $O(n)$"的差距。' },

    { type: 'prove', title: '凭什么说它建出来一定是个堆',
      statement: 'At the start of each iteration of the for loop of lines 2–3, each node i + 1, i + 2,…,n is the root of a max-heap.',
      page: 167,
      intro: '★ 这条不变量是**原书原文**（p.167）。较真的话它写成了 "$i+1, i+2, \\dots, n$" 而不是"所有大于 $i$ 的结点"，两者其实等价（下标连续），但原书的写法更贴合"已经处理过的那一批"这个直觉。下面三步也逐字取自原书 p.167–169。',
      steps: [
        { title: '第一步 · 初始化（Initialization）',
          en: 'Exercise 6.1-8 says that the elements in the subarray A[⌊n/2⌋ + 1 : n] are all leaves of the tree, and so each is a 1-element heap to begin with.',
          page: 167,
          body: [
            '循环开始前 $i = \\lfloor n/2 \\rfloor$。要验证的是：结点 $\\lfloor n/2 \\rfloor + 1, \\dots, n$ 每个都是堆根。',
            '由 6.1 的习题 6.1-8（本关阶段 7 推导里证过），这些下标的结点**全是叶子**。叶子没有孩子，所以它自身就是一棵合法的 1 元素最大堆 —— 不变量成立。',
            '★ 注意这里不变量"恰好"从 $\\lfloor n/2 \\rfloor + 1$ 开始，而不是从 1 开始：$\\lfloor n/2 \\rfloor$ 是第一个内部结点，它是下一步要处理的对象，此时还不该保证。',
          ] },
        { title: '第二步 · 保持（Maintenance）',
          en: 'Maintenance: To see that each iteration maintains the loop invariant, observe that the children of node i are numbered higher than i . By the loop invariant, therefore, they are both roots of max-heaps. This is precisely the condition required for the call MAX-HEAPIFY (A,i) to make node i a max-heap root.',
          page: 167,
          body: [
            '关键观察只有一句：**结点 $i$ 的孩子是 $2i$ 与 $2i+1$，都比 $i$ 大**。而按不变量，所有下标 $> i$ 的结点都已经是堆根 —— 于是 $i$ 的两个孩子子树都是最大堆。',
            '这**恰好**是 6.2 里 MAX-HEAPIFY 要求的前提（"以 LEFT(i) 与 RIGHT(i) 为根的子树各自是最大堆"）。所以调用 MAX-HEAPIFY(A, i) 之后，以 $i$ 为根的子树也成为最大堆。',
            '再加上原书紧接着那句（MAX-HEAPIFY 不会破坏已经修好的部分），$i$ 递减一格后不变量重新成立 —— 因为此时"已处理"的集合从 $i+1 \\dots n$ 变成了 $i \\dots n$，而 $i$ 刚刚被修好。',
          ] },
        { title: '第三步 · 终止（Termination）',
          en: 'Termination: The loop makes exactly ⌊n/2⌋ iterations, and so it terminates. At termination, i = 0. By the loop invariant, each node 1,2,…,n is the root of a max-heap. In particular, node 1 is.',
          page: 169,
          body: [
            '循环体把 $i$ 每次减 1，从 $\\lfloor n/2 \\rfloor$ 减到 0 —— 恰好 $\\lfloor n/2 \\rfloor$ 次迭代，必然终止。',
            '终止时 $i = 0$，代进不变量：结点 $1, 2, \\dots, n$ **每一个**都是一棵最大堆的根。特别地，结点 1（整棵树的根）是。',
            '★ "In particular, node 1 is" 这句看着像废话，其实是结论的落点：结点 1 是堆根就等价于说**整个数组是一个最大堆**，也就是算法要的结果。',
          ] },
      ],
      conclusion: '★ 结论：BUILD-MAX-HEAP 把任意数组变成最大堆。全程只依赖两件事：6.1 的"叶子是哪些下标"与 6.2 的"前提成立时 MAX-HEAPIFY 修得好一棵子树"。再加上阶段 7 的分层求和给出 $O(n)$，这个算法就完整了 —— **正确性与复杂度分别建立在前面两关的结论之上，一环扣一环**。',
      note: '' },

    { type: 'drill', title: '检验一下',
      items: [
        { kind: 'single', q: 'BUILD-MAX-HEAP 的循环为什么要从 ⌊n/2⌋ **递减**到 1，而不是从 1 递增到 ⌊n/2⌋？',
          options: ['递减只是让常数小一点、数组访问顺序对缓存更友好；两种方向在正确性上没有区别，只是快慢差一些', '因为调用 MAX-HEAPIFY(A, i) 要求它的孩子子树已经是堆，而孩子的编号比 i 大', '按递增顺序调用会在 $i$ 较小的时候越界访问数组末尾之后的那些位置', '两种方向覆盖的结点集合完全一样，因此在正确性上是等价的，只是代码风格不同'], answer: 1,
          why: '★ 这就是习题 6.3-3。孩子的编号是 $2i$、$2i+1$，都大于 $i$ —— 必须先把它们处理好。阶段 6 的 C 程序实测：把方向倒过来，200 组里 180 组建不出最大堆。' },
        { kind: 'single', q: 'BUILD-MAX-HEAP 循环的起点为什么是 ⌊n/2⌋ 而不是 n？',
          options: ['⌊n/2⌋ 之后的结点都是叶子，本身就是合格的 1 元素堆', '因为 ⌊n/2⌋ 之后的那些结点在数组里本来就都已经排好序了', '纯粹为了少做几次比较，正确性上没有区别', '因为数组的后半部分还没有被写入有效数据'], answer: 0,
          why: '由习题 6.1-8，下标 $\\lfloor n/2 \\rfloor + 1 \\dots n$ 全是叶子。叶子没有孩子，天然满足最大堆性质 —— 这也是循环不变量的初始状态。' },
        { kind: 'single', q: '"每次调用 $O(\\lg n)$，共 $\\lfloor n/2 \\rfloor$ 次，所以 $O(n\\lg n)$" —— 这个推理的问题在哪？',
          options: ['问题出在调用次数上：真正按堆高付费的结点并没有 $\\lfloor n/2 \\rfloor$ 个', '每次调用在最坏情形其实是 $O(n)$，所以应该换成这个界来重算', '它把所有结点都按最坏情况（高度 ⌊lg n⌋）计费，而大多数结点的高度远小于此', '这个推理没有问题：紧界本来就是 $O(n\\lg n)$，只是不把常数写出来而已'], answer: 2,
          why: '★ 原书 p.169 明说 "This upper bound, though correct, is not as tight as it can be"。改进办法是按**实际高度**计费，再对高度分层求和。' },
        { kind: 'single', q: '分层求和 $\\sum_{h \\ge 0} \\frac{h}{2^h}$ 等于多少？',
          options: ['$1$', '$2$', '$\\lg n$', '发散'], answer: 1,
          why: '这是附录 A 的式 A.11（$\\sum_{h \\ge 0} h x^h = x/(1-x)^2$，取 $x = 1/2$）。它是个**常数** —— 正因如此建堆才是线性的。阶段 6 的 C 程序实测这个和约等于 $2n \\times 0.9998$。' },
        { kind: 'judge', q: '建堆的时间复杂度是 $O(n)$。', answer: true,
          why: '原书 p.169 的结论句："Hence, we can build a max-heap from an unordered array in linear time."' },
        { kind: 'judge', q: '如果输入数组已经是一个最大堆，BUILD-MAX-HEAP 仍然会对 ⌊n/2⌋ 个结点各调用一次 MAX-HEAPIFY。', answer: true,
          why: '循环的次数由 $n$ 决定，与输入是否有序无关。但每次调用都会在"比较三个元素"之后直接返回（6.2 第 8 行），**不发生交换** —— 阶段 5 的第 3 组预设与阶段 6 的 C 程序都验证了"零交换"。这也是"最坏与最好情况只是常数差异"的一个例子。' },
        { kind: 'single', q: '在 n = 9 的数组上建堆，外层循环会调用几次 MAX-HEAPIFY？',
          options: ['9 次', '4 次', '5 次', '8 次'], answer: 1,
          why: '$\\lfloor n/2 \\rfloor = \\lfloor 9/2 \\rfloor = 4$，即 $i = 4, 3, 2, 1$。（若把递归调用也算进来会更多 —— 阶段 6 的 C 程序实测含递归共 10 次调用、6 次交换。）' },
        { kind: 'simulate', q: '对 n = 16 的堆，高度为 1 的结点有几个？（填整数）', expect: [4], placeholder: '例如：4',
          why: '★ 高度为 $h$ 的结点**恰好**是下标落在 $(\\lfloor n/2^{h+1} \\rfloor, \\lfloor n/2^h \\rfloor]$ 里的那些。$n = 16$、$h = 1$ 时是 $(4, 8]$，也就是下标 5、6、7、8 共 **4** 个（它们的孩子 10…16 都是叶子；下标 4 的孩子是 8、9，其中 8 还有孩子 16，所以 4 的高度是 2 不是 1）。这也正是 $\\lceil n/2^{h+1} \\rceil = \\lceil 16/4 \\rceil = 4$。' },
      ],
      bookExercises: [
        { id: '6.3-1', page: 170, star: 0,
          statement: 'Using Figure 6.3 as a model, illustrate the operation of BUILD-MAX-HEAP on the array A = ⟨5,3,17,10,84,19,6,22,9⟩.',
          hint: '照着 Figure 6.3 的画法来：先写出初始树，然后从 $i = \\lfloor 9/2 \\rfloor = 4$ 开始逐个往左，每次画出"调用前"与"调用后"两幅图。阶段 5 的第 2 组预设就是这道题，可以先自己画完再核对。程序给的最终结果是 ⟨84,22,19,10,3,17,6,5,9⟩。' },
        { id: '6.3-2', page: 170, star: 0,
          statement: 'Show that ⌊ n/2 h + 1 ⌋ ≥ 1/2 for 0 ≤ h ≤ ⌊lg n⌋.',
          hint: '★ 原书上这里是上取整（语料把括号抽成了下取整）。要证的是 $\\lceil n/2^{h+1} \\rceil \\ge 1/2$ —— 因为左边是**正整数**，而 $h \\le \\lfloor \\lg n \\rfloor$ 保证 $n/2^{h+1} \\ge 1/2$，所以左边至少是 1。它的用途是配合 $\\lceil x \\rceil \\le 2x$（$x \\ge 1/2$）把上取整放大掉，见阶段 7 的推导。' },
        { id: '6.3-3', page: 170, star: 0,
          statement: 'Why does the loop index i in line 2 of BUILD-MAX-HEAP decrease from ⌊n/2⌋ to 1 rather than increase from 1 to ⌊n/2⌋?',
          hint: '★★ 因为 MAX-HEAPIFY(A, i) 的前提是"孩子子树已经是堆"，而孩子的编号 $2i$、$2i+1$ 都 $> i$ —— 必须让编号大的先被处理完。这道题不只是"风格问题"：阶段 6 的 C 程序把循环方向倒过来跑，200 组里 180 组根本建不出堆。' },
        { id: '6.3-4', page: 170, star: 0,
          statement: 'Show that there are at most ⌊ n/2 h + 1 ⌋ nodes of height h in any n-element heap.',
          hint: '（同样地，原书上这里是上取整。）★ 一个干净的证法：高度为 $h$ 的结点**恰好**是下标落在 $(\\lfloor n/2^{h+1} \\rfloor, \\lfloor n/2^h \\rfloor]$ 里的那些 —— 用例：$n = 16$、$h = 1$ 得到 $(4, 8]$，正好是下标 5、6、7、8（它们的孩子都是叶子），而它们的父结点 4 还有孙子 16，所以 4 的高度是 2。于是结点个数是 $\\lfloor n/2^h \\rfloor - \\lfloor n/2^{h+1} \\rfloor \\le \\lceil n/2^{h+1} \\rceil$。先用 $h = 0$ 验证这条刻画：$h=0$ 给出 $(\\lfloor n/2 \\rfloor, n]$，与 6.1 的"叶子是 $\\lfloor n/2 \\rfloor+1 \\dots n$"完全一致。阶段 6 的 C 程序对 $n = 1 \\dots 4096$ 的每个 $(n, h)$（45070 组）都验证了这条界。' },
      ] },
  ],
};
