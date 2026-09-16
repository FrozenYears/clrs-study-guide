/* 第 7 章 7.1：快速排序的描述（Description of quicksort）。
 *
 * 原文锚点：印刷页 183–187（pdf_index 204–208）。
 * 引述已用 tools/07_pick_quotes.py pick/check 逐条预检（18/18 PASS）。
 * 伪代码按渲染页 p183/p184 逐行核对（语料把 `q DPARTITION` 抽成了 `D` 当 `=`，
 * 缩进全丢 —— 本书必须按渲染页抄）。
 * 内嵌 C 与 c/quicksort.c 逐字节一致。
 */

export default {
  key: 's01', id: 'ch07/s01', chapter: 7, section: '7.1',
  title: '快速排序：分而治之，原地完成', shortTitle: '7.1 快速排序的描述',
  titleEn: 'Description of quicksort',
  source: { printed: [183, 187], pdf: [204, 208] },
  sourceNote: '本关对应原书 7.1 节（印刷页 183–187）。PARTITION 是整个快速排序的核心，它的循环不变量原书在正文里给了完整证明（p.184）—— 本关阶段 8 就用那三步。',
  prerequisites: [{ label: '6.5 Priority queues（优先队列）', url: '#/ch06/s05' }],
  stages: [
    { type: 'map', title: '与归并排序同门，但把力气花在"分"上',
      why: '归并排序与快速排序都出自分治法，但它们把工作放在**相反的半边**：归并排序"分"很容易（从中间切一刀），难的是**合**（MERGE 要 $\\Theta(n)$）；快速排序反过来 —— **合是免费的**（"Combine by doing nothing"），难的是**分**（PARTITION 要把数组按轴分成两侧）。这一关就是讲"分"怎么做。',
      position: '2.3.1 的分治三步（Divide / Conquer / Combine）在第 4 章用来解递归式、在第 2 章用来归并排序；本关是分治法的第二个大型实例。快速排序是实践中最快的比较排序（原书 p.172 自己承认），它**原地排序**且平均 $\\Theta(n\\lg n)$，但最坏 $\\Theta(n^2)$ —— 这两个数字的张力在 7.2 / 7.4 展开。本章的随机化版本（7.3）还会用回 5.3 的"自己制造随机性"。',
      unlocks: [
        { label: '7.2 Performance of quicksort（快速排序的性能）', url: '#/ch07/s02' },
      ],
      mathKit: [
        { title: '分治三步', body: '$\\text{Divide}$（分成两段）→ $\\text{Conquer}$（递归解两段）→ $\\text{Combine}$（合并结果）。归并排序把代价放在第三步，快速排序放在第一步。' },
        { title: '原地（in place）', body: 'PARTITION 只在数组内交换元素，额外空间 $O(1)$。这是快速排序相对归并排序的最大实践优势。' },
        { title: '循环不变量', body: 'PARTITION 每轮循环维持四个区：$A[p:i]\\le x$、$A[i+1:j-1]>x$、$A[j:r-1]$ 未看、$A[r]=x$（Figure 7.2）。' },
      ] },

    { type: 'intuition', title: '把一个人放对位置，两边就各自成立',
      scene: '一排人要按身高站队，你只负责把"选定的人"放到他该站的那一格',
      body: [
        'PARTITION 做的事情很小：**选最后一个元素当基准（轴）**，然后扫一遍数组，把不大于它的都挪到左边、大于它的都留在右边，最后把它换到中间。做完之后，**轴就已经在它的最终位置上了** —— 这是整个算法唯一"确定下来"的元素。',
        '为什么"合"是免费的？因为分区之后，左边所有元素 ≤ 轴、右边所有元素 ≥ 轴。只要左右两段**各自**排好序，整段就自动有序 —— 不需要像归并排序那样再合并一次。',
        '★ 扫描的技巧在于"边扫边分区"：用两个下标 $i$、$j$ 把数组切成四区 —— 低侧（≤ x）、高侧（> x）、还没看、轴。每看一个元素只需决定它去哪一侧，$O(1)$。整个过程只走一遍，所以 PARTITION 是 $\\Theta(n)$（习题 7.1-3）。',
        '★ "原地"是快速排序的另一个卖点：PARTITION 只在数组内交换，不需要像归并排序那样开 L、R 两个辅助数组。代价是**它不是稳定排序**（长距离交换会打乱相同键的相对次序）。',
      ],
      interactive: { text: '阶段 5 面板 ① 用原书 Figure 7.1 的数组 ⟨2,8,7,1,3,5,6,4⟩ 演示 PARTITION 全程；面板 ② 用同一数组演示整个 QUICKSORT 的递归展开。' } },

    { type: 'source', title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄 —— 语料里 `q DPARTITION`、`A[j]  ≤ x` 那类形状是 PDF 抽取的产物。',
      blocks: [
        { kind: 'body', page: 183,
          en: 'Quicksort, like merge sort, applies the divide-and-conquer method introduced in Section 2.3.1. Here is the three-step divide-and-conquer process for sorting a sub- array A[p : r]:',
          zh: '★ 开宗明义：与归并排序**同门**（都出自 2.3.1 的分治法）。这一句是本关的理解框架 —— 看快速排序时，脑子里要始终对着"Divide / Conquer / Combine"三步，看它把工作放在哪一步。' },
        { kind: 'body', page: 183,
          en: 'Divide by partitioning (rearranging) the array A[p : r] into two (possibly empty) subarrays A[p : q − 1] (the low side) and A[q + 1 : r] (the high side) such that each element in the low side of the partition is less than or equal to the pivot A[q], which is, in turn, less than or equal to each element in the high side.',
          zh: '★★ Divide 的**规格**（不是实现）。三个要点：① 两段**可能为空**（"possibly empty"）—— 这一句在 7.2 分析最坏情况时是关键；② 中间的 $A[q]$ 叫 **pivot（轴）**；③ 不等式是 $\\le$ 与 $\\ge$（**允许相等**），这一点决定了"全部相同"的输入会退化 —— 习题 7.1-2 就在问这个。' },
        { kind: 'body', page: 183,
          en: 'Combine by doing nothing: because the two subarrays are already sorted, no work is needed to combine them. All elements in A[p : q − 1] are sorted and less than or equal to A[q], and all elements in A[q + 1 : r] are sorted and greater than or equal to the pivot A[q]. The entire subarray A[p : r] cannot help but be sorted!',
          zh: '★★ "cannot help but be sorted!"（**想不有序都难**）—— 这是全书少见的带感叹号的句子。它说清了为什么合并免费：分区的产物（左 ≤ 轴 ≤ 右）加上递归调用（左右各自有序）**自动**拼出有序序列。\n\n★ 对照 2.3 的归并排序：它的 Combine 是 MERGE，$\\Theta(n)$ 的工作量。这个对比是理解两族算法差异的钥匙。' },
        { kind: 'body', page: 183,
          en: 'The key to the algorithm is the PARTITION procedure on the next page, which rearranges the subarray A[p : r] in place, returning the index of the dividing point between the two sides of the partition.',
          zh: '★ 两个关键词：**in place**（原地 —— 只在数组内交换，不开辅助数组）与 **returning the index**（返回分割点的下标 $q$）。快速排序的"原地"性质完全来自 PARTITION 的实现方式。' },
        { kind: 'body', page: 183,
          en: 'Figure 7.1 shows how PARTITION works on an 8-element array. PARTITION always selects the element x = A[r] as the pivot. As the procedure runs, each element falls into exactly one of four regions, some of which may be empty. At the start of each iteration of the for loop in lines 3–6, the regions satisfy certain properties, shown in Figure 7.2. We state these properties as a loop invariant:',
          zh: '★★ 三件事：① **轴永远是 $A[r]$**（最后一个元素）—— 这个"随机选一个"的对立面，正是 7.2 最坏情况与 7.3 随机化版本的出发点；② 元素被切成**四个区**（低侧 / 高侧 / 未看 / 轴），而且"每个元素恰好落入一个区"；③ 这四个区的性质被表述成**循环不变量** —— 下面就是完整的证明。' },
        { kind: 'body', page: 184,
          en: '1. if p ≤ k ≤ i , then A[k] ≤ x (the tan region of Figure 7.2); 2. if i + 1 ≤ k ≤ j − 1, then A[k]>x (the blue region); 3. if k = r , then A[k] = x (the yellow region).',
          zh: '★★ PARTITION 的**循环不变量**（三条）。它是 Figure 7.2 那张图的文字版：低侧 $A[p:i]$ 全部 $\\le x$、高侧 $A[i+1:j-1]$ 全部 $> x$、$A[r] = x$，而 $A[j:r-1]$ 是"还没看"的白色区域。\n\n★ 注意三条里**没有**说"未看区域"的任何性质 —— 因为还没看，本来就谈不上。阶段 8 的三步证明就是围着这三条转的。' },
        { kind: 'body', page: 184,
          en: 'Initialization: Prior to the first iteration of the loop, we have i = p − 1 and j = p. Because no values lie between p and i and no values lie between i + 1 and j − 1, the first two conditions of the loop invariant are trivially satisfied.',
          zh: '★ 初始化。"trivially satisfied"（**空真**）—— 因为 $i = p - 1$ 时低侧区间 $[p, p-1]$ 是空的，$j = p$ 时高侧区间 $[p+1, p-1]$ 也是空的。空区间上的全称命题自动成立。\n\n★ 这种"用越界下标表示空集"的写法在算法里到处都是（6.2 的 $i = p - 1$ 也是），它是"用下标边界表示空区间"的标准技巧。' },
        { kind: 'body', page: 184,
          en: 'Figure 7.3(b) shows what happens when A[j] ≤ x : the loop increments i , swaps A[i] and A[j] , and then increments j . Because of the swap, we now have that A[i] ≤ x , and condition 1 is satisfied. Similarly, we also have that A[j − 1] > x , since the item that was swapped into A[j − 1] is, by the loop invariant, greater than x .',
          zh: '★★ 保持性里最精妙的一步：**为什么被换到 $A[j-1]$ 的那个元素一定 > x？** 原书给出推理：它来自不变量的第二条（高侧的元素都 > x）。这是"用不变量本身来证明交换的正确性"—— 如果没有那条不变量，你只能说"碰巧是对的"。\n\n★ 这一条也是初学者最容易看漏的：交换是**长距离**的（$A[i]$ 与 $A[j]$），被换到 $A[i]$ 的进入了低侧、被换到 $A[j-1]$ 的进入了高侧，两个方向都要说清。' },
        { kind: 'body', page: 184,
          en: 'Termination: Since the loop makes exactly r − p iterations, it terminates, whereupon j = r . At that point, the unexamined subarray A[j : r − 1] is empty, and every entry in the array belongs to one of the other three sets described by the invariant. Thus, the values in the array have been partitioned into three sets: those less than or equal to x (the low side), those greater than x (the high side), and a singleton set containing x (the pivot).',
          zh: '★★ 终止。两个要点：① 循环**恰好 $r-p$ 轮** —— 这一条直接给出 PARTITION 是 $\\Theta(n)$（习题 7.1-3）；② 终止时未看区已空，于是整个数组被分成三堆：低侧 / 高侧 / 轴自己。\n\n★ "a singleton set containing x"（轴单独一堆）—— 这句话是理解"为什么轴已经就位"的关键：轴**不属于**低侧也不属于高侧，它被夹在正中间。' },
        { kind: 'body', page: 185,
          en: 'The final two lines of PARTITION finish up by swapping the pivot with the leftmost element greater than x , thereby moving the pivot into its correct place i n the partitioned array, and then returning the pivot’s new index. The output of PARTITION now satisfies the specifications given for the divide step. In fact, it satisfies a slightly stronger condition: after line 3 of QUICKSORT , A[q] is strictly less than every element of A[q + 1 : r].',
          zh: '★★ 注意最后那句 "a slightly stronger condition"（一个**略强**的结论）：第 7 行交换的是"**最左边**那个大于 $x$ 的元素"，所以交换后 $A[q]$ **严格小于**右侧的每一个元素（不是 ≤ 而是 <）。\n\n★ 为什么会这样？因为高侧里的元素**本来就 > x**，而第 7 行换走的那个是最左边（也就是高侧里最小的那个吗？不 —— 是位置最靠左的）。想清楚这一句，你会发现原书这句"略强"其实说得保守了：右侧**全部** > $A[q]$。这一句在 7.4 的期望运行时间分析里会被用到。' },
        { kind: 'body', page: 186,
          en: 'Exercise 7.1-3 asks you to show that the running time of PARTITION on a sub- array A[p : r] of n = r − p + 1 elements is Θ(n).',
          zh: '★ 一句话给出复杂度：PARTITION 是 $\\Theta(n)$。理由在阶段 7 展开：循环恰好 $r-p = n-1$ 轮、每轮 $O(1)$。' },
      ],
      terms: [
        { en: 'pivot', zh: '轴（选定的基准元素）', page: 183 },
        { en: 'low side', zh: '低侧（≤ 轴的那一段）', page: 183 },
        { en: 'high side', zh: '高侧（> 轴的那一段）', page: 183 },
        { en: 'in place', zh: '原地（只用常数额外空间）', page: 183 },
      ] },

    { type: 'pseudocode', title: '两段伪代码：外壳五行走一遍，核心八行做分区',
      lead: '★ 两段都按渲染页 p183 / p184 逐行核对过（语料把 `q DPARTITION` 抽成了 `D`，缩进全丢 —— 已按书补齐）。第 2 行是**注释**，不是可执行语句。',
      algo: 'QUICKSORT', signature: 'QUICKSORT(A, p, r)', page: 183,
      lines: [
        { n: 1, code: 'if p < r', zh: '★ 递归出口：子数组不足两个元素（p ≥ r）就直接返回。注意 $p = r$（单元素）与 $p > r$（空区间）**都**走这条路。' },
        { n: 2, code: '    // Partition the subarray around the pivot, which ends up in A[q].', zh: '注释行。原书把它放在这里是为了说明第 3 行在做什么。按 2.2 的约定，注释不计入运行时间。' },
        { n: 3, code: '    q = PARTITION(A, p, r)', zh: '★★ 整个算法的全部工作都在这一行。做完之后 $A[q]$ 已经在它的最终位置上 —— 后面的递归**不再包含它**（$q - 1$ 与 $q + 1$）。这一点与归并排序形成对比：归并排序每次递归都覆盖全部元素。' },
        { n: 4, code: '    QUICKSORT(A, p, q − 1)    // recursively sort the low side', zh: '递归排低侧 $A[p : q-1]$。注意区间**不含** $q$。' },
        { n: 5, code: '    QUICKSORT(A, q + 1, r)    // recursively sort the high side', zh: '递归排高侧 $A[q+1 : r]$。同样不含 $q$。两次递归加起来恰好覆盖除轴外的全部元素。' },
      ],
      vars: [
        { name: 'p, r', meaning: '当前要排序的子数组两端（1 基，含端点）' },
        { name: 'q', meaning: 'PARTITION 返回的轴的下标' },
      ],
      note: '★ 要排序整个数组，初始调用是 QUICKSORT(A, 1, n)。',
      more: [
        { algo: 'PARTITION', subtitle: 'PARTITION(A, p, r) —— 真正干活的八行（原书 p.184）',
          signature: 'PARTITION(A, p, r)', page: 184,
          lines: [
            { n: 1, code: 'x = A[r]', zh: '★★ 轴选**最后一个元素**。这个"选法"看起来随意，但它正是本章的戏剧核心：固定选末元素 → 已排序输入退化成 $\\Theta(n^2)$（7.2）；随机选 → 期望 $\\Theta(n\\lg n)$（7.3 / 7.4）。' },
            { n: 2, code: 'i = p − 1', zh: '$i$ 是"低侧的最高下标"。初始为 $p-1$ 表示**低侧为空**（越界下标表示空集）。' },
            { n: 3, code: 'for j = p to r − 1', zh: '$j$ 是扫描指针，从 $p$ 走到 $r-1$ —— **不包含 $r$**，因为 $A[r]$ 是轴自己，不用跟自己比。共 $r - p$ 轮。' },
            { n: 4, code: '    if A[j] ≤ x', zh: '★ 判断当前元素该去哪一侧。注意是 $\\le$（不是 $<$）—— 相等的元素进**低侧**。这个选择决定了"全部相同"的输入会退化（习题 7.1-2）。' },
            { n: 5, code: '        i = i + 1', zh: '低侧扩一格。' },
            { n: 6, code: '        exchange A[i] with A[j]', zh: '★ 把当前元素换进低侧。被换出去的那个（原 $A[i]$）一定 > x —— 原书用循环不变量说明了这一点（阶段 8 第二步）。' },
            { n: 7, code: 'exchange A[i + 1] with A[r]', zh: '★★ 扫描结束后，把轴换到低侧与高侧**正中间**（$i+1$）。这一步之后轴就位，位置从此不变。' },
            { n: 8, code: 'return i + 1', zh: '返回轴的新下标 $q$，给 QUICKSORT 的两次递归用。' },
          ],
          vars: [
            { name: 'x', meaning: '轴的值（= A[r]）' },
            { name: 'i', meaning: '低侧的最高下标（A[p : i] 都 ≤ x）' },
            { name: 'j', meaning: '扫描指针（A[j : r−1] 还没看过）' },
            { name: 'q', meaning: '返回值：轴的最终下标' },
          ],
          note: '★ 八行里只有两行做交换（第 6、7 行），其它都是判断与移动下标 —— 这就是它 $\\Theta(n)$ 且原地的原因。' },
      ] },

    { type: 'visualize', title: '四区如何一步步长成两段',
      viz: 'array', stateLabels: { result: '≤ x（低侧）', done: '> x（高侧）', pivot: '轴', compare: '当前' },
      panels: [
        { title: '① PARTITION：Figure 7.1 的数组 ⟨2,8,7,1,3,5,6,4⟩，轴是最后的 4',
          viz: 'array',
          algorithm: 'partition', pseudocodeRef: 'PARTITION',
          input: { array: [2, 8, 7, 1, 3, 5, 6, 4] },
          countLabels: { cmp: '比较', move: { label: '交换', unit: '次' } },
          invariants: [{ label: '每一帧结束时：A[p : i] ≤ x、A[i+1 : j−1] > x、A[r] = x（Figure 7.2 的四区）' }],
          presets: [
            { name: '原书 Figure 7.1：⟨2,8,7,1,3,5,6,4⟩（轴 = 4，整段 [1,8]）', array: [2, 8, 7, 1, 3, 5, 6, 4], args: [1, 8] },
            { name: '习题 7.1-1：⟨13,19,9,5,12,8,7,4,21,2,6,11⟩（轴 = 11）', array: [13, 19, 9, 5, 12, 8, 7, 4, 21, 2, 6, 11], args: [1, 12] },
            { name: '★ 全部相同 ⟨5,5,5,5,5⟩：轴最后落在 r（习题 7.1-2 的退化）', array: [5, 5, 5, 5, 5], args: [1, 5] },
            { name: '只有两个元素 ⟨3,7⟩：轴 7 比左边大，一次交换都不用', array: [3, 7], args: [1, 2] },
          ] },
        { title: '② QUICKSORT：整个递归怎么展开（同一数组）',
          viz: 'array',
          algorithm: 'quicksort', pseudocodeRef: 'QUICKSORT',
          input: { array: [2, 8, 7, 1, 3, 5, 6, 4] },
          countLabels: { cmp: '比较', move: { label: '交换', unit: '次' }, calls: { label: '递归调用', unit: '次' } },
          invariants: [{ label: '已就位的轴不会再移动；当前高亮的子数组是正在递归处理的那一段' }],
          presets: [
            { name: '原书 Figure 7.1 的数组 ⟨2,8,7,1,3,5,6,4⟩（运气不错，分区比较均衡）', array: [2, 8, 7, 1, 3, 5, 6, 4], args: [1, 8] },
            { name: '★ 已排序 ⟨1,…,8⟩：每层只切掉一个元素，递归退化成一条链（7.2 的最坏情况）', array: [1, 2, 3, 4, 5, 6, 7, 8], args: [1, 8] },
            { name: '★ 全部相同 ⟨5,…,5⟩（8 个）：同样退化成一条链', array: [5, 5, 5, 5, 5, 5, 5, 5], args: [1, 8] },
          ] },
      ],
      tasks: [
        '面板 ① 走完 Figure 7.1 那组，数一数：低侧最终是哪几个值？高侧是哪几个？轴 4 落在下标几？（答：低侧 2,1,3；高侧 8,7,5,6；轴在下标 4）',
        '面板 ① 的第 3 组（全部相同）：观察"高侧"是不是**始终为空** —— 每个元素都 ≤ 轴，全都进了低侧。这就是退化。',
        '面板 ② 切到"已排序"那组：每次递归调用的当前子数组只比上一次**短一格** —— 递归深度变成 $n$，这就是 7.2 要分析的最坏情况。',
        '★ 数一数面板 ① 的"比较"读数：应该恰好是 $r - p = 7$（8 个元素）。这就是习题 7.1-3 的 $\\Theta(n)$。',
      ],
      note: '★ 颜色映射说明：原书 Figure 7.1/7.2 用 tan / 蓝 / 白 / 黄 区分四区，本站按设计规范改用**设计令牌 + 文字标签**（青色 = ≤ x 的低侧、蓝色 = > x 的高侧、琥珀 = 当前正在看的元素、紫色粗框 = 轴）。状态不能只靠颜色区分，所以每个格子下面都有文字。' },

    { type: 'code', title: '从伪代码到 C',
      intro: '★ PARTITION 是本章唯一的"核心件"，QUICKSORT 只是五行的外壳。这份 C 两段都实现，另外实现了**降序版**（习题 7.1-4 只需把第 4 行的 ≤ 反成 ≥）。',
      pseudocodeRef: 'PARTITION',
      c: {
        file: 'quicksort.c',
        code: String.raw`/* quicksort.c -- 7.1 节 QUICKSORT 与 PARTITION 的实现、不变量与实测。
 *
 * 对应原书 p.183-184（已按渲染页逐行核对，缩进按书补齐）：
 *   QUICKSORT(A, p, r)
 *   1  if p < r
 *   2      // Partition the subarray around the pivot, which ends up in A[q].
 *   3      q = PARTITION(A, p, r)
 *   4      QUICKSORT(A, p, q − 1)     // recursively sort the low side
 *   5      QUICKSORT(A, q + 1, r)     // recursively sort the high side
 *
 *   PARTITION(A, p, r)
 *   1  x = A[r]                       // the pivot
 *   2  i = p − 1                      // highest index into the low side
 *   3  for j = p to r − 1             // process each element other than the pivot
 *   4      if A[j] ≤ x                // does this element belong on the low side?
 *   5          i = i + 1              // index of a new slot in the low side
 *   6          exchange A[i] with A[j]     // put this element there
 *   7  exchange A[i + 1] with A[r]    // pivot goes just to the right of the low side
 *   8  return i + 1                   // new index of the pivot
 *
 * ★ 原书 p.184 给出了 PARTITION 的**循环不变量**（三条：低侧 ≤ x、高侧 > x、A[r] = x）
 *   以及完整的初始化/保持/终止论证 —— 本文件把它变成每一轮都可执行的检查。
 *
 * 验证六件事：
 *   1. PARTITION 之后：A[q] 是轴、左侧全部 ≤ 轴、右侧全部 > 轴，元素集合不变；
 *   2. 习题 7.1-3：PARTITION 在 n 个元素上恰好做 r − p 次比较 = Θ(n)；
 *   3. PARTITION 的循环不变量在**每一轮之后**都成立（原书 p.184 的三条）；
 *   4. 习题 7.1-2：全部元素相同时 q 返回 r —— 这正是最坏情况的成因；
 *   5. QUICKSORT 排好序（含重复与负数），且习题 7.1-1 的数组可逐步追踪；
 *   6. 习题 7.1-4：改成降序排序只需把第 4 行的 ≤ 反成 ≥（两种方向都实现并对照）。
 *
 * 下标约定：函数保持 1 基语义（与书一致），只在访问 a[] 时减 1。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o quicksort quicksort.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#define MAXN 32

typedef struct {
    long cmp;      /* 第 4 行被求值的次数（PARTITION）/ 递归调用里的比较次数 */
    long swap;     /* 第 6 行与第 7 行的交换次数 */
    long calls;    /* QUICKSORT 被调用的次数（含立即返回的空调用） */
} stats_t;

/* ---------------------- PARTITION（原书 8 行） ---------------------- */
static int partition(int *a, int p, int r, stats_t *st)
{
    int x = a[r - 1];                    /* 第 1 行：x = A[r]（轴） */
    int i = p - 1;                       /* 第 2 行：i = p − 1 */
    for (int j = p; j <= r - 1; j++) {   /* 第 3 行 */
        st->cmp++;
        if (a[j - 1] <= x) {             /* 第 4 行 */
            i++;                         /* 第 5 行 */
            int t = a[i - 1];            /* 第 6 行：exchange A[i] with A[j] */
            a[i - 1] = a[j - 1];
            a[j - 1] = t;
            st->swap++;
        }
    }
    {   /* 第 7 行：exchange A[i + 1] with A[r] */
        int t = a[i];
        a[i] = a[r - 1];
        a[r - 1] = t;
        st->swap++;
    }
    return i + 1;                        /* 第 8 行：return i + 1 */
}

/* 习题 7.1-4：把第 4 行的 ≤ 反成 ≥，就得到降序排序用的分区 */
static int partition_desc(int *a, int p, int r, stats_t *st)
{
    int x = a[r - 1];
    int i = p - 1;
    for (int j = p; j <= r - 1; j++) {
        st->cmp++;
        if (a[j - 1] >= x) {
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

/* ---------------------- QUICKSORT（原书 5 行） ---------------------- */
static void quicksort(int *a, int p, int r, stats_t *st)
{
    st->calls++;
    if (p < r) {                                  /* 第 1 行 */
        int q = partition(a, p, r, st);           /* 第 3 行 */
        quicksort(a, p, q - 1, st);               /* 第 4 行：low side */
        quicksort(a, q + 1, r, st);               /* 第 5 行：high side */
    }
}

/* 习题 7.1-4：降序版（只有第 3 行换了分区函数） */
static void quicksort_desc(int *a, int p, int r, stats_t *st)
{
    st->calls++;
    if (p < r) {
        int q = partition_desc(a, p, r, st);
        quicksort_desc(a, p, q - 1, st);
        quicksort_desc(a, q + 1, r, st);
    }
}

/* --------------------------- 工具 --------------------------- */
static bool is_sorted(const int *a, int n)
{
    for (int i = 1; i < n; i++) { if (a[i - 1] > a[i]) { return false; } }
    return true;
}

static bool is_sorted_desc(const int *a, int n)
{
    for (int i = 1; i < n; i++) { if (a[i - 1] < a[i]) { return false; } }
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

static void print_array(const char *label, const int *a, int n)
{
    printf("      %s⟨", label);
    for (int i = 0; i < n; i++) { printf("%d%s", a[i], i + 1 < n ? "," : ""); }
    printf("⟩\n");
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

/* 习题 7.1-1 的逐步追踪：每次交换后打印一行 */
static void trace_partition(const int *src, int n)
{
    int a[MAXN];
    memcpy(a, src, (size_t)n * sizeof(int));
    int p = 1, r = n;
    int x = a[r - 1];
    int i = p - 1;
    print_array("习题 7.1-1 初始：", a, n);
    for (int j = p; j <= r - 1; j++) {
        if (a[j - 1] <= x) {
            i++;
            int t = a[i - 1];
            a[i - 1] = a[j - 1];
            a[j - 1] = t;
            printf("      A[%d] ≤ 轴：交换后 ", j);
            print_array("", a, n);
        }
    }
    {
        int t = a[i];
        a[i] = a[r - 1];
        a[r - 1] = t;
        printf("      轴归位后 ");
        print_array("", a, n);
    }
}

int main(void)
{
    /* ---- 1. PARTITION 的结论（p.184 的不变量在循环结束时的形态）---- */
    {
        int checked = 0;
        for (int t = 1; t <= 200; t++) {
            int n = 1 + (t % 28);
            int a[MAXN], before[MAXN];
            rnd_seed((unsigned)(t * 401 + 9));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 300); }
            memcpy(before, a, (size_t)n * sizeof(int));
            stats_t st = {0, 0, 0};
            int q = partition(a, 1, n, &st);
            assert(q >= 1 && q <= n);
            assert(a[q - 1] == before[n - 1]);          /* A[q] 是轴 */
            for (int k = 1; k <= q - 1; k++) { assert(a[k - 1] <= a[q - 1]); }
            for (int k = q + 1; k <= n; k++) { assert(a[k - 1] > a[q - 1]); }
            assert(same_bag(a, before, n));
            checked++;
        }
        printf("part 1: 200 组输入分区后都满足「A[q] 是轴、左侧 ≤ 轴、右侧 > 轴」，元素集合不变\n");
    }

    /* ---- 2. 习题 7.1-3：比较次数恰好是 r − p，即 Θ(n) ---- */
    {
        int all_ok = 1;
        for (int n = 1; n <= 28; n++) {
            int a[MAXN];
            rnd_seed((unsigned)(n * 77 + 1));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 100); }
            stats_t st = {0, 0, 0};
            (void)partition(a, 1, n, &st);
            /* r − p = n − 1；PARTITION 在第 4 行上恰好做 n − 1 次比较 */
            if (st.cmp != n - 1) { all_ok = 0; }
        }
        assert(all_ok);
        puts("part 2: n = 1..28 的比较次数都恰好等于 r − p = n − 1（习题 7.1-3 的 Θ(n)）");
    }

    /* ---- 3. 循环不变量：每一轮之后都成立（原书 p.184 的三条）---- */
    {
        long rounds = 0;
        for (int t = 1; t <= 60; t++) {
            int n = 2 + (t % 28);
            int a[MAXN];
            rnd_seed((unsigned)(t * 233 + 7));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 200); }
            int x = a[n - 1];
            /* 下面这一段用 **0 基** 下标模拟书上第 3–6 行（书是 1 基）：
             *   书的 i = p − 1 = 0（1 基）→ 0 基是 −1（"区间外"）
             *   书的 j 从 p 到 r − 1 → 0 基从 0 到 n − 2
             * 写错过一次（把 i 初始化成 0、j 从 1 开始），断言当场报 a[n−1] != x。 */
            int i = -1;
            for (int j = 0; j <= n - 2; j++) {
                if (a[j] <= x) {
                    i++;
                    int t2 = a[i]; a[i] = a[j]; a[j] = t2;
                }
                /* 不变量（按 1 基）：① A[1..i+1] 全部 ≤ x；② A[i+2..j+1] 全部 > x；
                 * ③ A[n] = x。换算成 0 基就是下面三行。 */
                for (int k = 0; k <= i; k++) { assert(a[k] <= x); }
                for (int k = i + 1; k <= j; k++) { assert(a[k] > x); }
                assert(a[n - 1] == x);
                rounds++;
            }
        }
        printf("part 3: %ld 轮里循环不变量（①低侧 ≤ x ②高侧 > x ③A[r] = x）从未被破坏\n", rounds);
    }

    /* ---- 4. 习题 7.1-2：全部相同时 q = r ---- */
    {
        for (int n = 1; n <= 20; n++) {
            int a[MAXN];
            for (int i = 0; i < n; i++) { a[i] = 42; }
            stats_t st = {0, 0, 0};
            int q = partition(a, 1, n, &st);
            assert(q == n);
        }
        puts("part 4: 全部元素相同时 q = r（习题 7.1-2）—— 每次分区都是 0 : (n−1)，最坏情况的成因");
    }

    /* ---- 5. 习题 7.1-1 的逐步追踪 ---- */
    {
        static const int EX711[12] = {13, 19, 9, 5, 12, 8, 7, 4, 21, 2, 6, 11};
        int a[MAXN];
        memcpy(a, EX711, sizeof(EX711));
        trace_partition(EX711, 12);
        stats_t st = {0, 0, 0};
        int q = partition(a, 1, 12, &st);
        assert(a[q - 1] == 11);
        assert(same_bag(a, EX711, 12));
        printf("      轴 11 落在下标 %d；共 %ld 次比较、%ld 次交换\n", q, st.cmp, st.swap);
    }

    /* ---- 6. QUICKSORT：排序正确性 + 调用次数随输入形态变化 ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 120; t++) {
            int n = 1 + (t % 30);
            int a[MAXN], before[MAXN];
            rnd_seed((unsigned)(t * 613 + 17));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 200) - 100; }
            memcpy(before, a, (size_t)n * sizeof(int));
            stats_t st = {0, 0, 0};
            quicksort(a, 1, n, &st);
            assert(is_sorted(a, n));
            assert(same_bag(a, before, n));
            checked++;
        }
        printf("part 6a: %d 组随机输入（含负数）都排好序且元素集合不变\n", checked);

        /* 习题 7.1-4：降序版 */
        {
            int a[MAXN];
            rnd_seed(4242);
            for (int i = 0; i < 20; i++) { a[i] = (int)(rnd_next() % 100); }
            stats_t st = {0, 0, 0};
            quicksort_desc(a, 1, 20, &st);
            assert(is_sorted_desc(a, 20));
            puts("part 6b: 把第 4 行的 ≤ 反成 ≥（习题 7.1-4）→ 排成降序，结构一字不改");
        }

        /* 最坏 vs 一般：递增输入 + 固定取末元素当轴 → 每层只切掉一个元素 */
        {
            int n = 24;
            int asc[MAXN], rnd[MAXN];
            for (int i = 0; i < n; i++) { asc[i] = i + 1; }
            stats_t s1 = {0, 0, 0};
            quicksort(asc, 1, n, &s1);
            assert(is_sorted(asc, n));
            assert(s1.calls == 2 * n - 1);      /* 非空 n 次 + 空 n−1 次 = 2n − 1 */

            rnd_seed(31337);
            for (int i = 0; i < n; i++) { rnd[i] = (int)(rnd_next() % 1000); }
            stats_t s2 = {0, 0, 0};
            quicksort(rnd, 1, n, &s2);
            assert(is_sorted(rnd, n));
            printf("part 6c: n = %d 时递增输入调用 %ld 次（最坏形态：每层只切掉一个元素），"
                   "随机输入调用 %ld 次\n", n, s1.calls, s2.calls);
            assert(s1.calls > s2.calls);         /* 最坏形态的调用次数明显更多 */
        }
    }

    puts("all checks passed.");
    return 0;
}
`,
        notes: [
          { line: 50, zh: '★ `partition` 与书上 8 行一一对应：第 52 行 `int x = a[r - 1];` 是第 1 行，第 54 行 `int i = p - 1;` 是第 2 行，第 56 行的 for 是第 3 行。' },
          { line: 56, zh: '★ 第 3 行的循环上界是 `j <= r - 1` —— **不含 r**，因为 $A[r]$ 是轴自己。写成 `j <= r` 会拿轴跟自己比，还会多算一次比较。' },
          { line: 58, zh: '★ 第 4 行的 `a[j - 1] <= x`：注意是 **≤** 不是 <。相等的元素进低侧 —— 这个选择让"全部相同"的输入退化（习题 7.1-2）。' },
          { line: 74, zh: '习题 7.1-4：`partition_desc` 只把第 4 行的 `<=` 反成 `>=`，其余一字不改。降序版的 QUICKSORT 也只是把第 3 行换成这个函数。' },
          { line: 98, zh: '★ `quicksort` 与书上 5 行一一对应。注意递归调用是 `q - 1` 与 `q + 1` —— **不含轴**。' },
          { line: 173, zh: '`trace_partition`：习题 7.1-1 的逐步追踪，每次交换后打印一行 —— 对应 Figure 7.1 的 9 幅子图。' },
          { line: 214, zh: '★ 第 1 组断言：200 组输入分区后，$A[q]$ 必须等于**原数组的最后一个元素**（轴没被弄丢）、左侧全 ≤ 轴、右侧全 > 轴、元素集合不变。' },
          { line: 262, zh: '★ 第 3 组断言：循环不变量的三条（低侧 ≤ x、高侧 > x、A[r] = x）在**每一轮之后**都检查 —— 这把原书 p.184 的证明变成了可执行检查（826 轮无一例外）。\n\n★ 这里我犯过一次 off-by-one：把书上的 1 基 $i = p - 1$、$j = p$ 直接搬成 0 基的 `i = 0`、`j = 1`，结果 `a[n-1] != x` 当场报错。书上"越界下标表示空集"的那一招，在 0 基里对应的是 `i = -1`。' },
          { line: 276, zh: '★ 第 4 组（习题 7.1-2）：全部相同时 q 必须返回 r。这是最坏情况的成因 —— 每次分区都是 0 : (n−1)。' },
          { line: 330, zh: '★ 第 6c 组：n = 24 时，递增输入让 QUICKSORT 被调用 2n − 1 = 47 次（非空 24 + 空 23，每层只切掉一个元素），而随机输入只调用 29 次 —— 7.2 的"最坏情况"在调用次数上已经可见。' },
        ],
        tests: [
          { in: '200 组随机输入', out: '分区后 A[q] = 原末元素、左侧 ≤ 轴、右侧 > 轴、元素集合不变' },
          { in: 'n = 1..28 数 PARTITION 的比较次数', out: '恰好 r − p = n − 1 次（习题 7.1-3 的 Θ(n)）' },
          { in: '60 组输入 × 每轮循环后', out: '826 轮里循环不变量三条都成立（原书 p.184）' },
          { in: '全部元素相同（n = 1..20）', out: 'q = r（习题 7.1-2）' },
          { in: '⟨13,19,9,5,12,8,7,4,21,2,6,11⟩（习题 7.1-1）', out: '轴 11 落在下标 8；11 次比较、8 次交换' },
          { in: '120 组随机输入 + 全排列', out: 'QUICKSORT 都排好序；4 个元素的全排列都得到 [1,2,3,4]' },
          { in: 'n = 24，递增 vs 随机输入', out: '递增调用 47 次（2n−1）、随机 29 次 —— 最坏形态可见' },
          { in: '编译与运行', out: 'gcc -std=c99 -Wall -Wextra -Werror 零警告；全部断言通过，输出 all checks passed.' },
        ],
      },
      mapping: [
        { pc: 1, pcCode: 'if p < r', c: '`if (p < r) {`（第 100 行）' },
        { pc: 3, pcCode: 'q = PARTITION(A, p, r)', c: '`int q = partition(a, p, r, st);`（第 102 行）' },
        { pc: 4, pcCode: 'QUICKSORT(A, p, q − 1)', c: '`quicksort(a, p, q - 1, st);`（第 103 行）' },
        { pc: 5, pcCode: 'QUICKSORT(A, q + 1, r)', c: '`quicksort(a, q + 1, r, st);`（第 104 行）' },
        { pc: 1, pcCode: 'x = A[r]', c: '`int x = a[r - 1];`（第 52 行）' },
        { pc: 2, pcCode: 'i = p − 1', c: '`int i = p - 1;`（第 54 行）' },
        { pc: 3, pcCode: 'for j = p to r − 1', c: '`for (int j = p; j <= r - 1; j++)`（第 56 行）' },
        { pc: 4, pcCode: 'if A[j] ≤ x', c: '`if (a[j - 1] <= x)`（第 58 行）—— 降序版用 `>=`（第 80 行）' },
        { pc: 5, pcCode: 'i = i + 1', c: '`i++;`（第 59 行）' },
        { pc: 6, pcCode: 'exchange A[i] with A[j]', c: '三行交换（第 60–62 行）' },
        { pc: 7, pcCode: 'exchange A[i + 1] with A[r]', c: '三行交换（第 67–69 行）' },
        { pc: 8, pcCode: 'return i + 1', c: '`return i + 1;`（第 71 行）' },
      ] },

    { type: 'analyze', title: 'PARTITION 是 Θ(n)，QUICKSORT 的时间取决于"分得多匀"',
      intro: '本关只定下一半：PARTITION 是 $\\Theta(n)$（线性、原地）。另一半 —— QUICKSORT 总共要多少时间 —— 取决于每次分区把数组切得多匀，那是 7.2 的主题。这里先把能确定的部分钉死。',
      claims: [
        { expr: '\\Theta(n)', when: 'PARTITION 在 n = r − p + 1 个元素上的运行时间（习题 7.1-3）', page: 186, source: 'book' },
        { expr: 'r − p', when: 'PARTITION 第 3 行循环的轮数（恰好走一遍未看区）', page: 184, source: 'book' },
        { expr: 'O(1)', when: 'PARTITION 的额外空间（只在数组内交换）', page: 183, source: 'book' },
      ],
      tables: [
        { caption: '分治三步在两种算法里的分工（本关的理解框架）', rows: [
          ['', 'MERGE-SORT（2.3）', 'QUICKSORT（7.1）'],
          ['Divide', '从中间切一刀，$\\Theta(1)$', '**PARTITION**，$\\Theta(n)$ ← 主要工作'],
          ['Conquer', '递归两半', '递归两段（长度由轴决定）'],
          ['Combine', '**MERGE**，$\\Theta(n)$ ← 主要工作', '什么都不做'],
          ['额外空间', '$\\Theta(n)$（L、R 两个数组）', '$O(1)$（原地）'],
          ['稳定吗', '稳定', '不稳定（长距离交换）'],
        ] },
        { caption: 'PARTITION 的四个区（Figure 7.2；本站用令牌 + 文字标签表示）', rows: [
          ['区', '下标范围', '性质', '本站表示'],
          ['低侧', '$A[p : i]$', '全部 $\\le x$', '青色 + 「≤ x」'],
          ['高侧', '$A[i+1 : j-1]$', '全部 $> x$', '蓝色 + 「> x」'],
          ['未看', '$A[j : r-1]$', '未知', '灰色（无标签）'],
          ['轴', '$A[r]$', '$= x$', '紫色粗框 + 「轴」'],
        ] },
      ],
      derivations: [
        { kind: 'summation', title: 'PARTITION 为什么是 Θ(n)（习题 7.1-3）', steps: [
          { zh: '第 3 行的循环从 $j = p$ 走到 $j = r - 1$，共 $r - p$ 轮；而 $n = r - p + 1$，所以是 $n - 1$ 轮。' },
          { tex: 'r - p = (r - p + 1) - 1 = n - 1', zh: '每轮做的事：一次比较（第 4 行）加上至多一次交换与两次下标更新（第 5–6 行），都是 $O(1)$。' },
          { tex: 'T(n) = (n-1) \\cdot \\Theta(1) = \\Theta(n)', zh: '★ 阶段 6 的 C 程序对 $n = 1 \\dots 28$ 实测：比较次数**恰好**等于 $n - 1$，不多不少。' },
          { zh: '★ 别漏了下界那一半：每个元素都必须被看过一次才能决定去哪侧，所以 $\\Omega(n)$ 也成立 —— 于是是 $\\Theta(n)$ 而不只是 $O(n)$。' },
        ] },
        { kind: 'summation', title: '为什么轴在分区后就"就位"了', steps: [
          { zh: 'PARTITION 结束时：低侧全部 $\\le x$、高侧全部 $> x$、轴 $x$ 被夹在中间（原书 Termination 那段的"a singleton set containing x"）。' },
          { tex: 'A[p:q-1] \\le A[q] < A[q+1:r]', zh: '原书 p.185 还给出一个**略强**的结论：第 7 行换走的是高侧里**位置最靠左**的元素，所以交换后 $A[q]$ **严格小于**右侧每一个元素。' },
          { tex: '\\Rightarrow \\text{A[q] 已在最终位置}', zh: '★ 因为左右两侧的递归都**不包含** $q$（QUICKSORT 第 4–5 行是 $q-1$ 与 $q+1$），轴不会再被移动。' },
          { zh: '★ 对照归并排序：它的每次递归都覆盖全部元素，要等最后一层合并完才"整体有序"。快速排序则是**每层都确定若干元素的最终位置** —— 这也是为什么它能"边排边用"（比如 9.2 的 RANDOMIZED-SELECT 只递归一边）。' },
        ] },
      ],
      note: '★ 本关不画增长曲线：PARTITION 是线性的，没有"多条曲线拉开差距"的故事可讲；真正值得画的是 7.2 里"分区均衡程度如何决定总时间"。' },

    { type: 'prove', title: '凭什么说分区一定分对了',
      statement: 'At the beginning of each iteration of the loop of lines 3–6, for any array index k, the following conditions hold: 1. if p ≤ k ≤ i, then A[k] ≤ x (the tan region of Figure 7.2); 2. if i + 1 ≤ k ≤ j − 1, then A[k] > x (the blue region); 3. if k = r, then A[k] = x (the yellow region).',
      page: 184,
      intro: '★ 这条不变量与三步论证**全部逐字取自原书 p.184**（阶段 3 已引）—— 原书在这一节给了完整的证明，不像 6.4 那样把它留成习题。三条分别对应图上的三个有色区域，第四区（未看）不在不变量里，因为还没看。',
      steps: [
        { title: '第一步 · 初始化（Initialization）：循环前的空真',
          en: 'Initialization: Prior to the first iteration of the loop, we have i = p − 1 and j = p. Because no values lie between p and i and no values lie between i + 1 and j − 1, the first two conditions of the loop invariant are trivially satisfied.',
          page: 184,
          body: [
            '$i = p - 1$、$j = p$，于是：\n条件 1 的区间 $[p, i] = [p, p-1]$ 为**空**；\n条件 2 的区间 $[i+1, j-1] = [p+1, p-1]$ 也为**空**。',
            '空区间上的"对所有 $k$ 都…"自动成立（空真，vacuously true）。条件 3 呢？$A[r] = x$ 由第 1 行直接赋值保证。',
            '★ "用越界下标表示空集"是这一步的全部技巧：$i = p - 1$ 这个看似奇怪的初始值，正是为了让两个区间一开始都为空 —— 不需要任何额外判断。',
          ] },
        { title: '第二步 · 保持（Maintenance）：两种情况，两个方向都要说清',
          en: 'Maintenance: As Figure 7.3 shows, we consider two cases, depending on the outcome of the test in line 4. Figure 7.3(a) shows what happens when A[j]>x : the only action in the loop is to increment j . After j has been incremented, the second condition holds for A[j − 1] and all other entries remain unchanged.',
          page: 184,
          body: [
            '**情况 (a)：$A[j] > x$。** 只做一件事：$j$ 加 1。于是那个大于 $x$ 的元素从"未看区"落进了"高侧"（条件 2 的区间右端从 $j-1$ 扩到 $j$），其它一切不变。',
            '**情况 (b)：$A[j] \\le x$。** 三步：$i$ 加 1、交换 $A[i]$ 与 $A[j]$、$j$ 加 1。交换后 $A[i] \\le x$（条件 1 对新区间成立）。',
            '★ **最精妙的一步**：被换到 $A[j-1]$ 的那个元素为什么一定 $> x$？原书的回答是"by the loop invariant, greater than x" —— 因为它**原来在 $A[i]$**，而不变量说高侧（$A[i+1:j-1]$）的元素都 $> x$。**用不变量证明交换本身的正确性**，这是循环不变量法的精髓。',
            '两个方向都要说：进入低侧的（$A[i] \\le x$）与留在高侧的（$A[j-1] > x$）。漏掉任何一边，证明就不完整。',
          ] },
        { title: '第三步 · 终止（Termination）：恰好 r − p 轮',
          en: 'Termination: Since the loop makes exactly r − p iterations, it terminates, whereupon j = r . At that point, the unexamined subarray A[j : r − 1] is empty, and every entry in the array belongs to one of the other three sets described by the invariant.',
          page: 184,
          body: [
            '循环恰好 $r - p$ 轮后 $j = r$，"未看区" $A[j : r-1]$ 变成**空**。于是数组里每个元素都落在不变量描述的三个集合之一：低侧（$\\le x$）、高侧（$> x$）、轴（单独一个）。',
            '★ 这就是 PARTITION 要保证的全部：**轴被夹在正中间，左边都不大于它，右边都大于它**。至于左右两侧内部是否有序 —— 不关它的事，那是递归的事。',
            '★ 顺带得到复杂度：恰好 $r - p = n - 1$ 轮、每轮 $O(1)$，所以 PARTITION 是 $\\Theta(n)$（习题 7.1-3）。阶段 6 的 C 程序对 $n = 1 \\dots 28$ 实测比较次数恰好等于 $n - 1$。',
          ] },
      ],
      conclusion: '★ 结论：PARTITION 把 $A[p:r]$ 分成"低侧 ≤ 轴 / 轴 / 高侧 > 轴"三部分并返回轴的下标。QUICKSORT 拿着这个下标递归两侧，而且递归区间**不含**轴 —— 因为轴已经就位。Combine 之所以免费，正是因为分区把"谁该在哪边"这件事一次性说清了。',
      note: '' },

    { type: 'drill', title: '检验一下',
      items: [
        { kind: 'single', q: 'PARTITION 选哪个元素当轴（pivot）？',
          options: ['$A[p]$（第一个）', '$A[r]$（最后一个）', '中间那个', '三者的中位数'], answer: 1,
          why: '★ 原书 p.183："PARTITION always selects the element x = A[r] as the pivot"。这个固定选法正是 7.2 最坏情况与 7.3 随机化的出发点。' },
        { kind: 'single', q: 'PARTITION 的循环（第 3–6 行）一共跑几轮？',
          options: ['$n$', '$n - 1$', '$n + 1$', '$\\lfloor n/2 \\rfloor$'], answer: 1,
          why: '$j$ 从 $p$ 走到 $r-1$，共 $r - p = n - 1$ 轮（$n = r - p + 1$）。每轮 $O(1)$，所以 PARTITION 是 $\\Theta(n)$（习题 7.1-3）。' },
        { kind: 'single', q: 'QUICKSORT 第 4–5 行的递归区间为什么是 $q-1$ 与 $q+1$，而不是 $q$？',
          options: ['避免数组越界', '因为 $A[q]$（轴）已经在它的最终位置上，不需要再排', '为了让递归深度减半', '书写习惯，用 $q$ 也一样'], answer: 1,
          why: '★ 分区之后轴已经就位（左侧 ≤ 它 ≤ 右侧），把它再包进递归区间只会多做无用功、还可能死循环。这也解释了为什么快速排序"每层都确定若干元素的最终位置"。' },
        { kind: 'judge', q: 'PARTITION 会把数组排成有序的。', answer: false,
          why: '★ 不会。它只保证"低侧 ≤ 轴 ≤ 高侧"，两侧内部仍然乱序 —— 排序要靠递归。这也是为什么快速排序的 Combine 是免费的：不需要合并，但**两侧内部**要靠递归自己解决。' },
        { kind: 'single', q: '当子数组里所有元素都相同时，PARTITION 返回的 $q$ 是？',
          options: ['$p$', '$\\lfloor (p+r)/2 \\rfloor$', '$r$', '不确定'], answer: 2,
          why: '★ 全部相等时每个元素都 ≤ 轴、全部进低侧，$i$ 一路加到 $r - 1$，于是 $q = r$。结果是分区变成"空 : (n−1)"—— 最坏情况的成因之一（习题 7.1-2）。' },
        { kind: 'single', q: '快速排序相比归并排序最大的实践优势是？',
          options: ['最坏情况更好', '原地排序（额外空间 O(1)）', '更稳定', '不需要递归'], answer: 1,
          why: '★ PARTITION 只在数组内交换，额外空间 $O(1)$；归并排序需要 $\\Theta(n)$ 的 L、R 辅助数组。但代价是快速排序**不稳定**（长距离交换打乱相同键的次序），且最坏 $\\Theta(n^2)$。' },
        { kind: 'judge', q: 'PARTITION 的循环不变量里，对"还没看过的区域"（$A[j : r-1]$）也规定了性质。', answer: false,
          why: '★ 没有。三条不变量只覆盖低侧（$\\le x$）、高侧（$> x$）与轴（$= x$）—— 未看区**还没有任何性质可言**，这正是它的含义："unknown"。' },
        { kind: 'simulate', q: '对 ⟨2,8,7,1,3,5,6,4⟩（原书 Figure 7.1 的数组）做一次 PARTITION，轴 4 会落在下标几？（1 基，填整数）', expect: [4], placeholder: '例如：4',
          why: '★ 轴 4 的最终下标是 4：左边是 2,1,3（都 ≤ 4），右边是 7,5,6（都 > 4）。阶段 5 面板 ① 的第一组就是这道题；阶段 6 的 C 程序也断言了同样的结果。' },
      ],
      bookExercises: [
        { id: '7.1-1', page: 186, star: 0,
          statement: 'Using Figure 7.1 as a model, illustrate the operation of PARTITION on the array A = ⟨13,19,9,5,12,8,7,4,21,2,6,11⟩.',
          hint: '照着 Figure 7.1 的画法：每轮标出 $i$、$j$ 的位置与四区边界。轴是最后的 11。阶段 5 面板 ① 的第 2 组预设就是这道题；阶段 6 的 C 程序会把每次交换后的数组逐行打印出来。' },
        { id: '7.1-2', page: 187, star: 0,
          statement: 'What value of q does PARTITION return when all elements in the subarray A[p : r] have the same value? Modify PARTITION so that q = ⌊(p + r)/2⌋ when all elements in the subarray A[p : r] have the same value.',
          hint: '★ 第一问答 $r$（每个元素都 ≤ 轴，全部进低侧）。第二问需要把"等于轴"的元素**对半分**：常见做法是让扫描时把等于轴的元素交替放进两侧，或者统计等于轴的个数再把轴换到中间。阶段 6 的 C 程序实测了第一问。' },
        { id: '7.1-3', page: 187, star: 0,
          statement: 'Give a brief argument that the running time of PARTITION on a subarray of size n is Θ(n).',
          hint: '★ 两个方向都要：第 3 行恰好跑 $r - p = n - 1$ 轮、每轮 $O(1)$ 给出 $O(n)$；而每个元素至少被比较一次才能决定去哪侧，给出 $\\Omega(n)$。阶段 7 的推导里有完整两步，阶段 6 的 C 程序实测比较次数恰好等于 $n - 1$。' },
        { id: '7.1-4', page: 187, star: 0,
          statement: 'Modify QUICKSORT to sort into monotonically decreasing order.',
          hint: '只改 PARTITION 的第 4 行：把 `A[j] ≤ x` 反成 `A[j] ≥ x`。阶段 6 的 C 程序实现了这个降序版（partition_desc / quicksort_desc）并验证了结果确实是降序 —— 结构一字不改。' },
      ] },
  ],
};
