/* =============================================================================
 * 第 4 章 4.4 —— 递归树法（The recursion-tree method）
 *
 * 原文锚点：印刷页 95–100（pdf_index 116–121）
 *
 * 本关的两条递归式（原书 4.13 / 4.14）：
 *   主例    T(n) = 3T(n/4) + Θ(n²)   —— 图 4.1，均匀三叉树，几何级数收敛
 *   不规则  T(n) = T(n/3) + T(2n/3) + Θ(n) —— 图 4.2，歪树，每层合计恒为 n
 *
 * 所有 en 引述逐字取自 data/blocks/part-i-foundations__ch04.json，并已通过
 * tools/04_verify_level.py 的连续性溯源判据。要改引述，先回原文核对。
 * ========================================================================== */

/* ---- 图 4.1 的逐帧展开（n = 64 = 4³，让树画得出来；书上的图是符号形式）----
 * 深度 d 的结点：规模 n/4^d，代价 c·(n/4^d)²；层合计 = n²·(3/16)^d。 */
function node41(d, id, expandTo, asLeaf) {
  const size = d === 0 ? 'n' : 'n/' + Math.pow(4, d).toString();
  if (d >= expandTo) {
    // 未展开的子树画成一颗「待展开」结点；最后一帧把最底层标记为叶子 Θ(1)
    return {
      id,
      label: asLeaf ? 'Θ(1)' : 'T(' + size + ')',
      cost: asLeaf ? 'Θ(1)' : 'c·' + size + '²',
      state: asLeaf ? 'done' : undefined,
    };
  }
  return {
    id,
    label: 'T(' + size + ')',
    cost: 'c·' + size + '²',
    children: [0, 1, 2].map((k) => node41(d + 1, id + k, expandTo, asLeaf)),
  };
}

/* ---- 图 4.2 的歪树（n = 81 = 3⁴；往左 1/3、往右 2/3）----
 * 最重的路径（每次走 2/3）决定树高，用 path 高亮。 */
function node42(d, size, id, expandTo, asLeaf) {
  if (d >= expandTo) {
    return {
      id,
      label: asLeaf ? 'Θ(1)' : 'T(' + size + ')',
      cost: asLeaf ? 'Θ(1)' : 'c·' + size,
    };
  }
  return {
    id,
    label: 'T(' + size + ')',
    cost: 'c·' + size,
    children: [
      node42(d + 1, Math.round(size / 3), id + 'l', expandTo, asLeaf),
      node42(d + 1, Math.round((size * 2) / 3), id + 'r', expandTo, asLeaf),
    ],
  };
}

const FIG41 = [
  { root: node41(0, 'r', 0, false) },
  { root: node41(0, 'r', 1, false) },
  { root: node41(0, 'r', 2, false) },
  { root: node41(0, 'r', 3, false) },
  { root: node41(0, 'r', 3, true) },
];

const FIG42 = [
  { root: node42(0, 81, 'r', 0, false) },
  { root: node42(0, 81, 'r', 1, false) },
  { root: node42(0, 81, 'r', 2, false) },
  { root: node42(0, 81, 'r', 3, false), path: ['r', 'rr', 'rrr', 'rrrr'] },
  { root: node42(0, 81, 'r', 3, true), path: ['r', 'rr', 'rrr', 'rrrr'] },
];

