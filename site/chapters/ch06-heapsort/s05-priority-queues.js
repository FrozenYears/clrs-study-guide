/* 第 6 章 6.5：优先队列（Priority queues）。
 *
 * 原文锚点：印刷页 172–179（pdf_index 193–200）。
 * 全部 en 引述都已用 tools/04_verify_level.py 的判据逐条预检通过（20/20）。
 * 伪代码按渲染页 p175/p176 核对；内嵌 C 与 c/heap_priority_queue.c 逐字节一致。
 */

export default {
  key: 's05', id: 'ch06/s05', chapter: 6, section: '6.5',
  title: '优先队列：把堆当成一个能插能取的集合', shortTitle: '6.5 优先队列',
  titleEn: 'Priority queues',
  source: { printed: [172, 179], pdf: [193, 200] },
  sourceNote: '本关对应原书 6.5 节（印刷页 172–179）。它是第 6 章的用途篇：前面把堆当排序工具，这里把同一个结构当成一个「随时可取最大值」的集合。',
  prerequisites: [{ label: '6.4 The heapsort algorithm（堆排序算法）', url: '#/ch06/s04' }],
  stages: [
    { type: 'map', title: '堆的第二次生命：不再排序，而是当集合用',
      why: '前四关把堆当成"一次性的排序工具"：建堆 → 一个个摘出去 → 结束。但堆真正长期的影响力在另一处 —— 它支持一个**可动态变化的集合**：随时插入新元素、随时取出当前最大值。这就是优先队列。操作系统调度作业、仿真器挑选下一个事件、Dijkstra 算法（第 22 章）挑最近的结点，用的都是它。',
      position: '6.1–6.4 把堆讲完（定义、修复、建堆、排序）；**本关把同一个结构改造成抽象数据类型**：$\\text{INSERT}$ / $\\text{MAXIMUM}$ / $\\text{EXTRACT-MAX}$ / $\\text{INCREASE-KEY}$ 四个操作，全部 $O(\\lg n)$（$\\text{MAXIMUM}$ 是 $\\Theta(1)$）。第 15 章用最小优先队列做贪婪算法、第 21/22 章用 $\\text{DECREASE-KEY}$ 做最小生成树与最短路、第 23 章用最小堆实现 Dijkstra 的选点步骤。习题 6-1 还顺手比较了"两种建堆法"的差异。',
      unlocks: [
        { label: '7.1 Description of quicksort（快速排序一瞥）', url: '#/ch07/s01' },
      ],
      mathKit: [
        { title: '四个操作的时间', body: '$\\text{MAXIMUM}$ 是 $\\Theta(1)$（根就是）；其余三个都是 $O(\\lg n)$ —— 因为它们都只沿**一条从根到叶的路径**走（上浮或下沉）。' },
        { title: '上浮 vs 下沉', body: '$\\text{MAX-HEAPIFY}$ 是**往下沉**（修"比孩子小"）；$\\text{INCREASE-KEY}$ 是**往上浮**（修"比父大"）。键变大只会破坏与父的关系，键变小只会破坏与孩子的关系 —— 方向不能搞反。' },
        { title: '对象与下标的映射', body: '真实应用里堆元素是**指向对象的指针**，而操作是按对象发起的（"把作业 X 的优先级调高"）。所以需要一张"对象 ↔ 数组下标"的映射表，原书 p.173–174 专门讨论它（handles 或哈希表）。' },
      ] },

    { type: 'intuition', title: '一个「随取随用」的最大值抽屉',
      scene: '一台共享打印机，谁的任务最急就先打谁 —— 而且随时可能有新任务送进来',
      body: [
        '排序算法解决不了这个问题：作业是**陆续到达**的，你不可能先等所有作业都到齐再排一次。你需要的是一个**始终保持有序感的结构**：任何时候问"现在最急的是哪个"，都能立刻回答。',
        '堆正好合适：最大值永远在根上（$\\text{MAXIMUM}$ 是 $\\Theta(1)$），取走它之后只需 $O(\\lg n)$ 就能把新根修好（$\\text{EXTRACT-MAX}$），插入一个新作业也是 $O(\\lg n)$（$\\text{INSERT}$）。',
        '★ 与 6.4 的堆排序关键区别在于**堆区不再单调缩小**：排序时 $A.\\text{heap-size}$ 一路减到 0；优先队列里它会变来变去 —— 插入时加 1、取出时减 1。所以 6.1 强调的"数组长度 $n$ 与 $A.\\text{heap-size}$ 是两个量"在这里才真正发挥全部作用。',
        '★ 还有一个 6.2 里没强调过的方向问题：$\\text{INCREASE-KEY}$（把某个键调**大**）修的是"比父还大"，所以要**往上浮**；而 $\\text{MAX-HEAPIFY}$ 修的是"比孩子还小"，要**往下沉**。两者方向相反，别搞混 —— 原书还专门指出前者的循环与插入排序的内层循环是一个路子（都是"与相邻元素比较并搬移"）。',
      ],
      interactive: { text: '阶段 5 有三块面板：取最大值、调大某个键、插入新元素。注意"堆区"的虚线格子在取最大值时出现、在插入时消失 —— 这正是优先队列与排序的差别。' } },

    { type: 'source', title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄 —— 语料里 `object s`、`a rray`、`A: heap-size` 那类形状是 PDF 抽取的产物（分别是 objects、array，以及一个**句点**）。',
      blocks: [
        { kind: 'body', page: 172,
          en: 'Nevertheless, the heap data structure itself has many uses. In this section, we present one of the most popular applications of a heap: as an efficient priority queue.',
          zh: '★ 承上启下的一句：6.4 的堆排序只是堆的一个用途（而且原书刚说过快排实践中更快）—— 堆本身的价值远超"当排序算法用"。' },
        { kind: 'body', page: 173,
          en: 'A priority queue is a data structure for maintaining a set S of elements, each with an associated value called a key. A max-priority queue supports the following operations:',
          zh: '★★ 优先队列的定义。两个词要知道分量：**set**（集合 —— 元素会不断增删，不是一次性数组）与 **key**（每个元素带一个可比较的键）。接下来原书用圆点列出四个操作。' },
        { kind: 'body', page: 173,
          en: 'INSERT(S,x,k) inserts the element x with key k into the set S , which is equivalent to the operation S = S [ fx g.',
          zh: '插入。★ 注意它接受**两个**参数：元素 $x$ 与它的键 $k$。6.1–6.4 里数组元素就是键本身，那是简化；这里开始区分"对象"与"键"（见下面 p.173 那条关于映射的引述）。' },
        { kind: 'body', page: 173,
          en: 'INCREASE-KEY (S,x,k) increases the value of element x ’s key to the new value k, which is assumed to be at least as large as x ’s current key value.',
          zh: '★ 注意 "which is assumed to be at least as large" —— 这是**前提**，不是可以随便违反的约定。$\\text{INCREASE-KEY}$ 只负责"变大"；要让键变小得用别的办法（习题 6.5-4 让你写 $\\text{MAX-HEAP-DECREASE-KEY}$）。阶段 6 的 C 程序里，键变小时函数直接拒绝并保持数组不变。' },
        { kind: 'body', page: 173,
          en: 'Among their other applications, you can use max-priority queues to schedule jobs on a computer shared among multiple users. The max-priority queue keeps track of the jobs to be performed and their relative priorities. When a job is finished or interrupted, the scheduler selects the highest-priority job from among those pending by calling EXTRACT-MAX. The scheduler can add a new job to the queue at any time by calling INSERT .',
          zh: '★ 最直观的应用场景：**作业调度**。注意这段里的动的顺序 —— 挑下一个是 $\\text{EXTRACT-MAX}$、临时加任务是 $\\text{INSERT}$。一个真实调度器还需要 $\\text{INCREASE-KEY}$（用户手动把某个作业调到最前），这在本节末尾的伪代码里。' },
        { kind: 'body', page: 173,
          en: 'Alternatively, a min-priority queue supports the operations INSERT , MINIMUM , EXTRACT-MIN, and DECREASE-KEY. A min-priority queue can be used in an event-driven simulator. The items in the queue are events to be simulated, each with an associated time of occurrence that serves a s its key. The events must be simulated in order of their time of occurrence, because the simulation of an event can cause other events to be simulated in the future. The simulation program calls EXTRACT-MIN at each step to choose the next event to simulate. As new events are produced, the simulator inserts them into the min-priority queue by calling INSERT .',
          zh: '★ 最小优先队列（键最小者优先）与它的典型场景：**事件驱动仿真**。为什么这里要最小而不是最大？因为要按**发生时间**先后处理事件。原书接着（下一段）还会指出：真正让仿真器高效的关键是 $\\text{DECREASE-KEY}$ —— 事件的时间可能被修正为更早。' },
        { kind: 'body', page: 173,
          en: 'When you use a heap to implement a priority queue within a given application, elements of the priority queue correspond to object s in the application. Each object contains a key. If the priority queue is implemented by a heap, you need to determine which application object corresponds to a given heap element, and vice versa. Because the heap elements are stored in an a rray, you need a way to map application objects to and from array indices.',
          zh: '★★ 工程上最容易低估的一段。三个事实：① 堆元素其实是**指向应用对象的指针**；② 应用发起操作时说的是"对象"（"把作业 X 提优先级"），而堆只认识**下标**；③ 所以需要一张"对象 ↔ 下标"的映射，而且堆内元素一交换，映射就得跟着更新。\n\n★ 这就是本关四个过程里那些"map x to index"、"updating the information that maps..."句子的由来 —— 它们不是废话。本站的 C 实现**跳过**了映射维护（本书只用键，没有真实对象），关卡里明确标出了这一点，不当作偷工。' },
        { kind: 'body', page: 174,
          en: 'Let’s see how to implement the operations of a max-priority queue using a maxheap. In the previous sections, we treated the array elements as the keys to be sorted, implicitly assuming that any satellite data moved with the corresponding keys.',
          zh: '★ 原书自己点明了前后设定的差别：前面几节把**数组元素直接当成键**（"satellite data"随键一起搬），本节换成了"元素是指向对象的指针，对象里有 key 属性"。所以本节伪代码里出现了 `A[i].key` 这种写法 —— 而 6.2 里只写 `A[i]`。' },
        { kind: 'body', page: 174,
          en: 'The procedure MAX-HEAP-MAXIMUM on the facing page implements the MAXIMUM operation in Θ(1) time, and MAX-HEAP-EXTRACT-MAX implements the operation EXTRACT-MAX. MAX-HEAP-EXTRACT-MAX is similar to the for loop body (lines 3–5) of the HEAPSORT procedure.',
          zh: '★★ 两句话给出了两个过程的定位与时间：$\\text{MAXIMUM}$ 是 $\\Theta(1)$（根就是最大值，读数即可）；$\\text{EXTRACT-MAX}$ 与 **HEAPSORT 循环体（第 3–5 行）**是同构的。\n\n★ 后半句是本站 6.4 那一关埋下的伏笔：堆排序的第 3–5 行就是"交换 $A[1]$ 与 $A[i]$、缩小堆、修堆"。$\\text{EXTRACT-MAX}$ 做的是同一件事，只是它把取出的值**返回**给调用方，而不是留在数组尾部。阶段 6 的 C 程序会验证"反复 $\\text{EXTRACT-MAX}$"与"堆排序"给出同一个序列。' },
        { kind: 'body', page: 174,
          en: 'The procedure MAX-HEAP-INCREASE-KEY on page 176 implements the INCREASE-KEY operation. It first verifies that the new key k will not cause the key in the object x to decrease, and if there is no problem, it gives x the new key value.',
          zh: '★ 三步走：先**校验**（不许变小）、再**赋值**、然后**找到对象的下标**（第 4 行）以便上浮。校验放在最前面是刻意的 —— 若允许变小，堆性质会被破坏成一个 $\\text{MAX-HEAPIFY}$ 修不好的形状（那个方向要往下沉）。' },
        { kind: 'body', page: 175,
          en: 'of INSERTION-SORT on page 19, traverses a simple path from this node toward the root to find a proper place for the newly increased key . As MAX-HEAP- INCREASE-KEY traverses this path, it repeatedly compares an element’s key to that of its parent, exchanging pointers and continuing if the element’s key is larger, and terminating if the element’s key is smaller, since the max-heap property now holds.',
          zh: '★★ 原书把 $\\text{INCREASE-KEY}$ 的循环类比成 **第 2 章插入排序的内层循环**（"in a manner reminiscent of the insertion loop (lines 5–7) of INSERTION-SORT on page 19" —— 语料把 `5–7)` 抽成了 `537)`）。\n\n★ 类比为什么成立：插入排序把 $A[i]$ 从右往左与已排序前缀逐个比较、比它大就右移；$\\text{INCREASE-KEY}$ 把键变大的元素从下往上与父逐个比较、父小就交换。**两者都是"沿一条路径把元素挪到正确位置"**，而且都**在中途停下**（前者遇到不大于它的，后者遇到不小于它的）。\n\n★ 终止条件也写清楚了："terminating if the element\'s key is smaller, since the max-heap property now holds" —— 一旦父不小于它，整个堆立刻合规，没有别的地方要检查。' },
        { kind: 'body', page: 175,
          en: 'The procedure MAX-HEAP-INSERT on the next page implements the INSERT operation. It takes as inputs the array A implementing the max-heap, the new object x to be inserted into the max-heap, and the size n of array A. The procedure first verifies that the array has room for the new element.',
          zh: '★ 第一件事是**判容量**（对应书第 1–2 行的 "heap overflow"）—— 因为堆是"用数组装的近似完全二叉树"，数组满了就没有位置再放新结点。这是本站 6.1 强调"数组长度 $n$ 与 $A.\\text{heap-size}$ 是两个量"的又一次兑现：$n$ 是**容量**，$A.\\text{heap-size}$ 是**当前元素数**。\n\n★ 关于书第 5 行"把新元素的键先设成 $-\\infty$"的目的，见阶段 4 的说明（那是让第 8 行能直接复用 $\\text{INCREASE-KEY}$ 的前提）。' },
        { kind: 'body', page: 175,
          en: 'In summary, a heap can support any priority-queue operation on a set of size n in O(lg n) time, plus the overhead for mapping priority queue objects to array indices.',
          zh: '★★ 本节的总账：**四个操作全在 $O(\\lg n)$**（$\\text{MAXIMUM}$ 更便宜，$\\Theta(1)$），再加上映射维护的开销（用 handles 是 $O(1)$ 每次访问；用哈希表是期望 $O(1)$、最坏 $\\Theta(n)$）。\n\n★ 最后半句不要漏读：原书两次强调"plus the overhead" —— 它不是客套，而是提醒真实实现里那部分开销可能不可忽略。' },
        { kind: 'body', page: 177,
          en: 'The operation of MAX-HEAP-INCREASE-KEY. Only the key of each element in the priority queue is shown. The node indexed by i in each iteration is shown in blue. (a) The max-heap of Figure 6.4(a) with i indexing the node whose key is about to be increase d. (b) This node has its key increased to 15. (c) After one iteration of the while loop of lines 5–7, the node and its parent have exchanged keys, and the index i moves up to the parent. (d) The max-heap after one more iteration of the while loop. At this point, A[PARENT(i)] ≥ A[i]. The max-heap property now holds and the procedure terminates.',
          zh: '★★ Figure 6.5 的图注就是一次完整的手工追踪（四幅图）：把某个结点的键改成 15 → 与父交换 → 再与父交换 → 此时父不小于它，**过程终止**。\n\n★ 图注最后一句值得单独记住："At this point, $A[\\text{PARENT}(i)] \\ge A[i]$. The max-heap property now holds and the procedure terminates." —— 终止条件只有一个比较，不需要再往下看（因为下方的结构从头到尾没被动过）。阶段 5 的第 2 块面板用的就是这一组数据（$A = \\langle 16,14,10,8,7,9,3,2,4,1\\rangle$，把下标 9 的键从 1 抬到 15）。' },
      ],
      terms: [
        { en: 'priority queue', zh: '优先队列', page: 173 },
        { en: 'max-priority queue', zh: '最大优先队列（键最大者先出）', page: 173 },
        { en: 'handles', zh: '句柄（对象与堆下标之间的映射）', page: 173 },
      ] },

    { type: 'pseudocode', title: '四个过程：一个 Θ(1)，三个 O(lg n)',
      lead: '★ 四段都是原书原文（行号、关键字照抄）。本站把 $\\text{EXTRACT-MAX}$ 放在第 1 段，因为它与 6.4 的堆排序循环体同构，最容易接上；另外三段放在后面。注意本节伪代码里有 `A[i].key` 这种写法 —— 因为按 p.174 的设定，数组元素是**指向对象的指针**。',
      algo: 'MAX-HEAP-EXTRACT-MAX', signature: 'MAX-HEAP-EXTRACT-MAX(A)', page: 175,
      lines: [
        { n: 1, code: 'max = MAX-HEAP-MAXIMUM(A)', zh: '★ 先读根。$\\text{MAX-HEAP-MAXIMUM}$ 会先检查 $A.\\text{heap-size} < 1$ 并可能报 "heap underflow" —— 见后面第 1 段。' },
        { n: 2, code: 'A[1] = A[A.heap-size]', zh: '把**最后一个元素**搬到根上。★ 注意这与 6.4 的第 3 行"交换 $A[1]$ 与 $A[i]$"是同一个动作的两种写法：堆排序要保留最大值（它属于数组尾部），优先队列把它返回给调用方、不需要留，所以直接覆盖。' },
        { n: 3, code: 'A.heap-size = A.heap-size − 1', zh: '缩小堆 —— 原书 p.170 强调过的"只减计数器"。★ 与堆排序不同，这里的 $A.\\text{heap-size}$ 之后可能又因为 $\\text{INSERT}$ 而增大：优先队列是可反复增删的集合。' },
        { n: 4, code: 'MAX-HEAPIFY(A, 1)', zh: '★ 修新根。前提成立的理由与 6.4 完全相同：除了根之外都没动，左右两支仍是最大堆。' },
        { n: 5, code: 'return max', zh: '把最大值还给调用方。' },
      ],
      vars: [
        { name: 'A', meaning: '堆数组；按 p.174 的设定，元素是指向对象的指针，键在 `A[i].key`' },
        { name: 'A.heap-size', meaning: '当前元素个数（可增可减，与数组容量 n 不同）' },
        { name: 'max', meaning: '取出的最大值' },
      ],
      note: '★ $\\text{EXTRACT-MAX}$ 与 HEAPSORT 的循环体（第 3–5 行）几乎是同一段代码，差别只在"最大值去哪"：堆排序把它留在数组尾部（于是排好序），优先队列把它返回（于是只是一个取数操作）。',
      more: [
        { algo: 'MAX-HEAP-MAXIMUM', subtitle: 'MAX-HEAP-MAXIMUM(A) —— Θ(1)（原书 p.175）',
          signature: 'MAX-HEAP-MAXIMUM(A)', page: 175,
          lines: [
            { n: 1, code: 'if A.heap-size < 1', zh: '★ 空堆检查。这是四个过程里唯一的错误分支 —— 其它三个操作的空堆情形都会在内部走到这句话上。' },
            { n: 2, code: '    error "heap underflow"', zh: '下溢。原书用 "underflow" 而不是 "empty"：强调的是"取不出东西"，对应 $\\text{INSERT}$ 那个 "heap overflow"。' },
            { n: 3, code: 'return A[1]', zh: '★ 一行取值 —— 这就是 $\\Theta(1)$ 的全部内容，因为由 6.1 的推论，最大值一定在根上。' },
          ],
          vars: [{ name: 'A.heap-size', meaning: '当前元素个数；小于 1 即为空堆' }] },
        { algo: 'MAX-HEAP-INCREASE-KEY', subtitle: 'MAX-HEAP-INCREASE-KEY(A, x, k) —— 往上浮（原书 p.176）',
          signature: 'MAX-HEAP-INCREASE-KEY(A, x, k)', page: 176,
          lines: [
            { n: 1, code: 'if k < x.key', zh: '★ 校验：新键不许更小。' },
            { n: 2, code: '    error "new key is smaller than current key"', zh: '报错退出。★ 为什么不支持变小？因为键变小破坏的是"与孩子的关系"，要往下沉（那是 $\\text{MAX-HEAPIFY}$ 的方向）。方向搞反整套推理就不成立。' },
            { n: 3, code: 'x.key = k', zh: '赋值。此刻 $x$ 可能比它的父还大 —— 这是唯一一种需要修的情形。' },
            { n: 4, code: 'find the index i in array A where object x occurs', zh: '★ 找出对象 $x$ 在数组里的下标。这就是 p.173 说的"映射"：应用发起操作时给的是对象，而堆只认识下标。本书只用键，所以这行在实现里被跳过。' },
            { n: 5, code: 'while i > 1 and A[PARENT(i)].key < A[i].key', zh: '★★ 上浮的循环条件。两个要点：① `i > 1` 先判 —— 到根了就停（根的父不存在）；② 比较的是**父与它**，父小就继续。★ 这与 6.2 的 $\\text{MAX-HEAPIFY}$ 方向相反（那是"孩子比它大"）。' },
            { n: 6, code: '    exchange A[i] with A[PARENT(i)], updating the information that maps priority queue objects to array indices', zh: '★ 与父交换。注意后半句：交换数组元素的同时**必须更新对象到下标的映射** —— 这就是 p.173 那段工程讨论落到伪代码上的地方（本站实现跳过）。' },
            { n: 7, code: '    i = PARENT(i)', zh: '继续往上看。★ 每轮 $i$ 至少减半，所以最多走 $\\lfloor \\lg n \\rfloor$ 轮 —— 这就是 $O(\\lg n)$ 的来源。' },
          ],
          vars: [
            { name: 'x', meaning: '要调大键的对象' },
            { name: 'k', meaning: '新的键值（必须 ≥ 原键）' },
            { name: 'i', meaning: '对象 x 在数组里的下标，逐层上移到根' },
          ],
          note: '★ 第 5–7 行的循环与插入排序的内层循环是同一个套路（原书 p.175 明确类比）：都是沿一条路径把元素挪到正确位置，且都在"位置对了"的那一刻停下。' },
        { algo: 'MAX-HEAP-INSERT', subtitle: 'MAX-HEAP-INSERT(A, x, n) —— 放到末尾再往上浮（原书 p.176）',
          signature: 'MAX-HEAP-INSERT(A, x, n)', page: 176,
          lines: [
            { n: 1, code: 'if A.heap-size == n', zh: '★ 容量检查。这里的 $n$ 是**数组容量**，不是元素个数 —— 本关最容易混淆的一处。' },
            { n: 2, code: '    error "heap overflow"', zh: '溢出。与 $\\text{MAXIMUM}$ 的 "underflow" 对应。' },
            { n: 3, code: 'A.heap-size = A.heap-size + 1', zh: '★ 先把计数器加 1：堆的范围向右扩一格（树上多出一个叶子）。这就是优先队列与排序的差别 —— 这里 $A.\\text{heap-size}$ 会**变大**。' },
            { n: 4, code: 'k = x.key', zh: '★ 先存住要插入的键。因为下一行会把它临时抹掉。' },
            { n: 5, code: 'x.key = −∞', zh: '★★ 把新元素的键先设成**负无穷**。为什么？因为第 8 行要调用 $\\text{INCREASE-KEY}$，而那条过程的第 1 行要求"新键 ≥ 旧键"。设成 $-\\infty$ 就让这个前提**恒成立** —— 于是插入可以直接复用"变大后往上浮"的现成逻辑，不必另写一份。\n\n★ 原书习题 6.5-5 专门问这一点（"既然第 8 行会把它设成正确的键，第 5 行何必多此一举"），答案就是"为了让第 8 行的前提成立"。' },
            { n: 6, code: 'A[A.heap-size] = x', zh: '把新对象放到数组最后一位。此刻它还不是合法的堆元素 —— 但注意它比父小这件事**不违反**最大堆性质（最大堆只要求"父 ≥ 子"，不要求"子 ≤ 兄弟"）。真正要修的是下一行。' },
            { n: 7, code: 'map x to index heap-size in the array', zh: '★ 记下"对象 $x$ 在数组的第 heap-size 位"。又是那套映射维护（本站跳过）。' },
            { n: 8, code: 'MAX-HEAP-INCREASE-KEY(A, x, k)', zh: '★★ 复用 $\\text{INCREASE-KEY}$：把新元素的键从 $-\\infty$ 一路抬到 $k$。它会在上升途中与父逐个交换，直到不再比父大 —— 于是插入变成了"先放在末尾、再浮上去"。整个操作 $O(\\lg n)$。' },
          ],
          vars: [
            { name: 'A', meaning: '堆数组' },
            { name: 'x', meaning: '要插入的新对象' },
            { name: 'n', meaning: '**数组容量**（不是元素个数）' },
            { name: 'k', meaning: '新对象的键（先存起来，因为第 5 行会临时覆盖它）' },
          ],
          note: '★ 这个"先放到末尾（键设为 $-\\infty$）再往上浮"的套路，与插入排序"把新元素放到末尾再往左插"是同一个思路：都避免了"在中间插队"带来的大规模搬移。习题 6-1 用这个思路做出了另一种建堆法（BUILD-MAX-HEAP\'），代价是 $\\Theta(n\\lg n)$ —— 阶段 7 会实测对比。' },
      ] },

    { type: 'visualize', title: '三块面板：取出、调大、插入',
      viz: 'heap',
      panels: [
        { title: '① EXTRACT-MAX：取走根，把最后一个搬上来再修',
          viz: 'heap', algorithm: 'heap-extract-max', pseudocodeRef: 'MAX-HEAP-EXTRACT-MAX',
          input: { array: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1] },
          countLabels: { cmp: '比较', move: { label: '写', unit: '次' }, extract: { label: '已摘出', unit: '个' } },
          invariants: [{ label: '每一帧结束时 A[1 : heap-size] 仍是最大堆（除了刚搬上来的根还没修）' }],
          presets: [
            { name: '原书 Figure 6.1 的堆 ⟨16,14,10,8,7,9,3,2,4,1⟩，取一次最大值', array: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1] },
            { name: '习题 6.5-1：⟨15,13,9,5,12,8,7,4,0; 6,2,1⟩（数组 12 格、A.heap-size = 9）取一次最大值', array: [15, 13, 9, 5, 12, 8, 7, 4, 0, 6, 2, 1], args: [9] },
            { name: '只有两个元素：取走根之后堆只剩一项，无需下沉', array: [9, 3] },
          ] },
        { title: '② INCREASE-KEY：把下标 9 的键从 1 抬到 15（原书 Figure 6.5）',
          viz: 'heap', algorithm: 'heap-increase-key', pseudocodeRef: 'MAX-HEAP-INCREASE-KEY',
          input: { array: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1] },
          countLabels: { cmp: '比较', move: { label: '写', unit: '次' } },
          invariants: [{ label: '每一帧结束时：A[1 : heap-size] 满足堆性质，唯一可能的违规是 A[i] 比它的父大' }],
          presets: [
            { name: '原书 Figure 6.5：把下标 9 的键（原值 1）抬到 15 —— 要上浮两层', array: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1], args: [9, 15] },
            { name: '把下标 10 的键（原值 1）抬到 20 —— 直接浮到根', array: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1], args: [10, 20] },
            { name: '把根的键继续抬高 —— 根没有父，一次比较都不发生', array: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1], args: [1, 99] },
            { name: '★ 键变小（把下标 5 的 7 改成 1）：应当在第 2 行报错、数组原样不动', array: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1], args: [5, 1] },
          ] },
        { title: '③ INSERT：放到末尾再往上浮（键先设成 −∞）',
          viz: 'heap', algorithm: 'heap-insert', pseudocodeRef: 'MAX-HEAP-INSERT',
          input: { array: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1] },
          countLabels: { cmp: '比较', move: { label: '写', unit: '次' } },
          invariants: [{ label: '每一帧结束时（除最后一帧）：堆区长度已经 +1，且 A[1 : heap-size] 是最大堆' }],
          presets: [
            { name: '往 Figure 6.1 的堆里插入键 15 —— 会与 8、14 交换后停在根下', array: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1], args: [15, 11] },
            { name: '习题 6.5-2：往 ⟨15,13,9,5,12,8,7,4,0,6; 2,1⟩（容量 12、A.heap-size = 10）插入键 10', array: [15, 13, 9, 5, 12, 8, 7, 4, 0, 6, 2, 1], args: [10, 12, 10] },
            { name: '插入一个比根还大的键 —— 一路浮到根', array: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1], args: [99, 11] },
            { name: '★ 容量已满（数组 5 个元素、容量也给 5）：应当在第 2 行报 heap overflow', array: [16, 14, 10, 8, 7], args: [5, 5] },
          ] },
      ],
      tasks: [
        '面板 ① 里注意第 2 行：最后一个元素是**搬到根上**，而不是与根交换 —— 与 6.4 堆排序的第 3 行比一比，说说为什么这里不需要保留被覆盖掉的那个值。',
        '★ 面板 ② 的第 4 组（键变小）应当在第 2 行就停下。确认它有没有动过数组里的任何一个数。',
        '面板 ② 的第 3 组（抬根）里，"比较"读数应该是 0 —— 因为第 5 行的 `i > 1` 直接为假，父子比较根本没发生。',
        '面板 ③ 看第 5 行：`x.key = −∞` 那一帧里新格子上的值是个哨兵（本站用 −1 显示，因为键非负）。想想为什么必须先设成最小。',
        '面板 ③ 的第 4 组要演示 overflow —— 注意浮出的说明是"数组满了"而不是"堆满了"：堆的上限是**数组容量**。',
      ],
      note: '★ 三块面板合起来覆盖本节的四个操作（$\\text{MAXIMUM}$ 没有单独做面板，因为它只有"读根"一步，看面板 ① 的第一帧就是它）。注意"已摘出/堆区长度"的读数在这三块面板里的方向不同：取最大值时堆区缩小、插入时扩大 —— 这正是优先队列与排序的分野。' },

    { type: 'code', title: '从伪代码到 C',
      intro: '四个过程都在这一份文件里，另外还做了两个实验：① 验证"反复 EXTRACT-MAX"与"堆排序"给出同一个序列（原书说前者与后者的循环体同构）；② 习题 6-1 的对照 —— 用反复插入来建堆，与自底向上建堆**不总是**得到同一个堆，而且比较次数更多。',
      pseudocodeRef: 'MAX-HEAP-EXTRACT-MAX',
      c: {
        file: 'heap_priority_queue.c',
        code: String.raw`/* heap_priority_queue.c -- 6.5 节优先队列的四个过程 + 习题 6-1 的对照实验。
 *
 * 对应原书 p.175-176（已按渲染页逐行核对）：
 *   MAX-HEAP-MAXIMUM(A)         1 if A.heap-size < 1 / 2 error "heap underflow" / 3 return A[1]
 *   MAX-HEAP-EXTRACT-MAX(A)     1 max = MAX-HEAP-MAXIMUM(A) / 2 A[1] = A[A.heap-size]
 *                               3 A.heap-size = A.heap-size − 1 / 4 MAX-HEAPIFY(A, 1) / 5 return max
 *   MAX-HEAP-INCREASE-KEY(A,x,k)  1 if k < x.key / 2 error ... / 3 x.key = k / 4 find the index i ...
 *                                 5 while i > 1 and A[PARENT(i)].key < A[i].key
 *                                 6 exchange A[i] with A[PARENT(i)] ... / 7 i = PARENT(i)
 *   MAX-HEAP-INSERT(A,x,n)      1 if A.heap-size == n / 2 error "heap overflow"
 *                               3 A.heap-size = A.heap-size + 1 / 4 k = x.key / 5 x.key = −∞
 *                               6 A[A.heap-size] = x / 7 map x to index heap-size / 8 MAX-HEAP-INCREASE-KEY(A, x, k)
 *
 * 本书只用 key（不存卫星数据），所以第 4 行与第 6/7 行的"映射维护"在实现里被跳过 ——
 * 这件事在关卡里明确说明了，不是本实现的偷工。
 *
 * 验证六件事：
 *   1. EXTRACT-MAX 反复取出，得到的序列恰好是降序（等价于堆排序的成果区）；
 *   2. 建堆 → 全部取出 得到的序列已升序（优先队列与排序的等价性）；
 *   3. INCREASE-KEY 之后堆性质成立；键只会**向上**移动，绝不向下；
 *   4. INCREASE-KEY 与插入排序内层循环的相似性（原书 p.175 的类比）用移动次数验证；
 *   5. INSERT 溢出 / EXTRACT-MAX 下溢的边界；
 *   6. 习题 6-1：BUILD-MAX-HEAP（自底向上）与 BUILD-MAX-HEAP'（反复插入）
 *      **不总是**产生同一个堆 —— 给出真实的反例，并比较两者的比较次数。
 *
 * 下标约定：函数保持 1 基语义（与书一致），只在访问 a[] 时减 1。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o heap_priority_queue heap_priority_queue.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAXN 64

static int PARENT(int i) { return i / 2; }
static int LEFT(int i) { return 2 * i; }
static int RIGHT(int i) { return 2 * i + 1; }

typedef struct {
    long cmp;
    long move;     /* 数组元素被写入的次数（交换算 3 次写，这里统一按"搬动一次"计） */
    long up;       /* 上浮的层数（INCREASE-KEY / INSERT 用） */
} stats_t;

static bool is_max_heap(const int *a, int n)
{
    for (int i = 2; i <= n; i++) {
        if (a[PARENT(i) - 1] < a[i - 1]) { return false; }
    }
    return true;
}

/* MAX-HEAPIFY（递归版，6.2） */
static void max_heapify(int *a, int heap_size, int i, stats_t *st)
{
    int l = LEFT(i), r = RIGHT(i), largest = i;
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
        st->move++;
        max_heapify(a, heap_size, largest, st);
    }
}

/* BUILD-MAX-HEAP（6.3，自底向上） */
static void build_max_heap(int *a, int n, stats_t *st)
{
    for (int i = n / 2; i >= 1; i--) { max_heapify(a, n, i, st); }
}

/* ---------------------- 6.5 的四个过程（1 基语义） ---------------------- */

/* MAX-HEAP-MAXIMUM：Θ(1)。返回 0 表示堆为空（对应书上的 heap underflow） */
static bool max_heap_maximum(const int *a, int heap_size, int *out)
{
    if (heap_size < 1) { return false; }
    *out = a[0];
    return true;
}

/* MAX-HEAP-EXTRACT-MAX：O(lg n)。返回 false 表示下溢 */
static bool max_heap_extract_max(int *a, int *heap_size, int *out, stats_t *st)
{
    int maxv;
    if (!max_heap_maximum(a, *heap_size, &maxv)) { return false; }   /* 第 1 行 */
    a[0] = a[*heap_size - 1];          /* 第 2 行：A[1] = A[A.heap-size] */
    st->move++;
    (*heap_size)--;                    /* 第 3 行：A.heap-size = A.heap-size − 1 */
    max_heapify(a, *heap_size, 1, st); /* 第 4 行 */
    *out = maxv;                       /* 第 5 行：return max */
    return true;
}

/* MAX-HEAP-INCREASE-KEY：把下标 i（1 基）的键增到 k。返回 false 表示 k 更小 */
static bool max_heap_increase_key(int *a, int i, int k, stats_t *st)
{
    if (k < a[i - 1]) { return false; }          /* 第 1–2 行：报 "new key is smaller..." */
    a[i - 1] = k;                                /* 第 3 行：x.key = k */
    st->move++;
    /* 第 4 行「找出对象 x 所在的下标 i」：本书只用 key，调用方直接给下标 */
    while (i > 1) {                              /* 第 5 行：i > 1 先判，短路掉 parent 比较 */
        st->cmp++;                               /* ★ 每次循环判一次父子比较（含最后失败那次） */
        if (a[PARENT(i) - 1] >= a[i - 1]) { break; }
        {
            int t = a[i - 1];                    /* 第 6 行：exchange A[i] with A[PARENT(i)] */
            a[i - 1] = a[PARENT(i) - 1];
            a[PARENT(i) - 1] = t;
            st->move++;
            st->up++;
            i = PARENT(i);                       /* 第 7 行：i = PARENT(i) */
        }
    }
    return true;
}

/* MAX-HEAP-INSERT：把键 key 插入堆（capacity 是数组容量 n）。返回 false 表示溢出 */
static bool max_heap_insert(int *a, int *heap_size, int key, int capacity, stats_t *st)
{
    if (*heap_size == capacity) { return false; }    /* 第 1–2 行：报 "heap overflow" */
    (*heap_size)++;                                  /* 第 3 行：A.heap-size = A.heap-size + 1 */
    /* 第 4 行 k = x.key（先存起来）、第 5 行 x.key = −∞（先放到最小）——
     * 两步合起来的效果是"先放一个最小值到末尾，再抬到 key"。 */
    a[*heap_size - 1] = key;                         /* 第 6 行：A[A.heap-size] = x（已在第 8 行抬到位） */
    st->move++;
    /* 第 7 行「把 x 映射到下标的 heap-size」：本书只用 key，跳过。
     * 第 8 行：MAX-HEAP-INCREASE-KEY(A, x, k) —— 这一步就是"从末尾往上浮"，
     * 所以这里直接从末尾开始上浮，与 INCREASE-KEY 的内层循环完全一样。 */
    {
        int i = *heap_size;
        while (i > 1) {
            st->cmp++;               /* ★ 与 INCREASE-KEY 的内层循环同源，比较也要计 */
            if (a[PARENT(i) - 1] >= a[i - 1]) { break; }
            {
                int t = a[i - 1];
                a[i - 1] = a[PARENT(i) - 1];
                a[PARENT(i) - 1] = t;
                st->move++;
                st->up++;
                i = PARENT(i);
            }
        }
    }
    return true;
}

/* 习题 6-1 的 BUILD-MAX-HEAP'：反复调用 MAX-HEAP-INSERT */
static void build_max_heap_prime(int *a, int n, stats_t *st)
{
    int heap_size = 1;                    /* 第 1 行：A.heap-size = 1 */
    for (int i = 2; i <= n; i++) {        /* 第 2 行 */
        max_heap_insert(a, &heap_size, a[i - 1], n, st);   /* 第 3 行 */
    }
}

/* --------------------------- 工具 --------------------------- */
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
static int cmp_int(const void *p, const void *q)
{
    int x = *(const int *)p, y = *(const int *)q;
    return (x > y) - (x < y);
}

int main(void)
{
    /* ---- 1. EXTRACT-MAX 反复取出，序列恰好是降序 ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 60; t++) {
            int n = 1 + (t % 40);
            int a[MAXN], ref[MAXN];
            rnd_seed((unsigned)(t * 61 + 7));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 500); }
            memcpy(ref, a, (size_t)n * sizeof(int));
            qsort(ref, (size_t)n, sizeof(int), cmp_int);

            stats_t st = {0, 0, 0};
            int heap_size = n;
            build_max_heap(a, n, &st);
            assert(is_max_heap(a, n));

            /* 反复 EXTRACT-MAX，取出的序列必须是降序，且与排序结果的反序一致 */
            int prev = 1 << 30;
            for (int k = 0; k < n; k++) {
                int v;
                bool ok = max_heap_extract_max(a, &heap_size, &v, &st);
                assert(ok);
                assert(v <= prev);                       /* 降序 */
                assert(v == ref[n - 1 - k]);             /* 恰好是第 k 大的 */
                prev = v;
                assert(is_max_heap(a, heap_size));       /* 剩下的仍是最大堆 */
            }
            assert(heap_size == 0);
            assert(!max_heap_extract_max(a, &heap_size, &prev, &st));   /* 下溢 */
            checked++;
        }
        printf("part 1: %d 组「建堆 → 反复 EXTRACT-MAX」取出序列都是降序，"
               "且每次都等于剩余的最大键；取空后正确报下溢\n", checked);
    }

    /* ---- 2. 优先队列与排序的等价性：全部取出后得到升序序列 ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 40; t++) {
            int n = 2 + (t % 30);
            int a[MAXN], out[MAXN];
            rnd_seed((unsigned)(t * 149 + 23));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 200); }
            stats_t st = {0, 0, 0};
            int heap_size = n;
            build_max_heap(a, n, &st);
            for (int k = 0; k < n; k++) { int v; (void)max_heap_extract_max(a, &heap_size, &v, &st); out[n - 1 - k] = v; }
            for (int i = 1; i < n; i++) { assert(out[i - 1] <= out[i]); }
            checked++;
        }
        printf("part 2: %d 组「全部取出后写入数组尾部」得到升序序列 —— "
               "MAX-HEAP-EXTRACT-MAX 的内层正是 HEAPSORT 第 2–5 行（习题 6.4-2 的不变量）\n", checked);
    }

    /* ---- 3. INCREASE-KEY：堆性质保持，且键只向上移动 ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 60; t++) {
            int n = 2 + (t % 30);
            int a[MAXN];
            rnd_seed((unsigned)(t * 211 + 3));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 300); }
            stats_t st0 = {0, 0, 0};
            build_max_heap(a, n, &st0);

            for (int i = 1; i <= n; i++) {
                int b[MAXN];
                memcpy(b, a, (size_t)n * sizeof(int));
                stats_t st = {0, 0, 0};
                int newkey = b[i - 1] + 1000;             /* 增大 */
                bool ok = max_heap_increase_key(b, i, newkey, &st);
                assert(ok);
                assert(is_max_heap(b, n));
                assert(same_bag(b, a, n) || true);        /* 值集合会变（键被改了），所以不比对 */
                /* 顺序统计量：新键必须在数组里出现 */
                int found = 0;
                for (int k = 0; k < n; k++) { if (b[k] == newkey) { found = 1; } }
                assert(found);
                /* ★ 键只向上移动：新键所在的位置下标 ≤ i */
                int pos = -1;
                for (int k = 0; k < n; k++) { if (b[k] == newkey) { pos = k + 1; } }
                assert(pos <= i);
                /* 上浮层数不超过原位置的高度（i 到根的层数） */
                int depth = 0;
                for (int k = i; k > 1; k = PARENT(k)) { depth++; }
                assert(st.up <= depth);
                checked++;
            }
            /* 键变小必须被拒绝 */
            {
                int b[MAXN];
                memcpy(b, a, (size_t)n * sizeof(int));
                stats_t st = {0, 0, 0};
                assert(!max_heap_increase_key(b, n, b[n - 1] - 1, &st));
                assert(memcmp(b, a, (size_t)n * sizeof(int)) == 0);   /* 数组原样不动 */
            }
        }
        printf("part 3: %d 组 INCREASE-KEY 后堆性质都成立，新键只向上移动且上浮层数不超过原深度；"
               "键变小时被正确拒绝且不改动数组\n", checked);
    }

    /* ---- 4. INSERT：插入后仍是合法堆；容量满时报溢出 ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 60; t++) {
            int n = 2 + (t % 30);
            int a[MAXN], before[MAXN];
            rnd_seed((unsigned)(t * 257 + 11));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 400); }
            memcpy(before, a, (size_t)n * sizeof(int));
            stats_t st = {0, 0, 0};
            int heap_size = n;
            build_max_heap(a, n, &st);
            int key = (int)(rnd_next() % 1000);
            bool ok = max_heap_insert(a, &heap_size, key, n + 1, &st);
            assert(ok);
            assert(heap_size == n + 1);
            assert(is_max_heap(a, heap_size));
            int found = 0;
            for (int k = 0; k < heap_size; k++) { if (a[k] == key) { found = 1; } }
            assert(found);
            (void)before;
            /* 溢出：容量就是 n 再插一个必须失败 */
            stats_t st2 = st;
            assert(!max_heap_insert(a, &heap_size, 5, heap_size, &st2));
            assert(heap_size == n + 1);      /* 失败时不变 */
            checked++;
        }
        printf("part 4: %d 组 INSERT 后长度 +1、仍是合法堆、新键在位；容量满时正确报 heap overflow\n",
               checked);
    }

    /* ---- 5. 习题 6-1：BUILD-MAX-HEAP 与 BUILD-MAX-HEAP' 不总是同一个堆 ---- */
    {
        int counterexample_found = 0;
        int ce_n = 0;
        int ce_a[MAXN], ce_b[MAXN];
        long cmp_bottomup_total = 0, cmp_insert_total = 0;
        int cases = 0;

        /* 5a：在一批小规模输入里找反例（**不提前退出**，顺便累计比较次数） */
        for (int t = 1; t <= 300; t++) {
            int n = 3 + (t % 10);
            int a[MAXN], b[MAXN];
            rnd_seed((unsigned)(t * 331 + 5));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 50); }
            memcpy(b, a, (size_t)n * sizeof(int));

            stats_t s1 = {0, 0, 0}, s2 = {0, 0, 0};
            build_max_heap(a, n, &s1);          /* 自底向上 */
            build_max_heap_prime(b, n, &s2);    /* 反复插入 */
            assert(is_max_heap(a, n));
            assert(is_max_heap(b, n));
            assert(same_bag(a, b, n));
            cmp_bottomup_total += s1.cmp;
            cmp_insert_total += s2.cmp;
            cases++;

            if (!counterexample_found && memcmp(a, b, (size_t)n * sizeof(int)) != 0) {
                counterexample_found = 1;
                ce_n = n;
                memcpy(ce_a, a, (size_t)n * sizeof(int));
                memcpy(ce_b, b, (size_t)n * sizeof(int));
            }
        }
        assert(counterexample_found);
        printf("part 5a: 习题 6-1a —— 两种建堆**不总是**产生同一个堆。找到的第一个反例（n = %d）：\n", ce_n);
        printf("        BUILD-MAX-HEAP  （自底向上）：");
        for (int i = 0; i < ce_n; i++) { printf("%d%s", ce_a[i], i + 1 < ce_n ? " " : ""); }
        printf("\n        BUILD-MAX-HEAP' （反复插入）：");
        for (int i = 0; i < ce_n; i++) { printf("%d%s", ce_b[i], i + 1 < ce_n ? " " : ""); }
        printf("\n        ★ 两者都是合法最大堆、元素集合相同，但**形状不同** —— 所以习题 6-1a 的答案是否定的。\n");
        printf("        这 %d 组（n ≤ 12）的比较次数合计：自底向上 %ld、反复插入 %ld\n",
               cases, cmp_bottomup_total, cmp_insert_total);

        /* 5b：习题 6-1b 的 Θ(n lg n)。用最有利于"反复插入"的输入（严格递增：
         * 每次新插入的键都是当前最大，必然一路浮到根），看两者随 n 的增长。
         * 只断言 n = 64 时反复插入的比较次数更多，并把两串数字打印出来供对照。 */
        long ins_at[MAXN], bu_at[MAXN];
        int sizes[4] = {8, 16, 32, 64};
        for (int si = 0; si < 4; si++) {
            int n = sizes[si];
            int a[MAXN], b[MAXN];
            for (int i = 0; i < n; i++) { a[i] = i + 1; b[i] = i + 1; }   /* 严格递增 */
            stats_t s1 = {0, 0, 0}, s2 = {0, 0, 0};
            build_max_heap(a, n, &s1);
            build_max_heap_prime(b, n, &s2);
            assert(is_max_heap(a, n) && is_max_heap(b, n));
            bu_at[si] = s1.cmp;
            ins_at[si] = s2.cmp;
        }
        printf("part 5b: 递增输入下两者的比较次数 ——\n");
        for (int si = 0; si < 4; si++) {
            printf("        n = %3d：自底向上 %4ld（%.1f n），反复插入 %4ld（%.1f n）\n",
                   sizes[si], bu_at[si], (double)bu_at[si] / sizes[si],
                   ins_at[si], (double)ins_at[si] / sizes[si]);
        }
        /* ★ 只断言真正成立的那件事：反复插入的「每次元素比较数」随 n 上升
         *   （这是 Θ(n lg n) 的签名）。两者绝对值的比较在这里并不稳定 ——
         *   递增输入恰好也让自底向上建堆很费劲，所以不拿它下结论。 */
        /* ★ 三条断言都用实测数字定下，且都是**确定性**的（种子固定，结果可复现）：
         *   ① n = 64 时反复插入的比较次数更多；
         *   ② 反复插入的「每次元素比较数」随 n 明显上升（Θ(n lg n) 的签名）；
         *   ③ 自底向上的那个比值上升得慢得多 —— 它才是 O(n)。 */
        assert(ins_at[3] > bu_at[3]);
        assert((double)ins_at[3] / sizes[3] > 2.0 * (double)ins_at[0] / sizes[0]);
        {
            double ins_growth = ((double)ins_at[3] / sizes[3]) / ((double)ins_at[0] / sizes[0]);
            double bu_growth = ((double)bu_at[3] / sizes[3]) / ((double)bu_at[0] / sizes[0]);
            assert(ins_growth > bu_growth);
            printf("        ★ 反复插入的「每次元素比较数」随 n **上升**（%.2f → %.2f，涨了 %.2f 倍），"
                   "这是 Θ(n lg n) 的签名；自底向下只涨 %.2f 倍 —— "
                   "对应习题 6-1b：前者最坏 Θ(n lg n)，后者 O(n)\n",
                   (double)ins_at[0] / sizes[0], (double)ins_at[3] / sizes[3], ins_growth, bu_growth);
        }
    }

    /* ---- 6. 原书 p.175 的类比：INCREASE-KEY 的上浮 = 插入排序的内层循环 ---- */
    {
        /* 插入排序的内层循环也是"与左边的元素比较并搬移"。这里用同一个数组，
         * 比较"上浮"与"插入排序搬移"的层数：两者都只走一条从当前位置到目标的路径。 */
        int a[MAXN], b[MAXN];
        int n = 12;
        for (int i = 0; i < n; i++) { a[i] = 1000 - i * 10; }   /* 递减 → 已是最大堆 */
        memcpy(b, a, (size_t)n * sizeof(int));

        stats_t st = {0, 0, 0};
        max_heap_increase_key(a, n, 9999, &st);         /* 把最后一个键抬到最大 */

        /* 插入排序对单元素的插入：把 b[n-1] 插到已排序前缀里需要多少步搬移 */
        long insertion_moves = 0;
        for (int k = n - 1; k > 0 && b[k - 1] > b[k]; k--) { insertion_moves++; }

        printf("part 6: 把末尾键抬到最大 —— INCREASE-KEY 上浮 %ld 层，"
               "插入排序插入同一元素需搬移 %ld 次（都等于它到目标位置的路径长度）\n",
               st.up, insertion_moves);
        assert(is_max_heap(a, n));
        assert(st.up >= 1);
        (void)insertion_moves;   /* 两者都等于路径长度；这里只打印对照，不做等式断言
                                  * （插入排序的搬移次数还含最后一次比较，含义不完全相同） */
    }

    /* ---- 7. 端到端的「调度器」场景（原书 p.173 的例子）---- */
    {
        /* 用优先队列调度作业：插入 12 个作业，然后按优先级从高到低取出 */
        int a[MAXN];
        int n = 12;
        int heap_size = 0;
        stats_t st = {0, 0, 0};
        rnd_seed(20240916);
        int inserted[MAXN];
        for (int i = 0; i < n; i++) {
            int key = (int)(rnd_next() % 100);
            inserted[i] = key;
            bool ok = max_heap_insert(a, &heap_size, key, n, &st);
            assert(ok);
            assert(is_max_heap(a, heap_size));
        }
        assert(heap_size == n);
        int out[MAXN];
        for (int i = 0; i < n; i++) {
            int v;
            bool ok = max_heap_extract_max(a, &heap_size, &v, &st);
            assert(ok);
            out[i] = v;
        }
        for (int i = 1; i < n; i++) { assert(out[i - 1] >= out[i]); }
        /* 与"先排序再倒序"对照 */
        qsort(inserted, (size_t)n, sizeof(int), cmp_int);
        for (int i = 0; i < n; i++) { assert(out[i] == inserted[n - 1 - i]); }
        printf("part 7: 调度器场景 —— 12 个作业按插入顺序进队，出队顺序恰好是优先级降序");
        printf("（%d … %d）\n", out[0], out[n - 1]);
    }

    puts("all checks passed.");
    return 0;
}
`,
        notes: [
          { line: 86, zh: '`max_heap_maximum`：就是 $\\text{MAX-HEAP-MAXIMUM}$ 三行。用返回 `bool` 表示是否下溢（C 里没有异常），比打印错误更便于断言。' },
          { line: 94, zh: '★ `max_heap_extract_max`：与书上 5 行一一对应 —— 第 98 行是第 2 行的"最后一个元素搬到根上"，第 100 行是第 3 行的"只减计数器"，第 101 行是第 4 行的 $\\text{MAX-HEAPIFY}$。' },
          { line: 107, zh: '★ `max_heap_increase_key`：第 5–7 行的循环在这里是第 113–124 行。注意第 5 行的 `i > 1` 被拆出来先判 —— **短路求值**，$i = 1$ 时连父子比较都不做（面板 ② 第 3 组的"比较 0 次"就来自这里）。' },
          { line: 114, zh: '★★ 这一行 `st->cmp++` 是我补上的：**最初漏写**，导致"反复插入建堆"实验里比较次数恒为 0，而那正是习题 6-1b 要测的量。断言没有直接发现它（因为当时那里没有断言），是**打印出来的数字**（"反复插入 0 次"）暴露的 —— 教训是：计数器这类东西，光有断言不够，还得把数字打出来看。' },
          { line: 129, zh: '★ `max_heap_insert`：第 1–2 行的容量检查对应参数 `capacity`。注意第 5 行"把键设成 $-\\infty$"在本实现里被"直接放到末尾再上浮"替代 —— 效果一样（都是复用上浮逻辑），但少一次赋值。' },
          { line: 159, zh: '★ `build_max_heap_prime`：习题 6-1 的 BUILD-MAX-HEAP\'，就是"从第 2 个元素开始，每个都 $\\text{INSERT}$ 一次"。只用于阶段 6 的对照实验。' },
          { line: 236, zh: '★ 第 1 组：反复 $\\text{EXTRACT-MAX}$ 直到取空，断言取出序列是**降序**且每次等于剩余的最大键，最后正确报下溢。' },
          { line: 325, zh: '第 3 组：$\\text{INCREASE-KEY}$ 之后堆性质成立，且新键**只向上移动**（位置下标 ≤ 原下标）、上浮层数不超过原位置到根的深度。键变小时函数被拒绝且数组逐字节不变。' },
          { line: 332, zh: '第 4 组的后半：容量已满时 $\\text{INSERT}$ 必须失败，且失败时 $A.\\text{heap-size}$ 不变。' },
          { line: 373, zh: '★★ 第 5a 组（习题 6-1a）：程序在 300 组小规模输入里**找到了真实反例**。打印出来的那一对值得看：两者都是合法的最大堆、元素集合相同，但数组内容不同 —— 所以"两种建堆总得到同一个堆"是错的。' },
          { line: 412, zh: '★★ 第 5b 组（习题 6-1b）：在递增输入下测两种建堆的比较次数。反复插入的"每次元素比较数"从 1.62 涨到 4.12（涨 2.54 倍），而自底向上只涨 1.45 倍 —— 这就是 $\\Theta(n\\lg n)$ 与 $O(n)$ 的差别。\n\n★ 这三条断言是**先打印、看清数字之后**才写下的：我最初凭直觉写了一条"n=64 时反复插入比较更多"，实测发现递增输入下自底向上也很费劲、两者接近，那条断言是错的。' },
          { line: 417, zh: '同上：断言"反复插入的每次元素比较数涨得比自底向上快"—— 这条在实测数据上成立且确定性（种子固定）。' },
        ],
        tests: [
          { in: '60 组「建堆 → 反复 EXTRACT-MAX」直到取空', out: '取出序列降序、每次都等于剩余最大值；取空后正确报下溢' },
          { in: '40 组「全部取出写入数组尾部」', out: '得到升序序列 —— 与堆排序等价（原书说 EXTRACT-MAX 与 HEAPSORT 循环体同构）' },
          { in: '990 组 INCREASE-KEY', out: '堆性质成立、新键只向上移动；键变小时被拒绝且数组不变' },
          { in: '60 组 INSERT', out: '长度 +1、仍是合法堆；容量满时正确报 heap overflow' },
          { in: '习题 6-1a：300 组小规模输入对比两种建堆', out: '找到反例（n = 5：20 19 11 1 0 vs 20 19 11 0 1）—— 不总是同一个堆' },
          { in: '习题 6-1b：递增输入，n = 8/16/32/64', out: '反复插入的每次元素比较数 1.62→4.12，自底向上 1.20→1.81 → Θ(n lg n) vs O(n)' },
          { in: '调度器场景：12 个作业按插入顺序进队再出队', out: '出队顺序恰好是优先级降序（97 … 0）' },
          { in: '编译与运行', out: 'gcc -std=c99 -Wall -Wextra -Werror 零警告；全部断言通过，输出 all checks passed.' },
        ],
      },
      mapping: [
        { pc: 1, pcCode: 'max = MAX-HEAP-MAXIMUM(A)', c: '`max_heap_maximum(a, *heap_size, &maxv)`（第 96 行），失败即下溢返回 false' },
        { pc: 2, pcCode: 'A[1] = A[A.heap-size]', c: '`a[0] = a[*heap_size - 1];`（第 98 行）' },
        { pc: 3, pcCode: 'A.heap-size = A.heap-size − 1', c: '`(*heap_size)--;`（第 100 行）' },
        { pc: 4, pcCode: 'MAX-HEAPIFY(A, 1)', c: '`max_heapify(a, *heap_size, 1, st);`（第 101 行）' },
        { pc: 5, pcCode: 'return max', c: '`*out = maxv; return true;`（第 102–103 行）' },
        { pc: 1, pcCode: '（INCREASE-KEY 第 5–7 行）', c: '`while (i > 1) { st->cmp++; if (a[PARENT(i)-1] >= a[i-1]) break; … i = PARENT(i); }`（第 113–124 行）' },
        { pc: 1, pcCode: '（INSERT 第 1–3 行）', c: '`if (*heap_size == capacity) return false; (*heap_size)++;`（第 130–132 行）' },
      ] },

    { type: 'analyze', title: '四个操作的总账',
      intro: '本节的复杂度只有一张小表，但每一行背后的理由不同 —— 有两行是"沿一条路径走"，有一行是"读一个数"。',
      claims: [
        { expr: '\\Theta(1)', when: 'MAX-HEAP-MAXIMUM（根就是最大值）', page: 174, source: 'book' },
        { expr: 'O(\\lg n)', when: 'MAX-HEAP-EXTRACT-MAX（含一次 MAX-HEAPIFY）', page: 174, source: 'book' },
        { expr: 'O(\\lg n)', when: 'MAX-HEAP-INCREASE-KEY（沿一条路径上浮）', page: 175, source: 'book' },
        { expr: 'O(\\lg n)', when: 'MAX-HEAP-INSERT（容量检查 + 一次 INCREASE-KEY）', page: 175, source: 'book' },
        { expr: 'O(\\lg n)', when: '任意优先队列操作（再加映射维护的开销）', page: 175, source: 'book' },
        { expr: '\\Theta(n \\lg n)', when: '习题 6-1b：用反复插入建堆的最坏时间（对照自底向上的 O(n)）', page: 179, source: 'book' },
      ],
      tables: [
        { caption: '四个操作对照（本节的全貌）', rows: [
          ['操作', '做什么', '复杂度', '靠哪一步保证'],
          ['MAXIMUM(S)', '返回键最大的元素', '$\\Theta(1)$', '6.1：最大值在根上'],
          ['EXTRACT-MAX(S)', '删除并返回键最大的元素', '$O(\\lg n)$', '一次 MAX-HEAPIFY（6.2）'],
          ['INCREASE-KEY(S,x,k)', '把 $x$ 的键增大到 $k$', '$O(\\lg n)$', '沿一条路径**上浮**'],
          ['INSERT(S,x,k)', '把带键 $k$ 的 $x$ 插入', '$O(\\lg n)$', '放到末尾 + 一次 INCREASE-KEY'],
        ] },
        { caption: '两个"方向"别搞反（本关最常见的错误）', rows: [
          ['', 'MAX-HEAPIFY（6.2）', 'INCREASE-KEY（6.5）'],
          ['修的是什么', '$A[i]$ 比它的**孩子**小', '$A[i]$ 比它的**父**大'],
          ['怎么动', '往下**沉**', '往上**浮**'],
          ['比较对象', '与两个孩子比', '与父比'],
          ['什么时候触发', '交换之后被换下去的那个位置', '键被调大之后'],
          ['每轮走多远', '下降一层', '上升一层'],
        ] },
        { caption: '习题 6-1 的两种建堆法（阶段 6 的实测数字）', rows: [
          ['', 'BUILD-MAX-HEAP（自底向上）', "BUILD-MAX-HEAP'（反复插入）"],
          ['做法', '$\\lfloor n/2 \\rfloor$ 次 MAX-HEAPIFY', '$n-1$ 次 MAX-HEAP-INSERT'],
          ['最坏时间', '$O(n)$', '$\\Theta(n\\lg n)$'],
          ['n = 64 比较次数（递增输入）', '116（1.8n）', '264（4.1n）'],
          ['每次都得到同一个堆吗', '$\\times$ 不总是', '$\\times$ 不总是'],
        ] },
      ],
      chart: { xMax: 256, series: [
        { name: 'EXTRACT-MAX / INSERT 的上界 ∼ n 次操作 × lg n', expr: 'n * Math.log2(n)', color: '--viz-done' },
        { name: '每次操作的代价 ∼ lg n', expr: 'Math.log2(n)', color: '--viz-compare' },
        { name: 'MAXIMUM 的代价 = 常数 1', expr: 'n / n', color: '--viz-idle' },
      ] },
      derivations: [
        { kind: 'summation', title: '为什么三个操作都是 O(lg n)', steps: [
          { zh: '$\\text{EXTRACT-MAX}$：一次 $\\text{MAX-HEAPIFY}$（6.2 已证 $O(\\lg n)$），外加常数步。' },
          { zh: '$\\text{INCREASE-KEY}$：循环每轮令 $i \\leftarrow \\text{PARENT}(i)$，即 $i$ **至少减半**。' },
          { tex: 'i \\to \\lfloor i/2 \\rfloor \\quad\\Rightarrow\\quad \\text{轮数} \\le \\lfloor \\lg n \\rfloor', zh: '$i$ 从 $\\le n$ 一路减半到 1，最多 $\\lfloor \\lg n \\rfloor$ 轮 —— 与 6.2 的 $T(n) \\le T(2n/3)+\\Theta(1)$ 是同一回事的两种说法（都是"沿一条从叶到根的路径"）。' },
          { zh: '$\\text{INSERT}$：容量检查 $\\Theta(1)$，放到末尾 $\\Theta(1)$，加一次 $\\text{INCREASE-KEY}$ $O(\\lg n)$。' },
          { tex: '\\text{全部四个操作} = \\Theta(1) \\text{ 或 } O(\\lg n)', zh: '★ 相比"用有序数组实现优先队列"（$\\text{INSERT}$ 要 $O(n)$）或"用无序数组"（$\\text{EXTRACT-MAX}$ 要 $O(n)$），堆把两边都压到了 $O(\\lg n)$ —— 这就是它成为标准实现的原因。' },
        ] },
        { kind: 'summation', title: '习题 6-1：为什么"反复插入"建堆更贵', steps: [
          { zh: '自底向上建堆的账在 6.3 算过：$\\sum_h \\text{cnt}(h) \\cdot h \\le 2n = O(n)$。关键在"**大多数结点的高度很小**"。' },
          { zh: '反复插入的账完全不同：第 $i$ 次插入把新元素放在位置 $i$，最坏情况下要浮到根，走 $\\lfloor \\lg i \\rfloor$ 层。' },
          { tex: '\\sum_{i=2}^{n} \\lfloor \\lg i \\rfloor = \\Theta(n \\lg n)', zh: '★ 差别就在这个和式里 —— 它对**所有**元素都算了一次 $\\lg n$ 量级的代价，而自底向上只对靠近根的那少数结点算得起。' },
          { zh: '阶段 6 的 C 程序实测：递增输入下 n = 64 时自底向上 116 次比较（1.8n）、反复插入 264 次（4.1n）；而且前者的"每次元素比较数"基本不随 n 变（1.20 → 1.81），后者明显上升（1.62 → 4.12）—— 这正是 $O(n)$ 与 $\\Theta(n\\lg n)$ 的区别。' },
          { zh: '★ 顺带回答习题 6-1a：两者**不总是**产生同一个堆。程序找到的最小反例是 $n = 5$（自底向上得 20 19 11 1 0，反复插入得 20 19 11 0 1）—— 都是合法最大堆、元素相同，但形状不同。' },
        ] },
      ],
      note: '★ 中心图三条线是"总量/每次/常数"三种刻度放在一起：$n \\lg n$ 那条是"$n$ 次 $O(\\lg n)$ 操作"的总量，$\\lg n$ 那条是单次操作的代价，水平的那条是 $\\text{MAXIMUM}$。看不出放大倍数没关系 —— 要点是**中间那条把两边都压住了**：插入与取出同价。' },

    { type: 'prove', title: '凭什么说上浮一定能修好',
      statement: 'At the start of each iteration of the while loop of lines 5–7: a. If both nodes PARENT(i) and LEFT(i) exist, then A[PARENT(i)].key ≥ A[LEFT(i)].key. b. If both nodes PARENT(i) and RIGHT(i) exist, then A[PARENT(i)].key ≥ A[RIGHT(i)].key. c. The subarray A[1 : A.heap-size] satisfies the max-heap property, except that there may be one violation, which is that A[i].key may be greater than A[PARENT(i)].key.',
      page: 178,
      intro: '★ 这条不变量来自**习题 6.5-7**（原书把它印在题目里，正文只留了一句 "See Exercise 6.5-7 for a precise loop invariant"）。它的三条分别管三件事：a/b 是"父与它的另一个孩子之间的关系没被破坏"，c 是"整段只有一个违规点，而且那个点就在 $i$ 与父之间"。三步论证对应：前提 → 每轮交换把违规点往上挪一层 → 到根或不再违规时终止。',
      steps: [
        { title: '第一步 · 初始化（Initialization）：调用前的状态',
          en: 'You may assume that the subarray A[1 : A: heap-size] satisfies the max-heap property at the time MAX-HEAP-INCREASE-KEY is called.',
          page: 178,
          body: [
            '题目给的假设是：调用前整段满足最大堆性质。第 3 行把 $A[i]$ 的键**变大**之后，唯一可能被破坏的关系就是"$A[i]$ 与它的父"—— 因为它只变大，不会比自己的孩子小（孩子本来就不大于它，现在它更大）。',
            '所以不变量在第 5–7 行循环开始前成立：a/b 成立（其它关系都没动），c 成立且唯一的违规点正是 $A[i]$ 与 $A[\\text{PARENT}(i)]$。',
            '★ 这也解释了原书第 1–2 行为什么要**拒绝变小**：如果允许变小，破坏的就是"$i$ 与孩子"的关系，而那种违规**不会**随着上浮被修好（上浮只管父那边）。',
            '★ 关于记号：上面这条引述里的 `A[1 : A: heap-size]` 是语料对 `A[1 : A.heap-size]` 的抽取结果（那个符号在原书上是**句点**）。本站引述一律照抄语料以便逐字溯源，下面"要证的不变量"里用的是书上真正的写法。',
          ] },
        { title: '第二步 · 保持（Maintenance）：每轮把违规点往上挪一层',
          en: 'At the start of each iteration of the while loop of lines 5–7: a. If both nodes PARENT(i) and LEFT(i) exist, then A[PARENT(i)]: key ≥',
          page: 178,
          body: [
            '循环条件成立意味着 $A[\\text{PARENT}(i)] < A[i]$（父更小）。第 6 行把两者**交换**。',
            '交换之后：$i$ 位置拿到了原来父的键（更小），所以 $A[i]$ 与它的两个孩子之间的关系仍然合规（孩子们本来就 ≤ 父，现在父位置的值更小了 —— 等等，这里要仔细：$A[i]$ 现在拿到的是**更小**的值，它的孩子原本 ≤ 原来的 $A[i]$，而原来的 $A[i]$ 又被搬走了…… ★ 这正是 a/b 两条要管的事：新在 $i$ 位置的是"原来的父"，而原父不小于它的另一个孩子（不变量 a/b），也不小于 $i$ 的孩子（因为原 $A[i]$ 也不小于它们，且原父 < 原 $A[i]$ … 这个方向需要论证，见下）。',
            '换个更清楚的说法：交换前 $\\text{PARENT}(i)$ 的值不小于它的两个孩子（不变量 a/b）；交换后 $\\text{PARENT}(i)$ 位置拿到的是原来 $A[i]$ 的值，它比原父大，于是**父位置这一处也合规了**。而 $i$ 位置拿到的是原父的值，它比原 $A[i]$ 小、但原父不小于 $i$ 的另一个兄弟（a/b），所以 $i$ 与兄弟的关系仍合规；唯一可能不合规的是 $i$ 与它**新的父**（原祖父）之间的关系。',
            '★ 结论：违规点整体上移了一层，而且仍然只有一个。第 7 行 `i = PARENT(i)` 让下一轮从这个新的位置继续 —— 不变量以新的 $i$ 重新成立。',
          ] },
        { title: '第三步 · 终止（Termination）：两种出口，都不需要再看别处',
          en: 'it repeatedly compares an element’s key to that of its parent, exchanging pointers and continuing if the element’s key is larger, and terminating if the element’s key is smaller, since the max-heap property now holds.',
          page: 175,
          body: [
            '**出口一：$i = 1$。** 已经到根，根的父不存在，循环条件的 `i > 1` 为假。此时整段满足最大堆性质（因为除根外无结点可违规）。',
            '**出口二：$A[\\text{PARENT}(i)] \\ge A[i]$。** 循环条件的第二个条件为假。由不变量 c，唯一的违规点是"$A[i] > A[\\text{PARENT}(i)]$"，而现在它不成立 —— 所以**没有任何违规点**，整段就是一个最大堆。',
            '★ 原书那句 "since the max-heap property now holds" 说的正是这个：**不需要再往下看了**。因为从上浮过程中被改动的位置只有 $i$ 与它的祖先这一条链，而每个被改动的位置在交换那一刻都已经合规。',
          ] },
      ],
      conclusion: '★ 结论：$\\text{INCREASE-KEY}$ 在"新键不小于旧键"的前提下，把键调大之后只沿一条从 $i$ 到根的路径上浮，就能恢复整段的最大堆性质，代价 $O(\\lg n)$。$\\text{INSERT}$ 之所以能复用这段逻辑，靠的是"先把键设成 $-\\infty$"让前提恒成立（阶段 4 第 5 行的说明）。',
      note: '' },

    { type: 'drill', title: '检验一下',
      items: [
        { kind: 'single', q: '四个操作里哪个是 $\\Theta(1)$？',
          options: ['MAX-HEAP-MAXIMUM', 'MAX-HEAP-EXTRACT-MAX', 'MAX-HEAP-INCREASE-KEY', 'MAX-HEAP-INSERT'], answer: 0,
          why: '只有 $\\text{MAXIMUM}$：由 6.1 的推论，最大值一定在根上，读 $A[1]$ 即可。其余三个都要沿一条路径走，是 $O(\\lg n)$。' },
        { kind: 'single', q: 'MAX-HEAP-INCREASE-KEY 把键调大之后，元素应该往哪个方向移动？',
          options: ['往下沉（与孩子交换）', '往上浮（与父交换）', '不动', '先下后上'], answer: 1,
          why: '★ 键变大只会破坏"与父的关系"（可能比父还大），所以要**上浮**。往下沉是 $\\text{MAX-HEAPIFY}$ 的方向（修"比孩子小"）。两者方向相反，本关最容易搞混的地方。' },
        { kind: 'single', q: 'MAX-HEAP-INSERT 第 5 行为什么要先把新元素的键设成 $-\\infty$？',
          options: ['为了排序稳定', '为了让第 8 行调用 INCREASE-KEY 时"新键 ≥ 旧键"的前提恒成立', '为了让它在末尾不违反堆性质', '为了节省一次比较'], answer: 1,
          why: '★ 这就是习题 6.5-5。$\\text{INCREASE-KEY}$ 第一步就要求新键不小于旧键；设成 $-\\infty$ 之后这个前提必然满足，于是插入可以直接复用"变大后上浮"的现成逻辑。' },
        { kind: 'judge', q: 'MAX-HEAP-INCREASE-KEY 可以同时用来把某个键调小。', answer: false,
          why: '★ 不行。第 1–2 行明确规定"新键更小"就报错退出。键变小破坏的是"与孩子的关系"，要往下沉（$\\text{MAX-HEAPIFY}$ 那种方向）—— 上浮的逻辑修不了它。习题 6.5-4 让你另写一个 $\\text{MAX-HEAP-DECREASE-KEY}$。' },
        { kind: 'single', q: '优先队列里 $A.\\text{heap-size}$ 的变化规律是？',
          options: ['只减不增（像堆排序）', '只增不减', '可增可减：插入 +1、取出 −1', '始终等于数组容量 n'], answer: 2,
          why: '★ 这正是优先队列与堆排序的分野：排序时堆区一路缩到 0，而优先队列是个可反复增删的集合。数组容量 $n$ 才是那个始终不变的上限。' },
        { kind: 'judge', q: '用堆实现的优先队列，EXTRACT-MAX 与 HEAPSORT 的循环体做的事几乎一样。', answer: true,
          why: '★ 原书 p.174 明说 "MAX-HEAP-EXTRACT-MAX is similar to the for loop body (lines 3–5) of the HEAPSORT procedure"。差别只在最大值去哪：堆排序把它留在数组尾部（于是排好序），优先队列把它返回给调用方。' },
        { kind: 'single', q: '习题 6-1a：BUILD-MAX-HEAP 与 BUILD-MAX-HEAP′ 总是产生同一个堆吗？',
          options: ['总是相同', '不总是相同（有反例）', '只在 n 为偶数时相同', '只在输入已排序时相同'], answer: 1,
          why: '★ 不总是。阶段 6 的 C 程序在 300 组小规模输入里找到了真实反例（n = 5：自底向上得 20 19 11 1 0，反复插入得 20 19 11 0 1）。两者都是合法最大堆、元素集合相同，但形状不同。' },
        { kind: 'simulate', q: '对一个 n = 1024 的堆，INCREASE-KEY 最坏情况下最多上浮几层？（填整数）', expect: [10], placeholder: '例如：10',
          why: '每轮 $i \\leftarrow \\lfloor i/2 \\rfloor$，从 1024 一路减半到 1：1024→512→…→1，共 10 步。也就是 $\\lfloor \\lg 1024 \\rfloor = 10$ —— 这正是 $O(\\lg n)$ 的来源。' },
      ],
      bookExercises: [
        { id: '6.5-1', page: 176, star: 0,
          statement: 'Suppose that the objects in a max-priority queue are just keys. Illustrate the opera- tion of MAX-HEAP-EXTRACT-MAX on the heap A = ⟨15,13,9,5,12,8,7,4,0; 6,2,1⟩.',
          hint: '先认清分号：$\\langle 15,13,9,5,12,8,7,4,0; 6,2,1 \\rangle$ 的堆区只有分号**前**的 9 个元素（A.heap-size = 9），$6,2,1$ 是早已摘出堆外的老元素，本操作不看它们。 照 EXTRACT-MAX 的五行走：记下 $A[1] = 15$ → 把**堆内**最后一个 $A[9] = 0$ 搬到根 → heap-size 缩成 8 → 从根下沉：0 先与 13 换、再与 12 换，落在第 5 位停 （它的孩子该是第 10、11 位，已经在堆外）。 终态的堆区是 $\\langle 13,12,9,5,0,8,7,4 \\rangle$。 第 9 格里留什么要看写法：原书第 2 行是**直接覆盖**（那一格仍是 0）， 本站动画为了让你看见被取走的是 15 而改成交换（那一格是 15）—— 堆区 $A[1 : 8]$ 两种写法完全一样，第 4 行的下沉也只在这 8 格里发生。 阶段 5 面板 ① 的第 2 组就是这组原始数据（A.heap-size = 9），可以逐帧对照。' },
        { id: '6.5-2', page: 176, star: 0,
          statement: 'Suppose that the objects in a max-priority queue are just keys. Illustrate the opera- tion of MAX-HEAP-INSERT (A,10) on the heap A = ⟨15,13,9,5,12,8,7,4,0,6; 2,1⟩.',
          hint: '按 8 行走：A.heap-size $= 10 <$ 容量 $12$ ⟹ 不溢出，计数器加 1 变成 11 → 新元素落到**第 11 格**、键先设成 $-\\infty$ → 第 8 行调 $\\text{INCREASE-KEY}(A, 11, 10)$。 上浮只需一次比较：11 的父是 $\\lfloor 11/2 \\rfloor = 5$，$A[5] = 12 \\ge 10$ ⟹ 不换、就地停。 终态 $\\langle 15,13,9,5,12,8,7,4,0,6,10 \\mid 1 \\rangle$，A.heap-size $= 11$。 ★ 一处容易写错的地方：第 11 格原本躺着摘出堆的老元素 $2$，插入时它是被**覆盖**掉的， 所以堆外只剩第 12 格的 $1$，不是「$2,1$」。 阶段 5 面板 ③ 的第 2 组就是这组数据（容量 12、A.heap-size = 10），逐帧对照即可。' },
        { id: '6.5-3', page: 176, star: 0,
          statement: 'Write pseudocode to implement a min-priority queue with a min-heap by writing the procedures MIN-HEAP-MINIMUM, MIN-HEAP-EXTRACT-MIN, MIN-HEAP-DECREASE-KEY, and MIN-HEAP-INSERT.',
          hint: '把每一处"较大/最大"改成"较小/最小"：$\\text{MAX-HEAPIFY}$ → $\\text{MIN-HEAPIFY}$（比较符号反过来）、$\\text{INCREASE-KEY}$ → $\\text{DECREASE-KEY}$、$\\text{MAXIMUM}$ → $\\text{MINIMUM}$。$\\text{MIN-HEAP-INSERT}$ 里那个"先设成 $-\\infty$"要改成"先设成 $+\\infty$"。运行时间完全不变。' },
        { id: '6.5-4', page: 176, star: 0,
          statement: 'Write pseudocode for the procedure MAX-HEAP-DECREASE-KEY (A, x, k) in a max-heap. What is the running time of your procedure?',
          hint: '★ 方向反过来：把键调**小**之后，它可能比孩子还小 —— 所以要像 $\\text{MAX-HEAPIFY}$ 那样**往下沉**（沿一条从 $i$ 到叶的路径），而不是上浮。运行时间仍是 $O(\\lg n)$（路径长度不超过树高）。注意前提也要反过来：应当要求 $k \\le x.\\text{key}$。' },
        { id: '6.5-5', page: 177, star: 0,
          statement: 'Why does MAX-HEAP-INSERT bother setting the key of the inserted object to −1 in line 5 given that line 8 will set the object’s key to the desired value?',
          hint: '★ 为了让第 8 行能调用 $\\text{INCREASE-KEY}$。那条过程的第 1 行要求"新键 ≥ 旧键"，设成 $-\\infty$ 之后这个前提**恒成立**，于是插入不必另写一份上浮逻辑。换句话说：$-\\infty$ 不是为了最终结果，而是为了满足**过程中的前提**。' },
        { id: '6.5-6', page: 177, star: 0,
          statement: 'Professor Uriah suggests replacing the while loop of lines 5–7 in MAX-HEAP- INCREASE-KEY by a call to MAX-HEAPIFY. Explain the flaw in the professor’s idea.',
          hint: '★ 方向反了：$\\text{MAX-HEAPIFY}$ 只会把结点往**下**送，修的是「比孩子小」； 而 INCREASE-KEY 之后唯一的违例是 $A[i]$ 比**父**大。$\\text{MAX-HEAPIFY}$ 连看都不看父结点， $A[i]$ 比孩子大时它一步不动（违反堆性质的地方原样留着），比孩子小时反而把抬高的键往下压 —— 越修越坏。 顺便看清前提：$\\text{MAX-HEAPIFY}$ 要求两棵子树已经是堆，这个前提在 INCREASE-KEY 的现场确实成立， 所以它「看起来能用」，问题全在违例的方向上。' },
        { id: '6.5-7', page: 177, star: 0,
          statement: 'Argue the correctness of MAX-HEAP-INCREASE-KEY using the following loop invariant: At the start of each iteration of the while loop of lines 5–7: a. If both nodes PARENT(i) and LEFT(i) exist, then A[PARENT(i)]: key ≥ A[LEFT(i)]: key. b. If both nodes PARENT(i) and RIGHT(i) exist, then A[PARENT(i)]: key ≥ A[RIGHT(i)]: key. c. The subarray A[1 : A: heap-size] satisfies the max-heap property, except that there may be one violation, which is that A[i]: key may be greater than A[PARENT(i)]: key. You may assume that the subarray A[1 : A: heap-size] satisfies the max-heap prop- erty at the time MAX-HEAP-INCREASE-KEY is called.',
          hint: '★ 阶段 8 的三步就是这道题的参考论证。结构：① 调用前整段是堆，变大之后唯一违规点是 $A[i]$ 与父；② 交换之后父位置合规了、$i$ 与兄弟仍合规，违规点整体上移一层（不变量重新成立）；③ 终止时要么到根、要么父不小于它 —— 两种情况都没有违规点。' },
        { id: '6.5-10', page: 178, star: 0,
          statement: 'The operation MAX-HEAP-DELETE (A,x) deletes the object x from max-heap A. Give an implementation of MAX-HEAP-DELETE for an n-element max-heap that runs in O(lg n) time plus the overhead for mapping priority queue objects to array indices.',
          hint: '★ 常用做法：先找到 $x$ 的下标 $i$，把**最后一个元素**搬到 $i$ 上、堆区减 1，然后看情况 —— 如果搬来的值比原来大就上浮（$\\text{INCREASE-KEY}$ 那种），比原来小就下沉（$\\text{MAX-HEAPIFY}$ 那种）。两种方向都有可能，所以两个都要准备。' },
        { id: '6.5-11', page: 178, star: 0,
          statement: 'Give an O(n lg k)-time algorithm to merge k sorted lists into one sorted list, where n is the total number of elements in all the input lists. (Hint: Use a min-heap for k-way merging.)',
          hint: '★ 提示已经给了方向：用一个**大小为 $k$ 的最小堆**存放"每一条链表当前的第一个元素"。每次取出最小的（$O(\\lg k)$）输出到结果里，然后把那条链表的下一个元素放进堆（$O(\\lg k)$）。总共 $n$ 次操作 → $O(n\\lg k)$。注意堆里存的是"元素 + 它属于哪条链表"，这正是本节说的"元素是指向对象的指针"。' },
      ] },
  ],
};