export default {
  key: 's04',
  id: 'ch04/s04',
  chapter: 4,
  section: '4.4',
  title: '递归树法：把递归式画成一本成本账',
  shortTitle: '4.4 递归树法',
  titleEn: 'The recursion-tree method for solving recurrences',
  source: { printed: [95, 100], pdf: [116, 121] },
  sourceNote: '本关对应原书 4.4 节（印刷页 95–100）。',
  prerequisites: [
    { label: '3.1 三种渐进记号', url: '#/ch03/s01' },
    { label: '4.3 代入法', url: '#/ch04/s03' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '递归树：从「猜」到「证」的桥',
      why:
        '4.3 节的代入法有个鸡生蛋问题：**你得先有一个猜测才能验证它**。' +
        '猜测从哪来？递归树。把递归式画成一棵树，每个结点标上代价，逐层求和——' +
        '猜测自己会长出来。本关用书上两个例子把这套手法练熟。',
      position:
        '前置：3.1 的记号、4.3 的代入法（本关的猜测最后都要交给它盖章）。' +
        '本关给两个标准例子：均匀三叉树 $3T(n/4)+\\Theta(n^2)$（图 4.1，几何级数收敛）' +
        '与歪树 $T(n/3)+T(2n/3)+\\Theta(n)$（图 4.2，每层合计恒为 $n$）。' +
        '下一关 4.5 的主方法，就是把这套「逐层求和」做成查表公式。',
      unlocks: [
        { label: '4.5 主方法', url: '#/ch04/s05' },
        { label: '4.6 连续主定理的证明', url: '#/ch04/s06' },
      ],
      mathKit: [
        {
          title: '几何级数',
          body:
            '$\\sum_{i=0}^{k} r^i = \\frac{1-r^{k+1}}{1-r}$。$r < 1$ 时收敛到 $\\frac{1}{1-r}$。' +
            '例 1 的公比是 $3/16$（3 个子问题 ÷ 每层缩小 $4^2=16$ 倍的代价）。',
        },
        {
          title: '层代价 = 结点数 × 单结点代价',
          body:
            '深度 $i$ 处：$3^i$ 个结点 × $c(n/4^i)^2$ $= (3/16)^i cn^2$。' +
            '**结点数在涨、单结点代价在跌**——两者的乘积才是层代价。',
        },
        {
          title: '树高',
          body:
            '子问题规模每层除以 $b$，则 $\\log_b n$ 层到底。歪树取**最重的路径**定树高。',
        },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '一棵树就是一本成本账',
      scene: '公司开支明细：每个部门有自己的开销，逐层汇总成总账——你要看的是「哪一层花得最多」',
      body: [
        '把递归式 $T(n) = 3T(n/4) + cn^2$ 想成一家公司：总部花 $cn^2$ 做合并，' +
        '然后把活儿分给 3 个子公司，每个只管规模 $n/4$ 的问题。子公司再往下分……' +
        '**每个结点标的就是那个结点的开销**。',
        '记账的口径有两层：先算**每一层**的总开销（同一层所有结点加起来），' +
        '再把各层加总。对均匀的树，每层的合计构成一个**几何级数**——' +
        '公比小于 1 就收敛，总账由根主导；公比等于 1 就不收敛，总账由层数决定。',
        '书上把这套方法的定位说得非常清楚：递归树**最好用来产生猜测**，' +
        '猜测再交给 4.3 的代入法验证。但如果画树时足够细致，它本身也能充当直接证明——' +
        '书上说这时候你可以容忍一点 "sloppiness"（马虎），验证时再精确起来。',
      ],
      interactive: {
        text:
          '阶段 5 就是两本账：**例 1**（图 4.1，均匀三叉）逐层展开、逐层衰减；' +
          '**例 2**（图 4.2，歪树）每层合计恒为 $n$，但高度由最重的路径决定。' +
          '注意看两棵树的「每层合计」怎么走向完全不同的结局。',
      },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    // 下面的 en 与 page 逐字取自 data/blocks/part-i-foundations__ch04.json，每条都已通过溯源判据。
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 95,
          en: 'Although you can use the substitution method to pro ve that a solution to a recurrence is correct, you might have trouble coming up with a good guess. Drawing out a recursion tree, as we did in our analysis of the merge-sort recurrence in Section 2.3.2, can help. In a recursion tree, each node represents the cost of a single subproblem somewhere in the set of recursive function invocations. You typically sum the costs within each level of the tree to obtain the per-level costs, and then you sum all the per-level costs to determine the total cost of all levels of the recursion.',
          zh:
            '方法的全部流程就四句话：**画树 → 结点标代价 → 逐层求和 → 各层加总**。' +
            '★ 注意它提到 2.3.2——我们在归并排序那关已经画过一次递归树（图 2.5），' +
            '那次是直觉性的；这次是正式的方法论，而且书上会告诉你什么时候能省略、什么时候不能。' },
        { kind: 'body', page: 95,
          en: 'A recursion tree is best used to generate intuition for a good guess, which you can then verify by the substitution method. If you are meticulous when drawing out a recursion tree and summing the costs, however, you can use a recursion tree as a direct proof of a solution to a recurrence. But if you use it only to generate a good guess, you can often tolerate a small amount of "sl oppiness," which can simplify the math. When you verify your guess with the substitution method later on, your math should be precise. This section demonstrates how you can use recursion trees to solve recurrences, generate good guesses, and gain intuition for recurrences.',
          zh:
            '★ 这一段是本节的「使用说明书」，两档精度：' +
            '①**产生猜测**——可以马虎（原文 "sl oppiness" 的多余空格是 PDF 抽取残留，即 sloppiness）；' +
            '②**直接证明**——必须细致。阶段 8 会演示：树给的猜测要回到代入法盖章。' +
            '书上的态度不是二选一，而是「两档都要会」。' },
        { kind: 'body', page: 95,
          en: 'Let’s see how a recursion tree can provide a good guess for an upper-bound solution to the recurrence',
          zh:
            '本节主例的递归式（4.13）紧跟在这句话后面：$T(n) = 3T(n/4) + \\Theta(n^2)$。' +
            '★ 记号约定：书上说 $c > 0$ 是 $\\Theta(n^2)$ 项里隐藏的上界常数——' +
            '渐进记号拆开成「常数 × 函数」，树上的结点才有数字可标。' },
        { kind: 'body', page: 95,
          en: 'Figure 4.1 shows how to derive the recursion tree for T(n) = 3T(n/4) C cn 2 , where the constant c >0 is the upper-bound constant in the Θ(n 2 ) term. Part (a) of the figure shows T(n), which part (b) expands into an equivalent tree representing the recurrence. The cn 2 term at the root represents the cost at the top level of recursion, and the three subtrees of the root represent the costs incurred by the …',
          zh:
            '★ 式中的 **C 是 PDF 抽取残留的加号**，原式是 $T(n) = 3T(n/4) + cn^2$。' +
            '图 4.1 的四步（(a)→(d)）就是阶段 5 动画的四帧：先有根，再逐层展开。' +
            '「根的 $cn^2$ 代表最顶层的递归代价」——合并子问题的解所花的时间，留在本层。',
        },
        { kind: 'body', page: 97,
          en: 'Because subproblem sizes decrease by a factor of 4 every time we go down one level, the recursion must eventually bottom out in a base case where n <n 0 . By convention, the base case is T(n) = Θ(1) for n < n 0 , where n 0 > 0 is any threshold constant sufficiently large that the recurrence is well defined. For the purpose of intuition, however, let’s simplify the math a little. Let’s assume that n is an exact power of 4 and that the base case is T(1) = Θ(1). As it turns out, these assumptions don’t affect the asym',
          zh:
            '两个简化假设：$n$ 是 4 的整次幂、底为 $T(1) = \\Theta(1)$。' +
            '书上说得很坦白：这些假设**不影响渐进结论**（asymptotic——句尾被截断的正是这个词）。' +
            '★ 这也是递归树的第一个「合法马虎」：先把 $n$ 假设成整齐的，简化算术。',
        },
        { kind: 'body', page: 97,
          en: 'What’s the height of the recursion tree? The subproblem size for a node at depth i is n/4 i . As we descend the tree from the root, the subproblem size hits n = 1 when n/4 i = 1 or, equivalently, when i = log 4 n. Thus, the tree has internal nodes at depths 0,1,2,…; log 4 n − 1 and leaves at depth log 4 n.',
          zh:
            '树高 $\\log_4 n$：规模每层除以 4，除到 1 为止。' +
            '★ 内部结点在深度 $0 \\dots \\log_4 n - 1$，叶子在深度 $\\log_4 n$——' +
            '「内部」与「叶子」要分开算，这是图 4.1(d) 的关键结构。',
        },
        { kind: 'body', page: 97,
          en: 'Part (d) of Figure 4.1 shows the cost at each level of the tree. Each level has three times as many nodes as the level above, and s o the number of nodes at depth i is 3 i . Because subproblem sizes reduce by a factor of 4 for each level further from the root, each internal node at depth i = 0,1,2,…; log 4 n − 1 has a cost of c(n/4 i ) 2 . Multiplying, we see that the total cost of all no des at a given depth i is 3 i c(n/4 i ) 2 = .3/16/ i cn 2 . The bottom level, at depth log 4 n, contains 3 log 4 n = n log 4 3 l',
          zh:
            '★ 本节最核心的一行算式：**第 $i$ 层合计 $= 3^i \\cdot c(n/4^i)^2 = (3/16)^i cn^2$**。' +
            '结点数乘 3、单结点代价除 16——净效果是每层乘 $3/16$。' +
            '（式中的 `.3/16/` 与 `C` 一样是抽取残留：即 $(3/16)^i$。）' },
        { kind: 'body', page: 97,
          en: 'We’ve derived the guess of T(n) = O(n 2 ) for the original recurrence. In this example, the coefficients of cn 2 form a decreasing geometric series. By equation (A.7), the sum of these coefficients is bounded from above by the constant 16/13. Since the root’s contribution to the total cost is cn 2 , the cost of the root dominates the total cost of the tree.',
          zh:
            '★ 收口：系数 $1, \\frac{3}{16}, (\\frac{3}{16})^2, \\dots$ 是**递减几何级数**，' +
            '和不超过 $\\frac{16}{13}$——所以 $T(n) = O(n^2)$，而且**根的代价主导整棵树**。' +
            '阶段 6 的 C 程序会验证：$n=64$ 时内部合计 $5008 \\le \\frac{16}{13} \\cdot 4096 = 5041$。',
        },
        { kind: 'body', page: 98,
          en: 'Let’s find an asymptotic upper bound for another, more irregular, example. Figure 4.2 shows the recursion tree for the recurrence',
          zh:
            '第二个例子（递归式 4.14）：$T(n) = T(n/3) + T(2n/3) + \\Theta(n)$。' +
            '★ "irregular"（不规则）指的是**子问题不等分**——树会歪，' +
            '不同的根到叶路径长度不同。均匀树那套「每层乘一个公比」在这里失效，要换记账方式。' },
        { kind: 'body', page: 100,
          en: 'It’s wise to verify any bound obtained with a recursion tree by using the sub- stitution method, especially if you’ve made simplifying assumptions. But another',
          zh:
            '书上的收尾警告：递归树给的界**要回代入法验证**——尤其是做过简化假设的时候。' +
            '★ 本关的两个猜测（$O(n^2)$ 与 $O(n \\lg n)$）在阶段 8 里都会走一遍这个流程。' },
      ],
      terms: [
        { en: 'recursion tree', zh: '递归树：递归式展开成的成本树', page: 95 },
        { en: 'per-level costs', zh: '每层代价：同一层所有结点的代价之和', page: 95 },
        { en: 'unbalanced', zh: '不均衡：子问题不等分，树会歪（图 4.2）', page: 98 },
        { en: 'leaves', zh: '叶子：递归的底，规模 $< n_0$，代价 $\\Theta(1)$', page: 97 },
      ],
    },

    // ——— 阶段 4 递归式精读 ———————————————————————————————————————
    // 本节没有算法伪代码；要读懂的是两条递归式本身。
    {
      type: 'pseudocode',
      title: '把两条递归式读成树的语言',
      algo: 'RECURRENCES',
      signature: 'T(n) = 3T(n/4) + cn²   |   T(n) = T(n/3) + T(2n/3) + cn',
      page: 95,
      lines: [
        { n: 1, code: 'T(n) = 3·T(n/4) + c·n²', zh: '主例（递归式 4.13）：3 个子问题、每个规模 n/4；合并花 cn²。树就是把右边的 3 画成三个孩子，把 cn² 标在父亲身上。' },
        { n: 2, code: 'T(n) = T(n/3) + T(2n/3) + c·n', zh: '不规则例（递归式 4.14）：两个子问题**不等分**——往左 1/3、往右 2/3，树会歪。每层的合计恰好仍是 cn。' },
        { n: 3, code: 'T(n₀) = Θ(1)   (n < n₀)', zh: '递归的底：规模小到 n₀ 就直接算。树上对应的叶子，代价 Θ(1)。' },
      ],
      vars: [
        { name: 'c', meaning: 'Θ 项里隐藏的上界常数（树上每个结点的代价系数）' },
        { name: 'n₀', meaning: '阈值常数：规模小于它就作为叶子直接算' },
        { name: 'log₄ n', meaning: '主例的树高（内部结点在深度 0…log₄n−1）' },
      ],
      note:
        '★ 读递归式的三个问题，正好对应树的三个量：**分成几份**（结点的孩子数）、' +
        '**每份多大**（树高）、**合并花多少**（结点上的代价）。' +
        '阶段 5 的两棵树就是按这三个问题长出来的。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '两本成本账：均匀树 vs 歪树',
      viz: 'tree',
      trees: [...FIG41, ...FIG42],
      treeNotes: [
        '【例 1 · 图 4.1(a)】根结点：整棵树的代价 $T(n)$，本层代价 $cn^2$——由 **combine** 产生。' +
          '取 $n = 64 = 4^3$ 让树画得出来（书上的图是符号形式，一一对应）。',
        '【例 1 · (b)】展开一层：3 个子问题，各 $T(n/4)$。本层合计 $3 \\cdot c(n/4)^2 = \\frac{3}{16}cn^2$ ' +
          '—— **只有上一层的 3/16**。这个 3/16 = 结点数 ÷ 缩小倍数的平方。',
        '【例 1 · (c)】再展开：$9 = 3^2$ 个 $T(n/16)$，本层合计 $(\\frac{3}{16})^2 cn^2$。' +
          '每往下一层乘一次 $3/16$ —— **几何衰减**。',
        '【例 1 · (d)】子问题规模 $n/64$。按这个节奏，$n/4^i = 1$ 在 $i = \\log_4 n$ 时发生——树高 $\\log_4 n$。',
        '【例 1 · 到底】最底层是叶子：$3^{\\log_4 n} = n^{\\log_4 3} \\approx n^{0.79}$ 个，每个 $\\Theta(1)$。' +
          '叶子总代价 $\\Theta(n^{0.79})$ —— **比 $n^2$ 低阶**，被上面的层吞掉。',
        '【例 1 · 求和】$cn^2 + \\frac{3}{16}cn^2 + (\\frac{3}{16})^2 cn^2 + \\cdots$ 是收敛的几何级数，' +
          '上界 $\\frac{16}{13}cn^2 = O(n^2)$。$n=64$ 时实际 $5008 \\le 5041$（阶段 6 的 C 程序算的）。',
        '【例 2 · 图 4.2】换一个**不规则**的例子：$T(n) = T(n/3) + T(2n/3) + \\Theta(n)$。' +
          '往左规模变 1/3，往右变 2/3——**树会歪**。根的代价 $cn$。',
        '【例 2 · 一层】两个子问题 $T(n/3)$ 与 $T(2n/3)$：本层合计 $c(n/3) + c(2n/3) = cn$ ' +
          '—— **歪树每层的合计仍是 $n$**（虽然结点大小不一）。',
        '【例 2 · 两层】4 个子问题，合计还是 $n$。但注意有的子问题已经很小——叶子开始出现的时间不同了。',
        '【例 2 · 最重路径】高亮的路径每次都走 $2n/3$：它决定树高 $h = \\Theta(\\lg n)$。' +
          '只要这条路径还没到底，每层的合计就还是 $cn$ —— 内部结点总代价 $O(n \\lg n)$。',
        '【例 2 · 到底】叶子合计 $\\Theta(n)$（习题 4.4-2 让你用代入法证叶子数 $L(n) = \\Theta(n)$），' +
          '被内部结点的 $O(n \\lg n)$ 吞掉 → $T(n) = O(n \\lg n)$。',
      ],
      invariants: [
        { label: '例 1：每层的合计是上一层的 3/16 —— 几何衰减' },
      ],
      tasks: [
        '数一数：例 1 的帧序列里，每层合计是上一层的多少倍？这个 3/16 与「3 个子问题、每层缩小 4 倍」是什么关系？' +
          '（提示：$3 / 4^2$。）',
        '把例 1 的 3 个子问题改成 2 个或 4 个（其余不变）：公比变成多少？级数还收敛吗？' +
          '★ 公比 = 子问题数 ÷ 缩小倍数的平方——这正是 4.5 节主方法要比较的两个量。',
        '例 2 里改走「每次都取 1/3」的最轻路径：深度是多少？它和最重路径（$\\Theta(\\lg n)$）的差说明了什么？',
      ],
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '用 C 把两本账都算出来',
      intro:
        '本关没有算法，C 程序做的是**把两棵树的账逐项验证**：' +
        '例 1 的逐层代价 $n^2(3/16)^i$、内部合计 $\\le \\frac{16}{13}n^2$、叶子 27 个；' +
        '例 2 的内部总代价 $\\le n(h+1)$（$h$ 是树高）。断言失败程序立刻停。',
      pseudocodeRef: 'RECURRENCES',
      c: {
        file: 'recursion_tree_sum.c',
        code: String.raw`/* recursion_tree_sum.c -- 4.4 节的数值实验：把递归树算成账。
 *
 * 书中对应（第 4 版）：
 *   p.95-97  例 1（图 4.1）：T(n) = 3T(n/4) + n^2，逐层展开、逐层求和，
 *            几何级数（公比 3/16 < 1）收敛 -> T(n) = O(n^2)；
 *   p.98-100 例 2（图 4.2）：T(n) = T(n/3) + T(2n/3) + n，树是歪的
 *            （高度 Theta(lg n)），但**每一层的合计仍是 n**，
 *            内部结点总代价 O(n lg n)，叶子 Theta(n) -> T(n) = O(n lg n)。
 *
 * 与书中公式的对应：
 *   part 1  取 n = 64 = 4^3，树恰好 3 层就到叶（叶 27 = 3^3 个）。
 *           逐层代价 4096 / 768 / 144 = n^2 · (3/16)^i，内部合计 5008，
 *           上界 (16/13)·n^2 = 5041.2 —— 无穷几何级数的和。
 *   part 2  取 n = 81 = 3^4，沿最重的路径（每次取 2n/3）树最深，
 *           逐层合计恒为 n（二项恒等式），内部总代价 / (n lg n) -> 1/lg(3/2) ≈ 1.71。
 *
 * 书中伪代码下标从 1 开始，本实现从 0 开始，对应关系 A[i-1] <-> 书中的 A[i]。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -O0 -o recursion_tree_sum recursion_tree_sum.c
 */
#include <assert.h>
#include <math.h>
#include <stdio.h>

/* ---- 例 1：T(n) = 3T(n/4) + n^2，把每一层的合计记进 levels[] ---- */
static long level_sum[64];

static long internal_total(long n, long depth)
{
    long here = n * n;                       /* 本结点的代价 c·(size)^2，取 c = 1 */
    level_sum[depth] += here;
    if (n <= 1) {
        return here;                          /* 叶子：Theta(1)，不再展开 */
    }
    long total = here;
    for (long k = 0; k < 3; k++) {            /* 3 个子问题，规模 n/4 */
        total += internal_total(n / 4, depth + 1);
    }
    return total;
}

/* 叶子个数：3^(log_4 n) —— 原书 p.97 说它等于 n^(log_4 3) */
static long leaf_count(long n)
{
    if (n <= 1) {
        return 1;
    }
    long c = 0;
    for (long k = 0; k < 3; k++) {
        c += leaf_count(n / 4);
    }
    return c;
}

/* ---- 例 2：T(n) = T(n/3) + T(2n/3) + n，返回内部结点的总代价 ---- */
static long irregular_total(long n)
{
    if (n < 1) {
        return 0;
    }
    long here = n;                            /* 本结点代价 c·size，取 c = 1 */
    if (n == 1) {
        return here;                          /* 叶子：Theta(1) */
    }
    return here + irregular_total(n / 3) + irregular_total(2 * n / 3);
}

int main(void)
{
    /* ---- part 1: 均匀树 T(n) = 3T(n/4) + n^2，n = 64 = 4^3 ----
     * 每下一层，层合计乘 3/16（几何衰减，公比 < 1 -> 级数收敛）。 */
    const long n1 = 64;
    (void)internal_total(n1, 0);              /* 顺带把 level_sum[] 填好 */
    long leaves = leaf_count(n1);

    printf("part 1: T(n) = 3T(n/4) + n^2,  n = %ld = 4^3\n", n1);
    printf("  %-7s %-9s %-14s %-16s\n", "depth", "#nodes", "node size", "level total");
    const char *sizes[4] = { "n", "n/4", "n/16", "n/64" };
    long expect = n1 * n1;
    for (long d = 0; d <= 3; d++) {
        long nodes = 1;
        for (long k = 0; k < d; k++) nodes *= 3;
        printf("  %-7ld %-9ld %-14s %-16ld\n", d, nodes, sizes[d], level_sum[d]);
        assert(level_sum[d] == expect);       /* 层合计 = n^2 (3/16)^d */
        expect = expect * 3 / 16;             /* 下一层 = 上一层 × 3/16 */
    }
    assert(leaves == 27);                     /* 叶子数 = 3^3 = n^(log_4 3) */

    long internal = level_sum[0] + level_sum[1] + level_sum[2];
    printf("  internal total = %ld,  (16/13) n^2 = %.1f  ->  O(n^2)\n",
           internal, 16.0 / 13.0 * (double)(n1 * n1));
    assert(internal * 13 <= 16L * n1 * n1);   /* 内部合计 <= (16/13) n^2 */
    printf("  leaf total = %ld * Theta(1) = Theta(n^(log_4 3)) = Theta(n^0.79)\n\n",
           leaves);

    /* ---- part 2: 歪树 T(n) = T(n/3) + T(2n/3) + n ----
     * 每一层的合计仍是 n（二项恒等式 (1/3 + 2/3)^d = 1），
     * 内部结点总代价 = n × (内部层数) ≈ n · lg n / lg(3/2)。 */
    printf("part 2: T(n) = T(n/3) + T(2n/3) + n   (unbalanced)\n");
    printf("  %-10s %-18s %-14s %-12s\n", "n", "internal total", "height h", "total/(n(h+1))");
    for (long n = 81; n <= 729; n *= 3) {
        long total = irregular_total(n);
        /* 书上 p.99 的论证：树高 h = ceil(log_{3/2}(n/n_0))，每层合计 <= n，
         * 故内部结点总代价 <= n(h+1) = O(n lg n)。这里逐项验证这个上界。 */
        long h = 0;
        double s = (double)n;
        while (s > 1.0) {                     /* 最重的路径：每次乘 2/3 */
            s *= 2.0 / 3.0;
            h++;
        }
        long bound = n * (h + 1);
        printf("  %-10ld %-18ld %-14ld %-12.4f\n", n, total, h,
               (double)total / (double)bound);
        assert(total <= bound);               /* O(n lg n) 的上界成立 */
    }
    printf("  ->  internal cost is O(n lg n);  leaves are Theta(n)\n");
    printf("  ->  T(n) = O(n lg n) + Theta(n) = O(n lg n)\n");

    printf("\nall checks passed.\n");
    return 0;
}
`,
      },
      mapping: [
        { line: 1, c: 'part 1：level_sum[d] = 3^d · (n/4^d)² —— 第 d 层合计，即书中 (3/16)^d cn²' },
        { line: 2, c: 'part 2：irregular_total(n) = n + irregular_total(n/3) + irregular_total(2n/3)' },
        { line: 3, c: '两个例子的叶子都对应 T(n₀) = Θ(1)' },
      ],
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '两本账的结局',
      intro:
        '递归树法产出的两条结论——一条来自**收敛的几何级数**，' +
        '一条来自「每层恒定 × 对数层深」。把它们的推导并排放在一起，差别一目了然。',
      claims: [
        { expr: 'T(n) = 3T(n/4) + \\Theta(n^2) \\in O(n^2)', when: '例 1：系数成递减几何级数，和不超过 16/13', page: 97, source: 'book' },
        { expr: '\\sum_{i \\ge 0} (3/16)^i cn^2 \\le \\frac{16}{13}cn^2', when: '几何级数（公比 3/16 < 1）收敛，根的代价主导', page: 97, source: 'book' },
        { expr: '3^{\\log_4 n} = n^{\\log_4 3} \\approx n^{0.79}', when: '例 1 的叶子个数——比 n² 低阶', page: 97, source: 'book' },
        { expr: 'T(n) = T(n/3) + T(2n/3) + \\Theta(n) \\in O(n \\lg n)', when: '例 2：每层合计 cn、树高 Θ(lg n)', page: [99, 100], source: 'book' },
        { expr: 'L(n) = L(n/3) + L(2n/3) \\in \\Theta(n)', when: '例 2 的叶子数（递归式 4.15），被内部结点吞掉', page: 100, source: 'book' },
      ],
      tables: [
        {
          caption: '两种树，两种结局（本关两例的对照）',
          rows: [
            ['递归式', '3T(n/4) + cn²', 'T(n/3) + T(2n/3) + cn'],
            ['树的形状', '均匀：每结点 3 个等大的孩子', '歪：两支不等分（1/3 与 2/3）'],
            ['每层合计', 'cn²·(3/16)^i —— 几何衰减', '恒为 cn —— 不衰减'],
            ['树高', 'log₄n', 'Θ(lg n)（最重路径决定）'],
            ['结局', '级数收敛 → O(n²)，根主导', 'n × Θ(lg n) → O(n lg n)，层数主导'],
          ],
        },
        {
          caption: '★ 把例 1 与主方法的「三种情况」对上号（4.5 节预告）',
          rows: [
            ['a = 3（子问题数）', 'b = 4（缩小倍数）', 'n^(log_b a) = n^(log₄3) ≈ n^0.79'],
            ['f(n) = n²', '比 n^0.79 高一阶', 'f(n) 压过叶子项'],
            ['结论', 'T(n) = Θ(n²) —— 根主导', '这就是主方法的**情况 3**'],
          ],
        },
      ],
      chart: {
        xMax: 64,
        series: [
          { name: 'n²', expr: 'n * n', color: '--viz-active' },
          { name: 'n lg n', expr: 'n * Math.log2(n)', color: '--viz-compare' },
          { name: 'n^0.79（叶子）', expr: 'Math.pow(n, 0.79)', color: '--viz-result' },
          { name: 'n', expr: 'n', color: '--viz-idle' },
        ],
      },
      derivations: [
        {
          kind: 'summation',
          title: '例 1 的几何级数（原书 p.97，附录 A.7）',
          steps: [
            { tex: '\\sum_{i=0}^{\\log_4 n} \\left(\\frac{3}{16}\\right)^i cn^2 < \\frac{1}{1-3/16} cn^2 = \\frac{16}{13}cn^2', zh: '公比 3/16 < 1，级数收敛；16/13 ≈ 1.23。' },
            { tex: '\\Rightarrow T(n) \\le \\frac{16}{13}cn^2 + \\Theta(n^{\\log_4 3}) = O(n^2)', zh: '叶子项 n^0.79 比根的 n² 低阶——根主导。' },
          ],
        },
        {
          kind: 'summation',
          title: '例 2 为什么每层合计恒为 n',
          steps: [
            { tex: '\\text{深度 } d \\text{ 的所有子问题互不重叠、并起来恰是 } A[1 : n]', zh: '分治把原数组**不重不漏**地切成了深度 d 的若干段——所以各段大小之和恒等于 n。' },
            { tex: '\\sum_{\\text{depth } d} s_i = n \\Rightarrow \\text{每层合计} = cn', zh: '因此不管树怎么歪，每一层的合计都是 cn；歪只影响树高。' },
            { tex: 'h = \\Theta(\\lg n) \\Rightarrow T(n) \\le cn(h+1) = O(n \\lg n)', zh: '层数由最重路径决定；叶子 Θ(n) 被吞掉。' },
          ],
        },
      ],
      note:
        '★ 两例合起来就是递归树法的全部直觉：**看每层合计是衰减、恒定还是增长**。' +
        '4.5 节的主方法把这三个结局编成三种情况，查表即可。',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    // 树给猜测，代入法盖章——书上的原话就是本关的「证明」。
    {
      type: 'prove',
      title: '猜测要盖章：回到代入法',
      statement:
        'Let’s now use the substitution method to verify that our guess is correct, namely, that T(n) = O(n 2 ) is an upper bound for the recurrence T(n) = 3T(n/4) + Θ(n 2 ).',
      page: 98,
      intro:
        '递归树给了猜测 $T(n) = O(n^2)$。书上紧接着用代入法验证——' +
        '注意书上特意指出一个细节：树里我们已经用过常数 $c$，' +
        '验证时要**换一个新常数 $d$**，两者不能混用。下面三步走完整个归纳。',
      steps: [
        {
          title: '第一步 · 归纳假设',
          en: 'We want to show that T(n) ≤ dn 2 for some constant d > 0. Using the same constant c>0 as before, we have',
          page: 98,
          body: [
            '要证的是 $T(n) \\le dn^2$。注意 $d$ 是**新起的名字**——它不是树上的那个 $c$。' +
            '书上随后会专门解释为什么必须分开（见第三步之后的引文）。',
            '把递归式右边展开：$T(n) \\le 3T(n/4) + cn^2$，' +
            '再对三个子问题套归纳假设 $T(n/4) \\le d(n/4)^2$。',
          ],
        },
        {
          title: '第二步 · 为什么 c 与 d 必须分开',
          en: 'The substitution proof we just saw involves two named constants, c and d . We named c and used it to stand for the upper-bound constant hidden and guaranteed to exist by the Θ-notation. We cannot pick c arbitrarily—it’s given to us—although, for any such c , any constant c 0 ≥ c also suffices. We also named d , but we were free to choose any value for it that fit our needs.',
          page: 98,
          body: [
            '★ 书上这段是在教「证明的记账规矩」：' +
            '$c$ 是 $\\Theta$ 项**送给你的**（不能挑），$d$ 是**你自己选的**（可以挑大到够用）。',
            '代数上这一步是：$3d(n/4)^2 + cn^2 = \\frac{3}{16}dn^2 + cn^2 \\le dn^2$，' +
            '只要 $d \\ge \\frac{16}{13}c$。$\\frac{3}{16} < 1$ 正是递归树里那个几何衰减比——' +
            '树与代入法在这里是同一件事的两种写法。',
          ],
        },
        {
          title: '第三步 · 基例收口',
          en: 'For the base case of the induction, let n 0 > 0 be a sufficiently large threshold constant that the recurrence is well defined when T(n) = Θ(1) for n < n 0 . We can pick d large enough that d dominates the constant hidden by the Θ, in which case dn 2 ≥ d ≥ T(n) for 1 ≤ n<n 0 , completing the proof of the base case.',
          page: 98,
          body: [
            '归纳的底：$1 \\le n < n_0$ 时 $T(n) = \\Theta(1)$ 是有限个常数，' +
            '把 $d$ 选得足够大就能盖住它们。',
            '★ 至此 $T(n) = O(n^2)$ 验证完毕。书上还指出它其实是**紧**的：' +
            '第一次递归调用本身就贡献了 $\\Theta(n^2)$，所以 $\\Omega(n^2)$ 自动成立。',
          ],
        },
      ],
      conclusion:
        '递归树给猜测、代入法盖章——**两件工具是一套流程的两半**。' +
        '书上在本节末尾的忠告（p.100）：做过简化假设的树，尤其要回去验证。' +
        '下一关 4.5 会看到：对 $T(n) = aT(n/b) + f(n)$ 这种标准形状，' +
        '「逐层求和」的三种结局已经被整理成查表公式——主方法。',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        {
          kind: 'single',
          q: '递归式 T(n) = 3T(n/4) + cn² 的递归树中，深度 i 那一层的合计代价是？',
          options: ['3^i · c(n/4^i)² = (3/16)^i cn²', '3^i · cn²', 'c(n/4^i)²', '(4/3)^i cn²'],
          answer: 0,
          why:
            '深度 $i$ 有 $3^i$ 个结点，每个代价 $c(n/4^i)^2$，乘起来 $= (3/16)^i cn^2$（p.97 原话）。' +
            '★ 记忆法：结点数在涨（×3）、单结点代价在跌（÷16），净效果每层 ×3/16。',
        },
        {
          kind: 'single',
          q: '例 1 的递归树里，叶子的个数是？',
          options: ['3^{log₄n} = n^(log₄3)', '4^{log₄n} = n', 'n²', 'log₄n'],
          answer: 0,
          why:
            '每个结点 3 个孩子、深 $\\log_4 n$ 层，叶子 $3^{\\log_4 n} = n^{\\log_4 3} \\approx n^{0.79}$（p.97）。' +
            '★ 叶子总代价 $\\Theta(n^{0.79})$ 比 $n^2$ 低阶——被上层吞掉。',
        },
        {
          kind: 'judge',
          q: '例 1 中，深度越大的层，其合计代价越大。',
          answer: false,
          why:
            '反了。层合计是 $(3/16)^i cn^2$，随深度**递减**（公比 3/16 < 1）。' +
            '所以是根那一层最贵、叶子那一层最便宜——结论 $O(n^2)$ 由**根主导**（书上原话：' +
            '"the cost of the root dominates the total cost of the tree"）。',
        },
        {
          kind: 'single',
          q: '例 2（T(n) = T(n/3) + T(2n/3) + cn）的递归树中，深度 d 那一层的合计代价是？',
          options: ['cn·(5/6)^d', '恒为 cn', 'cn·(2/3)^d', '(4/3)^d cn'],
          answer: 1,
          why:
            '恒为 $cn$。深度 $d$ 的结点大小是 $(1/3)^a(2/3)^{d-a}n$ 的各种组合，' +
            '由二项式定理加起来恰是 $n$（阶段 6 的 C 程序逐层验证过）。',
        },
        {
          kind: 'judge',
          q: '例 2 的递归树是均衡的：每个结点的孩子大小相同。',
          answer: false,
          why:
            '错。书上称之为 "irregular"（不规则）：往左规模变 1/3、往右变 2/3，' +
            '不同的根到叶路径长度不同（p.98）。正因如此，树高要按**最重路径**算：$\\Theta(\\lg n)$。',
        },
        {
          kind: 'single',
          q: '例 2 中，递归树的高度由什么决定？',
          options: ['最轻的路径（每次走 1/3）', '最重的路径（每次走 2/3）', '结点的总数', 'cn 项的大小'],
          answer: 1,
          why:
            '树高 = 最深的根到叶路径 = 每次都走 $2n/3$ 的那条，高度 $\\Theta(\\lg n)$' +
            '（$\\log_{3/2} n$，p.99）。阶段 5 例 2 的最后一帧把这条路径高亮了出来。',
        },
        {
          kind: 'judge',
          q: '递归树给出的界可以直接当作最终答案，不需要再用代入法验证。',
          answer: false,
          why:
            '错。书上 p.100 的忠告："It\'s wise to verify any bound obtained with a recursion ' +
            'tree by using the substitution method"——尤其做过简化假设时。' +
            '★ 递归树的正确定位：产生猜测（可以马虎），验证交给代入法（必须精确）。',
        },
        {
          kind: 'simulate',
          q: '例 1 取 n = 64、c = 1：内部结点（不含叶子）的代价总计是多少？（填一个数字）',
          expect: [5008],
          placeholder: '例如：4096',
          why:
            '逐层是 $4096 + 768 + 144 = 5008$（叶子那层 27 个 $\\Theta(1)$ 不算内部结点）。' +
            '上界 $\\frac{16}{13} \\times 4096 = 5041.2$——$5008 \\le 5041$ ✓（阶段 6 的 C 程序断言过）。' +
            '★ $\\frac{16}{13}$ 来自几何级数 $\\sum (3/16)^i = 16/13$。',
        },
      ],
      bookExercises: [
        { id: '4.4-1', page: 101, star: 0,
          statement: 'For each of the following recurrences, sketch its recursion tree, and guess a good asymptotic upper bound on its solution. Then use the substitution method to verify your answer. a. T(n) = T(n/2) + n 3 . b. T(n) = 4T(n/3) + n. c. T(n) = 4T(n/2) + n. d. T(n) = 3T(n − 1) + 1.',
          hint: '四个递归式各画一棵树，重点看「每层合计」是涨是衰：(a) $T(n)=T(n/2)+n^3$ 每层按 $1/8$ 几何衰减（只有一个孩子，代价除以 8），所以总和是 $\\Theta(n^3)$ —— **不是** $n^3\\lg n$；(b) $4T(n/3)+n$ 的叶子合计涨到 $n^{\\log_3 4}$，比 $n$ 快 → $\\Theta(n^{\\log_3 4})$；(c) $4T(n/2)+n$ 每层合计乘 2，由叶子主导 → $\\Theta(n^2)$；(d) $3T(n-1)+1$ 每层乘 3、深度为 $n$ → $\\Theta(3^n)$。猜完还要按题目要求用代入法验证。' },
        { id: '4.4-2', page: 101, star: 0,
          statement: 'Use the substitution method to prove that recurrence (4.15) has the asymptotic lower bound L(n) = Ω(n). Conclude that L(n) = Θ(n).',
          hint: '递归式 (4.15) 是叶子计数：L(n) = L(n/3) + L(2n/3)。' +
                '书上 p.100 已经给出上界 L(n) ≤ dn；下界换个方向放缩（叶子数不会比 n 少）即可。' },
        { id: '4.4-3', page: 101, star: 0,
          statement: 'Use the substitution method to prove that recurrence (4.14) has the solution T(n) = Ω(n lg n). Conclude that T(n) = Θ(n lg n).',
          hint: '要证的是**下界**，别把不等号方向抄反：假设 $T(m)\\ge d\\,m\\lg m$（$m<n$）代回 $T(n)=T(n/3)+T(2n/3)+cn$，得 $d\\,n\\lg n-d\\,n\\left[\\tfrac{1}{3}\\lg 3+\\tfrac{2}{3}\\lg(3/2)\\right]+cn$，方括号里约 $0.918$，取 $d$ 不超过 $c/0.918$ 就能收下。书上 p.100 那句 postpone dealing with the leaves 是说：先把充分大的 $n$ 证完，叶子那一段再单独兜。' },
        { id: '4.4-4', page: 101, star: 0,
          statement: 'Use a recursion tree to justify a good guess for the solution to the recurrence T(n) = T.˛n/ CT..1 −˛/n/CΘ(n), where ˛ is a constant in the range 0<˛<1 .',
          hint: '先画三层，把每层合计写成 (公比)^i 的形式，再看公比与 1 的大小：' +
                '小于 1 则根主导，等于 1 则每层平摊，大于 1 则叶子主导。' },
      ],
    },
  ],
};
